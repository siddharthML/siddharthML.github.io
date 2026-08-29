/* ============================================================================
   Bookshelf page. Reads BOOKSHELF from data.js and renders one panel per
   category. Covers come from assets/covers/<slug>.jpg when present; anything
   missing keeps the typographic fallback that ships in the markup.
   ============================================================================ */

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function searchUrl(book) {
  return "https://www.google.com/search?q=" +
    encodeURIComponent(`${book.title} ${book.author} book`);
}

function bookCard(book) {
  const title = escapeHtml(book.title);
  const author = escapeHtml(book.author);
  const sub = book.subtitle ? `<span title="${escapeHtml(book.subtitle)}"></span>` : "";
  return `
    <a class="book reveal reveal--zoom" href="${searchUrl(book)}" target="_blank" rel="noopener"
       title="${title}${book.subtitle ? " — " + escapeHtml(book.subtitle) : ""} · ${author}">
      <div class="book__cover book__cover--fallback">
        <span class="bt">${title}</span>
        <span class="ba">${author}</span>
        <img data-cover src="assets/covers/${book.slug}.jpg" alt="" loading="lazy">
      </div>
      <div class="book__meta">
        <b>${title}</b><span>${author}</span>${sub}
      </div>
    </a>`;
}

function renderPage() {
  const total = BOOKSHELF.categories.reduce((n, c) => n + c.books.length, 0);

  document.getElementById("shelf").innerHTML = BOOKSHELF.categories.map(cat => `
    <section class="section section--tight">
      <div class="card panel-${cat.color}">
        <div class="numbered">
          <span class="numbered__n" style="background:var(--canvas-2)">
            ${String(cat.books.length).padStart(2, "0")}
          </span>
          <h2 class="h-2 mt-0">${escapeHtml(cat.name)}</h2>
        </div>
        <div class="shelf-grid">${cat.books.map(bookCard).join("")}</div>
      </div>
    </section>`).join("");

  // Headline count above the first shelf.
  const banner = document.querySelector(".page-banner .lead");
  if (banner) banner.innerHTML = `${total} books, grouped the way I think about the job.`;
}
