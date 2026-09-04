import type { MouseEvent as ReactMouseEvent } from "react";
import { MemoryPalaceCanvas } from "../canvas/MemoryPalaceCanvas";
import { usePalaceStore } from "../store/palaceStore";
import { AssessBanner } from "./AssessBanner";
import { ComprehendOverlay } from "./ComprehendOverlay";
import { ExternalChangeBanner } from "./ExternalChangeBanner";
import { GraphEmptyState } from "./GraphEmptyState";
import { NextUpCard } from "./NextUpCard";
import { NodeInspector } from "./NodeInspector";
import { PalaceDslEditor } from "./PalaceDslEditor";
import { PalaceToolbar } from "./PalaceToolbar";
import { RoutePanel } from "./RoutePanel";
import { WalkModeBar } from "./WalkModeBar";
import type { AssessHint } from "./hooks/useAssessHint";

/**
 * The graph editing surface: toolbar, route panel, walk bar, optional Assess
 * banner, and the DSL-pane / canvas / inspector layout (or the empty state
 * when no palace is open). Stays mounted and is shown/hidden via `isActive` so
 * the canvas editor instance is preserved across page navigation.
 */
export function GraphWorkspace({
  isActive,
  assessHint,
  dslSplitRatio,
  onDslSeparatorMouseDown,
  showInspector,
  onHoverHintChange,
  onOpenRepresent,
  onCreateTutorialPalace,
  onOpenHelp,
  onOpenCommandPalette,
  onOpenImport,
}: {
  isActive: boolean;
  assessHint: AssessHint | null;
  dslSplitRatio: number;
  onDslSeparatorMouseDown: (event: ReactMouseEvent) => void;
  showInspector: boolean;
  onHoverHintChange: (hint: string | null) => void;
  onOpenRepresent: () => void;
  onCreateTutorialPalace: () => void;
  onOpenHelp: () => void;
  onOpenCommandPalette: () => void;
  onOpenImport: () => void;
}) {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routePanelOpen = usePalaceStore((s) => s.routePanelOpen);
  const dslPaneOpen = usePalaceStore((s) => s.dslPaneOpen);
  const comprehendActive = usePalaceStore((s) => s.appMode === "comprehend");
  const canvasReloadKey = usePalaceStore((s) => s.canvasReloadKey);
  const snap = currentPalace?.editorSnapshot;

  return (
    <section className={isActive ? "flex min-h-0 flex-1 flex-col" : "hidden min-h-0 flex-1 flex-col"}>
      <PalaceToolbar onHoverHintChange={onHoverHintChange} onOpenRepresent={onOpenRepresent} />
      {routePanelOpen ? <RoutePanel onHoverHintChange={onHoverHintChange} /> : null}
      <WalkModeBar onHoverHintChange={onHoverHintChange} />
      <ExternalChangeBanner />
      {assessHint && currentPalace ? (
        <div className="border-b border-zinc-800 px-2 py-2">
          <AssessBanner
            palaceName={currentPalace.name}
            sourcePalaceName={assessHint.sourcePalaceName}
            score={assessHint.score}
            takeaway={assessHint.record.takeaway}
            adjustment={assessHint.record.adjustment}
            onJump={assessHint.jump}
            onDismiss={assessHint.dismiss}
          />
        </div>
      ) : null}
      {currentPalace ? <NextUpCard /> : null}
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
                onMouseDown={onDslSeparatorMouseDown}
                className="w-1.5 cursor-col-resize bg-zinc-800 hover:bg-violet-500/40"
              />
            </>
          ) : null}
          <div className="flex min-h-0 min-w-0 flex-1">
            <MemoryPalaceCanvas
              key={`${currentPalace.id}:${canvasReloadKey}`}
              palaceId={currentPalace.id}
              editorSnapshot={snap}
            />
          </div>
          {comprehendActive ? <ComprehendOverlay /> : showInspector ? <NodeInspector /> : null}
        </div>
      ) : (
        <GraphEmptyState
          onCreateTutorialPalace={onCreateTutorialPalace}
          onOpenHelp={onOpenHelp}
          onOpenCommandPalette={onOpenCommandPalette}
          onOpenImport={onOpenImport}
        />
      )}
    </section>
  );
}
