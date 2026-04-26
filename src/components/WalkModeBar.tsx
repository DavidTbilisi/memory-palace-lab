import { ChevronLeft, ChevronRight, Footprints } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import { orderedLoci, locusAtOrderedIndex } from "../domain/services/walkService";
import { resolveMemoryNodeTitle } from "../canvas/readShapeText";

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
};

export function WalkModeBar({ onHoverHintChange }: Props) {
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const rateWalkRecall = usePalaceStore((s) => s.rateWalkRecall);
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
    if (!nodeId || !editorRef) return "No node";
    for (const id of editorRef.getCurrentPageShapeIds()) {
      const s = editorRef.getShape(id);
      if (s?.type === "geo" && (s.meta as { mpNodeId?: string }).mpNodeId === nodeId) {
        return resolveMemoryNodeTitle(s);
      }
    }
    return nodeId.slice(0, 8);
  }, [nodeId, editorRef]);

  const progressPct = count > 0 ? Math.round(((walkIndex + 1) / count) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-2 overflow-hidden border-b px-2 py-1.5 transition-colors ${
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
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <span className="rounded bg-violet-700/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-100">
              Walk active
            </span>
            <span className="hidden min-w-0 max-w-48 items-center rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 sm:inline-flex">
              Route:
              <span className="ml-1 truncate">{routeName}</span>
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-1 text-xs font-medium text-violet-100">
              <span className="shrink-0">Step {count ? walkIndex + 1 : 0}/{count}</span>
              <span className="text-violet-300">-</span>
              <span className="truncate">{title}</span>
            </div>
            <div className="hidden h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-zinc-800 lg:block">
              <div className="h-full bg-violet-400 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 border-l border-zinc-800/80 pl-2">
            <div className="hidden items-center gap-1 lg:flex">
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="border-rose-800/70 bg-rose-950/30 text-rose-100 hover:bg-rose-900/40"
                onClick={() => rateWalkRecall("again")}
                onMouseEnter={() => onHoverHintChange?.("Rate recall as Again. Analytics stays local and tracks weak spots.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                Again
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="border-amber-800/70 bg-amber-950/30 text-amber-100 hover:bg-amber-900/40"
                onClick={() => rateWalkRecall("hard")}
                onMouseEnter={() => onHoverHintChange?.("Rate recall as Hard. This marks effortful retrieval without full failure.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                Hard
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="border-emerald-800/70 bg-emerald-950/30 text-emerald-100 hover:bg-emerald-900/40"
                onClick={() => rateWalkRecall("good")}
                onMouseEnter={() => onHoverHintChange?.("Rate recall as Good. Useful for review timing and strength analytics.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                Good
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="border-cyan-800/70 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-900/40"
                onClick={() => rateWalkRecall("easy")}
                onMouseEnter={() => onHoverHintChange?.("Rate recall as Easy. Fast, stable recall should trend toward this.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                Easy
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              aria-label="Previous step"
              className="shrink-0"
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
              className="shrink-0"
              onClick={() => walkNext()}
              disabled={count === 0 || walkIndex >= count - 1}
              onMouseEnter={() => onHoverHintChange?.("Next locus in current route.")}
              onMouseLeave={() => onHoverHintChange?.(null)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
