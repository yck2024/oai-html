(() => {
  'use strict';

  // Pure, framework-free logic for the grown-up gate, the level lock, and the
  // post-win pacing nudge. Kept separate from game.js so each can be unit
  // tested on its own, and from the DOM wiring in app.js.

  const ALL_LEVELS = ['easy', 'harder', 'super'];

  // A grown-up-only arithmetic check, in the spirit of Duolingo ABC's "type the
  // spelled-out number" gate: two-digit addition is out of reach for the
  // preschoolers this game is built for, so a correct answer is good evidence
  // an adult is the one tapping, without needing a translated word bank.
  function generateParentChallenge(random = Math.random) {
    const a = 12 + Math.floor(random() * 16); // 12–27
    const b = 14 + Math.floor(random() * 16); // 14–29
    return { a, b, answer: a + b };
  }

  function checkParentAnswer(challenge, input) {
    if (!challenge) return false;
    const value = Number(String(input ?? '').trim());
    return Number.isFinite(value) && value === challenge.answer;
  }

  // Keeps at least one level selectable, in a fixed easy→harder→super order,
  // regardless of what a caller passes in (bad data, or every box unchecked).
  function sanitizeAllowedLevels(levels) {
    const kept = new Set(Array.isArray(levels) ? levels : []);
    const ordered = ALL_LEVELS.filter(level => kept.has(level));
    return ordered.length ? ordered : [...ALL_LEVELS];
  }

  function isLevelAllowed(level, allowedLevels) {
    return sanitizeAllowedLevels(allowedLevels).includes(level);
  }

  // If the current level just got locked out, hands back the closest allowed
  // level instead, preferring the earlier level on an exact tie.
  function resolveAllowedLevel(currentLevel, allowedLevels) {
    const allowed = sanitizeAllowedLevels(allowedLevels);
    if (allowed.includes(currentLevel)) return currentLevel;
    const currentIndex = ALL_LEVELS.indexOf(currentLevel);
    return allowed.reduce((closest, level) => {
      const distance = Math.abs(ALL_LEVELS.indexOf(level) - currentIndex);
      const closestDistance = Math.abs(ALL_LEVELS.indexOf(closest) - currentIndex);
      return distance < closestDistance ? level : closest;
    });
  }

  // After 2 or 3 match wins in a row (re-rolled each time), the pacer signals
  // it is time for the soft "one more round or a break?" nudge. There is no
  // timer and nothing is lost either way; this only shapes when the nudge
  // itself appears.
  function createBreakPacer(random = Math.random) {
    function rollThreshold() {
      return random() < 0.5 ? 2 : 3;
    }

    let threshold = rollThreshold();
    let count = 0;

    function recordWin() {
      count += 1;
      if (count >= threshold) {
        count = 0;
        threshold = rollThreshold();
        return true;
      }
      return false;
    }

    function reset() {
      count = 0;
      threshold = rollThreshold();
    }

    return {
      recordWin,
      reset,
      get count() { return count; },
      get threshold() { return threshold; },
    };
  }

  const api = {
    ALL_LEVELS,
    generateParentChallenge,
    checkParentAnswer,
    sanitizeAllowedLevels,
    isLevelAllowed,
    resolveAllowedLevel,
    createBreakPacer,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaPacing = api;
})();
