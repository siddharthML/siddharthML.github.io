/* Architecture explorer and long-form article navigation. */

const ARCHITECTURE_VIEWS = {
  architecture: { label: "Layer map", type: "map" },
  workflow: { label: "Workflow", type: "archify", src: "assets/diagrams/nova-agent-turn-workflow.html?theme=light", title: "Nova agent-turn workflow — interactive Archify diagram" },
  sequence: { label: "Sequence", type: "archify", src: "assets/diagrams/nova-chat-sequence.html?theme=light", title: "Nova chat-request sequence — interactive Archify diagram" },
  data: { label: "Data flow", type: "archify", src: "assets/diagrams/nova-knowledge-data-flow.html?theme=light", title: "Nova knowledge and data flow — interactive Archify diagram" },
  lifecycle: { label: "Lifecycle", type: "archify", src: "assets/diagrams/nova-turn-lifecycle.html?theme=light", title: "Nova turn lifecycle — interactive Archify diagram" }
};

const LAYER_MAP = {
  width: 1200, height: 760,
  nodes: [
    { id: "raw", name: "Raw data", sub: "Data lake", x: 18, y: 194, w: 116, tone: "gray", group: "Legacy data", role: "System of record", detail: "The existing raw-data lake remains authoritative. Integration pipelines publish governed data without forcing a source-system rewrite." },
    { id: "columnar", name: "Columnar database", sub: "Clean analytical data", x: 184, y: 194, w: 136, tone: "blue", group: "Legacy data", role: "Clean-data interface", detail: "Airflow-style integration pipelines turn raw data into a fast analytical interface for agents and application services." },
    { id: "pvc", name: "PVC", sub: "Durable file storage", x: 184, y: 66, w: 136, tone: "gray", group: "Platform storage", role: "Shared storage", detail: "Persistent volumes provide durable working files to services running inside the Kubernetes boundary." },
    { id: "postgres", name: "PostgreSQL", sub: "Configuration + state", x: 184, y: 326, w: 136, tone: "purple", group: "Harness stores", role: "Structured state", detail: "PostgreSQL stores configuration, ingestion metadata, checkpoints, and other structured operational state." },
    { id: "redis", name: "Redis", sub: "Cache + session memory", x: 184, y: 438, w: 136, tone: "orange", group: "Harness stores", role: "Fast state", detail: "Redis keeps short-lived session memory, cached responses, locks, and coordination state close to the agent loop." },
    { id: "falkor", name: "FalkorDB", sub: "Graph relationships", x: 184, y: 550, w: 136, tone: "purple", group: "Harness stores", role: "Knowledge graph", detail: "The graph store represents connected entities across tenants, systems, agents, tools, and configuration." },
    { id: "solr", name: "Apache Solr", sub: "Search index", x: 184, y: 662, w: 136, tone: "green", group: "Harness stores", role: "Retrieval", detail: "The search tier provides lexical and indexed retrieval for content already managed by the legacy platform." },
    { id: "models", name: "Model hosting", sub: "Azure · Vertex · AWS · OpenAI · Claude", x: 430, y: 18, w: 250, tone: "pink", group: "External services", role: "Model endpoints", detail: "Externally hosted model providers sit behind the agent layer so routing and provider choice can evolve without changing serving applications." },
    { id: "rabbit", name: "RabbitMQ", sub: "Background jobs · Celery broker", x: 786, y: 18, w: 230, tone: "orange", group: "External services", role: "Async transport", detail: "RabbitMQ carries background jobs so persistence, ingestion, automation, and summarization do not lengthen the request-critical path." },
    { id: "agent", name: "Agent layer", sub: "LangGraph harness · middleware · 103 tools · 15 system agents", x: 430, y: 230, w: 252, h: 176, tone: "green", group: "Kubernetes", role: "AI orchestration", detail: "The LangGraph harness coordinates prompts, context, memory, cache, EKG retrieval, follow-ups, todo state, compaction, tools, and system agents." },
    { id: "app", name: "App layer (FastAPI)", sub: "api /api/ai/* · chat · voice · config · scheduler · workers", x: 786, y: 230, w: 230, h: 176, tone: "blue", group: "Kubernetes", role: "Serving + automation", detail: "FastAPI exposes chat, voice, EKG, and configuration endpoints while scheduler and Celery workers handle automation." },
    { id: "nginx", name: "Nginx", sub: "Authenticated edge", x: 1060, y: 255, w: 105, h: 128, tone: "gray", group: "Kubernetes", role: "Gateway", detail: "Nginx is the platform edge. Existing auth middleware establishes the user and tenant context before AI endpoints are reached." },
    { id: "user", name: "User", sub: "Chat UI", x: 1090, y: 450, w: 78, tone: "blue", group: "Experience", role: "Client", detail: "The existing product surface embeds the AI experience and exchanges streaming events through the platform edge." },
    { id: "mcp", name: "MCP server", sub: "A2A agents · connectors", x: 430, y: 450, w: 252, tone: "orange", group: "Kubernetes", role: "Tool boundary", detail: "MCP servers, agent-to-agent capabilities, and connectors standardize how the harness reaches internal and external systems." },
    { id: "monitor", name: "Monitoring", sub: "Langfuse traces · OpenTelemetry", x: 430, y: 562, w: 252, tone: "pink", group: "Kubernetes", role: "Observability", detail: "LLM traces and OpenTelemetry connect agent decisions, tool calls, latency, usage, and failures to the operating model." },
    { id: "sandbox", name: "Python sandbox", sub: "K8s pod per tenant", x: 786, y: 450, w: 230, tone: "green", group: "Kubernetes", role: "Isolated execution", detail: "Each tenant receives an isolated execution boundary for generated Python and other untrusted workloads." },
    { id: "meter", name: "Usage metering", sub: "Pricing per agent run", x: 786, y: 562, w: 230, tone: "pink", group: "Kubernetes", role: "Commercial controls", detail: "Usage is attributed at agent-run granularity, allowing per-tenant accounting, quotas, and pricing." },
    { id: "mongo", name: "MongoDB", sub: "Conversation + run history", x: 786, y: 675, w: 230, tone: "purple", group: "Platform storage", role: "Document state", detail: "MongoDB retains conversation history, run documents, logs, and flexible event payloads produced by the AI layer." },
    { id: "cicd", name: "Azure CI/CD", sub: "Build + 90% test coverage", x: 18, y: 675, w: 145, tone: "blue", group: "Delivery", role: "Build pipeline", detail: "The delivery pipeline builds the AI services and enforces deterministic tests plus AI evaluation gates." },
    { id: "registry", name: "Container registry", sub: "Clean-start images", x: 350, y: 675, w: 170, tone: "gray", group: "Delivery", role: "Artifact store", detail: "Versioned, minimal images provide a repeatable and reviewable deployment artifact." },
    { id: "argocd", name: "ArgoCD", sub: "GitOps deployment · separate repo", x: 555, y: 675, w: 175, tone: "green", group: "Delivery", role: "Deployment", detail: "ArgoCD reconciles the independently versioned AI layer into Kubernetes from a separate GitOps repository." }
  ],
  edges: [["raw","columnar"],["columnar","agent"],["pvc","agent"],["postgres","agent"],["redis","agent"],["falkor","agent"],["solr","agent"],["models","agent"],["rabbit","app"],["agent","app","dashed"],["app","nginx"],["user","nginx"],["agent","mcp"],["mcp","monitor"],["app","sandbox"],["sandbox","meter"],["monitor","mongo"],["meter","mongo"],["cicd","registry"],["registry","argocd"],["argocd","agent"]],
  steps: [
    ["raw","columnar","Raw lake data is promoted through integration pipelines into the clean analytical store."],
    ["columnar","agent","The agent harness combines clean data with PostgreSQL, Redis, graph, search, and durable files."],
    ["models","agent","Reasoning is delegated to external model endpoints through the controlled agent layer."],
    ["agent","app","The harness and FastAPI layer collaborate across a deliberately narrow service boundary."],
    ["app","nginx","The application streams results through Nginx and the existing authenticated product surface."],
    ["rabbit","app","Long-running automation moves onto RabbitMQ and Celery workers."],
    ["app","sandbox","Tenant-specific code execution is isolated in a dedicated Kubernetes sandbox."],
    ["meter","mongo","Usage, traces, and run state are persisted for operations and commercial controls."],
    ["cicd","argocd","Tested images move through the registry and are reconciled into Kubernetes by ArgoCD."]
  ]
};

