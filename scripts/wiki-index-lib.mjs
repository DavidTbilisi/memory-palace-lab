/**
 * Pure helpers for building `theSystem/wiki/wiki-index.json`: a small,
 * date-free index (slug, title, summary, source, frontmatter facets) that the
 * app's Library reads so it can search 400+ pages without loading their bodies.
 *
 * Shared by `scripts/build-wiki-index.mjs` (standalone) and
 * `scripts/sync-thesystem.mjs` (after a sync).
 */

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const NUMERIC_KEYS = new Set(["level", "domain", "room"]);

export function parseFrontmatter(text) {
  const match = text.match(FRONTMATTER_RE);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!pair) continue;
    out[pair[1]] = pair[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

export function stripFrontmatter(text) {
  return text.replace(FRONTMATTER_RE, "").trim();
}

export function stripInlineMarkdown(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractTitle(slug, text) {
  const match = stripFrontmatter(text).match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || humanizeSlug(slug);
}

export function humanizeSlug(slug) {
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

/** The `**Summary**: …` line most pages carry; otherwise the first prose line. */
export function extractSummary(text) {
  const body = stripFrontmatter(text);
  const match = body.match(/^\*\*Summary\*\*\s*:?\s*(.+)$/m);
  if (match) return stripInlineMarkdown(match[1]);
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("```")
    )
      continue;
    const cleaned = stripInlineMarkdown(trimmed);
    if (cleaned.length >= 24) return cleaned;
  }
  return "";
}

/**
 * Build index entries from `{ slug, text, sourceRel? }` pages. Output is sorted
 * by slug and contains no timestamps, so it only changes when content does.
 */
export function buildWikiIndex(pages) {
  const entries = [];
  for (const page of pages) {
    const slug = page.slug.toLowerCase();
    if (slug === "index") continue;
    const front = parseFrontmatter(page.text);
    const entry = {
      slug,
      title: extractTitle(slug, page.text),
      summary: extractSummary(page.text),
      source: page.sourceRel ?? front.wiki_source ?? "",
    };
    for (const key of ["palace", "level", "domain", "room"]) {
      const value = front[key];
      if (value === undefined || value === "") continue;
      if (NUMERIC_KEYS.has(key)) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) entry[key] = parsed;
      } else {
        entry[key] = value;
      }
    }
    entries.push(entry);
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return entries;
}

export const WIKI_INDEX_FILENAME = "wiki-index.json";

export function serializeWikiIndex(entries) {
  return `${JSON.stringify(entries, null, 2)}\n`;
}
