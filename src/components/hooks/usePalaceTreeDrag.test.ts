import { describe, expect, it } from "vitest";
import { canDropOn, type PalaceTreeDragItem } from "./usePalaceTreeDrag";

const palace: PalaceTreeDragItem = { kind: "palace", palaceId: "p", fromPath: "Math", label: "Algebra" };
const group: PalaceTreeDragItem = { kind: "group", path: "Math/Geometry", label: "Geometry" };

describe("canDropOn", () => {
  it("lets a palace drop on any group but its own", () => {
    expect(canDropOn(palace, "Science")).toBe(true);
    expect(canDropOn(palace, "")).toBe(true);
    expect(canDropOn(palace, "Math")).toBe(false);
  });

  it("keeps a group out of itself, its subgroups, and the parent it already sits in", () => {
    expect(canDropOn(group, "Math/Geometry")).toBe(false);
    expect(canDropOn(group, "Math/Geometry/Angles")).toBe(false);
    expect(canDropOn(group, "Math")).toBe(false);
  });

  it("lets a group drop on a look-alike sibling or the top level", () => {
    expect(canDropOn(group, "Math/Geometrical")).toBe(true);
    expect(canDropOn(group, "")).toBe(true);
  });
});
