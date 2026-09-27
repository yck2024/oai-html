'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  ALL_LEVELS,
  generateParentChallenge,
  checkParentAnswer,
  sanitizeAllowedLevels,
  isLevelAllowed,
  resolveAllowedLevel,
  createBreakPacer,
} = require('./pacing.js');

test('the parent gate asks two-digit addition, out of reach for a preschooler', () => {
  for (const seed of [0, 0.25, 0.5, 0.75, 0.999]) {
    const challenge = generateParentChallenge(() => seed);
    assert.ok(challenge.a >= 12 && challenge.a <= 27);
    assert.ok(challenge.b >= 14 && challenge.b <= 29);
    assert.equal(challenge.answer, challenge.a + challenge.b);
  }
});

test('the parent gate accepts only the exact answer, in any numeric-ish form', () => {
  const challenge = { a: 13, b: 20, answer: 33 };
  assert.equal(checkParentAnswer(challenge, '33'), true);
  assert.equal(checkParentAnswer(challenge, ' 33 '), true);
  assert.equal(checkParentAnswer(challenge, 33), true);
  assert.equal(checkParentAnswer(challenge, '34'), false);
  assert.equal(checkParentAnswer(challenge, ''), false);
  assert.equal(checkParentAnswer(challenge, 'thirty-three'), false);
  assert.equal(checkParentAnswer(challenge, null), false);
  assert.equal(checkParentAnswer(null, '33'), false);
});

test('the level lock always keeps at least one level selectable', () => {
  assert.deepEqual(sanitizeAllowedLevels(['harder', 'easy']), ['easy', 'harder']);
  assert.deepEqual(sanitizeAllowedLevels(['super']), ['super']);
  assert.deepEqual(sanitizeAllowedLevels([]), ALL_LEVELS);
  assert.deepEqual(sanitizeAllowedLevels(undefined), ALL_LEVELS);
  assert.deepEqual(sanitizeAllowedLevels(['made-up-level']), ALL_LEVELS);
  assert.deepEqual(sanitizeAllowedLevels(['super', 'easy', 'harder']), ['easy', 'harder', 'super']);
});

test('the level lock reports whether a level is currently allowed', () => {
  assert.equal(isLevelAllowed('easy', ['easy', 'harder']), true);
  assert.equal(isLevelAllowed('super', ['easy', 'harder']), false);
  assert.equal(isLevelAllowed('super', []), true, 'an empty lock list falls back to allowing everything');
});

test('the level lock moves a now-locked-out level to the closest allowed one', () => {
  assert.equal(resolveAllowedLevel('super', ['easy', 'harder']), 'harder');
  assert.equal(resolveAllowedLevel('easy', ['harder', 'super']), 'harder');
  assert.equal(resolveAllowedLevel('harder', ['easy', 'super']), 'easy', 'an exact tie prefers the earlier level');
  assert.equal(resolveAllowedLevel('easy', ['easy', 'harder']), 'easy');
  assert.equal(resolveAllowedLevel('harder', ['super']), 'super');
  assert.equal(resolveAllowedLevel('easy', []), 'easy', 'an empty lock list keeps the current level');
});

test('the break pacer stays quiet before 2 or 3 wins in a row', () => {
  const pacer = createBreakPacer(() => 0); // always rolls the low threshold (2)
  assert.equal(pacer.threshold, 2);
  assert.equal(pacer.recordWin(), false);
  assert.equal(pacer.count, 1);
  assert.equal(pacer.recordWin(), true);
  assert.equal(pacer.count, 0, 'the counter resets once the nudge fires');
});

test('the break pacer re-rolls a fresh 2-or-3 threshold after each nudge', () => {
  const pacer = createBreakPacer(() => 0.9); // always rolls the high threshold (3)
  assert.equal(pacer.threshold, 3);
  assert.equal(pacer.recordWin(), false);
  assert.equal(pacer.recordWin(), false);
  assert.equal(pacer.recordWin(), true);
  assert.equal(pacer.threshold, 3, 'still re-rolls to 3 with this random source');
});

test('the break pacer can be reset without firing a nudge, e.g. after a break', () => {
  const pacer = createBreakPacer(() => 0);
  pacer.recordWin();
  pacer.reset();
  assert.equal(pacer.count, 0);
  assert.equal(pacer.recordWin(), false);
  assert.equal(pacer.recordWin(), true);
});
