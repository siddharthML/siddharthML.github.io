/* ============================================================================
   Shared chrome + interactions.
   Nav, contact section and footer are injected here so there is exactly one
   copy to edit. Pages opt in with <div data-nav>, <div data-contact>,
   <div data-footer>.
   ============================================================================ */

/* ------------------------------------------------------- site-wide config */
const SITE = {
  name: "Siddharth Chatterjee",
  monogram: "SC",
  role: "Senior Product Manager, AI",
  location: "Bengaluru, India",
  email: "sid.c1991pm@hotmail.com",
  linkedin: "https://www.linkedin.com/in/siddharth-c-8257a34b/",
  github: "https://github.com/siddharthML/",
  scholar: "https://scholar.google.co.uk/citations?view_op=list_works&hl=en&user=T7KJ8WsAAAAJ",
  nav: [
    { label: "Home",        href: "index.html" },
    { label: "About",       href: "about.html" },
    { label: "Projects",    href: "projects.html" },
    { label: "Publications", href: "publications.html" },
    { label: "Bookshelf",   href: "bookshelf.html" },
    { label: "Get in Touch", href: "index.html#contact" }
  ]
};

/* ------------------------------------------------------------------ icons */
const ICONS = {
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft:  '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  arrowDown:  '<path d="M12 5v14M6 13l6 6 6-6"/>',
  chevron:    '<path d="M6 9l6 6 6-6"/>',
  external:   '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  cpu:        '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/>',
  bot:        '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
  users:      '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 5.2a3.2 3.2 0 0 1 0 6.1M18 20a6.4 6.4 0 0 0-3-5.2"/>',
  chart:      '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  target:     '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  gear:       '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  rocket:     '<path d="M13.5 3C17 5 20 8.5 20 13l-4 4-5-5 2.5-9zM11 12l-5 5M4 15l1.5 4.5L10 21"/>',
  compass:    '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  book:       '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  layers:     '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5"/>',
  database:   '<ellipse cx="12" cy="6" rx="8" ry="3.2"/><path d="M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2"/>',
  spark:      '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  award:      '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 22l5-2.6 5 2.6-1.5-8.5"/>',
  cap:        '<path d="M12 3.5L22 8l-10 4.5L2 8l10-4.5z"/><path d="M6 10.2V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.8"/>',
  briefcase:  '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M2.5 12.5h19"/>',
  mail:       '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6 9-6"/>',
  linkedin:   '<path d="M4.5 9.5v10M4.5 4.8v.02M10 19.5v-10M10 13.2c0-2 1.4-3.4 3.2-3.4S16.5 11 16.5 13v6.5" />',
  github:     '<path d="M9 19c-4.5 1.4-4.5-2.3-6.3-2.8M15 21v-3.5c0-1 .1-1.6-.5-2.2 2.6-.3 5.3-1.3 5.3-5.8a4.5 4.5 0 0 0-1.2-3.1 4.2 4.2 0 0 0-.1-3.1s-1-.3-3.3 1.2a11.4 11.4 0 0 0-6 0C6.6 2.9 5.6 3.3 5.6 3.3a4.2 4.2 0 0 0-.1 3.1A4.5 4.5 0 0 0 4.3 9.5c0 4.5 2.7 5.5 5.3 5.8-.4.4-.6.9-.5 1.5V21"/>',
  globe:      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/>',
  quote:      '<path d="M9 7H5.5A2.5 2.5 0 0 0 3 9.5V13h6V7zm12 0h-3.5A2.5 2.5 0 0 0 15 9.5V13h6V7z"/><path d="M9 13c0 3-1.5 4.5-4 5M21 13c0 3-1.5 4.5-4 5"/>',
  pen:        '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>'
};

