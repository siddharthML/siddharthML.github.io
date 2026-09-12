/* Interactive architecture explorer for the AI Layer article. */

const ARCHITECTURE_VIEWS = {
  architecture: {
    label: "Layer map",
    summary: "A layered architecture that leaves systems of record in place and adds an independently operated AI control plane.",
    nodes: [
      ["legacy", "Legacy data", "Databases, files and warehouses", 3, 48, "gray", "Existing systems remain authoritative. CDC and adapters expose change without forcing source rewrites.", "Raw data", "System of record"],
      ["clean", "Clean data interface", "Lakehouse, search and semantic APIs", 22, 48, "blue", "Business concepts such as customer, order and document hide the physical shape of legacy stores.", "Clean data", "Shared boundary"],
      ["gateway", "AI gateway", "Routing, cache and guardrails", 41, 8, "pink", "A shared model access layer centralizes provider fallback, caching, metering and safety policy.", "Model hosting", "New AI layer"],
      ["harness", "Agent harness", "Graph orchestration and memory", 41, 42, "green", "A purpose-built service coordinates reasoning, tools, memory, context compaction and checkpoints.", "Agent harness", "New AI layer"],
      ["tools", "Tool and connector layer", "MCP, internal APIs and sandbox", 61, 48, "orange", "Scoped adapters let agents reach existing business logic, third-party systems and isolated execution.", "Serving and tools", "Shared boundary"],
      ["experience", "Serving applications", "FastAPI, SSE and embedded UI", 80, 14, "blue", "An independently versioned API streams results into existing experiences without a front-end rewrite.", "Serving apps", "New AI layer"],
      ["stores", "Harness stores", "Postgres, document, graph and Redis", 41, 76, "purple", "Purpose-built stores keep conversations, configuration, memory and relationships away from core legacy databases.", "Agent database", "New AI layer"],
      ["ops", "Platform controls", "Auth, monitoring, security and evals", 80, 53, "pink", "Federated identity, traces, cost controls, evals and policy enforcement surround every run.", "Control plane", "Shared boundary"],
      ["deploy", "Isolated deployment", "Kubernetes namespaces and node pools", 80, 82, "green", "Independent scaling and rollback prevent agent or sandbox workloads from degrading the legacy platform.", "Deployment", "New AI layer"]
    ],
    edges: [["legacy","clean"],["clean","harness"],["gateway","harness"],["harness","tools"],["harness","stores"],["tools","experience"],["harness","ops"],["ops","experience"],["ops","deploy"]],
    steps: ["Stream change from existing sources.","Translate source schemas into stable business concepts.","Route model calls through one controlled gateway.","Coordinate reasoning, memory and tool use in the harness.","Serve the result through a separate API and operate it independently."]
  },
  workflow: {
    label: "Workflow",
    summary: "A single request moves through intake, context and execution, completion, then a background persistence tail.",
    lanes: [["Client",2,22],["API and orchestration",28,35],["Tools and data services",68,19],["Background processing",89,10]],
    nodes: [
      ["submit","Submit request","Message and attachments",4,8,"blue","The client starts a turn and can include attachments.","Client","Intake"],
      ["auth","Authenticate","Session and tenant",25,37,"pink","The existing identity provider authenticates the user and resolves tenant scope.","Security","Intake"],
      ["context","Load context","History and retrieval",46,37,"green","Conversation state and role-filtered knowledge are assembled before execution.","Orchestration","Context"],
      ["loop","Run orchestration loop","Reasoning and tool calls",67,37,"green","The engine alternates between model reasoning and scoped tool execution until a final answer exists.","Orchestration","Execution"],
      ["tool","Execute tool","Internal, connector or sandbox",67,72,"orange","A tool runs with tenant-scoped authority and returns a structured result or error.","Tool execution","Execution"],
      ["response","Receive response","Streamed tokens and final state",84,8,"blue","Tokens stream as they are produced; completion state follows.","Client","Complete"],
      ["persist","Persist turn","Messages, usage and trace",84,72,"purple","Messages, usage and trace data are saved after the response is available.","Persistence","Complete"],
      ["summary","Summarize turn","Worker updates compact context",67,91,"gray","A queued worker summarizes the finished turn for the next request.","Background worker","Async tail"]
    ],
    edges: [["submit","auth"],["auth","context"],["context","loop"],["loop","tool"],["tool","loop"],["loop","response"],["loop","persist"],["persist","summary"]],
    steps: ["Authenticate the request and resolve tenant context.","Load history and retrieval context.","Run the model and tool loop with scoped authority.","Stream the final response immediately.","Persist and summarize the turn asynchronously."]
  },
  sequence: {
    label: "Sequence",
    summary: "The synchronous request path stays short; persistence and summarization move off the response-critical path.",
    nodes: [
      ["client","Client","Sends request and receives chunks",2,8,"blue","The client sees streamed output before background bookkeeping finishes.","Participant","1 and 9"],
      ["api","API layer","Loads context and streams",18,8,"blue","The API accepts the request, loads configuration and relays streaming events.","Participant","2, 3, 8, 10"],
      ["store","Operational store","Thread, config and persistence",34,8,"purple","The operational store provides thread context and records messages and usage.","Participant","3 and 10"],
      ["engine","Orchestration engine","Controls the turn loop",50,8,"green","The engine owns state, model calls, tool calls and completion.","Participant","4 to 8"],
      ["tool","Tool","Runs scoped action",66,8,"orange","The selected tool executes using the caller's tenant scope.","Participant","6"],
      ["model","Model provider","Reasons and requests tools",82,8,"pink","The model receives messages and schemas, then returns a tool request or final response.","Participant","5 and 7"],
      ["queue","Message queue","Carries summary job",82,78,"gray","A dashed asynchronous message publishes work after persistence.","Participant","11"]
    ],
    edges: [["client","api"],["api","store"],["api","engine"],["engine","model"],["model","engine"],["engine","tool"],["tool","engine"],["engine","api"],["api","client"],["api","store"],["api","queue"]],
    steps: ["Client sends the request to the API.","API loads thread and tenant configuration.","Orchestration sends messages and tool schemas to the model.","Tool requests execute with scoped context and return structured results.","The final response streams to the client; persistence and queue publication follow."]
  },
  data: {
    label: "Data flow",
    summary: "Content and configuration travel through separate asynchronous paths and meet only when retrieval assembles context.",
    nodes: [
      ["docs","Documents","Tenant content",2,16,"green","Uploaded or synchronized documents start the content path.","Source","Content path"],
      ["config","Configuration data","Tenant metadata",2,68,"purple","System and tenant relationships start the configuration path.","Source","Configuration path"],
      ["queue","Message queue","Async job dispatch",24,42,"gray","One queue dispatches typed jobs without collapsing their downstream semantics.","Ingest","Shared transport"],
      ["docpipe","Document pipeline","Chunk and embed",45,16,"green","Content is parsed, chunked, embedded and prepared for semantic retrieval.","Process","Content path"],
      ["cfgpipe","Configuration pipeline","Normalize and diff",45,68,"purple","Configuration is normalized and differences become relationship updates.","Process","Configuration path"],
      ["content","Content store","Vectors and chunks",66,16,"green","The vector-capable store retains chunks and embeddings.","Store","Content path"],
      ["graph","Graph store","Connected entities",66,68,"purple","A graph preserves how tenants, systems, agents and tools relate.","Store","Configuration path"],
      ["retrieve","Retrieval service","Role-filtered context",83,42,"blue","The service combines semantic content and graph context under role filters.","Consume","Query-time join"],
      ["ops","Operational store","Pipeline run history",66,88,"orange","Run metadata remains separate from knowledge content.","Store","Operational path"],
      ["status","Status API","History and live events",84,88,"orange","Clients read progress without querying knowledge stores.","Consume","Operational path"]
    ],
    edges: [["docs","queue"],["config","queue"],["queue","docpipe"],["queue","cfgpipe"],["docpipe","content"],["cfgpipe","graph"],["content","retrieve"],["graph","retrieve"],["graph","ops"],["ops","status"]],
    steps: ["Documents and tenant configuration enqueue different job types.","Dedicated pipelines process content and relationships independently.","Content lands as chunks and vectors; configuration lands as a graph.","Retrieval joins both contexts under authorization.","Operational status follows a third, separate path."]
  },
  lifecycle: {
    label: "Lifecycle",
    summary: "A turn has explicit happy-path states, resumable interruptions, bounded retries and terminal exits.",
    lanes: [["Main path",3,27],["Interruptions",36,24],["Recovery loop",66,14],["Terminal exits",85,11]],
    nodes: [
      ["accepted","Accepted","Request admitted",3,11,"blue","The platform has accepted a valid request and assigned turn state.","Start","Main path"],
      ["prepared","Prepared","Context assembled",23,11,"green","Identity, configuration, memory and retrieval context are ready.","Active","Main path"],
      ["executing","Executing","Model and tools running",43,11,"green","The orchestration loop is actively producing the result.","Active","Main path"],
      ["streaming","Streaming","Response in flight",63,11,"green","The client is receiving output while the turn retains resumable state.","Active","Main path"],
      ["completed","Completed","Final state recorded",83,11,"purple","The response and bookkeeping have reached a successful terminal state.","Success","Main path"],
      ["approval","Needs approval","Mutating tool call paused",43,44,"orange","A consequential action pauses at a checkpoint until a person approves it.","Waiting","Interruption"],
      ["input","Needs input","Missing information",63,44,"orange","The turn pauses until the user supplies required context.","Waiting","Interruption"],
      ["retry","Retrying","Recoverable error",43,70,"pink","A bounded retry returns the turn to execution without rebuilding it from scratch.","Recovery","Retry loop"],
      ["cancelled","Cancelled","Retries exhausted or stopped",43,88,"pink","Explicit cancellation or an exhausted retry policy ends the turn.","Failure / exit","Terminal"],
      ["failed","Failed","Unresolved input or error",63,88,"pink","An unrecoverable condition closes the turn with a visible terminal state.","Failure / exit","Terminal"]
    ],
    edges: [["accepted","prepared"],["prepared","executing"],["executing","streaming"],["streaming","completed"],["executing","approval"],["streaming","input"],["approval","retry"],["retry","executing"],["retry","cancelled"],["input","failed"]],
    steps: ["Accept and prepare the turn.","Execute, stream and complete on the happy path.","Pause mutating actions for approval.","Pause when required information is missing.","Retry recoverable errors within bounds; otherwise exit explicitly."]
  }
};

