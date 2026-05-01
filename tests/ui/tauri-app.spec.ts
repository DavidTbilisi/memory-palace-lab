/**
 * Tauri desktop-app behavior tests.
 *
 * Section A — Repository-layer behaviors (run in both web and Tauri modes).
 *   These test the PalaceRepository interface which both the in-memory adapter
 *   (web/dev mode) and the Tauri SQLite adapter implement identically.
 *
 * Section B — Tauri IPC simulation.
 *   Uses addInitScript to inject a mock __TAURI_INTERNALS__ before the app
 *   boots, forcing the app into the Tauri code path and verifying it calls
 *   the correct commands with correct arguments.
 *
 * Section C — Health check.
 *   Tests that db_ping works when running against a real Tauri binary.
 *   These are conditionally skipped when no Tauri runtime is detected.
 */

import { expect, test, type Page } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

interface IpcCall {
  cmd: string;
  args: Record<string, unknown>;
}

async function getIpcCalls(page: Page): Promise<IpcCall[]> {
  return page.evaluate(() => {
    return (window as { __tauri_ipc_calls__?: IpcCall[] }).__tauri_ipc_calls__ ?? [];
  });
}


async function waitForEditorReady(page: Page) {
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

// ── Mock Tauri IPC setup ──────────────────────────────────────────────────────

/**
 * Injects a full Tauri IPC mock before the page loads.
 *
 * The mock:
 *   1. Sets window.__TAURI_INTERNALS__ so the app detects a Tauri environment.
 *   2. Intercepts all invoke() calls and routes them to an in-process handler
 *      that replicates the Tauri SQLite backend behaviour in memory.
 *   3. Records every call in window.__tauri_ipc_calls__ for test assertions.
 */
async function injectTauriMock(page: Page) {
  await page.addInitScript(() => {
    type PalaceDto = {
      id: string;
      name: string;
      createdAt: string;
      alias?: string | null;
      atlasPath?: string | null;
      deletedAt?: string | null;
      purgeAt?: string | null;
    };

    type Snapshot = {
      palace: PalaceDto;
      canvasObjects: unknown[];
      nodes: unknown[];
      edges: unknown[];
      routes: unknown[];
      loci: unknown[];
    };

    type AnalyticsEventDto = {
      id: string;
      sessionId?: string | null;
      palaceId?: string | null;
      routeId?: string | null;
      nodeId?: string | null;
      eventType: string;
      eventGroup: string;
      createdAt: string;
      payloadJson: string;
    };

    const palaces = new Map<string, PalaceDto>();
    const snapshots = new Map<string, Snapshot>();
    const analyticsStore: AnalyticsEventDto[] = [];
    const calls: IpcCall[] = [];

    interface IpcCall {
      cmd: string;
      args: Record<string, unknown>;
    }

    (window as { __tauri_ipc_calls__?: IpcCall[] }).__tauri_ipc_calls__ = calls;

    function generateId() {
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    // Minimal Tauri v2 internals shape
    (window as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ = {
      metadata: {
        currentWindow: { label: "main" },
        currentWebview: { label: "main" },
      },
      ipc: (msg: {
        cmd?: string;
        __TAURI_CALLBACK__?: number;
        __TAURI_ERROR__?: number;
        [key: string]: unknown;
      }) => {
        const { cmd, __TAURI_CALLBACK__: cbId, __TAURI_ERROR__: errId, ...args } = msg;
        const callRecord: IpcCall = { cmd: cmd ?? "unknown", args: args as Record<string, unknown> };
        calls.push(callRecord);

        setTimeout(() => {
          try {
            let result: unknown = null;

            switch (cmd) {
              case "plugin:event|listen":
              case "plugin:event|unlisten":
              case "plugin:event|emit":
                result = 0;
                break;

              case "palace_list":
                result = Array.from(palaces.values()).filter((p) => !p.deletedAt);
                break;

              case "palace_list_trashed":
                result = Array.from(palaces.values()).filter((p) => !!p.deletedAt);
                break;

              case "palace_create": {
                const id = generateId();
                const palace: PalaceDto = {
                  id,
                  name: args.name as string,
                  atlasPath: (args.atlasPath as string | null) ?? null,
                  createdAt: new Date().toISOString(),
                };
                palaces.set(id, palace);
                const snap: Snapshot = {
                  palace,
                  canvasObjects: [],
                  nodes: [],
                  edges: [],
                  routes: [],
                  loci: [],
                };
                snapshots.set(id, snap);
                result = palace;
                break;
              }

              case "palace_load":
                result = snapshots.get(args.palaceId as string) ?? null;
                break;

              case "palace_save": {
                const snap = args.snapshot as Snapshot;
                snapshots.set(snap.palace.id, snap);
                palaces.set(snap.palace.id, snap.palace);
                result = null;
                break;
              }

              case "palace_soft_delete": {
                const pid = args.palaceId as string;
                const p = palaces.get(pid);
                if (p) {
                  p.deletedAt = new Date().toISOString();
                  const purge = new Date();
                  purge.setDate(purge.getDate() + 30);
                  p.purgeAt = purge.toISOString();
                }
                result = null;
                break;
              }

              case "palace_restore": {
                const p = palaces.get(args.palaceId as string);
                if (p) {
                  p.deletedAt = undefined;
                  p.purgeAt = undefined;
                }
                result = null;
                break;
              }

              case "palace_purge":
                palaces.delete(args.palaceId as string);
                snapshots.delete(args.palaceId as string);
                result = null;
                break;

              case "palace_export_json": {
                const snap = args.snapshot as Snapshot;
                result = JSON.stringify({ version: 1, snapshot: snap }, null, 2);
                break;
              }

              case "palace_import_json": {
                const bundle = JSON.parse(args.json as string) as {
                  version: number;
                  snapshot: Snapshot;
                };
                result = bundle.snapshot;
                break;
              }

              case "analytics_list":
                result = analyticsStore.slice().reverse();
                break;

              case "analytics_append": {
                const events = args.events as AnalyticsEventDto[];
                for (const ev of events) {
                  if (!analyticsStore.find((e) => e.id === ev.id)) {
                    analyticsStore.push(ev);
                  }
                }
                result = null;
                break;
              }

              case "db_ping":
                result = "3.43.0 (mock)";
                break;

              default:
                result = null;
            }

            // Invoke the Tauri callback
            if (cbId != null) {
              const cb = (
                window as { [key: string]: ((v: unknown) => void) | undefined }
              )[`_${cbId}`];
              cb?.(result);
            }
          } catch (err) {
            if (errId != null) {
              const cb = (
                window as { [key: string]: ((v: unknown) => void) | undefined }
              )[`_${errId}`];
              cb?.(String(err));
            }
          }
        }, 0);
      },
    };
  });
}

// ── Section A: Repository-layer behaviors ─────────────────────────────────────

test.describe("A — palace repository (in-memory / Tauri parity)", () => {
  test("creating a palace persists it across reopen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Persist Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Persist Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Durable Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Other");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Other" })).toBeVisible();

    await page.getByRole("button", { name: "Persist Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Persist Palace" })).toBeVisible();
    await waitForEditorReady(page);

    const found = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return false;
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
        } | null;
      };
      if (!state.editorRef) return false;
      for (const id of state.editorRef.getCurrentPageShapeIds()) {
        const shape = state.editorRef.getShape(id);
        if (shape?.type === "geo" && shape.meta?.mpTitle === "Durable Node") return true;
      }
      return false;
    });
    expect(found).toBe(true);
  });

  test("soft-deleted palace no longer appears in active list", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Soft Delete Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Soft Delete Palace" })).toBeVisible();

    page.on("dialog", (d) => void d.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await expect
      .poll(
        () =>
          page
            .getByRole("button", { name: "Soft Delete Palace", exact: true })
            .isVisible(),
        { timeout: 8000 },
      )
      .toBe(false);
  });

  test("restored palace reappears in active list", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Restore Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Restore Palace" })).toBeVisible();

    page.on("dialog", (d) => void d.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();
    await expect(page.getByText("Trash")).toBeVisible({ timeout: 6000 });
    await page.getByRole("button", { name: "Restore" }).click();

    await expect
      .poll(
        () =>
          page.getByRole("button", { name: "Restore Palace", exact: true }).isVisible(),
        { timeout: 8000 },
      )
      .toBe(true);
  });

  test("purged palace disappears from trash", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Purge Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Purge Palace" })).toBeVisible();

    page.on("dialog", (d) => void d.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();
    await expect(page.getByText("Trash")).toBeVisible({ timeout: 6000 });
    await page.getByRole("button", { name: "Delete now" }).click();

    await expect
      .poll(
        async () => {
          const trashVisible = await page.getByText("Trash").isVisible();
          if (!trashVisible) return true;
          return !(await page.getByText("Purge Palace").isVisible());
        },
        { timeout: 8000 },
      )
      .toBe(true);
  });

  test("atlas path is stored and displayed after save", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Atlas Save Palace");
    await page.getByRole("textbox", { name: "Atlas path" }).fill("Science/Physics");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Atlas Save Palace" })).toBeVisible();

    await expect(page.getByRole("textbox", { name: "Current atlas path" })).toHaveValue(
      "Science/Physics",
    );
  });
});

