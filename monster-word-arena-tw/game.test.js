'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');
const { GOAL, TOPICS, REACTIONS, createGame, createSpeechPlayer } = require('./game.js');
const { EFFECTS, EFFECT_LEVEL, MUSIC_LEVEL, createSoundBoard } = require('./sounds.js');
const prompts = require('./audio/prompts.json');
const reactions = require('./audio/reactions.json');

const steadyRandom = () => 0.3;

// index.html's <script src> list in document order, read with a real HTML parser.
const PAGE_SCRIPTS = JSON.parse(execFileSync('python3', ['-B', '-c', `
import json
from html.parser import HTMLParser

class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []

    def handle_starttag(self, tag, attrs):
        src = dict(attrs).get('src')
        if tag == 'script' and src:
            self.sources.append(src)

parser = Scripts()
parser.feed(open('index.html', encoding='utf-8').read())
print(json.dumps(parser.sources))
`], { cwd: __dirname, encoding: 'utf8' }));

function answerCorrectly(game) {
  const state = game.getState();
  return game.answer(state.question.answerId);
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
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      toggle: (name, force = !classes.has(name)) => {
        if (force) classes.add(name);
        else classes.delete(name);
        return force;
      },
      contains: name => classes.has(name),
    };
  }

  addEventListener(type, callback) {
    (this.listeners[type] ||= []).push(callback);
  }

  click() {
    this.dispatch('click');
  }

  dispatch(type) {
    for (const callback of this.listeners[type] || []) callback({ currentTarget: this, target: this });
  }

  get textContent() {
    return this.children.length ? this.children.map(child => child.textContent).join('') : this.text;
  }

  set textContent(value) {
    this.replaceChildren();
    this.text = String(value);
  }

  append(...children) {
    children.forEach(child => { child.parentNode = this; });
    this.children.push(...children);
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
    return selector === 'button' ? this.children.filter(child => child.tagName === 'BUTTON') : [];
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  focus() {}
}

class FakeAudio {
  pause() {}
  load() {}
  play() { return Promise.resolve(); }
}

