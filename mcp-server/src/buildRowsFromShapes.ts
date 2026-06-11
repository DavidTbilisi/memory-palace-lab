import { nodeKindFromMeta, portalRefFromMeta } from "../../src/canvas/palacePortal";
import { resolveMemoryNodeTitle } from "../../src/canvas/readShapeText";
import type {
  CanvasObject,
  Locus,
  MemoryEdge,
  MemoryNode,
  MemoryRoute,
  Palace,
  PalaceSnapshot,
} from "../../src/domain/entities/types";
import type { MemoryPalaceMeta } from "../../src/canvas/memoryMeta";
import type { SnapshotEditor } from "./snapshotEditor";

/**
 * Headless port of src/canvas/buildPalaceSnapshot.ts: derive the DB row
 * projection (canvas_objects / nodes / edges) from the shape records, so the
 * rows always match what the app itself would write on its next save.
 */
export function buildRowsFromShapes(
  editor: SnapshotEditor,
  palace: Palace,
  routes: MemoryRoute[],
  loci: Locus[],
): PalaceSnapshot {
  const canvasObjects: CanvasObject[] = [];
  const nodes: MemoryNode[] = [];
  const edges: MemoryEdge[] = [];

  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!shape) continue;
    const m = (shape.meta ?? {}) as MemoryPalaceMeta;

    if (shape.type === "geo" && m.mpNodeId && m.mpObjectId) {
      const b = editor.getShapePageBounds(shapeId);
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
        alias: m.mpAlias ?? "",
        content: m.mpContent ?? "",
        kind: nodeKindFromMeta(m),
        portal: portalRefFromMeta(m),
        imageUrl: m.mpImageUrl ?? null,
        tags: m.mpTags ?? [],
      });
    }

    if (shape.type === "arrow" && m.mpEdgeId && m.mpObjectId && m.mpSourceNodeId && m.mpTargetNodeId) {
      const b = editor.getShapePageBounds(shapeId);
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
        alias: m.mpAlias ?? "",
        castAb: m.castAb ?? "",
        castCd: m.castCd ?? "",
        castEf: m.castEf ?? "",
        castGh: m.castGh ?? "",
      });
    }
  }

  return {
    palace: { ...palace, editorSnapshot: editor.serialize() },
    canvasObjects,
    nodes,
    edges,
    routes,
    loci,
  };
}
