import { createAnalyticsEvent } from "../../../src/domain/services/analyticsService";
import { serializeDsl } from "../../../src/domain/services/palaceDsl/serializer";
import {
  appendAnalyticsEvents,
  createPalace,
  listPalaces,
  listTrashedPalaces,
  loadPalace,
  resolvePalace,
  restorePalace,
  softDeletePalace,
} from "../palaceDb";
import { MCP_SESSION_ID, withPalaceMutation } from "../palaceWriter";
import { writeSentinel } from "../sentinel";
import type { ServerContext } from "./shared";
import { snapshotStats } from "./shared";

export function palaceList(ctx: ServerContext, args: { includeTrashed?: boolean }) {
  const palaces = listPalaces(ctx.db).map((p) => ({
    id: p.id,
    name: p.name,
    alias: p.alias ?? undefined,
    atlasPath: p.atlasPath ?? undefined,
    createdAt: p.createdAt,
  }));
  if (!args.includeTrashed) return { palaces };
  const trashed = listTrashedPalaces(ctx.db).map((p) => ({
    id: p.id,
    name: p.name,
    deletedAt: p.deletedAt,
    purgeAt: p.purgeAt,
  }));
  return { palaces, trashed };
}

export function palaceGet(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  return {
    id: palace.id,
    name: palace.name,
    alias: palace.alias ?? undefined,
    atlasPath: palace.atlasPath ?? undefined,
    createdAt: palace.createdAt,
    ...snapshotStats(snapshot),
    routes: snapshot.routes.map((r) => ({ id: r.id, name: r.name })),
  };
}

export function palaceExportDsl(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  return { dsl: serializeDsl(snapshot) };
}

export function palaceExportJson(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  // Same bundle shape as the app's palace_export_json Tauri command.
  return { version: 1, snapshot };
}

export function palaceCreate(ctx: ServerContext, args: { name: string; atlasPath?: string }) {
  const palace = createPalace(ctx.db, args.name.trim() || "Untitled palace", args.atlasPath?.trim() || null);
  appendAnalyticsEvents(ctx.db, [
    createAnalyticsEvent({
      eventType: "palace_created",
      eventGroup: "palace",
      sessionId: MCP_SESSION_ID,
      palaceId: palace.id,
      payload: { name: palace.name, source: "mcp" },
    }),
  ]);
  writeSentinel(ctx.sentinelDir, { palaceId: palace.id, op: "palace_create" });
  return { id: palace.id, name: palace.name, atlasPath: palace.atlasPath ?? undefined };
}

export async function palaceUpdateMeta(
  ctx: ServerContext,
  args: { palace: string; name?: string; alias?: string | null; atlasPath?: string | null },
) {
  const { snapshot } = await withPalaceMutation(
    ctx.db,
    ctx.sentinelDir,
    args.palace,
    "palace_update_meta",
    (m) => {
      if (args.name !== undefined) m.palace.name = args.name.trim() || m.palace.name;
      if (args.alias !== undefined) m.palace.alias = args.alias?.trim() || null;
      if (args.atlasPath !== undefined) m.palace.atlasPath = args.atlasPath?.trim() || null;
      m.recordEvent("palace_saved", "palace", { payload: { action: "update_meta" } });
    },
  );
  return {
    id: snapshot.palace.id,
    name: snapshot.palace.name,
    alias: snapshot.palace.alias ?? undefined,
    atlasPath: snapshot.palace.atlasPath ?? undefined,
  };
}

export function palaceDelete(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  softDeletePalace(ctx.db, palace.id);
  appendAnalyticsEvents(ctx.db, [
    createAnalyticsEvent({
      eventType: "palace_deleted",
      eventGroup: "palace",
      sessionId: MCP_SESSION_ID,
      palaceId: palace.id,
      payload: { source: "mcp" },
    }),
  ]);
  writeSentinel(ctx.sentinelDir, { palaceId: palace.id, op: "palace_delete" });
  return { id: palace.id, name: palace.name, deleted: true, note: "Soft-deleted; restorable for 30 days." };
}

export function palaceRestore(ctx: ServerContext, args: { palace: string }) {
  // resolvePalace only sees live palaces, so look in the trash by id or name.
  const trashed = listTrashedPalaces(ctx.db);
  const match =
    trashed.find((p) => p.id === args.palace) ??
    trashed.find((p) => p.name.toLowerCase() === args.palace.toLowerCase());
  if (!match) throw new Error(`No trashed palace matching "${args.palace}".`);
  restorePalace(ctx.db, match.id);
  appendAnalyticsEvents(ctx.db, [
    createAnalyticsEvent({
      eventType: "palace_restored",
      eventGroup: "palace",
      sessionId: MCP_SESSION_ID,
      palaceId: match.id,
      payload: { source: "mcp" },
    }),
  ]);
  writeSentinel(ctx.sentinelDir, { palaceId: match.id, op: "palace_restore" });
  return { id: match.id, name: match.name, restored: true };
}
