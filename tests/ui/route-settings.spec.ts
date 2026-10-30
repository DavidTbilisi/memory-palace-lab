/**
 * Route Builder part 2: walk direction, draft routes, notes, and sections, set from the DSL and
 * the Routes tab, walked, and kept through a checkpoint and reload.
 */
import { expect, test, type Page } from "@playwright/test";

const STOPS = Array.from({ length: 13 }, (_, i) => `Room ${i + 1}`);

const DSL = [
  "@Tutorial Palace",
  "",
  ...STOPS.flatMap((title) => [title, ""]),
  "/Night Walk",
  "#color:sky #direction:reverse",
  ": Enter by the east gate.",
  ...STOPS.map((title, i) => `${i + 1} ${title}`),
  "",
].join("\n");

type RouteState = {
  name: string;
  color?: string;
  direction?: string;
  lastWalkDirection?: string;
  inReview?: boolean;
  notes?: string;
  sections: string[];
};

function nightWalk(page: Page): Promise<RouteState | null> {
  return page.evaluate(() => {
    type State = {
      routes: (Omit<RouteState, "sections"> & { id: string })[];
      loci: { routeId: string; orderIndex: number; section?: string | null }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const route = state.routes.find((candidate) => candidate.name === "Night Walk");
    if (!route) return null;
    const sections = state.loci
      .filter((locus) => locus.routeId === route.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((locus, i) => (locus.section ? `${i + 1}:${locus.section}` : null))
      .filter((entry): entry is string => entry !== null);
    const settings: Record<string, unknown> = { ...route, sections };
    delete settings.id;
    return settings as RouteState;
  });
}

async function applyDsl(page: Page, dsl: string) {
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();
  const cm = page.locator(".cm-content").first();
  await cm.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(dsl);
  await page.locator("body").click();
}

async function toggleWalk(page: Page) {
  await page.getByRole("button", { name: "Toggle walk mode" }).click();
}

test("a route's direction, review, notes, and sections round-trip and shape the walk", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();

  // Settings and notes come in through the DSL.
  await applyDsl(page, DSL);
  await expect.poll(() => nightWalk(page), { timeout: 10_000 }).toMatchObject({
    color: "sky",
    direction: "reverse",
    notes: "Enter by the east gate.",
    sections: [],
  });
  await page.keyboard.press("Control+E");

  // The Routes tab: notes on the card, a draft toggle, and a section on a long route.
  await page.getByRole("tab", { name: /^Routes/ }).click();
  const card = page.getByRole("region", { name: "Route Night Walk" });
  await expect(card.getByRole("textbox", { name: "Notes for Night Walk" })).toHaveValue("Enter by the east gate.");
  await card.getByRole("button", { name: "More actions for Night Walk" }).click();
  await page.getByRole("menuitemcheckbox", { name: "Include in review" }).click();
  await expect(card.getByText("Draft", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Start a section at stop 8" }).click();
  const sectionName = card.getByRole("textbox", { name: "Section name" });
  await sectionName.fill("Upstairs");
  await sectionName.press("Enter");
  await expect.poll(() => nightWalk(page)).toMatchObject({ inReview: false, sections: ["8:Upstairs"] });

  // A reverse walk starts at the last stop, inside the section.
  await page.getByRole("combobox", { name: "Walk route" }).selectOption({ label: "Night Walk" });
  await toggleWalk(page);
  await expect(page.getByText("Step 1/13")).toBeVisible();
  await expect(page.locator("#walk-cue")).toHaveText("Room 13");
  await expect(page.getByTestId("walk-direction-reverse")).toBeVisible();
  await expect(page.getByTestId("walk-section")).toHaveText("Upstairs");
  await toggleWalk(page);

  // Alternate flips the direction on every walk.
  await card.getByRole("button", { name: "More actions for Night Walk" }).click();
  await page.getByRole("menuitemradio", { name: "Alternate each walk" }).click();
  await toggleWalk(page);
  await expect(page.locator("#walk-cue")).toHaveText("Room 1");
  await expect(page.getByTestId("walk-direction-reverse")).toHaveCount(0);
  await expect(page.getByTestId("walk-section")).toHaveCount(0);
  await toggleWalk(page);
  await toggleWalk(page);
  await expect(page.locator("#walk-cue")).toHaveText("Room 13");
  await toggleWalk(page);

  // Everything survives a checkpoint and a reload, and the DSL writes the settings back.
  await page.getByRole("button", { name: /save checkpoint|checkpoint now/i }).click();
  await expect(page.getByRole("button", { name: /save checkpoint/i })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Tutorial Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect.poll(() => nightWalk(page)).toEqual({
    name: "Night Walk",
    palaceId: expect.any(String),
    color: "sky",
    direction: "alternate",
    lastWalkDirection: "reverse",
    inReview: false,
    notes: "Enter by the east gate.",
    sections: ["8:Upstairs"],
  });
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();
  await expect
    .poll(() => page.locator(".cm-content").first().innerText())
    .toContain("/Night Walk\n#color:sky #direction:alternate #review:off\n: Enter by the east gate.\n1 Room 1");
});
