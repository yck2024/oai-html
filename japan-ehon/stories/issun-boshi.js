// Issun-boshi, the One-Inch Boy ({一寸法師|いっすんぼうし}) for the Japanese folktale picture books.
// One story object in the shared book format: Japanese marks furigana as {漢字|かんじ};
// `zhuyin` holds one 注音 syllable per Han character of `zh`; `en` is the English text.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.JapanEhonStories = root.JapanEhonStories || []).push(story);
})(typeof self !== 'undefined' ? self : this, {
  "id": "issun-boshi",
  "title": {
    "ja": "{一寸法師|いっすんぼうし}",
    "zh": "一寸法師",
    "zhuyin": "ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ",
    "en": "Issun-boshi, the One-Inch Boy"
  },
  "tagline": {
    "ja": "ゆびくらいの ちいさな おとこのこの、おおきな ぼうけん",
    "zh": "像手指一樣小的男孩的大冒險",
    "en": "The big adventure of a boy no bigger than a thumb"
  },
  "origin": {
    "ja": "にほんの むかしばなし",
    "zh": "日本民間故事",
    "en": "A Japanese folktale"
  },
  "credit": {
    "ja": "いっすんぼうしは、むろまちじだいの おわりには つたわって いたと かんがえられ、のちに「おとぎぞうし」にも のりました。 「{一寸|いっすん}」は むかしの ながさの たんいで、およそ 3センチです。 おとぎぞうしでは、いっすんぼうしが だいじんに「むすめが こめを ぬすんだ」と うそを つき、むすめが いえを おわれる ばめんが あります。 この えほんでは その ばめんを はぶき、めいじじだいに いわや さざなみが こどもむけに かいた おはなしを さんこうに しました。 おおくの おはなしでは、いっすんぼうしは だいじんの むすめと けっこんしますが、この えほんでは ふるさとへ かえり、りょうしんと くらします。",
    "zh": "〈一寸法師〉在日本室町時代晚期就已經流傳，後來也收錄在「御伽草子」裡。「一寸」是古代的長度單位，大約三公分。御伽草子的版本裡，一寸法師誣賴大臣的女兒偷米，害她被趕出家門；本書省略了這段情節，並參考巖谷小波在明治時代為孩子寫的版本。許多版本裡，一寸法師最後和大臣的女兒結婚；本書則讓他回到家鄉，和爸爸媽媽一起生活。",
    "en": "Issun-boshi was known by the late Muromachi period and later appeared among the otogizōshi tales. An issun is an old unit of length, about 3 centimeters. In the otogizōshi tale, he falsely accuses the minister's daughter of stealing rice, and she is driven from her home. This book leaves out that episode and draws on the retelling for children that Iwaya Sazanami wrote in the Meiji era. In many tellings he marries the minister's daughter; here he goes home to live with his parents."
  },
  "theme": {
    "accent": "#c0462c",
    "soft": "#f9e0d8"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/issun-boshi/cover.webp",
      "alt": {
        "ja": "おわんの ふねに のって、はしで こぐ ちいさな いっすんぼうし",
        "zh": "坐著木碗小船、用筷子划槳的小小一寸法師",
        "en": "Tiny Issun-boshi paddling a rice-bowl boat with a chopstick"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "warm, inviting storyteller opening a picture book",
          "ja": "にほんの むかしばなし「{一寸法師|いっすんぼうし}」",
          "zh": "日本民間故事〈一寸法師〉",
          "zhuyin": "ㄖˋ ㄅㄣˇ ㄇㄧㄣˊ ㄐㄧㄢ ㄍㄨˋ ㄕˋ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ",
          "en": "A Japanese folktale: Issun-boshi, the One-Inch Boy"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "bright and adventurous",
          "ja": "ゆびくらいの ちいさな おとこのこが、おおきな ぼうけんに でかけます。",
          "zh": "一個像手指那麼小的男孩，要出發去大冒險了。",
          "zhuyin": "ㄧ ˙ㄍㄜ ㄒㄧㄤˋ ㄕㄡˇ ㄓˇ ㄋㄚˋ ˙ㄇㄜ ㄒㄧㄠˇ ˙ㄉㄜ ㄋㄢˊ ㄏㄞˊ ㄧㄠˋ ㄔㄨ ㄈㄚ ㄑㄩˋ ㄉㄚˋ ㄇㄠˋ ㄒㄧㄢˇ ˙ㄌㄜ",
          "en": "A boy no bigger than a thumb sets off on a big adventure."
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/issun-boshi/p01.webp",
      "alt": {
        "ja": "おみやで てを あわせる おじいさんと おばあさん",
        "zh": "在神社雙手合十祈禱的老爺爺和老奶奶",
        "en": "An old man and an old woman praying with their palms together at a shrine"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "gentle once-upon-a-time storyteller",
          "ja": "むかし むかし、こどもの いない おじいさんと おばあさんが いました。",
          "zh": "很久很久以前，有一對沒有孩子的老爺爺和老奶奶。",
          "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄧㄡˇ ㄧ ㄉㄨㄟˋ ㄇㄟˊ ㄧㄡˇ ㄏㄞˊ ˙ㄗ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ",
          "en": "Long, long ago, there lived an old man and an old woman who had no children."
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "quiet and heartfelt",
          "ja": "ふたりは まいにち、すみよしの かみさまに おいのりしました。",
          "zh": "他們每天都向住吉的神明祈禱。",
          "zhuyin": "ㄊㄚ ˙ㄇㄣ ㄇㄟˇ ㄊㄧㄢ ㄉㄡ ㄒㄧㄤˋ ㄓㄨˋ ㄐㄧˊ ˙ㄉㄜ ㄕㄣˊ ㄇㄧㄥˊ ㄑㄧˊ ㄉㄠˇ",
          "en": "Every day, they prayed to the god of the Sumiyoshi shrine."
        },
        {
          "id": "p01-3",
          "speaker": "grandma",
          "style": "earnest, hopeful, softly pleading",
          "ja": "「どんなに ちいさくても いいから、こどもを さずけて ください。」",
          "zh": "「就算很小很小也沒關係，請賜給我們一個孩子吧。」",
          "zhuyin": "ㄐㄧㄡˋ ㄙㄨㄢˋ ㄏㄣˇ ㄒㄧㄠˇ ㄏㄣˇ ㄒㄧㄠˇ ㄧㄝˇ ㄇㄟˊ ㄍㄨㄢ ㄒㄧˋ ㄑㄧㄥˇ ㄘˋ ㄍㄟˇ ㄨㄛˇ ˙ㄇㄣ ㄧ ˙ㄍㄜ ㄏㄞˊ ˙ㄗ ˙ㄅㄚ",
          "en": "“Please give us a child, even a very, very small one.”"
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/issun-boshi/p02.webp",
      "alt": {
        "ja": "おばあさんの てのひらの うえで わらう、ゆびくらいの あかちゃん",
        "zh": "在老奶奶手心上笑的、像手指一樣小的寶寶",
        "en": "A thumb-sized baby laughing in the palm of the old woman's hand"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "joyful, then amused",
          "ja": "すると ほんとうに あかちゃんが うまれました。 でも、おやゆびくらいの ちいささです。",
          "zh": "後來，真的生下了一個寶寶，可是他只有大拇指那麼小。",
          "zhuyin": "ㄏㄡˋ ㄌㄞˊ ㄓㄣ ˙ㄉㄜ ㄕㄥ ㄒㄧㄚˋ ˙ㄌㄜ ㄧ ˙ㄍㄜ ㄅㄠˇ ㄅㄠˇ ㄎㄜˇ ㄕˋ ㄊㄚ ㄓˇ ㄧㄡˇ ㄉㄚˋ ㄇㄨˇ ㄓˇ ㄋㄚˋ ˙ㄇㄜ ㄒㄧㄠˇ",
          "en": "And then a baby really was born. But he was only as big as a thumb."
        },
        {
          "id": "p02-2",
          "speaker": "narrator",
          "style": "fond and a little playful",
          "ja": "ふたりは あかちゃんを「いっすんぼうし」と なづけました。 なんねん たっても、ちいさい ままです。",
          "zh": "老爺爺和老奶奶給他取名叫「一寸法師」。過了好多年，他還是一樣小。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄍㄟˇ ㄊㄚ ㄑㄩˇ ㄇㄧㄥˊ ㄐㄧㄠˋ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄍㄨㄛˋ ˙ㄌㄜ ㄏㄠˇ ㄉㄨㄛ ㄋㄧㄢˊ ㄊㄚ ㄏㄞˊ ㄕˋ ㄧ ㄧㄤˋ ㄒㄧㄠˇ",
          "en": "The old couple named him Issun-boshi, the One-Inch Boy. Years went by, but he stayed just as small."
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/issun-boshi/p03.webp",
      "alt": {
        "ja": "はりの かたなを こしに さした いっすんぼうしと、おわんと はしを わたす おじいさんと おばあさん",
        "zh": "腰間插著針刀的一寸法師，和遞給他木碗和筷子的老爺爺老奶奶",
        "en": "Issun-boshi with a needle sword at his waist, as the old couple hand him a bowl and a chopstick"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "issun",
          "style": "small but brave and determined boy",
          "ja": "「ぼく、みやこで はたらきたい！ いつか おとうさんと おかあさんを たすけたいんだ。」",
          "zh": "「我想去京城工作，將來幫爸爸媽媽的忙。」",
          "zhuyin": "ㄨㄛˇ ㄒㄧㄤˇ ㄑㄩˋ ㄐㄧㄥ ㄔㄥˊ ㄍㄨㄥ ㄗㄨㄛˋ ㄐㄧㄤ ㄌㄞˊ ㄅㄤ ㄅㄚˋ ˙ㄅㄚ ㄇㄚ ˙ㄇㄚ ˙ㄉㄜ ㄇㄤˊ",
          "en": "“I want to work in the capital, and someday I'll help you both!”"
        },
        {
          "id": "p03-2",
          "speaker": "narrator",
          "style": "warm and supportive",
          "ja": "おばあさんは はりで かたなを、おじいさんは おわんの ふねと はしの かいを つくって くれました。",
          "zh": "老奶奶用針做了一把刀，老爺爺用木碗做了小船，還用筷子做了船槳。",
          "zhuyin": "ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄩㄥˋ ㄓㄣ ㄗㄨㄛˋ ˙ㄌㄜ ㄧ ㄅㄚˇ ㄉㄠ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄩㄥˋ ㄇㄨˋ ㄨㄢˇ ㄗㄨㄛˋ ˙ㄌㄜ ㄒㄧㄠˇ ㄔㄨㄢˊ ㄏㄞˊ ㄩㄥˋ ㄎㄨㄞˋ ˙ㄗ ㄗㄨㄛˋ ˙ㄌㄜ ㄔㄨㄢˊ ㄐㄧㄤˇ",
          "en": "The old woman made him a sword from a sewing needle, and the old man made him a rice-bowl boat and a chopstick paddle."
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/issun-boshi/p04.webp",
      "alt": {
        "ja": "かわの なみを こえて、おわんの ふねを こぐ いっすんぼうし",
        "zh": "划著木碗小船、越過河浪的一寸法師",
        "en": "Issun-boshi paddling his bowl boat over the river's waves"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "adventurous and flowing",
          "ja": "いっすんぼうしは おわんの ふねに のって、かわを さかのぼり、みやこへ むかいました。",
          "zh": "一寸法師坐上木碗小船，逆著河水往京城划。",
          "zhuyin": "ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄗㄨㄛˋ ㄕㄤˋ ㄇㄨˋ ㄨㄢˇ ㄒㄧㄠˇ ㄔㄨㄢˊ ㄋㄧˋ ˙ㄓㄜ ㄏㄜˊ ㄕㄨㄟˇ ㄨㄤˇ ㄐㄧㄥ ㄔㄥˊ ㄏㄨㄚˊ",
          "en": "Issun-boshi climbed into his bowl boat and paddled upriver toward the capital."
        },
        {
          "id": "p04-2",
          "speaker": "narrator",
          "style": "splashy, then brave and rhythmic",
          "ja": "なみが ざぶん！ でも まけずに、えっさ ほいさ。",
          "zh": "浪花嘩啦一聲打過來！他不放棄，嘿咻、嘿咻地划！",
          "zhuyin": "ㄌㄤˋ ㄏㄨㄚ ㄏㄨㄚ ㄌㄚ ㄧ ㄕㄥ ㄉㄚˇ ㄍㄨㄛˋ ㄌㄞˊ ㄊㄚ ㄅㄨˋ ㄈㄤˋ ㄑㄧˋ ㄏㄟ ㄒㄧㄡ ㄏㄟ ㄒㄧㄡ ˙ㄉㄜ ㄏㄨㄚˊ",
          "en": "A wave crashed over the little boat! Still he paddled on. Heave-ho, heave-ho!"
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/issun-boshi/p05.webp",
      "alt": {
        "ja": "おおきな おやしきの げたの そばで あいさつする いっすんぼうしと、おどろく だいじん",
        "zh": "在大宅院的木屐旁打招呼的一寸法師，和嚇一跳的大臣",
        "en": "Issun-boshi greeting from beside a pair of wooden sandals at a grand mansion, and the surprised minister"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "narrator",
          "style": "grand arrival",
          "ja": "みやこに ついた いっすんぼうしは、おおきな おやしきの まえで おおごえを だしました。",
          "zh": "到了京城，一寸法師在一座大宅院前大聲喊。",
          "zhuyin": "ㄉㄠˋ ˙ㄌㄜ ㄐㄧㄥ ㄔㄥˊ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄗㄞˋ ㄧ ㄗㄨㄛˋ ㄉㄚˋ ㄓㄞˊ ㄩㄢˋ ㄑㄧㄢˊ ㄉㄚˋ ㄕㄥ ㄏㄢˇ",
          "en": "When he reached the capital, Issun-boshi called out in a big voice in front of a grand mansion."
        },
        {
          "id": "p05-2",
          "speaker": "issun",
          "style": "loud, polite, full of spirit",
          "ja": "「ごめんください！ ここで はたらかせて ください！」",
          "zh": "「有人在嗎？請讓我在這裡工作！」",
          "zhuyin": "ㄧㄡˇ ㄖㄣˊ ㄗㄞˋ ˙ㄇㄚ ㄑㄧㄥˇ ㄖㄤˋ ㄨㄛˇ ㄗㄞˋ ㄓㄜˋ ㄌㄧˇ ㄍㄨㄥ ㄗㄨㄛˋ",
          "en": "“Hello! Please let me work here!”"
        },
        {
          "id": "p05-3",
          "speaker": "narrator",
          "style": "amused and warm",
          "ja": "だいじんは、げたの そばの ちいさな すがたに びっくり。 でも、げんきな いっすんぼうしを きに いりました。",
          "zh": "大臣看見木屐旁的小小身影，嚇了一跳，可是他很喜歡這個有精神的孩子。",
          "zhuyin": "ㄉㄚˋ ㄔㄣˊ ㄎㄢˋ ㄐㄧㄢˋ ㄇㄨˋ ㄐㄧ ㄆㄤˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄒㄧㄠˇ ㄕㄣ ㄧㄥˇ ㄒㄧㄚˋ ˙ㄌㄜ ㄧ ㄊㄧㄠˋ ㄎㄜˇ ㄕˋ ㄊㄚ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ ㄓㄜˋ ˙ㄍㄜ ㄧㄡˇ ㄐㄧㄥ ㄕㄣˊ ˙ㄉㄜ ㄏㄞˊ ˙ㄗ",
          "en": "The minister was amazed to find such a tiny boy beside his sandals, but he liked the lively little fellow at once."
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/issun-boshi/p06.webp",
      "alt": {
        "ja": "だいじんの むすめの つくえの うえで、いっしょに ほんを よむ いっすんぼうし",
        "zh": "在大臣女兒的書桌上，和她一起看書的一寸法師",
        "en": "Issun-boshi reading a book with the minister's daughter on top of her desk"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "proud and warm",
          "ja": "だいじんは いっすんぼうしに、むすめと いっしょに ほんを よむように たのみました。",
          "zh": "大臣請一寸法師陪女兒讀書。",
          "zhuyin": "ㄉㄚˋ ㄔㄣˊ ㄑㄧㄥˇ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄆㄟˊ ㄋㄩˇ ㄦˊ ㄉㄨˊ ㄕㄨ",
          "en": "The minister asked Issun-boshi to read with his daughter."
        },
        {
          "id": "p06-2",
          "speaker": "narrator",
          "style": "sweet and friendly",
          "ja": "ふたりは なかよしに なりました。 だいじんは むすめを かわいがって、「おひめさま」と よんで いました。",
          "zh": "兩個人成了好朋友。大臣很疼女兒，叫她「公主」。",
          "zhuyin": "ㄌㄧㄤˇ ˙ㄍㄜ ㄖㄣˊ ㄔㄥˊ ˙ㄌㄜ ㄏㄠˇ ㄆㄥˊ ㄧㄡˇ ㄉㄚˋ ㄔㄣˊ ㄏㄣˇ ㄊㄥˊ ㄋㄩˇ ㄦˊ ㄐㄧㄠˋ ㄊㄚ ㄍㄨㄥ ㄓㄨˇ",
          "en": "They became good friends. The minister fondly called his daughter “Princess.”"
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/issun-boshi/p07.webp",
      "alt": {
        "ja": "きよみずでらからの かえりみち、おひめさまの まえに あらわれた おおきな あかおに",
        "zh": "從清水寺回家的路上，出現在公主面前的大紅鬼",
        "en": "A big red oni appearing before the princess on the way home from Kiyomizu Temple"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "calm, then building suspense",
          "ja": "ある ひ、おひめさまと きよみずでらへ おまいりに いった かえりみち……",
          "zh": "有一天，他陪公主去清水寺參拜，在回家的路上……",
          "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄊㄚ ㄆㄟˊ ㄍㄨㄥ ㄓㄨˇ ㄑㄩˋ ㄑㄧㄥ ㄕㄨㄟˇ ㄙˋ ㄘㄢ ㄅㄞˋ ㄗㄞˋ ㄏㄨㄟˊ ㄐㄧㄚ ˙ㄉㄜ ㄌㄨˋ ㄕㄤˋ",
          "en": "One day, on the way home from praying at Kiyomizu Temple with the princess…"
        },
        {
          "id": "p07-2",
          "speaker": "narrator",
          "style": "sudden, big but not frightening",
          "ja": "おおきな おにが あらわれました！",
          "zh": "突然出現了一隻大鬼！",
          "zhuyin": "ㄊㄨ ㄖㄢˊ ㄔㄨ ㄒㄧㄢˋ ˙ㄌㄜ ㄧ ㄓ ㄉㄚˋ ㄍㄨㄟˇ",
          "en": "Suddenly, a great big oni appeared!"
        },
        {
          "id": "p07-3",
          "speaker": "oni",
          "style": "big, blustery, booming ogre, more silly than scary",
          "ja": "「その おひめさまを つれて いくぞ！」",
          "zh": "「我要把公主帶走！」",
          "zhuyin": "ㄨㄛˇ ㄧㄠˋ ㄅㄚˇ ㄍㄨㄥ ㄓㄨˇ ㄉㄞˋ ㄗㄡˇ",
          "en": "“I'm taking that princess with me!”"
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/issun-boshi/p08.webp",
      "alt": {
        "ja": "おなかを おさえる まるい かおの あかおに。 すけて みえる おなかの なかで、いっすんぼうしが はりの かたなで ちくちく。 そばに おひめさま",
        "zh": "圓臉的大紅鬼捧著肚子，透過肚子可以看見一寸法師在裡面用針刀戳呀戳，公主在一旁看著",
        "en": "A comical red oni clutching its tummy; a gentle see-through view shows Issun-boshi inside pricking with his needle sword, while the princess watches nearby"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "issun",
          "style": "small but fearless, ringing voice",
          "ja": "「まて！ おひめさまに てを だすな！」",
          "zh": "「站住！不准你碰公主！」",
          "zhuyin": "ㄓㄢˋ ㄓㄨˋ ㄅㄨˋ ㄓㄨㄣˇ ㄋㄧˇ ㄆㄥˋ ㄍㄨㄥ ㄓㄨˇ",
          "en": "“Stop! Don't you touch the princess!”"
        },
        {
          "id": "p08-2",
          "speaker": "narrator",
          "style": "dramatic but playful",
          "ja": "おには わらって、いっすんぼうしを つまみあげ、ぱくりと のみこんで しまいました。",
          "zh": "大鬼哈哈大笑，把一寸法師捏起來，一口吞進了肚子裡。",
          "zhuyin": "ㄉㄚˋ ㄍㄨㄟˇ ㄏㄚ ㄏㄚ ㄉㄚˋ ㄒㄧㄠˋ ㄅㄚˇ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄋㄧㄝ ㄑㄧˇ ㄌㄞˊ ㄧ ㄎㄡˇ ㄊㄨㄣ ㄐㄧㄣˋ ˙ㄌㄜ ㄉㄨˋ ˙ㄗ ㄌㄧˇ",
          "en": "The oni laughed, picked him up, and swallowed him in one gulp!"
        },
        {
          "id": "p08-3",
          "speaker": "narrator",
          "style": "mischievous and quick",
          "ja": "でも いっすんぼうしは、おなかの なかで はりの かたなを ちくちく！",
          "zh": "可是一寸法師在大鬼的肚子裡，用針刀戳呀戳！",
          "zhuyin": "ㄎㄜˇ ㄕˋ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄗㄞˋ ㄉㄚˋ ㄍㄨㄟˇ ˙ㄉㄜ ㄉㄨˋ ˙ㄗ ㄌㄧˇ ㄩㄥˋ ㄓㄣ ㄉㄠ ㄔㄨㄛ ˙ㄧㄚ ㄔㄨㄛ",
          "en": "But inside the oni's tummy, Issun-boshi went prick, prick with his needle sword!"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/issun-boshi/p09.webp",
      "alt": {
        "ja": "ほっとして いっすんぼうしの そばに しゃがむ おひめさまと、とおくへ にげて いく おに。 じめんに こづちが おちて いる",
        "zh": "鬆了一口氣、蹲在一寸法師旁邊的公主，和逃向遠處的大鬼，地上掉著一把小槌子",
        "en": "The relieved princess crouching beside Issun-boshi, the oni running off in the distance, and a little mallet left on the ground"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "oni",
          "style": "big ogre whimpering comically, giving up",
          "ja": "「いたた、いたた！ まいった、まいった！」",
          "zh": "「哎喲、哎喲！我投降，我投降！」",
          "zhuyin": "ㄞ ㄧㄛ ㄞ ㄧㄛ ㄨㄛˇ ㄊㄡˊ ㄒㄧㄤˊ ㄨㄛˇ ㄊㄡˊ ㄒㄧㄤˊ",
          "en": "“Ouch, ouch! I give up, I give up!”"
        },
        {
          "id": "p09-2",
          "speaker": "narrator",
          "style": "brisk and funny",
          "ja": "おには いっすんぼうしを ぽんと はきだすと、こづちを おとして にげて いきました。",
          "zh": "大鬼把一寸法師吐了出來，慌慌張張地逃走，連小槌子都掉了。",
          "zhuyin": "ㄉㄚˋ ㄍㄨㄟˇ ㄅㄚˇ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄊㄨˇ ˙ㄌㄜ ㄔㄨ ㄌㄞˊ ㄏㄨㄤ ㄏㄨㄤ ㄓㄤ ㄓㄤ ˙ㄉㄜ ㄊㄠˊ ㄗㄡˇ ㄌㄧㄢˊ ㄒㄧㄠˇ ㄔㄨㄟˊ ˙ㄗ ㄉㄡ ㄉㄧㄠˋ ˙ㄌㄜ",
          "en": "The oni spat him out with a pop, dropped its little mallet, and ran away."
        },
        {
          "id": "p09-3",
          "speaker": "princess",
          "style": "relieved and grateful, warm",
          "ja": "「たすけて くれて、ありがとう！」",
          "zh": "「謝謝你救了我！」",
          "zhuyin": "ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ㄐㄧㄡˋ ˙ㄌㄜ ㄨㄛˇ",
          "en": "“Thank you for saving me!”"
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/issun-boshi/p10.webp",
      "alt": {
        "ja": "こづちを ふる おひめさまと、ぐんぐん おおきく なる いっすんぼうし",
        "zh": "揮著小槌子的公主，和越長越高的一寸法師",
        "en": "The princess swinging the mallet as Issun-boshi grows taller and taller"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "princess",
          "style": "kind, bright young noblewoman",
          "ja": "「あっ、うちでの こづち！ ねがいが かなうんだって。」",
          "zh": "「啊，是萬寶槌！聽說它能實現願望！」",
          "zhuyin": "ㄚ ㄕˋ ㄨㄢˋ ㄅㄠˇ ㄔㄨㄟˊ ㄊㄧㄥ ㄕㄨㄛ ㄊㄚ ㄋㄥˊ ㄕˊ ㄒㄧㄢˋ ㄩㄢˋ ㄨㄤˋ",
          "en": "“Oh, the magic mallet! They say it grants wishes!”"
        },
        {
          "id": "p10-2",
          "speaker": "issun",
          "style": "sincere and thoughtful",
          "ja": "「おおきく なって、ふるさとで おとうさんと おかあさんを たすけたい！」",
          "zh": "「我想長高，回家幫爸爸媽媽的忙！」",
          "zhuyin": "ㄨㄛˇ ㄒㄧㄤˇ ㄓㄤˇ ㄍㄠ ㄏㄨㄟˊ ㄐㄧㄚ ㄅㄤ ㄅㄚˋ ˙ㄅㄚ ㄇㄚ ˙ㄇㄚ ˙ㄉㄜ ㄇㄤˊ",
          "en": "“I want to grow tall and go home to help my parents!”"
        },
        {
          "id": "p10-3",
          "speaker": "narrator",
          "style": "magical, rising with wonder",
          "ja": "「おおきく なあれ、おおきく なあれ！」 おひめさまが こづちを ふると、いっすんぼうしは ぐんぐん のびました。",
          "zh": "「變大吧，變大吧！」公主揮了揮小槌子，一寸法師越長越高。",
          "zhuyin": "ㄅㄧㄢˋ ㄉㄚˋ ˙ㄅㄚ ㄅㄧㄢˋ ㄉㄚˋ ˙ㄅㄚ ㄍㄨㄥ ㄓㄨˇ ㄏㄨㄟ ˙ㄌㄜ ㄏㄨㄟ ㄒㄧㄠˇ ㄔㄨㄟˊ ˙ㄗ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄩㄝˋ ㄓㄤˇ ㄩㄝˋ ㄍㄠ",
          "en": "“Grow big, grow big!” The princess swung the mallet, and up, up he grew!"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/issun-boshi/end.webp",
      "alt": {
        "ja": "いえの まえで、りっぱな わかものに なった いっすんぼうしを むかえる おじいさんと おばあさん。 いっすんぼうしは おばあさんの みずおけに てを のばす",
        "zh": "在家門口，老爺爺和老奶奶迎接長成青年的一寸法師，他伸手去接老奶奶手上的水桶",
        "en": "At their doorway, the old couple welcome Issun-boshi home as a fine young man; he reaches for the water bucket the old woman is carrying"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "warm homecoming",
          "ja": "いっすんぼうしが かえると、おじいさんと おばあさんは うれしなみだを ながしました。",
          "zh": "一寸法師回家了，老爺爺和老奶奶高興得流下眼淚。",
          "zhuyin": "ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄏㄨㄟˊ ㄐㄧㄚ ˙ㄌㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄍㄠ ㄒㄧㄥˋ ˙ㄉㄜ ㄌㄧㄡˊ ㄒㄧㄚˋ ㄧㄢˇ ㄌㄟˋ",
          "en": "When Issun-boshi came home, the old man and the old woman cried happy tears."
        },
        {
          "id": "end-2",
          "speaker": "grandma",
          "style": "tender and proud grandmother",
          "ja": "「ちいさくても おおきくても、あなたは わたしたちの じまんの こどもだよ。」",
          "zh": "「不管你是小小的，還是高高的，我們都為你感到驕傲！」",
          "zhuyin": "ㄅㄨˋ ㄍㄨㄢˇ ㄋㄧˇ ㄕˋ ㄒㄧㄠˇ ㄒㄧㄠˇ ˙ㄉㄜ ㄏㄞˊ ㄕˋ ㄍㄠ ㄍㄠ ˙ㄉㄜ ㄨㄛˇ ˙ㄇㄣ ㄉㄡ ㄨㄟˋ ㄋㄧˇ ㄍㄢˇ ㄉㄠˋ ㄐㄧㄠ ㄠˋ",
          "en": "“Big or small, we will always be proud of you.”"
        },
        {
          "id": "end-3",
          "speaker": "narrator",
          "style": "warm, happy close, slow and clear",
          "ja": "それから いっすんぼうしは みずくみを てつだい、みんなで なかよく くらしました。 おしまい。",
          "zh": "從此，一寸法師幫忙提水，一家人快快樂樂地生活。故事說完了。",
          "zhuyin": "ㄘㄨㄥˊ ㄘˇ ㄧ ㄘㄨㄣˋ ㄈㄚˇ ㄕ ㄅㄤ ㄇㄤˊ ㄊㄧˊ ㄕㄨㄟˇ ㄧ ㄐㄧㄚ ㄖㄣˊ ㄎㄨㄞˋ ㄎㄨㄞˋ ㄌㄜˋ ㄌㄜˋ ˙ㄉㄜ ㄕㄥ ㄏㄨㄛˊ ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄨㄢˊ ˙ㄌㄜ",
          "en": "From then on, he helped fetch water, and they all lived happily together. The end."
        }
      ]
    }
  ]
});
