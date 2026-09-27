'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const PWA = require('./pwa.js');
const MANIFEST = require('./precache-manifest.js');
const { buildManifest, GAMES } = require('./generate-precache-manifest.js');

const ROOT = __dirname;
const BASE = 'https://example.test/oai-html/math-island/';

function parseHeadElements(html) {
  const parser = `import json, sys\nfrom html.parser import HTMLParser\nclass HeadElements(HTMLParser):\n def __init__(self):\n  super().__init__(); self.elements = []\n def handle_starttag(self, tag, attrs):\n  if tag in ('link', 'meta', 'script'): self.elements.append({'tag': tag, **dict(attrs)})\np = HeadElements(); p.feed(sys.stdin.read()); print(json.dumps(p.elements))`;
  return JSON.parse(execFileSync('python3', ['-c', parser], { input: html, encoding: 'utf8' }));
}

test('manifest.webmanifest is valid, bilingual, and scoped under the app path', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(raw); // throws on malformed JSON
  assert.ok(manifest.name.includes('Math Island') && manifest.name.includes('かずのゲーム'), 'name is bilingual and matches the page title');
  assert.ok(manifest.short_name.length <= 12, 'short_name stays short enough for a home-screen label');
  assert.equal(manifest.id, '/oai-html/math-island/');
  assert.equal(manifest.start_url, '/oai-html/math-island/');
  assert.equal(manifest.scope, '/oai-html/math-island/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#73cde0');
  assert.equal(manifest.background_color, '#73cde0');

  const sizes = manifest.icons.map(icon => icon.sizes);
  assert.ok(sizes.includes('192x192'), 'has a 192x192 icon');
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose !== 'maskable'), 'has a plain 512x512 icon');
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'), 'has a maskable 512x512 icon');
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(ROOT, icon.src)), `icon file exists: ${icon.src}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, 'icons/apple-touch-icon.png')), 'apple-touch-icon exists');
});

test('the hub and every game page expose parsed PWA document metadata', () => {
  const pages = [
    ['hub', 'index.html', './'],
    ['poko', 'poko/index.html', '../'],
    ['number-garden', 'number-garden/index.html', '../'],
    ['dino-spirit', 'dino-spirit/index.html', '../'],
  ];
  for (const [id, file, rel] of pages) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const elements = parseHeadElements(html);
    assert.ok(elements.some(item => item.tag === 'link' && item.rel?.trim().split(/\s+/).includes('manifest') && item.href === `${rel}manifest.webmanifest`), `${id}: links the web manifest`);
    assert.ok(elements.some(item => item.tag === 'link' && item.rel?.trim().split(/\s+/).includes('apple-touch-icon') && item.href === `${rel}icons/apple-touch-icon.png`), `${id}: links an apple-touch-icon`);
    assert.ok(elements.some(item => item.tag === 'meta' && item.name === 'apple-mobile-web-app-capable' && item.content === 'yes'), `${id}: sets the iOS home-screen meta tag`);
    assert.ok(html.includes(`src="${rel}offline.js"`), `${id}: loads the script that registers the service worker`);
  }
});

test('the precache manifest is generated from each game\'s images/ and audio/ folders on disk, never hand-maintained', () => {
  const fresh = buildManifest();
  assert.deepEqual(MANIFEST.IMAGES, fresh.IMAGES, 'precache-manifest.js images match a fresh scan — run node generate-precache-manifest.js if this fails');
  assert.deepEqual(MANIFEST.AUDIO, fresh.AUDIO, 'precache-manifest.js audio matches a fresh scan — run node generate-precache-manifest.js if this fails');
});

test('the shell precache list covers every static app file across all three games', () => {
  const shellUrls = PWA.shellAssetUrls(BASE);
  for (const file of PWA.SHELL_FILES) {
    assert.ok(shellUrls.includes(`${BASE}${file}`), `shell precache includes ${file || '(app root)'}`);
    if (file) assert.ok(fs.existsSync(path.join(ROOT, file)), `${file} exists on disk`);
  }
  assert.equal(shellUrls.length, PWA.SHELL_FILES.length);
});

test('the media precache list is complete against every image and audio file on disk, for every game', () => {
  const urls = PWA.mediaAssetUrls(MANIFEST, BASE);
  assert.equal(urls.length, MANIFEST.IMAGES.length + MANIFEST.AUDIO.length);
  for (const name of [...MANIFEST.IMAGES, ...MANIFEST.AUDIO]) {
    assert.ok(urls.includes(`${BASE}${name}`), `media precache includes ${name}`);
    assert.ok(fs.existsSync(path.join(ROOT, name)), `${name} exists on disk`);
  }
  for (const game of GAMES) {
    const imagesDir = path.join(ROOT, game, 'images');
    const onDisk = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir).filter(name => name.endsWith('.webp')) : [];
    const listed = MANIFEST.IMAGES.filter(name => name.startsWith(`${game}/images/`));
    assert.equal(listed.length, onDisk.length, `${game}: every image on disk is listed`);
  }
});

test('isAnalyticsUrl and isMediaUrl classify the three kinds of request the service worker must route', () => {
  assert.equal(PWA.isAnalyticsUrl('https://www.googletagmanager.com/gtag/js?id=G-QLFWNZWDSS'), true);
  assert.equal(PWA.isAnalyticsUrl('https://www.google-analytics.com/g/collect?v=2'), true);
  assert.equal(PWA.isAnalyticsUrl('https://region1.google-analytics.com/g/collect'), true);
  assert.equal(PWA.isAnalyticsUrl('https://yck2024.github.io/oai-html/assets/analytics.js'), true);
  assert.equal(PWA.isAnalyticsUrl(`${BASE}index.html`), false);

  assert.equal(PWA.isMediaUrl(`${BASE}dino-spirit/images/rag.webp`), true);
  assert.equal(PWA.isMediaUrl(`${BASE}poko/audio/poko-count.mp3`), true);
  assert.equal(PWA.isMediaUrl(`${BASE}index.html`), false);
});
