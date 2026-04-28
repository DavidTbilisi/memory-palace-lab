import { create } from "zustand";
import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import type {
  AnalyticsEvent,
  AnalyticsEventGroup,
  AnalyticsEventType,
  Locus,
  MemoryEdge,
  MemoryNode,
  MemoryRoute,
  Palace,
  PalaceSnapshot,
  RecallRating,
} from "../domain/entities/types";
import { buildPalaceSnapshot } from "../canvas/buildPalaceSnapshot";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { resolveMemoryNodeTitle } from "../canvas/readShapeText";
import { createAnalyticsEvent } from "../domain/services/analyticsService";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { clearPalaceDraft, loadPalaceDraft, savePalaceDraft } from "../infrastructure/draft/palaceDraftStore";
import {
  walkNext as nextWalkIndex,
  walkPrevious as prevWalkIndex,
  orderedLoci,
  locusAtOrderedIndex,
  clampWalkIndex,
} from "../domain/services/walkService";
import {
  deleteLocus as deleteRouteLocus,
  moveLocus as moveRouteLocus,
  reassignLocusRoute as reassignRouteLocus,
} from "../domain/services/routeEditing";
import { applySm2Schedule, defaultLocusSchedule, normalizeLocusSchedule } from "../domain/services/spacedRepetition";

const repo = getPalaceRepository();
const DRAFT_SAVE_DELAY_MS = 900;
const DAILY_REVIEW_GOAL_STORAGE_KEY = "mp-daily-review-goal";
const DEFAULT_DAILY_REVIEW_GOAL = 10;

export type ToolMode = "select" | "connect" | "route";
export type PalacePersistenceState = "clean" | "dirty" | "draft";

type ConnectState = { fromShapeId: string | null };
type RecordAnalyticsInput = {
  eventType: AnalyticsEventType;
  eventGroup: AnalyticsEventGroup;
  sessionId?: string | null;
  palaceId?: string | null;
  routeId?: string | null;
  nodeId?: string | null;
  payload?: Record<string, unknown>;
};

type WalkRatingCounts = Record<RecallRating, number>;

type WalkSummary = {
  sessionId: string | null;
  routeId: string | null;
  routeName: string;
  reviewedCount: number;
  ratings: WalkRatingCounts;
  completedAt: string;
  nextReviewAt: string | null;
};

export type PalaceStore = {
  palaces: Palace[];
  trashedPalaces: Palace[];
  currentPalace: Palace | null;
  nodes: MemoryNode[];
  edges: MemoryEdge[];
  routes: MemoryRoute[];
  loci: Locus[];
  analyticsEvents: AnalyticsEvent[];
  analyticsSessionId: string | null;
  analyticsLoaded: boolean;
  editorRef: Editor | null;
  selectedShapeId: string | null;
  toolMode: ToolMode;
  routePanelOpen: boolean;
  connect: ConnectState;
  walkOpen: boolean;
  walkRouteId: string | null;
  walkIndex: number;
  walkSessionId: string | null;
  walkRecallMode: boolean;
  walkCueOnly: boolean;
  walkAnswerRevealed: boolean;
  walkStepRated: boolean;
  walkRatingCounts: WalkRatingCounts;
  walkSummary: WalkSummary | null;
  walkStepEnteredAt: string | null;
  walkRevealedAt: string | null;
  walkRevealLatencyMs: number | null;
  dailyReviewGoal: number;
  persistenceState: PalacePersistenceState;
  lastDraftSavedAt: string | null;
  lastCheckpointSavedAt: string | null;
  draftRestored: boolean;
  pendingCast: null | { fromShapeId: string; toShapeId: string; sourceNodeId: string; targetNodeId: string };
  loadPalaces: () => Promise<void>;
  loadAnalyticsEvents: (limit?: number) => Promise<void>;
  recordAnalyticsEvent: (input: RecordAnalyticsInput) => Promise<AnalyticsEvent>;
  openPalace: (id: string) => Promise<void>;
  createPalace: (name: string, atlasPath?: string | null) => Promise<void>;
  saveCurrent: () => Promise<void>;
  deletePalace: (id: string) => Promise<void>;
  restorePalace: (id: string) => Promise<void>;
  purgePalace: (id: string) => Promise<void>;
  queueDraftSave: () => void;
  flushDraftSave: () => Promise<void>;
  setCurrentPalaceMeta: (patch: Partial<Pick<Palace, "name" | "alias" | "atlasPath">>) => void;
  setEditor: (e: Editor | null) => void;
  setSelectedShapeId: (id: string | null) => void;
  setToolMode: (m: ToolMode) => void;
  setRoutePanelOpen: (open: boolean) => void;
  setConnectFrom: (id: string | null) => void;
  setPendingCast: (v: PalaceStore["pendingCast"]) => void;
  addRoute: (name: string) => void;
  addLocusForSelectedRoute: (nodeId: string, label?: string) => void;
  updateRouteName: (routeId: string, name: string) => void;
  updateLocusLabel: (locusId: string, label: string) => void;
  moveLocus: (locusId: string, direction: "up" | "down") => void;
  deleteLocus: (locusId: string) => void;
  reassignLocusRoute: (locusId: string, routeId: string) => void;
  moveRoute: (routeId: string, direction: "up" | "down") => void;
  deleteRoute: (routeId: string) => void;
  replaceRoutesAndLoci: (routes: MemoryRoute[], loci: Locus[]) => void;
  setWalkRoute: (routeId: string | null) => void;
  setWalkOpen: (v: boolean) => void;
  setWalkRecallMode: (v: boolean) => void;
  setWalkCueOnly: (v: boolean) => void;
  setDailyReviewGoal: (goal: number) => void;
  dismissWalkSummary: () => void;
  revealWalkAnswer: () => void;
  rateWalkRecall: (rating: RecallRating) => void;
  walkNext: () => void;
  walkPrev: () => void;
  setWalkIndex: (index: number) => void;
  currentWalkNodeId: () => string | null;
  hydrateFromSnapshot: (
    s: PalaceSnapshot,
    options?: { persistenceState?: PalacePersistenceState; draftRestored?: boolean; lastDraftSavedAt?: string | null },
  ) => void;
};

