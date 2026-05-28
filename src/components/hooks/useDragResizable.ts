import { useCallback, useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";

type Options = {
  /** Lazy initializer for the starting ratio (e.g. read from storage). */
  getInitialRatio?: () => number;
  /** Clamp bounds applied while dragging. */
  min?: number;
  max?: number;
  /** If set, the ratio is persisted to localStorage under this key. */
  storageKey?: string;
};

/**
 * Manages a horizontal split-pane ratio (0..1): owns the value, persists it
 * when `storageKey` is given, and returns an `onSeparatorMouseDown` handler
 * that drags relative to the separator's parent width, clamped to [min, max].
 */
export function useDragResizable({
  getInitialRatio = () => 0.5,
  min = 0.15,
  max = 0.85,
  storageKey,
}: Options = {}) {
  const [ratio, setRatio] = useState<number>(getInitialRatio);

  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) return;
    window.localStorage.setItem(storageKey, String(ratio));
  }, [ratio, storageKey]);

  const onSeparatorMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      const startX = event.clientX;
      const startRatio = ratio;
      const containerWidth = event.currentTarget.parentElement?.clientWidth ?? 1;
      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const next = startRatio + dx / containerWidth;
        setRatio(Math.min(max, Math.max(min, next)));
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [ratio, min, max],
  );

  return { ratio, setRatio, onSeparatorMouseDown };
}
