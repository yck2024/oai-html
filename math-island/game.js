const worlds = {
  garden: {
    label: 'Garden', clear: 0x9ed8ed, ground: 0x70bd78, accent: 0x438f55, token: 0xe84d45,
    tipEn: 'Take your time. You can count out loud!', tipJa: 'ゆっくり かぞえてみよう！', tokenEn: 'apple', tokenJa: 'りんご',
  },
  ocean: {
    label: 'Ocean', clear: 0x7bcbd7, ground: 0x3da6b3, accent: 0xdba84c, token: 0xf07850,
    tipEn: 'Look carefully through the bubbles!', tipJa: 'あわの なかを よく みてね！', tokenEn: 'shell', tokenJa: 'かいがら',
  },
  space: {
    label: 'Space', clear: 0x817bd1, ground: 0x5c55a7, accent: 0xe6bd51, token: 0x42bfe5,
    tipEn: 'Count the glowing space rocks!', tipJa: 'ひかる ほしのいしを かぞえてね！', tokenEn: 'space rock', tokenJa: 'ほしのいし',
  },
};

const copy = {
  ja: {
    brand: 'かずのにわ', ready: 'じゅんびできたよ', puzzle: (n, total) => `もんだい ${n} / ${total}`,
    introEyebrow: 'ちいさな さんすう ぼうけん', introTitle: 'このせかいを<br /><span>そだてよう！</span>',
    introDescription: 'みえるものを かぞえて、あう かずを えらんでね。',
    worlds: { garden: 'にわ', ocean: 'うみ', space: 'うちゅう' }, start: 'あそぼう', reset: 'ほしを リセット',
    saved: n => `このブラウザに ほぞんした ほし: ${n}`, savedUnavailable: n => `ほし: ${n}（このブラウザには ほぞんできないよ）`,
    speechReady: '🔊 AivisSpeech: まお', speechLoading: '🔊 音声を じゅんびしているよ…',
    speechMissing: '音声ファイルがないよ。ZIPをもういちど たしかめてね。', speechUnsupported: 'このブラウザでは音声を再生できません。',
    countKicker: world => `${world.tokenJa}を かぞえてね`, countQuestion: 'いくつ みえるかな？',
    countHint: 'あう かずを タップしてね。', addKicker: 'ふたつのグループを あわせよう',
    addHint: 'ぜんぶで いくつかな？', replay: '🔊 もういちど きく',
    right: ['せいかい！すごいね！', 'やった！よくできたね！', 'すばらしい さんすう！'],
    wrong: 'おしい！いっしょに かぞえてみよう。',
    finishEyebrow: 'ぼうけん クリア！', finishTitle: 'やったね！', stars: 'ほし',
    finishMessage: (earned, total) => `こんかいは ${earned}こ あつめたよ。ほしは ぜんぶで ${total}こ！`,
    again: 'もういちど あそぶ', tip: world => world.tipJa,
    confirmReset: 'このブラウザに保存した星を消す？',
  },
  en: {
    brand: 'Number Garden', ready: 'Ready to play', puzzle: (n, total) => `Puzzle ${n} of ${total}`,
    introEyebrow: 'A little math adventure', introTitle: 'Let’s help this<br /><span>world grow!</span>',
    introDescription: 'Count what you see, then choose the matching number.',
    worlds: { garden: 'Garden', ocean: 'Ocean', space: 'Space' }, start: 'Let’s play', reset: 'Reset stars',
    saved: n => `Stars saved in this browser: ${n}`, savedUnavailable: n => `Stars: ${n} (not saved in this browser)`,
    speechReady: '🔊 Japanese voice: AivisSpeech: まお', speechLoading: '🔊 Preparing audio…',
    speechMissing: 'Audio clip is missing. Check the downloaded ZIP.', speechUnsupported: 'Audio playback is not available in this browser.',
    countKicker: world => `Count the ${world.tokenEn}s`, countQuestion: 'How many can you see?',
    countHint: 'Tap the number that matches.', addKicker: 'Put the groups together',
    addHint: 'How many altogether?', replay: '🔊 Hear it again',
    right: ['That’s right! Great counting!', 'You got it! Wonderful!', 'Fantastic math!'],
    wrong: 'Good try! Let’s count once more.',
    finishEyebrow: 'Adventure complete', finishTitle: 'You did it!', stars: 'stars',
    finishMessage: (earned, total) => `You earned ${earned} stars this game. ${total} stars are saved here!`,
    again: 'Play again', tip: world => world.tipEn,
    confirmReset: 'Clear the stars saved in this browser?',
  },
};

