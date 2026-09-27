'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ROOT = path.join(__dirname, '..', 'taiwan-ehon');
const stories = require(path.join(ROOT, 'stories.js'));
const SERIES = require(path.join(ROOT, 'series.config.js'));
const { generate, bookTitle } = require(path.join(ROOT, 'generate-book-pages.js'));

function bookFolders() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => fs.existsSync(path.join(ROOT, name, 'index.html')));
}

function parseHtml(html) {
  const parser = String.raw`import json, sys
from html.parser import HTMLParser

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.base_href = None
        self.title = None
        self.in_title = False
        self.scripts = []
        self.script = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'base' and self.base_href is None:
            self.base_href = attrs.get('href')
        elif tag == 'title':
            self.in_title = True
            self.title = ''
        elif tag == 'script':
            self.script = {'src': attrs.get('src'), 'content': ''}
            self.scripts.append(self.script)

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'script':
            self.script = None

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.script is not None:
            self.script['content'] += data

document = Document()
document.feed(sys.stdin.read())
print(json.dumps({'baseHref': document.base_href, 'title': document.title, 'scripts': document.scripts}))`;
  const result = spawnSync('python3', ['-c', parser], { input: html, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('every story has a generated book folder, and every book folder matches a real story', () => {
  const storyIds = new Set(stories.map(story => story.id));
  const folders = new Set(bookFolders());
  const missingFolders = [...storyIds].filter(id => !folders.has(id));
  const orphanFolders = [...folders].filter(id => !storyIds.has(id));
  assert.deepEqual(missingFolders, [], `stories with no book folder: ${missingFolders.join(', ') || 'none'}`);
  assert.deepEqual(orphanFolders, [], `book folders with no matching story: ${orphanFolders.join(', ') || 'none'}`);
});

test('each book page exposes its shared resources and book-specific title to browser consumers', () => {
  for (const story of stories) {
    const html = fs.readFileSync(path.join(ROOT, story.id, 'index.html'), 'utf8');
    const document = parseHtml(html);
    const title = bookTitle(story, SERIES);
    assert.equal(document.baseHref, '../', `${story.id}: resource base should resolve from the app folder`);
    assert.ok(document.scripts.some(script => script.src === './stories.js'), `${story.id}: shared stories script is unavailable`);
    assert.ok(document.scripts.some(script => script.src === './app.js'), `${story.id}: shared app script is unavailable`);
    assert.equal(document.title, title, `${story.id}: browser title should identify this book`);

    const analyticsScript = document.scripts.find(script => script.src === null);
    assert.ok(analyticsScript, `${story.id}: analytics configuration should execute`);
    const context = {
      window: { dataLayer: [] },
      dataLayer: [],
      document: { referrer: '' },
      location: { origin: 'https://example.test', pathname: `/taiwan-ehon/${story.id}/` },
      URL,
      Date,
    };
    context.dataLayer = context.window.dataLayer;
    vm.runInNewContext(analyticsScript.content, context);
    assert.deepEqual(JSON.parse(JSON.stringify(Array.from(context.dataLayer[1]))), [
      'config', 'G-QLFWNZWDSS', {
        content_group: 'oai-html',
        page_location: `https://example.test/taiwan-ehon/${story.id}/`,
        page_referrer: '',
        page_title: title,
      },
    ], `${story.id}: analytics should report the book-specific title and path`);
  }
});

test('generated book pages are up to date with stories.js and the shared index.html template', () => {
  const rendered = generate({ write: false }); // pure: never touches the checked-in files
  for (const [id, html] of rendered) {
    const onDisk = fs.readFileSync(path.join(ROOT, id, 'index.html'), 'utf8');
    assert.equal(onDisk, html, `${id}/index.html is stale — run: node taiwan-ehon/generate-book-pages.js`);
  }
});
