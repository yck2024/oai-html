(() => {
  'use strict';

  const E = window.TaiwanEhon;
  const STORIES = window.TaiwanEhonStories;
  const SETTINGS_KEY = 'taiwan-ehon-settings';
  const AUTO_TURN_DELAY = 1500;
  const TURN_SETTLE = 450;
  const HINT = '▶ を おすと よむよ。 ぶんを タップしても きけるよ。 · 按 ▶ 唸給你聽，也可以點句子喔。';
  const UNAVAILABLE = 'こえが でません。 ぶんは よめるよ。 · 目前無法播放聲音，還是可以看故事喔。';
  const SHELF_MARKER = '/taiwan-ehon/';
  const SHELF_PAGE_TITLE = 'Taiwan story picture books';
  const SHELF_DOCUMENT_TITLE = '台灣故事繪本｜たいわんの おはなし えほん';

  const shelf = document.querySelector('#shelf');
  const bookList = document.querySelector('#bookList');
  const reader = document.querySelector('#reader');
  const readerTitle = document.querySelector('#readerTitle');
  const closeButton = document.querySelector('#closeBook');
  const settingsButton = document.querySelector('#settingsButton');
  const settingsPanel = document.querySelector('#settingsPanel');
  const modeInputs = [...document.querySelectorAll('input[name="listenMode"]')];
  const zhuyinToggle = document.querySelector('#zhuyinToggle');
  const autoTurnToggle = document.querySelector('#autoTurnToggle');
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

  const settings = loadSettings();
  let book = null;
  let listening = false; // a read-along is on: page turns keep reading
  let muted = false;
  let queueKind = null; // 'page' or 'line'
  let turnTimer = null;
  let swipeStart = null;
  let swipedAt = 0;
  let lastCard = null;
  let completedThisOpening = false;

  function track(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, params);
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

  function sendPageView(pagePath, title) {
    track('page_view', { page_location: `${location.origin}${pagePath}`, page_title: title });
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

  function loadSettings() {
    const defaults = { mode: E.DEFAULT_MODE, zhuyin: true, autoTurn: false };
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      return {
        mode: E.isMode(saved.mode) ? saved.mode : defaults.mode,
        zhuyin: typeof saved.zhuyin === 'boolean' ? saved.zhuyin : defaults.zhuyin,
        autoTurn: typeof saved.autoTurn === 'boolean' ? saved.autoTurn : defaults.autoTurn,
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

  function element(tag, className, lang) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (lang) node.lang = lang;
    return node;
  }

  function renderShelf() {
    for (const story of STORIES) {
      const item = document.createElement('li');
      const card = element('button', 'book-card');
      card.type = 'button';
      card.dataset.story = story.id;
      card.style.setProperty('--book-accent', story.theme.accent);
      card.style.setProperty('--book-soft', story.theme.soft);

      const cover = element('img', 'book-cover');
      cover.src = `${ASSET_BASE}${story.pages[0].image}`;
      cover.alt = '';
      cover.loading = 'lazy';
      cover.decoding = 'async';
      cover.width = 768;
      cover.height = 512;

      const info = element('span', 'book-info');
      const origin = element('span', 'book-origin');
      origin.append(japanese(story.origin.ja), ' · ');
      const originZh = element('span', '', 'zh-Hant-TW');
      originZh.textContent = story.origin.zh;
      origin.append(originZh);
      const titleJa = element('span', 'book-title-ja', 'ja');
      titleJa.append(japanese(story.title.ja));
      const titleZh = element('span', 'book-title-zh', 'zh-Hant-TW');
      titleZh.append(chinese(story.title.zh, story.title.zhuyin));
      const tagline = element('span', 'book-tagline');
      const taglineZh = element('span', '', 'zh-Hant-TW');
      taglineZh.textContent = story.tagline.zh;
      tagline.append(japanese(story.tagline.ja), document.createElement('br'), taglineZh);
      const open = element('span', 'book-open');
      open.textContent = `よむ ・ 開始閱讀（${story.pages.length}ページ）`;
      info.append(origin, titleJa, titleZh, tagline, open);
      card.append(cover, info);
      card.addEventListener('click', () => {
        lastCard = card;
        openBook(story, 0);
      });
      item.append(card);
      bookList.append(item);
    }
  }

  function openBook(story, index, { push = true, send = true } = {}) {
    book = E.createBook(story, index);
    completedThisOpening = false;
    listening = false;
    narrator.stop();
    reader.style.setProperty('--accent', story.theme.accent);
    reader.style.setProperty('--accent-soft', story.theme.soft);
    readerTitle.replaceChildren(E.plainJapanese(story.title.ja));
    const zh = element('span', 'zh', 'zh-Hant-TW');
    zh.textContent = story.title.zh;
    readerTitle.append(zh);
    document.title = `${story.title.zh}｜${E.plainJapanese(story.title.ja)} · 台灣故事繪本`;
    updateMediaMetadata(story);
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
    clearTimeout(turnTimer);
    narrator.stop();
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
    const order = E.languagesFor(settings.mode);
    pageText.dataset.mode = settings.mode;
    pageText.dataset.first = order[0];
    pageText.replaceChildren();
    for (const line of page.lines) {
      const sentence = element('div', 'sentence');
      const ja = element('button', 'line line-ja', 'ja');
      ja.type = 'button';
      ja.dataset.line = line.id;
      ja.dataset.lang = 'ja';
      ja.setAttribute('aria-label', E.plainJapanese(line.ja));
      ja.append(japanese(line.ja));
      const zh = element('button', 'line line-zh', 'zh-Hant-TW');
      zh.type = 'button';
      zh.dataset.line = line.id;
      zh.dataset.lang = 'zh';
      zh.setAttribute('aria-label', line.zh);
      zh.append(chinese(line.zh, line.zhuyin));
      sentence.append(ja, zh);
      pageText.append(sentence);
    }
    highlight(narrator.current);
  }

  function renderExtras(kind) {
    for (const node of pageEl.querySelectorAll('.page-note, .end-actions')) node.remove();
    const story = book.story;
    if (kind === 'story') return;
    const note = element('div', 'page-note');
    const noteJa = element('p', '', 'ja');
    const noteZh = element('p', '', 'zh-Hant-TW');
    if (kind === 'cover') {
      noteJa.append(japanese(story.origin.ja), ' ・ ', japanese(story.tagline.ja));
      noteZh.textContent = `${story.origin.zh} · ${story.tagline.zh}`;
    } else {
      noteJa.append(japanese(story.credit.ja));
      noteZh.textContent = story.credit.zh;
    }
    note.append(noteJa, noteZh);
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
    pageImage.alt = `${page.alt.ja} ／ ${page.alt.zh}`;
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

  function updatePlayback() {
    const playing = narrator.state === 'playing';
    playIcon.textContent = playing ? '⏸' : '▶';
    playButton.setAttribute('aria-label', playing ? 'とめる 暫停' : 'よむ 唸給我聽');
    muteIcon.textContent = muted ? '🔇' : '🔊';
    muteButton.setAttribute('aria-pressed', String(muted));
    muteButton.setAttribute('aria-label', muted ? 'おとを だす 開啟聲音' : 'おとを けす 靜音');
    if (typeof navigator !== 'undefined' && navigator.mediaSession) {
      navigator.mediaSession.playbackState = playing ? 'playing' : narrator.state === 'paused' ? 'paused' : 'none';
    }
  }

  // Lock-screen/notification metadata and media controls: title and cover art per book,
  // plus play, pause, and page-turn controls wired to the same functions as the on-page buttons.
  function updateMediaMetadata(story) {
    if (typeof navigator === 'undefined' || !navigator.mediaSession || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${story.title.zh}｜${E.plainJapanese(story.title.ja)}`,
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
        if (narrator.state === 'paused' && !muted) {
          listening = queueKind === 'page';
          narrator.resume();
        } else if (narrator.state === 'idle') {
          readPage();
        }
        updatePlayback();
      },
      pause: () => {
        narrator.pause();
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
    warmClip(E.clipPath(book.story.id, E.languagesFor(settings.mode)[0], firstLine.id, ASSET_BASE));
  }

  function readPage({ paused = false } = {}) {
    if (!book || muted) return;
    clearTimeout(turnTimer);
    listening = !paused;
    queueKind = 'page';
    speechStatus.textContent = '';
    const queue = E.pageQueue(book.page(), settings.mode);
    narrator.play(book.story.id, queue, { paused });
    warmUpcoming(queue);
    updatePlayback();
  }

  function readLine(lineId, lang) {
    if (!book || muted) return;
    clearTimeout(turnTimer);
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
    narrator.stop();
    renderPage(direction);
    if (book.page().id === 'end' && !completedThisOpening) {
      completedThisOpening = true;
      if (STORIES.includes(book.story)) track('book_complete', { book_id: book.story.id });
    }
    if (listening && !muted) scheduleGap(TURN_SETTLE, readPage);
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
    reader.classList.toggle('hide-zhuyin', !settings.zhuyin);
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
    if (narrator.state === 'playing') {
      narrator.pause();
      listening = false;
      clearTimeout(turnTimer);
    } else if (narrator.state === 'paused' && !muted) {
      listening = queueKind === 'page';
      narrator.resume();
    } else {
      readPage();
    }
    updatePlayback();
  });

  replayButton.addEventListener('click', readPage);

  muteButton.addEventListener('click', () => {
    muted = !muted;
    if (muted) {
      clearTimeout(turnTimer);
      narrator.stop();
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
      if (!input.checked || !E.isMode(input.value) || input.value === settings.mode) return;
      const playbackState = narrator.state;
      const pageQueueActive = queueKind === 'page' && playbackState !== 'idle';
      settings.mode = input.value;
      saveSettings();
      track('listen_mode_change', { listen_mode: settings.mode });
      renderText();
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
