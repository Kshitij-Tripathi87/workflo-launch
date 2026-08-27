/**
 * Instrument Panel Noir — the docs route compresses the control-plane grammar into
 * a precise reading surface: navigation spine, evidence framing, and mono metadata.
 */
import { useState } from "react";
import { Check, ChevronRight, Copy, FileCheck2, Terminal } from "lucide-react";
import { Link } from "wouter";

const nav = [
  ["Introduction", "What is Workflo?"],
  ["Core protocol", "Run lifecycle"],
  ["Core protocol", "Isolation model"],
  ["Core protocol", "Test receipts"],
  ["Guides", "CI integration"],
  ["Reference", "Receipt schema"],
];

export default function Docs() {
  const [copied, setCopied] = useState(false);
  const copyCommand = async () => {
    try { await navigator.clipboard.writeText("workflo run ./tests/checkout.spec.ts --receipt"); } catch { /* Browser permissions can prevent clipboard writes. */ }
    setCopied(true); window.setTimeout(() => setCopied(false), 1600);
  };
  return <main className="app-page docs-page">
    <aside className="docs-sidebar">
      <div className="sidebar-section-label">DOCS / 0.9</div>
      <div className="docs-search">Search documentation <span>⌘ K</span></div>
      <nav aria-label="Documentation navigation">{nav.map(([section, item], index) => <div className="docs-nav-block" key={item}>{(index === 0 || nav[index - 1][0] !== section) && <span>{section}</span>}<a className={item === "Test receipts" ? "docs-nav-current" : ""} href={item === "Test receipts" ? "#receipts-doc" : "#top"}>{item}<ChevronRight size={14} /></a></div>)}</nav>
      <div className="docs-sidebar-bottom"><span className="signal-dot" /> SYSTEM STATUS<br /><strong>All systems nominal</strong></div>
    </aside>

    <article className="docs-content" id="top">
      <div className="docs-breadcrumb"><Link href="/">Workflo</Link><ChevronRight size={13} /> Core protocol <ChevronRight size={13} /> <span>Test receipts</span></div>
      <div className="docs-topline"><span>CORE PROTOCOL</span><span>LAST UPDATED / AUG 2026</span></div>
      <h1>Test receipts</h1>
      <p className="docs-lede">A Workflo receipt is the durable, inspectable record of an autonomous test run. It packages the intent, sandbox context, observed events, and attestation into one portable artifact.</p>
      <div className="docs-callout"><FileCheck2 size={21} /><div><strong>Evidence is a first-class output.</strong><p>Receipts are designed to be reviewed by both humans and automated release controls.</p></div></div>
      <h2 id="receipts-doc">Receipt anatomy</h2>
      <p>A receipt is finalized only after its test sequence has finished inside the sandbox. Its hash binds the test intent, execution metadata, and event trail together so you can trace a given outcome back to the run that produced it.</p>
      <div className="schema-table"><div className="schema-head"><span>FIELD</span><span>DESCRIPTION</span></div><div><code>run_id</code><p>Unique identifier for the execution environment and test sequence.</p></div><div><code>intent</code><p>Human or CI supplied behavior statement compiled by Workflo.</p></div><div><code>events</code><p>Ordered record of meaningful interactions and observed assertions.</p></div><div><code>attestation</code><p>Signed summary binding the sandbox, output artifacts, and result.</p></div></div>
      <h2>Run with a receipt</h2>
      <p>Add the receipt flag to any test run. Workflo returns the receipt URI after attestation completes.</p>
      <div className="docs-code-block"><div><span><Terminal size={15} /> terminal</span><button onClick={copyCommand}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button></div><pre><span>$</span> workflo run ./tests/checkout.spec.ts --receipt{`\n`}<i>→ sandbox provisioned / wf-4492</i>{`\n`}<b>✓ receipt sealed</b> wf://receipts/0ec7-9b20</pre></div>
      <div className="docs-next"><span>NEXT UP</span><Link href="/dashboard">Inspect a receipt in the console <ChevronRight size={17} /></Link></div>
    </article>
  </main>;
}

