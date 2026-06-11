import type { Editor } from "@tldraw/editor";
import { createMemoryArrow } from "../../../src/canvas/createMemoryShapes";
import { CAST_WHO } from "../../../src/domain/entities/types";
import { loadPalace, resolvePalace } from "../palaceDb";
import { withPalaceMutation } from "../palaceWriter";
import type { ServerContext } from "./shared";
import { resolveNodeRef, shapeIdForEdge, shapeIdForNode, validateCastValue } from "./shared";

export type CastInput = { who?: string; how?: string; what?: string; when?: string };

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
      cast: { who: e.castAb, how: e.castCd, what: e.castEf, when: e.castGh },
    })),
  };
}

export async function edgeCreate(
  ctx: ServerContext,
  args: { palace: string; source: string; target: string; cast?: CastInput; label?: string },
) {
  const cast = validatedCast(args.cast ?? {});
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "edge_create", (m) => {
    const source = resolveNodeRef(m.snapshot.nodes, args.source);
    const target = resolveNodeRef(m.snapshot.nodes, args.target);
    if (source.id === target.id) throw new Error("Self-edges are not supported.");
    const created = createMemoryArrow(
      m.editor as unknown as Editor,
      m.palace.id,
      shapeIdForNode(m.editor, source.id),
      shapeIdForNode(m.editor, target.id),
      source.id,
      target.id,
      { ...cast, label: args.label },
    );
    if (!created) throw new Error("Failed to create the edge arrow (missing shape bounds).");
    m.recordEvent("edge_created", "graph", {
      nodeId: source.id,
      payload: { edgeId: created.edgeId, target: target.title, cast },
    });
    return { edgeId: created.edgeId, source: source.title, target: target.title };
  });
  return { id: result.edgeId, source: result.source, target: result.target, cast: args.cast ?? {}, created: true };
}

export async function edgeUpdate(
  ctx: ServerContext,
  args: { palace: string; edge: string; cast?: CastInput; alias?: string },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "edge_update", (m) => {
    const edge = m.snapshot.edges.find((e) => e.id === args.edge);
    if (!edge) throw new Error(`No edge found with id "${args.edge}". Use edge_list to find ids.`);
    const shapeId = shapeIdForEdge(m.editor, edge.id);
    const meta: Record<string, unknown> = {};
    const props: Record<string, unknown> = {};
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
      // Mirror arrowheadsFromCastWho in createMemoryShapes.ts: Mermaid (peer)
      // renders bidirectional, everything else a plain forward arrow.
      props.arrowheadStart = cast.ab === CAST_WHO[1] ? "arrow" : "none";
      props.arrowheadEnd = "arrow";
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
