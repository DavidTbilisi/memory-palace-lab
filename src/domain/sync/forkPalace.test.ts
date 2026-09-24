import { describe, expect, it } from "vitest";
import type { PalaceSnapshot } from "../entities/types";
import { forkPalaceSnapshot, rewriteBlobPalaceId } from "./forkPalace";

const ORIGINAL = "palace-original";
const OTHER = "palace-elsewhere";

/** A tldraw-shaped store: shapes carry mpPalaceId, and one is a portal to another palace. */
function editorSnapshot(palaceId: string): string {
  return JSON.stringify({
    store: {
      "shape:a": {
        id: "shape:a",
        typeName: "shape",
        meta: { mpPalaceId: palaceId, mpObjectId: "obj-1", mpNodeId: "node-1", mpTitle: "Alpha" },
      },
      "shape:b": {
        id: "shape:b",
        typeName: "shape",
        meta: {
          mpPalaceId: palaceId,
          mpObjectId: "obj-2",
          mpNodeId: "node-2",
          mpNodeKind: "portal",
          // A portal pointing somewhere else entirely — must survive untouched.
          mpPortalPalaceId: OTHER,
          mpPortalPalaceName: "Elsewhere",
        },
      },
      "shape:c": {
        id: "shape:c",
        typeName: "shape",
        meta: {
          mpPalaceId: palaceId,
          mpEdgeId: "edge-1",
          // A self-portal: it legitimately holds the ORIGINAL id, which is exactly what a
          // blind string replace over the serialized blob would corrupt.
          mpPortalPalaceId: palaceId,
        },
      },
    },
    schema: { schemaVersion: 2 },
  });
}

function snapshot(): PalaceSnapshot {
  return {
    palace: {
      id: ORIGINAL,
      name: "Palace of Memory",
      createdAt: "2026-01-01T00:00:00.000Z",
      alias: "pom",
      atlasPath: "/domain",
      editorSnapshot: editorSnapshot(ORIGINAL),
      deletedAt: null,
      purgeAt: null,
      rev: 12,
    },
    canvasObjects: [
      {
        id: "obj-1",
        palaceId: ORIGINAL,
        type: "node",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        zIndex: 0,
        payloadJson: "{}",
      },
    ],
    nodes: [
      {
        id: "node-1",
        objectId: "obj-1",
        title: "Alpha",
        content: "",
        kind: "memory",
        portal: null,
      },
    ],
    edges: [
      {
        id: "edge-1",
        objectId: "obj-2",
        sourceNodeId: "node-1",
        targetNodeId: "node-2",
        castAb: "",
        castCd: "",
        castEf: "",
        castGh: "",
      },
    ],
    routes: [{ id: "route-1", palaceId: ORIGINAL, name: "Main" }],
    loci: [
      {
        id: "locus-1",
        routeId: "route-1",
        nodeId: "node-1",
        orderIndex: 0,
        label: "first",
        interval: 6,
        easeFactor: 2.6,
        nextReviewAt: "2026-10-01T00:00:00.000Z",
        repetitions: 3,
        lastReviewedAt: "2026-09-25T00:00:00.000Z",
      },
    ],
  };
}

