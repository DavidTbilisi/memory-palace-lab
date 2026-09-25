/**
 * NEDF slots: encode a concept in the inspector, walk it one slot at a time, and keep the slots
 * and their schedules through a checkpoint and reload.
 */
import { expect, test, type Page } from "@playwright/test";
import { addNode, addSelectedToRoute, createRoute, editSelectedNode, openNodeTab } from "./nodeHelpers";
import { openTutorialPalace } from "./routeHelpers";

type Saved = { nedf: unknown; slots: Record<string, { repetitions: number }> | null };

function savedMutex(page: Page): Promise<Saved> {
  return page.evaluate(() => {
    type State = {
      nodes: { id: string; title: string; nedf?: unknown }[];
      loci: { nodeId: string; slotSchedules?: Record<string, { repetitions: number }> }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const node = state.nodes.find((candidate) => candidate.title === "Mutex");
    const locus = state.loci.find((candidate) => candidate.nodeId === node?.id);
    return { nedf: node?.nedf ?? null, slots: locus?.slotSchedules ?? null };
  });
}

async function walkOnce(page: Page) {
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/1")).toBeVisible();
}

test("a concept is encoded in four slots and walked one slot at a time", async ({ page }) => {
  test.setTimeout(120_000);
  await openTutorialPalace(page);
  await addNode(page);
  await editSelectedNode(page, { title: "Mutex", content: "Mutual exclusion lock." });

  // Encode three slots; the Failure slot stays half-written and does not count.
  await openNodeTab(page);
  const slots = page.getByRole("region", { name: "NEDF slots" });
  await slots.getByRole("button", { name: /NEDF/ }).click();
  await slots.getByLabel("Name-hook").fill("Mute-X: a gagged guard at the door");
  await slots.getByLabel("Essence").fill("Lets one thread in at a time");
  await slots.getByLabel("Distinguisher question").fill("One key, or a bowl of keys?");
  await slots.getByLabel("Distinguisher reason").fill("A mutex has one owner; a semaphore counts");
  await slots.getByLabel("Failure scenario").fill("Threads hang forever after an exception");
  await slots.getByLabel("Name-hook").click();
  await expect(slots.getByTestId("nedf-encoded")).toHaveText("NEDF-encoded · 3/4");
  await expect(slots.getByText("Needs the correction too")).toBeVisible();
  await expect.poll(async () => (await savedMutex(page)).nedf).toMatchObject({
    nameHook: "Mute-X: a gagged guard at the door",
    essence: "Lets one thread in at a time",
    distinguisher: { prompt: "One key, or a bowl of keys?", reason: "A mutex has one owner; a semaphore counts" },
  });

  await createRoute(page, "Locks");
  await addSelectedToRoute(page);

  // First walk: every slot starts from the stop's own schedule, so N·E·D·F order picks the hook.
  await walkOnce(page);
  await page.getByRole("button", { name: "Recall-first" }).click();
  await expect(page.getByTestId("walk-slot")).toHaveText("Recognition");
  await expect(page.locator("#walk-cue")).toHaveText("Mute-X: a gagged guard at the door");
  await expect(page.getByTestId("walk-answer-cover")).toBeVisible();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.getByTestId("walk-answer-cover")).toHaveCount(0);
  await expect(page.locator("#walk-answer")).toContainText("Mutex · Lets one thread in at a time");
  await page.getByRole("button", { name: "1 Again" }).click();
  await expect(page.getByText("Session Summary")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect.poll(async () => (await savedMutex(page)).slots).toEqual({
    nameHook: expect.objectContaining({ repetitions: 0 }),
  });

  // The hook was just rated, so the next walk asks the Essence card, which is due sooner.
  await walkOnce(page);
  await expect(page.getByTestId("walk-slot")).toHaveText("Recall");
  await expect(page.locator("#walk-cue")).toHaveText("Lets one thread in at a time");
  await page.getByRole("button", { name: "Toggle walk mode" }).click();

  // Slots and their schedules survive a checkpoint and a reload.
  await page.getByRole("button", { name: /save checkpoint|checkpoint now/i }).click();
  await expect(page.getByRole("button", { name: /save checkpoint/i })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Tutorial Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect.poll(async () => (await savedMutex(page)).slots).toEqual({
    nameHook: expect.objectContaining({ repetitions: 0 }),
  });
  expect((await savedMutex(page)).nedf).toMatchObject({ essence: "Lets one thread in at a time" });
});
