import { afterEach, describe, expect, it } from "vitest";
import type { MemoryNode } from "../domain/entities/types";
import {
  DSL_SPLIT_RATIO_STORAGE_KEY,
  loadRecentIds,
  loadSplitRatio,
  pageHint,
  routeNamesByNodeId,
  toPlainText,
} from "./memoryPalaceAppHelpers";

afterEach(() => {
  window.localStorage.clear();
});

describe("loadSplitRatio", () => {
  it("defaults to 0.4 when unset", () => {
    expect(loadSplitRatio()).toBe(0.4);
  });

  it("returns a persisted value inside the open range", () => {
    window.localStorage.setItem(DSL_SPLIT_RATIO_STORAGE_KEY, "0.55");
    expect(loadSplitRatio()).toBe(0.55);
  });

  it("rejects out-of-range or non-numeric values", () => {
    window.localStorage.setItem(DSL_SPLIT_RATIO_STORAGE_KEY, "0.95");
    expect(loadSplitRatio()).toBe(0.4);
    window.localStorage.setItem(DSL_SPLIT_RATIO_STORAGE_KEY, "nonsense");
    expect(loadSplitRatio()).toBe(0.4);
  });
});

describe("loadRecentIds", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(loadRecentIds("mp-x")).toEqual([]);
  });

  it("parses a stored string array and caps the length", () => {
    window.localStorage.setItem("mp-x", JSON.stringify(["a", "b", "c"]));
    expect(loadRecentIds("mp-x", 2)).toEqual(["a", "b"]);
  });

  it("drops non-string entries and tolerates malformed JSON", () => {
    window.localStorage.setItem("mp-x", JSON.stringify(["a", 1, null, "b"]));
    expect(loadRecentIds("mp-x")).toEqual(["a", "b"]);
    window.localStorage.setItem("mp-y", "{not json");
    expect(loadRecentIds("mp-y")).toEqual([]);
  });
});

describe("toPlainText", () => {
  it("strips tags and collapses whitespace", () => {
    expect(toPlainText("<p>Hello   <b>world</b></p>")).toBe("Hello world");
    expect(toPlainText("  spaced \n out  ")).toBe("spaced out");
  });
});

describe("pageHint", () => {
  it("returns null for the graph page and a hint for others", () => {
    expect(pageHint("graph")).toBeNull();
    expect(pageHint("review")).toMatch(/attention queue/);
    expect(pageHint("insights")).toMatch(/telemetry/);
    expect(pageHint("atlas")).toMatch(/geography/);
  });
});

describe("routeNamesByNodeId", () => {
  const node = (id: string): MemoryNode => ({ id, title: id }) as MemoryNode;

  it("summarizes the routes that visit each node", () => {
    const result = routeNamesByNodeId(
      [node("n1"), node("n2")],
      [
        { id: "r1", name: "Tour A" },
        { id: "r2", name: "Tour B" },
      ],
      [
        { routeId: "r1", nodeId: "n1" },
        { routeId: "r2", nodeId: "n1" },
      ],
    );
    expect(result[0].routeSummary).toBe("Tour A, Tour B");
    expect(result[1].routeSummary).toBe("No route");
  });

  it("ignores loci that reference unknown routes", () => {
    const result = routeNamesByNodeId([node("n1")], [], [{ routeId: "ghost", nodeId: "n1" }]);
    expect(result[0].routeSummary).toBe("No route");
  });
});