function clickAnswer(app, game, correct) {
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

function createAppFixture(game) {
  const ids = [
    'answerOptions', 'questionEnglish', 'questionChinese', 'questionPicture', 'equation', 'feedback',
    'nextButton', 'questionPanel', 'finishPanel', 'arenaStage', 'arenaMessage', 'scoreStars',
    'scoreCount', 'speechStatus', 'muteButton', 'heroEmoji', 'heroName', 'buddyEmoji', 'buddyName',
    'rivalPower', 'moveBubble', 'restartButton', 'playAgainButton', 'replayPromptButton', 'musicButton',
    'speechControls', 'speechInvite',
  ];
  const elements = new Map(ids.map(id => [`#${id}`, new FakeElement(id === 'nextButton' ? 'button' : 'div')]));
  elements.get('#scoreStars').children = Array.from({ length: 3 }, () => new FakeElement('span'));
  elements.get('#rivalPower').children = Array.from({ length: 3 }, () => new FakeElement('span'));
  const championCards = ['dino', 'monster'].map(champion => {
    const card = new FakeElement('button');
    card.dataset.champion = champion;
    return card;
  });
  const topicTabs = ['math', 'colors', 'face', 'family'].map(topic => {
    const tab = new FakeElement('button');
    tab.dataset.topic = topic;
    return tab;
  });
  const speechLanguageButtons = ['en', 'zh', 'ja'].map(language => {
    const button = new FakeElement('button');
    button.dataset.language = language;
    return button;
  });
  const document = {
    querySelector: selector => elements.get(selector),
    querySelectorAll: selector => ({
      '.champion-card': championCards,
      '.topic-tab': topicTabs,
      '.speech-language': speechLanguageButtons,
    })[selector] || [],
    createElement: tagName => new FakeElement(tagName),
    createTextNode: text => ({ textContent: String(text) }),
  };
  const effects = [];
  const sound = { board: null, ctx: null, timers: createFakeTimers() };
  const window = { AudioContext: FakeAudioContext };
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
  // Runs the scripts in the order index.html lists them, as the browser does.
  const page = vm.createContext({ window, document, Audio: RecordingAudio });
  for (const src of PAGE_SCRIPTS) vm.runInContext(fs.readFileSync(path.join(__dirname, src), 'utf8'), page, { filename: src });
  return {
    elements, played, effects, sound, audioElements, audioState, championCards, speechLanguageButtons, topicTabs,
    answerOptions: elements.get('#answerOptions'), nextButton: elements.get('#nextButton'),
    muteButton: elements.get('#muteButton'), musicButton: elements.get('#musicButton'),
    // Moves the fake audio clock past every effect's anti-pile-up gap.
    later(seconds = 2) { if (sound.ctx) sound.ctx.currentTime += seconds; },
  };
}

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

test('word challenges use bilingual Taiwan Traditional Chinese vocabulary', () => {
  const game = createGame(steadyRandom);
  const expected = {
    colors: ['紅色', '黃色', '綠色'],
    face: ['眼睛', '鼻子', '耳朵'],
    family: ['爸爸', '媽媽', '哥哥', '姊姊'],
  };

  for (const topic of ['colors', 'face', 'family']) {
    game.chooseTopic(topic);
    const question = game.getState().question;
    const vocabulary = question.options.map(option => option.zh);
    assert.ok(vocabulary.every(word => expected[topic].includes(word)), `${topic} uses expected Traditional Chinese`);
    const target = question.options.find(option => option.id === question.answerId);
    assert.ok(target);
    assert.ok(question.promptEn.toLowerCase().includes(target.en.toLowerCase()));
    assert.ok(question.promptZh.includes(target.zh));
    assert.ok(question.options.every(option => option.en));
  }
  assert.deepEqual(TOPICS, ['math', 'colors', 'face', 'family']);
});

test('every word prompt shows the picture of its matching answer for pre-readers', () => {
  for (const seed of [0, 0.4, 0.99]) {
    const game = createGame(() => seed);
    for (const topic of ['colors', 'face', 'family']) {
      game.chooseTopic(topic);
      const question = game.getState().question;
      const target = question.options.find(option => option.id === question.answerId);
      assert.equal(question.picture, target.icon, `${topic} picture matches the answer`);
      assert.equal(question.options.filter(option => option.icon === question.picture).length, 1);
      if (topic === 'colors') continue;
      assert.equal(question.pictureImage, target.image, `${topic} art matches the answer`);
      assert.equal(question.options.filter(option => option.image === question.pictureImage).length, 1);
    }
  }
});

test('face and family pictures are bundled original art sized for a phone page', () => {
  const game = createGame(steadyRandom);
  const options = ['face', 'family'].flatMap(topic => {
    game.chooseTopic(topic);
    return game.getState().question.options;
  });
  assert.deepEqual(options.map(option => option.id).sort(), ['brother', 'dad', 'ears', 'eyes', 'mom', 'nose', 'sister']);
  let totalBytes = 0;
  for (const option of options) {
    assert.match(option.image, /^\.\/images\/(face|family)-[a-z]+\.webp$/);
    assert.ok(option.icon, `${option.id} keeps an emoji fallback`);
    const art = fs.readFileSync(path.join(__dirname, option.image));
    assert.equal(art.toString('latin1', 0, 4), 'RIFF', `${option.image} is a RIFF file`);
    assert.equal(art.toString('latin1', 8, 16), 'WEBPVP8X', `${option.image} is an extended WebP`);
    assert.ok(art[20] & 0x10, `${option.image} has a transparent alpha channel`);
    assert.equal(art.readUIntLE(24, 3) + 1, 192, `${option.image} is 192px wide`);
    assert.equal(art.readUIntLE(27, 3) + 1, 192, `${option.image} is 192px tall`);
    assert.ok(art.length < 16 * 1024, `${option.image} stays small`);
    totalBytes += art.length;
  }
  assert.ok(totalBytes < 80 * 1024, 'all seven pictures together stay light for a phone');
});

test('each correct answer knocks one pip off the sparring buddy with no penalty for misses', () => {
  const game = createGame(steadyRandom);
  assert.equal(game.getState().rivalPower, GOAL);
  const { question } = game.getState();
  const wrong = question.options.find(option => option.id !== question.answerId);
  game.answer(wrong.id);
  assert.equal(game.getState().rivalPower, GOAL);
  for (let hit = 1; hit <= GOAL; hit += 1) {
    if (hit > 1) game.nextQuestion();
    answerCorrectly(game);
    assert.equal(game.getState().rivalPower, GOAL - hit);
  }
  assert.equal(game.restart().rivalPower, GOAL);
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

test('a solved question cannot award twice; three stars finish the friendly match', () => {
  const game = createGame(steadyRandom);
  for (let star = 1; star <= GOAL; star += 1) {
    if (star > 1) assert.equal(game.nextQuestion(), true);
    const result = answerCorrectly(game);
    assert.equal(result, star === GOAL ? 'finished' : 'correct');
    assert.equal(game.answer(game.getState().question.answerId), 'ignored');
  }
  assert.equal(game.getState().stars, GOAL);
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
    'colors-red', 'colors-yellow', 'colors-green',
    'face-eyes', 'face-nose', 'face-ears',
    'family-dad', 'family-mom', 'family-brother', 'family-sister',
  ].sort();
  assert.deepEqual(Object.keys(prompts).sort(), expected);

  for (const [audioId, translations] of Object.entries(prompts)) {
    assert.ok(translations.en, `${audioId} has English narration`);
    assert.ok(translations.zh, `${audioId} has Taiwan Mandarin narration`);
    assert.ok(translations.ja, `${audioId} has Japanese narration`);
    assert.match(translations.zh, /[\u3400-\u9fff]/, `${audioId} uses Chinese characters`);
    assert.match(translations.ja, /[\u3040-\u30ff\u3400-\u9fff]/, `${audioId} uses Japanese writing`);
    for (const language of ['en', 'zh', 'ja']) {
      const audioPath = path.join(__dirname, 'audio', language, `${audioId}.mp3`);
      assert.ok(fs.existsSync(audioPath), `${audioPath} is bundled`);
      assert.ok(fs.statSync(audioPath).size > 1024, `${audioPath} contains audio`);
    }
  }
});

test('every spoken reaction has bundled English, Taiwan Mandarin, and Japanese audio', () => {
  const reactionIds = Object.values(REACTIONS).flat();
  assert.deepEqual(Object.keys(REACTIONS), ['praise', 'try-again', 'finish']);
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
  assert.match(reactions['reaction-try-again-1'].zh, /[\u3400-\u9fff]/);
  assert.match(reactions['reaction-finish-1'].ja, /[\u3040-\u30ff]/);
});

test('Gemini generator config covers all languages and routes only the sister clip through the voiced spelling', () => {
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
  const audioText = new Map(generated.clips.map(([language, audioId, text]) => [`${language}/${audioId}`, text]));
  for (const [audioId, translations] of Object.entries({ ...prompts, ...reactions })) {
    for (const language of ['en', 'zh', 'ja']) {
      const expectedText = language === 'zh' && audioId === 'family-sister' ? '誰是姐姐？' : translations[language];
      assert.equal(audioText.get(`${language}/${audioId}`), expectedText);
    }
  }

  const game = createGame(() => 0.99);
  game.chooseTopic('family');
  const sisterQuestion = game.getState().question;
  assert.equal(sisterQuestion.promptZh, '誰是姊姊？');
  assert.equal(sisterQuestion.options.find(option => option.id === 'sister').zh, '姊姊');
});

test('restart and play again stay silent until the child chooses a voice', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  app.elements.get('#restartButton').click();
  app.elements.get('#playAgainButton').click();
  assert.deepEqual(app.played, []);

  app.speechLanguageButtons.find(button => button.dataset.language === 'zh').click();
  assert.equal(app.played.length, 1);
  app.elements.get('#restartButton').click();
  assert.equal(app.played.length, 2);
  assert.match(app.played[1], /^\.\/audio\/zh\//);
});

test('face and family art renders with bilingual labels and falls back to emoji if a picture fails', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const questionPicture = app.elements.get('#questionPicture');
  app.topicTabs.find(tab => tab.dataset.topic === 'face').click();

  const { question } = game.getState();
  const answer = question.options.find(option => option.id === question.answerId);
  const [art] = questionPicture.children;
  assert.equal(art.tagName, 'IMG');
  assert.equal(art.src, question.pictureImage);
  assert.equal(art.alt, `${answer.zh} ${answer.en}`, 'the question picture carries its answer\'s bilingual label');
  assert.equal(art.draggable, false, 'pressing the picture never starts an image drag');
  for (const button of app.answerOptions.children) {
    const option = question.options.find(choice => choice.id === button.dataset.choice);
    const [icon, label] = button.children;
    assert.equal(icon.getAttribute('aria-hidden'), 'true');
    assert.equal(icon.children[0].src, option.image);
    assert.equal(icon.children[0].alt, `${option.zh} ${option.en}`);
    assert.equal(icon.children[0].draggable, false, 'pressing the answer picture never starts an image drag');
    assert.equal(label.textContent, `${option.zh}${option.en}`, 'the button keeps its Chinese and English text label');
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
  app.speechLanguageButtons.find(button => button.dataset.language === 'en').click();

  for (let star = 1; star <= GOAL; star += 1) {
    const answerId = game.getState().question.answerId;
    app.answerOptions.children.find(button => button.dataset.choice === answerId).click();
    if (star < GOAL) app.nextButton.click();
  }
  assert.equal(game.getState().finished, true);

  app.muteButton.click();
  assert.match(speechStatus.textContent, /Sound is muted/);
  app.muteButton.click();
  assert.equal(speechStatus.textContent, '');
  assert.equal(app.muteButton.getAttribute('aria-pressed'), 'false');
});

test('game-generated prompt IDs exist for every selectable word and math target', () => {
  const audioIds = new Set();
  for (const seed of [0, 0.2, 0.4, 0.6, 0.8, 0.99]) {
    const game = createGame(() => seed);
    audioIds.add(game.getState().question.audioId);
    for (const topic of ['colors', 'face', 'family']) {
      game.chooseTopic(topic);
      audioIds.add(game.getState().question.audioId);
    }
  }
  for (const audioId of audioIds) {
    assert.ok(prompts[audioId], `${audioId} has a narration manifest entry`);
  }
  assert.equal(audioIds.size, Object.keys(prompts).length, 'the game reaches every bundled prompt');
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

test('the voice picker shows no voice selected and keeps the invitation visible until audio is turned on', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const invite = app.elements.get('#speechInvite');
  const controls = app.elements.get('#speechControls');
  const pressed = () => app.speechLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.language);
  assert.deepEqual(pressed(), []);
  assert.equal(invite.hidden, false);
  assert.equal(controls.classList.contains('needs-voice'), true);

  app.muteButton.click();
  assert.deepEqual(pressed(), [], 'muting does not pick a voice');
  assert.equal(invite.hidden, false);
  app.muteButton.click();
  assert.deepEqual(pressed(), ['en'], 'unmuting turns on the English voice it plays');
  assert.equal(invite.hidden, true);
  assert.equal(controls.classList.contains('needs-voice'), false);

  const replayApp = createAppFixture(createGame(steadyRandom));
  replayApp.elements.get('#replayPromptButton').click();
  assert.deepEqual(replayApp.speechLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.language), ['en']);
  assert.equal(replayApp.elements.get('#speechInvite').hidden, true);

  const pickApp = createAppFixture(createGame(steadyRandom));
  pickApp.speechLanguageButtons.find(button => button.dataset.language === 'ja').click();
  assert.deepEqual(pickApp.speechLanguageButtons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.language), ['ja']);
});

