import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

function fixture(name: string) {
  return readFileSync(
    resolve(__dirname, "../domain/services/palaceDsl/fixtures", name),
    "utf8",
  );
}

describe("useDslSync", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("debounces and applies a parsed snapshot after 200ms", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    const { result } = renderHook(() => useDslSync(apply));

    act(() => result.current.onChange("@Demo\n"));
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

    act(() => result.current.onChange("@A\n"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => result.current.onChange("@B\n"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => result.current.onChange("@C\n"));
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

  it("applies the SOLID fixture with no diagnostics and preserves its full structure", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    const { result } = renderHook(() => useDslSync(apply));

    act(() => result.current.onChange(fixture("solid-citadel.dsl")));
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(apply).toHaveBeenCalledTimes(1);
    expect(result.current.diagnostics).toEqual([]);

    const snapshot = apply.mock.calls[0]![0];
    expect(snapshot.palaceName).toBe("SOLID Citadel");
    expect(snapshot.nodes).toHaveLength(14);
    expect(snapshot.routes.map((route) => route.name)).toEqual([
      "SOLID Main Route",
      "Violation Route",
    ]);

    expect(snapshot.routes.map((route) => route.loci.length)).toEqual([7, 5]);
    expect(snapshot.nodes.find((node) => node.title === "Gate of SOLID")?.edges).toHaveLength(5);
    expect(snapshot.nodes.find((node) => node.title === "Dependency Tower")?.edges).toHaveLength(2);
  });

  it("rejects a malformed SOLID paste with misplaced lines instead of partially applying it", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    const { result } = renderHook(() => useDslSync(apply));
    const malformed = [
      "@SOLID Citadel",
      "",
      ": content before any node",
      "#orphan-tag",
      ">Orphan Edge",
    ].join("\n");

    act(() => result.current.onChange(malformed));
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(apply).not.toHaveBeenCalled();
    expect(result.current.diagnostics.some((d) => d.code === "misplaced-line")).toBe(true);
  });
});