describe("forkPalaceSnapshot", () => {
  it("gives the copy a new palace id everywhere the palace is referenced", () => {
    const fork = forkPalaceSnapshot(snapshot(), { newId: "palace-fork", newName: "Copy" });

    expect(fork.palace.id).toBe("palace-fork");
    expect(fork.palace.name).toBe("Copy");
    expect(fork.canvasObjects.every((o) => o.palaceId === "palace-fork")).toBe(true);
    expect(fork.routes.every((r) => r.palaceId === "palace-fork")).toBe(true);
  });

  it("rewrites mpPalaceId inside the tldraw blob", () => {
    // Without this, registerMemoryIdGuard sees shapes belonging to another palace and hands
    // every one of them fresh ids on the next edit — orphaning every locus and its schedule.
    const fork = forkPalaceSnapshot(snapshot(), { newId: "palace-fork", newName: "Copy" });
    const store = JSON.parse(fork.palace.editorSnapshot!).store as Record<
      string,
      { meta: Record<string, unknown> }
    >;

    expect(Object.values(store).map((s) => s.meta.mpPalaceId)).toEqual([
      "palace-fork",
      "palace-fork",
      "palace-fork",
    ]);
  });

  it("leaves portal targets alone, including a portal back to the original palace", () => {
    const fork = forkPalaceSnapshot(snapshot(), { newId: "palace-fork", newName: "Copy" });
    const store = JSON.parse(fork.palace.editorSnapshot!).store as Record<
      string,
      { meta: Record<string, unknown> }
    >;

    expect(store["shape:b"].meta.mpPortalPalaceId).toBe(OTHER);
    // The decisive case: a string replace of the old id would have rewritten this too,
    // silently redirecting the portal at the copy.
    expect(store["shape:c"].meta.mpPortalPalaceId).toBe(ORIGINAL);
  });

  it("shares no row id with the palace it was copied from", () => {
    // canvas_objects, nodes, edges, routes and loci each declare `id TEXT PRIMARY KEY` in
    // db.rs — global keys, not per-palace — so reusing any of them makes saving the copy
    // fail outright with a UNIQUE constraint violation. This is not theoretical: it is what
    // the first real two-device run hit, on canvas_objects.id.
    const source = snapshot();
    const fork = forkPalaceSnapshot(source, { newId: "palace-fork", newName: "Copy" });

    const idsOf = (snap: PalaceSnapshot) => [
      ...snap.canvasObjects.map((o) => o.id),
      ...snap.nodes.map((n) => n.id),
      ...snap.edges.map((e) => e.id),
      ...snap.routes.map((r) => r.id),
      ...snap.loci.map((l) => l.id),
    ];
    const reused = idsOf(fork).filter((id) => idsOf(source).includes(id));
    expect(reused).toEqual([]);
  });

  it("rewires every reference to the new ids, so the copy still hangs together", () => {
    const fork = forkPalaceSnapshot(snapshot(), { newId: "palace-fork", newName: "Copy" });

    const objectIds = new Set(fork.canvasObjects.map((o) => o.id));
    const nodeIds = new Set(fork.nodes.map((n) => n.id));
    const routeIds = new Set(fork.routes.map((r) => r.id));

    expect(fork.nodes.every((n) => objectIds.has(n.objectId))).toBe(true);
    expect(fork.edges.every((e) => nodeIds.has(e.sourceNodeId))).toBe(true);
    // A locus that lost its route or its node is a review schedule pointing at nothing.
    expect(fork.loci.every((l) => routeIds.has(l.routeId))).toBe(true);
    expect(fork.loci.every((l) => nodeIds.has(l.nodeId))).toBe(true);
  });

  it("renumbers the canvas blob to match the rows, not just the palace id", () => {
    // The blob is the source of truth for the canvas. If its mpNodeId/mpObjectId still named
    // the original's rows, the copy would draw shapes bound to another palace's data.
    const fork = forkPalaceSnapshot(snapshot(), { newId: "palace-fork", newName: "Copy" });
    const store = JSON.parse(fork.palace.editorSnapshot!).store as Record<
      string,
      { meta: Record<string, unknown> }
    >;

    expect(store["shape:a"].meta.mpObjectId).toBe(fork.canvasObjects[0].id);
    expect(store["shape:a"].meta.mpNodeId).toBe(fork.nodes[0].id);
    expect(store["shape:c"].meta.mpEdgeId).toBe(fork.edges[0].id);
    // An id the rows never mentioned has nothing to map to and is left alone rather than
    // being blanked.
    expect(store["shape:b"].meta.mpNodeId).toBe("node-2");
  });

  it("preserves the review schedule on the copy", () => {
    const fork = forkPalaceSnapshot(snapshot(), { newId: "palace-fork", newName: "Copy" });
    expect(fork.loci[0]).toMatchObject({
      interval: 6,
      easeFactor: 2.6,
      repetitions: 3,
      nextReviewAt: "2026-10-01T00:00:00.000Z",
    });
  });

  it("starts the copy outside the vault and out of the trash", () => {
    const source = snapshot();
    source.palace.deletedAt = "2026-05-01T00:00:00.000Z";
    const fork = forkPalaceSnapshot(source, { newId: "palace-fork", newName: "Copy" });

    expect(fork.palace.rev).toBe(0);
    expect(fork.palace.deletedAt).toBeNull();
    expect(fork.palace.purgeAt).toBeNull();
  });

  it("does not modify the snapshot it was given", () => {
    const source = snapshot();
    const before = JSON.stringify(source);
    forkPalaceSnapshot(source, { newId: "palace-fork", newName: "Copy" });
    expect(JSON.stringify(source)).toBe(before);
  });

  it("leaves an unparseable blob as-is instead of throwing", () => {
    expect(rewriteBlobPalaceId("{not json", "palace-fork")).toBe("{not json");
    expect(rewriteBlobPalaceId(null, "palace-fork")).toBeNull();
  });
});
