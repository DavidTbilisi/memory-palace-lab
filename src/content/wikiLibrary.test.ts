import { beforeEach, describe, expect, it } from "vitest";
import {
  extractWikiBody,
  extractWikiSummary,
  extractWikiTitle,
  hasWikiPage,
  humanizeWikiSlug,
  loadWikiBody,
  loadWikiIndex,
  parseWikiFrontmatter,
  parseWikiIndexMarkdown,
  resetWikiCacheForTests,
  wikiSlugs,
} from "./wikiLibrary";

const PAGE = `---
palace: meta-knowledge
level: 6
wiki_source: wiki/meta-wiki/5-gates-of-comprehension.md
---

# 5 Gates of Comprehension

**Summary**: Pre-encoding validation protocol. Five gates that material must pass before [NEDF](./nedf-overview.md).

## Gate 1

Body text.
`;

describe("wiki parsing helpers", () => {
  it("parses frontmatter, title, summary, and body", () => {
    expect(parseWikiFrontmatter(PAGE)).toEqual({
      palace: "meta-knowledge",
      level: "6",
      wiki_source: "wiki/meta-wiki/5-gates-of-comprehension.md",
    });
    expect(extractWikiTitle("x", PAGE)).toBe("5 Gates of Comprehension");
    expect(extractWikiSummary(PAGE)).toBe(
      "Pre-encoding validation protocol. Five gates that material must pass before NEDF.",
    );
    expect(extractWikiBody(PAGE).startsWith("**Summary**")).toBe(true);
    expect(extractWikiBody(PAGE)).not.toContain("# 5 Gates");
  });

  it("falls back to a humanized slug and first prose line", () => {
    expect(humanizeWikiSlug("active-recall")).toBe("Active Recall");
    expect(extractWikiTitle("active-recall", "no heading here")).toBe("Active Recall");
    expect(extractWikiSummary("# T\n\nA long enough opening paragraph for a summary.")).toBe(
      "A long enough opening paragraph for a summary.",
    );
  });

  it("parses INDEX.md rows, unescaping table pipes", () => {
    const rows = parseWikiIndexMarkdown(
      [
        "| Page | Title | Wiki source |",
        "| --- | --- | --- |",
        "| [`active-recall`](./active-recall.md) | Active Recall | `wiki/learning-systems/active-recall.md` |",
        "| [`and-or`](./and-or.md) | AND \\| OR | `wiki/logic/and-or.md` |",
      ].join("\n"),
    );
    expect(rows).toEqual([
      { slug: "active-recall", title: "Active Recall", summary: "", source: "wiki/learning-systems/active-recall.md" },
      { slug: "and-or", title: "AND | OR", summary: "", source: "wiki/logic/and-or.md" },
    ]);
  });
});

describe("wiki loaders (real mirror)", () => {
  beforeEach(() => resetWikiCacheForTests());

  it("indexes every page without loading bodies, excluding INDEX", async () => {
    const slugs = wikiSlugs();
    expect(slugs.length).toBeGreaterThan(300);
    expect(slugs).not.toContain("index");
    expect(hasWikiPage("spaced-repetition")).toBe(true);
    expect(hasWikiPage("index")).toBe(false);

    const index = await loadWikiIndex();
    expect(index.length).toBe(slugs.length);
    const spaced = index.find((entry) => entry.slug === "spaced-repetition");
    expect(spaced?.title.length).toBeGreaterThan(0);
    // wiki-index.json carries summaries; INDEX.md alone would not.
    expect(spaced?.summary.length).toBeGreaterThan(0);
  });

  it("memoizes body loads and strips frontmatter", async () => {
    const first = loadWikiBody("spaced-repetition");
    const second = loadWikiBody("spaced-repetition");
    expect(first).toBe(second);
    const body = await first;
    expect(body.startsWith("---")).toBe(false);
    await expect(loadWikiBody("definitely-not-a-page")).rejects.toThrow(/Unknown wiki page/);
  });
});
