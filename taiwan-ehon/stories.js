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
      "ja": "みんなで あるく マズさまの みち",
      "zh": "一路同行的媽祖",
      "zhuyin": "ㄧ ㄌㄨˋ ㄊㄨㄥˊ ㄒㄧㄥˊ ˙ㄉㄜ ㄇㄚ ㄗㄨˇ"
    },
    "tagline": {
      "ja": "たいちゅう ターチャの マズさまが あるく、ながい たびの おはなし",
      "zh": "大甲媽祖遶境進香的故事"
    },
    "origin": {
      "ja": "たいわん ターチャの まつりに つたわる、マズさまの たびの おはなし",
      "zh": "台灣大甲鎮瀾宮的媽祖遶境進香習俗"
    },
    "credit": {
      "ja": "これは、たいわん ターチャに いまも つづく マズさまの おまつり（ぎょうれつの たび）の おはなしです。 みちすじや にっすうは とし・ちいきに よって ちがい、しんじる きもちは ひとそれぞれです。 この えほんは こどもむけに やさしく かきなおしました。",
      "zh": "這是台灣大甲，至今仍在進行的媽祖遶境進香（隨行遊行）的故事。路線和天數，因年份和地方而不同，信仰的心情也因人而異。這本繪本為小朋友重新改寫。"
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
          "ja": "はたを もって、ぎょうれつの じゅんびを する ひとびと",
          "zh": "拿著旗子、準備遶境隊伍的人們"
        },
        "lines": [
          {
            "id": "cover-1",
            "speaker": "narrator",
            "style": "warm, inviting storyteller opening a picture book",
            "ja": "たいわん ターチャに つたわる おはなし『みんなで あるく マズさまの みち』",
            "jaTts": "たいわんの、ターチャに つたわる おはなし。みんなで あるく、マズさまの みち。",
            "zh": "台灣大甲的故事〈一路同行的媽祖〉",
            "zhuyin": "ㄊㄞˊ ㄨㄢ ㄉㄚˋ ㄐㄧㄚˇ ˙ㄉㄜ ㄍㄨˋ ㄕˋ ㄧ ㄌㄨˋ ㄊㄨㄥˊ ㄒㄧㄥˊ ˙ㄉㄜ ㄇㄚ ㄗㄨˇ"
          },
          {
            "id": "cover-2",
            "speaker": "narrator",
            "style": "warm, gentle, community feeling",
            "ja": "たびの みちを、みんなで あるいて いく おはなしです。",
            "zh": "這是大家一起走一段長長旅程的故事。",
            "zhuyin": "ㄓㄜˋ ㄕˋ ㄉㄚˋ ㄐㄧㄚ ㄧ ㄑㄧˇ ㄗㄡˇ ㄧ ㄉㄨㄢˋ ㄔㄤˊ ㄔㄤˊ ㄌㄩˇ ㄔㄥˊ ˙ㄉㄜ ㄍㄨˋ ㄕˋ"
          }
        ]
      },
      {
        "id": "p01",
        "image": "images/dajia-mazu-pilgrimage/p01.webp",
        "alt": {
          "ja": "おてらの まえで はたと ちずを じゅんびする ひとびと",
          "zh": "在廟前準備旗子和地圖的人們"
        },
        "lines": [
          {
            "id": "p01-1",
            "speaker": "narrator",
            "style": "busy, cheerful preparation",
            "ja": "たいちゅう ターチャの おてらの まえで、みんなは はたや ちずや もちものを じゅんび して いました。",
            "jaTts": "たいちゅうし、ターチャの おてらの まえで、みんなは はたや ちずや もちものを じゅんび して いました。",
            "zh": "台中大甲的廟前，大家忙著整理旗子、地圖和隨身用品。",
            "zhuyin": "ㄊㄞˊ ㄓㄨㄥ ㄉㄚˋ ㄐㄧㄚˇ ˙ㄉㄜ ㄇㄧㄠˋ ㄑㄧㄢˊ ㄉㄚˋ ㄐㄧㄚ ㄇㄤˊ ˙ㄓㄜ ㄓㄥˇ ㄌㄧˇ ㄑㄧˊ ˙ㄗ ㄉㄧˋ ㄊㄨˊ ㄏㄢˋ ㄙㄨㄟˊ ㄕㄣ ㄩㄥˋ ㄆㄧㄣˇ"
          }
        ]
      },
      {
        "id": "p02",
        "image": "images/dajia-mazu-pilgrimage/p02.webp",
        "alt": {
          "ja": "しんこうしゃに かこまれて すすむ、マズさまの みこし",
          "zh": "被信眾圍繞、緩緩前行的媽祖神轎"
        },
        "lines": [
          {
            "id": "p02-1",
            "speaker": "narrator",
            "style": "solemn, respectful, a procession beginning",
            "ja": "ぎょうれつが しゅっぱつしました。 しんじる ひとたちは、みこしの よこを うやうやしく あるきます。",
            "jaTts": "ぎょうれつが、しゅっぱつしました。 しんじる ひとたちは、みこしの よこを、うやうやしく あるきます。",
            "zh": "隊伍出發了，信眾恭敬地走在神轎的旁邊。",
            "zhuyin": "ㄉㄨㄟˋ ㄨˇ ㄔㄨ ㄈㄚ ˙ㄌㄜ ㄒㄧㄣˋ ㄓㄨㄥˋ ㄍㄨㄥ ㄐㄧㄥˋ ˙ㄉㄜ ㄗㄡˇ ㄗㄞˋ ㄕㄣˊ ㄐㄧㄠˋ ˙ㄉㄜ ㄆㄤˊ ㄅㄧㄢ"
          }
        ]
      },
      {
        "id": "p03",
        "image": "images/dajia-mazu-pilgrimage/p03.webp",
        "alt": {
          "ja": "てを ふる みちばたの ひとびとと、まちを すすむ ぎょうれつ",
          "zh": "揮手的路人，和走過街道的隊伍"
        },
        "lines": [
          {
            "id": "p03-1",
            "speaker": "narrator",
            "style": "warm, neighborly, everyday streets",
            "ja": "みちばたの ひとたちが てを ふり、ぎょうれつは まちを ゆっくり すすんで いきました。",
            "zh": "路邊的人揮著手，隊伍慢慢穿過熟悉的街道。",
            "zhuyin": "ㄌㄨˋ ㄅㄧㄢ ˙ㄉㄜ ㄖㄣˊ ㄏㄨㄟ ˙ㄓㄜ ㄕㄡˇ ㄉㄨㄟˋ ㄨˇ ㄇㄢˋ ㄇㄢˋ ㄔㄨㄢ ㄍㄨㄛˋ ㄕㄨˊ ㄒㄧ ˙ㄉㄜ ㄐㄧㄝ ㄉㄠˋ"
          }
        ]
      },
      {
        "id": "p04",
        "image": "images/dajia-mazu-pilgrimage/p04.webp",
        "alt": {
          "ja": "みずを くばり、ひかげを すすめる ボランティアの ひと",
          "zh": "遞水、提醒大家找陰涼處的志工"
        },
        "lines": [
          {
            "id": "p04-1",
            "speaker": "narrator",
            "style": "hot, caring, thoughtful",
            "ja": "ひざしが つよく なると、ボランティアの ひとが みずを くばって くれました。",
            "zh": "太陽變熱了，志工遞上水給大家喝。",
            "zhuyin": "ㄊㄞˋ ㄧㄤˊ ㄅㄧㄢˋ ㄖㄜˋ ˙ㄌㄜ ㄓˋ ㄍㄨㄥ ㄉㄧˋ ㄕㄤˋ ㄕㄨㄟˇ ㄍㄟˇ ㄉㄚˋ ㄐㄧㄚ ㄏㄜ"
          },
          {
            "id": "p04-2",
            "speaker": "elder",
            "style": "kind, warm village aunty, gently caring",
            "ja": "「ひかげで ひとやすみ、しませんか。」",
            "zh": "「來陰涼處歇一會兒吧。」",
            "zhuyin": "ㄌㄞˊ ㄧㄣ ㄌㄧㄤˊ ㄔㄨˋ ㄒㄧㄝ ㄧ ㄏㄨㄟˋ ㄦˊ ˙ㄅㄚ"
          }
        ]
      },
      {
        "id": "p05",
        "image": "images/dajia-mazu-pilgrimage/p05.webp",
        "alt": {
          "ja": "あしを とめた としよりの じゅんぱいしゃと、そばに よりそう ひとびと",
          "zh": "停下腳步的年長香客，和陪在身邊的同行人"
        },
        "lines": [
          {
            "id": "p05-1",
            "speaker": "narrator",
            "style": "gentle, patient companionship",
            "ja": "あるくのが ゆっくりな としよりが あしを とめると、いっしょに いた ひとたちも しばらく やすみました。",
            "zh": "一位走得慢的長者停下腳步，同行的人也陪他歇一會兒。",
            "zhuyin": "ㄧ ㄨㄟˋ ㄗㄡˇ ˙ㄉㄜ ㄇㄢˋ ˙ㄉㄜ ㄓㄤˇ ㄓㄜˇ ㄊㄧㄥˊ ㄒㄧㄚˋ ㄐㄧㄠˇ ㄅㄨˋ ㄊㄨㄥˊ ㄒㄧㄥˊ ˙ㄉㄜ ㄖㄣˊ ㄧㄝˇ ㄆㄟˊ ㄊㄚ ㄒㄧㄝ ㄧ ㄏㄨㄟˋ ㄦˊ"
          }
        ]
      },
      {
        "id": "p06",
        "image": "images/dajia-mazu-pilgrimage/p06.webp",
        "alt": {
          "ja": "たんぼや はしを こえて すすみ、あいさつを かわす ひとびと",
          "zh": "走過田野和橋樑，互相問候的人們"
        },
        "lines": [
          {
            "id": "p06-1",
            "speaker": "narrator",
            "style": "steady walking rhythm, neighborly",
            "ja": "たんぼや はしや まちを とおり、みちすがら みんなで あいさつを かわしました。",
            "zh": "大家走過田野、橋樑和城鎮，在路上互相問候。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄗㄡˇ ㄍㄨㄛˋ ㄊㄧㄢˊ ㄧㄝˇ ㄑㄧㄠˊ ㄌㄧㄤˊ ㄏㄢˋ ㄔㄥˊ ㄓㄣˋ ㄗㄞˋ ㄌㄨˋ ㄕㄤˋ ㄏㄨˋ ㄒㄧㄤ ㄨㄣˋ ㄏㄡˋ"
          }
        ]
      },
      {
        "id": "p07",
        "image": "images/dajia-mazu-pilgrimage/p07.webp",
        "alt": {
          "ja": "ひが くれて、あかりが ともる やすみばと ぎょうれつ",
          "zh": "天色暗下、燈火亮起的休息地和隊伍"
        },
        "lines": [
          {
            "id": "p07-1",
            "speaker": "narrator",
            "style": "peaceful, evening rest",
            "ja": "ひが くれて あかりが ともり、ぎょうれつは あんぜんな ばしょで やすみました。",
            "zh": "天色暗了，燈火亮起，隊伍在安全的地方休息。",
            "zhuyin": "ㄊㄧㄢ ㄙㄜˋ ㄢˋ ˙ㄌㄜ ㄉㄥ ㄏㄨㄛˇ ㄌㄧㄤˋ ㄑㄧˇ ㄉㄨㄟˋ ㄨˇ ㄗㄞˋ ㄢ ㄑㄩㄢˊ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄒㄧㄡ ㄒㄧˊ"
          }
        ]
      },
      {
        "id": "p08",
        "image": "images/dajia-mazu-pilgrimage/p08.webp",
        "alt": {
          "ja": "また しゅっぱつする ぎょうれつと、いっしょに あるく ひとびと",
          "zh": "隔天再出發的隊伍，和一起同行的人們"
        },
        "lines": [
          {
            "id": "p08-1",
            "speaker": "narrator",
            "style": "fresh morning, everyone joining as they can",
            "ja": "つぎの ひも しゅっぱつしました。 ぜんぶ あるく ひとも いれば、ちょっとだけ いっしょに あるく ひとも いました。",
            "zh": "隔天又出發了，有人走全程，也有人只陪一小段路。",
            "zhuyin": "ㄍㄜˊ ㄊㄧㄢ ㄧㄡˋ ㄔㄨ ㄈㄚ ˙ㄌㄜ ㄧㄡˇ ㄖㄣˊ ㄗㄡˇ ㄑㄩㄢˊ ㄔㄥˊ ㄧㄝˇ ㄧㄡˇ ㄖㄣˊ ㄓˇ ㄆㄟˊ ㄧ ㄒㄧㄠˇ ㄉㄨㄢˋ ㄌㄨˋ"
          }
        ]
      },
      {
        "id": "p09",
        "image": "images/dajia-mazu-pilgrimage/p09.webp",
        "alt": {
          "ja": "シンガンに ついて、おまいりを し、かえる じゅんびを する ひとびと",
          "zh": "抵達新港、參拜歇腳、準備返程的人們"
        },
        "lines": [
          {
            "id": "p09-1",
            "speaker": "narrator",
            "style": "arrival, respectful ritual, resting",
            "ja": "シンガンに つくと、みんなは ぎしきに したがって おまいりし、しばらく やすんで から、かえる じゅんびを しました。",
            "jaTts": "シンガンの まちに つくと、みんなは ぎしきに したがって おまいりし、しばらく やすんで から、かえる じゅんびを しました。",
            "zh": "到了新港，大家依照儀式參拜、歇腳，再準備返程。",
            "zhuyin": "ㄉㄠˋ ˙ㄌㄜ ㄒㄧㄣ ㄍㄤˇ ㄉㄚˋ ㄐㄧㄚ ㄧ ㄓㄠˋ ㄧˊ ㄕˋ ㄘㄢ ㄅㄞˋ ㄒㄧㄝ ㄐㄧㄠˇ ㄗㄞˋ ㄓㄨㄣˇ ㄅㄟˋ ㄈㄢˇ ㄔㄥˊ"
          }
        ]
      },
      {
        "id": "p10",
        "image": "images/dajia-mazu-pilgrimage/p10.webp",
        "alt": {
          "ja": "ターチャに かえって いく ぎょうれつ",
          "zh": "返回大甲的隊伍"
        },
        "lines": [
          {
            "id": "p10-1",
            "speaker": "narrator",
            "style": "homeward, settling down",
            "ja": "ぎょうれつは ターチャに かえって いきました。",
            "zh": "隊伍回到了大甲。",
            "zhuyin": "ㄉㄨㄟˋ ㄨˇ ㄏㄨㄟˊ ㄉㄠˋ ˙ㄌㄜ ㄉㄚˋ ㄐㄧㄚˇ"
          },
          {
            "id": "p10-2",
            "speaker": "narrator",
            "style": "warm, gentle lesson, slow and clear",
            "ja": "みちすがら もらった みずや たべものや やさしさは、みんなの こころに ずっと のこりました。",
            "zh": "一路上收到的水、食物和關心，也一直留在大家心裡。",
            "zhuyin": "ㄧ ㄌㄨˋ ㄕㄤˋ ㄕㄡ ㄉㄠˋ ˙ㄉㄜ ㄕㄨㄟˇ ㄕˊ ㄨˋ ㄏㄢˋ ㄍㄨㄢ ㄒㄧㄣ ㄧㄝˇ ㄧ ㄓˊ ㄌㄧㄡˊ ㄗㄞˋ ㄉㄚˋ ㄐㄧㄚ ㄒㄧㄣ ˙ㄌㄧ"
          }
        ]
      },
      {
        "id": "end",
        "image": "images/dajia-mazu-pilgrimage/end.webp",
        "alt": {
          "ja": "しずかに あかりの ともる、ターチャの おてら",
          "zh": "燈火靜靜點亮的大甲廟宇"
        },
        "lines": [
          {
            "id": "end-1",
            "speaker": "narrator",
            "style": "warm, gentle lesson, slow and clear",
            "ja": "みんなで あるいた みちは、ひとの やさしさが つながる みちでした。",
            "zh": "大家一起走過的路，是一條充滿人情溫暖的路。",
            "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄧ ㄑㄧˇ ㄗㄡˇ ㄍㄨㄛˋ ˙ㄉㄜ ㄌㄨˋ ㄕˋ ㄧ ㄊㄧㄠˊ ㄔㄨㄥ ㄇㄢˇ ㄖㄣˊ ㄑㄧㄥˊ ㄨㄣ ㄋㄨㄢˇ ˙ㄉㄜ ㄌㄨˋ"
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
