import type { Editor } from "@tldraw/editor";
import { toRichText } from "@tldraw/tlschema";
import { applyCountShape } from "../../../src/canvas/applyCountShape";
import { createGeoMemoryNode } from "../../../src/canvas/createMemoryShapes";
import { nodeShapeHasLabel } from "../../../src/canvas/memoryNodeShape";
import type { NedfEncoding, NedfSlot, NodeAttribute } from "../../../src/domain/entities/types";
import type { MemoryPalaceMeta } from "../../../src/canvas/memoryMeta";
import { attributeWarnings, normalizeAttributes } from "../../../src/domain/services/attributes";
import { checkGlyph, glyphHolder, glyphTakenMessage } from "../../../src/domain/services/conceptGlyph";
import type { CountShapeKind } from "../../../src/domain/services/countShape";
import { confusionNeighbours, meaningEdges } from "../../../src/domain/services/confusion";
import { normalizeNedf, stopCards, stopNextReviewAt } from "../../../src/domain/services/nedf";
import { loadPalace, resolvePalace } from "../palaceDb";
import { withPalaceMutation } from "../palaceWriter";
import type { ServerContext } from "./shared";
import { nextNodePosition, nodeView, resolveNodeRef, shapeIdForNode } from "./shared";

/**
 * Slots to change on a node. A slot left out keeps its value; `null` or an empty string clears
 * that one slot.
 */
export type NedfPatch = {
  nameHook?: string | null;
  essence?: string | null;
  distinguisher?: { prompt: string; reason: string } | null;
  failure?: { scenario: string; correction: string } | null;
};

function applyNedfPatch(current: NedfEncoding | null, patch: NedfPatch | null | undefined): NedfEncoding | null {
  if (!patch) return current;
  const next: Record<string, unknown> = { ...current };
  for (const slot of Object.keys(patch) as NedfSlot[]) {
    const value = patch[slot];
    if (value === undefined) continue;
    if (value === null || value === "") delete next[slot];
    else next[slot] = value;
  }
  return normalizeNedf(next);
}

/** A concept glyph checked against the palace: one symbol, held by no other node. Throws otherwise. */
function acceptedGlyph(glyph: string, nodes: readonly { id: string; title: string; glyph?: string | null }[], nodeId: string | null): string {
  const check = checkGlyph(glyph);
  if ("error" in check) throw new Error(check.error);
  const holder = glyphHolder(nodes, check.glyph, nodeId);
  if (holder) throw new Error(glyphTakenMessage(check.glyph, holder));
  return check.glyph;
}

/** An attribute as MCP takes it: the name may be left out. */
export type AttributeInput = Omit<NodeAttribute, "name"> & { name?: string };

/** Attribute problems as messages, so a client sees a collision without it being refused. */
function attributeWarningMessages(attributes: NodeAttribute[] | null): string[] | undefined {
  const warnings = attributeWarnings(attributes);
  return warnings.length > 0 ? warnings.map((w) => w.message) : undefined;
}

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

  // Confusion links are not CAST edges; they are listed apart, by the neighbour's title.
  const castEdges = meaningEdges(snapshot.edges);
  const outgoing = castEdges
    .filter((e) => e.sourceNodeId === node.id)
    .map((e) => ({
      edgeId: e.id,
      target: titleOf(e.targetNodeId),
      targetNodeId: e.targetNodeId,
      cast: { who: e.castAb, how: e.castCd, what: e.castEf, when: e.castGh },
    }));
  const incoming = castEdges
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
      nextReviewAt: stopNextReviewAt(l, node.nedf),
      // One schedule per filled NEDF slot; absent for a node reviewed on the stop's own schedule.
      slots: node.nedf
        ? stopCards(l, node.nedf)
            .filter((card) => card.slot !== null)
            .map((card) => ({
              slot: card.slot,
              nextReviewAt: card.schedule.nextReviewAt,
              interval: card.schedule.interval,
              repetitions: card.schedule.repetitions,
            }))
        : undefined,
    }));

  const confusedWith = confusionNeighbours(snapshot.edges, node.id).map((id) => ({ nodeId: id, title: titleOf(id) }));

  return {
    ...nodeView(node, snapshot.canvasObjects),
    outgoing,
    incoming,
    ...(confusedWith.length > 0 ? { confusedWith } : {}),
    routes,
  };
}

