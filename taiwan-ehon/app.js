(() => {
  'use strict';

  const E = window.TaiwanEhon;
  const STORIES = window.TaiwanEhonStories;
  const SETTINGS_KEY = 'taiwan-ehon-settings';
  const AUTO_TURN_DELAY = 1500;
  const TURN_SETTLE = 450;
  const HINT = '▶ を おすと よむよ。 ぶんを タップしても きけるよ。 · 按 ▶ 唸給你聽，也可以點句子喔。';
  const UNAVAILABLE = 'こえが でません。 ぶんは よめるよ。 · 目前無法播放聲音，還是可以看故事喔。';

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
  let openedFromShelf = false;
  let lastCard = null;

  let audio = null;
  try {
    if (typeof Audio !== 'undefined') {
      audio = new Audio();
      audio.preload = 'auto';
    }
  } catch (_error) {
    audio = null;
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
  });

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
      cover.src = story.pages[0].image;
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
        openedFromShelf = true;
        location.hash = story.id;
      });
      item.append(card);
      bookList.append(item);
    }
  }

  function openBook(story, index) {
    book = E.createBook(story, index);
    listening = false;
    narrator.stop();
    reader.style.setProperty('--accent', story.theme.accent);
    reader.style.setProperty('--accent-soft', story.theme.soft);
    readerTitle.replaceChildren(E.plainJapanese(story.title.ja));
    const zh = element('span', 'zh', 'zh-Hant-TW');
    zh.textContent = story.title.zh;
    readerTitle.append(zh);
    document.title = `${story.title.zh}｜${E.plainJapanese(story.title.ja)} · 台灣故事繪本`;
    shelf.hidden = true;
    reader.hidden = false;
    speechStatus.textContent = HINT;
    renderPage(null);
    closeButton.focus({ preventScroll: true });
  }

  function closeBook() {
    clearTimeout(turnTimer);
    narrator.stop();
    listening = false;
    book = null;
    setSettingsOpen(false);
    reader.hidden = true;
    shelf.hidden = false;
    document.title = '台灣故事繪本｜たいわんの おはなし えほん';
    if (lastCard) lastCard.focus({ preventScroll: true });
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
    other.addEventListener('click', leaveBook);
    actions.append(again, other);
    pageEl.append(actions);
  }

  function renderPage(direction) {
    const page = book.page();
    const kind = pageKind(page);
    pageEl.dataset.kind = kind;
    pageImage.src = page.image;
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
    history.replaceState(null, '', `#${book.story.id}/${book.index + 1}`);
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
  }

  function unmute() {
    if (!muted) return;
    muted = false;
    updatePlayback();
  }

  function readPage() {
    if (!book) return;
    clearTimeout(turnTimer);
    unmute();
    listening = true;
    queueKind = 'page';
    speechStatus.textContent = '';
    narrator.play(book.story.id, E.pageQueue(book.page(), settings.mode));
    updatePlayback();
  }

  function readLine(lineId, lang) {
    clearTimeout(turnTimer);
    unmute();
    queueKind = 'line';
    speechStatus.textContent = '';
    narrator.play(book.story.id, [{ lineId, lang }]);
    updatePlayback();
  }

  function pageFinished() {
    updatePlayback();
    if (queueKind !== 'page' || !book) return;
    if (book.isLast()) {
      listening = false;
      return;
    }
    if (settings.autoTurn && listening && !muted) {
      turnTimer = setTimeout(() => turn('next'), AUTO_TURN_DELAY);
    }
  }

  function goTo(index, direction) {
    clearTimeout(turnTimer);
    if (!book.goTo(index)) return;
    narrator.stop();
    renderPage(direction);
    if (listening && !muted) turnTimer = setTimeout(readPage, TURN_SETTLE);
  }

  function turn(direction) {
    if (!book) return;
    goTo(book.index + (direction === 'next' ? 1 : -1), direction);
  }

  function leaveBook() {
    if (openedFromShelf) {
      history.back();
    } else {
      history.replaceState(null, '', location.pathname + location.search);
      closeBook();
    }
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

  function route() {
    const [storyId, pageNumber] = decodeURIComponent(location.hash.slice(1)).split('/');
    const story = STORIES.find(item => item.id === storyId);
    if (!story) {
      if (book) closeBook();
      openedFromShelf = false;
      return;
    }
    if (book && book.story.id === story.id) return;
    openBook(story, (Number(pageNumber) || 1) - 1);
  }

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
    } else if (narrator.state === 'paused') {
      unmute();
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
  closeButton.addEventListener('click', leaveBook);

  settingsButton.addEventListener('click', () => setSettingsOpen(settingsPanel.hidden));
  document.addEventListener('click', event => {
    if (settingsPanel.hidden || settingsPanel.contains(event.target) || settingsButton.contains(event.target)) return;
    setSettingsOpen(false);
  });

  for (const input of modeInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      settings.mode = input.value;
      saveSettings();
      const wasReading = narrator.state !== 'idle' && queueKind === 'page';
      renderText();
      if (wasReading) readPage();
    });
  }

  zhuyinToggle.addEventListener('change', () => {
    settings.zhuyin = zhuyinToggle.checked;
    saveSettings();
    applySettings();
  });

  autoTurnToggle.addEventListener('change', () => {
    settings.autoTurn = autoTurnToggle.checked;
    saveSettings();
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

  window.addEventListener('hashchange', route);

  renderShelf();
  applySettings();
  updatePlayback();
  route();
})();
