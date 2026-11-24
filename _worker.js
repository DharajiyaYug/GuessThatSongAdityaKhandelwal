// Cloudflare Pages advanced-mode worker: serves the static site and a tiny community-stats API.
//   GET  /api/stats/<spotifyTrackId>          -> { played, solved, s0..s6, x, total_ms }  (s0..s4 = 0.5/1/3/8/15s, s5 = 0.1s, s6 = 0.2s)
//   POST /api/stats  { id, won, clip, ms }  (clip = clip length in ms that solved it)   -> records one finished round, returns updated stats
// Needs a D1 database bound as "DB" with the table created by schema.sql.
const ID = /^[A-Za-z0-9]{22}$/;
const COL = { 100: 's5', 200: 's6', 500: 's0', 1000: 's1', 3000: 's2', 8000: 's3', 15000: 's4' };
const OLD = ['s0', 's1', 's2', 's3', 's4']; // older clients send a stage index 0..4
const EMPTY = { played: 0, solved: 0, s0: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, s6: 0, x: 0, total_ms: 0 };

const json = (obj, status = 200, cache = 'no-store') => new Response(JSON.stringify(obj), {
  status, headers: { 'content-type': 'application/json', 'cache-control': cache },
});

async function getStats(db, id) {
  const row = await db.prepare('SELECT played, solved, s0, s1, s2, s3, s4, s5, s6, x, total_ms FROM song_stats WHERE id = ?').bind(id).first();
  return Object.assign({ id }, EMPTY, row || {});
}

/* ---------- players, game modes & leaderboards ----------
   pid  = random id kept in the player's browser (never shown to others)
   name = unique display name (case-insensitive); Spotify-connected players use their Spotify name
   A game = rounds until the player runs out of strikes: easy 5 misses, medium 3, hard 1 (no strikes).
   The server keeps each player's running game itself, so scores can't simply be posted. */
const PID = /^[A-Za-z0-9-]{16,64}$/;
const MODES = { easy: 5, medium: 3, hard: 1 };
// difficulty rises every 5 correct songs in a game; harder levels pay more (same table as js/game.js)
const LEVEL_MULT = [1, 1.25, 1.5, 1.75, 2];
const levelOf = (solved) => Math.min(LEVEL_MULT.length - 1, Math.floor(solved / 5));
const cleanName = (n) => String(n || '').normalize('NFC').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
const nameKey = (n) => cleanName(n).toLowerCase();
async function body(request) { try { return await request.json(); } catch (e) { return null; } }

async function savePlayer(db, request) {
  const b = await body(request);
  if (!b || !PID.test(String(b.pid || ''))) return json({ error: 'bad input' }, 400);
  const name = cleanName(b.name);
  if (name.length < 2) return json({ error: 'Name must be at least 2 characters' }, 400);
  const owner = await db.prepare('SELECT pid FROM players WHERE name_key = ?').bind(nameKey(name)).first();
  if (owner && owner.pid !== b.pid) return json({ error: 'That name is taken — try another' }, 409);
  await db.prepare(`INSERT INTO players (pid, name, name_key, spotify) VALUES (?, ?, ?, ?)
    ON CONFLICT(pid) DO UPDATE SET name = excluded.name, name_key = excluded.name_key, spotify = excluded.spotify`)
    .bind(b.pid, name, nameKey(name), b.spotify ? 1 : 0).run();
  return json({ ok: true, name });
}

