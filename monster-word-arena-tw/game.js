(() => {
  'use strict';

  const GOAL = 3;
  const TOPICS = ['math', 'colors', 'face', 'family'];
  const COLORS = [
    { id: 'red', zh: '紅色', en: 'RED', icon: '🔴', swatch: '#f76f68' },
    { id: 'yellow', zh: '黃色', en: 'YELLOW', icon: '🟡', swatch: '#ffd65b' },
    { id: 'green', zh: '綠色', en: 'GREEN', icon: '🟢', swatch: '#56bf83' },
  ];
  const FACE_PARTS = [
    { id: 'eyes', zh: '眼睛', en: 'eyes', icon: '👀' },
    { id: 'nose', zh: '鼻子', en: 'nose', icon: '👃' },
    { id: 'ears', zh: '耳朵', en: 'ears', icon: '👂' },
  ];
  const FAMILY = [
    { id: 'dad', zh: '爸爸', en: 'Dad', icon: '👨' },
    { id: 'mom', zh: '媽媽', en: 'Mom', icon: '👩' },
    { id: 'brother', zh: '哥哥', en: 'older brother', icon: '👦' },
    { id: 'sister', zh: '姊姊', en: 'older sister', icon: '👧' },
  ];
  const ADDITION = [
    { left: 1, right: 1 },
    { left: 1, right: 2 },
    { left: 2, right: 2 },
    { left: 2, right: 1 },
    { left: 3, right: 1 },
  ];

  function shuffled(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function questionFor(topic, random) {
    if (topic === 'math') {
      const { left, right } = ADDITION[Math.floor(random() * ADDITION.length)];
      const answer = left + right;
      return {
        topic,
        audioId: `math-${left}-${right}`,
        promptZh: '加起來有多少？',
        promptEn: 'How many altogether?',
        display: `${left} + ${right} = ?`,
        picture: `${'🥚'.repeat(left)}  +  ${'🥚'.repeat(right)}`,
        answerId: String(answer),
        options: shuffled([answer - 1, answer, answer + 1].map(value => ({
          id: String(value), zh: String(value), en: '', icon: '⭐',
        })), random),
      };
    }

    if (topic === 'colors') {
      const target = COLORS[Math.floor(random() * COLORS.length)];
      return {
        topic,
        audioId: `colors-${target.id}`,
        promptZh: `找出${target.zh}！`,
        promptEn: `Find ${target.en}!`,
        display: '',
        picture: target.icon,
        answerId: target.id,
        options: shuffled(COLORS, random),
      };
    }

    if (topic === 'face') {
      const target = FACE_PARTS[Math.floor(random() * FACE_PARTS.length)];
      return {
        topic,
        audioId: `face-${target.id}`,
        promptZh: `找一找：${target.zh}！`,
        promptEn: `Find the ${target.en}!`,
        display: '',
        picture: target.icon,
        answerId: target.id,
        options: shuffled(FACE_PARTS, random),
      };
    }

    if (topic === 'family') {
      const target = FAMILY[Math.floor(random() * FAMILY.length)];
      return {
        topic,
        audioId: `family-${target.id}`,
        promptZh: `誰是${target.zh}？`,
        promptEn: `Find your ${target.en}!`,
        display: '',
        picture: target.icon,
        answerId: target.id,
        options: shuffled(FAMILY, random),
      };
    }

    throw new Error(`Unknown topic: ${topic}`);
  }

  function createGame(random = Math.random) {
    let state = {
      topic: 'math',
      champion: 'dino',
      stars: 0,
      solved: false,
      finished: false,
      feedback: '',
      question: questionFor('math', random),
    };

    function getState() {
      return {
        ...state,
        rivalPower: GOAL - state.stars,
        question: { ...state.question, options: state.question.options.map(option => ({ ...option })) },
      };
    }

    function chooseTopic(topic) {
      if (state.finished || !TOPICS.includes(topic)) return false;
      state = { ...state, topic, solved: false, feedback: '', question: questionFor(topic, random) };
      return true;
    }

    function chooseChampion(champion) {
      if (state.finished || !['dino', 'monster'].includes(champion)) return false;
      state = { ...state, champion };
      return true;
    }

    function answer(optionId) {
      if (state.finished || state.solved) return 'ignored';
      if (!state.question.options.some(option => option.id === String(optionId))) return 'ignored';
      if (String(optionId) !== state.question.answerId) {
        state = { ...state, feedback: 'try-again' };
        return 'try-again';
      }
      const stars = state.stars + 1;
      const finished = stars >= GOAL;
      state = { ...state, stars, solved: true, finished, feedback: 'great-job' };
      return finished ? 'finished' : 'correct';
    }

    function nextQuestion() {
      if (!state.solved || state.finished) return false;
      state = { ...state, solved: false, feedback: '', question: questionFor(state.topic, random) };
      return true;
    }

    function restart() {
      state = {
        ...state,
        stars: 0,
        solved: false,
        finished: false,
        feedback: '',
        question: questionFor(state.topic, random),
      };
      return getState();
    }

    return { getState, chooseTopic, chooseChampion, answer, nextQuestion, restart };
  }

  function createSpeechPlayer(audio, onUnavailable = () => {}) {
    let attempt = 0;

    function stop() {
      attempt += 1;
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    }

    function play(audioId, language) {
      stop();
      if (!audio || !audioId || !['en', 'zh', 'ja'].includes(language)) {
        onUnavailable();
        return false;
      }

      const currentAttempt = attempt;
      audio.src = `./audio/${language}/${audioId}.mp3`;
      audio.load();
      try {
        const playback = audio.play();
        playback?.catch(() => {
          if (currentAttempt === attempt) onUnavailable();
        });
        return true;
      } catch (_error) {
        if (currentAttempt === attempt) onUnavailable();
        return false;
      }
    }

    return { play, stop };
  }

  const api = { GOAL, TOPICS, createGame, createSpeechPlayer };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArena = api;
})();
