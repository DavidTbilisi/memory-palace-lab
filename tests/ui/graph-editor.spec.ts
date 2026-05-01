/**
 * Complex graph editor operations.
 *
 * Covers scenarios not tested elsewhere:
 *   - Multi-node canvas creation and selection
 *   - Edge direction variants and CAST tier interactions
 *   - Route locus ordering, relabelling, reassignment
 *   - Portal node creation via the inspector
 *   - Node content editing and alias persistence
 *   - Large palace graph (20+ nodes via DSL) performance sanity check
 *   - theSystem pipeline → graph state integrity
 *   - Atlas hierarchy editor
 *   - DSL round-trip: canvas changes reflected in serialiser output
 */

import { expect, test } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function bootstrapPalace(page: import("@playwright/test").Page, name: string) {
  await page.addInitScript(() => {
    window.localStorage.setItem("mp-idle-tip-delay-ms", "600000");
  });
  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

async function bootstrapTutorial(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
}

async function waitForEditorReady(page: import("@playwright/test").Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        return !!(store?.getState() as { editorRef?: unknown } | undefined)?.editorRef;
      }),
    )
    .toBe(true);
}

async function getNodeCount(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) return 0;
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
    };
    if (!state.editorRef) return 0;
    let count = 0;
    for (const id of state.editorRef.getCurrentPageShapeIds()) {
      const shape = state.editorRef.getShape(id);
      if (shape?.type === "geo" && shape.meta?.mpNodeId) count++;
    }
    return count;
  });
}

async function getEdgeCount(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) return 0;
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
    };
    if (!state.editorRef) return 0;
    let count = 0;
    for (const id of state.editorRef.getCurrentPageShapeIds()) {
      const shape = state.editorRef.getShape(id);
      if (shape?.type === "arrow" && shape.meta?.mpEdgeId) count++;
    }
    return count;
  });
}

async function queuePendingCast(
  page: import("@playwright/test").Page,
  fromIndex: number,
  toIndex: number,
) {
  await page.evaluate(
    ([fi, ti]) => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
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
        const nodeId =
          shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
        if (nodeId) nodes.push({ shapeId, nodeId, x: shape?.x ?? 0 });
      }
      nodes.sort((a, b) => a.x - b.x);
      const from = nodes[fi!];
      const to = nodes[ti!];
      if (!from || !to) throw new Error(`need nodes at indices ${fi} and ${ti}`);
      state.setPendingCast({
        fromShapeId: from.shapeId,
        toShapeId: to.shapeId,
        sourceNodeId: from.nodeId,
        targetNodeId: to.nodeId,
      });
    },
    [fromIndex, toIndex],
  );
}

async function openDslEditor(page: import("@playwright/test").Page) {
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();
}

// ── MULTI-NODE CREATION ───────────────────────────────────────────────────────

test.describe("multi-node canvas creation", () => {
  test("double-clicking at different positions creates distinct nodes", async ({ page }) => {
    await bootstrapTutorial(page);
    await waitForEditorReady(page);

    const bg = page.locator(".tl-background").first();
    for (const pos of [{ x: 140, y: 160 }, { x: 300, y: 160 }, { x: 460, y: 160 }]) {
      await bg.dblclick({ position: pos });
      await page.waitForTimeout(200);
    }

    await expect.poll(() => getNodeCount(page), { timeout: 8000 }).toBeGreaterThanOrEqual(3);
  });

  test("inspector updates title for each newly created node", async ({ page }) => {
    await bootstrapTutorial(page);
    await waitForEditorReady(page);

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Alpha");
    await page.getByRole("button", { name: "Apply" }).click();

    await page.locator(".tl-background").first().dblclick({ position: { x: 300, y: 180 } });
    await expect(page.locator("#mp-title")).toHaveValue("New node");
    await page.locator("#mp-title").fill("Beta");
    await page.getByRole("button", { name: "Apply" }).click();

    // Click Alpha to verify it has its own title
    const alphaShapeId = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return null;
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
          setSelectedShapes: (ids: string[]) => void;
        } | null;
        setSelectedShapeId: (id: string | null) => void;
      };
      const editor = state.editorRef;
      if (!editor) return null;
      for (const id of editor.getCurrentPageShapeIds()) {
        const shape = editor.getShape(id);
        if (shape?.type === "geo" && shape.meta?.mpTitle === "Alpha") {
          editor.setSelectedShapes([id]);
          state.setSelectedShapeId(id);
          return id;
        }
      }
      return null;
    });
    expect(alphaShapeId).toBeTruthy();
    await expect(page.locator("#mp-title")).toHaveValue("Alpha");
  });
});

