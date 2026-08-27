/**
 * Instrument Panel Noir — the console is intentionally dense and operational:
 * persistent rail, high-contrast run states, receipts as inspectable hardware-like panels.
 */
import { useState } from "react";
import { Link } from "wouter";
import { Activity, ArrowUpRight, Check, ChevronDown, CircleAlert, Clock3, FileCheck2, Filter, Play, Plus, ShieldCheck, Terminal, X } from "lucide-react";
import { toast } from "sonner";

const runs = [
  { id: "WF-4492", name: "checkout-e2e", branch: "release/241", duration: "08.28s", status: "passed", time: "2m ago" },
  { id: "WF-4491", name: "login-guardrails", branch: "main", duration: "05.91s", status: "passed", time: "13m ago" },
  { id: "WF-4490", name: "pricing-locales", branch: "feat/i18n", duration: "11.02s", status: "review", time: "28m ago" },
  { id: "WF-4489", name: "settings-permissions", branch: "main", duration: "07.44s", status: "passed", time: "41m ago" },
];

export default function Dashboard() {
  const [selected, setSelected] = useState(runs[0]);
  const [filter, setFilter] = useState("All runs");
  const filteredRuns = filter === "All runs" ? runs : runs.filter((run) => run.status === filter.toLowerCase());
  return <main className="console-page">
    <aside className="console-rail">
      <div className="workspace-switcher"><span className="workspace-dot" /> Acme Systems <ChevronDown size={14} /></div>
      <nav><a className="console-nav-active" href="#runs"><Activity size={17} /> Runs</a><a href="#agents"><Terminal size={17} /> Agents</a><a href="#receipts"><FileCheck2 size={17} /> Receipts</a><a href="#settings"><ShieldCheck size={17} /> Policy</a></nav>
      <div className="console-rail-foot"><span>ENVIRONMENT</span><strong><i /> Production mirror</strong><Link href="/">← Exit console</Link></div>
    </aside>
    <section className="console-main" id="runs">
      <header className="console-header"><div><div className="console-kicker">CONTROL PLANE / ACTIVE</div><h1>Test runs</h1></div><button onClick={() => toast.success("A new sandbox run is queued.", { description: "It will appear here as soon as the agent starts." })} className="button button--signal button--small"><Plus size={16} /> New test run</button></header>
      <div className="console-stats"><div><span>TODAY’S RUNS</span><strong>128</strong><small>+18.5% <em>vs. previous day</em></small></div><div><span>PASS RATE</span><strong>98.4%</strong><small><i /> Stable</small></div><div><span>MEDIAN DURATION</span><strong>06.8s</strong><small><Clock3 size={13} /> -1.2s <em>vs. previous day</em></small></div><div><span>RECEIPTS SEALED</span><strong>126</strong><small><ShieldCheck size={13} /> 100% attested</small></div></div>
      <div className="run-toolbar"><div className="filter-control"><Filter size={15} /><select aria-label="Filter runs" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All runs</option><option>Passed</option><option>Review</option></select></div><span>Showing {filteredRuns.length} of {runs.length} recent runs</span></div>
      <div className="run-list" aria-label="Recent Workflo test runs"><div className="run-list-head"><span>RUN</span><span>BRANCH</span><span>DURATION</span><span>STATUS</span><span>STARTED</span></div>{filteredRuns.map((run) => <button key={run.id} onClick={() => setSelected(run)} className={`run-row ${selected.id === run.id ? "run-row--selected" : ""}`}><span><strong>{run.name}</strong><small>{run.id}</small></span><span className="branch-tag">{run.branch}</span><span>{run.duration}</span><span className={`run-status run-status--${run.status}`}><i />{run.status === "review" ? "Needs review" : "Passed"}</span><span>{run.time}</span></button>)}</div>
    </section>
    <aside className="receipt-inspector" id="receipts"><div className="inspector-top"><span>RECEIPT INSPECTOR</span><button aria-label="Close receipt inspector" onClick={() => toast.info("Receipt inspector remains available while a run is selected.")}><X size={15} /></button></div><div className="inspector-title"><div className="inspector-icon"><FileCheck2 size={19} /></div><div><strong>{selected.name}</strong><span>{selected.id} / {selected.branch}</span></div></div><div className="inspector-verdict"><span className={selected.status === "review" ? "signal-dot signal-dot--amber" : "signal-dot"} /> <div><strong>{selected.status === "review" ? "Review required" : "Verification complete"}</strong><p>Attestation sealed 2m ago</p></div></div><div className="inspector-section"><span>EVENT TRACE</span><div className="trace-event"><i /> sandbox initialized <time>00:00.00</time></div><div className="trace-event"><i /> intent accepted <time>00:00.42</time></div><div className="trace-event"><i /> browser steps complete <time>00:07.98</time></div><div className="trace-event trace-event--final"><Check size={13} /> receipt signed <time>00:08.28</time></div></div><div className="inspector-hash"><span>ATTESTATION HASH</span><code>0ec7:9b20:c514:e1f9</code><button onClick={() => toast.success("Receipt URI copied to clipboard.")}>Copy URI</button></div><a className="inspector-link" href="#proof">View full chain of proof <ArrowUpRight size={15} /></a></aside>
  </main>;
}

