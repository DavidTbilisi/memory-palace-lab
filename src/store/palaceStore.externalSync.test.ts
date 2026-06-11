/**
 * External (MCP) sync behavior: reloadCurrentPalaceFromDisk and the
 * externalChangePending conflict flag used by ExternalChangeBanner.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { usePalaceStore } from "./palaceStore";

describe("palaceStore external sync", () => {
  beforeEach(() => {
    // Functional localStorage stub: the real one is broken under Node 25 +
    // jsdom on this setup ("--localstorage-file" warning), and the draft store
    // needs working getItem/removeItem during openPalace/reload.
    const map = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => map.get(k) ?? null,
        setItem: (k: string, v: string) => void map.set(k, String(v)),
        removeItem: (k: string) => void map.delete(k),
        clear: () => map.clear(),
        key: (i: number) => [...map.keys()][i] ?? null,
        get length() {
          return map.size;
        },
      },
    });
    usePalaceStore.setState({
      currentPalace: null,
      nodes: [],
      edges: [],
      routes: [],
      loci: [],
      persistenceState: "clean",
      canvasReloadKey: 0,
      externalChangePending: null,
    });
  });

  it("setExternalChangePending sets and clears the conflict flag", () => {
    usePalaceStore.getState().setExternalChangePending({ palaceId: "p-1", op: "node_create" });
    expect(usePalaceStore.getState().externalChangePending).toEqual({
      palaceId: "p-1",
      op: "node_create",
    });
    usePalaceStore.getState().setExternalChangePending(null);
    expect(usePalaceStore.getState().externalChangePending).toBeNull();
  });

  it("reloadCurrentPalaceFromDisk is a no-op without an open palace", async () => {
    await usePalaceStore.getState().reloadCurrentPalaceFromDisk();
    expect(usePalaceStore.getState().canvasReloadKey).toBe(0);
  });

  it("reloadCurrentPalaceFromDisk rehydrates clean, bumps the canvas key, and clears the flag", async () => {
    await usePalaceStore.getState().createPalace("External Sync Test");
    const palace = usePalaceStore.getState().currentPalace;
    expect(palace).not.toBeNull();

    usePalaceStore.setState({
      persistenceState: "dirty",
      externalChangePending: { palaceId: palace!.id, op: "node_create" },
    });
    const keyBefore = usePalaceStore.getState().canvasReloadKey;

    await usePalaceStore.getState().reloadCurrentPalaceFromDisk();

    const s = usePalaceStore.getState();
    expect(s.currentPalace?.id).toBe(palace!.id);
    expect(s.persistenceState).toBe("clean");
    expect(s.canvasReloadKey).toBe(keyBefore + 1);
    expect(s.externalChangePending).toBeNull();
  });
});
