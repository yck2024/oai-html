(() => {
  'use strict';

  const game = window.FriendlyArena.createGame();
  const answerOptions = document.querySelector('#answerOptions');
  const questionEnglish = document.querySelector('#questionEnglish');
  const questionChinese = document.querySelector('#questionChinese');
  const questionPicture = document.querySelector('#questionPicture');
  const equation = document.querySelector('#equation');
  const feedback = document.querySelector('#feedback');
  const nextButton = document.querySelector('#nextButton');
  const questionPanel = document.querySelector('#questionPanel');
  const finishPanel = document.querySelector('#finishPanel');
  const arenaStage = document.querySelector('#arenaStage');
  const arenaMessage = document.querySelector('#arenaMessage');
  const scoreStars = document.querySelector('#scoreStars');
  const scoreCount = document.querySelector('#scoreCount');
  const championCards = [...document.querySelectorAll('.champion-card')];
  const topicTabs = [...document.querySelectorAll('.topic-tab')];
  const speechLanguageButtons = [...document.querySelectorAll('.speech-language')];
  const speechStatus = document.querySelector('#speechStatus');
  const muteButton = document.querySelector('#muteButton');
  const musicButton = document.querySelector('#musicButton');
  const heroEmoji = document.querySelector('#heroEmoji');
  const heroName = document.querySelector('#heroName');
  const buddyEmoji = document.querySelector('#buddyEmoji');
  const buddyName = document.querySelector('#buddyName');
  const rivalPower = document.querySelector('#rivalPower');
  const moveBubble = document.querySelector('#moveBubble');

  const CHAMPIONS = {
    dino: { name: 'Rex', nameZh: '雷克斯', emoji: '🦖', move: 'Tail Swish', moveZh: '甩尾巴', moveEmoji: '🌀', buddy: 'Bobo', buddyZh: '波波', buddyEmoji: '👾' },
    monster: { name: 'Bobo', nameZh: '波波', emoji: '👾', move: 'Bubble Blast', moveZh: '泡泡砲', moveEmoji: '🫧', buddy: 'Rex', buddyZh: '雷克斯', buddyEmoji: '🦖' },
  };
  const TOPIC_NAMES = { math: 'Math', colors: 'Colors', face: 'Face', family: 'Family' };
  let speechLanguage = 'en';
  let speechEnabled = false;
  let speechMuted = false;
  let questionAudio = null;
  try {
    if (typeof Audio !== 'undefined') {
      questionAudio = new Audio();
      questionAudio.preload = 'auto';
    }
  } catch (_error) {
    questionAudio = null;
  }
  // Effects and music use Web Audio, a separate channel from the speech element, so they never cut off a clip.
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const sounds = window.FriendlyArenaSounds.createSoundBoard(AudioContextClass ? () => new AudioContextClass() : null);
  ['playing', 'pause', 'ended', 'error', 'emptied'].forEach(type => questionAudio?.addEventListener?.(type, () => {
    sounds.setSpeaking(type === 'playing');
  }));
  document.addEventListener?.('visibilitychange', () => sounds.setHidden(document.hidden));
  const speechPlayer = window.FriendlyArena.createSpeechPlayer(questionAudio, () => {
    speechStatus.textContent = 'Audio is unavailable. You can still tap an answer. · 目前無法播放語音，仍可點選答案。 · 音声が再生できなくても、答えをタップできます。';
  });

  function playCurrentQuestion() {
    const state = game.getState();
    if (!speechEnabled || speechMuted || state.finished) return;
    speechStatus.textContent = '';
    speechPlayer.play(state.question.audioId, speechLanguage);
  }

  function renderSpeechControls() {
    speechLanguageButtons.forEach(button => {
      const selected = button.dataset.language === speechLanguage;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    muteButton.textContent = speechMuted ? '🔇 Unmute' : '🔊 Mute';
    muteButton.setAttribute('aria-pressed', String(speechMuted));
    const musicOn = sounds.getState().musicOn;
    musicButton.classList.toggle('is-active', musicOn);
    musicButton.setAttribute('aria-pressed', String(musicOn));
  }

  function renderScore(state) {
    [...scoreStars.children].forEach((star, index) => {
      star.textContent = index < state.stars ? '★' : '☆';
      star.classList.toggle('earned', index < state.stars);
    });
    scoreCount.textContent = `${state.stars} / ${window.FriendlyArena.GOAL}`;
    [...rivalPower.children].forEach((pip, index) => {
      pip.classList.toggle('spent', index >= state.rivalPower);
    });
  }

  function renderChampion(state) {
    const champion = CHAMPIONS[state.champion];
    heroEmoji.textContent = champion.emoji;
    heroName.textContent = champion.name;
    buddyEmoji.textContent = champion.buddyEmoji;
    buddyName.textContent = champion.buddy;
    moveBubble.textContent = champion.moveEmoji;
    championCards.forEach(card => {
      const selected = card.dataset.champion === state.champion;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
  }

  function wordLabel(option) {
    return `${option.zh} ${option.en}`;
  }

  function showArt(holder, image, fallback, label) {
    const art = document.createElement('img');
    art.addEventListener('error', () => art.replaceWith(fallback));
    art.className = 'word-art';
    art.alt = label;
    art.draggable = false;
    art.width = 192;
    art.height = 192;
    art.decoding = 'async';
    art.src = image;
    holder.replaceChildren(art);
  }

  function makeAnswerButton(option, question) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.dataset.choice = option.id;
    button.addEventListener('click', () => chooseAnswer(button, option.id));

    if (question.topic === 'colors') {
      button.classList.add('color-option');
      const swatch = document.createElement('span');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = option.swatch;
      swatch.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'color-label';
      label.textContent = `${option.zh} ${option.en.toLowerCase()}`;
      button.append(swatch, label);
    } else if (question.topic === 'math') {
      const number = document.createElement('span');
      number.className = 'number-choice';
      number.textContent = option.zh;
      button.append(number);
    } else {
      const icon = document.createElement('span');
      icon.className = 'answer-icon';
      showArt(icon, option.image, option.icon, wordLabel(option));
      icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'answer-label';
      label.append(document.createTextNode(option.zh));
      const english = document.createElement('small');
      english.textContent = option.en;
      label.append(english);
      button.append(icon, label);
    }
    return button;
  }

  function renderQuestion(state, { speak = true } = {}) {
    const question = state.question;
    questionEnglish.textContent = question.promptEn;
    questionChinese.textContent = question.promptZh;
    if (question.pictureImage) showArt(questionPicture, question.pictureImage, question.picture, wordLabel(question.options.find(option => option.id === question.answerId)));
    else questionPicture.textContent = question.picture;
    questionPicture.hidden = !question.picture;
    equation.textContent = question.display;
    equation.hidden = !question.display;
    answerOptions.replaceChildren(...question.options.map(option => makeAnswerButton(option, question)));
    answerOptions.setAttribute('aria-label', question.topic === 'math' ? 'Choose a number 選一個數字' : 'Choose a word 選一個詞');
    feedback.textContent = state.feedback === 'try-again' ? 'That’s okay! Let’s try another one. 沒關係，再試一次！' : 'No rush—thinking is a superpower! 慢慢想，你最棒！';
    feedback.classList.toggle('retry', state.feedback === 'try-again');
    nextButton.hidden = !state.solved || state.finished;
    questionPanel.hidden = state.finished;
    finishPanel.hidden = !state.finished;
    topicTabs.forEach(tab => {
      const selected = tab.dataset.topic === state.topic;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
      tab.disabled = state.finished;
    });
    renderScore(state);
    if (speak) playCurrentQuestion();
  }

  function spar(state) {
    const champion = CHAMPIONS[state.champion];
    arenaStage.classList.remove('do-spar', 'thinking');
    void arenaStage.offsetWidth;
    arenaStage.classList.add('do-spar');
    sounds.play('whoosh', { delay: 0.05 });
    if (state.finished) sounds.play('cheer', { delay: 0.5 });
    else sounds.play('giggle', { delay: 0.25 });
    arenaMessage.textContent = state.finished
      ? `${champion.buddy} is out of power—bow and high-five! ${champion.buddyZh}沒電了，鞠躬擊掌！`
      : `${champion.name} used ${champion.move}! ${champion.buddy} wobbles and giggles! ${champion.nameZh}${champion.moveZh}！${champion.buddyZh}晃一晃，哈哈笑！`;
  }

  function chooseAnswer(button, optionId) {
    const result = game.answer(optionId);
    const state = game.getState();
    if (result === 'ignored') return;
    sounds.play('tap');
    answerOptions.querySelectorAll('button').forEach(choice => choice.classList.remove('wrong-answer', 'right-answer'));

    if (result === 'try-again') {
      button.classList.add('wrong-answer');
      feedback.textContent = 'That’s okay! Let’s try another one. 沒關係，再試一次！';
      feedback.classList.add('retry');
      arenaStage.classList.remove('do-spar', 'thinking');
      void arenaStage.offsetWidth;
      arenaStage.classList.add('thinking');
      arenaMessage.textContent = 'Pillow block! Let’s think together! 枕頭擋住了！我們一起想一想！';
      sounds.play('boing', { delay: 0.04 });
      return;
    }

    speechPlayer.stop();
    button.classList.add('right-answer');
    sounds.play('sparkle', { delay: 0.03 });
    answerOptions.querySelectorAll('button').forEach(choice => { choice.disabled = true; });
    feedback.textContent = 'You got it! Power move! 答對了！出招成功！';
    feedback.classList.remove('retry');
    renderScore(state);
    spar(state);
    if (state.finished) {
      questionPanel.hidden = true;
      finishPanel.hidden = false;
      topicTabs.forEach(tab => { tab.disabled = true; });
      document.querySelector('#playAgainButton').focus();
    } else {
      nextButton.hidden = false;
      nextButton.focus();
    }
  }

  speechLanguageButtons.forEach(button => button.addEventListener('click', () => {
    speechLanguage = button.dataset.language;
    speechEnabled = true;
    renderSpeechControls();
    if (speechMuted) {
      speechStatus.textContent = 'Sound is muted. · 聲音已靜音。 · 音声はミュート中です。';
      return;
    }
    playCurrentQuestion();
  }));

  document.querySelector('#replayPromptButton').addEventListener('click', () => {
    speechEnabled = true;
    playCurrentQuestion();
  });

  muteButton.addEventListener('click', () => {
    speechMuted = !speechMuted;
    renderSpeechControls();
    sounds.setMuted(speechMuted);
    if (speechMuted) {
      speechPlayer.stop();
      speechStatus.textContent = 'Sound is muted. · 聲音已靜音。 · 音声はミュート中です。';
      return;
    }
    speechEnabled = true;
    speechStatus.textContent = '';
    playCurrentQuestion();
  });

  musicButton.addEventListener('click', () => {
    sounds.setMusic(!sounds.getState().musicOn);
    renderSpeechControls();
    if (speechMuted) speechStatus.textContent = 'Sound is muted. · 聲音已靜音。 · 音声はミュート中です。';
  });

  championCards.forEach(card => card.addEventListener('click', () => {
    if (!game.chooseChampion(card.dataset.champion)) return;
    sounds.play('tap');
    renderChampion(game.getState());
    arenaMessage.textContent = `${CHAMPIONS[card.dataset.champion].name} is ready to spar! ${CHAMPIONS[card.dataset.champion].emoji}`;
  }));

  topicTabs.forEach(tab => tab.addEventListener('click', () => {
    if (!game.chooseTopic(tab.dataset.topic)) return;
    sounds.play('tap');
    arenaStage.classList.remove('thinking', 'do-spar');
    arenaMessage.textContent = `${TOPIC_NAMES[tab.dataset.topic]} challenge—your turn!`;
    renderQuestion(game.getState());
  }));

  nextButton.addEventListener('click', () => {
    game.nextQuestion();
    sounds.play('tap');
    arenaStage.classList.remove('thinking', 'do-spar');
    arenaMessage.textContent = 'Your turn, team!';
    renderQuestion(game.getState());
    answerOptions.querySelector('button')?.focus();
  });

  function restart() {
    const state = game.restart();
    sounds.play('tap');
    arenaStage.classList.remove('thinking', 'do-spar');
    arenaMessage.textContent = 'Ready, team? Pick any challenge!';
    renderChampion(state);
    renderQuestion(state);
    answerOptions.querySelector('button')?.focus();
  }

  document.querySelector('#restartButton').addEventListener('click', restart);
  document.querySelector('#playAgainButton').addEventListener('click', restart);

  const initialState = game.getState();
  renderChampion(initialState);
  renderSpeechControls();
  renderQuestion(initialState, { speak: false });
})();
