import { describe, expect, it } from "vitest";
import type { Locus, MemoryRoute } from "../../entities/types";
import { reconcileRoutes } from "./routeSync";
import type { DslRoute } from "./types";

const PALACE_ID = "p-1";

function dslRoute(
  name: string,
  loci: string[],
  metadata: DslRoute["metadata"] = [],
  settings: Partial<DslRoute> = {},
): DslRoute {
  return { name, normalizedName: name.toLowerCase(), metadata, loci, sourceLine: 0, ...settings };
}

let counter = 0;
const uuid = () => `id-${++counter}`;

describe("reconcileRoutes", () => {
  it("creates a brand-new route + loci when current is empty", () => {
    counter = 0;
    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: [],
      currentLoci: [],
      intent: [dslRoute("Walk", ["A", "B"])],
      titleToNodeId: new Map([
        ["A", "node-a"],
        ["B", "node-b"],
      ]),
      uuid,
    });

    expect(result.routes).toEqual([
      { id: "id-1", palaceId: PALACE_ID, name: "Walk" },
    ]);
    expect(result.loci).toEqual([
      { id: "id-2", routeId: "id-1", nodeId: "node-a", orderIndex: 0, label: "" },
      { id: "id-3", routeId: "id-1", nodeId: "node-b", orderIndex: 1, label: "" },
    ]);
    expect(result.added).toEqual({ routes: 1, loci: 2 });
    expect(result.deleted).toEqual({ routes: 0, loci: 0 });
  });

  it("preserves locus ids when reordering an existing route", () => {
    const currentRoute: MemoryRoute = {
      id: "r-1",
      palaceId: PALACE_ID,
      name: "Walk",
    };
    const currentLoci: Locus[] = [
      { id: "l-a", routeId: "r-1", nodeId: "node-a", orderIndex: 0, label: "" },
      { id: "l-b", routeId: "r-1", nodeId: "node-b", orderIndex: 1, label: "" },
    ];

    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: [currentRoute],
      currentLoci,
      intent: [dslRoute("Walk", ["B", "A"])],
      titleToNodeId: new Map([
        ["A", "node-a"],
        ["B", "node-b"],
      ]),
      uuid,
    });

    expect(result.routes).toEqual([currentRoute]);
    expect(result.loci.map((l) => l.id)).toEqual(["l-b", "l-a"]);
    expect(result.loci.map((l) => l.orderIndex)).toEqual([0, 1]);
    expect(result.added).toEqual({ routes: 0, loci: 0 });
    expect(result.deleted).toEqual({ routes: 0, loci: 0 });
  });

  it("counts removed routes and their loci as deleted", () => {
    const currentRoutes: MemoryRoute[] = [
      { id: "r-1", palaceId: PALACE_ID, name: "Stale" },
      { id: "r-2", palaceId: PALACE_ID, name: "Keep" },
    ];
    const currentLoci: Locus[] = [
      { id: "l-1", routeId: "r-1", nodeId: "node-a", orderIndex: 0, label: "" },
      { id: "l-2", routeId: "r-2", nodeId: "node-b", orderIndex: 0, label: "" },
    ];

    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes,
      currentLoci,
      intent: [dslRoute("Keep", ["B"])],
      titleToNodeId: new Map([["B", "node-b"]]),
      uuid,
    });

    expect(result.routes.map((r) => r.name)).toEqual(["Keep"]);
    expect(result.loci.map((l) => l.id)).toEqual(["l-2"]);
    expect(result.deleted).toEqual({ routes: 1, loci: 1 });
  });

  it("gives a node listed twice two distinct stops and keeps route settings", () => {
    counter = 0;
    const currentRoute: MemoryRoute = {
      id: "r-1",
      palaceId: PALACE_ID,
      name: "Loop",
      color: "rose",
      hidden: true,
      lastWalkDirection: "reverse",
    };
    const currentLoci: Locus[] = [
      { id: "l-a1", routeId: "r-1", nodeId: "node-a", orderIndex: 0, label: "start" },
      { id: "l-b", routeId: "r-1", nodeId: "node-b", orderIndex: 1, label: "" },
      { id: "l-a2", routeId: "r-1", nodeId: "node-a", orderIndex: 2, label: "end" },
    ];

    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: [currentRoute],
      currentLoci,
      intent: [dslRoute("Loop", ["A", "B", "A", "A"], [], { color: "rose", hidden: true })],
      titleToNodeId: new Map([
        ["A", "node-a"],
        ["B", "node-b"],
      ]),
      uuid,
    });

    expect(result.routes).toEqual([currentRoute]);
    expect(result.loci.map((l) => l.id)).toEqual(["l-a1", "l-b", "l-a2", "id-1"]);
    expect(new Set(result.loci.map((l) => l.id)).size).toBe(4);
    expect(result.loci.map((l) => l.label)).toEqual(["start", "", "end", ""]);
    expect(result.added).toEqual({ routes: 0, loci: 1 });
  });

  it("takes each route's metadata from the DSL", () => {
    counter = 0;
    const tags = (...pairs: [string, string][]) => pairs.map(([key, value]) => ({ key, value, raw: `#${key}:${value}` }));
    const current: MemoryRoute[] = [
      { id: "r-1", palaceId: PALACE_ID, name: "Deep", color: "rose", metadata: [{ key: "difficulty", value: "beginner" }] },
      { id: "r-2", palaceId: PALACE_ID, name: "Plain", metadata: [{ key: "mode", value: "linear" }] },
    ];

    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: current,
      currentLoci: [],
      intent: [
        dslRoute("Deep", ["A"], tags(["difficulty", "advanced"], ["prereq", "Gate of SOLID"]), { color: "rose" }),
        dslRoute("Plain", ["A"]),
        dslRoute("Fresh", ["A"], tags(["duration", "30min"])),
      ],
      titleToNodeId: new Map([["A", "node-a"]]),
      uuid,
    });

    expect(result.routes).toEqual([
      {
        id: "r-1",
        palaceId: PALACE_ID,
        name: "Deep",
        color: "rose",
        metadata: [
          { key: "difficulty", value: "advanced" },
          { key: "prereq", value: "Gate of SOLID" },
        ],
      },
      // Written without metadata lines, so it has none now.
      { id: "r-2", palaceId: PALACE_ID, name: "Plain" },
      { id: "id-3", palaceId: PALACE_ID, name: "Fresh", metadata: [{ key: "duration", value: "30min" }] },
    ]);
    // The caller's route objects are not mutated.
    expect(current[1]!.metadata).toEqual([{ key: "mode", value: "linear" }]);
  });

  it("takes route settings from the DSL, resetting any it leaves out", () => {
    counter = 0;
    const current: MemoryRoute[] = [
      {
        id: "r-1",
        palaceId: PALACE_ID,
        name: "Loop",
        color: "rose",
        hidden: true,
        direction: "alternate",
        lastWalkDirection: "forward",
        inReview: false,
        notes: "Old notes",
      },
    ];

    const set = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: current,
      currentLoci: [],
      intent: [dslRoute("Loop", [], [], { color: "sky", direction: "reverse", notes: "Start at the gate." })],
      titleToNodeId: new Map(),
      uuid,
    });
    // #hidden and #review:off were removed from the DSL, so the route is shown and reviewed again.
    expect(set.routes).toEqual([
      {
        id: "r-1",
        palaceId: PALACE_ID,
        name: "Loop",
        color: "sky",
        direction: "reverse",
        lastWalkDirection: "forward",
        notes: "Start at the gate.",
      },
    ]);
    expect(current[0]!.hidden).toBe(true);
  });

  it("keeps each stop's section when the DSL is applied", () => {
    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: [{ id: "r-1", palaceId: PALACE_ID, name: "Loop" }],
      currentLoci: [{ id: "l-1", routeId: "r-1", nodeId: "node-a", orderIndex: 0, label: "", section: "Hall" }],
      intent: [dslRoute("Loop", ["A"])],
      titleToNodeId: new Map([["A", "node-a"]]),
      uuid,
    });
    expect(result.loci[0]!.section).toBe("Hall");
  });

  it("emits a diagnostic for a locus referring to an unknown title and skips it", () => {
    const result = reconcileRoutes({
      palaceId: PALACE_ID,
      currentRoutes: [],
      currentLoci: [],
      intent: [dslRoute("Walk", ["A", "Missing"])],
      titleToNodeId: new Map([["A", "node-a"]]),
      uuid,
    });

    expect(result.loci).toHaveLength(1);
    expect(result.loci[0]!.nodeId).toBe("node-a");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]!.code).toBe("unknown-target");
    expect(result.errors[0]!.message).toContain("Missing");
  });
});
