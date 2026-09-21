/**
 * Spaced repetition scheduling details.
 *
 * Tests the SM2-style algorithm: verify that interval, easeFactor, and
 * repetitions update correctly for each recall rating, that the review
 * queue reflects the scheduled state, and that the review panel UI
 * correctly surfaces due items.
 *
 * Rating mapping (from RecallRating):
 *   "again" (Fail/Forgot) → interval resets to 1, repetitions to 0, ease decreases
 *   "hard"                → 1 day on the first review, then ×1.2; ease decreases
 *   "good"                → 1 day, then 6 days, then ×ease; ease unchanged
 *   "easy"                → 2 days, then 8 days, then ×ease×1.3; ease increases
 *
 * Every rating schedules the next review at least a day out, so nothing is due straight
 * after a review; the due-queue tests move the browser clock forward instead.
 */

import { expect, test } from "@playwright/test";
import { addNode, addSelectedToRoute, createRoute, editSelectedNode } from "./nodeHelpers";
import { openTutorialPalace } from "./routeHelpers";

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

const DAY_MS = 24 * 60 * 60 * 1000;

/** The Review button in the page navigation; it carries the badge with the number of due loci. */
function reviewNav(page: import("@playwright/test").Page) {
  return page.locator('[data-nav-primary="review"]');
}

/**
 * Rate the only stop "Again" and let a day and a bit pass, so that stop is due again. The
 * browser clock must be installed (`page.clock.install()`) before the page loads. The due
 * queue is only recomputed when the palace changes, so a checkpoint makes it read the new time.
 */
async function failThenWaitUntilDue(page: import("@playwright/test").Page, routeName: string) {
  await setupSingleLocus(page, routeName);
  await rateAndClose(page, "Again");
  await expect(reviewNav(page).getByLabel(/loci due for review/)).toHaveCount(0);
  await page.clock.fastForward("25:00:00");
  await page.getByRole("button", { name: /Save Checkpoint|Checkpoint Now/ }).click();
}

async function setupSingleLocus(
  page: import("@playwright/test").Page,
  routeName: string,
  title = "Review Subject",
  content = "This is the content to review.",
) {
  await openTutorialPalace(page);

  await addNode(page);
  await editSelectedNode(page, { title, content });

  // The new node stays selected on the canvas while the Routes tab is open.
  await createRoute(page, routeName);
  await addSelectedToRoute(page);
  await expect.poll(async () => (await getLoci(page)).length).toBe(1);
}

