'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const E = require('./ehon.js');
const C = require('./continuous.js');
const TAIWAN_DIR = path.join(__dirname, '..', 'taiwan-ehon');
const stories = require(path.join(TAIWAN_DIR, 'stories.js'));
const SERIES = require(path.join(TAIWAN_DIR, 'series.config.js'));
const TIMING = require(path.join(TAIWAN_DIR, 'audio-timing.js'));
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

function createReader({ analytics = true, series = SERIES, storyList = stories, fetchGate = null, failFetches = 0 } = {}) {
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
      this.currentTime = 0;
      this.rejectNextPlay = false;
      this.nextPlayResult = null;
      FakeAudio.instances.push(this);
    }
    play() {
      this.played.push(this.src);
      if (this.nextPlayResult) {
        const result = this.nextPlayResult;
        this.nextPlayResult = null;
        return result;
      }
      if (this.rejectNextPlay) {
        this.rejectNextPlay = false;
        return Promise.reject(new Error('autoplay rejected'));
      }
      return Promise.resolve();
    }
    pause() {}
  }
  FakeAudio.instances = [];
  const events = [];
  const nav = createLocationHistory(`/${series.folder}/`);
  const mediaSession = createMediaSession();
  const fetched = [];
  let remainingFetchFailures = failFetches;
  // Every fetched "clip" is a distinct, tiny ArrayBuffer (its byte length encodes which URL it
  // was, so a test can tell segments apart after Blob assembly without a real MP3 on disk).
  const context = {
    window: { Ehon: E, EhonContinuous: C, EhonAudioTiming: TIMING, EhonStories: storyList, EhonSeriesConfig: series },
    document,
    Event: class { constructor(type) { this.type = type; } },
    localStorage,
    Audio: FakeAudio,
    navigator: { mediaSession },
    MediaMetadata: class { constructor(options) { Object.assign(this, options); } },
    fetch: url => {
      fetched.push(url);
      // fetchGate is normally one shared Promise every fetch call waits on (see startBlockedBuild
      // below); a test that needs to resolve individual fetches one at a time instead passes a
      // function returning a fresh per-URL Promise.
      const gate = typeof fetchGate === 'function' ? fetchGate(url) : (fetchGate || Promise.resolve());
      return gate.then(() => {
        const ok = remainingFetchFailures === 0;
        if (!ok) remainingFetchFailures--;
        return { ok, status: ok ? 200 : 404, arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) };
      });
    },
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
    releaseFetch() { fetchGate?.resolve(); },
    setContinuous(on) {
      const toggle = elements.get('#continuousToggle');
      toggle.checked = on;
      toggle.dispatch('change');
    },
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

// Screen-off ("continuous") listening — engine/continuous.js's own pure logic (timeline math,
// ID3/VBR-header stripping, Blob assembly order, a real-ffprobe playability check) is covered by
// continuous.test.js; these tests instead cover how app.js *wires* that module into the reader:
// the setting itself, building/playing the whole-book Blob, page tracking from `timeupdate`, and
// next/previous turning into a seek instead of a rebuild.

const MODES = E.buildListenModes(SERIES.languages);

function flush() {
  return new Promise(resolve => setImmediate(resolve));
}

test('continuous_toggle sends fixed on/off values, and toggling the setting alone does not start playback', () => {
  const reader = createReader();
  reader.events.length = 0;
  reader.setContinuous(true);
  reader.setContinuous(true); // repeat: no real change, must not track again
  reader.setContinuous(false);
  assert.deepEqual(recordedEvents(reader), [
    ['event', 'continuous_toggle', { continuous: 'on', series_id: 'taiwan' }],
    ['event', 'continuous_toggle', { continuous: 'off', series_id: 'taiwan' }],
  ]);
  assert.equal(reader.audio.played.length, 0, 'the toggle by itself never presses play');
});

