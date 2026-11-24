// Background song importer — runs without any window (start it with bg-import.vbs).
// Grows data/library.json towards 20,000 popular songs using the same matching / lyric code as the website.
//   Progress: data/bg-status.json and data/bg-import.log      Stop: delete nothing — just end "node.exe" in Task Manager.
// It needs a Spotify login once: open http://127.0.0.1:8888/library.html while it runs and it picks up
// the login that page already has (sent to this program only, on this computer).
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const LIB = path.join(DATA, 'library.json');
const STORE = path.join(DATA, '.bg-store.json');      // Spotify login for this program (stays on this PC)
const STATUS = path.join(DATA, 'bg-status.json');
const LOG = path.join(DATA, 'bg-import.log');
const TARGET = 20000;
const PAUSE_MS = 4000;                                  // between search pages — gentle on Spotify
const BLOCKED_WAIT_MS = 30 * 60 * 1000;                 // when Spotify says "too many requests"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function log(msg) {
  const line = new Date().toISOString().replace('T', ' ').slice(0, 19) + '  ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {}
}
function writeJSON(file, obj) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj));
  fs.renameSync(tmp, file);
}

/* ---------- run the website's own code (common.js, spotify.js, builder.js) in Node ---------- */
let store = {};
try { store = JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch (e) {}
const saveStore = () => { try { writeJSON(STORE, store); } catch (e) {} };
const localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); saveStore(); },
  removeItem: (k) => { delete store[k]; saveStore(); },
};
const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval, fetch, URLSearchParams, URL, TextEncoder, crypto: globalThis.crypto,
  localStorage, sessionStorage: { getItem: () => null, setItem() {} },
  location: { hostname: '127.0.0.1', origin: 'http://127.0.0.1:8888', pathname: '/library.html', search: '', hash: '' },
  performance: globalThis.performance, navigator: {}, document: { querySelector: () => null },
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of ['config.js', 'js/common.js', 'js/spotify.js', 'js/builder.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
}
const SG = sandbox.SG;
SG.onRateLimit = (ms) => log(`… Spotify asked to slow down (${Math.round(ms / 1000)} s)`);

/* ---------- receive the Spotify login from the library page (localhost only) ---------- */
let gotToken = !!localStorage.getItem('sg_sp_token');
http.createServer((req, res) => {
  const origin = req.headers.origin || '';
  const okOrigin = /^http:\/\/(127\.0\.0\.1|localhost):8888$/.test(origin);
  res.setHeader('Access-Control-Allow-Origin', okOrigin ? origin : 'http://127.0.0.1:8888');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method === 'POST' && req.url === '/token' && okOrigin) {
    let b = '';
    req.on('data', (c) => { b += c; if (b.length > 20000) req.destroy(); });
    req.on('end', () => {
      try {
        const j = JSON.parse(b);
        if (j.token && j.token.refresh_token) {
          localStorage.setItem('sg_sp_token', JSON.stringify(j.token));
          if (j.client_id) localStorage.setItem('sg_client_id', JSON.stringify(j.client_id));
          gotToken = true;
          log('✓ got the Spotify login from the library page');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}');
      } catch (e) { res.writeHead(400); res.end('{}'); }
    });
    return;
  }
  if (req.url === '/status') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(fs.existsSync(STATUS) ? fs.readFileSync(STATUS) : '{}'); }
  res.writeHead(404); res.end();
}).listen(8890, '127.0.0.1').on('error', (e) => { log('! another copy is already running (port 8890 busy) — exiting'); process.exit(0); });

/* ---------- library ---------- */
function loadLib() {
  const lib = JSON.parse(fs.readFileSync(LIB, 'utf8'));
  lib.songs = lib.songs || [];
  return lib;
}
function saveLib(lib, newSongs) {
  // merge with what is on disk now (the website's library page may have saved meanwhile)
  let disk = null;
  try { disk = loadLib(); } catch (e) {}
  const out = disk || lib;
  const have = new Set(out.songs.map((s) => s.id));
  newSongs.forEach((s) => { if (!have.has(s.id)) { out.songs.push(SG.stripSong(s)); have.add(s.id); } });
  out.hitsDone = Array.from(new Set([...(out.hitsDone || []), ...(lib.hitsDone || [])]));
  out.updated = new Date().toISOString();
  writeJSON(LIB, out);
  return out;
}
function status(o) { try { writeJSON(STATUS, Object.assign({ at: new Date().toISOString(), target: TARGET }, o)); } catch (e) {} }

