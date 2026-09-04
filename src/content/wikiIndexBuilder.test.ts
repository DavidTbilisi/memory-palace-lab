import { describe, expect, it } from "vitest";
import { buildWikiIndex, extractSummary, parseFrontmatter, serializeWikiIndex } from "../../scripts/wiki-index-lib.mjs";

const PAGE = `---
palace: meta-knowledge
level: 6
domain: 10
room: 1
wiki_source: wiki/meta-wiki/5-gates-of-comprehension.md
---

# 5 Gates of Comprehension

**Summary**: Pre-encoding validation protocol with a [link](./nedf-overview.md) and *emphasis*.

## Body
`;

describe("wiki index builder", () => {
  it("parses frontmatter and the summary line", () => {
    expect(parseFrontmatter(PAGE)).toMatchObject({ palace: "meta-knowledge", level: "6", domain: "10" });
    expect(extractSummary(PAGE)).toBe("Pre-encoding validation protocol with a link and emphasis.");
  });

  it("builds sorted, date-free entries with numeric facets and skips INDEX", () => {
    const entries = buildWikiIndex([
      { slug: "zeta", text: "# Zeta\n\nA sufficiently long opening line for the summary." },
      { slug: "5-gates-of-comprehension", text: PAGE },
      { slug: "index", text: "# Wiki Snapshot" },
    ]);
    expect(entries.map((entry) => entry.slug)).toEqual(["5-gates-of-comprehension", "zeta"]);
    expect(entries[0]).toEqual({
      slug: "5-gates-of-comprehension",
      title: "5 Gates of Comprehension",
      summary: "Pre-encoding validation protocol with a link and emphasis.",
      source: "wiki/meta-wiki/5-gates-of-comprehension.md",
      palace: "meta-knowledge",
      level: 6,
      domain: 10,
      room: 1,
    });
    expect(entries[1].summary).toBe("A sufficiently long opening line for the summary.");
    const json = serializeWikiIndex(entries);
    expect(json.endsWith("\n")).toBe(true);
    expect(json).not.toMatch(/synced|date/i);
  });
});
