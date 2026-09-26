'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { GOAL, TOPICS, createGame, createSpeechPlayer } = require('./game.js');
const prompts = require('./audio/prompts.json');

const steadyRandom = () => 0.3;

function answerCorrectly(game) {
  const state = game.getState();
  return game.answer(state.question.answerId);
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
    }
  }
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
