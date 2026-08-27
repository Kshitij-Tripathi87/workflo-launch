/**
 * Minimal Workflo hero — a single immersive runtime surface with only the product thesis
 * and the two essential routes. The interactive sandbox fills the complete viewport.
 */
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { ArrowUpRight, CircleCheckBig } from "lucide-react";
import { Link } from "wouter";
import { WORKFLO_HERO } from "@/lib/workfloHero";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  const headlineTagline = WORKFLO_HERO.tagline;
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [taglineLength, setTaglineLength] = useState(0);
  const [taglineComplete, setTaglineComplete] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialEmail, setTrialEmail] = useState("");
  const [trialConsent, setTrialConsent] = useState(false);
  const [trialState, setTrialState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [trialMessage, setTrialMessage] = useState("");
  const pointerPosition = useRef({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    try { const stored = window.localStorage.getItem("workflo-reduced-motion"); return stored === "true" || (stored === null && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch { return false; }
  });

  const updatePointer = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let frame = 0;
    let releaseTimer = 0;
    let targetOffset = 0;
    let currentOffset = 0;

    const render = () => {
      currentOffset += (targetOffset - currentOffset) * 0.14;
      hero.style.setProperty("--hero-scroll-y", `${currentOffset.toFixed(2)}px`);
      if (Math.abs(targetOffset - currentOffset) > 0.1) frame = window.requestAnimationFrame(render);
      else frame = 0;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(render); };
    const reset = () => { targetOffset = 0; schedule(); };
    const onScroll = () => {
      if (reducedMotion) return reset();
      targetOffset = Math.max(-18, Math.min(0, -window.scrollY * 0.038));
      schedule();
    };
    const onWheel = (event: WheelEvent) => {
      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return reset();
      targetOffset = Math.max(-18, Math.min(0, targetOffset - event.deltaY * 0.024));
      schedule();
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(reset, 720);
    };

    hero.style.setProperty("--hero-scroll-y", "0px");
    window.addEventListener("scroll", onScroll, { passive: true });
    hero.addEventListener("wheel", onWheel, { passive: true });
    onScroll();
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(releaseTimer); window.removeEventListener("scroll", onScroll); hero.removeEventListener("wheel", onWheel); };
  }, [reducedMotion]);

  const submitTrial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (trialState === "submitting") return;
    setTrialState("submitting");
    setTrialMessage("");
    try {
      const response = await fetch("/api/trial-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trialEmail, consent: trialConsent }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Trial requests are temporarily unavailable. Please try again.");
      setTrialState("success");
      setTrialMessage("Your access request is recorded. We’ll be in touch about your trial.");
      setTrialEmail("");
    } catch (error) {
      setTrialState("error");
      setTrialMessage(error instanceof Error ? error.message : "Trial requests are temporarily unavailable. Please try again.");
    }
  };

  const changeTrialDialog = (open: boolean) => {
    setTrialOpen(open);
    if (!open) { setTrialState("idle"); setTrialMessage(""); setTrialConsent(false); }
  };

  useEffect(() => {
    if (!heroImageLoaded) return;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTaglineLength(headlineTagline.length); setTaglineComplete(true); return; }
    setTaglineLength(0);
    setTaglineComplete(false);
    let current = 0;
    const timer = window.setInterval(() => {
      current += 1;
      setTaglineLength(current);
      if (current >= headlineTagline.length) { window.clearInterval(timer); setTaglineComplete(true); }
    }, 48);
    return () => window.clearInterval(timer);
  }, [heroImageLoaded, headlineTagline.length, reducedMotion]);

  useEffect(() => { try { window.localStorage.setItem("workflo-reduced-motion", String(reducedMotion)); } catch { /* Preference persistence is optional. */ } }, [reducedMotion]);

  return <main ref={heroRef} className={`minimal-hero ${reducedMotion ? "motion-reduced" : ""}`} onPointerMove={updatePointer} onPointerLeave={resetPointer}>
    <div className="minimal-hero__sandbox-art" aria-hidden="true"><img src="/manus-storage/workflo-sandbox-immersive-hero_b63d7110.jpg" alt="" onLoad={() => setHeroImageLoaded(true)} /></div>
    <div className="minimal-hero__scrim" aria-hidden="true" />
    <Link href="/" className={`minimal-hero__brand ${heroImageLoaded ? "is-ready" : ""}`} aria-label="Workflo home"><span>W/</span><strong>WORKFLO</strong><small>AUTONOMOUS QA</small></Link>
    <button className={`minimal-hero__motion-control ${heroImageLoaded ? "is-ready" : ""}`} type="button" aria-pressed={reducedMotion} onClick={() => setReducedMotion((value) => !value)}>{reducedMotion ? "MOTION: OFF" : "MOTION: ON"}</button>
    <div className={`minimal-hero__loader ${heroImageLoaded ? "is-complete" : ""}`} aria-live="polite" aria-label="Loading Workflo sandbox"><span className="minimal-hero__loader-orbit" aria-hidden="true" /><div><span>LOADING SANDBOX</span><strong>{heroImageLoaded ? "100" : ""}%</strong></div><i><b style={{ transform: `scaleX(${heroImageLoaded ? 1 : 0.28})` }} /></i></div>
    <div className={`minimal-hero__content ${heroImageLoaded ? "is-ready" : ""}`}>
      <h1><span className={`typewriter-tagline ${taglineComplete ? "is-complete" : ""}`} aria-label={headlineTagline}><span aria-hidden="true">{headlineTagline.slice(0, taglineLength)}</span><b aria-hidden="true" /></span></h1>
      <p>{WORKFLO_HERO.description}</p>
      <div className="minimal-hero__actions"><button className="minimal-hero__primary-action" type="button" onClick={() => setTrialOpen(true)}>Start Free Trial <ArrowUpRight size={17} /></button><Link href="/docs">Documentation <ArrowUpRight size={17} /></Link></div>
    </div>
    <Dialog open={trialOpen} onOpenChange={changeTrialDialog}>
      <DialogContent className="trial-modal" onPointerDownOutside={() => changeTrialDialog(false)} onEscapeKeyDown={() => changeTrialDialog(false)}>
        <DialogHeader>
          <span className="trial-modal__eyebrow">WORKFLO / TRIAL ACCESS</span>
          <DialogTitle>Start your free trial.</DialogTitle>
          <DialogDescription>Use a work email to request access to Workflo’s isolated QA environment.</DialogDescription>
        </DialogHeader>
        {trialState === "success" ? <div className="trial-modal__success" role="status"><div className="trial-modal__success-mark"><CircleCheckBig size={30} /></div><strong>Thank you.</strong><p>{trialMessage}</p><button type="button" onClick={() => changeTrialDialog(false)}>Close</button></div> : <form className="trial-modal__form" onSubmit={submitTrial}><label><span>WORK EMAIL</span><input type="email" name="email" autoComplete="email" placeholder="you@company.com" value={trialEmail} onChange={(event) => setTrialEmail(event.target.value)} required disabled={trialState === "submitting"} /></label><div className="trial-modal__consent"><Checkbox id="trial-consent" checked={trialConsent} onCheckedChange={(checked) => setTrialConsent(checked === true)} disabled={trialState === "submitting"} /><label htmlFor="trial-consent">I agree that Workflo may use this email to process my trial request. See the <Link href="/privacy">Privacy Policy</Link>.</label></div>{trialState === "error" && <p className="trial-modal__error" role="alert">{trialMessage}</p>}<button type="submit" disabled={trialState === "submitting" || !trialConsent}>{trialState === "submitting" ? "Submitting…" : "Request access"}<ArrowUpRight size={16} /></button><small>Your email is used only to process this trial request.</small></form>}
      </DialogContent>
    </Dialog>
  </main>;
}
