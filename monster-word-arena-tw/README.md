# Dino & Monster Word Arena

A separate, static, phone-friendly game in the OAI HTML gallery. Children choose a dinosaur or monster, switch among six challenges (math, colors, body parts, family, animals, and fruit), and spar with a pretend face-off: each correct answer launches the champion's silly power move (Rex's Tail Swish or Bobo's Bubble Blast), the sparring buddy wobbles and giggles, and one of its three ⚡ power pips fades. When the buddy is out of power it takes a bow and high-fives the child. Misses are a harmless pillow block that only invites another try. No injuries, lives, lost stars, harsh loss, timers, accounts, or saved answers. A level choice starts on **Easy** (the original small sums up to 4 and three answer choices); **Harder** counts eggs up to ten, adds up to ten, and offers four answer choices. Both levels keep the three-star match and draw from the full word lists: 8 colors, 8 body parts, 7 family members, 8 animals, and 8 fruits. Questions are picked at random without asking the same question twice in a row, and switching the level or challenge keeps earned stars. Every prompt is pictorial for pre-readers: math shows countable eggs (Harder counting questions group them in fives), each color prompt shows the answer's swatch, and each body, family, animal, or fruit prompt shows the same picture as its matching answer, with English and Taiwan Mandarin labels; those pictures are original illustrations. Children can choose English, Taiwan Mandarin, or Japanese narration; no voice is shown as selected and an invitation saying that choosing a voice turns on the questions and cheers stays visible until a voice, replay, or unmute turns narration on. The current question is then spoken right away and automatically when a new question appears, with replay and mute controls. Once narration is on, short spoken reactions in the same language cheer a right answer and its power move, give a gentle try-again on a miss, and celebrate the final high-five; they follow the mute control and share the question's player, so the next question, a language, level, topic, or champion switch, or a restart cuts off any reaction still playing. Speech is bundled as local MP3 assets, so the game makes no speech-service requests and remains playable if audio is unavailable. The game also has collectible stickers and unlockable costumes (see [Stickers and costumes](#stickers-and-costumes)).

The Pages deployment injects Google Analytics (GA4) and the shared interaction-analytics helper into every published HTML page (see the root README and `.github/workflows/pages.yml`); this page is **not tracking-free**, and general page-engagement analytics remain enabled. Answer choices are anonymous buttons with no analytics IDs, labels, or event declarations, so the helper does not report which answer a child chose. The sticker book, costume, and reset buttons are anonymous in the same way, so opening the book, earning a sticker, or changing a costume is not reported either.

The game saves one thing, only in this browser on this device: the `localStorage` key `monsterWordArena.rewards.v1`, holding the number of matches won and each champion's chosen costume, for example `{"v":1,"wins":3,"wearing":{"dino":"crown","monster":null}}`. It never saves answer choices, questions, names, or anything that identifies the child, and it is never sent anywhere. At page load, a temporary `monsterWordArena.rewards.v1.probe` value is written and immediately removed to check that storage works. If the browser blocks storage, the game still plays and the stickers last only for the visit. A grown-up can erase the saved key from **Sticker book → For grown-ups → Clear sticker book**, which asks for a second tap to confirm; clearing the browser's site data also erases it.

## Research notes

### Sourced findings

