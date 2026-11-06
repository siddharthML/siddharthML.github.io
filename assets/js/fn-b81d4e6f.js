/* Architecture explorer and long-form article navigation. */

const ARCHITECTURE_VIEWS = {
  architecture: { label: "Layer map", type: "map" },
  workflow: {
    label: "Workflow", type: "flow", title: "Request Workflow: Intake, Execution, Completion",
    summary: "A request moves through intake, context and execution, completion, and an asynchronous background tail.",
    width: 1000, height: 625,
    phases: [["Intake",135],["Context + execution",600],["Complete",875]],
    legend: [["blue","client"],["pink","security / control"],["green","orchestration logic"],["orange","tool execution"],["purple","persistence"],["gray","background worker"]],
    lanes: [["Client",20,20,960,100],["API + orchestration layer",20,135,960,145],["Tools + data services",20,295,960,125],["Background processing",20,435,960,120]],
    nodes: [
      {id:"submit",name:"Submit request",sub:"message + attachments",x:48,y:48,w:170,tone:"blue",group:"Intake",role:"Client request",detail:"The client submits a message and optional attachments to begin a turn."},
      {id:"response",name:"Receive response",sub:"streamed tokens + final state",x:790,y:48,w:170,tone:"blue",group:"Complete",role:"Client response",detail:"The client receives streamed events followed by the final turn state."},
      {id:"auth",name:"Authenticate",sub:"session + tenant",x:220,y:172,w:160,tone:"pink",group:"Intake",role:"Security and control",detail:"Authentication resolves the user session and tenant before any context or tool is accessed."},
      {id:"context",name:"Load context",sub:"history + retrieval",x:405,y:172,w:155,tone:"green",group:"Context + execution",role:"Orchestration",detail:"Conversation history and role-filtered retrieval context are assembled for the run."},
      {id:"loop",name:"Run orchestration loop",sub:"reasoning + tool calls",x:590,y:172,w:180,tone:"green",group:"Context + execution",role:"Orchestration",detail:"The engine alternates between reasoning and scoped tool calls until a final response is ready."},
      {id:"tool",name:"Execute tool",sub:"internal, connector, or sandbox",x:590,y:325,w:175,tone:"orange",group:"Tools + data services",role:"Tool execution",detail:"A selected internal service, connector, or sandbox runs with scoped context."},
      {id:"persist",name:"Persist turn",sub:"messages + usage + trace",x:790,y:325,w:170,tone:"purple",group:"Tools + data services",role:"Persistence",detail:"Messages, usage, and trace data are recorded outside the critical streaming path."},
      {id:"queue",name:"Queue summary job",sub:"async message queue",x:590,y:465,w:175,tone:"pink",group:"Background processing",role:"Queue",detail:"A background summary job is published after the turn is persisted."},
      {id:"summary",name:"Summarize turn",sub:"worker updates context",x:790,y:465,w:170,tone:"gray",group:"Background processing",role:"Worker",detail:"A worker compacts the completed turn so the next request can load concise context."}
    ],
    edges: [["submit","auth","request"],["auth","context","identity + tenant"],["context","loop","prepared state"],["loop","response","streamed events"],["loop","tool","tool call"],["tool","loop","result / error","dashed"],["loop","persist","final messages"],["persist","queue","enqueue"],["queue","summary","consume","dashed"]],
    steps: ["submit","auth","context","loop","tool","persist","queue","summary","response"]
  },
  sequence: {
    label: "Sequence", type: "sequence", title: "Request Sequence Across Components",
    summary: "The synchronous request path stays short; persistence and summary publication follow the streamed response.",
    participants: [
      {id:"client",name:"Client",x:55,detail:"Submits the request and receives streamed chunks."},{id:"api",name:"API layer",x:195,detail:"Loads configuration, starts the turn, and streams events."},{id:"store",name:"Operational store",x:335,detail:"Provides thread context and stores messages and usage."},{id:"engine",name:"Orchestration engine",x:475,detail:"Coordinates model reasoning and scoped tool execution."},{id:"tool",name:"Tool",x:615,detail:"Executes the requested action with scoped context."},{id:"model",name:"Model provider",x:755,detail:"Returns either a tool request or a final response."},{id:"queue",name:"Message queue",x:895,detail:"Receives the asynchronous turn-summary message."}
    ],
    messages: [
      ["client","api",120,"request"],["api","store",175,"load thread + config"],["store","api",220,"context","dashed"],["api","engine",275,"start turn"],["engine","model",330,"messages + tool schema"],["model","engine",375,"tool call","dashed"],["engine","tool",420,"execute with scoped context"],["tool","engine",465,"structured result","dashed"],["engine","model",510,"result + next prompt"],["model","engine",555,"final response","dashed"],["engine","api",600,"stream events"],["api","client",645,"streamed chunks","dashed"],["api","store",690,"persist messages + usage"],["api","queue",735,"publish turn summary","dashed"]
    ]
  },
  data: {
    label: "Data flow", type: "flow", title: "Knowledge and Configuration Data Flow",
    summary: "Content, configuration, and operational status follow separate paths that meet only where the system needs them.",
    width: 1000, height: 610,
    columns: [["Sources",120],["Ingest",300],["Process",490],["Store",690],["Consume",875]],
    legend: [["green","content path"],["purple","configuration path"],["orange","operational path"]],
    nodes: [
      {id:"docs",name:"Documents",sub:"tenant content",x:25,y:100,w:150,tone:"green",group:"Sources",role:"Content source",detail:"Tenant documents enter the content path as asynchronous ingestion jobs."},
      {id:"config",name:"Configuration data",sub:"tenant metadata",x:25,y:320,w:150,tone:"purple",group:"Sources",role:"Configuration source",detail:"Tenant metadata enters a separate configuration path."},
      {id:"queue",name:"Message queue",sub:"async job dispatch",x:215,y:210,w:165,tone:"gray",group:"Ingest",role:"Transport",detail:"Typed jobs decouple ingestion from downstream processing."},
      {id:"docpipe",name:"Document pipeline",sub:"chunk + embed",x:405,y:100,w:165,tone:"green",group:"Process",role:"Content processing",detail:"Documents are parsed, chunked, and embedded for retrieval."},
      {id:"cfgpipe",name:"Configuration pipeline",sub:"normalize + diff",x:405,y:320,w:165,tone:"purple",group:"Process",role:"Configuration processing",detail:"Configuration is normalized and differences become graph updates."},
      {id:"content",name:"Content store",sub:"vectors + chunks",x:615,y:100,w:165,tone:"green",group:"Store",role:"Content persistence",detail:"Chunks and vectors are stored for semantic retrieval."},
      {id:"graph",name:"Graph store",sub:"connected entities",x:615,y:320,w:165,tone:"purple",group:"Store",role:"Graph persistence",detail:"Connected configuration entities are stored as a graph."},
      {id:"retrieve",name:"Retrieval service",sub:"role-filtered context",x:815,y:210,w:165,tone:"blue",group:"Consume",role:"Retrieval",detail:"Semantic and graph context are joined under role filters."},
      {id:"ops",name:"Operational store",sub:"pipeline run history",x:615,y:440,w:165,tone:"orange",group:"Store",role:"Operational persistence",detail:"Pipeline history remains separate from content and graph knowledge."},
      {id:"status",name:"Status API",sub:"history + live events",x:815,y:440,w:165,tone:"orange",group:"Consume",role:"Status consumption",detail:"Clients read historical and live pipeline state through the status API."}
    ],
    edges: [["docs","queue","document job"],["config","queue","config job"],["queue","docpipe","document task"],["queue","cfgpipe","config task"],["docpipe","content","chunks + vectors"],["cfgpipe","graph","graph entities"],["content","retrieve","semantic context"],["graph","retrieve","graph context"],["graph","ops","run snapshot","dashed"],["ops","status","pipeline status"]],
    steps: ["docs","queue","docpipe","content","retrieve","config","cfgpipe","graph","ops","status"]
  },
  lifecycle: {
    label: "Lifecycle", type: "flow", title: "Agent Turn Lifecycle",
    summary: "A turn follows an explicit happy path with resumable interruptions, bounded recovery, and visible terminal exits.",
    width: 1000, height: 570,
    legend: [["blue","start"],["green","active"],["orange","waiting"],["purple","success"],["pink","failure / exit"]],
    lanes: [["Main path",20,50,960,120],["Interruptions",20,185,960,115],["Recovery loop",20,315,960,90],["Terminal exits",20,420,960,85]],
    nodes: [
      {id:"accepted",name:"Accepted",sub:"",x:50,y:90,w:145,tone:"blue",group:"Main path",role:"Start",detail:"The request has passed admission and has durable turn state."},
      {id:"prepared",name:"Prepared",sub:"",x:225,y:90,w:145,tone:"green",group:"Main path",role:"Active",detail:"Identity, configuration, memory, and retrieval context are ready."},
      {id:"executing",name:"Executing",sub:"",x:400,y:90,w:145,tone:"green",group:"Main path",role:"Active",detail:"The orchestration loop is running model and tool calls."},
      {id:"streaming",name:"Streaming",sub:"",x:575,y:90,w:145,tone:"green",group:"Main path",role:"Active",detail:"Response tokens are in flight while resumable state remains available."},
      {id:"completed",name:"Completed",sub:"",x:750,y:90,w:145,tone:"purple",group:"Main path",role:"Success",detail:"The response and required bookkeeping reached a successful terminal state."},
      {id:"approval",name:"Needs approval",sub:"",x:400,y:225,w:145,tone:"orange",group:"Interruptions",role:"Waiting",detail:"A mutating tool call pauses at a checkpoint for human approval."},
      {id:"input",name:"Needs input",sub:"",x:575,y:225,w:145,tone:"orange",group:"Interruptions",role:"Waiting",detail:"Missing information pauses the turn until the user supplies it."},
      {id:"retry",name:"Retrying",sub:"",x:400,y:330,w:145,tone:"pink",group:"Recovery loop",role:"Recovery",detail:"A recoverable failure re-enters execution within a bounded retry policy."},
      {id:"cancel",name:"Cancelled",sub:"",x:400,y:435,w:145,tone:"pink",group:"Terminal exits",role:"Failure / exit",detail:"Explicit cancellation or exhausted retries end the turn."},
      {id:"failed",name:"Failed",sub:"",x:575,y:435,w:145,tone:"pink",group:"Terminal exits",role:"Failure / exit",detail:"Unresolved input or an unrecoverable error closes the turn visibly."}
    ],
    edges: [["accepted","prepared",""],["prepared","executing",""],["executing","streaming",""],["streaming","completed",""],["executing","approval","mutating tool call"],["streaming","input","missing information"],["approval","retry","recoverable error"],["retry","accepted","retry execution"],["retry","cancel","exhausted retries","dashed"],["input","failed","unresolved input","dashed"]],
    steps: ["accepted","prepared","executing","streaming","completed","approval","retry","cancel","input","failed"]
  }
};

