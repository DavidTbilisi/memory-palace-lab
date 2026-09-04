import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../../../src/domain/entities/types";
import { createAnalyticsEvent } from "../../../src/domain/services/analyticsService";
import { appendAnalyticsEvents, createPalace, initDb, openDb } from "../palaceDb";
import {
  backfillMeter,
  derivedEventId,
  loadEmittedEventIds,
  mapAppEvent,
  PALACE_WALK_MODE,
  resolveMeterDataDir,
  toMeterTimestamp,
} from "./meterVerbs";

function appEvent(over: Partial<AnalyticsEvent> & { payload?: Record<string, unknown> }): AnalyticsEvent {
  const { payload, ...rest } = over;
  // Explicit null keeps the row insertable on a connection with foreign keys on.
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

describe("METER bridge", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "mpl-meter-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  describe("resolveMeterDataDir", () => {
    it("prefers the flag, then the env var, expanding ~", () => {
      const home = join(dir, "home");
      expect(resolveMeterDataDir({ flag: "~/x", env: "/e", cwd: dir, home })).toEqual({
        dir: join(home, "x"),
        via: "flag",
      });
      expect(resolveMeterDataDir({ env: "~/m", cwd: dir, home })).toEqual({ dir: join(home, "m"), via: "env" });
    });

    it("walks up from cwd to the first ancestor with wiki/ or .git/, like the meter CLI", () => {
      const root = join(dir, "repo");
      mkdirSync(join(root, "wiki", "deep", "er"), { recursive: true });
      expect(resolveMeterDataDir({ cwd: join(root, "wiki", "deep", "er"), home: dir })).toEqual({
        dir: join(root, "meter-data"),
        via: "project",
      });
      const gitRoot = join(dir, "other");
      mkdirSync(join(gitRoot, ".git"), { recursive: true });
      mkdirSync(join(gitRoot, "src"));
      expect(resolveMeterDataDir({ cwd: join(gitRoot, "src"), home: dir }).dir).toBe(join(gitRoot, "meter-data"));
    });

    it("falls back to ~/.neural-os/meter", () => {
      const home = join(dir, "home");
      mkdirSync(join(dir, "plain"), { recursive: true });
      expect(resolveMeterDataDir({ cwd: join(dir, "plain"), home })).toEqual({
        dir: join(home, ".neural-os", "meter"),
        via: "home",
      });
    });
  });

  it("writes timestamps the way METER does and derives stable secondary ids", () => {
    expect(toMeterTimestamp("2026-09-04T20:44:27.273Z")).toBe("2026-09-04T20:44:27.273+00:00");
    expect(toMeterTimestamp("2026-09-04T20:44:27Z")).toBe("2026-09-04T20:44:27.000+00:00");
    expect(toMeterTimestamp("not a date")).toBe("not a date");
    const id = derivedEventId("abc", "latency_ms");
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(derivedEventId("abc", "latency_ms")).toBe(id);
    expect(derivedEventId("abd", "latency_ms")).not.toBe(id);
  });

  describe("mapAppEvent", () => {
    it("maps a rated recall to a hit/miss event plus a latency event, Anki-style", () => {
      const event = appEvent({ payload: { rating: "good", ratingValue: 3, timeToRevealMs: 1234.6, nodeTitle: "Gate" } });
      const [primary, latency] = mapAppEvent(event, "SOLID Citadel");
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
      expect(latency).toMatchObject({ metric_type: "latency_ms", metric_value: 1235, event_id: derivedEventId(event.id, "latency_ms") });
    });

    it("treats Again as a miss, skips unrated rows, and omits latency when absent", () => {
      const miss = mapAppEvent(appEvent({ payload: { rating: "again" } }), null);
      expect(miss).toHaveLength(1);
      expect(miss[0]).toMatchObject({ metric_type: "miss", metric_value: 0 });
      expect(miss[0]!.context).not.toHaveProperty("topic");
      expect(mapAppEvent(appEvent({ payload: {} }), null)).toEqual([]);
    });

    it("maps walk and encode events, and leaves chatty state events out", () => {
      expect(mapAppEvent(appEvent({ eventType: "walk_started", payload: { routeLength: 7 } }), null)[0]).toMatchObject({
        layer: "performance", operation: "review", metric_type: "walk.started", metric_value: 7, artifact_id: "route-1",
      });
      expect(mapAppEvent(appEvent({ eventType: "node_created", eventGroup: "graph", payload: { title: "A" } }), null)[0]).toMatchObject({
        layer: "encoding", operation: "encode", metric_type: "palace.node_created", metric_value: 1, artifact_id: "node-1", mode: null,
      });
      for (const eventType of ["palace_opened", "draft_saved", "walk_stepped", "walk_closed"] as const) {
        expect(mapAppEvent(appEvent({ eventType, eventGroup: "palace" }), null)).toEqual([]);
      }
    });
  });

  it("reads existing event ids and skips corrupt lines", () => {
    const ids = loadEmittedEventIds('{"event_id":"a"}\nnot json\n\n{"event_id":"b","x":1}\n{"no":"id"}\n');
    expect([...ids]).toEqual(["a", "b"]);
  });

  describe("backfillMeter", () => {
    it("appends in chronological order, is idempotent, and honours --dry-run", () => {
      const db = openDb(join(dir, "app.sqlite3"));
      initDb(db);
      const palace = createPalace(db, "SOLID Citadel", null);
      const row = (over: Parameters<typeof appEvent>[0]) =>
        appEvent({ palaceId: palace.id, routeId: null, nodeId: null, ...over });
      appendAnalyticsEvents(db, [
        row({ createdAt: "2026-09-03T09:00:00.000Z", payload: { rating: "again", timeToRevealMs: 900 } }),
        row({ eventType: "palace_opened", eventGroup: "palace", createdAt: "2026-09-01T08:00:00.000Z" }),
        row({ eventType: "walk_started", createdAt: "2026-09-02T08:00:00.000Z", payload: { routeLength: 3 } }),
        row({ createdAt: "2026-09-02T08:05:00.000Z", payload: { rating: "easy" } }),
      ]);
      const dataDir = join(dir, "meter-data");

      const dry = backfillMeter({ db, dataDir, dryRun: true });
      expect(dry.appended).toBe(4);
      expect(existsSync(join(dataDir, "events.jsonl"))).toBe(false);

      const first = backfillMeter({ db, dataDir, dryRun: false });
      expect(first).toMatchObject({
        scanned: 4,
        appended: 4,
        appendedByMetric: { "walk.started": 1, hit: 1, miss: 1, latency_ms: 1 },
        alreadyPresent: 0,
        skippedByType: { palace_opened: 1 },
        firstTimestamp: "2026-09-02T08:00:00.000+00:00",
        lastTimestamp: "2026-09-03T09:00:00.000+00:00",
      });
      const lines = readFileSync(join(dataDir, "events.jsonl"), "utf8").trimEnd().split("\n");
      const parsed = lines.map((l) => JSON.parse(l));
      expect(parsed.map((e) => e.metric_type)).toEqual(["walk.started", "hit", "miss", "latency_ms"]);
      expect(parsed.map((e) => e.timestamp)).toEqual([...parsed.map((e) => e.timestamp)].sort());
      expect(parsed.every((e) => e.context.topic === "SOLID Citadel")).toBe(true);
      expect(lines.every((l) => !l.includes(": ") && !l.includes(", "))).toBe(true);

      const second = backfillMeter({ db, dataDir, dryRun: false });
      expect(second).toMatchObject({ appended: 0, alreadyPresent: 4 });
      expect(readFileSync(join(dataDir, "events.jsonl"), "utf8").trimEnd().split("\n")).toHaveLength(4);
      db.close();
    });

    it("never touches existing lines and repairs a missing trailing newline before appending", () => {
      const db = openDb(join(dir, "app.sqlite3"));
      initDb(db);
      const palace = createPalace(db, "P", null);
      appendAnalyticsEvents(db, [appEvent({ palaceId: palace.id, routeId: null, nodeId: null, payload: { rating: "good" } })]);
      const dataDir = join(dir, "meter-data");
      mkdirSync(dataDir);
      const foreign = '{"layer":"capture","operation":"read","metric_type":"x","metric_value":1,"event_id":"keep-me"}';
      writeFileSync(join(dataDir, "events.jsonl"), foreign, "utf8");
      backfillMeter({ db, dataDir, dryRun: false });
      const text = readFileSync(join(dataDir, "events.jsonl"), "utf8");
      expect(text.startsWith(`${foreign}\n`)).toBe(true);
      expect(text.endsWith("\n")).toBe(true);
      expect(text.trimEnd().split("\n")).toHaveLength(2);
      db.close();
    });
  });
});
