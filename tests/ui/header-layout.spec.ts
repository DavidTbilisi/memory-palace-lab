/**
 * Header layout: at narrow widths the toolbar used to spill over the page navigation and its tabs,
 * so a click on Insights › Difficulty landed on the Encode button instead.
 */
import { expect, test, type Page } from "@playwright/test";
import { openTutorialPalace } from "./routeHelpers";

/** Pairs of visible header controls whose boxes overlap, named by title or text. */
function overlappingControls(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const header = document.querySelector("header")!;
    const controls = [...header.querySelectorAll<HTMLElement>("button, h1")]
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({ name: el.title || el.textContent || "", box: el.getBoundingClientRect() }));
    const overlaps: string[] = [];
    for (let i = 0; i < controls.length; i++) {
      for (let j = i + 1; j < controls.length; j++) {
        const a = controls[i].box;
        const b = controls[j].box;
        if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) {
          overlaps.push(`${controls[i].name} / ${controls[j].name}`);
        }
      }
    }
    return overlaps;
  });
}

test("header controls never overlap, from the desktop default width up", async ({ page }) => {
  await openTutorialPalace(page);
  for (const pageButton of [/^Graph$/, /^Insights$/]) {
    await page.getByRole("button", { name: pageButton }).click();
    for (const width of [800, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 720 });
      await expect.poll(() => overlappingControls(page), { message: `${pageButton} at ${width}px` }).toEqual([]);
    }
  }

  // The click that used to hit the Encode button instead.
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.getByRole("tab", { name: "Difficulty", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Difficulty", exact: true })).toHaveAttribute("aria-selected", "true");
});
