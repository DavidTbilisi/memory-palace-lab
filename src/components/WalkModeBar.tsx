import { ChevronLeft, ChevronRight, Footprints } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import { orderedLoci, locusAtOrderedIndex } from "../domain/services/walkService";

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
};

export function WalkModeBar({ onHoverHintChange }: Props) {
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const walkNext = usePalaceStore((s) => s.walkNext);
  const walkPrev = usePalaceStore((s) => s.walkPrev);
  const routes = usePalaceStore((s) => s.routes);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const loci = usePalaceStore((s) => s.loci);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const editorRef = usePalaceStore((s) => s.editorRef);

  const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
  const count = effectiveRouteId ? loci.filter((l) => l.routeId === effectiveRouteId).length : 0;
  const routeName = routes.find((r) => r.id === effectiveRouteId)?.name ?? "No route";

  const nodeId = usePalaceStore((s) => {
    const routeId = s.walkRouteId ?? s.routes[0]?.id ?? null;
    if (!routeId) return null;
    const list = orderedLoci(s.loci.filter((l) => l.routeId === routeId));
    return locusAtOrderedIndex(list, s.walkIndex)?.nodeId ?? null;
  });

  const title = useMemo(() => {
    if (!nodeId || !editorRef) return "—";
    for (const id of editorRef.getCurrentPageShapeIds()) {
      const s = editorRef.getShape(id);
      if (s?.type === "geo" && (s.meta as { mpNodeId?: string }).mpNodeId === nodeId) {
        return (s.meta as { mpTitle?: string }).mpTitle ?? "Untitled";
      }
    }
    return nodeId.slice(0, 8);
  }, [nodeId, editorRef]);

  const progressPct = count > 0 ? Math.round(((walkIndex + 1) / count) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-2 border-b px-2 py-1.5 transition-colors ${
        walkOpen ? "border-violet-700 bg-violet-950/40" : "border-zinc-800 bg-zinc-900/90"
      }`}
    >
      <Button
        size="sm"
        variant={walkOpen ? "default" : "secondary"}
        type="button"
        aria-label="Toggle walk mode"
        onClick={() => setWalkOpen(!walkOpen)}
        onMouseEnter={() =>
          onHoverHintChange?.("Walk mode: step through loci in the selected route for recall practice.")
        }
        onMouseLeave={() => onHoverHintChange?.(null)}
      >
        <Footprints className="h-4 w-4" />
        Walk {walkOpen ? "on" : "off"}
      </Button>
      {walkOpen ? (
        <>
          <span className="rounded bg-violet-700/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-100">
            Walk active
          </span>
          <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">Route: {routeName}</span>
          <span className="text-xs font-medium text-violet-100">
            Step {count ? walkIndex + 1 : 0}/{count} · {title}
          </span>
          <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-zinc-800 md:block">
            <div className="h-full bg-violet-400 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            aria-label="Previous step"
            onClick={() => walkPrev()}
            disabled={walkIndex <= 0}
            onMouseEnter={() => onHoverHintChange?.("Previous locus in current route.")}
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            aria-label="Next step"
            onClick={() => walkNext()}
            disabled={count === 0 || walkIndex >= count - 1}
            onMouseEnter={() => onHoverHintChange?.("Next locus in current route.")}
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      ) : null}
    </div>
  );
}
