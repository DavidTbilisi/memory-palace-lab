import { describe, expect, it } from "vitest";
import { splitMarkdownSections } from "../domain/services/markdownSections";
import {
  COMPONENT_ENTRIES,
  LIBRARY_SECTIONS,
  findLibraryEntry,
  findSectionIndexForAnchor,
  libraryEntryId,
  normalizeAnchor,
  resolveDocLink,
  type LibraryEntry,
} from "./library";

describe("resolveDocLink", () => {
  it("resolves relative markdown links with and without anchors", () => {
    expect(resolveDocLink("./cast-system.md")).toEqual({ slug: "cast-system" });
    expect(resolveDocLink("./cast-system.md#tier-2")).toEqual({ slug: "cast-system", anchor: "tier-2" });
    expect(resolveDocLink("Navigator.md")).toEqual({ slug: "navigator" });
    expect(resolveDocLink("./x.md#a%20b")).toEqual({ slug: "x", anchor: "a b" });
  });

  it("ignores external, anchor-only, and empty links", () => {
    expect(resolveDocLink("https://example.com/x.md")).toBeNull();
    expect(resolveDocLink("#local")).toBeNull();
    expect(resolveDocLink("")).toBeNull();
    expect(resolveDocLink(undefined)).toBeNull();
    expect(resolveDocLink("../docs/palace-dsl.md")).toBeNull();
  });
});

describe("anchors", () => {
  it("normalizes both slugifier dialects to one key", () => {
    expect(normalizeAnchor("Tags — Plain and Structured")).toBe("tags-plain-and-structured");
    expect(normalizeAnchor("tags--plain-and-structured")).toBe("tags-plain-and-structured");
    expect(normalizeAnchor("  Narrow: scope ")).toBe("narrow-scope");
  });

  it("finds the section for an anchor, including nested headings", () => {
    const sections = splitMarkdownSections("Intro\n\n## Narrow\n\ntext\n\n### Success criteria\n\nmore\n\n## Phases\n\nend");
    expect(findSectionIndexForAnchor(sections, "phases")).toBe(2);
    expect(findSectionIndexForAnchor(sections, "success-criteria")).toBe(1);
    expect(findSectionIndexForAnchor(sections, "nope")).toBe(-1);
  });
});

describe("index helpers", () => {
  const entry = (section: LibraryEntry["section"], slug: string): LibraryEntry => ({
    id: libraryEntryId(section, slug),
    section,
    slug,
    title: slug,
    summary: "",
    origin: section === "wiki" ? "wiki" : "lab",
    kind: "markdown",
  });

  it("prefers the requested origin, then guides before wiki", () => {
    const index = [entry("wiki", "glossary"), entry("guides", "glossary"), entry("wiki", "only-wiki")];
    expect(findLibraryEntry(index, "glossary")?.section).toBe("guides");
    expect(findLibraryEntry(index, "glossary", "wiki")?.section).toBe("wiki");
    expect(findLibraryEntry(index, "GLOSSARY", "lab")?.section).toBe("guides");
    expect(findLibraryEntry(index, "only-wiki", "lab")?.section).toBe("wiki");
    expect(findLibraryEntry(index, "missing")).toBeNull();
  });

  it("declares the five sections and component entries with unique ids", () => {
    expect(LIBRARY_SECTIONS.map((section) => section.id)).toEqual(["start", "guides", "wiki", "glossary", "reference"]);
    const ids = COMPONENT_ENTRIES.map((component) => component.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
