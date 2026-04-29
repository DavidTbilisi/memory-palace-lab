import type {
  Locus,
  MemoryEdge,
  PalacePortalRef,
  PalaceSnapshot,
} from "../../entities/types";
import { formatCastCompact } from "./cast";

function formatPortalTarget(p: PalacePortalRef): string | null {
  if (!p.targetPalaceName) return null;
  let s = `/palaces/${p.targetPalaceName}`;
  if (p.targetRouteName) s += `#${p.targetRouteName}`;
  if (p.targetNodeId) s += `@${p.targetNodeId}`;
  return s;
}

export function serializeDsl(snapshot: PalaceSnapshot): string {
  const lines: string[] = [];
  lines.push(`@${snapshot.palace.name}`);
  if (snapshot.palace.atlasPath) {
    lines.push(`@atlas ${snapshot.palace.atlasPath}`);
  }

  const idToTitle = new Map<string, string>();
  for (const n of snapshot.nodes) idToTitle.set(n.id, n.title);

  const edgesBySource = new Map<string, MemoryEdge[]>();
  for (const e of snapshot.edges) {
    const list = edgesBySource.get(e.sourceNodeId) ?? [];
    list.push(e);
    edgesBySource.set(e.sourceNodeId, list);
  }

  for (const node of snapshot.nodes) {
    lines.push("");
    lines.push(node.title);

    if (node.content) {
      for (const piece of node.content.split("\n")) {
        lines.push(`: ${piece}`);
      }
    }

    if (node.kind === "portal" && node.portal) {
      const target = formatPortalTarget(node.portal);
      if (target) lines.push(`@portal ${target}`);
    }

    if (node.tags && node.tags.length > 0) {
      const sorted = [...new Set(node.tags)].sort();
      lines.push(sorted.map((t) => `#${t}`).join(" "));
    }

    const outgoing = edgesBySource.get(node.id) ?? [];
    for (const edge of outgoing) {
      const target = idToTitle.get(edge.targetNodeId) ?? "<unknown>";
      const cast = formatCastCompact({
        ab: edge.castAb,
        cd: edge.castCd,
        ef: edge.castEf,
        gh: edge.castGh,
      });
      lines.push(cast === "0000" ? `>${target}` : `>${target} ${cast}`);
    }
  }

  const lociByRoute = new Map<string, Locus[]>();
  for (const l of snapshot.loci) {
    const list = lociByRoute.get(l.routeId) ?? [];
    list.push(l);
    lociByRoute.set(l.routeId, list);
  }

  for (const route of snapshot.routes) {
    lines.push("");
    lines.push(`/${route.name}`);
    const ordered = (lociByRoute.get(route.id) ?? [])
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex);
    for (let i = 0; i < ordered.length; i += 1) {
      const title = idToTitle.get(ordered[i]!.nodeId) ?? "<unknown>";
      lines.push(`${i + 1} ${title}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
