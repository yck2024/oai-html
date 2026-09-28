// The Old Man Who Made Flowers Bloom (はなさかじいさん) for the Japanese folktale picture books.
// One story object in the shared book format: Japanese marks furigana as {漢字|かんじ};
// `zhuyin` holds one 注音 syllable per Han character of `zh`; `en` is the English text.
(function (root, story) {
  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.JapanEhonStories = root.JapanEhonStories || []).push(story);
})(typeof self !== 'undefined' ? self : this, {
  "id": "hanasaka-jiisan",
  "title": {
    "ja": "はなさかじいさん",
    "zh": "開花爺爺",
    "zhuyin": "ㄎㄞ ㄏㄨㄚ ㄧㄝˊ ˙ㄧㄝ",
    "en": "The Old Man Who Made Flowers Bloom"
  },
  "tagline": {
    "ja": "やさしい こころで、かれきに はなを さかせる おはなし",
    "zh": "用溫柔的心，讓枯樹開花的故事",
    "en": "A story of a kind heart that makes bare trees bloom"
  },
  "origin": {
    "ja": "にほんの むかしばなし",
    "zh": "日本民間故事",
    "en": "A Japanese folktale"
  },
  "credit": {
    "ja": "はなさかじいさんは、にほんで ながく かたりつがれて きた むかしばなしで、えどじだいの「あかほん」という ちいさな えほんにも かかれて います。 よく しられた おはなしでは、シロは となりの じいさんの せいで いのちを おとし、うすは シロの おはかに うえた きから つくられます。 この えほんでは、シロは さいごまで げんきで、うすは シロへの おれいに うえた まつから おちた えだで つくります。 となりの じいさんが ばつを うける ばめんは、あやまり、かわりの うすを つくって わたす ばめんに かえました。",
    "zh": "〈開花爺爺〉是日本流傳已久的民間故事，江戶時代叫做「赤本」的小圖畫書裡就有記載。常見的版本裡，小白因為隔壁爺爺而喪命，臼是用種在小白墳上的樹做成的；這本繪本改成小白一直平安健康，臼是用為了感謝小白而種的松樹掉下來的樹枝做成的。有些版本裡隔壁爺爺會受到處罰，這裡改成他誠心道歉，並做一個新的臼賠給老夫婦。",
    "en": "Hanasaka Jiisan is a long-loved Japanese folktale, already printed in the small Edo-period picture booklets called akahon. In a well-known version, Shiro loses his life because of the greedy neighbor, and the mortar is made from a tree planted on his grave. In this book, Shiro stays safe and well, and the mortar is made from a branch that falls from a pine planted to thank him. Instead of the punishment found in some versions, the neighbor apologizes sincerely and makes a new mortar to replace the one he burned."
  },
  "theme": {
    "accent": "#b8506b",
    "soft": "#fae3e9"
  },
  "pages": [
    {
      "id": "cover",
      "image": "images/hanasaka-jiisan/cover.webp",
      "alt": {
        "ja": "さくらの はなびらが まう なか、はいを まく おじいさんと しろい いぬ",
        "zh": "在飄落的櫻花花瓣中撒灰的老爺爺和白狗",
        "en": "An old man scattering ash among drifting cherry petals, with a white dog beside him"
      },
      "lines": [
        {
          "id": "cover-1",
          "speaker": "narrator",
          "style": "warm, inviting storyteller opening a picture book",
          "ja": "にほんの むかしばなし「はなさかじいさん」",
          "zh": "日本民間故事〈開花爺爺〉",
          "zhuyin": "ㄖˋ ㄅㄣˇ ㄇㄧㄣˊ ㄐㄧㄢ ㄍㄨˋ ㄕˋ ㄎㄞ ㄏㄨㄚ ㄧㄝˊ ˙ㄧㄝ",
          "en": "A Japanese folktale: The Old Man Who Made Flowers Bloom"
        },
        {
          "id": "cover-2",
          "speaker": "narrator",
          "style": "curious and gently wondering",
          "ja": "かれた きに、はなが さく？ どうして かな？",
          "zh": "枯掉的樹，也會開花？為什麼呢？",
          "zhuyin": "ㄎㄨ ㄉㄧㄠˋ ˙ㄉㄜ ㄕㄨˋ ㄧㄝˇ ㄏㄨㄟˋ ㄎㄞ ㄏㄨㄚ ㄨㄟˋ ㄕㄣˊ ˙ㄇㄜ ˙ㄋㄜ",
          "en": "Can flowers bloom on a bare, dead tree? How could that be?"
        }
      ]
    },
    {
      "id": "p01",
      "image": "images/hanasaka-jiisan/p01.webp",
      "alt": {
        "ja": "しろい こいぬを だいて にっこりする おじいさんと おばあさん",
        "zh": "抱著白色小狗、笑咪咪的老爺爺和老奶奶",
        "en": "A smiling old man and old woman holding a little white puppy"
      },
      "lines": [
        {
          "id": "p01-1",
          "speaker": "narrator",
          "style": "gentle once-upon-a-time storyteller",
          "ja": "むかし むかし、やさしい おじいさんと おばあさんが、しろい こいぬを かって いました。",
          "zh": "很久很久以前，有一對善良的老爺爺和老奶奶，養了一隻白色的小狗。",
          "zhuyin": "ㄏㄣˇ ㄐㄧㄡˇ ㄏㄣˇ ㄐㄧㄡˇ ㄧˇ ㄑㄧㄢˊ ㄧㄡˇ ㄧ ㄉㄨㄟˋ ㄕㄢˋ ㄌㄧㄤˊ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄧㄤˇ ˙ㄌㄜ ㄧ ㄓ ㄅㄞˊ ㄙㄜˋ ˙ㄉㄜ ㄒㄧㄠˇ ㄍㄡˇ",
          "en": "Long, long ago, a kind old man and a kind old woman had a little white puppy."
        },
        {
          "id": "p01-2",
          "speaker": "narrator",
          "style": "tender and affectionate",
          "ja": "なまえは シロ。 おかねは すくなくても、ふたりは シロを じぶんの こどものように かわいがりました。",
          "zh": "小狗叫小白。家裡雖然沒什麼錢，兩個人還是把小白當成自己的孩子一樣疼愛。",
          "zhuyin": "ㄒㄧㄠˇ ㄍㄡˇ ㄐㄧㄠˋ ㄒㄧㄠˇ ㄅㄞˊ ㄐㄧㄚ ㄌㄧˇ ㄙㄨㄟ ㄖㄢˊ ㄇㄟˊ ㄕㄣˊ ˙ㄇㄜ ㄑㄧㄢˊ ㄌㄧㄤˇ ˙ㄍㄜ ㄖㄣˊ ㄏㄞˊ ㄕˋ ㄅㄚˇ ㄒㄧㄠˇ ㄅㄞˊ ㄉㄤ ㄔㄥˊ ㄗˋ ㄐㄧˇ ˙ㄉㄜ ㄏㄞˊ ˙ㄗ ㄧ ㄧㄤˋ ㄊㄥˊ ㄞˋ",
          "en": "His name was Shiro, which means “White.” They had little money, but they loved him like their very own child."
        }
      ]
    },
    {
      "id": "p02",
      "image": "images/hanasaka-jiisan/p02.webp",
      "alt": {
        "ja": "はたけで じめんを かく シロと、くわで だえんけいの こばんを ほりだす おじいさん",
        "zh": "小白在田裡扒土，老爺爺用鋤頭挖出橢圓形的小判金幣",
        "en": "Shiro pawing at the ground in a field as the old man digs up oval koban gold coins with a hoe"
      },
      "lines": [
        {
          "id": "p02-1",
          "speaker": "narrator",
          "style": "lively, something is about to happen",
          "ja": "ある ひ、はたけで シロが じめんを かきながら なきました。",
          "zh": "有一天，小白在田裡一邊用腳扒土，一邊汪汪叫。",
          "zhuyin": "ㄧㄡˇ ㄧ ㄊㄧㄢ ㄒㄧㄠˇ ㄅㄞˊ ㄗㄞˋ ㄊㄧㄢˊ ㄌㄧˇ ㄧ ㄅㄧㄢ ㄩㄥˋ ㄐㄧㄠˇ ㄅㄚ ㄊㄨˇ ㄧ ㄅㄧㄢ ㄨㄤ ㄨㄤ ㄐㄧㄠˋ",
          "en": "One day, out in the field, Shiro pawed at the ground and barked."
        },
        {
          "id": "p02-2",
          "speaker": "shiro",
          "style": "excited, bouncy little dog calling out",
          "ja": "「ここ ほれ ワンワン！ ここ ほれ ワンワン！」",
          "zh": "「挖這裡，汪汪！挖這裡，汪汪！」",
          "zhuyin": "ㄨㄚ ㄓㄜˋ ㄌㄧˇ ㄨㄤ ㄨㄤ ㄨㄚ ㄓㄜˋ ㄌㄧˇ ㄨㄤ ㄨㄤ",
          "en": "“Dig here, woof woof! Dig here, woof woof!”"
        },
        {
          "id": "p02-3",
          "speaker": "narrator",
          "style": "amazed and delighted",
          "ja": "おじいさんが ほって みると、きんいろの こばんが ざくざく でて きました！",
          "zh": "老爺爺挖下去一看，冒出好多閃閃發亮的金幣！",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄨㄚ ㄒㄧㄚˋ ㄑㄩˋ ㄧ ㄎㄢˋ ㄇㄠˋ ㄔㄨ ㄏㄠˇ ㄉㄨㄛ ㄕㄢˇ ㄕㄢˇ ㄈㄚ ㄌㄧㄤˋ ˙ㄉㄜ ㄐㄧㄣ ㄅㄧˋ",
          "en": "When the old man dug there, out came heaps of shiny gold coins!"
        }
      ]
    },
    {
      "id": "p03",
      "image": "images/hanasaka-jiisan/p03.webp",
      "alt": {
        "ja": "シロを つれて いく となりの よくばり じいさんと、しんぱいそうに みおくる おじいさん",
        "zh": "隔壁貪心爺爺牽走小白，老爺爺在一旁擔心地看著",
        "en": "The greedy neighbor leading Shiro away on a rope while the kind old man watches with worry"
      },
      "lines": [
        {
          "id": "p03-1",
          "speaker": "narrator",
          "style": "a little sly, pointing out someone peeking",
          "ja": "それを となりの よくばり じいさんが、かきねの かげから みて いました。",
          "zh": "隔壁那個貪心的爺爺，躲在籬笆後面，全都看見了。",
          "zhuyin": "ㄍㄜˊ ㄅㄧˋ ㄋㄚˋ ˙ㄍㄜ ㄊㄢ ㄒㄧㄣ ˙ㄉㄜ ㄧㄝˊ ˙ㄧㄝ ㄉㄨㄛˇ ㄗㄞˋ ㄌㄧˊ ˙ㄅㄚ ㄏㄡˋ ㄇㄧㄢˋ ㄑㄩㄢˊ ㄉㄡ ㄎㄢˋ ㄐㄧㄢˋ ˙ㄌㄜ",
          "en": "The greedy old man next door was watching from behind the fence."
        },
        {
          "id": "p03-2",
          "speaker": "neighbor",
          "style": "pushy and grabby, comically greedy, never scary",
          "ja": "「その いぬ、わしに かして くれ！」",
          "zh": "「那隻狗，借我用用！」",
          "zhuyin": "ㄋㄚˋ ㄓ ㄍㄡˇ ㄐㄧㄝˋ ㄨㄛˇ ㄩㄥˋ ㄩㄥˋ",
          "en": "“Lend me that dog!”"
        },
        {
          "id": "p03-3",
          "speaker": "narrator",
          "style": "gentle, a little uneasy",
          "ja": "やさしい おじいさんは「すぐ かえしてね」と、シロを かして あげました。",
          "zh": "善良的老爺爺說：「要早點還給我喔。」就把小白借給了他。",
          "zhuyin": "ㄕㄢˋ ㄌㄧㄤˊ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄕㄨㄛ ㄧㄠˋ ㄗㄠˇ ㄉㄧㄢˇ ㄏㄨㄢˊ ㄍㄟˇ ㄨㄛˇ ㄛ ㄐㄧㄡˋ ㄅㄚˇ ㄒㄧㄠˇ ㄅㄞˊ ㄐㄧㄝˋ ㄍㄟˇ ˙ㄌㄜ ㄊㄚ",
          "en": "“Please bring him back soon,” said the kind old man, and he lent Shiro to him."
        }
      ]
    },
    {
      "id": "p04",
      "image": "images/hanasaka-jiisan/p04.webp",
      "alt": {
        "ja": "われた おさらや いしころを みて おこる となりの じいさんと、にげて いく シロ",
        "zh": "看著破盤子和石頭生氣的隔壁爺爺，和跑走的小白",
        "en": "The neighbor glaring at broken dishes and stones while Shiro runs off"
      },
      "lines": [
        {
          "id": "p04-1",
          "speaker": "narrator",
          "style": "deflating, a funny letdown",
          "ja": "シロが じめんを かいた ところを ほると、でて きたのは われた おさらと いしころばかり。",
          "zh": "小白在地上扒了扒，貪心爺爺就挖那裡，可是挖出來的只有破盤子和小石頭。",
          "zhuyin": "ㄒㄧㄠˇ ㄅㄞˊ ㄗㄞˋ ㄉㄧˋ ㄕㄤˋ ㄅㄚ ˙ㄌㄜ ㄅㄚ ㄊㄢ ㄒㄧㄣ ㄧㄝˊ ˙ㄧㄝ ㄐㄧㄡˋ ㄨㄚ ㄋㄚˋ ㄌㄧˇ ㄎㄜˇ ㄕˋ ㄨㄚ ㄔㄨ ㄌㄞˊ ˙ㄉㄜ ㄓˇ ㄧㄡˇ ㄆㄛˋ ㄆㄢˊ ˙ㄗ ㄏㄢˋ ㄒㄧㄠˇ ㄕˊ ˙ㄊㄡ",
          "en": "Shiro pawed at the ground, and the greedy man dug there. But all he found were broken dishes and stones."
        },
        {
          "id": "p04-2",
          "speaker": "neighbor",
          "style": "grumpy and huffy, a cartoonish temper",
          "ja": "「なんだ、がらくたばかりじゃないか！ あっちへ いけ！」",
          "zh": "「什麼嘛，全是破爛！走開！」",
          "zhuyin": "ㄕㄣˊ ˙ㄇㄜ ˙ㄇㄚ ㄑㄩㄢˊ ㄕˋ ㄆㄛˋ ㄌㄢˋ ㄗㄡˇ ㄎㄞ",
          "en": "“Nothing but junk! Go away!”"
        },
        {
          "id": "p04-3",
          "speaker": "narrator",
          "style": "quick, then relieved",
          "ja": "シロは びっくりして、やさしい おじいさんの ところへ はしって かえりました。",
          "zh": "小白嚇了一跳，趕快跑回善良的老爺爺家。",
          "zhuyin": "ㄒㄧㄠˇ ㄅㄞˊ ㄒㄧㄚˋ ˙ㄌㄜ ㄧ ㄊㄧㄠˋ ㄍㄢˇ ㄎㄨㄞˋ ㄆㄠˇ ㄏㄨㄟˊ ㄕㄢˋ ㄌㄧㄤˊ ˙ㄉㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄐㄧㄚ",
          "en": "Shiro got a fright and ran all the way home to the kind old man."
        }
      ]
    },
    {
      "id": "p05",
      "image": "images/hanasaka-jiisan/p05.webp",
      "alt": {
        "ja": "シロを なでる おじいさんと、おおきく そだった まつの き。 きの したに ふとい えだが おちて いる",
        "zh": "摸摸小白的老爺爺，和長得又高又大的松樹，樹下掉了一根粗樹枝",
        "en": "The old man stroking Shiro beside a tall pine tree, with a thick fallen branch beneath it"
      },
      "lines": [
        {
          "id": "p05-1",
          "speaker": "narrator",
          "style": "soft and comforting",
          "ja": "おじいさんは、ふるえる シロを やさしく なでました。",
          "zh": "老爺爺溫柔地摸摸發抖的小白。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄨㄣ ㄖㄡˊ ˙ㄉㄜ ㄇㄛ ㄇㄛ ㄈㄚ ㄉㄡˇ ˙ㄉㄜ ㄒㄧㄠˇ ㄅㄞˊ",
          "en": "The kind old man gently stroked Shiro, who was trembling."
        },
        {
          "id": "p05-2",
          "speaker": "ojiisan",
          "style": "calm, warm, reassuring grandfather, gentle and clear",
          "ja": "「もう だいじょうぶ。 シロ、ありがとう。 こばんが でた ところに、まつの きを うえようね。」",
          "zh": "「沒事啦。小白，謝謝你！我們在找到金幣的地方種一棵松樹吧。」",
          "zhuyin": "ㄇㄟˊ ㄕˋ ˙ㄌㄚ ㄒㄧㄠˇ ㄅㄞˊ ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ ㄨㄛˇ ˙ㄇㄣ ㄗㄞˋ ㄓㄠˇ ㄉㄠˋ ㄐㄧㄣ ㄅㄧˋ ˙ㄉㄜ ㄉㄧˋ ㄈㄤ ㄓㄨㄥˋ ㄧ ㄎㄜ ㄙㄨㄥ ㄕㄨˋ ˙ㄅㄚ",
          "en": "“You're safe now. Thank you, Shiro! Let's plant a pine tree where you found the gold.”"
        },
        {
          "id": "p05-3",
          "speaker": "narrator",
          "style": "full of wonder",
          "ja": "まつの きは みっかで おおきく なり、ふとい えだが どさっと おちました。",
          "zh": "松樹才三天就長得又高又大，還掉下了一根粗粗的樹枝。",
          "zhuyin": "ㄙㄨㄥ ㄕㄨˋ ㄘㄞˊ ㄙㄢ ㄊㄧㄢ ㄐㄧㄡˋ ㄓㄤˇ ˙ㄉㄜ ㄧㄡˋ ㄍㄠ ㄧㄡˋ ㄉㄚˋ ㄏㄞˊ ㄉㄧㄠˋ ㄒㄧㄚˋ ˙ㄌㄜ ㄧ ㄍㄣ ㄘㄨ ㄘㄨ ˙ㄉㄜ ㄕㄨˋ ㄓ",
          "en": "In just three days the pine grew tall, and a thick branch fell from it with a thud."
        }
      ]
    },
    {
      "id": "p06",
      "image": "images/hanasaka-jiisan/p06.webp",
      "alt": {
        "ja": "まつの きで つくった うすで おもちを つく おじいさんと おばあさん。 うすから こばんが こぼれる",
        "zh": "用松樹做的臼搗麻糬的老爺爺和老奶奶，臼裡滾出金幣",
        "en": "The old couple pounding rice cakes in a pine-wood mortar as gold coins spill out"
      },
      "lines": [
        {
          "id": "p06-1",
          "speaker": "narrator",
          "style": "cheerful, festive",
          "ja": "もうすぐ おしょうがつ。 おじいさんは その えだで うすを つくり、おばあさんと おもちを つきました。",
          "zh": "日本的新年快到了。老爺爺用那根樹枝做了一個臼，和老奶奶一起搗麻糬。",
          "zhuyin": "ㄖˋ ㄅㄣˇ ˙ㄉㄜ ㄒㄧㄣ ㄋㄧㄢˊ ㄎㄨㄞˋ ㄉㄠˋ ˙ㄌㄜ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄩㄥˋ ㄋㄚˋ ㄍㄣ ㄕㄨˋ ㄓ ㄗㄨㄛˋ ˙ㄌㄜ ㄧ ˙ㄍㄜ ㄐㄧㄡˋ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄧ ㄑㄧˇ ㄉㄠˇ ㄇㄚˊ ㄕㄨˇ",
          "en": "New Year was coming. The old man made a mortar from the branch, and he and the old woman pounded rice into mochi."
        },
        {
          "id": "p06-2",
          "speaker": "narrator",
          "style": "rhythmic, then a happy surprise",
          "ja": "ぺったん、ぺったん。 すると、うすの なかから こばんが ざくざく！",
          "zh": "咚、咚！這時候，臼裡竟然冒出好多金幣！",
          "zhuyin": "ㄉㄨㄥ ㄉㄨㄥ ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄐㄧㄡˋ ㄌㄧˇ ㄐㄧㄥˋ ㄖㄢˊ ㄇㄠˋ ㄔㄨ ㄏㄠˇ ㄉㄨㄛ ㄐㄧㄣ ㄅㄧˋ",
          "en": "Thump, thump! And out of the mortar poured gold coins!"
        }
      ]
    },
    {
      "id": "p07",
      "image": "images/hanasaka-jiisan/p07.webp",
      "alt": {
        "ja": "どろしか でない うすを まえに、おこって うすを もやす となりの じいさん",
        "zh": "臼裡只搗出泥巴，氣得把臼燒掉的隔壁爺爺",
        "en": "The neighbor, angry at a mortar full of mud, burning it in a fire"
      },
      "lines": [
        {
          "id": "p07-1",
          "speaker": "narrator",
          "style": "a little uneasy, he promises",
          "ja": "よくばり じいさんが「こんどは きを つける」と やくそくしたので、おじいさんは うすを かしました。",
          "zh": "貪心的爺爺保證說：「這次我會小心！」老爺爺才把臼借給他。",
          "zhuyin": "ㄊㄢ ㄒㄧㄣ ˙ㄉㄜ ㄧㄝˊ ˙ㄧㄝ ㄅㄠˇ ㄓㄥˋ ㄕㄨㄛ ㄓㄜˋ ㄘˋ ㄨㄛˇ ㄏㄨㄟˋ ㄒㄧㄠˇ ㄒㄧㄣ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄘㄞˊ ㄅㄚˇ ㄐㄧㄡˋ ㄐㄧㄝˋ ㄍㄟˇ ㄊㄚ",
          "en": "“I'll be careful this time,” the greedy man promised, so the old man lent him the mortar."
        },
        {
          "id": "p07-2",
          "speaker": "narrator",
          "style": "comic disappointment",
          "ja": "でも、ついても ついても でて くるのは どろばかり。",
          "jaTts": "でも、ついても、ついても、でて くるのは、どろばかり。",
          "zh": "可是搗了又搗，冒出來的只有泥巴。",
          "zhuyin": "ㄎㄜˇ ㄕˋ ㄉㄠˇ ˙ㄌㄜ ㄧㄡˋ ㄉㄠˇ ㄇㄠˋ ㄔㄨ ㄌㄞˊ ˙ㄉㄜ ㄓˇ ㄧㄡˇ ㄋㄧˊ ㄅㄚ",
          "en": "But no matter how hard he pounded, only mud came out."
        },
        {
          "id": "p07-3",
          "speaker": "narrator",
          "style": "serious and a little sad",
          "ja": "よくばり じいさんは おこって、うすを もやして しまいました。",
          "zh": "貪心爺爺氣得把臼燒掉了。",
          "zhuyin": "ㄊㄢ ㄒㄧㄣ ㄧㄝˊ ˙ㄧㄝ ㄑㄧˋ ˙ㄉㄜ ㄅㄚˇ ㄐㄧㄡˋ ㄕㄠ ㄉㄧㄠˋ ˙ㄌㄜ",
          "en": "In a temper, he burned the mortar to ashes."
        }
      ]
    },
    {
      "id": "p08",
      "image": "images/hanasaka-jiisan/p08.webp",
      "alt": {
        "ja": "はいの かごを かかえて あるく おじいさん。 かぜが かごの はいを かれた さくらの きへ はこび、えだに はなが さきはじめる。 おじいさんと シロは びっくり",
        "zh": "抱著一籃灰走路的老爺爺，風把籃裡的灰吹到枯櫻花樹上，樹枝開始開花，老爺爺和小白嚇了一跳",
        "en": "As the old man walks home hugging his basket of ash, the wind carries ash from it onto a bare cherry tree, whose branches start to bloom while he and Shiro look on in surprise"
      },
      "lines": [
        {
          "id": "p08-1",
          "speaker": "narrator",
          "style": "quiet and sad, then gentle",
          "ja": "うすを とりに いくと、はいだけが のこって いました。 おじいさんは かなしくて、はいを かごに いれて かえりました。",
          "zh": "老爺爺去拿臼，卻只剩下一堆灰。他好傷心，把灰裝進籃子裡帶回家。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄑㄩˋ ㄋㄚˊ ㄐㄧㄡˋ ㄑㄩㄝˋ ㄓˇ ㄕㄥˋ ㄒㄧㄚˋ ㄧ ㄉㄨㄟ ㄏㄨㄟ ㄊㄚ ㄏㄠˇ ㄕㄤ ㄒㄧㄣ ㄅㄚˇ ㄏㄨㄟ ㄓㄨㄤ ㄐㄧㄣˋ ㄌㄢˊ ˙ㄗ ㄌㄧˇ ㄉㄞˋ ㄏㄨㄟˊ ㄐㄧㄚ",
          "en": "When the old man went to get his mortar back, only ashes were left. Sadly, he carried them home in a basket."
        },
        {
          "id": "p08-2",
          "speaker": "narrator",
          "style": "light and airy, like a breeze",
          "ja": "そのとき、かぜが ふいて、はいが かれた さくらの きに ふわり。",
          "zh": "這時候，一陣風吹來，灰輕輕飄到枯掉的櫻花樹上。",
          "zhuyin": "ㄓㄜˋ ㄕˊ ㄏㄡˋ ㄧ ㄓㄣˋ ㄈㄥ ㄔㄨㄟ ㄌㄞˊ ㄏㄨㄟ ㄑㄧㄥ ㄑㄧㄥ ㄆㄧㄠ ㄉㄠˋ ㄎㄨ ㄉㄧㄠˋ ˙ㄉㄜ ㄧㄥ ㄏㄨㄚ ㄕㄨˋ ㄕㄤˋ",
          "en": "Just then, a breeze blew some of the ash onto a bare, dead cherry tree."
        },
        {
          "id": "p08-3",
          "speaker": "narrator",
          "style": "joyful astonishment",
          "ja": "すると、えだ いっぱいに さくらの はなが さきました！",
          "zh": "沒想到，整棵樹竟然開滿了櫻花！",
          "zhuyin": "ㄇㄟˊ ㄒㄧㄤˇ ㄉㄠˋ ㄓㄥˇ ㄎㄜ ㄕㄨˋ ㄐㄧㄥˋ ㄖㄢˊ ㄎㄞ ㄇㄢˇ ˙ㄌㄜ ㄧㄥ ㄏㄨㄚ",
          "en": "And suddenly, every branch burst into cherry blossoms!"
        }
      ]
    },
    {
      "id": "p09",
      "image": "images/hanasaka-jiisan/p09.webp",
      "alt": {
        "ja": "かごを うでに かけて さくらの きに のぼり、はいを まく おじいさん。 えだに はなが さき、うまの うえの とのさまが ほうびの ふくろを もって よろこんで いる",
        "zh": "手臂掛著灰籃、爬上櫻花樹撒灰的老爺爺，樹枝開滿櫻花；騎在馬上的領主大人拿著賞賜的小袋子，高興地看著",
        "en": "The old man, up in a cherry tree with his basket of ash on his arm, scattering ash as the branches burst into bloom; the delighted lord watches from his horse holding a reward pouch, his procession behind him"
      },
      "lines": [
        {
          "id": "p09-1",
          "speaker": "narrator",
          "style": "grand and stately",
          "ja": "おじいさんが はいの かごを もって そとへ でると、とのさまの ぎょうれつが とおりかかりました。",
          "zh": "老爺爺帶著一籃灰出門時，領主大人的隊伍剛好經過。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄉㄞˋ ˙ㄓㄜ ㄧ ㄌㄢˊ ㄏㄨㄟ ㄔㄨ ㄇㄣˊ ㄕˊ ㄌㄧㄥˇ ㄓㄨˇ ㄉㄚˋ ㄖㄣˊ ˙ㄉㄜ ㄉㄨㄟˋ ㄨˇ ㄍㄤ ㄏㄠˇ ㄐㄧㄥ ㄍㄨㄛˋ",
          "en": "As the old man carried his basket of ash outside, the lord came by with his procession."
        },
        {
          "id": "p09-2",
          "speaker": "ojiisan",
          "style": "bright, joyful call from up in a tree",
          "ja": "「かれきに はなを さかせましょう！」",
          "zh": "「讓枯樹開花吧！」",
          "zhuyin": "ㄖㄤˋ ㄎㄨ ㄕㄨˋ ㄎㄞ ㄏㄨㄚ ˙ㄅㄚ",
          "en": "“I'll make flowers bloom on this bare tree!”"
        },
        {
          "id": "p09-3",
          "speaker": "narrator",
          "style": "sweeping and delighted",
          "ja": "はいを まくと、きに いっせいに はなが さきました。 とのさまは おおよろこびで、ごほうびを くれました。",
          "zh": "老爺爺一撒灰，整棵樹一下子開滿了花。領主大人很高興，給了他獎賞。",
          "zhuyin": "ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄧ ㄙㄚˇ ㄏㄨㄟ ㄓㄥˇ ㄎㄜ ㄕㄨˋ ㄧ ㄒㄧㄚˋ ˙ㄗ ㄎㄞ ㄇㄢˇ ˙ㄌㄜ ㄏㄨㄚ ㄌㄧㄥˇ ㄓㄨˇ ㄉㄚˋ ㄖㄣˊ ㄏㄣˇ ㄍㄠ ㄒㄧㄥˋ ㄍㄟˇ ˙ㄌㄜ ㄊㄚ ㄐㄧㄤˇ ㄕㄤˇ",
          "en": "When he scattered the ash, the whole tree burst into blossom. The lord was delighted and gave him a reward."
        }
      ]
    },
    {
      "id": "p10",
      "image": "images/hanasaka-jiisan/p10.webp",
      "alt": {
        "ja": "はなが さかない かれきの そばで、かぜに とんだ はいを あびて けほけほ する とのさまと、あわてて あたまを さげる となりの じいさん",
        "zh": "枯樹一朵花也沒開，風把灰吹到領主大人臉上，隔壁爺爺慌忙低頭道歉",
        "en": "Beside a tree that stays bare, the wind blows ash into the coughing lord's face while the neighbor bows in a hurry"
      },
      "lines": [
        {
          "id": "p10-1",
          "speaker": "narrator",
          "style": "sly, you can guess what happens",
          "ja": "となりの じいさんも ごほうびが ほしくて、かごに のこった はいを べつの かれきに まきました。",
          "zh": "隔壁爺爺也想要獎賞，就拿了籃子裡剩下的灰，撒在另一棵枯樹上。",
          "zhuyin": "ㄍㄜˊ ㄅㄧˋ ㄧㄝˊ ˙ㄧㄝ ㄧㄝˇ ㄒㄧㄤˇ ㄧㄠˋ ㄐㄧㄤˇ ㄕㄤˇ ㄐㄧㄡˋ ㄋㄚˊ ˙ㄌㄜ ㄌㄢˊ ˙ㄗ ㄌㄧˇ ㄕㄥˋ ㄒㄧㄚˋ ˙ㄉㄜ ㄏㄨㄟ ㄙㄚˇ ㄗㄞˋ ㄌㄧㄥˋ ㄧ ㄎㄜ ㄎㄨ ㄕㄨˋ ㄕㄤˋ",
          "en": "The neighbor wanted a reward too. He took the ash left in the basket and scattered it on another bare tree."
        },
        {
          "id": "p10-2",
          "speaker": "narrator",
          "style": "comic, a puff and a cough",
          "ja": "でも、はなは ひとつも さかず、かぜで はいが とのさまの かおに ばさっ！",
          "zh": "可是一朵花也沒開，一陣風把灰全吹到領主大人的臉上！",
          "zhuyin": "ㄎㄜˇ ㄕˋ ㄧ ㄉㄨㄛˇ ㄏㄨㄚ ㄧㄝˇ ㄇㄟˊ ㄎㄞ ㄧ ㄓㄣˋ ㄈㄥ ㄅㄚˇ ㄏㄨㄟ ㄑㄩㄢˊ ㄔㄨㄟ ㄉㄠˋ ㄌㄧㄥˇ ㄓㄨˇ ㄉㄚˋ ㄖㄣˊ ˙ㄉㄜ ㄌㄧㄢˇ ㄕㄤˋ",
          "en": "But not a single flower bloomed, and a gust blew the ash right into the lord's face!"
        },
        {
          "id": "p10-3",
          "speaker": "neighbor",
          "style": "flustered and truly sorry",
          "ja": "「ご、ごめんなさい！ よくばった わしが わるかった。」",
          "zh": "「對、對不起！都怪我太貪心了。」",
          "zhuyin": "ㄉㄨㄟˋ ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄉㄡ ㄍㄨㄞˋ ㄨㄛˇ ㄊㄞˋ ㄊㄢ ㄒㄧㄣ ˙ㄌㄜ",
          "en": "“I-I'm sorry! It was my greed that caused all this.”"
        }
      ]
    },
    {
      "id": "end",
      "image": "images/hanasaka-jiisan/end.webp",
      "alt": {
        "ja": "まんかいの さくらの したで わらう おじいさん、おばあさん、シロと、となりの じいさん。 そばに あたらしい うす",
        "zh": "在盛開的櫻花樹下一起笑的老爺爺、老奶奶、小白和隔壁爺爺，旁邊放著新的臼",
        "en": "The old couple, Shiro, and the neighbor smiling together under cherry trees in full bloom, with a new mortar beside them"
      },
      "lines": [
        {
          "id": "end-1",
          "speaker": "narrator",
          "style": "warm, forgiving",
          "ja": "となりの じいさんは、シロと おじいさんと おばあさんに あやまって、かわりの うすを つくって わたしました。",
          "zh": "隔壁爺爺向小白、老爺爺和老奶奶道歉，還做了一個新的臼賠給他們。",
          "zhuyin": "ㄍㄜˊ ㄅㄧˋ ㄧㄝˊ ˙ㄧㄝ ㄒㄧㄤˋ ㄒㄧㄠˇ ㄅㄞˊ ㄌㄠˇ ㄧㄝˊ ˙ㄧㄝ ㄏㄢˋ ㄌㄠˇ ㄋㄞˇ ˙ㄋㄞ ㄉㄠˋ ㄑㄧㄢˋ ㄏㄞˊ ㄗㄨㄛˋ ˙ㄌㄜ ㄧ ˙ㄍㄜ ㄒㄧㄣ ˙ㄉㄜ ㄐㄧㄡˋ ㄆㄟˊ ㄍㄟˇ ㄊㄚ ˙ㄇㄣ",
          "en": "The neighbor apologized to Shiro and the old couple, then made them a new mortar to replace the one he burned."
        },
        {
          "id": "end-2",
          "speaker": "narrator",
          "style": "bright and happy, spring has come",
          "ja": "まんかいの さくらの したで、みんなは シロと いっしょに おはなみを しました。",
          "zh": "大家和小白一起，在盛開的櫻花樹下賞花。",
          "zhuyin": "ㄉㄚˋ ㄐㄧㄚ ㄏㄢˋ ㄒㄧㄠˇ ㄅㄞˊ ㄧ ㄑㄧˇ ㄗㄞˋ ㄕㄥˋ ㄎㄞ ˙ㄉㄜ ㄧㄥ ㄏㄨㄚ ㄕㄨˋ ㄒㄧㄚˋ ㄕㄤˇ ㄏㄨㄚ",
          "en": "Under the cherry trees in full bloom, everyone enjoyed the blossoms with Shiro."
        },
        {
          "id": "end-3",
          "speaker": "narrator",
          "style": "gentle, loving close, slow and clear",
          "ja": "やさしい こころは、はなを さかせるんだね。 おしまい。",
          "zh": "溫柔的心，能讓花朵盛開喔。故事說完了。",
          "zhuyin": "ㄨㄣ ㄖㄡˊ ˙ㄉㄜ ㄒㄧㄣ ㄋㄥˊ ㄖㄤˋ ㄏㄨㄚ ㄉㄨㄛˇ ㄕㄥˋ ㄎㄞ ㄛ ㄍㄨˋ ㄕˋ ㄕㄨㄛ ㄨㄢˊ ˙ㄌㄜ",
          "en": "A kind heart can make flowers bloom. The end."
        }
      ]
    }
  ]
});
