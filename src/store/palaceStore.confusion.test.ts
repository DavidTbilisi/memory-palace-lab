/**
 * Explaining a missed recall (backlog 07): Again asks why without holding the walk up; a logged
 * confusion pulls both Distinguisher cards forward and offers to link a new pair once.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Locus, MemoryEdge, MemoryNode, MemoryRoute, NedfEncoding, Palace } from "../domain/entities/types";
import { createAnalyticsEvent } from "../domain/services/analyticsService";
import { usePalaceStore } from "./palaceStore";

const palace: Palace = { id: "palace-1", name: "Test Palace", alias: null, atlasPath: null, editorSnapshot: null };
const routes: MemoryRoute[] = [{ id: "route-a", palaceId: "palace-1", name: "Locks" }];
const FAR = "2027-01-01T00:00:00.000Z";

const withD = (prompt: string): NedfEncoding => ({ distinguisher: { prompt, reason: "because" } });
const nodes: MemoryNode[] = [
  { id: "n1", objectId: "o1", title: "Mutex", content: "", kind: "memory", portal: null, nedf: withD("One key?") },
  { id: "n2", objectId: "o2", title: "Semaphore", content: "", kind: "memory", portal: null, nedf: withD("Many keys?") },
  { id: "n3", objectId: "o3", title: "Monitor", content: "", kind: "memory", portal: null },
];
const loci: Locus[] = nodes.map((node, index) => ({
  id: `l${index + 1}`,
  routeId: "route-a",
  nodeId: node.id,
  orderIndex: index,
  label: node.title,
  interval: 6,
  easeFactor: 2.5,
  repetitions: 2,
  nextReviewAt: FAR,
  lastReviewedAt: "2026-09-01T00:00:00.000Z",
}));

const confusionEdge: MemoryEdge = {
  id: "e1",
  objectId: "oe1",
  sourceNodeId: "n2",
  targetNodeId: "n1",
  castAb: "",
  castCd: "",
  castEf: "",
  castGh: "",
  kind: "confusion",
};

const store = () => usePalaceStore.getState();
const missEvents = () =>
  store()
    .analyticsEvents.filter((event) => event.eventType === "recall_miss_explained")
    .map((event) => ({ ...event, payload: JSON.parse(event.payloadJson) as Record<string, unknown> }));
const distinguisherDue = (locusId: string) =>
  store().loci.find((locus) => locus.id === locusId)?.slotSchedules?.distinguisher?.nextReviewAt ?? null;

beforeEach(() => {
  usePalaceStore.setState({
    currentPalace: palace,
    palaces: [palace],
    routes,
    loci,
    nodes,
    edges: [],
    editorRef: null,
    analyticsEvents: [],
    analyticsLoaded: true,
    storm: null,
    walkOpen: false,
    walkRouteId: "route-a",
    walkIndex: 0,
    walkDirection: "forward",
    walkRecallMode: false,
    walkSummary: null,
    walkMissPrompt: null,
    walkMissNotice: null,
  });
  store().setWalkOpen(true);
});

describe("rating Again", () => {
  it("asks why about the missed stop and still moves on", () => {
    store().rateWalkRecall("again");
    expect(store().walkIndex).toBe(1);
    expect(store().walkMissPrompt).toMatchObject({
      palaceId: "palace-1",
      routeId: "route-a",
      locusId: "l1",
      nodeId: "n1",
      nodeTitle: "Mutex",
      slot: "distinguisher",
      phase: "siege",
    });
  });

  it("keeps the question through another rating and replaces it on the next Again", () => {
    store().rateWalkRecall("again");
    store().rateWalkRecall("good");
    expect(store().walkMissPrompt?.nodeId).toBe("n1");
    store().rateWalkRecall("again");
    expect(store().walkMissPrompt?.nodeId).toBe("n3");
  });

  it("carries the question into the summary on the last step, and Done clears it", () => {
    usePalaceStore.setState({ walkIndex: 2 });
    store().rateWalkRecall("again");
    expect(store().walkOpen).toBe(false);
    expect(store().walkSummary).not.toBeNull();
    expect(store().walkMissPrompt?.nodeId).toBe("n3");
    store().dismissWalkSummary();
    expect(store().walkMissPrompt).toBeNull();
  });

  it("drops the question when the walk is put away", () => {
    store().rateWalkRecall("again");
    store().setWalkOpen(false);
    expect(store().walkMissPrompt).toBeNull();
  });

  it("marks a miss in a Storm's palace as Storm", async () => {
    usePalaceStore.setState({
      storm: { id: "s", palaceId: "palace-1", routeId: "route-a", routeName: "Locks", target: 5, startedAt: FAR, nodeIds: [] },
    });
    store().rateWalkRecall("again");
    expect(store().walkMissPrompt?.phase).toBe("storm");
    usePalaceStore.setState({ storm: null });
    await store().explainWalkMiss("blank");
    await vi.waitFor(() => expect(missEvents()).toHaveLength(1));
    expect(missEvents()[0]!.payload.phase).toBe("storm");
  });
});

describe("explainWalkMiss", () => {
  it("logs a blank as not a confusion and moves nothing", async () => {
    store().rateWalkRecall("again");
    const ratedAt = store().walkMissPrompt!.ratedAt;
    await store().explainWalkMiss("blank");
    await vi.waitFor(() => expect(missEvents()).toHaveLength(1));
    const [event] = missEvents();
    expect(event).toMatchObject({ nodeId: "n1", routeId: "route-a", eventGroup: "review" });
    expect(event!.payload).toEqual({
      cause: "blank",
      confusedWithNodeId: null,
      confusedWithTitle: null,
      locusId: "l1",
      slot: "distinguisher",
      nodeTitle: "Mutex",
      ratedAt,
    });
    expect(store().walkMissPrompt).toBeNull();
    expect(store().walkMissNotice).toBeNull();
    expect(distinguisherDue("l2")).toBeNull();
  });

  it("logs a confusion, pulls both Distinguishers forward, and offers to link a new pair", async () => {
    store().rateWalkRecall("again");
    const { ratedAt, sessionId } = store().walkMissPrompt!;
    await store().explainWalkMiss("confusion", "n2");
    await vi.waitFor(() => expect(missEvents()).toHaveLength(1));
    expect(missEvents()[0]).toMatchObject({
      sessionId,
      nodeId: "n1",
      payload: { cause: "confusion", confusedWithNodeId: "n2", confusedWithTitle: "Semaphore" },
    });
    // Mutex's Distinguisher was just rated Again, so it was due tomorrow; both are due now.
    expect(distinguisherDue("l1")).toBe(ratedAt);
    expect(distinguisherDue("l2")).toBe(ratedAt);
    expect(distinguisherDue("l3")).toBeNull();
    expect(store().walkMissNotice).toMatchObject({
      offerLink: true,
      message: "Link Mutex and Semaphore as a confusion?",
      notes: [],
    });
  });

  it("says so when the pair is already linked", async () => {
    usePalaceStore.setState({ edges: [confusionEdge] });
    store().rateWalkRecall("again");
    await store().explainWalkMiss("confusion", "n2");
    expect(store().walkMissNotice).toMatchObject({
      offerLink: false,
      message: "Logged. Mutex and Semaphore are linked as a confusion.",
    });
  });

  it("offers the link only the first time a pair is logged", async () => {
    usePalaceStore.setState({
      analyticsEvents: [
        createAnalyticsEvent({
          eventType: "recall_miss_explained",
          eventGroup: "review",
          palaceId: "palace-1",
          nodeId: "n2",
          payload: { cause: "confusion", confusedWithNodeId: "n1" },
        }),
      ],
    });
    store().rateWalkRecall("again");
    await store().explainWalkMiss("confusion", "n2");
    expect(store().walkMissNotice).toMatchObject({ offerLink: false, message: "Logged: Mutex mixed up with Semaphore." });
  });

  it("names the node that has no Distinguisher to pull forward", async () => {
    store().rateWalkRecall("again");
    await store().explainWalkMiss("confusion", "n3");
    expect(distinguisherDue("l1")).not.toBeNull();
    expect(distinguisherDue("l3")).toBeNull();
    expect(store().walkMissNotice?.notes).toEqual([
      "Monitor has no Distinguisher yet — add one so the review can tell them apart.",
    ]);
  });

  it("ignores a confusion with the missed node itself", async () => {
    store().rateWalkRecall("again");
    await store().explainWalkMiss("confusion", "n1");
    expect(store().walkMissPrompt?.nodeId).toBe("n1");
    expect(missEvents()).toHaveLength(0);
  });

  it("cannot link without the canvas and says why", async () => {
    store().rateWalkRecall("again");
    await store().explainWalkMiss("confusion", "n2");
    store().linkWalkMissConfusion();
    expect(store().walkMissNotice).toMatchObject({ offerLink: false, message: "Open the palace on the canvas to link them." });
    store().dismissWalkMiss();
    expect(store().walkMissNotice).toBeNull();
  });
});
