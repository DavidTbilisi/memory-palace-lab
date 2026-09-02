import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serializeDsl } from "../../src/domain/services/palaceDsl/serializer";
import { listPalaces, loadPalace } from "./palaceDb";
import type { ServerContext } from "./tools/shared";

/** Repo root (mcp-server/src → two levels up). */
export const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));

const THE_SYSTEM_DIR = join(REPO_ROOT, "theSystem");
/** Read-only mirror of the Neural OS wiki, written by scripts/sync-thesystem.mjs. */
const WIKI_SNAPSHOT_DIR = join(THE_SYSTEM_DIR, "wiki");
/** Slug prefix keeping mirrored wiki pages out of the hand-authored docs' namespace. */
const WIKI_SLUG_PREFIX = "wiki-";
const DSL_SPEC_PATH = join(REPO_ROOT, "docs", "palace-dsl.md");

export function readDslSpec(): string {
  return readFileSync(DSL_SPEC_PATH, "utf8");
}

export type TheSystemDoc = { slug: string; title: string; path: string; origin: "lab" | "wiki" };

function readDocsFrom(dir: string, slugPrefix: string, origin: "lab" | "wiki"): TheSystemDoc[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return []; // wiki snapshot is optional — a fresh clone has not run the sync yet
  }
  return entries
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const path = join(dir, f);
      const slug = slugPrefix + basename(f, ".md").toLowerCase();
      const firstHeading = readFileSync(path, "utf8")
        .split("\n")
        .find((line) => line.startsWith("# "));
      return { slug, title: firstHeading?.slice(2).trim() || slug, path, origin };
    });
}

/**
 * Every markdown doc the server exposes: the lab's own hand-authored memory-science
 * docs in `theSystem/`, plus the mirrored wiki pages in `theSystem/wiki/` under a
 * `wiki-` slug prefix. Lab slugs are unchanged, so existing callers keep working.
 */
export function listTheSystemDocs(): TheSystemDoc[] {
  return [
    ...readDocsFrom(THE_SYSTEM_DIR, "", "lab"),
    ...readDocsFrom(WIKI_SNAPSHOT_DIR, WIKI_SLUG_PREFIX, "wiki"),
  ];
}

export function readTheSystemDoc(slug: string): { title: string; text: string } {
  const doc = listTheSystemDocs().find((d) => d.slug === slug.toLowerCase());
  if (!doc) {
    const known = listTheSystemDocs()
      .map((d) => d.slug)
      .join(", ");
    throw new Error(`No theSystem doc "${slug}". Known slugs: ${known}`);
  }
  return { title: doc.title, text: readFileSync(doc.path, "utf8") };
}

export function listPalaceDslResources(ctx: ServerContext) {
  return listPalaces(ctx.db).map((p) => ({
    palaceId: p.id,
    name: p.name,
    uri: `palace://${p.id}/dsl`,
  }));
}

export function readPalaceDsl(ctx: ServerContext, palaceId: string): string {
  const snapshot = loadPalace(ctx.db, palaceId);
  if (!snapshot) throw new Error(`Palace "${palaceId}" not found.`);
  return serializeDsl(snapshot);
}
