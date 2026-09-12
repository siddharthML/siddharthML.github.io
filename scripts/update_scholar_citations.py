"""Refresh citation counts from Siddharth's Google Scholar profile."""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path
from urllib.request import Request, urlopen


PROFILE_URL = (
    "https://scholar.google.co.uk/citations"
    "?view_op=list_works&hl=en&user=T7KJ8WsAAAAJ"
)
AGENTIC_ARTICLE_ID = "T7KJ8WsAAAAJ:u-x6o8ySG0sC"
COMPUTER_VISION_ARTICLE_ID = "T7KJ8WsAAAAJ:u5HHmVD_uO8C"
INDEX_PATH = Path(__file__).resolve().parents[1] / "index.html"
PUBLICATIONS_PATH = Path(__file__).resolve().parents[1] / "publications.html"


def publication_citation_count(page: str, article_id: str, title: str) -> int:
    rows = re.findall(r'<tr class="gsc_a_tr".*?</tr>', page, flags=re.DOTALL)
    row = next(
        (item for item in rows if f"citation_for_view={article_id}" in item),
        None,
    )
    if row is None:
        raise RuntimeError(f"The {title} publication was not found on the Scholar profile.")

    count = re.search(r'class="gsc_a_ac[^"]*"[^>]*>(\d+)</a>', row)
    if not count:
        raise RuntimeError(f"The {title} citation count was not found.")
    return int(count.group(1))


def fetch_citation_counts() -> tuple[int, int, int]:
    request = Request(
        PROFILE_URL,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "Chrome/124.0 Safari/537.36"
            )
        },
    )
    with urlopen(request, timeout=30) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        page = html.unescape(response.read().decode(charset, errors="replace"))

    agentic_count = publication_citation_count(
        page, AGENTIC_ARTICLE_ID, "Agentic AI"
    )
    computer_vision_count = publication_citation_count(
        page, COMPUTER_VISION_ARTICLE_ID, "Suryanamaskar"
    )

    total_count = re.search(r'class="gsc_rsb_std"[^>]*>(\d+)</td>', page)
    if not total_count:
        raise RuntimeError("The total Google Scholar citation count was not found.")
    return agentic_count, int(total_count.group(1)), computer_vision_count


def update_badge(source: str, badge_id: str, count: int) -> str:
    updated, replacements = re.subn(
        rf'(<a id="{re.escape(badge_id)}" class="pub__citations"\s*data-citations=")\d+("[^>]*aria-label=")\d+( citations on Google Scholar"[^>]*>\s*<span class="pub__citations-star"[^>]*>.*?</span>\s*<span class="pub__citations-count">)\d+( citations</span>\s*</a>)',
        rf"\g<1>{count}\g<2>{count}\g<3>{count}\g<4>",
        source,
        flags=re.DOTALL,
    )
    if replacements != 1:
        raise RuntimeError(f"Citation badge {badge_id!r} could not be updated safely.")
    return updated


def write_if_changed(path: Path, source: str, updated: str) -> bool:
    if updated == source:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def update_pages(
    agentic_count: int, total_count: int, computer_vision_count: int
) -> bool:
    homepage_source = INDEX_PATH.read_text(encoding="utf-8")
    homepage = update_badge(homepage_source, "agentic-ai-citations", agentic_count)

    publications_source = PUBLICATIONS_PATH.read_text(encoding="utf-8")
    publications = update_badge(
        publications_source, "agentic-ai-publications-citations", agentic_count
    )
    publications = update_badge(
        publications, "suryanamaskar-citations", computer_vision_count
    )
    publications, total_replacements = re.subn(
        r'(<div id="scholar-total-citations" class="metric__n" data-citations=")\d+("[^>]*>)\d+(</div>)',
        rf"\g<1>{total_count}\g<2>{total_count}\g<3>",
        publications,
    )
    if total_replacements != 1:
        raise RuntimeError("The total citation metric could not be updated safely.")

    return write_if_changed(INDEX_PATH, homepage_source, homepage) | write_if_changed(
        PUBLICATIONS_PATH, publications_source, publications
    )


def main() -> int:
    try:
        agentic_count, total_count, computer_vision_count = fetch_citation_counts()
        changed = update_pages(agentic_count, total_count, computer_vision_count)
    except Exception as error:
        print(f"Citation update failed: {error}", file=sys.stderr)
        return 1

    status = "updated" if changed else "already current"
    print(
        f"Google Scholar citations: {total_count} total; "
        f"{agentic_count} for Agentic AI; "
        f"{computer_vision_count} for Suryanamaskar ({status})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
