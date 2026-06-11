/**
 * Guards the version display against runner differences: the previous
 * compile-time define resolved under vite build but not under vitest on CI
 * (ReferenceError in MemoryPalaceApp). A module import must work everywhere.
 */
import { describe, expect, it } from "vitest";
import { APP_VERSION } from "./appVersion";
import pkg from "../package.json";

describe("APP_VERSION", () => {
  it("resolves under the test runner and matches package.json", () => {
    expect(APP_VERSION).toBe(pkg.version);
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
