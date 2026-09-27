(() => {
  'use strict';

  // PWA install/update plumbing for monster-word-arena-tw. Runs alongside app.js but stays
  // independent of it: the only coupling is reading the current text-language setting off
  // `window.FriendlyArenaCurrentTextLanguage()` (set by app.js) so the iOS install hint speaks
  // whichever language the child/parent already chose. Unlike the storybook, there is no
  // per-item download UI: sw.js precaches every image and audio clip at install, so the game
  // is fully playable offline after the first visit.

  const IOS_HINT_KEY = 'monsterWordArena.iosInstallHintSeen';

  const HINT_TEXT = {
    en: 'Add this game to your Home Screen: tap Share, then "Add to Home Screen".',
    zh: '把這個遊戲加到主畫面：點選「分享」，再選「加入主畫面」。',
    ja: 'このゲームを ホーム画面に ついかできます。共有ボタン → ホーム画面に追加。',
  };

  function currentTextLanguage() {
    const language = window.FriendlyArenaCurrentTextLanguage?.();
    return HINT_TEXT[language] ? language : 'en';
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const updateToast = document.querySelector('#updateToast');
    const updateReloadButton = document.querySelector('#updateReloadButton');
    if (!updateToast || !updateReloadButton) return;

    function announce(registration) {
      updateReloadButton.onclick = () => registration.waiting?.postMessage('skip-waiting');
      updateToast.hidden = false;
    }

    navigator.serviceWorker.register('./sw.js', { scope: './' }).then(registration => {
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

  // Both toasts are fixed to the bottom of the screen, which is exactly where the answer
  // buttons and Start button sit on a phone. Rather than let one sit on top of a tap the child
  // meant for the game, the first tap anywhere outside a toast quietly dismisses whichever one
  // is showing — the hint stays gentle without blocking play.
  function dismissToastOnOutsideTap() {
    const toasts = [...document.querySelectorAll('.toast')];
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
    let showingIosHint = false;

    function hide() { installToast.hidden = true; }

    installDismissButton.addEventListener('click', hide);

    // The iOS hint text follows whichever text language is active, including a change made
    // after the toast is already showing. app.js's own listener on these same buttons (attached
    // first, since app.js loads before offline.js) has already updated the language by the time
    // this one runs.
    for (const button of document.querySelectorAll('.text-language')) {
      button.addEventListener('click', () => {
        if (showingIosHint) installToastText.textContent = HINT_TEXT[currentTextLanguage()];
      });
    }

    addEventListener('beforeinstallprompt', event => {
      if (isStandalone()) return;
      event.preventDefault();
      deferredPrompt = event;
      showingIosHint = false;
      installToastText.textContent = 'Add this game to your Home Screen · 加到主畫面 · ホーム画面に追加';
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
        showingIosHint = true;
        installToastText.textContent = HINT_TEXT[currentTextLanguage()];
        installButton.hidden = true;
        installToast.hidden = false;
      }
    }
  }

  // Guards against non-browser test harnesses (e.g. game.test.js's script-fixture sandbox,
  // which runs every script index.html loads but does not define `navigator`) rather than a
  // real page.
  if (typeof navigator !== 'undefined') {
    registerServiceWorker();
    setupInstallHints();
    dismissToastOnOutsideTap();
  }
})();
