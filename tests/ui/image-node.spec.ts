import { expect, test, type Page } from "@playwright/test";

const IMAGE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="teal"/></svg>';

type ShapeView = { id: string; type?: string; meta?: Record<string, unknown> };

async function readShapes(page: Page): Promise<ShapeView[]> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const editor = (
      store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
        } | null;
      }
    ).editorRef;
    if (!editor) return [];
    return Array.from(editor.getCurrentPageShapeIds()).map((id) => {
      const shape = editor.getShape(id);
      return { id, type: shape?.type, meta: shape?.meta };
    });
  });
}

test("an inserted image becomes a node that takes a description and an edge", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Image Node Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Image Node Palace" })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        return !!(store?.getState() as { editorRef?: unknown } | undefined)?.editorRef;
      }),
    )
    .toBe(true);

  // A regular node to connect the image to.
  await page.locator(".tl-background").first().dblclick({ position: { x: 180, y: 140 } });

  // Drop an image file the way tldraw receives a paste or a drag-and-drop.
  await page.evaluate(async (svg) => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    const editor = (
      store!.getState() as {
        editorRef: {
          putExternalContent: (content: unknown) => Promise<void>;
          getViewportPageBounds: () => { x: number; y: number; w: number; h: number };
        };
      }
    ).editorRef;
    const file = new File([svg], "kitchen.svg", { type: "image/svg+xml" });
    const viewport = editor.getViewportPageBounds();
    await editor.putExternalContent({
      type: "files",
      files: [file],
      point: { x: viewport.x + viewport.w * 0.7, y: viewport.y + viewport.h * 0.6 },
    });
  }, IMAGE_SVG);

  await expect
    .poll(async () => (await readShapes(page)).find((s) => s.type === "image")?.meta ?? null)
    .toMatchObject({ mpTitle: "kitchen", mpNodeKind: "memory" });

  const shapes = await readShapes(page);
  const image = shapes.find((s) => s.type === "image")!;
  const geo = shapes.find((s) => s.type === "geo")!;
  expect(image.meta?.mpNodeId).toBeTruthy();
  expect(image.meta?.mpObjectId).toBeTruthy();

  // The title is drawn under the image, and the inspector edits it as a node.
  await expect(page.getByText("kitchen", { exact: true })).toBeVisible();
  await page.evaluate((id) => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    (store!.getState() as { editorRef: { select: (id: string) => void } }).editorRef.select(id);
  }, image.id);
  await expect(page.locator("#mp-title")).toHaveValue("kitchen");
  await page.locator("#mp-title").fill("Grandma's kitchen");
  await page.locator("#mp-content").click();
  await page.keyboard.type("Smells of dill");
  await page.locator("#mp-alias").click();

  await expect
    .poll(async () => (await readShapes(page)).find((s) => s.type === "image")?.meta ?? null)
    .toMatchObject({ mpTitle: "Grandma's kitchen", mpNodeId: image.meta?.mpNodeId });
  const described = (await readShapes(page)).find((s) => s.type === "image")!;
  expect(String(described.meta?.mpContent)).toContain("Smells of dill");

  // Connect image -> geo through the normal connect dialog.
  await page.evaluate(
    ([fromShapeId, toShapeId, sourceNodeId, targetNodeId]) => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      (
        store!.getState() as {
          setPendingCast: (v: Record<string, string>) => void;
        }
      ).setPendingCast({ fromShapeId, toShapeId, sourceNodeId, targetNodeId });
    },
    [image.id, geo.id, String(image.meta?.mpNodeId), String(geo.meta?.mpNodeId)],
  );
  await expect(page.getByRole("heading", { name: "Connect nodes" })).toBeVisible();
  await page.getByRole("button", { name: /create edge/i }).click();

  await expect
    .poll(async () => (await readShapes(page)).find((s) => s.type === "arrow")?.meta ?? null)
    .toMatchObject({ mpSourceNodeId: image.meta?.mpNodeId, mpTargetNodeId: geo.meta?.mpNodeId });

  expect(pageErrors).toEqual([]);
});
