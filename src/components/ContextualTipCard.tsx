import { useEffect, useMemo, useState } from "react";
import { Lightbulb, Sparkles, X } from "lucide-react";
import { createGeoMemoryNode } from "../canvas/createMemoryShapes";
import {
  buildEligibleContextTips,
  pickNextContextTip,
  type ContextualTip,
  type ContextualTipContext,
} from "../domain/services/contextualTips";
import {
  addDismissedTipId,
  areTipsDisabled,
  loadDismissedTipIds,
  loadIdleDelayMs,
  setTipsDisabled,
} from "../domain/services/tipPreferences";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

type Props = {
  context: ContextualTipContext;
  /** Open the Learn rail (progress + lessons). */
  onOpenLearnRail: () => void;
  /** Open a Library entry by slug, optionally in a given section. */
  onOpenLibrary: (target: { section?: string; slug?: string }) => void;
};

/**
 * A non-blocking corner toast that surfaces one context-appropriate tip after
 * a period of inactivity. Tips can be hidden one at a time or turned off.
 */
export function ContextualTipCard({
  context,
  onOpenLearnRail,
  onOpenLibrary,
}: Props) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const setToolMode = usePalaceStore((s) => s.setToolMode);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null);
  const [lastTipId, setLastTipId] = useState<string | null>(null);
  const [dismissedTipIds, setDismissedTipIds] = useState<Set<string>>(() =>
    loadDismissedTipIds(),
  );
  const [tipsDisabled, setTipsDisabledState] = useState(() =>
    areTipsDisabled(),
  );

  const allEligibleTips = useMemo(
    () => buildEligibleContextTips(context),
    [context],
  );
  const eligibleTips = useMemo(
    () => allEligibleTips.filter((tip) => !dismissedTipIds.has(tip.id)),
    [allEligibleTips, dismissedTipIds],
  );

  useEffect(() => {
    if (currentTip && eligibleTips.some((tip) => tip.id === currentTip.id))
      return;
    setCurrentTip(null);
  }, [currentTip, eligibleTips]);

  useEffect(() => {
    if (currentTip) return;
    if (tipsDisabled) return;

    const idleDelayMs = loadIdleDelayMs();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (document.visibilityState === "hidden" || currentTip) return;
        const next = pickNextContextTip(eligibleTips, {
          previousTipId: lastTipId,
        });
        if (!next) return;
        setLastTipId(next.id);
        setCurrentTip(next);
      }, idleDelayMs);
    };

    const handleActivity = () => {
      schedule();
    };

    schedule();

    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener("pointerdown", handleActivity, options);
    window.addEventListener("pointermove", handleActivity, options);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("wheel", handleActivity, options);
    window.addEventListener("touchstart", handleActivity, options);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("pointermove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [currentTip, eligibleTips, lastTipId, tipsDisabled]);

  const runTipAction = () => {
    if (!currentTip?.action) return;
    const tip = currentTip;
    setCurrentTip(null);
    if (tip.action === "open_learn") {
      onOpenLearnRail();
      return;
    }
    if (tip.action === "open_library") {
      onOpenLibrary({ section: tip.librarySection, slug: tip.librarySlug });
      return;
    }
    if (tip.action === "connect_mode") {
      setToolMode("connect");
      return;
    }
    if (tip.action === "start_walk") {
      setWalkOpen(true);
      return;
    }
    if (tip.action === "create_node" && editorRef && currentPalace) {
      const viewport = editorRef.getViewportPageBounds();
      createGeoMemoryNode(editorRef, currentPalace.id, {
        x: viewport.x + viewport.w / 2,
        y: viewport.y + viewport.h / 2,
      });
    }
  };

  const showAnotherTip = () => {
    const next = pickNextContextTip(eligibleTips, {
      previousTipId: currentTip?.id ?? lastTipId,
    });
    if (next) {
      setLastTipId(next.id);
      setCurrentTip(next);
    }
  };

  const hideThisTip = () => {
    if (!currentTip) return;
    setDismissedTipIds(addDismissedTipId(currentTip.id));
    setCurrentTip(null);
  };

  const turnOffTips = () => {
    setTipsDisabled(true);
    setTipsDisabledState(true);
    setCurrentTip(null);
  };

  if (!currentTip) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[min(420px,calc(100vw-2rem))] justify-end">
      <div
        data-testid="context-tip-card"
        role="status"
        aria-live="polite"
        className="pointer-events-auto w-full rounded-2xl border border-violet-700/60 bg-zinc-950/95 p-4 shadow-[0_20px_80px_rgba(76,29,149,0.42)] backdrop-blur"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Idle Suggestion
            </div>
            <div className="mt-2 flex items-center gap-2 text-base font-semibold text-zinc-100">
              <Lightbulb className="h-4 w-4 text-amber-300" />
              {currentTip.title}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {currentTip.body}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            type="button"
            aria-label="Dismiss tip"
            onClick={() => setCurrentTip(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-zinc-500">
            Appears after a minute of inactivity. Adjust in Settings.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              type="button"
              variant="ghost"
              onClick={showAnotherTip}
            >
              Another tip
            </Button>
            <Button
              size="sm"
              type="button"
              variant="ghost"
              onClick={hideThisTip}
            >
              Hide this tip
            </Button>
            <Button
              size="sm"
              type="button"
              variant="ghost"
              onClick={turnOffTips}
            >
              Turn off tips
            </Button>
            {currentTip.action && currentTip.ctaLabel ? (
              <Button size="sm" type="button" onClick={runTipAction}>
                {currentTip.ctaLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
