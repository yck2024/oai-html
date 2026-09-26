'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { GOAL, TOPICS, createGame } = require('./game.js');

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
