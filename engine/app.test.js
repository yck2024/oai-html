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

// A minimal MediaSession/MediaMetadata double: stores whatever app.js sets so tests can
// assert on metadata/playbackState, and records action handlers so tests can invoke them
// the way a lock-screen or notification control would.
function createMediaSession() {
  const actionHandlers = {};
  return {
    metadata: null,
    playbackState: 'none',
    setActionHandler(action, handler) { actionHandlers[action] = handler; },
    actionHandlers,
  };
}

function createReader({ analytics = true, series = SERIES, storyList = stories } = {}) {
  const elements = new Map(READER_IDS.map(id => [`#${id}`, new FakeElement()]));
  const modeInputs = Object.keys(E.buildListenModes(series.languages)).map(value => {
    const input = new FakeElement('input');
    input.value = value;
    return input;
  });
  const documentListeners = new Map();
  const document = {
    title: '',
    visibilityState: 'visible',
    querySelector: selector => elements.get(selector) || null,
    querySelectorAll: selector => selector === 'input[name="listenMode"]' ? modeInputs : [],
    createElement: tagName => new FakeElement(tagName),
    createTextNode: text => text,
    createDocumentFragment: () => new FakeElement('#fragment'),
    addEventListener(type, listener) {
      const listeners = documentListeners.get(type) || [];
      listeners.push(listener);
      documentListeners.set(type, listeners);
    },
    dispatchEvent(event) {
      for (const listener of documentListeners.get(event.type) || []) listener(event);
    },
  };
  const stored = new Map();
  const localStorage = {
    getItem: key => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  };
  class FakeAudio {
    constructor() {
      this.played = [];
      FakeAudio.instances.push(this);
    }
    play() {
      this.played.push(this.src);
      return Promise.resolve();
    }
    pause() {}
  }
  FakeAudio.instances = [];
  const events = [];
  const nav = createLocationHistory(`/${series.folder}/`);
  const mediaSession = createMediaSession();
  const fetched = [];
  const context = {
    window: { Ehon: E, EhonStories: storyList, EhonSeriesConfig: series },
    document,
    Event: class { constructor(type) { this.type = type; } },
    localStorage,
    Audio: FakeAudio,
    navigator: { mediaSession },
    MediaMetadata: class { constructor(options) { Object.assign(this, options); } },
    fetch: url => { fetched.push(url); return Promise.resolve(); },
    setTimeout: () => 1,
    clearTimeout() {},
    location: nav.location,
    history: nav.history,
    addEventListener: nav.addEventListener,
  };
  if (analytics) context.gtag = (...args) => events.push(args);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'), context);

  elements.get('#bookList').querySelector('.book-card').dispatch('click');
  elements.get('#nextButton').dispatch('click');
  return {
    audio: FakeAudio.instances[0],
    elements,
    modeInputs,
    events,
    document,
    mediaSession,
    fetched,
    openStory(index) { elements.get('#bookList').querySelectorAll('.book-card')[index].dispatch('click'); },
    selectMode(mode) {
      for (const input of modeInputs) input.checked = input.value === mode;
      modeInputs.find(input => input.value === mode).dispatch('change');
    },
    setHidden(hidden) { document.visibilityState = hidden ? 'hidden' : 'visible'; },
  };
}

// Excludes page_view: routing.test.js covers page-view behavior on its own, so these
// pre-existing assertions about book_open/book_complete/settings events stay focused.
function recordedEvents(reader) {
  return JSON.parse(JSON.stringify(reader.events)).filter(([, name]) => name !== 'page_view');
}

test('opening a shelf book sends only its fixed story id; turns and sentence taps do not track', () => {
  const reader = createReader();
  const { elements } = reader;
  assert.deepEqual(recordedEvents(reader), [['event', 'book_open', { book_id: stories[0].id, series_id: 'taiwan' }]]);
  const sentence = elements.get('#pageText').querySelector('.line');
  elements.get('#pageText').dispatch('click', { target: sentence });
  elements.get('#nextButton').dispatch('click');
  elements.get('#prevButton').dispatch('click');
  elements.get('#playButton').dispatch('click');
  assert.deepEqual(recordedEvents(reader), [['event', 'book_open', { book_id: stories[0].id, series_id: 'taiwan' }]]);
  elements.get('#closeBook').dispatch('click');
  reader.openStory(1);
  assert.deepEqual(recordedEvents(reader).at(-1), ['event', 'book_open', { book_id: stories[1].id, series_id: 'taiwan' }]);
});