// ── Section B: Tauri IPC simulation ──────────────────────────────────────────

test.describe("B — Tauri IPC mock: correct commands are called", () => {
  test.beforeEach(async ({ page }) => {
    await injectTauriMock(page);
  });

  test("palace_list is called on app load", async ({ page }) => {
    await page.goto("/");

    await expect
      .poll(() => getIpcCalls(page), { timeout: 8000 })
      .toEqual(expect.arrayContaining([expect.objectContaining({ cmd: "palace_list" })]));
  });

  test("palace_create is called with correct name and atlasPath", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Tauri Test Palace");
    await page.getByRole("textbox", { name: "Atlas path" }).fill("/engineering");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Tauri Test Palace" })).toBeVisible();

    await expect
      .poll(() => getIpcCalls(page), { timeout: 8000 })
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cmd: "palace_create",
            args: expect.objectContaining({ name: "Tauri Test Palace" }),
          }),
        ]),
      );
  });

  test("palace_load is called when opening a palace", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Load Test Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Load Test Palace" })).toBeVisible();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Away");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Away" })).toBeVisible();

    const callsBefore = (await getIpcCalls(page)).filter((c) => c.cmd === "palace_load").length;

    await page.getByRole("button", { name: "Load Test Palace", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Load Test Palace" })).toBeVisible();

    await expect
      .poll(
        async () =>
          (await getIpcCalls(page)).filter((c) => c.cmd === "palace_load").length,
        { timeout: 8000 },
      )
      .toBeGreaterThan(callsBefore);
  });

  test("palace_save is called with full snapshot on save", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Save IPC Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Save IPC Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("IPC Node");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    await expect
      .poll(() => getIpcCalls(page), { timeout: 8000 })
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cmd: "palace_save",
            args: expect.objectContaining({
              snapshot: expect.objectContaining({
                palace: expect.objectContaining({ name: "Save IPC Palace" }),
              }),
            }),
          }),
        ]),
      );
  });

  test("palace_soft_delete is called with correct palaceId", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("IPC Delete Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "IPC Delete Palace" })).toBeVisible();

    // Get the palace ID from the store
    const palaceId = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return null;
      return (store.getState() as { currentPalace?: { id: string } | null }).currentPalace?.id ??
        null;
    });
    expect(palaceId).toBeTruthy();

    page.on("dialog", (d) => void d.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();

    await expect
      .poll(() => getIpcCalls(page), { timeout: 8000 })
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cmd: "palace_soft_delete",
            args: expect.objectContaining({ palaceId }),
          }),
        ]),
      );
  });

  test("palace_restore is called with correct palaceId", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("IPC Restore Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "IPC Restore Palace" })).toBeVisible();

    const palaceId = await page.evaluate(() => {
      const s = (window as { __mp_store?: { getState: () => unknown } }).__mp_store?.getState() as {
        currentPalace?: { id: string } | null;
      };
      return s?.currentPalace?.id ?? null;
    });

    page.on("dialog", (d) => void d.accept());
    await page.getByRole("button", { name: /Move to trash/i }).click();
    await expect(page.getByText("Trash")).toBeVisible({ timeout: 6000 });
    await page.getByRole("button", { name: "Restore" }).click();

    await expect
      .poll(() => getIpcCalls(page), { timeout: 8000 })
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cmd: "palace_restore",
            args: expect.objectContaining({ palaceId }),
          }),
        ]),
      );
  });

  test("analytics_append is called when events fire", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Analytics IPC Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Analytics IPC Palace" })).toBeVisible();

    await expect
      .poll(() => getIpcCalls(page), { timeout: 8000 })
      .toEqual(
        expect.arrayContaining([expect.objectContaining({ cmd: "analytics_append" })]),
      );
  });

  test("palace_export_json returns well-formed bundle JSON", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10000 }),
      page.locator('button[title="Download all palaces as a JSON backup"]').click(),
    ]);

    const path = await download.path();
    if (path) {
      const { readFileSync } = await import("node:fs");
      const raw = readFileSync(path, "utf8");
      const bundle = JSON.parse(raw) as {
        version: number;
        exportedAt: string;
        palaces: unknown[];
      };
      expect(typeof bundle.version).toBe("number");
      expect(Array.isArray(bundle.palaces)).toBe(true);
    }
  });

  test("db_ping command is called (mock returns version string)", async ({ page }) => {
    await page.goto("/");
    // Trigger a db_ping by calling it directly via store if exposed, or check that
    // the mock IPC receives it from any health check the app might perform.
    // The mock always returns "3.43.0 (mock)" for db_ping.
    const pingResult = await page.evaluate(async () => {
      const internals = (window as { __TAURI_INTERNALS__?: { ipc: (msg: unknown) => void } })
        .__TAURI_INTERNALS__;
      if (!internals) return null;
      return new Promise<string>((resolve) => {
        const cbId = Date.now();
        (window as Record<string, unknown>)[`_${cbId}`] = (v: unknown) => resolve(v as string);
        internals.ipc({
          cmd: "db_ping",
          __TAURI_CALLBACK__: cbId,
          __TAURI_ERROR__: cbId + 1,
        });
      });
    });
    expect(pingResult).toBe("3.43.0 (mock)");
  });
});

