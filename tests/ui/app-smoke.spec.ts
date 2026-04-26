import { expect, test } from "@playwright/test";

test("basic onboarding and layout workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Memory Palace Lab")).toBeVisible();
  await page.getByRole("button", { name: "theSystem" }).click();
  await expect(page.getByText("graph-native thinking workflows")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pipelines" })).toBeVisible();
  await page.getByRole("button", { name: "Docs", exact: true }).click();
  await expect(page.getByLabel("Search theSystem")).toBeVisible();
  await expect(page.getByRole("heading", { name: /NAVIGATOR/ })).toBeVisible();
  await expect(page.locator("#the-system-doc-content")).toContainText("Acronym = order");
  await page.getByRole("button", { name: "Pipelines" }).click();
  await page.getByRole("button", { name: "Guides" }).click();

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await expect(page.getByText("Added memory nodes")).toBeVisible();

  await page.getByPlaceholder("Route name").fill("Smoke Route");
  await page.getByRole("button", { name: /add route/i }).click();
  await expect(page.getByLabel("Active route")).toContainText("Smoke Route");

  await page.locator('button[title="Focus mode"]').click();
  await expect(page.getByText("Atlas", { exact: true })).toHaveCount(0);

  await page.locator('button[title="Balanced layout"]').click();
  await expect(page.getByText("Atlas", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Reset", exact: true }).click();
});

test("atlas path groups palaces into nested places", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Atlas Palace");
  await page.getByRole("textbox", { name: "Atlas path" }).fill("Georgia/Tbilisi/Vake");
  await page.getByRole("button", { name: "Create palace" }).click();

  await expect(page.getByRole("heading", { name: "Atlas Palace" })).toBeVisible();
  await expect(page.getByText("Georgia", { exact: true })).toBeVisible();
  await expect(page.getByText("Tbilisi", { exact: true })).toBeVisible();
  await expect(page.getByText("Vake", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Current atlas path" })).toHaveValue("Georgia/Tbilisi/Vake");
});

