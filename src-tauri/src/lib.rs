mod commands;
mod db;

use commands::{db_ping, palace_create, palace_export_json, palace_import_json, palace_list, palace_load, palace_save, DbState};
use std::fs;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let dir = app.path().app_data_dir().expect("app_data_dir");
            fs::create_dir_all(&dir).expect("create app dir");
            let db_path = dir.join("memory_palace_lab.sqlite3");
            db::init_db(&db_path).expect("init db");
            app.manage(DbState { path: db_path });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            palace_list,
            palace_create,
            palace_load,
            palace_save,
            palace_export_json,
            palace_import_json,
            db_ping,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