const LAYER_MAP = {
  width: 1200, height: 930,
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
    { id: "agent", name: "Agent layer", sub: "Graph orchestration · middleware · tools · system agents", x: 430, y: 230, w: 252, h: 176, tone: "green", group: "Kubernetes", role: "AI orchestration", detail: "The agent harness coordinates prompts, context, memory, caching, retrieval, follow-ups, task state, compaction, tools, and system agents." },
    { id: "app", name: "App layer (FastAPI)", sub: "AI APIs · chat · voice · config · scheduler · workers", x: 786, y: 230, w: 230, h: 176, tone: "blue", group: "Kubernetes", role: "Serving + automation", detail: "FastAPI exposes the AI experiences and configuration endpoints while schedulers and background workers handle automation." },
    { id: "nginx", name: "Nginx", sub: "Authenticated edge", x: 1060, y: 255, w: 105, h: 128, tone: "gray", group: "Kubernetes", role: "Gateway", detail: "Nginx is the platform edge. Existing auth middleware establishes the user and tenant context before AI endpoints are reached." },
    { id: "user", name: "User", sub: "Chat UI", x: 1090, y: 450, w: 78, tone: "blue", group: "Experience", role: "Client", detail: "The existing product surface embeds the AI experience and exchanges streaming events through the platform edge." },
    { id: "mcp", name: "MCP server", sub: "A2A agents · connectors", x: 430, y: 450, w: 252, tone: "orange", group: "Kubernetes", role: "Tool boundary", detail: "MCP servers, agent-to-agent capabilities, and connectors standardize how the harness reaches internal and external systems." },
    { id: "monitor", name: "Monitoring", sub: "Langfuse traces · OpenTelemetry", x: 430, y: 562, w: 252, tone: "pink", group: "Kubernetes", role: "Observability", detail: "LLM traces and OpenTelemetry connect agent decisions, tool calls, latency, usage, and failures to the operating model." },
    { id: "sandbox", name: "Python sandbox", sub: "K8s pod per tenant", x: 786, y: 450, w: 230, tone: "green", group: "Kubernetes", role: "Isolated execution", detail: "Each tenant receives an isolated execution boundary for generated Python and other untrusted workloads." },
    { id: "meter", name: "Usage metering", sub: "Pricing per agent run", x: 786, y: 562, w: 230, tone: "pink", group: "Kubernetes", role: "Commercial controls", detail: "Usage is attributed at agent-run granularity, allowing per-tenant accounting, quotas, and pricing." },
    { id: "mongo", name: "MongoDB", sub: "Conversation + run history", x: 786, y: 675, w: 230, tone: "purple", group: "Platform storage", role: "Document state", detail: "MongoDB retains conversation history, run documents, logs, and flexible event payloads produced by the AI layer." },
    { id: "cicd", name: "CI/CD", sub: "Build + test coverage", x: 18, y: 820, w: 145, tone: "blue", group: "Delivery", role: "Build pipeline", detail: "The delivery pipeline builds the AI services and enforces deterministic tests plus AI evaluation gates." },
    { id: "registry", name: "Container registry", sub: "Clean-start images", x: 350, y: 820, w: 170, tone: "gray", group: "Delivery", role: "Artifact store", detail: "Versioned, minimal images provide a repeatable and reviewable deployment artifact." },
    { id: "argocd", name: "ArgoCD", sub: "GitOps deployment · separate repo", x: 555, y: 820, w: 175, tone: "green", group: "Delivery", role: "Kubernetes deployment", detail: "ArgoCD reconciles the complete AI platform environment into Kubernetes from a separate GitOps repository." }
  ],
  edges: [["raw","columnar"],["columnar","agent"],["pvc","agent"],["postgres","agent"],["redis","agent"],["falkor","agent"],["solr","agent"],["models","agent"],["rabbit","app"],["agent","app","dashed"],["app","nginx"],["user","nginx"],["agent","mcp"],["mcp","monitor"],["app","sandbox"],["sandbox","meter"],["monitor","mongo"],["meter","mongo"],["cicd","registry"],["registry","argocd"],["argocd","kubernetes"]],
  steps: [
    ["raw","columnar","Raw lake data is promoted through integration pipelines into the clean analytical store."],
    ["columnar","agent","The agent harness combines clean data with PostgreSQL, Redis, graph, search, and durable files."],
    ["models","agent","Reasoning is delegated to external model endpoints through the controlled agent layer."],
    ["agent","app","The harness and FastAPI layer collaborate across a deliberately narrow service boundary."],
    ["app","nginx","The application streams results through Nginx and the existing authenticated product surface."],
    ["rabbit","app","Long-running automation moves onto RabbitMQ and Celery workers."],
    ["app","sandbox","Tenant-specific code execution is isolated in a dedicated Kubernetes sandbox."],
    ["meter","mongo","Usage, traces, and run state are persisted for operations and commercial controls."],
    ["argocd","kubernetes","ArgoCD reconciles the complete Kubernetes environment from the versioned deployment configuration."]
  ]
};

