import { expect, test } from "@playwright/test";

test("library deep links, wiki search, and encode-this pipeline", async ({ page }) => {
  await page.goto("/");

  // A palace is needed for "Encode this".
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  // Palette Docs entry deep-links into a guide.
  await page.keyboard.press("Control+K");
  await page.getByLabel("Command palette search").fill("cast edges");
  await page.getByRole("button", { name: /CAST edges - connection types/ }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Guides" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#the-system-doc-content")).toBeVisible();

  // Wiki section browses lazily and searches titles.
  await page.getByRole("tab", { name: "Wiki" }).click();
  await page.getByLabel("Search the Library").fill("spaced repetition");
  await expect(page.getByRole("button", { name: /^Spaced Repetition/ }).first()).toBeVisible();
  await page.getByRole("button", { name: /^Spaced Repetition/ }).first().click();
  await expect(page.locator("#the-system-doc-content")).not.toContainText("Loading document");

  // Encode this → Run as pipeline lands on System with the document as steps.
  await page.getByRole("tab", { name: "Guides" }).click();
  await page.getByRole("button", { name: /NAVIGATOR/ }).first().click();
  await expect(page.locator("#the-system-doc-content")).toContainText("Acronym = order");
  await page.getByRole("button", { name: "Run as pipeline" }).click();
  await expect(page.getByText("System Workbench")).toBeVisible();
  await expect(page.getByText("From document")).toBeVisible();
  await expect(page.getByRole("heading", { name: /NAVIGATOR/ })).toBeVisible();
  await page.getByRole("button", { name: /Materialize to graph/ }).click();
  await expect(page.getByText(/graph run with \d+ nodes/)).toBeVisible();
  await page.getByRole("button", { name: "Show in graph" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing dev store hook");
        const state = store.getState() as {
          editorRef: {
            getCurrentPageShapeIds: () => Iterable<string>;
            getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
          } | null;
        };
        const editor = state.editorRef;
        if (!editor) throw new Error("editor not ready");
        return Array.from(editor.getCurrentPageShapeIds()).filter((id) => {
          const shape = editor.getShape(id);
          return shape?.type === "geo" && !!shape.meta?.mpNodeId;
        }).length;
      }),
    )
    .toBeGreaterThan(3);
});

test("settings page holds preferences and the library about-link works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  const goal = page.getByLabel("Daily loci goal");
  await goal.fill("25");
  await goal.blur();
  await page.getByRole("button", { name: /^Review/ }).click();
  await expect(page.getByText("Daily Goal")).toBeVisible();
  await expect(page.getByText("0/25").first()).toBeVisible();

  await page.getByRole("button", { name: /^Insights/ }).click();
  await page.getByRole("button", { name: "About this page" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
});
