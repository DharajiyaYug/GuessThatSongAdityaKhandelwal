"""Local server for the song game.

Serves the folder on http://127.0.0.1:8888 and accepts POST /api/save-library.
A save writes:
  data/library.json        full library (used by the local builder)
  data/songs.json          everything except lyrics (what the game loads)
  data/lyrics/<n>.json     lyrics in shards of 800 songs (loaded only when lyric search is on)
Standard library only.  Run make_dist.py afterwards to build the folder you upload to Cloudflare.
"""
import http.server
import json
import urllib.parse
import time
import os
import socketserver
import sys
import re
import threading
import webbrowser

PORT = 8888
ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
SHARD = 800


def compact_lyrics(text):
    """Unique lines only (choruses repeat a lot), max 50 lines — keeps the hosted download small."""
    out, seen = [], set()
    for line in (text or "").splitlines():
        line = line.strip()
        key = line.lower()
        if not line or key in seen:
            continue
        seen.add(key)
        out.append(line)
    return "\n".join(out[:50])


def atomic_write(path, content):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(content)
    os.replace(tmp, path)


COVER_PREFIXES = ("https://i.scdn.co/image/", "https://image-cdn-fa.spotifycdn.com/image/", "https://image-cdn-ak.spotifycdn.com/image/")
FIELDS = ["id", "title", "artists", "movie", "year", "genres", "lang", "cover", "dur", "cues", "hook", "flags"]


def compact_song(s):
    """One short row per song for the hosted site (the full record stays in library.json).
    cues/hook are stored in tenths of a second; cue lyric text lives in the lyric shards."""
    cover = s.get("cover") or ""
    for pre in COVER_PREFIXES:
        if cover.startswith(pre):
            cover = cover[len(pre):]
            if cover.startswith("ab67616d00001e02"):  # the usual 300px album-art prefix
                cover = cover[16:]
            break
    movie = s.get("movie") or s.get("album") or ""
    cues = [round(c[0] / 100) for c in (s.get("cues") or [])]
    flags = ("d" if s.get("disabled") else "") + ("e" if s.get("hookSource") == "estimate" else "")
    return [s["id"], s.get("title", ""), " | ".join(s.get("artists") or []), movie if movie != s.get("title") else "=",
            s.get("year") or 0, "".join(s.get("genres") or []), s.get("lang") or "", cover,
            round((s.get("durationMs") or 0) / 1000), cues, round((s.get("hookMs") or 0) / 100), flags]


def write_split(lib):
    os.makedirs(os.path.join(DATA, "lyrics"), exist_ok=True)
    songs = [s for s in lib.get("songs", []) if s.get("id")]
    rows, shards = [], []
    for i, s in enumerate(songs):
        rows.append(compact_song(s))
        if i % SHARD == 0:
            shards.append({})
        entry = {}
        if s.get("lyrics"):
            entry["l"] = compact_lyrics(s["lyrics"])
        if s.get("cues"):
            entry["c"] = [c[1] for c in s["cues"]]
        if s.get("hookLine"):
            entry["h"] = s["hookLine"]
        if entry:
            shards[-1][s["id"]] = entry
    for n, sh in enumerate(shards):
        atomic_write(os.path.join(DATA, "lyrics", "%d.json" % n), json.dumps(sh, ensure_ascii=False, separators=(",", ":")))
    for f in os.listdir(os.path.join(DATA, "lyrics")):
        if f.endswith(".json") and f[:-5].isdigit() and int(f[:-5]) >= len(shards):
            try:
                os.remove(os.path.join(DATA, "lyrics", f))
            except OSError:
                pass
    out = {"version": 3, "updated": lib.get("updated"), "count": len(rows), "shard": SHARD, "shards": len(shards), "fields": FIELDS, "rows": rows}
    atomic_write(os.path.join(DATA, "songs.json"), json.dumps(out, ensure_ascii=False, separators=(",", ":")))


def save_library(lib):
    os.makedirs(DATA, exist_ok=True)
    atomic_write(os.path.join(DATA, "library.json"), json.dumps(lib, ensure_ascii=False, separators=(",", ":")))
    write_split(lib)
    old = os.path.join(DATA, "library.js")  # older format, no longer used
    if os.path.exists(old):
        try:
            os.remove(old)
        except OSError:
            pass


