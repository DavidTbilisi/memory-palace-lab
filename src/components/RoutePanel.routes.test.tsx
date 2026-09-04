import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../store/palaceStore", () => ({ usePalaceStore: vi.fn() }));
vi.mock("../utils/confirmDestructive", () => ({ confirmDestructive: vi.fn(async () => true) }));

import { usePalaceStore } from "../store/palaceStore";
import { confirmDestructive } from "../utils/confirmDestructive";
import { RoutePanel } from "./RoutePanel";

const moveRoute = vi.fn();
const deleteRoute = vi.fn();

function mockStore(walkRouteId: string | null) {
  const state = {
    routes: [
      { id: "r1", palaceId: "p", name: "First" },
      { id: "r2", palaceId: "p", name: "Second" },
    ],
    loci: [{ id: "l1", routeId: "r2", nodeId: "n1", orderIndex: 0, label: "L1" }],
    walkRouteId,
    walkOpen: false,
    walkIndex: 0,
    setWalkRoute: vi.fn(),
    addRoute: vi.fn(),
    addLocusForSelectedRoute: vi.fn(),
    updateRouteName: vi.fn(),
    moveRoute,
    deleteRoute,
    updateLocusLabel: vi.fn(),
    moveLocus: vi.fn(),
    deleteLocus: vi.fn(),
    reassignLocusRoute: vi.fn(),
    editorRef: null,
    selectedShapeId: null,
  };
  vi.mocked(usePalaceStore).mockImplementation(((selector: (s: unknown) => unknown) => selector(state)) as never);
}

describe("RoutePanel route-level actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("moves the active route and disables the impossible direction", async () => {
    const user = userEvent.setup();
    mockStore("r2");
    render(<RoutePanel />);
    expect(screen.getByRole("button", { name: "Move route down" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Move route up" }));
    expect(moveRoute).toHaveBeenCalledWith("r2", "up");
  });

  it("confirms before deleting the active route, mentioning its loci", async () => {
    const user = userEvent.setup();
    mockStore("r2");
    render(<RoutePanel />);
    await user.click(screen.getByRole("button", { name: "Delete route" }));
    expect(confirmDestructive).toHaveBeenCalledWith(expect.stringContaining('Delete route "Second" and its 1 loci'));
    expect(deleteRoute).toHaveBeenCalledWith("r2");
  });
});
