'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { TOPICS, CHOICE_COUNT, LEVELS, MATH2_KINDS, MATH_TOPICS, isMathTopic, rotateKinds, numberOptions, createGame } = require('./game.js');
const visuals = require('./math2-visuals.js');
const prompts = require('./audio/prompts.json');

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

// Draws `count` fresh Math 2 questions at a level, the way a child moves on after each answer.
function drawQuestions(level, count, random = seededRandom(7)) {
  const game = createGame(random);
  game.chooseTopic('math2');
  game.chooseLevel(level);
  const questions = [];
  for (let draw = 0; draw < count; draw += 1) {
    questions.push(game.getState().question);
    game.chooseTopic('math2');
  }
  return questions;
}

const valuesOf = question => question.options.map(option => Number(option.id));
const directionOf = question => question.key.split('-')[2];

test('Math 2 is a math topic of its own, right after Math, and no word topic counts as math', () => {
  assert.deepEqual(MATH_TOPICS, ['math', 'math2']);
  assert.equal(TOPICS[0], 'math');
  assert.equal(TOPICS[1], 'math2');
  assert.equal(isMathTopic('math'), true);
  assert.equal(isMathTopic('math2'), true);
  for (const topic of TOPICS.filter(id => !MATH_TOPICS.includes(id))) assert.equal(isMathTopic(topic), false, topic);
});

test("today's Math questions keep exactly the fields they had, with no kind, visual or range", () => {
  const game = createGame(seededRandom(3));
  for (const level of LEVELS) {
    game.chooseLevel(level);
    assert.deepEqual(Object.keys(game.getState().question), [
      'topic', 'op', 'key', 'audioId', 'promptZh', 'promptEn', 'promptJa', 'display', 'picture', 'takeAway', 'dense', 'answerId', 'options',
    ]);
  }
});

test('every registered Math 2 kind names its clips, has a generator for a level, and only asks for its own clips', () => {
  assert.ok(MATH2_KINDS.length >= 1);
  const kinds = MATH2_KINDS.map(entry => entry.kind);
  assert.equal(new Set(kinds).size, kinds.length, 'kinds are unique');
  for (const entry of MATH2_KINDS) {
    assert.ok(entry.audioIds.length >= 1);
    for (const audioId of entry.audioIds) assert.ok(prompts[audioId], `${audioId} has a narration entry`);
    assert.ok(LEVELS.some(level => typeof entry.generators[level] === 'function'), `${entry.kind} appears at some level`);
  }
  for (const level of LEVELS) {
    const offered = MATH2_KINDS.filter(entry => entry.generators[level]);
    const seen = new Set();
    for (const question of drawQuestions(level, 600)) {
      const entry = MATH2_KINDS.find(candidate => candidate.kind === question.kind);
      assert.ok(entry, `${level}: ${question.kind} is a registered kind`);
      assert.ok(entry.generators[level], `${level}: ${question.kind} is offered at this level`);
      assert.ok(entry.audioIds.includes(question.audioId), `${question.audioId} is one of ${entry.kind}'s clips`);
      seen.add(question.kind);
    }
    assert.deepEqual([...seen].sort(), offered.map(entry => entry.kind).sort(), `${level} asks every kind registered for it`);
  }
});

test('a Math 2 question has number choices inside its own range, a unique right answer, and data-only extras', () => {
  for (const level of LEVELS) {
    for (const question of drawQuestions(level, 400)) {
      const values = valuesOf(question);
      assert.equal(question.topic, 'math2');
      assert.equal(question.options.length, CHOICE_COUNT[level]);
      assert.equal(new Set(values).size, values.length, 'choices are distinct');
      assert.ok(values.includes(Number(question.answerId)));
      assert.ok(values.every(value => Number.isInteger(value) && value >= question.range.min && value <= question.range.max), `${level} choices stay inside the range`);
      assert.equal(question.picture, '');
      assert.equal(question.takeAway, null);
      assert.equal(question.display, '');
      assert.deepEqual(JSON.parse(JSON.stringify(question.visual)), question.visual, 'visual is plain data');
      if (question.visual) assert.ok(visuals.BUILDERS[question.visual.type], `a builder is registered for ${question.visual.type}`);
      for (const option of question.options) assert.deepEqual([option.zh, option.en, option.ja], [option.id, option.id, option.id]);
    }
  }
});

test('bigger or smaller: Easy asks for the biggest of numbers 0-20, from three choices', () => {
  const questions = drawQuestions('easy', 600);
  const all = new Set();
  for (const question of questions) {
    const values = valuesOf(question);
    values.forEach(value => all.add(value));
    assert.equal(question.kind, 'compare');
    assert.equal(directionOf(question), 'bigger', 'Easy only ever asks which is bigger');
    assert.equal(question.audioId, 'math2-bigger');
    assert.deepEqual(question.range, { min: 0, max: 20 });
    assert.equal(Number(question.answerId), Math.max(...values));
    assert.ok(values.every(value => value >= 0 && value <= 20));
  }
  assert.ok(all.has(0) && all.has(20), 'the whole 0-20 range is used');
  assert.ok([...all].some(value => value > 10), 'numbers above ten are offered');
});

