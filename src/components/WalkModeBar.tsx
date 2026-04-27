import { ChevronLeft, ChevronRight, Eye, Footprints } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import { orderedLoci } from "../domain/services/walkService";
import { resolveMemoryNodeTitle } from "../canvas/readShapeText";
import type { RecallRating } from "../domain/entities/types";

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
};

type NodeReviewState = {
  title: string;
  content: string;
};

function resolveCurrentNodeReviewState(
  nodeId: string | null,
  editorRef: ReturnType<typeof usePalaceStore.getState>["editorRef"],
  snapshotNodes: ReturnType<typeof usePalaceStore.getState>["nodes"],
): NodeReviewState {
  if (!nodeId) return { title: "No node", content: "" };
  if (editorRef) {
    for (const id of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(id);
      if (shape?.type !== "geo") continue;
      const meta = shape.meta as { mpNodeId?: string; mpContent?: string };
      if (meta.mpNodeId !== nodeId) continue;
      return {
        title: resolveMemoryNodeTitle(shape),
        content: meta.mpContent?.trim() || "",
      };
    }
  }
  const snapshotNode = snapshotNodes.find((node) => node.id === nodeId);
  return {
    title: snapshotNode?.title || nodeId.slice(0, 8),
    content: snapshotNode?.content?.trim() || "",
  };
}

function RecallRatingButtons({
  onHoverHintChange,
}: {
  onHoverHintChange?: (hint: string | null) => void;
}) {
  const rateWalkRecall = usePalaceStore((s) => s.rateWalkRecall);

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="outline"
        type="button"
        className="border-rose-800/70 bg-rose-950/30 text-rose-100 hover:bg-rose-900/40"
        onClick={() => rateWalkRecall("again")}
        onMouseEnter={() => onHoverHintChange?.("Rate recall as Again. This marks a miss and keeps the weakness visible.")}
        onMouseLeave={() => onHoverHintChange?.(null)}
      >
        1 Again
      </Button>
      <Button
        size="sm"
        variant="outline"
        type="button"
        className="border-amber-800/70 bg-amber-950/30 text-amber-100 hover:bg-amber-900/40"
        onClick={() => rateWalkRecall("hard")}
        onMouseEnter={() => onHoverHintChange?.("Rate recall as Hard. You got there, but with friction.")}
        onMouseLeave={() => onHoverHintChange?.(null)}
      >
        2 Hard
      </Button>
      <Button
        size="sm"
        variant="outline"
        type="button"
        className="border-emerald-800/70 bg-emerald-950/30 text-emerald-100 hover:bg-emerald-900/40"
        onClick={() => rateWalkRecall("good")}
        onMouseEnter={() => onHoverHintChange?.("Rate recall as Good. Stable retrieval with acceptable effort.")}
        onMouseLeave={() => onHoverHintChange?.(null)}
      >
        3 Good
      </Button>
      <Button
        size="sm"
        variant="outline"
        type="button"
        className="border-cyan-800/70 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-900/40"
        onClick={() => rateWalkRecall("easy")}
        onMouseEnter={() => onHoverHintChange?.("Rate recall as Easy. Fast, clean retrieval with low effort.")}
        onMouseLeave={() => onHoverHintChange?.(null)}
      >
        4 Easy
      </Button>
    </div>
  );
}

