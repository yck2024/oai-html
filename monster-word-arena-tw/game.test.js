'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');
const { GOAL_BY_LEVEL, HEARTS_BY_LEVEL, CHOICE_COUNT, TOPICS, LEVELS, WORD_TOPICS, REACTIONS, createGame, createSpeechPlayer } = require('./game.js');
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

// A wrong tap ends the question; the game shows the right choice for a moment, then loads a new question.
const MISS_PAUSE_TICK = 4000;

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

test('easy sums and take-aways stay within five and offer three distinct choices', () => {
  const game = createGame(steadyRandom);
  for (let index = 0; index < 3; index += 1) {
    const question = game.getState().question;
    const [left, right] = question.display.split(' = ?')[0].split(/ [+−] /).map(Number);
    const answer = question.display.includes('+') ? left + right : left - right;
    assert.ok(Math.max(left, right, answer) <= 5);
    assert.equal(question.answerId, String(answer));
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

test('a word question never shows its answer\'s picture, and only Super adds words back onto the choices', () => {
  for (const seed of [0, 0.4, 0.99]) {
    const game = createGame(() => seed);
    for (const level of LEVELS) {
      game.chooseLevel(level);
      for (const topic of WORD_TOPIC_IDS) {
        game.chooseTopic(topic);
        const question = game.getState().question;
        assert.equal(question.picture, '', `${level} ${topic} shows no picture with the question`);
        assert.equal(question.pictureImage, undefined);
        assert.equal(question.pictureSwatch, undefined);
        assert.equal(question.wordLabels, level === 'super', `${level} ${topic} labels its choices only at super`);
        assert.ok(question.options.every(option => option.icon || option.swatch), 'every choice has a picture or swatch to show');
      }
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

test('each correct answer knocks one pip off the sparring buddy', () => {
  const game = createGame(steadyRandom);
  const goal = GOAL_BY_LEVEL.easy;
  assert.equal(game.getState().rivalPower, goal);
  for (let hit = 1; hit <= goal; hit += 1) {
    if (hit > 1) game.nextQuestion();
    answerCorrectly(game);
    assert.equal(game.getState().rivalPower, goal - hit);
  }
  assert.equal(game.restart().rivalPower, goal);
});

function wrongOption(game) {
  const { question } = game.getState();
  return question.options.find(option => option.id !== question.answerId);
}

test('a wrong answer ends the question, takes a heart and a star back (never below zero), and a fresh question follows', () => {
  const game = createGame(steadyRandom);
  const first = game.getState().question;
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.easy);
  assert.equal(game.answer(wrongOption(game).id), 'missed');
  let state = game.getState();
  assert.equal(state.stars, 0, 'no star to lose yet, so it stays at zero');
  assert.equal(state.starLost, false);
  assert.equal(state.hearts, HEARTS_BY_LEVEL.easy - 1, 'but a wrong tap always costs a heart');
  assert.equal(state.heartLost, true);
  assert.equal(state.missed, true);
  assert.equal(state.solved, false);
  assert.equal(state.feedback, 'missed');
  assert.equal(game.answer(first.answerId), 'ignored', 'the ended question cannot be answered again, even correctly');
  assert.equal(game.answer(wrongOption(game).id), 'ignored', 'and a second tap cannot take another star or heart');
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.easy - 1);
  assert.equal(game.nextQuestion(), true);
  state = game.getState();
  assert.notEqual(state.question.key, first.key, 'a fresh question, never the same one');
  assert.equal(state.missed, false);
  assert.equal(state.heartLost, false, 'the flag belongs to the miss only');
  assert.equal(state.hearts, HEARTS_BY_LEVEL.easy - 1, 'a lost heart stays lost for the rest of the match');
  assert.equal(answerCorrectly(game), 'correct');
  assert.equal(game.getState().stars, 1);
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.easy - 1, 'a right answer never buys a heart back');

  game.nextQuestion();
  assert.equal(game.answer(wrongOption(game).id), 'missed');
  state = game.getState();
  assert.equal(state.stars, 0, 'a miss takes one star from the current match');
  assert.equal(state.starLost, true);
  assert.equal(state.hearts, HEARTS_BY_LEVEL.easy - 2);
  assert.equal(state.rivalPower, GOAL_BY_LEVEL.easy, 'the buddy is back to full power');
  game.nextQuestion();
  assert.equal(game.getState().starLost, false, 'the flag belongs to the miss only');
});

test('every level starts a match with its hearts, and each wrong tap takes exactly one', () => {
  assert.deepEqual(HEARTS_BY_LEVEL, { easy: 3, harder: 4, super: 5 });
  for (const level of LEVELS) {
    const game = createGame(seededRandom(30));
    game.chooseLevel(level);
    assert.equal(game.getState().hearts, HEARTS_BY_LEVEL[level], `${level} starts with full hearts`);
    assert.equal(game.getState().maxHearts, HEARTS_BY_LEVEL[level]);
    for (let spent = 1; spent < HEARTS_BY_LEVEL[level]; spent += 1) {
      assert.equal(game.answer(wrongOption(game).id), 'missed');
      assert.equal(game.getState().hearts, HEARTS_BY_LEVEL[level] - spent);
      game.nextQuestion();
    }
    assert.equal(game.getState().hearts, 1, `${level}: one heart left`);
  }
});

test('the last heart ends the match: the miss is shown, then nothing but Try again works, and hearts come back', () => {
  for (const level of LEVELS) {
    const game = createGame(seededRandom(31));
    game.chooseLevel(level);
    answerCorrectly(game);
    game.nextQuestion();
    let result;
    for (let miss = 0; miss < HEARTS_BY_LEVEL[level]; miss += 1) {
      result = game.answer(wrongOption(game).id);
      if (miss < HEARTS_BY_LEVEL[level] - 1) {
        assert.equal(result, 'missed');
        game.nextQuestion();
      }
    }
    assert.equal(result, 'lost', `${level}: the last wrong tap loses the match`);
    let state = game.getState();
    assert.equal(state.lost, true);
    assert.equal(state.finished, false, 'a lost match is not a win, so no sticker can be earned from it');
    assert.equal(state.hearts, 0);
    assert.equal(state.missed, true, 'the last miss still shows the right choice');
    assert.equal(game.nextQuestion(), false, 'no new question until the child tries again');
    assert.equal(game.answer(state.question.answerId), 'ignored');
    assert.equal(game.chooseTopic('colors'), false, 'a lost match cannot be dodged by switching topic');
    assert.equal(game.chooseLevel(level === 'easy' ? 'harder' : 'easy'), false, 'or level');
    assert.equal(game.chooseChampion('monster'), false);
    state = game.restart();
    assert.equal(state.lost, false);
    assert.equal(state.hearts, HEARTS_BY_LEVEL[level], 'Try again refills every heart');
    assert.equal(state.stars, 0, 'and starts the match over');
    assert.equal(state.missed, false);
    assert.equal(state.level, level);
  }
});

test('a heart never buys itself back inside a match: switching topic keeps hearts, and a new level or restart refills them', () => {
  const game = createGame(seededRandom(32));
  game.answer(wrongOption(game).id);
  game.nextQuestion();
  assert.equal(game.getState().hearts, 2);
  game.chooseTopic('colors');
  assert.equal(game.getState().hearts, 2, 'changing topic is not a way to get hearts back');
  game.chooseTopic('math');
  assert.equal(game.getState().hearts, 2);
  game.chooseLevel('harder');
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.harder, 'a new level is a new match with its own hearts');
  game.answer(wrongOption(game).id);
  game.restart();
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.harder);
});

test('tapping every choice in turn cannot win a question: the first tap settles it', () => {
  for (const topic of ['math', 'colors', 'animals']) {
    for (const level of LEVELS) {
      const game = createGame(seededRandom(33));
      game.chooseTopic(topic);
      game.chooseLevel(level);
      const { options, answerId } = game.getState().question;
      // The child taps the wrong choices first and the right one last, exactly the pattern a guesser would use.
      const inTurn = [...options.filter(option => option.id !== answerId), ...options.filter(option => option.id === answerId)];
      const results = inTurn.map(option => game.answer(option.id));
      assert.deepEqual(results, ['missed', ...Array(inTurn.length - 1).fill('ignored')], `${topic} ${level}: only the first tap counts`);
      assert.equal(game.getState().stars, 0, 'the right choice tapped last earns nothing');
      assert.equal(game.getState().solved, false);
      assert.equal(game.getState().hearts, HEARTS_BY_LEVEL[level] - 1, 'and the guesser paid a heart');
    }
  }
});

// The chance of winning one match, and the answers a match takes, when each answer is right with probability p.
// A match is the walk over (stars, hearts): a right answer adds a star, a miss takes a heart and a star (never below
// zero), the goal wins, and running out of hearts loses. Solved by iterating the value equations until they settle.
function matchModel(goal, hearts, p) {
  const win = {};
  const answers = {};
  const at = (table, stars, left) => table[`${stars},${left}`] || 0;
  for (let stars = 0; stars <= goal; stars += 1) win[`${stars},0`] = stars >= goal ? 1 : 0;
  for (let stars = 0; stars < goal; stars += 1) for (let left = 1; left <= hearts; left += 1) win[`${stars},${left}`] = 0;
  for (let stars = 0; stars <= goal; stars += 1) for (let left = 1; left <= hearts; left += 1) if (stars >= goal) win[`${stars},${left}`] = 1;
  for (let round = 0; round < 4000; round += 1) {
    for (let stars = 0; stars < goal; stars += 1) {
      for (let left = 1; left <= hearts; left += 1) {
        win[`${stars},${left}`] = p * at(win, stars + 1, left) + (1 - p) * at(win, Math.max(0, stars - 1), left - 1);
        answers[`${stars},${left}`] = 1 + p * at(answers, stars + 1, left) + (1 - p) * at(answers, Math.max(0, stars - 1), left - 1);
      }
    }
  }
  return { win: win[`0,${hearts}`], answers: answers[`0,${hearts}`] };
}

test('tapping at random cannot win a match at any level, while a player who mostly knows the answers keeps winning', () => {
  const winsAtLeast = { easy: [0.9, 0.7], harder: [0.85, 0.6], super: [0.7, 0.3] };
  for (const level of LEVELS) {
    const goal = GOAL_BY_LEVEL[level];
    const hearts = HEARTS_BY_LEVEL[level];
    const guess = matchModel(goal, hearts, 1 / CHOICE_COUNT[level]);
    assert.ok(guess.win <= { easy: 0.13, harder: 0.01, super: 0.001 }[level], `${level}: random tapping wins ${(guess.win * 100).toFixed(2)}% of matches`);
    assert.ok(guess.answers / guess.win >= 8 * goal, `${level}: a random tapper needs at least 8 times the perfect number of answers per win`);
    assert.ok(matchModel(goal, hearts, 0.9).win >= 0.95, `${level}: a 90% player nearly always wins`);
    assert.ok(matchModel(goal, hearts, 0.8).win >= winsAtLeast[level][0], `${level}: an 80% player usually wins`);
    assert.ok(matchModel(goal, hearts, 0.7).win >= winsAtLeast[level][1], `${level}: even a 70% player keeps winning matches`);
  }
  assert.ok(Math.abs(matchModel(3, 3, 1).win - 1) < 1e-9 && Math.abs(matchModel(3, 3, 1).answers - 3) < 1e-9, 'a perfect player wins in exactly the goal');
  assert.ok(Math.abs(matchModel(1, 2, 0.5).win - 0.75) < 1e-9, 'the model matches a hand calculation: one star, two hearts, a coin flip');

  // The real game, driven by a seeded player, agrees with the model.
  function winRate(level, accuracy, matches, seed) {
    const player = seededRandom(seed);
    const game = createGame(seededRandom(seed + 1));
    game.chooseLevel(level);
    let wins = 0;
    for (let played = 0; played < matches; played += 1) {
      for (let result = ''; result !== 'finished' && result !== 'lost'; ) {
        const { question } = game.getState();
        const pick = accuracy === 'random'
          ? question.options[Math.floor(player() * question.options.length)].id
          : player() < accuracy ? question.answerId : wrongOption(game).id;
        result = game.answer(pick);
        if (result === 'finished') wins += 1;
        if (result === 'correct' || result === 'missed') game.nextQuestion();
      }
      game.restart();
    }
    return wins / matches;
  }
  for (const level of LEVELS) {
    const goal = GOAL_BY_LEVEL[level];
    const hearts = HEARTS_BY_LEVEL[level];
    const random = winRate(level, 'random', 20000, 5);
    assert.ok(Math.abs(random - matchModel(goal, hearts, 1 / CHOICE_COUNT[level]).win) < 0.01, `${level}: random tapping wins about ${(matchModel(goal, hearts, 1 / CHOICE_COUNT[level]).win * 100).toFixed(1)}% of matches (saw ${(random * 100).toFixed(1)}%)`);
    const skilled = winRate(level, 0.8, 6000, 6);
    assert.ok(Math.abs(skilled - matchModel(goal, hearts, 0.8).win) < 0.03, `${level}: an 80% player wins about ${(matchModel(goal, hearts, 0.8).win * 100).toFixed(0)}% of matches (saw ${(skilled * 100).toFixed(0)}%)`);
  }
});

test('plus and minus both show up at every math level: never three of one kind in a row, and minus is a fair share', () => {
  for (const level of LEVELS) {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const game = createGame(seededRandom(seed));
      game.chooseLevel(level);
      const ops = [];
      for (let count = 0; count < 400; count += 1) {
        const { question } = game.getState();
        ops.push(/−/.test(question.display) ? 'take' : /\+/.test(question.display) ? 'add' : 'count');
        // Keep the run going whatever happens: right answers, and misses that are refilled with Try again.
        if (game.answer(question.answerId) === 'finished') game.restart();
        else game.nextQuestion();
      }
      for (let index = 2; index < ops.length; index += 1) {
        assert.ok(!(ops[index] === ops[index - 1] && ops[index] === ops[index - 2] && ops[index] !== 'count'), `${level} seed ${seed}: three ${ops[index]} questions in a row at ${index}`);
      }
      if (level !== 'harder') {
        for (let index = 0; index + 2 < ops.length; index += 1) {
          const window = ops.slice(index, index + 3);
          assert.ok(window.includes('take') && window.includes('add'), `${level} seed ${seed}: any three questions in a row include a take-away and a sum (${window})`);
        }
      }
      const takeShare = ops.filter(op => op === 'take').length / ops.length;
      assert.ok(takeShare >= 0.35 && takeShare <= 0.65, `${level} seed ${seed}: take-aways are ${(takeShare * 100).toFixed(0)}% of the questions`);
    }
  }
});

test('the first questions of a fresh match already include a take-away at every level', () => {
  for (const level of LEVELS) {
    let withTake = 0;
    for (let seed = 1; seed <= 200; seed += 1) {
      const game = createGame(seededRandom(seed));
      game.chooseLevel(level);
      let seen = false;
      for (let count = 0; count < 3; count += 1) {
        seen = seen || /−/.test(game.getState().question.display);
        game.answer(game.getState().question.answerId);
        game.nextQuestion();
      }
      if (seen) withTake += 1;
    }
    assert.ok(withTake >= (level === 'harder' ? 190 : 200), `${level}: a take-away shows up within the first three questions (${withTake}/200 matches)`);
  }
});

test('a wrong tap shows the right choice, locks the buttons, plays the try-again reaction, then loads a fresh question', () => {
  const game = createGame(seededRandom(2));
  const app = createAppFixture(game);
  const pageShell = app.document.querySelector('.page-shell');
  app.startButton.click();
  const first = game.getState().question;
  const rightButton = () => app.answerOptions.children.find(button => button.dataset.choice === game.getState().question.answerId);
  const wrongButton = app.answerOptions.children.find(button => button.dataset.choice !== first.answerId);
  wrongButton.click();

  assert.equal(game.getState().missed, true);
  assert.ok(wrongButton.classList.contains('wrong-answer'));
  assert.ok(rightButton().classList.contains('right-answer'), 'the right choice is shown');
  assert.ok(app.answerOptions.children.every(button => button.disabled), 'no second tap on the same question');
  assert.equal(app.elements.get('#feedback').textContent, `${I18N.STRINGS.feedbackMissNoStar.en} ${I18N.heartsLeft(HEARTS_BY_LEVEL.easy - 1, 'en')}`, 'no star to lose yet, so the message names the heart that floated away and how many are left');
  assert.ok(app.elements.get('#feedback').classList.contains('retry'));
  assert.equal(app.nextButton.hidden, true, 'there is no Next button: the game moves on by itself');
  assert.equal(pageShell.dataset.pointer, '', 'nobody points at the locked buttons');
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/en\/reaction-try-again-1\.mp3$/);
  rightButton().click();
  assert.equal(game.getState().stars, 0, 'tapping the right choice afterwards changes nothing');
  assert.equal(game.getState().question.key, first.key);

  app.clock.tick(3000);
  assert.equal(game.getState().question.key, first.key, 'the right choice stays up long enough to see');
  app.clock.tick(500);
  const second = game.getState().question;
  assert.notEqual(second.key, first.key, 'a fresh question, never the same one');
  assert.equal(game.getState().missed, false);
  assert.ok(app.answerOptions.children.every(button => !button.disabled && !button.classList.contains('right-answer') && !button.classList.contains('wrong-answer')));
  assert.equal(app.elements.get('#feedback').textContent, I18N.STRINGS.feedbackDefault.en);
  assert.match(app.played[app.played.length - 1], new RegExp(`/${second.audioId}\\.mp3$`), 'the new question is read out');
  assert.equal(pageShell.dataset.pointer, 'answer');
  assert.equal(app.document.activeElement, app.answerOptions.children[0]);

  // With a star in hand, the miss takes it back and says so gently.
  answerCorrectly(game);
  app.nextButton.click();
  app.answerOptions.children.find(button => button.dataset.choice !== game.getState().question.answerId).click();
  assert.equal(game.getState().stars, 0);
  assert.equal(app.elements.get('#feedback').textContent, `${I18N.STRINGS.feedbackMiss.en} ${I18N.heartsLeft(1, 'en')}`);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/en\/reaction-last-heart\.mp3$/, 'the miss that leaves one heart says so out loud');
  assert.equal(app.elements.get('#scoreCount').textContent, `0 / ${GOAL_BY_LEVEL.easy}`);
  assert.equal(app.elements.get('#scoreStars').children.filter(star => star.classList.contains('earned')).length, 0);
  assert.equal(app.elements.get('#rivalPower').children.filter(pip => pip.classList.contains('spent')).length, 0, 'the buddy is back at full power');
});

