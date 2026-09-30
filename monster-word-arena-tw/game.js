(() => {
  'use strict';

  // Stars needed to win a match, and answer-choice count, at each level.
  const GOAL_BY_LEVEL = { easy: 3, harder: 5, super: 10 };
  // Hearts are the match's lives: every wrong tap costs one, and a match with none left is lost. Random tapping
  // therefore cannot carry a player through a match, while a player who mostly knows the answers rarely runs out.
  const HEARTS_BY_LEVEL = { easy: 3, harder: 4, super: 5 };
  const CHOICE_COUNT = { easy: 3, harder: 4, super: 4 };
  const TOPICS = ['math', 'colors', 'face', 'family', 'animals', 'fruit', 'vegetables', 'flowers', 'vehicles', 'weather'];
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
  // The biggest answer any math question or choice can show.
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
    if (problem.op === 'add') return Math.abs(problem.left - problem.right);
    if (problem.op === 'take') return problem.from + problem.take;
    return null;
  }

  // Easy offers the answer and its closest neighbours (never below 0). Harder and Super mix nearby numbers with,
  // half the time, the number a wrong operation would give (for example the sum on a take-away question).
  function numberOptions(problem, level, random) {
    const { answer } = problem;
    const others = CHOICE_COUNT[level] - 1;
    const inRange = value => value >= 0 && value <= MAX_ANSWER && value !== answer;
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
    if (WORD_TOPICS[topic]) return wordQuestion(topic, level, random, previousKey);
    throw new Error(`Unknown topic: ${topic}`);
  }

  // A question that has not been answered yet: not solved, not missed, no star or heart lost.
  const OPEN_QUESTION = { solved: false, missed: false, missedChoice: '', starLost: false, heartLost: false, feedback: '' };

  function createGame(random = Math.random) {
    // The next question, plus the run of recent kinds it extends so plus and minus (math operations) and the face
    // topic's picture and icon questions keep taking turns.
    function drawQuestion(topic, level, previousKey, recentOps = []) {
      const question = questionFor(topic, level, random, previousKey, recentOps);
      return { question, recentOps: question.op ? [...recentOps, question.op].slice(-2) : [] };
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

  const api = { GOAL_BY_LEVEL, HEARTS_BY_LEVEL, CHOICE_COUNT, TOPICS, LEVELS, WORD_TOPICS, REACTIONS, FACE_DIAGRAM, FACE_LEVEL_IDS, FARM_SCENE, DIAGRAMS, diagramPartAt, createGame, createSpeechPlayer };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArena = api;
})();
