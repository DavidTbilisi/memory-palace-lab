/**
 * Concept glyphs: a node added from a wiki concept page adopts its glyph, a glyph another node
 * holds is refused, a rename keeps the glyph, and zoomed out the glyph fills the node.
 */
import { expect, test, type Page } from "@playwright/test";
import { editSelectedNode, openNodeTab } from "./nodeHelpers";
import { countSnapshotNodes, createNamedNodes, openTutorialPalace } from "./routeHelpers";

type Glyphed = { title: string; glyph: string | null };

function canvasGlyphs(page: Page): Promise<Glyphed[]> {
  return page.evaluate(() => {
    type Shape = { meta?: { mpNodeId?: string; mpTitle?: string; mpGlyph?: string | null } };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: { getCurrentPageShapes: () => Shape[] } } } }).__mp_store!.getState()
      .editorRef;
    return editor
      .getCurrentPageShapes()
      .filter((shape) => shape.meta?.mpNodeId)
      .map((shape) => ({ title: shape.meta!.mpTitle ?? "", glyph: shape.meta!.mpGlyph ?? null }));
  });
}

async function addAttentionFrameworkFromLibrary(page: Page) {
  await page.locator(`[data-nav-primary="library"]`).click();
  await page.getByRole("tab", { name: "Wiki" }).click();
  await page.getByLabel("Search the Library").fill("attention framework");
  await page.getByRole("button", { name: /^Wiki Attention Framework/ }).first().click();
  await expect(page.locator("#the-system-doc-content")).not.toContainText("Loading document");
  await page.getByRole("group", { name: "Encode this" }).getByRole("button", { name: "Add as node" }).click();
}

test("concept glyphs come from the wiki, stay unique in the palace, survive a rename, and fill the node zoomed out", async ({ page }) => {
  test.setTimeout(90_000);
  await openTutorialPalace(page);

  // Added from its wiki page, the node takes the page's glyph and shows it on the canvas.
  await addAttentionFrameworkFromLibrary(page);
  await expect.poll(() => canvasGlyphs(page)).toEqual([{ title: "Attention Framework", glyph: "🔦" }]);
  await expect(page.getByTestId("canvas-glyph")).toHaveText("🔦");
  await expect(page.getByTestId("canvas-glyph")).toHaveAttribute("data-mode", "chip");

  // A glyph the palace already uses is refused, and the holder is named. createNamedNodes counts
  // saved nodes, so the Library node must reach the saved snapshot first.
  await expect.poll(() => countSnapshotNodes(page)).toBe(1);
  await createNamedNodes(page, ["Focus"]);
  await openNodeTab(page);
  const field = page.getByLabel("Concept glyph");
  await field.fill("🔦");
  await field.press("Enter");
  await expect(page.getByRole("alert").filter({ hasText: "concept glyph" })).toHaveText(
    "🔦 is already Attention Framework's concept glyph.",
  );
  await field.fill("🎯");
  await field.press("Enter");
  await expect(page.getByTestId("concept-glyph")).toHaveText("🎯");

  // Renaming keeps the glyph.
  await editSelectedNode(page, { title: "Focus span" });
  await expect(page.getByTestId("concept-glyph")).toHaveText("🎯");
  await expect.poll(() => canvasGlyphs(page)).toContainEqual({ title: "Focus span", glyph: "🎯" });

  // The same page added again cannot take a glyph that is already held.
  await addAttentionFrameworkFromLibrary(page);
  await openNodeTab(page);
  await expect(page.getByTestId("glyph-notice")).toHaveText(
    "🔦 is already Attention Framework's concept glyph. This node was added without it.",
  );
  await expect.poll(async () => (await canvasGlyphs(page)).filter((n) => n.title === "Attention Framework")).toEqual([
    { title: "Attention Framework", glyph: "🔦" },
    { title: "Attention Framework", glyph: null },
  ]);

  // Zoomed far out, the labels are gone and the glyphs fill their nodes.
  await page.evaluate(() => {
    type Editor = { setCamera: (camera: { x: number; y: number; z: number }) => void; getCamera: () => { x: number; y: number } };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
    const { x, y } = editor.getCamera();
    editor.setCamera({ x, y, z: 0.2 });
  });
  await expect(page.getByTestId("canvas-glyph").first()).toHaveAttribute("data-mode", "fill");
  await expect(page.getByTestId("canvas-glyph")).toHaveText(["🔦", "🎯"]);
});
