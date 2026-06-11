import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { PalaceSnapshot } from "../../src/domain/entities/types";
import {
  appendAnalyticsEvents,
  createPalace,
  initDb,
  listAnalyticsEvents,
  listPalaces,
  listTrashedPalaces,
  loadPalace,
  openDb,
  resolvePalace,
  restorePalace,
  saveSnapshot,
  softDeletePalace,
} from "./palaceDb";

function makeSnapshot(palaceId: string, base: PalaceSnapshot["palace"]): PalaceSnapshot {
  return {
    palace: { ...base, editorSnapshot: '{"store":{},"schema":{}}' },
    canvasObjects: [
      {
        id: "obj-1",
        palaceId,
        type: "node",
        x: 10,
        y: 20,
        width: 180,
        height: 100,
        zIndex: 0,
        payloadJson: '{"shapeId":"shape:a","shapeType":"geo"}',
      },
      {
        id: "obj-2",
        palaceId,
        type: "node",
        x: 300,
        y: 20,
        width: 180,
        height: 100,
        zIndex: 0,
        payloadJson: '{"shapeId":"shape:b","shapeType":"geo"}',
      },
      {
        id: "obj-3",
        palaceId,
        type: "edge",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        zIndex: 1,
        payloadJson: '{"shapeId":"shape:c","shapeType":"arrow"}',
      },
    ],
    nodes: [
      {
        id: "node-1",
        objectId: "obj-1",
        title: "Alpha",
        alias: "a",
        content: "first",
        kind: "memory",
        portal: null,
        imageUrl: null,
      },
      {
        id: "node-2",
        objectId: "obj-2",
        title: "Beta",
        alias: "",
        content: "second",
        kind: "portal",
        portal: { targetPalaceId: "other", targetPalaceName: "Other" },
        imageUrl: "https://example.com/x.png",
      },
    ],
    edges: [
      {
        id: "edge-1",
        objectId: "obj-3",
        sourceNodeId: "node-1",
        targetNodeId: "node-2",
        alias: "",
        castAb: "actor",
        castCd: "causes",
        castEf: "state",
        castGh: "before",
      },
    ],
    routes: [{ id: "route-1", palaceId, name: "Main" }],
    loci: [
      {
        id: "locus-1",
        routeId: "route-1",
        nodeId: "node-1",
        orderIndex: 0,
        label: "start",
        interval: 1,
        easeFactor: 2.5,
        nextReviewAt: "2026-06-12T00:00:00.000Z",
        repetitions: 0,
        lastReviewedAt: null,
      },
    ],
  };
}

describe("palaceDb", () => {
  let dir: string;
  let db: ReturnType<typeof openDb>;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "mpl-mcp-"));
    db = openDb(join(dir, "test.sqlite3"));
    initDb(db);
  });

  afterEach(() => {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it("round-trips a full snapshot through save and load", () => {
    const palace = createPalace(db, "Test Palace", "/domain/sub");
    const snap = makeSnapshot(palace.id, palace);
    saveSnapshot(db, snap);

    const loaded = loadPalace(db, palace.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.palace.name).toBe("Test Palace");
    expect(loaded!.palace.atlasPath).toBe("/domain/sub");
    expect(loaded!.palace.editorSnapshot).toBe(snap.palace.editorSnapshot);
    expect(loaded!.canvasObjects).toHaveLength(3);
    expect(loaded!.nodes).toHaveLength(2);
    expect(loaded!.edges).toEqual(snap.edges);
    expect(loaded!.routes).toEqual(snap.routes);
    expect(loaded!.loci).toEqual(snap.loci);

    const beta = loaded!.nodes.find((n) => n.id === "node-2")!;
    expect(beta.kind).toBe("portal");
    expect(beta.portal).toEqual({ targetPalaceId: "other", targetPalaceName: "Other" });
    expect(beta.imageUrl).toBe("https://example.com/x.png");
  });

  it("save is delete-and-reinsert: removed rows disappear", () => {
    const palace = createPalace(db, "P");
    const snap = makeSnapshot(palace.id, palace);
    saveSnapshot(db, snap);

    const smaller: PalaceSnapshot = {
      ...snap,
      canvasObjects: snap.canvasObjects.slice(0, 1),
      nodes: snap.nodes.slice(0, 1),
      edges: [],
      routes: [],
      loci: [],
    };
    saveSnapshot(db, smaller);

    const loaded = loadPalace(db, palace.id)!;
    expect(loaded.nodes).toHaveLength(1);
    expect(loaded.edges).toHaveLength(0);
    expect(loaded.routes).toHaveLength(0);
  });

  it("soft delete hides, restore brings back, expiry purges", () => {
    const palace = createPalace(db, "Trash Me");
    softDeletePalace(db, palace.id);
    expect(listPalaces(db).find((p) => p.id === palace.id)).toBeUndefined();
    expect(listTrashedPalaces(db).find((p) => p.id === palace.id)).toBeDefined();

    restorePalace(db, palace.id);
    expect(listPalaces(db).find((p) => p.id === palace.id)).toBeDefined();

    softDeletePalace(db, palace.id);
    db.prepare("UPDATE palaces SET purge_at = ? WHERE id = ?").run(
      "2000-01-01T00:00:00.000Z",
      palace.id,
    );
    expect(listTrashedPalaces(db).find((p) => p.id === palace.id)).toBeUndefined();
    expect(loadPalace(db, palace.id)).toBeNull();
  });

  it("appends and filters analytics events", () => {
    const palace = createPalace(db, "P");
    appendAnalyticsEvents(db, [
      {
        id: "ev-1",
        sessionId: "s1",
        palaceId: palace.id,
        routeId: null,
        nodeId: null,
        eventType: "node_created",
        eventGroup: "graph",
        createdAt: "2026-06-11T10:00:00.000Z",
        payloadJson: '{"source":"mcp"}',
      },
      {
        id: "ev-2",
        sessionId: "s1",
        palaceId: null,
        routeId: null,
        nodeId: null,
        eventType: "palace_created",
        eventGroup: "palace",
        createdAt: "2026-06-11T11:00:00.000Z",
        payloadJson: "{}",
      },
    ]);

    expect(listAnalyticsEvents(db)).toHaveLength(2);
    expect(listAnalyticsEvents(db, { palaceId: palace.id })).toHaveLength(1);
    expect(listAnalyticsEvents(db, { eventType: "palace_created" })).toHaveLength(1);
    expect(listAnalyticsEvents(db, { limit: 1 })[0]!.id).toBe("ev-2");
  });

  it("resolves palaces by id, name, and alias; rejects ambiguity", () => {
    const a = createPalace(db, "Solid Principles");
    db.prepare("UPDATE palaces SET alias = ? WHERE id = ?").run("solid", a.id);
    expect(resolvePalace(db, a.id).id).toBe(a.id);
    expect(resolvePalace(db, "Solid Principles").id).toBe(a.id);
    expect(resolvePalace(db, "solid").id).toBe(a.id);
    expect(() => resolvePalace(db, "nope")).toThrow(/No palace found/);

    createPalace(db, "Twin");
    createPalace(db, "Twin");
    expect(() => resolvePalace(db, "Twin")).toThrow(/ambiguous/);
  });
});
