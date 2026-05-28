import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

function press(key: string, opts: { meta?: boolean; ctrl?: boolean } = { meta: true }) {
  const event = new KeyboardEvent("keydown", {
    key,
    metaKey: opts.meta ?? false,
    ctrlKey: opts.ctrl ?? false,
    cancelable: true,
  });
  window.dispatchEvent(event);
  return event;
}

describe("useKeyboardShortcuts", () => {
  it("fires the matching handler on Cmd/Ctrl + key and prevents default", () => {
    const onK = vi.fn();
    renderHook(() => useKeyboardShortcuts({ k: onK }));
    const event = press("k", { meta: true });
    expect(onK).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("matches keys case-insensitively and supports the ctrl modifier", () => {
    const onK = vi.fn();
    renderHook(() => useKeyboardShortcuts({ k: onK }));
    press("K", { ctrl: true });
    expect(onK).toHaveBeenCalledTimes(1);
  });

  it("ignores keys without a modifier or without a registered handler", () => {
    const onK = vi.fn();
    renderHook(() => useKeyboardShortcuts({ k: onK }));
    press("k", { meta: false });
    press("j", { meta: true });
    expect(onK).not.toHaveBeenCalled();
  });

  it("uses the latest handler closure without rebinding", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ h }) => useKeyboardShortcuts({ k: h }), {
      initialProps: { h: first },
    });
    rerender({ h: second });
    press("k", { meta: true });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const onK = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcuts({ k: onK }));
    unmount();
    press("k", { meta: true });
    expect(onK).not.toHaveBeenCalled();
  });
});
