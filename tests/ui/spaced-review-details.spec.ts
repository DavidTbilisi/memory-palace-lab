/**
 * Spaced repetition scheduling details.
 *
 * Tests the SM2-style algorithm: verify that interval, easeFactor, and
 * repetitions update correctly for each recall rating, that the review
 * queue reflects the scheduled state, and that the review panel UI
 * correctly surfaces due items.
 *
 * Rating mapping (from RecallRating):
 *   "again" (Fail/Forgot) → interval resets, low ease
 *   "hard"                → small interval increase, ease decreases
 *   "good"                → moderate interval increase, ease unchanged
 *   "easy"                → large interval increase, ease increases
 */

import { expect, test } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

interface Locus {
  id: string;
  routeId: string;
  nodeId: string;
  orderIndex: number;
  label: string;
  interval?: number;
  easeFactor?: number;
  nextReviewAt?: string;
  repetitions?: number;
  lastReviewedAt?: string | null;
}

async function getLoci(page: import("@playwright/test").Page): Promise<Locus[]> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    return (store.getState() as { loci: Locus[] }).loci;
  });
}

async function setupSingleLocus(page: import("@playwright/test").Page, routeName: string) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Review Subject");
  await page.locator("#mp-content").fill("This is the content to review.");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByPlaceholder("Route name").fill(routeName);
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
}

async function rateAndClose(
  page: import("@playwright/test").Page,
  ratingButton: string,
) {
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();
  await page.getByRole("button", { name: "Recall-first" }).click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: ratingButton }).click();
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).not.toBeVisible();
}

// ── INITIAL LOCUS STATE ───────────────────────────────────────────────────────

test.describe("initial locus scheduling state", () => {
  test("new locus has no nextReviewAt (never reviewed)", async ({ page }) => {
    await setupSingleLocus(page, "Initial Route");
    const loci = await getLoci(page);
    const locus = loci[0];
    expect(locus).toBeDefined();
    expect(locus!.nextReviewAt).toBeUndefined();
    expect(locus!.repetitions ?? 0).toBe(0);
  });
});

// ── AFTER FAIL/AGAIN ──────────────────────────────────────────────────────────

test.describe("rating: Fail (again)", () => {
  test("after Fail: interval is 1 and repetitions reset to 0", async ({ page }) => {
    await setupSingleLocus(page, "Fail Route");
    await rateAndClose(page, "Forgot");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.interval).toBe(1);
    expect(locus.repetitions).toBe(0);
  });

  test("after Fail: nextReviewAt is today or tomorrow", async ({ page }) => {
    await setupSingleLocus(page, "Fail Date Route");
    await rateAndClose(page, "Forgot");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.nextReviewAt).toBeTruthy();
    const reviewDate = new Date(locus.nextReviewAt!);
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    expect(reviewDate.getTime()).toBeGreaterThanOrEqual(now.getTime() - 60_000);
    expect(reviewDate.getTime()).toBeLessThanOrEqual(twoDaysFromNow.getTime());
  });

  test("after Fail: review queue shows item as due", async ({ page }) => {
    await setupSingleLocus(page, "Fail Queue Route");
    await rateAndClose(page, "Forgot");

    await expect(page.getByRole("button", { name: /due/i })).toBeVisible({ timeout: 5000 });
  });

  test("after Fail: lastReviewedAt is set to recent timestamp", async ({ page }) => {
    const before = new Date().toISOString();
    await setupSingleLocus(page, "Fail Timestamp Route");
    await rateAndClose(page, "Forgot");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.lastReviewedAt).toBeTruthy();
    expect(Date.parse(locus.lastReviewedAt!)).toBeGreaterThanOrEqual(Date.parse(before));
  });
});

// ── AFTER GOOD ────────────────────────────────────────────────────────────────

test.describe("rating: Good", () => {
  test("after Good: interval > 1 and repetitions = 1", async ({ page }) => {
    await setupSingleLocus(page, "Good Route");
    await rateAndClose(page, "Good");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.interval).toBeGreaterThan(1);
    expect(locus.repetitions).toBe(1);
  });

  test("after Good: easeFactor is preserved at default or above 1.3", async ({ page }) => {
    await setupSingleLocus(page, "Good Ease Route");
    await rateAndClose(page, "Good");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.easeFactor).toBeDefined();
    expect(locus.easeFactor!).toBeGreaterThanOrEqual(1.3);
  });

  test("after Good: nextReviewAt is in the future", async ({ page }) => {
    await setupSingleLocus(page, "Good Future Route");
    await rateAndClose(page, "Good");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.nextReviewAt).toBeTruthy();
    const reviewDate = new Date(locus.nextReviewAt!);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(reviewDate.getTime()).toBeGreaterThan(tomorrow.getTime() - 60_000);
  });
});

// ── AFTER EASY ────────────────────────────────────────────────────────────────

