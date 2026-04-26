import type { Editor } from "@tldraw/editor";
import type { AnalyticsEventType } from "../domain/entities/types";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { plainTextFromRichText, resolveMemoryNodeTitle } from "./readShapeText";

type TrackedNode = {
  nodeId: string;
  title: string;
  content: string;
  kind: string;
  portalPalaceId: string | null;
  portalRouteId: string | null;
  portalNodeId: string | null;
};

type TrackedEdge = {
  edgeKey: string;
  edgeId: string | null;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
  castAb: string;
  castCd: string;
  castEf: string;
  castGh: string;
};

export type SceneAnalyticsSnapshot = {
  nodes: Map<string, TrackedNode>;
  edges: Map<string, TrackedEdge>;
};

export type SceneAnalyticsDiff = {
  eventType: AnalyticsEventType;
  nodeId?: string;
  payload: Record<string, unknown>;
};

function trackedEdgeKey(meta: MemoryPalaceMeta) {
  return meta.mpEdgeId ?? meta.mpObjectId ?? `${meta.mpSourceNodeId ?? "unknown"}->${meta.mpTargetNodeId ?? "unknown"}`;
}

export function captureSceneAnalyticsSnapshot(editor: Editor): SceneAnalyticsSnapshot {
  const nodes = new Map<string, TrackedNode>();
  const edges = new Map<string, TrackedEdge>();

  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!shape) continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;

    if (shape.type === "geo" && meta.mpNodeId) {
      nodes.set(meta.mpNodeId, {
        nodeId: meta.mpNodeId,
        title: resolveMemoryNodeTitle(shape),
        content: meta.mpContent ?? "",
        kind: meta.mpNodeKind ?? "memory",
        portalPalaceId: meta.mpPortalPalaceId ?? null,
        portalRouteId: meta.mpPortalRouteId ?? null,
        portalNodeId: meta.mpPortalNodeId ?? null,
      });
      continue;
    }

    if (shape.type !== "arrow" || !meta.mpSourceNodeId || !meta.mpTargetNodeId) continue;
    const edgeKey = trackedEdgeKey(meta);
    edges.set(edgeKey, {
      edgeKey,
      edgeId: meta.mpEdgeId ?? null,
      sourceNodeId: meta.mpSourceNodeId,
      targetNodeId: meta.mpTargetNodeId,
      label: plainTextFromRichText(shape.props?.richText),
      castAb: meta.castAb ?? "",
      castCd: meta.castCd ?? "",
      castEf: meta.castEf ?? "",
      castGh: meta.castGh ?? "",
    });
  }

  return { nodes, edges };
}

function changedFields(previous: Record<string, unknown>, next: Record<string, unknown>) {
  const fields = new Set<string>([...Object.keys(previous), ...Object.keys(next)]);
  return [...fields].filter((field) => previous[field] !== next[field]);
}

export function diffSceneAnalyticsSnapshots(
  previous: SceneAnalyticsSnapshot | null,
  next: SceneAnalyticsSnapshot,
): SceneAnalyticsDiff[] {
  if (!previous) return [];
  const events: SceneAnalyticsDiff[] = [];

  for (const [nodeId, node] of next.nodes.entries()) {
    const earlier = previous.nodes.get(nodeId);
    if (!earlier) {
      events.push({
        eventType: "node_created",
        nodeId,
        payload: {
          title: node.title,
          kind: node.kind,
          portalPalaceId: node.portalPalaceId,
          portalRouteId: node.portalRouteId,
          portalNodeId: node.portalNodeId,
        },
      });
      continue;
    }
    const fields = changedFields(earlier, node);
    if (fields.length === 0) continue;
    events.push({
      eventType: "node_updated",
      nodeId,
      payload: {
        title: node.title,
        kind: node.kind,
        changedFields: fields,
      },
    });
  }

  for (const [edgeKey, edge] of next.edges.entries()) {
    const earlier = previous.edges.get(edgeKey);
    if (!earlier) {
      events.push({
        eventType: "edge_created",
        nodeId: edge.sourceNodeId,
        payload: {
          edgeId: edge.edgeId,
          sourceNodeId: edge.sourceNodeId,
          targetNodeId: edge.targetNodeId,
          label: edge.label,
          castAb: edge.castAb,
          castCd: edge.castCd,
          castEf: edge.castEf,
          castGh: edge.castGh,
        },
      });
      continue;
    }
    const fields = changedFields(earlier, edge);
    if (fields.length === 0) continue;
    events.push({
      eventType: "edge_updated",
      nodeId: edge.sourceNodeId,
      payload: {
        edgeId: edge.edgeId,
        sourceNodeId: edge.sourceNodeId,
        targetNodeId: edge.targetNodeId,
        label: edge.label,
        castAb: edge.castAb,
        castCd: edge.castCd,
        castEf: edge.castEf,
        castGh: edge.castGh,
        changedFields: fields,
      },
    });
  }

  return events;
}
