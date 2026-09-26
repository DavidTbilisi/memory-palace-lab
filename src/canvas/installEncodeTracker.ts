import type { Editor } from "@tldraw/editor";
import { EncodeTracker, setActiveEncodeTracker, type EncodeRecord, type EncodeTarget } from "./encodeTracker";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;

/** The encode target for the current selection: one memory node or one memory edge. */
export function encodeTargetOf(editor: Editor): EncodeTarget {
  const ids = editor.getSelectedShapeIds();
  if (ids.length !== 1) return null;
  const shape = editor.getShape(ids[0]);
  if (!shape) return null;
  const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
  if (isMemoryNodeShape(shape) && meta.mpNodeId) return { kind: "node", nodeId: meta.mpNodeId };
  if (shape.type === "arrow" && meta.mpEdgeId) return { kind: "edge", edgeId: meta.mpEdgeId };
  return null;
}

/**
 * Times encodes on one canvas: follows the selection and the learner's input, and makes the
 * tracker reachable from the CAST dialog. Scene changes are fed in by the canvas's own listener.
 */
export function installEncodeTracker(editor: Editor, record: (event: EncodeRecord) => void) {
  const tracker = new EncodeTracker({
    now: () => Date.now(),
    record,
    hidden: document.visibilityState === "hidden",
  });
  const onActivity = () => tracker.activity();
  const onVisibility = () => tracker.setHidden(document.visibilityState === "hidden");
  for (const name of ACTIVITY_EVENTS) window.addEventListener(name, onActivity, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  tracker.select(encodeTargetOf(editor));
  const unsubSelection = editor.store.listen(() => tracker.select(encodeTargetOf(editor)), {
    source: "all",
    scope: "session",
  });
  setActiveEncodeTracker(tracker);

  return {
    tracker,
    dispose() {
      unsubSelection();
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, onActivity, { capture: true });
      document.removeEventListener("visibilitychange", onVisibility);
      tracker.dispose();
      setActiveEncodeTracker(null);
    },
  };
}
