import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Link2Off } from "lucide-react";
import { Tldraw, type TLComponents } from "tldraw";
import type {
  Editor,
  TLEditorSnapshot,
  TLEventInfo,
} from "@tldraw/editor";
import type {
  TLImageShape,
  TLShapeId,
  TLStoreSnapshot,
} from "@tldraw/tlschema";
import "tldraw/tldraw.css";
import { usePalaceStore } from "../store/palaceStore";
import {
  captureSceneAnalyticsSnapshot,
  diffSceneAnalyticsSnapshots,
} from "./analyticsSceneSnapshot";
import { isBackgroundShape } from "./backgroundImage";
import { RouteBuildBanner } from "../components/RouteBuildBanner";
import { createGeoMemoryNode, imageNodeMeta } from "./createMemoryShapes";
import { registerMemoryIdGuard } from "./memoryIds";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";
import { nodeKindFromMeta, portalRefFromMeta } from "./palacePortal";
import { RouteOverlay } from "./RouteOverlay";
import {
  captureStopView,
  liveMemoryNodeIds,
  memoryNodeIdAt,
  memoryNodeIdsInRecords,
  memoryNodeShapeId,
  viewportBoxesByNode,
  zoomToStop,
} from "./routeCanvas";
import type { NodeBox } from "./routeOverlayGeometry";
import { detectMotifs } from "../domain/services/cast/castMotifs";
import {
  MOTIF_ROLE_VISUALS,
  motifRolesByNode,
  primaryRoleFor,
  type MotifRole,
} from "../domain/services/cast/motifRoles";
import {
  computePalaceDifficulty,
  difficultyLevel,
} from "../domain/services/palaceDifficulty";

// tldraw lays its top panel out between the page menu and the style panel, so the Route mode
// banner never sits under either. Module scope keeps the object stable across renders.
const TLDRAW_COMPONENTS: TLComponents = { TopPanel: RouteBuildBanner };

const DIFFICULTY_BADGE_CLASS: Record<number, string> = {
  1: "border-emerald-300/80 bg-emerald-500/85 text-emerald-50",
  2: "border-lime-300/80 bg-lime-500/85 text-lime-50",
  3: "border-amber-300/80 bg-amber-500/85 text-amber-50",
  4: "border-orange-300/80 bg-orange-500/85 text-orange-50",
  5: "border-rose-300/80 bg-rose-500/90 text-rose-50",
};

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

type DifficultyBadge = {
  shapeId: TLShapeId;
  x: number;
  y: number;
  step: number;
  level: number;
};

type ImageBackground = {
  shapeId: TLShapeId;
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
};

