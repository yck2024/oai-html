'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const E = require('./ehon.js');
const stories = require('./stories.js');
const { FakeElement, READER_IDS, createLocationHistory } = require('./test-dom.js');

function createReader({ analytics = true } = {}) {
  const elements = new Map(READER_IDS.map(id => [`#${id}`, new FakeElement()]));
  const modeInputs = ['ja-zh', 'zh-ja', 'ja', 'zh'].map(value => {
    const input = new FakeElement('input');
    input.value = value;
    return input;
  });
  const document = {
    title: '',
    querySelector: selector => elements.get(selector) || null,
    querySelectorAll: selector => selector === 'input[name="listenMode"]' ? modeInputs : [],
    createElement: tagName => new FakeElement(tagName),
    createDocumentFragment: () => new FakeElement('#fragment'),
    addEventListener() {},
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
  const nav = createLocationHistory('/taiwan-ehon/');
  const context = {
    window: { TaiwanEhon: E, TaiwanEhonStories: stories },
    document,
    localStorage,
    Audio: FakeAudio,
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
    openStory(index) { elements.get('#bookList').querySelectorAll('.book-card')[index].dispatch('click'); },
    selectMode(mode) {
      for (const input of modeInputs) input.checked = input.value === mode;
      modeInputs.find(input => input.value === mode).dispatch('change');
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
  assert.deepEqual(recordedEvents(reader), [['event', 'book_open', { book_id: stories[0].id }]]);
  const sentence = elements.get('#pageText').querySelector('.line');
  elements.get('#pageText').dispatch('click', { target: sentence });
  elements.get('#nextButton').dispatch('click');
  elements.get('#prevButton').dispatch('click');
  elements.get('#playButton').dispatch('click');
  assert.deepEqual(recordedEvents(reader), [['event', 'book_open', { book_id: stories[0].id }]]);
  elements.get('#closeBook').dispatch('click');
  reader.openStory(1);
  assert.deepEqual(recordedEvents(reader).at(-1), ['event', 'book_open', { book_id: stories[1].id }]);
});

test('reaching the ending sends one completion per opening, including revisiting the ending', () => {
  const reader = createReader();
  const { elements } = reader;
  const next = elements.get('#nextButton');
  const prev = elements.get('#prevButton');
  reader.events.length = 0;
  for (let i = 0; i < stories[0].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader), [['event', 'book_complete', { book_id: stories[0].id }]]);
  prev.dispatch('click');
  next.dispatch('click');
  next.dispatch('click');
  elements.get('#page').querySelector('.end-button.primary').dispatch('click');
  for (let i = 0; i < stories[0].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader), [['event', 'book_complete', { book_id: stories[0].id }]]);
  elements.get('#closeBook').dispatch('click');
  reader.openStory(1);
  for (let i = 0; i < stories[1].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader).slice(-2), [
    ['event', 'book_open', { book_id: stories[1].id }],
    ['event', 'book_complete', { book_id: stories[1].id }],
  ]);
  elements.get('#closeBook').dispatch('click');
  reader.openStory(0);
  for (let i = 0; i < stories[0].pages.length; i++) next.dispatch('click');
  assert.deepEqual(recordedEvents(reader).at(-1), ['event', 'book_complete', { book_id: stories[0].id }]);
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
    ['event', 'listen_mode_change', { listen_mode: 'zh-ja' }],
    ['event', 'listen_mode_change', { listen_mode: 'ja' }],
    ['event', 'zhuyin_toggle', { zhuyin: 'off' }],
    ['event', 'zhuyin_toggle', { zhuyin: 'on' }],
    ['event', 'auto_turn_toggle', { auto_turn: 'on' }],
    ['event', 'auto_turn_toggle', { auto_turn: 'off' }],
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
