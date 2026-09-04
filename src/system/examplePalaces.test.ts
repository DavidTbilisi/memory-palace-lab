import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Editor } from "@tldraw/editor";

vi.mock("../canvas/createMemoryShapes", () => {
  let counter = 0;
  return {
    createGeoMemoryNode: vi.fn(() => {
      counter += 1;
      return { shapeId: `shape:${counter}`, nodeId: `node-${counter}` };
    }),
    createMemoryArrow: vi.fn(() => null),
  };
});

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: { getState: vi.fn() },
}));

import { createGeoMemoryNode, createMemoryArrow } from "../canvas/createMemoryShapes";
import { usePalaceStore } from "../store/palaceStore";
import { EXAMPLE_BLUEPRINTS, ensureExamplePalace, examplePalaceName, populateExamplePalace } from "./examplePalaces";

function fakeEditor(): Editor {
  return {
    getShape: vi.fn(() => ({ meta: {}, props: {} })),
    updateShape: vi.fn(),
  } as unknown as Editor;
}

describe("populateExamplePalace", () => {
  beforeEach(() => {
    vi.mocked(createGeoMemoryNode).mockClear();
    vi.mocked(createMemoryArrow).mockClear();
  });

  it.each(Object.keys(EXAMPLE_BLUEPRINTS) as Array<keyof typeof EXAMPLE_BLUEPRINTS>)(
    "draws every node and edge of %s and returns ordered loci",
    (id) => {
      const blueprint = EXAMPLE_BLUEPRINTS[id];
      const result = populateExamplePalace(fakeEditor(), "palace-1", id);

      expect(createGeoMemoryNode).toHaveBeenCalledTimes(blueprint.nodes.length);
      expect(createMemoryArrow).toHaveBeenCalledTimes(blueprint.edges.length);
      expect(result.createdNodeCount).toBe(blueprint.nodes.length);
      expect(result.route.name).toBe(blueprint.route.name);
      expect(result.route.palaceId).toBe("palace-1");
      expect(result.loci.map((locus) => locus.orderIndex)).toEqual(blueprint.route.loci.map((_, index) => index));
      expect(result.loci.map((locus) => locus.label)).toEqual(blueprint.route.loci.map((locus) => locus.label));
      expect(result.loci.every((locus) => locus.routeId === result.route.id)).toBe(true);
    },
  );

  it("passes CAST values and labels to each arrow", () => {
    populateExamplePalace(fakeEditor(), "p", "api-architecture");
    const firstCall = vi.mocked(createMemoryArrow).mock.calls[0];
    expect(firstCall?.[6]).toMatchObject({ label: "authenticates" });
    expect(typeof firstCall?.[6].ab).toBe("string");
  });
});

describe("ensureExamplePalace", () => {
  it("opens an existing example palace instead of creating another", async () => {
    const openPalace = vi.fn().mockResolvedValue(undefined);
    const createPalace = vi.fn();
    vi.mocked(usePalaceStore.getState).mockReturnValue({
      palaces: [{ id: "existing", name: examplePalaceName("talk-prep") }],
      openPalace,
      createPalace,
      editorRef: null,
      currentPalace: null,
    } as never);

    const result = await ensureExamplePalace("talk-prep");
    expect(result).toEqual({ palaceId: "existing", created: false });
    expect(openPalace).toHaveBeenCalledWith("existing");
    expect(createPalace).not.toHaveBeenCalled();
  });

  it("creates, waits for a fresh editor, draws, stores loci, and checkpoints", async () => {
    const previousEditor = fakeEditor();
    const freshEditor = fakeEditor();
    const replaceRoutesAndLoci = vi.fn();
    const saveCurrent = vi.fn().mockResolvedValue(undefined);
    const state = {
      palaces: [] as Array<{ id: string; name: string }>,
      openPalace: vi.fn(),
      createPalace: vi.fn(async (name: string) => {
        // Simulate the canvas remount landing a little later.
        setTimeout(() => {
          state.currentPalace = { id: "new", name };
          state.editorRef = freshEditor;
        }, 60);
      }),
      editorRef: previousEditor as Editor | null,
      currentPalace: null as { id: string; name: string } | null,
      replaceRoutesAndLoci,
      saveCurrent,
    };
    vi.mocked(usePalaceStore.getState).mockImplementation(() => state as never);

    const result = await ensureExamplePalace("exam-revision");
    expect(result).toEqual({ palaceId: "new", created: true });
    expect(replaceRoutesAndLoci).toHaveBeenCalledTimes(1);
    const [routes, loci] = replaceRoutesAndLoci.mock.calls[0] as [Array<{ name: string }>, Array<unknown>];
    expect(routes[0]?.name).toBe("Exam order");
    expect(loci).toHaveLength(4);
    expect(saveCurrent).toHaveBeenCalledTimes(1);
  });
});
