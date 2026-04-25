import { create } from "zustand";
import type { Editor } from "@tldraw/editor";
import type { Locus, MemoryRoute, Palace, PalaceSnapshot } from "../domain/entities/types";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import {
  walkNext as nextWalkIndex,
  walkPrevious as prevWalkIndex,
  orderedLoci,
  locusAtOrderedIndex,
} from "../domain/services/walkService";

const repo = getPalaceRepository();

export type ToolMode = "select" | "connect" | "route";

type ConnectState = { fromShapeId: string | null };

export type PalaceStore = {
  palaces: Palace[];
  currentPalace: Palace | null;
  routes: MemoryRoute[];
  loci: Locus[];
  editorRef: Editor | null;
  selectedShapeId: string | null;
  toolMode: ToolMode;
  connect: ConnectState;
  walkOpen: boolean;
  walkRouteId: string | null;
  walkIndex: number;
  pendingCast: null | { fromShapeId: string; toShapeId: string; sourceNodeId: string; targetNodeId: string };
  loadPalaces: () => Promise<void>;
  openPalace: (id: string) => Promise<void>;
  createPalace: (name: string) => Promise<void>;
  saveCurrent: () => Promise<void>;
  setEditor: (e: Editor | null) => void;
  setSelectedShapeId: (id: string | null) => void;
  setToolMode: (m: ToolMode) => void;
  setConnectFrom: (id: string | null) => void;
  setPendingCast: (v: PalaceStore["pendingCast"]) => void;
  addRoute: (name: string) => void;
  addLocusForSelectedRoute: (nodeId: string, label?: string) => void;
  updateLocusLabel: (locusId: string, label: string) => void;
  setWalkRoute: (routeId: string | null) => void;
  setWalkOpen: (v: boolean) => void;
  walkNext: () => void;
  walkPrev: () => void;
  currentWalkNodeId: () => string | null;
  hydrateFromSnapshot: (s: PalaceSnapshot) => void;
};

export const usePalaceStore = create<PalaceStore>((set, get) => ({
  palaces: [],
  currentPalace: null,
  routes: [],
  loci: [],
  editorRef: null,
  selectedShapeId: null,
  toolMode: "select",
  connect: { fromShapeId: null },
  walkOpen: false,
  walkRouteId: null,
  walkIndex: 0,
  pendingCast: null,

  async loadPalaces() {
    const palaces = await repo.listPalaces();
    set({ palaces });
  },

  async openPalace(id: string) {
    const snap = await repo.loadPalace(id);
    if (!snap) return;
    get().hydrateFromSnapshot(snap);
  },

  async createPalace(name: string) {
    const p = await repo.createPalace(name.trim() || "Untitled palace");
    await get().loadPalaces();
    await get().openPalace(p.id);
  },

  async saveCurrent() {
    const { editorRef, currentPalace, routes, loci } = get();
    if (!editorRef || !currentPalace) return;
    const { buildPalaceSnapshot } = await import("../canvas/buildPalaceSnapshot");
    const snap = buildPalaceSnapshot(editorRef, currentPalace, routes, loci);
    await repo.savePalace(snap);
    set({ currentPalace: snap.palace });
    await get().loadPalaces();
  },

  setEditor: (editorRef) => set({ editorRef }),
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
  },

  updateLocusLabel(locusId: string, label: string) {
    const { loci } = get();
    set({
      loci: loci.map((l) => (l.id === locusId ? { ...l, label } : l)),
    });
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

  hydrateFromSnapshot(s) {
    set({
      currentPalace: s.palace,
      routes: s.routes,
      loci: s.loci,
      walkRouteId: s.routes[0]?.id ?? null,
      walkIndex: 0,
      walkOpen: false,
      selectedShapeId: null,
    });
  },
}));
