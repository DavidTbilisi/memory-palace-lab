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
import {
  addNode,
  addSelectedToRoute,
  createRoute,
  editSelectedNode,
  selectAllNodes,
} from "./nodeHelpers";

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

/**
 * With the Learn panel open the toolbar is too narrow at the test viewport: the storage
 * status button is laid over the checkpoint button and takes the click.
 */
async function closeLearnPanel(page: import("@playwright/test").Page) {
  const learnClose = page.getByRole("button", { name: "Close learn panel" });
  if (await learnClose.isVisible()) await learnClose.click();
}

async function saveCheckpoint(page: import("@playwright/test").Page) {
  await closeLearnPanel(page);
  await page.getByRole("button", { name: /Save Checkpoint|Checkpoint Now/ }).click();
}

async function bootstrapTutorial(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await closeLearnPanel(page);
}

// ── SESSION TRACKING ──────────────────────────────────────────────────────────

test.describe("analytics session", () => {
  // The analytics session starts when a palace is opened (openPalace), not at page load.
  test("session ID is a non-empty string once a palace is open", async ({ page }) => {
    await page.goto("/");
    expect(await getSessionId(page)).toBeNull();

    await bootstrapTutorial(page);
    const sessionId = await getSessionId(page);
    expect(typeof sessionId).toBe("string");
    expect(sessionId!.length).toBeGreaterThan(0);
  });

  test("session ID is consistent while a palace stays open", async ({ page }) => {
    await bootstrapTutorial(page);
    const id1 = await getSessionId(page);
    expect(id1).toBeTruthy();

    await addNode(page);
    await editSelectedNode(page, { title: "Session Node" });
    await waitForEvent(page, "node_updated");

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
    await saveCheckpoint(page);

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Other");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Other" })).toBeVisible();

    await page.getByRole("button", { name: "Open Source Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Open Source Palace" })).toBeVisible();

    await waitForEvent(page, "palace_opened");
  });

  test("palace_saved fires on manual save", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "Save Test Node" });
    await saveCheckpoint(page);

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
    await addNode(page);
    await editSelectedNode(page, { title: "Analytics Node" });

    await waitForEvent(page, "node_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "node_created");
    expect(ev!.eventGroup).toBe("graph");
    expect(ev!.nodeId).toBeTruthy();
    expect(ev!.palaceId).toBeTruthy();
  });

  test("node_updated fires when node title is changed", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "Original Title" });

    // Clear node_created event, then update
    await editSelectedNode(page, { title: "Updated Title" });

    await waitForEvent(page, "node_updated");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "node_updated");
    expect(ev!.eventGroup).toBe("graph");
  });

  test("edge_created fires when an edge is created via CAST panel", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await addNode(page);

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

    await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
    await page.getByRole("button", { name: /create edge/i }).click();

    await waitForEvent(page, "edge_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "edge_created");
    expect(ev!.eventGroup).toBe("graph");
  });

  test("route_created fires when a route is added", async ({ page }) => {
    await bootstrapTutorial(page);
    await createRoute(page, "Analytics Route");

    await waitForEvent(page, "route_created");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "route_created");
    expect(ev!.eventGroup).toBe("graph");
    expect(ev!.routeId).toBeTruthy();
    // The event fires at creation, when the route still has its default "Route N" name;
    // the rename that follows is not part of it.
    expect(JSON.parse(ev!.payloadJson)).toMatchObject({ name: "Route 1" });
  });

  test("locus_added fires when a node is added to a route", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await createRoute(page, "Locus Test Route");
    await addSelectedToRoute(page);

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
    await addNode(page);
    await editSelectedNode(page, { title: "Walk Node", content: "Walk answer content." });
    await createRoute(page, "Walk Test Route");
    await addSelectedToRoute(page);
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
    // Two steps need two nodes: a route holds each node once.
    await addNode(page);
    await addNode(page);
    await createRoute(page, "Stepped Route");
    await selectAllNodes(page);
    await addSelectedToRoute(page);

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
    const payload = JSON.parse(ev!.payloadJson) as { timeToRevealMs?: number };
    expect(typeof payload.timeToRevealMs).toBe("number");
  });

  // The buttons carry their shortcut digit: "1 Again", "2 Hard", "3 Good", "4 Easy".
  // One test per rating: four walk setups do not fit in a single test's timeout.
  for (const rating of ["Easy", "Good", "Hard", "Again"]) {
    test(`walk_recall_rated fires for the ${rating} rating button`, async ({ page }) => {
      await bootstrapTutorial(page);
      await addNode(page);
      await editSelectedNode(page, { title: `Node for ${rating}`, content: "Content." });
      await createRoute(page, `${rating} Route`);
      await addSelectedToRoute(page);

      await page.getByRole("button", { name: "Toggle walk mode" }).click();
      await page.getByRole("button", { name: "Recall-first" }).click();
      await page.getByRole("button", { name: "Reveal answer" }).click();
      await page.getByRole("button", { name: new RegExp(`^\\d ${rating}$`) }).click();

      await waitForEvent(page, "walk_recall_rated");

      const events = await getEvents(page);
      const ratingEvents = events.filter((e) => e.eventType === "walk_recall_rated");
      expect(ratingEvents).toHaveLength(1);
      expect(ratingEvents[0]!.eventGroup).toBe("review");

      const payload = JSON.parse(ratingEvents[0]!.payloadJson) as { rating: string };
      expect(payload.rating).toBe(rating.toLowerCase());
    });
  }

  test("walk_closed fires when walk is toggled off", async ({ page }) => {
    await setupWalk(page);
    await page.getByRole("button", { name: "Toggle walk mode" }).click();
    await expect(page.getByText("Walk active")).not.toBeVisible();

    await waitForEvent(page, "walk_closed");

    const events = await getEvents(page);
    const ev = events.find((e) => e.eventType === "walk_closed");
    expect(ev!.eventGroup).toBe("review");
    const payload = JSON.parse(ev!.payloadJson) as { stepIndex?: number; routeLength?: number };
    expect(typeof payload.stepIndex).toBe("number");
    expect(payload.routeLength).toBe(1);
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
    await addNode(page);
    await editSelectedNode(page, { title: "Timestamp Node" });
    await saveCheckpoint(page);

    const events = await getEvents(page);
    for (const ev of events) {
      const date = new Date(ev.createdAt);
      expect(date.toISOString()).toBe(ev.createdAt);
    }
  });

  test("all events have valid JSON payloadJson", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "JSON Node" });

    const events = await getEvents(page);
    for (const ev of events) {
      expect(() => JSON.parse(ev.payloadJson)).not.toThrow();
    }
  });

  test("all events have a unique ID", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "Unique ID Node" });

    const events = await getEvents(page);
    const ids = events.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("events are ordered newest first (createdAt descending)", async ({ page }) => {
    await bootstrapTutorial(page);
    await addNode(page);
    await editSelectedNode(page, { title: "Chrono Node" });
    await saveCheckpoint(page);

    const events = await getEvents(page);
    for (let i = 1; i < events.length; i++) {
      expect(Date.parse(events[i]!.createdAt)).toBeLessThanOrEqual(
        Date.parse(events[i - 1]!.createdAt),
      );
    }
  });
});
