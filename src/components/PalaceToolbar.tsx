import { MousePointer2, Link2, ListOrdered, ImageIcon, Save, SquarePlus, LocateFixed, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import type { ToolMode } from "../store/palaceStore";
import { createGeoMemoryNode } from "../canvas/createMemoryShapes";

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

export function PalaceToolbar({ onHoverHintChange }: Props) {
  const toolMode = usePalaceStore((s) => s.toolMode);
  const setToolMode = usePalaceStore((s) => s.setToolMode);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const persistenceState = usePalaceStore((s) => s.persistenceState);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const currentPalace = usePalaceStore((s) => s.currentPalace);

  return (
    <div className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-950/90 px-2 py-1.5">
      {tools.map((t) => {
        const Icon = t.icon;
        if (t.id === "save") {
          return (
            <Button
              key={t.id}
              size="sm"
              variant={persistenceState === "clean" ? "secondary" : "default"}
              type="button"
              title="Save checkpoint (SQLite)"
              onClick={() => void saveCurrent()}
              onMouseEnter={() =>
                onHoverHintChange?.(
                  "Save checkpoint: commit the current draft to SQLite and clear the temporary recovery draft.",
                )
              }
              onMouseLeave={() => onHoverHintChange?.(null)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
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
        const active = toolMode === t.id;
        return (
          <Button
            key={t.id}
            size="sm"
            variant={active ? "default" : "ghost"}
            type="button"
            title={t.label}
            onClick={() => setToolMode(t.id as ToolMode)}
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
  );
}