test('bigger or smaller: Harder asks for the biggest of numbers up to 99, sometimes with digit-swapped neighbours', () => {
  const questions = drawQuestions('harder', 600);
  let swapped = 0;
  for (const question of questions) {
    const values = valuesOf(question);
    assert.equal(directionOf(question), 'bigger');
    assert.deepEqual(question.range, { min: 0, max: 99 });
    assert.equal(Number(question.answerId), Math.max(...values));
    assert.ok(values.every(value => value >= 0 && value <= 99));
    if (values.some(a => a >= 10 && a % 10 !== 0 && values.includes((a % 10) * 10 + Math.floor(a / 10)))) swapped += 1;
  }
  assert.ok(questions.some(question => valuesOf(question).some(value => value > 20)), 'two-digit numbers appear');
  assert.ok(swapped > 100 && swapped < 450, `a digit-swapped pair (34 and 43) shows up about half the time (${swapped}/600)`);
});

test('bigger or smaller: Super mixes smaller in, taking turns, up to 99', () => {
  const questions = drawQuestions('super', 400);
  const directions = questions.map(directionOf);
  assert.deepEqual([...new Set(directions)].sort(), ['bigger', 'smaller']);
  directions.slice(1).forEach((direction, index) => assert.notEqual(direction, directions[index], 'the direction changes every question'));
  for (const question of questions) {
    const values = valuesOf(question);
    const expected = directionOf(question) === 'bigger' ? Math.max(...values) : Math.min(...values);
    assert.equal(Number(question.answerId), expected);
    assert.equal(question.audioId, `math2-${directionOf(question)}`);
    assert.deepEqual(question.range, { min: 0, max: 99 });
  }
});

test('the bigger and smaller prompts are written and spoken the same, using 大 and 小 for numbers', () => {
  for (const [direction, mandarin, english] of [['bigger', '大', 'biggest'], ['smaller', '小', 'smallest']]) {
    const question = drawQuestions('super', 20).find(candidate => directionOf(candidate) === direction);
    assert.equal(question.promptEn, prompts[question.audioId].en);
    assert.equal(question.promptZh, prompts[question.audioId].zh);
    assert.match(question.promptEn, new RegExp(english));
    assert.match(question.promptZh, new RegExp(mandarin));
    assert.doesNotMatch(question.promptZh, /[多少]/, '多 and 少 are for groups, not numbers');
    assert.match(question.promptJa, direction === 'bigger' ? /おおきい/ : /ちいさい/);
    assert.doesNotMatch(question.promptJa, /[ァ-ヿ㐀-鿿]/, 'on-screen Japanese stays hiragana');
  }
});

test('the same Math 2 question is never asked twice in a row, whatever the random numbers are', () => {
  for (const random of [() => 0, () => 0.3, () => 0.99, seededRandom(5)]) {
    for (const level of LEVELS) {
      const questions = drawQuestions(level, 60, random);
      questions.slice(1).forEach((question, index) => assert.notEqual(question.key, questions[index].key, `${level} repeated ${question.key}`));
    }
  }
});

test('a kind is never asked three times in a row while another is on offer', () => {
  const a = { kind: 'a' };
  const b = { kind: 'b' };
  assert.deepEqual(rotateKinds([a, b], []), [a, b]);
  assert.deepEqual(rotateKinds([a, b], ['a']), [a, b]);
  assert.deepEqual(rotateKinds([a, b], ['a', 'b']), [a, b]);
  assert.deepEqual(rotateKinds([a, b], ['a', 'a']), [b]);
  assert.deepEqual(rotateKinds([a, b], ['b', 'b']), [a]);
  assert.deepEqual(rotateKinds([a], ['a', 'a']), [a], 'a lone kind carries on');
});

test('number choices can run past ten for a question that carries its own range, and Math stays within ten', () => {
  for (const [answer, max] of [[20, 20], [17, 20], [99, 99], [95, 99]]) {
    for (const level of LEVELS) {
      for (const random of [() => 0, () => 0.3, () => 0.99, seededRandom(answer)]) {
        const values = numberOptions({ answer, range: { min: 0, max } }, level, random);
        assert.equal(values.length, CHOICE_COUNT[level]);
        assert.equal(new Set(values).size, values.length);
        assert.ok(values.includes(answer));
        assert.ok(values.every(value => value >= 0 && value <= max), `${level} ${answer}: ${values}`);
      }
    }
  }
  for (const level of LEVELS) {
    const values = numberOptions({ op: 'take', from: 10, take: 1, answer: 9 }, level, seededRandom(2));
    assert.ok(values.every(value => value >= 0 && value <= 10), 'a problem without a range keeps the old limit of ten');
  }
});

test('switching between Math and Math 2 starts each topic with its own kind of question', () => {
  const game = createGame(seededRandom(4));
  for (let round = 0; round < 20; round += 1) {
    game.chooseTopic('math2');
    assert.equal(game.getState().question.topic, 'math2');
    assert.equal(game.getState().question.kind, 'compare');
    game.chooseTopic('math');
    assert.equal(game.getState().question.topic, 'math');
    assert.equal(game.getState().question.kind, undefined);
  }
});

test('the numerals builder draws one tile per number, and unknown or missing visuals draw nothing', () => {
  const made = [];
  const document = {
    createElement(tag) {
      const element = { tag, className: '', textContent: '', children: [], append(...nodes) { this.children.push(...nodes); } };
      made.push(element);
      return element;
    },
  };
  const row = visuals.build({ type: 'numerals', values: [3, 12, 40] }, document);
  assert.equal(row.className, 'numeral-row');
  assert.deepEqual(row.children.map(tile => tile.textContent), ['3', '12', '40']);
  assert.ok(row.children.every(tile => tile.className === 'numeral-tile'));
  assert.equal(visuals.build({ type: 'no-such-picture' }, document), null);
  assert.equal(visuals.build(null, document), null);
  assert.equal(visuals.build(undefined, document), null);
});
