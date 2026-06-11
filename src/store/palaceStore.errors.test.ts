/**
 * Persistence failures must surface via lastError (AppErrorBanner) instead of
 * dying as unhandled rejections, and a failed save must not be marked clean.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Editor } from "@tldraw/editor";

vi.mock("../infrastructure/palaceRepositoryProvider", () => ({
  getPalaceRepository: () => ({
    listPalaces: async () => [],
    listTrashedPalaces: async () => [],
    createPalace: async () => {
      throw new Error("disk full");
    },
    loadPalace: async () => {
      throw new Error("db locked");
    },
    savePalace: async () => {
      throw new Error("disk full");
    },
    softDeletePalace: async () => {},
    restorePalace: async () => {},
    purgePalace: async () => {},
    listAnalyticsEvents: async () => [],
    appendAnalyticsEvents: async () => {},
    exportJson: async () => "",
    importJson: async () => {
      throw new Error("nope");
    },
  }),
}));

import { usePalaceStore } from "./palaceStore";

const PALACE = {
  id: "p-1",
  name: "Fragile Palace",
  createdAt: "2026-06-11T00:00:00.000Z",
  alias: null,
  atlasPath: null,
  editorSnapshot: null,
};

function fakeEditor(): Editor {
  return {
    getSnapshot: () => ({ store: {}, schema: {} }),
    getCurrentPageShapeIds: () => new Set<string>(),
    getShape: () => undefined,
    getShapePageBounds: () => null,
  } as unknown as Editor;
}

describe("palaceStore persistence error surfacing", () => {
  beforeEach(() => {
    usePalaceStore.setState({
      currentPalace: null,
      editorRef: null,
      nodes: [],
      edges: [],
      routes: [],
      loci: [],
      persistenceState: "clean",
      lastError: null,
    });
  });

  it("openPalace failure sets lastError and leaves state untouched", async () => {
    await usePalaceStore.getState().openPalace("missing-id");
    const s = usePalaceStore.getState();
    expect(s.lastError?.message).toMatch(/Opening palace failed: db locked/);
    expect(s.currentPalace).toBeNull();
  });

  it("createPalace failure sets lastError", async () => {
    await usePalaceStore.getState().createPalace("New One");
    expect(usePalaceStore.getState().lastError?.message).toMatch(
      /Creating palace "New One" failed: disk full/,
    );
  });

  it("saveCurrent failure sets lastError and does NOT mark the palace clean", async () => {
    usePalaceStore.setState({
      currentPalace: PALACE,
      editorRef: fakeEditor(),
      persistenceState: "dirty",
    });
    await usePalaceStore.getState().saveCurrent();
    const s = usePalaceStore.getState();
    expect(s.lastError?.message).toMatch(/Saving palace "Fragile Palace" failed: disk full/);
    expect(s.persistenceState).toBe("dirty");
    expect(s.lastCheckpointSavedAt).toBeNull();
  });

  it("setLastError(null) dismisses the banner state", () => {
    usePalaceStore.getState().setLastError("boom");
    expect(usePalaceStore.getState().lastError?.message).toBe("boom");
    usePalaceStore.getState().setLastError(null);
    expect(usePalaceStore.getState().lastError).toBeNull();
  });
});