export function WalkModeBar({ onHoverHintChange }: Props) {
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const walkRecallMode = usePalaceStore((s) => s.walkRecallMode);
  const setWalkRecallMode = usePalaceStore((s) => s.setWalkRecallMode);
  const walkCueOnly = usePalaceStore((s) => s.walkCueOnly);
  const setWalkCueOnly = usePalaceStore((s) => s.setWalkCueOnly);
  const walkAnswerRevealed = usePalaceStore((s) => s.walkAnswerRevealed);
  const walkStepRated = usePalaceStore((s) => s.walkStepRated);
  const revealWalkAnswer = usePalaceStore((s) => s.revealWalkAnswer);
  const rateWalkRecall = usePalaceStore((s) => s.rateWalkRecall);
  const walkNext = usePalaceStore((s) => s.walkNext);
  const walkPrev = usePalaceStore((s) => s.walkPrev);
  const routes = usePalaceStore((s) => s.routes);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const loci = usePalaceStore((s) => s.loci);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const snapshotNodes = usePalaceStore((s) => s.nodes);

  const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
  const currentRouteLoci = useMemo(
    () => orderedLoci(effectiveRouteId ? loci.filter((locus) => locus.routeId === effectiveRouteId) : []),
    [effectiveRouteId, loci],
  );
  const count = currentRouteLoci.length;
  const currentLocus = currentRouteLoci[walkIndex] ?? null;
  const routeName = routes.find((route) => route.id === effectiveRouteId)?.name ?? "No route";

  const nodeState = useMemo(
    () => resolveCurrentNodeReviewState(currentLocus?.nodeId ?? null, editorRef, snapshotNodes),
    [currentLocus?.nodeId, editorRef, snapshotNodes],
  );

  const cueText = walkCueOnly ? nodeState.title : currentLocus?.label?.trim() || nodeState.title;
  const answerText = walkCueOnly
    ? nodeState.content || nodeState.title
    : [nodeState.title, nodeState.content].filter(Boolean).join(" - ");
  const promptText = walkCueOnly
    ? "Recall the explanation before you reveal it."
    : "Use the locus cue first, then reveal the full answer.";
  const progressPct = count > 0 ? Math.round(((walkIndex + 1) / count) * 100) : 0;
  const waitingForRating = walkRecallMode && !walkStepRated;

  useEffect(() => {
    if (!walkOpen) return;
    const ratingByKey: Record<string, RecallRating> = {
      "1": "again",
      "2": "hard",
      "3": "good",
      "4": "easy",
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      const tagName = target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;
      const rating = ratingByKey[event.key];
      if (!rating) return;
      if (walkRecallMode && !walkAnswerRevealed) return;
      event.preventDefault();
      rateWalkRecall(rating);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rateWalkRecall, walkAnswerRevealed, walkOpen, walkRecallMode]);

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
          <Button
            size="sm"
            type="button"
            variant={walkRecallMode ? "default" : "secondary"}
            onClick={() => setWalkRecallMode(!walkRecallMode)}
            onMouseEnter={() => onHoverHintChange?.("Recall-first: hide the answer until you explicitly reveal it.")}
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            Recall-first
          </Button>
          <Button
            size="sm"
            type="button"
            variant={walkCueOnly ? "secondary" : "ghost"}
            disabled={!walkRecallMode}
            onClick={() => setWalkCueOnly(!walkCueOnly)}
            onMouseEnter={() =>
              onHoverHintChange?.("Cue-only: use the node title as the prompt and keep the fuller explanation hidden.")
            }
            onMouseLeave={() => onHoverHintChange?.(null)}
          >
            Cue only
          </Button>

          <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
            <div className="flex min-w-0 items-center gap-2 overflow-hidden">
              <span className="rounded bg-violet-700/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-100">
                {walkRecallMode ? "Recall-first" : "Walk active"}
              </span>
              <span className="hidden min-w-0 max-w-48 items-center rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 sm:inline-flex">
                Route:
                <span className="ml-1 truncate">{routeName}</span>
              </span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">
                Step {count ? walkIndex + 1 : 0}/{count}
              </span>
              {currentLocus?.label?.trim() ? (
                <span className="hidden min-w-0 max-w-52 truncate rounded bg-zinc-900/70 px-2 py-0.5 text-[11px] text-zinc-400 md:inline-flex">
                  Locus: {currentLocus.label}
                </span>
              ) : null}
            </div>

            <div className="flex min-w-0 items-start gap-2 overflow-hidden">
              <div className="min-w-0 flex-1">
                <div id="walk-cue" className="truncate text-sm font-semibold text-violet-100">
                  {cueText || "No cue"}
                </div>
                <div
                  id="walk-answer"
                  className="h-5 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-5 text-zinc-300"
                >
                  {walkRecallMode && !walkAnswerRevealed ? promptText : answerText || "No saved answer on this node yet."}
                </div>
              </div>
              <div className="hidden h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-zinc-800 lg:block">
                <div className="h-full bg-violet-400 transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 border-l border-zinc-800/80 pl-2">
            <div className="flex min-w-[12rem] justify-end md:min-w-[16rem] lg:min-w-[20rem]">
              {walkRecallMode && !walkAnswerRevealed ? (
                <Button
                  size="sm"
                  type="button"
                  aria-label="Reveal answer"
                  className="ml-auto"
                  onClick={() => revealWalkAnswer()}
                  onMouseEnter={() => onHoverHintChange?.("Reveal the hidden answer for this step and unlock grading.")}
                  onMouseLeave={() => onHoverHintChange?.(null)}
                >
                  <Eye className="h-4 w-4" />
                  Reveal
                </Button>
              ) : (
                <RecallRatingButtons onHoverHintChange={onHoverHintChange} />
              )}
            </div>

            <div className="flex items-center gap-1">
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
                disabled={count === 0 || walkIndex >= count - 1 || waitingForRating}
                onMouseEnter={() => onHoverHintChange?.("Next locus in current route.")}
                onMouseLeave={() => onHoverHintChange?.(null)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
