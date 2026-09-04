import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../store/palaceStore", () => ({ usePalaceStore: vi.fn() }));
vi.mock("./hooks/useDueQueue", () => ({ useDueQueue: vi.fn() }));
vi.mock("../app/reviewNavigation", () => ({ startReviewAt: vi.fn(async () => undefined) }));
vi.mock("../app/navigationEvents", () => ({ requestNavigation: vi.fn() }));

import { requestNavigation } from "../app/navigationEvents";
import { startReviewAt } from "../app/reviewNavigation";
import { usePalaceStore } from "../store/palaceStore";
import { useDueQueue } from "./hooks/useDueQueue";
import { NextUpCard, describeDue } from "./NextUpCard";

const item = {
  palaceId: "b",
  palaceName: "Beta",
  routeId: "r",
  routeName: "Route B",
  nodeId: "n",
  locusId: "l",
  locusLabel: "Locus one",
  nodeTitle: "Node",
  nextReviewAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
};

function mockStore(overrides: Record<string, unknown> = {}) {
  const state = { walkOpen: false, appMode: "encode", currentPalace: { id: "a", name: "Alpha" }, ...overrides };
  vi.mocked(usePalaceStore).mockImplementation(((selector: (s: unknown) => unknown) => selector(state)) as never);
}

describe("NextUpCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    mockStore();
    vi.mocked(useDueQueue).mockReturnValue({ items: [item, item], dueCountAll: 2 } as never);
  });

  it("shows the next due locus with its palace and starts the review", async () => {
    const user = userEvent.setup();
    render(<NextUpCard />);
    const card = screen.getByTestId("next-up-card");
    expect(card).toHaveTextContent("Route B");
    expect(card).toHaveTextContent("Beta");
    expect(card).toHaveTextContent("overdue 3 days");
    expect(card).toHaveTextContent("1 more due");
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(startReviewAt).toHaveBeenCalledWith({ palaceId: "b", routeId: "r", locusId: "l", nodeId: "n" });
    await user.click(screen.getByRole("button", { name: "See all" }));
    expect(requestNavigation).toHaveBeenCalledWith("review");
  });

  it("hides when nothing is due, during a walk, in comprehend mode, or after dismissal", async () => {
    vi.mocked(useDueQueue).mockReturnValue({ items: [], dueCountAll: 0 } as never);
    const { unmount } = render(<NextUpCard />);
    expect(screen.queryByTestId("next-up-card")).not.toBeInTheDocument();
    unmount();

    vi.mocked(useDueQueue).mockReturnValue({ items: [item], dueCountAll: 1 } as never);
    mockStore({ walkOpen: true });
    const walk = render(<NextUpCard />);
    expect(screen.queryByTestId("next-up-card")).not.toBeInTheDocument();
    walk.unmount();

    mockStore({ appMode: "comprehend" });
    const comprehend = render(<NextUpCard />);
    expect(screen.queryByTestId("next-up-card")).not.toBeInTheDocument();
    comprehend.unmount();

    mockStore();
    const user = userEvent.setup();
    render(<NextUpCard />);
    await user.click(screen.getByRole("button", { name: "Hide next up for this session" }));
    expect(screen.queryByTestId("next-up-card")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem("mp-next-up-dismissed")).toBe("true");
  });

  it("describes due timing", () => {
    const now = Date.parse("2026-09-03T12:00:00.000Z");
    expect(describeDue("2026-09-03T11:00:00.000Z", now)).toBe("due now");
    expect(describeDue("2026-09-02T11:00:00.000Z", now)).toBe("overdue 1 day");
  });
});
