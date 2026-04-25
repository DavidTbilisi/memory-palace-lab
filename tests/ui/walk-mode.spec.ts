import { expect, test } from "@playwright/test";

test("walk mode steps and active state are visible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.getByPlaceholder("Route name").fill("Walk Demo");
  await page.getByRole("button", { name: "Add route" }).click();

  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Walk active")).toBeVisible();
  await expect(page.getByText("Step 1/2")).toBeVisible();

  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();

  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
});

