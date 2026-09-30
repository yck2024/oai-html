'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { STORAGE_KEY, STICKERS, COSTUMES, DAILY_CAPS, createRewards } = require('./rewards.js');
const gameApi = require('./game.js');

class MemoryStorage {
  constructor(initial = {}) { this.items = { ...initial }; }
  getItem(key) { return Object.hasOwn(this.items, key) ? this.items[key] : null; }
  setItem(key, value) { this.items[key] = String(value); }
  removeItem(key) { delete this.items[key]; }
}

class BrokenStorage {
  getItem() { throw new Error('blocked'); }
  setItem() { throw new Error('blocked'); }
  removeItem() { throw new Error('blocked'); }
}

// The device's local calendar date, the way the daily sticker tally counts it.
function today(date = new Date()) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function saved(storage) {
  return JSON.parse(storage.getItem(STORAGE_KEY));
}

test('each win earns the next sticker, and a full book repeats with a count', () => {
  const rewards = createRewards(new MemoryStorage());
  assert.equal(rewards.getState().collected, 0);
  const earned = [];
  for (let win = 1; win <= STICKERS.length + 2; win += 1) earned.push(rewards.recordWin('dino'));
  assert.deepEqual(earned.slice(0, STICKERS.length).map(result => result.sticker.id), STICKERS.map(sticker => sticker.id));
  assert.ok(earned.slice(0, STICKERS.length).every(result => result.firstTime));
  assert.equal(earned[STICKERS.length].sticker.id, STICKERS[0].id);
  assert.equal(earned[STICKERS.length].firstTime, false);
  const state = rewards.getState();
  assert.equal(state.collected, STICKERS.length);
  assert.deepEqual(state.stickers.map(sticker => sticker.count).slice(0, 3), [2, 2, 1]);
});

test('a few wins unlock costumes, which the winning champion puts on right away', () => {
  const rewards = createRewards(new MemoryStorage());
  assert.deepEqual(COSTUMES.map(costume => costume.unlockAt), [2, 4, 6, 8]);
  assert.equal(rewards.recordWin('monster').unlocked, null);
  assert.deepEqual(rewards.getState().nextCostume && rewards.getState().nextCostume.winsToGo, 1);
  const second = rewards.recordWin('monster');
  assert.equal(second.unlocked.id, 'crown');
  assert.deepEqual(rewards.getState().wearing, { dino: null, monster: 'crown' });
  for (let win = 3; win <= 8; win += 1) rewards.recordWin('dino');
  const state = rewards.getState();
  assert.ok(state.costumes.every(costume => costume.unlocked));
  assert.equal(state.nextCostume, null);
  assert.deepEqual(state.wearing, { dino: 'propeller-cap', monster: 'crown' });
});

test('only unlocked costumes can be worn, and any costume can be taken off', () => {
  const rewards = createRewards(new MemoryStorage());
  assert.equal(rewards.wear('dino', 'crown'), false, 'a locked costume stays locked');
  rewards.recordWin('dino');
  rewards.recordWin('dino');
  assert.equal(rewards.wear('monster', 'crown'), true);
  assert.equal(rewards.wear('monster', 'party-hat'), false);
  assert.equal(rewards.wear('robot', 'crown'), false);
  assert.equal(rewards.wear('dino', null), true);
  assert.deepEqual(rewards.getState().wearing, { dino: null, monster: 'crown' });
});

test('progress saves only the win count, chosen costumes, and today\'s sticker tally on the device', () => {
  const storage = new MemoryStorage();
  const rewards = createRewards(storage);
  rewards.recordWin('dino');
  rewards.recordWin('dino');
  assert.deepEqual(Object.keys(storage.items), [STORAGE_KEY]);
  assert.deepEqual(saved(storage), { v: 2, wins: 2, wearing: { dino: 'crown', monster: null }, daily: { date: today(), counts: {} } });

  const reloaded = createRewards(storage).getState();
  assert.equal(reloaded.wins, 2);
  assert.equal(reloaded.persistent, true);
  assert.deepEqual(reloaded.wearing, { dino: 'crown', monster: null });
});

