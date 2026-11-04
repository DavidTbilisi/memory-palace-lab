import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, MemoryNode, RecallRating } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import type { DueQueueSnapshot } from "./dueQueue";
import { buildInterventions, interventionNodeIds, type Intervention } from "./interventions";
import type { ConfusionHotspot } from "./memoryStrengthService";

const node = (id: string, title: string): MemoryNode => ({ id, objectId: `o-${id}`, title, content: "", kind: "memory", portal: null });

function palace(inReview = true): DueQueueSnapshot {
  return {
    palace: { id: "p", name: "JavaScript", createdAt: "2026-10-01T00:00:00.000Z" },
    routes: [{ id: "r", palaceId: "p", name: "Basics", inReview }],
    nodes: [node("closure", "Closure"), node("hoist", "Hoisting")],
    loci: [
      { id: "l-closure", routeId: "r", nodeId: "closure", orderIndex: 0, label: "" },
      { id: "l-hoist", routeId: "r", nodeId: "hoist", orderIndex: 1, label: "" },
    ],
  };
}

let minute = 0;
function rated(nodeId: string, rating: RecallRating, extra: Record<string, unknown> = {}): AnalyticsEvent {
  minute += 1;
  return {
    ...createAnalyticsEvent({
      eventType: "walk_recall_rated",
      eventGroup: "review",
      palaceId: "p",
      routeId: "r",
      nodeId,
      payload: { rating, locusId: `l-${nodeId}`, ...extra },
    }),
    createdAt: new Date(Date.UTC(2026, 10, 1, 9, minute)).toISOString(),
  };
}

function accepted(nodeId: string, kind = "re-encode"): AnalyticsEvent {
  minute += 1;
  return {
    ...createAnalyticsEvent({ eventType: "intervention_accepted", eventGroup: "review", palaceId: "p", nodeId, payload: { kind } }),
    createdAt: new Date(Date.UTC(2026, 10, 1, 9, minute)).toISOString(),
  };
}

const build = (events: AnalyticsEvent[], hotspots: ConfusionHotspot[] = [], snapshots = [palace()]) =>
  buildInterventions({ snapshots, analyticsEvents: events, hotspots });

describe("re-encode suggestions", () => {
  it("suggest re-encoding a node with Again or Hard on 3 of its last 5 ratings", () => {
    const events = [
      rated("closure", "good"),
      rated("closure", "again"),
      rated("closure", "hard"),
      rated("closure", "good"),
      rated("closure", "again"),
      rated("hoist", "again"),
      rated("hoist", "hard"),
      rated("hoist", "good"),
    ];
    const [only, ...rest] = build(events);
    expect(rest).toEqual([]);
    expect(only).toMatchObject({ kind: "re-encode", nodeId: "closure", title: "Closure", palaceName: "JavaScript", misses: 3, recent: 5 });
    expect(only!.reason).toContain("3 of its last 5");
  });

  it("only counts the last five ratings", () => {
    const events = ["again", "again", "again", "good", "good", "good", "easy", "good"].map((r) => rated("closure", r as RecallRating));
    expect(build(events)).toEqual([]);
  });

  it("leaves out Storm ratings, which measure encoding rather than what has stuck", () => {
    const events = ["again", "again", "again"].map((r) => rated("closure", r as RecallRating, { phase: "storm" }));
    expect(build(events)).toEqual([]);
  });

  it("starts a node afresh once it has been re-encoded, counting only the ratings after", () => {
    const misses = ["again", "hard", "again"].map((r) => rated("closure", r as RecallRating));
    expect(build(misses)).toHaveLength(1);
    const afterReEncode = [...misses, accepted("closure"), rated("closure", "again"), rated("closure", "good")];
    expect(build(afterReEncode)).toEqual([]);
    // Another kind of intervention does not reset the count.
    expect(build([...misses, accepted("closure", "add-distinguisher")])).toHaveLength(1);
  });

  it("skips nodes that are no longer on a route in review", () => {
    const events = ["again", "again", "again"].map((r) => rated("closure", r as RecallRating));
    expect(build(events, [], [palace(false)])).toEqual([]);
  });
});

