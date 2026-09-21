import { expect, test, type Page } from "@playwright/test";
import {
  canvasView,
  clickStops,
  countSnapshotNodes,
  createNamedNodes,
  howCanvasShows,
  nodeCenter,
  openTutorialPalace,
  routeSummary,
  zoomTowardsNode,
} from "./routeHelpers";

/** Number of memory-node shapes on the current canvas, read through the dev store hook. */
function countNodeShapes(page: Page): Promise<number> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    return Array.from(editor.getCurrentPageShapeIds()).filter((id) => {
      const shape = editor.getShape(id);
      return shape?.type === "geo" && !!shape.meta?.mpNodeId;
    }).length;
  });
}

test("contextual primary hint and idle tip adapt to current state", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("mp-idle-tip-delay-ms", "80");
  });
  await page.goto("/");

  await expect(page.locator("#context-primary-hint")).toContainText("Create or open a palace");
  await expect(page.getByTestId("context-tip-card")).toBeVisible();
  await page.mouse.move(32, 32);
  await expect(page.getByTestId("context-tip-card")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByTestId("context-tip-card")).toBeVisible();
  await page.getByRole("button", { name: "Dismiss tip" }).click();
  await expect(page.getByTestId("context-tip-card")).toHaveCount(0);

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect(page.locator("#context-primary-hint")).toContainText("Seed this palace with a few anchor nodes");
});

test("shell pages and layout workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Memory Palace Lab")).toBeVisible();
  await page.getByRole("button", { name: /^System$/ }).click();
  await expect(page.getByText("graph-native thinking workflows")).toBeVisible();
  await expect(page.getByRole("button", { name: "Comprehension Protocol" })).toBeVisible();
  await page.getByRole("button", { name: /Read the guide/ }).first().click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByLabel("Search the Library")).toBeVisible();
  await expect(page.getByRole("heading", { name: /NAVIGATOR/ })).toBeVisible();
  await expect(page.locator("#the-system-doc-content")).toContainText("Acronym = order");
  await expect(page.getByRole("tablist", { name: "Document sections" })).toBeVisible();
  await page.getByRole("tab", { name: "Narrow" }).click();
  await expect(page.locator("#the-system-doc-content")).toContainText("Success criteria");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Phases" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Start here" }).click();
  await expect(page.getByRole("heading", { name: "Lesson 1 - Build your first palace" })).toBeVisible();

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.locator(".tl-canvas").dblclick({ position: { x: 240, y: 200 } });
  await expect(page.locator("#mp-title")).toHaveValue("New node");

  // Routes live in a tab beside the inspector; a new route starts Route mode.
  await page.getByRole("tab", { name: /Routes/ }).click();
  await page.getByRole("button", { name: "Create route" }).click();
  await expect(page.getByRole("region", { name: "Route Route 1" })).toBeVisible();
  const banner = page.getByTestId("route-build-banner");
  await expect(banner).toContainText("Click nodes in walk order");
  await banner.getByRole("button", { name: "Done" }).click();
  await expect(banner).toHaveCount(0);

  await page.locator('button[title="Focus mode"]').click();
  await expect(page.getByRole("heading", { name: "Palaces" })).toHaveCount(0);

  await page.locator('button[title="Balanced layout"]').click();
  await expect(page.getByRole("heading", { name: "Palaces" })).toBeVisible();

  await page.getByRole("button", { name: "Reset", exact: true }).click();
});

