import { useEffect, useMemo, useState } from "react";
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
import { CommandPalette } from "../components/CommandPalette";
import { ContextualTipCard } from "../components/ContextualTipCard";
import { GlossaryPanel } from "../components/GlossaryPanel";
import { HelpCenterPage } from "../components/HelpCenterPage";
import { AnalyticsPanel } from "../components/AnalyticsPanel";
// Duplicate import removed
import { PalaceSidebar } from "../components/PalaceSidebar";
import { PalaceToolbar } from "../components/PalaceToolbar";
import { ReviewPage } from "../components/ReviewPage";
import { RouteEditorPage } from "../components/RouteEditorPage";
import { RoutePanel } from "../components/RoutePanel";
import { TheSystemWorkbench } from "../components/TheSystemWorkbench";
import { WalkModeBar } from "../components/WalkModeBar";
import { NodeInspector } from "../components/NodeInspector";
// Duplicate import removed
import { OnboardingPanel } from "../components/OnboardingPanel";
import { Button } from "../components/ui/button";
import { usePalaceStore } from "../store/palaceStore";

type AppPage = "graph" | "review" | "insights" | "system" | "atlas" | "routes" | "help";

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
    // Additional state and placeholder logic to resolve missing references
    const [commandOpen, setCommandOpen] = useState(false);
    const [glossaryOpen, setGlossaryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<AppPage>("graph");
    // Placeholder for recentCommandIds (should be replaced with actual logic if available)
    const [recentCommandIds, setRecentCommandIds] = useState<string[]>([]);
    // Placeholder for graphControls (should be replaced with actual logic if available)
    const graphControls = true;
    // Placeholder for editorRef and selectedShapeId (should be replaced with actual logic if available)
    const editorRef = null;
    const selectedShapeId = null;
    // Placeholder for routes, loci, walkOpen, toolMode (should be replaced with actual logic if available)
    const routes: any[] = [];
    const loci: any[] = [];
    const walkOpen = false;
    const toolMode = null;
    // Placeholder for buildReviewQueue and buildPrimaryContextHint (should be replaced with actual logic if available)
    const buildReviewQueue = () => [];
    const buildPrimaryContextHint = () => "";
    const trackCommandRun = () => {};
    const startRouteReview = () => {};
    const createPalace = () => {};

    const paletteCommands: any[] = useMemo(() => {
      const baseCommands = [
        { id: "action-glossary", group: "Actions" as const, title: "Open vocabulary glossary", onSelect: () => setGlossaryOpen(true) },
        { id: "page-graph", group: "Pages" as const, title: "Graph workspace", subtitle: "Edit palette structure", onSelect: () => navigateToPage("graph") },
        { id: "page-review", group: "Pages" as const, title: "Review queue", subtitle: "Spaced review scheduling", onSelect: () => navigateToPage("review") },
        { id: "page-insights", group: "Pages" as const, title: "Insights dashboard", subtitle: "Memory strength telemetry", onSelect: () => navigateToPage("insights") },
        { id: "page-system", group: "Pages" as const, title: "System workbench", subtitle: "Run frameworks as pipelines", onSelect: () => navigateToPage("system") },
        { id: "page-atlas", group: "Pages" as const, title: "Atlas hierarchy", subtitle: "Organize palaces by geography", onSelect: () => navigateToPage("atlas") },
        { id: "page-help", group: "Pages" as const, title: "Help center", subtitle: "Onboarding and guides", onSelect: () => navigateToPage("help") },

        { id: "doc-walk-mode", group: "Docs" as const, title: "Walk Mode — recall-first review", subtitle: "Test before revealing answers", onSelect: () => navigateToPage("help") },
        { id: "doc-cast-edges", group: "Docs" as const, title: "CAST Edges — connection types", subtitle: "Causal, Associative, Structural, Temporal", onSelect: () => navigateToPage("help") },
        { id: "doc-spaced-review", group: "Docs" as const, title: "Spaced Repetition — scheduling", subtitle: "Review at the right time", onSelect: () => navigateToPage("review") },
        { id: "doc-encoding", group: "Docs" as const, title: "Encoding — vivid memory cues", subtitle: "Transform dry facts into images", onSelect: () => navigateToPage("help") },
        { id: "doc-loci", group: "Docs" as const, title: "Loci — anchor points in palaces", subtitle: "Physical and mental locations", onSelect: () => navigateToPage("help") },
      ];
      return baseCommands;
    }, []);
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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [viewMode, setViewMode] = useState<"balanced" | "focus">("balanced");
  const [hoverHint, setHoverHint] = useState<string | null>(null);

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

  // Remove redeclared variables (already defined later in the file)

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
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setGlossaryOpen((open) => !open);
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
    setShowOnboarding(true);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="grid shrink-0 grid-cols-3 items-center border-b border-zinc-800 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="shrink-0 text-sm font-semibold tracking-tight text-violet-200">{title}</h1>
          <div className="hidden w-full max-w-[320px] truncate text-xs text-zinc-400 md:block">{hoverHint ?? defaultHint}</div>
        </div>

        <nav className="flex justify-center items-center gap-1">
          {(["graph", "review", "insights", "system", "atlas", "routes", "help"] as const).map((page) => {
            const icons: Record<typeof page, React.ReactNode> = {
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
                onMouseEnter={() => setHoverHint(`${labels[page]} — ${pageHint(page) || "workspace area"}`)}
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
            onMouseEnter={() => setHoverHint("Balanced mode: keeps side panels visible for editing + navigation.")}
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
            onMouseEnter={() => setHoverHint("Toggle palace sidebar: show/hide palace list and create controls.")}
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
            onMouseEnter={() => setHoverHint("Toggle inspector: show/hide node title and content editor.")}
            onMouseLeave={() => setHoverHint(null)}
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => setShowOnboarding((v) => !v)}
            onMouseEnter={() =>
              setHoverHint("Learn panel: onboarding guides plus theSystem pipelines that can materialize into the graph.")
            }
            onMouseLeave={() => setHoverHint(null)}
          >
            <BookOpen className="h-4 w-4" />
            Learn
          </Button>
          <span className="text-xs text-zinc-500">{persistenceLabel}</span>
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
                <AtlasEditorPage onOpenPalace={(palaceId) => {
                  const palace = palaces.find(p => p.id === palaceId);
                  if (palace) {
                    void usePalaceStore.getState().openPalace(palace.id);
                    navigateToPage("graph");
                  }
                }} />
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

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        commands={paletteCommands}
        recentIds={recentCommandIds}
        onCommandRun={trackCommandRun}
      />

      <GlossaryPanel open={glossaryOpen} onOpenChange={setGlossaryOpen} />
    </div>
  );
}
