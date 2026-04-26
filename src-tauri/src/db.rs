use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PalaceDto {
    pub id: String,
    pub name: String,
    pub created_at: String,
    #[serde(default)]
    pub atlas_path: Option<String>,
    #[serde(default)]
    pub editor_snapshot: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CanvasObjectDto {
    pub id: String,
    pub palace_id: String,
    #[serde(rename = "type")]
    pub object_type: String,
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    pub z_index: i64,
    pub payload_json: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NodeDto {
    pub id: String,
    pub object_id: String,
    pub title: String,
    pub content: String,
    #[serde(default = "default_node_kind")]
    pub node_kind: String,
    #[serde(default = "default_node_meta_json")]
    pub node_meta_json: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EdgeDto {
    pub id: String,
    pub object_id: String,
    pub source_node_id: String,
    pub target_node_id: String,
    pub cast_ab: String,
    pub cast_cd: String,
    pub cast_ef: String,
    pub cast_gh: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RouteDto {
    pub id: String,
    pub palace_id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LocusDto {
    pub id: String,
    pub route_id: String,
    pub node_id: String,
    pub order_index: i64,
    #[serde(default)]
    pub label: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AnalyticsEventDto {
    pub id: String,
    #[serde(default)]
    pub session_id: Option<String>,
    #[serde(default)]
    pub palace_id: Option<String>,
    #[serde(default)]
    pub route_id: Option<String>,
    #[serde(default)]
    pub node_id: Option<String>,
    pub event_type: String,
    pub event_group: String,
    pub created_at: String,
    #[serde(default = "default_payload_json")]
    pub payload_json: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PalaceSnapshot {
    pub palace: PalaceDto,
    pub canvas_objects: Vec<CanvasObjectDto>,
    pub nodes: Vec<NodeDto>,
    pub edges: Vec<EdgeDto>,
    pub routes: Vec<RouteDto>,
    pub loci: Vec<LocusDto>,
}

fn default_node_kind() -> String {
    "memory".to_string()
}

fn default_node_meta_json() -> String {
    "{}".to_string()
}

fn default_payload_json() -> String {
    "{}".to_string()
}

pub fn init_db(path: &Path) -> rusqlite::Result<()> {
    let conn = Connection::open(path)?;
    conn.execute_batch(
        r#"
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS palaces (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            atlas_path TEXT,
            editor_snapshot TEXT
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
            content TEXT NOT NULL DEFAULT '',
            node_kind TEXT NOT NULL DEFAULT 'memory',
            node_meta_json TEXT NOT NULL DEFAULT '{}'
        );

        CREATE TABLE IF NOT EXISTS edges (
            id TEXT PRIMARY KEY NOT NULL,
            object_id TEXT NOT NULL REFERENCES canvas_objects(id) ON DELETE CASCADE,
            source_node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
            target_node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
            cast_ab TEXT NOT NULL DEFAULT '',
            cast_cd TEXT NOT NULL DEFAULT '',
            cast_ef TEXT NOT NULL DEFAULT '',
            cast_gh TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS routes (
            id TEXT PRIMARY KEY NOT NULL,
            palace_id TEXT NOT NULL REFERENCES palaces(id) ON DELETE CASCADE,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS loci (
            id TEXT PRIMARY KEY NOT NULL,
            route_id TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
            node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
            order_index INTEGER NOT NULL,
            label TEXT NOT NULL DEFAULT ''
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
        "#,
    )?;
    // Lightweight migration for existing DBs created before locus labels.
    if let Err(err) = conn.execute("ALTER TABLE loci ADD COLUMN label TEXT NOT NULL DEFAULT ''", []) {
        match err {
            rusqlite::Error::SqliteFailure(_, Some(msg)) if msg.contains("duplicate column name") => {}
            _ => return Err(err),
        }
    }
    if let Err(err) = conn.execute("ALTER TABLE palaces ADD COLUMN atlas_path TEXT", []) {
        match err {
            rusqlite::Error::SqliteFailure(_, Some(msg)) if msg.contains("duplicate column name") => {}
            _ => return Err(err),
        }
    }
    if let Err(err) =
        conn.execute("ALTER TABLE nodes ADD COLUMN node_kind TEXT NOT NULL DEFAULT 'memory'", [])
    {
        match err {
            rusqlite::Error::SqliteFailure(_, Some(msg)) if msg.contains("duplicate column name") => {}
            _ => return Err(err),
        }
    }
    if let Err(err) = conn.execute(
        "ALTER TABLE nodes ADD COLUMN node_meta_json TEXT NOT NULL DEFAULT '{}'",
        [],
    ) {
        match err {
            rusqlite::Error::SqliteFailure(_, Some(msg)) if msg.contains("duplicate column name") => {}
            _ => return Err(err),
        }
    }
    if let Err(err) = conn.execute("ALTER TABLE analytics_events ADD COLUMN session_id TEXT", []) {
        match err {
            rusqlite::Error::SqliteFailure(_, Some(msg)) if msg.contains("duplicate column name") => {}
            rusqlite::Error::SqliteFailure(_, Some(msg)) if msg.contains("no such table") => {}
            _ => return Err(err),
        }
    }
    conn.execute(
        "CREATE TABLE IF NOT EXISTS analytics_events (
            id TEXT PRIMARY KEY NOT NULL,
            session_id TEXT,
            palace_id TEXT REFERENCES palaces(id) ON DELETE SET NULL,
            route_id TEXT REFERENCES routes(id) ON DELETE SET NULL,
            node_id TEXT REFERENCES nodes(id) ON DELETE SET NULL,
            event_type TEXT NOT NULL,
            event_group TEXT NOT NULL,
            created_at TEXT NOT NULL,
            payload_json TEXT NOT NULL DEFAULT '{}'
        )",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_analytics_palace ON analytics_events(palace_id)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type)",
        [],
    )?;
    Ok(())
}

pub fn list_palaces(conn: &Connection) -> rusqlite::Result<Vec<PalaceDto>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, created_at, atlas_path FROM palaces ORDER BY COALESCE(atlas_path, ''), created_at DESC",
    )?;
    let rows = stmt
        .query_map([], |r| {
            Ok(PalaceDto {
                id: r.get(0)?,
                name: r.get(1)?,
                created_at: r.get(2)?,
                atlas_path: r.get(3)?,
                editor_snapshot: None,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

pub fn create_palace(
    conn: &Connection,
    name: &str,
    atlas_path: Option<&str>,
    id: &str,
    created_at: &str,
) -> rusqlite::Result<PalaceDto> {
    conn.execute(
        "INSERT INTO palaces (id, name, created_at, atlas_path) VALUES (?1, ?2, ?3, ?4)",
        params![id, name, created_at, atlas_path],
    )?;
    Ok(PalaceDto {
        id: id.to_string(),
        name: name.to_string(),
        created_at: created_at.to_string(),
        atlas_path: atlas_path.map(|value| value.to_string()),
        editor_snapshot: None,
    })
}

pub fn load_palace(conn: &Connection, palace_id: &str) -> rusqlite::Result<Option<PalaceSnapshot>> {
    let palace: Option<PalaceDto> = conn
        .query_row(
            "SELECT id, name, created_at, atlas_path, editor_snapshot FROM palaces WHERE id = ?1",
            params![palace_id],
            |r| {
                Ok(PalaceDto {
                    id: r.get(0)?,
                    name: r.get(1)?,
                    created_at: r.get(2)?,
                    atlas_path: r.get(3)?,
                    editor_snapshot: r.get(4)?,
                })
            },
        )
        .optional()?;

    let Some(palace) = palace else {
        return Ok(None);
    };

    let canvas_objects = load_canvas_objects(conn, palace_id)?;
    let nodes = load_nodes(conn, palace_id)?;
    let edges = load_edges(conn, palace_id)?;
    let routes = load_routes(conn, palace_id)?;
    let loci = load_loci(conn, palace_id)?;

    Ok(Some(PalaceSnapshot {
        palace,
        canvas_objects,
        nodes,
        edges,
        routes,
        loci,
    }))
}

fn load_canvas_objects(conn: &Connection, palace_id: &str) -> rusqlite::Result<Vec<CanvasObjectDto>> {
    let mut stmt = conn.prepare(
        "SELECT id, palace_id, object_type, x, y, width, height, z_index, payload_json
         FROM canvas_objects WHERE palace_id = ?1",
    )?;
    let rows = stmt
        .query_map(params![palace_id], |r| {
            Ok(CanvasObjectDto {
                id: r.get(0)?,
                palace_id: r.get(1)?,
                object_type: r.get(2)?,
                x: r.get(3)?,
                y: r.get(4)?,
                width: r.get(5)?,
                height: r.get(6)?,
                z_index: r.get(7)?,
                payload_json: r.get(8)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

fn load_nodes(conn: &Connection, palace_id: &str) -> rusqlite::Result<Vec<NodeDto>> {
    let mut stmt = conn.prepare(
        "SELECT n.id, n.object_id, n.title, n.content, n.node_kind, n.node_meta_json
         FROM nodes n
         INNER JOIN canvas_objects c ON c.id = n.object_id
         WHERE c.palace_id = ?1",
    )?;
    let rows = stmt
        .query_map(params![palace_id], |r| {
            Ok(NodeDto {
                id: r.get(0)?,
                object_id: r.get(1)?,
                title: r.get(2)?,
                content: r.get(3)?,
                node_kind: r.get(4)?,
                node_meta_json: r.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

fn load_edges(conn: &Connection, palace_id: &str) -> rusqlite::Result<Vec<EdgeDto>> {
    let mut stmt = conn.prepare(
        "SELECT e.id, e.object_id, e.source_node_id, e.target_node_id,
                e.cast_ab, e.cast_cd, e.cast_ef, e.cast_gh
         FROM edges e
         INNER JOIN canvas_objects c ON c.id = e.object_id
         WHERE c.palace_id = ?1",
    )?;
    let rows = stmt
        .query_map(params![palace_id], |r| {
            Ok(EdgeDto {
                id: r.get(0)?,
                object_id: r.get(1)?,
                source_node_id: r.get(2)?,
                target_node_id: r.get(3)?,
                cast_ab: r.get(4)?,
                cast_cd: r.get(5)?,
                cast_ef: r.get(6)?,
                cast_gh: r.get(7)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

fn load_routes(conn: &Connection, palace_id: &str) -> rusqlite::Result<Vec<RouteDto>> {
    let mut stmt =
        conn.prepare("SELECT id, palace_id, name FROM routes WHERE palace_id = ?1 ORDER BY name")?;
    let rows = stmt
        .query_map(params![palace_id], |r| {
            Ok(RouteDto {
                id: r.get(0)?,
                palace_id: r.get(1)?,
                name: r.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

fn load_loci(conn: &Connection, palace_id: &str) -> rusqlite::Result<Vec<LocusDto>> {
    let mut stmt = conn.prepare(
        "SELECT l.id, l.route_id, l.node_id, l.order_index, l.label
         FROM loci l
         INNER JOIN routes r ON r.id = l.route_id
         WHERE r.palace_id = ?1
         ORDER BY l.route_id, l.order_index",
    )?;
    let rows = stmt
        .query_map(params![palace_id], |r| {
            Ok(LocusDto {
                id: r.get(0)?,
                route_id: r.get(1)?,
                node_id: r.get(2)?,
                order_index: r.get(3)?,
                label: r.get(4)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

pub fn save_snapshot(conn: &mut Connection, snap: &PalaceSnapshot) -> rusqlite::Result<()> {
    let tx = conn.transaction()?;
    let palace_id = &snap.palace.id;

    tx.execute(
        "UPDATE palaces SET name = ?2, atlas_path = ?3, editor_snapshot = ?4 WHERE id = ?1",
        params![
            palace_id,
            snap.palace.name,
            snap.palace.atlas_path.as_deref(),
            snap.palace.editor_snapshot.as_deref()
        ],
    )?;

    tx.execute(
        "DELETE FROM loci WHERE route_id IN (SELECT id FROM routes WHERE palace_id = ?1)",
        params![palace_id],
    )?;
    tx.execute("DELETE FROM routes WHERE palace_id = ?1", params![palace_id])?;
    tx.execute(
        "DELETE FROM edges WHERE object_id IN (SELECT id FROM canvas_objects WHERE palace_id = ?1)",
        params![palace_id],
    )?;
    tx.execute(
        "DELETE FROM nodes WHERE object_id IN (SELECT id FROM canvas_objects WHERE palace_id = ?1)",
        params![palace_id],
    )?;
    tx.execute(
        "DELETE FROM canvas_objects WHERE palace_id = ?1",
        params![palace_id],
    )?;

    for c in &snap.canvas_objects {
        tx.execute(
            "INSERT INTO canvas_objects (id, palace_id, object_type, x, y, width, height, z_index, payload_json)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                c.id,
                c.palace_id,
                c.object_type,
                c.x,
                c.y,
                c.width,
                c.height,
                c.z_index,
                c.payload_json
            ],
        )?;
    }

    for n in &snap.nodes {
        tx.execute(
            "INSERT INTO nodes (id, object_id, title, content, node_kind, node_meta_json) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                n.id,
                n.object_id,
                n.title,
                n.content,
                n.node_kind,
                n.node_meta_json
            ],
        )?;
    }

    for e in &snap.edges {
        tx.execute(
            "INSERT INTO edges (id, object_id, source_node_id, target_node_id, cast_ab, cast_cd, cast_ef, cast_gh)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                e.id,
                e.object_id,
                e.source_node_id,
                e.target_node_id,
                e.cast_ab,
                e.cast_cd,
                e.cast_ef,
                e.cast_gh
            ],
        )?;
    }

    for r in &snap.routes {
        tx.execute(
            "INSERT INTO routes (id, palace_id, name) VALUES (?1, ?2, ?3)",
            params![r.id, r.palace_id, r.name],
        )?;
    }

    for l in &snap.loci {
        tx.execute(
            "INSERT INTO loci (id, route_id, node_id, order_index, label) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![l.id, l.route_id, l.node_id, l.order_index, l.label],
        )?;
    }

    tx.commit()?;
    Ok(())
}

pub fn list_analytics_events(
    conn: &Connection,
    limit: Option<usize>,
) -> rusqlite::Result<Vec<AnalyticsEventDto>> {
    let sql = if limit.unwrap_or(0) > 0 {
        "SELECT id, session_id, palace_id, route_id, node_id, event_type, event_group, created_at, payload_json
         FROM analytics_events
         ORDER BY created_at DESC
         LIMIT ?1"
    } else {
        "SELECT id, session_id, palace_id, route_id, node_id, event_type, event_group, created_at, payload_json
         FROM analytics_events
         ORDER BY created_at DESC"
    };

    let mut stmt = conn.prepare(sql)?;
    let rows = if let Some(limit) = limit {
        if limit > 0 {
            stmt.query_map(params![limit as i64], |r| {
                Ok(AnalyticsEventDto {
                    id: r.get(0)?,
                    session_id: r.get(1)?,
                    palace_id: r.get(2)?,
                    route_id: r.get(3)?,
                    node_id: r.get(4)?,
                    event_type: r.get(5)?,
                    event_group: r.get(6)?,
                    created_at: r.get(7)?,
                    payload_json: r.get(8)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?
        } else {
            stmt.query_map([], |r| {
                Ok(AnalyticsEventDto {
                    id: r.get(0)?,
                    session_id: r.get(1)?,
                    palace_id: r.get(2)?,
                    route_id: r.get(3)?,
                    node_id: r.get(4)?,
                    event_type: r.get(5)?,
                    event_group: r.get(6)?,
                    created_at: r.get(7)?,
                    payload_json: r.get(8)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?
        }
    } else {
        stmt.query_map([], |r| {
            Ok(AnalyticsEventDto {
                id: r.get(0)?,
                session_id: r.get(1)?,
                palace_id: r.get(2)?,
                route_id: r.get(3)?,
                node_id: r.get(4)?,
                event_type: r.get(5)?,
                event_group: r.get(6)?,
                created_at: r.get(7)?,
                payload_json: r.get(8)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?
    };

    Ok(rows)
}

pub fn append_analytics_events(
    conn: &mut Connection,
    events: &[AnalyticsEventDto],
) -> rusqlite::Result<()> {
    let tx = conn.transaction()?;
    for event in events {
        tx.execute(
            "INSERT OR REPLACE INTO analytics_events
             (id, session_id, palace_id, route_id, node_id, event_type, event_group, created_at, payload_json)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                event.id,
                event.session_id,
                event.palace_id,
                event.route_id,
                event.node_id,
                event.event_type,
                event.event_group,
                event.created_at,
                event.payload_json
            ],
        )?;
    }
    tx.commit()?;
    Ok(())
}
