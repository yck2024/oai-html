# 台灣故事繪本 Taiwan Ehon — story notes and sources

This page shares Taiwanese stories bilingually (Japanese / Taiwan Mandarin) with a young child
growing up in Japan. Each story is a gentle retelling for ages 4–7, not a transcription of a single
"true" version — Taiwanese and Indigenous oral traditions have many tellings, and this book always
tries to say so rather than presenting one version as definitive.

The two launch stories, 白賊七 and 射日英雄, are documented where they were added. This section
covers the second batch of three stories, prepared alongside a parallel batch (邵族白鹿傳說,
新埔顯伯公, 大甲媽祖遶境進香) recommended by the same research review.

## Analytics and reading privacy

This storybook uses the existing GA4 tag (`G-QLFWNZWDSS`) for its page views and six small events, with only the listed parameters:

- `book_open` (`book_id`: a fixed story id), when a book is opened from the bookshelf
- `book_complete` (`book_id`: a fixed story id), once per opening upon reaching its ending page
- `listen_mode_change` (`listen_mode`: `ja-zh`, `zh-ja`, `ja`, or `zh`), when listening order changes
- `zhuyin_toggle` (`zhuyin`: `on` or `off`), when 注音 visibility changes
- `auto_turn_toggle` (`auto_turn`: `on` or `off`), when auto-turn changes
- `continuous_toggle` (`continuous`: `on` or `off`), when continuous listening changes

Every one of those six events also carries `series_id: "taiwan"` (added when this storybook moved
onto the shared multi-series engine — see "The shared engine" below). `book_id` itself is
unchanged: it stays the bare story id it always was (`bai-zei-qi`, not `taiwan:bai-zei-qi`), so
historical reports are not affected. `page_view` is unchanged and does not carry `series_id` —
its `page_location` already identifies the series by URL.

`book_id`, `listen_mode`, `zhuyin`, `auto_turn`, `continuous`, and `series_id` only appear in GA
reports after registration as event-scoped custom dimensions in GA Admin → Custom definitions. That
registration must be done by a GA administrator; this repository cannot do it — each event
parameter needs its own registration as an event-scoped custom dimension. No story
text, page-by-page or sentence-level events, timing, durations, or user identifiers beyond GA
defaults are sent. Shared click and copy tracking stays off via `data-analytics-ignore`. Each
book has its own path (`/taiwan-ehon/<book-id>/`) and its own GA4 page view — `page_location` is
that path, `page_title` is the book's title — so which book someone opens is now visible in the
URL and in page views, the same information `book_open` already reported. Page turns, sentence
taps, and reading position stay out of the URL, hash, and page views entirely; only the book
selection appears there. App navigation writes only shelf and book paths, never page, sentence,
or query state. Referrer stays trimmed to its origin. Settings are saved locally on the device
for reading, but nothing new is stored in the browser for analytics; no reading history is saved.

## The shared engine

The shared reader runtime and its tests are maintained in `../engine/` and synced into this
series by `node engine/build.js`; CI checks those generated copies for drift. This folder keeps
its own `series.config.js`, `theme.css`, and `audio-timing.js`. Its Japanese/Mandarin language
configuration and disabled narrated-only option are specific to this series; continuous listening
is available through the shared engine. See [the engine guide](../engine/README.md) for runtime
ownership and generated-file details.

**This page's URL, and every one of its book URLs (the original eight and the three added later), will never move** without a separately
approved migration — they are shared publicly and installed as offline PWAs on real devices.
`engine/url-existence.test.js` fails CI if any of them stop existing.

The storybook is also installable as an offline-capable app (a web manifest and service worker at `taiwan-ehon/`). The service worker caches the app shell and book pages; online picture and audio requests refresh cached media so same-name story updates appear, while offline requests fall back to the cached copy. Cached audio Range requests return immediately while a background refresh updates the full cached file. "Read offline"/"download offline" stores the chosen book's pictures and narration in the browser's on-device Cache Storage. "Remove offline copy" removes that book's pictures and narration, while the app shell remains cached. Download and reading choices stay on that device and browser profile and are not sent anywhere. GA4 requests are never cached and are skipped entirely while offline.

## Listening with the screen off