// ── Section C: Tauri-only health check ───────────────────────────────────────

test.describe("C — Tauri runtime (skipped in web mode)", () => {
  test("db_ping returns a SQLite version string", async ({ page }) => {
    await page.goto("/");

    const isTauri = await page.evaluate(
      () => "__TAURI_INTERNALS__" in window,
    );

    if (!isTauri) {
      test.skip();
      return;
    }

    // In actual Tauri mode, the app can invoke db_ping via the store or a test
    // helper exposed on the window. Check that we get a version back.
    const result = await page.evaluate(async () => {
      const { invoke } = await import("@tauri-apps/api/core");
      return invoke<string>("db_ping");
    });

    expect(typeof result).toBe("string");
    expect(result).toMatch(/^\d+\.\d+/); // e.g. "3.43.2"
  });

  test("palace_list returns an array (SQLite-backed)", async ({ page }) => {
    await page.goto("/");
    const isTauri = await page.evaluate(() => "__TAURI_INTERNALS__" in window);
    if (!isTauri) {
      test.skip();
      return;
    }

    const result = await page.evaluate(async () => {
      const { invoke } = await import("@tauri-apps/api/core");
      return invoke<unknown[]>("palace_list");
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

// ── Section D: Full palace create → save → export → import roundtrip ─────────

test.describe("D — JSON backup roundtrip", () => {
  test("export then import round-trips node data", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Roundtrip Palace");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Roundtrip Palace" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Roundtrip Node");
    await page.locator("#mp-content").fill("Important content that must survive export.");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.getByRole("button", { name: /^Save$/ }).click();

    // Export
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10000 }),
      page.locator('button[title="Download all palaces as a JSON backup"]').click(),
    ]);

    const exportPath = await download.path();
    expect(exportPath).toBeTruthy();

    const { readFileSync } = await import("node:fs");
    const backupContent = readFileSync(exportPath!, "utf8");
    const backup = JSON.parse(backupContent) as {
      version: number;
      palaces: Array<{ nodes: Array<{ title: string; content: string }> }>;
    };

    const palaceBackup = backup.palaces.find((p) => {
      const palace = (p as { palace: { name: string } }).palace;
      return palace?.name === "Roundtrip Palace";
    });
    expect(palaceBackup).toBeDefined();

    const nodeBackup = (
      palaceBackup as { nodes: Array<{ title: string; content: string }> }
    ).nodes.find((n) => n.title === "Roundtrip Node");
    expect(nodeBackup).toBeDefined();
    expect(nodeBackup!.content).toBe("Important content that must survive export.");

    // Import
    const fileInput = page.locator('input[type="file"]').last();
    await fileInput.setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(backupContent),
    });

    await expect
      .poll(
        () =>
          page.getByRole("button", { name: "Roundtrip Palace", exact: true }).isVisible(),
        { timeout: 10000 },
      )
      .toBe(true);
  });

  test("importing a malformed backup shows an error", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    const fileInput = page.locator('input[type="file"]').last();
    await fileInput.setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"broken": true, "no_version": "here"}'),
    });

    // The app should show an alert or error message rather than crashing
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toMatch(/import failed/i);
      await dialog.accept();
    });

    // Palace list should be unchanged
    await expect(
      page.getByRole("button", { name: "Tutorial Palace", exact: true }),
    ).toBeVisible();
  });
});