let activeView = "architecture";
let activeStep = -1;

function diagramTemplate() {
  const host = document.querySelector("[data-architecture-explorer]");
  if (!host) return;
  host.innerHTML = `
    <div class="diagram-tabs" role="tablist" aria-label="Architecture views">
      ${Object.entries(ARCHITECTURE_VIEWS).map(([key, view]) => `<button class="diagram-tab" type="button" role="tab" data-view="${key}" aria-selected="${key === activeView}">${view.label}</button>`).join("")}
    </div>
    <div class="diagram-workspace">
      <div class="diagram-canvas-wrap"><div class="diagram-canvas" data-diagram-canvas></div></div>
      <aside class="diagram-inspector" data-diagram-inspector aria-live="polite"></aside>
    </div>
    <div class="diagram-help">Select a component for context. Use “Walk the flow” to trace the current view step by step.</div>`;
  host.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    activeView = button.dataset.view;
    activeStep = -1;
    host.querySelectorAll("[data-view]").forEach(tab => tab.setAttribute("aria-selected", String(tab === button)));
    renderDiagram();
  }));
  renderDiagram();
}

function nodeCenter(node) {
  return { x: node[3] + 8.2, y: node[4] + 7.2 };
}

function renderDiagram() {
  const view = ARCHITECTURE_VIEWS[activeView];
  const canvas = document.querySelector("[data-diagram-canvas]");
  const inspector = document.querySelector("[data-diagram-inspector]");
  const marker = `<defs><marker id="arrowhead" markerUnits="userSpaceOnUse" markerWidth="3" markerHeight="3" refX="3" refY="1.5" orient="auto"><path d="M0,0 L3,1.5 L0,3 Z" fill="#5A4A42"></path></marker></defs>`;
  const lanes = (view.lanes || []).map(lane => `<div class="diagram-lane" style="top:${lane[1]}%;height:${lane[2]}%"><span>${lane[0]}</span></div>`).join("");
  const paths = view.edges.map((edge, index) => {
    const from = view.nodes.find(n => n[0] === edge[0]);
    const to = view.nodes.find(n => n[0] === edge[1]);
    const a = nodeCenter(from), b = nodeCenter(to);
    const bend = Math.abs(a.x-b.x) > 8 ? (a.x+b.x)/2 : a.x+4;
    return `<path class="diagram-path" data-edge="${index}" d="M ${a.x} ${a.y} C ${bend} ${a.y}, ${bend} ${b.y}, ${b.x} ${b.y}"></path>`;
  }).join("");
  canvas.innerHTML = `${lanes}<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${marker}${paths}</svg>${view.nodes.map(n => `<button class="diagram-node" type="button" data-node="${n[0]}" data-tone="${n[5]}" style="left:${n[3]}%;top:${n[4]}%"><span class="diagram-node__name">${n[1]}</span><span class="diagram-node__sub">${n[2]}</span></button>`).join("")}`;
  inspector.innerHTML = `<p class="diagram-inspector__type">${view.label}</p><h3>${view.label}</h3><p>${view.summary}</p><dl><dt>How to explore</dt><dd>Choose any box to see why it exists. Walk the flow to follow the request or data path.</dd></dl><div class="diagram-controls"><button class="diagram-control" type="button" data-step>Walk the flow</button><button class="diagram-control" type="button" data-reset>Reset</button></div><div class="diagram-step" data-step-copy hidden></div>`;
  canvas.querySelectorAll("[data-node]").forEach(button => button.addEventListener("click", () => selectNode(button.dataset.node)));
  inspector.querySelector("[data-step]").addEventListener("click", stepDiagram);
  inspector.querySelector("[data-reset]").addEventListener("click", () => { activeStep = -1; renderDiagram(); });
}

