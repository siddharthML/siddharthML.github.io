const TRACE_STAGES = {
  request: {
    title: "Request + identity",
    copy: "Capture the original request with environment, session, user, tenant and workflow identifiers. Without this boundary, quality cannot be segmented or audited.",
    fields: ["environment", "session + user", "tenant", "workflow"]
  },
  route: {
    title: "Routing + orchestration",
    copy: "Record which agent, prompt and model were selected, which alternatives were available, and whether a required capability was skipped.",
    fields: ["agent", "prompt version", "model version", "route decision"]
  },
  context: {
    title: "Retrieval + tools",
    copy: "Preserve document IDs, filters, tool names, arguments, outputs and timing. This is where incomplete, inconsistent and stale data failures become diagnosable.",
    fields: ["document IDs", "query filters", "tool arguments", "tool results"]
  },
  model: {
    title: "Model execution",
    copy: "Capture the exact model, token usage, latency and intermediate steps needed to distinguish reasoning failure from an upstream system failure.",
    fields: ["model", "tokens", "latency", "intermediate state"]
  },
  outcome: {
    title: "Outcome + evidence",
    copy: "Store the final response, user outcome, feedback, evaluator scores and the lineage required to reproduce every verdict later.",
    fields: ["response", "task outcome", "feedback", "score lineage"]
  }
};

const TAXONOMY = {
  "110": {name:"Routing and orchestration", owner:"Orchestration", examples:["Wrong agent selected","Required agent never called","Tool not invoked despite being needed"]},
  "120": {name:"Tool and execution", owner:"Tooling", examples:["Malformed tool arguments","Tool runtime error","Result ignored or misinterpreted"]},
  "130": {name:"Data and retrieval", owner:"Data platform", examples:["Requested data unavailable","Incomplete retrieval","Wrong or stale data"]},
  "140": {name:"Response and reasoning", owner:"Product + eval", examples:["Incomplete answer","Format violation","Unsupported claim or reasoning error"]},
  "150": {name:"System and platform", owner:"Platform", examples:["Timeout","Context-window overflow","Memory, configuration or upstream failure"]},
  "990.9": {name:"Unclassified", owner:"Human review", examples:["No defined category fits","Trace evidence is insufficient","A new failure mode may have appeared"]}
};

const DATA_CODES = {
  unavailable: {
    label:"130.1 · Data unavailable",
    rows:[
      ["130.1.1","Requested time-period fact data was never loaded or published"],
      ["130.1.2","The request falls outside the configured data or planning window"],
      ["130.1.3","A requested metric, field or entity does not exist"],
      ["130.1.4","The required granularity or level of detail is not modelled"],
      ["130.1.5","The requested dataset version or scenario does not exist"],
      ["130.1.6","A required attribute, property or relationship is absent"],
      ["130.1.7","A required agent, sub-agent or tool was never invoked"]
    ]
  },
  incomplete: {
    label:"130.2 · Retrieval incomplete",
    rows:[
      ["130.2.1","Only part of the requested time range is returned"],
      ["130.2.2","Underlying records exist, but the expected aggregation is absent"],
      ["130.2.3","A filter, member selection or Top-N operation returns no rows"],
      ["130.2.7","A missing agent or tool invocation causes partial retrieval"]
    ]
  },
  inconsistent: {
    label:"130.3 · Data inconsistency",
    rows:[
      ["130.3.1","Data is returned at the wrong granularity"],
      ["130.3.2","Unit, metric or value type does not match the request"],
      ["130.3.3","Data comes from the wrong or mismatched version or scenario"],
      ["130.3.4","Hierarchy, mapping or join across entities is wrong"],
      ["130.3.7","Missing orchestration causes incorrect data assembly"]
    ]
  },
  stale: {
    label:"130.4 · Data freshness",
    rows:[
      ["130.4.1","The current-cycle publication or refresh has not completed"],
      ["130.4.2","An older saved snapshot is used instead of the current working state"],
      ["130.4.7","A missing refresh or retrieval invocation causes stale data"]
    ]
  }
};

const SAMPLES = {
  random:{name:"Random production",purpose:"Estimate overall quality without conditioning on detected failures.",risk:"Without this slice, the program only finds failures its current signals already recognize.",signal:"Population baseline"},
  enriched:{name:"Failure-enriched",purpose:"Concentrate attention on negative feedback, exceptions, empty results, retries, latency and weak automated scores.",risk:"Its pass rate cannot be compared directly with a random sample.",signal:"Investigation yield"},
  stratified:{name:"Segment-stratified",purpose:"Oversample low-volume but high-value tenants, workflows, business units and languages.",risk:"Aggregate averages can otherwise hide broken critical segments.",signal:"Coverage by segment"},
  change:{name:"Change-focused",purpose:"Observe workflows touched by a model, prompt, tool or data-contract change.",risk:"Without it, release impact is diluted inside unrelated traffic.",signal:"Change confidence"},
  longtail:{name:"Long-tail",purpose:"Use outlier detection and clustering to surface unusual or novel requests.",risk:"Common traffic dominates conventional samples and hides tomorrow’s failures.",signal:"Failure discovery"}
};

