import { expect, test } from "@playwright/test";

async function bootstrapPalace(page: import("@playwright/test").Page, name = "Node Test Palace") {
  await page.addInitScript(() => {
    window.localStorage.setItem("mp-idle-tip-delay-ms", "600000");
  });
  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

async function createNodeByDoubleClick(page: import("@playwright/test").Page) {
  await page.locator(".tl-background").first().dblclick({ position: { x: 160, y: 180 } });
}

async function createNodeByDoubleClickAt(page: import("@playwright/test").Page, x: number, y: number) {
  await page.locator(".tl-background").first().dblclick({ position: { x, y } });
}

async function selectNodeByTitle(page: import("@playwright/test").Page, title: string) {
  await expect
    .poll(() =>
      page.evaluate((expectedTitle) => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing dev store hook");

        const state = store.getState() as {
          editorRef: {
            getCurrentPageShapeIds: () => Iterable<string>;
            getShape: (
              id: string,
            ) =>
              | { type?: string; meta?: { mpTitle?: string } }
              | undefined;
          } | null;
        };
        const editor = state.editorRef;
        if (!editor) throw new Error("editor not ready");

        for (const id of editor.getCurrentPageShapeIds()) {
          const shape = editor.getShape(id);
          if (shape?.type === "geo" && shape.meta?.mpTitle === expectedTitle) {
            return true;
          }
        }
        return false;
      }, title),
    )
    .toBe(true);

  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        return !!store?.getState() && !!(store.getState() as { editorRef?: unknown }).editorRef;
      }),
    )
    .toBe(true);

  await page.evaluate((expectedTitle) => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");

    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (
          id: string,
        ) =>
          | { type?: string; meta?: { mpTitle?: string } }
          | undefined;
        setSelectedShapes: (ids: string[]) => void;
      } | null;
      setSelectedShapeId: (id: string | null) => void;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");

    let targetShapeId: string | null = null;
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (shape?.type === "geo" && shape.meta?.mpTitle === expectedTitle) {
        targetShapeId = id;
        break;
      }
    }

    if (!targetShapeId) throw new Error(`unable to find node with title ${expectedTitle}`);
    editor.setSelectedShapes([targetShapeId]);
    state.setSelectedShapeId(targetShapeId);
  }, title);
}

async function clickNodeByTitle(page: import("@playwright/test").Page, title: string) {
  await expect
    .poll(() =>
      page.evaluate((expectedTitle) => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing dev store hook");

        const state = store.getState() as {
          editorRef: {
            getCurrentPageShapeIds: () => Iterable<string>;
            getShape: (id: string) => { type?: string; meta?: { mpTitle?: string } } | undefined;
          } | null;
        };
        const editor = state.editorRef;
        if (!editor) throw new Error("editor not ready");

        for (const id of editor.getCurrentPageShapeIds()) {
          const shape = editor.getShape(id);
          if (shape?.type === "geo" && shape.meta?.mpTitle === expectedTitle) {
            return true;
          }
        }
        return false;
      }, title),
    )
    .toBe(true);

  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        return !!store?.getState() && !!(store.getState() as { editorRef?: unknown }).editorRef;
      }),
    )
    .toBe(true);

  const point = await page.evaluate((expectedTitle) => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");

    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: { mpTitle?: string } } | undefined;
        getShapePageBounds: (id: string) => { center: { x: number; y: number } } | undefined;
        pageToScreen: (point: { x: number; y: number }) => { x: number; y: number };
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");

    let targetShapeId: string | null = null;
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (shape?.type === "geo" && shape.meta?.mpTitle === expectedTitle) {
        targetShapeId = id;
        break;
      }
    }

    if (!targetShapeId) throw new Error(`unable to find node with title ${expectedTitle}`);
    const bounds = editor.getShapePageBounds(targetShapeId);
    if (!bounds) throw new Error(`unable to read bounds for ${expectedTitle}`);
    const point = editor.pageToScreen(bounds.center);
    return { x: point.x, y: point.y };
  }, title);

  await page.mouse.click(point.x, point.y);
}

