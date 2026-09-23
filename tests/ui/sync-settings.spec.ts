import { expect, test } from "@playwright/test";

/**
 * Playwright runs against `vite dev`, so there is no Tauri runtime and the vault folder is
 * unreachable. What this spec can honestly check is that the Sync card is present, says so
 * plainly, and does not break the Settings page. The behaviour itself — push, pull, conflict
 * resolution, deletion, encryption — is covered by the two-device simulation in
 * src/domain/sync/vaultSyncEngine.test.ts, which drives the real engine.
 */
test("Settings offers Sync and says it needs the desktop app", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  const sync = page.getByRole("region", { name: "Sync" });
  await expect(sync).toBeVisible();
  await expect(sync.getByText("Available in the desktop app.")).toBeVisible();

  // The blurb has to carry the two facts that decide whether someone turns this on at all.
  await expect(sync).toContainText(/folder/i);
  await expect(sync).toContainText(/encrypted/i);

  // The rest of Settings still works beside it.
  await expect(page.getByRole("heading", { name: "Data" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Backup all palaces" })).toBeVisible();
});

test("searching the command palette for sync finds Settings", async ({ page }) => {
  // The keyword only helps if someone who thinks "sync" rather than "settings" lands there.
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByPlaceholder("Search pages, palaces, routes, nodes, and actions").fill("sync");
  await expect(page.getByRole("button", { name: /Settings/ }).first()).toBeVisible();
});
