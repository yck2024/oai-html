(() => {
  const questions = [
    { left: 2, right: 1 },
    { left: 4, right: 1 },
    { left: 3, right: 4 },
    { left: 5, right: 2 },
    { left: 6, right: 3 },
  ];
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
  const equation = document.querySelector('#equation');
  const answers = document.querySelector('#answers');
  const feedback = document.querySelector('#feedback');
  const nextButton = document.querySelector('#nextButton');
  const questionArea = document.querySelector('#questionArea');
  const finishPanel = document.querySelector('#finishPanel');
  const restartButton = document.querySelector('#restartButton');
  const replayButton = document.querySelector('#replayButton');
  const forestCard = document.querySelector('.forest-card');
  const forestLights = document.querySelectorAll('.forest-light');

  let rounds = shuffled(questions);
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
    return shuffled([answer - 1, answer, answer + 1]);
  }

  function renderRound({ focusAnswer = false } = {}) {
    const round = rounds[roundIndex];
    const correctAnswer = round.left + round.right;
    questionLabel.textContent = `もんだい ${roundIndex + 1}`;
    equation.setAttribute('aria-label', `${round.left} たす ${round.right} は いくつ？`);
    equation.innerHTML = `<span>${round.left}</span><span class="operator" aria-hidden="true">+</span><span>${round.right}</span><span class="equals" aria-hidden="true">=</span><span class="question-mark" aria-hidden="true">？</span>`;
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
    forestCard.classList.remove('cheer');
    nextButton.hidden = true;
    nextButton.textContent = roundIndex === rounds.length - 1 ? 'さいごの ひかりを とどける' : 'つぎの ひかりへ';
    nextButton.insertAdjacentHTML('beforeend', ' <span aria-hidden="true">➜</span>');
    setProgress(roundIndex);
    if (focusAnswer) answers.querySelector('button')?.focus();
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

  function restart() {
    rounds = shuffled(questions);
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
  nextButton.addEventListener('click', advance);
  restartButton.addEventListener('click', restart);
  replayButton.addEventListener('click', restart);
  document.addEventListener('keydown', (event) => {
    if (!['1', '2', '3'].includes(event.key) || finished || !nextButton.hidden) return;
    const activeElement = document.activeElement;
    if (activeElement !== document.body && !answers.contains(activeElement)) return;
    event.preventDefault();
    answers.querySelectorAll('button')[Number(event.key) - 1]?.click();
  });

  renderRound();
})();
