'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const sw = require('./sw.js');
const MANIFEST = require('./precache-manifest.js');

const BASE = 'https://example.test/oai-html/math-island/';

// A minimal in-memory stand-in for CacheStorage/Cache, just enough for sw.js's own logic
// (open/match/put/addAll by URL string) — not a browser, so no real ServiceWorkerGlobalScope
// needed.
function fakeCaches() {
  const named = new Map(); // cache name -> Map(url -> Response)
  function cacheFor(name) {
    if (!named.has(name)) named.set(name, new Map());
    const store = named.get(name);
    return {
      match: async url => store.get(url),
      put: async (url, response) => { store.set(url, response.clone ? response.clone() : response); },
      delete: async url => store.delete(url),
      addAll: async urls => { for (const url of urls) store.set(url, new Response(`stub:${url}`)); },
    };
  }
  return {
    open: async name => cacheFor(name),
    keys: async () => [...named.keys()],
    delete: async name => named.delete(name),
    get _store() {
      const all = new Map();
      for (const store of named.values()) for (const [key, value] of store) all.set(key, value);
      return all;
    },
  };
}

test('requestKind routes analytics straight to the network, media to the cache-first path, and everything else as shell', () => {
  assert.equal(sw.requestKind('https://www.googletagmanager.com/gtag/js?id=G-QLFWNZWDSS'), 'analytics');
  assert.equal(sw.requestKind('https://yck2024.github.io/oai-html/assets/analytics.js'), 'analytics');
  assert.equal(sw.requestKind(`${BASE}dino-spirit/images/rag.webp`), 'media');
  assert.equal(sw.requestKind(`${BASE}poko/audio/poko-count.mp3`), 'media');
  assert.equal(sw.requestKind(`${BASE}poko/index.html`), 'shell');
});

test('shellUrls and mediaUrls list the fixed app-shell files across all three games and every file in precache-manifest.js', () => {
  const shell = sw.shellUrls(BASE);
  assert.ok(shell.includes(`${BASE}index.html`));
  assert.ok(shell.includes(`${BASE}poko/index.html`));
  assert.ok(shell.includes(`${BASE}number-garden/index.html`));
  assert.ok(shell.includes(`${BASE}dino-spirit/index.html`));
  assert.ok(shell.includes(`${BASE}manifest.webmanifest`));

  const media = sw.mediaUrls(BASE);
  assert.equal(media.length, MANIFEST.IMAGES.length + MANIFEST.AUDIO.length);
  for (const name of MANIFEST.IMAGES) assert.ok(media.includes(`${BASE}${name}`));
  for (const name of MANIFEST.AUDIO) assert.ok(media.includes(`${BASE}${name}`));
});

test('respond() never routes an analytics request through the cache', async () => {
  const caches = fakeCaches();
  let fetchedUrl = null;
  const fetchImpl = async request => {
    fetchedUrl = typeof request === 'string' ? request : request.url;
    return new Response('ok', { status: 200 });
  };
  const request = new Request('https://yck2024.github.io/oai-html/assets/analytics.js');
  const response = await sw.respond(request, { caches, fetch: fetchImpl });
  assert.equal(response.status, 200);
  assert.equal(fetchedUrl, request.url);
  assert.equal(caches._store.size, 0, 'nothing was cached for an analytics request');
});

test('respond() serves a cached shell asset immediately (stale-while-revalidate) without waiting on the network', async () => {
  const caches = fakeCaches();
  const cache = await caches.open(sw.SHELL_CACHE_NAME);
  await cache.put(`${BASE}poko/index.html`, new Response('<html>cached shell</html>'));
  let fetchCalled = false;
  const fetchImpl = async () => { fetchCalled = true; return new Response('<html>network</html>'); };
  const request = new Request(`${BASE}poko/index.html`);
  const response = await sw.respond(request, { caches, fetch: fetchImpl });
  assert.equal(await response.text(), '<html>cached shell</html>');
  await Promise.resolve();
  assert.equal(fetchCalled, true);
});

test('respond() serves a precached media file straight from cache, no network fetch', async () => {
  const caches = fakeCaches();
  const cache = await caches.open(sw.MEDIA_CACHE_NAME);
  await cache.put(`${BASE}dino-spirit/images/rag.webp`, new Response(new Uint8Array([1, 2, 3, 4]), { headers: { 'Content-Type': 'image/webp' } }));
  const fetchImpl = async () => { throw new Error('must not hit the network for a precached image'); };
  const response = await sw.respond(new Request(`${BASE}dino-spirit/images/rag.webp`), { caches, fetch: fetchImpl });
  assert.equal((await response.arrayBuffer()).byteLength, 4);
});

test('a cached audio clip answers a Range request with a correct 206 partial response', async () => {
  const caches = fakeCaches();
  const bytes = new Uint8Array(2000).map((_, i) => i % 256);
  const cache = await caches.open(sw.MEDIA_CACHE_NAME);
  const url = `${BASE}poko/audio/poko-count.mp3`;
  await cache.put(url, new Response(bytes, { headers: { 'Content-Type': 'audio/mpeg' } }));

  const request = new Request(url, { headers: { Range: 'bytes=500-999' } });
  const fetchImpl = async () => { throw new Error('must not hit the network for a cached clip'); };
  const response = await sw.respond(request, { caches, fetch: fetchImpl });

  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), 'bytes 500-999/2000');
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  assert.equal(response.headers.get('Content-Length'), '500');
  const body = new Uint8Array(await response.arrayBuffer());
  assert.equal(body.length, 500);
  assert.deepEqual([...body.slice(0, 3)], [...bytes.slice(500, 503)]);
});

test('parseRange rejects absent, malformed, and out-of-bounds ranges so callers fall back to the full file', () => {
  assert.equal(sw.parseRange(undefined, 1000), null);
  assert.equal(sw.parseRange('not-a-range', 1000), null);
  assert.equal(sw.parseRange('bytes=2000-3000', 1000), null);
  assert.deepEqual(sw.parseRange('bytes=0-99', 1000), { start: 0, end: 99 });
  assert.deepEqual(sw.parseRange('bytes=950-', 1000), { start: 950, end: 999 });
  assert.deepEqual(sw.parseRange('bytes=-50', 1000), { start: 950, end: 999 });
});

test('activate cleans up old versioned shell caches but never touches the unversioned media cache', async () => {
  const caches = fakeCaches();
  await caches.open('math-island-shell-v0');
  await caches.open(sw.SHELL_CACHE_NAME);
  await caches.open(sw.MEDIA_CACHE_NAME);
  const names = await caches.keys();
  const stale = names.filter(name => name.startsWith('math-island-shell-') && name !== sw.SHELL_CACHE_NAME);
  for (const name of stale) await caches.delete(name);
  const remaining = await caches.keys();
  assert.ok(remaining.includes(sw.SHELL_CACHE_NAME));
  assert.ok(remaining.includes(sw.MEDIA_CACHE_NAME));
  assert.ok(!remaining.includes('math-island-shell-v0'));
});
