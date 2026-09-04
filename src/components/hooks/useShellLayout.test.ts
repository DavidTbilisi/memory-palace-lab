import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SHELL_LAYOUT_STORAGE_KEY, loadShellLayout, useShellLayout } from "./useShellLayout";

describe("useShellLayout", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to the graph page with both panels open", () => {
    const { result } = renderHook(() => useShellLayout());
    expect(result.current.currentPage).toBe("graph");
    expect(result.current.viewMode).toBe("balanced");
    expect(result.current.showSidebar).toBe(true);
    expect(result.current.showInspector).toBe(true);
  });

  it("persists page and panel changes and restores them", () => {
    const { result } = renderHook(() => useShellLayout());
    act(() => {
      result.current.setCurrentPage("insights");
      result.current.setShowSidebar(false);
      result.current.setShowInspector((prev) => !prev);
    });
    const stored = JSON.parse(window.localStorage.getItem(SHELL_LAYOUT_STORAGE_KEY) ?? "{}") as Record<
      string,
      unknown
    >;
    expect(stored.currentPage).toBe("insights");
    expect(stored.showSidebar).toBe(false);
    expect(stored.showInspector).toBe(false);

    const restored = loadShellLayout();
    expect(restored.currentPage).toBe("insights");
    expect(restored.showSidebar).toBe(false);
    expect(restored.showInspector).toBe(false);
  });

  it("applies the focus preset by hiding both panels", () => {
    const { result } = renderHook(() => useShellLayout());
    act(() => result.current.applyViewMode("focus"));
    expect(result.current.viewMode).toBe("focus");
    expect(result.current.showSidebar).toBe(false);
    expect(result.current.showInspector).toBe(false);
    act(() => result.current.applyViewMode("balanced"));
    expect(result.current.showSidebar).toBe(true);
  });

  it("falls back to graph for unknown or malformed stored pages", () => {
    window.localStorage.setItem(SHELL_LAYOUT_STORAGE_KEY, JSON.stringify({ currentPage: "gone", viewMode: "wat" }));
    expect(loadShellLayout().currentPage).toBe("graph");
    expect(loadShellLayout().viewMode).toBe("balanced");
    window.localStorage.setItem(SHELL_LAYOUT_STORAGE_KEY, "{not json");
    expect(loadShellLayout().currentPage).toBe("graph");
  });
});
