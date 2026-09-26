(() => {
  'use strict';

  // Only the win count and each champion's chosen costume are saved, on this device only.
  const STORAGE_KEY = 'monsterWordArena.rewards.v1';
  const CHAMPIONS = ['dino', 'monster'];
  const MAX_WINS = 9999;
  // Original art; each emoji icon remains the fallback if its picture cannot load.
  const STICKERS = [
    { id: 'star', zh: '星星', en: 'Star', icon: '⭐', image: './images/sticker-star.webp' },
    { id: 'rainbow', zh: '彩虹', en: 'Rainbow', icon: '🌈', image: './images/sticker-rainbow.webp' },
    { id: 'heart', zh: '愛心', en: 'Heart', icon: '💖', image: './images/sticker-heart.webp' },
    { id: 'balloon', zh: '氣球', en: 'Balloon', icon: '🎈', image: './images/sticker-balloon.webp' },
    { id: 'sun', zh: '太陽', en: 'Sun', icon: '☀️', image: './images/sticker-sun.webp' },
    { id: 'medal', zh: '獎牌', en: 'Medal', icon: '🏅', image: './images/sticker-medal.webp' },
    { id: 'cupcake', zh: '杯子蛋糕', en: 'Cupcake', icon: '🧁', image: './images/sticker-cupcake.webp' },
    { id: 'bubbles', zh: '泡泡', en: 'Bubbles', icon: '🫧', image: './images/sticker-bubbles.webp' },
    { id: 'flower', zh: '小花', en: 'Flower', icon: '🌼', image: './images/sticker-flower.webp' },
    { id: 'moon', zh: '月亮', en: 'Moon', icon: '🌙', image: './images/sticker-moon.webp' },
    { id: 'egg', zh: '恐龍蛋', en: 'Dino egg', icon: '🥚', image: './images/sticker-egg.webp' },
    { id: 'lollipop', zh: '棒棒糖', en: 'Lollipop', icon: '🍭', image: './images/sticker-lollipop.webp' },
  ];
  const COSTUMES = [
    { id: 'crown', zh: '皇冠', en: 'Crown', icon: '👑', image: './images/costume-crown.webp', unlockAt: 2 },
    { id: 'party-hat', zh: '派對帽', en: 'Party hat', icon: '🎉', image: './images/costume-party-hat.webp', unlockAt: 4 },
    { id: 'flower-crown', zh: '花冠', en: 'Flower crown', icon: '🌸', image: './images/costume-flower-crown.webp', unlockAt: 6 },
    { id: 'propeller-cap', zh: '螺旋槳帽', en: 'Propeller cap', icon: '🧢', image: './images/costume-propeller-cap.webp', unlockAt: 8 },
  ];

  function emptyWearing() {
    return { dino: null, monster: null };
  }

  function isUnlocked(costumeId, wins) {
    return COSTUMES.some(costume => costume.id === costumeId && wins >= costume.unlockAt);
  }

  function cleanSave(saved) {
    const wins = Number.isInteger(saved?.wins) ? Math.min(Math.max(saved.wins, 0), MAX_WINS) : 0;
    const wearing = emptyWearing();
    CHAMPIONS.forEach(champion => {
      const costumeId = saved?.wearing?.[champion];
      if (isUnlocked(costumeId, wins)) wearing[champion] = costumeId;
    });
    return { wins, wearing };
  }

  // Win number n (1-based) earns sticker (n - 1) mod 12, so a full book repeats with a count badge.
  function stickerForWin(wins) {
    return STICKERS[(wins - 1) % STICKERS.length];
  }

  function createRewards(storage = null) {
    let persistent = Boolean(storage);
    let state = { wins: 0, wearing: emptyWearing() };

    function load() {
      if (!storage || !persistent) return;
      try {
        const raw = storage.getItem(STORAGE_KEY);
        state = raw ? cleanSave(JSON.parse(raw)) : { wins: 0, wearing: emptyWearing() };
      } catch (_error) {}
    }

    load();

    function save() {
      if (!storage) return;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, wins: state.wins, wearing: state.wearing }));
        persistent = true;
      } catch (_error) {
        persistent = false;
      }
    }

    function getState() {
      const { wins } = state;
      const stickers = STICKERS.map((sticker, index) => ({
        ...sticker,
        count: wins > index ? Math.floor((wins - 1 - index) / STICKERS.length) + 1 : 0,
      }));
      const nextCostume = COSTUMES.find(costume => wins < costume.unlockAt) || null;
      return {
        wins,
        persistent,
        stickers,
        collected: stickers.filter(sticker => sticker.count > 0).length,
        costumes: COSTUMES.map(costume => ({ ...costume, unlocked: wins >= costume.unlockAt })),
        wearing: { ...state.wearing },
        nextCostume: nextCostume && { ...nextCostume, winsToGo: nextCostume.unlockAt - wins },
      };
    }

    function recordWin(champion) {
      load();
      const wins = Math.min(state.wins + 1, MAX_WINS);
      const unlocked = COSTUMES.find(costume => costume.unlockAt === wins) || null;
      const wearing = { ...state.wearing };
      if (unlocked && CHAMPIONS.includes(champion)) wearing[champion] = unlocked.id;
      state = { wins, wearing };
      save();
      return {
        wins,
        sticker: { ...stickerForWin(wins) },
        firstTime: wins <= STICKERS.length,
        unlocked: unlocked && { ...unlocked },
      };
    }

    function wear(champion, costumeId) {
      if (!CHAMPIONS.includes(champion)) return false;
      load();
      if (costumeId !== null && !isUnlocked(costumeId, state.wins)) return false;
      state = { ...state, wearing: { ...state.wearing, [champion]: costumeId } };
      save();
      return true;
    }

    function reset() {
      state = { wins: 0, wearing: emptyWearing() };
      if (!storage) return;
      try {
        storage.removeItem(STORAGE_KEY);
        persistent = true;
      } catch (_error) {
        persistent = false;
      }
    }

    return { getState, recordWin, wear, reset };
  }

  const api = { STORAGE_KEY, STICKERS, COSTUMES, createRewards };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.ArenaRewardsCore = api;
})();
