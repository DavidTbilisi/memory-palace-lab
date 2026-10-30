#!/usr/bin/env bash
#
# Launches one simulated device for the two-device sync check. See README.md.
#
#   ./run.sh build          compile the dev binary with the debug bridge
#   ./run.sh serve          start the Vite dev server the binary loads from
#   ./run.sh device-a       run a device against the shared vault folder
#   ./run.sh device-b
#   ./run.sh clean          throw away both devices and the vault
#
# Each device gets its own XDG_DATA_HOME, which is what gives it a separate SQLite file, a
# separate palace-backgrounds directory and a separate webview store — the three things that
# make two processes on one machine behave like two machines. They share only the vault
# folder, which is the whole point.
set -euo pipefail

ROOT="${MP_SYNC_ROOT:-/tmp/mp-two-device-sync}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BINARY="$REPO/src-tauri/target/debug/memory_palace_lab"
export PATH="$HOME/.cargo/bin:$PATH"

vault_dir() { echo "$ROOT/vault"; }

case "${1:-}" in
  build)
    # The bridge is behind a cargo feature AND a capability. The capability has to be added
    # by hand and must not be committed; the README says so too.
    grep -q '"mcp-bridge:default"' "$REPO/src-tauri/capabilities/default.json" \
      || { echo "Add \"mcp-bridge:default\" to src-tauri/capabilities/default.json first."; exit 1; }
    cd "$REPO/src-tauri" && cargo build --features mcp-bridge
    ;;

  serve)
    # One dev server for both devices. They are separate processes with separate data
    # directories; sharing the server only means they run the same build.
    cd "$REPO" && npx vite --host 127.0.0.1 --port 1420 --strictPort
    ;;

  device-a|device-b)
    device="$1"
    mkdir -p "$ROOT/$device" "$(vault_dir)"
    [ -x "$BINARY" ] || { echo "No binary. Run: $0 build"; exit 1; }
    echo "vault:  $(vault_dir)"
    echo "device: $ROOT/$device"
    # METER_DATA_DIR keeps the METER bridge's files out of the real one too.
    XDG_DATA_HOME="$ROOT/$device" \
    METER_DATA_DIR="$ROOT/$device/meter" \
      "$BINARY"
    ;;

  artifacts)
    # Drops the two files a folder-sync client leaves behind, to prove the app ignores them
    # and says how many it ignored. Neither can be written through the Rust commands — the
    # allowlist makes them unrepresentable — so they are planted from outside.
    v="$(vault_dir)"
    mkdir -p "$v/palaces"
    printf 'not a palace' > "$v/palaces/Palace (David's conflicted copy 2026-09-23).mpv"
    printf '' > "$v/palaces/placeholder.mpv.icloud"
    echo "planted 2 sync-client artifacts in $v/palaces"
    ;;

  inspect)
    v="$(vault_dir)"
    echo "── $v ──"
    find "$v" -type f | sort
    ;;

  clean)
    rm -rf "$ROOT"
    echo "removed $ROOT"
    ;;

  *)
    sed -n '3,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit 1
    ;;
esac
