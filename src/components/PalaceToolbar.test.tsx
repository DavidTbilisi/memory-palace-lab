import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PalaceToolbar } from "./PalaceToolbar";

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      toolMode: "select",
      setToolMode: vi.fn(),
      routePanelOpen: false,
      setRoutePanelOpen: vi.fn(),
      saveCurrent: vi.fn(),
      persistenceState: "clean",
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
        routePanelOpen: false,
        setRoutePanelOpen: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "clean",
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
        routePanelOpen: false,
        setRoutePanelOpen: vi.fn(),
        saveCurrent: vi.fn(),
        persistenceState: "draft",
        editorRef: null,
        currentPalace: { id: "p1", name: "Palace", createdAt: "2026-04-28T00:00:00.000Z" },
      } as never),
    );

    render(<PalaceToolbar />);

    const button = screen.getByRole("button", { name: /checkpoint now/i });
    expect(button.className).toContain("bg-amber-400");
    expect(button.className).toContain("shadow-[0_0_0_1px");
  });
});
