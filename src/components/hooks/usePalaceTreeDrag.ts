import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";

export type PalaceTreeDragItem =
  | { kind: "palace"; palaceId: string; fromPath: string; label: string }
  | { kind: "group"; path: string; label: string };

/** Pointer travel before a press on a palace or group turns into a drag. */
const DRAG_THRESHOLD_PX = 5;

function parentPath(path: string) {
  const cut = path.lastIndexOf("/");
  return cut === -1 ? "" : path.slice(0, cut);
}

/** Whether dropping the item on the group at targetPath ("" for the top level) would move it. */
export function canDropOn(item: PalaceTreeDragItem, targetPath: string) {
  if (item.kind === "palace") return targetPath !== item.fromPath;
  if (targetPath === item.path || targetPath.startsWith(`${item.path}/`)) return false;
  return targetPath !== parentPath(item.path);
}

/**
 * Drag palaces and groups between groups of the sidebar tree. Built on pointer
 * events because the desktop app's webview swallows HTML5 drag-and-drop.
 * Drop targets are elements carrying `data-drop-path`; the innermost one under
 * the pointer wins, and `data-drop-none` blocks the targets around it.
 */
export function usePalaceTreeDrag(onDrop: (item: PalaceTreeDragItem, targetPath: string) => void) {
  const [dragging, setDragging] = useState<PalaceTreeDragItem | null>(null);
  const [dropPath, setDropPath] = useState<string | null>(null);
  const [ghostStart, setGhostStart] = useState({ x: 0, y: 0 });
  const ghostRef = useRef<HTMLDivElement>(null);
  const onDropRef = useRef(onDrop);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  useEffect(() => () => cleanupRef.current?.(), []);

  const startDrag = useCallback((event: ReactPointerEvent, item: PalaceTreeDragItem) => {
    if (event.button !== 0 || event.pointerType === "touch") return;
    cleanupRef.current?.();
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let cancelled = false;
    let target: string | null = null;

    const stopShowing = () => {
      setDragging(null);
      setDropPath(null);
    };
    const move = (e: PointerEvent) => {
      if (cancelled) return;
      if (!active) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < DRAG_THRESHOLD_PX) return;
        active = true;
        setGhostStart({ x: e.clientX, y: e.clientY });
        setDragging(item);
      }
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${e.clientX + 12}px, ${e.clientY + 8}px)`;
      }
      const hit = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>("[data-drop-path],[data-drop-none]");
      const path = hit?.dataset.dropPath;
      target = path !== undefined && canDropOn(item, path) ? path : null;
      setDropPath(target);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !active) return;
      cancelled = true;
      target = null;
      stopShowing();
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", key);
      cleanupRef.current = null;
    };
    function abort() {
      cleanup();
      stopShowing();
    }
    function up() {
      cleanup();
      if (!active) return;
      // The release still clicks whatever is under it (opening a palace or
      // folding a group); swallow that one click.
      const swallow = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      window.addEventListener("click", swallow, { capture: true, once: true });
      window.setTimeout(() => window.removeEventListener("click", swallow, { capture: true }), 0);
      stopShowing();
      if (!cancelled && target !== null) onDropRef.current(item, target);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", abort);
    window.addEventListener("keydown", key);
    cleanupRef.current = abort;
  }, []);

  return { dragging, dropPath, startDrag, ghostRef, ghostStart };
}
