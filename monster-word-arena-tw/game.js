(() => {
  'use strict';

  // Stars needed to win a match, and answer-choice count, at each level.
  const GOAL_BY_LEVEL = { easy: 3, harder: 5, super: 10 };
  // Hearts are the match's lives: every wrong tap costs one, and a match with none left is lost. Random tapping
  // therefore cannot carry a player through a match, while a player who mostly knows the answers rarely runs out.
  const HEARTS_BY_LEVEL = { easy: 3, harder: 4, super: 5 };
  const CHOICE_COUNT = { easy: 3, harder: 4, super: 4 };
  const TOPICS = ['math', 'math2', 'colors', 'face', 'family', 'animals', 'fruit', 'vegetables', 'flowers', 'vehicles', 'weather'];
  // Word questions never show the answer's picture next to the answer's picture. Easy shows only the written prompt
  // and offers three picture-only choices. Harder shows the written word and four picture-only choices.
  // Super is listening-only (no picture, no written word) with four picture-and-word choices; it falls back to the
  // written word if sound is off.
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
    // The ten parts added for the bigger body: each has a spoken prompt, a picture-choice icon and a tap region.
    // Japanese legs are ふともも because あし already names the feet.
    { id: 'head', zh: '頭', en: 'head', ja: 'あたま', icon: '🧒', image: './images/face-head.webp' },
    { id: 'cheeks', zh: '臉頰', en: 'cheeks', ja: 'ほっぺ', icon: '☺️', image: './images/face-cheeks.webp' },
    { id: 'neck', zh: '脖子', en: 'neck', ja: 'くび', icon: '🧣', image: './images/face-neck.webp' },
    { id: 'shoulders', zh: '肩膀', en: 'shoulders', ja: 'かた', icon: '🤷', image: './images/face-shoulders.webp' },
    { id: 'arms', zh: '手臂', en: 'arms', ja: 'うで', icon: '💪', image: './images/face-arms.webp' },
    { id: 'tummy', zh: '肚子', en: 'tummy', ja: 'おなか', icon: '👕', image: './images/face-tummy.webp' },
    { id: 'legs', zh: '腿', en: 'legs', ja: 'ふともも', icon: '🦵', image: './images/face-legs.webp' },
    { id: 'knees', zh: '膝蓋', en: 'knees', ja: 'ひざ', icon: '🩹', image: './images/face-knees.webp' },
    { id: 'fingers', zh: '手指', en: 'fingers', ja: 'ゆび', icon: '☝️', image: './images/face-fingers.webp' },
    { id: 'toes', zh: '腳趾', en: 'toes', ja: 'あしのゆび', icon: '🦶', image: './images/face-toes.webp' },
  ];
  // Which body parts each level asks about: Easy the original eight, Harder five more that are easy to find on the
  // character, and Super all eighteen, including the ones that are small or sit under clothes.
  const EASY_FACE_IDS = ['eyes', 'nose', 'ears', 'mouth', 'tooth', 'hair', 'hands', 'feet'];
  const FACE_LEVEL_IDS = {
    easy: EASY_FACE_IDS,
    harder: [...EASY_FACE_IDS, 'head', 'cheeks', 'arms', 'legs', 'tummy'],
    super: FACE_PARTS.map(part => part.id),
  };
  const facePool = level => FACE_PARTS.filter(part => FACE_LEVEL_IDS[level].includes(part.id));
  // The face topic's picture questions: one whole character (face and body) showing every part in FACE_PARTS, with no
  // labels. The child hears a part's name and taps it on the picture. A part is one or more tap regions (a pair, like
  // the two eyes, has two and either counts); each region is an ellipse [centreX, centreY, radiusX, radiusY] given as
  // fractions of the picture's width and height, deliberately bigger than the part itself so small fingers can land it.
  const FACE_DIAGRAM = {
    image: './images/face-body.webp',
    width: 700,
    height: 960,
    // Fewest CSS pixels a region is ever allowed to reach from its centre, however small the picture is shown.
    minRadiusPx: 24,
    parts: {
      // The head is the face skin around the features (hair, eyes and the rest win where they are). A part may give
      // rings: the ellipses drawn round it after an answer, where its tap regions would not show it well; the ring
      // for the head goes round the whole head, hair included.
      head: { regions: [[0.49, 0.3, 0.25, 0.17]], rings: [[0.49, 0.245, 0.385, 0.235]] },
      hair: { regions: [[0.4925, 0.1424, 0.3541, 0.133]] },
      eyes: { regions: [[0.3691, 0.313, 0.0912, 0.0626], [0.632, 0.3067, 0.0912, 0.0626]] },
      nose: { regions: [[0.5032, 0.3443, 0.0745, 0.045]] },
      mouth: { regions: [[0.5011, 0.41, 0.1341, 0.0626]] },
      // The teeth are a thin strip inside the mouth; their smaller minimum keeps the region distinct at small sizes.
      tooth: { regions: [[0.5011, 0.39, 0.118, 0.0297]], minRadiusPx: 12 },
      ears: { regions: [[0.2049, 0.3498, 0.0912, 0.0704], [0.7929, 0.3419, 0.0912, 0.0704]] },
      hands: { regions: [[0.0955, 0.5689, 0.118, 0.0861], [0.9056, 0.5689, 0.118, 0.0861]] },
      feet: { regions: [[0.3423, 0.9249, 0.1288, 0.0665], [0.6588, 0.9288, 0.1288, 0.0626]] },
      cheeks: { regions: [[0.347, 0.377, 0.065, 0.04], [0.655, 0.372, 0.065, 0.04]] },
      // The neck is the thin strip between the chin and the shirt collar.
      neck: { regions: [[0.497, 0.487, 0.085, 0.03]] },
      // Shoulders and knees sit under the clothes: the regions cover the sleeve tops and the leg just below the shorts.
      shoulders: { regions: [[0.335, 0.53, 0.075, 0.045], [0.665, 0.53, 0.075, 0.045]] },
      arms: { regions: [[0.235, 0.575, 0.085, 0.05], [0.765, 0.575, 0.085, 0.05]] },
      tummy: { regions: [[0.5, 0.615, 0.16, 0.075]] },
      legs: { regions: [[0.4, 0.775, 0.075, 0.075], [0.6, 0.775, 0.075, 0.075]] },
      knees: { regions: [[0.4, 0.85, 0.065, 0.04], [0.6, 0.85, 0.065, 0.04]] },
      // Each hand has its outer fingers and the raised finger above the palm; the palm stays the hand.
      fingers: {
        regions: [[0.055, 0.575, 0.055, 0.07], [0.125, 0.535, 0.035, 0.04], [0.945, 0.575, 0.055, 0.07], [0.875, 0.535, 0.035, 0.04]],
        rings: [[0.08, 0.565, 0.075, 0.07], [0.92, 0.565, 0.075, 0.07]],
      },
      toes: { regions: [[0.307, 0.965, 0.07, 0.035], [0.693, 0.965, 0.07, 0.035]] },
    },
    // A part that lies inside another counts for it: tapping the teeth when asked for the mouth is right, and so is
    // a finger for the hands, a toe for the feet, a knee for the legs, a shoulder for the arms, and any part of the
    // face or hair for the head. The reverse is not: asked for a tooth, the mouth is not right.
    alsoAccepted: {
      mouth: ['tooth'],
      hands: ['fingers'],
      feet: ['toes'],
      legs: ['knees'],
      arms: ['shoulders'],
      head: ['hair', 'eyes', 'nose', 'mouth', 'tooth', 'ears', 'cheeks'],
    },
  };

  // The animals topic's picture questions: one plain farm background with no animals in it, plus the eight animal
  // icons the topic already uses, placed at known spots. Each row is [id, centreX, centreY, size]: the animal's icon
  // is drawn centred there, `size` being its width as a fraction of the picture's width. Every animal's tap region
  // comes from its row (a circle a little bigger than the icon), so the taps and the pictures cannot drift apart.
  const FARM_SCENE = {
    image: './images/scene-farm.webp',
    width: 800,
    height: 800,
    layout: [
      ['bird', 0.62, 0.27, 0.15],
      ['rabbit', 0.17, 0.48, 0.18],
      ['cat', 0.5, 0.47, 0.18],
      ['monkey', 0.83, 0.49, 0.19],
      ['dog', 0.29, 0.65, 0.21],
      ['pig', 0.69, 0.65, 0.21],
      ['elephant', 0.47, 0.85, 0.27],
      ['fish', 0.83, 0.81, 0.17],
    ],
  };

  // A scene in the same shape as the character diagram (image, size, minimum radius, parts made of tap regions, and
  // the parts that also count for another), so one engine answers taps on both. `items` say where to draw each icon.
  function sceneDiagram({ image, width, height, layout }) {
    const parts = {};
    layout.forEach(([id, x, y, size]) => {
      const rx = size * 0.52;
      parts[id] = { regions: [[x, y, rx, (rx * width) / height]] };
    });
    return {
      image,
      width,
      height,
      minRadiusPx: 24,
      items: layout.map(([id, x, y, size]) => ({ id, x, y, size })),
      parts,
      alsoAccepted: {},
    };
  }

  // The topics that are asked on one picture, each with its own tap regions. Every other topic offers icon choices.
  const DIAGRAMS = {
    face: FACE_DIAGRAM,
    animals: sceneDiagram(FARM_SCENE),
  };

  // Which part a tap lands on, or null when it lands on no part (the clothes, the empty background, the bare
  // meadow). x and y are fractions of the picture; size ({ width, height } in CSS pixels) lets a small picture keep
  // every region at least minRadiusPx wide. Where regions overlap, the nearest normalized region wins. `topic` picks
  // the picture; `ids` limits taps to parts asked about by this question.
  function diagramPartAt(x, y, size = null, topic = 'face', ids = null) {
    const diagram = DIAGRAMS[topic];
    if (!diagram) return null;
    let best = null;
    Object.entries(diagram.parts).forEach(([id, part]) => {
      if (ids && !ids.includes(id)) return;
      const minRadius = part.minRadiusPx || diagram.minRadiusPx;
      const minX = size ? minRadius / size.width : 0;
      const minY = size ? minRadius / size.height : 0;
      part.regions.forEach(([cx, cy, rx, ry]) => {
        const distance = Math.hypot((x - cx) / Math.max(rx, minX), (y - cy) / Math.max(ry, minY));
        if (distance > 1) return;
        if (!best || distance < best.distance) best = { id, distance };
      });
    });
    return best ? best.id : null;
  }

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
    // Spoken instead of try-again when a wrong tap takes the second-to-last heart, and when it takes the last.
    'last-heart': ['reaction-last-heart'],
    'round-lost': ['reaction-round-lost'],
    // Spoken after a win that earned no sticker today: which way to go for the next one.
    'cap-harder-or-language': ['reaction-cap-harder-or-language'],
    'cap-harder': ['reaction-cap-harder'],
    'cap-language': ['reaction-cap-language'],
    'cap-tomorrow': ['reaction-cap-tomorrow'],
    finish: ['reaction-finish-1'],
    'break-prompt': ['reaction-break-prompt-1'],
    'break-goodbye': ['reaction-break-goodbye-1'],
  };
  const EGG = '🥚';
  // Topics whose answers are numbers: they show number buttons, speak a numeric prompt, and have no word to echo.
  const MATH_TOPICS = ['math', 'math2'];
  const isMathTopic = topic => MATH_TOPICS.includes(topic);
  // The biggest answer a Math question or choice can show. A problem may carry its own `range` ({ min, max }) instead,
  // which is how Math 2 questions reach 20 and 99 without moving this limit.
  const MAX_ANSWER = 10;
  const COUNTING = [5, 6, 7, 8, 9, 10];
  // Sums and take-aways are generated from a rule, so the pools stay large and every entry has a narration clip.
  function additions(keep) {
    const found = [];
    for (let left = 1; left <= 9; left += 1) {
      for (let right = 1; right <= 9; right += 1) if (keep(left, right)) found.push({ left, right });
    }
    return found;
  }
  function takeAways(keep) {
    const found = [];
    for (let from = 1; from <= MAX_ANSWER; from += 1) {
      for (let take = 1; take <= from; take += 1) if (keep(from, take)) found.push({ from, take });
    }
    return found;
  }
  // Easy stays within five (answers 0-5); take-aways may remove every egg, so 0 is a real answer.
  const EASY_ADDITION = additions((left, right) => left + right <= 5);
  const EASY_TAKE_AWAY = takeAways(from => from >= 2 && from <= 5);
  // Harder stays within ten. Addition leans on a left number that is not far below the right one.
  const HARDER_ADDITION = additions((left, right) => left + right >= 5 && left + right <= 10 && left >= right - 1);
  const HARDER_TAKE_AWAY = takeAways((from, take) => (from >= 6 && take <= 5 && take < from) || (take === from && (from === 7 || from === 10)));
  const sumProblem = ({ left, right }) => ({ op: 'add', left, right, answer: left + right, key: `math-${left}-${right}`, audioId: `math-${left}-${right}` });
  const takeAwayProblem = ({ from, take }) => ({ op: 'take', from, take, answer: from - take, key: `math-take-${from}-${take}`, audioId: `math-take-${from}-${take}` });
  const MATH_PROBLEMS = {
    easy: [...EASY_ADDITION.map(sumProblem), ...EASY_TAKE_AWAY.map(takeAwayProblem)],
    // Every counting question shares one spoken prompt, so the clip never gives the answer away.
    harder: [
      ...COUNTING.map(count => ({ op: 'count', count, answer: count, key: `math-count-${count}`, audioId: 'math-count' })),
      ...HARDER_ADDITION.map(sumProblem),
      ...HARDER_TAKE_AWAY.map(takeAwayProblem),
    ],
    // Super math keeps the equation on screen (no picture): the challenge is the sum, not reading it.
    super: [...HARDER_ADDITION.map(sumProblem), ...HARDER_TAKE_AWAY.map(takeAwayProblem)],
  };

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

  function wrongOperationResult(problem) {
    if (problem.mixedUp !== undefined) return problem.mixedUp;
    if (problem.op === 'add') return Math.abs(problem.left - problem.right);
    if (problem.op === 'take') return problem.from + problem.take;
    return null;
  }

  // Easy offers the answer and its closest neighbours (never below 0). Harder and Super mix nearby numbers with,
  // half the time, the number a wrong operation would give (for example the sum on a take-away question).
  function numberOptions(problem, level, random) {
    const { answer } = problem;
    const { min = 0, max = MAX_ANSWER } = problem.range || {};
    const others = CHOICE_COUNT[level] - 1;
    const inRange = value => value >= min && value <= max && value !== answer;
    if (level === 'easy') {
      const neighbours = [];
      for (let distance = 1; neighbours.length < others; distance += 1) {
        [answer - distance, answer + distance].filter(inRange).forEach(value => {
          if (neighbours.length < others) neighbours.push(value);
        });
      }
      return [answer, ...neighbours];
    }
    const mixedUp = wrongOperationResult(problem);
    const chosen = [];
    if (mixedUp !== null && inRange(mixedUp) && random() < 0.5) chosen.push(mixedUp);
    let nearby = [];
    for (let distance = 2; nearby.length < others; distance += 1) {
      nearby = [];
      for (let value = answer - distance; value <= answer + distance; value += 1) {
        if (inRange(value) && !chosen.includes(value)) nearby.push(value);
      }
    }
    return [answer, ...chosen, ...shuffled(nearby, random).slice(0, others - chosen.length)];
  }

  function mathPrompts(problem) {
    if (problem.op === 'count') return { promptZh: '數一數，有幾顆蛋？', promptEn: 'How many eggs? Let’s count!', promptJa: 'たまごはいくつあるかな？かぞえてみよう！' };
    if (problem.op === 'take') return { promptZh: '還剩下多少？', promptEn: 'How many are left?', promptJa: 'のこりはいくつかな？' };
    return { promptZh: '加起來有多少？', promptEn: 'How many altogether?', promptJa: 'ぜんぶでいくつかな？' };
  }

  function mathPicture(problem, level) {
    // Super keeps the equation but drops the countable egg picture, so it stays a sum, not a count.
    if (level === 'super') return { picture: '', takeAway: null };
    if (problem.op === 'count') return { picture: eggs(problem.count), takeAway: null };
    // Take-aways show every egg, with the ones being removed marked so the rest can still be counted.
    if (problem.op === 'take') return { picture: eggs(problem.from), takeAway: { total: problem.from, taken: problem.take } };
    return { picture: `${EGG.repeat(problem.left)}  +  ${EGG.repeat(problem.right)}`, takeAway: null };
  }

  // Plus and minus take turns often enough that both are always in view: the same operation is never asked three
  // times in a row (counting questions on Harder count as neither and reset the run).
  function balancedPool(level, recentOps) {
    const pool = MATH_PROBLEMS[level];
    const [older, latest] = recentOps.slice(-2);
    if (!latest || older !== latest || !['add', 'take'].includes(latest)) return pool;
    const other = pool.filter(problem => problem.op !== latest);
    return other.length ? other : pool;
  }

  function mathQuestion(level, random, previousKey, recentOps = []) {
    const problem = pickFresh(balancedPool(level, recentOps), random, previousKey, item => item.key);
    const equation = { add: `${problem.left} + ${problem.right} = ?`, take: `${problem.from} − ${problem.take} = ?`, count: '' }[problem.op];
    const { picture, takeAway } = mathPicture(problem, level);
    return {
      topic: 'math',
      op: problem.op,
      key: problem.key,
      audioId: problem.audioId,
      ...mathPrompts(problem),
      display: equation,
      picture,
      takeAway,
      dense: level === 'harder',
      answerId: String(problem.answer),
      options: shuffled(numberOptions(problem, level, random).map(value => ({
        id: String(value), zh: String(value), en: String(value), ja: String(value), icon: '⭐',
      })), random),
    };
  }

  // Math 2 is a second topic of number questions with its own three levels. Each kind of question registers one entry:
  // its `kind`, the narration clips it can ask for (`audioIds`, which must all exist in audio/prompts.json), and one
  // generator for every level it appears at (a level without a generator never asks it). A generator takes
  // (random, previousKey, level) and returns a draft:
  //   key, audioId, answer, choices (numbers, the answer among them), range ({ min, max }, bounding every choice),
  //   promptZh / promptEn / promptJa, and optionally display (a text line) and visual (plain data for math2-visuals.js).
  // Later cards append an entry here and nothing else in this file changes.
  const MATH2_RANGE_BY_LEVEL = { easy: { min: 0, max: 20 }, harder: { min: 0, max: 99 }, super: { min: 0, max: 99 } };

  // Which number is the biggest or the smallest? Easy and Harder always ask for the biggest, so a first player meets one
  // idea at a time; Super asks for the smallest too, taking turns. Mandarin uses 大 and 小 for numbers.
  const COMPARE_PROMPTS = {
    bigger: { audioId: 'math2-bigger', promptZh: '哪一個數字最大？', promptEn: 'Which number is the biggest?', promptJa: 'いちばんおおきいかずは、どれかな？' },
    smaller: { audioId: 'math2-smaller', promptZh: '哪一個數字最小？', promptEn: 'Which number is the smallest?', promptJa: 'いちばんちいさいかずは、どれかな？' },
  };

  // The direction a compare question asked, read back from its key (null for any other question).
  function compareDirectionOf(key) {
    const match = /^math2-compare-(bigger|smaller)-/.exec(key || '');
    return match ? match[1] : null;
  }

  function compareDirection(level, random, previousKey) {
    if (level !== 'super') return 'bigger';
    const previous = compareDirectionOf(previousKey);
    if (previous) return previous === 'bigger' ? 'smaller' : 'bigger';
    return random() < 0.5 ? 'bigger' : 'smaller';
  }

  // `count` different numbers from the level's range. Harder (two-digit numbers) half the time includes a pair that
  // swaps its digits (34 and 43), the pair a child mixes up when reading tens before ones.
  function compareNumbers(level, count, random) {
    const { min, max } = MATH2_RANGE_BY_LEVEL[level];
    const numbers = [];
    if (level !== 'easy' && random() < 0.5) {
      const tens = 1 + Math.floor(random() * 9);
      const ones = 1 + Math.floor(random() * 8);
      const swapped = ones >= tens ? ones + 1 : ones;
      numbers.push(tens * 10 + swapped, swapped * 10 + tens);
    }
    const pool = [];
    for (let value = min; value <= max; value += 1) pool.push(value);
    return [...numbers, ...shuffled(pool.filter(value => !numbers.includes(value)), random)].slice(0, count);
  }

  function compareDraft(random, previousKey, level) {
    const direction = compareDirection(level, random, previousKey);
    const range = MATH2_RANGE_BY_LEVEL[level];
    let choices = compareNumbers(level, CHOICE_COUNT[level], random);
    const keyOf = values => `math2-compare-${direction}-${[...values].sort((a, b) => a - b).join('-')}`;
    // The same numbers again would be the same question: step every number up one (wrapping), which keeps them different.
    if (keyOf(choices) === previousKey) choices = choices.map(value => (value === range.max ? range.min : value + 1));
    const answer = direction === 'bigger' ? Math.max(...choices) : Math.min(...choices);
    return { key: keyOf(choices), ...COMPARE_PROMPTS[direction], answer, choices, range };
  }

  // Make ten and missing addends use the same ten-frame and prompts at their respective levels.
  const TEN_PROMPTS = {
    more: { audioId: 'math2-ten-more', promptZh: '還要再加幾個，就湊成十？', promptEn: 'How many more make ten?', promptJa: 'あといくつで、じゅうになるかな？' },
    missing: { audioId: 'math2-ten-missing', promptZh: '空格裡要放哪一個數字，才能湊成十？', promptEn: 'Which number fills the blank to make ten?', promptJa: 'あいているところにいれると、じゅうになるかずは、どれかな？' },
  };
  const TEN_RANGE = { min: 0, max: 10 };
  const TEN_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function tenChoices(shown, level, random) {
    return numberOptions({ answer: 10 - shown, mixedUp: shown, range: TEN_RANGE }, level, random);
  }

  function makeTenDraft(random, previousKey, level) {
    const shown = pickFresh(TEN_COUNTS, random, previousKey, count => `math2-make-ten-${count}`);
    return {
      key: `math2-make-ten-${shown}`,
      ...TEN_PROMPTS.more,
      answer: 10 - shown,
      choices: tenChoices(shown, level, random),
      range: TEN_RANGE,
      visual: { type: 'ten-frame', counts: [shown] },
    };
  }

  function missingAddendDraft(random, previousKey, level) {
    const frameShown = level !== 'super';
    const sides = frameShown ? ['first'] : ['first', 'second'];
    const problems = TEN_COUNTS.flatMap(shown => sides.map(side => ({ shown, side })));
    const keyOf = ({ shown, side }) => `math2-missing-ten-${side}-${shown}`;
    const { shown, side } = pickFresh(problems, random, previousKey, keyOf);
    return {
      key: keyOf({ shown, side }),
      ...TEN_PROMPTS.missing,
      answer: 10 - shown,
      choices: tenChoices(shown, level, random),
      range: TEN_RANGE,
      display: side === 'first' ? `${shown} + ? = 10` : `? + ${shown} = 10`,
      visual: frameShown ? { type: 'ten-frame', counts: [shown] } : null,
    };
  }

  // Tens and ones. A child counts base-ten blocks (rods of ten and single cubes, at most 9 of each so the picture stays
  // readable on a phone) or finds the number that is ten more or ten less than the one shown. The wrong choices are the
  // mistakes a child makes: the digits read the other way round (34 for 43), a rod counted wrongly, or a cube counted
  // wrongly. Neither kind appears on Easy.
  const TENS_PROMPTS = {
    blocks: { audioId: 'math2-blocks', promptZh: '這裡一共有多少個積木？', promptEn: 'How many blocks are there in all?', promptJa: 'ブロックは、ぜんぶでいくつかな？' },
    more: { audioId: 'math2-tens-more', promptZh: '比這個數字大十的數字是哪一個？', promptEn: 'Which number is ten more than this number?', promptJa: 'このかずより、じゅうおおきいかずは、どれかな？' },
    less: { audioId: 'math2-tens-less', promptZh: '比這個數字小十的數字是哪一個？', promptEn: 'Which number is ten less than this number?', promptJa: 'このかずより、じゅうちいさいかずは、どれかな？' },
  };

  // The number with its two digits swapped (34 gives 43), or null when that is the same number or not a two-digit one.
  function digitSwap(value) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return tens >= 1 && ones >= 1 && tens !== ones ? ones * 10 + tens : null;
  }

  // `count` distinct numbers inside the range with the answer among them: first the mistakes named in `likely` (in that
  // order), then the closest numbers, so the choices are always full whatever the answer is.
  function tensChoices(answer, count, likely, random, range) {
    const chosen = [answer];
    const add = value => {
      if (value !== null && Number.isInteger(value) && value >= range.min && value <= range.max && !chosen.includes(value) && chosen.length < count) chosen.push(value);
    };
    likely.forEach(add);
    const nearby = [];
    for (let distance = 1; distance <= 10; distance += 1) nearby.push(answer - distance, answer + distance);
    shuffled(nearby, random).forEach(add);
    return chosen;
  }

  function blocksDraft(random, previousKey) {
    const range = MATH2_RANGE_BY_LEVEL.harder;
    let answer = (1 + Math.floor(random() * 9)) * 10 + Math.floor(random() * 10);
    const keyOf = value => `math2-blocks-${value}`;
    // The same blocks again would be the same question: move on one (wrapping to 10), which is a different count.
    if (keyOf(answer) === previousKey) answer = answer === range.max ? 10 : answer + 1;
    const rodMistake = answer + 10 <= range.max && (answer - 10 < 0 || random() < 0.5) ? answer + 10 : answer - 10;
    const cubeMistake = answer % 10 === 9 || (answer % 10 !== 0 && random() < 0.5) ? answer - 1 : answer + 1;
    return {
      key: keyOf(answer),
      ...TENS_PROMPTS.blocks,
      answer,
      choices: tensChoices(answer, CHOICE_COUNT.harder, [digitSwap(answer), rodMistake, cubeMistake], random, range),
      range,
      visual: { type: 'blocks', tens: Math.floor(answer / 10), ones: answer % 10 },
    };
  }

  // Ten more or ten less than a number shown as a numeral. Like bigger and smaller, the two directions take turns.
  function tenDirectionOf(key) {
    const match = /^math2-ten-(more|less)-/.exec(key || '');
    return match ? match[1] : null;
  }

  function tenMoreLessDraft(random, previousKey) {
    const range = MATH2_RANGE_BY_LEVEL.super;
    const previous = tenDirectionOf(previousKey);
    const direction = previous ? (previous === 'more' ? 'less' : 'more') : random() < 0.5 ? 'more' : 'less';
    const sign = direction === 'more' ? 1 : -1;
    // 10 more needs room to climb and 10 less room to fall, so the start runs 1-89 or 10-99.
    const low = direction === 'more' ? 1 : 10;
    const high = direction === 'more' ? 89 : range.max;
    let start = low + Math.floor(random() * (high - low + 1));
    const keyOf = value => `math2-ten-${direction}-${value}`;
    if (keyOf(start) === previousKey) start = start === high ? low : start + 1;
    const answer = start + sign * 10;
    return {
      key: keyOf(start),
      ...TENS_PROMPTS[direction],
      answer,
      // The wrong way round (ten less for ten more), one more or less instead of ten, and the swapped digits.
      choices: tensChoices(answer, CHOICE_COUNT.super, [start - sign * 10, start + sign, digitSwap(answer)], random, range),
      range,
      visual: { type: 'numerals', values: [start] },

    };
  }

  // Within twenty: sums and take-aways that cross ten ("8 + 5", "13 − 6"), the grade 1 make-ten strategy. Easy never asks
  // them. Harder draws two ten-frames with the equation; Super shows the equation alone. Every problem has its own
  // spoken prompt ("Eight plus five. How many altogether?"), which names the numbers but never the answer. Both numbers
  // being added or taken away run from 2 to 9, and the answer of a take-away is 2 to 9 too, so a problem always crosses
  // ten without leaving a lone counter or an empty frame.
  const WITHIN_20_RANGE = { min: 0, max: 20 };
  const CROSS_TEN_SUMS = [];
  const CROSS_TEN_TAKE_AWAYS = [];
  for (let left = 2; left <= 9; left += 1) {
    for (let right = 2; right <= 9; right += 1) if (left + right > 10) CROSS_TEN_SUMS.push({ left, right });
  }
  for (let from = 11; from <= 18; from += 1) {
    for (let take = 2; take <= 9; take += 1) if (from - take >= 2 && from - take <= 9) CROSS_TEN_TAKE_AWAYS.push({ from, take });
  }
  const crossTenSumKey = ({ left, right }) => `math2-add-${left}-${right}`;
  const crossTenTakeKey = ({ from, take }) => `math2-take-${from}-${take}`;

  // The ten-frames for 8 + 5: the larger number stays put and the counters that fill its frame to ten are marked as the
  // ones to move over from the other frame, so a child sees "ten and three more" without being told. 13 − 6 is a full
  // frame and three, with the six counters being taken away faded out (the ones first, then from the full frame).
  function crossTenSumVisual({ left, right }) {
    const keep = right > left ? 1 : 0;
    const counts = [left, right];
    return { type: 'ten-frame', counts, sign: '+', move: { from: 1 - keep, to: keep, count: 10 - counts[keep] } };
  }

  function crossTenTakeVisual({ from, take }) {
    const ones = from - 10;
    return { type: 'ten-frame', counts: [10, ones], taken: [take - ones, ones] };
  }

  // The slips a child is most likely to make: forgetting the ten in a sum (13 for 8 + 5 is 3), and in a take-away
  // taking the ones from the ones digit the wrong way round (13 − 6 is 3 from 6, so 10 minus the answer).
  function crossTenSumDraft(random, previousKey, level) {
    const problem = pickFresh(CROSS_TEN_SUMS, random, previousKey, crossTenSumKey);
    const answer = problem.left + problem.right;
    return {
      key: crossTenSumKey(problem),
      audioId: crossTenSumKey(problem),
      ...mathPrompts({ op: 'add' }),
      answer,
      choices: numberOptions({ answer, mixedUp: answer - 10, range: WITHIN_20_RANGE }, level, random),
      range: WITHIN_20_RANGE,
      display: `${problem.left} + ${problem.right} = ?`,
      visual: level === 'harder' ? crossTenSumVisual(problem) : null,
    };
  }

  function crossTenTakeDraft(random, previousKey, level) {
    const problem = pickFresh(CROSS_TEN_TAKE_AWAYS, random, previousKey, crossTenTakeKey);
    const answer = problem.from - problem.take;
    return {
      key: crossTenTakeKey(problem),
      audioId: crossTenTakeKey(problem),
      ...mathPrompts({ op: 'take' }),
      answer,
      choices: numberOptions({ answer, mixedUp: 10 - answer, range: WITHIN_20_RANGE }, level, random),
      range: WITHIN_20_RANGE,
      display: `${problem.from} − ${problem.take} = ?`,
      visual: level === 'harder' ? crossTenTakeVisual(problem) : null,
    };
  }

  // Four shared clips work for every step: the visible numbers teach the size of each jump without
  // the narration reading a particular sequence (or its answer). Backward counting lives only on Super.
  const SEQUENCE_PROMPTS = {
    next: { audioId: 'math2-sequence-next', promptZh: '接下來是哪一個數字？', promptEn: 'What number comes next?', promptJa: 'つぎのかずは、なにかな？' },
    missing: { audioId: 'math2-sequence-missing', promptZh: '少了哪一個數字？', promptEn: 'What number is missing?', promptJa: 'ぬけているかずは、なにかな？' },
    jumps: { audioId: 'math2-sequence-jumps', promptZh: '每次跳一樣多，接下來是哪一個數字？', promptEn: 'Count in equal jumps. What number comes next?', promptJa: 'おなじかずずつかぞえてね。つぎのかずは、なにかな？' },
    backward: { audioId: 'math2-sequence-backward', promptZh: '倒著數，接下來是哪一個數字？', promptEn: 'Count backward. What number comes next?', promptJa: 'うしろむきにかぞえよう。つぎのかずは、なにかな？' },
  };

  function sequencePool(steps, missing) {
    const pool = [];
    for (const step of steps) {
      const size = Math.abs(step);
      const max = size <= 2 ? 20 : 100;
      // Skip-count from multiples of the step, keeping every tile (and the hidden answer) in range.
      for (let low = 0; low + size * 3 <= max; low += size) {
        const values = Array.from({ length: 4 }, (_, index) => low + size * index);
        if (step < 0) values.reverse();
        for (const gap of missing ? [1, 2, 3] : [3]) {
          const prompt = gap !== 3 ? 'missing' : step < 0 ? 'backward' : size === 1 ? 'next' : 'jumps';
          pool.push({
            key: `math2-sequence-${step}-${values[0]}-${gap}`,
            ...SEQUENCE_PROMPTS[prompt],
            answer: values[gap],
            range: { min: 0, max },
            visual: { type: 'sequence', values: values.map((value, index) => index === gap ? null : value) },
          });
        }
      }
    }
    return pool;
  }
  const SEQUENCE_POOLS = {
    easy: sequencePool([1, 10], false),
    harder: sequencePool([2, 5, 10], true),
    super: sequencePool([-1, -2, -5, -10], true),
  };

  function sequenceDraft(random, previousKey, level) {
    const problem = pickFresh(SEQUENCE_POOLS[level], random, previousKey, item => item.key);
    return { ...problem, choices: numberOptions(problem, level, random) };
  }

  const MATH2_KINDS = [
    { kind: 'compare', audioIds: ['math2-bigger', 'math2-smaller'], generators: { easy: compareDraft, harder: compareDraft, super: compareDraft } },
    { kind: 'make-ten', audioIds: ['math2-ten-more'], generators: { easy: makeTenDraft } },
    { kind: 'missing-addend', audioIds: ['math2-ten-missing'], generators: { harder: missingAddendDraft, super: missingAddendDraft } },
    { kind: 'blocks', audioIds: ['math2-blocks'], generators: { harder: blocksDraft, super: blocksDraft } },
    { kind: 'ten-more-less', audioIds: ['math2-tens-more', 'math2-tens-less'], generators: { super: tenMoreLessDraft } },
    { kind: 'add-within-20', audioIds: CROSS_TEN_SUMS.map(crossTenSumKey), generators: { harder: crossTenSumDraft, super: crossTenSumDraft } },
    { kind: 'take-within-20', audioIds: CROSS_TEN_TAKE_AWAYS.map(crossTenTakeKey), generators: { harder: crossTenTakeDraft, super: crossTenTakeDraft } },
    { kind: 'sequence', audioIds: Object.values(SEQUENCE_PROMPTS).map(prompt => prompt.audioId), generators: { easy: sequenceDraft, harder: sequenceDraft, super: sequenceDraft } },
  ];

  // Like plus and minus on Math: the same kind is never asked three times in a row while another is on offer.
  function rotateKinds(kinds, recentKinds) {
    const [older, latest] = recentKinds.slice(-2);
    if (!latest || older !== latest) return kinds;
    const others = kinds.filter(entry => entry.kind !== latest);
    return others.length ? others : kinds;
  }

  function math2Question(level, random, previousKey, recentKinds = []) {
    const offered = MATH2_KINDS.filter(entry => entry.generators[level]);
    if (!offered.length) throw new Error(`No Math 2 question is registered for ${level}`);
    const rotated = rotateKinds(offered, recentKinds);
    const entry = rotated[Math.floor(random() * rotated.length)];
    const draft = entry.generators[level](random, previousKey, level);
    return {
      topic: 'math2',
      kind: entry.kind,
      key: draft.key,
      audioId: draft.audioId,
      promptZh: draft.promptZh,
      promptEn: draft.promptEn,
      promptJa: draft.promptJa,
      display: draft.display || '',
      picture: '',
      takeAway: null,
      dense: false,
      // Plain data that app.js hands to math2-visuals.js to draw; null when the question is only its number buttons.
      visual: draft.visual || null,
      range: draft.range,
      answerId: String(draft.answer),
      options: shuffled(draft.choices.map(value => ({
        id: String(value), zh: String(value), en: String(value), ja: String(value), icon: '⭐',
      })), random),
    };
  }

  // The prompt is written above the choices, and the answer's picture only ever appears on a choice: Easy and
  // Harder show pictures alone (the word is in the question), Super adds the word back because the question is heard.
  // A question on its topic's picture uses active parts as tap regions, with the same prompt and narration as the
  // icon question. Parts inside the named target also count, but only when active at this level. If the picture fails,
  // the usual few picture choices (fallbackOptions) stand in.
  function diagramQuestion(question, target, words) {
    const ids = words.map(word => word.id);
    return {
      ...question,
      format: 'diagram',
      acceptedIds: [target.id, ...(DIAGRAMS[question.topic].alsoAccepted[target.id] || []).filter(id => ids.includes(id))],
      wordLabels: false,
      fallbackOptions: question.topic === 'face' ? question.options : undefined,
      options: words.map(({ promptEn: _prompt, ...option }) => option),
    };
  }

  function wordQuestion(topic, level, random, previousKey) {
    const { promptZh, promptEn, promptJa } = WORD_TOPICS[topic];
    const words = topic === 'face' ? facePool(level) : WORD_TOPICS[topic].words;
    const target = pickFresh(words, random, previousKey, word => `${topic}-${word.id}`);
    const others = shuffled(words.filter(word => word !== target), random).slice(0, CHOICE_COUNT[level] - 1);
    const question = {
      topic,
      key: `${topic}-${target.id}`,
      audioId: `${topic}-${target.id}`,
      // The word said alone (audio/words.json), for the echo after an answer.
      wordAudioId: `word-${topic}-${target.id}`,
      promptZh: promptZh(target),
      promptEn: target.promptEn || promptEn(target),
      promptJa: promptJa(target),
      display: '',
      picture: '',
      wordLabels: level === 'super',
      answerId: target.id,
      options: shuffled([target, ...others], random).map(({ promptEn: _prompt, ...option }) => option),
    };
    if (!DIAGRAMS[topic]) return question;
    return diagramQuestion(question, target, words);
  }

  function questionFor(topic, level, random, previousKey, recentOps) {
    if (topic === 'math') return mathQuestion(level, random, previousKey, recentOps);
    if (topic === 'math2') return math2Question(level, random, previousKey, recentOps);
    if (WORD_TOPICS[topic]) return wordQuestion(topic, level, random, previousKey);
    throw new Error(`Unknown topic: ${topic}`);
  }

  // A question that has not been answered yet: not solved, not missed, no star or heart lost.
  const OPEN_QUESTION = { solved: false, missed: false, missedChoice: '', starLost: false, heartLost: false, feedback: '' };

  function createGame(random = Math.random) {
    // The next question, plus the run of recent kinds it extends so plus and minus (math operations), Math 2's kinds and
    // the face topic's picture and icon questions keep taking turns.
    function drawQuestion(topic, level, previousKey, recentOps = []) {
      const question = questionFor(topic, level, random, previousKey, recentOps);
      const run = question.kind || question.op;
      return { question, recentOps: run ? [...recentOps, run].slice(-2) : [] };
    }

    let state = {
      topic: 'math',
      level: 'easy',
      champion: 'dino',
      stars: 0,
      hearts: HEARTS_BY_LEVEL.easy,
      finished: false,
      lost: false,
      ...OPEN_QUESTION,
      ...drawQuestion('math', 'easy'),
    };

    function getState() {
      return {
        ...state,
        goal: GOAL_BY_LEVEL[state.level],
        maxHearts: HEARTS_BY_LEVEL[state.level],
        rivalPower: GOAL_BY_LEVEL[state.level] - state.stars,
        question: { ...state.question, options: state.question.options.map(option => ({ ...option })) },
      };
    }

    // A match that is over (won or lost) waits for Play again or Try again before anything else changes.
    const over = () => state.finished || state.lost;

    function chooseTopic(topic) {
      if (over() || !TOPICS.includes(topic)) return false;
      state = { ...state, topic, ...OPEN_QUESTION, ...drawQuestion(topic, state.level, state.question.key, state.topic === topic ? state.recentOps : []) };
      return true;
    }

    function abandonCurrentMatch() {
      if (over() || state.hearts === HEARTS_BY_LEVEL[state.level]) return false;
      state = { ...state, lost: true };
      return true;
    }

    function chooseLevel(level) {
      if (!LEVELS.includes(level)) return false;
      if (over()) {
        startFresh(level);
        return true;
      }
      if (level === state.level) return false;
      if (abandonCurrentMatch()) return true;
      state = { ...state, level, stars: 0, hearts: HEARTS_BY_LEVEL[level], ...OPEN_QUESTION, ...drawQuestion(state.topic, level, state.question.key, state.recentOps) };
      return true;
    }

    function chooseChampion(champion) {
      if (over() || !['dino', 'monster'].includes(champion)) return false;
      state = { ...state, champion };
      return true;
    }

    // The first tap settles the question. A wrong tap ends it (no second try on the same question), takes one heart
    // and one star from the current match (never below zero), and the match is lost once the last heart is gone.
    // Collected stickers are never touched. Guessing at random therefore loses ground at every level, while a player
    // who knows most answers still moves ahead.
    function answer(optionId) {
      if (over() || state.solved || state.missed) return 'ignored';
      if (!state.question.options.some(option => option.id === String(optionId))) return 'ignored';
      if (!(state.question.acceptedIds || [state.question.answerId]).includes(String(optionId))) {
        const stars = Math.max(0, state.stars - 1);
        const hearts = Math.max(0, state.hearts - 1);
        const lost = hearts === 0;
        state = { ...state, stars, hearts, lost, missed: true, missedChoice: String(optionId), starLost: stars < state.stars, heartLost: true, feedback: 'missed' };
        return lost ? 'lost' : 'missed';
      }
      const stars = state.stars + 1;
      const finished = stars >= GOAL_BY_LEVEL[state.level];
      state = { ...state, stars, solved: true, finished, feedback: 'great-job' };
      return finished ? 'finished' : 'correct';
    }

    // After a right answer, or after a miss has been shown, a fresh question (never the same one) takes over.
    function nextQuestion() {
      if (!(state.solved || state.missed) || over()) return false;
      state = { ...state, ...OPEN_QUESTION, ...drawQuestion(state.topic, state.level, state.question.key, state.recentOps) };
      return true;
    }

    function startFresh(level = state.level) {
      const nextLevel = LEVELS.includes(level) ? level : state.level;
      state = {
        ...state,
        level: nextLevel,
        stars: 0,
        hearts: HEARTS_BY_LEVEL[nextLevel],
        finished: false,
        lost: false,
        ...OPEN_QUESTION,
        ...drawQuestion(state.topic, nextLevel, state.question.key, state.recentOps),
      };
      return getState();
    }

    // Starting over during a match with a spent heart loses that match; a lost match waits for its card's Try again.
    function restart(level = state.level) {
      if (state.lost || abandonCurrentMatch()) return getState();
      return startFresh(level);
    }

    function tryAgain() {
      return over() ? startFresh() : getState();
    }

    return { getState, chooseTopic, chooseLevel, chooseChampion, answer, nextQuestion, restart, tryAgain };
  }

  // A clip that never reports its end (a stalled load) must not hold up the clips queued behind it.
  const CLIP_FALLBACK_MS = 6000;

  function createSpeechPlayer(audio, onUnavailable = () => {}) {
    let attempt = 0;
    // Clips waiting for the one playing to end, and the step (with its onStart and onEnd hooks) that is playing.
    let queued = [];
    let current = null;
    let fallbackTimer = null;

    function clearFallback() {
      if (fallbackTimer === null) return;
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    function stop() {
      attempt += 1;
      queued = [];
      current = null;
      clearFallback();
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    }

    function start(audioId, language) {
      if (!audio || !audioId || !['en', 'zh', 'ja'].includes(language)) {
        onUnavailable();
        return false;
      }

      const currentAttempt = ++attempt;
      audio.src = `./audio/${language}/${audioId}.mp3`;
      audio.load();
      try {
        const playback = audio.play();
        playback?.catch(() => {
          if (currentAttempt !== attempt) return;
          onUnavailable();
          advance();
        });
        return true;
      } catch (_error) {
        if (currentAttempt === attempt) onUnavailable();
        return false;
      }
    }

    function play(audioId, language) {
      stop();
      return start(audioId, language);
    }

    // The playing step is over (its clip ended, failed, or ran out its fallback): tell it, then start the next.
    function advance() {
      clearFallback();
      const finished = current;
      current = null;
      finished?.onEnd?.();
      const step = queued.shift();
      if (!step) return;
      if (!start(step.audioId, step.language)) {
        step.onEnd?.();
        advance();
        return;
      }
      current = step;
      fallbackTimer = setTimeout(advance, CLIP_FALLBACK_MS);
      step.onStart?.();
    }

    // Clips one after another on the same element: [{ audioId, language, onStart, onEnd }]. Any later play, stop or
    // sequence cuts the rest off, so a new question never has to wait for a word still being echoed.
    function playSequence(steps) {
      stop();
      queued = steps.filter(Boolean);
      if (!queued.length) return false;
      advance();
      return current !== null;
    }

    // Keeps the clip that is playing but drops whatever was waiting behind it.
    function cancelQueued() {
      queued = [];
    }

    if (audio?.addEventListener) {
      ['ended', 'error'].forEach(type => audio.addEventListener(type, () => {
        if (current) advance();
      }));
    }

    return { play, stop, playSequence, cancelQueued };
  }

  const api = { GOAL_BY_LEVEL, HEARTS_BY_LEVEL, CHOICE_COUNT, TOPICS, MATH_TOPICS, isMathTopic, MATH2_KINDS, rotateKinds, numberOptions, LEVELS, WORD_TOPICS, REACTIONS, FACE_DIAGRAM, FACE_LEVEL_IDS, FARM_SCENE, DIAGRAMS, diagramPartAt, createGame, createSpeechPlayer };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArena = api;
})();
