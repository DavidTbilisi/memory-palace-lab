#!/usr/bin/env node
/**
 * Mirror the curated slice of the Neural OS wiki into `theSystem/wiki/`.
 *
 * The wiki repo is canonical. This is a one-way, read-only import: the script
 * never writes outside `theSystem/wiki/`, and it never touches the hand-authored
 * skill docs that sit directly in `theSystem/` (those are written in the app's
 * own voice and are not wiki copies).
 *
 *   node scripts/sync-thesystem.mjs                        # default source ../Neural-OS-Research
 *   node scripts/sync-thesystem.mjs /path/to/Neural-OS-Research
 *   node scripts/sync-thesystem.mjs --dry-run              # report, write nothing
 *   node scripts/sync-thesystem.mjs --check                # exit 1 if out of date
 *
 * Source can also come from $NEURAL_OS_WIKI.
 *
 * What the transform does, and why:
 *  - Pages are flattened to `theSystem/wiki/<basename>.md`. The MCP resource lister
 *    (mcp-server/src/resources.ts) addresses docs by a flat slug, so a nested tree
 *    would need a nested slug scheme for no gain. Basename collisions abort the run.
 *  - `[[wiki-link]]` is rewritten to a relative markdown link when the target is
 *    inside the synced set, and flattened to plain text when it is not — a dead
 *    `[[link]]` reads as a broken promise to both a human and an LLM.
 *  - A `wiki_source:` frontmatter key records where each page came from. It is the
 *    only key added, and it is stable, so re-syncing an unchanged page is a no-op
 *    in git rather than a date-stamp churn.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join, basename, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const DEST_DIR = join(REPO_ROOT, "theSystem", "wiki");
const MANIFEST_PATH = join(REPO_ROOT, "theSystem", "wiki-sync.manifest.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const checkOnly = args.includes("--check");
const positional = args.filter((a) => !a.startsWith("--"));
const SOURCE_ROOT = resolve(positional[0] ?? process.env.NEURAL_OS_WIKI ?? join(REPO_ROOT, "..", "Neural-OS-Research"));
const WIKI_DIR = join(SOURCE_ROOT, "wiki");

// ── Collect the source set ────────────────────────────────────────────────────

/** Recursively list .md files under `dir`, skipping any path in `pruned`. */
function walkMarkdown(dir, pruned) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(WIKI_DIR, full);
    if (entry.isDirectory()) {
      if (pruned.some((p) => rel === p || rel.startsWith(`${p}/`))) continue;
      out.push(...walkMarkdown(full, pruned));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function collectSources(manifest) {
  const pruned = (manifest.excludeDirs ?? []).map((p) => p.replace(/\/+$/, ""));
  const found = [];
  const emptyGlobs = [];

  for (const dir of manifest.dirs ?? []) {
    const hits = walkMarkdown(join(WIKI_DIR, dir), pruned);
    if (hits.length === 0) emptyGlobs.push(`dir  ${dir}`);
    found.push(...hits);
  }
  for (const file of manifest.files ?? []) {
    const full = join(WIKI_DIR, file);
    if (existsSync(full) && statSync(full).isFile()) found.push(full);
    else emptyGlobs.push(`file ${file}`);
  }

  return { sources: [...new Set(found)].sort(), emptyGlobs };
}

// ── Transform ─────────────────────────────────────────────────────────────────

const WIKI_LINK = /\[\[([^\]|#]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]/g;

/** Anchor form GitHub/most renderers use: lowercase, punctuation dropped, spaces to dashes. */
function slugifyAnchor(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Rewrite [[wiki-links]] against the synced page set.
 *
 * Fenced code blocks are left alone: some of them are Obsidian plugin blocks (the
 * leaflet maps in neighborhood-palace) where `[[link]]` is the block's own syntax,
 * and rewriting it there breaks the block rather than improving it.
 *
 * Returns the new text plus the targets that could not be resolved.
 */
function rewriteWikiLinks(text, syncedSlugs) {
  const unresolved = new Set();
  let inFence = false;

  const rewritten = text
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(WIKI_LINK, (_match, target, anchor, label) => {
        // Inside a markdown table the wiki writes `[[page\|label]]` — the pipe is escaped,
        // so the backslash lands on the end of the target and has to come back off.
        const slug = target.trim().replace(/\\$/, "").toLowerCase();
        const shown = (label ?? target).trim();
        if (!syncedSlugs.has(slug)) {
          unresolved.add(slug);
          return shown;
        }
        const fragment = anchor ? `#${slugifyAnchor(anchor)}` : "";
        return `[${shown}](./${slug}.md${fragment})`;
      });
    })
    .join("\n");

  return { rewritten, unresolved };
}

/** Insert `wiki_source:` into existing frontmatter, or open a block if there is none. */
function stampProvenance(text, sourceRel) {
  const stamp = `wiki_source: ${sourceRel}`;
  if (text.startsWith("---\n")) {
    const end = text.indexOf("\n---", 4);
    if (end !== -1) {
      const head = text.slice(4, end);
      const body = text.slice(end);
      const cleaned = head
        .split("\n")
        .filter((line) => !line.startsWith("wiki_source:"))
        .join("\n");
      return `---\n${cleaned}\n${stamp}${body}`;
    }
  }
  return `---\n${stamp}\n---\n\n${text}`;
}

function firstHeading(text) {
  return text.split("\n").find((line) => line.startsWith("# "))?.slice(2).trim() ?? null;
}

// ── Run ───────────────────────────────────────────────────────────────────────

if (!existsSync(WIKI_DIR)) {
  console.error(`ERROR: ${WIKI_DIR} not found.`);
  console.error("Pass the wiki repo path as an argument or set $NEURAL_OS_WIKI.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const { sources, emptyGlobs } = collectSources(manifest);

if (sources.length === 0) {
  console.error(`ERROR: the manifest matched no pages under ${WIKI_DIR}.`);
  process.exit(1);
}

// Flat destination namespace — a basename collision would silently drop a page.
const bySlug = new Map();
const collisions = [];
for (const src of sources) {
  const slug = basename(src, ".md").toLowerCase();
  if (bySlug.has(slug)) collisions.push({ slug, a: relative(SOURCE_ROOT, bySlug.get(slug)), b: relative(SOURCE_ROOT, src) });
  else bySlug.set(slug, src);
}
if (collisions.length > 0) {
  console.error("ERROR: basename collisions in the synced set — the flat slug namespace cannot hold both:");
  for (const c of collisions) console.error(`  ${c.slug}: ${c.a}  vs  ${c.b}`);
  console.error("Fix: rename one page in the wiki, or exclude one in wiki-sync.manifest.json.");
  process.exit(1);
}

const syncedSlugs = new Set(bySlug.keys());
const unresolvedAll = new Set();
const pages = [];

for (const [slug, src] of [...bySlug].sort(([a], [b]) => a.localeCompare(b))) {
  const raw = readFileSync(src, "utf8");
  const sourceRel = relative(SOURCE_ROOT, src).split("\\").join("/");
  const { rewritten, unresolved } = rewriteWikiLinks(raw, syncedSlugs);
  for (const u of unresolved) unresolvedAll.add(u);
  pages.push({
    slug,
    sourceRel,
    title: firstHeading(rewritten) ?? slug,
    text: stampProvenance(rewritten, sourceRel),
  });
}

// The index doubles as the human entry point and the MCP list description source.
const indexText = [
  "---",
  "wiki_source: (generated by scripts/sync-thesystem.mjs)",
  "---",
  "",
  "# Wiki Snapshot",
  "",
  `A read-only mirror of ${pages.length} pages from the Neural OS wiki, the canonical source for this`,
  "project's memory science. Do not edit these files — edit the wiki and re-run `npm run sync:thesystem`.",
  "",
  `**Synced**: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "| Page | Title | Wiki source |",
  "| --- | --- | --- |",
  ...pages.map((p) => `| [\`${p.slug}\`](./${p.slug}.md) | ${p.title.replace(/\|/g, "\\|")} | \`${p.sourceRel}\` |`),
  "",
].join("\n");

const desired = new Map(pages.map((p) => [`${p.slug}.md`, p.text]));
desired.set("INDEX.md", indexText);

const existing = existsSync(DEST_DIR) ? readdirSync(DEST_DIR).filter((f) => f.endsWith(".md")) : [];
const added = [];
const updated = [];
const removed = existing.filter((f) => !desired.has(f));

for (const [name, text] of desired) {
  const dest = join(DEST_DIR, name);
  if (!existsSync(dest)) added.push(name);
  else if (readFileSync(dest, "utf8") !== text) updated.push(name);
}

// INDEX.md carries a sync date, so it always differs. Don't let it alone claim "out of date".
const contentChanged = added.length + removed.length + updated.filter((f) => f !== "INDEX.md").length;

if (checkOnly) {
  if (contentChanged > 0) {
    console.error(`theSystem/wiki is out of date: +${added.length} ~${updated.filter((f) => f !== "INDEX.md").length} -${removed.length}`);
    console.error("Run: npm run sync:thesystem");
    process.exit(1);
  }
  console.log(`theSystem/wiki is up to date (${pages.length} pages).`);
  process.exit(0);
}

if (!dryRun) {
  mkdirSync(DEST_DIR, { recursive: true });
  for (const name of removed) rmSync(join(DEST_DIR, name));
  for (const [name, text] of desired) {
    const dest = join(DEST_DIR, name);
    if (!existsSync(dest) || readFileSync(dest, "utf8") !== text) writeFileSync(dest, text);
  }
}

const verb = dryRun ? "would sync" : "synced";
console.log(`${verb} ${pages.length} pages: ${relative(process.cwd(), WIKI_DIR)} -> ${relative(REPO_ROOT, DEST_DIR)}`);
console.log(`  +${added.length} added  ~${updated.filter((f) => f !== "INDEX.md").length} updated  -${removed.length} removed`);
if (emptyGlobs.length > 0) {
  console.log(`  ${emptyGlobs.length} manifest entries matched nothing (renamed or moved in the wiki?):`);
  for (const g of emptyGlobs) console.log(`    ${g}`);
}
if (unresolvedAll.size > 0) {
  const sample = [...unresolvedAll].sort().slice(0, 8);
  console.log(`  ${unresolvedAll.size} wiki-links pointed outside the synced slice and were flattened to plain text`);
  console.log(`    e.g. ${sample.join(", ")}${unresolvedAll.size > sample.length ? ", …" : ""}`);
}
if (dryRun) console.log("  (dry run — nothing written)");
