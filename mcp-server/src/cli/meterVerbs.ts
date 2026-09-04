import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { mapAppEvent, type MeterEvent } from "../../../src/domain/services/meterBridge";
import { listAnalyticsEvents, listPalaces, listTrashedPalaces } from "../palaceDb";

/**
 * `palace meter backfill` (docs/backlog/10-meter-event-bridge.feature):
 * mirror the app's analytics rows into METER's append-only events.jsonl so
 * palace work shows up in the same Daily Glance / Weekly Review as Anki
 * reviews. The mapping itself lives in src/domain/services/meterBridge.ts,
 * shared with the desktop app's live bridge, so the two write identical
 * lines and never duplicate each other.
 */

export { METER_SOURCE, PALACE_WALK_MODE } from "../../../src/domain/services/meterBridge";

// ── data directory ───────────────────────────────────────────────────

export type DataDirSource = "flag" | "env" | "project" | "home";

function isDir(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function expandHome(path: string, home: string): string {
  return path === "~" ? home : path.startsWith("~/") ? join(home, path.slice(2)) : path;
}

/**
 * Same precedence as the meter CLI (tools/meter/meter/storage.py):
 * explicit flag, then $METER_DATA_DIR, then <project root>/meter-data where
 * the project root is the first ancestor of cwd containing wiki/ or .git/,
 * then ~/.neural-os/meter.
 */
export function resolveMeterDataDir(opts: {
  flag?: string;
  env?: string;
  cwd: string;
  home: string;
}): { dir: string; via: DataDirSource } {
  if (opts.flag) return { dir: resolve(expandHome(opts.flag, opts.home)), via: "flag" };
  if (opts.env) return { dir: resolve(expandHome(opts.env, opts.home)), via: "env" };
  let dir = resolve(opts.cwd);
  for (;;) {
    if (isDir(join(dir, "wiki")) || isDir(join(dir, ".git"))) {
      return { dir: join(dir, "meter-data"), via: "project" };
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return { dir: join(opts.home, ".neural-os", "meter"), via: "home" };
}

// ── backfill ─────────────────────────────────────────────────────────

/** event_ids already in the log; corrupt lines are skipped like METER's reader does. */
export function loadEmittedEventIds(text: string): Set<string> {
  const ids = new Set<string>();
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    try {
      const parsed = JSON.parse(line) as { event_id?: unknown };
      if (typeof parsed.event_id === "string") ids.add(parsed.event_id);
    } catch {
      continue;
    }
  }
  return ids;
}

export interface BackfillSummary {
  dataDir: string;
  eventsPath: string;
  dryRun: boolean;
  scanned: number;
  appended: number;
  appendedByMetric: Record<string, number>;
  alreadyPresent: number;
  skippedByType: Record<string, number>;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

function bump(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

export async function backfillMeter(opts: {
  db: DatabaseSync;
  dataDir: string;
  palaceId?: string;
  dryRun: boolean;
}): Promise<BackfillSummary> {
  const names = new Map<string, string>();
  for (const p of [...listPalaces(opts.db), ...listTrashedPalaces(opts.db)]) names.set(p.id, p.name);

  // Newest-first from the DB; METER wants the log in the order things happened.
  const events = listAnalyticsEvents(opts.db, { palaceId: opts.palaceId })
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));

  const eventsPath = join(opts.dataDir, "events.jsonl");
  const existingText = existsSync(eventsPath) ? readFileSync(eventsPath, "utf8") : "";
  const emitted = loadEmittedEventIds(existingText);

  const toAppend: MeterEvent[] = [];
  const appendedByMetric: Record<string, number> = {};
  const skippedByType: Record<string, number> = {};
  let alreadyPresent = 0;
  for (const event of events) {
    const mapped = await mapAppEvent(event, names.get(event.palaceId ?? "") ?? null);
    if (mapped.length === 0) {
      bump(skippedByType, event.eventType);
      continue;
    }
    for (const m of mapped) {
      if (emitted.has(m.event_id)) {
        alreadyPresent += 1;
        continue;
      }
      emitted.add(m.event_id);
      toAppend.push(m);
      bump(appendedByMetric, m.metric_type);
    }
  }

  if (!opts.dryRun && toAppend.length > 0) {
    mkdirSync(opts.dataDir, { recursive: true });
    // Append only, one JSON object per line, like meter.storage.Storage.append.
    const lead = existingText.length > 0 && !existingText.endsWith("\n") ? "\n" : "";
    appendFileSync(eventsPath, `${lead}${toAppend.map((m) => JSON.stringify(m)).join("\n")}\n`, "utf8");
  }

  return {
    dataDir: opts.dataDir,
    eventsPath,
    dryRun: opts.dryRun,
    scanned: events.length,
    appended: toAppend.length,
    appendedByMetric,
    alreadyPresent,
    skippedByType,
    firstTimestamp: toAppend[0]?.timestamp ?? null,
    lastTimestamp: toAppend[toAppend.length - 1]?.timestamp ?? null,
  };
}

export function renderBackfillSummary(summary: BackfillSummary & { dataDirVia: DataDirSource }): string {
  const via = {
    flag: "--data-dir",
    env: "$METER_DATA_DIR",
    project: "project root, like the meter CLI",
    home: "~/.neural-os/meter fallback",
  }[summary.dataDirVia];
  const counts = (record: Record<string, number>) =>
    Object.entries(record)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v}`)
      .join(", ") || "none";
  const lines = [
    `METER backfill${summary.dryRun ? " (dry run: nothing written)" : ""}`,
    `  log:              ${summary.eventsPath}  (${via})`,
    `  app events:       ${summary.scanned} scanned`,
    `  appended:         ${summary.appended}  ${counts(summary.appendedByMetric)}`,
    `  already present:  ${summary.alreadyPresent}`,
    `  no METER mapping: ${counts(summary.skippedByType)}`,
  ];
  if (summary.firstTimestamp) {
    lines.push(`  range:            ${summary.firstTimestamp} to ${summary.lastTimestamp}`);
  }
  return `${lines.join("\n")}\n`;
}