// POST { pid, mode, won, pts, fresh }  (fresh = first round of a new game)
async function saveRound(db, request) {
  const b = await body(request);
  if (!b || !PID.test(String(b.pid || '')) || !MODES[b.mode]) return json({ error: 'bad input' }, 400);
  // one row per player per mode holds everything, so a round costs a single row write here
  let g = await db.prepare('SELECT s.*, p.pid AS known FROM players p LEFT JOIN scores s ON s.pid = p.pid AND s.mode = ? WHERE p.pid = ?').bind(b.mode, b.pid).first();
  if (!g) return json({ error: 'unknown player' }, 404);
  const now = Date.now();
  if (now - (g.updated || 0) < 1000) return json({ error: 'too fast' }, 429);
  if (g.mode == null) g = { cur_score: 0, cur_streak: 0, cur_solved: 0, strikes: 0, best_score: 0, best_streak: 0, games: 0, points: 0, solved: 0, played: 0 };
  if (b.fresh === true && (g.cur_score || g.strikes || g.cur_streak || g.cur_solved)) { g.cur_score = 0; g.cur_streak = 0; g.cur_solved = 0; g.strikes = 0; }
  const won = b.won === true;
  const pts = won ? Math.max(0, Math.min(Math.floor(Number(b.pts) || 0), Math.round((150 + 10 * g.cur_streak) * LEVEL_MULT[levelOf(g.cur_solved)]))) : 0;
  g.played += 1;
  if (won) { g.cur_score += pts; g.cur_streak += 1; g.cur_solved += 1; g.points += pts; g.solved += 1; } else { g.cur_streak = 0; g.strikes += 1; }
  g.best_score = Math.max(g.best_score, g.cur_score);
  g.best_streak = Math.max(g.best_streak, g.cur_streak);
  const over = g.strikes >= MODES[b.mode];
  const result = { ok: true, pts, level: levelOf(g.cur_solved) + 1, score: g.cur_score, streak: g.cur_streak, strikes: g.strikes, over, best_score: g.best_score, best_streak: g.best_streak };
  if (over) { g.games += 1; g.cur_score = 0; g.cur_streak = 0; g.cur_solved = 0; g.strikes = 0; }
  await db.prepare(`INSERT INTO scores (pid, mode, cur_score, cur_streak, cur_solved, strikes, best_score, best_streak, games, points, solved, played, updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(pid, mode) DO UPDATE SET cur_score = excluded.cur_score, cur_streak = excluded.cur_streak, cur_solved = excluded.cur_solved,
      strikes = excluded.strikes, best_score = excluded.best_score, best_streak = excluded.best_streak, games = excluded.games,
      points = excluded.points, solved = excluded.solved, played = excluded.played, updated = excluded.updated`)
    .bind(b.pid, b.mode, g.cur_score, g.cur_streak, g.cur_solved, g.strikes, g.best_score, g.best_streak, g.games, g.points, g.solved, g.played, now).run();
  return json(result);
}

// GET ?mode=easy|medium|hard&by=score|streak   or   ?by=points (all modes)
async function leaderboard(db, url) {
  const pid = url.searchParams.get('pid') || '';
  const by = url.searchParams.get('by');
  let top, me = null, total;
  if (by === 'points') {
    const all = `SELECT s.pid, p.name, p.spotify, SUM(s.points) AS value, SUM(s.solved) AS solved, SUM(s.played) AS played
      FROM scores s JOIN players p ON p.pid = s.pid GROUP BY s.pid HAVING SUM(s.played) > 0`;
    top = (await db.prepare(`SELECT name, spotify, value, solved, played FROM (${all}) ORDER BY value DESC, solved DESC LIMIT 50`).all()).results;
    total = (await db.prepare(`SELECT COUNT(*) AS n FROM (${all})`).first()).n;
    if (PID.test(pid)) {
      const p = await db.prepare(`SELECT name, value FROM (${all}) WHERE pid = ?`).bind(pid).first();
      if (p) me = Object.assign(p, { rank: 1 + (await db.prepare(`SELECT COUNT(*) AS n FROM (${all}) WHERE value > ?`).bind(p.value).first()).n });
    }
  } else {
    const mode = MODES[url.searchParams.get('mode')] ? url.searchParams.get('mode') : 'easy';
    const col = by === 'streak' ? 'best_streak' : 'best_score';
    top = (await db.prepare(`SELECT p.name, p.spotify, s.${col} AS value, s.best_score, s.best_streak, s.games FROM scores s JOIN players p ON p.pid = s.pid
      WHERE s.mode = ? AND s.${col} > 0 ORDER BY s.${col} DESC, s.games ASC LIMIT 50`).bind(mode).all()).results;
    total = (await db.prepare(`SELECT COUNT(*) AS n FROM scores WHERE mode = ? AND ${col} > 0`).bind(mode).first()).n;
    if (PID.test(pid)) {
      const p = await db.prepare(`SELECT p.name, s.${col} AS value FROM scores s JOIN players p ON p.pid = s.pid WHERE s.pid = ? AND s.mode = ?`).bind(pid, mode).first();
      if (p && p.value > 0) me = Object.assign(p, { rank: 1 + (await db.prepare(`SELECT COUNT(*) AS n FROM scores WHERE mode = ? AND ${col} > ?`).bind(mode, p.value).first()).n });
    }
  }
  return json({ top, me, players: total });
}

/* ---------- self-tuning: which songs / clip lines are hard, which songs don't play ----------
   Recomputed at most every 15 minutes and kept as one cached row, so visitors cost a single row read. */
