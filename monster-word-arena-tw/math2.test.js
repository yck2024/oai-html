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

// The bigger-or-smaller questions among a run of Math 2 questions, in the order they came.
const compareOnly = questions => questions.filter(question => question.kind === 'compare');

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
      if (!['missing-addend', 'add-within-20', 'take-within-20'].includes(question.kind)) assert.equal(question.display, '');
      assert.deepEqual(JSON.parse(JSON.stringify(question.visual)), question.visual, 'visual is plain data');
      if (question.visual) assert.ok(visuals.BUILDERS[question.visual.type], `a builder is registered for ${question.visual.type}`);
      for (const option of question.options) assert.deepEqual([option.zh, option.en, option.ja], [option.id, option.id, option.id]);
    }
  }
});

test('bigger or smaller: Easy asks for the biggest of numbers 0-20, from three choices', () => {
  const questions = compareOnly(drawQuestions('easy', 600));
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
  const questions = compareOnly(drawQuestions('harder', 900));
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
  assert.ok(swapped > questions.length * 0.2 && swapped < questions.length * 0.8, `a digit-swapped pair (34 and 43) shows up about half the time (${swapped}/${questions.length})`);
});

test('bigger or smaller: Super mixes smaller in, taking turns, up to 99', () => {
  const questions = drawQuestions('super', 600);
  const compares = compareOnly(questions);
  assert.deepEqual([...new Set(compares.map(directionOf))].sort(), ['bigger', 'smaller']);
  questions.slice(1).forEach((question, index) => {
    if (question.kind === 'compare' && questions[index].kind === 'compare') assert.notEqual(directionOf(question), directionOf(questions[index]), 'the direction changes every question');
  });
  for (const question of compares) {
    const values = valuesOf(question);
    const expected = directionOf(question) === 'bigger' ? Math.max(...values) : Math.min(...values);
    assert.equal(Number(question.answerId), expected);
    assert.equal(question.audioId, `math2-${directionOf(question)}`);
    assert.deepEqual(question.range, { min: 0, max: 99 });
  }
});

