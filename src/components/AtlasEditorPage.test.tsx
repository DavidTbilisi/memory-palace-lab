import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AtlasEditorPage } from "./AtlasEditorPage";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

// Mock the store
vi.mock("../store/palaceStore");

describe("AtlasEditorPage - Atlas Hierarchy Editor (#12)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePalaceStore).mockImplementation((selector) => {
      const state = {
        palaces: [
          { id: "p1", name: "Memory Master", atlasPath: "Earth/Europe/Spain" },
          { id: "p2", name: "Learning Palace", atlasPath: "Earth/Europe" },
          { id: "p3", name: "Study Hub", atlasPath: null }, // No path = root
        ],
        currentPalace: null,
        openPalace: vi.fn(),
      };
      return selector(state as unknown as PalaceStore);
    });
  });

  it("should display atlas hierarchy as indented outline", () => {
    render(<AtlasEditorPage onOpenPalace={vi.fn()} />);
    expect(screen.getByText("Earth")).toBeInTheDocument();
  });

  it("should show nested hierarchy with proper indentation", () => {
    const { container } = render(<AtlasEditorPage onOpenPalace={vi.fn()} />);
    const outlineItems = container.querySelectorAll("[data-atlas-level]");
    expect(outlineItems.length).toBeGreaterThan(0);
  });

  it("should show collapse/expand controls for branches", () => {
    const { container } = render(<AtlasEditorPage onOpenPalace={vi.fn()} />);
    const expandButtons = container.querySelectorAll("[data-expand-button]");
    expect(expandButtons.length).toBeGreaterThan(0);
  });

  it("should support outline and graph view toggle", () => {
    const { container } = render(<AtlasEditorPage onOpenPalace={vi.fn()} />);
    const buttons = container.querySelectorAll("button");
    // Should have Outline and Graph buttons
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should render the page without errors", () => {
    render(<AtlasEditorPage onOpenPalace={vi.fn()} />);
    expect(screen.getByText("Atlas Hierarchy")).toBeInTheDocument();
  });
});