test('a second open tab never overwrites newer progress saved by the other tab', () => {
  const storage = new MemoryStorage();
  const staleTab = createRewards(storage);
  const otherTab = createRewards(storage);
  otherTab.recordWin('dino');
  otherTab.recordWin('dino');
  const shown = staleTab.getState();
  assert.equal(shown.wins, 2, 'the other tab\'s wins show up right away');
  assert.equal(shown.collected, 2);
  assert.deepEqual(shown.wearing, { dino: 'crown', monster: null });
  assert.equal(staleTab.wear('monster', 'crown'), true, 'a costume won in the other tab can be worn');
  assert.deepEqual(saved(storage).wearing, { dino: 'crown', monster: 'crown' });
  otherTab.recordWin('dino');
  otherTab.recordWin('dino');
  otherTab.recordWin('dino');
  const result = staleTab.recordWin('monster');
  assert.equal(result.wins, 6);
  assert.equal(result.unlocked.id, 'flower-crown');
  assert.deepEqual(saved(storage), { v: 2, wins: 6, wearing: { dino: 'party-hat', monster: 'flower-crown' }, daily: { date: today(), counts: {} } });

  otherTab.reset();
  assert.equal(staleTab.getState().wins, 0, 'a grown-up reset in the other tab shows up right away');
  assert.equal(staleTab.recordWin('dino').wins, 1, 'a grown-up reset in the other tab is respected');
  assert.deepEqual(saved(storage), { v: 2, wins: 1, wearing: { dino: null, monster: null }, daily: { date: today(), counts: {} } });
});

test('tampered or broken saved data falls back to a safe sticker book', () => {
  const tampered = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ wins: 1, wearing: { dino: 'propeller-cap', monster: '<img>' }, name: 'Kid' }) });
  const state = createRewards(tampered).getState();
  assert.equal(state.wins, 1);
  assert.deepEqual(state.wearing, { dino: null, monster: null }, 'costumes that are not unlocked are dropped');

  for (const raw of ['not json', JSON.stringify({ wins: -4 }), JSON.stringify({ wins: '9' }), JSON.stringify(null)]) {
    const rewards = createRewards(new MemoryStorage({ [STORAGE_KEY]: raw }));
    assert.equal(rewards.getState().wins, 0);
  }
  assert.equal(createRewards(new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ wins: 1e9 }) })).getState().wins, 9999);
});

test('without device storage, rewards still work for the visit', () => {
  for (const storage of [null, new BrokenStorage()]) {
    const rewards = createRewards(storage);
    rewards.recordWin('dino');
    const result = rewards.recordWin('dino');
    assert.equal(result.unlocked.id, 'crown');
    const state = rewards.getState();
    assert.equal(state.wins, 2);
    assert.equal(state.persistent, false);
    assert.equal(state.wearing.dino, 'crown');
    rewards.reset();
    assert.equal(rewards.getState().wins, 0);
  }
});

test('the grown-up reset clears the sticker book from the device', () => {
  const storage = new MemoryStorage();
  const rewards = createRewards(storage);
  rewards.recordWin('dino');
  rewards.recordWin('monster');
  rewards.reset();
  assert.equal(storage.getItem(STORAGE_KEY), null);
  const state = rewards.getState();
  assert.equal(state.wins, 0);
  assert.equal(state.collected, 0);
  assert.deepEqual(state.wearing, { dino: null, monster: null });
});

test('sticker and costume art is bundled, original WebP, small, and has bilingual names and emoji fallbacks', () => {
  const items = [...STICKERS, ...COSTUMES];
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
  for (const item of items) {
    assert.match(item.zh, /\p{Script=Han}/u);
    assert.match(item.en, /^[A-Z][a-z ]+$/);
    assert.ok(item.icon);
    const file = path.join(__dirname, item.image);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('latin1'), 'WEBP');
    assert.ok(bytes.length < 16 * 1024, `${item.image} stays small`);
  }
});

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
    this.id = '';
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

  get className() { return [...this.classes].join(' '); }
  set className(value) { this.classes = new Set(String(value).split(/\s+/).filter(Boolean)); }

  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  click() { if (!this.disabled) this.dispatch('click'); }
  dispatch(type, event = {}) {
    for (const callback of this.listeners[type] || []) callback({ currentTarget: this, target: this, ...event });
  }

  get textContent() {
    return this.children.length ? this.children.map(child => child.textContent).join('') : this.text;
  }

  set textContent(value) {
    this.replaceChildren();
    this.text = String(value);
  }

  adopt(child) {
    const node = typeof child === 'string' ? { textContent: child } : child;
    if (node.parentNode) node.parentNode.children.splice(node.parentNode.children.indexOf(node), 1);
    node.parentNode = this;
    return node;
  }

  contains(node) {
    return node === this || this.children.some(child => child instanceof FakeElement && child.contains(node));
  }

  append(...children) { this.children.push(...children.map(child => this.adopt(child))); }
  prepend(...children) { this.children.unshift(...children.map(child => this.adopt(child))); }
  insertBefore(child, before) {
    const node = this.adopt(child);
    this.children.splice(this.children.indexOf(before), 0, node);
    return node;
  }

  replaceChildren(...children) {
    this.children.forEach(child => { child.parentNode = null; });
    this.children = [];
    this.text = '';
    this.append(...children);
  }

  remove() {
    if (!this.parentNode) return;
    this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1);
    this.parentNode = null;
  }

  replaceWith(...nodes) {
    const parent = this.parentNode;
    if (!parent) return;
    const index = parent.children.indexOf(this);
    this.remove();
    parent.children.splice(index, 0, ...nodes.map(node => parent.adopt(node)));
  }

  matches(selector) {
    return selector.match(/[#.]?[\w-]+|\[[^\]]+\]/g).every(part => {
      if (part.startsWith('#')) return this.id === part.slice(1);
      if (part.startsWith('.')) return this.classes.has(part.slice(1));
      if (part.startsWith('[')) {
        const [, name, value] = part.match(/^\[data-([\w-]+)="([^"]*)"\]$/);
        return this.dataset[name.replace(/-(\w)/g, (_m, c) => c.toUpperCase())] === value;
      }
      return this.tagName === part.toUpperCase();
    });
  }

  querySelectorAll(selector) {
    const found = [];
    const walk = node => (node.children || []).forEach(child => {
      if (child instanceof FakeElement) {
        if (child.matches(selector)) found.push(child);
        walk(child);
      }
    });
    walk(this);
    return found;
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() { this.ownerDocument.activeElement = this; }
}