With 自動翻頁 (auto-turn) on, narration is designed to continue sentence by sentence and page by page — in whichever listening mode is selected — when the app is backgrounded or the screen is off. A hidden tab skips the usual pauses between clips and pages because its timers can be suspended; playback chains through one audio element, and the page shown catches up with what's playing when the screen comes back on. The Media Session API also exposes the book's title and cover, plus play, pause, and next/previous page controls.

That per-clip chaining still depends on the browser keeping the page's own JavaScript timers and `ended` event running while the screen is off, which Android Chrome does not reliably do. 「がめんを けしても よみつづける ・ 關掉螢幕也繼續唸」 is a second, engine-wide option (shared by every series — see `../engine/README.md`) built specifically for that case: turning it on joins the whole book's clips for the selected listening mode, plus short silence clips for the pauses between them, into one continuous audio file in memory before playback starts, so there is only ever one already-started `<audio>` element for Android to keep alive — no per-clip re-arming required. Every clip's exact duration is precomputed at build time (`../engine/generate-audio-timing.js`, via ffprobe, into this folder's own `audio-timing.js`), so the page and highlighted sentence can be recovered from the audio's own playback position alone, even after the screen was off long enough that no UI update ran; next/previous page (on-screen or from the lock screen) seeks within that same file instead of restarting anything. No second copy of any clip is stored — the joined file is assembled from the same per-clip URLs the offline download and sentence-by-sentence modes already use, and is discarded once played. This mode was built for Android Chrome first, per the request that prompted it. Automated tests cover the timing math and simulate hidden/visible transitions, but a real screen-locked Android device was not available to verify against. iOS Safari's background/lock-screen behavior — for either listening mode — was not verified.

## 虎姑婆 (hu-gu-po)

A gentle, agency-forward new retelling: the parents are only next door and leave the children a
two-knock signal on the shared wall. When a visitor claiming the mother sent her asks to come in,
the children keep the door shut, knock the signal, and the parents come back with neighbors and
lanterns; the visitor runs off with a striped tiger tail showing. Nobody is bitten, threatened, or
punished — the story is about noticing, not opening the door, and letting family know, not about
frightening a child into obedience. The wall-signal plot is written for this book.

- **Origin note:** 虎姑婆 is a familiar Hoklo-language nursery/story tradition told across Taiwan
  (and the wider "tiger/wolf grandmother" tale family in East Asia more broadly), not a single
  fixed text — versions vary widely in what the visitor does and how the story ends.
- Ministry of Culture, on the picture-book "虎姑婆" having multiple versions and a "cute rather than
  scary" stage retelling: <https://www.moc.gov.tw/News_Content.aspx?n=105&s=241754>
- National Digital Library of Theses and Dissertations, research on the 虎姑婆 tale type and its
  variants: <https://ndltd.ncl.edu.tw/handle/84455009596318345178>

## 青瞑龍蛇 (qing-mi-long-she)

A Tainan river legend, retold around the modern puppet play's question: were the "blind" dragon
and snake really to blame for the floods? People said a dragon lived in 急水溪 and a snake in
曾文溪, and called them "青瞑" (Taiwanese for "cannot see") because they seemed to rush about blindly.
In this new story a village child, Tong, is told to watch from high ground in heavy rain, raises
the alarm, walks with everyone to a hill away from the river, and sees that the water moves first
and the snake only follows — so the flood was nobody's fault. The rising river is shown from a safe
distance as the warning; no one is hurt, and there is no scene of destruction or battle with a deity.
The book never uses not seeing as the reason for causing harm. Tong and the evacuation are written
for this book.

- **Origin note:** this is a localized Tainan/台江 water-and-landscape legend, distinct from
  general dragon myths — the published adaptation this book draws on is itself a modern puppet-play
  retelling, not a transcript of one unchanged oral version.
- National Museum of Taiwan History, "扛茨走溪流：臺江風土與自然", on how Tainan/台江 communities
  understood the shifting Tsengwen River (including the "青暝蛇" river-as-serpent image) and adapted
  by moving with it: <https://the.nmth.gov.tw/nmth/zh-tw/Special/SpecialDetail/997cbb8c-04de-41f8-90ca-de9ac8b92778>
