/**
 * Adaptive review interventions (backlog 19, PR 1): a node that keeps failing in review is
 * suggested for re-encoding on the Strength tab and as the Review page's "Fix first" card.
 * Re-encoding opens the node; Done restarts its schedule, logs the intervention, and the
 * suggestion goes away until it fails again.
 */
import { expect, test, type Page } from "@playwright/test";

/** A timeline gives a palace with a route in review in a few clicks. */
async function palaceWithRoute(
  page: Page,
  events: [string, string][] = [
    ["Born", "1872"],
    ["Nobel Prize", "1950"],
  ],
) {
  await page.goto("/");
  await page.getByRole("button", { name: "Generate store" }).click();
  const form = page.getByRole("region", { name: "Generate store" });
  await form.getByLabel("Timeline title").fill("Russell");
  await form.getByRole("button", { name: "Create timeline" }).click();
  await expect(page.getByRole("heading", { name: "Russell · timeline" })).toBeVisible();
  const panel = page.getByRole("region", { name: "Store", exact: true });
  for (const [name, date] of events) {
    await panel.getByLabel("Event", { exact: true }).fill(name!);
    await panel.getByLabel("Date", { exact: true }).fill(date!);
    await panel.getByRole("button", { name: "Add event" }).click();
    await expect(panel.getByLabel("Event", { exact: true })).toHaveValue("");
  }
}

/** Walk the route recall-first, rating the first stop `first` and the second Good. */
async function walk(page: Page, first: "Again" | "Hard" | "Good") {
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  // Recall-first stays on from one walk to the next.
  const recall = page.getByRole("button", { name: "Recall-first" });
  if ((await recall.getAttribute("aria-pressed")) !== "true") await recall.click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: new RegExp(`^\\d ${first}$`) }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: /^\d Good$/ }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  // A miss asks why; a blank is not a confusion.
  const why = page.getByRole("button", { name: /couldn.t produce it|blank/i });
  if (await why.count()) await why.first().click();
}

async function openStrength(page: Page) {
  await page.getByRole("button", { name: /^Insights$/ }).click();
  await page.getByRole("tab", { name: "Strength", exact: true }).click();
}

function bornStop(page: Page) {
  return page.evaluate(() => {
    type Shape = { meta?: { mpNodeId?: string; mpTitle?: string } };
    type State = {
      editorRef: { getCurrentPageShapes: () => Shape[] };
      loci: { nodeId: string; repetitions?: number; lastReviewedAt?: string | null; slotSchedules?: object }[];
      analyticsEvents: { eventType: string; payloadJson: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const nodeId = state.editorRef.getCurrentPageShapes().find((s) => s.meta?.mpTitle === "Born")?.meta?.mpNodeId;
    const locus = state.loci.find((l) => l.nodeId === nodeId)!;
    return {
      repetitions: locus.repetitions ?? null,
      lastReviewedAt: locus.lastReviewedAt ?? null,
      slotSchedules: locus.slotSchedules ?? null,
      accepted: state.analyticsEvents.filter((e) => e.eventType === "intervention_accepted").map((e) => JSON.parse(e.payloadJson).kind),
    };
  });
}

test("a node that keeps failing is suggested for re-encoding, and re-encoding restarts its schedule", async ({ page }) => {
  test.setTimeout(150_000);
  await palaceWithRoute(page);
  for (let i = 0; i < 3; i++) await walk(page, "Again");

  // The Review page leads with it.
  await page.getByRole("button", { name: /^Review$/ }).click();
  const fixFirst = page.getByRole("region", { name: "Fix first" });
  await expect(fixFirst.getByTestId("intervention")).toContainText("Born");
  await expect(fixFirst).toContainText("Again or Hard on 3 of its last 3 reviews");

  // The Strength tab lists it too, and Re-encode opens the node.
  await openStrength(page);
  const suggested = page.getByRole("region", { name: "Suggested next" });
  const row = suggested.getByTestId("intervention").filter({ hasText: "Born" });
  await expect(row).toHaveAttribute("data-kind", "re-encode");
  await row.getByRole("button", { name: "Re-encode" }).click();

  const banner = page.getByRole("region", { name: "Re-encoding" });
  await expect(banner).toContainText("Born");
  await expect(page.locator("#mp-title")).toHaveValue("Born");
  // Its cards carry the history of those misses (a timeline event reviews on its own cards).
  expect((await bornStop(page)).slotSchedules).not.toBeNull();

  await banner.getByRole("button", { name: "Done" }).click();
  await expect(banner).toHaveCount(0);
  await expect.poll(() => bornStop(page)).toMatchObject({ repetitions: 0, lastReviewedAt: null, slotSchedules: null, accepted: ["re-encode"] });

  // Its old misses no longer count: nothing left to fix.
  await openStrength(page);
  await expect(page.getByRole("region", { name: "Suggested next" }).getByTestId("interventions-empty")).toBeVisible();
});

test("two nodes mixed up in review are suggested for linking, and the suggestion links them", async ({ page }) => {
  test.setTimeout(120_000);
  await palaceWithRoute(page);

  // Miss Born, and say it was mixed up with the Nobel Prize, without linking them from the walk.
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  const recall = page.getByRole("button", { name: "Recall-first" });
  if ((await recall.getAttribute("aria-pressed")) !== "true") await recall.click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: "1 Again" }).click();
  const prompt = page.getByRole("region", { name: "Missed recall" });
  await prompt.getByRole("combobox", { name: "Mixed it up with" }).fill("Nob");
  await prompt.getByRole("option", { name: "Nobel Prize" }).click();
  await expect(prompt.getByRole("status")).toContainText("Link Born and Nobel Prize as a confusion?");
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: "3 Good" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();

  await openStrength(page);
  const row = page
    .getByRole("region", { name: "Suggested next" })
    .getByTestId("intervention")
    .filter({ hasText: "Born and Nobel Prize" });
  await expect(row).toHaveAttribute("data-kind", "link-confusion");
  await row.getByRole("button", { name: "Link as a confusion" }).click();

  // The pair is linked where the learner is, and the list says so.
  await expect(page.getByRole("region", { name: "Suggested next" }).getByRole("status")).toContainText(
    "Linked Born and Nobel Prize as a confusion.",
  );
  await expect
    .poll(() =>
      page.evaluate(() => {
        type Shape = { meta?: { mpEdgeKind?: string | null } };
        const editor = (window as { __mp_store?: { getState: () => { editorRef: { getCurrentPageShapes: () => Shape[] } } } }).__mp_store!.getState()
          .editorRef;
        return editor.getCurrentPageShapes().filter((s) => s.meta?.mpEdgeKind === "confusion").length;
      }),
    )
    .toBe(1);
  await expect.poll(async () => (await bornStop(page)).accepted).toEqual(["link-confusion"]);
});