const TOTAL_ROUNDS = 8;
const worldRoot = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color(worlds.garden.clear);
scene.fog = new THREE.Fog(worlds.garden.clear, 15, 35);
const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 8.6, 15.8);
camera.lookAt(0, 1.1, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
worldRoot.append(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x8ab5a5, 1.45));
const sun = new THREE.DirectionalLight(0xfff3d2, 2.15);
sun.position.set(-5, 10, 7);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -10;
sun.shadow.camera.right = 10;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -10;
scene.add(sun);

const ground = new THREE.Mesh(new THREE.CylinderGeometry(10, 11, 0.8, 64), new THREE.MeshStandardMaterial({ color: worlds.garden.ground, roughness: 0.92 }));
ground.position.set(0, -0.45, 0);
ground.receiveShadow = true;
scene.add(ground);
const groundTop = new THREE.Mesh(new THREE.CircleGeometry(10, 64), new THREE.MeshStandardMaterial({ color: worlds.garden.ground, roughness: 1 }));
groundTop.rotation.x = -Math.PI / 2;
groundTop.position.y = -0.045;
groundTop.receiveShadow = true;
scene.add(groundTop);

const worldDecor = new THREE.Group();
const targetGroup = new THREE.Group();
scene.add(worldDecor, targetGroup);

function material(color, roughness = 0.78) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function addMesh(parent, geometry, mat, position, scale) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function clearGroup(group) {
  for (const child of group.children) {
    child.traverse(object => {
      if (!object.isMesh) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(item => item.dispose());
    });
  }
  group.clear();
}

function addCloud(x, y, z, size = 1) {
  const group = new THREE.Group();
  const white = material(0xffffff);
  [[0, 0, 0, 0.62], [0.55, 0.08, 0, 0.48], [-0.48, 0.04, 0.06, 0.42], [0.15, 0.31, 0, 0.43]].forEach(([cx, cy, cz, r]) => {
    addMesh(group, new THREE.SphereGeometry(r, 16, 12), white, [cx, cy, cz]);
  });
  group.position.set(x, y, z);
  group.scale.setScalar(size);
  worldDecor.add(group);
}

function addFlower(x, z, color, size = 0.7) {
  const flower = new THREE.Group();
  const stem = addMesh(flower, new THREE.CylinderGeometry(0.045, 0.055, 0.65, 8), material(0x559c5c), [0, 0.32, 0]);
  stem.castShadow = false;
  const petalMat = material(color);
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5;
    addMesh(flower, new THREE.SphereGeometry(0.16, 12, 10), petalMat, [Math.cos(angle) * 0.19, 0.77, Math.sin(angle) * 0.19], [1, 0.72, 1]);
  }
  addMesh(flower, new THREE.SphereGeometry(0.13, 12, 10), material(0xffdc61), [0, 0.78, 0]);
  flower.position.set(x, 0, z);
  flower.scale.setScalar(size);
  worldDecor.add(flower);
}

