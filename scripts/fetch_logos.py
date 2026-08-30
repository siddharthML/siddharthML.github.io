"""
Download client/employer logos from Wikipedia into assets/logos/.

Usage:
    python scripts/fetch_logos.py           # fetch anything missing
    python scripts/fetch_logos.py --force   # re-fetch everything

Any logo that cannot be found falls back to the typographic wordmark that the
brand band renders by default, which is consistent with the design system.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "logos")
UA = "Mozilla/5.0 (compatible; personal-site-logo-fetcher/1.0)"
CURL = shutil.which("curl")

# slug -> candidate Wikipedia page titles, tried in order
BRANDS = {
    "walmart":       ["Walmart"],
    "abbott":        ["Abbott_Laboratories"],
    "abbvie":        ["AbbVie"],
    "abinbev":       ["AB_InBev", "Anheuser-Busch_InBev"],
    "estee-lauder":  ["The Estée Lauder Companies", "Estée Lauder Companies"],
    "kimberly-clark": ["Kimberly-Clark"],
    "sobeys":        ["Sobeys"],
    "stellantis":    ["Stellantis"],
    "mercedes":      ["Mercedes-Benz"],
}


def get(url):
    out = subprocess.run([CURL, "-sL", "--max-time", "30", "-A", UA, url], capture_output=True)
    if out.returncode != 0:
        raise RuntimeError("curl failed")
    return out.stdout


def find_logo(page):
    """Return the infobox logo URL for a Wikipedia page, or None."""
    url = ("https://en.wikipedia.org/w/api.php?action=parse&redirects=1&prop=text"
           "&format=json&section=0&page=" + urllib.parse.quote(page))
    try:
        html = json.loads(get(url))["parse"]["text"]["*"]
    except Exception:
        return None

    imgs = re.findall(r'<img[^>]+src="([^"]+)"', html)
    # Prefer a file whose name mentions "logo"; otherwise take the first image
    # in the infobox, which is conventionally the logo.
    logos = [u for u in imgs if "logo" in u.lower()] or imgs
    if not logos:
        return None
    src = logos[0]
    if src.startswith("//"):
        src = "https:" + src
    # Ask for a wider render than the 250px infobox thumbnail.
    return re.sub(r"/\d+px-", "/500px-", src)


def main():
    force = "--force" in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    missing = []

    for slug, pages in BRANDS.items():
        dest = os.path.join(OUT_DIR, slug + ".png")
        if os.path.exists(dest) and os.path.getsize(dest) > 1000 and not force:
            print(f"skip   {slug}")
            continue

        src = None
        for page in pages:
            src = find_logo(page)
            if src:
                break
        if not src:
            print(f"MISS   {slug}")
            missing.append(slug)
            continue

        try:
            blob = get(src)
        except Exception as exc:
            print(f"MISS   {slug} ({exc})")
            missing.append(slug)
            continue

        if len(blob) < 1000:
            print(f"MISS   {slug} (empty)")
            missing.append(slug)
            continue

        open(dest, "wb").write(blob)
        print(f"saved  {slug}  {len(blob) // 1024} KB")

    print(f"\n{len(BRANDS) - len(missing)}/{len(BRANDS)} logos available.")
    if missing:
        print("Falling back to wordmarks for: " + ", ".join(missing))


if __name__ == "__main__":
    main()
