import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locus, MemoryNode, MemoryRoute, Palace } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { RoutesPanel } from "./RoutesPanel";

vi.mock("../utils/confirmDestructive", () => ({ confirmDestructive: vi.fn(async () => true) }));

const palace: Palace = { id: "palace-1", name: "House", alias: null, atlasPath: null, editorSnapshot: null };

const routes: MemoryRoute[] = [
  { id: "route-a", palaceId: "palace-1", name: "Morning walk" },
  { id: "route-b", palaceId: "palace-1", name: "Evening review", color: "amber" },
];

const nodes: MemoryNode[] = [
  ["n1", "Front door"],
  ["n2", "Hallway mirror"],
  ["n3", "Kitchen sink"],
].map(([id, title]) => ({ id: id!, objectId: `o-${id}`, title: title!, content: "", kind: "memory" as const, portal: null }));

const future = "2999-01-01T00:00:00.000Z";
const loci: Locus[] = [
  { id: "l1", routeId: "route-a", nodeId: "n1", orderIndex: 0, label: "", nextReviewAt: future },
  { id: "l2", routeId: "route-a", nodeId: "n2", orderIndex: 1, label: "Coat hook", nextReviewAt: future },
  { id: "l3", routeId: "route-a", nodeId: "n3", orderIndex: 2, label: "", nextReviewAt: "2020-01-01T00:00:00.000Z" },
  { id: "l4", routeId: "route-b", nodeId: "n3", orderIndex: 0, label: "", nextReviewAt: future },
];

