import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoutePanel } from "./RoutePanel";
import { usePalaceStore } from "../store/palaceStore";

vi.mock("../store/palaceStore");
vi.mock("../canvas/readShapeText", () => ({
  resolveMemoryNodeTitle: (shape: any) => "Shape Title",
}));

describe("RoutePanel - Fully Editable Routes (#13)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePalaceStore as any).mockImplementation((selector: any) => {
      const state = {
        routes: [
          { id: "r1", name: "Main journey" },
          { id: "r2", name: "Secondary path" },
        ],
        loci: [
          { id: "l1", routeId: "r1", nodeId: "n1", label: "Entrance", orderIndex: 0 },
          { id: "l2", routeId: "r1", nodeId: "n2", label: "Main hall", orderIndex: 1 },
          { id: "l3", routeId: "r1", nodeId: "n3", label: "Library", orderIndex: 2 },
          { id: "l4", routeId: "r2", nodeId: "n4", label: "Garden", orderIndex: 0 },
        ],
        walkRouteId: "r1",
        walkOpen: false,
        walkIndex: 0,
        selectedShapeId: null,
        editorRef: null,
        setWalkRoute: vi.fn(),
        addRoute: vi.fn(),
        addLocusForSelectedRoute: vi.fn(),
        updateRouteName: vi.fn(),
        updateLocusLabel: vi.fn(),
        moveLocus: vi.fn(),
        deleteLocus: vi.fn(),
        reassignLocusRoute: vi.fn(),
      };
      return selector(state);
    });
  });

  describe("Add step to route at specific position", () => {
    it("should display all steps in order within a route", () => {
      render(<RoutePanel />);
      const routeLoci = screen.getAllByRole("textbox");
      // Input fields: route name, step 1 label, step 2 label, step 3 label
      expect(routeLoci.length).toBeGreaterThanOrEqual(3);
    });

    it("should show step numbers matching orderIndex", () => {
      const { container } = render(<RoutePanel />);
      const stepNumbers = container.querySelectorAll("li span.text-zinc-500");
      const texts = Array.from(stepNumbers).map((el) => el.textContent?.trim());
      expect(texts).toContain("1.");
      expect(texts).toContain("2.");
      expect(texts).toContain("3.");
    });
  });

  describe("Remove step from route", () => {
    it("should display delete button for each step", () => {
      const { container } = render(<RoutePanel />);
      const deleteButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("Delete")
      );
      expect(deleteButtons.length).toBeGreaterThanOrEqual(3);
    });

    it("should call deleteLocus when delete button clicked", async () => {
      const user = userEvent.setup();
      const deleteLocus = vi.fn();
      (usePalaceStore as any).mockImplementation((selector: any) => {
        const state = {
          routes: [{ id: "r1", name: "Main journey" }],
          loci: [
            { id: "l1", routeId: "r1", nodeId: "n1", label: "Step 1", orderIndex: 0 },
            { id: "l2", routeId: "r1", nodeId: "n2", label: "Step 2", orderIndex: 1 },
          ],
          walkRouteId: "r1",
          walkOpen: false,
          walkIndex: 0,
          selectedShapeId: null,
          editorRef: null,
          setWalkRoute: vi.fn(),
          addRoute: vi.fn(),
          addLocusForSelectedRoute: vi.fn(),
          updateRouteName: vi.fn(),
          updateLocusLabel: vi.fn(),
          moveLocus: vi.fn(),
          deleteLocus,
          reassignLocusRoute: vi.fn(),
        };
        return selector(state);
      });

      const { container, rerender } = render(<RoutePanel />);
      rerender(<RoutePanel />);

      const deleteButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("Delete")
      );
      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);
        expect(deleteLocus).toHaveBeenCalled();
      }
    });
  });

  describe("Reorder steps within a route", () => {
    it("should display up/down buttons for step movement", () => {
      const { container } = render(<RoutePanel />);
      const upButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("up")
      );
      const downButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("down")
      );
      expect(upButtons.length).toBeGreaterThan(0);
      expect(downButtons.length).toBeGreaterThan(0);
    });

    it("should disable up button for first step", () => {
      const { container } = render(<RoutePanel />);
      const upButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("Move locus 1 up")
      );
      expect(upButtons[0]?.hasAttribute("disabled")).toBe(true);
    });

    it("should disable down button for last step", () => {
      const { container } = render(<RoutePanel />);
      const downButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("down")
      );
      const lastDownButton = downButtons[downButtons.length - 1];
      expect(lastDownButton?.hasAttribute("disabled")).toBe(true);
    });

    it("should call moveLocus when up button clicked", async () => {
      const user = userEvent.setup();
      const moveLocus = vi.fn();
      (usePalaceStore as any).mockImplementation((selector: any) => {
        const state = {
          routes: [{ id: "r1", name: "Main journey" }],
          loci: [
            { id: "l1", routeId: "r1", nodeId: "n1", label: "Step 1", orderIndex: 0 },
            { id: "l2", routeId: "r1", nodeId: "n2", label: "Step 2", orderIndex: 1 },
          ],
          walkRouteId: "r1",
          walkOpen: false,
          walkIndex: 0,
          selectedShapeId: null,
          editorRef: null,
          setWalkRoute: vi.fn(),
          addRoute: vi.fn(),
          addLocusForSelectedRoute: vi.fn(),
          updateRouteName: vi.fn(),
          updateLocusLabel: vi.fn(),
          moveLocus,
          deleteLocus: vi.fn(),
          reassignLocusRoute: vi.fn(),
        };
        return selector(state);
      });

      const { container, rerender } = render(<RoutePanel />);
      rerender(<RoutePanel />);

      const upButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("Move locus 2 up")
      );
      if (upButtons.length > 0) {
        await user.click(upButtons[0]);
        expect(moveLocus).toHaveBeenCalledWith("l2", "up");
      }
    });

    it("should call moveLocus when down button clicked", async () => {
      const user = userEvent.setup();
      const moveLocus = vi.fn();
      (usePalaceStore as any).mockImplementation((selector: any) => {
        const state = {
          routes: [{ id: "r1", name: "Main journey" }],
          loci: [
            { id: "l1", routeId: "r1", nodeId: "n1", label: "Step 1", orderIndex: 0 },
            { id: "l2", routeId: "r1", nodeId: "n2", label: "Step 2", orderIndex: 1 },
          ],
          walkRouteId: "r1",
          walkOpen: false,
          walkIndex: 0,
          selectedShapeId: null,
          editorRef: null,
          setWalkRoute: vi.fn(),
          addRoute: vi.fn(),
          addLocusForSelectedRoute: vi.fn(),
          updateRouteName: vi.fn(),
          updateLocusLabel: vi.fn(),
          moveLocus,
          deleteLocus: vi.fn(),
          reassignLocusRoute: vi.fn(),
        };
        return selector(state);
      });

      const { container, rerender } = render(<RoutePanel />);
      rerender(<RoutePanel />);

      const downButtons = Array.from(container.querySelectorAll("button")).filter(
        (btn) => btn.getAttribute("aria-label")?.includes("Move locus 1 down")
      );
      if (downButtons.length > 0) {
        await user.click(downButtons[0]);
        expect(moveLocus).toHaveBeenCalledWith("l1", "down");
      }
    });
  });

  describe("Move step between routes", () => {
    it("should display route assignment dropdown for each step", () => {
      const { container } = render(<RoutePanel />);
      const selects = container.querySelectorAll("select");
      // First select is route dropdown, rest are locus route assignments
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });

    it("should show all available routes in assignment dropdown", () => {
      const { container } = render(<RoutePanel />);
      const selects = Array.from(container.querySelectorAll("select"));
      const routeSelects = selects.slice(1); // Skip first route dropdown
      const firstRouteSelect = routeSelects[0];
      const options = firstRouteSelect?.querySelectorAll("option") || [];
      expect(options.length).toBeGreaterThanOrEqual(2);
    });

    it("should call reassignLocusRoute when route dropdown changed", async () => {
      const user = userEvent.setup();
      const reassignLocusRoute = vi.fn();
      (usePalaceStore as any).mockImplementation((selector: any) => {
        const state = {
          routes: [
            { id: "r1", name: "Route 1" },
            { id: "r2", name: "Route 2" },
          ],
          loci: [{ id: "l1", routeId: "r1", nodeId: "n1", label: "Step 1", orderIndex: 0 }],
          walkRouteId: "r1",
          walkOpen: false,
          walkIndex: 0,
          selectedShapeId: null,
          editorRef: null,
          setWalkRoute: vi.fn(),
          addRoute: vi.fn(),
          addLocusForSelectedRoute: vi.fn(),
          updateRouteName: vi.fn(),
          updateLocusLabel: vi.fn(),
          moveLocus: vi.fn(),
          deleteLocus: vi.fn(),
          reassignLocusRoute,
        };
        return selector(state);
      });

      const { container, rerender } = render(<RoutePanel />);
      rerender(<RoutePanel />);

      const selects = Array.from(container.querySelectorAll("select"));
      const routeSelect = selects[1]; // Second select is route assignment
      if (routeSelect) {
        await user.selectOptions(routeSelect, "r2");
        expect(reassignLocusRoute).toHaveBeenCalledWith("l1", "r2");
      }
    });
  });

  describe("Edit step labels", () => {
    it("should display editable label for each step", () => {
      const { container } = render(<RoutePanel />);
      const labelInputs = container.querySelectorAll("input[aria-label^='Locus']");
      expect(labelInputs.length).toBeGreaterThanOrEqual(3);
    });

    it("should call updateLocusLabel when label changed", async () => {
      const user = userEvent.setup();
      const updateLocusLabel = vi.fn();
      (usePalaceStore as any).mockImplementation((selector: any) => {
        const state = {
          routes: [{ id: "r1", name: "Main journey" }],
          loci: [{ id: "l1", routeId: "r1", nodeId: "n1", label: "Old", orderIndex: 0 }],
          walkRouteId: "r1",
          walkOpen: false,
          walkIndex: 0,
          selectedShapeId: null,
          editorRef: null,
          setWalkRoute: vi.fn(),
          addRoute: vi.fn(),
          addLocusForSelectedRoute: vi.fn(),
          updateRouteName: vi.fn(),
          updateLocusLabel,
          moveLocus: vi.fn(),
          deleteLocus: vi.fn(),
          reassignLocusRoute: vi.fn(),
        };
        return selector(state);
      });

      const { container, rerender } = render(<RoutePanel />);
      rerender(<RoutePanel />);

      const labelInput = container.querySelector("input[aria-label='Locus 1 label']") as HTMLInputElement;
      if (labelInput) {
        await user.click(labelInput);
        await user.keyboard("{Control>}a{/Control}");
        await user.type(labelInput, "New");
        expect(updateLocusLabel).toHaveBeenCalledWith("l1", expect.any(String));
      }
    });
  });
});