/* ---------- main loop ---------- */
async function main() {
  log('▶ background importer started (target ' + TARGET.toLocaleString() + ' songs)');
  while (!gotToken) { status({ state: 'waiting for Spotify login — open http://127.0.0.1:8888/library.html' }); await sleep(15000); }
  let lib = loadLib();
  const done = new Set(lib.hitsDone || []);
  const items = [];
  SG.hitPlan().forEach((q) => { for (let off = 0; off < q.depth; off += 10) if (!done.has(q.q + '|' + off)) items.push(Object.assign({ off }, q)); });
  const ids = new Set(lib.songs.map((s) => s.id));
  const key = (t, a) => SG.phon(SG.cleanTitle(t)) + '|' + SG.phon(a || '');
  const keys = new Set(lib.songs.map((s) => key(s.title, (s.artists || [])[0])));
  let pending = [], added = 0, noLyrics = 0, pages = 0;
  log(`  ${lib.songs.length.toLocaleString()} songs now · ${items.length} search pages to go`);
  const flush = () => { if (!pending.length && pages % 10) return; lib = saveLib(lib, pending); pending = []; };

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (lib.songs.length + pending.length >= TARGET) { log(`✓ reached ${TARGET.toLocaleString()} songs`); break; }
    let tracks;
    try { tracks = await SG.Spotify.searchTracks(it.q, 10, it.off); }
    catch (e) {
      if (e.rate) {
        flush();
        status({ state: 'Spotify is blocking for now — waiting 30 min', songs: lib.songs.length, added, page: i, pages: items.length });
        log('… Spotify is blocking (too many requests) — waiting 30 min');
        await sleep(BLOCKED_WAIT_MS); i--; continue;
      }
      if (/connect|expired/i.test(e.message)) { log('! Spotify login expired — open http://127.0.0.1:8888/library.html and connect Spotify'); gotToken = false; while (!gotToken) { status({ state: 'needs Spotify login', songs: lib.songs.length }); await sleep(15000); } i--; continue; }
      log('! ' + e.message); continue;
    }
    for (const t of tracks) {
      if (!t || !t.id || ids.has(t.id) || t.is_playable === false || SG.isBadVersion(t.name) || t.duration_ms < 90000) continue;
      const k = key(t.name, t.artists[0] && t.artists[0].name);
      if (keys.has(k)) continue;
      ids.add(t.id); keys.add(k);
      let song;
      try { song = await SG.buildSong(t, { lang: it.lang, year: +String(t.album.release_date || it.year).slice(0, 4) || it.year, genres: [], autoGenres: true, source: 'hits' }); }
      catch (e) { continue; }
      if (!song.cues || !song.cues.length) { noLyrics++; continue; }   // must have a recognisable line
      pending.push(song); added++;
    }
    (lib.hitsDone = lib.hitsDone || []).push(it.q + '|' + it.off);
    if (tracks.length < 10) for (let o = it.off + 10; o < it.depth; o += 10) lib.hitsDone.push(it.q + '|' + o);
    pages++;
    if (pending.length >= 25 || pages % 10 === 0) { lib = saveLib(lib, pending); pending = []; }
    status({ state: 'importing', songs: lib.songs.length + pending.length, added, skippedNoLyrics: noLyrics, page: i + 1, pages: items.length, last: it.q });
    if (pages % 20 === 0) log(`  ${it.q} · +${added} songs this run (${(lib.songs.length + pending.length).toLocaleString()} total)`);
    await sleep(PAUSE_MS);
  }
  lib = saveLib(lib, pending); pending = [];
  status({ state: 'finished', songs: lib.songs.length, added, skippedNoLyrics: noLyrics });
  log(`✓ finished: +${added} songs (${lib.songs.length.toLocaleString()} total)`);
  process.exit(0);
}
main().catch((e) => { log('! crashed: ' + (e && e.stack || e)); process.exit(1); });
