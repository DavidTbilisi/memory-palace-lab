import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Link2Off } from "lucide-react";
import { Tldraw } from "tldraw";
import type { Editor, TLGeoShape, TLEditorSnapshot, TLEventInfo } from "@tldraw/editor";
import type { TLShapeId, TLStoreSnapshot } from "@tldraw/tlschema";
import "tldraw/tldraw.css";
import { usePalaceStore } from "../store/palaceStore";
import { captureSceneAnalyticsSnapshot, diffSceneAnalyticsSnapshots } from "./analyticsSceneSnapshot";
import { createGeoMemoryNode } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { nodeKindFromMeta, portalRefFromMeta } from "./palacePortal";

type Props = {
  palaceId: string;
  editorSnapshot: string | null | undefined;
};

type PortalBadge = {
  shapeId: TLShapeId;
  x: number;
  y: number;
  linked: boolean;
  targetPalaceId: string | null;
  targetRouteId: string | null;
};

function parseEditorSnapshot(
  editorSnapshot: string | null | undefined,
): TLEditorSnapshot | TLStoreSnapshot | undefined {
  if (!editorSnapshot) return undefined;
  try {
    return JSON.parse(editorSnapshot) as TLEditorSnapshot | TLStoreSnapshot;
  } catch {
    return undefined;
  }
}

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
  const queueDraftSave = usePalaceStore((s) => s.queueDraftSave);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const walkRecallMode = usePalaceStore((s) => s.walkRecallMode);
  const walkAnswerRevealed = usePalaceStore((s) => s.walkAnswerRevealed);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const loci = usePalaceStore((s) => s.loci);
  const toolMode = usePalaceStore((s) => s.toolMode);
  const connectFromShapeId = usePalaceStore((s) => s.connect.fromShapeId);

  // A mounted editor should keep its live state. Re-loading from a fresh snapshot on every
  // draft/manual save can wipe the visible canvas in the browser build.
  const [initialSnapshot] = useState(() => parseEditorSnapshot(editorSnapshot));

  const editorRef = useRef<Editor | null>(null);
  const lastWalkNodeIdRef = useRef<string | null>(null);
  const lastSceneSnapshotRef = useRef<ReturnType<typeof captureSceneAnalyticsSnapshot> | null>(null);
  const badgeFrameRef = useRef<number | null>(null);
  const [portalBadges, setPortalBadges] = useState<PortalBadge[]>([]);

  const recomputePortalBadges = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setPortalBadges([]);
      return;
    }

    const badges: PortalBadge[] = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (nodeKindFromMeta(meta) !== "portal") continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      const point = editor.pageToViewport({ x: bounds.x + bounds.w, y: bounds.y });
      const portal = portalRefFromMeta(meta);
      badges.push({
        shapeId: shape.id,
        x: point.x - 12,
        y: point.y - 12,
        linked: !!portal?.targetPalaceId,
        targetPalaceId: portal?.targetPalaceId ?? null,
        targetRouteId: portal?.targetRouteId ?? null,
      });
    }

    setPortalBadges(badges);
  }, []);

  const queueBadgeRefresh = useCallback(() => {
    if (badgeFrameRef.current !== null) return;
    badgeFrameRef.current = window.requestAnimationFrame(() => {
      badgeFrameRef.current = null;
      recomputePortalBadges();
    });
  }, [recomputePortalBadges]);

  const openPortalDestination = useCallback(async (meta: MemoryPalaceMeta) => {
    const portal = portalRefFromMeta(meta);
    if (!portal?.targetPalaceId) return;
    await usePalaceStore.getState().openPalace(portal.targetPalaceId);
    if (portal.targetRouteId) {
      usePalaceStore.getState().setWalkRoute(portal.targetRouteId);
      usePalaceStore.getState().setWalkOpen(true);
    }
  }, []);

  const onMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      lastSceneSnapshotRef.current = captureSceneAnalyticsSnapshot(editor);
      setEditor(editor);
      queueBadgeRefresh();

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
            return;
          }

          const hitMeta = (hitShape.meta ?? {}) as MemoryPalaceMeta;
          const hitKind = nodeKindFromMeta(hitMeta);
          if (hitKind === "portal") {
            void openPortalDestination(hitMeta);
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
            editor.select(hitId);
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
          editor.select(hitId);
          st.setConnectFrom(null);
        }
      };

      editor.on("event", onEvent);

      const unsubSel = editor.store.listen(
        () => {
          const ids = editor.getSelectedShapeIds();
          setSelectedShapeId(ids.length === 1 ? ids[0] : null);
          queueBadgeRefresh();
        },
        { source: "all", scope: "session" },
      );

      const unsubDraft = editor.store.listen(
        () => {
          if (usePalaceStore.getState().currentPalace?.id !== palaceId) return;
          const nextSnapshot = captureSceneAnalyticsSnapshot(editor);
          const analyticsDiff = diffSceneAnalyticsSnapshots(lastSceneSnapshotRef.current, nextSnapshot);
          lastSceneSnapshotRef.current = nextSnapshot;
          queueDraftSave();
          for (const event of analyticsDiff) {
            void usePalaceStore.getState().recordAnalyticsEvent({
              eventType: event.eventType,
              eventGroup: "graph",
              palaceId,
              nodeId: event.nodeId ?? null,
              payload: event.payload,
            });
          }
          queueBadgeRefresh();
        },
        { source: "user", scope: "document" },
      );

      const unsubViewport = editor.store.listen(
        () => {
          queueBadgeRefresh();
        },
        { source: "all", scope: "all" },
      );

      return () => {
        editor.off("event", onEvent);
        unsubSel();
        unsubDraft();
        unsubViewport();
        setEditor(null);
        lastSceneSnapshotRef.current = null;
        editorRef.current = null;
        setPortalBadges([]);
      };
    },
    [openPortalDestination, palaceId, queueBadgeRefresh, queueDraftSave, setEditor, setSelectedShapeId],
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
      if (walkRecallMode && !walkAnswerRevealed) {
        editor.setSelectedShapes([]);
        usePalaceStore.getState().setSelectedShapeId(null);
      } else {
        editor.setSelectedShapes([activeShapeId]);
      }
      if (lastWalkNodeIdRef.current !== nodeId) {
        editor.zoomToSelectionIfOffscreen(96, { animation: { duration: 260 } });
        lastWalkNodeIdRef.current = nodeId;
      }
    }
  }, [walkAnswerRevealed, walkOpen, walkRecallMode, walkIndex, walkRouteId, loci]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || walkOpen || toolMode !== "connect") {
      if (editor && !walkOpen) {
        editor.setHintingShapes([]);
        for (const id of editor.getCurrentPageShapeIds()) {
          const s = editor.getShape(id);
          if (s?.type === "geo" && (s.meta as MemoryPalaceMeta).mpNodeId) {
            editor.updateShape({ id, type: "geo", opacity: 1 });
          }
        }
      }
      return;
    }

    const memoryIds: TLShapeId[] = [];
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!s || s.type !== "geo") continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      memoryIds.push(id);
      editor.updateShape({ id, type: "geo", opacity: 1 });
    }

    if (!connectFromShapeId) {
      // Step 1 — hint every node to show they're all pickable as source
      editor.setHintingShapes(memoryIds);
    } else {
      // Step 2 — source locked: selection ring distinguishes it from target candidates
      editor.setHintingShapes(memoryIds);
      editor.setSelectedShapes([connectFromShapeId as TLShapeId]);
    }
  }, [toolMode, connectFromShapeId, walkOpen]);

  useEffect(() => {
    return () => {
      if (badgeFrameRef.current !== null) {
        window.cancelAnimationFrame(badgeFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full min-h-0 w-full flex-1">
      <Tldraw snapshot={initialSnapshot} onMount={onMount} />
      <div className="pointer-events-none absolute inset-0 z-20">
        {portalBadges.map((badge) => (
          <button
            key={badge.shapeId}
            type="button"
            aria-label={badge.linked ? "Open linked palace" : "Portal is not linked yet"}
            className={`pointer-events-auto absolute inline-flex h-6 w-6 items-center justify-center rounded-full border shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition ${
              badge.linked
                ? "border-amber-300/90 bg-amber-300 text-zinc-950 hover:bg-amber-200"
                : "border-rose-400/70 bg-rose-950/95 text-rose-100 hover:bg-rose-900"
            }`}
            style={{ left: badge.x, top: badge.y }}
            title={badge.linked ? "Open linked palace" : "Portal is not linked yet"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const editor = editorRef.current;
              if (!editor) return;
              editor.setSelectedShapes([badge.shapeId]);
              setSelectedShapeId(badge.shapeId);
              if (!badge.linked) return;
              const shape = editor.getShape(badge.shapeId);
              const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
              void openPortalDestination(meta);
            }}
          >
            {badge.linked ? <ExternalLink className="h-3.5 w-3.5" /> : <Link2Off className="h-3.5 w-3.5" />}
          </button>
        ))}
      </div>
    </div>
  );
}
