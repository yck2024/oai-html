'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const E = require('./ehon.js');
const TAIWAN_DIR = path.join(__dirname, '..', 'taiwan-ehon');
const stories = require(path.join(TAIWAN_DIR, 'stories.js'));
const SERIES = require(path.join(TAIWAN_DIR, 'series.config.js'));
const { FakeElement, READER_IDS, createLocationHistory } = require('./test-dom.js');

const ORIGIN = 'https://yck2024.github.io';

function createRoutingReader({ initialPath }) {
  const elements = new Map(READER_IDS.map(id => [`#${id}`, new FakeElement()]));
  // The real markup starts the reader and settings panel hidden (a `hidden` attribute in
  // index.html); FakeElement itself has no opinion, so match that starting state here.
  elements.get('#reader').hidden = true;
  elements.get('#settingsPanel').hidden = true;
  const modeInputs = ['ja-zh', 'zh-ja', 'ja', 'zh'].map(value => {
    const input = new FakeElement('input');
    input.value = value;
    return input;
  });
  const document = {
    title: '',
    querySelector: selector => elements.get(selector) || null,
    querySelectorAll: selector => (selector === 'input[name="listenMode"]' ? modeInputs : []),
    createElement: tagName => new FakeElement(tagName),
    createDocumentFragment: () => new FakeElement('#fragment'),
    addEventListener() {},
  };
  const stored = new Map();
  const localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
  class FakeAudio { play() { return Promise.resolve(); } pause() {} }
  const events = [];
  const nav = createLocationHistory(initialPath, ORIGIN);
  const context = {
    window: { Ehon: E, EhonStories: stories, EhonSeriesConfig: SERIES },
    document,
    localStorage,
    Audio: FakeAudio,
    setTimeout: () => 1,
    clearTimeout() {},
    location: nav.location,
    history: nav.history,
    addEventListener: nav.addEventListener,
    gtag: (...args) => events.push(args),
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'), context);

  return {
    events,
    currentPath: nav.currentPath,
    back: nav.back,
    forward: nav.forward,
    jump: nav.jump,
    documentTitle: () => document.title,
    pageImageSrc: () => elements.get('#pageImage').src,
    isShelfVisible: () => elements.get('#shelf').hidden === false,
    isReaderVisible: () => elements.get('#reader').hidden === false,
    openStory(index) {
      elements.get('#bookList').querySelectorAll('.book-card')[index].dispatch('click');
    },
    closeReader() {
      elements.get('#closeBook').dispatch('click');
    },
    turnPage(direction) {
      elements.get(direction === 'next' ? '#nextButton' : '#prevButton').dispatch('click');
    },
  };
}

// The vm sandbox is a separate realm, so its object literals aren't deepStrictEqual to ones
// built in this file even with identical own properties; round-trip through JSON to compare.
function recordedEvents(reader) {
  return JSON.parse(JSON.stringify(reader.events));
}

function pageViews(reader) {
  return recordedEvents(reader)
    .filter(([kind, name]) => kind === 'event' && name === 'page_view')
    .map(([, , params]) => params);
}

function bookOpens(reader) {
  return recordedEvents(reader).filter(([kind, name]) => kind === 'event' && name === 'book_open');
}

test('directly loading each book path opens that book at its cover, with no path change and no extra page view', () => {
  // The static <head> tag baked into each book's own index.html sends that page's one page
  // view on real page loads; app.js must not send a second one for the same load.
  for (const story of stories) {
    const initialPath = `/taiwan-ehon/${story.id}/`;
    const reader = createRoutingReader({ initialPath });
    assert.equal(reader.isReaderVisible(), true, `${story.id}: reader should be visible`);
    assert.equal(reader.isShelfVisible(), false, `${story.id}: shelf should be hidden`);
    assert.equal(reader.currentPath(), initialPath, `${story.id}: path must not change on direct load`);
    assert.equal(pageViews(reader).length, 0, `${story.id}: initial load must not send its own page view`);
    assert.deepEqual(bookOpens(reader), [['event', 'book_open', { book_id: story.id, series_id: 'taiwan' }]]);
  }
});

test('loading the shelf sends no page view either (the static <head> tag already sent it)', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  assert.equal(reader.isShelfVisible(), true);
  assert.equal(reader.isReaderVisible(), false);
  assert.equal(pageViews(reader).length, 0);
});

