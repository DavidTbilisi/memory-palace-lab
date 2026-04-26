import { create } from "zustand";
import type { Editor } from "@tldraw/editor";
import type { Locus, MemoryEdge, MemoryNode, MemoryRoute, Palace, PalaceSnapshot } from "../domain/entities/types";
import { buildPalaceSnapshot } from "../canvas/buildPalaceSnapshot";
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

export type PalaceStore = {
  palaces: Palace[];
  currentPalace: Palace | null;
  nodes: MemoryNode[];
  edges: MemoryEdge[];
  routes: MemoryRoute[];
  loci: Locus[];
  editorRef: Editor | null;
  selectedShapeId: string | null;
  toolMode: ToolMode;
  connect: ConnectState;
  walkOpen: boolean;
  walkRouteId: string | null;
  walkIndex: number;
  persistenceState: PalacePersistenceState;
  lastDraftSavedAt: string | null;
  draftRestored: boolean;
  pendingCast: null | { fromShapeId: string; toShapeId: string; sourceNodeId: string; targetNodeId: string };
  loadPalaces: () => Promise<void>;
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

  const buildCurrentSnapshot = () => {
    const { editorRef, currentPalace, routes, loci } = get();
    if (!editorRef || !currentPalace) return null;
    return buildPalaceSnapshot(editorRef, currentPalace, routes, loci);
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
    editorRef: null,
    selectedShapeId: null,
    toolMode: "select",
    connect: { fromShapeId: null },
    walkOpen: false,
    walkRouteId: null,
    walkIndex: 0,
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

    async openPalace(id: string) {
      await get().flushDraftSave();
      clearDraftTimer();
      const snap = await repo.loadPalace(id);
      if (!snap) return;
      const draft = loadPalaceDraft(id);
      if (draft) {
        get().hydrateFromSnapshot(draft.snapshot, {
          persistenceState: "draft",
          draftRestored: true,
          lastDraftSavedAt: draft.savedAt,
        });
        return;
      }
      get().hydrateFromSnapshot(snap, {
        persistenceState: "clean",
        draftRestored: false,
        lastDraftSavedAt: null,
      });
    },

    async createPalace(name: string, atlasPath?: string | null) {
      await get().flushDraftSave();
      clearDraftTimer();
      const p = await repo.createPalace(name.trim() || "Untitled palace", atlasPath?.trim() || null);
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
    },

    updateLocusLabel(locusId: string, label: string) {
      const { loci } = get();
      set({
        loci: loci.map((l) => (l.id === locusId ? { ...l, label } : l)),
      });
      scheduleDraftSave();
    },

    replaceRoutesAndLoci(routes, loci) {
      set({
        routes,
        loci,
        walkRouteId: routes[0]?.id ?? null,
        walkIndex: 0,
        walkOpen: false,
      });
      scheduleDraftSave();
    },

    setWalkRoute: (walkRouteId) => set({ walkRouteId, walkIndex: 0 }),
    setWalkOpen: (walkOpen) => set({ walkOpen }),

    walkNext() {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      set({ walkIndex: nextWalkIndex(walkIndex, list.length) });
    },

    walkPrev() {
      const { loci, routes, walkRouteId, walkIndex } = get();
      const effectiveRouteId = walkRouteId ?? routes[0]?.id ?? null;
      if (!effectiveRouteId) return;
      const list = orderedLoci(loci.filter((l) => l.routeId === effectiveRouteId));
      set({ walkIndex: prevWalkIndex(walkIndex, list.length) });
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
        selectedShapeId: null,
        persistenceState: options?.persistenceState ?? "clean",
        draftRestored: options?.draftRestored ?? false,
        lastDraftSavedAt: options?.lastDraftSavedAt ?? null,
      }));
    },
  };
});