export async function nodeCreate(
  ctx: ServerContext,
  args: {
    palace: string;
    title: string;
    content?: string;
    tags?: string[];
    nedf?: NedfPatch | null;
    attributes?: AttributeInput[] | null;
    glyph?: string | null;
    position?: { x: number; y: number };
  },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "node_create", (m) => {
    // Checked before anything is drawn: a refused glyph refuses the whole call.
    const glyph = args.glyph ? acceptedGlyph(args.glyph, m.snapshot.nodes, null) : null;
    const point = args.position ?? nextNodePosition(m.editor);
    const created = createGeoMemoryNode(m.editor as unknown as Editor, m.palace.id, point, {
      title: args.title,
      content: args.content ?? "",
    });
    const meta: Partial<MemoryPalaceMeta> = {};
    if (args.tags && args.tags.length > 0) meta.mpTags = args.tags;
    const nedf = applyNedfPatch(null, args.nedf);
    if (nedf) meta.mpNedf = nedf;
    const attributes = normalizeAttributes(args.attributes);
    if (attributes) meta.mpAttributes = attributes;
    if (glyph) meta.mpGlyph = glyph;
    if (Object.keys(meta).length > 0) m.editor.updateShape({ id: created.shapeId, type: "geo", meta });
    m.recordEvent("node_created", "graph", {
      nodeId: created.nodeId,
      payload: { title: args.title },
    });
    return { nodeId: created.nodeId, position: point, attributes };
  });
  return {
    id: result.nodeId,
    title: args.title,
    position: result.position,
    attributeWarnings: attributeWarningMessages(result.attributes),
  };
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
    nedf?: NedfPatch | null;
    attributes?: AttributeInput[] | null;
    glyph?: string | null;
  },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "node_update", (m) => {
    const node = resolveNodeRef(m.snapshot.nodes, args.node);
    const shapeId = shapeIdForNode(m.editor, node.id);
    const shape = m.editor.getShape(shapeId)!;
    const meta: Record<string, unknown> = {};
    const props: Record<string, unknown> = {};
    if (args.title !== undefined) {
      meta.mpTitle = args.title;
      // An image node keeps its title in meta only; it has no richText prop.
      if (nodeShapeHasLabel(shape)) props.richText = toRichText(args.title);
    }
    if (args.content !== undefined) meta.mpContent = args.content;
    if (args.alias !== undefined) meta.mpAlias = args.alias;
    if (args.tags !== undefined) meta.mpTags = args.tags;
    if (args.nedf !== undefined) {
      const current = normalizeNedf((shape.meta as MemoryPalaceMeta).mpNedf);
      // `null` is the only value that clears meta through tldraw's key-by-key merge.
      meta.mpNedf = args.nedf === null ? null : applyNedfPatch(current, args.nedf);
    }
    // Attributes are replaced whole; `null` or an empty list clears them.
    if (args.attributes !== undefined) meta.mpAttributes = normalizeAttributes(args.attributes);
    // `null` clears the glyph; tldraw merges meta key by key.
    if (args.glyph !== undefined) meta.mpGlyph = args.glyph === null ? null : acceptedGlyph(args.glyph, m.snapshot.nodes, node.id);
    m.editor.updateShape({
      id: shapeId,
      type: shape.type,
      meta,
      ...(Object.keys(props).length > 0 ? { props } : {}),
    });
    m.recordEvent("node_updated", "graph", { nodeId: node.id, payload: { fields: Object.keys(meta) } });
    return { nodeId: node.id, attributes: args.attributes !== undefined ? normalizeAttributes(args.attributes) : null };
  });
  return { id: result.nodeId, updated: true, attributeWarnings: attributeWarningMessages(result.attributes) };
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

/**
 * Lay a node's outgoing targets out as a set around it: on the polygon of their count, or on an
 * ordered ladder. A polygon of more than seven takes the ladder, and the result says why.
 */
export async function nodeCountShape(
  ctx: ServerContext,
  args: { palace: string; node: string; shape?: CountShapeKind },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "node_count_shape", (m) => {
    const node = resolveNodeRef(m.snapshot.nodes, args.node);
    const laid = applyCountShape(m.editor, node.id, args.shape ?? "polygon");
    if (!laid.ok) throw new Error(laid.message);
    m.recordEvent("node_updated", "graph", {
      nodeId: node.id,
      payload: { action: "count_shape", shape: laid.kind, count: laid.count },
    });
    return laid;
  });
  return {
    shape: result.kind,
    count: result.count,
    polygon: result.shapeName ?? undefined,
    note: result.note ?? undefined,
  };
}
