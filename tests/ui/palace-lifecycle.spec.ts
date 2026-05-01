/**
 * Full palace lifecycle tests.
 *
 * Covers: create → save → switch → reload, soft-delete (trash), restore,
 * permanent delete (purge), JSON backup export and import.
 *
 * These tests exercise the palace repository abstraction which is backed by
 * the in-memory adapter in web/dev mode and SQLite via Tauri IPC in
 * the desktop build. The behavior is identical — both paths implement the
 * same PalaceRepository interface.
 */

import { expect, test } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getAnalyticsEvents(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    return (store.getState() as { analyticsEvents: Array<{ eventType: string }> }).analyticsEvents;
  });
}

async function waitForEditorReady(page: import("@playwright/test").Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) return false;
        return !!(store.getState() as { editorRef?: unknown }).editorRef;
      }),
    )
    .toBe(true);
}

async function nodeExists(page: import("@playwright/test").Page, title: string) {
  return page.evaluate((t) => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) return false;
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) return false;
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (shape?.type === "geo" && shape.meta?.mpTitle === t) return true;
    }
    return false;
  }, title);
}

// ── CREATE & SWITCH ───────────────────────────────────────────────────────────

test.describe("palace create and switch", () => {
  test("creating three palaces lists all three in sidebar", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Alpha Palace", "Beta Palace", "Gamma Palace"]) {
      await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
      await page.getByRole("button", { name: "Create palace" }).click();
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Alpha Palace", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Beta Palace", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Gamma Palace", exact: true })).toBeVisible();
  });

  test("switching palaces loads the correct palace", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Switch A", "Switch B"]) {
      await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
      await page.getByRole("button", { name: "Create palace" }).click();
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }

    await page.getByRole("button", { name: "Switch A", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Switch A" })).toBeVisible();

    await page.getByRole("button", { name: "Switch B", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Switch B" })).toBeVisible();
  });

  test("palace_created analytics event fires on create", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Analytics Create Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Analytics Create Palace" })).toBeVisible();

    await expect
      .poll(() => getAnalyticsEvents(page), { timeout: 8000 })
      .toEqual(expect.arrayContaining([expect.objectContaining({ eventType: "palace_created" })]));
  });
});

// ── SAVE & RELOAD ─────────────────────────────────────────────────────────────

test.describe("palace save and reload", () => {
  test("saved nodes persist when switching away and back", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Persist Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Persist Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Persisted Node");
    await page.locator("#mp-content").fill("This content should survive.");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Other Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Other Palace" })).toBeVisible();

    await page.getByRole("button", { name: "Persist Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Persist Palace" })).toBeVisible();
    await waitForEditorReady(page);

    await expect.poll(() => nodeExists(page, "Persisted Node"), { timeout: 8000 }).toBe(true);
  });

  test("palace_saved analytics event fires on save", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Save Event Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect
      .poll(() => getAnalyticsEvents(page), { timeout: 8000 })
      .toEqual(expect.arrayContaining([expect.objectContaining({ eventType: "palace_saved" })]));
  });

  test("persistenceState transitions clean → dirty → clean after save", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Dirty Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Dirty Palace" })).toBeVisible();

    // New palace should be clean (no changes yet)
    const initialState = await page.evaluate(() => {
      const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
        persistenceState?: string;
      };
      return s?.persistenceState;
    });
    expect(initialState).toBe("clean");

    // After adding a node → dirty or draft
    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Trigger Dirty");
    await page.getByRole("button", { name: "Apply" }).click();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
            persistenceState?: string;
          };
          return s?.persistenceState;
        }),
      )
      .not.toBe("clean");

    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
            persistenceState?: string;
          };
          return s?.persistenceState;
        }),
      )
      .toBe("clean");
  });
});

// ── DRAFT AUTOSAVE ────────────────────────────────────────────────────────────

test.describe("draft autosave and restore", () => {
  test("draft saved indicator appears after node edit", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Draft Test Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Draft Test Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Autosave Node");
    await page.getByRole("button", { name: "Apply" }).click();

    await expect(page.getByText("Draft saved")).toBeVisible({ timeout: 5000 });
  });

  test("draft restores after switching palaces without saving", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Draft Restore Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Draft Restore Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Unsaved Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText("Draft saved")).toBeVisible({ timeout: 5000 });

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Away Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Away Palace" })).toBeVisible();

    await page.getByRole("button", { name: "Draft Restore Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Draft Restore Palace" })).toBeVisible();
    await expect(page.getByText("Draft restored")).toBeVisible({ timeout: 5000 });
    await waitForEditorReady(page);

    await expect.poll(() => nodeExists(page, "Unsaved Node"), { timeout: 8000 }).toBe(true);
  });

  test("draft_saved analytics event fires on autosave", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Draft Analytics Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Draft Analytics Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Draft Node");
    await page.getByRole("button", { name: "Apply" }).click();

    await expect
      .poll(() => getAnalyticsEvents(page), { timeout: 10000 })
      .toEqual(expect.arrayContaining([expect.objectContaining({ eventType: "draft_saved" })]));
  });
});

// ── TRASH / RESTORE / PURGE ───────────────────────────────────────────────────

