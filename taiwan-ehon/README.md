# 台灣故事繪本 Taiwan Ehon — story notes and sources

This page shares Taiwanese stories bilingually (Japanese / Taiwan Mandarin) with a young child
growing up in Japan. Each story is a gentle retelling for ages 4–7, not a transcription of a single
"true" version — Taiwanese and Indigenous oral traditions have many tellings, and this book always
tries to say so rather than presenting one version as definitive.

The two launch stories, 白賊七 and 射日英雄, are documented where they were added. This section
covers the second batch of three stories, prepared alongside a parallel batch (邵族白鹿傳說,
新埔顯伯公, 大甲媽祖遶境進香) recommended by the same research review.

## Analytics and reading privacy

This storybook uses the existing GA4 tag (`G-QLFWNZWDSS`) for its page views and five small events, with only the listed parameters:

- `book_open` (`book_id`: a fixed story id), when a book is opened from the bookshelf
- `book_complete` (`book_id`: a fixed story id), once per opening upon reaching its ending page
- `listen_mode_change` (`listen_mode`: `ja-zh`, `zh-ja`, `ja`, or `zh`), when listening order changes
- `zhuyin_toggle` (`zhuyin`: `on` or `off`), when 注音 visibility changes
- `auto_turn_toggle` (`auto_turn`: `on` or `off`), when auto-turn changes

Every one of those five events also carries `series_id: "taiwan"` (added when this storybook moved
onto the shared multi-series engine — see "The shared engine" below). `book_id` itself is
unchanged: it stays the bare story id it always was (`bai-zei-qi`, not `taiwan:bai-zei-qi`), so
historical reports are not affected. `page_view` is unchanged and does not carry `series_id` —
its `page_location` already identifies the series by URL.

`book_id`, `listen_mode`, `zhuyin`, `auto_turn`, and `series_id` only appear in GA reports after
registration as event-scoped custom dimensions in GA Admin → Custom definitions. That
registration must be done by a GA administrator; this repository cannot do it — `series_id` is a
new dimension and needs its own registration, the same as the first four already did. No story
text, page-by-page or sentence-level events, timing, durations, or user identifiers beyond GA
defaults are sent. Shared click and copy tracking stays off via `data-analytics-ignore`. Each
book has its own path (`/taiwan-ehon/<book-id>/`) and its own GA4 page view — `page_location` is
that path, `page_title` is the book's title — so which book someone opens is now visible in the
URL and in page views, the same information `book_open` already reported. Page turns, sentence
taps, and reading position stay out of the URL, hash, and page views entirely; only the book
selection appears there. App navigation writes only shelf and book paths, never page, sentence,
or query state. Referrer stays trimmed to its origin. Settings are saved locally on the device
for reading, but nothing new is stored in the browser for analytics; no reading history is saved.

## The shared engine, and why this page's URL and behavior did not change

`app.js`, `ehon.js`, `offline.js`, `sw.js`, `generate-book-pages.js`, `test-dom.js`, and their
tests are no longer written here — they are unmodified copies of `../engine/`, synced by
`node engine/build.js` (CI runs `node engine/build.js --check` and fails if a copy has drifted
from the engine source). `series.config.js` and `theme.css` are this folder's own: they are the
only two files that make this page behave and look like taiwan-ehon rather than any other
series, and every value in `series.config.js` is exactly what the pre-refactor `app.js`
hard-coded (its `SHELF_MARKER`, `HINT`, `UNAVAILABLE`, page titles, etc.), so nothing about this
page's rendering or behavior changed. `ehon.css` is `theme.css`'s color tokens followed by
`engine/ehon.css`'s shared layout rules, concatenated by the same build step into one file — the
served `ehon.css` is byte-identical to what this page shipped before the refactor.

This refactor added exactly one visible-to-source-diff line to this folder's `index.html` and
every generated `<book>/index.html`: `<script src="./series.config.js"></script>`, needed so the
shared `app.js`/`offline.js`/`sw.js` can read this series' own identity in the browser. It adds no
element to the rendered page, is not part of the accessibility tree, and was verified (via a
`chrome-devtools`-captured DOM snapshot taken before and after the refactor) to produce an
otherwise pixel-for-pixel identical shelf and reader. This series also keeps every new
engine feature — a third (`en`) language, more than two listening-mode combinations, and the
"show only the narrated language" toggle — turned off (see `japan-ehon/README.md` for the
series that turns them on); `series.config.js`'s `languages: ["ja", "zh"]` and
`narratedOnlyToggle: false` are what turns them off here.

**This page's URL, and every one of its eight book URLs, will never move** without a separately
approved migration — they are shared publicly and installed as offline PWAs on real devices.
`engine/url-existence.test.js` fails CI if any of them stop existing.

The storybook is also installable as an offline-capable app (a web manifest and service worker at `taiwan-ehon/`). The service worker caches the app shell and book pages; online picture and audio requests refresh cached media so same-name story updates appear, while offline requests fall back to the cached copy. Cached audio Range requests return immediately while a background refresh updates the full cached file. "Read offline"/"download offline" stores the chosen book's pictures and narration in the browser's on-device Cache Storage. "Remove offline copy" removes that book's pictures and narration, while the app shell remains cached. Download and reading choices stay on that device and browser profile and are not sent anywhere. GA4 requests are never cached and are skipped entirely while offline.

## Listening with the screen off

With 自動翻頁 (auto-turn) on, narration is designed to continue sentence by sentence and page by page — in whichever listening mode is selected — when the app is backgrounded or the screen is off. A hidden tab skips the usual pauses between clips and pages because its timers can be suspended; playback chains through one audio element, and the page shown catches up with what's playing when the screen comes back on. The Media Session API also exposes the book's title and cover, plus play, pause, and next/previous page controls.

That per-clip chaining still depends on the browser keeping the page's own JavaScript timers and `ended` event running while the screen is off, which Android Chrome does not reliably do. 「がめんを けしても よみつづける ・ 關掉螢幕也繼續唸」 is a second, engine-wide option (shared by every series — see `../engine/README.md`) built specifically for that case: turning it on joins the whole book's clips for the selected listening mode, plus short silence clips for the pauses between them, into one continuous audio file in memory before playback starts, so there is only ever one already-started `<audio>` element for Android to keep alive — no per-clip re-arming required. Every clip's exact duration is precomputed at build time (`engine/generate-audio-timing.js`, via ffprobe, into this folder's own `audio-timing.js`), so the page and highlighted sentence can be recovered from the audio's own playback position alone, even after the screen was off long enough that no UI update ran; next/previous page (on-screen or from the lock screen) seeks within that same file instead of restarting anything. No second copy of any clip is stored — the joined file is assembled from the same per-clip URLs the offline download and sentence-by-sentence modes already use, and is discarded once played. This mode was built and tested for Android Chrome first, per the request that prompted it; automated tests cover the timing math, and manual testing covered simulated hidden/visible transitions in a desktop browser, but a real screen-locked Android device was not available to verify against. iOS Safari's background/lock-screen behavior — for either listening mode — was not verified.

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