// Builds a page from the element IDs the scripts look up, so it tolerates new IDs added by other features.
function createPage({ nativeDialog = true } = {}) {
  const root = new FakeElement('main');
  root.className = 'page-shell';
  const document = { activeElement: null };
  const make = (tag, props = {}) => {
    const element = new FakeElement(tag);
    element.ownerDocument = document;
    Object.assign(element, props);
    return element;
  };
  document.documentElement = make('html');
  const actions = new Map();
  const action = name => {
    if (!actions.has(name)) {
      const node = make('button');
      node.dataset.rewardAction = name;
      actions.set(name, node);
      root.append(node);
    }
    return actions.get(name);
  };
  ['open', 'close', 'reset', 'confirm-reset', 'keep'].forEach(action);
  const byId = new Map();
  const element = id => {
    if (!byId.has(id)) {
      const node = make(id.endsWith('Button') ? 'button' : 'div', { id });
      byId.set(id, node);
      root.append(node);
    }
    return byId.get(id);
  };
  const heroFighter = element('heroFighter');
  heroFighter.append(element('heroEmoji'));
  const finishPanel = element('finishPanel');
  finishPanel.append(element('playAgainButton'));
  element('scoreStars').append(...Array.from({ length: 3 }, () => make('span')));
  element('rivalPower').append(...Array.from({ length: 3 }, () => make('span')));
  const championCards = ['dino', 'monster'].map(champion => {
    const card = make('button', { className: `champion-card${champion === 'dino' ? ' is-selected' : ''}` });
    card.dataset.champion = champion;
    card.append(make('span', { className: 'champion-emoji' }));
    root.append(card);
    return card;
  });
  const groups = {
    '.topic-tab': gameApi.TOPICS.map(topic => Object.assign(make('button', { className: 'topic-tab' }), { dataset: { topic } })),
    '.speech-language': ['en', 'zh', 'ja'].map(language => Object.assign(make('button', { className: 'speech-language' }), { dataset: { language } })),
  };
  Object.values(groups).flat().forEach(node => root.append(node));
  root.append(make('div', { className: 'speech-languages' }));
  root.append(make('div', { className: 'speech-playback' }));
  Object.assign(document, {
    querySelector: selector => {
      if (selector.startsWith('#') && !selector.includes(' ')) return element(selector.slice(1));
      if (root.matches(selector)) return root;
      return root.querySelector(selector);
    },
    querySelectorAll: selector => groups[selector] || root.querySelectorAll(selector),
    createElement: tag => make(tag),
    createTextNode: text => ({ textContent: String(text) }),
  });
  const stickerBook = element('stickerBook');
  if (nativeDialog) {
    stickerBook.showModal = function showModal() { this.open = true; };
    stickerBook.close = function close() { this.open = false; this.dispatch('close'); };
  }
  stickerBook.getBoundingClientRect = () => ({ left: 100, top: 40, right: 660, bottom: 700 });
  return { document, element, action, championCards, heroFighter, finishPanel };
}

class FakeAudio {
  pause() {}
  load() {}
  play() { return Promise.resolve(); }
}