test("command palette opens pages and runs graph actions", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Control+K");
  await expect(page.getByLabel("Command palette search")).toBeVisible();
  await page.getByLabel("Command palette search").fill("library");
  await page.getByRole("button", { name: "Open Library Guides, wiki, glossary, and lessons" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.keyboard.press("Control+K");
  await page.getByLabel("Command palette search").fill("dsl");
  await page.getByRole("button", { name: /Toggle DSL editor/ }).click();
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();

  await page.getByRole("button", { name: "Portal", exact: true }).click();
  await expect.poll(() => countNodeShapes(page)).toBeGreaterThan(0);

  await page.keyboard.press("Control+K");
  await page.getByLabel("Command palette search").fill("insights");
  await page.getByRole("button", { name: "Open Insights Analytics and memory strength" }).click();
  await expect(page.getByText("What is tracked")).toBeVisible();
});

test("atlas path groups palaces into nested places", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Atlas Palace");
  await page.getByRole("textbox", { name: "Atlas path" }).fill("Georgia/Tbilisi/Vake");
  await page.getByRole("button", { name: "Create palace" }).click();

  await expect(page.getByRole("heading", { name: "Atlas Palace" })).toBeVisible();
  await expect(page.getByText("Georgia", { exact: true })).toBeVisible();
  await expect(page.getByText("Tbilisi", { exact: true })).toBeVisible();
  await expect(page.getByText("Vake", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Current atlas path" })).toHaveValue("Georgia/Tbilisi/Vake");

  await page.getByText("Hierarchy editor").click();
  await expect(page.getByRole("textbox", { name: "Domain segment" })).toHaveValue("Georgia");
  await expect(page.getByRole("textbox", { name: "Place segment" })).toHaveValue("Tbilisi");
  await expect(page.getByRole("textbox", { name: "Section segment" })).toHaveValue("Vake");

  await page.getByRole("textbox", { name: "Atlas level 1 name" }).fill("Subject");
  await page.getByRole("textbox", { name: "Atlas level 2 name" }).fill("Topic");
  await page.getByRole("textbox", { name: "Atlas level 3 name" }).fill("Lesson");
  await page.getByRole("textbox", { name: "Subject segment" }).fill("Math");
  await page.getByRole("textbox", { name: "Topic segment" }).fill("Algebra");
  await page.getByRole("textbox", { name: "Lesson segment" }).fill("Quadratics");
  await page.getByRole("button", { name: "Save hierarchy" }).click();

  await expect(page.getByRole("textbox", { name: "Current atlas path" })).toHaveValue("Math/Algebra/Quadratics");
  await expect(page.getByText("Math", { exact: true })).toBeVisible();
  await expect(page.getByText("Algebra", { exact: true })).toBeVisible();
  await expect(page.getByText("Quadratics", { exact: true })).toBeVisible();
});

/** 1x1 red PNG; enough for the background picker, which only needs a decodable image. */
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

type BackgroundProbe = {
  ids: string[];
  locked: boolean;
  x: number;
  behindEveryNode: boolean;
  /** Screen point over the background that does not hit a node (for dragging). */
  dragPoint: { x: number; y: number } | null;
};

/** Reads the background shape(s) through the dev store hook. */
function probeBackground(page: Page): Promise<BackgroundProbe> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    type Shape = { id: string; type: string; index: string; isLocked: boolean; x: number; meta?: Record<string, unknown> };
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => Shape | undefined;
        getShapePageBounds: (id: string) => { x: number; y: number; w: number; h: number } | undefined;
        getShapeAtPoint: (point: { x: number; y: number }, opts: { hitInside: boolean; hitLocked: boolean }) => Shape | undefined;
        pageToScreen: (point: { x: number; y: number }) => { x: number; y: number };
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const shapes = Array.from(editor.getCurrentPageShapeIds())
      .map((id) => editor.getShape(id))
      .filter((shape): shape is Shape => !!shape);
    const backgrounds = shapes.filter((shape) => shape.type === "image" && !!shape.meta?.mpBackground);
    const nodes = shapes.filter((shape) => shape.type === "geo" && !!shape.meta?.mpNodeId);
    const first = backgrounds[0];
    let dragPoint: { x: number; y: number } | null = null;
    if (first) {
      const bounds = editor.getShapePageBounds(first.id);
      if (bounds) {
        outer: for (let row = 1; row < 10; row += 1) {
          for (let col = 1; col < 10; col += 1) {
            const point = { x: bounds.x + (bounds.w * col) / 10, y: bounds.y + (bounds.h * row) / 10 };
            const hit = editor.getShapeAtPoint(point, { hitInside: true, hitLocked: true });
            if (hit?.id === first.id) {
              dragPoint = editor.pageToScreen(point);
              break outer;
            }
          }
        }
      }
    }
    return {
      ids: backgrounds.map((shape) => shape.id),
      locked: backgrounds.every((shape) => shape.isLocked),
      x: first?.x ?? 0,
      behindEveryNode: !!first && nodes.every((node) => first.index < node.index),
      dragPoint,
    };
  });
}

