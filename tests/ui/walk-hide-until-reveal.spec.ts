/**
 * A recall-first walk hides what is stored at each stop until it is revealed: the node on the
 * canvas, its edges, its name in the Routes list and the inspector, and the cue bar. A node off
 * the route stays visible, and a node revealed once stays shown for the rest of the walk.
 */
import { expect, test, type Page } from "@playwright/test";
import { openRoutesTab } from "./nodeHelpers";
import { nodeCenter } from "./routeHelpers";

const PALACE = [
  "@Tutorial Palace",
  "",
  "Closure",
  ">Scope",
  "",
  "Hoisting",
  "",
  "Scope",
  "",
  "/Recall Demo",
  "1 Closure",
  "2 Hoisting",
].join("\n");

async function applyDsl(page: Page, dsl: string, nodeCount: number) {
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(dsl);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          type Shape = { meta?: { mpNodeId?: string } };
          const editor = (window as { __mp_store?: { getState: () => { editorRef: { getCurrentPageShapes: () => Shape[] } } } })
            .__mp_store!.getState().editorRef;
          return editor.getCurrentPageShapes().filter((shape) => shape.meta?.mpNodeId).length;
        }),
      { timeout: 10_000 },
    )
    .toBe(nodeCount);
  await expect.poll(() => page.evaluate(() => (window as { __mp_store?: { getState: () => { loci: unknown[] } } }).__mp_store!.getState().loci.length)).toBe(2);
  await page.locator("body").click();
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toHaveCount(0);
}

/** Titles of the covered nodes, and the opacity of the Closure → Scope edge. */
function hiddenState(page: Page): Promise<{ covered: string[]; asked: string[]; edgeOpacity: number | null }> {
  return page.evaluate(() => {
    type Shape = { type: string; opacity: number; meta?: { mpNodeId?: string; mpTitle?: string; mpEdgeId?: string } };
    const state = (window as { __mp_store?: { getState: () => { editorRef: { getCurrentPageShapes: () => Shape[] } } } }).__mp_store!.getState();
    const shapes = state.editorRef.getCurrentPageShapes();
    const titleOf = new Map(shapes.filter((s) => s.meta?.mpNodeId).map((s) => [s.meta!.mpNodeId!, s.meta!.mpTitle ?? ""]));
    const covers = [...document.querySelectorAll<SVGGElement>('[data-testid="walk-node-cover"]')];
    const edge = shapes.find((s) => s.type === "arrow" && s.meta?.mpEdgeId);
    return {
      covered: covers.map((g) => titleOf.get(g.dataset.nodeId ?? "") ?? "").sort(),
      asked: covers.filter((g) => g.dataset.asked === "true").map((g) => titleOf.get(g.dataset.nodeId ?? "") ?? ""),
      edgeOpacity: edge ? edge.opacity : null,
    };
  });
}

test("a recall walk hides every stop's node, edges and name until it is revealed", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await applyDsl(page, PALACE, 3);
  await openRoutesTab(page);
  const stops = page.getByRole("list", { name: "Stops" });
  await expect(stops).toContainText("Closure");

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await page.getByRole("button", { name: "Recall-first" }).click();
  await expect(page.getByRole("button", { name: "Reveal answer" })).toBeVisible();

  // Before the reveal: both stops covered, the edge to Scope hidden, Scope (off the route) shown.
  await expect.poll(() => hiddenState(page)).toEqual({ covered: ["Closure", "Hoisting"], asked: ["Closure"], edgeOpacity: 0 });
  await expect(page.locator("#walk-cue")).toHaveText("What is stored at this stop?");
  await expect(stops).not.toContainText("Closure");
  await expect(stops).not.toContainText("Hoisting");
  await expect(stops.getByText("Hidden until revealed")).toHaveCount(2);

  // Clicking the covered node does not open it in the inspector.
  const closure = await nodeCenter(page, "Closure");
  await page.mouse.click(closure.x, closure.y);
  await page.getByRole("tab", { name: "Node" }).click();
  await expect(page.getByTestId("inspector-walk-hidden")).toBeVisible();
  await expect(page.getByLabel("Title", { exact: true })).toHaveCount(0);

  // Revealing shows the node, its edge, and its name; the next stop stays hidden.
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.locator("#walk-cue")).toHaveText("Closure");
  await expect.poll(() => hiddenState(page)).toEqual({ covered: ["Hoisting"], asked: [], edgeOpacity: 1 });
  await openRoutesTab(page);
  await expect(stops).toContainText("Closure");
  await expect(stops).not.toContainText("Hoisting");

  // On to the next stop: Closure, revealed in this walk, stays shown.
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await expect.poll(() => hiddenState(page)).toEqual({ covered: ["Hoisting"], asked: ["Hoisting"], edgeOpacity: 1 });

  // Leaving the walk hides nothing.
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect.poll(() => hiddenState(page)).toEqual({ covered: [], asked: [], edgeOpacity: 1 });
  await expect(stops).toContainText("Hoisting");
});
