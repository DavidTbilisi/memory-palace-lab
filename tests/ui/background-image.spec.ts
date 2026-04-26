import { expect, test } from "@playwright/test";

const BACKGROUND_SVG = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="green"/></svg>',
);

test("background image button imports a browser image without page errors", async ({ page }) => {
  const pageErrors: string[] = [];
  const dialogs: string[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.accept();
  });

  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Background Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Background Palace" })).toBeVisible();
  await expect(page.locator('button[title="Background image"]')).toBeEnabled();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        return !!store?.getState() && !!(store.getState() as { editorRef?: unknown }).editorRef;
      }),
    )
    .toBe(true);

  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator('button[title="Background image"]').click(),
  ]);
  await fileChooser.setFiles({
    name: "background.svg",
    mimeType: "image/svg+xml",
    buffer: BACKGROUND_SVG,
  });

  await expect
    .poll(async () => {
      const state = await page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing dev store hook");
        const state = store.getState() as {
          editorRef: {
            getCurrentPageShapeIds: () => Iterable<string>;
            getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
          } | null;
        };
        const editor = state.editorRef;
        if (!editor) return { hasBackground: false, shapeTypes: [] as string[] };
        const shapes = Array.from(editor.getCurrentPageShapeIds()).map((id) => editor.getShape(id));
        return {
          hasBackground: shapes.some((shape) => shape?.type === "image" && shape.meta?.mpBackground === true),
          shapeTypes: shapes.map((shape) => shape?.type ?? "missing"),
        };
      });
      return { ...state, dialogs, pageErrors, consoleErrors };
    })
    .toMatchObject({ hasBackground: true, dialogs: [], pageErrors: [], consoleErrors: [] });
});
