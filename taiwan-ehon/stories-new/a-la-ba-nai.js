// Story data for one bilingual picture book (new-file stage; not yet registered
// in stories.js). Schema matches taiwan-ehon/stories.js exactly: see that file's
// header comment for the {漢字|かんじ} furigana and 注音 conventions.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else { root.TaiwanEhonStoriesNew = root.TaiwanEhonStoriesNew || []; root.TaiwanEhonStoriesNew.push(story); }
})(typeof self !== 'undefined' ? self : this, {
  "id": "a-la-ba-nai",
  "title": {
    "ja": "アラパナイの いし",
    "zh": "阿拉巴耐的石頭",
    "zhuyin": "ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ˙ㄉㄜ ㄕˊ ㄊㄡˊ"
  },
  "tagline": {
    "ja": "たいとうの うみべに つたわる、はじまりの おはなし",
    "zh": "台東海邊，一個關於起源的故事"
  },
  "origin": {
    "ja": "マーラン・アミぞくに つたわる くちづたえの おはなし",
    "zh": "馬蘭阿美族的口傳故事"
  },
  "credit": {
    "ja": "これは たいとうの うみべ、マーラン・アミぞくと ホウチュン・アミぞく、プユマぞくが ともに おぼえて いる ばしょ ―― アラパナイ（Arapanay）―― の はじまりの おはなしです。むかし、そこに ある おおきな いしの そばから、さいしょの せんぞが あらわれたと つたえられて います。たいわんの ほかの アミの むらには、また ちがう はじまりの おはなしが つたわって います。これは その ひとつの ばしょ、ひとつの ぐるーぷの おはなしです。",
    "zh": "這是台東馬蘭阿美族，和恆春阿美族、卑南族共同記得的地方——阿拉巴耐（Arapanay）——的起源故事。傳說族人的祖先，就是在這片海邊的大石頭旁邊出現的。台灣其他阿美族部落，還流傳著不一樣的起源故事，這只是其中一個地方、一個族群的說法。"
  },
  "theme": {
    "accent": "#4a5f8a",
    "soft": "#e2e6f2"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/a-la-ba-nai/cover.webp",
      "alt": {
        "ja": "あさひの さす たいとうの うみべと、おおきな いし",
        "zh": "晨光中的台東海邊與大石頭"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "quiet, respectful, dawn atmosphere",
          "ja": "たいとうの うみべに つたわる おはなし「アラパナイの いし」",
          "jaTts": "タイトウの うみべに つたわる おはなし「アラパナイの いし」",
          "zh": "台東海邊流傳的故事〈阿拉巴耐的石頭〉",
          "zhuyin": "ㄊㄞˊ ㄉㄨㄥ ㄏㄞˇ ㄅㄧㄢ ㄌㄧㄡˊ ㄔㄨㄢˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ˙ㄉㄜ ㄕˊ ㄊㄡˊ"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "gentle, respectful, inviting quiet attention",
          "ja": "しずかに はじまりを おもいだす、うみべの おはなしです。",
          "zh": "這是一個靜靜想起最初開始的海邊故事。",
          "zhuyin": "ㄓㄜˋ ㄕˋ ㄧ ˙ㄍㄜ ㄐㄧㄥˋ ㄐㄧㄥˋ ㄒㄧㄤˇ ㄑㄧˇ ㄗㄨㄟˋ ㄔㄨ ㄎㄞ ㄕˇ ˙ㄉㄜ ㄏㄞˇ ㄅㄧㄢ ㄍㄨˋ ㄕˋ"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/a-la-ba-nai/p01.webp",
      "alt": {
        "ja": "みちの そばに ならぶ、おおきな しずかな いし",
        "zh": "靜靜排列在小路旁的大石頭"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "quiet, scene-setting, respectful",
          "ja": "たいとうの みなみ、うみの そばに、アラパナイと よばれる ばしょが あります。",
          "zh": "在台東的南邊，靠近海的地方，有一個叫做「阿拉巴耐」的地方。",
          "zhuyin": "ㄗㄞˋ ㄊㄞˊ ㄉㄨㄥ ˙ㄉㄜ ㄋㄢˊ ㄅㄧㄢ ㄎㄠˋ ㄐㄧㄣˋ ㄏㄞˇ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄧㄡˇ ㄧ ˙ㄍㄜ ㄐㄧㄠˋ ㄗㄨㄛˋ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ"
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "gentle wonder",
          "ja": "そこには、おおきな いしが いくつも、みちの そばで しずかに たって います。",
          "zh": "那裡有幾顆很大的石頭，靜靜地立在小路旁邊。",
          "zhuyin": "ㄋㄚˋ ㄌㄧˇ ㄧㄡˇ ㄐㄧˇ ㄎㄜ ㄏㄣˇ ㄉㄚˋ ˙ㄉㄜ ㄕˊ ㄊㄡˊ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄌㄧˋ ㄗㄞˋ ㄒㄧㄠˇ ㄌㄨˋ ㄆㄤˊ ㄅㄧㄢ"
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/a-la-ba-nai/p02.webp",
      "alt": {
        "ja": "いしの そばで はなしを する としよりたち",
        "zh": "在石頭旁邊說故事的長者們"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "gentle oral tradition, respectful framing",
          "ja": "マーラン・アミの としよりたちは、こう つたえて きました。",
          "zh": "馬蘭阿美的長者們，是這樣說的：",
          "zhuyin": "ㄇㄚˇ ㄌㄢˊ ㄚ ㄇㄟˇ ˙ㄉㄜ ㄓㄤˇ ㄓㄜˇ ˙ㄇㄣ ㄕˋ ㄓㄜˋ ㄧㄤˋ ㄕㄨㄛ ˙ㄉㄜ"
        },
        {
          "id": "p02-2",
          "speaker": "narrator",
          "style": "quiet reverence",
          "ja": "「ずっと むかし、さいしょの せんぞは、この いしの そばに あらわれたんだよ。」",
          "zh": "「很久很久以前，第一代的祖先，就是在這些石頭旁邊出現的。」",
          "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄉㄧˋ ㄧˊ ㄉㄞˋ ˙ㄉㄜ ㄗㄨˇ ㄒㄧㄢ ㄐㄧㄡˋ ㄕˋ ㄗㄞˋ ㄓㄜˋ ㄒㄧㄝ ㄕˊ ㄊㄡˊ ㄆㄤˊ ㄅㄧㄢ ㄔㄨ ㄒㄧㄢˋ ˙ㄉㄜ"
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/a-la-ba-nai/p03.webp",
      "alt": {
        "ja": "うみと そらの したで、しずかに たたずむ いし",
        "zh": "在海與天空下靜靜佇立的石頭"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "narrator",
          "style": "wonder, quiet",
          "ja": "なぜ、どうやって あらわれたのか。 その ことは、だれも はっきりとは しりません。",
          "zh": "為什麼、又是怎麼出現的呢？沒有人能說得很清楚。",
          "zhuyin": "ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ㄧㄡˋ ㄕˋ ㄗㄣˇ ˙ㄇㄜ ㄔㄨ ㄒㄧㄢˋ ˙ㄉㄜ ˙ㄋㄜ ㄇㄟˊ ㄧㄡˇ ㄖㄣˊ ㄋㄥˊ ㄕㄨㄛ ˙ㄉㄜ ㄏㄣˇ ㄑㄧㄥ ㄔㄨˇ"
        },
        {
          "id": "p03-2",
          "speaker": "narrator",
          "style": "warm, communal memory",
          "ja": "でも、みんなが おなじ ばしょを おもいだし、たいせつに して きました。",
          "zh": "但是，大家都記得同一個地方，並且很珍惜它。",
          "zhuyin": "ㄉㄢˋ ㄕˋ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄐㄧˋ ˙ㄉㄜ ㄊㄨㄥˊ ㄧ ˙ㄍㄜ ㄉㄧˋ ㄈㄤ ㄅㄧㄥˋ ㄑㄧㄝˇ ㄏㄣˇ ㄓㄣ ㄒㄧ ㄊㄚ"
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/a-la-ba-nai/p04.webp",
      "alt": {
        "ja": "おなじ いしの ばしょを たいせつに する、べつの むらの ひとたち",
        "zh": "同樣珍惜這個石頭之地的其他部落的人們"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "shared connection, respectful, avoids merging distinct identities",
          "ja": "ホウチュン・アミぞくや プユマぞくの ひとたちも、この アラパナイを たいせつな ばしょだと いって います。",
          "jaTts": "ほうちゅん・あみぞくや プユマぞくの ひとたちも、この アラパナイを たいせつな ばしょだと いって います。",
          "zh": "恆春阿美族和卑南族的人們，也把阿拉巴耐當作重要的地方。",
          "zhuyin": "ㄏㄥˊ ㄔㄨㄣ ㄚ ㄇㄟˇ ㄗㄨˊ ㄏㄜˊ ㄅㄟ ㄋㄢˊ ㄗㄨˊ ˙ㄉㄜ ㄖㄣˊ ˙ㄇㄣ ㄧㄝˇ ㄅㄚˇ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ㄉㄤ ㄗㄨㄛˋ ㄓㄨㄥˋ ㄧㄠˋ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ"
        },
        {
          "id": "p04-2",
          "speaker": "narrator",
          "style": "gentle, unifying but respectful of distinctness",
          "ja": "ちがう むらの ひとたちが、おなじ ばしょを おもう。 それは とても すてきな ことです。",
          "zh": "不同部落的人，惦記著同一個地方，這是很美好的事。",
          "zhuyin": "ㄅㄨˋ ㄊㄨㄥˊ ㄅㄨˋ ㄌㄨㄛˋ ˙ㄉㄜ ㄖㄣˊ ㄉㄧㄢˋ ㄐㄧˋ ˙ㄓㄜ ㄊㄨㄥˊ ㄧ ˙ㄍㄜ ㄉㄧˋ ㄈㄤ ㄓㄜˋ ㄕˋ ㄏㄣˇ ㄇㄟˇ ㄏㄠˇ ˙ㄉㄜ ㄕˋ"
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/a-la-ba-nai/p05.webp",
      "alt": {
        "ja": "まいとし アラパナイに もどってきて、いしと うみに はなしかける ひとびと",
        "zh": "每年回到阿拉巴耐、向石頭與大海說話的人們"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "narrator",
          "style": "living practice, gentle rhythm of return",
          "ja": "まいとし、ひとびとは アラパナイに もどってきます。",
          "zh": "每一年，族人們都會回到阿拉巴耐。",
          "zhuyin": "ㄇㄟˇ ㄧ ㄋㄧㄢˊ ㄗㄨˊ ㄖㄣˊ ˙ㄇㄣ ㄉㄡ ㄏㄨㄟˋ ㄏㄨㄟˊ ㄉㄠˋ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ"
        },
        {
          "id": "p05-2",
          "speaker": "narrator",
          "style": "warm ritual of gratitude",
          "ja": "いしと うみに むかって、はなしかけたり、うたを うたったり します。",
          "zh": "對著石頭和大海，說說話、唱唱歌。",
          "zhuyin": "ㄉㄨㄟˋ ˙ㄓㄜ ㄕˊ ㄊㄡˊ ㄏㄜˊ ㄉㄚˋ ㄏㄞˇ ㄕㄨㄛ ㄕㄨㄛ ㄏㄨㄚˋ ㄔㄤˋ ㄔㄤˋ ㄍㄜ"
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/a-la-ba-nai/p06.webp",
      "alt": {
        "ja": "たけの いかだを じゅんびする ひとびと",
        "zh": "準備竹筏的人們"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "specific living memory, gentle build-up",
          "ja": "ある とし、ひとびとは せんぞが うみから きた ときの ようすを、もういちど やって みる ことに しました。",
          "zh": "有一年，族人們決定，再一次重現祖先當年從海上前來的樣子。",
          "zhuyin": "ㄧㄡˇ ㄧ ㄋㄧㄢˊ ㄗㄨˊ ㄖㄣˊ ˙ㄇㄣ ㄐㄩㄝˊ ㄉㄧㄥˋ ㄗㄞˋ ㄧˊ ㄘˋ ㄓㄨㄥˋ ㄒㄧㄢˋ ㄗㄨˇ ㄒㄧㄢ ㄉㄤ ㄋㄧㄢˊ ㄘㄨㄥˊ ㄏㄞˇ ㄕㄤˋ ㄑㄧㄢˊ ㄌㄞˊ ˙ㄉㄜ ㄧㄤˋ ˙ㄗ"
        },
        {
          "id": "p06-2",
          "speaker": "narrator",
          "style": "communal preparation",
          "ja": "おとなも わかものも、いっしょに たけの いかだを つくりました。",
          "zh": "大人和年輕人，一起做了一艘竹筏。",
          "zhuyin": "ㄉㄚˋ ㄖㄣˊ ㄏㄜˊ ㄋㄧㄢˊ ㄑㄧㄥ ㄖㄣˊ ㄧˋ ㄑㄧˇ ㄗㄨㄛˋ ˙ㄌㄜ ㄧ ㄙㄡ ㄓㄨˊ ㄈㄚˊ"
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/a-la-ba-nai/p07.webp",
      "alt": {
        "ja": "うみから ゆっくりと きしべに むかう いかだ",
        "zh": "從海上緩緩靠向岸邊的竹筏"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "gentle motion, quiet wonder",
          "ja": "いかだは うみの うえを、ゆっくり ゆっくり きしべに むかいました。",
          "zh": "竹筏在海上，慢慢地、慢慢地靠向岸邊。",
          "zhuyin": "ㄓㄨˊ ㄈㄚˊ ㄗㄞˋ ㄏㄞˇ ㄕㄤˋ ㄇㄢˋ ㄇㄢˋ ˙ㄉㄜ ㄇㄢˋ ㄇㄢˋ ˙ㄉㄜ ㄎㄠˋ ㄒㄧㄤˋ ㄢˋ ㄅㄧㄢ"
        },
        {
          "id": "p07-2",
          "speaker": "narrator",
          "style": "communal effort, warmth",
          "ja": "きしで まって いた ひとたちが、みんなで いかだを ひきあげました。",
          "zh": "岸邊等待的人們，大家一起把竹筏拉上岸。",
          "zhuyin": "ㄢˋ ㄅㄧㄢ ㄉㄥˇ ㄉㄞˋ ˙ㄉㄜ ㄖㄣˊ ˙ㄇㄣ ㄉㄚˋ ㄐㄧㄚ ㄧˋ ㄑㄧˇ ㄅㄚˇ ㄓㄨˊ ㄈㄚˊ ㄌㄚ ㄕㄤˋ ㄢˋ"
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/a-la-ba-nai/p08.webp",
      "alt": {
        "ja": "いしの そばで いっしょに ごはんを たべる、むらの みんな",
        "zh": "在石頭旁邊一起吃飯的村人們"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "warm communal gathering",
          "ja": "いかだが ついたあと、みんなは いしの そばに あつまり、いっしょに ごはんを たべました。",
          "zh": "竹筏靠岸之後，大家聚在石頭旁邊，一起吃飯。",
          "zhuyin": "ㄓㄨˊ ㄈㄚˊ ㄎㄠˋ ㄢˋ ㄓ ㄏㄡˋ ㄉㄚˋ ㄐㄧㄚ ㄐㄩˋ ㄗㄞˋ ㄕˊ ㄊㄡˊ ㄆㄤˊ ㄅㄧㄢ ㄧˋ ㄑㄧˇ ㄔ ㄈㄢˋ"
        },
        {
          "id": "p08-2",
          "speaker": "narrator",
          "style": "intergenerational transmission",
          "ja": "としよりたちは、ちいさな こどもたちに、アラパナイの おはなしを して きかせました。",
          "zh": "長者們，把阿拉巴耐的故事，說給小小孩子們聽。",
          "zhuyin": "ㄓㄤˇ ㄓㄜˇ ˙ㄇㄣ ㄅㄚˇ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄍㄟˇ ㄒㄧㄠˇ ㄒㄧㄠˇ ㄏㄞˊ ˙ㄗ ˙ㄇㄣ ㄊㄧㄥ"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/a-la-ba-nai/p09.webp",
      "alt": {
        "ja": "おおきな いしに そっと ふれる こども",
        "zh": "輕輕觸摸大石頭的孩子"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "quiet, tactile, memory-making",
          "ja": "こどもたちは、おおきな いしに そっと てを あてました。",
          "zh": "孩子們輕輕地把手放在大石頭上。",
          "zhuyin": "ㄏㄞˊ ˙ㄗ ˙ㄇㄣ ㄑㄧㄥ ㄑㄧㄥ ˙ㄉㄜ ㄅㄚˇ ㄕㄡˇ ㄈㄤˋ ㄗㄞˋ ㄉㄚˋ ㄕˊ ㄊㄡˊ ㄕㄤˋ"
        },
        {
          "id": "p09-2",
          "speaker": "narrator",
          "style": "gentle closing sense of continuity",
          "ja": "なみの おとを ききながら、この ばしょの なまえを、こころに とめました。 ―― アラパナイ。",
          "zh": "一邊聽著海浪的聲音，一邊把這個地方的名字，記在心裡——阿拉巴耐。",
          "zhuyin": "ㄧ ㄅㄧㄢ ㄊㄧㄥ ˙ㄓㄜ ㄏㄞˇ ㄌㄤˋ ˙ㄉㄜ ㄕㄥ ㄧㄣ ㄧ ㄅㄧㄢ ㄅㄚˇ ㄓㄜˋ ˙ㄍㄜ ㄉㄧˋ ㄈㄤ ˙ㄉㄜ ㄇㄧㄥˊ ㄗˋ ㄐㄧˋ ㄗㄞˋ ㄒㄧㄣ ㄌㄧˇ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ"
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/a-la-ba-nai/p10.webp",
      "alt": {
        "ja": "せだいを こえて つたわる、アラパナイの けしき",
        "zh": "世代相傳的阿拉巴耐風景"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "narrator",
          "style": "reflective, warm continuity",
          "ja": "この おはなしは、マーラン・アミぞくが たいせつに つたえて きた、はじまりの きおくです。",
          "zh": "這個故事，是馬蘭阿美族珍惜流傳下來的、關於起源的記憶。",
          "zhuyin": "ㄓㄜˋ ˙ㄍㄜ ㄍㄨˋ ㄕˋ ㄕˋ ㄇㄚˇ ㄌㄢˊ ㄚ ㄇㄟˇ ㄗㄨˊ ㄓㄣ ㄒㄧ ㄌㄧㄡˊ ㄔㄨㄢˊ ㄒㄧㄚˋ ㄌㄞˊ ˙ㄉㄜ ㄍㄨㄢ ㄩˊ ㄑㄧˇ ㄩㄢˊ ˙ㄉㄜ ㄐㄧˋ ㄧˋ"
        },
        {
          "id": "p10-2",
          "speaker": "narrator",
          "style": "gentle acknowledgment of diversity, avoids universalizing",
          "ja": "たいわんの ほかの アミの むらには、また ちがう はじまりの おはなしが あります。",
          "zh": "台灣其他阿美族的部落，還有著不一樣的起源故事。",
          "zhuyin": "ㄊㄞˊ ㄨㄢ ㄑㄧˊ ㄊㄚ ㄚ ㄇㄟˇ ㄗㄨˊ ˙ㄉㄜ ㄅㄨˋ ㄌㄨㄛˋ ㄏㄞˊ ㄧㄡˇ ˙ㄓㄜ ㄅㄨˋ ㄧ ㄧㄤˋ ˙ㄉㄜ ㄑㄧˇ ㄩㄢˊ ㄍㄨˋ ㄕˋ"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/a-la-ba-nai/end.webp",
      "alt": {
        "ja": "しずかな うみべに のこる、アラパナイの いし",
        "zh": "靜靜留在海邊的阿拉巴耐石頭"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "gentle, respectful closing lesson",
          "ja": "ばしょを おぼえ、はなしを つたえて いく こと。 それも、たいせつな きおくの まもりかたです。",
          "zh": "記得這個地方，把故事傳下去，也是一種珍惜記憶的方式。",
          "zhuyin": "ㄐㄧˋ ˙ㄉㄜ ㄓㄜˋ ˙ㄍㄜ ㄉㄧˋ ㄈㄤ ㄅㄚˇ ㄍㄨˋ ㄕˋ ㄔㄨㄢˊ ㄒㄧㄚˋ ㄑㄩˋ ㄧㄝˇ ㄕˋ ㄧ ㄓㄨㄥˇ ㄓㄣ ㄒㄧ ㄐㄧˋ ㄧˋ ˙ㄉㄜ ㄈㄤ ㄕˋ"
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
