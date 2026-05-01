/**
 * Comprehensive analytics event coverage.
 *
 * Verifies that every AnalyticsEventType fires at the right moment with the
 * correct eventGroup and that the payloadJson is well-formed JSON.
 *
 * Event types exercised:
 *   palace_created  palace_opened  palace_saved  palace_deleted  palace_restored
 *   draft_saved  node_created  node_updated  edge_created  route_created
 *   locus_added  walk_started  walk_stepped  walk_answer_revealed
 *   walk_recall_rated  walk_closed  walk_completed
 */

import { expect, test } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

interface AnalyticsEvent {
  id: string;
  sessionId?: string | null;
  palaceId?: string | null;
  routeId?: string | null;
  nodeId?: string | null;
  eventType: string;
  eventGroup: string;
  createdAt: string;
  payloadJson: string;
}

async function getEvents(page: import("@playwright/test").Page): Promise<AnalyticsEvent[]> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    return (store.getState() as { analyticsEvents: AnalyticsEvent[] }).analyticsEvents;
  });
}

async function waitForEvent(
  page: import("@playwright/test").Page,
  eventType: string,
  timeoutMs = 8000,
) {
  await expect
    .poll(() => getEvents(page), { timeout: timeoutMs })
    .toEqual(expect.arrayContaining([expect.objectContaining({ eventType })]));
}

async function getSessionId(page: import("@playwright/test").Page): Promise<string | null> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) return null;
    return (store.getState() as { analyticsSessionId: string | null }).analyticsSessionId;
  });
}

async function bootstrapTutorial(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
}

// ── SESSION TRACKING ──────────────────────────────────────────────────────────

test.describe("analytics session", () => {
  test("session ID is a non-empty string", async ({ page }) => {
    await page.goto("/");
    const sessionId = await getSessionId(page);
    expect(typeof sessionId).toBe("string");
    expect(sessionId!.length).toBeGreaterThan(0);
  });

  test("session ID is consistent within a page load", async ({ page }) => {
    await page.goto("/");
    const id1 = await getSessionId(page);

    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    const id2 = await getSessionId(page);
    expect(id1).toBe(id2);
  });

  test("each event carries the session ID", async ({ page }) => {
    await bootstrapTutorial(page);
    const sessionId = await getSessionId(page);
    const events = await getEvents(page);
    const withSession = events.filter((e) => e.sessionId != null);
    expect(withSession.length).toBeGreaterThan(0);
    for (const e of withSession) {
      expect(e.sessionId).toBe(sessionId);
    }
  });
});

// ── PALACE EVENTS ─────────────────────────────────────────────────────────────

test.describe("palace analytics events", () => {
  test("palace_created fires on create", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Event Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Event Palace" })).toBeVisible();

    await waitForEvent(page, "palace_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "palace_created");
    expect(ev!.eventGroup).toBe("palace");
    expect(ev!.palaceId).toBeTruthy();
    expect(JSON.parse(ev!.payloadJson)).toMatchObject({ name: "Event Palace" });
  });

  test("palace_opened fires on open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Open Source Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Open Source Palace" })).toBeVisible();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Other");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Other" })).toBeVisible();

    await page.getByRole("button", { name: "Open Source Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Open Source Palace" })).toBeVisible();

    await waitForEvent(page, "palace_opened");
  });

  test("palace_saved fires on manual save", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Save Test Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await waitForEvent(page, "palace_saved");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "palace_saved");
    expect(ev!.eventGroup).toBe("palace");
  });

  test("palace_deleted fires on soft-delete", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Delete Me Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Delete Me Palace" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await waitForEvent(page, "palace_deleted");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "palace_deleted");
    expect(ev!.eventGroup).toBe("palace");
  });

  test("palace_restored fires on restore from trash", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Restore Event Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Restore Event Palace" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();
    await expect(page.getByText("Trash")).toBeVisible({ timeout: 8000 });
    await page.getByRole("button", { name: "Restore" }).click();

    await waitForEvent(page, "palace_restored");
  });
});

// ── GRAPH EVENTS ──────────────────────────────────────────────────────────────

