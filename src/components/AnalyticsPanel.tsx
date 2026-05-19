import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BarChart3, Brain, Clock3, Network, Settings2, ShieldCheck } from "lucide-react";
import type { AnalyticsEvent } from "../domain/entities/types";
import { humanizeAnalyticsEventType, parseAnalyticsPayload, summarizeAnalytics } from "../domain/services/analyticsService";
import { analyzeGraph, topByMetric } from "../domain/services/cast/graphAnalysis";
import { MOTIF_MOVES, detectMotifs, groupMotifs } from "../domain/services/cast/castMotifs";
import {
  palaceSignature,
  topSimilarPalaces,
  type PalaceSignature,
} from "../domain/services/cast/palaceSimilarity";
import {
  recordsForPalace,
  topMatchingAARs,
  type AARSignatureSnapshot,
} from "../domain/services/cast/aarRecords";
import { CloseAARDialog } from "./CloseAARDialog";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { buildReviewHeatmap, buildRetentionSeries, formatDayKeyLabel, retentionTrendDown } from "../domain/services/reviewMetrics";
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

const AI_KEY_STORAGE = "mp-ai-anthropic-key";

function formatEventDetail(event: AnalyticsEvent) {
  const payload = parseAnalyticsPayload(event);
  if (event.eventType === "walk_recall_rated") {
    const rating = typeof payload.rating === "string" ? payload.rating : "unrated";
    const latency = typeof payload.timeToRevealMs === "number" ? `${payload.timeToRevealMs} ms` : "no timer";
    return `${rating} - ${latency}`;
  }
  if (event.eventType === "walk_answer_revealed") {
    return typeof payload.timeToRevealMs === "number" ? `${payload.timeToRevealMs} ms to reveal` : "answer revealed";
  }
  if (event.eventType === "node_created" || event.eventType === "node_updated") {
    return typeof payload.title === "string" && payload.title.trim() ? payload.title : "memory node";
  }
  if (event.eventType === "edge_created" || event.eventType === "edge_updated") {
    return typeof payload.label === "string" && payload.label.trim() ? payload.label : "CAST edge";
  }
  if (event.eventType === "route_created") {
    return typeof payload.name === "string" && payload.name.trim() ? payload.name : "route";
  }
  if (event.eventType === "system_run_materialized") {
    return typeof payload.pipelineTitle === "string" ? payload.pipelineTitle : "theSystem run";
  }
  return typeof payload.source === "string" ? payload.source : "local event";
}