test("palace background can be set, adjusted, locked, replaced, and removed", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  // One node placed before the background proves the image lands behind it.
  await page.locator(".tl-canvas").dblclick({ position: { x: 240, y: 200 } });
  await expect(page.locator("#mp-title")).toHaveValue("New node");
  await page.keyboard.press("Escape");
  await expect.poll(() => countNodeShapes(page)).toBe(1);
  const nodeCount = 1;

  // The picker is a detached <input type="file">; Playwright still sees the chooser.
  const firstChooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Set background" }).click();
  await (await firstChooser).setFiles({ name: "bg.png", mimeType: "image/png", buffer: TINY_PNG });

  await expect(page.getByRole("button", { name: "Replace background" })).toBeVisible();
  await expect.poll(async () => (await probeBackground(page)).ids.length).toBe(1);
  const placed = await probeBackground(page);
  expect(placed.locked).toBe(true);
  expect(placed.behindEveryNode).toBe(true);

  // Adjust: unlock, then drag it somewhere else.
  await page.getByRole("button", { name: "Adjust background" }).click();
  await expect(page.getByRole("button", { name: "Lock background" })).toBeVisible();
  const editable = await probeBackground(page);
  expect(editable.locked).toBe(false);
  expect(editable.dragPoint).not.toBeNull();
  const from = editable.dragPoint!;
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + 120, from.y + 60, { steps: 10 });
  await page.mouse.up();
  await expect.poll(async () => (await probeBackground(page)).x).not.toBe(editable.x);

  // Lock: clicks pass through again and the image stays behind the nodes.
  await page.getByRole("button", { name: "Lock background" }).click();
  await expect(page.getByRole("button", { name: "Adjust background" })).toBeVisible();
  const locked = await probeBackground(page);
  expect(locked.locked).toBe(true);
  expect(locked.behindEveryNode).toBe(true);

  // Replace swaps the image instead of stacking a second one.
  const secondChooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Replace background" }).click();
  await (await secondChooser).setFiles({ name: "bg2.png", mimeType: "image/png", buffer: TINY_PNG });
  await expect.poll(async () => (await probeBackground(page)).ids).not.toEqual(locked.ids);
  expect((await probeBackground(page)).ids).toHaveLength(1);

  await page.getByRole("button", { name: "Remove background" }).click();
  await expect(page.getByRole("button", { name: "Set background" })).toBeVisible();
  expect((await probeBackground(page)).ids).toHaveLength(0);
  expect(await countNodeShapes(page)).toBe(nodeCount);
});

test("node content format bar shows while editing and formats the selection", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.locator(".tl-canvas").dblclick({ position: { x: 240, y: 200 } });
  await expect(page.locator("#mp-title")).toHaveValue("New node");
  // The draft save after creating a node re-syncs the inspector from the canvas; let it land first.
  await expect.poll(() => countSnapshotNodes(page)).toBe(1);

  const content = page.locator("#mp-content");
  const bold = page.getByRole("button", { name: "Bold", exact: true });
  await expect(bold).toHaveCount(0);

  await content.click();
  await expect(bold).toBeVisible();
  await page.keyboard.type("Bold me");
  await page.keyboard.press("Shift+Home");
  await bold.click();
  await expect(content.locator("b, strong")).toHaveText("Bold me");
  await expect(bold).toBeVisible();

  // Leaving the editor hides the bar and keeps the formatting.
  await page.locator("#mp-title").click();
  await expect(bold).toHaveCount(0);
  await expect(content.locator("b, strong")).toHaveText("Bold me");
});

