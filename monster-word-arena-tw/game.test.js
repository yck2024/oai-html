'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');
const { GOAL, TOPICS, LEVELS, WORD_TOPICS, createGame, createSpeechPlayer } = require('./game.js');
const prompts = require('./audio/prompts.json');

const steadyRandom = () => 0.3;
const WORD_TOPIC_IDS = ['colors', 'face', 'family', 'animals', 'fruit'];

// Small deterministic generator so long play sessions are repeatable in tests.
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

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

function createAppFixture(game) {
  const ids = [
    'answerOptions', 'questionEnglish', 'questionChinese', 'questionPicture', 'equation', 'feedback',
    'nextButton', 'questionPanel', 'finishPanel', 'arenaStage', 'arenaMessage', 'scoreStars',
    'scoreCount', 'speechStatus', 'muteButton', 'heroEmoji', 'heroName', 'buddyEmoji', 'buddyName',
    'rivalPower', 'moveBubble', 'restartButton', 'playAgainButton', 'replayPromptButton',
  ];
  const elements = new Map(ids.map(id => [`#${id}`, new FakeElement(id === 'nextButton' ? 'button' : 'div')]));
  elements.get('#scoreStars').children = Array.from({ length: 3 }, () => new FakeElement('span'));
  elements.get('#rivalPower').children = Array.from({ length: 3 }, () => new FakeElement('span'));
  const championCards = ['dino', 'monster'].map(champion => {
    const card = new FakeElement('button');
    card.dataset.champion = champion;
    return card;
  });
  const topicTabs = TOPICS.map(topic => {
    const tab = new FakeElement('button');
    tab.dataset.topic = topic;
    return tab;
  });
  const levelButtons = LEVELS.map(level => {
    const button = new FakeElement('button');
    button.dataset.level = level;
    return button;
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
      '.level-option': levelButtons,
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
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'), { window, document, Audio: RecordingAudio });
  return { elements, played, speechLanguageButtons, topicTabs, levelButtons, answerOptions: elements.get('#answerOptions'), nextButton: elements.get('#nextButton'), muteButton: elements.get('#muteButton') };
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
  const expected = {
    colors: ['紅色', '黃色', '綠色', '藍色', '橘色', '紫色', '粉紅色', '咖啡色'],
    face: ['眼睛', '鼻子', '耳朵', '嘴巴', '牙齒', '頭髮', '手', '腳'],
    family: ['爸爸', '媽媽', '哥哥', '姊姊', '爺爺', '奶奶', '寶寶'],
    animals: ['小狗', '小貓', '兔子', '小鳥', '小魚', '大象', '小豬', '猴子'],
    fruit: ['蘋果', '香蕉', '葡萄', '草莓', '西瓜', '鳳梨', '芒果', '櫻桃'],
  };
  assert.deepEqual(TOPICS, ['math', ...WORD_TOPIC_IDS]);
  assert.deepEqual(Object.keys(WORD_TOPICS), WORD_TOPIC_IDS);
  for (const topic of WORD_TOPIC_IDS) {
    assert.deepEqual(WORD_TOPICS[topic].words.map(word => word.zh), expected[topic], `${topic} uses the expected Traditional Chinese`);
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
      assert.ok(question.options.every(option => option.en));
      game.chooseTopic(topic);
    }
  }
});

