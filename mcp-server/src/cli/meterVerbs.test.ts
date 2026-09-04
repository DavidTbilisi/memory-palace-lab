import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../../../src/domain/entities/types";
import { createAnalyticsEvent } from "../../../src/domain/services/analyticsService";
import { appendAnalyticsEvents, createPalace, initDb, openDb } from "../palaceDb";
import { backfillMeter, loadEmittedEventIds, resolveMeterDataDir } from "./meterVerbs";

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

  it("reads existing event ids and skips corrupt lines", () => {
    const ids = loadEmittedEventIds('{"event_id":"a"}\nnot json\n\n{"event_id":"b","x":1}\n{"no":"id"}\n');
    expect([...ids]).toEqual(["a", "b"]);
  });

  describe("backfillMeter", () => {
    it("appends in chronological order, is idempotent, and honours --dry-run", async () => {
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

      const dry = await backfillMeter({ db, dataDir, dryRun: true });
      expect(dry.appended).toBe(4);
      expect(existsSync(join(dataDir, "events.jsonl"))).toBe(false);

      const first = await backfillMeter({ db, dataDir, dryRun: false });
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

      const second = await backfillMeter({ db, dataDir, dryRun: false });
      expect(second).toMatchObject({ appended: 0, alreadyPresent: 4 });
      expect(readFileSync(join(dataDir, "events.jsonl"), "utf8").trimEnd().split("\n")).toHaveLength(4);
      db.close();
    });

    it("never touches existing lines and repairs a missing trailing newline before appending", async () => {
      const db = openDb(join(dir, "app.sqlite3"));
      initDb(db);
      const palace = createPalace(db, "P", null);
      appendAnalyticsEvents(db, [appEvent({ palaceId: palace.id, routeId: null, nodeId: null, payload: { rating: "good" } })]);
      const dataDir = join(dir, "meter-data");
      mkdirSync(dataDir);
      const foreign = '{"layer":"capture","operation":"read","metric_type":"x","metric_value":1,"event_id":"keep-me"}';
      writeFileSync(join(dataDir, "events.jsonl"), foreign, "utf8");
      await backfillMeter({ db, dataDir, dryRun: false });
      const text = readFileSync(join(dataDir, "events.jsonl"), "utf8");
      expect(text.startsWith(`${foreign}\n`)).toBe(true);
      expect(text.endsWith("\n")).toBe(true);
      expect(text.trimEnd().split("\n")).toHaveLength(2);
      db.close();
    });
  });
});
