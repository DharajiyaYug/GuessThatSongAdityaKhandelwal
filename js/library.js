/* Song Finder + library builder page */
(function () {
  const SG = window.SG;
  const $ = (id) => document.getElementById(id);
  const PAGE = 40;
  let lib, player2, cur = null, page = 0, list = [];
  const F = { lang: 'both', eras: [], genres: [] };

  function toast(t, ms = 2600) { const el = $('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), ms); }
  function toggle(arr, v) { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- tabs ---------- */
  function showTab(t) {
    document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === t));
    $('tab-find').classList.toggle('hidden', t !== 'find');
    $('tab-build').classList.toggle('hidden', t !== 'build');
    $('navFind').classList.toggle('on', t === 'find');
    $('navBuild').classList.toggle('on', t === 'build');
    if (t === 'build') renderStats();
  }
  document.querySelectorAll('.tabs button').forEach((b) => b.onclick = () => { location.hash = b.dataset.tab === 'build' ? 'build' : ''; showTab(b.dataset.tab); });

  /* ---------- finder ---------- */
  function buildFilters() {
    const w = $('logoWave');
    for (let i = 0; i < 18; i++) { const b = document.createElement('i'); b.style.height = (6 + Math.abs(Math.sin(i * 1.7)) * 26) + 'px'; w.appendChild(b); }
    SG.ERAS.forEach((e) => { const b = mkChip(e.label, () => { toggle(F.eras, e.id); b.classList.toggle('on'); run(); }); $('fEra').appendChild(b); });
    Object.entries(SG.GENRES).forEach(([k, v]) => { const b = mkChip(v, () => { toggle(F.genres, k); b.classList.toggle('on'); run(); }); $('fGenre').appendChild(b); });
    $('fLang').querySelectorAll('button').forEach((b) => b.onclick = () => { F.lang = b.dataset.lang; $('fLang').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); run(); });
    ['plGenres', 'oneGenres'].forEach((id) => Object.entries(SG.GENRES).forEach(([k, v]) => { const b = mkChip(v, () => b.classList.toggle('on')); b.dataset.g = k; $(id).appendChild(b); }));
  }
  function mkChip(label, fn) { const b = document.createElement('button'); b.className = 'chip'; b.textContent = label; b.onclick = fn; return b; }

  function run() {
    const q = $('q').value.trim();
    const showOff = $('showOff').checked;
    let songs = lib.songs.filter((s) => showOff || !s.disabled);
    songs = songs.filter((s) => {
      if (F.lang !== 'both' && s.lang !== F.lang) return false;
      if (F.eras.length && !F.eras.includes(s._era)) return false;
      if (F.genres.length && !(s.genres || []).some((g) => F.genres.includes(g))) return false;
      return true;
    });
    if (q.length >= 2) list = SG.search(q, songs, { limit: 200, lyrics: SG.settings.lyricSearch });
    else list = songs.slice().sort((a, b) => a.title.localeCompare(b.title)).map((s) => ({ song: s }));
    page = 0;
    $('count').textContent = q.length >= 2 ? `${list.length} matches` : `${list.length} songs`;
    render();
  }
  function render() {
    const q = $('q').value.trim();
    const items = list.slice(page * PAGE, page * PAGE + PAGE);
    $('results').innerHTML = items.map((r) => {
      const s = r.song;
      return `<div class="song ${s.disabled ? 'off' : ''} ${cur === s ? 'sel' : ''}" data-id="${s.id}">
        <img src="${SG.escape(s.cover)}" loading="lazy" alt="">
        <div style="min-width:0">
          <div class="t">${SG.highlight(s.title, q)} ${r.field ? `<span class="badge ${r.field}">${r.field}</span>` : ''}</div>
          <div class="s">${SG.highlight([s.movie !== s.title ? s.movie : '', s.year].filter(Boolean).join(' · '), q)}</div>
          <div class="s">${SG.highlight(s.artists.slice(0, 3).join(', '), q)}</div>
          ${r.snippet ? `<div class="ly">♪ ${SG.highlight(SG.roman(r.snippet), q)}</div>` : ''}
        </div></div>`;
    }).join('') || '<p class="muted">No songs found.</p>';
    $('results').querySelectorAll('.song').forEach((el) => el.onclick = () => select(lib.songs.find((s) => s.id === el.dataset.id), true));
    const pages = Math.ceil(list.length / PAGE);
    $('pager').innerHTML = pages > 1 ? `<button class="btn ghost" id="pp" ${page === 0 ? 'disabled' : ''}>← Prev</button><span class="muted">Page ${page + 1} / ${pages}</span><button class="btn ghost" id="pn" ${page >= pages - 1 ? 'disabled' : ''}>Next →</button>` : '';
    if ($('pp')) { $('pp').onclick = () => { page--; render(); scrollTo(0, 0); }; $('pn').onclick = () => { page++; render(); scrollTo(0, 0); }; }
  }

  function select(s, autoplay) {
    if (!s) return;
    cur = s;
    render();
    const q = $('q').value.trim();
    const hookIdx = s.hookLine ? s._lines.findIndex((l) => l === s.hookLine) : -1;
    const lyr = s._lines.length
      ? s._lines.map((l, i) => `<span class="${i === hookIdx ? 'hk' : ''}">${SG.highlight(l, q)}</span>`).join('\n')
      : '<span class="muted">No lyrics found for this song.</span>';
    $('dBody').innerHTML = `
      <h2 style="margin-top:14px">${SG.escape(s.title)}</h2>
      <div class="muted">${SG.escape([s.movie, s.year, s.artists.join(', ')].filter(Boolean).join(' · '))}</div>
      <div class="row">
        <button class="btn" id="dPlay">▶ Play from hook</button>
        <button class="btn ghost" id="dClip">Test 3 s clip</button>
        <a class="btn ghost" target="_blank" rel="noopener" href="https://open.spotify.com/track/${s.id}">Spotify ↗</a>
      </div>
      <div class="row muted">Clip starts at <b id="dHook" style="color:var(--ink)">${SG.fmtTime(s.hookMs)}</b> <span>(${SG.escape(s.hookSource || '')}${s.hookHow ? ', ' + SG.escape(s.hookHow) : ''})</span></div>
      <div class="row">
        <button class="btn ghost" id="dM">−1 s</button><button class="btn ghost" id="dP">+1 s</button>
        <button class="btn ghost" id="dSet">Set to current position</button>
      </div>
      <div class="row"><span class="label">Language</span>
        <select class="input" id="dLang"><option value="hi">Hindi</option><option value="en">English</option></select>
        <label class="muted"><input type="checkbox" id="dOff"> disabled (never played in game)</label>
      </div>
      <div class="chips" id="dGenres"></div>
      <h3 style="margin:16px 0 8px">Lyrics ${SG.hasDev(s.lyrics) ? '<button class="linkbtn" id="dRoman">show in English letters</button>' : ''}</h3>
      <div class="lyrics">${lyr}</div>`;
    if ($('dRoman')) $('dRoman').onclick = () => {
      const box = $('dBody').querySelector('.lyrics'); const on = box.dataset.r === '1'; box.dataset.r = on ? '0' : '1';
      box.innerHTML = s._lines.map((l, i) => `<span class="${i === hookIdx ? 'hk' : ''}">${SG.highlight(on ? l : SG.roman(l), q)}</span>`).join('\n');
      $('dRoman').textContent = on ? 'show in English letters' : 'show original script';
    };
    $('dLang').value = s.lang;
    $('dOff').checked = !!s.disabled;
    Object.entries(SG.GENRES).forEach(([k, v]) => {
      const b = mkChip(v, () => { toggle(s.genres, k); b.classList.toggle('on'); changed(); });
      if ((s.genres || []).includes(k)) b.classList.add('on');
      $('dGenres').appendChild(b);
    });
    const setHook = (ms) => { s.hookMs = Math.max(0, Math.min(ms, s.durationMs - 3000)); s.hookSource = 'manual'; $('dHook').textContent = SG.fmtTime(s.hookMs); changed(); };
    $('dPlay').onclick = () => player2.playFrom(s.hookMs);
    $('dClip').onclick = () => player2.playClip(s.hookMs, 3000);
    $('dM').onclick = () => { setHook(s.hookMs - 1000); player2.playClip(s.hookMs, 3000); };
    $('dP').onclick = () => { setHook(s.hookMs + 1000); player2.playClip(s.hookMs, 3000); };
    $('dSet').onclick = () => setHook(Math.floor(player2.state.position / 1000) * 1000);
    $('dLang').onchange = () => { s.lang = $('dLang').value; changed(); };
    $('dOff').onchange = () => { s.disabled = $('dOff').checked; changed(); };
    player2.load(s.uri).then(() => { if (autoplay) player2.playFrom(s.hookMs); });
    if (innerWidth < 980) $('detail').scrollIntoView({ behavior: 'smooth' });
  }
  let saveT;
  function changed() {
    if (cur) SG.markDirty(lib, cur.id);
    clearTimeout(saveT);
    saveT = setTimeout(async () => {
      try { await SG.saveLibrary(lib); toast('Saved ✓', 1200); } catch (e) { toast(e.message, 5000); }
    }, 700);
  }

  /* ---------- build ---------- */
  const logEl = () => $('log');
  function log(t) { const l = logEl(); l.textContent += t + '\n'; l.scrollTop = l.scrollHeight; }
  function progress(f) { $('bar').style.width = Math.round(f * 100) + '%'; }
  let rlLast = 0; SG.onRateLimit = (ms) => { if (Date.now() - rlLast > 15000) { rlLast = Date.now(); log(`… Spotify rate limit, slowing down (${Math.round(ms / 1000)}s)`); } };

  function seeds() { return SG.parseSeeds(window.SEEDS || ''); }
  function existingKeys() {
    const k = new Set();
    lib.songs.forEach((s) => { if (s.seedKey) k.add(s.seedKey); });
    return k;
  }
  function renderStats() {
    const all = lib.songs;
    const sd = seeds();
    const have = existingKeys();
    const unres = new Set(lib.unresolved || []);
    const missing = sd.filter((s) => !have.has(SG.seedKey(s)) && !unres.has(SG.seedKey(s)));
    const box = (l, v) => `<div class="box"><div class="label">${l}</div><div class="v">${v}</div></div>`;
    $('stats').innerHTML =
      box('Songs', all.length) + box('Hindi', all.filter((s) => s.lang === 'hi').length) + box('English', all.filter((s) => s.lang === 'en').length) +
      box('Hook from lyrics', all.filter((s) => (s.hookSource || '').startsWith('lyrics')).length) +
      box('Hook estimated', all.filter((s) => s.hookSource === 'estimate').length) +
      box('With lyrics', all.filter((s) => s.lyrics).length) +
      box('Curated list', sd.length) + box('New to import', missing.length) + box('Not found', unres.size) +
      box('Albums done', (lib.albumsDone || []).length + ' / ' + albums().length) + box('Albums not found', (lib.albumsMissing || []).length);
    const albLeft = albumQueue().length;
    $('importAlbums').textContent = albLeft ? `Import ${albLeft} soundtracks & albums (≈${albLeft * 7} songs)` : 'All albums imported';
    $('importAlbums').disabled = !albLeft;
    $('importSeeds').textContent = missing.length ? `Import ${missing.length} new songs from the curated list` : 'Curated list fully imported';
    $('importSeeds').disabled = !missing.length;
    $('retryFailed').disabled = !unres.size;
    const t = SG.Spotify.token();
    const me = SG.store.get('sp_me', null);
    $('spStatus').textContent = SG.Spotify.isLoggedIn() ? '✓ connected' + (me && me.name ? ' as ' + me.name : '') : 'not connected';
  }

  let stopFlag = false, running = false;
  async function runQueue(items, worker, label, saveEvery = 15, workers = 2, needLogin = true, pauseMs = 0) {
    if (running) return toast('Already running');
    if (needLogin && !SG.Spotify.isLoggedIn()) { toast('Connect Spotify first'); return; }
    running = true; stopFlag = false;
    $('stopBtn').classList.remove('hidden');
    log(`▶ ${label}: ${items.length} items`);
    let done = 0, sinceSave = 0, i = 0, paused = false;
    const next = async () => {
      while (!stopFlag && i < items.length) {
        const it = items[i++];
        try { await worker(it); } catch (e) {
          if (e.rate) {
            // Spotify cooldown: put the item back and keep waiting until Spotify lets us in again
            items.push(it); done--;
            if (!paused) { paused = true; log('  … Spotify asked us to slow down — import will resume automatically. Keep this tab open.'); }
            await sleep(pauseMs ? 30 * 60000 : 180000); // slow imports wait 30 min when Spotify blocks
          } else { log('  ! ' + e.message); if (/connect|expired/i.test(e.message)) stopFlag = true; }
        }
        if (pauseMs) await sleep(pauseMs); // stay well inside Spotify's limits for hobby apps
        done++; sinceSave++;
        progress(done / items.length);
        if (sinceSave >= saveEvery) { sinceSave = 0; await save(); renderStats(); }
      }
    };
    await Promise.all(Array.from({ length: workers }, () => next()));
    await save();
    log(stopFlag ? '■ stopped' : `✓ ${label} finished`);
    running = false; $('stopBtn').classList.add('hidden');
    renderStats(); run();
  }
  async function save() {
    try { await SG.saveLibrary(lib); } catch (e) { log('  ! could not save: ' + e.message); }
  }
  function addSong(song) {
    const ex = lib.songs.find((s) => s.id === song.id);
    if (ex) {
      // merge tags into the existing song
      song.genres.forEach((g) => { if (!ex.genres.includes(g)) ex.genres.push(g); });
      SG.markDirty(lib, ex.id);
      if (song.seedKey && !ex.seedKey) ex.seedKey = song.seedKey;
      return false;
    }
    SG.prepareSong(song);
    lib.songs.push(song);
    SG.markDirty(lib, song.id);
    return true;
  }

  async function importSeeds(retry) {
    const have = existingKeys();
    const unres = new Set(lib.unresolved || []);
    let items = seeds().filter((s) => { const k = SG.seedKey(s); return !have.has(k) && (retry ? unres.has(k) : !unres.has(k)); });
    // alternate languages (English first) so a partial import is balanced
    const byLang = { en: items.filter((x) => x.lang === 'en'), hi: items.filter((x) => x.lang !== 'en') };
    items.length = 0;
    while (byLang.en.length || byLang.hi.length) { if (byLang.en.length) items.push(byLang.en.shift()); if (byLang.hi.length) items.push(byLang.hi.shift()); }
    if (retry) { lib.unresolved = []; await fetch('data/library.json').then((r) => r.json()).then((d) => { d.unresolved = []; }).catch(() => {}); }
    await runQueue(items, async (seed) => {
      const key = SG.seedKey(seed);
      const t = await SG.findOnSpotify(seed);
      if (!t) { log(`  ✗ not found: ${seed.title} — ${seed.artist}`); (lib.unresolved = lib.unresolved || []).push(key); return; }
      const song = await SG.buildSong(t, { title: seed.title, movie: seed.movie, year: seed.year, genres: seed.genres.slice(), lang: seed.lang, source: 'curated' });
      song.seedKey = key;
      const added = addSong(song);
      log(`  ${added ? '✓' : '='} ${seed.title} (${seed.movie}) → ${t.name} · ${t.artists[0].name} · hook ${SG.fmtTime(song.hookMs)} ${song.hookSource}`);
    }, retry ? 'Retry not-found songs' : 'Import curated songs');
  }

  function albums() { return SG.parseAlbums(window.ALBUMS || ''); }
  function albumQueue() {
    const done = new Set([...(lib.albumsDone || []), ...(lib.albumsMissing || [])]);
    const list = albums().filter((a) => !done.has(SG.albumKey(a)));
    const en = list.filter((a) => a.lang === 'en'), hi = list.filter((a) => a.lang !== 'en');
    const out = [];
    while (en.length || hi.length) { if (hi.length) out.push(hi.shift()); if (en.length) out.push(en.shift()); if (hi.length) out.push(hi.shift()); }
    return out;
  }
  // import every playable song of one Spotify album (soundtrack)
  async function importAlbumObj(al, entry) {
    const { album, tracks } = await SG.albumTracks(al, entry);
    let added = 0;
    const q = tracks.filter((t) => !lib.songs.some((s) => s.id === t.id));
    const yr = +((album.release_date || '').slice(0, 4));
    await Promise.all([0, 1, 2].map(async () => {
      while (q.length) {
        const t = q.shift();
        const song = await SG.buildSong(t, {
          movie: entry.lang === 'hi' ? entry.name : cleanAlbumName(album.name),
          year: entry.year && (!yr || Math.abs(yr - entry.year) > 1) ? entry.year : yr,
          genres: (entry.genres || []).slice(), autoGenres: true, lang: entry.lang, source: 'album',
        });
        if (addSong(song)) added++;
      }
    }));
    (album.artists || []).forEach((a) => { if (a.id && !/various/i.test(a.name)) composers.set(a.id, a.name); });
    return added;
  }
  const composers = new Map();
  function markEntryDone(entry) { const k = SG.albumKey(entry); lib.albumsDone = lib.albumsDone || []; if (!lib.albumsDone.includes(k)) lib.albumsDone.push(k); }

  async function importAlbums() {
    const items = albumQueue();
    await runQueue(items, async (entry) => {
      const key = SG.albumKey(entry);
      const al = await SG.findAlbum(entry);
      if (!al) { log(`  ✗ album not found: ${entry.name} (${entry.year})`); (lib.albumsMissing = lib.albumsMissing || []).push(key); return; }
      const added = await importAlbumObj(al, entry);
      markEntryDone(entry);
      log(`  ✓ ${entry.name} (${entry.year}) → ${al.name} · +${added} songs`);
    }, 'Import soundtracks & albums (search)', 5);
  }

  /* Search-free import: works even while Spotify rate-limits /search.
     1) full soundtracks of songs already in the library, 2) discographies of their composers and of
     known English artists, matched against data/albums.js */
  async function importByArtists() {
    const pending = () => albumQueue();
    const byMovie = new Map();
    lib.songs.forEach((s) => { const k = s.lang + '|' + SG.norm(s.movie) + '|' + s.year; if (!byMovie.has(k)) byMovie.set(k, s); });
    const steps = [];
    byMovie.forEach((s) => steps.push({ kind: 'expand', song: s }));
    const enArtists = new Map();
    albums().filter((a) => a.lang === 'en').forEach((a) => { const id = SG.KNOWN_ARTISTS[a.artist]; if (id) enArtists.set(id, a.artist); });
    enArtists.forEach((name, id) => steps.push({ kind: 'artist', id, name, lang: 'en' }));
    steps.push({ kind: 'composers' });
    const seenAlbums = new Set(lib.songs.map((s) => s.albumId).filter(Boolean));
    const doneAlbumIds = new Set();
    const tryArtist = async (id, name, lang) => {
      let artist;
      try { artist = await SG.Spotify.getArtist(id); } catch (e) { if (e.rate) throw e; log(`  ! artist ${name}: ${e.message}`); return; }
      if (lang === 'en' && SG.norm(artist.name) !== SG.norm(name) && !SG.norm(artist.name).includes(SG.norm(name))) { log(`  ! skipped id for ${name} (is ${artist.name})`); return; }
      const list = await SG.Spotify.artistAlbums(id);
      let n = 0;
      for (const entry of pending().filter((e) => e.lang === lang && (lang === 'hi' || SG.norm(e.artist) === SG.norm(name)))) {
        let best = null, bestScore = -99;
        for (const al of list) { const sc = SG.scoreAlbum(al, lang === 'en' ? Object.assign({}, entry, { artist: '' }) : entry); if (sc > bestScore) { best = al; bestScore = sc; } }
        if (!best || bestScore < 6 || doneAlbumIds.has(best.id)) continue;
        doneAlbumIds.add(best.id);
        const added = await importAlbumObj(best, entry);
        markEntryDone(entry); n++;
        log(`  ✓ ${entry.name} (${entry.year}) via ${artist.name} → +${added} songs`);
        if (n % 3 === 0) await save();
      }
      if (!n) log(`  · ${artist.name}: no new albums from the list`);
    };
    const doneArtists = new Set();
    await runQueue(steps, async (st) => {
      if (st.kind === 'expand') {
        const s = st.song;
        let albumId = s.albumId;
        if (!albumId) { const t = await SG.Spotify.getTrack(s.id); albumId = t.album && t.album.id; s.albumId = albumId; SG.markDirty(lib, s.id); (t.album.artists || []).forEach((a) => { if (!/various/i.test(a.name)) composers.set(a.id, a.name); }); }
        if (!albumId || doneAlbumIds.has(albumId)) return;
        doneAlbumIds.add(albumId);
        const entry = { lang: s.lang, name: s.movie, artist: '', year: s.year, genres: [] };
        const added = await importAlbumObj({ id: albumId }, entry);
        const match = pending().find((e) => e.lang === s.lang && SG.norm(e.name) === SG.norm(s.movie) && Math.abs(e.year - s.year) <= 1);
        if (match) markEntryDone(match);
        if (added) log(`  ✓ full soundtrack: ${s.movie} (${s.year}) +${added} songs`);
      } else if (st.kind === 'artist') {
        if (doneArtists.has(st.id)) return; doneArtists.add(st.id);
        await tryArtist(st.id, st.name, st.lang);
      } else if (st.kind === 'composers') {
        log(`  … checking ${composers.size} composers' discographies for soundtracks in the list`);
        for (const [id, name] of composers) { if (stopFlag) break; if (doneArtists.has(id)) continue; doneArtists.add(id); try { await tryArtist(id, name, 'hi'); } catch (e) { if (e.rate) throw e; log('  ! ' + e.message); } await save(); }
      }
    }, 'Search-free import (soundtracks & artists)', 4, 1);
  }
  const cleanAlbumName = (n) => String(n).replace(/\s*[\(\[][^\)\]]*(soundtrack|motion picture|deluxe|edition|remaster)[^\)\]]*[\)\]]/gi, '').trim();

  async function importTracks(tracks, label, lang, genres) {
    const fresh = tracks.filter((t) => !lib.songs.some((s) => s.id === t.id));
    log(`${tracks.length} tracks, ${fresh.length} new`);
    await runQueue(fresh, async (t) => {
      const song = await SG.buildSong(t, { genres: genres.slice(), autoGenres: !genres.length, lang: lang === 'auto' ? null : lang, source: label });
      addSong(song);
      log(`  ✓ ${song.title} · ${song.artists[0]} · ${song.lang} · hook ${SG.fmtTime(song.hookMs)} ${song.hookSource}`);
    }, label);
  }
  const chosen = (id) => Array.from($(id).querySelectorAll('.chip.on')).map((b) => b.dataset.g);

  function wireBuild() {
    $('redir').textContent = SG.Spotify.redirectUri();
    $('clientId').value = SG.store.get('client_id', '');
    $('clientId').placeholder = 'optional — default: this site\'s app';
    const setCid = () => { const v = $('clientId').value.trim(); SG.store.set('client_id', v && v !== SG.Spotify.defaultClientId ? v : ''); };
    $('clientId').onchange = setCid;
    $('connectBtn').onclick = () => { setCid(); SG.Spotify.login('library.html#build'); };
    $('importAlbums').onclick = () => importAlbums();
    $('importArtists').onclick = () => importByArtists();
    $('importWiki').onclick = () => importWikidata();
    $('importNotable').onclick = () => importNotable();
    $('importHits').onclick = () => importHits();
    $('refreshCues').onclick = () => refreshCues();
    document.querySelectorAll('.owner-only').forEach((el) => el.classList.toggle('hidden', !SG.isLocal));
    $('lyrToggle2').checked = SG.settings.lyricSearch;
    $('lyrToggle2').onchange = () => { SG.settings.lyricSearch = $('lyrToggle2').checked; SG.saveSettings(); if (SG.settings.lyricSearch) loadLyr(); run(); };
    $('logoutBtn').onclick = () => { SG.Spotify.logout(); renderStats(); };
    $('importSeeds').onclick = () => importSeeds(false);
    $('retryFailed').onclick = () => importSeeds(true);
    $('stopBtn').onclick = () => { stopFlag = true; };
    $('refetchLyrics').onclick = async () => {
      const items = lib.songs.filter((s) => !s.lyrics || s.hookSource === 'estimate' || (s.hookSource !== 'manual' && s.hookMs < 6000));
      await runQueue(items, async (s) => {
        const pick = await SG.fetchLyrics(s.spotifyTitle || s.title, s.artists[0], s.album, s.durationMs / 1000);
        if (!pick) return;
        const synced = pick.timed ? SG.parseLrc(pick.c.syncedLyrics) : [];
        s.lyrics = pick.c.plainLyrics || synced.map((l) => l.text).join('\n');
        if (synced.length && s.hookSource !== 'manual') {
          const h = SG.detectHook(synced, s.title, s.durationMs);
          if (h) { s.hookMs = h.hookMs; s.hookLine = h.hookLine; s.hookSource = 'lyrics'; s.hookHow = h.how; }
          const cues = SG.pickCues(synced, s.title, s.durationMs); if (cues.length) s.cues = cues;
          if (h) {} else if (s.hookMs < 6000) { s.hookMs = Math.round(Math.min(s.durationMs * 0.3, 75000) / 1000) * 1000; s.hookSource = 'estimate'; }
        }
        SG.prepareSong(s);
        SG.markDirty(lib, s.id);
        log(`  ✓ lyrics: ${s.title}`);
      }, 'Re-fetch lyrics');
    };
    $('loadMyPl').onclick = async () => {
      try {
        const me = await SG.Spotify.me();
        const pls = await SG.Spotify.myPlaylists(false);
        $('myPl').innerHTML = '<option value="">…or choose one of your playlists</option>' +
          pls.filter(Boolean).map((p) => `<option value="${p.id}">${SG.escape(p.name)}${p.owner && p.owner.id !== me.id ? ' (followed — may not be readable)' : ''}</option>`).join('');
        toast(pls.length + ' playlists loaded');
      } catch (e) { toast(e.message, 5000); }
    };
    $('myPl').onchange = () => { if ($('myPl').value) $('plUrl').value = 'https://open.spotify.com/playlist/' + $('myPl').value; };
    $('importPl').onclick = async () => {
      const id = SG.Spotify.parsePlaylistId($('plUrl').value.trim());
      if (!id) return toast('Paste a Spotify playlist link');
      try {
        log('Reading playlist…');
        const pl = await SG.Spotify.playlistTracks(id, (n, tot) => progress(n / (tot || n)));
        log(`Playlist “${pl.name}”`);
        await importTracks(pl.tracks, 'playlist:' + pl.name, $('plLang').value, chosen('plGenres'));
      } catch (e) { log('! ' + e.message); toast(e.message, 7000); }
    };
    $('importLiked').onclick = async () => {
      try {
        log('Reading Liked Songs…');
        const tr = await SG.Spotify.likedTracks((n, tot) => progress(n / (tot || n)));
        await importTracks(tr, 'liked', $('plLang').value, chosen('plGenres'));
      } catch (e) { log('! ' + e.message); toast(e.message, 7000); }
    };
    const doSearch = async () => {
      const q = $('spQ').value.trim(); if (!q) return;
      try {
        const items = await SG.Spotify.searchTracks(q, 10);
        $('spResults').innerHTML = items.map((t, i) => `<div class="song" data-i="${i}">
          <img src="${SG.escape((t.album.images[2] || t.album.images[0] || {}).url || '')}" alt="">
          <div><div class="t">${SG.escape(t.name)}</div><div class="s">${SG.escape(t.artists.map((a) => a.name).join(', '))}</div><div class="s">${SG.escape(t.album.name)} · ${(t.album.release_date || '').slice(0, 4)}</div>
          <div class="ly">${lib.songs.some((s) => s.id === t.id) ? '✓ already in library' : '＋ click to add'}</div></div></div>`).join('');
        $('spResults').querySelectorAll('.song').forEach((el) => el.onclick = async () => {
          const t = items[+el.dataset.i];
          el.querySelector('.ly').textContent = 'adding…';
          const g = chosen('oneGenres');
          const song = await SG.buildSong(t, { genres: g, autoGenres: !g.length, lang: $('oneLang').value === 'auto' ? null : $('oneLang').value, source: 'search' });
          const added = addSong(song); await save(); renderStats(); run();
          el.querySelector('.ly').textContent = added ? `✓ added · hook ${SG.fmtTime(song.hookMs)} (${song.hookSource})` : '✓ already in library';
        });
      } catch (e) { toast(e.message, 5000); }
    };
    $('spSearch').onclick = doSearch;
    $('spQ').onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };
  }

  function loadLyr() {
    if (lib._full || lib._lyricsLoaded) return;
    $('count').textContent = 'loading lyrics…';
    SG.loadLyrics(lib, (f) => { $('count').textContent = 'loading lyrics… ' + Math.round(f * 100) + '%'; }).then(run);
  }

  /* clip lines for songs imported before random-line clips existed (LRCLIB only, no Spotify calls) */
  async function refreshCues() {
    const items = lib.songs.filter((s) => !s.cues && !s.noCues);
    await runQueue(items, async (s) => {
      const pick = await SG.fetchLyrics(s.spotifyTitle || s.title, s.artists[0], s.album, s.durationMs / 1000);
      const synced = pick && pick.timed ? SG.parseLrc(pick.c.syncedLyrics) : [];
      const cues = synced.length ? SG.pickCues(synced, s.title, s.durationMs) : [];
      if (cues.length) {
        s.cues = cues;
        if (!s.lyrics && pick.c.plainLyrics) { s.lyrics = pick.c.plainLyrics; SG.prepareLyrics(s); }
        if (s.hookSource === 'estimate') { s.hookMs = cues[0][0]; s.hookLine = cues[0][1]; s.hookSource = 'lyrics'; }
      } else s.noCues = true;
      SG.markDirty(lib, s.id);
    }, 'Random-line clips: finding recognisable lines', 60, 4, false);
  }

  /* English (and some Hindi) via Wikidata, which stores Spotify album / track IDs.
     Uses only Spotify's album and track endpoints, which keep working when search is rate-limited. */
  async function importWikidata() {
    if (!SG.Spotify.isLoggedIn()) return toast('Connect Spotify first');
    const have = existingKeys();
    log('▶ Looking up Spotify IDs on Wikidata…');
    const enSeeds = seeds().filter((x) => x.lang === 'en' && !have.has(SG.seedKey(x)));
    const trackIds = await SG.wdTrackIds(enSeeds, (f) => progress(f / 3));
    const pend = albumQueue();
    const enAlbums = pend.filter((a) => a.lang === 'en');
    const albumIds = await SG.wdAlbumIds(enAlbums, (f) => progress(1 / 3 + f / 3));
    const hiAlbums = pend.filter((a) => a.lang === 'hi');
    const stIds = await SG.wdSoundtrackIds(hiAlbums, (f) => progress(2 / 3 + f / 3));
    log(`  Wikidata: ${trackIds.size} English songs, ${albumIds.size} English albums, ${stIds.size} Hindi soundtracks`);
    const jobs = [];
    enSeeds.forEach((sd) => { if (trackIds.has(SG.seedKey(sd))) jobs.push({ kind: 'track', sd, ids: trackIds.get(SG.seedKey(sd)) }); });
    const albumJobs = [];
    enAlbums.forEach((e) => { if (albumIds.has(SG.albumKey(e))) albumJobs.push({ kind: 'album', e, ids: albumIds.get(SG.albumKey(e)) }); });
    hiAlbums.forEach((e) => { if (stIds.has(SG.albumKey(e))) albumJobs.push({ kind: 'album', e, ids: stIds.get(SG.albumKey(e)) }); });
    jobs.push(...albumJobs);
    await runQueue(jobs, async (j) => {
      if (j.kind === 'track') {
        for (const id of j.ids) {
          let t;
          try { t = await SG.Spotify.getTrack(id); } catch (e) { if (e.rate) throw e; continue; }
          if (!t || !t.id || t.is_playable === false) continue;
          const song = await SG.buildSong(t, { title: j.sd.title, movie: j.sd.movie, year: j.sd.year, genres: j.sd.genres.slice(), lang: 'en', source: 'curated' });
          song.seedKey = SG.seedKey(j.sd);
          const added = addSong(song);
          log(`  ${added ? '✓' : '='} ${j.sd.title} — ${j.sd.artist}`);
          return;
        }
      } else {
        for (const id of j.ids) {
          let added;
          try { added = await importAlbumObj({ id }, j.e); } catch (e) { if (e.rate) throw e; continue; }
          markEntryDone(j.e);
          log(`  ✓ ${j.e.name}${j.e.artist ? ' — ' + j.e.artist : ''} (${j.e.year}) +${added} songs`);
          return;
        }
      }
    }, 'Import via Wikidata IDs', 6, 1);
  }

  /* English hits with their own Wikipedia article: IDs from Wikidata, lyrics from LRCLIB — no Spotify API calls at all */
  async function importNotable() {
    log('▶ Finding well-known English songs on Wikidata…');
    const list = await SG.wdNotableSongs(1);
    const ids = new Set(lib.songs.map((s) => s.id));
    const key = (t, a) => SG.phon(SG.cleanTitle(t)) + '|' + SG.phon(a || '');
    const keys = new Set(lib.songs.map((s) => key(s.title, (s.artists || [])[0])));
    const todo = list.filter((o) => !ids.has(o.id) && !keys.has(key(o.title, o.artists[0])) && !(lib.wdSkipped || []).includes(o.id));
    log(`  ${list.length} well-known English songs on Wikidata · ${todo.length} not in the library yet`);
    let added = 0;
    await runQueue(todo, async (o) => {
      const song = await SG.buildFromWikidata(o);
      if (!song) { (lib.wdSkipped = lib.wdSkipped || []).push(o.id); log(`  – no timed lyrics: ${o.title} — ${o.artists[0]}`); return; }
      if (addSong(song)) { added++; keys.add(key(o.title, o.artists[0])); }
      log(`  ✓ ${song.title} — ${song.artists[0]} (${song.year})`);
    }, 'Import well-known English songs', 25, 3, false);
    log(`  +${added} English songs`);
  }

  /* Popular songs 2010–2020, year by year. Resumable: finished pages are remembered in lib.hitsDone. */
  async function importHits() {
    if (!SG.Spotify.isLoggedIn()) return toast('Connect Spotify first');
    const done = new Set(lib.hitsDone || []);
    const items = [];
    SG.hitPlan().forEach((q) => { for (let off = 0; off < q.depth; off += 10) if (!done.has(q.q + '|' + off)) items.push(Object.assign({ off }, q)); });
    const ids = new Set(lib.songs.map((s) => s.id));
    const key = (t, a) => SG.phon(SG.cleanTitle(t)) + '|' + SG.phon(a || '');
    const keys = new Set(lib.songs.map((s) => key(s.title, (s.artists || [])[0])));
    let added = 0, noLyrics = 0;
    log(`  ${items.length} search pages to go (2010–2020 first, then 2021–25, 2000s, 90s Bollywood) · stops at ${SG.LIBRARY_TARGET.toLocaleString()} songs`);
    await runQueue(items, async (it) => {
      if (lib.songs.length >= SG.LIBRARY_TARGET) { if (!stopFlag) log(`  ✓ reached ${SG.LIBRARY_TARGET.toLocaleString()} songs`); stopFlag = true; return; }
      const tracks = await SG.Spotify.searchTracks(it.q, 10, it.off);
      for (const t of tracks) {
        if (!t || !t.id || ids.has(t.id) || t.is_playable === false || SG.isBadVersion(t.name)) continue;
        const k = key(t.name, t.artists[0] && t.artists[0].name);
        if (keys.has(k) || t.duration_ms < 90000) continue;
        ids.add(t.id); keys.add(k);
        const song = await SG.buildSong(t, { lang: it.lang, year: +String(t.album.release_date || it.year).slice(0, 4) || it.year, genres: [], autoGenres: true, source: 'hits' });
        if (!song.cues || !song.cues.length) { noLyrics++; continue; } // must have a recognisable line
        if (addSong(song)) added++;
      }
      (lib.hitsDone = lib.hitsDone || []).push(it.q + '|' + it.off);
      if (tracks.length < 10) for (let o = it.off + 10; o < it.depth; o += 10) lib.hitsDone.push(it.q + '|' + o); // no more results for this search
      log(`  ✓ ${it.q} (${it.off + 1}–${it.off + 10}) · +${added} songs so far`);
    }, 'Import popular songs', 5, 1, true, 4000);
    log(`  +${added} songs (${noLyrics} skipped: no timed lyrics)`);
  }

  function route() {
    const h = location.hash.slice(1);
    if (h.startsWith('build')) showTab('build');
    else {
      showTab('find');
      const m = h.match(/song=([A-Za-z0-9]+)/);
      if (m) { const s = lib.songs.find((x) => x.id === m[1]); if (s) { $('q').value = s.title; run(); select(s, false); } }
    }
  }

  async function init() {
    buildFilters();
    lib = await SG.loadLibrary({ full: true });
    lib.unresolved = lib.unresolved || [];
    wireBuild();
    let deb;
    $('q').addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(run, 120); });
    $('showOff').onchange = run;
    run();
    if (SG.settings.lyricSearch) loadLyr();
    player2 = new SG.SpotifyClipPlayer($('embed2'), { height: 152, uri: lib.songs[0] && lib.songs[0].uri });
    route();
    addEventListener('hashchange', route);
    window.__lib = lib;
  }
  init();
})();
