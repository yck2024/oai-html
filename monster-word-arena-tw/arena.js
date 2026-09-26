(() => {
  'use strict';

  // Each champion sheet holds these poses left to right; CSS maps a pose to its frame.
  const POSES = ['ready', 'power', 'block', 'giggle', 'bow', 'high5'];
  const MOVES = { dino: 'swish', monster: 'bubbles' };
  const ART = [
    './images/champion-rex.webp',
    './images/champion-bobo.webp',
    './images/arena-star.webp',
    './images/arena-swish.webp',
    './images/arena-bubbles.webp',
    './images/arena-trophy.webp',
  ];
  // Milliseconds from a right answer or miss to each beat of the show.
  const TIMING = { land: 420, settle: 1500, bow: 1300, highFive: 2400, blockSettle: 1100 };
  const BURST_STARS = 7;
  const SHOWER_STARS = 12;
  const ACTION_CLASSES = ['do-ready', 'do-spar', 'thinking', 'is-bowing', 'is-victory'];

  function comboText(streak) {
    return streak >= 2 ? `${streak} in a row! 連續答對 ${streak} 題！` : '';
  }

  function createArenaStage(doc) {
    const stage = doc.querySelector('#arenaStage');
    const heroArt = doc.querySelector('#heroArt');
    const buddyArt = doc.querySelector('#buddyArt');
    const moveBubble = doc.querySelector('#moveBubble');
    const effects = doc.querySelector('#stageEffects');
    const comboBadge = doc.querySelector('#comboBadge');
    const comboCount = doc.querySelector('#comboCount');
    let timers = [];
    let streak = 0;

    // The game stays fully playable without pictures: one missing file switches every champion back to emoji.
    if (typeof Image !== 'undefined') {
      ART.forEach(source => {
        const probe = new Image();
        probe.addEventListener('error', () => doc.documentElement.classList.add('no-champion-art'));
        probe.src = source;
      });
    }

    // On a phone the arena stays pinned above the answers; keep focused controls from sliding under it.
    const arenaCard = doc.querySelector('.arena-card');
    if (arenaCard && typeof ResizeObserver === 'function') {
      new ResizeObserver(() => doc.documentElement.style.setProperty('--arena-card-height', `${arenaCard.offsetHeight}px`)).observe(arenaCard);
    }

    function reducedMotion() {
      return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function later(delay, callback) {
      timers.push(setTimeout(callback, delay));
    }

    function clearTimers() {
      timers.forEach(timer => clearTimeout(timer));
      timers = [];
    }

    function pose(hero, buddy) {
      heroArt.dataset.pose = hero;
      buddyArt.dataset.pose = buddy;
    }

    function play(className) {
      stage.classList.remove(...ACTION_CLASSES);
      void stage.offsetWidth;
      stage.classList.add(className);
    }

    function sparkle(className, count) {
      if (reducedMotion()) return;
      effects.append(...Array.from({ length: count }, () => {
        const star = doc.createElement('span');
        star.className = className;
        star.textContent = '★';
        return star;
      }));
    }

    function renderCombo() {
      comboCount.textContent = String(streak);
      comboBadge.classList.toggle('is-shown', streak >= 2);
      if (streak < 2) return;
      comboBadge.classList.remove('is-bumped');
      void comboBadge.offsetWidth;
      comboBadge.classList.add('is-bumped');
    }

    function settle() {
      clearTimers();
      stage.classList.remove(...ACTION_CLASSES);
      effects.replaceChildren();
      pose('ready', 'ready');
    }

    function startMatch() {
      settle();
      streak = 0;
      renderCombo();
    }

    function setChampion(champion) {
      settle();
      heroArt.dataset.character = champion;
      buddyArt.dataset.character = champion === 'dino' ? 'monster' : 'dino';
      moveBubble.dataset.move = MOVES[champion];
      play('do-ready');
    }

    // A right answer: power move, the buddy wobbles and giggles, and stars fly.
    // The winning answer continues into the buddy's bow and a shared high-five.
    function powerMove(finished) {
      settle();
      streak += 1;
      renderCombo();
      play('do-spar');
      pose('power', 'ready');
      later(TIMING.land, () => {
        pose('power', 'giggle');
        sparkle('burst-star', BURST_STARS);
      });
      if (finished) {
        later(TIMING.bow, () => {
          pose('ready', 'bow');
          stage.classList.add('is-bowing');
        });
        later(TIMING.highFive, () => {
          pose('high5', 'high5');
          stage.classList.remove('is-bowing');
          stage.classList.add('is-victory');
          effects.replaceChildren();
          sparkle('shower-star', SHOWER_STARS);
          sparkle('high-five-pop', 1);
        });
      } else {
        later(TIMING.settle, () => {
          pose('ready', 'ready');
          stage.classList.remove('do-spar');
        });
      }
      return streak;
    }

    // A miss: the buddy's pillow block, with no penalty; the right-in-a-row streak quietly restarts.
    function block() {
      settle();
      streak = 0;
      renderCombo();
      play('thinking');
      pose('ready', 'block');
      later(TIMING.blockSettle, () => pose('ready', 'ready'));
    }

    renderCombo();
    return { setChampion, startMatch, powerMove, block, settle };
  }

  const api = { POSES, MOVES, ART, TIMING, comboText, createArenaStage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaStage = api;
})();