test('continuous mode: cancelling a pending build for sentence playback, mode change, or mute prevents it from taking over audio', async () => {
  async function startBlockedBuild() {
    let resolve;
    const fetchGate = new Promise(done => { resolve = done; });
    const reader = createReader({ fetchGate: Object.assign(fetchGate, { resolve }) });
    reader.setContinuous(true);
    reader.elements.get('#playButton').dispatch('click');
    return reader;
  }

  const sentenceReader = await startBlockedBuild();
  const sentence = sentenceReader.elements.get('#pageText').querySelector('.line');
  sentenceReader.elements.get('#pageText').dispatch('click', { target: sentence });
  sentenceReader.releaseFetch();
  await flush();
  assert.ok(sentenceReader.audio.played.some(url => url.includes('/audio/')));
  assert.ok(sentenceReader.audio.played.every(url => !url.startsWith('blob:')));

  const modeReader = await startBlockedBuild();
  modeReader.setContinuous(false);
  modeReader.releaseFetch();
  await flush();
  assert.ok(modeReader.audio.played.every(url => !url.startsWith('blob:')));

  const mutedReader = await startBlockedBuild();
  mutedReader.elements.get('#muteButton').dispatch('click');
  mutedReader.releaseFetch();
  await flush();
  assert.equal(mutedReader.audio.played.length, 0);
});

test('continuous mode: failed assembly leaves Play able to retry the build', async () => {
  const reader = createReader({ failFetches: 1 });
  const { elements, fetched, audio } = reader;
  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();

  const failedFetchCount = fetched.length;
  assert.equal(audio.played.length, 0);
  assert.notEqual(elements.get('#speechStatus').textContent, '');

  elements.get('#playButton').dispatch('click');
  await flush();

  assert.ok(fetched.length > failedFetchCount);
  assert.equal(audio.played.length, 1);
  assert.match(audio.played[0], /^blob:/);
});

test('continuous mode: rejected initial playback stays paused and retries the built Blob without refetching', async () => {
  const reader = createReader();
  const { elements, fetched, audio, mediaSession } = reader;
  reader.setContinuous(true);
  audio.rejectNextPlay = true;
  elements.get('#playButton').dispatch('click');
  await flush();

  assert.equal(mediaSession.playbackState, 'paused');
  assert.equal(elements.get('#playIcon').textContent, '▶');
  assert.equal(elements.get('#speechStatus').textContent, '▶ を おして はじめてね ・ 按 ▶ 開始播放');
  const fetchCount = fetched.length;
  const builtBlob = audio.played[0];
  assert.match(builtBlob, /^blob:/);

  elements.get('#playButton').dispatch('click');
  await flush();

  assert.equal(audio.played.length, 2);
  assert.equal(audio.played[1], builtBlob, 'retry resumes the already-loaded Blob');
  assert.equal(fetched.length, fetchCount, 'retry does not rebuild or refetch');
  assert.equal(mediaSession.playbackState, 'playing');
  assert.equal(elements.get('#speechStatus').textContent, '');
});

test('continuous mode: a delayed play rejection cannot reclaim state after sentence playback takes over', async () => {
  const reader = createReader();
  const { elements, audio, mediaSession } = reader;
  let rejectPlayback;
  audio.nextPlayResult = new Promise((_resolve, reject) => { rejectPlayback = reject; });
  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();

  const sentence = elements.get('#pageText').querySelector('.line');
  elements.get('#pageText').dispatch('click', { target: sentence });
  assert.equal(mediaSession.playbackState, 'playing');
  rejectPlayback(new Error('playback rejected after handoff'));
  await flush();

  assert.equal(mediaSession.playbackState, 'playing');
  assert.equal(elements.get('#playIcon').textContent, '⏸');
  elements.get('#playButton').dispatch('click');
  assert.equal(mediaSession.playbackState, 'paused');
  assert.equal(elements.get('#playIcon').textContent, '▶');
});