function routesState(page: Page) {
  return page.evaluate(() => {
    type Shape = { meta?: { mpNodeId?: string; mpTitle?: string } };
    type State = {
      editorRef: { getCurrentPageShapes: () => Shape[] };
      routes: { id: string; name: string }[];
      loci: { routeId: string; nodeId: string; orderIndex: number }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const titleOf = new Map(state.editorRef.getCurrentPageShapes().map((s) => [s.meta?.mpNodeId, s.meta?.mpTitle]));
    return state.routes.map((route) => ({
      name: route.name,
      stops: state.loci
        .filter((l) => l.routeId === route.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((l) => titleOf.get(l.nodeId)),
    }));
  });
}

test("a route that costs too much to walk gets a proposed fix, applied only on confirm and undone on request", async ({ page }) => {
  test.setTimeout(150_000);
  await palaceWithRoute(page, [
    ["Born", "1872"],
    ["Cambridge degree", "1894"],
    ["Nobel Prize", "1950"],
  ]);
  for (let walkNumber = 0; walkNumber < 2; walkNumber++) {
    await page.getByRole("button", { name: "Toggle walk mode" }).click();
    const recall = page.getByRole("button", { name: "Recall-first" });
    if ((await recall.getAttribute("aria-pressed")) !== "true") await recall.click();
    for (const rating of ["1 Again", "2 Hard", "3 Good"]) {
      await page.getByRole("button", { name: "Reveal answer" }).click();
      await page.getByRole("button", { name: rating }).click();
    }
    await page.getByRole("button", { name: "Done", exact: true }).click();
  }

  await openStrength(page);
  const row = page.getByRole("region", { name: "Suggested next" }).getByTestId("intervention").filter({ hasText: "Route Russell · timeline" });
  await expect(row).toHaveAttribute("data-kind", "route-surgery");
  await row.getByRole("button", { name: "Fix route" }).click();

  // Nothing changes until the learner has seen the proposal and applied it.
  const proposal = row.getByRole("group", { name: "Proposed change" });
  await expect(proposal).toContainText("Move Born, Cambridge degree out of Russell · timeline into Russell · timeline · weak spots");
  expect(await routesState(page)).toHaveLength(1);
  await proposal.getByRole("button", { name: "Apply" }).click();

  const status = page.getByRole("region", { name: "Suggested next" }).getByRole("status");
  await expect(status).toContainText("Moved Born, Cambridge degree");
  await expect
    .poll(() => routesState(page))
    .toEqual([
      { name: "Russell · timeline", stops: ["Nobel Prize"] },
      { name: "Russell · timeline · weak spots", stops: ["Born", "Cambridge degree"] },
    ]);

  // The fix is listed as an intervention to judge once reviews come in.
  await expect(page.getByRole("region", { name: "Did it help" }).getByTestId("intervention-impact").first()).toContainText(
    "Fixed route Russell · timeline",
  );

  await status.getByRole("button", { name: "Undo" }).click();
  await expect(status).toContainText("Undone");
  await expect.poll(() => routesState(page)).toEqual([{ name: "Russell · timeline", stops: ["Born", "Cambridge degree", "Nobel Prize"] }]);
});
