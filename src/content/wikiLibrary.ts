/**
 * Lazy access to the Neural OS wiki mirror in `theSystem/wiki/`.
 *
 * The mirror is ~420 pages / ~8 MB of markdown, so nothing here is eager: the
 * glob below yields one loader per page and the entry bundle only carries the
 * loader map. Titles and summaries come from `wiki-index.json` (emitted by
 * `scripts/build-wiki-index.mjs`) when present, or from `INDEX.md` otherwise.
 */
export type WikiIndexEntry = {
  slug: string;
  title: string;
  summary: string;
  source: string;
  palace?: string;
  level?: number;
  domain?: number;
  room?: number;
};

const wikiModules = import.meta.glob("../../theSystem/wiki/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

// A glob for a single optional file: `{}` when the index has not been built.
const wikiIndexJsonModules = import.meta.glob("../../theSystem/wiki/wiki-index.json", {
  import: "default",
}) as Record<string, () => Promise<unknown>>;

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const INDEX_SLUG = "index";

function slugFromPath(path: string) {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/\.md$/i, "").toLowerCase();
}

const loadersBySlug = new Map<string, () => Promise<string>>();
for (const [path, loader] of Object.entries(wikiModules)) {
  loadersBySlug.set(slugFromPath(path), loader);
}

/** Every page slug in the mirror (excluding the generated INDEX). */
export function wikiSlugs(): string[] {
  return [...loadersBySlug.keys()].filter((slug) => slug !== INDEX_SLUG).sort();
}

export function hasWikiPage(slug: string): boolean {
  return slug !== INDEX_SLUG && loadersBySlug.has(slug.toLowerCase());
}

export function humanizeWikiSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

/** `key: value` lines from the YAML-ish frontmatter block. Values stay strings. */
export function parseWikiFrontmatter(text: string): Record<string, string> {
  const match = text.match(FRONTMATTER_RE);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!pair) continue;
    result[pair[1]] = pair[2].trim().replace(/^["']|["']$/g, "");
  }
  return result;
}

export function stripWikiFrontmatter(text: string): string {
  return text.replace(FRONTMATTER_RE, "").trim();
}

export function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractWikiTitle(slug: string, text: string): string {
  const match = stripWikiFrontmatter(text).match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || humanizeWikiSlug(slug);
}

/** The `**Summary**: …` line most wiki pages carry right under the H1. */
export function extractWikiSummary(text: string): string {
  const body = stripWikiFrontmatter(text);
  const match = body.match(/^\*\*Summary\*\*\s*:?\s*(.+)$/m);
  if (match) return stripInlineMarkdown(match[1]);
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("|") || trimmed.startsWith("```")) continue;
    const cleaned = stripInlineMarkdown(trimmed);
    if (cleaned.length >= 24) return cleaned;
  }
  return "";
}

/** Body without frontmatter and without the leading H1 (the reader shows the title itself). */
export function extractWikiBody(text: string): string {
  const stripped = stripWikiFrontmatter(text);
  const lines = stripped.split(/\r?\n/);
  if (/^#\s+/.test(lines[0] ?? "")) return lines.slice(1).join("\n").trim();
  return stripped;
}

/** Parse the generated INDEX.md table: `| [\`slug\`](./slug.md) | Title | \`source\` |`. */
export function parseWikiIndexMarkdown(text: string): WikiIndexEntry[] {
  const entries: WikiIndexEntry[] = [];
  for (const line of text.split(/\r?\n/)) {
    const row = line.match(/^\|\s*\[`([^`]+)`\]\([^)]*\)\s*\|\s*(.+?)\s*\|\s*`([^`]*)`\s*\|\s*$/);
    if (!row) continue;
    entries.push({
      slug: row[1].trim().toLowerCase(),
      title: row[2].replace(/\\\|/g, "|").trim(),
      summary: "",
      source: row[3].trim(),
    });
  }
  return entries;
}

function isIndexEntryArray(value: unknown): value is WikiIndexEntry[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object" && "slug" in item);
}

let indexPromise: Promise<WikiIndexEntry[]> | null = null;
const bodyPromises = new Map<string, Promise<string>>();

async function loadIndexJson(): Promise<WikiIndexEntry[] | null> {
  const loader = Object.values(wikiIndexJsonModules)[0];
  if (!loader) return null;
  try {
    const parsed = await loader();
    return isIndexEntryArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function loadIndexMarkdown(): Promise<WikiIndexEntry[]> {
  const loader = loadersBySlug.get(INDEX_SLUG);
  if (!loader) return [];
  try {
    return parseWikiIndexMarkdown(await loader());
  } catch {
    return [];
  }
}

/**
 * Titles/summaries for every page, without loading bodies. Pages missing from
 * the index (a newer sync) still appear with a humanized title.
 */
export function loadWikiIndex(): Promise<WikiIndexEntry[]> {
  if (!indexPromise) {
    indexPromise = (async () => {
      const fromJson = await loadIndexJson();
      const base = fromJson ?? (await loadIndexMarkdown());
      const bySlug = new Map(base.map((entry) => [entry.slug, entry]));
      for (const slug of wikiSlugs()) {
        if (!bySlug.has(slug)) {
          bySlug.set(slug, { slug, title: humanizeWikiSlug(slug), summary: "", source: "" });
        }
      }
      return [...bySlug.values()]
        .filter((entry) => entry.slug !== INDEX_SLUG && loadersBySlug.has(entry.slug))
        .sort((a, b) => a.title.localeCompare(b.title));
    })();
  }
  return indexPromise;
}

/** Load and cache one page body (frontmatter and H1 removed). */
export function loadWikiBody(slug: string): Promise<string> {
  const key = slug.toLowerCase();
  const existing = bodyPromises.get(key);
  if (existing) return existing;
  const loader = loadersBySlug.get(key);
  if (!loader || key === INDEX_SLUG) return Promise.reject(new Error(`Unknown wiki page: ${slug}`));
  const promise = loader().then(extractWikiBody);
  bodyPromises.set(key, promise);
  return promise;
}

/** Load every page body; only for the opt-in full-text search. */
export async function loadAllWikiBodies(): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  await Promise.all(
    wikiSlugs().map(async (slug) => {
      result.set(slug, await loadWikiBody(slug));
    }),
  );
  return result;
}

export function resetWikiCacheForTests() {
  indexPromise = null;
  bodyPromises.clear();
}