// A virtual target aligned with ArgoCD; selecting it highlights the full boundary.
const KUBERNETES_TARGET = { id: "kubernetes", x: 555, y: 150, w: 175, h: 505 };

function layerTarget(id) {
  return id === "kubernetes" ? KUBERNETES_TARGET : LAYER_MAP.nodes.find(node => node.id === id);
}

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
  if (view.type === "map") renderLayerMap();
  if (view.type === "flow") renderFlow(view);
  if (view.type === "sequence") renderSequence(view);
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

function diagramSvg(view, markerId) {
  return `<svg viewBox="0 0 ${view.width} ${view.height}" aria-hidden="true"><defs><marker id="${markerId}" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#5A4A42"></path></marker></defs>${view.edges.map((edge, index) => {
    const from = view.nodes.find(node => node.id === edge[0]), to = view.nodes.find(node => node.id === edge[1]);
    const a = center(from), b = center(to);
    return `<path class="diagram-path${edge[3] === "dashed" ? " is-dashed" : ""}" style="marker-end:url(#${markerId})" data-edge="${index}" d="${edgePath(from, to)}"></path>${edge[2] ? `<text class="diagram-edge-label" x="${(a.x + b.x) / 2}" y="${(a.y + b.y) / 2 - 6}">${edge[2]}</text>` : ""}`;
  }).join("")}</svg>`;
}

