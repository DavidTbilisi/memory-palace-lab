/**
 * Encode timing: building a node or an edge records how long it took, and re-editing a known
 * node is recorded apart from encoding a new one.
 */
import { expect, test, type Page } from "@playwright/test";
import { editSelectedNode, openNodeTab, savedNodes } from "./nodeHelpers";
import { createNamedNodes, freeCanvasPoints, nodeCenter, openTutorialPalace } from "./routeHelpers";

type Encoded = { eventType: string; nodeId: string | null; payload: Record<string, unknown> };

function encodeEvents(page: Page): Promise<Encoded[]> {
  return page.evaluate(() => {
    type State = { analyticsEvents: { eventType: string; nodeId?: string | null; payloadJson: string }[] };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    return state.analyticsEvents
      .filter((event) => event.eventType === "node_encoded" || event.eventType === "edge_encoded")
      .map((event) => ({ eventType: event.eventType, nodeId: event.nodeId ?? null, payload: JSON.parse(event.payloadJson) }));
  });
}

test("node and edge encodes are timed, and re-edits are told apart", async ({ page }) => {
  await openTutorialPalace(page);

  // Two new nodes; making the second one leaves the first, which ends its encode.
  await createNamedNodes(page, ["Mutex", "Semaphore"]);
  await expect.poll(() => encodeEvents(page)).toEqual([
    {
      eventType: "node_encoded",
      nodeId: expect.any(String),
      payload: expect.objectContaining({ title: "Mutex", first: true, activeMs: expect.any(Number), fields: expect.arrayContaining(["title"]) }),
    },
  ]);

  // Re-edit Mutex: select it, change its content, then click empty canvas. Semaphore's save
  // must land first, or the inspector re-sync it triggers wipes what is typed next.
  await expect.poll(async () => (await savedNodes(page)).some((node) => node.title === "Semaphore")).toBe(true);
  const mutex = await nodeCenter(page, "Mutex");
  await page.mouse.click(mutex.x, mutex.y);
  await openNodeTab(page);
  await expect(page.locator("#mp-title")).toHaveValue("Mutex");
  await editSelectedNode(page, { content: "One owner at a time." });
  const [empty] = await freeCanvasPoints(page, 1);
  await page.mouse.click(empty!.x, empty!.y);
  await expect
    .poll(async () => (await encodeEvents(page)).filter((event) => event.payload.title === "Mutex").map((event) => event.payload))
    .toEqual(
      // Newest first.
      [
        expect.objectContaining({ first: false, fields: ["content"], activeMs: expect.any(Number) }),
        expect.objectContaining({ first: true }),
      ],
    );
  // Leaving Semaphore (by selecting Mutex) ended its first encode too.
  expect((await encodeEvents(page)).some((event) => event.payload.title === "Semaphore" && event.payload.first === true)).toBe(
    true,
  );

  // A new edge through the Connect workflow is timed from the first click to Create edge.
  await page.getByRole("button", { name: "Connect", exact: true }).click();
  await page.mouse.click(mutex.x, mutex.y);
  const semaphore = await nodeCenter(page, "Semaphore");
  await page.mouse.click(semaphore.x, semaphore.y);
  await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
  await page.getByRole("button", { name: /create edge/i }).click();
  await expect
    .poll(async () => (await encodeEvents(page)).filter((event) => event.eventType === "edge_encoded").map((event) => event.payload))
    .toEqual([
      expect.objectContaining({ first: true, castTier: "tier1", changedSlots: [], activeMs: expect.any(Number) }),
    ]);
});

test("encode time shows in the inspector, the Difficulty table, and the Insights trend", async ({ page }) => {
  await openTutorialPalace(page);
  await createNamedNodes(page, ["Mutex", "Semaphore"]);
  await expect.poll(async () => (await encodeEvents(page)).length).toBe(1);

  // Back on Mutex, its first-encode time shows by the inspector header; no band yet.
  await expect.poll(async () => (await savedNodes(page)).some((node) => node.title === "Semaphore")).toBe(true);
  const mutex = await nodeCenter(page, "Mutex");
  await page.mouse.click(mutex.x, mutex.y);
  await openNodeTab(page);
  const badge = page.getByTestId("encode-speed");
  await expect(badge).toHaveText(/^\d+s$/);
  await expect(badge).toHaveAttribute("title", /appears after 12 timed encodes/);

  await page.getByRole("button", { name: /^Insights$/ }).click();
  await page.getByRole("tab", { name: "Difficulty", exact: true }).click();
  const mutexRow = page.getByRole("row").filter({ hasText: "Mutex" });
  await expect(mutexRow.getByTestId("encode-speed")).toHaveText(/^\d+s$/);

  // Six weeks of earlier encodes: the trend has enough history to chart, and bands appear.
  await page.evaluate(() => {
    type Event = { id: string; palaceId: string | null; nodeId: string | null; eventType: string; eventGroup: string; createdAt: string; payloadJson: string };
    const store = (window as { __mp_store?: { getState: () => { analyticsEvents: Event[] }; setState: (s: object) => void } }).__mp_store!;
    const now = Date.now();
    const seeded: Event[] = [];
    for (let week = 0; week < 6; week++) {
      for (let i = 0; i < 4; i++) {
        const at = new Date(now - (week * 7 + i + 1) * 86_400_000).toISOString();
        const nodeMs = 40_000 + week * 15_000 + i * 5_000;
        seeded.push({ id: `seed-n${week}-${i}`, palaceId: null, nodeId: `seed-${week}-${i}`, eventType: "node_encoded", eventGroup: "graph", createdAt: at, payloadJson: JSON.stringify({ first: true, activeMs: nodeMs }) });
        if (i < 2) seeded.push({ id: `seed-r${week}-${i}`, palaceId: null, nodeId: `seed-${week}-${i}`, eventType: "node_encoded", eventGroup: "graph", createdAt: at, payloadJson: JSON.stringify({ first: false, activeMs: 9_000 + i * 2_000 }) });
        if (i < 3) seeded.push({ id: `seed-e${week}-${i}`, palaceId: null, nodeId: `seed-${week}-${i}`, eventType: "edge_encoded", eventGroup: "graph", createdAt: at, payloadJson: JSON.stringify({ edgeId: `se${week}-${i}`, first: true, activeMs: 20_000 + week * 6_000 }) });
      }
    }
    store.setState({ analyticsEvents: [...seeded, ...store.getState().analyticsEvents] });
  });

  await page.getByRole("tab", { name: "Analytics", exact: true }).click();
  const section = page.getByRole("region", { name: "Encode speed" });
  await expect(section.getByRole("img", { name: /Nodes: median encode time per week/ })).toBeVisible();
  await expect(section.getByRole("img", { name: /Edges: median encode time per week/ })).toBeVisible();
  await expect(section.getByTestId("encode-tile-bands")).toContainText("Fast ≤");
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({ path: "test-results/encode-speed-trend.png" });

  // With bands in place, the Difficulty table names Mutex's band.
  await page.getByRole("tab", { name: "Difficulty", exact: true }).click();
  await expect(mutexRow.getByTestId("encode-speed")).toHaveText(/· (Fast|Typical|Slow)$/);
});