- National Center for Traditional Arts, on the dragon of 急水溪 and the snake of 曾文溪, why people
  called them "青暝", and the play's question of whether they are truly blind:
  <https://www.ncfta.gov.tw/cp.aspx?n=8862>
- Ministry of Culture puppet-script, 《青瞑的龍蛇無青瞑》, the modern adaptation whose question this
  retelling starts from: <https://file.moc.gov.tw/Download.ashx?n=MjAyNOWFkuerpeW4g%2Biii%2BaIsuWKh%2BacrOWJteS9nOW%2BtemBuC3kvZzlk4Hos4fmlpnooajjgJDlhKrpgbjjgIrpnZLnnpHnmoTpvo3om4fnhKHpnZLnnpHjgIvjgJEucGRm&u=LzAwMS9VcGxvYWRvLzQ5Mi9yZWxmaWxlLzE2MDcwLzI0NDI2Mi9mODg0ODFmMi1jYmI5LTQ1N2YtODA0OC05ODdlOTRlMTllZjUucGRm
  (the direct PDF fetch returned HTTP 404 for the researcher who cataloged this source; treat the
  link as unverified until someone can open it directly, and rely on the NMTH and NCFTA sources for
  the factual grounding used in this retelling)

## 阿拉巴耐的石頭 (a-la-ba-nai) — a Malan Amis remembrance at Arapanay

A new story about Arapanay (阿拉巴耐), a coastal place in southern Taitung, seen through a fictional
present-day Malan Amis (馬蘭阿美) boy and his grandmother. She tells him it is handed down as the
place where the ancestors rested on their long journey north; the family watches a borrowed sailboat
come in from the sea, the adults haul it ashore while the children cheer from a distance, and fish
and shellfish from the sea are shared with the ancestors, as the 2026 news reports of the Malan Amis
commemoration describe. The grandmother also tells, as her community's legend, that the first
ancestors were born from a stone; the book does not claim any pictured rock is that stone. It is
deliberately **not** framed as "the Amis creation story" — the Council of Indigenous Peoples'
materials distinguish northern and southern Amis origin traditions, and the credit says plainly that
other Amis villages tell different origin stories. The boy, his family, and their words are written
for this book; a Malan Amis reader should still review the words and pictures.

- **Origin note:** credited specifically to Malan Amis (with Hengchun Amis and Puyuma communities
  sharing a connection to the same place, Arapanay/阿拉巴耐, also known in Puyuma tradition as
  Panapanayan) — not presented as a pan-Amis or "the" Indigenous origin story.
- Council of Indigenous Peoples, "阿美族", on the north/south divine-descent vs. stone-birth origin
  distinction: <https://www.cip.gov.tw/zh-tw/tribe/grid-list/DBADF0287998968BD0636733C6861689/info.html?cumid=8F19BF08AE220D65>
