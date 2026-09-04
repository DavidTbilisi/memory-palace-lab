import type { AnalyticsEvent } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";

/**
 * METER bridge mapping: app analytics rows → METER events (backlog item 10).
 *
 * Shared by the desktop app's live bridge (src/infrastructure/meterBridge.ts)
 * and the CLI's `palace meter backfill` (mcp-server/src/cli/meterVerbs.ts),
 * so both write byte-identical lines with the same deterministic ids and
 * never duplicate each other. The schema is `meter.schema.Event` in
 * Neural-OS-Research/tools/meter; the conventions (hit/miss metric types, a
 * separate latency_ms event, context.topic for the per-topic roll-up) mirror
 * the Anki bridge in tools/meter-anki-addon so METER's stats code needs no
 * changes to read these. Browser-safe: Web Crypto only, no Node imports.
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

/** METER writes `+00:00`, and Python < 3.11 cannot parse a trailing `Z`. */
export function toMeterTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace("Z", "+00:00");
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Deterministic UUID-shaped id for a secondary event derived from an app event. */
export async function derivedEventId(appEventId: string, suffix: string): Promise<string> {
  const hex = (await sha256Hex(`${appEventId}:${suffix}`)).slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/** Anki convention, mirrored: Again is a miss; Hard, Good, Easy are hits. */
const RATING_IS_HIT: Record<string, boolean> = { again: false, hard: true, good: true, easy: true };
const RATING_EASE: Record<string, number> = { again: 1, hard: 2, good: 3, easy: 4 };

type Mapper = (
  event: AnalyticsEvent,
  payload: Record<string, unknown>,
  ctx: Record<string, unknown>,
) => Promise<MeterEvent[]>;

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
  return async (event, _payload, ctx) => [
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
 * so the backfill summary shows what the mapping leaves out. Chatty state
 * events (opened, saved, draft autosave, walk step/reveal/close) are left out
 * on purpose: METER wants signal, not a UI trace.
 */
export const APP_EVENT_MAPPERS: Partial<Record<AnalyticsEvent["eventType"], Mapper>> = {
  walk_recall_rated: async (event, payload, ctx) => {
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
          await derivedEventId(event.id, "latency_ms"),
        ),
      );
    }
    return out;
  },
  walk_started: async (event, payload, ctx) => [
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
  walk_completed: async (event, payload, ctx) => [
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

export function hasMeterMapping(eventType: AnalyticsEvent["eventType"]): boolean {
  return eventType in APP_EVENT_MAPPERS;
}

export async function mapAppEvent(event: AnalyticsEvent, palaceName: string | null): Promise<MeterEvent[]> {
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
