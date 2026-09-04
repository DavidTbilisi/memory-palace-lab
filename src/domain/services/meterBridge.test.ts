import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import { derivedEventId, hasMeterMapping, mapAppEvent, PALACE_WALK_MODE, toMeterTimestamp } from "./meterBridge";

function appEvent(over: Partial<AnalyticsEvent> & { payload?: Record<string, unknown> }): AnalyticsEvent {
  const { payload, ...rest } = over;
  return createAnalyticsEvent({
    eventType: rest.eventType ?? "walk_recall_rated",
    eventGroup: rest.eventGroup ?? "review",
    sessionId: rest.sessionId ?? "walk-session",
    palaceId: rest.palaceId ?? "palace-1",
    routeId: "routeId" in rest ? rest.routeId : "route-1",
    nodeId: "nodeId" in rest ? rest.nodeId : "node-1",
    createdAt: rest.createdAt ?? "2026-09-01T10:00:00.000Z",
    payload,
  });
}

describe("METER mapping", () => {
  it("writes timestamps the way METER does", () => {
    expect(toMeterTimestamp("2026-09-04T20:44:27.273Z")).toBe("2026-09-04T20:44:27.273+00:00");
    expect(toMeterTimestamp("2026-09-04T20:44:27Z")).toBe("2026-09-04T20:44:27.000+00:00");
    expect(toMeterTimestamp("not a date")).toBe("not a date");
  });

  it("derives stable UUID-shaped ids for secondary events", async () => {
    const id = await derivedEventId("abc", "latency_ms");
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(await derivedEventId("abc", "latency_ms")).toBe(id);
    expect(await derivedEventId("abd", "latency_ms")).not.toBe(id);
    // Pinned to the Node sha256 derivation the CLI backfill first shipped with;
    // changing it would make backfill duplicate every latency event.
    const hex = createHash("sha256").update("abc:latency_ms").digest("hex").slice(0, 32);
    expect(id).toBe(`${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`);
  });

  it("maps a rated recall to a hit/miss event plus a latency event, Anki-style", async () => {
    const event = appEvent({ payload: { rating: "good", ratingValue: 3, timeToRevealMs: 1234.6, nodeTitle: "Gate" } });
    const [primary, latency] = await mapAppEvent(event, "SOLID Citadel");
    expect(primary).toMatchObject({
      layer: "performance",
      operation: "review",
      metric_type: "hit",
      metric_value: 1,
      event_id: event.id,
      timestamp: "2026-09-01T10:00:00.000+00:00",
      session_id: "walk-session",
      artifact_id: "node-1",
      mode: PALACE_WALK_MODE,
    });
    expect(primary!.context).toMatchObject({
      source: "memory-palace-lab",
      app_event_id: event.id,
      app_event_type: "walk_recall_rated",
      palace_id: "palace-1",
      route_id: "route-1",
      topic: "SOLID Citadel",
      ease: 3,
      latency_ms: 1234.6,
      payload: { rating: "good", nodeTitle: "Gate" },
    });
    expect(Object.keys(primary!)).toEqual([
      "layer", "operation", "metric_type", "metric_value", "event_id", "timestamp",
      "session_id", "artifact_id", "mode", "context",
    ]);
    expect(latency).toMatchObject({
      metric_type: "latency_ms",
      metric_value: 1235,
      event_id: await derivedEventId(event.id, "latency_ms"),
    });
  });

  it("treats Again as a miss, skips unrated rows, and omits latency when absent", async () => {
    const miss = await mapAppEvent(appEvent({ payload: { rating: "again" } }), null);
    expect(miss).toHaveLength(1);
    expect(miss[0]).toMatchObject({ metric_type: "miss", metric_value: 0 });
    expect(miss[0]!.context).not.toHaveProperty("topic");
    expect(await mapAppEvent(appEvent({ payload: {} }), null)).toEqual([]);
  });

  it("maps walk and encode events, and leaves chatty state events out", async () => {
    expect((await mapAppEvent(appEvent({ eventType: "walk_started", payload: { routeLength: 7 } }), null))[0]).toMatchObject({
      layer: "performance", operation: "review", metric_type: "walk.started", metric_value: 7, artifact_id: "route-1",
    });
    expect((await mapAppEvent(appEvent({ eventType: "node_created", eventGroup: "graph", payload: { title: "A" } }), null))[0]).toMatchObject({
      layer: "encoding", operation: "encode", metric_type: "palace.node_created", metric_value: 1, artifact_id: "node-1", mode: null,
    });
    for (const eventType of ["palace_opened", "draft_saved", "walk_stepped", "walk_closed"] as const) {
      expect(hasMeterMapping(eventType)).toBe(false);
      expect(await mapAppEvent(appEvent({ eventType, eventGroup: "palace" }), null)).toEqual([]);
    }
    expect(hasMeterMapping("walk_recall_rated")).toBe(true);
  });
});
