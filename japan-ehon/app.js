(() => {
  'use strict';

  const E = window.Ehon;
  const C = window.EhonContinuous;
  const TIMING = window.EhonAudioTiming;
  const STORIES = window.EhonStories;
  const SERIES = window.EhonSeriesConfig;
  const LISTEN_MODES = E.buildListenModes(SERIES.languages);
  const DEFAULT_MODE = SERIES.defaultMode;
  const SETTINGS_KEY = `${SERIES.folder}-settings`;
  const AUTO_TURN_DELAY = 1500;
  const TURN_SETTLE = 450;
  const HINT = SERIES.hint;
  const UNAVAILABLE = SERIES.unavailable;
  const PREPARING_CONTINUOUS = 'よみつづける おとを つくっています… ・ 連續播放準備中…';
  const TAP_TO_START = '▶ を おして はじめてね ・ 按 ▶ 開始播放';
  const SHELF_MARKER = SERIES.shelfMarker;
  const SHELF_PAGE_TITLE = SERIES.shelfPageTitle;
  const SHELF_DOCUMENT_TITLE = SERIES.shelfDocumentTitle;
  const selectableMetadata = SERIES.languages.length > 2;

  const shelf = document.querySelector('#shelf');
  const bookList = document.querySelector('#bookList');
  const reader = document.querySelector('#reader');
  const readerTitle = document.querySelector('#readerTitle');
  const closeButton = document.querySelector('#closeBook');
  const settingsButton = document.querySelector('#settingsButton');
  const settingsPanel = document.querySelector('#settingsPanel');
  const modeOptionsContainer = document.querySelector('#modeOptions');
  const zhuyinToggle = document.querySelector('#zhuyinToggle');
  const autoTurnToggle = document.querySelector('#autoTurnToggle');
  const continuousToggle = document.querySelector('#continuousToggle');
  const stage = document.querySelector('#stage');
  const pageEl = document.querySelector('#page');
  const pageArt = document.querySelector('#pageArt');
  const pageImage = document.querySelector('#pageImage');
  const pageText = document.querySelector('#pageText');
  const speechStatus = document.querySelector('#speechStatus');
  const prevButton = document.querySelector('#prevButton');
  const nextButton = document.querySelector('#nextButton');
  const playButton = document.querySelector('#playButton');
  const playIcon = document.querySelector('#playIcon');
  const replayButton = document.querySelector('#replayButton');
  const muteButton = document.querySelector('#muteButton');
  const muteIcon = document.querySelector('#muteIcon');
  const pageCounter = document.querySelector('#pageCounter');

  function element(tag, className, lang) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (lang) node.lang = lang;
    return node;
  }

  function applyBookTheme(node, theme, accentProperty = '--book-accent', softProperty = '--book-soft') {
    for (const [key, property] of [['accent', accentProperty], ['soft', softProperty]]) {
      if (theme?.[key]) node.style.setProperty(property, theme[key]);
      else node.style.removeProperty(property);
    }
  }

  // A series with only its two historical languages already has hand-written, naturally
  // phrased radio options in its own index.html (Taiwan's markup, unchanged by this engine).
  // A series configured with more languages leaves #modeOptions empty in its index.html, and
  // this fills it in from the series' own language set: this code path never runs for a series
  // whose markup already provides the inputs, so it cannot affect Taiwan's rendered page.
  let modeInputs = [...document.querySelectorAll('input[name="listenMode"]')];
  if (modeInputs.length === 0 && modeOptionsContainer) {
    for (const [value, order] of Object.entries(LISTEN_MODES)) {
      const label = element('label', 'mode-option');
      const input = element('input');
      input.type = 'radio';
      input.name = 'listenMode';
      input.value = value;
      const span = element('span');
      span.textContent = E.modeLabel(order, SERIES.languageNames);
      label.append(input, span);
      modeOptionsContainer.append(label);
    }
    modeInputs = [...document.querySelectorAll('input[name="listenMode"]')];
  }

  // Likewise, the "show only the narrated language" toggle only exists for a series that opts
  // in (SERIES.narratedOnlyToggle); Taiwan's config leaves it off, so this element is never
  // created there and every branch below that reads it is unreachable for Taiwan.
  let narratedOnlyToggle = document.querySelector('#narratedOnlyToggle');
  if (!narratedOnlyToggle && SERIES.narratedOnlyToggle) {
    const settingToggles = document.querySelector('.setting-toggles');
    if (settingToggles) {
      const label = element('label', 'toggle');
      const input = element('input');
      input.type = 'checkbox';
      input.id = 'narratedOnlyToggle';
      const track = element('span', 'toggle-track');
      track.setAttribute('aria-hidden', 'true');
      const span = element('span');
      span.textContent = SERIES.narratedOnlyLabel
        || 'きいている ことばだけ ひょうじ ・ 只顯示正在聽的語言';
      label.append(input, track, span);
      settingToggles.append(label);
      narratedOnlyToggle = input;
    }
  }

  const settings = loadSettings();
  let book = null;
  let listening = false; // a read-along is on: page turns keep reading
  let muted = false;
  let queueKind = null; // 'page' or 'line'
  let continuousToken = 0; // bumped on every playContinuous() call so a stale build is ignored
  let turnTimer = null;
  let swipeStart = null;
  let swipedAt = 0;
  let lastCard = null;
  let completedThisOpening = false;

  function track(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, { ...params, series_id: SERIES.id });
  }

  // Every book gets its own path under the shelf, e.g. /taiwan-ehon/hu-gu-po/. Page numbers,
  // sentences, and settings never appear here — only the book selection does.
  function shelfPath() {
    const path = location.pathname;
    const at = path.indexOf(SHELF_MARKER);
    if (at === -1) return path.endsWith('/') ? path : `${path}/`;
    return path.slice(0, at + SHELF_MARKER.length);
  }

  function bookPath(id) {
    return `${shelfPath()}${id}/`;
  }

  function bookIdFromPath() {
    const base = shelfPath();
    const path = location.pathname;
    if (!path.startsWith(base)) return null;
    const rest = path.slice(base.length).replace(/^\/+|\/+$/g, '');
    return rest ? rest.split('/')[0] : null;
  }

  // page_view is a standard GA4 event, not one of the five storybook events series_id was
  // added to; page_location already differentiates series by URL, so it calls gtag directly
  // rather than through track(), leaving its payload exactly as it was before this engine
  // existed.
  function sendPageView(pagePath, title) {
    if (typeof gtag === 'function') gtag('event', 'page_view', { page_location: `${location.origin}${pagePath}`, page_title: title });
  }

  // Captured once, before any pushState runs: history.pushState() moves location.pathname,
  // and unprefixed relative image/audio URLs would silently start resolving against that
  // deeper path instead of this app's real folder. Every asset URL is built from this instead.
  const ASSET_BASE = shelfPath();

  let audio = null;
  try {
    if (typeof Audio !== 'undefined') {
      audio = new Audio();
      audio.preload = 'auto';
    }
  } catch (_error) {
    audio = null;
  }

  // A hidden/backgrounded tab can have its timers suspended (most aggressively on mobile
  // once the screen locks), so every gap — between languages, sentences, and pages — skips
  // the wait and chains straight from the `ended`/`onDone` event instead of via setTimeout.
  function isHidden() {
    return document.visibilityState === 'hidden';
  }

  function backgroundAwareWait(ms, fn) {
    if (isHidden()) { fn(); return undefined; }
    return setTimeout(fn, ms);
  }

  const narrator = E.createNarrator(audio, {
    onStep: step => {
      highlight(step);
      updatePlayback();
    },
    onDone: pageFinished,
    onUnavailable: () => {
      listening = false;
      speechStatus.textContent = UNAVAILABLE;
      updatePlayback();
    },
  }, backgroundAwareWait, ASSET_BASE);

  // Screen-off listening (settings.continuous): one continuous Blob for the whole book instead
  // of narrator's clip-by-clip chaining, so Android Chrome keeps a single already-playing
  // <audio> element going with the screen off. Shares the same `audio` element as narrator —
  // exactly one of the two ever owns it at a time (see readPage/readLine/goTo below).
  const continuousPlayer = C.createContinuousPlayer(audio, {
    onTimeUpdate: timeMs => {
      if (isHidden()) return; // resynced in one step by the visibilitychange handler below
      syncFromContinuousTime(timeMs);
    },
    onEnded: () => {
      listening = false;
      updatePlayback();
    },
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || continuousPlayer.state === 'idle') return;
    syncFromContinuousTime(Math.round(audio.currentTime * 1000));
  });

  // Moves the visible page (and highlighted line) to match wherever continuous playback has
  // gotten to. Only actually re-renders when the page changed, so this is cheap to call on
  // every `timeupdate` tick.
  function syncFromContinuousTime(timeMs) {
    const timeline = continuousPlayer.timeline;
    if (!timeline || !book) return;
    const pageIndex = C.mapTimeToPage(timeline.pages, timeMs);
    if (pageIndex !== book.index) {
      book.goTo(pageIndex);
      renderPage(null);
      if (book.page().id === 'end' && !completedThisOpening) {
        completedThisOpening = true;
        if (STORIES.includes(book.story)) track('book_complete', { book_id: book.story.id });
      }
    }
    highlight(C.mapTimeToLine(timeline.lines, timeMs));
  }

  // Gathers the current book's clips for the chosen listening mode, in reading order, joins
  // them (with the pre-generated silence clips standing in for narrator's between-clip pauses)
  // into one in-memory Blob, and plays it from the current page onward. No second copy of any
  // clip is stored anywhere — the Blob is built fresh from the same clip URLs the offline
  // download and sentence-by-sentence modes already use, and is discarded once played.
  function cancelContinuousBuild() {
    continuousToken++;
  }

  async function playContinuous({ paused = false } = {}) {
    const token = ++continuousToken;
    const requestedBook = book;
    clearTimeout(turnTimer);
    narrator.stop();
    continuousPlayer.loading();
    listening = !paused;
    queueKind = 'page';
    speechStatus.textContent = PREPARING_CONTINUOUS;
    updatePlayback();

    const timeline = C.buildContinuousTimeline(E, requestedBook.story, LISTEN_MODES, DEFAULT_MODE, settings.mode, TIMING);
    let blob = null;
    try {
      blob = await C.assembleContinuousBlob(timeline, C.createByteLoader(fetch, ASSET_BASE, requestedBook.story.id));
    } catch (_error) {
      blob = null;
    }
    if (token !== continuousToken || book !== requestedBook) return; // superseded by a later call, or the book changed while building

    if (!blob) {
      continuousPlayer.stop();
      listening = false;
      speechStatus.textContent = UNAVAILABLE;
      updatePlayback();
      return;
    }
    speechStatus.textContent = '';
    const startAtMs = timeline.pages[book.index]?.startMs ?? 0;
    const started = await continuousPlayer.play(blob, timeline, { startAtMs, paused });
    if (token !== continuousToken) return;
    if (!started) speechStatus.textContent = TAP_TO_START;
    updatePlayback();
  }

  function loadSettings() {
    const defaults = { mode: DEFAULT_MODE, zhuyin: true, autoTurn: false, narratedOnly: false, continuous: false };
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      return {
        mode: E.isMode(LISTEN_MODES, saved.mode) ? saved.mode : defaults.mode,
        zhuyin: typeof saved.zhuyin === 'boolean' ? saved.zhuyin : defaults.zhuyin,
        autoTurn: typeof saved.autoTurn === 'boolean' ? saved.autoTurn : defaults.autoTurn,
        narratedOnly: typeof saved.narratedOnly === 'boolean' ? saved.narratedOnly : defaults.narratedOnly,
        continuous: typeof saved.continuous === 'boolean' ? saved.continuous : defaults.continuous,
      };
    } catch (_error) {
      return defaults;
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_error) {
      // Private browsing or blocked storage: settings last for this visit only.
    }
  }

  function rubyNodes(segments) {
    const fragment = document.createDocumentFragment();
    for (const segment of segments) {
      if (!segment.ruby) {
        fragment.append(segment.text);
        continue;
      }
      const ruby = document.createElement('ruby');
      const rt = document.createElement('rt');
      ruby.append(segment.text);
      rt.textContent = segment.ruby;
      ruby.append(rt);
      fragment.append(ruby);
    }
    return fragment;
  }

  function japanese(text) {
    return rubyNodes(E.parseRuby(text));
  }

  function chinese(text, zhuyin) {
    return rubyNodes(E.zhuyinSegments(text, zhuyin));
  }

  // The three languages this engine understands how to typeset: Japanese with furigana,
  // Taiwan Mandarin with 注音, and plain English text. A series picks any subset via
  // series.config.js's `languages`; only those show up anywhere in the shelf or reader.
  function langAttr(lang) {
    if (lang === 'zh') return 'zh-Hant-TW';
    if (lang === 'en') return 'en';
    return 'ja';
  }

  function langNodes(lang, text, zhuyin) {
    if (lang === 'ja') return japanese(text);
    if (lang === 'zh' && zhuyin) return chinese(text, zhuyin);
    return document.createTextNode(text || '');
  }

  function langPlainText(lang, text) {
    return lang === 'ja' ? E.plainJapanese(text) : (text || '');
  }

  function displayLanguages() {
    const order = E.languagesFor(LISTEN_MODES, DEFAULT_MODE, settings.mode);
    return E.displayLanguagesFor(SERIES.languages, order, SERIES.narratedOnlyToggle && settings.narratedOnly);
  }

  function metadataLanguages(record) {
    return E.metadataLanguages(SERIES.languages, displayLanguages(), record);
  }

  function metadataLanguagesFor(...records) {
    const available = Object.fromEntries(SERIES.languages.map(lang => [
      lang,
      records.some(record => record[lang] !== undefined && record[lang] !== null),
    ]));
    return E.metadataLanguages(SERIES.languages, displayLanguages(), available);
  }

  function metadataLanguage(record, requested) {
    if (record[requested] !== undefined && record[requested] !== null) return requested;
    return SERIES.languages.find(lang => record[lang] !== undefined && record[lang] !== null);
  }

  function appendMetadataLanguage(target, record, requested) {
    const lang = metadataLanguage(record, requested);
    if (!lang) return;
    const node = element('span', '', langAttr(lang));
    node.append(langNodes(lang, record[lang], record.zhuyin));
    target.append(node);
  }

  function appendMetadata(target, record, { separator = '', classFor = () => '', plainJa = false, withZhuyin = true } = {}) {
    const languages = metadataLanguages(record);
    languages.forEach((lang, index) => {
      if (index && separator) target.append(typeof separator === 'function' ? separator() : separator);
      const node = element('span', classFor(lang, index), langAttr(lang));
      const value = lang === 'ja' && plainJa ? document.createTextNode(E.plainJapanese(record[lang]))
        : langNodes(lang, record[lang], withZhuyin ? record.zhuyin : undefined);
      node.append(value);
      target.append(node);
    });
    return languages;
  }

  function metadataText(record, separator, reverse = false) {
    const languages = metadataLanguages(record);
    if (reverse) languages.reverse();
    return languages.map(lang => langPlainText(lang, record[lang])).join(separator);
  }

  function renderBookInfo(story) {
    const info = element('span', 'book-info');
    const origin = element('span', 'book-origin');
    const tagline = element('span', 'book-tagline');
    let titles;
    if (!selectableMetadata) {
      origin.append(japanese(story.origin.ja), ' · ');
      const originZh = element('span', '', 'zh-Hant-TW');
      originZh.textContent = story.origin.zh;
      origin.append(originZh);
      const titleJa = element('span', 'book-title-ja', 'ja');
      titleJa.append(japanese(story.title.ja));
      const titleZh = element('span', 'book-title-zh', 'zh-Hant-TW');
      titleZh.append(chinese(story.title.zh, story.title.zhuyin));
      titles = [titleJa, titleZh];
      const taglineZh = element('span', '', 'zh-Hant-TW');
      taglineZh.textContent = story.tagline.zh;
      tagline.append(japanese(story.tagline.ja), document.createElement('br'), taglineZh);
    } else {
      appendMetadata(origin, story.origin, { separator: ' · ' });
      const title = element('span', 'book-title');
      appendMetadata(title, story.title, { classFor: lang => `book-title-${lang}` });
      titles = [title];
      appendMetadata(tagline, story.tagline, { separator: () => document.createElement('br') });
    }
    const open = element('span', 'book-open');
    open.textContent = `よむ ・ 開始閱讀（${story.pages.length}ページ）`;
    info.append(origin, ...titles, tagline, open);
    return info;
  }

  function renderShelf() {
    for (const story of STORIES) {
      const item = document.createElement('li');
      const card = element('button', 'book-card');
      card.type = 'button';
      card.dataset.story = story.id;
      applyBookTheme(card, story.theme);

      const cover = element('img', 'book-cover');
      cover.src = `${ASSET_BASE}${story.pages[0].image}`;
      cover.alt = '';
      cover.loading = 'lazy';
      cover.decoding = 'async';
      cover.width = 768;
      cover.height = 512;

      card.append(cover, renderBookInfo(story));
      card.addEventListener('click', () => {
        lastCard = card;
        openBook(story, 0);
      });
      item.append(card);
      bookList.append(item);
    }
    // A series with no published books yet (e.g. a new series' shell) can show a static
    // "coming soon" notice in its own index.html with id="comingSoon"; hidden automatically
    // once that series' stories.js has at least one book. Taiwan's index.html has no such
    // element, so this is always a no-op there.
    const comingSoon = document.querySelector('#comingSoon');
    if (comingSoon) comingSoon.hidden = STORIES.length > 0;
  }

  function refreshShelfMetadata() {
    for (const story of STORIES) {
      const card = [...bookList.querySelectorAll('.book-card')].find(item => item.dataset.story === story.id);
      const info = card?.querySelector('.book-info');
      if (!info) continue;
      const replacement = renderBookInfo(story);
      info.replaceChildren(...replacement.children);
    }
  }

  function bookTitle(story) {
    return `${metadataText(story.title, '｜', true)}${SERIES.siteNameSuffix}`;
  }

  function updateBookMetadata(story) {
    readerTitle.replaceChildren();
    if (!selectableMetadata) {
      readerTitle.append(E.plainJapanese(story.title.ja));
      const zh = element('span', 'zh', 'zh-Hant-TW');
      zh.textContent = story.title.zh;
      readerTitle.append(zh);
    } else {
      appendMetadata(readerTitle, story.title, {
        classFor: (lang, index) => `${lang === 'zh' ? 'zh ' : ''}${index ? 'metadata-secondary' : ''}`.trim(),
        plainJa: true,
        withZhuyin: false,
      });
    }
    document.title = bookTitle(story);
    updateMediaMetadata(story);
  }

  function notifyMetadataChange() {
    document.dispatchEvent(new Event('ehon:metadatachange'));
  }

  function openBook(story, index, { push = true, send = true } = {}) {
    continuousToken++;
    book = E.createBook(story, index);
    completedThisOpening = false;
    listening = false;
    narrator.stop();
    continuousPlayer.stop();
    applyBookTheme(reader, story.theme, '--accent', '--accent-soft');
    updateBookMetadata(story);
    reader.dataset.book = story.id;
    shelf.hidden = true;
    reader.hidden = false;
    speechStatus.textContent = HINT;
    renderPage(null);
    const path = bookPath(story.id);
    if (push && location.pathname !== path) history.pushState({ book: story.id }, '', path);
    if (send) sendPageView(path, document.title);
    if (STORIES.includes(story)) track('book_open', { book_id: story.id });
    closeButton.focus({ preventScroll: true });
  }

  function closeBook({ push = true, send = true } = {}) {
    continuousToken++;
    clearTimeout(turnTimer);
    narrator.stop();
    continuousPlayer.stop();
    listening = false;
    book = null;
    clearMediaSession();
    setSettingsOpen(false);
    reader.hidden = true;
    shelf.hidden = false;
    delete reader.dataset.book;
    document.title = SHELF_DOCUMENT_TITLE;
    const path = shelfPath();
    if (push && location.pathname !== path) history.pushState(null, '', path);
    if (send) sendPageView(path, SHELF_PAGE_TITLE);
    const focusTarget = lastCard || bookList.querySelector('.book-card');
    focusTarget?.focus({ preventScroll: true });
  }

  // Reflects the current URL into the shelf/reader UI: on first load (no push, no extra page
  // view — the static <head> tag already sent that one), and again on every browser
  // back/forward (popstate), when nothing else would otherwise update the view.
  function route({ push = false, send = true } = {}) {
    const id = bookIdFromPath();
    const story = id ? STORIES.find(candidate => candidate.id === id) : null;
    if (story) {
      openBook(story, 0, { push, send });
      return;
    }
    if (id) history.replaceState(null, '', shelfPath());
    if (book) closeBook({ push, send });
    else if (send) sendPageView(shelfPath(), SHELF_PAGE_TITLE);
  }

  function pageKind(page) {
    if (page.id === 'cover') return 'cover';
    if (page.id === 'end') return 'end';
    return 'story';
  }

  function renderText() {
    const page = book.page();
    const order = E.languagesFor(LISTEN_MODES, DEFAULT_MODE, settings.mode);
    const shown = displayLanguages();
    pageText.dataset.mode = settings.mode;
    pageText.dataset.first = order[0];
    pageText.replaceChildren();
    for (const line of page.lines) {
      const sentence = element('div', 'sentence');
      for (const lang of SERIES.languages) {
        if (!shown.includes(lang)) continue;
        const text = line[lang];
        if (text === undefined) continue;
        const btn = element('button', `line line-${lang}`, langAttr(lang));
        btn.type = 'button';
        btn.dataset.line = line.id;
        btn.dataset.lang = lang;
        btn.setAttribute('aria-label', langPlainText(lang, text));
        btn.append(langNodes(lang, text, line.zhuyin));
        sentence.append(btn);
      }
      pageText.append(sentence);
    }
    highlight(narrator.current);
  }

  function renderExtras(kind) {
    for (const node of pageEl.querySelectorAll('.page-note, .end-actions')) node.remove();
    const story = book.story;
    if (kind === 'story') return;
    const note = element('div', 'page-note');
    if (!selectableMetadata) {
      const ja = element('p', '', 'ja');
      const zh = element('p', '', 'zh-Hant-TW');
      if (kind === 'cover') {
        ja.append(japanese(story.origin.ja), ' ・ ', japanese(story.tagline.ja));
        zh.textContent = `${story.origin.zh} · ${story.tagline.zh}`;
      } else {
        ja.append(japanese(story.credit.ja));
        zh.textContent = story.credit.zh;
      }
      note.append(ja, zh);
    } else {
      const selected = kind === 'cover'
        ? metadataLanguagesFor(story.origin, story.tagline)
        : metadataLanguages(story.credit);
      for (const lang of selected) {
        const line = element('p', '', langAttr(lang));
        if (kind === 'cover') {
          appendMetadataLanguage(line, story.origin, lang);
          line.append(' ・ ');
          appendMetadataLanguage(line, story.tagline, lang);
        } else {
          appendMetadataLanguage(line, story.credit, lang);
        }
        note.append(line);
      }
    }
    pageEl.append(note);
    if (kind !== 'end') return;

    const actions = element('div', 'end-actions');
    const again = element('button', 'end-button primary');
    again.type = 'button';
    again.id = 'readAgainButton';
    again.innerHTML = 'もういちど よむ ・ <span lang="zh-Hant-TW">再讀一次</span>';
    again.addEventListener('click', () => goTo(0, 'prev'));
    const other = element('button', 'end-button');
    other.type = 'button';
    other.id = 'otherBooksButton';
    other.innerHTML = 'ほかの えほん ・ <span lang="zh-Hant-TW">看別的故事</span>';
    other.addEventListener('click', closeBook);
    actions.append(again, other);
    pageEl.append(actions);
  }

  function renderPage(direction) {
    const page = book.page();
    const kind = pageKind(page);
    pageEl.dataset.kind = kind;
    pageArt.classList.remove('offline-missing');
    pageImage.src = `${ASSET_BASE}${page.image}`;
    pageImage.alt = metadataText(page.alt, ' ／ ');
    renderText();
    renderExtras(kind);
    pageCounter.textContent = `${book.index + 1} / ${book.total}`;
    prevButton.disabled = book.isFirst();
    nextButton.disabled = book.isLast();
    pageEl.scrollTop = 0;
    pageEl.classList.remove('turn-next', 'turn-prev');
    if (direction) {
      void pageEl.offsetWidth; // restart the page-turn animation
      pageEl.classList.add(`turn-${direction}`);
    }
    updatePlayback();
  }

  function highlight(step) {
    for (const node of pageText.querySelectorAll('.line.is-playing')) node.classList.remove('is-playing');
    if (!step) return;
    const node = pageText.querySelector(`.line[data-line="${step.lineId}"][data-lang="${step.lang}"]`);
    if (!node) return;
    node.classList.add('is-playing');
    node.scrollIntoView?.({ block: 'nearest' });
  }

  function activeAudioPlayer() {
    return continuousPlayer.state !== 'idle' ? continuousPlayer : narrator;
  }

  function updatePlayback() {
    const activeState = activeAudioPlayer().state;
    const playing = activeState === 'playing';
    playIcon.textContent = playing ? '⏸' : '▶';
    playButton.setAttribute('aria-label', playing ? 'とめる 暫停' : 'よむ 唸給我聽');
    muteIcon.textContent = muted ? '🔇' : '🔊';
    muteButton.setAttribute('aria-pressed', String(muted));
    muteButton.setAttribute('aria-label', muted ? 'おとを だす 開啟聲音' : 'おとを けす 靜音');
    if (typeof navigator !== 'undefined' && navigator.mediaSession) {
      navigator.mediaSession.playbackState = playing ? 'playing' : activeState === 'paused' ? 'paused' : 'none';
    }
  }

  // Lock-screen/notification metadata and media controls: title and cover art per book,
  // plus play, pause, and page-turn controls wired to the same functions as the on-page buttons.
  function updateMediaMetadata(story) {
    if (typeof navigator === 'undefined' || !navigator.mediaSession || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: metadataText(story.title, '｜', true),
      artist: SHELF_DOCUMENT_TITLE,
      artwork: [{ src: `${ASSET_BASE}${story.pages[0].image}`, sizes: '768x512', type: 'image/webp' }],
    });
  }

  function clearMediaSession() {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = 'none';
  }

  function setupMediaSessionHandlers() {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    const actionHandlers = {
      play: () => {
        const player = activeAudioPlayer();
        if (player.state === 'paused' && !muted) {
          listening = player === continuousPlayer || queueKind === 'page';
          if (player === continuousPlayer) speechStatus.textContent = '';
          player.resume();
        } else if (player.state === 'idle') {
          readPage();
        }
        updatePlayback();
      },
      pause: () => {
        activeAudioPlayer().pause();
        listening = false;
        clearTimeout(turnTimer);
        updatePlayback();
      },
      previoustrack: () => turn('prev'),
      nexttrack: () => turn('next'),
    };
    for (const [action, handler] of Object.entries(actionHandlers)) {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch (_error) { /* action unsupported */ }
    }
  }

  // Warms the browser/service-worker cache for clips about to be needed — the rest of the
  // current page and the next page's first line — so a background auto-turn never stalls on
  // a network fetch. A book already downloaded for offline reading serves these from the
  // service worker's media cache; this only helps the first, online listen.
  function warmClip(url) {
    if (typeof fetch !== 'function') return;
    try { fetch(url).catch(() => {}); } catch (_error) { /* not fetchable in this environment */ }
  }

  function warmUpcoming(queue) {
    for (const step of queue) warmClip(E.clipPath(book.story.id, step.lang, step.lineId, ASSET_BASE));
    if (book.isLast()) return;
    const nextPage = book.story.pages[book.index + 1];
    const firstLine = nextPage.lines[0];
    if (!firstLine) return;
    const firstLang = E.languagesFor(LISTEN_MODES, DEFAULT_MODE, settings.mode)[0];
    if (firstLine[firstLang] !== undefined) {
      warmClip(E.clipPath(book.story.id, firstLang, firstLine.id, ASSET_BASE));
    }
  }

  function readPage({ paused = false } = {}) {
    if (!book || muted) return;
    clearTimeout(turnTimer);
    if (settings.continuous) {
      playContinuous({ paused });
      return;
    }
    cancelContinuousBuild();
    continuousPlayer.stop();
    listening = !paused;
    queueKind = 'page';
    speechStatus.textContent = '';
    const queue = E.pageQueue(book.page(), LISTEN_MODES, DEFAULT_MODE, settings.mode);
    narrator.play(book.story.id, queue, { paused });
    warmUpcoming(queue);
    updatePlayback();
  }

  function readLine(lineId, lang) {
    if (!book || muted) return;
    clearTimeout(turnTimer);
    cancelContinuousBuild();
    continuousPlayer.stop(); // a one-off sentence tap always uses the narrator, continuous or not
    listening = false;
    queueKind = 'line';
    speechStatus.textContent = '';
    narrator.play(book.story.id, [{ lineId, lang }]);
    updatePlayback();
  }

  // Schedules a gap the way a visible reader expects to see it (a real, cancellable pause),
  // but skips straight to `fn` while the tab is hidden, since a backgrounded/locked-screen
  // timer is not reliable — see `backgroundAwareWait` above for the matching in-page gaps.
  function scheduleGap(delay, fn) {
    if (isHidden()) { fn(); return; }
    turnTimer = setTimeout(fn, delay);
  }

  function pageFinished() {
    updatePlayback();
    if (queueKind !== 'page' || !book) return;
    if (book.isLast()) {
      listening = false;
      return;
    }
    if (settings.autoTurn && listening && !muted) {
      scheduleGap(AUTO_TURN_DELAY, () => turn('next'));
    }
  }

  function goTo(index, direction) {
    clearTimeout(turnTimer);
    if (!book.goTo(index)) return;
    // While continuous playback is live, its Blob already covers the whole book: turning the
    // page seeks within it instead of stopping/restarting anything (narrator.stop() would pause
    // and rewind the very same shared <audio> element continuous playback is using).
    const continuousLive = settings.continuous && continuousPlayer.state !== 'idle';
    if (continuousLive) continuousPlayer.seekToPage(index);
    else narrator.stop();
    renderPage(direction);
    if (book.page().id === 'end' && !completedThisOpening) {
      completedThisOpening = true;
      if (STORIES.includes(book.story)) track('book_complete', { book_id: book.story.id });
    }
    if (!settings.continuous && listening && !muted) scheduleGap(TURN_SETTLE, readPage);
  }

  function turn(direction) {
    if (!book) return;
    goTo(book.index + (direction === 'next' ? 1 : -1), direction);
  }

  function setSettingsOpen(open) {
    settingsPanel.hidden = !open;
    settingsButton.setAttribute('aria-expanded', String(open));
  }

  function applySettings() {
    for (const input of modeInputs) input.checked = input.value === settings.mode;
    zhuyinToggle.checked = settings.zhuyin;
    autoTurnToggle.checked = settings.autoTurn;
    continuousToggle.checked = settings.continuous;
    reader.classList.toggle('hide-zhuyin', !settings.zhuyin);
    if (narratedOnlyToggle) narratedOnlyToggle.checked = settings.narratedOnly;
  }

  // A picture not yet downloaded for offline reading fails to load rather than showing a
  // browser broken-image icon; a plain, friendly notice takes its place until it's back online.
  pageImage.addEventListener('error', () => pageArt.classList.add('offline-missing'));
  pageImage.addEventListener('load', () => pageArt.classList.remove('offline-missing'));

  pageText.addEventListener('click', event => {
    const line = event.target.closest('.line');
    if (!line || Date.now() - swipedAt < 400) return;
    readLine(line.dataset.line, line.dataset.lang);
  });

  playButton.addEventListener('click', () => {
    const player = activeAudioPlayer();
    if (player === continuousPlayer && player.state === 'loading') return;
    if (player.state === 'playing') {
      player.pause();
      listening = false;
      clearTimeout(turnTimer);
      updatePlayback();
      return;
    }
    if (player.state === 'paused' && !muted) {
      listening = player === continuousPlayer || queueKind === 'page';
      if (player === continuousPlayer) speechStatus.textContent = '';
      player.resume();
      updatePlayback();
      return;
    }
    readPage();
    updatePlayback();
  });

  replayButton.addEventListener('click', readPage);

  muteButton.addEventListener('click', () => {
    muted = !muted;
    if (muted) {
      clearTimeout(turnTimer);
      // narrator.stop() would pause/rewind the shared <audio> element even when narrator
      // itself is idle, which would rewind a live continuous Blob back to its start — see the
      // same guard in goTo() above.
      if (activeAudioPlayer() === continuousPlayer && continuousPlayer.state === 'loading') {
        cancelContinuousBuild();
        continuousPlayer.stop();
      } else if (activeAudioPlayer() === continuousPlayer) continuousPlayer.pause();
      else narrator.stop();
      listening = false;
    }
    updatePlayback();
  });

  prevButton.addEventListener('click', () => turn('prev'));
  nextButton.addEventListener('click', () => turn('next'));
  closeButton.addEventListener('click', closeBook);

  settingsButton.addEventListener('click', () => setSettingsOpen(settingsPanel.hidden));
  document.addEventListener('click', event => {
    if (settingsPanel.hidden || settingsPanel.contains(event.target) || settingsButton.contains(event.target)) return;
    setSettingsOpen(false);
  });

  for (const input of modeInputs) {
    input.addEventListener('change', () => {
      if (!input.checked || !E.isMode(LISTEN_MODES, input.value) || input.value === settings.mode) return;
      const playbackState = activeAudioPlayer().state;
      const pageQueueActive = queueKind === 'page' && playbackState !== 'idle';
      settings.mode = input.value;
      saveSettings();
      track('listen_mode_change', { listen_mode: settings.mode });
      refreshShelfMetadata();
      if (book) {
        updateBookMetadata(book.story);
        renderPage(null);
      }
      notifyMetadataChange();
      if (pageQueueActive) readPage({ paused: playbackState === 'paused' });
    });
  }

  zhuyinToggle.addEventListener('change', () => {
    if (settings.zhuyin === zhuyinToggle.checked) return;
    settings.zhuyin = zhuyinToggle.checked;
    saveSettings();
    track('zhuyin_toggle', { zhuyin: settings.zhuyin ? 'on' : 'off' });
    applySettings();
  });

  autoTurnToggle.addEventListener('change', () => {
    if (settings.autoTurn === autoTurnToggle.checked) return;
    settings.autoTurn = autoTurnToggle.checked;
    saveSettings();
    track('auto_turn_toggle', { auto_turn: settings.autoTurn ? 'on' : 'off' });
    if (!settings.autoTurn) clearTimeout(turnTimer);
  });

  continuousToggle.addEventListener('change', () => {
    if (settings.continuous === continuousToggle.checked) return;
    const previousState = activeAudioPlayer().state;
    settings.continuous = continuousToggle.checked;
    saveSettings();
    track('continuous_toggle', { continuous: settings.continuous ? 'on' : 'off' });
    if (book && previousState !== 'idle') readPage({ paused: previousState === 'paused' });
  });

  if (narratedOnlyToggle) {
    narratedOnlyToggle.addEventListener('change', () => {
      if (settings.narratedOnly === narratedOnlyToggle.checked) return;
      settings.narratedOnly = narratedOnlyToggle.checked;
      saveSettings();
      refreshShelfMetadata();
      if (book) {
        updateBookMetadata(book.story);
        renderPage(null);
      }
      notifyMetadataChange();
    });
  }

  document.addEventListener('keydown', event => {
    if (reader.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape' && !settingsPanel.hidden) {
      setSettingsOpen(false);
      settingsButton.focus();
      return;
    }
    if (event.target.closest?.('input')) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      turn('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      turn('prev');
    }
  });

  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary) return;
    swipeStart = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener('pointerup', event => {
    if (!swipeStart || !event.isPrimary) return;
    const direction = E.swipeDirection(event.clientX - swipeStart.x, event.clientY - swipeStart.y);
    swipeStart = null;
    if (!direction) return;
    swipedAt = Date.now();
    turn(direction);
  });

  stage.addEventListener('pointercancel', () => { swipeStart = null; });

  renderShelf();
  applySettings();
  updatePlayback();
  setupMediaSessionHandlers();
  route({ push: false, send: false });
  addEventListener('popstate', () => route({ push: false, send: true }));
})();
