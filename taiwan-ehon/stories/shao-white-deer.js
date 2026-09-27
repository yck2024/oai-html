// Standalone story data for 邵族白鹿傳說 (Shao / Ita Thao, Sun Moon Lake).
// Not yet registered in ../stories.js; this file will be merged into that shared array
// once PR #20 (the launch pair) has merged. Same schema as ../stories.js: `zhuyin` holds
// one 注音 syllable per Han character of `zh`, separated by spaces. Japanese marks
// furigana as {漢字|かんじ}; every kanji in `ja` must be wrapped this way. `speaker` and
// `style` direct the build-time narration only; the optional `jaTts` / `zhTts` replace
// the text sent to the narrator to fix a misreading.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else root.TaiwanEhonStoryShaoWhiteDeer = story;
})(typeof self !== 'undefined' ? self : this, {
  "id": "shao-white-deer",
  "title": {
    "ja": "しろい しかが みちびいた みずうみ",
    "zh": "白鹿傳說",
    "zhuyin": "ㄅㄞˊ ㄌㄨˋ ㄔㄨㄢˊ ㄕㄨㄛ"
  },
  "tagline": {
    "ja": "しろい しかを おいかけて、みずうみを みつけた たびの おはなし",
    "zh": "追隨白鹿，找到湖泊的旅程"
  },
  "origin": {
    "ja": "たいわんの サオ{族|ぞく}に つたわる おはなし",
    "zh": "台灣邵族的故事"
  },
  "credit": {
    "ja": "サオ{族|ぞく}（イダサオ）は、{日月潭|にちげつたん}の ちかくに くらす たいわんの げんじゅうみんぞくです。 しろい しかの おはなしには いろいろな かたりかたが あり、この えほんは こどもむけに やさしく かきなおしました。",
    "zh": "邵族（伊達邵）生活在日月潭附近，是台灣的原住民族之一。白鹿的故事有不同的說法，這本繪本為小朋友重新改寫。"
  },
  "theme": {
    "accent": "#3d6fa8",
    "soft": "#dcebf7"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/shao-white-deer/cover.webp",
      "alt": {
        "ja": "しろい しかを みつけて おどろく ひとびと",
        "zh": "看見白鹿而驚喜的族人們"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "warm, inviting storyteller opening a picture book, gentle wonder",
          "ja": "たいわん サオ{族|ぞく}に つたわる おはなし『しろい しかが みちびいた みずうみ』",
          "zh": "台灣邵族的故事〈白鹿傳說〉",
          "zhuyin": "ㄊㄞˊ ㄨㄢ ㄕㄠˋ ㄗㄨˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄅㄞˊ ㄌㄨˋ ㄔㄨㄢˊ ㄕㄨㄛ"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "gentle and full of wonder",
          "ja": "しろい しかを おいかけて、みずうみを みつけた ひとびとの おはなしです。",
          "zh": "這是一群人追隨白鹿，找到湖泊的故事。",
          "zhuyin": "ㄓㄜˋ ㄕˋ ㄧ ㄑㄩㄣˊ ㄖㄣˊ ㄓㄨㄟ ㄙㄨㄟˊ ㄅㄞˊ ㄌㄨˋ ㄓㄠˇ ㄉㄠˋ ㄏㄨˊ ㄆㄛ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/shao-white-deer/p01.webp",
      "alt": {
        "ja": "やまの あさ、にもつを まとめる ひとびとと いぬ",
        "zh": "山中清晨整理行囊的族人與獵犬"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "gentle once-upon-a-time storyteller, calm morning mood",
          "ja": "やまの あさ、パダムたちは にもつを まとめて、いえに かえろうと して いました。",
          "zh": "山裡的清晨，帕達木和同伴們正在整理行囊，準備回家。",
          "zhuyin": "ㄕㄢ ㄌㄧˇ ˙ㄉㄜ ㄑㄧㄥ ㄔㄣˊ ㄆㄚˋ ㄉㄚˊ ㄇㄨˋ ㄏㄢˋ ㄊㄨㄥˊ ㄅㄢˋ ˙ㄇㄣ ㄓㄥˋ ㄗㄞˋ ㄓㄥˇ ㄌㄧˇ ㄒㄧㄥˊ ㄋㄤˊ ㄓㄨㄣˇ ㄅㄟˋ ㄏㄨㄟˊ ㄐㄧㄚ"
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "calm and simple",
          "ja": "いぬも いっしょに、やまみちを あるいて いました。",
          "zh": "獵犬也跟著，一起走在山路上。",
          "zhuyin": "ㄌㄧㄝˋ ㄑㄩㄢˇ ㄧㄝˇ ㄍㄣ ˙ㄓㄜ ㄧ ㄑㄧˇ ㄗㄡˇ ㄗㄞˋ ㄕㄢ ㄌㄨˋ ㄕㄤˋ"
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/shao-white-deer/p02.webp",
      "alt": {
        "ja": "もりの むこうに たつ まっしろな しか",
        "zh": "站在森林另一頭的雪白鹿隻"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "sudden, alert, a little surprised",
          "ja": "そのとき、いぬが きゅうに たちどまりました。",
          "zh": "這時候，獵犬突然停下腳步。",
          "zhuyin": "ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄌㄧㄝˋ ㄑㄩㄢˇ ㄊㄨˋ ㄖㄢˊ ㄊㄧㄥˊ ㄒㄧㄚˋ ㄐㄧㄠˇ ㄅㄨˋ"
        },
        {
          "id": "p02-2",
          "speaker": "narrator",
          "style": "hushed wonder, a little magical",
          "ja": "もりの むこうに、まっしろな しかが たって いました。",
          "zh": "森林那頭，站著一隻雪白的鹿。",
          "zhuyin": "ㄙㄣ ㄌㄧㄣˊ ㄋㄚˋ ㄊㄡˊ ㄓㄢˋ ˙ㄓㄜ ㄧ ㄓ ㄒㄩㄝˇ ㄅㄞˊ ˙ㄉㄜ ㄌㄨˋ"
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/shao-white-deer/p03.webp",
      "alt": {
        "ja": "やまみちを あるく しかと、とおくから ついて いく ひとびと",
        "zh": "走在山路上的白鹿，和遠遠跟隨的族人"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "narrator",
          "style": "slow, curious, a little dreamlike",
          "ja": "しろい しかは やまみちを ゆっくり あるいて いきます。",
          "zh": "白鹿沿著山路，慢慢地往前走。",
          "zhuyin": "ㄅㄞˊ ㄌㄨˋ ㄧㄢˊ ˙ㄓㄜ ㄕㄢ ㄌㄨˋ ㄇㄢˋ ㄇㄢˋ ˙ㄉㄜ ㄨㄤˇ ㄑㄧㄢˊ ㄗㄡˇ"
        },
        {
          "id": "p03-2",
          "speaker": "narrator",
          "style": "quiet, careful, respectful curiosity",
          "ja": "パダムたちは、とおくから しずかに ついて いきました。",
          "zh": "帕達木他們，遠遠地安靜跟著。",
          "zhuyin": "ㄆㄚˋ ㄉㄚˊ ㄇㄨˋ ㄊㄚ ˙ㄇㄣ ㄩㄢˇ ㄩㄢˇ ˙ㄉㄜ ㄢ ㄐㄧㄥˋ ㄍㄣ ˙ㄓㄜ",
          "zhTts": "怕達木他們，遠遠地安靜跟著。"
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/shao-white-deer/p04.webp",
      "alt": {
        "ja": "きの したで あわと さつまいもを わけあう ひとびと",
        "zh": "在樹下分享小米和地瓜的族人"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "warm, weary but companionable",
          "ja": "つかれて きたので、みんなで すわって あわと さつまいもを たべました。",
          "zh": "走累了，大家坐下來分吃小米和地瓜。",
          "zhuyin": "ㄗㄡˇ ㄌㄟˋ ˙ㄌㄜ ㄉㄚˋ ㄐㄧㄚ ㄗㄨㄛˋ ㄒㄧㄚˋ ㄌㄞˊ ㄈㄣ ㄔ ㄒㄧㄠˇ ㄇㄧˇ ㄏㄢˋ ㄉㄧˋ ㄍㄨㄚ"
        },
        {
          "id": "p04-2",
          "speaker": "son",
          "style": "encouraging, warm, a young hunter cheering his friends on",
          "ja": "「もう すこしだよ」と、たがいに はげまし あいました。",
          "zh": "「就快到了」，大家互相打氣加油。",
          "zhuyin": "ㄐㄧㄡˋ ㄎㄨㄞˋ ㄉㄠˋ ˙ㄌㄜ ㄉㄚˋ ㄐㄧㄚ ㄏㄨˋ ㄒㄧㄤ ㄉㄚˇ ㄑㄧˋ ㄐㄧㄚ ㄧㄡˊ"
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/shao-white-deer/p05.webp",
      "alt": {
        "ja": "やまを おりて いく しろい しか",
        "zh": "往山下走去的白鹿"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "narrator",
          "style": "curious, a sound drawing them onward",
          "ja": "きが すこしずつ まばらに なり、みずの おとが きこえて きました。",
          "zh": "樹木漸漸稀疏，傳來了水流的聲音。",
          "zhuyin": "ㄕㄨˋ ㄇㄨˋ ㄐㄧㄢˋ ㄐㄧㄢˋ ㄒㄧ ㄕㄨ ㄔㄨㄢˊ ㄌㄞˊ ˙ㄌㄜ ㄕㄨㄟˇ ㄌㄧㄡˊ ˙ㄉㄜ ㄕㄥ ㄧㄣ"
        },
        {
          "id": "p05-2",
          "speaker": "narrator",
          "style": "gentle, descending",
          "ja": "しろい しかは、やまを おりて いきました。",
          "zh": "白鹿往山下走去。",
          "zhuyin": "ㄅㄞˊ ㄌㄨˋ ㄨㄤˇ ㄕㄢ ㄒㄧㄚˋ ㄗㄡˇ ㄑㄩˋ"
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/shao-white-deer/p06.webp",
      "alt": {
        "ja": "みずべを とびこえ、ひかりの なかへ きえる しか",
        "zh": "跳過水邊、消失在光中的鹿"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "soft, magical, a little breathless with wonder",
          "ja": "しかは みずべを ひらりと とびこえ、みずうみの ひかりの なかへ きえて いきました。",
          "zh": "鹿輕輕跳過水邊，消失在湖光之中。",
          "zhuyin": "ㄌㄨˋ ㄑㄧㄥ ㄑㄧㄥ ㄊㄧㄠˋ ㄍㄨㄛˋ ㄕㄨㄟˇ ㄅㄧㄢ ㄒㄧㄠ ㄕ ㄗㄞˋ ㄏㄨˊ ㄍㄨㄤ ㄓ ㄓㄨㄥ"
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/shao-white-deer/p07.webp",
      "alt": {
        "ja": "きよらかな みずうみで およぐ さかなたちと、おどろく ひとびと",
        "zh": "清澈湖水中悠游的魚群，和驚喜的族人"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "bright, full of wonder",
          "ja": "きよらかな みずうみに、さかなが たくさん およいで いました。",
          "zh": "清澈的湖水裡，游著好多好多的魚。",
          "zhuyin": "ㄑㄧㄥ ㄔㄜˋ ˙ㄉㄜ ㄏㄨˊ ㄕㄨㄟˇ ˙ㄌㄧ ㄧㄡˊ ˙ㄓㄜ ㄏㄠˇ ㄉㄨㄛ ㄏㄠˇ ㄉㄨㄛ ˙ㄉㄜ ㄩˊ"
        },
        {
          "id": "p07-2",
          "speaker": "narrator",
          "style": "delighted, amazed",
          "ja": "みんなは、この あたらしい けしきに おどろき、よろこびました。",
          "zh": "大家看見這片新景色，又驚又喜。",
          "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄎㄢˋ ㄐㄧㄢˋ ㄓㄜˋ ㄆㄧㄢˋ ㄒㄧㄣ ㄐㄧㄥˇ ㄙㄜˋ ㄧㄡˋ ㄐㄧㄥ ㄧㄡˋ ㄒㄧˇ"
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/shao-white-deer/p08.webp",
      "alt": {
        "ja": "むらに かえり、かぞくに はなす パダム",
        "zh": "回到部落，向家人述說的帕達木"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "warm, eager to share good news",
          "ja": "パダムは むらに かえり、みずうみと やまの ことを かぞくに はなしました。",
          "zh": "帕達木回到部落，把湖和山的事告訴家人。",
          "zhuyin": "ㄆㄚˋ ㄉㄚˊ ㄇㄨˋ ㄏㄨㄟˊ ㄉㄠˋ ㄅㄨˋ ㄌㄨㄛˋ ㄅㄚˇ ㄏㄨˊ ㄏㄢˋ ㄕㄢ ˙ㄉㄜ ㄕˋ ㄍㄠˋ ㄙㄨˋ ㄐㄧㄚ ㄖㄣˊ"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/shao-white-deer/p09.webp",
      "alt": {
        "ja": "たねと どうぐを もって しゅっぱつする ひとびと",
        "zh": "帶著種子和用具出發的族人們"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "thoughtful, a family council",
          "ja": "かぞくと むらの ひとたちは、はなしあいました。",
          "zh": "家人和族人們，一起商量討論。",
          "zhuyin": "ㄐㄧㄚ ㄖㄣˊ ㄏㄢˋ ㄗㄨˊ ㄖㄣˊ ˙ㄇㄣ ㄧ ㄑㄧˇ ㄕㄤ ㄌㄧㄤˊ ㄊㄠˇ ㄌㄨㄣˋ"
        },
        {
          "id": "p09-2",
          "speaker": "narrator",
          "style": "hopeful, setting out together",
          "ja": "たねと くらしの どうぐを もって、みんなで しゅっぱつしました。",
          "zh": "帶著種子和生活用具，大家一起出發了。",
          "zhuyin": "ㄉㄞˋ ˙ㄓㄜ ㄓㄨㄥˇ ˙ㄗ ㄏㄢˋ ㄕㄥ ㄏㄨㄛˊ ㄩㄥˋ ㄐㄩˋ ㄉㄚˋ ㄐㄧㄚ ㄧ ㄑㄧˇ ㄔㄨ ㄈㄚ ˙ㄌㄜ"
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/shao-white-deer/p10.webp",
      "alt": {
        "ja": "おおきな きの そばで みずうみを みつめる ひとびと",
        "zh": "在大樹旁望向湖泊的族人"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "narrator",
          "style": "peaceful, arriving",
          "ja": "おおきな きの そばで、みんなは {日月潭|にちげつたん}を みつめました。",
          "zh": "在大樹旁邊，大家望向日月潭。",
          "zhuyin": "ㄗㄞˋ ㄉㄚˋ ㄕㄨˋ ㄆㄤˊ ㄅㄧㄢ ㄉㄚˋ ㄐㄧㄚ ㄨㄤˋ ㄒㄧㄤˋ ㄖˋ ㄩㄝˋ ㄊㄢˊ"
        },
        {
          "id": "p10-2",
          "speaker": "son",
          "style": "warm, hopeful, leading a gentle promise together",
          "ja": "「ここを たいせつに し、いっしょに くらして いこう」と、みんなで やくそくしました。",
          "zh": "「我們要愛惜這裡，一起生活下去」，大家互相約定。",
          "zhuyin": "ㄨㄛˇ ˙ㄇㄣ ㄧㄠˋ ㄞˋ ㄒㄧˊ ㄓㄜˋ ˙ㄌㄧ ㄧ ㄑㄧˇ ㄕㄥ ㄏㄨㄛˊ ㄒㄧㄚˋ ㄑㄩˋ ㄉㄚˋ ㄐㄧㄚ ㄏㄨˋ ㄒㄧㄤ ㄩㄝ ㄉㄧㄥˋ"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/shao-white-deer/end.webp",
      "alt": {
        "ja": "みずうみの ほとりで くらす サオぞくの むら",
        "zh": "定居在湖畔的邵族部落"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "warm, settled, peaceful",
          "ja": "こうして サオ{族|ぞく}の ひとびとは、{日月潭|にちげつたん}の ほとりで くらすように なりました。",
          "zh": "從此，邵族的族人便定居在日月潭畔。",
          "zhuyin": "ㄘㄨㄥˊ ㄘˇ ㄕㄠˋ ㄗㄨˊ ˙ㄉㄜ ㄗㄨˊ ㄖㄣˊ ㄅㄧㄢˋ ㄉㄧㄥˋ ㄐㄩ ㄗㄞˋ ㄖˋ ㄩㄝˋ ㄊㄢˊ ㄆㄢˋ"
        },
        {
          "id": "end-2",
          "speaker": "narrator",
          "style": "soft, cozy ending",
          "ja": "おしまい。",
          "zh": "故事說完了。",
          "zhuyin": "ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄨㄢˊ ˙ㄌㄜ"
        }
      ]
    }
  ]
});
