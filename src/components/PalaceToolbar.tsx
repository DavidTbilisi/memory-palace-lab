import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MousePointer2,
  Link2,
  ListOrdered,
  ImageIcon,
  Save,
  SquarePlus,
  LocateFixed,
  ExternalLink,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import type { ToolMode } from "../store/palaceStore";
import { createGeoMemoryNode } from "../canvas/createMemoryShapes";
import { cn } from "../utils/cn";

const tools: { id: ToolMode | "save" | "bg" | "node" | "portal" | "reset"; label: string; icon: typeof MousePointer2 }[] = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "node", label: "Add Node", icon: SquarePlus },
  { id: "portal", label: "Portal", icon: ExternalLink },
  { id: "connect", label: "Connect", icon: Link2 },
  { id: "route", label: "Route", icon: ListOrdered },
  { id: "reset", label: "Reset View", icon: LocateFixed },
  { id: "bg", label: "Background", icon: ImageIcon },
  { id: "save", label: "Save", icon: Save },
];

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
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

export function PalaceToolbar({ onHoverHintChange }: Props) {
  const toolMode = usePalaceStore((s) => s.toolMode);
  const setToolMode = usePalaceStore((s) => s.setToolMode);
  const routePanelOpen = usePalaceStore((s) => s.routePanelOpen);
  const setRoutePanelOpen = usePalaceStore((s) => s.setRoutePanelOpen);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
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

  return (
    <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950/90 px-2 py-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-1">
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
          if (t.id === "bg") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant="outline"
                type="button"
                title="Background image"
                disabled={!editorRef || !currentPalace}
                onMouseEnter={() => onHoverHintChange?.("Background image: place a map/room image as world layer.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
                onClick={() => {
                  if (!editorRef || !currentPalace) return;
                  void import("../canvas/backgroundImageImport").then(({ insertBackgroundImageFromFile }) =>
                    insertBackgroundImageFromFile(editorRef, currentPalace.id),
                  );
                }}
              >
                <Icon className="h-4 w-4" />
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
          if (t.id === "node") {
            return (
              <Button
                key={t.id}
                size="sm"
                variant="outline"
                type="button"
                title="Add memory node at viewport center"
                disabled={!editorRef || !currentPalace}
                onMouseEnter={() => onHoverHintChange?.("Add Node: create a memory node at the center of current view.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
                onClick={() => {
                  setRoutePanelOpen(false);
                  if (!editorRef || !currentPalace) return;
                  const vp = editorRef.getViewportPageBounds();
                  createGeoMemoryNode(editorRef, currentPalace.id, {
                    x: vp.x + vp.w / 2,
                    y: vp.y + vp.h / 2,
                  });
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">Node</span>
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
                    : t.id === "connect"
                      ? "Connect: click source node then target node to open CAST edge menu."
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
      </div>
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
