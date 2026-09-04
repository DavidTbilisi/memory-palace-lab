import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import {
  createAnalyticsEvent,
  type AnalyticsPayload,
} from "../../src/domain/services/analyticsService";
import type {
  AnalyticsEvent,
  AnalyticsEventGroup,
  AnalyticsEventType,
  Locus,
  MemoryRoute,
  Palace,
  PalaceSnapshot,
} from "../../src/domain/entities/types";
import { buildRowsFromShapes } from "./buildRowsFromShapes";
import { appendAnalyticsEvents, loadPalace, resolvePalace, saveSnapshot } from "./palaceDb";
import { writeSentinel } from "./sentinel";
import { createBaselineSnapshotJson, SnapshotEditor } from "./snapshotEditor";

/** One session id per headless process (MCP server or CLI); lands on every analytics event. */
export const MCP_SESSION_ID = randomUUID();

export type WriterSource = "mcp" | "cli";
let writerSource: WriterSource = "mcp";

/**
 * Which headless surface this process is. Every analytics payload written
 * through the shared tools carries it as `source`, so app users can audit
 * where an external edit came from (docs/mcp.md, docs/cli.md).
 */
export function setWriterSource(source: WriterSource): void {
  writerSource = source;
}

export function getWriterSource(): WriterSource {
  return writerSource;
}

export type MutationContext = {
  /** Palace meta — mutate name/alias/atlasPath in place to update them. */
  palace: Palace;
  /** The domain snapshot as loaded (read-only reference data). */
  snapshot: PalaceSnapshot;
  /** Headless editor over the canvas blob — all node/edge mutations go here. */
  editor: SnapshotEditor;
  /** Routes/loci — replace or mutate; persisted as-is (not canvas shapes). */
  routes: MemoryRoute[];
  loci: Locus[];
  /** Queue an analytics event (source:"mcp" is added automatically). */
  recordEvent: (
    eventType: AnalyticsEventType,
    eventGroup: AnalyticsEventGroup,
    extra?: { routeId?: string | null; nodeId?: string | null; payload?: AnalyticsPayload },
  ) => void;
};

/**
 * Shared mutation pipeline. Loads the palace inside an immediate transaction,
 * runs the mutation against a SnapshotEditor over the canvas blob, re-derives
 * the row projection from the shapes (the rows are *always* a function of the
 * blob — see buildPalaceSnapshot.ts), saves with the app's delete-and-reinsert
 * semantics, appends analytics, commits, and signals the running app.
 */
export async function withPalaceMutation<T>(
  db: DatabaseSync,
  sentinelDir: string,
  palaceRef: string,
  op: string,
  fn: (ctx: MutationContext) => T,
): Promise<{ result: T; snapshot: PalaceSnapshot }> {
  const palaceRow = resolvePalace(db, palaceRef);
  const loaded = loadPalace(db, palaceRow.id);
  if (!loaded) throw new Error(`Palace "${palaceRef}" not found.`);
  // The baseline import is async; resolve it before opening the transaction.
  const baseline = loaded.palace.editorSnapshot ?? (await createBaselineSnapshotJson());

  // Parse the canvas blob before opening the transaction so a corrupt
  // editor_snapshot produces an actionable error instead of a JSON stack.
  let parsedEditor: SnapshotEditor;
  try {
    parsedEditor = new SnapshotEditor(baseline);
  } catch (error) {
    throw new Error(
      `Palace "${loaded.palace.name}" (${loaded.palace.id}) has a corrupt canvas snapshot ` +
        `(editor_snapshot): ${error instanceof Error ? error.message : String(error)}. ` +
        `Open and re-save it in the app, or export/import it to repair.`,
      { cause: error },
    );
  }

  db.exec("BEGIN IMMEDIATE");
  try {
    const editor = parsedEditor;
    const events: AnalyticsEvent[] = [];
    const ctx: MutationContext = {
      palace: { ...loaded.palace },
      snapshot: loaded,
      editor,
      routes: loaded.routes.map((r) => ({ ...r })),
      loci: loaded.loci.map((l) => ({ ...l })),
      recordEvent: (eventType, eventGroup, extra = {}) => {
        events.push(
          createAnalyticsEvent({
            eventType,
            eventGroup,
            sessionId: MCP_SESSION_ID,
            palaceId: loaded.palace.id,
            routeId: extra.routeId ?? null,
            nodeId: extra.nodeId ?? null,
            payload: { ...(extra.payload ?? {}), source: getWriterSource() },
          }),
        );
      },
    };

    const result = fn(ctx);

    // Drop loci whose node no longer exists on the canvas (node deletes cascade).
    const liveNodeIds = new Set<string>();
    for (const shapeId of editor.getCurrentPageShapeIds()) {
      const nodeId = editor.getShape(shapeId)?.meta?.mpNodeId;
      if (nodeId) liveNodeIds.add(String(nodeId));
    }
    const loci = ctx.loci.filter((l) => liveNodeIds.has(l.nodeId));

    const next = buildRowsFromShapes(editor, ctx.palace, ctx.routes, loci);
    saveSnapshot(db, next);
    if (events.length > 0) appendAnalyticsEvents(db, events);
    db.exec("COMMIT");

    writeSentinel(sentinelDir, { palaceId: loaded.palace.id, op });
    return { result, snapshot: next };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
