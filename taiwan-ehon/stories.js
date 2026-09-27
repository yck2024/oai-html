// Story data for the bilingual picture books. Each story is plain data: add a new book by
// appending one object with a cover, story pages, and an ending page, then add its pictures
// (images/<story>/<page>.webp) and narration (audio/<story>/<ja|zh>/<line>.mp3).
// Japanese marks furigana as {漢字|かんじ}. `zhuyin` holds one 注音 syllable per Han character
// of `zh`, separated by spaces. `speaker` and `style` direct the build-time narration only;
// the optional `jaTts` / `zhTts` replace the text sent to the narrator to fix a misreading.
(function (root, stories) {
  if (typeof module === 'object' && module.exports) module.exports = stories;
  else root.TaiwanEhonStories = stories;
})(typeof self !== 'undefined' ? self : this, [
  {
    "id": "bai-zei-qi",
    "title": {
      "ja": "{白賊七|パイツェイチー}",
      "zh": "白賊七",
      "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄑㄧ"
    },
    "tagline": {
      "ja": "うそが とっても じょうずな おとこの おはなし",
      "zh": "一個很會說謊的人的故事"
    },
    "origin": {
      "ja": "たいわんの むかしばなし",
      "zh": "台灣民間故事"
    },
    "credit": {
      "ja": "パイツェイチーは、{台湾語|たいわんご}の みんわに でてくる いたずらものです。 もとの おはなしには いろいろな いたずらが あります。 この えほんは「たからの おなべ」と「たからの ふく」の はなしを もとに、こども むけに やさしく かきなおしました。",
      "zh": "白賊七是台灣閩南語民間故事裡愛說謊的人物，原本有許多不同的騙人故事。這本繪本參考〈寶鍋〉和〈寶衣〉兩個故事，為小朋友重新改寫。"
    },
    "theme": {
      "accent": "#e0703a",
      "soft": "#ffe3cf"
    },
    "pages": [
      {
        "id": "cover",
        "image": "images/bai-zei-qi/cover.webp",
        "alt": {
          "ja": "あつあつの おなべを もって にやりと わらう パイツェイチー",
          "zh": "捧著熱鍋子、偷偷笑的白賊七"
        },
        "lines": [
          {
            "id": "cover-1",
            "speaker": "narrator",
            "style": "warm, inviting storyteller opening a picture book, a little playful",
            "ja": "たいわんの むかしばなし「パイツェイチー」",
            "zh": "台灣民間故事〈白賊七〉",
            "zhuyin": "ㄊㄞˊ ㄨㄢ ㄇㄧㄣˊ ㄐㄧㄢ ㄍㄨˋ ㄕˋ ㄅㄞˊ ㄗㄟˊ ㄑㄧ"
          },
          {
            "id": "cover-2",
            "speaker": "narrator",
            "style": "playful, with a knowing smile",
            "ja": "うそが とっても じょうずな おとこの おはなしです。",
            "zh": "這是一個很會說謊的人的故事。",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄧ ˙ㄍㄜ ㄏㄣˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄏㄨㄤˇ ˙ㄉㄜ ㄖㄣˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/bai-zei-qi/p01.webp",
        "alt": {
          "ja": "たいわんの むらの みちを あるく パイツェイチー",
          "zh": "走在台灣村子小路上的白賊七"
        },
        "lines": [
          {
            "id": "p01-1",
            "speaker": "narrator",
            "style": "gentle once-upon-a-time storyteller",
            "ja": "むかし むかし、たいわんの ある むらに、パイツェイチーという おとこが いました。",
            "jaTts": "むかし むかし、たいわんの ある むらに、ぱい、つぇい、ちーという おとこが いました。",
            "zh": "很久很久以前，台灣的一個村子裡，住著一個人，叫做白賊七。",
            "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄊㄞˊ ㄨㄢ ˙ㄉㄜ ㄧ ˙ㄍㄜ ㄘㄨㄣ ˙ㄗ ㄌㄧˇ ㄓㄨˋ ˙ㄓㄜ ㄧ ˙ㄍㄜ ㄖㄣˊ ㄐㄧㄠˋ ㄗㄨㄛˋ ㄅㄞˊ ㄗㄟˊ ㄑㄧ"
          },
          {
            "id": "p01-2",
            "speaker": "narrator",
            "style": "curious, sharing a fun little secret",
            "ja": "「パイツェイ」は たいわんの ことばで「うそ」、「チー」は「{七|なな}」という いみです。",
            "jaTts": "「ぱい、つぇい」は たいわんの ことばで「うそ」、「ちー」は「なな」という いみです。",
            "zh": "「白賊」在台語裡是「說謊」的意思，他是家裡的第七個孩子。",
            "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄗㄞˋ ㄊㄞˊ ㄩˇ ㄌㄧˇ ㄕˋ ㄕㄨㄛ ㄏㄨㄤˇ ˙ㄉㄜ ㄧˋ ˙ㄙ ㄊㄚ ㄕˋ ㄐㄧㄚ ˙ㄌㄧ ˙ㄉㄜ ㄉㄧˋ ㄑㄧ ˙ㄍㄜ ㄏㄞˊ ˙ㄗ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/bai-zei-qi/p02.webp",
        "alt": {
          "ja": "むらの ひとを びっくりさせる パイツェイチーと、たからものを ながめる だんなさん",
          "zh": "讓村民嚇一跳的白賊七，和欣賞寶貝的老爺"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "admiring and lively",
            "ja": "パイツェイチーは あたまが よくて、おしゃべりが じょうず。",
            "jaTts": "ぱい、つぇい、ちーは あたまが よくて、おしゃべりが じょうず。",
            "zh": "白賊七很聰明，也很會說話。",
            "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄏㄣˇ ㄘㄨㄥ ㄇㄧㄥˊ ㄧㄝˇ ㄏㄣˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄏㄨㄚˋ",
            "zhTts": "白贼七很聰明，也很會說話。"
          },
          {
            "id": "p02-2",
            "speaker": "narrator",
            "style": "sly and conspiratorial, a little giggle in the voice",
            "ja": "でも、ひとを だまして びっくりさせるのが だいすきでした。",
            "zh": "可是，他最喜歡騙人，讓大家嚇一跳。",
            "zhuyin": "ㄎㄜˇ ㄕˋ ㄊㄚ ㄗㄨㄟˋ ㄒㄧˇ ㄏㄨㄢ ㄆㄧㄢˋ ㄖㄣˊ ㄖㄤˋ ㄉㄚˋ ㄐㄧㄚ ㄒㄧㄚˋ ㄧ ㄊㄧㄠˋ"
          },
          {
            "id": "p02-3",
            "speaker": "narrator",
            "style": "bouncy, introducing a funny character",
            "ja": "むらには、たからものに めが ない おかねもちの だんなさんも いました。",
            "zh": "村子裡，還有一位最愛寶貝的有錢老爺。",
            "zhuyin": "ㄘㄨㄣ ˙ㄗ ㄌㄧˇ ㄏㄞˊ ㄧㄡˇ ㄧ ㄨㄟˋ ㄗㄨㄟˋ ㄞˋ ㄅㄠˇ ㄅㄟˋ ˙ㄉㄜ ㄧㄡˇ ㄑㄧㄢˊ ㄌㄠˇ ˙ㄧㄝ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/bai-zei-qi/p03.webp",
        "alt": {
          "ja": "ゆげの たつ おなべを かかえて、だんなさんの いえへ いそぐ パイツェイチー",
          "zh": "捧著冒煙的鍋子，趕去老爺家的白賊七"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "narrator",
            "style": "brisk and mischievous",
            "ja": "ある ひ、パイツェイチーは いえで ごはんを たいて、あつあつの おなべを かかえて でかけました。",
            "zh": "有一天，白賊七在家把飯煮好，捧著熱呼呼的鍋子出門了。",
            "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄗㄞˋ ㄐㄧㄚ ㄅㄚˇ ㄈㄢˋ ㄓㄨˇ ㄏㄠˇ ㄆㄥˇ ˙ㄓㄜ ㄖㄜˋ ㄏㄨ ㄏㄨ ˙ㄉㄜ ㄍㄨㄛ ˙ㄗ ㄔㄨ ㄇㄣˊ ˙ㄌㄜ"
          },
          {
            "id": "p03-2",
            "speaker": "bai",
            "style": "sneaky, grand, over-the-top salesman showing off a treasure",
            "ja": "「だんなさん、これは たからの おなべ！ {火|ひ}が なくても、ごはんが たけるんですよ。」",
            "zh": "「老爺，這是寶貝鍋子！不用火，也能煮飯喔！」",
            "zhuyin": "ㄌㄠˇ ˙ㄧㄝ ㄓㄜˋ ㄕˋ ㄅㄠˇ ㄅㄟˋ ㄍㄨㄛ ˙ㄗ ㄅㄨˋ ㄩㄥˋ ㄏㄨㄛˇ ㄧㄝˇ ㄋㄥˊ ㄓㄨˇ ㄈㄢˋ ㄛ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/bai-zei-qi/p04.webp",
        "alt": {
          "ja": "おなべの ふたを あけて めを かがやかせる だんなさん",
          "zh": "打開鍋蓋、眼睛發亮的老爺"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "narrator",
            "style": "full of wonder",
            "ja": "ふたを あけると、ほかほかの ごはんが ゆげを たてていました。",
            "zh": "打開鍋蓋，裡面的白飯正冒著熱氣。",
            "zhuyin": "ㄉㄚˇ ㄎㄞ ㄍㄨㄛ ㄍㄞˋ ㄌㄧˇ ㄇㄧㄢˋ ˙ㄉㄜ ㄅㄞˊ ㄈㄢˋ ㄓㄥˋ ㄇㄠˋ ˙ㄓㄜ ㄖㄜˋ ㄑㄧˋ"
          },
          {
            "id": "p04-2",
            "speaker": "rich",
            "style": "brightly amazed and cheerful, natural Japanese; keep the words and vowels exact without adding laughter or particles",
            "ja": "「すごい！ その おなべ、かうよ！」",
            "zh": "「太厲害了！這個鍋子我買了！」",
            "zhuyin": "ㄊㄞˋ ㄌㄧˋ ㄏㄞˋ ˙ㄌㄜ ㄓㄜˋ ˙ㄍㄜ ㄍㄨㄛ ˙ㄗ ㄨㄛˇ ㄇㄞˇ ˙ㄌㄜ"
          },
          {
            "id": "p04-3",
            "speaker": "narrator",
            "style": "amused, a little teasing",
            "ja": "だんなさんは、おかねを たくさん はらいました。",
            "zh": "老爺付了好多好多錢。",
            "zhuyin": "ㄌㄠˇ ˙ㄧㄝ ㄈㄨˋ ˙ㄌㄜ ㄏㄠˇ ㄉㄨㄛ ㄏㄠˇ ㄉㄨㄛ ㄑㄧㄢˊ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/bai-zei-qi/p05.webp",
        "alt": {
          "ja": "おたんじょうびかいで、ごはんが できずに まっかに なる だんなさん",
          "zh": "生日宴上煮不出飯、臉紅通通的老爺"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "festive and proud",
            "ja": "だんなさんの おたんじょうびかい。 みんなの まえで、おこめと {水|みず}を おなべに いれました。",
            "zh": "老爺生日宴會上，他在大家面前，把米跟水倒進鍋子裡。",
            "zhuyin": "ㄌㄠˇ ˙ㄧㄝ ㄕㄥ ㄖˋ ㄧㄢˋ ㄏㄨㄟˋ ˙ㄕㄤ ㄊㄚ ㄗㄞˋ ㄉㄚˋ ㄐㄧㄚ ㄇㄧㄢˋ ㄑㄧㄢˊ ㄅㄚˇ ㄇㄧˇ ㄍㄣ ㄕㄨㄟˇ ㄉㄠˋ ㄐㄧㄣˋ ㄍㄨㄛ ˙ㄗ ㄌㄧˇ"
          },
          {
            "id": "p05-2",
            "speaker": "narrator",
            "style": "slow comic suspense, drawn out, then deflated",
            "ja": "まって…… まって…… でも、ごはんは ちっとも できません。",
            "zh": "等啊等，等啊等……飯卻一點也沒有煮好。",
            "zhuyin": "ㄉㄥˇ ˙ㄚ ㄉㄥˇ ㄉㄥˇ ˙ㄚ ㄉㄥˇ ㄈㄢˋ ㄑㄩㄝˋ ㄧ ㄉㄧㄢˇ ㄧㄝˇ ㄇㄟˊ ㄧㄡˇ ㄓㄨˇ ㄏㄠˇ"
          },
          {
            "id": "p05-3",
            "speaker": "narrator",
            "style": "giggly and playful",
            "ja": "みんなは くすくす。 だんなさんの かおは まっかに なりました。",
            "zh": "大家偷偷地笑，老爺的臉變得紅通通。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄊㄡ ㄊㄡ ˙ㄉㄜ ㄒㄧㄠˋ ㄌㄠˇ ˙ㄧㄝ ˙ㄉㄜ ㄌㄧㄢˇ ㄅㄧㄢˋ ˙ㄉㄜ ㄏㄨㄥˊ ㄊㄨㄥ ㄊㄨㄥ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/bai-zei-qi/p06.webp",
        "alt": {
          "ja": "たきびの そばで わらの ふくを きて あせを かく パイツェイチー",
          "zh": "穿著稻草衣、在火堆旁流汗的白賊七"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "a little stern, chilly winter mood",
            "ja": "さむい ふゆの ひ、おこった だんなさんが、パイツェイチーの いえに やってきました。",
            "zh": "冷冷的冬天，生氣的老爺跑去找白賊七。",
            "zhuyin": "ㄌㄥˇ ㄌㄥˇ ˙ㄉㄜ ㄉㄨㄥ ㄊㄧㄢ ㄕㄥ ㄑㄧˋ ˙ㄉㄜ ㄌㄠˇ ˙ㄧㄝ ㄆㄠˇ ㄑㄩˋ ㄓㄠˇ ㄅㄞˊ ㄗㄟˊ ㄑㄧ"
          },
          {
            "id": "p06-2",
            "speaker": "narrator",
            "style": "funny, noticing something silly",
            "ja": "パイツェイチーは、たきびの そばで わらの ふくを きて、あせを かいていました。",
            "jaTts": "ぱい、つぇい、ちーは、たきびの そばで わらの ふくを きて、あせを かいていました。",
            "zh": "白賊七穿著稻草衣，坐在火堆旁邊，熱得滿頭大汗。",
            "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄔㄨㄢ ˙ㄓㄜ ㄉㄠˋ ㄘㄠˇ ㄧ ㄗㄨㄛˋ ㄗㄞˋ ㄏㄨㄛˇ ㄉㄨㄟ ㄆㄤˊ ㄅㄧㄢ ㄖㄜˋ ˙ㄉㄜ ㄇㄢˇ ㄊㄡˊ ㄉㄚˋ ㄏㄢˋ"
          },
          {
            "id": "p06-3",
            "speaker": "bai",
            "style": "playful and sly, speaking clearly without any added laughter or interjections",
            "ja": "「これは たからの ふく。 きると、ふゆでも ぽかぽかなんですよ。」",
            "zh": "「這是寶貝衣服，穿上它，冬天也暖呼呼！」",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄅㄠˇ ㄅㄟˋ ㄧ ˙ㄈㄨ ㄔㄨㄢ ㄕㄤˋ ㄊㄚ ㄉㄨㄥ ㄊㄧㄢ ㄧㄝˇ ㄋㄨㄢˇ ㄏㄨ ㄏㄨ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/bai-zei-qi/p07.webp",
        "alt": {
          "ja": "つめたい かぜの なかで くしゃみを する だんなさん",
          "zh": "在冷風中打噴嚏的老爺"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "amused, shaking head",
            "ja": "だんなさんは おこるのも わすれて、わらの ふくを かいました。",
            "zh": "老爺忘了生氣，又把稻草衣買回家。",
            "zhuyin": "ㄌㄠˇ ˙ㄧㄝ ㄨㄤˋ ˙ㄌㄜ ㄕㄥ ㄑㄧˋ ㄧㄡˋ ㄅㄚˇ ㄉㄠˋ ㄘㄠˇ ㄧ ㄇㄞˇ ㄏㄨㄟˊ ㄐㄧㄚ"
          },
          {
            "id": "p07-2",
            "speaker": "narrator",
            "style": "shivery, like a cold wind blowing",
            "ja": "ところが、そとは ぴゅうぴゅう つめたい かぜ。",
            "zh": "可是，外面的冷風咻咻地吹。",
            "zhuyin": "ㄎㄜˇ ㄕˋ ㄨㄞˋ ㄇㄧㄢˋ ˙ㄉㄜ ㄌㄥˇ ㄈㄥ ㄒㄧㄡ ㄒㄧㄡ ˙ㄉㄜ ㄔㄨㄟ"
          },
          {
            "id": "p07-3",
            "speaker": "rich",
            "style": "a playful, clear sneeze; do not add extra words",
            "ja": "「はっ、はっ、はくしょん！」",
            "zh": "「哈啾！」",
            "zhuyin": "ㄏㄚ ㄐㄧㄡ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/bai-zei-qi/p08.webp",
        "alt": {
          "ja": "うでを くんで あきれる むらの ひとたちと だんなさん",
          "zh": "雙手交叉、搖頭的村民和老爺"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "matter-of-fact, a little serious",
            "ja": "こうして、むらの みんなが しって しまいました。",
            "zh": "這下子，全村的人都知道了。",
            "zhuyin": "ㄓㄜˋ ㄒㄧㄚˋ ˙ㄗ ㄑㄩㄢˊ ㄘㄨㄣ ˙ㄉㄜ ㄖㄣˊ ㄉㄡ ㄓ ㄉㄠˋ ˙ㄌㄜ"
          },
          {
            "id": "p08-2",
            "speaker": "rich",
            "style": "fed up, grumpy but not scary",
            "ja": "「パイツェイチーの はなしは、うそばっかり！」",
            "jaTts": "「ぱい、つぇい、ちーの はなしは、うそばっかり！」",
            "zh": "「白賊七說的話，都是騙人的！」",
            "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄕㄨㄛ ˙ㄉㄜ ㄏㄨㄚˋ ㄉㄡ ㄕˋ ㄆㄧㄢˋ ㄖㄣˊ ˙ㄉㄜ",
            "zhTts": "白贼七說的話，都是騙人的！"
          },
          {
            "id": "p08-3",
            "speaker": "narrator",
            "style": "quiet and a little sad",
            "ja": "それから、だれも パイツェイチーの いうことを しんじなく なりました。",
            "jaTts": "それから、だれも ぱい、つぇい、ちーの いうことを しんじなく なりました。",
            "zh": "從此以後，再也沒有人相信白賊七了。",
            "zhuyin": "ㄘㄨㄥˊ ㄘˇ ㄧˇ ㄏㄡˋ ㄗㄞˋ ㄧㄝˇ ㄇㄟˊ ㄧㄡˇ ㄖㄣˊ ㄒㄧㄤ ㄒㄧㄣˋ ㄅㄞˊ ㄗㄟˊ ㄑㄧ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/bai-zei-qi/p09.webp",
        "alt": {
          "ja": "あめの ひ、みずたまりに しりもちを つく パイツェイチー",
          "zh": "在雨天滑進小水窪裡的白賊七"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "a little surprising, but safe and gentle for a young child",
            "ja": "ある あめの ひ、パイツェイチーは すべって、ちいさな みずたまりに しりもちを つきました。",
            "jaTts": "ある あめの ひ、ぱい、つぇい、ちーは すべって、ちいさな みずたまりに しりもちを つきました。",
            "zh": "一個下雨天，他滑了一跤，一屁股坐進小小的水窪裡。",
            "zhuyin": "ㄧ ˙ㄍㄜ ㄒㄧㄚˋ ㄩˇ ㄊㄧㄢ ㄊㄚ ㄏㄨㄚˊ ˙ㄌㄜ ㄧ ㄐㄧㄠ ㄧ ㄆㄧˋ ㄍㄨˇ ㄗㄨㄛˋ ㄐㄧㄣˋ ㄒㄧㄠˇ ㄒㄧㄠˇ ˙ㄉㄜ ㄕㄨㄟˇ ㄨㄚ ㄌㄧˇ"
          },
          {
            "id": "p09-2",
            "speaker": "bai",
            "style": "surprised and sincere, calling out clearly without sounding frightened",
            "ja": "「たすけてー！ ほんとうに ころんじゃったよー！」",
            "zh": "「幫幫我！我真的摔倒了啦！」",
            "zhuyin": "ㄅㄤ ㄅㄤ ㄨㄛˇ ㄨㄛˇ ㄓㄣ ˙ㄉㄜ ㄕㄨㄞ ㄉㄠˇ ˙ㄌㄜ ˙ㄌㄚ"
          },
          {
            "id": "p09-3",
            "speaker": "narrator",
            "style": "gently show how a lie makes people hesitate, not frightening",
            "ja": "でも、みんなは「また うそかな？」と、すぐには ちかづきませんでした。",
            "zh": "可是大家以為他又在說謊，沒有馬上靠近。",
            "zhuyin": "ㄎㄜˇ ㄕˋ ㄉㄚˋ ㄐㄧㄚ ㄧˇ ㄨㄟˊ ㄊㄚ ㄧㄡˋ ㄗㄞˋ ㄕㄨㄛ ㄏㄨㄤˇ ㄇㄟˊ ㄧㄡˇ ㄇㄚˇ ㄕㄤˋ ㄎㄠˋ ㄐㄧㄣˋ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/bai-zei-qi/p10.webp",
        "alt": {
          "ja": "むらの ひとに たすけられ、あやまる パイツェイチー",
          "zh": "被村民拉起來、低頭道歉的白賊七"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "warm relief, neighbors helping right away",
            "ja": "でも、ほんとうだと わかると、ちかくの ひとが すぐに てを のばし、たすけて くれました。",
            "zh": "大家看見他真的摔進水窪裡，馬上伸手把他拉起來。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄎㄢˋ ㄐㄧㄢˋ ㄊㄚ ㄓㄣ ˙ㄉㄜ ㄕㄨㄞ ㄐㄧㄣˋ ㄕㄨㄟˇ ㄨㄚ ㄌㄧˇ ㄇㄚˇ ㄕㄤˋ ㄕㄣ ㄕㄡˇ ㄅㄚˇ ㄊㄚ ㄌㄚ ㄑㄧˇ ㄌㄞˊ"
          },
          {
            "id": "p10-2",
            "speaker": "bai",
            "style": "sincere and sorry, small humble voice",
            "ja": "「ごめんなさい。 もう うそは つきません。」",
            "zh": "「對不起，我再也不說謊了。」",
            "zhuyin": "ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄨㄛˇ ㄗㄞˋ ㄧㄝˇ ㄅㄨˋ ㄕㄨㄛ ㄏㄨㄤˇ ˙ㄌㄜ"
          },
          {
            "id": "p10-3",
            "speaker": "narrator",
            "style": "warm and hopeful",
            "ja": "パイツェイチーは おかねを かえし、かしこい あたまを、ひとを たすける ために つかうように なりました。",
            "jaTts": "ぱい、つぇい、ちーは おかねを かえし、かしこい あたまを、ひとを たすける ために つかうように なりました。",
            "zh": "白賊七把錢還給老爺，從此用聰明的頭腦幫助大家。",
            "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄅㄚˇ ㄑㄧㄢˊ ㄏㄨㄢˊ ㄍㄟˇ ㄌㄠˇ ˙ㄧㄝ ㄘㄨㄥˊ ㄘˇ ㄩㄥˋ ㄘㄨㄥ ㄇㄧㄥˊ ˙ㄉㄜ ㄊㄡˊ ㄋㄠˇ ㄅㄤ ㄓㄨˋ ㄉㄚˋ ㄐㄧㄚ"
          }
        ]
      },
      {
        "id": "end",
        "image": "images/bai-zei-qi/end.webp",
        "alt": {
          "ja": "むらの ひとを たすけて、みんなと わらう パイツェイチー",
          "zh": "幫助村民、和大家一起笑的白賊七"
        },
        "lines": [
          {
            "id": "end-1",
            "speaker": "narrator",
            "style": "gentle, loving lesson, slow and clear",
            "ja": "かしこいのは たのしい。 でも、うそを つくと、さいごは こまった ことに なるよ。",
            "zh": "聰明很好玩，但是亂說謊，最後常常會出事喔。",
            "zhuyin": "ㄘㄨㄥ ㄇㄧㄥˊ ㄏㄣˇ ㄏㄠˇ ㄨㄢˊ ㄉㄢˋ ˙ㄕ ㄌㄨㄢˋ ㄕㄨㄛ ㄏㄨㄤˇ ㄗㄨㄟˋ ㄏㄡˋ ㄔㄤˊ ㄔㄤˊ ㄏㄨㄟˋ ㄔㄨ ㄕˋ ㄛ"
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
  },
  {
    "id": "shooting-the-sun",
    "title": {
      "ja": "たいようを うちおとした ゆうしゃ",
      "zh": "射日英雄",
      "zhuyin": "ㄕㄜˋ ㄖˋ ㄧㄥ ㄒㄩㄥˊ"
    },
    "tagline": {
      "ja": "ふたつの たいようと、とおい とおい たびの おはなし",
      "zh": "兩個太陽和一段好遠好遠的旅程"
    },
    "origin": {
      "ja": "たいわんの げんじゅうみんぞくの おはなし",
      "zh": "台灣原住民族的故事"
    },
    "credit": {
      "ja": "たいようを うちおとす おはなしは、タイヤル{族|ぞく}、ブヌン{族|ぞく}、サイシャット{族|ぞく}など、たいわんの たくさんの げんじゅうみんぞくに つたわって います。 たいようの かずや たびの ようすは、みんぞくや むらごとに ちがいます。 この えほんは、タイヤル{族|ぞく}の おはなしを もとに、こども むけに やさしく かきなおしました。",
      "zh": "射日的故事，在泰雅族、布農族、賽夏族等許多台灣原住民族之間流傳，太陽的數量和旅程的樣子，各族、各部落說法都不一樣。這本繪本參考泰雅族的說法，為小朋友重新改寫。"
    },
    "theme": {
      "accent": "#2f8f7a",
      "soft": "#dff1e8"
    },
    "pages": [
      {
        "id": "cover",
        "image": "images/shooting-the-sun/cover.webp",
        "alt": {
          "ja": "ふたつの たいようの ひとつに ゆみを むける わかもの",
          "zh": "拉弓瞄準兩個太陽之一的年輕人"
        },
        "lines": [
          {
            "id": "cover-1",
            "speaker": "narrator",
            "style": "epic and full of awe, but warm",
            "ja": "たいようを うちおとした ゆうしゃ",
            "zh": "射日英雄",
            "zhuyin": "ㄕㄜˋ ㄖˋ ㄧㄥ ㄒㄩㄥˊ"
          },
          {
            "id": "cover-2",
            "speaker": "narrator",
            "style": "respectful and warm",
            "ja": "たいわんの げんじゅうみんぞくに つたわる おはなしです。",
            "zh": "這是台灣原住民族流傳的故事。",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄊㄞˊ ㄨㄢ ㄩㄢˊ ㄓㄨˋ ㄇㄧㄣˊ ㄗㄨˊ ㄌㄧㄡˊ ㄔㄨㄢˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/shooting-the-sun/p01.webp",
        "alt": {
          "ja": "ふたつの たいようが てらす やまの むら",
          "zh": "被兩個太陽照著的山上部落"
        },
        "lines": [
          {
            "id": "p01-1",
            "speaker": "narrator",
            "style": "once-upon-a-time, a sense of wonder",
            "ja": "むかし むかし、そらには たいようが ふたつ ありました。",
            "zh": "很久很久以前，天上有兩個太陽。",
            "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄊㄧㄢ ㄕㄤˋ ㄧㄡˇ ㄌㄧㄤˇ ˙ㄍㄜ ㄊㄞˋ ㄧㄤˊ"
          },
          {
            "id": "p01-2",
            "speaker": "narrator",
            "style": "puzzled, a little worried",
            "ja": "ひとつが しずむと、もう ひとつが のぼるので、よるが ありません。",
            "zh": "一個太陽下山，另一個就爬上來，天上一直亮著，沒有夜晚。",
            "zhuyin": "ㄧ ˙ㄍㄜ ㄊㄞˋ ㄧㄤˊ ㄒㄧㄚˋ ㄕㄢ ㄌㄧㄥˋ ㄧ ˙ㄍㄜ ㄐㄧㄡˋ ㄆㄚˊ ㄕㄤˋ ˙ㄌㄞ ㄊㄧㄢ ㄕㄤˋ ㄧ ㄓˊ ㄌㄧㄤˋ ˙ㄓㄜ ㄇㄟˊ ㄧㄡˇ ㄧㄝˋ ㄨㄢˇ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/shooting-the-sun/p02.webp",
        "alt": {
          "ja": "かれた あわの はたけと、こかげで やすむ ひとびと",
          "zh": "枯掉的小米田，和在樹蔭下休息的族人"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "hot and weary, slow",
            "ja": "あつくて あつくて、はたけの あわは かれ、{川|かわ}の {水|みず}も へって しまいました。",
            "zh": "天氣熱得不得了，田裡的小米枯了，河水也變少了。",
            "zhuyin": "ㄊㄧㄢ ㄑㄧˋ ㄖㄜˋ ˙ㄉㄜ ㄅㄨˋ ㄉㄜˊ ㄌㄧㄠˇ ㄊㄧㄢˊ ㄌㄧˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄇㄧˇ ㄎㄨ ˙ㄌㄜ ㄏㄜˊ ㄕㄨㄟˇ ㄧㄝˇ ㄅㄧㄢˋ ㄕㄠˇ ˙ㄌㄜ"
          },
          {
            "id": "p02-2",
            "speaker": "narrator",
            "style": "tired, sleepy sigh",
            "ja": "みんな ねむれなくて、くたくたです。",
            "zh": "大家都睡不著覺，累壞了。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄕㄨㄟˋ ㄅㄨˋ ㄓㄠˊ ㄐㄧㄠˋ ㄌㄟˋ ㄏㄨㄞˋ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/shooting-the-sun/p03.webp",
        "alt": {
          "ja": "ひを かこんで そうだんする おとしよりたち",
          "zh": "圍著火堆商量的長老們"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "narrator",
            "style": "thoughtful and serious",
            "ja": "むらの おとしよりたちが あつまって、そうだんしました。",
            "zh": "部落的長老們聚在一起商量。",
            "zhuyin": "ㄅㄨˋ ㄌㄨㄛˋ ˙ㄉㄜ ㄓㄤˇ ㄌㄠˇ ˙ㄇㄣ ㄐㄩˋ ㄗㄞˋ ㄧ ㄑㄧˇ ㄕㄤ ˙ㄌㄧㄤ"
          },
          {
            "id": "p03-2",
            "speaker": "elder",
            "style": "wise, calm, determined village elder",
            "ja": "「ゆみやで、たいようを ひとつ うちおとそう。」",
            "zh": "「我們用弓箭，把一個太陽射下來吧！」",
            "zhuyin": "ㄨㄛˇ ˙ㄇㄣ ㄩㄥˋ ㄍㄨㄥ ㄐㄧㄢˋ ㄅㄚˇ ㄧ ˙ㄍㄜ ㄊㄞˋ ㄧㄤˊ ㄕㄜˋ ㄒㄧㄚˋ ㄌㄞˊ ˙ㄅㄚ"
          },
          {
            "id": "p03-3",
            "speaker": "narrator",
            "style": "far away and mysterious",
            "ja": "でも、たいようの のぼる ところは、ずっと ずっと とおい ひがしの はてです。",
            "zh": "可是太陽升起的地方，在好遠好遠的東邊。",
            "zhuyin": "ㄎㄜˇ ㄕˋ ㄊㄞˋ ㄧㄤˊ ㄕㄥ ㄑㄧˇ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄗㄞˋ ㄏㄠˇ ㄩㄢˇ ㄏㄠˇ ㄩㄢˇ ˙ㄉㄜ ㄉㄨㄥ ㄅㄧㄢ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/shooting-the-sun/p04.webp",
        "alt": {
          "ja": "あかちゃんを せなかに おぶって しゅっぱつする ゆうしゃたち",
          "zh": "把嬰兒背在背上出發的勇士們"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "narrator",
            "style": "hopeful and brave",
            "ja": "そこで、つよい ゆうしゃたちが えらばれました。",
            "zh": "於是，部落選出了強壯的勇士。",
            "zhuyin": "ㄩˊ ㄕˋ ㄅㄨˋ ㄌㄨㄛˋ ㄒㄩㄢˇ ㄔㄨ ˙ㄌㄜ ㄑㄧㄤˊ ㄓㄨㄤˋ ˙ㄉㄜ ㄩㄥˇ ㄕˋ"
          },
          {
            "id": "p04-2",
            "speaker": "narrator",
            "style": "tender and brave",
            "ja": "ゆうしゃたちは、あかちゃんの むすこを せなかに おぶって、しゅっぱつしました。",
            "zh": "勇士們把還是小嬰兒的兒子背在背上，出發了。",
            "zhuyin": "ㄩㄥˇ ㄕˋ ˙ㄇㄣ ㄅㄚˇ ㄏㄞˊ ㄕˋ ㄒㄧㄠˇ ㄧㄥ ㄦˊ ˙ㄉㄜ ㄦˊ ㄗˇ ㄅㄟ ㄗㄞˋ ㄅㄟˋ ㄕㄤˋ ㄔㄨ ㄈㄚ ˙ㄌㄜ",
            "zhTts": "勇士們把還是小嬰兒的兒子揹在背上，出發了。"
          },
          {
            "id": "p04-3",
            "speaker": "narrator",
            "style": "gently explaining",
            "ja": "たびは とても ながいから、こどもが おおきく なって、あとを つげるように。",
            "zh": "因為路太遠了，要讓孩子長大以後，接著完成任務。",
            "zhuyin": "ㄧㄣ ㄨㄟˋ ㄌㄨˋ ㄊㄞˋ ㄩㄢˇ ˙ㄌㄜ ㄧㄠˋ ㄖㄤˋ ㄏㄞˊ ˙ㄗ ㄓㄤˇ ㄉㄚˋ ㄧˇ ㄏㄡˋ ㄐㄧㄝ ˙ㄓㄜ ㄨㄢˊ ㄔㄥˊ ㄖㄣˋ ㄨˋ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/shooting-the-sun/p05.webp",
        "alt": {
          "ja": "みちばたに みかんの たねを うえる おとうさん",
          "zh": "在路邊種下橘子種子的爸爸"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "calm, walking rhythm",
            "ja": "たびの とちゅう、たべた みかんの たねを、みちに うえて いきました。",
            "zh": "一路上，他們把吃完的橘子種子，種在路邊。",
            "zhuyin": "ㄧ ㄌㄨˋ ㄕㄤˋ ㄊㄚ ˙ㄇㄣ ㄅㄚˇ ㄔ ㄨㄢˊ ˙ㄉㄜ ㄐㄩˊ ˙ㄗ ㄓㄨㄥˇ ㄗˇ ㄓㄨㄥˋ ㄗㄞˋ ㄌㄨˋ ㄅㄧㄢ"
          },
          {
            "id": "p05-2",
            "speaker": "father",
            "style": "warm, kind young father talking to his baby",
            "ja": "「かえりみちの めじるしに なるし、みも たべられるよ。」",
            "zh": "「回來的時候，它會幫我們認路，還可以吃喔。」",
            "zhuyin": "ㄏㄨㄟˊ ˙ㄌㄞ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄊㄚ ㄏㄨㄟˋ ㄅㄤ ㄨㄛˇ ˙ㄇㄣ ㄖㄣˋ ㄌㄨˋ ㄏㄞˊ ㄎㄜˇ ㄧˇ ㄔ ㄛ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/shooting-the-sun/p06.webp",
        "alt": {
          "ja": "しろい かみの おとうさんと、おおきく なった むすこの たび",
          "zh": "白頭髮的爸爸和長大的兒子一起旅行"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "long journey, rhythmic and grand",
            "ja": "{山|やま}を こえ、{川|かわ}を わたり、なんねんも なんねんも あるきました。",
            "zh": "翻過高山，渡過大河，走了好多好多年。",
            "zhuyin": "ㄈㄢ ㄍㄨㄛˋ ㄍㄠ ㄕㄢ ㄉㄨˋ ㄍㄨㄛˋ ㄉㄚˋ ㄏㄜˊ ㄗㄡˇ ˙ㄌㄜ ㄏㄠˇ ㄉㄨㄛ ㄏㄠˇ ㄉㄨㄛ ㄋㄧㄢˊ"
          },
          {
            "id": "p06-2",
            "speaker": "narrator",
            "style": "proud",
            "ja": "せなかの あかちゃんは、たくましい わかものに なりました。",
            "zh": "背上的小嬰兒，長成了強壯的年輕人。",
            "zhuyin": "ㄅㄟˋ ㄕㄤˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄧㄥ ㄦˊ ㄓㄤˇ ㄔㄥˊ ˙ㄌㄜ ㄑㄧㄤˊ ㄓㄨㄤˋ ˙ㄉㄜ ㄋㄧㄢˊ ㄑㄧㄥ ㄖㄣˊ"
          },
          {
            "id": "p06-3",
            "speaker": "narrator",
            "style": "tender, a little wistful",
            "ja": "おとうさんの かみは、まっしろに なりました。",
            "zh": "爸爸的頭髮，變得白白的。",
            "zhuyin": "ㄅㄚˋ ˙ㄅㄚ ˙ㄉㄜ ㄊㄡˊ ㄈㄚˇ ㄅㄧㄢˋ ˙ㄉㄜ ㄅㄞˊ ㄅㄞˊ ˙ㄉㄜ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/shooting-the-sun/p07.webp",
        "alt": {
          "ja": "いわに すわる おとうさんと、ゆみを にぎる むすこ",
          "zh": "坐在石頭上的爸爸，和握著弓的兒子"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "father",
            "style": "an old, tired, gentle father; read the exact dialogue without added interjections",
            "ja": "「とうさんは もう、とおくまでは あるけない。 あとは たのんだよ。」",
            "zh": "呵，我老啦，走不動啦，接下來就交給你啦。",
            "zhuyin": "ㄏㄜ ㄨㄛˇ ㄌㄠˇ ㄌㄚ ㄗㄡˇ ㄅㄨˋ ㄉㄨㄥˋ ㄌㄚ ㄐㄧㄝ ㄒㄧㄚˋ ㄌㄞˊ ㄐㄧㄡˋ ㄐㄧㄠ ㄍㄟˇ ㄋㄧˇ ㄌㄚ"
          },
          {
            "id": "p07-2",
            "speaker": "narrator",
            "style": "solemn and brave",
            "ja": "むすこは ゆみを しっかり にぎって、うなずきました。",
            "jaTts": "むすこは ゆみを しっかり にぎって、うなずきました。",
            "zh": "兒子緊緊握著弓，用力點點頭。",
            "zhuyin": "ㄦˊ ㄗˇ ㄐㄧㄣˇ ㄐㄧㄣˇ ㄨㄛˋ ˙ㄓㄜ ㄍㄨㄥ ㄩㄥˋ ㄌㄧˋ ㄉㄧㄢˇ ㄉㄧㄢˇ ㄊㄡˊ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/shooting-the-sun/p08.webp",
        "alt": {
          "ja": "まぶしい たいようの まえで ゆみを ひく むすこ",
          "zh": "在刺眼的太陽前拉弓的兒子"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "intense, building excitement",
            "ja": "とうとう、たいようの すぐ そばに たどりつきました。",
            "zh": "終於，他們來到了太陽的旁邊。",
            "zhuyin": "ㄓㄨㄥ ㄩˊ ㄊㄚ ˙ㄇㄣ ㄌㄞˊ ㄉㄠˋ ˙ㄌㄜ ㄊㄞˋ ㄧㄤˊ ˙ㄉㄜ ㄆㄤˊ ㄅㄧㄢ"
          },
          {
            "id": "p08-2",
            "speaker": "narrator",
            "style": "hot, dazzling, squinting",
            "ja": "あつくて まぶしくて、めを あけて いられません。",
            "zh": "又熱又刺眼，眼睛都快睜不開了。",
            "zhuyin": "ㄧㄡˋ ㄖㄜˋ ㄧㄡˋ ㄘˋ ㄧㄢˇ ㄧㄢˇ ㄐㄧㄥ ㄉㄡ ㄎㄨㄞˋ ㄓㄥ ㄅㄨˋ ㄎㄞ ˙ㄌㄜ"
          },
          {
            "id": "p08-3",
            "speaker": "son",
            "style": "brave, determined young hero, a strong short shout",
            "ja": "「いまだ！」",
            "zh": "「就是現在！」",
            "zhuyin": "ㄐㄧㄡˋ ㄕˋ ㄒㄧㄢˋ ㄗㄞˋ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/shooting-the-sun/p09.webp",
        "alt": {
          "ja": "やが とんで、たいようの ひとつが しろい おつきさまに かわる",
          "zh": "箭飛出去，一個太陽變成白白的月亮"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "exciting, the arrow whooshes",
            "ja": "ひゅん！ やは まっすぐ とんで、たいようの ひとつに あたりました。",
            "jaTts": "ひゅん！ やは まっすぐ とんで、たいようの ひとつに あたりました。",
            "zh": "咻——！箭直直地飛出去，射中了一個太陽。",
            "zhuyin": "ㄒㄧㄡ ㄐㄧㄢˋ ㄓˊ ㄓˊ ˙ㄉㄜ ㄈㄟ ㄔㄨ ㄑㄩˋ ㄕㄜˋ ㄓㄨㄥˋ ˙ㄌㄜ ㄧ ˙ㄍㄜ ㄊㄞˋ ㄧㄤˊ"
          },
          {
            "id": "p09-2",
            "speaker": "narrator",
            "style": "wonder, soft and magical",
            "ja": "その たいようは ひかりが やさしく なって、しろく かがやく お{月|つき}さまに なりました。",
            "zh": "那個太陽的光變得好溫柔，變成了白白亮亮的月亮。",
            "zhuyin": "ㄋㄚˋ ˙ㄍㄜ ㄊㄞˋ ㄧㄤˊ ˙ㄉㄜ ㄍㄨㄤ ㄅㄧㄢˋ ˙ㄉㄜ ㄏㄠˇ ㄨㄣ ㄖㄡˊ ㄅㄧㄢˋ ㄔㄥˊ ˙ㄌㄜ ㄅㄞˊ ㄅㄞˊ ㄌㄧㄤˋ ㄌㄧㄤˋ ˙ㄉㄜ ㄩㄝˋ ㄌㄧㄤˋ"
          },
          {
            "id": "p09-3",
            "speaker": "narrator",
            "style": "peaceful and quiet",
            "ja": "こうして、せかいに よるが やってきました。",
            "zh": "從此，世界有了黑夜。",
            "zhuyin": "ㄘㄨㄥˊ ㄘˇ ㄕˋ ㄐㄧㄝˋ ㄧㄡˇ ˙ㄌㄜ ㄏㄟ ㄧㄝˋ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/shooting-the-sun/p10.webp",
        "alt": {
          "ja": "みかんの きの みちを かえる、しろい かみの むすこ",
          "zh": "走在橘子樹小路上回家的白髮兒子"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "warm and moving",
            "ja": "かえりみちには、おとうさんが うえた みかんの きが、おおきく そだって いました。",
            "zh": "回家的路上，爸爸種下的橘子樹，已經長得又高又大。",
            "zhuyin": "ㄏㄨㄟˊ ㄐㄧㄚ ˙ㄉㄜ ㄌㄨˋ ㄕㄤˋ ㄅㄚˋ ˙ㄅㄚ ㄓㄨㄥˋ ㄒㄧㄚˋ ˙ㄉㄜ ㄐㄩˊ ˙ㄗ ㄕㄨˋ ㄧˇ ㄐㄧㄥ ㄓㄤˇ ˙ㄉㄜ ㄧㄡˋ ㄍㄠ ㄧㄡˋ ㄉㄚˋ"
          },
          {
            "id": "p10-2",
            "speaker": "son",
            "style": "now an old man, soft, grateful and a little moved",
            "ja": "「おとうさん、ありがとう。」",
            "zh": "「爸爸，謝謝你。」",
            "zhuyin": "ㄅㄚˋ ˙ㄅㄚ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ"
          },
          {
            "id": "p10-3",
            "speaker": "narrator",
            "style": "gentle and proud",
            "ja": "むらに かえった とき、むすこの かみも まっしろに なって いました。",
            "zh": "回到部落的時候，兒子的頭髮也全白了。",
            "zhuyin": "ㄏㄨㄟˊ ㄉㄠˋ ㄅㄨˋ ㄌㄨㄛˋ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄦˊ ㄗˇ ˙ㄉㄜ ㄊㄡˊ ㄈㄚˇ ㄧㄝˇ ㄑㄩㄢˊ ㄅㄞˊ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "end",
        "image": "images/shooting-the-sun/end.webp",
        "alt": {
          "ja": "おつきさまと ほしの したで ねむる やまの むら",
          "zh": "在月亮和星星下安睡的山上部落"
        },
        "lines": [
          {
            "id": "end-1",
            "speaker": "narrator",
            "style": "warm and peaceful, like a lullaby",
            "ja": "それから みんなは、ひるは はたらき、よるは ぐっすり ねむれるように なりました。",
            "zh": "從此以後，大家白天工作，晚上可以好好睡覺。",
            "zhuyin": "ㄘㄨㄥˊ ㄘˇ ㄧˇ ㄏㄡˋ ㄉㄚˋ ㄐㄧㄚ ㄅㄞˊ ˙ㄊㄧㄢ ㄍㄨㄥ ㄗㄨㄛˋ ㄨㄢˇ ˙ㄕㄤ ㄎㄜˇ ㄧˇ ㄏㄠˇ ㄏㄠˇ ㄕㄨㄟˋ ㄐㄧㄠˋ"
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
  }
]);
