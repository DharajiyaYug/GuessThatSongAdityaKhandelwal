"""Builds dist/ — the folder to upload to Cloudflare Pages (static files only, no lyrics-in-one-file,
no local server). Usage:  python make_dist.py"""
import json
import os
import shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "dist")
FILES = ["index.html", "library.html", "callback.html", "config.js", "_headers", "_worker.js", "_routes.json"]
DIRS = ["css", "js"]

import server  # noqa: E402  (re-split library.json -> songs.json + lyrics shards)
with open(os.path.join(ROOT, "data", "library.json"), encoding="utf-8") as fh:
    server.write_split(json.load(fh))

# overwrite in place (files are replaced; nothing needs deleting)
os.makedirs(os.path.join(DIST, "data", "lyrics"), exist_ok=True)
for f in FILES:
    if os.path.exists(os.path.join(ROOT, f)):
        shutil.copy2(os.path.join(ROOT, f), os.path.join(DIST, f))
for d in DIRS:
    shutil.copytree(os.path.join(ROOT, d), os.path.join(DIST, d), dirs_exist_ok=True)
shutil.copy2(os.path.join(ROOT, "data", "songs.json"), os.path.join(DIST, "data", "songs.json"))
for f in os.listdir(os.path.join(ROOT, "data", "lyrics")):
    if f.endswith(".json"):
        shutil.copy2(os.path.join(ROOT, "data", "lyrics", f), os.path.join(DIST, "data", "lyrics", f))
# cache-busting: stamp script/style links so visitors get new code right after a deploy
import re, time
v = str(int(time.time()))
for page in ("index.html", "library.html", "callback.html"):
    fp = os.path.join(DIST, page)
    html = open(fp, encoding="utf-8").read()
    html = re.sub(r'(src|href)="((?:js/[a-z]+\.js)|css/style\.css|config\.js)"', lambda m: '%s="%s?v=%s"' % (m.group(1), m.group(2), v), html)
    open(fp, "w", encoding="utf-8").write(html)
with open(os.path.join(ROOT, "data", "songs.json"), encoding="utf-8") as fh:
    n = json.load(fh)["count"]
total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(DIST) for f in fs)
print("dist ready: %d songs, %.1f MB -> %s" % (n, total / 1e6, DIST))