function buildDecoration(world) {
  clearGroup(worldDecor);
  if (world === 'garden') {
    addCloud(-7, 4.4, -2, 1.15); addCloud(6.8, 5.3, -4, 0.82);
    const trunk = material(0x9e6944), leaf = material(0x48a866), leaf2 = material(0x70c775);
    addMesh(worldDecor, new THREE.CylinderGeometry(0.32, 0.48, 2.5, 10), trunk, [-5.4, 1.05, -3]);
    addMesh(worldDecor, new THREE.SphereGeometry(1.52, 18, 14), leaf, [-5.4, 2.7, -3], [1, 0.92, 0.9]);
    addMesh(worldDecor, new THREE.SphereGeometry(1.05, 18, 14), leaf2, [-4.5, 2.45, -3], [0.92, 0.92, 0.9]);
    addMesh(worldDecor, new THREE.CylinderGeometry(0.28, 0.4, 2.1, 10), trunk, [5.8, 0.85, -3.6]);
    addMesh(worldDecor, new THREE.SphereGeometry(1.3, 18, 14), material(0x63bc71), [5.8, 2.35, -3.6], [1.18, 0.9, 1]);
    addFlower(-6.7, 1.3, 0xff91a6, 0.95); addFlower(6.7, 0.3, 0xffd061, 1.15); addFlower(-4.5, 2.3, 0xffd061, 0.8);
  } else if (world === 'ocean') {
    addCloud(-6.5, 4.8, -2, 0.9); addCloud(6.5, 5.4, -4, 0.75);
    const coral = material(0xff967d), coral2 = material(0xe87689), sand = material(0xffd878);
    for (const [x, z, h] of [[-6.2, -2.7, 1.7], [-5.55, -2.8, 1.05], [6.1, -3.2, 1.55], [6.6, -3.2, 1]]) {
      const branch = addMesh(worldDecor, new THREE.CylinderGeometry(0.12, 0.21, h, 9), (x < 0 ? coral : coral2), [x, h / 2 - 0.03, z]);
      branch.rotation.z = x < 0 ? -0.12 : 0.1;
      addMesh(worldDecor, new THREE.SphereGeometry(0.2, 10, 8), (x < 0 ? coral : coral2), [x - 0.25, h * 0.83, z]);
    }
    addMesh(worldDecor, new THREE.SphereGeometry(1.1, 20, 14), sand, [-4.9, 0.12, 1.4], [1.8, 0.15, 1]);
    addMesh(worldDecor, new THREE.SphereGeometry(1.05, 20, 14), sand, [5.1, 0.1, 1.2], [1.7, 0.15, 0.95]);
    for (const [x, z] of [[-7, 0.5], [-6.2, 1], [6.6, 1.3], [7.1, 0.4]]) addMesh(worldDecor, new THREE.SphereGeometry(0.17, 14, 10), material(0xffefb5), [x, 0.08, z], [1.3, 0.62, 0.9]);
  } else {
    const starMat = material(0xfff2b2, 0.3);
    for (let i = 0; i < 28; i++) {
      const x = ((i * 37) % 150) / 10 - 7.5;
      const y = 2.6 + ((i * 23) % 46) / 10;
      addMesh(worldDecor, new THREE.SphereGeometry(i % 4 === 0 ? 0.075 : 0.04, 8, 6), starMat, [x, y, -6 - (i % 4)]);
    }
    addMesh(worldDecor, new THREE.SphereGeometry(1.75, 24, 20), material(0xf1a7be), [5.8, 2.7, -4], [1.18, 1, 0.8]);
    addMesh(worldDecor, new THREE.SphereGeometry(0.6, 18, 12), material(0xffd967), [-5.8, 3.2, -2]);
    for (let i = 0; i < 3; i++) {
      const ring = addMesh(worldDecor, new THREE.TorusGeometry(0.76 + i * 0.22, 0.035, 6, 36), material(0xeee2ff, 0.4), [5.8, 2.7, -4]);
      ring.rotation.set(0.8, i * 0.3, 0.3);
      ring.castShadow = false;
    }
  }
}

function makeApple(color) {
  const group = new THREE.Group();
  addMesh(group, new THREE.SphereGeometry(0.37, 20, 16), material(color), [0, 0.38, 0], [0.92, 1, 0.9]);
  const stem = addMesh(group, new THREE.CylinderGeometry(0.035, 0.045, 0.2, 7), material(0x735a37), [0, 0.77, 0]);
  stem.rotation.z = -0.18;
  const leaf = addMesh(group, new THREE.SphereGeometry(0.1, 10, 8), material(0x58a960), [0.12, 0.75, 0], [1.5, 0.45, 0.8]);
  leaf.rotation.z = 0.3;
  return group;
}