const EVALUATORS = [
  {id:"code",name:"Code-based check",cost:"Lowest cost",use:"Schemas, regex, JSON parsing, tool names, arguments and state assertions",rule:"If a deterministic rule can catch it, write the rule."},
  {id:"reference",name:"Reference comparison",cost:"Moderate cost",use:"Known-correct outputs, system state, requested versus returned ranges and source-of-truth data",rule:"Use when correctness can be grounded without subjective judgment."},
  {id:"judge",name:"Calibrated LLM judge",cost:"Highest cost",use:"Tone, faithfulness, completeness and domain semantics that rules cannot resolve",rule:"Use only with expert labels, evidence output and ongoing recalibration."},
  {id:"human",name:"Human review",cost:"Scarce expertise",use:"Ambiguous traces, severe tenants or workflows, taxonomy gaps and high-stakes adjudication",rule:"Automate the loop around the expert, not the expert’s judgment."}
];

const QUALITY_LOOP = [
  ["01","Production trace","Observe real behavior with complete execution context."],
  ["02","Error analysis","Find the first failure and refine the owned taxonomy."],
  ["03","Labeled case","Capture the verdict, evidence, owner and taxonomy version."],
  ["04","Regression suite","Turn confirmed failures into durable pre-release tests."],
  ["05","Gated release","Compare baseline and candidate against risk-based thresholds."],
  ["06","Production verification","Confirm the fix held for real users and segments."]
];

