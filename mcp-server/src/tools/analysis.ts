import { detectMotifs, groupMotifs, MOTIF_MOVES } from "../../../src/domain/services/cast/castMotifs";
import { selectCrux } from "../../../src/domain/services/cast/crux";
import { analyzeGraph, topByMetric } from "../../../src/domain/services/cast/graphAnalysis";
import { NINE_DIVE } from "../../../src/domain/services/cast/nineDive";
import {
  buildReviewQueue,
  summarizeReviewQueue,
} from "../../../src/domain/services/reviewQueueService";
import { listAnalyticsEvents, loadPalace, resolvePalace } from "../palaceDb";
import type { ServerContext } from "./shared";

function loadSnapshotOrThrow(ctx: ServerContext, palaceRef: string) {
  const palace = resolvePalace(ctx.db, palaceRef);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${palaceRef}" not found.`);
  return snapshot;
}

export function graphAnalyze(ctx: ServerContext, args: { palace: string }) {
  const snapshot = loadSnapshotOrThrow(ctx, args.palace);
  const analysis = analyzeGraph({ nodes: snapshot.nodes, edges: snapshot.edges });
  const titleOf = (id: string) => snapshot.nodes.find((n) => n.id === id)?.title ?? id;
  const withTitles = (entries: Array<{ id: string; value: number }>) =>
    entries.map((e) => ({ nodeId: e.id, title: titleOf(e.id), value: e.value }));

  return {
    nodeCount: analysis.nodeCount,
    edgeCount: analysis.edgeCount,
    topBetweenness: withTitles(topByMetric(analysis.betweenness, 5)),
    topInDegree: withTitles(topByMetric(analysis.inDegree, 5)),
    topOutDegree: withTitles(topByMetric(analysis.outDegree, 5)),
    bridges: analysis.bridges.map((b) => ({
      source: titleOf(b.sourceNodeId),
      target: titleOf(b.targetNodeId),
    })),
    cycles: analysis.sccs
      .filter((scc) => scc.length > 1)
      .map((scc) => scc.map(titleOf)),
    roles: Object.fromEntries(
      Object.entries(analysis.roleByNode)
        .filter(([, role]) => role !== "regular")
        .map(([id, role]) => [titleOf(id), role]),
    ),
  };
}

export function graphCrux(ctx: ServerContext, args: { palace: string }) {
  const snapshot = loadSnapshotOrThrow(ctx, args.palace);
  const analysis = analyzeGraph({ nodes: snapshot.nodes, edges: snapshot.edges });
  const crux = selectCrux(analysis);
  if (!crux) return { crux: null, note: "Graph is empty or has no edges — no crux." };
  const node = snapshot.nodes.find((n) => n.id === crux.nodeId);
  return {
    crux: {
      nodeId: crux.nodeId,
      title: node?.title ?? crux.nodeId,
      reason: crux.reason,
      content: node?.content ?? "",
    },
    nineDive: NINE_DIVE.map((layer) => ({
      layer: layer.layer,
      focus: layer.focus,
      questions: layer.questions,
    })),
  };
}

export function graphMotifs(ctx: ServerContext, args: { palace: string }) {
  const snapshot = loadSnapshotOrThrow(ctx, args.palace);
  const titleOf = (id: string) => snapshot.nodes.find((n) => n.id === id)?.title ?? id;
  const motifs = detectMotifs({ nodes: snapshot.nodes, edges: snapshot.edges });
  const groups = groupMotifs(motifs);
  return {
    motifs: motifs.map((m) => {
      switch (m.kind) {
        case "cascade":
          return { kind: m.kind, nodes: m.nodeIds.map(titleOf), move: MOTIF_MOVES[m.kind] };
        case "diamond":
          return {
            kind: m.kind,
            source: titleOf(m.source),
            branches: [titleOf(m.left), titleOf(m.right)],
            sink: titleOf(m.sink),
            move: MOTIF_MOVES[m.kind],
          };
        case "hubSpoke":
          return {
            kind: m.kind,
            hub: titleOf(m.hub),
            spokes: m.spokes.map(titleOf),
            direction: m.direction,
            move: MOTIF_MOVES[m.kind],
          };
        case "feedbackLoop":
          return { kind: m.kind, nodes: m.nodeIds.map(titleOf), move: MOTIF_MOVES[m.kind] };
        case "bottleneck":
          return {
            kind: m.kind,
            node: titleOf(m.node),
            sides: m.isolatedSides.map((side) => side.map(titleOf)),
            move: MOTIF_MOVES[m.kind],
          };
        case "bipartite":
          return {
            kind: m.kind,
            sideA: m.sideA.map(titleOf),
            sideB: m.sideB.map(titleOf),
            move: MOTIF_MOVES[m.kind],
          };
      }
    }),
    counts: Object.fromEntries(
      Object.entries(groups).map(([kind, list]) => [kind, (list as unknown[]).length]),
    ),
  };
}

export function reviewQueue(ctx: ServerContext, args: { palace: string }) {
  const snapshot = loadSnapshotOrThrow(ctx, args.palace);
  const events = listAnalyticsEvents(ctx.db, { palaceId: snapshot.palace.id });
  const items = buildReviewQueue({
    analyticsEvents: events,
    nodes: snapshot.nodes,
    routes: snapshot.routes,
    palaceId: snapshot.palace.id,
  });
  return { summary: summarizeReviewQueue(items), items };
}

export function analyticsList(
  ctx: ServerContext,
  args: { palace?: string; eventType?: string; limit?: number },
) {
  const palaceId = args.palace ? resolvePalace(ctx.db, args.palace).id : undefined;
  const events = listAnalyticsEvents(ctx.db, {
    palaceId,
    eventType: args.eventType,
    limit: args.limit ?? 100,
  });
  return { events };
}