async function queuePendingCast(page: import("@playwright/test").Page, fromIndex: number, toIndex: number) {
  await page.evaluate(
    ([sourceIndex, targetIndex]) => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing dev store hook");
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; x?: number; meta?: Record<string, unknown> } | undefined;
        } | null;
        setPendingCast: (v: {
          fromShapeId: string;
          toShapeId: string;
          sourceNodeId: string;
          targetNodeId: string;
        }) => void;
      };
      const editor = state.editorRef;
      if (!editor) throw new Error("editor not ready");
      const nodes: Array<{ shapeId: string; nodeId: string; x: number }> = [];
      for (const shapeId of editor.getCurrentPageShapeIds()) {
        const shape = editor.getShape(shapeId);
        const nodeId = shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
        if (nodeId) nodes.push({ shapeId, nodeId, x: shape?.x ?? 0 });
      }
      nodes.sort((a, b) => a.x - b.x);
      const fromNode = nodes[sourceIndex];
      const toNode = nodes[targetIndex];
      if (!fromNode || !toNode) throw new Error("need at least two nodes");
      state.setPendingCast({
        fromShapeId: fromNode.shapeId,
        toShapeId: toNode.shapeId,
        sourceNodeId: fromNode.nodeId,
        targetNodeId: toNode.nodeId,
      });
    },
    [fromIndex, toIndex],
  );
}

async function selectFirstArrow(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string } | undefined;
        setSelectedShapes: (ids: string[]) => void;
      } | null;
      setSelectedShapeId: (id: string | null) => void;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrowId = Array.from(editor.getCurrentPageShapeIds()).find((id) => editor.getShape(id)?.type === "arrow");
    if (!arrowId) throw new Error("no arrow found");
    editor.setSelectedShapes([arrowId]);
    state.setSelectedShapeId(arrowId);
  });
}

test("node title/content editing follows selected node", async ({ page }) => {
  await bootstrapPalace(page, "Node Editing Palace");

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Kitchen Sink");
  await page.locator("#mp-content").fill("Remember detergent, sponge, and sequence.");
  await page.getByRole("button", { name: "Apply" }).click();

  await createNodeByDoubleClick(page);
  await expect(page.locator("#mp-title")).toHaveValue("New node");
  await page.locator("#mp-title").fill("Front Door");
  await page.locator("#mp-content").fill("Recall welcome script.");
  await page.getByRole("button", { name: "Apply" }).click();

  await selectNodeByTitle(page, "Kitchen Sink");
  await expect(page.locator("#mp-title")).toHaveValue("Kitchen Sink");
  await expect(page.locator("#mp-content")).toHaveValue("Remember detergent, sponge, and sequence.");

  await selectNodeByTitle(page, "Front Door");
  await expect(page.locator("#mp-title")).toHaveValue("Front Door");
  await expect(page.locator("#mp-content")).toHaveValue("Recall welcome script.");
});

test("route locus defaults to edited node title", async ({ page }) => {
  await bootstrapPalace(page, "Route Label Palace");

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Kitchen Sink");
  await page.locator("#mp-content").fill("Plates, cups, and glasses.");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByPlaceholder("Route name").fill("Home Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await expect(page.getByLabel("Locus 1 label")).toHaveValue("Kitchen Sink");
});

test("node title/content persist after save and reopen palace", async ({ page }) => {
  await bootstrapPalace(page, "Persistence Palace");

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Server Room");
  await page.locator("#mp-content").fill("Racks left to right: auth, router, db.");
  await page.getByRole("button", { name: "Apply" }).click();
  await page.getByRole("button", { name: /^Save$/ }).click();

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Temporary Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Temporary Palace" })).toBeVisible();

  await page.getByRole("button", { name: "Persistence Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Persistence Palace" })).toBeVisible();

  await selectNodeByTitle(page, "Server Room");
  await expect(page.locator("#mp-title")).toBeVisible();
  await expect(page.locator("#mp-title")).toHaveValue("Server Room");
  await expect(page.locator("#mp-content")).toHaveValue("Racks left to right: auth, router, db.");
});