test('a missed question waits a shorter moment when the sound is off, and its miss survives a language change', () => {
  const game = createGame(seededRandom(6));
  const app = createAppFixture(game);
  clickAnswer(app, game, false);
  const key = game.getState().question.key;
  app.clock.tick(1900);
  assert.equal(game.getState().question.key, key);
  app.clock.tick(200);
  assert.notEqual(game.getState().question.key, key, 'without sound the pause is only about two seconds');

  app.startButton.click();
  clickAnswer(app, game, false);
  const missedKey = game.getState().question.key;
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  assert.equal(game.getState().missed, true);
  assert.ok(app.answerOptions.children.every(button => button.disabled), 'the rebuilt choices stay locked');
  assert.ok(app.answerOptions.children.some(button => button.classList.contains('right-answer')));
  assert.equal(app.elements.get('#feedback').textContent, `${I18N.STRINGS.feedbackMissNoStar.ja} ${I18N.heartsLeft(1, 'ja')}`);
  assert.doesNotMatch(app.played[app.played.length - 1], /math-|colors-/, 'changing language mid-miss does not replay the ended question');
  app.clock.tick(MISS_PAUSE_TICK);
  assert.notEqual(game.getState().question.key, missedKey);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/ja\//);
});

test('choosing another topic or level, or starting over, while a miss waits replaces the miss for good', () => {
  for (const change of [
    app => app.topicTabs.find(tab => tab.dataset.topic === 'colors').click(),
    app => app.levelButtons.find(button => button.dataset.level === 'harder').click(),
    app => app.elements.get('#restartButton').click(),
  ]) {
    const game = createGame(seededRandom(9));
    const app = createAppFixture(game);
    app.startButton.click();
    clickAnswer(app, game, false);
    change(app);
    assert.equal(game.getState().missed, false);
    const key = game.getState().question.key;
    const stars = game.getState().stars;
    app.clock.tick(MISS_PAUSE_TICK);
    assert.equal(game.getState().question.key, key, 'the cancelled pause never swaps the new question away');
    assert.equal(game.getState().stars, stars);
    assert.ok(app.answerOptions.children.every(button => !button.disabled));
  }
});

