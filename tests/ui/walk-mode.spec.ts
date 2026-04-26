import { expect, test } from "@playwright/test";

test("walk mode steps and active state are visible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Walk Demo");
  await page.getByRole("button", { name: "Add route" }).click();

  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();
  await expect(page.getByText("Step 1/2")).toBeVisible();

  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();

  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
});

test("recall-first walk mode hides the answer until reveal and keeps controls stable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Closure cue");
  await page.locator("#mp-content").fill("A closure keeps access to the lexical environment that created it.");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByPlaceholder("Route name").fill("Recall Demo");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await page.getByRole("button", { name: "Recall-first" }).click();

  await expect(page.locator("#walk-cue")).toContainText("Closure cue");
  await expect(page.getByRole("button", { name: "Reveal answer" })).toBeVisible();
  await expect(page.locator("#walk-answer")).not.toContainText("lexical environment that created it");

  const nextBefore = await page.getByRole("button", { name: "Next step" }).boundingBox();
  if (!nextBefore) throw new Error("missing next button position before reveal");

  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.locator("#walk-answer")).toContainText("A closure keeps access to the lexical environment that created it.");

  const nextAfter = await page.getByRole("button", { name: "Next step" }).boundingBox();
  if (!nextAfter) throw new Error("missing next button position after reveal");
  expect(Math.abs(nextBefore.x - nextAfter.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(nextBefore.y - nextAfter.y)).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Good" }).click();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing dev store hook");
        const state = store.getState() as {
          analyticsEvents: Array<{ eventType: string; payloadJson: string }>;
        };
        const revealEvent = state.analyticsEvents.find((event) => event.eventType === "walk_answer_revealed");
        const ratingEvent = state.analyticsEvents.find((event) => event.eventType === "walk_recall_rated");
        return {
          revealed: !!revealEvent,
          rated: !!ratingEvent,
          hasRevealTiming: (revealEvent?.payloadJson ?? "").includes("timeToRevealMs"),
          hasRatingTiming: (ratingEvent?.payloadJson ?? "").includes("timeToRevealMs"),
        };
      }),
    )
    .toMatchObject({
      revealed: true,
      rated: true,
      hasRevealTiming: true,
      hasRatingTiming: true,
    });
});

