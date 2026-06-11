import { randomUUID } from "node:crypto";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const SENTINEL_FILE_NAME = "mcp-sync.json";

let seq = 0;

/**
 * Atomically write the live-refresh sentinel the desktop app watches
 * (src/app/useExternalMcpSync.ts). Temp-file + rename so the watcher never
 * sees a half-written JSON.
 */
export function writeSentinel(dir: string, info: { palaceId: string | null; op: string }): void {
  seq += 1;
  const payload = JSON.stringify({
    seq,
    writerId: WRITER_ID,
    palaceId: info.palaceId,
    op: info.op,
    mutatedAt: new Date().toISOString(),
  });
  mkdirSync(dir, { recursive: true });
  const tmp = join(dir, `.${SENTINEL_FILE_NAME}.${process.pid}.tmp`);
  writeFileSync(tmp, payload, "utf8");
  renameSync(tmp, join(dir, SENTINEL_FILE_NAME));
}

/** Distinguishes writers so the app can dedupe (seq alone resets per process). */
const WRITER_ID = randomUUID();
