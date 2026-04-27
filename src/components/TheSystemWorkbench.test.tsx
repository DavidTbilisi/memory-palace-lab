import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TheSystemWorkbench } from "./TheSystemWorkbench";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

// Mock the store
vi.mock("../store/palaceStore");
vi.mock("./TheSystemLibrary", () => ({
  TheSystemLibrary: () => <div data-testid="system-library">Docs</div>,
}));

describe("TheSystemWorkbench - Page Overflow (#10)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePalaceStore).mockImplementation((selector) => {
      const state = {
        currentPalace: null,
        editorRef: null,
        selectedShapeId: null,
        replaceRoutesAndLoci: vi.fn(),
        recordAnalyticsEvent: vi.fn(),
      };
      return selector(state as unknown as PalaceStore);
    });
  });

  describe("Pipelines page scrolling", () => {
    it("should display all pipeline cards without clipping", () => {
      const { container } = render(<TheSystemWorkbench />);

      // Get the pipelines grid container
      const gridContainer = container.querySelector("[class*='grid'][class*='md:grid-cols-3']");
      expect(gridContainer).toBeInTheDocument();

      // Verify grid is in a scrollable ancestor (the flex-1 overflow-y-auto div)
      let current: Element | null = gridContainer;
      let foundScrollable = false;
      for (let i = 0; i < 5 && current; i++) {
        current = current.parentElement;
        if (current?.className?.includes("overflow-y-auto")) {
          foundScrollable = true;
          break;
        }
      }
      expect(foundScrollable).toBe(true);
    });

    it("should allow vertical scrolling in navigator section", () => {
      const { container } = render(<TheSystemWorkbench />);

      // Navigator should be in scrollable container
      const scrollableNav = container.querySelector(".flex-1.overflow-y-auto");
      expect(scrollableNav).toBeInTheDocument();
    });

    it("should not clip pipeline cards with overflow-hidden", () => {
      const { container } = render(<TheSystemWorkbench />);

      // Parent flex container should not have overflow-hidden on the grid
      const gridSection = container.querySelector("[class*='md:grid-cols-3']")?.parentElement;
      const hasOverflowHidden = gridSection?.className.includes("overflow-hidden");

      expect(hasOverflowHidden).toBe(false);
    });
  });

  describe("Docs page scrolling", () => {
    it("should display docs page with full scrollable content", async () => {
      const user = userEvent.setup();
      render(<TheSystemWorkbench />);

      const docsButton = screen.getAllByText("Docs")[0]; // Get the button, not the span
      await user.click(docsButton);

      // Docs container should be scrollable
      const docsContainer = screen.getByTestId("system-library").parentElement;
      expect(docsContainer?.className).toMatch(/overflow-y-auto|flex-1/);
    });
  });

  describe("Pipeline detail view scrolling", () => {
    it("should display session inputs and graph output without clipping", () => {
      const { container } = render(<TheSystemWorkbench />);

      // Detail section should have scrollable content area
      const detailSection = container.querySelector("section[class*='border-zinc-800']");
      const contentArea = detailSection?.querySelector("[class*='overflow-y-auto']");

      expect(contentArea).toBeInTheDocument();
      expect(contentArea?.className).toMatch(/overflow-y-auto/);
    });

    it("should allow scrolling to see all form inputs and buttons", () => {
      const { container } = render(<TheSystemWorkbench />);

      // Grid containing inputs should be in scrollable parent with min-h-0
      const contentGrid = container.querySelector("[class*='lg:grid-cols-2']");
      const scrollParent = contentGrid?.closest("[class*='min-h-0'][class*='overflow-y-auto']");

      expect(scrollParent).toBeInTheDocument();
    });
  });

  describe("Overall layout structure", () => {
    it("should use flex column layout for main workbench", () => {
      const { container } = render(<TheSystemWorkbench />);

      const main = container.firstChild;
      expect(main?.className).toMatch(/flex.*flex-col/);
    });

    it("should divide vertical space between navigator and detail correctly", () => {
      const { container } = render(<TheSystemWorkbench />);

      const flexContainer = container.querySelector(".flex-col.gap-3");
      const children = flexContainer?.children || [];

      // Should have 2 main sections: navigator (flex-1) and detail (flex-1)
      expect(children.length).toBeGreaterThanOrEqual(2);
    });

    it("should prevent overflow-hidden from cascading to content", () => {
      const { container } = render(<TheSystemWorkbench />);

      // The outer container can have overflow-hidden for the flex layout,
      // but inner scrollable sections should explicitly allow overflow-y-auto
      const innerScrollable = Array.from(container.querySelectorAll("[class*='overflow-y-auto']"));
      expect(innerScrollable.length).toBeGreaterThan(0);
    });
  });
});