function safeElapsedMs(isoTimestamp: string | null, now: number): number | null {
  if (!isoTimestamp) return null;
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) return null;
  return Math.max(0, now - parsed);
}

const RECALL_RATING_VALUES: Record<RecallRating, number> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 4,
};

const EMPTY_WALK_RATINGS: WalkRatingCounts = {
  again: 0,
  hard: 0,
  good: 0,
  easy: 0,
};

function normalizeLoci(loci: Locus[], nowIso = new Date().toISOString()) {
  return loci.map((locus) => normalizeLocusSchedule(locus, nowIso));
}

function loadDailyReviewGoal() {
  if (typeof window === "undefined") return DEFAULT_DAILY_REVIEW_GOAL;
  try {
    const raw = window.localStorage.getItem(DAILY_REVIEW_GOAL_STORAGE_KEY);
    const parsed = raw ? Number(raw) : DEFAULT_DAILY_REVIEW_GOAL;
    if (!Number.isFinite(parsed)) return DEFAULT_DAILY_REVIEW_GOAL;
    return Math.max(1, Math.min(200, Math.round(parsed)));
  } catch {
    return DEFAULT_DAILY_REVIEW_GOAL;
  }
}

export const usePalaceStore = create<PalaceStore>((set, get) => {
  let draftTimer: ReturnType<typeof setTimeout> | null = null;

  const mergePalaceIntoList = (palaces: Palace[], palace: Palace) => {
    if (palaces.some((entry) => entry.id === palace.id)) {
      return palaces.map((entry) => (entry.id === palace.id ? { ...entry, ...palace } : entry));
    }
    return [palace, ...palaces];
  };

  const clearDraftTimer = () => {
    if (!draftTimer) return;
    clearTimeout(draftTimer);
    draftTimer = null;
  };

  const mergeAnalyticsEvents = (current: AnalyticsEvent[], next: AnalyticsEvent[]) => {
    const byId = new Map<string, AnalyticsEvent>();
    for (const event of current) byId.set(event.id, event);
    for (const event of next) byId.set(event.id, event);
    return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  };

  const buildCurrentSnapshot = () => {
    const { editorRef, currentPalace, routes, loci } = get();
    if (!editorRef || !currentPalace) return null;
    return buildPalaceSnapshot(editorRef, currentPalace, routes, normalizeLoci(loci));
  };

  const appendAnalyticsEvents = async (events: AnalyticsEvent[]) => {
    if (events.length === 0) return;
    await repo.appendAnalyticsEvents(events);
    set((state) => ({
      analyticsEvents: mergeAnalyticsEvents(state.analyticsEvents, events),
      analyticsLoaded: true,
    }));
  };

  const recordAnalytics = async (input: RecordAnalyticsInput) => {
    const state = get();
    const event = createAnalyticsEvent({
      eventType: input.eventType,
      eventGroup: input.eventGroup,
      sessionId: "sessionId" in input ? input.sessionId ?? null : state.analyticsSessionId,
      palaceId: "palaceId" in input ? input.palaceId ?? null : state.currentPalace?.id ?? null,
      routeId: "routeId" in input ? input.routeId ?? null : null,
      nodeId: "nodeId" in input ? input.nodeId ?? null : null,
      payload: input.payload,
    });
    await appendAnalyticsEvents([event]);
    return event;
  };

  const getWalkContext = () => {
    const { loci, routes, walkRouteId, walkIndex, currentPalace } = get();
    const routeId = walkRouteId ?? routes[0]?.id ?? null;
    const route = routes.find((candidate) => candidate.id === routeId) ?? null;
    if (!routeId) {
      return {
        palaceId: currentPalace?.id ?? null,
        routeId: null,
        routeName: null,
        list: [] as Locus[],
        locus: null,
        nodeId: null,
        count: 0,
        stepIndex: 0,
      };
    }
    const list = orderedLoci(loci.filter((locus) => locus.routeId === routeId));
    const locus = locusAtOrderedIndex(list, walkIndex) ?? null;
    return {
      palaceId: currentPalace?.id ?? null,
      routeId,
      routeName: route?.name ?? null,
      list,
      locus,
      nodeId: locus?.nodeId ?? null,
      count: list.length,
      stepIndex: walkIndex,
    };
  };

  const resolveNodeTitleForAnalytics = (nodeId: string | null) => {
    if (!nodeId) return null;
    const { editorRef, nodes } = get();
    if (editorRef) {
      for (const shapeId of editorRef.getCurrentPageShapeIds()) {
        const shape = editorRef.getShape(shapeId as TLShapeId);
        if (shape?.type !== "geo") continue;
        const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
        if (meta.mpNodeId !== nodeId) continue;
        return resolveMemoryNodeTitle(shape);
      }
    }
    return nodes.find((node) => node.id === nodeId)?.title ?? null;
  };

  const noteWalkStepEntered = (direction: "open" | "next" | "prev" | "route_change") => {
    const enteredAt = new Date().toISOString();
    set((state) => ({
      walkStepEnteredAt: enteredAt,
      walkRevealedAt: null,
      walkRevealLatencyMs: null,
      walkStepRated: false,
      walkAnswerRevealed: !state.walkRecallMode,
    }));
    const context = getWalkContext();
    if (!context.routeId || !context.nodeId) return;
    void recordAnalytics({
      eventType: "walk_stepped",
      eventGroup: "review",
      sessionId: get().walkSessionId,
      palaceId: context.palaceId,
      routeId: context.routeId,
      nodeId: context.nodeId,
      payload: {
        direction,
        stepIndex: context.stepIndex,
        routeLength: context.count,
        locusId: context.locus?.id ?? null,
        routeName: context.routeName,
        nodeTitle: resolveNodeTitleForAnalytics(context.nodeId),
      },
    });
  };

  const persistDraftNow = () => {
    const snapshot = buildCurrentSnapshot();
    if (!snapshot) return;
    const savedAt = savePalaceDraft(snapshot);
    set((state) => ({
      currentPalace: snapshot.palace,
      palaces: mergePalaceIntoList(state.palaces, snapshot.palace),
      nodes: snapshot.nodes,
      edges: snapshot.edges,
        persistenceState: savedAt ? "draft" : state.persistenceState,
        lastDraftSavedAt: savedAt ?? state.lastDraftSavedAt,
      }));
      if (savedAt) {
        void recordAnalytics({
          eventType: "draft_saved",
          eventGroup: "palace",
          palaceId: snapshot.palace.id,
          payload: {
            savedAt,
            nodeCount: snapshot.nodes.length,
            edgeCount: snapshot.edges.length,
            routeCount: snapshot.routes.length,
          },
        });
      }
  };

  const scheduleDraftSave = () => {
    const { currentPalace, editorRef } = get();
    if (!currentPalace) return;
    clearDraftTimer();
    set({ persistenceState: "dirty", draftRestored: false });
    if (!editorRef) return;
    draftTimer = setTimeout(() => {
      draftTimer = null;
      persistDraftNow();
    }, DRAFT_SAVE_DELAY_MS);
  };

  return {
    palaces: [],
    trashedPalaces: [],
    currentPalace: null,
    nodes: [],
    edges: [],
    routes: [],
    loci: [],
    analyticsEvents: [],
    analyticsSessionId: null,
    analyticsLoaded: false,
    editorRef: null,
    selectedShapeId: null,
    toolMode: "select",
    routePanelOpen: false,
    connect: { fromShapeId: null },
    walkOpen: false,
    walkRouteId: null,
    walkIndex: 0,
    walkSessionId: null,
    walkRecallMode: false,
    walkCueOnly: true,
    walkAnswerRevealed: true,
    walkStepRated: false,
    walkRatingCounts: { ...EMPTY_WALK_RATINGS },
    walkSummary: null,
    walkStepEnteredAt: null,
    walkRevealedAt: null,
    walkRevealLatencyMs: null,
    dailyReviewGoal: loadDailyReviewGoal(),
    persistenceState: "clean",
    lastDraftSavedAt: null,
    lastCheckpointSavedAt: null,
    draftRestored: false,
    pendingCast: null,

    async loadPalaces() {
      const [palaces, trashedPalaces] = await Promise.all([repo.listPalaces(), repo.listTrashedPalaces()]);
      const currentPalace = get().currentPalace;
      set({
        palaces: currentPalace ? mergePalaceIntoList(palaces, currentPalace) : palaces,
        trashedPalaces,
      });
    },

    async loadAnalyticsEvents(limit) {
      const analyticsEvents = await repo.listAnalyticsEvents(limit);
      set((state) => ({
        analyticsEvents: mergeAnalyticsEvents(state.analyticsEvents, analyticsEvents),
        analyticsLoaded: true,
      }));
    },

    async recordAnalyticsEvent(input) {
      return recordAnalytics(input);
    },

    async openPalace(id: string) {
      await get().flushDraftSave();
      clearDraftTimer();
      const snap = await repo.loadPalace(id);
      if (!snap) return;
      const sessionId = crypto.randomUUID();
      set({ analyticsSessionId: sessionId });
      const draft = loadPalaceDraft(id);
      if (draft) {
        get().hydrateFromSnapshot(draft.snapshot, {
          persistenceState: "draft",
          draftRestored: true,
          lastDraftSavedAt: draft.savedAt,
        });
      } else {
        get().hydrateFromSnapshot(snap, {
          persistenceState: "clean",
          draftRestored: false,
          lastDraftSavedAt: null,
        });
      }
      await recordAnalytics({
        eventType: "palace_opened",
        eventGroup: "palace",
        sessionId,
        palaceId: id,
        payload: {
          source: draft ? "draft" : "saved",
          nodeCount: (draft?.snapshot ?? snap).nodes.length,
          edgeCount: (draft?.snapshot ?? snap).edges.length,
          routeCount: (draft?.snapshot ?? snap).routes.length,
        },
      });
    },

    async createPalace(name: string, atlasPath?: string | null) {
      await get().flushDraftSave();
      clearDraftTimer();
      const p = await repo.createPalace(name.trim() || "Untitled palace", atlasPath?.trim() || null);
      await recordAnalytics({
        eventType: "palace_created",
        eventGroup: "palace",
        palaceId: p.id,
        sessionId: null,
        payload: {
          name: p.name,
          atlasPath: p.atlasPath ?? null,
        },
      });
      await get().loadPalaces();
      await get().openPalace(p.id);
    },

    async saveCurrent() {
      clearDraftTimer();
      const snap = buildCurrentSnapshot();
      if (!snap) return;
      const savedAt = new Date().toISOString();
      await repo.savePalace(snap);
      clearPalaceDraft(snap.palace.id);
      set((state) => ({
        currentPalace: snap.palace,
        palaces: mergePalaceIntoList(state.palaces, snap.palace),
        nodes: snap.nodes,
        edges: snap.edges,
        persistenceState: "clean",
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: savedAt,
        draftRestored: false,
      }));
      await get().loadPalaces();
      await recordAnalytics({
        eventType: "palace_saved",
        eventGroup: "palace",
        palaceId: snap.palace.id,
        payload: {
          nodeCount: snap.nodes.length,
          edgeCount: snap.edges.length,
          routeCount: snap.routes.length,
        },
      });
    },

    async flushDraftSave() {
      const shouldPersist = get().persistenceState === "dirty";
      clearDraftTimer();
      if (!shouldPersist) return;
      persistDraftNow();
    },

    queueDraftSave() {
      scheduleDraftSave();
    },

    setCurrentPalaceMeta(patch) {
      const { currentPalace, palaces } = get();
      if (!currentPalace) return;
      const nextPalace: Palace = {
        ...currentPalace,
        ...patch,
        name: patch.name?.trim() || currentPalace.name,
        alias: patch.alias === undefined ? currentPalace.alias ?? null : patch.alias?.trim() || null,
        atlasPath:
          patch.atlasPath === undefined ? currentPalace.atlasPath ?? null : patch.atlasPath?.trim() || null,
      };
      set({
        currentPalace: nextPalace,
        palaces: palaces.map((palace) => (palace.id === nextPalace.id ? { ...palace, ...nextPalace } : palace)),
      });
      scheduleDraftSave();
    },

    setEditor(editorRef) {
      set({ editorRef });
      if (editorRef && get().persistenceState === "dirty") {
        scheduleDraftSave();
      }
    },
    setSelectedShapeId: (selectedShapeId) => set({ selectedShapeId }),
    setToolMode: (toolMode) => set({ toolMode, connect: { fromShapeId: null } }),
    setRoutePanelOpen: (routePanelOpen) => set({ routePanelOpen }),
    setConnectFrom: (fromShapeId) => set({ connect: { fromShapeId } }),
    setPendingCast: (pendingCast) => set({ pendingCast }),

    addRoute(name: string) {
      const { currentPalace, routes, walkRouteId } = get();
      if (!currentPalace) return;
      const r: MemoryRoute = {
        id: crypto.randomUUID(),
        palaceId: currentPalace.id,
        name: name.trim() || "Route",
      };
      set({
        routes: [...routes, r],
        walkRouteId: walkRouteId ?? r.id,
      });
      scheduleDraftSave();
      void recordAnalytics({
        eventType: "route_created",
        eventGroup: "graph",
        palaceId: currentPalace.id,
        routeId: r.id,
        payload: {
          name: r.name,
        },
      });
    },

    addLocusForSelectedRoute(nodeId: string, label = "") {
      const { walkRouteId, loci, routes } = get();
      const routeId = walkRouteId ?? routes[0]?.id;
      if (!routeId) return;
      const max = loci.filter((l) => l.routeId === routeId).reduce((m, l) => Math.max(m, l.orderIndex), -1);
      const schedule = defaultLocusSchedule();
      const l: Locus = {
        id: crypto.randomUUID(),
        routeId,
        nodeId,
        orderIndex: max + 1,
        label,
        ...schedule,
      };
      set({ loci: [...loci, l] });
      scheduleDraftSave();
      void recordAnalytics({
        eventType: "locus_added",
        eventGroup: "graph",
        routeId,
        nodeId,
        payload: {
          locusId: l.id,
          orderIndex: l.orderIndex,
          label: l.label,
        },
      });
    },

    updateRouteName(routeId: string, name: string) {
      const { routes } = get();
      const trimmedName = name.trim() || "Route";
      set({
        routes: routes.map((route) => (route.id === routeId ? { ...route, name: trimmedName } : route)),
      });
      scheduleDraftSave();
    },

    updateLocusLabel(locusId: string, label: string) {
      const { loci } = get();
      const previous = loci.find((locus) => locus.id === locusId);
      set({
        loci: loci.map((l) => (l.id === locusId ? { ...l, label } : l)),
      });
      scheduleDraftSave();
      if (previous && previous.label !== label) {
        void recordAnalytics({
          eventType: "locus_updated",
          eventGroup: "graph",
          routeId: previous.routeId,
          nodeId: previous.nodeId,
          payload: {
            locusId,
            fromLabel: previous.label,
            toLabel: label,
            orderIndex: previous.orderIndex,
          },
        });
      }
    },

    moveLocus(locusId, direction) {
      const { loci } = get();
      set({ loci: normalizeLoci(moveRouteLocus(loci, locusId, direction)) });
      scheduleDraftSave();
    },

    async deletePalace(id: string) {
      const state = get();
      await state.flushDraftSave();
      clearDraftTimer();
      clearPalaceDraft(id);
      await repo.softDeletePalace(id);
      const wasCurrent = state.currentPalace?.id === id;
      if (wasCurrent) {
        set({
          currentPalace: null,
          nodes: [],
          edges: [],
          routes: [],
          loci: [],
          editorRef: null,
          selectedShapeId: null,
          routePanelOpen: false,
          walkOpen: false,
          walkRouteId: null,
          walkIndex: 0,
          walkSessionId: null,
          walkAnswerRevealed: !state.walkRecallMode,
          walkStepRated: false,
          walkRatingCounts: { ...EMPTY_WALK_RATINGS },
          walkSummary: null,
          walkStepEnteredAt: null,
          walkRevealedAt: null,
          walkRevealLatencyMs: null,
          persistenceState: "clean",
          lastDraftSavedAt: null,
          lastCheckpointSavedAt: null,
          draftRestored: false,
        });
      }
      await get().loadPalaces();
      await recordAnalytics({
        eventType: "palace_deleted",
        eventGroup: "palace",
        palaceId: id,
        payload: {
          source: "trash",
          retentionDays: 30,
        },
      });
    },

    async restorePalace(id: string) {
      await repo.restorePalace(id);
      await get().loadPalaces();
      await recordAnalytics({
        eventType: "palace_restored",
        eventGroup: "palace",
        palaceId: id,
        payload: {
          source: "trash",
        },
      });
    },

    async purgePalace(id: string) {
      clearPalaceDraft(id);
      await repo.purgePalace(id);
      await get().loadPalaces();
    },

    deleteLocus(locusId) {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const nextLoci = normalizeLoci(deleteRouteLocus(loci, locusId));
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      const nextRouteLength = effectiveRouteId
        ? nextLoci.filter((locus) => locus.routeId === effectiveRouteId).length
        : 0;
      set({
        loci: nextLoci,
        walkIndex: clampWalkIndex(walkIndex, nextRouteLength),
      });
      scheduleDraftSave();
    },

    reassignLocusRoute(locusId, routeId) {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const nextLoci = normalizeLoci(reassignRouteLocus(loci, locusId, routeId));
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      const nextRouteLength = effectiveRouteId
        ? nextLoci.filter((locus) => locus.routeId === effectiveRouteId).length
        : 0;
      set({
        loci: nextLoci,
        walkIndex: clampWalkIndex(walkIndex, nextRouteLength),
      });
      scheduleDraftSave();
    },

    moveRoute(routeId, direction) {
      const { routes } = get();
      const idx = routes.findIndex((r) => r.id === routeId);
      if (idx === -1) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= routes.length) return;
      const next = [...routes];
      [next[idx], next[swapIdx]] = [next[swapIdx]!, next[idx]!];
      set({ routes: next });
      scheduleDraftSave();
    },

    deleteRoute(routeId) {
      const { routes, loci, walkRouteId } = get();
      const nextRoutes = routes.filter((r) => r.id !== routeId);
      const nextLoci = normalizeLoci(loci.filter((l) => l.routeId !== routeId));
      const nextWalkRouteId = walkRouteId === routeId ? (nextRoutes[0]?.id ?? null) : walkRouteId;
      set({ routes: nextRoutes, loci: nextLoci, walkRouteId: nextWalkRouteId });
      scheduleDraftSave();
    },

    replaceRoutesAndLoci(routes, loci) {
      const { currentPalace, routes: prevRoutes, loci: prevLoci } = get();
      const normalizedLoci = normalizeLoci(loci);
      set({
        routes,
        loci: normalizedLoci,
        walkRouteId: routes[0]?.id ?? null,
        walkIndex: 0,
        walkOpen: false,
        walkSessionId: null,
        walkAnswerRevealed: !get().walkRecallMode,
        walkStepRated: false,
        walkRatingCounts: { ...EMPTY_WALK_RATINGS },
        walkSummary: null,
        walkStepEnteredAt: null,
        walkRevealedAt: null,
        walkRevealLatencyMs: null,
      });
      scheduleDraftSave();
      if (!currentPalace) return;
      const previousRoutesById = new Map(prevRoutes.map((route) => [route.id, route]));
      const previousLociById = new Map(prevLoci.map((locus) => [locus.id, locus]));
      const events: AnalyticsEvent[] = [];

      for (const route of routes) {
        if (previousRoutesById.has(route.id)) continue;
        events.push(
          createAnalyticsEvent({
            eventType: "route_created",
            eventGroup: "graph",
            sessionId: get().analyticsSessionId,
            palaceId: currentPalace.id,
            routeId: route.id,
            payload: { name: route.name },
          }),
        );
      }

      for (const locus of normalizedLoci) {
        const previous = previousLociById.get(locus.id);
        if (!previous) {
          events.push(
            createAnalyticsEvent({
              eventType: "locus_added",
              eventGroup: "graph",
              sessionId: get().analyticsSessionId,
              palaceId: currentPalace.id,
              routeId: locus.routeId,
              nodeId: locus.nodeId,
              payload: {
                locusId: locus.id,
                orderIndex: locus.orderIndex,
                label: locus.label,
              },
            }),
          );
          continue;
        }
        if (
          previous.label === locus.label &&
          previous.orderIndex === locus.orderIndex &&
          previous.routeId === locus.routeId &&
          previous.nodeId === locus.nodeId
        ) {
          continue;
        }
        events.push(
          createAnalyticsEvent({
            eventType: "locus_updated",
            eventGroup: "graph",
            sessionId: get().analyticsSessionId,
            palaceId: currentPalace.id,
            routeId: locus.routeId,
            nodeId: locus.nodeId,
            payload: {
              locusId: locus.id,
              previousRouteId: previous.routeId,
              previousNodeId: previous.nodeId,
              previousOrderIndex: previous.orderIndex,
              previousLabel: previous.label,
              nextOrderIndex: locus.orderIndex,
              nextLabel: locus.label,
            },
          }),
        );
      }

      void appendAnalyticsEvents(events);
    },

    setWalkRoute(walkRouteId) {
      const state = get();
      const wasOpen = state.walkOpen;
      const previousContext = getWalkContext();
      const previousWalkSessionId = state.walkSessionId;
      const nextWalkSessionId = wasOpen && walkRouteId ? crypto.randomUUID() : null;
      set((state) => ({
        walkRouteId,
        walkIndex: 0,
        walkSessionId: nextWalkSessionId,
        walkAnswerRevealed: !state.walkRecallMode,
        walkStepRated: false,
        walkRatingCounts: { ...EMPTY_WALK_RATINGS },
        walkSummary: null,
        walkStepEnteredAt: null,
        walkRevealedAt: null,
        walkRevealLatencyMs: null,
      }));
      if (!wasOpen || !walkRouteId) return;
      if (previousContext.routeId && previousWalkSessionId) {
        void recordAnalytics({
          eventType: "walk_closed",
          eventGroup: "review",
          sessionId: previousWalkSessionId,
          routeId: previousContext.routeId,
          nodeId: previousContext.nodeId,
          payload: {
            stepIndex: previousContext.stepIndex,
            routeLength: previousContext.count,
            routeName: previousContext.routeName,
            nodeTitle: resolveNodeTitleForAnalytics(previousContext.nodeId),
          },
        });
      }
      const context = getWalkContext();
      if (context.routeId) {
        void recordAnalytics({
          eventType: "walk_started",
          eventGroup: "review",
          sessionId: nextWalkSessionId,
          routeId: context.routeId,
          nodeId: context.nodeId,
          payload: {
            source: "route_change",
            routeLength: context.count,
            routeName: context.routeName,
            nodeTitle: resolveNodeTitleForAnalytics(context.nodeId),
          },
        });
      }
      noteWalkStepEntered("route_change");
    },
    setWalkOpen(walkOpen) {
      const state = get();
      const wasOpen = state.walkOpen;
      const previousContext = getWalkContext();
      const nextWalkSessionId = walkOpen && !wasOpen ? crypto.randomUUID() : walkOpen ? state.walkSessionId : null;
      set({
        walkOpen,
        walkIndex: walkOpen && !wasOpen ? 0 : state.walkIndex,
        walkSessionId: nextWalkSessionId,
        walkAnswerRevealed: walkOpen ? !state.walkRecallMode : false,
        walkStepRated: false,
        walkRatingCounts: walkOpen && !wasOpen ? { ...EMPTY_WALK_RATINGS } : state.walkRatingCounts,
        walkSummary: walkOpen && !wasOpen ? null : state.walkSummary,
        walkStepEnteredAt: walkOpen ? state.walkStepEnteredAt : null,
        walkRevealedAt: null,
        walkRevealLatencyMs: null,
      });

      if (!walkOpen) {
        if (wasOpen && previousContext.routeId) {
          void recordAnalytics({
            eventType: "walk_closed",
            eventGroup: "review",
            sessionId: state.walkSessionId,
            routeId: previousContext.routeId,
            nodeId: previousContext.nodeId,
            payload: {
              stepIndex: previousContext.stepIndex,
              routeLength: previousContext.count,
              routeName: previousContext.routeName,
              nodeTitle: resolveNodeTitleForAnalytics(previousContext.nodeId),
            },
          });
        }
        set({
          walkStepEnteredAt: null,
          walkRevealedAt: null,
          walkRevealLatencyMs: null,
          walkStepRated: false,
          walkRatingCounts: { ...EMPTY_WALK_RATINGS },
        });
        return;
      }

      if (!wasOpen) {
        const context = getWalkContext();
        if (context.routeId) {
          void recordAnalytics({
            eventType: "walk_started",
            eventGroup: "review",
            sessionId: nextWalkSessionId,
            routeId: context.routeId,
            nodeId: context.nodeId,
            payload: {
              source: "toggle",
              routeLength: context.count,
              routeName: context.routeName,
              nodeTitle: resolveNodeTitleForAnalytics(context.nodeId),
            },
          });
        }
        noteWalkStepEntered("open");
      }
    },

    setWalkRecallMode(walkRecallMode) {
      const enteredAt = new Date().toISOString();
      set({
        walkRecallMode,
        walkAnswerRevealed: !walkRecallMode,
        walkStepRated: false,
        walkStepEnteredAt: get().walkOpen ? enteredAt : null,
        walkRevealedAt: null,
        walkRevealLatencyMs: null,
      });
    },

    setWalkCueOnly(walkCueOnly) {
      set({ walkCueOnly });
    },

    setDailyReviewGoal(goal) {
      const normalized = Math.max(1, Math.min(200, Math.round(goal || DEFAULT_DAILY_REVIEW_GOAL)));
      set({ dailyReviewGoal: normalized });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(DAILY_REVIEW_GOAL_STORAGE_KEY, String(normalized));
      }
    },

    dismissWalkSummary() {
      set({ walkSummary: null });
    },

    revealWalkAnswer() {
      const context = getWalkContext();
      const enteredAt = get().walkStepEnteredAt;
      const now = Date.now();
      const timeToRevealMs = safeElapsedMs(enteredAt, now);
      set({
        walkAnswerRevealed: true,
        walkRevealedAt: new Date(now).toISOString(),
        walkRevealLatencyMs: timeToRevealMs,
      });
      if (!context.routeId || !context.nodeId) return;
      void recordAnalytics({
        eventType: "walk_answer_revealed",
        eventGroup: "review",
        sessionId: get().walkSessionId,
        routeId: context.routeId,
        nodeId: context.nodeId,
        payload: {
          stepIndex: context.stepIndex,
          routeLength: context.count,
          locusId: context.locus?.id ?? null,
          routeName: context.routeName,
          nodeTitle: resolveNodeTitleForAnalytics(context.nodeId),
          timeToRevealMs,
        },
      });
    },

    rateWalkRecall(rating) {
      const context = getWalkContext();
      if (!context.routeId || !context.nodeId) return;
      if (get().walkRecallMode && !get().walkAnswerRevealed) return;
      const enteredAt = get().walkStepEnteredAt;
      const revealedAt = get().walkRevealedAt;
      const revealLatencyMs = get().walkRevealLatencyMs;
      const now = Date.now();
      const timeToRevealMs = revealLatencyMs ?? safeElapsedMs(enteredAt, now);
      const timeFromRevealToRatingMs = safeElapsedMs(revealedAt, now);
      const ratedAt = new Date(now).toISOString();
      const currentRatings = get().walkRatingCounts;
      const updatedRatings: WalkRatingCounts = {
        ...currentRatings,
        [rating]: currentRatings[rating] + 1,
      };
      const isLastStep = context.count > 0 && context.stepIndex >= context.count - 1;

      set((state) => {
        const nextLoci = state.loci.map((locus) => {
          if (locus.id !== context.locus?.id) return locus;
          return applySm2Schedule(locus, rating, ratedAt);
        });
        const routeNextReviewAt = orderedLoci(nextLoci.filter((locus) => locus.routeId === context.routeId))
          .map((locus) => locus.nextReviewAt)
          .filter((value): value is string => typeof value === "string" && value.length > 0)
          .sort()[0] ?? null;
        return {
          loci: nextLoci,
          walkStepEnteredAt: ratedAt,
          walkRevealedAt: revealedAt,
          walkRevealLatencyMs: revealLatencyMs,
          walkStepRated: true,
          walkRatingCounts: updatedRatings,
          walkOpen: isLastStep ? false : state.walkOpen,
          walkSessionId: isLastStep ? null : state.walkSessionId,
          walkSummary: isLastStep
            ? {
                sessionId: state.walkSessionId,
                routeId: context.routeId,
                routeName: context.routeName ?? "Route",
                reviewedCount: context.count,
                ratings: updatedRatings,
                completedAt: ratedAt,
                nextReviewAt: routeNextReviewAt,
              }
            : state.walkSummary,
        };
      });
      scheduleDraftSave();
      void recordAnalytics({
        eventType: "walk_recall_rated",
        eventGroup: "review",
        sessionId: get().walkSessionId,
        routeId: context.routeId,
        nodeId: context.nodeId,
        payload: {
          rating,
          ratingValue: RECALL_RATING_VALUES[rating],
          ratedAt,
          stepIndex: context.stepIndex,
          routeLength: context.count,
          locusId: context.locus?.id ?? null,
          routeName: context.routeName,
          nodeTitle: resolveNodeTitleForAnalytics(context.nodeId),
          timeToRevealMs,
          timeFromRevealToRatingMs,
        },
      });
      if (isLastStep) {
        void recordAnalytics({
          eventType: "walk_closed",
          eventGroup: "review",
          sessionId: get().walkSummary?.sessionId ?? null,
          routeId: context.routeId,
          nodeId: context.nodeId,
          payload: {
            source: "completed",
            stepIndex: context.stepIndex,
            routeLength: context.count,
            routeName: context.routeName,
            nodeTitle: resolveNodeTitleForAnalytics(context.nodeId),
          },
        });
        void recordAnalytics({
          eventType: "walk_completed",
          eventGroup: "review",
          sessionId: get().walkSummary?.sessionId ?? null,
          routeId: context.routeId,
          nodeId: context.nodeId,
          payload: {
            routeName: context.routeName,
            reviewedCount: context.count,
            ratings: updatedRatings,
            completedAt: ratedAt,
          },
        });
        return;
      }
      get().walkNext();
    },

    walkNext() {
      const { loci, routes, walkRouteId, walkIndex, walkRecallMode, walkStepRated } = get();
      if (walkRecallMode && !walkStepRated) return;
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      const nextIndex = nextWalkIndex(walkIndex, list.length);
      if (nextIndex === walkIndex) return;
      set({ walkIndex: nextIndex });
      noteWalkStepEntered("next");
    },

    walkPrev() {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      const nextIndex = prevWalkIndex(walkIndex, list.length);
      if (nextIndex === walkIndex) return;
      set({ walkIndex: nextIndex });
      noteWalkStepEntered("prev");
    },

    setWalkIndex(index) {
      const { loci, routes, walkRouteId, walkIndex, walkRecallMode, walkStepRated } = get();
      if (walkRecallMode && !walkStepRated) return;
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      const clamped = clampWalkIndex(index, list.length);
      if (clamped === walkIndex) return;
      set({ walkIndex: clamped });
      noteWalkStepEntered(clamped > walkIndex ? "next" : "prev");
    },

    currentWalkNodeId() {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return null;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      const loc = locusAtOrderedIndex(list, walkIndex);
      return loc?.nodeId ?? null;
    },

    hydrateFromSnapshot(s, options) {
      clearDraftTimer();
      const normalizedLoci = normalizeLoci(s.loci);
      set((state) => ({
        currentPalace: s.palace,
        palaces: mergePalaceIntoList(state.palaces, s.palace),
        nodes: s.nodes,
        edges: s.edges,
        routes: s.routes,
        loci: normalizedLoci,
        walkRouteId: s.routes[0]?.id ?? null,
        walkIndex: 0,
        walkOpen: false,
        walkSessionId: null,
        walkAnswerRevealed: !state.walkRecallMode,
        walkStepRated: false,
        walkRatingCounts: { ...EMPTY_WALK_RATINGS },
        walkSummary: null,
        walkStepEnteredAt: null,
        walkRevealedAt: null,
        walkRevealLatencyMs: null,
        selectedShapeId: null,
        routePanelOpen: false,
        persistenceState: options?.persistenceState ?? "clean",
        draftRestored: options?.draftRestored ?? false,
        lastDraftSavedAt: options?.lastDraftSavedAt ?? null,
        lastCheckpointSavedAt: null,
      }));
    },
  };
});
