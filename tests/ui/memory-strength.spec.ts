/**
 * Insights › Strength: seeded review history ranks the weak stop first, flags the fragile
 * route, gives a trend verdict, and a click on a stop starts a recall walk at that stop.
 */
import { expect, test, type Page } from "@playwright/test";
import { addSelectedToRoute, createRoute, savedNodes, selectAllNodes } from "./nodeHelpers";
import { createNamedNodes, openTutorialPalace } from "./routeHelpers";

type WalkState = { walkOpen: boolean; routeName: string | null; stopTitle: string | null };

function walkState(page: Page): Promise<WalkState> {
  return page.evaluate(() => {
    type State = {
      walkOpen: boolean;
      walkRouteId: string | null;
      walkIndex: number;
      walkDirection: "forward" | "reverse";
      routes: { id: string; name: string }[];
      loci: { routeId: string; nodeId: string; orderIndex: number }[];
      nodes: { id: string; title: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const stops = state.loci
      .filter((locus) => locus.routeId === state.walkRouteId)
      .sort((a, b) => (state.walkDirection === "reverse" ? b.orderIndex - a.orderIndex : a.orderIndex - b.orderIndex));
    const stop = stops[state.walkIndex];
    return {
      walkOpen: state.walkOpen,
      routeName: state.routes.find((route) => route.id === state.walkRouteId)?.name ?? null,
      stopTitle: state.nodes.find((node) => node.id === stop?.nodeId)?.title ?? null,
    };
  });
}

test("Strength ranks the weak stop, flags the fragile route, and starts a walk at the stop", async ({ page }) => {
  test.setTimeout(90_000);
  await openTutorialPalace(page);

  // Mutex goes last on the route, so starting at it proves the walk jumps to the stop.
  await createNamedNodes(page, ["Semaphore", "Barrier", "Mutex"]);
  await expect.poll(async () => (await savedNodes(page)).some((node) => node.title === "Mutex")).toBe(true);
  await createRoute(page, "Locks");
  await selectAllNodes(page);
  await addSelectedToRoute(page);
  await expect
    .poll(() => page.evaluate(() => (window as { __mp_store?: { getState: () => { loci: unknown[] } } }).__mp_store!.getState().loci.length))
    .toBe(3);

  // A week of Siege history: Semaphore and Barrier recalled well early on, Mutex failing lately
  // and now three days overdue. A Storm "easy" on Mutex today must not rescue it.
  await page.evaluate(() => {
    type Locus = { id: string; routeId: string; nodeId: string; nextReviewAt?: string; lastReviewedAt?: string | null; repetitions?: number; interval?: number };
    type Event = {
      id: string; eventType: string; eventGroup: string; sessionId: string | null; palaceId: string | null;
      routeId: string | null; nodeId: string | null; createdAt: string; payloadJson: string;
    };
    type State = {
      currentPalace: { id: string };
      routes: { id: string; name: string }[];
      loci: Locus[];
      nodes: { id: string; title: string }[];
      analyticsEvents: Event[];
    };
    const store = (window as { __mp_store?: { getState: () => State; setState: (s: object) => void } }).__mp_store!;
    const state = store.getState();
    const day = 86_400_000;
    const at = (days: number) => new Date(Date.now() + days * day).toISOString();
    const route = state.routes.find((candidate) => candidate.name === "Locks")!;
    const nodeId = (title: string) => state.nodes.find((node) => node.title === title)!.id;
    const locusOf = (title: string) => state.loci.find((locus) => locus.nodeId === nodeId(title))!;
    const loci = state.loci.map((locus) =>
      locus.nodeId === nodeId("Mutex")
        ? { ...locus, interval: 1, repetitions: 1, lastReviewedAt: at(-4), nextReviewAt: at(-3) }
        : { ...locus, interval: 6, repetitions: 2, lastReviewedAt: at(-2), nextReviewAt: at(5) },
    );
    const rated = (title: string, daysAgo: number, rating: string, extra: object = {}): Event => ({
      id: `seed-${title}-${daysAgo}-${rating}`,
      eventType: "walk_recall_rated",
      eventGroup: "review",
      sessionId: `seed-session-${daysAgo}`,
      palaceId: state.currentPalace.id,
      routeId: route.id,
      nodeId: nodeId(title),
      createdAt: at(-daysAgo),
      payloadJson: JSON.stringify({ rating, locusId: locusOf(title).id, slot: null, timeToRevealMs: 4_000, ...extra }),
    });
    const seeded = [
      rated("Semaphore", 6, "easy"),
      rated("Barrier", 5, "easy"),
      rated("Semaphore", 4, "good"),
      rated("Mutex", 3, "again", { timeToRevealMs: 30_000 }),
      rated("Mutex", 2, "again", { timeToRevealMs: 28_000 }),
      rated("Mutex", 1, "hard", { timeToRevealMs: 26_000 }),
      rated("Mutex", 0, "easy", { phase: "storm", timeToRevealMs: 1_000 }),
    ];
    store.setState({ loci, analyticsEvents: [...seeded.reverse(), ...state.analyticsEvents] });
  });

  await page.getByRole("button", { name: /^Insights$/ }).click();
  await page.getByRole("tab", { name: "Strength", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Strength", exact: true })).toHaveAttribute("aria-selected", "true");

  const stops = page.getByRole("region", { name: "Needs attention" }).getByTestId("strength-stop");
  await expect(stops.first()).toContainText("Mutex");
  await expect(stops.first()).toContainText("Critical");
  await expect(stops.first()).toContainText("Overdue");
  // The Storm "easy" is ignored: the last Siege rating is Hard.
  await expect(stops.first()).toContainText("last: hard");

  const route = page.getByRole("region", { name: "Route friction" }).getByTestId("strength-route").filter({ hasText: "Locks" });
  await expect(route).toContainText("Cognitively expensive");
  await expect(route).toContainText("slow to recall");

  await expect(page.getByTestId("strength-trend-verdict")).toHaveText("Decaying");
  await expect(page.getByRole("region", { name: "Palace health" }).getByTestId("strength-palace").first()).toContainText(
    "hotspot: Mutex",
  );

  await stops.first().click();
  await expect.poll(() => walkState(page)).toEqual({ walkOpen: true, routeName: "Locks", stopTitle: "Mutex" });
  await expect(page.getByRole("button", { name: "Reveal answer" })).toBeVisible();
});
