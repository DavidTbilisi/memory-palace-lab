/**
 * Count-shape layout: a node's outgoing targets go on the polygon of their count, a removed member
 * leaves its corner empty, and a set of more than seven takes a ladder.
 */
import { expect, test, type Page } from "@playwright/test";
import { openNodeTab } from "./nodeHelpers";
import { nodeCenter } from "./routeHelpers";

function palaceDsl(members: readonly string[]) {
  return ["@Tutorial Palace", "", "Hub", ...members.map((m) => `>${m}`), "", ...members.flatMap((m) => [m, ""])].join("\n");
}


type Centres = Record<string, { x: number; y: number }>;

/** Page-space centre of each node, by title. */
function centres(page: Page): Promise<Centres> {
  return page.evaluate(() => {
    type Shape = { id: string; meta?: { mpNodeId?: string; mpTitle?: string } };
    type Editor = { getCurrentPageShapes: () => Shape[]; getShapePageBounds: (id: string) => { center: { x: number; y: number } } };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
    const out: Record<string, { x: number; y: number }> = {};
    for (const shape of editor.getCurrentPageShapes()) {
      if (!shape.meta?.mpNodeId || !shape.meta.mpTitle) continue;
      const { x, y } = editor.getShapePageBounds(shape.id).center;
      out[shape.meta.mpTitle] = { x: Math.round(x), y: Math.round(y) };
    }
    return out;
  });
}

/** Type the palace into the DSL pane, wait for its debounced apply to land, and close the pane. */
async function applyDsl(page: Page, dsl: string, nodeCount: number) {
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(dsl);
  await expect.poll(async () => Object.keys(await centres(page)).length, { timeout: 10_000 }).toBe(nodeCount);
  await page.locator("body").click();
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toHaveCount(0);
}

async function openHub(page: Page, members: readonly string[]) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await applyDsl(page, palaceDsl(members), members.length + 1);
  const hub = await nodeCenter(page, "Hub");
  await page.mouse.click(hub.x, hub.y);
  await openNodeTab(page);
  return page.getByRole("region", { name: "Count-shape" });
}

test("an unordered set of five goes on a pentagon, and a removed member leaves its corner empty", async ({ page }) => {
  const members = ["Mercury", "Venus", "Earth", "Mars", "Jupiter"];
  const section = await openHub(page, members);
  await expect(section).toContainText("5 linked nodes. Is this set ordered?");
  await section.getByRole("button", { name: "Polygon (unordered)" }).click();
  await expect(section.getByRole("status")).toHaveText("Laid out as a pentagon. An empty corner is a missing member.");

  const laid = await centres(page);
  const hub = laid.Hub;
  const radii = members.map((m) => Math.round(Math.hypot(laid[m].x - hub.x, laid[m].y - hub.y)));
  expect(Math.max(...radii) - Math.min(...radii)).toBeLessThanOrEqual(1);
  expect(members.some((m) => Math.abs(laid[m].x - hub.x) <= 1 && laid[m].y < hub.y)).toBe(true);

  // Take one member away: the other four keep their corners, so the gap is where it was.
  await page.evaluate(() => {
    type Shape = { id: string; meta?: { mpTitle?: string } };
    type Editor = { getCurrentPageShapes: () => Shape[]; deleteShape: (id: string) => void };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
    editor.deleteShape(editor.getCurrentPageShapes().find((shape) => shape.meta?.mpTitle === "Earth")!.id);
  });
  const after = await centres(page);
  expect(after.Earth).toBeUndefined();
  for (const m of members.filter((title) => title !== "Earth")) expect(after[m]).toEqual(laid[m]);
});

test("a set of nine is offered only a ladder, with the reason", async ({ page }) => {
  const members = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const section = await openHub(page, members);
  await expect(section.getByRole("button", { name: "Polygon (unordered)" })).toHaveCount(0);
  await expect(section).toContainText("More than 7: Above seven, a polygon stops being readable at a glance");
  await section.getByRole("button", { name: "Ladder (ordered)" }).click();
  await expect(section.getByRole("status")).toHaveText("Laid out as a ladder of 9, top to bottom.");

  const laid = await centres(page);
  expect(new Set(members.map((m) => laid[m].x)).size).toBe(1);
  expect(laid.One.x).toBeGreaterThan(laid.Hub.x);
});
