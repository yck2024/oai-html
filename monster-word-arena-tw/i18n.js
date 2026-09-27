(() => {
  'use strict';

  // On-screen text in three languages. Japanese strings are written entirely in hiragana
  // (including words usually spelled in katakana or kanji) so a pre-reading child can sound
  // them out. This is separate from audio/prompts.json, whose Japanese text is chosen for
  // correct Gemini TTS pronunciation and may use kanji or katakana.
  const TEXT_LANGUAGES = ['en', 'zh', 'ja'];

  const TOPIC_NAMES = {
    math: { en: 'Math', zh: '數學', ja: 'すうがく', emoji: '➕' },
    colors: { en: 'Colors', zh: '顏色', ja: 'いろ', emoji: '🎨' },
    face: { en: 'Body', zh: '身體', ja: 'からだ', emoji: '🙂' },
    family: { en: 'Family', zh: '家人', ja: 'かぞく', emoji: '🏠' },
    animals: { en: 'Animals', zh: '動物', ja: 'どうぶつ', emoji: '🐾' },
    fruit: { en: 'Fruit', zh: '水果', ja: 'くだもの', emoji: '🍎' },
    vegetables: { en: 'Vegetables', zh: '蔬菜', ja: 'やさい', emoji: '🥕' },
    flowers: { en: 'Flowers', zh: '花朵', ja: 'はな', emoji: '🌸' },
    vehicles: { en: 'Vehicles', zh: '交通工具', ja: 'のりもの', emoji: '🚗' },
    weather: { en: 'Weather', zh: '天氣', ja: 'てんき', emoji: '⛅' },
  };

  const LEVEL_NAMES = {
    easy: { en: 'Easy', zh: '簡單', ja: 'かんたん', emoji: '🌱' },
    harder: { en: 'Harder', zh: '進階', ja: 'すこしむずかしい', emoji: '🌟' },
    super: { en: 'Super', zh: '超級', ja: 'ちょうむずかしい', emoji: '🚀' },
  };

  const CHAMPIONS = {
    dino: {
      name: { en: 'Rex the Dino', zh: '雷克斯恐龍', ja: 'きょうりゅうの　れっくす' },
      shortName: { en: 'Rex', zh: '雷克斯', ja: 'れっくす' },
      move: { en: 'Tail Swish', zh: '甩尾巴', ja: 'しっぽスイング' },
      buddyShortName: { en: 'Bobo', zh: '波波', ja: 'ぼぼ' },
    },
    monster: {
      name: { en: 'Bobo the Monster', zh: '波波怪獸', ja: 'かいじゅうの　ぼぼ' },
      shortName: { en: 'Bobo', zh: '波波', ja: 'ぼぼ' },
      move: { en: 'Bubble Blast', zh: '泡泡砲', ja: 'あわパンチ' },
      buddyShortName: { en: 'Rex', zh: '雷克斯', ja: 'れっくす' },
    },
  };

  // Fixed chrome strings, one function/string per language.
  const STRINGS = {
    galleryLink: { en: '← Gallery', zh: '← 回畫廊', ja: '← ギャラリーへ' },
    topLabel: { en: 'PLAY · LEARN · CHEER', zh: '玩樂・學習・加油', ja: 'あそぶ・まなぶ・おうえん' },
    restartButton: { en: '↻ Start over', zh: '↻ 重新開始', ja: '↻ さいしょから' },
    eyebrow: { en: 'A pretend sparring face-off · no ouchies', zh: '假裝對打，不會受傷', ja: 'ごっこあそびの　たいけつ・いたくないよ' },
    gameTitle: { en: 'Dino & Monster Word Arena', zh: '恐龍怪獸友誼擂台', ja: 'きょうりゅうと　かいじゅうの　ことばアリーナ' },
    introBody: {
      en: 'Pick a champion, solve a little challenge, and launch a silly power move!',
      zh: '選一位小隊長，答對就出招！',
      ja: 'せんしゅを　えらんで、もんだいに　こたえて、とくぎを　だそう！',
    },
    championSectionLabel: { en: 'Choose your champion', zh: '選一位小隊長', ja: 'せんしゅを　えらんでね' },
    championKicker: { en: 'YOUR TEAM', zh: '你的小隊', ja: 'きみの　チーム' },
    championHeading: { en: 'Who will spar for you?', zh: '誰要幫你出招？', ja: 'だれが　たたかうかな？' },
    championSoftNote: { en: 'Pretend moves, no ouchies 🧡', zh: '假裝出招，不會受傷 🧡', ja: 'ごっこあそびだよ、いたくないよ 🧡' },
    startButton: { en: '▶ Start!', zh: '▶ 開始！', ja: '▶ スタート！' },
    startInvite: {
      en: 'Tap Start to turn on sound and hear the first question!',
      zh: '點一下開始，打開聲音，聽第一題！',
      ja: 'スタートを　タップして　おとを　つけると、さいしょの　もんだいが　きこえるよ！',
    },
    textLabel: { en: 'TEXT', zh: '文字', ja: 'もじ' },
    arenaSectionLabel: { en: 'The sparring arena', zh: '對打擂台', ja: 'たいけつステージ' },
    arenaHeading: { en: 'THE SPARRING ARENA', zh: '對打擂台', ja: 'たいけつステージ' },
    heroSide: { en: 'YOUR CHAMPION', zh: '你的隊長', ja: 'きみの　せんしゅ' },
    buddySide: { en: 'SPARRING BUDDY', zh: '對打夥伴', ja: 'たいけつの　あいて' },
    teamStars: { en: 'TEAM STARS', zh: '團隊星星', ja: 'チームの　ほし' },
    arenaLayoutLabel: { en: 'Sparring word and math game', zh: '對打單字與數學遊戲', ja: 'たいけつ　ことば・すうがくゲーム' },
    challengeSectionLabel: { en: 'Choose and answer a challenge', zh: '選擇並回答挑戰', ja: 'もんだいを　えらんで　こたえてね' },
    challengeKicker: { en: 'YOUR NEXT MOVE', zh: '換你出招', ja: 'つぎは　きみの　ばん' },
    challengeHeading: { en: 'Pick a challenge!', zh: '選一個挑戰！', ja: 'もんだいを　えらんでね！' },
    topicTabsLabel: { en: 'Learning challenges', zh: '學習挑戰', ja: 'まなびの　もんだい' },
    levelGroupLabel: { en: 'Level', zh: '難度', ja: 'レベル' },
    levelLabel: { en: 'LEVEL', zh: '難度', ja: 'レベル' },
    voiceLabel: { en: 'VOICE', zh: '語音', ja: 'おんせい' },
    voiceGroupLabel: { en: 'Spoken language', zh: '語音語言', ja: 'はなす　ことば' },
    soundControlsLabel: { en: 'Sound controls', zh: '聲音控制', ja: 'おとの　そうさ' },
    replayButton: { en: '↻ Hear question', zh: '↻ 再聽一次', ja: '↻ もんだいを　きく' },
    muteButton: { en: '🔊 Mute', zh: '🔊 靜音', ja: '🔊 ミュート' },
    unmuteButton: { en: '🔇 Unmute', zh: '🔇 取消靜音', ja: '🔇 ミュートかいじょ' },
    musicButton: { en: '🎵 Music', zh: '🎵 音樂', ja: '🎵 おんがく' },
    audioUnavailable: {
      en: 'Audio is unavailable. You can still tap an answer.',
      zh: '目前無法播放語音，仍可點選答案。',
      ja: 'おとが　でません。こたえは　タップできるよ。',
    },
    soundMuted: { en: 'Sound is muted.', zh: '聲音已靜音。', ja: 'おとは　ミュートちゅうです。' },
    answerHint: { en: 'Tap your answer', zh: '點一個答案', ja: 'こたえを　タップしてね' },
    answerGroupLabelWord: { en: 'Choose a word', zh: '選一個詞', ja: 'ことばを　えらんでね' },
    answerGroupLabelNumber: { en: 'Choose a number', zh: '選一個數字', ja: 'かずを　えらんでね' },
    feedbackDefault: { en: 'No rush—thinking is a superpower!', zh: '慢慢想，你最棒！', ja: 'あわてなくて　いいよ、かんがえるのが　とくいだね！' },
    feedbackRetry: { en: 'That’s okay! Let’s try another one.', zh: '沒關係，再試一次！', ja: 'だいじょうぶ！もういちど　やってみよう！' },
    feedbackCorrect: { en: 'You got it! Power move!', zh: '答對了！出招成功！', ja: 'せいかい！とくぎ　はつどう！' },
    nextButton: { en: 'Next power move ➜', zh: '下一招 ➜', ja: 'つぎの　とくぎ ➜' },
    finishHeading: { en: 'You’re a Sparring Champion!', zh: '你是小冠軍！', ja: 'きみは　チャンピオンだ！' },
    finishBody: {
      en: 'Three power moves! Your buddy is out of power, takes a bow, and gives you a high-five.',
      zh: '成功出招！對手沒電了，鞠躬擊掌！',
      ja: 'とくぎ　せいこう！あいては　でんちぎれ、おじぎして　ハイタッチ！',
    },
    playAgainButton: { en: 'Play again ↻', zh: '再玩一次 ↻', ja: 'もういちど　あそぶ ↻' },
    footer: { en: 'Everybody gets a cheer. Try again any time!', zh: '每個人都很棒，想試幾次都可以！', ja: 'みんな　がんばったね！なんかいでも　ちょうせんできるよ！' },
    superGenericPrompt: {
      en: 'Listen carefully and choose!',
      zh: '仔細聽，選一個！',
      ja: 'よく　きいて　えらんでね！',
    },
    readyMessage: { en: 'Ready, team? Pick any challenge!', zh: '準備好了嗎？選一個挑戰吧！', ja: 'じゅんびは　いい？もんだいを　えらんでね！' },
    yourTurnMessage: { en: 'Your turn, team!', zh: '換你了！', ja: 'きみの　ばんだよ！' },
    blockMessage: { en: 'Pillow block! Let’s think together!', zh: '枕頭擋住了！我們一起想一想！', ja: 'まくらで　ブロック！いっしょに　かんがえよう！' },
  };

  function championReady(championId, lang) {
    const name = CHAMPIONS[championId].shortName[lang];
    return { en: `${name} is ready to spar!`, zh: `${name}準備好出招了！`, ja: `${name}は　じゅんびオーケー！` }[lang];
  }

  function topicChosenMessage(topicId, lang) {
    const name = TOPIC_NAMES[topicId][lang];
    return {
      en: `${name} challenge—your turn!`,
      zh: `${name}挑戰—換你出招！`,
      ja: `${name}の　もんだいだよ、きみの　ばん！`,
    }[lang];
  }

  function levelChosenMessage(levelId, lang) {
    const name = LEVEL_NAMES[levelId];
    return {
      easy: { en: `Easy level—picture shown, three choices! ${name.zh}：看圖選一個，三個選項！`, zh: `簡單難度：看圖選一個，三個選項！`, ja: `かんたんレベル：えを　みて　えらぶよ、３つから　選べる！` },
      harder: { en: 'Harder level—no picture, read the word, four choices!', zh: '進階難度：沒有圖片，讀出文字，四個選項！', ja: 'すこしむずかしいレベル：えは　なし、もじを　よんでね、４つから　選べる！' },
      super: { en: 'Super level—listen only, four choices!', zh: '超級難度：只能用聽的，四個選項！', ja: 'ちょうむずかしいレベル：きくだけだよ、４つから　選べる！' },
    }[levelId][lang];
  }

  function sparMessage(championId, buddyFinished, comboText, lang) {
    const champion = CHAMPIONS[championId];
    const name = champion.shortName[lang];
    const buddy = champion.buddyShortName[lang];
    const move = champion.move[lang];
    const base = buddyFinished
      ? { en: `${buddy} is out of power—bow and high-five!`, zh: `${buddy}沒電了，鞠躬擊掌！`, ja: `${buddy}は　でんち　きれた！おじぎして　ハイタッチ！` }[lang]
      : { en: `${name} used ${move}! ${buddy} wobbles and giggles!`, zh: `${name}${move}！${buddy}晃一晃，哈哈笑！`, ja: `${name}の　${move}！${buddy}は　ふらふら　わらってる！` }[lang];
    return comboText ? `${base} ${comboText}` : base;
  }

  const api = { TEXT_LANGUAGES, TOPIC_NAMES, LEVEL_NAMES, CHAMPIONS, STRINGS, championReady, topicChosenMessage, levelChosenMessage, sparMessage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaI18n = api;
})();
