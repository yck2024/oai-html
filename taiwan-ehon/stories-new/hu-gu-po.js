// Story data for one bilingual picture book (new-file stage; not yet registered
// in stories.js). Schema matches taiwan-ehon/stories.js exactly: see that file's
// header comment for the {漢字|かんじ} furigana and 注音 conventions.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else { root.TaiwanEhonStoriesNew = root.TaiwanEhonStoriesNew || []; root.TaiwanEhonStoriesNew.push(story); }
})(typeof self !== 'undefined' ? self : this, {
  "id": "hu-gu-po",
  "title": {
    "ja": "{虎姑婆|フーグーポー}",
    "zh": "虎姑婆",
    "zhuyin": "ㄏㄨˇ ㄍㄨ ㄆㄛˊ"
  },
  "tagline": {
    "ja": "よく みて、たすけあう おはなし",
    "zh": "一個細心觀察、互相照顧的故事"
  },
  "origin": {
    "ja": "たいわんの むかしばなし",
    "zh": "台灣民間故事"
  },
  "credit": {
    "ja": "フーグーポーは たいわんに ながく つたわる おはなしで、ちいきに よって ないように ちがいが あります。この えほんは やさしい バージョンを えらび、おねえちゃんと おとうとが よく みて、たすけあいながら、あんぜんに よるを すごす おはなしに しました。だれも かまれたり、おどされたり、ばつを うけたり しません。",
    "zh": "虎姑婆是台灣流傳很久的故事，各地說法不太一樣。這本繪本選了一個溫柔的版本，讓姊姊和弟弟靠著細心觀察和互相幫忙，安全地度過一個晚上，沒有人被咬、被威脅，也沒有人受到懲罰。"
  },
  "theme": {
    "accent": "#8a4b6b",
    "soft": "#f4dfe8"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/hu-gu-po/cover.webp",
      "alt": {
        "ja": "あかりの ついた いえの まえで、とを ノックする ふしぎな おきゃくさん",
        "zh": "在燈光溫暖的家門前，敲著門的神秘客人"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "warm, inviting storyteller opening a picture book, a little mysterious",
          "ja": "たいわんの むかしばなし「フーグーポー」",
          "zh": "台灣民間故事〈虎姑婆〉",
          "zhuyin": "ㄊㄞˊ ㄨㄢ ㄇㄧㄣˊ ㄐㄧㄢ ㄍㄨˋ ㄕˋ ㄏㄨˇ ㄍㄨ ㄆㄛˊ"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "gentle, curious, inviting the listener to pay close attention",
          "ja": "よく みて、たすけあう きょうだいの おはなしです。",
          "zh": "這是一個仔細觀察、互相照顧的故事。",
          "zhuyin": "ㄓㄜˋ ㄕˋ ㄧ ˙ㄍㄜ ㄗˇ ㄒㄧˋ ㄍㄨㄢ ㄔㄚˊ ㄏㄨˋ ㄒㄧㄤ ㄓㄠˋ ㄍㄨˋ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/hu-gu-po/p01.webp",
      "alt": {
        "ja": "よるに でかける りょうしんと、いえで みおくる おねえちゃんと おとうと",
        "zh": "晚上要出門的爸爸媽媽，和在家門口目送他們的姊姊與弟弟"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "gentle evening scene, a little bustly",
          "ja": "ある よるの こと、となりの びょうきの おばあさんを たすけに、おとうさんと おかあさんが でかけました。",
          "zh": "有一天晚上，爸爸和媽媽要去照顧生病的鄰居奶奶，準備出門。",
          "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄅㄚˋ ㄅㄚˋ ㄏㄜˊ ㄇㄚ ㄇㄚ ㄧㄠˋ ㄑㄩˋ ㄓㄠˋ ㄍㄨˋ ㄕㄥ ㄅㄧㄥˋ ˙ㄉㄜ ㄌㄧㄣˊ ㄐㄩ ㄋㄞˇ ㄋㄞˇ ㄓㄨㄣˇ ㄅㄟˋ ㄔㄨ ㄇㄣˊ"
        },
        {
          "id": "p01-2",
          "speaker": "mother",
          "style": "warm, caring, gentle reminder",
          "ja": "「もんを しっかり しめて、ふたりで なかよく まっててね。」",
          "zh": "「把門關好，你們兩個要乖乖在一起等我們回來喔。」",
          "zhuyin": "ㄅㄚˇ ㄇㄣˊ ㄍㄨㄢ ㄏㄠˇ ㄋㄧˇ ˙ㄇㄣ ㄌㄧㄤˇ ˙ㄍㄜ ㄧㄠˋ ㄍㄨㄞ ㄍㄨㄞ ㄗㄞˋ ㄧˋ ㄑㄧˇ ㄉㄥˇ ㄨㄛˇ ˙ㄇㄣ ㄏㄨㄟˊ ㄌㄞˊ ㄛ"
        },
        {
          "id": "p01-3",
          "speaker": "narrator",
          "style": "reassuring, a little proud",
          "ja": "おねえちゃんは うなずいて、おとうとの てを ぎゅっと にぎりました。",
          "zh": "姊姊點點頭，緊緊牽著弟弟的手。",
          "zhTts": "姐姐點點頭，緊緊牽著弟弟的手。",
          "zhuyin": "ㄐㄧㄝˇ ㄐㄧㄝˇ ㄉㄧㄢˇ ㄉㄧㄢˇ ㄊㄡˊ ㄐㄧㄣˇ ㄐㄧㄣˇ ㄑㄧㄢ ˙ㄓㄜ ㄉㄧˋ ˙ㄉㄧ ˙ㄉㄜ ㄕㄡˇ"
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/hu-gu-po/p02.webp",
      "alt": {
        "ja": "かぜの ふく よる、とを コンコンと たたく おと",
        "zh": "起風的夜晚，門外傳來敲門的聲音"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "quiet night, wind picking up, a little suspenseful but not scary",
          "ja": "よるが ふけて、そとの かぜが ひゅうひゅう なりはじめた ころ、とを コンコンと たたく おとが しました。",
          "zh": "夜深了，外面的風呼呼地吹，這時候，門外傳來了敲門的聲音。",
          "zhuyin": "ㄧㄝˋ ㄕㄣ ˙ㄌㄜ ㄨㄞˋ ㄇㄧㄢˋ ˙ㄉㄜ ㄈㄥ ㄏㄨ ㄏㄨ ˙ㄉㄜ ㄔㄨㄟ ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄇㄣˊ ㄨㄞˋ ㄔㄨㄢˊ ㄌㄞˊ ˙ㄌㄜ ㄑㄧㄠ ㄇㄣˊ ˙ㄉㄜ ㄕㄥ ㄧㄣ"
        },
        {
          "id": "p02-2",
          "speaker": "guest",
          "style": "sweet but slightly odd, a bit raspy, not menacing",
          "ja": "「わたしは やまの むらから きた おばさんだよ。ひとばん とめて くれないかい？」",
          "zh": "「我是山上村子來的阿姨，可以讓我借住一晚嗎？」",
          "zhuyin": "ㄨㄛˇ ㄕˋ ㄕㄢ ㄕㄤˋ ㄘㄨㄣ ˙ㄗ ㄌㄞˊ ˙ㄉㄜ ㄚ ㄧˊ ㄎㄜˇ ㄧˇ ㄖㄤˋ ㄨㄛˇ ㄐㄧㄝˋ ㄓㄨˋ ㄧ ㄨㄢˇ ˙ㄇㄚ"
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/hu-gu-po/p03.webp",
      "alt": {
        "ja": "との すきまから そとを のぞく おねえちゃん",
        "zh": "從門縫偷偷往外看的姊姊"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "narrator",
          "style": "curious, noticing small clues, playful mystery tone",
          "ja": "おねえちゃんは との すきまから そっと のぞきました。こえは ちょっと しゃがれて、きものの すそから しましまの きれが みえます。",
          "zh": "姊姊從門縫悄悄看出去，發現聲音有點沙啞，衣服下擺還露出一小截條紋布。",
          "zhTts": "姐姐從門縫悄悄看出去，發現聲音有點沙啞，衣服下擺還露出一小截條紋布。",
          "zhuyin": "ㄐㄧㄝˇ ㄐㄧㄝˇ ㄘㄨㄥˊ ㄇㄣˊ ㄈㄥˋ ㄑㄧㄠ ㄑㄧㄠ ㄎㄢˋ ㄔㄨ ㄑㄩˋ ㄈㄚ ㄒㄧㄢˋ ㄕㄥ ㄧㄣ ㄧㄡˇ ㄉㄧㄢˇ ㄕㄚ ㄧㄚˇ ㄧ ㄈㄨˊ ㄒㄧㄚˋ ㄅㄞˇ ㄏㄞˊ ㄌㄨˋ ㄔㄨ ㄧ ㄒㄧㄠˇ ㄐㄧㄝˊ ㄊㄧㄠˊ ㄨㄣˊ ㄅㄨˋ"
        },
        {
          "id": "p03-2",
          "speaker": "jie",
          "style": "polite but wary, buying time, calm",
          "ja": "「あ、ちょっと まっててね、おばさん。 おとうとと そうだんしてから あけるね。」",
          "zh": "「阿姨，請等一下，我跟弟弟商量一下再開門喔。」",
          "zhuyin": "ㄚ ㄧˊ ㄑㄧㄥˇ ㄉㄥˇ ㄧˊ ㄒㄧㄚˋ ㄨㄛˇ ㄍㄣ ㄉㄧˋ ˙ㄉㄧ ㄕㄤ ㄌㄧㄤˊ ㄧˊ ㄒㄧㄚˋ ㄗㄞˋ ㄎㄞ ㄇㄣˊ ㄛ"
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/hu-gu-po/p04.webp",
      "alt": {
        "ja": "こそこそと あいずを きめる おねえちゃんと おとうと",
        "zh": "小聲討論暗號的姊姊和弟弟"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "jie",
          "style": "whispering, clever, a little worried but composed",
          "ja": "「あの こえ、なんだか へん。 かあさんの なまえも しらなかったよ。」",
          "zh": "「那個聲音怪怪的，她連媽媽的名字都不知道。」",
          "zhuyin": "ㄋㄚˋ ˙ㄍㄜ ㄕㄥ ㄧㄣ ㄍㄨㄞˋ ㄍㄨㄞˋ ˙ㄉㄜ ㄊㄚ ㄌㄧㄢˊ ㄇㄚ ㄇㄚ ˙ㄉㄜ ㄇㄧㄥˊ ㄗˋ ㄉㄡ ㄅㄨˋ ㄓ ㄉㄠˋ"
        },
        {
          "id": "p04-2",
          "speaker": "narrator",
          "style": "clever problem-solving, teamwork",
          "ja": "ふたりは かべを ふたつ たたいたら「そばに いてね」の あいずに することに しました。",
          "zh": "兩人決定，敲牆壁兩下，就是「靠緊一點」的暗號。",
          "zhuyin": "ㄌㄧㄤˇ ㄖㄣˊ ㄐㄩㄝˊ ㄉㄧㄥˋ ㄑㄧㄠ ㄑㄧㄤˊ ㄅㄧˋ ㄌㄧㄤˇ ㄒㄧㄚˋ ㄐㄧㄡˋ ㄕˋ ㄎㄠˋ ㄐㄧㄣˇ ㄧ ㄉㄧㄢˇ ˙ㄉㄜ ㄢˋ ㄏㄠˋ"
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/hu-gu-po/p05.webp",
      "alt": {
        "ja": "くさりを かけたまま とを すこし あける おねえちゃん",
        "zh": "留著門鏈、把門打開一點點的姊姊"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "jie",
          "style": "polite, firm, buying time cleverly",
          "ja": "「おばさん、いえの まえの ベンチで ちょっと まっててね。 いま もうふを もってくるから。」",
          "zh": "「阿姨，請先坐在門前的長椅上等一下，我去拿條毯子給你。」",
          "zhuyin": "ㄚ ㄧˊ ㄑㄧㄥˇ ㄒㄧㄢ ㄗㄨㄛˋ ㄗㄞˋ ㄇㄣˊ ㄑㄧㄢˊ ˙ㄉㄜ ㄓㄤˇ ㄧˇ ㄕㄤˋ ㄉㄥˇ ㄧˊ ㄒㄧㄚˋ ㄨㄛˇ ㄑㄩˋ ㄋㄚˊ ㄊㄧㄠˊ ㄊㄢˇ ˙ㄗ ㄍㄟˇ ㄋㄧˇ"
        },
        {
          "id": "p05-2",
          "speaker": "guest",
          "style": "sweetly agreeable, still a bit odd",
          "ja": "「ああ、いい こだね。 まってるよ。」",
          "zh": "「哦，真乖，我在這裡等。」",
          "zhTts": "哦，真乖巧，我在這裡等。",
          "zhuyin": "ㄛˊ ㄓㄣ ㄍㄨㄞ ㄨㄛˇ ㄗㄞˋ ㄓㄜˋ ㄌㄧˇ ㄉㄥˇ"
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/hu-gu-po/p06.webp",
      "alt": {
        "ja": "まどから ちかくの すずを ならす おとうと",
        "zh": "從窗邊敲響附近警鈴的弟弟"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "brave, quick action, a young child taking initiative",
          "ja": "おとうとは まどから そっと でて、むらの すずを おもいきり ならしました。",
          "zh": "弟弟悄悄從窗戶溜出去，用力敲響了村子裡的警鈴。",
          "zhuyin": "ㄉㄧˋ ˙ㄉㄧ ㄑㄧㄠ ㄑㄧㄠ ㄘㄨㄥˊ ㄔㄨㄤ ㄏㄨˋ ㄌㄧㄡ ㄔㄨ ㄑㄩˋ ㄩㄥˋ ㄌㄧˋ ㄑㄧㄠ ㄒㄧㄤˇ ˙ㄌㄜ ㄘㄨㄣ ˙ㄗ ㄌㄧˇ ˙ㄉㄜ ㄐㄧㄥˇ ㄌㄧㄥˊ"
        },
        {
          "id": "p06-2",
          "speaker": "di",
          "style": "brave, determined, a little breathless",
          "ja": "「みんな、おきて！ うちに へんな ひとが きてるよ！」",
          "zh": "「大家醒醒！我們家來了奇怪的人！」",
          "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄒㄧㄥˇ ㄒㄧㄥˇ ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄚ ㄌㄞˊ ˙ㄌㄜ ㄑㄧˊ ㄍㄨㄞˋ ˙ㄉㄜ ㄖㄣˊ"
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/hu-gu-po/p07.webp",
      "alt": {
        "ja": "つぎつぎに あかりが つく、むらの いえいえ",
        "zh": "一盞一盞亮起燈光的村子人家"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "hopeful, building relief, warm lights",
          "ja": "すずの おとを きいて、ひとつ、また ひとつと、いえの あかりが つきはじめました。",
          "zh": "聽見警鈴聲，一家、又一家的燈光陸續亮了起來。",
          "zhuyin": "ㄊㄧㄥ ㄐㄧㄢˋ ㄐㄧㄥˇ ㄌㄧㄥˊ ㄕㄥ ㄧ ㄐㄧㄚ ㄧㄡˋ ㄧ ㄐㄧㄚ ˙ㄉㄜ ㄉㄥ ㄍㄨㄤ ㄌㄨˋ ㄒㄩˋ ㄌㄧㄤˋ ˙ㄌㄜ ㄑㄧˇ ㄌㄞˊ"
        },
        {
          "id": "p07-2",
          "speaker": "narrator",
          "style": "gentle building suspense resolving into safety",
          "ja": "ちかづいて くる、ちょうちんの あかりと、みんなの こえ。",
          "zh": "燈籠的光和大家的說話聲，慢慢靠近。",
          "zhuyin": "ㄉㄥ ㄌㄨㄥˊ ˙ㄉㄜ ㄍㄨㄤ ㄏㄜˊ ㄉㄚˋ ㄐㄧㄚ ˙ㄉㄜ ㄕㄨㄛ ㄏㄨㄚˋ ㄕㄥ ㄇㄢˋ ㄇㄢˋ ㄎㄠˋ ㄐㄧㄣˋ"
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/hu-gu-po/p08.webp",
      "alt": {
        "ja": "そっと たちあがり、やみの なかへ きえて いく おきゃくさん",
        "zh": "悄悄站起來、消失在黑夜中的客人"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "calm, no drama, a quiet resolution",
          "ja": "おきゃくさんは あかりと こえに きづくと、そっと たちあがり、やみの なかへ きえて いきました。",
          "zh": "客人察覺燈光和說話聲，靜靜地站起來，消失在黑夜之中。",
          "zhuyin": "ㄎㄜˋ ㄖㄣˊ ㄔㄚˊ ㄐㄩㄝˊ ㄉㄥ ㄍㄨㄤ ㄏㄜˊ ㄕㄨㄛ ㄏㄨㄚˋ ㄕㄥ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄓㄢˋ ㄑㄧˇ ㄌㄞˊ ㄒㄧㄠ ㄕ ㄗㄞˋ ㄏㄟ ㄧㄝˋ ㄓ ㄓㄨㄥ"
        },
        {
          "id": "p08-2",
          "speaker": "narrator",
          "style": "relieved, warm",
          "ja": "なにも おこらず、あさが ちかづいて きました。",
          "zh": "什麼事都沒發生，天也漸漸亮了。",
          "zhuyin": "ㄕㄣˊ ˙ㄇㄜ ㄕˋ ㄉㄡ ㄇㄟˊ ㄈㄚ ㄕㄥ ㄊㄧㄢ ㄧㄝˇ ㄐㄧㄢˋ ㄐㄧㄢˋ ㄌㄧㄤˋ ˙ㄌㄜ"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/hu-gu-po/p09.webp",
      "alt": {
        "ja": "かえってきた りょうしんと、じじょうを はなす おねえちゃんたち",
        "zh": "回來的爸媽，和說明經過的姊姊弟弟"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "warm homecoming",
          "ja": "おとうさんと おかあさんが かえってくると、みんなが あつまって いました。",
          "zh": "爸爸媽媽回到家，看見大家都聚在門口。",
          "zhuyin": "ㄅㄚˋ ㄅㄚˋ ㄇㄚ ㄇㄚ ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄎㄢˋ ㄐㄧㄢˋ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄐㄩˋ ㄗㄞˋ ㄇㄣˊ ㄎㄡˇ"
        },
        {
          "id": "p09-2",
          "speaker": "jie",
          "style": "proud but modest, calm retelling",
          "ja": "「へんな おきゃくさんが きたけど、だいじょうぶだったよ。」",
          "zh": "「有個怪怪的客人來過，不過我們沒事。」",
          "zhuyin": "ㄧㄡˇ ˙ㄍㄜ ㄍㄨㄞˋ ㄍㄨㄞˋ ˙ㄉㄜ ㄎㄜˋ ㄖㄣˊ ㄌㄞˊ ㄍㄨㄛˋ ㄅㄨˋ ㄍㄨㄛˋ ㄨㄛˇ ˙ㄇㄣ ㄇㄟˊ ㄕˋ"
        },
        {
          "id": "p09-3",
          "speaker": "mother",
          "style": "warm, proud, relieved",
          "ja": "「ふたりとも、よく きづいて、よく がんばったね。」",
          "zh": "「你們兩個觀察得很仔細，也很勇敢喔。」",
          "zhuyin": "ㄋㄧˇ ˙ㄇㄣ ㄌㄧㄤˇ ˙ㄍㄜ ㄍㄨㄢ ㄔㄚˊ ˙ㄉㄜ ㄏㄣˇ ㄗˇ ㄒㄧˋ ㄧㄝˇ ㄏㄣˇ ㄩㄥˇ ㄍㄢˇ ㄛ"
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/hu-gu-po/p10.webp",
      "alt": {
        "ja": "あさの ひかりの なか、かぞくで だきあう おねえちゃんと おとうと",
        "zh": "在晨光中，一家人擁抱在一起"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "narrator",
          "style": "warm closing scene",
          "ja": "あさの ひかりが さしこむ なか、かぞく みんなで ぎゅっと だきあいました。",
          "zh": "晨光灑進屋內，一家人緊緊地擁抱在一起。",
          "zhuyin": "ㄔㄣˊ ㄍㄨㄤ ㄙㄚˇ ㄐㄧㄣˋ ㄨ ㄋㄟˋ ㄧ ㄐㄧㄚ ㄖㄣˊ ㄐㄧㄣˇ ㄐㄧㄣˇ ˙ㄉㄜ ㄩㄥ ㄅㄠˋ ㄗㄞˋ ㄧˋ ㄑㄧˇ"
        },
        {
          "id": "p10-2",
          "speaker": "di",
          "style": "happy, proud, a little sleepy",
          "ja": "「よく みて、たすけを よんだから、だいじょうぶだったんだね。」",
          "zh": "「因為我們仔細觀察、找人幫忙，所以才平安無事呢。」",
          "zhuyin": "ㄧㄣ ㄨㄟˋ ㄨㄛˇ ˙ㄇㄣ ㄗˇ ㄒㄧˋ ㄍㄨㄢ ㄔㄚˊ ㄓㄠˇ ㄖㄣˊ ㄅㄤ ㄇㄤˊ ㄙㄨㄛˇ ㄧˇ ㄘㄞˊ ㄆㄧㄥˊ ㄢ ㄨˊ ㄕˋ ˙ㄋㄜ"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/hu-gu-po/end.webp",
      "alt": {
        "ja": "ひるまの あかるい にわで あそぶ おねえちゃんと おとうと",
        "zh": "在明亮的白天庭院裡玩耍的姊姊和弟弟"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "gentle, loving lesson, slow and clear",
          "ja": "へんだなと おもったら、よく みて、かぞくと そうだんして、おとなに たすけを もとめよう。",
          "zh": "覺得不對勁的時候，仔細觀察、跟家人商量，再找大人幫忙，就能保護好自己。",
          "zhuyin": "ㄐㄩㄝˊ ˙ㄉㄜ ㄅㄨˋ ㄉㄨㄟˋ ㄐㄧㄣˋ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄗˇ ㄒㄧˋ ㄍㄨㄢ ㄔㄚˊ ㄍㄣ ㄐㄧㄚ ㄖㄣˊ ㄕㄤ ㄌㄧㄤˊ ㄗㄞˋ ㄓㄠˇ ㄉㄚˋ ㄖㄣˊ ㄅㄤ ㄇㄤˊ ㄐㄧㄡˋ ㄋㄥˊ ㄅㄠˇ ㄏㄨˋ ㄏㄠˇ ㄗˋ ㄐㄧˇ"
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
