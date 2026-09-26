# Dino & Monster Word Arena

A separate, static, phone-friendly game in the OAI HTML gallery. Children choose a dinosaur or monster, switch among addition, colors, face parts, and family words, and spar with a pretend face-off: each correct answer launches the champion's silly power move (Rex's Tail Swish or Bobo's Bubble Blast), the sparring buddy wobbles and giggles, and one of its three ⚡ power pips fades. When the buddy is out of power it takes a bow and high-fives the child. Misses are a harmless pillow block that only invites another try. No injuries, lives, lost stars, harsh loss, accounts, or saved answers. Every prompt is pictorial for pre-readers: addition shows countable eggs, and each color, face, or family prompt shows the same picture as its matching answer, with English and Taiwan Mandarin labels. Children can choose English, Taiwan Mandarin, or Japanese narration; the current question is spoken on language selection and automatically when a new question appears, with replay and mute controls. Speech is bundled as local MP3 assets, so the game makes no speech-service requests and remains playable if audio is unavailable.

The Pages deployment injects Google Analytics (GA4) and the shared interaction-analytics helper into every published HTML page (see the root README and `.github/workflows/pages.yml`); this page is **not tracking-free**, and general page-engagement analytics remain enabled. Answer choices are anonymous buttons with no analytics IDs, labels, or event declarations, so the helper does not report which answer a child chose. The game does not save answer choices.

## Research notes

### Sourced findings

- The National Association for the Education of Young Children (NAEYC) describes developmentally appropriate practice as strengths-based, play-based joyful learning, with meaningful child choice and agency. Its guidance also discusses repeated practice and culturally/linguistically affirming environments. [DAP: Teaching to Enhance Each Child’s Development and Learning](https://www.naeyc.org/resources/position-statements/dap/enhance-development/)
- NAEYC’s early-childhood article gives an example of using a joyful game to reinforce preschool numeracy. [The Power of Playful Learning in the Early Childhood Setting](https://www.naeyc.org/resources/pubs/yc/summer2022/power-playful-learning)
- Taiwan’s National Academy for Educational Research / Ministry of Education dictionaries use Traditional Chinese and list the selected Taiwan Mandarin terms: [small dictionary](https://dict.mini.moe.edu.tw/) (for example, 眼、鼻、耳、臉, and color entries) and the [family relationship table in the Concised Mandarin Chinese Dictionary](https://dict.concised.moe.edu.tw/appendix.jsp?ID=12&la=1&powerMode=0), which includes 爸爸、媽媽、哥哥、弟弟、姊姊、妹妹.

### Design judgment

Research suggests the value of play, choice, practice, and linguistic relevance; it does not prescribe this game’s specific rules. The short rounds, three-star finish, retry-without-penalty feedback, selectable champion and learning topic, and pretend power moves with a wobble-and-giggle reaction in place of hits are design choices intended to keep the play legible, encouraging, and gentle for a five-year-old. Vocabulary prompts use Taiwan Mandarin (not Taiwanese Hokkien) in Traditional Chinese characters and familiar Taiwan forms (including 姊姊); English is shown alongside them.

## Local speech assets

`audio/prompts.json` is the source for the 15 question prompts in all three languages. On macOS, regenerate the English and Taiwan Mandarin clips with the built-in Samantha and Meijia voices and `ffmpeg` installed:

```sh
python3 monster-word-arena-tw/generate_audio.py
```

Japanese clips use the official [Gemini TTS guide](https://ai.google.dev/gemini-api/docs/speech-generation), `gemini-3.8-flash-tts`, and the available `ja-jp-tutor-1` Tokyo Japanese voice. To rebuild them, set `GEMINI_JOHN_API_KEY` in a private build environment and run:

```sh
python3 monster-word-arena-tw/generate_gemini_audio.py --confirm
```

Only the fixed prompt text is sent during this build-time generation. Never commit the key. The game loads only bundled MP3s and makes no speech-service requests at runtime. Speech is optional: language selection, replay, and mute are available in-game, while answer buttons remain usable if playback is unavailable.

## Local checks

```sh
node --test monster-word-arena-tw/game.test.js
python3 .github/scripts/validate_pages.py
```
