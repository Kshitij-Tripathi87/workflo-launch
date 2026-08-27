/**
 * Instrument Panel Noir — documentation as an operational reference, using inspectable
 * protocol stages, isolation diagrams, and receipt anatomy instead of generic prose.
 */
import { useState } from "react";
import { Braces, Check, ChevronRight, CircleCheckBig, Copy, FileCheck2, Github, GitPullRequest, Layers3, LockKeyhole, Network, ScanSearch, ShieldCheck, Terminal, Zap } from "lucide-react";
import { Link } from "wouter";

const nav = [
  ["Overview", "Getting started", "#getting-started"],
  ["Core protocol", "Run lifecycle", "#lifecycle"],
  ["Core protocol", "Isolation model", "#isolation"],
  ["Evidence", "Test receipts", "#receipts-doc"],
  ["Guides", "CI integration", "#ci-integration"],
];

const lifecycle = [
  { code: "01", title: "Specify", icon: Braces, text: "Define the behavior to evaluate in a test file, release check, or natural-language request.", records: ["intent", "target", "policy"] },
  { code: "02", title: "Provision", icon: Layers3, text: "Workflo prepares an isolated runtime with the browser, fixtures, and constraints required for that run.", records: ["sandbox_id", "runtime", "network policy"] },
  { code: "03", title: "Observe", icon: ScanSearch, text: "The agent executes the test sequence while preserving the event order, visible state, and relevant artifacts.", records: ["event trace", "artifacts", "assertions"] },
  { code: "04", title: "Attest", icon: FileCheck2, text: "The result is finalized as a receipt that ties the outcome to the exact execution context that produced it.", records: ["result", "hash", "receipt URI"] },
];

const receiptFields = [
  ["run_id", "Uniquely identifies the test sequence and its isolated execution context."],
  ["intent", "Captures the requested behavior and the evaluation criteria supplied to Workflo."],
  ["environment", "Records the runtime profile, configured policy, and browser context used for the run."],
  ["events", "Preserves the ordered actions, assertions, timings, and observable state changes."],
  ["artifacts", "Links screenshots, logs, traces, and other evidence generated during execution."],
  ["attestation", "Seals the final outcome, receipt version, and integrity hash into a reviewable artifact."],
];

const integrationExamples = {
  "GitHub Actions": `- name: Run release verification\n  run: workflo run ./tests/checkout.spec.ts --receipt\n\n- name: Gate deploy\n  run: workflo verify \${{ steps.workflo.outputs.receipt_uri }}`,
  "Command line": `workflo run ./tests/checkout.spec.ts \\\n  --environment staging \\\n  --receipt\n\n# returns: wf://receipts/0ec7-9b20`,
};

