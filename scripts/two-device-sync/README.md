# Two-device sync check

Drives the real desktop app against a real folder, twice, as two devices.

The vitest suite in `src/domain/sync/vaultSyncEngine.test.ts` already simulates two devices
over one vault, but it replaces the vault with a `Map` and the filesystem with nothing. This
check exists for the layer that simulation cannot reach: the Tauri `vault_*` commands, the
argument names crossing the IPC boundary, `$APPDATA` asset IO, and a folder that a sync
client is free to litter.

It has earned its keep. The first run found two real defects that every test had passed:

- **`UNIQUE constraint failed: canvas_objects.id`** — "keep both" reused its source's row ids.
  `canvas_objects`, `nodes`, `edges`, `routes` and `loci` all declare a *global*
  `id TEXT PRIMARY KEY`, so the copy collided with the palace it was copied from and the save
  was rejected outright. The simulation missed it because the in-memory repository keeps one
  map per palace and cannot see a collision between two. It now enforces the same uniqueness.
- **A kept-both copy opened with no pictures** — the fork was taken from the *portable* form
  of the palace, whose images have been rewritten to `mpvault://<hash>` for the vault's
  benefit, so the copy pointed at references the device could not draw while the files sat
  on disk.

## Running it

Two things have to be true first, neither of which is committed:

1. `"mcp-bridge:default"` added to `src-tauri/capabilities/default.json`.
2. The binary built with the feature: `./run.sh build`.

Then, in separate terminals:

```bash
./run.sh serve            # Vite on :1420, which both devices load from
./run.sh device-a         # first device
```

Each device gets its own `XDG_DATA_HOME`, which is what gives it a separate SQLite file, a
separate `palace-backgrounds` directory and a separate webview store. They share only the
vault folder. **Run them one at a time** — the debug bridge binds a single port, and manual
push/pull through a folder never needs both alive at once anyway. That is also the truer
workflow: you use the laptop, then later you use the desktop.

Drive a device from a Claude Code session with the `tauri-debug-bridge` tools. Load the
driver into the page, then call steps and poll:

```js
import('/scripts/two-device-sync/driver.js')         // once per launch
window.__mpSync.run('connect', { dir: '/tmp/mp-two-device-sync/vault',
                                 passphrase: '…', deviceName: 'Laptop' })
window.__mpSync.state()                              // poll until status is "done"
```

`driver.js` documents each step. The bridge cannot await, hence the run/poll split.

Other subcommands: `./run.sh artifacts` plants a Dropbox conflicted copy and an iCloud
placeholder, `./run.sh inspect` lists the vault, `./run.sh clean` throws everything away.

## What a full pass looks like

Verified by hand on 2026-09-23, in this order:

| Step | What it proves |
|---|---|
| A connects to an empty folder | `vault_init` creates the tree; `vault.json` holds a salt and a verifier, nothing else |
| A seeds a palace and syncs | palace, route, SM-2 schedule and one asset written as `.mpv` |
| Inspect the folder | two-line container: cleartext header, base64 ciphertext; no palace name, node title or passphrase anywhere |
| A syncs again | **file mtimes unchanged** — a settled vault is not written to at all |
| B joins with the wrong passphrase | refused, nothing remembered, folder byte-for-byte unchanged |
| B joins and syncs | palace arrives with its schedule; image rewritten to B's own path and byte-identical |
| B syncs again | nothing pushed back — the portableize-before-hash ordering holds against genuinely different local paths |
| Relaunch either device | comes back `locked`: the folder is remembered, the passphrase never is |
| Both edit, then sync | `both-edited` conflict, and **nothing is written while it is open** |
| Resolve keep-both | vault's version lands under the original id; local work survives as a copy with its schedule and its pictures |
| Sync twice more | the copy pushes once, then silence |
| With sync-client litter present | `vault_list` returns only real files; probe reports 1 ignored and 1 undownloaded |
| Resolve keep-mine | this device's version replaces the vault's; the other device then takes it as a plain pull, not a second conflict |
| Resolve take-theirs | the vault's version replaces this device's, and **the folder is not written to at all** |
| Delete a palace and sync both | it lands in the other device's trash, with a fresh 30-day purge date, and restores there intact |
| Purge a palace and sync both | the palace file is replaced by a tombstone envelope; the other device hard-deletes it; repeated syncs never bring it back |
| Purge here, edited there, keep-mine | the deletion is carried out and the question is not re-asked |
| Purge here, edited there, take-theirs | the palace returns **and survives the next sync** |

A soft delete keeps its ciphertext in the vault so it can still be restored, and the header
does not say it was deleted — the folder does not reveal that a palace was removed, only that
one changed.

Everything in the feature file has now been driven at least once.
