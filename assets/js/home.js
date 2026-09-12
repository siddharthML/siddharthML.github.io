/* ============================================================================
   Homepage content. Edit the arrays below to change what the homepage shows.
   ============================================================================ */

const FOCUS = [
  {
    color: "blue", icon: "bot",
    title: "Zero-to-One & One-to-Hundred",
    body: "I take AI products from a blank page to production, then scale them into dependable platforms — shaping the architecture, roadmap, operating model and adoption path from the first use case to repeatable growth."
  },
  {
    color: "lavender", icon: "layers",
    title: "Legacy to AI-Native",
    body: "I have modernized an established platform with an AI layer at o9 and built an AI-native platform from scratch at MathCo. That range taught me when to evolve existing foundations, when to start fresh and how to make either path work in production."
  },
  {
    color: "pink", icon: "target",
    title: "Evaluation & LLMOps",
    body: "I am sceptical of AI features that cannot be measured. I build the offline and online evaluation frameworks, monitoring and LLM-Ops practice that turn a promising demo into something a business will actually depend on."
  },
  {
    color: "sand", icon: "users",
    title: "Platform Governance & GTM",
    body: "I build the operating system around a platform: product councils, decision rights and usage-led roadmaps, alongside sales pitches, positioning, launch strategy and patents. At MathCo, that work helped turn a GenAI service line into $8M in annual revenue."
  }
];

/* Three columns of the "My Background" section. Each entry renders as its own
   bordered mini-card rather than a bullet. */
const BACKGROUND = [
  {
    color: "blue", icon: "cap", title: "Education",
    items: [
      { icon: "cap", title: "M.Sc. Machine Learning &amp; Data Science", note: "University College London · Merit" },
      { icon: "cap", title: "M.Sc. Economics", note: "University of Warwick · Merit" }
    ]
  },
  {
    color: "lavender", icon: "spark", title: "Certifications",
    items: [
      { icon: "cpu",   title: "MCP: Build Rich-Context AI Apps with Anthropic", note: "DeepLearning.AI · 2025" },
      { icon: "database", title: "Building &amp; Evaluating Advanced RAG",  note: "DeepLearning.AI · 2024" },
      { icon: "gear",  title: "Finetuning Large Language Models",           note: "DeepLearning.AI · 2024" },
      { icon: "layers", title: "LangChain for LLM Application Development", note: "DeepLearning.AI · 2024" }
    ]
  },
  {
    color: "pink", icon: "quote", title: "Fun Facts",
    items: [
      { icon: "globe",     title: "Startups to government", note: "Worked at tech startups, global product companies, academia, government and NGOs" },
      { icon: "cap",       title: "Economics to machine learning", note: "Studied arts, economics and engineering, then moved from economist to machine learning scientist" },
      { icon: "briefcase", title: "Wore most of the hats",  note: "Worked across data science, engineering, product, marketing and sales — often translating between them" },
      { icon: "chart",     title: "Worked across six cities", note: "Bangalore, Kolkata, Pune, Hyderabad, Delhi and London" }
    ]
  }
];

const PROJECTS = [
  {
    color: "blue", icon: "layers", label: "Architecture guide · Legacy modernization",
    title: "Building an AI Layer on a Legacy Platform",
    body: "A practical blueprint for adding a scalable AI control plane without forcing established systems, teams, or release cycles to move in lockstep.",
    tags: ["Enterprise AI", "Architecture", "Agentic systems"],
    href: "building-ai-layer.html"
  },
  {
    color: "lavender", icon: "spark", label: "Architecture guide · Greenfield systems",
    title: "Building an AI-Native Platform From Scratch",
    body: "An interactive playbook for the open decisions behind a greenfield platform—from data and model routing to orchestration, security, evaluation, and deployment.",
    tags: ["AI-native", "Architecture", "Interactive guide"],
    href: "building-ai-native-platform.html"
  },
  {
    color: "aqua", icon: "gear", label: "Production guide · Agent systems",
    title: "Building the Enterprise Agent Harness",
    body: "A production blueprint for the memory, skills, protocols, policy, orchestration, observability, and evaluation that make enterprise agents dependable.",
    tags: ["Agent harnesses", "Enterprise AI", "Production systems"],
    href: "building-enterprise-agent-harness.html"
  }
];

