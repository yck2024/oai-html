# OAI HTML Pages

Public static HTML pages generated for sharing.

## Gallery

https://yck2024.github.io/oai-html/

The gallery is manifest-driven. Published page metadata lives in `pages.json`, and the root `index.html` renders cards and page counts from that file automatically.

## Current pages

See the [live gallery](https://yck2024.github.io/oai-html/) for the current page list; its cards are rendered from [`pages.json`](pages.json). Per-page detail docs: [Dino & Monster Word Arena](monster-word-arena-tw/README.md), [Taiwan Story Picture Books](#taiwan-story-references).

## Publishing architecture

```text
new HTML page
    ↓
public-safety / secret check
    ↓
<slug>/index.html
    ↓
pages.json entry
    ↓
GitHub Pages workflow
    ├─ validates manifest ↔ published folders
    ├─ injects GA4 when missing
    ├─ injects shared interaction analytics when missing
    └─ deploys
    ↓
root gallery renders automatically
```

### Analytics

GA4 measurement ID: `G-QLFWNZWDSS`

The deployment workflow guarantees the Google tag and shared `assets/analytics.js` helper are present on every HTML page.

GA4 Enhanced Measurement already tracks page views, outbound clicks (`click`), form interactions (`form_start` / `form_submit`), 90% scroll (`scroll`), and 10s engaged sessions. The helper adds only what it does not:

- `section_nav` (in-page `#` links; `target_section`)
- `button_click` (buttons with an `id`, `data-analytics-id`, `aria-label`, or `data-analytics-label` only, outside `data-analytics-ignore` containers)
- `content_copy` (selection length bucket only, excluding selections intersecting `data-analytics-ignore` containers)
- `scroll_depth` (25/50/75; `percent_scrolled`, same parameter as the built-in 90% `scroll` event)
- `engaged_30s`

Event parameters (`element_id`, `element_label`, `target_section`, `percent_scrolled`, `selection_length_bucket`) only appear in GA reports after they are registered as event-scoped custom dimensions in GA Admin → Custom definitions.

Interactive pages can add semantic events with `data-analytics-event` / `data-analytics-label` or `window.oaiTrack(eventName, params)`.

Do not send user-entered text, copied content, credentials, private identifiers, or other sensitive data to analytics. In the storybook, story selection and page turns stay in page state without URL or history changes; clicks and copies are excluded, and its page-view URL, referrer, and title omit the selected story and page identifiers. Listening mode, 注音 visibility, and auto-turn preference are remembered only in this browser; no identity, answers, or reading history are stored.

## Narration API usage

The Gemini narration generators record each call's reported token usage and estimated cost in a local JSONL ledger at `~/.local/share/api-usage/gemini.jsonl` (override with `GEMINI_USAGE_LEDGER`). The ledger is kept outside this repository. View totals overall and by project, model, and day with `python3 tools/gemini_usage.py report`. Costs are estimates based on `tools/gemini-prices.json`; check Google's [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) and update that table's prices and `checked_date` when rates change. Models or token modalities without a known price are recorded without a cost.

## Taiwan story references

The bilingual retellings in [Taiwan Story Picture Books](taiwan-ehon/) are based on Taiwanese cultural sources, while simplifying events for young readers:

- **白賊七:** [National Taiwan University Library, “最新白賊七歌”](https://dl.lib.ntu.edu.tw/s/kua-a-tsheh/item/691216) catalogs a 1933 Taiwanese-language folk song about Bai Zeiqi’s deceptions; the [National Cultural Memory Bank, “白賊七”](https://tcmb.culture.tw/zh-tw/detail?id=17120012469&indexCode=MOCCOLLECTIONS) describes the familiar trickster and the story’s moral endings. The child-friendly [中讀網 retelling, “白賊七(一)”](https://readc.info/bedtime-story/big-liar/) includes the false grass-clothes and wondrous-pot tricks adapted here; this version softens the consequences and does not reproduce its text.
- **射日英雄:** The [Ministry of Culture Children’s Cultural Center, “泰雅勇士大步向前”](https://children.moc.gov.tw/book/230747) introduces an Atayal sun-shooting story. The [Indigenous Sight article, “從前從前我們也曾射下好多太陽”](https://insight.ipcf.org.tw/article/25) describes the father-and-child relay and explains that accounts differ among Indigenous peoples; the [Taiwan Indigenous Peoples Encyclopedia, “射日”](https://aborgpedia.alcd.center/detail?cat=28&id=11532&race=0&search=&writer=) documents variation in the number of suns, heroes, generations, journey, and outcome.

## Publish-page skill

Reusable publishing instructions live at:

`skills/publish-page/SKILL.md`

The intended shortcut is simply:

> publish page

The skill defines this repository as the default destination, checks the HTML for secrets/private data, publishes under a stable slug, updates `pages.json`, preserves analytics, and verifies the GitHub Pages deployment.
