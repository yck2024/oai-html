// The Rolling Rice Ball (おむすびころりん) for the Japanese folktale picture books.
// One story object in the shared book format: Japanese marks furigana as {漢字|かんじ};
// `zhuyin` holds one 注音 syllable per Han character of `zh`; `en` is the English text.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.JapanEhonStories = root.JapanEhonStories || []).push(story);
})(typeof self !== 'undefined' ? self : this, {
  "id": "omusubi-kororin",
  "title": {
    "ja": "おむすびころりん",
    "zh": "飯糰滾呀滾",
    "zhuyin": "ㄈㄢˋ ㄊㄨㄢˊ ㄍㄨㄣˇ ˙ㄧㄚ ㄍㄨㄣˇ",
    "en": "The Rolling Rice Ball"
  },
  "tagline": {
    "ja": "ころがった おむすびが おじいさんを つれて いった、ねずみたちの おうちの おはなし",
    "zh": "滾走的飯糰，帶老爺爺到老鼠們家的故事",
    "en": "A rolling rice ball leads an old man to the mice's home"
  },
  "origin": {
    "ja": "にほんの むかしばなし",
    "zh": "日本民間故事",
    "en": "A Japanese folktale"
  },
  "credit": {
    "ja": "おむすびころりんは、にほんの あちこちで かたられて きた むかしばなしで、「ねずみじょうど」とも よばれます。 ちいきに よって、ねずみの うたや おみやげが ちがいます。 むかしからの おはなしの なかには、ねこの まねを した となりの じいさんが、ねずみに かまれたり、あなから でられなく なったり する ものも あります。 この えほんでは、ねずみたちが あかりを けして かくれ、となりの じいさんが なにも もらえずに かえる おはなしに しました。",
    "zh": "〈飯糰滾呀滾〉是日本各地流傳的民間故事，也叫做「老鼠淨土」。各地的老鼠歌和禮物都不太一樣。有些版本裡，學貓叫的隔壁爺爺會被老鼠咬，或是困在洞裡出不來；這本繪本改成老鼠們吹熄燈火躲起來，隔壁爺爺什麼也沒拿到就回家了。",
    "en": "Omusubi Kororin (“The Rolling Rice Ball”) is a folktale told all over Japan, also known as Nezumi Jōdo, “the Mouse Pure Land.” The mice's song and their gifts differ from place to place. In some tellings, the neighbor who meows like a cat is bitten by the mice or trapped underground. In this book, the mice simply blow out their lanterns and hide, and the neighbor goes home with nothing."
  },
  "theme": {
    "accent": "#a8752a",
    "soft": "#f6ebd3"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/omusubi-kororin/cover.webp",
      "alt": {
        "ja": "さかみちを ころがる おむすびを おいかける おじいさん",
        "zh": "追著飯糰滾下山坡的老爺爺",
        "en": "An old man chasing a rice ball rolling down a slope"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "warm, inviting storyteller opening a picture book",
          "ja": "にほんの むかしばなし「おむすびころりん」",
          "zh": "日本民間故事〈飯糰滾呀滾〉",
          "zhuyin": "ㄖˋ ㄅㄣˇ ㄇㄧㄣˊ ㄐㄧㄢ ㄍㄨˋ ㄕˋ ㄈㄢˋ ㄊㄨㄢˊ ㄍㄨㄣˇ ˙ㄧㄚ ㄍㄨㄣˇ",
          "en": "A Japanese folktale: The Rolling Rice Ball"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "playful and curious",
          "ja": "ころころ ころがった おむすびは、どこへ いくのかな？",
          "zh": "滾呀滾的飯糰，會滾到哪裡去呢？",
          "zhuyin": "ㄍㄨㄣˇ ˙ㄧㄚ ㄍㄨㄣˇ ˙ㄉㄜ ㄈㄢˋ ㄊㄨㄢˊ ㄏㄨㄟˋ ㄍㄨㄣˇ ㄉㄠˋ ㄋㄚˇ ㄌㄧˇ ㄑㄩˋ ˙ㄋㄜ",
          "en": "Where will the rolling rice ball go?"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/omusubi-kororin/p01.webp",
      "alt": {
        "ja": "おむすびの つつみを わたす おばあさんと、しょいこを せおった おじいさん",
        "zh": "遞出飯糰包袱的老奶奶，和背著柴架的老爺爺",
        "en": "The old woman handing a bundle of rice balls to the old man, who carries a wooden frame on his back"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "gentle once-upon-a-time storyteller",
          "ja": "むかし むかし、やまの ふもとに、おじいさんと おばあさんが すんで いました。",
          "zh": "很久很久以前，山腳下住著老爺爺和老奶奶。",
          "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄕㄢ ㄐㄧㄠˇ ㄒㄧㄚˋ ㄓㄨˋ ˙ㄓㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ",
          "en": "Long, long ago, an old man and an old woman lived at the foot of a mountain."
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "cozy and easygoing",
          "ja": "ある あさ、おじいさんは おばあさんが にぎった おむすびを もって、やまへ しばかりに いきました。",
          "zh": "一天早上，老爺爺帶著老奶奶做的飯糰，上山撿柴。",
          "zhuyin": "ㄧ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄉㄞˋ ˙ㄓㄜ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄗㄨㄛˋ ˙ㄉㄜ ㄈㄢˋ ㄊㄨㄢˊ ㄕㄤˋ ㄕㄢ ㄐㄧㄢˇ ㄔㄞˊ",
          "en": "One morning, he took the rice balls she had made and went up the mountain to gather firewood."
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/omusubi-kororin/p02.webp",
      "alt": {
        "ja": "きりかぶに すわって おむすびを もつ おじいさん。 もう ひとつの おむすびが ころがって、おおきな きの ねもとの あなへ むかう",
        "zh": "坐在樹墩上拿著飯糰的老爺爺，另一個飯糰滾向大樹根旁的洞口",
        "en": "The old man sitting on a stump with a rice ball in his hand, as another rice ball rolls toward the hole among a big tree's roots"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "relaxed, then a little oops",
          "ja": "おひるに なって、おじいさんが つつみを ひらくと……",
          "zh": "到了中午，老爺爺打開布包……",
          "zhuyin": "ㄉㄠˋ ˙ㄌㄜ ㄓㄨㄥ ㄨˇ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄉㄚˇ ㄎㄞ ㄅㄨˋ ㄅㄠ",
          "en": "At lunchtime, the old man opened his bundle, and…"
        },
        {
          "id": "p02-2",
          "speaker": "narrator",
          "style": "bouncy and rhythmic, like something rolling",
          "ja": "おむすびが ひとつ、ころりん ころりん、さかみちを ころがって いきました。",
          "zh": "一個飯糰掉了下來，咕嚕咕嚕地沿著山坡滾下去。",
          "zhuyin": "ㄧ ˙ㄍㄜ ㄈㄢˋ ㄊㄨㄢˊ ㄉㄧㄠˋ ˙ㄌㄜ ㄒㄧㄚˋ ㄌㄞˊ ㄍㄨ ˙ㄌㄨ ㄍㄨ ˙ㄌㄨ ˙ㄉㄜ ㄧㄢˊ ˙ㄓㄜ ㄕㄢ ㄆㄛ ㄍㄨㄣˇ ㄒㄧㄚˋ ㄑㄩˋ",
          "en": "one rice ball tumbled out and rolled, roly-poly, down the slope."
        },
        {
          "id": "p02-3",
          "speaker": "narrator",
          "style": "a funny little drop",
          "ja": "そして、きの ねもとの あなに、すっとんとん！",
          "zh": "然後，咚的一聲，掉進了大樹下的洞裡！",
          "zhuyin": "ㄖㄢˊ ㄏㄡˋ ㄉㄨㄥ ˙ㄉㄜ ㄧ ㄕㄥ ㄉㄧㄠˋ ㄐㄧㄣˋ ˙ㄌㄜ ㄉㄚˋ ㄕㄨˋ ㄒㄧㄚˋ ˙ㄉㄜ ㄉㄨㄥˋ ㄌㄧˇ",
          "en": "And then, plop! It dropped into a hole under a tree."
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/omusubi-kororin/p03.webp",
      "alt": {
        "ja": "あなの そばに ひざを ついて みみを すませ、にっこり わらう おじいさん。 あなの おくに ちいさな ねずみたちの すがた",
        "zh": "跪在洞口旁、豎起耳朵聽、笑咪咪的老爺爺，洞裡有小老鼠們的身影",
        "en": "The old man kneeling by the hole, listening with a smile, as little mice appear inside the hole"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "narrator",
          "style": "hushed and delighted",
          "ja": "すると、あなの なかから かわいい うたが きこえて きました。",
          "zh": "這時候，洞裡傳出了可愛的歌聲。",
          "zhuyin": "ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄉㄨㄥˋ ㄌㄧˇ ㄔㄨㄢˊ ㄔㄨ ˙ㄌㄜ ㄎㄜˇ ㄞˋ ˙ㄉㄜ ㄍㄜ ㄕㄥ",
          "en": "Then, from inside the hole, came a sweet little song."
        },
        {
          "id": "p03-2",
          "speaker": "mouse",
          "style": "tiny, cheerful sing-song chorus",
          "ja": "「おむすび ころりん すっとんとん。 ころころ ころりん すっとんとん。」",
          "zh": "「飯糰滾呀滾，咚咚咚。咕嚕咕嚕滾，咚咚咚。」",
          "zhuyin": "ㄈㄢˋ ㄊㄨㄢˊ ㄍㄨㄣˇ ˙ㄧㄚ ㄍㄨㄣˇ ㄉㄨㄥ ㄉㄨㄥ ㄉㄨㄥ ㄍㄨ ˙ㄌㄨ ㄍㄨ ˙ㄌㄨ ㄍㄨㄣˇ ㄉㄨㄥ ㄉㄨㄥ ㄉㄨㄥ",
          "en": "“Rice ball rolling, down, down, plop! Roly-poly, down, down, plop!”"
        },
        {
          "id": "p03-3",
          "speaker": "grandpa",
          "style": "charmed, chuckling grandfather",
          "ja": "「おや、たのしい うただ。 もう ひとつ ころがして みよう。」",
          "zh": "「哎呀，真有趣的歌！我再滾一個下去吧。」",
          "zhuyin": "ㄞ ㄧㄚ ㄓㄣ ㄧㄡˇ ㄑㄩˋ ˙ㄉㄜ ㄍㄜ ㄨㄛˇ ㄗㄞˋ ㄍㄨㄣˇ ㄧ ˙ㄍㄜ ㄒㄧㄚˋ ㄑㄩˋ ˙ㄅㄚ",
          "en": "“My, what a fun song! I'll roll another one down.”"
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/omusubi-kororin/p04.webp",
      "alt": {
        "ja": "きの ねもとの ひろい あなに すべりこむ おじいさんと、きの かげから のぞく となりの じいさん",
        "zh": "滑進大樹根下寬洞口的老爺爺，和躲在樹後偷看的隔壁爺爺",
        "en": "The old man slipping into the wide hole under the tree roots, while the neighbor peeks out from behind the tree"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "curious, leaning in",
          "ja": "おじいさんは もう ひとつ おむすびを ころがして、あなを のぞきこみました。",
          "zh": "老爺爺又把一個飯糰滾進洞裡，探頭往裡看。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄧㄡˋ ㄅㄚˇ ㄧ ˙ㄍㄜ ㄈㄢˋ ㄊㄨㄢˊ ㄍㄨㄣˇ ㄐㄧㄣˋ ㄉㄨㄥˋ ㄌㄧˇ ㄊㄢˋ ㄊㄡˊ ㄨㄤˇ ㄌㄧˇ ㄎㄢˋ",
          "en": "He rolled another rice ball into the hole, then leaned in to peek."
        },
        {
          "id": "p04-2",
          "speaker": "narrator",
          "style": "suspenseful, a comic slip",
          "ja": "すると、あしが つるりと すべって……",
          "zh": "沒想到腳底一滑……",
          "zhuyin": "ㄇㄟˊ ㄒㄧㄤˇ ㄉㄠˋ ㄐㄧㄠˇ ㄉㄧˇ ㄧ ㄏㄨㄚˊ",
          "en": "But his foot slipped, and…"
        },
        {
          "id": "p04-3",
          "speaker": "narrator",
          "style": "silly and bouncy, not scary at all",
          "ja": "おじいさんも、ころりん すっとんとん！",
          "zh": "老爺爺也咕嚕咕嚕，咚的一聲滾了進去！",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄧㄝˇ ㄍㄨ ˙ㄌㄨ ㄍㄨ ˙ㄌㄨ ㄉㄨㄥ ˙ㄉㄜ ㄧ ㄕㄥ ㄍㄨㄣˇ ˙ㄌㄜ ㄐㄧㄣˋ ㄑㄩˋ",
          "en": "down he went too, roly-poly, plop!"
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/omusubi-kororin/p05.webp",
      "alt": {
        "ja": "ちょうちんの あかりが ともる ねずみの いえで、おおぜいの ねずみに かこまれる おじいさん",
        "zh": "在掛滿燈籠的老鼠家裡，被一大群老鼠圍著的老爺爺",
        "en": "The old man surrounded by many mice in their lantern-lit home"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "narrator",
          "style": "soft landing, full of wonder",
          "ja": "おじいさんが ふわりと おりた ところは、ちょうちんの ともる、ねずみたちの いえでした。",
          "zh": "他輕輕落在一個掛滿燈籠的地方，原來是老鼠們的家。",
          "zhuyin": "ㄊㄚ ㄑㄧㄥ ㄑㄧㄥ ㄌㄨㄛˋ ㄗㄞˋ ㄧ ˙ㄍㄜ ㄍㄨㄚˋ ㄇㄢˇ ㄉㄥ ㄌㄨㄥˊ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄩㄢˊ ㄌㄞˊ ㄕˋ ㄌㄠˇ ㄕㄨˇ ˙ㄇㄣ ˙ㄉㄜ ㄐㄧㄚ",
          "en": "He landed softly in a place lit with lanterns. It was the home of the mice!"
        },
        {
          "id": "p05-2",
          "speaker": "mouse",
          "style": "tiny, polite and bubbly",
          "ja": "「おじいさん、おいしい おむすびを ありがとう！ おれいに ごちそうします。」",
          "zh": "「老爺爺，謝謝你的飯糰，真好吃！我們請你吃大餐。」",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ˙ㄉㄜ ㄈㄢˋ ㄊㄨㄢˊ ㄓㄣ ㄏㄠˇ ㄔ ㄨㄛˇ ˙ㄇㄣ ㄑㄧㄥˇ ㄋㄧˇ ㄔ ㄉㄚˋ ㄘㄢ",
          "en": "“Thank you for the delicious rice balls, Grandpa! Let us treat you to a feast.”"
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/omusubi-kororin/p06.webp",
      "alt": {
        "ja": "おもちを ついて うたい おどる ねずみたちと、おもちの おさらを まえに てを たたく おじいさん",
        "zh": "搗麻糬、又唱又跳的老鼠們，和面前擺著一盤麻糬、拍著手的老爺爺",
        "en": "Mice pounding rice cakes, singing and dancing, while the old man claps along with a plate of rice cakes in front of him"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "festive and merry",
          "ja": "ねずみたちは おもちを ついて おじいさんに ごちそうし、うたって おどりました。",
          "zh": "老鼠們搗了麻糬請他吃，還唱歌跳舞。",
          "zhuyin": "ㄌㄠˇ ㄕㄨˇ ˙ㄇㄣ ㄉㄠˇ ˙ㄌㄜ ㄇㄚˊ ㄕㄨˇ ㄑㄧㄥˇ ㄊㄚ ㄔ ㄏㄞˊ ㄔㄤˋ ㄍㄜ ㄊㄧㄠˋ ㄨˇ",
          "en": "The mice pounded rice to make rice cakes for the old man, then sang and danced."
        },
        {
          "id": "p06-2",
          "speaker": "mouse",
          "style": "tiny, cheerful sing-song chorus with a playful shiver on the last part",
          "ja": "「ぺったん ぺったん ぺったんこ。 ねこさえ いなけりゃ、たのしい おうち！」",
          "zh": "「搗呀搗呀搗麻糬，咚咚咚。沒有貓來，家裡真開心！」",
          "zhuyin": "ㄉㄠˇ ˙ㄧㄚ ㄉㄠˇ ˙ㄧㄚ ㄉㄠˇ ㄇㄚˊ ㄕㄨˇ ㄉㄨㄥ ㄉㄨㄥ ㄉㄨㄥ ㄇㄟˊ ㄧㄡˇ ㄇㄠ ㄌㄞˊ ㄐㄧㄚ ㄌㄧˇ ㄓㄣ ㄎㄞ ㄒㄧㄣ",
          "en": "“Thump, thump, thump! With no cats around, our home is full of fun!”"
        },
        {
          "id": "p06-3",
          "speaker": "narrator",
          "style": "happy and cozy",
          "ja": "おじいさんも てを たたいて、いっしょに わらいました。",
          "zh": "老爺爺也跟著拍手，和大家一起笑。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄧㄝˇ ㄍㄣ ˙ㄓㄜ ㄆㄞ ㄕㄡˇ ㄏㄢˋ ㄉㄚˋ ㄐㄧㄚ ㄧ ㄑㄧˇ ㄒㄧㄠˋ",
          "en": "The old man clapped along and laughed with them."
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/omusubi-kororin/p07.webp",
      "alt": {
        "ja": "おおきい つづらと ちいさい つづらを さしだす ねずみと、ちいさい ほうを えらぶ おじいさん",
        "zh": "拿出大箱子和小箱子的老鼠，和選了小箱子的老爺爺",
        "en": "A mouse offering a big and a small wicker box, and the old man choosing the small one"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "mouse",
          "style": "tiny, polite and bubbly",
          "ja": "「おみやげです。 おおきい つづらと ちいさい つづら、どちらが いいですか？」",
          "zh": "「送你禮物。大箱子和小箱子，你要哪一個呢？」",
          "zhuyin": "ㄙㄨㄥˋ ㄋㄧˇ ㄌㄧˇ ㄨˋ ㄉㄚˋ ㄒㄧㄤ ˙ㄗ ㄏㄢˋ ㄒㄧㄠˇ ㄒㄧㄤ ˙ㄗ ㄋㄧˇ ㄧㄠˋ ㄋㄚˇ ㄧ ˙ㄍㄜ ˙ㄋㄜ",
          "en": "“Here is a present. A big wicker box or a small one, which would you like?”"
        },
        {
          "id": "p07-2",
          "speaker": "grandpa",
          "style": "humble, kindly grandfather",
          "ja": "「おおきいのは おもくて もてません。 ちいさいので じゅうぶんです。 ありがとう。」",
          "zh": "「大的太重了，小的就夠了。謝謝你們。」",
          "zhuyin": "ㄉㄚˋ ˙ㄉㄜ ㄊㄞˋ ㄓㄨㄥˋ ˙ㄌㄜ ㄒㄧㄠˇ ˙ㄉㄜ ㄐㄧㄡˋ ㄍㄡˋ ˙ㄌㄜ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ˙ㄇㄣ",
          "en": "“The big one is too heavy for me. The small one is plenty. Thank you!”"
        },
        {
          "id": "p07-3",
          "speaker": "narrator",
          "style": "warm goodbye",
          "ja": "おじいさんは ちいさな つづらを せおって、ねずみたちに てを ふって かえりました。",
          "zh": "老爺爺背起小箱子，向老鼠們揮揮手回家了。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄅㄟ ㄑㄧˇ ㄒㄧㄠˇ ㄒㄧㄤ ˙ㄗ ㄒㄧㄤˋ ㄌㄠˇ ㄕㄨˇ ˙ㄇㄣ ㄏㄨㄟ ㄏㄨㄟ ㄕㄡˇ ㄏㄨㄟˊ ㄐㄧㄚ ˙ㄌㄜ",
          "en": "He carried the small box on his back and waved goodbye to the mice."
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/omusubi-kororin/p08.webp",
      "alt": {
        "ja": "つづらから でて きた だえんけいの こばんや きれいな ぬのに おどろく おじいさんと おばあさん。 まどの そとから となりの じいさんが のぞいて いる",
        "zh": "看見箱子裡的橢圓形小判金幣和漂亮的布、嚇一跳的老爺爺和老奶奶，隔壁爺爺在窗外偷看",
        "en": "The old couple amazed by oval koban gold coins and beautiful cloth in the box, while the neighbor peeks in through the window"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "delighted surprise",
          "ja": "いえで つづらを あけると、こばんや きれいな ぬのが いっぱい！",
          "zh": "回到家打開箱子，裡面裝滿了金幣和漂亮的布！",
          "zhuyin": "ㄏㄨㄟˊ ㄉㄠˋ ㄐㄧㄚ ㄉㄚˇ ㄎㄞ ㄒㄧㄤ ˙ㄗ ㄌㄧˇ ㄇㄧㄢˋ ㄓㄨㄤ ㄇㄢˇ ˙ㄌㄜ ㄐㄧㄣ ㄅㄧˋ ㄏㄢˋ ㄆㄧㄠˋ ˙ㄌㄧㄤ ˙ㄉㄜ ㄅㄨˋ",
          "en": "At home, they opened the box. It was full of gold coins and beautiful cloth!"
        },
        {
          "id": "p08-2",
          "speaker": "grandma",
          "style": "happy, grateful grandmother",
          "ja": "「まあ、ねずみさんたちの おかげだね。」",
          "zh": "「哎呀，這都要謝謝老鼠們呢。」",
          "zhuyin": "ㄞ ㄧㄚ ㄓㄜˋ ㄉㄡ ㄧㄠˋ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄌㄠˇ ㄕㄨˇ ˙ㄇㄣ ˙ㄋㄜ",
          "en": "“Oh my! We have the mice to thank for this.”"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/omusubi-kororin/p09.webp",
      "alt": {
        "ja": "おなじ きの ねもとの あなに おむすびを なげこむ となりの よくばり じいさん",
        "zh": "把飯糰丟進同一個樹根洞口的隔壁貪心爺爺",
        "en": "The greedy neighbor tossing a rice ball into the same hole under the tree roots"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "a little sly, here comes trouble",
          "ja": "こばんを みた となりの じいさんは、おじいさんに あなの ばしょを きいて、やまへ いきました。",
          "zh": "隔壁爺爺看見金幣，問老爺爺洞口在哪裡，就上山去了。",
          "zhuyin": "ㄍㄜˊ ㄅㄧˋ ㄧㄝˊ ˙ㄧㄝ ㄎㄢˋ ㄐㄧㄢˋ ㄐㄧㄣ ㄅㄧˋ ㄨㄣˋ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄉㄨㄥˋ ㄎㄡˇ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ ㄐㄧㄡˋ ㄕㄤˋ ㄕㄢ ㄑㄩˋ ˙ㄌㄜ",
          "en": "The neighbor saw the gold coins, asked the old man where the hole was, and went up the mountain."
        },
        {
          "id": "p09-2",
          "speaker": "narrator",
          "style": "brisk and comic",
          "ja": "おむすびを あなへ ぽいっと なげこんで、じぶんも どすんと とびこみました。",
          "zh": "他把飯糰往洞裡一丟，自己也咚的一聲跳了進去。",
          "zhuyin": "ㄊㄚ ㄅㄚˇ ㄈㄢˋ ㄊㄨㄢˊ ㄨㄤˇ ㄉㄨㄥˋ ㄌㄧˇ ㄧ ㄉㄧㄡ ㄗˋ ㄐㄧˇ ㄧㄝˇ ㄉㄨㄥ ˙ㄉㄜ ㄧ ㄕㄥ ㄊㄧㄠˋ ˙ㄌㄜ ㄐㄧㄣˋ ㄑㄩˋ",
          "en": "He tossed a rice ball into the hole and jumped in after it. Thump!"
        },
        {
          "id": "p09-3",
          "speaker": "neighbor",
          "style": "scheming, comically greedy, never scary",
          "ja": "「ねこの こえで ねずみを おどかせば、たからは ぜんぶ わしの もの！」",
          "zh": "「學貓叫把老鼠嚇跑，寶物就全是我的了！」",
          "zhuyin": "ㄒㄩㄝˊ ㄇㄠ ㄐㄧㄠˋ ㄅㄚˇ ㄌㄠˇ ㄕㄨˇ ㄒㄧㄚˋ ㄆㄠˇ ㄅㄠˇ ㄨˋ ㄐㄧㄡˋ ㄑㄩㄢˊ ㄕˋ ㄨㄛˇ ˙ㄉㄜ ˙ㄌㄜ",
          "en": "“If I scare the mice away with a meow, all their treasure will be mine!”"
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/omusubi-kororin/p10.webp",
      "alt": {
        "ja": "ねこの まねを する となりの じいさんと、つづらを かかえて ちょうちんを けしながら かくれる ねずみたち。 おくの あなぐちから ひかりが さして いる",
        "zh": "學貓叫的隔壁爺爺，和抱著箱子、一邊吹熄燈籠一邊躲起來的老鼠們，遠處洞口透進陽光",
        "en": "The neighbor meowing like a cat while the mice carry their boxes away and blow out the lanterns; daylight shines in from the opening far behind"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "neighbor",
          "style": "a loud, silly, exaggerated cat impression",
          "ja": "「にゃーお！」",
          "zh": "「喵嗚——！」",
          "zhuyin": "ㄇㄧㄠ ㄨ",
          "en": "“Meow!”"
        },
        {
          "id": "p10-2",
          "speaker": "narrator",
          "style": "quick and hushed",
          "ja": "ねずみたちは びっくりして、あかりを けし、たからものを もって かくれて しまいました。",
          "zh": "老鼠們嚇了一跳，吹熄燈火，帶著寶物躲起來了。",
          "zhuyin": "ㄌㄠˇ ㄕㄨˇ ˙ㄇㄣ ㄒㄧㄚˋ ˙ㄌㄜ ㄧ ㄊㄧㄠˋ ㄔㄨㄟ ㄒㄧ ㄉㄥ ㄏㄨㄛˇ ㄉㄞˋ ˙ㄓㄜ ㄅㄠˇ ㄨˋ ㄉㄨㄛˇ ㄑㄧˇ ㄌㄞˊ ˙ㄌㄜ",
          "en": "The startled mice blew out their lanterns and hid, taking their treasures with them."
        },
        {
          "id": "p10-3",
          "speaker": "narrator",
          "style": "comic and a little rueful",
          "ja": "あなぐちの ひかりを たよりに、じいさんは てぶらで かえりました。",
          "zh": "他朝洞口的亮光走去，兩手空空地回家了。",
          "zhuyin": "ㄊㄚ ㄔㄠˊ ㄉㄨㄥˋ ㄎㄡˇ ˙ㄉㄜ ㄌㄧㄤˋ ㄍㄨㄤ ㄗㄡˇ ㄑㄩˋ ㄌㄧㄤˇ ㄕㄡˇ ㄎㄨㄥ ㄎㄨㄥ ˙ㄉㄜ ㄏㄨㄟˊ ㄐㄧㄚ ˙ㄌㄜ",
          "en": "He followed the daylight out and went home empty-handed."
        }
      ]
    },
    {
      "id": "end",
      "image": "images/omusubi-kororin/end.webp",
      "alt": {
        "ja": "きの ねもとの あなへ、おむすびを そっと ころがす おじいさんと おばあさん",
        "zh": "把飯糰輕輕滾進樹根洞口的老爺爺和老奶奶",
        "en": "The old couple gently rolling a rice ball into the hole under the tree roots"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "warm and content",
          "ja": "やさしい おじいさんと おばあさんは、それからも ときどき、あなに おむすびを ころがしました。",
          "zh": "善良的老爺爺和老奶奶，後來有時也會把飯糰滾進洞裡。",
          "zhuyin": "ㄕㄢˋ ㄌㄧㄤˊ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄏㄡˋ ㄌㄞˊ ㄧㄡˇ ㄕˊ ㄧㄝˇ ㄏㄨㄟˋ ㄅㄚˇ ㄈㄢˋ ㄊㄨㄢˊ ㄍㄨㄣˇ ㄐㄧㄣˋ ㄉㄨㄥˋ ㄌㄧˇ",
          "en": "After that, the kind old couple rolled rice balls into the hole now and then."
        },
        {
          "id": "end-2",
          "speaker": "mouse",
          "style": "tiny, cheerful sing-song chorus, grateful",
          "ja": "「おむすび ころりん すっとんとん。 ありがとう、ありがとう、すっとんとん。」",
          "zh": "「飯糰滾呀滾，咚咚咚。謝謝你呀謝謝你，咚咚咚。」",
          "zhuyin": "ㄈㄢˋ ㄊㄨㄢˊ ㄍㄨㄣˇ ˙ㄧㄚ ㄍㄨㄣˇ ㄉㄨㄥ ㄉㄨㄥ ㄉㄨㄥ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ˙ㄧㄚ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ㄉㄨㄥ ㄉㄨㄥ ㄉㄨㄥ",
          "en": "“Rice ball rolling, down, down, plop! Thank you, thank you, plop, plop, plop!”"
        },
        {
          "id": "end-3",
          "speaker": "narrator",
          "style": "soft, cozy ending",
          "ja": "おしまい。",
          "zh": "故事說完了。",
          "zhuyin": "ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄨㄢˊ ˙ㄌㄜ",
          "en": "The end."
        }
      ]
    }
  ]
});
