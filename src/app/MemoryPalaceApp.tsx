import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import {
  BarChart2,
  BookOpen,
  Columns3,
  Cpu,
  Focus,
  Globe,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  PanelLeft,
  PanelRightOpen,
  Search,
  Sparkles,
} from "lucide-react";
import { createMemoryArrow } from "../canvas/createMemoryShapes";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { MemoryPalaceCanvas } from "../canvas/MemoryPalaceCanvas";
import { AtlasEditorPage } from "../components/AtlasEditorPage";
import { CastEdgeDialog } from "../components/CastEdgeDialog";
import { CommandPalette, type PaletteCommand } from "../components/CommandPalette";
import { ContextualTipCard } from "../components/ContextualTipCard";
import { GlossaryPanel } from "../components/GlossaryPanel";
import { HelpCenterPage } from "../components/HelpCenterPage";
import { AnalyticsPanel } from "../components/AnalyticsPanel";
import { ImportNodesDialog } from "../components/ImportNodesDialog";
import { PalaceSidebar } from "../components/PalaceSidebar";
import { PalaceToolbar } from "../components/PalaceToolbar";
import { ReviewPage } from "../components/ReviewPage";
import { RouteEditorPage } from "../components/RouteEditorPage";
import { RoutePanel } from "../components/RoutePanel";
import { SessionSummaryModal } from "../components/SessionSummaryModal";
import { TheSystemWorkbench } from "../components/TheSystemWorkbench";
import { WalkModeBar } from "../components/WalkModeBar";
import { NodeInspector } from "../components/NodeInspector";
import { OnboardingPanel } from "../components/OnboardingPanel";
import { PalaceDslEditor } from "../components/PalaceDslEditor";
import { Button } from "../components/ui/button";
import type { MemoryNode } from "../domain/entities/types";
import { buildPrimaryContextHint } from "../domain/services/contextualTips";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { usePalaceStore } from "../store/palaceStore";

type AppPage = "graph" | "review" | "insights" | "system" | "atlas" | "routes" | "help";

type NodeSearchEntry = {
  palaceId: string;
  palaceName: string;
  nodeId: string;
  title: string;
  subtitle: string;
  keywords: string;
  group: "Current Palace Nodes" | "Other Palaces";
};

const RECENT_COMMANDS_STORAGE_KEY = "mp-recent-command-ids";
const RECENT_NODE_IDS_STORAGE_KEY = "mp-recent-node-ids";
const DSL_SPLIT_RATIO_STORAGE_KEY = "mp-dsl-split-ratio";

function loadSplitRatio(): number {
  if (typeof window === "undefined") return 0.4;
  const raw = window.localStorage.getItem(DSL_SPLIT_RATIO_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0.1 && parsed < 0.9 ? parsed : 0.4;
}
const palaceRepo = getPalaceRepository();
function loadRecentIds(storageKey: string, max = 20) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === "string").slice(0, max);
  } catch {
    return [];
  }
}

function toPlainText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pageHint(page: AppPage) {
  if (page === "review") {
    return "Review turns routes and recall ratings into an attention queue instead of a loose reading habit.";
  }
  if (page === "insights") {
    return "Insights shows the telemetry behind your graph and review behavior so weak spots become visible.";
  }
  if (page === "system") {
    return "System is where theSystem frameworks become runnable thinking pipelines and graph output.";
  }
  if (page === "atlas") {
    return "Atlas organizes palaces by geography: domain, place, section. Build a hierarchy across multiple spaces.";
  }
  if (page === "routes") {
    return "Routes are ordered walks through your palace. Organize and edit loci sequences here without toolbar noise.";
  }
  if (page === "help") {
    return "Help is onboarding plus examples. Use it to start fast, then leave it once the palace is alive.";
  }
  return null;
}

