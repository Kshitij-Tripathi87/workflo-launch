import { describe, expect, it } from "vitest";
import { WORKFLO_HERO } from "./workfloHero";

describe("Workflo hero messaging", () => {
  it("keeps the product promise concise and evidence-led", () => {
    expect(WORKFLO_HERO.tagline).toBe("Autonomous QA with verifiable evidence.");
    expect(WORKFLO_HERO.description).toBe("Isolated test runs. Auditable receipts.");
  });
});