function selectNode(id) {
  const view = ARCHITECTURE_VIEWS[activeView];
  const node = view.nodes.find(n => n[0] === id);
  document.querySelectorAll(".diagram-node").forEach(el => el.classList.toggle("is-active", el.dataset.node === id));
  document.querySelectorAll(".diagram-path").forEach((path, index) => {
    const edge = view.edges[index];
    path.classList.toggle("is-active", edge.includes(id));
  });
  const inspector = document.querySelector("[data-diagram-inspector]");
  inspector.innerHTML = `<p class="diagram-inspector__type">${node[7]}</p><h3>${node[1]}</h3><p>${node[6]}</p><dl><dt>Role</dt><dd>${node[7]}</dd><dt>Position in view</dt><dd>${node[8]}</dd></dl><div class="diagram-controls"><button class="diagram-control" type="button" data-step>Walk the flow</button><button class="diagram-control" type="button" data-reset>Reset</button></div><div class="diagram-step" data-step-copy hidden></div>`;
  inspector.querySelector("[data-step]").addEventListener("click", stepDiagram);
  inspector.querySelector("[data-reset]").addEventListener("click", () => { activeStep = -1; renderDiagram(); });
}

function stepDiagram() {
  const view = ARCHITECTURE_VIEWS[activeView];
  activeStep = (activeStep + 1) % view.steps.length;
  const edgeIndex = Math.min(activeStep, view.edges.length - 1);
  document.querySelectorAll(".diagram-path").forEach((path, index) => path.classList.toggle("is-active", index === edgeIndex));
  const activeEdge = view.edges[edgeIndex];
  document.querySelectorAll(".diagram-node").forEach(node => node.classList.toggle("is-active", activeEdge.includes(node.dataset.node)));
  const copy = document.querySelector("[data-step-copy]");
  copy.hidden = false;
  copy.innerHTML = `<strong>Step ${activeStep + 1} of ${view.steps.length}</strong><span>${view.steps[activeStep]}</span>`;
}

function initArticleNavigation() {
  const progress = document.querySelector(".article-toc__progress span");
  const links = [...document.querySelectorAll(".article-toc a")];
  const sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    let current = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 150) current = section; });
    links.forEach(link => link.setAttribute("aria-current", String(current && link.getAttribute("href") === `#${current.id}`)));
  };
  addEventListener("scroll", update, { passive: true });
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  diagramTemplate();
  initArticleNavigation();
});
