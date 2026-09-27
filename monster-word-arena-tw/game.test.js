'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');
const { GOAL_BY_LEVEL, CHOICE_COUNT, TOPICS, LEVELS, WORD_TOPICS, REACTIONS, createGame, createSpeechPlayer } = require('./game.js');
const { EFFECTS, EFFECT_LEVEL, MUSIC_LEVEL, createSoundBoard } = require('./sounds.js');
const { POSES, ART, TIMING, comboText } = require('./arena.js');
const { STORAGE_KEY, STICKERS, COSTUMES } = require('./rewards.js');
const I18N = require('./i18n.js');
const prompts = require('./audio/prompts.json');
const reactions = require('./audio/reactions.json');

const steadyRandom = () => 0.3;
const WORD_TOPIC_IDS = ['colors', 'face', 'family', 'animals', 'fruit', 'vegetables', 'flowers', 'vehicles', 'weather'];

// Small deterministic generator so long play sessions are repeatable in tests.
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const PAGE = JSON.parse(execFileSync('python3', ['-B', '-c', `
import json
from html.parser import HTMLParser

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []
        self.roots = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        src = attrs.get('src')
        if tag == 'script' and src:
            self.sources.append(src)
        node = {'tag': tag, 'attrs': attrs, 'text': '', 'children': []}
        (self.stack[-1]['children'] if self.stack else self.roots).append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]['tag'] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if self.stack:
            self.stack[-1]['text'] += data

parser = Page()
parser.feed(open('index.html', encoding='utf-8').read())
print(json.dumps({'scripts': parser.sources, 'roots': parser.roots}))
`], { cwd: __dirname, encoding: 'utf8' }));
const PAGE_SCRIPTS = PAGE.scripts;

function answerCorrectly(game) {
  const state = game.getState();
  return game.answer(state.question.answerId);
}

function matchesSelector(element, selector) {
  if (selector.startsWith('#')) return element.attributes.id === selector.slice(1);
  if (selector.startsWith('.')) return element.classList.contains(selector.slice(1));
  const attributes = [...selector.matchAll(/\[data-([a-z-]+)="([^"]*)"\]/g)];
  if (attributes.length && attributes.map(match => match[0]).join('') === selector) {
    return attributes.every(([, name, value]) => {
      const property = name.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
      return element.dataset[property] === value;
    });
  }
  return element.tagName.toLowerCase() === selector;
}

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.text = '';
    this.dataset = {};
    this.attributes = {};
    this.listeners = {};
    this.disabled = false;
    this.hidden = false;
    this.offsetWidth = 1;
    this.style = {};
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)),
      remove: (...names) => names.forEach(name => this.classes.delete(name)),
      toggle: (name, force = !this.classes.has(name)) => {
        if (force) this.classes.add(name);
        else this.classes.delete(name);
        return force;
      },
      contains: name => this.classes.has(name),
    };
  }

  addEventListener(type, callback) {
    (this.listeners[type] ||= []).push(callback);
  }

  click() {
    this.dispatch('click');
  }

  dispatch(type, properties = {}) {
    for (const callback of this.listeners[type] || []) callback({ currentTarget: this, target: this, preventDefault() {}, ...properties });
  }

  get id() {
    return this.attributes.id || '';
  }

  set id(value) {
    this.attributes.id = String(value);
  }

  get className() {
    return [...this.classes].join(' ');
  }

  set className(value) {
    this.classes = new Set(String(value).split(/\s+/).filter(Boolean));
  }

  get textContent() {
    return this.text + this.children.map(child => child.textContent).join('');
  }

  set textContent(value) {
    this.replaceChildren();
    this.text = String(value);
  }

  append(...children) {
    children.forEach(child => { child.parentNode = this; });
    this.children.push(...children);
  }

  prepend(...children) {
    children.forEach(child => { child.parentNode = this; });
    this.children.unshift(...children);
  }

  insertBefore(child, before) {
    const index = this.children.indexOf(before);
    if (index < 0) return this.append(child);
    child.parentNode = this;
    this.children.splice(index, 0, child);
    return child;
  }

  remove() {
    if (!this.parentNode) return;
    const siblings = this.parentNode.children;
    const index = siblings.indexOf(this);
    if (index >= 0) siblings.splice(index, 1);
    this.parentNode = null;
  }

  replaceChildren(...children) {
    this.children.forEach(child => { child.parentNode = null; });
    this.children = [];
    this.text = '';
    this.append(...children);
  }

  replaceWith(...nodes) {
    const parent = this.parentNode;
    if (!parent) return;
    const replacements = nodes.map(node => (typeof node === 'string' ? { textContent: node } : node));
    replacements.forEach(node => { node.parentNode = parent; });
    parent.children.splice(parent.children.indexOf(this), 1, ...replacements);
    this.parentNode = null;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = parent => parent.children.forEach(child => {
      if (!child.tagName) return;
      if (matchesSelector(child, selector)) matches.push(child);
      visit(child);
    });
    visit(this);
    return matches;
  }

  querySelector(selector) {
    if (selector.startsWith('[data-') && selector.endsWith(']')) {
      const [, attr, value] = selector.match(/^\[([\w-]+)="([^"]*)"\]$/) || [];
      const target = [];
      const visit = parent => parent.children.forEach(child => {
        if (!child.tagName) return;
        if (child.dataset && child.dataset[attrToCamel(attr)] === value) target.push(child);
        visit(child);
      });
      visit(this);
      return target[0] || null;
    }
    return this.querySelectorAll(selector)[0] || null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  contains(element) {
    for (let current = element; current; current = current.parentNode) if (current === this) return true;
    return false;
  }

  focus() { this.ownerDocument.activeElement = this; }
}

function attrToCamel(attr) {
  return attr.replace(/^data-/, '').replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

class FakeAudio {
  pause() {}
  load() {}
  play() { return Promise.resolve(); }
}

// Runs the arena's timers on demand so a test can step through each beat of a power move.
function createClock() {
  let now = 0;
  let nextId = 0;
  const tasks = new Map();
  return {
    setTimeout(callback, delay = 0) {
      nextId += 1;
      tasks.set(nextId, { at: now + delay, callback });
      return nextId;
    },
    clearTimeout(id) {
      tasks.delete(id);
    },
    tick(ms) {
      const end = now + ms;
      for (;;) {
        const [due] = [...tasks.entries()].filter(([, task]) => task.at <= end).sort((a, b) => a[1].at - b[1].at);
        if (!due) break;
        tasks.delete(due[0]);
        now = due[1].at;
        due[1].callback();
      }
      now = end;
    },
  };
}

function clickAnswer(app, game, correct = true) {
  const { answerId } = game.getState().question;
  app.answerOptions.children.find(button => (button.dataset.choice === answerId) === correct).click();
}

class FakeParam {
  constructor(value = 0) {
    this.value = value;
    this.events = [];
  }

  setValueAtTime(value, time) { this.events.push(['set', value, time]); }
  linearRampToValueAtTime(value, time) { this.events.push(['linear', value, time]); this.value = value; }
  exponentialRampToValueAtTime(value, time) {
    assert.ok(value > 0, 'an exponential ramp never targets zero');
    this.events.push(['exponential', value, time]);
  }
  cancelScheduledValues() {}
}

// Records the Web Audio graph the sound board builds; the "speakers" are just a list of nodes.
class FakeAudioContext {
  constructor() {
    this.currentTime = 0;
    this.sampleRate = 8000;
    this.state = 'suspended';
    this.resumed = 0;
    this.sources = [];
    this.gains = [];
    this.destination = { connections: [] };
  }

  node(extra = {}) {
    return { connections: [], connect(target) { this.connections.push(target); }, ...extra };
  }

  createGain() {
    const gain = this.node({ gain: new FakeParam(1) });
    this.gains.push(gain);
    return gain;
  }
  createBiquadFilter() { return this.node({ frequency: new FakeParam(350), Q: new FakeParam(1) }); }
  createBuffer(_channels, length) {
    const data = new Float32Array(length);
    return { getChannelData: () => data };
  }

  createOscillator() {
    const osc = this.node({ frequency: new FakeParam(440), start: time => { osc.startTime = time; }, stop: time => { osc.stopTime = time; } });
    this.sources.push(osc);
    return osc;
  }

  createBufferSource() {
    const source = this.node({ start: time => { source.startTime = time; } });
    this.sources.push(source);
    return source;
  }

  resume() {
    this.resumed += 1;
    this.state = 'running';
    return Promise.resolve();
  }
}

function createFakeTimers() {
  const timers = new Map();
  let nextId = 1;
  return {
    timers,
    setTimer(callback) { timers.set(nextId, callback); return nextId++; },
    clearTimer(id) { timers.delete(id); },
  };
}

function createTestBoard() {
  let ctx = null;
  const timers = createFakeTimers();
  const board = createSoundBoard(() => { ctx = new FakeAudioContext(); return ctx; }, timers);
  return {
    board,
    timers,
    get ctx() { return ctx; },
    // The first three gains the board creates are the master, effects, and music buses.
    get buses() {
      const [master, effects, music] = ctx.gains;
      return { master: master.gain.value, effects: effects.gain.value, music: music.gain.value };
    },
  };
}

class FakeLocalStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }
}

function createPageDocument() {
  const elements = new Map();
  const allElements = [];
  function build(node) {
    const element = new FakeElement(node.tag);
    element.text = node.text;
    Object.entries(node.attrs).forEach(([name, value]) => {
      if (name === 'class') element.className = value || '';
      else if (name === 'hidden') element.hidden = true;
      else if (name === 'disabled') element.disabled = true;
      else if (name.startsWith('data-')) element.dataset[name.slice(5).replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase())] = value || '';
      else element.attributes[name] = value === null ? '' : String(value);
    });
    if (node.attrs.id) elements.set(`#${node.attrs.id}`, element);
    allElements.push(element);
    element.append(...node.children.map(build));
    return element;
  }

  const roots = PAGE.roots.map(build);
  // Live tree search (not a fixed snapshot), so elements app.js creates and appends after
  // load — the topic tabs and level buttons — are found too.
  function liveElements() {
    const found = [];
    const visit = node => {
      if (!node.tagName) return;
      found.push(node);
      node.children.forEach(visit);
    };
    roots.forEach(visit);
    return found;
  }

  const documentListeners = new Map();
  const document = {
    documentElement: allElements.find(element => element.tagName === 'HTML'),
    hidden: false,
    activeElement: null,
    addEventListener(type, callback, options) {
      const listeners = documentListeners.get(type) || [];
      listeners.push({ callback, options });
      documentListeners.set(type, listeners);
    },
    removeEventListener(type, callback) {
      documentListeners.set(type, (documentListeners.get(type) || []).filter(listener => listener.callback !== callback));
    },
    dispatchEvent(event) {
      for (const listener of documentListeners.get(event.type) || []) listener.callback(event);
    },
    querySelector: selector => liveElements().find(element => matchesSelector(element, selector)) || null,
    querySelectorAll: selector => liveElements().filter(element => matchesSelector(element, selector)),
    createElement: tagName => {
      const element = new FakeElement(tagName);
      element.ownerDocument = document;
      return element;
    },
    createTextNode: text => ({ textContent: String(text) }),
  };
  allElements.forEach(element => { element.ownerDocument = document; });
  return { document, elements, allElements };
}