test('reaching the ending sends one completion per opening, including revisiting the ending', () => {
  const reader = createReader();
  const { elements } = reader;
  const next = elements.get('#nextButton');
  const prev = elements.get('#prevButton');
  reader.events.length = 0;
  for (let i = 0; i < stories[0].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader), [['event', 'book_complete', { book_id: stories[0].id, series_id: 'taiwan' }]]);
  prev.dispatch('click');
  next.dispatch('click');
  next.dispatch('click');
  elements.get('#page').querySelector('.end-button.primary').dispatch('click');
  for (let i = 0; i < stories[0].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader), [['event', 'book_complete', { book_id: stories[0].id, series_id: 'taiwan' }]]);
  elements.get('#closeBook').dispatch('click');
  reader.openStory(1);
  for (let i = 0; i < stories[1].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader).slice(-2), [
    ['event', 'book_open', { book_id: stories[1].id, series_id: 'taiwan' }],
    ['event', 'book_complete', { book_id: stories[1].id, series_id: 'taiwan' }],
  ]);
  elements.get('#closeBook').dispatch('click');
  reader.openStory(0);
  for (let i = 0; i < stories[0].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader).at(-1), ['event', 'book_complete', { book_id: stories[0].id, series_id: 'taiwan' }]);
});

test('only real settings changes send fixed mode and on/off values', () => {
  const reader = createReader();
  const { elements, modeInputs } = reader;
  reader.events.length = 0;
  reader.selectMode('ja-zh'); // unchanged default
  const invalid = modeInputs[0];
  invalid.value = 'arbitrary-text';
  invalid.checked = true;
  invalid.dispatch('change');
  invalid.value = 'ja-zh';
  reader.selectMode('zh-ja');
  reader.selectMode('zh-ja');
  reader.selectMode('ja');
  const zhuyin = elements.get('#zhuyinToggle');
  zhuyin.checked = false;
  zhuyin.dispatch('change');
  zhuyin.dispatch('change');
  zhuyin.checked = true;
  zhuyin.dispatch('change');
  const autoTurn = elements.get('#autoTurnToggle');
  autoTurn.checked = true;
  autoTurn.dispatch('change');
  autoTurn.checked = false;
  autoTurn.dispatch('change');
  assert.deepEqual(recordedEvents(reader), [
    ['event', 'listen_mode_change', { listen_mode: 'zh-ja', series_id: 'taiwan' }],
    ['event', 'listen_mode_change', { listen_mode: 'ja', series_id: 'taiwan' }],
    ['event', 'zhuyin_toggle', { zhuyin: 'off', series_id: 'taiwan' }],
    ['event', 'zhuyin_toggle', { zhuyin: 'on', series_id: 'taiwan' }],
    ['event', 'auto_turn_toggle', { auto_turn: 'on', series_id: 'taiwan' }],
    ['event', 'auto_turn_toggle', { auto_turn: 'off', series_id: 'taiwan' }],
  ]);
});

test('storybook continues to work when gtag is unavailable', () => {
  const reader = createReader({ analytics: false });
  reader.selectMode('zh');
  for (let i = 0; i < stories[0].pages.length; i++) reader.elements.get('#nextButton').dispatch('click');
  assert.deepEqual(reader.events, []);
});

test('muted reader blocks page, replay, and sentence narration until toggled back on', () => {
  const reader = createReader();
  const { elements, audio } = reader;
  const mute = elements.get('#muteButton');

  mute.dispatch('click');
  assert.equal(mute.getAttribute('aria-pressed'), 'true');
  assert.equal(elements.get('#muteIcon').textContent, '🔇');
  elements.get('#playButton').dispatch('click');
  elements.get('#replayButton').dispatch('click');
  const sentence = elements.get('#pageText').children[0].children[0];
  elements.get('#pageText').dispatch('click', { target: sentence });
  reader.selectMode('zh-ja');
  assert.deepEqual(audio.played, []);
  assert.equal(mute.getAttribute('aria-pressed'), 'true');

  mute.dispatch('click');
  assert.equal(mute.getAttribute('aria-pressed'), 'false');
  assert.equal(elements.get('#muteIcon').textContent, '🔊');
  assert.deepEqual(audio.played, []);
  elements.get('#playButton').dispatch('click');
  assert.deepEqual(audio.played, ['/taiwan-ehon/audio/bai-zei-qi/zh/p01-1.mp3']);
});

