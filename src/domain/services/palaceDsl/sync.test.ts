import type { Editor } from "@tldraw/editor";
import { describe, expect, it } from "vitest";
import { MockEditor, type MockShape } from "./mockEditor";
import { SOLID_CITADEL_DSL } from "./fixtures/solidCitadel.dsl";
import { parseDsl } from "./parser";
import { applyDslToCanvas } from "./sync";
import type { DslNode, DslSnapshot } from "./types";

const PALACE_ID = "palace-1";

function intent(nodes: DslNode[], routes: DslSnapshot["routes"] = []): DslSnapshot {
  return { palaceName: "P", atlasPath: null, nodes, routes };
}

function memoryNode(
  title: string,
  overrides: Partial<DslNode> = {},
): DslNode {
  return {
    title,
    content: "",
    kind: "memory",
    portal: null,
    tags: [],
    edges: [],
    sourceLine: 0,
    ...overrides,
  };
}

function asEditor(mock: MockEditor): Editor {
  return mock as unknown as Editor;
}

function shapesOf(mock: MockEditor): MockShape[] {
  return [...mock.getCurrentPageShapeIds()]
    .map((id) => mock.getShape(id))
    .filter((s): s is MockShape => s !== undefined);
}

describe("applyDslToCanvas", () => {
  it("creates new nodes when canvas is empty", () => {
    const editor = new MockEditor();
    const result = applyDslToCanvas(
      asEditor(editor),
      PALACE_ID,
      intent([memoryNode("A"), memoryNode("B"), memoryNode("C")]),
    );

    expect(result.added.nodes).toBe(3);
    expect(result.updated.nodes).toBe(0);
    expect(result.deleted.nodes).toBe(0);
    expect(shapesOf(editor).filter((s) => s.type === "geo")).toHaveLength(3);
  });

  it("updates content on an existing node and preserves mpNodeId", () => {
    const editor = new MockEditor();
    const shapeId = editor.seedNode(PALACE_ID, "A", "old");
    const beforeNodeId = editor.getShape(shapeId)!.meta.mpNodeId;

    const result = applyDslToCanvas(
      asEditor(editor),
      PALACE_ID,
      intent([memoryNode("A", { content: "new" })]),
    );

    expect(result.updated.nodes).toBe(1);
    expect(result.added.nodes).toBe(0);
    expect(result.deleted.nodes).toBe(0);

    const after = editor.getShape(shapeId)!;
    expect(after.meta.mpNodeId).toBe(beforeNodeId);
    expect(after.meta.mpContent).toBe("new");
  });

  it("deletes a node not present in the intent and cascades its arrows", () => {
    const editor = new MockEditor();
    const a = editor.seedNode(PALACE_ID, "A");
    const b = editor.seedNode(PALACE_ID, "B");
    editor.seedEdge(PALACE_ID, a, b, { ab: "Giant", cd: "", ef: "", gh: "" });

    applyDslToCanvas(asEditor(editor), PALACE_ID, intent([memoryNode("A")]));

    const remaining = shapesOf(editor);
    expect(remaining.filter((s) => s.type === "geo")).toHaveLength(1);
    expect(remaining.filter((s) => s.type === "arrow")).toHaveLength(0);
  });

  it("treats a CAST change as delete + recreate of the arrow", () => {
    const editor = new MockEditor();
    const a = editor.seedNode(PALACE_ID, "A");
    const b = editor.seedNode(PALACE_ID, "B");
    const oldArrowId = editor.seedEdge(PALACE_ID, a, b, {
      ab: "Giant",
      cd: "",
      ef: "",
      gh: "",
    });

    const result = applyDslToCanvas(
      asEditor(editor),
      PALACE_ID,
      intent([
        memoryNode("A", {
          edges: [
            {
              targetTitle: "B",
              cast: { ab: "Mermaid", cd: "", ef: "", gh: "" },
              sourceLine: 0,
            },
          ],
        }),
        memoryNode("B"),
      ]),
    );

    expect(result.added.edges).toBe(1);
    expect(result.deleted.edges).toBe(1);
    expect(editor.getShape(oldArrowId)).toBeUndefined();

    const arrows = shapesOf(editor).filter((s) => s.type === "arrow");
    expect(arrows).toHaveLength(1);
    expect(arrows[0]!.meta.castAb).toBe("Mermaid");
  });

  it("propagates portal and tag updates onto existing nodes", () => {
    const editor = new MockEditor();
    const shapeId = editor.seedNode(PALACE_ID, "A", "");

    applyDslToCanvas(
      asEditor(editor),
      PALACE_ID,
      intent([
        memoryNode("A", {
          kind: "portal",
          portal: { targetPalaceName: "other" },
          tags: ["alpha", "beta"],
        }),
      ]),
    );

    const after = editor.getShape(shapeId)!.meta;
    expect(after.mpNodeKind).toBe("portal");
    expect(after.mpPortalPalaceName).toBe("other");
    expect(after.mpTags).toEqual(["alpha", "beta"]);
  });
});

describe("applyDslToCanvas meta hygiene", () => {
  it("never writes undefined into meta for nodes without @image", () => {
    const editor = new MockEditor();
    applyDslToCanvas(asEditor(editor), PALACE_ID, intent([memoryNode("A")]));

    const [shape] = shapesOf(editor);
    expect(shape).toBeDefined();
    expect(Object.keys(shape!.meta)).not.toContain("mpImageUrl");
    expect(Object.values(shape!.meta)).not.toContain(undefined);
  });

  it("sets and then clears the image so the change survives tldraw's meta merge", () => {
    const editor = new MockEditor();
    const shapeId = editor.seedNode(PALACE_ID, "A");

    const withImage = applyDslToCanvas(
      asEditor(editor),
      PALACE_ID,
      intent([memoryNode("A", { imageUrl: "https://img.example/a.png" })]),
    );
    expect(withImage.updated.nodes).toBe(1);
    expect(editor.getShape(shapeId)!.meta.mpImageUrl).toBe("https://img.example/a.png");

    const cleared = applyDslToCanvas(asEditor(editor), PALACE_ID, intent([memoryNode("A")]));
    expect(cleared.updated.nodes).toBe(1);
    expect(editor.getShape(shapeId)!.meta.mpImageUrl).toBeNull();

    const unchanged = applyDslToCanvas(asEditor(editor), PALACE_ID, intent([memoryNode("A")]));
    expect(unchanged.updated.nodes).toBe(0);
  });

  it("applies the SOLID Citadel document that used to crash", () => {
    const { snapshot, diagnostics } = parseDsl(SOLID_CITADEL_DSL);
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);

    const editor = new MockEditor();
    const result = applyDslToCanvas(asEditor(editor), PALACE_ID, snapshot);

    expect(result.errors).toEqual([]);
    expect(result.added.nodes).toBe(2);
    const titles = shapesOf(editor)
      .filter((s) => s.type === "geo")
      .map((s) => s.meta.mpTitle)
      .sort();
    expect(titles).toEqual(["Gate of SOLID", "Single Responsibility Forge"]);
    // Gate -> Forge exists; edges to undeclared nodes are skipped.
    expect(shapesOf(editor).filter((s) => s.type === "arrow")).toHaveLength(1);
  });
});
