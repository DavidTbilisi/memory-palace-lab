import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

vi.mock("../store/palaceStore");
vi.mock("../infrastructure/palaceRepositoryProvider", () => ({
  getPalaceRepository: () => ({ loadPalace: vi.fn().mockResolvedValue(null) }),
}));

type StoreOverrides = Partial<Record<keyof PalaceStore, unknown>>;

function mockStore(overrides: StoreOverrides = {}) {
  const state: Record<string, unknown> = {
    currentPalace: null,
    analyticsEvents: [],
    analyticsLoaded: true,
    loadAnalyticsEvents: vi.fn(),
    loci: [],
    dailyReviewGoal: 20,
    setDailyReviewGoal: vi.fn(),
    nodes: [],
    edges: [],
    palaces: [],
    openPalace: vi.fn(),
    aarRecords: [],
    aarRecordsLoaded: true,
    loadAARRecords: vi.fn(),
    appendAARRecord: vi.fn(),
    deleteAARRecord: vi.fn(),
    focusedAARId: null,
    setFocusedAARId: vi.fn(),
    dismissedAssessByPalaceId: [],
    dismissAssessForPalace: vi.fn(),
    ...overrides,
  };
  vi.mocked(usePalaceStore).mockImplementation((selector) => selector(state as unknown as PalaceStore));
}

describe("AnalyticsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("renders all top-level dashboard sections", () => {
    render(<AnalyticsPanel />);
    expect(screen.getByText("Insights")).toBeInTheDocument();
    expect(screen.getByText(/Graph shape \(Step 0\)/)).toBeInTheDocument();
    expect(screen.queryByText("Review Settings")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Memory Strength Over Time")).toBeInTheDocument();
    expect(screen.getByText(/Review Consistency/)).toBeInTheDocument();
    expect(screen.getByText("What is tracked")).toBeInTheDocument();
    expect(screen.getByText("Recent events")).toBeInTheDocument();
  });

  it("shows empty states when there is no palace or activity", () => {
    render(<AnalyticsPanel />);
    expect(screen.getByText(/No nodes in this palace yet/)).toBeInTheDocument();
    expect(screen.getByText(/Review some loci to see your retention curve/)).toBeInTheDocument();
    expect(screen.getByText(/No analytics events yet/)).toBeInTheDocument();
  });

  it("renders the graph-shape analysis for a populated palace", () => {
    mockStore({
      currentPalace: { id: "p1", name: "Test Palace" },
      nodes: [
        { id: "h", title: "Hub" },
        { id: "s1", title: "Spoke 1" },
        { id: "s2", title: "Spoke 2" },
        { id: "s3", title: "Spoke 3" },
      ],
      edges: [
        { sourceNodeId: "h", targetNodeId: "s1" },
        { sourceNodeId: "h", targetNodeId: "s2" },
        { sourceNodeId: "h", targetNodeId: "s3" },
      ],
    });
    render(<AnalyticsPanel />);
    expect(screen.getByText(/4 nodes · 3 edges/)).toBeInTheDocument();
    expect(screen.getByLabelText("Detected motifs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Close \(AAR\)/ })).toBeInTheDocument();
  });
});