function createAppFixture(game, globals = {}) {
  const { document, elements } = createPageDocument();
  const championCards = document.querySelectorAll('.champion-card');
  const textLanguageButtons = document.querySelectorAll('.text-language');
  const effects = [];
  const sound = { board: null, ctx: null, timers: createFakeTimers() };
  const windowListeners = new Map();
  class FixtureEvent {
    constructor(type) { this.type = type; }
  }
  const window = {
    AudioContext: FakeAudioContext,
    Event: FixtureEvent,
    addEventListener(type, callback) {
      const listeners = windowListeners.get(type) || [];
      listeners.push(callback);
      windowListeners.set(type, listeners);
    },
    dispatchEvent(event) {
      for (const callback of windowListeners.get(event.type) || []) callback(event);
    },
  };
  if (globals.localStorage) window.localStorage = globals.localStorage;
  // The page's own scripts publish these modules; the fixture swaps in the test game and records sounds.
  const hooks = {
    FriendlyArena: api => ({ ...api, createGame: () => game }),
    FriendlyArenaSounds: api => ({
      ...api,
      createSoundBoard(makeContext) {
        const board = api.createSoundBoard(() => { sound.ctx = makeContext(); return sound.ctx; }, sound.timers);
        sound.board = board;
        // Records only effects that actually sounded (not muted or throttled).
        return { ...board, play: (name, options) => board.play(name, options) && effects.push(name) > 0 };
      },
    }),
  };
  Object.entries(hooks).forEach(([name, hook]) => {
    let published;
    Object.defineProperty(window, name, { get: () => published, set: api => { published = hook(api); } });
  });
  const played = [];
  const audioState = { pauses: 0 };
  const audioElements = [];
  class RecordingAudio extends FakeAudio {
    constructor() {
      super();
      this.listeners = {};
      audioElements.push(this);
    }

    addEventListener(type, callback) {
      (this.listeners[type] ||= []).push(callback);
    }

    dispatch(type) {
      (this.listeners[type] || []).forEach(callback => callback());
    }

    pause() { audioState.pauses += 1; }
    play() {
      played.push(this.src);
      return super.play();
    }
  }
  const clock = createClock();
  // Runs the scripts in the order index.html lists them, as the browser does.
  const page = vm.createContext({ window, document, Event: FixtureEvent, Audio: RecordingAudio, setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout, ...globals });
  for (const src of PAGE_SCRIPTS) vm.runInContext(fs.readFileSync(path.join(__dirname, src), 'utf8'), page, { filename: src });
  const topicTabs = document.querySelectorAll('.topic-tab');
  const levelButtons = document.querySelectorAll('.level-option');
  return {
    elements, played, effects, sound, audioElements, audioState, championCards, textLanguageButtons, topicTabs, levelButtons,
    dispatchWindowEvent(type, properties = {}) { window.dispatchEvent(Object.assign(new FixtureEvent(type), properties)); },
    answerOptions: elements.get('#answerOptions'), nextButton: elements.get('#nextButton'),
    muteButton: elements.get('#muteButton'), musicButton: elements.get('#musicButton'),
    startButton: elements.get('#startButton'), startRow: elements.get('#startRow'), clock, document,
    // Moves the fake audio clock past every effect's anti-pile-up gap.
    later(seconds = 2) { if (sound.ctx) sound.ctx.currentTime += seconds; },
  };
}

function poses(app) {
  return `${app.elements.get('#heroArt').dataset.pose}/${app.elements.get('#buddyArt').dataset.pose}`;
}

test('the shipped page markup initializes the arena and game', () => {
  const app = createAppFixture(createGame(steadyRandom));
  assert.equal(poses(app), 'ready/ready');
  assert.equal(app.elements.get('#comboCount').textContent, '0');
  assert.equal(app.championCards.length, 2);
  assert.equal(app.topicTabs.length, TOPICS.length);
  assert.equal(app.levelButtons.length, LEVELS.length);
  assert.equal(app.textLanguageButtons.length, 3);
  assert.equal(app.document.querySelectorAll('.fighter-body').length, 2);
  for (const action of ['open', 'close', 'reset', 'confirm-reset', 'keep']) {
    assert.ok(app.document.querySelector(`[data-reward-action="${action}"]`), `${action} reward action is in the shipped page`);
  }
  assert.ok(app.document.querySelector('.stage-effects'));
  assert.equal(app.elements.get('#scoreStars').children.length, GOAL_BY_LEVEL.easy);
  assert.equal(app.elements.get('#rivalPower').children.length, GOAL_BY_LEVEL.easy);
});

test('addition questions stay within five and offer three distinct choices', () => {
  const game = createGame(steadyRandom);
  for (let index = 0; index < 3; index += 1) {
    const question = game.getState().question;
    const [left, right] = question.display.split(' = ?')[0].split(' + ').map(Number);
    assert.ok(left + right <= 5);
    assert.equal(question.answerId, String(left + right));
    assert.equal(question.options.length, 3);
    assert.equal(new Set(question.options.map(option => option.id)).size, 3);
    assert.ok(question.options.some(option => option.id === question.answerId));
    assert.ok(['correct', 'finished'].includes(answerCorrectly(game)));
    if (index < 2) assert.equal(game.nextQuestion(), true);
  }
});

test('word challenges use bilingual Taiwan Traditional Chinese and hiragana Japanese vocabulary', () => {
  const expected = {
    colors: ['紅色', '黃色', '綠色', '藍色', '橘色', '紫色', '粉紅色', '咖啡色'],
    face: ['眼睛', '鼻子', '耳朵', '嘴巴', '牙齒', '頭髮', '手', '腳'],
    family: ['爸爸', '媽媽', '哥哥', '姊姊', '爺爺', '奶奶', '寶寶'],
    animals: ['小狗', '小貓', '兔子', '小鳥', '小魚', '大象', '小豬', '猴子'],
    fruit: ['蘋果', '香蕉', '葡萄', '草莓', '西瓜', '鳳梨', '芒果', '櫻桃'],
    vegetables: ['紅蘿蔔', '番茄', '玉米', '馬鈴薯', '高麗菜', '青花菜', '茄子', '南瓜'],
    flowers: ['向日葵', '鬱金香', '櫻花', '牽牛花', '玫瑰', '雛菊'],
    vehicles: ['汽車', '公車', '火車', '飛機', '腳踏車', '消防車'],
    weather: ['晴天', '雨天', '陰天', '下雪', '颳風', '彩虹', '打雷'],
  };
  assert.deepEqual(TOPICS, ['math', ...WORD_TOPIC_IDS]);
  assert.deepEqual(Object.keys(WORD_TOPICS), WORD_TOPIC_IDS);
  for (const topic of WORD_TOPIC_IDS) {
    assert.deepEqual(WORD_TOPICS[topic].words.map(word => word.zh), expected[topic], `${topic} uses the expected Traditional Chinese`);
    for (const word of WORD_TOPICS[topic].words) {
      assert.ok(word.ja, `${topic}-${word.id} has a Japanese label`);
      assert.doesNotMatch(word.ja, /[ァ-ヺ]/, `${topic}-${word.id} Japanese label has no katakana`);
      assert.doesNotMatch(word.ja, /[一-鿿]/, `${topic}-${word.id} Japanese label has no kanji`);
    }
  }

  const game = createGame(seededRandom(7));
  for (const topic of WORD_TOPIC_IDS) {
    game.chooseTopic(topic);
    for (let draw = 0; draw < 12; draw += 1) {
      const question = game.getState().question;
      assert.ok(question.options.every(option => expected[topic].includes(option.zh)), `${topic} options come from its word list`);
      const target = question.options.find(option => option.id === question.answerId);
      assert.ok(target);
      assert.ok(question.promptEn.toLowerCase().includes(target.en.toLowerCase()));
      assert.ok(question.promptZh.includes(target.zh));
      assert.ok(question.promptJa.includes(target.ja));
      assert.ok(question.options.every(option => option.en && option.ja));
      game.chooseTopic(topic);
    }
  }
});

test('every word prompt shows the picture of its matching answer for pre-readers at the easy level', () => {
  for (const seed of [0, 0.4, 0.99]) {
    const game = createGame(() => seed);
    for (const topic of WORD_TOPIC_IDS) {
      game.chooseTopic(topic);
      const question = game.getState().question;
      const target = question.options.find(option => option.id === question.answerId);
      assert.equal(question.picture, target.icon, `${topic} picture matches the answer`);
      assert.equal(question.options.filter(option => option.icon === question.picture).length, 1);
      if (topic === 'colors') {
        assert.equal(question.pictureSwatch, target.swatch, 'the color prompt shows the answer swatch');
        assert.equal(question.options.filter(option => option.swatch === question.pictureSwatch).length, 1);
        continue;
      }
      assert.equal(question.pictureImage, target.image, `${topic} art matches the answer`);
      assert.equal(question.options.filter(option => option.image === question.pictureImage).length, 1);
    }
  }
});

test('every picture word has bundled original art sized for a phone page', () => {
  const pictureWords = WORD_TOPIC_IDS.filter(topic => topic !== 'colors').flatMap(topic => WORD_TOPICS[topic].words.map(word => ({ topic, word })));
  assert.equal(pictureWords.length, 58);
  assert.equal(new Set(pictureWords.map(({ word }) => word.image)).size, pictureWords.length, 'every word has its own picture');
  let totalBytes = 0;
  for (const { topic, word } of pictureWords) {
    assert.equal(word.image, `./images/${topic}-${word.id}.webp`);
    assert.ok(word.icon, `${word.id} keeps an emoji fallback`);
    const art = fs.readFileSync(path.join(__dirname, word.image));
    assert.equal(art.toString('latin1', 0, 4), 'RIFF', `${word.image} is a RIFF file`);
    assert.equal(art.toString('latin1', 8, 16), 'WEBPVP8X', `${word.image} is an extended WebP`);
    assert.ok(art[20] & 0x10, `${word.image} has a transparent alpha channel`);
    assert.equal(art.readUIntLE(24, 3) + 1, 192, `${word.image} is 192px wide`);
    assert.equal(art.readUIntLE(27, 3) + 1, 192, `${word.image} is 192px tall`);
    assert.ok(art.length < 16 * 1024, `${word.image} stays small`);
    totalBytes += art.length;
  }
  assert.ok(totalBytes < 700 * 1024, 'all pictures together stay light for a phone');
  const committed = fs.readdirSync(path.join(__dirname, 'images')).sort();
  const expectedImages = [
    ...pictureWords.map(({ word }) => path.basename(word.image)),
    ...ART.map(file => path.basename(file)),
    ...[...STICKERS, ...COSTUMES].map(item => path.basename(item.image)),
  ].sort();
  assert.deepEqual(committed, expectedImages, 'all word, arena, sticker, and costume art has a game consumer');
});

test('each correct answer knocks one pip off the sparring buddy with no penalty for misses', () => {
  const game = createGame(steadyRandom);
  const goal = GOAL_BY_LEVEL.easy;
  assert.equal(game.getState().rivalPower, goal);
  const { question } = game.getState();
  const wrong = question.options.find(option => option.id !== question.answerId);
  game.answer(wrong.id);
  assert.equal(game.getState().rivalPower, goal);
  for (let hit = 1; hit <= goal; hit += 1) {
    if (hit > 1) game.nextQuestion();
    answerCorrectly(game);
    assert.equal(game.getState().rivalPower, goal - hit);
  }
  assert.equal(game.restart().rivalPower, goal);
});

test('a wrong answer is retryable and never awards a star', () => {
  const game = createGame(steadyRandom);
  const { question } = game.getState();
  const wrong = question.options.find(option => option.id !== question.answerId);
  assert.equal(game.answer(wrong.id), 'try-again');
  assert.equal(game.getState().stars, 0);
  assert.equal(game.getState().solved, false);
  assert.equal(game.getState().feedback, 'try-again');
  assert.equal(answerCorrectly(game), 'correct');
  assert.equal(game.getState().stars, 1);
});

test('switching learning content keeps earned stars and resets the active attempt', () => {
  const game = createGame(steadyRandom);
  answerCorrectly(game);
  game.chooseTopic('colors');
  const state = game.getState();
  assert.equal(state.topic, 'colors');
  assert.equal(state.stars, 1);
  assert.equal(state.solved, false);
  assert.equal(state.feedback, '');
  assert.equal(state.question.topic, 'colors');
});

test('a solved question cannot award twice; three stars finish the friendly match at easy', () => {
  const game = createGame(steadyRandom);
  const goal = GOAL_BY_LEVEL.easy;
  for (let star = 1; star <= goal; star += 1) {
    if (star > 1) assert.equal(game.nextQuestion(), true);
    const result = answerCorrectly(game);
    assert.equal(result, star === goal ? 'finished' : 'correct');
    assert.equal(game.answer(game.getState().question.answerId), 'ignored');
  }
  assert.equal(game.getState().stars, goal);
  assert.equal(game.getState().finished, true);
  assert.equal(game.nextQuestion(), false);
  assert.equal(game.chooseTopic('family'), false);
});

