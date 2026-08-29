"""
Download book cover images for the bookshelf from Open Library.

Usage:
    python scripts/fetch_covers.py            # fetch anything missing
    python scripts/fetch_covers.py --force    # re-fetch everything

Reads the book list straight out of assets/js/data.js so there is a single
source of truth. Covers land in assets/covers/<slug>.jpg. Any book whose cover
cannot be found simply falls back to the typographic cover rendered by CSS.
"""

import json
import os
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(ROOT, "assets", "js", "data.js")
OUT_DIR = os.path.join(ROOT, "assets", "covers")
UA = "Mozilla/5.0 (compatible; personal-site-cover-fetcher/1.0)"

# Some corporate networks intercept TLS with a cert Python's bundled store
# rejects. curl uses the OS trust store and works in those environments, so
# prefer it when it is available.
CURL = shutil.which("curl")


def load_books():
    src = open(DATA_JS, encoding="utf-8").read()
    start = src.index("{", src.index("const BOOKSHELF"))
    end = src.rindex("}")
    data = json.loads(src[start:end + 1])
    books = []
    for cat in data["categories"]:
        books.extend(cat["books"])
    return books


def get(url, timeout=25):
    if CURL:
        out = subprocess.run(
            [CURL, "-sL", "--max-time", str(timeout), "-A", UA, url],
            capture_output=True,
        )
        if out.returncode != 0:
            raise RuntimeError(out.stderr.decode("utf-8", "replace").strip() or "curl failed")
        return out.stdout
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def find_cover_id(title, author):
    """Search Open Library and return the best cover id, or None."""
    q = urllib.parse.urlencode({
        "title": title,
        "author": author,
        "limit": 5,
        "fields": "title,author_name,cover_i,edition_count",
    })
    try:
        docs = json.loads(get("https://openlibrary.org/search.json?" + q))["docs"]
    except Exception as exc:
        print(f"    search failed: {exc}")
        return None

    # Prefer the most-published edition that actually has a cover.
    docs = [d for d in docs if d.get("cover_i")]
    if not docs:
        return None
    docs.sort(key=lambda d: d.get("edition_count", 0), reverse=True)
    return docs[0]["cover_i"]


def main():
    force = "--force" in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    books = load_books()
    missing = []

    for i, book in enumerate(books, 1):
        dest = os.path.join(OUT_DIR, book["slug"] + ".jpg")
        if os.path.exists(dest) and os.path.getsize(dest) > 2000 and not force:
            print(f"[{i:2}/{len(books)}] skip   {book['slug']}")
            continue

        print(f"[{i:2}/{len(books)}] fetch  {book['slug']} — {book['title']}")
        cover_id = find_cover_id(book["title"], book["author"])
        if not cover_id:
            print("    no cover found")
            missing.append(book["slug"])
            continue

        try:
            blob = get(f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg")
        except Exception as exc:
            print(f"    download failed: {exc}")
            missing.append(book["slug"])
            continue

        # Open Library serves a 1x1 placeholder when the image is absent.
        if len(blob) < 2000:
            print("    placeholder returned, skipping")
            missing.append(book["slug"])
            continue

        open(dest, "wb").write(blob)
        print(f"    saved {len(blob) // 1024} KB")
        time.sleep(0.4)  # be polite to the API

    print(f"\nDone. {len(books) - len(missing)}/{len(books)} covers available.")
    if missing:
        print("No cover for: " + ", ".join(missing))
        print("These fall back to the typographic cover — that is fine.")


if __name__ == "__main__":
    main()
