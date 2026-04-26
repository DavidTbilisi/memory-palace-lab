import { useEffect, useMemo, useReducer, useState } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import {
  BarChart3,
  BookOpen,
  Columns3,
  Command,
  Compass,
  Focus,
  Footprints,
  PanelLeft,
  PanelRightOpen,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { createMemoryArrow, createGeoMemoryNode } from "../canvas/createMemoryShapes";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { MemoryPalaceCanvas } from "../canvas/MemoryPalaceCanvas";
import { CastEdgeDialog } from "../components/CastEdgeDialog";
import { CommandPalette, type PaletteCommand } from "../components/CommandPalette";
import { ContextualTipCard } from "../components/ContextualTipCard";
import { HelpCenterPage } from "../components/HelpCenterPage";
import { AnalyticsPanel } from "../components/AnalyticsPanel";
import { NodeInspector } from "../components/NodeInspector";
import { PalaceSidebar } from "../components/PalaceSidebar";
import { PalaceToolbar } from "../components/PalaceToolbar";
import { ReviewPage } from "../components/ReviewPage";
import { RoutePanel } from "../components/RoutePanel";
import { TheSystemWorkbench } from "../components/TheSystemWorkbench";
import { WalkModeBar } from "../components/WalkModeBar";
import { Button } from "../components/ui/button";
import { buildReviewQueue } from "../domain/services/reviewQueue";
import { buildPrimaryContextHint } from "../domain/services/contextualTips";
import { usePalaceStore } from "../store/palaceStore";

type AppPage = "graph" | "review" | "insights" | "system" | "help";

const RECENT_COMMANDS_STORAGE_KEY = "mp-recent-command-ids";

function loadRecentCommandIds() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const raw = window.localStorage.getItem(RECENT_COMMANDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
  } catch {
    return [];
  }
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
  if (page === "help") {
    return "Help is onboarding plus examples. Use it to start fast, then leave it once the palace is alive.";
  }
  return null;
}