function renderFlow(view) {
  const panel = document.querySelector("#diagram-panel");
  const lanes = (view.lanes || []).map(lane => `<div class="native-lane" style="left:${lane[1]}px;top:${lane[2]}px;width:${lane[3]}px;height:${lane[4]}px"><span>${lane[0]}</span></div>`).join("");
  const columns = (view.columns || []).map(column => `<div class="native-column" style="left:${column[1]}px"><span>${column[0]}</span></div>`).join("");
  const phases = (view.phases || []).map(phase => `<span class="native-phase" style="left:${phase[1]}px">${phase[0]}</span>`).join("");
  const legend = (view.legend || []).map(item => `<span class="native-legend-item"><i data-tone="${item[0]}"></i>${item[1]}</span>`).join("");
  panel.innerHTML = `<div class="diagram-workspace"><div class="diagram-canvas-wrap"><div class="diagram-canvas native-diagram" style="width:${view.width}px;min-width:${view.width}px;height:${view.height}px;min-height:${view.height}px" data-diagram-canvas><h3 class="diagram-view-title">${view.title}</h3>${phases}${lanes}${columns}${diagramSvg(view, `arrow-${activeView}`)}${view.nodes.map(node => `<button class="diagram-node" type="button" data-node="${node.id}" data-tone="${node.tone}" style="left:${node.x}px;top:${node.y}px;width:${node.w}px;min-height:${node.h || 76}px"><span class="diagram-node__name">${node.name}</span>${node.sub ? `<span class="diagram-node__sub">${node.sub}</span>` : ""}</button>`).join("")}${legend ? `<div class="native-legend">${legend}</div>` : ""}</div></div><aside class="diagram-inspector" data-diagram-inspector aria-live="polite"></aside></div>`;
  panel.querySelectorAll("[data-node]").forEach(button => button.addEventListener("click", () => selectFlowNode(button.dataset.node)));
  renderFlowInspector(view);
  document.querySelector("[data-diagram-help]").textContent = "Select any component for context, or walk the diagram step by step. Every label and relationship follows the supplied architecture diagram.";
}