test('the child can pick a champion and restart without saving progress', () => {
  const game = createGame(steadyRandom);
  game.chooseChampion('monster');
  game.chooseTopic('family');
  answerCorrectly(game);
  const restarted = game.restart();
  assert.equal(restarted.champion, 'monster');
  assert.equal(restarted.topic, 'family');
  assert.equal(restarted.stars, 0);
  assert.equal(restarted.finished, false);
  assert.equal(restarted.solved, false);
});

test('invalid topics and answers are ignored without changing progress', () => {
  const game = createGame(steadyRandom);
  assert.equal(game.chooseTopic('tracking'), false);
  assert.equal(game.answer('secret'), 'ignored');
  assert.equal(game.getState().stars, 0);
});

test('every math and vocabulary prompt has bundled English, Taiwan Mandarin, and Japanese audio', () => {
  const expected = [
    'math-1-1', 'math-1-2', 'math-2-2', 'math-2-1', 'math-3-1',
    'math-count', 'math-3-3', 'math-4-2', 'math-5-2', 'math-3-4', 'math-4-4',
    'math-5-3', 'math-6-3', 'math-4-5', 'math-5-5', 'math-6-4',
    ...WORD_TOPIC_IDS.flatMap(topic => WORD_TOPICS[topic].words.map(word => `${topic}-${word.id}`)),
  ].sort();
  assert.deepEqual(Object.keys(prompts).sort(), expected);

  for (const [audioId, translations] of Object.entries(prompts)) {
    assert.ok(translations.en, `${audioId} has English narration`);
    assert.ok(translations.zh, `${audioId} has Taiwan Mandarin narration`);
    assert.ok(translations.ja, `${audioId} has Japanese narration`);
    assert.match(translations.zh, /[㐀-鿿]/, `${audioId} uses Chinese characters`);
    assert.match(translations.ja, /[぀-ヿ㐀-鿿]/, `${audioId} uses Japanese writing`);
    for (const language of ['en', 'zh', 'ja']) {
      const audioPath = path.join(__dirname, 'audio', language, `${audioId}.mp3`);
      assert.ok(fs.existsSync(audioPath), `${audioPath} is bundled`);
      assert.ok(fs.statSync(audioPath).size > 1024, `${audioPath} contains audio`);
    }
  }
});

test('every spoken reaction has bundled English, Taiwan Mandarin, and Japanese audio', () => {
  const reactionIds = Object.values(REACTIONS).flat();
  assert.deepEqual(Object.keys(REACTIONS), ['praise', 'try-again', 'finish', 'break-prompt', 'break-goodbye']);
  assert.deepEqual([...reactionIds].sort(), Object.keys(reactions).sort());
  for (const variants of Object.values(REACTIONS)) assert.ok(variants.length >= 1 && variants.length <= 3);
  for (const audioId of reactionIds) {
    assert.equal(prompts[audioId], undefined, `${audioId} does not collide with a question prompt`);
    for (const language of ['en', 'zh', 'ja']) {
      assert.ok(reactions[audioId][language], `${audioId} has ${language} text`);
      const audioPath = path.join(__dirname, 'audio', language, `${audioId}.mp3`);
      assert.ok(fs.existsSync(audioPath), `${audioPath} is bundled`);
      assert.ok(fs.statSync(audioPath).size > 1024, `${audioPath} contains audio`);
    }
  }
  assert.match(reactions['reaction-try-again-1'].zh, /[㐀-鿿]/);
  assert.match(reactions['reaction-finish-1'].ja, /[぀-ヿ]/);
});

test('Gemini generator config covers all languages and routes only the listed misread clips through voiced spellings', () => {
  const python = String.raw`
import importlib.util, json
from pathlib import Path
module_path = Path.cwd() / 'generate_gemini_audio.py'
spec = importlib.util.spec_from_file_location('gemini_audio', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
prompts = module.load_clip_texts()
clips = module.selected_clips(prompts, list(module.LANGUAGES), None, True)
missing_only = module.selected_clips(prompts, list(module.LANGUAGES), None, False)
repeated = module.selected_clips(prompts, ['en', 'en', 'zh', 'zh'], ['family-sister', 'family-sister'], True)
print(json.dumps({
    'model': module.MODEL,
    'languages': module.LANGUAGES,
    'clips': clips,
    'repeated': repeated,
    'missing_only': missing_only,
    'overrides': [[language, audio_id, text] for (language, audio_id), text in module.PRONUNCIATION_OVERRIDES.items()],
}, ensure_ascii=False))
`;
  const generated = JSON.parse(execFileSync('python3', ['-B', '-c', python], { cwd: __dirname, encoding: 'utf8' }));
  assert.equal(generated.model, 'gemini-3.8-flash-tts');
  assert.deepEqual(Object.keys(generated.languages), ['en', 'zh', 'ja']);
  assert.deepEqual(
    Object.fromEntries(Object.entries(generated.languages).map(([key, config]) => [key, [config.locale, config.voice]])),
    { en: ['en-US', 'Aoede'], zh: ['zh-TW', 'Kore'], ja: ['ja-JP', 'ja-jp-tutor-1'] },
  );
  assert.equal(generated.clips.length, 3 * (Object.keys(prompts).length + Object.keys(reactions).length));
  assert.deepEqual(generated.missing_only, [], 'a default run regenerates no bundled clip');
  assert.deepEqual(generated.repeated, [['en', 'family-sister', 'Find your older sister!'], ['zh', 'family-sister', '誰是姐姐？']]);
  const overrides = {
    'zh/family-sister': '誰是姐姐？',
    'zh/animals-cat': '小猫在哪裡？',
    'ja/face-mouth': 'お口を見つけてね！',
    'ja/fruit-pineapple': 'パイナップルを見つけてね！',
  };
  assert.deepEqual(Object.fromEntries(generated.overrides.map(([language, audioId, text]) => [`${language}/${audioId}`, text])), overrides);
  const audioText = new Map(generated.clips.map(([language, audioId, text]) => [`${language}/${audioId}`, text]));
  for (const [audioId, translations] of Object.entries({ ...prompts, ...reactions })) {
    for (const language of ['en', 'zh', 'ja']) {
      assert.equal(audioText.get(`${language}/${audioId}`), overrides[`${language}/${audioId}`] || translations[language]);
    }
  }

  const game = createGame(seededRandom(1));
  game.chooseTopic('family');
  while (game.getState().question.answerId !== 'sister') game.chooseTopic('family');
  const sisterQuestion = game.getState().question;
  assert.equal(sisterQuestion.promptZh, '誰是姊姊？');
  assert.equal(sisterQuestion.options.find(option => option.id === 'sister').zh, '姊姊');
});

test('English is the default voice and text; the child stays silent until Start, a language, replay, or unmute', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const pressed = () => app.textLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.textLanguage);
  assert.deepEqual(pressed(), ['en'], 'English shows as the default voice from the start');
  assert.equal(app.startRow.hidden, false, 'the Start button is offered before any sound plays');

  app.elements.get('#restartButton').click();
  app.elements.get('#playAgainButton').click();
  assert.deepEqual(app.played, [], 'no narration plays before an explicit sound gesture');

  app.startButton.click();
  assert.equal(app.played.length, 1, 'tapping Start turns on sound and speaks the first question');
  assert.match(app.played[0], /^\.\/audio\/en\//);
  assert.equal(app.startRow.hidden, true, 'Start is no longer needed once sound is on');
  app.elements.get('#restartButton').click();
  assert.equal(app.played.length, 2, 'sound stays on across a restart');
});

test('a remembered language from an earlier visit wins over the English default and sets the voice too', () => {
  const storage = new FakeLocalStorage();
  storage.setItem('monsterWordArena.settings.v1', JSON.stringify({ v: 2, textLanguage: 'zh', secondLanguage: 'en', voiceOverride: false, voiceLanguage: 'zh' }));
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  const pressed = () => app.textLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.textLanguage);
  assert.deepEqual(pressed(), ['zh']);
  app.startButton.click();
  assert.match(app.played[0], /^\.\/audio\/zh\//);
});

