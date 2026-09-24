import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import type {
  AnalyticsEvent,
  AnalyticsEventGroup,
  AnalyticsEventType,
  CanvasObject,
  Locus,
  MemoryEdge,
  MemoryNode,
  MemoryRoute,
  Palace,
  PalacePortalRef,
  PalaceSnapshot,
} from "../../src/domain/entities/types";
import {
  decodeRouteSettings,
  decodeStopSettings,
  encodeRouteSettings,
  encodeStopSettings,
} from "../../src/domain/services/routeSettings";

/**
 * Direct-SQLite port of src-tauri/src/db.rs combined with the row↔domain
 * mapping from src/infrastructure/tauri/palaceRepositoryTauri.ts, so callers
 * deal only in domain types.
 */

const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS palaces (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    alias TEXT,
    atlas_path TEXT,
    editor_snapshot TEXT,
    deleted_at TEXT,
    purge_at TEXT,
    rev INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS sync_state (
    palace_id TEXT PRIMARY KEY NOT NULL,
    base_rev INTEGER NOT NULL DEFAULT 0,
    base_hash TEXT NOT NULL DEFAULT '',
    remote_rev INTEGER NOT NULL DEFAULT 0,
    remote_hash TEXT NOT NULL DEFAULT '',
    synced_at TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sync_tombstones (
    palace_id TEXT PRIMARY KEY NOT NULL,
    deleted_at TEXT NOT NULL,
    rev INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sync_foreign_ids (
    kind TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    PRIMARY KEY (kind, entity_id)
);

CREATE TABLE IF NOT EXISTS canvas_objects (
    id TEXT PRIMARY KEY NOT NULL,
    palace_id TEXT NOT NULL REFERENCES palaces(id) ON DELETE CASCADE,
    object_type TEXT NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL,
    width REAL NOT NULL,
    height REAL NOT NULL,
    z_index INTEGER NOT NULL DEFAULT 0,
    payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY NOT NULL,
    object_id TEXT NOT NULL REFERENCES canvas_objects(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '',
    alias TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    node_kind TEXT NOT NULL DEFAULT 'memory',
    node_meta_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY NOT NULL,
    object_id TEXT NOT NULL REFERENCES canvas_objects(id) ON DELETE CASCADE,
    source_node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    target_node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    alias TEXT NOT NULL DEFAULT '',
    cast_ab TEXT NOT NULL DEFAULT '',
    cast_cd TEXT NOT NULL DEFAULT '',
    cast_ef TEXT NOT NULL DEFAULT '',
    cast_gh TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY NOT NULL,
    palace_id TEXT NOT NULL REFERENCES palaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_index INTEGER NOT NULL DEFAULT 0,
    settings_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS loci (
    id TEXT PRIMARY KEY NOT NULL,
    route_id TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    interval INTEGER NOT NULL DEFAULT 1,
    ease_factor REAL NOT NULL DEFAULT 2.5,
    next_review_at TEXT,
    repetitions INTEGER NOT NULL DEFAULT 0,
    last_reviewed_at TEXT,
    settings_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT,
    palace_id TEXT REFERENCES palaces(id) ON DELETE SET NULL,
    route_id TEXT REFERENCES routes(id) ON DELETE SET NULL,
    node_id TEXT REFERENCES nodes(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_group TEXT NOT NULL,
    created_at TEXT NOT NULL,
    payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_canvas_palace ON canvas_objects(palace_id);
CREATE INDEX IF NOT EXISTS idx_nodes_object ON nodes(object_id);
CREATE INDEX IF NOT EXISTS idx_routes_palace ON routes(palace_id);
CREATE INDEX IF NOT EXISTS idx_loci_route ON loci(route_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_palace ON analytics_events(palace_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
`;

export function openDb(path: string): DatabaseSync {
  // FK enforcement stays OFF to match the app: rusqlite never re-enables it on
  // the per-command connections (PRAGMA foreign_keys is per-connection), and
  // the delete-and-reinsert save in save_snapshot relies on that — with FKs on,
  // ON DELETE SET NULL would wipe analytics node/route references on every save.
  const db = new DatabaseSync(path, { enableForeignKeyConstraints: false });
  db.exec("PRAGMA busy_timeout = 5000;");
  upgradeSchema(db);
  return db;
}

/**
 * Columns newer app versions add, applied here too so the server can read and write a
 * database the desktop app has not opened since it was updated. Mirrors db.rs; each ALTER is
 * skipped when the column (or, for a fresh file, the table) is not there to change.
 */
const COLUMN_UPGRADES = [
  "ALTER TABLE routes ADD COLUMN sort_index INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE routes ADD COLUMN settings_json TEXT NOT NULL DEFAULT '{}'",
  "ALTER TABLE loci ADD COLUMN settings_json TEXT NOT NULL DEFAULT '{}'",
  // Revision tracking for the sync vault. Every writer of this database bumps `rev`, so the
  // MCP server and the CLI must add the columns too — otherwise an edit made here would be
  // invisible to a sync run started from the app.
  "ALTER TABLE palaces ADD COLUMN rev INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE palaces ADD COLUMN updated_at TEXT",
  `CREATE TABLE IF NOT EXISTS sync_state (
    palace_id TEXT PRIMARY KEY NOT NULL,
    base_rev INTEGER NOT NULL DEFAULT 0,
    base_hash TEXT NOT NULL DEFAULT '',
    remote_rev INTEGER NOT NULL DEFAULT 0,
    remote_hash TEXT NOT NULL DEFAULT '',
    synced_at TEXT NOT NULL DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS sync_tombstones (
    palace_id TEXT PRIMARY KEY NOT NULL,
    deleted_at TEXT NOT NULL,
    rev INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS sync_foreign_ids (
    kind TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    PRIMARY KEY (kind, entity_id)
  )`,
];

export function upgradeSchema(db: DatabaseSync): void {
  for (const sql of COLUMN_UPGRADES) {
    try {
      db.exec(sql);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate column name|no such table/i.test(message)) throw error;
    }
  }
}

/** Creates the schema for fresh databases (tests). The app's DB already has it. */
export function initDb(db: DatabaseSync): void {
  db.exec(SCHEMA_SQL);
}

type Row = Record<string, unknown>;

function str(row: Row, key: string): string {
  return String(row[key] ?? "");
}

function optStr(row: Row, key: string): string | null {
  const v = row[key];
  return v === null || v === undefined ? null : String(v);
}

function num(row: Row, key: string): number {
  return Number(row[key] ?? 0);
}

function palaceFromRow(row: Row): Palace {
  return {
    id: str(row, "id"),
    name: str(row, "name"),
    createdAt: str(row, "created_at"),
    alias: optStr(row, "alias"),
    atlasPath: optStr(row, "atlas_path"),
    editorSnapshot: "editor_snapshot" in row ? optStr(row, "editor_snapshot") : null,
    deletedAt: optStr(row, "deleted_at"),
    purgeAt: optStr(row, "purge_at"),
    rev: typeof row.rev === "number" ? row.rev : 0,
    updatedAt: optStr(row, "updated_at"),
  };
}

function nodeFromRow(row: Row): MemoryNode {
  // Same node_meta_json decoding as fromInvoke in palaceRepositoryTauri.ts.
  let portal: PalacePortalRef | null = null;
  let imageUrl: string | null = null;
  const metaJson = optStr(row, "node_meta_json");
  if (metaJson) {
    try {
      const parsed = JSON.parse(metaJson) as Record<string, unknown>;
      if ("portal" in parsed) {
        portal = (parsed.portal ?? null) as PalacePortalRef | null;
        imageUrl = typeof parsed.imageUrl === "string" ? parsed.imageUrl : null;
      } else {
        portal = parsed as PalacePortalRef;
      }
    } catch {
      // ignore malformed json
    }
  }
  return {
    id: str(row, "id"),
    objectId: str(row, "object_id"),
    title: str(row, "title"),
    alias: str(row, "alias"),
    content: str(row, "content"),
    kind: str(row, "node_kind") === "portal" ? "portal" : "memory",
    portal,
    imageUrl,
  };
}

/**
 * Remember hard deletes before the rows go, mirroring record_tombstones in db.rs. Without a
 * tombstone the next sync pull cheerfully restores whatever the purge removed.
 */
export function purgeExpiredPalaces(db: DatabaseSync): void {
  const now = new Date().toISOString();
  const expired = "deleted_at IS NOT NULL AND purge_at IS NOT NULL AND purge_at <= ?";
  // The remote revision last agreed on, not the local one — see record_tombstones in db.rs.
  // `palaces.rev` is per-device, so comparing it against the vault's revision made purging
  // anything pulled from another device look like "edited elsewhere after the delete".
  const doomed = db
    .prepare(
      `SELECT p.id,
              COALESCE((SELECT s.remote_rev FROM sync_state s WHERE s.palace_id = p.id), p.rev) AS rev
       FROM palaces p WHERE ${expired}`,
    )
    .all(now) as Row[];
  for (const row of doomed) {
    db.prepare(
      `INSERT INTO sync_tombstones (palace_id, deleted_at, rev) VALUES (?, ?, ?)
       ON CONFLICT(palace_id) DO UPDATE SET deleted_at = excluded.deleted_at,
         rev = MAX(sync_tombstones.rev, excluded.rev)`,
    ).run(str(row, "id"), now, num(row, "rev"));
    db.prepare("DELETE FROM sync_state WHERE palace_id = ?").run(str(row, "id"));
  }
  db.prepare(`DELETE FROM palaces WHERE ${expired}`).run(now);
}

export function listPalaces(db: DatabaseSync): Palace[] {
  purgeExpiredPalaces(db);
  const rows = db
    .prepare(
      `SELECT id, name, created_at, alias, atlas_path, deleted_at, purge_at, rev, updated_at
       FROM palaces
       WHERE deleted_at IS NULL
       ORDER BY COALESCE(atlas_path, ''), created_at DESC`,
    )
    .all() as Row[];
  return rows.map(palaceFromRow);
}

export function listTrashedPalaces(db: DatabaseSync): Palace[] {
  purgeExpiredPalaces(db);
  const rows = db
    .prepare(
      `SELECT id, name, created_at, alias, atlas_path, deleted_at, purge_at, rev, updated_at
       FROM palaces
       WHERE deleted_at IS NOT NULL
       ORDER BY purge_at ASC, created_at DESC`,
    )
    .all() as Row[];
  return rows.map(palaceFromRow);
}

export function createPalace(
  db: DatabaseSync,
  name: string,
  atlasPath?: string | null,
): Palace {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(
    "INSERT INTO palaces (id, name, created_at, alias, atlas_path, deleted_at, purge_at, rev, updated_at) VALUES (?, ?, ?, NULL, ?, NULL, NULL, 1, ?)",
  ).run(id, name, createdAt, atlasPath ?? null, createdAt);
  return {
    id,
    name,
    createdAt,
    alias: null,
    atlasPath: atlasPath ?? null,
    editorSnapshot: null,
    deletedAt: null,
    purgeAt: null,
    rev: 1,
    updatedAt: createdAt,
  };
}

export function loadPalace(db: DatabaseSync, palaceId: string): PalaceSnapshot | null {
  purgeExpiredPalaces(db);
  const palaceRow = db
    .prepare(
      `SELECT id, name, created_at, alias, atlas_path, editor_snapshot, deleted_at, purge_at, rev, updated_at
       FROM palaces WHERE id = ? AND deleted_at IS NULL`,
    )
    .get(palaceId) as Row | undefined;
  if (!palaceRow) return null;

  const canvasObjects = (
    db
      .prepare(
        `SELECT id, palace_id, object_type, x, y, width, height, z_index, payload_json
         FROM canvas_objects WHERE palace_id = ?`,
      )
      .all(palaceId) as Row[]
  ).map(
    (r): CanvasObject => ({
      id: str(r, "id"),
      palaceId: str(r, "palace_id"),
      type: str(r, "object_type") as CanvasObject["type"],
      x: num(r, "x"),
      y: num(r, "y"),
      width: num(r, "width"),
      height: num(r, "height"),
      zIndex: num(r, "z_index"),
      payloadJson: str(r, "payload_json"),
    }),
  );

  const nodes = (
    db
      .prepare(
        `SELECT n.id, n.object_id, n.title, n.alias, n.content, n.node_kind, n.node_meta_json
         FROM nodes n
         INNER JOIN canvas_objects c ON c.id = n.object_id
         WHERE c.palace_id = ?`,
      )
      .all(palaceId) as Row[]
  ).map(nodeFromRow);

  const edges = (
    db
      .prepare(
        `SELECT e.id, e.object_id, e.source_node_id, e.target_node_id, e.alias,
                e.cast_ab, e.cast_cd, e.cast_ef, e.cast_gh
         FROM edges e
         INNER JOIN canvas_objects c ON c.id = e.object_id
         WHERE c.palace_id = ?`,
      )
      .all(palaceId) as Row[]
  ).map(
    (r): MemoryEdge => ({
      id: str(r, "id"),
      objectId: str(r, "object_id"),
      sourceNodeId: str(r, "source_node_id"),
      targetNodeId: str(r, "target_node_id"),
      alias: str(r, "alias"),
      castAb: str(r, "cast_ab"),
      castCd: str(r, "cast_cd"),
      castEf: str(r, "cast_ef"),
      castGh: str(r, "cast_gh"),
    }),
  );

  const routes = (
    db
      .prepare(
        "SELECT id, palace_id, name, settings_json FROM routes WHERE palace_id = ? ORDER BY sort_index, name",
      )
      .all(palaceId) as Row[]
  ).map(
    (r): MemoryRoute => ({
      id: str(r, "id"),
      palaceId: str(r, "palace_id"),
      name: str(r, "name"),
      ...decodeRouteSettings(optStr(r, "settings_json")),
    }),
  );

  const loci = (
    db
      .prepare(
        `SELECT l.id, l.route_id, l.node_id, l.order_index, l.label, l.interval, l.ease_factor,
                l.next_review_at, l.repetitions, l.last_reviewed_at, l.settings_json
         FROM loci l
         INNER JOIN routes r ON r.id = l.route_id
         WHERE r.palace_id = ?
         ORDER BY l.route_id, l.order_index`,
      )
      .all(palaceId) as Row[]
  ).map(
    (r): Locus => ({
      id: str(r, "id"),
      routeId: str(r, "route_id"),
      nodeId: str(r, "node_id"),
      orderIndex: num(r, "order_index"),
      label: str(r, "label"),
      interval: num(r, "interval"),
      easeFactor: num(r, "ease_factor"),
      nextReviewAt: optStr(r, "next_review_at") ?? undefined,
      repetitions: num(r, "repetitions"),
      lastReviewedAt: optStr(r, "last_reviewed_at"),
      ...decodeStopSettings(optStr(r, "settings_json")),
    }),
  );

  return { palace: palaceFromRow(palaceRow), canvasObjects, nodes, edges, routes, loci };
}

/**
 * Exact port of db.rs save_snapshot: update palace meta + blob, then
 * delete-all-and-reinsert every row of the palace.
 * Runs inside the caller's transaction when one is open.
 */
export function saveSnapshot(db: DatabaseSync, snap: PalaceSnapshot): void {
  const palaceId = snap.palace.id;

  // Upsert and bump, mirroring save_snapshot in src-tauri/src/db.rs. A plain UPDATE writes
  // nothing when the palace is not here yet, and with foreign keys off the child INSERTs
  // below would still land — orphaned rows belonging to no palace. `rev` always comes from
  // the stored row, never from the caller, so a snapshot cannot forge a revision.
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO palaces (id, name, created_at, alias, atlas_path, editor_snapshot, deleted_at, purge_at, rev, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, 1, ?)
     ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         alias = excluded.alias,
         atlas_path = excluded.atlas_path,
         editor_snapshot = excluded.editor_snapshot,
         rev = palaces.rev + 1,
         updated_at = excluded.updated_at`,
  ).run(
    palaceId,
    snap.palace.name,
    snap.palace.createdAt,
    snap.palace.alias ?? null,
    snap.palace.atlasPath ?? null,
    snap.palace.editorSnapshot ?? null,
    now,
  );

  db.prepare("DELETE FROM loci WHERE route_id IN (SELECT id FROM routes WHERE palace_id = ?)").run(
    palaceId,
  );
  db.prepare("DELETE FROM routes WHERE palace_id = ?").run(palaceId);
  db.prepare(
    "DELETE FROM edges WHERE object_id IN (SELECT id FROM canvas_objects WHERE palace_id = ?)",
  ).run(palaceId);
  db.prepare(
    "DELETE FROM nodes WHERE object_id IN (SELECT id FROM canvas_objects WHERE palace_id = ?)",
  ).run(palaceId);
  db.prepare("DELETE FROM canvas_objects WHERE palace_id = ?").run(palaceId);

  const insertObject = db.prepare(
    `INSERT INTO canvas_objects (id, palace_id, object_type, x, y, width, height, z_index, payload_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const c of snap.canvasObjects) {
    insertObject.run(c.id, c.palaceId, c.type, c.x, c.y, c.width, c.height, c.zIndex, c.payloadJson);
  }

  const insertNode = db.prepare(
    "INSERT INTO nodes (id, object_id, title, alias, content, node_kind, node_meta_json) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  for (const n of snap.nodes) {
    // Same node_meta_json encoding as toInvoke in palaceRepositoryTauri.ts.
    insertNode.run(
      n.id,
      n.objectId,
      n.title,
      n.alias ?? "",
      n.content,
      n.kind,
      JSON.stringify({ portal: n.portal ?? null, imageUrl: n.imageUrl ?? null }),
    );
  }

  const insertEdge = db.prepare(
    `INSERT INTO edges (id, object_id, source_node_id, target_node_id, alias, cast_ab, cast_cd, cast_ef, cast_gh)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const e of snap.edges) {
    insertEdge.run(
      e.id,
      e.objectId,
      e.sourceNodeId,
      e.targetNodeId,
      e.alias ?? "",
      e.castAb,
      e.castCd,
      e.castEf,
      e.castGh,
    );
  }

  const insertRoute = db.prepare(
    "INSERT INTO routes (id, palace_id, name, sort_index, settings_json) VALUES (?, ?, ?, ?, ?)",
  );
  snap.routes.forEach((r, sortIndex) => {
    insertRoute.run(r.id, r.palaceId, r.name, sortIndex, encodeRouteSettings(r));
  });

  const insertLocus = db.prepare(
    `INSERT INTO loci (id, route_id, node_id, order_index, label, interval, ease_factor, next_review_at, repetitions, last_reviewed_at, settings_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const l of snap.loci) {
    insertLocus.run(
      l.id,
      l.routeId,
      l.nodeId,
      l.orderIndex,
      l.label,
      l.interval ?? 1,
      l.easeFactor ?? 2.5,
      l.nextReviewAt ?? null,
      l.repetitions ?? 0,
      l.lastReviewedAt ?? null,
      encodeStopSettings(l),
    );
  }
}

export function softDeletePalace(db: DatabaseSync, palaceId: string): void {
  purgeExpiredPalaces(db);
  const deletedAt = new Date().toISOString();
  const purgeAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  // A delete is a change that has to reach the other devices, so it bumps `rev` like an edit.
  db.prepare(
    "UPDATE palaces SET deleted_at = ?, purge_at = ?, rev = rev + 1, updated_at = ? WHERE id = ?",
  ).run(deletedAt, purgeAt, deletedAt, palaceId);
}

export function restorePalace(db: DatabaseSync, palaceId: string): void {
  purgeExpiredPalaces(db);
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE palaces SET deleted_at = NULL, purge_at = NULL, rev = rev + 1, updated_at = ? WHERE id = ?",
  ).run(now, palaceId);
}

export function listAnalyticsEvents(
  db: DatabaseSync,
  options: { palaceId?: string; eventType?: string; limit?: number } = {},
): AnalyticsEvent[] {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (options.palaceId) {
    clauses.push("palace_id = ?");
    params.push(options.palaceId);
  }
  if (options.eventType) {
    clauses.push("event_type = ?");
    params.push(options.eventType);
  }
  let sql = `SELECT id, session_id, palace_id, route_id, node_id, event_type, event_group, created_at, payload_json
     FROM analytics_events`;
  if (clauses.length > 0) sql += ` WHERE ${clauses.join(" AND ")}`;
  sql += " ORDER BY created_at DESC";
  if (options.limit && options.limit > 0) {
    sql += " LIMIT ?";
    params.push(options.limit);
  }
  const rows = db.prepare(sql).all(...params) as Row[];
  return rows.map((r) => ({
    id: str(r, "id"),
    sessionId: optStr(r, "session_id"),
    palaceId: optStr(r, "palace_id"),
    routeId: optStr(r, "route_id"),
    nodeId: optStr(r, "node_id"),
    eventType: str(r, "event_type") as AnalyticsEventType,
    eventGroup: str(r, "event_group") as AnalyticsEventGroup,
    createdAt: str(r, "created_at"),
    payloadJson: str(r, "payload_json"),
  }));
}

export function appendAnalyticsEvents(db: DatabaseSync, events: AnalyticsEvent[]): void {
  const insert = db.prepare(
    `INSERT OR REPLACE INTO analytics_events
     (id, session_id, palace_id, route_id, node_id, event_type, event_group, created_at, payload_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const event of events) {
    insert.run(
      event.id,
      event.sessionId ?? null,
      event.palaceId ?? null,
      event.routeId ?? null,
      event.nodeId ?? null,
      event.eventType,
      event.eventGroup,
      event.createdAt,
      event.payloadJson,
    );
  }
}

/** Resolve a palace by id, exact name, or alias (non-deleted only). */
export function resolvePalace(db: DatabaseSync, ref: string): Palace {
  const byId = db
    .prepare(
      `SELECT id, name, created_at, alias, atlas_path, deleted_at, purge_at, rev, updated_at
       FROM palaces WHERE id = ? AND deleted_at IS NULL`,
    )
    .get(ref) as Row | undefined;
  if (byId) return palaceFromRow(byId);

  const matches = db
    .prepare(
      `SELECT id, name, created_at, alias, atlas_path, deleted_at, purge_at, rev, updated_at
       FROM palaces
       WHERE deleted_at IS NULL AND (name = ? COLLATE NOCASE OR alias = ? COLLATE NOCASE)`,
    )
    .all(ref, ref) as Row[];
  if (matches.length === 1) return palaceFromRow(matches[0]!);
  if (matches.length > 1) {
    const ids = matches.map((m) => `"${str(m, "name")}" (${str(m, "id")})`).join(", ");
    throw new Error(`Palace reference "${ref}" is ambiguous between: ${ids}. Use the id.`);
  }
  throw new Error(`No palace found matching "${ref}" (tried id, name, alias).`);
}
