import { Camera, CameraOff } from "lucide-react";
import { useEffect } from "react";
import { routeColorHex } from "../domain/services/routeBuilder";
import { usePalaceStore } from "../store/palaceStore";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";

/** Escape belongs to the field, menu, or dialog it was pressed in. */
function escapeHandledElsewhere(target: EventTarget | null) {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;
  if (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)) return true;
  return element.closest('[role="menu"], [role="dialog"], [role="alertdialog"]') !== null;
}

/**
 * Status while Route mode is on: which route, what to do, how to stop. The canvas renders it
 * as tldraw's top panel, which tldraw lays out between its page menu and style panel, so
 * neither panel covers it whatever the canvas size.
 */
export function RouteBuildBanner() {
  const building = usePalaceStore((s) => s.toolMode === "route" && !s.walkOpen);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const notice = usePalaceStore((s) => s.routeNotice);
  const saveStopViews = usePalaceStore((s) => s.saveStopViews);
  const setSaveStopViews = usePalaceStore((s) => s.setSaveStopViews);
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
      ? `Click nodes in walk order to build ${route.name}. ${
          saveStopViews ? "Each stop saves your current view." : "Double-click empty space to add a new node."
        }`
      : `${route.name}: ${stopCount} ${stopCount === 1 ? "stop" : "stops"}. ${
          saveStopViews ? "Zoom and pan as needed, then click the next node." : "Click the next node."
        }`;

  return (
    <div
      data-testid="route-build-banner"
      className="pointer-events-auto mx-2 mt-2 flex min-w-0 max-w-[38rem] items-center gap-2 self-start rounded-full border border-zinc-700 bg-zinc-950/95 py-1 pl-3 pr-1 font-sans text-xs text-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
    >
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: routeColorHex(route, routeIndex) }}
      />
      <span role="status" aria-live="polite" className="min-w-0 truncate" title={notice?.message ?? hint}>
        {notice?.message ?? hint}
      </span>
      <button
        type="button"
        aria-pressed={saveStopViews}
        aria-label="Save the view with each stop"
        title={
          saveStopViews
            ? "On: each stop you add keeps the current zoom and position, and walks return to it."
            : "Off: walks zoom to each stop's node. Turn on to save the current view with each stop you add."
        }
        onClick={() => setSaveStopViews(!saveStopViews)}
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
          saveStopViews
            ? "bg-violet-500/20 text-violet-200 hover:bg-violet-500/30"
            : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200",
        )}
      >
        {saveStopViews ? (
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <CameraOff className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
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
