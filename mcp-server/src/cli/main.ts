import { readFileSync } from "node:fs";
import { assertDbExists, resolveDbPath, sentinelDirFor } from "../dbPath";
import { initDb, openDb } from "../palaceDb";
import type { ServerContext } from "../tools/shared";
import { runCli } from "./commands";

/**
 * `palace` CLI entry point. Run via `npm run palace -- <command>`, the
 * `bin/palace` wrapper, or `npx tsx mcp-server/src/cli/main.ts`.
 * All behaviour lives in commands.ts so tests can drive it in-process.
 */

const VERSION: string = JSON.parse(
  readFileSync(new URL("../../../package.json", import.meta.url), "utf8"),
).version;

function openContext(dbOverride?: string): ServerContext {
  if (dbOverride) process.env.MEMORY_PALACE_DB = dbOverride;
  const dbPath = resolveDbPath();
  // Same rule as the MCP server: the app's own DB must already exist, an
  // explicit override path is created with the schema if missing.
  if (!process.env.MEMORY_PALACE_DB) assertDbExists(dbPath);
  const db = openDb(dbPath);
  initDb(db);
  return { db, sentinelDir: sentinelDirFor(dbPath) };
}

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  let text = "";
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

function flush(stream: NodeJS.WriteStream, chunk: string): Promise<void> {
  return new Promise((resolve) => {
    if (!chunk) return resolve();
    stream.write(chunk, () => resolve());
  });
}

const result = await runCli(process.argv.slice(2), { openContext, readStdin, version: VERSION });
await flush(process.stdout, result.stdout);
await flush(process.stderr, result.stderr);
// The canvas/domain modules shared with the app keep handles open after
// import (the MCP server runs forever, so it never notices). A CLI must exit
// on its own, so exit explicitly once output has been flushed.
process.exit(result.code);
