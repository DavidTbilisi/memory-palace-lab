import type { MarkdownSection } from "../domain/services/markdownSections";
import { loadTheSystemDocs } from "./theSystemLibrary";
import { REFERENCE_DOCS } from "./referenceDocs";
import { loadWikiBody, loadWikiIndex } from "./wikiLibrary";

/**
 * The Library is the single home for everything a user reads rather than
 * edits: lessons, the curated theSystem guides, the wiki mirror, the
 * glossary, and app reference. This module builds its index.
 */
export type LibrarySection = "start" | "guides" | "wiki" | "glossary" | "reference";

export type LibrarySectionInfo = {
  id: LibrarySection;
  label: string;
  blurb: string;
};

export const LIBRARY_SECTIONS: readonly LibrarySectionInfo[] = [
  { id: "start", label: "Start here", blurb: "First-session lessons, progress, example palaces, and the app manual." },
  { id: "guides", label: "Guides", blurb: "The curated theSystem methodology: encoding, comprehension, numeric systems, operations." },
  { id: "wiki", label: "Wiki", blurb: "The Neural OS wiki mirror: memory science, encoders, logic, and problem-solving pages." },
  { id: "glossary", label: "Glossary", blurb: "App vocabulary and the full bilingual CAST lexicon." },
  { id: "reference", label: "Reference", blurb: "Palace DSL specification and keyboard shortcuts." },
];

export type LibraryOrigin = "lab" | "wiki" | "app";

export type LibraryEntry = {
  id: string;
  section: LibrarySection;
  slug: string;
  title: string;
  summary: string;
  category?: string;
  origin: LibraryOrigin;
  kind: "markdown" | "component";
  keywords?: string;
  /** Lower-cased body text for search when the body is already in memory. */
  searchText?: string;
  /** Markdown body loader; absent for component entries. */
  load?: () => Promise<string>;
};

export function libraryEntryId(section: LibrarySection, slug: string): string {
  return `${section}:${slug}`;
}

/** Entries rendered by React components rather than markdown. */
export const COMPONENT_ENTRIES: readonly LibraryEntry[] = [
  {
    id: libraryEntryId("start", "lessons"),
    section: "start",
    slug: "lessons",
    title: "Lessons and progress",
    summary: "Four short lessons that take you from an empty canvas to a walked route.",
    origin: "app",
    kind: "component",
    keywords: "onboarding tutorial lesson progress checklist",
  },
  {
    id: libraryEntryId("start", "examples"),
    section: "start",
    slug: "examples",
    title: "Example palaces",
    summary: "Ready-made palaces you can open to see nodes, CAST edges, and a route in place.",
    origin: "app",
    kind: "component",
    keywords: "example sample blueprint tutorial",
  },
  {
    id: libraryEntryId("glossary", "terms"),
    section: "glossary",
    slug: "terms",
    title: "App vocabulary",
    summary: "Locus, route, portal, encoding, walk mode, and the other terms the app uses.",
    origin: "app",
    kind: "component",
    keywords: "glossary definitions vocabulary terms",
  },
  {
    id: libraryEntryId("glossary", "cast"),
    section: "glossary",
    slug: "cast",
    title: "CAST lexicon",
    summary: "The four CAST axes (WHO / HOW / WHAT / WHEN) with bit pairs, archetypes, and bilingual glosses.",
    origin: "app",
    kind: "component",
    keywords: "cast who how what when giant mermaid mage dragon georgian russian",
  },
  {
    id: libraryEntryId("reference", "shortcuts"),
    section: "reference",
    slug: "shortcuts",
    title: "Keyboard shortcuts",
    summary: "Every global shortcut in one table.",
    origin: "app",
    kind: "component",
    keywords: "keyboard shortcuts hotkeys ctrl cmd",
  },
];

let indexPromise: Promise<LibraryEntry[]> | null = null;