function renderFlowInspector(view, node) {
  const inspector = document.querySelector("[data-diagram-inspector]");
  inspector.innerHTML = node ? `<p class="diagram-inspector__type">${node.group}</p><h3>${node.name}</h3><p>${node.detail}</p><dl><dt>Role</dt><dd>${node.role}</dd><dt>View</dt><dd>${view.title}</dd></dl>${flowControls()}` : `<p class="diagram-inspector__type">${view.label}</p><h3>${view.title}</h3><p>${view.summary}</p><dl><dt>How to explore</dt><dd>Select a component or trace the highlighted route.</dd></dl>${flowControls()}`;
  inspector.querySelector("[data-step]").addEventListener("click", stepNativeDiagram);
  inspector.querySelector("[data-reset]").addEventListener("click", () => { activeStep = -1; renderFlow(view); });
}

function flowControls() { return `<div class="diagram-controls"><button class="diagram-control" type="button" data-step>Walk the flow</button><button class="diagram-control" type="button" data-reset>Reset</button></div><div class="diagram-step" data-step-copy hidden></div>`; }

function selectFlowNode(id) {
  const view = ARCHITECTURE_VIEWS[activeView], node = view.nodes.find(item => item.id === id);
  document.querySelectorAll(".diagram-node").forEach(el => el.classList.toggle("is-active", el.dataset.node === id));
  document.querySelectorAll(".diagram-path").forEach((path, index) => path.classList.toggle("is-active", view.edges[index].slice(0, 2).includes(id)));
  renderFlowInspector(view, node);
}

