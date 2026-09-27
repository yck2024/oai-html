// Story data for one bilingual picture book (new-file stage; not yet registered
// in stories.js). Schema matches taiwan-ehon/stories.js exactly: see that file's
// header comment for the {漢字|かんじ} furigana and 注音 conventions.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else { root.TaiwanEhonStoriesNew = root.TaiwanEhonStoriesNew || []; root.TaiwanEhonStoriesNew.push(story); }
})(typeof self !== 'undefined' ? self : this, {
  "id": "qing-mi-long-she",
  "title": {
    "ja": "{青瞑龍蛇|チンミーロンジャー}",
    "zh": "青瞑龍蛇",
    "zhuyin": "ㄑㄧㄥ ㄇㄧㄥˊ ㄌㄨㄥˊ ㄕㄜˊ"
  },
  "tagline": {
    "ja": "たいなんの みずべで、ひとと かわが たすけあう おはなし",
    "zh": "台南水邊，人與河流相互照看的故事"
  },
  "origin": {
    "ja": "たいなんの ちいきの でんせつ",
    "zh": "台南地方傳說"
  },
  "credit": {
    "ja": "チンミーロンジャーは たいなんの たいこう ちいきに つたわる おはなしで、むかしの そうぶんけいが なんども みちすじを かえた ことを つたえます。この えほんは ぶんかぶの にんぎょうげきの だいほんを もとに、ひとびとが かわの ようすに きを くばり、たすけあって じゅんびする ちえに ちゅうもくしました。「チンミー」は たいわんごの よびなで、りゅうと へびの なまえの いちぶです。だれかの ことを いって いるのでは ありません。",
    "zh": "青瞑龍蛇是台南台江一帶流傳的地方傳說，用來述說古早的曾文溪常常改變河道。這本繪本參考文化部的偶戲劇本改編，把重點放在人們留心河流、互相幫忙準備的智慧，而不是可怕的洪水場面。「青瞑」是台語的說法，這裡是龍和蛇的名字，不是在說任何人。"
  },
  "theme": {
    "accent": "#2f6f9e",
    "soft": "#dcebf4"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/qing-mi-long-she/cover.webp",
      "alt": {
        "ja": "たの あいだを ゆったり ながれる かわと、みずの したに みえる ながい かげ",
        "zh": "緩緩流過田野的河流，和水面下若隱若現的長長身影"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "gentle, a little mysterious, respectful",
          "ja": "たいなんに つたわる おはなし「チンミーロンジャー」",
          "zh": "台南流傳的故事〈青瞑龍蛇〉",
          "zhTts": "台南流傳的故事，青明龍蛇。",
          "zhuyin": "ㄊㄞˊ ㄋㄢˊ ㄌㄧㄡˊ ㄔㄨㄢˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄑㄧㄥ ㄇㄧㄥˊ ㄌㄨㄥˊ ㄕㄜˊ"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "warm, inviting close attention to nature",
          "ja": "かわと なかよく くらす ひとびとの おはなしです。",
          "zh": "這是一個人們和河流好好相處的故事。",
          "zhuyin": "ㄓㄜˋ ㄕˋ ㄧ ˙ㄍㄜ ㄖㄣˊ ˙ㄇㄣ ㄏㄜˊ ㄏㄜˊ ㄌㄧㄡˊ ㄏㄠˇ ㄏㄠˇ ㄒㄧㄤ ㄔㄨˋ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/qing-mi-long-she/p01.webp",
      "alt": {
        "ja": "くねくねと ながれる かわの そばの むら",
        "zh": "河流蜿蜒流過的村莊"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "peaceful, everyday village life",
          "ja": "むかし むかし、たいなんの みずべに、かわに そって くらす むらが ありました。",
          "jaTts": "むかし むかし、タイナンの みずべに、かわに そって くらす むらが ありました。",
          "zh": "很久以前，台南靠近水邊，有一個沿著河流生活的村子。",
          "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄊㄞˊ ㄋㄢˊ ㄎㄠˋ ㄐㄧㄣˋ ㄕㄨㄟˇ ㄅㄧㄢ ㄧㄡˇ ㄧ ˙ㄍㄜ ㄧㄢˊ ˙ㄓㄜ ㄏㄜˊ ㄌㄧㄡˊ ㄕㄥ ㄏㄨㄛˊ ˙ㄉㄜ ㄘㄨㄣ ˙ㄗ"
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "gentle wonder",
          "ja": "かわは くねくねと まがりながら、たと むらの あいだを ながれて いました。",
          "zh": "河水彎彎曲曲，流過田地和村子之間。",
          "zhuyin": "ㄏㄜˊ ㄕㄨㄟˇ ㄨㄢ ㄨㄢ ㄑㄩ ㄑㄩ ㄌㄧㄡˊ ㄍㄨㄛˋ ㄊㄧㄢˊ ㄉㄧˋ ㄏㄜˊ ㄘㄨㄣ ˙ㄗ ㄓ ㄐㄧㄢ"
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/qing-mi-long-she/p02.webp",
      "alt": {
        "ja": "かわに すむ りゅうと へびの はなしを する としより",
        "zh": "訴說河中龍蛇故事的長者"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "respectful introduction of the beings",
          "ja": "としよりたちは いいました。「この かわには、リュウと ヘビが しずかに くらして いるんだよ。」",
          "zh": "長者們說：「這條河裡，住著安靜生活的龍和蛇喔。」",
          "zhuyin": "ㄓㄤˇ ㄓㄜˇ ˙ㄇㄣ ㄕㄨㄛ ㄓㄜˋ ㄊㄧㄠˊ ㄏㄜˊ ㄌㄧˇ ㄓㄨˋ ˙ㄓㄜ ㄢ ㄐㄧㄥˋ ㄕㄥ ㄏㄨㄛˊ ˙ㄉㄜ ㄌㄨㄥˊ ㄏㄜˊ ㄕㄜˊ ㄛ"
        },
        {
          "id": "p02-2",
          "speaker": "elder",
          "style": "warm, respectful, matter-of-fact, not scary",
          "ja": "「ふたりは めの みかたが すこし ちがうから、チンミーと よばれて いるんだ。」",
          "zh": "「因為牠們看世界的方式跟我們不太一樣，大家叫牠們『青瞑』。」",
          "zhTts": "因為牠們看世界的方式跟我們不太一樣，大家叫牠們青明。",
          "zhuyin": "ㄧㄣ ㄨㄟˋ ㄊㄚ ˙ㄇㄣ ㄎㄢˋ ㄕˋ ㄐㄧㄝˋ ˙ㄉㄜ ㄈㄤ ㄕˋ ㄍㄣ ㄨㄛˇ ˙ㄇㄣ ㄅㄨˋ ㄊㄞˋ ㄧ ㄧㄤˋ ㄉㄚˋ ㄐㄧㄚ ㄐㄧㄠˋ ㄊㄚ ˙ㄇㄣ ㄑㄧㄥ ㄇㄧㄥˊ"
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/qing-mi-long-she/p03.webp",
      "alt": {
        "ja": "かわの みずめんを じっと みつめる むらの こどもたち",
        "zh": "靜靜望著河面的村裡孩子們"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "tong",
          "style": "curious, respectful, gentle",
          "ja": "「チンミーさんたちは、かわの ことを よく しって いるの？」",
          "zh": "「青瞑龍蛇伯伯，很了解這條河嗎？」",
          "zhTts": "青明龍蛇伯伯，很了解這條河嗎？",
          "zhuyin": "ㄑㄧㄥ ㄇㄧㄥˊ ㄌㄨㄥˊ ㄕㄜˊ ㄅㄛˊ ˙ㄅㄛ ㄏㄣˇ ㄌㄧㄠˇ ㄐㄧㄝˇ ㄓㄜˋ ㄊㄧㄠˊ ㄏㄜˊ ˙ㄇㄚ"
        },
        {
          "id": "p03-2",
          "speaker": "elder",
          "style": "wise, warm",
          "ja": "「そうだよ。 あめが たくさん ふると、かわは みちすじを かえることが あるんだ。」",
          "zh": "「是啊，只要雨下得多，河水就會改變流動的方向。」",
          "zhuyin": "ㄕˋ ˙ㄚ ㄓˇ ㄧㄠˋ ㄩˇ ㄒㄧㄚˋ ˙ㄉㄜ ㄉㄨㄛ ㄏㄜˊ ㄕㄨㄟˇ ㄐㄧㄡˋ ㄏㄨㄟˋ ㄍㄞˇ ㄅㄧㄢˋ ㄌㄧㄡˊ ㄉㄨㄥˋ ˙ㄉㄜ ㄈㄤ ㄒㄧㄤˋ"
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/qing-mi-long-she/p04.webp",
      "alt": {
        "ja": "あめぐもが あつまり、みずかさが ふえて いく かわ",
        "zh": "烏雲聚集、水量漸漸增加的河流"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "gentle build-up, weather changing, calm not scary",
          "ja": "ある とし、あめが なんにちも つづき、かわの みずが すこしずつ ふえて いきました。",
          "zh": "有一年，雨連續下了好幾天，河水一點一點地漲高。",
          "zhuyin": "ㄧㄡˇ ㄧ ㄋㄧㄢˊ ㄩˇ ㄌㄧㄢˊ ㄒㄩˋ ㄒㄧㄚˋ ˙ㄌㄜ ㄏㄠˇ ㄐㄧˇ ㄊㄧㄢ ㄏㄜˊ ㄕㄨㄟˇ ㄧ ㄉㄧㄢˇ ㄧ ㄉㄧㄢˇ ˙ㄉㄜ ㄓㄤˇ ㄍㄠ"
        },
        {
          "id": "p04-2",
          "speaker": "narrator",
          "style": "attentive, careful",
          "ja": "とりたちが おちつかなく なり、みずの いろも かわって いきました。",
          "zh": "鳥兒變得不安穩，水的顏色也漸漸改變。",
          "zhuyin": "ㄋㄧㄠˇ ㄦˊ ㄅㄧㄢˋ ˙ㄉㄜ ㄅㄨˋ ㄢ ㄨㄣˇ ㄕㄨㄟˇ ˙ㄉㄜ ㄧㄢˊ ㄙㄜˋ ㄧㄝˇ ㄐㄧㄢˋ ㄐㄧㄢˋ ㄍㄞˇ ㄅㄧㄢˋ"
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/qing-mi-long-she/p05.webp",
      "alt": {
        "ja": "かわの みずじるしを たしかめる むらびと",
        "zh": "查看河水水位標記的村民"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "tong",
          "style": "alert, remembering the teaching, proactive",
          "ja": "「としよりが いってた とおりだ！ かわの みちすじが かわりそう！」",
          "zh": "「跟長者說的一樣！河道好像要改變了！」",
          "zhuyin": "ㄍㄣ ㄓㄤˇ ㄓㄜˇ ㄕㄨㄛ ˙ㄉㄜ ㄧ ㄧㄤˋ ㄏㄜˊ ㄉㄠˋ ㄏㄠˇ ㄒㄧㄤˋ ㄧㄠˋ ㄍㄞˇ ㄅㄧㄢˋ ˙ㄌㄜ"
        },
        {
          "id": "p05-2",
          "speaker": "narrator",
          "style": "calm collective action, teamwork",
          "ja": "むらびとは あわてず、みずじるしを たしかめながら、じゅんびを はじめました。",
          "zh": "村民們不慌張，一邊確認水位標記，一邊開始準備。",
          "zhuyin": "ㄘㄨㄣ ㄇㄧㄣˊ ˙ㄇㄣ ㄅㄨˋ ㄏㄨㄤ ㄓㄤ ㄧ ㄅㄧㄢ ㄑㄩㄝˋ ㄖㄣˋ ㄕㄨㄟˇ ㄨㄟˋ ㄅㄧㄠ ㄐㄧˋ ㄧ ㄅㄧㄢ ㄎㄞ ㄕˇ ㄓㄨㄣˇ ㄅㄟˋ"
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/qing-mi-long-she/p06.webp",
      "alt": {
        "ja": "たがいに たすけあって、いえの どうぐを たかい ところへ はこぶ むらびと",
        "zh": "互相幫忙、把家中物品搬到高處的村民"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "cooperative, calm, practical",
          "ja": "おとなも こどもも、いえの だいじな ものを たかい ところへ はこびました。",
          "zh": "大人和小孩一起，把家裡重要的東西搬到地勢較高的地方。",
          "zhuyin": "ㄉㄚˋ ㄖㄣˊ ㄏㄜˊ ㄒㄧㄠˇ ㄏㄞˊ ㄧˋ ㄑㄧˇ ㄅㄚˇ ㄐㄧㄚ ㄌㄧˇ ㄓㄨㄥˋ ㄧㄠˋ ˙ㄉㄜ ㄉㄨㄥ ㄒㄧ ㄅㄢ ㄉㄠˋ ㄉㄧˋ ㄕˋ ㄐㄧㄠˋ ㄍㄠ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ"
        },
        {
          "id": "p06-2",
          "speaker": "narrator",
          "style": "warm teamwork",
          "ja": "となりどうしで てを かしあい、みんなで あんぜんな ばしょへ うつりました。",
          "zh": "鄰居互相幫忙，一起搬到安全的地方。",
          "zhuyin": "ㄌㄧㄣˊ ㄐㄩ ㄏㄨˋ ㄒㄧㄤ ㄅㄤ ㄇㄤˊ ㄧˋ ㄑㄧˇ ㄅㄢ ㄉㄠˋ ㄢ ㄑㄩㄢˊ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ"
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/qing-mi-long-she/p07.webp",
      "alt": {
        "ja": "とおくから みずの ながれと ともに うごく りゅうと へびを みまもる むらびと",
        "zh": "從遠處靜靜看著龍蛇隨水流移動的村民"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "respectful distance, wonder, not fearful",
          "ja": "とおくの みずめんに、リュウと ヘビが みずの ながれと ともに うごくのが みえました。",
          "zh": "遠處的水面上，可以看見龍和蛇隨著水流靜靜地移動。",
          "zhuyin": "ㄩㄢˇ ㄔㄨˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄇㄧㄢˋ ㄕㄤˋ ㄎㄜˇ ㄧˇ ㄎㄢˋ ㄐㄧㄢˋ ㄌㄨㄥˊ ㄏㄜˊ ㄕㄜˊ ㄙㄨㄟˊ ˙ㄓㄜ ㄕㄨㄟˇ ㄌㄧㄡˊ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄧˊ ㄉㄨㄥˋ"
        },
        {
          "id": "p07-2",
          "speaker": "elder",
          "style": "grateful, respectful, calm",
          "ja": "「みずの みちを おしえて くれて、ありがとう。」",
          "zh": "「謝謝你們告訴我們水流的方向。」",
          "zhuyin": "ㄒㄧㄝˋ ㄒㄧㄝˋ ㄋㄧˇ ˙ㄇㄣ ㄍㄠˋ ㄙㄨˋ ㄨㄛˇ ˙ㄇㄣ ㄕㄨㄟˇ ㄌㄧㄡˊ ˙ㄉㄜ ㄈㄤ ㄒㄧㄤˋ"
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/qing-mi-long-she/p08.webp",
      "alt": {
        "ja": "あめが あがり、あたらしい かわの みちすじを ちずに かきこむ むらびと",
        "zh": "雨過天晴後,把新河道畫進地圖裡的村民"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "relief, calm resolution, no disaster spectacle",
          "ja": "あめが やみ、かわは あたらしい みちすじで、おだやかに ながれはじめました。",
          "zh": "雨停了，河流沿著新的路線，平靜地流著。",
          "zhuyin": "ㄩˇ ㄊㄧㄥˊ ˙ㄌㄜ ㄏㄜˊ ㄌㄧㄡˊ ㄧㄢˊ ˙ㄓㄜ ㄒㄧㄣ ˙ㄉㄜ ㄌㄨˋ ㄒㄧㄢˋ ㄆㄧㄥˊ ㄐㄧㄥˋ ˙ㄉㄜ ㄌㄧㄡˊ ˙ㄓㄜ"
        },
        {
          "id": "p08-2",
          "speaker": "narrator",
          "style": "practical, communal",
          "ja": "むらびとは あたらしい かわの ちずを つくり、つぎに そなえました。",
          "zh": "村民們畫下新的河流地圖，為下一次做準備。",
          "zhuyin": "ㄘㄨㄣ ㄇㄧㄣˊ ˙ㄇㄣ ㄏㄨㄚˋ ㄒㄧㄚˋ ㄒㄧㄣ ˙ㄉㄜ ㄏㄜˊ ㄌㄧㄡˊ ㄉㄧˋ ㄊㄨˊ ㄨㄟˋ ㄒㄧㄚˋ ㄧ ㄘˋ ㄗㄨㄛˋ ㄓㄨㄣˇ ㄅㄟˋ"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/qing-mi-long-she/p09.webp",
      "alt": {
        "ja": "またしずかに かわで やすむ りゅうと へびを、あんしんして みまもる むらびと",
        "zh": "安心望著再次靜靜棲息在河中的龍蛇的村民"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "peaceful, warm",
          "ja": "リュウと ヘビは、また かわの なかで しずかに やすんで いました。",
          "zh": "龍和蛇又在河裡靜靜地休息了。",
          "zhuyin": "ㄌㄨㄥˊ ㄏㄜˊ ㄕㄜˊ ㄧㄡˋ ㄗㄞˋ ㄏㄜˊ ㄌㄧˇ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄒㄧㄡ ㄒㄧ ˙ㄌㄜ"
        },
        {
          "id": "p09-2",
          "speaker": "narrator",
          "style": "warm gratitude, community",
          "ja": "むらびとは かわと、そこに すむ ふたりに、そっと かんしゃしました。",
          "zh": "村民們對這條河，還有住在裡面的牠們，靜靜地說了聲謝謝。",
          "zhuyin": "ㄘㄨㄣ ㄇㄧㄣˊ ˙ㄇㄣ ㄉㄨㄟˋ ㄓㄜˋ ㄊㄧㄠˊ ㄏㄜˊ ㄏㄞˊ ㄧㄡˇ ㄓㄨˋ ㄗㄞˋ ㄌㄧˇ ㄇㄧㄢˋ ˙ㄉㄜ ㄊㄚ ˙ㄇㄣ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄕㄨㄛ ˙ㄌㄜ ㄕㄥ ㄒㄧㄝˋ ㄒㄧㄝˋ"
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/qing-mi-long-she/p10.webp",
      "alt": {
        "ja": "かわを だいじに する ことを こどもに つたえる としより",
        "zh": "把珍惜河流的心意傳給孩子的長者"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "elder",
          "style": "gentle, wise, passing down knowledge",
          "ja": "「かわの ようすを よく みて、みんなで じゅんびする。 それが たいせつな ことなんだよ。」",
          "zh": "「仔細觀察河流，大家一起準備，這是很重要的事喔。」",
          "zhuyin": "ㄗˇ ㄒㄧˋ ㄍㄨㄢ ㄔㄚˊ ㄏㄜˊ ㄌㄧㄡˊ ㄉㄚˋ ㄐㄧㄚ ㄧˋ ㄑㄧˇ ㄓㄨㄣˇ ㄅㄟˋ ㄓㄜˋ ㄕˋ ㄏㄣˇ ㄓㄨㄥˋ ㄧㄠˋ ˙ㄉㄜ ㄕˋ ㄛ"
        },
        {
          "id": "p10-2",
          "speaker": "tong",
          "style": "hopeful, warm, understanding",
          "ja": "「うん、ぼくも かわの ことを よく みるね。」",
          "zh": "「嗯，我也會好好觀察這條河的。」",
          "zhuyin": "ㄣˊ ㄨㄛˇ ㄧㄝˇ ㄏㄨㄟˋ ㄏㄠˇ ㄏㄠˇ ㄍㄨㄢ ㄔㄚˊ ㄓㄜˋ ㄊㄧㄠˊ ㄏㄜˊ ˙ㄉㄜ"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/qing-mi-long-she/end.webp",
      "alt": {
        "ja": "しずかな ゆうぐれの かわと、あかりの ともる むら",
        "zh": "寧靜黃昏下的河流與亮起燈光的村莊"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "gentle, loving lesson",
          "ja": "かわの こえに みみを かたむけ、みんなで じゅんびすれば、あんしんして くらせるよ。",
          "zh": "用心傾聽河流的聲音，大家一起準備，就能安心生活。",
          "zhuyin": "ㄩㄥˋ ㄒㄧㄣ ㄑㄧㄥ ㄊㄧㄥ ㄏㄜˊ ㄌㄧㄡˊ ˙ㄉㄜ ㄕㄥ ㄧㄣ ㄉㄚˋ ㄐㄧㄚ ㄧˋ ㄑㄧˇ ㄓㄨㄣˇ ㄅㄟˋ ㄐㄧㄡˋ ㄋㄥˊ ㄢ ㄒㄧㄣ ㄕㄥ ㄏㄨㄛˊ"
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
