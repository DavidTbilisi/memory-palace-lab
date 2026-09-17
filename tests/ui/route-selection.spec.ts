import { expect, test } from "@playwright/test";
import {
  clickStops,
  countSnapshotNodes,
  createNamedNodes,
  freeCanvasPoints,
  nodeCenter,
  openTutorialPalace,
  routeSummary,
} from "./routeHelpers";

const titles = ["Alpha", "Bravo", "Charlie"];

test("Add selected appends the selected nodes in the chosen order", async ({ page }) => {
  await openTutorialPalace(page);
  await createNamedNodes(page, titles);

  // An empty route, with Route mode switched back off.
  await page.getByRole("tab", { name: /Routes/ }).click();
  await page.getByRole("button", { name: "Create route" }).click();
  await page.getByTestId("route-build-banner").getByRole("button", { name: "Done" }).click();

  // Select every node on the canvas, then add them left to right.
  const [empty] = await freeCanvasPoints(page, 1);
  await page.mouse.click(empty!.x, empty!.y);
  await page.keyboard.press("Control+A");
  const centers = await Promise.all(titles.map(async (title) => ({ title, ...(await nodeCenter(page, title)) })));
  const leftToRight = [...centers].sort((a, b) => a.x - b.x || a.y - b.y).map((center) => center.title);

  const panel = page.getByTestId("routes-panel");
  await panel.getByRole("button", { name: "Add selected" }).click();
  await page.getByRole("menuitem", { name: "Left to right" }).click();
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(leftToRight);
  await expect(panel.getByRole("status")).toHaveText("Added 3 stops");

  // Adding them again changes nothing and says why.
  await panel.getByRole("button", { name: "Add selected" }).click();
  await page.getByRole("menuitem", { name: "In selection order" }).click();
  await expect(panel.getByRole("status")).toHaveText("Added 0 stops, skipped 3 already in this route");
  expect((await routeSummary(page))[0]?.stops).toEqual(leftToRight);
});

test("deleting a node removes its stop and undo brings it back", async ({ page }) => {
  await openTutorialPalace(page);
  await createNamedNodes(page, titles);

  await page.getByRole("button", { name: "Route", exact: true }).click();
  await clickStops(page, titles);
  await page.keyboard.press("Escape");
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(titles);

  const bravo = await nodeCenter(page, "Bravo");
  await page.mouse.click(bravo.x, bravo.y);
  await page.keyboard.press("Delete");
  await expect.poll(() => countSnapshotNodes(page)).toBe(2);
  expect((await routeSummary(page))[0]?.stops).toEqual(["Alpha", "Charlie"]);
  await expect(page.getByTestId("route-overlay").locator("[data-route-stop]")).toHaveCount(2);

  await page.keyboard.press("Control+Z");
  await expect.poll(() => countSnapshotNodes(page)).toBe(3);
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(titles);
  await expect(page.getByTestId("route-overlay").locator("[data-route-stop]")).toHaveCount(3);
});

test("double-clicking empty canvas in Route mode adds a new node as the next stop", async ({ page }) => {
  await openTutorialPalace(page);
  await createNamedNodes(page, ["Gate"]);

  await page.getByRole("button", { name: "Route", exact: true }).click();
  await clickStops(page, ["Gate"]);

  const [spot] = await freeCanvasPoints(page, 1);
  await page.mouse.dblclick(spot!.x, spot!.y);
  await expect.poll(() => countSnapshotNodes(page)).toBe(2);
  await expect.poll(async () => (await routeSummary(page))[0]?.stops).toEqual(["Gate", "New node"]);
  await expect(page.getByTestId("route-build-banner")).toContainText("Added New node as stop 2");

  // The new node's label is open for typing; Escape closes it, a second Escape ends Route mode.
  await page.keyboard.press("Control+A");
  await page.keyboard.type("Porch");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("route-build-banner")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("route-build-banner")).toHaveCount(0);

  const routeCard = page.getByRole("region", { name: "Route Route 1" });
  await expect(routeCard.getByRole("button", { name: "Porch", exact: true })).toBeVisible();
});