test('every word prompt shows the picture of its matching answer for pre-readers', () => {
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
  assert.equal(pictureWords.length, 31);
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
  assert.ok(totalBytes < 320 * 1024, 'all pictures together stay light for a phone');
  const committed = fs.readdirSync(path.join(__dirname, 'images')).sort();
  assert.deepEqual(committed, pictureWords.map(({ word }) => word.image.slice('./images/'.length)).sort(), 'only used pictures are committed');
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
    'math-count', 'math-3-3', 'math-4-2', 'math-5-2', 'math-3-4', 'math-4-4',
    'math-5-3', 'math-6-3', 'math-4-5', 'math-5-5', 'math-6-4',
    ...WORD_TOPIC_IDS.flatMap(topic => WORD_TOPICS[topic].words.map(word => `${topic}-${word.id}`)),
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

test('Gemini generator config covers all languages and routes only the listed misread clips through voiced spellings', () => {
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
  assert.equal(generated.clips.length, Object.keys(prompts).length * 3);
  assert.deepEqual(generated.repeated, [['en', 'family-sister', 'Find your older sister!'], ['zh', 'family-sister', '誰是姐姐？']]);
  const overrides = {
    'zh/family-sister': '誰是姐姐？',
    'zh/animals-cat': '小猫在哪裡？',
    'ja/face-mouth': 'お口を見つけてね！',
    'ja/fruit-pineapple': 'パイナップルを見つけてね！',
  };
  assert.deepEqual(Object.fromEntries(generated.overrides.map(([language, audioId, text]) => [`${language}/${audioId}`, text])), overrides);
  const audioText = new Map(generated.clips.map(([language, audioId, text]) => [`${language}/${audioId}`, text]));
  for (const [audioId, translations] of Object.entries(prompts)) {
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

test('game-generated prompt IDs exist for every selectable word and math target at both levels', () => {
  const audioIds = new Set();
  const game = createGame(seededRandom(11));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (const topic of TOPICS) {
      game.chooseTopic(topic);
      for (let draw = 0; draw < 80; draw += 1) {
        audioIds.add(game.getState().question.audioId);
        game.chooseLevel(level);
      }
    }
  }
  for (const audioId of audioIds) {
    assert.ok(prompts[audioId], `${audioId} has a narration manifest entry`);
  }
  assert.equal(audioIds.size, Object.keys(prompts).length, 'the game reaches every bundled prompt');
});

test('easy math keeps small sums with three choices; harder math counts and adds to ten with four', () => {
  const game = createGame(seededRandom(3));
  const seen = { easy: new Set(), harder: new Set() };
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (let draw = 0; draw < 60; draw += 1) {
      const question = game.getState().question;
      const values = question.options.map(option => Number(option.id));
      assert.equal(question.options.length, level === 'easy' ? 3 : 4);
      assert.equal(new Set(values).size, values.length, 'choices are distinct');
      assert.ok(question.options.some(option => option.id === question.answerId));
      const answer = Number(question.answerId);
      if (question.display) {
        const [left, right] = question.display.split(' = ?')[0].split(' + ').map(Number);
        assert.equal(answer, left + right);
        assert.equal([...question.picture].filter(char => char === '🥚').length, answer);
      } else {
        assert.equal(level, 'harder', 'only the harder level asks counting questions');
        assert.equal(question.audioId, 'math-count', 'the counting clip never says the answer');
        assert.equal([...question.picture].filter(char => char === '🥚').length, answer);
      }
      if (level === 'easy') assert.ok(answer <= 5);
      else {
        assert.ok(answer >= 5 && answer <= 10);
        assert.ok(values.every(value => value >= 1 && value <= 10), 'harder choices stay between one and ten');
      }
      seen[level].add(question.display ? 'sum' : 'count');
      game.chooseLevel(level);
    }
  }
  assert.deepEqual([...seen.easy], ['sum']);
  assert.deepEqual([...seen.harder].sort(), ['count', 'sum']);
});

test('word questions offer three choices on easy and four on harder, all from the bigger pool', () => {
  const game = createGame(seededRandom(5));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    for (const topic of WORD_TOPIC_IDS) {
      game.chooseTopic(topic);
      const targets = new Set();
      for (let draw = 0; draw < 60; draw += 1) {
        const question = game.getState().question;
        assert.equal(question.options.length, level === 'easy' ? 3 : 4);
        assert.equal(new Set(question.options.map(option => option.id)).size, question.options.length);
        assert.ok(question.options.some(option => option.id === question.answerId));
        targets.add(question.answerId);
        game.chooseTopic(topic);
      }
      assert.equal(targets.size, WORD_TOPICS[topic].words.length, `${topic} ${level} asks about every word`);
    }
  }
});

test('the same question is never asked twice in a row', () => {
  for (const random of [steadyRandom, () => 0, () => 0.99, seededRandom(9)]) {
    const game = createGame(random);
    for (const level of LEVELS) {
      game.chooseLevel(level);
      for (const topic of TOPICS) {
        game.chooseTopic(topic);
        let previous = game.getState().question.key;
        for (let draw = 0; draw < 30; draw += 1) {
          answerCorrectly(game);
          if (game.getState().finished) game.restart();
          else game.nextQuestion();
          const { key } = game.getState().question;
          assert.notEqual(key, previous, `${level} ${topic} does not repeat ${key}`);
          previous = key;
        }
      }
    }
  }
});

test('the level starts easy, keeps earned stars when switched, and survives a restart', () => {
  const game = createGame(steadyRandom);
  assert.equal(game.getState().level, 'easy');
  answerCorrectly(game);
  assert.equal(game.chooseLevel('expert'), false);
  assert.equal(game.chooseLevel('harder'), true);
  const state = game.getState();
  assert.equal(state.level, 'harder');
  assert.equal(state.stars, 1);
  assert.equal(state.solved, false);
  assert.equal(state.question.options.length, 4);
  assert.equal(game.restart().level, 'harder');
  for (let star = 1; star <= GOAL; star += 1) {
    if (star > 1) game.nextQuestion();
    answerCorrectly(game);
  }
  assert.equal(game.getState().finished, true);
  assert.equal(game.chooseLevel('easy'), false, 'the finish screen keeps its level');
});

test('the level buttons switch choices and the color prompt shows its swatch', () => {
  const game = createGame(steadyRandom);
  const app = createAppFixture(game);
  const [easyButton, harderButton] = app.levelButtons;
  assert.equal(easyButton.getAttribute('aria-pressed'), 'true');
  assert.equal(app.answerOptions.children.length, 3);
  assert.equal(app.answerOptions.classList.contains('four-choices'), false);

  harderButton.click();
  assert.equal(game.getState().level, 'harder');
  assert.equal(harderButton.getAttribute('aria-pressed'), 'true');
  assert.equal(easyButton.getAttribute('aria-pressed'), 'false');
  assert.equal(app.answerOptions.children.length, 4);
  assert.equal(app.answerOptions.classList.contains('four-choices'), true);
  assert.equal(app.elements.get('#questionPicture').classList.contains('dense-picture'), true);

  app.topicTabs.find(tab => tab.dataset.topic === 'colors').click();
  const { question } = game.getState();
  const [swatch] = app.elements.get('#questionPicture').children;
  assert.equal(swatch.style.backgroundColor, question.pictureSwatch);
  assert.equal(app.elements.get('#questionPicture').classList.contains('dense-picture'), false);

  for (let star = 1; star <= GOAL; star += 1) {
    const answerId = game.getState().question.answerId;
    app.answerOptions.children.find(button => button.dataset.choice === answerId).click();
    if (star < GOAL) app.nextButton.click();
  }
  assert.ok(app.levelButtons.every(button => button.disabled), 'the level cannot change on the finish screen');
  app.elements.get('#playAgainButton').click();
  assert.ok(app.levelButtons.every(button => !button.disabled));
  assert.equal(game.getState().level, 'harder');
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
