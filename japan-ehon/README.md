# にほんの むかしばなし えほん Japan Ehon

A bilingual (Japanese / Taiwan Mandarin, with 注音) picture-book series of Japanese folktales for
young children, sharing its reading engine, offline PWA behavior, and analytics conventions with
[`../taiwan-ehon/`](../taiwan-ehon/README.md) — see that README's "The shared engine" section for
what is actually shared and why. This series is currently an empty-but-working shelf: the app,
PWA install, and offline plumbing all work today; stories are added by editing
[`stories/`](stories/README.md), not this file.

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
`engine/ehon.test.js` against a synthetic three-language fixture. It has not yet been exercised
against real story content or verified live in a browser, since this series has no stories yet;
the mode-selection wording in particular (`E.modeLabel`'s mechanical "X → Y" / "X だけ" fallback)
is a placeholder meant to be refined once real content exists to read it against.

## English narration

`generate_gemini_audio.py --language en` adds an `en` narration option, using the same
Gemini TTS voices/pipeline as `ja`/`zh` (see its own `--help`). Voice selection for a natural
English storyteller has **not yet been auditioned**: this environment had no `GEMINI_JOHN_API_KEY`
and no network access to the Gemini API, so the required 2–3-voice audition on one sentence could
not be run or recorded here. Before generating any real `en` narration: run the audition (three
candidate voices — reasonable starting points from Gemini's prebuilt voice set are `Kore`,
`Charon`, and `Umbriel` at `en-US` — on one representative sentence), record the chosen voice and
why in this README, and only then record real clips. `generate_gemini_audio.py` keeps logging
every call (including an audition) to the same local cost ledger (`tools/gemini_usage.py`) as
`ja`/`zh` generation.

## PWA

Its own manifest (`id`/`start_url`/`scope` all `/oai-html/japan-ehon/`), its own service-worker
scope and Cache Storage names (`japan-ehon-shell-v1` / `japan-ehon-media` — see
`engine/ehon.js`'s `cacheNames`), and its own icons, entirely independent of taiwan-ehon's.
Installing one series does not install or affect the other.

## Cross-links

This shelf links to `../taiwan-ehon/` (a "台灣故事繪本" pill in the header). The empty shelf is
intentionally omitted from the root gallery until its first stories are registered. That first
story batch should add its entry to `pages.json` and add the reciprocal Japan link to
`../taiwan-ehon/`; until then, the Taiwan storybook remains unchanged.
