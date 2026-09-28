/**
 * Storm: start one from the Review page, encode new nodes on the canvas until the target, and hand
 * them to the review queue as stops on the Storm's route, first due after sleep.
 */
import { expect, test, type Page } from "@playwright/test";
import { createNamedNodes, freeCanvasPoints, openTutorialPalace } from "./routeHelpers";

type StormState = {
  routeNames: string[];
  stops: { title: string; nextReviewAt: string | null }[];
  completed: Record<string, unknown>[];
};

function stormState(page: Page): Promise<StormState> {
  return page.evaluate(() => {
    type State = {
      routes: { id: string; name: string }[];
      loci: { routeId: string; nodeId: string; orderIndex: number; nextReviewAt?: string | null }[];
      nodes: { id: string; title: string }[];
      analyticsEvents: { eventType: string; payloadJson: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const storm = state.routes.find((route) => route.name.startsWith("Storm · "));
    const titleOf = new Map(state.nodes.map((node) => [node.id, node.title]));
    return {
      routeNames: state.routes.map((route) => route.name),
      stops: state.loci
        .filter((locus) => locus.routeId === storm?.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((locus) => ({ title: titleOf.get(locus.nodeId) ?? "", nextReviewAt: locus.nextReviewAt ?? null })),
      completed: state.analyticsEvents
        .filter((event) => event.eventType === "storm_completed")
        .map((event) => JSON.parse(event.payloadJson) as Record<string, unknown>),
    };
  });
}

/** Wake time the morning after, in the browser's own time zone. */
function nextWakeIso(page: Page): Promise<string> {
  return page.evaluate(() => {
    const now = new Date();
    const dayOf = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    return new Date(dayOf.getFullYear(), dayOf.getMonth(), dayOf.getDate() + 1, 7, 0).toISOString();
  });
}

test("a Storm counts new nodes to its target and hands them to the queue, due after sleep", async ({ page }) => {
  test.setTimeout(90_000);
  await openTutorialPalace(page);

  await page.locator('[data-nav-primary="review"]').click();
  const card = page.getByRole("region", { name: "Storm", exact: true });
  await card.getByLabel("Target").fill("3");
  await card.getByRole("button", { name: "Start Storm" }).click();

  const bar = page.getByRole("region", { name: "Storm in progress" });
  await expect(bar).toBeVisible();
  await expect(bar.getByTestId("storm-count")).toHaveText("0 / 3");

  await createNamedNodes(page, ["Hydrogen", "Helium"]);
  await expect(bar.getByTestId("storm-count")).toHaveText("1 / 3");
  await createNamedNodes(page, ["Lithium"]);
  await expect(bar.getByTestId("storm-count")).toHaveText("2 / 3");
  // Leaving the last node ends its encode, which reaches the target.
  const [empty] = await freeCanvasPoints(page, 1);
  await page.mouse.click(empty!.x, empty!.y);

  const summary = page.getByRole("dialog", { name: "Storm summary" });
  await expect(summary).toContainText("Storm target reached");
  await expect(summary.getByTestId("storm-summary-count")).toHaveText("3 of 3 encoded");
  await expect(summary.getByText("Personal best")).toBeVisible();
  await expect(summary).toContainText("first due tomorrow at");
  await expect(bar).toHaveCount(0);

  const wake = await nextWakeIso(page);
  // The saved node list catches up with the last rename on the next draft save.
  await expect
    .poll(async () => (await stormState(page)).stops)
    .toEqual(["Hydrogen", "Helium", "Lithium"].map((title) => ({ title, nextReviewAt: wake })));
  expect((await stormState(page)).routeNames).toEqual([expect.stringMatching(/^Storm · \d{1,2} [A-Z][a-z]{2}$/)]);
  await expect.poll(async () => (await stormState(page)).completed).toEqual([
    expect.objectContaining({ count: 3, target: 3, endedBy: "target", personalBest: true, phase: "storm" }),
  ]);

  await summary.getByRole("button", { name: "Done" }).click();
  await expect(summary).toHaveCount(0);
});

test("Storm reviews stay out of the daily goal, and Insights keeps Storm records apart", async ({ page }) => {
  await openTutorialPalace(page);
  await page.evaluate(() => {
    type Event = {
      id: string; eventType: string; eventGroup: string; sessionId: string | null; palaceId: string | null;
      routeId: string | null; nodeId: string | null; createdAt: string; payloadJson: string;
    };
    const store = (window as { __mp_store?: { getState: () => { analyticsEvents: Event[] }; setState: (s: object) => void } }).__mp_store!;
    const now = new Date().toISOString();
    const event = (id: string, eventType: string, payload: object): Event => ({
      id, eventType, eventGroup: "review", sessionId: null, palaceId: null, routeId: null, nodeId: null, createdAt: now,
      payloadJson: JSON.stringify(payload),
    });
    store.setState({
      analyticsEvents: [
        event("siege-1", "walk_recall_rated", { rating: "good" }),
        ...[1, 2, 3].map((i) => event(`storm-${i}`, "walk_recall_rated", { rating: "good", phase: "storm" })),
        event("storm-done", "storm_completed", {
          count: 64, target: 100, activeMs: 40 * 60_000, ratePerHour: 96, routeName: "Storm · 1 Sep", personalBest: true, phase: "storm",
        }),
        ...store.getState().analyticsEvents,
      ],
    });
  });

  await page.locator('[data-nav-primary="review"]').click();
  // One Siege review of the default goal of ten; the three Storm reviews are left out.
  await expect(page.getByText(/^1\/10$/).first()).toBeVisible();
  await expect(page.getByTestId("storm-reviews-note")).toHaveText(
    "3 reviews during a Storm today are not counted: the goal measures the daily reviews.",
  );

  await page.getByRole("button", { name: /^Insights$/ }).click();
  const records = page.getByRole("region", { name: "Storm records" });
  await expect(records.getByTestId("storm-best-count")).toHaveText("64");
  await expect(records.getByTestId("storm-best-rate")).toHaveText("96/h");
  await expect(records.getByRole("row", { name: /Storm · 1 Sep/ })).toContainText("64 / 100");
  await expect(page.getByLabel("Filter retention by phase")).toHaveValue("all");
  await page.getByLabel("Filter retention by phase").selectOption("storm");
  await expect(page.getByLabel("Filter retention by phase")).toHaveValue("storm");
});
