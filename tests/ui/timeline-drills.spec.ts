/**
 * Timeline drills (backlog 20, PR 2): a timeline event reviews on two cards with their own
 * schedules. Event → date shows the event and hides its date image and date label until Reveal;
 * Date → event hides the event. The order drill shuffles neighbouring events, marks the ones put
 * out of place, and brings their Event → date cards due now.
 */
import { expect, test, type Page } from "@playwright/test";
import { editSelectedNode, openNodeTab, openRoutesTab } from "./nodeHelpers";

async function createTimeline(page: Page, title: string, events: [string, string][]) {
  await page.goto("/");
  await page.getByRole("button", { name: "Generate store" }).click();
  const form = page.getByRole("region", { name: "Generate store" });
  await form.getByLabel("Timeline title").fill(title);
  await form.getByRole("button", { name: "Create timeline" }).click();
  await expect(page.getByRole("heading", { name: `${title} · timeline` })).toBeVisible();
  const panel = page.getByRole("region", { name: "Store", exact: true });
  for (const [name, date] of events) {
    await panel.getByLabel("Event", { exact: true }).fill(name);
    await panel.getByLabel("Date", { exact: true }).fill(date);
    await panel.getByRole("button", { name: "Add event" }).click();
    await expect(panel.getByLabel("Event", { exact: true })).toHaveValue("");
  }
  return panel;
}

/** Rename an event's date image from the inspector, as a learner replacing the placeholder would. */
async function nameDateImage(page: Page, date: string, title: string) {
  await page.evaluate((date) => {
    type Shape = { id: string; meta?: { mpStoreRole?: string; mpAddress?: string } };
    type Editor = { getCurrentPageShapes: () => Shape[]; select: (id: string) => void };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
    editor.select(editor.getCurrentPageShapes().find((s) => s.meta?.mpStoreRole === "date-image" && s.meta.mpAddress === date)!.id);
  }, date);
  await openNodeTab(page);
  await editSelectedNode(page, { title });
}

/** Title of every covered node, and of the one being asked. */
function covers(page: Page): Promise<{ covered: string[]; asked: string[] }> {
  return page.evaluate(() => {
    type Shape = { meta?: { mpNodeId?: string; mpTitle?: string } };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: { getCurrentPageShapes: () => Shape[] } } } }).__mp_store!.getState()
      .editorRef;
    const titleOf = new Map(editor.getCurrentPageShapes().filter((s) => s.meta?.mpNodeId).map((s) => [s.meta!.mpNodeId!, s.meta!.mpTitle ?? ""]));
    const groups = [...document.querySelectorAll<SVGGElement>('[data-testid="walk-node-cover"]')];
    return {
      covered: groups.map((g) => titleOf.get(g.dataset.nodeId ?? "") ?? "").sort(),
      asked: groups.filter((g) => g.dataset.asked === "true").map((g) => titleOf.get(g.dataset.nodeId ?? "") ?? ""),
    };
  });
}