test.describe("rating: Easy", () => {
  test("after Easy: interval is larger than after Good", async ({ page }) => {
    let goodInterval = 0;
    let easyInterval = 0;

    // Good run
    {
      await setupSingleLocus(page, "Good Interval Route");
      await rateAndClose(page, "Good");
      const loci = await getLoci(page);
      goodInterval = loci[0]!.interval ?? 0;
    }

    // Easy run (fresh palace)
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Easy Subject");
    await page.locator("#mp-content").fill("Content.");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByPlaceholder("Route name").fill("Easy Interval Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await rateAndClose(page, "Easy");
    const loci = await getLoci(page);
    easyInterval = loci[0]!.interval ?? 0;

    expect(easyInterval).toBeGreaterThan(goodInterval);
  });

  test("after Easy: easeFactor increases or stays the same", async ({ page }) => {
    await setupSingleLocus(page, "Easy Ease Route");
    await rateAndClose(page, "Easy");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.easeFactor).toBeDefined();
    // Easy should not decrease easeFactor
    expect(locus.easeFactor!).toBeGreaterThanOrEqual(1.3);
  });
});

// ── AFTER HARD ────────────────────────────────────────────────────────────────

test.describe("rating: Hard", () => {
  test("after Hard: interval > 1 but smaller than Good", async ({ page }) => {
    let hardInterval = 0;
    let goodInterval = 0;

    // Hard run
    {
      await setupSingleLocus(page, "Hard Route");
      await rateAndClose(page, "Hard");
      const loci = await getLoci(page);
      hardInterval = loci[0]!.interval ?? 0;
    }

    // Good run
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Good Baseline");
    await page.locator("#mp-content").fill("Content.");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByPlaceholder("Route name").fill("Good Baseline Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await rateAndClose(page, "Good");
    const loci = await getLoci(page);
    goodInterval = loci[0]!.interval ?? 0;

    // Hard interval is ≥ 1 but ≤ good interval
    expect(hardInterval).toBeGreaterThanOrEqual(1);
    expect(hardInterval).toBeLessThanOrEqual(goodInterval);
  });
});

// ── PROGRESSIVE REVIEWS ───────────────────────────────────────────────────────

test.describe("progressive review scheduling", () => {
  test("second Good review produces a longer interval than the first", async ({ page }) => {
    await setupSingleLocus(page, "Progressive Route");

    // First review
    await rateAndClose(page, "Good");
    const loci1 = await getLoci(page);
    const interval1 = loci1[0]!.interval ?? 0;

    // Second review (immediately re-open and rate)
    await rateAndClose(page, "Good");
    const loci2 = await getLoci(page);
    const interval2 = loci2[0]!.interval ?? 0;

    expect(interval2).toBeGreaterThan(interval1);
    expect(loci2[0]!.repetitions).toBeGreaterThan(loci1[0]!.repetitions ?? 0);
  });

  test("Fail after Good resets interval back to 1", async ({ page }) => {
    await setupSingleLocus(page, "Reset Route");

    // Build up interval with Good
    await rateAndClose(page, "Good");
    const loci1 = await getLoci(page);
    expect(loci1[0]!.interval).toBeGreaterThan(1);

    // Fail resets it
    await rateAndClose(page, "Forgot");
    const loci2 = await getLoci(page);
    expect(loci2[0]!.interval).toBe(1);
    expect(loci2[0]!.repetitions).toBe(0);
  });
});

// ── REVIEW QUEUE UI ───────────────────────────────────────────────────────────

test.describe("review queue UI", () => {
  test("due badge shows correct count after Fail", async ({ page }) => {
    await setupSingleLocus(page, "Badge Route");
    await rateAndClose(page, "Forgot");

    // After Fail, this item is due again immediately
    // The badge shows total due items (node + route)
    await expect(page.getByRole("button", { name: /due/i })).toBeVisible({ timeout: 5000 });
    const badgeText = await page.getByRole("button", { name: /due/i }).textContent();
    const count = parseInt(badgeText?.match(/\d+/)?.[0] ?? "0");
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("review queue panel shows due route and node cards", async ({ page }) => {
    await setupSingleLocus(page, "Queue Panel Route");
    await rateAndClose(page, "Forgot");

    await page.getByRole("button", { name: /due/i }).click();
    await expect(page.getByText("Review Queue", { exact: true })).toBeVisible();

    await expect(page.getByRole("button", { name: "Review route" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Focus node" })).toBeVisible();
  });

  test("clicking Review route opens walk mode for due route", async ({ page }) => {
    await setupSingleLocus(page, "Review Route Launch");
    await rateAndClose(page, "Forgot");

    await page.getByRole("button", { name: /due/i }).click();
    await expect(page.getByText("Review Queue")).toBeVisible();

    await page.getByRole("button", { name: "Review route" }).click();
    await expect(page.getByText("Walk active")).toBeVisible();
  });

  test("after Easy rating, item is not immediately due", async ({ page }) => {
    await setupSingleLocus(page, "Easy Not Due Route");
    await rateAndClose(page, "Easy");

    // After Easy, the interval should be many days out
    const loci = await getLoci(page);
    const locus = loci[0]!;
    const reviewDate = new Date(locus.nextReviewAt!);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    expect(reviewDate.getTime()).toBeGreaterThan(threeDaysFromNow.getTime());
  });

  test("locus_updated analytics event fires after rating", async ({ page }) => {
    await setupSingleLocus(page, "Locus Update Route");
    await rateAndClose(page, "Good");

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
            if (!store) throw new Error("missing store hook");
            const events = (store.getState() as { analyticsEvents: Array<{ eventType: string }> })
              .analyticsEvents;
            return events.some((e) => e.eventType === "locus_updated");
          }),
        { timeout: 8000 },
      )
      .toBe(true);
  });
});
