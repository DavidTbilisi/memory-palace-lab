import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useOnboardingState } from "./useOnboardingState";

const KEY = "mp-learn-panel-open";

afterEach(() => {
  window.localStorage.clear();
});

describe("useOnboardingState", () => {
  it("defaults to open on a first-ever visit and persists that default", () => {
    const { result } = renderHook(() => useOnboardingState());
    expect(result.current[0]).toBe(true);
    expect(window.localStorage.getItem(KEY)).toBe("true");
  });

  it("honors a stored 'false' choice", () => {
    window.localStorage.setItem(KEY, "false");
    const { result } = renderHook(() => useOnboardingState());
    expect(result.current[0]).toBe(false);
  });

  it("persists changes to localStorage", () => {
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current[1](false));
    expect(result.current[0]).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBe("false");
  });
});