function loadPage({ storage = new MemoryStorage(), withApp = false, recordWin, nativeDialog = true } = {}) {
  const page = createPage({ nativeDialog });
  const listeners = {};
  const window = {
    addEventListener(type, callback) { (listeners[type] ||= []).push(callback); },
    dispatch(type, event) { (listeners[type] || []).forEach(callback => callback(event)); },
    dispatchEvent(event) { this.dispatch(event.type, event); },
  };
  Object.defineProperty(window, 'localStorage', {
    get() {
      if (storage === 'throws') throw new Error('storage disabled');
      return storage;
    },
  });
  class FakeEvent {
    constructor(type) { this.type = type; }
  }
  const context = { window, document: page.document, Event: FakeEvent, Audio: FakeAudio, setInterval, clearInterval, setTimeout, clearTimeout };
  const run = file => vm.runInNewContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
  let game = null;
  run('i18n.js');
  if (withApp) {
    game = gameApi.createGame(() => 0.3);
    window.FriendlyArena = { ...gameApi, createGame: () => game };
    run('pacing.js');
    run('sounds.js');
    run('arena.js');
    run('app.js');
  }
  run('rewards.js');
  run('rewards-app.js');
  if (recordWin) window.ArenaRewards.recordWin = recordWin;
  return { ...page, window, game };
}

function winMatch(page) {
  for (let star = 1; star <= gameApi.GOAL_BY_LEVEL.easy; star += 1) {
    const answerId = page.game.getState().question.answerId;
    page.element('answerOptions').children.find(button => button.dataset.choice === answerId).click();
    if (star < gameApi.GOAL_BY_LEVEL.easy) page.element('nextButton').click();
  }
}

test('the rewards global exposes match recording, language switching, and a progress summary', () => {
  const page = loadPage();
  assert.deepEqual(Object.keys(page.window.ArenaRewards), ['recordWin', 'setLanguage', 'getSummary']);
  // getSummary() builds its object inside the page's own vm realm, so compare fields, not object identity/prototype.
  const summary = page.window.ArenaRewards.getSummary();
  assert.equal(summary.wins, 0);
  assert.equal(summary.collected, 0);
  assert.equal(summary.total, STICKERS.length);
});

test('winning a match in the game records exactly one reward for the chosen champion', () => {
  const wins = [];
  const page = loadPage({ withApp: true, recordWin: (champion, context) => wins.push([champion, context.language, context.level]) });
  page.championCards[1].click();
  winMatch(page);
  assert.equal(page.game.getState().finished, true);
  assert.deepEqual(wins, [['monster', 'en', 'easy']], 'the win is recorded with the chosen language and level, for the daily sticker cap');
  page.element('playAgainButton').click();
  winMatch(page);
  assert.deepEqual(wins, [['monster', 'en', 'easy'], ['monster', 'en', 'easy']]);
});

test('a win shows the new sticker, and a costume unlock dresses the champion with its picture', () => {
  const storage = new MemoryStorage();
  const page = loadPage({ storage });
  assert.match(page.element('rewardSummary').textContent, /0 \/ 12 stickers/);
  page.window.ArenaRewards.recordWin('dino');
  let note = page.finishPanel.querySelector('#rewardNote');
  assert.equal(page.finishPanel.children.at(-1).id, 'playAgainButton', 'the note sits before Play again');
  assert.match(note.textContent, /New sticker! Star/);
  assert.equal(note.getAttribute('role'), 'status');
  assert.equal(page.heroFighter.querySelector('.costume-overlay'), null);

  page.window.ArenaRewards.recordWin('dino');
  assert.equal(page.finishPanel.querySelectorAll('#rewardNote').length, 1, 'the old note is replaced');
  note = page.finishPanel.querySelector('#rewardNote');
  assert.match(note.textContent, /Rex gets a Crown to wear!/);
  const overlay = page.heroFighter.children[0];
  assert.ok(overlay.classList.contains('costume-overlay'));
  assert.equal(page.heroFighter.children[1].id, 'heroEmoji', 'the costume sits just above the champion picture');
  assert.equal(overlay.getAttribute('aria-hidden'), 'true');
  const [art] = overlay.children;
  assert.equal(art.src, './images/costume-crown.webp');
  assert.equal(art.alt, 'Crown');
  assert.equal(art.draggable, false);
  art.dispatch('error');
  assert.equal(overlay.textContent, '👑', 'the emoji stands in if the picture cannot load');
  assert.ok(page.championCards[0].querySelector('.costume-overlay'));
  assert.equal(page.championCards[1].querySelector('.costume-overlay'), null);
  assert.equal(saved(storage).wins, 2);

  page.championCards[0].classList.remove('is-selected');
  page.championCards[1].classList.add('is-selected');
  page.championCards[1].click();
  assert.equal(page.heroFighter.querySelector('.costume-overlay'), null, 'Bobo wears their own costume choice');
});

