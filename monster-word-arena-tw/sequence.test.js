'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { MATH2_KINDS, CHOICE_COUNT, createGame } = require('./game.js');
const { build } = require('./math2-visuals.js');
const prompts = require('./audio/prompts.json');
const sequence = MATH2_KINDS.find(entry => entry.kind === 'sequence');

function random(seed = 17) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Exercise each pool entry directly, independent of which other cards are registered in Math 2.
function drafts(level) {
  const found = new Map();
  for (let index = 0; index < 1000; index += 1) {
    const draft = sequence.generators[level](() => index / 1000, null, level);
    found.set(draft.key, draft);
  }
  return [...found.values()];
}

for (const [level, expectedSteps] of [['easy', [1, 10]], ['harder', [2, 5, 10]], ['super', [-10, -5, -2, -1]]]) {
  test(`sequence ${level}: regular counting, one hidden answer, and level-appropriate steps`, () => {
    const steps = new Set();
    const gaps = new Set();
    const answers = new Set();
    for (const draft of drafts(level)) {
      const { values } = draft.visual;
      assert.equal(draft.visual.type, 'sequence');
      assert.equal(values.length, 4);
      assert.equal(values.filter(value => value === null).length, 1);
      const gap = values.indexOf(null);
      const completed = values.map(value => value === null ? draft.answer : value);
      const step = completed[1] - completed[0];
      steps.add(step);
      gaps.add(gap);
      answers.add(draft.answer);
      assert.deepEqual(completed.slice(1).map((value, index) => value - completed[index]), [step, step, step]);
      assert.ok(completed.every(value => Number.isInteger(value) && value >= 0 && value <= draft.range.max));
      assert.equal(draft.range.max, Math.abs(step) <= 2 ? 20 : 100);
      assert.ok(completed.every(value => value % Math.abs(step) === 0), 'skip-counting starts on a multiple');
      assert.equal(draft.choices.length, CHOICE_COUNT[level]);
      assert.equal(new Set(draft.choices).size, draft.choices.length);
      assert.equal(draft.choices.filter(value => value === draft.answer).length, 1);
      assert.ok(draft.choices.every(value => value >= 0 && value <= draft.range.max));
      const audioId = gap !== 3 ? 'math2-sequence-missing' : step < 0 ? 'math2-sequence-backward' : step === 1 ? 'math2-sequence-next' : 'math2-sequence-jumps';
      assert.equal(draft.audioId, audioId);
      for (const [language, field] of [['en', 'promptEn'], ['zh', 'promptZh'], ['ja', 'promptJa']]) {
        assert.equal(draft[field], prompts[audioId][language]);
        assert.doesNotMatch(draft[field], /\d/, 'shared speech never reads the hidden answer');
      }
      assert.doesNotMatch(draft.promptJa, /[ァ-ヿ㐀-鿿]/, 'Japanese on-screen prompts use hiragana');
    }
    assert.deepEqual([...steps].sort((a, b) => a - b), expectedSteps);
    assert.deepEqual([...gaps].sort(), level === 'easy' ? [3] : [1, 2, 3]);
    assert.ok(answers.has(level === 'super' ? 0 : 20));
    if (level !== 'super') assert.ok(answers.has(100), 'forward tens reach 100');
  });
}

test('sequence generators never repeat a key, even with a constant random source', () => {
  for (const level of ['easy', 'harder', 'super']) {
    for (const rng of [() => 0, () => 0.5, () => 0.999999, random()]) {
      let previous;
      for (let index = 0; index < 80; index += 1) {
        const draft = sequence.generators[level](rng, previous, level);
        assert.notEqual(draft.key, previous);
        previous = draft.key;
      }
    }
  }
});

test('four shared sequence prompts are all reachable, without one clip per question', () => {
  const reached = new Set(['easy', 'harder', 'super'].flatMap(level => drafts(level).map(draft => draft.audioId)));
  assert.equal(sequence.audioIds.length, 4);
  assert.deepEqual([...reached].sort(), [...sequence.audioIds].sort());
});

test('sequence builder preserves order and renders only the gap as a dashed question tile', () => {
  const document = { createElement(tag) {
    return { tag, children: [], append(child) { this.children.push(child); } };
  } };
  for (const values of [[70, 80, 90, null], [20, null, 10, 5], [4, 6, null, 10]]) {
    const row = build({ type: 'sequence', values }, document);
    assert.equal(row.className, 'numeral-row sequence-row');
    assert.deepEqual(row.children.map(tile => tile.textContent), values.map(value => value === null ? '?' : String(value)));
    assert.equal(row.children.filter(tile => tile.className.includes('sequence-gap')).length, 1);
    assert.equal(row.children[values.indexOf(null)].className, 'numeral-tile sequence-gap');
  }
});

test('sequence plays through number buttons: a correct tap earns a star, a miss loses a heart, and kinds rotate', () => {
  const game = createGame(random());
  game.chooseTopic('math2');
  const kinds = [];
  const seen = new Set();
  for (let index = 0; index < 120; index += 1) {
    const question = game.getState().question;
    kinds.push(question.kind);
    seen.add(question.kind);
    if (index >= 2) assert.ok(kinds[index] !== kinds[index - 1] || kinds[index] !== kinds[index - 2]);
    if (question.kind === 'sequence') {
      const before = game.getState();
      if (index % 2 === 0) {
        assert.equal(game.answer(question.answerId), 'correct');
        assert.equal(game.getState().stars, before.stars + 1);
        assert.equal(game.getState().hearts, before.hearts);
      } else {
        const wrong = question.options.find(option => option.id !== question.answerId).id;
        assert.equal(game.answer(wrong), 'missed');
        assert.equal(game.getState().hearts, before.hearts - 1);
        assert.equal(game.answer(question.answerId), 'ignored', 'a second tap cannot earn a star');
      }
      game.restart();
      if (game.getState().lost) game.tryAgain();
    } else game.chooseTopic('math2');
  }
  assert.ok(seen.has('sequence') && seen.has('compare'));
});
