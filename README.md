# OAI HTML Pages

Public static HTML pages generated for sharing.

## Gallery

https://yck2024.github.io/oai-html/

The gallery is manifest-driven. Published page metadata lives in `pages.json`, and the root `index.html` renders cards and page counts from that file automatically.

## Current pages

See the [live gallery](https://yck2024.github.io/oai-html/) for the current page list; its cards are rendered from [`pages.json`](pages.json). Per-page detail docs: [Dino & Monster Word Arena](monster-word-arena-tw/README.md), [Taiwan Story Picture Books](taiwan-ehon/README.md).

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

Do not send user-entered text, copied content, credentials, private identifiers, or other sensitive data to analytics. Taiwan Ehon's event catalog and storybook-specific analytics/privacy behavior are documented in [its README](taiwan-ehon/README.md#analytics-and-reading-privacy).

## Narration API usage

The Gemini narration generators record each call's reported token usage and estimated cost in a local JSONL ledger at `~/.local/share/api-usage/gemini.jsonl` (override with `GEMINI_USAGE_LEDGER`). The ledger is kept outside this repository. View totals overall and by project, model, and day with `python3 tools/gemini_usage.py report`. Costs are estimates based on `tools/gemini-prices.json`; check Google's [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) and update that table's prices and `checked_date` when rates change. Models or token modalities without a known price are recorded without a cost.

## Taiwan story references

The bilingual retellings in [Taiwan Story Picture Books](taiwan-ehon/) are based on Taiwanese cultural sources, while simplifying events for young readers. Sources and adaptation notes for 虎姑婆, 青瞑龍蛇, and 阿拉巴耐的石頭 are documented in the [storybook reference](taiwan-ehon/README.md).

- **白賊七:** [National Taiwan University Library, “最新白賊七歌”](https://dl.lib.ntu.edu.tw/s/kua-a-tsheh/item/691216) catalogs a 1933 Taiwanese-language folk song about Bai Zeiqi’s deceptions; the [National Cultural Memory Bank, “白賊七”](https://tcmb.culture.tw/zh-tw/detail?id=17120012469&indexCode=MOCCOLLECTIONS) describes the familiar trickster and the story’s moral endings. The child-friendly [中讀網 retelling, “白賊七(一)”](https://readc.info/bedtime-story/big-liar/) includes the false grass-clothes and wondrous-pot tricks adapted here; this version softens the consequences and does not reproduce its text.
- **射日英雄:** The [Ministry of Culture Children’s Cultural Center, “泰雅勇士大步向前”](https://children.moc.gov.tw/book/230747) introduces an Atayal sun-shooting story. The [Indigenous Sight article, “從前從前我們也曾射下好多太陽”](https://insight.ipcf.org.tw/article/25) describes the father-and-child relay and explains that accounts differ among Indigenous peoples; the [Taiwan Indigenous Peoples Encyclopedia, “射日”](https://aborgpedia.alcd.center/detail?cat=28&id=11532&race=0&search=&writer=) documents variation in the number of suns, heroes, generations, journey, and outcome.
- **白鹿傳說:** The [Council of Indigenous Peoples’ children’s page, “邵族－白鹿傳說”](https://www.cip.gov.tw/kids/zh-tw/menu/data-list/FF8E0A73EBC8DFA26FEA09499C50A842-info.html?cumid=FF8E0A73EBC8DFA26FEA09499C50A842) tells the Shao/Ita Thao white-deer origin account near Sun Moon Lake; the [Council’s profile of the Shao people, “邵族”](https://www.cip.gov.tw/zh-tw/tribe/grid-list/3343FD21497CA007D0636733C6861689/info.html?cumid=8F19BF08AE220D65) identifies the specific community and its living relationship with the lake. This retelling is credited to the Shao/Ita Thao people specifically, omits killing the deer or fish, and does not present the lake as previously empty land.
- **石爺與新埔大橋:** The [Hakka Cultural Heritage Digital Network, “新埔顯伯公軼事”](https://hch.hakka.gov.tw/reportdetail.asp?ArID=1134&MenuID=11&SubID=29&pageNums=1) records the local Xinpu (Hsinchu) oral history of the stone and its shrine alongside the bridge-funding account, noting both an inscription’s telling and a later interview; the network’s [“臺三線上的客家伯公”](https://hch.hakka.gov.tw/reportdetail.asp?ArID=92&MenuID=3&SubID=8&pageNums=2) gives wider context on Hakka 伯公 shrines and settlement. This retelling joins the interview’s vow at the stone and the inscription’s white-haired elder into one story, leaves the herbs off the pages so children do not copy them (the book’s note explains both tellings), and follows the offering money from the stone to the 1930 bridge and the shrine built later.
- **一路同行的媽祖:** The [National Cultural Heritage Database record, “大甲媽祖遶境進香”](https://nchdb.boch.gov.tw/assets/overview/folklore/20080704000002) documents the Dajia pilgrimage as a registered folk custom and notes that Mazu’s biography has many versions and that the route has changed over time; the [Ministry of the Interior’s Taiwan Religion Cultural Map, “大甲媽祖遶境進香”](https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=111) adds further detail on the practice. This retelling presents the pilgrimage as a living, still-practiced custom of neighbors helping each other, not as a Mazu biography or a claim that any miracle is historical fact.

## Publish-page skill

Reusable publishing instructions live at:

`skills/publish-page/SKILL.md`

The intended shortcut is simply:

> publish page

The skill defines this repository as the default destination, checks the HTML for secrets/private data, publishes under a stable slug, updates `pages.json`, preserves analytics, and verifies the GitHub Pages deployment.
