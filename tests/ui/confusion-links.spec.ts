/**
 * Confusion links: mark two look-alike nodes from the inspector, see the dashed link, and walk
 * the Distinguisher card, which names both candidates once the neighbour is known.
 */
import { expect, test, type Page } from "@playwright/test";
import { addNode, addSelectedToRoute, createRoute, editSelectedNode, openNodeTab } from "./nodeHelpers";
import { openTutorialPalace } from "./routeHelpers";

type LinkView = { dash: string; color: string; start: string; end: string; label: string };

/** The confusion arrows on the canvas, as drawn. */
function confusionArrows(page: Page): Promise<LinkView[]> {
  return page.evaluate(() => {
    type Shape = {
      type: string;
      meta?: { mpEdgeKind?: string | null };
      props: { dash: string; color: string; arrowheadStart: string; arrowheadEnd: string; richText?: unknown };
    };
    type Editor = { getCurrentPageShapes: () => Shape[] };
    const store = (window as { __mp_store?: { getState: () => { editorRef: Editor | null } } }).__mp_store;
    const editor = store?.getState().editorRef;
    if (!editor) throw new Error("editor not ready");
    return editor
      .getCurrentPageShapes()
      .filter((shape) => shape.type === "arrow" && shape.meta?.mpEdgeKind === "confusion")
      .map((shape) => ({
        dash: shape.props.dash,
        color: shape.props.color,
        start: shape.props.arrowheadStart,
        end: shape.props.arrowheadEnd,
        label: JSON.stringify(shape.props.richText ?? "").includes('"text"') ? "labelled" : "",
      }));
  });
}

/** Saved confusion edges, by the titles they join. */
function savedConfusions(page: Page): Promise<string[][]> {
  return page.evaluate(() => {
    type State = {
      nodes: { id: string; title: string }[];
      edges: { sourceNodeId: string; targetNodeId: string; kind?: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const title = (id: string) => state.nodes.find((n) => n.id === id)?.title ?? id;
    return state.edges
      .filter((e) => e.kind === "confusion")
      .map((e) => [title(e.sourceNodeId), title(e.targetNodeId)].sort());
  });
}

test("a confusion link names the neighbour on the Distinguisher card", async ({ page }) => {
  test.setTimeout(120_000);
  await openTutorialPalace(page);
  await addNode(page);
  await editSelectedNode(page, { title: "Semaphore", content: "A counter of free slots." });
  await addNode(page);
  await editSelectedNode(page, { title: "Mutex", content: "Mutual exclusion lock." });

  // Only a Distinguisher: it is the one card the walk can ask.
  await openNodeTab(page);
  const slots = page.getByRole("region", { name: "NEDF slots" });
  await slots.getByRole("button", { name: /NEDF/ }).click();
  await slots.getByLabel("Distinguisher question").fill("One key, or a bowl of keys?");
  await slots.getByLabel("Distinguisher reason").fill("a mutex has one owner; a semaphore counts");
  await slots.getByLabel("Name-hook").click();
  await expect(slots.getByTestId("nedf-encoded")).toHaveText("NEDF-encoded · 1/4");

  // Name the neighbour beside the Distinguisher.
  await slots.getByRole("combobox", { name: "Confused with" }).selectOption({ label: "Semaphore" });
  const neighbours = slots.getByRole("list", { name: "Confused with" });
  await expect(neighbours).toContainText("Semaphore");
  // Linked once: Semaphore is no longer offered.
  await expect(slots.getByRole("combobox", { name: "Confused with" }).locator("option", { hasText: "Semaphore" })).toHaveCount(0);

  // Drawn dashed amber, with no heads and no label, and saved as a confusion edge.
  await expect.poll(() => confusionArrows(page)).toEqual([
    { dash: "dashed", color: "orange", start: "none", end: "none", label: "" },
  ]);
  await expect.poll(() => savedConfusions(page)).toEqual([["Mutex", "Semaphore"]]);

  await createRoute(page, "Locks");
  await addSelectedToRoute(page);

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/1")).toBeVisible();
  await page.getByRole("button", { name: "Recall-first" }).click();
  await expect(page.getByTestId("walk-slot")).toHaveText("Discrimination");
  await expect(page.locator("#walk-cue")).toHaveText("One key, or a bowl of keys?");
  await expect(page.locator("#walk-answer")).toContainText("Which is it: Mutex or Semaphore?");
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.locator("#walk-answer")).toContainText("Mutex, because a mutex has one owner; a semaphore counts");
});
