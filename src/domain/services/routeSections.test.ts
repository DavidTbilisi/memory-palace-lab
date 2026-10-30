import { describe, expect, it } from "vitest";
import { sectionNameAt } from "./routeSections";

const stops = [
  { id: "a", section: null },
  { id: "b", section: "Hall" },
  { id: "c" },
  { id: "d", section: "  " },
  { id: "e", section: "Attic" },
];

describe("route sections", () => {
  it("names the section a stop falls in", () => {
    expect(sectionNameAt(stops, 0)).toBeNull();
    expect(sectionNameAt(stops, 1)).toBe("Hall");
    expect(sectionNameAt(stops, 3)).toBe("Hall");
    expect(sectionNameAt(stops, 4)).toBe("Attic");
    expect(sectionNameAt(stops, 99)).toBe("Attic");
  });
});
