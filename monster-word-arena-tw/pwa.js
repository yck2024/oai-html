'use strict';

// PWA constants and URL builders for monster-word-arena-tw, scoped to
// /oai-html/monster-word-arena-tw/. Shared by sw.js (imported) and by tests; kept independent
// of game.js/app.js so it never needs to run on the page itself. Mirrors the pattern in
// taiwan-ehon/ehon.js, but every media file is precached at install (no per-item download UI):
// the app is meant to be fully playable offline after one visit.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MonsterWordArenaPwa = api;
})(typeof self !== 'undefined' ? self : this, () => {
  // The static shell: the page and every script/style/icon it loads. Precached at install
  // alongside every image and audio clip (from precache-manifest.js), so the whole game works
  // offline after the first visit — never hand-maintained; add a file here only if a new
  // top-level shell file is added to the app.
  const SHELL_FILES = [
    '', 'index.html', 'game.css',
    'game.js', 'pacing.js', 'i18n.js', 'sounds.js', 'arena.js', 'app.js', 'rewards.js', 'rewards-app.js',
    'offline.js',
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
  const SHELL_CACHE_NAME = `monster-word-arena-shell-${CACHE_VERSION}`;

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
    isAnalyticsUrl,
    isMediaUrl,
  };
});
