import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearPalaceDraft, loadPalaceDraft, savePalaceDraft } from "./palaceDraftStore";
import type { PalaceSnapshot } from "../../domain/entities/types";

function makeSnapshot(): PalaceSnapshot {
  return {
    palace: {
      id: "palace-1",
      name: "Draft Palace",
      createdAt: "2026-01-01T00:00:00.000Z",
      atlasPath: "Georgia/Tbilisi",
      editorSnapshot: "{\"store\":{}}",
    },
    canvasObjects: [],
    nodes: [
      {
        id: "node-1",
        objectId: "object-1",
        title: "Gateway",
        content: "Draft node",
        kind: "memory",
        portal: null,
      },
    ],
    edges: [],
    routes: [],
    loci: [],
  };
}

describe("palaceDraftStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and loads a palace draft", () => {
    const snapshot = makeSnapshot();
    const savedAt = savePalaceDraft(snapshot, "2026-04-26T01:02:03.000Z");
    const loaded = loadPalaceDraft(snapshot.palace.id);

    expect(savedAt).toBe("2026-04-26T01:02:03.000Z");
    expect(loaded?.palaceId).toBe(snapshot.palace.id);
    expect(loaded?.savedAt).toBe("2026-04-26T01:02:03.000Z");
    expect(loaded?.snapshot.nodes[0]?.title).toBe("Gateway");
  });

  it("clears a palace draft", () => {
    const snapshot = makeSnapshot();
    savePalaceDraft(snapshot, "2026-04-26T01:02:03.000Z");

    clearPalaceDraft(snapshot.palace.id);

    expect(loadPalaceDraft(snapshot.palace.id)).toBeNull();
  });

  it("does not throw when browser draft storage is full", () => {
    const snapshot = makeSnapshot();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded.", "QuotaExceededError");
    });

    try {
      expect(savePalaceDraft(snapshot, "2026-04-26T01:02:03.000Z")).toBeNull();
    } finally {
      setItem.mockRestore();
    }
  });
});
