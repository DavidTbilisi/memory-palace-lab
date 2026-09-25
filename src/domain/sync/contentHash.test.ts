import { describe, expect, it } from "vitest";
import type { PalaceSnapshot } from "../entities/types";
import { canonicalPalaceContent, palaceContentHash } from "./contentHash";

function snapshot(overrides: Partial<PalaceSnapshot> = {}): PalaceSnapshot {
  return {
    palace: {
      id: "palace-1",
      name: "Palace",
      createdAt: "2026-01-01T00:00:00.000Z",
      alias: null,
      atlasPath: "/domain",
      editorSnapshot: '{"store":{"shape:a":{"x":1}},"schema":{}}',
      deletedAt: null,
      purgeAt: null,
      rev: 3,
    },
    canvasObjects: [],
    nodes: [],
    edges: [],
    routes: [
      { id: "route-1", palaceId: "palace-1", name: "Main" },
      { id: "route-2", palaceId: "palace-1", name: "Second" },
    ],
    loci: [
      {
        id: "locus-1",
        routeId: "route-1",
        nodeId: "node-1",
        orderIndex: 0,
        label: "first",
        interval: 4,
        easeFactor: 2.5,
        nextReviewAt: "2026-10-01T00:00:00.000Z",
        repetitions: 2,
        lastReviewedAt: null,
      },
    ],
    ...overrides,
  };
}

describe("palaceContentHash", () => {
  it("is stable when rows come back in a different order", async () => {
    const a = snapshot();
    const b = snapshot();
    b.routes = [...b.routes].reverse();

    expect(await palaceContentHash(a)).toBe(await palaceContentHash(b));
  });

  it("ignores the revision counter", async () => {
    // rev inflates on every checkpoint save; only content decides whether a side changed.
    const a = snapshot();
    const b = snapshot();
    b.palace.rev = 9999;
    b.palace.updatedAt = "2099-01-01T00:00:00.000Z";

    expect(await palaceContentHash(a)).toBe(await palaceContentHash(b));
  });

  it("ignores the derived node, edge and canvas-object projection", async () => {
    // Those rows are rebuilt from the tldraw blob on every save by two separate builders
    // (buildPalaceSnapshot and buildRowsFromShapes). Hashing them would turn a projection
    // drift or a tldraw upgrade into a phantom conflict.
    const a = snapshot();
    const b = snapshot({
      nodes: [
        { id: "node-1", objectId: "obj-1", title: "Alpha", content: "", kind: "memory", portal: null },
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
      canvasObjects: [
        {
          id: "obj-1",
          palaceId: "palace-1",
          type: "node",
          x: 5,
          y: 5,
          width: 1,
          height: 1,
          zIndex: 0,
          payloadJson: "{}",
        },
      ],
    });

    expect(await palaceContentHash(a)).toBe(await palaceContentHash(b));
  });

  it("changes when the canvas blob changes", async () => {
    const a = snapshot();
    const b = snapshot();
    b.palace.editorSnapshot = '{"store":{"shape:a":{"x":2}},"schema":{}}';

    expect(await palaceContentHash(a)).not.toBe(await palaceContentHash(b));
  });

  it.each([
    ["name", (s: PalaceSnapshot) => (s.palace.name = "Renamed")],
    ["alias", (s: PalaceSnapshot) => (s.palace.alias = "pom")],
    ["atlas path", (s: PalaceSnapshot) => (s.palace.atlasPath = "/elsewhere")],
    ["trashed state", (s: PalaceSnapshot) => (s.palace.deletedAt = "2026-05-01T00:00:00.000Z")],
    ["route name", (s: PalaceSnapshot) => (s.routes[0].name = "Renamed route")],
    ["route colour", (s: PalaceSnapshot) => (s.routes[0].color = "amber")],
    ["walk direction", (s: PalaceSnapshot) => (s.routes[0].direction = "reverse")],
    ["review setting", (s: PalaceSnapshot) => (s.routes[0].inReview = false)],
    ["route notes", (s: PalaceSnapshot) => (s.routes[0].notes = "Start at the gate")],
    ["stop section", (s: PalaceSnapshot) => (s.loci[0].section = "Hall")],
    ["stop order", (s: PalaceSnapshot) => (s.loci[0].orderIndex = 5)],
  ])("changes when the %s changes", async (_label, mutate) => {
    const before = snapshot();
    const after = snapshot();
    mutate(after);

    expect(await palaceContentHash(after)).not.toBe(await palaceContentHash(before));
  });

  it.each([
    ["interval", (s: PalaceSnapshot) => (s.loci[0].interval = 30)],
    ["ease factor", (s: PalaceSnapshot) => (s.loci[0].easeFactor = 1.8)],
    ["next review", (s: PalaceSnapshot) => (s.loci[0].nextReviewAt = "2027-01-01T00:00:00.000Z")],
    ["repetitions", (s: PalaceSnapshot) => (s.loci[0].repetitions = 9)],
    ["last reviewed", (s: PalaceSnapshot) => (s.loci[0].lastReviewedAt = "2026-09-30T00:00:00.000Z")],
  ])("changes when the %s of a stop changes, so reviews sync", async (_label, mutate) => {
    const before = snapshot();
    const after = snapshot();
    mutate(after);

    expect(await palaceContentHash(after)).not.toBe(await palaceContentHash(before));
  });

  it("produces a hex sha-256 digest", async () => {
    expect(await palaceContentHash(snapshot())).toMatch(/^[0-9a-f]{64}$/);
  });

  it("canonicalises to text that does not depend on object key order", () => {
    const a = snapshot();
    const b = snapshot();
    b.palace = {
      editorSnapshot: a.palace.editorSnapshot,
      purgeAt: null,
      deletedAt: null,
      atlasPath: "/domain",
      alias: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      name: "Palace",
      id: "palace-1",
      rev: 3,
    };

    expect(canonicalPalaceContent(b)).toBe(canonicalPalaceContent(a));
  });
});