function StatCard({
  icon,
  label,
  value,
  tone = "zinc",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "zinc" | "violet" | "emerald";
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet-800/60 bg-violet-950/30"
      : tone === "emerald"
        ? "border-emerald-800/60 bg-emerald-950/30"
        : "border-zinc-800 bg-zinc-900/40";

  return (
    <div className={`rounded-md border p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

function retentionPath(points: Array<{ averageScorePct: number }>, width: number, height: number, padding = 24) {
  if (points.length === 0) return "";
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  return points
    .map((point, index) => {
      const x = padding + (points.length === 1 ? 0 : (index / (points.length - 1)) * usableWidth);
      const y = padding + (1 - point.averageScorePct / 100) * usableHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function heatmapTone(count: number) {
  if (count <= 0) return "bg-zinc-900";
  if (count <= 3) return "bg-emerald-900/60";
  if (count <= 9) return "bg-emerald-600/70";
  return "bg-emerald-400";
}

export function AnalyticsPanel() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const loci = usePalaceStore((s) => s.loci);
  const dailyReviewGoal = usePalaceStore((s) => s.dailyReviewGoal);
  const setDailyReviewGoal = usePalaceStore((s) => s.setDailyReviewGoal);

  const [selectedPalaceFilter, setSelectedPalaceFilter] = useState<string>("all");
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>("all");
  const [hoveredDayKey, setHoveredDayKey] = useState<string | null>(null);
  const [anthropicKey, setAnthropicKey] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(AI_KEY_STORAGE) ?? "",
  );

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const trimmed = anthropicKey.trim();
    if (!trimmed) {
      window.localStorage.removeItem(AI_KEY_STORAGE);
      return;
    }
    window.localStorage.setItem(AI_KEY_STORAGE, trimmed);
  }, [anthropicKey]);

  const allSummary = useMemo(() => summarizeAnalytics(analyticsEvents), [analyticsEvents]);
  const recentEvents = useMemo(() => analyticsEvents.slice(0, 12), [analyticsEvents]);
  const filter = useMemo(
    () => ({
      palaceId: selectedPalaceFilter === "all" ? undefined : selectedPalaceFilter,
      routeId: selectedRouteFilter === "all" ? undefined : selectedRouteFilter,
    }),
    [selectedPalaceFilter, selectedRouteFilter],
  );

  const retentionSeries = useMemo(() => buildRetentionSeries(analyticsEvents, 30, filter), [analyticsEvents, filter]);
  const trendDown = useMemo(() => retentionTrendDown(retentionSeries), [retentionSeries]);
  const heatmapCells = useMemo(() => buildReviewHeatmap(analyticsEvents, 52, new Date().toISOString(), filter), [analyticsEvents, filter]);
  const hoveredCell = useMemo(() => heatmapCells.find((cell) => cell.dayKey === hoveredDayKey) ?? null, [heatmapCells, hoveredDayKey]);

  const dueCount = useMemo(() => {
    const nowIso = new Date().toISOString();
    const nowMs = Date.parse(nowIso);
    return loci
      .map((locus) => normalizeLocusSchedule(locus, nowIso))
      .filter((locus) => Date.parse(locus.nextReviewAt ?? nowIso) <= nowMs).length;
  }, [loci]);

  const averageInterval = useMemo(() => {
    if (loci.length === 0) return null;
    const intervals = loci.map((locus) => normalizeLocusSchedule(locus).interval ?? 0).filter((value) => value > 0);
    if (intervals.length === 0) return null;
    return Math.round(intervals.reduce((total, value) => total + value, 0) / intervals.length);
  }, [loci]);

  const routeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const event of analyticsEvents) {
      if (event.routeId) set.add(event.routeId);
    }
    return [...set].sort();
  }, [analyticsEvents]);

  const palaceOptions = useMemo(() => {
    const set = new Set<string>();
    for (const event of analyticsEvents) {
      if (event.palaceId) set.add(event.palaceId);
    }
    return [...set].sort();
  }, [analyticsEvents]);

  const palaceNodes = usePalaceStore((s) => s.nodes);
  const palaceEdges = usePalaceStore((s) => s.edges);
  const graphAnalysis = useMemo(
    () =>
      analyzeGraph({
        nodes: palaceNodes.map((n) => ({ id: n.id })),
        edges: palaceEdges.map((e) => ({ sourceNodeId: e.sourceNodeId, targetNodeId: e.targetNodeId })),
      }),
    [palaceNodes, palaceEdges],
  );
  const nodeTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of palaceNodes) map.set(n.id, n.title || "Untitled");
    return map;
  }, [palaceNodes]);
  const topHubs = useMemo(() => topByMetric(graphAnalysis.inDegree, 3), [graphAnalysis.inDegree]);
  const topBetween = useMemo(() => topByMetric(graphAnalysis.betweenness, 3), [graphAnalysis.betweenness]);
  const largestScc = useMemo(() => {
    let largest = 0;
    for (const c of graphAnalysis.sccs) if (c.length > largest) largest = c.length;
    return largest;
  }, [graphAnalysis.sccs]);
  const nonTrivialSccCount = useMemo(
    () => graphAnalysis.sccs.filter((c) => c.length > 1).length,
    [graphAnalysis.sccs],
  );
  const motifs = useMemo(
    () =>
      detectMotifs({
        nodes: palaceNodes.map((n) => ({ id: n.id })),
        edges: palaceEdges.map((e) => ({ sourceNodeId: e.sourceNodeId, targetNodeId: e.targetNodeId })),
      }),
    [palaceNodes, palaceEdges],
  );
  const motifGroups = useMemo(() => groupMotifs(motifs), [motifs]);
  const currentSignature = useMemo<PalaceSignature | null>(() => {
    if (!currentPalace) return null;
    return palaceSignature(currentPalace.id, currentPalace.name, graphAnalysis, motifGroups);
  }, [currentPalace, graphAnalysis, motifGroups]);

  const palaces = usePalaceStore((s) => s.palaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const [otherSignatures, setOtherSignatures] = useState<PalaceSignature[]>([]);
  const [comparisonFrom, setComparisonFrom] = useState<PalaceSignature | null>(null);

  const onClickSimilarPalace = (target: PalaceSignature) => {
    if (!currentSignature) return;
    setComparisonFrom(currentSignature);
    void openPalace(target.palaceId);
  };

  const sharedMotifKinds = useMemo(() => {
    if (!comparisonFrom || !currentSignature) return [] as string[];
    if (comparisonFrom.palaceId === currentSignature.palaceId) return [];
    const shared: string[] = [];
    for (const kind of comparisonFrom.motifKindsPresent) {
      if (currentSignature.motifKindsPresent.has(kind)) shared.push(kind);
    }
    return shared;
  }, [comparisonFrom, currentSignature]);

  const showComparisonBanner =
    comparisonFrom !== null &&
    currentSignature !== null &&
    comparisonFrom.palaceId !== currentSignature.palaceId;

  const aarRecords = usePalaceStore((s) => s.aarRecords);
  const aarRecordsLoaded = usePalaceStore((s) => s.aarRecordsLoaded);
  const loadAARRecords = usePalaceStore((s) => s.loadAARRecords);
  const appendAARRecord = usePalaceStore((s) => s.appendAARRecord);
  const [aarOpen, setAarOpen] = useState(false);
  const [focusedAARId, setFocusedAARId] = useState<string | null>(null);
  const [dismissedAssessForPalaceId, setDismissedAssessForPalaceId] = useState<string | null>(null);

  useEffect(() => {
    if (!aarRecordsLoaded) loadAARRecords();
  }, [aarRecordsLoaded, loadAARRecords]);

  const currentPalaceAARs = useMemo(
    () => (currentPalace ? recordsForPalace(aarRecords, currentPalace.id) : []),
    [aarRecords, currentPalace],
  );
  const relatedAARs = useMemo(() => {
    if (!currentSignature) return [];
    return topMatchingAARs(currentSignature, aarRecords, {
      limit: 3,
      excludePalaceId: currentSignature.palaceId,
    });
  }, [currentSignature, aarRecords]);

  const onClickRelatedAAR = (record: { id: string; palaceId: string }) => {
    if (!currentSignature) return;
    setComparisonFrom(currentSignature);
    setFocusedAARId(record.id);
    void openPalace(record.palaceId);
  };

  const ASSESS_BANNER_THRESHOLD = 0.7;
  const assessHint = useMemo(() => {
    if (!currentPalace || relatedAARs.length === 0) return null;
    const top = relatedAARs[0]!;
    if (top.score < ASSESS_BANNER_THRESHOLD) return null;
    if (dismissedAssessForPalaceId === currentPalace.id) return null;
    return top;
  }, [currentPalace, relatedAARs, dismissedAssessForPalaceId]);

  // When a focus target appears, scroll its Past-AAR row into view and clear
  // the focus state after a short window so the highlight fades.
  useEffect(() => {
    if (!focusedAARId) return;
    const handle = window.setTimeout(() => {
      const el = document.querySelector(`[data-aar-id="${focusedAARId}"]`);
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 250);
    const clear = window.setTimeout(() => setFocusedAARId(null), 4000);
    return () => {
      window.clearTimeout(handle);
      window.clearTimeout(clear);
    };
  }, [focusedAARId, currentPalaceAARs.length]);

  const aarSignatureSnapshot = useMemo<AARSignatureSnapshot>(() => {
    return {
      nodeCount: graphAnalysis.nodeCount,
      edgeCount: graphAnalysis.edgeCount,
      motifKindsPresent: currentSignature
        ? [...currentSignature.motifKindsPresent]
        : [],
      motifCounts: {
        cascade: motifGroups.cascade.length,
        diamond: motifGroups.diamond.length,
        hubSpoke: motifGroups.hubSpoke.length,
        feedbackLoop: motifGroups.feedbackLoop.length,
        bottleneck: motifGroups.bottleneck.length,
        bipartite: motifGroups.bipartite.length,
      },
      features: currentSignature ? [...currentSignature.features] : [],
    };
  }, [graphAnalysis, motifGroups, currentSignature]);

  useEffect(() => {
    if (!currentPalace) {
      setOtherSignatures([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const repo = getPalaceRepository();
      const sigs: PalaceSignature[] = [];
      for (const palace of palaces) {
        if (palace.id === currentPalace.id) continue;
        try {
          const snap = await repo.loadPalace(palace.id);
          if (!snap) continue;
          const input = {
            nodes: snap.nodes.map((n) => ({ id: n.id })),
            edges: snap.edges.map((e) => ({ sourceNodeId: e.sourceNodeId, targetNodeId: e.targetNodeId })),
          };
          const analysis = analyzeGraph(input);
          const groups = groupMotifs(detectMotifs(input));
          sigs.push(palaceSignature(palace.id, palace.name, analysis, groups));
        } catch {
          // skip palaces that fail to load
        }
      }
      if (!cancelled) setOtherSignatures(sigs);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPalace, palaces]);

  const similarPalaces = useMemo(() => {
    if (!currentSignature) return [];
    return topSimilarPalaces(currentSignature, otherSignatures, 3);
  }, [currentSignature, otherSignatures]);

  const motifTotal =
    motifGroups.cascade.length +
    motifGroups.diamond.length +
    motifGroups.hubSpoke.length +
    motifGroups.feedbackLoop.length +
    motifGroups.bottleneck.length +
    motifGroups.bipartite.length;
  const renderTitle = (id: string) => nodeTitleById.get(id) ?? id;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BarChart3 className="h-4 w-4" />
          Insights
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Local-first telemetry for encoding and retrieval. This dashboard includes retention trends, consistency
          heatmaps, and scheduling health.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        {assessHint && currentPalace ? (
          <section
            aria-label="You have seen this shape before"
            className="mb-3 flex items-start justify-between gap-3 rounded-md border border-fuchsia-500/50 bg-fuchsia-900/30 p-3 text-sm text-fuchsia-100"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-fuchsia-200">
                <span className="rounded bg-fuchsia-500/30 px-1.5 py-0.5 text-fuchsia-50">
                  Assess · seen this shape before
                </span>
                <span className="text-fuchsia-300/80">
                  {Math.round(assessHint.score * 100)}% match · from{" "}
                  {assessHint.record.palaceName}
                </span>
              </div>
              <div className="mt-1 font-medium text-fuchsia-50">
                {assessHint.record.takeaway || "(no takeaway — open the source palace)"}
              </div>
              {assessHint.record.adjustment ? (
                <div className="mt-0.5 text-xs text-fuchsia-100/90">
                  <span className="text-fuchsia-300">Next time:</span>{" "}
                  {assessHint.record.adjustment}
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => onClickRelatedAAR(assessHint.record)}
              >
                Jump to source
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                aria-label="Dismiss"
                onClick={() => setDismissedAssessForPalaceId(currentPalace.id)}
              >
                ×
              </Button>
            </div>
          </section>
        ) : null}
        <div className="grid gap-3 md:grid-cols-5">
          <StatCard icon={<Activity className="h-3.5 w-3.5" />} label="Total events" value={String(allSummary.totalEvents)} />
          <StatCard
            icon={<Brain className="h-3.5 w-3.5" />}
            label="Review ratings"
            value={String(allSummary.countsByType.walk_recall_rated ?? 0)}
            tone="violet"
          />
          <StatCard
            icon={<Clock3 className="h-3.5 w-3.5" />}
            label="Avg reveal time"
            value={allSummary.averageRecallLatencyMs === null ? "n/a" : `${allSummary.averageRecallLatencyMs} ms`}
            tone="emerald"
          />
          <StatCard icon={<Clock3 className="h-3.5 w-3.5" />} label="Due loci" value={String(dueCount)} />
          <StatCard
            icon={<Clock3 className="h-3.5 w-3.5" />}
            label="Avg interval"
            value={averageInterval === null ? "n/a" : `${averageInterval}d`}
          />
        </div>

        <section
          aria-label="Step 0 graph shape"
          className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3"
        >
          <div className="flex items-center justify-between gap-2 text-sm font-medium text-zinc-100">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-violet-300" />
              Graph shape (Step 0)
            </div>
            {currentPalace ? (
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => setAarOpen(true)}
                title="Close — capture an after-action review for this palace"
              >
                Close (AAR)
              </Button>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Before encoding scenes, see the topology. Hubs anchor recall; bridges flag fragile cross-cluster
            connections; SCCs are feedback loops worth special handling.
          </p>
          {graphAnalysis.nodeCount === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
              No nodes in this palace yet. Add nodes and edges to see the graph shape.
            </div>
          ) : (
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded border border-zinc-800 bg-zinc-950/40 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Size</div>
                <div className="mt-1 text-sm text-zinc-100">
                  {graphAnalysis.nodeCount} nodes · {graphAnalysis.edgeCount} edges
                </div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Top hubs (in-degree)</div>
                {topHubs.length === 0 ? (
                  <div className="mt-1 text-xs text-zinc-500">No incoming edges yet.</div>
                ) : (
                  <ul className="mt-1 space-y-0.5 text-xs text-zinc-200">
                    {topHubs.map((h) => (
                      <li key={h.id}>
                        <span className="text-violet-300">{h.value}</span> ← {nodeTitleById.get(h.id) ?? h.id}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Top betweenness</div>
                {topBetween.length === 0 ? (
                  <div className="mt-1 text-xs text-zinc-500">No paths through any node yet.</div>
                ) : (
                  <ul className="mt-1 space-y-0.5 text-xs text-zinc-200">
                    {topBetween.map((b) => (
                      <li key={b.id}>
                        <span className="text-emerald-300">{b.value.toFixed(1)}</span>{" "}
                        {nodeTitleById.get(b.id) ?? b.id}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Loops & bridges</div>
                <div className="mt-1 space-y-0.5 text-xs text-zinc-200">
                  <div>
                    <span className="text-amber-300">{graphAnalysis.bridges.length}</span> bridge
                    {graphAnalysis.bridges.length === 1 ? "" : "s"}
                  </div>
                  <div>
                    <span className="text-amber-300">{nonTrivialSccCount}</span> feedback loop
                    {nonTrivialSccCount === 1 ? "" : "s"}
                    {largestScc > 1 ? ` · largest ${largestScc}` : ""}
                  </div>
                </div>
              </div>
              {graphAnalysis.bridges.length > 0 ? (
                <div className="md:col-span-2 lg:col-span-4 rounded border border-amber-800/40 bg-amber-950/20 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-amber-200">Bridge edges</div>
                  <ul className="mt-1 grid gap-0.5 text-xs text-amber-100/90 sm:grid-cols-2">
                    {graphAnalysis.bridges.map((b) => (
                      <li key={`${b.sourceNodeId}->${b.targetNodeId}`}>
                        {nodeTitleById.get(b.sourceNodeId) ?? b.sourceNodeId}
                        {" "}↔{" "}
                        {nodeTitleById.get(b.targetNodeId) ?? b.targetNodeId}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {motifTotal > 0 ? (
                <div
                  aria-label="Detected motifs"
                  className="md:col-span-2 lg:col-span-4 rounded border border-violet-800/40 bg-violet-950/20 p-2"
                >
                  <div className="text-[11px] uppercase tracking-wide text-violet-200">
                    Motifs · {motifTotal}
                  </div>
                  <div className="mt-1 grid gap-2 text-xs text-violet-100/90 md:grid-cols-2">
                    {motifGroups.cascade.length > 0 ? (
                      <div>
                        <div className="font-medium text-violet-200">
                          Cascades ({motifGroups.cascade.length})
                        </div>
                        <div className="mt-0.5 text-[11px] italic text-violet-300/80">
                          {MOTIF_MOVES.cascade.label} — {MOTIF_MOVES.cascade.hint}
                        </div>
                        <ul className="mt-0.5 space-y-0.5">
                          {motifGroups.cascade.map((m, i) => (
                            <li key={`cas-${i}`}>{m.nodeIds.map(renderTitle).join(" → ")}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {motifGroups.diamond.length > 0 ? (
                      <div>
                        <div className="font-medium text-violet-200">
                          Diamonds ({motifGroups.diamond.length})
                        </div>
                        <div className="mt-0.5 text-[11px] italic text-violet-300/80">
                          {MOTIF_MOVES.diamond.label} — {MOTIF_MOVES.diamond.hint}
                        </div>
                        <ul className="mt-0.5 space-y-0.5">
                          {motifGroups.diamond.map((m, i) => (
                            <li key={`dia-${i}`}>
                              {renderTitle(m.source)} ⇉ {renderTitle(m.left)}/{renderTitle(m.right)} ⇉{" "}
                              {renderTitle(m.sink)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {motifGroups.hubSpoke.length > 0 ? (
                      <div>
                        <div className="font-medium text-violet-200">
                          Hub-spokes ({motifGroups.hubSpoke.length})
                        </div>
                        <div className="mt-0.5 text-[11px] italic text-violet-300/80">
                          {MOTIF_MOVES.hubSpoke.label} — {MOTIF_MOVES.hubSpoke.hint}
                        </div>
                        <ul className="mt-0.5 space-y-0.5">
                          {motifGroups.hubSpoke.map((m, i) => (
                            <li key={`hub-${i}`}>
                              {m.direction === "out"
                                ? `${renderTitle(m.hub)} → ${m.spokes.map(renderTitle).join(", ")}`
                                : `${m.spokes.map(renderTitle).join(", ")} → ${renderTitle(m.hub)}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {motifGroups.feedbackLoop.length > 0 ? (
                      <div>
                        <div className="font-medium text-violet-200">
                          Feedback loops ({motifGroups.feedbackLoop.length})
                        </div>
                        <div className="mt-0.5 text-[11px] italic text-violet-300/80">
                          {MOTIF_MOVES.feedbackLoop.label} — {MOTIF_MOVES.feedbackLoop.hint}
                        </div>
                        <ul className="mt-0.5 space-y-0.5">
                          {motifGroups.feedbackLoop.map((m, i) => (
                            <li key={`loop-${i}`}>{m.nodeIds.map(renderTitle).join(" → ")} →</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {motifGroups.bottleneck.length > 0 ? (
                      <div>
                        <div className="font-medium text-violet-200">
                          Bottlenecks ({motifGroups.bottleneck.length})
                        </div>
                        <div className="mt-0.5 text-[11px] italic text-violet-300/80">
                          {MOTIF_MOVES.bottleneck.label} — {MOTIF_MOVES.bottleneck.hint}
                        </div>
                        <ul className="mt-0.5 space-y-0.5">
                          {motifGroups.bottleneck.map((m, i) => (
                            <li key={`btl-${i}`}>
                              <span className="text-violet-200">{renderTitle(m.node)}</span>
                              {" "}splits into{" "}
                              {m.isolatedSides
                                .map((side) => `{${side.map(renderTitle).join(", ")}}`)
                                .join(" / ")}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {motifGroups.bipartite.length > 0 ? (
                      <div>
                        <div className="font-medium text-violet-200">
                          Bipartite ({motifGroups.bipartite.length})
                        </div>
                        <div className="mt-0.5 text-[11px] italic text-violet-300/80">
                          {MOTIF_MOVES.bipartite.label} — {MOTIF_MOVES.bipartite.hint}
                        </div>
                        <ul className="mt-0.5 space-y-0.5">
                          {motifGroups.bipartite.map((m, i) => (
                            <li key={`bip-${i}`}>
                              {`{${m.sideA.map(renderTitle).join(", ")}}`} ↔{" "}
                              {`{${m.sideB.map(renderTitle).join(", ")}}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {similarPalaces.length > 0 ? (
                <div
                  aria-label="Similar palaces by graph shape"
                  className="md:col-span-2 lg:col-span-4 rounded border border-emerald-800/40 bg-emerald-950/20 p-2"
                >
                  <div className="text-[11px] uppercase tracking-wide text-emerald-200">
                    Similar palaces · reduce to a known problem
                  </div>
                  <div className="mt-0.5 text-[11px] italic text-emerald-300/80">
                    Click to jump — the strategies that worked there may transfer here.
                  </div>
                  <ul className="mt-1 grid gap-0.5 text-xs text-emerald-100/90 sm:grid-cols-2">
                    {similarPalaces.map((entry) => (
                      <li key={entry.signature.palaceId}>
                        <button
                          type="button"
                          onClick={() => onClickSimilarPalace(entry.signature)}
                          className="group w-full rounded px-1 py-0.5 text-left hover:bg-emerald-800/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                        >
                          <span className="text-emerald-300">
                            {Math.round(entry.score * 100)}%
                          </span>{" "}
                          <span className="font-medium underline-offset-2 group-hover:underline">
                            {entry.signature.palaceName}
                          </span>{" "}
                          <span className="text-emerald-100/70">
                            ({entry.signature.nodeCount}n · {entry.signature.edgeCount}e)
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {showComparisonBanner ? (
                <div
                  role="status"
                  aria-label="Comparison banner"
                  className="md:col-span-2 lg:col-span-4 flex items-start justify-between gap-2 rounded border border-emerald-500/60 bg-emerald-900/30 p-2 text-xs text-emerald-100"
                >
                  <div>
                    <div className="font-medium text-emerald-100">
                      Comparing to <span className="text-emerald-50">{comparisonFrom!.palaceName}</span>
                    </div>
                    {sharedMotifKinds.length > 0 ? (
                      <div className="mt-0.5 text-emerald-100/90">
                        Both palaces share these motif kinds:{" "}
                        <span className="font-medium">{sharedMotifKinds.join(", ")}</span>. Look for
                        moves you used there.
                      </div>
                    ) : (
                      <div className="mt-0.5 text-emerald-100/80">
                        No shared named motifs — the structural match is in the metrics, not the
                        named patterns. Look at degree distribution and bridge count for the analogy.
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss comparison"
                    onClick={() => setComparisonFrom(null)}
                    className="rounded px-1.5 py-0.5 text-[11px] text-emerald-200 hover:bg-emerald-700/40"
                  >
                    Done ×
                  </button>
                </div>
              ) : null}
              {currentPalaceAARs.length > 0 ? (
                <div
                  aria-label="Past AAR records for this palace"
                  className="md:col-span-2 lg:col-span-4 rounded border border-sky-800/40 bg-sky-950/20 p-2"
                >
                  <div className="text-[11px] uppercase tracking-wide text-sky-200">
                    Past AARs · this palace ({currentPalaceAARs.length})
                  </div>
                  <ul className="mt-1 grid gap-1 text-xs text-sky-100/90 sm:grid-cols-2">
                    {currentPalaceAARs.slice(0, 4).map((rec) => {
                      const isFocused = focusedAARId === rec.id;
                      return (
                        <li
                          key={rec.id}
                          data-aar-id={rec.id}
                          className={`rounded bg-sky-900/30 p-1.5 transition-shadow ${
                            isFocused ? "ring-2 ring-sky-300 shadow-[0_0_0_2px_rgba(125,211,252,0.25)]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sky-100">
                              {rec.takeaway || "(no takeaway)"}
                            </span>
                            <span className="text-[10px] text-sky-300/80">
                              {new Date(rec.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {rec.adjustment ? (
                            <div className="mt-0.5 text-[11px] text-sky-100/80">
                              <span className="text-sky-300">Next time:</span> {rec.adjustment}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              {relatedAARs.length > 0 ? (
                <div
                  aria-label="Related AARs from past sessions"
                  className="md:col-span-2 lg:col-span-4 rounded border border-fuchsia-800/40 bg-fuchsia-950/20 p-2"
                >
                  <div className="text-[11px] uppercase tracking-wide text-fuchsia-200">
                    Related AARs · past solutions for similar shapes
                  </div>
                  <div className="mt-0.5 text-[11px] italic text-fuchsia-300/80">
                    These records were closed on palaces whose graph shape resembled this one — the
                    takeaway probably still applies.
                  </div>
                  <ul className="mt-1 grid gap-1 text-xs text-fuchsia-100/90 sm:grid-cols-2">
                    {relatedAARs.map((entry) => (
                      <li key={entry.record.id}>
                        <button
                          type="button"
                          onClick={() => onClickRelatedAAR(entry.record)}
                          className="block w-full rounded bg-fuchsia-900/30 p-1.5 text-left transition-colors hover:bg-fuchsia-800/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fuchsia-400"
                          title={`Jump to ${entry.record.palaceName} and locate this AAR`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-fuchsia-100">
                              {entry.record.takeaway || "(no takeaway)"}
                            </span>
                            <span className="text-[10px] text-fuchsia-300">
                              {Math.round(entry.score * 100)}% · {entry.record.palaceName}
                            </span>
                          </div>
                          {entry.record.adjustment ? (
                            <div className="mt-0.5 text-[11px] text-fuchsia-100/80">
                              <span className="text-fuchsia-300">Next time:</span>{" "}
                              {entry.record.adjustment}
                            </div>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div id="insights-settings" className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Settings2 className="h-4 w-4 text-violet-300" />
              Review Settings
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span>Daily loci goal</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={dailyReviewGoal}
                  onChange={(event) => setDailyReviewGoal(Number(event.target.value))}
                  className="h-8 w-20 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-zinc-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>Anthropic API key</span>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(event) => setAnthropicKey(event.target.value)}
                  className="h-8 w-56 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-zinc-100"
                  placeholder="sk-ant-..."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium text-zinc-100">Memory Strength Over Time</div>
            <div className="flex flex-wrap gap-2">
              <select
                className="h-8 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                value={selectedPalaceFilter}
                onChange={(event) => setSelectedPalaceFilter(event.target.value)}
              >
                <option value="all">All palaces</option>
                {palaceOptions.map((palaceId) => (
                  <option key={palaceId} value={palaceId}>
                    {palaceId}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                value={selectedRouteFilter}
                onChange={(event) => setSelectedRouteFilter(event.target.value)}
              >
                <option value="all">All routes</option>
                {routeOptions.map((routeId) => (
                  <option key={routeId} value={routeId}>
                    {routeId}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {retentionSeries.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
              Review some loci to see your retention curve.
            </div>
          ) : (
            <>
              <svg viewBox="0 0 640 220" className="mt-3 h-[220px] w-full rounded-md border border-zinc-800 bg-zinc-950/50">
                <path d={retentionPath(retentionSeries, 640, 220)} fill="none" stroke="#a78bfa" strokeWidth={2.5} />
                {retentionSeries.map((point, index) => {
                  const x = 24 + (retentionSeries.length === 1 ? 0 : (index / (retentionSeries.length - 1)) * (640 - 48));
                  const y = 24 + (1 - point.averageScorePct / 100) * (220 - 48);
                  return (
                    <circle key={point.dayKey} cx={x} cy={y} r={4} fill="#c4b5fd">
                      <title>{`${formatDayKeyLabel(point.dayKey)}: ${point.averageScorePct}% (${point.count} loci)`}</title>
                    </circle>
                  );
                })}
              </svg>
              {trendDown ? (
                <div className="mt-2 rounded-md border border-amber-700/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
                  Your retention is trending down - consider shorter, more frequent sessions.
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="text-sm font-medium text-zinc-100">Review Consistency (52 weeks)</div>
          {heatmapCells.every((cell) => cell.count === 0) ? (
            <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
              Your review history will appear here after your first walk session.
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("mp-open-review"))}
                >
                  Start reviewing
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 overflow-x-auto pb-2">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {heatmapCells.map((cell) => (
                    <button
                      key={cell.dayKey}
                      type="button"
                      onMouseEnter={() => setHoveredDayKey(cell.dayKey)}
                      onMouseLeave={() => setHoveredDayKey((current) => (current === cell.dayKey ? null : current))}
                      className={`h-3 w-3 rounded-sm ${heatmapTone(cell.count)} ${cell.isToday ? "ring-1 ring-violet-300" : ""}`}
                      title={`${formatDayKeyLabel(cell.dayKey)} - ${cell.count} loci reviewed across ${cell.routeCount} routes`}
                      aria-label={`${cell.dayKey}: ${cell.count} reviewed`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {hoveredCell
                  ? `${formatDayKeyLabel(hoveredCell.dayKey)} - ${hoveredCell.count} loci reviewed across ${hoveredCell.routeCount} routes`
                  : "Hover a day to inspect review volume."}
              </div>
            </>
          )}
        </section>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <ShieldCheck className="h-4 w-4 text-violet-300" />
              What is tracked
            </div>
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              <li>- Palace lifecycle: created, opened, draft-saved, checkpoint-saved.</li>
              <li>- Graph work: node create/update, edge create/update, route create, locus add/update.</li>
              <li>- Review flow: walk start, step changes, answer reveals, recall ratings, walk close.</li>
              <li>- theSystem runs: pipeline materialization into graph structure.</li>
            </ul>
            <div className="mt-3 text-xs text-zinc-500">
              Palace: {currentPalace ? currentPalace.name : "Open a palace to inspect palace-scoped metrics."}
            </div>
          </section>

          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-sm font-medium text-zinc-100">Recent events</div>
            <div className="mt-3 space-y-2">
              {recentEvents.length === 0 ? (
                <div className="rounded border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-4 text-sm text-zinc-500">
                  No analytics events yet.
                </div>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="font-medium capitalize text-zinc-100">{humanizeAnalyticsEventType(event.eventType)}</div>
                      <div className="text-[11px] text-zinc-500">{new Date(event.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">{formatEventDetail(event)}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <CloseAARDialog
        open={aarOpen}
        onOpenChange={setAarOpen}
        palaceId={currentPalace?.id ?? null}
        palaceName={currentPalace?.name ?? ""}
        signature={aarSignatureSnapshot}
        onSave={appendAARRecord}
      />
    </div>
  );
}
