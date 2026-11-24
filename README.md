# Guess That Song — Bollywood + English song guessing game

Live: https://guess-that-song.pages.dev

A brown "Carvaan radio" game: a clip of a song plays (0.1 s → 0.2 → 0.5 → 1 → 3 → 8 → 15 s) and you
guess it by title, movie, singer or **a line of the lyrics**.

## Run it on your computer
Double-click **start.bat** → http://127.0.0.1:8888 (needs Python 3). Log in to Spotify in the same
browser for full songs (logged-out visitors get Spotify's 30-second previews).

## Features
- Easy (5 strikes) / Medium (3) / Hard (no strikes) — each mode keeps its own game and leaderboard.
- Gets harder every 5 correct songs (shorter max clip, any lyric line, higher point multiplier).
- Practice toggle: every clip length at every level, never ranked.
- Game survives closing the browser; the next song preloads in a second hidden Spotify player.
- Hindi / Both / English, eras, genres; songs never repeat until you reset (in 📊 Stats).
- Leaderboards (best game score, best streak per mode; total points), community stats per song.
- Self-tuning: lyric lines people rarely guess within 3 s are retired, hard songs come up less,
  songs that won't play on Spotify are dropped (`/api/tuning`).
- Play without logging in (30-second previews) or log in for full songs; save to Liked Songs / playlists
  after connecting Spotify (Settings explains how to use your own Spotify app — Spotify allows 5 users per app).

## Files
| File | What it is |
|---|---|
| `index.html`, `css/style.css`, `js/game.js` | the game |
| `library.html`, `js/library.js` | Song Finder + "Add songs" (bulk importers run only locally) |
| `js/common.js` | shared: genres/eras, loading songs & lyric shards, search (lyrics, Hinglish ↔ Devanagari) |
| `js/player.js` | Spotify Embed clip player (seek, timed stop, watchdog, phone unlock) |
| `js/spotify.js` | Spotify login (PKCE) + Web API, throttled |
| `js/builder.js` | matching tracks, LRCLIB lyrics, picking recognisable lines (cues), Wikidata, hit lists |
| `callback.html`, `config.js` | Spotify login return page; your Spotify Client ID |
| `_worker.js`, `_routes.json`, `schema.sql` | Cloudflare backend: leaderboard, community stats, tuning (D1 database) |
| `server.py`, `start.bat` | local server (saves the library, splits it for the website) |
| `make_dist.py` | builds `dist/` — the folder you upload to Cloudflare Pages |
| `bg-import.js`, `bg-import.vbs` | hidden background importer (grows the library to 20,000 popular songs) |
| `data/library.json` | the full song library (with lyrics) — the source of truth |
| `data/songs.json`, `data/lyrics/N.json` | compact copy the website loads (made from library.json) |
| `data/seeds.js`, `data/albums.js` | curated song / album lists used by the importers |

## Publish to Cloudflare Pages
1. `python make_dist.py` → `dist/`.
2. Cloudflare → Workers & Pages → the Pages project → Create deployment → upload `dist` (or a zip of it).
3. First time only: create a D1 database, run `schema.sql` in its console, and bind it to the project as `DB`.
4. Add `https://<your-site>/callback.html` as a Redirect URI in your Spotify app.

## Background importer
Double-click `bg-import.vbs` (no window). Progress: `data/bg-status.json`, `data/bg-import.log`.
Stop it by ending "Node.js JavaScript Runtime" in Task Manager. It needs Node 18+ and a Spotify login
(open http://127.0.0.1:8888/library.html once while it runs).
