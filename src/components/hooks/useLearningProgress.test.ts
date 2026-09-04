import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../store/palaceStore", () => ({ usePalaceStore: vi.fn() }));

import { usePalaceStore } from "../../store/palaceStore";
import { useLearningProgress } from "./useLearningProgress";

function mockState(overrides: Record<string, unknown>) {
  const state = {
    palaces: [],
    currentPalace: null,
    routes: [],
    loci: [],
    editorRef: null,
    ...overrides,
  };
  vi.mocked(usePalaceStore).mockImplementation(((selector: (s: unknown) => unknown) => selector(state)) as never);
}

describe("useLearningProgress", () => {
  beforeEach(() => vi.clearAllMocks());

  it("reports nothing done on a fresh install", () => {
    mockState({});
    const { result } = renderHook(() => useLearningProgress());
    expect(result.current.checks.map((check) => check.ok)).toEqual([false, false, false, false, false]);
    expect(result.current.allDone).toBe(false);
  });

  it("counts nodes and edges from the canvas and completes the checklist", () => {
    const shapes = new Map([
      ["shape:1", { type: "geo", meta: { mpNodeId: "n1" } }],
      ["shape:2", { type: "geo", meta: { mpNodeId: "n2" } }],
      ["shape:3", { type: "arrow", meta: { mpEdgeId: "e1" } }],
      ["shape:4", { type: "geo", meta: {} }],
    ]);
    const editorRef = {
      getCurrentPageShapeIds: () => shapes.keys(),
      getShape: (id: string) => shapes.get(id),
      store: { listen: vi.fn(() => () => undefined) },
    };
    mockState({
      palaces: [{ id: "p" }],
      currentPalace: { id: "p" },
      routes: [{ id: "r" }],
      loci: [{ id: "l" }],
      editorRef,
    });
    const { result } = renderHook(() => useLearningProgress());
    expect(result.current.nodeCount).toBe(2);
    expect(result.current.edgeCount).toBe(1);
    expect(result.current.allDone).toBe(true);
    expect(editorRef.store.listen).toHaveBeenCalledTimes(1);
  });
});