function makeShell(color) {
  const group = new THREE.Group();
  const body = addMesh(group, new THREE.SphereGeometry(0.43, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2), material(color), [0, 0.25, 0], [1, 0.9, 0.86]);
  body.rotation.x = Math.PI;
  for (let i = -2; i <= 2; i++) {
    const ridge = addMesh(group, new THREE.TorusGeometry(0.3 + (2 - Math.abs(i)) * 0.025, 0.025, 6, 16, Math.PI), material(0xffd8ac), [i * 0.11, 0.28, 0.02]);
    ridge.rotation.x = Math.PI / 2;
    ridge.rotation.z = i * 0.13;
  }
  return group;
}

function makeStarRock(color) {
  const group = new THREE.Group();
  const center = addMesh(group, new THREE.IcosahedronGeometry(0.31, 1), material(color, 0.4), [0, 0.36, 0], [1.05, 1.08, 0.92]);
  center.rotation.set(0.2, 0.4, 0.1);
    const crystal = material(0xffdf77, 0.38);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + 0.35;
    const point = addMesh(group, new THREE.ConeGeometry(0.12, 0.36, 5), crystal, [Math.cos(a) * 0.33, 0.36, Math.sin(a) * 0.33]);
    point.rotation.z = -Math.cos(a) * 0.65;
    point.rotation.x = Math.sin(a) * 0.65;
  }
  return group;
}

function makeToken(world) {
  if (world === 'ocean') return makeShell(worlds.ocean.token);
  if (world === 'space') return makeStarRock(worlds.space.token);
  return makeApple(worlds.garden.token);
}

function clearTargets() {
  clearGroup(targetGroup);
}

let selectedWorld = 'garden';
let currentRound = 0;
let score = 0;
let currentAnswer = 0;
let currentQuestionData = null;
let canAnswer = true;
let feedbackType = null;
let previewMode = new URLSearchParams(location.search).has('showStyles');
const STORAGE_KEY = 'number-garden-progress-v1';
const fixedWorld = new URLSearchParams(location.search).get('style');
let storageAvailable = true;
let savedData = loadProgress();
let currentLanguage = savedData.language;
let currentAudio = null;
const styleSwitcher = document.querySelector('#style-switcher');
const worldTip = document.querySelector('#world-tip');
const introCard = document.querySelector('#intro-card');
const questionCard = document.querySelector('#question-card');
const finishCard = document.querySelector('#finish-card');
const answersEl = document.querySelector('#answers');
const feedback = document.querySelector('#feedback');

function loadProgress() {
  const empty = { totalStars: 0, puzzlesSolved: 0, world: 'garden', language: 'ja' };
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return empty;
    const parsed = JSON.parse(stored);
    return {
      totalStars: Number.isFinite(parsed.totalStars) ? parsed.totalStars : 0,
      puzzlesSolved: Number.isFinite(parsed.puzzlesSolved) ? parsed.puzzlesSolved : 0,
      world: worlds[parsed.world] ? parsed.world : 'garden',
      language: parsed.language === 'en' ? 'en' : 'ja',
    };
  } catch {
    storageAvailable = false;
    return empty;
  }
}

function updateSavedNote() {
  const note = document.querySelector('#saved-note');
  if (note) {
    const strings = copy[currentLanguage || 'ja'];
    note.textContent = storageAvailable ? strings.saved(savedData.totalStars) : strings.savedUnavailable(savedData.totalStars);
  }
  document.querySelector('#score').textContent = savedData.totalStars;
}

function saveProgress() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  updateSavedNote();
}

function setSpeechStatus(message) {
  document.querySelectorAll('#speech-status, #question-speech-status').forEach(node => { node.textContent = message; });
}

function playAudioClip(clipName) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  setSpeechStatus(copy[currentLanguage].speechLoading);
  currentAudio = new Audio(`./audio/${clipName}.mp3`);
  currentAudio.addEventListener('ended', () => setSpeechStatus(copy[currentLanguage].speechReady), { once: true });
  currentAudio.addEventListener('error', () => setSpeechStatus(copy[currentLanguage].speechMissing), { once: true });
  currentAudio.play().catch(() => setSpeechStatus(copy[currentLanguage].speechUnsupported));
}

function questionClipName() {
  if (!currentQuestionData) return '';
  if (currentQuestionData.kind === 'add') {
    return `addition-${currentQuestionData.a}-${currentQuestionData.b}`;
  }
  return `count-${selectedWorld}`;
}