test('an old saved settings shape migrates: the old text language becomes the language, and a voice that differed from it becomes a grown-up override', () => {
  const storage = new FakeLocalStorage();
  storage.setItem('monsterWordArena.settings.v1', JSON.stringify({ v: 1, speechLanguage: 'ja', textLanguage: 'zh', textLanguageManual: true }));
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  const pressed = () => app.textLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.textLanguage);
  assert.deepEqual(pressed(), ['zh'], 'the old text language becomes the new single language');
  app.startButton.click();
  assert.match(app.played[0], /^\.\/audio\/ja\//, 'a voice that differed from the old text language is kept as a grown-up override');

  const withoutOverride = new FakeLocalStorage();
  withoutOverride.setItem('monsterWordArena.settings.v1', JSON.stringify({ v: 1, speechLanguage: 'en', textLanguage: 'en' }));
  const plainApp = createAppFixture(createGame(steadyRandom), { localStorage: withoutOverride });
  plainApp.startButton.click();
  assert.match(plainApp.played[0], /^\.\/audio\/en\//, 'a voice that matched the old text language follows the language, not an override');
});

test('choosing a language sets both the on-screen text and, by default, the voice, with the pairing\'s default second language', () => {
  const storage = new FakeLocalStorage();
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  const withDefaults = overrides => ({ v: 2, secondLanguageManual: false, voiceOverride: false, speechMuted: false, allowedLevels: ['easy', 'harder', 'super'], ...overrides });
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  let saved = JSON.parse(storage.getItem('monsterWordArena.settings.v1'));
  assert.deepEqual(saved, withDefaults({ textLanguage: 'zh', secondLanguage: 'en', voiceLanguage: 'zh' }), '繁體中文 pairs with English by default');
  assert.match(app.played[0], /^\.\/audio\/zh\//, 'choosing a language is also the sound-on gesture');

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  saved = JSON.parse(storage.getItem('monsterWordArena.settings.v1'));
  assert.deepEqual(saved, withDefaults({ textLanguage: 'ja', secondLanguage: 'en', voiceLanguage: 'ja' }), 'にほんご pairs with English by default');

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();
  saved = JSON.parse(storage.getItem('monsterWordArena.settings.v1'));
  assert.deepEqual(saved, withDefaults({ textLanguage: 'en', secondLanguage: 'zh', voiceLanguage: 'en' }), 'English pairs with 繁體中文 by default, the game\'s original bilingual pairing');
});

function passGate(app) {
  app.elements.get('#settingsButton').click();
  const [a, b] = app.elements.get('#gateQuestion').textContent.match(/\d+/g).map(Number);
  app.elements.get('#gateInput').value = String(a + b);
  app.document.querySelector('#gateSubmitButton').click();
}

test('changing the second language refreshes the visible question prompt immediately', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.topicTabs.find(tab => tab.dataset.topic === 'fruit').click();
  const question = game.getState().question;
  passGate(app);
  app.document.querySelector('[data-second-language="ja"]').click();
  assert.equal(app.elements.get('#questionPrompt').textContent, question.promptEn + question.promptJa);
});

test('a grown-up can change the second language or turn it off in settings', () => {
  const storage = new FakeLocalStorage();
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  passGate(app);
  const secondLanguageButton = language => app.document.querySelector(`[data-second-language="${language}"]`);
  assert.equal(secondLanguageButton('zh').getAttribute('aria-pressed'), 'true', 'English defaults to a 繁體中文 second language');
  assert.equal(secondLanguageButton('en'), null, 'the current main language is never offered as its own second language');
  assert.notEqual(secondLanguageButton('off'), null, 'turning the second language off is always offered');

  secondLanguageButton('ja').click();
  assert.equal(JSON.parse(storage.getItem('monsterWordArena.settings.v1')).secondLanguage, 'ja');
  assert.equal(app.elements.get('#gameTitle').textContent, I18N.STRINGS.gameTitle.en + I18N.STRINGS.gameTitle.ja, 'the game title now shows Japanese as the smaller second line');

  app.document.querySelector('[data-second-language="off"]').click();
  assert.equal(JSON.parse(storage.getItem('monsterWordArena.settings.v1')).secondLanguage, null);
  assert.equal(app.elements.get('#gameTitle').textContent, I18N.STRINGS.gameTitle.en, 'turning the second language off leaves only the main language');
});

test('a grown-up\'s manual second-language choice sticks across later language-picker taps, unlike the untouched default pairing', () => {
  const storage = new FakeLocalStorage();
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  passGate(app);
  app.document.querySelector('[data-second-language="ja"]').click();

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  let saved = JSON.parse(storage.getItem('monsterWordArena.settings.v1'));
  assert.equal(saved.secondLanguage, 'ja', 'the grown-up\'s choice survives a main-language switch that does not collide with it');

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  saved = JSON.parse(storage.getItem('monsterWordArena.settings.v1'));
  assert.equal(saved.secondLanguage, 'en', 'a switch that would collide with the manual choice falls back to that language\'s default pairing instead');
});

test('a grown-up can pick a narration voice different from the on-screen language, off by default', () => {
  const storage = new FakeLocalStorage();
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  app.startButton.click();
  assert.match(app.played[0], /^\.\/audio\/en\//);
  passGate(app);
  assert.equal(app.document.querySelector('[data-voice-option="match"]').getAttribute('aria-pressed'), 'true', 'the voice matches the language by default');

  app.document.querySelector('[data-voice-option="ja"]').click();
  const saved = JSON.parse(storage.getItem('monsterWordArena.settings.v1'));
  assert.equal(saved.voiceOverride, true);
  assert.equal(saved.voiceLanguage, 'ja');
  app.elements.get('#replayPromptButton').click();
  assert.match(app.played.at(-1), /^\.\/audio\/ja\//, 'narration now uses the overridden voice');
  const pressed = () => app.textLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.textLanguage);
  assert.deepEqual(pressed(), ['en'], 'the on-screen language is unaffected by the voice override');

  app.document.querySelector('[data-voice-option="match"]').click();
  assert.equal(JSON.parse(storage.getItem('monsterWordArena.settings.v1')).voiceOverride, false);
  app.elements.get('#replayPromptButton').click();
  assert.match(app.played.at(-1), /^\.\/audio\/en\//, 'the voice follows the language again once the override is off');
});

test('settings persistence degrades safely when storage is unavailable', () => {
  assert.doesNotThrow(() => {
    const app = createAppFixture(createGame(steadyRandom));
    app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  });
});

test('face and family art renders with a single chosen-language label and falls back to emoji if a picture fails', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const questionPicture = app.elements.get('#questionPicture');
  app.topicTabs.find(tab => tab.dataset.topic === 'face').click();

  const { question } = game.getState();
  const answer = question.options.find(option => option.id === question.answerId);
  const [art] = questionPicture.children;
  assert.equal(art.tagName, 'IMG');
  assert.equal(art.src, question.pictureImage);
  assert.equal(art.alt, answer.en, 'the question picture carries its answer\'s chosen-language label');
  assert.equal(art.draggable, false, 'pressing the picture never starts an image drag');
  for (const button of app.answerOptions.children) {
    const option = question.options.find(choice => choice.id === button.dataset.choice);
    const [icon, label] = button.children;
    assert.equal(icon.getAttribute('aria-hidden'), 'true');
    assert.equal(icon.children[0].src, option.image);
    assert.equal(icon.children[0].alt, option.en);
    assert.equal(icon.children[0].draggable, false, 'pressing the answer picture never starts an image drag');
    assert.equal(label.textContent, option.en, 'the button shows the chosen-language word');
  }

  art.dispatch('error');
  assert.equal(questionPicture.textContent, question.picture);
  assert.ok(questionPicture.children.every(child => child.tagName !== 'IMG'));
  const answerArt = app.answerOptions.children[0].children[0];
  answerArt.children[0].dispatch('error');
  assert.equal(answerArt.textContent, question.options.find(option => option.id === app.answerOptions.children[0].dataset.choice).icon);

  app.topicTabs.find(tab => tab.dataset.topic === 'family').click();
  const familyArt = questionPicture.children[0];
  art.dispatch('error');
  assert.equal(questionPicture.children[0], familyArt, 'a stale picture failure cannot replace the new question');
  app.topicTabs.find(tab => tab.dataset.topic === 'math').click();
  assert.equal(questionPicture.children.length, 0);
  assert.equal(questionPicture.textContent, game.getState().question.picture);
});

test('unmuting clears stale muted status even when playback is skipped on the finish screen', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const speechStatus = app.elements.get('#speechStatus');
  app.startButton.click();

  for (let star = 1; star <= GOAL_BY_LEVEL.easy; star += 1) {
    const answerId = game.getState().question.answerId;
    app.answerOptions.children.find(button => button.dataset.choice === answerId).click();
    if (star < GOAL_BY_LEVEL.easy) app.nextButton.click();
  }
  assert.equal(game.getState().finished, true);

  app.muteButton.click();
  assert.match(speechStatus.textContent, /muted|靜音|ミュート/i);
  app.muteButton.click();
  assert.equal(speechStatus.textContent, '');
  assert.equal(app.muteButton.getAttribute('aria-pressed'), 'false');
});

test('game-generated prompt IDs exist for every selectable word and math target at every level', () => {
  const audioIds = new Set();
  const game = createGame(seededRandom(11));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (const topic of TOPICS) {
      game.chooseTopic(topic);
      for (let draw = 0; draw < 80; draw += 1) {
        audioIds.add(game.getState().question.audioId);
        game.chooseTopic(topic);
      }
    }
  }
  for (const audioId of audioIds) {
    assert.ok(prompts[audioId], `${audioId} has a narration manifest entry`);
  }
  assert.equal(audioIds.size, Object.keys(prompts).length, 'the game reaches every bundled prompt');
});

test('easy math keeps small sums; harder counts and adds to ten; super keeps only sums to ten with the numbers shown', () => {
  const game = createGame(seededRandom(3));
  const seen = { easy: new Set(), harder: new Set(), super: new Set() };
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (let draw = 0; draw < 60; draw += 1) {
      const question = game.getState().question;
      const values = question.options.map(option => Number(option.id));
      assert.equal(question.options.length, CHOICE_COUNT[level]);
      assert.equal(new Set(values).size, values.length, 'choices are distinct');
      assert.ok(question.options.some(option => option.id === question.answerId));
      const answer = Number(question.answerId);
      if (question.display) {
        const [left, right] = question.display.split(' = ?')[0].split(' + ').map(Number);
        assert.equal(answer, left + right);
        if (level !== 'super') assert.equal([...question.picture].filter(char => char === '🥚').length, answer);
      } else {
        assert.equal(level, 'harder', 'only the harder level asks counting questions');
        assert.equal(question.audioId, 'math-count', 'the counting clip never says the answer');
        assert.equal([...question.picture].filter(char => char === '🥚').length, answer);
      }
      if (level === 'easy') assert.ok(answer <= 5);
      else {
        assert.ok(answer >= 5 && answer <= 10);
        assert.ok(values.every(value => value >= 1 && value <= 10), `${level} choices stay between one and ten`);
      }
      if (level === 'super') {
        assert.equal(question.picture, '', 'super math hides the egg picture');
        assert.ok(question.display, 'super math always shows the equation numbers');
      }
      seen[level].add(question.display ? 'sum' : 'count');
      game.chooseTopic('math');
    }
  }
  assert.deepEqual([...seen.easy], ['sum']);
  assert.deepEqual([...seen.harder].sort(), ['count', 'sum']);
  assert.deepEqual([...seen.super], ['sum']);
});

test('word questions offer three choices on easy, four on harder and super, all from the bigger pool', () => {
  const game = createGame(seededRandom(5));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (const topic of WORD_TOPIC_IDS) {
      game.chooseTopic(topic);
      const targets = new Set();
      for (let draw = 0; draw < 60; draw += 1) {
        const question = game.getState().question;
        assert.equal(question.options.length, CHOICE_COUNT[level]);
        assert.equal(new Set(question.options.map(option => option.id)).size, question.options.length);
        assert.ok(question.options.some(option => option.id === question.answerId));
        targets.add(question.answerId);
        game.chooseTopic(topic);
      }
      assert.equal(targets.size, WORD_TOPICS[topic].words.length, `${topic} ${level} asks about every word`);
    }
  }
});

test('the same question is never asked twice in a row at any level', () => {
  for (const random of [steadyRandom, () => 0, () => 0.99, seededRandom(9)]) {
    const game = createGame(random);
    for (const level of LEVELS) {
      game.chooseLevel(level);
      for (const topic of TOPICS) {
        game.chooseTopic(topic);
        let previous = game.getState().question.key;
        const moves = [
          () => game.chooseTopic(topic),
          () => {
            answerCorrectly(game);
            if (game.getState().finished) game.restart();
            else game.nextQuestion();
          },
        ];
        for (let draw = 0; draw < 30; draw += 1) {
          moves[draw % moves.length]();
          const { key } = game.getState().question;
          assert.notEqual(key, previous, `${level} ${topic} does not repeat ${key}`);
          previous = key;
        }
      }
    }
  }
});

test('the level starts easy, and switching levels starts a fresh match at the new level', () => {
  const game = createGame(steadyRandom);
  assert.equal(game.getState().level, 'easy');
  answerCorrectly(game);
  assert.equal(game.chooseLevel('expert'), false);
  assert.equal(game.chooseLevel('easy'), false, 're-selecting the active level is a no-op');
  assert.equal(game.getState().stars, 1, 'the no-op keeps the in-progress match untouched');
  assert.equal(game.chooseLevel('harder'), true);
  const state = game.getState();
  assert.equal(state.level, 'harder');
  assert.equal(state.stars, 0, 'switching levels starts a fresh match');
  assert.equal(state.solved, false);
  assert.equal(state.finished, false);
  assert.equal(state.question.options.length, 4);
  assert.equal(state.goal, GOAL_BY_LEVEL.harder);
  assert.equal(state.rivalPower, GOAL_BY_LEVEL.harder);
  assert.equal(game.restart().level, 'harder');
  assert.equal(game.chooseLevel('super'), true);
  assert.equal(game.getState().goal, GOAL_BY_LEVEL.super);
  for (let star = 1; star <= GOAL_BY_LEVEL.super; star += 1) {
    if (star > 1) game.nextQuestion();
    answerCorrectly(game);
  }
  assert.equal(game.getState().finished, true);
  assert.equal(game.chooseLevel('easy'), false, 'the finish screen keeps its level');
});

test('switching down to a lower-goal level while stars are ahead of it resets the match instead of auto-finishing', () => {
  const game = createGame(steadyRandom);
  game.chooseLevel('super');
  for (let star = 1; star <= 4; star += 1) {
    if (star > 1) game.nextQuestion();
    answerCorrectly(game);
  }
  assert.equal(game.getState().stars, 4);
  assert.equal(game.getState().finished, false);

  assert.equal(game.chooseLevel('easy'), true);
  const state = game.getState();
  assert.equal(state.level, 'easy');
  assert.equal(state.stars, 0);
  assert.equal(state.goal, GOAL_BY_LEVEL.easy);
  assert.equal(state.rivalPower, GOAL_BY_LEVEL.easy);
  assert.equal(state.finished, false, 'the match does not auto-finish from stars earned at the old level');
});

test('switching up to a higher-goal level restarts the match at the new, larger goal', () => {
  const game = createGame(steadyRandom);
  answerCorrectly(game);
  assert.equal(game.getState().stars, 1);

  assert.equal(game.chooseLevel('super'), true);
  const state = game.getState();
  assert.equal(state.level, 'super');
  assert.equal(state.stars, 0);
  assert.equal(state.goal, GOAL_BY_LEVEL.super);
  assert.equal(state.rivalPower, GOAL_BY_LEVEL.super);
  assert.equal(state.finished, false);
});

