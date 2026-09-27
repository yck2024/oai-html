(() => {
  'use strict';

  // PWA install/update plumbing and the offline-download UI for the storybook shelf and reader
  // settings. Runs alongside app.js but stays independent of it: it only reads the current
  // book id off `#reader`'s `data-book` attribute (set by app.js) and otherwise talks to the
  // DOM, Cache Storage, and the service worker directly.

  const E = window.Ehon;
  const STORIES = window.EhonStories;
  const SERIES = window.EhonSeriesConfig;
  const LISTEN_MODES = E.buildListenModes(SERIES.languages);
  const SETTINGS_KEY = `${SERIES.folder}-settings`;
  const SHELF_MARKER = SERIES.shelfMarker;
  const IOS_HINT_KEY = `${SERIES.folder}-ios-install-hint-seen`;
  const { shellCacheName: SHELL_CACHE_NAME, mediaCacheName: MEDIA_CACHE_NAME } = E.cacheNames(SERIES.folder);

  function shelfPath() {
    const path = location.pathname;
    const at = path.indexOf(SHELF_MARKER);
    if (at === -1) return path.endsWith('/') ? path : `${path}/`;
    return path.slice(0, at + SHELF_MARKER.length);
  }

  const ASSET_BASE = shelfPath();
  const CACHES_SUPPORTED = typeof caches !== 'undefined';

  // A toast fixed to the bottom of the screen sits right where the reader's playback controls
  // are on a phone; never show one there, and dismiss one that was already showing the moment
  // a book opens, so it can never intercept a tap meant for ▶/⏮/🔇.
  const readerEl = document.querySelector('#reader');
  function readerIsOpen() {
    return Boolean(readerEl && readerEl.hidden === false);
  }
  function hideToastsForReader() {
    if (!readerIsOpen()) return;
    for (const toast of document.querySelectorAll('.toast')) toast.hidden = true;
  }
  if (readerEl) new MutationObserver(hideToastsForReader).observe(readerEl, { attributes: true, attributeFilter: ['hidden'] });

  function formatMB(bytes) {
    return `${(bytes / 1e6).toFixed(1)}MB`;
  }

  function element(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function displayLanguages() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch (_error) { saved = {}; }
    const mode = E.isMode(LISTEN_MODES, saved.mode) ? saved.mode : SERIES.defaultMode;
    const order = E.languagesFor(LISTEN_MODES, SERIES.defaultMode, mode);
    return E.displayLanguagesFor(SERIES.languages, order, SERIES.narratedOnlyToggle && saved.narratedOnly === true);
  }

  function renderOfflineTitle(target, story) {
    target.replaceChildren();
    const languages = E.metadataLanguages(SERIES.languages, displayLanguages(), story.title);
    for (const [index, lang] of languages.entries()) {
      const title = element('span', `${lang === 'zh' ? 'zh ' : ''}${index ? 'metadata-secondary' : ''}`.trim());
      title.lang = lang === 'zh' ? 'zh-Hant-TW' : lang;
      title.textContent = lang === 'ja' ? E.plainJapanese(story.title[lang]) : story.title[lang];
      target.append(title);
    }
  }

  // ---------- Service worker registration + "new version" notice ----------

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const updateToast = document.querySelector('#updateToast');
    const updateReloadButton = document.querySelector('#updateReloadButton');
    if (!updateToast || !updateReloadButton) return;

    function announce(registration) {
      updateReloadButton.onclick = () => registration.waiting?.postMessage('skip-waiting');
      if (readerIsOpen()) return; // shown the next time the reader closes or reloads instead
      updateToast.hidden = false;
    }

    navigator.serviceWorker.register(`${ASSET_BASE}sw.js`, { scope: ASSET_BASE }).then(registration => {
      if (registration.waiting && navigator.serviceWorker.controller) announce(registration);
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) announce(registration);
        });
      });
    }).catch(() => { /* offline first load, or unsupported: the page still works online */ });

    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      location.reload();
    });
  }

  // ---------- Install hints (Android/Chrome prompt, iOS one-time hint) ----------

  function isStandalone() {
    return (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent || '');
  }

  function setupInstallHints() {
    const installToast = document.querySelector('#installToast');
    const installToastText = document.querySelector('#installToastText');
    const installButton = document.querySelector('#installButton');
    const installDismissButton = document.querySelector('#installDismissButton');
    if (!installToast || !installToastText || !installButton || !installDismissButton) return;

    let deferredPrompt = null;

    function hide() { installToast.hidden = true; }

    installDismissButton.addEventListener('click', hide);

    addEventListener('beforeinstallprompt', event => {
      if (isStandalone()) return;
      event.preventDefault();
      deferredPrompt = event;
      installToastText.textContent = 'この アプリを ホーム画面に ついか できます ・ 可以將這個網站加入主畫面';
      installButton.hidden = false;
      if (!readerIsOpen()) installToast.hidden = false;
    });

    addEventListener('appinstalled', () => {
      deferredPrompt = null;
      hide();
    });

    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      installButton.hidden = true;
      const prompt = deferredPrompt;
      deferredPrompt = null;
      prompt.prompt();
      await prompt.userChoice;
      hide();
    });

    if (isIos() && !isStandalone()) {
      let alreadySeen = true;
      try { alreadySeen = Boolean(localStorage.getItem(IOS_HINT_KEY)); } catch (_error) { /* private mode */ }
      if (!alreadySeen) {
        try { localStorage.setItem(IOS_HINT_KEY, '1'); } catch (_error) { /* private mode: shown once per session instead */ }
        installToastText.textContent = '共有 ボタン → ホーム画面に追加 ・ 分享 → 加入主畫面';
        installButton.hidden = true;
        if (!readerIsOpen()) installToast.hidden = false;
      }
    }
  }

  // ---------- Offline downloads ----------

  function mediaCache() {
    return caches.open(MEDIA_CACHE_NAME);
  }

  function assetsFor(story) {
    return E.bookAssetUrls(story, SERIES.languages, ASSET_BASE);
  }

  async function storyFileStatus(story) {
    const assets = assetsFor(story);
    const files = [...assets.images, ...assets.audio];
    const cache = await mediaCache();
    const found = await Promise.all(files.map(url => cache.match(url)));
    const cached = found.filter(Boolean).length;
    return { total: files.length, cached, complete: files.length > 0 && cached === files.length };
  }

  async function downloadStory(story, onProgress) {
    try { await navigator.storage?.persist?.(); } catch (_error) { /* not offered on this browser */ }
    const assets = assetsFor(story);
    const files = [...assets.images, ...assets.audio];
    let failed = 0;
    try {
      const shell = await caches.open(SHELL_CACHE_NAME);
      await shell.add(assets.page);
    } catch (_error) {
      failed += 1;
    }

    const cache = await mediaCache();
    let done = 0;
    let bytes = 0;
    onProgress({ done, total: files.length, bytes });
    for (const url of files) {
      const cached = await cache.match(url);
      try {
        const response = await fetch(url);
        if (response && response.ok) {
          bytes += Number(response.headers.get('Content-Length') || 0);
          try {
            await cache.put(url, response);
          } catch (_error) {
            failed += 1;
          }
        } else if (!cached) {
          failed += 1;
        }
      } catch (_error) {
        if (!cached) failed += 1;
      }
      done += 1;
      onProgress({ done, total: files.length, bytes });
    }
    return { failed };
  }

  async function removeStory(story) {
    const assets = assetsFor(story);
    const cache = await mediaCache();
    for (const url of [...assets.images, ...assets.audio]) await cache.delete(url);
  }

  async function updateStorageNote(target) {
    if (!target) return;
    if (!navigator.storage?.estimate) { target.textContent = ''; return; }
    try {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      target.textContent = `つかっている ようりょう ・ 已使用儲存空間：約 ${formatMB(usage)} / ${quota ? formatMB(quota) : '?'}`;
    } catch (_error) {
      target.textContent = '';
    }
  }

  function setShelfBadge(story, complete) {
    const card = document.querySelector(`#bookList .book-card[data-story="${story.id}"]`);
    if (!card) return;
    let badge = card.querySelector('.book-offline-badge');
    if (complete) {
      if (!badge) {
        badge = element('span', 'book-offline-badge');
        badge.textContent = '⬇ オフライン 離線';
        card.prepend(badge);
      }
    } else if (badge) {
      badge.remove();
    }
  }

  function setupOfflineUi() {
    if (!CACHES_SUPPORTED) return;

    const offlineButton = document.querySelector('#offlineButton');
    const offlinePanel = document.querySelector('#offlinePanel');
    const offlineBookList = document.querySelector('#offlineBookList');
    const downloadAllButton = document.querySelector('#downloadAllButton');
    const removeAllButton = document.querySelector('#removeAllButton');
    const offlineAllProgress = document.querySelector('#offlineAllProgress');
    const offlineStorageNote = document.querySelector('#offlineStorageNote');
    const reader = document.querySelector('#reader');
    const bookDownloadButton = document.querySelector('#bookDownloadButton');
    const bookRemoveButton = document.querySelector('#bookRemoveButton');
    const bookOfflineProgress = document.querySelector('#bookOfflineProgress');
    const bookOfflineStatus = document.querySelector('#bookOfflineStatus');
    if (!offlineButton || !offlinePanel || !offlineBookList) return;

    offlineButton.addEventListener('click', () => {
      const open = offlinePanel.hidden;
      offlinePanel.hidden = !open;
      offlineButton.setAttribute('aria-expanded', String(open));
      if (open) refreshAll();
    });

    const rows = new Map(); // story id -> { row, downloadButton, removeButton, progress }

    for (const story of STORIES) {
      const row = element('li', 'offline-book-row');
      const title = element('span', 'offline-book-title');
      renderOfflineTitle(title, story);
      const downloadButton = element('button', 'offline-button');
      downloadButton.type = 'button';
      downloadButton.textContent = 'ダウンロード ・ 下載';
      const removeButton = element('button', 'offline-button ghost');
      removeButton.type = 'button';
      removeButton.textContent = 'けす ・ 移除';
      removeButton.hidden = true;
      const progress = element('p', 'offline-progress');
      progress.hidden = true;
      row.append(title, downloadButton, removeButton, progress);
      offlineBookList.append(row);
      rows.set(story.id, { row, title, downloadButton, removeButton, progress });

      downloadButton.addEventListener('click', () => runDownload(story));
      removeButton.addEventListener('click', () => runRemove(story));
    }

    async function applyStatus(story, status) {
      const controls = rows.get(story.id);
      setShelfBadge(story, status.complete);
      if (controls) {
        controls.downloadButton.hidden = status.complete;
        controls.removeButton.hidden = status.cached === 0;
      }
      if (reader.dataset.book === story.id && bookDownloadButton && bookRemoveButton) {
        bookDownloadButton.hidden = status.complete;
        bookRemoveButton.hidden = status.cached === 0;
        if (status.complete) bookOfflineStatus.textContent = 'ダウンロード ずみ ・ 已下載完成';
      }
      return status;
    }

    function refreshOfflineTitles() {
      for (const story of STORIES) renderOfflineTitle(rows.get(story.id).title, story);
    }

    async function refreshAll() {
      refreshOfflineTitles();
      const statuses = await Promise.all(STORIES.map(async story => applyStatus(story, await storyFileStatus(story))));
      removeAllButton.hidden = !statuses.some(status => status.cached > 0);
      updateStorageNote(offlineStorageNote);
    }

    function showProgress(node, { done, total, bytes }) {
      if (!node) return;
      node.hidden = false;
      node.textContent = `${done} / ${total} ・ ${formatMB(bytes)}`;
    }

    async function runDownload(story) {
      const controls = rows.get(story.id);
      if (controls) { controls.downloadButton.disabled = true; }
      const forCurrentBook = reader.dataset.book === story.id;
      if (forCurrentBook && bookDownloadButton) bookDownloadButton.disabled = true;
      let failed = 0;
      try {
        ({ failed } = await downloadStory(story, progressState => {
          showProgress(controls?.progress, progressState);
          if (forCurrentBook) showProgress(bookOfflineProgress, progressState);
        }));
      } catch (_error) {
        const assets = assetsFor(story);
        failed = assets.images.length + assets.audio.length;
      } finally {
        if (controls) controls.downloadButton.disabled = false;
        if (forCurrentBook && bookDownloadButton) bookDownloadButton.disabled = false;
      }
      if (failed && controls?.progress) controls.progress.textContent += ` ・ ${failed} こ しっぱい ・ ${failed} 個失敗`;
      if (forCurrentBook && bookOfflineStatus) {
        bookOfflineStatus.textContent = failed
          ? 'いちぶ ダウンロードできませんでした。もういちど ためしてね ・ 部分下載失敗，請再試一次'
          : 'ダウンロード ずみ ・ 已下載完成';
      }
      await refreshAll();
    }

    async function runRemove(story) {
      await removeStory(story);
      await refreshAll();
      const forCurrentBook = reader.dataset.book === story.id;
      if (forCurrentBook && bookOfflineStatus) bookOfflineStatus.textContent = '';
    }

    downloadAllButton.addEventListener('click', async () => {
      downloadAllButton.disabled = true;
      const totalFiles = STORIES.reduce((sum, story) => {
        const assets = assetsFor(story);
        return sum + assets.images.length + assets.audio.length;
      }, 0);
      let doneSoFar = 0;
      let bytesSoFar = 0;
      let failed = 0;
      showProgress(offlineAllProgress, { done: 0, total: totalFiles, bytes: 0 });
      try {
        for (const story of STORIES) {
          const assets = assetsFor(story);
          const storyTotal = assets.images.length + assets.audio.length;
          let lastBytes = 0;
          try {
            const result = await downloadStory(story, ({ done, bytes }) => {
              bytesSoFar += bytes - lastBytes;
              lastBytes = bytes;
              showProgress(offlineAllProgress, { done: doneSoFar + done, total: totalFiles, bytes: bytesSoFar });
            });
            failed += result.failed;
          } catch (_error) {
            failed += storyTotal;
          }
          doneSoFar += storyTotal;
          await applyStatus(story, await storyFileStatus(story));
        }
      } finally {
        downloadAllButton.disabled = false;
      }
      await refreshAll();
      offlineAllProgress.textContent += failed
        ? ` ・ ${failed} こ ダウンロードできませんでした ・ ${failed} 個項目下載失敗`
        : ' ・ すべて ダウンロードしました ・ 全部下載完成';
    });

    removeAllButton.addEventListener('click', async () => {
      removeAllButton.disabled = true;
      for (const story of STORIES) await removeStory(story);
      removeAllButton.disabled = false;
      await refreshAll();
    });

    document.addEventListener('ehon:metadatachange', refreshOfflineTitles);

    if (bookDownloadButton && bookRemoveButton) {
      bookDownloadButton.addEventListener('click', () => {
        const story = STORIES.find(item => item.id === reader.dataset.book);
        if (story) runDownload(story);
      });
      bookRemoveButton.addEventListener('click', () => {
        const story = STORIES.find(item => item.id === reader.dataset.book);
        if (story) runRemove(story);
      });
    }

    // Keeps the reader's own offline control in sync with whichever book is currently open,
    // including direct loads of a book's own URL and browser back/forward navigation.
    new MutationObserver(() => {
      const story = STORIES.find(item => item.id === reader.dataset.book);
      if (!story || !bookDownloadButton) return;
      bookOfflineStatus.textContent = '';
      bookOfflineProgress.hidden = true;
      storyFileStatus(story).then(status => applyStatus(story, status));
    }).observe(reader, { attributes: true, attributeFilter: ['data-book'] });

    refreshAll();
  }

  registerServiceWorker();
  setupInstallHints();
  setupOfflineUi();
})();
