(() => {
  'use strict';

  const { STICKERS, STORAGE_KEY, createRewards } = window.ArenaRewardsCore;
  const I18N = window.FriendlyArenaI18n;
  const CHAMPION_IDS = ['dino', 'monster'];

  function deviceStorage() {
    try {
      const storage = window.localStorage;
      const probe = `${STORAGE_KEY}.probe`;
      storage.setItem(probe, '1');
      storage.removeItem(probe);
      return storage;
    } catch (_error) {
      return null;
    }
  }

  const rewards = createRewards(deviceStorage());
  const $ = selector => document.querySelector(selector);
  const summary = $('#rewardSummary');
  // Reward buttons carry no id or aria-label, so the shared analytics helper never reports them.
  const action = name => $(`[data-reward-action="${name}"]`);
  const book = $('#stickerBook');
  const bookIntro = $('#stickerBookIntro');
  const stickerGrid = $('#stickerGrid');
  const costumeRows = $('#costumeRows');
  const saveNote = $('#rewardSaveNote');
  const closeButton = action('close');
  const resetButton = action('reset');
  const confirmResetButton = action('confirm-reset');
  const keepButton = action('keep');
  const resetStatus = $('#resetStatus');
  let returnFocus = null;
  // app.js runs before this script and already resolved the saved text language;
  // later language switches arrive through window.ArenaRewards.setLanguage.
  let currentLanguage = I18N.TEXT_LANGUAGES.includes(window.FriendlyArenaCurrentTextLanguage?.())
    ? window.FriendlyArenaCurrentTextLanguage()
    : 'en';

  function label(item) {
    return item[currentLanguage];
  }

  function picture(item, className) {
    const holder = document.createElement('span');
    holder.className = className;
    holder.setAttribute('aria-hidden', 'true');
    const art = document.createElement('img');
    art.addEventListener('error', () => art.replaceWith(item.icon));
    art.className = 'reward-art';
    art.alt = label(item);
    art.draggable = false;
    art.width = 160;
    art.height = 160;
    art.decoding = 'async';
    art.src = item.image;
    holder.append(art);
    return holder;
  }

  function selectedChampion() {
    const card = [...document.querySelectorAll('.champion-card')].find(item => item.classList.contains('is-selected'));
    return card?.dataset.champion === 'monster' ? 'monster' : 'dino';
  }

  // A costume is a small overlay beside the champion picture, so it keeps working if the picture changes.
  function setOverlay(holder, before, costume) {
    if (!holder) return;
    holder.querySelectorAll('.costume-overlay').forEach(overlay => overlay.remove());
    if (!costume) return;
    const overlay = picture(costume, 'costume-overlay');
    if (before && before.parentNode === holder) holder.insertBefore(overlay, before);
    else holder.prepend(overlay);
  }

  function renderCostumes(state) {
    const byId = id => state.costumes.find(costume => costume.id === id) || null;
    setOverlay($('#heroFighter'), $('#heroEmoji'), byId(state.wearing[selectedChampion()]));
    document.querySelectorAll('.champion-card').forEach(card => {
      setOverlay(card, card.querySelector('.champion-emoji'), byId(state.wearing[card.dataset.champion]));
    });
  }

  function renderSummary(state) {
    const total = STICKERS.length;
    const next = state.nextCostume;
    const hint = next
      ? ` · ${I18N.nextSurpriseHint(label(next), next.winsToGo, currentLanguage)}`
      : ` · ${I18N.STRINGS.allCostumesUnlocked[currentLanguage]}`;
    summary.textContent = `${I18N.rewardSummaryPattern(state.collected, total, currentLanguage)}${hint}`;
  }

  function stickerSlot(sticker, index) {
    const slot = document.createElement('li');
    slot.className = 'sticker-slot';
    if (!sticker.count) {
      slot.classList.add('is-empty');
      const mark = document.createElement('span');
      mark.className = 'sticker-mystery';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = String(index + 1);
      const text = document.createElement('span');
      text.className = 'visually-hidden';
      text.textContent = I18N.stickerStillToFind(index + 1, currentLanguage);
      slot.append(mark, text);
      return slot;
    }
    const name = document.createElement('span');
    name.className = 'sticker-name';
    name.textContent = label(sticker);
    slot.append(picture(sticker, 'sticker-picture'), name);
    if (sticker.count > 1) {
      const count = document.createElement('span');
      count.className = 'sticker-count';
      count.textContent = `×${sticker.count}`;
      slot.append(count);
    }
    return slot;
  }

  function costumeButton(champion, costume, wearing) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'costume-choice';
    button.dataset.champion = champion;
    button.dataset.costume = costume ? costume.id : 'none';
    const selected = (costume ? costume.id : null) === wearing;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('is-worn', selected);
    const text = document.createElement('span');
    text.className = 'costume-label';
    text.textContent = !costume
      ? I18N.STRINGS.costumeNoneLabel[currentLanguage]
      : costume.unlocked ? label(costume) : I18N.costumeWinsToGo(costume.unlockAt, currentLanguage);
    if (costume?.unlocked) {
      button.append(picture(costume, 'costume-picture'), text);
    } else {
      const mark = document.createElement('span');
      mark.className = 'costume-none';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = costume ? '🎁' : '🙂';
      button.append(mark, text);
    }
    if (costume && !costume.unlocked) {
      button.disabled = true;
      button.classList.add('is-locked');
      const hint = document.createElement('span');
      hint.className = 'visually-hidden';
      hint.textContent = I18N.costumeSurpriseHint(label(costume), currentLanguage);
      button.append(hint);
    }
    button.addEventListener('click', () => {
      if (!rewards.wear(champion, costume ? costume.id : null)) return;
      render();
      costumeRows.querySelector(`[data-champion="${champion}"][data-costume="${button.dataset.costume}"]`)?.focus();
    });
    return button;
  }

  function renderBook(state) {
    bookIntro.textContent = state.wins >= 9999
      ? I18N.STRINGS.rewardBookFull[currentLanguage]
      : state.wins
        ? I18N.rewardBookIntroWins(state.wins, currentLanguage)
        : I18N.STRINGS.rewardBookIntroEmpty[currentLanguage];
    stickerGrid.replaceChildren(...state.stickers.map(stickerSlot));
    costumeRows.replaceChildren(...CHAMPION_IDS.map(champion => {
      const row = document.createElement('div');
      row.className = 'costume-row';
      row.setAttribute('role', 'group');
      const shortName = I18N.CHAMPIONS[champion].shortName[currentLanguage];
      row.setAttribute('aria-label', I18N.costumeRowLabel(shortName, currentLanguage));
      const heading = document.createElement('span');
      heading.className = 'costume-row-name';
      heading.textContent = shortName;
      const options = document.createElement('div');
      options.className = 'costume-options';
      options.append(costumeButton(champion, null, state.wearing[champion]),
        ...state.costumes.map(costume => costumeButton(champion, costume, state.wearing[champion])));
      row.append(heading, options);
      return row;
    }));
    saveNote.textContent = state.persistent
      ? I18N.STRINGS.saveNotePersistent[currentLanguage]
      : I18N.STRINGS.saveNoteNotPersistent[currentLanguage];
  }

  function render() {
    const state = rewards.getState();
    renderSummary(state);
    renderBook(state);
    renderCostumes(state);
  }

  function showResetConfirm(show) {
    resetButton.hidden = show;
    confirmResetButton.hidden = !show;
    keepButton.hidden = !show;
  }

  function openBook() {
    returnFocus = document.activeElement;
    showResetConfirm(false);
    resetStatus.textContent = '';
    render();
    if (typeof book.showModal === 'function') book.showModal();
    else book.setAttribute('open', '');
    closeButton.focus();
  }

  function closeBook() {
    if (typeof book.close === 'function') book.close();
    else {
      book.removeAttribute('open');
      returnFocus?.focus?.();
    }
  }

  function rewardNote(result, champion) {
    const note = document.createElement('div');
    note.className = 'reward-note';
    note.id = 'rewardNote';
    note.setAttribute('role', 'status');
    const text = document.createElement('p');
    text.className = 'reward-text';
    const title = document.createElement('strong');
    title.textContent = result.firstTime ? I18N.STRINGS.rewardNewStickerTitle[currentLanguage] : I18N.STRINGS.rewardAnotherStickerTitle[currentLanguage];
    text.append(title, document.createTextNode(` ${label(result.sticker)}`));
    note.append(picture(result.sticker, 'reward-sticker'), text);
    if (result.unlocked) {
      const unlock = document.createElement('p');
      unlock.className = 'reward-unlock';
      const championKey = CHAMPION_IDS.includes(champion) ? champion : 'dino';
      const championName = I18N.CHAMPIONS[championKey].shortName[currentLanguage];
      unlock.textContent = I18N.rewardUnlockText(championName, label(result.unlocked), currentLanguage);
      note.append(unlock);
    }
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'reward-book-link';
    open.textContent = I18N.STRINGS.rewardBookLinkButton[currentLanguage];
    open.addEventListener('click', openBook);
    note.append(open);
    return note;
  }

  function recordWin(champion) {
    const result = rewards.recordWin(champion);
    render();
    const finishPanel = $('#finishPanel');
    finishPanel?.querySelector('#rewardNote')?.remove();
    if (result.rewarded && finishPanel) {
      const note = rewardNote(result, champion);
      const playAgain = $('#playAgainButton');
      if (playAgain && playAgain.parentNode === finishPanel) finishPanel.insertBefore(note, playAgain);
      else finishPanel.append(note);
    }
    return result;
  }

  action('open').addEventListener('click', openBook);
  closeButton.addEventListener('click', closeBook);
  book.addEventListener('click', event => {
    const box = book.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (event.target === book && outside) closeBook();
  });
  book.addEventListener('close', () => returnFocus?.focus?.());
  resetButton.addEventListener('click', () => {
    showResetConfirm(true);
    resetStatus.textContent = '';
    keepButton.focus();
  });
  keepButton.addEventListener('click', () => {
    showResetConfirm(false);
    resetButton.focus();
  });
  confirmResetButton.addEventListener('click', () => {
    rewards.reset();
    showResetConfirm(false);
    render();
    window.dispatchEvent(new Event('arena-rewards-updated'));
    resetStatus.textContent = I18N.STRINGS.settingsClearedStatus[currentLanguage];
    resetButton.focus();
  });
  // Runs after app.js's own champion listener, so the selected card is already updated.
  document.querySelectorAll('.champion-card').forEach(card => card.addEventListener('click', render));
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    const focused = document.activeElement;
    const choice = focused?.classList.contains('costume-choice')
      ? [focused.dataset.champion, focused.dataset.costume]
      : null;
    render();
    window.dispatchEvent(new Event('arena-rewards-updated'));
    if (!choice) return;
    const replacement = costumeRows.querySelector(`[data-champion="${choice[0]}"][data-costume="${choice[1]}"]`);
    if (replacement && !replacement.disabled) replacement.focus();
    else closeButton.focus();
  });

  window.ArenaRewards = {
    recordWin,
    setLanguage(lang) {
      if (!I18N.TEXT_LANGUAGES.includes(lang) || lang === currentLanguage) return;
      currentLanguage = lang;
      render();
    },
    getSummary() {
      const state = rewards.getState();
      return { wins: state.wins, collected: state.collected, total: STICKERS.length };
    },
  };
  render();
})();
