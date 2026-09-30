(() => {
  'use strict';

  // On-screen text in three languages. Japanese strings are written entirely in hiragana
  // (including words usually spelled in katakana or kanji) so a pre-reading child can sound
  // them out. This is separate from audio/prompts.json, whose Japanese text is chosen for
  // correct Gemini TTS pronunciation and may use kanji or katakana.
  const TEXT_LANGUAGES = ['en', 'zh', 'ja'];

  // Each language's own name, always shown in itself (never translated), for language pickers.
  const LANGUAGE_NAMES = { en: 'English', zh: '繁體中文', ja: 'にほんご' };

  // The one on-screen/voice language a child or grown-up picks also sets a default second,
  // smaller language shown under key text, echoing the game's original English+Chinese pairing.
  const DEFAULT_SECOND_LANGUAGE = { en: 'zh', zh: 'en', ja: 'en' };

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
    textLabel: { en: 'LANGUAGE', zh: '語言', ja: 'げんご' },
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
    // The face topic's picture of a child: the hint under the question and the picture's accessible name.
    diagramHint: { en: 'Tap it on the picture', zh: '在圖上點一點', ja: 'えの　なかで　たっぷしてね' },
    diagramGroupLabel: { en: 'Picture of a child. Tap the part you hear.', zh: '小朋友的圖。點一點你聽到的身體部位。', ja: 'こどもの　え。きいた　ところを　たっぷしてね。' },
    answerGroupLabelWord: { en: 'Choose a word', zh: '選一個詞', ja: 'ことばを　えらんでね' },
    answerGroupLabelNumber: { en: 'Choose a number', zh: '選一個數字', ja: 'かずを　えらんでね' },
    answerGroupLabelPicture: { en: 'Choose a picture', zh: '選一張圖', ja: 'えを　えらんでね' },
    feedbackDefault: { en: 'No rush—thinking is a superpower!', zh: '慢慢想，你最棒！', ja: 'あわてなくて　いいよ、かんがえるのが　とくいだね！' },
    // A wrong tap ends the question: the right choice is shown, a heart floats away (and a star hops back when there
    // is one to lose), then a new question follows. The last heart ends the match.
    feedbackMiss: {
      en: 'Oops! This one was right. A heart floats away and a star hops back.',
      zh: '哎呀！正確答案是這個。一顆愛心飛走了，星星也跳回去了。',
      ja: 'おしい！こたえは　これだよ。はーとが　ひとつ　とんでいって、ほしも　ひとつ　もどるよ。',
    },
    feedbackMissNoStar: {
      en: 'Oops! This one was right. A heart floats away.',
      zh: '哎呀！正確答案是這個。一顆愛心飛走了。',
      ja: 'おしい！こたえは　これだよ。はーとが　ひとつ　とんでいくよ。',
    },
    feedbackLost: {
      en: 'Oops! This one was right. That was the last heart.',
      zh: '哎呀！正確答案是這個。愛心用完了。',
      ja: 'おしい！こたえは　これだよ。はーとが　なくなったよ。',
    },
    heartsLabel: { en: 'HEARTS', zh: '愛心', ja: 'はーと' },
    // A wrong tap costs a heart, so a match cannot be won by tapping at random; the last heart ends it.
    lostHeading: { en: 'Out of hearts!', zh: '愛心用完了！', ja: 'はーとが　なくなっちゃった！' },
    lostBody: {
      en: 'No worries! Your hearts come back when you try again. Listen closely this time!',
      zh: '沒關係！再試一次，愛心就會回來。這次仔細聽喔！',
      ja: 'だいじょうぶ！もういちど　あそぶと、はーとが　もどるよ。こんどは　よく　きいてね！',
    },
    tryAgainButton: { en: 'Try again', zh: '再試一次', ja: 'もういちど' },
    lostMessage: { en: 'Out of hearts! Let’s try the match again!', zh: '愛心用完了！我們再來一場！', ja: 'はーとが　なくなったよ！もういちど　やってみよう！' },
    // Shown (and spoken) after a win that earned no sticker because today's cap for this language and level is used up.
    capNoteHarderOrLanguage: {
      en: 'Great win! To earn your next sticker, try a harder level or another language.',
      zh: '你贏了！想拿下一張貼紙，請試試更難的難度，或換一種語言。',
      ja: 'やったね！つぎの　しーるは、もっと　むずかしい　れべるか、ほかの　げんごで　もらえるよ。',
    },
    capNoteHarder: {
      en: 'Great win! To earn your next sticker, try a harder level.',
      zh: '你贏了！想拿下一張貼紙，請試試更難的難度。',
      ja: 'やったね！つぎの　しーるは、もっと　むずかしい　れべるで　もらえるよ。',
    },
    capNoteLanguage: {
      en: 'Great win! To earn your next sticker, try another language.',
      zh: '你贏了！想拿下一張貼紙，請換一種語言試試。',
      ja: 'やったね！つぎの　しーるは、ほかの　げんごで　もらえるよ。',
    },
    capNoteTomorrow: {
      en: 'Great win! That is all the stickers for today. Come back tomorrow for more!',
      zh: '你贏了！今天的貼紙都拿完了，明天再來拿更多！',
      ja: 'やったね！きょうの　しーるは　ぜんぶ　もらったよ。あしたも　また　きてね！',
    },
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
    settingsIntro: {
      en: 'Choose what your child can play, hear, and see here.',
      zh: '在這裡選擇孩子能玩、能聽、能看到的內容。',
      ja: 'ここで　おこさんが　あそべる／きける／みられる　ないようを　えらべるよ。',
    },
    settingsLevelLockTitle: { en: 'Levels this child can pick', zh: '孩子可以選的難度', ja: 'えらべる　れべる' },
    settingsLevelLockHint: {
      en: 'Uncheck a level to hide it from the level picker. At least one stays on.',
      zh: '取消勾選可隱藏該難度，至少會保留一個。',
      ja: 'ちぇっくを　はずすと、その　れべるは　えらべなくなるよ。ひとつは　のこるよ。',
    },
    settingsSecondLanguageTitle: { en: 'Second language', zh: '第二語言', ja: 'にばんめの　げんご' },
    settingsSecondLanguageHint: {
      en: 'Shows a smaller second language under key words and titles. Turn it off for one language only.',
      zh: '在重要文字下方顯示較小的第二語言。關閉即可只顯示一種語言。',
      ja: 'だいじな　ことばの　したに、ちいさく　にばんめの　げんごを　みせるよ。けすと　げんごは　ひとつだけに　なるよ。',
    },
    settingsSecondLanguageOff: { en: 'Off', zh: '關閉', ja: 'けす' },
    settingsVoiceTitle: { en: 'Narration voice', zh: '朗讀語音', ja: 'よみあげの　こえ' },
    settingsVoiceHint: {
      en: 'By default the spoken narration matches the language above. A grown-up can pick a different voice here.',
      zh: '預設語音朗讀會跟上面選的語言一樣。家長可以在這裡選擇不同的語音。',
      ja: 'ふつうは、うえで　えらんだ　げんごと　おなじ　こえで　よみあげるよ。おとなは　ここで　ちがう　こえを　えらべるよ。',
    },
    settingsVoiceMatchLabel: { en: 'Same as language', zh: '跟語言一樣', ja: 'げんごと　おなじ' },
    settingsSoundTitle: { en: 'Sound', zh: '聲音', ja: 'おと' },
    settingsSoundHint: {
      en: 'Turns narration and sound effects off for everyone playing.',
      zh: '關閉語音朗讀和音效，所有玩家都會靜音。',
      ja: 'よみあげと　こうかおんを　けすよ。あそぶ　ひと　みんなに　きくよ。',
    },
    settingsRewardsTitle: { en: 'Progress so far', zh: '目前的進度', ja: 'いままでの　きろく' },
    settingsRewardsHint: {
      en: 'Stickers earned so far, saved only on this device. Each language and level pays a few stickers a day.',
      zh: '目前拿到的貼紙，只存在這台裝置。每種語言和難度每天可拿幾張貼紙。',
      ja: 'いままで　もらった　しーるだよ。この　きき　だけに　ほぞんするよ。げんごと　れべるごとに、いちにちに　もらえる　かずが　きまってるよ。',
    },
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
      en: 'Saved on this device only: stickers earned, today’s sticker count for each language and level, and each champion’s costume.',
      zh: '只存在這台裝置：拿到的貼紙、今天各語言和難度的貼紙數，以及服裝。',
      ja: 'この　きき　だけに、もらった　しーると、きょうの　げんごと　れべるごとの　かずと、ふくを　ほぞんするよ。',
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

  function levelChosenMessage(levelId, lang, topicId = null) {
    if (topicId === 'math') {
      return {
        easy: { en: 'Easy level—count the eggs, add or take away within five, three choices!', zh: '簡單難度：數一數蛋，五以內的加減，三個選項！', ja: 'かんたんれべる：たまごを　かぞえて、５までの　たしざんと　ひきざん、３つから　えらべるよ！' },
        harder: { en: 'Harder level—count, add, and take away within ten, four choices!', zh: '進階難度：十以內的數數、加法和減法，四個選項！', ja: 'すこしむずかしいれべる：１０までの　かぞえる・たす・ひく、４つから　えらべるよ！' },
        super: { en: 'Super level—plus and minus, no pictures, four choices!', zh: '超級難度：加法和減法混在一起，沒有圖片，四個選項！', ja: 'ちょうむずかしいれべる：たしざんと　ひきざん、えは　なし、４つから　えらべるよ！' },
      }[levelId][lang];
    }
    return {
      easy: { en: 'Easy level—read the question, then pick the right picture from three!', zh: '簡單難度：讀題目，從三張圖裡選出正確的！', ja: 'かんたんれべる：もんだいを　よんで、３つの　えから　ただしい　えを　えらぶよ！' },
      harder: { en: 'Harder level—read the word, then pick the right picture from four!', zh: '進階難度：讀出文字，從四張圖裡選出正確的！', ja: 'すこしむずかしいれべる：もじを　よんで、４つの　えから　ただしい　えを　えらぶよ！' },
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
    return { en: `${wins} sticker${wins === 1 ? '' : 's'} earned`, zh: `拿到 ${wins} 張貼紙`, ja: `しーるを　${wins}まい　もらった` }[lang];
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
      en: `You earned ${wins} ${wins === 1 ? 'sticker' : 'stickers'}! Each language and level pays a few a day. Try a harder level or another language for more.`,
      zh: `你拿到 ${wins} 張貼紙！每種語言和難度每天可拿幾張，試試更難的難度或換一種語言，就能拿更多。`,
      ja: `しーるを　${wins}まい　もらったね！げんごと　れべるごとに、いちにちに　もらえる　かずが　きまってるよ。むずかしい　れべるか　ほかの　げんごで　もっと　もらえるよ。`,
    }[lang];
  }

  function stickerStillToFind(index, lang) {
    return { en: `Sticker ${index}: still to find`, zh: `第 ${index} 張：還沒拿到`, ja: `${index}まいめ：まだ　もってないよ` }[lang];
  }

  function costumeWinsToGo(wins, lang) {
    return { en: `${wins} stickers`, zh: `拿 ${wins} 張貼紙`, ja: `${wins}まい　もらうと` }[lang];
  }

  function costumeSurpriseHint(name, lang) {
    return { en: `${name} surprise`, zh: `${name}驚喜`, ja: `${name}の　おたのしみ` }[lang];
  }

  function costumeRowLabel(name, lang) {
    return { en: `${name}'s costume`, zh: `${name}的服裝`, ja: `${name}の　ふく` }[lang];
  }

  function nextSurpriseHint(name, wins, lang) {
    return {
      en: `Next surprise: ${name} in ${wins} more ${wins === 1 ? 'sticker' : 'stickers'}`,
      zh: `再拿 ${wins} 張貼紙得${name}`,
      ja: `あと${wins}まい　もらうと　${name}`,
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

  // The friendly line after a win that earned no sticker; `advice` comes from the rewards' recordWin result.
  const CAP_NOTES = {
    'harder-or-language': 'capNoteHarderOrLanguage',
    harder: 'capNoteHarder',
    language: 'capNoteLanguage',
    tomorrow: 'capNoteTomorrow',
  };

  function capNote(advice, lang) {
    return STRINGS[CAP_NOTES[advice] || CAP_NOTES.tomorrow][lang];
  }

  // How many hearts are left after a miss, in the child's language.
  function heartsLeft(hearts, lang) {
    if (hearts === 1) return { en: 'Only 1 heart left!', zh: '只剩最後 1 顆愛心！', ja: 'はーとは　あと　ひとつ！' }[lang];
    return { en: `${hearts} hearts left.`, zh: `還剩 ${hearts} 顆愛心。`, ja: `はーとは　あと　${hearts}こ。` }[lang];
  }

  function heartsAria(hearts, max, lang) {
    return { en: `${hearts} of ${max} hearts left`, zh: `剩下 ${hearts} / ${max} 顆愛心`, ja: `はーとは　${hearts} / ${max}こ` }[lang];
  }

  function bilingualNode(mainText, secondValue) {
    if (!secondValue || secondValue === mainText) return document.createTextNode(mainText);
    const wrap = document.createElement('span');
    wrap.className = 'bilingual';
    const main = document.createElement('span');
    main.className = 'lang-main';
    main.textContent = mainText;
    const second = document.createElement('span');
    second.className = 'lang-second';
    second.textContent = secondValue;
    wrap.append(main, second);
    return wrap;
  }

  function setBilingual(el, mainText, secondValue) {
    el.replaceChildren(bilingualNode(mainText, secondValue));
  }

  const api = {
    TEXT_LANGUAGES, LANGUAGE_NAMES, DEFAULT_SECOND_LANGUAGE, TOPIC_NAMES, LEVEL_NAMES, CHAMPIONS, STRINGS,
    championReady, topicChosenMessage, levelChosenMessage, finishBody, sparMessage, capNote, heartsLeft, heartsAria,
    settingsWinsSummary, settingsStickerSummary, rewardBookIntroWins, stickerStillToFind,
    costumeWinsToGo, costumeSurpriseHint, costumeRowLabel, nextSurpriseHint,
    rewardSummaryPattern, rewardUnlockText, bilingualNode, setBilingual,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.FriendlyArenaI18n = api;
})();
