import { describe, expect, it } from "vitest";
import { composeAtlasPath, splitAtlasPath } from "./atlasHierarchy";

describe("atlasHierarchy", () => {
  it("splits existing slash paths into editable hierarchy segments", () => {
    expect(splitAtlasPath("Georgia / Tbilisi/Vake")).toEqual(["Georgia", "Tbilisi", "Vake"]);
  });

  it("composes hierarchy segments without empty manual data hacks", () => {
    expect(composeAtlasPath([" Course ", "", " Week 1 ", " Lesson A "])).toBe("Course/Week 1/Lesson A");
  });
});
