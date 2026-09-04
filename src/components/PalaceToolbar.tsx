import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import {
  ArrowRight,
  Circle,
  CircleDot,
  MousePointer2,
  Link2,
  ListOrdered,
  Save,
  LocateFixed,
  ExternalLink,
  HardDrive,
  RefreshCw,
  Sparkles,
  Tag,
  X,
  Code2,
} from "lucide-react";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import type { ToolMode } from "../store/palaceStore";
import { createGeoMemoryNode } from "../canvas/createMemoryShapes";
import { shortcutHint } from "../content/shortcuts";
import { cn } from "../utils/cn";

const tools: { id: ToolMode | "save" | "portal" | "reset" | "refresh"; label: string; icon: typeof MousePointer2 }[] = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "portal", label: "Portal", icon: ExternalLink },
  { id: "connect", label: "Connect", icon: Link2 },
  { id: "route", label: "Route", icon: ListOrdered },
  { id: "reset", label: "Reset View", icon: LocateFixed },
  { id: "refresh", label: "Refresh", icon: RefreshCw },
  { id: "save", label: "Save", icon: Save },
];

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
  onOpenRepresent?: () => void;
};

const IS_TAURI_RUNTIME = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

type ToolbarStatusPopoverProps = {
  buttonLabel: string;
  title: string;
  summary: string;
  detail: string;
  icon: typeof MousePointer2;
  dotClassName: string;
};

