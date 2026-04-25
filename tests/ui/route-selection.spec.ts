import { expect, test } from "@playwright/test";

test("selected node is the one added to route path", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator(".tl-background").first().dblclick({ position: { x: 180, y: 140 } });

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; x?: number; meta?: Record<string, unknown> } | undefined;
        updateShape: (shape: {
          id: string;
          type: "geo";
          meta: Record<string, unknown>;
        }) => void;
        setSelectedShapes: (ids: string[]) => void;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");

    const nodes: Array<{ id: string; x: number; meta: Record<string, unknown> }> = [];
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (shape?.type === "geo") {
        nodes.push({ id, x: shape.x ?? 0, meta: (shape.meta ?? {}) as Record<string, unknown> });
      }
    }
    if (nodes.length < 2) throw new Error("need at least two nodes");
    nodes.sort((a, b) => a.x - b.x);

    editor.updateShape({ id: nodes[0].id, type: "geo", meta: { ...nodes[0].meta, mpTitle: "Node A" } });
    editor.updateShape({ id: nodes[1].id, type: "geo", meta: { ...nodes[1].meta, mpTitle: "Node B" } });
    editor.setSelectedShapes([nodes[0].id]);
  });

  await page.getByPlaceholder("Route name").fill("Selection Path");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; x?: number } | undefined;
        setSelectedShapes: (ids: string[]) => void;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const nodes: Array<{ id: string; x: number }> = [];
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (shape?.type === "geo") nodes.push({ id, x: shape.x ?? 0 });
    }
    nodes.sort((a, b) => a.x - b.x);
    editor.setSelectedShapes([nodes[1].id]);
  });

  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await expect(page.getByLabel("Locus 1 label")).toHaveValue("Node A");
  await expect(page.getByLabel("Locus 2 label")).toHaveValue("Node B");
});

