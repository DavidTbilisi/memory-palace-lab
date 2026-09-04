use crate::db::{
    append_analytics_events, create_palace, list_analytics_events, list_palaces, list_trashed_palaces,
    load_palace, purge_palace, restore_palace, save_snapshot, soft_delete_palace, AnalyticsEventDto,
    PalaceDto, PalaceSnapshot,
};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::fs::{self, OpenOptions};
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use tauri::{Manager, State};

pub struct DbState {
    pub path: PathBuf,
}

fn open(state: &DbState) -> Result<Connection, String> {
    Connection::open(&state.path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_list(state: State<DbState>) -> Result<Vec<PalaceDto>, String> {
    let conn = open(&state)?;
    list_palaces(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_list_trashed(state: State<DbState>) -> Result<Vec<PalaceDto>, String> {
    let conn = open(&state)?;
    list_trashed_palaces(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_create(state: State<DbState>, name: String, atlas_path: Option<String>) -> Result<PalaceDto, String> {
    let conn = open(&state)?;
    let id = uuid::Uuid::new_v4().to_string();
    let created_at = chrono::Utc::now().to_rfc3339();
    create_palace(&conn, &name, atlas_path.as_deref(), &id, &created_at).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_load(state: State<DbState>, palace_id: String) -> Result<Option<PalaceSnapshot>, String> {
    let conn = open(&state)?;
    load_palace(&conn, &palace_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_save(state: State<DbState>, snapshot: PalaceSnapshot) -> Result<(), String> {
    let mut conn = open(&state)?;
    save_snapshot(&mut conn, &snapshot).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_soft_delete(state: State<DbState>, palace_id: String) -> Result<(), String> {
    let conn = open(&state)?;
    soft_delete_palace(&conn, &palace_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_restore(state: State<DbState>, palace_id: String) -> Result<(), String> {
    let conn = open(&state)?;
    restore_palace(&conn, &palace_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_purge(state: State<DbState>, palace_id: String) -> Result<(), String> {
    let conn = open(&state)?;
    purge_palace(&conn, &palace_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn analytics_list(
    state: State<DbState>,
    limit: Option<usize>,
) -> Result<Vec<AnalyticsEventDto>, String> {
    let conn = open(&state)?;
    list_analytics_events(&conn, limit).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn analytics_append(
    state: State<DbState>,
    events: Vec<AnalyticsEventDto>,
) -> Result<(), String> {
    let mut conn = open(&state)?;
    append_analytics_events(&mut conn, &events).map_err(|e| e.to_string())
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportBundle {
    pub version: u32,
    pub snapshot: PalaceSnapshot,
}

#[tauri::command]
pub fn palace_export_json(_state: State<DbState>, snapshot: PalaceSnapshot) -> Result<String, String> {
    let bundle = ExportBundle {
        version: 1,
        snapshot,
    };
    serde_json::to_string_pretty(&bundle).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn palace_import_json(json: String) -> Result<PalaceSnapshot, String> {
    let bundle: ExportBundle = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    Ok(bundle.snapshot)
}

/// Used in tests / health check
#[tauri::command]
pub fn db_ping(state: State<DbState>) -> Result<String, String> {
    let conn = open(&state)?;
    let v: String = conn
        .query_row("SELECT sqlite_version()", [], |r| r.get(0))
        .map_err(|e| e.to_string())?;
    Ok(v)
}

// ── METER bridge ─────────────────────────────────────────────────────
//
// Two small commands behind src/infrastructure/meterBridge.ts. The mapping
// lives in TypeScript; Rust only resolves the default log directory the way
// the `meter` CLI does and appends lines, so the webview needs no fs scope.

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MeterDataDirDto {
    pub dir: String,
    /// "env" | "project" | "home", the rule that chose `dir`.
    pub via: String,
}

fn expand_home(raw: &str, home: &Path) -> PathBuf {
    if raw == "~" {
        home.to_path_buf()
    } else if let Some(rest) = raw.strip_prefix("~/") {
        home.join(rest)
    } else {
        PathBuf::from(raw)
    }
}

/// First ancestor of `start` (inclusive) containing wiki/ or .git/, like
/// meter.storage._project_root.
fn project_root_from(start: &Path) -> Option<PathBuf> {
    let mut dir = start.to_path_buf();
    loop {
        if dir.join("wiki").is_dir() || dir.join(".git").is_dir() {
            return Some(dir);
        }
        if !dir.pop() {
            return None;
        }
    }
}

fn path_string(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}

/// Same precedence as the meter CLI: METER_DATA_DIR, then
/// <project root>/meter-data, then ~/.neural-os/meter.
#[tauri::command]
pub fn meter_default_data_dir(app: tauri::AppHandle) -> Result<MeterDataDirDto, String> {
    let home = app.path().home_dir().map_err(|e| e.to_string())?;
    if let Ok(raw) = std::env::var("METER_DATA_DIR") {
        let trimmed = raw.trim();
        if !trimmed.is_empty() {
            return Ok(MeterDataDirDto {
                dir: path_string(&expand_home(trimmed, &home)),
                via: "env".to_string(),
            });
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        if let Some(root) = project_root_from(&cwd) {
            return Ok(MeterDataDirDto {
                dir: path_string(&root.join("meter-data")),
                via: "project".to_string(),
            });
        }
    }
    Ok(MeterDataDirDto {
        dir: path_string(&home.join(".neural-os").join("meter")),
        via: "home".to_string(),
    })
}

/// Append JSON lines to <dir>/events.jsonl, creating the directory if needed.
/// Repairs a missing trailing newline first so a foreign last line is never
/// glued to ours. One write per batch, append mode, never truncates.
#[tauri::command]
pub fn meter_append_events(dir: String, lines: Vec<String>) -> Result<(), String> {
    if lines.is_empty() {
        return Ok(());
    }
    let dir = PathBuf::from(dir);
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join("events.jsonl");

    let needs_newline = match fs::metadata(&path) {
        Ok(meta) if meta.len() > 0 => {
            let mut file = fs::File::open(&path).map_err(|e| e.to_string())?;
            file.seek(SeekFrom::End(-1)).map_err(|e| e.to_string())?;
            let mut last = [0u8; 1];
            file.read_exact(&mut last).map_err(|e| e.to_string())?;
            last[0] != b'\n'
        }
        _ => false,
    };

    let mut out = String::with_capacity(lines.iter().map(|line| line.len() + 1).sum::<usize>() + 1);
    if needs_newline {
        out.push('\n');
    }
    for line in &lines {
        out.push_str(line);
        out.push('\n');
    }
    let mut file = OpenOptions::new()
        .append(true)
        .create(true)
        .truncate(false)
        .open(&path)
        .map_err(|e| e.to_string())?;
    file.write_all(out.as_bytes()).map_err(|e| e.to_string())
}
