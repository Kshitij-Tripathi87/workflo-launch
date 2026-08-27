/**
 * Minimal Workflo hero — a single immersive runtime surface with only the product thesis
 * and the two essential routes. The interactive sandbox fills the complete viewport.
 */
import { useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import SandboxScene, { type ScenePerformanceMode } from "@/components/SandboxScene";

export default function Home() {
  const [sceneProgress, setSceneProgress] = useState(0.08);
  const [sceneReady, setSceneReady] = useState(false);
  const [actionHovered, setActionHovered] = useState(false);
  const pointerPosition = useRef({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const [performanceMode, setPerformanceMode] = useState<ScenePerformanceMode>(() => {
    try { const stored = window.localStorage.getItem("workflo-scene-performance"); return stored === "efficient" || stored === "balanced" ? stored : "balanced"; } catch { return "balanced"; }
  });

  const togglePerformance = () => {
    setPerformanceMode((mode) => {
      const next = mode === "balanced" ? "efficient" : "balanced";
      try { window.localStorage.setItem("workflo-scene-performance", next); } catch { /* Storage can be unavailable in private contexts. */ }
      return next;
    });
  };

  const updatePointer = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    pointerPosition.current = { x, y };
    heroRef.current?.style.setProperty("--hero-parallax-x", `${x * 8}px`);
    heroRef.current?.style.setProperty("--hero-parallax-y", `${y * 6}px`);
  };

  const resetPointer = () => {
    pointerPosition.current = { x: 0, y: 0 };
    heroRef.current?.style.setProperty("--hero-parallax-x", "0px");
    heroRef.current?.style.setProperty("--hero-parallax-y", "0px");
  };

  return <main ref={heroRef} className="minimal-hero" onPointerMove={updatePointer} onPointerLeave={resetPointer}>
    <SandboxScene scrollProgress={0.38} resetSignal={0} performanceMode={performanceMode} runProgress={0.82} executionStage={2} activeHotspot={null} onHotspotSelect={() => undefined} showHotspots={false} onSceneProgress={setSceneProgress} onSceneReady={() => setSceneReady(true)} pointerPosition={pointerPosition} actionHovered={actionHovered} />
    <div className="minimal-hero__scrim" aria-hidden="true" />
    <div className={`minimal-hero__loader ${sceneReady ? "is-complete" : ""}`} aria-live="polite" aria-label="Loading Workflo sandbox"><div><span>INITIALIZING SANDBOX</span><strong>{Math.round(sceneProgress * 100)}%</strong></div><i><b style={{ transform: `scaleX(${sceneProgress})` }} /></i></div>
    <div className={`minimal-hero__content ${sceneReady ? "is-ready" : ""}`}>
      <h1>QA execution<br /><em>with an audit trail.</em></h1>
      <p>Workflo runs tests in isolated environments and produces verifiable execution records.</p>
      <div className="minimal-hero__actions"><Link href="/dashboard" onPointerEnter={() => setActionHovered(true)} onPointerLeave={() => setActionHovered(false)}>QA Console <ArrowUpRight size={17} /></Link><Link href="/docs" onPointerEnter={() => setActionHovered(true)} onPointerLeave={() => setActionHovered(false)}>Documentation <ArrowUpRight size={17} /></Link></div>
    </div>
    <button className={`minimal-hero__performance ${sceneReady ? "is-ready" : ""}`} type="button" aria-label={`WebGL performance mode: ${performanceMode}. Switch mode.`} onClick={togglePerformance}>{performanceMode === "balanced" ? "◐" : "◑"}</button>
  </main>;
}
