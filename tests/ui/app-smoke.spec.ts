import { expect, test } from "@playwright/test";

test("basic onboarding and layout workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Memory Palace Lab")).toBeVisible();

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await expect(page.getByText("Added memory nodes")).toBeVisible();

  await page.getByPlaceholder("Route name").fill("Smoke Route");
  await page.getByRole("button", { name: /add route/i }).click();
  await expect(page.locator("select")).toContainText("Smoke Route");

  await page.locator('button[title="Focus mode"]').click();
  await expect(page.getByText("Palaces")).toHaveCount(0);

  await page.locator('button[title="Balanced layout"]').click();
  await expect(page.getByText("Palaces")).toBeVisible();

  await page.getByRole("button", { name: /reset/i }).click();
});