test('the level buttons switch choices, goal markers, and the color prompt shows its swatch', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.startButton.click();
  const [easyButton, harderButton, superButton] = app.levelButtons;
  assert.equal(easyButton.getAttribute('aria-pressed'), 'true');
  assert.equal(app.answerOptions.children.length, 3);
  assert.equal(app.answerOptions.classList.contains('four-choices'), false);
  assert.equal(app.elements.get('#scoreStars').children.length, GOAL_BY_LEVEL.easy);

  harderButton.click();
  assert.equal(game.getState().level, 'harder');
  assert.equal(harderButton.getAttribute('aria-pressed'), 'true');
  assert.equal(easyButton.getAttribute('aria-pressed'), 'false');
  assert.equal(app.answerOptions.children.length, 4);
  assert.equal(app.answerOptions.classList.contains('four-choices'), true);
  assert.equal(app.elements.get('#scoreStars').children.length, GOAL_BY_LEVEL.harder);
  assert.equal(app.elements.get('#rivalPower').children.length, GOAL_BY_LEVEL.harder);

  superButton.click();
  assert.equal(game.getState().level, 'super');
  assert.equal(app.elements.get('#scoreStars').children.length, GOAL_BY_LEVEL.super);
  assert.ok(app.elements.get('#scoreStars').classList.contains('compact'));

  easyButton.click();
  app.topicTabs.find(tab => tab.dataset.topic === 'colors').click();
  const { question } = game.getState();
  const [swatch] = app.elements.get('#questionPicture').children;
  assert.equal(swatch.style.backgroundColor, question.pictureSwatch);
  assert.equal(app.elements.get('#questionPicture').classList.contains('dense-picture'), false);

  for (let star = 1; star <= GOAL_BY_LEVEL.easy; star += 1) {
    const answerId = game.getState().question.answerId;
    app.answerOptions.children.find(button => button.dataset.choice === answerId).click();
    if (star < GOAL_BY_LEVEL.easy) app.nextButton.click();
  }
  assert.ok(app.levelButtons.every(button => button.disabled), 'the level cannot change on the finish screen');
  app.elements.get('#playAgainButton').click();
  assert.ok(app.levelButtons.every(button => !button.disabled));
  assert.equal(game.getState().level, 'easy');
});

test('the finish message names the actual number of power moves for the chosen level, not just three', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.startButton.click();
  app.levelButtons.find(button => button.dataset.level === 'harder').click();
  const goal = GOAL_BY_LEVEL.harder;
  for (let star = 1; star <= goal; star += 1) {
    const answerId = game.getState().question.answerId;
    app.answerOptions.children.find(button => button.dataset.choice === answerId).click();
    if (star < goal) app.nextButton.click();
  }
  assert.equal(app.elements.get('#finishBody').textContent, I18N.finishBody(goal, 'en') + I18N.finishBody(goal, 'zh'), 'English pairs with 繁體中文 as the default second language');
  assert.match(app.elements.get('#finishBody').textContent, new RegExp(`^${goal} power moves`));

  const rewardNoteBefore = app.elements.get('#finishPanel').children.find(child => child.classList.contains('reward-note'));
  const rewardTitle = rewardNoteBefore.textContent.includes(I18N.STRINGS.rewardNewStickerTitle.en)
    ? I18N.STRINGS.rewardNewStickerTitle
    : I18N.STRINGS.rewardAnotherStickerTitle;
  passGate(app);
  app.document.querySelector('[data-second-language="ja"]').click();
  const rewardNote = app.elements.get('#finishPanel').children.find(child => child.classList.contains('reward-note'));
  assert.ok(rewardNote.textContent.includes(rewardTitle.ja), 'an existing finish reward note immediately uses the new second language');
});

test('harder hides the picture and shows the written word instead, in the chosen text language', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.startButton.click();
  app.levelButtons.find(button => button.dataset.level === 'harder').click();
  app.topicTabs.find(tab => tab.dataset.topic === 'fruit').click();

  const question = game.getState().question;
  const target = question.options.find(option => option.id === question.answerId);
  assert.equal(app.elements.get('#questionPicture').hidden, true, 'no picture at harder');
  assert.equal(app.elements.get('#questionWord').hidden, false);
  assert.equal(app.elements.get('#questionWord').textContent, target.en);
  assert.equal(app.elements.get('#questionPrompt').hidden, true, 'no revealing sentence at harder');

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  assert.equal(app.elements.get('#questionWord').textContent, target.zh);
});

test('super is listening-only: no picture and no written word while sound plays, with a written-word fallback when sound is off', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.startButton.click();
  app.levelButtons.find(button => button.dataset.level === 'super').click();
  app.topicTabs.find(tab => tab.dataset.topic === 'animals').click();

  const question = game.getState().question;
  const target = question.options.find(option => option.id === question.answerId);
  assert.equal(app.elements.get('#questionPicture').hidden, true);
  assert.equal(app.elements.get('#questionWord').hidden, true, 'the written word stays hidden while sound is on');
  assert.equal(app.elements.get('#questionPrompt').hidden, false);
  assert.doesNotMatch(app.elements.get('#questionPrompt').textContent, new RegExp(target.en, 'i'));

  app.muteButton.click();
  assert.equal(app.elements.get('#questionWord').hidden, false, 'muting falls back to the written word so it stays playable');
  assert.equal(app.elements.get('#questionWord').textContent, target.en);
  app.muteButton.click();
  assert.equal(app.elements.get('#questionWord').hidden, true, 'unmuting hides the written word again');
});

test('super math has no egg picture but always shows the equation', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.startButton.click();
  app.levelButtons.find(button => button.dataset.level === 'super').click();
  assert.equal(app.elements.get('#questionPicture').hidden, true);
  assert.equal(app.elements.get('#equation').hidden, false);
  assert.equal(app.elements.get('#questionWord').hidden, true, 'math has no written-word card');
});

test('the page reveals progressively: champion, then topic and level plus Start, then the arena', () => {
  const app = createAppFixture(createGame(steadyRandom));
  const pageShell = app.document.querySelector('.page-shell');
  assert.equal(pageShell.dataset.stage, 'champion');
  assert.equal(pageShell.dataset.pointer, 'champion', 'Rex/Bobo point at the champion picker first');
  assert.deepEqual(app.effects, ['chime'], 'the champion invitation uses the existing chime');

  app.championCards[1].click();
  assert.equal(pageShell.dataset.stage, 'choose', 'choosing a champion reveals the topic and level pickers');
  assert.equal(pageShell.dataset.pointer, 'start', 'then they point at Start');

  app.championCards[0].click();
  assert.equal(pageShell.dataset.stage, 'choose', 'switching champion again does not re-collapse the reveal');

  app.startButton.click();
  assert.equal(pageShell.dataset.stage, 'play', 'Start reveals the arena and the question');
  assert.equal(pageShell.dataset.pointer, 'answer', 'then they point at the answers');
});

function playMatchToFinish(app, game) {
  for (;;) {
    clickAnswer(app, game, true);
    if (game.getState().finished) return;
    app.nextButton.click();
  }
}

test('after 2 or 3 wins in a row, a soft break prompt offers one more round with no timer or loss', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.championCards[0].click();
  app.startButton.click();
  const pageShell = app.document.querySelector('.page-shell');
  const breakPrompt = app.elements.get('#breakPrompt');
  const oneMoreRoundButton = app.document.querySelector('#oneMoreRoundButton');
  const takeBreakButton = app.document.querySelector('#takeBreakButton');

  let nudged = false;
  for (let match = 0; match < 3 && !nudged; match += 1) {
    playMatchToFinish(app, game);
    assert.equal(game.getState().finished, true);
    nudged = !breakPrompt.hidden;
    if (!nudged) {
      assert.equal(app.elements.get('#playAgainButton').hidden, false);
      app.elements.get('#playAgainButton').click();
    }
  }
  assert.ok(nudged, 'the nudge fires by the 3rd consecutive win at the latest');
  assert.equal(app.elements.get('#playAgainButton').hidden, true, 'the break prompt replaces the single Play again button');
  assert.equal(oneMoreRoundButton.hidden, false);
  assert.equal(takeBreakButton.hidden, false);
  assert.equal(pageShell.dataset.pointer, 'break');

  oneMoreRoundButton.click();
  assert.equal(game.getState().finished, false, 'one more round starts a fresh, unfinished match');
  assert.equal(game.getState().stars, 0, 'nothing carries over as a loss');
});

test('taking a break shows a calm goodbye screen that can be left at any time, with nothing lost', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.championCards[0].click();
  app.startButton.click();
  const pageShell = app.document.querySelector('.page-shell');
  const breakPrompt = app.elements.get('#breakPrompt');
  const goodbyePanel = app.elements.get('#goodbyePanel');
  const takeBreakButton = app.document.querySelector('#takeBreakButton');
  const backToPlayButton = app.document.querySelector('#backToPlayButton');

  for (let match = 0; match < 3 && breakPrompt.hidden; match += 1) {
    playMatchToFinish(app, game);
    if (breakPrompt.hidden) app.elements.get('#playAgainButton').click();
  }
  assert.equal(breakPrompt.hidden, false);

  takeBreakButton.click();
  assert.equal(goodbyePanel.hidden, false, 'taking a break shows a calm goodbye screen');
  assert.equal(app.elements.get('#finishPanel').hidden, true);
  assert.equal(pageShell.dataset.pointer, 'goodbye');

  backToPlayButton.click();
  assert.equal(goodbyePanel.hidden, true, 'the goodbye screen can be left at any time');
  assert.equal(game.getState().finished, false, 'leaving the break starts a fresh, unfinished match — nothing was lost');
});

test('restarting after locking the finished level starts on the nearest allowed level', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.championCards[0].click();
  app.levelButtons.find(button => button.dataset.level === 'super').click();
  app.startButton.click();
  playMatchToFinish(app, game);
  app.document.querySelector('#takeBreakButton').click();

  app.elements.get('#settingsButton').click();
  const [a, b] = app.elements.get('#gateQuestion').textContent.match(/\d+/g).map(Number);
  app.elements.get('#gateInput').value = String(a + b);
  app.document.querySelector('#gateSubmitButton').click();
  const superLock = app.document.querySelector('[data-level-lock="super"]').querySelector('input');
  superLock.checked = false;
  superLock.dispatch('change');
  assert.equal(game.getState().level, 'super', 'the finished match does not change difficulty prematurely');
  app.document.querySelector('#settingsCloseButton').click();

  app.document.querySelector('#backToPlayButton').click();
  assert.equal(game.getState().finished, false);
  assert.equal(game.getState().level, 'harder', 'returning from the break never resumes on a locked level');
});

test('clearing rewards refreshes the visible grown-up progress summary', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.championCards[0].click();
  app.startButton.click();
  playMatchToFinish(app, game);

  app.elements.get('#settingsButton').click();
  const [a, b] = app.elements.get('#gateQuestion').textContent.match(/\d+/g).map(Number);
  app.elements.get('#gateInput').value = String(a + b);
  app.document.querySelector('#gateSubmitButton').click();
  const summary = app.elements.get('#settingsRewardSummary');
  assert.match(summary.textContent, /1 match/);

  app.document.querySelector('[data-reward-action="open"]').click();
  app.document.querySelector('[data-reward-action="reset"]').click();
  app.document.querySelector('[data-reward-action="confirm-reset"]').click();
  assert.match(summary.textContent, /0 match/);
});

test('external reward storage updates refresh the open grown-up progress summary', () => {
  const storage = new FakeLocalStorage();
  const game = createGame(steadyRandom);
  const app = createAppFixture(game, { localStorage: storage });
  app.championCards[0].click();
  app.startButton.click();
  playMatchToFinish(app, game);

  app.elements.get('#settingsButton').click();
  const [a, b] = app.elements.get('#gateQuestion').textContent.match(/\d+/g).map(Number);
  app.elements.get('#gateInput').value = String(a + b);
  app.document.querySelector('#gateSubmitButton').click();
  const summary = app.elements.get('#settingsRewardSummary');
  assert.match(summary.textContent, /1 match/);

  storage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, wins: 0, wearing: { dino: null, monster: null } }));
  app.dispatchWindowEvent('storage', { key: STORAGE_KEY });
  assert.match(summary.textContent, /0 match/);
});