function applyLanguage() {
  const strings = copy[currentLanguage];
  const japanese = currentLanguage === 'ja';
  document.documentElement.lang = japanese ? 'ja' : 'en';
  document.querySelector('#brand-name').textContent = strings.brand;
  document.querySelector('#game-header').setAttribute('aria-label', japanese ? 'ゲームのすすみぐあい' : 'Game progress');
  document.querySelector('#language-toggle').setAttribute('aria-label', japanese ? '言語' : 'Language');
  document.querySelector('#star-score').setAttribute('aria-label', japanese ? 'このブラウザに保存した星の合計' : 'Total stars saved in this browser');
  document.querySelector('#world-choices').setAttribute('aria-label', japanese ? 'せかいをえらぶ' : 'Choose a world');
  answersEl.setAttribute('aria-label', japanese ? 'こたえをえらぶ' : 'Choose your answer');
  answersEl.querySelectorAll('button').forEach(button => {
    button.setAttribute('aria-label', japanese ? `こたえ ${button.textContent}` : `Answer ${button.textContent}`);
  });
  document.querySelector('#intro-eyebrow').textContent = strings.introEyebrow;
  document.querySelector('#intro-title').innerHTML = strings.introTitle;
  document.querySelector('#intro-description').textContent = strings.introDescription;
  document.querySelector('#world-garden-label').textContent = strings.worlds.garden;
  document.querySelector('#world-ocean-label').textContent = strings.worlds.ocean;
  document.querySelector('#world-space-label').textContent = strings.worlds.space;
  document.querySelector('[data-world="garden"]').setAttribute('aria-label', strings.worlds.garden);
  document.querySelector('[data-world="ocean"]').setAttribute('aria-label', strings.worlds.ocean);
  document.querySelector('[data-world="space"]').setAttribute('aria-label', strings.worlds.space);
  document.querySelector('#start-button').innerHTML = `${strings.start} <span>➜</span>`;
  document.querySelector('#reset-progress').textContent = strings.reset;
  document.querySelector('#finish-eyebrow').textContent = strings.finishEyebrow;
  document.querySelector('#finish-title').textContent = strings.finishTitle;
  document.querySelector('#finish-stars-label').textContent = strings.stars;
  document.querySelector('#again-button').innerHTML = `${strings.again} <span>↻</span>`;
  document.querySelector('#world-tip').textContent = strings.tip(worlds[selectedWorld]);
  setSpeechStatus(strings.speechReady);
  document.querySelectorAll('.language-toggle button').forEach(button => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  styleSwitcher.querySelectorAll('button').forEach(button => { button.textContent = strings.worlds[button.dataset.world]; });
  updateSavedNote();
  if (!questionCard.hidden && currentQuestionData) {
    const question = currentQuestionData;
    document.querySelector('#question-kicker').textContent = question.kind === 'add' ? strings.addKicker : strings.countKicker(worlds[selectedWorld]);
    document.querySelector('#question').textContent = question.kind === 'add' ? `${question.a} + ${question.b} = ?` : strings.countQuestion;
    document.querySelector('#hint').textContent = question.kind === 'add' ? strings.addHint : strings.countHint;
    document.querySelector('#speak-question').textContent = strings.replay;
    if (feedbackType) {
      document.querySelector('#feedback').textContent = feedbackType === 'correct' ? strings.right[0] : strings.wrong;
      document.querySelector('#feedback').className = `feedback${feedbackType === 'wrong' ? ' try-again' : ''}`;
    }
    document.querySelector('#round-label').textContent = strings.puzzle(currentRound + 1, TOTAL_ROUNDS);
  } else if (finishCard.hidden) {
    document.querySelector('#round-label').textContent = strings.ready;
  } else {
    document.querySelector('#finish-message').textContent = strings.finishMessage(score, savedData.totalStars);
    document.querySelector('#round-label').textContent = strings.finishEyebrow;
  }
}

function setLanguage(language) {
  if (!copy[language] || language === currentLanguage) return;
  currentLanguage = language;
  savedData.language = language;
  saveProgress();
  applyLanguage();
}

document.querySelectorAll('.language-toggle button').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});