def refresh_split_if_stale():
    full = os.path.join(DATA, "library.json")
    meta = os.path.join(DATA, "songs.json")
    if os.path.exists(full) and (not os.path.exists(meta) or os.path.getmtime(meta) < os.path.getmtime(full)):
        with open(full, encoding="utf-8") as f:
            write_split(json.load(f))


STATS = os.path.join(DATA, "stats.json")
STATS_LOCK = threading.Lock()
EMPTY = {"played": 0, "solved": 0, "s0": 0, "s1": 0, "s2": 0, "s3": 0, "s4": 0, "s5": 0, "s6": 0, "x": 0, "total_ms": 0}
TRACK_ID = re.compile(r"^[A-Za-z0-9]{22}$")


def load_stats():
    try:
        with open(STATS, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


PLAYERS = os.path.join(DATA, "players.json")
PID = re.compile(r"^[A-Za-z0-9-]{16,64}$")
BOARD = {"run": "best_run", "streak": "best_streak", "points": "points"}


def load_players():
    try:
        with open(PLAYERS, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def clean_name(n):
    n = re.sub(r"[\x00-\x1f<>]", "", str(n or ""))
    return re.sub(r"\s+", " ", n).strip()[:24]


MODES = {"easy": 5, "medium": 3, "hard": 1}
LEVEL_MULT = [1, 1.25, 1.5, 1.75, 2]


def level_of(solved):
    return min(len(LEVEL_MULT) - 1, solved // 5)


def player_api(path, query, b):
    """Local copy of the leaderboard API in _worker.js (same rules)."""
    q = lambda k: (query.get(k) or [""])[0]
    with STATS_LOCK:
        ps = load_players()
        if path == "/api/leaderboard":
            pid = q("pid")
            if q("by") == "points":
                rows = [dict(name=p["name"], spotify=p["spotify"], value=p["points"], solved=p["solved"], played=p["played"]) for p in ps.values() if p["played"] > 0]
                mine = ps.get(pid)
                mv = mine["points"] if mine and mine["played"] > 0 else None
            else:
                mode = q("mode") if q("mode") in MODES else "easy"
                col = "best_streak" if q("by") == "streak" else "best_score"
                rows = []
                for p in ps.values():
                    g = p.get("modes", {}).get(mode)
                    if g and g[col] > 0:
                        rows.append(dict(name=p["name"], spotify=p["spotify"], value=g[col], best_score=g["best_score"], best_streak=g["best_streak"], games=g["games"]))
                g = ps.get(pid, {}).get("modes", {}).get(mode)
                mv = g[col] if g and g[col] > 0 else None
            rows.sort(key=lambda r: -r["value"])
            me = dict(name=ps[pid]["name"], value=mv, rank=1 + sum(1 for r in rows if r["value"] > mv)) if mv is not None else None
            return 200, {"top": rows[:50], "me": me, "players": len(rows)}
        if not b or not PID.match(str(b.get("pid", ""))):
            return 400, {"error": "bad input"}
        pid = b["pid"]
        if path == "/api/player":
            name = clean_name(b.get("name"))
            if len(name) < 2:
                return 400, {"error": "Name must be at least 2 characters"}
            if any(k != pid and p["name"].lower() == name.lower() for k, p in ps.items()):
                return 409, {"error": "That name is taken — try another"}
            p = ps.setdefault(pid, {"points": 0, "solved": 0, "played": 0, "updated": 0, "modes": {}})
            p.update(name=name, spotify=1 if b.get("spotify") else 0)
            atomic_write(PLAYERS, json.dumps(ps))
            return 200, {"ok": True, "name": name}
        if path == "/api/round":
            p, mode = ps.get(pid), b.get("mode")
            if mode not in MODES:
                return 400, {"error": "bad input"}
            if not p:
                return 404, {"error": "unknown player"}
            now = int(time.time() * 1000)
            if now - p.get("updated", 0) < 1000:
                return 429, {"error": "too fast"}
            g = p.setdefault("modes", {}).setdefault(mode, {"cur_score": 0, "cur_streak": 0, "cur_solved": 0, "strikes": 0, "best_score": 0, "best_streak": 0, "games": 0})
            if b.get("fresh") is True:
                g.update(cur_score=0, cur_streak=0, cur_solved=0, strikes=0)
            won = b.get("won") is True
            pts = max(0, min(int(b.get("pts") or 0), round((150 + 10 * g["cur_streak"]) * LEVEL_MULT[level_of(g["cur_solved"])]))) if won else 0
            if won:
                g["cur_score"] += pts; g["cur_streak"] += 1; g["cur_solved"] += 1
            else:
                g["cur_streak"] = 0; g["strikes"] += 1
            g["best_score"] = max(g["best_score"], g["cur_score"]); g["best_streak"] = max(g["best_streak"], g["cur_streak"])
            over = g["strikes"] >= MODES[mode]
            res = {"ok": True, "pts": pts, "score": g["cur_score"], "streak": g["cur_streak"], "strikes": g["strikes"], "over": over, "best_score": g["best_score"], "best_streak": g["best_streak"]}
            if over:
                g["games"] += 1
                g.update(cur_score=0, cur_streak=0, cur_solved=0, strikes=0)
            p["played"] += 1; p["solved"] += 1 if won else 0; p["points"] += pts; p["updated"] = now
            atomic_write(PLAYERS, json.dumps(ps))
            return 200, res
    return 404, {"error": "not found"}


class Handler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, obj, status=200):
        out = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(out)))
        self.end_headers()
        self.wfile.write(out)

    def do_GET(self):
        if self.path.startswith("/api/leaderboard"):
            u = urllib.parse.urlparse(self.path)
            code, obj = player_api(u.path, urllib.parse.parse_qs(u.query), None)
            return self.send_json(obj, code)
        if self.path.startswith("/api/stats/"):
            tid = self.path.split("/")[3].split("?")[0]
            if not TRACK_ID.match(tid):
                return self.send_json({"error": "bad id"}, 400)
            return self.send_json(dict(EMPTY, id=tid, **load_stats().get(tid, {})))
        return super().do_GET()

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "/api/" in str(args[0] if args else ""):
            sys.stderr.write("%s\n" % (fmt % args))

    def do_POST(self):
        if self.path.split("?")[0] in ("/api/player", "/api/round"):
            try:
                b = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))).decode("utf-8"))
            except ValueError:
                b = None
            code, obj = player_api(self.path.split("?")[0], {}, b if isinstance(b, dict) else None)
            return self.send_json(obj, code)
        if self.path.split("?")[0] == "/api/stats":
            try:
                b = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))).decode("utf-8"))
                tid, won = str(b.get("id", "")), b.get("won") is True
                col = {100: "s5", 200: "s6", 500: "s0", 1000: "s1", 3000: "s2", 8000: "s3", 15000: "s4"}.get(b.get("clip"))
                ms = max(0, min(600000, int(b.get("ms") or 0)))
                if not TRACK_ID.match(tid) or (won and not col):
                    return self.send_json({"error": "bad input"}, 400)
                with STATS_LOCK:
                    allst = load_stats()
                    row = dict(EMPTY, **allst.get(tid, {}))
                    row["played"] += 1
                    if won:
                        row["solved"] += 1
                        row[col] += 1
                        row["total_ms"] += ms
                    else:
                        row["x"] += 1
                    allst[tid] = row
                    atomic_write(STATS, json.dumps(allst))
                return self.send_json(dict(row, id=tid))
            except Exception as e:  # noqa: BLE001
                return self.send_json({"error": str(e)}, 400)
        if self.path.split("?")[0] != "/api/save-library":
            self.send_error(404)
            return
        try:
            n = int(self.headers.get("Content-Length", "0"))
            lib = json.loads(self.rfile.read(n).decode("utf-8"))
            if not isinstance(lib.get("songs"), list):
                raise ValueError("bad payload")
            save_library(lib)
            out = json.dumps({"ok": True, "songs": len(lib["songs"])}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(out)))
            self.end_headers()
            self.wfile.write(out)
        except Exception as e:  # noqa: BLE001
            self.send_error(400, str(e))


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    refresh_split_if_stale()
    Handler.extensions_map.update({".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8"})
    with Server(("127.0.0.1", PORT), Handler) as httpd:
        url = "http://127.0.0.1:%d/" % PORT
        print("Song game running at " + url + "  (Ctrl+C to stop)")
        if "--no-browser" not in sys.argv:
            webbrowser.open(url)
        httpd.serve_forever()