test("routes are built by clicking nodes, edited in the Routes tab, and drawn on the canvas", async ({ page }) => {
  await openTutorialPalace(page);
  const titles = ["Front door", "Hallway mirror", "Kitchen sink"];
  await createNamedNodes(page, titles);
  await expect.poll(async () => (await routeSummary(page)).length).toBe(0);

  // Route mode: the toolbar button creates "Route 1" and each click adds the next stop.
  await page.getByRole("button", { name: "Route", exact: true }).click();
  const banner = page.getByTestId("route-build-banner");
  await expect(banner).toContainText("Click nodes in walk order to build Route 1");
  await clickStops(page, ["Front door", "Hallway mirror"]);
  await expect(banner).toContainText("Added Hallway mirror as stop 2");
  await clickStops(page, ["Front door"]);
  await expect(banner).toContainText("Front door is already stop 1");
  await clickStops(page, ["Kitchen sink"]);
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(titles);
  const sink = await nodeCenter(page, "Kitchen sink");

  const overlay = page.getByTestId("route-overlay");
  await expect(overlay.locator("[data-route-stop]")).toHaveCount(3);
  await expect(overlay.locator("[data-route-path] line")).toHaveCount(2);

  await page.keyboard.press("Escape");
  await expect(banner).toHaveCount(0);

  // Reorder with the keyboard, then remove a stop and undo.
  const routeCard = page.getByRole("region", { name: "Route Route 1" });
  await routeCard.getByRole("button", { name: "Move stop 3, Kitchen sink", exact: true }).press("Home");
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual([
    "Kitchen sink",
    "Front door",
    "Hallway mirror",
  ]);
  await routeCard.getByRole("button", { name: "Remove stop 2, Front door", exact: true }).click();
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(["Kitchen sink", "Hallway mirror"]);
  await page.getByTestId("routes-panel").getByRole("button", { name: "Undo" }).click();
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual([
    "Kitchen sink",
    "Front door",
    "Hallway mirror",
  ]);

  // Color and visibility.
  await routeCard.getByRole("button", { name: "Color of Route 1: Violet" }).click();
  await page.getByRole("menuitem", { name: "Emerald" }).click();
  await expect(overlay.locator("[data-route-path]")).toHaveAttribute("stroke", "#34d399");
  await routeCard.getByRole("button", { name: "Show Route 1 on the canvas" }).click();
  await expect(overlay).toHaveCount(0);
  await routeCard.getByRole("button", { name: "Show Route 1 on the canvas" }).click();
  await expect(overlay).toHaveCount(1);

  // A second route from the node inspector; the shared node carries both stop numbers.
  await page.mouse.click(sink.x, sink.y);
  await page.getByRole("tab", { name: "Node" }).click();
  await expect(page.locator("#mp-title")).toHaveValue("Kitchen sink");
  await page.getByRole("button", { name: "Add to route" }).click();
  await page.getByRole("menuitem", { name: "New route starting here" }).click();
  await expect.poll(() => routeSummary(page)).toEqual([
    { name: "Route 1", color: "emerald", hidden: false, stops: ["Kitchen sink", "Front door", "Hallway mirror"] },
    { name: "Route 2", color: "violet", hidden: false, stops: ["Kitchen sink"] },
  ]);
  await expect(overlay.locator("[data-route-stop]")).toHaveCount(4);

  // Walk the first route from the walk bar.
  await page.getByRole("combobox", { name: "Walk route" }).selectOption({ label: "Route 1" });
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/3")).toBeVisible();
  await expect(page.locator("#walk-cue")).toHaveText("Kitchen sink");
  await page.keyboard.press("Escape");

  // Colors and order survive a checkpoint and a reload.
  await page.getByRole("button", { name: /save checkpoint|checkpoint now/i }).click();
  await expect(page.getByRole("button", { name: /save checkpoint/i })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Tutorial Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect.poll(() => routeSummary(page)).toEqual([
    { name: "Route 1", color: "emerald", hidden: false, stops: ["Kitchen sink", "Front door", "Hallway mirror"] },
    { name: "Route 2", color: "violet", hidden: false, stops: ["Kitchen sink"] },
  ]);
});

test("each stop keeps the view it was added in, and walks return to it", async ({ page }) => {
  await openTutorialPalace(page);
  await createNamedNodes(page, ["Gate", "Porch"]);

  await page.getByRole("button", { name: "Route", exact: true }).click();
  const banner = page.getByTestId("route-build-banner");
  await expect(banner.getByRole("button", { name: "Save the view with each stop" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  // Frame each stop before clicking it: close in on the gate, then pull back for the porch.
  await zoomTowardsNode(page, "Gate", 3);
  await clickStops(page, ["Gate"]);
  await expect(banner).toContainText("Added Gate as stop 1 with this view");
  const gateView = await canvasView(page);

  await zoomTowardsNode(page, "Gate", -6);
  await clickStops(page, ["Porch"]);
  await expect(banner).toContainText("Added Porch as stop 2 with this view");
  const porchView = await canvasView(page);
  expect(porchView.zoom).toBeLessThan(gateView.zoom * 0.7);
  await page.keyboard.press("Escape");

  // Walking returns to each stop's view, fitted to the canvas as the walk bar resizes it.
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
  await expect.poll(() => howCanvasShows(page, gateView)).toBe("fitted");
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await expect.poll(() => howCanvasShows(page, porchView)).toBe("fitted");
  await page.keyboard.press("Escape");

  // Clicking a stop in the Routes tab shows its view too, and the views survive a reload.
  const routeCard = page.getByRole("region", { name: "Route Route 1" });
  await routeCard.getByRole("button", { name: "Gate", exact: true }).click();
  await expect.poll(() => howCanvasShows(page, gateView)).toBe("fitted");

  await page.getByRole("button", { name: /save checkpoint|checkpoint now/i }).click();
  await expect(page.getByRole("button", { name: /save checkpoint/i })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Tutorial Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await page.getByRole("tab", { name: /Routes/ }).click();
  const reloadedCard = page.getByRole("region", { name: "Route Route 1" });
  await expect(reloadedCard.getByRole("button", { name: "Saved view of stop 2, Porch" })).toBeVisible();
  await reloadedCard.getByRole("button", { name: "Porch", exact: true }).click();
  await expect.poll(() => howCanvasShows(page, porchView)).toBe("fitted");
});

const SOLID_CITADEL_DSL = `@SOLID Citadel
@atlas /engineering/oop

~dep:0001 depends on
!import shared.dsl as sh

[gate] Gate of SOLID
: Central fortress connecting five engineering districts.
: Giant glowing word "SOLID" above the gate.
#architecture #clean-code #solid #difficulty:beginner
>Single Responsibility Forge 0001
>Open Closed Library dep

Single Responsibility Forge
: Blacksmith focuses {#gate on the gate} — one thing only.
#cohesion #maintenance #srp
>Change Hydra 1000

/SOLID Main Route
#difficulty:beginner
1 Gate of SOLID
2 Single Responsibility Forge

?tag difficulty:beginner
?path Gate of SOLID Single Responsibility Forge
`;

test("DSL editor applies a document that creates new nodes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.keyboard.press("Control+K");
  await page.getByLabel("Command palette search").fill("dsl");
  await page.getByRole("button", { name: /Toggle DSL editor/ }).click();
  const dslEditor = page.getByTestId("palace-dsl-editor");
  await expect(dslEditor).toBeVisible();

  await dslEditor.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(SOLID_CITADEL_DSL);

  const status = page.getByTestId("palace-dsl-status");
  await expect.poll(() => countNodeShapes(page)).toBe(2);
  await expect(status).toContainText("0 errors");
  await expect(status).not.toContainText("apply failed");
  await expect(status).toContainText(/last applied \d/);
});

/** The ids the canvas carries. They are primary keys on disk, so they have to stay apart. */
function memoryIds(page: Page): Promise<{ nodeIds: string[]; objectIds: string[] }> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const editor = (
      store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; meta?: Record<string, string> } | undefined;
        } | null;
      }
    ).editorRef;
    if (!editor) throw new Error("editor not ready");
    const nodeIds: string[] = [];
    const objectIds: string[] = [];
    for (const id of editor.getCurrentPageShapeIds()) {
      const meta = editor.getShape(id)?.meta;
      if (!meta?.mpNodeId || !meta.mpObjectId) continue;
      nodeIds.push(meta.mpNodeId);
      objectIds.push(meta.mpObjectId);
    }
    return { nodeIds, objectIds };
  });
}

