import { describe, expect, it } from "vitest";
import { buildEligibleContextTips, buildPrimaryContextHint, pickNextContextTip } from "./contextualTips";

describe("contextualTips", () => {
  it("builds a stronger primary hint from the current workspace state", () => {
    expect(
      buildPrimaryContextHint({
        hasPalace: false,
        nodeCount: 0,
        edgeCount: 0,
        routeCount: 0,
        locusCount: 0,
        walkOpen: false,
        toolMode: "select",
        selectedKind: null,
        persistenceState: "clean",
      }),
    ).toContain("Create or open a palace");

    expect(
      buildPrimaryContextHint({
        hasPalace: true,
        nodeCount: 2,
        edgeCount: 0,
        routeCount: 0,
        locusCount: 0,
        walkOpen: false,
        toolMode: "select",
        selectedKind: null,
        persistenceState: "clean",
      }),
    ).toContain("Connect");

    expect(
      buildPrimaryContextHint({
        hasPalace: true,
        nodeCount: 3,
        edgeCount: 2,
        routeCount: 1,
        locusCount: 3,
        walkOpen: true,
        toolMode: "select",
        selectedKind: null,
        persistenceState: "clean",
      }),
    ).toContain("Grade retrieval effort honestly");
  });

  it("offers context-appropriate idle tips and rotates away from the previous one", () => {
    const tips = buildEligibleContextTips({
      hasPalace: true,
      nodeCount: 2,
      edgeCount: 0,
      routeCount: 0,
      locusCount: 0,
      walkOpen: false,
      toolMode: "select",
      selectedKind: null,
      persistenceState: "dirty",
    });

    expect(tips.some((tip) => tip.id === "connect-meaning")).toBe(true);
    expect(tips.some((tip) => tip.id === "create-first-route")).toBe(true);
    expect(tips.some((tip) => tip.id === "checkpoint-when-meaningful")).toBe(true);

    const first = pickNextContextTip(tips, {
      previousTipId: null,
      random: () => 0,
    });
    const second = pickNextContextTip(tips, {
      previousTipId: first?.id ?? null,
      random: () => 0,
    });

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second?.id).not.toBe(first?.id);
  });
});