test('wins at the storage cap do not leave a sticker reward note', () => {
  const storage = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ v: 1, wins: 9998 }) });
  const page = loadPage({ storage });
  const finalReward = page.window.ArenaRewards.recordWin('dino');
  assert.equal(finalReward.wins, 9999);
  assert.equal(finalReward.rewarded, true);
  assert.match(page.finishPanel.querySelector('#rewardNote').textContent, /Another sticker!/);

  const cappedWin = page.window.ArenaRewards.recordWin('dino');
  assert.equal(cappedWin.wins, 9999);
  assert.equal(cappedWin.rewarded, false);
  assert.equal(saved(storage).wins, 9999);
  assert.equal(page.finishPanel.querySelector('#rewardNote'), null);
  page.action('open').click();
  assert.equal(page.element('stickerBookIntro').textContent, 'Your sticker book is full!');
});

test('the sticker book shows collected stickers, lets the child change costumes, and has a two-step grown-up reset', () => {
  const storage = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ v: 1, wins: 3, wearing: { dino: 'crown', monster: null } }) });
  const page = loadPage({ storage });
  page.action('open').click();
  assert.equal(page.element('stickerBook').open, true);
  assert.equal(page.document.activeElement, page.action('close'));
  assert.match(page.element('stickerBookIntro').textContent, /You earned 3 stickers! Each language and level pays a few a day/);
  const slots = page.element('stickerGrid').children;
  assert.equal(slots.length, STICKERS.length);
  assert.match(slots[0].textContent, /Star/);
  assert.equal(slots[0].querySelector('.reward-art').alt, 'Star');
  assert.ok(slots[3].classList.contains('is-empty'));
  assert.match(slots[3].textContent, /Sticker 4: still to find/);
  assert.match(page.element('rewardSaveNote').textContent, /Saved on this device only/);

  const rows = page.element('costumeRows');
  const choice = (champion, costume) => rows.querySelector(`[data-champion="${champion}"][data-costume="${costume}"]`);
  assert.equal(choice('dino', 'crown').getAttribute('aria-pressed'), 'true');
  assert.equal(choice('monster', 'party-hat').disabled, true);
  assert.match(choice('monster', 'party-hat').textContent, /4 stickersParty hat surprise/);
  assert.ok([...rows.querySelectorAll('button')].every(button => !button.id && button.getAttribute('aria-label') === null), 'costume choices stay out of analytics');
  choice('monster', 'crown').click();
  assert.equal(choice('monster', 'crown').getAttribute('aria-pressed'), 'true');
  assert.equal(page.document.activeElement, choice('monster', 'crown'));
  choice('dino', 'none').click();
  assert.deepEqual(saved(storage).wearing, { dino: null, monster: 'crown' });
  assert.equal(page.heroFighter.querySelector('.costume-overlay'), null);

  page.action('reset').click();
  assert.equal(page.action('confirm-reset').hidden, false);
  page.action('keep').click();
  assert.equal(saved(storage).wins, 3, 'keeping the stickers changes nothing');
  page.action('reset').click();
  page.action('confirm-reset').click();
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.match(page.element('resetStatus').textContent, /Sticker book cleared/);
  assert.ok(page.element('stickerGrid').children.every(slot => slot.classList.contains('is-empty')));
  assert.equal(page.championCards[1].querySelector('.costume-overlay'), null);

  page.action('close').click();
  assert.equal(page.element('stickerBook').open, false);
});

test('tapping inside the sticker book keeps it open, and only a tap on the backdrop closes it', () => {
  const page = loadPage();
  const book = page.element('stickerBook');
  page.action('open').click();
  book.dispatch('click', { clientX: 106, clientY: 300 });
  assert.equal(book.open, true, 'a tap in the book padding keeps it open');
  book.dispatch('click', { clientX: 380, clientY: 520 });
  assert.equal(book.open, true, 'a tap in a gap between sections keeps it open');
  book.dispatch('click', { target: page.action('reset'), clientX: 0, clientY: 0 });
  assert.equal(book.open, true, 'a keyboard press on a button inside keeps it open');
  book.dispatch('click', { clientX: 40, clientY: 300 });
  assert.equal(book.open, false, 'a tap on the backdrop closes it');
});