const store = () => usePalaceStore.getState();
const stopOrder = (routeId: string) =>
  store()
    .loci.filter((locus) => locus.routeId === routeId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((locus) => locus.id);

function seed(overrides: Partial<ReturnType<typeof usePalaceStore.getState>> = {}) {
  act(() => {
    store().hydrateFromSnapshot({ palace, canvasObjects: [], nodes, edges: [], routes, loci });
    usePalaceStore.setState({
      editorRef: null,
      routePanelOpen: true,
      toolMode: "select",
      routeNotice: null,
      walkRouteId: "route-a",
      ...overrides,
    });
  });
}

function stopRows() {
  const list = screen.getByRole("list", { name: "Stops" });
  return within(list)
    .getAllByRole("listitem")
    .map((item) => item.textContent);
}

beforeEach(() => seed());
afterEach(() => vi.restoreAllMocks());

describe("RoutesPanel", () => {
  it("lists every route and opens the active one", () => {
    render(<RoutesPanel />);

    expect(screen.getByText("2 routes")).toBeInTheDocument();
    const active = screen.getByRole("region", { name: "Route Morning walk" });
    const inactive = screen.getByRole("region", { name: "Route Evening review" });
    expect(within(active).getByRole("list", { name: "Stops" })).toBeInTheDocument();
    expect(within(inactive).queryByRole("list", { name: "Stops" })).toBeNull();
    expect(stopRows()).toEqual(["1Front door", "2Coat hook· Hallway mirror", "3Kitchen sinkdue"]);
    expect(within(active).getByText("· 1 due")).toBeInTheDocument();
  });

  it("shows each route's metadata on its card, in order", () => {
    act(() => {
      usePalaceStore.setState({
        routes: [
          {
            ...routes[0]!,
            metadata: [
              { key: "difficulty", value: "advanced" },
              { key: "prereq", value: "Gate of SOLID" },
              { key: "mode", value: null },
            ],
          },
          { ...routes[1]!, metadata: [{ key: "duration", value: "30min" }] },
        ],
      });
    });
    render(<RoutesPanel />);

    const chips = (routeName: string) =>
      within(screen.getByRole("list", { name: `Metadata for ${routeName}` }))
        .getAllByRole("listitem")
        .map((item) => item.textContent);
    // The inactive route shows its metadata too, not only the open one.
    expect(chips("Morning walk")).toEqual(["difficulty:advanced", "prereq:Gate of SOLID", "mode"]);
    expect(chips("Evening review")).toEqual(["duration:30min"]);
  });

  it("shows no metadata list for a route without metadata", () => {
    render(<RoutesPanel />);
    expect(screen.queryByRole("list", { name: /^Metadata for/ })).toBeNull();
  });

  it("opens another route when its name is clicked", () => {
    render(<RoutesPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Evening review" }));

    expect(store().walkRouteId).toBe("route-b");
    expect(stopRows()).toEqual(["1Kitchen sink"]);
  });

  it("removes a stop and brings it back with Undo", () => {
    render(<RoutesPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Remove stop 2, Coat hook" }));

    expect(stopOrder("route-a")).toEqual(["l1", "l3"]);
    expect(screen.getByRole("status")).toHaveTextContent("Removed Hallway mirror (stop 2)");

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(stopOrder("route-a")).toEqual(["l1", "l2", "l3"]);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("moves a stop with the arrow keys and keeps focus on it", () => {
    render(<RoutesPanel />);
    const grip = screen.getByRole("button", { name: "Move stop 1, Front door" });
    grip.focus();
    fireEvent.keyDown(grip, { key: "ArrowDown" });

    expect(stopOrder("route-a")).toEqual(["l2", "l1", "l3"]);
    expect(document.activeElement).toHaveAccessibleName("Move stop 2, Front door");

    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(stopOrder("route-a")).toEqual(["l2", "l3", "l1"]);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(stopOrder("route-a")).toEqual(["l2", "l3", "l1"]);
  });

  it("moves a stop by dragging its handle", () => {
    render(<RoutesPanel />);
    const rows = screen.getAllByRole("listitem");
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const index = rows.indexOf(this as HTMLLIElement);
      return { top: index * 20, height: 20, bottom: index * 20 + 20, left: 0, right: 200, width: 200, x: 0, y: index * 20, toJSON: () => ({}) } as DOMRect;
    });
    const grip = screen.getByRole("button", { name: "Move stop 1, Front door" });

    fireEvent.pointerDown(grip, { button: 0, pointerId: 1, clientY: 10 });
    fireEvent.pointerMove(grip, { pointerId: 1, clientY: 55 });
    fireEvent.pointerUp(grip, { pointerId: 1, clientY: 55 });

    expect(stopOrder("route-a")).toEqual(["l2", "l3", "l1"]);
  });

  it("renames a route in place", async () => {
    const user = userEvent.setup();
    render(<RoutesPanel />);
    await user.dblClick(screen.getByRole("button", { name: "Morning walk" }));
    const input = screen.getByRole("textbox", { name: "Route name" });
    await user.clear(input);
    await user.type(input, "Evening review{Enter}");

    expect(store().routes[0]!.name).toBe("Evening review (2)");
    expect(screen.queryByRole("textbox", { name: "Route name" })).toBeNull();
  });

  it("gives a stop its own label and clears it again", async () => {
    const user = userEvent.setup();
    render(<RoutesPanel />);
    await user.dblClick(screen.getByRole("button", { name: "Front door" }));
    await user.type(screen.getByRole("textbox", { name: "Label for stop 1" }), "Door knocker{Enter}");
    expect(store().loci.find((locus) => locus.id === "l1")!.label).toBe("Door knocker");

    await user.dblClick(screen.getByRole("button", { name: /^Door knocker/ }));
    const input = screen.getByRole("textbox", { name: "Label for stop 1" });
    expect(input).toHaveAttribute("placeholder", "Front door");
    await user.clear(input);
    await user.keyboard("{Enter}");
    expect(store().loci.find((locus) => locus.id === "l1")!.label).toBe("");
    expect(screen.getByRole("button", { name: "Front door" })).toBeInTheDocument();
  });

  it("hides a route on the canvas and changes its color", async () => {
    const user = userEvent.setup();
    render(<RoutesPanel />);
    const eye = screen.getByRole("button", { name: "Show Morning walk on the canvas" });
    expect(eye).toHaveAttribute("aria-pressed", "true");
    await user.click(eye);
    expect(store().routes[0]!.hidden).toBe(true);
    expect(eye).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("button", { name: "Color of Morning walk: Violet" }));
    await user.click(await screen.findByRole("menuitem", { name: "Rose" }));
    expect(store().routes[0]!.color).toBe("rose");
  });

  it("walks a route from its card", () => {
    render(<RoutesPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Walk Evening review" }));

    expect(store().walkRouteId).toBe("route-b");
    expect(store().walkOpen).toBe(true);
  });

  it("deletes a route from its menu after confirming", async () => {
    const user = userEvent.setup();
    render(<RoutesPanel />);
    await user.click(screen.getByRole("button", { name: "More actions for Evening review" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete route" }));

    await vi.waitFor(() => expect(store().routes.map((route) => route.id)).toEqual(["route-a"]));
  });

  it("toggles Route mode from the open route", () => {
    render(<RoutesPanel />);
    const toggle = screen.getByRole("button", { name: "Add stops" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);

    expect(store().toolMode).toBe("route");
    expect(screen.getByRole("button", { name: "Adding stops" })).toHaveAttribute("aria-pressed", "true");
  });

  it("offers to create the first route", () => {
    seed({ routes: [], loci: [], walkRouteId: null });
    render(<RoutesPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Create route" }));

    expect(store().routes.map((route) => route.name)).toEqual(["Route 1"]);
    expect(store().toolMode).toBe("route");
  });

  describe("saved views", () => {
    const view = { x: -400, y: -300, w: 800, h: 600 };
    let viewport = { x: -300, y: -250, w: 800, h: 600 };

    function seedWithCanvas(stops: Locus[] = loci) {
      const shapes = nodes.map((node, index) => ({
        id: `shape:${index}`,
        type: "geo",
        meta: { mpNodeId: node.id, mpTitle: node.title },
        props: {},
        bounds: { x: index * 300, y: 0, w: 200, h: 100 },
      }));
      const editor = {
        getCurrentPageShapeIds: () => new Set(shapes.map((shape) => shape.id)),
        getShape: (id: string) => shapes.find((shape) => shape.id === id),
        getShapePageBounds: (id: string) => shapes.find((shape) => shape.id === id)?.bounds,
        getViewportPageBounds: () => viewport,
      };
      seed({ editorRef: editor as never, loci: stops });
    }
    const viewOf = (id: string) => store().loci.find((locus) => locus.id === id)?.view;

    beforeEach(() => {
      viewport = { x: -300, y: -250, w: 800, h: 600 };
    });

    it("saves the current view for a stop, then shows, replaces, or removes it", async () => {
      const user = userEvent.setup();
      seedWithCanvas();
      render(<RoutesPanel />);

      await user.click(screen.getByRole("button", { name: "Save the current view for stop 1, Front door" }));
      expect(viewOf("l1")).toEqual(view);
      expect(screen.getByRole("status")).toHaveTextContent("Saved the view for stop 1");

      const saved = screen.getByRole("button", { name: "Saved view of stop 1, Front door" });
      await user.click(saved);
      await user.click(await screen.findByRole("menuitem", { name: "Show saved view" }));
      expect(store()).toMatchObject({ focusNodeId: "n1", focusView: view });

      viewport = { x: -100, y: -50, w: 400, h: 300 };
      await user.click(saved);
      await user.click(await screen.findByRole("menuitem", { name: "Replace with current view" }));
      expect(viewOf("l1")).toEqual({ x: -200, y: -100, w: 400, h: 300 });

      await user.click(saved);
      await user.click(await screen.findByRole("menuitem", { name: "Remove saved view" }));
      expect(store().loci.find((locus) => locus.id === "l1")).not.toHaveProperty("view");
      await user.click(screen.getByRole("button", { name: "Undo" }));
      expect(viewOf("l1")).toEqual({ x: -200, y: -100, w: 400, h: 300 });
    });

    it("asks for the node to be in sight before saving a view", async () => {
      const user = userEvent.setup();
      seedWithCanvas();
      viewport = { x: 5000, y: 5000, w: 800, h: 600 };
      render(<RoutesPanel />);

      await user.click(screen.getByRole("button", { name: "Save the current view for stop 2, Coat hook" }));
      expect(viewOf("l2")).toBeUndefined();
      expect(screen.getByRole("status")).toHaveTextContent(
        "Move the canvas so Coat hook is in view, then save the view",
      );
    });

    it("shows a stop in its saved view when the stop is clicked", () => {
      seedWithCanvas(loci.map((locus) => (locus.id === "l3" ? { ...locus, view } : locus)));
      render(<RoutesPanel />);

      fireEvent.click(screen.getByRole("button", { name: "Kitchen sink" }));
      expect(store()).toMatchObject({ focusNodeId: "n3", focusView: view });
      fireEvent.click(screen.getByRole("button", { name: "Front door" }));
      expect(store()).toMatchObject({ focusNodeId: "n1", focusView: null });
    });

    it("cannot take a view without the canvas", () => {
      render(<RoutesPanel />);
      expect(screen.getByRole("button", { name: "Save the current view for stop 1, Front door" })).toBeDisabled();
    });
  });

  it("follows live node titles and flags stops whose node left the canvas", () => {
    const shape = {
      id: "shape:1",
      type: "geo",
      meta: { mpNodeId: "n1", mpTitle: "Front door (painted)" },
      props: {},
    };
    const editor = {
      getCurrentPageShapeIds: () => new Set([shape.id]),
      getShape: (id: string) => (id === shape.id ? shape : undefined),
    };
    seed({ editorRef: editor as never });
    render(<RoutesPanel />);

    expect(stopRows()).toEqual(["1Front door (painted)", "2Missing node", "3Missing nodedue"]);
  });
});
