import { describe, it, expect } from "vitest";
import {
  TIER1_VERB_GROUPS,
  describeCollision,
  detectVerbCollisions,
} from "./verbCollisions";

describe("verbCollisions", () => {
  it("returns no collisions when sibling list is empty", () => {
    expect(detectVerbCollisions(["supplies"], [])).toEqual([]);
  });

  it("detects exact duplicates case-insensitively", () => {
    const out = detectVerbCollisions(["Feeds"], ["feeds"]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ candidate: "feeds", sibling: "feeds", kind: "exact" });
  });

  it("detects confusable verbs in the same group", () => {
    const out = detectVerbCollisions(["supplies"], ["feeds"]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ kind: "confusable", group: "Supply" });
  });

  it("does not flag verbs in different groups", () => {
    expect(detectVerbCollisions(["supplies"], ["blocks"])).toEqual([]);
  });

  it("does not flag unknown free-form verbs unless exact", () => {
    expect(detectVerbCollisions(["zorps"], ["wobbles"])).toEqual([]);
    expect(detectVerbCollisions(["zorps"], ["zorps"])).toHaveLength(1);
  });

  it("splits multi-verb candidates and siblings on ; and ,", () => {
    const out = detectVerbCollisions(["supplies; converts"], ["feeds, transforms"]);
    // supplies↔feeds (Supply) AND converts↔transforms (Transform)
    expect(out).toHaveLength(2);
    const groups = out.map((c) => c.group).sort();
    expect(groups).toEqual(["Supply", "Transform"]);
  });

  it("normalizes internal whitespace for multi-word verbs", () => {
    const out = detectVerbCollisions(["depends  on"], ["depends on"]);
    expect(out).toHaveLength(1);
    expect(out[0]?.kind).toBe("exact");
  });

  it("describeCollision distinguishes exact vs confusable", () => {
    const exact = describeCollision({ candidate: "feeds", sibling: "feeds", kind: "exact" });
    expect(exact).toMatch(/already used/i);

    const conf = describeCollision({
      candidate: "supplies",
      sibling: "feeds",
      kind: "confusable",
      group: "Supply",
    });
    expect(conf).toMatch(/Supply verbs/i);
  });

  it("TIER1_VERB_GROUPS has no verb in more than one group", () => {
    const seen = new Map<string, string>();
    for (const group of TIER1_VERB_GROUPS) {
      for (const verb of group.verbs) {
        const key = verb.toLowerCase();
        expect(seen.has(key), `${verb} appears in both ${seen.get(key)} and ${group.label}`).toBe(false);
        seen.set(key, group.label);
      }
    }
  });
});
