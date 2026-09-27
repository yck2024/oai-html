(() => {
  'use strict';

  // PWA install/update plumbing for math-island, shared by the game-picker hub and all three
  // game pages (each links this same script). There is no per-item download UI: sw.js
  // precaches every image and audio clip across all three games at install, so the whole app
  // is fully playable offline after the first visit.

  const APP_MARKER = '/math-island/';

  // Works out the app's own root regardless of which page (hub or a game, one folder deep)
  // loaded this script, so the service worker always registers at the same scope.
  function appBasePath() {
    const path = location.pathname;
    const at = path.indexOf(APP_MARKER);
    if (at === -1) return path.endsWith('/') ? path : `${path}/`;
    return path.slice(0, at + APP_MARKER.length);
  }

  const ASSET_BASE = appBasePath();
  const IOS_HINT_KEY = 'mathIsland.iosInstallHintSeen';

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const updateToast = document.querySelector('#updateToast');
    const updateReloadButton = document.querySelector('#updateReloadButton');
    if (!updateToast || !updateReloadButton) return;

    function announce(registration) {
      updateReloadButton.onclick = () => registration.waiting?.postMessage('skip-waiting');
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

  // Both toasts are fixed to the bottom of the screen, which is exactly where each game's
  // answer buttons sit on a phone. Rather than let one sit on top of a tap the child meant for
  // the game, the first tap anywhere outside a toast quietly dismisses whichever one is
  // showing — the hint stays gentle without blocking play.
  function dismissToastOnOutsideTap() {
    const toasts = [...document.querySelectorAll('.pwa-toast')];
    if (!toasts.length) return;
    document.addEventListener('pointerdown', event => {
      for (const toast of toasts) {
        if (!toast.hidden && !toast.contains(event.target)) toast.hidden = true;
      }
    }, { capture: true });
  }

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
      installToastText.textContent = 'このアプリを ホーム画面に ついかできます';
      installButton.hidden = false;
      installToast.hidden = false;
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
        installToastText.textContent = '共有ボタン → ホーム画面に追加';
        installButton.hidden = true;
        installToast.hidden = false;
      }
    }
  }

  registerServiceWorker();
  setupInstallHints();
  dismissToastOnOutsideTap();
})();
