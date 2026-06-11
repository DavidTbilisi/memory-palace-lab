import type { Editor } from "@tldraw/editor";
import { toRichText } from "@tldraw/tlschema";
import { createGeoMemoryNode } from "../../../src/canvas/createMemoryShapes";
import { loadPalace, resolvePalace } from "../palaceDb";
import { withPalaceMutation } from "../palaceWriter";
import type { ServerContext } from "./shared";
import { nextNodePosition, nodeView, resolveNodeRef, shapeIdForNode } from "./shared";

export function nodeList(ctx: ServerContext, args: { palace: string; query?: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  let nodes = snapshot.nodes;
  if (args.query) {
    const q = args.query.toLowerCase();
    nodes = nodes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }
  return { nodes: nodes.map((n) => nodeView(n, snapshot.canvasObjects)) };
}

export function nodeGet(ctx: ServerContext, args: { palace: string; node: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  const node = resolveNodeRef(snapshot.nodes, args.node);
  const titleOf = (id: string) => snapshot.nodes.find((n) => n.id === id)?.title ?? id;

  const outgoing = snapshot.edges
    .filter((e) => e.sourceNodeId === node.id)
    .map((e) => ({
      edgeId: e.id,
      target: titleOf(e.targetNodeId),
      targetNodeId: e.targetNodeId,
      cast: { who: e.castAb, how: e.castCd, what: e.castEf, when: e.castGh },
    }));
  const incoming = snapshot.edges
    .filter((e) => e.targetNodeId === node.id)
    .map((e) => ({
      edgeId: e.id,
      source: titleOf(e.sourceNodeId),
      sourceNodeId: e.sourceNodeId,
      cast: { who: e.castAb, how: e.castCd, what: e.castEf, when: e.castGh },
    }));
  const routes = snapshot.loci
    .filter((l) => l.nodeId === node.id)
    .map((l) => ({
      routeId: l.routeId,
      routeName: snapshot.routes.find((r) => r.id === l.routeId)?.name ?? l.routeId,
      locusId: l.id,
      orderIndex: l.orderIndex,
      nextReviewAt: l.nextReviewAt,
    }));

  return { ...nodeView(node, snapshot.canvasObjects), outgoing, incoming, routes };
}

export async function nodeCreate(
  ctx: ServerContext,
  args: {
    palace: string;
    title: string;
    content?: string;
    tags?: string[];
    position?: { x: number; y: number };
  },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "node_create", (m) => {
    const point = args.position ?? nextNodePosition(m.editor);
    const created = createGeoMemoryNode(m.editor as unknown as Editor, m.palace.id, point, {
      title: args.title,
      content: args.content ?? "",
    });
    if (args.tags && args.tags.length > 0) {
      m.editor.updateShape({ id: created.shapeId, type: "geo", meta: { mpTags: args.tags } });
    }
    m.recordEvent("node_created", "graph", {
      nodeId: created.nodeId,
      payload: { title: args.title },
    });
    return { nodeId: created.nodeId, position: point };
  });
  return { id: result.nodeId, title: args.title, position: result.position };
}

export async function nodeUpdate(
  ctx: ServerContext,
  args: {
    palace: string;
    node: string;
    title?: string;
    content?: string;
    alias?: string;
    tags?: string[];
  },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "node_update", (m) => {
    const node = resolveNodeRef(m.snapshot.nodes, args.node);
    const shapeId = shapeIdForNode(m.editor, node.id);
    const meta: Record<string, unknown> = {};
    const props: Record<string, unknown> = {};
    if (args.title !== undefined) {
      meta.mpTitle = args.title;
      props.richText = toRichText(args.title);
    }
    if (args.content !== undefined) meta.mpContent = args.content;
    if (args.alias !== undefined) meta.mpAlias = args.alias;
    if (args.tags !== undefined) meta.mpTags = args.tags;
    m.editor.updateShape({
      id: shapeId,
      type: "geo",
      meta,
      ...(Object.keys(props).length > 0 ? { props } : {}),
    });
    m.recordEvent("node_updated", "graph", { nodeId: node.id, payload: { fields: Object.keys(meta) } });
    return { nodeId: node.id };
  });
  return { id: result.nodeId, updated: true };
}

export async function nodeDelete(ctx: ServerContext, args: { palace: string; node: string }) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "node_delete", (m) => {
    const node = resolveNodeRef(m.snapshot.nodes, args.node);
    const shapeId = shapeIdForNode(m.editor, node.id);
    m.editor.deleteShape(shapeId);
    // nodeId goes in the payload: the FK column would reference a row that no
    // longer exists after this save.
    m.recordEvent("node_updated", "graph", {
      payload: { action: "deleted", nodeId: node.id, title: node.title },
    });
    return { nodeId: node.id, title: node.title };
  });
  return { id: result.nodeId, title: result.title, deleted: true, note: "Connected edges and route loci were removed too." };
}
