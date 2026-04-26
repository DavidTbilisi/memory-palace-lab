import { describe, expect, it } from "vitest";
import { rankPaletteItems, type PaletteItem } from "./commandPalette";

const items: PaletteItem[] = [
  {
    id: "page:insights",
    group: "Pages",
    title: "Open Insights",
    keywords: "analytics memory strength",
  },
  {
    id: "action:create-node",
    group: "Actions",
    title: "Create node",
    keywords: "add memory node graph palace",
  },
  {
    id: "route:main",
    group: "Routes",
    title: "Main route",
    subtitle: "Tutorial Palace",
    keywords: "walk review route",
  },
];

describe("rankPaletteItems", () => {
  it("prefers exact and prefix matches in the title", () => {
    const ranked = rankPaletteItems(items, "create");
    expect(ranked[0]?.id).toBe("action:create-node");
  });

  it("matches via keywords when the title does not contain the query", () => {
    const ranked = rankPaletteItems(items, "analytics");
    expect(ranked[0]?.id).toBe("page:insights");
  });

  it("boosts recently used items when scores are otherwise similar", () => {
    const ranked = rankPaletteItems(items, "route", ["route:main"]);
    expect(ranked[0]?.id).toBe("route:main");
  });
});
