import json
import re
from pathlib import Path

manifest = json.loads(Path("pages.json").read_text(encoding="utf-8"))
pages = manifest.get("pages", [])
if not isinstance(pages, list):
    raise SystemExit("pages.json: 'pages' must be a list")

slugs = []
for page in pages:
    slug = page.get("slug", "")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise SystemExit(f"Invalid slug: {slug!r}")
    if not page.get("title") or not page.get("description"):
        raise SystemExit(f"Missing title/description for {slug}")
    slugs.append(slug)

if len(slugs) != len(set(slugs)):
    raise SystemExit("Duplicate slugs in pages.json")

listed = set(slugs)
actual = {
    p.parent.name
    for p in Path(".").glob("*/index.html")
    if not p.parent.name.startswith(".")
}

missing_files = listed - actual
missing_manifest = actual - listed
if missing_files:
    raise SystemExit(f"Manifest entries without pages: {sorted(missing_files)}")
if missing_manifest:
    raise SystemExit(f"Published pages missing from pages.json: {sorted(missing_manifest)}")

html_pages = sorted(Path(".").rglob("*.html"))
for path in html_pages:
    if ".git" in path.parts:
        continue
    html = path.read_text(encoding="utf-8")
    if "G-QLFWNZWDSS" not in html:
        raise SystemExit(f"Google Analytics tag missing from {path}")
    if "assets/analytics.js" not in html:
        raise SystemExit(f"Shared analytics helper missing from {path}")

print(f"Validated {len(slugs)} published pages and analytics coverage on {len(html_pages)} HTML pages")
