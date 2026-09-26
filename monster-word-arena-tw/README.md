# Dino & Monster Word Arena

A separate, static, phone-friendly game in the OAI HTML gallery. Children choose a dinosaur or monster, switch among addition, colors, face parts, and family words, and spar with a pretend face-off: each correct answer launches the champion's silly power move (Rex's Tail Swish or Bobo's Bubble Blast), the sparring buddy wobbles and giggles, and one of its three ⚡ power pips fades. When the buddy is out of power it takes a bow and high-fives the child. Misses are a harmless pillow block that only invites another try. No injuries, lives, lost stars, harsh loss, accounts, or saved answers. Every prompt is pictorial for pre-readers: addition shows countable eggs, and each color, face, or family prompt shows the same picture as its matching answer, with English and Taiwan Mandarin labels; the face and family pictures are original illustrations. Children can choose English, Taiwan Mandarin, or Japanese narration; narration stays silent until a voice, replay, or unmute is chosen, then the current question is spoken right away and automatically when a new question appears, with replay and mute controls. Speech is bundled as local MP3 assets, so the game makes no speech-service requests and remains playable if audio is unavailable. Every win also earns a sticker for a small sticker book, and a few wins unlock a costume the champion can wear (see [Stickers and costumes](#stickers-and-costumes)).

The Pages deployment injects Google Analytics (GA4) and the shared interaction-analytics helper into every published HTML page (see the root README and `.github/workflows/pages.yml`); this page is **not tracking-free**, and general page-engagement analytics remain enabled. Answer choices are anonymous buttons with no analytics IDs, labels, or event declarations, so the helper does not report which answer a child chose. The sticker book, costume, and reset buttons are anonymous in the same way, so opening the book, earning a sticker, or changing a costume is not reported either.

The game saves one thing, only in this browser on this device: the `localStorage` key `monsterWordArena.rewards.v1`, holding the number of matches won and each champion's chosen costume, for example `{"v":1,"wins":3,"wearing":{"dino":"crown","monster":null}}`. It never saves answer choices, questions, names, or anything that identifies the child, and it is never sent anywhere. At page load, a temporary `monsterWordArena.rewards.v1.probe` value is written and immediately removed to check that storage works. If the browser blocks storage, the game still plays and the stickers last only for the visit. A grown-up can erase the saved key from **Sticker book → For grown-ups → Clear sticker book**, which asks for a second tap to confirm; clearing the browser's site data also erases it.

## Research notes

### Sourced findings

