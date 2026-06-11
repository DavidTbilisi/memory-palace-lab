import type { Editor } from "@tldraw/editor";
import { describe, expect, it } from "vitest";
import {
  createGeoMemoryNode,
  createMemoryArrow,
} from "../../src/canvas/createMemoryShapes";
import { applyDslToCanvas } from "../../src/domain/services/palaceDsl/sync";
import { parseDsl } from "../../src/domain/services/palaceDsl/parser";
import { buildRowsFromShapes } from "./buildRowsFromShapes";
import { createBaselineSnapshotJson, SnapshotEditor } from "./snapshotEditor";

const PALACE = {
  id: "palace-1",
  name: "Test",
  createdAt: "2026-06-11T00:00:00.000Z",
  alias: null,
  atlasPath: null,
  editorSnapshot: null,
  deletedAt: null,
  purgeAt: null,
};

function asEditor(editor: SnapshotEditor): Editor {
  return editor as unknown as Editor;
}

async function loadIntoRealStore(json: string) {
  const { createTLStore, defaultShapeUtils, defaultBindingUtils } = await import("tldraw");
  const store = createTLStore({
    shapeUtils: defaultShapeUtils,
    bindingUtils: defaultBindingUtils,
  });
  const parsed = JSON.parse(json);
  store.loadStoreSnapshot("document" in parsed ? parsed.document : parsed);
  return store;
}

describe("SnapshotEditor", () => {
  it("creates nodes and arrows that tldraw accepts on load (golden validation)", async () => {
    const baseline = await createBaselineSnapshotJson();
    const editor = new SnapshotEditor(baseline);

    const a = createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 200, y: 200 }, {
      title: "Alpha",
      content: "first node",
    });
    const b = createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 500, y: 200 }, {
      title: "Beta",
      content: "second node",
    });
    const arrow = createMemoryArrow(
      asEditor(editor),
      PALACE.id,
      a.shapeId,
      b.shapeId,
      a.nodeId,
      b.nodeId,
      { ab: "Giant", cd: "Crushing", ef: "Rock", gh: "Red cave", label: "drives" },
    );
    expect(arrow).not.toBeNull();

    const serialized = editor.serialize();
    const store = await loadIntoRealStore(serialized);
    const shapes = store.allRecords().filter((r) => r.typeName === "shape");
    const bindings = store.allRecords().filter((r) => r.typeName === "binding");
    expect(shapes).toHaveLength(3);
    expect(bindings).toHaveLength(2);
  });

  it("derives DB rows matching the app's buildPalaceSnapshot contract", async () => {
    const baseline = await createBaselineSnapshotJson();
    const editor = new SnapshotEditor(baseline);

    const a = createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 200, y: 200 }, {
      title: "Alpha",
      content: "first",
    });
    const b = createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 500, y: 200 }, {
      title: "Beta",
      content: "second",
    });
    createMemoryArrow(asEditor(editor), PALACE.id, a.shapeId, b.shapeId, a.nodeId, b.nodeId, {
      ab: "Giant",
      cd: "Crushing",
      ef: "Rock",
      gh: "Red cave",
    });

    const snap = buildRowsFromShapes(editor, PALACE, [], []);
    expect(snap.nodes).toHaveLength(2);
    expect(snap.edges).toHaveLength(1);
    expect(snap.canvasObjects).toHaveLength(3);

    const alpha = snap.nodes.find((n) => n.id === a.nodeId)!;
    expect(alpha.title).toBe("Alpha");
    expect(alpha.content).toBe("first");
    expect(alpha.kind).toBe("memory");

    const alphaObj = snap.canvasObjects.find((c) => c.id === alpha.objectId)!;
    // createGeoMemoryNode centers a 180x100 rect on the page point.
    expect(alphaObj.x).toBe(200 - 90);
    expect(alphaObj.y).toBe(200 - 50);
    expect(alphaObj.width).toBe(180);
    expect(alphaObj.height).toBe(100);

    const edge = snap.edges[0]!;
    expect(edge.sourceNodeId).toBe(a.nodeId);
    expect(edge.targetNodeId).toBe(b.nodeId);
    expect(edge.castAb).toBe("Giant");

    expect(snap.palace.editorSnapshot).toBe(editor.serialize());
  });

  it("supports the app's DSL apply path end to end", async () => {
    const baseline = await createBaselineSnapshotJson();
    const editor = new SnapshotEditor(baseline);

    const parsed = parseDsl(
      ["@Test", "", "[a] Alpha", ": first node", ">Beta 1110", "", "[b] Beta", ": second node"].join(
        "\n",
      ),
    );
    expect(parsed.diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);

    const result = applyDslToCanvas(asEditor(editor), PALACE.id, parsed.snapshot);
    expect(result.added.nodes).toBe(2);
    expect(result.added.edges).toBe(1);

    // Re-applying the same DSL is a no-op (idempotence).
    const again = applyDslToCanvas(asEditor(editor), PALACE.id, parsed.snapshot);
    expect(again.added.nodes).toBe(0);
    expect(again.added.edges).toBe(0);
    expect(again.updated.nodes).toBe(0);

    const store = await loadIntoRealStore(editor.serialize());
    expect(store.allRecords().filter((r) => r.typeName === "shape")).toHaveLength(3);
  });

  it("deleteShape cascades bound arrows and their bindings", async () => {
    const baseline = await createBaselineSnapshotJson();
    const editor = new SnapshotEditor(baseline);

    const a = createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 0, y: 0 }, { title: "A" });
    const b = createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 400, y: 0 }, { title: "B" });
    createMemoryArrow(asEditor(editor), PALACE.id, a.shapeId, b.shapeId, a.nodeId, b.nodeId, {
      ab: "Giant",
      cd: "Crushing",
      ef: "Rock",
      gh: "Red cave",
    });

    editor.deleteShape(a.shapeId);
    const snap = buildRowsFromShapes(editor, PALACE, [], []);
    expect(snap.nodes).toHaveLength(1);
    expect(snap.edges).toHaveLength(0);

    const store = await loadIntoRealStore(editor.serialize());
    expect(store.allRecords().filter((r) => r.typeName === "shape")).toHaveLength(1);
    expect(store.allRecords().filter((r) => r.typeName === "binding")).toHaveLength(0);
  });

  it("round-trips a TLEditorSnapshot-shaped blob preserving the session", async () => {
    const baseline = JSON.parse(await createBaselineSnapshotJson());
    const editorShaped = JSON.stringify({
      document: baseline,
      session: { version: 0, currentPageId: "page:page", exportBackground: true },
    });
    const editor = new SnapshotEditor(editorShaped);
    createGeoMemoryNode(asEditor(editor), PALACE.id, { x: 0, y: 0 }, { title: "A" });

    const out = JSON.parse(editor.serialize()) as {
      session: unknown;
      document: { store: Record<string, { typeName?: string }> };
    };
    expect(out.session).toEqual({ version: 0, currentPageId: "page:page", exportBackground: true });
    expect(
      Object.values(out.document.store).filter((r) => r.typeName === "shape"),
    ).toHaveLength(1);
  });
});