test('changing mode requeues paused narration without playing until resumed', () => {
  const reader = createReader();
  const play = reader.elements.get('#playButton');
  play.dispatch('click');
  const firstClip = reader.audio.played[0];
  play.dispatch('click');
  const pausedLabel = play.getAttribute('aria-label');

  reader.selectMode('zh-ja');
  assert.equal(reader.audio.played.length, 1);
  assert.equal(play.getAttribute('aria-label'), pausedLabel);

  play.dispatch('click');
  assert.equal(reader.audio.played.length, 2);
  assert.equal(firstClip, '/taiwan-ehon/audio/bai-zei-qi/ja/p01-1.mp3');
  assert.equal(reader.audio.played[1], '/taiwan-ehon/audio/bai-zei-qi/zh/p01-1.mp3');
});

test('the reader element tracks the open book id for offline.js, clearing it back at the shelf', () => {
  const reader = createReader();
  const { elements } = reader;
  assert.equal(elements.get('#reader').dataset.book, stories[0].id);
  reader.openStory(1);
  assert.equal(elements.get('#reader').dataset.book, stories[1].id);
  elements.get('#closeBook').dispatch('click');
  assert.equal(elements.get('#reader').dataset.book, undefined);
});

test('a picture that fails to load shows a friendly offline notice, cleared once a picture loads again', () => {
  const reader = createReader();
  const { elements } = reader;
  const pageArt = elements.get('#pageArt');
  const pageImage = elements.get('#pageImage');
  assert.equal(pageArt.classList.contains('offline-missing'), false);

  pageImage.dispatch('error');
  assert.equal(pageArt.classList.contains('offline-missing'), true);

  elements.get('#nextButton').dispatch('click');
  assert.equal(pageArt.classList.contains('offline-missing'), false, 'turning the page resets the notice before the next picture loads');

  pageImage.dispatch('error');
  assert.equal(pageArt.classList.contains('offline-missing'), true);
  pageImage.dispatch('load');
  assert.equal(pageArt.classList.contains('offline-missing'), false);
});

test('while hidden, auto-turn narration chains across languages, sentences, and pages from the ended event alone, with no timer ever firing', () => {
  const reader = createReader();
  const { elements, audio } = reader;
  reader.selectMode('ja'); // one clip per line, so page-crossing arithmetic below is exact
  const autoTurn = elements.get('#autoTurnToggle');
  autoTurn.checked = true;
  autoTurn.dispatch('change');
  const pageCounter = elements.get('#pageCounter');

  elements.get('#playButton').dispatch('click'); // starts reading p01 (page 2 of the book)
  reader.setHidden(true);
  assert.equal(pageCounter.textContent, `2 / ${stories[0].pages.length}`);
  assert.equal(audio.played.length, 1);

  audio.onended(); // p01's first line ends -> its second line starts immediately (still p01)
  assert.equal(pageCounter.textContent, `2 / ${stories[0].pages.length}`);
  assert.equal(audio.played.length, 2);

  audio.onended(); // p01's last line ends -> auto-turns to p02 and starts reading it, with no gap
  assert.equal(pageCounter.textContent, `3 / ${stories[0].pages.length}`);
  assert.equal(audio.played.length, 3);

  audio.onended(); // p02 line 1 -> line 2
  audio.onended(); // p02 line 2 -> line 3
  assert.equal(pageCounter.textContent, `3 / ${stories[0].pages.length}`);
  assert.equal(audio.played.length, 5);

  audio.onended(); // p02's last line ends -> auto-turns to p03 and starts reading it
  assert.equal(pageCounter.textContent, `4 / ${stories[0].pages.length}`);
  assert.equal(audio.played.length, 6);
});

test('reaching the end while hidden stops playback cleanly: no further page turn, clip, or lock-screen playing state', () => {
  const reader = createReader();
  const { elements, audio, mediaSession } = reader;
  reader.selectMode('ja');
  const autoTurn = elements.get('#autoTurnToggle');
  autoTurn.checked = true;
  autoTurn.dispatch('change');
  const next = elements.get('#nextButton');
  for (let i = 0; i < stories[0].pages.length - 2; i++) next.dispatch('click');
  assert.equal(elements.get('#pageCounter').textContent, `${stories[0].pages.length} / ${stories[0].pages.length}`);

  reader.setHidden(true);
  elements.get('#playButton').dispatch('click'); // starts reading the ending page's first line
  const playedAtStart = audio.played.length;

  audio.onended(); // ending page's first line -> its last line, still hidden, no timer
  audio.onended(); // ending page's last line -> nothing left to auto-turn to: stop cleanly

  assert.equal(audio.played.length, playedAtStart + 1);
  assert.equal(elements.get('#playIcon').textContent, '▶');
  assert.equal(mediaSession.playbackState, 'none');
});