function GraphEmptyState({
  onCreateTutorialPalace,
  onOpenHelp,
  onOpenCommandPalette,
}: {
  onCreateTutorialPalace: () => void;
  onOpenHelp: () => void;
  onOpenCommandPalette: () => void;
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

export function MemoryPalaceApp() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const palaces = usePalaceStore((s) => s.palaces);
  const nodes = usePalaceStore((s) => s.nodes);
  const pendingCast = usePalaceStore((s) => s.pendingCast);
  const setPendingCast = usePalaceStore((s) => s.setPendingCast);
  const persistenceState = usePalaceStore((s) => s.persistenceState);
  const draftRestored = usePalaceStore((s) => s.draftRestored);
  const lastDraftSavedAt = usePalaceStore((s) => s.lastDraftSavedAt);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const toolMode = usePalaceStore((s) => s.toolMode);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const addRoute = usePalaceStore((s) => s.addRoute);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [viewMode, setViewMode] = useState<"balanced" | "focus">("balanced");
  const [hoverHint, setHoverHint] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>("graph");
  const [commandOpen, setCommandOpen] = useState(false);
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => loadRecentCommandIds());
  const [, bumpSceneRevision] = useReducer((value: number) => value + 1, 0);

  const snap = currentPalace?.editorSnapshot;
  const castOpen = !!pendingCast;

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

  useEffect(() => {
    if (!editorRef) return;
    const unsubscribe = editorRef.store.listen(
      () => {
        bumpSceneRevision();
      },
      { source: "all", scope: "all" },
    );
    return unsubscribe;
  }, [editorRef]);

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

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
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RECENT_COMMANDS_STORAGE_KEY, JSON.stringify(recentCommandIds.slice(0, 12)));
  }, [recentCommandIds]);

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
      loci.length,
      persistenceState,
      routes.length,
      sceneStats.edgeCount,
      sceneStats.nodeCount,
      sceneStats.selectedKind,
      toolMode,
      walkOpen,
    ],
  );

  const reviewQueue = useMemo(
    () =>
      buildReviewQueue({
        currentPalaceId: currentPalace?.id,
        routes,
        loci,
        nodes,
        analyticsEvents,
      }),
    [analyticsEvents, currentPalace?.id, loci, nodes, routes],
  );

  const title = useMemo(() => currentPalace?.name ?? "Memory Palace Lab", [currentPalace?.name]);
  const defaultHint = useMemo(
    () => pageHint(currentPage) ?? buildPrimaryContextHint(contextualTipContext),
    [contextualTipContext, currentPage],
  );
  const persistenceLabel = useMemo(() => {
    if (!currentPalace) return "Local | SQLite | tldraw";
    if (persistenceState === "dirty") return "Local | SQLite | Draft pending";
    if (persistenceState === "draft" && draftRestored) return "Local | SQLite | Draft restored";
    if (persistenceState === "draft") {
      return lastDraftSavedAt
        ? `Local | SQLite | Draft saved ${new Date(lastDraftSavedAt).toLocaleTimeString()}`
        : "Local | SQLite | Draft saved";
    }
    return "Local | SQLite | Saved checkpoint";
  }, [currentPalace, draftRestored, lastDraftSavedAt, persistenceState]);

  const navigateToPage = (page: AppPage) => {
    setCurrentPage(page);
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
  };

  const createNodeFromViewportCenter = () => {
    const state = usePalaceStore.getState();
    if (!state.editorRef || !state.currentPalace) return;
    const viewport = state.editorRef.getViewportPageBounds();
    navigateToPage("graph");
    createGeoMemoryNode(state.editorRef, state.currentPalace.id, {
      x: viewport.x + viewport.w / 2,
      y: viewport.y + viewport.h / 2,
    });
  };

  const focusNode = (nodeId: string) => {
    const state = usePalaceStore.getState();
    const editor = state.editorRef;
    if (!editor) return;
    let shapeId: TLShapeId | null = null;
    for (const currentShapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(currentShapeId as TLShapeId);
      const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
      if (shape?.type === "geo" && meta.mpNodeId === nodeId) {
        shapeId = currentShapeId as TLShapeId;
        break;
      }
    }
    if (!shapeId) return;
    navigateToPage("graph");
    editor.setSelectedShapes([shapeId]);
    state.setSelectedShapeId(shapeId);
    editor.zoomToSelectionIfOffscreen(96, { animation: { duration: 220 } });
  };

  const startRouteReview = (routeId: string) => {
    navigateToPage("graph");
    setWalkRoute(routeId);
    setWalkOpen(true);
  };

  const startDueReview = () => {
    const nextRoute = reviewQueue.queue.find((item) => item.locusCount > 0);
    if (!nextRoute) return;
    startRouteReview(nextRoute.routeId);
  };

  const trackCommandRun = (id: string) => {
    setRecentCommandIds((current) => [id, ...current.filter((entry) => entry !== id)].slice(0, 12));
  };

  const paletteCommands = useMemo<PaletteCommand[]>(() => {
    const pageCommands: PaletteCommand[] = [
      {
        id: "page:graph",
        group: "Pages",
        title: "Open Palace workspace",
        subtitle: "Canvas, inspector, routes, and walk controls",
        keywords: "graph palace canvas workspace",
        onSelect: () => navigateToPage("graph"),
      },
      {
        id: "page:review",
        group: "Pages",
        title: "Open Review",
        subtitle: "Queue, due work, walk sessions",
        keywords: "review queue due work walk sessions",
        onSelect: () => navigateToPage("review"),
      },
      {
        id: "page:insights",
        group: "Pages",
        title: "Open Insights",
        subtitle: "Analytics and memory strength",
        keywords: "insights analytics memory strength",
        onSelect: () => navigateToPage("insights"),
      },
      {
        id: "page:system",
        group: "Pages",
        title: "Open System",
        subtitle: "theSystem workbench and pipelines",
        keywords: "system workbench theSystem pipeline",
        onSelect: () => navigateToPage("system"),
      },
      {
        id: "page:help",
        group: "Pages",
        title: "Open Help",
        subtitle: "Guides, examples, and onboarding",
        keywords: "help guides examples onboarding",
        onSelect: () => navigateToPage("help"),
      },
    ];

    const actionCommands: PaletteCommand[] = [
      {
        id: "action:create-node",
        group: "Actions",
        title: "Create node",
        subtitle: currentPalace ? `Add a node to ${currentPalace.name}` : "Open a palace first",
        keywords: "add node memory graph",
        onSelect: () => createNodeFromViewportCenter(),
      },
      {
        id: "action:create-route",
        group: "Actions",
        title: "Create route",
        subtitle: currentPalace ? `Create a route in ${currentPalace.name}` : "Open a palace first",
        keywords: "add route loci walk",
        onSelect: () => {
          if (!currentPalace) return;
          navigateToPage("graph");
          addRoute(`Route ${routes.length + 1}`);
        },
      },
      {
        id: "action:start-due-review",
        group: "Actions",
        title: "Start due review",
        subtitle: reviewQueue.queue[0]?.routeName ?? "No reviewable route yet",
        keywords: "review due queue walk",
        onSelect: () => startDueReview(),
      },
      {
        id: "action:run-system",
        group: "Actions",
        title: "Run System pipeline",
        subtitle: "Jump to the System workbench",
        keywords: "system theSystem pipeline workbench",
        onSelect: () => navigateToPage("system"),
      },
    ];

    const palaceCommands: PaletteCommand[] = palaces
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((palace) => ({
        id: `palace:${palace.id}`,
        group: "Palaces",
        title: palace.name,
        subtitle: palace.alias?.trim() || palace.atlasPath?.trim() || "Open palace",
        keywords: `open palace ${palace.name} ${palace.alias ?? ""} ${palace.atlasPath ?? ""}`,
        onSelect: () => {
          void openPalace(palace.id).then(() => navigateToPage("graph"));
        },
      }));

    const routeCommands: PaletteCommand[] = routes.map((route) => ({
      id: `route:${route.id}`,
      group: "Routes",
      title: `Open route: ${route.name}`,
      subtitle: `${loci.filter((locus) => locus.routeId === route.id).length} loci`,
      keywords: `route walk review ${route.name}`,
      onSelect: () => {
        navigateToPage("graph");
        setWalkRoute(route.id);
      },
    }));

    const nodeCommands: PaletteCommand[] = nodes
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((node) => ({
        id: `node:${node.id}`,
        group: "Nodes",
        title: `Focus node: ${node.title || "Untitled node"}`,
        subtitle: node.alias?.trim() || (node.kind === "portal" ? "Portal node" : "Memory node"),
        keywords: `node focus ${node.title} ${node.alias ?? ""} ${node.kind}`,
        onSelect: () => focusNode(node.id),
      }));

    return [...actionCommands, ...pageCommands, ...palaceCommands, ...routeCommands, ...nodeCommands];
  }, [addRoute, currentPalace, loci, nodes, openPalace, palaces, reviewQueue.queue, routes]);

  const graphControls = currentPage === "graph";

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="shrink-0 border-b border-zinc-800 bg-[radial-gradient(circle_at_top_left,#312e81_0%,rgba(24,24,27,0.94)_36%,rgba(9,9,11,0.98)_100%)] px-3 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight text-violet-100">{title}</h1>
            <div id="context-primary-hint" className="max-w-[620px] truncate text-xs text-zinc-400">
              {hoverHint ?? defaultHint}
            </div>
          </div>

          <nav className="justify-self-center">
            <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-950/55 p-1">
              <Button
                size="sm"
                variant={currentPage === "graph" ? "default" : "ghost"}
                type="button"
                onClick={() => navigateToPage("graph")}
              >
                <Compass className="h-4 w-4" />
                Palace
              </Button>
              <Button
                size="sm"
                variant={currentPage === "review" ? "default" : "ghost"}
                type="button"
                onClick={() => navigateToPage("review")}
              >
                <Footprints className="h-4 w-4" />
                Review
              </Button>
              <Button
                size="sm"
                variant={currentPage === "insights" ? "default" : "ghost"}
                type="button"
                onClick={() => navigateToPage("insights")}
              >
                <BarChart3 className="h-4 w-4" />
                Insights
              </Button>
              <Button
                size="sm"
                variant={currentPage === "system" ? "default" : "ghost"}
                type="button"
                onClick={() => navigateToPage("system")}
              >
                <Wand2 className="h-4 w-4" />
                System
              </Button>
              <Button
                size="sm"
                variant={currentPage === "help" ? "default" : "ghost"}
                type="button"
                onClick={() => navigateToPage("help")}
              >
                <BookOpen className="h-4 w-4" />
                Help
              </Button>
            </div>
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={() => setCommandOpen(true)}>
              <Command className="h-4 w-4" />
              Palette
              <span className="hidden text-[11px] text-zinc-400 sm:inline">Ctrl/Cmd+K</span>
            </Button>

            {graphControls ? (
              <>
                <Button
                  size="sm"
                  variant={viewMode === "balanced" ? "default" : "secondary"}
                  type="button"
                  title="Balanced layout"
                  onClick={() => applyViewMode("balanced")}
                  onMouseEnter={() => setHoverHint("Balanced mode keeps the graph, sidebar, and inspector in play.")}
                  onMouseLeave={() => setHoverHint(null)}
                >
                  <Columns3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "focus" ? "default" : "secondary"}
                  type="button"
                  title="Focus mode"
                  onClick={() => applyViewMode("focus")}
                  onMouseEnter={() => setHoverHint("Focus mode strips the shell down to the canvas.")}
                  onMouseLeave={() => setHoverHint(null)}
                >
                  <Focus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  title="Toggle palace sidebar"
                  onClick={() => setShowSidebar((value) => !value)}
                  onMouseEnter={() => setHoverHint("Toggle the palace sidebar for atlas navigation and palace metadata.")}
                  onMouseLeave={() => setHoverHint(null)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  title="Toggle inspector"
                  onClick={() => setShowInspector((value) => !value)}
                  onMouseEnter={() => setHoverHint("Toggle the inspector for node, portal, and edge editing.")}
                  onMouseLeave={() => setHoverHint(null)}
                >
                  <PanelRightOpen className="h-4 w-4" />
                </Button>
              </>
            ) : null}

            <span className="text-xs text-zinc-500">{persistenceLabel}</span>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {graphControls && showSidebar ? <PalaceSidebar /> : null}

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <section className={currentPage === "graph" ? "flex min-h-0 flex-1 flex-col" : "hidden min-h-0 flex-1 flex-col"}>
            <PalaceToolbar onHoverHintChange={setHoverHint} />
            <RoutePanel onHoverHintChange={setHoverHint} />
            <WalkModeBar onHoverHintChange={setHoverHint} />
            {currentPalace ? (
              <div className="flex min-h-0 flex-1">
                <MemoryPalaceCanvas key={currentPalace.id} palaceId={currentPalace.id} editorSnapshot={snap} />
                {showInspector ? <NodeInspector /> : null}
              </div>
            ) : (
              <GraphEmptyState
                onCreateTutorialPalace={() => {
                  void createPalace("Tutorial Palace");
                }}
                onOpenHelp={() => navigateToPage("help")}
                onOpenCommandPalette={() => setCommandOpen(true)}
              />
            )}
          </section>

          {currentPage === "review" ? (
            <ReviewPage onStartRouteReview={startRouteReview} onOpenPalaceWorkspace={() => navigateToPage("graph")} />
          ) : null}

          {currentPage === "insights" ? (
            <div className="min-h-0 flex-1 overflow-hidden p-5">
              <div className="h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5">
                <AnalyticsPanel />
              </div>
            </div>
          ) : null}

          {currentPage === "system" ? (
            <div className="min-h-0 flex-1 overflow-hidden p-5">
              <div className="h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5">
                <TheSystemWorkbench />
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

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        commands={paletteCommands}
        recentIds={recentCommandIds}
        onCommandRun={trackCommandRun}
      />
    </div>
  );
}