function stepNativeDiagram() {
  const view = ARCHITECTURE_VIEWS[activeView];
  activeStep = (activeStep + 1) % view.steps.length;
  const nodeId = view.steps[activeStep];
  const edgeIndex = view.edges.findIndex(edge => edge[1] === nodeId);
  document.querySelectorAll(".diagram-node").forEach(node => node.classList.toggle("is-active", node.dataset.node === nodeId));
  document.querySelectorAll(".diagram-path").forEach((path, index) => path.classList.toggle("is-active", index === edgeIndex));
  const node = view.nodes.find(item => item.id === nodeId), copy = document.querySelector("[data-step-copy]");
  copy.hidden = false; copy.innerHTML = `<strong>Step ${activeStep + 1} of ${view.steps.length}</strong><span>${node.name}${node.sub ? ` — ${node.sub}` : ""}</span>`;
}

function renderSequence(view) {
  const panel = document.querySelector("#diagram-panel"), width = 1010, height = 790;
  const participant = id => view.participants.find(item => item.id === id);
  panel.innerHTML = `<div class="diagram-workspace"><div class="diagram-canvas-wrap"><div class="diagram-canvas native-diagram sequence-diagram" style="width:${width}px;min-width:${width}px;height:${height}px;min-height:${height}px" data-diagram-canvas><h3 class="diagram-view-title">${view.title}</h3><svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><defs><marker id="sequence-arrow" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#5A4A42"></path></marker></defs>${view.participants.map(item => `<line class="sequence-lifeline" x1="${item.x + 60}" y1="102" x2="${item.x + 60}" y2="755"></line>`).join("")}${view.messages.map((message, index) => { const from = participant(message[0]), to = participant(message[1]), x1 = from.x + 60, x2 = to.x + 60; return `<line class="sequence-message${message[4] === "dashed" ? " is-dashed" : ""}" data-message="${index}" data-from="${message[0]}" data-to="${message[1]}" x1="${x1}" y1="${message[2]}" x2="${x2}" y2="${message[2]}" marker-end="url(#sequence-arrow)"></line><text class="sequence-label" x="${(x1 + x2) / 2}" y="${message[2] - 8}">${message[3]}</text>`; }).join("")}</svg>${view.participants.map(item => `<button class="sequence-participant" type="button" data-participant="${item.id}" style="left:${item.x}px"><span>${item.name}</span></button>`).join("")}</div></div><aside class="diagram-inspector" data-diagram-inspector aria-live="polite"></aside></div>`;
  panel.querySelectorAll("[data-participant]").forEach(button => button.addEventListener("click", () => selectParticipant(button.dataset.participant)));
  renderSequenceInspector(view);
  document.querySelector("[data-diagram-help]").textContent = "Select a participant to trace its calls, or walk the sequence message by message. Solid lines are synchronous calls; dashed lines are returns or asynchronous messages.";
}

function renderSequenceInspector(view, item) {
  const inspector = document.querySelector("[data-diagram-inspector]");
  inspector.innerHTML = item ? `<p class="diagram-inspector__type">Sequence participant</p><h3>${item.name}</h3><p>${item.detail}</p><dl><dt>Connected messages</dt><dd>${view.messages.filter(message => message[0] === item.id || message[1] === item.id).length}</dd></dl>${sequenceControls()}` : `<p class="diagram-inspector__type">Sequence</p><h3>${view.title}</h3><p>${view.summary}</p><dl><dt>How to explore</dt><dd>Select a participant or trace every message in order.</dd></dl>${sequenceControls()}`;
  inspector.querySelector("[data-step]").addEventListener("click", stepSequence);
  inspector.querySelector("[data-reset]").addEventListener("click", () => { activeStep = -1; renderSequence(view); });
}

function sequenceControls() { return `<div class="diagram-controls"><button class="diagram-control" type="button" data-step>Walk the sequence</button><button class="diagram-control" type="button" data-reset>Reset</button></div><div class="diagram-step" data-step-copy hidden></div>`; }

