import { describe, expect, it } from "vitest";
import type { Locus, MemoryRoute } from "../../entities/types";
import { reconcileRoutes } from "./routeSync";
import type { DslRoute } from "./types";

const PALACE_ID = "p-1";

function dslRoute(name: string, loci: string[]): DslRoute {
  return { name, loci, sourceLine: 0 };
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