function icon(name, size) {
  const s = size || 24;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor"
    stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

/* ------------------------------------------------------------ page chrome */
function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function renderNav(host) {
  const here = currentPage();
  const links = SITE.nav.map(item => {
    const target = item.href.split("#")[0];
    const isCurrent = target === here && !item.href.includes("#");
    return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ""}>${item.label}</a>`;
  }).join("");

  host.outerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="nav">
      <div class="nav__inner">
        <a class="monogram" href="index.html" aria-label="${SITE.name} — home">${SITE.monogram}</a>
        <nav class="nav__links" aria-label="Primary">${links}</nav>
        <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-drawer">
          ${icon("chevron", 16)} Menu
        </button>
      </div>
    </header>
    <div class="nav__drawer" id="nav-drawer">${links}</div>`;

  const toggle = document.querySelector(".nav__toggle");
  const drawer = document.getElementById("nav-drawer");
  toggle.addEventListener("click", () => {
    const open = drawer.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  drawer.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      drawer.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function renderContact(host) {
  host.outerHTML = `
    <section class="contact" id="contact">
      <div class="wrap">
        <span class="sticker reveal reveal--zoom">Let's Connect</span>
        <h2 class="h-1 mt-3 reveal">Get in Touch</h2>
        <p class="lead reveal" style="max-width:52ch;margin-inline:auto">
          Open to conversations about AI products, agentic platforms, forecasting systems,
          or anything worth building. The fastest way to reach me is LinkedIn.
        </p>
        <div class="contact__actions">
          <a class="btn btn--linkedin reveal reveal--left" href="${SITE.linkedin}" target="_blank" rel="noopener">
            ${icon("linkedin", 20)} Connect on LinkedIn
          </a>
          <a class="btn reveal reveal--right" href="mailto:${SITE.email}">
            ${icon("mail", 20)} ${SITE.email}
          </a>
        </div>
      </div>
    </section>`;
}

function renderFooter(host) {
  host.outerHTML = `
    <footer class="footer">
      <div class="wrap footer__inner">
        <a class="monogram" href="index.html" aria-label="Home">${SITE.monogram}</a>
        <p class="footer__note mt-0">© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p>
        <a class="btn btn--lavender" href="#top">Back to Top ↑</a>
      </div>
    </footer>`;
}

/* ------------------------------------------------------------ interactions */
/* Replace <i data-icon="name" data-size="18"> placeholders with inline SVG.
   Runs after page content is rendered so injected markup is covered too. */
function initIcons(root) {
  (root || document).querySelectorAll("i[data-icon]").forEach(el => {
    const svg = icon(el.dataset.icon, el.dataset.size || 20);
    el.outerHTML = svg;
  });
}

/* Resolve <a data-link="linkedin|github|scholar|email"> against SITE. */
function initLinks(root) {
  (root || document).querySelectorAll("[data-link]").forEach(el => {
    const key = el.dataset.link;
    el.href = key === "email" ? "mailto:" + SITE.email : SITE[key];
  });
}

/* Use a real portrait if the file is present; otherwise keep the monogram. */
function initPortrait() {
  document.querySelectorAll("[data-portrait]").forEach(box => {
    const parent = box.parentElement;
    const img = new Image();
    img.onload = () => { parent.innerHTML = ""; parent.appendChild(img); };
    img.src = box.dataset.portrait;
    img.alt = SITE.name;
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // stagger siblings slightly so rows cascade instead of popping together
      entry.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
      entry.target.classList.add("is-in");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  items.forEach(el => io.observe(el));
}

function initMarquees() {
  // Duplicate the track contents so the -50% translate loops seamlessly.
  document.querySelectorAll("[data-loop]").forEach(track => {
    track.innerHTML += track.innerHTML;
  });
}

function initAccordions() {
  document.querySelectorAll(".tl-head").forEach(head => {
    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      head.nextElementSibling.classList.toggle("is-open", !open);
    });
  });
}

/* Cover images sit in the DOM on top of the typographic fallback so the
   browser can lazy-load them natively. A cover that loads hides the fallback;
   one that 404s removes itself and the fallback stays. */
function initCovers() {
  document.querySelectorAll("img[data-cover]").forEach(img => {
    const reveal = () => img.closest(".book__cover").classList.remove("book__cover--fallback");
    if (img.complete) {
      if (img.naturalWidth) reveal(); else img.remove();
      return;
    }
    img.addEventListener("load", reveal);
    img.addEventListener("error", () => img.remove());
  });
}

/* ------------------------------------------------------------------- boot */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("[data-nav]");
  const contact = document.querySelector("[data-contact]");
  const footer = document.querySelector("[data-footer]");
  if (nav) renderNav(nav);
  if (typeof renderPage === "function") renderPage();   // per-page content hook
  if (contact) renderContact(contact);
  if (footer) renderFooter(footer);

  initIcons();
  initLinks();
  initPortrait();
  initMarquees();
  initAccordions();
  initCovers();
  initReveal();
});
