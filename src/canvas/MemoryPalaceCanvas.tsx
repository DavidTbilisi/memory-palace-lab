import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { detectMotifs } from "../domain/services/cast/castMotifs";
import {
  MOTIF_ROLE_VISUALS,
  motifRolesByNode,
  primaryRoleFor,
  type MotifRole,
} from "../domain/services/cast/motifRoles";

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

type MotifBadge = {
  shapeId: TLShapeId;
  x: number;
  y: number;
  role: MotifRole;
};

type ImageBackground = {
  shapeId: TLShapeId;
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
};

type MotifRoleVisualTone = (typeof MOTIF_ROLE_VISUALS)[MotifRole]["tone"];

const MOTIF_BADGE_CLASS: Record<MotifRoleVisualTone, string> = {
  hub: "border-violet-300/80 bg-violet-500/85 text-zinc-50",
  bottleneck: "border-amber-300/80 bg-amber-500/85 text-zinc-900",
  loop: "border-cyan-300/80 bg-cyan-500/85 text-zinc-900",
  diamond: "border-emerald-300/80 bg-emerald-500/85 text-zinc-900",
  cascade: "border-sky-300/80 bg-sky-500/85 text-zinc-50",
  bipartite: "border-fuchsia-300/80 bg-fuchsia-500/85 text-zinc-50",
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
  const comprehendActive = usePalaceStore((s) => s.appMode === "comprehend");
  const comprehendCruxNodeId = usePalaceStore((s) => s.comprehendCruxNodeId);
  const focusNodeId = usePalaceStore((s) => s.focusNodeId);
  const setFocusNodeId = usePalaceStore((s) => s.setFocusNodeId);

  // A mounted editor should keep its live state. Re-loading from a fresh snapshot on every
  // draft/manual save can wipe the visible canvas in the browser build.
  const [initialSnapshot] = useState(() => parseEditorSnapshot(editorSnapshot));

  const editorRef = useRef<Editor | null>(null);
  const lastWalkNodeIdRef = useRef<string | null>(null);
  const lastCruxNodeIdRef = useRef<string | null>(null);
  const lastSceneSnapshotRef = useRef<ReturnType<typeof captureSceneAnalyticsSnapshot> | null>(null);
  const badgeFrameRef = useRef<number | null>(null);
  const [portalBadges, setPortalBadges] = useState<PortalBadge[]>([]);
  const [motifBadges, setMotifBadges] = useState<MotifBadge[]>([]);
  const [imageBackgrounds, setImageBackgrounds] = useState<ImageBackground[]>([]);

  const palaceNodes = usePalaceStore((s) => s.nodes);
  const palaceEdges = usePalaceStore((s) => s.edges);
  const motifRoleByNodeId = useMemo(() => {
    const motifs = detectMotifs({
      nodes: (palaceNodes ?? []).map((n) => ({ id: n.id })),
      edges: (palaceEdges ?? []).map((e) => ({ sourceNodeId: e.sourceNodeId, targetNodeId: e.targetNodeId })),
    });
    const map = motifRolesByNode(motifs);
    const primary = new Map<string, MotifRole>();
    for (const [nodeId, roles] of map.entries()) {
      const role = primaryRoleFor(roles);
      if (role) primary.set(nodeId, role);
    }
    return primary;
  }, [palaceNodes, palaceEdges]);
  const setAvailableTags = usePalaceStore((s) => s.setAvailableTags);
  const activeTags = usePalaceStore((s) => s.activeTags);
  const clearActiveTags = usePalaceStore((s) => s.clearActiveTags);

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

  const recomputeMotifBadges = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setMotifBadges([]);
      return;
    }
    const badges: MotifBadge[] = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      const nodeId = meta.mpNodeId;
      if (!nodeId) continue;
      const role = motifRoleByNodeId.get(nodeId);
      if (!role) continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      const point = editor.pageToViewport({ x: bounds.x, y: bounds.y });
      // Clamp inside the canvas viewport so a node touching the top/left
      // edge doesn't emit a badge that bleeds onto the toolbar above.
      const x = Math.max(4, point.x - 4);
      const y = Math.max(4, point.y - 4);
      badges.push({
        shapeId: shape.id,
        x,
        y,
        role,
      });
    }
    setMotifBadges(badges);
  }, [motifRoleByNodeId]);

  const recomputeImageBackgrounds = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) { setImageBackgrounds([]); return; }
    const backgrounds: ImageBackground[] = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (!meta.mpImageUrl) continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      const tl = editor.pageToViewport({ x: bounds.x, y: bounds.y });
      const br = editor.pageToViewport({ x: bounds.x + bounds.w, y: bounds.y + bounds.h });
      backgrounds.push({
        shapeId: shape.id,
        x: tl.x,
        y: tl.y,
        w: br.x - tl.x,
        h: br.y - tl.y,
        url: meta.mpImageUrl,
      });
    }
    setImageBackgrounds(backgrounds);
  }, []);

  const queueBadgeRefresh = useCallback(() => {
    if (badgeFrameRef.current !== null) return;
    badgeFrameRef.current = window.requestAnimationFrame(() => {
      badgeFrameRef.current = null;
      recomputePortalBadges();
      recomputeMotifBadges();
      recomputeImageBackgrounds();
    });
  }, [recomputePortalBadges, recomputeMotifBadges, recomputeImageBackgrounds]);

  const recomputeAvailableTags = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) { setAvailableTags([]); return; }
    const seen = new Set<string>();
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!s || s.type !== "geo") continue;
      const tags = (s.meta as MemoryPalaceMeta).mpTags;
      if (tags) for (const t of tags) seen.add(t);
    }
    const next = [...seen].sort();
    const prev = usePalaceStore.getState().availableTags;
    if (next.join(",") !== (prev ?? []).join(",")) {
      setAvailableTags(next);
    }
  }, [setAvailableTags]);

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
      recomputeAvailableTags();

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
          recomputeAvailableTags();
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
    [openPortalDestination, palaceId, queueBadgeRefresh, queueDraftSave, recomputeAvailableTags, setEditor, setSelectedShapeId],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nodeId = usePalaceStore.getState().currentWalkNodeId();
    if (walkOpen) clearActiveTags();
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
      if (lastWalkNodeIdRef.current !== nodeId) {
        editor.stopCameraAnimation();
        editor.setSelectedShapes([activeShapeId]);
        editor.zoomToSelection({ animation: { duration: 320 } });
        lastWalkNodeIdRef.current = nodeId;
      }
      if (walkRecallMode && !walkAnswerRevealed) {
        editor.setSelectedShapes([]);
        usePalaceStore.getState().setSelectedShapeId(null);
      } else {
        editor.setSelectedShapes([activeShapeId]);
      }
    }
  }, [walkAnswerRevealed, walkOpen, walkRecallMode, walkIndex, walkRouteId, loci, clearActiveTags]);

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
    const editor = editorRef.current;
    if (!editor || walkOpen) return;
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!s || s.type !== "geo") continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      const match = activeTags.length === 0 || (m.mpTags ?? []).some((t) => activeTags.includes(t));
      editor.updateShape({ id, type: "geo", opacity: match ? 1 : 0.2 });
    }
  }, [activeTags, walkOpen]);

  // Comprehend mode: spotlight the crux node — dim the rest, ring + zoom to it.
  // Walk mode owns the same opacity channel, so we stay out of its way when open.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || walkOpen) return;

    if (!comprehendActive || !comprehendCruxNodeId) {
      lastCruxNodeIdRef.current = null;
      editor.setHintingShapes([]);
      for (const id of editor.getCurrentPageShapeIds()) {
        const s = editor.getShape(id);
        if (s?.type === "geo" && (s.meta as MemoryPalaceMeta).mpNodeId) {
          editor.updateShape({ id, type: "geo", opacity: 1 });
        }
      }
      return;
    }

    let cruxShapeId: TLShapeId | null = null;
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!s || s.type !== "geo") continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      const isCrux = m.mpNodeId === comprehendCruxNodeId;
      if (isCrux) cruxShapeId = id;
      editor.updateShape({ id, type: "geo", opacity: isCrux ? 1 : 0.35 });
    }

    if (cruxShapeId) {
      editor.setHintingShapes([cruxShapeId]);
      if (lastCruxNodeIdRef.current !== comprehendCruxNodeId) {
        editor.stopCameraAnimation();
        editor.setSelectedShapes([cruxShapeId]);
        editor.zoomToSelection({ animation: { duration: 320 } });
        lastCruxNodeIdRef.current = comprehendCruxNodeId;
      }
    }
  }, [comprehendActive, comprehendCruxNodeId, walkOpen]);

  // One-shot node focus (e.g. "Encode this" from Comprehend mode): select + zoom
  // to the requested node, then clear the request so it doesn't re-fire.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !focusNodeId) return;
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!s || s.type !== "geo") continue;
      if ((s.meta as MemoryPalaceMeta).mpNodeId !== focusNodeId) continue;
      editor.stopCameraAnimation();
      editor.setSelectedShapes([id]);
      editor.zoomToSelection({ animation: { duration: 320 } });
      setSelectedShapeId(id);
      break;
    }
    setFocusNodeId(null);
  }, [focusNodeId, setFocusNodeId, setSelectedShapeId]);

  useEffect(() => {
    return () => {
      if (badgeFrameRef.current !== null) {
        window.cancelAnimationFrame(badgeFrameRef.current);
      }
    };
  }, []);

  // Re-render motif badges and image backgrounds when the role map or image
  // meta updates (palace switch, DSL apply, draft restores, etc.).
  useEffect(() => {
    recomputeMotifBadges();
    recomputeImageBackgrounds();
  }, [recomputeMotifBadges, recomputeImageBackgrounds]);

  return (
    <div className="relative h-full min-h-0 w-full flex-1">
      <Tldraw snapshot={initialSnapshot} onMount={onMount} />
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {imageBackgrounds.map((bg) => (
          <img
            key={bg.shapeId}
            src={bg.url}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute object-cover"
            style={{
              left: bg.x,
              top: bg.y,
              width: bg.w,
              height: bg.h,
              borderRadius: 5,
              opacity: 0.25,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
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
        {motifBadges.map((badge) => {
          const visual = MOTIF_ROLE_VISUALS[badge.role];
          return (
            <div
              key={`motif-${badge.shapeId}`}
              role="img"
              aria-label={`motif role: ${badge.role}`}
              title={`motif role: ${badge.role}`}
              className={`pointer-events-none absolute inline-flex h-5 w-5 select-none items-center justify-center rounded-full border text-[11px] font-semibold leading-none shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${MOTIF_BADGE_CLASS[visual.tone]}`}
              style={{ left: badge.x, top: badge.y }}
            >
              {visual.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
