import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type {
  Locus,
  MemoryEdge,
  MemoryNode,
  MemoryRoute,
  Palace,
  PalaceSnapshot,
} from "../../entities/types";
import { parseDsl } from "./parser";
import { serializeDsl } from "./serializer";
import type { DslSnapshot } from "./types";

function fixture(name: string) {
  return readFileSync(resolve(__dirname, "fixtures", name), "utf8");
}

function dslToPalaceSnapshot(dsl: DslSnapshot): PalaceSnapshot {
  const palace: Palace = {
    id: "palace-1",
    name: dsl.palaceName,
    createdAt: "2024-01-01T00:00:00Z",
    atlasPath: dsl.atlasPath,
  };

  const titleToId = new Map<string, string>();
  dsl.nodes.forEach((n, i) => titleToId.set(n.title, `n-${i}`));

  const nodes: MemoryNode[] = dsl.nodes.map((n, i) => ({
    id: `n-${i}`,
    objectId: `o-${i}`,
    title: n.title,
    content: n.content,
    kind: n.kind,
    portal: n.portal,
    tags: n.tags,
  }));

  const edges: MemoryEdge[] = [];
  dsl.nodes.forEach((n, i) => {
    n.edges.forEach((e, j) => {
      const targetId = titleToId.get(e.targetTitle);
      if (!targetId) return;
      edges.push({
        id: `e-${i}-${j}`,
        objectId: `eo-${i}-${j}`,
        sourceNodeId: titleToId.get(n.title)!,
        targetNodeId: targetId,
        castAb: e.cast.ab,
        castCd: e.cast.cd,
        castEf: e.cast.ef,
        castGh: e.cast.gh,
      });
    });
  });

  const routes: MemoryRoute[] = dsl.routes.map((r, i) => ({
    id: `r-${i}`,
    palaceId: "palace-1",
    name: r.name,
  }));

  const loci: Locus[] = [];
  dsl.routes.forEach((r, i) => {
    r.loci.forEach((title, j) => {
      const nodeId = titleToId.get(title);
      if (!nodeId) return;
      loci.push({
        id: `l-${i}-${j}`,
        routeId: `r-${i}`,
        nodeId,
        orderIndex: j,
        label: "",
      });
    });
  });

  return { palace, canvasObjects: [], nodes, edges, routes, loci };
}

describe("serializeDsl", () => {
  it("emits a header-only file for an empty palace", () => {
    const empty: PalaceSnapshot = {
      palace: {
        id: "p",
        name: "Empty",
        createdAt: "2024-01-01T00:00:00Z",
        atlasPath: null,
      },
      canvasObjects: [],
      nodes: [],
      edges: [],
      routes: [],
      loci: [],
    };
    expect(serializeDsl(empty)).toBe("# Palace: Empty\n");
  });

  it("includes @atlas when atlasPath is set", () => {
    const snap: PalaceSnapshot = {
      palace: {
        id: "p",
        name: "P",
        createdAt: "2024-01-01T00:00:00Z",
        atlasPath: "/a/b",
      },
      canvasObjects: [],
      nodes: [],
      edges: [],
      routes: [],
      loci: [],
    };
    expect(serializeDsl(snap)).toBe("# Palace: P\n@atlas /a/b\n");
  });

  it("round-trips the canonical fixture byte-for-byte", () => {
    const text = fixture("mechanics.dsl");
    const { snapshot } = parseDsl(text);
    const palaceSnap = dslToPalaceSnapshot(snapshot);
    expect(serializeDsl(palaceSnap)).toBe(text);
  });

  it("emits tags deduplicated and sorted alphabetically", () => {
    const snap: PalaceSnapshot = {
      palace: {
        id: "p",
        name: "P",
        createdAt: "2024-01-01T00:00:00Z",
        atlasPath: null,
      },
      canvasObjects: [],
      nodes: [
        {
          id: "n-0",
          objectId: "o-0",
          title: "A",
          content: "",
          kind: "memory",
          portal: null,
          tags: ["zebra", "alpha", "alpha", "mango"],
        },
      ],
      edges: [],
      routes: [],
      loci: [],
    };
    const out = serializeDsl(snap);
    expect(out).toContain("\n  #alpha #mango #zebra\n");
  });

  it("emits CAST in compact form regardless of input axis names", () => {
    const snap: PalaceSnapshot = {
      palace: {
        id: "p",
        name: "P",
        createdAt: "2024-01-01T00:00:00Z",
        atlasPath: null,
      },
      canvasObjects: [],
      nodes: [
        {
          id: "n-0",
          objectId: "o-0",
          title: "A",
          content: "",
          kind: "memory",
          portal: null,
        },
        {
          id: "n-1",
          objectId: "o-1",
          title: "B",
          content: "",
          kind: "memory",
          portal: null,
        },
      ],
      edges: [
        {
          id: "e-0",
          objectId: "eo-0",
          sourceNodeId: "n-0",
          targetNodeId: "n-1",
          castAb: "Mermaid",
          castCd: "Flowing",
          castEf: "",
          castGh: "Blue ocean",
        },
      ],
      routes: [],
      loci: [],
    };
    const out = serializeDsl(snap);
    expect(out).toContain("-> B  ::2202");
  });

  it("emits a route block with ordered loci", () => {
    const snap: PalaceSnapshot = {
      palace: {
        id: "p",
        name: "P",
        createdAt: "2024-01-01T00:00:00Z",
        atlasPath: null,
      },
      canvasObjects: [],
      nodes: [
        { id: "n-0", objectId: "o-0", title: "A", content: "", kind: "memory", portal: null },
        { id: "n-1", objectId: "o-1", title: "B", content: "", kind: "memory", portal: null },
      ],
      edges: [],
      routes: [{ id: "r-0", palaceId: "p", name: "Walk" }],
      loci: [
        { id: "l-0", routeId: "r-0", nodeId: "n-1", orderIndex: 1, label: "" },
        { id: "l-1", routeId: "r-0", nodeId: "n-0", orderIndex: 0, label: "" },
      ],
    };
    const out = serializeDsl(snap);
    expect(out).toContain(':: Route "Walk"\n  1. A\n  2. B\n');
  });
});
