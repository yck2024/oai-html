'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');
const { GOAL, TOPICS, createGame, createSpeechPlayer } = require('./game.js');
const { POSES, ART, TIMING, comboText } = require('./arena.js');
const prompts = require('./audio/prompts.json');

const steadyRandom = () => 0.3;

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

function createAppFixture(game, globals = {}) {
  const ids = [
    'answerOptions', 'questionEnglish', 'questionChinese', 'questionPicture', 'equation', 'feedback',
    'nextButton', 'questionPanel', 'finishPanel', 'arenaStage', 'arenaMessage', 'scoreStars',
    'scoreCount', 'speechStatus', 'muteButton', 'heroEmoji', 'heroName', 'buddyEmoji', 'buddyName',
    'rivalPower', 'moveBubble', 'restartButton', 'playAgainButton', 'replayPromptButton',
    'heroArt', 'buddyArt', 'comboBadge', 'comboCount', 'stageEffects',
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
    documentElement: new FakeElement('html'),
    querySelector: selector => elements.get(selector),
    querySelectorAll: selector => ({
      '.champion-card': championCards,
      '.topic-tab': topicTabs,
      '.speech-language': speechLanguageButtons,
    })[selector] || [],
    createElement: tagName => new FakeElement(tagName),
    createTextNode: text => ({ textContent: String(text) }),
  };
  const window = {
    FriendlyArena: { GOAL, createGame: () => game, createSpeechPlayer },
  };
  const played = [];
  class RecordingAudio extends FakeAudio {
    play() {
      played.push(this.src);
      return super.play();
    }
  }
  const clock = createClock();
  const context = vm.createContext({ window, document, Audio: RecordingAudio, setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout, ...globals });
  for (const script of ['arena.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, script), 'utf8'), context);
  return { elements, played, clock, document, championCards, speechLanguageButtons, topicTabs, answerOptions: elements.get('#answerOptions'), nextButton: elements.get('#nextButton'), muteButton: elements.get('#muteButton') };
}

function clickAnswer(app, game, correct = true) {
  const { answerId } = game.getState().question;
  app.answerOptions.children.find(button => (button.dataset.choice === answerId) === correct).click();
}

function poses(app) {
  return `${app.elements.get('#heroArt').dataset.pose}/${app.elements.get('#buddyArt').dataset.pose}`;
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

test('Gemini generator config covers all languages and routes only the sister clip through the voiced spelling', () => {
  const python = String.raw`
import importlib.util, json
from pathlib import Path
module_path = Path.cwd() / 'generate_gemini_audio.py'
spec = importlib.util.spec_from_file_location('gemini_audio', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
prompts = json.loads(module.PROMPTS.read_text(encoding='utf-8'))
clips = module.selected_clips(prompts, list(module.LANGUAGES), None, True)
repeated = module.selected_clips(prompts, ['en', 'en', 'zh', 'zh'], ['family-sister', 'family-sister'], True)
print(json.dumps({
    'model': module.MODEL,
    'languages': module.LANGUAGES,
    'clips': clips,
    'repeated': repeated,
}, ensure_ascii=False))
`;
  const generated = JSON.parse(execFileSync('python3', ['-B', '-c', python], { cwd: __dirname, encoding: 'utf8' }));
  assert.equal(generated.model, 'gemini-3.8-flash-tts');
  assert.deepEqual(Object.keys(generated.languages), ['en', 'zh', 'ja']);
  assert.deepEqual(
    Object.fromEntries(Object.entries(generated.languages).map(([key, config]) => [key, [config.locale, config.voice]])),
    { en: ['en-US', 'Aoede'], zh: ['zh-TW', 'Kore'], ja: ['ja-JP', 'ja-jp-tutor-1'] },
  );
  assert.equal(generated.clips.length, 45);
  assert.deepEqual(generated.repeated, [['en', 'family-sister', 'Find your older sister!'], ['zh', 'family-sister', '誰是姐姐？']]);
  const audioText = new Map(generated.clips.map(([language, audioId, text]) => [`${language}/${audioId}`, text]));
  for (const [audioId, translations] of Object.entries(prompts)) {
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

test('the stylesheet maps each pose to its frame of the champion sheet', () => {
  const css = fs.readFileSync(path.join(__dirname, 'game.css'), 'utf8');
  assert.match(css, /\.champion-art\[data-character="dino"\] \{ background-image: url\("\.\/images\/champion-rex\.webp"\); \}/);
  assert.match(css, /\.champion-art\[data-character="monster"\] \{ background-image: url\("\.\/images\/champion-bobo\.webp"\); \}/);
  assert.match(css, /\.champion-art \{ display: block; background: no-repeat 0 0 \/ 600% 100%; \}/);
  POSES.slice(1).forEach((pose, index) => {
    const position = (index + 1) * (100 / (POSES.length - 1));
    assert.ok(css.includes(`.champion-art[data-pose="${pose}"] { background-position: ${position}% 0; }`), `${pose} shows frame ${index + 2}`);
  });
  for (const file of ART) assert.ok(css.includes(`url("${file}")`), `${file} is used by the stylesheet`);
});

test('a right answer plays the power move, then the buddy wobbles and giggles as stars fly', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const stage = app.elements.get('#arenaStage');
  const effects = app.elements.get('#stageEffects');
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
  assert.match(message.textContent, /2 in a row! 連續答對 2 題！$/);

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
  assert.equal(comboText(1), '');
  assert.equal(comboText(4), '4 in a row! 連續答對 4 題！');
});

test('the winning answer ends with the buddy bowing and a shared high-five under falling stars', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const stage = app.elements.get('#arenaStage');
  const effects = app.elements.get('#stageEffects');
  for (let star = 1; star <= GOAL; star += 1) {
    clickAnswer(app, game);
    if (star < GOAL) app.nextButton.click();
  }
  assert.equal(game.getState().finished, true);
  assert.match(app.elements.get('#arenaMessage').textContent, /bow and high-five! .* 3 in a row!/);
  app.clock.tick(TIMING.bow);
  assert.equal(poses(app), 'ready/bow');
  assert.ok(stage.classList.contains('is-bowing'));
  app.clock.tick(TIMING.highFive - TIMING.bow);
  assert.equal(poses(app), 'high5/high5');
  assert.ok(stage.classList.contains('is-victory'));
  assert.equal(stage.classList.contains('is-bowing'), false);
  assert.equal(effects.children.length, 12);
  assert.ok(effects.children.every(star => star.className === 'shower-star'));
  app.clock.tick(10000);
  assert.equal(poses(app), 'high5/high5', 'the champions keep their high-five until play again');

  app.elements.get('#playAgainButton').click();
  assert.equal(poses(app), 'ready/ready');
  assert.equal(stage.classList.contains('is-victory'), false);
  assert.equal(effects.children.length, 0);
  clickAnswer(app, game);
  assert.match(app.elements.get('#arenaMessage').textContent, /4 in a row!/, 'a new match keeps the right-in-a-row streak going');
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
  assert.equal(app.elements.get('#arenaMessage').textContent, 'Bobo is ready to spar!');
  assert.ok(app.elements.get('#arenaStage').classList.contains('do-ready'));
});

test('reduced motion keeps every pose but skips the flying stars', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game, { matchMedia: query => ({ matches: query === '(prefers-reduced-motion: reduce)' }) });
  for (let star = 1; star <= GOAL; star += 1) {
    clickAnswer(app, game);
    app.clock.tick(TIMING.land);
    assert.equal(poses(app), 'power/giggle');
    assert.equal(app.elements.get('#stageEffects').children.length, 0);
    if (star < GOAL) app.nextButton.click();
  }
  app.clock.tick(TIMING.highFive);
  assert.equal(poses(app), 'high5/high5');
  assert.equal(app.elements.get('#stageEffects').children.length, 0);
});

test('champions fall back to emoji when the arena pictures cannot load', () => {
  const requested = [];
  class MissingImage {
    addEventListener(type, callback) {
      if (type === 'error') this.fail = callback;
    }

    set src(source) {
      requested.push(source);
      this.fail();
    }
  }
  const app = createAppFixture(createGame(steadyRandom), { Image: MissingImage });
  assert.deepEqual(requested, ART);
  assert.ok(app.document.documentElement.classList.contains('no-champion-art'));

  const loaded = createAppFixture(createGame(steadyRandom));
  assert.equal(loaded.document.documentElement.classList.contains('no-champion-art'), false);
});
