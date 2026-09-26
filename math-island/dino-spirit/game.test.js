const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const gameScript = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');

class FakeClassList {
  constructor() { this.values = new Set(); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
  toggle(value, force) {
    const enabled = force === undefined ? !this.contains(value) : force;
    if (enabled) this.add(value);
    else this.remove(value);
    return enabled;
  }
}

class FakeElement {
  constructor(document, id = '') {
    this.document = document;
    this.id = id;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.classList = new FakeClassList();
    this.dataset = {};
    this.style = {};
    this.hidden = false;
    this.disabled = false;
    this.textContent = '';
    this.parentElement = null;
  }
  get lastElementChild() { return this.children[this.children.length - 1]; }
  append(element) {
    element.parentElement = this;
    this.children.push(element);
  }
  replaceChildren(...children) {
    this.children = [];
    children.forEach((child) => this.append(child));
  }
  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  insertAdjacentHTML(_position, html) { this.insertedHtml = (this.insertedHtml || '') + html; }
  querySelector(selector) {
    if (selector === 'button') return this.children.find((child) => child.type === 'button') || null;
    return null;
  }
  querySelectorAll(selector) {
    if (selector === 'button') return this.children.filter((child) => child.type === 'button');
    return [];
  }
  contains(element) {
    return this.children.includes(element) || this.children.some((child) => child.contains(element));
  }
  closest(selector) {
    if (selector.startsWith('#') && this.id === selector.slice(1)) return this;
    return this.parentElement?.closest(selector) || null;
  }
  focus() { this.document.activeElement = this; }
  click() {
    if (this.disabled) return;
    const event = { target: this, preventDefault() {} };
    (this.listeners.click || []).forEach((listener) => listener(event));
    this.document.dispatchEvent('click', event);
  }
}

class FakeDocument {
  constructor() {
    this.elements = new Map();
    this.listeners = {};
    this.body = new FakeElement(this, 'body');
    this.activeElement = this.body;
    [
      'progressText', 'progressBar', 'progressFill', 'progressDots', 'questionLabel',
      'instruction', 'equation', 'additionModeButton', 'subtractionModeButton', 'answers',
      'speakButton', 'speechStatus', 'feedback', 'nextButton', 'questionArea', 'finishPanel',
      'restartButton', 'replayButton', 'forestHint',
    ].forEach((id) => this.elements.set(`#${id}`, new FakeElement(this, id)));
    this.elements.set('.quiz-card', new FakeElement(this));
    this.elements.set('.forest-card', new FakeElement(this));
    this.elements.get('#additionModeButton').setAttribute('aria-pressed', 'false');
    this.elements.get('#subtractionModeButton').setAttribute('aria-pressed', 'true');
    this.elements.get('#speakButton').append(new FakeElement(this));
    this.elements.get('#speakButton').append(new FakeElement(this));
    this.forestLights = Array.from({ length: 5 }, () => new FakeElement(this));
  }
  querySelector(selector) { return this.elements.get(selector) || null; }
  querySelectorAll(selector) { return selector === '.forest-light' ? this.forestLights : []; }
  createElement() { return new FakeElement(this); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatchEvent(type, event) { (this.listeners[type] || []).forEach((listener) => listener(event)); }
}

function startGame({ play } = {}) {
  const document = new FakeDocument();
  let audio;
  class FakeAudio {
    constructor() {
      audio = this;
      this.attempts = [];
      this.currentTime = 0;
    }
    load() {}
    pause() {}
    play() {
      this.attempts.push(this.src);
      return play ? play(this.attempts.length, this.src) : Promise.resolve();
    }
  }
  const deterministicMath = Object.create(Math);
  deterministicMath.random = () => 0.999;
  vm.runInNewContext(gameScript, { document, Audio: FakeAudio, Math: deterministicMath });
  return { document, elements: document.elements, audio };
}

function problemFrom(equation) {
  const match = equation.getAttribute('aria-label').match(/^(\d+) (たす|ひく) (\d+) は いくつ？$/);
  assert.ok(match, `unexpected equation label: ${equation.getAttribute('aria-label')}`);
  return { left: Number(match[1]), operation: match[2], right: Number(match[3]) };
}

function answerCurrentProblem(elements) {
  const { left, operation, right } = problemFrom(elements.get('#equation'));
  const answer = operation === 'ひく' ? left - right : left + right;
  const choices = elements.get('#answers').children;
  assert.ok(choices.every((choice) => Number(choice.textContent) >= 0), 'answer choices must stay non-negative');
  const correctChoice = choices.find((choice) => Number(choice.textContent) === answer);
  assert.ok(correctChoice, `missing correct answer ${answer}`);
  correctChoice.click();
  assert.equal(elements.get('#nextButton').hidden, false);
  elements.get('#nextButton').click();
  return { left, operation, right, answer };
}

test('addition stays available from the toggle and its bundled prompt autoplays', () => {
  const { elements, audio } = startGame();
  elements.get('#additionModeButton').click();
  const expected = [
    { left: 2, right: 1 },
    { left: 4, right: 1 },
    { left: 3, right: 4 },
    { left: 5, right: 2 },
    { left: 6, right: 3 },
  ];
  assert.equal(audio.attempts.length, 2, 'switching modes should autoplay the new prompt');
  assert.equal(elements.get('#additionModeButton').getAttribute('aria-pressed'), 'true');
  assert.equal(elements.get('#subtractionModeButton').getAttribute('aria-pressed'), 'false');
  for (const question of expected) {
    const current = problemFrom(elements.get('#equation'));
    assert.deepEqual(current, { ...question, operation: 'たす' });
    assert.equal(audio.src, `./audio/question-${question.left}-${question.right}.mp3`);
    assert.ok(fs.existsSync(path.join(__dirname, 'audio', `question-${question.left}-${question.right}.mp3`)));
    answerCurrentProblem(elements);
  }
  assert.equal(elements.get('#finishPanel').hidden, false);
});

test('subtraction is the default mode, stays non-negative, and autoplays bundled audio', () => {
  const { elements, audio } = startGame();
  assert.equal(audio.attempts.length, 1, 'initial prompt should autoplay');
  assert.equal(elements.get('#subtractionModeButton').getAttribute('aria-pressed'), 'true');
  assert.equal(elements.get('#additionModeButton').getAttribute('aria-pressed'), 'false');
  assert.equal(elements.get('.quiz-card').getAttribute('aria-label'), 'ひきざんクイズ');
  assert.match(elements.get('#instruction').textContent, /のこり/);

  const expected = [
    { left: 2, right: 1 },
    { left: 4, right: 1 },
    { left: 6, right: 2 },
    { left: 8, right: 3 },
    { left: 10, right: 4 },
  ];
  for (const question of expected) {
    const current = problemFrom(elements.get('#equation'));
    assert.deepEqual(current, { ...question, operation: 'ひく' });
    assert.ok(current.left >= current.right, 'subtraction minuend must be at least the subtrahend');
    assert.ok(current.left - current.right >= 0, 'subtraction result must be non-negative');
    assert.equal(audio.src, `./audio/subtraction-${question.left}-${question.right}.wav`);
    assert.ok(fs.existsSync(path.join(__dirname, 'audio', `subtraction-${question.left}-${question.right}.wav`)));
    answerCurrentProblem(elements);
  }
  assert.equal(elements.get('#finishPanel').hidden, false);
});

test('autoplay blocked by browser policy retries on the first ordinary interaction', async () => {
  const { document, elements, audio } = startGame({
    play: (attempt) => attempt === 1
      ? Promise.reject(Object.assign(new Error('autoplay denied'), { name: 'NotAllowedError' }))
      : Promise.resolve(),
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(audio.attempts.length, 1);
  assert.equal(elements.get('#speechStatus').textContent, '', 'autoplay policy should not show a fake audio failure');

  document.dispatchEvent('click', { target: elements.get('#answers').children[0] });
  assert.equal(audio.attempts.length, 2, 'first game interaction should retry the current prompt');
  assert.equal(audio.attempts[0], audio.attempts[1]);
});
