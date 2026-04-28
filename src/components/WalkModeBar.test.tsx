import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { WalkModeBar } from "./WalkModeBar";

// ---------- store mock ----------

const mockFns = {
  setWalkOpen: vi.fn(),
  setWalkRecallMode: vi.fn(),
  setWalkCueOnly: vi.fn(),
  revealWalkAnswer: vi.fn(),
  rateWalkRecall: vi.fn(),
  walkNext: vi.fn(),
  walkPrev: vi.fn(),
  setWalkIndex: vi.fn(),
};

const BASE_LOCUS = {
  id: "locus-1",
  objectId: "obj-1",
  routeId: "route-1",
  nodeId: "node-1",
  label: "Living Room",
  orderIndex: 0,
  easeFactor: 2.5,
  intervalDays: 1,
  nextReviewAt: null,
  lastReviewAt: null,
  lapseCount: 0,
};

const BASE_NODE = {
  id: "node-1",
  objectId: "obj-node-1",
  title: "Mitochondria",
  content: "Powerhouse of the cell",
  kind: "memory" as const,
  portal: null,
};

let mockState: Record<string, unknown> = {};

const { usePalaceStoreMock } = vi.hoisted(() => ({
  usePalaceStoreMock: vi.fn((selector: (s: Record<string, unknown>) => unknown) => selector(mockState)),
}));

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: usePalaceStoreMock,
}));

vi.mock("../canvas/readShapeText", () => ({
  resolveMemoryNodeTitle: vi.fn((shape: { meta?: { mpTitle?: string } }) => shape?.meta?.mpTitle ?? ""),
}));

function buildState(overrides: Record<string, unknown> = {}) {
  return {
    walkOpen: false,
    setWalkOpen: mockFns.setWalkOpen,
    walkRecallMode: false,
    setWalkRecallMode: mockFns.setWalkRecallMode,
    walkCueOnly: false,
    setWalkCueOnly: mockFns.setWalkCueOnly,
    walkAnswerRevealed: false,
    walkStepRated: false,
    revealWalkAnswer: mockFns.revealWalkAnswer,
    rateWalkRecall: mockFns.rateWalkRecall,
    walkNext: mockFns.walkNext,
    walkPrev: mockFns.walkPrev,
    setWalkIndex: mockFns.setWalkIndex,
    routes: [{ id: "route-1", name: "Biology Route", palaceId: "palace-1", orderIndex: 0, objectId: "r-obj" }],
    walkRouteId: "route-1",
    loci: [BASE_LOCUS, { ...BASE_LOCUS, id: "locus-2", objectId: "obj-2", nodeId: "node-2", label: "Kitchen", orderIndex: 1 }],
    walkIndex: 0,
    editorRef: null,
    nodes: [BASE_NODE, { ...BASE_NODE, id: "node-2", objectId: "obj-node-2", title: "Nucleus", content: "Control center" }],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockState = buildState();
  usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
});

// ---------- tests ----------

describe("WalkModeBar — idle state", () => {
  it("shows Walk off label when walkOpen is false", () => {
    render(<WalkModeBar />);
    expect(screen.getByText(/walk off/i)).toBeInTheDocument();
  });

  it("does not render walk controls when walkOpen is false", () => {
    render(<WalkModeBar />);
    expect(screen.queryByText(/recall-first/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /reveal answer/i })).toBeNull();
  });

  it("calls setWalkOpen(true) when Walk off button is clicked", () => {
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /toggle walk mode/i }));
    expect(mockFns.setWalkOpen).toHaveBeenCalledWith(true);
  });
});

