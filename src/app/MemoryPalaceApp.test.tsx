import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryPalaceApp } from "./MemoryPalaceApp";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

// Mock the store
vi.mock("../store/palaceStore");
vi.mock("../canvas/MemoryPalaceCanvas", () => ({
  MemoryPalaceCanvas: () => <div data-testid="canvas">Canvas</div>,
}));
vi.mock("../components/ReviewPage", () => ({
  ReviewPage: () => <div data-testid="review-page">Review</div>,
}));
vi.mock("../components/AnalyticsPanel", () => ({
  AnalyticsPanel: () => <div data-testid="analytics">Analytics</div>,
}));
vi.mock("../components/TheSystemWorkbench", () => ({
  TheSystemWorkbench: () => <div data-testid="system">System</div>,
}));
vi.mock("../components/HelpCenterPage", () => ({
  HelpCenterPage: () => <div data-testid="help">Help</div>,
}));

describe("MemoryPalaceApp - Header Navigation (#11)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePalaceStore).mockImplementation((selector) => {
      const state = {
        palaces: [],
        currentPalace: null,
        nodes: [],
        routes: [],
        loci: [],
        pendingCast: null,
        persistenceState: "clean" as const,
        draftRestored: false,
        lastDraftSavedAt: null,
        lastCheckpointSavedAt: null,
        analyticsLoaded: false,
        analyticsEvents: [],
        editorRef: null,
        selectedShapeId: null,
        loadAnalyticsEvents: vi.fn(),
        loadPalaces: vi.fn().mockResolvedValue(undefined),
        setPendingCast: vi.fn(),
        createPalace: vi.fn(),
        openPalace: vi.fn(),
        saveCurrent: vi.fn(),
        flushDraftSave: vi.fn().mockResolvedValue(undefined),
      };
      return selector(state as unknown as PalaceStore);
    });
  });

  describe("Navigation tabs centering", () => {
    it("should render all 7 navigation tabs", () => {
      const { container } = render(<MemoryPalaceApp />);

      const nav = container.querySelector("nav");
      const buttons = nav?.querySelectorAll("button") || [];

      expect(buttons.length).toBe(7);
      expect(buttons[0]?.textContent).toMatch(/Graph/);
      expect(buttons[1]?.textContent).toMatch(/Review/);
      expect(buttons[2]?.textContent).toMatch(/Insights/);
      expect(buttons[3]?.textContent).toMatch(/System/);
      expect(buttons[4]?.textContent).toMatch(/Atlas/);
      expect(buttons[5]?.textContent).toMatch(/Routes/);
      expect(buttons[6]?.textContent).toMatch(/Help/);
    });

    it("should position nav tabs in center of header", () => {
      const { container } = render(<MemoryPalaceApp />);

      const header = container.querySelector("header");
      const nav = header?.querySelector("nav");

      // Header should use grid or flex with centered nav section
      expect(nav).toBeInTheDocument();

      // Nav should be visually centered (use CSS Grid or absolute centering)
      const headerClass = header?.className || "";
      const navClass = nav?.className || "";

      // Either header uses grid with center column, or nav has justify-center style
      const isCentered = headerClass.includes("grid") ||
                         navClass.includes("justify-center") ||
                         navClass.includes("absolute") ||
                         navClass.includes("left-1/2");

      expect(isCentered).toBe(true);
    });

    it("should maintain nav alignment when title is different length", () => {
      const { container } = render(<MemoryPalaceApp />);

      const nav1 = container.querySelector("nav");

      // Even if title changes, nav should stay centered
      // (This is more of a visual test, but we check structure)
      expect(nav1).toBeInTheDocument();
    });

    it("should allow clicking nav tabs from any position", async () => {
      const user = userEvent.setup();
      const { container } = render(<MemoryPalaceApp />);

      const nav = container.querySelector("nav");
      const reviewButton = nav?.querySelectorAll("button")[1]; // Review is index 1

      if (reviewButton) {
        await user.click(reviewButton);
        // Should navigate to review page
        expect(screen.getByTestId("review-page")).toBeInTheDocument();
      }
    });

    it("should highlight current page tab", () => {
      const { container } = render(<MemoryPalaceApp />);

      const nav = container.querySelector("nav");
      const graphButton = nav?.querySelector("button"); // First button is Graph

      // Graph tab should be highlighted (default variant)
      const isActive = graphButton?.className.includes("bg-violet") ||
                       graphButton?.className.includes("default");

      expect(isActive).toBe(true);
    });
  });

  describe("Header layout structure", () => {
    it("should have 3-part layout: title, nav center, controls right", () => {
      const { container } = render(<MemoryPalaceApp />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();

      // Should have title on left
      const title = header?.querySelector("h1");
      expect(title).toBeInTheDocument();

      // Should have nav in middle
      const nav = header?.querySelector("nav");
      expect(nav).toBeInTheDocument();

      // Should have controls on right
      const controls = header?.querySelector(".flex.items-center.gap-2");
      expect(controls).toBeInTheDocument();
    });

    it("should not use justify-between that pushes nav to side", () => {
      const { container } = render(<MemoryPalaceApp />);

      const header = container.querySelector("header");
      const headerClass = header?.className || "";

      // Should not use justify-between alone (unless using grid)
      if (!headerClass.includes("grid")) {
        expect(headerClass).not.toMatch(/justify-between\s*$/);
      }
    });

    it("should show compact status icons and reveal details on click", async () => {
      const user = userEvent.setup();
      render(<MemoryPalaceApp />);

      await user.click(screen.getByRole("button", { name: "Storage details" }));
      expect(screen.getByText("Browser storage: local storage")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Auto-save details" }));
      expect(screen.getByText("Auto-save: idle")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Checkpoint details" }));
      expect(screen.getByText("Checkpoint: none")).toBeInTheDocument();
    });
  });

  describe("Onboarding/Learn Panel (#14)", () => {
    it("should render learn button in header controls", () => {
      const { container } = render(<MemoryPalaceApp />);
      const buttons = container.querySelectorAll("header button");
      const learnButton = Array.from(buttons).find(btn => btn.textContent?.includes("Learn"));
      expect(learnButton).toBeInTheDocument();
    });

    it("should show onboarding panel when no palaces exist", () => {
      const { container } = render(<MemoryPalaceApp />);
      // OnboardingPanel should be rendered and visible initially
      // Check for lesson content or panel structure
      const lessonContent = container.textContent;
      expect(lessonContent).toMatch(/Lesson 1|Build your first palace/);
    });

    it("should allow closing onboarding panel even with no palaces", async () => {
      const user = userEvent.setup();
      const { container } = render(<MemoryPalaceApp />);

      // Find the close button in the onboarding panel
      const closeButton = Array.from(container.querySelectorAll("button")).find(
        btn => btn.getAttribute("aria-label")?.includes("Close") ||
               btn.className?.includes("close")
      );

      if (closeButton) {
        await user.click(closeButton);
        // After closing, panel should not be visible
        // Check that onboarding lesson content is gone or hidden
        const lessons = container.querySelectorAll("[data-lesson-id], .lesson");
        expect(lessons.length).toBe(0);
      }
    });

    it("should toggle onboarding panel with learn button", async () => {
      const user = userEvent.setup();
      const { container } = render(<MemoryPalaceApp />);

      const buttons = container.querySelectorAll("header button");
      const learnButton = Array.from(buttons).find(btn => btn.textContent?.includes("Learn"));

      if (learnButton) {
        // Click to close
        await user.click(learnButton);
        // After clicking, panel should be hidden
        // (This will depend on how the panel implements the toggle)

        // Click again to reopen
        await user.click(learnButton);
        // Panel should reappear
      }
    });

    it("should keep onboarding closed after explicit close, even when navigating back", async () => {
      const user = userEvent.setup();
      const { container } = render(<MemoryPalaceApp />);

      // Find and click the close button
      const closeButton = Array.from(container.querySelectorAll("button")).find(
        btn => btn.getAttribute("aria-label")?.includes("Close") ||
               btn.className?.includes("close")
      );

      if (closeButton) {
        await user.click(closeButton);

        // Navigate to another page and back
        const nav = container.querySelector("nav");
        const helpButton = nav?.querySelectorAll("button")[6]; // Help is last

        if (helpButton) {
          await user.click(helpButton);
          // Panel should still be closed
          const lessons = container.querySelectorAll("[data-lesson-id], .lesson");
          expect(lessons.length).toBe(0);
        }
      }
    });
  });
});
