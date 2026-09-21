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
import {
  addNode,
  addSelectedToRoute,
  applyInspector,
  createRoute,
  editSelectedNode,
  openNodeTab,
} from "./nodeHelpers";
import { openTutorialPalace, routeSummary } from "./routeHelpers";

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
  // Closes the Learn panel too, so the canvas has room for new nodes.
  await openTutorialPalace(page);
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

/** The store's `edges` are the last saved snapshot; the draft save after an edit refreshes it. */
async function waitForSavedEdges(page: import("@playwright/test").Page, count: number) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        return (store?.getState() as { edges: unknown[] } | undefined)?.edges.length ?? 0;
      }),
    )
    .toBe(count);
}

async function queuePendingCast(
  page: import("@playwright/test").Page,
  fromIndex: number | string,
  toIndex: number | string,
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
      const nodes: Array<{ shapeId: string; nodeId: string; x: number; title: unknown }> = [];
      for (const shapeId of editor.getCurrentPageShapeIds()) {
        const shape = editor.getShape(shapeId);
        const nodeId =
          shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
        if (nodeId) nodes.push({ shapeId, nodeId, x: shape?.x ?? 0, title: shape?.meta?.mpTitle });
      }
      nodes.sort((a, b) => a.x - b.x);
      // A number picks by left-to-right position, a string by node title.
      const pick = (key: number | string | undefined) =>
        typeof key === "string" ? nodes.find((node) => node.title === key) : nodes[key!];
      const from = pick(fi);
      const to = pick(ti);
      if (!from || !to) throw new Error(`need nodes at indices ${fi} and ${ti}`);
      state.setPendingCast({
        fromShapeId: from.shapeId,
        toShapeId: to.shapeId,
        sourceNodeId: from.nodeId,
        targetNodeId: to.nodeId,
      });
    },
    [fromIndex, toIndex] as const,
  );
}

/** The toolbar save button reads "Checkpoint Now" while there are unsaved or draft edits. */
async function saveCheckpoint(page: import("@playwright/test").Page) {
  // With the Learn panel open the toolbar is too narrow at 1280px: the storage status
  // button is laid over the save button and takes the click.
  const learnClose = page.getByRole("button", { name: "Close learn panel" });
  if (await learnClose.isVisible()) await learnClose.click();
  await page.getByRole("button", { name: /Save Checkpoint|Checkpoint Now/ }).click();
}

/** Saved content (HTML from the rich-text editor) of the node with this title. */
function savedContent(page: import("@playwright/test").Page, title: string) {
  return page.evaluate((t) => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) return "";
    const state = store.getState() as { nodes: Array<{ title: string; content: string }> };
    return state.nodes.find((n) => n.title === t)?.content ?? "";
  }, title);
}

