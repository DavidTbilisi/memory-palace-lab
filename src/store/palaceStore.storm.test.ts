/**
 * Storm sessions in palaceStore: a Storm gets its own route, each first encode becomes a stop that
 * is first due after sleep, and the result is recorded with a personal best.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsEvent, MemoryNode, Palace } from "../domain/entities/types";
import { usePalaceStore } from "./palaceStore";

const palace: Palace = { id: "palace-1", name: "Test Palace", alias: null, atlasPath: null, editorSnapshot: null };
const nodes: MemoryNode[] = ["n1", "n2", "n3"].map((id) => ({
  id,
  objectId: `o-${id}`,
  title: id,
  content: "",
  kind: "memory",
  portal: null,
}));

const stormEvents = () =>
  usePalaceStore
    .getState()
    .analyticsEvents.filter((event) => event.eventType === "storm_completed")
    .map((event) => JSON.parse(event.payloadJson) as Record<string, unknown>);

beforeEach(() => {
  // Local 22:30, so the first review lands at wake time the next morning.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 8, 28, 22, 30));
  usePalaceStore.setState({
    currentPalace: palace,
    palaces: [palace],
    routes: [],
    loci: [],
    nodes,
    edges: [],
    analyticsEvents: [],
    walkOpen: false,
    walkRouteId: null,
    storm: null,
    stormSummary: null,
    wakeTime: "07:00",
  });
});

afterEach(() => {
  usePalaceStore.getState().stopStorm();
  usePalaceStore.setState({ stormSummary: null });
  vi.useRealTimers();
});

describe("Storm sessions", () => {
  it("starts on a route of its own and remembers the target", () => {
    const id = usePalaceStore.getState().startStorm(3);
    const { storm, routes, stormTarget } = usePalaceStore.getState();
    expect(id).toBe(storm!.id);
    expect(routes.map((route) => route.name)).toEqual(["Storm · 28 Sep"]);
    expect(storm).toMatchObject({ palaceId: "palace-1", routeId: routes[0]!.id, target: 3, nodeIds: [] });
    expect(stormTarget).toBe(3);
  });

  it("makes each first encode the next stop, due at wake time after the night", () => {
    usePalaceStore.getState().startStorm(3);
    usePalaceStore.getState().countStormEncode("n1");
    usePalaceStore.getState().countStormEncode("n2");
    usePalaceStore.getState().countStormEncode("n1"); // already counted
    const { storm, loci } = usePalaceStore.getState();
    expect(storm!.nodeIds).toEqual(["n1", "n2"]);
    expect(loci.map((locus) => [locus.nodeId, locus.orderIndex])).toEqual([
      ["n1", 0],
      ["n2", 1],
    ]);
    expect(loci.every((locus) => locus.nextReviewAt === new Date(2026, 8, 29, 7).toISOString())).toBe(true);
  });

  it("ends on reaching the target and records the result as a first personal best", async () => {
    usePalaceStore.getState().startStorm(2);
    vi.setSystemTime(new Date(2026, 8, 28, 22, 50));
    usePalaceStore.getState().countStormEncode("n1");
    usePalaceStore.getState().countStormEncode("n2");
    const { storm, stormSummary } = usePalaceStore.getState();
    expect(storm).toBeNull();
    expect(stormSummary).toMatchObject({
      count: 2,
      target: 2,
      endedBy: "target",
      personalBest: true,
      wallMs: 20 * 60_000,
      routeName: "Storm · 28 Sep",
      firstReviewAt: new Date(2026, 8, 29, 7).toISOString(),
    });
    await vi.waitFor(() => expect(stormEvents()).toEqual([expect.objectContaining({ count: 2, phase: "storm" })]));
  });

  it("marks a personal best only when an earlier Storm is beaten", () => {
    const earlier: AnalyticsEvent = {
      id: "earlier-storm",
      eventType: "storm_completed",
      eventGroup: "review",
      sessionId: null,
      palaceId: "palace-1",
      routeId: null,
      nodeId: null,
      createdAt: new Date(2026, 8, 20).toISOString(),
      payloadJson: JSON.stringify({ count: 2 }),
    };
    usePalaceStore.setState({ analyticsEvents: [earlier] });
    usePalaceStore.getState().startStorm(10);
    usePalaceStore.getState().countStormEncode("n1");
    usePalaceStore.getState().countStormEncode("n2");
    usePalaceStore.getState().stopStorm();
    expect(usePalaceStore.getState().stormSummary).toMatchObject({ count: 2, endedBy: "stopped", personalBest: false });

    usePalaceStore.getState().startStorm(10);
    for (const id of ["n1", "n2", "n3"]) usePalaceStore.getState().countStormEncode(id);
    usePalaceStore.getState().stopStorm();
    expect(usePalaceStore.getState().stormSummary).toMatchObject({ count: 3, personalBest: true });
  });

  it("marks events in the Storm's palace as Storm phase, and none after it ends", async () => {
    usePalaceStore.getState().startStorm(5);
    await usePalaceStore.getState().recordAnalyticsEvent({ eventType: "walk_recall_rated", eventGroup: "review", payload: { rating: "good" } });
    usePalaceStore.getState().stopStorm();
    await usePalaceStore.getState().recordAnalyticsEvent({ eventType: "walk_recall_rated", eventGroup: "review", payload: { rating: "good" } });
    const phases = usePalaceStore
      .getState()
      .analyticsEvents.filter((event) => event.eventType === "walk_recall_rated")
      .map((event) => (JSON.parse(event.payloadJson) as { phase?: string }).phase ?? null);
    expect(phases.sort()).toEqual([null, "storm"]);
  });

  it("does nothing without an open palace, and ignores encodes when no Storm runs", () => {
    usePalaceStore.getState().countStormEncode("n1");
    expect(usePalaceStore.getState().loci).toEqual([]);
    usePalaceStore.setState({ currentPalace: null });
    expect(usePalaceStore.getState().startStorm(5)).toBeNull();
  });

  it("keeps a valid wake time and ignores a bad one", () => {
    usePalaceStore.getState().setWakeTime("06:15");
    usePalaceStore.getState().setWakeTime("7am");
    expect(usePalaceStore.getState().wakeTime).toBe("06:15");
  });
});
