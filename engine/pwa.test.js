'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const E = require('./ehon.js');

const ROOT = path.join(__dirname, '..', 'taiwan-ehon');
const stories = require(path.join(ROOT, 'stories.js'));
const SERIES = require(path.join(ROOT, 'series.config.js'));
const BASE = 'https://example.test/oai-html/taiwan-ehon/';

function parseHeadElements(html) {
  const parser = `import json, sys\nfrom html.parser import HTMLParser\nclass HeadElements(HTMLParser):\n def __init__(self):\n  super().__init__(); self.elements = []\n def handle_starttag(self, tag, attrs):\n  if tag in ('link', 'meta', 'script'): self.elements.append({'tag': tag, **dict(attrs)})\np = HeadElements(); p.feed(sys.stdin.read()); print(json.dumps(p.elements))`;
  return JSON.parse(execFileSync('python3', ['-c', parser], { input: html, encoding: 'utf8' }));
}

test('manifest.webmanifest is valid, bilingual, and scoped under the storybook path', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(raw); // throws on malformed JSON
  assert.ok(manifest.name.includes('えほん') && manifest.name.includes('繪本'), 'name is bilingual');
  assert.ok(manifest.short_name.length <= 12, 'short_name stays short enough for a home-screen label');
  assert.equal(manifest.start_url, SERIES.basePath);
  assert.equal(manifest.scope, SERIES.basePath);
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

test('the shelf and every generated book page expose parsed PWA document metadata', () => {
  const pages = [
    ['shelf', fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')],
    ...stories.map(story => [story.id, fs.readFileSync(path.join(ROOT, story.id, 'index.html'), 'utf8')]),
  ];
  for (const [id, html] of pages) {
    const elements = parseHeadElements(html);
    assert.ok(elements.some(item => item.tag === 'link' && item.rel?.trim().split(/\s+/).includes('manifest') && item.href === './manifest.webmanifest'), `${id}: links the web manifest`);
    assert.ok(elements.some(item => item.tag === 'link' && item.rel?.trim().split(/\s+/).includes('apple-touch-icon') && item.href === './icons/apple-touch-icon.png'), `${id}: links an apple-touch-icon`);
    assert.ok(elements.some(item => item.tag === 'meta' && item.name === 'apple-mobile-web-app-capable' && item.content === 'yes'), `${id}: sets the iOS home-screen meta tag`);
    assert.ok(elements.some(item => item.tag === 'script' && item.src === './offline.js'), `${id}: loads the script that registers the service worker`);
  }
});

test('the shell precache list covers every static app file and every book page, built from stories.js', () => {
  const shellUrls = E.shellAssetUrls(stories, BASE);
  for (const file of [
    '', 'index.html', 'ehon.css', 'ehon.js', 'continuous.js', 'stories.js', 'series.config.js', 'app.js',
    'offline.js', 'manifest.webmanifest', 'audio-timing.js',
  ]) {
    assert.ok(shellUrls.includes(`${BASE}${file}`), `shell precache includes ${file || '(shelf root)'}`);
  }
  for (const icon of ['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png']) {
    assert.ok(shellUrls.includes(`${BASE}icons/${icon}`), `shell precache includes icons/${icon}`);
  }
  for (const silence of ['language.mp3', 'sentence.mp3', 'page.mp3']) {
    assert.ok(shellUrls.includes(`${BASE}silence/${silence}`), `shell precache includes silence/${silence}`);
  }
  for (const story of stories) {
    assert.ok(shellUrls.includes(`${BASE}${story.id}/`), `shell precache includes the ${story.id} book page`);
  }
  // Nothing hand-added beyond one page per story plus the fixed files: adding a book to
  // stories.js is the only thing that grows this list.
  assert.equal(shellUrls.length, 18 + stories.length);
});

test('the offline asset list for every book is complete against its own pages and narration in stories.js', () => {
  for (const story of stories) {
    const assets = E.bookAssetUrls(story, SERIES.languages, BASE);
    assert.equal(assets.page, `${BASE}${story.id}/`);

    const expectedImages = story.pages.map(page => `${BASE}${page.image}`);
    assert.deepEqual(assets.images, expectedImages, `${story.id}: every page picture is listed`);

    const expectedAudio = [];
    for (const page of story.pages) {
      for (const line of page.lines) {
        for (const lang of SERIES.languages) expectedAudio.push(`${BASE}audio/${story.id}/${lang}/${line.id}.mp3`);
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
