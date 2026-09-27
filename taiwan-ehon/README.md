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

`book_id`, `listen_mode`, `zhuyin`, and `auto_turn` only appear in GA reports after registration as event-scoped custom dimensions in GA Admin → Custom definitions. That registration must be done by a GA administrator; this repository cannot do it. No story text, page-by-page or sentence-level events, timing, durations, or user identifiers beyond GA defaults are sent. Shared click and copy tracking stays off via `data-analytics-ignore`. Each book has its own path (`/taiwan-ehon/<book-id>/`) and its own GA4 page view — `page_location` is that path, `page_title` is the book's title — so which book someone opens is now visible in the URL and in page views, the same information `book_open` already reported. Page turns, sentence taps, and reading position stay out of the URL, hash, and page views entirely; only the book selection appears there. App navigation writes only shelf and book paths, never page, sentence, or query state. Referrer stays trimmed to its origin. Settings are saved locally on the device for reading, but nothing new is stored in the browser for analytics; no reading history is saved.

## 虎姑婆 (hu-gu-po)

A gentle, agency-forward retelling: two children notice a night visitor isn't quite who she claims
to be, quietly signal each other, and call neighbors for help. Nobody is bitten, threatened, or
punished — the story is about noticing, teamwork, and asking a trusted adult for help, not about
frightening a child into obedience.

- **Origin note:** 虎姑婆 is a familiar Hoklo-language nursery/story tradition told across Taiwan
  (and the wider "tiger/wolf grandmother" tale family in East Asia more broadly), not a single
  fixed text — versions vary widely in what the visitor does and how the story ends.
- Ministry of Culture, on the picture-book "虎姑婆" having multiple versions and a "cute rather than
  scary" stage retelling: <https://www.moc.gov.tw/News_Content.aspx?n=105&s=241754>
- National Digital Library of Theses and Dissertations, research on the 虎姑婆 tale type and its
  variants: <https://ndltd.ncl.edu.tw/handle/84455009596318345178>

## 青瞑龍蛇 (qing-mi-long-she)

A Tainan/台江-area river legend, retold as a story about a river that changes course after heavy
rain, and a community that learns to watch the water and prepare together — not a disaster scene
or a punitive battle with a deity. "青瞑" is a Taiwanese (Hokkien) name for the dragon and snake in
this local tradition; the story keeps it as their name without using it as a joke about blindness
or disability.

- **Origin note:** this is a localized Tainan/台江 water-and-landscape legend, distinct from
  general dragon myths — the published adaptation this book draws on is itself a modern puppet-play
  retelling, not a transcript of one unchanged oral version.
- National Museum of Taiwan History, "扛茨走溪流：臺江風土與自然", on how Tainan/台江 communities
  understood the shifting Tsengwen River (including the "青暝蛇" river-as-serpent image) and adapted
  by moving with it: <https://the.nmth.gov.tw/nmth/zh-tw/Special/SpecialDetail/997cbb8c-04de-41f8-90ca-de9ac8b92778>
- Ministry of Culture puppet-script, 《青瞑的龍蛇無青瞑》, the modern adaptation this retelling draws
  its gentler ending from: <https://file.moc.gov.tw/Download.ashx?n=MjAyNOWFkuerpeW4g%2Biii%2BaIsuWKh%2BacrOWJteS9nOW%2BtemBuC3kvZzlk4Hos4fmlpnooajjgJDlhKrpgbjjgIrpnZLnnpHnmoTpvo3om4fnhKHpnZLnnpHjgIvjgJEucGRm&u=LzAwMS9VcGxvYWRvLzQ5Mi9yZWxmaWxlLzE2MDcwLzI0NDI2Mi9mODg0ODFmMi1jYmI5LTQ1N2YtODA0OC05ODdlOTRlMTllZjUucGRm
  (the direct PDF fetch returned HTTP 404 for the researcher who cataloged this source; treat the
  link as unverified until someone can open it directly, and rely on the NMTH source above for the
  factual grounding used in this retelling)

## 阿拉巴耐的石頭 (a-la-ba-nai) — a Malan Amis stone-birth origin story

A quiet, poetic account of Arapanay (阿拉巴耐), a coastal place in southern Taitung where Malan Amis
(馬蘭阿美) elders say the first ancestors appeared beside the large stones, and which Hengchun Amis
and Puyuma communities also trace part of their own history to. This is deliberately **not** framed
as "the Amis creation story" — the Council of Indigenous Peoples' own materials distinguish northern
Amis divine-descent traditions from southern Amis stone-birth traditions, and even among southern
communities the tellings differ. This book presents one community's living, still-practiced telling,
tied to a named place, and says plainly that other Amis villages tell different origin stories.

- **Origin note:** credited specifically to Malan Amis (with Hengchun Amis and Puyuma communities
  sharing a connection to the same place, Arapanay/阿拉巴耐, also known in Puyuma tradition as
  Panapanayan) — not presented as a pan-Amis or "the" Indigenous origin story.
- Council of Indigenous Peoples, "阿美族", on the north/south divine-descent vs. stone-birth origin
  distinction: <https://www.cip.gov.tw/zh-tw/tribe/grid-list/DBADF0287998968BD0636733C6861689/info.html?cumid=8F19BF08AE220D65>
- 臺灣原住民族事典 (Taiwan Indigenous Peoples' encyclopedia), on Malan/Hengchun Amis stone-birth
  origin traditions tied to Arapanay and its relationship to the Puyuma Panapanayan tradition:
  <https://aborgpedia.alcd.center/detail?cat=32&id=2387&race=0&search=&writer=>
- 自由時報 (Liberty Times), on the Malan Amis community's own recent reenactment of their ancestors'
  landing at the Arapanay site, the living practice this book's raft scenes are based on:
  <https://news.ltn.com.tw/news/life/breakingnews/5470073>

## Production notes (all three stories)

- Illustrations: original picture-book-style artwork generated locally (gpt-image-2.5-flare, medium
  quality, 2×2 sheets), inspected page-by-page against the story text before use. No stereotyped
  Indigenous costuming or invented ceremonial symbols were used for 阿拉巴耐的石頭; community members
  are shown in plain daily clothing, at a respectful distance rather than close caricature.
- Narration: build-time Gemini narration for every sentence in both languages, following the same
  per-character voice and storyteller-style convention as the launch stories.
- Registered in `stories.js` alongside 邵族白鹿傳說, 新埔顯伯公, and 大甲媽祖遶境進香 (the parallel
  batch recommended by the same research review), after the launch pair.
