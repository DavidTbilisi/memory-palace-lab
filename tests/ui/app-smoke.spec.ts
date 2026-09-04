import { expect, test, type Page } from "@playwright/test";

/** Number of memory-node shapes on the current canvas, read through the dev store hook. */
function countNodeShapes(page: Page): Promise<number> {
  return page.evaluate(() => {
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
  });
}

test("contextual primary hint and idle tip adapt to current state", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("mp-idle-tip-delay-ms", "80");
  });
  await page.goto("/");

  await expect(page.locator("#context-primary-hint")).toContainText("Create or open a palace");
  await expect(page.getByTestId("context-tip-card")).toBeVisible();
  await page.mouse.move(32, 32);
  await expect(page.getByTestId("context-tip-card")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByTestId("context-tip-card")).toBeVisible();
  await page.getByRole("button", { name: "Dismiss tip" }).click();
  await expect(page.getByTestId("context-tip-card")).toHaveCount(0);

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect(page.locator("#context-primary-hint")).toContainText("Seed this palace with a few anchor nodes");
});

test("shell pages and layout workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Memory Palace Lab")).toBeVisible();
  await page.getByRole("button", { name: /^System$/ }).click();
  await expect(page.getByText("graph-native thinking workflows")).toBeVisible();
  await expect(page.getByRole("button", { name: "Comprehension Protocol" })).toBeVisible();
  await page.getByRole("button", { name: /Read the guide/ }).first().click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();
  await expect(page.getByLabel("Search the Library")).toBeVisible();
  await expect(page.getByRole("heading", { name: /NAVIGATOR/ })).toBeVisible();
  await expect(page.locator("#the-system-doc-content")).toContainText("Acronym = order");
  await expect(page.getByRole("tablist", { name: "Document sections" })).toBeVisible();
  await page.getByRole("tab", { name: "Narrow" }).click();
  await expect(page.locator("#the-system-doc-content")).toContainText("Success criteria");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Phases" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Start here" }).click();
  await expect(page.getByRole("heading", { name: "Lesson 1 - Build your first palace" })).toBeVisible();

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.locator(".tl-canvas").dblclick({ position: { x: 240, y: 200 } });
  await expect(page.locator("#mp-title")).toHaveValue("New node");

  // The route panel is collapsed by default; the toolbar Route button shows it.
  await page.locator('button[title="Show route panel"]').click();
  await page.getByPlaceholder("Route name").fill("Smoke Route");
  await page.getByRole("button", { name: /add route/i }).click();
  await expect(page.getByLabel("Active route")).toContainText("Smoke Route");

  await page.locator('button[title="Focus mode"]').click();
  await expect(page.getByRole("heading", { name: "Palaces" })).toHaveCount(0);

  await page.locator('button[title="Balanced layout"]').click();
  await expect(page.getByRole("heading", { name: "Palaces" })).toBeVisible();

  await page.getByRole("button", { name: "Reset", exact: true }).click();
});

test("command palette opens pages and runs graph actions", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Control+K");
  await expect(page.getByLabel("Command palette search")).toBeVisible();
  await page.getByLabel("Command palette search").fill("library");
  await page.getByRole("button", { name: "Open Library Guides, wiki, glossary, and lessons" }).click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();

  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  await page.keyboard.press("Control+K");
  await page.getByLabel("Command palette search").fill("dsl");
  await page.getByRole("button", { name: /Toggle DSL editor/ }).click();
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();

  await page.getByRole("button", { name: "Portal", exact: true }).click();
  await expect.poll(() => countNodeShapes(page)).toBeGreaterThan(0);

  await page.keyboard.press("Control+K");
  await page.getByLabel("Command palette search").fill("insights");
  await page.getByRole("button", { name: "Open Insights Analytics and memory strength" }).click();
  await expect(page.getByText("What is tracked")).toBeVisible();
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

  await page.getByText("Hierarchy editor").click();
  await expect(page.getByRole("textbox", { name: "Domain segment" })).toHaveValue("Georgia");
  await expect(page.getByRole("textbox", { name: "Place segment" })).toHaveValue("Tbilisi");
  await expect(page.getByRole("textbox", { name: "Section segment" })).toHaveValue("Vake");

  await page.getByRole("textbox", { name: "Atlas level 1 name" }).fill("Subject");
  await page.getByRole("textbox", { name: "Atlas level 2 name" }).fill("Topic");
  await page.getByRole("textbox", { name: "Atlas level 3 name" }).fill("Lesson");
  await page.getByRole("textbox", { name: "Subject segment" }).fill("Math");
  await page.getByRole("textbox", { name: "Topic segment" }).fill("Algebra");
  await page.getByRole("textbox", { name: "Lesson segment" }).fill("Quadratics");
  await page.getByRole("button", { name: "Save hierarchy" }).click();

  await expect(page.getByRole("textbox", { name: "Current atlas path" })).toHaveValue("Math/Algebra/Quadratics");
  await expect(page.getByText("Math", { exact: true })).toBeVisible();
  await expect(page.getByText("Algebra", { exact: true })).toBeVisible();
  await expect(page.getByText("Quadratics", { exact: true })).toBeVisible();
});

