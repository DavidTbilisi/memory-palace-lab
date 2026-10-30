/**
 * Hand-made atlas groups: the sidebar's "New group" adds them, and they persist
 * so a group shows before any palace is in it.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Palace } from "../domain/entities/types";
import { buildAtlasTree } from "../components/PalaceSidebar";
import { loadPalaceDraft, savePalaceDraft } from "../infrastructure/draft/palaceDraftStore";
import { usePalaceStore } from "./palaceStore";
import { ATLAS_GROUPS_STORAGE_KEY, loadAtlasGroups } from "./palaceStoreHelpers";

function palace(name: string, atlasPath: string | null): Palace {
  return { id: name, name, atlasPath } as Palace;
}

describe("palaceStore atlas groups", () => {
  beforeEach(() => {
    usePalaceStore.setState({ atlasGroups: [] });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("adds a normalized group once and saves it", () => {
    usePalaceStore.getState().addAtlasGroup(" Math / Algebra ");
    usePalaceStore.getState().addAtlasGroup("Math/Algebra");
    expect(usePalaceStore.getState().atlasGroups).toEqual(["Math/Algebra"]);
    expect(loadAtlasGroups()).toEqual(["Math/Algebra"]);
  });

  it("ignores a blank group name", () => {
    usePalaceStore.getState().addAtlasGroup(" / ");
    expect(usePalaceStore.getState().atlasGroups).toEqual([]);
    expect(window.localStorage.getItem(ATLAS_GROUPS_STORAGE_KEY)).toBeNull();
  });

  it("removing a group also forgets the groups nested under it", () => {
    usePalaceStore.setState({ atlasGroups: ["Math", "Math/Algebra", "Mathematics"] });
    usePalaceStore.getState().removeAtlasGroup("Math");
    expect(usePalaceStore.getState().atlasGroups).toEqual(["Mathematics"]);
  });
});

describe("buildAtlasTree with hand-made groups", () => {
  it("lists an empty group beside groups that come from palace paths", () => {
    const tree = buildAtlasTree([palace("Quadratics", "Math/Algebra")], ["Math/Geometry", "Biology"]);
    expect(tree.map((group) => group.label)).toEqual(["Biology", "Math"]);
    const math = tree[1]!;
    expect(math.children.map((group) => [group.path, group.palaces.length])).toEqual([
      ["Math/Algebra", 1],
      ["Math/Geometry", 0],
    ]);
  });

  it("puts palaces without a path in Ungrouped, which creates at the root", () => {
    const [ungrouped] = buildAtlasTree([palace("Loose", null)]);
    expect(ungrouped).toMatchObject({ label: "Ungrouped", path: "" });
  });
});

describe("palaceStore moving palaces and groups", () => {
  const store = () => usePalaceStore.getState();
  const pathOf = (id: string) => store().palaces.find((p) => p.id === id)?.atlasPath ?? null;
  const create = async (name: string, atlasPath: string) => {
    await store().createPalace(name, atlasPath);
    return store().currentPalace!.id;
  };

  beforeEach(() => {
    usePalaceStore.setState({ atlasGroups: [], currentPalace: null, editorRef: null });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("moves a palace into another group and keeps the group it left", async () => {
    const id = await create("Move Me", "Math");
    await store().movePalaceToGroup(id, "Science/Physics");
    expect(pathOf(id)).toBe("Science/Physics");
    // It was the open palace, and it moved without a canvas to save from.
    expect(store().currentPalace?.atlasPath).toBe("Science/Physics");
    expect(store().atlasGroups).toContain("Math");
  });

  it("moves a group with its palaces and subgroups, leaving look-alike paths alone", async () => {
    const lines = await create("Lines", "Math/Geometry");
    const angles = await create("Angles", "Math/Geometry/Angles");
    const lookAlike = await create("Lookalike", "Math/Geometrical");
    store().addAtlasGroup("Math/Geometry/Empty");

    await store().moveAtlasGroup("Math/Geometry", "Shapes");

    expect(pathOf(lines)).toBe("Shapes/Geometry");
    expect(pathOf(angles)).toBe("Shapes/Geometry/Angles");
    expect(pathOf(lookAlike)).toBe("Math/Geometrical");
    expect(store().atlasGroups).toEqual(expect.arrayContaining(["Shapes/Geometry/Empty", "Math"]));
    expect(store().atlasGroups).not.toContain("Math/Geometry/Empty");
  });

  it("refuses to move a group into itself or one of its subgroups", async () => {
    const id = await create("Deep", "A/B");
    await store().moveAtlasGroup("A", "A/B");
    await store().moveAtlasGroup("A", "A");
    expect(pathOf(id)).toBe("A/B");
  });

  it("rewrites the recovery draft of a palace that is not open", async () => {
    const id = await create("Drafted", "Old");
    savePalaceDraft({
      palace: { ...store().currentPalace! },
      canvasObjects: [],
      nodes: [],
      edges: [],
      routes: [],
      loci: [],
    });
    await create("Other", "");

    await store().movePalaceToGroup(id, "New");

    expect(pathOf(id)).toBe("New");
    expect(loadPalaceDraft(id)?.snapshot.palace.atlasPath).toBe("New");
  });
});
