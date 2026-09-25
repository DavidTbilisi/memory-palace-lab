/**
 * Encode timing: building a node or an edge records how long it took, and re-editing a known
 * node is recorded apart from encoding a new one.
 */
import { expect, test, type Page } from "@playwright/test";
import { openNodeTab } from "./nodeHelpers";
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

  // Re-edit Mutex: select it, change its content, then click empty canvas.
  const mutex = await nodeCenter(page, "Mutex");
  await page.mouse.click(mutex.x, mutex.y);
  await openNodeTab(page);
  await expect(page.locator("#mp-title")).toHaveValue("Mutex");
  await page.locator("#mp-content").click();
  await page.keyboard.type("One owner at a time.");
  await page.locator("#mp-title").click();
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
