'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const E = require('./ehon.js');
const stories = require('./stories.js');

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.listeners = new Map();
    this.attributes = {};
    this.dataset = {};
    this.style = { setProperty() {} };
    this.className = '';
    this.hidden = false;
    this.checked = false;
    this.disabled = false;
    this.value = '';
    this.classList = {
      add: (...names) => this.setClasses(names, true),
      remove: (...names) => this.setClasses(names, false),
      contains: name => this.className.split(/\s+/).includes(name),
      toggle: (name, force = !this.classList.contains(name)) => {
        this.setClasses([name], force);
        return force;
      },
    };
  }

  setClasses(names, add) {
    const classes = new Set(this.className.split(/\s+/).filter(Boolean));
    for (const name of names) {
      if (add) classes.add(name);
      else classes.delete(name);
    }
    this.className = [...classes].join(' ');
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node instanceof FakeElement && node.tagName === '#FRAGMENT') {
        this.append(...node.children);
      } else {
        if (node instanceof FakeElement) node.parentElement = this;
        this.children.push(node);
      }
    }
  }

  replaceChildren(...nodes) {
    this.children = [];
    this.append(...nodes);
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatch(type, detail = {}) {
    for (const listener of this.listeners.get(type) || []) {
      listener({ target: this, ...detail });
    }
  }

  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() {}
  scrollIntoView() {}

  remove() {
    if (!this.parentElement) return;
    const index = this.parentElement.children.indexOf(this);
    if (index >= 0) this.parentElement.children.splice(index, 1);
    this.parentElement = null;
  }

  closest(selector) {
    for (let node = this; node; node = node.parentElement) {
      if (selector.startsWith('.') && selector.slice(1).split('.').every(name => node.classList.contains(name))) return node;
    }
    return null;
  }

  descendants() {
    return this.children.flatMap(child => child instanceof FakeElement ? [child, ...child.descendants()] : []);
  }

  querySelectorAll(selector) {
    const selectors = selector.split(',').map(item => item.trim());
    return this.descendants().filter(node => selectors.some(item =>
      item.startsWith('.') && item.slice(1).split('.').every(name => node.classList.contains(name))));
  }

  querySelector(selector) {
    if (selector === '.book-card') return this.querySelectorAll(selector)[0] || null;
    if (selector.startsWith('.')) return this.querySelectorAll(selector)[0] || null;
    return null;
  }

  contains(node) { return node === this || this.descendants().includes(node); }
}

function createReader({ analytics = true } = {}) {
  const ids = [
    'shelf', 'bookList', 'reader', 'readerTitle', 'closeBook', 'settingsButton', 'settingsPanel',
    'zhuyinToggle', 'autoTurnToggle', 'stage', 'page', 'pageImage', 'pageText', 'speechStatus',
    'prevButton', 'nextButton', 'playButton', 'playIcon', 'replayButton', 'muteButton', 'muteIcon', 'pageCounter',
  ];
  const elements = new Map(ids.map(id => [`#${id}`, new FakeElement()]));
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
  const context = {
    window: { TaiwanEhon: E, TaiwanEhonStories: stories },
    document,
    localStorage,
    Audio: FakeAudio,
    setTimeout: () => 1,
    clearTimeout() {},
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

function recordedEvents(reader) {
  return JSON.parse(JSON.stringify(reader.events));
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
  assert.deepEqual(audio.played, ['./audio/bai-zei-qi/zh/p01-1.mp3']);
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
  assert.equal(firstClip, './audio/bai-zei-qi/ja/p01-1.mp3');
  assert.equal(reader.audio.played[1], './audio/bai-zei-qi/zh/p01-1.mp3');
});
