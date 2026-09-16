import { useEffect } from "react";
import { routeColorHex } from "../domain/services/routeBuilder";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

/** Escape belongs to the field, menu, or dialog it was pressed in. */
function escapeHandledElsewhere(target: EventTarget | null) {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;
  if (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)) return true;
  return element.closest('[role="menu"], [role="dialog"], [role="alertdialog"]') !== null;
}

/** Floating status over the canvas while Route mode is on: which route, what to do, how to stop. */
export function RouteBuildBanner() {
  const building = usePalaceStore((s) => s.toolMode === "route" && !s.walkOpen);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const notice = usePalaceStore((s) => s.routeNotice);
  const setRouteBuilding = usePalaceStore((s) => s.setRouteBuilding);

  useEffect(() => {
    if (!building) return;
    // Capture phase: the canvas handles Escape itself (deselect) and may stop it there.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || escapeHandledElsewhere(event.target)) return;
      setRouteBuilding(false);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [building, setRouteBuilding]);

  const routeIndex = routes.findIndex((route) => route.id === (walkRouteId ?? routes[0]?.id));
  const route = routes[routeIndex];
  if (!building || !route) return null;

  const stopCount = loci.filter((locus) => locus.routeId === route.id).length;
  const hint =
    stopCount === 0
      ? `Click nodes in walk order to build ${route.name}. Double-click empty space to add a new node.`
      : `${route.name}: ${stopCount} ${stopCount === 1 ? "stop" : "stops"}. Click the next node.`;

  // Bottom centre, above tldraw's toolbar: tldraw's panels sit above this layer, and its style
  // panel fills the top right whenever a node is selected.
  return (
    <div
      data-testid="route-build-banner"
      className="pointer-events-auto absolute bottom-[72px] left-1/2 z-30 flex max-w-[min(36rem,calc(100%-2rem))] -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/95 py-1 pl-3 pr-1 text-xs text-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
    >
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: routeColorHex(route, routeIndex) }}
      />
      <span role="status" aria-live="polite" className="min-w-0 truncate">
        {notice?.message ?? hint}
      </span>
      <Button
        size="sm"
        type="button"
        className="h-7 shrink-0 rounded-full px-3"
        title="Finish adding stops (Esc)"
        onClick={() => setRouteBuilding(false)}
      >
        Done
      </Button>
    </div>
  );
}