test('a storage refresh preserves costume focus and falls back when the choice locks', () => {
  const storage = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ v: 1, wins: 2, wearing: { dino: 'crown', monster: null } }) });
  const page = loadPage({ storage });
  page.action('open').click();
  const choice = () => page.element('costumeRows').querySelector('[data-champion="dino"][data-costume="crown"]');
  const original = choice();
  original.focus();

  const otherTab = createRewards(storage);
  otherTab.recordWin('monster');
  page.window.dispatch('storage', { key: STORAGE_KEY });
  assert.notEqual(choice(), original, 'the book rebuilt its costume choices');
  assert.equal(page.document.activeElement, choice(), 'focus follows the still-available choice');

  otherTab.reset();
  page.window.dispatch('storage', { key: STORAGE_KEY });
  assert.equal(choice().disabled, true, 'the reset made the focused choice unavailable');
  assert.equal(page.document.activeElement, page.action('close'), 'focus falls back to the dialog close button');
});

test('the non-modal fallback allows outside interaction and closes via its button', () => {
  const page = loadPage({ nativeDialog: false });
  const opener = page.action('open');
  const book = page.element('stickerBook');

  opener.focus();
  opener.click();
  assert.equal(book.getAttribute('open'), '');
  assert.equal(page.document.activeElement, page.action('close'));

  page.action('reset').click();
  assert.equal(book.getAttribute('open'), '', 'an outside page control does not dispatch a click to the book');
  assert.equal(page.action('confirm-reset').hidden, false, 'the page remains interactive without a modal dialog');

  page.action('close').click();
  assert.equal(book.getAttribute('open'), null);
  assert.equal(page.document.activeElement, opener);
});

test('progress saved in another tab shows up in this tab without a reload', () => {
  const storage = new MemoryStorage();
  const page = loadPage({ storage });
  const otherTab = createRewards(storage);
  otherTab.recordWin('dino');
  otherTab.recordWin('dino');
  page.window.dispatch('storage', { key: STORAGE_KEY });
  assert.match(page.element('rewardSummary').textContent, /2 \/ 12 stickers/);
  assert.ok(page.heroFighter.querySelector('.costume-overlay'), 'Rex wears the crown won in the other tab');

  otherTab.reset();
  page.window.dispatch('storage', { key: 'someOtherGame' });
  assert.match(page.element('rewardSummary').textContent, /2 \/ 12 stickers/, 'other saved keys are ignored');
  page.window.dispatch('storage', { key: STORAGE_KEY });
  assert.match(page.element('rewardSummary').textContent, /0 \/ 12 stickers/);
  assert.equal(page.heroFighter.querySelector('.costume-overlay'), null);
});

test('when the browser blocks storage the game still plays and the book says rewards last for this visit', () => {
  const page = loadPage({ storage: 'throws', withApp: true });
  winMatch(page);
  assert.match(page.finishPanel.querySelector('#rewardNote').textContent, /New sticker/);
  assert.match(page.element('rewardSummary').textContent, /1 \/ 12 stickers/);
  page.action('open').click();
  assert.match(page.element('rewardSaveNote').textContent, /stickers last for this visit/);
});

// --- Daily sticker cap: levelling up ---------------------------------------------------------

const win = (rewards, language, level, extra = {}) => rewards.recordWin('dino', { language, level, ...extra });

test('each level pays until its daily cap for the chosen language, and harder levels leave more room', () => {
  assert.ok(DAILY_CAPS.easy >= 1 && DAILY_CAPS.easy <= 3, 'easy pays only a small daily amount');
  assert.ok(DAILY_CAPS.harder > DAILY_CAPS.easy, 'harder has a higher cap');
  assert.equal(DAILY_CAPS.super, Infinity, 'super has no cap');

  const rewards = createRewards(new MemoryStorage());
  for (let index = 0; index < DAILY_CAPS.easy; index += 1) {
    const result = win(rewards, 'ja', 'easy');
    assert.equal(result.rewarded, true);
    assert.equal(result.capped, false);
  }
  const capped = win(rewards, 'ja', 'easy');
  assert.equal(capped.rewarded, false);
  assert.equal(capped.capped, true);
  assert.equal(capped.sticker, null);
  assert.equal(capped.unlocked, null);
  assert.equal(capped.wins, DAILY_CAPS.easy, 'a capped win adds no sticker');
  assert.equal(rewards.getState().wins, DAILY_CAPS.easy);
  assert.deepEqual(rewards.dailyProgress('ja', 'easy'), { earned: DAILY_CAPS.easy, cap: DAILY_CAPS.easy });
  assert.deepEqual(rewards.dailyProgress('ja', 'super'), { earned: 0, cap: null });

  assert.equal(win(rewards, 'ja', 'easy').rewarded, false, 'staying on the same language and level keeps paying nothing');
  assert.equal(win(rewards, 'en', 'easy').rewarded, true, 'another language earns again');
  assert.equal(win(rewards, 'zh', 'easy').rewarded, true);
  for (let index = 0; index < DAILY_CAPS.harder; index += 1) assert.equal(win(rewards, 'ja', 'harder').rewarded, true, 'a harder level earns again');
  assert.equal(win(rewards, 'ja', 'harder').rewarded, false, 'harder has a cap too');
  for (let index = 0; index < 30; index += 1) assert.equal(win(rewards, 'ja', 'super').rewarded, true, 'super never runs out');
});