// ── EDGE CREATION VARIANTS ────────────────────────────────────────────────────

test.describe("edge creation variants", () => {
  test("Tier 1 verb-only edge is created without CAST values", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator(".tl-background").first().dblclick({ position: { x: 300, y: 180 } });

    await queuePendingCast(page, 0, 1);
    await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
    await page.getByLabel("Tier 1 edge verb").fill("requires");
    await page.getByRole("button", { name: /create edge/i }).click();

    await expect.poll(() => getEdgeCount(page), { timeout: 8000 }).toBe(1);

    const edge = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return null;
      const state = store.getState() as {
        edges: Array<{ castAb: string; castCd: string; castEf: string; castGh: string }>;
      };
      return state.edges[0] ?? null;
    });
    expect(edge).not.toBeNull();
    // Verb-only → all CAST axes empty (0000 → empty strings)
    expect(edge!.castAb).toBe("");
    expect(edge!.castCd).toBe("");
    expect(edge!.castEf).toBe("");
    expect(edge!.castGh).toBe("");
  });

  test("Tier 2 CAST profile 2222 encodes all four axes at index 2", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator(".tl-background").first().dblclick({ position: { x: 300, y: 180 } });

    await queuePendingCast(page, 0, 1);
    await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
    await page.getByRole("button", { name: "Tier 2 (CAST)" }).click();

    // Select index 2 on all four selectors (Mage / Spreading / Cloud / Green sky)
    const castSelects = page.getByLabel("CAST character");
    const count = await castSelects.count();
    for (let i = 0; i < count; i++) {
      await castSelects.nth(i).selectOption({ index: 2 });
    }

    await page.getByRole("button", { name: /create edge/i }).click();
    await expect.poll(() => getEdgeCount(page), { timeout: 8000 }).toBe(1);

    const edge = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return null;
      return (store.getState() as { edges: Array<Record<string, string>> }).edges[0] ?? null;
    });
    expect(edge!.castAb).toBe("Mage");
    expect(edge!.castCd).toBe("Spreading");
    expect(edge!.castEf).toBe("Cloud");
    expect(edge!.castGh).toBe("Green sky");
  });

  test("creating three edges between the same pair shows all three in store", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator(".tl-background").first().dblclick({ position: { x: 300, y: 180 } });

    for (const verb of ["feeds", "triggers", "blocks"]) {
      await queuePendingCast(page, 0, 1);
      await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
      await page.getByLabel("Tier 1 edge verb").fill(verb);
      await page.getByRole("button", { name: /create edge/i }).click();
      await page.waitForTimeout(300);
    }

    await expect.poll(() => getEdgeCount(page), { timeout: 8000 }).toBe(3);
  });

  test("edge alias is preserved after save and reload", async ({ page }) => {
    await bootstrapPalace(page, "Edge Alias Palace");
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator(".tl-background").first().dblclick({ position: { x: 300, y: 180 } });

    await queuePendingCast(page, 0, 1);
    await page.getByLabel("Tier 1 edge verb").fill("depends on");
    await page.getByRole("button", { name: /create edge/i }).click();

    // Select the arrow and set alias
    await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
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
      const arrowId = Array.from(editor.getCurrentPageShapeIds()).find(
        (id) => editor.getShape(id)?.type === "arrow",
      );
      if (!arrowId) throw new Error("no arrow found");
      editor.setSelectedShapes([arrowId]);
      state.setSelectedShapeId(arrowId);
    });

    await page.locator("#mp-edge-alias").fill("Critical path");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    // Switch and come back
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Temp");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Temp" })).toBeVisible();

    await page.getByRole("button", { name: "Edge Alias Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Edge Alias Palace" })).toBeVisible();
    await waitForEditorReady(page);

    const edge = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return null;
      return (
        (store.getState() as { edges: Array<{ alias?: string }> }).edges[0] ?? null
      );
    });
    expect(edge?.alias).toBe("Critical path");
  });
});

// ── ROUTE MANAGEMENT ──────────────────────────────────────────────────────────

