import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DslApplyResult, DslSnapshot } from "../domain/services/palaceDsl/types";
import { useDslSync } from "./useDslSync";

const EMPTY_RESULT: DslApplyResult = {
  added: { nodes: 0, edges: 0, routes: 0, loci: 0 },
  updated: { nodes: 0, edges: 0, routes: 0, loci: 0 },
  deleted: { nodes: 0, edges: 0, routes: 0, loci: 0 },
  errors: [],
};

describe("useDslSync", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("debounces and applies a parsed snapshot after 200ms", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    const { result } = renderHook(() => useDslSync(apply));

    act(() => result.current.onChange("# Palace: Demo\n"));
    expect(apply).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(apply).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply.mock.calls[0]![0].palaceName).toBe("Demo");
  });

  it("coalesces rapid edits into a single apply", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    const { result } = renderHook(() => useDslSync(apply));

    act(() => result.current.onChange("# Palace: A\n"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => result.current.onChange("# Palace: B\n"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => result.current.onChange("# Palace: C\n"));
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply.mock.calls[0]![0].palaceName).toBe("C");
  });

  it("does not apply when the parse has errors", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    const { result } = renderHook(() => useDslSync(apply));

    act(() => result.current.onChange("no header here\n"));
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(apply).not.toHaveBeenCalled();
    expect(result.current.diagnostics.some((d) => d.code === "missing-palace-header")).toBe(true);
  });
});