test('continuous mode: pressing play builds one Blob for the whole book and starts playing it from the current page', async () => {
  const reader = createReader();
  const { elements, fetched } = reader;
  const story = stories[0];
  const timeline = C.buildContinuousTimeline(E, story, MODES, SERIES.defaultMode, 'ja-zh', TIMING);

  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();

  assert.equal(reader.audio.played.length, 1);
  assert.match(reader.audio.played[0], /^blob:/, 'plays the assembled Blob through an object URL, not a per-clip path');
  const clipCount = timeline.segments.filter(segment => segment.kind === 'clip').length;
  assert.equal(fetched.filter(url => url.includes('/audio/')).length, clipCount);
  assert.ok(fetched.some(url => url.endsWith('/silence/page.mp3')));
  assert.equal(reader.mediaSession.playbackState, 'playing');
  assert.equal(elements.get('#playIcon').textContent, '⏸');
  // Book opens on its cover then auto-advances once in test setup (see createReader), landing
  // on page index 1; continuous playback should pick up from there, not rewind to page 0.
  assert.equal(reader.audio.currentTime, timeline.pages[1].startMs / 1000);
});

test('continuous mode: next/previous page seeks the shared Blob instead of rebuilding or refetching anything', async () => {
  const reader = createReader();
  const { elements, fetched } = reader;
  const story = stories[0];
  const timeline = C.buildContinuousTimeline(E, story, MODES, SERIES.defaultMode, 'ja-zh', TIMING);

  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();
  const fetchCountAfterFirstBuild = fetched.length;

  elements.get('#nextButton').dispatch('click');
  await flush();
  assert.equal(fetched.length, fetchCountAfterFirstBuild, 'turning the page while continuous is live must not fetch anything new');
  assert.equal(elements.get('#pageCounter').textContent, `3 / ${story.pages.length}`);
  assert.equal(reader.audio.currentTime, timeline.pages[2].startMs / 1000);
  assert.equal(reader.mediaSession.playbackState, 'playing', 'seeking must not interrupt playback');

  elements.get('#prevButton').dispatch('click');
  assert.equal(elements.get('#pageCounter').textContent, `2 / ${story.pages.length}`);
  assert.equal(reader.audio.currentTime, timeline.pages[1].startMs / 1000);

  // Media Session's hardware previous/next controls turn the page the same way.
  reader.mediaSession.actionHandlers.nexttrack();
  assert.equal(elements.get('#pageCounter').textContent, `3 / ${story.pages.length}`);
  reader.mediaSession.actionHandlers.previoustrack();
  assert.equal(elements.get('#pageCounter').textContent, `2 / ${story.pages.length}`);
  assert.equal(fetched.length, fetchCountAfterFirstBuild, 'still no new fetches after four more turns');
});

test('continuous mode: the visible page follows `timeupdate` only while visible, then catches up immediately on becoming visible again', async () => {
  const reader = createReader();
  const { elements, document } = reader;
  const story = stories[0];
  const timeline = C.buildContinuousTimeline(E, story, MODES, SERIES.defaultMode, 'ja-zh', TIMING);
  const lastPageIndex = story.pages.length - 1;

  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();

  reader.audio.currentTime = timeline.pages[lastPageIndex].startMs / 1000;
  reader.audio.ontimeupdate();
  assert.equal(elements.get('#pageCounter').textContent, `${story.pages.length} / ${story.pages.length}`);

  // Now simulate the screen turning off (hidden) and the reader turning several pages "blind":
  // no DOM work should happen while hidden, matching how a suspended/backgrounded tab behaves.
  reader.setHidden(true);
  reader.audio.currentTime = timeline.pages[1].startMs / 1000;
  reader.audio.ontimeupdate();
  assert.equal(elements.get('#pageCounter').textContent, `${story.pages.length} / ${story.pages.length}`, 'no UI work while hidden');

  // Turning the screen back on must catch the displayed page up immediately, without waiting
  // for another `timeupdate` tick.
  reader.setHidden(false);
  document.dispatchEvent({ type: 'visibilitychange' });
  assert.equal(elements.get('#pageCounter').textContent, `2 / ${story.pages.length}`);
});

