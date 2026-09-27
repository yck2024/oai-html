'use strict';

// Service worker for the taiwan-ehon PWA, scoped to /oai-html/taiwan-ehon/.
//
// Three kinds of request:
//  - analytics (GA4 script/beacon): always network-only, never cached, never intercepted with
//    a fallback — a failure offline is a failure of the real request, which gtag already
//    swallows silently.
//  - shell (HTML/CSS/JS/manifest/icons/book pages): stale-while-revalidate, in a cache that is
//    versioned so `activate` can drop stale files from a previous deploy.
//  - media (images/audio): cache-first, populated lazily as a reader visits pages, in an
//    unversioned cache so a deploy never throws away narration a family already downloaded.
//    Audio responses answer Range requests (206) from a cached full clip so iOS Safari can
//    seek/play offline.
//
// The pure functions below (buildShellUrls, buildRangeResponse, ...) are exported for
// sw.test.js to exercise without a real ServiceWorkerGlobalScope; `attach` wires them to the
// real install/activate/fetch/message events and only runs inside an actual service worker.

(function (root, factory) {
  const isNode = typeof module === 'object' && module.exports;
  if (isNode) {
    module.exports = factory(require('./ehon.js'), require('./stories.js'));
  } else {
    importScripts('./ehon.js', './stories.js');
    const api = factory(self.TaiwanEhon, self.TaiwanEhonStories);
    api.attach(self);
  }
})(typeof self !== 'undefined' ? self : this, (E, STORIES) => {
  const SHELL_CACHE_NAME = E.SHELL_CACHE_NAME;
  const MEDIA_CACHE_NAME = E.MEDIA_CACHE_NAME;

  function shellUrls(base) {
    return E.shellAssetUrls(STORIES, base);
  }

  function requestKind(url) {
    if (E.isAnalyticsUrl(url)) return 'analytics';
    if (E.isMediaUrl(url)) return 'media';
    return 'shell';
  }

  // Parses a single-range `Range: bytes=start-end` header against a known total length.
  // Returns null for anything absent, malformed, multi-range, or unsatisfiable — callers
  // should fall back to serving the whole resource in that case.
  function parseRange(rangeHeader, size) {
    if (!rangeHeader) return null;
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (!match || match[1] === '' && match[2] === '') return null;
    let start;
    let end;
    if (match[1] === '') {
      const suffixLength = Number(match[2]);
      start = Math.max(size - suffixLength, 0);
      end = size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    }
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) return null;
    return { start, end };
  }

  // Builds a 206 Partial Content response for `rangeHeader` out of a full cached Response.
  // Falls back to the full response (200) when there is no range to honor.
  async function buildRangeResponse(fullResponse, rangeHeader) {
    const buffer = await fullResponse.arrayBuffer();
    const contentType = fullResponse.headers.get('Content-Type') || 'application/octet-stream';
    const range = parseRange(rangeHeader, buffer.byteLength);
    if (!range) {
      return new Response(buffer, {
        status: 200,
        headers: { 'Content-Type': contentType, 'Accept-Ranges': 'bytes', 'Content-Length': String(buffer.byteLength) },
      });
    }
    const { start, end } = range;
    const slice = buffer.slice(start, end + 1);
    return new Response(slice, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`,
        'Content-Length': String(slice.byteLength),
      },
    });
  }

  async function handleMedia(request, caches, fetch) {
    const cache = await caches.open(MEDIA_CACHE_NAME);
    const cached = await cache.match(request.url);
    const rangeHeader = request.headers.get('Range');

    // A cached full response can answer iOS audio Range requests without a network round-trip.
    // Refresh its full copy in the background when online; never put a partial 206 in CacheStorage.
    if (cached && rangeHeader) {
      Promise.resolve(fetch(request.url)).then(response => {
        if (response && response.ok) return cache.put(request.url, response.clone());
      }).catch(() => {});
      return buildRangeResponse(cached, rangeHeader);
    }

    // Prefer the current online media so same-name story fixes appear on the next visit, while
    // retaining the cached copy as the offline fallback.
    try {
      const response = await fetch(request.url);
      if (response && response.ok) {
        try {
          await cache.put(request.url, response.clone());
        } catch (_error) {
          return response;
        }
        return rangeHeader ? buildRangeResponse(response, rangeHeader) : response;
      }
      if (!cached) return response;
    } catch (error) {
      if (!cached) throw error;
    }
    return cached ? buildRangeResponse(cached, null) : undefined;
  }

  async function handleShell(request, caches, fetch) {
    const cache = await caches.open(SHELL_CACHE_NAME);
    const cached = await cache.match(request.url);
    const network = fetch(request.url).then(response => {
      if (response && response.ok) cache.put(request.url, response.clone());
      return response;
    }).catch(() => null);
    if (cached) {
      network.catch(() => {});
      return cached;
    }
    const fresh = await network;
    if (fresh) return fresh;
    throw new Error(`taiwan-ehon: shell asset unavailable offline: ${request.url}`);
  }

  async function respond(request, { caches, fetch }) {
    const kind = requestKind(request.url);
    if (kind === 'analytics') return fetch(request);
    if (kind === 'media') return handleMedia(request, caches, fetch);
    return handleShell(request, caches, fetch);
  }

  function attach(self) {
    const scope = self.registration.scope;

    self.addEventListener('install', event => {
      event.waitUntil((async () => {
        const cache = await caches.open(SHELL_CACHE_NAME);
        await cache.addAll(shellUrls(scope));
      })());
    });

    self.addEventListener('activate', event => {
      event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(
          names
            .filter(name => name.startsWith('taiwan-ehon-shell-') && name !== SHELL_CACHE_NAME)
            .map(name => caches.delete(name)),
        );
        await self.clients.claim();
      })());
    });

    self.addEventListener('fetch', event => {
      const url = event.request.url;
      if (!url.startsWith(scope) && requestKind(url) !== 'analytics') return;
      if (event.request.method !== 'GET') return;
      event.respondWith(respond(event.request, { caches, fetch }).catch(() => fetch(event.request)));
    });

    // Lets the page ask the waiting worker to activate immediately after showing an
    // "update available" notice, instead of forcing a reload the reader didn't ask for.
    self.addEventListener('message', event => {
      if (event.data === 'skip-waiting') self.skipWaiting();
    });
  }

  return {
    SHELL_CACHE_NAME,
    MEDIA_CACHE_NAME,
    shellUrls,
    requestKind,
    parseRange,
    buildRangeResponse,
    handleMedia,
    handleShell,
    respond,
    attach,
  };
});