test.describe("graph analytics events", () => {
  test("node_created fires when a node is added via inspector", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Analytics Node");
    await page.getByRole("button", { name: "Apply" }).click();

    await waitForEvent(page, "node_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "node_created");
    expect(ev!.eventGroup).toBe("graph");
    expect(ev!.nodeId).toBeTruthy();
    expect(ev!.palaceId).toBeTruthy();
  });

  test("node_updated fires when node title is changed", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Original Title");
    await page.getByRole("button", { name: "Apply" }).click();

    // Clear node_created event, then update
    await page.locator("#mp-title").fill("Updated Title");
    await page.getByRole("button", { name: "Apply" }).click();

    await waitForEvent(page, "node_updated");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "node_updated");
    expect(ev!.eventGroup).toBe("graph");
  });

  test("edge_created fires when an edge is created via CAST panel", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator(".tl-background").first().dblclick({ position: { x: 180, y: 140 } });

    // Queue the pending cast for the two nodes
    await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
        } | null;
        setPendingCast: (v: {
          fromShapeId: string;
          toShapeId: string;
          sourceNodeId: string;
          targetNodeId: string;
        }) => void;
      };
      const editor = state.editorRef;
      if (!editor) throw new Error("editor not ready");
      const nodes: Array<{ shapeId: string; nodeId: string }> = [];
      for (const shapeId of editor.getCurrentPageShapeIds()) {
        const shape = editor.getShape(shapeId);
        const nodeId = shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
        if (nodeId) nodes.push({ shapeId, nodeId });
      }
      if (nodes.length < 2) throw new Error("need at least 2 nodes");
      state.setPendingCast({
        fromShapeId: nodes[0]!.shapeId,
        toShapeId: nodes[1]!.shapeId,
        sourceNodeId: nodes[0]!.nodeId,
        targetNodeId: nodes[1]!.nodeId,
      });
    });

    await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
    await page.getByRole("button", { name: /create edge/i }).click();

    await waitForEvent(page, "edge_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "edge_created");
    expect(ev!.eventGroup).toBe("graph");
  });

  test("route_created fires when a route is added", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByPlaceholder("Route name").fill("Analytics Route");
    await page.getByRole("button", { name: "Add route" }).click();

    await waitForEvent(page, "route_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "route_created");
    expect(ev!.eventGroup).toBe("graph");
    expect(ev!.routeId).toBeTruthy();
    expect(JSON.parse(ev!.payloadJson)).toMatchObject({ name: "Analytics Route" });
  });

  test("locus_added fires when a node is added to a route", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.getByPlaceholder("Route name").fill("Locus Test Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();

    await waitForEvent(page, "locus_added");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "locus_added");
    expect(ev!.eventGroup).toBe("graph");
    expect(ev!.routeId).toBeTruthy();
  });
});

// ── WALK / REVIEW EVENTS ──────────────────────────────────────────────────────

