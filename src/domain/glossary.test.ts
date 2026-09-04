import { describe, expect, it } from "vitest";
import { GLOSSARY } from "./glossary";

describe("glossary", () => {
  it("defines CAST by its four axes, not the old expansion", () => {
    const cast = GLOSSARY.find((entry) => entry.term === "CAST Edge");
    expect(cast).toBeDefined();
    expect(cast?.definition).toMatch(/WHO/);
    expect(cast?.definition).toMatch(/HOW/);
    expect(cast?.definition).toMatch(/WHAT/);
    expect(cast?.definition).toMatch(/WHEN/);
    expect(cast?.definition).not.toMatch(/Causal, Associative/);
  });

  it("has unique terms", () => {
    const terms = GLOSSARY.map((entry) => entry.term);
    expect(new Set(terms).size).toBe(terms.length);
  });
});