/** Select the first arrow on the canvas so the inspector shows that edge. */
async function selectFirstArrow(page: import("@playwright/test").Page) {
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

    const before = await getNodeCount(page);
    // Each addNode double-clicks a different free spot on the canvas.
    for (let i = 0; i < 3; i++) {
      await addNode(page);
    }

    await expect.poll(() => getNodeCount(page), { timeout: 8000 }).toBe(before + 3);
    const positions = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      const editor = (
        store?.getState() as {
          editorRef: {
            getCurrentPageShapes: () => Array<{ x: number; y: number; meta?: Record<string, unknown> }>;
          } | null;
        }
      ).editorRef;
      if (!editor) return [];
      return editor
        .getCurrentPageShapes()
        .filter((shape) => !!shape.meta?.mpNodeId)
        .map((shape) => `${Math.round(shape.x)},${Math.round(shape.y)}`);
    });
    expect(new Set(positions).size).toBe(positions.length);
  });

  test("inspector updates title for each newly created node", async ({ page }) => {
    await bootstrapTutorial(page);
    await waitForEditorReady(page);

    await addNode(page);
    await editSelectedNode(page, { title: "Alpha" });

    await addNode(page);
    await expect(page.locator("#mp-title")).toHaveValue("New node");
    await editSelectedNode(page, { title: "Beta" });

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
  test("Tier 1 verb-only edge keeps its verb and the default one-way CAST profile", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await addNode(page);

    await queuePendingCast(page, 0, 1);
    await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
    await page.getByLabel("Tier 1 edge verb").fill("requires");
    await page.getByRole("button", { name: /create edge/i }).click();

    await expect.poll(() => getEdgeCount(page), { timeout: 8000 }).toBe(1);
    await waitForSavedEdges(page, 1);

    const edge = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return null;
      const state = store.getState() as {
        edges: Array<{ castAb: string; castCd: string; castEf: string; castGh: string }>;
      };
      return state.edges[0] ?? null;
    });
    expect(edge).not.toBeNull();
    // A Tier 1 edge is labelled with its verb. The dialog never stores empty CAST axes:
    // a one-way verb edge gets the fixed Tier 1 profile (Giant = one-way source role).
    expect(edge!.castAb).toBe("Giant");
    expect(edge!.castCd).toBe("Spreading");
    expect(edge!.castEf).toBe("Cloud");
    expect(edge!.castGh).toBe("Blue ocean");

    // The verb is the arrow's label, shown in the edge inspector.
    await selectFirstArrow(page);
    await expect(page.locator("#mp-edge-label")).toHaveValue("requires");
  });

  test("Tier 2 CAST profile 2222 encodes all four axes at index 2", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await addNode(page);

    await queuePendingCast(page, 0, 1);
    await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
    await page.getByRole("button", { name: "Tier 2 (Decoded CAST)" }).click();

    // Select index 2 on all four selectors (Mage / Spreading / Cloud / Green sky)
    for (const axis of ["CAST character", "CAST action", "CAST stream", "CAST time"]) {
      await page.getByLabel(axis).selectOption({ index: 2 });
    }

    await page.getByRole("button", { name: /create edge/i }).click();
    await expect.poll(() => getEdgeCount(page), { timeout: 8000 }).toBe(1);
    await waitForSavedEdges(page, 1);

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
    await addNode(page);
    await addNode(page);

    for (const verb of ["feeds", "triggers", "blocks"]) {
      await queuePendingCast(page, 0, 1);
      await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
      await page.getByLabel("Tier 1 edge verb").fill(verb);
      await page.getByRole("button", { name: /create edge/i }).click();
      await page.waitForTimeout(300);
    }

    await expect.poll(() => getEdgeCount(page), { timeout: 8000 }).toBe(3);
  });

  test("edge alias is preserved after save and reload", async ({ page }) => {
    await bootstrapPalace(page, "Edge Alias Palace");
    await addNode(page);
    await addNode(page);

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
    await applyInspector(page);
    await saveCheckpoint(page);

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
    await addNode(page);
    await editSelectedNode(page, { title: "Station One" });

    await createRoute(page, "Label Test Route");
    await addSelectedToRoute(page);

    // A stop is labelled with its node's title until it gets a label of its own.
    const route = page.getByRole("region", { name: "Route Label Test Route" });
    const stops = route.getByRole("list", { name: "Stops" }).getByRole("listitem");
    await expect(stops).toHaveCount(1);
    await expect(route.getByRole("button", { name: "Remove stop 1, Station One" })).toBeVisible();

    // Double-click the stop to rename it.
    await stops.first().getByRole("button", { name: "Station One", exact: true }).dblclick();
    await route.getByLabel("Label for stop 1").fill("Custom Label");
    await route.getByLabel("Label for stop 1").press("Enter");

    await expect(route.getByRole("button", { name: "Remove stop 1, Custom Label" })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
          return (store?.getState() as { loci: Array<{ label: string }> }).loci.map((l) => l.label);
        }),
      )
      .toEqual(["Custom Label"]);
  });

  test("two nodes produce two loci in order", async ({ page }) => {
    await bootstrapTutorial(page);

    for (const title of ["First", "Second"]) {
      await addNode(page);
      await editSelectedNode(page, { title });
    }

    await createRoute(page, "Ordered Route");

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
      await addSelectedToRoute(page);
    }

    const route = page.getByRole("region", { name: "Route Ordered Route" });
    await expect(route.getByRole("list", { name: "Stops" }).getByRole("listitem")).toHaveCount(2);
    await expect(route.getByRole("button", { name: "Remove stop 1, First" })).toBeVisible();
    await expect(route.getByRole("button", { name: "Remove stop 2, Second" })).toBeVisible();
    expect((await routeSummary(page)).find((r) => r.name === "Ordered Route")?.stops).toEqual([
      "First",
      "Second",
    ]);
  });

  test("route loci survive save and reload", async ({ page }) => {
    await bootstrapPalace(page, "Locus Persist Palace");
    await addNode(page);
    await editSelectedNode(page, { title: "Anchor Node" });

    await createRoute(page, "Persist Route");
    await addSelectedToRoute(page);
    await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(["Anchor Node"]);
    await saveCheckpoint(page);

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
    // A stop has no label of its own by default: it shows its node's title.
    expect(await routeSummary(page)).toMatchObject([{ name: "Persist Route", stops: ["Anchor Node"] }]);
    await expect(
      page
        .getByRole("region", { name: "Route Persist Route" })
        .getByRole("button", { name: "Remove stop 1, Anchor Node" }),
    ).toBeVisible();
  });

  test("deleting a route removes its loci from store", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    const routesBefore = (await routeSummary(page)).length;
    await createRoute(page, "Route To Delete");
    await addSelectedToRoute(page);

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

    // Delete the route from its menu; the app asks for confirmation first.
    page.once("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: "More actions for Route To Delete" }).click();
    await page.getByRole("menuitem", { name: "Delete route" }).click();

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
              routes: Array<{ id: string; name: string }>;
              loci: Array<{ routeId: string }>;
            };
            const routeIds = new Set(s.routes.map((r) => r.id));
            return {
              routes: s.routes.length,
              deletedStillThere: s.routes.some((r) => r.name === "Route To Delete"),
              orphanLoci: s.loci.filter((l) => !routeIds.has(l.routeId)).length,
            };
          }),
        { timeout: 6000 },
      )
      .toEqual({ routes: routesBefore, deletedStillThere: false, orphanLoci: 0 });
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

    await addNode(page);
    await editSelectedNode(page, { title: "Arrival" });
    await createRoute(page, "Entry Route");
    await addSelectedToRoute(page);
    await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(["Arrival"]);
    await saveCheckpoint(page);

    await page.getByRole("button", { name: "Portal Source", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Portal Source" })).toBeVisible();

    await page.getByRole("button", { name: /^Portal$/ }).click();
    await openNodeTab(page);
    await editSelectedNode(page, { title: "Jump Node" });
    await page.getByLabel("Target palace").selectOption({ label: "Portal Target" });
    await page.getByLabel("Target route").selectOption({ label: "Entry Route" });
    await applyInspector(page);
    await page.getByRole("button", { name: "Open linked palace" }).click();

    await expect(page.getByRole("heading", { name: "Portal Target" })).toBeVisible();
    await expect(page.getByText("Step 1/1")).toBeVisible();
  });
});