function setWorld(world) {
  if (!worlds[world]) return;
  selectedWorld = world;
  savedData.world = world;
  saveProgress();
  scene.background.setHex(worlds[world].clear);
  scene.fog.color.setHex(worlds[world].clear);
  ground.material.color.setHex(worlds[world].ground);
  groundTop.material.color.setHex(worlds[world].ground);
  buildDecoration(world);
  document.querySelectorAll('.world-choice').forEach(button => {
    button.classList.toggle('selected', button.dataset.world === world);
    button.setAttribute('aria-pressed', button.dataset.world === world ? 'true' : 'false');
  });
  styleSwitcher.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.world === world));
  applyLanguage();
}

document.querySelectorAll('.world-choice').forEach(button => button.addEventListener('click', () => setWorld(button.dataset.world)));

if (previewMode) {
  styleSwitcher.hidden = false;
  styleSwitcher.innerHTML = Object.entries(worlds).map(([id, world]) => `<button type="button" data-world="${id}">${world.label}</button>`).join('');
  styleSwitcher.querySelectorAll('button').forEach(button => button.addEventListener('click', () => setWorld(button.dataset.world)));
}

function roundQuestion(round) {
  if (round % 3 !== 2) {
    const count = 1 + Math.floor(Math.random() * 8);
    return { kind: 'count', a: count, b: 0, answer: count };
  }
  const a = 1 + Math.floor(Math.random() * 5);
  const b = 1 + Math.floor(Math.random() * (9 - a));
  return { kind: 'add', a, b, answer: a + b };
}

function makeAnswers(answer) {
  const choices = new Set([answer]);
  while (choices.size < 3) {
    const nudge = Math.random() < 0.5 ? -1 : 1;
    const option = answer + nudge * (1 + Math.floor(Math.random() * 3));
    if (option >= 1 && option <= 10) choices.add(option);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

function dropTokens(question) {
  clearTargets();
  const groups = question.kind === 'add' ? [question.a, question.b] : [question.a];
  const groupCenters = groups.length === 2 ? [-2.1, 2.1] : [0];
  groups.forEach((count, groupIndex) => {
    const cx = groupCenters[groupIndex];
    const cols = Math.min(4, count);
    for (let i = 0; i < count; i++) {
      const token = makeToken(selectedWorld);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = cx + (col - (cols - 1) / 2) * 0.92;
      const z = (row - (Math.ceil(count / cols) - 1) / 2) * 0.92 + 1.9;
      token.position.set(x, 0.02, z);
      token.rotation.y = (i * 1.7 + groupIndex) % (Math.PI * 2);
      token.scale.setScalar(1.05);
      token.userData.homeY = 0.02;
      token.userData.phase = Math.random() * Math.PI * 2;
      targetGroup.add(token);
    }
  });
  if (groups.length === 2) {
    const ringMat = material(selectedWorld === 'space' ? 0xb8a8ff : selectedWorld === 'ocean' ? 0xffefb5 : 0xf8f0c7);
    [-2.1, 2.1].forEach((x) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.66, 0.045, 6, 40), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(x, 0.01, 1.9);
      ring.castShadow = false;
      targetGroup.add(ring);
    });
  }
}

function renderQuestion() {
  if (currentRound >= TOTAL_ROUNDS) {
    currentQuestionData = null;
    questionCard.hidden = true;
    finishCard.hidden = false;
    document.querySelector('#final-score').textContent = score;
    document.querySelector('#progress-fill').style.width = '100%';
    applyLanguage();
    playAudioClip('finish');
    return;
  }
  canAnswer = true;
  feedbackType = null;
  feedback.textContent = '';
  feedback.className = 'feedback';
  const q = roundQuestion(currentRound);
  currentQuestionData = q;
  currentAnswer = q.answer;
  dropTokens(q);
  document.querySelector('#progress-fill').style.width = `${currentRound / TOTAL_ROUNDS * 100}%`;
  answersEl.replaceChildren(...makeAnswers(currentAnswer).map(value => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = value;
    button.dataset.analyticsLabel = 'math-answer-choice';
    button.setAttribute('aria-label', currentLanguage === 'ja' ? `こたえ ${value}` : `Answer ${value}`);
    button.addEventListener('click', () => chooseAnswer(value));
    return button;
  }));
  applyLanguage();
  playAudioClip(questionClipName());
}