test('a miss at every level ends its question and is safe for each topic', () => {
  const game = createGame(seededRandom(12));
  const app = createAppFixture(game);
  app.startButton.click();
  for (const level of LEVELS) {
    app.levelButtons.find(button => button.dataset.level === level).click();
    for (const topic of TOPICS) {
      app.topicTabs.find(tab => tab.dataset.topic === topic).click();
      app.elements.get('#restartButton').click();
      clickAnswer(app, game, true);
      app.nextButton.click();
      const before = game.getState();
      clickAnswer(app, game, false);
      assert.equal(game.getState().stars, before.stars - 1, `${level} ${topic}: the miss takes one star`);
      assert.ok(app.answerOptions.children.some(button => button.classList.contains('right-answer')));
      app.clock.tick(MISS_PAUSE_TICK);
      assert.notEqual(game.getState().question.key, before.question.key);
    }
  }
});

test('the level descriptions in every language say what each level now asks for', () => {
  const app = createAppFixture(createGame(seededRandom(2)));
  const message = () => app.elements.get('#arenaMessage').textContent;
  app.topicTabs.find(tab => tab.dataset.topic === 'animals').click();
  const [easy, harder, superButton] = app.levelButtons;
  harder.click();
  assert.equal(message(), I18N.levelChosenMessage('harder', 'en', 'animals'));
  assert.match(message(), /read the word.*pick the right picture from four/);
  easy.click();
  assert.match(message(), /read the question.*pick the right picture from three/);
  superButton.click();
  assert.match(message(), /listen only/);
  for (const topic of ['animals', 'math']) {
    for (const level of LEVELS) {
      for (const language of ['en', 'zh', 'ja']) assert.ok(I18N.levelChosenMessage(level, language, topic), `${topic} ${level} ${language}`);
    }
  }
  assert.match(I18N.levelChosenMessage('easy', 'zh', 'animals'), /三張圖/);
  assert.match(I18N.levelChosenMessage('harder', 'zh', 'animals'), /四張圖/);
  assert.match(I18N.levelChosenMessage('easy', 'ja'), /えを　えらぶ/);
  assert.match(I18N.levelChosenMessage('easy', 'en', 'math'), /add or take away within five/);
  assert.match(I18N.levelChosenMessage('super', 'en', 'math'), /plus and minus, no pictures/);
  app.topicTabs.find(tab => tab.dataset.topic === 'math').click();
  harder.click();
  assert.match(message(), /count, add, and take away within ten/);
});