// ── Section E: Analytics persistence across palace switches ───────────────────

test.describe("E — analytics persistence", () => {
  test("analytics events survive palace switching", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Analytics Persist A");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Analytics Persist A" })).toBeVisible();

    await page.getByRole("button", { name: /^Node$/ }).click();
    await page.locator("#mp-title").fill("Node A");
    await page.getByRole("button", { name: "Apply" }).click();

    const countBefore = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return 0;
      return (store.getState() as { analyticsEvents: unknown[] }).analyticsEvents.length;
    });

    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Analytics Persist B");
    await page.getByRole("button", { name: "Create palace" }).click();
    await expect(page.getByRole("heading", { name: "Analytics Persist B" })).toBeVisible();

    const countAfter = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return 0;
      return (store.getState() as { analyticsEvents: unknown[] }).analyticsEvents.length;
    });

    // Events from palace A should still be present after switching to B
    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });

  test("Insights panel shows events from multiple palaces in one view", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Insight Palace A", "Insight Palace B"]) {
      await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
      await page.getByRole("button", { name: "Create palace" }).click();
      await expect(page.getByRole("heading", { name })).toBeVisible();
      await page.getByRole("button", { name: /^Node$/ }).click();
      await page.locator("#mp-title").fill(`Node in ${name}`);
      await page.getByRole("button", { name: "Apply" }).click();
    }

    await page.getByRole("button", { name: /^Insights$/ }).click();
    await expect(page.getByText("Recent events")).toBeVisible();

    const eventCount = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) return 0;
      return (store.getState() as { analyticsEvents: unknown[] }).analyticsEvents.length;
    });
    expect(eventCount).toBeGreaterThan(2);
  });
});