test('a small grown-up settings area is gated by a math check, then offers a level lock, mute mirror, and progress summary', () => {
  const app = createAppFixture(createGame(steadyRandom));
  const settingsButton = app.elements.get('#settingsButton');
  const settingsGate = app.elements.get('#settingsGate');
  const settingsBody = app.elements.get('#settingsBody');
  const gateQuestion = app.elements.get('#gateQuestion');
  const gateInput = app.elements.get('#gateInput');
  const gateStatus = app.elements.get('#gateStatus');
  const gateSubmitButton = app.document.querySelector('#gateSubmitButton');

  settingsButton.click();
  assert.equal(settingsGate.hidden, false);
  assert.equal(settingsBody.hidden, true, 'a child cannot see settings without passing the gate');
  const [a, b] = gateQuestion.textContent.match(/\d+/g).map(Number);
  assert.ok(a >= 12 && b >= 14, 'the gate is two-digit addition, out of reach for a preschooler');

  gateInput.value = String(a + b + 1);
  gateSubmitButton.click();
  assert.equal(settingsBody.hidden, true, 'a wrong answer keeps settings hidden');
  assert.notEqual(gateStatus.textContent, '');

  const [a2, b2] = gateQuestion.textContent.match(/\d+/g).map(Number);
  gateInput.value = String(a2 + b2);
  gateSubmitButton.click();
  assert.equal(settingsGate.hidden, true);
  assert.equal(settingsBody.hidden, false, 'the correct answer reveals the settings panel');

  const superLock = app.document.querySelector('[data-level-lock="super"]');
  const easyLock = app.document.querySelector('[data-level-lock="easy"]');
  const harderLock = app.document.querySelector('[data-level-lock="harder"]');
  superLock.querySelector('input').checked = false;
  superLock.querySelector('input').dispatch('change');
  const superButton = app.levelButtons.find(button => button.dataset.level === 'super');
  assert.equal(superButton.hidden, true, 'locking a level hides it from the child\'s level picker');

  easyLock.querySelector('input').checked = false;
  easyLock.querySelector('input').dispatch('change');
  harderLock.querySelector('input').checked = false;
  harderLock.querySelector('input').dispatch('change');
  assert.equal(harderLock.querySelector('input').checked, true, 'unchecking the last remaining level is rejected, keeping at least one');
  assert.equal(app.levelButtons.find(button => button.dataset.level === 'harder').hidden, false);

  const settingsMuteButton = app.document.querySelector('#settingsMuteButton');
  assert.equal(settingsMuteButton.getAttribute('aria-pressed'), 'false');
  settingsMuteButton.click();
  assert.equal(app.muteButton.getAttribute('aria-pressed'), 'true', 'the settings mute mirrors the main mute button');

  assert.match(app.elements.get('#settingsRewardSummary').textContent, /0 match/);
});

test('pressing Enter on a correct grown-up answer waits for keyup before focusing Close', () => {
  const app = createAppFixture(createGame(steadyRandom));
  app.elements.get('#settingsButton').click();
  const gateQuestion = app.elements.get('#gateQuestion');
  const gateInput = app.elements.get('#gateInput');
  const settingsGate = app.elements.get('#settingsGate');
  const settingsBody = app.elements.get('#settingsBody');
  const settingsCloseButton = app.document.querySelector('#settingsCloseButton');
  let focusCalls = 0;
  settingsCloseButton.focus = () => { focusCalls += 1; };

  const [a, b] = gateQuestion.textContent.match(/\d+/g).map(Number);
  gateInput.value = String(a + b);
  let defaultPrevented = false;
  gateInput.dispatch('keydown', { key: 'Enter', preventDefault: () => { defaultPrevented = true; } });

  assert.equal(defaultPrevented, true, 'Enter\'s default action is suppressed so it cannot also trigger an implicit submission');
  assert.equal(settingsGate.hidden, true);
  assert.equal(settingsBody.hidden, false, 'a correct answer shows the settings instead of the dialog closing');
  assert.equal(focusCalls, 0, 'focus does not move while Enter remains held');
  app.document.dispatchEvent({ type: 'keyup', key: 'Enter' });
  assert.equal(focusCalls, 1, 'focus lands on Close after Enter is released');
  app.document.dispatchEvent({ type: 'keyup', key: 'x' });
  assert.equal(focusCalls, 1, 'the release listener removes itself after firing');
});

test('language option rebuilds keep keyboard focus on the selected second-language and voice options', () => {
  const app = createAppFixture(createGame(steadyRandom));
  passGate(app);

  let option = app.document.querySelector('[data-second-language="zh"]');
  option.focus();
  app.document.querySelector('[data-second-language="ja"]').click();
  assert.equal(app.document.activeElement, app.document.querySelector('[data-second-language="ja"]'));

  option = app.document.querySelector('[data-voice-option="match"]');
  option.focus();
  app.document.querySelector('[data-voice-option="ja"]').click();
  assert.equal(app.document.activeElement, app.document.querySelector('[data-voice-option="ja"]'));
});

test('pressing Enter on a wrong grown-up answer keeps the check open with a gentle message', () => {
  const app = createAppFixture(createGame(steadyRandom));
  app.elements.get('#settingsButton').click();
  const gateQuestion = app.elements.get('#gateQuestion');
  const gateInput = app.elements.get('#gateInput');
  const gateStatus = app.elements.get('#gateStatus');
  const settingsGate = app.elements.get('#settingsGate');
  const settingsBody = app.elements.get('#settingsBody');

  const [a, b] = gateQuestion.textContent.match(/\d+/g).map(Number);
  gateInput.value = String(a + b + 1);
  gateInput.dispatch('keydown', { key: 'Enter' });

  assert.equal(settingsGate.hidden, false, 'a wrong answer keeps the check open');
  assert.equal(settingsBody.hidden, true);
  assert.notEqual(gateStatus.textContent, '', 'a gentle message explains the wrong answer');
});

test('Cancel closes the settings dialog without answering the check', () => {
  const app = createAppFixture(createGame(steadyRandom));
  const settingsDialog = app.elements.get('#settingsDialog');
  const settingsGate = app.elements.get('#settingsGate');
  app.elements.get('#settingsButton').click();
  assert.equal(settingsDialog.getAttribute('open'), '', 'opening the settings shows the dialog');

  app.document.querySelector('#gateCancelButton').click();
  assert.equal(settingsDialog.getAttribute('open'), null, 'Cancel closes the dialog');

  app.elements.get('#settingsButton').click();
  assert.equal(settingsGate.hidden, false, 'reopening starts back at the check, not mid-answer');
});

test('every Japanese UI string is written entirely in hiragana, with no katakana or kanji', () => {
  const KATAKANA = /[ァ-ヺ]/;
  const KANJI = /[一-鿿]/;
  const checked = [];
  function checkJa(label, text) {
    checked.push(label);
    assert.doesNotMatch(text, KATAKANA, `${label} has no katakana: ${text}`);
    assert.doesNotMatch(text, KANJI, `${label} has no kanji: ${text}`);
  }

  for (const [key, value] of Object.entries(I18N.STRINGS)) {
    checkJa(`STRINGS.${key}`, value.ja);
  }
  for (const [key, value] of Object.entries(I18N.TOPIC_NAMES)) checkJa(`TOPIC_NAMES.${key}`, value.ja);
  for (const [key, value] of Object.entries(I18N.LEVEL_NAMES)) checkJa(`LEVEL_NAMES.${key}`, value.ja);
  for (const [championId, champion] of Object.entries(I18N.CHAMPIONS)) {
    for (const field of ['name', 'shortName', 'move', 'buddyShortName']) {
      checkJa(`CHAMPIONS.${championId}.${field}`, champion[field].ja);
    }
    checkJa(`championReady(${championId})`, I18N.championReady(championId, 'ja'));
    for (const finished of [false, true]) {
      checkJa(`sparMessage(${championId},${finished})`, I18N.sparMessage(championId, finished, '', 'ja'));
    }
  }
  for (const topic of TOPICS) checkJa(`topicChosenMessage(${topic})`, I18N.topicChosenMessage(topic, 'ja'));
  for (const level of LEVELS) checkJa(`levelChosenMessage(${level})`, I18N.levelChosenMessage(level, 'ja'));
  for (const goal of Object.values(GOAL_BY_LEVEL)) checkJa(`finishBody(${goal})`, I18N.finishBody(goal, 'ja'));
  for (const topic of WORD_TOPIC_IDS) {
    for (const word of WORD_TOPICS[topic].words) checkJa(`${topic}-${word.id}.ja`, word.ja);
  }
  checkJa('arena comboText', comboText(4, 'ja'));
  for (const sticker of STICKERS) checkJa(`STICKERS.${sticker.id}.ja`, sticker.ja);
  for (const costume of COSTUMES) checkJa(`COSTUMES.${costume.id}.ja`, costume.ja);
  checkJa('settingsWinsSummary(3)', I18N.settingsWinsSummary(3, 'ja'));
  checkJa('settingsStickerSummary(2,12)', I18N.settingsStickerSummary(2, 12, 'ja'));
  checkJa('rewardBookIntroWins(3)', I18N.rewardBookIntroWins(3, 'ja'));
  checkJa('stickerStillToFind(1)', I18N.stickerStillToFind(1, 'ja'));
  checkJa('costumeWinsToGo(2)', I18N.costumeWinsToGo(2, 'ja'));
  checkJa('costumeSurpriseHint', I18N.costumeSurpriseHint(I18N.CHAMPIONS.dino.shortName.ja, 'ja'));
  checkJa('costumeRowLabel', I18N.costumeRowLabel(I18N.CHAMPIONS.dino.shortName.ja, 'ja'));
  checkJa('nextSurpriseHint', I18N.nextSurpriseHint(COSTUMES[0].ja, 2, 'ja'));
  checkJa('rewardSummaryPattern(2,12)', I18N.rewardSummaryPattern(2, 12, 'ja'));
  checkJa('rewardUnlockText', I18N.rewardUnlockText(I18N.CHAMPIONS.dino.shortName.ja, COSTUMES[0].ja, 'ja'));
  assert.ok(checked.length > 30, 'the sweep actually covered the UI surface');
});

test('the game title and ready message are localized from the very first render, before any click', () => {
  const storage = new FakeLocalStorage();
  storage.setItem('monsterWordArena.settings.v1', JSON.stringify({ v: 2, textLanguage: 'zh', secondLanguage: null, voiceOverride: false, voiceLanguage: 'zh' }));
  const app = createAppFixture(createGame(steadyRandom), { localStorage: storage });
  assert.equal(app.elements.get('#gameTitle').textContent, I18N.STRINGS.gameTitle.zh);
  assert.equal(app.elements.get('#arenaMessage').textContent, I18N.STRINGS.readyMessage.zh);
});

test('the on-screen text language switches every child-facing string and, by default, the spoken voice with it', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.topicTabs.find(tab => tab.dataset.topic === 'fruit').click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  assert.equal(app.elements.get('#championHeading').textContent, I18N.STRINGS.championHeading.zh);
  assert.equal(app.elements.get('#answerHint').textContent, I18N.STRINGS.answerHint.zh);
  assert.match(app.elements.get('#questionPrompt').textContent, /[㐀-鿿]/);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/zh\//, 'the language choice is also the sound-on gesture and sets the voice');
  const question = game.getState().question;
  const target = question.options.find(option => option.id === question.answerId);
  assert.equal(app.answerOptions.children.find(button => button.dataset.choice === target.id).children[1].textContent, target.zh);

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  assert.equal(app.elements.get('#championHeading').textContent, I18N.STRINGS.championHeading.ja);
  assert.doesNotMatch(app.elements.get('#championHeading').textContent, /[ァ-ヺ]/, 'Japanese chrome text has no katakana');
  assert.doesNotMatch(app.elements.get('#championHeading').textContent, /[一-鿿]/, 'Japanese chrome text has no kanji');
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/ja\//, 'the voice follows the language too');
  // The reward bar and sticker book are wired up by rewards-app.js, a separate script — this
  // guards against it silently staying in whatever language it started in (a real regression
  // caught in manual browser testing: it needs app.js to tell it about every language change).
  assert.ok(app.elements.get('#rewardSummary').textContent.startsWith(I18N.rewardSummaryPattern(0, 12, 'ja')), 'the reward bar follows the text language too');
  assert.match(app.elements.get('#stickerBookButton').textContent, /^📒/, 'the sticker book button still renders');
  assert.ok(app.elements.get('#stickerBookButton').textContent.includes(I18N.STRINGS.stickerBookButton.ja));

  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/en\//, 'switching to English switches the voice back too');
  assert.equal(app.elements.get('#championHeading').textContent, I18N.STRINGS.championHeading.en);
});