function celebrate() {
  targetGroup.children.forEach((token, i) => {
    if (token.geometry) return;
    token.userData.bounce = 1.2 + (i % 4) * 0.16;
  });
  for (let i = 0; i < 12; i++) {
    const bit = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), material([0xffd25c, 0xff91a6, 0x8be0ab, 0x8bd7ff][i % 4]));
    bit.position.set((Math.random() - 0.5) * 5, 1.1 + Math.random() * 1.4, -0.6 + (Math.random() - 0.5) * 2);
    bit.userData.confetti = true;
    bit.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.06, Math.random() * 0.08 + 0.035, (Math.random() - 0.5) * 0.045);
    targetGroup.add(bit);
  }
}

function chooseAnswer(value) {
  if (!canAnswer) return;
  if (value === currentAnswer) {
    canAnswer = false;
    score++;
    savedData.totalStars++;
    savedData.puzzlesSolved++;
    saveProgress();
    feedbackType = 'correct';
    applyLanguage();
    playAudioClip('correct');
    celebrate();
    answersEl.querySelectorAll('button').forEach(button => button.disabled = true);
    window.setTimeout(() => { currentRound++; renderQuestion(); }, 1700);
  } else {
    feedbackType = 'wrong';
    applyLanguage();
    playAudioClip('try-again');
  }
}

function startGame() {
  score = 0;
  currentRound = 0;
  updateSavedNote();
  introCard.hidden = true;
  finishCard.hidden = true;
  questionCard.hidden = false;
  renderQuestion();
}

document.querySelector('#start-button').addEventListener('click', startGame);
document.querySelector('#again-button').addEventListener('click', () => {
  finishCard.hidden = true;
  introCard.hidden = false;
  clearTargets();
  currentQuestionData = null;
  applyLanguage();
  document.querySelector('#progress-fill').style.width = '0%';
});

document.querySelector('#speak-question').addEventListener('click', () => {
  if (currentQuestionData) playAudioClip(questionClipName());
});

document.querySelector('#reset-progress').addEventListener('click', () => {
  if (!window.confirm(copy[currentLanguage].confirmReset)) return;
  savedData = { totalStars: 0, puzzlesSolved: 0, world: selectedWorld, language: currentLanguage };
  saveProgress();
});

const clock = new THREE.Clock();
function animate() {
  const elapsed = clock.getElapsedTime();
  targetGroup.children.forEach(child => {
    if (child.userData.confetti) {
      child.position.add(child.userData.velocity);
      child.userData.velocity.y -= 0.003;
      child.rotation.x += 0.08;
      child.rotation.z += 0.05;
      child.material.transparent = true;
      child.material.opacity = Math.max(0, 1 - (elapsed - (child.userData.born ??= elapsed)) / 1.25);
    } else if (child.userData.homeY !== undefined) {
      child.position.y = child.userData.homeY + Math.sin(elapsed * 2.1 + child.userData.phase) * 0.055;
      if (child.userData.bounce > 0) {
        child.position.y += Math.max(0, Math.sin(elapsed * 12 + child.userData.phase)) * child.userData.bounce;
        child.userData.bounce *= 0.96;
      }
    }
  });
  for (let i = targetGroup.children.length - 1; i >= 0; i--) {
    const child = targetGroup.children[i];
    if (child.userData.confetti && child.material.opacity <= 0.02) {
      targetGroup.remove(child);
      child.geometry.dispose();
      child.material.dispose();
    }
  }
  worldDecor.children.forEach((child, i) => {
    if (selectedWorld === 'space' && i < 28) child.material.emissive?.setHex(0x1c1640);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function resize() {
  const width = worldRoot.clientWidth;
  const height = worldRoot.clientHeight;
  camera.aspect = width / height;
  camera.position.z = width < 620 ? 19.4 : 15.8;
  camera.position.y = width < 620 ? 9.8 : 8.6;
  camera.lookAt(0, 1.1, 0);
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

window.addEventListener('resize', resize);
setWorld(worlds[fixedWorld] ? fixedWorld : (worlds[savedData.world] ? savedData.world : selectedWorld));
updateSavedNote();
resize();
animate();
