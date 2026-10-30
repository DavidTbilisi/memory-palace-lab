import type { Editor } from "@tldraw/editor";
import { toRichText } from "@tldraw/tlschema";
import { createMemoryArrow, memoryArrowStyle } from "../../../src/canvas/createMemoryShapes";
import type { EdgeKind } from "../../../src/domain/entities/types";
import { confusionLinkBetween } from "../../../src/domain/services/confusion";
import { loadPalace, resolvePalace } from "../palaceDb";
import { withPalaceMutation } from "../palaceWriter";
import type { ServerContext } from "./shared";
import { resolveNodeRef, shapeIdForEdge, shapeIdForNode, validateCastValue } from "./shared";

export type CastInput = { who?: string; how?: string; what?: string; when?: string };

/** "cast" (or "") is an ordinary CAST edge; "confusion" links two look-alike nodes. */
export type EdgeKindInput = "cast" | "confusion" | "";

function edgeKind(input: EdgeKindInput | undefined): EdgeKind {
  return input === "confusion" ? "confusion" : "";
}

const CONFUSION_HAS_NO_CAST = "A confusion link has no CAST values or label; it only says the two nodes look alike.";

function validatedCast(cast: CastInput) {
  return {
    ab: validateCastValue("who", cast.who ?? ""),
    cd: validateCastValue("how", cast.how ?? ""),
    ef: validateCastValue("what", cast.what ?? ""),
    gh: validateCastValue("when", cast.when ?? ""),
  };
}

export function edgeList(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  const titleOf = (id: string) => snapshot.nodes.find((n) => n.id === id)?.title ?? id;
  return {
    edges: snapshot.edges.map((e) => ({
      id: e.id,
      source: titleOf(e.sourceNodeId),
      sourceNodeId: e.sourceNodeId,
      target: titleOf(e.targetNodeId),
      targetNodeId: e.targetNodeId,
      alias: e.alias || undefined,
      kind: e.kind === "confusion" ? "confusion" : "cast",
      cast: { who: e.castAb, how: e.castCd, what: e.castEf, when: e.castGh },
    })),
  };
}

export async function edgeCreate(
  ctx: ServerContext,
  args: { palace: string; source: string; target: string; cast?: CastInput; label?: string; kind?: EdgeKindInput },
) {
  const kind = edgeKind(args.kind);
  if (kind === "confusion" && (args.cast || args.label)) throw new Error(CONFUSION_HAS_NO_CAST);
  const cast = validatedCast(args.cast ?? {});
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "edge_create", (m) => {
    const source = resolveNodeRef(m.snapshot.nodes, args.source);
    const target = resolveNodeRef(m.snapshot.nodes, args.target);
    if (source.id === target.id) throw new Error("Self-edges are not supported.");
    const existing = kind === "confusion" ? confusionLinkBetween(m.snapshot.edges, source.id, target.id) : undefined;
    if (existing) {
      throw new Error(
        `"${source.title}" and "${target.title}" are already linked as a confusion (edge ${existing.id}); a pair has one link.`,
      );
    }
    const created = createMemoryArrow(
      m.editor as unknown as Editor,
      m.palace.id,
      shapeIdForNode(m.editor, source.id),
      shapeIdForNode(m.editor, target.id),
      source.id,
      target.id,
      { ...cast, label: args.label },
      { kind },
    );
    if (!created) throw new Error("Failed to create the edge arrow (missing shape bounds).");
    m.recordEvent("edge_created", "graph", {
      nodeId: source.id,
      payload: { edgeId: created.edgeId, target: target.title, cast, ...(kind ? { kind } : {}) },
    });
    return { edgeId: created.edgeId, source: source.title, target: target.title };
  });
  return {
    id: result.edgeId,
    source: result.source,
    target: result.target,
    kind: kind === "confusion" ? "confusion" : "cast",
    cast: args.cast ?? {},
    created: true,
  };
}

export async function edgeUpdate(
  ctx: ServerContext,
  args: { palace: string; edge: string; cast?: CastInput; alias?: string; kind?: EdgeKindInput },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "edge_update", (m) => {
    const edge = m.snapshot.edges.find((e) => e.id === args.edge);
    if (!edge) throw new Error(`No edge found with id "${args.edge}". Use edge_list to find ids.`);
    const shapeId = shapeIdForEdge(m.editor, edge.id);
    const meta: Record<string, unknown> = {};
    const props: Record<string, unknown> = {};
    const kind = args.kind === undefined ? edgeKind(edge.kind || undefined) : edgeKind(args.kind);
    if (kind === "confusion" && args.cast) throw new Error(CONFUSION_HAS_NO_CAST);
    if (kind === "confusion" && edge.kind !== "confusion") {
      const existing = confusionLinkBetween(
        m.snapshot.edges.filter((e) => e.id !== edge.id),
        edge.sourceNodeId,
        edge.targetNodeId,
      );
      if (existing) throw new Error(`These two nodes are already linked as a confusion (edge ${existing.id}); a pair has one link.`);
      // A confusion link carries no CAST and no label.
      meta.castAb = meta.castCd = meta.castEf = meta.castGh = "";
      props.richText = toRichText("");
    }
    let castWho = edge.castAb;
    if (args.cast) {
      const cast = validatedCast({
        who: args.cast.who ?? edge.castAb,
        how: args.cast.how ?? edge.castCd,
        what: args.cast.what ?? edge.castEf,
        when: args.cast.when ?? edge.castGh,
      });
      meta.castAb = cast.ab;
      meta.castCd = cast.cd;
      meta.castEf = cast.ef;
      meta.castGh = cast.gh;
      castWho = cast.ab;
    }
    if (args.cast || args.kind !== undefined) {
      // One look per kind (createMemoryShapes.ts): a confusion link stays dashed amber with no heads.
      if (args.kind !== undefined) meta.mpEdgeKind = kind === "confusion" ? "confusion" : null;
      Object.assign(props, memoryArrowStyle(kind, kind === "confusion" ? "" : castWho));
    }
    if (args.alias !== undefined) meta.mpAlias = args.alias;
    m.editor.updateShape({ id: shapeId, type: "arrow", meta, props });
    m.recordEvent("edge_updated", "graph", {
      nodeId: edge.sourceNodeId,
      payload: { edgeId: edge.id, fields: Object.keys(meta) },
    });
    return { edgeId: edge.id };
  });
  return { id: result.edgeId, updated: true };
}

export async function edgeDelete(ctx: ServerContext, args: { palace: string; edge: string }) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "edge_delete", (m) => {
    const edge = m.snapshot.edges.find((e) => e.id === args.edge);
    if (!edge) throw new Error(`No edge found with id "${args.edge}". Use edge_list to find ids.`);
    m.editor.deleteShape(shapeIdForEdge(m.editor, edge.id));
    m.recordEvent("edge_updated", "graph", {
      nodeId: edge.sourceNodeId,
      payload: { edgeId: edge.id, action: "deleted" },
    });
    return { edgeId: edge.id };
  });
  return { id: result.edgeId, deleted: true };
}
