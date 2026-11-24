/* Shared helpers: taxonomy, library loading, text normalisation and search. */
(function () {
  const SG = (window.SG = window.SG || {});

  SG.GENRES = {
    R: 'Romantic', P: 'Party & Dance', S: 'Sad', U: 'Sufi & Soulful', H: 'Hip-Hop & Rap',
    K: 'Rock', O: 'Pop', J: 'Punjabi', M: 'Motivational', C: 'Chill & Indie', N: 'R&B',
  };
  SG.ERAS = [
    { id: 'classic', label: 'Classics', sub: 'before 1990', test: (y) => y < 1990 },
    { id: '90s', label: '90s', sub: '1990–99', test: (y) => y >= 1990 && y < 2000 },
    { id: '00s', label: '00s', sub: '2000–09', test: (y) => y >= 2000 && y < 2010 },
    { id: '10s', label: '10s', sub: '2010–19', test: (y) => y >= 2010 && y < 2020 },
    { id: '20s', label: '20s', sub: '2020+', test: (y) => y >= 2020 },
  ];
  SG.LANGS = { hi: 'Hindi', en: 'English' };
  SG.eraOf = (y) => (SG.ERAS.find((e) => e.test(+y || 2000)) || SG.ERAS[2]).id;

  /* ---------- storage ---------- */
  SG.store = {
    get(k, d) { try { const v = localStorage.getItem('sg_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sg_' + k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ---------- environment & settings ---------- */
  // Local = running from start.bat (has the save server + builder). Anything else = hosted copy.
  SG.isLocal = ['127.0.0.1', 'localhost'].includes(location.hostname);
  SG.settings = Object.assign({ lyricSearch: true }, SG.store.get('settings', {}));
  SG.saveSettings = () => SG.store.set('settings', SG.settings);

  /* ---------- IndexedDB (songs a visitor adds on the hosted site) ---------- */
  SG.idb = {
    _db: null,
    open() {
      if (this._db) return this._db;
      this._db = new Promise((res, rej) => {
        const r = indexedDB.open('songgame', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('songs', { keyPath: 'id' });
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      return this._db;
    },
    async all() {
      try {
        const db = await this.open();
        return await new Promise((res) => { const q = db.transaction('songs').objectStore('songs').getAll(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); });
      } catch (e) { return []; }
    },
    async put(list) {
      const db = await this.open();
      await new Promise((res, rej) => { const tx = db.transaction('songs', 'readwrite'); list.forEach((x) => tx.objectStore('songs').put(x)); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    },
    async del(id) {
      const db = await this.open();
      await new Promise((res) => { const tx = db.transaction('songs', 'readwrite'); tx.objectStore('songs').delete(id); tx.oncomplete = res; tx.onerror = res; });
    },
  };

  /* ---------- library ---------- */
  async function getJSON(url) {
    const r = await fetch(url + (url.includes('?') ? '&' : '?') + 'v=' + (SG.dataVersion || Date.now()), { cache: SG.isLocal ? 'no-store' : 'default' });
    if (!r.ok) throw new Error(url + ' ' + r.status);
    return r.json();
  }
  /**
   * loadLibrary({ full }) — full=true loads every field incl. lyrics in one file (local builder only).
   * Otherwise loads data/songs.json (no lyrics); call SG.loadLyrics(lib) to attach lyrics in the background.
   */
  SG.loadLibrary = async function (opts = {}) {
    let lib = null;
    // locally the full file is always fresh (the builder writes it); the hosted site uses the split files
    if (SG.isLocal) { try { lib = await getJSON('data/library.json'); lib._full = true; } catch (e) {} }
    if (!lib) { try { lib = await getJSON('data/songs.json'); } catch (e) {} }
    if (!lib) { try { lib = await getJSON('data/library.json'); lib._full = true; } catch (e) {} }
    if (!lib) lib = { version: 1, songs: [] };
    if (lib.version === 3 && lib.rows) { lib.songs = lib.rows.map((r, i) => SG.expandSong(r, Math.floor(i / (lib.shard || 800)))); delete lib.rows; }
    lib.songs = lib.songs || [];
    // songs this browser added / edited (hosted site)
    if (!SG.isLocal) {
      const mine = await SG.idb.all();
      const byId = new Map(lib.songs.map((s, i) => [s.id, i]));
      mine.forEach((m) => { m._mine = true; if (byId.has(m.id)) lib.songs[byId.get(m.id)] = Object.assign({}, lib.songs[byId.get(m.id)], m); else lib.songs.push(m); });
    }
    lib.songs.forEach(SG.prepareSong);
    SG.library = lib;
    return lib;
  };
  // compact hosted format (v3): one short row per song, see server.py compact_song()
  SG.expandSong = function (r, shard) {
    let cover = r[7] || '';
    if (cover && !cover.startsWith('http')) cover = 'https://i.scdn.co/image/' + (cover.length === 24 ? 'ab67616d00001e02' : '') + cover;
    const s = {
      id: r[0], uri: 'spotify:track:' + r[0], title: r[1], artists: r[2] ? r[2].split(' | ') : [], movie: r[3] === '=' ? r[1] : r[3],
      year: r[4], genres: r[5] ? r[5].split('') : [], lang: r[6] || null, cover, durationMs: r[8] * 1000,
      hookMs: r[10] * 100, _shard: shard,
    };
    if (r[9] && r[9].length) s.cues = r[9].map((t) => [t * 100, '']);
    if (r[11] && r[11].includes('d')) s.disabled = true;
    if (r[11] && r[11].includes('e')) s.hookSource = 'estimate';
    return s;
  };
  // lyric shard entries: older format = plain text, v3 = { l: lyrics, c: [cue lines], h: hook line }
  function applyShardEntry(s, e) {
    if (!s || !e) return;
    if (typeof e === 'string') { if (!s.lyrics) { s.lyrics = e; SG.prepareLyrics(s); } return; }
    if (e.l && !s.lyrics) { s.lyrics = e.l; SG.prepareLyrics(s); }
    if (e.c && s.cues) e.c.forEach((t, i) => { if (s.cues[i] && !s.cues[i][1]) s.cues[i][1] = t; });
    if (e.h && !s.hookLine) s.hookLine = e.h;
  }
  const shardCache = new Map();
  SG.loadShard = function (n) {
    if (!shardCache.has(n)) shardCache.set(n, getJSON('data/lyrics/' + n + '.json').catch(() => { shardCache.delete(n); return {}; }));
    return shardCache.get(n);
  };
  /** Fill one song's cue lines / hook line (needed for the answer screen even when lyric search is off). */
  SG.loadSongText = async function (s) {
    if (s._shard == null || (s.cues && s.cues.every((c) => c[1])) || s._textLoaded) return;
    applyShardEntry(s, (await SG.loadShard(s._shard))[s.id]);
    s._textLoaded = true;
  };
  SG.loadLyrics = async function (lib, onProgress) {
    if (lib._full || lib._lyricsLoaded) return;
    if (lib._lyricsLoading) return lib._lyricsLoading;
    lib._lyricsLoading = (async () => {
      const n = lib.shards || 0;
      const byId = new Map(lib.songs.map((s) => [s.id, s]));
      let done = 0;
      const one = async (i) => {
        try {
          const shard = await SG.loadShard(i);
          for (const id in shard) applyShardEntry(byId.get(id), shard[id]);
        } catch (e) {}
        done++; onProgress && onProgress(done / n);
      };
      const q = Array.from({ length: n }, (_, i) => i);
      await Promise.all([0, 1, 2].map(async () => { while (q.length) await one(q.shift()); }));
      lib._lyricsLoaded = true;
    })();
    return lib._lyricsLoading;
  };

  // Tabs can edit/import at the same time, so a local save merges with what is on disk:
  // songs changed in this tab (lib._dirty) win, everything else on disk is kept.
  SG.markDirty = (lib, id) => { (lib._dirty = lib._dirty || new Set()).add(id); };
  SG.saveLibrary = async function (lib) {
    const dirty = lib._dirty || new Set();
    if (!SG.isLocal) {
      const list = lib.songs.filter((s) => dirty.has(s.id)).map(SG.stripSong);
      if (list.length) await SG.idb.put(list);
      list.forEach((s) => { const m = lib.songs.find((x) => x.id === s.id); if (m) m._mine = true; });
      lib._dirty = new Set();
      return { ok: true, local: true };
    }
    let disk = null;
    try { disk = await getJSON('data/library.json'); } catch (e) {}
    const mem = new Map(lib.songs.map((s) => [s.id, s]));
    const out = [];
    const seen = new Set();
    ((disk && disk.songs) || []).forEach((d) => {
      seen.add(d.id);
      const m = mem.get(d.id);
      out.push(m && dirty.has(d.id) ? m : d);
    });
    lib.songs.forEach((m) => { if (!seen.has(m.id)) out.push(m); });
    const union = (a, b) => Array.from(new Set([...(a || []), ...(b || [])]));
    const unresolved = union(lib.unresolved, disk && disk.unresolved).filter((k) => !out.some((s) => s.seedKey === k));
    const albumsDone = union(lib.albumsDone, disk && disk.albumsDone);
    const albumsMissing = union(lib.albumsMissing, disk && disk.albumsMissing).filter((k) => !albumsDone.includes(k));
    const wdSkipped = union(lib.wdSkipped, disk && disk.wdSkipped);
    const hitsDone = union(lib.hitsDone, disk && disk.hitsDone);
    const clean = { version: 2, updated: new Date().toISOString(), unresolved, albumsDone, albumsMissing, wdSkipped, hitsDone, songs: out.map(SG.stripSong) };
    const r = await fetch('api/save-library', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clean),
    });
    if (!r.ok) throw new Error('Save failed (' + r.status + '). Is the game running through start.bat?');
    const known = new Set(lib.songs.map((s) => s.id));
    out.forEach((s) => { if (!known.has(s.id)) { SG.prepareSong(s); lib.songs.push(s); } });
    lib.unresolved = unresolved; lib.albumsDone = albumsDone; lib.albumsMissing = albumsMissing; lib.wdSkipped = wdSkipped; lib.hitsDone = hitsDone;
    lib._dirty = new Set();
    return r.json();
  };
  SG.stripSong = function (s) {
    const o = {};
    for (const k in s) if (k[0] !== '_') o[k] = s[k];
    return o;
  };

  /* ---------- text normalisation ---------- */
  const DEV_CONS = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh',
    'ष': 'sh', 'स': 's', 'ह': 'h', 'क़': 'q', 'ख़': 'kh', 'ग़': 'g', 'ज़': 'z', 'ड़': 'r', 'ढ़': 'rh', 'फ़': 'f', 'य़': 'y',
  };
  const DEV_VOW = { 'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऑ': 'o' };
  const DEV_MAT = { 'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e' };
  SG.translit = function (str) {
    if (!/[ऀ-ॿ]/.test(str)) return str;
    str = str.normalize('NFC');
    let out = '';
    const ch = Array.from(str);
    for (let i = 0; i < ch.length; i++) {
      let c = ch[i];
      if (ch[i + 1] === '़') { c = c + '़'; i++; } // nukta
      if (DEV_CONS[c] !== undefined) {
        out += DEV_CONS[c];
        const nx = ch[i + 1];
        if (nx === '्') { i++; continue; } // virama
        if (DEV_MAT[nx] !== undefined) { out += DEV_MAT[nx]; i++; continue; }
        // inherent schwa, dropped at word end
        const isEnd = !nx || !/[ऀ-ॿ]/.test(nx) || nx === 'ं' || nx === 'ँ';
        if (!isEnd || nx === 'ं' || nx === 'ँ') out += 'a';
        continue;
      }
      if (DEV_VOW[c] !== undefined) { out += DEV_VOW[c]; continue; }
      if (c === 'ं' || c === 'ँ') { out += 'n'; continue; }
      if (c === 'ः') { out += 'h'; continue; }
      if (c === '।' || c === '॥') { out += ' '; continue; }
      if (/[०-९]/.test(c)) { out += String(c.charCodeAt(0) - 0x966); continue; }
      out += c;
    }
    return out;
  };

  // basic normalisation for display matching
  SG.norm = function (s) {
    return SG.translit(String(s || ''))
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  };
  // phonetic folding so "kyun/kyon", "hai/hain", "tujhey/tujhe", "zindagi/jindagi" match
  SG.phonWord = function (w) {
    let x = w;
    x = x.replace(/ph/g, 'f').replace(/w/g, 'v').replace(/z/g, 'j').replace(/q/g, 'k').replace(/ck/g, 'k').replace(/x/g, 'ks');
    x = x.replace(/([bcdfgjklmnprstvy])h/g, '$1'); // aspirates
    x = x.replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/ou/g, 'u').replace(/aa/g, 'a');
    x = x.replace(/ai|ae|ei|ay(?=$)|ey(?=$)/g, 'e').replace(/au/g, 'o');
    x = x.replace(/yo/g, 'yu').replace(/iy/g, 'y');
    if (x.length >= 3) x = x.replace(/([aeiou])n$/, '$1');
    if (x.length >= 3) x = x.replace(/h$/, '');
    x = x.replace(/(.)\1+/g, '$1');
    return x;
  };
  SG.phon = function (s) {
    const n = SG.norm(s);
    if (!n) return '';
    return n.split(' ').map(SG.phonWord).join(' ');
  };
  SG.cleanTitle = function (t) {
    return String(t || '')
      .replace(/\s*[\(\[][^\)\]]*(from|feat|ft\.|with|version|remaster|ost|soundtrack)[^\)\]]*[\)\]]/gi, '')
      .replace(/\s+-\s+(from|feat|remaster|single|radio|live).*$/i, '')
      .trim();
  };

  SG.prepareSong = function (s) {
    s.artists = s.artists || [];
    s.genres = s.genres || ['O'];
    s._era = SG.eraOf(s.year);
    s._title = SG.phon(s.title);
    s._movie = SG.phon(s.movie || s.album || '');
    s._artists = SG.phon(s.artists.join(' '));
    SG.prepareLyrics(s);
  };
  SG.prepareLyrics = function (s) {
    const lines = (s.lyrics || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    s._lines = lines;
    s._linesPhon = lines.map(SG.phon);
    s._lyr = ' ' + s._linesPhon.join(' | ') + ' ';
    const toks = new Set();
    s._linesPhon.forEach((l) => l.split(' ').forEach((t) => t && toks.add(t)));
    s._tokens = Array.from(toks);
    s._tokenSet = toks;
  };

  /* ---------- search ---------- */
  function lev1(a, b) { // edit distance <= 1 ?
    if (a === b) return true;
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    let i = 0, j = 0, diff = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++diff > 1) return false;
      if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
    }
    return diff + (la - i) + (lb - j) <= 1;
  }
  function tokenHit(q, song, isLast) {
    if (song._tokenSet.has(q)) return 1;
    if (isLast && q.length >= 2) { for (const t of song._tokens) if (t.startsWith(q)) return 0.9; }
    if (q.length >= 4) { for (const t of song._tokens) if (lev1(q, t)) return 0.75; }
    return 0;
  }
  function fieldScore(f, q) {
    if (!f || !q) return 0;
    if (f === q) return 1;
    if (f.startsWith(q)) return 0.9;
    if ((' ' + f).includes(' ' + q)) return 0.75;
    if (q.length >= 3 && f.includes(q)) return 0.55;
    return 0;
  }
  function snippetFor(song, qp) {
    const qt = qp.split(' ').filter(Boolean);
    let best = -1, bestScore = 0;
    song._linesPhon.forEach((l, i) => {
      let sc = 0;
      if (l.includes(qp)) sc = 10;
      else { const lt = l.split(' '); qt.forEach((q) => { if (lt.some((t) => t === q || t.startsWith(q))) sc++; }); }
      if (sc > bestScore) { bestScore = sc; best = i; }
    });
    return best >= 0 ? song._lines[best] : '';
  }

  /**
   * search(query, songs, opts) -> [{song, score, field, snippet}]
   * field: 'title' | 'movie' | 'artist' | 'lyrics'
   */
  SG.search = function (query, songs, opts = {}) {
    const qp = SG.phon(query);
    if (!qp || qp.length < 2) return [];
    const qt = qp.split(' ').filter(Boolean);
    const out = [];
    for (const s of songs) {
      let best = 0, field = '';
      const ft = fieldScore(s._title, qp) * 100;
      if (ft > best) { best = ft; field = 'title'; }
      const fm = fieldScore(s._movie, qp) * 80;
      if (fm > best) { best = fm; field = 'movie'; }
      const fa = s._artists && (' ' + s._artists).includes(' ' + qp) ? 70 : 0;
      if (fa > best) { best = fa; field = 'artist'; }
      // every query word found in the title (any order) / in the movie name
      const allIn = (f) => { const ft = f.split(' '); return qt.every((q, i) => ft.some((t) => t === q || (i === qt.length - 1 && t.startsWith(q)))); };
      if (qt.length > 1 && best < 85 && allIn(s._title)) { best = 85; field = 'title'; }
      if (qt.length > 1 && best < 72 && s._movie && allIn(s._movie)) { best = 72; field = 'movie'; }
      // all query words spread over title/movie/artist
      if (!best && qt.length > 1) {
        const meta = ' ' + s._title + ' ' + s._movie + ' ' + s._artists + ' ';
        if (qt.every((q, i) => meta.includes(' ' + q) || (i === qt.length - 1 && meta.includes(q)))) { best = 60; field = 'title'; }
      }
      // lyrics
      let ls = 0;
      if (opts.lyrics !== false && s._tokens.length) {
        if (qp.length >= 3 && s._lyr.includes(qp)) ls = 55 + Math.min(qp.length, 30);
        else if (qt.length >= 2) {
          let hit = 0;
          qt.forEach((q, i) => { hit += tokenHit(q, s, i === qt.length - 1); });
          const cov = hit / qt.length;
          if (cov >= 0.7) ls = 30 + cov * 30 + Math.min(qt.length, 8);
        } else if (qt[0].length >= 4 && s._tokenSet.has(qt[0])) ls = 25;
      }
      if (ls > best) { best = ls; field = 'lyrics'; }
      if (best > 0) out.push({ song: s, score: best, field });
    }
    out.sort((a, b) => b.score - a.score || (a.song.title.length - b.song.title.length));
    const res = out.slice(0, opts.limit || 8);
    res.forEach((r) => { if (r.field === 'lyrics') r.snippet = snippetFor(r.song, qp); });
    return res;
  };

  SG.escape = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  SG.highlight = function (text, query) {
    const words = SG.norm(query).split(' ').filter((w) => w.length >= 2);
    let html = SG.escape(text);
    if (!words.length) return html;
    const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    return html.replace(re, '<mark>$1</mark>');
  };
  SG.hasDev = (t) => /[\u0900-\u097F]/.test(t || '');
  SG.roman = (t) => (SG.hasDev(t) ? SG.translit(t).replace(/(^|\s)(\S)/g, (m, a, b) => a + b) : t);
  SG.fmtTime = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  SG.shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- filters ---------- */
  SG.filterSongs = function (songs, f) {
    return songs.filter((s) => {
      if (s.disabled) return false;
      if (f.lang && f.lang !== 'both' && s.lang !== f.lang) return false;
      if (f.eras && f.eras.length && !f.eras.includes(s._era)) return false;
      if (f.genres && f.genres.length && !(s.genres || []).some((g) => f.genres.includes(g))) return false;
      return true;
    });
  };
})();
