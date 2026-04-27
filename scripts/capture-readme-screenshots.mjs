import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.MP_BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = process.env.MP_SCREENSHOT_DIR ?? "docs/screenshots";

const pageCaptures = [
  {
    navButton: "Review",
    waitText: "Retrieval work lives here.",
    fileName: "03-review.png",
  },
  {
    navButton: "Insights",
    waitText: "Local-first telemetry for encoding and retrieval.",
    fileName: "04-insights.png",
  },
  {
    navButton: "System",
    waitText: "System Workbench",
    fileName: "05-system-workbench.png",
  },
  {
    navButton: "Atlas",
    waitText: "Atlas Hierarchy",
    fileName: "06-atlas.png",
  },
  {
    navButton: "Routes",
    waitText: "Organize memory palaces as ordered sequences of loci.",
    fileName: "07-routes.png",
  },
  {
    navButton: "Help",
    waitText: "Help Center",
    fileName: "08-help-center.png",
  },
];

async function takeScreenshot(page, fileName) {
  const target = path.join(outputDir, fileName);
  await page.screenshot({ path: target, fullPage: true });
  console.log(`Saved ${target}`);
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1720, height: 980 },
  });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.getByText("Memory Palace Lab").first().waitFor({ timeout: 20_000 });

    await takeScreenshot(page, "01-graph-empty.png");

    await page.getByRole("main").getByRole("button", { name: /create tutorial palace/i }).first().click();
    await page.getByRole("heading", { name: "Tutorial Palace" }).waitFor({ timeout: 20_000 });
    await takeScreenshot(page, "02-graph-workspace.png");

    for (const capture of pageCaptures) {
      await page.locator("header nav").getByRole("button", { name: capture.navButton, exact: true }).click();
      await page.getByText(capture.waitText).first().waitFor({ timeout: 20_000 });
      await takeScreenshot(page, capture.fileName);
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