function eventSchedules(page: Page, title: string) {
  return page.evaluate((wanted) => {
    type Shape = { meta?: { mpNodeId?: string; mpTitle?: string } };
    type State = {
      editorRef: { getCurrentPageShapes: () => Shape[] };
      loci: { nodeId: string; nextReviewAt?: string; slotSchedules?: Record<string, { nextReviewAt: string }> }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const nodeId = state.editorRef.getCurrentPageShapes().find((s) => s.meta?.mpTitle === wanted)?.meta?.mpNodeId;
    const locus = state.loci.find((l) => l.nodeId === nodeId)!;
    return {
      eventToDate: locus.slotSchedules?.eventToDate?.nextReviewAt ?? null,
      dateToEvent: locus.slotSchedules?.dateToEvent?.nextReviewAt ?? null,
    };
  }, title);
}

test("an event is asked for its date with the date hidden, and its two cards keep their own schedules", async ({ page }) => {
  test.setTimeout(90_000);
  await createTimeline(page, "Russell", [
    ["Born", "1872"],
    ["Discovers the paradox", "1901"],
  ]);
  await nameDateImage(page, "1872", "Sevens on a tray");
  await openRoutesTab(page);
  const stops = page.getByRole("list", { name: "Stops" });

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await page.getByRole("button", { name: "Recall-first" }).click();

  // Both cards start from the stop's schedule; Event → date comes first.
  await expect(page.getByTestId("walk-slot")).toHaveText("Dating");
  await expect(page.locator("#walk-cue")).toHaveText("Born");
  // The event is the cue, so it shows; its date image and the date are what stay hidden. The next
  // stop is hidden as on any route, while its date image, not part of this card, is not.
  await expect.poll(async () => (await covers(page)).covered).toEqual(["Discovers the paradox", "Sevens on a tray"]);
  await expect(stops).not.toContainText("1872");
  await expect(stops).toContainText("Born");
  await page.getByRole("tab", { name: "Node", exact: true }).click();
  await page.evaluate(() => {
    type Editor = { getCurrentPageShapes: () => { id: string; meta?: { mpTitle?: string } }[]; select: (id: string) => void };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
    editor.select(editor.getCurrentPageShapes().find((s) => s.meta?.mpTitle === "Born")!.id);
  });
  await expect(page.locator("#mp-store-address")).toHaveText("Hidden until revealed");
  await expect(page.getByLabel("Event date")).toHaveCount(0);

  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.locator("#walk-answer")).toContainText("1872 · Sevens on a tray");
  await expect.poll(async () => (await covers(page)).covered).toEqual(["Discovers the paradox"]);

  const before = await eventSchedules(page, "Born");
  await page.getByRole("button", { name: "Good" }).click();
  // Only the card asked moves.
  await expect.poll(async () => (await eventSchedules(page, "Born")).eventToDate).not.toBeNull();
  const after = await eventSchedules(page, "Born");
  expect(after.dateToEvent).toBe(before.dateToEvent);

  // The next stop asks the same way round; its event is hidden once more under Date → event.
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await page.getByTestId("walk-slot").waitFor();
  await page.evaluate(() => {
    (window as { __mp_store?: { getState: () => { selectWalkSlot: (slot: string) => void } } }).__mp_store!.getState().selectWalkSlot("dateToEvent");
  });
  await expect(page.locator("#walk-cue")).toHaveText("1901");
  await expect.poll(async () => (await covers(page)).asked).toEqual(["Discovers the paradox"]);
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.locator("#walk-answer")).toContainText("Discovers the paradox");
});

test("the order drill marks events put out of place and brings their dating cards due now", async ({ page }) => {
  test.setTimeout(90_000);
  const panel = await createTimeline(page, "Russell", [
    ["Born", "1872"],
    ["Cambridge degree", "1894"],
    ["Discovers the paradox", "1901"],
  ]);

  await panel.getByRole("button", { name: "Order drill" }).click();
  const dialog = page.getByRole("dialog", { name: "Order drill" });
  const rows = dialog.getByRole("list", { name: "Events" }).getByRole("listitem");
  await expect(rows).toHaveCount(3);
  // No dates before checking.
  await expect(dialog).not.toContainText("1872");

  // Put Born last, wherever the shuffle left it: two events will be out of place at least.
  const order = async () => (await rows.allTextContents()).map((text) => text.replace(/^\d+/, "").trim());
  while ((await order()).at(-1) !== "Born") {
    await dialog.getByRole("button", { name: "Move Born down" }).click();
  }
  await dialog.getByRole("button", { name: "Check order" }).click();
  await expect(dialog.getByRole("status")).toContainText("out of place");
  await expect(dialog).toContainText("1872");
  await expect(dialog.locator('[data-misplaced="true"]')).not.toHaveCount(0);
  const misplaced = await dialog.locator('[data-misplaced="true"]').allTextContents();
  expect(misplaced.some((text) => text.includes("Born"))).toBe(true);

  // Born's dating card is due now; the date → event card did not move.
  const born = await eventSchedules(page, "Born");
  expect(born.eventToDate).not.toBeNull();
  expect(Date.parse(born.eventToDate!)).toBeLessThanOrEqual(Date.now());
  expect(born.dateToEvent).toBeNull();

  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).toHaveCount(0);
  await openNodeTab(page);
});
