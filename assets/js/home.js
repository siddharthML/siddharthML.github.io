/* ============================================================================
   Homepage content. Edit the arrays below to change what the homepage shows.
   ============================================================================ */

const FOCUS = [
  {
    color: "blue", icon: "bot",
    title: "Enterprise Agentic AI",
    body: "I design the harness that makes agents dependable at work — long-running, multi-step execution flows serving 1200+ users across 12+ B2B clients every day, with connectors and triggers that let those agents reach live enterprise data."
  },
  {
    color: "lavender", icon: "layers",
    title: "Zero-to-One Platforms",
    body: "I take AI products from a blank page to production. AskNucliOS, the no-code GenAI platform I built, cut project development time by 95% and now powers 50+ applications across healthcare, marketing, retail and CPG."
  },
  {
    color: "pink", icon: "target",
    title: "Evaluation & LLMOps",
    body: "I am sceptical of AI features that cannot be measured. I build the offline and online evaluation frameworks, monitoring and LLM-Ops practice that turn a promising demo into something a business will actually depend on."
  },
  {
    color: "sand", icon: "users",
    title: "Teams & Go-To-Market",
    body: "I have led 16-member agile teams of data scientists, engineers and designers, aligned AI strategy from C-suite to customer service, and owned the pricing, positioning and patents that turned a service line into $8M of annual revenue."
  }
];

/* Three columns of the "My Background" section. Each entry renders as its own
   bordered mini-card rather than a bullet. */
const BACKGROUND = [
  {
    color: "blue", icon: "cap", title: "Education",
    items: [
      { icon: "cap", title: "M.Sc. Machine Learning &amp; Data Science", note: "University College London · Merit" },
      { icon: "cap", title: "M.Sc. Economics", note: "University of Warwick · Merit" },
      { icon: "award", title: "Commonwealth Scholar", note: "Commonwealth Scholarship Commission" },
      { icon: "book", title: "Ph.D.-level coursework, Stochastic Processes", note: "Indian School of Business" }
    ]
  },
  {
    color: "lavender", icon: "spark", title: "Certifications",
    items: [
      { icon: "spark", title: "Reinforcement Learning from Human Feedback", note: "DeepLearning.AI · 2025" },
      { icon: "bot",   title: "Multi AI Agent Systems with crewAI",         note: "DeepLearning.AI · 2025" },
      { icon: "cpu",   title: "MCP: Build Rich-Context AI Apps with Anthropic", note: "DeepLearning.AI · 2025" },
      { icon: "layers", title: "Introduction to On-Device AI",              note: "DeepLearning.AI · 2025" },
      { icon: "database", title: "Building &amp; Evaluating Advanced RAG",  note: "DeepLearning.AI · 2024" },
      { icon: "gear",  title: "Finetuning Large Language Models",           note: "DeepLearning.AI · 2024" }
    ]
  },
  {
    color: "pink", icon: "quote", title: "Fun Facts",
    items: [
      { icon: "globe",     title: "Startups to government", note: "Tech startups, giant product companies, academia, government and NGOs" },
      { icon: "cap",       title: "Arts to engineering",    note: "Went from an arts undergraduate degree to an engineering master's" },
      { icon: "briefcase", title: "Wore most of the hats",  note: "Data science, engineering, marketing, sales, product — and everything between" },
      { icon: "chart",     title: "Closet economist",       note: "Still love macroeconomics and forecasting" }
    ]
  }
];

const PROJECTS = [
  {
    color: "blue", icon: "bot", company: "o9 Solutions",
    title: "Enterprise Agent Harness",
    body: "Redesigned o9's agent harness to support consistent long-running and complex execution flows, plus the connectors and triggers ecosystem that lets agents ingest live data and reach third-party databases.",
    tags: ["Agentic AI", "LLMOps", "Model Context Protocol"]
  },
  {
    color: "lavender", icon: "layers", company: "MathCo",
    title: "AskNucliOS",
    body: "A full-stack, no-code AI innovation platform covering LLM training and deployment, data prep, tool orchestration and monitoring — cutting GenAI project development time by 95% and powering 50+ applications.",
    tags: ["Generative AI", "Transformers", "Product Development"]
  },
  {
    color: "aqua", icon: "chart", company: "MathCo",
    title: "AI Storyboards & AI-for-BI",
    body: "Chat-driven analytics: onboard data, generate and edit dashboard screens, request insights, and compose shareable data stories with AI-generated summaries tuned by tone, complexity and length.",
    tags: ["Generative AI", "UIX", "Product Research"]
  },
  {
    color: "pink", icon: "gear", company: "MathCo",
    title: "Complete Automated Time-Series (CATS)",
    body: "A demand-forecasting and simulation platform for domains with thousands of SKUs, delivering daily predictions for 30,000 SKUs and deployed across retail, CPG and automotive engagements.",
    tags: ["Model Training", "DevOps", "A/B Testing"]
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
    <a class="proj reveal ${i % 2 ? "reveal--right" : "reveal--left"}" href="projects.html">
      <div class="proj__head panel-${p.color}">
        <div class="icon-tile"><i data-icon="${p.icon}"></i></div>
        <div class="arrow-tile"><i data-icon="arrowRight" data-size="20"></i></div>
      </div>
      <div class="proj__body">
        <p class="eyebrow mt-0" style="margin-bottom:4px">${p.company}</p>
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
  document.getElementById("clients-b").innerHTML = [...CLIENTS].reverse().map(chip).join("");

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
