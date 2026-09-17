import { expect, type Page } from "@playwright/test";

type StoreHook = { getState: () => unknown };

/** Nodes in the store's last saved snapshot; a draft save refreshes it. */
export function countSnapshotNodes(page: Page): Promise<number> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: StoreHook }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    return (store.getState() as { nodes: unknown[] }).nodes.length;
  });
}

/** Empty canvas points, far enough apart that a node dropped on each does not overlap the next. */
export function freeCanvasPoints(page: Page, count: number): Promise<{ x: number; y: number }[]> {
  return page.evaluate((wanted) => {
    const canvas = document.querySelector(".tl-canvas")!.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];
    for (let y = canvas.top + 110; y < canvas.bottom - 110 && points.length < wanted; y += 170) {
      for (let x = canvas.left + 110; x < canvas.right - 110 && points.length < wanted; x += 230) {
        const hit = document.elementFromPoint(x, y);
        if (hit?.classList.contains("tl-background")) points.push({ x, y });
      }
    }
    return points;
  }, count);
}

/**
 * Double-click empty canvas once per title and name each new node from the inspector.
 * Each rename waits for the post-create draft save, which re-syncs the inspector.
 */
export async function createNamedNodes(page: Page, titles: readonly string[]) {
  const existing = await countSnapshotNodes(page);
  for (const [index, title] of titles.entries()) {
    // Look again each time: new nodes and tldraw's style panel cover earlier candidates.
    const [spot] = await freeCanvasPoints(page, 1);
    expect(spot, `free canvas space for ${title}`).toBeDefined();
    await page.mouse.dblclick(spot!.x, spot!.y);
    await expect(page.locator("#mp-title")).toHaveValue("New node");
    await expect.poll(() => countSnapshotNodes(page)).toBe(existing + index + 1);
    await page.locator("#mp-title").fill(title);
    await page.locator("#mp-title").press("Tab");
  }
}

/** Screen position of the center of the memory node with this title. */
export function nodeCenter(page: Page, title: string): Promise<{ x: number; y: number }> {
  return page.evaluate((wanted) => {
    type Editor = {
      getCurrentPageShapeIds: () => Iterable<string>;
      getShape: (id: string) => { type?: string; meta?: { mpTitle?: string } } | undefined;
      getShapePageBounds: (id: string) => { x: number; y: number; w: number; h: number } | undefined;
      pageToScreen: (point: { x: number; y: number }) => { x: number; y: number };
    };
    const store = (window as { __mp_store?: { getState: () => { editorRef: Editor | null } } }).__mp_store;
    const editor = store?.getState().editorRef;
    if (!editor) throw new Error("editor not ready");
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (shape?.type !== "geo" || shape.meta?.mpTitle !== wanted) continue;
      const bounds = editor.getShapePageBounds(id)!;
      return editor.pageToScreen({ x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 });
    }
    throw new Error(`no node titled ${wanted}`);
  }, title);
}

export type RouteSummary = { name: string; color: string | null; hidden: boolean; stops: string[] };

/** Each route's name, color, visibility, and stop titles in walk order. */
export function routeSummary(page: Page): Promise<RouteSummary[]> {
  return page.evaluate(() => {
    type State = {
      routes: { id: string; name: string; color?: string | null; hidden?: boolean }[];
      loci: { routeId: string; nodeId: string; orderIndex: number }[];
      nodes: { id: string; title: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const titleOf = (nodeId: string) => state.nodes.find((node) => node.id === nodeId)?.title ?? nodeId;
    return state.routes.map((route) => ({
      name: route.name,
      color: route.color ?? null,
      hidden: !!route.hidden,
      stops: state.loci
        .filter((locus) => locus.routeId === route.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((locus) => titleOf(locus.nodeId)),
    }));
  });
}

/** Open the tutorial palace with the Learn panel closed, so the canvas has room. */
export async function openTutorialPalace(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  const learnClose = page.getByRole("button", { name: "Close learn panel" });
  if (await learnClose.isVisible()) await learnClose.click();
}

/**
 * Ctrl+scroll over a node, as a user zooms toward it: positive steps zoom in, negative zoom
 * out. tldraw caps the zoom change of each wheel event, so this sends one event per step.
 */
export async function zoomTowardsNode(page: Page, title: string, steps: number) {
  const center = await nodeCenter(page, title);
  await page.mouse.move(center.x, center.y);
  await page.keyboard.down("Control");
  for (let step = 0; step < Math.abs(steps); step += 1) {
    await page.mouse.wheel(0, steps > 0 ? -100 : 100);
  }
  await page.keyboard.up("Control");
}

export type CanvasView = { zoom: number; x: number; y: number; w: number; h: number };

/** The canvas camera: zoom level and the page area the canvas shows. */
export function canvasView(page: Page): Promise<CanvasView> {
  return page.evaluate(() => {
    type Editor = {
      getZoomLevel: () => number;
      getViewportPageBounds: () => { x: number; y: number; w: number; h: number };
    };
    const store = (window as { __mp_store?: { getState: () => { editorRef: Editor | null } } }).__mp_store;
    const editor = store?.getState().editorRef;
    if (!editor) throw new Error("editor not ready");
    const { x, y, w, h } = editor.getViewportPageBounds();
    return { zoom: editor.getZoomLevel(), x, y, w, h };
  });
}

/**
 * How the canvas shows an area saved earlier: "fitted" when it is centered, entirely visible,
 * and fills the canvas in at least one direction (the canvas may have changed shape since).
 */
export async function howCanvasShows(page: Page, saved: CanvasView): Promise<string> {
  const now = await canvasView(page);
  const near = (a: number, b: number) => Math.abs(a - b) <= 1;
  const problems = [
    !near(now.x + now.w / 2, saved.x + saved.w / 2) || !near(now.y + now.h / 2, saved.y + saved.h / 2)
      ? "off center"
      : null,
    now.w < saved.w - 1 || now.h < saved.h - 1 ? "cropped" : null,
    !near(now.w, saved.w) && !near(now.h, saved.h) ? "zoomed out too far" : null,
  ].filter(Boolean);
  return problems.length === 0
    ? "fitted"
    : `${problems.join(", ")}: showing ${JSON.stringify(now)}, saved ${JSON.stringify(saved)}`;
}

/** Click nodes in Route mode, pausing so separate clicks are never read as a double click. */
export async function clickStops(page: Page, titles: readonly string[]) {
  for (const title of titles) {
    const center = await nodeCenter(page, title);
    await page.mouse.click(center.x, center.y);
    await page.waitForTimeout(650);
  }
}