test('the daily tally resets on the device\'s local date, and a saved tally from another day is ignored', () => {
  let now = new Date(2026, 8, 30, 23, 30);
  const storage = new MemoryStorage();
  const rewards = createRewards(storage, { now: () => now });
  for (let index = 0; index < DAILY_CAPS.easy; index += 1) win(rewards, 'ja', 'easy');
  assert.equal(win(rewards, 'ja', 'easy').capped, true);
  assert.deepEqual(saved(storage).daily, { date: '2026-09-30', counts: { 'ja:easy': DAILY_CAPS.easy } });

  now = new Date(2026, 8, 30, 23, 59, 59);
  assert.equal(win(rewards, 'ja', 'easy').capped, true, 'still the same local day a moment before midnight');
  now = new Date(2026, 9, 1, 0, 0, 1);
  assert.equal(win(rewards, 'ja', 'easy').rewarded, true, 'a new local day starts every pairing afresh');
  assert.deepEqual(saved(storage).daily, { date: '2026-10-01', counts: { 'ja:easy': 1 } });
  assert.equal(rewards.getState().wins, DAILY_CAPS.easy + 1);

  const withoutStorage = createRewards(null, { now: () => now });
  for (let index = 0; index < DAILY_CAPS.easy; index += 1) win(withoutStorage, 'en', 'easy');
  assert.equal(win(withoutStorage, 'en', 'easy').capped, true, 'the cap works without device storage too');
  now = new Date(2026, 9, 2, 8, 0);
  assert.equal(win(withoutStorage, 'en', 'easy').rewarded, true, 'and rolls over without device storage');
});

test('a win without a language and level context always pays a sticker, and unknown values are not capped', () => {
  const rewards = createRewards(new MemoryStorage());
  for (let index = 0; index < 6; index += 1) assert.equal(rewards.recordWin('dino').rewarded, true);
  for (let index = 0; index < 6; index += 1) assert.equal(win(rewards, 'fr', 'easy').rewarded, true);
  assert.equal(win(rewards, 'ja', 'expert').rewarded, true);
});

test('the capped-win advice points to a harder level and/or another language, never a locked level', () => {
  const advice = (rewards, language, level, allowedLevels) => win(rewards, language, level, { allowedLevels }).advice;
  const exhaust = (rewards, language, level) => { for (let index = 0; index < DAILY_CAPS[level]; index += 1) win(rewards, language, level); };
  const rewards = createRewards(new MemoryStorage());
  exhaust(rewards, 'ja', 'easy');
  assert.equal(advice(rewards, 'ja', 'easy'), 'harder-or-language');
  assert.equal(advice(rewards, 'ja', 'easy', ['easy']), 'language', 'harder levels locked away: only another language is offered');
  assert.equal(advice(rewards, 'ja', 'easy', ['easy', 'harder']), 'harder-or-language');
  exhaust(rewards, 'ja', 'harder');
  assert.equal(advice(rewards, 'ja', 'harder'), 'harder-or-language', 'super is still a harder level');
  assert.equal(advice(rewards, 'ja', 'harder', ['harder']), 'language');
  assert.equal(advice(rewards, 'ja', 'harder', ['harder', 'super']), 'harder-or-language');

  exhaust(rewards, 'en', 'easy');
  exhaust(rewards, 'zh', 'easy');
  assert.equal(advice(rewards, 'ja', 'easy', ['easy']), 'tomorrow', 'with easy locked in every language there is nothing left today');
  assert.equal(advice(rewards, 'en', 'easy'), 'harder-or-language');
  assert.equal(advice(rewards, 'en', 'easy', ['easy', 'harder']), 'harder-or-language', 'harder is open in English and other languages');
  exhaust(rewards, 'en', 'harder');
  exhaust(rewards, 'zh', 'harder');
  assert.equal(advice(rewards, 'en', 'easy', ['easy', 'harder']), 'tomorrow');
  assert.equal(advice(rewards, 'en', 'easy', ['easy', 'harder', 'super']), 'harder-or-language');

  // Easy locked by a grown-up: the player is on harder, so the message never sends them back to easy.
  const lockedEasy = createRewards(new MemoryStorage());
  exhaust(lockedEasy, 'ja', 'harder');
  assert.equal(advice(lockedEasy, 'ja', 'harder', ['harder']), 'language');
});

