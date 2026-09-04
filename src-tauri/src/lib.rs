mod commands;
mod db;

use commands::{
    analytics_append, analytics_list, db_ping, meter_append_events, meter_default_data_dir,
    palace_create, palace_export_json, palace_import_json, palace_list, palace_list_trashed,
    palace_load, palace_purge, palace_restore, palace_save, palace_soft_delete, DbState,
};
use std::fs;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init());

    #[cfg(all(debug_assertions, feature = "mcp-bridge"))]
    let builder = builder.plugin(tauri_plugin_mcp_bridge::init());

    builder
        .setup(|app| {
            let dir = app.path().app_data_dir().expect("app_data_dir");
            fs::create_dir_all(&dir).expect("create app dir");
            let db_path = dir.join("memory_palace_lab.sqlite3");
            db::init_db(&db_path).expect("init db");
            app.manage(DbState { path: db_path });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            analytics_list,
            analytics_append,
            palace_list,
            palace_list_trashed,
            palace_create,
            palace_load,
            palace_save,
            palace_soft_delete,
            palace_restore,
            palace_purge,
            palace_export_json,
            palace_import_json,
            db_ping,
            meter_default_data_dir,
            meter_append_events,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