test('Media Session exposes the book\'s title and cover art, and its controls mirror the reader', () => {
  const reader = createReader();
  const { elements, mediaSession } = reader;
  const story = stories[0];

  assert.equal(mediaSession.metadata.title, `${story.title.zh}｜${E.plainJapanese(story.title.ja)}`);
  // The sandboxed app.js builds this array in its own vm realm, so compare it by value
  // (as recordedEvents() does above) rather than by reference-sensitive deepEqual.
  assert.deepEqual(JSON.parse(JSON.stringify(mediaSession.metadata.artwork)), [
    { src: `/taiwan-ehon/${story.pages[0].image}`, sizes: '768x512', type: 'image/webp' },
  ]);
  assert.equal(mediaSession.playbackState, 'none');

  elements.get('#playButton').dispatch('click');
  assert.equal(mediaSession.playbackState, 'playing');
  mediaSession.actionHandlers.pause();
  assert.equal(mediaSession.playbackState, 'paused');
  assert.equal(elements.get('#playIcon').textContent, '▶');
  mediaSession.actionHandlers.play();
  assert.equal(mediaSession.playbackState, 'playing');

  const counterBefore = elements.get('#pageCounter').textContent;
  mediaSession.actionHandlers.nexttrack();
  assert.notEqual(elements.get('#pageCounter').textContent, counterBefore);
  mediaSession.actionHandlers.previoustrack();
  assert.equal(elements.get('#pageCounter').textContent, counterBefore);

  elements.get('#closeBook').dispatch('click');
  assert.equal(mediaSession.metadata, null);
  assert.equal(mediaSession.playbackState, 'none');
});

test('Taiwan shelf and reader retain their original bilingual DOM structure', () => {
  const reader = createReader();
  const card = reader.elements.get('#bookList').querySelector('.book-card');
  const info = card.querySelector('.book-info');
  const [origin, titleJa, titleZh, tagline] = info.children;

  assert.deepEqual([origin.className, titleJa.className, titleZh.className, tagline.className], [
    'book-origin', 'book-title-ja', 'book-title-zh', 'book-tagline',
  ]);
  assert.equal(origin.children.some(node => node instanceof FakeElement && node.lang === 'ja'), false);
  assert.equal(tagline.children.some(node => node instanceof FakeElement && node.lang === 'ja'), false);
  assert.equal(info.querySelector('.book-title'), null);
  assert.equal(reader.elements.get('#readerTitle').children[0], E.plainJapanese(stories[0].title.ja));
  assert.equal(reader.elements.get('#readerTitle').children[1].className, 'zh');
});

test('Taiwan cover and end notes retain their original unwrapped bilingual DOM structure', () => {
  const reader = createReader();
  const { elements } = reader;
  elements.get('#prevButton').dispatch('click');
  const coverNotes = elements.get('#page').querySelector('.page-note').children;
  assert.deepEqual(coverNotes.map(node => node.lang), ['ja', 'zh-Hant-TW']);
  assert.equal(coverNotes[1].textContent, '台灣民間故事 · 一個很會說謊的人的故事');
  assert.equal(coverNotes.some(node => node.children.some(child => child instanceof FakeElement && child.tagName === 'SPAN')), false);

  elements.get('#nextButton').dispatch('click');
  for (let i = 0; i < stories[0].pages.length - 2; i++) elements.get('#nextButton').dispatch('click');
  const endNotes = elements.get('#page').querySelector('.page-note').children;
  assert.deepEqual(endNotes.map(node => node.lang), ['ja', 'zh-Hant-TW']);
  assert.equal(endNotes.some(node => node.children.some(child => child instanceof FakeElement && child.tagName === 'SPAN')), false);
});