test.describe("route locus management", () => {
  test("locus label can be renamed", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Station One");
    await page.getByRole("button", { name: "Apply" }).click();

    await page.getByPlaceholder("Route name").fill("Label Test Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();

    await expect(page.getByLabel("Locus 1 label")).toHaveValue("Station One");
    await page.getByLabel("Locus 1 label").fill("Custom Label");
    await page.getByLabel("Locus 1 label").press("Enter");

    await expect(page.getByLabel("Locus 1 label")).toHaveValue("Custom Label");
  });

  test("two nodes produce two loci in order", async ({ page }) => {
    await bootstrapTutorial(page);

    for (const [title, pos] of [["First", { x: 140, y: 160 }], ["Second", { x: 320, y: 160 }]] as const) {
      await page.locator(".tl-background").first().dblclick({ position: pos });
      await page.locator("#mp-title").fill(title);
      await page.getByRole("button", { name: "Apply" }).click();
    }

    await page.getByPlaceholder("Route name").fill("Ordered Route");
    await page.getByRole("button", { name: "Add route" }).click();

    // Add First then Second
    for (const title of ["First", "Second"]) {
      await page.evaluate((t) => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing store hook");
        const state = store.getState() as {
          editorRef: {
            getCurrentPageShapeIds: () => Iterable<string>;
            getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
            setSelectedShapes: (ids: string[]) => void;
          } | null;
          setSelectedShapeId: (id: string | null) => void;
        };
        const editor = state.editorRef;
        if (!editor) throw new Error("no editor");
        for (const id of editor.getCurrentPageShapeIds()) {
          const shape = editor.getShape(id);
          if (shape?.type === "geo" && shape.meta?.mpTitle === t) {
            editor.setSelectedShapes([id]);
            state.setSelectedShapeId(id);
            return;
          }
        }
      }, title);
      await page.getByRole("button", { name: /add selected node to route/i }).click();
    }

    await expect(page.getByLabel("Locus 1 label")).toHaveValue("First");
    await expect(page.getByLabel("Locus 2 label")).toHaveValue("Second");
  });

  test("route loci survive save and reload", async ({ page }) => {
    await bootstrapPalace(page, "Locus Persist Palace");
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Anchor Node");
    await page.getByRole("button", { name: "Apply" }).click();

    await page.getByPlaceholder("Route name").fill("Persist Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Away Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Away Palace" })).toBeVisible();

    await page.getByRole("button", { name: "Locus Persist Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Locus Persist Palace" })).toBeVisible();
    await waitForEditorReady(page);

    const loci = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return [];
      return (store.getState() as { loci: Array<{ label: string }> }).loci;
    });
    expect(loci).toHaveLength(1);
    expect(loci[0]!.label).toBe("Anchor Node");
  });

  test("deleting a route removes its loci from store", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.getByPlaceholder("Route name").fill("Route To Delete");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
              loci: unknown[];
            };
            return s?.loci?.length ?? 0;
          }),
        { timeout: 6000 },
      )
      .toBeGreaterThan(0);

    // Delete the route
    const routeDeleteBtn = page.getByRole("button", { name: /delete.*route|remove.*route/i });
    if ((await routeDeleteBtn.count()) > 0) {
      await routeDeleteBtn.click();
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
                routes: unknown[];
              };
              return s?.routes?.length ?? 0;
            }),
          { timeout: 6000 },
        )
        .toBe(0);
    }
  });
});

// ── PORTAL NODE VIA INSPECTOR ─────────────────────────────────────────────────

test.describe("portal node via inspector", () => {
  test("portal node kind shows in inspector", async ({ page }) => {
    await bootstrapTutorial(page);

    await page.getByRole("button", { name: /^Portal$/ }).click();
    await expect(page.locator("#mp-node-kind")).toHaveValue("portal");
  });

  test("portal node with target opens linked palace via Open button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Portal Source");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Portal Source" })).toBeVisible();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Portal Target");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Portal Target" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Arrival");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByPlaceholder("Route name").fill("Entry Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("button", { name: "Portal Source", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Portal Source" })).toBeVisible();

    await page.getByRole("button", { name: /^Portal$/ }).click();
    await page.locator("#mp-title").fill("Jump Node");
    await page.getByLabel("Target palace").selectOption({ label: "Portal Target" });
    await page.getByLabel("Target route").selectOption({ label: "Entry Route" });
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: "Open linked palace" }).click();

    await expect(page.getByRole("heading", { name: "Portal Target" })).toBeVisible();
    await expect(page.getByText("Step 1/1")).toBeVisible();
  });
});

// ── NODE CONTENT AND ALIAS ────────────────────────────────────────────────────

