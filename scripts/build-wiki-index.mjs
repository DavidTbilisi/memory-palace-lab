#!/usr/bin/env node
/**
 * Build `theSystem/wiki/wiki-index.json` from the pages already synced into
 * `theSystem/wiki/`. Needs no access to the wiki repo, so it can run anywhere.
 *
 *   node scripts/build-wiki-index.mjs           # write the index
 *   node scripts/build-wiki-index.mjs --check   # exit 1 if the index is stale
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  WIKI_INDEX_FILENAME,
  buildWikiIndex,
  serializeWikiIndex,
} from "./wiki-index-lib.mjs";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const WIKI_DIR = join(REPO_ROOT, "theSystem", "wiki");
const checkOnly = process.argv.includes("--check");

const pages = readdirSync(WIKI_DIR)
  .filter((name) => name.endsWith(".md") && name !== "INDEX.md")
  .sort()
  .map((name) => ({
    slug: name.replace(/\.md$/i, "").toLowerCase(),
    text: readFileSync(join(WIKI_DIR, name), "utf8"),
  }));

const next = serializeWikiIndex(buildWikiIndex(pages));
const dest = join(WIKI_DIR, WIKI_INDEX_FILENAME);
const current = existsSync(dest) ? readFileSync(dest, "utf8") : null;

if (checkOnly) {
  if (current !== next) {
    console.error(`${WIKI_INDEX_FILENAME} is stale. Run: npm run wiki:index`);
    process.exit(1);
  }
  console.log(`${WIKI_INDEX_FILENAME} is up to date (${pages.length} pages).`);
  process.exit(0);
}

if (current === next) {
  console.log(`${WIKI_INDEX_FILENAME} unchanged (${pages.length} pages).`);
} else {
  writeFileSync(dest, next);
  console.log(`wrote ${WIKI_INDEX_FILENAME} (${pages.length} pages).`);
}