test('speech player replaces stale clips, ignores stale failures, and stops on mute', async () => {
  const pending = [];
  const audio = {
    pauseCount: 0,
    loadCount: 0,
    pause() { this.pauseCount += 1; },
    load() { this.loadCount += 1; },
    play() {
      return new Promise((_resolve, reject) => { pending.push(reject); });
    },
  };
  let unavailable = 0;
  const player = createSpeechPlayer(audio, () => { unavailable += 1; });

  assert.equal(player.play('math-1-1', 'en'), true);
  const firstClip = audio.src;
  assert.equal(firstClip, './audio/en/math-1-1.mp3');
  assert.equal(player.play('family-sister', 'zh'), true);
  assert.equal(audio.src, './audio/zh/family-sister.mp3');
  assert.equal(player.play('family-sister', 'ja'), true);
  assert.equal(audio.src, './audio/ja/family-sister.mp3');
  assert.equal(audio.pauseCount, 3);
  pending[0](new Error('stale English clip failed'));
  pending[1](new Error('stale Chinese clip failed'));
  await Promise.resolve();
  assert.equal(unavailable, 0, 'rapid language switches ignore stale clip failures');

  player.stop();
  pending[2](new Error('stopped clip failed'));
  await Promise.resolve();
  assert.equal(unavailable, 0, 'a muted or stopped clip cannot report a stale error');
  assert.equal(audio.pauseCount, 4);
  assert.equal(audio.currentTime, 0);
  assert.equal(player.play('math-1-1', 'xx'), false);
  assert.equal(unavailable, 1, 'unsupported language fails safely');
});

test('speech remains optional when the browser has no audio player', () => {
  let unavailable = 0;
  const player = createSpeechPlayer(null, () => { unavailable += 1; });
  assert.equal(player.play('math-1-1', 'en'), false);
  assert.equal(unavailable, 1);
  assert.doesNotThrow(() => player.stop());
});

test('reactions stay silent before Start, then follow the chosen voice', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  clickAnswer(app, game, false);
  clickAnswer(app, game, true);
  assert.deepEqual(app.played, [], 'no reaction before Start, a language, replay, or unmute');
  assert.equal(app.startRow.hidden, false);

  app.nextButton.click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  assert.equal(app.startRow.hidden, true, 'a language choice turns on the questions and cheers together');
  clickAnswer(app, game, false);
  clickAnswer(app, game, false);
  clickAnswer(app, game, true);
  app.nextButton.click();
  clickAnswer(app, game, true);
  assert.equal(game.getState().finished, true, 'the silent correct answer before any language choice already counted a star');
  const questionId = () => /\/(math-\d-\d)\.mp3$/;
  assert.deepEqual(app.played.map(src => src.replace(questionId(), '/<question>.mp3')), [
    './audio/zh/<question>.mp3',
    './audio/zh/reaction-try-again-1.mp3',
    './audio/zh/reaction-try-again-2.mp3',
    './audio/zh/reaction-praise-1.mp3',
    './audio/zh/<question>.mp3',
    './audio/zh/reaction-finish-1.mp3',
  ]);
});

test('a reaction never outlives the moment it belongs to', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const last = () => app.played[app.played.length - 1];
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();

  clickAnswer(app, game, true);
  assert.match(last(), /reaction-praise-1/);
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  assert.match(last(), /^\.\/audio\/ja\/math-/, 'switching language replaces the reaction with the question');

  app.nextButton.click();
  clickAnswer(app, game, false);
  assert.match(last(), /ja\/reaction-try-again-1/);
  const pausesBeforeChampion = app.audioState.pauses;
  app.championCards.find(card => card.dataset.champion === 'monster').click();
  assert.ok(app.audioState.pauses > pausesBeforeChampion, 'switching champion stops the reaction');
  const pausesAfterChampion = app.audioState.pauses;
  app.championCards.find(card => card.dataset.champion === 'dino').click();
  assert.equal(app.audioState.pauses, pausesAfterChampion, 'switching champion leaves question narration alone');

  clickAnswer(app, game, false);
  app.topicTabs.find(tab => tab.dataset.topic === 'colors').click();
  assert.match(last(), /^\.\/audio\/ja\/colors-/, 'switching topic replaces the reaction with the new question');

  clickAnswer(app, game, true);
  assert.match(last(), /reaction-praise/);
  app.elements.get('#restartButton').click();
  assert.match(last(), /^\.\/audio\/ja\/colors-/, 'restarting replaces the reaction with the new question');

  const count = app.played.length;
  app.muteButton.click();
  clickAnswer(app, game, false);
  clickAnswer(app, game, true);
  assert.equal(app.played.length, count, 'muted reactions stay silent');
  app.muteButton.click();
  assert.match(last(), /^\.\/audio\/ja\/colors-/, 'unmuting speaks the question, not a stale reaction');
});

test('the finish cheer stops when the language changes on the finish screen', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();
  for (let star = 1; star <= GOAL_BY_LEVEL.easy; star += 1) {
    clickAnswer(app, game, true);
    if (star < GOAL_BY_LEVEL.easy) app.nextButton.click();
  }
  assert.match(app.played[app.played.length - 1], /en\/reaction-finish-1/);
  const count = app.played.length;
  const pauses = app.audioState.pauses;
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  assert.equal(app.played.length, count);
  assert.ok(app.audioState.pauses > pauses);
});

function readWebp(file) {
  const art = fs.readFileSync(path.join(__dirname, file));
  assert.equal(art.toString('latin1', 0, 4), 'RIFF', `${file} is a RIFF file`);
  assert.equal(art.toString('latin1', 8, 16), 'WEBPVP8X', `${file} is an extended WebP`);
  assert.ok(art[20] & 0x10, `${file} has a transparent alpha channel`);
  return { bytes: art.length, width: art.readUIntLE(24, 3) + 1, height: art.readUIntLE(27, 3) + 1 };
}

test('champion pose sheets and arena sprites are bundled original art sized for a phone page', () => {
  const expected = {
    './images/champion-rex.webp': [256 * POSES.length, 256, 64],
    './images/champion-bobo.webp': [256 * POSES.length, 256, 64],
    './images/arena-star.webp': [96, 96, 8],
    './images/arena-swish.webp': [128, 128, 16],
    './images/arena-bubbles.webp': [128, 128, 16],
    './images/arena-trophy.webp': [192, 192, 16],
  };
  assert.deepEqual([...ART].sort(), Object.keys(expected).sort());
  let totalBytes = 0;
  for (const [file, [width, height, maxKb]] of Object.entries(expected)) {
    const art = readWebp(file);
    assert.equal(art.width, width, `${file} width`);
    assert.equal(art.height, height, `${file} height`);
    assert.ok(art.bytes < maxKb * 1024, `${file} stays under ${maxKb} KB`);
    totalBytes += art.bytes;
  }
  assert.ok(totalBytes < 160 * 1024, 'all arena art together stays light for a phone');
});

test('a right answer plays the power move, then the buddy wobbles and giggles as stars fly', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const stage = app.elements.get('#arenaStage');
  const effects = app.elements.get('#stageEffects');
  assert.equal(app.elements.get('#comboCount').textContent, '0');
  assert.equal(poses(app), 'ready/ready');
  assert.equal(app.elements.get('#moveBubble').dataset.move, 'swish');

  clickAnswer(app, game);
  assert.equal(poses(app), 'power/ready');
  assert.ok(stage.classList.contains('do-spar'));
  app.clock.tick(TIMING.land);
  assert.equal(poses(app), 'power/giggle');
  assert.equal(effects.children.length, 7);
  assert.ok(effects.children.every(star => star.className === 'burst-star'));
  app.clock.tick(TIMING.settle - TIMING.land);
  assert.equal(poses(app), 'ready/ready');
  assert.equal(stage.classList.contains('do-spar'), false);

  app.nextButton.click();
  assert.equal(effects.children.length, 0, 'the next question starts on a calm stage');
});

test('a miss is a pillow block with no penalty that quietly restarts the right-in-a-row combo', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const combo = app.elements.get('#comboBadge');
  const message = app.elements.get('#arenaMessage');

  clickAnswer(app, game);
  assert.equal(combo.classList.contains('is-shown'), false, 'one right answer is not a streak yet');
  assert.doesNotMatch(message.textContent, /in a row/);
  app.nextButton.click();
  clickAnswer(app, game);
  assert.ok(combo.classList.contains('is-shown'));
  assert.equal(app.elements.get('#comboCount').textContent, '2');
  assert.match(message.textContent, /2 in a row!$/);

  app.nextButton.click();
  clickAnswer(app, game, false);
  assert.equal(poses(app), 'ready/block');
  assert.ok(app.elements.get('#arenaStage').classList.contains('thinking'));
  assert.equal(combo.classList.contains('is-shown'), false);
  assert.match(message.textContent, /Pillow block/);
  assert.equal(game.getState().stars, 2, 'a miss never takes a star away');
  app.clock.tick(TIMING.blockSettle);
  assert.equal(poses(app), 'ready/ready');

  clickAnswer(app, game);
  assert.doesNotMatch(message.textContent, /in a row/, 'the streak counts again from the next right answer');
  assert.equal(comboText(1, 'en'), '');
  assert.equal(comboText(4, 'en'), '4 in a row!');
  assert.equal(comboText(4, 'zh'), '連續答對 4 題！');
});

test('the winning answer ends with the buddy bowing and a shared high-five under falling stars', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const stage = app.elements.get('#arenaStage');
  const effects = app.elements.get('#stageEffects');
  const goal = GOAL_BY_LEVEL.easy;
  for (let star = 1; star <= goal; star += 1) {
    clickAnswer(app, game);
    if (star < goal) app.nextButton.click();
  }
  assert.equal(game.getState().finished, true);
  assert.match(app.elements.get('#arenaMessage').textContent, /bow and high-five!/);
  app.clock.tick(TIMING.bow);
  assert.equal(poses(app), 'ready/bow');
  assert.ok(stage.classList.contains('is-bowing'));
  app.clock.tick(TIMING.highFive - TIMING.bow);
  assert.equal(poses(app), 'high5/high5');
  assert.ok(stage.classList.contains('is-victory'));
  assert.equal(stage.classList.contains('is-bowing'), false);
  assert.equal(effects.children.length, 13);
  assert.ok(effects.children.slice(0, 12).every(star => star.className === 'shower-star'));
  assert.equal(effects.children[12].className, 'high-five-pop');
  app.clock.tick(10000);
  assert.equal(poses(app), 'high5/high5', 'the champions keep their high-five until play again');

  app.elements.get('#playAgainButton').click();
  assert.equal(poses(app), 'ready/ready');
  assert.equal(stage.classList.contains('is-victory'), false);
  assert.equal(effects.children.length, 0);
  assert.equal(app.elements.get('#comboBadge').classList.contains('is-shown'), false);
  assert.equal(app.elements.get('#comboCount').textContent, '0');
  clickAnswer(app, game);
  assert.doesNotMatch(app.elements.get('#arenaMessage').textContent, /in a row/);
  assert.equal(app.elements.get('#comboCount').textContent, '1');
  app.nextButton.click();
  clickAnswer(app, game);
  assert.match(app.elements.get('#arenaMessage').textContent, /2 in a row!/);

  app.elements.get('#restartButton').click();
  assert.equal(app.elements.get('#comboBadge').classList.contains('is-shown'), false);
  assert.equal(app.elements.get('#comboCount').textContent, '0');
  clickAnswer(app, game);
  assert.doesNotMatch(app.elements.get('#arenaMessage').textContent, /in a row/);
  assert.equal(app.elements.get('#comboCount').textContent, '1');
});

test('choosing a champion swaps both fighters and the power move art', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const heroArt = app.elements.get('#heroArt');
  const buddyArt = app.elements.get('#buddyArt');
  assert.deepEqual([heroArt.dataset.character, buddyArt.dataset.character], ['dino', 'monster']);

  app.championCards.find(card => card.dataset.champion === 'monster').click();
  assert.deepEqual([heroArt.dataset.character, buddyArt.dataset.character], ['monster', 'dino']);
  assert.equal(app.elements.get('#moveBubble').dataset.move, 'bubbles');
  assert.equal(app.elements.get('#moveBubble').textContent, '🫧', 'the emoji move stays as the fallback');
  assert.equal(app.elements.get('#heroEmoji').textContent, '👾');
  assert.match(app.elements.get('#arenaMessage').textContent, /Bobo/);
  assert.ok(app.elements.get('#arenaStage').classList.contains('do-ready'));
});

