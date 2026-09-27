(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Ehon = api;
})(typeof self !== 'undefined' ? self : this, () => {
  'use strict';

  const RUBY = /\{([^|{}]+)\|([^|{}]+)\}/g;
  const HAN = /\p{Script=Han}/u;
  // Pauses give a young listener a beat between the two languages and between sentences.
  const PAUSE_BETWEEN_LANGUAGES = 350;
  const PAUSE_BETWEEN_SENTENCES = 650;

  // Builds every listening mode for a series' configured languages: one two-language mode
  // per ordered pair (narrate the first, then the second, both shown) plus one single-language
  // mode per language. For the historical two-language case (['ja', 'zh']) this produces
  // exactly {'ja-zh': [...], 'zh-ja': [...], ja: [...], zh: [...]} in that same key order, so a
  // series with two languages behaves exactly as the original hand-written LISTEN_MODES did.
  function buildListenModes(languages) {
    const modes = {};
    for (const first of languages) {
      for (const second of languages) {
        if (first === second) continue;
        modes[`${first}-${second}`] = [first, second];
      }
    }
    for (const language of languages) modes[language] = [language];
    return modes;
  }

  function isMode(modes, mode) {
    return Object.prototype.hasOwnProperty.call(modes, mode);
  }

  // A plain, mechanical label for a dynamically generated listening-mode option, used only for
  // a series with more than two configured languages (a two-language series keeps its own
  // hand-written, naturally phrased labels in its index.html and never calls this). Series that
  // add a third language can refine this wording once real content exists to read it against.
  function modeLabel(order, languageNames = {}) {
    const name = language => languageNames[language] || language;
    if (order.length === 1) return `${name(order[0])} だけ`;
    return `${name(order[0])} → ${name(order[1])}`;
  }

  function languagesFor(modes, defaultMode, mode) {
    return modes[isMode(modes, mode) ? mode : defaultMode];
  }

  // Which language(s) to show as page text for the current mode. A two-language series always
  // shows both configured languages, matching the original always-show-both behavior exactly
  // (the narratedOnly toggle does not exist there, so this never trims anything). A series
  // with more than two languages caps display at the narrated pair when the mode already reads
  // two languages; a single-language mode there pairs the narrated language with one companion
  // (its neighbor in the configured language order) unless narratedOnly is on, which then shows
  // the narrated language alone. Either way at most two languages are ever shown at once.
  function displayLanguagesFor(languages, order, narratedOnly) {
    if (narratedOnly) return order;
    if (order.length >= 2) return order;
    const companion = languages.find(language => language !== order[0]);
    return companion ? [order[0], companion] : order;
  }

  function metadataLanguages(languages, selected, record) {
    const limit = Math.min(selected.length, 2);
    const included = selected.filter(language => record[language] !== undefined && record[language] !== null);
    for (const language of languages) {
      if (included.length >= limit) break;
      if (!included.includes(language) && record[language] !== undefined && record[language] !== null) {
        included.push(language);
      }
    }
    return languages.filter(language => included.includes(language));
  }

  // One step per sentence and language, sentence by sentence, so meaning in the first
  // language comes right before the same sentence in the second.
  function pageQueue(page, modes, defaultMode, mode) {
    const order = languagesFor(modes, defaultMode, mode);
    return page.lines.flatMap(line => order
      .filter(lang => line[lang] !== undefined)
      .map(lang => ({ lineId: line.id, lang })));
  }

  function clipPath(storyId, lang, lineId, base = './') {
    return `${base}audio/${storyId}/${lang}/${lineId}.mp3`;
  }

  // The static files that make up the app shell: the shelf page and its scripts/styles/icons,
  // plus every book's own generated page (so a book opens offline once its page has been
  // visited, even before its pictures/narration are downloaded). Built from `stories`, never
  // hand-written, so a new book is covered as soon as it is added to stories.js.
  const SHELL_FILES = [
    '', 'index.html', 'ehon.css', 'ehon.js', 'continuous.js', 'stories.js', 'series.config.js', 'app.js', 'offline.js',
    'manifest.webmanifest', 'audio-timing.js',
    'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-512-maskable.png', 'icons/apple-touch-icon.png',
    'silence/language.mp3', 'silence/sentence.mp3', 'silence/page.mp3',
  ];

  function shellAssetUrls(stories, base = './') {
    const urls = SHELL_FILES.map(name => `${base}${name}`);
    for (const story of stories) urls.push(`${base}${story.id}/`);
    return urls;
  }

  // Every picture and narration clip a single book needs to be fully readable offline,
  // derived from the story's own page/line data rather than a hand-maintained list.
  function bookAssetUrls(story, languages, base = './') {
    const page = `${base}${story.id}/`;
    const images = story.pages.map(item => `${base}${item.image}`);
    const audio = [];
    for (const item of story.pages) {
      for (const line of item.lines) {
        for (const lang of languages) {
          if (line[lang] !== undefined) audio.push(clipPath(story.id, lang, line.id, base));
        }
      }
    }
    return { page, images, audio, all: [page, ...images, ...audio] };
  }

  // Cache Storage names shared by the service worker and the offline-download UI. The shell
  // cache is versioned so an update can clean up stale HTML/CSS/JS; the media cache is not,
  // so a reader's downloaded pictures and narration survive app updates. Both are prefixed by
  // the series' own folder name so sibling series never collide in the same origin's Cache
  // Storage (each series' cache names are computed here from its own series.config.js, never
  // hardcoded, so the historical taiwan-ehon-shell-v1 / taiwan-ehon-media names are unchanged).
  const CACHE_VERSION = 'v1';

  function cacheNames(seriesFolder) {
    return {
      shellCacheName: `${seriesFolder}-shell-${CACHE_VERSION}`,
      mediaCacheName: `${seriesFolder}-media`,
    };
  }

  function isAnalyticsUrl(url) {
    return /^https:\/\/(www\.googletagmanager\.com|www\.google-analytics\.com|[a-z0-9-]+\.google-analytics\.com)\//.test(url);
  }

  function isMediaUrl(url) {
    const pathname = (() => {
      try { return new URL(url, 'https://example.invalid/').pathname; } catch (_error) { return url; }
    })();
    return /\/(images|audio)\//.test(pathname);
  }

  // Japanese text marks furigana as {漢字|かんじ}; everything else is plain kana.
  function parseRuby(text) {
    const segments = [];
    let last = 0;
    for (const match of text.matchAll(RUBY)) {
      if (match.index > last) segments.push({ text: text.slice(last, match.index), ruby: '' });
      segments.push({ text: match[1], ruby: match[2] });
      last = match.index + match[0].length;
    }
    if (last < text.length) segments.push({ text: text.slice(last), ruby: '' });
    return segments;
  }

  function plainJapanese(text) {
    return text.replace(RUBY, '$1');
  }

  function hanCount(text) {
    let count = 0;
    for (const char of text) if (HAN.test(char)) count += 1;
    return count;
  }

  function zhuyinSyllables(zhuyin) {
    return zhuyin.trim().split(/\s+/).filter(Boolean);
  }

  // Pairs every Han character with its 注音 syllable; punctuation carries no ruby.
  function zhuyinSegments(zh, zhuyin) {
    const syllables = zhuyinSyllables(zhuyin);
    if (hanCount(zh) !== syllables.length) {
      throw new Error(`注音 count ${syllables.length} does not match ${hanCount(zh)} characters in: ${zh}`);
    }
    let next = 0;
    return [...zh].map(char => (HAN.test(char)
      ? { text: char, ruby: syllables[next++] }
      : { text: char, ruby: '' }));
  }

  function swipeDirection(dx, dy, threshold = 48) {
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.3) return null;
    return dx < 0 ? 'next' : 'prev';
  }

  function createBook(story, startIndex = 0) {
    const total = story.pages.length;
    let index = 0;

    function goTo(target) {
      const clamped = Math.min(Math.max(Math.trunc(Number(target)) || 0, 0), total - 1);
      const moved = clamped !== index;
      index = clamped;
      return moved;
    }

    goTo(startIndex);
    return {
      story,
      total,
      get index() { return index; },
      page: () => story.pages[index],
      isFirst: () => index === 0,
      isLast: () => index === total - 1,
      next: () => goTo(index + 1),
      prev: () => goTo(index - 1),
      goTo,
    };
  }

  // Plays a list of {lineId, lang} steps through one audio element. Every new request or
  // stop bumps a token, so a late "ended" or failure from an old clip is ignored.
  function createNarrator(audio, handlers = {}, wait = (ms, fn) => setTimeout(fn, ms), assetBase = './') {
    const { onStep = () => {}, onDone = () => {}, onUnavailable = () => {} } = handlers;
    let token = 0;
    let steps = [];
    let position = -1;
    let storyId = '';
    let state = 'idle';
    let pendingAdvance = null;
    let pauseVersion = 0;

    function reset() {
      token += 1;
      steps = [];
      position = -1;
      pendingAdvance = null;
      state = 'idle';
      if (audio) {
        audio.pause();
        try { audio.currentTime = 0; } catch (_error) { /* not yet loaded */ }
      }
    }

    function stop() {
      const wasActive = state !== 'idle';
      reset();
      if (wasActive) onStep(null);
    }

    function fail(current) {
      if (current !== token) return;
      reset();
      onStep(null);
      onUnavailable();
    }

    function playAudio(current) {
      const versionAtPlay = pauseVersion;
      try {
        const playback = audio.play();
        if (playback && typeof playback.catch === 'function') {
          playback.catch(error => {
            if (current !== token) return;
            if (error?.name === 'AbortError' && versionAtPlay !== pauseVersion) return;
            fail(current);
          });
        }
      } catch (_error) {
        fail(current);
      }
    }

    function playAt(current, index, startPaused = false) {
      if (current !== token) return;
      if (index >= steps.length) {
        reset();
        onStep(null);
        onDone();
        return;
      }
      position = index;
      state = startPaused ? 'paused' : 'playing';
      const step = steps[index];
      onStep(step);
      audio.onended = () => {
        if (current !== token) return;
        const following = steps[index + 1];
        const pause = following && following.lineId === step.lineId ? PAUSE_BETWEEN_LANGUAGES : PAUSE_BETWEEN_SENTENCES;
        if (!following) playAt(current, index + 1);
        else {
          const advance = { index: index + 1, ready: false };
          pendingAdvance = advance;
          wait(pause, () => {
            if (current !== token || pendingAdvance !== advance) return;
            advance.ready = true;
            if (state !== 'paused') {
              pendingAdvance = null;
              playAt(current, advance.index);
            }
          });
        }
      };
      audio.onerror = () => fail(current);
      audio.src = clipPath(storyId, step.lang, step.lineId, assetBase);
      if (!startPaused) playAudio(current);
    }

    function play(nextStoryId, nextSteps, { paused = false } = {}) {
      reset();
      if (!audio || !nextSteps.length) {
        onUnavailable();
        return false;
      }
      storyId = nextStoryId;
      steps = nextSteps.map(step => ({ ...step }));
      playAt(token, 0, paused);
      return true;
    }

    function pause() {
      if (state !== 'playing') return false;
      pauseVersion += 1;
      audio.pause();
      state = 'paused';
      return true;
    }

    function resume() {
      if (state !== 'paused') return false;
      const current = token;
      if (pendingAdvance) {
        const advance = pendingAdvance;
        state = 'playing';
        if (advance.ready) {
          pendingAdvance = null;
          playAt(current, advance.index);
        }
        return true;
      }
      state = 'playing';
      playAudio(current);
      return true;
    }

    return {
      play,
      pause,
      resume,
      stop,
      get state() { return state; },
      get current() { return position >= 0 ? { ...steps[position] } : null; },
    };
  }

  return {
    PAUSE_BETWEEN_LANGUAGES,
    PAUSE_BETWEEN_SENTENCES,
    buildListenModes,
    modeLabel,
    isMode,
    languagesFor,
    displayLanguagesFor,
    metadataLanguages,
    pageQueue,
    clipPath,
    shellAssetUrls,
    bookAssetUrls,
    cacheNames,
    isAnalyticsUrl,
    isMediaUrl,
    parseRuby,
    plainJapanese,
    hanCount,
    zhuyinSyllables,
    zhuyinSegments,
    swipeDirection,
    createBook,
    createNarrator,
  };
});
