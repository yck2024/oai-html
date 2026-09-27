# にほんの むかしばなし えほん Japan Ehon

A picture-book series of Japanese folktales for young children, in Japanese, Taiwan Mandarin (with
注音), and English, sharing its reading engine, offline PWA behavior, and analytics conventions with
[`../taiwan-ehon/`](../taiwan-ehon/README.md) — see that README's "The shared engine" section for
what is actually shared and why. Stories are added by editing [`stories/`](stories/README.md), not
this file; the sources and editorial changes behind each story are listed under "Story notes" below.

## Adding a story

See [`stories/README.md`](stories/README.md) for the exact per-story file format and the
registration steps (`node engine/build-stories.js`, then `node japan-ehon/generate-book-pages.js`,
then narration). Per the standing house rule, draft each story on Claude Opus and have GPT-6 Sol
review it adversarially before recording narration — the story is the part of this product most
worth getting right.

## Theme

Washi-paper cream (cooler and greyer than taiwan-ehon's warm rice-paper tone), indigo (藍) as the
primary accent, vermilion (朱) as a secondary highlight, and a low-opacity seigaiha (青海波)
wave motif behind the page — all in `theme.css`, following the CSS-variable/pattern-asset
mechanism `engine/ehon.css` already provides (no image-generation calls were used for the theme;
the wave pattern is CSS `radial-gradient`s). The series icon (`icons/`) is a simple sun-and-wave
motif in the same palette, generated locally with Pillow — not a depiction of any specific real
place, religious symbol, or franchise character.

## Languages and the narrated-language toggle

Unlike taiwan-ehon, this series' `series.config.js` sets `languages: ["ja", "zh", "en"]` and
`narratedOnlyToggle: true`. In practice:

- A reader can still only ever see **at most two languages at once** — the engine caps display at
  the current listening mode's pair (or, in a single-language mode, that language plus one
  companion), never all three (see `engine/ehon.js`'s `displayLanguagesFor` and
  `engine/ehon.test.js`'s dedicated test for this).
- Listening modes extend naturally to every ordered pair of the three languages (日→中, 中→日,
  日→英, 英→日, 中→英, 英→中) plus each single-language mode, generated automatically from
  `series.config.js`'s `languages` list — no per-mode UI to hand-maintain.
- The toggle itself — 「きいている ことばだけ ひょうじ ・ 只顯示正在聽的語言 ・ Show only the
  narrated language」 — hides the non-narrated companion language for a cleaner page in a
  single-language mode.
- English is entirely optional per line: a story with no `en` fields at all reads and narrates
  exactly as a `ja`/`zh` story would (see `stories/README.md`).

This is genuinely new engine capability (`engine/ehon.js`'s `buildListenModes` /
`displayLanguagesFor` / `modeLabel`, and the dynamic settings-panel rendering in `engine/app.js`
that only ever runs when a series' markup leaves `#modeOptions` empty), unit-tested in
`engine/ehon.test.js` against a synthetic three-language fixture. It has been checked in a real
browser against this series' first four books at 390×844, 820×1180, and 1024×768: every page, in
all nine listening modes, with the narrated-only toggle on and off, shows at most two languages
(one with the toggle on in a single-language mode). The mode-selection wording (`E.modeLabel`'s
mechanical "X → Y" / "X だけ" fallback) is still a placeholder meant to be refined.

## English narration

`generate_gemini_audio.py --language en` adds an `en` narration option, using the same
Gemini TTS pipeline as `ja`/`zh` (see its own `--help`), and it logs every call to the same local
cost ledger (`tools/gemini_usage.py`).

**English narrator voice: `Kore` (en-US).** Three candidates read the same line ("Long, long ago,
in a snowy mountain village, there lived an old man and an old woman. They were poor, but they
were very kind to each other.") through the generator's own request code: `Kore`, `Sulafat`, and
`Vindemiatrix`. All three transcribed back exactly. A Gemini listening check rated `Kore` highest
for warmth, naturalness, and storytelling (10/10 on each; the other two 9/10), with an unhurried
General American delivery. `Kore` is also the Mandarin narrator, so the storyteller sounds like the
same person in both. Character voices reuse each character's `zh` prebuilt voice for `en` (see
`SPEAKERS`), which keeps a character's timbre the same across the two languages.

## PWA

Its own manifest (`id`/`start_url`/`scope` all `/oai-html/japan-ehon/`), its own service-worker
scope and Cache Storage names (`japan-ehon-shell-v1` / `japan-ehon-media` — see
`engine/ehon.js`'s `cacheNames`), and its own icons, entirely independent of taiwan-ehon's.
Installing one series does not install or affect the other.

## Cross-links

This shelf links to `../taiwan-ehon/` (a "台灣故事繪本" pill in the header), and the Taiwan shelf links
back here (a "にほんの むかしばなし えほん ・ 日本民間故事繪本" link under its introduction, kept out of its
header so that header stays on one line on a phone) — the only change the Japanese series made to
the Taiwan storybook. Both are listed as live in the root gallery (`pages.json`).

## Story notes

Each story is a new retelling for ages 4–7, not a transcription of one fixed text; each book's
credit page says which version it follows and what it changes. Every story was drafted on Claude
Opus and revised over three rounds of adversarial review by GPT-6 Sol (coherence, age fit,
faithfulness, the naturalness of all three languages, and cultural respect).

### 笠地蔵 (kasa-jizo)

Follows the most common version: on New Year's Eve an old man who could not sell his five straw
hats puts them on six roadside Jizo and gives the sixth his own patched hat; that night the Jizo
bring rice, mochi, and vegetables. Jizo are introduced as Buddhist figures who watch over children
and travelers. For Taiwan readers the New Year food is 麻糬 and the day is called 日本的新年.

- Japanese Wikipedia, 「笠地蔵」, and the Kotobank entries it cites (日本大百科全書; 野村純一
  『昔話・伝説小事典』), on the number of statues, what the last one wears, and the gifts:
  <https://ja.wikipedia.org/wiki/笠地蔵>

### 桃太郎 (momotaro)

Follows the fruit-birth version fixed by Meiji-era school readers. There is no fight: the dog,
monkey, and pheasant each join for a dumpling and each has a job at the gate; the chasing oni trip
over each other; Momotaro helps the chief up, and the chief returns the village's rice and
treasures and promises to stop. No sword or weapon appears.

- Japanese Wikipedia, 「桃太郎」 (standard version, kibidango, the three companions, variants):
  <https://ja.wikipedia.org/wiki/桃太郎>
- National Museum of Taiwan History, on the tale's recognition and regional variation:
  <https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2010.019.2588.1551>

### かぐや姫 (kaguya-hime)

From 『竹取物語』. The five suitors' quests are shortened to two shown failures (the fire-rat robe
burns; the jewel branch is tied on with string). The emperor's guards, the feather robe that
erases her memories, and the elixir burned on Mount Fuji are left out, and her letter goes to the
old couple who raised her; they read it at every full moon.

- Japanese Wikipedia, 「竹取物語」: <https://ja.wikipedia.org/wiki/竹取物語>
- Library of Congress, illustrated 17th-century *Taketori monogatari* scroll:
  <https://www.loc.gov/item/2021667427/>

### 浦島太郎 (urashima-taro)

Follows the Meiji/Taishō school version (rescued turtle, Dragon Palace, forbidden box, centuries
passed). The children make way for the turtle when asked instead of being paid; Otohime warns that
time passes differently and that the box keeps him safe while shut; he opens it hoping to get back
to his mother, and grows old in soft smoke. The ending, in which an old villager takes him home and
listens to his story, is written for this book. The credit mentions the older crane ending.

- Japanese Wikipedia, 「浦島太郎」 (textbook, 御伽草子, 日本書紀 and 丹後国風土記 versions):
  <https://ja.wikipedia.org/wiki/浦島太郎>
- National Diet Library reference record on the tale's origins:
  <https://crd.ndl.go.jp/reference/entry/index.php?page=ref_view&id=1000184143>

### Production notes

- Illustrations: original artwork generated locally with gpt-image-2.5-flare at medium quality in
  2×2 sheets, in a soft washi-paper picture-book style with indigo and vermilion accents, and
  checked page by page against the text. No text, franchise likenesses, weapons, or scary imagery.
- Narration: Gemini narration for every sentence in Japanese, Taiwan Mandarin, and English (see
  "English narration"), checked by transcription.
