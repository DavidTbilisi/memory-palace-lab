import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadPalace = vi.fn();
vi.mock("../../infrastructure/palaceRepositoryProvider", () => ({
  getPalaceRepository: () => ({ loadPalace }),
}));
vi.mock("../../store/palaceStore", () => ({ usePalaceStore: vi.fn() }));

import { usePalaceStore } from "../../store/palaceStore";
import { invalidateDueQueueCache, useDueQueue } from "./useDueQueue";

const PAST = "2020-01-01T00:00:00.000Z";
const locus = (id: string, routeId: string, nodeId: string) =>
  ({ id, routeId, nodeId, orderIndex: 0, label: id, nextReviewAt: PAST, interval: 2, easeFactor: 2.5, repetitions: 1 }) as never;

let state: Record<string, unknown>;
function mockState(overrides: Record<string, unknown> = {}) {
  state = {
    palaces: [
      { id: "a", name: "Alpha", createdAt: PAST },
      { id: "b", name: "Beta", createdAt: PAST },
    ],
    currentPalace: { id: "a", name: "Alpha", createdAt: PAST },
    routes: [{ id: "ra", palaceId: "a", name: "RA" }],
    loci: [locus("la", "ra", "na")],
    nodes: [{ id: "na", title: "Alpha node" }],
    analyticsEvents: [],
    analyticsLoaded: true,
    loadAnalyticsEvents: vi.fn(),
    dailyReviewGoal: 10,
    persistenceState: "clean",
    ...overrides,
  };
  vi.mocked(usePalaceStore).mockImplementation(((selector: (s: unknown) => unknown) => selector(state)) as never);
}

describe("useDueQueue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateDueQueueCache();
    loadPalace.mockImplementation(async (id: string) => ({
      palace: { id, name: id === "b" ? "Beta" : "Other", createdAt: PAST },
      routes: [{ id: "rb", palaceId: id, name: "RB" }],
      loci: [locus("lb", "rb", "nb")],
      nodes: [],
      edges: [],
    }));
    mockState();
  });

  it("merges the live palace with cached snapshots of the others", async () => {
    const { result } = renderHook(() => useDueQueue());
    await waitFor(() => expect(result.current.dueCountAll).toBe(2));
    expect(loadPalace).toHaveBeenCalledTimes(1);
    expect(loadPalace).toHaveBeenCalledWith("b");
    expect(result.current.dueCountCurrent).toBe(1);
    expect(result.current.items.map((item) => item.palaceName).sort()).toEqual(["Alpha", "Beta"]);
  });

  it("does not refetch other palaces when the open palace's loci change", async () => {
    const { result, rerender } = renderHook(() => useDueQueue());
    await waitFor(() => expect(result.current.dueCountAll).toBe(2));
    act(() => {
      state.loci = [locus("la", "ra", "na"), locus("la2", "ra", "na")];
    });
    rerender();
    await waitFor(() => expect(result.current.dueCountAll).toBe(3));
    expect(loadPalace).toHaveBeenCalledTimes(1);
  });

  it("refetches after the cache is invalidated", async () => {
    const { result } = renderHook(() => useDueQueue());
    await waitFor(() => expect(result.current.dueCountAll).toBe(2));
    act(() => result.current.refresh());
    await waitFor(() => expect(loadPalace).toHaveBeenCalledTimes(2));
  });
});