function hotspot(linked: boolean, distinguishers: [boolean, boolean], count = 2): ConfusionHotspot {
  return {
    palaceId: "p",
    palaceName: "Concurrency",
    nodes: [
      { nodeId: "sem", title: "Semaphore", missCount: 2, hasDistinguisher: distinguishers[0] },
      { nodeId: "mutex", title: "Mutex", missCount: 1, hasDistinguisher: distinguishers[1] },
    ],
    count,
    lastLoggedAt: "2026-11-01T09:00:00.000Z",
    linked,
    review: null,
  };
}

describe("contrast suggestions", () => {
  it("suggest linking a pair mixed up but not linked", () => {
    const [suggestion] = build([], [hotspot(false, [false, true])]);
    expect(suggestion).toMatchObject({ kind: "link-confusion", count: 2 });
    expect(interventionNodeIds(suggestion!)).toEqual(["sem", "mutex"]);
    expect(suggestion!.reason).toContain("Mixed up 2 times");
  });

  it("suggest a Distinguisher for a linked pair's node without one", () => {
    const [suggestion] = build([], [hotspot(true, [false, true])]);
    expect(suggestion).toMatchObject({ kind: "add-distinguisher", nodeId: "sem", title: "Semaphore", otherTitle: "Mutex" });
  });

  it("suggest nothing for a linked pair that can already be told apart", () => {
    expect(build([], [hotspot(true, [true, true])])).toEqual([]);
  });
});

describe("ranking", () => {
  it("puts the most urgent first: a failing node ahead of a pair mixed up once", () => {
    const events = ["again", "again", "again"].map((r) => rated("closure", r as RecallRating));
    const kinds = build(events, [hotspot(false, [false, false], 1)]).map((i: Intervention) => i.kind);
    expect(kinds).toEqual(["re-encode", "link-confusion"]);
  });
});

describe("route fixes", () => {
  const friction = (status: "cognitively_expensive" | "unstable" | "steady") => [
    {
      routeId: "r",
      routeName: "Basics",
      palaceId: "p",
      palaceName: "JavaScript",
      attemptCount: 6,
      averageRevealLatencyMs: 9000,
      failureRate: 0.5,
      hardRate: 0.2,
      frictionScore: 74,
      status,
      dueState: null,
      reasons: ["half the recalls fail"],
    },
  ];
  const weakOnBoth = [rated("closure", "again"), rated("hoist", "hard")];
  const withThird = (): DueQueueSnapshot => {
    const snap = palace();
    snap.nodes.push(node("scope", "Scope"));
    snap.loci.push({ id: "l-scope", routeId: "r", nodeId: "scope", orderIndex: 2, label: "" });
    return snap;
  };

  it("propose a concrete change for a route the Strength tab flags", () => {
    const [fix] = buildInterventions({ snapshots: [withThird()], analyticsEvents: weakOnBoth, hotspots: [], routeFriction: friction("cognitively_expensive") });
    expect(fix).toMatchObject({ kind: "route-surgery", routeId: "r", plan: { kind: "extract-weak", locusIds: ["l-closure", "l-hoist"] } });
    expect((fix as { proposal: string }).proposal).toBe("Move Closure, Hoisting out of Basics into Basics · weak spots, a short route of their own.");
    expect(fix!.reason).toBe("Costs a lot to walk: half the recalls fail.");
  });

  it("leave a steady route alone, and a route just fixed until five ratings land on it", () => {
    expect(buildInterventions({ snapshots: [withThird()], analyticsEvents: weakOnBoth, hotspots: [], routeFriction: friction("steady") })).toEqual([]);
    minute += 1;
    const fixed: AnalyticsEvent = {
      ...createAnalyticsEvent({ eventType: "intervention_accepted", eventGroup: "review", palaceId: "p", payload: { kind: "route-surgery", routeIds: ["r", "r2"] } }),
      createdAt: new Date(Date.UTC(2026, 10, 1, 9, minute)).toISOString(),
    };
    const after = [...weakOnBoth, fixed, rated("closure", "again"), rated("hoist", "hard")];
    const settled = [...after, rated("scope", "good"), rated("closure", "again"), rated("hoist", "hard")];
    const routeFixes = (events: AnalyticsEvent[]) =>
      buildInterventions({ snapshots: [withThird()], analyticsEvents: events, hotspots: [], routeFriction: friction("unstable") }).filter(
        (i) => i.kind === "route-surgery",
      );
    expect(routeFixes(after)).toEqual([]);
    expect(routeFixes(settled)).toHaveLength(1);
  });
});
