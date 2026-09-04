import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../store/palaceStore", () => ({ usePalaceStore: vi.fn() }));
vi.mock("./hooks/useDueQueue", () => ({ useDueQueue: vi.fn() }));
vi.mock("../app/reviewNavigation", () => ({ startReviewAt: vi.fn(async () => undefined) }));

import { startReviewAt } from "../app/reviewNavigation";
import { usePalaceStore } from "../store/palaceStore";
import { useDueQueue } from "./hooks/useDueQueue";
import { SessionSummaryModal } from "./SessionSummaryModal";

const dismissWalkSummary = vi.fn();

function mockStore() {
  const state = {
    walkSummary: {
      routeName: "Route A",
      routeId: "ra",
      reviewedCount: 3,
      ratings: { again: 0, hard: 1, good: 1, easy: 1 },
      nextReviewAt: null,
    },
    dismissWalkSummary,
    analyticsEvents: [],
    dailyReviewGoal: 10,
  };
  vi.mocked(usePalaceStore).mockImplementation(((selector: (s: unknown) => unknown) => selector(state)) as never);
}

describe("SessionSummaryModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("chains straight into the next due locus from another route", async () => {
    const user = userEvent.setup();
    vi.mocked(useDueQueue).mockReturnValue({
      items: [
        { palaceId: "p", routeId: "ra", locusId: "l1", nodeId: "n1" },
        { palaceId: "q", routeId: "rb", locusId: "l2", nodeId: "n2" },
      ],
    } as never);
    const onReviewAnother = vi.fn();
    render(<SessionSummaryModal onReviewAnother={onReviewAnother} onBackToPalace={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Review next due" }));
    expect(dismissWalkSummary).toHaveBeenCalled();
    expect(startReviewAt).toHaveBeenCalledWith({ palaceId: "q", routeId: "rb", locusId: "l2", nodeId: "n2" });
    expect(onReviewAnother).not.toHaveBeenCalled();
  });

  it("falls back to the Review page when nothing is due", async () => {
    const user = userEvent.setup();
    vi.mocked(useDueQueue).mockReturnValue({ items: [] } as never);
    const onReviewAnother = vi.fn();
    render(<SessionSummaryModal onReviewAnother={onReviewAnother} onBackToPalace={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Review another route" }));
    expect(onReviewAnother).toHaveBeenCalledTimes(1);
    expect(startReviewAt).not.toHaveBeenCalled();
  });
});