function traceExplorer(){
  const host=document.querySelector('[data-trace-explorer]');
  if(!host)return;
  host.innerHTML=`<div class="trace-line" role="tablist" aria-label="Trace stages">${Object.entries(TRACE_STAGES).map(([id,item],index)=>`<button type="button" role="tab" class="trace-node" data-trace="${id}" aria-selected="${index===0}"><span>${String(index+1).padStart(2,'0')}</span><b>${item.title}</b></button>`).join('<i aria-hidden="true">→</i>')}</div><div class="trace-copy" data-trace-copy aria-live="polite"></div>`;
  const select=id=>{
    const item=TRACE_STAGES[id];
    host.querySelectorAll('[data-trace]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.trace===id)));
    host.querySelector('[data-trace-copy]').innerHTML=`<div><p class="eyebrow">What the trace must preserve</p><h3>${item.title}</h3><p>${item.copy}</p></div><div class="trace-fields">${item.fields.map(field=>`<span>${field}</span>`).join('')}</div>`;
  };
  host.querySelectorAll('[data-trace]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.trace)));
  select('request');
}

function taxonomyExplorer(){
  const host=document.querySelector('[data-taxonomy]');
  if(!host)return;
  host.innerHTML=`<div class="taxonomy-families" role="tablist">${Object.entries(TAXONOMY).map(([code,item],index)=>`<button type="button" role="tab" data-family="${code}" aria-selected="${index===0}"><span>${code}</span><b>${item.name}</b></button>`).join('')}</div><div class="taxonomy-detail" data-family-copy></div>`;
  const select=code=>{
    const item=TAXONOMY[code];
    host.querySelectorAll('[data-family]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.family===code)));
    host.querySelector('[data-family-copy]').innerHTML=`<div><span class="taxonomy-code">${code}</span><h3>${item.name}</h3><p><strong>Primary owner:</strong> ${item.owner}</p></div><ul>${item.examples.map(example=>`<li>${example}</li>`).join('')}</ul>`;
  };
  host.querySelectorAll('[data-family]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.family)));
  select('110');
}

function dataCodeExplorer(){
  const host=document.querySelector('[data-data-codes]');
  if(!host)return;
  const render=id=>{
    const group=DATA_CODES[id];
    host.innerHTML=`<div class="eval-tabs" role="tablist">${Object.entries(DATA_CODES).map(([key,value])=>`<button class="eval-tab" type="button" role="tab" data-code-group="${key}" aria-selected="${key===id}">${value.label}</button>`).join('')}</div><div class="eval-table-wrap"><table><thead><tr><th>Code</th><th>Meaning</th></tr></thead><tbody>${group.rows.map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('')}</tbody></table></div>`;
    host.querySelectorAll('[data-code-group]').forEach(button=>button.addEventListener('click',()=>render(button.dataset.codeGroup)));
  };
  render('unavailable');
}

function samplingPortfolio(){
  const host=document.querySelector('[data-sampling]');
  if(!host)return;
  host.innerHTML=`<div class="sample-selector" role="tablist">${Object.entries(SAMPLES).map(([id,item],index)=>`<button type="button" role="tab" data-sample="${id}" aria-selected="${index===0}"><span>${item.signal}</span><b>${item.name}</b></button>`).join('')}</div><div class="sample-detail" data-sample-copy></div>`;
  const select=id=>{
    const item=SAMPLES[id];
    host.querySelectorAll('[data-sample]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.sample===id)));
    host.querySelector('[data-sample-copy]').innerHTML=`<p class="eyebrow">${item.signal}</p><h3>${item.name}</h3><p>${item.purpose}</p><p><strong>Watch:</strong> ${item.risk}</p>`;
  };
  host.querySelectorAll('[data-sample]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.sample)));
  select('random');
}

function evaluatorLadder(){
  const host=document.querySelector('[data-evaluator-ladder]');
  if(!host)return;
  host.innerHTML=`<div class="evaluator-ladder">${EVALUATORS.map((item,index)=>`<button type="button" data-evaluator="${item.id}" aria-selected="${index===0}"><span>${String(index+1).padStart(2,'0')}</span><b>${item.name}</b><small>${item.cost}</small></button>`).join('')}</div><div class="evaluator-detail" data-evaluator-copy></div>`;
  const select=id=>{
    const item=EVALUATORS.find(entry=>entry.id===id);
    host.querySelectorAll('[data-evaluator]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.evaluator===id)));
    host.querySelector('[data-evaluator-copy]').innerHTML=`<h3>${item.name}</h3><p>${item.use}</p><strong>${item.rule}</strong>`;
  };
  host.querySelectorAll('[data-evaluator]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.evaluator)));
  select('code');
}

function guardrailSwitch(){
  const host=document.querySelector('[data-guardrail-switch]');
  if(!host)return;
  const views={
    guardrail:{label:"Guardrail",time:"Synchronous · live path",tests:"PII leaks, malformed JSON, disallowed instructions",constraint:"Fast, deterministic and low false-positive rate",result:"Intercept or allow before the user sees the output"},
    evaluator:{label:"Evaluator",time:"Asynchronous · after the fact",tests:"Faithfulness, completeness, root cause and domain quality",constraint:"Can use heavier computation and calibrated judgment",result:"Measure, diagnose and feed improvement systems"}
  };
  host.innerHTML=`<div class="switch-buttons" role="tablist"><button type="button" data-switch="guardrail" aria-selected="true">Guardrail</button><button type="button" data-switch="evaluator" aria-selected="false">Evaluator</button></div><div data-switch-copy></div>`;
  const select=id=>{
    const item=views[id];
    host.querySelectorAll('[data-switch]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.switch===id)));
    host.querySelector('[data-switch-copy]').innerHTML=`<p class="eyebrow">${item.time}</p><h3>${item.label}</h3><dl><div><dt>Best for</dt><dd>${item.tests}</dd></div><div><dt>Design constraint</dt><dd>${item.constraint}</dd></div><div><dt>Operational result</dt><dd>${item.result}</dd></div></dl>`;
  };
  host.querySelectorAll('[data-switch]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.switch)));
  select('guardrail');
}

function qualityLoop(){
  const host=document.querySelector('[data-quality-loop]');
  if(!host)return;
  host.innerHTML=`<div class="quality-loop">${QUALITY_LOOP.map((item,index)=>`<button type="button" data-loop-step="${index}" aria-selected="${index===0}"><span>${item[0]}</span><b>${item[1]}</b></button>`).join('')}</div><div class="loop-detail" data-loop-copy></div>`;
  const select=index=>{
    const item=QUALITY_LOOP[index];
    host.querySelectorAll('[data-loop-step]').forEach((button,i)=>button.setAttribute('aria-selected',String(i===index)));
    host.querySelector('[data-loop-copy]').innerHTML=`<span>${item[0]}</span><div><h3>${item[1]}</h3><p>${item[2]}</p></div>`;
  };
  host.querySelectorAll('[data-loop-step]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.loopStep))));
  select(0);
}

function maturityPath(){
  const boxes=[...document.querySelectorAll('[data-maturity] input')];
  const count=document.querySelector('[data-maturity-count]');
  const update=()=>{if(count)count.textContent=boxes.filter(box=>box.checked).length};
  boxes.forEach(box=>box.addEventListener('change',update));
  update();
}

function navigation(){
  const progress=document.querySelector('.article-toc__progress span');
  const links=[...document.querySelectorAll('.article-toc a')];
  const sections=links.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    if(progress)progress.style.width=`${max>0?scrollY/max*100:0}%`;
    let current=sections[0];
    sections.forEach(section=>{if(section.getBoundingClientRect().top<=150)current=section});
    links.forEach(link=>link.setAttribute('aria-current',String(current&&link.hash===`#${current.id}`)));
  };
  addEventListener('scroll',update,{passive:true});
  update();
}

document.addEventListener('DOMContentLoaded',()=>{
  traceExplorer();
  taxonomyExplorer();
  dataCodeExplorer();
  samplingPortfolio();
  evaluatorLadder();
  guardrailSwitch();
  qualityLoop();
  maturityPath();
  navigation();
});
