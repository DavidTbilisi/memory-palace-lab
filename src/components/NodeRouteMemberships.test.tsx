import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { Locus, MemoryNode, MemoryRoute, Palace } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { NodeRouteMemberships } from "./NodeRouteMemberships";

const palace: Palace = { id: "palace-1", name: "House", alias: null, atlasPath: null, editorSnapshot: null };
const routes: MemoryRoute[] = [
  { id: "route-a", palaceId: "palace-1", name: "Morning walk" },
  { id: "route-b", palaceId: "palace-1", name: "Evening review" },
  { id: "route-c", palaceId: "palace-1", name: "Loop" },
];
const nodes: MemoryNode[] = [
  { id: "n1", objectId: "o1", title: "Front door", content: "", kind: "memory", portal: null },
  { id: "n2", objectId: "o2", title: "Kitchen", content: "", kind: "memory", portal: null },
];
const loci: Locus[] = [
  { id: "l1", routeId: "route-a", nodeId: "n2", orderIndex: 0, label: "" },
  { id: "l2", routeId: "route-a", nodeId: "n1", orderIndex: 1, label: "" },
  { id: "l3", routeId: "route-c", nodeId: "n1", orderIndex: 0, label: "" },
  { id: "l4", routeId: "route-c", nodeId: "n1", orderIndex: 1, label: "" },
];

const store = () => usePalaceStore.getState();

beforeEach(() => {
  act(() => {
    store().hydrateFromSnapshot({ palace, canvasObjects: [], nodes, edges: [], routes, loci });
    usePalaceStore.setState({ editorRef: null, routePanelOpen: false, walkRouteId: "route-b", routeNotice: null });
  });
});

describe("NodeRouteMemberships", () => {
  it("lists the routes a node is on with its stop numbers", () => {
    render(<NodeRouteMemberships nodeId="n1" />);
    expect(screen.getByRole("button", { name: /Morning walk/ })).toHaveTextContent("Morning walkstop 2");
    expect(screen.getByRole("button", { name: /Loop/ })).toHaveTextContent("Loopstops 1, 2");
    expect(screen.queryByRole("button", { name: /Evening review/ })).toBeNull();
  });

  it("says so when the node is on no route", () => {
    render(<NodeRouteMemberships nodeId="n9" />);
    expect(screen.getByText("Not a stop on any route yet.")).toBeInTheDocument();
  });

  it("opens a route in the Routes tab", () => {
    render(<NodeRouteMemberships nodeId="n1" />);
    fireEvent.click(screen.getByRole("button", { name: /Loop/ }));
    expect(store().walkRouteId).toBe("route-c");
    expect(store().routePanelOpen).toBe(true);
  });

  it("does not switch the walked route mid-walk", () => {
    act(() => store().setWalkOpen(true));
    render(<NodeRouteMemberships nodeId="n1" />);
    fireEvent.click(screen.getByRole("button", { name: /Loop/ }));
    expect(store().walkRouteId).toBe("route-b");
    expect(store().walkOpen).toBe(true);
    expect(store().routePanelOpen).toBe(true);
  });

  it("adds the node to another route without changing the active route", async () => {
    const user = userEvent.setup();
    render(<NodeRouteMemberships nodeId="n1" />);
    await user.click(screen.getByRole("button", { name: "Add to route" }));
    expect(await screen.findByRole("menuitem", { name: /Morning walk/ })).toHaveAttribute("data-disabled");
    await user.click(screen.getByRole("menuitem", { name: /Evening review/ }));

    expect(store().loci.filter((locus) => locus.routeId === "route-b").map((locus) => locus.nodeId)).toEqual(["n1"]);
    expect(store().walkRouteId).toBe("route-b");
    expect(store().routeNotice?.message).toBe("Added Front door as stop 1");
  });

  it("starts a new route at the node", async () => {
    const user = userEvent.setup();
    render(<NodeRouteMemberships nodeId="n2" />);
    await user.click(screen.getByRole("button", { name: "Add to route" }));
    await user.click(await screen.findByRole("menuitem", { name: "New route starting here" }));

    const created = store().routes[3]!;
    expect(created.name).toBe("Route 1");
    expect(store().walkRouteId).toBe(created.id);
    expect(store().loci.filter((locus) => locus.routeId === created.id).map((locus) => locus.nodeId)).toEqual(["n2"]);
  });
});
