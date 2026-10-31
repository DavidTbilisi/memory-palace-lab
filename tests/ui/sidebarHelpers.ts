import type { Page } from "@playwright/test";

/** Unfolds the sidebar's "Current palace" section, which starts collapsed; safe to call when it is already open. */
export async function openCurrentPalaceDetails(page: Page): Promise<void> {
  const details = page.locator("details", { has: page.locator("summary", { hasText: /^Current palace$/ }) });
  if (await details.evaluate((el) => (el as HTMLDetailsElement).open)) return;
  await details.locator("summary").click();
}