test('Japan story metadata follows selected languages across shelf, reader, notes, alt text, and media controls', () => {
  const japan = {
    ...SERIES,
    folder: 'japan-ehon',
    id: 'japan',
    shelfMarker: '/japan-ehon/',
    languages: ['ja', 'zh', 'en'],
    defaultMode: 'ja-zh',
    narratedOnlyToggle: true,
    siteNameSuffix: ' · Japan Ehon',
  };
  const story = {
    id: 'metadata-book',
    title: { ja: '{桃|もも}', zh: '桃子', zhuyin: 'ㄊㄠˊ ㄗ', en: 'Peach Boy' },
    origin: { ja: '昔話', zh: '民間故事', en: 'Folktale' },
    tagline: { ja: '冒険', zh: '冒險', en: 'An adventure' },
    credit: { ja: '出典', zh: '來源', en: 'Source' },
    theme: { accent: '#273968', soft: '#d7dcee' },
    pages: [
      { id: 'cover', image: 'cover.webp', alt: { ja: '表紙', zh: '封面', en: 'Cover' }, lines: [] },
      { id: 'p01', image: 'page.webp', alt: { ja: '桃', zh: '桃子', en: 'Peach' }, lines: [] },
      { id: 'end', image: 'end.webp', alt: { ja: '終わり', zh: '結束', en: 'The end' }, lines: [] },
    ],
  };
  const reader = createReader({ series: japan, storyList: [story] });
  reader.selectMode('en-zh');
  const { elements, document, mediaSession } = reader;
  const card = elements.get('#bookList').querySelector('.book-card');
  const titleLangs = card.querySelectorAll('.book-title-ja, .book-title-zh, .book-title-en');
  assert.deepEqual(titleLangs.map(node => [node.className, node.lang]), [['book-title-zh', 'zh-Hant-TW'], ['book-title-en', 'en']]);
  assert.deepEqual(elements.get('#readerTitle').children.map(node => node.lang), ['zh-Hant-TW', 'en']);
  assert.equal(document.title, 'Peach Boy｜桃子 · Japan Ehon');
  assert.equal(mediaSession.metadata.title, 'Peach Boy｜桃子');
  assert.equal(elements.get('#pageImage').alt, '桃子 ／ Peach');

  elements.get('#prevButton').dispatch('click');
  const coverNotes = elements.get('#page').querySelector('.page-note').children;
  assert.deepEqual(coverNotes.map(node => node.lang), ['zh-Hant-TW', 'en']);
  assert.equal(coverNotes.map(node => node.children.map(child => typeof child === 'string' ? child : child.children.join('')).join('')).join('|'), '民間故事 ・ 冒險|Folktale ・ An adventure');

  elements.get('#nextButton').dispatch('click');
  elements.get('#nextButton').dispatch('click');
  const endNotes = elements.get('#page').querySelector('.page-note').children;
  assert.deepEqual(endNotes.map(node => node.lang), ['zh-Hant-TW', 'en']);
});

test('optional English metadata falls back to available languages in every visible reader label', () => {
  const japan = {
    ...SERIES,
    folder: 'japan-ehon',
    id: 'japan',
    shelfMarker: '/japan-ehon/',
    languages: ['ja', 'zh', 'en'],
    defaultMode: 'ja-zh',
    narratedOnlyToggle: true,
    siteNameSuffix: ' · Japan Ehon',
  };
  const story = {
    id: 'metadata-book',
    title: { ja: '桃太郎', zh: '桃太郎', zhuyin: 'ㄊㄠˊ ㄊㄞˋ ㄌㄤˊ' },
    origin: { ja: '昔話', zh: '民間故事' },
    tagline: { ja: '冒険', zh: '冒險' },
    credit: { ja: '出典', zh: '來源' },
    theme: { accent: '#273968', soft: '#d7dcee' },
    pages: [{ id: 'cover', image: 'cover.webp', alt: { ja: '表紙', zh: '封面' }, lines: [] }],
  };
  const reader = createReader({ series: japan, storyList: [story] });
  reader.selectMode('en');
  const { elements, document, mediaSession } = reader;
  const card = elements.get('#bookList').querySelector('.book-card');
  assert.deepEqual(card.querySelectorAll('.book-title-ja, .book-title-zh, .book-title-en').map(node => [node.className, node.lang]), [['book-title-ja', 'ja'], ['book-title-zh', 'zh-Hant-TW']]);
  assert.deepEqual(elements.get('#readerTitle').children.map(node => node.lang), ['ja', 'zh-Hant-TW']);
  assert.equal(document.title, '桃太郎｜桃太郎 · Japan Ehon');
  assert.equal(mediaSession.metadata.title, '桃太郎｜桃太郎');
  assert.equal(elements.get('#pageImage').alt, '表紙 ／ 封面');
});

test('starting to read a page warms the cache for its remaining clips and the next page\'s first line', () => {
  const reader = createReader();
  const { elements, fetched } = reader;
  reader.selectMode('ja');
  elements.get('#playButton').dispatch('click');

  const story = stories[0];
  const page = story.pages[1]; // p01, the page reading starts on
  const nextLine = story.pages[2].lines[0];
  for (const line of page.lines) {
    assert.ok(fetched.includes(`/taiwan-ehon/audio/${story.id}/ja/${line.id}.mp3`));
  }
  assert.ok(fetched.includes(`/taiwan-ehon/audio/${story.id}/ja/${nextLine.id}.mp3`));
});
