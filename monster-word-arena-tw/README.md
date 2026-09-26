# Dino & Monster Word Arena

A separate, static, phone-friendly game in the OAI HTML gallery. Children choose a dinosaur or monster, switch among addition, colors, face parts, and family words, and earn a team star for each correct answer. Three stars trigger a friendly dance-off ending; misses only invite another try. No injuries, lives, harsh loss, accounts, or saved answers. All game assets are text, CSS, and emoji.

The Pages deployment injects Google Analytics (GA4) and the shared interaction-analytics helper into every published HTML page (see the root README and `.github/workflows/pages.yml`); this page is **not tracking-free**, and general page-engagement analytics remain enabled. Answer choices are anonymous buttons with no analytics IDs, labels, or event declarations, so the helper does not report which answer a child chose. The game does not save answer choices.

## Research notes

### Sourced findings

- The National Association for the Education of Young Children (NAEYC) describes developmentally appropriate practice as strengths-based, play-based joyful learning, with meaningful child choice and agency. Its guidance also discusses repeated practice and culturally/linguistically affirming environments. [DAP: Teaching to Enhance Each Child’s Development and Learning](https://www.naeyc.org/resources/position-statements/dap/enhance-development/)
- NAEYC’s early-childhood article gives an example of using a joyful game to reinforce preschool numeracy. [The Power of Playful Learning in the Early Childhood Setting](https://www.naeyc.org/resources/pubs/yc/summer2022/power-playful-learning)
- Taiwan’s National Academy for Educational Research / Ministry of Education dictionaries use Traditional Chinese and list the selected Taiwan Mandarin terms: [small dictionary](https://dict.mini.moe.edu.tw/) (for example, 眼、鼻、耳、臉, and color entries) and the [family relationship table in the Concised Mandarin Chinese Dictionary](https://dict.concised.moe.edu.tw/appendix.jsp?ID=12&la=1&powerMode=0), which includes 爸爸、媽媽、哥哥、弟弟、姊姊、妹妹.

### Design judgment

Research suggests the value of play, choice, practice, and linguistic relevance; it does not prescribe this game’s specific rules. The short rounds, three-star finish, retry-without-penalty feedback, selectable champion and learning topic, and friendly dance/high-five in place of hits are design choices intended to keep the play legible, encouraging, and gentle for a five-year-old. Vocabulary prompts use Traditional Chinese characters and familiar Taiwan forms (including 姊姊); English is shown alongside them.

## Local checks

```sh
node --test monster-word-arena-tw/game.test.js
python3 .github/scripts/validate_pages.py
```
