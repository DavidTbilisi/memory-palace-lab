import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PalaceToolbar } from "./PalaceToolbar";

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      toolMode: "select",
      setToolMode: vi.fn(),
      setRouteBuilding: vi.fn(),
      connect: { fromShapeId: null },
      setConnectFrom: vi.fn(),
      saveCurrent: vi.fn(),
      persistenceState: "clean",
      draftRestored: false,
      lastDraftSavedAt: null,
      lastCheckpointSavedAt: null,
      editorRef: null,
      currentPalace: null,
    }),
  ),
}));

import { usePalaceStore } from "../store/palaceStore";

describe("PalaceToolbar", () => {
  it("uses neutral checkpoint styling when no intentional save is needed", () => {
    vi.mocked(usePalaceStore).mockImplementation((selector) =>
      selector({
        toolMode: "select",
        setToolMode: vi.fn(),
        setRouteBuilding: vi.fn(),
        connect: { fromShapeId: null },
        setConnectFrom: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "clean",
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        editorRef: null,
        currentPalace: null,
      } as never),
    );

    render(<PalaceToolbar />);

    expect(screen.getByRole("button", { name: /save checkpoint/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /checkpoint now/i })).not.toBeInTheDocument();
  });

  it("escalates the button when a checkpoint is still needed", () => {
    vi.mocked(usePalaceStore).mockImplementation((selector) =>
      selector({
        toolMode: "select",
        setToolMode: vi.fn(),
        setRouteBuilding: vi.fn(),
        connect: { fromShapeId: null },
        setConnectFrom: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "draft",
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        editorRef: null,
        currentPalace: { id: "p1", name: "Palace", createdAt: "2026-04-28T00:00:00.000Z" },
      } as never),
    );

    render(<PalaceToolbar />);

    const button = screen.getByRole("button", { name: /checkpoint now/i });
    expect(button.className).toContain("bg-amber-400");
    expect(button.className).toContain("shadow-[0_0_0_1px");
  });

  it("shows the compact connect workflow state when connect mode is active", () => {
    vi.mocked(usePalaceStore).mockImplementation((selector) =>
      selector({
        toolMode: "connect",
        setToolMode: vi.fn(),
        setRouteBuilding: vi.fn(),
        connect: { fromShapeId: "shape-1" },
        setConnectFrom: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "clean",
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        editorRef: null,
        currentPalace: { id: "p1", name: "Palace", createdAt: "2026-04-28T00:00:00.000Z" },
      } as never),
    );

    render(<PalaceToolbar />);

    expect(screen.getByText("Step 2: pick target")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pick a different source node/i })).toBeInTheDocument();
  });

  it("turns Route mode on and off from the Route button", () => {
    const setRouteBuilding = vi.fn();
    const palace = { id: "p1", name: "Palace", createdAt: "2026-04-28T00:00:00.000Z" };
    const stateWith = (toolMode: string) =>
      ({
        toolMode,
        setToolMode: vi.fn(),
        setRouteBuilding,
        connect: { fromShapeId: null },
        setConnectFrom: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "clean",
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        editorRef: null,
        currentPalace: palace,
      }) as never;

    vi.mocked(usePalaceStore).mockImplementation((selector) => selector(stateWith("select")));
    const { unmount } = render(<PalaceToolbar />);
    const idle = screen.getByRole("button", { name: /Route/ });
    expect(idle).toHaveAttribute("aria-pressed", "false");
    idle.click();
    expect(setRouteBuilding).toHaveBeenLastCalledWith(true);
    unmount();

    vi.mocked(usePalaceStore).mockImplementation((selector) => selector(stateWith("route")));
    render(<PalaceToolbar />);
    const building = screen.getByRole("button", { name: /Route/ });
    expect(building).toHaveAttribute("aria-pressed", "true");
    building.click();
    expect(setRouteBuilding).toHaveBeenLastCalledWith(false);
  });

  it("disables the Route button until a palace is open", () => {
    vi.mocked(usePalaceStore).mockImplementation((selector) =>
      selector({
        toolMode: "select",
        setToolMode: vi.fn(),
        setRouteBuilding: vi.fn(),
        connect: { fromShapeId: null },
        setConnectFrom: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "clean",
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        editorRef: null,
        currentPalace: null,
      } as never),
    );
    render(<PalaceToolbar />);
    expect(screen.getByRole("button", { name: /Route/ })).toBeDisabled();
  });

  it("exposes a DSL editor toggle with its shortcut in the tooltip", async () => {
    const setDslPaneOpen = vi.fn();
    vi.mocked(usePalaceStore).mockImplementation((selector) =>
      selector({
        toolMode: "select",
        setToolMode: vi.fn(),
        setRouteBuilding: vi.fn(),
        dslPaneOpen: false,
        setDslPaneOpen,
        connect: { fromShapeId: null },
        setConnectFrom: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "clean",
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        editorRef: null,
        currentPalace: null,
      } as never),
    );

    render(<PalaceToolbar />);
    const button = screen.getByRole("button", { name: /DSL/ });
    expect(button).toHaveAttribute("title", expect.stringMatching(/Toggle DSL editor \((Ctrl\+E|⌘E)\)/));
    expect(screen.queryByRole("radiogroup", { name: "Editor mode" })).not.toBeInTheDocument();
    button.click();
    expect(setDslPaneOpen).toHaveBeenCalledWith(true);
  });
});
