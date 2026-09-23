---
name: publish-page
description: Publish an HTML artifact or visual guide to yck2024/oai-html GitHub Pages. Use when the user says “publish page”, “publish this page”, or asks to add a page to the public HTML gallery.
---

# Publish Page

Use this workflow for the user's public HTML gallery.

## Destination

- GitHub repository: `yck2024/oai-html`
- Default branch: `main`
- Public base URL: `https://yck2024.github.io/oai-html/`
- `pages.json` is the source of truth for the root gallery.
- Root `index.html` renders the navigator from `pages.json`; do not manually add cards or page counts.

## Workflow

1. Resolve the exact source artifact.
   - Prefer an HTML artifact from the current conversation.
   - If it is from an earlier conversation, search the user's file library by title/topic and use the canonical HTML artifact.
   - Do not recreate an existing artifact from memory if the original is available.

2. Run a public-safety check before publishing.
   - Look for raw API keys, passwords, access tokens, private keys, cookies, session values, internal-only company data, personal addresses, private email addresses, or other information that should not be public.
   - Secret *names* such as `HCLOUD_TOKEN` are okay when they are examples and contain no secret value.
   - If unsafe content is present, remove/redact only what is necessary while preserving the page.
   - Never publish a credential or private/internal company material.

3. Choose a stable slug.
   - Lowercase, short, descriptive, hyphen-separated.
   - Publish the artifact as `<slug>/index.html`.
   - This makes the public URL `https://yck2024.github.io/oai-html/<slug>/`.

4. Preserve analytics on the source page.
   - Unless already present, add the Google Analytics tag immediately after `<head>`:

     ```html
     <!-- Google tag (gtag.js) -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-QLFWNZWDSS"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());

       gtag('config', 'G-QLFWNZWDSS', { content_group: 'oai-html' });
     </script>
     ```

   - Unless already present, add the shared interaction helper:

     ```html
     <script defer src="https://yck2024.github.io/oai-html/assets/analytics.js"></script>
     ```

   - The Pages workflow injects both at deploy time when missing, so this is also enforced centrally.

5. Add meaningful interaction events when the page is interactive.
   - GA4 Enhanced Measurement already tracks outbound clicks, form interactions, 90% scroll, and 10s engagement; do not add custom events for these.
   - The shared helper automatically tracks:
     - section navigation (in-page `#` links)
     - button clicks, for buttons with an `id`, `aria-label`, or `data-analytics-label` (give meaningful buttons one of these)
     - content copy (length bucket only; never copied text)
     - scroll depth at 25/50/75%
     - a 30s engagement signal
   - For page-specific actions, prefer declarative attributes:

     ```html
     <button
       data-analytics-event="challenge_complete"
       data-analytics-label="vim-movement-01">
       Complete challenge
     </button>
     ```

   - Or call:

     ```js
     window.oaiTrack?.('challenge_complete', {
       challenge_id: 'vim-movement-01'
     });
     ```

   - Never send user-entered text, copied content, credentials, email addresses, query-string contents, or other sensitive/private values as analytics parameters.

6. Publish to GitHub.
   - If the path is new, create it.
   - If the slug already exists and the user is clearly updating that page, fetch the current file SHA and update it instead of creating a duplicate.
   - Preserve interactive HTML/CSS/JS whenever possible.

7. Update `pages.json`.
   - Add or update exactly one object for the slug.
   - Keep existing unrelated entries.
   - Required fields:
     - `slug`
     - `title`
     - `description`
     - `icon`
     - `tags`
     - `status` (normally `live`)
   - Do **not** manually edit root gallery cards or page counts; `index.html` renders them from the manifest.
   - Deployment validation fails if a top-level published `<slug>/index.html` exists without a manifest entry, or vice versa.

8. Verify deployment.
   - Confirm the GitHub write succeeded.
   - Confirm the Pages workflow passed manifest validation and deployment.
   - Check the public page URL and the root gallery URL.
   - If GitHub Actions/Pages is still deploying, report repository write status separately from public deployment status.

9. Report back with:
   - Public page URL
   - Gallery URL
   - Analytics/custom events added, if any
   - Any intentional public-safety edits

## Trigger shorthand

When the user says only **“publish page”** after creating an HTML page, treat that as authorization to run the workflow above for that page. Do not ask them to repeat the repository, analytics ID, or base URL.
