/* Spotify Web API: Authorization Code + PKCE (no client secret needed). */
(function () {
  const SG = (window.SG = window.SG || {});
  const CFG = window.SG_CONFIG || {};
  const AUTH = 'https://accounts.spotify.com';
  const API = 'https://api.spotify.com/v1';
  const SCOPES = 'playlist-read-private playlist-read-collaborative user-library-read user-library-modify playlist-modify-public playlist-modify-private';

  const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const randStr = (n) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (x) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[x % 62]).join(''); };
  const redirectUri = () => location.origin + '/callback.html';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const Spotify = {
    defaultClientId: CFG.spotifyClientId || '',
    // a visitor can paste the Client ID of their own Spotify developer app (Settings)
    clientId() { return SG.store.get('client_id', '') || this.defaultClientId; },
    usingOwnApp() { return !!SG.store.get('client_id', ''); },
    redirectUri,
    token: () => SG.store.get('sp_token', null),
    isLoggedIn() { const t = this.token(); return !!(t && (t.refresh_token || t.expires_at > Date.now())); },
    canWrite() { const t = this.token(); return !!(t && t.scope && t.scope.includes('user-library-modify') && t.scope.includes('playlist-modify')); },
    async login(returnTo) {
      const verifier = randStr(64);
      const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
      sessionStorage.setItem('sg_pkce', verifier);
      sessionStorage.setItem('sg_return', returnTo || location.pathname.replace(/^\//, '') + location.hash);
      const p = new URLSearchParams({
        client_id: this.clientId(), response_type: 'code', redirect_uri: redirectUri(),
        code_challenge_method: 'S256', code_challenge: challenge, scope: SCOPES,
      });
      location.href = AUTH + '/authorize?' + p;
    },
    async handleCallback() {
      const q = new URLSearchParams(location.search);
      if (q.get('error')) throw new Error('Spotify login: ' + q.get('error'));
      const body = new URLSearchParams({
        client_id: this.clientId(), grant_type: 'authorization_code', code: q.get('code'),
        redirect_uri: redirectUri(), code_verifier: sessionStorage.getItem('sg_pkce') || '',
      });
      const r = await fetch(AUTH + '/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error_description || j.error || 'token error');
      this._saveToken(j);
      try { const me = await this.me(); SG.store.set('sp_me', { id: me.id, name: me.display_name }); } catch (e) {
        // development-mode apps only work for the owner + 5 allow-listed people; everyone else gets 403
        if (e.status === 403) { this.logout(); const err = new Error('not allowed'); err.notAllowed = true; throw err; }
      }
      return sessionStorage.getItem('sg_return') || 'index.html';
    },
    _saveToken(j) {
      const old = this.token() || {};
      SG.store.set('sp_token', { access_token: j.access_token, refresh_token: j.refresh_token || old.refresh_token, scope: j.scope || old.scope || '', expires_at: Date.now() + (j.expires_in - 60) * 1000 });
    },
    async accessToken() {
      const t = this.token();
      if (!t) throw new Error('Connect Spotify first');
      if (t.expires_at > Date.now()) return t.access_token;
      const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: t.refresh_token, client_id: this.clientId() });
      const r = await fetch(AUTH + '/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      const j = await r.json();
      if (!r.ok) { SG.store.set('sp_token', null); throw new Error('Spotify session expired — connect again'); }
      this._saveToken(j);
      return j.access_token;
    },
    logout() { SG.store.set('sp_token', null); SG.store.set('sp_me', null); },
    me() { return this.request('GET', '/me'); },

    /* One shared throttle for every caller. Development-mode apps get a small rolling quota,
       so we stay around 45 requests/minute and back off hard when Spotify answers 429. */
    _next: 0, _gap: 1300,
    async _slot() {
      for (;;) {
        const now = Date.now();
        if (now >= this._next) { this._next = now + this._gap; return; }
        await sleep(this._next - now);
      }
    },
    async request(method, path, params, body) {
      const url = (path.startsWith('http') ? path : API + path) + (params ? '?' + new URLSearchParams(params) : '');
      let backoff = 15000;
      for (let attempt = 0; attempt < 8; attempt++) {
        await this._slot();
        const headers = { Authorization: 'Bearer ' + (await this.accessToken()) };
        if (body) headers['Content-Type'] = 'application/json';
        const r = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
        if (r.status === 429) {
          const wait = (+r.headers.get('Retry-After') * 1000) || backoff;
          backoff = Math.min(backoff * 2, 240000);
          this._gap = Math.min(this._gap + 300, 3000);
          this._next = Math.max(this._next, Date.now() + wait);
          SG.onRateLimit && SG.onRateLimit(wait);
          continue;
        }
        if (r.status === 401 && attempt === 0) { const t = this.token(); if (t) { t.expires_at = 0; SG.store.set('sp_token', t); } continue; }
        if (r.status >= 500) { await sleep(2000); continue; }
        if (this._gap > 1300) this._gap -= 20;
        const txt = await r.text();
        let j = {};
        try { j = txt ? JSON.parse(txt) : {}; } catch (e) {}
        if (!r.ok) { const e = new Error((j.error && j.error.message) || 'Spotify ' + r.status); e.status = r.status; throw e; }
        return j;
      }
      const e = new Error('Spotify is rate-limiting this app; will retry later'); e.rate = true; throw e;
    },
    get(path, params) { return this.request('GET', path, params); },

    async searchTracks(q, limit = 10, offset = 0) {
      const j = await this.get('/search', { q, type: 'track', limit, offset, market: 'IN' });
      return (j.tracks && j.tracks.items) || [];
    },
    async searchAlbums(q, limit = 10) {
      const j = await this.get('/search', { q, type: 'album', limit, market: 'IN' });
      return (j.albums && j.albums.items) || [];
    },
    getAlbum(id) { return this.get('/albums/' + id, { market: 'IN' }); },
    getTrack(id) { return this.get('/tracks/' + id, { market: 'IN' }); },
    getArtist(id) { return this.get('/artists/' + id); },
    async artistAlbums(id, groups = 'album,compilation') {
      let url = API + '/artists/' + id + '/albums?' + new URLSearchParams({ include_groups: groups, market: 'IN', limit: 50 });
      const out = [];
      let pages = 0;
      while (url && pages++ < 20) { const j = await this.get(url); out.push(...(j.items || []).filter(Boolean)); url = j.next; }
      return out;
    },
    parsePlaylistId(s) {
      const m = String(s).match(/playlist[/:]([A-Za-z0-9]{22})/) || String(s).match(/^([A-Za-z0-9]{22})$/);
      return m ? m[1] : null;
    },
    async playlistTracks(id, onPage) {
      const meta = await this.get('/playlists/' + id, { fields: 'name,owner(display_name,id)' });
      let url = API + '/playlists/' + id + '/items?limit=50&market=IN';
      const out = [];
      while (url) {
        let j;
        try { j = await this.get(url); } catch (e) {
          if (e.status === 403 || e.status === 404) {
            const err = new Error('Spotify only lets this app read playlists you own or collaborate on. Open the playlist in the Spotify app → ⋯ → Add to other playlist → New playlist, then import that copy.');
            err.status = e.status; throw err;
          }
          throw e;
        }
        (j.items || []).forEach((it) => { const t = it.item || it.track; if (t && t.type === 'track' && t.id) out.push(t); });
        onPage && onPage(out.length, j.total);
        url = j.next;
      }
      return { name: meta.name, tracks: out };
    },
    async myPlaylists(ownedOnly) {
      let url = API + '/me/playlists?limit=50';
      const out = [];
      while (url) { const j = await this.get(url); out.push(...(j.items || []).filter(Boolean)); url = j.next; }
      if (!ownedOnly) return out;
      const me = SG.store.get('sp_me', null) || await this.me().then((m) => ({ id: m.id }));
      return out.filter((p) => (p.owner && p.owner.id === me.id) || p.collaborative);
    },
    async likedTracks(onPage) {
      let url = API + '/me/tracks?limit=50&market=IN';
      const out = [];
      while (url) { const j = await this.get(url); (j.items || []).forEach((it) => it.track && out.push(it.track)); onPage && onPage(out.length, j.total); url = j.next; }
      return out;
    },
    /* ---- writing to the user's Spotify ---- */
    saveToLiked(uris) { return this.request('PUT', '/me/library', { uris: [].concat(uris).join(',') }); },
    async isLiked(uri) { const r = await this.request('GET', '/me/library/contains', { uris: uri }); return Array.isArray(r) && r[0]; },
    addToPlaylist(playlistId, uris) { return this.request('POST', '/playlists/' + playlistId + '/items', null, { uris: [].concat(uris) }); },
    createPlaylist(name, description) { return this.request('POST', '/me/playlists', null, { name, description: description || 'Made with Guess That Song', public: false }); },
  };
  SG.Spotify = Spotify;
})();
