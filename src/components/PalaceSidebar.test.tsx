import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PalaceSidebar } from "./PalaceSidebar";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

// Mock the store, matching the pattern used by AtlasEditorPage.test.tsx.
vi.mock("../store/palaceStore");

// useValue just needs to invoke the tracked selector once; PalaceSidebar's
// only use of it (the background-image state) already handles a null/undefined
// editorRef, so it doesn't need a real tldraw editor to render.
vi.mock("@tldraw/editor", () => ({
  useValue: (_name: string, fn: () => unknown) => fn(),
}));

const palaces = [
  { id: "p1", name: "Alpha", atlasPath: "Earth/Europe" },
  { id: "p2", name: "Bravo", atlasPath: "Earth/Europe" },
  { id: "p3", name: "Charlie", atlasPath: null },
];

describe("PalaceSidebar - search and collapse-all", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePalaceStore).mockImplementation((selector) => {
      const state = {
        palaces,
        trashedPalaces: [],
        loadPalaces: vi.fn(),
        openPalace: vi.fn(),
        createPalace: vi.fn(),
        deletePalace: vi.fn(),
        restorePalace: vi.fn(),
        purgePalace: vi.fn(),
        saveCurrent: vi.fn(),
        setCurrentPalaceMeta: vi.fn(),
        currentPalace: null,
        editorRef: null,
        atlasLevelLabels: [],
      };
      return selector(state as unknown as PalaceStore);
    });
  });

  it("renders a search box and collapse/expand-all controls", () => {
    render(<PalaceSidebar />);
    expect(screen.getByLabelText("Search palaces")).toBeInTheDocument();
    expect(screen.getByLabelText("Collapse all folders")).toBeInTheDocument();
    expect(screen.getByLabelText("Expand all folders")).toBeInTheDocument();
  });

  it("filters the list to palaces matching the search text", () => {
    render(<PalaceSidebar />);
    fireEvent.change(screen.getByLabelText("Search palaces"), {
      target: { value: "Alpha" },
    });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).not.toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("matches on atlas path too, and shows a message when nothing matches", () => {
    render(<PalaceSidebar />);
    fireEvent.change(screen.getByLabelText("Search palaces"), {
      target: { value: "Europe" },
    });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search palaces"), {
      target: { value: "nonexistent" },
    });
    expect(screen.getByText(/No palaces match/)).toBeInTheDocument();
  });

  it("collapses and re-expands every folder", () => {
    const { container } = render(<PalaceSidebar />);
    const branches = () => Array.from(container.querySelectorAll("details"));
    expect(branches().length).toBeGreaterThan(0);
    branches().forEach((branch) => expect(branch.open).toBe(true));

    fireEvent.click(screen.getByLabelText("Collapse all folders"));
    branches().forEach((branch) => expect(branch.open).toBe(false));

    fireEvent.click(screen.getByLabelText("Expand all folders"));
    branches().forEach((branch) => expect(branch.open).toBe(true));
  });
});