describe("WalkModeBar — walk active", () => {
  beforeEach(() => {
    mockState = buildState({ walkOpen: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
  });

  it("shows Walk on label when walkOpen is true", () => {
    render(<WalkModeBar />);
    expect(screen.getByText(/walk on/i)).toBeInTheDocument();
  });

  it("calls setWalkOpen(false) when Walk on button is clicked", () => {
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /toggle walk mode/i }));
    expect(mockFns.setWalkOpen).toHaveBeenCalledWith(false);
  });

  it("shows route name", () => {
    render(<WalkModeBar />);
    expect(screen.getByText("Biology Route")).toBeInTheDocument();
  });

  it("shows step counter", () => {
    render(<WalkModeBar />);
    expect(screen.getByText("Step 1/2")).toBeInTheDocument();
  });

  it("shows locus label as cue when walkCueOnly is false", () => {
    render(<WalkModeBar />);
    expect(screen.getByText("Living Room")).toBeInTheDocument();
  });

  it("shows answer when not in recall mode", () => {
    render(<WalkModeBar />);
    expect(screen.getByText(/powerhouse of the cell/i)).toBeInTheDocument();
  });

  it("shows all four rating buttons", () => {
    render(<WalkModeBar />);
    expect(screen.getByText(/again/i)).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
    expect(screen.getByText(/good/i)).toBeInTheDocument();
    expect(screen.getByText(/easy/i)).toBeInTheDocument();
  });

  it("calls rateWalkRecall with correct rating on button click", () => {
    render(<WalkModeBar />);
    fireEvent.click(screen.getByText(/1 again/i));
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("again");

    fireEvent.click(screen.getByText(/2 hard/i));
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("hard");

    fireEvent.click(screen.getByText(/3 good/i));
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("good");

    fireEvent.click(screen.getByText(/4 easy/i));
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("easy");
  });

  it("Recall-first button toggles walkRecallMode", () => {
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /recall-first/i }));
    expect(mockFns.setWalkRecallMode).toHaveBeenCalledWith(true);
  });

  it("Cue only button is disabled when recall mode is off", () => {
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /cue only/i })).toBeDisabled();
  });

  it("prev button is disabled at first step", () => {
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /previous step/i })).toBeDisabled();
  });

  it("next button is enabled when not at last step", () => {
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /next step/i })).not.toBeDisabled();
  });

  it("next button is disabled at last step", () => {
    mockState = buildState({ walkOpen: true, walkIndex: 1 });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /next step/i })).toBeDisabled();
  });

  it("calls walkNext when next button clicked", () => {
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /next step/i }));
    expect(mockFns.walkNext).toHaveBeenCalled();
  });

  it("calls walkPrev when prev button clicked (when not at start)", () => {
    mockState = buildState({ walkOpen: true, walkIndex: 1 });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /previous step/i }));
    expect(mockFns.walkPrev).toHaveBeenCalled();
  });
});

describe("WalkModeBar — recall mode", () => {
  beforeEach(() => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
  });

  it("shows Reveal button instead of rating buttons when answer not revealed", () => {
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /reveal/i })).toBeInTheDocument();
    expect(screen.queryByText(/1 again/i)).toBeNull();
  });

  it("calls revealWalkAnswer when Reveal is clicked", () => {
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /reveal/i }));
    expect(mockFns.revealWalkAnswer).toHaveBeenCalled();
  });

  it("shows rating buttons after answer is revealed", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.getByText(/1 again/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reveal/i })).toBeNull();
  });

  it("next button is disabled when waiting for rating in recall mode", () => {
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /next step/i })).toBeDisabled();
  });

  it("Cue only button is enabled in recall mode", () => {
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /cue only/i })).not.toBeDisabled();
  });
});

describe("WalkModeBar — cue only mode", () => {
  it("shows node title as cue and content as answer when walkCueOnly is true", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkCueOnly: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.getByText("Mitochondria")).toBeInTheDocument();
  });

  it("calls setWalkCueOnly(true) when Cue only clicked in recall mode", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkCueOnly: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.click(screen.getByRole("button", { name: /cue only/i }));
    expect(mockFns.setWalkCueOnly).toHaveBeenCalledWith(true);
  });
});

describe("WalkModeBar — keyboard shortcuts", () => {
  it("fires rateWalkRecall on key 1–4 when walk is open and answer revealed", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);

    fireEvent.keyDown(window, { key: "1" });
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("again");

    fireEvent.keyDown(window, { key: "2" });
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("hard");

    fireEvent.keyDown(window, { key: "3" });
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("good");

    fireEvent.keyDown(window, { key: "4" });
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("easy");
  });

  it("does not fire rating when answer not yet revealed in recall mode", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "1" });
    expect(mockFns.rateWalkRecall).not.toHaveBeenCalled();
  });

  it("does not fire rating when walk is closed", () => {
    mockState = buildState({ walkOpen: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "1" });
    expect(mockFns.rateWalkRecall).not.toHaveBeenCalled();
  });

  it("does not fire rating when focus is in an input", () => {
    mockState = buildState({ walkOpen: true, walkAnswerRevealed: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(
      <>
        <WalkModeBar />
        <input data-testid="other-input" />
      </>,
    );
    const input = screen.getByTestId("other-input");
    fireEvent.keyDown(input, { key: "1", target: input });
    expect(mockFns.rateWalkRecall).not.toHaveBeenCalled();
  });

  it("fires rating on non-recall walk (no reveal required)", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: false, walkAnswerRevealed: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "3" });
    expect(mockFns.rateWalkRecall).toHaveBeenCalledWith("good");
  });
});

