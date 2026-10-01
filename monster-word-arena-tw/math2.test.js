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
const ofKind = (questions, kind) => questions.filter(question => question.kind === kind);
const kindsAt = level => MATH2_KINDS.filter(entry => entry.generators[level]).map(entry => entry.kind).sort();

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
      assert.equal(typeof question.display, 'string');
      assert.deepEqual(JSON.parse(JSON.stringify(question.visual)), question.visual, 'visual is plain data');
      if (question.visual) assert.ok(visuals.BUILDERS[question.visual.type], `a builder is registered for ${question.visual.type}`);
      for (const option of question.options) assert.deepEqual([option.zh, option.en, option.ja], [option.id, option.id, option.id]);
    }
  }
});

test('bigger or smaller: Easy asks for the biggest of numbers 0-20, from three choices', () => {
  const questions = ofKind(drawQuestions('easy', 600), 'compare');
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
  const questions = ofKind(drawQuestions('harder', 600), 'compare');
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
  assert.ok(swapped > 80 && swapped < 250, `a digit-swapped pair (34 and 43) shows up about half the time (${swapped}/${questions.length})`);
});

test('bigger or smaller: Super mixes smaller in, taking turns, up to 99', () => {
  const all = drawQuestions('super', 400);
  const questions = ofKind(all, 'compare');
  assert.deepEqual([...new Set(questions.map(directionOf))].sort(), ['bigger', 'smaller']);
  all.slice(1).forEach((question, index) => {
    if (question.kind === 'compare' && all[index].kind === 'compare') assert.notEqual(directionOf(question), directionOf(all[index]), 'the direction changes on the next compare question');
  });
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
    const question = ofKind(drawQuestions('super', 60), 'compare').find(candidate => directionOf(candidate) === direction);
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
    assert.ok(MATH2_KINDS.some(entry => entry.kind === game.getState().question.kind));
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

// A document that records elements the way the browser's DOM would, SVG namespace included.
function recordingDocument() {
  const make = (namespace, tag) => ({
    namespace, tag, className: '', attributes: {}, children: [],
    setAttribute(name, value) { this.attributes[name] = String(value); },
    append(...nodes) { this.children.push(...nodes); },
  });
  return { createElement: tag => make(null, tag), createElementNS: (namespace, tag) => make(namespace, tag) };
}

const tenFrameCounts = question => question.visual.counts;
const shownBy = question => tenFrameCounts(question)[0];

test('Math 2 asks each level its own kinds: make ten on Easy, the missing number on Harder and Super', () => {
  assert.deepEqual(kindsAt('easy'), ['compare', 'make-ten']);
  assert.deepEqual(kindsAt('harder'), ['compare', 'missing-addend']);
  assert.deepEqual(kindsAt('super'), ['compare', 'missing-addend']);
  assert.deepEqual(MATH2_KINDS.find(entry => entry.kind === 'make-ten').audioIds, ['math2-ten-more']);
  assert.deepEqual(MATH2_KINDS.find(entry => entry.kind === 'missing-addend').audioIds, ['math2-ten-missing']);
});

test('make ten: Easy shows a frame with 1-9 counters, no equation, and asks how many more from three choices', () => {
  const questions = ofKind(drawQuestions('easy', 600), 'make-ten');
  const shownCounts = new Set();
  for (const question of questions) {
    shownCounts.add(shownBy(question));
    assert.equal(question.audioId, 'math2-ten-more');
    assert.deepEqual(question.visual, { type: 'ten-frame', counts: [shownBy(question)] });
    assert.ok(Number.isInteger(shownBy(question)) && shownBy(question) >= 1 && shownBy(question) <= 9);
    assert.equal(Number(question.answerId), 10 - shownBy(question));
    assert.equal(question.display, '');
    assert.equal(question.options.length, 3);
    assert.deepEqual(question.range, { min: 0, max: 10 });
    assert.equal(question.key, `math2-make-ten-${shownBy(question)}`);
  }
  assert.deepEqual([...shownCounts].sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9], 'every amount of counters comes up');
  assert.ok(questions.length > 150, 'about half of Easy is make ten, the rest bigger or smaller');
});

test('make ten: Easy offers the answer and its closest neighbours, as Easy sums do', () => {
  for (const question of ofKind(drawQuestions('easy', 400), 'make-ten')) {
    const answer = Number(question.answerId);
    for (const value of valuesOf(question)) assert.ok(Math.abs(value - answer) <= 2, `${valuesOf(question)} around ${answer}`);
  }
});

test('missing addend: Harder shows the frame and "3 + ? = 10", and asks for the number that fills the blank', () => {
  const questions = ofKind(drawQuestions('harder', 600), 'missing-addend');
  const shownCounts = new Set();
  for (const question of questions) {
    const shown = shownBy(question);
    shownCounts.add(shown);
    assert.equal(question.audioId, 'math2-ten-missing');
    assert.deepEqual(question.visual, { type: 'ten-frame', counts: [shown] });
    assert.equal(question.display, `${shown} + ? = 10`);
    assert.equal(Number(question.answerId), 10 - shown);
    assert.equal(question.options.length, 4);
    assert.deepEqual(question.range, { min: 0, max: 10 });
  }
  assert.deepEqual([...shownCounts].sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(ofKind(drawQuestions('harder', 300), 'make-ten').length, 0, 'make ten is an Easy kind');
});

test('missing addend: Super shows the equation only, with the blank first or second', () => {
  const questions = ofKind(drawQuestions('super', 600), 'missing-addend');
  const forms = new Set();
  for (const question of questions) {
    assert.equal(question.visual, null, 'no frame on Super');
    const match = /^(\? \+ (\d)|(\d) \+ \?) = 10$/.exec(question.display);
    assert.ok(match, `${question.display} is an equation with one blank that makes ten`);
    const shown = Number(match[2] || match[3]);
    assert.equal(Number(question.answerId), 10 - shown);
    forms.add(match[2] ? 'blank-first' : 'blank-second');
    assert.equal(question.audioId, 'math2-ten-missing');
    assert.equal(question.options.length, 4);
  }
  assert.deepEqual([...forms].sort(), ['blank-first', 'blank-second']);
});

test('make ten and missing addend: Harder and Super sometimes offer the number already shown, the likely wrong tap', () => {
  for (const level of ['harder', 'super']) {
    const questions = ofKind(drawQuestions(level, 800), 'missing-addend');
    const lured = questions.filter(question => {
      const shown = Number((/\d/.exec(question.display) || [])[0]);
      return shown !== Number(question.answerId) && valuesOf(question).includes(shown);
    });
    const possible = questions.filter(question => Number((/\d/.exec(question.display) || [])[0]) !== Number(question.answerId));
    assert.ok(lured.length > possible.length * 0.3 && lured.length < possible.length * 0.7, `${level}: ${lured.length}/${possible.length}`);
  }
});

test('numberOptions offers a question\'s named wrong number half the time from Harder up, never on Easy', () => {
  const problem = { answer: 7, mixedUp: 3, range: { min: 0, max: 10 } };
  for (const level of ['harder', 'super']) {
    assert.ok(numberOptions(problem, level, () => 0).includes(3));
    for (const random of [() => 0.99, seededRandom(1)]) {
      const values = numberOptions(problem, level, random);
      assert.equal(values.length, CHOICE_COUNT[level]);
      assert.equal(new Set(values).size, values.length);
      assert.ok(values.includes(7) && values.every(value => value >= 0 && value <= 10));
    }
  }
  assert.ok(!numberOptions(problem, 'easy', () => 0).includes(3), 'Easy keeps to the closest neighbours');
  assert.deepEqual(numberOptions({ answer: 7, mixedUp: 7, range: { min: 0, max: 10 } }, 'harder', () => 0).filter(value => value === 7), [7], 'a wrong number equal to the answer is ignored');
});

test('the ten prompts are shared, written as they are spoken, never give the answer, and are hiragana-only in Japanese', () => {
  for (const [kind, audioId] of [['make-ten', 'math2-ten-more'], ['missing-addend', 'math2-ten-missing']]) {
    const level = kind === 'make-ten' ? 'easy' : 'harder';
    const questions = ofKind(drawQuestions(level, 200), kind);
    assert.ok(questions.length > 20);
    assert.equal(new Set(questions.map(question => question.audioId)).size, 1, 'one clip for every question');
    for (const question of questions) {
      assert.equal(question.audioId, audioId);
      assert.equal(question.promptEn, prompts[audioId].en);
      assert.equal(question.promptZh, prompts[audioId].zh);
      assert.doesNotMatch(prompts[audioId].en + prompts[audioId].zh + prompts[audioId].ja, /\d/, 'no digits, so the clip never gives the answer');
      assert.doesNotMatch(question.promptJa, /[ァ-ヿ㐀-鿿]/);
    }
  }
  assert.match(prompts['math2-ten-more'].en, /How many more make ten/);
  assert.match(prompts['math2-ten-missing'].en, /make ten/);
});

test('the ten-frame builder draws two rows of five cells and fills a row at a time, counters apart from the empty cells', () => {
  const document = recordingDocument();
  const row = visuals.build({ type: 'ten-frame', counts: [7] }, document);
  assert.equal(row.className, 'ten-frames');
  assert.equal(row.children.length, 1);
  const [svg] = row.children;
  assert.equal(svg.namespace, 'http://www.w3.org/2000/svg');
  assert.equal(svg.tag, 'svg');
  assert.equal(svg.attributes.class, 'ten-frame');
  assert.equal(svg.attributes['aria-hidden'], 'true');
  assert.match(svg.attributes.viewBox, /^0 0 \d+ \d+$/);
  const cells = svg.children.filter(node => node.attributes.class === 'ten-frame-cell');
  const counters = svg.children.filter(node => node.attributes.class === 'ten-frame-counter');
  assert.equal(cells.length, 10);
  assert.equal(counters.length, 7);
  assert.ok(svg.children.every(node => node.namespace === 'http://www.w3.org/2000/svg'));
  assert.equal(svg.children[0].attributes.class, 'ten-frame-board');
  // Two rows of five: the cells share five x positions and two y positions.
  assert.equal(new Set(cells.map(cell => cell.attributes.x)).size, 5);
  assert.equal(new Set(cells.map(cell => cell.attributes.y)).size, 2);
  // Seven counters are a full top row and two in the bottom row, left to right.
  const centreOf = node => [Number(node.attributes.cx), Number(node.attributes.cy)];
  const rows = counters.map(counter => centreOf(counter)[1]);
  assert.equal(new Set(rows).size, 2);
  assert.equal(rows.filter(y => y === rows[0]).length, 5);
  assert.deepEqual(counters.map(counter => centreOf(counter)[0]).slice(0, 5), counters.map(counter => centreOf(counter)[0]).slice(0, 5).sort((a, b) => a - b));
  assert.deepEqual(counters.slice(5).map(counter => centreOf(counter)[0]), counters.slice(0, 2).map(counter => centreOf(counter)[0]));
  // Every counter sits inside its own cell.
  counters.forEach((counter, index) => {
    const cell = cells[index];
    const [cx, cy] = centreOf(counter);
    assert.ok(cx > Number(cell.attributes.x) && cx < Number(cell.attributes.x) + Number(cell.attributes.width));
    assert.ok(cy > Number(cell.attributes.y) && cy < Number(cell.attributes.y) + Number(cell.attributes.height));
  });
});

test('the ten-frame builder takes any number of frames, clamps odd counts, and draws an empty row for none', () => {
  const document = recordingDocument();
  const countersIn = svg => svg.children.filter(node => node.attributes.class === 'ten-frame-counter').length;
  assert.deepEqual(visuals.build({ type: 'ten-frame', counts: [10, 4] }, document).children.map(countersIn), [10, 4], 'two frames, for a later sum within twenty');
  assert.deepEqual(visuals.build({ type: 'ten-frame', counts: [0, 3.9, -2, 25, 'x'] }, document).children.map(countersIn), [0, 3, 0, 10, 0]);
  assert.equal(visuals.build({ type: 'ten-frame', counts: [] }, document).children.length, 0);
  assert.equal(visuals.build({ type: 'ten-frame' }, document).children.length, 0);
});