test('take-away eggs stay countable: every egg shows and the ones taken away are marked', () => {
  const game = createGame(seededRandom(3));
  const app = createAppFixture(game);
  const picture = app.elements.get('#questionPicture');
  const seen = new Set();
  for (const level of ['easy', 'harder', 'super']) {
    app.levelButtons.find(button => button.dataset.level === level).click();
    for (let draw = 0; draw < 200; draw += 1) {
      app.topicTabs.find(tab => tab.dataset.topic === 'math').click();
      const { question } = game.getState();
      if (!question.display.includes('−')) {
        assert.equal(picture.classList.contains('take-away-picture'), false);
        continue;
      }
      if (level === 'super') {
        assert.equal(picture.hidden, true);
        continue;
      }
      const { total, taken } = question.takeAway;
      const eggs = picture.children;
      seen.add(level);
      assert.equal(picture.hidden, false);
      assert.ok(picture.classList.contains('take-away-picture'));
      assert.equal(eggs.length, total, 'every egg is drawn');
      assert.equal(eggs.filter(egg => egg.classList.contains('egg-taken')).length, taken, 'the eggs being taken away are marked');
      assert.equal(eggs.filter(egg => !egg.classList.contains('egg-taken')).length, Number(question.answerId), 'the eggs left are the answer');
      assert.ok(eggs.slice(total - taken).every(egg => egg.classList.contains('egg-taken')), 'the taken eggs are the last ones');
      assert.ok(eggs.every(egg => egg.textContent === '🥚'));
      assert.equal(picture.getAttribute('aria-hidden'), 'true');
      assert.equal(app.elements.get('#equation').textContent, question.display);
    }
  }
  assert.deepEqual([...seen].sort(), ['easy', 'harder']);
});