let activeView = "architecture";
let activeStep = -1;

function diagramTemplate() {
  const host = document.querySelector("[data-architecture-explorer]");
  if (!host) return;
  host.innerHTML = `<div class="diagram-tabs" role="tablist" aria-label="Architecture views">${Object.entries(ARCHITECTURE_VIEWS).map(([key, view], index) => `<button id="diagram-tab-${key}" class="diagram-tab" type="button" role="tab" data-view="${key}" aria-controls="diagram-panel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${view.label}</button>`).join("")}</div><div id="diagram-panel" role="tabpanel" aria-labelledby="diagram-tab-architecture"></div><div class="diagram-help" data-diagram-help></div>`;
  const tabs = [...host.querySelectorAll("[data-view]")];
  tabs.forEach((button, index) => {
    button.addEventListener("click", () => activateView(button.dataset.view));
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      tabs[next].focus(); activateView(tabs[next].dataset.view);
    });
  });
  activateView(activeView);
}

function activateView(key) {
  activeView = key; activeStep = -1;
  const view = ARCHITECTURE_VIEWS[key];
  const host = document.querySelector("[data-architecture-explorer]");
  const panel = document.querySelector("#diagram-panel");
  host.querySelectorAll("[data-view]").forEach(tab => { const selected = tab.dataset.view === key; tab.setAttribute("aria-selected", String(selected)); tab.tabIndex = selected ? 0 : -1; });
  panel.setAttribute("aria-labelledby", `diagram-tab-${key}`);
  if (view.type === "archify") {
    panel.innerHTML = `<div class="archify-frame-wrap"><iframe class="archify-frame" src="${view.src}" title="${view.title}" loading="lazy"></iframe></div>`;
    document.querySelector("[data-diagram-help]").innerHTML = `This is the original interactive Archify view. Select nodes and relationships, trace routes, search, zoom, switch visual styles, or enter presentation mode. <a href="${view.src}" target="_blank" rel="noopener">Open ${view.label.toLowerCase()} full screen ↗</a>`;
    return;
  }
  renderLayerMap();
}