- 臺灣原住民族事典 (Taiwan Indigenous Peoples' encyclopedia), on most southern Amis naming Arapanay
  as their place of origin, and on the stone-birth traditions of the 卑南阿美 (Malan) and Hengchun
  Amis:
  <https://aborgpedia.alcd.center/detail?cat=32&id=2387&race=0&search=&writer=>
- 自由時報 (Liberty Times), on the Malan Amis commemoration at Arapanay: a borrowed traditional Amis
  sailboat brought in from the sea and hauled ashore together, and seafood shared with the ancestral
  spirits — the scenes this book's boat pages are based on:
  <https://news.ltn.com.tw/news/life/breakingnews/5470073>
- 聯合新聞網 (United Daily News), on the same commemoration and on Arapanay as a resting place of
  Amis ancestors travelling north from Hengchun along the coast, over the mountains, or by sail:
  <https://udn.com/news/story/7328/9562778>

## 白鹿傳說 (shao-white-deer) — where the name 日月潭 comes from

The hunters follow the white deer until it leaps into a lake, and they bring their people to live
there. While the story happens, the book calls it only "the lake", because 日月潭 is a later name,
not the Thao's own. The name is set up in the pictures and text instead of appearing out of
nowhere. When the hunters first reach the lake they see a small island in the middle, which the
Thao call Lalu (p07). From the mountain they see the lake round where the island is and thin and
curved beside it (p10). At the end the book says that much later the lake came to be called
日月潭, that 日 means the sun and 月 the moon, and that people say the round side looks like the sun
and the curved side like the moon. It then says the Thao still live by the lake today. The credit
adds the older colour explanation and notes that the pictured shoreline is drawn for the story,
not a record of the old lake, whose outline changed after the hydropower works of the Japanese era.

- **Name origin:** Qing-era records, commonly cited as 鄧傳安's 《蠡測彙抄》 (1821), explain the name
  by the water's two colours (水分丹、碧二色). The explanation by shape, with the island as the
  dividing line, came later and is the one official sources give today. Official sources differ on
  the directions (north/south or east/west), so the book gives none. The book uses the shape
  explanation because a young child can see it in the picture, and it says so in the credit.
- Council of Indigenous Peoples, "邵族", on the white deer leaping into the lake, the fish and
  fertile land that made the ancestors settle, and Lalu as the Thao's highest ancestral-spirit
  site: <https://www.cip.gov.tw/zh-tw/tribe/grid-list/3343FD21497CA007D0636733C6861689/info.html?cumid=D0636733C6861689>
- Taiwan Tourism Administration, "日月潭拉魯島", on the island dividing a sun-shaped and a
  crescent-shaped half, on the area being where the Thao lived, and on the island's Thao name
  Lalu, restored in 2000: <https://www.taiwan.net.tw/m1.aspx?sNo=0001114&id=R45>
- Sun Moon Lake National Scenic Area Administration, "發現日月潭", on the name coming from the
  lake's sun-like and moon-like sides on either side of Lalu, and on the hydropower works begun in 1919:
  <https://www.sunmoonlake.gov.tw/guides/ArticlesFull?a=32>
- Council of Indigenous Peoples notice, relayed by the Executive Yuan, on the Thao Ethnic Council's
  2023 decision to correct the ethnic name's spelling from "Thao" to "Thau" (the credit's self-name
  reads Ita Thau): <https://eycc.ey.gov.tw/Page/9FAC64F67005E355/43b9cdd8-fbcc-4ef3-b48c-488533b914c4>
- Wikipedia (zh), "日月潭", for 鄧傳安's colour explanation quoted from 〈遊水裡社記〉 and the later
  shape explanation: <https://zh.wikipedia.org/zh-tw/%E6%97%A5%E6%9C%88%E6%BD%AD>

## Production notes (all three stories)

- Illustrations: original picture-book-style artwork generated locally (gpt-image-2.5-flare, medium
  quality, 2×2 sheets), inspected page-by-page against the story text before use. No stereotyped
  Indigenous costuming or invented ceremonial symbols were used for 阿拉巴耐的石頭; community members
  are shown in plain daily clothing, at a respectful distance rather than close caricature.
- Narration: build-time Gemini narration for every sentence in both languages, following the same
  per-character voice and storyteller-style convention as the launch stories.
- Registered in `stories.js` alongside 邵族白鹿傳說, 新埔顯伯公, and 大甲媽祖遶境進香 (the parallel
  batch recommended by the same research review), after the launch pair.

## The third batch: 蛇郎君, 彩虹橋, and 巴冷與百步蛇

Three more books, added after the original eight. As before, each is a gentle retelling for ages
4–7 in Japanese and Taiwan Mandarin with 注音. The research came first. Opus then drafted each
story, and GPT-6 Sol gave it three rounds of adversarial review, covering cohesion, page
transitions, cultural accuracy, child-appropriateness, natural Japanese and Mandarin, and 注音.
Each opening asks a question that the ending answers. The end-page credit says which version the
book follows and what it changes.

### 蛇郎君 (she-lang-jun) — a Taiwanese Hokkien folktale

The traditional tale is tale type 433D. A poor father picks flowers from a snake's garden and
promises him a daughter. Only the kind youngest agrees. The snake turns out to be a handsome,
gentle man. The jealous eldest sister pushes her into a well and takes her place, blaming her
changed voice on eating too many beans. The youngest comes back as a bird whose song mocks the
sister, then as bamboo, a chair, and a red turtle cake. In most versions the sister is killed or
punished. This retelling keeps kindness, a kept promise, and the truth coming out, but:

