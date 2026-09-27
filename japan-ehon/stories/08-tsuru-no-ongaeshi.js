// The Grateful Crane ({鶴|つる}の{恩返|おんがえ}し) for the Japanese folktale picture books.
// One story object in the shared book format: Japanese marks furigana as {漢字|かんじ};
// `zhuyin` holds one 注音 syllable per Han character of `zh`; `en` is the English text.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.JapanEhonStories = root.JapanEhonStories || []).push(story);
})(typeof self !== 'undefined' ? self : this, {
  "id": "tsuru-no-ongaeshi",
  "title": {
    "ja": "{鶴|つる}の{恩返|おんがえ}し",
    "zh": "白鶴報恩",
    "zhuyin": "ㄅㄞˊ ㄏㄜˋ ㄅㄠˋ ㄣ",
    "en": "The Grateful Crane"
  },
  "tagline": {
    "ja": "たすけて もらった つると、たいせつな やくそくの おはなし",
    "zh": "一隻被救的白鶴，和一個重要的約定",
    "en": "A rescued crane, and a promise that mattered"
  },
  "origin": {
    "ja": "にほんの むかしばなし",
    "zh": "日本民間故事",
    "en": "A Japanese folktale"
  },
  "credit": {
    "ja": "つるの おんがえしは、にほんの あちこちで かたられて きた むかしばなしです。 わかものが つるを たすけ、つるが その およめさんに なる おはなしも あり、やまがたけん なんようしに つたわるのも その おはなしです。 この えほんは、つるが むすめの すがたで、おじいさんと おばあさんの もとに やって くる おはなしを もとに しました。 つるが じぶんの はねを ぬく ようすは えがかず、おばあさんが のぞいて しまう わけは、むすめを しんぱいした から と しました。",
    "zh": "〈白鶴報恩〉是日本各地流傳的民間故事。有些版本裡，救鶴的是年輕人，鶴後來成了他的妻子，山形縣南陽市流傳的就是這個版本。這本繪本採用的是白鶴化成姑娘，來到老爺爺和老奶奶家的版本。本書沒有畫出白鶴拔羽毛的樣子，並把老奶奶偷看的原因，寫成是因為擔心姑娘。",
    "en": "The Grateful Crane is told all over Japan. In some versions a young man saves the crane and she becomes his wife; that is the version handed down in Nan'yō City, Yamagata. This book follows the version in which the crane comes to an old couple as a young woman. It does not show the crane plucking her feathers, and the old woman peeks into the room because she is worried about the girl."
  },
  "theme": {
    "accent": "#2f4f86",
    "soft": "#dfe7f3"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/tsuru-no-ongaeshi/cover.webp",
      "alt": {
        "ja": "ゆきの ふる よる、ちいさな いえの うえを とぶ いちわの つる",
        "zh": "下雪的夜晚，飛過小屋上空的一隻白鶴",
        "en": "A crane flying over a little house on a snowy night"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "warm, inviting storyteller opening a picture book, hushed like falling snow",
          "ja": "にほんの むかしばなし「{鶴|つる}の{恩返|おんがえ}し」",
          "zh": "日本民間故事〈白鶴報恩〉",
          "zhuyin": "ㄖˋ ㄅㄣˇ ㄇㄧㄣˊ ㄐㄧㄢ ㄍㄨˋ ㄕˋ ㄅㄞˊ ㄏㄜˋ ㄅㄠˋ ㄣ",
          "en": "A Japanese folktale: The Grateful Crane"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "soft and curious",
          "ja": "たすけて もらった つるは、どんな おれいを するのかな？",
          "zh": "被救的白鶴，會怎麼報答呢？",
          "zhuyin": "ㄅㄟˋ ㄐㄧㄡˋ ˙ㄉㄜ ㄅㄞˊ ㄏㄜˋ ㄏㄨㄟˋ ㄗㄣˇ ˙ㄇㄜ ㄅㄠˋ ㄉㄚˊ ˙ㄋㄜ",
          "en": "How will the rescued crane say thank you?"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/tsuru-no-ongaeshi/p01.webp",
      "alt": {
        "ja": "ゆきの なか、なわの わなに かかった つるを みつける おじいさん",
        "zh": "在雪地裡，發現鶴被繩圈陷阱困住的老爺爺",
        "en": "The old man finding a crane caught in a rope snare in the snow"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "gentle once-upon-a-time storyteller, quiet winter mood",
          "ja": "むかし むかし、ゆきの ふかい むらに、やさしい おじいさんと おばあさんが いました。",
          "zh": "從前，在積滿雪的村子裡，住著一對善良的老爺爺和老奶奶。",
          "zhuyin": "ㄘㄨㄥˊ ㄑㄧㄢˊ ㄗㄞˋ ㄐㄧ ㄇㄢˇ ㄒㄩㄝˇ ˙ㄉㄜ ㄘㄨㄣ ˙ㄗ ㄌㄧˇ ㄓㄨˋ ˙ㄓㄜ ㄧ ㄉㄨㄟˋ ㄕㄢˋ ㄌㄧㄤˊ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ",
          "en": "Long ago, a kind old man and old woman lived in a snowy village."
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "quiet, a little sad",
          "ja": "ふたりには、あたたかい ふとんを かう おかねも ありませんでした。",
          "zh": "他們窮得連一床暖和的棉被都買不起。",
          "zhuyin": "ㄊㄚ ˙ㄇㄣ ㄑㄩㄥˊ ˙ㄉㄜ ㄌㄧㄢˊ ㄧ ㄔㄨㄤˊ ㄋㄨㄢˇ ˙ㄏㄨㄛ ˙ㄉㄜ ㄇㄧㄢˊ ㄅㄟˋ ㄉㄡ ㄇㄞˇ ㄅㄨˋ ㄑㄧˇ",
          "en": "They didn't even have enough money for a warm quilt."
        },
        {
          "id": "p01-3",
          "speaker": "narrator",
          "style": "concerned, noticing someone in trouble",
          "ja": "ある ひ、まちで まきを うった かえりみち、おじいさんは わなに かかった つるを みつけました。",
          "zh": "一天，老爺爺賣完柴回家時，看見一隻困在陷阱裡的鶴。",
          "zhuyin": "ㄧ ㄊㄧㄢ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄇㄞˋ ㄨㄢˊ ㄔㄞˊ ㄏㄨㄟˊ ㄐㄧㄚ ㄕˊ ㄎㄢˋ ㄐㄧㄢˋ ㄧ ㄓ ㄎㄨㄣˋ ㄗㄞˋ ㄒㄧㄢˋ ㄐㄧㄥˇ ㄌㄧˇ ˙ㄉㄜ ㄏㄜˋ",
          "en": "One day, on his way home from selling firewood, the old man found a crane caught in a snare."
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/tsuru-no-ongaeshi/p02.webp",
      "alt": {
        "ja": "わなを はずして もらい、そらへ とびたつ つるを みあげる おじいさん",
        "zh": "被解開陷阱、飛上天空的鶴，和抬頭看的老爺爺",
        "en": "The old man looking up as the freed crane takes off into the sky"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "grandpa",
          "style": "gentle, kind grandfather, soothing",
          "ja": "「かわいそうに。 いま はずして あげるからね。」",
          "zh": "「好可憐啊，我馬上幫你解開。」",
          "zhuyin": "ㄏㄠˇ ㄎㄜˇ ㄌㄧㄢˊ ˙ㄚ ㄨㄛˇ ㄇㄚˇ ㄕㄤˋ ㄅㄤ ㄋㄧˇ ㄐㄧㄝˇ ㄎㄞ",
          "en": "“You poor thing. I'll set you free.”"
        },
        {
          "id": "p02-2",
          "speaker": "narrator",
          "style": "uplifting, like wings opening",
          "ja": "おじいさんは わなの なわを ほどきました。 つるは そらへ まいあがり、おじいさんの うえを くるりと まわって とんで いきました。",
          "zh": "老爺爺解開了繩圈。白鶴飛上天空，在老爺爺頭上繞了一圈，才飛走。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄐㄧㄝˇ ㄎㄞ ˙ㄌㄜ ㄕㄥˊ ㄑㄩㄢ ㄅㄞˊ ㄏㄜˋ ㄈㄟ ㄕㄤˋ ㄊㄧㄢ ㄎㄨㄥ ㄗㄞˋ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄊㄡˊ ㄕㄤˋ ㄖㄠˋ ˙ㄌㄜ ㄧ ㄑㄩㄢ ㄘㄞˊ ㄈㄟ ㄗㄡˇ",
          "en": "The old man untied the snare. The crane rose into the sky, circled once over his head, and flew away."
        },
        {
          "id": "p02-3",
          "speaker": "narrator",
          "style": "tender",
          "ja": "まるで「ありがとう」と いって いるようでした。",
          "zh": "好像在說「謝謝」一樣。",
          "zhuyin": "ㄏㄠˇ ㄒㄧㄤˋ ㄗㄞˋ ㄕㄨㄛ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄧ ㄧㄤˋ",
          "en": "It seemed to be saying “thank you.”"
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/tsuru-no-ongaeshi/p03.webp",
      "alt": {
        "ja": "ゆきの よる、とを あけて わかい むすめを むかえいれる おじいさんと おばあさん",
        "zh": "下雪的晚上，打開門迎接年輕姑娘的老爺爺和老奶奶",
        "en": "On a snowy night, the old couple open their door to a young woman"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "narrator",
          "style": "quiet night, a soft knock",
          "ja": "その よる、とを トントンと たたく おとが しました。",
          "zh": "那天晚上，有人咚咚地敲門。",
          "zhuyin": "ㄋㄚˋ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄧㄡˇ ㄖㄣˊ ㄉㄨㄥ ㄉㄨㄥ ˙ㄉㄜ ㄑㄧㄠ ㄇㄣˊ",
          "en": "That night, someone knocked at the door: knock, knock!"
        },
        {
          "id": "p03-2",
          "speaker": "daughter",
          "style": "gentle, polite young woman, a little shy and cold",
          "ja": "「そとは ゆきで、とても さむいのです。 ひとばん とめて いただけませんか。」",
          "zh": "「外面下著大雪，好冷喔。可以讓我借住一晚嗎？」",
          "zhuyin": "ㄨㄞˋ ㄇㄧㄢˋ ㄒㄧㄚˋ ˙ㄓㄜ ㄉㄚˋ ㄒㄩㄝˇ ㄏㄠˇ ㄌㄥˇ ㄛ ㄎㄜˇ ㄧˇ ㄖㄤˋ ㄨㄛˇ ㄐㄧㄝˋ ㄓㄨˋ ㄧ ㄨㄢˇ ˙ㄇㄚ",
          "en": "“It's snowing, and I'm so cold. May I stay the night?”"
        },
        {
          "id": "p03-3",
          "speaker": "grandma",
          "style": "warm, motherly grandmother",
          "ja": "「まあ、さむかったでしょう。 さあ、はいって あたたまって。」",
          "zh": "「哎呀，一定很冷吧，快進來取暖。」",
          "zhuyin": "ㄞ ㄧㄚ ㄧ ㄉㄧㄥˋ ㄏㄣˇ ㄌㄥˇ ˙ㄅㄚ ㄎㄨㄞˋ ㄐㄧㄣˋ ㄌㄞˊ ㄑㄩˇ ㄋㄨㄢˇ",
          "en": "“Oh, you must be freezing! Come in and get warm.”"
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/tsuru-no-ongaeshi/p04.webp",
      "alt": {
        "ja": "いろりばたで、おじいさんと おばあさんと わらいあう むすめ",
        "zh": "在日式地爐旁，和老爺爺、老奶奶一起笑的姑娘",
        "en": "The young woman laughing with the old couple by the sunken irori hearth"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "cozy and warm",
          "ja": "ゆきは なんにちも ふりつづき、むすめは いえの しごとを てつだいました。",
          "zh": "雪下了好多天，姑娘也幫忙做家事。",
          "zhuyin": "ㄒㄩㄝˇ ㄒㄧㄚˋ ˙ㄌㄜ ㄏㄠˇ ㄉㄨㄛ ㄊㄧㄢ ㄍㄨ ˙ㄋㄧㄤ ㄧㄝˇ ㄅㄤ ㄇㄤˊ ㄗㄨㄛˋ ㄐㄧㄚ ㄕˋ",
          "en": "The snow fell for days, and the girl helped with the chores."
        },
        {
          "id": "p04-2",
          "speaker": "daughter",
          "style": "gentle, polite young woman, hopeful",
          "ja": "「ここで いっしょに くらしても いいですか。」",
          "zh": "「我可以留在這裡，和你們一起住嗎？」",
          "zhuyin": "ㄨㄛˇ ㄎㄜˇ ㄧˇ ㄌㄧㄡˊ ㄗㄞˋ ㄓㄜˋ ㄌㄧˇ ㄏㄢˋ ㄋㄧˇ ˙ㄇㄣ ㄧ ㄑㄧˇ ㄓㄨˋ ˙ㄇㄚ",
          "en": "“May I stay and live here with you?”"
        },
        {
          "id": "p04-3",
          "speaker": "narrator",
          "style": "happy, heartwarming",
          "ja": "こどもの いない ふたりは おおよろこびで、むすめを じぶんたちの こどもとして むかえました。",
          "zh": "沒有孩子的兩個老人好高興，把她當成自己的女兒。",
          "zhuyin": "ㄇㄟˊ ㄧㄡˇ ㄏㄞˊ ˙ㄗ ˙ㄉㄜ ㄌㄧㄤˇ ˙ㄍㄜ ㄌㄠˇ ㄖㄣˊ ㄏㄠˇ ㄍㄠ ㄒㄧㄥˋ ㄅㄚˇ ㄊㄚ ㄉㄤ ㄔㄥˊ ㄗˋ ㄐㄧˇ ˙ㄉㄜ ㄋㄩˇ ㄦˊ",
          "en": "The old couple had no children of their own, and they happily welcomed her as their daughter."
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/tsuru-no-ongaeshi/p05.webp",
      "alt": {
        "ja": "ふるい はたおりきの ある へやの まえで、ていねいに おねがいする むすめと、うなずく おじいさんと おばあさん",
        "zh": "在放著舊織布機的房間前，有禮貌地請求的姑娘，和點頭的老爺爺老奶奶",
        "en": "The young woman politely asking a favor at the door of a room with an old loom, as the old couple nod"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "daughter",
          "style": "gentle, polite young woman, grateful",
          "ja": "「おせわに なった おれいに、ぬのを おりたいのです。 いとを すこし かって きて いただけませんか。」",
          "zh": "「我想織布，報答你們的照顧。可以幫我買一些線回來嗎？」",
          "zhuyin": "ㄨㄛˇ ㄒㄧㄤˇ ㄓ ㄅㄨˋ ㄅㄠˋ ㄉㄚˊ ㄋㄧˇ ˙ㄇㄣ ˙ㄉㄜ ㄓㄠˋ ㄍㄨˋ ㄎㄜˇ ㄧˇ ㄅㄤ ㄨㄛˇ ㄇㄞˇ ㄧ ㄒㄧㄝ ㄒㄧㄢˋ ㄏㄨㄟˊ ㄌㄞˊ ˙ㄇㄚ",
          "en": "“I'd like to weave some cloth to thank you for your kindness. Could you buy me a little thread?”"
        },
        {
          "id": "p05-2",
          "speaker": "daughter",
          "style": "soft but very serious, a solemn request",
          "ja": "「でも、おって いる あいだは、けっして のぞかないで ください。 のぞかれたら、ここには いられません。」",
          "zh": "「可是我織布的時候，千萬不要偷看喔。不然，我就不能留下來了。」",
          "zhuyin": "ㄎㄜˇ ㄕˋ ㄨㄛˇ ㄓ ㄅㄨˋ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄑㄧㄢ ㄨㄢˋ ㄅㄨˋ ㄧㄠˋ ㄊㄡ ㄎㄢˋ ㄛ ㄅㄨˋ ㄖㄢˊ ㄨㄛˇ ㄐㄧㄡˋ ㄅㄨˋ ㄋㄥˊ ㄌㄧㄡˊ ㄒㄧㄚˋ ㄌㄞˊ ˙ㄌㄜ",
          "en": "“But please don't peek while I weave. If you do, I can't stay.”"
        },
        {
          "id": "p05-3",
          "speaker": "narrator",
          "style": "steady and sincere",
          "ja": "ふたりは「やくそくするよ」と うなずき、おじいさんは いとを かって きました。",
          "zh": "兩個老人點點頭：「我們答應妳。」老爺爺就去買了線回來。",
          "zhuyin": "ㄌㄧㄤˇ ˙ㄍㄜ ㄌㄠˇ ㄖㄣˊ ㄉㄧㄢˇ ㄉㄧㄢˇ ㄊㄡˊ ㄨㄛˇ ˙ㄇㄣ ㄉㄚ ˙ㄧㄥ ㄋㄧˇ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄐㄧㄡˋ ㄑㄩˋ ㄇㄞˇ ˙ㄌㄜ ㄒㄧㄢˋ ㄏㄨㄟˊ ㄌㄞˊ",
          "en": "“We promise,” said the old couple, and the old man went and bought the thread."
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/tsuru-no-ongaeshi/p06.webp",
      "alt": {
        "ja": "しょうじの まえで、つかれた かおの むすめが、しろく かがやく ぬのを さしだす",
        "zh": "在紙門前，一臉疲倦的姑娘捧出白得發亮的布",
        "en": "In front of the paper door, the tired young woman holds out a shining white cloth she has woven"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "rhythmic like a loom, hushed",
          "ja": "とん からり、とん からり。 はたおりの おとが、みっか みばん つづきました。",
          "zh": "咚、喀啦，咚、喀啦。織布的聲音持續了三天三夜。",
          "zhuyin": "ㄉㄨㄥ ㄎㄚ ㄌㄚ ㄉㄨㄥ ㄎㄚ ㄌㄚ ㄓ ㄅㄨˋ ˙ㄉㄜ ㄕㄥ ㄧㄣ ㄔˊ ㄒㄩˋ ˙ㄌㄜ ㄙㄢ ㄊㄧㄢ ㄙㄢ ㄧㄝˋ",
          "en": "Clack, clatter, clack, clatter. The sound of weaving went on for three days and three nights."
        },
        {
          "id": "p06-2",
          "speaker": "narrator",
          "style": "awed, admiring beauty",
          "ja": "やっと でて きた むすめは、つかれた かおで、ゆきのように しろく かがやく ぬのを さしだしました。",
          "zh": "姑娘終於走出來了。她一臉疲倦，捧出一匹像雪一樣白、閃閃發亮的布。",
          "zhuyin": "ㄍㄨ ˙ㄋㄧㄤ ㄓㄨㄥ ㄩˊ ㄗㄡˇ ㄔㄨ ㄌㄞˊ ˙ㄌㄜ ㄊㄚ ㄧ ㄌㄧㄢˇ ㄆㄧˊ ㄐㄩㄢˋ ㄆㄥˇ ㄔㄨ ㄧ ㄆㄧˇ ㄒㄧㄤˋ ㄒㄩㄝˇ ㄧ ㄧㄤˋ ㄅㄞˊ ㄕㄢˇ ㄕㄢˇ ㄈㄚ ㄌㄧㄤˋ ˙ㄉㄜ ㄅㄨˋ",
          "en": "At last the girl came out, looking very tired, and held out a cloth that shone as white as snow."
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/tsuru-no-ongaeshi/p07.webp",
      "alt": {
        "ja": "まちで ぬのを うって、ふとんと おこめと いとの たばを もって かえる おじいさん",
        "zh": "在鎮上賣掉布，帶著棉被、米和一捆線回家的老爺爺",
        "en": "The old man coming home from town with a quilt, rice, and a bundle of thread after selling the cloth"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "pleased and relieved",
          "ja": "おじいさんが まちへ ぬのを もって いくと、たかい ねだんで うれました。",
          "zh": "老爺爺把布拿到鎮上，賣了好價錢。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄅㄚˇ ㄅㄨˋ ㄋㄚˊ ㄉㄠˋ ㄓㄣˋ ㄕㄤˋ ㄇㄞˋ ˙ㄌㄜ ㄏㄠˇ ㄐㄧㄚˋ ㄑㄧㄢˊ",
          "en": "The old man took the cloth to town, and it sold for a very high price."
        },
        {
          "id": "p07-2",
          "speaker": "narrator",
          "style": "warm and grateful",
          "ja": "おかげで、あたたかい ふとんと おこめと、つぎの ぬのの ための いとが かえました。",
          "zh": "他買了一床暖和的棉被、一些米，還有再織布要用的線。",
          "zhuyin": "ㄊㄚ ㄇㄞˇ ˙ㄌㄜ ㄧ ㄔㄨㄤˊ ㄋㄨㄢˇ ˙ㄏㄨㄛ ˙ㄉㄜ ㄇㄧㄢˊ ㄅㄟˋ ㄧ ㄒㄧㄝ ㄇㄧˇ ㄏㄞˊ ㄧㄡˇ ㄗㄞˋ ㄓ ㄅㄨˋ ㄧㄠˋ ㄩㄥˋ ˙ㄉㄜ ㄒㄧㄢˋ",
          "en": "With the money he bought a warm quilt, some rice, and more thread."
        },
        {
          "id": "p07-3",
          "speaker": "narrator",
          "style": "quiet, a hint of worry",
          "ja": "ふたりが ふゆを こせるように、むすめは また ぬのを おりはじめました。",
          "zh": "為了讓兩個老人平安過冬，姑娘又開始織布。",
          "zhuyin": "ㄨㄟˋ ˙ㄌㄜ ㄖㄤˋ ㄌㄧㄤˇ ˙ㄍㄜ ㄌㄠˇ ㄖㄣˊ ㄆㄧㄥˊ ㄢ ㄍㄨㄛˋ ㄉㄨㄥ ㄍㄨ ˙ㄋㄧㄤ ㄧㄡˋ ㄎㄞ ㄕˇ ㄓ ㄅㄨˋ",
          "en": "To help them through the winter, the girl began weaving again."
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/tsuru-no-ongaeshi/p08.webp",
      "alt": {
        "ja": "しょうじを ゆび いっぽんぶん そっと あける おばあさん。 なかは まだ みえない",
        "zh": "輕輕把紙門拉開一條縫的老奶奶，還看不見裡面",
        "en": "The old woman sliding the paper door open a finger's width; what is inside is still hidden"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "rhythmic, then concerned",
          "ja": "また とん からり。 なんにち たっても、むすめは でて きません。",
          "zh": "房裡又響起咚、喀啦的聲音。過了好幾天，姑娘還是沒有出來。",
          "zhuyin": "ㄈㄤˊ ㄌㄧˇ ㄧㄡˋ ㄒㄧㄤˇ ㄑㄧˇ ㄉㄨㄥ ㄎㄚ ㄌㄚ ˙ㄉㄜ ㄕㄥ ㄧㄣ ㄍㄨㄛˋ ˙ㄌㄜ ㄏㄠˇ ㄐㄧˇ ㄊㄧㄢ ㄍㄨ ˙ㄋㄧㄤ ㄏㄞˊ ㄕˋ ㄇㄟˊ ㄧㄡˇ ㄔㄨ ㄌㄞˊ",
          "en": "Clack, clatter went the loom again. Days passed, but the girl did not come out."
        },
        {
          "id": "p08-2",
          "speaker": "grandma",
          "style": "worried, whispering grandmother",
          "ja": "「だいじょうぶかい？ へんじを して おくれ。」",
          "zh": "「孩子，妳還好嗎？回答我一聲呀！」",
          "zhuyin": "ㄏㄞˊ ˙ㄗ ㄋㄧˇ ㄏㄞˊ ㄏㄠˇ ˙ㄇㄚ ㄏㄨㄟˊ ㄉㄚˊ ㄨㄛˇ ㄧ ㄕㄥ ˙ㄧㄚ",
          "en": "“Are you all right, dear? Please answer me!”"
        },
        {
          "id": "p08-3",
          "speaker": "narrator",
          "style": "hushed, holding breath",
          "ja": "へんじは ありません。 おばあさんは しんぱいで たまらず、やくそくを やぶって、そっと しょうじを あけました。",
          "zh": "沒有人回答。老奶奶擔心得不得了，還是違背了約定，輕輕拉開了紙門。",
          "zhuyin": "ㄇㄟˊ ㄧㄡˇ ㄖㄣˊ ㄏㄨㄟˊ ㄉㄚˊ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄉㄢ ㄒㄧㄣ ˙ㄉㄜ ㄅㄨˋ ㄉㄜˊ ㄌㄧㄠˇ ㄏㄞˊ ㄕˋ ㄨㄟˊ ㄅㄟˋ ˙ㄌㄜ ㄩㄝ ㄉㄧㄥˋ ㄑㄧㄥ ㄑㄧㄥ ㄌㄚ ㄎㄞ ˙ㄌㄜ ㄓˇ ㄇㄣˊ",
          "en": "No answer came. Terribly worried, the old woman broke her promise and quietly slid the paper door open."
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/tsuru-no-ongaeshi/p09.webp",
      "alt": {
        "ja": "はたおりきの まえで、じぶんの はねを ぬのに おりこむ いちわの つる。 そばに はねが すこし おちて いる",
        "zh": "在織布機前，把自己的羽毛織進布裡的一隻白鶴，旁邊散落著幾根羽毛",
        "en": "A crane at the loom, weaving her own white feathers into the cloth, with a few loose feathers nearby"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "quiet surprise, gentle and slow",
          "ja": "そこに いたのは、むすめでは なく、いちわの つるでした。",
          "zh": "房裡的不是姑娘，而是一隻白鶴。",
          "zhuyin": "ㄈㄤˊ ㄌㄧˇ ˙ㄉㄜ ㄅㄨˋ ㄕˋ ㄍㄨ ˙ㄋㄧㄤ ㄦˊ ㄕˋ ㄧ ㄓ ㄅㄞˊ ㄏㄜˋ",
          "en": "Inside was not the girl, but a crane."
        },
        {
          "id": "p09-2",
          "speaker": "narrator",
          "style": "tender and a little sad",
          "ja": "つるは じぶんの はねを、ぬのに おりこんで いたのです。 だから、あんなに つかれて いたのでした。",
          "zh": "白鶴正把自己的羽毛織進布裡。難怪她那麼累。",
          "zhuyin": "ㄅㄞˊ ㄏㄜˋ ㄓㄥˋ ㄅㄚˇ ㄗˋ ㄐㄧˇ ˙ㄉㄜ ㄩˇ ㄇㄠˊ ㄓ ㄐㄧㄣˋ ㄅㄨˋ ㄌㄧˇ ㄋㄢˊ ㄍㄨㄞˋ ㄊㄚ ㄋㄚˋ ˙ㄇㄜ ㄌㄟˋ",
          "en": "The crane was weaving her own feathers into the cloth. That was why she had been so tired."
        },
        {
          "id": "p09-3",
          "speaker": "narrator",
          "style": "gentle, magical and quiet",
          "ja": "つるは おばあさんに きが つくと、むすめの すがたに もどりました。",
          "zh": "白鶴發現了老奶奶，就變回了姑娘的模樣。",
          "zhuyin": "ㄅㄞˊ ㄏㄜˋ ㄈㄚ ㄒㄧㄢˋ ˙ㄌㄜ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄐㄧㄡˋ ㄅㄧㄢˋ ㄏㄨㄟˊ ˙ㄌㄜ ㄍㄨ ˙ㄋㄧㄤ ˙ㄉㄜ ㄇㄨˊ ㄧㄤˋ",
          "en": "When the crane saw the old woman, she changed back into the girl."
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/tsuru-no-ongaeshi/p10.webp",
      "alt": {
        "ja": "いろりの そばで わかれを つげる むすめと、なみだぐむ おじいさんと おばあさん",
        "zh": "在地爐旁告別的姑娘，和眼眶泛淚的老爺爺老奶奶",
        "en": "The young woman saying goodbye by the hearth, as the old couple hold back tears"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "daughter",
          "style": "gentle and sad, calm farewell",
          "ja": "「わたしは、あの ひ たすけて いただいた つるです。 おれいが したくて、ここへ きました。」",
          "zh": "「我就是那天被您救的鶴，是來報答你們的。」",
          "zhuyin": "ㄨㄛˇ ㄐㄧㄡˋ ㄕˋ ㄋㄚˋ ㄊㄧㄢ ㄅㄟˋ ㄋㄧㄣˊ ㄐㄧㄡˋ ˙ㄉㄜ ㄏㄜˋ ㄕˋ ㄌㄞˊ ㄅㄠˋ ㄉㄚˊ ㄋㄧˇ ˙ㄇㄣ ˙ㄉㄜ",
          "en": "“I am the crane you saved that day. I came here to thank you.”"
        },
        {
          "id": "p10-2",
          "speaker": "daughter",
          "style": "gentle and sad, calm farewell",
          "ja": "「しんぱいして くださったのですね。 でも、ほんとうの すがたを みられたので、もう ここには いられません。」",
          "zh": "「我知道您是擔心我。可是您看見了我真正的樣子，我不能再留下來了。」",
          "zhuyin": "ㄨㄛˇ ㄓ ㄉㄠˋ ㄋㄧㄣˊ ㄕˋ ㄉㄢ ㄒㄧㄣ ㄨㄛˇ ㄎㄜˇ ㄕˋ ㄋㄧㄣˊ ㄎㄢˋ ㄐㄧㄢˋ ˙ㄌㄜ ㄨㄛˇ ㄓㄣ ㄓㄥˋ ˙ㄉㄜ ㄧㄤˋ ˙ㄗ ㄨㄛˇ ㄅㄨˋ ㄋㄥˊ ㄗㄞˋ ㄌㄧㄡˊ ㄒㄧㄚˋ ㄌㄞˊ ˙ㄌㄜ",
          "en": "“I know you were worried about me. But you have seen who I really am, so I cannot stay.”"
        },
        {
          "id": "p10-3",
          "speaker": "grandma",
          "style": "regretful, tearful grandmother",
          "ja": "「やくそくを やぶって、ごめんなさい……。」",
          "zh": "「對不起，是我違背了約定……」",
          "zhuyin": "ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄕˋ ㄨㄛˇ ㄨㄟˊ ㄅㄟˋ ˙ㄌㄜ ㄩㄝ ㄉㄧㄥˋ",
          "en": "“I'm so sorry I broke my promise…”"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/tsuru-no-ongaeshi/end.webp",
      "alt": {
        "ja": "ゆきの ふる いえの うえを まわって とんで いく つると、おりかけの しろい ぬのを だいて てを ふる おじいさんと おばあさん",
        "zh": "白鶴在下雪的屋子上方繞圈飛走，老爺爺和老奶奶抱著還沒織完的白布揮手",
        "en": "The crane circling over the snowy house as it flies away, and the old couple waving from the doorway, holding the partly woven white cloth"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "slow, bittersweet",
          "ja": "むすめは つるの すがたに もどり、いえの うえを くるりと まわって、ゆきの そらへ とんで いきました。",
          "zh": "姑娘變回白鶴，在屋子上方繞了一圈，飛進飄雪的天空。",
          "zhuyin": "ㄍㄨ ˙ㄋㄧㄤ ㄅㄧㄢˋ ㄏㄨㄟˊ ㄅㄞˊ ㄏㄜˋ ㄗㄞˋ ㄨ ˙ㄗ ㄕㄤˋ ㄈㄤ ㄖㄠˋ ˙ㄌㄜ ㄧ ㄑㄩㄢ ㄈㄟ ㄐㄧㄣˋ ㄆㄧㄠ ㄒㄩㄝˇ ˙ㄉㄜ ㄊㄧㄢ ㄎㄨㄥ",
          "en": "The girl turned back into a crane, circled once over the house, and flew away into the snowy sky."
        },
        {
          "id": "end-2",
          "speaker": "grandpa",
          "style": "warm, tearful but loving farewell call",
          "ja": "「ありがとう。 げんきでね。」",
          "zh": "「謝謝妳，要好好的喔！」",
          "zhuyin": "ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ㄧㄠˋ ㄏㄠˇ ㄏㄠˇ ˙ㄉㄜ ㄛ",
          "en": "“Thank you! Be well!”"
        },
        {
          "id": "end-3",
          "speaker": "narrator",
          "style": "gentle, loving close, slow and clear",
          "ja": "ふたりは おりかけの しろい ぬのを だきしめました。 ふゆの あいだ、あたたかい ふとんで ねむりながら、むすめの ことを おもいました。 おしまい。",
          "zh": "兩個老人抱著還沒織完的白布。整個冬天，他們蓋著暖和的棉被，常常想起姑娘。故事說完了。",
          "zhuyin": "ㄌㄧㄤˇ ˙ㄍㄜ ㄌㄠˇ ㄖㄣˊ ㄅㄠˋ ˙ㄓㄜ ㄏㄞˊ ㄇㄟˊ ㄓ ㄨㄢˊ ˙ㄉㄜ ㄅㄞˊ ㄅㄨˋ ㄓㄥˇ ˙ㄍㄜ ㄉㄨㄥ ㄊㄧㄢ ㄊㄚ ˙ㄇㄣ ㄍㄞˋ ˙ㄓㄜ ㄋㄨㄢˇ ˙ㄏㄨㄛ ˙ㄉㄜ ㄇㄧㄢˊ ㄅㄟˋ ㄔㄤˊ ㄔㄤˊ ㄒㄧㄤˇ ㄑㄧˇ ㄍㄨ ˙ㄋㄧㄤ ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄨㄢˊ ˙ㄌㄜ",
          "en": "They held the unfinished white cloth close. All winter they slept warm under their quilt and remembered their daughter. The end."
        }
      ]
    }
  ]
});
