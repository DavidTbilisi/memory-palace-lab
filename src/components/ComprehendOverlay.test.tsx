import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComprehendOverlay } from "./ComprehendOverlay";
import { usePalaceStore } from "../store/palaceStore";
import { useComprehendCrux, type ComprehendCrux } from "./hooks/useComprehendCrux";

vi.mock("./hooks/useComprehendCrux");

function mockCrux(value: ComprehendCrux) {
  vi.mocked(useComprehendCrux).mockReturnValue(value);
}

describe("ComprehendOverlay", () => {
  beforeEach(() => vi.clearAllMocks());

  it("names the crux and explains why it gates the structure", () => {
    mockCrux({
      crux: { nodeId: "n1", reason: "betweenness" },
      cruxTitle: "CAP theorem",
      nodeCount: 4,
      edgeCount: 3,
      motifTotal: 1,
    });
    render(<ComprehendOverlay />);
    expect(screen.getByText("CAP theorem")).toBeInTheDocument();
    expect(screen.getByText(/Most paths route through it/i)).toBeInTheDocument();
    expect(screen.getByText(/4 nodes · 3 edges · 1 motifs/)).toBeInTheDocument();
  });

  it("shows the empty state when there is no crux", () => {
    mockCrux({ crux: null, cruxTitle: null, nodeCount: 0, edgeCount: 0, motifTotal: 0 });
    render(<ComprehendOverlay />);
    expect(screen.getByText(/No clear crux yet/i)).toBeInTheDocument();
  });

  it("'Encode this' returns to encode mode and queues the crux for canvas focus", async () => {
    usePalaceStore.setState({ appMode: "comprehend", comprehendCruxNodeId: "n1", focusNodeId: null });
    mockCrux({
      crux: { nodeId: "n1", reason: "betweenness" },
      cruxTitle: "CAP theorem",
      nodeCount: 4,
      edgeCount: 3,
      motifTotal: 1,
    });
    const user = userEvent.setup();
    render(<ComprehendOverlay />);
    await user.click(screen.getByRole("button", { name: /Encode this/i }));

    const s = usePalaceStore.getState();
    expect(s.appMode).toBe("encode");
    expect(s.focusNodeId).toBe("n1");
  });

  it("uses the reason-specific copy for a bridge crux", () => {
    mockCrux({
      crux: { nodeId: "n2", reason: "bridge" },
      cruxTitle: "Adapter",
      nodeCount: 6,
      edgeCount: 5,
      motifTotal: 0,
    });
    render(<ComprehendOverlay />);
    expect(screen.getByText(/single link between otherwise separate clusters/i)).toBeInTheDocument();
  });
});
