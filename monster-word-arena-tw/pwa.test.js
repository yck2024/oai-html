'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const PWA = require('./pwa.js');
const MANIFEST = require('./precache-manifest.js');
const { buildManifest } = require('./generate-precache-manifest.js');

const ROOT = __dirname;
const BASE = 'https://example.test/oai-html/monster-word-arena-tw/';

function parseHeadElements(html) {
  const parser = `import json, sys\nfrom html.parser import HTMLParser\nclass HeadElements(HTMLParser):\n def __init__(self):\n  super().__init__(); self.elements = []\n def handle_starttag(self, tag, attrs):\n  if tag in ('link', 'meta', 'script'): self.elements.append({'tag': tag, **dict(attrs)})\np = HeadElements(); p.feed(sys.stdin.read()); print(json.dumps(p.elements))`;
  return JSON.parse(execFileSync('python3', ['-c', parser], { input: html, encoding: 'utf8' }));
}

test('manifest.webmanifest is valid, bilingual, and scoped under the app path', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(raw); // throws on malformed JSON
  assert.ok(manifest.name.includes('Word Arena') && manifest.name.includes('恐龍怪獸友誼擂台'), 'name is bilingual and matches the page title');
  assert.ok(manifest.short_name.length <= 12, 'short_name stays short enough for a home-screen label');
  assert.equal(manifest.id, '/oai-html/monster-word-arena-tw/');
  assert.equal(manifest.start_url, '/oai-html/monster-word-arena-tw/');
  assert.equal(manifest.scope, '/oai-html/monster-word-arena-tw/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#fff1d6');
  assert.equal(manifest.background_color, '#fff1d6');

  const sizes = manifest.icons.map(icon => icon.sizes);
  assert.ok(sizes.includes('192x192'), 'has a 192x192 icon');
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose !== 'maskable'), 'has a plain 512x512 icon');
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'), 'has a maskable 512x512 icon');
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(ROOT, icon.src)), `icon file exists: ${icon.src}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, 'icons/apple-touch-icon.png')), 'apple-touch-icon exists');
});

test('the page exposes parsed PWA document metadata', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const elements = parseHeadElements(html);
  assert.ok(elements.some(item => item.tag === 'link' && item.rel?.trim().split(/\s+/).includes('manifest') && item.href === './manifest.webmanifest'), 'links the web manifest');
  assert.ok(elements.some(item => item.tag === 'link' && item.rel?.trim().split(/\s+/).includes('apple-touch-icon') && item.href === './icons/apple-touch-icon.png'), 'links an apple-touch-icon');
  assert.ok(elements.some(item => item.tag === 'meta' && item.name === 'apple-mobile-web-app-capable' && item.content === 'yes'), 'sets the iOS home-screen meta tag');
  assert.ok(elements.some(item => item.tag === 'script' && item.src === './offline.js'), 'loads the script that registers the service worker');
});

test('the precache manifest is generated from images/ and audio/ on disk, never hand-maintained', () => {
  const fresh = buildManifest();
  assert.deepEqual(MANIFEST.IMAGES, fresh.IMAGES, 'precache-manifest.js images match a fresh scan of images/ — run node generate-precache-manifest.js if this fails');
  assert.deepEqual(MANIFEST.AUDIO, fresh.AUDIO, 'precache-manifest.js audio matches a fresh scan of audio/ — run node generate-precache-manifest.js if this fails');
});

test('the precache manifest lists every narration clip the game can speak, in all three languages', () => {
  const clips = [...Object.keys(require('./audio/prompts.json')), ...Object.keys(require('./audio/reactions.json'))];
  for (const id of clips) {
    for (const language of ['en', 'zh', 'ja']) {
      assert.ok(MANIFEST.AUDIO.includes(`audio/${language}/${id}.mp3`), `${language}/${id}.mp3 is precached for offline play`);
    }
  }
});

test('the shell cache version moved on from the earlier release, so returning players fetch the new game files', () => {
  assert.notEqual(PWA.CACHE_VERSION, 'v1', 'v1 shipped the earlier rules; a new version replaces its cached shell');
  assert.equal(PWA.SHELL_CACHE_NAME, `monster-word-arena-shell-${PWA.CACHE_VERSION}`);
});

test('the shell precache list covers every static app file', () => {
  const shellUrls = PWA.shellAssetUrls(BASE);
  for (const file of PWA.SHELL_FILES) {
    assert.ok(shellUrls.includes(`${BASE}${file}`), `shell precache includes ${file || '(app root)'}`);
    if (file) assert.ok(fs.existsSync(path.join(ROOT, file)), `${file} exists on disk`);
  }
  assert.equal(shellUrls.length, PWA.SHELL_FILES.length);
});

test('the media precache list is complete against every image and audio file on disk', () => {
  const urls = PWA.mediaAssetUrls(MANIFEST, BASE);
  assert.equal(urls.length, MANIFEST.IMAGES.length + MANIFEST.AUDIO.length);
  for (const name of [...MANIFEST.IMAGES, ...MANIFEST.AUDIO]) {
    assert.ok(urls.includes(`${BASE}${name}`), `media precache includes ${name}`);
    assert.ok(fs.existsSync(path.join(ROOT, name)), `${name} exists on disk`);
  }
  // Nothing hand-added beyond what's on disk: images/ and audio/ growing is the only thing
  // that grows this list.
  const onDiskImages = fs.readdirSync(path.join(ROOT, 'images')).filter(name => name.endsWith('.webp'));
  assert.equal(MANIFEST.IMAGES.length, onDiskImages.length);
});

test('isAnalyticsUrl and isMediaUrl classify the three kinds of request the service worker must route', () => {
  assert.equal(PWA.isAnalyticsUrl('https://www.googletagmanager.com/gtag/js?id=G-QLFWNZWDSS'), true);
  assert.equal(PWA.isAnalyticsUrl('https://www.google-analytics.com/g/collect?v=2'), true);
  assert.equal(PWA.isAnalyticsUrl('https://region1.google-analytics.com/g/collect'), true);
  assert.equal(PWA.isAnalyticsUrl('https://yck2024.github.io/oai-html/assets/analytics.js'), true);
  assert.equal(PWA.isAnalyticsUrl(`${BASE}index.html`), false);

  assert.equal(PWA.isMediaUrl(`${BASE}images/champion-rex.webp`), true);
  assert.equal(PWA.isMediaUrl(`${BASE}audio/en/fruit-apple.mp3`), true);
  assert.equal(PWA.isMediaUrl(`${BASE}index.html`), false);
});
