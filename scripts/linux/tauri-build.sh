#!/usr/bin/env bash
# The Tauri CLI as the Linux release job runs it (tauri-action's tauriScript).
# After a build, the AppImage loses the display libraries that crash it on newer systems
# and is signed again, before tauri-action uploads it and writes latest.json.
set -euo pipefail

npx tauri "$@"

if [[ "${1:-}" == "build" ]]; then
  bash "$(dirname "$0")/unbundle-display-libs.sh"
fi