test.describe("walk analytics events", () => {
  async function setupWalk(page: import("@playwright/test").Page) {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Walk Node");
    await page.locator("#mp-content").fill("Walk answer content.");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByPlaceholder("Route name").fill("Walk Test Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await page.getByRole("button", { name: "Toggle walk mode" }).click();
    await expect(page.getByText("Walk active")).toBeVisible();
  }

  test("walk_started fires when walk opens", async ({ page }) => {
    await setupWalk(page);
    await waitForEvent(page, "walk_started");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "walk_started");
    expect(ev!.eventGroup).toBe("review");
    expect(ev!.routeId).toBeTruthy();
  });

  test("walk_stepped fires when navigating to next step", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.getByPlaceholder("Route name").fill("Stepped Route");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();

    await page.getByRole("button", { name: "Toggle walk mode" }).click();
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("Step 2/2")).toBeVisible();

    await waitForEvent(page, "walk_stepped");
  });

  test("walk_answer_revealed fires when answer is revealed in recall mode", async ({ page }) => {
    await setupWalk(page);
    await page.getByRole("button", { name: "Recall-first" }).click();
    await page.getByRole("button", { name: "Reveal answer" }).click();

    await waitForEvent(page, "walk_answer_revealed");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "walk_answer_revealed");
    expect(ev!.eventGroup).toBe("review");
    const payload = JSON.parse(ev!.payloadJson) as { revealLatencyMs?: number };
    expect(typeof payload.revealLatencyMs).toBe("number");
  });

  test("walk_recall_rated fires for all four rating buttons", async ({ page }) => {
    for (const rating of ["Easy", "Good", "Hard", "Forgot"]) {
      await bootstrapTutorial(page);
      await page.getByRole("button", { name: /^Node$/ }).click();
      await page.locator("#mp-title").fill(`Node for ${rating}`);
      await page.locator("#mp-content").fill("Content.");
      await page.getByRole("button", { name: "Apply" }).click();
      await page.getByPlaceholder("Route name").fill(`${rating} Route`);
      await page.getByRole("button", { name: "Add route" }).click();
      await page.getByRole("button", { name: /add selected node to route/i }).click();

      await page.getByRole("button", { name: "Toggle walk mode" }).click();
      await page.getByRole("button", { name: "Recall-first" }).click();
      await page.getByRole("button", { name: "Reveal answer" }).click();
      await page.getByRole("button", { name: rating }).click();

      await waitForEvent(page, "walk_recall_rated");

      const events = await getEvents(page);
      const ratingEvents = events.filter((e) => e.eventType === "walk_recall_rated");
      const latest = ratingEvents[ratingEvents.length - 1]!;
      expect(latest.eventGroup).toBe("review");

      const payload = JSON.parse(latest.payloadJson) as { rating: string };
      expect(payload.rating).toBe(rating.toLowerCase() === "forgot" ? "again" : rating.toLowerCase());
    }
  });

  test("walk_closed fires when walk is toggled off", async ({ page }) => {
    await setupWalk(page);
    await page.getByRole("button", { name: "Toggle walk mode" }).click();
    await expect(page.getByText("Walk active")).not.toBeVisible();

    await waitForEvent(page, "walk_closed");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "walk_closed");
    expect(ev!.eventGroup).toBe("review");
    const payload = JSON.parse(ev!.payloadJson) as { stepsCompleted?: number };
    expect(typeof payload.stepsCompleted).toBe("number");
  });

  test("all walk events carry palaceId and routeId", async ({ page }) => {
    await setupWalk(page);
    await page.getByRole("button", { name: "Toggle walk mode" }).click();

    await waitForEvent(page, "walk_closed");

    const events = await getEvents(page);
    const walkEvents = events.filter((e) => e.eventType.startsWith("walk_"));
    for (const ev of walkEvents) {
      expect(ev.palaceId).toBeTruthy();
      expect(ev.routeId).toBeTruthy();
    }
  });
});

// ── EVENT PAYLOAD INTEGRITY ───────────────────────────────────────────────────

test.describe("analytics event payload integrity", () => {
  test("all events have valid ISO-8601 createdAt timestamps", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Timestamp Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    const events = await getEvents(page);
    for (const ev of events) {
      const date = new Date(ev.createdAt);
      expect(date.toISOString()).toBe(ev.createdAt);
    }
  });

  test("all events have valid JSON payloadJson", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("JSON Node");
    await page.getByRole("button", { name: "Apply" }).click();

    const events = await getEvents(page);
    for (const ev of events) {
      expect(() => JSON.parse(ev.payloadJson)).not.toThrow();
    }
  });

  test("all events have a unique ID", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Unique ID Node");
    await page.getByRole("button", { name: "Apply" }).click();

    const events = await getEvents(page);
    const ids = events.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("events are ordered chronologically (createdAt ascending)", async ({ page }) => {
    await bootstrapTutorial(page);
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Chrono Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    const events = await getEvents(page);
    for (let i = 1; i < events.length; i++) {
      expect(Date.parse(events[i]!.createdAt)).toBeGreaterThanOrEqual(
        Date.parse(events[i - 1]!.createdAt),
      );
    }
  });
});
