//! Filesystem access to a sync vault: a folder the user picks, which is outside the app data
//! directory and therefore outside the JS filesystem scope in capabilities/default.json.
//!
//! The dialog plugin does widen that scope at runtime when the user picks a folder, but the
//! grant only lives in memory and this app has no persisted-scope plugin — so the path
//! restored from settings on the next launch would be unreachable. Doing the IO here also
//! buys atomic writes, a whole-vault header scan in one round trip, and a read cap.
//!
//! Every path crossing this boundary comes from the webview, which processes files written
//! by other machines. It is treated as hostile: see `resolve_in_vault`.

use serde::Serialize;
use std::fs;
use std::io::{BufRead, BufReader};
use std::path::{Component, Path, PathBuf};

/// Vault files are small; a palace is a header line plus base64. A cap well above anything
/// legitimate stops a corrupt or hostile file from exhausting memory in the webview.
const MAX_FILE_BYTES: u64 = 64 * 1024 * 1024;
/// A `.mpv` header is one line of JSON. Anything longer is not a header we wrote.
const MAX_HEADER_BYTES: u64 = 64 * 1024;

const SUBDIRS: [&str; 5] = [
    "palaces",
    "tombstones",
    "assets",
    "streams/analytics",
    "streams/aar",
];

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VaultEntryDto {
    pub rel_path: String,
    pub size: u64,
    /// First line only. None when the file is empty, not UTF-8, or the line is implausibly
    /// long — all of which mean "skip and report", never "absent".
    pub header_line: Option<String>,
    /// Last-modified time in milliseconds since the epoch, or None where the filesystem will
    /// not say. Used only as a safety margin when reclaiming space — never for a sync
    /// decision, which is why no peer's clock is involved: this is the local filesystem's
    /// account of when the file appeared here.
    pub modified_ms: Option<u64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VaultProbeDto {
    pub exists: bool,
    pub writable: bool,
    pub has_descriptor: bool,
    pub ignored_files: u32,
    pub undownloaded_files: u32,
}

/// Resolves a caller-supplied relative path inside the vault, or refuses.
///
/// The allowlist is deliberately narrow. Besides blocking traversal, it makes a sync
/// client's own artifacts unrepresentable: Dropbox's
/// `Palace (David's conflicted copy 2026-09-23).mpv` contains spaces, parentheses and an
/// apostrophe, and iCloud's placeholders end in `.icloud`, so neither can ever be read or
/// written through this API.
fn resolve_in_vault(dir: &str, rel: &str) -> Result<PathBuf, String> {
    if rel.is_empty() || rel.len() > 255 {
        return Err("Invalid vault path.".into());
    }
    if !rel
        .bytes()
        .all(|b| b.is_ascii_alphanumeric() || b == b'.' || b == b'_' || b == b'-' || b == b'/')
    {
        return Err("Invalid vault path.".into());
    }
    if rel.starts_with('/') || rel.contains("..") {
        return Err("Invalid vault path.".into());
    }

    // Exactly one file name under a known subdirectory. Matching on prefix and extension
    // alone would also admit `palaces/a.mpv/b.mpv`, which is still inside the vault but is
    // not a shape we ever write, and would silently create a directory named `a.mpv`.
    let allowed = rel == "vault.json"
        || SUBDIRS.iter().any(|prefix| {
            rel.strip_prefix(&format!("{prefix}/")).is_some_and(|name| {
                !name.contains('/') && name.ends_with(".mpv") && name.len() > ".mpv".len()
            })
        });
    if !allowed {
        return Err("Invalid vault path.".into());
    }

    // Reject anything that is not a plain sequence of normal names, which also catches a
    // leading component such as `.` that the byte filter allows.
    let relative = Path::new(rel);
    if relative
        .components()
        .any(|c| !matches!(c, Component::Normal(_)))
    {
        return Err("Invalid vault path.".into());
    }

    let root = fs::canonicalize(dir).map_err(|e| format!("Vault folder is unavailable: {e}"))?;
    let target = root.join(relative);

    // Canonicalize the parent rather than the target, because the target may not exist yet.
    // This is what defeats a symlink someone else dropped into a shared folder.
    let parent = target
        .parent()
        .ok_or_else(|| "Invalid vault path.".to_string())?;
    if parent.exists() {
        let real_parent =
            fs::canonicalize(parent).map_err(|e| format!("Vault folder is unavailable: {e}"))?;
        if !real_parent.starts_with(&root) {
            return Err("Invalid vault path.".into());
        }
    }
    Ok(target)
}

#[tauri::command]
pub fn vault_init(dir: String) -> Result<String, String> {
    let root = PathBuf::from(&dir);
    fs::create_dir_all(&root).map_err(|e| format!("Could not create the vault folder: {e}"))?;
    for sub in SUBDIRS {
        fs::create_dir_all(root.join(sub))
            .map_err(|e| format!("Could not create the vault folder: {e}"))?;
    }
    let canonical = fs::canonicalize(&root).map_err(|e| e.to_string())?;
    Ok(canonical.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn vault_probe(dir: String) -> Result<VaultProbeDto, String> {
    let root = PathBuf::from(&dir);
    if !root.is_dir() {
        return Ok(VaultProbeDto {
            exists: false,
            writable: false,
            has_descriptor: false,
            ignored_files: 0,
            undownloaded_files: 0,
        });
    }

    let writable = !fs::metadata(&root)
        .map(|m| m.permissions().readonly())
        .unwrap_or(true);

    let mut ignored_files = 0;
    let mut undownloaded_files = 0;
    for entry in walk(&root) {
        let rel = entry
            .strip_prefix(&root)
            .map(|p| p.to_string_lossy().replace('\\', "/"))
            .unwrap_or_default();
        if rel == "vault.json" {
            continue;
        }
        // An iCloud placeholder means the vault has not finished downloading. That must never
        // read as "your vault is empty".
        if rel.ends_with(".icloud") {
            undownloaded_files += 1;
        } else if resolve_in_vault(&dir, &rel).is_err() {
            ignored_files += 1;
        }
    }

    Ok(VaultProbeDto {
        exists: true,
        writable,
        has_descriptor: root.join("vault.json").is_file(),
        ignored_files,
        undownloaded_files,
    })
}

/// Every recognised file with its header line, in one call. A palace's header is all the
/// sync plan needs, so deciding "is there anything to do?" across a vault of 1 MB palaces
/// costs kilobytes rather than reading every file.
#[tauri::command]
pub fn vault_list(dir: String) -> Result<Vec<VaultEntryDto>, String> {
    let root = fs::canonicalize(&dir).map_err(|e| format!("Vault folder is unavailable: {e}"))?;
    let mut entries = Vec::new();

    for path in walk(&root) {
        let rel = match path.strip_prefix(&root) {
            Ok(rel) => rel.to_string_lossy().replace('\\', "/"),
            Err(_) => continue,
        };
        if rel != "vault.json" && resolve_in_vault(&dir, &rel).is_err() {
            continue;
        }
        let Ok(meta) = fs::metadata(&path) else {
            continue;
        };
        entries.push(VaultEntryDto {
            rel_path: rel,
            size: meta.len(),
            header_line: read_first_line(&path),
            modified_ms: meta
                .modified()
                .ok()
                .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|d| d.as_millis() as u64),
        });
    }

    entries.sort_by(|a, b| a.rel_path.cmp(&b.rel_path));
    Ok(entries)
}

#[tauri::command]
pub fn vault_read(dir: String, rel_path: String) -> Result<Option<String>, String> {
    let path = resolve_in_vault(&dir, &rel_path)?;
    let Ok(meta) = fs::metadata(&path) else {
        return Ok(None);
    };
    if meta.len() > MAX_FILE_BYTES {
        return Err(format!("{rel_path} is too large to read."));
    }
    match fs::read_to_string(&path) {
        Ok(text) => Ok(Some(text)),
        // Not UTF-8, or vanished between the check and the read: unreadable, never "absent".
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(err) => Err(err.to_string()),
    }
}

/// Writes to a temporary name in the same directory and renames over the target, so a sync
/// client watching the folder never sees a half-written file. The directory fsync on Unix is
/// what makes "this file is whole" true before the client notices it.
#[tauri::command]
pub fn vault_write(dir: String, rel_path: String, contents: String) -> Result<(), String> {
    let path = resolve_in_vault(&dir, &rel_path)?;
    let parent = path
        .parent()
        .ok_or_else(|| "Invalid vault path.".to_string())?;
    fs::create_dir_all(parent).map_err(|e| e.to_string())?;

    let temp = parent.join(format!(".{}.tmp", uuid::Uuid::new_v4()));
    let write_result = (|| -> std::io::Result<()> {
        use std::io::Write;
        let mut file = fs::File::create(&temp)?;
        file.write_all(contents.as_bytes())?;
        file.sync_all()
    })();
    if let Err(err) = write_result {
        let _ = fs::remove_file(&temp);
        return Err(err.to_string());
    }
    if let Err(err) = fs::rename(&temp, &path) {
        let _ = fs::remove_file(&temp);
        return Err(err.to_string());
    }
    #[cfg(unix)]
    if let Ok(dir_handle) = fs::File::open(parent) {
        let _ = dir_handle.sync_all();
    }
    Ok(())
}

#[tauri::command]
pub fn vault_delete(dir: String, rel_path: String) -> Result<(), String> {
    let path = resolve_in_vault(&dir, &rel_path)?;
    match fs::remove_file(&path) {
        Ok(()) => Ok(()),
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}

fn read_first_line(path: &Path) -> Option<String> {
    let file = fs::File::open(path).ok()?;
    let mut reader = BufReader::new(file).take(MAX_HEADER_BYTES);
    let mut line = String::new();
    match reader.read_line(&mut line) {
        Ok(0) => None,
        // A line that filled the cap is not a header we wrote.
        Ok(n) if n as u64 >= MAX_HEADER_BYTES => None,
        Ok(_) => Some(line.trim_end_matches(['\n', '\r']).to_string()),
        // Not UTF-8.
        Err(_) => None,
    }
}

/// Files in the vault root and its known subdirectories. Never follows into anywhere else,
/// so a symlinked directory dropped in the folder cannot widen the walk.
fn walk(root: &Path) -> Vec<PathBuf> {
    let mut found = Vec::new();
    let mut dirs = vec![root.to_path_buf()];
    for sub in SUBDIRS {
        dirs.push(root.join(sub));
    }
    for dir in dirs {
        let Ok(entries) = fs::read_dir(&dir) else {
            continue;
        };
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                found.push(path);
            }
        }
    }
    found
}

use std::io::Read as _;

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    fn temp_vault() -> PathBuf {
        let dir = std::env::temp_dir().join(format!("mpl-vault-test-{}", uuid::Uuid::new_v4()));
        fs::create_dir_all(&dir).unwrap();
        for sub in SUBDIRS {
            fs::create_dir_all(dir.join(sub)).unwrap();
        }
        dir
    }

    #[test]
    fn accepts_the_paths_the_vault_actually_uses() {
        let dir = temp_vault();
        let d = dir.to_string_lossy();
        for rel in [
            "vault.json",
            "palaces/abc-123.mpv",
            "tombstones/abc-123.mpv",
            "streams/analytics/device-1.mpv",
            "streams/aar/device-1.mpv",
            "assets/deadbeef.mpv",
        ] {
            assert!(resolve_in_vault(&d, rel).is_ok(), "should accept {rel}");
        }
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn rejects_traversal_and_absolute_paths() {
        let dir = temp_vault();
        let d = dir.to_string_lossy();
        for rel in [
            "../outside.mpv",
            "palaces/../../outside.mpv",
            "/etc/passwd",
            "palaces/../../../etc/passwd",
            "..",
            "./palaces/a.mpv",
        ] {
            assert!(resolve_in_vault(&d, rel).is_err(), "should reject {rel}");
        }
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn rejects_paths_outside_the_allowlist() {
        let dir = temp_vault();
        let d = dir.to_string_lossy();
        for rel in [
            "secrets.txt",
            "palaces/a.txt",
            "elsewhere/a.mpv",
            "palaces/a.mpv/b.mpv",
            "",
        ] {
            assert!(resolve_in_vault(&d, rel).is_err(), "should reject {rel}");
        }
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn rejects_sync_client_artifacts() {
        // A conflict copy must be unreachable, not merely ignored elsewhere.
        let dir = temp_vault();
        let d = dir.to_string_lossy();
        for rel in [
            "palaces/Palace (David's conflicted copy 2026-09-23).mpv",
            "palaces/a.mpv.icloud",
            "palaces/a b.mpv",
            "palaces/a:b.mpv",
            "palaces\\a.mpv",
        ] {
            assert!(resolve_in_vault(&d, rel).is_err(), "should reject {rel}");
        }
        fs::remove_dir_all(&dir).ok();
    }

    #[cfg(unix)]
    #[test]
    fn rejects_a_symlink_escaping_the_vault() {
        let dir = temp_vault();
        let outside = std::env::temp_dir().join(format!("mpl-outside-{}", uuid::Uuid::new_v4()));
        fs::create_dir_all(&outside).unwrap();
        let link = dir.join("streams/analytics");
        fs::remove_dir_all(&link).unwrap();
        std::os::unix::fs::symlink(&outside, &link).unwrap();

        let result = resolve_in_vault(&dir.to_string_lossy(), "streams/analytics/a.mpv");

        assert!(result.is_err(), "a symlinked subdirectory must not be writable");
        fs::remove_dir_all(&dir).ok();
        fs::remove_dir_all(&outside).ok();
    }

    #[test]
    fn writes_atomically_and_reads_back() {
        let dir = temp_vault();
        let d = dir.to_string_lossy().into_owned();

        vault_write(d.clone(), "palaces/a.mpv".into(), "header\nbody\n".into()).unwrap();
        assert_eq!(
            vault_read(d.clone(), "palaces/a.mpv".into()).unwrap().as_deref(),
            Some("header\nbody\n")
        );
        // No temporary file left behind.
        let leftovers = fs::read_dir(dir.join("palaces"))
            .unwrap()
            .flatten()
            .filter(|e| e.file_name().to_string_lossy().ends_with(".tmp"))
            .count();
        assert_eq!(leftovers, 0);

        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn reading_a_missing_file_is_absence_not_an_error() {
        let dir = temp_vault();
        let d = dir.to_string_lossy().into_owned();
        assert_eq!(vault_read(d, "palaces/nope.mpv".into()).unwrap(), None);
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn lists_only_recognised_files_with_their_header_line() {
        let dir = temp_vault();
        let d = dir.to_string_lossy().into_owned();
        vault_write(d.clone(), "palaces/a.mpv".into(), "{\"magic\":1}\nbody\n".into()).unwrap();
        fs::write(dir.join("palaces/Palace (conflicted copy).mpv"), "junk").unwrap();

        let entries = vault_list(d).unwrap();

        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].rel_path, "palaces/a.mpv");
        assert_eq!(entries[0].header_line.as_deref(), Some("{\"magic\":1}"));
        fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn probe_counts_what_it_ignored_and_what_has_not_downloaded() {
        let dir = temp_vault();
        let d = dir.to_string_lossy().into_owned();
        fs::write(dir.join("vault.json"), "{}").unwrap();
        fs::write(dir.join("palaces/a.mpv.icloud"), "").unwrap();
        fs::write(dir.join("palaces/notes.txt"), "").unwrap();

        let probe = vault_probe(d).unwrap();

        assert!(probe.exists && probe.has_descriptor);
        assert_eq!(probe.undownloaded_files, 1);
        assert_eq!(probe.ignored_files, 1);
        fs::remove_dir_all(&dir).ok();
    }
}
