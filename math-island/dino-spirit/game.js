(() => {
  const questionSets = {
    addition: [
      { left: 2, right: 1 },
      { left: 4, right: 1 },
      { left: 3, right: 4 },
      { left: 5, right: 2 },
      { left: 6, right: 3 },
    ],
    subtraction: [
      { left: 2, right: 1 },
      { left: 4, right: 1 },
      { left: 6, right: 2 },
      { left: 8, right: 3 },
      { left: 10, right: 4 },
    ],
  };
  const wrongMessages = [
    'おしい！ もういちど かんがえてみよう。',
    'あと すこし！ べつの こたえも ためしてみてね。',
    'だいじょうぶ。ゆっくり かぞえてみよう！',
  ];
  const progressText = document.querySelector('#progressText');
  const progressBar = document.querySelector('#progressBar');
  const progressFill = document.querySelector('#progressFill');
  const progressDots = document.querySelector('#progressDots');
  const questionLabel = document.querySelector('#questionLabel');
  const instruction = document.querySelector('#instruction');
  const equation = document.querySelector('#equation');
  const quizCard = document.querySelector('.quiz-card');
  const additionModeButton = document.querySelector('#additionModeButton');
  const subtractionModeButton = document.querySelector('#subtractionModeButton');
  const answers = document.querySelector('#answers');
  const speakButton = document.querySelector('#speakButton');
  const speechStatus = document.querySelector('#speechStatus');
  const questionAudio = new Audio();
  questionAudio.preload = 'auto';
  const feedback = document.querySelector('#feedback');
  const nextButton = document.querySelector('#nextButton');
  const questionArea = document.querySelector('#questionArea');
  const finishPanel = document.querySelector('#finishPanel');
  const restartButton = document.querySelector('#restartButton');
  const replayButton = document.querySelector('#replayButton');
  const forestCard = document.querySelector('.forest-card');
  const forestLights = document.querySelectorAll('.forest-light');

  let operation = 'addition';
  let rounds = shuffled(questionSets[operation]);
  let roundIndex = 0;
  let wrongCount = 0;
  let finished = false;

  function shuffled(values) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function setProgress(collected) {
    progressText.textContent = `${collected} / ${rounds.length}`;
    progressBar.setAttribute('aria-valuenow', String(collected));
    progressFill.style.width = `${(collected / rounds.length) * 100}%`;
    [...progressDots.children].forEach((dot, index) => {
      dot.classList.toggle('collected', index < collected);
    });
    forestLights.forEach((light, index) => {
      light.classList.toggle('lit', index < collected);
    });
  }

  function makeChoices(answer) {
    const choices = [...new Set([answer, answer - 1, answer + 1, answer + 2])]
      .filter((value) => value >= 0)
      .slice(0, 3);
    return shuffled(choices);
  }

  let speechAttempt = 0;
  let audioWaitingForGesture = false;

  function stopQuestionAudio() {
    speechAttempt += 1;
    questionAudio.pause();
    questionAudio.currentTime = 0;
  }

  function playQuestionAudio() {
    stopQuestionAudio();
    const attempt = speechAttempt;
    const round = rounds[roundIndex];
    const clip = operation === 'subtraction'
      ? `subtraction-${round.left}-${round.right}.wav`
      : `question-${round.left}-${round.right}.mp3`;
    questionAudio.src = `./audio/${clip}`;
    questionAudio.load();
    speakButton.lastElementChild.textContent = 'もういちど きく';
    speakButton.setAttribute('aria-label', 'もういちど きく');
    speechStatus.textContent = '';
    audioWaitingForGesture = false;

    function reportPlaybackError(error) {
      if (attempt !== speechAttempt) return;
      if (error?.name === 'NotAllowedError') {
        // Browsers that block autoplay will retry on the first ordinary game interaction.
        audioWaitingForGesture = true;
        return;
      }
      speechStatus.textContent = 'おとを ならせないよ。もういちど きいてみてね。';
    }

    try {
      const playback = questionAudio.play();
      playback?.catch(reportPlaybackError);
    } catch (error) {
      reportPlaybackError(error);
    }
  }

  function resumeAudioAfterInteraction(event) {
    if (!audioWaitingForGesture || finished || event.target?.closest?.('#speakButton')) return;
    playQuestionAudio();
  }

  function renderRound({ focusAnswer = false } = {}) {
    stopQuestionAudio();
    const round = rounds[roundIndex];
    const isSubtraction = operation === 'subtraction';
    const correctAnswer = isSubtraction ? round.left - round.right : round.left + round.right;
    const operator = isSubtraction ? '−' : '+';
    const spokenOperator = isSubtraction ? 'ひく' : 'たす';
    quizCard.setAttribute('aria-label', isSubtraction ? 'ひきざんクイズ' : 'たしざんクイズ');
    instruction.textContent = isSubtraction
      ? 'ひかりだまを とると、のこりは いくつ？'
      : 'ひかりだまは あわせて いくつ？';
    questionLabel.textContent = `もんだい ${roundIndex + 1}`;
    equation.setAttribute('aria-label', `${round.left} ${spokenOperator} ${round.right} は いくつ？`);
    equation.innerHTML = `<span>${round.left}</span><span class="operator" aria-hidden="true">${operator}</span><span>${round.right}</span><span class="equals" aria-hidden="true">=</span><span class="question-mark" aria-hidden="true">？</span>`;
    answers.replaceChildren();
    makeChoices(correctAnswer).forEach((value, index) => {
      const button = document.createElement('button');
      button.className = 'answer-button';
      button.type = 'button';
      button.textContent = String(value);
      button.setAttribute('aria-label', `こたえ ${index + 1}、${value}`);
      button.dataset.value = String(value);
      button.addEventListener('click', () => chooseAnswer(button, value, correctAnswer));
      answers.append(button);
    });
    feedback.textContent = '';
    feedback.classList.remove('try-again');
    speakButton.lastElementChild.textContent = 'もういちど きく';
    speakButton.setAttribute('aria-label', 'もういちど きく');
    speechStatus.textContent = '';
    forestCard.classList.remove('cheer');
    nextButton.hidden = true;
    nextButton.textContent = roundIndex === rounds.length - 1 ? 'さいごの ひかりを とどける' : 'つぎの ひかりへ';
    nextButton.insertAdjacentHTML('beforeend', ' <span aria-hidden="true">➜</span>');
    setProgress(roundIndex);
    if (focusAnswer) answers.querySelector('button')?.focus();
    playQuestionAudio();
  }

  function chooseAnswer(button, value, correctAnswer) {
    if (finished || !nextButton.hidden) return;
    answers.querySelectorAll('button').forEach((answerButton) => answerButton.classList.remove('incorrect'));
    if (value !== correctAnswer) {
      button.classList.add('incorrect');
      feedback.classList.add('try-again');
      feedback.textContent = wrongMessages[wrongCount % wrongMessages.length];
      wrongCount += 1;
      return;
    }

    button.classList.add('correct');
    answers.querySelectorAll('button').forEach((answerButton) => { answerButton.disabled = true; });
    feedback.classList.remove('try-again');
    feedback.textContent = `せいかい！ ${correctAnswer}この ひかりだまが とどいた！`;
    setProgress(roundIndex + 1);
    forestCard.classList.add('cheer');
    nextButton.hidden = false;
    nextButton.focus();
  }

  function showFinish() {
    stopQuestionAudio();
    finished = true;
    questionArea.hidden = true;
    finishPanel.hidden = false;
    setProgress(rounds.length);
    document.querySelector('#forestHint').textContent = 'こだま森に ひかりが もどったよ！';
    replayButton.focus();
  }

  function advance() {
    roundIndex += 1;
    if (roundIndex === rounds.length) {
      showFinish();
      return;
    }
    renderRound({ focusAnswer: true });
  }

  function selectOperation(nextOperation) {
    if (operation === nextOperation) return;
    operation = nextOperation;
    rounds = shuffled(questionSets[operation]);
    roundIndex = 0;
    wrongCount = 0;
    finished = false;
    questionArea.hidden = false;
    finishPanel.hidden = true;
    additionModeButton.classList.toggle('selected', operation === 'addition');
    additionModeButton.setAttribute('aria-pressed', String(operation === 'addition'));
    subtractionModeButton.classList.toggle('selected', operation === 'subtraction');
    subtractionModeButton.setAttribute('aria-pressed', String(operation === 'subtraction'));
    document.querySelector('#forestHint').textContent = 'こたえが あたると、森に ひかりが もどるよ。';
    renderRound();
  }

  function restart() {
    rounds = shuffled(questionSets[operation]);
    roundIndex = 0;
    wrongCount = 0;
    finished = false;
    questionArea.hidden = false;
    finishPanel.hidden = true;
    document.querySelector('#forestHint').textContent = 'こたえが あたると、森に ひかりが もどるよ。';
    renderRound({ focusAnswer: true });
  }

  rounds.forEach(() => {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    progressDots.append(dot);
  });
  speakButton.addEventListener('click', playQuestionAudio);
  additionModeButton.addEventListener('click', () => selectOperation('addition'));
  subtractionModeButton.addEventListener('click', () => selectOperation('subtraction'));
  document.addEventListener('click', resumeAudioAfterInteraction);
  document.addEventListener('keydown', resumeAudioAfterInteraction, true);
  nextButton.addEventListener('click', advance);
  restartButton.addEventListener('click', restart);
  replayButton.addEventListener('click', restart);
  document.addEventListener('keydown', (event) => {
    if (!['1', '2', '3'].includes(event.key) || finished || !nextButton.hidden) return;
    const activeElement = document.activeElement;
    if (activeElement !== document.body && activeElement !== speakButton && !answers.contains(activeElement)) return;
    event.preventDefault();
    answers.querySelectorAll('button')[Number(event.key) - 1]?.click();
  });

  renderRound();
})();
