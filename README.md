# Siddharth Chatterjee — personal site

A zero-build static site. No Node, no bundler, no install step. Open
`index.html` in a browser and it works.

## Running it

Easiest — double-click `index.html`.

For a proper local server (needed if you ever add `fetch()`-based features):

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Where things live

```
index.html          Home
about.html          About — bio, skills, credentials, career accordion
projects.html       Projects (placeholder — case studies pending)
publications.html   Papers, awards, writing & talks
bookshelf.html      The PM reading list

assets/css/style.css   The whole design system: tokens, components, animation
assets/js/site.js      Nav, contact section, footer, icons, scroll reveal
assets/js/home.js      Homepage content (focus cards, projects, metrics)
assets/js/bookshelf.js Bookshelf rendering
assets/js/data.js      Book list — single source of truth
assets/covers/         Book cover images
assets/img/            Put portrait.jpg here to replace the monogram in the hero

assets/logos/          Client brand logos for the "Clients I've Worked With" band
assets/Siddharth-Chatterjee-CV.pdf   Linked from the nav CV tab and the CV card

scripts/fetch_covers.py  Downloads book covers from Open Library
scripts/fetch_logos.py   Downloads client logos from Wikipedia
```

## Common edits

**Change a link, your email, or the nav** — `assets/js/site.js`, the `SITE`
object at the top. Everything on the site reads from it.

**Change homepage copy** — `assets/js/home.js`. The `FOCUS`, `BACKGROUND`,
`PROJECTS`, `METRICS` and `CLIENTS` arrays map one-to-one onto what you see.

**Add a client to the logo band** — add an entry to `CLIENTS` in `home.js`,
then add its Wikipedia page title to `BRANDS` in `scripts/fetch_logos.py` and
run it. A client with no logo renders as a typographic wordmark instead, which
is a deliberate part of the design, not a failure.

**Swap the CV** — replace `assets/Siddharth-Chatterjee-CV.pdf`, or point
`SITE.cv` in `site.js` at a different filename.

**Change About or Publications copy** — edit the HTML directly; it is plain
prose, no templating.

**Add a book** — add an entry to `assets/js/data.js`, then:

```bash
python scripts/fetch_covers.py
```

It only downloads what is missing. Books with no cover fall back to a
typographic cover automatically, which is a legitimate look here — not a bug.

**Add your photo** — save it as `assets/img/portrait.png` (or update the
`data-portrait` path in `index.html`/`about.html` if you use a `.jpg`). The
hero and About page pick it up automatically. Portrait orientation (roughly
4:5) works best.

**Add a real project case study** — the projects page currently reuses the
`PROJECTS` array from `home.js`. When you write a real case study, create
`project-<name>.html` and point the card's `href` at it.

## Design system

Warm editorial neo-brutalism: 4px borders, hard offset shadows, no soft
elevation, pastel panels on a `#F9F3E7` canvas, Space Grotesk throughout. All
tokens are CSS custom properties at the top of `style.css` — change
`--pink`/`--blue`/`--lavender` there and the whole site follows.

Motion: scroll-triggered reveals via `IntersectionObserver` (add class
`reveal`, optionally `reveal--left` / `--right` / `--zoom`), plus three
continuous patterns — `marquee`, `float` (`.is-floating`) and `wiggle`
(`.is-wiggling`). Everything respects `prefers-reduced-motion`.

## Deploying

It is static, so anything works. Drag the folder onto Netlify, or push to
GitHub and enable Pages on the repo root.
