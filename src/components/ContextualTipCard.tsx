import { useEffect, useMemo, useState } from "react";
import { Lightbulb, Sparkles, X } from "lucide-react";
import { createGeoMemoryNode } from "../canvas/createMemoryShapes";
import {
  buildEligibleContextTips,
  pickNextContextTip,
  type ContextualTip,
  type ContextualTipContext,
} from "../domain/services/contextualTips";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

const DEFAULT_IDLE_DELAY_MS = 20000;
const IDLE_DELAY_STORAGE_KEY = "mp-idle-tip-delay-ms";

type Props = {
  context: ContextualTipContext;
  onOpenHelp: () => void;
};

function resolveIdleDelayMs() {
  if (typeof window === "undefined") return DEFAULT_IDLE_DELAY_MS;
  const raw = window.localStorage.getItem(IDLE_DELAY_STORAGE_KEY);
  if (!raw) return DEFAULT_IDLE_DELAY_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 50 ? parsed : DEFAULT_IDLE_DELAY_MS;
}

export function ContextualTipCard({ context, onOpenHelp }: Props) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const setToolMode = usePalaceStore((s) => s.setToolMode);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null);
  const [lastTipId, setLastTipId] = useState<string | null>(null);

  const eligibleTips = useMemo(() => buildEligibleContextTips(context), [context]);

  useEffect(() => {
    if (currentTip && eligibleTips.some((tip) => tip.id === currentTip.id)) return;
    setCurrentTip(null);
  }, [currentTip, eligibleTips]);

  useEffect(() => {
    if (currentTip) return;

    const idleDelayMs = resolveIdleDelayMs();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (document.visibilityState === "hidden" || currentTip) return;
        const next = pickNextContextTip(eligibleTips, { previousTipId: lastTipId });
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
  }, [currentTip, eligibleTips, lastTipId]);

  const runTipAction = () => {
    if (!currentTip?.action) return;
    if (currentTip.action === "open_learn") {
      onOpenHelp();
      setCurrentTip(null);
      return;
    }
    if (currentTip.action === "connect_mode") {
      setToolMode("connect");
      setCurrentTip(null);
      return;
    }
    if (currentTip.action === "start_walk") {
      setWalkOpen(true);
      setCurrentTip(null);
      return;
    }
    if (currentTip.action === "create_node" && editorRef && currentPalace) {
      const viewport = editorRef.getViewportPageBounds();
      createGeoMemoryNode(editorRef, currentPalace.id, {
        x: viewport.x + viewport.w / 2,
        y: viewport.y + viewport.h / 2,
      });
      setCurrentTip(null);
    }
  };

  const showAnotherTip = () => {
    const next = pickNextContextTip(eligibleTips, { previousTipId: currentTip?.id ?? lastTipId });
    if (next) {
      setLastTipId(next.id);
      setCurrentTip(next);
    }
  };

  if (!currentTip) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div
        data-testid="context-tip-card"
        className="pointer-events-auto w-full max-w-xl rounded-2xl border border-violet-700/60 bg-zinc-950/95 p-4 shadow-[0_20px_80px_rgba(76,29,149,0.42)] backdrop-blur"
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
            <p className="mt-2 text-sm leading-6 text-zinc-300">{currentTip.body}</p>
          </div>
          <Button size="icon" variant="ghost" type="button" aria-label="Dismiss tip" onClick={() => setCurrentTip(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-zinc-500">Tips appear after you pause and stay visible until you dismiss them with the X button.</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" type="button" variant="secondary" onClick={showAnotherTip}>
              Another tip
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
