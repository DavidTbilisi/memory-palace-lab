import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const FIXTURE = `# Palace: Demo

== Alpha
  > first node

== Beta
  > second node
  -> Alpha  ::0010
  -> Gamma  ::1110

== Gamma
  > third node

:: Route "Walk"
  1. Alpha
  2. Beta
  3. Gamma
`;

const THIS_DIR = fileURLToPath(new URL(".", import.meta.url));
const SOLID_FIXTURE = readFileSync(
  resolve(THIS_DIR, "../../src/domain/services/palaceDsl/fixtures/solid-citadel.dsl"),
  "utf8",
);

async function readSceneCounts(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
      routes: Array<{ name: string }>;
      loci: Array<unknown>;
    };
    const editor = state.editorRef;
    if (!editor) return { nodes: 0, edges: 0, routes: state.routes.length, loci: state.loci.length };
    let nodes = 0;
    let edges = 0;
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      const meta = (shape?.meta ?? {}) as Record<string, unknown>;
      if (shape?.type === "geo" && meta.mpNodeId) nodes += 1;
      if (shape?.type === "arrow" && meta.mpEdgeId) edges += 1;
    }
    return { nodes, edges, routes: state.routes.length, loci: state.loci.length };
  });
}

async function readDslState(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    const state = store.getState() as {
      routes: Array<{ name: string }>;
      loci: Array<{ routeId: string }>;
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
    };
    const nodeTitles: string[] = [];
    if (state.editorRef) {
      for (const id of state.editorRef.getCurrentPageShapeIds()) {
        const shape = state.editorRef.getShape(id);
        const meta = (shape?.meta ?? {}) as Record<string, unknown>;
        if (shape?.type === "geo" && typeof meta.mpTitle === "string") {
          nodeTitles.push(meta.mpTitle);
        }
      }
    }
    return {
      routeNames: state.routes.map((route) => route.name),
      nodeTitles: nodeTitles.sort(),
      lociCount: state.loci.length,
    };
  });
}

test.describe("DSL split-pane editor", () => {
  test("Cmd+E opens editor; typing fixture syncs nodes, edges, route to canvas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    await page.keyboard.press("Control+E");
    await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();

    // Focus the CodeMirror editor and replace contents.
    const cmContent = page.locator(".cm-content").first();
    await cmContent.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await cmContent.pressSequentially(FIXTURE, { delay: 5 });
    // Defocus so the canvas→DSL listener doesn't bounce; also flush DSL→canvas debounce.
    await page.locator("body").click();
    await page.waitForTimeout(600);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 8000 })
      .toMatchObject({ nodes: 3, edges: 2, routes: 1, loci: 3 });
  });

  test("SOLID fixture syncs the full palace into canvas and routes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    await page.keyboard.press("Control+E");
    await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();

    const cmContent = page.locator(".cm-content").first();
    await cmContent.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await cmContent.pressSequentially(SOLID_FIXTURE, { delay: 2 });
    await page.locator("body").click();
    await page.waitForTimeout(800);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ nodes: 14, edges: 15, routes: 2, loci: 12 });

    await expect
      .poll(() => readDslState(page), { timeout: 12000 })
      .toMatchObject({
        routeNames: ["SOLID Main Route", "Violation Route"],
        lociCount: 12,
      });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 warnings/i);
  });

  test("malformed SOLID-style paste shows parser error and does not partially sync to canvas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("button", { name: /create tutorial palace/i }).click();
    await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

    await page.keyboard.press("Control+E");
    await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();

    const malformed = [
      "# Palace: SOLID Citadel",
      "== Gate of SOLID",
      "> Central fortress connecting five engineering districts.",
      "#solid architecture",
      "-> Single Responsibility Forge  ::0001",
      "",
      ":: Route \"SOLID Main Route\"",
      "1. Gate of SOLID",
    ].join("\n");

    const cmContent = page.locator(".cm-content").first();
    await cmContent.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await cmContent.pressSequentially(malformed, { delay: 2 });
    await page.locator("body").click();
    await page.waitForTimeout(600);

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/must be indented/i);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 8000 })
      .toMatchObject({ nodes: 0, edges: 0, routes: 0, loci: 0 });
  });
});
