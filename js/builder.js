/* Library builder: Spotify lookup + LRCLIB lyrics + hook (most recognisable part) detection. */
(function () {
  const SG = (window.SG = window.SG || {});
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  SG.parseSeeds = function (text) {
    const out = [];
    let lang = 'hi';
    (text || '').split(/\r?\n/).forEach((line) => {
      const l = line.trim();
      if (!l || l.startsWith('//')) return;
      const m = l.match(/^##\s*(\w+)/);
      if (m) { lang = m[1].toLowerCase(); return; }
      const p = l.split('|').map((x) => x.trim());
      if (p.length < 2) return;
      const tags = (p[4] || 'O').split(/[\s,]+/).filter((g) => SG.GENRES[g]);
      out.push({ title: p[0], artist: p[1], movie: p[2] || '', year: +p[3] || 0, genres: tags.length ? tags : ['O'], lang });
    });
    return out;
  };
  SG.seedKey = (s) => SG.norm(s.title) + '|' + SG.norm(s.artist);

  /* ---------- Spotify matching ---------- */
  const BAD = /\b(remix|mix|lofi|lo fi|lo-fi|slowed|reverb|karaoke|instrumental|cover|reprise|unplugged|mashup|sped up|8d|live|acoustic|female version|male version|jhankar|revival|recreated|remake|chillwave|chill|trap|drill|flip|rework|bass|dj|tribute|lounge|piano|flute|guitar|beats|nightcore|phonk|reggae|jazz|unwind|sad)\b/i;
  SG.isBadVersion = (name) => BAD.test(name || '');
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m || !n) return Math.max(m, n);
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }
  const sq = (x) => SG.phon(x).replace(/ /g, '');
  function sim(a, b) { a = sq(a); b = sq(b); if (!a || !b) return 0; return 1 - lev(a, b) / Math.max(a.length, b.length); }
  function scoreTrack(t, seed) {
    const full = t.name;
    const base = SG.cleanTitle(full).split(' - ')[0].replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    const suffix = (SG.cleanTitle(full).split(' - ')[1] || '') + ' ' + ((full.match(/\(([^)]*)\)/) || [])[1] || '');
    const ts = sim(base, seed.title);
    let s = 0;
    if (ts >= 0.92) s += 4; else if (ts >= 0.78) s += 3; else if (sq(base).includes(sq(seed.title)) || sq(seed.title).includes(sq(base))) s += 1.5; else return -99;
    const sa = sq(seed.artist);
    const arts = t.artists.map((a) => sq(a.name));
    const artistHit = arts.some((a) => a === sa || (a.length > 3 && (a.includes(sa) || sa.includes(a))));
    if (artistHit) s += 3;
    const album = sq(t.album && t.album.name);
    const mv = sq(seed.movie);
    const albumHit = mv && album && (album.includes(mv) || mv.includes(album) || sim(t.album.name, seed.movie) > 0.8);
    if (albumHit) s += 2;
    if (!artistHit && !albumHit) return -99;
    if ((BAD.test(suffix) || BAD.test(full)) && !BAD.test(seed.title)) s -= 6;
    if (t.album && /\b(lofi|lo-fi|remix|cover|karaoke|instrumental|chill|mashup)\b/i.test(t.album.name)) s -= 4;
    const yr = +((t.album && t.album.release_date) || '').slice(0, 4);
    if (seed.year && yr && Math.abs(yr - seed.year) <= 1) s += 1;
    return s;
  }
  SG.findOnSpotify = async function (seed) {
    const qs = [
      `${seed.title} ${seed.artist}`,
      `track:${seed.title} artist:${seed.artist}`,
      `${seed.title} ${seed.movie || ''}`.trim(),
      seed.title,
    ];
    let best = null, bestScore = -99;
    for (const q of qs) {
      let items = [];
      try { items = await SG.Spotify.searchTracks(q, 10); } catch (e) { if (e.status === 400) continue; throw e; }
      for (const t of items) { const sc = scoreTrack(t, seed); if (sc > bestScore) { best = t; bestScore = sc; } }
      if (bestScore >= 8) break;
    }
    return bestScore >= 5 ? best : null;
  };

  /* ---------- LRCLIB ---------- */
  async function lrc(path, params) {
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch('https://lrclib.net/api/' + path + '?' + new URLSearchParams(params));
        if (r.status === 404) return null;
        if (r.ok) return r.json();
      } catch (e) {}
      await sleep(800 * (i + 1));
    }
    return null;
  }
  function pickLyrics(cands, durS, title) {
    const st = SG.norm(title);
    const ok = (cands || []).filter((c) => c && !c.instrumental && (c.syncedLyrics || c.plainLyrics) && (() => {
      const ct = SG.norm(SG.cleanTitle(c.trackName || ''));
      return ct === st || ct.includes(st) || st.includes(ct);
    })());
    const diff = (c) => Math.abs((c.duration || 0) - durS);
    const synced = ok.filter((c) => c.syncedLyrics).sort((a, b) => diff(a) - diff(b));
    if (synced[0] && diff(synced[0]) <= 3) return { c: synced[0], timed: true };
    if (synced[0] && diff(synced[0]) <= 8) return { c: synced[0], timed: true, loose: true };
    const plain = ok.sort((a, b) => diff(a) - diff(b))[0];
    return plain ? { c: plain, timed: false } : null;
  }
  SG.fetchLyrics = async function (title, artist, album, durS) {
    const t = SG.cleanTitle(title);
    let cands = [];
    const exact = await lrc('get', { track_name: t, artist_name: artist, album_name: album || '', duration: Math.round(durS) });
    if (exact) cands.push(exact);
    let pick = pickLyrics(cands, durS, t);
    if (!pick || !pick.timed || pick.loose) {
      const s1 = await lrc('search', { track_name: t, artist_name: artist });
      if (s1) cands = cands.concat(s1);
      pick = pickLyrics(cands, durS, t);
    }
    if (!pick || !pick.timed) {
      const s2 = await lrc('search', { q: t + ' ' + artist });
      if (s2) cands = cands.concat(s2);
      pick = pickLyrics(cands, durS, t) || pick;
    }
    return pick;
  };

  SG.parseLrc = function (txt) {
    const lines = [];
    (txt || '').split(/\r?\n/).forEach((l) => {
      const tags = [...l.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
      const text = l.replace(/\[[^\]]*\]/g, '').trim();
      tags.forEach((m) => lines.push({ t: (+m[1] * 60 + +m[2]) * 1000, text }));
    });
    return lines.sort((a, b) => a.t - b.t);
  };

  const FILLER = /^(oh|ooh|o|ah|aah|aa|la|na|hey|hmm|mm|yeah|ye|ho|haa|ha|hoo|uh|whoa|woah|baby|o o|re)$/;
  /** Pick the most recognisable lyric line: the hook/chorus/mukhda. */
  SG.detectHook = function (synced, title, durMs) {
    const lines = synced.filter((l) => l.text);
    if (!lines.length) return null;
    // broken timing (everything at 0:00 or in the first few seconds) -> unusable
    if (lines.length > 4 && lines[lines.length - 1].t < 15000) return null;
    const groups = new Map();
    lines.forEach((l, i) => {
      const k = SG.phon(l.text);
      const words = k.split(' ').filter((w) => w && !FILLER.test(w));
      if (words.length < 2) return;
      if (!groups.has(k)) groups.set(k, { k, text: l.text, times: [], words: words.length, idx: i });
      groups.get(k).times.push(l.t);
    });
    const tp = SG.phon(SG.cleanTitle(title));
    const tw = tp.split(' ').filter((w) => w.length > 1);
    let best = null, bestScore = -1;
    for (const g of groups.values()) {
      let sc = g.times.length * Math.min(g.words, 7);
      const hasTitle = tw.length && tw.every((w) => (' ' + g.k + ' ').includes(' ' + w));
      if (hasTitle) sc *= g.times.length > 1 ? 2.2 : 1.6;
      if (g.times.length === 1 && !hasTitle) sc *= 0.5;
      const first = g.times[0];
      if (durMs && first > durMs * 0.75) sc *= 0.5;   // avoid hooks that only appear at the very end
      if (first < 4000) sc *= 0.85;                   // a line at 0:00 often has no music under it yet
      if (sc > bestScore) { bestScore = sc; best = g; }
    }
    if (!best) {
      const l = lines.find((x) => x.t > 8000) || lines[0];
      return { hookMs: Math.max(0, l.t - 400), hookLine: l.text, how: 'first-line' };
    }
    // if the chosen line has earlier lines just before it that belong to the same phrase, start a bit before
    // an occurrence after the intro is easier to recognise than one at 0:00
    const start = best.times.find((t) => t >= 8000) ?? best.times[0];
    return { hookMs: Math.max(0, start - 400), hookLine: best.text, how: 'repeat x' + best.times.length };
  };

  /**
   * Up to 6 recognisable lines to start a clip from: each round picks one at random.
   * Returns [[startMs, lineText], ...]; the first entry is the main hook.
   * Lines need 3+ real words, must be sung after the intro and before the outro; repeated lines
   * (chorus / mukhda) and lines with the title rank higher; each distinct line is used once.
   */
  SG.pickCues = function (synced, title, durMs) {
    const lines = synced.filter((l) => l.text);
    if (lines.length < 3 || lines[lines.length - 1].t < 15000) return [];
    const tw = SG.phon(SG.cleanTitle(title)).split(' ').filter((w) => w.length > 1);
    const groups = new Map();
    lines.forEach((l) => {
      if (l.t < 5000 || (durMs && l.t > durMs - 15000)) return;
      const k = SG.phon(l.text);
      const words = k.split(' ').filter((w) => w && !FILLER.test(w));
      if (words.length < 3) return;
      if (!groups.has(k)) groups.set(k, { text: l.text, times: [], words: words.length, k });
      groups.get(k).times.push(l.t);
    });
    const scored = Array.from(groups.values()).map((g) => {
      let sc = g.times.length * 2 + Math.min(g.words, 7) / 2;
      if (tw.length && tw.every((w) => (' ' + g.k + ' ').includes(' ' + w))) sc += 4;
      return { g, sc };
    }).sort((a, b) => b.sc - a.sc);
    const out = [];
    const used = [];
    for (const { g } of scored) {
      const t = g.times.find((x) => x >= 8000) ?? g.times[0];
      if (used.some((u) => Math.abs(u - t) < 6000)) continue; // spread cues across the song
      used.push(t);
      out.push([Math.max(0, Math.round(t - 400)), g.text.slice(0, 70)]);
      if (out.length >= 6) break;
    }
    return out;
  };

  /* ---------- assemble song from a Spotify track ---------- */
  SG.guessLang = function (lyrics, track) {
    const txt = (lyrics || '') + ' ' + (track ? track.name + ' ' + (track.album && track.album.name) : '');
    if (/[ऀ-ॿ]/.test(txt)) return 'hi';
    const w = SG.norm(txt).split(' ');
    const hi = ['hai', 'main', 'tera', 'mera', 'tujhe', 'mujhe', 'dil', 'pyar', 'pyaar', 'tum', 'hum', 'ke', 'ki', 'ka', 'nahi', 'na', 'yeh', 'jo', 'se', 'ko', 'kya', 'teri', 'meri', 'ishq', 'jaana', 'sanam', 'yaar', 'mahi'];
    const en = ['the', 'you', 'and', 'i', 'me', 'my', 'to', 'is', 'it', 'in', 'love', 'your', 'that', 'what', 'baby', 'know', 'we', 'on', 'be', 'all'];
    let h = 0, e = 0;
    w.forEach((x) => { if (hi.includes(x)) h++; if (en.includes(x)) e++; });
    return h > e ? 'hi' : 'en';
  };

  SG.buildSong = async function (track, meta = {}) {
    const durMs = track.duration_ms;
    const artists = track.artists.map((a) => a.name);
    const song = {
      id: track.id, uri: track.uri, title: meta.title || SG.cleanTitle(track.name), spotifyTitle: track.name,
      artists, movie: meta.movie || track.album.name, album: track.album.name,
      year: meta.year || +((track.album.release_date || '').slice(0, 4)) || 0,
      genres: meta.genres || ['O'], lang: meta.lang || null,
      cover: (track.album.images && (track.album.images[1] || track.album.images[0]) || {}).url || '',
      durationMs: durMs, source: meta.source || 'spotify', albumId: track.album.id || undefined,
    };
    let pick = null;
    try { pick = await SG.fetchLyrics(track.name, artists[0], track.album.name, durMs / 1000); } catch (e) {}
    if (pick) {
      const c = pick.c;
      song.lrclibId = c.id;
      const synced = pick.timed ? SG.parseLrc(c.syncedLyrics) : [];
      song.lyrics = c.plainLyrics || synced.map((l) => l.text).join('\n');
      if (synced.length) {
        const h = SG.detectHook(synced, song.title, durMs);
        if (h) { song.hookMs = h.hookMs; song.hookLine = h.hookLine; song.hookSource = pick.loose ? 'lyrics~' : 'lyrics'; song.hookHow = h.how; }
        const cues = SG.pickCues(synced, song.title, durMs);
        if (cues.length) song.cues = cues;
      }
    }
    if (song.hookMs == null) {
      song.hookMs = Math.round(Math.min(durMs * 0.3, 75000) / 1000) * 1000;
      song.hookSource = 'estimate';
    }
    if (!song.lang) song.lang = SG.guessLang(song.lyrics, track);
    if (meta.autoGenres) song.genres = SG.autoGenres(song, meta.genres || []);
    return song;
  };

  /* ---------- genre auto-tagging (title + lyrics keywords, artist lists) ---------- */
  const KW = {
    R: 'pyar pyaar ishq mohabbat sanam dil jaan jaana mehboob saathiya chahat chaahat chahun aashiqui deewana deewani mahi sajna sajan humsafar love baby darling heart kiss hold forever beautiful',
    S: 'dard judaa juda tanha tanhai aansu bewafa alvida gham rona roye toota tadap bichad khoya door dooriyan yaadein sad cry crying tears alone goodbye broken hurt pain lonely miss sorry gone',
    P: 'dance nach nacho naache nachle thumka disco dj club jhoom jhoomo party beat floor tonight daaru sharaab botal shake move groove bass naachna dhol baje radio',
    U: 'maula khwaja ali allah rabba rab ibadat sajda kalma nabi qalandar dua ishqa fakira ruh rooh sufi peer dargah ibaadat',
    M: 'zinda jeet himmat desh watan bharat hindustan sapne jeena rise fight champion believer strong dream hero chak',
    J: 'tenu menu kudi munde munda jatt gabru tusi sanu assi mainu ni ve sohneya pind yaar balle',
  };
  const KWS = Object.fromEntries(Object.entries(KW).map(([k, v]) => [k, new Set(v.split(' ').map(SG.phonWord))]));
  const RAP = /\b(badshah|raftaar|divine|emiway|king|honey singh|mc stan|naezy|ikka|seedhe maut|krsna|krishna|eminem|drake|kendrick|kanye|jay-z|travis scott|50 cent|juice wrld|xxxtentacion|j\. cole|lil |snoop|dr\. dre|2pac|notorious|nicki minaj|cardi b|migos|wiz khalifa|post malone|kid cudi)\b/i;
  const PUNJABI = /\b(diljit|ap dhillon|karan aujla|guru randhawa|sidhu moose wala|harrdy sandhu|jass manak|shubh|ammy virk|jasmine sandlas|gurdas maan|daler mehndi|panjabi mc|b praak|garry sandhu|the doorbeen|sukh-e|parmish verma|inderpal moga|navv inder)\b/i;
  SG.autoGenres = function (song, defaults) {
    const words = SG.phon((song.title + ' ').repeat(3) + ' ' + (song.lyrics || '')).split(' ');
    const score = {};
    words.forEach((w) => { for (const k in KWS) if (KWS[k].has(w)) score[k] = (score[k] || 0) + 1; });
    const n = Math.max(1, words.length / 120);
    const out = new Set(defaults || []);
    Object.entries(score).filter(([k, v]) => v / n >= (k === 'J' ? 4 : 3)).sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([k]) => out.add(k));
    const arts = song.artists.join(', ');
    if (RAP.test(arts)) out.add('H');
    if (PUNJABI.test(arts)) out.add('J');
    if (!out.size) out.add(song.lang === 'hi' ? 'R' : 'O');
    return Array.from(out).slice(0, 3);
  };

  /* ---------- whole albums / soundtracks ---------- */
  SG.parseAlbums = function (text) {
    const out = [];
    let lang = 'hi';
    (text || '').split(/\r?\n/).forEach((line) => {
      const l = line.trim();
      if (!l || l.startsWith('//')) return;
      const m = l.match(/^##\s*(\w+)/);
      if (m) { lang = m[1].toLowerCase(); return; }
      const p = l.split('|').map((x) => x.trim());
      if (lang === 'hi') out.push({ lang, name: p[0], artist: '', year: +p[1] || 0, genres: (p[2] || '').split(/\s+/).filter((g) => SG.GENRES[g]) });
      else out.push({ lang, name: p[0], artist: p[1] || '', year: +p[2] || 0, genres: (p[3] || '').split(/\s+/).filter((g) => SG.GENRES[g]) });
    });
    return out;
  };
  SG.albumKey = (a) => a.lang + '|' + SG.norm(a.name) + '|' + SG.norm(a.artist) + '|' + a.year;
  const cleanAlbum = (n) => String(n || '').replace(/\s*[\(\[][^\)\]]*(soundtrack|motion picture|ost|deluxe|edition|remaster|expanded|version|original)[^\)\]]*[\)\]]/gi, '').replace(/\s+-\s+(original|soundtrack|ost|deluxe).*$/i, '').trim();
  function scoreAlbum(al, entry) {
    const s1 = sim(cleanAlbum(al.name), entry.name);
    if (s1 < 0.72) return -99;
    let s = s1 * 5;
    const yr = +((al.release_date || '').slice(0, 4));
    if (entry.year && yr) { const d = Math.abs(yr - entry.year); if (d <= 1) s += 3; else if (entry.lang === 'en' && d <= 3) s += 1; else if (d > 6) s -= 4; else s -= 1; }
    const arts = (al.artists || []).map((a) => sq(a.name));
    if (entry.artist) { const sa = sq(entry.artist); if (arts.some((a) => a === sa || (a.length > 3 && (a.includes(sa) || sa.includes(a))))) s += 3; else s -= 4; }
    if (entry.lang === 'hi' && /soundtrack|motion picture|ost/i.test(al.name)) s += 1;
    if (/\b(lofi|lo-fi|remix|karaoke|instrumental|cover|tribute|8d|slowed|jhankar|reprise|unplugged|mashup)\b/i.test(al.name)) s -= 6;
    if (al.album_type === 'single' && (al.total_tracks || 0) < 3) s -= 3;
    return s;
  }
  SG.scoreAlbum = scoreAlbum;
  // Spotify artist IDs for the English albums list, so albums can be found from discographies
  // when Spotify's search endpoint is rate-limited. Each ID is verified by name before use.
  SG.KNOWN_ARTISTS = {
    'Ed Sheeran': '6eUKZXaKkcviH0Ku9w2n3V', 'The Weeknd': '1Xyo4u8uXC1ZmMpatF05PJ', 'Taylor Swift': '06HL4z0CvFAxyc27GXpf02',
    'Drake': '3TVXtAsR1Inumwj472S9r4', 'Eminem': '7dGJo4pcD2V6oG8kP0tJRR', 'Coldplay': '4gzpq5DPGxSnKTe4SA8HAU', 'Queen': '1dfeR4HaWDbWqFHLkxsg1d',
    'Michael Jackson': '3fMbdgg4jU18AjLCKBhRSm', 'Adele': '4dpARuHxo51G3z768sgnrY', 'Bruno Mars': '0du5cEVh5yTK9QJze8zA0C', 'Rihanna': '5pKCCKE2ajJHZ9KAiaK11H',
    'Billie Eilish': '6qqNVTkY8uBg9cP3Jd7DAH', 'Imagine Dragons': '53XhwfbYqKCa1cC15pYq2q', 'Maroon 5': '04gDigrS5kc9YWfZHwBETP', 'Justin Bieber': '1uNFoZAHBGtllmzznpCI3s',
    'Ariana Grande': '66CXWjxzNUsdJxJ2JdwvnR', 'Dua Lipa': '6M2wZ9GZgrQXHCFfjv46we', 'Post Malone': '246dkjvS1zLTtiykXe5h60', 'Linkin Park': '6XyY86QOPPrYVGvF9ch6wz',
    'Katy Perry': '6jJ0s89eD6GaHleKKya26X', 'Lady Gaga': '1HY2Jd0NmPuamShAr6KMms', 'Kendrick Lamar': '2YZyLoL8N0Wb9xBt1NhZWg', 'Kanye West': '5K4W6rqBFWDnAN6FQUkS6x',
    'Shawn Mendes': '7n2wHs1TKAczGzO7Dd2rGr', 'Sia': '5WUlDfRSoLAfcVSX1WnrxN', 'One Direction': '4AK6F7OLvEQ5QYCBNiQWHq', 'Harry Styles': '6KImCVD70vtIoJWnq6nGn3',
    'Avicii': '1vCWHaC5f2uS3yhpwWbIA6', 'The Chainsmokers': '69GGBxA162lTqCwzJG5jLp', 'Calvin Harris': '7CajNmpbOovFoOoasH2HaY', 'David Guetta': '1Cs0zKBU1kc0i8ypK3B9ai',
    'ABBA': '0LcJLqbBmaGUft1e9Mm8HV', 'The Beatles': '3WrFJ7ztbogyGnTHbHJFl2', 'AC/DC': '711MCceyCBcFnzjGY4Q7Un', "Guns N' Roses": '3qm84nBOXUEQ2vnTfUTTFC',
    'Bon Jovi': '58lV9VcRSjABbAbfWS6skp', 'Pink Floyd': '0k17h0D3J5VfsdmQ1iZtE9', 'Led Zeppelin': '36QJpDe2go2KgaRleHCDTp', 'Eagles': '0ECwFtbIWEVNwjlrfc6xoL',
    'Green Day': '7oPftvlwr6VrsViSDV7fJY', 'Nirvana': '6olE6TJLqED3rqDCT0FyPh', 'Oasis': '2DaxqgrOhkeH0fpeiQq2f4', 'Arctic Monkeys': '7Ln80lUS6He07XvHI8qqHH',
    'Twenty One Pilots': '3YQKmKGau1PzlVlkL1iodx', 'OneRepublic': '5Pwc4xIPtQLFEnJriah9YJ', 'Beyoncé': '6vWDO969PvNqNYHIOW5v0m', 'Usher': '23zg3TcAtWQy7J6upgbUnj',
    'Backstreet Boys': '5rSXSAkZ67PYJSvpUpkOr7', 'Britney Spears': '26dSoYclwsYLMAKD3tpOr4', 'Shakira': '0EmeFodog0BfCgMzAIvKQp', 'Sam Smith': '2wY79sveU1sp5g7SokKOiI',
    'Charlie Puth': '6VuMaDnrHyPL1p4EHjYLi7', 'Olivia Rodrigo': '1McMsnEElThX1knmY4oliG', 'SZA': '7tYKF4w9nC0nq9CsPZTHyP', 'Doja Cat': '5cj0lLjcoR7YOSnhnX0Po5',
    'Travis Scott': '0Y5tJX1MQlPlqiwlOH1tJY', 'Juice WRLD': '4MCBfE4596Uoi2O4DtmEMz', '50 Cent': '3q7HBObVc0L8jNeTe5Gofh', 'JAY-Z': '3nFkdlSjzX9mRTtwJOzDYB',
    'Avril Lavigne': '0p4nmQO2msCgU4IF37Wi3j', 'Celine Dion': '4S9EykWXhStSc15wEx8QFK', 'Whitney Houston': '6XpaIBNiVzIetEPCWDvAFP', 'Bryan Adams': '3Z02hBLubJxuFJfhacLSDc',
    'Lewis Capaldi': '4GNC7GD6oZMSxPGyXy4MNB', 'The Killers': '0C0XlULifJtAgn6ZNCW2eu', 'Red Hot Chili Peppers': '0L8ExT028jH3ddEcZwqJJ5', 'Metallica': '2ye2Wgw4gimLv2eAKyk1NB',
    'Daft Punk': '4tZwfgrHOc3mvqYlEYSvVi', 'Pitbull': '0TnOYISbd1XYRBk9myaseg', 'Lana Del Rey': '00FQb4jTyendYWaN8pK0wa', 'Selena Gomez': '0C8ZW7ezQVs4URX5aX7Kqx',
    'Miley Cyrus': '5YGY8feqx7naU7z4HrwZM6', 'Alan Walker': '7vk5e3vY1uw9plTHJAMwjN', 'Major Lazer': '738wLrAtLtCtFOLvQBXOXp', 'DJ Snake': '540vIaP2JwjQb9dm3aArA4',
    'Hozier': '2FXC3k01G6Gw61bmprjgqS', 'Halsey': '26VFTg2z8YR0cCuwLzESi2', 'Lauv': '5JZ7CnR6gTvEMKX4g70Amv', 'Khalid': '6LuN9FCkKOj5PcnpouEgny',
    'Camila Cabello': '4nDoRrQiYLoBzwC5BhVJzF', 'Jason Derulo': '07YZf4WDAMNwqr4jfgOZ8y', 'Akon': '0z4gvV4rjIZ9wHck67ucSV', 'Sean Paul': '3Isy6kedDrgPYoTS1dazA9',
    'Lord Huron': '6ltzsmQQbmdoHHbLZ4ZN25', 'Glass Animals': '4yvcSjfu4PC0CYQyLy4wSq', 'The Neighbourhood': '77SW9BnxLY8rJ0RciFqkHh', 'Tom Odell': '2txHhyCwHjUEpJjWrEyqyX',
    'James Arthur': '4IWBUUAFIplrNtaOHcJPRM', 'John Legend': '5y2Xq6xcjJb2jVM54GHK3t', 'Passenger': '0gadJ2b9A4SKsB1RFkBb66', 'Vance Joy': '10exVja0key0uqUkk6LJRT',
    'Måneskin': '0lAWpj5szCSwM4rUMHYmrr', 'Frank Sinatra': '1Mxqyy3pSjf8kZZL4QVxS0', 'Louis Armstrong': '19eLuQmk9aCobbVDHc6eek', 'Kesha': '6LqNN22kT3074XbTVUrhzX',
    'Black Eyed Peas': '1yxSLGMDHlW21z4YXirZDS', 'LMFAO': '3sgFRtyBnxXD5ESfmbK4dl', 'Mark Ronson': '3hv9jJF3adDNsBSIQDqcjp', 'Justin Timberlake': '31TPClRtHm23RisEBtV3X7',
    'Outkast': '1G9G7WwrXka3Z1r7aIDjI7', 'Clean Bandit': '6MDME20pz9RveH9rEXvrOM', 'Wiz Khalifa': '137W8MRPWKqSmrBGDBFSop', 'Lil Nas X': '7jVv8c5Fj3E9VhNjxT4snq',
    'Nicki Minaj': '0hCNtLu0JehylgoiP8L4Gh', 'Cardi B': '4kYSro6naA4h99UJvo89HB', 'Migos': '6oMuImdp5ZcFhWP0ESe6mG', 'Kid Cudi': '0fA0VVWsXO9YnASrzqfmYu',
    'XXXTENTACION': '15UsOTVnJzReFVN1VCnxy4', 'J. Cole': '6l3HvQ5sa6mXTsMTB19rO5', 'Lil Wayne': '55Aa2cqylxrFIXC767Z865', 'Snoop Dogg': '7hJcb9fa4alzcOq3EaNPoG',
    'Dr. Dre': '6DPYiyq5kWVQS4RGwxzPC7', '2Pac': '1ZwdS5xdxEREPySFridCfh', 'The Notorious B.I.G.': '5me0Irg2ANcsgc93uaYrpb', 'Frank Ocean': '2h93pZq0e7k5yf4dywlkpM',
    'Florence + The Machine': '1moxjboGR7GNWYIMWsRjgG', 'Ellie Goulding': '0X2BH1fck6amBIoJhDVmmJ', 'Lorde': '163tK9Wjr9P9DmM0AVK7lm', 'Bastille': '7EQ0qTo7fWT7DPxmxtSYEc',
    'Mumford & Sons': '3gd8FJtBJtkRxdfbTu19U2', 'Muse': '12Chz98pHFMPJEknJQMWvI', 'Kings of Leon': '2qk9voo8llSGYcZ6xrBzKx', 'Paramore': '74XFHRwlV6OrjEM0A2NCMF',
    'My Chemical Romance': '7FBcuc1gsnv6Y1nwFtNRCb', 'Fall Out Boy': '4UXqAaa6dQYAk18Lv7PEgX', 'Panic! At The Disco': '20JZFwl6HVl6yg8a4H3ZqK', 'Evanescence': '5nGIFgo0shDenQYSE0Sn7c',
    'System Of A Down': '5eAWCfyUhZtHHtBdNk56l1', 'Radiohead': '4Z8W4fKeB5YxbusRsdQVPb', 'U2': '51Blml2LZPmy7TTiAg47vQ', 'The Police': '5NGO30tJxFlKixkPSgXcFE',
    'Dire Straits': '0WwSkZ7LtFUFjGjMZBMt6T', 'TOTO': '0PFtn5NtBbbUNbU9EAmIWF', 'Journey': '0rvjqX7ttXeg3mTy8Xscbt', 'a-ha': '2jzc5TC5TVFLXQlBNiIUzE',
    'Fleetwood Mac': '08GQAI4eElDnROBrJRGE0X', 'Bob Marley & The Wailers': '2QsynagSdAqZj3U9HgDzjD', 'Elton John': '3PhoLpVuITZKcymswpck5b', 'Elvis Presley': '43ZHCT0cAZBISjO8DG9PnE',
    'Bee Gees': '1LZEQNv7sE11VDY3SdxQeN', 'George Michael': '19ra5tSw0tWufvUp8GotLo', 'Madonna': '6tbjWDEIzxoDsBA1FuhfPW', 'Prince': '5a2EaR3hamoenG9rDuVn8j',
    'Bruce Springsteen': '3eqjTLE0HfPfh78zjh6TqT', 'Stevie Wonder': '7guDJrEfX3qb6FEbdPA5qi', 'The Rolling Stones': '22bE4uQ6baNwSHPVcDxLCe', 'Simon & Garfunkel': '70cRZdQywnSFp9pnc2WTCE',
    'Mariah Carey': '4iHNK0tOyZPYnBU7nGAgpQ', 'Christina Aguilera': '1l7ZsJRRS8wlW3WfJfPfNS', 'Shania Twain': '5e4Dhzv426EvQe3aDb64jL', 'Alanis Morissette': '6ogn9necmbUdCppmNnGOdi',
    'Pearl Jam': '1w5Kfo2jwwIPruYS2UWh56', 'Def Leppard': '6H1RjVyNruCmrBEWRbD0VZ', 'Van Halen': '2cnMpRsOVqtPMfq7YiFE6K', 'The Doors': '22WZ7M8sxp5THdruNY3gXt',
    'The Who': '67ea9eGLXYMsO2eYQRui3w', 'Paul Simon': '2CvCyf1gEVhI0mX6aFXmVI', 'John Mayer': '0hEurMDQu99nJRq8pTxO14', 'The Strokes': '0epOFNiUfyON9EYx7Tpr6V',
    'No Doubt': '0cQbJU1aAzvbEmTuljWLlF', 'Carly Rae Jepsen': '6sFIWsNpZYqfjUpaCgueju', 'Gotye': '2AsusXITU8P25dlRNhcAbG', 'Foster The People': '7gP3bB2nilZXLfPHJhMdvc',
    'Amy Winehouse': '6Q192DXotxtaysaqNPy5yR', 'Norah Jones': '2Kx7MNY7cI1ENniW7vT30N', 'James Blunt': '7KMqksf0UMdyA0UCf4R3ux', 'Jason Mraz': '4phGZZrJZRo4ElhRtViYdl',
    'Train': '3FUY2gzHeIiaesXtOAdB7A', 'Owl City': '07QEuhtrNmmZ0zEcqE9SF6', 'Jessie J': '2gsggkzM5R49q6jpPvazou', 'Flo Rida': '0jnsk9HBra6NMjO2oANoPY',
    'Taio Cruz': '6MF9fzBmfXghAz953czmBC', 'Nelly Furtado': '2jw70GZXlAI8QzWeY2bgRc', 'Fergie': '3r17AfJCCUqC9Lf0OAc73G', 'The Pussycat Dolls': '6wPhSqRtPu1UhRCDX5yaDJ',
    'Ne-Yo': '21E3waRsmPlU7jZsS13rcj', 'Chris Brown': '7bXgB6jMjp9ATFy66eO08Z', 'Gorillaz': '3AA28KZvwAUcZuOKwyblJQ', 'MGMT': '0SwO7SWeDHJijQ3XNS7xEE',
    'Foo Fighters': '7jy3rLJdDQY21OgRLCZ9sD', 'Survivor': '26bcq2nyj5GB7uRr558iQg', 'Phil Collins': '4lxfqrEsLX6N1N4OCSkILp', 'Wham!': '5lpH0xAS4fVfLkACg9DAuM',
    'Rick Astley': '0gxyHStUsqpMadRV0Di1Qt', 'Tears For Fears': '4bthk9UfsYUYdcFyqxmSUU', 'Cyndi Lauper': '2BTZIqw0ntH9MvilQ3ewNY', 'Boney M.': '54R6Y0I7jGUCveDTtI21nb',
    'Modern Talking': '6uRJnvQ3f8whVnmeoecv5Z', 'Teddy Swims': '33qOK5uJ8AR2xuQQAhHump', 'Benson Boone': '22wbnEMDvgVIAGdFeek6ET', 'Noah Kahan': '2RQXRUsr4IW1f3mKyKsy4B',
    'Gracie Abrams': '4tuJ0bMpJh08umKkEXKUI5', 'Chappell Roan': '7GlBOeep6PqTfFi59PTUUN', 'Tate McRae': '45dkTj5sMRSjrmBSBeiHym', 'Rema': '46pWGuE3dSwY3bMMXGBvVS',
    'The Kid LAROI': '2tIP7SsRs7vjIcLrU85W8J', 'Conan Gray': '4Uc8Dsxct0oMqx0P6i60ea', 'Alec Benjamin': '5IH6FPUwQTxPSXurCrcIov', 'Sabrina Carpenter': '74KM79TiuVKeVCqs8QtB0B',
    'Fifth Harmony': '1l8Fu6IkuTP0U5QetQJ5Xt', 'Jonas Brothers': '7gOdHgIoIKoe4i9Tta6qdD', 'Demi Lovato': '6S2OmqARrzebs0tKUEyXyp', 'Little Mix': '3e7awlrlDSwF3iM0WBjGMp',
    'Kelly Clarkson': '3BmGtnKgCSGYIUhmivXKWX', 'Nickelback': '6deZN1bslXzeGvOLaLMOIF', 'Simple Plan': '2p4FqHnazRucYQHyDCdBrJ', 'Lifehouse': '5PokPZn11xzZXyXSfnvIM3',
    'The Goo Goo Dolls': '2sil8z5kiy4r76CRTXxBCA', 'Savage Garden': '3NRFinRTEqUCfaTTZmk8ek', 'Westlife': '5Z1CCuBsyhhHt7z8ACTQJo', 'Enrique Iglesias': '7qG3b048QCHVRO5Pv1T5lw',
    'Ricky Martin': '7slfeZO9LsJbWgpkIoXBUJ', 'Aqua': '6kBjAFKyd0he7LiA5GQ3Gz', 'Eiffel 65': '1rPS6UT1wcNdmvjj7ZRfEG', 'Robbie Williams': '2HcwFjNelS49kFbfvMxQYw',
    'Dido': '2mpeljBig2IXLXRAFO9AAs', 'MIKA': '4ScCswdRlyA23odg9thgIO', 'Snow Patrol': '3rIZMv9rysU7JkLzEaC5Jp', 'Keane': '53A0W3U0s8diEn9RhXQhVz',
    'The Script': '3AQRLZ9PuTAozP28Skbq8V', 'Don McLean': '1gRNBaI4yn6wCsPJ7WCYJt', 'John Lennon': '4x1nvY2FN8jxqAFA0DA02H', 'Hugh Jackman': '7GsJYJFmrHlwMqdrqFt6bR',
    'Meat Loaf': '7dnB1wSxbYa8CejeVg98hz', 'The Jimi Hendrix Experience': '776Uo845nYHJpNaStv1Ds4', 'Franz Ferdinand': '0XNa1vTidXlvJ2gHSsRi4A', 'Robyn': '6UE7nl9mha6s8z0wFQFIZ2',
    'Kylie Minogue': '4RVnAU35WRWra6OZ3CbbMA', 'Gloria Gaynor': '4hz8tIajF2INpgM0qzPJz2', 'Stephen Sanchez': '5XKFrudbV4IiuE5WuTPRmT', 'Lukas Graham': '25u4wHJWxCA9vO0CzxAbK7',
  };
  SG.findAlbum = async function (entry) {
    const qs = entry.lang === 'en'
      ? [`album:${entry.name} artist:${entry.artist}`, `${entry.name} ${entry.artist}`]
      : [`${entry.name} ${entry.year}`, `${entry.name} soundtrack`, entry.name];
    let best = null, bestScore = -99;
    for (const q of qs) {
      let items = [];
      try { items = await SG.Spotify.searchAlbums(q, 10); } catch (e) { if (e.status === 400) continue; throw e; }
      for (const al of items) { if (!al) continue; const sc = scoreAlbum(al, entry); if (sc > bestScore) { best = al; bestScore = sc; } }
      if (bestScore >= 8) break;
    }
    return bestScore >= 6 ? best : null;
  };
  const SKIP_TRACK = /\b(instrumental|karaoke|theme|reprise|remix|mashup|unplugged|dialogue|dialogues|jhankar|lofi|lo-fi|slowed|8d|interlude|intro|outro|skit|commentary|bgm|background score|tune|sad version|club mix|film version|live)\b/i;
  /** Returns Spotify track objects (with .album attached) worth keeping from an album. */
  SG.albumTracks = async function (album, entry) {
    const full = await SG.Spotify.getAlbum(album.id);
    let tracks = ((full.tracks && full.tracks.items) || []).filter(Boolean);
    const seen = new Set();
    const albumInfo = { id: full.id, name: full.name, release_date: full.release_date, images: full.images || [] };
    const out = [];
    for (const t of tracks) {
      if (!t.id || t.is_playable === false) continue;
      if (t.duration_ms < 90000 || t.duration_ms > 720000) continue;
      if (SKIP_TRACK.test(t.name) && !SKIP_TRACK.test(entry.name)) continue;
      const base = sq(SG.cleanTitle(t.name).split(' - ')[0].replace(/\(.*?\)/g, ''));
      if (seen.has(base)) continue;
      seen.add(base);
      t.album = albumInfo;
      out.push(t);
    }
    return { album: full, tracks: out };
  };

  /* ---------- Wikidata: Spotify IDs without using Spotify search ----------
     Wikidata stores Spotify album IDs (P2205) and track IDs (P2207) for many popular releases. */
  async function sparql(q) {
    for (let i = 0; i < 4; i++) {
      try {
        const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: { Accept: 'application/sparql-results+json' } });
        if (r.status === 429 || r.status >= 500) { await sleep(5000 * (i + 1)); continue; }
        if (!r.ok) return [];
        return (await r.json()).results.bindings;
      } catch (e) { await sleep(3000); }
    }
    return [];
  }
  const lit = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"@en';
  // Wikidata labels must match exactly, so try common spelling variants of a title / artist
  const SMALL = new Set(['a', 'an', 'the', 'at', 'in', 'of', 'on', 'for', 'to', 'and', 'or', 'by', 'with', 'from', 'as', 'but', 'nor']);
  function variants(x) {
    const v = new Set([x]);
    const words = x.split(' ');
    v.add(words.map((w, i) => (i && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(' '));
    v.add(words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));
    v.add(x.toLowerCase());
    Array.from(v).forEach((y) => { if (y.includes('&')) v.add(y.replace(/&/g, 'and')); if (/\band\b/.test(y)) v.add(y.replace(/\band\b/g, '&')); if (y.includes("'")) v.add(y.replace(/'/g, '’')); });
    return Array.from(v).slice(0, 6);
  }
  /** entries with lang 'en': [{name, artist, year}] -> Map(albumKey -> [spotifyAlbumIds]) */
  SG.wdAlbumIds = async function (entries, onProgress) {
    const out = new Map();
    for (let i = 0; i < entries.length; i += 8) {
      const batch = entries.slice(i, i + 8);
      const rowsV = [];
      const back = new Map();
      batch.forEach((e) => variants(e.name).forEach((t) => variants(e.artist).slice(0, 3).forEach((a) => { rowsV.push(`(${lit(t)} ${lit(a)})`); back.set(t + '\u0001' + a, e); })));
      const rows = await sparql(`SELECT ?t ?a ?sp WHERE { VALUES (?t ?a) { ${rowsV.join(' ')} } ?album rdfs:label ?t; wdt:P175 ?ar; wdt:P2205 ?sp. ?ar rdfs:label ?a. }`);
      rows.forEach((b) => {
        const e = back.get(b.t.value + '\u0001' + b.a.value);
        if (!e) return;
        const k = SG.albumKey(e);
        if (!out.has(k)) out.set(k, []);
        if (!out.get(k).includes(b.sp.value)) out.get(k).push(b.sp.value);
      });
      onProgress && onProgress(Math.min(1, (i + 8) / entries.length));
      await sleep(1000);
    }
    return out;
  };
  /** Hindi film soundtracks: label "<Film>" or "<Film> (soundtrack)" with a Spotify album ID */
  SG.wdSoundtrackIds = async function (entries, onProgress) {
    const out = new Map();
    for (let i = 0; i < entries.length; i += 30) {
      const batch = entries.slice(i, i + 30);
      const vals = batch.map((e) => `${lit(e.name)} ${lit(e.name + ' (soundtrack)')}`).join(' ');
      const rows = await sparql(`SELECT ?t ?sp ?d WHERE { VALUES ?t { ${vals} } ?album rdfs:label ?t; wdt:P2205 ?sp. OPTIONAL { ?album wdt:P577 ?d } }`);
      rows.forEach((b) => {
        const name = b.t.value.replace(/ \(soundtrack\)$/, '');
        const yr = b.d ? +b.d.value.slice(0, 4) : 0;
        const e = batch.find((x) => x.name === name && (!yr || Math.abs(yr - x.year) <= 1));
        if (!e) return;
        const k = SG.albumKey(e);
        if (!out.has(k)) out.set(k, []);
        if (!out.get(k).includes(b.sp.value)) out.get(k).push(b.sp.value);
      });
      onProgress && onProgress(Math.min(1, (i + 30) / entries.length));
      await sleep(1200);
    }
    return out;
  };
  /** seeds [{title, artist}] -> Map(seedKey -> [spotifyTrackIds]) */
  SG.wdTrackIds = async function (seeds, onProgress) {
    const out = new Map();
    for (let i = 0; i < seeds.length; i += 25) {
      const batch = seeds.slice(i, i + 25);
      const vals = batch.map((e) => `(${lit(e.title)} ${lit(e.artist)})`).join(' ');
      const rows = await sparql(`SELECT ?t ?a ?sp WHERE { VALUES (?t ?a) { ${vals} } ?song rdfs:label ?t; wdt:P175 ?ar; wdt:P2207 ?sp. ?ar rdfs:label ?a. }`);
      rows.forEach((b) => {
        const e = batch.find((x) => x.title === b.t.value && x.artist === b.a.value);
        if (!e) return;
        const k = SG.seedKey(e);
        if (!out.has(k)) out.set(k, []);
        if (!out.get(k).includes(b.sp.value)) out.get(k).push(b.sp.value);
      });
      onProgress && onProgress(Math.min(1, (i + 25) / seeds.length));
      await sleep(1200);
    }
    return out;
  };

  /* ---------- well-known songs straight from Wikidata (no Spotify API calls) ----------
     Every song here has its own Wikipedia article (= a notable single) and a Spotify track ID on Wikidata. */
  const ANGLO = new Set(['Q30', 'Q145', 'Q16', 'Q408', 'Q27', 'Q664', 'Q21', 'Q22', 'Q25', 'Q230791', 'Q174193']);
  const GENRE_MAP = [[/rock|metal|punk|grunge|alternative/i, 'K'], [/hip.?hop|rap|trap|drill/i, 'H'], [/r&b|rhythm and blues|soul|funk|neo soul/i, 'N'],
    [/dance|house|edm|electro|disco|techno|trance|dubstep|reggaeton|moombahton/i, 'P'], [/indie|folk|acoustic|singer.songwriter|lo-fi|chill/i, 'C'], [/pop/i, 'O']];
  SG.wdNotableSongs = async function (minLinks = 1) {
    const rows = await sparql(`SELECT ?sid ?sl ?title ?perfLabel ?date ?lang ?cty ?gLabel ?albLabel WHERE {
      ?item wdt:P2207 ?sid; wikibase:sitelinks ?sl. FILTER(?sl >= ${minLinks})
      ?item rdfs:label ?title. FILTER(lang(?title) = 'en')
      OPTIONAL { ?item wdt:P175 ?perf. OPTIONAL { ?perf wdt:P27|wdt:P495 ?cty } }
      OPTIONAL { ?item wdt:P577 ?date }
      OPTIONAL { ?item wdt:P407 ?lang }
      OPTIONAL { ?item wdt:P136 ?g }
      OPTIONAL { ?item wdt:P361 ?alb. ?alb wdt:P31 wd:Q482994 }
      SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }
    }`);
    const qid = (b) => b && b.value.split('/').pop();
    const by = new Map();
    rows.forEach((b) => {
      const id = b.sid.value;
      if (!/^[A-Za-z0-9]{22}$/.test(id)) return;
      let o = by.get(id);
      if (!o) by.set(id, o = { id, title: b.title.value, links: +b.sl.value, artists: [], year: 0, lang: new Set(), cty: new Set(), genres: new Set(), album: '' });
      const pl = b.perfLabel && b.perfLabel.value;
      if (pl && !/^Q\d+$/.test(pl) && !o.artists.includes(pl)) o.artists.push(pl);
      if (b.date) { const y = +b.date.value.slice(0, 4); if (y > 1900 && (!o.year || y < o.year)) o.year = y; }
      if (b.lang) o.lang.add(qid(b.lang));
      if (b.cty) o.cty.add(qid(b.cty));
      if (b.gLabel) GENRE_MAP.forEach(([re, g]) => { if (re.test(b.gLabel.value)) o.genres.add(g); });
      if (b.albLabel && !/^Q\d+$/.test(b.albLabel.value)) o.album = b.albLabel.value;
    });
    return [...by.values()].filter((o) => o.artists.length && o.year &&
      (o.lang.has('Q1860') || (!o.lang.size && [...o.cty].some((c) => ANGLO.has(c)))))
      .map((o) => Object.assign(o, { genres: [...o.genres].slice(0, 2) }))
      .sort((a, b) => b.links - a.links);
  };
  /** Build a song from a Wikidata entry using LRCLIB only (duration + synced lyrics). Returns null without synced lyrics. */
  async function oembed(id) {
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent('https://open.spotify.com/track/' + id));
        if (r.status === 404 || r.status === 400) return null;
        if (r.ok) return r.json();
      } catch (e) {}
      await sleep(1500 * (i + 1));
    }
    return null;
  }
  const NOT_ORIGINAL = /\b(live|remix|mix|cover|karaoke|instrumental|acoustic|demo|performance|from the voice|re-?recorded|sped up|slowed|version)\b/i;
  SG.buildFromWikidata = async function (o) {
    const t = SG.cleanTitle(o.title);
    // check the ID on Spotify's public page info: it must exist and be the original recording
    const em = await oembed(o.id);
    if (!em || !em.title) return null;
    const spT = em.title.replace(/\s*-\s*(\d{4} )?remaster(ed)?.*$/i, '');
    if (NOT_ORIGINAL.test(spT) && !NOT_ORIGINAL.test(o.title)) return null;
    const a = SG.norm(SG.cleanTitle(spT)), b = SG.norm(t);
    if (!(a === b || a.includes(b) || b.includes(a))) return null;
    let res = await lrc('search', { track_name: t, artist_name: o.artists[0] });
    if (!res || !res.length) res = await lrc('search', { q: t + ' ' + o.artists[0] });
    const st = SG.norm(t);
    const c = (res || []).find((x) => x.syncedLyrics && !x.instrumental && x.duration > 60 && (() => {
      const ct = SG.norm(SG.cleanTitle(x.trackName || ''));
      return ct === st || ct.includes(st) || st.includes(ct);
    })());
    if (!c) return null;
    const track = {
      id: o.id, uri: 'spotify:track:' + o.id, name: o.title, artists: o.artists.map((name) => ({ name })),
      album: { name: o.album || c.albumName || o.title, release_date: String(o.year), images: em.thumbnail_url ? [{ url: em.thumbnail_url }] : [] },
      duration_ms: Math.round(c.duration * 1000),
    };
    const song = await SG.buildSong(track, { lang: 'en', year: o.year, genres: o.genres, autoGenres: true, source: 'wikidata' });
    if (!song.cues || !song.cues.length) return null;
    if (!o.album) song.movie = song.album = c.albumName || '';
    return song;
  };

  /* ---------- popular hits by year (Spotify search ranks by popularity) ----------
     Each query is read 10 results at a time (Spotify's limit for hobby apps), only the top `depth` results. */
  SG.hitQueries = function (from = 2010, to = 2020) {
    const hi = [['genre:"filmi"', 'hi', 300], ['genre:"modern bollywood"', 'hi', 300], ['genre:"desi pop"', 'hi', 150], ['genre:"punjabi pop"', 'hi', 150]];
    const en = [['genre:pop', 'en', 300], ['genre:"dance pop"', 'en', 200], ['genre:rap', 'en', 200], ['genre:"hip hop"', 'en', 150],
      ['genre:edm', 'en', 150], ['genre:rock', 'en', 150], ['genre:"r&b"', 'en', 150], ['genre:"pop rap"', 'en', 150]];
    const out = [];
    for (let y = to; y >= from; y--) [...hi, ...en].forEach(([g, lang, depth]) => out.push({ q: `${g} year:${y}`, lang, year: y, depth }));
    return out;
  };
  /** The full plan towards 20,000 songs: 2010–2020 first, then 2021–2025, 2000–2009, and 1990s Bollywood. */
  SG.hitPlan = function () {
    const hi90 = [];
    for (let y = 1999; y >= 1990; y--) [['genre:"filmi"', 300], ['genre:"old bollywood"', 100]].forEach(([g, d]) => hi90.push({ q: `${g} year:${y}`, lang: 'hi', year: y, depth: d }));
    return [...SG.hitQueries(2010, 2020), ...SG.hitQueries(2021, 2025), ...SG.hitQueries(2000, 2009), ...hi90];
  };
  SG.LIBRARY_TARGET = 20000;
})();