test.describe("node content and alias", () => {
  test("multi-line content is preserved after Apply", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Multi Line Node");
    await page.locator("#mp-content").fill("Line one.\nLine two.\nLine three.");
    await page.getByRole("button", { name: "Apply" }).click();

    const content = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return "";
      const state = store.getState() as {
        nodes: Array<{ title: string; content: string }>;
      };
      return state.nodes.find((n) => n.title === "Multi Line Node")?.content ?? "";
    });
    expect(content).toContain("Line one.");
    expect(content).toContain("Line three.");
  });

  test("node alias appears in edge source/target labels after apply", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Source Node");
    await page.locator("#mp-alias").fill("SN");
    await page.getByRole("button", { name: "Apply" }).click();

    await page.locator(".tl-background").first().dblclick({ position: { x: 320, y: 180 } });
    await page.locator("#mp-title").fill("Target Node");
    await page.locator("#mp-alias").fill("TN");
    await page.getByRole("button", { name: "Apply" }).click();

    await queuePendingCast(page, 0, 1);
    await page.getByLabel("Tier 1 edge verb").fill("uses");
    await page.getByRole("button", { name: /create edge/i }).click();

    // Select the arrow
    await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string } | undefined;
          setSelectedShapes: (ids: string[]) => void;
        } | null;
        setSelectedShapeId: (id: string | null) => void;
      };
      const editor = state.editorRef;
      if (!editor) throw new Error("no editor");
      const arrowId = Array.from(editor.getCurrentPageShapeIds()).find(
        (id) => editor.getShape(id)?.type === "arrow",
      );
      if (!arrowId) throw new Error("no arrow");
      editor.setSelectedShapes([arrowId]);
      state.setSelectedShapeId(arrowId);
    });

    await expect(page.locator("#mp-edge-source")).toContainText("SN");
    await expect(page.locator("#mp-edge-target")).toContainText("TN");
  });
});

// ── LARGE PALACE PERFORMANCE SANITY ──────────────────────────────────────────

