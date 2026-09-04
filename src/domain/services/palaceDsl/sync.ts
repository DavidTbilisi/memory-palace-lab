import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import { toRichText } from "@tldraw/tlschema";
import {
  createImportedMemoryNodes,
  createMemoryArrow,
} from "../../../canvas/createMemoryShapes";
import type { MemoryPalaceMeta } from "../../../canvas/memoryMeta";
import { applyPortalRefToMeta } from "../../../canvas/palacePortal";
import { encodeCastEdge } from "../../entities/types";
import type {
  DslApplyResult,
  DslNode,
  DslSnapshot,
} from "./types";

export interface DslApplyOptions {
  layout?: {
    startX: number;
    startY: number;
    gapX: number;
    gapY: number;
    columns: number;
  };
}

interface NodeIndexEntry {
  shapeId: string;
  mpNodeId: string;
  mpObjectId: string;
  meta: MemoryPalaceMeta;
}

interface EdgeIndexEntry {
  shapeId: string;
  meta: MemoryPalaceMeta;
}

const DEFAULT_LAYOUT = {
  startX: 200,
  startY: 180,
  gapX: 240,
  gapY: 150,
  columns: 4,
};

function arraysEqual(a: string[] | undefined, b: string[] | undefined): boolean {
  const aa = a ?? [];
  const bb = b ?? [];
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i += 1) {
    if (aa[i] !== bb[i]) return false;
  }
  return true;
}

function nextNodeMeta(prev: MemoryPalaceMeta, intent: DslNode): MemoryPalaceMeta {
  const withPortal = applyPortalRefToMeta(prev, intent.kind, intent.portal);
  const next: MemoryPalaceMeta = {
    ...withPortal,
    mpTitle: intent.title,
    mpContent: intent.content,
    mpTags: intent.tags,
  };
  // tldraw merges meta partials key by key and copies `undefined` values
  // verbatim, which then fail its JSON validation ("Expected json
  // serializable value, got undefined"). So: set the image when there is
  // one, write `null` to clear one the shape already has, and otherwise
  // leave the key out entirely.
  if (intent.imageUrl) {
    next.mpImageUrl = intent.imageUrl;
  } else if (prev.mpImageUrl) {
    next.mpImageUrl = null;
  } else {
    delete next.mpImageUrl;
  }
  return next;
}

function nodeNeedsUpdate(prev: MemoryPalaceMeta, next: MemoryPalaceMeta): boolean {
  return (
    prev.mpTitle !== next.mpTitle ||
    prev.mpContent !== next.mpContent ||
    prev.mpNodeKind !== next.mpNodeKind ||
    prev.mpPortalPalaceName !== next.mpPortalPalaceName ||
    prev.mpPortalRouteName !== next.mpPortalRouteName ||
    prev.mpPortalNodeId !== next.mpPortalNodeId ||
    (prev.mpImageUrl ?? null) !== (next.mpImageUrl ?? null) ||
    !arraysEqual(prev.mpTags, next.mpTags)
  );
}

