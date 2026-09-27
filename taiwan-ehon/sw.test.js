'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const sw = require('./sw.js');
const stories = require('./stories.js');

const BASE = 'https://example.test/oai-html/taiwan-ehon/';

// A minimal in-memory stand-in for CacheStorage/Cache, just enough for sw.js's own logic
// (open/match/put by URL string) — not a browser, so no real ServiceWorkerGlobalScope needed.
function fakeCaches() {
  const named = new Map(); // cache name -> Map(url -> Response)
  function cacheFor(name) {
    if (!named.has(name)) named.set(name, new Map());
    const store = named.get(name);
    return {
      match: async url => store.get(url)?.clone(),
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
  assert.equal(sw.requestKind(`${BASE}images/hu-gu-po/cover.webp`), 'media');
  assert.equal(sw.requestKind(`${BASE}audio/hu-gu-po/ja/p01-1.mp3`), 'media');
  assert.equal(sw.requestKind(`${BASE}index.html`), 'shell');
  assert.equal(sw.requestKind(`${BASE}hu-gu-po/`), 'shell');
});

test('shellUrls lists one entry per story plus the fixed app-shell files, from stories.js', () => {
  const urls = sw.shellUrls(BASE);
  assert.equal(urls.filter(url => url.endsWith('/') && url !== BASE).length, stories.length);
  for (const story of stories) assert.ok(urls.includes(`${BASE}${story.id}/`));
});

test('respond() never routes an analytics request through the cache', async () => {
  const caches = fakeCaches();
  let fetchedUrl = null;
  const fetchImpl = async request => {
    fetchedUrl = typeof request === 'string' ? request : request.url;
    return new Response('ok', { status: 200 });
  };
  const request = new Request('https://www.googletagmanager.com/gtag/js?id=x');
  const response = await sw.respond(request, { caches, fetch: fetchImpl });
  assert.equal(response.status, 200);
  assert.equal(fetchedUrl, request.url);
  assert.equal(caches._store.size, 0, 'nothing was cached for an analytics request');
});

test('respond() serves a cached shell asset immediately (stale-while-revalidate) without waiting on the network', async () => {
  const caches = fakeCaches();
  const cache = await caches.open(sw.SHELL_CACHE_NAME);
  await cache.put(`${BASE}index.html`, new Response('<html>cached shell</html>'));
  let fetchCalled = false;
  const fetchImpl = async () => { fetchCalled = true; return new Response('<html>network</html>'); };
  const request = new Request(`${BASE}index.html`);
  const response = await sw.respond(request, { caches, fetch: fetchImpl });
  assert.equal(await response.text(), '<html>cached shell</html>');
  // stale-while-revalidate still triggers a background fetch, but respond() itself must not
  // await it before returning the cached copy.
  await Promise.resolve();
  assert.equal(fetchCalled, true);
});

test('respond() falls back to the network for a shell asset with no cached copy yet', async () => {
  const caches = fakeCaches();
  const fetchImpl = async () => new Response('<html>fresh</html>', { status: 200 });
  const request = new Request(`${BASE}hu-gu-po/`);
  const response = await sw.respond(request, { caches, fetch: fetchImpl });
  assert.equal(await response.text(), '<html>fresh</html>');
});

test('online media refreshes changed cached files, while unchanged and offline copies remain available', async () => {
  const caches = fakeCaches();
  const url = `${BASE}images/hu-gu-po/cover.webp`;
  const cache = await caches.open(sw.MEDIA_CACHE_NAME);
  await cache.put(url, new Response(new Uint8Array([1, 2, 3, 4]), { headers: { 'Content-Type': 'image/webp' } }));

  const changed = await sw.respond(new Request(url), {
    caches,
    fetch: async () => new Response(new Uint8Array([5, 6, 7]), { headers: { 'Content-Type': 'image/webp' } }),
  });
  assert.deepEqual([...new Uint8Array(await changed.arrayBuffer())], [5, 6, 7]);
  const cachedChanged = await cache.match(url);
  assert.deepEqual([...new Uint8Array(await cachedChanged.arrayBuffer())], [5, 6, 7]);

  const unchanged = await sw.respond(new Request(url), {
    caches,
    fetch: async () => new Response(new Uint8Array([5, 6, 7]), { headers: { 'Content-Type': 'image/webp' } }),
  });
  assert.deepEqual([...new Uint8Array(await unchanged.arrayBuffer())], [5, 6, 7]);
  const offline = await sw.respond(new Request(url), { caches, fetch: async () => { throw new Error('offline'); } });
  assert.deepEqual([...new Uint8Array(await offline.arrayBuffer())], [5, 6, 7]);
});

test('a first Range request waits for caching and returns the fetched response if caching fails', async () => {
  const url = `${BASE}audio/hu-gu-po/ja/p01-1.mp3`;
  const bytes = new Uint8Array([1, 2, 3, 4]);
  let releaseWrite;
  let writeStarted;
  const started = new Promise(resolve => { writeStarted = resolve; });
  const writeGate = new Promise(resolve => { releaseWrite = resolve; });
  let matchCalls = 0;
  let writeCompleted = false;
  const caches = {
    open: async () => ({
      match: async () => {
        matchCalls += 1;
        if (matchCalls > 1 && !writeCompleted) throw new Error('cache read raced the write');
        return caches.stored?.clone();
      },
      put: async (_url, response) => {
        writeStarted();
        await writeGate;
        caches.stored = response;
        writeCompleted = true;
      },
    }),
    stored: null,
  };
  const request = new Request(url, { headers: { Range: 'bytes=1-2' } });
  const fetched = new Response(bytes, { headers: { 'Content-Type': 'audio/mpeg' } });
  const pending = sw.respond(request, { caches, fetch: async () => fetched.clone() });
  await started;
  assert.equal(matchCalls, 1, 'only the initial cache lookup occurs while the write is pending');
  releaseWrite();
  const partial = await pending;
  assert.equal(partial.status, 206);
  assert.equal(await partial.text(), '\u0002\u0003');

  let failingMatchCalls = 0;
  const failingCaches = {
    open: async () => ({
      match: async () => {
        failingMatchCalls += 1;
        if (failingMatchCalls > 1) throw new Error('must not read after a failed write');
        return undefined;
      },
      put: async () => { throw new Error('quota exceeded'); },
    }),
  };
  const full = await sw.respond(request, {
    caches: failingCaches,
    fetch: async () => new Response(bytes, { headers: { 'Content-Type': 'audio/mpeg' } }),
  });
  assert.equal(full.status, 200);
  assert.equal(await full.text(), '\u0001\u0002\u0003\u0004');
});

test('a cached audio clip answers a Range request with a correct 206 partial response', async () => {
  const caches = fakeCaches();
  const bytes = new Uint8Array(2000).map((_, i) => i % 256);
  const cache = await caches.open(sw.MEDIA_CACHE_NAME);
  const url = `${BASE}audio/hu-gu-po/ja/p01-1.mp3`;
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

test('concurrent cached Range requests return immediately and share one refresh that updates the cache', async () => {
  const caches = fakeCaches();
  const url = `${BASE}audio/hu-gu-po/ja/p01-1.mp3`;
  const cache = await caches.open(sw.MEDIA_CACHE_NAME);
  await cache.put(url, new Response(new Uint8Array([1, 2, 3, 4]), { headers: { 'Content-Type': 'audio/mpeg' } }));

  let releaseFetch;
  const fetchGate = new Promise(resolve => { releaseFetch = resolve; });
  let fetchCount = 0;
  const refreshes = [];
  const fetchImpl = async () => {
    fetchCount += 1;
    await fetchGate;
    return new Response(new Uint8Array([5, 6, 7]), { headers: { 'Content-Type': 'audio/mpeg' } });
  };
  const onBackground = refresh => refreshes.push(refresh);
  const requestA = new Request(url, { headers: { Range: 'bytes=0-1' } });
  const requestB = new Request(url, { headers: { Range: 'bytes=2-3' } });

  const [responseA, responseB] = await Promise.all([
    sw.respond(requestA, { caches, fetch: fetchImpl, onBackground }),
    sw.respond(requestB, { caches, fetch: fetchImpl, onBackground }),
  ]);
  assert.deepEqual([...new Uint8Array(await responseA.arrayBuffer())], [1, 2]);
  assert.deepEqual([...new Uint8Array(await responseB.arrayBuffer())], [3, 4]);
  assert.equal(fetchCount, 1, 'concurrent Range requests share a single full-file fetch');
  assert.equal(refreshes.length, 2);
  assert.strictEqual(refreshes[0], refreshes[1], 'each event keeps the shared refresh alive');

  releaseFetch();
  await Promise.all(refreshes);
  const refreshed = await cache.match(url);
  assert.deepEqual([...new Uint8Array(await refreshed.arrayBuffer())], [5, 6, 7]);
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
  await caches.open('taiwan-ehon-shell-v0');
  await caches.open(sw.SHELL_CACHE_NAME);
  await caches.open(sw.MEDIA_CACHE_NAME);
  const names = await caches.keys();
  const stale = names.filter(name => name.startsWith('taiwan-ehon-shell-') && name !== sw.SHELL_CACHE_NAME);
  for (const name of stale) await caches.delete(name);
  const remaining = await caches.keys();
  assert.ok(remaining.includes(sw.SHELL_CACHE_NAME));
  assert.ok(remaining.includes(sw.MEDIA_CACHE_NAME));
  assert.ok(!remaining.includes('taiwan-ehon-shell-v0'));
});