test('a win after the daily cap celebrates, says which way to earn the next sticker, and adds nothing to the book', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.championCards[0].click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();
  const note = () => app.elements.get('#finishPanel').children.find(child => child.id === 'rewardNote');
  const summary = () => app.elements.get('#rewardSummary').textContent;
  const winOne = () => {
    playMatchToFinish(app, game);
    const shown = note();
    app.elements.get('#playAgainButton').hidden ? app.document.querySelector('#oneMoreRoundButton').click() : app.elements.get('#playAgainButton').click();
    return shown;
  };

  assert.match(winOne().textContent, /New sticker/);
  assert.match(winOne().textContent, /Another sticker|New sticker|Rex gets/);
  const stickersBefore = summary();
  const played = app.played.length;
  playMatchToFinish(app, game);
  assert.ok(note().classList.contains('cap-note'), 'the third easy win in a language is capped');
  assert.match(note().textContent, /Great win! To earn your next sticker, try a harder level or another language\./);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/en\/reaction-cap-harder-or-language\.mp3$/, 'the message is spoken in the voice language');
  assert.equal(app.played.length > played, true);
  assert.equal(app.elements.get('#finishTitle').textContent.length > 0, true, 'the celebration screen still shows');
  assert.equal(summary(), stickersBefore, 'the sticker book did not grow');
  app.document.querySelector('[data-reward-action="open"]').click();
  assert.ok(app.elements.get('#stickerGrid').children.filter(slot => !slot.classList.contains('is-empty')).length === 2);
  app.document.querySelector('[data-reward-action="close"]').click();

  // Another language earns again, and the message is spoken in that voice when it caps out.
  app.elements.get('#playAgainButton').hidden ? app.document.querySelector('#oneMoreRoundButton').click() : app.elements.get('#playAgainButton').click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  assert.match(winOne().textContent, /新貼紙|又一張貼紙/, 'another language pays a sticker again');
  app.levelButtons.find(button => button.dataset.level === 'harder').click();
  assert.match(winOne().textContent, /新貼紙|又一張貼紙/, 'a harder level pays again too');
});

test('with harder levels locked the cap message points to another language, and with nothing left it says come back tomorrow', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.championCards[0].click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  passGate(app);
  for (const level of ['harder', 'super']) {
    const input = app.document.querySelector(`[data-level-lock="${level}"]`).querySelector('input');
    input.checked = false;
    input.dispatch('change');
  }
  app.document.querySelector('#settingsCloseButton').click();
  assert.equal(game.getState().level, 'easy');
  const note = () => app.elements.get('#finishPanel').children.find(child => child.id === 'rewardNote');
  const again = () => (app.elements.get('#playAgainButton').hidden ? app.document.querySelector('#oneMoreRoundButton') : app.elements.get('#playAgainButton')).click();

  playMatchToFinish(app, game);
  again();
  playMatchToFinish(app, game);
  again();
  playMatchToFinish(app, game);
  assert.ok(note().classList.contains('cap-note'));
  assert.match(note().textContent, /ほかの　げんごで/, 'the note points to another language, never a locked level');
  assert.doesNotMatch(note().textContent, /むずかしい/);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/ja\/reaction-cap-language\.mp3$/);

  for (const language of ['en', 'zh']) {
    again();
    app.textLanguageButtons.find(button => button.dataset.textLanguage === language).click();
    playMatchToFinish(app, game);
    again();
    playMatchToFinish(app, game);
  }
  again();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'en').click();
  playMatchToFinish(app, game);
  assert.match(note().textContent, /Come back tomorrow for more!/);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/en\/reaction-cap-tomorrow\.mp3$/);
});

test('the cap messages, the miss messages, and the new level texts are hiragana-only in Japanese', () => {
  const KATAKANA = /[ァ-ヺ]/;
  const KANJI = /[一-鿿]/;
  for (const advice of ['harder-or-language', 'harder', 'language', 'tomorrow']) {
    for (const language of ['en', 'zh', 'ja']) assert.ok(I18N.capNote(advice, language).length > 10);
    assert.doesNotMatch(I18N.capNote(advice, 'ja'), KATAKANA);
    assert.doesNotMatch(I18N.capNote(advice, 'ja'), KANJI);
  }
  assert.equal(I18N.capNote('unknown', 'en'), I18N.capNote('tomorrow', 'en'));
  for (const topic of ['math', 'animals']) {
    for (const level of LEVELS) {
      assert.doesNotMatch(I18N.levelChosenMessage(level, 'ja', topic), KATAKANA);
      assert.doesNotMatch(I18N.levelChosenMessage(level, 'ja', topic), KANJI);
    }
  }
  for (const key of ['feedbackMiss', 'feedbackMissNoStar', 'answerGroupLabelPicture']) {
    assert.ok(I18N.STRINGS[key].en && I18N.STRINGS[key].zh && I18N.STRINGS[key].ja);
  }
  // Each spoken cap line carries the same message as the written one.
  const clipFor = { 'harder-or-language': 'reaction-cap-harder-or-language', harder: 'reaction-cap-harder', language: 'reaction-cap-language', tomorrow: 'reaction-cap-tomorrow' };
  for (const [advice, clip] of Object.entries(clipFor)) {
    assert.equal(reactions[clip].en, I18N.capNote(advice, 'en'));
    assert.equal(reactions[clip].zh, I18N.capNote(advice, 'zh'));
    assert.deepEqual(REACTIONS[`cap-${advice}`], [clip]);
  }
});

test('subtraction narration is written in all three languages and says how many are left', () => {
  const takeIds = Object.keys(prompts).filter(id => id.startsWith('math-take-'));
  assert.ok(takeIds.length >= 40, `plenty of take-away clips (${takeIds.length})`);
  for (const id of takeIds) {
    const [, , from, take] = id.split('-').map(Number);
    assert.match(prompts[id].en, /minus .*\. How many are left\?$/, id);
    assert.match(prompts[id].zh, /^[一二三四五六七八九十]減[一二三四五六七八九十]，還剩下多少？$/, id);
    assert.match(prompts[id].ja, /ひく.*は、のこりはいくつかな？$/, id);
    assert.ok(take >= 1 && take <= from && from <= 10, id);
  }
  assert.equal(prompts['math-take-5-2'].en, 'Five minus two. How many are left?');
  assert.equal(prompts['math-take-5-2'].zh, '五減二，還剩下多少？');
  assert.equal(prompts['math-take-7-7'].ja, 'ななひくななは、のこりはいくつかな？');
});