test('continuous mode: changing the listening mode mid-playback rebuilds the Blob at the same page, still playing', async () => {
  const reader = createReader();
  const { elements } = reader;

  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();
  const firstBlobUrl = reader.audio.played[0];
  const pageBefore = elements.get('#pageCounter').textContent;

  reader.selectMode('zh-ja');
  await flush();

  assert.equal(reader.audio.played.length, 2);
  assert.notEqual(reader.audio.played[1], firstBlobUrl, 'a fresh Blob is built for the new mode');
  assert.equal(elements.get('#pageCounter').textContent, pageBefore, 'stays on the same page across the rebuild');
  assert.equal(reader.mediaSession.playbackState, 'playing');
});

test('continuous mode: muting pauses playback in place without losing position; the default sentence-by-sentence mode is unaffected by any of this', async () => {
  const reader = createReader();
  const { elements } = reader;

  reader.setContinuous(true);
  elements.get('#playButton').dispatch('click');
  await flush();
  reader.audio.currentTime = 12.34;

  elements.get('#muteButton').dispatch('click');
  assert.equal(reader.audio.currentTime, 12.34, 'muting must not rewind continuous playback');
  assert.equal(elements.get('#playIcon').textContent, '▶');

  // Sentence-by-sentence playback (settings.continuous off, the default) is a completely
  // separate code path and must still behave exactly as before this feature existed.
  const plainReader = createReader();
  plainReader.elements.get('#playButton').dispatch('click');
  assert.equal(plainReader.audio.played[0], '/taiwan-ehon/audio/bai-zei-qi/ja/p01-1.mp3');
});

test('continuous mode: the play button spins with a "preparing" label while loading, #speechStatus reports live progress, and a second tap does not start a second build', async () => {
  const pending = new Map(); // url -> resolve, one entry per fetch currently in flight
  const fetchGate = url => new Promise(resolve => pending.set(url, resolve));
  const reader = createReader({ fetchGate });
  const { elements, fetched } = reader;
  const playButton = elements.get('#playButton');

  reader.setContinuous(true);
  playButton.dispatch('click');
  await flush();

  assert.ok(playButton.classList.contains('is-loading'), 'the button itself shows the spinner while preparing');
  assert.equal(elements.get('#playIcon').textContent, '', 'must not look like a plain ▶ while loading');
  assert.equal(playButton.getAttribute('aria-label'), 'じゅんびちゅう 準備中');
  assert.equal(elements.get('#speechStatus').textContent, 'よみつづける おとを つくっています… ・ 連續播放準備中…');
  assert.ok(pending.size > 0 && pending.size < fetched.length + 1, 'only a bounded number of clips are in flight at once');

  const fetchCountWhileLoading = fetched.length;
  playButton.dispatch('click'); // tapping play again mid-build keeps preparing, never restarts it
  await flush();
  assert.equal(fetched.length, fetchCountWhileLoading, 'a second tap while loading must not start a second build');
  assert.ok(playButton.classList.contains('is-loading'), 'still preparing after the second tap');

  const progressTexts = [];
  function respondOk() {
    return { ok: true, status: 200, arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) };
  }
  while (pending.size > 0) {
    const [url, resolve] = pending.entries().next().value;
    pending.delete(url);
    resolve(respondOk());
    await flush();
    progressTexts.push(elements.get('#speechStatus').textContent);
  }

  assert.ok(
    progressTexts.some(text => /^おとを じゅんびちゅう \d+\/\d+ ・ 音檔準備中 \d+\/\d+$/.test(text)),
    `expected at least one live progress update among ${JSON.stringify(progressTexts)}`,
  );
  assert.ok(!playButton.classList.contains('is-loading'), 'spinner clears once every clip has landed and playback starts');
  assert.equal(elements.get('#playIcon').textContent, '⏸');
  assert.equal(elements.get('#speechStatus').textContent, '');
});
