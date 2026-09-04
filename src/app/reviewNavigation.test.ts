import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: { getState: vi.fn(), setState: vi.fn() },
}));
vi.mock("./navigationEvents", () => ({ requestNavigation: vi.fn() }));

import { usePalaceStore } from "../store/palaceStore";
import { requestNavigation } from "./navigationEvents";
import { startReviewAt } from "./reviewNavigation";

function mockStore(currentPalaceId: string | null) {
  const state = {
    currentPalace: currentPalaceId ? { id: currentPalaceId, name: "P" } : null,
    loci: [] as Array<{ id: string; routeId: string; nodeId: string; orderIndex: number }>,
    openPalace: vi.fn(async (id: string) => {
      state.currentPalace = { id, name: "P" };
      state.loci = [
        { id: "l2", routeId: "r1", nodeId: "n2", orderIndex: 1 },
        { id: "l1", routeId: "r1", nodeId: "n1", orderIndex: 0 },
      ];
    }),
    setWalkRoute: vi.fn(),
    setWalkRecallMode: vi.fn(),
    setWalkCueOnly: vi.fn(),
    setWalkOpen: vi.fn(),
  };
  vi.mocked(usePalaceStore.getState).mockImplementation(() => state as never);
  return state;
}

describe("startReviewAt", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens the other palace, arms walk mode, jumps to the locus, and lands on the graph", async () => {
    const state = mockStore("other");
    await startReviewAt({ palaceId: "target", routeId: "r1", locusId: "l2" });
    expect(state.openPalace).toHaveBeenCalledWith("target");
    expect(state.setWalkRoute).toHaveBeenCalledWith("r1");
    expect(state.setWalkRecallMode).toHaveBeenCalledWith(true);
    expect(state.setWalkCueOnly).toHaveBeenCalledWith(true);
    expect(state.setWalkOpen).toHaveBeenCalledWith(true);
    expect(usePalaceStore.setState).toHaveBeenCalledWith({ walkIndex: 1 });
    expect(requestNavigation).toHaveBeenCalledWith("graph");
  });

  it("skips opening when the palace is already current and falls back to the first locus", async () => {
    const state = mockStore("target");
    state.loci = [{ id: "l1", routeId: "r1", nodeId: "n1", orderIndex: 0 }];
    await startReviewAt({ palaceId: "target", routeId: "r1" });
    expect(state.openPalace).not.toHaveBeenCalled();
    expect(usePalaceStore.setState).not.toHaveBeenCalled();
    expect(requestNavigation).toHaveBeenCalledWith("graph");
  });
});