test("a node duplicated on the canvas becomes a node of its own", async ({ page }) => {
  await openTutorialPalace(page);
  await createNamedNodes(page, ["The Law"]);
  const before = await countSnapshotNodes(page);

  const center = await nodeCenter(page, "The Law");
  await page.mouse.click(center.x, center.y, { button: "right" });
  await page.getByRole("button", { name: /^Duplicate/ }).click();

  // Copying a shape copies its meta. Without ids of its own, the copy is the same row
  // twice, and saving the palace fails on "UNIQUE constraint failed: canvas_objects.id".
  await expect.poll(() => countSnapshotNodes(page)).toBe(before + 1);
  const { nodeIds, objectIds } = await memoryIds(page);
  expect(nodeIds).toHaveLength(before + 1);
  expect(new Set(nodeIds).size).toBe(nodeIds.length);
  expect(new Set(objectIds).size).toBe(objectIds.length);
  await expect(page.getByText(/Saving palace .* failed/)).toHaveCount(0);
});

test("toolbar tools stay clear of the save status button when side panels narrow the bar", async ({ page }) => {
  // A new palace opens with the Learn panel showing, which leaves the toolbar about half
  // of a 1280px window. The tools used to run on under the status button, which then took
  // the clicks meant for Save Checkpoint.
  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Narrow Toolbar Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Narrow Toolbar Palace" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close learn panel" })).toBeVisible();

  for (const width of [1280, 1024]) {
    await page.setViewportSize({ width, height: 720 });
    const covered = await page.evaluate(() => {
      const status = document.querySelector('button[aria-label="Storage and save status"]')!;
      const statusBlock = status.parentElement!;
      const bar = statusBlock.parentElement!;
      const edge = statusBlock.getBoundingClientRect();
      return [...bar.querySelectorAll("button")]
        .filter((button) => !statusBlock.contains(button))
        .filter((button) => {
          const box = button.getBoundingClientRect();
          return box.width > 0 && box.right > edge.left + 1 && box.bottom > edge.top && box.top < edge.bottom;
        })
        .map((button) => button.textContent?.trim() || button.title);
    });
    expect(covered, `tools under the status button at ${width}px`).toEqual([]);
  }

  await page.locator('button[title*="heckpoint"]').click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as { __mp_store?: { getState: () => { persistenceState: string } } }).__mp_store!.getState()
            .persistenceState,
      ),
    )
    .toBe("clean");
});