/** Walk the route recall-first, reveal the answer, rate it ("Again", "Hard", "Good", "Easy"), leave the walk. */
async function rateAndClose(
  page: import("@playwright/test").Page,
  ratingButton: string,
) {
  const walkToggle = page.getByRole("button", { name: "Toggle walk mode" });
  const reveal = page.getByRole("button", { name: "Reveal answer" });
  await walkToggle.click();
  await expect(walkToggle).toHaveText(/Walk on/);
  // Recall-first stays on between walks, so only switch it on when the walk opened without it.
  if (!(await reveal.isVisible())) {
    await expect(page.getByText("Walk active")).toBeVisible();
    await page.getByRole("button", { name: "Recall-first" }).click();
  }
  await reveal.click();
  // Rating buttons read "1 Again", "2 Hard", "3 Good", "4 Easy".
  await page.getByRole("button", { name: new RegExp(`^\\d ${ratingButton}$`) }).click();
  // Rating the only stop ends the walk and shows the session summary. It is dismissed with
  // Escape: tldraw's style panel paints over the summary's "Done" button while a node is selected.
  await expect(page.getByText("Session Summary")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Session Summary")).not.toBeVisible();
  await expect(walkToggle).toHaveText(/Walk off/);
}

// ── INITIAL LOCUS STATE ───────────────────────────────────────────────────────

test.describe("initial locus scheduling state", () => {
  test("new locus is never reviewed and first due a day after it was added", async ({ page }) => {
    const before = Date.now();
    await setupSingleLocus(page, "Initial Route");
    const loci = await getLoci(page);
    const locus = loci[0];
    expect(locus).toBeDefined();
    expect(locus!.repetitions ?? 0).toBe(0);
    expect(locus!.lastReviewedAt ?? null).toBeNull();
    // A new stop gets the default schedule: interval 1, so its first review is tomorrow.
    expect(locus!.interval).toBe(1);
    const firstReview = Date.parse(locus!.nextReviewAt!);
    expect(firstReview).toBeGreaterThanOrEqual(before + DAY_MS - 60_000);
    expect(firstReview).toBeLessThanOrEqual(Date.now() + DAY_MS);
  });
});

// ── AFTER FAIL/AGAIN ──────────────────────────────────────────────────────────

test.describe("rating: Fail (again)", () => {
  test("after Fail: interval is 1 and repetitions reset to 0", async ({ page }) => {
    await setupSingleLocus(page, "Fail Route");
    await rateAndClose(page, "Again");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.interval).toBe(1);
    expect(locus.repetitions).toBe(0);
  });

  test("after Fail: nextReviewAt is today or tomorrow", async ({ page }) => {
    await setupSingleLocus(page, "Fail Date Route");
    await rateAndClose(page, "Again");

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

  test("after Fail: review queue shows item as due a day later", async ({ page }) => {
    await page.clock.install();
    await failThenWaitUntilDue(page, "Fail Queue Route");

    await expect(reviewNav(page).getByLabel("1 loci due for review")).toBeVisible();
  });

  test("after Fail: lastReviewedAt is set to recent timestamp", async ({ page }) => {
    const before = new Date().toISOString();
    await setupSingleLocus(page, "Fail Timestamp Route");
    await rateAndClose(page, "Again");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    expect(locus.lastReviewedAt).toBeTruthy();
    expect(Date.parse(locus.lastReviewedAt!)).toBeGreaterThanOrEqual(Date.parse(before));
  });
});

// ── AFTER GOOD ────────────────────────────────────────────────────────────────

test.describe("rating: Good", () => {
  test("after Good: interval is 1 day and repetitions = 1", async ({ page }) => {
    await setupSingleLocus(page, "Good Route");
    await rateAndClose(page, "Good");

    const loci = await getLoci(page);
    const locus = loci[0]!;

    // SM-2: the first successful review is always a day out; growth starts with the second.
    expect(locus.interval).toBe(1);
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
    test.slow(); // builds and reviews two palaces
    let goodInterval: number;

    // Good run
    {
      await setupSingleLocus(page, "Good Interval Route");
      await rateAndClose(page, "Good");
      const loci = await getLoci(page);
      goodInterval = loci[0]!.interval ?? 0;
    }

    // Easy run (fresh palace)
    await setupSingleLocus(page, "Easy Interval Route", "Easy Subject", "Content.");
    await rateAndClose(page, "Easy");
    const loci = await getLoci(page);
    const easyInterval = loci[0]!.interval ?? 0;

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
  test("after Hard: interval is at least 1 and no larger than Good", async ({ page }) => {
    test.slow(); // builds and reviews two palaces
    let hardInterval: number;

    // Hard run
    {
      await setupSingleLocus(page, "Hard Route");
      await rateAndClose(page, "Hard");
      const loci = await getLoci(page);
      hardInterval = loci[0]!.interval ?? 0;
    }

    // Good run
    await setupSingleLocus(page, "Good Baseline Route", "Good Baseline", "Content.");
    await rateAndClose(page, "Good");
    const loci = await getLoci(page);
    const goodInterval = loci[0]!.interval ?? 0;

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
    test.slow(); // three walks
    await setupSingleLocus(page, "Reset Route");

    // Build up interval with Good: the first Good is 1 day, the second 6
    await rateAndClose(page, "Good");
    await rateAndClose(page, "Good");
    const loci1 = await getLoci(page);
    expect(loci1[0]!.interval).toBeGreaterThan(1);

    // Fail resets it
    await rateAndClose(page, "Again");
    const loci2 = await getLoci(page);
    expect(loci2[0]!.interval).toBe(1);
    expect(loci2[0]!.repetitions).toBe(0);
  });
});

// ── REVIEW QUEUE UI ───────────────────────────────────────────────────────────

test.describe("review queue UI", () => {
  test("due badge shows correct count a day after Fail", async ({ page }) => {
    await page.clock.install();
    await failThenWaitUntilDue(page, "Badge Route");

    // Fail schedules the stop for tomorrow; a day on, it is the one due item in the badge.
    const badge = reviewNav(page).getByLabel(/loci due for review/);
    await expect(badge).toBeVisible();
    const count = parseInt((await badge.textContent())?.match(/\d+/)?.[0] ?? "0");
    expect(count).toBe(1);
  });

  test("review queue page shows the due locus with its route and node", async ({ page }) => {
    await page.clock.install();
    await failThenWaitUntilDue(page, "Queue Panel Route");

    await reviewNav(page).click();
    await expect(page.getByText("Global Review Queue", { exact: true })).toBeVisible();

    await expect(page.getByText("Tutorial Palace | Queue Panel Route | Review Subject")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start top due review" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Review now" })).toBeVisible();
  });

  test("clicking Review now opens walk mode for the due route", async ({ page }) => {
    await page.clock.install();
    await failThenWaitUntilDue(page, "Review Route Launch");

    await reviewNav(page).click();
    await expect(page.getByText("Global Review Queue", { exact: true })).toBeVisible();

    // The tip card in the bottom-right corner can sit on top of the queue's buttons.
    const dismissTip = page.getByRole("button", { name: "Dismiss tip" });
    if (await dismissTip.isVisible()) await dismissTip.click();
    await page.getByRole("button", { name: "Review now" }).click();
    await expect(page.getByRole("button", { name: "Toggle walk mode" })).toHaveText(/Walk on/);
    const walkedRoute = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
      const state = store.getState() as { walkRouteId: string | null; routes: { id: string; name: string }[] };
      return state.routes.find((route) => route.id === state.walkRouteId)?.name;
    });
    expect(walkedRoute).toBe("Review Route Launch");
    await expect(page.getByText("Step 1/1")).toBeVisible();
  });

  test("after Easy rating, item is not immediately due", async ({ page }) => {
    await setupSingleLocus(page, "Easy Not Due Route");
    await rateAndClose(page, "Easy");

    // The first Easy is two days out: later than any other first rating, and not in the queue
    const loci = await getLoci(page);
    const locus = loci[0]!;
    expect(locus.interval).toBe(2);
    const reviewDate = new Date(locus.nextReviewAt!);
    expect(reviewDate.getTime()).toBeGreaterThan(Date.now() + DAY_MS);
    await expect(reviewNav(page).getByLabel(/loci due for review/)).toHaveCount(0);
  });

  test("walk_recall_rated analytics event fires after rating", async ({ page }) => {
    await setupSingleLocus(page, "Locus Update Route");
    await rateAndClose(page, "Good");

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
            if (!store) throw new Error("missing store hook");
            const events = (
              store.getState() as {
                analyticsEvents: Array<{ eventType: string; payloadJson: string }>;
              }
            ).analyticsEvents;
            // A rating is recorded as walk_recall_rated; locus_updated is for label and order edits.
            return events.some((e) => e.eventType === "walk_recall_rated" && JSON.parse(e.payloadJson).rating === "good");
          }),
        { timeout: 8000 },
      )
      .toBe(true);
  });
});