test.describe("palace trash, restore, and purge", () => {
  test("moving a palace to trash removes it from active list", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Trash Target Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Trash Target Palace" })).toBeVisible();

    // Accept the confirm dialog automatically
    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    // Palace should disappear from the active list
    await expect
      .poll(
        () => page.getByRole("button", { name: "Trash Target Palace", exact: true }).isVisible(),
        { timeout: 8000 },
      )
      .toBe(false);
  });

  test("trashed palace appears in the Trash section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Will Be Trashed");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Will Be Trashed" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await expect(page.getByText("Trash")).toBeVisible({ timeout: 8000 });
    await expect(page.getByText("Will Be Trashed")).toBeVisible();
  });

  test("restoring a palace brings it back to active list", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Will Be Restored");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Will Be Restored" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await expect(page.getByText("Trash")).toBeVisible({ timeout: 8000 });
    await page.getByRole("button", { name: "Restore" }).click();

    // Should return to active list
    await expect
      .poll(
        () => page.getByRole("button", { name: "Will Be Restored", exact: true }).isVisible(),
        { timeout: 8000 },
      )
      .toBe(true);

    // Trash section should be gone (or at least not contain this palace)
    const trashSection = page.getByText("Trash");
    const stillInTrash = await trashSection.isVisible();
    if (stillInTrash) {
      await expect(page.locator(".space-y-2").getByText("Will Be Restored")).toHaveCount(0);
    }
  });

  test("purging a palace removes it from the trash permanently", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Will Be Purged");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Will Be Purged" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await expect(page.getByText("Trash")).toBeVisible({ timeout: 8000 });
    await expect(page.getByText("Will Be Purged")).toBeVisible();

    await page.getByRole("button", { name: "Delete now" }).click();

    // After purge, the trash section should no longer contain this palace
    await expect
      .poll(
        async () => {
          const trashVisible = await page.getByText("Trash").isVisible();
          if (!trashVisible) return true;
          return !(await page.getByText("Will Be Purged").isVisible());
        },
        { timeout: 8000 },
      )
      .toBe(true);
  });

  test("palace_deleted analytics event fires on soft-delete", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Delete Event Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Delete Event Palace" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await expect
      .poll(() => getAnalyticsEvents(page), { timeout: 8000 })
      .toEqual(expect.arrayContaining([expect.objectContaining({ eventType: "palace_deleted" })]));
  });

  test("palace_restored analytics event fires on restore", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Restore Event Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Restore Event Palace" })).toBeVisible();

    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();
    await expect(page.getByText("Trash")).toBeVisible({ timeout: 8000 });
    await page.getByRole("button", { name: "Restore" }).click();

    await expect
      .poll(() => getAnalyticsEvents(page), { timeout: 8000 })
      .toEqual(expect.arrayContaining([expect.objectContaining({ eventType: "palace_restored" })]));
  });
});

// ── JSON BACKUP EXPORT / IMPORT ───────────────────────────────────────────────

test.describe("JSON backup export and import", () => {
  test("export backup triggers a file download", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10000 }),
      page.locator('button[title="Download all palaces as a JSON backup"]').click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test("exported backup is valid JSON with version and palaces array", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10000 }),
      page.locator('button[title="Download all palaces as a JSON backup"]').click(),
    ]);

    const path = await download.path();
    const { readFileSync } = await import("node:fs");
    const raw = readFileSync(path!, "utf8");
    const parsed = JSON.parse(raw) as { version: number; exportedAt: string; palaces: unknown[] };

    expect(typeof parsed.version).toBe("number");
    expect(typeof parsed.exportedAt).toBe("string");
    expect(Array.isArray(parsed.palaces)).toBe(true);
    expect(parsed.palaces.length).toBeGreaterThan(0);
  });

  test("backup round-trip: export then import restores palaces", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Export Source Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Export Source Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Exported Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    // Export
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10000 }),
      page.locator('button[title="Download all palaces as a JSON backup"]').click(),
    ]);

    const exportPath = await download.path();
    const { readFileSync } = await import("node:fs");
    const backupContent = readFileSync(exportPath!, "utf8");

    // Verify export contains the palace
    const backup = JSON.parse(backupContent) as { palaces: Array<{ palace: { name: string } }> };
    const exportedPalace = backup.palaces.find((p) => p.palace.name === "Export Source Palace");
    expect(exportedPalace).toBeDefined();

    // Import via file input
    const fileInput = page.locator('input[type="file"]').last();
    await fileInput.setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(backupContent),
    });

    // Wait for import to complete (palace should appear in list)
    await expect
      .poll(
        () => page.getByRole("button", { name: "Export Source Palace", exact: true }).isVisible(),
        { timeout: 10000 },
      )
      .toBe(true);
  });
});

// ── MULTIPLE PALACE ISOLATION ─────────────────────────────────────────────────

test.describe("multiple palace isolation", () => {
  test("nodes from palace A do not appear in palace B", async ({ page }) => {
    await page.goto("/");
    // Create palace A with a unique node
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Isolation A");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Isolation A" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Only In A");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    // Create palace B
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Isolation B");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Isolation B" })).toBeVisible();
    await waitForEditorReady(page);

    // Verify the node from A is not in B
    const foundInB = await nodeExists(page, "Only In A");
    expect(foundInB).toBe(false);
  });

  test("routes from palace A do not appear in palace B", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Route Isolation A");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Route Isolation A" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.getByPlaceholder("Route name").fill("Private Route A");
    await page.getByRole("button", { name: "Add route" }).click();
    await page.getByRole("button", { name: /add selected node to route/i }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Route Isolation B");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Route Isolation B" })).toBeVisible();

    const routesInB = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return [];
      return (store.getState() as { routes: Array<{ name: string }> }).routes.map((r) => r.name);
    });
    expect(routesInB).not.toContain("Private Route A");
  });
});