function GraphEmptyState({
  onCreateTutorialPalace,
  onOpenHelp,
  onOpenCommandPalette,
  onOpenImport,
}: {
  onCreateTutorialPalace: () => void;
  onOpenHelp: () => void;
  onOpenCommandPalette: () => void;
  onOpenImport: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[34px] border border-zinc-800 bg-[radial-gradient(circle_at_top,#27272a_0%,rgba(9,9,11,0)_48%),linear-gradient(180deg,rgba(24,24,27,0.94),rgba(9,9,11,0.98))] p-7 shadow-[0_28px_120px_rgba(0,0,0,0.45)]">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Palace workspace</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">Build the graph where memory actually lives.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Start with one palace, a few anchors, and one route. The surrounding pages handle review, system workflows,
          and insight. This surface stays dedicated to graph work.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={onCreateTutorialPalace}>
            <Sparkles className="h-4 w-4" />
            Create tutorial palace
          </Button>
          <Button type="button" variant="secondary" onClick={onOpenHelp}>
            <BookOpen className="h-4 w-4" />
            Open help
          </Button>
          <Button type="button" variant="outline" onClick={onOpenCommandPalette}>
            <Search className="h-4 w-4" />
            Open command palette
          </Button>
          <Button type="button" variant="outline" onClick={onOpenImport}>
            Import notes
          </Button>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Review</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">Queue weak routes, start walks, and keep retrieval stable.</div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Insights</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">See memory strength, graph activity, and review signals without leaving the app.</div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">System</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">Run frameworks as pipelines and materialize them into the current palace.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function routeNamesByNodeId(
  nodes: MemoryNode[],
  routes: Array<{ id: string; name: string }>,
  loci: Array<{ routeId: string; nodeId: string }>,
) {
  const routeNameMap = new Map(routes.map((route) => [route.id, route.name]));
  const namesByNode = new Map<string, Set<string>>();
  for (const locus of loci) {
    const routeName = routeNameMap.get(locus.routeId);
    if (!routeName) continue;
    const set = namesByNode.get(locus.nodeId) ?? new Set<string>();
    set.add(routeName);
    namesByNode.set(locus.nodeId, set);
  }

  return nodes.map((node) => {
    const routeNames = [...(namesByNode.get(node.id) ?? new Set<string>())];
    return {
      node,
      routeSummary: routeNames.length === 0 ? "No route" : routeNames.join(", "),
    };
  });
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function MemoryPalaceApp() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>("graph");
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => loadRecentIds(RECENT_COMMANDS_STORAGE_KEY));
  const [recentNodeIds, setRecentNodeIds] = useState<string[]>(() => loadRecentIds(RECENT_NODE_IDS_STORAGE_KEY, 12));
  const [nodeCommands, setNodeCommands] = useState<PaletteCommand[]>([]);
  const graphControls = true;

  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const nodes = usePalaceStore((s) => s.nodes);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const toolMode = usePalaceStore((s) => s.toolMode);
  const routePanelOpen = usePalaceStore((s) => s.routePanelOpen);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const setWalkRecallMode = usePalaceStore((s) => s.setWalkRecallMode);
  const setWalkCueOnly = usePalaceStore((s) => s.setWalkCueOnly);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const palaces = usePalaceStore((s) => s.palaces);
  const pendingCast = usePalaceStore((s) => s.pendingCast);
  const setPendingCast = usePalaceStore((s) => s.setPendingCast);
  const persistenceState = usePalaceStore((s) => s.persistenceState);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const dslPaneOpen = usePalaceStore((s) => s.dslPaneOpen);
  const setDslPaneOpen = usePalaceStore((s) => s.setDslPaneOpen);
  const [dslSplitRatio, setDslSplitRatio] = useState<number>(() => loadSplitRatio());

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [viewMode, setViewMode] = useState<"balanced" | "focus">("balanced");
  const [hoverHint, setHoverHint] = useState<string | null>(null);

  const navigateToPage = useCallback((page: AppPage) => {
    setCurrentPage(page);
  }, []);

  const trackCommandRun = useCallback((id: string) => {
    setRecentCommandIds((current) => [id, ...current.filter((entry) => entry !== id)].slice(0, 20));
  }, []);

  const trackNodeVisit = useCallback((nodeId: string) => {
    setRecentNodeIds((current) => [nodeId, ...current.filter((entry) => entry !== nodeId)].slice(0, 12));
  }, []);

  const startRouteReview = useCallback(
    (routeId: string) => {
      setWalkRoute(routeId);
      setWalkRecallMode(true);
      setWalkCueOnly(true);
      setWalkOpen(true);
      setCurrentPage("graph");
    },
    [setWalkCueOnly, setWalkOpen, setWalkRecallMode, setWalkRoute],
  );

  const waitForNodeShape = useCallback(async (targetPalaceId: string, nodeId: string) => {
    const started = Date.now();
    while (Date.now() - started < 4500) {
      const state = usePalaceStore.getState();
      if (state.currentPalace?.id === targetPalaceId && state.editorRef) {
        for (const shapeId of state.editorRef.getCurrentPageShapeIds()) {
          const shape = state.editorRef.getShape(shapeId as TLShapeId);
          const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
          if (shape?.type === "geo" && meta.mpNodeId === nodeId) {
            return { editor: state.editorRef, shapeId: shapeId as TLShapeId };
          }
        }
      }
      await sleep(70);
    }
    return null;
  }, []);

  const focusNodeCommand = useCallback(
    async (targetPalaceId: string, nodeId: string) => {
      if (currentPalace?.id !== targetPalaceId) {
        await openPalace(targetPalaceId);
      }
      setCurrentPage("graph");
      const target = await waitForNodeShape(targetPalaceId, nodeId);
      if (!target) return;
      target.editor.setSelectedShapes([target.shapeId]);
      target.editor.zoomToSelectionIfOffscreen(96, { animation: { duration: 260 } });
    },
    [currentPalace?.id, openPalace, waitForNodeShape],
  );

  const sceneStats = useMemo(() => {
    if (!editorRef) {
      return {
        nodeCount: 0,
        edgeCount: 0,
        selectedKind: null as "node" | "portal" | "edge" | null,
      };
    }

    let nodeCount = 0;
    let edgeCount = 0;

    for (const id of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(id as TLShapeId);
      if (!shape) continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (shape.type === "geo" && meta.mpNodeId) nodeCount += 1;
      if (shape.type === "arrow" && (meta.mpEdgeId || meta.mpSourceNodeId || meta.mpTargetNodeId)) edgeCount += 1;
    }

    let selectedKind: "node" | "portal" | "edge" | null = null;
    if (selectedShapeId) {
      const selectedShape = editorRef.getShape(selectedShapeId as TLShapeId);
      const selectedMeta = (selectedShape?.meta ?? {}) as MemoryPalaceMeta;
      if (selectedShape?.type === "arrow") {
        selectedKind = "edge";
      } else if (selectedShape?.type === "geo" && selectedMeta.mpNodeId) {
        selectedKind = selectedMeta.mpNodeKind === "portal" ? "portal" : "node";
      }
    }

    return { nodeCount, edgeCount, selectedKind };
  }, [editorRef, selectedShapeId]);

  const contextualTipContext = useMemo(
    () => ({
      hasPalace: !!currentPalace,
      nodeCount: sceneStats.nodeCount,
      edgeCount: sceneStats.edgeCount,
      routeCount: routes.length,
      locusCount: loci.length,
      walkOpen,
      toolMode,
      selectedKind: sceneStats.selectedKind,
      persistenceState,
    }),
    [
      currentPalace,
      sceneStats.nodeCount,
      sceneStats.edgeCount,
      sceneStats.selectedKind,
      routes.length,
      loci.length,
      walkOpen,
      toolMode,
      persistenceState,
    ],
  );

  const title = useMemo(() => currentPalace?.name ?? "Memory Palace Lab", [currentPalace?.name]);
  const defaultHint = useMemo(
    () => pageHint(currentPage) ?? buildPrimaryContextHint(contextualTipContext),
    [contextualTipContext, currentPage],
  );

  const onCastConfirm = (cast: { ab: string; cd: string; ef: string; gh: string; label?: string }) => {
    const pending = usePalaceStore.getState().pendingCast;
    const editor = usePalaceStore.getState().editorRef;
    const palace = usePalaceStore.getState().currentPalace;
    if (!pending || !editor || !palace) return;
    createMemoryArrow(
      editor,
      palace.id,
      pending.fromShapeId,
      pending.toShapeId,
      pending.sourceNodeId,
      pending.targetNodeId,
      cast,
    );
    setPendingCast(null);
  };

  const applyViewMode = (mode: "balanced" | "focus") => {
    setViewMode(mode);
    if (mode === "balanced") {
      setShowSidebar(true);
      setShowInspector(true);
      return;
    }
    setShowSidebar(false);
    setShowInspector(false);
    setShowOnboarding(true);
  };

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  useEffect(() => {
    void loadPalaces();
  }, [loadPalaces]);

  useEffect(() => {
    const flushDraft = () => {
      void usePalaceStore.getState().flushDraftSave();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushDraft();
      }
    };

    window.addEventListener("beforeunload", flushDraft);
    window.addEventListener("pagehide", flushDraft);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", flushDraft);
      window.removeEventListener("pagehide", flushDraft);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setGlossaryOpen((open) => !open);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        event.preventDefault();
        setDslPaneOpen(!usePalaceStore.getState().dslPaneOpen);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setDslPaneOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DSL_SPLIT_RATIO_STORAGE_KEY, String(dslSplitRatio));
  }, [dslSplitRatio]);

  useEffect(() => {
    const onOpenInsights = () => setCurrentPage("insights");
    const onOpenReview = () => setCurrentPage("review");
    window.addEventListener("mp-open-insights", onOpenInsights as EventListener);
    window.addEventListener("mp-open-review", onOpenReview as EventListener);
    return () => {
      window.removeEventListener("mp-open-insights", onOpenInsights as EventListener);
      window.removeEventListener("mp-open-review", onOpenReview as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RECENT_COMMANDS_STORAGE_KEY, JSON.stringify(recentCommandIds.slice(0, 20)));
  }, [recentCommandIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RECENT_NODE_IDS_STORAGE_KEY, JSON.stringify(recentNodeIds.slice(0, 12)));
  }, [recentNodeIds]);

  useEffect(() => {
    if (!editorRef || !selectedShapeId) return;
    const shape = editorRef.getShape(selectedShapeId as TLShapeId);
    const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
    if (!shape || shape.type !== "geo" || !meta.mpNodeId) return;
    trackNodeVisit(meta.mpNodeId);
  }, [editorRef, selectedShapeId, trackNodeVisit]);

  useEffect(() => {
    if (!commandOpen) return;
    let cancelled = false;

    async function buildNodeCommands() {
      const currentPalaceId = currentPalace?.id ?? null;
      const currentNodes = nodes;
      const currentRoutes = routes;
      const currentLoci = loci;

      const snapshots = await Promise.all(
        palaces.map(async (palace) => {
          if (palace.id === currentPalaceId) {
            return {
              palace,
              nodes: currentNodes,
              routes: currentRoutes,
              loci: currentLoci,
            };
          }
          const loaded = await palaceRepo.loadPalace(palace.id);
          if (!loaded) return null;
          return {
            palace: loaded.palace,
            nodes: loaded.nodes,
            routes: loaded.routes,
            loci: loaded.loci,
          };
        }),
      );

      if (cancelled) return;

      const entries: NodeSearchEntry[] = [];
      for (const snapshot of snapshots) {
        if (!snapshot) continue;
        const nodeRouteSummaries = routeNamesByNodeId(snapshot.nodes, snapshot.routes, snapshot.loci);
        for (const entry of nodeRouteSummaries) {
          const title = entry.node.title?.trim() || "Untitled node";
          entries.push({
            palaceId: snapshot.palace.id,
            palaceName: snapshot.palace.name,
            nodeId: entry.node.id,
            title,
            subtitle: `${snapshot.palace.name} | ${entry.routeSummary}`,
            keywords: `${entry.node.alias ?? ""} ${toPlainText(entry.node.content ?? "")}`,
            group: snapshot.palace.id === currentPalaceId ? "Current Palace Nodes" : "Other Palaces",
          });
        }
      }

      const entryByNodeId = new Map(entries.map((entry) => [entry.nodeId, entry]));
      const recentNodeCommands: PaletteCommand[] = recentNodeIds
        .map((nodeId) => entryByNodeId.get(nodeId))
        .filter((entry): entry is NodeSearchEntry => !!entry)
        .slice(0, 5)
        .map((entry) => ({
          id: `recent-node:${entry.palaceId}:${entry.nodeId}`,
          group: "Recent nodes",
          title: entry.title,
          subtitle: entry.subtitle,
          keywords: entry.keywords,
          onSelect: () => {
            trackNodeVisit(entry.nodeId);
            void focusNodeCommand(entry.palaceId, entry.nodeId);
          },
        }));

      const regularNodeCommands: PaletteCommand[] = entries.map((entry) => ({
        id: `node:${entry.palaceId}:${entry.nodeId}`,
        group: entry.group,
        title: entry.title,
        subtitle: entry.subtitle,
        keywords: entry.keywords,
        onSelect: () => {
          trackNodeVisit(entry.nodeId);
          void focusNodeCommand(entry.palaceId, entry.nodeId);
        },
      }));

      setNodeCommands([...recentNodeCommands, ...regularNodeCommands]);
    }

    void buildNodeCommands();

    return () => {
      cancelled = true;
    };
  }, [commandOpen, currentPalace?.id, focusNodeCommand, loci, nodes, palaces, recentNodeIds, routes, trackNodeVisit]);

  const basePaletteCommands: PaletteCommand[] = useMemo(
    () => [
      {
        id: "action-glossary",
        group: "Actions",
        title: "Open vocabulary glossary",
        onSelect: () => setGlossaryOpen(true),
      },
      {
        id: "action-import-notes",
        group: "Actions",
        title: "Import notes",
        subtitle: "Markdown or CSV",
        onSelect: () => setImportOpen(true),
      },
      {
        id: "dsl.toggle",
        group: "Actions",
        title: "Toggle DSL editor",
        subtitle: "Cmd/Ctrl+E - split-pane palace DSL",
        keywords: "dsl text editor split pane palace",
        onSelect: () => setDslPaneOpen(!usePalaceStore.getState().dslPaneOpen),
      },
      {
        id: "page-graph",
        group: "Pages",
        title: "Graph workspace",
        subtitle: "Edit palace structure",
        onSelect: () => navigateToPage("graph"),
      },
      {
        id: "page-review",
        group: "Pages",
        title: "Review queue",
        subtitle: "Spaced review scheduling",
        onSelect: () => navigateToPage("review"),
      },
      {
        id: "page-insights",
        group: "Pages",
        title: "Insights dashboard",
        subtitle: "Memory strength telemetry",
        onSelect: () => navigateToPage("insights"),
      },
      {
        id: "page-system",
        group: "Pages",
        title: "System workbench",
        subtitle: "Run frameworks as pipelines",
        onSelect: () => navigateToPage("system"),
      },
      {
        id: "page-atlas",
        group: "Pages",
        title: "Atlas hierarchy",
        subtitle: "Organize palaces by geography",
        onSelect: () => navigateToPage("atlas"),
      },
      {
        id: "page-routes",
        group: "Pages",
        title: "Route editor",
        subtitle: "Edit loci and route order",
        onSelect: () => navigateToPage("routes"),
      },
      {
        id: "page-help",
        group: "Pages",
        title: "Help center",
        subtitle: "Onboarding and guides",
        onSelect: () => navigateToPage("help"),
      },
      {
        id: "doc-walk-mode",
        group: "Docs",
        title: "Walk Mode - recall-first review",
        subtitle: "Test before revealing answers",
        onSelect: () => navigateToPage("help"),
      },
      {
        id: "doc-cast-edges",
        group: "Docs",
        title: "CAST edges - connection types",
        subtitle: "Causal, Associative, Structural, Temporal",
        onSelect: () => navigateToPage("help"),
      },
      {
        id: "doc-spaced-review",
        group: "Docs",
        title: "Spaced repetition - scheduling",
        subtitle: "Review at the right time",
        onSelect: () => navigateToPage("review"),
      },
      {
        id: "doc-encoding",
        group: "Docs",
        title: "Encoding - vivid memory cues",
        subtitle: "Transform dry facts into images",
        onSelect: () => navigateToPage("help"),
      },
      {
        id: "doc-loci",
        group: "Docs",
        title: "Loci - anchor points in palaces",
        subtitle: "Physical and mental locations",
        onSelect: () => navigateToPage("help"),
      },
    ],
    [navigateToPage, setDslPaneOpen],
  );

  const palacePaletteCommands = useMemo<PaletteCommand[]>(
    () =>
      palaces.map((palace) => ({
        id: `palace:${palace.id}`,
        group: "Palaces",
        title: `Open palace: ${palace.name}`,
        subtitle: palace.atlasPath?.trim() || "No atlas path",
        keywords: `${palace.name} ${palace.alias ?? ""} ${palace.atlasPath ?? ""}`,
        onSelect: () => {
          void openPalace(palace.id);
          navigateToPage("graph");
        },
      })),
    [navigateToPage, openPalace, palaces],
  );

  const routePaletteCommands = useMemo<PaletteCommand[]>(
    () =>
      routes.map((route) => ({
        id: `route:${route.id}`,
        group: "Routes",
        title: `Review route: ${route.name}`,
        subtitle: currentPalace?.name ?? "Current palace",
        keywords: route.name,
        onSelect: () => startRouteReview(route.id),
      })),
    [currentPalace?.name, routes, startRouteReview],
  );

  const paletteCommands = useMemo(
    () => [...basePaletteCommands, ...palacePaletteCommands, ...routePaletteCommands, ...nodeCommands],
    [basePaletteCommands, nodeCommands, palacePaletteCommands, routePaletteCommands],
  );

  const snap = currentPalace?.editorSnapshot;
  const castOpen = !!pendingCast;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="grid shrink-0 grid-cols-3 items-center border-b border-zinc-800 px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="shrink-0 text-sm font-semibold tracking-tight text-violet-200">{title}</h1>
            <div className="hidden w-full max-w-[320px] truncate text-xs text-zinc-400 md:block">{hoverHint ?? defaultHint}</div>
          </div>

          <nav className="flex items-center justify-center gap-1">
            {(["graph", "review", "insights", "system", "atlas", "routes", "help"] as const).map((page) => {
              const icons: Record<typeof page, ReactNode> = {
                graph: <LayoutDashboard className="h-4 w-4" />,
                review: <BookOpen className="h-4 w-4" />,
                insights: <BarChart2 className="h-4 w-4" />,
                system: <Cpu className="h-4 w-4" />,
                atlas: <Globe className="h-4 w-4" />,
                routes: <ListOrdered className="h-4 w-4" />,
                help: <HelpCircle className="h-4 w-4" />,
              };
              const labels: Record<typeof page, string> = {
                graph: "Graph",
                review: "Review",
                insights: "Insights",
                system: "System",
                atlas: "Atlas",
                routes: "Routes",
                help: "Help",
              };
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "ghost"}
                  onClick={() => navigateToPage(page)}
                  title={`Open ${labels[page]}`}
                  onMouseEnter={() => setHoverHint(`${labels[page]} - ${pageHint(page) || "workspace area"}`)}
                  onMouseLeave={() => setHoverHint(null)}
                  className="gap-1.5"
                >
                  {icons[page]}
                  <span className="hidden sm:inline">{labels[page]}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant={viewMode === "balanced" ? "default" : "secondary"}
              type="button"
              onClick={() => applyViewMode("balanced")}
              title="Balanced layout"
              onMouseEnter={() => setHoverHint("Balanced mode: keeps side panels visible for editing and navigation.")}
              onMouseLeave={() => setHoverHint(null)}
            >
              <Columns3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "focus" ? "default" : "secondary"}
              type="button"
              onClick={() => applyViewMode("focus")}
              title="Focus mode"
              onMouseEnter={() => setHoverHint("Focus mode: hides panels and maximizes canvas space.")}
              onMouseLeave={() => setHoverHint(null)}
            >
              <Focus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => setShowSidebar((v) => !v)}
              title="Toggle palace sidebar"
              onMouseEnter={() => setHoverHint("Toggle palace sidebar: show or hide palace list and create controls.")}
              onMouseLeave={() => setHoverHint(null)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => setShowInspector((v) => !v)}
              title="Toggle inspector"
              onMouseEnter={() => setHoverHint("Toggle inspector: show or hide node title and content editor.")}
              onMouseLeave={() => setHoverHint(null)}
            >
              <PanelRightOpen className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => setShowOnboarding((v) => !v)}
              onMouseEnter={() => setHoverHint("Learn panel: onboarding guides plus theSystem pipelines.")}
              onMouseLeave={() => setHoverHint(null)}
            >
              <BookOpen className="h-4 w-4" />
              Learn
            </Button>
          </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {graphControls && showSidebar ? <PalaceSidebar onOpenImport={() => setImportOpen(true)} /> : null}

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <section className={currentPage === "graph" ? "flex min-h-0 flex-1 flex-col" : "hidden min-h-0 flex-1 flex-col"}>
            <PalaceToolbar onHoverHintChange={setHoverHint} />
            {routePanelOpen ? <RoutePanel onHoverHintChange={setHoverHint} /> : null}
            <WalkModeBar onHoverHintChange={setHoverHint} />
            {currentPalace ? (
              <div className="flex min-h-0 flex-1">
                {dslPaneOpen ? (
                  <>
                    <div
                      className="flex min-h-0 shrink-0 flex-col border-r border-zinc-800"
                      style={{ width: `${dslSplitRatio * 100}%` }}
                    >
                      <PalaceDslEditor />
                    </div>
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startRatio = dslSplitRatio;
                        const containerWidth = e.currentTarget.parentElement?.clientWidth ?? 1;
                        const onMove = (ev: MouseEvent) => {
                          const dx = ev.clientX - startX;
                          const next = startRatio + dx / containerWidth;
                          setDslSplitRatio(Math.min(0.85, Math.max(0.15, next)));
                        };
                        const onUp = () => {
                          window.removeEventListener("mousemove", onMove);
                          window.removeEventListener("mouseup", onUp);
                        };
                        window.addEventListener("mousemove", onMove);
                        window.addEventListener("mouseup", onUp);
                      }}
                      className="w-1.5 cursor-col-resize bg-zinc-800 hover:bg-violet-500/40"
                    />
                  </>
                ) : null}
                <div className="flex min-h-0 min-w-0 flex-1">
                  <MemoryPalaceCanvas key={currentPalace.id} palaceId={currentPalace.id} editorSnapshot={snap} />
                </div>
                {showInspector ? <NodeInspector /> : null}
              </div>
            ) : (
              <GraphEmptyState
                onCreateTutorialPalace={() => {
                  void createPalace("Tutorial Palace");
                }}
                onOpenHelp={() => navigateToPage("help")}
                onOpenCommandPalette={() => setCommandOpen(true)}
                onOpenImport={() => setImportOpen(true)}
              />
            )}
          </section>

          {currentPage === "review" ? (
            <ReviewPage onStartRouteReview={startRouteReview} onOpenPalaceWorkspace={() => navigateToPage("graph")} />
          ) : null}

          {currentPage === "insights" ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5">
                <AnalyticsPanel />
              </div>
            </div>
          ) : null}

          {currentPage === "system" ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5">
                <TheSystemWorkbench />
              </div>
            </div>
          ) : null}

          {currentPage === "atlas" ? (
            <div className="min-h-0 flex-1 overflow-hidden p-5">
              <div className="h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5">
                <AtlasEditorPage
                  onOpenPalace={(palaceId) => {
                    const palace = palaces.find((entry) => entry.id === palaceId);
                    if (palace) {
                      void usePalaceStore.getState().openPalace(palace.id);
                      navigateToPage("graph");
                    }
                  }}
                />
              </div>
            </div>
          ) : null}

          {currentPage === "routes" ? (
            <div className="min-h-0 flex-1 overflow-hidden p-5">
              <div className="h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5">
                <RouteEditorPage />
              </div>
            </div>
          ) : null}

          {currentPage === "help" ? (
            <HelpCenterPage
              onOpenPalaceWorkspace={() => navigateToPage("graph")}
              onOpenSystem={() => navigateToPage("system")}
              onOpenCommandPalette={() => setCommandOpen(true)}
            />
          ) : null}
        </main>

        <OnboardingPanel
          open={showOnboarding}
          onClose={() => {
            setShowOnboarding(false);
          }}
        />
      </div>

      <ContextualTipCard
        context={contextualTipContext}
        onOpenHelp={() => {
          navigateToPage("help");
        }}
      />

      <CastEdgeDialog
        open={castOpen}
        onOpenChange={(open) => {
          if (!open) setPendingCast(null);
        }}
        onConfirm={onCastConfirm}
      />

      <ImportNodesDialog open={importOpen} onOpenChange={setImportOpen} />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        commands={paletteCommands}
        recentIds={recentCommandIds}
        onCommandRun={trackCommandRun}
      />

      <GlossaryPanel open={glossaryOpen} onOpenChange={setGlossaryOpen} />
      <SessionSummaryModal onReviewAnother={() => setCurrentPage("review")} onBackToPalace={() => setCurrentPage("graph")} />
    </div>
  );
}
