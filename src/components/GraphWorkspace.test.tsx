import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GraphWorkspace } from "./GraphWorkspace";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

vi.mock("../store/palaceStore");
vi.mock("../canvas/MemoryPalaceCanvas", () => ({ MemoryPalaceCanvas: () => <div data-testid="canvas" /> }));
vi.mock("./NodeInspector", () => ({ NodeInspector: () => <div data-testid="inspector" /> }));
vi.mock("./PalaceDslEditor", () => ({ PalaceDslEditor: () => <div data-testid="dsl" /> }));
vi.mock("./PalaceToolbar", () => ({ PalaceToolbar: () => <div data-testid="toolbar" /> }));
vi.mock("./RoutePanel", () => ({ RoutePanel: () => <div data-testid="route-panel" /> }));
vi.mock("./WalkModeBar", () => ({ WalkModeBar: () => <div data-testid="walk-bar" /> }));
vi.mock("./GraphEmptyState", () => ({ GraphEmptyState: () => <div data-testid="empty-state" /> }));

function mockStore(overrides: Partial<Record<keyof PalaceStore, unknown>> = {}) {
  const state: Record<string, unknown> = {
    currentPalace: null,
    routePanelOpen: false,
    dslPaneOpen: false,
    ...overrides,
  };
  vi.mocked(usePalaceStore).mockImplementation((selector) => selector(state as unknown as PalaceStore));
}

const baseProps = {
  isActive: true,
  assessHint: null,
  dslSplitRatio: 0.4,
  onDslSeparatorMouseDown: vi.fn(),
  showInspector: true,
  onHoverHintChange: vi.fn(),
  onOpenRepresent: vi.fn(),
  onCreateTutorialPalace: vi.fn(),
  onOpenHelp: vi.fn(),
  onOpenCommandPalette: vi.fn(),
  onOpenImport: vi.fn(),
};

describe("GraphWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("shows the empty state when no palace is open", () => {
    render(<GraphWorkspace {...baseProps} />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByTestId("canvas")).not.toBeInTheDocument();
  });

  it("renders the canvas and inspector when a palace is open", () => {
    mockStore({ currentPalace: { id: "p1", name: "P", createdAt: "x" } });
    render(<GraphWorkspace {...baseProps} />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
    expect(screen.getByTestId("inspector")).toBeInTheDocument();
    expect(screen.queryByTestId("dsl")).not.toBeInTheDocument();
  });

  it("hides the inspector when showInspector is false", () => {
    mockStore({ currentPalace: { id: "p1", name: "P", createdAt: "x" } });
    render(<GraphWorkspace {...baseProps} showInspector={false} />);
    expect(screen.queryByTestId("inspector")).not.toBeInTheDocument();
  });

  it("renders the DSL pane and separator when dslPaneOpen is true", () => {
    mockStore({ currentPalace: { id: "p1", name: "P", createdAt: "x" }, dslPaneOpen: true });
    render(<GraphWorkspace {...baseProps} />);
    expect(screen.getByTestId("dsl")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("shows the Assess banner only when an assessHint and a palace are present", () => {
    const assessHint = {
      record: { takeaway: "T", adjustment: "A" },
      score: 0.8,
      sourcePalaceName: "Other",
      jump: vi.fn(),
      dismiss: vi.fn(),
    };
    mockStore({ currentPalace: { id: "p1", name: "P", createdAt: "x" } });
    render(<GraphWorkspace {...baseProps} assessHint={assessHint as never} />);
    expect(screen.getByText(/Other/)).toBeInTheDocument();
  });

  it("applies the hidden class when not active", () => {
    const { container } = render(<GraphWorkspace {...baseProps} isActive={false} />);
    expect(container.querySelector("section")?.className).toContain("hidden");
  });
});
