import { describe, expect, it } from "vitest";
import { WORKFLO_HERO } from "./workfloHero";

describe("Workflo hero messaging", () => {
  it("keeps the product promise concise and evidence-led", () => {
    expect(WORKFLO_HERO.tagline).toBe("Autonomous QA, controlled.");
    expect(WORKFLO_HERO.evidenceLine).toBe("Evidence for every release decision.");
    expect(WORKFLO_HERO.description).toContain("isolated environments");
    expect(WORKFLO_HERO.description).toContain("verifiable receipt");
  });
});
