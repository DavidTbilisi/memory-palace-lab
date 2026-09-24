import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const check = vi.fn();
vi.mock("@tauri-apps/plugin-updater", () => ({ check: () => check() }));

/** IS_TAURI_RUNTIME is read when the module loads, so load it after marking the window. */
async function loadUpdater() {
  vi.resetModules();
  (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
  return import("./appUpdater");
}

describe("checkForUpdate", () => {
  beforeEach(() => check.mockReset());
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
  });

  it("checkForUpdate passes the release notes through, trimmed", async () => {
    check.mockResolvedValue({ version: "0.14.1", body: "\n### Updates\n\n- Notes\n" });
    const { checkForUpdate } = await loadUpdater();
    await expect(checkForUpdate()).resolves.toEqual({
      status: "available",
      version: "0.14.1",
      notes: "### Updates\n\n- Notes",
    });
  });

  it.each([undefined, null, "", "  \n"])("checkForUpdate reports no notes for a body of %j", async (body) => {
    check.mockResolvedValue({ version: "0.14.1", body });
    const { checkForUpdate } = await loadUpdater();
    await expect(checkForUpdate()).resolves.toEqual({ status: "available", version: "0.14.1", notes: undefined });
  });
});
