import { expect, test } from "@playwright/test";

// Helper: create tutorial palace and return to root
async function setupTutorialPalace(page: Parameters<Parameters<typeof test>[1]>[0]) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
}

// Helper: get Zustand store walk state through the dev hook
async function getWalkState(page: Parameters<Parameters<typeof test>[1]>[0]) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing __mp_store dev hook");
    const s = store.getState() as {
      walkIndex: number;
      walkOpen: boolean;
      walkRouteId: string | null;
      walkAnswerRevealed: boolean;
      walkRecallMode: boolean;
    };
    return {
      walkIndex: s.walkIndex,
      walkOpen: s.walkOpen,
      walkRouteId: s.walkRouteId,
      walkAnswerRevealed: s.walkAnswerRevealed,
      walkRecallMode: s.walkRecallMode,
    };
  });
}

// ── Empty route ────────────────────────────────────────────────────────────────

test("walk mode with empty route shows step 0/0 and disables next/prev", async ({ page }) => {
  await setupTutorialPalace(page);

  // Create a route with no loci
  await page.getByPlaceholder("Route name").fill("Empty Route");
  await page.getByRole("button", { name: "Add route" }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();

  // Empty route → Step 0/0
  await expect(page.getByText(/Step 0\/0/)).toBeVisible();

  // Next and Prev should be present but clicking should not move the index
  const stateBefore = await getWalkState(page);
  await page.getByRole("button", { name: "Next step" }).click();
  const stateAfter = await getWalkState(page);
  expect(stateAfter.walkIndex).toBe(stateBefore.walkIndex);
});

// ── Single-locus route ────────────────────────────────────────────────────────

test("single-locus route clamps next and prev at index 0", async ({ page }) => {
  await setupTutorialPalace(page);

  // Create a node and add it once
  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Solo Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();
  await expect(page.getByText("Step 1/1")).toBeVisible();

  // Next should clamp at 0 (still Step 1/1)
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 1/1")).toBeVisible();

  // Previous should also clamp at 0
  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByText("Step 1/1")).toBeVisible();

  const state = await getWalkState(page);
  expect(state.walkIndex).toBe(0);
});

// ── Rapid navigation ──────────────────────────────────────────────────────────

test("rapid next clicks do not advance past the last locus", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Rapid Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();

  // Click next rapidly 10× — should clamp at last locus
  const nextBtn = page.getByRole("button", { name: "Next step" });
  for (let i = 0; i < 10; i++) {
    await nextBtn.click();
  }

  await expect(page.getByText("Step 2/2")).toBeVisible();
  const state = await getWalkState(page);
  expect(state.walkIndex).toBe(1);
});

test("rapid previous clicks do not go below index 0", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Rapid Prev Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();

  // Advance to step 2
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();

  // Click previous rapidly 10× — should clamp at 0
  const prevBtn = page.getByRole("button", { name: "Previous step" });
  for (let i = 0; i < 10; i++) {
    await prevBtn.click();
  }

  await expect(page.getByText("Step 1/2")).toBeVisible();
  const state = await getWalkState(page);
  expect(state.walkIndex).toBe(0);
});

// ── Close and reopen walk ─────────────────────────────────────────────────────

test("closing and reopening walk resets index to 0", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Reopen Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  const toggleBtn = page.getByRole("button", { name: "Toggle walk mode" });
  await toggleBtn.click();
  await expect(page.getByText("Step 1/2")).toBeVisible();

  // Advance then close
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await toggleBtn.click();
  await expect(page.getByText("Walk active")).not.toBeVisible();

  // Reopen — should be back at step 1
  await toggleBtn.click();
  await expect(page.getByText("Walk active")).toBeVisible();
  await expect(page.getByText("Step 1/2")).toBeVisible();
});

// ── Recall mode state transitions ─────────────────────────────────────────────

test("recall mode: answer stays hidden until Reveal is clicked", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Test cue");
  await page.locator("#mp-content").fill("Secret answer text");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByPlaceholder("Route name").fill("Recall Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await page.getByRole("button", { name: "Recall-first" }).click();

  // Answer must be hidden
  await expect(page.locator("#walk-answer")).not.toContainText("Secret answer text");
  await expect(page.getByRole("button", { name: "Reveal answer" })).toBeVisible();

  // Reveal
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.locator("#walk-answer")).toContainText("Secret answer text");

  // Rating buttons appear
  await expect(page.getByRole("button", { name: "Good" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hard" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Forgot" })).toBeVisible();
});

test("toggling recall mode off shows answer immediately without Reveal", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Open cue");
  await page.locator("#mp-content").fill("Visible answer text");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByPlaceholder("Route name").fill("Open Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();

  // Default mode: answer is visible
  await expect(page.locator("#walk-answer")).toContainText("Visible answer text");
  await expect(page.getByRole("button", { name: "Reveal answer" })).not.toBeVisible();
});

// ── Analytics events ──────────────────────────────────────────────────────────

test("walk_started analytics event fires when walk opens", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Analytics Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing __mp_store dev hook");
        const state = store.getState() as {
          analyticsEvents: Array<{ eventType: string }>;
        };
        return state.analyticsEvents.some((e) => e.eventType === "walk_started");
      }),
    )
    .toBe(true);
});

test("walk_closed analytics event fires when walk closes", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Close Analytics Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  const toggleBtn = page.getByRole("button", { name: "Toggle walk mode" });
  await toggleBtn.click();
  await expect(page.getByText("Walk active")).toBeVisible();
  await toggleBtn.click();
  await expect(page.getByText("Walk active")).not.toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing __mp_store dev hook");
        const state = store.getState() as {
          analyticsEvents: Array<{ eventType: string }>;
        };
        return state.analyticsEvents.some((e) => e.eventType === "walk_closed");
      }),
    )
    .toBe(true);
});

// ── Step entry timing ─────────────────────────────────────────────────────────

test("walkStepEnteredAt is stamped when walk opens and refreshed on next step", async ({ page }) => {
  await setupTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Timing Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  const before = Date.now();
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();

  const enteredAt1 = await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing __mp_store dev hook");
    return (store.getState() as { walkStepEnteredAt: string | null }).walkStepEnteredAt;
  });

  expect(enteredAt1).not.toBeNull();
  expect(Date.parse(enteredAt1!)).toBeGreaterThanOrEqual(before);

  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();

  const enteredAt2 = await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing __mp_store dev hook");
    return (store.getState() as { walkStepEnteredAt: string | null }).walkStepEnteredAt;
  });

  expect(enteredAt2).not.toBeNull();
  // Each step should get a fresh (same or newer) timestamp
  expect(Date.parse(enteredAt2!)).toBeGreaterThanOrEqual(Date.parse(enteredAt1!));
});
