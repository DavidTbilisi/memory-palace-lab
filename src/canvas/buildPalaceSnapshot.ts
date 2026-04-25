import type { Editor, TLShape } from "@tldraw/editor";
import type { MemoryEdge, MemoryNode, Palace, CanvasObject } from "../domain/entities/types";
import type { MemoryRoute, Locus } from "../domain/entities/types";
import type { PalaceSnapshot } from "../domain/entities/types";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { resolveMemoryNodeTitle } from "./readShapeText";

function metaOf(shape: TLShape): MemoryPalaceMeta {
  return (shape.meta ?? {}) as MemoryPalaceMeta;
}

export function buildPalaceSnapshot(
  editor: Editor,
  palace: Palace,
  routes: MemoryRoute[],
  loci: Locus[],
): PalaceSnapshot {
  const snap = editor.getSnapshot();
  const editorSnapshot = JSON.stringify(snap);

  const canvasObjects: CanvasObject[] = [];
  const nodes: MemoryNode[] = [];
  const edges: MemoryEdge[] = [];

  const pageIds = editor.getCurrentPageShapeIds();
  for (const shapeId of pageIds) {
    const shape = editor.getShape(shapeId);
    if (!shape) continue;
    const m = metaOf(shape);

    if (shape.type === "geo") {
      if (m.mpNodeId && m.mpObjectId) {
        const b = editor.getShapePageBounds(shape.id);
        if (!b) continue;
        canvasObjects.push({
          id: m.mpObjectId,
          palaceId: palace.id,
          type: "node",
          x: b.x,
          y: b.y,
          width: b.w,
          height: b.h,
          zIndex: 0,
          payloadJson: JSON.stringify({ shapeId: shape.id, shapeType: "geo" }),
        });
        nodes.push({
          id: m.mpNodeId,
          objectId: m.mpObjectId,
          title: resolveMemoryNodeTitle(shape),
          content: m.mpContent ?? "",
        });
      }
    }

    if (shape.type === "arrow") {
      if (m.mpEdgeId && m.mpObjectId && m.mpSourceNodeId && m.mpTargetNodeId) {
        const b = editor.getShapePageBounds(shape.id);
        if (!b) continue;
        canvasObjects.push({
          id: m.mpObjectId,
          palaceId: palace.id,
          type: "edge",
          x: b.x,
          y: b.y,
          width: b.w,
          height: b.h,
          zIndex: 1,
          payloadJson: JSON.stringify({ shapeId: shape.id, shapeType: "arrow" }),
        });
        edges.push({
          id: m.mpEdgeId,
          objectId: m.mpObjectId,
          sourceNodeId: m.mpSourceNodeId,
          targetNodeId: m.mpTargetNodeId,
          castAb: m.castAb ?? "",
          castCd: m.castCd ?? "",
          castEf: m.castEf ?? "",
          castGh: m.castGh ?? "",
        });
      }
    }
  }

  return {
    palace: { ...palace, editorSnapshot },
    canvasObjects,
    nodes,
    edges,
    routes,
    loci,
  };
}