function formatStatusTime(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ToolbarStatusPopover({
  buttonLabel,
  title,
  summary,
  detail,
  icon: Icon,
  dotClassName,
}: ToolbarStatusPopoverProps) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={buttonLabel}
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <Icon className="h-4 w-4" />
          <span aria-hidden="true" className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${dotClassName}`} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 w-[min(280px,88vw)] rounded-2xl border border-zinc-700/80 bg-zinc-950/96 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</div>
          <div className="mt-2 text-sm font-medium text-zinc-100">{summary}</div>
          <div className="mt-1 text-sm leading-6 text-zinc-400">{detail}</div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function PalaceToolbar({ onHoverHintChange, onOpenRepresent }: Props) {
  const toolMode = usePalaceStore((s) => s.toolMode);
  const setToolMode = usePalaceStore((s) => s.setToolMode);
  const comprehendActive = usePalaceStore((s) => s.appMode === "comprehend");
  const routePanelOpen = usePalaceStore((s) => s.routePanelOpen);
  const setRoutePanelOpen = usePalaceStore((s) => s.setRoutePanelOpen);
  const dslPaneOpen = usePalaceStore((s) => s.dslPaneOpen);
  const setDslPaneOpen = usePalaceStore((s) => s.setDslPaneOpen);
  const availableTags = usePalaceStore((s) => s.availableTags);
  const activeTags = usePalaceStore((s) => s.activeTags);
  const toggleActiveTag = usePalaceStore((s) => s.toggleActiveTag);
  const clearActiveTags = usePalaceStore((s) => s.clearActiveTags);
  const connectFromShapeId = usePalaceStore((s) => s.connect.fromShapeId);
  const setConnectFrom = usePalaceStore((s) => s.setConnectFrom);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const reloadCurrentPalaceFromDisk = usePalaceStore((s) => s.reloadCurrentPalaceFromDisk);
  const setExternalChangePending = usePalaceStore((s) => s.setExternalChangePending);
  const persistenceState = usePalaceStore((s) => s.persistenceState);
  const draftRestored = usePalaceStore((s) => s.draftRestored);
  const lastDraftSavedAt = usePalaceStore((s) => s.lastDraftSavedAt);
  const lastCheckpointSavedAt = usePalaceStore((s) => s.lastCheckpointSavedAt);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const needsCheckpoint = persistenceState === "dirty" || persistenceState === "draft";
  const storageSummary = IS_TAURI_RUNTIME ? "Desktop storage: SQLite" : "Browser storage: local storage";
  const storageDetail = IS_TAURI_RUNTIME
    ? "Desktop mode writes palaces to the local SQLite database through Tauri commands."
    : "GitHub deployment stores palaces, analytics, and drafts in this browser's local storage.";
  const autoSaveSummary = !currentPalace
    ? "Auto-save: idle"
    : persistenceState === "dirty"
      ? "Auto-save: pending"
      : persistenceState === "draft" && draftRestored
        ? "Auto-save: restored from recovery draft"
        : persistenceState === "draft"
          ? lastDraftSavedAt
            ? `Auto-save: saved ${formatStatusTime(lastDraftSavedAt)}`
            : "Auto-save: saved"
          : "Auto-save: synced";
  const autoSaveDetail = !currentPalace
    ? "No palace is open, so auto-save is inactive."
    : persistenceState === "dirty"
      ? "Recent edits are waiting for the short auto-save delay before a recovery draft is written."
      : persistenceState === "draft" && draftRestored
        ? "A recovery draft was restored when this palace opened. Save a checkpoint if you want to keep it intentionally."
        : persistenceState === "draft"
          ? "A recovery draft is already written in the background. It protects work but is not the intentional checkpoint."
          : "The current palace is synced and no recovery draft is waiting.";
  const checkpointSummary = !currentPalace
    ? "Checkpoint: none"
    : lastCheckpointSavedAt
      ? `Checkpoint: saved ${formatStatusTime(lastCheckpointSavedAt)}`
      : "Checkpoint: save intentionally";
  const checkpointDetail = !currentPalace
    ? "Open or create a palace before saving an intentional checkpoint."
    : lastCheckpointSavedAt
      ? "Checkpoint saves are the deliberate version you are choosing to keep, separate from background recovery drafts."
      : "No deliberate checkpoint has been saved for this open palace in the current session.";
  const autoSaveDotClassName =
    !currentPalace ? "bg-zinc-500" : persistenceState === "dirty" || draftRestored ? "bg-amber-300" : "bg-emerald-300";
  const checkpointDotClassName =
    !currentPalace || !lastCheckpointSavedAt || persistenceState === "dirty" || persistenceState === "draft"
      ? currentPalace
        ? "bg-amber-300"
        : "bg-zinc-500"
      : "bg-emerald-300";
  const refreshFromDisk = async () => {
    await loadPalaces();
    const palace = usePalaceStore.getState().currentPalace;
    if (!palace) return;
    if (usePalaceStore.getState().persistenceState === "clean") {
      await reloadCurrentPalaceFromDisk();
    } else {
      // Unsaved work: hand off to the ExternalChangeBanner so the user
      // explicitly picks reload-and-discard vs keep-mine.
      setExternalChangePending({ palaceId: palace.id, op: "manual refresh" });
    }
  };

  const connectStepLabel = connectFromShapeId ? "Step 2: pick target" : "Step 1: pick source";
  const connectStepDetail = connectFromShapeId
    ? "Source locked. Click the destination node to open the edge dialog, or cancel to choose a different source."
    : "Connect mode is armed. Click the node that starts the relationship.";

  return (
    <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950/90 px-2 py-1.5">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1 transition",
          comprehendActive && "pointer-events-none opacity-40",
        )}
        aria-hidden={comprehendActive}
      >
        {tools.map((t) => {
          const Icon = t.icon;
          if (t.id === "save") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant={needsCheckpoint ? "default" : "secondary"}
                type="button"
                title={needsCheckpoint ? "Checkpoint recommended" : "Save checkpoint intentionally"}
                className={cn(
                  "relative",
                  needsCheckpoint &&
                    "border border-amber-300/70 bg-amber-400 text-zinc-950 shadow-[0_0_0_1px_rgba(251,191,36,0.25),0_10px_24px_rgba(251,191,36,0.18)] hover:bg-amber-300",
                )}
                onClick={() => void saveCurrent()}
                onMouseEnter={() =>
                  onHoverHintChange?.(
                    needsCheckpoint
                      ? "Auto-save protected the draft. Save Checkpoint now if this state is worth keeping intentionally."
                      : "Save Checkpoint is intentional. Auto-save already runs in the background for recovery drafts.",
                  )
                }
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                {needsCheckpoint ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-200 ring-2 ring-zinc-950"
                  />
                ) : null}
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{needsCheckpoint ? "Checkpoint Now" : "Save Checkpoint"}</span>
              </Button>
            );
          }
          if (t.id === "reset") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant="outline"
                type="button"
                title="Reset canvas view"
                disabled={!editorRef}
                onMouseEnter={() => onHoverHintChange?.("Reset View: zoom to fit current canvas content.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
                onClick={() => {
                  if (!editorRef) return;
                  editorRef.zoomToFit();
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">Reset</span>
              </Button>
            );
          }
          if (t.id === "refresh") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant="outline"
                type="button"
                title="Reload palaces and the open palace from disk"
                onMouseEnter={() =>
                  onHoverHintChange?.(
                    "Refresh: reload the palace list and the open palace from disk — picks up changes made outside the app (e.g. Claude via MCP).",
                  )
                }
                onMouseLeave={() => onHoverHintChange?.(null)}
                onClick={() => void refreshFromDisk()}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{t.label}</span>
              </Button>
            );
          }
          if (t.id === "portal") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant="outline"
                type="button"
                title="Add palace portal at viewport center"
                disabled={!editorRef || !currentPalace}
                onMouseEnter={() =>
                  onHoverHintChange?.("Portal: create a node that links to another palace or a route inside it.")
                }
                onMouseLeave={() => onHoverHintChange?.(null)}
                onClick={() => {
                  setRoutePanelOpen(false);
                  if (!editorRef || !currentPalace) return;
                  const vp = editorRef.getViewportPageBounds();
                  createGeoMemoryNode(
                    editorRef,
                    currentPalace.id,
                    {
                      x: vp.x + vp.w / 2,
                      y: vp.y + vp.h / 2,
                    },
                    {
                      title: "Palace portal",
                      content: "Open another palace or route from this graph.",
                      kind: "portal",
                    },
                  );
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">Portal</span>
              </Button>
            );
          }
          if (t.id === "route") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant={routePanelOpen ? "default" : "secondary"}
                type="button"
                title={routePanelOpen ? "Hide route panel" : "Show route panel"}
                onClick={() => {
                  const nextOpen = !routePanelOpen;
                  setRoutePanelOpen(nextOpen);
                  setToolMode(nextOpen ? "route" : "select");
                }}
                onMouseEnter={() =>
                  onHoverHintChange?.(
                    routePanelOpen
                      ? "Route panel open: click to collapse and reclaim canvas space."
                      : "Route panel collapsed: click to expand route and locus controls.",
                  )
                }
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{t.label}</span>
              </Button>
            );
          }
          const active = toolMode === t.id;
          if (t.id === "connect") {
            return (
              <div key={t.id} className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={active ? "default" : "ghost"}
                  type="button"
                  title={t.label}
                  onClick={() => {
                    setRoutePanelOpen(false);
                    setToolMode(t.id as ToolMode);
                  }}
                  onMouseEnter={() =>
                    onHoverHintChange?.(
                      active
                        ? connectStepDetail
                        : "Connect: arm edge mode, click a source node, then click a target node.",
                    )
                  }
                  onMouseLeave={() => onHoverHintChange?.(null)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{t.label}</span>
                </Button>
                {active ? (
                  <div
                    className="flex h-8 items-center gap-1 rounded-md border border-violet-500/35 bg-violet-500/10 px-2 text-[11px] text-violet-100"
                    onMouseEnter={() => onHoverHintChange?.(connectStepDetail)}
                    onMouseLeave={() => onHoverHintChange?.(null)}
                  >
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                        connectFromShapeId
                          ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
                          : "border-violet-300/60 bg-violet-500/25 text-violet-50",
                      )}
                      aria-hidden="true"
                    >
                      <CircleDot className="h-3 w-3" />
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-violet-300/80" aria-hidden="true" />
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                        connectFromShapeId
                          ? "border-amber-300/70 bg-amber-400/20 text-amber-100"
                          : "border-zinc-700 text-zinc-500",
                      )}
                      aria-hidden="true"
                    >
                      <Circle className="h-3 w-3" />
                    </span>
                    <span className="hidden md:inline">{connectStepLabel}</span>
                    {connectFromShapeId ? (
                      <button
                        type="button"
                        aria-label="Pick a different source node"
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-violet-200 transition hover:bg-violet-400/20 hover:text-white"
                        onClick={() => setConnectFrom(null)}
                        onMouseEnter={() =>
                          onHoverHintChange?.("Cancel the current source selection and pick a different node.")
                        }
                        onMouseLeave={() => onHoverHintChange?.(null)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <Button
              key={t.id}
              size="sm"
              variant={active ? "default" : "ghost"}
              type="button"
              title={t.label}
              onClick={() => {
                setRoutePanelOpen(false);
                setToolMode(t.id as ToolMode);
              }}
              onMouseEnter={() =>
                onHoverHintChange?.(
                  t.id === "select"
                    ? "Select: move/edit shapes and nodes."
                    : "Route tool: build ordered memory paths with route controls.",
                )
              }
              onMouseLeave={() => onHoverHintChange?.(null)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden lg:inline">{t.label}</span>
            </Button>
          );
        })}
        <Button
          size="sm"
          variant={dslPaneOpen ? "default" : "ghost"}
          type="button"
          title={`Toggle DSL editor${shortcutHint("dsl")}`}
          aria-pressed={dslPaneOpen}
          onClick={() => setDslPaneOpen(!dslPaneOpen)}
          onMouseEnter={() =>
            onHoverHintChange?.("DSL editor: edit the palace as text in a split pane. Changes sync both ways.")
          }
          onMouseLeave={() => onHoverHintChange?.(null)}
        >
          <Code2 className="h-4 w-4" />
          <span className="hidden lg:inline">DSL</span>
        </Button>
        {onOpenRepresent ? (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            title="Represent: scaffold from a motif"
            onClick={() => onOpenRepresent()}
            onMouseEnter={() =>
              onHoverHintChange?.(
                "Represent: pick a motif (cascade, diamond, hub-spoke, feedback loop) and seed the palace.",
              )
            }
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden lg:inline">Represent</span>
          </Button>
        ) : null}
      </div>
      {(availableTags?.length ?? 0) > 0 && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              title="Filter nodes by tag"
              className={`ml-2 inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium transition ${
                activeTags.length > 0
                  ? "border-violet-500/60 bg-violet-500/15 text-violet-200"
                  : "border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              <Tag className="h-3 w-3" />
              {activeTags.length > 0
                ? <span>{activeTags.length === 1 ? `#${activeTags[0]}` : `${activeTags.length} tags`}</span>
                : <span className="hidden sm:inline">Tags</span>}
              {activeTags.length > 0 && (
                <span
                  role="button"
                  aria-label="Clear tag filter"
                  tabIndex={0}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-violet-400/20"
                  onClick={(e) => { e.stopPropagation(); clearActiveTags(); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); clearActiveTags(); } }}
                >
                  <X className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={6}
              avoidCollisions
              collisionPadding={12}
              className="z-[400] flex max-h-[40vh] w-[min(320px,90vw)] flex-wrap content-start gap-1.5 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleActiveTag(tag)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                    activeTags.includes(tag)
                      ? "bg-violet-500 text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
      <div className="ml-auto flex items-center gap-1.5 border-l border-zinc-800 pl-2">
        <ToolbarStatusPopover
          buttonLabel="Storage details"
          title="Storage"
          summary={storageSummary}
          detail={storageDetail}
          icon={HardDrive}
          dotClassName="bg-sky-300"
        />
        <ToolbarStatusPopover
          buttonLabel="Auto-save details"
          title="Auto-save"
          summary={autoSaveSummary}
          detail={autoSaveDetail}
          icon={RefreshCw}
          dotClassName={autoSaveDotClassName}
        />
        <ToolbarStatusPopover
          buttonLabel="Checkpoint details"
          title="Checkpoint"
          summary={checkpointSummary}
          detail={checkpointDetail}
          icon={Save}
          dotClassName={checkpointDotClassName}
        />
      </div>
    </div>
  );
}