const METRICS = [
  { n: "11+",    l: "Years in AI &amp; ML" },
  { n: "$8M",    l: "Annual revenue line built" },
  { n: "1200+",  l: "Daily platform users" },
  { n: "50+",    l: "GenAI apps powered" }
];

/* Clients delivered for, grouped by the firm the engagement ran through.
   `logo` maps to assets/logos/<logo>.png; entries without one fall back to a
   typographic wordmark, which is consistent with the design system. */
const CLIENTS = [
  { name: "Walmart",         logo: "walmart" },
  { name: "Abbott",          logo: "abbott" },
  { name: "AbbVie",          logo: "abbvie" },
  { name: "AB InBev",        logo: "abinbev" },
  { name: "Estée Lauder",    logo: "estee-lauder" },
  { name: "Kimberly-Clark",  logo: "kimberly-clark" },
  { name: "Sobeys",          logo: "sobeys" },
  { name: "Stellantis",      logo: "stellantis" },
  { name: "Mercedes-Benz",   logo: "mercedes" },
  { name: "HealthStats",     logo: null }
];

/* ------------------------------------------------------------------ render */
function renderPage() {
  document.getElementById("focus-cards").innerHTML = FOCUS.map((f, i) => `
    <article class="card card--hover panel-${f.color} reveal ${i % 2 ? "reveal--right" : "reveal--left"}">
      <div class="icon-tile"><i data-icon="${f.icon}"></i></div>
      <h3 class="h-3" style="text-transform:uppercase;letter-spacing:0">${f.title}</h3>
      <p class="mt-0" style="font-size:15px">${f.body}</p>
    </article>`).join("");

  document.getElementById("about-preview").innerHTML = BACKGROUND.map((c, i) => `
    <article class="card panel-${c.color} reveal ${i === 1 ? "" : (i ? "reveal--right" : "reveal--left")}">
      <div class="icon-tile"><i data-icon="${c.icon}"></i></div>
      <h3 class="h-3" style="text-transform:uppercase;letter-spacing:0">${c.title}</h3>
      <div class="mt-2">
        ${c.items.map(it => `
          <div class="mini">
            <span class="mini__icon"><i data-icon="${it.icon}" data-size="18"></i></span>
            <span class="mini__body"><b>${it.title}</b><span>${it.note}</span></span>
          </div>`).join("")}
      </div>
    </article>`).join("");

  document.getElementById("project-cards").innerHTML = PROJECTS.map((p, i) => `
    <a class="proj reveal ${i % 2 ? "reveal--right" : "reveal--left"}" href="${p.href}" aria-label="Read ${p.title}">
      <div class="proj__head panel-${p.color}">
        <div class="icon-tile"><i data-icon="${p.icon}"></i></div>
        <div class="arrow-tile"><i data-icon="arrowRight" data-size="20"></i></div>
      </div>
      <div class="proj__body">
        <p class="eyebrow mt-0" style="margin-bottom:4px">${p.label}</p>
        <h3 class="h-3">${p.title}</h3>
        <p style="font-size:15px">${p.body}</p>
        <div class="proj__tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </a>`).join("");

  document.getElementById("metrics").innerHTML = METRICS.map(m => `
    <div class="metric reveal reveal--zoom">
      <div class="metric__n">${m.n}</div>
      <div class="metric__l">${m.l}</div>
    </div>`).join("");

  // Two opposing bands, each holding the full client list so the loop reads
  // as continuous in both directions.
  const chip = c => c.logo
    ? `<div class="brand-logo"><img src="assets/logos/${c.logo}.png" alt="${c.name}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${c.name}'}))"></div>`
    : `<div class="brand-logo"><span>${c.name}</span></div>`;

  document.getElementById("clients-a").innerHTML = CLIENTS.map(chip).join("");

  document.getElementById("shelf-preview").innerHTML = BOOKSHELF.preview.map((col, i) => `
    <div class="shelf-col panel-${col.color} reveal ${i === 1 ? "" : (i ? "reveal--right" : "reveal--left")}">
      <h3>${col.name}</h3>
      ${col.books.map(b => `
        <div class="shelf-row">
          <i data-icon="book" data-size="20"></i>
          <div><b>${b.title}</b><span>${b.author}</span></div>
        </div>`).join("")}
    </div>`).join("");
}
