import { create } from "zustand";
import type { Editor } from "@tldraw/editor";
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
import { createAnalyticsEvent } from "../domain/services/analyticsService";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { clearPalaceDraft, loadPalaceDraft, savePalaceDraft } from "../infrastructure/draft/palaceDraftStore";
import {
  walkNext as nextWalkIndex,
  walkPrevious as prevWalkIndex,
  orderedLoci,
  locusAtOrderedIndex,
} from "../domain/services/walkService";

const repo = getPalaceRepository();
const DRAFT_SAVE_DELAY_MS = 900;

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

export type PalaceStore = {
  palaces: Palace[];
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
  connect: ConnectState;
  walkOpen: boolean;
  walkRouteId: string | null;
  walkIndex: number;
  walkStepEnteredAt: string | null;
  persistenceState: PalacePersistenceState;
  lastDraftSavedAt: string | null;
  draftRestored: boolean;
  pendingCast: null | { fromShapeId: string; toShapeId: string; sourceNodeId: string; targetNodeId: string };
  loadPalaces: () => Promise<void>;
  loadAnalyticsEvents: (limit?: number) => Promise<void>;
  recordAnalyticsEvent: (input: RecordAnalyticsInput) => Promise<AnalyticsEvent>;
  openPalace: (id: string) => Promise<void>;
  createPalace: (name: string, atlasPath?: string | null) => Promise<void>;
  saveCurrent: () => Promise<void>;
  queueDraftSave: () => void;
  flushDraftSave: () => Promise<void>;
  setCurrentPalaceMeta: (patch: Partial<Pick<Palace, "name" | "atlasPath">>) => void;
  setEditor: (e: Editor | null) => void;
  setSelectedShapeId: (id: string | null) => void;
  setToolMode: (m: ToolMode) => void;
  setConnectFrom: (id: string | null) => void;
  setPendingCast: (v: PalaceStore["pendingCast"]) => void;
  addRoute: (name: string) => void;
  addLocusForSelectedRoute: (nodeId: string, label?: string) => void;
  updateLocusLabel: (locusId: string, label: string) => void;
  replaceRoutesAndLoci: (routes: MemoryRoute[], loci: Locus[]) => void;
  setWalkRoute: (routeId: string | null) => void;
  setWalkOpen: (v: boolean) => void;
  rateWalkRecall: (rating: RecallRating) => void;
  walkNext: () => void;
  walkPrev: () => void;
  currentWalkNodeId: () => string | null;
  hydrateFromSnapshot: (
    s: PalaceSnapshot,
    options?: { persistenceState?: PalacePersistenceState; draftRestored?: boolean; lastDraftSavedAt?: string | null },
  ) => void;
};

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
    return buildPalaceSnapshot(editorRef, currentPalace, routes, loci);
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

  const noteWalkStepEntered = (direction: "open" | "next" | "prev" | "route_change") => {
    const enteredAt = new Date().toISOString();
    set({ walkStepEnteredAt: enteredAt });
    const context = getWalkContext();
    if (!context.routeId || !context.nodeId) return;
    void recordAnalytics({
      eventType: "walk_stepped",
      eventGroup: "review",
      palaceId: context.palaceId,
      routeId: context.routeId,
      nodeId: context.nodeId,
      payload: {
        direction,
        stepIndex: context.stepIndex,
        routeLength: context.count,
        locusId: context.locus?.id ?? null,
        routeName: context.routeName,
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
    connect: { fromShapeId: null },
    walkOpen: false,
    walkRouteId: null,
    walkIndex: 0,
    walkStepEnteredAt: null,
    persistenceState: "clean",
    lastDraftSavedAt: null,
    draftRestored: false,
    pendingCast: null,

    async loadPalaces() {
      const palaces = await repo.listPalaces();
      const currentPalace = get().currentPalace;
      set({
        palaces: currentPalace ? mergePalaceIntoList(palaces, currentPalace) : palaces,
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
      await repo.savePalace(snap);
      clearPalaceDraft(snap.palace.id);
      set((state) => ({
        currentPalace: snap.palace,
        palaces: mergePalaceIntoList(state.palaces, snap.palace),
        nodes: snap.nodes,
        edges: snap.edges,
        persistenceState: "clean",
        lastDraftSavedAt: null,
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
      const l: Locus = {
        id: crypto.randomUUID(),
        routeId,
        nodeId,
        orderIndex: max + 1,
        label,
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

    replaceRoutesAndLoci(routes, loci) {
      const { currentPalace, routes: prevRoutes, loci: prevLoci } = get();
      set({
        routes,
        loci,
        walkRouteId: routes[0]?.id ?? null,
        walkIndex: 0,
        walkOpen: false,
        walkStepEnteredAt: null,
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

      for (const locus of loci) {
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
      const wasOpen = get().walkOpen;
      set({ walkRouteId, walkIndex: 0 });
      if (!wasOpen || !walkRouteId) return;
      const context = getWalkContext();
      if (context.routeId) {
        void recordAnalytics({
          eventType: "walk_started",
          eventGroup: "review",
          routeId: context.routeId,
          nodeId: context.nodeId,
          payload: {
            source: "route_change",
            routeLength: context.count,
            routeName: context.routeName,
          },
        });
      }
      noteWalkStepEntered("route_change");
    },
    setWalkOpen(walkOpen) {
      const state = get();
      const wasOpen = state.walkOpen;
      const previousContext = getWalkContext();
      set({
        walkOpen,
        walkIndex: walkOpen && !wasOpen ? 0 : state.walkIndex,
        walkStepEnteredAt: walkOpen ? state.walkStepEnteredAt : null,
      });

      if (!walkOpen) {
        if (wasOpen && previousContext.routeId) {
          void recordAnalytics({
            eventType: "walk_closed",
            eventGroup: "review",
            routeId: previousContext.routeId,
            nodeId: previousContext.nodeId,
            payload: {
              stepIndex: previousContext.stepIndex,
              routeLength: previousContext.count,
              routeName: previousContext.routeName,
            },
          });
        }
        set({ walkStepEnteredAt: null });
        return;
      }

      if (!wasOpen) {
        const context = getWalkContext();
        if (context.routeId) {
          void recordAnalytics({
            eventType: "walk_started",
            eventGroup: "review",
            routeId: context.routeId,
            nodeId: context.nodeId,
            payload: {
              source: "toggle",
              routeLength: context.count,
              routeName: context.routeName,
            },
          });
        }
        noteWalkStepEntered("open");
      }
    },

    rateWalkRecall(rating) {
      const context = getWalkContext();
      if (!context.routeId || !context.nodeId) return;
      const enteredAt = get().walkStepEnteredAt;
      const now = Date.now();
      const timeToRevealMs = enteredAt ? Math.max(0, now - Date.parse(enteredAt)) : null;
      set({ walkStepEnteredAt: new Date(now).toISOString() });
      void recordAnalytics({
        eventType: "walk_recall_rated",
        eventGroup: "review",
        routeId: context.routeId,
        nodeId: context.nodeId,
        payload: {
          rating,
          stepIndex: context.stepIndex,
          routeLength: context.count,
          locusId: context.locus?.id ?? null,
          routeName: context.routeName,
          timeToRevealMs,
        },
      });
    },

    walkNext() {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      set({ walkIndex: nextWalkIndex(walkIndex, list.length) });
      noteWalkStepEntered("next");
    },

    walkPrev() {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      set({ walkIndex: prevWalkIndex(walkIndex, list.length) });
      noteWalkStepEntered("prev");
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
      set((state) => ({
        currentPalace: s.palace,
        palaces: mergePalaceIntoList(state.palaces, s.palace),
        nodes: s.nodes,
        edges: s.edges,
        routes: s.routes,
        loci: s.loci,
        walkRouteId: s.routes[0]?.id ?? null,
        walkIndex: 0,
        walkOpen: false,
        walkStepEnteredAt: null,
        selectedShapeId: null,
        persistenceState: options?.persistenceState ?? "clean",
        draftRestored: options?.draftRestored ?? false,
        lastDraftSavedAt: options?.lastDraftSavedAt ?? null,
      }));
    },
  };
});