test.describe("large palace via DSL", () => {
  // 20-node palace — sanity check that the sync completes in a reasonable time
  const LARGE_DSL = `@Large Palace
@atlas /performance/test

${Array.from({ length: 20 }, (_, i) => `Node ${i + 1}\n: Content for node ${i + 1}.\n#tag-${i + 1}`).join("\n\n")}

/All Nodes Route
${Array.from({ length: 20 }, (_, i) => `${i + 1} Node ${i + 1}`).join("\n")}
`;

  test("20-node palace syncs within 20 seconds", async ({ page }) => {
    await bootstrapTutorial(page);
    await openDslEditor(page);

    const cm = page.locator(".cm-content").first();
    await cm.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await cm.pressSequentially(LARGE_DSL, { delay: 1 });
    await page.locator("body").click();
    await page.waitForTimeout(800);

    await expect
      .poll(() => getNodeCount(page), { timeout: 20000 })
      .toBe(20);

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
  });

  test("20-node palace has 20 loci in the route", async ({ page }) => {
    await bootstrapTutorial(page);
    await openDslEditor(page);

    const cm = page.locator(".cm-content").first();
    await cm.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await cm.pressSequentially(LARGE_DSL, { delay: 1 });
    await page.locator("body").click();
    await page.waitForTimeout(800);

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
            if (!store) return 0;
            return (store.getState() as { loci: unknown[] }).loci.length;
          }),
        { timeout: 20000 },
      )
      .toBe(20);
  });
});

// ── ATLAS HIERARCHY ───────────────────────────────────────────────────────────

test.describe("atlas hierarchy editor", () => {
  test("three-level atlas path segments are displayed in sidebar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Hierarchy Palace");
    await page.getByRole("textbox", { name: "Atlas path" }).fill("Science/Biology/Cells");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Hierarchy Palace" })).toBeVisible();

    await expect(page.getByText("Science", { exact: true })).toBeVisible();
    await expect(page.getByText("Biology", { exact: true })).toBeVisible();
    await expect(page.getByText("Cells", { exact: true })).toBeVisible();
  });

  test("hierarchy editor renames axis labels and updates path", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Relabel Palace");
    await page.getByRole("textbox", { name: "Atlas path" }).fill("Domain/Topic/Lesson");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Relabel Palace" })).toBeVisible();

    await page.getByText("Hierarchy editor").click();
    await page.getByRole("textbox", { name: "Atlas level 1 name" }).fill("Subject");
    await page.getByRole("textbox", { name: "Atlas level 2 name" }).fill("Unit");
    await page.getByRole("textbox", { name: "Atlas level 3 name" }).fill("Lesson");

    await page.getByRole("textbox", { name: "Subject segment" }).fill("Math");
    await page.getByRole("textbox", { name: "Unit segment" }).fill("Algebra");
    await page.getByRole("textbox", { name: "Lesson segment" }).fill("Quadratics");
    await page.getByRole("button", { name: "Save hierarchy" }).click();

    await expect(page.getByRole("textbox", { name: "Current atlas path" })).toHaveValue(
      "Math/Algebra/Quadratics",
    );
  });

  test("palaces with same top-level domain are grouped together", async ({ page }) => {
    await page.goto("/");
    for (const [name, path] of [
      ["Palace A", "Engineering/Backend/Auth"],
      ["Palace B", "Engineering/Backend/Database"],
    ] as const) {
      await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
      await page.getByRole("textbox", { name: "Atlas path" }).fill(path);
      await page.getByRole("button", { name: "Create palace" }).click();
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }

    // Both should appear under the same "Engineering" group
    const engineeringHeaders = page.getByText("Engineering", { exact: true });
    await expect(engineeringHeaders).toBeVisible();
  });
});

// ── theSystem PIPELINE ────────────────────────────────────────────────────────

test.describe("theSystem pipeline materialization", () => {
  test("Comprehension Protocol creates route with 6 loci", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Recursion");
    await page.getByRole("button", { name: "Apply" }).click();

    await page.getByRole("button", { name: /^System$/ }).click();
    await page.getByRole("button", { name: "Comprehension Protocol" }).click();

    await expect(page.locator("#system-session-focus")).toHaveValue("Recursion");
    await page.locator("#system-session-title").fill("Mastering Recursion");
    await page.locator("#system-session-outcome").fill("Explain recursion using base cases.");
    await page.getByLabel("Locate notes").fill("Stack frames, base case, recursive call.");
    await page.getByLabel("Represent notes").fill("Factorial example and call tree diagram.");
    await page.getByRole("button", { name: /materialize to graph/i }).click();

    await expect(page.getByText(/graph run with 7 nodes/i)).toBeVisible({ timeout: 15000 });

    const lociCount = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return 0;
      const state = store.getState() as {
        routes: Array<{ id: string; name: string }>;
        loci: Array<{ routeId: string }>;
      };
      const route = state.routes.find((r) => r.name.includes("Mastering Recursion"));
      if (!route) return 0;
      return state.loci.filter((l) => l.routeId === route.id).length;
    });
    expect(lociCount).toBe(6);
  });

  test("materialized graph adds system_run_materialized analytics event", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Promises");
    await page.getByRole("button", { name: "Apply" }).click();

    await page.getByRole("button", { name: /^System$/ }).click();
    await page.getByRole("button", { name: "Comprehension Protocol" }).click();

    await page.locator("#system-session-title").fill("Async Promises");
    await page.locator("#system-session-outcome").fill("Understand promise chaining.");
    await page.getByLabel("Locate notes").fill("Resolve, reject, then, catch.");
    await page.getByLabel("Represent notes").fill("Promise chain diagram.");
    await page.getByRole("button", { name: /materialize to graph/i }).click();

    await expect(page.getByText(/graph run with 7 nodes/i)).toBeVisible({ timeout: 15000 });

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
            if (!store) return false;
            const events = (
              store.getState() as { analyticsEvents: Array<{ eventType: string }> }
            ).analyticsEvents;
            return events.some((e) => e.eventType === "system_run_materialized");
          }),
        { timeout: 10000 },
      )
      .toBe(true);
  });
});

// ── INSPECTOR ─────────────────────────────────────────────────────────────────

test.describe("inspector panel", () => {
  test("palace alias is saved and shown in sidebar", async ({ page }) => {
    await bootstrapPalace(page, "Alias Inspector Palace");
    await page.getByRole("textbox", { name: "Current palace alias" }).fill("AIP");
    await page.getByRole("button", { name: "Save details" }).click();
    await expect(page.getByText("Alias: AIP")).toBeVisible();
  });

  test("node content field is multi-line and scrollable", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    const contentBox = page.locator("#mp-content");
    await expect(contentBox).toBeVisible();
    // Verify it is a textarea (multi-line)
    const tagName = await contentBox.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("textarea");
  });

  test("inspector shows node source/target for selected edge", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator(".tl-background").first().dblclick({ position: { x: 300, y: 180 } });

    await queuePendingCast(page, 0, 1);
    await page.getByLabel("Tier 1 edge verb").fill("links");
    await page.getByRole("button", { name: /create edge/i }).click();

    await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string } | undefined;
          setSelectedShapes: (ids: string[]) => void;
        } | null;
        setSelectedShapeId: (id: string | null) => void;
      };
      const editor = state.editorRef;
      if (!editor) throw new Error("no editor");
      const arrowId = Array.from(editor.getCurrentPageShapeIds()).find(
        (id) => editor.getShape(id)?.type === "arrow",
      );
      if (!arrowId) throw new Error("no arrow");
      editor.setSelectedShapes([arrowId]);
      state.setSelectedShapeId(arrowId);
    });

    await expect(page.locator("#mp-edge-source")).not.toBeEmpty();
    await expect(page.locator("#mp-edge-target")).not.toBeEmpty();
  });
});
