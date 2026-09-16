import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Palace } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { RouteBuildBanner } from "./RouteBuildBanner";

const palace: Palace = { id: "palace-1", name: "House", alias: null, atlasPath: null, editorSnapshot: null };

beforeEach(() => {
  act(() => {
    usePalaceStore.getState().hydrateFromSnapshot({
      palace,
      canvasObjects: [],
      nodes: [],
      edges: [],
      routes: [{ id: "r1", palaceId: "palace-1", name: "Morning walk" }],
      loci: [],
    });
    usePalaceStore.setState({
      editorRef: null,
      toolMode: "route",
      walkRouteId: "r1",
      routeNotice: null,
      saveStopViews: true,
    });
  });
});

describe("RouteBuildBanner", () => {
  it("tells the user what Route mode does", () => {
    render(<RouteBuildBanner />);
    expect(screen.getByRole("status")).toHaveTextContent("Click nodes in walk order to build Morning walk.");
  });

  it("saves the view with each stop until that is turned off", () => {
    render(<RouteBuildBanner />);
    const toggle = screen.getByRole("button", { name: "Save the view with each stop" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Each stop saves your current view.");

    fireEvent.click(toggle);
    expect(usePalaceStore.getState().saveStopViews).toBe(false);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Double-click empty space to add a new node.");

    act(() =>
      usePalaceStore.setState({
        saveStopViews: true,
        loci: [{ id: "l1", routeId: "r1", nodeId: "n1", orderIndex: 0, label: "" }],
      }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Morning walk: 1 stop. Zoom and pan as needed, then click the next node.",
    );
  });

  it("shows the latest route message instead", () => {
    act(() => usePalaceStore.getState().showRouteNotice("Added Front door as stop 1"));
    render(<RouteBuildBanner />);
    expect(screen.getByRole("status")).toHaveTextContent("Added Front door as stop 1");
  });

  it("ends Route mode with Done or Escape", () => {
    const { unmount } = render(<RouteBuildBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(usePalaceStore.getState().toolMode).toBe("select");
    expect(screen.queryByTestId("route-build-banner")).toBeNull();
    unmount();

    act(() => usePalaceStore.setState({ toolMode: "route" }));
    render(<RouteBuildBanner />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(usePalaceStore.getState().toolMode).toBe("select");
  });

  it("ignores Escape while typing", () => {
    render(
      <>
        <input aria-label="Somewhere" />
        <RouteBuildBanner />
      </>,
    );
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Somewhere" }), { key: "Escape" });
    expect(usePalaceStore.getState().toolMode).toBe("route");
  });

  it("leaves Escape to an open menu", () => {
    render(
      <>
        <div role="menu">
          <button type="button">Rose</button>
        </div>
        <RouteBuildBanner />
      </>,
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Rose" }), { key: "Escape" });
    expect(usePalaceStore.getState().toolMode).toBe("route");
  });

  it("stays hidden outside Route mode and during a walk", () => {
    act(() => usePalaceStore.setState({ toolMode: "select" }));
    const { rerender } = render(<RouteBuildBanner />);
    expect(screen.queryByTestId("route-build-banner")).toBeNull();

    act(() => usePalaceStore.setState({ toolMode: "route", walkOpen: true }));
    rerender(<RouteBuildBanner />);
    expect(screen.queryByTestId("route-build-banner")).toBeNull();
  });
});
