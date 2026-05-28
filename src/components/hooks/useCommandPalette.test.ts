import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MemoryNode, Palace } from "../../domain/entities/types";
import { useCommandPalette } from "./useCommandPalette";

const palace: Palace = { id: "p1", name: "Test Palace", createdAt: "2026-01-01T00:00:00.000Z" };

function node(id: string, title: string): MemoryNode {
  return { id, title } as MemoryNode;
}

function baseInputs(overrides: Partial<Parameters<typeof useCommandPalette>[0]> = {}) {
  return {
    currentPalace: palace,
    nodes: [] as MemoryNode[],
    routes: [],
    loci: [],
    palaces: [palace],
    onFocusNode: vi.fn(),
    ...overrides,
  };
}

afterEach(() => {
  window.localStorage.clear();
});

describe("useCommandPalette", () => {
  it("starts closed with no node commands", () => {
    const { result } = renderHook(() => useCommandPalette(baseInputs()));
    expect(result.current.commandOpen).toBe(false);
    expect(result.current.nodeCommands).toEqual([]);
  });

  it("tracks and persists recent command ids, de-duplicating and capping", () => {
    const { result } = renderHook(() => useCommandPalette(baseInputs()));
    act(() => result.current.trackCommandRun("a"));
    act(() => result.current.trackCommandRun("b"));
    act(() => result.current.trackCommandRun("a"));
    expect(result.current.recentCommandIds).toEqual(["a", "b"]);
    expect(JSON.parse(window.localStorage.getItem("mp-recent-command-ids")!)).toEqual(["a", "b"]);
  });

  it("builds node commands from the current palace when opened", async () => {
    const onFocusNode = vi.fn();
    const inputs = baseInputs({
      nodes: [node("n1", "Front Door"), node("n2", "Kitchen")],
      onFocusNode,
    });
    const { result } = renderHook(() => useCommandPalette(inputs));

    act(() => result.current.setCommandOpen(true));

    await waitFor(() => expect(result.current.nodeCommands.length).toBe(2));
    const titles = result.current.nodeCommands.map((c) => c.title);
    expect(titles).toContain("Front Door");
    expect(titles).toContain("Kitchen");

    result.current.nodeCommands[0].onSelect?.();
    expect(onFocusNode).toHaveBeenCalledWith("p1", expect.any(String));
  });
});