describe("WalkModeBar — extended keyboard shortcuts", () => {
  it("fires revealWalkAnswer on Space when in recall mode and answer not revealed", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: " " });
    expect(mockFns.revealWalkAnswer).toHaveBeenCalled();
  });

  it("does not fire revealWalkAnswer on Space when answer already revealed", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: " " });
    expect(mockFns.revealWalkAnswer).not.toHaveBeenCalled();
  });

  it("fires walkNext on ArrowRight when walk is open", () => {
    mockState = buildState({ walkOpen: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(mockFns.walkNext).toHaveBeenCalled();
  });

  it("fires walkPrev on ArrowLeft when walk is open", () => {
    mockState = buildState({ walkOpen: true, walkIndex: 1 });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(mockFns.walkPrev).toHaveBeenCalled();
  });

  it("calls setWalkOpen(false) on Escape when walk is open", () => {
    mockState = buildState({ walkOpen: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockFns.setWalkOpen).toHaveBeenCalledWith(false);
  });

  it("does not fire navigation shortcuts when walk is closed", () => {
    mockState = buildState({ walkOpen: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockFns.walkNext).not.toHaveBeenCalled();
    expect(mockFns.walkPrev).not.toHaveBeenCalled();
    expect(mockFns.revealWalkAnswer).not.toHaveBeenCalled();
    expect(mockFns.setWalkOpen).not.toHaveBeenCalled();
  });

  it("ignores extended shortcuts when focus is in an input", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(
      <>
        <WalkModeBar />
        <input data-testid="text-input" />
      </>,
    );
    const input = screen.getByTestId("text-input");
    fireEvent.keyDown(input, { key: " ", target: input });
    fireEvent.keyDown(input, { key: "ArrowRight", target: input });
    expect(mockFns.revealWalkAnswer).not.toHaveBeenCalled();
    expect(mockFns.walkNext).not.toHaveBeenCalled();
  });
});

describe("WalkModeBar — visual progress dots", () => {
  it("renders one progress dot per locus in current route", () => {
    mockState = buildState({ walkOpen: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    const dots = screen.getAllByTestId(/walk-progress-dot-/);
    expect(dots).toHaveLength(2);
  });

  it("marks the active dot with data-active=true", () => {
    mockState = buildState({ walkOpen: true, walkIndex: 1 });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    const activeDot = screen.getByTestId("walk-progress-dot-1");
    expect(activeDot.getAttribute("data-active")).toBe("true");
  });

  it("clicking a dot jumps to that step (only allowed when not waiting for rating)", () => {
    mockState = buildState({ walkOpen: true, walkRecallMode: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    fireEvent.click(screen.getByTestId("walk-progress-dot-1"));
    expect(mockFns.setWalkIndex).toHaveBeenCalledWith(1);
  });

  it("does not render dots when route has no loci", () => {
    mockState = buildState({ walkOpen: true, loci: [] });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.queryAllByTestId(/walk-progress-dot-/)).toHaveLength(0);
  });
});

describe("WalkModeBar — keyboard hint legend", () => {
  it("shows shortcut hint when walk is open", () => {
    mockState = buildState({ walkOpen: true });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.getByTestId("walk-shortcut-hint")).toBeInTheDocument();
  });

  it("does not show shortcut hint when walk is closed", () => {
    mockState = buildState({ walkOpen: false });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.queryByTestId("walk-shortcut-hint")).toBeNull();
  });
});

describe("WalkModeBar — empty route", () => {
  it("shows Step 0/0 when no loci", () => {
    mockState = buildState({ walkOpen: true, loci: [] });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.getByText("Step 0/0")).toBeInTheDocument();
  });

  it("next button is disabled when no loci", () => {
    mockState = buildState({ walkOpen: true, loci: [] });
    usePalaceStoreMock.mockImplementation((selector: (s: Record<string, unknown>) => unknown) => selector(mockState));
    render(<WalkModeBar />);
    expect(screen.getByRole("button", { name: /next step/i })).toBeDisabled();
  });
});