test('an earlier save (v1: wins and costumes only) migrates in place without losing anything', () => {
  const v1 = { v: 1, wins: 7, wearing: { dino: 'flower-crown', monster: 'crown' } };
  const storage = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify(v1) });
  const rewards = createRewards(storage);
  const before = rewards.getState();
  assert.equal(before.wins, 7);
  assert.equal(before.collected, 7);
  assert.deepEqual(before.wearing, { dino: 'flower-crown', monster: 'crown' });
  assert.equal(before.costumes.filter(costume => costume.unlocked).length, 3);
  assert.equal(storage.getItem(STORAGE_KEY), JSON.stringify(v1), 'reading alone never rewrites the save');

  const first = win(rewards, 'ja', 'easy');
  assert.equal(first.rewarded, true, 'nothing earned before the update counts against today\'s cap');
  assert.equal(first.wins, 8);
  assert.equal(first.sticker.id, STICKERS[7].id);
  assert.deepEqual(saved(storage), { v: 2, wins: 8, wearing: { dino: 'propeller-cap', monster: 'crown' }, daily: { date: today(), counts: { 'ja:easy': 1 } } });
  assert.deepEqual(Object.keys(storage.items), [STORAGE_KEY], 'still the one device-only key');
});

test('a tampered daily tally is cleaned, and an older client rewriting the save only forgets the tally', () => {
  const messy = { v: 2, wins: 2, wearing: {}, daily: { date: today(), counts: { 'ja:easy': 99999, 'xx:easy': 3, 'en:harder': -2, 'zh:super': 1.5, 'en:easy': '2' } } };
  const storage = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify(messy) });
  const rewards = createRewards(storage);
  assert.equal(win(rewards, 'ja', 'easy').capped, true, 'a huge tally is capped, not trusted');
  assert.equal(win(rewards, 'en', 'harder').rewarded, true);
  assert.equal(win(rewards, 'zh', 'super').rewarded, true);
  assert.equal(win(rewards, 'en', 'easy').rewarded, true);
  assert.deepEqual(saved(storage).daily.counts, { 'ja:easy': 999, 'en:harder': 1, 'zh:super': 1, 'en:easy': 1 }, 'only whole positive counts for known pairings are kept');

  for (const daily of [null, 'x', [], { date: 5, counts: 3 }, { date: today() }]) {
    const other = createRewards(new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ v: 2, wins: 1, daily }) }));
    assert.equal(other.getState().wins, 1);
    assert.equal(win(other, 'ja', 'easy').rewarded, true);
  }

  // The earlier client only knows wins and wearing; it drops the tally when it saves, which is harmless.
  const old = { v: 1, wins: 3, wearing: saved(storage).wearing };
  storage.setItem(STORAGE_KEY, JSON.stringify(old));
  assert.equal(createRewards(storage).getState().wins, 3);
});

test('a capped win in the page celebrates with a friendly note, not a sticker, and the note follows the language', () => {
  const storage = new MemoryStorage();
  const page = loadPage({ storage });
  for (let index = 0; index < DAILY_CAPS.easy; index += 1) win(page.window.ArenaRewards, 'ja', 'easy');
  const before = saved(storage).wins;
  const result = page.window.ArenaRewards.recordWin('dino', { language: 'ja', level: 'easy', allowedLevels: ['easy'] });
  assert.equal(result.capped, true);
  assert.equal(saved(storage).wins, before, 'the sticker book is untouched');
  const note = page.finishPanel.querySelector('#rewardNote');
  assert.ok(note.classList.contains('cap-note'));
  assert.equal(note.getAttribute('role'), 'status');
  assert.match(note.textContent, /Great win! To earn your next sticker, try another language\./);
  assert.doesNotMatch(note.textContent, /New sticker|Another sticker/);
  assert.equal(page.finishPanel.children.at(-1).id, 'playAgainButton', 'the note sits before Play again');

  page.window.ArenaRewards.setLanguage('zh', 'en');
  assert.match(page.finishPanel.querySelector('#rewardNote').textContent, /你贏了！想拿下一張貼紙，請換一種語言試試。/);
  assert.match(page.finishPanel.querySelector('#rewardNote').textContent, /Great win!/, 'the second language shows too');
  page.window.ArenaRewards.recordWin('dino', { language: 'ja', level: 'super' });
  assert.match(page.finishPanel.querySelector('#rewardNote').textContent, /新貼紙|又一張貼紙/, 'the next paid win shows its sticker again');
});