type ImageCaption = {
  shapeId: TLShapeId;
  x: number;
  y: number;
  maxWidth: number;
  title: string;
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

export function MemoryPalaceCanvas({ palaceId, editorSnapshot }: Props) {
  const setEditor = usePalaceStore((s) => s.setEditor);
  const setSelectedShapeId = usePalaceStore((s) => s.setSelectedShapeId);
  const queueDraftSave = usePalaceStore((s) => s.queueDraftSave);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const walkRecallMode = usePalaceStore((s) => s.walkRecallMode);
  const walkAnswerRevealed = usePalaceStore((s) => s.walkAnswerRevealed);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const walkDirection = usePalaceStore((s) => s.walkDirection);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const loci = usePalaceStore((s) => s.loci);
  const toolMode = usePalaceStore((s) => s.toolMode);
  const connectFromShapeId = usePalaceStore((s) => s.connect.fromShapeId);
  const comprehendActive = usePalaceStore((s) => s.appMode === "comprehend");
  const comprehendCruxNodeId = usePalaceStore((s) => s.comprehendCruxNodeId);
  const focusNodeId = usePalaceStore((s) => s.focusNodeId);
  const focusView = usePalaceStore((s) => s.focusView);
  const setFocusNodeId = usePalaceStore((s) => s.setFocusNodeId);

  // A mounted editor should keep its live state. Re-loading from a fresh snapshot on every
  // draft/manual save can wipe the visible canvas in the browser build.
  const [initialSnapshot] = useState(() => parseEditorSnapshot(editorSnapshot));

  const editorRef = useRef<Editor | null>(null);
  const lastWalkStopIdRef = useRef<string | null>(null);
  const lastCruxNodeIdRef = useRef<string | null>(null);
  const lastSceneSnapshotRef = useRef<ReturnType<
    typeof captureSceneAnalyticsSnapshot
  > | null>(null);
  const badgeFrameRef = useRef<number | null>(null);
  const [portalBadges, setPortalBadges] = useState<PortalBadge[]>([]);
  const [motifBadges, setMotifBadges] = useState<MotifBadge[]>([]);
  const [difficultyBadges, setDifficultyBadges] = useState<DifficultyBadge[]>(
    [],
  );
  const [imageBackgrounds, setImageBackgrounds] = useState<ImageBackground[]>(
    [],
  );
  const [nodeBoxes, setNodeBoxes] = useState<ReadonlyMap<string, NodeBox>>(
    () => new Map(),
  );

  const [imageCaptions, setImageCaptions] = useState<ImageCaption[]>([]);

  const palaceNodes = usePalaceStore((s) => s.nodes);
  const palaceEdges = usePalaceStore((s) => s.edges);
  const motifRoleByNodeId = useMemo(() => {
    const motifs = detectMotifs({
      nodes: (palaceNodes ?? []).map((n) => ({ id: n.id })),
      edges: (palaceEdges ?? []).map((e) => ({
        sourceNodeId: e.sourceNodeId,
        targetNodeId: e.targetNodeId,
      })),
    });
    const map = motifRolesByNode(motifs);
    const primary = new Map<string, MotifRole>();
    for (const [nodeId, roles] of map.entries()) {
      const role = primaryRoleFor(roles);
      if (role) primary.set(nodeId, role);
    }
    return primary;
  }, [palaceNodes, palaceEdges]);
  const difficultyByNodeId = useMemo(
    () =>
      computePalaceDifficulty(palaceNodes ?? [], palaceEdges ?? [], loci ?? [])
        .byNodeId,
    [palaceNodes, palaceEdges, loci],
  );
  // recompute closures captured at editor mount can be stale; a ref keeps the
  // latest difficulty map reachable so badge refreshes always read fresh data
  const difficultyRef = useRef(difficultyByNodeId);
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
      if (!isMemoryNodeShape(shape)) continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (nodeKindFromMeta(meta) !== "portal") continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      const point = editor.pageToViewport({
        x: bounds.x + bounds.w,
        y: bounds.y,
      });
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
      if (!isMemoryNodeShape(shape)) continue;
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

  const recomputeDifficultyBadges = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setDifficultyBadges([]);
      return;
    }
    const badges: DifficultyBadge[] = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!isMemoryNodeShape(shape)) continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      const nodeId = meta.mpNodeId;
      if (!nodeId) continue;
      const d = difficultyRef.current.get(nodeId);
      if (!d) continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      // bottom-right corner (portal badges sit top-right, motif badges top-left)
      const point = editor.pageToViewport({
        x: bounds.x + bounds.w,
        y: bounds.y + bounds.h,
      });
      badges.push({
        shapeId: shape.id,
        x: point.x - 20,
        y: point.y - 20,
        step: d.result.step,
        level: difficultyLevel(d.result.step),
      });
    }
    setDifficultyBadges(badges);
  }, []);

  const recomputeImageBackgrounds = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setImageBackgrounds([]);
      return;
    }
    const backgrounds: ImageBackground[] = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (!meta.mpImageUrl) continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      const tl = editor.pageToViewport({ x: bounds.x, y: bounds.y });
      const br = editor.pageToViewport({
        x: bounds.x + bounds.w,
        y: bounds.y + bounds.h,
      });
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

  const recomputeNodeBoxes = useCallback(() => {
    const editor = editorRef.current;
    setNodeBoxes(editor ? viewportBoxesByNode(editor) : new Map());
  }, []);

  // An image node has no label of its own, so its title is drawn under it.
  const recomputeImageCaptions = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setImageCaptions([]);
      return;
    }
    const captions: ImageCaption[] = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      if (!isMemoryNodeShape(shape) || shape.type !== "image") continue;
      const title = ((shape.meta ?? {}) as MemoryPalaceMeta).mpTitle?.trim();
      if (!title) continue;
      const bounds = editor.getShapePageBounds(shape.id);
      if (!bounds) continue;
      const bl = editor.pageToViewport({
        x: bounds.x,
        y: bounds.y + bounds.h,
      });
      const br = editor.pageToViewport({
        x: bounds.x + bounds.w,
        y: bounds.y + bounds.h,
      });
      captions.push({
        shapeId: shape.id,
        x: (bl.x + br.x) / 2,
        y: bl.y + 4,
        maxWidth: Math.max(80, br.x - bl.x),
        title,
      });
    }
    setImageCaptions(captions);
  }, []);

  const queueBadgeRefresh = useCallback(() => {
    if (badgeFrameRef.current !== null) return;
    badgeFrameRef.current = window.requestAnimationFrame(() => {
      badgeFrameRef.current = null;
      recomputePortalBadges();
      recomputeMotifBadges();
      recomputeDifficultyBadges();
      recomputeImageBackgrounds();
      recomputeNodeBoxes();
      recomputeImageCaptions();
    });
  }, [
    recomputeNodeBoxes,
    recomputePortalBadges,
    recomputeMotifBadges,
    recomputeDifficultyBadges,
    recomputeImageBackgrounds,
    recomputeImageCaptions,
  ]);

  // refresh badges when difficulty changes (graph or spaced-repetition state),
  // even without a canvas event — loci updates don't touch shapes
  useEffect(() => {
    difficultyRef.current = difficultyByNodeId;
    recomputeDifficultyBadges();
  }, [difficultyByNodeId, recomputeDifficultyBadges]);

  const recomputeAvailableTags = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setAvailableTags([]);
      return;
    }
    const seen = new Set<string>();
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!isMemoryNodeShape(s)) continue;
      const tags = (s.meta as MemoryPalaceMeta).mpTags;
      if (tags) for (const t of tags) seen.add(t);
    }
    const next = [...seen].sort();
    const prev = usePalaceStore.getState().availableTags;
    if (next.join(",") !== (prev ?? []).join(",")) {
      setAvailableTags(next);
    }
  }, [setAvailableTags]);

  // tldraw can deliver a double click's trailing pointer_up after the double_click event it
  // derives from, so the node that double_click just created can reach the pointer_up handler
  // below too. Track only that: a node this hook created, not yet claimed by its pointer_up.
  // Consumed on first match, not just time-limited, so a deliberate later click on the same
  // node (e.g. re-clicking an existing stop to see "already a stop") is never swallowed — only
  // that one paired pointer_up is. The window is generous because under CPU load the pointer_up
  // can lag well behind double_click.
  const justCreatedStopRef = useRef<{ nodeId: string; at: number } | null>(null);
  const addStopFromCanvas = useCallback((nodeId: string, source: "double_click" | "pointer_up") => {
    if (source === "pointer_up") {
      const pending = justCreatedStopRef.current;
      if (pending && pending.nodeId === nodeId && Date.now() - pending.at < 2000) {
        justCreatedStopRef.current = null;
        return false;
      }
    } else {
      justCreatedStopRef.current = { nodeId, at: Date.now() };
    }
    const state = usePalaceStore.getState();
    const editor = editorRef.current;
    state.addStopsToActiveRoute([nodeId], {
      viewFor:
        state.saveStopViews && editor
          ? (id) => captureStopView(editor, id)
          : undefined,
    });
    return true;
  }, []);

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
      // Duplicating or pasting a node copies its ids; a copy needs its own.
      const stopIdGuard = registerMemoryIdGuard(editor, () => palaceId);
      setEditor(editor);
      queueBadgeRefresh();
      recomputeAvailableTags();

      const onEvent = (info: TLEventInfo) => {
        if ((info as { name?: string }).name === "double_click") {
          const point = editor.inputs.currentPagePoint;
          const hit = editor.getShapeAtPoint(point, {
            hitInside: true,
            margin: 8,
          });
          const building = usePalaceStore.getState().toolMode === "route";
          if (!hit) {
            const created = createGeoMemoryNode(editor, palaceId, point);
            // In Route mode a node made on the fly is the next stop.
            if (building) addStopFromCanvas(created.nodeId, "double_click");
            return;
          }
          const hitShape = editor.getShape(hit.id);
          if (isBackgroundShape(hitShape)) {
            // Only an unlocked background is hit-testable; the user is
            // adjusting it, so let tldraw handle the double-click (crop)
            // instead of dropping a node on top of it.
            return;
          }
          if (!isMemoryNodeShape(hitShape)) {
            const created = createGeoMemoryNode(editor, palaceId, point);
            if (building) addStopFromCanvas(created.nodeId, "double_click");
            return;
          }

          const hitMeta = (hitShape.meta ?? {}) as MemoryPalaceMeta;
          const hitKind = nodeKindFromMeta(hitMeta);
          // Route mode is for picking stops, not for travelling through portals.
          if (hitKind === "portal" && !building) {
            void openPortalDestination(hitMeta);
          }
        }

        if (info.type === "pointer" && info.name === "pointer_up") {
          const st = usePalaceStore.getState();
          if (st.toolMode !== "connect" && st.toolMode !== "route") return;
          if (editor.inputs.getIsDragging() || editor.inputs.getIsPanning())
            return;

          // Connect and Route modes react to intentional clicks, not drags.
          const origin = editor.inputs.getOriginPagePoint();
          const current = editor.inputs.getCurrentPagePoint();
          const movement = Math.hypot(
            current.x - origin.x,
            current.y - origin.y,
          );
          if (movement > 6) return;

          const point = editor.inputs.currentPagePoint;
          if (st.toolMode === "route") {
            if (st.walkOpen) return;
            const nodeId = memoryNodeIdAt(editor, point);
            if (!nodeId) return;
            // tldraw has already handled this click and may have opened the node's label for
            // editing (it keeps editing when you click from label to label); a stop click
            // should only pick the stop. The quiet repeat of a double click keeps editing.
            if (addStopFromCanvas(nodeId, "pointer_up") && editor.getEditingShapeId()) {
              editor.complete();
            }
            return;
          }

          const hitId = editor.getShapeAtPoint(point, {
            hitInside: true,
            margin: 8,
          })?.id;
          if (!hitId) return;
          const sh = editor.getShape(hitId);
          if (!isMemoryNodeShape(sh)) return;
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

      // An image the user inserts (paste, drop, media tool) becomes a node.
      // The palace background carries `mpBackground`, so it is left alone.
      const unsubImageNodes = editor.sideEffects.registerBeforeCreateHandler(
        "shape",
        (shape, source) => {
          if (source !== "user" || shape.type !== "image") return shape;
          const meta = imageNodeMeta(editor, palaceId, shape as TLImageShape);
          return meta ? { ...shape, meta } : shape;
        },
      );

      const unsubSel = editor.store.listen(
        () => {
          const ids = editor.getSelectedShapeIds();
          setSelectedShapeId(ids.length === 1 ? ids[0] : null);
          queueBadgeRefresh();
        },
        { source: "all", scope: "session" },
      );

      const unsubDraft = editor.store.listen(
        (entry) => {
          if (usePalaceStore.getState().currentPalace?.id !== palaceId) return;
          // Deleting a node takes its stops out of every route; undoing the delete puts them back.
          const removedNodeIds = memoryNodeIdsInRecords(
            Object.values(entry.changes.removed),
          );
          if (removedNodeIds.length > 0) {
            const live = liveMemoryNodeIds(editor);
            const gone = removedNodeIds.filter((nodeId) => !live.has(nodeId));
            if (gone.length > 0) {
              usePalaceStore.getState().detachStopsForNodes(gone);
            }
          }
          const addedNodeIds = memoryNodeIdsInRecords(
            Object.values(entry.changes.added),
          );
          if (addedNodeIds.length > 0) {
            usePalaceStore.getState().reattachStopsForNodes(addedNodeIds);
          }
          const nextSnapshot = captureSceneAnalyticsSnapshot(editor);
          const analyticsDiff = diffSceneAnalyticsSnapshots(
            lastSceneSnapshotRef.current,
            nextSnapshot,
          );
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
        stopIdGuard();
        unsubImageNodes();
        unsubSel();
        unsubDraft();
        unsubViewport();
        setEditor(null);
        lastSceneSnapshotRef.current = null;
        editorRef.current = null;
        setPortalBadges([]);
      };
    },
    [
      addStopFromCanvas,
      openPortalDestination,
      palaceId,
      queueBadgeRefresh,
      queueDraftSave,
      recomputeAvailableTags,
      setEditor,
      setSelectedShapeId,
    ],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const stop = usePalaceStore.getState().currentWalkStop();
    const nodeId = stop?.nodeId ?? null;
    if (walkOpen) clearActiveTags();
    if (!walkOpen || !stop) {
      lastWalkStopIdRef.current = null;
      editor.setHintingShapes([]);
      for (const id of editor.getCurrentPageShapeIds()) {
        const s = editor.getShape(id);
        if (isMemoryNodeShape(s)) {
          editor.updateShape({ id, type: s.type, opacity: 1 });
        }
      }
      return;
    }

    let activeShapeId: TLShapeId | null = null;
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!isMemoryNodeShape(s)) continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      const hi = m.mpNodeId === nodeId;
      if (hi) activeShapeId = id;
      editor.updateShape({ id, type: s.type, opacity: hi ? 1 : 0.38 });
    }

    if (activeShapeId) {
      editor.setHintingShapes([activeShapeId]);
      // Move once per stop (a node can be on a route twice, with different views).
      if (lastWalkStopIdRef.current !== stop.id) {
        editor.stopCameraAnimation();
        editor.setSelectedShapes([activeShapeId]);
        zoomToStop(editor, activeShapeId, stop.view);
        lastWalkStopIdRef.current = stop.id;
      }
      if (walkRecallMode && !walkAnswerRevealed) {
        editor.setSelectedShapes([]);
        usePalaceStore.getState().setSelectedShapeId(null);
      } else {
        editor.setSelectedShapes([activeShapeId]);
      }
    }
  }, [
    walkAnswerRevealed,
    walkOpen,
    walkRecallMode,
    walkIndex,
    walkDirection,
    walkRouteId,
    loci,
    clearActiveTags,
  ]);

  // Entering Route mode ends any label edit, so clicks pick stops and Escape leaves the mode.
  useEffect(() => {
    const editor = editorRef.current;
    if (toolMode === "route" && editor?.getEditingShapeId()) editor.complete();
  }, [toolMode]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || walkOpen || toolMode !== "connect") {
      if (editor && !walkOpen) {
        editor.setHintingShapes([]);
        for (const id of editor.getCurrentPageShapeIds()) {
          const s = editor.getShape(id);
          if (isMemoryNodeShape(s)) {
            editor.updateShape({ id, type: s.type, opacity: 1 });
          }
        }
      }
      return;
    }

    const memoryIds: TLShapeId[] = [];
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!isMemoryNodeShape(s)) continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      memoryIds.push(id);
      editor.updateShape({ id, type: s.type, opacity: 1 });
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
      if (!isMemoryNodeShape(s)) continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      const match =
        activeTags.length === 0 ||
        (m.mpTags ?? []).some((t) => activeTags.includes(t));
      editor.updateShape({ id, type: s.type, opacity: match ? 1 : 0.2 });
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
        if (isMemoryNodeShape(s)) {
          editor.updateShape({ id, type: s.type, opacity: 1 });
        }
      }
      return;
    }

    let cruxShapeId: TLShapeId | null = null;
    for (const id of editor.getCurrentPageShapeIds()) {
      const s = editor.getShape(id);
      if (!isMemoryNodeShape(s)) continue;
      const m = s.meta as MemoryPalaceMeta;
      if (!m.mpNodeId) continue;
      const isCrux = m.mpNodeId === comprehendCruxNodeId;
      if (isCrux) cruxShapeId = id;
      editor.updateShape({ id, type: s.type, opacity: isCrux ? 1 : 0.35 });
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

  // One-shot node focus (e.g. "Encode this" from Comprehend mode, or a stop in the Routes
  // tab): select the node and show it (in the stop's saved view, if one came with the
  // request), then clear the request so it doesn't re-fire.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !focusNodeId) return;
    const shapeId = memoryNodeShapeId(editor, focusNodeId);
    if (shapeId) {
      editor.stopCameraAnimation();
      editor.setSelectedShapes([shapeId]);
      zoomToStop(editor, shapeId, focusView);
      setSelectedShapeId(shapeId);
    }
    setFocusNodeId(null);
  }, [focusNodeId, focusView, setFocusNodeId, setSelectedShapeId]);

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
    // `isolate` gives the canvas its own stacking context. tldraw sets none, so its UI
    // layers (panels 300, toasts 650, header 999) otherwise outrank the app's dialogs
    // (z-50 to z-140) and stay clickable on top of them.
    <div className="relative isolate h-full min-h-0 w-full flex-1">
      <Tldraw
        snapshot={initialSnapshot}
        onMount={onMount}
        components={TLDRAW_COMPONENTS}
      />
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
      <RouteOverlay boxes={nodeBoxes} />
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {portalBadges.map((badge) => (
          <button
            key={badge.shapeId}
            type="button"
            aria-label={
              badge.linked ? "Open linked palace" : "Portal is not linked yet"
            }
            className={`pointer-events-auto absolute inline-flex h-6 w-6 items-center justify-center rounded-full border shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition ${
              badge.linked
                ? "border-amber-300/90 bg-amber-300 text-zinc-950 hover:bg-amber-200"
                : "border-rose-400/70 bg-rose-950/95 text-rose-100 hover:bg-rose-900"
            }`}
            style={{ left: badge.x, top: badge.y }}
            title={
              badge.linked ? "Open linked palace" : "Portal is not linked yet"
            }
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
            {badge.linked ? (
              <ExternalLink className="h-3.5 w-3.5" />
            ) : (
              <Link2Off className="h-3.5 w-3.5" />
            )}
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
        {imageCaptions.map((caption) => (
          <div
            key={`caption-${caption.shapeId}`}
            className="pointer-events-none absolute -translate-x-1/2 select-none truncate rounded bg-zinc-950/75 px-1.5 py-0.5 text-center text-[11px] font-medium leading-tight text-zinc-100"
            style={{
              left: caption.x,
              top: caption.y,
              maxWidth: caption.maxWidth,
            }}
          >
            {caption.title}
          </div>
        ))}
        {difficultyBadges.map((badge) => (
          <div
            key={`difficulty-${badge.shapeId}`}
            role="img"
            aria-label={`difficulty ${badge.step}`}
            title={`difficulty: ${badge.step} (level ${badge.level} of 5)`}
            className={`pointer-events-none absolute inline-flex h-5 min-w-[20px] select-none items-center justify-center rounded-full border px-1 text-[10px] font-bold leading-none tabular-nums shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${DIFFICULTY_BADGE_CLASS[badge.level]}`}
            style={{ left: badge.x, top: badge.y }}
          >
            {badge.step}
          </div>
        ))}
      </div>
    </div>
  );
}
