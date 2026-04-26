use crate::db::{
    append_analytics_events, create_palace, list_analytics_events, list_palaces, load_palace,
    save_snapshot, AnalyticsEventDto, PalaceDto, PalaceSnapshot,
};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::State;

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
