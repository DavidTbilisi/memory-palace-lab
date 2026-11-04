/**
 * Timeline palaces (backlog 20, PR 1): dated events sit on a scaled axis with a date image each,
 * the route follows date order, eras become rooms and route sections, re-dating moves an event
 * and renames a placeholder date image, and removing an event asks before taking a filled image.
 */
import { expect, test, type Page } from "@playwright/test";
import { openNodeTab, openRoutesTab } from "./nodeHelpers";

type TimelineState = {
  storeJson: string | null;
  route: { name: string; inReview?: boolean; hidden?: boolean } | null;
  stops: { label: string; section: string | null; title: string }[];
  events: { title: string; date: string; left: number }[];
  images: { title: string; date: string; pair: string | null }[];
  decor: number;
};

function timelineState(page: Page): Promise<TimelineState> {
  return page.evaluate(() => {
    type Meta = { mpNodeId?: string; mpTitle?: string; mpAddress?: string; mpStoreRole?: string; mpPairNodeId?: string; mpTimelineDecor?: string };
    type Shape = { id: string; x: number; meta?: Meta };
    type State = {
      editorRef: { getCurrentPageShapes: () => Shape[] };
      currentPalace: { storeJson?: string | null } | null;
      routes: { id: string; name: string; inReview?: boolean; hidden?: boolean }[];
      loci: { routeId: string; nodeId: string; orderIndex: number; label: string; section?: string | null }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const shapes = state.editorRef.getCurrentPageShapes();
    const byNode = new Map(shapes.filter((s) => s.meta?.mpNodeId).map((s) => [s.meta!.mpNodeId!, s]));
    const route = state.routes[0] ?? null;
    return {
      storeJson: state.currentPalace?.storeJson ?? null,
      route: route ? { name: route.name, inReview: route.inReview, hidden: route.hidden } : null,
      stops: state.loci
        .filter((l) => l.routeId === route?.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((l) => ({ label: l.label, section: l.section ?? null, title: byNode.get(l.nodeId)?.meta?.mpTitle ?? "" })),
      events: shapes
        .filter((s) => s.meta?.mpStoreRole === "event")
        .map((s) => ({ title: s.meta!.mpTitle ?? "", date: s.meta!.mpAddress ?? "", left: s.x })),
      images: shapes
        .filter((s) => s.meta?.mpStoreRole === "date-image")
        .map((s) => ({
          title: s.meta!.mpTitle ?? "",
          date: s.meta!.mpAddress ?? "",
          pair: byNode.get(s.meta!.mpPairNodeId ?? "")?.meta?.mpTitle ?? null,
        })),
      decor: shapes.filter((s) => s.meta?.mpTimelineDecor).length,
    };
  });
}

async function addEvent(page: Page, title: string, date: string) {
  const panel = page.getByRole("region", { name: "Store", exact: true });
  await panel.getByLabel("Event", { exact: true }).fill(title);
  await panel.getByLabel("Date", { exact: true }).fill(date);
  await panel.getByRole("button", { name: "Add event" }).click();
  await expect.poll(async () => (await timelineState(page)).events.map((e) => e.title)).toContain(title);
}

test("a timeline places dated events by date, walks them in order, and keeps eras as rooms", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");

  await page.getByRole("button", { name: "Generate store" }).click();
  const form = page.getByRole("region", { name: "Generate store" });
  await form.getByLabel("Timeline title").fill("Bertrand Russell");
  await form.getByRole("button", { name: "Create timeline" }).click();

  await expect(page.getByRole("heading", { name: "Bertrand Russell · timeline" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Bertrand Russell · timeline/ }).getByTestId("store-badge")).toHaveText("Timeline");
  const created = await timelineState(page);
  expect(JSON.parse(created.storeJson!)).toMatchObject({ kind: "timeline", title: "Bertrand Russell", eras: [] });
  // Walked, unlike a block: visible and in review from the start.
  expect(created.route).toEqual({ name: "Bertrand Russell · timeline", inReview: true, hidden: undefined });

  const panel = page.getByRole("region", { name: "Store", exact: true });
  await expect(panel.getByTestId("store-fill")).toHaveText("0 events · 0 of 0 date images filled");

  // A date the timeline cannot read is refused with an example.
  await panel.getByLabel("Event", { exact: true }).fill("Someday");
  await panel.getByLabel("Date", { exact: true }).fill("soon");
  await panel.getByRole("button", { name: "Add event" }).click();
  await expect(panel.getByRole("status")).toContainText("Write a date like 1901");

  await addEvent(page, "Discovers the paradox", "1901");
  await addEvent(page, "Born", "1872");
  await addEvent(page, "Cambridge degree", "1894");
  await addEvent(page, "Principia Mathematica", "1910-1913");

  const placed = await timelineState(page);
  expect(placed.stops.map((s) => [s.label, s.title])).toEqual([
    ["1872", "Born"],
    ["1894", "Cambridge degree"],
    ["1901", "Discovers the paradox"],
    ["1910–1913", "Principia Mathematica"],
  ]);
  expect(placed.images).toContainEqual({ title: "1901 · image", date: "1901", pair: "Discovers the paradox" });
  expect(placed.images).toContainEqual({ title: "1910–1913 · image", date: "1910–1913", pair: "Principia Mathematica" });
  // Position follows the date: 22 years draw wider than 7.
  const left = (title: string) => placed.events.find((e) => e.title === title)!.left;
  expect(left("Cambridge degree") - left("Born")).toBeGreaterThan(left("Discovers the paradox") - left("Cambridge degree"));
  expect(placed.decor).toBeGreaterThan(0);
  await expect(panel.getByTestId("store-fill")).toHaveText("4 events · 0 of 4 date images filled");

  // An era becomes a room, and its first stop starts a route section.
  await panel.getByLabel("Era name").fill("Principia years");
  await panel.getByLabel("Era from").fill("1900");
  await panel.getByLabel("Era to").fill("1913");
  await panel.getByRole("button", { name: "Add era" }).click();
  await expect(panel.getByRole("group", { name: "Eras" })).toContainText("Principia years 1900–1913");
  await expect
    .poll(async () => (await timelineState(page)).stops.map((s) => s.section))
    .toEqual([null, null, "Principia years", null]);
  await openRoutesTab(page);
  await expect(page.getByTestId("routes-panel")).toContainText("Principia years");

  // Go to a date finds the nearest event.
  await page.getByLabel("Go to date").fill("1895");
  await page.getByLabel("Go to date").press("Enter");
  await openNodeTab(page);
  await expect(page.getByLabel("Event date")).toHaveValue("1894");
});

test("re-dating moves an event and its placeholder image, and removing asks before taking a filled image", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Generate store" }).click();
  const form = page.getByRole("region", { name: "Generate store" });
  await form.getByLabel("Timeline title").fill("Russell");
  await form.getByRole("button", { name: "Create timeline" }).click();
  await expect(page.getByRole("heading", { name: "Russell · timeline" })).toBeVisible();

  await addEvent(page, "Born", "1872");
  await addEvent(page, "Nobel Prize", "1950");
  await addEvent(page, "Prison", "1916");

  // The new event is selected: its date can be changed from the inspector.
  await openNodeTab(page);
  const dateField = page.getByLabel("Event date");
  await expect(dateField).toHaveValue("1916");
  await dateField.fill("1918");
  await dateField.press("Enter");
  await expect
    .poll(async () => (await timelineState(page)).images.find((i) => i.pair === "Prison"))
    .toEqual({ title: "1918 · image", date: "1918", pair: "Prison" });
  expect((await timelineState(page)).stops.map((s) => s.label)).toEqual(["1872", "1918", "1950"]);

  // Moving past a neighbour reorders the route, and the stop keeps its place in it.
  await dateField.fill("1960");
  await dateField.press("Enter");
  await expect.poll(async () => (await timelineState(page)).stops.map((s) => s.title)).toEqual(["Born", "Nobel Prize", "Prison"]);

  // Once the learner names the date image, re-dating leaves the name alone.
  await page.evaluate(() => {
    type Shape = { id: string; type: string; meta?: { mpStoreRole?: string; mpAddress?: string } };
    type Editor = { getCurrentPageShapes: () => Shape[]; updateShape: (partial: unknown) => void };
    const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
    const image = editor.getCurrentPageShapes().find((s) => s.meta?.mpStoreRole === "date-image" && s.meta.mpAddress === "1960")!;
    editor.updateShape({ id: image.id, type: image.type, meta: { ...image.meta, mpTitle: "Bars of a cell" } });
  });
  await dateField.fill("1918");
  await dateField.press("Enter");
  await expect
    .poll(async () => (await timelineState(page)).images.find((i) => i.pair === "Prison"))
    .toEqual({ title: "Bars of a cell", date: "1918", pair: "Prison" });

  // Removing the event asks first, and keeping the image leaves it on the canvas.
  await page.getByRole("button", { name: "Remove event" }).click();
  const confirm = page.getByRole("alertdialog", { name: "Remove event" });
  await expect(confirm).toContainText("holds your own image");
  await confirm.getByRole("button", { name: "Keep the image" }).click();
  await expect.poll(async () => (await timelineState(page)).events.map((e) => e.title)).toEqual(["Born", "Nobel Prize"]);
  const after = await timelineState(page);
  expect(after.images.map((i) => i.title)).toContain("Bars of a cell");
  expect(after.stops.map((s) => s.title)).toEqual(["Born", "Nobel Prize"]);
});
