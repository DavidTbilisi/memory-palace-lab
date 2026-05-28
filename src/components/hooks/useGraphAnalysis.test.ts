import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGraphAnalysis } from "./useGraphAnalysis";

const palace = { id: "p1", name: "Test Palace" };

describe("useGraphAnalysis", () => {
  it("reports an empty graph", () => {
    const { result } = renderHook(() => useGraphAnalysis([], [], palace));
    expect(result.current.analysis.nodeCount).toBe(0);
    expect(result.current.motifTotal).toBe(0);
    expect(result.current.topHubs).toEqual([]);
  });

  it("maps node titles, defaulting blanks to Untitled", () => {
    const { result } = renderHook(() =>
      useGraphAnalysis([{ id: "a", title: "Atrium" }, { id: "b", title: "" }], [], palace),
    );
    expect(result.current.nodeTitleById.get("a")).toBe("Atrium");
    expect(result.current.nodeTitleById.get("b")).toBe("Untitled");
  });

  it("detects a hub-spoke motif and produces a signature", () => {
    const nodes = [{ id: "h" }, { id: "s1" }, { id: "s2" }, { id: "s3" }];
    const edges = [
      { sourceNodeId: "h", targetNodeId: "s1" },
      { sourceNodeId: "h", targetNodeId: "s2" },
      { sourceNodeId: "h", targetNodeId: "s3" },
    ];
    const { result } = renderHook(() => useGraphAnalysis(nodes, edges, palace));
    expect(result.current.analysis.nodeCount).toBe(4);
    expect(result.current.motifTotal).toBeGreaterThan(0);
    expect(result.current.currentSignature).not.toBeNull();
    expect(result.current.currentSignature?.palaceId).toBe("p1");
  });

  it("returns a null signature when there is no current palace", () => {
    const { result } = renderHook(() => useGraphAnalysis([{ id: "a" }], [], null));
    expect(result.current.currentSignature).toBeNull();
  });
});
