# Dino & Monster Word Arena

A separate, static, phone-friendly game in the OAI HTML gallery. Children choose a dinosaur or monster, switch among addition, colors, face parts, and family words, and spar with a pretend face-off: each correct answer launches the champion's silly power move (Rex's Tail Swish or Bobo's Bubble Blast), the sparring buddy wobbles and giggles, and one of its three ⚡ power pips fades. When the buddy is out of power it takes a bow and high-fives the child. Misses are a harmless pillow block that only invites another try. No injuries, lives, lost stars, harsh loss, accounts, or saved answers. Every prompt is pictorial for pre-readers: addition shows countable eggs, and each color, face, or family prompt shows the same picture as its matching answer, with English and Taiwan Mandarin labels; the face and family pictures are original illustrations. Children can choose English, Taiwan Mandarin, or Japanese narration; no voice is shown as selected and an invitation saying that choosing a voice turns on the questions and cheers stays visible until a voice, replay, or unmute turns narration on. The current question is then spoken right away and automatically when a new question appears, with replay and mute controls. Once narration is on, short spoken reactions in the same language cheer a right answer and its power move, give a gentle try-again on a miss, and celebrate the final high-five; they follow the mute control and share the question's player, so the next question, a language, topic, or champion switch, or a restart cuts off any reaction still playing. Speech is bundled as local MP3 assets, so the game makes no speech-service requests and remains playable if audio is unavailable.

The Pages deployment injects Google Analytics (GA4) and the shared interaction-analytics helper into every published HTML page (see the root README and `.github/workflows/pages.yml`); this page is **not tracking-free**, and general page-engagement analytics remain enabled. Answer choices are anonymous buttons with no analytics IDs, labels, or event declarations, so the helper does not report which answer a child chose. The game does not save answer choices.

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

## Champion art and the arena show

Rex and Bobo are original characters drawn for this game in the same sticker style as the face and family pictures. `images/champion-rex.webp` and `images/champion-bobo.webp` are six-frame pose sheets (256×256 frames, left to right: ready, power move, pillow block, wobble-and-giggle, bow, high-five); the stylesheet picks a frame with `background-position`, and the sparring buddy on the right is mirrored so the two champions face each other. `images/arena-star.webp`, `arena-swish.webp` (Rex's Tail Swish), `arena-bubbles.webp` (Bobo's Bubble Blast), and `arena-trophy.webp` are the flying stars, the move effects, and the finish trophy. If any of these pictures cannot load, the champions, moves, and trophy go back to their emoji (🦖 👾 🌀 🫧 🏆) and the game plays the same.

`arena.js` runs the show without changing the question rules. A right answer plays the champion's power move: the move flies across, the buddy wobbles and giggles, and a burst of stars pops. Answers right in a row show a combo badge above the champion; each new match starts at zero, and a miss quietly resets the streak without penalty. A miss is the buddy's pillow block. The winning answer continues into the buddy's bow and a shared high-five under a rainbow and a gentle star shower, and the finish card shows both champions with the trophy. Movement is soft and flash-free; with reduced motion the poses still change, but nothing flies, falls, or bobs. In the single-column phone layout on a screen at least 560px tall, the arena card compacts to a smaller stage and stays pinned at the top while the child scrolls to the answers, so the power move they earned is on screen with the question; it takes no more than about 40 percent of the screen (checked at 360×740 and 390×844), and the topic tabs, voice controls, and answers scroll clear of it when focused. The two-column desktop layout does not pin the arena.

The art came from one `gpt-image-1.5` image request on 2026-09-26 (quality `low`, transparent background, PNG, 1024×1024 requested and 1254×1254 returned): a 4×4 sheet with the twelve poses and the four effect sprites. After inspecting the whole sheet, each sprite was cropped along the sheet's measured gutters, faint background haze below alpha 16 was cleared, and the twelve poses were placed on one shared scale and feet baseline. The pose sheets were saved as WebP with alpha, about 100 KB for both, and the four sprites about 25 KB together. Only the final images are committed. The prompt, with the grid paragraph added by the generation script at the end:

```text
Original, friendly character sprites for a gentle pretend-sparring learning game for a five-year-old. Style: cute flat sticker illustration like a warm children's picture book, simple rounded shapes, one consistent thick smooth dark plum-brown outline on every sprite, soft pastel colors with gentle two-tone cel shading, bold simple shapes that stay readable when shown small on a phone. Every sprite is centered in its own cell on a fully transparent background with no drop shadow, ground, frame, badge, circle, or backdrop.

There are two original characters, not based on any existing character, mascot, toy, game, or show. Both are soft, round, and plush-toy cute, the same height, and always drawn as the same character in every cell.
- Rex: a chubby baby dinosaur with a soft leaf-green body, a big round head, a pale butter-yellow belly, rosy cheeks, a row of small rounded coral-orange back plates from the head down to the tail tip, tiny arms, short sturdy legs, and a short thick tail. Big friendly dark dot eyes with a white shine and a wide happy smile with no teeth. No clothes, shoes, saddle, or shell.
- Bobo: a small round fluffy monster shaped like a plump bean, soft lavender-purple fuzzy body, a lighter lilac tummy patch, two short rounded cream horns, rosy cheeks, short stubby arms with mitten hands, and short feet. Two big friendly dark eyes with a white shine and a wide happy smile with no teeth. No clothes.

Every character pose shows the whole body from head to feet and tail, fills about 75 percent of the cell height at the same scale, and is drawn in a three-quarter view turned toward the RIGHT side of the picture, as if facing a friend who stands to the right. The mood is playful pretend play: nobody is hurt, scared, or angry.

Cells in reading order, left to right, top to bottom:
1. Rex ready: standing in a bouncy, playful ready stance, tiny arms raised in soft little fists, knees slightly bent, a confident happy smile.
2. Rex Tail Swish: twirling playfully so the tail swishes out toward the right, two or three soft curved motion swoosh lines beside the tail, eyes happily closed.
3. Rex pillow block: hugging a big soft sky-blue square pillow held up in front like a shield, peeking over the top with a cheeky smile.
4. Rex wobble and giggle: wobbling off balance on one foot and leaning backward, eyes squeezed shut, laughing as if tickled, with two small curved wiggle lines beside the body.
5. Rex bow: taking a polite, happy bow toward the right, bending forward, eyes closed, smiling, one tiny arm across the tummy.
6. Rex high-five: stepping forward with one tiny arm raised high toward the upper right for a high-five, open hand, big joyful grin.
7. Bobo ready: standing in a bouncy, playful ready stance, mitten hands raised in soft little fists, a confident happy smile.
8. Bobo Bubble Blast: cheeks puffed, blowing a stream of shiny round soap bubbles from a small bubble wand held in one hand, the bubbles floating toward the right inside the cell.
9. Bobo pillow block: hugging the same big soft sky-blue square pillow held up in front like a shield, peeking over the top with a cheeky smile.
10. Bobo wobble and giggle: wobbling off balance on one foot and leaning backward, eyes squeezed shut, laughing as if tickled, with two small curved wiggle lines beside the body.
11. Bobo bow: taking a polite, happy bow toward the right, bending forward, eyes closed, smiling, one mitten hand across the tummy.
12. Bobo high-five: stepping forward with one mitten hand raised high toward the upper right for a high-five, open hand, big joyful grin.
13. Star: one plump five-point golden-yellow star with rounded points and a white shine highlight, no face.
14. Bubbles: a cluster of three shiny soap bubbles of different sizes, pale sky-blue with a soft rainbow sheen and white highlights, each clearly outlined.
15. Swish: a playful curly wind swirl made of two soft mint-green swoosh curls with three small round green leaves.
16. Trophy: a small shiny golden trophy cup with two round handles, a short base, and a simple star shape on the front.

Make ONE square atlas with exactly 16 separate icons in a strict 4-by-4 equal-cell grid. One original icon per cell; consistent scale and style; transparent background; ample clear gutters and margins; do not overlap or connect cells. No letters, numbers, labels, watermark, or logos.
```

## Local speech assets

`audio/prompts.json` is the source for the 15 question prompts in each language, and `audio/reactions.json` is the source for the five spoken reactions (two praise lines, two gentle try-again lines, and one finish cheer). All 60 prompt and reaction clips are generated at build time with [Gemini 3.8 Flash TTS](https://aistudio.google.com/learn/gemini-3-8-flash-tts-developer-guide): English uses the child-friendly Aoede voice, Taiwan Mandarin uses Kore with the `zh-TW` locale and explicit Taiwan-Mandarin direction, and Japanese uses the `ja-jp-tutor-1` Tokyo Japanese voice. The Mandarin `family-sister` audio input uses 姐姐 (*jiějie*) to avoid Gemini reading 姊姊 with 姊's literary *zǐ* pronunciation; the visible prompt and answer label remain 姊姊. The reaction lines avoid words Gemini tends to misread, such as 對打 before 小, which tone sandhi turns into a 對答-sounding *duì dá*. Every reaction clip was checked by transcription, with pinyin for Mandarin and a kana reading for Japanese. The game loads only bundled MP3s and makes no speech-service requests at runtime.

To regenerate clips, install `ffmpeg`, provide `GEMINI_JOHN_API_KEY` through a private build environment, and confirm the paid API requests:

```sh
python3 monster-word-arena-tw/generate_gemini_audio.py --confirm
```

Without `--overwrite`, only missing clips are generated. `--overwrite` regenerates existing clips, `--clip <clip-id>` (repeatable) limits generation to selected prompts or reactions, and `--language en|zh|ja` (repeatable) limits languages. For example, regenerate every English and Taiwan Mandarin prompt and reaction clip with Gemini:

```sh
python3 monster-word-arena-tw/generate_gemini_audio.py --overwrite --language en --language zh --confirm
```

Check current [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) before authorizing generation. Only the fixed prompt and reaction text is sent to Gemini during build-time generation. Never commit or expose the key. Speech is optional: language selection, replay, and mute are available in-game, while answer buttons remain usable if playback is unavailable.

## Sound effects and music

`sounds.js` synthesizes every effect and the music with the Web Audio API at play time: no audio files, stock or copyrighted samples, or network requests, and about 10 KB of code. The effects are short and non-speech: a soft tap when the child answers or presses a game button, rising twinkles for a right answer, an airy whoosh with the power move, a tiny "hee-hee" wobble for the sparring buddy, a bouncy pillow boing for a miss, and a small fanfare at the win. They start from the child's own taps, so they need no voice choice first.

Optional background music (a slow pentatonic lullaby loop) is off by default and has its own **🎵 Music · 音樂** toggle. The existing mute button silences everything: narration, effects, and music. Music stops while the page is hidden and resumes when it returns.

Effects and music play on their own `AudioContext`, never on the shared speech `<audio>` element, so they cannot cut off a question or spoken reaction. They also duck further while speech plays. Rendered offline in Chrome, each effect's loudest 50 ms sits about 14–24 dB below the narration clips, and the music sits about 25 dB below them. To keep sounds from piling up during rapid tapping, repeats of the same effect inside a short gap are dropped and a retriggered effect replaces the one still ringing, so each effect rings at most once at a time. Without Web Audio, the game stays silent and fully playable.

## Local checks

```sh
node --test monster-word-arena-tw/game.test.js
python3 .github/scripts/validate_pages.py
```