- The National Association for the Education of Young Children (NAEYC) describes developmentally appropriate practice as strengths-based, play-based joyful learning, with meaningful child choice and agency. Its guidance also discusses repeated practice and culturally/linguistically affirming environments. [DAP: Teaching to Enhance Each Child’s Development and Learning](https://www.naeyc.org/resources/position-statements/dap/enhance-development/)
- NAEYC’s early-childhood article gives an example of using a joyful game to reinforce preschool numeracy. [The Power of Playful Learning in the Early Childhood Setting](https://www.naeyc.org/resources/pubs/yc/summer2022/power-playful-learning)
- Taiwan’s National Academy for Educational Research / Ministry of Education dictionaries use Traditional Chinese and list the selected Taiwan Mandarin terms: [small dictionary](https://dict.mini.moe.edu.tw/) (for example, 眼、鼻、耳、臉, and color entries) and the [family relationship table in the Concised Mandarin Chinese Dictionary](https://dict.concised.moe.edu.tw/appendix.jsp?ID=12&la=1&powerMode=0), which includes 爸爸、媽媽、哥哥、弟弟、姊姊、妹妹.

### Design judgment

Research suggests the value of play, choice, practice, and linguistic relevance; it does not prescribe this game’s specific rules. The short rounds, three-star finish, retry-without-penalty feedback, selectable champion and learning topic, and pretend power moves with a wobble-and-giggle reaction in place of hits are design choices intended to keep the play legible, encouraging, and gentle for a five-year-old. Vocabulary prompts use Taiwan Mandarin (not Taiwanese Hokkien) in Traditional Chinese characters and familiar Taiwan forms (including 姊姊); English is shown alongside them.

## Original picture art

The eyes, nose, ears, Dad, Mom, older brother (哥哥), and older sister (姊姊) pictures in `images/` are original illustrations made for this game, used as both the question picture and the matching answer picture. Each answer keeps its Traditional Chinese and English words as its text label, and each picture carries the same bilingual alt text inside an element hidden from screen readers, so words are not announced twice. If a picture cannot load, its former emoji (👀 👃 👂 👨 👩 👦 👧) takes its place.

The art came from one `gpt-image-1.5` image request on 2026-09-26 (quality `low`, transparent background, PNG, 1024×1024 requested and 1254×1254 returned): a 3×3 sheet holding the seven pictures plus a spare front-view nose and single ear, which are unused. After inspecting the whole sheet, each picture was cropped along the sheet's measured gutters (some art crosses the equal-cell lines), faint background haze below alpha 16 was cleared, each face part was fitted to its own square, and the four family portraits share one scale. Each was saved as a 192×192 WebP with alpha, about 61 KB for all seven. Only the cropped pictures are committed. The prompt, with the grid paragraph added by the generation script at the end:

```text
Original, friendly picture-card icons for a gentle learning game for a five-year-old. Style: cute flat sticker illustration like a warm children's picture book, simple rounded shapes, one consistent thick smooth dark plum-brown outline on every icon, soft pastel colors with gentle two-tone cel shading, bold simple shapes that stay readable when shown very small on a phone. Every icon is centered in its own cell at the same scale, filling about 70 percent of the cell, on a fully transparent background with no drop shadow, frame, badge, circle, or backdrop.

The people are one fictional, generic, warm and loving family, not real people and not any existing characters. They share one consistent look: warm light-tan skin, rosy cheeks, dark brown-black hair, friendly dot eyes with a tiny shine, and happy smiles. Each person is shown head and shoulders, facing forward. The two grown-ups have longer faces and broader shoulders; the two children have rounder, younger faces.

Cells in reading order, left to right, top to bottom:
1. Eyes: a pair of big, round, friendly cartoon eyes side by side, dark brown irises with white shine highlights and small curved eyebrows. Only the eyes and eyebrows, no face.
2. Nose: one cute cartoon human nose in side profile, with a rounded tip and a small nostril curve, warm light-tan skin with a rosy tip. Only the nose, no face.
3. Ears: a pair of rounded cartoon human ears side by side, a left ear and a right ear, warm light-tan skin with a pink inner curl. Only the ears, no head.
4. Dad: a smiling grown-up man with short neat side-parted hair, friendly rectangular glasses, a small tidy mustache, and a blue collared shirt.
5. Mom: a smiling grown-up woman with long hair past her shoulders, small round earrings, a simple necklace, and a coral-pink blouse.
6. Older brother: a cheerful boy about nine years old with short spiky hair, a big grin, and a green T-shirt.
7. Older sister: a cheerful girl about nine years old with two pigtails tied with yellow bows and a lavender T-shirt.
8. Nose, second version: one cute cartoon human nose seen from the front, a soft rounded button nose with two small nostrils, warm light-tan skin. Only the nose.
9. Ear, second version: one single large rounded cartoon human ear seen from the side, with a clear pink inner curl, warm light-tan skin. Only the ear.

Make ONE square atlas with exactly 9 separate icons in a strict 3-by-3 equal-cell grid. One original icon per cell; consistent scale and style; transparent background; ample clear gutters and margins; do not overlap or connect cells. No letters, numbers, labels, watermark, or logos.
```

## Stickers and costumes

A reason to replay, with nothing to lose: winning a match (three right answers) earns the next of 12 stickers (star, rainbow, heart, balloon, sun, medal, cupcake, bubbles, flower, moon, dino egg, lollipop), shown on the finish screen and collected in the **Sticker book** (貼紙本). After all 12, further wins add a ×2, ×3 count to each sticker in turn. The 2nd, 4th, 6th, and 8th wins unlock a crown, party hat, flower crown, and propeller cap; each unlock is put on the champion who just won, and the sticker book lets the child dress Rex or Bobo in any unlocked costume or take it off. There are no timers, streaks, penalties, losses, or purchases, and a miss never removes anything.

A costume is a small overlay placed just above the champion picture in the arena and on the champion card, so it keeps working if the champion art changes. Rewards live in `rewards.js` (saved-state rules) and `rewards-app.js` (sticker book, finish-screen note, and overlays); `app.js` only calls `window.ArenaRewards?.recordWin(champion)` when a match is won, so the game plays normally without them. Every sticker and costume has its Traditional Chinese and English name as text; the pictures carry the same bilingual alt text inside elements hidden from screen readers, and each falls back to an emoji (⭐ 🌈 💖 🎈 ☀️ 🏅 🧁 🫧 🌼 🌙 🥚 🍭 👑 🎉 🌸 🧢) if its picture cannot load.

The 16 sticker and costume pictures in `images/sticker-*.webp` and `images/costume-*.webp` are original illustrations made for this game in the same style as the face and family pictures. They came from one `gpt-image-1.5` image request on 2026-09-26 (quality `low`, transparent background, PNG, 1024×1024 requested and 1254×1254 returned): a 4×4 sheet with all 16 pictures, none unused. After inspecting the whole sheet, each picture was separated by its connected shapes (a few cross the equal-cell lines), faint background haze below alpha 16 was cleared, and each was fitted to its own square (costumes aligned to the bottom so they sit on a head) and saved as a 160×160 WebP with alpha, about 120 KB for all 16. Only the cropped pictures are committed. The prompt, with the grid paragraph added by the generation script at the end:

```text
Original, friendly reward sticker icons for a gentle learning game for a five-year-old. Style: cute flat sticker illustration like a warm children's picture book, simple rounded shapes, one consistent thick smooth dark plum-brown outline on every icon, soft pastel colors with gentle two-tone cel shading, bold simple shapes that stay readable when shown very small on a phone. Every icon is centered in its own cell at the same scale, filling about 70 percent of the cell, on a fully transparent background with no drop shadow, frame, badge, circle, or backdrop. Where an icon has a face, it is a simple happy face with friendly dot eyes with a tiny shine, rosy cheeks, and a small smile. Nothing scary, no weapons, no people, and not any existing characters or brands.

Cells in reading order, left to right, top to bottom:
1. Star: a plump golden-yellow five-pointed star with rounded points and a happy face.
2. Rainbow: a chubby pastel rainbow arch resting on two small fluffy white clouds.
3. Heart: a soft pink heart with a happy face.
4. Balloon: one round red balloon with a small tie knot and a short curly string.
5. Sun: a round warm-yellow sun with short rounded rays and a happy face.
6. Medal: a round gold medal with a small embossed star, hanging from a short blue ribbon.
7. Cupcake: a cupcake with a pink swirl of frosting, a red cherry on top, and a mint-green paper cup.
8. Bubbles: a cluster of three shiny, see-through pale-blue soap bubbles of different sizes with white shine marks.
9. Flower: a daisy with white rounded petals, a yellow center with a happy face, and a short green stem with one leaf.
10. Moon: a pale-yellow crescent moon with a sleepy, smiling face and one tiny star beside it.
11. Dino egg: a cream egg with mint-green spots, a small zigzag crack near the top, and two little sparkles.
12. Lollipop: a round swirl lollipop in pink, yellow, and sky blue on a short white stick.
13. Crown: a small golden crown with five rounded points, a round gem on each point, and a flat bottom band, seen from the front. Only the crown, no head.
14. Party hat: a cone-shaped party hat with pastel purple and yellow stripes, a fluffy pink pompom on top, and a flat bottom edge, seen from the front. Only the hat, no head.
15. Flower crown: a wide, gently curved band of small pastel pink, yellow, and white flowers with green leaves, seen from the front like a headband. Only the flower crown, no head.
16. Propeller cap: a round beanie cap with rainbow-colored panels, a short brim, and a small red propeller on top, seen from the front. Only the cap, no head.

Make ONE square atlas with exactly 16 separate icons in a strict 4-by-4 equal-cell grid. One original icon per cell; consistent scale and style; transparent background; ample clear gutters and margins; do not overlap or connect cells. No letters, numbers, labels, watermark, or logos.
```

## Local speech assets

`audio/prompts.json` is the source for the 15 question prompts in each language. All 45 prompt clips are generated at build time with [Gemini 3.8 Flash TTS](https://aistudio.google.com/learn/gemini-3-8-flash-tts-developer-guide): English uses the child-friendly Aoede voice, Taiwan Mandarin uses Kore with the `zh-TW` locale and explicit Taiwan-Mandarin direction, and Japanese uses the `ja-jp-tutor-1` Tokyo Japanese voice. The Mandarin `family-sister` audio input uses 姐姐 (*jiějie*) to avoid Gemini reading 姊姊 with 姊's literary *zǐ* pronunciation; the visible prompt and answer label remain 姊姊. The game loads only bundled MP3s and makes no speech-service requests at runtime.

To regenerate clips, install `ffmpeg`, provide `GEMINI_JOHN_API_KEY` through a private build environment, and confirm the paid API requests:

```sh
python3 monster-word-arena-tw/generate_gemini_audio.py --confirm
```

`--overwrite` regenerates existing clips, `--clip <prompt-id>` (repeatable) limits generation to selected prompts, and `--language en|zh|ja` (repeatable) limits languages. For example, regenerate every English and Taiwan Mandarin prompt with Gemini:

```sh
python3 monster-word-arena-tw/generate_gemini_audio.py --overwrite --language en --language zh --confirm
```

Check current [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) before authorizing generation. Only the fixed prompt text is sent to Gemini during build-time generation. Never commit or expose the key. Speech is optional: language selection, replay, and mute are available in-game, while answer buttons remain usable if playback is unavailable.

## Local checks

```sh
node --test monster-word-arena-tw/game.test.js monster-word-arena-tw/rewards.test.js
python3 .github/scripts/validate_pages.py
```