test('changing topic or level, or starting over, clears a miss that is waiting to be replaced', () => {
  const game = createGame(steadyRandom);
  game.answer(wrongOption(game).id);
  assert.equal(game.chooseTopic('colors'), true);
  assert.equal(game.getState().missed, false);
  assert.equal(game.nextQuestion(), false, 'only a right or missed question can move on');
  game.answer(wrongOption(game).id);
  assert.equal(game.chooseLevel('harder'), true);
  assert.equal(game.getState().missed, false);
  game.answer(wrongOption(game).id);
  assert.equal(game.restart().missed, false);
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

// Every math clip ID the game can ask for, found by drawing many questions at every level.
function allMathAudioIds() {
  const ids = new Set();
  const game = createGame(seededRandom(21));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (let draw = 0; draw < 3000; draw += 1) {
      ids.add(game.getState().question.audioId);
      game.chooseTopic('math');
    }
  }
  return [...ids];
}

test('every math and vocabulary prompt has bundled English, Taiwan Mandarin, and Japanese audio', () => {
  const expected = [
    ...allMathAudioIds(),
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
  assert.deepEqual(Object.keys(REACTIONS), [
    'praise', 'try-again', 'last-heart', 'round-lost', 'cap-harder-or-language', 'cap-harder', 'cap-language', 'cap-tomorrow', 'finish', 'break-prompt', 'break-goodbye',
  ]);
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

test('word choices are picture-only where the question shows the word, keep an accessible name, and fall back to emoji if a picture fails', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const questionPicture = app.elements.get('#questionPicture');
  app.topicTabs.find(tab => tab.dataset.topic === 'face').click();

  const { question } = game.getState();
  assert.equal(questionPicture.hidden, true, 'the easy question shows no picture, only the written prompt');
  assert.equal(questionPicture.children.length, 0);
  assert.equal(app.elements.get('#questionPrompt').hidden, false);
  for (const button of app.answerOptions.children) {
    const option = question.options.find(choice => choice.id === button.dataset.choice);
    assert.equal(button.children.length, 1, 'a picture-only choice holds just the picture');
    const [icon] = button.children;
    assert.equal(icon.getAttribute('aria-hidden'), 'true');
    assert.equal(icon.children[0].src, option.image);
    assert.equal(icon.children[0].alt, option.en);
    assert.equal(icon.children[0].draggable, false, 'pressing the answer picture never starts an image drag');
    assert.equal(button.getAttribute('aria-label'), option.en, 'screen readers still get the word');
    assert.ok(button.classList.contains('picture-only'));
    assert.ok(!button.textContent.includes(option.en), 'the word is not painted on the button');
  }
  assert.equal(app.answerOptions.getAttribute('aria-label'), I18N.STRINGS.answerGroupLabelPicture.en);

  const answerArt = app.answerOptions.children[0].children[0];
  answerArt.children[0].dispatch('error');
  assert.equal(answerArt.textContent, question.options.find(option => option.id === app.answerOptions.children[0].dataset.choice).icon);

  app.topicTabs.find(tab => tab.dataset.topic === 'math').click();
  assert.equal(questionPicture.children.length > 0 || questionPicture.textContent.length > 0, true, 'math still shows its eggs');
  assert.equal(app.answerOptions.children.every(button => !button.classList.contains('picture-only')), true);
});

test('picture-only choices apply at easy and harder for every word topic, and super keeps picture-and-word choices', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.startButton.click();
  for (const level of LEVELS) {
    app.levelButtons.find(button => button.dataset.level === level).click();
    for (const topic of WORD_TOPIC_IDS) {
      app.topicTabs.find(tab => tab.dataset.topic === topic).click();
      const { question } = game.getState();
      for (const button of app.answerOptions.children) {
        const option = question.options.find(choice => choice.id === button.dataset.choice);
        const word = topic === 'colors' && level === 'super' ? option.en.toLowerCase() : option.en;
        if (level === 'super') {
          assert.ok(!button.classList.contains('picture-only'), `${topic} super keeps its labels`);
          assert.ok(button.textContent.includes(word), `${topic} super shows the word: ${word}`);
        } else {
          assert.ok(button.classList.contains('picture-only'), `${topic} ${level} choices are pictures only`);
          assert.equal(button.textContent, '', 'no label text');
          assert.equal(button.getAttribute('aria-label'), option.en);
          const picture = button.children[0];
          if (topic === 'colors') assert.equal(picture.style.backgroundColor, option.swatch);
        }
      }
      const written = { easy: 'prompt', harder: 'word', super: null }[level];
      if (written === 'prompt') assert.equal(app.elements.get('#questionPrompt').hidden, false);
      if (written === 'word') assert.equal(app.elements.get('#questionWord').hidden, false);
      assert.equal(app.elements.get('#questionPicture').hidden, true, `${level} ${topic} shows no question picture`);
    }
  }
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
      for (let draw = 0; draw < (topic === 'math' ? 3000 : 80); draw += 1) {
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

function mathParts(question) {
  const match = question.display.match(/^(\d+) ([+−]) (\d+) = \?$/);
  return match && { left: Number(match[1]), op: match[2], right: Number(match[3]) };
}

test('easy math adds and takes away within five; harder counts, adds, and takes away within ten; super mixes plus and minus with no picture', () => {
  const game = createGame(seededRandom(3));
  const seen = { easy: new Set(), harder: new Set(), super: new Set() };
  const keys = { easy: new Set(), harder: new Set(), super: new Set() };
  const eggCount = text => [...text].filter(char => char === '🥚').length;
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (let draw = 0; draw < 400; draw += 1) {
      const question = game.getState().question;
      keys[level].add(question.key);
      const values = question.options.map(option => Number(option.id));
      assert.equal(question.options.length, CHOICE_COUNT[level]);
      assert.equal(new Set(values).size, values.length, 'choices are distinct');
      assert.ok(question.options.some(option => option.id === question.answerId));
      assert.ok(values.every(value => value >= 0 && value <= 10), `${level} choices stay between zero and ten`);
      const answer = Number(question.answerId);
      const parts = mathParts(question);
      if (parts) {
        const expected = parts.op === '+' ? parts.left + parts.right : parts.left - parts.right;
        assert.equal(answer, expected);
        assert.ok(answer >= 0, 'a take-away never goes below zero');
        if (parts.op === '−') {
          assert.ok(parts.right >= 1 && parts.right <= parts.left);
          assert.match(question.audioId, /^math-take-/);
          assert.equal(question.promptEn, 'How many are left?');
          assert.match(question.promptZh, /剩/);
          assert.match(question.promptJa, /のこり/);
          if (level === 'super') assert.equal(question.takeAway, null);
          else {
            assert.deepEqual(question.takeAway, { total: parts.left, taken: parts.right }, 'the picture shows every egg and which are taken away');
            assert.equal(eggCount(question.picture), parts.left);
          }
        } else {
          assert.equal(question.takeAway, null);
          assert.equal(question.promptEn, 'How many altogether?');
          if (level !== 'super') assert.equal(eggCount(question.picture), parts.left + parts.right);
        }
        seen[level].add(parts.op);
        const biggest = Math.max(parts.left, parts.right, answer);
        assert.ok(biggest <= (level === 'easy' ? 5 : 10), `${level} stays within ${level === 'easy' ? 'five' : 'ten'}: ${question.display}`);
      } else {
        assert.equal(level, 'harder', 'only the harder level asks counting questions');
        assert.equal(question.audioId, 'math-count', 'the counting clip never says the answer');
        assert.equal(eggCount(question.picture), answer);
        seen[level].add('count');
      }
      if (level === 'super') {
        assert.equal(question.picture, '', 'super math hides the egg picture');
        assert.ok(question.display, 'super math always shows the equation numbers');
      }
      game.chooseTopic('math');
    }
  }
  assert.deepEqual([...seen.easy].sort(), ['+', '−']);
  assert.deepEqual([...seen.harder].sort(), ['+', 'count', '−']);
  assert.deepEqual([...seen.super].sort(), ['+', '−']);
  assert.ok(keys.easy.size >= 20, 'easy has a big enough pool that the same few sums do not keep repeating');
  assert.ok(keys.harder.size >= 50 && keys.super.size >= 45, 'harder and super pools are large too');
});

test('a take-away can have 0 as its answer, and 0 is offered as a choice at every level that allows it', () => {
  const zeroLevels = new Set();
  const game = createGame(seededRandom(8));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (let draw = 0; draw < 600; draw += 1) {
      const { question } = game.getState();
      if (question.answerId === '0') {
        zeroLevels.add(level);
        assert.ok(question.options.some(option => option.id === '0'));
      }
      game.chooseTopic('math');
    }
  }
  assert.deepEqual([...zeroLevels].sort(), ['easy', 'harder', 'super']);
  const easyAtZero = createGame(() => 0.5);
  easyAtZero.chooseTopic('math');
  for (let draw = 0; draw < 30; draw += 1) {
    const { question } = easyAtZero.getState();
    if (question.answerId === '0') assert.deepEqual(question.options.map(option => Number(option.id)).sort(), [0, 1, 2]);
    easyAtZero.chooseTopic('math');
  }
});

test('harder and super sometimes offer the wrong-operation result as a distractor', () => {
  const game = createGame(seededRandom(4));
  game.chooseLevel('super');
  let tempted = 0;
  for (let draw = 0; draw < 500; draw += 1) {
    const { question } = game.getState();
    const { left, op, right } = mathParts(question);
    const wrong = op === '+' ? Math.abs(left - right) : left + right;
    if (question.options.some(option => Number(option.id) === wrong && wrong !== Number(question.answerId))) tempted += 1;
    game.chooseTopic('math');
  }
  assert.ok(tempted > 100 && tempted < 450, `the wrong-operation choice appears about half the time (${tempted}/500)`);
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

test('the level buttons switch choices and goal markers, and color choices are swatches only', () => {
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
  assert.equal(app.elements.get('#questionPicture').hidden, true, 'the color question shows only its written prompt');
  const target = question.options.find(option => option.id === question.answerId);
  const swatches = app.answerOptions.children.map(button => button.children[0].style.backgroundColor);
  assert.ok(swatches.includes(target.swatch), 'the right colour is one of the swatch-only choices');
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
  const sticker = STICKERS.find(item => rewardNoteBefore.textContent.includes(item.en));
  assert.ok(rewardNote.querySelector('.reward-text').textContent.includes(sticker.ja), 'the sticker name is bilingual too');
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
  assert.match(summary.textContent, /1 sticker earned/);

  app.document.querySelector('[data-reward-action="open"]').click();
  app.document.querySelector('[data-reward-action="reset"]').click();
  app.document.querySelector('[data-reward-action="confirm-reset"]').click();
  assert.match(summary.textContent, /0 stickers earned/);
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
  assert.match(summary.textContent, /1 sticker earned/);

  storage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, wins: 0, wearing: { dino: null, monster: null } }));
  app.dispatchWindowEvent('storage', { key: STORAGE_KEY });
  assert.match(summary.textContent, /0 stickers earned/);
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

  assert.match(app.elements.get('#settingsRewardSummary').textContent, /0 stickers earned/);
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
  app.document.dispatchEvent({ type: 'keyup', key: 'x' });
  assert.equal(focusCalls, 0, 'a different key release does not move focus');
  app.document.dispatchEvent({ type: 'keyup', key: 'Enter' });
  assert.equal(focusCalls, 1, 'focus lands on Close after Enter is released');
  app.document.dispatchEvent({ type: 'keyup', key: 'Enter' });
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
  for (const hearts of [1, 2, 3, 4, 5]) checkJa(`heartsLeft(${hearts})`, I18N.heartsLeft(hearts, 'ja'));
  checkJa('heartsAria', I18N.heartsAria(2, 3, 'ja'));
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
  assert.equal(app.answerOptions.children.find(button => button.dataset.choice === target.id).getAttribute('aria-label'), target.zh, 'the picture-only choice keeps its word in the chosen language as its name');

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
  app.clock.tick(MISS_PAUSE_TICK);
  clickAnswer(app, game, true);
  assert.deepEqual(app.played, [], 'no reaction before Start, a language, replay, or unmute');
  assert.equal(app.startRow.hidden, false);

  app.nextButton.click();
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'zh').click();
  assert.equal(app.startRow.hidden, true, 'a language choice turns on the questions and cheers together');
  app.elements.get('#restartButton').click();
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.easy, 'starting over brings the hearts back');
  clickAnswer(app, game, false);
  app.clock.tick(MISS_PAUSE_TICK);
  clickAnswer(app, game, false);
  app.clock.tick(MISS_PAUSE_TICK);
  clickAnswer(app, game, true);
  app.nextButton.click();
  clickAnswer(app, game, true);
  assert.equal(game.getState().stars, 2, 'two misses (no star to lose) and two right answers leave two stars');
  const questionId = /\/(math-[\w-]+)\.mp3$/;
  assert.deepEqual(app.played.map(src => src.replace(questionId, '/<question>.mp3')), [
    './audio/zh/<question>.mp3',
    './audio/zh/<question>.mp3',
    './audio/zh/reaction-try-again-1.mp3',
    './audio/zh/<question>.mp3',
    './audio/zh/reaction-last-heart.mp3',
    './audio/zh/<question>.mp3',
    './audio/zh/reaction-praise-1.mp3',
    './audio/zh/<question>.mp3',
    './audio/zh/reaction-praise-2.mp3',
  ]);
});

