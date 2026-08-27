/**
 * Instrument Panel Noir — an asymmetric dark control-plane landing page. The hero uses
 * scroll-driven depth to move visitors into a contained runtime without neon or gradients.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { ArrowDownRight, ArrowUpRight, Bot, Check, ChevronRight, FileCheck2, LockKeyhole, Play, ScanSearch, ShieldCheck, Terminal, X } from "lucide-react";
import SandboxScene, { type SandboxHotspotId, type ScenePerformanceMode } from "@/components/SandboxScene";

const receiptImage = "/manus-storage/workflo-receipt-proof_041eec88.jpg";
const runStages = [
  { label: "Environment ready", detail: "Isolated browser allocated", trace: "runtime provisioned", progress: 24, step: 0, readout: "T+00:00.42" },
  { label: "Test in progress", detail: "Checkout path under evaluation", trace: "test sequence executing", progress: 58, step: 1, readout: "T+00:03.76" },
  { label: "Evidence assembling", detail: "Events and artifacts recorded", trace: "execution record being sealed", progress: 81, step: 2, readout: "T+00:06.94" },
  { label: "Receipt available", detail: "Execution record verified", trace: "attestation complete", progress: 100, step: 2, readout: "T+00:08.28" },
];
const receiptRows = [["01", "isolated browser initialized", "00:02.384", "pass"], ["02", "checkout flow traversed", "00:04.117", "pass"], ["03", "payment error state observed", "00:01.691", "pass"], ["04", "receipt signed by sandbox", "00:00.090", "verified"]];
const hotspotDetails: Record<SandboxHotspotId, { code: string; title: string; body: string; field: string; value: string }> = {
  runtime: { code: "SANDBOX CONTROL / 01", title: "Ephemeral runtime", body: "Each test begins from a clean, isolated execution context and ends with the environment retired.", field: "RETENTION", value: "Session-scoped" },
  network: { code: "SANDBOX CONTROL / 02", title: "Network boundary", body: "The test environment has a defined network perimeter so execution can be reviewed without production access.", field: "ACCESS", value: "Policy-bound" },
  receipt: { code: "RECEIPT ARTIFACT / 03", title: "Execution receipt", body: "Workflo packages the observed event sequence, timestamps, and final result into a durable verification record.", field: "ATTESTATION", value: "Run-linked" },
};

function SignalDot({ label = "Verified" }: { label?: string }) { return <span className="signal-label"><span className="signal-dot" />{label}</span>; }
function SectionIndex({ index, label }: { index: string; label: string }) { return <div className="section-index"><span>{index}</span><i /> <span>{label}</span></div>; }

export default function Home() {
  const [runStage, setRunStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [performanceMode, setPerformanceMode] = useState<ScenePerformanceMode>(() => {
    try { const stored = window.localStorage.getItem("workflo-scene-performance"); return stored === "efficient" || stored === "balanced" ? stored : "balanced"; } catch { return "balanced"; }
  });
  const [activeHotspot, setActiveHotspot] = useState<SandboxHotspotId | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const activeRun = runStages[runStage];

  useEffect(() => {
    const interval = window.setInterval(() => setRunStage((current) => (current + 1) % runStages.length), 3800);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateDepth = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const travel = Math.max(1, hero.offsetHeight - window.innerHeight + 74);
        const current = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop + 74) / travel));
        setScrollProgress((previous) => Math.abs(previous - current) > 0.002 ? current : previous);
        frame = 0;
      });
    };
    updateDepth();
    window.addEventListener("scroll", updateDepth, { passive: true });
    window.addEventListener("resize", updateDepth);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", updateDepth); window.removeEventListener("resize", updateDepth); };
  }, []);

  useEffect(() => { try { window.localStorage.setItem("workflo-scene-performance", performanceMode); } catch { /* Storage may be unavailable in private contexts. */ } }, [performanceMode]);

  const heroStyle = {
    "--box-scale": `${1 + scrollProgress * 0.76}`,
    "--box-shift-x": `${scrollProgress * -44}vw`,
    "--box-shift-y": `${scrollProgress * 1.5}%`,
  } as CSSProperties;
  const entryOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.28) * 2.1));
  const featureReveal = Math.min(1, Math.max(0, (scrollProgress - 0.72) * 4.2));

  return <div className="site-shell">
    <aside className="trace-rail" aria-hidden="true"><span>WF / 001</span><i /><span>CONTROL PLANE</span></aside>
    <main>
      <section ref={heroRef} className="hero-scroll-container">
        <div className="hero-section hero-stage">
          <div className="hero-grid-noise" aria-hidden="true" />
          <div className="hero-copy reveal-up" style={{ opacity: Math.max(0, 1 - scrollProgress * 1.85), transform: `translateY(${scrollProgress * -22}px)` }}>
            <div className="eyebrow"><SignalDot label="Isolated execution" /> <span>Quality assurance control plane</span></div>
            <h1>QA execution<br /><em>with an audit trail.</em></h1>
            <p className="hero-lede">Workflo runs software tests in isolated environments and produces a verifiable record of the result, its context, and the events that led to it.</p>
            <div className="hero-actions"><Link href="/dashboard" className="button button--signal">View QA console <ArrowUpRight size={17} /></Link><a href="#protocol" className="text-action">Review the protocol <ArrowDownRight size={16} /></a></div>
            <div className="hero-proof-row"><div><span className="proof-value">01</span><span className="proof-label">isolated<br />environment</span></div><div><span className="proof-value">100%</span><span className="proof-label">recorded<br />execution</span></div><div><span className="proof-value">0</span><span className="proof-label">production credentials<br />required</span></div></div>
            <div className="hero-assurance" aria-label="Privacy and security controls"><div><ShieldCheck size={15} /><span>PRIVACY-FIRST EXECUTION</span><strong>Ephemeral environments keep each run contained.</strong></div><div><LockKeyhole size={15} /><span>CONTROLLED ACCESS</span><strong>No production credentials are required for execution.</strong></div><div><FileCheck2 size={15} /><span>COMPLIANCE EVIDENCE</span><strong>Receipts provide a durable record for review.</strong></div></div>
          </div>
          <div className="hero-scroll-prompt" style={{ opacity: Math.max(0, 1 - scrollProgress * 2.4) }}><span>SCROLL TO ENTER SANDBOX</span><i /></div>
          <div className="hero-visual hero-visual--webgl reveal-up reveal-delay-1" style={heroStyle}>
            <SandboxScene scrollProgress={scrollProgress} resetSignal={resetSignal} performanceMode={performanceMode} runProgress={activeRun.progress / 100} executionStage={runStage} activeHotspot={activeHotspot} onHotspotSelect={setActiveHotspot} />
            <div className="hero-visual-shade" />
            <div className="floating-label floating-label--top">EXECUTION / WF-4492</div>
            <div className="hero-live-panel" aria-live="polite"><div><span className="live-panel-label">CURRENT STATE</span><strong>{activeRun.label}</strong><small>{activeRun.detail}</small></div><SignalDot /><span className="live-run-id">{activeRun.readout} / {activeRun.progress}%</span><div className="live-meter"><i style={{ transform: `scaleX(${activeRun.progress / 100})` }} /></div></div>
            <div className="hero-entry-copy" style={{ opacity: entryOpacity, transform: `translate(-50%, calc(-50% + ${(1 - entryOpacity) * 28}px))` }}><span>ISOLATED RUNTIME / ACTIVE</span><strong>The test stays contained.</strong><p>Scroll through the environment to examine the controls Workflo uses to keep autonomous execution private and inspectable.</p></div>
            <div className="floating-label floating-label--bottom"><SignalDot /> <span>{activeRun.trace}</span></div>
            <div className="scene-metadata" aria-hidden="true"><span>ENCLOSURE / 03</span><span>RUNTIME / EPHEMERAL</span><span>STREAM / ACTIVE</span><span>MODE / INSPECT</span></div>
            <div className="scene-hotspot-hint"><strong>03</strong><span>Inspectable controls</span></div>
            {activeHotspot && <aside className="scene-detail-panel" aria-live="polite"><button type="button" onClick={() => setActiveHotspot(null)} aria-label="Close sandbox detail"><X size={14} /></button><span>{hotspotDetails[activeHotspot].code}</span><h3>{hotspotDetails[activeHotspot].title}</h3><p>{hotspotDetails[activeHotspot].body}</p><div><small>{hotspotDetails[activeHotspot].field}</small><strong>{hotspotDetails[activeHotspot].value}</strong></div></aside>}
            <div className="scene-controls"><span>DRAG TO INSPECT</span><button className="scene-performance-toggle" type="button" aria-pressed={performanceMode === "efficient"} onClick={() => setPerformanceMode((mode) => mode === "balanced" ? "efficient" : "balanced")}>{performanceMode === "balanced" ? "Performance: balanced" : "Performance: efficient"}</button><button type="button" onClick={() => setResetSignal((current) => current + 1)}>Reset view</button></div>
            <div className="hero-corner hero-corner--a" /><div className="hero-corner hero-corner--b" />
          </div>
          <section className="in-sandbox-features" aria-hidden={featureReveal < 0.1} style={{ opacity: featureReveal, transform: `translateY(${(1 - featureReveal) * 28}px)` }}>
            <div className="in-sandbox-title"><span>CORE CAPABILITIES / INSIDE THE RUNTIME</span><h2>Controls that make<br /><em>autonomy inspectable.</em></h2></div>
            <div className="in-sandbox-feature-grid"><article><span>01 / ISOLATION</span><LockKeyhole size={18} /><strong>Runtime isolation</strong><p>Test resources are created for the run and retired at completion.</p></article><article><span>02 / OBSERVATION</span><ScanSearch size={18} /><strong>Event provenance</strong><p>Actions retain their ordering, timing, and observed state.</p></article><article><span>03 / RECEIPT</span><FileCheck2 size={18} /><strong>Receipt attestation</strong><p>Result context is carried into a durable verification record.</p></article></div>
            <div className="in-sandbox-footer"><span>WF-4492 / SANDBOX INTERIOR</span><span>EXECUTION CONTEXT / AVAILABLE</span></div>
          </section>
        </div>
      </section>

      <section className="logo-band" aria-label="Workflo operating principles"><span>ISOLATED EXECUTION ENVIRONMENTS</span><i /><span>VERIFIABLE EXECUTION RECORDS</span><i /><span>RELEASE-WORKFLOW READY</span></section>
      <section id="protocol" className="protocol-section section-frame"><SectionIndex index="01" label="Execution protocol" /><div className="section-heading-row"><h2>From test intent to<br /><em>an evidenced result.</em></h2><p>Workflo turns a test request into an isolated, observable sequence. Inspect each stage to understand what is captured before a receipt is finalized.</p></div><div className="protocol-flow"><article className={`flow-card flow-card--intent reveal-up ${activeRun.step === 0 ? "flow-card--active" : ""}`} role="button" tabIndex={0} onClick={() => setRunStage(0)} onKeyDown={(event) => event.key === "Enter" && setRunStage(0)}><div className="flow-card-head"><span className="step-no">01</span><Bot size={20} /></div><h3>Define the test</h3><p>Provide the release behavior to evaluate, in product language or test code.</p><span className="micro-label">INPUT / HUMAN OR CI</span></article><div className="flow-connector"><span>ENCODE</span><ChevronRight /></div><article className={`flow-card flow-card--sandbox reveal-up reveal-delay-1 ${activeRun.step === 1 ? "flow-card--active" : ""}`} role="button" tabIndex={0} onClick={() => setRunStage(1)} onKeyDown={(event) => event.key === "Enter" && setRunStage(1)}><div className="flow-card-head"><span className="step-no">02</span><LockKeyhole size={20} /></div><h3>Execute in isolation</h3><p>Workflo provisions an ephemeral sandbox and records each relevant interaction and state transition.</p><span className="micro-label">EXECUTION / ISOLATED</span></article><div className="flow-connector"><span>ATTEST</span><ChevronRight /></div><article className={`flow-card flow-card--receipt reveal-up reveal-delay-2 ${activeRun.step === 2 ? "flow-card--active" : ""}`} role="button" tabIndex={0} onClick={() => setRunStage(3)} onKeyDown={(event) => event.key === "Enter" && setRunStage(3)}><div className="flow-card-head"><span className="step-no">03</span><FileCheck2 size={20} /></div><h3>Review the record</h3><p>The completed run is packaged with artifacts, timing data, and a durable attestation.</p><span className="micro-label">OUTPUT / VERIFIABLE</span></article></div></section>
      <section className="feature-matrix section-frame"><SectionIndex index="02" label="Governed execution" /><div className="feature-grid"><article className="feature-panel feature-panel--wide"><div className="feature-panel-copy"><span className="feature-kicker">ISOLATION LAYER</span><h3>Autonomous testing,<br />with defined boundaries.</h3><p>Each session begins clean, operates inside its own perimeter, and retires with its execution record. Autonomy remains observable and governable.</p><a href="#receipts" className="text-action">Inspect a receipt <ArrowUpRight size={16} /></a></div><div className="perimeter-diagram" aria-label="Diagram of isolated test sandbox"><div className="perimeter-ring perimeter-ring--outer" /><div className="perimeter-ring perimeter-ring--mid" /><div className="sandbox-core"><LockKeyhole size={29} /><span>WF<br />SANDBOX</span></div><span className="diagram-label diagram-label--left">no shared<br />state</span><span className="diagram-label diagram-label--right">ephemeral<br />runtime</span><span className="diagram-ping diagram-ping--one" /><span className="diagram-ping diagram-ping--two" /></div></article><article className="feature-panel"><span className="feature-kicker">OBSERVABILITY</span><div className="pulse-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><h3>Operational visibility at every step.</h3><p>Event traces make passes, retries, and exceptions explicit.</p></article><article className="feature-panel"><span className="feature-kicker">REPLAY</span><div className="replay-screen"><div className="replay-window-head"><span /><span /><span /></div><div className="replay-cursor" /><div className="replay-line replay-line--a" /><div className="replay-line replay-line--b" /><div className="replay-line replay-line--c" /><span className="replay-time">00:04.117</span></div><h3>Return to the observed state.</h3><p>Receipts connect a result to the exact context in which it was observed.</p></article></div></section>
      <section id="receipts" className="receipt-section section-frame"><SectionIndex index="03" label="Execution receipts" /><div className="receipt-layout"><div className="receipt-copy"><span className="feature-kicker">EVIDENCE, PACKAGED</span><h2>Every run leaves<br /><em>an auditable record.</em></h2><p>Each result includes the context required to assess an autonomous test: its intent, isolated environment, event sequence, and cryptographic attestation.</p><Link href="/docs" className="button button--outline">Read the receipt specification <ArrowUpRight size={16} /></Link></div><article className="receipt-card reveal-up"><img className="receipt-art" src={receiptImage} alt="Abstract Workflo test receipt artifact" /><div className="receipt-card-shade" /><div className="receipt-top"><span className="receipt-stamp">TEST RECEIPT</span><SignalDot /></div><div className="receipt-title"><span>RUN / WF-4492</span><strong>checkout-e2e<br />release/241</strong></div><div className="receipt-rows">{receiptRows.map(([n, task, time, state]) => <div className="receipt-row" key={n}><span>{n}</span><span>{task}</span><span>{time}</span><span className={state === "verified" ? "verified-state" : ""}>{state === "verified" ? <Check size={13} /> : "●"}</span></div>)}</div><div className="receipt-hash"><span>SHA-256</span><code>0ec7•9b20•c514•e1f9</code><ShieldCheck size={16} /></div></article></div></section>
      <section className="terminal-section section-frame"><SectionIndex index="04" label="Release workflow" /><div className="terminal-layout"><div className="terminal-copy"><h2>QA that fits<br />the <em>release process.</em></h2><p>From exploratory requirements to guarded CI checks, Workflo produces the context engineering teams need before deployment.</p></div><div className="terminal-window"><div className="terminal-top"><span><i /> workflo / checkout-e2e</span><span>⌘ K</span></div><div className="terminal-code"><p><span className="terminal-prompt">$</span> workflo run ./tests/checkout.spec.ts</p><p className="terminal-muted">→ allocating isolated browser environment</p><p className="terminal-muted">→ test intent compiled: 4 assertions</p><p><span className="terminal-pass">✓</span> receipt sealed <span className="terminal-muted">wf://receipts/0ec7-9b20</span></p><p className="terminal-cursor">_</p></div><div className="terminal-bottom"><span><SignalDot label="execution records available" /></span><Link href="/dashboard">View QA console <ArrowUpRight size={15} /></Link></div></div></div></section>
      <section className="cta-section section-frame"><div className="cta-serial">WF / INITIALIZE</div><h2>Establish a release<br /><em>record you can verify.</em></h2><p>Bring autonomous QA into your engineering workflow with an execution trail built for review.</p><div><Link href="/dashboard" className="button button--signal">View QA console <Play size={15} fill="currentColor" /></Link><Link href="/docs" className="text-action">Explore documentation <ArrowUpRight size={16} /></Link></div></section>
    </main>
    <footer className="site-footer"><span className="footer-mark"><ScanSearch size={16} /> WORKFLO / SYSTEMS</span><span>Privacy-first autonomous QA</span><span>© 2026</span></footer>
  </div>;
}
