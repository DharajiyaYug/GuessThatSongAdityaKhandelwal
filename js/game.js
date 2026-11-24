/* Game controller */
(function () {
  const SG = window.SG;
  const $ = (id) => document.getElementById(id);
  const CLIPS = [100, 200, 500, 1000, 3000, 8000, 15000];
  const POINTS = [150, 125, 100, 80, 60, 40, 20];
  const SCALE = 15000;
  // tougher as you go: every 5 correct songs in a game the longest clips disappear; from level 3 any line of the song can be the clip
  const LEVELS = [
    { max: 6, mult: 1, any: false, note: 'clips up to 15 s' },
    { max: 5, mult: 1.25, any: false, note: 'clips now stop at 8 s' },
    { max: 4, mult: 1.5, any: true, note: 'clips stop at 3 s and can be any line' },
    { max: 3, mult: 1.75, any: true, note: 'clips stop at 1 s' },
    { max: 2, mult: 2, any: true, note: 'clips stop at 0.5 s — good luck' },
  ];
  const levelOf = (solved) => Math.min(LEVELS.length - 1, Math.floor(solved / 5));
  const MODES = { easy: { lives: 5, label: 'Easy' }, medium: { lives: 3, label: 'Medium' }, hard: { lives: 1, label: 'Hard' } };
  // linear progress bar: position is proportional to time
  const pos = (ms) => Math.max(0, Math.min(100, (ms / SCALE) * 100));
  // community-stats column for each clip length (s0..s4 = old 0.5–15s columns, s5/s6 = 0.1s/0.2s)
  const COL = { 100: 's5', 200: 's6', 500: 's0', 1000: 's1', 3000: 's2', 8000: 's3', 15000: 's4' };

  const st = {
    lib: null, songs: [], filters: SG.store.get('filters', { lang: 'both', eras: [], genres: [] }),
    played: new Set(SG.store.get('played', [])),
    score: 0, streak: 0, round: 0, mode: MODES[SG.store.get('mode', 'easy')] ? SG.store.get('mode', 'easy') : 'easy', strikes: 0, solved: 0, fresh: true, gameOver: false, next: null, practice: !!SG.store.get('practice', false), preview: false,
    stage: 0, song: null, over: false, busy: false, loading: false, guesses: [], cue: null, roundStart: 0,
  };

  /* ---------- random recognisable line for this round ---------- */
  /* ---------- learning from everyone's results (server: /api/tuning) ----------
     w: songs that are rarely guessed within 3 s get picked less often (weight 0.1–1)
     c: clip lines that people keep missing are retired, so another line of the song is tried
     x: songs reported as not playing on Spotify are skipped */
  let tune = { w: {}, c: {}, x: [] };
  let tuneX = new Set();
  function loadTuning() {
    fetch('api/tuning').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.w) { tune = j; tuneX = new Set(j.x || []); } }).catch(() => {});
  }
  const songWeight = (s) => tuneX.has(s.id) ? 0 : (tune.w[s.id] != null ? tune.w[s.id] : 1);
  function pickCue(s, anyLine) {
    const cues = (s.cues && s.cues.length) ? s.cues : [[s.hookMs || 0, s.hookLine || '']];
    const retired = new Set((tune.c && tune.c[s.id]) || []);
    let idx = cues.map((c, i) => i).filter((i) => !retired.has(i));
    if (!idx.length) idx = cues.map((c, i) => i);            // every line retired: fall back to all of them
    if (anyLine && idx.length > 1) idx = idx.filter((i) => i !== 0);
    // the main hook (index 0) is twice as likely as any other line
    const bag = [];
    idx.forEach((i) => { bag.push(i); if (i === 0) bag.push(i); });
    const i = bag[Math.floor(Math.random() * bag.length)];
    return [cues[i][0], cues[i][1], i];
  }

  /* ---------- stats (kept in this browser) ---------- */
  const blankStats = () => ({ played: 0, won: 0, points: 0, bestStreak: 0, byStage: [0, 0, 0, 0, 0, 0, 0], lost: 0, gaveUp: 0, timeMs: 0,
    lang: {}, era: {}, genre: {}, recent: [] });
  let stats = Object.assign(blankStats(), SG.store.get('stats', {}));
  if (stats.byStage.length === 5) { // older stats: add the new 0.1s / 0.2s slots at the front
    stats.byStage = [0, 0].concat(stats.byStage);
    stats.recent.forEach((r) => { if (r.st >= 0) r.st += 2; });
    SG.store.set('stats', stats);
  }
  function bump(map, k, won) { if (!k) return; const o = map[k] || (map[k] = { p: 0, w: 0 }); o.p++; if (won) o.w++; }
  function recordRound(won, how) {
    const s = st.song; if (!s) return;
    stats.played++;
    if (won) { stats.won++; stats.byStage[st.stage]++; stats.points += st.lastPoints || 0; stats.timeMs += Date.now() - st.roundStart; }
    else if (how === 'gaveup') stats.gaveUp++; else stats.lost++;
    stats.bestStreak = Math.max(stats.bestStreak, st.streak);
    bump(stats.lang, s.lang, won); bump(stats.era, s._era, won);
    (s.genres || []).forEach((g) => bump(stats.genre, g, won));
    stats.recent.unshift({ id: s.id, t: s.title, m: s.movie, won, st: won ? st.stage : -1, at: Date.now() });
    stats.recent = stats.recent.slice(0, 30);
    SG.store.set('stats', stats);
  }
  const gkey = () => st.mode + (st.practice ? '_p' : '');
  const high = () => SG.store.get('high_' + gkey(), 0);
  function resetGame() { st.score = 0; st.streak = 0; st.strikes = 0; st.solved = 0; st.gameOver = false; st.fresh = true; st.song = null; st.over = false; }
  const level = () => levelOf(st.solved);
  const maxStage = () => st.practice ? CLIPS.length - 1 : LEVELS[level()].max;

  /* ---------- the game survives closing the browser (one saved game per mode) ---------- */
  function saveGame() {
    SG.store.set('game_' + gkey(), {
      score: st.score, streak: st.streak, strikes: st.strikes, solved: st.solved, fresh: st.fresh, gameOver: st.gameOver, round: st.round,
      song: st.song && !st.over ? { id: st.song.id, stage: st.stage, guesses: st.guesses, cue: st.cue, start: st.roundStart } : null,
    });
  }
  function loadGame() {
    const g = SG.store.get('game_' + gkey(), null);
    resetGame();
    if (!g || g.gameOver) return null;
    Object.assign(st, { score: g.score || 0, streak: g.streak || 0, strikes: g.strikes || 0, solved: g.solved || 0, fresh: !!g.fresh, round: g.round || 0 });
    return g.song;
  }
  // practice: every clip length up to 15 s at every level; the game is kept apart and never ranked
  function setPractice(on) {
    if (on === st.practice || st.loading) { $('practiceToggle').checked = st.practice; return; }
    if (st.song && !st.over && (st.stage > 0 || st.guesses.length)) { toast('Finish this song first'); $('practiceToggle').checked = st.practice; return; }
    saveGame();
    st.practice = on; SG.store.set('practice', on);
    const saved = loadGame();
    toast(on ? 'Practice: all clips up to 15 s at every level — not counted on the leaderboard' : 'Ranked game — scores count on the leaderboard');
    renderStage();
    newRound(saved);
  }
  // each mode keeps its own game; switching pauses one and resumes the other
  function setMode(m) {
    if (!MODES[m] || m === st.mode || st.loading) return;
    if (st.song && !st.over && (st.stage > 0 || st.guesses.length)) { toast('Finish this song first'); return; }
    saveGame();
    st.mode = m; SG.store.set('mode', m);
    const saved = loadGame();
    toast(MODES[m].label + ' mode — ' + (m === 'hard' ? 'one miss ends the game' : MODES[m].lives + ' strikes') + (st.score || st.strikes ? ' · game resumed' : ''));
    renderStage();
    newRound(saved);
  }

  /* ---------- player name & leaderboard ---------- */
  const me = {
    pid: SG.store.get('pid', null) || (() => { const id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()); SG.store.set('pid', id); return id; })(),
    name: SG.store.get('name', ''),
    spotify: SG.store.get('nameFromSpotify', false),
  };
  async function api(path, body) {
    const r = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(j.error || 'Server error ' + r.status); e.status = r.status; throw e; }
    return j;
  }
  async function setName(name, fromSpotify) {
    const j = await api('api/player', { pid: me.pid, name, spotify: !!fromSpotify });
    me.name = j.name; me.spotify = !!fromSpotify;
    SG.store.set('name', me.name); SG.store.set('nameFromSpotify', me.spotify);
    renderMe();
  }
  function renderMe() {
    $('meChip').innerHTML = me.name ? '👤 ' + SG.escape(me.name) + (me.spotify ? '<span class="sp" title="Spotify name">●</span>' : '') : '';
  }
  function spotifyName() { const m = SG.store.get('sp_me', null); return SG.Spotify.isLoggedIn() && m && m.name ? m.name : ''; }
  // Spotify-connected players always appear under their Spotify name
  async function syncIdentity() {
    if (SG.Spotify.isLoggedIn() && !SG.store.get('sp_me', null)) {
      try { const m = await SG.Spotify.me(); SG.store.set('sp_me', { id: m.id, name: m.display_name }); } catch (e) {}
    }
    const sp = spotifyName();
    if (sp && (sp !== me.name || !me.spotify)) {
      try { await setName(sp, true); return true; } catch (e) { if (e.status === 409) toast('Your Spotify name “' + sp + '” is already used on the leaderboard — pick another name'); }
    } else if (me.name) {
      try { await setName(me.name, me.spotify); return true; } catch (e) { if (e.status !== 409) return true; }
    }
    return false;
  }
  function askName() {
    const sp = spotifyName();
    $('nameIn').value = me.name || sp || '';
    $('nameErr').textContent = '';
    $('nameSpConnect').innerHTML = sp ? 'Connected to Spotify as <b>' + SG.escape(sp) + '</b>.'
      : 'Want your Spotify name on the leaderboard automatically? <a href="#" id="nameConnect">Connect Spotify</a> (only works for accounts added to this app).';
    const c = document.getElementById('nameConnect');
    if (c) c.onclick = (e) => { e.preventDefault(); SG.Spotify.login('index.html'); };
    $('nameModal').classList.remove('hidden');
    setTimeout(() => $('nameIn').focus(), 50);
  }
  async function saveNameFromModal() {
    const v = $('nameIn').value.trim();
    if (v.length < 2) { $('nameErr').textContent = 'Name must be at least 2 characters'; return; }
    $('nameSave').disabled = true;
    try { await setName(v, v === spotifyName()); $('nameModal').classList.add('hidden'); }
    catch (e) { $('nameErr').textContent = e.message; }
    $('nameSave').disabled = false;
  }
  function sendRound(won, pts) {
    const fresh = st.fresh; st.fresh = false;
    if (!me.name || st.practice) return;  // practice games never reach the leaderboard
    api('api/round', { pid: me.pid, mode: st.mode, won, pts, fresh }).catch(() => {});
  }
  let lbMode = null, lbBy = 'score';
  async function renderLeaderboard() {
    lbMode = lbMode || st.mode;
    $('lbModal').classList.remove('hidden');
    document.querySelectorAll('#lbTabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === lbMode));
    document.querySelectorAll('#lbBy button').forEach((b) => b.classList.toggle('on', b.dataset.by === lbBy));
    $('lbBy').classList.toggle('hidden', lbMode === 'all');
    const all = lbMode === 'all';
    const label = all ? 'Total points' : lbBy === 'streak' ? 'Best streak' : 'Best game';
    $('lbHelp').textContent = all ? 'All points earned in every mode.'
      : (lbBy === 'streak' ? 'Most songs guessed in a row' : 'Highest score in a single game') + ' in ' + MODES[lbMode].label + ' mode (' + (lbMode === 'hard' ? 'one miss ends the game' : MODES[lbMode].lives + ' strikes') + ').';
    $('lbBody').textContent = 'Loading…';
    let j;
    try { j = await api('api/leaderboard?' + (all ? 'by=points' : 'mode=' + lbMode + '&by=' + lbBy) + '&pid=' + encodeURIComponent(me.pid)); }
    catch (e) { $('lbBody').textContent = 'Leaderboard unavailable right now.'; return; }
    if (!j.top.length) { $('lbBody').innerHTML = '<p class="muted">Nobody on this board yet — be the first!</p>'; return; }
    const extra = all ? [['Correct', (p) => p.played ? Math.round((p.solved / p.played) * 100) + '%' : '—']]
      : [[lbBy === 'streak' ? 'Best game' : 'Best streak', (p) => (lbBy === 'streak' ? p.best_score : p.best_streak).toLocaleString()], ['Games', (p) => p.games]];
    const medal = (i) => ['🥇', '🥈', '🥉'][i - 1] || i;
    $('lbBody').innerHTML = `<div class="lb-wrap"><table class="lb"><thead><tr><th>#</th><th>Player</th><th class="n">${label}</th>${extra.map(([h]) => `<th class="n">${h}</th>`).join('')}</tr></thead>
      <tbody>${j.top.map((p, i) => `<tr class="${me.name && p.name === me.name ? 'me' : ''}"><td class="rk">${medal(i + 1)}</td><td>${SG.escape(p.name)}${p.spotify ? '<span class="sp" title="Spotify name">●</span>' : ''}</td><td class="n main">${p.value.toLocaleString()}</td>${extra.map(([, f]) => `<td class="n">${f(p)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="lb-me">${j.me ? `You (<b>${SG.escape(j.me.name)}</b>) are <b>#${j.me.rank}</b> of ${j.players} · ${label.toLowerCase()} ${j.me.value.toLocaleString()}` : me.name ? 'Play a game in this mode to get on the board.' : '<a href="#" id="lbSetName">Pick a name</a> to get on the board.'}</div>`;
    const sn = document.getElementById('lbSetName'); if (sn) sn.onclick = (e) => { e.preventDefault(); askName(); };
  }

  /* ---------- Spotify login check: logged-out visitors only get 30-second previews ---------- */
  function previewMode(song) {
    const d = player.state.duration;
    return d > 0 && d <= 31000 && (song.durationMs || 0) > 45000;
  }
  // Not logged in to Spotify (or a phone browser where Spotify can't log in): Spotify plays a fixed
  // 30-second preview of each song, so clips come from that preview instead of a chosen lyric line.
  const PREVIEW_START = 1600; // → starts 2 s into the preview, past its fade-in
  function setPreviewNotice(on) {
    $('previewNote').classList.toggle('hidden', !on);
  }
  function openSpotifyLogin() {
    const w = window.open('https://accounts.spotify.com/login?continue=' + encodeURIComponent('https://open.spotify.com/'), 'splogin', 'width=480,height=720');
    if (!w) { location.href = 'https://accounts.spotify.com/login?continue=' + encodeURIComponent(location.href); return; }
    const t = setInterval(() => { if (w.closed) { clearInterval(t); location.reload(); } }, 800);
  }

  /* ---------- community results for this song (shared by everyone who played it) ---------- */
  async function sendCommunity(song, won, stage, ms) {
    if (st.practice) { try { const r = await fetch('api/stats/' + song.id); return r.ok ? r.json() : null; } catch (e) { return null; } }
    try {
      const r = await fetch('api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: song.id, won, clip: won ? CLIPS[stage] : 0, ms, cue: st.preview ? -1 : (st.cue && st.cue[2]) }) });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) { return null; }
  }
  function renderCommunity(c, won) {
    const el = $('rvCommunity');
    if (!c || !c.played) { el.classList.add('hidden'); return; }
    const avg = c.solved ? (c.total_ms / c.solved / 1000) : 0;
    const counts = CLIPS.map((x) => c[COL[x]] || 0).concat([c.x]);
    const max = Math.max(1, ...counts);
    const mine = won ? st.stage : CLIPS.length;
    const labels = CLIPS.map((x) => x / 1000 + 's').concat(['✗']);
    el.innerHTML = `<div class="label">Community results for this song</div>
      <div class="cstats"><div><b>${c.played.toLocaleString()}</b><span>played</span></div><div><b>${pct(c.solved, c.played)}</b><span>solved</span></div><div><b>${c.solved ? avg.toFixed(1) + 's' : '—'}</b><span>avg time</span></div></div>
      ${counts.map((n, i) => `<div class="dist ${i === mine ? 'me' : ''}"><span>${labels[i]}</span><i style="width:${(n / max) * 100}%" class="${i === CLIPS.length ? 'bad' : ''}"></i><b>${n}</b></div>`).join('')}
      <div class="muted small">${c.played === 1 ? 'You are the first to play this one!' : 'Your round is included · highlighted row = you'}</div>`;
    el.classList.remove('hidden');
  }

  function pct(a, b) { return b ? Math.round((a / b) * 100) + '%' : '—'; }
  function renderStats() {
    const box = (l, v) => `<div class="box"><div class="label">${l}</div><div class="v">${v}</div></div>`;
    setTimeout(() => {
      $('statsPool').innerHTML = `With your current filters: <b>${(st.poolCount || 0).toLocaleString()}</b> songs · <b>${(st.leftCount || 0).toLocaleString()}</b> you haven't heard yet. <button class="linkbtn" id="resetPlayed2">Reset played songs</button>`;
      $('resetPlayed2').onclick = () => { resetPlayed(); renderStats(); };
    });
    const avgStage = stats.won ? stats.byStage.reduce((a, n, i) => a + n * CLIPS[i], 0) / stats.won / 1000 : 0;
    const maxBar = Math.max(1, ...stats.byStage, stats.lost + stats.gaveUp);
    const bars = CLIPS.map((c, i) => [c / 1000 + 's', stats.byStage[i], false]).concat([['✗', stats.lost + stats.gaveUp, true]])
      .map(([l, n, bad]) => `<div class="dist"><span>${l}</span><i style="width:${(n / maxBar) * 100}%" class="${bad ? 'bad' : ''}"></i><b>${n}</b></div>`).join('');
    const table = (title, map, names) => {
      const rows = Object.entries(map).sort((a, b) => b[1].p - a[1].p).map(([k, o]) =>
        `<div class="srow"><span>${SG.escape(names(k))}</span><span>${o.w}/${o.p}</span><span class="acc"><i style="width:${o.p ? (o.w / o.p) * 100 : 0}%"></i></span><b>${pct(o.w, o.p)}</b></div>`).join('');
      return rows ? `<h3>${title}</h3>${rows}` : '';
    };
    const eraName = (k) => (SG.ERAS.find((e) => e.id === k) || {}).label || k;
    $('statsBody').innerHTML = `
      <div class="stats">${box('Played', stats.played)}${box('Correct', pct(stats.won, stats.played))}${box('Best streak', stats.bestStreak)}${box('Best game (' + MODES[st.mode].label + ')', high())}${box('Avg clip to guess', stats.won ? avgStage.toFixed(1) + 's' : '—')}${box('Avg time', stats.won ? Math.round(stats.timeMs / stats.won / 1000) + 's' : '—')}</div>
      <h3>When you got it</h3>${bars}
      ${table('By language', stats.lang, (k) => SG.LANGS[k] || k)}
      ${table('By era', stats.era, eraName)}
      ${table('By genre', stats.genre, (k) => SG.GENRES[k] || k)}
      ${stats.recent.length ? '<h3>Recent songs</h3>' + stats.recent.slice(0, 12).map((r) => `<div class="srow recent"><span>${r.won ? '✓' : '✗'} ${SG.escape(r.t)}</span><span class="muted">${SG.escape(r.m || '')}</span><b>${r.won ? CLIPS[r.st] / 1000 + 's' : '—'}</b></div>`).join('') : ''}
      ${stats.played ? '' : '<p class="muted">Play a few rounds and your stats will show up here.</p>'}`;
    $('statsModal').classList.remove('hidden');
  }
  let player = null;
  let myPlaylists = null;

  function toast(t, ms = 2600) { const el = $('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), ms); }
  function msg(t, cls = '') { const m = $('msg'); m.textContent = t; m.className = 'msg ' + cls; }
  const fmtLen = (ms) => ms / 1000 + ' SEC';

  function buildStatic() {
    const w = $('logoWave');
    for (let i = 0; i < 18; i++) { const b = document.createElement('i'); b.style.height = (6 + Math.abs(Math.sin(i * 1.7)) * 26) + 'px'; w.appendChild(b); }
    const tr = $('track'), tk = $('ticks');
    let lastLabel = -100;
    CLIPS.forEach((c) => {
      const p = pos(c);
      const t = document.createElement('div'); t.className = 'tick'; t.style.left = p + '%'; tr.appendChild(t);
      if (p - lastLabel < 5) return; // the short clips sit close together on a linear bar: label only the first
      lastLabel = p;
      const s = document.createElement('span'); s.style.left = p + '%'; s.textContent = c / 1000 + 's'; tk.appendChild(s);
    });
    CLIPS.forEach((c, i) => { const d = document.createElement('div'); d.className = 'clip'; d.dataset.i = i; d.innerHTML = `${c / 1000}<small>SEC</small>`; $('clips').appendChild(d); });
    SG.ERAS.forEach((e) => {
      const b = document.createElement('button'); b.className = 'knob'; b.dataset.era = e.id;
      b.innerHTML = `<div class="dial"></div><span>${e.label}</span><small>${e.sub}</small>`;
      b.onclick = () => { toggle(st.filters.eras, e.id); onFilters(); };
      $('eraKnobs').appendChild(b);
    });
    Object.entries(SG.GENRES).forEach(([k, v]) => {
      const b = document.createElement('button'); b.className = 'chip'; b.dataset.g = k; b.textContent = v;
      b.onclick = () => { toggle(st.filters.genres, k); onFilters(); };
      $('genreChips').appendChild(b);
    });
    $('langSwitch').querySelectorAll('button').forEach((b) => b.onclick = () => { st.filters.lang = b.dataset.lang; onFilters(); });
  }
  function toggle(arr, v) { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }

  function pool() { return SG.filterSongs(st.songs, st.filters); }
  function onFilters(first) {
    SG.store.set('filters', st.filters);
    document.querySelectorAll('#eraKnobs .knob').forEach((b) => b.classList.toggle('on', st.filters.eras.includes(b.dataset.era)));
    document.querySelectorAll('#genreChips .chip').forEach((b) => b.classList.toggle('on', st.filters.genres.includes(b.dataset.g)));
    document.querySelectorAll('#langSwitch button').forEach((b) => b.classList.toggle('on', b.dataset.lang === st.filters.lang));
    const p = pool();
    const left = p.filter((s) => !st.played.has(s.id)).length;
    st.poolCount = p.length; st.leftCount = left;
    $('poolInfo').innerHTML = st.filters.eras.length || st.filters.genres.length ? '<button class="linkbtn" id="clearF">clear filters</button>' : '';
    const cf = $('clearF'); if (cf) cf.onclick = () => { st.filters.eras = []; st.filters.genres = []; onFilters(); };
    if (!first && st.song && !st.over && st.stage === 0 && !st.busy && !st.guesses.length && !p.includes(st.song)) {
      st.played.delete(st.song.id); newRound();
    }
  }

  function renderStage() {
    document.querySelectorAll('.clip').forEach((c) => {
      const i = +c.dataset.i;
      c.classList.toggle('open', i <= st.stage);
      c.classList.toggle('cur', i === st.stage);
      c.classList.toggle('locked', i > maxStage());
    });
    $('unlocked').style.width = pos(CLIPS[st.stage]) + '%';
    $('playLen').textContent = st.over ? (st.gameOver ? 'NEW GAME' : 'NEXT SONG') : fmtLen(CLIPS[st.stage]);
    $('playWord').textContent = st.over ? 'NEXT' : 'PLAY';
    $('score').textContent = $('score2').textContent = st.score;
    $('streak').textContent = $('streak2').textContent = st.streak;
    $('high').textContent = high();
    $('modeName').textContent = MODES[st.mode].label + (st.practice ? ' · Practice (not ranked)' : '') + ' · Level ' + (level() + 1) + (level() && !st.practice ? ' (×' + LEVELS[level()].mult + ' points)' : '');
    $('practiceToggle').checked = st.practice;
    $('radio').classList.toggle('practice', st.practice);
    $('levelTag').textContent = 'LV ' + (level() + 1);
    const left = MODES[st.mode].lives - st.strikes;
    $('lives').innerHTML = st.mode === 'hard' ? (left > 0 ? '<span title="one miss ends the game">☠</span>' : '✕') : '♥'.repeat(Math.max(0, left)) + '<i>' + '♥'.repeat(st.strikes) + '</i>';
    document.querySelectorAll('#modeSwitch button').forEach((b) => b.classList.toggle('on', b.dataset.mode === st.mode));
    $('round').textContent = String(st.round).padStart(2, '0');
    $('skipBtn').textContent = st.over ? (st.gameOver ? 'NEW GAME →' : 'NEXT →') : 'SKIP →';
    $('skipBtn').classList.toggle('next', st.over);
    $('guesses').innerHTML = st.guesses.map((g) => `<div class="${g.skip ? 'skip' : ''}">${g.skip ? '⏭ Skipped' : '✗ ' + SG.escape(g.text)}</div>`).join('');
  }

  /* ---------- rounds ---------- */
  // Two hidden Spotify players: while you guess on one, the next song loads on the other (no waiting between songs).
  let players = [];
  function other(p) { return players[0] === p ? players[1] : players[0]; }
  function showPlayer(p) { players.forEach((x) => { const f = x.ctl && x.ctl.iframeElement; if (f) f.classList.toggle('on', x === p); }); }
  function pickNext(exclude) {
    const avail = pool().filter((s) => !st.played.has(s.id) && s.id !== exclude && songWeight(s) > 0);
    if (!avail.length) return null;
    // weighted random: songs people find hard come up less often
    let total = 0;
    const ws = avail.map((s) => (total += songWeight(s)));
    const x = Math.random() * total;
    return avail[ws.findIndex((c) => c >= x)] || avail[avail.length - 1];
  }
  function preloadNext() {
    const p = other(player);
    const song = pickNext(st.song && st.song.id);
    if (!song || !p) { st.next = null; return; }
    const n = { song, player: p, ready: null };
    n.ready = p.load(song.uri).catch(() => {});
    st.next = n;
  }

  let skippedInRow = 0;
  function reportUnplayable(song) {
    if (!st.playedOk) return; // the player itself may be the problem, not this song
    fetch('api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: song.id, what: 'unplayable' }) }).catch(() => {});
    tuneX.add(song.id);
  }
  // a track that Spotify won't play here (removed / not available in this country): skip it, no strike
  async function skipUnplayable(song) {
    reportUnplayable(song);
    st.loading = false;
    if (++skippedInRow > 5) { msg('Spotify isn’t playing songs right now — check your connection and reload.', 'bad'); return; }
    toast('That song isn’t available on Spotify here — picked another (no strike)');
    st.song = null; st.round = Math.max(0, st.round - 1);
    newRound();
  }

  async function newRound(resume) {
    if (st.loading) return;
    if (st.gameOver) resetGame();
    hideResult();
    players.forEach((p) => { p.setFree(false); p.pause(); });
    if (!st.songs.length) {
      msg('The song library is empty. Open “Add songs” to import songs from Spotify.', 'bad');
      $('tapHint').innerHTML = '<a href="library.html#build">Add songs →</a>';
      return;
    }
    let song = resume && st.songs.find((x) => x.id === resume.id);
    let use = null;
    if (!song && st.next && pool().includes(st.next.song) && !st.played.has(st.next.song.id)) { use = st.next; song = use.song; }
    if (!song) song = pickNext();
    st.next = null;
    if (!song) {
      st.song = null;
      const p = pool();
      msg(p.length ? 'You have played every song for these filters! Reset played history or change filters.' : 'No songs match these filters.', 'bad');
      $('tapHint').textContent = '';
      onFilters(true);
      return;
    }
    st.song = song; st.over = false;
    if (resume && song.id === resume.id) {
      st.stage = Math.min(resume.stage || 0, maxStage()); st.guesses = resume.guesses || []; st.cue = resume.cue || pickCue(song, LEVELS[level()].any); st.roundStart = resume.start || Date.now();
    } else {
      st.stage = 0; st.guesses = []; st.round++; st.cue = pickCue(song, LEVELS[level()].any); st.roundStart = Date.now();
    }
    st.played.add(song.id); SG.store.set('played', Array.from(st.played));
    saveGame();
    $('guessInput').value = ''; hideSugg();
    $('fill').style.width = '0';
    msg(st.guesses.length || st.stage ? 'Game resumed — keep guessing.' : 'Guess the song. A wrong guess or SKIP unlocks more time.');
    renderStage(); onFilters(true);
    st.loading = true; $('playBtn').disabled = true; $('tapHint').textContent = 'Tuning…';
    try {
      if (use) { player = use.player; await use.ready; } // already loaded in the background
      if (player.currentUri !== song.uri) await player.load(song.uri);
      showPlayer(player);
      // Spotify only reports the length once a song starts, so "is it playable / only a preview?" is checked in tuneIn()
      st.preview = false; setPreviewNotice(false);
      preloadNext();
      if (navigator.userActivation && navigator.userActivation.hasBeenActive) await tuneIn();
    } catch (e) { console.warn(e); }
    skippedInRow = 0;
    st.loading = false; $('playBtn').disabled = false;
    if (!st.unlocking) $('tapHint').textContent = 'Tap play to start';
  }
  async function tuneIn() {
    if (player.primedUri === player.currentUri) return true;
    const stop = SG.staticNoise(2500, 0.1);
    $('tapHint').textContent = 'Tuning in…';
    const ok = await player.prime();
    stop();
    if (ok) {
      st.playedOk = true;
      st.preview = previewMode(st.song);
      setPreviewNotice(st.preview);
      if (st.preview && !st.over) { st.cue = [PREVIEW_START, '', -1]; saveGame(); }
    } else {
      if (isTouch() && !st.playedOk) showUnlock();
      else if (st.song && !st.over) skipUnplayable(st.song);
    }
    return ok;
  }
  // Phones (especially iPhone) only let the Spotify player make sound after a tap on the player itself
  const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;
  function showUnlock() {
    if (st.unlocking) return;
    st.unlocking = true;
    $('embedSlot').classList.add('show', 'unlock');
    $('guessCol').classList.add('unlocking');
    msg('Tap ▶ on the Spotify player below once to switch the sound on (phones need this). The song name stays hidden.', '');
    $('tapHint').textContent = 'Tap ▶ on the player below';
    const p = player;
    p.armUnlock(() => {
      st.unlocking = false;
      $('embedSlot').classList.remove('show', 'unlock');
      $('guessCol').classList.remove('unlocking');
      msg('Sound is on — press PLAY.');
      $('tapHint').textContent = 'Tap play to start';
      // the other player needs one tap too on some phones; it will ask again if so
    });
  }

  async function playClip() {
    if (st.over) return newRound();
    if (!st.song || st.loading || st.unlocking) { if (!st.song && !st.loading) newRound(); return; }
    st.busy = true;
    $('playBtn').classList.add('playing');
    let ok = player.primedUri === player.currentUri || await tuneIn();
    if (ok) {
      $('tapHint').textContent = 'Listening…';
      const res = await player.playClip(st.cue[0] || 0, CLIPS[st.stage], (f) => {
        $('fill').style.width = pos(f * CLIPS[st.stage]) + '%';
      });
      if (res === 'failed') { ok = false; if (isTouch() && !st.playedOk) showUnlock(); else skipUnplayable(st.song); }
    }
    $('playBtn').classList.remove('playing');
    if (ok && !st.over) $('tapHint').textContent = 'Play again or guess';
    st.busy = false;
    if (ok && !st.over && !matchMedia('(hover: none)').matches) $('guessInput').focus();
  }

  function advance(reason) {
    if (st.over) return;
    if (st.stage >= maxStage()) { finish(false); return; }
    st.stage++;
    saveGame();
    renderStage();
    msg(reason === 'skip' ? `${CLIPS[st.stage] / 1000} seconds unlocked.` : `Not quite — ${CLIPS[st.stage] / 1000} seconds unlocked.`, reason === 'skip' ? '' : 'bad');
    playClip();
  }
  function skip() {
    if (st.over) return newRound();
    if (!st.song) return;
    st.guesses.push({ skip: true }); advance('skip');
  }

  function guess(song) {
    if (!st.song || st.over) return;
    hideSugg(); $('guessInput').value = '';
    const ok = song.id === st.song.id || (SG.norm(song.title) === SG.norm(st.song.title) && SG.norm(song.movie) === SG.norm(st.song.movie));
    if (ok) return finish(true);
    st.guesses.push({ text: song.title + ' — ' + (song.movie || song.artists[0]) });
    $('guessInput').classList.add('shake'); setTimeout(() => $('guessInput').classList.remove('shake'), 400);
    SG.blip(220, 160);
    advance('wrong');
  }

  /* ---------- result, shown in place of the guess panel ---------- */
  async function finish(won, gaveUp) {
    st.over = true;
    player.pause();
    const s = st.song;
    let pts = 0;
    const hadStreak = st.streak;
    const lvBefore = level();
    if (won) { pts = Math.round((POINTS[st.stage] + st.streak * 10) * (st.practice ? 1 : LEVELS[lvBefore].mult)); st.score += pts; st.streak++; st.solved++; SG.blip(880, 90); setTimeout(() => SG.blip(1320, 140), 100); }
    else { st.streak = 0; st.strikes++; }
    st.lastPoints = pts;
    st.gameOver = st.strikes >= MODES[st.mode].lives;
    const levelUp = won && level() > lvBefore;
    saveGame();
    player.setFree(true);
    if (!gaveUp) recordRound(won, 'lost');
    sendRound(won, pts);
    if (st.score > high()) SG.store.set('high_' + gkey(), st.score);
    $('rvCommunity').classList.add('hidden');
    sendCommunity(s, won, st.stage, Date.now() - st.roundStart).then((c) => { if (st.song === s && st.over) renderCommunity(c, won); });
    if (st.score > high()) SG.store.set('high_' + gkey(), st.score);
    renderStage();
    $('rvPill').textContent = won ? `✓ Correct — in ${CLIPS[st.stage] / 1000}s` : gaveUp ? '× Gave up — strike' : '× Missed — strike';
    $('rvPill').className = 'pill ' + (won ? 'good' : 'bad');
    $('rvCover').src = s.cover || '';
    $('rvTitle').textContent = s.title;
    $('rvArtist').textContent = s.artists.join(', ');
    $('rvSub').textContent = [s.movie && s.movie !== s.title ? s.movie : '', s.year].filter(Boolean).join(' · ');
    const badges = won ? [`<span class="pts">+${pts} points</span>`, `<span>Streak ${st.streak}</span>`, levelUp ? `<span class="lvup">⬆ Level ${level() + 1}: ${LEVELS[level()].note} · ×${LEVELS[level()].mult} points</span>` : '']
      : ['<span class="nopts">No points</span>', hadStreak ? '<span>Streak reset</span>' : ''];
    const tags = [SG.LANGS[s.lang], ...(s.genres || []).map((g) => SG.GENRES[g])].filter(Boolean).map((t) => `<span class="tag">${t}</span>`);
    $('rvBadges').innerHTML = badges.concat(tags).join('');
    if (!st.preview && !st.cue[1]) { try { await SG.loadSongText(s); st.cue[1] = (s.cues && st.cue[2] >= 0 && s.cues[st.cue[2]]) ? s.cues[st.cue[2]][1] : s.hookLine; } catch (e) {} }
    const line = st.preview ? '' : (st.cue[1] || s.hookLine || '');
    if (st.preview) $('rvHook').innerHTML = '<span class="lbl">The clip was from Spotify’s 30-second preview</span>Log in to Spotify in this browser to hear the best part of each song.';
    else $('rvHook').innerHTML = line ? '<span class="lbl">The clip was from:</span> “' + SG.escape(line) + '”' + (SG.hasDev(line) ? '<small>' + SG.escape(SG.roman(line)) + '</small>' : '') : '';
    $('openSp').href = 'https://open.spotify.com/track/' + s.id;
    $('lyrBtn').href = 'library.html#song=' + s.id;
    $('likeBtn').textContent = '♡ Save to Liked Songs'; $('likeBtn').classList.remove('done'); $('likeBtn').disabled = false;
    $('plSelect').value = '';
    fillPlaylists();
    $('guessUI').classList.add('hidden');
    $('result').classList.remove('hidden');
    $('embedSlot').classList.add('show');
    if (st.gameOver) {
      const best = high();
      $('rvGameOver').innerHTML = `<b>GAME OVER</b><span>${MODES[st.mode].label} mode · final score <b>${st.score.toLocaleString()}</b>${st.score >= best && st.score > 0 ? ' · 🎉 new personal best!' : ' · your best ' + best.toLocaleString()}</span><a href="#" id="goLb">See leaderboard →</a>`;
      $('rvGameOver').classList.remove('hidden');
      document.getElementById('goLb').onclick = (e) => { e.preventDefault(); lbMode = st.mode; renderLeaderboard(); };
    } else $('rvGameOver').classList.add('hidden');
    $('tapHint').textContent = st.gameOver ? 'Press NEW GAME to play again' : 'Press NEXT for another song';
    player.playFrom(st.preview ? 0 : (st.cue[0] || 0));
  }
  function hideResult() {
    $('result').classList.add('hidden');
    $('guessUI').classList.remove('hidden');
    $('embedSlot').classList.remove('show');
  }

  /* ---------- Spotify: Liked Songs / playlists ---------- */
  function needConnect() {
    if (SG.Spotify.isLoggedIn() && SG.Spotify.canWrite()) return false;
    if (confirmConnect()) SG.Spotify.login('index.html');
    return true;
  }
  function confirmConnect() {
    toast('Connecting to Spotify… (you will come back here)', 1500);
    return true;
  }
  async function fillPlaylists() {
    const sel = $('plSelect');
    if (!SG.Spotify.isLoggedIn() || !SG.Spotify.canWrite()) { sel.innerHTML = '<option value="">＋ Add to playlist…</option><option value="__connect">Connect Spotify…</option>'; return; }
    if (!myPlaylists) {
      try { myPlaylists = await SG.Spotify.myPlaylists(true); } catch (e) { myPlaylists = []; }
    }
    sel.innerHTML = '<option value="">＋ Add to playlist…</option>' + myPlaylists.map((p) => `<option value="${p.id}">${SG.escape(p.name)}</option>`).join('') + '<option value="__new">＋ New playlist…</option>';
  }
  async function like() {
    if (!st.song || needConnect()) return;
    const b = $('likeBtn'); b.disabled = true; b.textContent = 'Saving…';
    try { await SG.Spotify.saveToLiked(st.song.uri); b.textContent = '♥ Saved to Liked Songs'; b.classList.add('done'); }
    catch (e) { b.disabled = false; b.textContent = '♡ Save to Liked Songs'; toast(e.message, 5000); }
  }
  async function addToPlaylist() {
    const sel = $('plSelect'); let id = sel.value;
    if (!id || !st.song) return;
    if (id === '__connect') { sel.value = ''; needConnect(); return; }
    try {
      if (id === '__new') {
        const name = prompt('Name for the new playlist', 'Guess That Song favourites');
        if (!name) { sel.value = ''; return; }
        const pl = await SG.Spotify.createPlaylist(name);
        myPlaylists.unshift(pl); id = pl.id; await fillPlaylists(); sel.value = id;
      }
      await SG.Spotify.addToPlaylist(id, st.song.uri);
      const name = (myPlaylists.find((p) => p.id === id) || {}).name || 'playlist';
      toast('Added to “' + name + '”');
    } catch (e) { toast(e.message, 5000); }
    sel.value = '';
  }

  /* ---------- suggestions ---------- */
  let sel = -1, results = [];
  function hideSugg() { $('sugg').classList.add('hidden'); sel = -1; }
  function renderSugg() {
    const q = $('guessInput').value;
    results = q.trim().length >= 2 ? SG.search(q, st.songs, { limit: 8, lyrics: SG.settings.lyricSearch }) : [];
    const box = $('sugg');
    if (!results.length) {
      box.innerHTML = q.trim().length >= 2 ? `<div class="it"><div class="s">No match — try ${SG.settings.lyricSearch ? 'a lyric line, ' : ''}the movie or the singer</div></div>` : '';
      box.classList.toggle('hidden', q.trim().length < 2); return;
    }
    sel = Math.min(Math.max(sel, 0), results.length - 1);
    box.innerHTML = results.map((r, i) => {
      const s = r.song;
      const sub = [s.movie && s.movie !== s.title ? s.movie : '', s.year, s.artists.slice(0, 2).join(', ')].filter(Boolean).join(' · ');
      return `<div class="it ${i === sel ? 'sel' : ''}" data-i="${i}">
        <span class="badge ${r.field}">${r.field}</span>
        <div><div class="t">${SG.highlight(s.title, q)}</div><div class="s">${SG.highlight(sub, q)}</div>
        ${r.snippet ? `<div class="ly">♪ ${SG.highlight(SG.roman(r.snippet), q)}</div>` : ''}</div></div>`;
    }).join('');
    box.classList.remove('hidden');
    box.querySelectorAll('.it[data-i]').forEach((el) => el.onmousedown = (e) => { e.preventDefault(); guess(results[+el.dataset.i].song); });
  }

  /* ---------- lyric search toggle + settings ---------- */
  function lyrState(text) { $('lyrState').textContent = text || ''; }
  function setLyricSearch(on) {
    SG.settings.lyricSearch = on; SG.saveSettings();
    $('lyrToggle').checked = on; $('setLyr').checked = on;
    if (on) loadLyrics(); else lyrState('');
    if ($('guessInput').value) renderSugg();
  }
  function loadLyrics() {
    if (!SG.settings.lyricSearch || st.lib._full || st.lib._lyricsLoaded) return;
    lyrState('(loading…)');
    SG.loadLyrics(st.lib, (f) => lyrState('(loading ' + Math.round(f * 100) + '%)')).then(() => lyrState(''));
  }
  function openSettings(showOwnApp) {
    if (showOwnApp === true) $('ownAppBox').open = true;
    const me = SG.store.get('sp_me', null);
    $('setSpStatus').textContent = SG.Spotify.isLoggedIn() ? 'Connected' + (me && me.name ? ' as ' + me.name : '') + (SG.Spotify.canWrite() ? '' : ' (reconnect to allow saving songs)') : 'Not connected';
    $('setLyr').checked = SG.settings.lyricSearch;
    $('settings').classList.remove('hidden');
  }

  function resetPlayed() {
    st.played = new Set(st.song && !st.over ? [st.song.id] : []);
    SG.store.set('played', Array.from(st.played)); onFilters(true); toast('Played history cleared');
    if (!st.song) newRound();
  }
  /* ---------- wiring ---------- */
  function wire() {
    $('playBtn').onclick = () => playClip();
    $('fxVol').value = Math.round(SG.fxVolume() * 100);
    const fxLabel = () => { $('fxVolVal').textContent = $('fxVol').value === '0' ? 'off' : $('fxVol').value + '%'; };
    fxLabel();
    $('fxVol').oninput = () => { SG.store.set('fxvol', $('fxVol').value / 100); fxLabel(); };
    $('fxVol').onchange = () => SG.blip(880, 90);
    $('skipBtn').onclick = () => skip();
    $('newBtn').onclick = () => {
      if (st.song && !st.over && (st.stage > 0 || st.guesses.length)) { recordRound(false, 'gaveup'); finish(false, true); return; }
      newRound();
    };
    $('statsBtn').onclick = (e) => { e.preventDefault(); renderStats(); };
    $('lbBtn').onclick = (e) => { e.preventDefault(); lbMode = st.mode; renderLeaderboard(); };
    document.querySelectorAll('#modeSwitch button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
    document.querySelectorAll('#lbBy button').forEach((b) => { b.onclick = () => { lbBy = b.dataset.by; renderLeaderboard(); }; });
    $('lbTab').onclick = (e) => { e.preventDefault(); renderLeaderboard(); };
    $('lbClose').onclick = () => $('lbModal').classList.add('hidden');
    $('lbModal').onclick = (e) => { if (e.target === $('lbModal')) $('lbModal').classList.add('hidden'); };
    document.querySelectorAll('#lbTabs button').forEach((b) => { b.onclick = () => { lbMode = b.dataset.mode; renderLeaderboard(); }; });
    $('meChip').onclick = (e) => { e.preventDefault(); askName(); };
    $('nameSave').onclick = saveNameFromModal;
    $('nameIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveNameFromModal(); });
    const choose = (login) => { $('chooseLogin').classList.toggle('on', login); $('choosePreview').classList.toggle('on', !login); SG.store.set('listen', login ? 'login' : 'preview'); };
    $('choosePreview').onclick = () => choose(false);
    // save the name first: the page reloads after the Spotify login window closes
    $('chooseLogin').onclick = async () => { choose(true); if ($('nameIn').value.trim().length >= 2) await saveNameFromModal(); openSpotifyLogin(); };
    $('previewLogin').onclick = (e) => { e.preventDefault(); openSpotifyLogin(); };
    $('gateLogin').onclick = openSpotifyLogin;
    $('gateReload').onclick = (e) => { e.preventDefault(); location.reload(); };
    $('statsTab').onclick = (e) => { e.preventDefault(); renderStats(); };
    $('statsClose').onclick = () => $('statsModal').classList.add('hidden');
    $('statsModal').onclick = (e) => { if (e.target === $('statsModal')) $('statsModal').classList.add('hidden'); };
    $('statsReset').onclick = () => { if (confirm('Reset all your stats?')) { stats = blankStats(); SG.store.set('stats', stats); renderStats(); } };
    $('likeBtn').onclick = like;
    $('plSelect').onchange = addToPlaylist;
    $('practiceToggle').onchange = () => setPractice($('practiceToggle').checked);
    $('lyrToggle').onchange = () => setLyricSearch($('lyrToggle').checked);
    $('settingsBtn').onclick = (e) => { e.preventDefault(); openSettings(); };
    $('setLyr').onchange = () => setLyricSearch($('setLyr').checked);
    $('setClose').onclick = () => $('settings').classList.add('hidden');
    $('settings').onclick = (e) => { if (e.target === $('settings')) $('settings').classList.add('hidden'); };
    $('setConnect').onclick = () => SG.Spotify.login('index.html');
    const redir = location.origin + '/callback.html';
    $('setRedir').textContent = redir;
    $('copyRedir').onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(redir) : Promise.reject()).then(() => toast('Copied'), () => toast('Select and copy the address')); };
    $('setClientId').value = SG.store.get('client_id', '');
    $('setClientSave').onclick = () => {
      const v = $('setClientId').value.trim();
      if (!/^[0-9a-f]{32}$/i.test(v)) { $('setClientErr').textContent = 'That doesn’t look like a Client ID — it is 32 letters and numbers (0–9, a–f). Make sure you copied the Client ID, not the secret.'; return; }
      $('setClientErr').textContent = '';
      SG.store.set('client_id', v); SG.Spotify.logout(); SG.Spotify.login('index.html');
    };
    $('setClientReset').onclick = () => { SG.store.set('client_id', ''); SG.Spotify.logout(); $('setClientId').value = ''; toast('Using the site’s Spotify app'); openSettings(); };
    $('setDisconnect').onclick = () => { SG.Spotify.logout(); myPlaylists = null; openSettings(); };
    let deb;
    $('guessInput').addEventListener('input', () => { clearTimeout(deb); sel = 0; deb = setTimeout(renderSugg, 90); });
    $('guessInput').addEventListener('blur', () => setTimeout(hideSugg, 150));
    $('guessInput').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, results.length - 1); renderSugg(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); renderSugg(); e.preventDefault(); }
      else if (e.key === 'Enter') { if (results[sel]) guess(results[sel].song); e.preventDefault(); }
      else if (e.key === 'Escape') hideSugg();
    });
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); playClip(); }
      else if (e.key === 'S' && e.shiftKey) skip();
      else if (e.key === 'n' || e.key === 'N') { if (st.over) newRound(); }
    });
  }

  async function init() {
    buildStatic(); wire();
    $('lyrToggle').checked = SG.settings.lyricSearch;
    st.lib = await SG.loadLibrary();
    st.songs = st.lib.songs.filter((s) => s.uri);
    loadTuning();
    const saved = loadGame();
    onFilters(true); renderStage();
    loadLyrics();
    const first = st.songs[0] && st.songs[0].uri;
    players = ['embedA', 'embedB'].map((id) => new SG.SpotifyClipPlayer($(id), { height: 152, uri: first }));
    players[0].ready.then(() => showPlayer(player));
    player = players[0];
    window.__player = player;
    newRound(saved);
    renderMe();
    syncIdentity().then((ok) => { if (!ok) askName(); });
    if (location.hash === '#ownapp') { history.replaceState(null, '', location.pathname); openSettings(true); }
  }
  init();
})();
