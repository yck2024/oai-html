(() => {
  'use strict';

  const I18N = window.FriendlyArenaI18n;
  const { bilingualNode, setBilingual } = I18N;
  const PACING = window.FriendlyArenaPacing;
  const game = window.FriendlyArena.createGame();
  const stage = window.FriendlyArenaStage.createArenaStage(document);
  const pageShell = document.querySelector('.page-shell');

  // Progressive reveal on first open: champion, then topic and level, then Start (which reveals the arena).
  function revealStage(name) {
    pageShell.dataset.stage = name;
  }

  // Rex or Bobo point at (or bounce toward) whatever the child should tap next, with a short chime.
  let currentPointer = null;
  function setPointer(key) {
    if (key === currentPointer) return;
    currentPointer = key;
    pageShell.dataset.pointer = key || '';
    if (key) sounds.play('chime');
  }
  const answerOptions = document.querySelector('#answerOptions');
  const faceDiagram = document.querySelector('#faceDiagram');
  const diagramStage = document.querySelector('#diagramStage');
  const diagramArt = document.querySelector('#diagramArt');
  const diagramItems = document.querySelector('#diagramItems');
  const diagramMarks = document.querySelector('#diagramMarks');
  const diagramSpots = document.querySelector('#diagramSpots');
  const diagramWord = document.querySelector('#diagramWord');
  const questionPrompt = document.querySelector('#questionPrompt');
  const questionWord = document.querySelector('#questionWord');
  const questionPicture = document.querySelector('#questionPicture');
  const equation = document.querySelector('#equation');
  const feedback = document.querySelector('#feedback');
  const nextButton = document.querySelector('#nextButton');
  const questionPanel = document.querySelector('#questionPanel');
  const finishPanel = document.querySelector('#finishPanel');
  const lostPanel = document.querySelector('#lostPanel');
  const tryAgainButton = document.querySelector('#tryAgainButton');
  const heartMeter = document.querySelector('#heartMeter');
  const heartPips = document.querySelector('#heartPips');
  const heartFloat = document.querySelector('#heartFloat');
  const arenaMessage = document.querySelector('#arenaMessage');
  const scoreStars = document.querySelector('#scoreStars');
  const scoreCount = document.querySelector('#scoreCount');
  const championCards = [...document.querySelectorAll('.champion-card')];
  const topicTabsContainer = document.querySelector('#topicTabs');
  const levelChoiceContainer = document.querySelector('#levelChoice');
  const textLanguageButtons = [...document.querySelectorAll('.text-language')];
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
  const playAgainButton = document.querySelector('#playAgainButton');
  const breakPrompt = document.querySelector('#breakPrompt');
  const oneMoreRoundButton = document.querySelector('#oneMoreRoundButton');
  const takeBreakButton = document.querySelector('#takeBreakButton');
  const goodbyePanel = document.querySelector('#goodbyePanel');
  const goodbyeBody = document.querySelector('#goodbyeBody');
  const backToPlayButton = document.querySelector('#backToPlayButton');
  const pointerEmojis = ['pointStartEmoji', 'pointAnswerEmoji', 'pointNextEmoji', 'pointFinishEmoji', 'pointLostEmoji', 'pointBreakEmoji', 'pointGoodbyeEmoji']
    .map(id => document.querySelector(`#${id}`)).filter(Boolean);

  // Grown-up settings: a header icon, gated by a simple math check, away from the main play path.
  const settingsButton = document.querySelector('#settingsButton');
  const settingsDialog = document.querySelector('#settingsDialog');
  const settingsGate = document.querySelector('#settingsGate');
  const settingsBody = document.querySelector('#settingsBody');
  const gateQuestion = document.querySelector('#gateQuestion');
  const gateInput = document.querySelector('#gateInput');
  const gateStatus = document.querySelector('#gateStatus');
  const gateCancelButton = document.querySelector('#gateCancelButton');
  const gateSubmitButton = document.querySelector('#gateSubmitButton');
  const settingsCloseButton = document.querySelector('#settingsCloseButton');
  const levelLockOptions = document.querySelector('#levelLockOptions');
  const secondLanguageOptions = document.querySelector('#secondLanguageOptions');
  const echoLanguageOptions = document.querySelector('#echoLanguageOptions');
  const echoButton = document.querySelector('#echoButton');
  const echoWord = document.querySelector('#echoWord');
  const voiceLanguageOptions = document.querySelector('#voiceLanguageOptions');
  const settingsMuteButton = document.querySelector('#settingsMuteButton');
  const settingsRewardSummary = document.querySelector('#settingsRewardSummary');

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

  // v1 saved a separate voice language, a separate text language, and whether the text language
  // had been set manually. v2 has one main language that sets both text and (by default) voice:
  // an old saved text language becomes the new main language, and an old voice language that
  // differed from it becomes a grown-up voice override; otherwise the voice follows the language.
  function migrateSettings(raw) {
    const validLanguage = language => I18N.TEXT_LANGUAGES.includes(language);
    if (raw.v === 2) {
      const textLanguage = validLanguage(raw.textLanguage) ? raw.textLanguage : 'en';
      return {
        textLanguage,
        secondLanguage: validLanguage(raw.secondLanguage) ? raw.secondLanguage : null,
        secondLanguageManual: Boolean(raw.secondLanguageManual),
        voiceOverride: Boolean(raw.voiceOverride),
        voiceLanguage: validLanguage(raw.voiceLanguage) ? raw.voiceLanguage : textLanguage,
        echoLanguage: validLanguage(raw.echoLanguage) ? raw.echoLanguage : null,
        speechMuted: Boolean(raw.speechMuted),
        allowedLevels: raw.allowedLevels,
      };
    }
    const textLanguage = validLanguage(raw.textLanguage)
      ? raw.textLanguage
      : validLanguage(raw.speechLanguage) ? raw.speechLanguage : 'en';
    const priorVoice = validLanguage(raw.speechLanguage) ? raw.speechLanguage : textLanguage;
    const voiceOverride = priorVoice !== textLanguage;
    return {
      textLanguage,
      secondLanguage: I18N.DEFAULT_SECOND_LANGUAGE[textLanguage],
      secondLanguageManual: false,
      voiceOverride,
      voiceLanguage: voiceOverride ? priorVoice : textLanguage,
      echoLanguage: null,
      speechMuted: Boolean(raw.speechMuted),
      allowedLevels: raw.allowedLevels,
    };
  }

  const saved = migrateSettings(loadSettings());
  let textLanguage = saved.textLanguage;
  let secondLanguage = saved.secondLanguage;
  let secondLanguageManual = saved.secondLanguageManual;
  let voiceOverride = saved.voiceOverride;
  let voiceLanguage = voiceOverride ? saved.voiceLanguage : textLanguage;
  // Off (null) until a grown-up picks one: after a right answer the word is also said in this second spoken
  // language. It is never the narration voice itself, so it is cleared whenever the voice becomes that language.
  let echoLanguage = saved.echoLanguage;
  function reconcileEchoLanguage() {
    if (echoLanguage === voiceLanguage) echoLanguage = null;
  }
  reconcileEchoLanguage();
  // Resolved before rewards-app.js loads, so it can pick up the saved text language on first render.
  window.FriendlyArenaCurrentTextLanguage = () => textLanguage;
  window.FriendlyArenaCurrentSecondLanguage = () => secondLanguage;
  let speechEnabled = false;
  let speechMuted = saved.speechMuted;
  let allowedLevels = PACING.sanitizeAllowedLevels(saved.allowedLevels);
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
  sounds.setMuted(speechMuted);
  const breakPacer = PACING.createBreakPacer();
  ['playing', 'pause', 'ended', 'error', 'emptied'].forEach(type => questionAudio?.addEventListener?.(type, () => {
    sounds.setSpeaking(type === 'playing');
  }));
  document.addEventListener?.('visibilitychange', () => sounds.setHidden(document.hidden));
  const speechPlayer = window.FriendlyArena.createSpeechPlayer(questionAudio, () => {
    speechStatus.textContent = I18N.STRINGS.audioUnavailable[textLanguage];
  });

  function persistSettings() {
    saveSettings({ v: 2, textLanguage, secondLanguage, secondLanguageManual, voiceOverride, voiceLanguage, echoLanguage, speechMuted, allowedLevels });
  }

  // A STRINGS entry's text in the current second language, or null when there is none chosen.
  function secondOf(entry) {
    return secondLanguage ? entry[secondLanguage] : null;
  }

  function soundIsOff() {
    return !questionAudio || speechMuted || !speechEnabled;
  }

  function playCurrentQuestion() {
    const state = game.getState();
    // While a missed question waits to be replaced, its narration (and the reaction) is left alone.
    if (state.missed) return;
    reactionPlaying = false;
    if (!speechEnabled || speechMuted || state.finished) {
      speechPlayer.stop();
      return;
    }
    speechStatus.textContent = '';
    speechPlayer.play(state.question.audioId, voiceLanguage);
  }

  // The item the child just answered (or should tap after a miss) pulses while its word is said.
  function echoTargets() {
    return [
      ...choiceButtons().filter(choice => choice.classList.contains('right-answer')),
      ...[...diagramMarks.children].filter(ring => ring.classList.contains('right-ring')),
    ];
  }

  function setEchoPulse(on) {
    echoTargets().forEach(target => target.classList.toggle('is-echoing', on));
  }

  // The word said alone (never a sentence) for the answered question: in the narration voice, then, after a
  // right answer and only when a grown-up turned it on, in the second spoken language. `done` runs when it ends.
  function echoSteps(state, { second = false, done = null } = {}) {
    const audioId = state.question.wordAudioId;
    if (!audioId) return [];
    const languages = [voiceLanguage, ...(second && echoLanguage ? [echoLanguage] : [])];
    return languages.map((language, index) => ({
      audioId,
      language,
      onStart: () => setEchoPulse(true),
      onEnd: () => {
        setEchoPulse(false);
        if (index === languages.length - 1) done?.();
      },
    }));
  }

  // A miss keeps its pause for the clips to finish: the wait starts over when the word has been said.
  function echoDone() {
    if (missTimer !== null) armMissFallback(game.getState());
  }

  // Reactions share the question's audio element, so a new clip always cuts off the last one. After an answer the
  // word is echoed right behind the reaction, in the same queue; the next question (or a tap) cuts what is left.
  function playReaction(type, { echo = null, onEchoDone = null } = {}) {
    if (!speechEnabled || speechMuted) {
      speechPlayer.stop();
      return;
    }
    const variants = window.FriendlyArena.REACTIONS[type];
    const turn = reactionTurns[type] || 0;
    reactionTurns[type] = turn + 1;
    reactionPlaying = true;
    speechStatus.textContent = '';
    speechPlayer.playSequence([
      { audioId: variants[turn % variants.length], language: voiceLanguage },
      ...(echo ? echoSteps(game.getState(), { ...echo, done: onEchoDone || echoDone }) : []),
    ]);
  }

  // The small button after an answer: the word again (and, after a right answer, the second language too).
  function renderEchoButton(state) {
    const question = state.question;
    const target = question.wordAudioId ? currentTarget(question) : null;
    const show = Boolean(target) && (state.solved || state.missed) && !soundIsOff();
    echoWord.textContent = show ? target[textLanguage] : '';
    echoButton.hidden = !show;
    echoButton.setAttribute('aria-label', show ? `${I18N.STRINGS.echoReplayLabel[textLanguage]}: ${target[textLanguage]}` : '');
  }

  let pendingFinish = null;
  echoButton.addEventListener('click', () => {
    const state = game.getState();
    if (!(state.solved || state.missed) || soundIsOff()) return;
    reactionPlaying = false;
    speechPlayer.playSequence(echoSteps(state, { second: state.solved, done: pendingFinish || echoDone }));
  });

  function renderSpeechControls() {
    startRow.hidden = speechEnabled;
    textLanguageButtons.forEach(button => {
      const selected = button.dataset.textLanguage === textLanguage;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const muteEntry = speechMuted ? I18N.STRINGS.unmuteButton : I18N.STRINGS.muteButton;
    setBilingual(muteButton, muteEntry[textLanguage], secondOf(muteEntry));
    muteButton.setAttribute('aria-pressed', String(speechMuted));
    // The settings mirror stays single-language: it lives in the grown-up-only settings dialog.
    settingsMuteButton.textContent = muteEntry[textLanguage];
    settingsMuteButton.setAttribute('aria-pressed', String(speechMuted));
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

  // Hearts are the match's lives: a full heart is red, a spent one is hollow, and the last one beats to warn.
  function renderHearts(state) {
    if (heartPips.children.length !== state.maxHearts) {
      heartPips.replaceChildren(...Array.from({ length: state.maxHearts }, () => document.createElement('span')));
    }
    const hearts = state.lost ? 0 : state.hearts;
    [...heartPips.children].forEach((pip, index) => {
      const spent = index >= hearts;
      pip.textContent = spent ? '♡' : '♥';
      pip.classList.toggle('spent', spent);
      pip.classList.toggle('just-lost', !state.lost && state.heartLost && index === hearts);
    });
    heartPips.classList.toggle('last-heart', hearts === 1);
    heartMeter.setAttribute('aria-label', I18N.heartsAria(hearts, state.maxHearts, textLanguage));
  }

  // A small "♥ −1" floats up beside the hearts each time a wrong tap takes one.
  let heartFloatTimer = null;
  function flashHeartLoss() {
    heartFloat.classList.remove('is-showing');
    void heartFloat.offsetWidth;
    heartFloat.classList.add('is-showing');
    clearTimeout(heartFloatTimer);
    heartFloatTimer = setTimeout(() => heartFloat.classList.remove('is-showing'), 1400);
  }

  function renderScore(state) {
    renderHearts(state);
    renderGoalMarkers(state.goal);
    [...scoreStars.children].forEach((star, index) => {
      star.textContent = index < state.stars ? '★' : '☆';
      star.classList.toggle('earned', index < state.stars);
      // The star a wrong tap just took back gives a small shake before the next question arrives.
      star.classList.toggle('just-lost', state.starLost && index === state.stars);
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
    pointerEmojis.forEach(node => { node.textContent = heroEmoji.textContent; });
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
    // Where the question already shows the word, a choice is only a picture (or colour), so it cannot be
    // matched by comparing letters. The word stays as the button's accessible name for screen readers.
    const pictureOnly = question.topic !== 'math' && !question.wordLabels;

    if (question.topic === 'colors') {
      const swatch = document.createElement('span');
      swatch.className = pictureOnly ? 'color-swatch answer-swatch' : 'color-swatch';
      swatch.style.backgroundColor = option.swatch;
      swatch.setAttribute('aria-hidden', 'true');
      button.append(swatch);
      if (!pictureOnly) {
        const label = document.createElement('span');
        label.className = 'color-label';
        label.textContent = textLanguage === 'en' ? option.en.toLowerCase() : option[textLanguage];
        button.append(label);
      }
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
      button.append(icon);
      if (!pictureOnly) {
        const label = document.createElement('span');
        label.className = 'answer-label';
        label.textContent = option[textLanguage];
        button.append(label);
      }
    }
    if (pictureOnly) {
      button.classList.add('picture-only');
      button.setAttribute('aria-label', option[textLanguage]);
    }
    return button;
  }

  // A take-away picture shows every egg; the ones being taken away are faded and crossed out, so the eggs
  // that are left can still be counted. Eggs sit in groups of five, like the plain counting pictures.
  function takeAwayEggs(total, taken) {
    return Array.from({ length: total }, (_unused, index) => {
      const egg = document.createElement('span');
      egg.className = 'egg';
      egg.classList.toggle('egg-taken', index >= total - taken);
      egg.classList.toggle('egg-group-end', (index + 1) % 5 === 0 && index + 1 < total);
      egg.textContent = '🥚';
      return egg;
    });
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function currentTarget(question) {
    return question.options.find(option => option.id === question.answerId);
  }

  // A missed question stays on screen, with its right choice marked and pulsing, until the child taps that choice.
  // If nobody taps, the game moves on by itself after this wait, which starts over once the word has been said.
  const MISS_PAUSE_MS = { withSound: 9000, quiet: 6000 };
  let missTimer = null;
  // Once the last heart is gone and the miss has been shown, the lost-match panel takes the question's place.
  let lostPanelShown = false;

  function cancelMissTimer() {
    if (missTimer === null) return;
    clearTimeout(missTimer);
    missTimer = null;
  }

  function armMissFallback(state) {
    cancelMissTimer();
    missTimer = setTimeout(state.lost ? showLostPanel : loadNextQuestion, soundIsOff() ? MISS_PAUSE_MS.quiet : MISS_PAUSE_MS.withSound);
  }

  // Every button that can answer the current question: the picture choices, or the character's part buttons.
  function choiceButtons() {
    return [...answerOptions.children, ...diagramSpots.children];
  }

  // A picture question is asked on its topic's picture (the character, or the farm), unless that picture could not
  // load (then the same parts are offered as picture choices, so the question stays playable).
  const diagramFailed = new Set();
  diagramArt.addEventListener('error', () => {
    diagramFailed.add(diagramArt.dataset.diagram || 'face');
    renderQuestion(game.getState(), { speak: false });
  });
  diagramArt.addEventListener('load', () => diagramArt.classList.remove('is-loading'));

  // A picture that already failed before this script ran never fires an error event again.
  if (diagramArt.complete && diagramArt.naturalWidth === 0) diagramFailed.add('face');

  function usesDiagram(question) {
    return question.format === 'diagram' && !diagramFailed.has(question.topic);
  }

  function diagramOf(question) {
    return window.FriendlyArena.DIAGRAMS[question.topic];
  }

  // Shows the picture this question is asked on. The page starts on the character; the picture is swapped only when
  // the topic changes, and stays hidden until the new one has loaded so the previous topic's picture never flashes.
  function showDiagramPicture(question) {
    const diagram = diagramOf(question);
    faceDiagram.dataset.diagram = question.topic;
    if (diagramArt.dataset.diagram === question.topic || (!diagramArt.dataset.diagram && question.topic === 'face')) {
      diagramArt.dataset.diagram = question.topic;
      return;
    }
    diagramArt.dataset.diagram = question.topic;
    diagramArt.classList.add('is-loading');
    diagramArt.width = diagram.width;
    diagramArt.height = diagram.height;
    diagramArt.src = diagram.image;
  }

  // A scene's animals: each topic word's own icon, drawn where the scene's layout table puts it. A picture that
  // cannot load is replaced by the word's emoji, as on the picture choices.
  function makeDiagramItems(question) {
    const diagram = diagramOf(question);
    if (!diagram.items) return [];
    return diagram.items.map(({ id, x, y, size }) => {
      const word = question.options.find(option => option.id === id);
      const height = (size * diagram.width) / diagram.height;
      const item = document.createElement('span');
      item.className = 'diagram-item';
      item.style.left = `${(x - size / 2) * 100}%`;
      item.style.top = `${(y - height / 2) * 100}%`;
      item.style.width = `${size * 100}%`;
      item.style.height = `${height * 100}%`;
      const showEmoji = () => {
        item.classList.add('emoji-item');
        item.style.fontSize = `${size * 70}cqw`;
        item.textContent = word.icon;
      };
      if (word.image) {
        const picture = document.createElement('img');
        picture.src = word.image;
        picture.alt = '';
        picture.draggable = false;
        picture.addEventListener('error', showEmoji);
        item.append(picture);
      } else showEmoji();
      return item;
    });
  }

  // After a miss the wrong tap is shown and the right choice stays live and pulses: tapping it is how the game goes on.
  function markMiss(state) {
    const accepted = state.question.acceptedIds || [state.question.answerId];
    choiceButtons().forEach(choice => {
      const right = choice.dataset.choice === state.question.answerId;
      choice.disabled = !accepted.includes(choice.dataset.choice);
      choice.classList.toggle('right-answer', right);
      choice.classList.toggle('second-chance', right);
      choice.classList.toggle('wrong-answer', choice.dataset.choice === state.missedChoice);
    });
    markDiagram(state);
  }

  // One ring per tap region of a part, sized from the region so it sits on the part it marks.
  function diagramRing(region, className) {
    const [cx, cy, rx, ry] = region;
    const ring = document.createElement('span');
    ring.className = `diagram-ring ${className}`;
    ring.style.left = `${(cx - rx) * 100}%`;
    ring.style.top = `${(cy - ry) * 100}%`;
    ring.style.width = `${rx * 200}%`;
    ring.style.height = `${ry * 200}%`;
    return ring;
  }

  // After an answer the right part is ringed and named; a wrong tap also rings the part that was tapped.
  function markDiagram(state) {
    const question = state.question;
    if (!usesDiagram(question)) return;
    const { parts } = diagramOf(question);
    const rings = [];
    if (state.missed && parts[state.missedChoice]) rings.push(...parts[state.missedChoice].regions.map(region => diagramRing(region, 'wrong-ring')));
    if (state.solved || state.missed) rings.push(...parts[question.answerId].regions.map(region => diagramRing(region, state.missed ? 'right-ring second-chance' : 'right-ring')));
    diagramMarks.replaceChildren(...rings);
    const target = currentTarget(question);
    diagramWord.textContent = (state.solved || state.missed) && target ? target[textLanguage] : '';
    diagramWord.hidden = !diagramWord.textContent;
  }

  // One button per part for keyboards and screen readers. Pointers tap the picture itself and are matched to the
  // nearest generous region (see diagramPartAt), so these buttons never take a tap away from a neighbouring part.
  function makeDiagramSpots(question) {
    const { parts } = diagramOf(question);
    return question.options.map(option => {
      const [cx, cy, rx, ry] = parts[option.id].regions[0];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'diagram-spot';
      button.dataset.choice = option.id;
      button.style.left = `${(cx - rx) * 100}%`;
      button.style.top = `${(cy - ry) * 100}%`;
      button.style.width = `${rx * 200}%`;
      button.style.height = `${ry * 200}%`;
      button.setAttribute('aria-label', option[textLanguage]);
      button.addEventListener('click', () => chooseAnswer(button, option.id));
      return button;
    });
  }

  function tapDiagram(event) {
    // A keyboard or screen reader activates a part's own button (which answers for itself); a finger or mouse
    // lands on the picture.
    if (event.target?.dataset?.choice) return;
    const box = diagramStage.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const part = window.FriendlyArena.diagramPartAt(
      (event.clientX - box.left) / box.width,
      (event.clientY - box.top) / box.height,
      { width: box.width, height: box.height },
      game.getState().question.topic,
    );
    // A tap that lands on no part (the clothes, the empty background, the bare meadow) is not an answer and costs nothing.
    if (part) chooseAnswer(null, part);
  }
  diagramStage.addEventListener('click', tapDiagram);

  // What a wrong tap cost, in words: the heart (and star) that went, then how many hearts remain.
  function missFeedback(state) {
    if (state.lost) return I18N.STRINGS.feedbackLost[textLanguage];
    const cost = (state.starLost ? I18N.STRINGS.feedbackMiss : I18N.STRINGS.feedbackMissNoStar)[textLanguage];
    return `${cost} ${I18N.heartsLeft(state.hearts, textLanguage)}`;
  }

  function renderQuestion(state, { speak = true } = {}) {
    const question = state.question;
    const isWordTopic = question.topic !== 'math';
    const target = isWordTopic ? currentTarget(question) : null;
    const showWord = isWordTopic && (state.level === 'harder' || (state.level === 'super' && soundIsOff()));
    const showGenericPrompt = isWordTopic && state.level === 'super' && !soundIsOff();
    const hideSentence = isWordTopic && state.level !== 'easy';

    if (showGenericPrompt) setBilingual(questionPrompt, I18N.STRINGS.superGenericPrompt[textLanguage], secondOf(I18N.STRINGS.superGenericPrompt));
    else if (hideSentence) questionPrompt.replaceChildren();
    else setBilingual(questionPrompt, question[`prompt${capitalize(textLanguage)}`], secondLanguage && question[`prompt${capitalize(secondLanguage)}`]);
    questionPrompt.hidden = !questionPrompt.textContent;

    questionWord.textContent = showWord && target ? target[textLanguage] : '';
    questionWord.hidden = !questionWord.textContent;

    // Only math shows a picture with its question. A word question never shows the answer's own picture.
    if (question.takeAway) {
      questionPicture.replaceChildren(...takeAwayEggs(question.takeAway.total, question.takeAway.taken));
      questionPicture.hidden = false;
    } else {
      questionPicture.textContent = question.picture;
      questionPicture.hidden = !question.picture;
    }
    questionPicture.classList.toggle('dense-picture', Boolean(question.dense));
    questionPicture.classList.toggle('take-away-picture', Boolean(question.takeAway));

    equation.textContent = question.display;
    equation.hidden = !question.display;
    const onDiagram = usesDiagram(question);
    faceDiagram.hidden = !onDiagram;
    answerOptions.hidden = onDiagram;
    if (onDiagram) showDiagramPicture(question);
    diagramItems.replaceChildren(...(onDiagram ? makeDiagramItems(question) : []));
    diagramMarks.replaceChildren();
    diagramWord.hidden = true;
    diagramSpots.replaceChildren(...(onDiagram ? makeDiagramSpots(question) : []));
    faceDiagram.setAttribute('aria-label', I18N.STRINGS[question.topic === 'face' ? 'diagramGroupLabel' : 'farmGroupLabel'][textLanguage]);
    document.querySelector('#answerHint').textContent = (onDiagram ? I18N.STRINGS.diagramHint : I18N.STRINGS.answerHint)[textLanguage];
    answerOptions.replaceChildren(...(onDiagram ? [] : question.options.map(option => makeAnswerButton(option, question))));
    answerOptions.classList.toggle('four-choices', question.options.length === 4);
    const groupLabel = question.topic === 'math' ? 'answerGroupLabelNumber' : question.wordLabels ? 'answerGroupLabelWord' : 'answerGroupLabelPicture';
    answerOptions.setAttribute('aria-label', I18N.STRINGS[groupLabel][textLanguage]);
    if (state.missed) markMiss(state);
    else {
      cancelMissTimer();
      markDiagram(state);
    }
    feedback.textContent = state.missed ? missFeedback(state) : I18N.STRINGS.feedbackDefault[textLanguage];
    feedback.classList.toggle('retry', state.missed);
    renderEchoButton(state);
    nextButton.hidden = !state.solved || state.finished;
    questionPanel.hidden = state.finished || lostPanelShown;
    finishPanel.hidden = !state.finished;
    lostPanel.hidden = !lostPanelShown;
    [...topicTabsContainer.children].forEach(tab => {
      const selected = tab.dataset.topic === state.topic;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
      tab.disabled = state.finished || state.lost;
    });
    [...levelChoiceContainer.querySelectorAll('.level-option')].forEach(button => {
      const selected = button.dataset.level === state.level;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = false;
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

  function showFinishPanel(state, nudge) {
    questionPanel.hidden = true;
    finishPanel.hidden = false;
    goodbyePanel.hidden = true;
    setBilingual(document.querySelector('#finishBody'), I18N.finishBody(state.goal, textLanguage), secondLanguage && I18N.finishBody(state.goal, secondLanguage));
    [...topicTabsContainer.children].forEach(button => { button.disabled = true; });
    if (nudge) {
      playAgainButton.hidden = true;
      breakPrompt.hidden = false;
      setPointer('break');
      oneMoreRoundButton.focus();
    } else {
      playAgainButton.hidden = false;
      breakPrompt.hidden = true;
      setPointer('finish');
      playAgainButton.focus();
    }
  }

  // After a miss the child taps the right item to go on. Any other tap changes nothing and costs nothing.
  function secondChance(optionId, state) {
    const accepted = state.question.acceptedIds || [state.question.answerId];
    if (!accepted.includes(String(optionId))) return;
    sounds.play('tap');
    cancelMissTimer();
    if (state.lost) {
      speechPlayer.cancelQueued();
      showLostPanel();
      return;
    }
    loadNextQuestion();
  }

  function chooseAnswer(button, optionId) {
    const before = game.getState();
    if (before.missed) {
      secondChance(optionId, before);
      return;
    }
    const result = game.answer(optionId);
    const state = game.getState();
    if (result === 'ignored') return;
    sounds.play('tap');
    choiceButtons().forEach(choice => choice.classList.remove('wrong-answer', 'right-answer'));

    if (result === 'missed' || result === 'lost') {
      markMiss(state);
      feedback.textContent = missFeedback(state);
      feedback.classList.add('retry');
      renderScore(state);
      flashHeartLoss();
      // With no hearts left there is no dodging the loss by switching topic or level; Try again is the way on.
      if (state.lost) [...topicTabsContainer.children].forEach(button => { button.disabled = true; });
      stage.block();
      arenaMessage.textContent = (state.lost ? I18N.STRINGS.lostMessage : I18N.STRINGS.blockMessage)[textLanguage];
      playReaction(state.lost ? 'round-lost' : state.hearts === 1 ? 'last-heart' : 'try-again', { echo: { second: false } });
      renderEchoButton(state);
      sounds.play('boing', { delay: 0.04 });
      setPointer(null);
      armMissFallback(state);
      return;
    }

    // A win pays a sticker only while today's cap for this language and level has room; a capped win still
    // celebrates and then says (and shows) where the next sticker can come from.
    const reward = state.finished
      ? window.ArenaRewards?.recordWin(state.champion, { language: textLanguage, level: state.level, allowedLevels })
      : null;
    // A soft "one more round or a break?" nudge after 2 or 3 wins in a row: no timer, nothing lost either way.
    const nudge = state.finished && breakPacer.recordWin();
    const capReaction = reward?.capped ? `cap-${reward.advice}` : null;
    button?.classList.add('right-answer');
    choiceButtons().forEach(choice => { choice.disabled = true; });
    markDiagram(state);
    const finalWordEcho = state.finished && state.question.wordAudioId && !soundIsOff();
    pendingFinish = finalWordEcho ? () => {
      pendingFinish = null;
      showFinishPanel(state, nudge);
    } : null;
    playReaction(capReaction || (nudge ? 'break-prompt' : state.finished ? 'finish' : 'praise'), {
      echo: { second: true },
      onEchoDone: pendingFinish,
    });
    renderEchoButton(state);
    sounds.play('sparkle', { delay: 0.03 });
    feedback.textContent = I18N.STRINGS.feedbackCorrect[textLanguage];
    feedback.classList.remove('retry');
    renderScore(state);
    spar(state);
    if (state.finished) {
      finishPanel.hidden = true;
      if (!finalWordEcho) showFinishPanel(state, nudge);
    } else {
      nextButton.hidden = false;
      nextButton.focus();
      setPointer('next');
    }
  }

  // Brings the question and its answers into view on a phone, instead of leaving the child to
  // scroll past the (now hidden) champion/topic chrome to find them. Waits a frame first so the
  // sticky arena's height (--arena-card-height, set by a ResizeObserver in arena.js) is already
  // measured — scrolling immediately would use a stale, too-small scroll-padding-top and leave
  // the arena's sticky overlay clipping the very content this is meant to reveal.
  function revealPlayArea() {
    const scroll = () => questionPanel.scrollIntoView?.({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (typeof requestAnimationFrame !== 'function') {
      scroll();
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(scroll));
  }

  function reducedMotion() {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function enableSpeech() {
    revealStage('play');
    setPointer('answer');
    revealPlayArea();
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

  // One language choice sets both the on-screen text and, unless a grown-up has set a different
  // narration voice in settings, the spoken voice too — and is also the "turn on sound" gesture.
  textLanguageButtons.forEach(button => button.addEventListener('click', () => {
    textLanguage = button.dataset.textLanguage;
    // Until a grown-up sets a second language directly, the language picker always follows this
    // language's own default pairing; once set manually it sticks, only stepping aside if it
    // would otherwise collide with the newly chosen main language.
    if (!secondLanguageManual || secondLanguage === textLanguage) secondLanguage = I18N.DEFAULT_SECOND_LANGUAGE[textLanguage];
    if (!voiceOverride) voiceLanguage = textLanguage;
    reconcileEchoLanguage();
    persistSettings();
    renderChrome();
    renderChampion(game.getState());
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

  document.querySelector('#replayPromptButton').addEventListener('click', () => {
    if (!speechEnabled) {
      enableSpeech();
      return;
    }
    playCurrentQuestion();
  });

  function toggleMute() {
    speechMuted = !speechMuted;
    persistSettings();
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
  }

  muteButton.addEventListener('click', toggleMute);
  settingsMuteButton.addEventListener('click', toggleMute);

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
    if (pageShell.dataset.stage === 'choose') setPointer('start');
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
        const state = game.getState();
        renderQuestion(state, { speak: !state.lost });
        if (state.lost) showLostPanel();
        else if (speechEnabled) setPointer('answer');
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
        const before = game.getState();
        if (before.lost && !lostPanelShown) {
          showLostPanel();
          return;
        }
        if (!game.chooseLevel(level)) return;
        const startsFreshMatch = before.finished || before.lost;
        if (startsFreshMatch) {
          lostPanelShown = false;
          finishPanel.hidden = true;
          goodbyePanel.hidden = true;
          stage.startMatch();
        } else stage.settle();
        arenaMessage.textContent = I18N.levelChosenMessage(level, textLanguage, game.getState().topic);
        const state = game.getState();
        renderQuestion(state, { speak: !state.lost });
        if (state.lost) showLostPanel();
        else if (speechEnabled) setPointer('answer');
      });
      return button;
    });
    levelChoiceContainer.append(...buttons);
  }

  // A small grown-up control: which levels the level picker offers the child. Always keeps at
  // least one level selectable, even if every box gets unchecked.
  let levelLockEntries = [];
  function buildLevelLockOptions() {
    levelLockEntries = window.FriendlyArena.LEVELS.map(level => {
      const optionLabel = document.createElement('label');
      optionLabel.className = 'level-lock-option';
      optionLabel.dataset.levelLock = level;
      const input = document.createElement('input');
      input.type = 'checkbox';
      const text = document.createElement('span');
      text.dataset.role = 'name';
      optionLabel.append(input, text);
      return { level, optionLabel, input, text };
    });
    levelLockOptions.replaceChildren(...levelLockEntries.map(entry => entry.optionLabel));
    levelLockEntries.forEach(entry => {
      entry.input.addEventListener('change', () => {
        const checked = levelLockEntries.filter(other => other.input.checked).map(other => other.level);
        if (!checked.length) {
          entry.input.checked = true;
          return;
        }
        allowedLevels = PACING.sanitizeAllowedLevels(checked);
        persistSettings();
        applyLevelLock();
      });
    });
  }

  function renderLevelLockOptions() {
    levelLockEntries.forEach(({ level, input, text }) => {
      input.checked = allowedLevels.includes(level);
      text.textContent = `${I18N.LEVEL_NAMES[level].emoji} ${I18N.LEVEL_NAMES[level][textLanguage]}`;
    });
  }

  function applyLevelLock() {
    allowedLevels = PACING.sanitizeAllowedLevels(allowedLevels);
    [...levelChoiceContainer.querySelectorAll('.level-option')].forEach(button => {
      button.hidden = !allowedLevels.includes(button.dataset.level);
    });
    renderLevelLockOptions();
    const state = game.getState();
    if (state.finished || state.lost) return;
    const resolved = PACING.resolveAllowedLevel(state.level, allowedLevels);
    if (resolved !== state.level && game.chooseLevel(resolved)) {
      stage.settle();
      const nextState = game.getState();
      renderQuestion(nextState, { speak: !nextState.lost });
      if (nextState.lost) showLostPanel();
    }
  }

  function renderSettingsSummary() {
    const summary = window.ArenaRewards?.getSummary?.();
    if (!summary) return;
    settingsRewardSummary.textContent = `${I18N.settingsWinsSummary(summary.wins, textLanguage)} · ${I18N.settingsStickerSummary(summary.collected, summary.total, textLanguage)}`;
  }

  // Grown-up-only: which smaller second language (if any) shows under key text, and whether the
  // narration voice should differ from the on-screen language. Rebuilt on every language change,
  // since which languages count as "the other one" depends on the current main language.
  function renderSecondLanguageOptions() {
    const hadFocus = secondLanguageOptions.contains(document.activeElement);
    const choices = [null, ...I18N.TEXT_LANGUAGES.filter(language => language !== textLanguage)];
    secondLanguageOptions.replaceChildren(...choices.map(language => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-option';
      button.dataset.secondLanguage = language || 'off';
      button.textContent = language ? I18N.LANGUAGE_NAMES[language] : I18N.STRINGS.settingsSecondLanguageOff[textLanguage];
      const selected = language === secondLanguage;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.addEventListener('click', () => {
        secondLanguage = language;
        secondLanguageManual = true;
        persistSettings();
        renderChrome();
        renderQuestion(game.getState(), { speak: false });
      });
      return button;
    }));
    if (hadFocus) secondLanguageOptions.querySelector(`[data-second-language="${secondLanguage || 'off'}"]`)?.focus();
  }

  // Grown-up-only: one extra spoken language for the word after a right answer, or off. It can be any language
  // except the narration voice, so the pair is always two different languages.
  function renderEchoLanguageOptions() {
    const hadFocus = echoLanguageOptions.contains(document.activeElement);
    const choices = [null, ...I18N.TEXT_LANGUAGES.filter(language => language !== voiceLanguage)];
    echoLanguageOptions.replaceChildren(...choices.map(language => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-option';
      button.dataset.echoLanguage = language || 'off';
      button.textContent = language ? I18N.LANGUAGE_NAMES[language] : I18N.STRINGS.settingsSecondLanguageOff[textLanguage];
      const selected = language === echoLanguage;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.addEventListener('click', () => {
        echoLanguage = language;
        persistSettings();
        renderEchoLanguageOptions();
      });
      return button;
    }));
    echoLanguageOptions.setAttribute('aria-label', I18N.STRINGS.settingsEchoTitle[textLanguage]);
    if (hadFocus) echoLanguageOptions.querySelector(`[data-echo-language="${echoLanguage || 'off'}"]`)?.focus();
  }

  function renderVoiceLanguageOptions() {
    const hadFocus = voiceLanguageOptions.contains(document.activeElement);
    const choices = [null, ...I18N.TEXT_LANGUAGES];
    voiceLanguageOptions.replaceChildren(...choices.map(language => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-option';
      button.dataset.voiceOption = language || 'match';
      button.textContent = language ? I18N.LANGUAGE_NAMES[language] : I18N.STRINGS.settingsVoiceMatchLabel[textLanguage];
      const selected = language ? (voiceOverride && voiceLanguage === language) : !voiceOverride;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.addEventListener('click', () => {
        voiceOverride = Boolean(language);
        voiceLanguage = language || textLanguage;
        reconcileEchoLanguage();
        persistSettings();
        renderChrome();
      });
      return button;
    }));
    if (hadFocus) voiceLanguageOptions.querySelector(`[data-voice-option="${voiceOverride ? voiceLanguage : 'match'}"]`)?.focus();
  }

  let gateChallenge = null;
  let settingsReturnFocus = null;

  function openSettings() {
    settingsReturnFocus = document.activeElement;
    settingsGate.hidden = false;
    settingsBody.hidden = true;
    gateStatus.textContent = '';
    gateInput.value = '';
    gateChallenge = PACING.generateParentChallenge();
    gateQuestion.textContent = `${gateChallenge.a} + ${gateChallenge.b} = ?`;
    if (typeof settingsDialog.showModal === 'function') settingsDialog.showModal();
    else settingsDialog.setAttribute('open', '');
    gateInput.focus?.();
  }

  function closeSettings() {
    if (typeof settingsDialog.close === 'function') settingsDialog.close();
    else {
      settingsDialog.removeAttribute('open');
      settingsReturnFocus?.focus?.();
    }
  }

  function submitGate(fromKeyboard = false) {
    if (PACING.checkParentAnswer(gateChallenge, gateInput.value)) {
      settingsGate.hidden = true;
      settingsBody.hidden = false;
      if (fromKeyboard) {
        const focusCloseAfterKeyup = event => {
          if (event.key !== 'Enter') return;
          document.removeEventListener('keyup', focusCloseAfterKeyup, true);
          settingsCloseButton.focus();
        };
        document.addEventListener('keyup', focusCloseAfterKeyup, true);
      } else {
        settingsCloseButton.focus();
      }
      renderLevelLockOptions();
      renderSecondLanguageOptions();
      renderEchoLanguageOptions();
      renderVoiceLanguageOptions();
      renderSettingsSummary();
      return;
    }
    gateStatus.textContent = I18N.STRINGS.gateWrong[textLanguage];
    gateChallenge = PACING.generateParentChallenge();
    gateQuestion.textContent = `${gateChallenge.a} + ${gateChallenge.b} = ?`;
    gateInput.value = '';
    gateInput.focus?.();
  }

  settingsButton.addEventListener('click', openSettings);
  settingsCloseButton.addEventListener('click', closeSettings);
  gateCancelButton.addEventListener('click', closeSettings);
  gateSubmitButton.addEventListener('click', submitGate);
  gateInput.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    submitGate(true);
  });
  settingsDialog.addEventListener('click', event => {
    const box = settingsDialog.getBoundingClientRect?.();
    if (!box) return;
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (event.target === settingsDialog && outside) closeSettings();
  });
  settingsDialog.addEventListener('close', () => settingsReturnFocus?.focus?.());
  window.addEventListener('arena-rewards-updated', renderSettingsSummary);

  function renderChrome() {
    document.documentElement.lang = textLanguage === 'zh' ? 'zh-Hant-TW' : textLanguage === 'ja' ? 'ja' : 'en';
    window.ArenaRewards?.setLanguage?.(textLanguage, secondLanguage);
    const S = I18N.STRINGS;
    document.querySelector('#galleryLink').textContent = S.galleryLink[textLanguage];
    document.querySelector('#topLabel').textContent = S.topLabel[textLanguage];
    setBilingual(document.querySelector('#restartButton'), S.restartButton[textLanguage], secondOf(S.restartButton));
    document.querySelector('#eyebrow').textContent = S.eyebrow[textLanguage];
    setBilingual(document.querySelector('#gameTitle'), S.gameTitle[textLanguage], secondOf(S.gameTitle));
    document.querySelector('#introBody').textContent = S.introBody[textLanguage];
    document.querySelector('#championSection').setAttribute('aria-label', S.championSectionLabel[textLanguage]);
    document.querySelector('#championKicker').textContent = S.championKicker[textLanguage];
    document.querySelector('#championHeading').textContent = S.championHeading[textLanguage];
    document.querySelector('#championSoftNote').textContent = S.championSoftNote[textLanguage];
    setBilingual(document.querySelector('#startButton'), S.startButton[textLanguage], secondOf(S.startButton));
    document.querySelector('#startInvite').textContent = S.startInvite[textLanguage];
    document.querySelector('#textLabel').textContent = S.textLabel[textLanguage];
    document.querySelector('#arenaLayoutSection').setAttribute('aria-label', S.arenaLayoutLabel[textLanguage]);
    document.querySelector('#arenaHeading').textContent = S.arenaHeading[textLanguage];
    document.querySelector('#heroSide').textContent = S.heroSide[textLanguage];
    document.querySelector('#buddySide').textContent = S.buddySide[textLanguage];
    document.querySelector('#teamStarsLabel').textContent = S.teamStars[textLanguage];
    document.querySelector('#heartsLabel').textContent = S.heartsLabel[textLanguage];
    setBilingual(document.querySelector('#lostTitle'), S.lostHeading[textLanguage], secondOf(S.lostHeading));
    setBilingual(document.querySelector('#lostBody'), S.lostBody[textLanguage], secondOf(S.lostBody));
    tryAgainButton.replaceChildren(bilingualNode(`${S.tryAgainButton[textLanguage]} `, secondOf(S.tryAgainButton) && `${secondOf(S.tryAgainButton)} `), (() => { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = '↻'; return s; })());
    document.querySelector('#challengeKicker').textContent = S.challengeKicker[textLanguage];
    document.querySelector('#challengeHeading').textContent = S.challengeHeading[textLanguage];
    topicTabsContainer.setAttribute('aria-label', S.topicTabsLabel[textLanguage]);
    levelChoiceContainer.setAttribute('aria-label', S.levelGroupLabel[textLanguage]);
    document.querySelector('#levelLabel').textContent = S.levelLabel[textLanguage];
    document.querySelector('.speech-playback').setAttribute('aria-label', S.soundControlsLabel[textLanguage]);
    setBilingual(document.querySelector('#replayPromptButton'), S.replayButton[textLanguage], secondOf(S.replayButton));
    setBilingual(document.querySelector('#musicButton'), S.musicButton[textLanguage], secondOf(S.musicButton));
    document.querySelector('#answerHint').textContent = S.answerHint[textLanguage];
    setBilingual(document.querySelector('#finishTitle'), S.finishHeading[textLanguage], secondOf(S.finishHeading));
    setBilingual(document.querySelector('#finishBody'), I18N.finishBody(game.getState().goal, textLanguage), secondLanguage && I18N.finishBody(game.getState().goal, secondLanguage));
    document.querySelector('#playAgainButton').replaceChildren(bilingualNode(`${S.playAgainButton[textLanguage]} `, secondOf(S.playAgainButton) && `${secondOf(S.playAgainButton)} `), (() => { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = '↻'; return s; })());
    document.querySelector('#footer').textContent = S.footer[textLanguage];
    document.querySelector('#nextButton').replaceChildren(bilingualNode(`${S.nextButton[textLanguage]} `, secondOf(S.nextButton) && `${secondOf(S.nextButton)} `), (() => { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = '➜'; return s; })());

    setBilingual(document.querySelector('#settingsButton'), S.settingsButton[textLanguage], secondOf(S.settingsButton));
    document.querySelector('#settingsButton').setAttribute('aria-label', S.settingsButtonLabel[textLanguage]);
    document.querySelector('#gateTitle').textContent = S.gateTitle[textLanguage];
    document.querySelector('#gateBody').textContent = S.gateBody[textLanguage];
    document.querySelector('#gateInputLabel').textContent = S.gateInputLabel[textLanguage];
    gateSubmitButton.textContent = S.gateSubmit[textLanguage];
    gateCancelButton.textContent = S.gateCancel[textLanguage];
    document.querySelector('#settingsDialogTitle').textContent = S.settingsTitle[textLanguage];
    settingsCloseButton.textContent = S.settingsClose[textLanguage];
    document.querySelector('#settingsIntro').textContent = S.settingsIntro[textLanguage];
    document.querySelector('#settingsLevelLockTitle').textContent = S.settingsLevelLockTitle[textLanguage];
    document.querySelector('#settingsLevelLockHint').textContent = S.settingsLevelLockHint[textLanguage];
    document.querySelector('#settingsSecondLanguageTitle').textContent = S.settingsSecondLanguageTitle[textLanguage];
    document.querySelector('#settingsSecondLanguageHint').textContent = S.settingsSecondLanguageHint[textLanguage];
    document.querySelector('#settingsEchoTitle').textContent = S.settingsEchoTitle[textLanguage];
    document.querySelector('#settingsEchoHint').textContent = S.settingsEchoHint[textLanguage];
    document.querySelector('#settingsVoiceTitle').textContent = S.settingsVoiceTitle[textLanguage];
    document.querySelector('#settingsVoiceHint').textContent = S.settingsVoiceHint[textLanguage];
    document.querySelector('#settingsSoundTitle').textContent = S.settingsSoundTitle[textLanguage];
    document.querySelector('#settingsSoundHint').textContent = S.settingsSoundHint[textLanguage];
    document.querySelector('#settingsRewardsTitle').textContent = S.settingsRewardsTitle[textLanguage];
    document.querySelector('#settingsRewardsHint').textContent = S.settingsRewardsHint[textLanguage];
    document.querySelector('#settingsDeviceNote').textContent = S.settingsDeviceNote[textLanguage];
    document.querySelector('[data-reward-action="reset"]').textContent = S.settingsClearButton[textLanguage];
    document.querySelector('[data-reward-action="confirm-reset"]').textContent = S.settingsConfirmClear[textLanguage];
    document.querySelector('[data-reward-action="keep"]').textContent = S.settingsKeepStickers[textLanguage];
    setBilingual(document.querySelector('#stickerBookButton'), S.stickerBookButton[textLanguage], secondOf(S.stickerBookButton));
    setBilingual(document.querySelector('#stickerBookTitle'), S.rewardBookTitle[textLanguage], secondOf(S.rewardBookTitle));
    document.querySelector('#stickerBookCloseButton').textContent = S.rewardBookClose[textLanguage];
    setBilingual(document.querySelector('#costumeTitle'), S.costumeTitle[textLanguage], secondOf(S.costumeTitle));
    setBilingual(document.querySelector('#breakPromptTitle'), S.breakPromptTitle[textLanguage], secondOf(S.breakPromptTitle));
    setBilingual(document.querySelector('#breakPromptBody'), S.breakPromptBody[textLanguage], secondOf(S.breakPromptBody));
    setBilingual(oneMoreRoundButton, S.oneMoreRoundButton[textLanguage], secondOf(S.oneMoreRoundButton));
    setBilingual(takeBreakButton, S.takeBreakButton[textLanguage], secondOf(S.takeBreakButton));
    setBilingual(document.querySelector('#goodbyeTitle'), S.goodbyeTitle[textLanguage], secondOf(S.goodbyeTitle));
    setBilingual(goodbyeBody, S.goodbyeBody[textLanguage], secondOf(S.goodbyeBody));
    backToPlayButton.replaceChildren(bilingualNode(`${S.backToPlayButton[textLanguage]} `, secondOf(S.backToPlayButton) && `${secondOf(S.backToPlayButton)} `), (() => { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = '↻'; return s; })());

    [...topicTabsContainer.children].forEach(tab => {
      const names = I18N.TOPIC_NAMES[tab.dataset.topic];
      setBilingual(tab.querySelector('[data-role="name"]'), names[textLanguage], secondOf(names));
    });
    [...levelChoiceContainer.querySelectorAll('.level-option')].forEach(button => {
      const names = I18N.LEVEL_NAMES[button.dataset.level];
      setBilingual(button.querySelector('[data-role="name"]'), names[textLanguage], secondOf(names));
    });
    ['dino', 'monster'].forEach(id => {
      const label = championName(id);
      if (label) label.textContent = I18N.CHAMPIONS[id].name[textLanguage];
    });
    renderLevelLockOptions();
    renderSecondLanguageOptions();
    renderEchoLanguageOptions();
    renderVoiceLanguageOptions();
    if (!settingsBody.hidden) renderSettingsSummary();
    renderSpeechControls();
  }

  // Moves on after a right answer (the Next button) or after a missed question's pause; a wrong or repeated
  // call finds nothing to move past and does nothing.
  function loadNextQuestion() {
    missTimer = null;
    if (!game.nextQuestion()) return;
    stage.settle();
    arenaMessage.textContent = I18N.STRINGS.yourTurnMessage[textLanguage];
    renderQuestion(game.getState());
    choiceButtons()[0]?.focus();
    setPointer('answer');
  }

  // After the last heart's miss has been shown: hearts come back with Try again, which starts the match over.
  function showLostPanel() {
    cancelMissTimer();
    if (!game.getState().lost) return;
    lostPanelShown = true;
    questionPanel.hidden = true;
    finishPanel.hidden = true;
    goodbyePanel.hidden = true;
    lostPanel.hidden = false;
    setPointer('lost');
    tryAgainButton.focus();
  }

  nextButton.addEventListener('click', () => {
    sounds.play('tap');
    loadNextQuestion();
  });

  function restart(tryAgain = false) {
    const level = PACING.resolveAllowedLevel(game.getState().level, allowedLevels);
    cancelMissTimer();
    lostPanelShown = false;
    const state = tryAgain === true ? game.tryAgain() : game.restart(level);
    sounds.play('tap');
    if (state.lost) {
      renderQuestion(state, { speak: false });
      showLostPanel();
      return;
    }
    stage.startMatch();
    arenaMessage.textContent = I18N.STRINGS.readyMessage[textLanguage];
    renderChampion(state);
    renderQuestion(state, { speak: speechEnabled });
    choiceButtons()[0]?.focus();
    breakPrompt.hidden = true;
    goodbyePanel.hidden = true;
    playAgainButton.hidden = false;
    if (speechEnabled) setPointer('answer');
  }

  document.querySelector('#restartButton').addEventListener('click', restart);
  playAgainButton.addEventListener('click', restart);
  tryAgainButton.addEventListener('click', () => restart(true));
  oneMoreRoundButton.addEventListener('click', restart);
  takeBreakButton.addEventListener('click', () => {
    finishPanel.hidden = true;
    goodbyePanel.hidden = false;
    playReaction('break-goodbye');
    setPointer('goodbye');
    backToPlayButton.focus();
  });
  backToPlayButton.addEventListener('click', () => {
    goodbyePanel.hidden = true;
    restart();
  });

  buildTopicTabs();
  buildLevelButtons();
  buildLevelLockOptions();
  applyLevelLock();
  renderChrome();
  arenaMessage.textContent = I18N.STRINGS.readyMessage[textLanguage];
  const initialState = game.getState();
  renderChampion(initialState);
  renderSpeechControls();
  renderQuestion(initialState, { speak: false });
  setPointer(pageShell.dataset.stage === 'champion' ? 'champion' : 'start');
})();