test('the miss that takes the last heart says so, then Try again brings the hearts and the questions back', () => {
  const game = createGame(seededRandom(41));
  const app = createAppFixture(game);
  const pageShell = app.document.querySelector('.page-shell');
  const el = id => app.elements.get(id);
  app.textLanguageButtons.find(button => button.dataset.textLanguage === 'ja').click();
  assert.equal(el('#heartPips').children.length, HEARTS_BY_LEVEL.easy);
  assert.equal(el('#heartPips').children.filter(pip => pip.classList.contains('spent')).length, 0, 'every heart starts full');
  assert.equal(el('#heartMeter').attributes['aria-label'], I18N.heartsAria(3, 3, 'ja'));
  assert.equal(el('#heartsLabel').textContent, I18N.STRINGS.heartsLabel.ja);

  clickAnswer(app, game, false);
  assert.equal(el('#heartPips').children.filter(pip => pip.classList.contains('spent')).length, 1, 'the wrong tap shows one hollow heart');
  assert.ok(el('#heartPips').children[2].classList.contains('just-lost'), 'the heart that went gets a shake');
  assert.ok(el('#heartFloat').classList.contains('is-showing'), 'and a small "-1" floats up beside the hearts');
  assert.equal(el('#heartMeter').attributes['aria-label'], I18N.heartsAria(2, 3, 'ja'));
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/ja\/reaction-try-again-1\.mp3$/);
  app.clock.tick(MISS_PAUSE_TICK);

  clickAnswer(app, game, false);
  assert.ok(el('#heartPips').classList.contains('last-heart'), 'the one heart left beats to warn');
  assert.equal(el('#feedback').textContent, `${I18N.STRINGS.feedbackMissNoStar.ja} ${I18N.heartsLeft(1, 'ja')}`);
  app.clock.tick(MISS_PAUSE_TICK);

  clickAnswer(app, game, false);
  assert.equal(game.getState().lost, true);
  assert.equal(el('#heartPips').children.filter(pip => pip.classList.contains('spent')).length, 3, 'every heart is hollow');
  assert.equal(el('#feedback').textContent, I18N.STRINGS.feedbackLost.ja);
  assert.equal(el('#arenaMessage').textContent, I18N.STRINGS.lostMessage.ja);
  assert.match(app.played[app.played.length - 1], /^\.\/audio\/ja\/reaction-round-lost\.mp3$/);
  assert.equal(el('#lostPanel').hidden, true, 'the right choice is shown first');
  assert.equal(el('#questionPanel').hidden, false);
  assert.ok(app.topicTabs.every(tab => tab.disabled) && app.levelButtons.every(button => button.disabled), 'the topic and level cannot be switched to dodge the loss');
  app.clock.tick(2000);
  assert.equal(el('#lostPanel').hidden, true, 'the pause lasts long enough to see the right choice');
  app.clock.tick(2000);
  assert.equal(el('#lostPanel').hidden, false, 'then the lost-match panel takes over');
  assert.equal(el('#questionPanel').hidden, true);
  assert.equal(el('#finishPanel').hidden, true, 'a lost match is never shown as a win');
  assert.equal(pageShell.dataset.pointer, 'lost');
  assert.ok(el('#lostTitle').textContent.startsWith(I18N.STRINGS.lostHeading.ja), 'the panel speaks the chosen language first');
  assert.equal(game.getState().lost, true, 'no new question while the panel waits');

  el('#tryAgainButton').click();
  assert.equal(game.getState().lost, false);
  assert.equal(game.getState().hearts, HEARTS_BY_LEVEL.easy);
  assert.equal(game.getState().stars, 0);
  assert.equal(el('#lostPanel').hidden, true);
  assert.equal(el('#questionPanel').hidden, false);
  assert.equal(el('#heartPips').children.filter(pip => pip.classList.contains('spent')).length, 0, 'all the hearts are back');
  assert.ok(app.topicTabs.every(tab => !tab.disabled));
  clickAnswer(app, game, true);
  assert.equal(game.getState().stars, 1, 'the match plays on normally');
});