- The National Association for the Education of Young Children (NAEYC) describes developmentally appropriate practice as strengths-based, play-based joyful learning, with meaningful child choice and agency. Its guidance also discusses repeated practice and culturally/linguistically affirming environments. [DAP: Teaching to Enhance Each Child’s Development and Learning](https://www.naeyc.org/resources/position-statements/dap/enhance-development/)
- NAEYC’s early-childhood article gives an example of using a joyful game to reinforce preschool numeracy. [The Power of Playful Learning in the Early Childhood Setting](https://www.naeyc.org/resources/pubs/yc/summer2022/power-playful-learning)
- Taiwan’s National Academy for Educational Research / Ministry of Education dictionaries use Traditional Chinese and list the selected Taiwan Mandarin terms: [small dictionary](https://dict.mini.moe.edu.tw/) (for example, 眼、鼻、耳、臉, and color entries) and the [family relationship table in the Concised Mandarin Chinese Dictionary](https://dict.concised.moe.edu.tw/appendix.jsp?ID=12&la=1&powerMode=0), which includes 爸爸、媽媽、哥哥、弟弟、姊姊、妹妹.
- The added words were checked on 2026-09-26 against the same Ministry of Education dictionaries. The [Concised Mandarin Chinese Dictionary](https://dict.concised.moe.edu.tw/) lists 紅色、藍色、咖啡色、粉紅、爺爺、奶奶、寶寶、頭髮、牙齒、兔子、大象、猴子、蘋果、香蕉、葡萄、草莓、西瓜、鳳梨、芒果、and 櫻桃; the [Revised Mandarin Chinese Dictionary](https://dict.revised.moe.edu.tw/) lists 嘴巴; and the small dictionary lists the single characters 手、腳、橘、紫、狗、貓、鳥、魚、and 豬. 橘色 (orange) and 粉紅色 (pink) are not dictionary headwords, but are the everyday Taiwan forms built from the listed 橘 and 粉紅 plus 色, like 紅色; 小狗、小貓、小鳥、小魚、and 小豬 add the familiar 小 diminutive used with young children. 爺爺 and 奶奶 are the paternal grandparents, the forms most picture books use.

### Design judgment

Research suggests the value of play, choice, practice, and linguistic relevance; it does not prescribe this game’s specific rules. The short rounds, three-star finish, retry-without-penalty feedback, selectable champion and learning topic, and pretend power moves with a wobble-and-giggle reaction in place of hits are design choices intended to keep the play legible, encouraging, and gentle for a five-year-old. Vocabulary prompts use Taiwan Mandarin (not Taiwanese Hokkien) in Traditional Chinese characters and familiar Taiwan forms (including 姊姊, 橘色, 咖啡色, and 鳳梨); English is shown alongside them. The easy/harder choice defaults to Easy so the first match always matches the original difficulty; Harder keeps the three-star match because counting to ten already makes each question longer.

## Original picture art

Every body-part, family, animal, and fruit picture in `images/` is an original illustration made for this game, used as both the question picture and the matching answer picture. Each answer keeps its Traditional Chinese and English words as its text label, and each picture carries the same bilingual alt text inside an element hidden from screen readers, so words are not announced twice. If a picture cannot load, an emoji (for example 👀 👃 👂 👨 👩 👦 👧 🐶 🍎) takes its place. Colors need no pictures: each shows a round swatch, and the game stays fully playable without images or audio.

### First sheet: eyes, nose, ears, and the family of four

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

### Second and third sheets: more body parts, grandparents, baby, animals, and fruit

The 24 newer pictures came from two more `gpt-image-1.5` requests on 2026-09-26 (quality `low`, transparent background, PNG, 1254×1254 returned), each a 4×4 sheet. The people-and-body sheet asked for two versions of each of its eight subjects; after inspecting both versions, the game uses the closed-lips mouth, the single tooth (so the word is *tooth*, 牙齒), the short hair, the open hands, the feet seen from above, the bald grandpa with a mustache, the grandma with a bun and glasses, and the baby with a bib. The other eight versions are unused. The animals-and-fruit sheet is used whole. Some art crosses the equal-cell lines, so each picture was cut out by its own connected shapes rather than by equal cells, faint background haze below alpha 16 was cleared, and each body part, animal, and fruit was fitted to its own square; the three new family portraits share one scale and sit on the bottom edge like the first four. Each was saved as a 192×192 WebP with alpha, about 200 KB for all 24. Only the cropped pictures are committed. The two prompts, each with the grid paragraph the generation script adds at the end:

```text
Original, friendly picture-card icons for a gentle learning game for a five-year-old. Style: cute flat sticker illustration like a warm children's picture book, simple rounded shapes, one consistent thick smooth dark plum-brown outline on every icon, soft pastel colors with gentle two-tone cel shading, bold simple shapes that stay readable when shown very small on a phone. Every icon is centered in its own cell at the same scale, filling about 70 percent of the cell, on a fully transparent background with no drop shadow, frame, badge, circle, or backdrop.

The people are one fictional, generic, warm and loving family, not real people and not any existing characters. They share one consistent look: warm light-tan skin, rosy cheeks, friendly dot eyes with a tiny shine, and happy smiles. Each person is shown head and shoulders, facing forward. Body parts use the same warm light-tan skin and are shown alone, never attached to a face or body.

Cells in reading order, left to right, top to bottom:
1. Mouth: one happy cartoon mouth with rosy-pink lips in a gentle closed smile. Only the lips, no teeth, no face.
2. Teeth: a clean set of shiny white cartoon teeth, a top row and a bottom row of rounded teeth on soft pink gums, slightly apart. Only the teeth and gums, no lips, no face.
3. Hair: a fluffy cap of short dark brown-black child's hair with soft bangs, seen from the front, with no face, head, or skin inside it.
4. Hands: a pair of open cartoon child's hands side by side, palms facing forward, five fingers spread, a little bit of wrist. Only the hands.
5. Feet: a pair of bare cartoon child's feet side by side seen from above, five round toes on each foot. Only the feet and ankles.
6. Grandpa: a smiling grandfather with short white-gray hair, round glasses, gentle smile lines, and a warm brown cardigan over a white collared shirt.
7. Grandma: a smiling grandmother with white-gray hair in a neat round bun, small round glasses, a simple pearl necklace, and a soft purple cardigan.
8. Baby: a happy baby about one year old with a very round face, chubby rosy cheeks, one small curl of dark hair on top, and a pale yellow baby bib.
9. Mouth, second version: one cartoon mouth with rosy-pink lips in a big open smile showing a little white top teeth and a pink tongue. Only the mouth, no face.
10. Teeth, second version: one single big shiny white cartoon tooth with rounded roots and a small white sparkle. Only the tooth, with no face.
11. Hair, second version: long dark brown-black girl's hair seen from the back of the head, falling past the shoulders, with a small pink hair clip. No face or skin.
12. Hands, second version: a pair of cartoon child's hands waving hello, fingers together, a little bit of wrist. Only the hands.
13. Feet, second version: a pair of bare cartoon child's feet seen from the front, standing side by side with round toes. Only the feet and ankles.
14. Grandpa, second version: a smiling grandfather, bald on top with gray hair on the sides, a small gray mustache, and a green knitted vest over a white shirt.
15. Grandma, second version: a smiling grandmother with short curly white-gray hair, rosy cheeks, and a teal blouse with a small flower brooch.
16. Baby, second version: a happy baby about one year old with a round face and chubby cheeks, wearing a soft light-blue hooded romper with little ears on the hood.

Make ONE square atlas with exactly 16 separate icons in a strict 4-by-4 equal-cell grid. One original icon per cell; consistent scale and style; transparent background; ample clear gutters and margins; do not overlap or connect cells. No letters, numbers, labels, watermark, or logos.
```

```text
Original, friendly picture-card icons for a gentle learning game for a five-year-old. Style: cute flat sticker illustration like a warm children's picture book, simple rounded shapes, one consistent thick smooth dark plum-brown outline on every icon, soft pastel colors with gentle two-tone cel shading, bold simple shapes that stay readable when shown very small on a phone. Every icon is centered in its own cell at the same scale, filling about 70 percent of the cell, on a fully transparent background with no drop shadow, frame, badge, circle, or backdrop.

The animals are generic, original, gentle baby-like animals with friendly dot eyes with a tiny shine, rosy cheeks, and happy smiles, shown whole from head to feet, sitting or standing, with no clothes or accessories, not any existing characters. The fruits are simple, whole, fresh, and appetizing, with no faces.

Cells in reading order, left to right, top to bottom:
1. Dog: a light caramel-brown puppy with floppy ears and a wagging tail, sitting.
2. Cat: a soft gray kitten with a white chest, pointed ears, whiskers, and a curled tail, sitting.
3. Rabbit: a white bunny with long upright ears with pink insides and a round fluffy tail, sitting.
4. Bird: a small round sky-blue songbird with a yellow beak and little wings, standing.
5. Fish: a round orange goldfish with a flowing tail and fins, swimming sideways.
6. Elephant: a gray-blue baby elephant with big round ears and a curled-up trunk, standing.
7. Pig: a pink piglet with a round snout, small ears, and a curly tail, standing.
8. Monkey: a brown baby monkey with a light tan face and belly, round ears, and a long curly tail, sitting.
9. Apple: one shiny red apple with a short brown stem and one green leaf.
10. Banana: one curved yellow banana with a small brown tip.
11. Grapes: one bunch of round purple grapes with a short stem and one green leaf.
12. Strawberry: one red strawberry with little yellow seeds and green leafy top.
13. Watermelon: one triangle slice of watermelon with red flesh, black seeds, a white line, and green rind.
14. Pineapple: one golden-yellow pineapple with a criss-cross pattern and a spiky green leafy crown.
15. Mango: one whole ripe mango, smooth oval shape blending red, orange, and yellow, with a short stem and one long green leaf.
16. Cherries: two round red cherries hanging from joined green stems with one small leaf.

Make ONE square atlas with exactly 16 separate icons in a strict 4-by-4 equal-cell grid. One original icon per cell; consistent scale and style; transparent background; ample clear gutters and margins; do not overlap or connect cells. No letters, numbers, labels, watermark, or logos.
```

## Champion art and the arena show

Rex and Bobo are original characters drawn for this game in the same sticker style as the face and family pictures. `images/champion-rex.webp` and `images/champion-bobo.webp` are six-frame pose sheets (256×256 frames, left to right: ready, power move, pillow block, wobble-and-giggle, bow, high-five); the stylesheet picks a frame with `background-position`, and the sparring buddy on the right is mirrored so the two champions face each other. `images/arena-star.webp`, `arena-swish.webp` (Rex's Tail Swish), `arena-bubbles.webp` (Bobo's Bubble Blast), and `arena-trophy.webp` are the flying stars, the move effects, and the finish trophy. If any of these pictures cannot load, the champions, moves, and trophy go back to their emoji (🦖 👾 🌀 🫧 🏆), and star effects stay visible as text stars (★); the game plays the same.

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

## Stickers and costumes

A reason to replay, with nothing to lose: winning a match (three right answers) earns the next of 12 stickers (star, rainbow, heart, balloon, sun, medal, cupcake, bubbles, flower, moon, dino egg, lollipop), shown on the finish screen and collected in the **Sticker book** (貼紙本). After all 12, further wins add a ×2, ×3 count to each sticker in turn, up to a storage-safety limit of 9,999 recorded wins; later wins do not add stickers. The 2nd, 4th, 6th, and 8th wins unlock a crown, party hat, flower crown, and propeller cap; each unlock is put on the champion who just won, and the sticker book lets the child dress Rex or Bobo in any unlocked costume or take it off. Rewards have no timers or purchase requirements, and misses never remove anything.

A costume is a small overlay placed just above the champion picture in the arena and on the champion card, so it keeps working if the champion art changes. Rewards live in `rewards.js` (saved-state rules) and `rewards-app.js` (sticker book, finish-screen note, and overlays); `app.js` only calls `window.ArenaRewards?.recordWin(state.champion)` when a match is won, so the game plays normally without them. Every sticker and costume has its Traditional Chinese and English name as text; the pictures carry the same bilingual alt text inside elements hidden from screen readers, and each falls back to an emoji (⭐ 🌈 💖 🎈 ☀️ 🏅 🧁 🫧 🌼 🌙 🥚 🍭 👑 🎉 🌸 🧢) if its picture cannot load.

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

`audio/prompts.json` is the source for the 55 question prompts in each language, and `audio/reactions.json` is the source for the five spoken reactions (two praise lines, two gentle try-again lines, and one finish cheer). All 180 prompt and reaction clips are generated at build time with [Gemini 3.8 Flash TTS](https://aistudio.google.com/learn/gemini-3-8-flash-tts-developer-guide): English uses the child-friendly Aoede voice, Taiwan Mandarin uses Kore with the `zh-TW` locale and explicit Taiwan-Mandarin direction, and Japanese uses the `ja-jp-tutor-1` Tokyo Japanese voice. Every Harder counting question shares one `math-count` clip ("How many eggs? Let's count!"), so the narration never says the answer. The Mandarin `family-sister` audio input uses 姐姐 (*jiějie*) to avoid Gemini reading 姊姊 with 姊's literary *zǐ* pronunciation; the visible prompt and answer label remain 姊姊. Three more clips use the same override mechanism after transcription found misreadings: the Mandarin `animals-cat` input uses 猫 because 貓 was read with a rising *máo* instead of the dictionary's level *māo* (the screen still shows 小貓), and the Japanese `face-mouth` and `fruit-pineapple` inputs use お口を見つけてね！ and パイナップルを見つけてね！ because the all-kana くち and パイナップル were misread. The reaction lines avoid words Gemini tends to misread, such as 對打 before 小, which tone sandhi turns into a 對答-sounding *duì dá*. Every reaction clip was checked by transcription, with pinyin for Mandarin and a kana reading for Japanese. Every new question clip was checked by transcribing it back with whisper.cpp (large-v3-turbo) against its manifest text. The game loads only bundled MP3s and makes no speech-service requests at runtime.

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
node --test monster-word-arena-tw/*.test.js
python3 .github/scripts/validate_pages.py
```