export function applyDslToCanvas(
  editor: Editor,
  palaceId: string,
  intent: DslSnapshot,
  options: DslApplyOptions = {},
): DslApplyResult {
  const result: DslApplyResult = {
    added: { nodes: 0, edges: 0, routes: 0, loci: 0 },
    updated: { nodes: 0, edges: 0, routes: 0, loci: 0 },
    deleted: { nodes: 0, edges: 0, routes: 0, loci: 0 },
    errors: [],
  };

  editor.run(() => {
    const nodesByTitle = new Map<string, NodeIndexEntry>();
    const edgesByKey = new Map<string, EdgeIndexEntry>();

    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!shape) continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (meta.mpPalaceId !== palaceId) continue;

      if (
        shape.type === "geo" &&
        meta.mpNodeId &&
        meta.mpObjectId &&
        meta.mpTitle
      ) {
        nodesByTitle.set(meta.mpTitle, {
          shapeId: String(shape.id),
          mpNodeId: meta.mpNodeId,
          mpObjectId: meta.mpObjectId,
          meta,
        });
      }

      if (
        shape.type === "arrow" &&
        meta.mpEdgeId &&
        meta.mpSourceNodeId &&
        meta.mpTargetNodeId
      ) {
        const sig = encodeCastEdge(
          meta.castAb ?? "",
          meta.castCd ?? "",
          meta.castEf ?? "",
          meta.castGh ?? "",
        );
        const key = `${meta.mpSourceNodeId}|${meta.mpTargetNodeId}|${sig}`;
        edgesByKey.set(key, { shapeId: String(shape.id), meta });
      }
    }

    const intentTitles = new Set(intent.nodes.map((n) => n.title));
    const newNodes: DslNode[] = [];
    const updateNodes: DslNode[] = [];
    for (const node of intent.nodes) {
      if (nodesByTitle.has(node.title)) updateNodes.push(node);
      else newNodes.push(node);
    }

    // Delete nodes not in intent (arrows cascade through bindings)
    for (const [title, entry] of [...nodesByTitle.entries()]) {
      if (intentTitles.has(title)) continue;
      editor.deleteShape(entry.shapeId as TLShapeId);
      nodesByTitle.delete(title);
      result.deleted.nodes += 1;
    }

    // Update existing nodes
    for (const node of updateNodes) {
      const existing = nodesByTitle.get(node.title)!;
      const next = nextNodeMeta(existing.meta, node);
      if (!nodeNeedsUpdate(existing.meta, next)) continue;
      editor.updateShape({
        id: existing.shapeId as TLShapeId,
        type: "geo",
        meta: next,
        props: { richText: toRichText(node.title) },
      });
      existing.meta = next;
      result.updated.nodes += 1;
    }

    // Create new nodes via the existing import helper, then post-update for
    // portal/tag/kind metadata that the helper doesn't write.
    if (newNodes.length > 0) {
      const layout = options.layout ?? DEFAULT_LAYOUT;
      const created = createImportedMemoryNodes(
        editor,
        palaceId,
        newNodes.map((n) => ({ title: n.title, content: n.content })),
        {
          start: { x: layout.startX, y: layout.startY },
          columns: layout.columns,
          gapX: layout.gapX,
          gapY: layout.gapY,
        },
      );
      for (let i = 0; i < newNodes.length; i += 1) {
        const node = newNodes[i]!;
        const c = created[i]!;
        const baseShape = editor.getShape(c.shapeId);
        const baseMeta = (baseShape?.meta ?? {}) as MemoryPalaceMeta;
        const next = nextNodeMeta(baseMeta, node);
        editor.updateShape({
          id: c.shapeId,
          type: "geo",
          meta: next,
        });
        nodesByTitle.set(node.title, {
          shapeId: String(c.shapeId),
          mpNodeId: c.nodeId,
          mpObjectId: c.objectId,
          meta: next,
        });
        result.added.nodes += 1;
      }
    }

    // Edge diff: build intent edge keys, then delete stale and create missing
    const intentEdgeKeys = new Set<string>();
    interface IntentEdge {
      sourceTitle: string;
      targetTitle: string;
      cast: { ab: string; cd: string; ef: string; gh: string };
    }
    const intentEdges: IntentEdge[] = [];
    for (const node of intent.nodes) {
      const sourceEntry = nodesByTitle.get(node.title);
      if (!sourceEntry) continue;
      for (const edge of node.edges) {
        const targetEntry = nodesByTitle.get(edge.targetTitle);
        if (!targetEntry) continue;
        const sig = encodeCastEdge(edge.cast.ab, edge.cast.cd, edge.cast.ef, edge.cast.gh);
        const key = `${sourceEntry.mpNodeId}|${targetEntry.mpNodeId}|${sig}`;
        intentEdgeKeys.add(key);
        intentEdges.push({
          sourceTitle: node.title,
          targetTitle: edge.targetTitle,
          cast: edge.cast,
        });
      }
    }

    for (const [key, entry] of [...edgesByKey.entries()]) {
      if (intentEdgeKeys.has(key)) continue;
      if (editor.getShape(entry.shapeId as TLShapeId)) {
        editor.deleteShape(entry.shapeId as TLShapeId);
        result.deleted.edges += 1;
      }
      edgesByKey.delete(key);
    }

    for (const intentEdge of intentEdges) {
      const source = nodesByTitle.get(intentEdge.sourceTitle)!;
      const target = nodesByTitle.get(intentEdge.targetTitle)!;
      const sig = encodeCastEdge(
        intentEdge.cast.ab,
        intentEdge.cast.cd,
        intentEdge.cast.ef,
        intentEdge.cast.gh,
      );
      const key = `${source.mpNodeId}|${target.mpNodeId}|${sig}`;
      if (edgesByKey.has(key)) continue;
      createMemoryArrow(
        editor,
        palaceId,
        source.shapeId,
        target.shapeId,
        source.mpNodeId,
        target.mpNodeId,
        intentEdge.cast,
      );
      result.added.edges += 1;
    }
  });

  return result;
}
