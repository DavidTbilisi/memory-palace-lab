/**
 * Generated stores: a four-level block builds itself from a theme, a cell is found by address,
 * filling it keeps the address, and regenerating asks before clearing what the learner stored.
 */
import { expect, test, type Page } from "@playwright/test";
import { editSelectedNode, openNodeTab } from "./nodeHelpers";

type StoreState = {
  nodes: number;
  storeJson: string | null;
  cell: { title: string; address: string | null } | null;
  route: { name: string; inReview: boolean | undefined; hidden: boolean | undefined; stops: number } | null;
};

function storeState(page: Page, address: string): Promise<StoreState> {
  return page.evaluate((wanted) => {
    type Shape = { meta?: { mpNodeId?: string; mpTitle?: string; mpAddress?: string } };
    type State = {
      editorRef: { getCurrentPageShapes: () => Shape[] };
      currentPalace: { storeJson?: string | null } | null;
      routes: { id: string; name: string; inReview?: boolean; hidden?: boolean }[];
      loci: { routeId: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const nodes = state.editorRef.getCurrentPageShapes().filter((shape) => shape.meta?.mpNodeId);
    const cell = nodes.find((shape) => shape.meta?.mpAddress === wanted);
    const route = state.routes[0];
    return {
      nodes: nodes.length,
      storeJson: state.currentPalace?.storeJson ?? null,
      cell: cell ? { title: cell.meta!.mpTitle ?? "", address: cell.meta!.mpAddress ?? null } : null,
      route: route
        ? {
            name: route.name,
            inReview: route.inReview,
            hidden: route.hidden,
            stops: state.loci.filter((l) => l.routeId === route.id).length,
          }
        : null,
    };
  }, address);
}

test("a four-level block is generated, reached by address, filled, and regenerated without losing the fill", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");

  await page.getByRole("button", { name: "Generate store" }).click();
  const form = page.getByRole("region", { name: "Generate store" });
  await form.getByLabel("Block theme").fill("Chemistry");
  await form.getByRole("button", { name: "Generate four-level block" }).click();

  await expect(page.getByRole("heading", { name: "Chemistry · block" })).toBeVisible();
  // Drawing 151 nodes holds the main thread for about 4 s even on a quiet machine, so a 5 s poll
  // only passes when the dev server is warm.
  await expect.poll(async () => (await storeState(page, "3.2.4")).nodes, { timeout: 20_000 }).toBe(151);
  const generated = await storeState(page, "3.2.4");
  expect(JSON.parse(generated.storeJson!)).toMatchObject({ kind: "four-level-block", theme: "Chemistry" });
  expect(generated.cell).toEqual({ title: "3.2.4", address: "3.2.4" });
  expect(generated.route).toEqual({ name: "Chemistry · block", inReview: false, hidden: true, stops: 125 });
  await expect(page.getByRole("button", { name: /Chemistry · block/ }).getByTestId("store-badge")).toBeVisible();
  const panel = page.getByRole("region", { name: "Store", exact: true });
  await expect(panel.getByTestId("store-fill")).toHaveText("0 of 125 cells filled");

  // Straight to a cell, however the address is typed.
  const goTo = page.getByLabel("Go to address");
  await goTo.fill("9.9.9");
  await goTo.press("Enter");
  await expect(page.getByText("No cell 9.9.9")).toBeVisible();
  await goTo.fill("3 2 4");
  await goTo.press("Enter");
  await openNodeTab(page);
  await expect(page.locator("#mp-store-address")).toHaveText("3.2.4");

  // Filling the cell keeps its address.
  await editSelectedNode(page, { title: "Sodium" });
  await expect.poll(async () => (await storeState(page, "3.2.4")).cell).toEqual({ title: "Sodium", address: "3.2.4" });
  await expect(panel.getByTestId("store-fill")).toHaveText("1 of 125 cells filled");

  // Regenerating asks first, and keeping leaves the fill alone.
  await panel.getByRole("button", { name: "Regenerate" }).click();
  const confirm = panel.getByRole("alertdialog", { name: "Regenerate store" });
  await expect(confirm).toContainText("1 node holds your material");
  await confirm.getByRole("button", { name: "Keep them" }).click();
  await expect(panel.getByRole("status")).toHaveText("Regenerated. Everything is back in its place.", { timeout: 20_000 });
  expect((await storeState(page, "3.2.4")).cell).toEqual({ title: "Sodium", address: "3.2.4" });

  // Only an explicit clear puts the placeholder back.
  await panel.getByRole("button", { name: "Regenerate" }).click();
  await panel.getByRole("button", { name: "Clear 1" }).click();
  await expect(panel.getByRole("status")).toHaveText("Regenerated: cleared 1.", { timeout: 20_000 });
  await expect.poll(async () => (await storeState(page, "3.2.4")).cell).toEqual({ title: "3.2.4", address: "3.2.4" });
  await expect(panel.getByTestId("store-fill")).toHaveText("0 of 125 cells filled");
});

test("a table of support images grows one number at a time, and rewriting a number keeps what a cell holds", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Generate store" }).click();
  await page.getByRole("region", { name: "Generate store" }).getByRole("button", { name: "Generate table" }).click();
  await expect(page.getByRole("heading", { name: "Table of support images" })).toBeVisible();
  const panel = page.getByRole("region", { name: "Store", exact: true });
  await expect(panel.getByTestId("store-fill")).toHaveText("0 of 100 numbers · 0 of 0 cells filled");

  await panel.getByRole("button", { name: "Add number" }).click();
  const dialog = page.getByRole("dialog", { name: "Add a number" });
  await dialog.getByLabel("Number", { exact: true }).fill("47");
  await dialog.getByLabel("Number image").fill("hedgehog");
  await dialog.getByLabel("Image a", { exact: true }).fill("apple");
  await dialog.getByLabel("Cell 47.1").fill("stem");
  await dialog.getByLabel("Cell 47.3").fill("core");
  await dialog.getByRole("button", { name: "Add 47" }).click();
  await expect(dialog).toHaveCount(0);

  await expect.poll(async () => (await storeState(page, "47.3")).nodes).toBe(13);
  expect((await storeState(page, "47.3")).cell).toEqual({ title: "core", address: "47.3" });
  expect((await storeState(page, "47.5")).cell).toEqual({ title: "47.5", address: "47.5" });
  await expect(panel.getByTestId("store-fill")).toHaveText("1 of 100 numbers · 0 of 9 cells filled");

  // Straight to a cell; renaming it from its part makes it the learner's.
  const goTo = page.getByLabel("Go to address");
  await goTo.fill("473");
  await goTo.press("Enter");
  await openNodeTab(page);
  await expect(page.locator("#mp-store-address")).toHaveText("47.3");
  await editSelectedNode(page, { title: "Sodium" });
  await expect(panel.getByTestId("store-fill")).toHaveText("1 of 100 numbers · 1 of 9 cells filled");

  // Editing the number loads what it holds, and asks before touching the filled cell.
  await panel.getByRole("button", { name: "Add number" }).click();
  await dialog.getByLabel("Number", { exact: true }).fill("47");
  await expect(dialog.getByLabel("Number image")).toHaveValue("hedgehog");
  await expect(dialog.getByLabel("Cell 47.3")).toHaveValue("Sodium");
  await dialog.getByLabel("Image a", { exact: true }).fill("pear");
  await dialog.getByRole("button", { name: "Save 47" }).click();
  const confirm = dialog.getByRole("alertdialog", { name: "Rewrite number" });
  await expect(confirm).toContainText("1 node of 47 holds your material");
  await confirm.getByRole("button", { name: "Keep them" }).click();
  await expect(dialog).toHaveCount(0);

  expect((await storeState(page, "47.3")).cell).toEqual({ title: "Sodium", address: "47.3" });
  await expect.poll(async () => (await storeState(page, "47.a")).cell).toEqual({ title: "pear", address: "47.a" });
  expect((await storeState(page, "47.3")).nodes).toBe(13);
});