const FAST = new Set(['s5', 's6', 's0', 's1', 's2']); // solved with 0.1 / 0.2 / 0.5 / 1 / 3 s
async function report(db, request) {
  const b = await body(request);
  const id = String((b && b.id) || '');
  if (!ID.test(id) || b.what !== 'unplayable') return json({ error: 'bad input' }, 400);
  await db.prepare(`INSERT INTO song_stats (id, bad) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET bad = bad + 1`).bind(id).run();
  return json({ ok: true });
}
async function tuning(db) {
  const now = Date.now();
  const row = await db.prepare("SELECT v, t FROM meta WHERE k = 'tuning'").first();
  if (row && now - row.t < 15 * 60 * 1000) return json(JSON.parse(row.v), 200, 'public, max-age=600');
  const songs = (await db.prepare('SELECT id, played, solved, s5, s6, s0, s1, s2, bad FROM song_stats WHERE played >= 4 OR bad > 0').all()).results;
  const cues = (await db.prepare('SELECT id, cue, played, fast FROM cue_stats WHERE played >= 3').all()).results;
  const badCues = {};
  cues.forEach((c) => { if (c.fast / c.played < 0.34) (badCues[c.id] = badCues[c.id] || []).push(c.cue); });
  const out = { t: now, w: {}, x: [], c: badCues };
  songs.forEach((s) => {
    if (s.bad >= 2 && s.solved === 0) { out.x.push(s.id); return; }      // reported as not playing, never solved
    if (s.played < 4) return;
    const fast = (s.s5 + s.s6 + s.s0 + s.s1 + s.s2) / s.played;          // share guessed within 3 s
    const w = Math.max(0.1, Math.min(1, 0.2 + 1.6 * fast));
    if (w < 1) out.w[s.id] = Math.round(w * 100) / 100;
  });
  await db.prepare("INSERT INTO meta (k, v, t) VALUES ('tuning', ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, t = excluded.t").bind(JSON.stringify(out), now).run();
  return json(out, 200, 'public, max-age=600');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!env.DB) return json({ error: 'community stats are not set up' }, 503);
    try {
      if (url.pathname === '/api/player' && request.method === 'POST') return await savePlayer(env.DB, request);
      if (url.pathname === '/api/round' && request.method === 'POST') return await saveRound(env.DB, request);
      if (url.pathname === '/api/leaderboard') return await leaderboard(env.DB, url);
      if (url.pathname === '/api/tuning') return await tuning(env.DB);
      if (url.pathname === '/api/report' && request.method === 'POST') return await report(env.DB, request);
      if (!url.pathname.startsWith('/api/stats')) return json({ error: 'not found' }, 404);
      if (request.method === 'GET') {
        const id = url.pathname.split('/')[3] || url.searchParams.get('id') || '';
        if (!ID.test(id)) return json({ error: 'bad id' }, 400);
        return json(await getStats(env.DB, id));
      }
      if (request.method === 'POST') {
        let b;
        try { b = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
        const id = String(b.id || '');
        const won = b.won === true;
        const solvedCol = COL[Number(b.clip)] || (b.clip === undefined ? OLD[Number(b.stage)] : undefined);
        const ms = Math.max(0, Math.min(600000, Math.round(Number(b.ms) || 0)));
        if (!ID.test(id) || (won && !solvedCol)) return json({ error: 'bad input' }, 400);
        const col = won ? solvedCol : 'x'; // only ever one of the fixed column names above
        await env.DB.prepare(
          `INSERT INTO song_stats (id, played, solved, ${col}, total_ms) VALUES (?, 1, ?, 1, ?)
           ON CONFLICT(id) DO UPDATE SET played = played + 1, solved = solved + excluded.solved,
           ${col} = ${col} + 1, total_ms = total_ms + excluded.total_ms`
        ).bind(id, won ? 1 : 0, won ? ms : 0).run();
        // which clip line was used, and was it guessed quickly (3 s clip or shorter)?
        const cue = Number(b.cue);
        if (Number.isInteger(cue) && cue >= 0 && cue < 12) {
          const fast = won && FAST.has(solvedCol) ? 1 : 0;
          await env.DB.prepare(`INSERT INTO cue_stats (id, cue, played, fast) VALUES (?, ?, 1, ?)
            ON CONFLICT(id, cue) DO UPDATE SET played = played + 1, fast = fast + excluded.fast`).bind(id, cue, fast).run();
        }
        return json(await getStats(env.DB, id));
      }
      return json({ error: 'method not allowed' }, 405);
    } catch (e) {
      return json({ error: 'stats unavailable' }, 500);
    }
  },
};