test('starting over while the last miss is still showing cancels the lost-match panel', () => {
  const game = createGame(seededRandom(42));
  const app = createAppFixture(game);
  for (let miss = 0; miss < HEARTS_BY_LEVEL.easy; miss += 1) {
    clickAnswer(app, game, false);
    if (miss < HEARTS_BY_LEVEL.easy - 1) app.clock.tick(MISS_PAUSE_TICK);
  }
  assert.equal(game.getState().lost, true);
  app.elements.get('#restartButton').click();
  assert.equal(game.getState().lost, false);
  app.clock.tick(MISS_PAUSE_TICK);
  assert.equal(app.elements.get('#lostPanel').hidden, true, 'the cancelled pause never shows the panel');
  assert.equal(app.elements.get('#questionPanel').hidden, false);
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

test('a miss is a pillow block that takes a star back and quietly restarts the right-in-a-row combo', () => {
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
  assert.equal(game.getState().stars, 1, 'a miss takes one star back from the match');
  assert.equal(app.elements.get('#scoreCount').textContent, `1 / ${GOAL_BY_LEVEL.easy}`);
  assert.ok(app.elements.get('#scoreStars').children[1].classList.contains('just-lost'), 'the star that went back gets a little shake');
  app.clock.tick(MISS_PAUSE_TICK);
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
  app.clock.tick(MISS_PAUSE_TICK);
  app.later();
  clickAnswer(app, game, true);
  assert.deepEqual(app.effects.slice(3).filter(name => name !== 'chime'), ['tap', 'sparkle', 'whoosh', 'giggle'], 'a right answer sparkles, whooshes, and giggles');
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