test("aliases persist for palace, node, and edge inspectors", async ({ page }) => {
  await bootstrapPalace(page, "Alias Palace");

  await page.getByRole("textbox", { name: "Current palace alias" }).fill("AP");
  await page.getByRole("button", { name: "Save details" }).click();
  await expect(page.getByText("Alias: AP")).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Gateway");
  await page.locator("#mp-alias").fill("GW");
  await page.getByRole("button", { name: "Apply" }).click();

  await createNodeByDoubleClickAt(page, 520, 260);
  await page.locator("#mp-title").fill("Database");
  await page.locator("#mp-alias").fill("DB");
  await page.getByRole("button", { name: "Apply" }).click();

  await queuePendingCast(page, 0, 1);
  await page.getByLabel("Tier 1 edge verb").fill("writes");
  await page.getByRole("button", { name: /create edge/i }).click();
  await selectFirstArrow(page);
  await page.locator("#mp-edge-alias").fill("Write path");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByRole("button", { name: /^Save$/ }).click();
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Alias Temporary Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Alias Temporary Palace" })).toBeVisible();

  await page.getByRole("button", { name: /Alias Palace/ }).click();
  await expect(page.getByRole("heading", { name: "Alias Palace" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Current palace alias" })).toHaveValue("AP");

  await selectNodeByTitle(page, "Gateway");
  await expect(page.locator("#mp-alias")).toHaveValue("GW");

  await selectFirstArrow(page);
  await expect(page.locator("#mp-edge-alias")).toHaveValue("Write path");
  await expect(page.locator("#mp-edge-source")).toContainText("Gateway (GW)");
  await expect(page.locator("#mp-edge-target")).toContainText("Database (DB)");
});

test("inspector title matches clicked canvas node", async ({ page }) => {
  await bootstrapPalace(page, "Selection Sync Palace");

  await createNodeByDoubleClickAt(page, 180, 160);
  await expect(page.locator("#mp-title")).toHaveValue("New node");
  await page.locator("#mp-title").fill("A");
  await page.locator("#mp-content").fill("Alpha content");
  await page.getByRole("button", { name: "Apply" }).click();

  await createNodeByDoubleClickAt(page, 320, 260);
  await expect(page.locator("#mp-title")).toHaveValue("New node");
  await page.locator("#mp-title").fill("B");
  await page.locator("#mp-content").fill("Beta content");
  await page.getByRole("button", { name: "Apply" }).click();

  await clickNodeByTitle(page, "A");
  await expect(page.locator("#mp-title")).toHaveValue("A");
  await expect(page.locator("#mp-content")).toHaveValue("Alpha content");

  await clickNodeByTitle(page, "B");
  await expect(page.locator("#mp-title")).toHaveValue("B");
  await expect(page.locator("#mp-content")).toHaveValue("Beta content");
});

test("inspector updates after canvas-side rename of selected node", async ({ page }) => {
  await bootstrapPalace(page, "Canvas Rename Sync Palace");

  await page.getByRole("button", { name: /^Node$/ }).click();
  await expect(page.locator("#mp-title")).toHaveValue("New node");

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getSelectedShapeIds: () => string[];
        getShape: (id: string) => { type?: string; props?: Record<string, unknown> } | undefined;
        updateShape: (shape: unknown) => void;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const shapeId = editor.getSelectedShapeIds()[0];
    if (!shapeId) throw new Error("no selected shape");
    const shape = editor.getShape(shapeId);
    if (!shape || shape.type !== "geo") throw new Error("selected shape is not geo");

    editor.updateShape({
      id: shapeId,
      type: "geo",
      props: {
        ...(shape.props ?? {}),
        richText: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "david" }],
            },
          ],
        },
      },
    });
  });

  await expect(page.locator("#mp-title")).toHaveValue("david");
});

