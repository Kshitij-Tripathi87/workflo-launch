/**
 * Instrument Panel Noir — an asymmetric protocol-trace launch page. Evidence frames,
 * dark graphite planes, and Verification Mint signal states make autonomy auditable.
 */
import { Link } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  FileCheck2,
  LockKeyhole,
  Play,
  ScanSearch,
  ShieldCheck,
  Terminal,
} from "lucide-react";

const heroImage = "/manus-storage/workflo-hero-sandbox_96e372d8.jpg";
const receiptImage = "/manus-storage/workflo-receipt-proof_041eec88.jpg";

const receiptRows = [
  ["01", "isolated browser initialized", "00:02.384", "pass"],
  ["02", "checkout flow traversed", "00:04.117", "pass"],
  ["03", "payment error state observed", "00:01.691", "pass"],
  ["04", "receipt signed by sandbox", "00:00.090", "verified"],
];

function SignalDot({ label = "Verified" }: { label?: string }) {
  return <span className="signal-label"><span className="signal-dot" />{label}</span>;
}

function SectionIndex({ index, label }: { index: string; label: string }) {
  return <div className="section-index"><span>{index}</span><i /> <span>{label}</span></div>;
}

export default function Home() {
  return (
    <div className="site-shell">
      <aside className="trace-rail" aria-hidden="true"><span>WF / 001</span><i /><span>CONTROL PLANE</span></aside>

      <main>
        <section className="hero-section">
          <div className="hero-grid-noise" aria-hidden="true" />
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><SignalDot label="Sandbox verified" /> <span>Autonomous QA agent</span></div>
            <h1>Autonomy you<br /><em>can audit.</em></h1>
            <p className="hero-lede">Workflo executes software tests inside isolated sandboxes and returns every decision as a verifiable receipt.</p>
            <div className="hero-actions">
              <Link href="/dashboard" className="button button--signal">Open the console <ArrowUpRight size={17} /></Link>
              <a href="#protocol" className="text-action">See the protocol <ArrowDownRight size={16} /></a>
            </div>
            <div className="hero-proof-row">
              <div><span className="proof-value">01</span><span className="proof-label">contained<br />sandbox</span></div>
              <div><span className="proof-value">∞</span><span className="proof-label">replayable<br />evidence</span></div>
              <div><span className="proof-value">0</span><span className="proof-label">prod credentials<br />required</span></div>
            </div>
          </div>

          <div className="hero-visual reveal-up reveal-delay-1">
            <img src={heroImage} alt="Abstract isolated Workflo testing sandbox" />
            <div className="hero-visual-shade" />
            <div className="floating-label floating-label--top">SANDBOX / WF-4492</div>
            <div className="floating-label floating-label--bottom"><SignalDot /> <span>receipt chain active</span></div>
            <div className="hero-corner hero-corner--a" /><div className="hero-corner hero-corner--b" />
          </div>
        </section>

        <section className="logo-band" aria-label="Workflo principles">
          <span>ISOLATED BY DESIGN</span><i /><span>PROOF, NOT PROMISES</span><i /><span>ENGINEERING-GRADE QA</span>
        </section>

        <section id="protocol" className="protocol-section section-frame">
          <SectionIndex index="01" label="The Workflo protocol" />
          <div className="section-heading-row">
            <h2>From intent to<br /><em>inspectable proof.</em></h2>
            <p>Workflo turns a test request into an isolated, observable sequence. The result is not a black-box claim; it is a receipt your team can inspect and replay.</p>
          </div>

          <div className="protocol-flow">
            <article className="flow-card flow-card--intent reveal-up">
              <div className="flow-card-head"><span className="step-no">01</span><Bot size={20} /></div>
              <h3>State intent</h3>
              <p>Describe the behavior that should survive a release, in product language or test code.</p>
              <span className="micro-label">INPUT / HUMAN OR CI</span>
            </article>
            <div className="flow-connector"><span>ENCODE</span><ChevronRight /></div>
            <article className="flow-card flow-card--sandbox reveal-up reveal-delay-1">
              <div className="flow-card-head"><span className="step-no">02</span><LockKeyhole size={20} /></div>
              <h3>Run contained</h3>
              <p>Workflo provisions an ephemeral sandbox, then observes each interaction and state transition.</p>
              <span className="micro-label">EXECUTION / ISOLATED</span>
            </article>
            <div className="flow-connector"><span>ATTEST</span><ChevronRight /></div>
            <article className="flow-card flow-card--receipt reveal-up reveal-delay-2">
              <div className="flow-card-head"><span className="step-no">03</span><FileCheck2 size={20} /></div>
              <h3>Keep proof</h3>
              <p>Every meaningful action becomes a signed receipt with artifacts, timing, and an audit trail.</p>
              <span className="micro-label">OUTPUT / VERIFIABLE</span>
            </article>
          </div>
        </section>

        <section className="feature-matrix section-frame">
          <SectionIndex index="02" label="Control without compromise" />
          <div className="feature-grid">
            <article className="feature-panel feature-panel--wide">
              <div className="feature-panel-copy">
                <span className="feature-kicker">ISOLATION LAYER</span>
                <h3>Your test agent has<br />its own perimeter.</h3>
                <p>Each session begins clean, stays contained, and retires with its evidence. That makes autonomous execution a governance primitive, not a leap of faith.</p>
                <a href="#receipts" className="text-action">Inspect a receipt <ArrowUpRight size={16} /></a>
              </div>
              <div className="perimeter-diagram" aria-label="Diagram of isolated test sandbox">
                <div className="perimeter-ring perimeter-ring--outer" /><div className="perimeter-ring perimeter-ring--mid" />
                <div className="sandbox-core"><LockKeyhole size={29} /><span>WF<br />SANDBOX</span></div>
                <span className="diagram-label diagram-label--left">no shared<br />state</span>
                <span className="diagram-label diagram-label--right">ephemeral<br />runtime</span>
                <span className="diagram-ping diagram-ping--one" /><span className="diagram-ping diagram-ping--two" />
              </div>
            </article>
            <article className="feature-panel">
              <span className="feature-kicker">OBSERVABILITY</span>
              <div className="pulse-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <h3>Watch the work, not just the outcome.</h3>
              <p>Event traces make each pass, retry, and exception explicit.</p>
            </article>
            <article className="feature-panel">
              <span className="feature-kicker">REPLAY</span>
              <div className="replay-screen"><div className="replay-window-head"><span /><span /><span /></div><div className="replay-cursor" /><div className="replay-line replay-line--a" /><div className="replay-line replay-line--b" /><div className="replay-line replay-line--c" /><span className="replay-time">00:04.117</span></div>
              <h3>Return to the decisive moment.</h3>
              <p>Receipts link behavior to the exact observed state.</p>
            </article>
          </div>
        </section>

        <section id="receipts" className="receipt-section section-frame">
          <SectionIndex index="03" label="Verifiable receipts" />
          <div className="receipt-layout">
            <div className="receipt-copy">
              <span className="feature-kicker">EVIDENCE, PACKAGED</span>
              <h2>Don’t ask if it ran.<br /><em>Read the receipt.</em></h2>
              <p>Every result includes the immutable context required to verify an autonomous test: the intent, sandbox, observable sequence, and a durable signature.</p>
              <Link href="/docs" className="button button--outline">Read the receipt spec <ArrowUpRight size={16} /></Link>
            </div>
            <article className="receipt-card reveal-up">
              <img className="receipt-art" src={receiptImage} alt="Abstract Workflo test receipt artifact" />
              <div className="receipt-card-shade" />
              <div className="receipt-top"><span className="receipt-stamp">TEST RECEIPT</span><SignalDot /></div>
              <div className="receipt-title"><span>RUN / WF-4492</span><strong>checkout-e2e<br />release/241</strong></div>
              <div className="receipt-rows">
                {receiptRows.map(([n, task, time, state]) => <div className="receipt-row" key={n}><span>{n}</span><span>{task}</span><span>{time}</span><span className={state === "verified" ? "verified-state" : ""}>{state === "verified" ? <Check size={13} /> : "●"}</span></div>)}
              </div>
              <div className="receipt-hash"><span>SHA-256</span><code>0ec7•9b20•c514•e1f9</code><ShieldCheck size={16} /></div>
            </article>
          </div>
        </section>

        <section className="terminal-section section-frame">
          <SectionIndex index="04" label="Built for the release train" />
          <div className="terminal-layout">
            <div className="terminal-copy"><h2>Put QA in<br />motion, <em>safely.</em></h2><p>From an exploratory prompt to a guarded CI gate, Workflo speaks the tools your engineering team already trusts.</p></div>
            <div className="terminal-window">
              <div className="terminal-top"><span><i /> workflo / checkout-e2e</span><span>⌘ K</span></div>
              <div className="terminal-code"><p><span className="terminal-prompt">$</span> workflo run ./tests/checkout.spec.ts</p><p className="terminal-muted">→ allocating isolated browser sandbox</p><p className="terminal-muted">→ test intent compiled: 4 assertions</p><p><span className="terminal-pass">✓</span> receipt sealed <span className="terminal-muted">wf://receipts/0ec7-9b20</span></p><p className="terminal-cursor">_</p></div>
              <div className="terminal-bottom"><span><SignalDot label="all systems nominal" /></span><Link href="/dashboard">View live console <ArrowUpRight size={15} /></Link></div>
            </div>
          </div>
        </section>

        <section className="cta-section section-frame">
          <div className="cta-serial">WF / INITIALIZE</div>
          <h2>Ship with a<br /><em>chain of proof.</em></h2>
          <p>Build an autonomous QA practice your team can inspect, replay, and trust.</p>
          <div><Link href="/dashboard" className="button button--signal">Open the console <Play size={15} fill="currentColor" /></Link><Link href="/docs" className="text-action">Explore the docs <ArrowUpRight size={16} /></Link></div>
        </section>
      </main>

      <footer className="site-footer"><span className="footer-mark"><ScanSearch size={16} /> WORKFLO / SYSTEMS</span><span>Privacy-first autonomous QA</span><span>© 2026</span></footer>
    </div>
  );
}

