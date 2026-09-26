(() => {
  'use strict';

  const { STICKERS, createRewards } = window.ArenaRewardsCore;
  const CHAMPIONS = {
    dino: { name: 'Rex', nameZh: '雷克斯' },
    monster: { name: 'Bobo', nameZh: '波波' },
  };

  function deviceStorage() {
    try {
      const storage = window.localStorage;
      const probe = `${window.ArenaRewardsCore.STORAGE_KEY}.probe`;
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

  function label(item) {
    return `${item.zh} ${item.en}`;
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
      ? ` · Next surprise: ${next.en} in ${next.winsToGo} ${next.winsToGo === 1 ? 'win' : 'wins'} · 再贏 ${next.winsToGo} 次拿${next.zh}`
      : ' · All costumes unlocked! · 服裝全部拿到了！';
    summary.textContent = `📒 ${state.collected} / ${total} stickers · 貼紙${hint}`;
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
      text.textContent = `Sticker ${index + 1}: still to find · 第 ${index + 1} 張：還沒拿到`;
      slot.append(mark, text);
      return slot;
    }
    const name = document.createElement('span');
    name.className = 'sticker-name';
    name.append(document.createTextNode(sticker.zh));
    const english = document.createElement('small');
    english.textContent = sticker.en;
    name.append(english);
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
    const [mainWord, smallWord] = !costume ? ['不戴', 'None']
      : costume.unlocked ? [costume.zh, costume.en] : [`贏 ${costume.unlockAt} 次`, `${costume.unlockAt} wins`];
    const small = document.createElement('small');
    small.textContent = smallWord;
    text.append(document.createTextNode(mainWord), small);
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
      hint.textContent = `${costume.en} surprise · ${costume.zh}驚喜`;
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
    bookIntro.textContent = state.wins
      ? `You won ${state.wins} ${state.wins === 1 ? 'match' : 'matches'}! Every win brings a sticker. · 你贏了 ${state.wins} 場！每贏一場就有一張貼紙。`
      : 'Win a match to get your first sticker! · 贏一場就能拿到第一張貼紙！';
    stickerGrid.replaceChildren(...state.stickers.map(stickerSlot));
    costumeRows.replaceChildren(...Object.entries(CHAMPIONS).map(([champion, names]) => {
      const row = document.createElement('div');
      row.className = 'costume-row';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', `${names.name}'s costume · ${names.nameZh}的服裝`);
      const heading = document.createElement('span');
      heading.className = 'costume-row-name';
      heading.textContent = `${names.name} ${names.nameZh}`;
      const options = document.createElement('div');
      options.className = 'costume-options';
      options.append(costumeButton(champion, null, state.wearing[champion]),
        ...state.costumes.map(costume => costumeButton(champion, costume, state.wearing[champion])));
      row.append(heading, options);
      return row;
    }));
    saveNote.textContent = state.persistent
      ? 'Saved on this device only: the number of wins and each champion’s costume. · 只存在這台裝置：贏的次數和服裝。'
      : 'This browser can’t save, so stickers last for this visit. · 這個瀏覽器無法儲存，貼紙只保留到這次遊玩結束。';
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
    else book.removeAttribute('open');
  }

  function rewardNote(result, champion) {
    const note = document.createElement('div');
    note.className = 'reward-note';
    note.id = 'rewardNote';
    note.setAttribute('role', 'status');
    const text = document.createElement('p');
    text.className = 'reward-text';
    const title = document.createElement('strong');
    title.textContent = result.firstTime ? 'New sticker! 新貼紙！' : 'Another sticker! 又一張貼紙！';
    text.append(title, document.createTextNode(` ${result.sticker.en} · ${result.sticker.zh}`));
    note.append(picture(result.sticker, 'reward-sticker'), text);
    if (result.unlocked) {
      const unlock = document.createElement('p');
      unlock.className = 'reward-unlock';
      const names = CHAMPIONS[champion] || CHAMPIONS.dino;
      unlock.textContent = `🎁 ${names.name} gets a ${result.unlocked.en} to wear! ${names.nameZh}戴上${result.unlocked.zh}了！`;
      note.append(unlock);
    }
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'reward-book-link';
    open.textContent = '📒 Open sticker book · 打開貼紙本';
    open.addEventListener('click', openBook);
    note.append(open);
    return note;
  }

  function recordWin(champion) {
    const result = rewards.recordWin(champion);
    render();
    const finishPanel = $('#finishPanel');
    if (finishPanel) {
      finishPanel.querySelector('#rewardNote')?.remove();
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
    resetStatus.textContent = 'Sticker book cleared. · 貼紙本已清空。';
    resetButton.focus();
  });
  // Runs after app.js's own champion listener, so the selected card is already updated.
  document.querySelectorAll('.champion-card').forEach(card => card.addEventListener('click', render));

  window.ArenaRewards = { recordWin, openBook };
  render();
})();
