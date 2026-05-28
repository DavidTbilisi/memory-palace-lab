import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDragResizable } from "./useDragResizable";

afterEach(() => {
  window.localStorage.clear();
});

function fakeMouseDown(clientX: number, parentWidth: number) {
  const parent = { clientWidth: parentWidth } as HTMLElement;
  return {
    preventDefault: () => undefined,
    clientX,
    currentTarget: { parentElement: parent } as unknown as EventTarget & HTMLElement,
  } as unknown as React.MouseEvent;
}

describe("useDragResizable", () => {
  it("uses the lazy initial ratio", () => {
    const { result } = renderHook(() => useDragResizable({ getInitialRatio: () => 0.3 }));
    expect(result.current.ratio).toBe(0.3);
  });

  it("persists the ratio to localStorage when a storageKey is given", () => {
    const { result } = renderHook(() => useDragResizable({ getInitialRatio: () => 0.4, storageKey: "mp-split" }));
    expect(window.localStorage.getItem("mp-split")).toBe("0.4");
    act(() => result.current.setRatio(0.6));
    expect(window.localStorage.getItem("mp-split")).toBe("0.6");
  });

  it("updates the ratio as the separator is dragged, clamped to bounds", () => {
    const { result } = renderHook(() => useDragResizable({ getInitialRatio: () => 0.5, min: 0.15, max: 0.85 }));
    act(() => {
      result.current.onSeparatorMouseDown(fakeMouseDown(100, 1000));
    });
    // drag right by 200px over a 1000px container => +0.2 => 0.7
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 300 }));
    });
    expect(result.current.ratio).toBeCloseTo(0.7, 5);
    // drag far right => clamps to max 0.85
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 5000 }));
    });
    expect(result.current.ratio).toBe(0.85);
    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });
  });

  it("stops responding to mousemove after mouseup", () => {
    const { result } = renderHook(() => useDragResizable({ getInitialRatio: () => 0.5 }));
    act(() => result.current.onSeparatorMouseDown(fakeMouseDown(100, 1000)));
    act(() => window.dispatchEvent(new MouseEvent("mouseup")));
    act(() => window.dispatchEvent(new MouseEvent("mousemove", { clientX: 900 })));
    expect(result.current.ratio).toBe(0.5);
  });
});
