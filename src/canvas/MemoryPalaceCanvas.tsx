import { useCallback, useEffect, useMemo, useRef } from "react";
import { Tldraw } from "tldraw";
import type { Editor, TLGeoShape, TLEventInfo } from "@tldraw/editor";
import type { TLShapeId, TLStoreSnapshot } from "@tldraw/tlschema";
import "tldraw/tldraw.css";
import { usePalaceStore } from "../store/palaceStore";
import { createGeoMemoryNode } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";

type Props = {
  palaceId: string;
  editorSnapshot: string | null | undefined;
};

function isGeoMemory(shape: unknown): shape is TLGeoShape {
  return (
    typeof shape === "object" &&
    shape !== null &&
    (shape as { type?: string }).type === "geo" &&
    !!(shape as { meta?: MemoryPalaceMeta }).meta?.mpNodeId
  );
}

export function MemoryPalaceCanvas({ palaceId, editorSnapshot }: Props) {
  const setEditor = usePalaceStore((s) => s.setEditor);
  const setSelectedShapeId = usePalaceStore((s) => s.setSelectedShapeId);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const loci = usePalaceStore((s) => s.loci);

  const snapshot = useMemo((): TLStoreSnapshot | undefined => {
    if (!editorSnapshot) return undefined;
    try {
      return JSON.parse(editorSnapshot) as TLStoreSnapshot;
    } catch {
      return undefined;
    }
  }, [editorSnapshot]);

  const editorRef = useRef<Editor | null>(null);
  const lastWalkNodeIdRef = useRef<string | null>(null);

  const onMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      setEditor(editor);

      const onEvent = (info: TLEventInfo) => {
        if ((info as { name?: string }).name === "double_click") {
          const point = editor.inputs.currentPagePoint;
          const hit = editor.getShapeAtPoint(point, { hitInside: true, margin: 8 });
          if (!hit) {
            createGeoMemoryNode(editor, palaceId, point);
            return;
          }
          const hitShape = editor.getShape(hit.id);
          if (!isGeoMemory(hitShape)) {
            createGeoMemoryNode(editor, palaceId, point);
          }
        }

        if (info.type === "pointer" && info.name === "pointer_up") {
          const st = usePalaceStore.getState();
          if (st.toolMode !== "connect") return;
          if (editor.inputs.getIsDragging() || editor.inputs.getIsPanning()) return;

          // Connect mode should react to intentional clicks, not drags.
          const origin = editor.inputs.getOriginPagePoint();
          const current = editor.inputs.getCurrentPagePoint();
          const movement = Math.hypot(current.x - origin.x, current.y - origin.y);
          if (movement > 6) return;

          const point = editor.inputs.currentPagePoint;
          const hitId = editor.getShapeAtPoint(point, { hitInside: true, margin: 8 })?.id;
          if (!hitId) return;
          const sh = editor.getShape(hitId);
          if (!sh || sh.type !== "geo") return;
          const meta = sh.meta as MemoryPalaceMeta;
          if (!meta.mpNodeId) return;
          if (!st.connect.fromShapeId) {
            st.setConnectFrom(hitId);
            return;
          }
          if (st.connect.fromShapeId === hitId) {
            st.setConnectFrom(null);
            return;
          }
          const a = editor.getShape(st.connect.fromShapeId as TLShapeId);
          const ma = a?.meta as MemoryPalaceMeta | undefined;
          const mb = sh.meta as MemoryPalaceMeta;
          if (!ma?.mpNodeId || !mb.mpNodeId) return;
          st.setPendingCast({
            fromShapeId: st.connect.fromShapeId,
            toShapeId: hitId,
            sourceNodeId: ma.mpNodeId,
            targetNodeId: mb.mpNodeId,
          });
          st.setConnectFrom(null);
        }
      };

      editor.on("event", onEvent);

      const unsubSel = editor.store.listen(
        () => {
          const ids = editor.getSelectedShapeIds();
          setSelectedShapeId(ids.length === 1 ? ids[0] : null);
        },
        { source: "user", scope: "document" },
      );

      return () => {
        editor.off("event", onEvent);
        unsubSel();
        setEditor(null);
        editorRef.current = null;
      };
    },
    [palaceId, setEditor, setSelectedShapeId],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nodeId = usePalaceStore.getState().currentWalkNodeId();
    if (!walkOpen || !nodeId) {
      lastWalkNodeIdRef.current = null;
      editor.setHintingShapes([]);
      for (const id of editor.getCurrentPageShapeIds()) {
        const s = editor.getShape(id);
        if (s && s.type === "geo" && (s.meta as MemoryPalaceMeta).mpNodeId) {
          editor.updateShape({ id, type: "geo", opacity: 1 });
        }
      }
      return;
    }

    let activeShapeId: TLShapeId | null = null;
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!s || s.type !== "geo") continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      const hi = m.mpNodeId === nodeId;
      if (hi) activeShapeId = id;
      editor.updateShape({ id, type: "geo", opacity: hi ? 1 : 0.38 });
    }

    if (activeShapeId) {
      editor.setHintingShapes([activeShapeId]);
      editor.setSelectedShapes([activeShapeId]);
      if (lastWalkNodeIdRef.current !== nodeId) {
        editor.zoomToSelectionIfOffscreen(96, { animation: { duration: 260 } });
        lastWalkNodeIdRef.current = nodeId;
      }
    }
  }, [walkOpen, walkIndex, walkRouteId, loci]);

  return (
    <div className="relative h-full min-h-0 w-full flex-1">
      <Tldraw snapshot={snapshot} onMount={onMount} />
    </div>
  );
}
