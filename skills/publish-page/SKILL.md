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
- Root `index.html` is the navigator/gallery and must stay up to date.

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

4. Publish to GitHub.
   - If the path is new, create it.
   - If the slug already exists and the user is clearly updating that page, fetch the current file SHA and update it instead of creating a duplicate.
   - Preserve interactive HTML/CSS/JS whenever possible.
   - Add the Google Analytics tag immediately after `<head>` unless the page already contains `G-QLFWNZWDSS`:

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

     The Pages workflow also injects this tag at deploy time into any page missing it, as a safety net.

5. Update the gallery.
   - Fetch the latest root `index.html`.
   - Add a clear card linking to `./<slug>/`.
   - Include a concise title, description, and useful tags.
   - Update the published-page count.
   - Do not remove or overwrite unrelated existing cards.

6. Verify deployment.
   - Confirm the GitHub write succeeded.
   - Check the public page URL and the root gallery URL after Pages deploys.
   - If GitHub Actions/Pages is still deploying, report the repository write as complete and distinguish that from public deployment status.

7. Report back with:
   - Public page URL
   - Gallery URL
   - Skill/repo changes if relevant
   - Any intentional public-safety edits

## Trigger shorthand

When the user says only **“publish page”** after creating an HTML page, treat that as authorization to run the workflow above for that page. Do not ask them to repeat the repository or base URL.
