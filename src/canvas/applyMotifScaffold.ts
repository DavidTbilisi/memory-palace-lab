import type { Editor } from "@tldraw/editor";
import { createGeoMemoryNode, createMemoryArrow } from "./createMemoryShapes";
import type { MotifScaffold } from "../domain/services/cast/motifTemplates";

/**
 * Materialize a `MotifScaffold` into the tldraw editor: create geo nodes at
 * motif-appropriate positions, then connect them with CAST-signed arrows.
 *
 * Layouts:
 *   - cascade:     horizontal row, left → right
 *   - diamond:     four corners of a diamond
 *   - hubSpoke:    hub centered, spokes ringed around (≤ 6 spokes spaced)
 *   - feedbackLoop: nodes on a circle
 *
 * Returns the created shape/node IDs in scaffold-slot order — useful for
 * tests and follow-up selection.
 */
export type ScaffoldOrigin = { x: number; y: number };

export function applyMotifScaffold(
  editor: Editor,
  palaceId: string,
  scaffold: MotifScaffold,
  origin: ScaffoldOrigin = { x: 400, y: 400 },
): { slot: string; shapeId: string; nodeId: string }[] {
  const positions = layoutFor(scaffold, origin);
  const created: { slot: string; shapeId: string; nodeId: string }[] = [];

  for (const node of scaffold.nodes) {
    const pos = positions.get(node.slot);
    if (!pos) continue;
    const handle = createGeoMemoryNode(editor, palaceId, pos, { title: node.title });
    created.push({ slot: node.slot, shapeId: handle.shapeId, nodeId: handle.nodeId });
  }

  const bySlot = new Map(created.map((c) => [c.slot, c]));
  for (const edge of scaffold.edges) {
    const from = bySlot.get(edge.fromSlot);
    const to = bySlot.get(edge.toSlot);
    if (!from || !to) continue;
    createMemoryArrow(editor, palaceId, from.shapeId, to.shapeId, from.nodeId, to.nodeId, {
      ab: edge.cast.ab,
      cd: edge.cast.cd,
      ef: edge.cast.ef,
      gh: edge.cast.gh,
      label: edge.label,
    });
  }

  return created;
}

function layoutFor(scaffold: MotifScaffold, origin: ScaffoldOrigin): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  const gx = 260;
  const gy = 180;

  switch (scaffold.kind) {
    case "cascade": {
      scaffold.nodes.forEach((node, i) => {
        map.set(node.slot, { x: origin.x + i * gx, y: origin.y });
      });
      return map;
    }
    case "diamond": {
      // src at left, l/r vertically separated in middle, snk at right
      map.set("src", { x: origin.x, y: origin.y });
      map.set("l", { x: origin.x + gx, y: origin.y - gy });
      map.set("r", { x: origin.x + gx, y: origin.y + gy });
      map.set("snk", { x: origin.x + 2 * gx, y: origin.y });
      return map;
    }
    case "hubSpoke": {
      const spokes = scaffold.nodes.slice(1);
      map.set("hub", { x: origin.x, y: origin.y });
      const radius = gx;
      spokes.forEach((node, i) => {
        const angle = (i / spokes.length) * Math.PI * 2 - Math.PI / 2;
        map.set(node.slot, {
          x: origin.x + Math.cos(angle) * radius,
          y: origin.y + Math.sin(angle) * radius,
        });
      });
      return map;
    }
    case "feedbackLoop": {
      const radius = gx * 0.8;
      scaffold.nodes.forEach((node, i) => {
        const angle = (i / scaffold.nodes.length) * Math.PI * 2 - Math.PI / 2;
        map.set(node.slot, {
          x: origin.x + Math.cos(angle) * radius,
          y: origin.y + Math.sin(angle) * radius,
        });
      });
      return map;
    }
    case "bottleneck": {
      // Hourglass: left cluster on the left, choke in the middle, right
      // cluster on the right.
      map.set("la", { x: origin.x - 2 * gx, y: origin.y - gy / 2 });
      map.set("lb", { x: origin.x - gx, y: origin.y + gy / 2 });
      map.set("choke", { x: origin.x, y: origin.y });
      map.set("ra", { x: origin.x + gx, y: origin.y - gy / 2 });
      map.set("rb", { x: origin.x + 2 * gx, y: origin.y + gy / 2 });
      return map;
    }
    case "bipartite": {
      // Two vertical columns: side A on the left, side B on the right.
      const aSlots = scaffold.nodes.filter((n) => n.slot.startsWith("a"));
      const bSlots = scaffold.nodes.filter((n) => n.slot.startsWith("b"));
      aSlots.forEach((node, i) => {
        map.set(node.slot, {
          x: origin.x - gx,
          y: origin.y + (i - (aSlots.length - 1) / 2) * gy,
        });
      });
      bSlots.forEach((node, i) => {
        map.set(node.slot, {
          x: origin.x + gx,
          y: origin.y + (i - (bSlots.length - 1) / 2) * gy,
        });
      });
      return map;
    }
  }
}