// ── NODE CONTENT AND ALIAS ────────────────────────────────────────────────────

test.describe("node content and alias", () => {
  test("multi-line content is preserved after Apply", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "Multi Line Node" });

    // Content is a rich-text editor: Enter starts a new line, and the node stores HTML.
    const editor = page.locator("#mp-content");
    await editor.click();
    await page.keyboard.type("Line one.");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Line two.");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Line three.");
    await applyInspector(page);

    await expect.poll(() => savedContent(page, "Multi Line Node")).toContain("Line three.");
    const content = await savedContent(page, "Multi Line Node");
    expect(content).toContain("Line one.");
    expect(content).toContain("Line two.");
    // The three lines are stored as separate lines, not run together.
    expect(content).not.toMatch(/Line one\.\s*Line two\./);
    await expect(editor).toHaveText(/Line one\.\s*Line two\.\s*Line three\./, { useInnerText: true });
    expect((await editor.innerText()).trim().split(/\n+/)).toEqual(["Line one.", "Line two.", "Line three."]);
  });

  test("node alias appears in edge source/target labels after apply", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "Source Node", alias: "SN" });

    await addNode(page);
    await editSelectedNode(page, { title: "Target Node", alias: "TN" });

    await queuePendingCast(page, "Source Node", "Target Node");
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
    await page.getByRole("textbox", { name: "Atlas path", exact: true }).fill("Science/Biology/Cells");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Hierarchy Palace" })).toBeVisible();

    await expect(page.getByText("Science", { exact: true })).toBeVisible();
    await expect(page.getByText("Biology", { exact: true })).toBeVisible();
    await expect(page.getByText("Cells", { exact: true })).toBeVisible();
  });

  test("hierarchy editor renames axis labels and updates path", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Relabel Palace");
    await page.getByRole("textbox", { name: "Atlas path", exact: true }).fill("Domain/Topic/Lesson");
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
      await page.getByRole("textbox", { name: "Atlas path", exact: true }).fill(path);
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
    await addNode(page);
    await editSelectedNode(page, { title: "Recursion" });

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
    await addNode(page);
    await editSelectedNode(page, { title: "Promises" });

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
    await addNode(page);
    const contentBox = page.locator("#mp-content");
    await expect(contentBox).toBeVisible();
    // Content is a rich-text (contenteditable) editor, which takes several lines.
    await expect(contentBox).toHaveAttribute("contenteditable", "true");
    await contentBox.click();
    await page.keyboard.type("First line");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Second line");
    expect((await contentBox.innerText()).trim().split(/\n+/)).toEqual(["First line", "Second line"]);
    // Long content scrolls inside the inspector instead of growing the page.
    const scrolls = await contentBox.evaluate((el) => {
      for (let parent = el.parentElement; parent; parent = parent.parentElement) {
        if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) return true;
      }
      return false;
    });
    expect(scrolls).toBe(true);
  });

  test("inspector shows node source/target for selected edge", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await addNode(page);

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
