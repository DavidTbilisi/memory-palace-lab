import type {
  Locus,
  MemoryEdge,
  MemoryNode,
  MemoryRoute,
  Palace,
  PalaceSnapshot,
} from "../../entities/types";
import type { DslSnapshot } from "./types";

export function dslToPalaceSnapshot(dsl: DslSnapshot): PalaceSnapshot {
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

export function stripSourceLines(dsl: DslSnapshot): DslSnapshot {
  return {
    palaceName: dsl.palaceName,
    atlasPath: dsl.atlasPath,
    nodes: dsl.nodes.map((n) => ({
      ...n,
      sourceLine: 0,
      edges: n.edges.map((e) => ({ ...e, sourceLine: 0 })),
    })),
    routes: dsl.routes.map((r) => ({ ...r, sourceLine: 0 })),
    aliases: dsl.aliases.map((a) => ({ ...a, sourceLine: 0 })),
  };
}
