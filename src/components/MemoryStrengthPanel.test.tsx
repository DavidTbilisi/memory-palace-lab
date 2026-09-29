import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsEvent, Locus } from "../domain/entities/types";
import { createAnalyticsEvent } from "../domain/services/analyticsService";
import type { DueQueueSnapshot } from "../domain/services/dueQueue";

vi.mock("../store/palaceStore", () => ({ usePalaceStore: vi.fn() }));
vi.mock("./hooks/useDueQueue", () => ({ useDueQueue: vi.fn() }));
vi.mock("../app/reviewNavigation", () => ({ startReviewAt: vi.fn(async () => undefined) }));
vi.mock("../app/navigationEvents", () => ({ requestNavigation: vi.fn() }));

import { requestNavigation } from "../app/navigationEvents";
import { startReviewAt } from "../app/reviewNavigation";
import { usePalaceStore } from "../store/palaceStore";
import { useDueQueue } from "./hooks/useDueQueue";
import { MemoryStrengthPanel } from "./MemoryStrengthPanel";

const DAY_MS = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString();

const locus = (id: string, nodeId: string, orderIndex: number, nextReviewAt: string): Locus => ({
  id,
  routeId: "r1",
  nodeId,
  orderIndex,
  label: `Stop ${orderIndex + 1}`,
  interval: 1,
  easeFactor: 2.5,
  repetitions: 1,
  nextReviewAt,
  lastReviewedAt: ago(8),
});

const snapshots: DueQueueSnapshot[] = [
  {
    palace: { id: "p1", name: "Concurrency", createdAt: ago(30) },
    routes: [{ id: "r1", palaceId: "p1", name: "Locks" }],
    nodes: [
      { id: "n-mutex", objectId: "o1", title: "Mutex", content: "", kind: "memory", portal: null },
      { id: "n-sem", objectId: "o2", title: "Semaphore", content: "", kind: "memory", portal: null },
    ],
    loci: [locus("l-mutex", "n-mutex", 0, ago(3)), locus("l-sem", "n-sem", 1, new Date(Date.now() + 5 * DAY_MS).toISOString())],
  },
  {
    palace: { id: "p2", name: "Empty", createdAt: ago(30) },
    routes: [],
    nodes: [],
    loci: [],
  },
];

const rating = (nodeId: string, locusId: string, daysAgo: number, value: string, phase?: string): AnalyticsEvent =>
  createAnalyticsEvent({
    eventType: "walk_recall_rated",
    eventGroup: "review",
    sessionId: `s-${daysAgo}`,
    palaceId: "p1",
    routeId: "r1",
    nodeId,
    createdAt: ago(daysAgo),
    payload: { rating: value, locusId, timeToRevealMs: 15_000, ...(phase ? { phase } : {}) },
  });

function mockStore(analyticsEvents: AnalyticsEvent[]) {
  const state = {
    analyticsEvents,
    analyticsLoaded: true,
    loadAnalyticsEvents: vi.fn(),
    currentPalace: { id: "p1", name: "Concurrency" },
    openPalace: vi.fn(async () => undefined),
    setFocusNodeId: vi.fn(),
  };
  vi.mocked(usePalaceStore).mockImplementation(((selector: (s: unknown) => unknown) => selector(state)) as never);
  return state;
}

