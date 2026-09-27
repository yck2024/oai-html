'use strict';

// PWA constants and URL builders for math-island, scoped to /oai-html/math-island/. Shared by
// sw.js (imported) and by tests; kept independent of any game's own script so it never needs to
// run inside a game page. Mirrors the pattern in taiwan-ehon/ehon.js, but every media file
// across all three games is precached at install (no per-item download UI): Math Island is
// meant to be fully playable offline, all three games, after one visit.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MathIslandPwa = api;
})(typeof self !== 'undefined' ? self : this, () => {
  // The static shell: the game-picker hub and every game page, plus the scripts/styles/icons
  // each one loads. Precached at install alongside every image and audio clip (from
  // precache-manifest.js), so all three games work offline after the first visit — never
  // hand-maintained; add a file here only if a new top-level shell file is added to the app.
  const SHELL_FILES = [
    '', 'index.html',
    'poko/index.html', 'poko/count-contract.js',
    'number-garden/index.html', 'number-garden/style.css', 'number-garden/game.js', 'number-garden/three.min.js',
    'dino-spirit/index.html', 'dino-spirit/game.css', 'dino-spirit/game.js',
    'pwa.css', 'offline.js',
    'manifest.webmanifest',
    'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-512-maskable.png', 'icons/apple-touch-icon.png',
  ];

  function shellAssetUrls(base = './') {
    return SHELL_FILES.map(name => `${base}${name}`);
  }

  function mediaAssetUrls(manifest, base = './') {
    return [...manifest.IMAGES, ...manifest.AUDIO].map(name => `${base}${name}`);
  }

  const CACHE_VERSION = 'v1';
  const SHELL_CACHE_NAME = `math-island-shell-${CACHE_VERSION}`;
  const MEDIA_CACHE_NAME = 'math-island-media';

  function isAnalyticsUrl(url) {
    return /^https:\/\/(www\.googletagmanager\.com|www\.google-analytics\.com|[a-z0-9-]+\.google-analytics\.com)\//.test(url)
      || /\/oai-html\/assets\/analytics\.js$/.test(url);
  }

  function isMediaUrl(url) {
    const pathname = (() => {
      try { return new URL(url, 'https://example.invalid/').pathname; } catch (_error) { return url; }
    })();
    return /\/(images|audio)\//.test(pathname);
  }

  return {
    SHELL_FILES,
    shellAssetUrls,
    mediaAssetUrls,
    CACHE_VERSION,
    SHELL_CACHE_NAME,
    MEDIA_CACHE_NAME,
    isAnalyticsUrl,
    isMediaUrl,
  };
});
