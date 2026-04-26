import { useEffect, useMemo, useState } from "react";
import { BookOpen, Columns3, Focus, PanelLeft, PanelRightOpen, Search, Sparkles } from "lucide-react";
import { createMemoryArrow } from "../canvas/createMemoryShapes";
import { MemoryPalaceCanvas } from "../canvas/MemoryPalaceCanvas";
import { CastEdgeDialog } from "../components/CastEdgeDialog";
import { CommandPalette } from "../components/CommandPalette";
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
import { OnboardingPanel } from "../components/OnboardingPanel";
import { Button } from "../components/ui/button";
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
  // Add missing state and handlers
  const [currentPage, setCurrentPage] = useState("graph");
  const [commandOpen, setCommandOpen] = useState(false);
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([]);
  // Dummy paletteCommands and trackCommandRun for now
  const paletteCommands = [];
  const trackCommandRun = () => {};

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

  const title = useMemo(() => currentPalace?.name ?? "Memory Palace Lab", [currentPalace?.name]);
  const defaultHint = useMemo(() => {
    if (!currentPalace) return "Create or open a palace to begin.";
    return 'Tip: Double-click empty canvas to create a memory node, or use "Node" in the toolbar.';
  }, [currentPalace]);
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

  // Add your useEffect hooks here as needed, ensuring no duplicates or unnecessary logic

  // Add or refactor memoized values and handlers as needed, ensuring no redeclarations

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight text-violet-200">{title}</h1>
          <div className="hidden max-w-105 truncate text-xs text-zinc-400 md:block">{hoverHint ?? defaultHint}</div>
        </div>
        <div className="flex items-center gap-2">
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
        <OnboardingPanel
          open={showOnboarding || palaces.length === 0}
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
    </div>
  );
}
