'use strict';

// Guards the hard requirement behind the whole engine refactor: every URL that was public
// before taiwan-ehon moved onto the shared engine must still resolve to a real file afterwards,
// at the same path, with the same PWA identity. This list is intentionally hand-written (not
// derived from the current stories.js) so a future story rename or removal cannot silently
// shrink taiwan-ehon's public contract — see taiwan-ehon/README.md's URL-stability note.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');
const TAIWAN_DIR = path.join(ROOT, 'taiwan-ehon');

const TAIWAN_BOOK_IDS = [
  'bai-zei-qi', 'shooting-the-sun', 'shao-white-deer', 'xinpu-shi-ye',
  'dajia-mazu-pilgrimage', 'hu-gu-po', 'qing-mi-long-she', 'a-la-ba-nai',
];

test('the taiwan-ehon shelf page still exists at its original path', () => {
  assert.ok(fs.existsSync(path.join(TAIWAN_DIR, 'index.html')), 'taiwan-ehon/index.html must exist');
});

test('every one of the eight original taiwan-ehon book pages still exists at its original path', () => {
  for (const id of TAIWAN_BOOK_IDS) {
    const bookIndex = path.join(TAIWAN_DIR, id, 'index.html');
    assert.ok(fs.existsSync(bookIndex), `taiwan-ehon/${id}/index.html must exist`);
  }
});

test('every book id currently in stories.js is exactly the original eight (no silent addition or removal)', () => {
  const stories = require(path.join(TAIWAN_DIR, 'stories.js'));
  assert.deepEqual(stories.map(story => story.id), TAIWAN_BOOK_IDS);
});

test('the taiwan-ehon PWA keeps its original manifest id, start_url, and scope', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(TAIWAN_DIR, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.id, '/oai-html/taiwan-ehon/');
  assert.equal(manifest.start_url, '/oai-html/taiwan-ehon/');
  assert.equal(manifest.scope, '/oai-html/taiwan-ehon/');
});

test('taiwan-ehon is still registered in pages.json at the same slug', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
  const entry = manifest.pages.find(page => page.slug === 'taiwan-ehon');
  assert.ok(entry, 'pages.json must still list a "taiwan-ehon" entry');
  assert.equal(entry.status, 'live');
});