- The father promises only to come back with an answer, not to give away a daughter. The youngest
  goes to answer for herself, promises to come back and help with the flowers, keeps that promise,
  and she and the snake decide together to marry.
- There is no well. The sister borrows the clothes and comb and pushes her away. The garden's
  petals protect the girl by turning her into a bird, and they turn her back once her husband
  recognises her from the bird's song about the clothes and comb.
- There is no punishment. The sister gives back the clothes and comb and says sorry for the push.
  The bean excuse stays: it is faithful to the tale and funny.

Sources:

- National Museum of Taiwan Literature, 台灣文學辭典 entry 「蛇郎君故事」 (簡齊儒), for the tale type,
  plot, variants, and the bird's song: <https://db.nmtl.gov.tw/site2/dictionary?id=Dictionary02092>
- Wikipedia (zh), 「蛇郎君」, for the variants: how many daughters, which sister, the bean and burnt-face
  excuses, the snake taking human form so his wife is not afraid, and the endings. Each point cites
  county collections: <https://zh.wikipedia.org/wiki/%E8%9B%87%E9%83%8E%E5%90%9B>
- 鹿憶鹿, 〈民間故事中的姊妹情結－兼論蛇郎君類型的「紅龜粿」意象〉, 淡江中文學報 39 (2018), abstract:
  <https://www.airitilibrary.com/Article/Detail/18197469-201812-201901230004-201901230004-103-134>
- National Cultural Memory Bank, a Hakka recording of 蛇郎君 from Wanluan, Pingtung, showing that the
  tale is told beyond Hokkien:
  <https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Media&id=605246>
