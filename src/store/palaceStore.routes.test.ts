/**
 * Route-building actions on palaceStore. Like the walk tests, these drive the store directly;
 * with no editor mounted, node titles resolve from the snapshot `nodes` list.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Locus, MemoryNode, MemoryRoute, Palace } from "../domain/entities/types";
import { usePalaceStore } from "./palaceStore";
import { loadSaveStopViews } from "./palaceStoreHelpers";

const palace: Palace = { id: "palace-1", name: "Test Palace", alias: null, atlasPath: null, editorSnapshot: null };

const routes: MemoryRoute[] = [
  { id: "route-a", palaceId: "palace-1", name: "Route A" },
  { id: "route-b", palaceId: "palace-1", name: "Route B", color: "rose" },
];

const loci: Locus[] = [
  { id: "l1", routeId: "route-a", nodeId: "n1", orderIndex: 0, label: "" },
  { id: "l2", routeId: "route-a", nodeId: "n2", orderIndex: 1, label: "" },
  { id: "l3", routeId: "route-a", nodeId: "n3", orderIndex: 2, label: "" },
  { id: "l4", routeId: "route-b", nodeId: "n4", orderIndex: 0, label: "" },
];

const nodes: MemoryNode[] = ["n1", "n2", "n3", "n4", "n5", "n6"].map((id, index) => ({
  id,
  objectId: `o${index}`,
  title: `Node ${index + 1}`,
  content: "",
  kind: "memory" as const,
  portal: null,
}));

const store = () => usePalaceStore.getState();
const stopIds = (routeId: string) =>
  store()
    .loci.filter((locus) => locus.routeId === routeId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((locus) => locus.id);
const stopNodes = (routeId: string) =>
  store()
    .loci.filter((locus) => locus.routeId === routeId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((locus) => locus.nodeId);

function reset(overrides: Partial<ReturnType<typeof usePalaceStore.getState>> = {}) {
  // hydrate clears the store's undo buffers between tests
  store().hydrateFromSnapshot({ palace, canvasObjects: [], nodes, edges: [], routes, loci });
  usePalaceStore.setState({
    palaces: [palace],
    editorRef: null,
    analyticsEvents: [],
    toolMode: "select",
    routePanelOpen: false,
    routeNotice: null,
    walkRouteId: "route-a",
    walkRecallMode: false,
    saveStopViews: true,
    ...overrides,
  });
}

beforeEach(() => reset());

describe("createRoute", () => {
  it("adds a uniquely named, colored route and makes it active", () => {
    usePalaceStore.setState({ routes: [...routes, { id: "r3", palaceId: "palace-1", name: "Route 1" }] });
    const id = store().createRoute();

    const created = store().routes.find((route) => route.id === id)!;
    expect(created.name).toBe("Route 2");
    // violet (Route A by position), rose, and emerald (Route 1 by position) are taken
    expect(created.color).toBe("sky");
    expect(store().walkRouteId).toBe(id);
    expect(store().routePanelOpen).toBe(true);
    expect(store().toolMode).toBe("select");
  });

  it("suffixes a requested name that is taken and can start Route mode", () => {
    const id = store().createRoute({ name: "route a", startBuilding: true });

    expect(store().routes.find((route) => route.id === id)!.name).toBe("route a (2)");
    expect(store().toolMode).toBe("route");
  });

  it("closes a running walk before switching to the new route", () => {
    store().setWalkOpen(true);
    const id = store().createRoute();

    expect(store().walkOpen).toBe(false);
    expect(store().walkRouteId).toBe(id);
  });

  it("does nothing without an open palace", () => {
    usePalaceStore.setState({ currentPalace: null });
    expect(store().createRoute()).toBeNull();
  });
});

describe("setRouteBuilding", () => {
  it("creates a first route when the palace has none", () => {
    usePalaceStore.setState({ routes: [], loci: [], walkRouteId: null });
    store().setRouteBuilding(true);

    expect(store().routes.map((route) => route.name)).toEqual(["Route 1"]);
    expect(store().walkRouteId).toBe(store().routes[0]!.id);
    expect(store().toolMode).toBe("route");
    expect(store().routePanelOpen).toBe(true);

    store().setRouteBuilding(false);
    expect(store().toolMode).toBe("select");
  });

  it("pins the implicit first route as active", () => {
    usePalaceStore.setState({ walkRouteId: null });
    store().setRouteBuilding(true);
    expect(store().walkRouteId).toBe("route-a");
  });

  it("leaves other tool modes alone when turned off", () => {
    usePalaceStore.setState({ toolMode: "connect" });
    store().setRouteBuilding(false);
    expect(store().toolMode).toBe("connect");
  });
});

describe("addStopsToActiveRoute", () => {
  it("appends a node and names its stop number", () => {
    store().addStopsToActiveRoute(["n5"]);

    expect(stopNodes("route-a")).toEqual(["n1", "n2", "n3", "n5"]);
    expect(store().routeNotice).toMatchObject({ message: "Added Node 5 as stop 4", canUndo: false });
  });

  it("refuses a node the route already visits", () => {
    store().addStopsToActiveRoute(["n2"]);

    expect(stopNodes("route-a")).toEqual(["n1", "n2", "n3"]);
    expect(store().routeNotice?.message).toBe("Node 2 is already stop 2");
  });

  it("reports a batch, counting the skipped nodes", () => {
    store().addStopsToActiveRoute(["n5", "n1", "n6"]);

    expect(stopNodes("route-a")).toEqual(["n1", "n2", "n3", "n5", "n6"]);
    expect(store().routeNotice?.message).toBe("Added 2 stops, skipped 1 already in this route");
  });

  it("adds to the active route only", () => {
    usePalaceStore.setState({ walkRouteId: "route-b" });
    store().addStopsToActiveRoute(["n1"]);

    expect(stopNodes("route-b")).toEqual(["n4", "n1"]);
    expect(stopNodes("route-a")).toEqual(["n1", "n2", "n3"]);
  });
});

describe("moveStop", () => {
  it("moves a stop to a new position", () => {
    store().moveStop("l1", 2);
    expect(stopIds("route-a")).toEqual(["l2", "l3", "l1"]);
  });
});

describe("removeStop and undo", () => {
  it("removes a stop and puts it back on undo", () => {
    store().removeStop("l2");
    expect(stopIds("route-a")).toEqual(["l1", "l3"]);
    expect(store().routeNotice).toMatchObject({ message: "Removed Node 2 (stop 2)", canUndo: true });

    store().undoRouteChange();
    expect(stopIds("route-a")).toEqual(["l1", "l2", "l3"]);
    expect(store().routeNotice).toBeNull();
  });

  it("forgets the undo once the notice is dismissed or replaced", () => {
    store().removeStop("l2");
    store().dismissRouteNotice();
    store().undoRouteChange();
    expect(stopIds("route-a")).toEqual(["l1", "l3"]);

    store().removeStop("l1");
    store().addStopsToActiveRoute(["n5"]);
    store().undoRouteChange();
    expect(stopIds("route-a")).not.toContain("l1");
  });

  it("keeps the walk position inside the shortened route", () => {
    usePalaceStore.setState({ walkIndex: 2 });
    store().removeStop("l3");
    expect(store().walkIndex).toBe(1);
  });
});

describe("stop views", () => {
  const view = { x: -300, y: -200, w: 600, h: 400 };
  const wideView = { x: -800, y: -500, w: 1600, h: 1000 };
  const stop = (id: string) => store().loci.find((locus) => locus.id === id);

  it("gives a clicked stop the view it was added in", () => {
    const viewFor = vi.fn(() => view);
    store().addStopsToActiveRoute(["n5"], { viewFor });

    expect(viewFor).toHaveBeenCalledWith("n5");
    expect(store().loci.find((locus) => locus.nodeId === "n5")?.view).toEqual(view);
    expect(store().routeNotice?.message).toBe("Added Node 5 as stop 4 with this view");
  });

  it("adds the stop without a view when none could be taken", () => {
    store().addStopsToActiveRoute(["n5"], { viewFor: () => null });

    expect(store().loci.find((locus) => locus.nodeId === "n5")).not.toHaveProperty("view");
    expect(store().routeNotice?.message).toBe("Added Node 5 as stop 4");
  });

  it("saves, replaces, and removes a stop's view, each with an undo", () => {
    store().setStopView("l2", view);
    expect(stop("l2")?.view).toEqual(view);
    expect(store().routeNotice).toMatchObject({ message: "Saved the view for stop 2", canUndo: true });

    store().setStopView("l2", wideView);
    expect(store().routeNotice?.message).toBe("Replaced the view of stop 2");
    store().undoRouteChange();
    expect(stop("l2")?.view).toEqual(view);

    store().setStopView("l2", null);
    expect(stop("l2")).not.toHaveProperty("view");
    expect(store().routeNotice?.message).toBe("Removed the saved view of stop 2");
    store().undoRouteChange();
    expect(stop("l2")?.view).toEqual(view);

    store().setStopView("l2", null);
    store().dismissRouteNotice();
    store().undoRouteChange();
    expect(stop("l2")).not.toHaveProperty("view");
  });

  it("asks the canvas to show a stop in its saved view, if it has one", () => {
    store().setStopView("l3", view);
    store().focusStop("l3");
    expect(store()).toMatchObject({ focusNodeId: "n3", focusView: view });

    store().setFocusNodeId(null);
    expect(store()).toMatchObject({ focusNodeId: null, focusView: null });

    store().focusStop("l1");
    expect(store()).toMatchObject({ focusNodeId: "n1", focusView: null });
  });

  it("walks from the current stop, view included", () => {
    store().setStopView("l2", view);
    store().setWalkOpen(true);
    store().walkNext();

    expect(store().currentWalkStop()).toMatchObject({ id: "l2", view });
    expect(store().currentWalkNodeId()).toBe("n2");
  });

  it("remembers whether Route mode saves views", () => {
    store().setSaveStopViews(false);
    expect(store().saveStopViews).toBe(false);
    expect(loadSaveStopViews()).toBe(false);

    store().setSaveStopViews(true);
    expect(loadSaveStopViews()).toBe(true);
  });
});

describe("route settings", () => {
  it("sets color and visibility", () => {
    store().setRouteColor("route-a", "cyan");
    store().setRouteHidden("route-b", true);

    expect(store().routes).toEqual([
      { id: "route-a", palaceId: "palace-1", name: "Route A", color: "cyan" },
      { id: "route-b", palaceId: "palace-1", name: "Route B", color: "rose", hidden: true },
    ]);
  });

  it("keeps route names unique on rename", () => {
    store().updateRouteName("route-b", "Route A");
    expect(store().routes[1]!.name).toBe("Route A (2)");
    store().updateRouteName("route-a", "Route A");
    expect(store().routes[0]!.name).toBe("Route A");
  });

  it("moves a route to a new place in the list", () => {
    usePalaceStore.setState({ routes: [...routes, { id: "route-c", palaceId: "palace-1", name: "C" }] });
    store().moveRouteTo("route-c", 0);
    expect(store().routes.map((route) => route.id)).toEqual(["route-c", "route-a", "route-b"]);
  });
});

describe("deleteRoute", () => {
  it("activates the neighbour and ends Route mode when the active route goes", () => {
    usePalaceStore.setState({ toolMode: "route" });
    store().deleteRoute("route-a");

    expect(store().routes.map((route) => route.id)).toEqual(["route-b"]);
    expect(store().loci.map((locus) => locus.id)).toEqual(["l4"]);
    expect(store().walkRouteId).toBe("route-b");
    expect(store().toolMode).toBe("select");
  });

  it("keeps the active route when another one is deleted", () => {
    usePalaceStore.setState({ toolMode: "route" });
    store().deleteRoute("route-b");

    expect(store().walkRouteId).toBe("route-a");
    expect(store().toolMode).toBe("route");
  });
});

describe("stops of deleted nodes", () => {
  it("detaches them and restores them when the node comes back", () => {
    store().addStopsToActiveRoute(["n4"]);
    store().detachStopsForNodes(["n2", "n4"]);

    expect(stopNodes("route-a")).toEqual(["n1", "n3"]);
    expect(stopNodes("route-b")).toEqual([]);

    store().reattachStopsForNodes(["n4"]);
    expect(stopNodes("route-a")).toEqual(["n1", "n3", "n4"]);
    expect(stopNodes("route-b")).toEqual(["n4"]);

    store().reattachStopsForNodes(["n2"]);
    expect(stopNodes("route-a")).toEqual(["n1", "n2", "n3", "n4"]);

    store().reattachStopsForNodes(["n2"]);
    expect(stopNodes("route-a")).toEqual(["n1", "n2", "n3", "n4"]);
  });

  it("does not restore stops into a route deleted in between", () => {
    store().detachStopsForNodes(["n4"]);
    store().deleteRoute("route-b");
    store().reattachStopsForNodes(["n4"]);
    expect(store().loci.some((locus) => locus.nodeId === "n4")).toBe(false);
  });
});

describe("replaceRoutesAndLoci", () => {
  it("keeps the active route when it still exists", () => {
    usePalaceStore.setState({ walkRouteId: "route-b" });
    store().replaceRoutesAndLoci(routes, loci);
    expect(store().walkRouteId).toBe("route-b");
  });

  it("falls back to the first route when the active one is gone", () => {
    usePalaceStore.setState({ walkRouteId: "route-b" });
    store().replaceRoutesAndLoci([routes[0]!], loci.slice(0, 3));
    expect(store().walkRouteId).toBe("route-a");
  });

  it("leaves a walk running when its stops are unchanged", () => {
    store().setWalkOpen(true);
    store().walkNext();
    const sessionId = store().walkSessionId;

    store().replaceRoutesAndLoci(
      [...routes, { id: "route-new", palaceId: "palace-1", name: "New" }],
      loci.map((locus) => ({ ...locus })),
    );

    expect(store().walkOpen).toBe(true);
    expect(store().walkIndex).toBe(1);
    expect(store().walkSessionId).toBe(sessionId);
  });

  it("closes a walk whose stops changed", () => {
    store().setWalkOpen(true);
    const swapped = [{ ...loci[1]!, orderIndex: 0 }, { ...loci[0]!, orderIndex: 1 }, loci[2]!, loci[3]!];
    store().replaceRoutesAndLoci(routes, swapped);

    expect(store().walkOpen).toBe(false);
    expect(store().walkRouteId).toBe("route-a");
  });
});

describe("rateWalkRecall", () => {
  it("records the last rating of a walk with its session", async () => {
    usePalaceStore.setState({ walkRouteId: "route-b" });
    store().setWalkOpen(true);
    const sessionId = store().walkSessionId;
    expect(sessionId).not.toBeNull();

    store().rateWalkRecall("good");

    expect(store().walkOpen).toBe(false);
    await vi.waitFor(() => {
      const rated = store().analyticsEvents.find((event) => event.eventType === "walk_recall_rated");
      expect(rated?.sessionId).toBe(sessionId);
    });
  });
});
