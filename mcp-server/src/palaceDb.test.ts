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

  it("keeps route order and route settings through save and load", () => {
    const palace = createPalace(db, "Ordered");
    const snap = makeSnapshot(palace.id, palace);
    const routes = [
      { id: "route-z", palaceId: palace.id, name: "Zulu", color: "rose" as const },
      { id: "route-a", palaceId: palace.id, name: "Alpha", hidden: true },
      { id: "route-m", palaceId: palace.id, name: "Mike" },
    ];
    saveSnapshot(db, { ...snap, routes, loci: [] });

    expect(loadPalace(db, palace.id)!.routes).toEqual(routes);
  });

  it("keeps route metadata through save and load", () => {
    const palace = createPalace(db, "Tagged");
    const snap = makeSnapshot(palace.id, palace);
    const metadata = [
      { key: "difficulty", value: "advanced" },
      { key: "prereq", value: "Gate of SOLID" },
    ];
    const routes = [{ id: "route-t", palaceId: palace.id, name: "Tagged", color: "sky" as const, metadata }];
    saveSnapshot(db, { ...snap, routes, loci: [] });

    expect(loadPalace(db, palace.id)!.routes).toEqual(routes);
    expect(db.prepare("SELECT settings_json FROM routes").get()).toEqual({
      settings_json: JSON.stringify({ color: "sky", metadata }),
    });
  });

  it("keeps walk direction, review, notes, and sections through save and load", () => {
    const palace = createPalace(db, "Walked");
    const snap = makeSnapshot(palace.id, palace);
    const routes = [
      {
        id: "route-w",
        palaceId: palace.id,
        name: "Walked",
        direction: "alternate" as const,
        lastWalkDirection: "reverse" as const,
        inReview: false,
        notes: "Start at the gate.",
      },
    ];
    const loci = [{ ...snap.loci[0]!, routeId: "route-w", section: "Hall" }];
    saveSnapshot(db, { ...snap, routes, loci });

    const loaded = loadPalace(db, palace.id)!;
    expect(loaded.routes).toEqual(routes);
    expect(loaded.loci).toEqual(loci);
  });

  it("keeps a node's NEDF slots and a stop's slot schedules through save and load", () => {
    const palace = createPalace(db, "Encoded");
    const snap = makeSnapshot(palace.id, palace);
    const nedf = { nameHook: "Mute-X", failure: { scenario: "Forgot to unlock", correction: "Release in finally" } };
    const slotSchedules = {
      failure: { interval: 1, easeFactor: 2.3, repetitions: 0, nextReviewAt: "2026-09-26T00:00:00.000Z", lastReviewedAt: null },
    };
    const nodes = snap.nodes.map((node, i) => (i === 0 ? { ...node, nedf } : node));
    const loci = [{ ...snap.loci[0]!, slotSchedules }];
    saveSnapshot(db, { ...snap, nodes, loci });

    const loaded = loadPalace(db, palace.id)!;
    expect(loaded.nodes.find((node) => node.id === nodes[0]!.id)!.nedf).toEqual(nedf);
    expect(loaded.nodes.find((node) => node.id !== nodes[0]!.id)).not.toHaveProperty("nedf");
    expect(loaded.loci[0]!.slotSchedules).toEqual(slotSchedules);
  });

  it("keeps a stop's saved view through save and load", () => {
    const palace = createPalace(db, "Framed");
    const snap = makeSnapshot(palace.id, palace);
    const view = { x: -412.5, y: -230, w: 825, h: 460.25 };
    const loci = [{ ...snap.loci[0]!, view }];
    saveSnapshot(db, { ...snap, loci });

    expect(loadPalace(db, palace.id)!.loci).toEqual(loci);
    expect(db.prepare("SELECT settings_json FROM loci").get()).toEqual({
      settings_json: JSON.stringify({ view }),
    });
  });

  it("upgrades a database created before route order and settings existed", () => {
    const legacyPath = join(dir, "legacy.sqlite3");
    const legacy = openDb(legacyPath);
    legacy.exec(`
      CREATE TABLE palaces (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, created_at TEXT NOT NULL,
        alias TEXT, atlas_path TEXT, editor_snapshot TEXT, deleted_at TEXT, purge_at TEXT);
      CREATE TABLE routes (id TEXT PRIMARY KEY NOT NULL, palace_id TEXT NOT NULL, name TEXT NOT NULL);
      INSERT INTO routes (id, palace_id, name) VALUES ('r-b', 'p', 'Beta'), ('r-a', 'p', 'Alpha');
      CREATE TABLE loci (id TEXT PRIMARY KEY NOT NULL, route_id TEXT NOT NULL, node_id TEXT NOT NULL,
        order_index INTEGER NOT NULL);
      INSERT INTO loci (id, route_id, node_id, order_index) VALUES ('l-1', 'r-a', 'n', 0);
    `);
    legacy.close();

    const upgraded = openDb(legacyPath);
    try {
      const rows = upgraded
        .prepare("SELECT id, sort_index, settings_json FROM routes ORDER BY sort_index, name")
        .all();
      expect(rows).toEqual([
        { id: "r-a", sort_index: 0, settings_json: "{}" },
        { id: "r-b", sort_index: 0, settings_json: "{}" },
      ]);
      expect(upgraded.prepare("SELECT id, settings_json FROM loci").all()).toEqual([
        { id: "l-1", settings_json: "{}" },
      ]);
    } finally {
      upgraded.close();
    }
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

  it("creates the palace when saving a snapshot it has never seen", () => {
    // Restoring a backup, or pulling from the sync vault, saves a snapshot for a palace this
    // database has no row for. A plain UPDATE matched nothing and — foreign keys being off —
    // the child rows landed anyway, leaving canvas/node/edge rows owned by no palace and an
    // empty library. Regression test for that.
    const palaceId = "11111111-2222-3333-4444-555555555555";
    const snap = makeSnapshot(palaceId, {
      id: palaceId,
      name: "Restored Palace",
      createdAt: "2026-01-01T00:00:00.000Z",
      alias: null,
      atlasPath: "/restored",
      deletedAt: null,
      purgeAt: null,
    });

    saveSnapshot(db, snap);

    const loaded = loadPalace(db, palaceId);
    expect(loaded).not.toBeNull();
    expect(loaded!.palace.name).toBe("Restored Palace");
    expect(loaded!.palace.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(loaded!.nodes).toHaveLength(2);
    expect(listPalaces(db).map((p) => p.id)).toContain(palaceId);

    const orphans = db
      .prepare(
        `SELECT count(*) AS n FROM canvas_objects
         LEFT JOIN palaces ON palaces.id = canvas_objects.palace_id
         WHERE palaces.id IS NULL`,
      )
      .get() as { n: number };
    expect(orphans.n).toBe(0);
  });

  it("bumps the palace revision on every write, ignoring any revision the caller sends", () => {
    const palace = createPalace(db, "Versioned");
    expect(palace.rev).toBe(1);

    const snap = makeSnapshot(palace.id, palace);
    saveSnapshot(db, snap);
    expect(loadPalace(db, palace.id)!.palace.rev).toBe(2);

    // A snapshot arriving from another device carries that device's revision; it must not
    // dictate ours, or a peer could stall our pushes by claiming a high number.
    saveSnapshot(db, { ...snap, palace: { ...snap.palace, rev: 9999 } });
    expect(loadPalace(db, palace.id)!.palace.rev).toBe(3);

    // A delete is a change other devices have to learn about, so it bumps too.
    softDeletePalace(db, palace.id);
    expect(listTrashedPalaces(db).find((p) => p.id === palace.id)!.rev).toBe(4);
    restorePalace(db, palace.id);
    expect(loadPalace(db, palace.id)!.palace.rev).toBe(5);
  });

  it("records a tombstone when a trashed palace passes its purge date", () => {
    const palace = createPalace(db, "Doomed");
    saveSnapshot(db, makeSnapshot(palace.id, palace));
    const revBeforeDelete = loadPalace(db, palace.id)!.palace.rev!;

    softDeletePalace(db, palace.id);
    db.prepare("UPDATE palaces SET purge_at = ? WHERE id = ?").run(
      "2000-01-01T00:00:00.000Z",
      palace.id,
    );

    listPalaces(db); // purgeExpiredPalaces runs on every list

    expect(loadPalace(db, palace.id)).toBeNull();
    const tombstone = db
      .prepare("SELECT palace_id, rev FROM sync_tombstones WHERE palace_id = ?")
      .get(palace.id) as { palace_id: string; rev: number } | undefined;
    expect(tombstone).toBeDefined();
    // The recorded revision is what lets a pull tell "this was deleted" from "this was
    // edited somewhere else after the delete" — the latter is a conflict, not a purge.
    expect(tombstone!.rev).toBeGreaterThan(revBeforeDelete);
  });

  it("records the tombstone at the revision the vault last agreed on", () => {
    // `palaces.rev` counts this device's own saves, so a palace another device pushed at
    // revision 40 might sit here at revision 2. Recording the local number made the sync
    // plan compare two unrelated sequences: `remote.rev > tombstone.rev` was true for any
    // palace ever pulled, so purging one raised a conflict claiming it had been edited
    // elsewhere when nothing had touched it.
    const palace = createPalace(db, "Pulled from elsewhere");
    saveSnapshot(db, makeSnapshot(palace.id, palace));
    const localRev = loadPalace(db, palace.id)!.palace.rev!;
    db.prepare(
      `INSERT INTO sync_state (palace_id, base_rev, base_hash, remote_rev, remote_hash, synced_at)
       VALUES (?, ?, '', ?, '', '')`,
    ).run(palace.id, localRev, localRev + 40);

    softDeletePalace(db, palace.id);
    db.prepare("UPDATE palaces SET purge_at = ? WHERE id = ?").run(
      "2000-01-01T00:00:00.000Z",
      palace.id,
    );
    listPalaces(db);

    const tombstone = db
      .prepare("SELECT rev FROM sync_tombstones WHERE palace_id = ?")
      .get(palace.id) as { rev: number };
    expect(tombstone.rev).toBe(localRev + 40);
  });

  it("falls back to the local revision for a palace that was never synced", () => {
    const palace = createPalace(db, "Never synced");
    saveSnapshot(db, makeSnapshot(palace.id, palace));
    const localRev = loadPalace(db, palace.id)!.palace.rev!;

    softDeletePalace(db, palace.id);
    db.prepare("UPDATE palaces SET purge_at = ? WHERE id = ?").run(
      "2000-01-01T00:00:00.000Z",
      palace.id,
    );
    listPalaces(db);

    const tombstone = db
      .prepare("SELECT rev FROM sync_tombstones WHERE palace_id = ?")
      .get(palace.id) as { rev: number };
    // No sync_state row means no remote revision to speak of; the local one is all there is.
    expect(tombstone.rev).toBeGreaterThan(localRev);
  });
});