function center(node) { return { x: node.x + node.w / 2, y: node.y + (node.h || 78) / 2 }; }

function edgePath(from, to) {
  const a = center(from), b = center(to);
  if (Math.abs(a.x - b.x) > Math.abs(a.y - b.y)) {
    const direction = b.x > a.x ? 1 : -1, startX = a.x + direction * from.w / 2, endX = b.x - direction * to.w / 2, midX = (startX + endX) / 2;
    return `M ${startX} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${endX} ${b.y}`;
  }
  const direction = b.y > a.y ? 1 : -1, startY = a.y + direction * (from.h || 78) / 2, endY = b.y - direction * (to.h || 78) / 2, midY = (startY + endY) / 2;
  return `M ${a.x} ${startY} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${endY}`;
}

function renderLayerMap() {
  const panel = document.querySelector("#diagram-panel");
  panel.innerHTML = `<div class="diagram-workspace"><div class="diagram-canvas-wrap"><div class="diagram-canvas diagram-canvas--platform" data-diagram-canvas><div class="platform-boundary"><span>Kubernetes</span><small>Auth middleware</small></div><svg viewBox="0 0 ${LAYER_MAP.width} ${LAYER_MAP.height}" aria-hidden="true"><defs><marker id="arrowhead" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#5A4A42"></path></marker></defs>${LAYER_MAP.edges.map((edge, index) => { const from = LAYER_MAP.nodes.find(node => node.id === edge[0]), to = LAYER_MAP.nodes.find(node => node.id === edge[1]); return `<path class="diagram-path${edge[2] === "dashed" ? " is-dashed" : ""}" data-edge="${index}" d="${edgePath(from, to)}"></path>`; }).join("")}</svg>${LAYER_MAP.nodes.map(node => `<button class="diagram-node" type="button" data-node="${node.id}" data-tone="${node.tone}" style="left:${node.x}px;top:${node.y}px;width:${node.w}px;min-height:${node.h || 78}px"><span class="diagram-node__name">${node.name}</span><span class="diagram-node__sub">${node.sub}</span></button>`).join("")}</div></div><aside class="diagram-inspector" data-diagram-inspector aria-live="polite"></aside></div>`;
  panel.querySelectorAll("[data-node]").forEach(button => button.addEventListener("click", () => selectNode(button.dataset.node)));
  renderInspector();
  document.querySelector("[data-diagram-help]").textContent = "Select a component for context, or walk the system path. Scroll horizontally on smaller screens to inspect the complete platform.";
}