function selectParticipant(id) {
  const view = ARCHITECTURE_VIEWS.sequence, item = view.participants.find(participant => participant.id === id);
  document.querySelectorAll(".sequence-participant").forEach(button => button.classList.toggle("is-active", button.dataset.participant === id));
  document.querySelectorAll(".sequence-message").forEach(line => line.classList.toggle("is-active", line.dataset.from === id || line.dataset.to === id));
  renderSequenceInspector(view, item);
}

function stepSequence() {
  const view = ARCHITECTURE_VIEWS.sequence;
  activeStep = (activeStep + 1) % view.messages.length;
  const message = view.messages[activeStep];
  document.querySelectorAll(".sequence-message").forEach((line, index) => line.classList.toggle("is-active", index === activeStep));
  document.querySelectorAll(".sequence-participant").forEach(button => button.classList.toggle("is-active", button.dataset.participant === message[0] || button.dataset.participant === message[1]));
  const copy = document.querySelector("[data-step-copy]"); copy.hidden = false; copy.innerHTML = `<strong>Message ${activeStep + 1} of ${view.messages.length}</strong><span>${message[3]}</span>`;
}

function renderLayerMap() {
  const panel = document.querySelector("#diagram-panel");
  panel.innerHTML = `<div class="diagram-workspace"><div class="diagram-canvas-wrap"><div class="diagram-canvas diagram-canvas--platform" data-diagram-canvas><div class="platform-boundary" data-kubernetes-boundary><span>Kubernetes</span><small>Auth middleware</small></div><svg viewBox="0 0 ${LAYER_MAP.width} ${LAYER_MAP.height}" aria-hidden="true"><defs><marker id="arrowhead" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#5A4A42"></path></marker></defs>${LAYER_MAP.edges.map((edge, index) => { const from = layerTarget(edge[0]), to = layerTarget(edge[1]); return `<path class="diagram-path${edge[2] === "dashed" ? " is-dashed" : ""}" data-edge="${index}" d="${edgePath(from, to)}"></path>`; }).join("")}</svg>${LAYER_MAP.nodes.map(node => `<button class="diagram-node" type="button" data-node="${node.id}" data-tone="${node.tone}" style="left:${node.x}px;top:${node.y}px;width:${node.w}px;min-height:${node.h || 78}px"><span class="diagram-node__name">${node.name}</span><span class="diagram-node__sub">${node.sub}</span></button>`).join("")}</div></div><aside class="diagram-inspector" data-diagram-inspector aria-live="polite"></aside></div>`;
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
  document.querySelector("[data-kubernetes-boundary]")?.classList.toggle("is-active", id === "argocd");
  renderInspector(node);
}

function stepDiagram() {
  activeStep = (activeStep + 1) % LAYER_MAP.steps.length;
  const [from, to, copyText] = LAYER_MAP.steps[activeStep];
  document.querySelectorAll(".diagram-node").forEach(node => node.classList.toggle("is-active", node.dataset.node === from || node.dataset.node === to));
  document.querySelectorAll(".diagram-path").forEach((path, index) => { const edge = LAYER_MAP.edges[index]; path.classList.toggle("is-active", edge[0] === from && edge[1] === to); });
  document.querySelector("[data-kubernetes-boundary]")?.classList.toggle("is-active", to === "kubernetes");
  const copy = document.querySelector("[data-step-copy]"); copy.hidden = false; copy.innerHTML = `<strong>Step ${activeStep + 1} of ${LAYER_MAP.steps.length}</strong><span>${copyText}</span>`;
}

function initArticleNavigation() {
  const progress = document.querySelector(".article-toc__progress span"), links = [...document.querySelectorAll(".article-toc a")], sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const update = () => { const max = document.documentElement.scrollHeight - innerHeight; if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`; let current = sections[0]; sections.forEach(section => { if (section.getBoundingClientRect().top <= 150) current = section; }); links.forEach(link => link.setAttribute("aria-current", String(current && link.getAttribute("href") === `#${current.id}`))); };
  addEventListener("scroll", update, { passive: true }); update();
}

document.addEventListener("DOMContentLoaded", () => { diagramTemplate(); initArticleNavigation(); });
