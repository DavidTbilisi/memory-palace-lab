import { describe, expect, it } from "vitest";
import {
  PAGES,
  PRIMARY_GROUPS,
  PRIMARY_PAGES,
  defaultPageForGroup,
  isAppPage,
  pageById,
  pageHint,
  pagePaletteId,
  pagesInGroup,
  resolveNavigationTarget,
} from "./pages";

describe("page registry", () => {
  it("has unique ids and a label, icon, and palette subtitle for every page", () => {
    const ids = PAGES.map((page) => page.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of PAGES) {
      expect(page.label.length).toBeGreaterThan(0);
      expect(page.groupLabel.length).toBeGreaterThan(0);
      expect(typeof page.icon).toBe("object");
      expect(page.palette.subtitle.length).toBeGreaterThan(0);
    }
  });

  it("keeps graph first and hint-less; every other page carries a hint", () => {
    expect(PAGES[0]?.id).toBe("graph");
    expect(pageHint("graph")).toBeNull();
    for (const page of PAGES.slice(1)) {
      expect(pageHint(page.id)).toEqual(expect.any(String));
    }
  });

  it("groups pages and resolves a default page per group", () => {
    for (const group of PRIMARY_GROUPS) {
      const members = pagesInGroup(group);
      expect(members.length).toBeGreaterThan(0);
      expect(defaultPageForGroup(group)).toBe(members[0]?.id);
    }
    expect(PRIMARY_PAGES.every((page) => page.placement === "primary")).toBe(true);
  });

  it("resolves known pages, aliases, and garbage", () => {
    expect(resolveNavigationTarget("review")).toEqual({ page: "review" });
    expect(resolveNavigationTarget("not-a-page")).toEqual({ page: "graph" });
    expect(resolveNavigationTarget("help")).toEqual({ page: "library" });
    expect(resolveNavigationTarget("routes")).toEqual({ page: "graph", openRoutePanel: true });
    expect(isAppPage("insights")).toBe(true);
    expect(isAppPage("nope")).toBe(false);
    expect(isAppPage(42)).toBe(false);
  });

  it("keeps settings out of the primary navigation", () => {
    expect(pageById("settings").placement).toBe("utility");
    expect(PRIMARY_GROUPS).not.toContain("settings");
  });

  it("exposes stable palette ids and lookups", () => {
    expect(pagePaletteId("library")).toBe("page-library");
    expect(pageById("system").label).toBe("System");
  });
});
