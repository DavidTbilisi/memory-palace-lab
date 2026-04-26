import { useEffect, useMemo, useState } from "react";
import { BookOpen, Columns3, Focus, PanelLeft, PanelRightOpen } from "lucide-react";
import { MemoryPalaceCanvas } from "../canvas/MemoryPalaceCanvas";
import { PalaceSidebar } from "../components/PalaceSidebar";
import { PalaceToolbar } from "../components/PalaceToolbar";
import { RoutePanel } from "../components/RoutePanel";
import { WalkModeBar } from "../components/WalkModeBar";
import { NodeInspector } from "../components/NodeInspector";
import { CastEdgeDialog } from "../components/CastEdgeDialog";
import { OnboardingPanel } from "../components/OnboardingPanel";
import { Button } from "../components/ui/button";
import { usePalaceStore } from "../store/palaceStore";
import { createMemoryArrow } from "../canvas/createMemoryShapes";

export function MemoryPalaceApp() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const palaces = usePalaceStore((s) => s.palaces);
  const pendingCast = usePalaceStore((s) => s.pendingCast);
  const setPendingCast = usePalaceStore((s) => s.setPendingCast);
  const persistenceState = usePalaceStore((s) => s.persistenceState);
  const draftRestored = usePalaceStore((s) => s.draftRestored);
  const lastDraftSavedAt = usePalaceStore((s) => s.lastDraftSavedAt);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [viewMode, setViewMode] = useState<"balanced" | "focus" | "learn">("balanced");
  const [hoverHint, setHoverHint] = useState<string | null>(null);

  const snap = currentPalace?.editorSnapshot;

  const castOpen = !!pendingCast;

  const onCastConfirm = (cast: { ab: string; cd: string; ef: string; gh: string; label?: string }) => {
    const p = usePalaceStore.getState().pendingCast;
    const ed = usePalaceStore.getState().editorRef;
    const palace = usePalaceStore.getState().currentPalace;
    if (!p || !ed || !palace) return;
    createMemoryArrow(ed, palace.id, p.fromShapeId, p.toShapeId, p.sourceNodeId, p.targetNodeId, cast);
    setPendingCast(null);
  };

  const title = useMemo(() => currentPalace?.name ?? "Memory Palace Lab", [currentPalace?.name]);
  const defaultHint = useMemo(() => {
    if (!currentPalace) return "Create or open a palace to begin.";
    return 'Tip: Double-click empty canvas to create a memory node, or use "Node" in the toolbar.';
  }, [currentPalace]);
  const persistenceLabel = useMemo(() => {
    if (!currentPalace) return "Local · SQLite · tldraw";
    if (persistenceState === "dirty") return "Local · SQLite · Draft pending";
    if (persistenceState === "draft" && draftRestored) return "Local · SQLite · Draft restored";
    if (persistenceState === "draft") {
      return lastDraftSavedAt
        ? `Local · SQLite · Draft saved ${new Date(lastDraftSavedAt).toLocaleTimeString()}`
        : "Local · SQLite · Draft saved";
    }
    return "Local · SQLite · Saved checkpoint";
  }, [currentPalace, draftRestored, lastDraftSavedAt, persistenceState]);

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

  const applyViewMode = (mode: "balanced" | "focus" | "learn") => {
    setViewMode(mode);
    if (mode === "balanced") {
      setShowSidebar(true);
      setShowInspector(true);
      setShowOnboarding(false);
      return;
    }
    if (mode === "focus") {
      setShowSidebar(false);
      setShowInspector(false);
      setShowOnboarding(false);
      return;
    }
    setShowSidebar(false);
    setShowInspector(false);
    setShowOnboarding(true);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight text-violet-200">{title}</h1>
          <div className="hidden max-w-[420px] truncate text-xs text-zinc-400 md:block">{hoverHint ?? defaultHint}</div>
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
        {showSidebar ? <PalaceSidebar /> : null}
        <main className="flex min-w-0 flex-1 flex-col">
          <PalaceToolbar onHoverHintChange={setHoverHint} />
          <RoutePanel onHoverHintChange={setHoverHint} />
          <WalkModeBar onHoverHintChange={setHoverHint} />
          {currentPalace ? (
            <div className="flex min-h-0 flex-1">
              <MemoryPalaceCanvas key={currentPalace.id} palaceId={currentPalace.id} editorSnapshot={snap} />
              {showInspector ? <NodeInspector /> : null}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
              Create or open a palace to begin.
            </div>
          )}
        </main>
        <OnboardingPanel
          open={showOnboarding || palaces.length === 0}
          onClose={() => {
            setShowOnboarding(false);
          }}
        />
      </div>
      <CastEdgeDialog
        open={castOpen}
        onOpenChange={(o) => {
          if (!o) setPendingCast(null);
        }}
        onConfirm={onCastConfirm}
      />
    </div>
  );
}