- For the pictures: the National Museum of Taiwan History on the side-fastening women's tunic
  (<https://women.nmth.gov.tw/?p=1908>), and the National Cultural Memory Bank on the courtyard house
  (<https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=306824>).

### 彩虹橋 (atayal-rainbow-bridge) — Atayal belief

In Squliq Atayal the rainbow is *hongu' utux*, the bridge of the spirits. After death a person
crosses it to the ancestral spirits, who wait at the bridgehead and welcome those who lived by
*gaga*, the code handed down from the ancestors. The facial tattoo (*ptasan*) was the sign by which
the ancestors recognised their people. Everyone received a forehead line in childhood. A woman
received cheek bands after she came of age and had learned to weave, and a man received a chin
band for recognised courage and ability. The sources link the man's tattoo to headhunting. This
book leaves that out and describes it as courage and protecting family and village, as the
National Museum of Taiwan History's description allows.

The book tells this as Atayal belief spoken by an Atayal grandmother, not as a fairy tale. It is set
in the present day, because tattooing was banned under Japanese rule and the last tattooed Atayal
elders died in 2013 and 2019. So Yaki has no tattoo, but her own grandmother did, and she wove the
old cloth that opens the story. The pointing taboo is authentic. Yaki's tattooed grandmother
appears only in a memory picture, with forehead and cheek bands, weaving on a backstrap loom. The
man behind her is carrying firewood, with no weapons or trophies. Yaway, Yaki, and their story are
invented for this book. The name Lawa is avoided because an existing picture book about a rainbow
bridge uses it.

Sources:

- Council of Indigenous Peoples, 「泰雅族」, on *utux*, *gaga*, *ptasan* and what it marked, the
  ancestors checking the tattoo at death, and the diamond motif as "ancestral eyes":
  <https://www.cip.gov.tw/zh-tw/tribe/grid-list/8C87B4AF56B788EED0636733C6861689/info.html?cumid=8F19BF08AE220D65>
- 臺灣原住民族事典, 「刺青」 (山本芳美), on ages, patterns, the tattoo shown at the bridgehead, and the
  Japanese-era ban: <https://aborgpedia.alcd.center/detail?cat=0&id=11627&race=0&search=%E4%BD%8F%E5%B1%8B&writer=>
- National Museum of Taiwan History, 泰雅族紋面工具組, on the patterns and on the men's tattoo
  marking bravery and ability: <https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&RNO=2003.012.0020>
- 族語E樂園 (ILRDF), Squliq reading 「pqzwan na hongu utux 彩虹橋的故事」, on the ancestral spirits
  guarding the bridge: <https://web.klokah.tw/text/read.php?tid=19245>
- Taiwan Panorama (1997), on the ancestors welcoming their descendants across the rainbow:
  <https://www.taiwan-panorama.com/Articles/Details?Guid=34e1de9f-cb1b-44ec-9f6c-21fd5821a9eb&CatId=11>
- 賽考利克泰雅語線上辭典 (pqwasan.org.tw), for *hongu' utux*, *gaga'*, *ptasan*, *yaki'*, and the sentence
  「不要隨便指著彩虹橋！」: <http://tayal.pqwasan.org.tw/kmal/desktop/index.php>
- National Museum of Taiwan History 「臺灣女人」, on women learning to weave before the tattoo and
  marriage: <https://women.nmth.gov.tw/?p=2081>
- 自由時報 (2024), on 柯菊蘭 (d. 2019), the last tattooed Atayal elder in Tai'an:
  <https://art.ltn.com.tw/article/breakingnews/4788607>

### 巴冷與百步蛇 (rukai-hundred-pacer-snake) — a Rukai legend from Taromak

This book follows the East Rukai telling from Taromak (達魯瑪克, 大南), compiled by the late Taromak
cultural worker 蘇金成 and reported by CNA in 2023. 巴冷, daughter of the paramount chief 朗拉目,
meets the gentle 阿達里歐 by 小鬼湖 (Taidrengere). On the day he comes to propose, his party is
the mountain's birds and beasts led by a great hundred-pacer: he is the snake king who guards the
two lakes. The chief and elders cannot bring themselves to refuse, so they ask for seven-coloured
glass beads from the sea. He brings them and takes 巴冷 into the lake, and since then people do not
hunt or make noise around the lakes.

The Council of Indigenous Peoples' children's version, 〈巴嫩與蛇郎〉, supplies the flute, the
mother dressing her daughter in tears, the dusk farewell, and the lilies on the shore. The
headdress disappearing into the water comes from a Rukai farewell song. The lily headdress and the
words 「湖中的家」 are this book's own. This book adapts the Taromak version reported by CNA, in
which the chief asks for seven-coloured glass beads from the sea as the bride price. The quest also
appears in the 2001–02 computer game 《巴冷公主》; 梁欣芸 (2009) notes that it is absent from other
recorded tellings. Other Rukai communities tell different versions, one of them without a snake at all.

The snake is drawn as a calm, sacred elder, never striking. The snake, sun, and pottery-jar motifs
appear only on the chief's house, the chief wears hawk-eagle feathers, and the village is built of
slate. Taromak's old village, Kapaliwa, had slate houses, and they have since been rebuilt there.

Sources:

- CNA (中央社), 「神秘小鬼湖濕地 流傳人蛇戀故事」 (2023), for the Taromak telling, 蘇金成's compilation,
  and the taboos: <https://www.cna.com.tw/news/ahel/202301250102.aspx>
- Taipei Times, "Rukai legend and remote location protect wetlands" (2023):
  <https://www.taipeitimes.com/News/taiwan/archives/2023/01/30/2003793364>
- Council of Indigenous Peoples (children's site), 「魯凱族」 with 〈巴嫩與蛇郎〉:
  <https://www.cip.gov.tw/kids/zh-tw/menu/data-list/FF8E0A73EBC8DFA298A085F050B7C6AC-info.html?cumid=FF8E0A73EBC8DFA298A085F050B7C6AC>
- Council of Indigenous Peoples, 「魯凱族」, on the chief-only motifs, hawk-eagle feathers, lily rules,
  slate houses, and clothing:
  <https://www.cip.gov.tw/zh-tw/tribe/grid-list/409F703B4E592A82D0636733C6861689/info.html?cumid=8F19BF08AE220D65>
- 臺灣原住民族事典, 「百步蛇」, on the honorifics and the reverence and avoidance around the snake:
  <https://aborgpedia.alcd.center/detail?id=5404&search=&cat=0&race=0&writer=>
- 梁欣芸, 〈解讀「巴冷公主」現象〉, 東海中文學報 21 (2009), on the game, the farewell song, and the
  absence of the glass-bead quest from other recorded tellings: <https://chinese.thu.edu.tw/upload/newspaper_upload/21/21017.pdf>
- 自由時報, on the Taromak slate houses rebuilt at Kapaliwa: <https://news.ltn.com.tw/news/local/paper/215743>
- 臺北市原住民族事務委員會, 「建築工藝－魯凱族」, which notes that other East Rukai houses were mainly
  wood and bamboo:
  <https://knowlegde.gov.taipei/News_Content.aspx?n=E2774B2FD4A88AD0&sms=D8939B9274D1E899&s=69536339AB0710B9>

### Review log (GPT-6 Sol, three rounds per story)

- **蛇郎君.**
  - Round 1: the father's forced promise made the daughter responsible for it; the well implied a
    drowning; the bird was recognised by luck; and the ending lectured instead of reuniting.
    The fixes: the father now promises only an answer, the petals turn her into a bird, the husband
    hears the song's clue, and the book ends on an apology.
  - Round 2: the marriage still read as payment for the flowers, the petal magic needed a reason,
    and the apology needed to name the push. Also fixed: the Japanese wording and the 注音 for 種,
    太太, and 家裡.
  - Round 3: her choice to marry is now explicit, and the comb in the picture matches the text.
- **彩虹橋.**
  - Round 1: the book needed a personal reason to care, so it now opens with the old cloth. Also
    fixed: the ancestors now wait at the bridgehead, not the far end; the tattoo is set up as the
    sign of recognition before Yaway worries; the watchtower is gone; and she no longer holds the
    cloth up to the rainbow.
  - Round 2: gloss the rainbow as 祖靈的橋 in the story and as the spirits' bridge in the credit;
    mention the forehead line; show the untangling; and mark the later rain.
  - Round 3: ready.
- **巴冷與百步蛇.**
  - Round 1: the opening now asks why the lakes are kept quiet, and the ending answers it. Also
    fixed: the reveal shows him in snake form; the chief and elders hesitate; the beads come "from
    the sea"; the lilies bloom "later"; and 注音 corrected for 得, 當, and 泊.
  - Round 2: add his change back to human form, name the lily headdress in the Japanese, shorten
    long pages, and replace 鳥兒.
  - Round 3: 待 (ㄉㄞ) corrected and one Japanese particle fixed.

Kept on purpose against Sol's suggestions: the series-wide 注音 conventions (故事 as ㄍㄨˋ ㄕˋ, and
full tones in 回來 and 回去). After the third round, a few wordings changed only so that the
narration would be read correctly: 湖中的家 (so it is not heard as 狐狸), ピピピ for the bird's
song, 「ガガ？ それって なあに？」, and a reordered Mandarin line on 巴冷's wedding day.

### Production notes (third batch)

- Pictures: 12 generation calls on the local gpt-image-2.5-flare, at medium quality, in 2×2
  sheets. Nine sheets covered the three books, and three mixed sheets redrew 11 pages. Every page
  was then compared at full size with its text and with the page before it. The redraws fixed:
  - the Rukai chief's headdress, which was drawn as a Plains-style feather bonnet and is now a
    headband with a few hawk-eagle feathers;
  - young Yaki in the memory picture, who looked like Yaway;
  - the sister returning clothes she was still wearing;
  - lilies that appeared before the text says they bloom;
  - a yellow bird on the 蛇郎君 cover before the bird appears in the story;
  - the hundred-pacer on the Rukai cover, which reared up and now rests coiled.
  Where the picture differs from the plan in a small way, the alt text describes what is actually
  drawn. One is Yaway's loom in p08, which is a small floor frame.
- Narration: Gemini narration for every line in both languages, using the existing narrator
  voices, plus six new character voices (bride, sister, snake, balenge, adalio, chief) taken from
  the voices the Taiwan and Japanese series already use. Every clip was checked by transcription,
  and doubtful ones by a second phonetic (romaji or pinyin) pass. Clips that misread a name or a
  word were regenerated. The ja lines use hiragana `jaTts` overrides for ヤキ, ヤワイ and ガガ,
  and the zh lines use `zhTts` for 姊 (read as 姐, so 姊妹 is not read zǐmèi). The Latin names in
  the Mandarin text (Yaway, Yaki, gaga, hongu' utux) are read as a Mandarin speaker would say them.

