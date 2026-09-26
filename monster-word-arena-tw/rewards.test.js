'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { STORAGE_KEY, STICKERS, COSTUMES, createRewards } = require('./rewards.js');
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

test('progress saves only the win count and chosen costumes on the device', () => {
  const storage = new MemoryStorage();
  const rewards = createRewards(storage);
  rewards.recordWin('dino');
  rewards.recordWin('dino');
  assert.deepEqual(Object.keys(storage.items), [STORAGE_KEY]);
  assert.deepEqual(saved(storage), { v: 1, wins: 2, wearing: { dino: 'crown', monster: null } });

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
  assert.deepEqual(saved(storage), { v: 1, wins: 6, wearing: { dino: 'party-hat', monster: 'flower-crown' } });

  otherTab.reset();
  assert.equal(staleTab.getState().wins, 0, 'a grown-up reset in the other tab shows up right away');
  assert.equal(staleTab.recordWin('dino').wins, 1, 'a grown-up reset in the other tab is respected');
  assert.deepEqual(saved(storage), { v: 1, wins: 1, wearing: { dino: null, monster: null } });
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
function createPage() {
  const root = new FakeElement('main');
  const document = { activeElement: null };
  const make = (tag, props = {}) => {
    const element = new FakeElement(tag);
    element.ownerDocument = document;
    Object.assign(element, props);
    return element;
  };
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
  Object.assign(document, {
    querySelector: selector => (selector.startsWith('#') && !selector.includes(' ') ? element(selector.slice(1)) : root.querySelector(selector)),
    querySelectorAll: selector => groups[selector] || root.querySelectorAll(selector),
    createElement: tag => make(tag),
    createTextNode: text => ({ textContent: String(text) }),
  });
  element('stickerBook').showModal = function showModal() { this.open = true; };
  element('stickerBook').close = function close() { this.open = false; this.dispatch('close'); };
  element('stickerBook').getBoundingClientRect = () => ({ left: 100, top: 40, right: 660, bottom: 700 });
  return { document, element, action, championCards, heroFighter, finishPanel };
}

class FakeAudio {
  pause() {}
  load() {}
  play() { return Promise.resolve(); }
}

function loadPage({ storage = new MemoryStorage(), withApp = false, recordWin } = {}) {
  const page = createPage();
  const listeners = {};
  const window = {
    addEventListener(type, callback) { (listeners[type] ||= []).push(callback); },
    dispatch(type, event) { (listeners[type] || []).forEach(callback => callback(event)); },
  };
  Object.defineProperty(window, 'localStorage', {
    get() {
      if (storage === 'throws') throw new Error('storage disabled');
      return storage;
    },
  });
  const context = { window, document: page.document, Audio: FakeAudio, setInterval, clearInterval };
  const run = file => vm.runInNewContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
  let game = null;
  if (withApp) {
    game = gameApi.createGame(() => 0.3);
    window.FriendlyArena = { ...gameApi, createGame: () => game };
    run('sounds.js');
    run('app.js');
  }
  run('rewards.js');
  run('rewards-app.js');
  if (recordWin) window.ArenaRewards.recordWin = recordWin;
  return { ...page, window, game };
}

function winMatch(page) {
  for (let star = 1; star <= gameApi.GOAL; star += 1) {
    const answerId = page.game.getState().question.answerId;
    page.element('answerOptions').children.find(button => button.dataset.choice === answerId).click();
    if (star < gameApi.GOAL) page.element('nextButton').click();
  }
}

test('winning a match in the game records exactly one reward for the chosen champion', () => {
  const wins = [];
  const page = loadPage({ withApp: true, recordWin: champion => wins.push(champion) });
  page.championCards[1].click();
  winMatch(page);
  assert.equal(page.game.getState().finished, true);
  assert.deepEqual(wins, ['monster']);
  page.element('playAgainButton').click();
  winMatch(page);
  assert.deepEqual(wins, ['monster', 'monster']);
});

test('a win shows the new sticker, and a costume unlock dresses the champion with its picture', () => {
  const storage = new MemoryStorage();
  const page = loadPage({ storage });
  assert.match(page.element('rewardSummary').textContent, /0 \/ 12 stickers/);
  page.window.ArenaRewards.recordWin('dino');
  let note = page.finishPanel.querySelector('#rewardNote');
  assert.equal(page.finishPanel.children.at(-1).id, 'playAgainButton', 'the note sits before Play again');
  assert.match(note.textContent, /New sticker! 新貼紙！ Star · 星星/);
  assert.equal(note.getAttribute('role'), 'status');
  assert.equal(page.heroFighter.querySelector('.costume-overlay'), null);

  page.window.ArenaRewards.recordWin('dino');
  assert.equal(page.finishPanel.querySelectorAll('#rewardNote').length, 1, 'the old note is replaced');
  note = page.finishPanel.querySelector('#rewardNote');
  assert.match(note.textContent, /Rex gets a Crown to wear! 雷克斯戴上皇冠了！/);
  const overlay = page.heroFighter.children[0];
  assert.ok(overlay.classList.contains('costume-overlay'));
  assert.equal(page.heroFighter.children[1].id, 'heroEmoji', 'the costume sits just above the champion picture');
  assert.equal(overlay.getAttribute('aria-hidden'), 'true');
  const [art] = overlay.children;
  assert.equal(art.src, './images/costume-crown.webp');
  assert.equal(art.alt, '皇冠 Crown');
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

test('the sticker book shows collected stickers, lets the child change costumes, and has a two-step grown-up reset', () => {
  const storage = new MemoryStorage({ [STORAGE_KEY]: JSON.stringify({ v: 1, wins: 3, wearing: { dino: 'crown', monster: null } }) });
  const page = loadPage({ storage });
  page.action('open').click();
  assert.equal(page.element('stickerBook').open, true);
  assert.equal(page.document.activeElement, page.action('close'));
  const slots = page.element('stickerGrid').children;
  assert.equal(slots.length, STICKERS.length);
  assert.match(slots[0].textContent, /星星Star/);
  assert.equal(slots[0].querySelector('.reward-art').alt, '星星 Star');
  assert.ok(slots[3].classList.contains('is-empty'));
  assert.match(slots[3].textContent, /Sticker 4: still to find/);
  assert.match(page.element('rewardSaveNote').textContent, /Saved on this device only/);

  const rows = page.element('costumeRows');
  const choice = (champion, costume) => rows.querySelector(`[data-champion="${champion}"][data-costume="${costume}"]`);
  assert.equal(choice('dino', 'crown').getAttribute('aria-pressed'), 'true');
  assert.equal(choice('monster', 'party-hat').disabled, true);
  assert.match(choice('monster', 'party-hat').textContent, /贏 4 次4 winsParty hat surprise/);
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
