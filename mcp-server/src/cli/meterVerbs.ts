import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import type { AnalyticsEvent } from "../../../src/domain/entities/types";
import { parseAnalyticsPayload } from "../../../src/domain/services/analyticsService";
import { listAnalyticsEvents, listPalaces, listTrashedPalaces } from "../palaceDb";

/**
 * METER bridge (docs/backlog/10-meter-event-bridge.feature): mirror the app's
 * analytics rows into METER's append-only events.jsonl so palace work shows
 * up in the same Daily Glance / Weekly Review as Anki reviews and everything
 * else in Neural OS. The schema is `meter.schema.Event` in
 * Neural-OS-Research/tools/meter; the conventions (hit/miss metric types,
 * a separate latency_ms event, context.topic for the per-topic roll-up)
 * mirror the Anki bridge in tools/meter-anki-addon so METER's stats code
 * needs no changes to read these.
 */

export const METER_SOURCE = "memory-palace-lab";
/** `mode` on walk events; shows up as its own line in METER's per-mode breakdown. */
export const PALACE_WALK_MODE = "palace::walk";

export interface MeterEvent {
  layer: "encoding" | "performance";
  operation: string;
  metric_type: string;
  metric_value: number | string;
  event_id: string;
  timestamp: string;
  session_id: string | null;
  artifact_id: string | null;
  mode: string | null;
  context: Record<string, unknown>;
}

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

// ── mapping ──────────────────────────────────────────────────────────

/** METER writes `+00:00`, and Python < 3.11 cannot parse a trailing `Z`. */
export function toMeterTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace("Z", "+00:00");
}

/** Deterministic UUID-shaped id for a secondary event derived from an app event. */
export function derivedEventId(appEventId: string, suffix: string): string {
  const hex = createHash("sha256").update(`${appEventId}:${suffix}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/** Anki convention, mirrored: Again is a miss; Hard, Good, Easy are hits. */
const RATING_IS_HIT: Record<string, boolean> = { again: false, hard: true, good: true, easy: true };
const RATING_EASE: Record<string, number> = { again: 1, hard: 2, good: 3, easy: 4 };

type Mapper = (
  event: AnalyticsEvent,
  payload: Record<string, unknown>,
  ctx: Record<string, unknown>,
) => MeterEvent[];

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function build(
  event: AnalyticsEvent,
  fields: Pick<MeterEvent, "layer" | "operation" | "metric_type" | "metric_value" | "artifact_id" | "mode">,
  context: Record<string, unknown>,
  eventId = event.id,
): MeterEvent {
  // Key order matches meter.schema.Event so the lines read like METER's own.
  return {
    layer: fields.layer,
    operation: fields.operation,
    metric_type: fields.metric_type,
    metric_value: fields.metric_value,
    event_id: eventId,
    timestamp: toMeterTimestamp(event.createdAt),
    session_id: event.sessionId ?? null,
    artifact_id: fields.artifact_id,
    mode: fields.mode,
    context,
  };
}

function encodeEvent(metricType: string, artifact: (e: AnalyticsEvent) => string | null): Mapper {
  return (event, _payload, ctx) => [
    build(
      event,
      {
        layer: "encoding",
        operation: "encode",
        metric_type: metricType,
        metric_value: 1,
        artifact_id: artifact(event),
        mode: null,
      },
      ctx,
    ),
  ];
}

/**
 * App event type → METER events. Anything not listed is skipped and counted,
 * so the summary shows what the mapping leaves out. Chatty state events
 * (opened, saved, draft autosave, walk step/reveal/close) are left out on
 * purpose: METER wants signal, not a UI trace.
 */
export const APP_EVENT_MAPPERS: Partial<Record<AnalyticsEvent["eventType"], Mapper>> = {
  walk_recall_rated: (event, payload, ctx) => {
    const rating = typeof payload.rating === "string" ? payload.rating : "";
    if (!(rating in RATING_IS_HIT)) return [];
    const hit = RATING_IS_HIT[rating]!;
    const latencyMs = num(payload.timeToRevealMs);
    const context = { ...ctx, ease: RATING_EASE[rating], ...(latencyMs !== null ? { latency_ms: latencyMs } : {}) };
    const common = { layer: "performance" as const, operation: "review", artifact_id: event.nodeId ?? null, mode: PALACE_WALK_MODE };
    const out = [build(event, { ...common, metric_type: hit ? "hit" : "miss", metric_value: hit ? 1 : 0 }, context)];
    if (latencyMs !== null && latencyMs >= 0) {
      out.push(
        build(
          event,
          { ...common, metric_type: "latency_ms", metric_value: Math.round(latencyMs) },
          context,
          derivedEventId(event.id, "latency_ms"),
        ),
      );
    }
    return out;
  },
  walk_started: (event, payload, ctx) => [
    build(
      event,
      {
        layer: "performance",
        operation: "review",
        metric_type: "walk.started",
        metric_value: num(payload.routeLength) ?? 1,
        artifact_id: event.routeId ?? null,
        mode: PALACE_WALK_MODE,
      },
      ctx,
    ),
  ],
  walk_completed: (event, payload, ctx) => [
    build(
      event,
      {
        layer: "performance",
        operation: "review",
        metric_type: "walk.completed",
        metric_value: num(payload.reviewedCount) ?? 1,
        artifact_id: event.routeId ?? null,
        mode: PALACE_WALK_MODE,
      },
      ctx,
    ),
  ],
  palace_created: encodeEvent("palace.created", (e) => e.palaceId ?? null),
  node_created: encodeEvent("palace.node_created", (e) => e.nodeId ?? null),
  edge_created: encodeEvent("palace.edge_created", (e) => e.nodeId ?? null),
  route_created: encodeEvent("palace.route_created", (e) => e.routeId ?? null),
  system_run_materialized: encodeEvent("palace.system_run_materialized", (e) => e.palaceId ?? null),
};

export function mapAppEvent(event: AnalyticsEvent, palaceName: string | null): MeterEvent[] {
  const mapper = APP_EVENT_MAPPERS[event.eventType];
  if (!mapper) return [];
  const payload = parseAnalyticsPayload(event);
  const ctx: Record<string, unknown> = {
    source: METER_SOURCE,
    app_event_id: event.id,
    app_event_type: event.eventType,
    palace_id: event.palaceId ?? null,
    route_id: event.routeId ?? null,
    ...(palaceName ? { topic: palaceName } : {}),
    payload,
  };
  return mapper(event, payload, ctx);
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

export function backfillMeter(opts: {
  db: DatabaseSync;
  dataDir: string;
  palaceId?: string;
  dryRun: boolean;
}): BackfillSummary {
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
    const mapped = mapAppEvent(event, names.get(event.palaceId ?? "") ?? null);
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
