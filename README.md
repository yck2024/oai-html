# OAI HTML Pages

Public static HTML pages generated for sharing.

## Gallery

https://yck2024.github.io/oai-html/

The gallery is manifest-driven. Published page metadata lives in `pages.json`, and the root `index.html` renders cards and page counts from that file automatically.

## Current pages

- Neovim beginner visual guide
- Herdr Keyboard Visual Guide (EN / 繁中)
- Pi + Luna + Automic Vault

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

Default interaction events include:

- `section_nav`
- `outbound_link`
- `button_click`
- `content_copy` (selection length bucket only)
- `form_submit` (form ID only)
- `scroll_depth` (25/50/75/90)
- `engaged_10s`
- `engaged_30s`

Interactive pages can add semantic events with `data-analytics-event` / `data-analytics-label` or `window.oaiTrack(eventName, params)`.

Do not send user-entered text, copied content, credentials, private identifiers, or other sensitive data to analytics.

## Publish-page skill

Reusable publishing instructions live at:

`skills/publish-page/SKILL.md`

The intended shortcut is simply:

> publish page

The skill defines this repository as the default destination, checks the HTML for secrets/private data, publishes under a stable slug, updates `pages.json`, preserves analytics, and verifies the GitHub Pages deployment.