test('opening a book from the shelf pushes its own path and sends exactly one page view', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  reader.openStory(0);
  const story = stories[0];
  assert.equal(reader.currentPath(), `/taiwan-ehon/${story.id}/`);
  assert.equal(reader.isReaderVisible(), true);
  assert.equal(pageViews(reader).length, 1);
  assert.deepEqual(pageViews(reader)[0], {
    page_location: `${ORIGIN}/taiwan-ehon/${story.id}/`,
    page_title: reader.documentTitle(),
  });
});

test('closing back to the shelf restores its path, shows the shelf, and sends exactly one page view', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  reader.openStory(0);
  reader.closeReader();
  assert.equal(reader.currentPath(), '/taiwan-ehon/');
  assert.equal(reader.isShelfVisible(), true);
  assert.equal(reader.isReaderVisible(), false);
  assert.equal(pageViews(reader).length, 2);
  assert.deepEqual(pageViews(reader)[1], {
    page_location: `${ORIGIN}/taiwan-ehon/`,
    page_title: 'Taiwan story picture books',
  });
});

test('browser back and forward move between shelf and book, each producing exactly one page view', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  reader.openStory(1);
  const story = stories[1];
  assert.equal(pageViews(reader).length, 1);

  reader.back();
  assert.equal(reader.currentPath(), '/taiwan-ehon/');
  assert.equal(reader.isShelfVisible(), true);
  assert.equal(pageViews(reader).length, 2);

  reader.forward();
  assert.equal(reader.currentPath(), `/taiwan-ehon/${story.id}/`);
  assert.equal(reader.isReaderVisible(), true);
  assert.equal(pageViews(reader).length, 3);
  assert.deepEqual(pageViews(reader)[2], {
    page_location: `${ORIGIN}/taiwan-ehon/${story.id}/`,
    page_title: reader.documentTitle(),
  });
});

test('an unknown book id in the URL falls back to the shelf and fixes the address bar', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/not-a-real-book/' });
  assert.equal(reader.isShelfVisible(), true);
  assert.equal(reader.isReaderVisible(), false);
  assert.equal(reader.currentPath(), '/taiwan-ehon/');
  // Initial load: no page view is app.js's responsibility to send (see the two tests above).
  assert.equal(pageViews(reader).length, 0);
});

test('navigating to a stale/unknown book id while the app is running falls back to the shelf with one page view', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  reader.openStory(0);
  assert.equal(pageViews(reader).length, 1);
  reader.jump('/taiwan-ehon/some-removed-book/');
  assert.equal(reader.isShelfVisible(), true);
  assert.equal(reader.isReaderVisible(), false);
  assert.equal(reader.currentPath(), '/taiwan-ehon/');
  assert.equal(pageViews(reader).length, 2);
  assert.deepEqual(pageViews(reader)[1], {
    page_location: `${ORIGIN}/taiwan-ehon/`,
    page_title: 'Taiwan story picture books',
  });
});

test('the page image stays a real, resolvable path after pushState moves the URL a level deeper', () => {
  // Regression check: history.pushState() moves location.pathname, and browsers resolve any
  // *unprefixed relative* URL set afterward (e.g. img.src = 'images/x.webp') against that new,
  // deeper path — not the app's real folder — producing a 404 in a real browser. Root-relative
  // paths (leading '/') sidestep this because they resolve against the origin only.
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  reader.openStory(0);
  const story = stories[0];
  assert.equal(reader.currentPath(), `/taiwan-ehon/${story.id}/`);
  assert.equal(reader.pageImageSrc(), `/taiwan-ehon/${story.pages[0].image}`);
});

test('page turns never touch the path or send a page view', () => {
  const reader = createRoutingReader({ initialPath: '/taiwan-ehon/' });
  reader.openStory(0);
  const pathAfterOpen = reader.currentPath();
  const viewsAfterOpen = pageViews(reader).length;
  reader.turnPage('next');
  reader.turnPage('next');
  reader.turnPage('prev');
  assert.equal(reader.currentPath(), pathAfterOpen);
  assert.equal(pageViews(reader).length, viewsAfterOpen);
});
