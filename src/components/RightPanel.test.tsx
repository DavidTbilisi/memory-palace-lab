import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePalaceStore } from "../store/palaceStore";
import { RightPanel } from "./RightPanel";

vi.mock("./NodeInspector", () => ({ NodeInspector: () => <div data-testid="node-inspector" /> }));
vi.mock("./RoutesPanel", () => ({ RoutesPanel: () => <div data-testid="routes-panel" /> }));

beforeEach(() => {
  act(() => {
    usePalaceStore.setState({
      routePanelOpen: false,
      routes: [
        { id: "r1", palaceId: "p", name: "One" },
        { id: "r2", palaceId: "p", name: "Two" },
      ],
    });
  });
});

describe("RightPanel", () => {
  it("switches between the node inspector and the Routes tab", () => {
    render(<RightPanel />);
    expect(screen.getByRole("tab", { name: "Node" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("node-inspector")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Routes/ }));
    expect(usePalaceStore.getState().routePanelOpen).toBe(true);
    expect(screen.getByRole("tab", { name: /Routes/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "side-tab-routes");
    expect(screen.getByTestId("routes-panel")).toBeInTheDocument();
  });

  it("shows the route count on the Routes tab", () => {
    render(<RightPanel />);
    expect(screen.getByRole("tab", { name: /Routes/ })).toHaveTextContent("Routes2");
  });

  it("moves between tabs with the arrow keys", () => {
    render(<RightPanel />);
    const nodeTab = screen.getByRole("tab", { name: "Node" });
    nodeTab.focus();
    fireEvent.keyDown(nodeTab, { key: "ArrowRight" });

    expect(usePalaceStore.getState().routePanelOpen).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /Routes/ }));

    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(usePalaceStore.getState().routePanelOpen).toBe(false);
    expect(document.activeElement).toBe(nodeTab);
  });
});