test('the bigger and smaller prompts are written and spoken the same, using 大 and 小 for numbers', () => {
  for (const [direction, mandarin, english] of [['bigger', '大', 'biggest'], ['smaller', '小', 'smallest']]) {
    const question = compareOnly(drawQuestions('super', 200)).find(candidate => directionOf(candidate) === direction);
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

function recordingDocument() {
  const make = (namespace, tag) => ({
    namespace, tag, className: '', attributes: {}, children: [],
    setAttribute(name, value) { this.attributes[name] = String(value); },
    append(...nodes) { this.children.push(...nodes); },
  });
  return { createElement: tag => make(null, tag), createElementNS: (namespace, tag) => make(namespace, tag) };
}

const ofKind = (level, kind, count = 900) => drawQuestions(level, count).filter(question => question.kind === kind);
const swapDigits = value => (value % 10) * 10 + Math.floor(value / 10);

test('Math 2 offers the required cards alongside tens and ones at their intended levels', () => {
  const kindsAt = level => [...new Set(drawQuestions(level, 900).map(question => question.kind))].sort();
  assert.deepEqual(kindsAt('easy'), ['compare', 'make-ten', 'sequence']);
  assert.deepEqual(kindsAt('harder'), ['add-within-20', 'blocks', 'compare', 'missing-addend', 'sequence', 'take-within-20']);
  assert.deepEqual(kindsAt('super'), ['add-within-20', 'blocks', 'compare', 'missing-addend', 'sequence', 'take-within-20', 'ten-more-less']);

});

test('make ten uses a ten-frame and asks for the missing counters', () => {
  for (const question of ofKind('easy', 'make-ten', 200)) {
    const shown = question.visual.counts[0];
    assert.ok(shown >= 1 && shown <= 9);
    assert.equal(Number(question.answerId), 10 - shown);
    assert.equal(question.audioId, 'math2-ten-more');
    assert.equal(question.display, '');
    assert.deepEqual(question.range, { min: 0, max: 10 });
  }
});

test('missing addends use a ten-frame on Harder and an equation-only prompt on Super', () => {
  for (const level of ['harder', 'super']) {
    const questions = ofKind(level, 'missing-addend', 300);
    assert.ok(questions.length > 30);
    for (const question of questions) {
      assert.equal(question.audioId, 'math2-ten-missing');
      assert.equal(Number(question.answerId) + Number(question.display.match(/\d+/)[0]), 10);
      assert.equal(Boolean(question.visual), level === 'harder');
      assert.equal(question.visual?.type, level === 'harder' ? 'ten-frame' : undefined);
    }
  }
});

test('counting blocks: the picture is rods and cubes to 99, the answer is tens times ten plus ones, with a digit-swapped choice', () => {
  for (const level of ['harder', 'super']) {
    const questions = ofKind(level, 'blocks');
    assert.ok(questions.length > 100);
    const seen = new Set();
    for (const question of questions) {
      const { tens, ones, type } = question.visual;
      const answer = Number(question.answerId);
      seen.add(answer);
      assert.equal(type, 'blocks');
      assert.ok(Number.isInteger(tens) && tens >= 1 && tens <= 9 && Number.isInteger(ones) && ones >= 0 && ones <= 9, 'at most 9 rods and 9 cubes');
      assert.equal(answer, tens * 10 + ones);
      assert.equal(question.audioId, 'math2-blocks');
      assert.equal(question.key, `math2-blocks-${answer}`);
      assert.deepEqual(question.range, { min: 0, max: 99 });
      assert.equal(question.options.length, 4);
      if (ones >= 1 && ones !== tens) assert.ok(valuesOf(question).includes(swapDigits(answer)), `${answer} offers ${swapDigits(answer)}`);
      assert.ok(valuesOf(question).some(value => Math.abs(value - answer) === 10), 'a rod counted wrongly is a choice');
    }
    assert.ok([...seen].some(value => value >= 90) && [...seen].some(value => value <= 19), 'the whole 10-99 range shows up');
  }
});

test('counting blocks: Mandarin, English and Japanese prompts match the clip and the speech never gives the answer', () => {
  const question = ofKind('harder', 'blocks', 30)[0];
  assert.equal(question.promptEn, prompts['math2-blocks'].en);
  assert.equal(question.promptZh, prompts['math2-blocks'].zh);
  assert.equal(question.promptJa, prompts['math2-blocks'].ja);
  for (const text of Object.values(prompts['math2-blocks'])) assert.doesNotMatch(text, /\d/);
});

test('ten more and ten less: the start is shown as one numeral, the answer is 10 away, and the two directions take turns', () => {
  const questions = drawQuestions('super', 900);
  const asked = questions.filter(question => question.kind === 'ten-more-less');
  assert.ok(asked.length > 100);
  const directions = new Set();
  questions.forEach((question, index) => {
    if (question.kind !== 'ten-more-less') return;
    const direction = question.key.split('-')[2];
    const start = question.visual.values[0];
    directions.add(direction);
    assert.deepEqual(question.visual, { type: 'numerals', values: [start] });
    assert.equal(question.audioId, `math2-tens-${direction}`);
    assert.equal(Number(question.answerId), direction === 'more' ? start + 10 : start - 10);
    assert.ok(start >= 0 && Number(question.answerId) >= 0 && Number(question.answerId) <= 99);
    assert.equal(question.options.length, 4);
    const before = questions[index - 1];
    if (before && before.kind === 'ten-more-less') assert.notEqual(before.key.split('-')[2], direction, 'more and less take turns');
  });
  assert.deepEqual([...directions].sort(), ['less', 'more']);
});

test('ten more and ten less: choices include the wrong direction, one instead of ten, and the digit-swapped answer', () => {
  for (const question of ofKind('super', 'ten-more-less', 900)) {
    const direction = question.key.split('-')[2];
    const sign = direction === 'more' ? 1 : -1;
    const start = question.visual.values[0];
    const answer = Number(question.answerId);
    const values = valuesOf(question);
    if (start - sign * 10 >= 0 && start - sign * 10 <= 99) assert.ok(values.includes(start - sign * 10), `${direction} ${start} offers the opposite`);
    if (answer % 10 >= 1 && Math.floor(answer / 10) >= 1 && answer % 10 !== Math.floor(answer / 10)) assert.ok(values.includes(swapDigits(answer)), `${answer} offers ${swapDigits(answer)}`);
  }
});

test('ten more and ten less: the prompts say more and less with 大 and 小 for Mandarin numbers and read the same as their clips', () => {
  for (const [direction, mandarin, japanese, english] of [['more', '大', 'おおきい', 'more'], ['less', '小', 'ちいさい', 'less']]) {
    const question = ofKind('super', 'ten-more-less', 200).find(candidate => candidate.key.split('-')[2] === direction);
    const clip = prompts[question.audioId];
    assert.deepEqual([question.promptEn, question.promptZh, question.promptJa], [clip.en, clip.zh, clip.ja]);
    assert.match(clip.en, new RegExp(`ten ${english}`));
    assert.match(clip.zh, new RegExp(`${mandarin}十`));
    assert.doesNotMatch(clip.zh, /[多少]/);
    assert.match(clip.ja, new RegExp(`じゅう${japanese}`));
    assert.doesNotMatch(clip.ja, /[㐀-鿿]/, 'on-screen Japanese stays kana');
  }
});

test('the ten-frame builder draws ten cells and the requested counters', () => {
  const document = {
    createElement(tag) { return { tag, className: '', children: [], attributes: {}, append(...nodes) { this.children.push(...nodes); }, setAttribute(name, value) { this.attributes[name] = String(value); } }; },
    createElementNS(namespace, tag) { return { namespace, tag, className: '', children: [], attributes: {}, append(...nodes) { this.children.push(...nodes); }, setAttribute(name, value) { this.attributes[name] = String(value); } }; },
  };
  const row = visuals.build({ type: 'ten-frame', counts: [7] }, document);
  assert.equal(row.className, 'ten-frames');
  assert.equal(row.children[0].children.filter(node => node.attributes.class === 'ten-frame-cell').length, 10);
  assert.equal(row.children[0].children.filter(node => node.attributes.class === 'ten-frame-counter').length, 7);
});

test('the blocks builder draws a rod for every ten and a cube for every one, capped at nine of each', () => {
  const document = {
    createElement(tag) {
      return { tag, className: '', children: [], append(...nodes) { this.children.push(...nodes); } };
    },
  };
  const picture = visuals.build({ type: 'blocks', tens: 3, ones: 4 }, document);
  assert.equal(picture.className, 'blocks');
  const [tens, ones] = picture.children;
  assert.equal(tens.className, 'block-tens');
  assert.equal(ones.className, 'block-ones');
  assert.deepEqual(tens.children.map(rod => rod.className), ['block-rod', 'block-rod', 'block-rod']);
  assert.deepEqual(ones.children.map(cube => cube.className), Array(4).fill('block-cube'));
  const counts = visual => visuals.build(visual, document).children.map(group => group.children.length);
  assert.deepEqual(counts({ type: 'blocks', tens: 0, ones: 0 }), [0, 0]);
  assert.deepEqual(counts({ type: 'blocks', tens: 9, ones: 9 }), [9, 9]);
  assert.deepEqual(counts({ type: 'blocks', tens: 12, ones: 40 }), [9, 9], 'more than nine is capped');
  assert.deepEqual(counts({ type: 'blocks', tens: -3, ones: 'x' }), [0, 0], 'a bad count draws nothing');
});

// Sums and take-aways within twenty that cross ten.
const EN_NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen'];
const ZH_NUMBERS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八'];
const JA_NUMBERS = ['ゼロ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう', 'じゅういち', 'じゅうに', 'じゅうさん', 'じゅうよん', 'じゅうご', 'じゅうろく', 'じゅうなな', 'じゅうはち'];
const capital = word => word[0].toUpperCase() + word.slice(1);
const within20Kinds = ['add-within-20', 'take-within-20'];
const within20Questions = (level, count) => drawQuestions(level, count).filter(question => within20Kinds.includes(question.kind));
// The two numbers of a within-20 key: "math2-add-8-5" is 8 and 5, "math2-take-13-6" is 13 and 6.
const numbersOf = question => question.key.split('-').slice(2).map(Number);

test('within 20: every sum and take-away crosses ten with both numbers 2-9, and has its own narration key', () => {
  const sums = MATH2_KINDS.find(entry => entry.kind === 'add-within-20').audioIds;
  const takeAways = MATH2_KINDS.find(entry => entry.kind === 'take-within-20').audioIds;
  assert.equal(sums.length, 36);
  assert.equal(takeAways.length, 36);
  for (const id of sums) {
    const [left, right] = id.split('-').slice(2).map(Number);
    assert.equal(id, `math2-add-${left}-${right}`);
    assert.ok(left >= 2 && left <= 9 && right >= 2 && right <= 9 && left + right >= 11 && left + right <= 18, id);
  }
  for (const id of takeAways) {
    const [from, take] = id.split('-').slice(2).map(Number);
    assert.equal(id, `math2-take-${from}-${take}`);
    assert.ok(from >= 11 && from <= 18 && take >= 2 && take <= 9 && from - take >= 2 && from - take <= 9, id);
  }
  assert.equal(new Set([...sums, ...takeAways]).size, 72);
});

test('within 20: each prompt says the two numbers in all three languages, as the Math prompts do, and not the answer', () => {
  const ids = within20Kinds.flatMap(kind => MATH2_KINDS.find(entry => entry.kind === kind).audioIds);
  for (const id of ids) {
    const [first, second] = id.split('-').slice(2).map(Number);
    const sum = id.startsWith('math2-add-');
    assert.deepEqual(prompts[id], sum
      ? { en: `${capital(EN_NUMBERS[first])} plus ${EN_NUMBERS[second]}. How many altogether?`, zh: `${ZH_NUMBERS[first]}加${ZH_NUMBERS[second]}，總共是多少？`, ja: `${JA_NUMBERS[first]}たす${JA_NUMBERS[second]}は、ぜんぶでいくつかな？` }
      : { en: `${capital(EN_NUMBERS[first])} minus ${EN_NUMBERS[second]}. How many are left?`, zh: `${ZH_NUMBERS[first]}減${ZH_NUMBERS[second]}，還剩下多少？`, ja: `${JA_NUMBERS[first]}ひく${JA_NUMBERS[second]}は、のこりはいくつかな？` }, id);
    assert.doesNotMatch(prompts[id].ja, /[ァ-ヿ㐀-鿿]/, `${id} is hiragana only in Japanese`);
    assert.doesNotMatch(prompts[id].en + prompts[id].zh + prompts[id].ja, /\d/, `${id} is written out as it is spoken`);
  }
});

test('within 20: Easy never asks them, Harder shows two ten-frames with the equation, Super shows the equation only', () => {
  assert.equal(within20Questions('easy', 600).length, 0, 'Easy holds only Step 1 content');
  const kindsSeen = new Set();
  for (const level of ['harder', 'super']) {
    const questions = within20Questions(level, 800);
    assert.ok(questions.length > 150, `${level}: within-20 questions are regularly offered`);
    for (const question of questions) {
      kindsSeen.add(question.kind);
      const [first, second] = numbersOf(question);
      const sum = question.kind === 'add-within-20';
      assert.equal(question.audioId, question.key);
      assert.equal(question.display, sum ? `${first} + ${second} = ?` : `${first} − ${second} = ?`);
      assert.equal(Number(question.answerId), sum ? first + second : first - second);
      assert.deepEqual(question.range, { min: 0, max: 20 });
      assert.equal(question.options.length, CHOICE_COUNT[level]);
      assert.equal(question.picture, '');
      assert.equal(question.promptEn, sum ? 'How many altogether?' : 'How many are left?');
      if (level === 'super') assert.equal(question.visual, null, 'no picture on Super');
      else assert.equal(question.visual.type, 'ten-frame');
    }
  }
  assert.deepEqual([...kindsSeen].sort(), within20Kinds);
});

test('within 20: a sum draws its two frames and marks the counters that fill the fuller frame to ten', () => {
  const questions = within20Questions('harder', 800).filter(question => question.kind === 'add-within-20');
  const sums = new Set();
  for (const question of questions) {
    const [left, right] = numbersOf(question);
    sums.add(question.key);
    const { counts, sign, move } = question.visual;
    assert.deepEqual(counts, [left, right]);
    assert.equal(sign, '+');
    const keep = right > left ? 1 : 0;
    assert.deepEqual(move, { from: 1 - keep, to: keep, count: 10 - counts[keep] });
    assert.ok(move.count >= 1 && move.count <= counts[1 - keep], 'the counters moved come from the other frame');
    assert.ok(counts[keep] + move.count === 10 && counts[1 - keep] - move.count >= 0);
  }
  assert.ok(sums.size > 30, `${sums.size} of the 36 sums come up`);
  // 8 + 5: two counters move to fill the frame of eight, leaving three.
  assert.deepEqual(MATH2_KINDS.find(entry => entry.kind === 'add-within-20').generators.harder(() => 0, '', 'harder').visual, { type: 'ten-frame', counts: [2, 9], sign: '+', move: { from: 0, to: 1, count: 1 } });
});

test('within 20: a take-away draws a full frame plus the ones, and crosses out the counters taken away', () => {
  const questions = within20Questions('harder', 800).filter(question => question.kind === 'take-within-20');
  const taken = new Set();
  for (const question of questions) {
    const [from, take] = numbersOf(question);
    taken.add(question.key);
    const { counts, taken: crossedOut } = question.visual;
    assert.deepEqual(counts, [10, from - 10]);
    assert.deepEqual(crossedOut, [take - (from - 10), from - 10], 'all the ones go first, then some of the full frame');
    assert.equal(crossedOut[0] + crossedOut[1], take);
    assert.equal(counts[0] + counts[1] - take, Number(question.answerId));
    assert.equal(question.visual.sign, undefined);
  }
  assert.ok(taken.size > 30, `${taken.size} of the 36 take-aways come up`);
  const thirteenMinusSix = MATH2_KINDS.find(entry => entry.kind === 'take-within-20').generators.harder(() => 0, '', 'harder');
  assert.equal(thirteenMinusSix.key, 'math2-take-11-2');
  assert.deepEqual(thirteenMinusSix.visual, { type: 'ten-frame', counts: [10, 1], taken: [1, 1] });
});

test('within 20: choices stay inside 0-20, hold the answer, and sometimes the slip a child is likely to make', () => {
  for (const level of ['harder', 'super']) {
    const questions = within20Questions(level, 1000);
    let slips = 0;
    for (const question of questions) {
      const answer = Number(question.answerId);
      const slip = question.kind === 'add-within-20' ? answer - 10 : 10 - answer;
      if (valuesOf(question).includes(slip)) slips += 1;
      assert.ok(valuesOf(question).every(value => value >= 0 && value <= 20));
    }
    assert.ok(slips > questions.length * 0.3 && slips < questions.length * 0.9, `${level}: ${slips}/${questions.length}`);
  }
});

test('within 20: sums and take-aways take turns, and the same problem is never asked twice running', () => {
  const asked = drawQuestions('harder', 1500);
  asked.forEach((question, index) => {
    if (index > 0) assert.notEqual(question.key, asked[index - 1].key);
    if (index > 1 && asked[index - 1].kind === question.kind) assert.notEqual(asked[index - 2].kind, question.kind);
  });
});

test('the ten-frame builder marks counters to move, the cells they fill, and counters taken away, and puts a plus between two frames', () => {
  const document = recordingDocument();
  const row = visuals.build({ type: 'ten-frame', counts: [8, 5], sign: '+', move: { from: 1, to: 0, count: 2 } }, document);
  assert.equal(row.className, 'ten-frames ten-frames-pair');
  assert.deepEqual(row.children.map(node => node.tag), ['svg', 'span', 'svg']);
  assert.equal(row.children[1].className, 'ten-frame-sign');
  assert.equal(row.children[1].textContent, '+');
  const [eight, , five] = row.children;
  const classes = (svg, name) => svg.children.filter(node => node.attributes.class === name || (node.attributes.class || '').split(' ').includes(name));
  assert.equal(classes(eight, 'ten-frame-counter').length, 8);
  assert.equal(classes(eight, 'ten-frame-moving').length, 0);
  assert.equal(classes(eight, 'ten-frame-gap').length, 2);
  // The two gap cells are the first two empty cells, straight after the eight counters.
  const cellsOfEight = eight.children.filter(node => (node.attributes.class || '').startsWith('ten-frame-cell'));
  assert.deepEqual(cellsOfEight.map(cell => cell.attributes.class.includes('ten-frame-gap')), [0, 0, 0, 0, 0, 0, 0, 0, 1, 1].map(Boolean));
  assert.equal(classes(five, 'ten-frame-counter').length, 5);
  assert.equal(classes(five, 'ten-frame-moving').length, 2);
  assert.equal(classes(five, 'ten-frame-gap').length, 0);

  const taking = visuals.build({ type: 'ten-frame', counts: [10, 3], taken: [3, 3] }, document);
  assert.deepEqual(taking.children.map(node => node.tag), ['svg', 'svg'], 'no plus without a sign');
  taking.children.forEach(svg => {
    assert.equal(classes(svg, 'ten-frame-taken').length, 3);
    assert.equal(classes(svg, 'ten-frame-cross').length, 6, 'two strokes cross each taken counter');
  });
  assert.equal(classes(taking.children[0], 'ten-frame-counter').length, 10);
  // Taken counters are the last ones filled: here the third counter of the second frame, and the last three of the first.
  const takenIndexes = svg => svg.children.filter(node => node.attributes.class && node.attributes.class.startsWith('ten-frame-counter')).map((node, index) => (node.attributes.class.includes('taken') ? index : -1)).filter(index => index >= 0);
  assert.deepEqual(takenIndexes(taking.children[0]), [7, 8, 9]);
  assert.deepEqual(takenIndexes(taking.children[1]), [0, 1, 2]);
});

test('the ten-frame builder ignores a move or a count of marks that does not fit the frames', () => {
  const document = recordingDocument();
  const marked = visuals.build({ type: 'ten-frame', counts: [9, 4], move: { from: 1, to: 0, count: 7 }, taken: [20, -1] }, document);
  const count = (svg, name) => svg.children.filter(node => (node.attributes.class || '').split(' ').includes(name)).length;
  assert.equal(count(marked.children[1], 'ten-frame-moving'), 1, 'only one empty cell is left to fill');
  assert.equal(count(marked.children[0], 'ten-frame-gap'), 1);
  assert.equal(count(marked.children[0], 'ten-frame-taken'), 9, 'taken is clamped to the counters there');
  assert.equal(count(marked.children[1], 'ten-frame-taken'), 0);
  for (const move of [{ from: 0, to: 0, count: 2 }, { from: 0, to: 5, count: 2 }, { from: 'a', to: 1, count: 2 }, { count: 2 }, null]) {
    const row = visuals.build({ type: 'ten-frame', counts: [8, 5], move }, document);
    assert.equal(count(row.children[0], 'ten-frame-gap') + count(row.children[1], 'ten-frame-moving'), 0, JSON.stringify(move));
  }
  assert.equal(visuals.build({ type: 'ten-frame', counts: [3], sign: '+' }, document).children.length, 1, 'no plus before the first frame');
});
