import { expect, type Page } from "@playwright/test";
import { countSnapshotNodes, freeCanvasPoints } from "./routeHelpers";

/**
 * Add a memory node the way a user does: double-click empty canvas. The new node is
 * selected and the inspector shows it as "New node". Waits for the draft save that
 * follows, because that save re-syncs the inspector and would undo a title typed early.
 */
export async function addNode(page: Page) {
  const existing = await countSnapshotNodes(page);
  const [spot] = await freeCanvasPoints(page, 1);
  expect(spot, "free canvas space for a new node").toBeDefined();
  await page.mouse.dblclick(spot!.x, spot!.y);
  await expect(page.locator("#mp-title")).toHaveValue("New node");
  await expect.poll(() => countSnapshotNodes(page)).toBe(existing + 1);
}

/** Inspector fields save when they lose focus; there is no Apply button. */
export async function applyInspector(page: Page) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
}

/** Show the node inspector (`#mp-title`, `#mp-content`…); it shares the side panel with Routes. */
export async function openNodeTab(page: Page) {
  await page.getByRole("tab", { name: "Node", exact: true }).click();
}

/** Show the Routes tab of the side panel. */
export async function openRoutesTab(page: Page) {
  await page.getByRole("tab", { name: /^Routes/ }).click();
}

/**
 * Add an empty route from the Routes tab and leave Route mode, which a new route switches
 * on. New routes are named "Route N"; pass a name to rename it. Leaves the Routes tab open.
 */
export async function createRoute(page: Page, name?: string) {
  await openRoutesTab(page);
  const panel = page.getByTestId("routes-panel");
  const cards = panel.locator("[data-route-card]");
  const existing = await cards.count();
  await panel.getByRole("button", { name: "Create route" }).click();
  await page.getByTestId("route-build-banner").getByRole("button", { name: "Done" }).click();
  await expect(cards).toHaveCount(existing + 1);
  if (!name) return;
  // The new route is the active one: its name button is the expanded one.
  await panel.locator('[data-route-card][data-active="true"] button[aria-expanded="true"]').dblclick();
  const field = panel.getByRole("textbox", { name: "Route name" });
  await field.fill(name);
  await field.press("Enter");
  await expect(panel.getByRole("region", { name: `Route ${name}` })).toBeVisible();
}

/**
 * Add the nodes selected on the canvas to the active route, in selection order. A node
 * already in the route is skipped: a route holds each node once.
 */
export async function addSelectedToRoute(page: Page) {
  await openRoutesTab(page);
  await page.getByTestId("routes-panel").getByRole("button", { name: "Add selected" }).click();
  await page.getByRole("menuitem", { name: "In selection order" }).click();
}

/**
 * Select every memory node on the canvas, in the order they were created. Goes through the
 * editor rather than Ctrl+A, which needs a free spot to click and there may be none.
 */
export async function selectAllNodes(page: Page) {
  await page.evaluate(() => {
    type Editor = {
      getCurrentPageShapesSorted: () => { id: string; meta?: { mpNodeId?: string } }[];
      setSelectedShapes: (ids: string[]) => void;
    };
    const store = (window as { __mp_store?: { getState: () => { editorRef: Editor | null } } }).__mp_store;
    const editor = store?.getState().editorRef;
    if (!editor) throw new Error("editor not ready");
    editor.setSelectedShapes(
      editor
        .getCurrentPageShapesSorted()
        .filter((shape) => !!shape.meta?.mpNodeId)
        .map((shape) => shape.id),
    );
  });
}

type SavedNode = { title: string; alias?: string; content: string };

export function savedNodes(page: Page): Promise<SavedNode[]> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => { nodes: SavedNode[] } } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    return store.getState().nodes.map(({ title, alias, content }) => ({ title, alias, content }));
  });
}

/**
 * Fill inspector fields of the selected node, one at a time. Each field is saved when it
 * loses focus, and the draft save that follows re-syncs the whole inspector from the saved
 * node, so the next field is only filled once the last one has reached the saved snapshot;
 * typing ahead of that would be wiped.
 */
export async function editSelectedNode(
  page: Page,
  fields: { title?: string; alias?: string; content?: string },
) {
  const saved = async (matches: (node: SavedNode) => boolean) =>
    expect.poll(async () => (await savedNodes(page)).some(matches)).toBe(true);

  if (fields.title !== undefined) {
    await page.locator("#mp-title").fill(fields.title);
    await applyInspector(page);
    await saved((node) => node.title === fields.title);
  }
  if (fields.alias !== undefined) {
    await page.locator("#mp-alias").fill(fields.alias);
    await applyInspector(page);
    await saved((node) => node.alias === fields.alias);
  }
  if (fields.content !== undefined) {
    await page.locator("#mp-content").fill(fields.content);
    await applyInspector(page);
    await saved((node) => node.content.includes(fields.content!));
  }
}