export default function Docs() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeField, setActiveField] = useState(0);
  const [integration, setIntegration] = useState<keyof typeof integrationExamples>("GitHub Actions");
  const [copied, setCopied] = useState(false);
  const stage = lifecycle[activeStep];

  const copyCommand = async () => {
    try { await navigator.clipboard.writeText(integrationExamples[integration]); } catch { /* Clipboard access can be unavailable. */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return <main className="app-page docs-page">
    <aside className="docs-sidebar">
      <div className="sidebar-section-label">WORKFLO / DOCS</div>
      <a className="docs-search" href="#getting-started">Browse the protocol <span>↗</span></a>
      <nav aria-label="Documentation navigation">{nav.map(([section, item, href], index) => <div className="docs-nav-block" key={item}>{(index === 0 || nav[index - 1][0] !== section) && <span>{section}</span>}<a className={item === "Getting started" ? "docs-nav-current" : ""} href={href}>{item}<ChevronRight size={14} /></a></div>)}</nav>
      <div className="docs-sidebar-bottom"><span className="signal-dot" /> CONTROL PLANE<br /><strong>Reference / v1.0</strong></div>
    </aside>

    <article className="docs-content" id="top">
      <div className="docs-breadcrumb"><Link href="/">Workflo</Link><ChevronRight size={13} /> Reference <ChevronRight size={13} /> <span>Core protocol</span></div>
      <section className="docs-hero" id="getting-started">
        <div className="docs-topline"><span>CORE PROTOCOL</span><span>REFERENCE / V1.0</span></div>
        <h1>Autonomous QA,<br /><em>made inspectable.</em></h1>
        <p className="docs-lede">Workflo turns a software test into an isolated execution record. The protocol keeps test intent, environment, evidence, and outcome connected from the first instruction to the final receipt.</p>
        <div className="docs-quick-facts"><div><Braces size={17} /><span>INPUT</span><strong>Test intent</strong></div><div><LockKeyhole size={17} /><span>RUNTIME</span><strong>Isolated sandbox</strong></div><div><FileCheck2 size={17} /><span>OUTPUT</span><strong>Test receipt</strong></div></div>
      </section>

      <section className="docs-section" id="lifecycle">
        <div className="docs-section-kicker"><span>01</span> RUN LIFECYCLE</div>
        <div className="docs-section-heading"><div><h2>One protocol.<br />Four observable stages.</h2><p>Each stage adds context to the record. Select a stage to inspect what Workflo carries forward into the final receipt.</p></div><span className="docs-section-marker">WF / FLOW</span></div>
        <div className="protocol-map" role="tablist" aria-label="Workflo run lifecycle">{lifecycle.map((item, index) => { const Icon = item.icon; return <button key={item.title} role="tab" aria-selected={activeStep === index} className={activeStep === index ? "is-active" : ""} onClick={() => setActiveStep(index)}><span>{item.code}</span><Icon size={18} /><strong>{item.title}</strong>{index < lifecycle.length - 1 && <i />}</button>; })}</div>
        <div className="protocol-detail"><div className="protocol-detail-icon"><stage.icon size={25} /></div><div><span>STAGE {stage.code} / {stage.title.toUpperCase()}</span><h3>{stage.text}</h3></div><div className="protocol-records"><span>RECORD ADDED</span>{stage.records.map((record) => <code key={record}>{record}</code>)}</div></div>
      </section>

      <section className="docs-section" id="isolation">
        <div className="docs-section-kicker"><span>02</span> ISOLATION MODEL</div>
        <div className="docs-section-heading"><div><h2>Constrain the environment.<br />Preserve the evidence.</h2><p>Workflo treats the sandbox as a defined execution perimeter. A test can operate within the capabilities it needs while the resulting record retains the relevant context for review.</p></div></div>
        <div className="isolation-layout"><div className="isolation-diagram" aria-label="Diagram of the Workflo isolation model"><div className="isolation-boundary isolation-boundary--outer"><span>POLICY BOUNDARY</span></div><div className="isolation-boundary isolation-boundary--inner"><span>EPHEMERAL RUNTIME</span></div><div className="isolation-core"><ShieldCheck size={24} /><strong>RUN<br />CONTEXT</strong></div><div className="isolation-path isolation-path--a"><i /> <span>intent</span></div><div className="isolation-path isolation-path--b"><i /> <span>artifacts</span></div><div className="isolation-path isolation-path--c"><i /> <span>receipt</span></div></div><div className="isolation-controls"><article><LockKeyhole size={18} /><div><strong>Ephemeral execution</strong><p>Each run is provisioned as a discrete context rather than continuing inside a shared testing session.</p></div></article><article><Network size={18} /><div><strong>Defined network posture</strong><p>Runtime connectivity is an explicit part of the run context, not an invisible prerequisite.</p></div></article><article><ShieldCheck size={18} /><div><strong>Reviewable policy</strong><p>Receipt metadata provides a clear reference point for the controls applied during execution.</p></div></article></div></div>
      </section>

      <section className="docs-section" id="receipts-doc">
        <div className="docs-section-kicker"><span>03</span> TEST RECEIPTS</div>
        <div className="docs-section-heading"><div><h2>Evidence travels<br />with the result.</h2><p>A receipt is the portable outcome of a Workflo run. It describes what was requested, where it ran, what was observed, and how the resulting record can be verified.</p></div><span className="docs-section-marker">WF / RECEIPT</span></div>
        <div className="receipt-reference"><div className="receipt-fields" role="list">{receiptFields.map(([field, description], index) => <button key={field} role="listitem" className={activeField === index ? "is-active" : ""} onClick={() => setActiveField(index)}><code>{field}</code><ChevronRight size={15} /></button>)}</div><div className="receipt-field-detail"><div className="receipt-field-detail-top"><span>RECEIPT FIELD</span><CircleCheckBig size={17} /></div><code>{receiptFields[activeField][0]}</code><p>{receiptFields[activeField][1]}</p><div className="receipt-mini-trace"><span>RUN</span><i /><span>CONTEXT</span><i /><strong>SEALED</strong></div></div></div>
        <div className="receipt-legend"><span><i /> Required context</span><span><i /> Observable evidence</span><span><i /> Integrity record</span></div>
      </section>

      <section className="docs-section" id="ci-integration">
        <div className="docs-section-kicker"><span>04</span> CI INTEGRATION</div>
        <div className="docs-section-heading"><div><h2>Gate releases with<br />a receipt, not a guess.</h2><p>Use Workflo as a local command or as a stage in your release workflow. The result is returned as a receipt URI that teams and automation can inspect.</p></div></div>
        <div className="integration-workbench"><div className="integration-tabs" role="tablist"><button role="tab" aria-selected={integration === "GitHub Actions"} className={integration === "GitHub Actions" ? "is-active" : ""} onClick={() => setIntegration("GitHub Actions")}><Github size={16} /> GitHub Actions</button><button role="tab" aria-selected={integration === "Command line"} className={integration === "Command line" ? "is-active" : ""} onClick={() => setIntegration("Command line")}><Terminal size={16} /> Command line</button></div><div className="docs-code-block docs-code-block--enhanced"><div><span><Terminal size={15} /> {integration.toLowerCase()}</span><button onClick={copyCommand}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button></div><pre>{integrationExamples[integration]}</pre></div><div className="integration-notes"><span><Zap size={15} /> RECEIPT FLOW</span><p>The receipt URI can be attached to a pull request, evaluated by a deployment rule, or opened in the Workflo QA Console.</p><Link href="/dashboard">Open QA Console <ChevronRight size={16} /></Link></div></div>
      </section>

      <section className="docs-final-callout"><GitPullRequest size={19} /><div><span>READY FOR REVIEW</span><strong>Open an execution record in the QA Console.</strong></div><Link href="/dashboard">View test runs <ChevronRight size={17} /></Link></section>
    </article>
  </main>;
}