test('reactions stay silent while the voice invitation shows, then follow the chosen language', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const invite = app.elements.get('#speechInvite');
  clickAnswer(app, game, false);
  clickAnswer(app, game, true);
  assert.deepEqual(app.played, [], 'no reaction before a voice, replay, or unmute');
  assert.equal(invite.hidden, false, 'the invitation stays up while cheers are silent');

  app.nextButton.click();
  app.speechLanguageButtons.find(button => button.dataset.language === 'zh').click();
  assert.equal(invite.hidden, true, 'choosing a voice turns on the questions and cheers together');
  clickAnswer(app, game, false);
  clickAnswer(app, game, false);
  clickAnswer(app, game, true);
  app.nextButton.click();
  clickAnswer(app, game, true);
  assert.equal(game.getState().finished, true);
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
  app.speechLanguageButtons.find(button => button.dataset.language === 'en').click();

  clickAnswer(app, game, true);
  assert.match(last(), /reaction-praise-1/);
  app.speechLanguageButtons.find(button => button.dataset.language === 'ja').click();
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
  app.speechLanguageButtons.find(button => button.dataset.language === 'en').click();
  for (let star = 1; star <= GOAL; star += 1) {
    clickAnswer(app, game, true);
    if (star < GOAL) app.nextButton.click();
  }
  assert.match(app.played[app.played.length - 1], /en\/reaction-finish-1/);
  const count = app.played.length;
  const pauses = app.audioState.pauses;
  app.speechLanguageButtons.find(button => button.dataset.language === 'zh').click();
  assert.equal(app.played.length, count);
  assert.ok(app.audioState.pauses > pauses);
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
  assert.deepEqual(EFFECTS, ['tap', 'sparkle', 'whoosh', 'boing', 'giggle', 'cheer']);
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

  for (const name of ['tap', 'sparkle', 'whoosh', 'giggle', 'cheer']) assert.equal(test.board.play(name), true, `${name} is never crowded out`);
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
  assert.equal(app.sound.ctx, null, 'nothing is audible before the child taps');

  clickAnswer(app, game, false);
  assert.deepEqual(app.effects, ['tap', 'boing'], 'a miss is a soft pillow boing');
  app.later();
  clickAnswer(app, game, true);
  assert.deepEqual(app.effects.slice(2), ['tap', 'sparkle', 'whoosh', 'giggle'], 'a right answer sparkles, whooshes, and giggles');
  assert.deepEqual(app.played, [], 'effects never play through the speech element or start narration');

  for (let star = 2; star <= GOAL; star += 1) {
    app.later();
    app.nextButton.click();
    app.later();
    clickAnswer(app, game, true);
  }
  assert.equal(game.getState().finished, true);
  assert.deepEqual(app.effects.slice(-3), ['sparkle', 'whoosh', 'cheer'], 'the win ends with a cheer');
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
  clickAnswer(app, game, true);
  assert.deepEqual(app.effects, [], 'mute silences the effects');
  app.musicButton.click();
  app.musicButton.click();
  assert.match(app.elements.get('#speechStatus').textContent, /Sound is muted/);
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
  app.speechLanguageButtons.find(button => button.dataset.language === 'en').click();
  const [speech] = app.audioElements;
  speech.dispatch('playing');
  assert.equal(app.sound.board.getState().speaking, true);
  clickAnswer(app, game, false);
  assert.deepEqual(app.effects, ['tap', 'boing']);
  assert.match(speech.src, /\/en\/reaction-try-again-1\.mp3$/, 'a miss effect never replaces the try-again reaction clip');
  speech.dispatch('ended');
  assert.equal(app.sound.board.getState().speaking, false);
});
