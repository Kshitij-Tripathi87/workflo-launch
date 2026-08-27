import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { WORKFLO_HERO } from "./workfloHero";

describe("Workflo hero messaging", () => {
  it("keeps the product promise concise and evidence-led", () => {
    expect(WORKFLO_HERO.tagline).toBe("Autonomous QA with verifiable evidence.");
    expect(WORKFLO_HERO.description).toBe("Isolated test runs. Auditable receipts.");
  });

  it("retains a cinematic static fallback and staged entry treatment", () => {
    const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
    const sceneSource = readFileSync(new URL("../components/SandboxScene.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");

    expect(homeSource).toContain("--hero-scroll-y");
    expect(homeSource).toContain("minimal-hero__loader-orbit");
    expect(sceneSource).toContain("sandbox-fallback sandbox-fallback--hero");
    expect(styles).toContain(".sandbox-fallback--hero");
    expect(styles).toContain("workflo-sandbox-immersive-hero_b63d7110.jpg");
    expect(styles).toContain(".minimal-hero__content.is-ready > h1");
    expect(styles).toContain(".motion-reduced .minimal-hero__content > *");
    expect(styles).toContain("@keyframes workflo-loader-orbit");
  });
});
