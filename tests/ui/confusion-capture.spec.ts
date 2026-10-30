/**
 * Catching confusions in review: rate a stop Again, say what it was mixed up with, link the pair,
 * find both Distinguisher cards due, and see the pair as a hotspot on the Strength tab.
 */
import { expect, test, type Page } from "@playwright/test";
import { addNode, addSelectedToRoute, createRoute, editSelectedNode, openNodeTab } from "./nodeHelpers";
import { openTutorialPalace } from "./routeHelpers";

/** Give the selected node a Distinguisher, its only NEDF slot. */
async function addDistinguisher(page: Page, prompt: string, reason: string) {
  await openNodeTab(page);
  const slots = page.getByRole("region", { name: "NEDF slots" });
  if (!(await slots.getByLabel("Distinguisher question").isVisible())) {
    await slots.getByRole("button", { name: /NEDF/ }).click();
  }
  await slots.getByLabel("Distinguisher question").fill(prompt);
  await slots.getByLabel("Distinguisher reason").fill(reason);
  await slots.getByLabel("Name-hook").click();
  await expect(slots.getByTestId("nedf-encoded")).toHaveText("NEDF-encoded · 1/4");
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

/** Titles of the nodes whose Distinguisher card is due now. */
function dueDistinguishers(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    type State = {
      nodes: { id: string; title: string }[];
      loci: { nodeId: string; slotSchedules?: { distinguisher?: { nextReviewAt: string } } }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const now = Date.now();
    return state.loci
      .filter((locus) => {
        const due = locus.slotSchedules?.distinguisher?.nextReviewAt;
        return !!due && Date.parse(due) <= now;
      })
      .map((locus) => state.nodes.find((node) => node.id === locus.nodeId)?.title ?? locus.nodeId)
      .sort();
  });
}

/** Explanations logged so far, as "cause:missed→other". */
function loggedMisses(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    type State = { analyticsEvents: { eventType: string; payloadJson: string }[] };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    return state.analyticsEvents
      .filter((event) => event.eventType === "recall_miss_explained")
      .map((event) => {
        const payload = JSON.parse(event.payloadJson) as { cause: string; nodeTitle: string; confusedWithTitle: string | null };
        return `${payload.cause}:${payload.nodeTitle}→${payload.confusedWithTitle ?? "-"}`;
      });
  });
}

/** Walk the route from the start, recall-first: miss Semaphore, then pass Mutex. */
async function walkMissingSemaphore(page: Page) {
  const walkToggle = page.getByRole("button", { name: "Toggle walk mode" });
  await walkToggle.click();
  await expect(walkToggle).toHaveText(/Walk on/);
  const reveal = page.getByRole("button", { name: "Reveal answer" });
  if (!(await reveal.isVisible())) await page.getByRole("button", { name: "Recall-first" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
  await expect(page.locator("#walk-cue")).toHaveText("Many keys, counted?");
  await reveal.click();
  await page.getByRole("button", { name: "1 Again" }).click();
  // Again still moves on at once; the question is about the stop just missed.
  await expect(page.getByText("Step 2/2")).toBeVisible();
}

test("a missed recall logged as a mix-up links the pair, pulls both Distinguishers forward, and shows as a hotspot", async ({
  page,
}) => {
  test.setTimeout(150_000);
  await openTutorialPalace(page);

  await addNode(page);
  await editSelectedNode(page, { title: "Semaphore", content: "A counter of free slots." });
  await addDistinguisher(page, "Many keys, counted?", "a semaphore counts; a mutex has one owner");
  await createRoute(page, "Locks");
  await addSelectedToRoute(page);

  // The Routes tab hides the inspector a new node opens in.
  await openNodeTab(page);
  await addNode(page);
  await editSelectedNode(page, { title: "Mutex", content: "Mutual exclusion lock." });
  await addDistinguisher(page, "One key, one owner?", "a mutex has one owner; a semaphore counts");
  await addSelectedToRoute(page);

  // Freshly added stops are due tomorrow.
  expect(await dueDistinguishers(page)).toEqual([]);

  await walkMissingSemaphore(page);
  const prompt = page.getByRole("region", { name: "Missed recall" });
  await expect(prompt).toContainText("Missed Semaphore?");
  // The walk's own controls stay where they were.
  await expect(page.getByRole("button", { name: "Reveal answer" })).toBeVisible();

  const picker = prompt.getByRole("combobox", { name: "Mixed it up with" });
  await picker.click();
  await page.screenshot({ path: "test-results/confusion-capture-walk.png", clip: { x: 0, y: 0, width: 1280, height: 360 } });
  await picker.fill("mut");
  await prompt.getByRole("option", { name: "Mutex" }).click();
  await expect(prompt.getByRole("status")).toContainText("Link Semaphore and Mutex as a confusion?");
  await prompt.getByRole("button", { name: "Link", exact: true }).click();
  await expect(prompt.getByRole("status")).toContainText("Linked Semaphore and Mutex as a confusion.");
  await expect.poll(() => savedConfusions(page)).toEqual([["Mutex", "Semaphore"]]);
  await expect.poll(() => dueDistinguishers(page)).toEqual(["Mutex", "Semaphore"]);
  expect(await loggedMisses(page)).toEqual(["confusion:Semaphore→Mutex"]);

  // Finish the walk; the summary closes with Escape (tldraw's style panel can cover its buttons).
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: "3 Good" }).click();
  await expect(page.getByText("Session Summary")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Session Summary")).not.toBeVisible();

  // Mixed up again: the pair is already linked, so it is only logged.
  await walkMissingSemaphore(page);
  await prompt.getByRole("combobox", { name: "Mixed it up with" }).click();
  // Its confusion neighbour is offered first.
  await expect(prompt.getByRole("option").first()).toHaveText(/Mutex/);
  await prompt.getByRole("option", { name: /Mutex/ }).click();
  await expect(prompt.getByRole("status")).toContainText("Logged. Semaphore and Mutex are linked as a confusion.");
  await expect(prompt.getByRole("button", { name: "Link", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(prompt).toHaveCount(0);
  expect(await loggedMisses(page)).toEqual(["confusion:Semaphore→Mutex", "confusion:Semaphore→Mutex"]);

  await page.getByRole("button", { name: /^Insights$/ }).click();
  await page.getByRole("tab", { name: "Strength", exact: true }).click();
  const hotspots = page.getByRole("region", { name: "Confusion hotspots" });
  const row = hotspots.getByTestId("strength-confusion");
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("Semaphore ↔ Mutex");
  await expect(row).toContainText("Linked");
  await expect(row).toContainText("2 mix-ups");
  await hotspots.screenshot({ path: "test-results/confusion-hotspots.png" });

  // A hotspot starts a recall walk at the Distinguisher of the node missed most.
  await row.click();
  await expect(page.getByRole("button", { name: "Toggle walk mode" })).toHaveText(/Walk on/);
  await expect(page.getByTestId("walk-slot")).toHaveText("Discrimination");
  await expect(page.locator("#walk-cue")).toHaveText("Many keys, counted?");
});