/** Parts of the canvas painted on top anywhere in the window, found by hit-testing a grid. */
function canvasUiOnTop(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const found = new Set<string>();
    for (let y = 4; y < innerHeight; y += 16) {
      for (let x = 4; x < innerWidth; x += 16) {
        const hit = document.elementFromPoint(x, y);
        if (!hit?.closest(".tl-container")) continue;
        found.add(hit.closest("[data-testid]")?.getAttribute("data-testid") ?? hit.className.toString());
      }
    }
    return [...found];
  });
}

test("the canvas's own controls stay under the app's dialogs", async ({ page }) => {
  // tldraw sets no stacking context, so its panels (z-index 300) used to outrank the app's
  // dialogs (z-50 to z-140): its tools stayed clickable through a dialog, and its style
  // panel covered the CAST quick reference's Close button.
  await openTutorialPalace(page);
  await createNamedNodes(page, ["Dialog Source", "Dialog Target"]);
  expect(await canvasUiOnTop(page), "tldraw controls are visible with no dialog open").toContain("tools.select");

  await page.keyboard.press("Control+K");
  await expect(page.getByLabel("Command palette search")).toBeVisible();
  expect(await canvasUiOnTop(page), "canvas controls over the command palette").toEqual([]);
  await page.keyboard.press("Escape");

  await page.evaluate(() => {
    type Shape = { id: string; meta?: { mpNodeId?: string; mpTitle?: string } };
    type State = {
      editorRef: { getCurrentPageShapeIds: () => Iterable<string>; getShape: (id: string) => Shape | undefined };
      setPendingCast: (cast: { fromShapeId: string; toShapeId: string; sourceNodeId: string; targetNodeId: string }) => void;
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const byTitle = (title: string) =>
      [...state.editorRef.getCurrentPageShapeIds()]
        .map((id) => state.editorRef.getShape(id)!)
        .find((shape) => shape.meta?.mpTitle === title)!;
    const [from, to] = [byTitle("Dialog Source"), byTitle("Dialog Target")];
    state.setPendingCast({
      fromShapeId: from.id,
      toShapeId: to.id,
      sourceNodeId: from.meta!.mpNodeId!,
      targetNodeId: to.meta!.mpNodeId!,
    });
  });
  await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
  expect(await canvasUiOnTop(page), "canvas controls over the connect dialog").toEqual([]);

  await page.getByRole("button", { name: "?" }).click();
  await expect(page.getByRole("heading", { name: "CAST quick reference" })).toBeVisible();
  expect(await canvasUiOnTop(page), "canvas controls over the CAST quick reference").toEqual([]);
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("heading", { name: "CAST quick reference" })).toHaveCount(0);
});
