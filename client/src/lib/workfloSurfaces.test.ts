import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("Workflo product surfaces", () => {
  it("documents installation channels and a first verification command", () => {
    const docs = source("../pages/Docs.tsx");
    expect(docs).toContain('id="installation"');
    expect(docs).toContain("PACKAGE REGISTRY");
    expect(docs).toContain("RELEASE ARCHIVE");
    expect(docs).toContain("CONTAINER IMAGE");
    expect(docs).toContain("FIRST VERIFICATION");
  });

  it("keeps the QA Console empty until a real workspace is connected", () => {
    const dashboard = source("../pages/Dashboard.tsx");
    expect(dashboard).toContain("No test runs yet.");
    expect(dashboard).not.toContain("WF-4492");
    expect(dashboard).not.toContain("98.4%");
    expect(dashboard).not.toContain("128");
  });

  it("requires consent and supports success feedback and keyboard or outside dismissal", () => {
    const home = source("../pages/Home.tsx");
    expect(home).toContain('id="trial-consent"');
    expect(home).toContain('href="/privacy"');
    expect(home).toContain("Thank you.");
    expect(home).toContain("onPointerDownOutside");
    expect(home).toContain("onEscapeKeyDown");
  });
});
