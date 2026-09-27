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
            "ja": "たからものが だいすきな だんなさんは、おこるのも わすれて、わらの ふくを かいました。",
            "zh": "最愛寶貝的老爺，一下子忘了生氣，又把稻草衣買回家。",
            "zhuyin": "ㄗㄨㄟˋ ㄞˋ ㄅㄠˇ ㄅㄟˋ ˙ㄉㄜ ㄌㄠˇ ˙ㄧㄝ ㄧ ㄒㄧㄚˋ ˙ㄗ ㄨㄤˋ ˙ㄌㄜ ㄕㄥ ㄑㄧˋ ㄧㄡˋ ㄅㄚˇ ㄉㄠˋ ㄘㄠˇ ㄧ ㄇㄞˇ ㄏㄨㄟˊ ㄐㄧㄚ"
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
          "ja": "ひろばで おこる だんなさんと、うでを くんで パイツェイチーから かおを そむける むらの ひとたち",
          "zh": "在廟口生氣的老爺，和雙手交叉、不理白賊七的村民"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "brisk and a little comic, the story moving to the village square",
            "ja": "だんなさんは むらの ひろばで、だまされた ことを みんなに はなしました。",
            "zh": "老爺跑到廟口，把被騙的事告訴大家。",
            "zhuyin": "ㄌㄠˇ ˙ㄧㄝ ㄆㄠˇ ㄉㄠˋ ㄇㄧㄠˋ ㄎㄡˇ ㄅㄚˇ ㄅㄟˋ ㄆㄧㄢˋ ˙ㄉㄜ ㄕˋ ㄍㄠˋ ㄙㄨˋ ㄉㄚˋ ㄐㄧㄚ"
          },
          {
            "id": "p08-2",
            "speaker": "rich",
            "style": "indignant and sniffly with a cold, grumpy but funny and never scary; start directly with the first word, no grunt or sound before it, and finish with the written sneeze said clearly",
            "ja": "「あいつに、{二回|にかい}も だまされたんだ！ はくしょん！」",
            "zh": "「白賊七騙了我兩次！哈啾！」",
            "zhuyin": "ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄆㄧㄢˋ ˙ㄌㄜ ㄨㄛˇ ㄌㄧㄤˇ ㄘˋ ㄏㄚ ㄐㄧㄡ",
            "zhTts": "「白贼七騙了我兩次！哈啾！」"
          },
          {
            "id": "p08-3",
            "speaker": "narrator",
            "style": "first recalling with mild indignation, then quiet and a little sad",
            "ja": "みんなも おもいだしました。「わたしも だまされた！」 それから、だれも パイツェイチーを しんじなく なりました。",
            "jaTts": "みんなも おもいだしました。「わたしも だまされた！」 それから、だれも ぱい、つぇい、ちーを しんじなく なりました。",
            "zh": "大家也想起來了：「我也被他騙過！」從此，再也沒有人相信白賊七了。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄧㄝˇ ㄒㄧㄤˇ ㄑㄧˇ ㄌㄞˊ ˙ㄌㄜ ㄨㄛˇ ㄧㄝˇ ㄅㄟˋ ㄊㄚ ㄆㄧㄢˋ ㄍㄨㄛˋ ㄘㄨㄥˊ ㄘˇ ㄗㄞˋ ㄧㄝˇ ㄇㄟˊ ㄧㄡˇ ㄖㄣˊ ㄒㄧㄤ ㄒㄧㄣˋ ㄅㄞˊ ㄗㄟˊ ㄑㄧ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/bai-zei-qi/p09.webp",
        "alt": {
          "ja": "みずの ふえた かわで えだに しがみつき、こわがって たすけを よぶ パイツェイチー",
          "zh": "掉進漲水的小河、抱著樹枝害怕地喊救命的白賊七"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "a sudden surprise, a little tense but safe and gentle for a young child",
            "ja": "おおあめの つぎの ひ、パイツェイチーは かわべで すべって、ざぶん！ みずが ふえた かわに おちて しまいました。",
            "jaTts": "おおあめの つぎの ひ、ぱい、つぇい、ちーは かわべで すべって、ざぶん！ みずが ふえた かわに おちて しまいました。",
            "zh": "大雨過後，小河的水漲得好高。白賊七在河邊腳一滑，撲通！掉進了河裡。",
            "zhuyin": "ㄉㄚˋ ㄩˇ ㄍㄨㄛˋ ㄏㄡˋ ㄒㄧㄠˇ ㄏㄜˊ ˙ㄉㄜ ㄕㄨㄟˇ ㄓㄤˇ ˙ㄉㄜ ㄏㄠˇ ㄍㄠ ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄗㄞˋ ㄏㄜˊ ㄅㄧㄢ ㄐㄧㄠˇ ㄧ ㄏㄨㄚˊ ㄆㄨ ㄊㄨㄥ ㄉㄧㄠˋ ㄐㄧㄣˋ ˙ㄌㄜ ㄏㄜˊ ㄌㄧˇ",
            "zhTts": "大雨過後，小河的水漲得好高。白贼七在河邊腳一滑，撲通！掉進了河裡。"
          },
          {
            "id": "p09-2",
            "speaker": "bai",
            "style": "truly scared and urgent, calling for help across a field with a slightly shaky voice; no laughter, gentle enough for a young child, no screaming",
            "ja": "「たすけてー！ こんどは ほんとうだよー！」",
            "zh": "「救命啊！這次是真的啦！」",
            "zhuyin": "ㄐㄧㄡˋ ㄇㄧㄥˋ ˙ㄚ ㄓㄜˋ ㄘˋ ㄕˋ ㄓㄣ ˙ㄉㄜ ˙ㄌㄚ"
          },
          {
            "id": "p09-3",
            "speaker": "narrator",
            "style": "gently sad, showing how lies make people stop listening; not frightening",
            "ja": "でも、たんぼの ひとたちは「また うそでしょ」と、だれも きて くれません。",
            "zh": "可是田裡的人都說：「又在騙人了！」誰也沒有過來。",
            "zhuyin": "ㄎㄜˇ ㄕˋ ㄊㄧㄢˊ ㄌㄧˇ ˙ㄉㄜ ㄖㄣˊ ㄉㄡ ㄕㄨㄛ ㄧㄡˋ ㄗㄞˋ ㄆㄧㄢˋ ㄖㄣˊ ˙ㄌㄜ ㄕㄟˊ ㄧㄝˇ ㄇㄟˊ ㄧㄡˇ ㄍㄨㄛˋ ㄌㄞˊ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/bai-zei-qi/p10.webp",
        "alt": {
          "ja": "だんなさんと むらの ひとたちが たけの ぼうを のばして、かわから パイツェイチーを たすける",
          "zh": "老爺和村民一起伸出竹竿，把白賊七從河裡救上來"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "urgent but warm, a helpful dog who will not give up",
            "ja": "ワンワン！ むらの いぬが ほえて、だんなさんを かわへ ひっぱって いきました。",
            "zh": "汪汪汪！村子裡的小狗一直叫，拉著老爺跑到河邊。",
            "zhuyin": "ㄨㄤ ㄨㄤ ㄨㄤ ㄘㄨㄣ ˙ㄗ ㄌㄧˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄍㄡˇ ㄧ ㄓˊ ㄐㄧㄠˋ ㄌㄚ ˙ㄓㄜ ㄌㄠˇ ˙ㄧㄝ ㄆㄠˇ ㄉㄠˋ ㄏㄜˊ ㄅㄧㄢ"
          },
          {
            "id": "p10-2",
            "speaker": "rich",
            "style": "alarmed and caring, calling the neighbors urgently; kind, never scary, no sneeze or added words",
            "ja": "「えだに しがみついて、ふるえてる！ ほんとうだ！ みんな、きてくれー！」",
            "zh": "「他抱著樹枝在發抖，是真的！大家快來！」",
            "zhuyin": "ㄊㄚ ㄅㄠˋ ˙ㄓㄜ ㄕㄨˋ ㄓ ㄗㄞˋ ㄈㄚ ㄉㄡˇ ㄕˋ ㄓㄣ ˙ㄉㄜ ㄉㄚˋ ㄐㄧㄚ ㄎㄨㄞˋ ㄌㄞˊ"
          },
          {
            "id": "p10-3",
            "speaker": "narrator",
            "style": "relieved teamwork, warm and steady",
            "ja": "みんなで ながい たけの ぼうを のばして、パイツェイチーを ひっぱりあげました。",
            "jaTts": "みんなで ながい たけの ぼうを のばして、ぱい、つぇい、ちーを ひっぱりあげました。",
            "zh": "大家一起伸出長長的竹竿，把白賊七拉上岸。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄧ ㄑㄧˇ ㄕㄣ ㄔㄨ ㄔㄤˊ ㄔㄤˊ ˙ㄉㄜ ㄓㄨˊ ㄍㄢ ㄅㄚˇ ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄌㄚ ㄕㄤˋ ㄢˋ",
            "zhTts": "大家一起伸出長長的竹竿，把白贼七拉上岸。"
          }
        ]
      },
      {
        "id": "p11",
        "image": "images/bai-zei-qi/p11.webp",
        "alt": {
          "ja": "どろだらけで あたまを さげる パイツェイチーと、やさしく みまもる むらの ひとたち",
          "zh": "渾身泥巴、低頭道歉的白賊七，和溫柔的村民"
        },
        "lines": [
          {
            "id": "p11-1",
            "speaker": "narrator",
            "style": "tender and quiet, deeply touched",
            "ja": "だまされた ひとたちが、たすけて くれた……。 パイツェイチーの めに、なみだが あふれました。",
            "jaTts": "だまされた ひとたちが、たすけて くれた……。 ぱい、つぇい、ちーの めに、なみだが あふれました。",
            "zh": "被他騙過的人，還是來救他了。白賊七感動得掉下眼淚。",
            "zhuyin": "ㄅㄟˋ ㄊㄚ ㄆㄧㄢˋ ㄍㄨㄛˋ ˙ㄉㄜ ㄖㄣˊ ㄏㄞˊ ㄕˋ ㄌㄞˊ ㄐㄧㄡˋ ㄊㄚ ˙ㄌㄜ ㄅㄞˊ ㄗㄟˊ ㄑㄧ ㄍㄢˇ ㄉㄨㄥˋ ˙ㄉㄜ ㄉㄧㄠˋ ㄒㄧㄚˋ ㄧㄢˇ ㄌㄟˋ"
          },
          {
            "id": "p11-2",
            "speaker": "bai",
            "style": "sincere and sorry, small humble voice",
            "ja": "「ごめんなさい。 もう うそは つきません。」",
            "zh": "「對不起，我再也不說謊了。」",
            "zhuyin": "ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄨㄛˇ ㄗㄞˋ ㄧㄝˇ ㄅㄨˋ ㄕㄨㄛ ㄏㄨㄤˇ ˙ㄌㄜ"
          },
          {
            "id": "p11-3",
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
  },
  {
    "id": "shao-white-deer",
    "title": {
      "ja": "しろい しかが みちびいた みずうみ",
      "zh": "白鹿傳說",
      "zhuyin": "ㄅㄞˊ ㄌㄨˋ ㄔㄨㄢˊ ㄕㄨㄛ"
    },
    "tagline": {
      "ja": "しろい しかに ついて いった、パダムたちの たびの おはなし",
      "zh": "帕達木他們跟著白鹿走的旅程"
    },
    "origin": {
      "ja": "たいわんの サオ{族|ぞく}に つたわる おはなし",
      "zh": "台灣邵族的故事"
    },
    "credit": {
      "ja": "サオ{族|ぞく}は、{日月潭|にちげつたん}の あたりに くらす たいわんの げんじゅうみんぞくで、じぶんたちを イタ・サオ（Ita Thao）と よびます。 この えほんは、げんじゅうみんぞく いいんかいの こどもむけの おはなし〈邵族－白鹿傳說〉を もとに しました。 もとの おはなしでは、ひとびとは かりを し、さかなを たべ、おおきな きの かみさまに ちかいます。 この えほんでは、こどもむけに その ばめんを かえ、たねを まく ばめんを くわえました。",
      "zh": "邵族是生活在日月潭一帶的台灣原住民族，族人自稱 Ita Thao。這本繪本參考原住民族委員會兒童版的〈邵族－白鹿傳說〉。原故事裡有狩獵、吃魚，以及向大樹的樹神起誓的情節；本書為小朋友改寫了這些情節，並加入了播種的畫面。"
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
            "ja": "たいわんの サオ{族|ぞく}に つたわる おはなし『しろい しかが みちびいた みずうみ』",
            "zh": "台灣邵族的故事〈白鹿傳說〉",
            "zhuyin": "ㄊㄞˊ ㄨㄢ ㄕㄠˋ ㄗㄨˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄅㄞˊ ㄌㄨˋ ㄔㄨㄢˊ ㄕㄨㄛ"
          },
          {
            "id": "cover-2",
            "speaker": "narrator",
            "style": "gentle and full of wonder, a curious question",
            "ja": "しろい しかに ついて いくと、どこに つくのかな？",
            "zh": "跟著白鹿走，會走到哪裡呢？",
            "zhuyin": "ㄍㄣ ˙ㄓㄜ ㄅㄞˊ ㄌㄨˋ ㄗㄡˇ ㄏㄨㄟˋ ㄗㄡˇ ㄉㄠˋ ㄋㄚˇ ㄌㄧˇ ˙ㄋㄜ"
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
          "zh": "站在森林那頭的一隻雪白的鹿"
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
          },
          {
            "id": "p02-3",
            "speaker": "son",
            "style": "hushed and amazed young hunter, eager but careful",
            "ja": "「なんて きれいな しかだろう。 どこへ いくのか、ついて いって みよう。」",
            "zh": "「好美的鹿啊！我們跟上去，看看牠要去哪裡。」",
            "zhuyin": "ㄏㄠˇ ㄇㄟˇ ˙ㄉㄜ ㄌㄨˋ ˙ㄚ ㄨㄛˇ ˙ㄇㄣ ㄍㄣ ㄕㄤˋ ㄑㄩˋ ㄎㄢˋ ˙ㄎㄢ ㄊㄚ ㄧㄠˋ ㄑㄩˋ ㄋㄚˇ ㄌㄧˇ"
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
            "ja": "パダムたちは、みちを おぼえながら、とおくから しずかに ついて いきました。",
            "zh": "帕達木他們一邊記住山路，一邊遠遠地安靜跟著。",
            "zhTts": "怕達木他們一邊記住山路，一邊遠遠地安靜跟著。",
            "zhuyin": "ㄆㄚˋ ㄉㄚˊ ㄇㄨˋ ㄊㄚ ˙ㄇㄣ ㄧ ㄅㄧㄢ ㄐㄧˋ ㄓㄨˋ ㄕㄢ ㄌㄨˋ ㄧ ㄅㄧㄢ ㄩㄢˇ ㄩㄢˇ ˙ㄉㄜ ㄢ ㄐㄧㄥˋ ㄍㄣ ˙ㄓㄜ"
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
            "speaker": "narrator",
            "style": "a small surprise, a little worried",
            "ja": "ふと きが つくと、しろい しかの すがたが みえません。",
            "zh": "回過神來，白鹿已經不見了。",
            "zhuyin": "ㄏㄨㄟˊ ㄍㄨㄛˋ ㄕㄣˊ ㄌㄞˊ ㄅㄞˊ ㄌㄨˋ ㄧˇ ㄐㄧㄥ ㄅㄨˋ ㄐㄧㄢˋ ˙ㄌㄜ"
          },
          {
            "id": "p04-3",
            "speaker": "son",
            "style": "worried, looking around",
            "ja": "「あれ？ しろい しかは どこ？」",
            "jaTts": "あれ？ しろい、しかは どこ？",
            "zh": "「咦？白鹿去哪裡了？」",
            "zhuyin": "ㄧˊ ㄅㄞˊ ㄌㄨˋ ㄑㄩˋ ㄋㄚˇ ㄌㄧˇ ˙ㄌㄜ"
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
            "ja": "みんなで また あるきだすと、きが だんだん すくなく なり、みずの おとが きこえて きました。",
            "zh": "大家再往前走，樹木越來越少，傳來了水流的聲音。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄗㄞˋ ㄨㄤˇ ㄑㄧㄢˊ ㄗㄡˇ ㄕㄨˋ ㄇㄨˋ ㄩㄝˋ ㄌㄞˊ ㄩㄝˋ ㄕㄠˇ ㄔㄨㄢˊ ㄌㄞˊ ˙ㄌㄜ ㄕㄨㄟˇ ㄌㄧㄡˊ ˙ㄉㄜ ㄕㄥ ㄧㄣ"
          },
          {
            "id": "p05-2",
            "speaker": "narrator",
            "style": "relieved, gentle, descending",
            "ja": "みると、しろい しかが やまを おりて いく ところでした。",
            "zh": "原來，白鹿正往山下走去。",
            "zhuyin": "ㄩㄢˊ ㄌㄞˊ ㄅㄞˊ ㄌㄨˋ ㄓㄥˋ ㄨㄤˇ ㄕㄢ ㄒㄧㄚˋ ㄗㄡˇ ㄑㄩˋ"
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
            "ja": "すきとおった みずうみに、さかなが たくさん およいで いました。",
            "zh": "清澈的湖水裡，游著好多好多的魚。",
            "zhuyin": "ㄑㄧㄥ ㄔㄜˋ ˙ㄉㄜ ㄏㄨˊ ㄕㄨㄟˇ ˙ㄌㄧ ㄧㄡˊ ˙ㄓㄜ ㄏㄠˇ ㄉㄨㄛ ㄏㄠˇ ㄉㄨㄛ ˙ㄉㄜ ㄩˊ"
          },
          {
            "id": "p07-2",
            "speaker": "narrator",
            "style": "delighted, amazed",
            "ja": "みんなは おどろき、よろこびました。",
            "zh": "大家又驚又喜。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄧㄡˋ ㄐㄧㄥ ㄧㄡˋ ㄒㄧˇ"
          },
          {
            "id": "p07-3",
            "speaker": "son",
            "style": "warm, hopeful, eager to share",
            "ja": "「かぞくにも、この みずうみを みせたいな。」",
            "zh": "「真想帶家人來看看這座湖！」",
            "zhuyin": "ㄓㄣ ㄒㄧㄤˇ ㄉㄞˋ ㄐㄧㄚ ㄖㄣˊ ㄌㄞˊ ㄎㄢˋ ˙ㄎㄢ ㄓㄜˋ ㄗㄨㄛˋ ㄏㄨˊ"
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
            "ja": "パダムは むらに かえって、かぞくに はなしました。",
            "zh": "帕達木回到部落，跟家人說起那座湖。",
            "zhuyin": "ㄆㄚˋ ㄉㄚˊ ㄇㄨˋ ㄏㄨㄟˊ ㄉㄠˋ ㄅㄨˋ ㄌㄨㄛˋ ㄍㄣ ㄐㄧㄚ ㄖㄣˊ ㄕㄨㄛ ㄑㄧˇ ㄋㄚˋ ㄗㄨㄛˋ ㄏㄨˊ"
          },
          {
            "id": "p08-2",
            "speaker": "son",
            "style": "excited, bright, sharing good news with family",
            "ja": "「みずが きれいで、さかなが たくさん いたよ！」",
            "zh": "「湖水好清澈，還有好多魚！」",
            "zhuyin": "ㄏㄨˊ ㄕㄨㄟˇ ㄏㄠˇ ㄑㄧㄥ ㄔㄜˋ ㄏㄞˊ ㄧㄡˇ ㄏㄠˇ ㄉㄨㄛ ㄩˊ"
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
            "style": "thoughtful, a family council reaching a decision",
            "ja": "かぞくと むらの ひとたちは はなしあい、みずうみの そばで くらそうと きめました。",
            "zh": "家人和族人們商量之後，決定搬到湖邊生活。",
            "zhuyin": "ㄐㄧㄚ ㄖㄣˊ ㄏㄜˊ ㄗㄨˊ ㄖㄣˊ ˙ㄇㄣ ㄕㄤ ㄌㄧㄤˊ ㄓ ㄏㄡˋ ㄐㄩㄝˊ ㄉㄧㄥˋ ㄅㄢ ㄉㄠˋ ㄏㄨˊ ㄅㄧㄢ ㄕㄥ ㄏㄨㄛˊ"
          },
          {
            "id": "p09-2",
            "speaker": "narrator",
            "style": "hopeful, setting out together",
            "ja": "たねと くらしの どうぐを もって、パダムたちが おぼえた やまみちを たどりました。",
            "zh": "大家帶著種子和生活用具，沿著帕達木他們記住的山路出發。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄉㄞˋ ˙ㄓㄜ ㄓㄨㄥˇ ˙ㄗ ㄏㄜˊ ㄕㄥ ㄏㄨㄛˊ ㄩㄥˋ ㄐㄩˋ ㄧㄢˊ ˙ㄓㄜ ㄆㄚˋ ㄉㄚˊ ㄇㄨˋ ㄊㄚ ˙ㄇㄣ ㄐㄧˋ ㄓㄨˋ ˙ㄉㄜ ㄕㄢ ㄌㄨˋ ㄔㄨ ㄈㄚ"
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
            "speaker": "narrator",
            "style": "warm, hopeful, a gentle promise",
            "ja": "「ここで いっしょに くらして いこう」と、みんなは おおきな きの したで ちかいました。",
            "zh": "大家在大樹下約定：「我們要一起在這裡生活。」",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄗㄞˋ ㄉㄚˋ ㄕㄨˋ ㄒㄧㄚˋ ㄩㄝ ㄉㄧㄥˋ ㄨㄛˇ ˙ㄇㄣ ㄧㄠˋ ㄧ ㄑㄧˇ ㄗㄞˋ ㄓㄜˋ ㄌㄧˇ ㄕㄥ ㄏㄨㄛˊ"
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
            "ja": "こうして サオ{族|ぞく}の ひとびとは、はたけに たねを まき、{日月潭|にちげつたん}の ほとりで くらすように なりました。",
            "zh": "就這樣，邵族的族人在田裡播下種子，在日月潭畔住了下來。",
            "zhuyin": "ㄐㄧㄡˋ ㄓㄜˋ ㄧㄤˋ ㄕㄠˋ ㄗㄨˊ ˙ㄉㄜ ㄗㄨˊ ㄖㄣˊ ㄗㄞˋ ㄊㄧㄢˊ ㄌㄧˇ ㄅㄛˋ ㄒㄧㄚˋ ㄓㄨㄥˇ ˙ㄗ ㄗㄞˋ ㄖˋ ㄩㄝˋ ㄊㄢˊ ㄆㄢˋ ㄓㄨˋ ˙ㄌㄜ ㄒㄧㄚˋ ㄌㄞˊ"
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
    "id": "xinpu-shi-ye",
    "title": {
      "ja": "いしの じいさまと あたらしい はし",
      "zh": "石爺與新埔大橋",
      "zhuyin": "ㄕˊ ㄧㄝˊ ㄩˇ ㄒㄧㄣ ㄆㄨ ㄉㄚˋ ㄑㄧㄠˊ"
    },
    "tagline": {
      "ja": "おまいりの おかねで かけた、むらの はしの おはなし",
      "zh": "用香油錢蓋起大橋的故事"
    },
    "origin": {
      "ja": "たいわん {新竹|しんちく} {新埔|しんぽ}の ハッカの ひとびとに つたわる おはなし",
      "zh": "台灣新竹新埔的客家故事"
    },
    "credit": {
      "ja": "{新竹|しんちく} {新埔|しんぽ}の ハッカの ひとびとは、ホンさんと いう おばさんと いしの じいさまの はなしを いまも かたりついで います。 いしの じいさまは のちに「{顕伯公|けんはくこう}」と よばれ、おみやに まつられて います。「{伯公|はくこう}」は、ハッカの ひとびとが たいせつに する とちの かみさまの よびなです。 おばさんが じぶんで いしを みつけ、「げんきに なったら おせんこうを あげに きます」と ちかった という はなしも、しらがの おじいさんが あらわれた という はなし（おみやの いしぶみ）も あり、この えほんは ふたつを ひとつに まとめました。 どちらの はなしにも やまの くさが でてきますが、こどもが まねを しないよう、この えほんでは くさを とったり のんだり する ばめんを かいて いません。 やまの くさを かってに たべては いけません。 そのころ、おまいりの ひとは とても おおく、「なんでも なおる」と おおげさに いう ひとも いました。 あつまった おかねで、そんちょう（{庄長|しょうちょう}）の {葉心榮|ようしんえい}さんが はしを つくり、1930{年|ねん}に {新埔|しんぽ}{大橋|おおはし}が できました。",
      "zh": "新竹新埔的客家人至今仍傳說著阿洪伯母與石爺的故事。石爺後來被尊稱為「顯伯公」，供奉在廟裡；「伯公」是客家人對土地神的稱呼。有人說是伯母自己在山上發現了大石頭，並許願病好了就常來燒香；廟裡的碑文則記載，有一位白髮老翁出現指點。本書把兩種說法合成一個故事。兩種說法都提到山上的青草，為了避免孩子模仿，本書沒有描寫採草或喝青草的情節；山上的草不可以自己亂吃。當時來拜拜的人非常多，也有人誇大說「什麼病都能治好」。庄長葉心榮把大家捐的香油錢拿來蓋橋，新埔大橋在1930年落成。"
    },
    "theme": {
      "accent": "#7a6a52",
      "soft": "#ece4d3"
    },
    "pages": [
      {
        "id": "cover",
        "image": "images/xinpu-shi-ye/cover.webp",
        "alt": {
          "ja": "やまの みちに ある、おおきな いしと ちいさな ほこら",
          "zh": "山路旁的大石頭和小小的祠堂"
        },
        "lines": [
          {
            "id": "cover-1",
            "speaker": "narrator",
            "style": "warm, inviting storyteller opening a picture book",
            "ja": "{新竹|しんちく}の {新埔|しんぽ}に つたわる おはなし『いしの じいさまと あたらしい はし』",
            "jaTts": "しんちくの しんぽに つたわる おはなし。いしの じいさまと あたらしい はし。",
            "zh": "新竹新埔的故事〈石爺與新埔大橋〉",
            "zhuyin": "ㄒㄧㄣ ㄓㄨˊ ㄒㄧㄣ ㄆㄨ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄕˊ ㄧㄝˊ ㄩˇ ㄒㄧㄣ ㄆㄨ ㄉㄚˋ ㄑㄧㄠˊ"
          },
          {
            "id": "cover-2",
            "speaker": "narrator",
            "style": "gentle, grounded, a little mysterious",
            "ja": "やまの おおきな いしと、かわに かかる はしの おはなしです。",
            "zh": "這是山上一塊大石頭，和河上一座橋的故事。",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄕㄢ ㄕㄤˋ ㄧ ㄎㄨㄞˋ ㄉㄚˋ ㄕˊ ㄊㄡˊ ㄏㄢˋ ㄏㄜˊ ㄕㄤˋ ㄧ ㄗㄨㄛˋ ㄑㄧㄠˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/xinpu-shi-ye/p01.webp",
        "alt": {
          "ja": "はしの ない ひろい かわを、いしを ふんで わたる むらの ひとたち",
          "zh": "踩著石頭，走過沒有橋的寬河的村民"
        },
        "lines": [
          {
            "id": "p01-1",
            "speaker": "narrator",
            "style": "gentle, grounded, once-upon-a-time storyteller",
            "ja": "むかし、{新埔|しんぽ}の むらの そばには、ひろい かわが ながれて いました。",
            "zh": "很久以前，新埔的村子旁邊，有一條寬寬的河。",
            "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄒㄧㄣ ㄆㄨ ˙ㄉㄜ ㄘㄨㄣ ˙ㄗ ㄆㄤˊ ㄅㄧㄢ ㄧㄡˇ ㄧ ㄊㄧㄠˊ ㄎㄨㄢ ㄎㄨㄢ ˙ㄉㄜ ㄏㄜˊ"
          },
          {
            "id": "p01-2",
            "speaker": "narrator",
            "style": "careful, step by step, a little tense",
            "ja": "はしは なくて、みんなは かわの いしを ふんで、そろそろと わたりました。",
            "zh": "河上沒有橋，大家只能踩著河裡的石頭，慢慢走過去。",
            "zhuyin": "ㄏㄜˊ ㄕㄤˋ ㄇㄟˊ ㄧㄡˇ ㄑㄧㄠˊ ㄉㄚˋ ㄐㄧㄚ ㄓˇ ㄋㄥˊ ㄘㄞˇ ˙ㄓㄜ ㄏㄜˊ ˙ㄌㄧ ˙ㄉㄜ ㄕˊ ㄊㄡˊ ㄇㄢˋ ㄇㄢˋ ㄗㄡˇ ㄍㄨㄛˋ ㄑㄩˋ"
          },
          {
            "id": "p01-3",
            "speaker": "narrator",
            "style": "worried, a little dramatic",
            "ja": "あめが ふって みずが ふえると、だれも むこうへ いけません。",
            "zh": "下大雨的時候，河水漲起來，誰也過不去。",
            "zhuyin": "ㄒㄧㄚˋ ㄉㄚˋ ㄩˇ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄏㄜˊ ㄕㄨㄟˇ ㄓㄤˇ ㄑㄧˇ ㄌㄞˊ ㄕㄟˊ ㄧㄝˇ ㄍㄨㄛˋ ㄅㄨˋ ㄑㄩˋ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/xinpu-shi-ye/p02.webp",
        "alt": {
          "ja": "あめで みずが ふえた かわを みつめる そんちょうさんと むらの ひとたち",
          "zh": "望著雨後河水漲高的庄長和村民"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "gentle, thoughtful",
            "ja": "むらの そんちょうさんは、かわを みるたびに、こう おもいました。",
            "zh": "庄長每次看到這條河，都會這樣想：",
            "zhTts": "莊長每次看到這條河，都會這樣想：",
            "zhuyin": "ㄓㄨㄤ ㄓㄤˇ ㄇㄟˇ ㄘˋ ㄎㄢˋ ㄉㄠˋ ㄓㄜˋ ㄊㄧㄠˊ ㄏㄜˊ ㄉㄡ ㄏㄨㄟˋ ㄓㄜˋ ㄧㄤˋ ㄒㄧㄤˇ"
          },
          {
            "id": "p02-2",
            "speaker": "father",
            "style": "an elderly village head, kind and earnest, wistfully wishing aloud",
            "ja": "「おおきな はしが あったら、あめの ひでも わたれるのになあ。」",
            "zh": "「要是有一座大橋，下雨天也能過河就好了。」",
            "zhuyin": "ㄧㄠˋ ㄕˋ ㄧㄡˇ ㄧ ㄗㄨㄛˋ ㄉㄚˋ ㄑㄧㄠˊ ㄒㄧㄚˋ ㄩˇ ㄊㄧㄢ ㄧㄝˇ ㄋㄥˊ ㄍㄨㄛˋ ㄏㄜˊ ㄐㄧㄡˋ ㄏㄠˇ ˙ㄌㄜ"
          },
          {
            "id": "p02-3",
            "speaker": "narrator",
            "style": "a little sad, matter-of-fact",
            "ja": "でも その ころは みんな まずしくて、はしを つくる おかねが ありませんでした。",
            "zh": "可是那時候大家都很窮，沒有錢蓋橋。",
            "zhuyin": "ㄎㄜˇ ㄕˋ ㄋㄚˋ ㄕˊ ㄏㄡˋ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄏㄣˇ ㄑㄩㄥˊ ㄇㄟˊ ㄧㄡˇ ㄑㄧㄢˊ ㄍㄞˋ ㄑㄧㄠˊ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/xinpu-shi-ye/p03.webp",
        "alt": {
          "ja": "やまみちで つかれて、おおきな いしの そばに すわる ホンさん",
          "zh": "在山路上累得坐在大石頭旁的阿洪伯母"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "narrator",
            "style": "gentle, a little worried",
            "ja": "むらの ホンさんと いう おばさんは、びょうきで からだに ちからが はいらず、おいしゃさんに かかる おかねも ありませんでした。",
            "zh": "村子裡的阿洪伯母生病了，全身都沒有力氣，家裡也沒有錢看醫生。",
            "zhuyin": "ㄘㄨㄣ ˙ㄗ ˙ㄌㄧ ˙ㄉㄜ ㄚ ㄏㄨㄥˊ ㄅㄛˊ ㄇㄨˇ ㄕㄥ ㄅㄧㄥˋ ˙ㄌㄜ ㄑㄩㄢˊ ㄕㄣ ㄉㄡ ㄇㄟˊ ㄧㄡˇ ㄌㄧˋ ㄑㄧˋ ㄐㄧㄚ ˙ㄌㄧ ㄧㄝˇ ㄇㄟˊ ㄧㄡˇ ㄑㄧㄢˊ ㄎㄢˋ ㄧ ㄕㄥ"
          },
          {
            "id": "p03-2",
            "speaker": "narrator",
            "style": "gentle, hopeful",
            "ja": "おばさんは、げんきに なる ほうほうを さがして、うらやまへ でかけました。",
            "zh": "她想找個讓自己好起來的辦法，就往後山走去。",
            "zhuyin": "ㄊㄚ ㄒㄧㄤˇ ㄓㄠˇ ˙ㄍㄜ ㄖㄤˋ ㄗˋ ㄐㄧˇ ㄏㄠˇ ㄑㄧˇ ㄌㄞˊ ˙ㄉㄜ ㄅㄢˋ ㄈㄚˇ ㄐㄧㄡˋ ㄨㄤˇ ㄏㄡˋ ㄕㄢ ㄗㄡˇ ㄑㄩˋ"
          },
          {
            "id": "p03-3",
            "speaker": "narrator",
            "style": "slow, tired, quiet",
            "ja": "とちゅうで つかれて、おおきな いしの そばに すわりこみました。",
            "zh": "走累了，她在一塊大石頭旁坐了下來。",
            "zhuyin": "ㄗㄡˇ ㄌㄟˋ ˙ㄌㄜ ㄊㄚ ㄗㄞˋ ㄧ ㄎㄨㄞˋ ㄉㄚˋ ㄕˊ ㄊㄡˊ ㄆㄤˊ ㄗㄨㄛˋ ˙ㄌㄜ ㄒㄧㄚˋ ㄌㄞˊ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/xinpu-shi-ye/p04.webp",
        "alt": {
          "ja": "おおきな いしの まえで てを あわせる おばさん",
          "zh": "在大石頭前合起雙手的伯母"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "narrator",
            "style": "soft, wondering, a little mysterious",
            "ja": "ふしぎな かたちの いしを みて、おばさんは「かみさまかも しれない」と おもいました。",
            "zh": "伯母看著這塊樣子很特別的石頭，心想：「說不定是神明呢。」",
            "zhuyin": "ㄅㄛˊ ㄇㄨˇ ㄎㄢˋ ˙ㄓㄜ ㄓㄜˋ ㄎㄨㄞˋ ㄧㄤˋ ˙ㄗ ㄏㄣˇ ㄊㄜˋ ㄅㄧㄝˊ ˙ㄉㄜ ㄕˊ ㄊㄡˊ ㄒㄧㄣ ㄒㄧㄤˇ ㄕㄨㄛ ㄅㄨˋ ㄉㄧㄥˋ ㄕˋ ㄕㄣˊ ㄇㄧㄥˊ ˙ㄋㄜ"
          },
          {
            "id": "p04-2",
            "speaker": "mother",
            "style": "a tired, weak young mother praying softly and earnestly, hands together",
            "ja": "「いしの じいさま、どうか たすけて ください。 げんきに なったら、かならず おまいりに きます。」",
            "zh": "「石爺，請您保佑我。等我好起來，一定常常來拜您。」",
            "zhuyin": "ㄕˊ ㄧㄝˊ ㄑㄧㄥˇ ㄋㄧㄣˊ ㄅㄠˇ ㄧㄡˋ ㄨㄛˇ ㄉㄥˇ ㄨㄛˇ ㄏㄠˇ ㄑㄧˇ ㄌㄞˊ ㄧ ㄉㄧㄥˋ ㄔㄤˊ ㄔㄤˊ ㄌㄞˊ ㄅㄞˋ ㄋㄧㄣˊ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/xinpu-shi-ye/p05.webp",
        "alt": {
          "ja": "いしを ゆびさして うなずく しらがの おじいさんと、みあげる おばさん",
          "zh": "指著石頭點頭的白髮老爺爺，和抬頭看他的伯母"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "hushed, gentle wonder",
            "ja": "おばさんが かおを あげると、しらがの おじいさんが いしを ゆびさして、うなずいて いました。",
            "zh": "伯母一抬頭，看見一位白頭髮的老爺爺指著石頭，朝她點點頭。",
            "zhuyin": "ㄅㄛˊ ㄇㄨˇ ㄧ ㄊㄞˊ ㄊㄡˊ ㄎㄢˋ ㄐㄧㄢˋ ㄧ ㄨㄟˋ ㄅㄞˊ ㄊㄡˊ ㄈㄚˇ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄓˇ ˙ㄓㄜ ㄕˊ ㄊㄡˊ ㄔㄠˊ ㄊㄚ ㄉㄧㄢˇ ㄉㄧㄢˇ ㄊㄡˊ"
          },
          {
            "id": "p05-2",
            "speaker": "narrator",
            "style": "warm, relieved",
            "ja": "おばさんは、ほっと しました。",
            "zh": "伯母覺得安心多了。",
            "zhuyin": "ㄅㄛˊ ㄇㄨˇ ㄐㄩㄝˊ ˙ㄉㄜ ㄢ ㄒㄧㄣ ㄉㄨㄛ ˙ㄌㄜ"
          },
          {
            "id": "p05-3",
            "speaker": "narrator",
            "style": "soft, mysterious, slow",
            "ja": "もう いちど みると、そこには だれも いませんでした。",
            "zh": "再看一眼，那裡卻一個人也沒有了。",
            "zhuyin": "ㄗㄞˋ ㄎㄢˋ ㄧ ㄧㄢˇ ㄋㄚˋ ˙ㄌㄧ ㄑㄩㄝˋ ㄧ ˙ㄍㄜ ㄖㄣˊ ㄧㄝˇ ㄇㄟˊ ㄧㄡˇ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/xinpu-shi-ye/p06.webp",
        "alt": {
          "ja": "いえで やすみ、かぞくに せわを して もらう おばさん",
          "zh": "在家休息、被家人照顧的伯母"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "warm, caring, restful",
            "ja": "おばさんは いえに かえり、かぞくが せわを して くれて、ゆっくり やすみました。",
            "zh": "伯母回到家，在家人的照顧下好好休息。",
            "zhuyin": "ㄅㄛˊ ㄇㄨˇ ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄗㄞˋ ㄐㄧㄚ ㄖㄣˊ ˙ㄉㄜ ㄓㄠˋ ㄍㄨˋ ㄒㄧㄚˋ ㄏㄠˇ ㄏㄠˇ ㄒㄧㄡ ㄒㄧˊ"
          },
          {
            "id": "p06-2",
            "speaker": "narrator",
            "style": "gently brightening",
            "ja": "なんにちか たつと、おばさんは すこしずつ げんきに なりました。",
            "zh": "過了幾天，伯母慢慢有了精神。",
            "zhuyin": "ㄍㄨㄛˋ ˙ㄌㄜ ㄐㄧˇ ㄊㄧㄢ ㄅㄛˊ ㄇㄨˇ ㄇㄢˋ ㄇㄢˋ ㄧㄡˇ ˙ㄌㄜ ㄐㄧㄥ ㄕㄣˊ"
          },
          {
            "id": "p06-3",
            "speaker": "mother",
            "style": "a young mother, grateful and quietly happy, speaking softly to herself",
            "ja": "「きっと、いしの じいさまが まもって くださったんだわ。」",
            "zh": "「一定是石爺在保佑我。」",
            "zhuyin": "ㄧ ㄉㄧㄥˋ ㄕˋ ㄕˊ ㄧㄝˊ ㄗㄞˋ ㄅㄠˇ ㄧㄡˋ ㄨㄛˇ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/xinpu-shi-ye/p07.webp",
        "alt": {
          "ja": "ゆうやけの なか、いしの まえで おせんこうを あげる おばさん",
          "zh": "夕陽下，在石頭前拿香拜拜的伯母"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "warm, respectful, steady",
            "ja": "おばさんは やくそくを まもり、おせんこうを もって、なんども おまいりに いきました。",
            "zh": "伯母說到做到，常常帶著香上山拜石爺，跟祂說謝謝。",
            "zhuyin": "ㄅㄛˊ ㄇㄨˇ ㄕㄨㄛ ㄉㄠˋ ㄗㄨㄛˋ ㄉㄠˋ ㄔㄤˊ ㄔㄤˊ ㄉㄞˋ ˙ㄓㄜ ㄒㄧㄤ ㄕㄤˋ ㄕㄢ ㄅㄞˋ ㄕˊ ㄧㄝˊ ㄍㄣ ㄊㄚ ㄕㄨㄛ ㄒㄧㄝˋ ˙ㄒㄧㄝ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/xinpu-shi-ye/p08.webp",
        "alt": {
          "ja": "おばさんの はなしを きいて、うらやまを みあげる となりの ひとたち",
          "zh": "聽了伯母的故事，抬頭望向後山的鄰居們"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "curious, lively",
            "ja": "おばさんの はなしを きいた となりの ひとたちは、うらやまの ほうを みあげました。",
            "zh": "鄰居聽了伯母的故事，都抬頭望向後山。",
            "zhuyin": "ㄌㄧㄣˊ ㄐㄩ ㄊㄧㄥ ˙ㄌㄜ ㄅㄛˊ ㄇㄨˇ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄉㄡ ㄊㄞˊ ㄊㄡˊ ㄨㄤˋ ㄒㄧㄤˋ ㄏㄡˋ ㄕㄢ"
          },
          {
            "id": "p08-2",
            "speaker": "narrator",
            "style": "brisk, the news spreading",
            "ja": "はなしは あっというまに ひろがって、とおくの まちまで つたわりました。",
            "zh": "這個故事很快就傳開了，連很遠的地方都知道了。",
            "zhuyin": "ㄓㄜˋ ˙ㄍㄜ ㄍㄨˋ ㄕˋ ㄏㄣˇ ㄎㄨㄞˋ ㄐㄧㄡˋ ㄔㄨㄢˊ ㄎㄞ ˙ㄌㄜ ㄌㄧㄢˊ ㄏㄣˇ ㄩㄢˇ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄉㄡ ㄓ ㄉㄠˋ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/xinpu-shi-ye/p09.webp",
        "alt": {
          "ja": "いしの まえに ならび、はこに おかねを おそなえする ひとびと",
          "zh": "在石頭前排隊，把香油錢放進箱子的人們"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "warm, busy, many people coming",
            "ja": "たくさんの ひとが とおくからも かわを わたって、いしの じいさまに おまいりに きました。",
            "zh": "許多人從遠方來，渡過那條河，上山拜石爺。",
            "zhuyin": "ㄒㄩˇ ㄉㄨㄛ ㄖㄣˊ ㄘㄨㄥˊ ㄩㄢˇ ㄈㄤ ㄌㄞˊ ㄉㄨˋ ㄍㄨㄛˋ ㄋㄚˋ ㄊㄧㄠˊ ㄏㄜˊ ㄕㄤˋ ㄕㄢ ㄅㄞˋ ㄕˊ ㄧㄝˊ"
          },
          {
            "id": "p09-2",
            "speaker": "narrator",
            "style": "gentle, respectful",
            "ja": "みんな それぞれの ねがいを こめて、はこに おかねを おそなえしました。",
            "zh": "大家帶著各自的心願，把香油錢放進箱子裡。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄉㄞˋ ˙ㄓㄜ ㄍㄜˋ ㄗˋ ˙ㄉㄜ ㄒㄧㄣ ㄩㄢˋ ㄅㄚˇ ㄒㄧㄤ ㄧㄡˊ ㄑㄧㄢˊ ㄈㄤˋ ㄐㄧㄣˋ ㄒㄧㄤ ˙ㄗ ˙ㄌㄧ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/xinpu-shi-ye/p10.webp",
        "alt": {
          "ja": "かわの そばで、はしの えを みせる そんちょうさん",
          "zh": "在河邊拿出大橋圖的庄長"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "a spark of an idea",
            "ja": "おまいりの ひとが どんどん ふえると きいて、そんちょうさんは ある ことを おもいつきました。",
            "zh": "庄長聽說來拜石爺的人越來越多，心裡有了一個主意。",
            "zhuyin": "ㄓㄨㄤ ㄓㄤˇ ㄊㄧㄥ ㄕㄨㄛ ㄌㄞˊ ㄅㄞˋ ㄕˊ ㄧㄝˊ ˙ㄉㄜ ㄖㄣˊ ㄩㄝˋ ㄌㄞˊ ㄩㄝˋ ㄉㄨㄛ ㄒㄧㄣ ˙ㄌㄧ ㄧㄡˇ ˙ㄌㄜ ㄧ ˙ㄍㄜ ㄓㄨˇ ㄧˋ"
          },
          {
            "id": "p10-2",
            "speaker": "father",
            "style": "an elderly village head, hopeful and determined, explaining his plan",
            "ja": "「おそなえの おかねで、はしを つくろう。 むらの ひとも、おまいりに くる ひとも、かわを わたれるように。」",
            "zh": "「用香油錢來蓋橋吧！讓村子裡的人和來拜拜的人，都能過河。」",
            "zhuyin": "ㄩㄥˋ ㄒㄧㄤ ㄧㄡˊ ㄑㄧㄢˊ ㄌㄞˊ ㄍㄞˋ ㄑㄧㄠˊ ˙ㄅㄚ ㄖㄤˋ ㄘㄨㄣ ˙ㄗ ˙ㄌㄧ ˙ㄉㄜ ㄖㄣˊ ㄏㄢˋ ㄌㄞˊ ㄅㄞˋ ㄅㄞˋ ˙ㄉㄜ ㄖㄣˊ ㄉㄡ ㄋㄥˊ ㄍㄨㄛˋ ㄏㄜˊ"
          }
        ]
      },
      {
        "id": "p11",
        "image": "images/xinpu-shi-ye/p11.webp",
        "alt": {
          "ja": "できあがった はしを わたる むらの ひとたち",
          "zh": "走過新蓋好的大橋的村民"
        },
        "lines": [
          {
            "id": "p11-1",
            "speaker": "narrator",
            "style": "proud, happy, a big moment",
            "ja": "そして ついに、{新埔|しんぽ}の おおきな はしが できあがりました。",
            "zh": "後來，新埔大橋終於蓋好了。",
            "zhuyin": "ㄏㄡˋ ㄌㄞˊ ㄒㄧㄣ ㄆㄨ ㄉㄚˋ ㄑㄧㄠˊ ㄓㄨㄥ ㄩˊ ㄍㄞˋ ㄏㄠˇ ˙ㄌㄜ"
          },
          {
            "id": "p11-2",
            "speaker": "narrator",
            "style": "relieved, joyful",
            "ja": "もう みずが ふえた ひも、はしの うえを わたって いけます。",
            "zh": "就算河水漲起來，大家也能從橋上走過去了。",
            "zhuyin": "ㄐㄧㄡˋ ㄙㄨㄢˋ ㄏㄜˊ ㄕㄨㄟˇ ㄓㄤˇ ㄑㄧˇ ㄌㄞˊ ㄉㄚˋ ㄐㄧㄚ ㄧㄝˇ ㄋㄥˊ ㄘㄨㄥˊ ㄑㄧㄠˊ ㄕㄤˋ ㄗㄡˇ ㄍㄨㄛˋ ㄑㄩˋ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p12",
        "image": "images/xinpu-shi-ye/p12.webp",
        "alt": {
          "ja": "トタンの やねの そばに、きで ちいさな おみやを たてる ひとたち",
          "zh": "在鐵皮棚旁，用木頭蓋小廟的人們"
        },
        "lines": [
          {
            "id": "p12-1",
            "speaker": "narrator",
            "style": "gentle, a little wistful",
            "ja": "おかねは ぜんぶ はしに つかったので、いしの じいさまには、トタンの やねが ある だけでした。",
            "zh": "錢全都用來蓋橋了，只能幫石爺搭一個小小的鐵皮棚。",
            "zhuyin": "ㄑㄧㄢˊ ㄑㄩㄢˊ ㄉㄡ ㄩㄥˋ ㄌㄞˊ ㄍㄞˋ ㄑㄧㄠˊ ˙ㄌㄜ ㄓˇ ㄋㄥˊ ㄅㄤ ㄕˊ ㄧㄝˊ ㄉㄚ ㄧ ˙ㄍㄜ ㄒㄧㄠˇ ㄒㄧㄠˇ ˙ㄉㄜ ㄊㄧㄝˇ ㄆㄧˊ ㄆㄥˊ"
          },
          {
            "id": "p12-2",
            "speaker": "narrator",
            "style": "warm, grateful, communal",
            "ja": "ずっと あとに なって、おまいりの ひとたちは みんなで、きで ちいさな おみやを たてました。",
            "zh": "過了好多年，拜石爺的人一起用木頭蓋了一座小廟。",
            "zhuyin": "ㄍㄨㄛˋ ˙ㄌㄜ ㄏㄠˇ ㄉㄨㄛ ㄋㄧㄢˊ ㄅㄞˋ ㄕˊ ㄧㄝˊ ˙ㄉㄜ ㄖㄣˊ ㄧ ㄑㄧˇ ㄩㄥˋ ㄇㄨˋ ˙ㄊㄡ ㄍㄞˋ ˙ㄌㄜ ㄧ ㄗㄨㄛˋ ㄒㄧㄠˇ ㄇㄧㄠˋ"
          }
        ]
      },
      {
        "id": "end",
        "image": "images/xinpu-shi-ye/end.webp",
        "alt": {
          "ja": "かわに かかる はしと、おかの うえの ちいさな おみやが みえる しんぽの まち",
          "zh": "看得見河上大橋和山坡小廟的新埔街景"
        },
        "lines": [
          {
            "id": "end-1",
            "speaker": "narrator",
            "style": "warm, gentle, looking back",
            "ja": "むかしは いしを ふんで わたった かわに、いまは おおきな はしが かかって います。",
            "zh": "以前要踩著石頭過河，現在河上有一座大橋。",
            "zhuyin": "ㄧˇ ㄑㄧㄢˊ ㄧㄠˋ ㄘㄞˇ ˙ㄓㄜ ㄕˊ ㄊㄡˊ ㄍㄨㄛˋ ㄏㄜˊ ㄒㄧㄢˋ ㄗㄞˋ ㄏㄜˊ ㄕㄤˋ ㄧㄡˇ ㄧ ㄗㄨㄛˋ ㄉㄚˋ ㄑㄧㄠˊ"
          },
          {
            "id": "end-2",
            "speaker": "narrator",
            "style": "gentle, timeless",
            "ja": "その あと、いしの じいさまの おみやは まちの おかの うえに うつされ、いまも そこに あります。",
            "zh": "後來，石爺的小廟搬到鎮上的小山坡，現在還在那裡。",
            "zhuyin": "ㄏㄡˋ ㄌㄞˊ ㄕˊ ㄧㄝˊ ˙ㄉㄜ ㄒㄧㄠˇ ㄇㄧㄠˋ ㄅㄢ ㄉㄠˋ ㄓㄣˋ ㄕㄤˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄕㄢ ㄆㄛ ㄒㄧㄢˋ ㄗㄞˋ ㄏㄞˊ ㄗㄞˋ ㄋㄚˋ ˙ㄌㄧ"
          },
          {
            "id": "end-3",
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
    "id": "dajia-mazu-pilgrimage",
    "title": {
      "ja": "{媽祖|まそ}さまと いっしょに あるく みち",
      "zh": "一路同行的媽祖",
      "zhuyin": "ㄧ ㄌㄨˋ ㄊㄨㄥˊ ㄒㄧㄥˊ ˙ㄉㄜ ㄇㄚ ㄗㄨˇ"
    },
    "tagline": {
      "ja": "うみの おんなのこの いいつたえから、いまも つづく ターチャの ながい たびへ",
      "zh": "從媽祖的傳說，走到大甲媽祖遶境進香"
    },
    "origin": {
      "ja": "{媽祖|まそ}さまの いいつたえと、たいわん ターチャの おまつり",
      "zh": "媽祖傳說與台灣大甲鎮瀾宮的遶境進香習俗"
    },
    "credit": {
      "ja": "{媽祖|まそ}さまの いいつたえには、むかしから いろいろな おはなしが あります。 この えほんの モーニャンの はなしは、たいわんで よく かたられる いいつたえを もとに かきなおしました。 ターチャの {媽祖|まそ}さまの たびは いまも つづいて いて、みちすじや にっすうは としに よって かわり、しんじる きもちも ひとそれぞれです。 シャオアンと その かぞくは、この えほんの ための じんぶつです。",
      "zh": "媽祖的身世從古至今有許多不同的說法，本書前半的林默娘故事，是依照台灣常聽到的傳說改寫。大甲鎮瀾宮的媽祖遶境進香至今仍在舉行，路線和天數會隨年份調整，信仰的心情也因人而異。小安和家人是為本書創作的人物。"
    },
    "theme": {
      "accent": "#b8433f",
      "soft": "#f7e2df"
    },
    "pages": [
      {
        "id": "cover",
        "image": "images/dajia-mazu-pilgrimage/cover.webp",
        "alt": {
          "ja": "ゆうやけの なか、まそさまの おかごと いっしょに あるく シャオアンと おばあちゃんたち",
          "zh": "夕陽下，跟著媽祖神轎一起走路的小安、阿嬤和家人"
        },
        "lines": [
          {
            "id": "cover-1",
            "speaker": "narrator",
            "style": "warm, inviting storyteller opening a picture book",
            "ja": "たいわんの まち、ターチャの おはなし『{媽祖|まそ}さまと いっしょに あるく みち』",
            "zh": "台灣大甲的故事〈一路同行的媽祖〉",
            "zhuyin": "ㄊㄞˊ ㄨㄢ ㄉㄚˋ ㄐㄧㄚˇ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄧ ㄌㄨˋ ㄊㄨㄥˊ ㄒㄧㄥˊ ˙ㄉㄜ ㄇㄚ ㄗㄨˇ"
          },
          {
            "id": "cover-2",
            "speaker": "narrator",
            "style": "warm, gentle, a journey about to begin",
            "ja": "シャオアンと おばあちゃんが、{媽祖|まそ}さまと いっしょに でかけます。",
            "zh": "小安和阿嬤，要陪媽祖出發了。",
            "zhuyin": "ㄒㄧㄠˇ ㄢ ㄏㄢˋ ㄚ ㄇㄚˋ ㄧㄠˋ ㄆㄟˊ ㄇㄚ ㄗㄨˇ ㄔㄨ ㄈㄚ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/dajia-mazu-pilgrimage/p01.webp",
        "alt": {
          "ja": "びょうの まえで はたを じゅんびする シャオアンと おばあちゃんと かぞく",
          "zh": "在廟前和阿嬤、家人一起準備旗子的小安"
        },
        "lines": [
          {
            "id": "p01-1",
            "speaker": "narrator",
            "style": "cozy, curious child's question on a busy day",
            "ja": "しゅっぱつの まえの ひ、シャオアンは はたを じゅんびしながら ききました。「おばあちゃん、{媽祖|まそ}さまって だれ？」",
            "zh": "出發前一天，小安幫阿嬤整理旗子，忍不住問：「阿嬤，媽祖是誰呀？」",
            "zhuyin": "ㄔㄨ ㄈㄚ ㄑㄧㄢˊ ㄧ ㄊㄧㄢ ㄒㄧㄠˇ ㄢ ㄅㄤ ㄚ ㄇㄚˋ ㄓㄥˇ ㄌㄧˇ ㄑㄧˊ ˙ㄗ ㄖㄣˇ ㄅㄨˋ ㄓㄨˋ ㄨㄣˋ ㄚ ㄇㄚˋ ㄇㄚ ㄗㄨˇ ㄕˋ ㄕㄟˊ ˙ㄧㄚ"
          },
          {
            "id": "p01-2",
            "speaker": "elder",
            "style": "kind grandmother, smiling, about to tell an old story",
            "ja": "「それはね、むかし むかしの おはなしよ。」",
            "zh": "「那是很久很久以前的故事喔。」",
            "zhuyin": "ㄋㄚˋ ㄕˋ ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄛ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/dajia-mazu-pilgrimage/p02.webp",
        "alt": {
          "ja": "むかしの しまの はまべで、うみを ながめる おんなのこ、モーニャン",
          "zh": "很久以前，在小島海邊望著大海的女孩默娘"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "gentle once-upon-a-time storyteller, legend tone",
            "ja": "むかし、うみの むこうの メイチョウという しまに、ひとりの おんなのこが うまれました。 うまれた とき なかなかったので、{林黙娘|リン・モーニャン}と よばれたそうです。",
            "zh": "傳說很久以前，海那邊的湄洲島上，有個女孩出生了。她生下來沒有哭，家人就叫她林默娘。",
            "zhuyin": "ㄔㄨㄢˊ ㄕㄨㄛ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄏㄞˇ ㄋㄚˋ ㄅㄧㄢ ˙ㄉㄜ ㄇㄟˊ ㄓㄡ ㄉㄠˇ ㄕㄤˋ ㄧㄡˇ ˙ㄍㄜ ㄋㄩˇ ㄏㄞˊ ㄔㄨ ㄕㄥ ˙ㄌㄜ ㄊㄚ ㄕㄥ ㄒㄧㄚˋ ㄌㄞˊ ㄇㄟˊ ㄧㄡˇ ㄎㄨ ㄐㄧㄚ ㄖㄣˊ ㄐㄧㄡˋ ㄐㄧㄠˋ ㄊㄚ ㄌㄧㄣˊ ㄇㄛˋ ㄋㄧㄤˊ"
          },
          {
            "id": "p02-2",
            "speaker": "narrator",
            "style": "soft, explaining a name to a child",
            "ja": "「モー」は、「しずか」と いう いみです。",
            "zh": "「默」，就是安靜的意思。",
            "zhuyin": "ㄇㄛˋ ㄐㄧㄡˋ ㄕˋ ㄢ ㄐㄧㄥˋ ˙ㄉㄜ ㄧˋ ˙ㄙ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/dajia-mazu-pilgrimage/p03.webp",
        "alt": {
          "ja": "くろい くもを ゆびさして、りょうしさんたちに しらせる モーニャン",
          "zh": "指著烏雲、提醒漁夫們的默娘"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "narrator",
            "style": "storyteller, a little hushed and mysterious",
            "ja": "ひとびとの はなしでは、あぶない ことが おこる まえに、モーニャンには わかって、みんなに しらせたそうです。",
            "zh": "人們說，危險要來的時候，默娘常常會先知道，提醒大家小心。",
            "zhuyin": "ㄖㄣˊ ˙ㄇㄣ ㄕㄨㄛ ㄨㄟˊ ㄒㄧㄢˇ ㄧㄠˋ ㄌㄞˊ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄇㄛˋ ㄋㄧㄤˊ ㄔㄤˊ ㄔㄤˊ ㄏㄨㄟˋ ㄒㄧㄢ ㄓ ㄉㄠˋ ㄊㄧˊ ㄒㄧㄥˇ ㄉㄚˋ ㄐㄧㄚ ㄒㄧㄠˇ ㄒㄧㄣ"
          },
          {
            "id": "p03-2",
            "speaker": "narrator",
            "style": "storyteller, gently setting up worry",
            "ja": "モーニャンの おとうさんも、ふねで りょうに でて いました。",
            "zh": "默娘的爸爸，也常常坐船出海捕魚。",
            "zhuyin": "ㄇㄛˋ ㄋㄧㄤˊ ˙ㄉㄜ ㄅㄚˋ ˙ㄅㄚ ㄧㄝˇ ㄔㄤˊ ㄔㄤˊ ㄗㄨㄛˋ ㄔㄨㄢˊ ㄔㄨ ㄏㄞˇ ㄅㄨˇ ㄩˊ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/dajia-mazu-pilgrimage/p04.webp",
        "alt": {
          "ja": "はたおりの とちゅうで めを とじた モーニャンと、ゆめの ような あらしの うみの ふね",
          "zh": "在織布機前閉上眼睛的默娘，和像夢一樣浮現的暴風雨中的小船"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "narrator",
            "style": "quiet, mysterious legend moment",
            "ja": "ある ひ、はたを おって いた モーニャンが、きゅうに めを とじて、ねむった ように なりました。",
            "zh": "有一天，默娘正在織布，忽然閉上眼睛，好像睡著了。",
            "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄇㄛˋ ㄋㄧㄤˊ ㄓㄥˋ ㄗㄞˋ ㄓ ㄅㄨˋ ㄏㄨ ㄖㄢˊ ㄅㄧˋ ㄕㄤˋ ㄧㄢˇ ㄐㄧㄥ ㄏㄠˇ ㄒㄧㄤˋ ㄕㄨㄟˋ ㄓㄠˊ ˙ㄌㄜ"
          },
          {
            "id": "p04-2",
            "speaker": "narrator",
            "style": "wonder, then warm relief",
            "ja": "めを さますと、「おとうさんの ふねが うみで あぶなかったから、たすけに いったの」と いいました。 おはなしでは、おとうさんは ぶじに かえって きたそうです。",
            "zh": "醒來後她說：「爸爸的船在海上遇到危險，我去救他了。」故事說，後來爸爸平安回來了。",
            "zhuyin": "ㄒㄧㄥˇ ㄌㄞˊ ㄏㄡˋ ㄊㄚ ㄕㄨㄛ ㄅㄚˋ ˙ㄅㄚ ˙ㄉㄜ ㄔㄨㄢˊ ㄗㄞˋ ㄏㄞˇ ㄕㄤˋ ㄩˋ ㄉㄠˋ ㄨㄟˊ ㄒㄧㄢˇ ㄨㄛˇ ㄑㄩˋ ㄐㄧㄡˋ ㄊㄚ ˙ㄌㄜ ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄏㄡˋ ㄌㄞˊ ㄅㄚˋ ˙ㄅㄚ ㄆㄧㄥˊ ㄢ ㄏㄨㄟˊ ㄌㄞˊ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/dajia-mazu-pilgrimage/p05.webp",
        "alt": {
          "ja": "うみべの ちいさな びょうで、せんこうを もって おまいりする むらの ひとたち",
          "zh": "在海邊小廟前拿著香、恭敬參拜的村民"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "gentle, respectful, remembering",
            "ja": "いいつたえでは、やがて モーニャンは なくなりました。 ひとびとは モーニャンを わすれず、おまいりする {廟|びょう}を たてて、「{媽祖|まそ}さま」と よびました。",
            "zh": "傳說中，默娘後來過世了。人們記得她幫助過人，就建廟祭拜，尊稱她為「媽祖」。",
            "zhuyin": "ㄔㄨㄢˊ ㄕㄨㄛ ㄓㄨㄥ ㄇㄛˋ ㄋㄧㄤˊ ㄏㄡˋ ㄌㄞˊ ㄍㄨㄛˋ ㄕˋ ˙ㄌㄜ ㄖㄣˊ ˙ㄇㄣ ㄐㄧˋ ˙ㄉㄜ ㄊㄚ ㄅㄤ ㄓㄨˋ ㄍㄨㄛˋ ㄖㄣˊ ㄐㄧㄡˋ ㄐㄧㄢˋ ㄇㄧㄠˋ ㄐㄧˋ ㄅㄞˋ ㄗㄨㄣ ㄔㄥ ㄊㄚ ㄨㄟˊ ㄇㄚ ㄗㄨˇ"
          },
          {
            "id": "p05-2",
            "speaker": "narrator",
            "style": "calm, reverent",
            "ja": "うみに でる おおくの ひとが、{媽祖|まそ}さまに ぶじを いのりました。",
            "zh": "許多出海的人，都會請媽祖保佑平安。",
            "zhuyin": "ㄒㄩˇ ㄉㄨㄛ ㄔㄨ ㄏㄞˇ ˙ㄉㄜ ㄖㄣˊ ㄉㄡ ㄏㄨㄟˋ ㄑㄧㄥˇ ㄇㄚ ㄗㄨˇ ㄅㄠˇ ㄧㄡˋ ㄆㄧㄥˊ ㄢ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/dajia-mazu-pilgrimage/p06.webp",
        "alt": {
          "ja": "まそさまの ぞうを のせて、ひろい うみを わたる ふねの かぞくたち",
          "zh": "帶著媽祖像、坐船渡過大海的一家家人"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "hopeful sea voyage, steady and warm",
            "ja": "ずっと あとに なって、ふねで ひろい うみを わたって たいわんへ きた ひとたちも、{媽祖|まそ}さまの ぞうを のせて、ぶじを いのりました。",
            "zh": "過了很多年，有些人坐船渡過大海來到台灣，也把媽祖像帶上船，祈求一路平安。",
            "zhuyin": "ㄍㄨㄛˋ ˙ㄌㄜ ㄏㄣˇ ㄉㄨㄛ ㄋㄧㄢˊ ㄧㄡˇ ㄒㄧㄝ ㄖㄣˊ ㄗㄨㄛˋ ㄔㄨㄢˊ ㄉㄨˋ ㄍㄨㄛˋ ㄉㄚˋ ㄏㄞˇ ㄌㄞˊ ㄉㄠˋ ㄊㄞˊ ㄨㄢ ㄧㄝˇ ㄅㄚˇ ㄇㄚ ㄗㄨˇ ㄒㄧㄤˋ ㄉㄞˋ ㄕㄤˋ ㄔㄨㄢˊ ㄑㄧˊ ㄑㄧㄡˊ ㄧ ㄌㄨˋ ㄆㄧㄥˊ ㄢ"
          },
          {
            "id": "p06-2",
            "speaker": "elder",
            "style": "kind grandmother, proud and a little playful",
            "ja": "「おばあちゃんの おじいちゃんの おじいちゃんも、そうやって たいわんに きたのよ。」",
            "zh": "「阿嬤的阿公的阿公，就是這樣來到台灣的喔。」",
            "zhuyin": "ㄚ ㄇㄚˋ ˙ㄉㄜ ㄚ ㄍㄨㄥ ˙ㄉㄜ ㄚ ㄍㄨㄥ ㄐㄧㄡˋ ㄕˋ ㄓㄜˋ ㄧㄤˋ ㄌㄞˊ ㄉㄠˋ ㄊㄞˊ ㄨㄢ ˙ㄉㄜ ㄛ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/dajia-mazu-pilgrimage/p07.webp",
        "alt": {
          "ja": "ターチャの チェンランゴンの まえで、はたや にもつを じゅんびする ひとびと",
          "zh": "在大甲鎮瀾宮前，準備旗子和行李的人們"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "warm storyteller, bringing us back to today",
            "ja": "たいわんの あちこちに {媽祖|まそ}さまの {廟|びょう}が あります。 ターチャの {鎮瀾宮|チェンランゴン}の {媽祖|まそ}さまは、まいとし はるに、シンガンの {奉天宮|フォンティエンゴン}の {媽祖|まそ}さまを たずねに いきます。",
            "zh": "台灣許多地方都有媽祖廟。大甲鎮瀾宮的媽祖，每年春天都要去拜訪新港奉天宮的媽祖。",
            "zhuyin": "ㄊㄞˊ ㄨㄢ ㄒㄩˇ ㄉㄨㄛ ㄉㄧˋ ㄈㄤ ㄉㄡ ㄧㄡˇ ㄇㄚ ㄗㄨˇ ㄇㄧㄠˋ ㄉㄚˋ ㄐㄧㄚˇ ㄓㄣˋ ㄌㄢˊ ㄍㄨㄥ ˙ㄉㄜ ㄇㄚ ㄗㄨˇ ㄇㄟˇ ㄋㄧㄢˊ ㄔㄨㄣ ㄊㄧㄢ ㄉㄡ ㄧㄠˋ ㄑㄩˋ ㄅㄞˋ ㄈㄤˇ ㄒㄧㄣ ㄍㄤˇ ㄈㄥˋ ㄊㄧㄢ ㄍㄨㄥ ˙ㄉㄜ ㄇㄚ ㄗㄨˇ"
          },
          {
            "id": "p07-2",
            "speaker": "elder",
            "style": "kind grandmother, heartfelt, one smooth sentence with no pause after the first word",
            "ja": "「{媽祖|まそ}さまは ずっと みんなを みまもって くれたから、いっしょに あるいて ありがとうを つたえるのよ。」",
            "jaTts": "「マソさまは、ずっと みんなを みまもって くれたから、いっしょに あるいて、ありがとうを つたえるのよ。」",
            "zh": "「媽祖一直照顧大家，所以我們陪祂走，跟祂說聲謝謝。」",
            "zhuyin": "ㄇㄚ ㄗㄨˇ ㄧ ㄓˊ ㄓㄠˋ ㄍㄨˋ ㄉㄚˋ ㄐㄧㄚ ㄙㄨㄛˇ ㄧˇ ㄨㄛˇ ˙ㄇㄣ ㄆㄟˊ ㄊㄚ ㄗㄡˇ ㄍㄣ ㄊㄚ ㄕㄨㄛ ㄕㄥ ㄒㄧㄝˋ ˙ㄒㄧㄝ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/dajia-mazu-pilgrimage/p08.webp",
        "alt": {
          "ja": "しゅっぱつした まそさまの おかごと、そばを うやうやしく あるく ひとびと",
          "zh": "出發的媽祖神轎，和恭敬地走在旁邊的人們"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "solemn, respectful, a procession beginning",
            "ja": "つぎの ひ、{媽祖|まそ}さまを のせた おかごが しゅっぱつしました。 なんにちも あるく ひとも、すこしだけ あるく ひとも います。",
            "zh": "第二天，媽祖的神轎出發了。有人要走好多天，有人只陪一小段路。",
            "zhuyin": "ㄉㄧˋ ㄦˋ ㄊㄧㄢ ㄇㄚ ㄗㄨˇ ˙ㄉㄜ ㄕㄣˊ ㄐㄧㄠˋ ㄔㄨ ㄈㄚ ˙ㄌㄜ ㄧㄡˇ ㄖㄣˊ ㄧㄠˋ ㄗㄡˇ ㄏㄠˇ ㄉㄨㄛ ㄊㄧㄢ ㄧㄡˇ ㄖㄣˊ ㄓˇ ㄆㄟˊ ㄧ ㄒㄧㄠˇ ㄉㄨㄢˋ ㄌㄨˋ"
          },
          {
            "id": "p08-2",
            "speaker": "narrator",
            "style": "warm, family walking together",
            "ja": "シャオアンと おとうさんも、はじめの いちにちを おばあちゃんと あるきました。",
            "zh": "小安和爸爸，也陪阿嬤走第一天。",
            "zhuyin": "ㄒㄧㄠˇ ㄢ ㄏㄢˋ ㄅㄚˋ ˙ㄅㄚ ㄧㄝˇ ㄆㄟˊ ㄚ ㄇㄚˋ ㄗㄡˇ ㄉㄧˋ ㄧ ㄊㄧㄢ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/dajia-mazu-pilgrimage/p09.webp",
        "alt": {
          "ja": "みちばたで みずを もらう シャオアンと、みずを くばる ひと",
          "zh": "在路邊接過一杯水的小安，和遞水的人"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "hot sunny day, grateful",
            "ja": "おひさまが てりつけて、シャオアンは あせびっしょり。 みちばたで みずを もらうと、「ありがとう！」と いいました。",
            "zh": "太陽曬得小安滿頭大汗。路邊有人遞來一杯水，小安接過來說：「謝謝！」",
            "zhuyin": "ㄊㄞˋ ㄧㄤˊ ㄕㄞˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄢ ㄇㄢˇ ㄊㄡˊ ㄉㄚˋ ㄏㄢˋ ㄌㄨˋ ㄅㄧㄢ ㄧㄡˇ ㄖㄣˊ ㄉㄧˋ ㄌㄞˊ ㄧ ㄅㄟ ㄕㄨㄟˇ ㄒㄧㄠˇ ㄢ ㄐㄧㄝ ㄍㄨㄛˋ ㄌㄞˊ ㄕㄨㄛ ㄒㄧㄝˋ ˙ㄒㄧㄝ"
          },
          {
            "id": "p09-2",
            "speaker": "elder",
            "style": "kind village grandmother, gently warm",
            "ja": "「みんなで たすけあって いるのね。」",
            "zh": "「大家都在互相照顧呢。」",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄗㄞˋ ㄏㄨˋ ㄒㄧㄤ ㄓㄠˋ ㄍㄨˋ ˙ㄋㄜ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/dajia-mazu-pilgrimage/p10.webp",
        "alt": {
          "ja": "よるの あかりの した、ねぶくろで やすむ シャオアンと かぞく",
          "zh": "夜晚的燈火下，躺在睡袋裡休息的小安和家人"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "peaceful evening rest, a little tired",
            "ja": "よるに なると、シャオアンの あしは いたく なりました。",
            "zh": "到了晚上，小安的腳好痠。",
            "zhuyin": "ㄉㄠˋ ˙ㄌㄜ ㄨㄢˇ ㄕㄤˋ ㄒㄧㄠˇ ㄢ ˙ㄉㄜ ㄐㄧㄠˇ ㄏㄠˇ ㄙㄨㄢ"
          },
          {
            "id": "p10-2",
            "speaker": "father",
            "style": "warm, gentle father making a plan with his little daughter",
            "ja": "「あしたは おとうさんと さきに かえろう。 おばあちゃんを まって いようね。」",
            "zh": "「明天爸爸陪你先回家，等阿嬤回來。」",
            "zhuyin": "ㄇㄧㄥˊ ㄊㄧㄢ ㄅㄚˋ ˙ㄅㄚ ㄆㄟˊ ㄋㄧˇ ㄒㄧㄢ ㄏㄨㄟˊ ㄐㄧㄚ ㄉㄥˇ ㄚ ㄇㄚˋ ㄏㄨㄟˊ ㄌㄞˊ"
          },
          {
            "id": "p10-3",
            "speaker": "narrator",
            "style": "tender, a child's earnest wish",
            "ja": "「おばあちゃん、みんなが ぶじに かえれますようにって、{媽祖|まそ}さまに つたえてね」と シャオアンは たのみました。",
            "zh": "小安說：「阿嬤，幫我跟媽祖說，希望大家都平安回家。」",
            "zhuyin": "ㄒㄧㄠˇ ㄢ ㄕㄨㄛ ㄚ ㄇㄚˋ ㄅㄤ ㄨㄛˇ ㄍㄣ ㄇㄚ ㄗㄨˇ ㄕㄨㄛ ㄒㄧ ㄨㄤˋ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄆㄧㄥˊ ㄢ ㄏㄨㄟˊ ㄐㄧㄚ"
          }
        ]
      },
      {
        "id": "p11",
        "image": "images/dajia-mazu-pilgrimage/p11.webp",
        "alt": {
          "ja": "シンガンの フォンティエンゴンで、てを あわせて いのる おばあちゃん",
          "zh": "在新港奉天宮雙手合十祈禱的阿嬤"
        },
        "lines": [
          {
            "id": "p11-1",
            "speaker": "narrator",
            "style": "arrival, respectful and quietly joyful",
            "ja": "なんにちも あるいて、ターチャの {媽祖|まそ}さまは シンガンの {奉天宮|フォンティエンゴン}に つき、シンガンの {媽祖|まそ}さまの となりに すわりました。",
            "zh": "走了好幾天，大甲媽祖到了新港奉天宮，和新港媽祖一起坐在殿裡。",
            "zhuyin": "ㄗㄡˇ ˙ㄌㄜ ㄏㄠˇ ㄐㄧˇ ㄊㄧㄢ ㄉㄚˋ ㄐㄧㄚˇ ㄇㄚ ㄗㄨˇ ㄉㄠˋ ˙ㄌㄜ ㄒㄧㄣ ㄍㄤˇ ㄈㄥˋ ㄊㄧㄢ ㄍㄨㄥ ㄏㄢˋ ㄒㄧㄣ ㄍㄤˇ ㄇㄚ ㄗㄨˇ ㄧ ㄑㄧˇ ㄗㄨㄛˋ ㄗㄞˋ ㄉㄧㄢˋ ˙ㄌㄧ"
          },
          {
            "id": "p11-2",
            "speaker": "narrator",
            "style": "reverent, warm, a wish delivered",
            "ja": "みんなで {媽祖|まそ}さまの おたんじょうびを おいわいし、おばあちゃんも てを あわせて、シャオアンの ねがいを つたえました。",
            "zh": "大家為媽祖祝壽，阿嬤也雙手合十，把小安的願望告訴媽祖。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄨㄟˋ ㄇㄚ ㄗㄨˇ ㄓㄨˋ ㄕㄡˋ ㄚ ㄇㄚˋ ㄧㄝˇ ㄕㄨㄤ ㄕㄡˇ ㄏㄜˊ ㄕˊ ㄅㄚˇ ㄒㄧㄠˇ ㄢ ˙ㄉㄜ ㄩㄢˋ ㄨㄤˋ ㄍㄠˋ ㄙㄨˋ ㄇㄚ ㄗㄨˇ"
          }
        ]
      },
      {
        "id": "p12",
        "image": "images/dajia-mazu-pilgrimage/p12.webp",
        "alt": {
          "ja": "あかりの ともる よるの まちで、かえって きた おばあちゃんに みずを わたす シャオアンと おとうさん",
          "zh": "燈火亮起的夜晚街道上，拿水給回來的阿嬤的小安和爸爸"
        },
        "lines": [
          {
            "id": "p12-1",
            "speaker": "narrator",
            "style": "homecoming night, glowing and happy",
            "ja": "かえりみちも なんにちも かかりました。 ある よる、{媽祖|まそ}さまが ターチャに もどると、たくさんの ひとが むかえに でました。",
            "zh": "回程又走了好幾天。一天晚上，媽祖回到了大甲，好多人出來迎接。",
            "zhuyin": "ㄏㄨㄟˊ ㄔㄥˊ ㄧㄡˋ ㄗㄡˇ ˙ㄌㄜ ㄏㄠˇ ㄐㄧˇ ㄊㄧㄢ ㄧ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄇㄚ ㄗㄨˇ ㄏㄨㄟˊ ㄉㄠˋ ˙ㄌㄜ ㄉㄚˋ ㄐㄧㄚˇ ㄏㄠˇ ㄉㄨㄛ ㄖㄣˊ ㄔㄨ ㄌㄞˊ ㄧㄥˊ ㄐㄧㄝ"
          },
          {
            "id": "p12-2",
            "speaker": "narrator",
            "style": "joyful, a child welcoming loved ones home",
            "ja": "おとうさんと いっしょに、おばあちゃんや あるいて きた ひとたちに みずを わたして、シャオアンは「おかえりなさい！」と いいました。",
            "zh": "小安和爸爸拿水給阿嬤和一起走回來的人，小安笑著說：「你們回來啦！」",
            "zhuyin": "ㄒㄧㄠˇ ㄢ ㄏㄢˋ ㄅㄚˋ ˙ㄅㄚ ㄋㄚˊ ㄕㄨㄟˇ ㄍㄟˇ ㄚ ㄇㄚˋ ㄏㄢˋ ㄧ ㄑㄧˇ ㄗㄡˇ ㄏㄨㄟˊ ㄌㄞˊ ˙ㄉㄜ ㄖㄣˊ ㄒㄧㄠˇ ㄢ ㄒㄧㄠˋ ˙ㄓㄜ ㄕㄨㄛ ㄋㄧˇ ˙ㄇㄣ ㄏㄨㄟˊ ㄌㄞˊ ˙ㄌㄚ"
          }
        ]
      },
      {
        "id": "end",
        "image": "images/dajia-mazu-pilgrimage/end.webp",
        "alt": {
          "ja": "よるの びょうの かいだんで、ちょうちんを もって よりそう シャオアンと おばあちゃん",
          "zh": "夜晚的廟前台階上，提著燈籠依偎在一起的小安和阿嬤"
        },
        "lines": [
          {
            "id": "end-1",
            "speaker": "narrator",
            "style": "warm, gentle ending, slow and clear",
            "ja": "シャオアンは、モーニャンが おとうさんを たすけた おはなしを おもいだして、ぶじに かえった おばあちゃんを ぎゅっと だきしめました。",
            "zh": "小安想起了默娘救爸爸的故事，緊緊抱住平安回來的阿嬤。",
            "zhuyin": "ㄒㄧㄠˇ ㄢ ㄒㄧㄤˇ ㄑㄧˇ ˙ㄌㄜ ㄇㄛˋ ㄋㄧㄤˊ ㄐㄧㄡˋ ㄅㄚˋ ˙ㄅㄚ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄐㄧㄣˇ ㄐㄧㄣˇ ㄅㄠˋ ㄓㄨˋ ㄆㄧㄥˊ ㄢ ㄏㄨㄟˊ ㄌㄞˊ ˙ㄉㄜ ㄚ ㄇㄚˋ"
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
      "ja": "フーグーポーは、たいわんで たいわんごなどで かたりつがれて きた むかしばなしで、ちいきや かたりてに よって ないようが ちがいます。 ひがしアジアには、にた「トラや オオカミの おばあさん」の おはなしも あります。 この えほんは、たいわんの フーグーポーの おはなしから うまれた、あたらしい おはなしです。 かべを たたく あいずの ばめんは、この えほんの ために かんがえました。 だれも かまれたり、おどされたり、ばつを うけたり しません。",
      "zh": "虎姑婆是在台灣用台語等語言代代相傳的民間故事，各地、各個說故事的人講法都不太一樣，東亞也有類似的「虎外婆、狼外婆」故事。這本繪本取材自台灣的虎姑婆故事重新創作，敲牆暗號的情節是本書新編的；沒有人被咬、被威脅，也沒有人受到懲罰。"
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
          "ja": "あかりの ついた いえの まえで、ドアを ノックする しらない ひと",
          "zh": "在燈光溫暖的家門前，敲著門的陌生人"
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
            "style": "gentle, curious, a little mysterious question",
            "ja": "コンコン。 ドアを たたくのは、だあれ？",
            "zh": "叩叩叩，是誰在敲門呀？",
            "zhuyin": "ㄎㄡˋ ㄎㄡˋ ㄎㄡˋ ㄕˋ ㄕㄟˊ ㄗㄞˋ ㄑㄧㄠ ㄇㄣˊ ˙ㄧㄚ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/hu-gu-po/p01.webp",
        "alt": {
          "ja": "となりへ でかける りょうしんと、みおくる おねえちゃんと おとうと",
          "zh": "要去隔壁幫忙的爸媽，和目送他們的姊姊與弟弟"
        },
        "lines": [
          {
            "id": "p01-1",
            "speaker": "narrator",
            "style": "gentle evening scene",
            "ja": "ある よる、おとうさんと おかあさんは、となりの いえの びょうきの おばあさんを てつだいに いきました。",
            "zh": "有一天晚上，爸爸媽媽到隔壁，去照顧生病的鄰居奶奶。",
            "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄅㄚˋ ˙ㄅㄚ ㄇㄚ ˙ㄇㄚ ㄉㄠˋ ㄍㄜˊ ㄅㄧˋ ㄑㄩˋ ㄓㄠˋ ㄍㄨˋ ㄕㄥ ㄅㄧㄥˋ ˙ㄉㄜ ㄌㄧㄣˊ ㄐㄩ ㄋㄞˇ ˙ㄋㄞ"
          },
          {
            "id": "p01-2",
            "speaker": "mother",
            "style": "warm, caring, gentle reminder, tapping the wall twice as she speaks",
            "ja": "「この かべの むこうに いるからね。 なにか あったら、かべを にかい、トントンって たたいてね。」",
            "zh": "「我們就在這面牆的另一邊喔。有什麼事，就敲牆兩下，咚咚。」",
            "zhuyin": "ㄨㄛˇ ˙ㄇㄣ ㄐㄧㄡˋ ㄗㄞˋ ㄓㄜˋ ㄇㄧㄢˋ ㄑㄧㄤˊ ˙ㄉㄜ ㄌㄧㄥˋ ㄧ ㄅㄧㄢ ㄛ ㄧㄡˇ ㄕㄣˊ ˙ㄇㄜ ㄕˋ ㄐㄧㄡˋ ㄑㄧㄠ ㄑㄧㄤˊ ㄌㄧㄤˇ ㄒㄧㄚˋ ㄉㄨㄥ ㄉㄨㄥ"
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
          "ja": "かぜの ふく よる、まどの そとに たつ しらない ひと",
          "zh": "起風的夜晚，站在窗外的陌生人"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "quiet night, wind picking up, a little suspenseful but not scary",
            "ja": "しばらく すると、ドアを コンコンと たたく おとが しました。",
            "zh": "過了一會兒，門外傳來了叩叩叩的敲門聲。",
            "zhuyin": "ㄍㄨㄛˋ ˙ㄌㄜ ㄧ ㄏㄨㄟˋ ㄦˊ ㄇㄣˊ ㄨㄞˋ ㄔㄨㄢˊ ㄌㄞˊ ˙ㄌㄜ ㄎㄡˋ ㄎㄡˋ ㄎㄡˋ ˙ㄉㄜ ㄑㄧㄠ ㄇㄣˊ ㄕㄥ"
          },
          {
            "id": "p02-2",
            "speaker": "guest",
            "style": "sweet but slightly odd, a bit raspy, not menacing",
            "ja": "「おかあさんに たのまれて きた おばさんだよ。 ドアを あけて おくれ。」",
            "zh": "「我是你們媽媽請來的阿姨，快開門吧。」",
            "zhuyin": "ㄨㄛˇ ㄕˋ ㄋㄧˇ ˙ㄇㄣ ㄇㄚ ˙ㄇㄚ ㄑㄧㄥˇ ㄌㄞˊ ˙ㄉㄜ ㄚ ㄧˊ ㄎㄨㄞˋ ㄎㄞ ㄇㄣˊ ˙ㄅㄚ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/hu-gu-po/p03.webp",
        "alt": {
          "ja": "しまった ドアの すきまから そとを のぞく おねえちゃんと おとうと",
          "zh": "從關著的門縫偷偷往外看的姊姊和弟弟"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "narrator",
            "style": "curious, noticing a small clue, playful mystery tone",
            "ja": "ドアは しめた まま。 おねえちゃんが ほそい すきまから のぞくと、しましまの ものが ちらり。",
            "zh": "門還關著。姊姊從細細的門縫往外看：咦，有個帶條紋的東西一閃而過！",
            "zhTts": "門還關著。姐姐從細細的門縫往外看：咦，有個帶條紋的東西一閃而過！",
            "zhuyin": "ㄇㄣˊ ㄏㄞˊ ㄍㄨㄢ ˙ㄓㄜ ㄐㄧㄝˇ ˙ㄐㄧㄝ ㄘㄨㄥˊ ㄒㄧˋ ㄒㄧˋ ˙ㄉㄜ ㄇㄣˊ ㄈㄥˋ ㄨㄤˇ ㄨㄞˋ ㄎㄢˋ ㄧˊ ㄧㄡˇ ˙ㄍㄜ ㄉㄞˋ ㄊㄧㄠˊ ㄨㄣˊ ˙ㄉㄜ ㄉㄨㄥ ㄒㄧ ㄧ ㄕㄢˇ ㄦˊ ㄍㄨㄛˋ"
          },
          {
            "id": "p03-2",
            "speaker": "jie",
            "style": "whispering, thinking hard, calm",
            "ja": "「おかあさんは、だれかが くるって いって なかったよね。」",
            "zh": "「媽媽沒說有人要來呀。」",
            "zhuyin": "ㄇㄚ ˙ㄇㄚ ㄇㄟˊ ㄕㄨㄛ ㄧㄡˇ ㄖㄣˊ ㄧㄠˋ ㄌㄞˊ ˙ㄧㄚ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/hu-gu-po/p04.webp",
        "alt": {
          "ja": "ゆびを 2ほん たてて、こそこそ そうだんする おねえちゃんと おとうと",
          "zh": "比出兩根手指、小聲商量的姊姊和弟弟"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "jie",
            "style": "whispering, clever, a little worried but composed",
            "ja": "「ドアは あけちゃ だめ。 かべを にかい トントンして、おかあさんを よぼう。」",
            "zh": "「不要開門。我們敲牆兩下，叫媽媽回來。」",
            "zhuyin": "ㄅㄨˋ ㄧㄠˋ ㄎㄞ ㄇㄣˊ ㄨㄛˇ ˙ㄇㄣ ㄑㄧㄠ ㄑㄧㄤˊ ㄌㄧㄤˇ ㄒㄧㄚˋ ㄐㄧㄠˋ ㄇㄚ ˙ㄇㄚ ㄏㄨㄟˊ ㄌㄞˊ"
          },
          {
            "id": "p04-2",
            "speaker": "narrator",
            "style": "clever problem-solving, teamwork",
            "ja": "おとうとも、こくんと うなずきました。",
            "zh": "弟弟也用力點點頭。",
            "zhuyin": "ㄉㄧˋ ˙ㄉㄧ ㄧㄝˇ ㄩㄥˋ ㄌㄧˋ ㄉㄧㄢˇ ㄉㄧㄢˇ ㄊㄡˊ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/hu-gu-po/p05.webp",
        "alt": {
          "ja": "しまった ドアの そばで、かべを たたく おねえちゃんと おとうと",
          "zh": "在關好的門旁邊，一起敲牆的姊姊和弟弟"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "brave, quick action, a clear two-knock rhythm",
            "ja": "ふたりは かべを トントン！ もういちど、トントン！",
            "zh": "兩個人敲敲牆壁：咚咚！再一次，咚咚！",
            "zhuyin": "ㄌㄧㄤˇ ˙ㄍㄜ ㄖㄣˊ ㄑㄧㄠ ㄑㄧㄠ ㄑㄧㄤˊ ㄅㄧˋ ㄉㄨㄥ ㄉㄨㄥ ㄗㄞˋ ㄧ ㄘˋ ㄉㄨㄥ ㄉㄨㄥ"
          },
          {
            "id": "p05-2",
            "speaker": "guest",
            "style": "sweetly impatient, still a bit odd, not menacing",
            "ja": "「まだかい？ はやく あけて おくれよ。」",
            "zh": "「還沒好嗎？快點開門嘛。」",
            "zhuyin": "ㄏㄞˊ ㄇㄟˊ ㄏㄠˇ ˙ㄇㄚ ㄎㄨㄞˋ ㄉㄧㄢˇ ㄎㄞ ㄇㄣˊ ˙ㄇㄚ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/hu-gu-po/p06.webp",
        "alt": {
          "ja": "かべの むこうで トントンを きいた おとうさんと おかあさん",
          "zh": "在牆的另一邊聽見咚咚聲的爸爸媽媽"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "a sudden realization, hopeful",
            "ja": "かべの むこうで、おとうさんと おかあさんが トントンを ききました。",
            "zh": "在牆的另一邊，爸爸媽媽聽見了咚咚聲。",
            "zhuyin": "ㄗㄞˋ ㄑㄧㄤˊ ˙ㄉㄜ ㄌㄧㄥˋ ㄧ ㄅㄧㄢ ㄅㄚˋ ˙ㄅㄚ ㄇㄚ ˙ㄇㄚ ㄊㄧㄥ ㄐㄧㄢˋ ˙ㄌㄜ ㄉㄨㄥ ㄉㄨㄥ ㄕㄥ"
          },
          {
            "id": "p06-2",
            "speaker": "mother",
            "style": "alert, loving, hurrying",
            "ja": "「あの おとは、あいずだわ！ いそいで かえりましょう。」",
            "zh": "「是暗號！我們快回去！」",
            "zhuyin": "ㄕˋ ㄢˋ ㄏㄠˋ ㄨㄛˇ ˙ㄇㄣ ㄎㄨㄞˋ ㄏㄨㄟˊ ㄑㄩˋ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/hu-gu-po/p07.webp",
        "alt": {
          "ja": "ちょうちんを もって いそぐ ひとたちと、あかりの ついた むら",
          "zh": "提著燈籠趕來的人們，和亮起燈光的村子"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "hopeful, building relief, warm lights",
            "ja": "おとうさんと おかあさんは、ちかくの ひとたちを よび、ちょうちんを もって いそぎました。",
            "zh": "爸媽叫上附近的鄰居，大家提著燈籠趕回家。",
            "zhuyin": "ㄅㄚˋ ㄇㄚ ㄐㄧㄠˋ ㄕㄤˋ ㄈㄨˋ ㄐㄧㄣˋ ˙ㄉㄜ ㄌㄧㄣˊ ㄐㄩ ㄉㄚˋ ㄐㄧㄚ ㄊㄧˊ ˙ㄓㄜ ㄉㄥ ㄌㄨㄥˊ ㄍㄢˇ ㄏㄨㄟˊ ㄐㄧㄚ"
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
          "ja": "しましまの しっぽを だして、あわてて にげる しらない ひと",
          "zh": "露出條紋尾巴、慌慌張張逃走的陌生人"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "lively, a little comic, no danger",
            "ja": "そとに いた しらない ひとは、あかりに きづいて、あわてて にげだしました。",
            "zh": "門外的陌生人看見燈光，慌慌張張地逃走了。",
            "zhuyin": "ㄇㄣˊ ㄨㄞˋ ˙ㄉㄜ ㄇㄛˋ ㄕㄥ ㄖㄣˊ ㄎㄢˋ ㄐㄧㄢˋ ㄉㄥ ㄍㄨㄤ ㄏㄨㄤ ㄏㄨㄤ ㄓㄤ ㄓㄤ ˙ㄉㄜ ㄊㄠˊ ㄗㄡˇ ˙ㄌㄜ"
          },
          {
            "id": "p08-2",
            "speaker": "narrator",
            "style": "playful reveal, comic surprise, not scary",
            "ja": "そのとき、ふくの すそから しましまの しっぽが ぴょこん！ トラの おばさん、フーグーポーだったのです。",
            "zh": "這時候，衣服下擺突然冒出一條有條紋的尾巴——原來是虎姑婆！",
            "zhuyin": "ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄧ ㄈㄨˊ ㄒㄧㄚˋ ㄅㄞˇ ㄊㄨ ㄖㄢˊ ㄇㄠˋ ㄔㄨ ㄧ ㄊㄧㄠˊ ㄧㄡˇ ㄊㄧㄠˊ ㄨㄣˊ ˙ㄉㄜ ㄨㄟˇ ˙ㄅㄚ ㄩㄢˊ ㄌㄞˊ ㄕˋ ㄏㄨˇ ㄍㄨ ㄆㄛˊ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/hu-gu-po/p09.webp",
        "alt": {
          "ja": "かけつけた りょうしんと だきあう おねえちゃんと おとうと",
          "zh": "和趕回來的爸媽擁抱的姊姊和弟弟"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "warm homecoming, relief",
            "ja": "おとうさんと おかあさんは、ふたりを ぎゅっと だきしめました。",
            "zh": "爸爸媽媽緊緊抱住了兩個孩子。",
            "zhuyin": "ㄅㄚˋ ˙ㄅㄚ ㄇㄚ ˙ㄇㄚ ㄐㄧㄣˇ ㄐㄧㄣˇ ㄅㄠˋ ㄓㄨˋ ˙ㄌㄜ ㄌㄧㄤˇ ˙ㄍㄜ ㄏㄞˊ ˙ㄗ"
          },
          {
            "id": "p09-2",
            "speaker": "jie",
            "style": "proud but modest",
            "ja": "「ドアは あけなかったよ。」",
            "zh": "「我們沒有開門喔。」",
            "zhuyin": "ㄨㄛˇ ˙ㄇㄣ ㄇㄟˊ ㄧㄡˇ ㄎㄞ ㄇㄣˊ ㄛ"
          },
          {
            "id": "p09-3",
            "speaker": "mother",
            "style": "warm, proud, relieved",
            "ja": "「あけずに しらせて くれて、ありがとう。 ふたりとも、えらかったね。」",
            "zh": "「謝謝你們沒開門，還馬上告訴我們。你們好棒！」",
            "zhuyin": "ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ˙ㄇㄣ ㄇㄟˊ ㄎㄞ ㄇㄣˊ ㄏㄞˊ ㄇㄚˇ ㄕㄤˋ ㄍㄠˋ ㄙㄨˋ ㄨㄛˇ ˙ㄇㄣ ㄋㄧˇ ˙ㄇㄣ ㄏㄠˇ ㄅㄤˋ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/hu-gu-po/p10.webp",
        "alt": {
          "ja": "あさの ひかりの なか、かぞくの うでの なかで わらう おねえちゃんと おとうと",
          "zh": "晨光中，在家人懷裡笑著的姊姊和弟弟"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "warm closing scene, morning light",
            "ja": "つぎの あさ、おとうとは かぞくの うでの なかで にっこり しました。",
            "zh": "第二天早上，弟弟在家人懷裡笑咪咪的。",
            "zhuyin": "ㄉㄧˋ ㄦˋ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄉㄧˋ ˙ㄉㄧ ㄗㄞˋ ㄐㄧㄚ ㄖㄣˊ ㄏㄨㄞˊ ㄌㄧˇ ㄒㄧㄠˋ ㄇㄧ ㄇㄧ ˙ㄉㄜ"
          },
          {
            "id": "p10-2",
            "speaker": "di",
            "style": "happy, proud, a little sleepy",
            "ja": "「おかあさん、ぼくたちの トントン、ちゃんと きこえたんだね！」",
            "zh": "「媽媽，妳真的聽到我們敲牆了耶！」",
            "zhuyin": "ㄇㄚ ˙ㄇㄚ ㄋㄧˇ ㄓㄣ ˙ㄉㄜ ㄊㄧㄥ ㄉㄠˋ ㄨㄛˇ ˙ㄇㄣ ㄑㄧㄠ ㄑㄧㄤˊ ˙ㄌㄜ ˙ㄧㄝ"
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
            "ja": "しらない ひとが きたら、ドアを あけずに、おうちの ひとに しらせようね。",
            "zh": "陌生人來敲門的時候，先不要開門，趕快讓家人知道。",
            "zhuyin": "ㄇㄛˋ ㄕㄥ ㄖㄣˊ ㄌㄞˊ ㄑㄧㄠ ㄇㄣˊ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄒㄧㄢ ㄅㄨˋ ㄧㄠˋ ㄎㄞ ㄇㄣˊ ㄍㄢˇ ㄎㄨㄞˋ ㄖㄤˋ ㄐㄧㄚ ㄖㄣˊ ㄓ ㄉㄠˋ"
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
    "id": "qing-mi-long-she",
    "title": {
      "ja": "{青瞑龍蛇|チンミーロンジャー}",
      "zh": "青瞑龍蛇",
      "zhuyin": "ㄑㄧㄥ ㄇㄧㄥˊ ㄌㄨㄥˊ ㄕㄜˊ"
    },
    "tagline": {
      "ja": "チンミーと よばれた ヘビと、かわを よく みた こどもの おはなし",
      "zh": "被叫做「青瞑」的蛇，和用心看河的孩子"
    },
    "origin": {
      "ja": "たいなんの ちいきの でんせつ",
      "zh": "台南地方傳說"
    },
    "credit": {
      "ja": "むかしの たいなんでは、かわが よく あふれたり、ながれる ばしょを かえたり しました。 こくりつ たいわん れきしはくぶつかんは、たいこうの ひとびとが、ながれを かえる そうぶんけいを「チンミーの ヘビ」に たとえた ことを しょうかいして います。 こくりつ でんとう げいじゅつ センターに よると、きゅうすいけいには リュウが、そうぶんけいには ヘビが すみ、めが みえないから あばれるのだと かんがえられ、たいわんごで「めが みえない」という いみの「チンミー」と よばれました。 ぶんかぶの あたらしい にんぎょうげき『チンミーの リュウと ヘビは チンミーじゃない』は、「ほんとうに みえないのかな？」と といかけます。 この えほんは その といかけを もとに した あたらしい おはなしで、トンと ひなんの ばめんは この えほんの ために かんがえました。 めが みえない ことを、あばれる りゆうには しません。 ちいきの しりょうでは「{青暝|チンミー}」とも かきますが、この えほんでは にんぎょうげきの だいめいの「{青瞑|チンミー}」を つかいました。",
      "zh": "從前台南的河流常常氾濫、改道。國立臺灣歷史博物館介紹台江人如何把善變的曾文溪比作「青暝蛇」；國立傳統藝術中心則介紹，傳說急水溪住著龍、曾文溪住著蛇，人們以為牠們看不見才亂衝亂撞，就用台語叫牠們「青瞑」，也就是「看不見」的意思。文化部的新編偶戲《青瞑的龍蛇無青瞑》反問：牠們真的看不見嗎？這本繪本從這個問題出發重新編寫，阿童和避難的情節是本書新編的；本書也不把看不見當作搗亂的原因。地方資料也寫作「青暝」，本書沿用偶戲劇名的「青瞑」。"
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
            "ja": "リュウと ヘビの でんせつから うまれた、ヘビと トンの おはなしです。",
            "zh": "這是從青瞑龍蛇的傳說裡誕生的，青瞑蛇和阿童的故事。",
            "zhTts": "這是從青明龍蛇的傳說裡誕生的，青明蛇和阿童的故事。",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄘㄨㄥˊ ㄑㄧㄥ ㄇㄧㄥˊ ㄌㄨㄥˊ ㄕㄜˊ ˙ㄉㄜ ㄔㄨㄢˊ ㄕㄨㄛ ㄌㄧˇ ㄉㄢˋ ㄕㄥ ˙ㄉㄜ ㄑㄧㄥ ㄇㄧㄥˊ ㄕㄜˊ ㄏㄜˊ ㄚ ㄊㄨㄥˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
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
            "style": "gentle, introducing the hero",
            "ja": "トンは、この むらに すむ おとこのこです。",
            "zh": "阿童是住在這個村子裡的男孩。",
            "zhTts": "阿同是住在這個村子裡的男孩。",
            "zhuyin": "ㄚ ㄊㄨㄥˊ ㄕˋ ㄓㄨˋ ㄗㄞˋ ㄓㄜˋ ˙ㄍㄜ ㄘㄨㄣ ˙ㄗ ㄌㄧˇ ˙ㄉㄜ ㄋㄢˊ ㄏㄞˊ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/qing-mi-long-she/p02.webp",
        "alt": {
          "ja": "かわに すむ ヘビの はなしを する おばあさん",
          "zh": "訴說河裡的蛇的故事的奶奶"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "elder",
            "style": "warm, storytelling, matter-of-fact, not scary",
            "ja": "「この そうぶんけいには ヘビが、となりの きゅうすいけいには リュウが すんで いると いわれて いるよ。」",
            "zh": "「傳說這條曾文溪住著蛇，隔壁的急水溪住著龍喔。」",
            "zhuyin": "ㄔㄨㄢˊ ㄕㄨㄛ ㄓㄜˋ ㄊㄧㄠˊ ㄘㄥˊ ㄨㄣˊ ㄒㄧ ㄓㄨˋ ˙ㄓㄜ ㄕㄜˊ ㄍㄜˊ ㄅㄧˋ ˙ㄉㄜ ㄐㄧˊ ㄕㄨㄟˇ ㄒㄧ ㄓㄨˋ ˙ㄓㄜ ㄌㄨㄥˊ ㄛ"
          },
          {
            "id": "p02-2",
            "speaker": "elder",
            "style": "storytelling, a little wry, gentle",
            "ja": "「かわが あふれると、『チンミーの ヘビが あばれたんだ』と いう ひとも いたんだよ。」",
            "zh": "「河水氾濫的時候，有人說：『是青瞑蛇在搗亂！』」",
            "zhTts": "河水氾濫的時候，有人說：是青明蛇在搗亂！",
            "zhuyin": "ㄏㄜˊ ㄕㄨㄟˇ ㄈㄢˋ ㄌㄢˋ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄧㄡˇ ㄖㄣˊ ㄕㄨㄛ ㄕˋ ㄑㄧㄥ ㄇㄧㄥˊ ㄕㄜˊ ㄗㄞˋ ㄉㄠˇ ㄌㄨㄢˋ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/qing-mi-long-she/p03.webp",
        "alt": {
          "ja": "おだやかな かわの ヘビを とおくから みる トンと おばあさん",
          "zh": "遠遠望著平靜河裡的蛇的阿童和奶奶"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "tong",
            "style": "curious, doubtful, gentle",
            "ja": "「ほんとうに ヘビの せいなの？」",
            "zh": "「真的是蛇害的嗎？」",
            "zhuyin": "ㄓㄣ ˙ㄉㄜ ㄕˋ ㄕㄜˊ ㄏㄞˋ ˙ㄉㄜ ˙ㄇㄚ"
          },
          {
            "id": "p03-2",
            "speaker": "elder",
            "style": "wise, warm, a gentle challenge",
            "ja": "「さあ、どうだろうね。 おおあめの ひは かわに ちかづかないで、たかい おかから よく みて ごらん。」",
            "zh": "「這個嘛……下大雨的時候不要靠近河邊，站在高高的山坡上仔細看看吧。」",
            "zhuyin": "ㄓㄜˋ ˙ㄍㄜ ˙ㄇㄚ ㄒㄧㄚˋ ㄉㄚˋ ㄩˇ ˙ㄉㄜ ㄕˊ ㄏㄡˋ ㄅㄨˋ ㄧㄠˋ ㄎㄠˋ ㄐㄧㄣˋ ㄏㄜˊ ㄅㄧㄢ ㄓㄢˋ ㄗㄞˋ ㄍㄠ ㄍㄠ ˙ㄉㄜ ㄕㄢ ㄆㄛ ㄕㄤˋ ㄗˇ ㄒㄧˋ ㄎㄢˋ ˙ㄎㄢ ˙ㄅㄚ"
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
          "ja": "むらの なかから、とおくの みずじるしを みる トンと おばあさん",
          "zh": "從村子裡遠遠看著水位標記的阿童和奶奶"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "tong",
            "style": "alert, surprised, urgent but not panicked; say おばあちゃん clearly with its long あ",
            "ja": "「みずが あの しるしまで きた！ おばあちゃん、みんなに しらせて！」",
            "zh": "「水淹到那個記號了！奶奶，快告訴大家！」",
            "zhuyin": "ㄕㄨㄟˇ ㄧㄢ ㄉㄠˋ ㄋㄚˋ ˙ㄍㄜ ㄐㄧˋ ㄏㄠˋ ˙ㄌㄜ ㄋㄞˇ ˙ㄋㄞ ㄎㄨㄞˋ ㄍㄠˋ ㄙㄨˋ ㄉㄚˋ ㄐㄧㄚ"
          },
          {
            "id": "p05-2",
            "speaker": "narrator",
            "style": "calm collective action, teamwork",
            "ja": "おばあちゃんが しらせると、おとなたちは あわてず、こどもを よびあつめました。",
            "zh": "奶奶一通知，大人們不慌不忙，把孩子叫到身邊。",
            "zhuyin": "ㄋㄞˇ ˙ㄋㄞ ㄧ ㄊㄨㄥˋ ㄓ ㄉㄚˋ ㄖㄣˊ ˙ㄇㄣ ㄅㄨˋ ㄏㄨㄤ ㄅㄨˋ ㄇㄤˊ ㄅㄚˇ ㄏㄞˊ ˙ㄗ ㄐㄧㄠˋ ㄉㄠˋ ㄕㄣ ㄅㄧㄢ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/qing-mi-long-she/p06.webp",
        "alt": {
          "ja": "こどもの てを ひいて、かわから はなれた たかい おかへ むかう むらびと",
          "zh": "牽著孩子、往遠離河邊的高坡走去的村民"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "cooperative, calm, practical",
            "ja": "おとなは こどもの てを ひいて、むらの うらの たかい おかへ むかいました。",
            "zh": "大人牽著孩子的手，往村子後面的高坡走去。",
            "zhuyin": "ㄉㄚˋ ㄖㄣˊ ㄑㄧㄢ ˙ㄓㄜ ㄏㄞˊ ˙ㄗ ˙ㄉㄜ ㄕㄡˇ ㄨㄤˇ ㄘㄨㄣ ˙ㄗ ㄏㄡˋ ㄇㄧㄢˋ ˙ㄉㄜ ㄍㄠ ㄆㄛ ㄗㄡˇ ㄑㄩˋ"
          },
          {
            "id": "p06-2",
            "speaker": "narrator",
            "style": "warm teamwork, reassuring",
            "ja": "むらの ひとは なまえを よびあい、みんな いるか たしかめました。",
            "zh": "村民們互相點名，確認大家都到了。",
            "zhuyin": "ㄘㄨㄣ ㄇㄧㄣˊ ˙ㄇㄣ ㄏㄨˋ ㄒㄧㄤ ㄉㄧㄢˇ ㄇㄧㄥˊ ㄑㄩㄝˋ ㄖㄣˋ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄉㄠˋ ˙ㄌㄜ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/qing-mi-long-she/p07.webp",
        "alt": {
          "ja": "たかい おかから、あたらしい みちへ ながれる みずと、その あとを おう ヘビを みる トンと おばあさん",
          "zh": "從高坡上，看著河水流向新路、蛇跟在後面游的阿童和奶奶"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "respectful distance, wonder, not fearful",
            "ja": "おかの うえから みると、みずが あたらしい みちへ ながれだし、とおくの ヘビが その あとを おって いきました。",
            "zh": "從山坡上往下看，河水先流向新的地方，遠遠的蛇跟著水流游過去。",
            "zhuyin": "ㄘㄨㄥˊ ㄕㄢ ㄆㄛ ㄕㄤˋ ㄨㄤˇ ㄒㄧㄚˋ ㄎㄢˋ ㄏㄜˊ ㄕㄨㄟˇ ㄒㄧㄢ ㄌㄧㄡˊ ㄒㄧㄤˋ ㄒㄧㄣ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄩㄢˇ ㄩㄢˇ ˙ㄉㄜ ㄕㄜˊ ㄍㄣ ˙ㄓㄜ ㄕㄨㄟˇ ㄌㄧㄡˊ ㄧㄡˊ ㄍㄨㄛˋ ㄑㄩˋ"
          },
          {
            "id": "p07-2",
            "speaker": "tong",
            "style": "excited discovery, amazed",
            "ja": "「みて！ さきに うごいたのは みずだよ。 ヘビは ついて いった だけ！」",
            "zh": "「你看！是河水先改道，蛇只是跟著游過去！」",
            "zhuyin": "ㄋㄧˇ ㄎㄢˋ ㄕˋ ㄏㄜˊ ㄕㄨㄟˇ ㄒㄧㄢ ㄍㄞˇ ㄉㄠˋ ㄕㄜˊ ㄓˇ ㄕˋ ㄍㄣ ˙ㄓㄜ ㄧㄡˊ ㄍㄨㄛˋ ㄑㄩˋ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/qing-mi-long-she/p08.webp",
        "alt": {
          "ja": "あめが あがり、かわの あたらしい みちを ちずに かく トンと むらびと",
          "zh": "雨過天晴，和村民一起把河流新路線畫進地圖的阿童"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "relief, calm resolution, no disaster spectacle",
            "ja": "あめが やむと、かわは まえと ちがう ところを、おだやかに ながれて いました。",
            "zh": "雨停之後，河水改走了新的路，平靜地流著。",
            "zhuyin": "ㄩˇ ㄊㄧㄥˊ ㄓ ㄏㄡˋ ㄏㄜˊ ㄕㄨㄟˇ ㄍㄞˇ ㄗㄡˇ ˙ㄌㄜ ㄒㄧㄣ ˙ㄉㄜ ㄌㄨˋ ㄆㄧㄥˊ ㄐㄧㄥˋ ˙ㄉㄜ ㄌㄧㄡˊ ˙ㄓㄜ"
          },
          {
            "id": "p08-2",
            "speaker": "narrator",
            "style": "practical, communal, a little proud",
            "ja": "トンは みんなと、かわの あたらしい みちと、おかへ にげる みちを ちずに かきました。",
            "zh": "阿童和大家把河流的新路線，和逃到高坡的路，都畫在地圖上。",
            "zhuyin": "ㄚ ㄊㄨㄥˊ ㄏㄜˊ ㄉㄚˋ ㄐㄧㄚ ㄅㄚˇ ㄏㄜˊ ㄌㄧㄡˊ ˙ㄉㄜ ㄒㄧㄣ ㄌㄨˋ ㄒㄧㄢˋ ㄏㄜˊ ㄊㄠˊ ㄉㄠˋ ㄍㄠ ㄆㄛ ˙ㄉㄜ ㄌㄨˋ ㄉㄡ ㄏㄨㄚˋ ㄗㄞˋ ㄉㄧˋ ㄊㄨˊ ㄕㄤˋ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/qing-mi-long-she/p09.webp",
        "alt": {
          "ja": "たかい おかの うえから、しずかな かわで やすむ ヘビに はなしかける トン",
          "zh": "從高坡上，對著平靜河裡休息的蛇說話的阿童"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "peaceful, warm",
            "ja": "ヘビは また、かわの なかで しずかに やすんで います。",
            "zh": "蛇又在河裡靜靜地休息了。",
            "zhuyin": "ㄕㄜˊ ㄧㄡˋ ㄗㄞˋ ㄏㄜˊ ㄌㄧˇ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄒㄧㄡ ㄒㄧˊ ˙ㄌㄜ"
          },
          {
            "id": "p09-2",
            "speaker": "tong",
            "style": "warm, a little sorry, gentle",
            "ja": "「ヘビさん、あばれて なんか いなかったんだね。」",
            "zh": "「大蛇呀，原來你沒有搗亂呢。」",
            "zhuyin": "ㄉㄚˋ ㄕㄜˊ ˙ㄧㄚ ㄩㄢˊ ㄌㄞˊ ㄋㄧˇ ㄇㄟˊ ㄧㄡˇ ㄉㄠˇ ㄌㄨㄢˋ ˙ㄋㄜ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/qing-mi-long-she/p10.webp",
        "alt": {
          "ja": "ゆうやけの かわを ながめる おばあさんと トン",
          "zh": "望著夕陽下河流的奶奶和阿童"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "tong",
            "style": "thoughtful, understanding",
            "ja": "「おばあちゃん、かわが あふれたのは、ヘビの せいじゃ なかったよ。」",
            "zh": "「奶奶，淹大水不是蛇害的喔。」",
            "zhuyin": "ㄋㄞˇ ˙ㄋㄞ ㄧㄢ ㄉㄚˋ ㄕㄨㄟˇ ㄅㄨˋ ㄕˋ ㄕㄜˊ ㄏㄞˋ ˙ㄉㄜ ㄛ"
          },
          {
            "id": "p10-2",
            "speaker": "elder",
            "style": "gentle, wise, passing down knowledge",
            "ja": "「そうだね。 だれかの せいに しないで、かわの ようすを よく みて いようね。」",
            "zh": "「是啊，不怪誰，我們好好看著河流吧。」",
            "zhuyin": "ㄕˋ ˙ㄚ ㄅㄨˋ ㄍㄨㄞˋ ㄕㄟˊ ㄨㄛˇ ˙ㄇㄣ ㄏㄠˇ ㄏㄠˇ ㄎㄢˋ ˙ㄓㄜ ㄏㄜˊ ㄌㄧㄡˊ ˙ㄅㄚ"
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
            "style": "gentle, warm, a quiet close",
            "ja": "ゆうぐれの むらに あかりが ともりました。 かわは きょうも、しずかに ながれて います。",
            "zh": "黃昏的村子亮起了燈，河水今天也靜靜地流著。",
            "zhuyin": "ㄏㄨㄤˊ ㄏㄨㄣ ˙ㄉㄜ ㄘㄨㄣ ˙ㄗ ㄌㄧㄤˋ ㄑㄧˇ ˙ㄌㄜ ㄉㄥ ㄏㄜˊ ㄕㄨㄟˇ ㄐㄧㄣ ㄊㄧㄢ ㄧㄝˇ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄌㄧㄡˊ ˙ㄓㄜ"
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
    "id": "a-la-ba-nai",
    "title": {
      "ja": "アラパナイの いし",
      "zh": "阿拉巴耐的石頭",
      "zhuyin": "ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ˙ㄉㄜ ㄕˊ ㄊㄡˊ"
    },
    "tagline": {
      "ja": "たいとうの うみべで、せんぞを おもう ふねを むかえる おはなし",
      "zh": "在台東海邊，迎接一艘紀念祖先的船"
    },
    "origin": {
      "ja": "マーラン・アミぞくの ぎょうじを もとに した おはなし",
      "zh": "以馬蘭阿美族紀念祖先的活動為背景的故事"
    },
    "credit": {
      "ja": "アラパナイ（Arapanay）は、たいとうの みなみの うみべに ある ばしょです。 じゆうじほうと れんごうしんぶん（2026ねん）は、むかし アミの ひとびとが ホウチュンから きたへ、うみべを あるき、やまを こえ、ほかけぶねに のって たびを して、アラパナイで ひとやすみした と つたえられて いる こと、そして マーラン・アミぞくが ここで、かりた アミの ほかけぶねを うみから むかえて きしへ ひきあげ、うみで とれた さかなや かいを せんぞと わけあう ぎょうじを した ことを つたえて います。 たいわん げんじゅうみんぞく じてんに よると、みなみの アミぞくの おおくは アラパナイを はじまりの ばしょと して いて、マーラン・アミには いしから せんぞが うまれた という おはなしも あります。 ホウチュン・アミぞくや プユマぞくにも この あたりに まつわる それぞれの おはなしが あり、ほかの アミの むらには また ちがう はじまりの おはなしが あります。 おとこのこと かぞくの ばめんや ことばは、この えほんの ために かんがえました。",
      "zh": "阿拉巴耐（Arapanay）位在台東南邊的海岸。《自由時報》和《聯合報》（2026年）報導，相傳阿美族人從恆春一路向北，沿海踏浪、翻山越嶺或乘坐風帆，來到阿拉巴耐歇腳；馬蘭阿美族在這裡借來傳統阿美族帆船從海上迎進登陸點，族人一起把船拉上岸，並把海裡捕到的魚貝和祖靈分享。《臺灣原住民族事典》則提到，南部阿美族大多以阿拉巴耐為發祥地，馬蘭阿美也有祖先從石頭誕生的傳說；恆春阿美族和卑南族也各有與這一帶相關的故事，其他阿美族部落則流傳著不同的起源故事。男孩和家人的情節與對話，是這本繪本為小朋友新編的。"
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
            "ja": "うみべの おおきな いしの そばで、おとこのこが きいた おはなしです。",
            "zh": "這是一個男孩在海邊大石頭旁聽到的故事。",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄧ ˙ㄍㄜ ㄋㄢˊ ㄏㄞˊ ㄗㄞˋ ㄏㄞˇ ㄅㄧㄢ ㄉㄚˋ ㄕˊ ㄊㄡˊ ㄆㄤˊ ㄊㄧㄥ ㄉㄠˋ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/a-la-ba-nai/p01.webp",
        "alt": {
          "ja": "おおきな いしの ならぶ、しずかな うみべ",
          "zh": "大石頭散落的安靜海邊"
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
            "ja": "なみの おとが きこえる、いしの ごろごろした うみべです。",
            "zh": "那是一片聽得見海浪聲、到處都是石頭的海邊。",
            "zhuyin": "ㄋㄚˋ ㄕˋ ㄧ ㄆㄧㄢˋ ㄊㄧㄥ ˙ㄉㄜ ㄐㄧㄢˋ ㄏㄞˇ ㄌㄤˋ ㄕㄥ ㄉㄠˋ ㄔㄨˋ ㄉㄡ ㄕˋ ㄕˊ ㄊㄡˊ ˙ㄉㄜ ㄏㄞˇ ㄅㄧㄢ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/a-la-ba-nai/p02.webp",
        "alt": {
          "ja": "かぞくと いっしょに うみべの みちを あるく おとこのこ",
          "zh": "和家人一起走在海邊小路上的男孩"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "gentle morning, a family outing",
            "ja": "ある あさ、マーラン・アミの おとこのこが、かぞくと いっしょに アラパナイへ やって きました。",
            "zh": "有一天早上，一個馬蘭阿美族的男孩，和家人一起來到阿拉巴耐。",
            "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄧ ˙ㄍㄜ ㄇㄚˇ ㄌㄢˊ ㄚ ㄇㄟˇ ㄗㄨˊ ˙ㄉㄜ ㄋㄢˊ ㄏㄞˊ ㄏㄜˊ ㄐㄧㄚ ㄖㄣˊ ㄧ ㄑㄧˇ ㄌㄞˊ ㄉㄠˋ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ"
          },
          {
            "id": "p02-2",
            "speaker": "tong",
            "style": "curious, bright",
            "ja": "「おばあちゃん、どうして きょうは みんな ここに くるの？」",
            "zh": "「奶奶，今天大家為什麼都來這裡呀？」",
            "zhuyin": "ㄋㄞˇ ˙ㄋㄞ ㄐㄧㄣ ㄊㄧㄢ ㄉㄚˋ ㄐㄧㄚ ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ㄉㄡ ㄌㄞˊ ㄓㄜˋ ㄌㄧˇ ˙ㄧㄚ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/a-la-ba-nai/p03.webp",
        "alt": {
          "ja": "うみべで、おばあさんの はなしを きく こどもたち",
          "zh": "在海邊聽奶奶說話的孩子們"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "elder",
            "style": "warm, proud, quiet reverence",
            "ja": "「ここはね、むかし せんぞたちが ながい たびの とちゅうで、ひとやすみしたと つたえられて いる ばしょなんだよ。」",
            "zh": "「這裡呀，傳說是很久以前祖先們長途旅行時，停下來休息的地方喔。」",
            "zhuyin": "ㄓㄜˋ ㄌㄧˇ ˙ㄧㄚ ㄔㄨㄢˊ ㄕㄨㄛ ㄕˋ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄗㄨˇ ㄒㄧㄢ ˙ㄇㄣ ㄓㄤˇ ㄊㄨˊ ㄌㄩˇ ㄒㄧㄥˊ ㄕˊ ㄊㄧㄥˊ ㄒㄧㄚˋ ㄌㄞˊ ㄒㄧㄡ ㄒㄧˊ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄛ"
          },
          {
            "id": "p03-2",
            "speaker": "elder",
            "style": "gentle, warm",
            "ja": "「きょうは ふねを むかえて、その ことを みんなで おもいだすんだよ。」",
            "zh": "「今天大家迎接船，就是為了一起記得這件事。」",
            "zhuyin": "ㄐㄧㄣ ㄊㄧㄢ ㄉㄚˋ ㄐㄧㄚ ㄧㄥˊ ㄐㄧㄝ ㄔㄨㄢˊ ㄐㄧㄡˋ ㄕˋ ㄨㄟˋ ˙ㄌㄜ ㄧ ㄑㄧˇ ㄐㄧˋ ˙ㄉㄜ ㄓㄜˋ ㄐㄧㄢˋ ㄕˋ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/a-la-ba-nai/p04.webp",
        "alt": {
          "ja": "うみべに あつまった としよりたち",
          "zh": "聚在海邊的長輩們"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "tong",
            "style": "thoughtful, warm, making a small promise to himself",
            "ja": "「おうちで まってる おとうとにも、おしえて あげたいな。」",
            "zh": "「真想說給在家的弟弟聽。」",
            "zhuyin": "ㄓㄣ ㄒㄧㄤˇ ㄕㄨㄛ ㄍㄟˇ ㄗㄞˋ ㄐㄧㄚ ˙ㄉㄜ ㄉㄧˋ ˙ㄉㄧ ㄊㄧㄥ"
          },
          {
            "id": "p04-2",
            "speaker": "narrator",
            "style": "hushed anticipation",
            "ja": "うみべには としよりたちも あつまって、みんな うみの ほうを みて います。",
            "zh": "海邊，長輩們也聚在一起，大家都望著大海。",
            "zhuyin": "ㄏㄞˇ ㄅㄧㄢ ㄓㄤˇ ㄅㄟˋ ˙ㄇㄣ ㄧㄝˇ ㄐㄩˋ ㄗㄞˋ ㄧ ㄑㄧˇ ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄨㄤˋ ˙ㄓㄜ ㄉㄚˋ ㄏㄞˇ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/a-la-ba-nai/p05.webp",
        "alt": {
          "ja": "おきから ちかづいて くる ほかけぶねと、きしで まつ ひとびと",
          "zh": "從海上靠近的帆船，和在岸邊等待的人們"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "gentle excitement, something appearing far away",
            "ja": "すると、おきの ほうから、ほを はった ふねが ちかづいて きました。",
            "zh": "這時候，遠遠的海上，一艘揚著帆的船慢慢靠近。",
            "zhuyin": "ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄩㄢˇ ㄩㄢˇ ˙ㄉㄜ ㄏㄞˇ ㄕㄤˋ ㄧ ㄙㄠ ㄧㄤˊ ˙ㄓㄜ ㄈㄢˊ ˙ㄉㄜ ㄔㄨㄢˊ ㄇㄢˋ ㄇㄢˋ ㄎㄠˋ ㄐㄧㄣˋ"
          },
          {
            "id": "p05-2",
            "speaker": "tong",
            "style": "excited, delighted",
            "ja": "「ふねだ！ みんなで むかえよう！」",
            "zh": "「船來了！我們一起迎接吧！」",
            "zhuyin": "ㄔㄨㄢˊ ㄌㄞˊ ˙ㄌㄜ ㄨㄛˇ ˙ㄇㄣ ㄧ ㄑㄧˇ ㄧㄥˊ ㄐㄧㄝ ˙ㄅㄚ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/a-la-ba-nai/p06.webp",
        "alt": {
          "ja": "おとなたちが つなで ふねを きしへ ひきあげ、こどもたちが はなれて おうえんする",
          "zh": "大人們用繩子把船拉上岸，孩子們在遠處加油"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "communal effort, warmth, rhythm",
            "ja": "ふねが きしに つくと、おとなたちが つなを ひいて、ふねを きしへ ひきあげました。",
            "zh": "船一靠岸，大人們拉著繩子，把船拉上了岸。",
            "zhuyin": "ㄔㄨㄢˊ ㄧ ㄎㄠˋ ㄢˋ ㄉㄚˋ ㄖㄣˊ ˙ㄇㄣ ㄌㄚ ˙ㄓㄜ ㄕㄥˊ ˙ㄗ ㄅㄚˇ ㄔㄨㄢˊ ㄌㄚ ㄕㄤˋ ˙ㄌㄜ ㄢˋ"
          },
          {
            "id": "p06-2",
            "speaker": "tong",
            "style": "cheering from a safe distance, bright",
            "ja": "「がんばれ！ よいしょ、よいしょ！」",
            "zh": "「加油！嘿咻，嘿咻！」",
            "zhuyin": "ㄐㄧㄚ ㄧㄡˊ ㄏㄟ ㄒㄧㄡ ㄏㄟ ㄒㄧㄡ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/a-la-ba-nai/p07.webp",
        "alt": {
          "ja": "うみで とれた さかなや かいを かごに いれる おとなたちと、みまもる おとこのこ",
          "zh": "把海裡捕來的魚貝放進籃子的大人，和在一旁看著的男孩"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "quiet, respectful",
            "ja": "おとなたちは、うみで とれた さかなや かいを、せんぞにも わけました。",
            "zh": "大人們把海裡捕來的魚和貝類，也分給了祖先。",
            "zhuyin": "ㄉㄚˋ ㄖㄣˊ ˙ㄇㄣ ㄅㄚˇ ㄏㄞˇ ㄌㄧˇ ㄅㄨˇ ㄌㄞˊ ˙ㄉㄜ ㄩˊ ㄏㄜˊ ㄅㄟˋ ㄌㄟˋ ㄧㄝˇ ㄈㄣ ㄍㄟˇ ˙ㄌㄜ ㄗㄨˇ ㄒㄧㄢ"
          },
          {
            "id": "p07-2",
            "speaker": "elder",
            "style": "warm, gentle, softly explaining",
            "ja": "「せんぞの ことを わすれて いないよって、つたえて いるんだよ。」",
            "zh": "「這是在告訴祖先，我們沒有忘記他們喔。」",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄗㄞˋ ㄍㄠˋ ㄙㄨˋ ㄗㄨˇ ㄒㄧㄢ ㄨㄛˇ ˙ㄇㄣ ㄇㄟˊ ㄧㄡˇ ㄨㄤˋ ㄐㄧˋ ㄊㄚ ˙ㄇㄣ ㄛ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/a-la-ba-nai/p08.webp",
        "alt": {
          "ja": "うみを みおろす おおきな いし",
          "zh": "望著大海的大石頭"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "quiet wonder",
            "ja": "おとこのこは、おおきな いしを みあげました。",
            "zh": "男孩抬頭望著大石頭。",
            "zhuyin": "ㄋㄢˊ ㄏㄞˊ ㄊㄞˊ ㄊㄡˊ ㄨㄤˋ ˙ㄓㄜ ㄉㄚˋ ㄕˊ ㄊㄡˊ"
          },
          {
            "id": "p08-2",
            "speaker": "tong",
            "style": "soft, wondering",
            "ja": "「おばあちゃん、せんぞの はじまりの おはなしも あるの？」",
            "zh": "「奶奶，也有祖先最早的故事嗎？」",
            "zhuyin": "ㄋㄞˇ ˙ㄋㄞ ㄧㄝˇ ㄧㄡˇ ㄗㄨˇ ㄒㄧㄢ ㄗㄨㄟˋ ㄗㄠˇ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ˙ㄇㄚ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/a-la-ba-nai/p09.webp",
        "alt": {
          "ja": "いしの ちかくに すわって なみの おとを きく おとこのこと おばあさん",
          "zh": "坐在石頭附近聽海浪聲的男孩和奶奶"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "elder",
            "style": "soft, storytelling, a little mysterious",
            "ja": "「わたしたちにはね、はじめの せんぞが いしから うまれたって おはなしが あるんだよ。」",
            "zh": "「我們流傳著一個故事：最早的祖先，是從石頭裡誕生的喔。」",
            "zhuyin": "ㄨㄛˇ ˙ㄇㄣ ㄌㄧㄡˊ ㄔㄨㄢˊ ˙ㄓㄜ ㄧ ˙ㄍㄜ ㄍㄨˋ ㄕˋ ㄗㄨㄟˋ ㄗㄠˇ ˙ㄉㄜ ㄗㄨˇ ㄒㄧㄢ ㄕˋ ㄘㄨㄥˊ ㄕˊ ㄊㄡˊ ㄌㄧˇ ㄉㄢˋ ㄕㄥ ˙ㄉㄜ ㄛ"
          },
          {
            "id": "p09-2",
            "speaker": "narrator",
            "style": "quiet, tactile, memory-making",
            "ja": "おとこのこは なみの おとを ききながら、アラパナイの なまえを おぼえました。",
            "zh": "男孩一邊聽著海浪聲，一邊記住了「阿拉巴耐」這個名字。",
            "zhuyin": "ㄋㄢˊ ㄏㄞˊ ㄧ ㄅㄧㄢ ㄊㄧㄥ ˙ㄓㄜ ㄏㄞˇ ㄌㄤˋ ㄕㄥ ㄧ ㄅㄧㄢ ㄐㄧˋ ㄓㄨˋ ˙ㄌㄜ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ㄓㄜˋ ˙ㄍㄜ ㄇㄧㄥˊ ㄗˋ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/a-la-ba-nai/p10.webp",
        "alt": {
          "ja": "いえで おとうとに おはなしを する おとこのこ",
          "zh": "在家裡說故事給弟弟聽的男孩"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "reflective, warm continuity",
            "ja": "いえに かえると、おとこのこは おとうとに はなしました。",
            "zh": "回到家，男孩說給弟弟聽。",
            "zhuyin": "ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄋㄢˊ ㄏㄞˊ ㄕㄨㄛ ㄍㄟˇ ㄉㄧˋ ˙ㄉㄧ ㄊㄧㄥ"
          },
          {
            "id": "p10-2",
            "speaker": "tong",
            "style": "proud, gentle, passing it on",
            "ja": "「きょう、アラパナイで ふねを むかえたよ。 はじめの せんぞは いしから うまれたって、おばあちゃんが いってた！」",
            "zh": "「今天我們在阿拉巴耐迎接了船喔！奶奶還說，最早的祖先是從石頭裡誕生的！」",
            "zhuyin": "ㄐㄧㄣ ㄊㄧㄢ ㄨㄛˇ ˙ㄇㄣ ㄗㄞˋ ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ㄧㄥˊ ㄐㄧㄝ ˙ㄌㄜ ㄔㄨㄢˊ ㄛ ㄋㄞˇ ˙ㄋㄞ ㄏㄞˊ ㄕㄨㄛ ㄗㄨㄟˋ ㄗㄠˇ ˙ㄉㄜ ㄗㄨˇ ㄒㄧㄢ ㄕˋ ㄘㄨㄥˊ ㄕˊ ㄊㄡˊ ㄌㄧˇ ㄉㄢˋ ㄕㄥ ˙ㄉㄜ"
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
            "style": "gentle, respectful closing",
            "ja": "アラパナイの いしは、きょうも しずかに うみを みて います。",
            "zh": "阿拉巴耐的石頭，今天也靜靜地望著大海。",
            "zhuyin": "ㄚ ㄌㄚ ㄅㄚ ㄋㄞˋ ˙ㄉㄜ ㄕˊ ㄊㄡˊ ㄐㄧㄣ ㄊㄧㄢ ㄧㄝˇ ㄐㄧㄥˋ ㄐㄧㄥˋ ˙ㄉㄜ ㄨㄤˋ ˙ㄓㄜ ㄉㄚˋ ㄏㄞˇ"
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
