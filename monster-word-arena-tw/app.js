(() => {
  'use strict';

  const I18N = window.FriendlyArenaI18n;
  const game = window.FriendlyArena.createGame();
  const stage = window.FriendlyArenaStage.createArenaStage(document);
  const pageShell = document.querySelector('.page-shell');

  // Progressive reveal on first open: champion, then topic and level, then Start (which reveals the arena).
  function revealStage(name) {
    pageShell.dataset.stage = name;
  }
  const answerOptions = document.querySelector('#answerOptions');
  const questionPrompt = document.querySelector('#questionPrompt');
  const questionWord = document.querySelector('#questionWord');
  const questionPicture = document.querySelector('#questionPicture');
  const equation = document.querySelector('#equation');
  const feedback = document.querySelector('#feedback');
  const nextButton = document.querySelector('#nextButton');
  const questionPanel = document.querySelector('#questionPanel');
  const finishPanel = document.querySelector('#finishPanel');
  const arenaMessage = document.querySelector('#arenaMessage');
  const scoreStars = document.querySelector('#scoreStars');
  const scoreCount = document.querySelector('#scoreCount');
  const championCards = [...document.querySelectorAll('.champion-card')];
  const topicTabsContainer = document.querySelector('#topicTabs');
  const levelChoiceContainer = document.querySelector('#levelChoice');
  const textLanguageButtons = [...document.querySelectorAll('.text-language')];
  const speechLanguageButtons = [...document.querySelectorAll('.speech-language')];
  const speechStatus = document.querySelector('#speechStatus');
  const startRow = document.querySelector('#startRow');
  const startButton = document.querySelector('#startButton');
  const startInvite = document.querySelector('#startInvite');
  const muteButton = document.querySelector('#muteButton');
  const musicButton = document.querySelector('#musicButton');
  const heroEmoji = document.querySelector('#heroEmoji');
  const heroName = document.querySelector('#heroName');
  const buddyEmoji = document.querySelector('#buddyEmoji');
  const buddyName = document.querySelector('#buddyName');
  const rivalPower = document.querySelector('#rivalPower');
  const moveBubble = document.querySelector('#moveBubble');

  const SETTINGS_KEY = 'monsterWordArena.settings.v1';

  function loadSettings() {
    try {
      const probeKey = `${SETTINGS_KEY}.probe`;
      window.localStorage.setItem(probeKey, '1');
      window.localStorage.removeItem(probeKey);
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved === 'object') return saved;
    } catch (_error) {
      // Storage is blocked or unavailable; the game stays playable with defaults for this visit.
    }
    return {};
  }

  function saveSettings(settings) {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_error) {
      // Storage is blocked or unavailable; choices last only for this visit.
    }
  }

  const saved = loadSettings();
  let speechLanguage = I18N.TEXT_LANGUAGES.includes(saved.speechLanguage) ? saved.speechLanguage : 'en';
  let textLanguageManual = Boolean(saved.textLanguageManual);
  let textLanguage = I18N.TEXT_LANGUAGES.includes(saved.textLanguage) ? saved.textLanguage : speechLanguage;
  let speechEnabled = false;
  let speechMuted = false;
  let reactionPlaying = false;
  const reactionTurns = {};
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
    speechStatus.textContent = I18N.STRINGS.audioUnavailable[textLanguage];
  });

  function persistSettings() {
    saveSettings({ v: 1, speechLanguage, textLanguage, textLanguageManual });
  }

  function soundIsOff() {
    return !questionAudio || speechMuted || !speechEnabled;
  }

  function playCurrentQuestion() {
    const state = game.getState();
    reactionPlaying = false;
    if (!speechEnabled || speechMuted || state.finished) {
      speechPlayer.stop();
      return;
    }
    speechStatus.textContent = '';
    speechPlayer.play(state.question.audioId, speechLanguage);
  }

  // Reactions share the question's audio element, so a new clip always cuts off the last one.
  function playReaction(type) {
    if (!speechEnabled || speechMuted) {
      speechPlayer.stop();
      return;
    }
    const variants = window.FriendlyArena.REACTIONS[type];
    const turn = reactionTurns[type] || 0;
    reactionTurns[type] = turn + 1;
    reactionPlaying = true;
    speechStatus.textContent = '';
    speechPlayer.play(variants[turn % variants.length], speechLanguage);
  }

  function renderSpeechControls() {
    startRow.hidden = speechEnabled;
    speechLanguageButtons.forEach(button => {
      const selected = button.dataset.language === speechLanguage;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    textLanguageButtons.forEach(button => {
      const selected = button.dataset.textLanguage === textLanguage;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    muteButton.textContent = speechMuted ? I18N.STRINGS.unmuteButton[textLanguage] : I18N.STRINGS.muteButton[textLanguage];
    muteButton.setAttribute('aria-pressed', String(speechMuted));
    const musicOn = sounds.getState().musicOn;
    musicButton.classList.toggle('is-active', musicOn);
    musicButton.setAttribute('aria-pressed', String(musicOn));
  }

  function renderGoalMarkers(goal) {
    const compact = goal > 5;
    if (scoreStars.children.length !== goal) {
      scoreStars.replaceChildren(...Array.from({ length: goal }, () => document.createElement('span')));
    }
    scoreStars.classList.toggle('compact', compact);
    if (rivalPower.children.length !== goal) {
      rivalPower.replaceChildren(...Array.from({ length: goal }, () => document.createElement('span')));
    }
    rivalPower.classList.toggle('compact', compact);
  }

  function renderScore(state) {
    renderGoalMarkers(state.goal);
    [...scoreStars.children].forEach((star, index) => {
      star.textContent = index < state.stars ? '★' : '☆';
      star.classList.toggle('earned', index < state.stars);
    });
    scoreCount.textContent = `${state.stars} / ${state.goal}`;
    [...rivalPower.children].forEach((pip, index) => {
      pip.textContent = '⚡';
      pip.classList.toggle('spent', index >= state.rivalPower);
    });
  }

  function renderChampion(state) {
    const champion = I18N.CHAMPIONS[state.champion];
    const buddyId = state.champion === 'dino' ? 'monster' : 'dino';
    heroEmoji.textContent = state.champion === 'dino' ? '🦖' : '👾';
    heroName.textContent = champion.shortName[textLanguage];
    buddyEmoji.textContent = buddyId === 'dino' ? '🦖' : '👾';
    buddyName.textContent = champion.buddyShortName[textLanguage];
    moveBubble.textContent = state.champion === 'dino' ? '🌀' : '🫧';
    stage.setChampion(state.champion);
    championCards.forEach(card => {
      const selected = card.dataset.champion === state.champion;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
  }

  function championName(championId) {
    return document.querySelector(`[data-champion-name="${championId}"]`);
  }

  function wordLabel(option) {
    return option[textLanguage];
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
      const swatch = document.createElement('span');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = option.swatch;
      swatch.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'color-label';
      label.textContent = textLanguage === 'en' ? option.en.toLowerCase() : option[textLanguage];
      button.append(swatch, label);
    } else if (question.topic === 'math') {
      const number = document.createElement('span');
      number.className = 'number-choice';
      number.textContent = option[textLanguage];
      button.append(number);
    } else {
      const icon = document.createElement('span');
      icon.className = 'answer-icon';
      showArt(icon, option.image, option.icon, wordLabel(option));
      icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'answer-label';
      label.textContent = option[textLanguage];
      button.append(icon, label);
    }
    return button;
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function currentTarget(question) {
    return question.options.find(option => option.id === question.answerId);
  }

  function renderQuestion(state, { speak = true } = {}) {
    const question = state.question;
    const isWordTopic = question.topic !== 'math';
    const target = isWordTopic ? currentTarget(question) : null;
    const showPicture = !isWordTopic || state.level === 'easy';
    const showWord = isWordTopic && (state.level === 'harder' || (state.level === 'super' && soundIsOff()));
    const showGenericPrompt = isWordTopic && state.level === 'super' && !soundIsOff();
    const hideSentence = isWordTopic && state.level !== 'easy';

    if (showGenericPrompt) questionPrompt.textContent = I18N.STRINGS.superGenericPrompt[textLanguage];
    else if (hideSentence) questionPrompt.textContent = '';
    else questionPrompt.textContent = question[`prompt${capitalize(textLanguage)}`];
    questionPrompt.hidden = !questionPrompt.textContent;

    questionWord.textContent = showWord && target ? target[textLanguage] : '';
    questionWord.hidden = !questionWord.textContent;

    if (!showPicture) {
      questionPicture.hidden = true;
      questionPicture.replaceChildren();
    } else if (question.pictureSwatch) {
      const swatch = document.createElement('span');
      swatch.className = 'color-swatch question-swatch';
      swatch.style.backgroundColor = question.pictureSwatch;
      questionPicture.replaceChildren(swatch);
      questionPicture.hidden = false;
    } else if (question.pictureImage) {
      showArt(questionPicture, question.pictureImage, question.picture, target ? wordLabel(target) : '');
      questionPicture.hidden = false;
    } else {
      questionPicture.textContent = question.picture;
      questionPicture.hidden = !question.picture;
    }
    questionPicture.classList.toggle('dense-picture', Boolean(question.dense));

    equation.textContent = question.display;
    equation.hidden = !question.display;
    answerOptions.replaceChildren(...question.options.map(option => makeAnswerButton(option, question)));
    answerOptions.classList.toggle('four-choices', question.options.length === 4);
    answerOptions.setAttribute('aria-label', question.topic === 'math' ? I18N.STRINGS.answerGroupLabelNumber[textLanguage] : I18N.STRINGS.answerGroupLabelWord[textLanguage]);
    feedback.textContent = state.feedback === 'try-again' ? I18N.STRINGS.feedbackRetry[textLanguage] : I18N.STRINGS.feedbackDefault[textLanguage];
    feedback.classList.toggle('retry', state.feedback === 'try-again');
    nextButton.hidden = !state.solved || state.finished;
    questionPanel.hidden = state.finished;
    finishPanel.hidden = !state.finished;
    [...topicTabsContainer.children].forEach(tab => {
      const selected = tab.dataset.topic === state.topic;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
      tab.disabled = state.finished;
    });
    [...levelChoiceContainer.querySelectorAll('.level-option')].forEach(button => {
      const selected = button.dataset.level === state.level;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = state.finished;
    });
    renderScore(state);
    if (speak) playCurrentQuestion();
  }

  function spar(state) {
    const combo = window.FriendlyArenaStage.comboText(stage.powerMove(state.finished), textLanguage);
    sounds.play('whoosh', { delay: 0.05 });
    if (state.finished) sounds.play('cheer', { delay: 0.5 });
    else sounds.play('giggle', { delay: 0.25 });
    arenaMessage.textContent = I18N.sparMessage(state.champion, state.finished, combo, textLanguage);
  }

  function chooseAnswer(button, optionId) {
    const result = game.answer(optionId);
    const state = game.getState();
    if (result === 'ignored') return;
    sounds.play('tap');
    answerOptions.querySelectorAll('button').forEach(choice => choice.classList.remove('wrong-answer', 'right-answer'));

    if (result === 'try-again') {
      button.classList.add('wrong-answer');
      feedback.textContent = I18N.STRINGS.feedbackRetry[textLanguage];
      feedback.classList.add('retry');
      stage.block();
      arenaMessage.textContent = I18N.STRINGS.blockMessage[textLanguage];
      playReaction('try-again');
      sounds.play('boing', { delay: 0.04 });
      return;
    }

    playReaction(state.finished ? 'finish' : 'praise');
    button.classList.add('right-answer');
    sounds.play('sparkle', { delay: 0.03 });
    answerOptions.querySelectorAll('button').forEach(choice => { choice.disabled = true; });
    feedback.textContent = I18N.STRINGS.feedbackCorrect[textLanguage];
    feedback.classList.remove('retry');
    renderScore(state);
    spar(state);
    if (state.finished) {
      questionPanel.hidden = true;
      finishPanel.hidden = false;
      window.ArenaRewards?.recordWin(state.champion);
      [...topicTabsContainer.children, ...levelChoiceContainer.querySelectorAll('.level-option')].forEach(button => { button.disabled = true; });
      document.querySelector('#playAgainButton').focus();
    } else {
      nextButton.hidden = false;
      nextButton.focus();
    }
  }

  function enableSpeech() {
    revealStage('play');
    if (speechEnabled) return;
    speechEnabled = true;
    renderSpeechControls();
    renderQuestion(game.getState(), { speak: false });
    if (speechMuted) {
      speechStatus.textContent = I18N.STRINGS.soundMuted[textLanguage];
      return;
    }
    playCurrentQuestion();
  }

  startButton.addEventListener('click', enableSpeech);

  speechLanguageButtons.forEach(button => button.addEventListener('click', () => {
    speechLanguage = button.dataset.language;
    if (!textLanguageManual) textLanguage = speechLanguage;
    persistSettings();
    renderChrome();
    if (!speechEnabled) {
      enableSpeech();
      return;
    }
    renderQuestion(game.getState(), { speak: false });
    renderSpeechControls();
    if (speechMuted) {
      speechStatus.textContent = I18N.STRINGS.soundMuted[textLanguage];
      return;
    }
    playCurrentQuestion();
  }));

  textLanguageButtons.forEach(button => button.addEventListener('click', () => {
    textLanguage = button.dataset.textLanguage;
    textLanguageManual = true;
    persistSettings();
    renderChrome();
    renderChampion(game.getState());
    renderQuestion(game.getState(), { speak: false });
  }));

  document.querySelector('#replayPromptButton').addEventListener('click', () => {
    if (!speechEnabled) {
      enableSpeech();
      return;
    }
    playCurrentQuestion();
  });

  muteButton.addEventListener('click', () => {
    speechMuted = !speechMuted;
    renderSpeechControls();
    sounds.setMuted(speechMuted);
    if (speechMuted) {
      speechPlayer.stop();
      speechStatus.textContent = I18N.STRINGS.soundMuted[textLanguage];
      renderQuestion(game.getState(), { speak: false });
      return;
    }
    if (!speechEnabled) {
      enableSpeech();
      return;
    }
    renderSpeechControls();
    speechStatus.textContent = '';
    renderQuestion(game.getState(), { speak: false });
    playCurrentQuestion();
  });

  musicButton.addEventListener('click', () => {
    sounds.setMusic(!sounds.getState().musicOn);
    renderSpeechControls();
    if (speechMuted) speechStatus.textContent = I18N.STRINGS.soundMuted[textLanguage];
  });

  championCards.forEach(card => card.addEventListener('click', () => {
    if (!game.chooseChampion(card.dataset.champion)) return;
    if (reactionPlaying) speechPlayer.stop();
    reactionPlaying = false;
    sounds.play('tap');
    renderChampion(game.getState());
    arenaMessage.textContent = I18N.championReady(card.dataset.champion, textLanguage);
    if (pageShell.dataset.stage === 'champion') revealStage('choose');
  }));

  function buildTopicTabs() {
    topicTabsContainer.replaceChildren(...window.FriendlyArena.TOPICS.map(topic => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'topic-tab';
      tab.dataset.topic = topic;
      tab.setAttribute('aria-pressed', 'false');
      const emoji = document.createElement('span');
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = I18N.TOPIC_NAMES[topic].emoji;
      const name = document.createElement('span');
      name.dataset.role = 'name';
      tab.append(emoji, name);
      tab.addEventListener('click', () => {
        if (!game.chooseTopic(topic)) return;
        sounds.play('tap');
        stage.settle();
        arenaMessage.textContent = I18N.topicChosenMessage(topic, textLanguage);
        renderQuestion(game.getState());
      });
      return tab;
    }));
  }

  function buildLevelButtons() {
    const buttons = window.FriendlyArena.LEVELS.map(level => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-option';
      button.dataset.level = level;
      button.setAttribute('aria-pressed', 'false');
      const emoji = document.createElement('span');
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = I18N.LEVEL_NAMES[level].emoji;
      const name = document.createElement('span');
      name.dataset.role = 'name';
      button.append(emoji, document.createTextNode(' '), name);
      button.addEventListener('click', () => {
        if (!game.chooseLevel(level)) return;
        stage.settle();
        arenaMessage.textContent = I18N.levelChosenMessage(level, textLanguage);
        renderQuestion(game.getState());
      });
      return button;
    });
    levelChoiceContainer.append(...buttons);
  }

  function renderChrome() {
    document.documentElement.lang = textLanguage === 'zh' ? 'zh-Hant-TW' : textLanguage === 'ja' ? 'ja' : 'en';
    const S = I18N.STRINGS;
    document.querySelector('#galleryLink').textContent = S.galleryLink[textLanguage];
    document.querySelector('#topLabel').textContent = S.topLabel[textLanguage];
    document.querySelector('#restartButton').textContent = S.restartButton[textLanguage];
    document.querySelector('#eyebrow').textContent = S.eyebrow[textLanguage];
    document.querySelector('#gameTitle').textContent = S.gameTitle[textLanguage];
    document.querySelector('#introBody').textContent = S.introBody[textLanguage];
    document.querySelector('#championSection').setAttribute('aria-label', S.championSectionLabel[textLanguage]);
    document.querySelector('#championKicker').textContent = S.championKicker[textLanguage];
    document.querySelector('#championHeading').textContent = S.championHeading[textLanguage];
    document.querySelector('#championSoftNote').textContent = S.championSoftNote[textLanguage];
    document.querySelector('#startButton').textContent = S.startButton[textLanguage];
    document.querySelector('#startInvite').textContent = S.startInvite[textLanguage];
    document.querySelector('#textLabel').textContent = S.textLabel[textLanguage];
    document.querySelector('#arenaLayoutSection').setAttribute('aria-label', S.arenaLayoutLabel[textLanguage]);
    document.querySelector('#arenaHeading').textContent = S.arenaHeading[textLanguage];
    document.querySelector('#heroSide').textContent = S.heroSide[textLanguage];
    document.querySelector('#buddySide').textContent = S.buddySide[textLanguage];
    document.querySelector('#teamStarsLabel').textContent = S.teamStars[textLanguage];
    document.querySelector('#challengeKicker').textContent = S.challengeKicker[textLanguage];
    document.querySelector('#challengeHeading').textContent = S.challengeHeading[textLanguage];
    topicTabsContainer.setAttribute('aria-label', S.topicTabsLabel[textLanguage]);
    levelChoiceContainer.setAttribute('aria-label', S.levelGroupLabel[textLanguage]);
    document.querySelector('#levelLabel').textContent = S.levelLabel[textLanguage];
    document.querySelector('.speech-languages').setAttribute('aria-label', S.voiceGroupLabel[textLanguage]);
    document.querySelector('#voiceLabel').textContent = S.voiceLabel[textLanguage];
    document.querySelector('.speech-playback').setAttribute('aria-label', S.soundControlsLabel[textLanguage]);
    document.querySelector('#replayPromptButton').textContent = S.replayButton[textLanguage];
    document.querySelector('#musicButton').textContent = S.musicButton[textLanguage];
    document.querySelector('#answerHint').textContent = S.answerHint[textLanguage];
    document.querySelector('#finishTitle').textContent = S.finishHeading[textLanguage];
    document.querySelector('#finishBody').textContent = S.finishBody[textLanguage];
    document.querySelector('#playAgainButton').replaceChildren(document.createTextNode(`${S.playAgainButton[textLanguage]} `), (() => { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = '↻'; return s; })());
    document.querySelector('#footer').textContent = S.footer[textLanguage];
    document.querySelector('#nextButton').replaceChildren(document.createTextNode(`${S.nextButton[textLanguage]} `), (() => { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = '➜'; return s; })());

    [...topicTabsContainer.children].forEach(tab => {
      tab.querySelector('[data-role="name"]').textContent = I18N.TOPIC_NAMES[tab.dataset.topic][textLanguage];
    });
    [...levelChoiceContainer.querySelectorAll('.level-option')].forEach(button => {
      button.querySelector('[data-role="name"]').textContent = I18N.LEVEL_NAMES[button.dataset.level][textLanguage];
    });
    ['dino', 'monster'].forEach(id => {
      const label = championName(id);
      if (label) label.textContent = I18N.CHAMPIONS[id].name[textLanguage];
    });
    renderSpeechControls();
  }

  nextButton.addEventListener('click', () => {
    game.nextQuestion();
    sounds.play('tap');
    stage.settle();
    arenaMessage.textContent = I18N.STRINGS.yourTurnMessage[textLanguage];
    renderQuestion(game.getState());
    answerOptions.querySelector('button')?.focus();
  });

  function restart() {
    const state = game.restart();
    sounds.play('tap');
    stage.startMatch();
    arenaMessage.textContent = I18N.STRINGS.readyMessage[textLanguage];
    renderChampion(state);
    renderQuestion(state, { speak: speechEnabled });
    answerOptions.querySelector('button')?.focus();
  }

  document.querySelector('#restartButton').addEventListener('click', restart);
  document.querySelector('#playAgainButton').addEventListener('click', restart);

  buildTopicTabs();
  buildLevelButtons();
  renderChrome();
  arenaMessage.textContent = I18N.STRINGS.readyMessage[textLanguage];
  const initialState = game.getState();
  renderChampion(initialState);
  renderSpeechControls();
  renderQuestion(initialState, { speak: false });
})();
