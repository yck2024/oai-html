'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const stories = require('./stories.js');
const { generate, bookTitle } = require('./generate-book-pages.js');

const ROOT = __dirname;

function bookFolders() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => fs.existsSync(path.join(ROOT, name, 'index.html')));
}

test('every story has a generated book folder, and every book folder matches a real story', () => {
  const storyIds = new Set(stories.map(story => story.id));
  const folders = new Set(bookFolders());
  const missingFolders = [...storyIds].filter(id => !folders.has(id));
  const orphanFolders = [...folders].filter(id => !storyIds.has(id));
  assert.deepEqual(missingFolders, [], `stories with no book folder: ${missingFolders.join(', ') || 'none'}`);
  assert.deepEqual(orphanFolders, [], `book folders with no matching story: ${orphanFolders.join(', ') || 'none'}`);
});

test('each book folder loads the shared app through a base path, with the right analytics title baked in', () => {
  for (const story of stories) {
    const html = fs.readFileSync(path.join(ROOT, story.id, 'index.html'), 'utf8');
    assert.match(html, /<base href="\.\.\/">/, `${story.id}: missing <base href="../">`);
    assert.match(html, /<script src="\.\/stories\.js"><\/script>/, `${story.id}: missing shared stories.js`);
    assert.match(html, /<script src="\.\/app\.js"><\/script>/, `${story.id}: missing shared app.js`);
    const title = bookTitle(story);
    assert.ok(html.includes(`page_title: '${title.replace(/'/g, "\\'")}'`), `${story.id}: wrong/missing GA page_title`);
    assert.ok(html.includes(`<title>${title}</title>`), `${story.id}: wrong/missing <title>`);
  }
});

test('generated book pages are up to date with stories.js and the shared index.html template', () => {
  const rendered = generate({ write: false }); // pure: never touches the checked-in files
  for (const [id, html] of rendered) {
    const onDisk = fs.readFileSync(path.join(ROOT, id, 'index.html'), 'utf8');
    assert.equal(onDisk, html, `${id}/index.html is stale — run: node taiwan-ehon/generate-book-pages.js`);
  }
});
