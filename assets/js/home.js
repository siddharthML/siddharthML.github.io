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
    color: "pink", icon: "chart",
    title: "Forecasting & Decision Science",
    body: "Two master's degrees in economics and machine learning, put to work. CATS forecasts 30,000 SKUs in under an hour for $20 of cloud spend, and the underlying research finished top 10 in the M6 Competition."
  },
  {
    color: "sand", icon: "users",
    title: "Teams & Go-To-Market",
    body: "I have led 16-member agile teams of data scientists, engineers and designers, aligned AI strategy from C-suite to customer service, and owned the pricing, positioning and patents that turned a service line into $8M of annual revenue."
  }
];

const ABOUT_PREVIEW = [
  {
    color: "blue", icon: "cap", title: "Education",
    items: [
      "M.Sc. Machine Learning & Data Science, <b>University College London</b> (Merit)",
      "M.Sc. Economics, <b>University of Warwick</b> (Merit)",
      "Deep learning, NLP, computer vision, RL, Bayesian networks",
      "Econometrics, causal inference, time-series, design of experiments"
    ]
  },
  {
    color: "lavender", icon: "award", title: "Recognition",
    items: [
      "<b>Commonwealth Scholarship</b> — awarded for academic and leadership potential",
      "<b>M6 Competition</b> — top 10 finish in the global forecasting benchmark",
      "Published in the <b>Journal of AI, Robotics &amp; Workplace Automation</b>",
      "Taught ML, computer vision and deep learning to 200+ students at ISB"
    ]
  },
  {
    color: "pink", icon: "spark", title: "How I Work",
    items: [
      "Ship the thin slice first, then scale it",
      "Evals before opinions — offline and online",
      "Comfortable in the codebase: Python, LangChain, PyTorch, FastAPI",
      "Domains: healthcare, supply chain, retail &amp; CPG, mining, automotive"
    ]
  }
];

const PROJECTS = [
  {
    color: "blue", icon: "bot", company: "o9 Solutions",
    title: "Enterprise Agent Harness",
    body: "Redesigned o9's agent harness to support consistent long-running and complex execution flows, plus the connectors and triggers ecosystem that lets agents ingest live data and reach third-party databases.",
    tags: ["Agentic AI", "Platform", "Enterprise"]
  },
  {
    color: "lavender", icon: "layers", company: "MathCo",
    title: "AskNucliOS",
    body: "A full-stack, no-code AI innovation platform covering LLM training and deployment, data prep, tool orchestration and monitoring — cutting GenAI project development time by 95% and powering 50+ applications.",
    tags: ["Zero-to-One", "No-Code", "LLMOps"]
  },
  {
    color: "aqua", icon: "chart", company: "MathCo",
    title: "Complete Automated Time-Series (CATS)",
    body: "A scalable forecasting engine for high-volume SKU domains, producing accurate predictions for 30,000 SKUs in under an hour at $20 of cloud cost. Deployed across retail, CPG and automotive engagements.",
    tags: ["Forecasting", "ML Systems", "Scale"]
  },
  {
    color: "pink", icon: "globe", company: "o9 Solutions",
    title: "AI-Powered Supply Chain Tower",
    body: "Auto-generates supply chain health reports by detecting shocks, assessing downstream impact and recommending mitigations grounded in each company's own operating protocols.",
    tags: ["Supply Chain", "Agents", "Decision Support"]
  }
];

const METRICS = [
  { n: "11+",    l: "Years in AI &amp; ML" },
  { n: "$8M",    l: "Annual revenue line built" },
  { n: "1200+",  l: "Daily platform users" },
  { n: "50+",    l: "GenAI apps powered" }
];

/* ------------------------------------------------------------------ render */
function renderPage() {
  document.getElementById("focus-cards").innerHTML = FOCUS.map((f, i) => `
    <article class="card card--hover panel-${f.color} reveal ${i % 2 ? "reveal--right" : "reveal--left"}">
      <div class="icon-tile"><i data-icon="${f.icon}"></i></div>
      <h3 class="h-3" style="text-transform:uppercase;letter-spacing:0">${f.title}</h3>
      <p class="mt-0" style="font-size:15px">${f.body}</p>
    </article>`).join("");

  document.getElementById("about-preview").innerHTML = ABOUT_PREVIEW.map((c, i) => `
    <article class="card card--hover panel-${c.color} reveal ${i === 1 ? "" : (i ? "reveal--right" : "reveal--left")}">
      <div class="icon-tile"><i data-icon="${c.icon}"></i></div>
      <h3 class="h-3" style="text-transform:uppercase;letter-spacing:0">${c.title}</h3>
      <ul style="font-size:15px">${c.items.map(t => `<li>${t}</li>`).join("")}</ul>
    </article>`).join("");

  document.getElementById("project-cards").innerHTML = PROJECTS.map((p, i) => `
    <a class="card card--hover reveal ${i % 2 ? "reveal--right" : "reveal--left"}" href="projects.html">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
        <div class="icon-tile panel-${p.color}"><i data-icon="${p.icon}"></i></div>
        <span class="tag" style="background:var(--canvas)">Case study soon</span>
      </div>
      <p class="eyebrow mt-0" style="margin-bottom:4px">${p.company}</p>
      <h3 class="h-3">${p.title}</h3>
      <p style="font-size:15px">${p.body}</p>
      <div>${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <p class="mt-2" style="font-weight:700;font-size:14px;display:flex;align-items:center;gap:8px;margin-bottom:0">
        View Case Study <i data-icon="arrowRight" data-size="16"></i>
      </p>
    </a>`).join("");

  document.getElementById("metrics").innerHTML = METRICS.map(m => `
    <div class="metric reveal reveal--zoom">
      <div class="metric__n">${m.n}</div>
      <div class="metric__l">${m.l}</div>
    </div>`).join("");

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