test('reduced motion keeps every pose but skips the flying stars', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game, { matchMedia: query => ({ matches: query === '(prefers-reduced-motion: reduce)' }) });
  for (let star = 1; star <= GOAL_BY_LEVEL.easy; star += 1) {
    clickAnswer(app, game);
    app.clock.tick(TIMING.land);
    assert.equal(poses(app), 'power/giggle');
    assert.equal(app.elements.get('#stageEffects').children.length, 0);
    if (star < GOAL_BY_LEVEL.easy) app.nextButton.click();
  }
  app.clock.tick(TIMING.highFive);
  assert.equal(poses(app), 'high5/high5');
  assert.equal(app.elements.get('#stageEffects').children.length, 0);
});

function imageThatFires(outcome, requested) {
  return class {
    constructor() {
      this.listeners = [];
    }

    addEventListener(type, callback) {
      this.listeners.push([type, callback]);
    }

    set src(source) {
      requested.push(source);
      this.listeners.filter(([type]) => type === outcome).forEach(([, callback]) => callback());
    }
  };
}

test('champions and star effects fall back when the arena pictures cannot load', () => {
  const missing = [];
  const game = createGame(steadyRandom);
  const app = createAppFixture(game, { Image: imageThatFires('error', missing) });
  assert.deepEqual(missing, ART);
  assert.ok(app.document.documentElement.classList.contains('no-champion-art'));

  clickAnswer(app, game);
  app.clock.tick(TIMING.land);
  assert.ok(app.elements.get('#stageEffects').children.every(star => star.textContent === '★'));
  app.nextButton.click();
  clickAnswer(app, game);
  app.nextButton.click();
  clickAnswer(app, game);
  app.clock.tick(TIMING.highFive);
  const victoryStars = app.elements.get('#stageEffects').children;
  assert.equal(victoryStars.filter(star => star.className === 'shower-star').length, 12);
  assert.equal(victoryStars.filter(star => star.className === 'high-five-pop').length, 1);
  assert.ok(victoryStars.every(star => star.textContent === '★'));

  const found = [];
  const loaded = createAppFixture(createGame(steadyRandom), { Image: imageThatFires('load', found) });
  assert.deepEqual(found, ART);
  assert.equal(loaded.document.documentElement.classList.contains('no-champion-art'), false);
});

test('sound effects are synthesized locally with no files, network, or speech element', () => {
  // A bare page with Web Audio only: no fetch, XMLHttpRequest, Audio element, or timers of its own.
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'sounds.js'), 'utf8'), { window });
  let ctx = null;
  const timers = createFakeTimers();
  const board = window.FriendlyArenaSounds.createSoundBoard(() => { ctx = new FakeAudioContext(); return ctx; }, timers);
  for (const name of EFFECTS) {
    assert.equal(board.play(name), true, `${name} plays`);
    ctx.currentTime += 2;
  }
  board.setMusic(true);
  for (const loop of timers.timers.values()) loop();
  assert.equal(board.getState().musicPlaying, true);
  assert.ok(ctx.sources.length > EFFECTS.length);
  assert.ok(ctx.sources.every(source => source.startTime !== undefined), 'every sound is an oscillator or generated noise');
  assert.deepEqual(EFFECTS, ['tap', 'sparkle', 'whoosh', 'boing', 'giggle', 'cheer', 'chime']);
  assert.ok(EFFECT_LEVEL <= 0.4, 'effects stay well under the narration level');
  assert.ok(MUSIC_LEVEL < EFFECT_LEVEL, 'background music is quieter than the effects');
});

test('the sound board waits for a sound, keeps music off by default, and stays silent without Web Audio', () => {
  const test = createTestBoard();
  assert.equal(test.ctx, null, 'no audio context exists before the first sound');
  assert.equal(test.board.getState().musicOn, false);

  assert.equal(test.board.play('tap'), true);
  assert.ok(test.ctx.resumed >= 1, 'a child tap wakes a suspended audio context');
  assert.deepEqual(test.buses, { master: 1, effects: EFFECT_LEVEL, music: 0 });
  assert.equal(test.timers.timers.size, 0, 'no music loop runs until music is chosen');
  for (const name of EFFECTS) {
    test.ctx.currentTime += 2;
    assert.equal(test.board.play(name), true, `${name} plays`);
  }
  const resumed = test.ctx.resumed;
  test.ctx.state = 'interrupted';
  test.ctx.currentTime += 2;
  assert.equal(test.board.play('tap'), true);
  assert.equal(test.ctx.resumed, resumed + 1, 'a tap wakes an audio context a phone call interrupted');
  assert.equal(test.board.play('roar'), false, 'unknown effects are ignored');

  for (const makeContext of [null, () => { throw new Error('no Web Audio'); }]) {
    const silent = createSoundBoard(makeContext, createFakeTimers());
    assert.equal(silent.play('cheer'), false);
    assert.doesNotThrow(() => { silent.setMusic(true); silent.setMuted(true); silent.setSpeaking(true); silent.setHidden(true); });
    assert.equal(silent.getState().available, false);
  }
});

test('rapid tapping retriggers an effect instead of piling copies up', () => {
  const test = createTestBoard();
  assert.equal(test.board.play('boing'), true);
  const afterOne = test.ctx.sources.length;
  for (let i = 0; i < 10; i += 1) assert.equal(test.board.play('boing'), false, 'repeats inside the gap are dropped');
  assert.equal(test.ctx.sources.length, afterOne);

  test.ctx.currentTime += 0.31;
  assert.equal(test.board.play('boing'), true);
  assert.equal(test.board.getState().voices, 1, 'a retriggered boing replaces the one still ringing');

  for (const name of ['tap', 'sparkle', 'whoosh', 'giggle', 'cheer', 'chime']) assert.equal(test.board.play(name), true, `${name} is never crowded out`);
  assert.equal(test.board.getState().voices, EFFECTS.length);
  test.ctx.currentTime += 1.1;
  for (const name of EFFECTS) assert.equal(test.board.play(name), true);
  assert.equal(test.board.getState().voices, EFFECTS.length, 'each effect rings at most once at a time');
  test.ctx.currentTime += 5;
  test.board.play('tap');
  assert.equal(test.board.getState().voices, 1, 'finished effects are released');
});

test('mute silences effects and music, and narration ducks both', () => {
  const test = createTestBoard();
  test.board.setMusic(true);
  assert.equal(test.timers.timers.size, 1, 'choosing music starts the gentle loop');
  assert.deepEqual(test.buses, { master: 1, effects: EFFECT_LEVEL, music: MUSIC_LEVEL });
  const [loop] = test.timers.timers.values();
  const before = test.ctx.sources.length;
  test.ctx.currentTime += 1;
  loop();
  assert.ok(test.ctx.sources.length > before, 'the loop keeps scheduling notes ahead');

  test.board.setSpeaking(true);
  assert.ok(test.buses.effects < EFFECT_LEVEL && test.buses.music < MUSIC_LEVEL, 'speech gets the spotlight');
  test.board.setSpeaking(false);
  assert.deepEqual(test.buses, { master: 1, effects: EFFECT_LEVEL, music: MUSIC_LEVEL });

  test.board.setMuted(true);
  assert.equal(test.buses.master, 0);
  assert.equal(test.timers.timers.size, 0, 'mute stops the music loop');
  const silentCount = test.ctx.sources.length;
  test.ctx.currentTime += 2;
  assert.equal(test.board.play('cheer'), false);
  assert.equal(test.ctx.sources.length, silentCount, 'a muted board makes no sound at all');
  test.board.setMuted(false);
  assert.equal(test.buses.master, 1);
  assert.equal(test.timers.timers.size, 1, 'unmuting brings the chosen music back');

  test.board.setHidden(true);
  assert.equal(test.timers.timers.size, 0, 'a hidden page stops the music loop');
  test.board.setHidden(false);
  assert.equal(test.timers.timers.size, 1);
  test.board.setMusic(false);
  assert.equal(test.timers.timers.size, 0);
  assert.equal(test.buses.music, 0);
  test.board.setHidden(false);
  assert.equal(test.timers.timers.size, 0, 'showing the page never starts music that is off');
});

test('quickly restarting music carries on the queued tune instead of layering a second one', () => {
  const test = createTestBoard();
  test.board.setMusic(true);
  const restarts = [
    () => { test.board.setMusic(false); test.board.setMusic(true); },
    () => { test.board.setMuted(true); test.board.setMuted(false); },
    () => { test.board.setHidden(true); test.board.setHidden(false); },
  ];
  for (const restart of restarts) {
    test.ctx.currentTime += 0.2;
    restart();
  }
  const musicBus = test.ctx.gains[2];
  const notes = test.ctx.sources.filter(source => source.connections[0].connections.includes(musicBus));
  const starts = [...new Set(notes.map(note => note.startTime))].sort((a, b) => a - b);
  const beats = starts.slice(1).map((time, index) => time - starts[index]);
  assert.ok(beats.length >= 3, 'each restart keeps the tune going');
  assert.ok(beats.every(beat => Math.abs(beat - beats[0]) < 1e-9), 'every note lands on one steady beat');
});

test('the game plays gentle effects from the child\'s own taps without a voice choice', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  assert.deepEqual(app.effects, ['chime'], 'the champion invitation is the only sound before the child taps');

  clickAnswer(app, game, false);
  assert.deepEqual(app.effects, ['chime', 'tap', 'boing'], 'a miss is a soft pillow boing, and the invitation chime is not crowded by another prompt');
  app.later();
  clickAnswer(app, game, true);
  assert.deepEqual(app.effects.slice(3), ['tap', 'sparkle', 'whoosh', 'giggle', 'chime'], 'a right answer sparkles, whooshes, and giggles');
  assert.deepEqual(app.played, [], 'effects never play through the speech element or start narration');

  for (let star = 2; star <= GOAL_BY_LEVEL.easy; star += 1) {
    app.later();
    app.nextButton.click();
    app.later();
    clickAnswer(app, game, true);
  }
  assert.equal(game.getState().finished, true);
  assert.deepEqual(app.effects.slice(-4), ['sparkle', 'whoosh', 'cheer', 'chime'], 'the win ends with a cheer');
});

test('music is off by default, has its own toggle, and the mute button silences everything', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  assert.equal(app.musicButton.getAttribute('aria-pressed'), 'false');

  app.musicButton.click();
  assert.equal(app.musicButton.getAttribute('aria-pressed'), 'true');
  assert.equal(app.sound.board.getState().musicPlaying, true);
  assert.deepEqual(app.played, [], 'music does not start narration');

  app.muteButton.click();
  assert.equal(app.sound.board.getState().musicPlaying, false, 'mute stops the music');
  const effectsBeforeMutedAnswer = app.effects.length;
  clickAnswer(app, game, true);
  assert.equal(app.effects.length, effectsBeforeMutedAnswer, 'mute silences the effects');
  app.musicButton.click();
  app.musicButton.click();
  assert.match(app.elements.get('#speechStatus').textContent, /muted|靜音|ミュート/i);
  assert.equal(app.sound.board.getState().musicPlaying, false, 'music waits for unmute');

  app.muteButton.click();
  assert.equal(app.sound.board.getState().musicPlaying, true, 'unmute brings the chosen music back');
  app.musicButton.click();
  assert.equal(app.musicButton.getAttribute('aria-pressed'), 'false');
  assert.equal(app.sound.board.getState().musicPlaying, false);
});

test('effects and music duck under narration without touching the speech clip', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.musicButton.click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();
  const [speech] = app.audioElements;
  speech.dispatch('playing');
  assert.equal(app.sound.board.getState().speaking, true);
  clickAnswer(app, game, false);
  assert.deepEqual(app.effects, ['chime', 'tap', 'boing'], 'the initial invitation chime is not crowded by another prompt');
  assert.match(speech.src, /\/en\/reaction-try-again-1\.mp3$/, 'a miss effect never replaces the try-again reaction clip');
  speech.dispatch('ended');
  assert.equal(app.sound.board.getState().speaking, false);
});
