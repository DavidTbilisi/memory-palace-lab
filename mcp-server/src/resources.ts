import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serializeDsl } from "../../src/domain/services/palaceDsl/serializer";
import { listPalaces, loadPalace } from "./palaceDb";
import type { ServerContext } from "./tools/shared";

/** Repo root (mcp-server/src → two levels up). */
export const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));

const THE_SYSTEM_DIR = join(REPO_ROOT, "theSystem");
const DSL_SPEC_PATH = join(REPO_ROOT, "docs", "palace-dsl.md");

export function readDslSpec(): string {
  return readFileSync(DSL_SPEC_PATH, "utf8");
}

export type TheSystemDoc = { slug: string; title: string; path: string };

export function listTheSystemDocs(): TheSystemDoc[] {
  return readdirSync(THE_SYSTEM_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const path = join(THE_SYSTEM_DIR, f);
      const slug = basename(f, ".md").toLowerCase();
      const firstHeading = readFileSync(path, "utf8")
        .split("\n")
        .find((line) => line.startsWith("# "));
      return { slug, title: firstHeading?.slice(2).trim() || slug, path };
    });
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
