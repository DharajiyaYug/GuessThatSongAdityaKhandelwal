/*
  Spotify Embed (iFrame API) wrapper.
  Behaviour measured in Chrome with a logged-in Spotify account:
   - play() always restarts a track from 0:00 and ignores an immediate seek()
   - seek(sec) + togglePlay() resumes from that point (~350 ms latency)
   - playback_update events arrive about every 265 ms
  So each new track is "primed" once (play -> first audio -> pause), masked by
  radio static, and every clip after that is seek(hook) + togglePlay().
*/
(function () {
  const SG = (window.SG = window.SG || {});
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  class SpotifyClipPlayer {
    constructor(el, opts = {}) {
      this.el = el;
      this.opts = opts;
      this.ctl = null;
      this.state = { isPaused: true, position: 0, duration: 0, uri: null };
      this.listeners = [];
      this.primedUri = null;
      this.ready = new Promise((res) => (this._resolveReady = res));
      this._load();
    }
    _load() {
      const init = (API) => {
        API.createController(this.el, {
          uri: this.opts.uri || 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
          width: this.opts.width || '100%', height: this.opts.height || 152,
        }, (ctl) => {
          this.ctl = ctl;
          ctl.addListener('ready', () => this._resolveReady());
          ctl.addListener('playback_update', (e) => {
            const d = e.data || {};
            this.state = { isPaused: d.isPaused, isBuffering: d.isBuffering, position: d.position || 0, duration: d.duration || 0, uri: d.playingURI, t: performance.now() };
            if (!d.isPaused) {
              // first tap on the Spotify player itself (needed on phones): stop at once, the track is now ready
              if (this._unlock) { this._unlock = false; ctl.pause(); this.primedUri = this.currentUri; if (this.onUnlocked) this.onUnlocked(); }
              // watchdog: never let the song run on its own (phones sometimes ignore a pause or start by themselves)
              else if (!this._allow && !this._free) ctl.pause();
              else if (this._endPos && d.position >= this._endPos) { this._allow = false; this._endPos = 0; ctl.pause(); }
            }
            this.listeners.forEach((f) => f(this.state));
          });
          setTimeout(() => this._resolveReady(), 6000);
        });
      };
      if (window.__spotifyIframeAPI) init(window.__spotifyIframeAPI);
      else {
        const prev = window.onSpotifyIframeApiReady;
        window.onSpotifyIframeApiReady = (API) => { window.__spotifyIframeAPI = API; if (prev) prev(API); init(API); };
        if (!document.querySelector('script[src*="embed/iframe-api"]')) {
          const s = document.createElement('script');
          s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true;
          document.body.appendChild(s);
        }
      }
    }
    onUpdate(fn) { this.listeners.push(fn); }
    waitFor(pred, timeout = 4000) {
      return new Promise((resolve) => {
        if (pred(this.state)) return resolve(true);
        const fn = (st) => { if (pred(st)) { done(); resolve(true); } };
        const done = () => { this.listeners = this.listeners.filter((f) => f !== fn); clearTimeout(t); };
        const t = setTimeout(() => { done(); resolve(false); }, timeout);
        this.listeners.push(fn);
      });
    }
    async load(uri) {
      await this.ready;
      this._cancel();
      this.primedUri = null;
      this.state = { isPaused: true, position: 0, duration: 0, uri: null };
      await this.ctl.loadUri(uri);
      this.currentUri = uri;
      await this.waitFor((s) => s.uri === uri && s.duration > 0, 3500);
    }
    // Starts the track once so later seeks work; returns when paused again.
    async prime() {
      if (this.primedUri === this.currentUri) return true;
      this._allow = true; this._endPos = 0;
      this.ctl.play();
      const ok = await this.waitFor((s) => !s.isPaused && s.position > 0, 6000);
      this._allow = false;
      this.ctl.pause();
      await this.waitFor((s) => s.isPaused, 1500);
      if (ok) this.primedUri = this.currentUri;
      return ok;
    }
    /** Phones: wait for the user to tap play inside the Spotify player once. */
    armUnlock(cb) { this._unlock = true; this.onUnlocked = cb; }
    _cancel() {
      this._allow = false; this._endPos = 0;
      this._token = (this._token || 0) + 1;
      clearTimeout(this._stopTimer);
    }
    pause() { this._cancel(); if (this.ctl && !this.state.isPaused) this.ctl.pause(); }
    /** Play `lenMs` from `startMs`. onProgress(fraction) is called while playing. */
    async playClip(startMs, lenMs, onProgress) {
      await this.ready;
      this._cancel();
      const token = this._token;
      if (this.primedUri !== this.currentUri) await this.prime();
      if (token !== this._token) return;
      // Spotify only seeks to whole seconds. Cues start 400 ms before the sung line, so round UP from the
      // line's start: the clip always begins inside the singing, never in the silence before it
      const startSec = Math.max(0, Math.ceil((startMs + 400) / 1000));
      const base = startSec * 1000;
      if (!this.state.isPaused) { this.ctl.pause(); await this.waitFor((s) => s.isPaused, 800); }
      let started = false;
      for (let attempt = 0; attempt < 2 && !started; attempt++) {
        this.ctl.seek(startSec);
        await sleep(attempt ? 400 : 120);
        if (token !== this._token) return;
        this._allow = true;
        this._endPos = base + lenMs + 450; // hard stop by song position, in case the timer is late
        this.ctl.togglePlay();
        started = await this.waitFor((s) => !s.isPaused, 5000);
        if (token !== this._token) return;
        // phones sometimes ignore the seek and play from somewhere else: stop and try once more
        if (started && Math.abs(this.state.position - base) > 2500) { this._allow = false; this.ctl.pause(); await this.waitFor((s) => s.isPaused, 800); started = false; }
      }
      if (!started) { this._allow = false; this.ctl.pause(); return 'failed'; }
      const t0 = performance.now();
      const already = Math.max(0, this.state.position - base) + (performance.now() - this.state.t);
      // position updates are ~265 ms apart, so for very short clips play the full length from now
      const remaining = lenMs < 500 ? lenMs : Math.max(0, lenMs - already - 40);
      return new Promise((resolve) => {
        const tick = () => {
          if (token !== this._token) return resolve();
          const el = performance.now() - t0 + already;
          if (onProgress) onProgress(Math.min(1, el / lenMs));
          if (el < lenMs) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        this._stopTimer = setTimeout(() => {
          if (token !== this._token) return resolve();
          this._allow = false; this._endPos = 0;
          this.ctl.pause();
          if (onProgress) onProgress(1);
          resolve();
        }, remaining);
      });
    }
    /** Continue playing from startMs without a stop (reveal / full listen). */
    async playFrom(startMs) {
      await this.ready;
      this._cancel();
      if (this.primedUri !== this.currentUri) await this.prime();
      if (!this.state.isPaused) { this.ctl.pause(); await this.waitFor((s) => s.isPaused, 800); }
      this.ctl.seek(Math.max(0, Math.ceil((startMs + 400) / 1000)));
      await sleep(120);
      this._allow = true; this._endPos = 0;
      this.ctl.togglePlay();
    }
    /** While the answer is shown the listener may play/pause the Spotify player freely. */
    setFree(on) { this._free = !!on; }
  }
  SG.SpotifyClipPlayer = SpotifyClipPlayer;

  /* ---- radio static (masks the priming blip, adds atmosphere) ---- */
  let actx = null;
  // radio static & beeps: their own volume (Settings slider), on top of the device volume
  SG.fxVolume = () => { const v = SG.store && SG.store.get('fxvol', 0.5); return v == null ? 0.5 : +v; };
  SG.staticNoise = function (ms = 900, vol = 0.12) {
    vol *= SG.fxVolume() * 2;
    if (!vol) return () => {};
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(actx.sampleRate * ms / 1000);
      const buf = actx.createBuffer(1, len, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const env = Math.min(1, i / (len * 0.08)) * Math.min(1, (len - i) / (len * 0.25));
        d[i] = (Math.random() * 2 - 1) * env * (0.6 + 0.4 * Math.sin(i / 900));
      }
      const src = actx.createBufferSource(); src.buffer = buf;
      const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 0.6;
      const g = actx.createGain(); g.gain.value = vol;
      src.connect(bp).connect(g).connect(actx.destination);
      src.start();
      return () => { try { g.gain.setTargetAtTime(0, actx.currentTime, 0.05); setTimeout(() => src.stop(), 300); } catch (e) {} };
    } catch (e) { return () => {}; }
  };
  SG.blip = function (freq = 880, ms = 120, vol = 0.08) {
    vol *= SG.fxVolume() * 2;
    if (!vol) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(); const g = actx.createGain();
      o.frequency.value = freq; g.gain.value = vol;
      g.gain.setTargetAtTime(0, actx.currentTime + ms / 1000 * 0.6, 0.03);
      o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + ms / 1000 + 0.1);
    } catch (e) {}
  };
})();