describe("MemoryStrengthPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDueQueue).mockReturnValue({ snapshots } as never);
  });

  it("ranks the weak stop first, flags the fragile route, shows the trend, and starts reviews", async () => {
    // Earlier days recalled well, recent days failed: decaying. A Storm "easy" today changes nothing.
    mockStore([
      rating("n-sem", "l-sem", 6, "easy"),
      rating("n-sem", "l-sem", 5, "easy"),
      rating("n-sem", "l-sem", 4, "good"),
      rating("n-mutex", "l-mutex", 2, "again"),
      rating("n-mutex", "l-mutex", 1, "again"),
      rating("n-mutex", "l-mutex", 0, "hard"),
      rating("n-mutex", "l-mutex", 0, "easy", "storm"),
    ]);
    const user = userEvent.setup();
    render(<MemoryStrengthPanel />);

    expect(screen.queryByTestId("strength-no-history")).not.toBeInTheDocument();
    const attention = screen.getByRole("region", { name: "Needs attention" });
    const stops = within(attention).getAllByTestId("strength-stop");
    expect(stops[0]).toHaveTextContent("Critical");
    expect(stops[0]).toHaveTextContent("Mutex");
    expect(stops[0]).toHaveTextContent("Overdue");
    expect(stops[0]).toHaveTextContent("last: hard");
    expect(stops[1]).toHaveTextContent("Semaphore");

    const health = screen.getByRole("region", { name: "Palace health" });
    const palaces = within(health).getAllByTestId("strength-palace");
    expect(palaces.map((row) => row.textContent)).toEqual([
      expect.stringContaining("hotspot: Mutex"),
      expect.stringContaining("Empty"),
    ]);

    expect(screen.getByTestId("strength-trend-verdict")).toHaveTextContent("Decaying");
    expect(screen.getByRole("region", { name: "Trend" })).toHaveTextContent(/Recent days \d+ vs earlier \d+ \(-\d+\)/);

    const route = within(screen.getByRole("region", { name: "Route friction" })).getByTestId("strength-route");
    expect(route).toHaveTextContent("Cognitively expensive");
    expect(route).toHaveTextContent("Locks");
    expect(route).toHaveTextContent("slow to recall: 15.0 s before reveal");

    await user.click(stops[0]!);
    expect(startReviewAt).toHaveBeenCalledWith({ palaceId: "p1", routeId: "r1", locusId: "l-mutex", nodeId: "n-mutex", slot: null });
    await user.click(route);
    expect(startReviewAt).toHaveBeenLastCalledWith({ palaceId: "p1", routeId: "r1" });
  });

  it("opens another palace from its health row", async () => {
    const state = mockStore([]);
    const user = userEvent.setup();
    render(<MemoryStrengthPanel />);
    const empty = within(screen.getByRole("region", { name: "Palace health" }))
      .getAllByTestId("strength-palace")
      .find((row) => row.textContent?.includes("Empty"))!;
    await user.click(empty);
    expect(state.openPalace).toHaveBeenCalledWith("p2");
    expect(requestNavigation).toHaveBeenCalledWith("graph");
  });

  it("shows empty states without review history", () => {
    mockStore([rating("n-mutex", "l-mutex", 0, "good", "storm")]);
    vi.mocked(useDueQueue).mockReturnValue({ snapshots: [] } as never);
    render(<MemoryStrengthPanel />);
    expect(screen.getByTestId("strength-no-history")).toHaveTextContent("No review history yet");
    expect(screen.getByRole("region", { name: "Needs attention" })).toHaveTextContent("No stops in review yet");
    expect(screen.getByRole("region", { name: "Palace health" })).toHaveTextContent("No palaces yet.");
    expect(screen.getByTestId("strength-trend-verdict")).toHaveTextContent("Not enough data");
    expect(screen.getByRole("region", { name: "Trend" })).toHaveTextContent("No reviews in this window yet.");
    expect(screen.getByRole("region", { name: "Route friction" })).toHaveTextContent("No rated walks yet.");
    expect(screen.getByRole("region", { name: "Confusion hotspots" })).toHaveTextContent("No mix-ups logged yet.");
  });

  const mixedUp = (nodeId: string, other: string, daysAgo: number): AnalyticsEvent =>
    createAnalyticsEvent({
      eventType: "recall_miss_explained",
      eventGroup: "review",
      palaceId: "p1",
      routeId: "r1",
      nodeId,
      createdAt: ago(daysAgo),
      payload: { cause: "confusion", confusedWithNodeId: other },
    });

  it("lists a mixed-up pair and starts at the Distinguisher of the node that has one", async () => {
    const withD: DueQueueSnapshot = {
      ...snapshots[0]!,
      nodes: snapshots[0]!.nodes.map((node) =>
        node.id === "n-sem" ? { ...node, nedf: { distinguisher: { prompt: "Many keys?", reason: "it counts" } } } : node,
      ),
    };
    vi.mocked(useDueQueue).mockReturnValue({ snapshots: [withD] } as never);
    mockStore([mixedUp("n-mutex", "n-sem", 2), mixedUp("n-mutex", "n-sem", 1)]);
    const user = userEvent.setup();
    render(<MemoryStrengthPanel />);
    const row = within(screen.getByRole("region", { name: "Confusion hotspots" })).getByTestId("strength-confusion");
    expect(row).toHaveTextContent("Mutex ↔ Semaphore");
    expect(row).toHaveTextContent("Not linked");
    expect(row).toHaveTextContent("2 mix-ups");
    expect(row).toHaveTextContent("no Distinguisher: Mutex");
    await user.click(row);
    expect(startReviewAt).toHaveBeenCalledWith({
      palaceId: "p1",
      routeId: "r1",
      locusId: "l-sem",
      nodeId: "n-sem",
      slot: "distinguisher",
    });
  });

  it("opens the palace on the node when neither has a Distinguisher", async () => {
    const state = mockStore([mixedUp("n-sem", "n-mutex", 1)]);
    const user = userEvent.setup();
    render(<MemoryStrengthPanel />);
    await user.click(within(screen.getByRole("region", { name: "Confusion hotspots" })).getByTestId("strength-confusion"));
    expect(startReviewAt).not.toHaveBeenCalled();
    expect(state.openPalace).not.toHaveBeenCalled();
    expect(state.setFocusNodeId).toHaveBeenCalledWith("n-sem");
    expect(requestNavigation).toHaveBeenCalledWith("graph");
  });
});
