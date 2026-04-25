import { expect, test } from "@playwright/test";

async function bootstrapTutorialPalace(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.getByText("Memory Palace Lab")).toBeVisible();
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
}

async function doubleClickCanvasAt(page: import("@playwright/test").Page, x: number, y: number) {
  await page.locator(".tl-background").first().dblclick({ position: { x, y } });
}

test("palace save/load workflow", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Gateway Node");
  await page.getByRole("button", { name: "Apply" }).click();
  await page.getByRole("button", { name: /^Save$/ }).click();

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Second Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Second Palace" })).toBeVisible();

  await page.getByRole("button", { name: "Tutorial Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tutorial Palace", exact: true })).toBeVisible();
});

test("route and walk workflow", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();

  await page.getByPlaceholder("Route name").fill("Route 1");
  await page.getByRole("button", { name: "Add route" }).click();

  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await expect(page.getByLabel("Locus 1 label")).toBeVisible();
  await expect(page.getByLabel("Locus 2 label")).toBeVisible();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
});

test("connect workflow opens and applies CAST", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);
  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
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
    const nodes: Array<{ shapeId: string; nodeId: string }> = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      const nodeId = shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
      if (nodeId) nodes.push({ shapeId, nodeId });
    }
    if (nodes.length < 2) throw new Error("need at least two nodes");
    state.setPendingCast({
      fromShapeId: nodes[0].shapeId,
      toShapeId: nodes[1].shapeId,
      sourceNodeId: nodes[0].nodeId,
      targetNodeId: nodes[1].nodeId,
    });
  });

  await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
  await expect(page.getByLabel("Tier 1 edge verb")).toHaveValue("links");
  await page.getByRole("button", { name: "Tier 2 (CAST)" }).click();
  await expect(page.getByText("C bits: 00")).toBeVisible();
  await page.getByLabel("CAST character").selectOption({ index: 1 });
  await expect(page.getByText("C bits: 01")).toBeVisible();
  await page.getByRole("button", { name: "?" }).click();
  await expect(page.getByRole("heading", { name: "CAST quick reference" })).toBeVisible();
  await expect(page.getByText(/Tier 1: verb-only\./)).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: /create edge/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown>; props?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrows = Array.from(editor.getCurrentPageShapeIds())
      .map((id) => editor.getShape(id))
      .filter((shape) => shape?.type === "arrow");
    if (!arrows.length) throw new Error("no arrow created");
    const created = arrows.find((shape) => shape?.meta?.castAb === "Mermaid");
    if (!created) throw new Error("expected edge with selected C profile not found");
    if (created.props?.arrowheadStart !== "arrow" || created.props?.arrowheadEnd !== "arrow") {
      throw new Error("expected bidirectional arrowheads for C=01 Mermaid");
    }
  });

  const edgeProgress = page.locator("li", { hasText: "Connected nodes with CAST edges" }).first();
  await expect(edgeProgress).toContainText("✓");
});

test("connect workflow supports Tier 1 verb edge", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);
  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
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
    const nodes: Array<{ shapeId: string; nodeId: string }> = [];
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(shapeId);
      const nodeId = shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
      if (nodeId) nodes.push({ shapeId, nodeId });
    }
    if (nodes.length < 2) throw new Error("need at least two nodes");
    state.setPendingCast({
      fromShapeId: nodes[0].shapeId,
      toShapeId: nodes[1].shapeId,
      sourceNodeId: nodes[0].nodeId,
      targetNodeId: nodes[1].nodeId,
    });
  });

  await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
  await page.getByRole("button", { name: "triggers", exact: true }).click();
  await expect(page.getByLabel("Tier 1 edge verb")).toHaveValue("triggers");
  await page.getByLabel("Tier 1 direction").selectOption("two-way");
  await page.getByRole("button", { name: /create edge/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; props?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrows = Array.from(editor.getCurrentPageShapeIds())
      .map((id) => editor.getShape(id))
      .filter((shape) => shape?.type === "arrow");
    if (!arrows.length) throw new Error("no arrow created");
    const edge = arrows[arrows.length - 1];
    if (edge?.props?.arrowheadStart !== "arrow" || edge?.props?.arrowheadEnd !== "arrow") {
      throw new Error("tier1 two-way should render bidirectional arrowheads");
    }
  });
});

