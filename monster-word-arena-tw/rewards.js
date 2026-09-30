(() => {
  'use strict';

  // Only the sticker-earning win count, each champion's chosen costume, and today's per-language/level sticker
  // tally are saved, on this device only. The key keeps its v1 name so earlier saves load in place; the payload's
  // own `v` is 2 once a daily tally is written, and older payloads (v1, no tally) migrate on first read.
  const STORAGE_KEY = 'monsterWordArena.rewards.v1';
  const CHAMPIONS = ['dino', 'monster'];
  const MAX_WINS = 9999;
  const LANGUAGES = ['en', 'zh', 'ja'];
  const LEVELS = ['easy', 'harder', 'super'];
  // Level-up rule: each win pays one sticker, but only up to a daily cap for every pairing of the language the
  // player picked and the level they play. Harder levels leave more room; Super has no cap. Caps count on the
  // device's local date, so they reset at local midnight.
  const DAILY_CAPS = { easy: 2, harder: 4, super: Infinity };
  const MAX_TALLY = 999;
  // Original art; each emoji icon remains the fallback if its picture cannot load.
  const STICKERS = [
    { id: 'star', zh: '星星', en: 'Star', ja: 'ほし', icon: '⭐', image: './images/sticker-star.webp' },
    { id: 'rainbow', zh: '彩虹', en: 'Rainbow', ja: 'にじ', icon: '🌈', image: './images/sticker-rainbow.webp' },
    { id: 'heart', zh: '愛心', en: 'Heart', ja: 'はーと', icon: '💖', image: './images/sticker-heart.webp' },
    { id: 'balloon', zh: '氣球', en: 'Balloon', ja: 'ふうせん', icon: '🎈', image: './images/sticker-balloon.webp' },
    { id: 'sun', zh: '太陽', en: 'Sun', ja: 'たいよう', icon: '☀️', image: './images/sticker-sun.webp' },
    { id: 'medal', zh: '獎牌', en: 'Medal', ja: 'めだる', icon: '🏅', image: './images/sticker-medal.webp' },
    { id: 'cupcake', zh: '杯子蛋糕', en: 'Cupcake', ja: 'かっぷけーき', icon: '🧁', image: './images/sticker-cupcake.webp' },
    { id: 'bubbles', zh: '泡泡', en: 'Bubbles', ja: 'あわ', icon: '🫧', image: './images/sticker-bubbles.webp' },
    { id: 'flower', zh: '小花', en: 'Flower', ja: 'おはな', icon: '🌼', image: './images/sticker-flower.webp' },
    { id: 'moon', zh: '月亮', en: 'Moon', ja: 'つき', icon: '🌙', image: './images/sticker-moon.webp' },
    { id: 'egg', zh: '恐龍蛋', en: 'Dino egg', ja: 'きょうりゅうの　たまご', icon: '🥚', image: './images/sticker-egg.webp' },
    { id: 'lollipop', zh: '棒棒糖', en: 'Lollipop', ja: 'ぺろぺろきゃんでぃ', icon: '🍭', image: './images/sticker-lollipop.webp' },
  ];
  const COSTUMES = [
    { id: 'crown', zh: '皇冠', en: 'Crown', ja: 'かんむり', icon: '👑', image: './images/costume-crown.webp', unlockAt: 2 },
    { id: 'party-hat', zh: '派對帽', en: 'Party hat', ja: 'ぱーてぃーぼうし', icon: '🎉', image: './images/costume-party-hat.webp', unlockAt: 4 },
    { id: 'flower-crown', zh: '花冠', en: 'Flower crown', ja: 'はなかんむり', icon: '🌸', image: './images/costume-flower-crown.webp', unlockAt: 6 },
    { id: 'propeller-cap', zh: '螺旋槳帽', en: 'Propeller cap', ja: 'ぷろぺらぼうし', icon: '🧢', image: './images/costume-propeller-cap.webp', unlockAt: 8 },
  ];

  function emptyWearing() {
    return { dino: null, monster: null };
  }

  function isUnlocked(costumeId, wins) {
    return COSTUMES.some(costume => costume.id === costumeId && wins >= costume.unlockAt);
  }

  function tallyKey(language, level) {
    return `${language}:${level}`;
  }

  function localDate(now) {
    const date = now();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  // A saved tally only counts on the day it was written; a different day starts every pairing at zero.
  function cleanDaily(saved, today) {
    const counts = {};
    if (saved?.date === today && saved.counts && typeof saved.counts === 'object') {
      LANGUAGES.forEach(language => LEVELS.forEach(level => {
        const count = saved.counts[tallyKey(language, level)];
        if (Number.isInteger(count) && count > 0) counts[tallyKey(language, level)] = Math.min(count, MAX_TALLY);
      }));
    }
    return { date: today, counts };
  }

  function cleanSave(saved, today) {
    const wins = Number.isInteger(saved?.wins) ? Math.min(Math.max(saved.wins, 0), MAX_WINS) : 0;
    const wearing = emptyWearing();
    CHAMPIONS.forEach(champion => {
      const costumeId = saved?.wearing?.[champion];
      if (isUnlocked(costumeId, wins)) wearing[champion] = costumeId;
    });
    return { wins, wearing, daily: cleanDaily(saved?.daily, today) };
  }

  // Win number n (1-based) earns sticker (n - 1) mod 12, so a full book repeats with a count badge.
  function stickerForWin(wins) {
    return STICKERS[(wins - 1) % STICKERS.length];
  }

  function createRewards(storage = null, { now = () => new Date() } = {}) {
    let persistent = Boolean(storage);
    let state = cleanSave(null, localDate(now));

    // Re-reads the device save (another tab may have written it) and rolls the tally over at local midnight.
    function load() {
      const today = localDate(now);
      if (storage && persistent) {
        try {
          const raw = storage.getItem(STORAGE_KEY);
          state = cleanSave(raw ? JSON.parse(raw) : null, today);
        } catch (_error) {}
      }
      if (state.daily.date !== today) state = { ...state, daily: cleanDaily(null, today) };
    }

    function save() {
      if (!storage) return;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ v: 2, wins: state.wins, wearing: state.wearing, daily: state.daily }));
        persistent = true;
      } catch (_error) {
        persistent = false;
      }
    }

    function getState() {
      load();
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

    function earnedToday(language, level) {
      return state.daily.counts[tallyKey(language, level)] || 0;
    }

    function hasRoom(language, level) {
      return earnedToday(language, level) < DAILY_CAPS[level];
    }

    // Where the next sticker can come from, never pointing at a level a grown-up has locked away:
    // 'harder' (a higher allowed level with room in this language), 'language' (another language with room at any
    // allowed level), both, or 'tomorrow' when nothing is left today.
    function adviceFor(language, level, allowedLevels) {
      const allowed = LEVELS.filter(item => (Array.isArray(allowedLevels) ? allowedLevels : LEVELS).includes(item));
      const harder = allowed.some(item => LEVELS.indexOf(item) > LEVELS.indexOf(level) && hasRoom(language, item));
      const other = LANGUAGES.some(item => item !== language && allowed.some(allowedLevel => hasRoom(item, allowedLevel)));
      if (harder && other) return 'harder-or-language';
      if (harder) return 'harder';
      return other ? 'language' : 'tomorrow';
    }

    // context: { language, level, allowedLevels } of the match just won. Without a valid language and level there
    // is nothing to cap, so the win always pays a sticker.
    function recordWin(champion, context = null) {
      load();
      const { language, level } = context || {};
      const capped = LANGUAGES.includes(language) && LEVELS.includes(level);
      if (capped && !hasRoom(language, level)) {
        return {
          wins: state.wins,
          rewarded: false,
          capped: true,
          reason: 'daily-cap',
          advice: adviceFor(language, level, context.allowedLevels),
          sticker: null,
          firstTime: false,
          unlocked: null,
        };
      }
      const rewarded = state.wins < MAX_WINS;
      const wins = Math.min(state.wins + 1, MAX_WINS);
      const unlocked = COSTUMES.find(costume => costume.unlockAt === wins) || null;
      const wearing = { ...state.wearing };
      if (unlocked && CHAMPIONS.includes(champion)) wearing[champion] = unlocked.id;
      const counts = { ...state.daily.counts };
      if (capped) counts[tallyKey(language, level)] = earnedToday(language, level) + 1;
      state = { wins, wearing, daily: { date: state.daily.date, counts } };
      save();
      return {
        wins,
        rewarded,
        capped: false,
        reason: rewarded ? 'earned' : 'book-full',
        sticker: { ...stickerForWin(wins) },
        firstTime: wins <= STICKERS.length,
        unlocked: unlocked && { ...unlocked },
      };
    }

    // Stickers already earned today for a language and level, and that pairing's cap (null when there is none).
    function dailyProgress(language, level) {
      load();
      const cap = DAILY_CAPS[level];
      return { earned: earnedToday(language, level), cap: Number.isFinite(cap) ? cap : null };
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
      state = cleanSave(null, localDate(now));
      if (!storage) return;
      try {
        storage.removeItem(STORAGE_KEY);
        persistent = true;
      } catch (_error) {
        persistent = false;
      }
    }

    return { getState, recordWin, dailyProgress, wear, reset };
  }

  const api = { STORAGE_KEY, STICKERS, COSTUMES, DAILY_CAPS, createRewards };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.ArenaRewardsCore = api;
})();
