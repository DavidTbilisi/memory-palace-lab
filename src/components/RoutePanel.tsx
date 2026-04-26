import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { usePalaceStore } from "../store/palaceStore";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import type { TLShapeId } from "@tldraw/tlschema";
import { resolveMemoryNodeTitle } from "../canvas/readShapeText";

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
};

export function RoutePanel({ onHoverHintChange }: Props) {
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const addRoute = usePalaceStore((s) => s.addRoute);
  const addLocusForSelectedRoute = usePalaceStore((s) => s.addLocusForSelectedRoute);
  const updateRouteName = usePalaceStore((s) => s.updateRouteName);
  const updateLocusLabel = usePalaceStore((s) => s.updateLocusLabel);
  const moveLocus = usePalaceStore((s) => s.moveLocus);
  const deleteLocus = usePalaceStore((s) => s.deleteLocus);
  const reassignLocusRoute = usePalaceStore((s) => s.reassignLocusRoute);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const [routeName, setRouteName] = useState("Main path");
  const [activeRouteName, setActiveRouteName] = useState("");

  const activeRoute = walkRouteId ?? routes[0]?.id ?? null;
  const activeRouteRecord = routes.find((route) => route.id === activeRoute) ?? null;
  const routeLoci = useMemo(
    () => loci.filter((l) => l.routeId === activeRoute).sort((a, b) => a.orderIndex - b.orderIndex),
    [loci, activeRoute],
  );
  const activeWalkNodeId = routeLoci[walkIndex]?.nodeId ?? null;

  useEffect(() => {
    setActiveRouteName(activeRouteRecord?.name ?? "");
  }, [activeRouteRecord?.name]);

  const nodeTitleById = (() => {
    const map = new Map<string, string>();
    if (!editorRef) return map;
    for (const shapeId of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(shapeId as TLShapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = shape.meta as MemoryPalaceMeta;
      if (!meta.mpNodeId) continue;
      map.set(meta.mpNodeId, meta.mpTitle?.trim() || resolveMemoryNodeTitle(shape));
    }
    return map;
  })();

  const addSelectedNodeToRoute = () => {
    if (!editorRef) return;
    const editorSelection = editorRef.getSelectedShapeIds();
    const selectedId = editorSelection[0] ?? selectedShapeId;
    if (!selectedId) return;
    const sh = editorRef.getShape(selectedId as TLShapeId);
    if (!sh || sh.type !== "geo") return;
    const m = sh.meta as MemoryPalaceMeta;
    if (!m.mpNodeId) return;
    addLocusForSelectedRoute(m.mpNodeId, m.mpTitle?.trim() || resolveMemoryNodeTitle(sh));
  };

  const commitActiveRouteName = () => {
    if (!activeRoute) return;
    updateRouteName(activeRoute, activeRouteName);
  };

  return (
    <div className="border-b border-zinc-800 bg-zinc-950/95 p-2">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <Label className="text-xs">Routes</Label>
          <select
            aria-label="Active route"
            className="mt-1 block min-w-[140px] rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
            value={activeRoute ?? ""}
            onChange={(e) => setWalkRoute(e.target.value || null)}
            onMouseEnter={() => onHoverHintChange?.("Routes dropdown: choose which route receives new loci and walk steps.")}
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            {routes.length === 0 ? <option value="">(none)</option> : null}
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        {activeRoute ? (
          <div>
            <Label className="text-xs">Route details</Label>
            <Input
              aria-label="Selected route name"
              className="mt-1 h-8 w-44 text-xs"
              value={activeRouteName}
              onBlur={commitActiveRouteName}
              onChange={(e) => setActiveRouteName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitActiveRouteName();
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
        ) : null}
        <div className="flex gap-1">
          <Input
            className="h-8 w-36 text-xs"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Route name"
            onMouseEnter={() => onHoverHintChange?.("Enter a new route name before clicking Add route.")}
            onMouseLeave={() => onHoverHintChange?.(null)}
          />
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={() => addRoute(routeName)}
            onMouseEnter={() => onHoverHintChange?.("Add route: creates an empty ordered path for loci.")}
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            Add route
          </Button>
        </div>
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={addSelectedNodeToRoute}
          onMouseEnter={() =>
            onHoverHintChange?.("Add selected node to route: first click a node on canvas, then click this.")
          }
          onMouseLeave={() => onHoverHintChange?.(null)}
        >
          Add selected node to route
        </Button>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        How to create loci: select a route, click a canvas node, then press "Add selected node to route".
      </p>
      {activeRoute ? (
        <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-zinc-400">
          {routeLoci.map((l, i) => {
            const title = nodeTitleById.get(l.nodeId) ?? `Node ${l.nodeId.slice(0, 8)}...`;
            const isCurrent = walkOpen && l.nodeId === activeWalkNodeId;
            return (
              <li
                key={l.id}
                className={`rounded border border-zinc-800 px-2 py-1 ${
                  isCurrent ? "bg-violet-900/40 text-violet-200" : "bg-zinc-950/40"
                }`}
                title={l.nodeId}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-8 shrink-0 text-zinc-500">
                    {isCurrent ? ">" : ""} {i + 1}.
                  </span>
                  <input
                    value={l.label || title}
                    onChange={(e) => updateLocusLabel(l.id, e.target.value)}
                    className="h-6 min-w-40 flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 text-xs text-zinc-100"
                    aria-label={`Locus ${i + 1} label`}
                  />
                  <select
                    aria-label={`Locus ${i + 1} route`}
                    className="h-6 max-w-36 rounded border border-zinc-700 bg-zinc-900 px-1 text-xs text-zinc-100"
                    value={l.routeId}
                    onChange={(e) => reassignLocusRoute(l.id, e.target.value)}
                  >
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    disabled={i === 0}
                    aria-label={`Move locus ${i + 1} up`}
                    onClick={() => moveLocus(l.id, "up")}
                  >
                    Up
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    disabled={i === routeLoci.length - 1}
                    aria-label={`Move locus ${i + 1} down`}
                    onClick={() => moveLocus(l.id, "down")}
                  >
                    Down
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    aria-label={`Delete locus ${i + 1}`}
                    onClick={() => deleteLocus(l.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
