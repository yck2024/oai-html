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
      move: { en: 'Tail Swish', zh: '甩尾巴', ja: 'しっぽすいんぐ' },
      buddyShortName: { en: 'Bobo', zh: '波波', ja: 'ぼぼ' },
    },
    monster: {
      name: { en: 'Bobo the Monster', zh: '波波怪獸', ja: 'かいじゅうの　ぼぼ' },
      shortName: { en: 'Bobo', zh: '波波', ja: 'ぼぼ' },
      move: { en: 'Bubble Blast', zh: '泡泡砲', ja: 'あわぱんち' },
      buddyShortName: { en: 'Rex', zh: '雷克斯', ja: 'れっくす' },
    },
  };

  // Fixed chrome strings, one function/string per language.
  const STRINGS = {
    galleryLink: { en: '← Gallery', zh: '← 回畫廊', ja: '← ぎゃらりーへ' },
    topLabel: { en: 'PLAY · LEARN · CHEER', zh: '玩樂・學習・加油', ja: 'あそぶ・まなぶ・おうえん' },
    restartButton: { en: '↻ Start over', zh: '↻ 重新開始', ja: '↻ さいしょから' },
    eyebrow: { en: 'A pretend sparring face-off · no ouchies', zh: '假裝對打，不會受傷', ja: 'ごっこあそびの　たいけつ・いたくないよ' },
    gameTitle: { en: 'Dino & Monster Word Arena', zh: '恐龍怪獸友誼擂台', ja: 'きょうりゅうと　かいじゅうの　ことばありーな' },
    introBody: {
      en: 'Pick a champion, solve a little challenge, and launch a silly power move!',
      zh: '選一位小隊長，答對就出招！',
      ja: 'せんしゅを　えらんで、もんだいに　こたえて、とくぎを　だそう！',
    },
    championSectionLabel: { en: 'Choose your champion', zh: '選一位小隊長', ja: 'せんしゅを　えらんでね' },
    championKicker: { en: 'YOUR TEAM', zh: '你的小隊', ja: 'きみの　ちーむ' },
    championHeading: { en: 'Who will spar for you?', zh: '誰要幫你出招？', ja: 'だれが　たたかうかな？' },
    championSoftNote: { en: 'Pretend moves, no ouchies 🧡', zh: '假裝出招，不會受傷 🧡', ja: 'ごっこあそびだよ、いたくないよ 🧡' },
    startButton: { en: '▶ Start!', zh: '▶ 開始！', ja: '▶ すたーと！' },
    startInvite: {
      en: 'Tap Start to turn on sound and hear the first question!',
      zh: '點一下開始，打開聲音，聽第一題！',
      ja: 'すたーとを　たっぷして　おとを　つけると、さいしょの　もんだいが　きこえるよ！',
    },
    textLabel: { en: 'TEXT', zh: '文字', ja: 'もじ' },
    arenaSectionLabel: { en: 'The sparring arena', zh: '對打擂台', ja: 'たいけつすてーじ' },
    arenaHeading: { en: 'THE SPARRING ARENA', zh: '對打擂台', ja: 'たいけつすてーじ' },
    heroSide: { en: 'YOUR CHAMPION', zh: '你的隊長', ja: 'きみの　せんしゅ' },
    buddySide: { en: 'SPARRING BUDDY', zh: '對打夥伴', ja: 'たいけつの　あいて' },
    teamStars: { en: 'TEAM STARS', zh: '團隊星星', ja: 'ちーむの　ほし' },
    arenaLayoutLabel: { en: 'Sparring word and math game', zh: '對打單字與數學遊戲', ja: 'たいけつ　ことば・すうがくげーむ' },
    challengeSectionLabel: { en: 'Choose and answer a challenge', zh: '選擇並回答挑戰', ja: 'もんだいを　えらんで　こたえてね' },
    challengeKicker: { en: 'YOUR NEXT MOVE', zh: '換你出招', ja: 'つぎは　きみの　ばん' },
    challengeHeading: { en: 'Pick a challenge!', zh: '選一個挑戰！', ja: 'もんだいを　えらんでね！' },
    topicTabsLabel: { en: 'Learning challenges', zh: '學習挑戰', ja: 'まなびの　もんだい' },
    levelGroupLabel: { en: 'Level', zh: '難度', ja: 'れべる' },
    levelLabel: { en: 'LEVEL', zh: '難度', ja: 'れべる' },
    voiceLabel: { en: 'VOICE', zh: '語音', ja: 'おんせい' },
    voiceGroupLabel: { en: 'Spoken language', zh: '語音語言', ja: 'はなす　ことば' },
    soundControlsLabel: { en: 'Sound controls', zh: '聲音控制', ja: 'おとの　そうさ' },
    replayButton: { en: '↻ Hear question', zh: '↻ 再聽一次', ja: '↻ もんだいを　きく' },
    muteButton: { en: '🔊 Mute', zh: '🔊 靜音', ja: '🔊 みゅーと' },
    unmuteButton: { en: '🔇 Unmute', zh: '🔇 取消靜音', ja: '🔇 みゅーとかいじょ' },
    musicButton: { en: '🎵 Music', zh: '🎵 音樂', ja: '🎵 おんがく' },
    audioUnavailable: {
      en: 'Audio is unavailable. You can still tap an answer.',
      zh: '目前無法播放語音，仍可點選答案。',
      ja: 'おとが　でません。こたえは　たっぷできるよ。',
    },
    soundMuted: { en: 'Sound is muted.', zh: '聲音已靜音。', ja: 'おとは　みゅーとちゅうです。' },
    answerHint: { en: 'Tap your answer', zh: '點一個答案', ja: 'こたえを　たっぷしてね' },
    answerGroupLabelWord: { en: 'Choose a word', zh: '選一個詞', ja: 'ことばを　えらんでね' },
    answerGroupLabelNumber: { en: 'Choose a number', zh: '選一個數字', ja: 'かずを　えらんでね' },
    feedbackDefault: { en: 'No rush—thinking is a superpower!', zh: '慢慢想，你最棒！', ja: 'あわてなくて　いいよ、かんがえるのが　とくいだね！' },
    feedbackRetry: { en: 'That’s okay! Let’s try another one.', zh: '沒關係，再試一次！', ja: 'だいじょうぶ！もういちど　やってみよう！' },
    feedbackCorrect: { en: 'You got it! Power move!', zh: '答對了！出招成功！', ja: 'せいかい！とくぎ　はつどう！' },
    nextButton: { en: 'Next power move ➜', zh: '下一招 ➜', ja: 'つぎの　とくぎ ➜' },
    finishHeading: { en: 'You’re a Sparring Champion!', zh: '你是小冠軍！', ja: 'きみは　ちゃんぴおんだ！' },
    playAgainButton: { en: 'Play again ↻', zh: '再玩一次 ↻', ja: 'もういちど　あそぶ ↻' },
    footer: { en: 'Everybody gets a cheer. Try again any time!', zh: '每個人都很棒，想試幾次都可以！', ja: 'みんな　がんばったね！なんかいでも　ちょうせんできるよ！' },
    superGenericPrompt: {
      en: 'Listen carefully and choose!',
      zh: '仔細聽，選一個！',
      ja: 'よく　きいて　えらんでね！',
    },
    readyMessage: { en: 'Ready, team? Pick any challenge!', zh: '準備好了嗎？選一個挑戰吧！', ja: 'じゅんびは　いい？もんだいを　えらんでね！' },
    yourTurnMessage: { en: 'Your turn, team!', zh: '換你了！', ja: 'きみの　ばんだよ！' },
    blockMessage: { en: 'Pillow block! Let’s think together!', zh: '枕頭擋住了！我們一起想一想！', ja: 'まくらで　ぶろっく！いっしょに　かんがえよう！' },

    settingsButton: { en: '⚙️ Grown-ups', zh: '⚙️ 家長專區', ja: '⚙️ おとなむけ' },
    settingsButtonLabel: { en: 'Grown-up settings', zh: '家長設定', ja: 'おとなの　せってい' },
    gateTitle: { en: 'Grown-ups only', zh: '僅限家長', ja: 'おとなだけ' },
    gateBody: {
      en: 'To keep settings for grown-ups, please solve this:',
      zh: '為了保護家長設定，請先回答：',
      ja: 'せっていを　まもるために、この　もんだいに　こたえてね：',
    },
    gateInputLabel: { en: 'Your answer', zh: '你的答案', ja: 'こたえ' },
    gateSubmit: { en: 'Enter', zh: '確認', ja: 'けってい' },
    gateWrong: {
      en: 'Not quite—here’s a new one.',
      zh: '不太對，換一題再試試。',
      ja: 'ちがうよ。もんだいを　かえるね。' },
    gateCancel: { en: 'Cancel', zh: '取消', ja: 'やめる' },
    settingsTitle: { en: 'Grown-up settings', zh: '家長設定', ja: 'おとなの　せってい' },
    settingsClose: { en: '✕ Close', zh: '✕ 關閉', ja: '✕ とじる' },
    settingsLevelLockTitle: { en: 'Levels this child can pick', zh: '孩子可以選的難度', ja: 'えらべる　れべる' },
    settingsLevelLockHint: {
      en: 'Uncheck a level to hide it from the level picker. At least one stays on.',
      zh: '取消勾選可隱藏該難度，至少會保留一個。',
      ja: 'ちぇっくを　はずすと、その　れべるは　えらべなくなるよ。ひとつは　のこるよ。',
    },
    settingsSoundTitle: { en: 'Sound', zh: '聲音', ja: 'おと' },
    settingsRewardsTitle: { en: 'Progress so far', zh: '目前的進度', ja: 'いままでの　きろく' },
    settingsClearButton: { en: 'Clear sticker book', zh: '清空貼紙本', ja: 'しーるちょうを　けす' },
    settingsConfirmClear: { en: 'Yes, clear it', zh: '確定清空', ja: 'けす' },
    settingsKeepStickers: { en: 'Keep stickers', zh: '保留貼紙', ja: 'のこす' },
    settingsClearedStatus: { en: 'Sticker book cleared.', zh: '貼紙本已清空。', ja: 'しーるちょうを　けしたよ。' },
    settingsDeviceNote: {
      en: 'These settings are saved on this device only.',
      zh: '這些設定只存在這台裝置。',
      ja: 'この　せっていは　この　きき　だけに　ほぞんされるよ。',
    },

    stickerBookButton: { en: '📒 Sticker book', zh: '📒 貼紙本', ja: '📒 しーるちょう' },
    rewardBookTitle: { en: 'My Sticker Book', zh: '我的貼紙本', ja: 'わたしの　しーるちょう' },
    rewardBookClose: { en: '✕ Close', zh: '✕ 關閉', ja: '✕ とじる' },
    costumeTitle: { en: 'Dress-up for your champion', zh: '小隊長換裝', ja: 'せんしゅの　きがえ' },
    rewardBookIntroEmpty: {
      en: 'Win a match to get your first sticker!',
      zh: '贏一場就能拿到第一張貼紙！',
      ja: 'いちど　かつと、さいしょの　しーるが　もらえるよ！',
    },
    rewardBookFull: {
      en: 'Your sticker book is full!',
      zh: '貼紙簿滿了！',
      ja: 'しーるちょうが　いっぱいに　なったよ！',
    },
    costumeNoneLabel: { en: 'None', zh: '不戴', ja: 'なし' },
    saveNotePersistent: {
      en: 'Saved on this device only: the number of wins and each champion’s costume.',
      zh: '只存在這台裝置：贏的次數和服裝。',
      ja: 'この　きき　だけに、かった　かずと　ふくを　ほぞんするよ。',
    },
    saveNoteNotPersistent: {
      en: 'This browser can’t save, so stickers last for this visit.',
      zh: '這個瀏覽器無法儲存，貼紙只保留到這次遊玩結束。',
      ja: 'この　ぶらうざは　ほぞんできないから、しーるは　こんかいだけ　のこるよ。',
    },
    allCostumesUnlocked: {
      en: 'All costumes unlocked!',
      zh: '服裝全部拿到了！',
      ja: 'ふくを　ぜんぶ　もらったよ！',
    },
    rewardNewStickerTitle: { en: 'New sticker!', zh: '新貼紙！', ja: 'あたらしい　しーる！' },
    rewardAnotherStickerTitle: { en: 'Another sticker!', zh: '又一張貼紙！', ja: 'また　しーるが　ふえたよ！' },
    rewardBookLinkButton: { en: '📒 Open sticker book', zh: '📒 打開貼紙本', ja: '📒 しーるちょうを　ひらく' },

    breakPromptTitle: { en: 'Great playing!', zh: '玩得真棒！', ja: 'じょうずに　あそべたね！' },
    breakPromptBody: {
      en: 'Want one more round, or a break?',
      zh: '要再玩一次，還是休息一下？',
      ja: 'もう　いっかい　あそぶ？それとも　きゅうけいする？',
    },
    oneMoreRoundButton: { en: 'One more round 🔁', zh: '再玩一次 🔁', ja: 'もう　いっかい 🔁' },
    takeBreakButton: { en: 'Take a break 🌤️', zh: '休息一下 🌤️', ja: 'きゅうけいする 🌤️' },
    goodbyeTitle: { en: 'Great job today!', zh: '今天表現得真棒！', ja: 'きょうも　よく　がんばったね！' },
    goodbyeBody: {
      en: 'See you again soon, champion.',
      zh: '小隊長，我們下次見！',
      ja: 'せんしゅ、また　あそぼうね！',
    },
    backToPlayButton: { en: 'I’m ready to play! ↻', zh: '我準備好了！↻', ja: 'あそぶ　じゅんび　できたよ！↻' },
  };

  function championReady(championId, lang) {
    const name = CHAMPIONS[championId].shortName[lang];
    return { en: `${name} is ready to spar!`, zh: `${name}準備好出招了！`, ja: `${name}は　じゅんびおーけー！` }[lang];
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
    return {
      easy: { en: 'Easy level—picture shown, three choices!', zh: '簡單難度：看圖選一個，三個選項！', ja: 'かんたんれべる：えを　みて　えらぶよ、３つから　えらべるよ！' },
      harder: { en: 'Harder level—no picture, read the word, four choices!', zh: '進階難度：沒有圖片，讀出文字，四個選項！', ja: 'すこしむずかしいれべる：えは　なし、もじを　よんでね、４つから　えらべるよ！' },
      super: { en: 'Super level—listen only, four choices!', zh: '超級難度：只能用聽的，四個選項！', ja: 'ちょうむずかしいれべる：きくだけだよ、４つから　えらべるよ！' },
    }[levelId][lang];
  }

  function finishBody(goal, lang) {
    return {
      en: `${goal} power move${goal === 1 ? '' : 's'}! Your buddy is out of power, takes a bow, and gives you a high-five.`,
      zh: '成功出招！對手沒電了，鞠躬擊掌！',
      ja: 'とくぎ　せいこう！あいては　でんちぎれ、おじぎして　はいたっち！',
    }[lang];
  }

  function sparMessage(championId, buddyFinished, comboText, lang) {
    const champion = CHAMPIONS[championId];
    const name = champion.shortName[lang];
    const buddy = champion.buddyShortName[lang];
    const move = champion.move[lang];
    const base = buddyFinished
      ? { en: `${buddy} is out of power—bow and high-five!`, zh: `${buddy}沒電了，鞠躬擊掌！`, ja: `${buddy}は　でんち　きれた！おじぎして　はいたっち！` }[lang]
      : { en: `${name} used ${move}! ${buddy} wobbles and giggles!`, zh: `${name}${move}！${buddy}晃一晃，哈哈笑！`, ja: `${name}の　${move}！${buddy}は　ふらふら　わらってる！` }[lang];
    return comboText ? `${base} ${comboText}` : base;
  }

  function settingsWinsSummary(wins, lang) {
    return { en: `${wins} match${wins === 1 ? '' : 'es'} won`, zh: `贏了 ${wins} 場`, ja: `${wins}かい　かった` }[lang];
  }

  function settingsStickerSummary(collected, total, lang) {
    return {
      en: `${collected} / ${total} stickers collected`,
      zh: `蒐集了 ${collected} / ${total} 張貼紙`,
      ja: `しーるを　${collected} / ${total}まい　あつめたよ`,
    }[lang];
  }

  function rewardBookIntroWins(wins, lang) {
    return {
      en: `You won ${wins} ${wins === 1 ? 'match' : 'matches'}! Every win brings a sticker.`,
      zh: `你贏了 ${wins} 場！每贏一場就有一張貼紙。`,
      ja: `${wins}かい　かったね！かつたびに　しーるが　もらえるよ。`,
    }[lang];
  }

  function stickerStillToFind(index, lang) {
    return { en: `Sticker ${index}: still to find`, zh: `第 ${index} 張：還沒拿到`, ja: `${index}まいめ：まだ　もってないよ` }[lang];
  }

  function costumeWinsToGo(wins, lang) {
    return { en: `${wins} wins`, zh: `贏 ${wins} 次`, ja: `${wins}かい　かつと` }[lang];
  }

  function costumeSurpriseHint(name, lang) {
    return { en: `${name} surprise`, zh: `${name}驚喜`, ja: `${name}の　おたのしみ` }[lang];
  }

  function costumeRowLabel(name, lang) {
    return { en: `${name}'s costume`, zh: `${name}的服裝`, ja: `${name}の　ふく` }[lang];
  }

  function nextSurpriseHint(name, wins, lang) {
    return {
      en: `Next surprise: ${name} in ${wins} ${wins === 1 ? 'win' : 'wins'}`,
      zh: `再贏 ${wins} 次拿${name}`,
      ja: `あと${wins}かい　かつと　${name}`,
    }[lang];
  }

  function rewardSummaryPattern(collected, total, lang) {
    return { en: `📒 ${collected} / ${total} stickers`, zh: `📒 ${collected} / ${total} 張貼紙`, ja: `📒 しーる ${collected} / ${total}まい` }[lang];
  }

  function rewardUnlockText(championName, costumeName, lang) {
    return {
      en: `🎁 ${championName} gets a ${costumeName} to wear!`,
      zh: `🎁 ${championName}戴上${costumeName}了！`,
      ja: `🎁 ${championName}が　${costumeName}を　みにつけたよ！`,
    }[lang];
  }

  const api = {
    TEXT_LANGUAGES, TOPIC_NAMES, LEVEL_NAMES, CHAMPIONS, STRINGS,
    championReady, topicChosenMessage, levelChosenMessage, finishBody, sparMessage,
    settingsWinsSummary, settingsStickerSummary, rewardBookIntroWins, stickerStillToFind,
    costumeWinsToGo, costumeSurpriseHint, costumeRowLabel, nextSurpriseHint,
    rewardSummaryPattern, rewardUnlockText,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaI18n = api;
})();
