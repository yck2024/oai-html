'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const E = require('./ehon.js');
const stories = require('./stories.js');

const ROOT = __dirname;
const BASE = 'https://example.test/oai-html/taiwan-ehon/';

test('manifest.webmanifest is valid, bilingual, and scoped under the storybook path', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(raw); // throws on malformed JSON
  assert.ok(manifest.name.includes('えほん') && manifest.name.includes('繪本'), 'name is bilingual');
  assert.ok(manifest.short_name.length <= 12, 'short_name stays short enough for a home-screen label');
  assert.equal(manifest.start_url, '/oai-html/taiwan-ehon/');
  assert.equal(manifest.scope, '/oai-html/taiwan-ehon/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.lang, 'ja');
  assert.equal(manifest.theme_color, '#fbf1df');
  assert.equal(manifest.background_color, '#fbf1df');

  const sizes = manifest.icons.map(icon => icon.sizes);
  assert.ok(sizes.includes('192x192'), 'has a 192x192 icon');
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose !== 'maskable'), 'has a plain 512x512 icon');
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'), 'has a maskable 512x512 icon');
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(ROOT, icon.src)), `icon file exists: ${icon.src}`);
  }
});

test('the shelf and every generated book page link the manifest and an apple-touch-icon', () => {
  const pages = [
    ['shelf', fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')],
    ...stories.map(story => [story.id, fs.readFileSync(path.join(ROOT, story.id, 'index.html'), 'utf8')]),
  ];
  for (const [id, html] of pages) {
    assert.match(html, /<link rel="manifest" href="\.\/manifest\.webmanifest">/, `${id}: links the web manifest`);
    assert.match(html, /<link rel="apple-touch-icon" href="\.\/icons\/apple-touch-icon\.png">/, `${id}: links an apple-touch-icon`);
    assert.match(html, /<meta name="apple-mobile-web-app-capable" content="yes">/, `${id}: sets the iOS home-screen meta tag`);
    assert.match(html, /<script src="\.\/offline\.js"><\/script>/, `${id}: loads the offline/PWA controller script`);
  }
});

test('the shell precache list covers every static app file and every book page, built from stories.js', () => {
  const shellUrls = E.shellAssetUrls(stories, BASE);
  for (const file of ['', 'index.html', 'ehon.css', 'ehon.js', 'stories.js', 'app.js', 'offline.js', 'manifest.webmanifest']) {
    assert.ok(shellUrls.includes(`${BASE}${file}`), `shell precache includes ${file || '(shelf root)'}`);
  }
  for (const icon of ['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png']) {
    assert.ok(shellUrls.includes(`${BASE}icons/${icon}`), `shell precache includes icons/${icon}`);
  }
  for (const story of stories) {
    assert.ok(shellUrls.includes(`${BASE}${story.id}/`), `shell precache includes the ${story.id} book page`);
  }
  // Nothing hand-added beyond one page per story plus the fixed files: adding a book to
  // stories.js is the only thing that grows this list.
  assert.equal(shellUrls.length, 12 + stories.length);
});

test('the offline asset list for every book is complete against its own pages and narration in stories.js', () => {
  for (const story of stories) {
    const assets = E.bookAssetUrls(story, BASE);
    assert.equal(assets.page, `${BASE}${story.id}/`);

    const expectedImages = story.pages.map(page => `${BASE}${page.image}`);
    assert.deepEqual(assets.images, expectedImages, `${story.id}: every page picture is listed`);

    const expectedAudio = [];
    for (const page of story.pages) {
      for (const line of page.lines) {
        for (const lang of E.LANGUAGES) expectedAudio.push(`${BASE}audio/${story.id}/${lang}/${line.id}.mp3`);
      }
    }
    assert.deepEqual(assets.audio, expectedAudio, `${story.id}: every sentence clip in both languages is listed`);

    assert.deepEqual(assets.all, [assets.page, ...assets.images, ...assets.audio]);

    // Every listed image/audio file actually exists on disk, so a "download offline" never
    // silently skips a real file (the on-disk existence itself is covered by ehon.test.js).
    for (const url of [...assets.images, ...assets.audio]) {
      const relative = url.slice(BASE.length);
      assert.ok(fs.existsSync(path.join(ROOT, relative)), `${story.id}: ${relative} exists on disk`);
    }
  }
});

test('isAnalyticsUrl and isMediaUrl classify the three kinds of request the service worker must route', () => {
  assert.equal(E.isAnalyticsUrl('https://www.googletagmanager.com/gtag/js?id=G-QLFWNZWDSS'), true);
  assert.equal(E.isAnalyticsUrl('https://www.google-analytics.com/g/collect?v=2'), true);
  assert.equal(E.isAnalyticsUrl('https://region1.google-analytics.com/g/collect'), true);
  assert.equal(E.isAnalyticsUrl(`${BASE}index.html`), false);

  assert.equal(E.isMediaUrl(`${BASE}images/hu-gu-po/p01.webp`), true);
  assert.equal(E.isMediaUrl(`${BASE}audio/hu-gu-po/ja/p01-1.mp3`), true);
  assert.equal(E.isMediaUrl(`${BASE}index.html`), false);
  assert.equal(E.isMediaUrl(`${BASE}hu-gu-po/`), false);
});