/** Build (once) the complete Library index. Bodies are not loaded here. */
export function loadLibraryIndex(): Promise<LibraryEntry[]> {
  if (!indexPromise) {
    indexPromise = (async () => {
      const [docs, wiki] = await Promise.all([loadTheSystemDocs(), loadWikiIndex()]);
      const guides: LibraryEntry[] = docs.map((doc) => ({
        id: libraryEntryId(doc.slug === "app-manual" ? "start" : "guides", doc.slug),
        section: doc.slug === "app-manual" ? "start" : "guides",
        slug: doc.slug,
        title: doc.title,
        summary: doc.summary,
        category: doc.category,
        origin: "lab",
        kind: "markdown",
        keywords: doc.filename,
        searchText: doc.body.toLowerCase(),
        load: async () => doc.body,
      }));
      const wikiEntries: LibraryEntry[] = wiki.map((entry) => ({
        id: libraryEntryId("wiki", entry.slug),
        section: "wiki",
        slug: entry.slug,
        title: entry.title,
        summary: entry.summary,
        category: entry.palace,
        origin: "wiki",
        kind: "markdown",
        keywords: [entry.palace, entry.domain != null ? `domain ${entry.domain}` : "", entry.source]
          .filter(Boolean)
          .join(" "),
        load: () => loadWikiBody(entry.slug),
      }));
      const reference: LibraryEntry[] = REFERENCE_DOCS.map((doc) => ({
        id: libraryEntryId("reference", doc.slug),
        section: "reference",
        slug: doc.slug,
        title: doc.title,
        summary: doc.summary,
        origin: "app",
        kind: "markdown",
        keywords: "dsl language syntax",
        load: doc.load,
      }));
      return [...COMPONENT_ENTRIES, ...guides, ...wikiEntries, ...reference];
    })();
  }
  return indexPromise;
}

export function resetLibraryIndexForTests() {
  indexPromise = null;
}

/** Sections a doc slug could live in, in lookup priority. */
const SLUG_LOOKUP_ORDER: readonly LibrarySection[] = ["start", "guides", "reference", "wiki", "glossary"];

/** Find the entry for a slug, preferring the given origin's section, then the usual order. */
export function findLibraryEntry(
  index: readonly LibraryEntry[],
  slug: string,
  preferred?: LibrarySection | LibraryOrigin,
): LibraryEntry | null {
  const wanted = slug.toLowerCase();
  const matches = index.filter((entry) => entry.slug === wanted);
  if (matches.length === 0) return null;
  const preferredSection: LibrarySection | null =
    preferred === "wiki" ? "wiki" : preferred === "lab" ? "guides" : preferred === "app" ? "reference" : (preferred ?? null);
  if (preferredSection) {
    const hit = matches.find((entry) => entry.section === preferredSection);
    if (hit) return hit;
  }
  for (const section of SLUG_LOOKUP_ORDER) {
    const hit = matches.find((entry) => entry.section === section);
    if (hit) return hit;
  }
  return matches[0];
}

export type DocLinkTarget = {
  slug: string;
  anchor?: string;
};

const DOC_LINK_RE = /^(?:\.\/)?([\w][\w-]*)\.md(?:#(.+))?$/i;

/**
 * Resolve an in-document link. Both the wiki sync (`[x](./x.md#anchor)`) and
 * the lab docs use relative `.md` links; anything else (http, mailto, bare
 * `#anchor`) is not a Library navigation.
 */
export function resolveDocLink(href: string | undefined | null): DocLinkTarget | null {
  if (!href) return null;
  const match = href.trim().match(DOC_LINK_RE);
  if (!match) return null;
  const anchor = match[2] ? decodeURIComponent(match[2]) : undefined;
  return anchor ? { slug: match[1].toLowerCase(), anchor } : { slug: match[1].toLowerCase() };
}

/** Collapse the two slugifier dialects (sync script vs. markdownSections) into one key. */
export function normalizeAnchor(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Index of the `##` section an anchor points into, searching `###` headings too. Returns -1 if none. */
export function findSectionIndexForAnchor(sections: readonly MarkdownSection[], anchor: string): number {
  const wanted = normalizeAnchor(anchor);
  if (!wanted) return -1;
  const direct = sections.findIndex(
    (section) =>
      normalizeAnchor(section.id) === wanted ||
      normalizeAnchor(section.title) === wanted ||
      normalizeAnchor(section.label) === wanted,
  );
  if (direct !== -1) return direct;
  return sections.findIndex((section) =>
    section.content
      .split(/\r?\n/)
      .some((line) => /^#{3,6}\s+/.test(line) && normalizeAnchor(line.replace(/^#+\s+/, "")) === wanted),
  );
}
