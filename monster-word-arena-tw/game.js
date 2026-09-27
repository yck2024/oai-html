(() => {
  'use strict';

  // Stars needed to win a match, and answer-choice count, at each level.
  const GOAL_BY_LEVEL = { easy: 3, harder: 5, super: 10 };
  const CHOICE_COUNT = { easy: 3, harder: 4, super: 4 };
  const TOPICS = ['math', 'colors', 'face', 'family', 'animals', 'fruit', 'vegetables', 'flowers', 'vehicles', 'weather'];
  // Easy shows a picture with three choices. Harder hides the picture and shows the written word instead, with four choices.
  // Super is listening-only (no picture, no written word) with four choices; it falls back to the written word if sound is off.
  const LEVELS = ['easy', 'harder', 'super'];
  const COLORS = [
    { id: 'red', zh: '紅色', en: 'RED', ja: 'あかいろ', icon: '🔴', swatch: '#f76f68' },
    { id: 'yellow', zh: '黃色', en: 'YELLOW', ja: 'きいろ', icon: '🟡', swatch: '#ffd65b' },
    { id: 'green', zh: '綠色', en: 'GREEN', ja: 'みどりいろ', icon: '🟢', swatch: '#56bf83' },
    { id: 'blue', zh: '藍色', en: 'BLUE', ja: 'あおいろ', icon: '🔵', swatch: '#5ba4ea' },
    { id: 'orange', zh: '橘色', en: 'ORANGE', ja: 'おれんじいろ', icon: '🟠', swatch: '#ff9a3d' },
    { id: 'purple', zh: '紫色', en: 'PURPLE', ja: 'むらさきいろ', icon: '🟣', swatch: '#a07ad8' },
    { id: 'pink', zh: '粉紅色', en: 'PINK', ja: 'ぴんくいろ', icon: '🩷', swatch: '#ffa3cf' },
    { id: 'brown', zh: '咖啡色', en: 'BROWN', ja: 'ちゃいろ', icon: '🟤', swatch: '#a87350' },
  ];
  // Original art; each emoji icon remains the fallback if its picture cannot load.
  const FACE_PARTS = [
    { id: 'eyes', zh: '眼睛', en: 'eyes', ja: 'め', icon: '👀', image: './images/face-eyes.webp' },
    { id: 'nose', zh: '鼻子', en: 'nose', ja: 'はな', icon: '👃', image: './images/face-nose.webp' },
    { id: 'ears', zh: '耳朵', en: 'ears', ja: 'みみ', icon: '👂', image: './images/face-ears.webp' },
    { id: 'mouth', zh: '嘴巴', en: 'mouth', ja: 'くち', icon: '👄', image: './images/face-mouth.webp' },
    { id: 'tooth', zh: '牙齒', en: 'tooth', ja: 'は', icon: '🦷', image: './images/face-tooth.webp' },
    { id: 'hair', zh: '頭髮', en: 'hair', ja: 'かみのけ', icon: '💇', image: './images/face-hair.webp' },
    { id: 'hands', zh: '手', en: 'hands', ja: 'おてて', icon: '👐', image: './images/face-hands.webp' },
    { id: 'feet', zh: '腳', en: 'feet', ja: 'あし', icon: '🦶', image: './images/face-feet.webp' },
  ];
  const FAMILY = [
    { id: 'dad', zh: '爸爸', en: 'Dad', ja: 'おとうさん', icon: '👨', image: './images/family-dad.webp' },
    { id: 'mom', zh: '媽媽', en: 'Mom', ja: 'おかあさん', icon: '👩', image: './images/family-mom.webp' },
    { id: 'brother', zh: '哥哥', en: 'older brother', ja: 'おにいさん', icon: '👦', image: './images/family-brother.webp' },
    { id: 'sister', zh: '姊姊', en: 'older sister', ja: 'おねえさん', icon: '👧', image: './images/family-sister.webp' },
    { id: 'grandpa', zh: '爺爺', en: 'Grandpa', ja: 'おじいちゃん', icon: '👴', image: './images/family-grandpa.webp' },
    { id: 'grandma', zh: '奶奶', en: 'Grandma', ja: 'おばあちゃん', icon: '👵', image: './images/family-grandma.webp' },
    { id: 'baby', zh: '寶寶', en: 'baby', ja: 'あかちゃん', icon: '👶', image: './images/family-baby.webp', promptEn: 'Find the baby!' },
  ];
  const ANIMALS = [
    { id: 'dog', zh: '小狗', en: 'dog', ja: 'いぬ', icon: '🐶', image: './images/animals-dog.webp' },
    { id: 'cat', zh: '小貓', en: 'cat', ja: 'ねこ', icon: '🐱', image: './images/animals-cat.webp' },
    { id: 'rabbit', zh: '兔子', en: 'rabbit', ja: 'うさぎ', icon: '🐰', image: './images/animals-rabbit.webp' },
    { id: 'bird', zh: '小鳥', en: 'bird', ja: 'ことり', icon: '🐦', image: './images/animals-bird.webp' },
    { id: 'fish', zh: '小魚', en: 'fish', ja: 'おさかな', icon: '🐟', image: './images/animals-fish.webp' },
    { id: 'elephant', zh: '大象', en: 'elephant', ja: 'ぞうさん', icon: '🐘', image: './images/animals-elephant.webp' },
    { id: 'pig', zh: '小豬', en: 'pig', ja: 'ぶたさん', icon: '🐷', image: './images/animals-pig.webp' },
    { id: 'monkey', zh: '猴子', en: 'monkey', ja: 'おさるさん', icon: '🐵', image: './images/animals-monkey.webp' },
  ];
  const FRUIT = [
    { id: 'apple', zh: '蘋果', en: 'apple', ja: 'りんご', icon: '🍎', image: './images/fruit-apple.webp' },
    { id: 'banana', zh: '香蕉', en: 'banana', ja: 'ばなな', icon: '🍌', image: './images/fruit-banana.webp' },
    { id: 'grapes', zh: '葡萄', en: 'grapes', ja: 'ぶどう', icon: '🍇', image: './images/fruit-grapes.webp' },
    { id: 'strawberry', zh: '草莓', en: 'strawberry', ja: 'いちご', icon: '🍓', image: './images/fruit-strawberry.webp' },
    { id: 'watermelon', zh: '西瓜', en: 'watermelon', ja: 'すいか', icon: '🍉', image: './images/fruit-watermelon.webp' },
    { id: 'pineapple', zh: '鳳梨', en: 'pineapple', ja: 'ぱいなっぷる', icon: '🍍', image: './images/fruit-pineapple.webp' },
    { id: 'mango', zh: '芒果', en: 'mango', ja: 'まんごー', icon: '🥭', image: './images/fruit-mango.webp' },
    { id: 'cherries', zh: '櫻桃', en: 'cherries', ja: 'さくらんぼ', icon: '🍒', image: './images/fruit-cherries.webp' },
  ];
  const VEGETABLES = [
    { id: 'carrot', zh: '紅蘿蔔', en: 'carrot', ja: 'にんじん', icon: '🥕', image: './images/vegetables-carrot.webp' },
    { id: 'tomato', zh: '番茄', en: 'tomato', ja: 'とまと', icon: '🍅', image: './images/vegetables-tomato.webp' },
    { id: 'corn', zh: '玉米', en: 'corn', ja: 'とうもろこし', icon: '🌽', image: './images/vegetables-corn.webp' },
    { id: 'potato', zh: '馬鈴薯', en: 'potato', ja: 'じゃがいも', icon: '🥔', image: './images/vegetables-potato.webp' },
    { id: 'cabbage', zh: '高麗菜', en: 'cabbage', ja: 'きゃべつ', icon: '🥬', image: './images/vegetables-cabbage.webp' },
    { id: 'broccoli', zh: '青花菜', en: 'broccoli', ja: 'ぶろっこりー', icon: '🥦', image: './images/vegetables-broccoli.webp' },
    { id: 'eggplant', zh: '茄子', en: 'eggplant', ja: 'なす', icon: '🍆', image: './images/vegetables-eggplant.webp' },
    { id: 'pumpkin', zh: '南瓜', en: 'pumpkin', ja: 'かぼちゃ', icon: '🎃', image: './images/vegetables-pumpkin.webp' },
  ];
  const FLOWERS = [
    { id: 'sunflower', zh: '向日葵', en: 'sunflower', ja: 'ひまわり', icon: '🌻', image: './images/flowers-sunflower.webp' },
    { id: 'tulip', zh: '鬱金香', en: 'tulip', ja: 'ちゅーりっぷ', icon: '🌷', image: './images/flowers-tulip.webp' },
    { id: 'cherryblossom', zh: '櫻花', en: 'cherry blossom', ja: 'さくら', icon: '🌸', image: './images/flowers-cherryblossom.webp' },
    { id: 'morningglory', zh: '牽牛花', en: 'morning glory', ja: 'あさがお', icon: '🪻', image: './images/flowers-morningglory.webp' },
    { id: 'rose', zh: '玫瑰', en: 'rose', ja: 'ばら', icon: '🌹', image: './images/flowers-rose.webp' },
    { id: 'daisy', zh: '雛菊', en: 'daisy', ja: 'ひなぎく', icon: '🌼', image: './images/flowers-daisy.webp' },
  ];
  const VEHICLES = [
    { id: 'car', zh: '汽車', en: 'car', ja: 'くるま', icon: '🚗', image: './images/vehicles-car.webp' },
    { id: 'bus', zh: '公車', en: 'bus', ja: 'ばす', icon: '🚌', image: './images/vehicles-bus.webp' },
    { id: 'train', zh: '火車', en: 'train', ja: 'でんしゃ', icon: '🚆', image: './images/vehicles-train.webp' },
    { id: 'airplane', zh: '飛機', en: 'airplane', ja: 'ひこうき', icon: '✈️', image: './images/vehicles-airplane.webp' },
    { id: 'bicycle', zh: '腳踏車', en: 'bicycle', ja: 'じてんしゃ', icon: '🚲', image: './images/vehicles-bicycle.webp' },
    { id: 'firetruck', zh: '消防車', en: 'fire truck', ja: 'しょうぼうしゃ', icon: '🚒', image: './images/vehicles-firetruck.webp' },
  ];
  const WEATHER = [
    { id: 'sunny', zh: '晴天', en: 'sunny day', ja: 'はれ', icon: '☀️', image: './images/weather-sunny.webp' },
    { id: 'rainy', zh: '雨天', en: 'rainy day', ja: 'あめ', icon: '🌧️', image: './images/weather-rainy.webp' },
    { id: 'cloudy', zh: '陰天', en: 'cloudy day', ja: 'くもり', icon: '☁️', image: './images/weather-cloudy.webp' },
    { id: 'snowy', zh: '下雪', en: 'snowy day', ja: 'ゆき', icon: '❄️', image: './images/weather-snowy.webp' },
    { id: 'windy', zh: '颳風', en: 'windy day', ja: 'かぜ', icon: '💨', image: './images/weather-windy.webp' },
    { id: 'rainbow', zh: '彩虹', en: 'rainbow', ja: 'にじ', icon: '🌈', image: './images/weather-rainbow.webp' },
    { id: 'thunder', zh: '打雷', en: 'thunder', ja: 'かみなり', icon: '⚡', image: './images/weather-thunder.webp' },
  ];
  const WORD_TOPICS = {
    colors: { words: COLORS, promptZh: word => `找出${word.zh}！`, promptEn: word => `Find ${word.en}!`, promptJa: word => `${word.ja}をみつけてね！` },
    face: { words: FACE_PARTS, promptZh: word => `找一找：${word.zh}！`, promptEn: word => `Find the ${word.en}!`, promptJa: word => `${word.ja}をみつけてね！` },
    family: { words: FAMILY, promptZh: word => `誰是${word.zh}？`, promptEn: word => `Find your ${word.en}!`, promptJa: word => `${word.ja}はどれかな？` },
    animals: { words: ANIMALS, promptZh: word => `${word.zh}在哪裡？`, promptEn: word => `Where is the ${word.en}?`, promptJa: word => `${word.ja}はどこかな？` },
    fruit: { words: FRUIT, promptZh: word => `找出${word.zh}！`, promptEn: word => `Find the ${word.en}!`, promptJa: word => `${word.ja}をみつけてね！` },
    vegetables: { words: VEGETABLES, promptZh: word => `找出${word.zh}！`, promptEn: word => `Find the ${word.en}!`, promptJa: word => `${word.ja}をみつけてね！` },
    flowers: { words: FLOWERS, promptZh: word => `找出${word.zh}！`, promptEn: word => `Find the ${word.en}!`, promptJa: word => `${word.ja}をみつけてね！` },
    vehicles: { words: VEHICLES, promptZh: word => `${word.zh}在哪裡？`, promptEn: word => `Where is the ${word.en}?`, promptJa: word => `${word.ja}はどこかな？` },
    weather: { words: WEATHER, promptZh: word => `找出${word.zh}！`, promptEn: word => `Find the ${word.en}!`, promptJa: word => `${word.ja}をみつけてね！` },
  };
  // Spoken reaction clips (audio/reactions.json); variants take turns so repeats feel fresh.
  const REACTIONS = {
    praise: ['reaction-praise-1', 'reaction-praise-2'],
    'try-again': ['reaction-try-again-1', 'reaction-try-again-2'],
    finish: ['reaction-finish-1'],
  };
  const ADDITION = [
    { left: 1, right: 1 },
    { left: 1, right: 2 },
    { left: 2, right: 2 },
    { left: 2, right: 1 },
    { left: 3, right: 1 },
  ];
  const HARDER_ADDITION = [
    { left: 3, right: 3 },
    { left: 4, right: 2 },
    { left: 5, right: 2 },
    { left: 3, right: 4 },
    { left: 4, right: 4 },
    { left: 5, right: 3 },
    { left: 6, right: 3 },
    { left: 4, right: 5 },
    { left: 5, right: 5 },
    { left: 6, right: 4 },
  ];
  const COUNTING = [5, 6, 7, 8, 9, 10];
  const sumProblem = sum => ({ ...sum, key: `math-${sum.left}-${sum.right}`, audioId: `math-${sum.left}-${sum.right}` });
  const MATH_PROBLEMS = {
    easy: ADDITION.map(sumProblem),
    // Every counting question shares one spoken prompt, so the clip never gives the answer away.
    harder: [
      ...COUNTING.map(count => ({ count, key: `math-count-${count}`, audioId: 'math-count' })),
      ...HARDER_ADDITION.map(sumProblem),
    ],
    // Super math keeps the equation on screen (no picture): the challenge is the sum, not reading it.
    super: HARDER_ADDITION.map(sumProblem),
  };
  const EGG = '🥚';

  function shuffled(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Never ask the question that was just asked, so a bigger pool always feels fresh.
  function pickFresh(items, random, previousKey, keyOf) {
    const fresh = items.filter(item => keyOf(item) !== previousKey);
    const pool = fresh.length ? fresh : items;
    return pool[Math.floor(random() * pool.length)];
  }

  function eggs(count) {
    // Groups of five make bigger amounts easy to count.
    const groups = [];
    for (let done = 0; done < count; done += 5) groups.push(EGG.repeat(Math.min(5, count - done)));
    return groups.join(' ');
  }

  function numberOptions(answer, level, random) {
    if (level === 'easy') return [answer - 1, answer, answer + 1];
    let nearby = [];
    for (let distance = 2; nearby.length < CHOICE_COUNT[level] - 1; distance += 1) {
      nearby = [];
      for (let value = Math.max(1, answer - distance); value <= Math.min(10, answer + distance); value += 1) {
        if (value !== answer) nearby.push(value);
      }
    }
    return [answer, ...shuffled(nearby, random).slice(0, CHOICE_COUNT[level] - 1)];
  }

  function mathQuestion(level, random, previousKey) {
    const problem = pickFresh(MATH_PROBLEMS[level], random, previousKey, item => item.key);
    const counting = problem.count !== undefined;
    const answer = counting ? problem.count : problem.left + problem.right;
    return {
      topic: 'math',
      key: problem.key,
      audioId: problem.audioId,
      promptZh: counting ? '數一數，有幾顆蛋？' : '加起來有多少？',
      promptEn: counting ? 'How many eggs? Let’s count!' : 'How many altogether?',
      promptJa: counting ? 'たまごはいくつあるかな？かぞえてみよう！' : 'ぜんぶでいくつかな？',
      display: counting ? '' : `${problem.left} + ${problem.right} = ?`,
      // Super keeps the equation but drops the countable egg picture, so it stays a sum, not a count.
      picture: level === 'super' ? '' : (counting ? eggs(problem.count) : `${EGG.repeat(problem.left)}  +  ${EGG.repeat(problem.right)}`),
      dense: level === 'harder',
      answerId: String(answer),
      options: shuffled(numberOptions(answer, level, random).map(value => ({
        id: String(value), zh: String(value), en: String(value), ja: String(value), icon: '⭐',
      })), random),
    };
  }

  function wordQuestion(topic, level, random, previousKey) {
    const { words, promptZh, promptEn, promptJa } = WORD_TOPICS[topic];
    const target = pickFresh(words, random, previousKey, word => `${topic}-${word.id}`);
    const others = shuffled(words.filter(word => word !== target), random).slice(0, CHOICE_COUNT[level] - 1);
    return {
      topic,
      key: `${topic}-${target.id}`,
      audioId: `${topic}-${target.id}`,
      promptZh: promptZh(target),
      promptEn: target.promptEn || promptEn(target),
      promptJa: promptJa(target),
      display: '',
      picture: target.icon,
      pictureImage: target.image,
      pictureSwatch: target.swatch,
      answerId: target.id,
      options: shuffled([target, ...others], random).map(({ promptEn: _prompt, ...option }) => option),
    };
  }

  function questionFor(topic, level, random, previousKey) {
    if (topic === 'math') return mathQuestion(level, random, previousKey);
    if (WORD_TOPICS[topic]) return wordQuestion(topic, level, random, previousKey);
    throw new Error(`Unknown topic: ${topic}`);
  }

  function createGame(random = Math.random) {
    let state = {
      topic: 'math',
      level: 'easy',
      champion: 'dino',
      stars: 0,
      solved: false,
      finished: false,
      feedback: '',
      question: questionFor('math', 'easy', random),
    };

    function getState() {
      return {
        ...state,
        goal: GOAL_BY_LEVEL[state.level],
        rivalPower: GOAL_BY_LEVEL[state.level] - state.stars,
        question: { ...state.question, options: state.question.options.map(option => ({ ...option })) },
      };
    }

    function chooseTopic(topic) {
      if (state.finished || !TOPICS.includes(topic)) return false;
      state = { ...state, topic, solved: false, feedback: '', question: questionFor(topic, state.level, random, state.question.key) };
      return true;
    }

    function chooseLevel(level) {
      if (state.finished || !LEVELS.includes(level)) return false;
      state = { ...state, level, solved: false, feedback: '', question: questionFor(state.topic, level, random, state.question.key) };
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
      const finished = stars >= GOAL_BY_LEVEL[state.level];
      state = { ...state, stars, solved: true, finished, feedback: 'great-job' };
      return finished ? 'finished' : 'correct';
    }

    function nextQuestion() {
      if (!state.solved || state.finished) return false;
      state = { ...state, solved: false, feedback: '', question: questionFor(state.topic, state.level, random, state.question.key) };
      return true;
    }

    function restart() {
      state = {
        ...state,
        stars: 0,
        solved: false,
        finished: false,
        feedback: '',
        question: questionFor(state.topic, state.level, random, state.question.key),
      };
      return getState();
    }

    return { getState, chooseTopic, chooseLevel, chooseChampion, answer, nextQuestion, restart };
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

  const api = { GOAL_BY_LEVEL, CHOICE_COUNT, TOPICS, LEVELS, WORD_TOPICS, REACTIONS, createGame, createSpeechPlayer };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArena = api;
})();