function controls() { return `<div class="diagram-controls"><button class="diagram-control" type="button" data-step>Walk the system</button><button class="diagram-control" type="button" data-reset>Reset</button></div><div class="diagram-step" data-step-copy hidden></div>`; }

function renderInspector(node) {
  const inspector = document.querySelector("[data-diagram-inspector]");
  inspector.innerHTML = node ? `<p class="diagram-inspector__type">${node.group}</p><h3>${node.name}</h3><p>${node.detail}</p><dl><dt>Role</dt><dd>${node.role}</dd><dt>Boundary</dt><dd>${node.group}</dd></dl>${controls()}` : `<p class="diagram-inspector__type">Platform architecture</p><h3>AI layer on the legacy platform</h3><p>The map follows the supplied topology: legacy and purpose-built stores feed a Kubernetes-hosted agent and application layer, with external models, queued work, isolated execution, metering, monitoring, and independent delivery.</p><dl><dt>How to explore</dt><dd>Select any component or walk the system path step by step.</dd></dl>${controls()}`;
  inspector.querySelector("[data-step]").addEventListener("click", stepDiagram);
  inspector.querySelector("[data-reset]").addEventListener("click", () => { activeStep = -1; renderLayerMap(); });
}

function selectNode(id) {
  const node = LAYER_MAP.nodes.find(item => item.id === id);
  document.querySelectorAll(".diagram-node").forEach(el => el.classList.toggle("is-active", el.dataset.node === id));
  document.querySelectorAll(".diagram-path").forEach((path, index) => path.classList.toggle("is-active", LAYER_MAP.edges[index].slice(0, 2).includes(id)));
  renderInspector(node);
}

function stepDiagram() {
  activeStep = (activeStep + 1) % LAYER_MAP.steps.length;
  const [from, to, copyText] = LAYER_MAP.steps[activeStep];
  document.querySelectorAll(".diagram-node").forEach(node => node.classList.toggle("is-active", node.dataset.node === from || node.dataset.node === to));
  document.querySelectorAll(".diagram-path").forEach((path, index) => { const edge = LAYER_MAP.edges[index]; path.classList.toggle("is-active", edge[0] === from && edge[1] === to); });
  const copy = document.querySelector("[data-step-copy]"); copy.hidden = false; copy.innerHTML = `<strong>Step ${activeStep + 1} of ${LAYER_MAP.steps.length}</strong><span>${copyText}</span>`;
}

function initArticleNavigation() {
  const progress = document.querySelector(".article-toc__progress span"), links = [...document.querySelectorAll(".article-toc a")], sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const update = () => { const max = document.documentElement.scrollHeight - innerHeight; if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`; let current = sections[0]; sections.forEach(section => { if (section.getBoundingClientRect().top <= 150) current = section; }); links.forEach(link => link.setAttribute("aria-current", String(current && link.getAttribute("href") === `#${current.id}`))); };
  addEventListener("scroll", update, { passive: true }); update();
}

document.addEventListener("DOMContentLoaded", () => { diagramTemplate(); initArticleNavigation(); });
