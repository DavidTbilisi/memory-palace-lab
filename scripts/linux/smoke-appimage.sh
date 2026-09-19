#!/usr/bin/env bash
# Starts an AppImage for a while and checks that its web page process survives.
# .github/workflows/appimage.yml runs it on Fedora; it also works on a Linux desktop.
#
# Usage: smoke-appimage.sh <app.AppImage> [NAME=value ...]
#   NAME=value pairs are set for the app only, for example LD_PRELOAD=...
#   Without a DISPLAY it starts Xvfb. SMOKE_SECONDS sets the wait (default 25).
#   Prints the app's output, then exits 0 if WebKitWebProcess is still running and
#   did not log an EGL abort, 1 otherwise.
set -uo pipefail

image="$(realpath "$1")"
shift
seconds="${SMOKE_SECONDS:-25}"
log="$(mktemp)"
runtime_dir="$(mktemp -d)"
chmod +x "$image"

if [[ -z "${DISPLAY:-}" ]]; then
  Xvfb :99 -screen 0 1280x800x24 -nolisten tcp > /dev/null 2>&1 &
  xvfb=$!
  export DISPLAY=:99
  sleep 2
fi

launcher=()
if command -v dbus-run-session > /dev/null; then
  launcher=(dbus-run-session --)
fi

# setsid gives the app its own process group, so everything it started can be stopped at once.
APPIMAGE_EXTRACT_AND_RUN=1 XDG_RUNTIME_DIR="$runtime_dir" NO_AT_BRIDGE=1 \
  setsid env "$@" "${launcher[@]}" "$image" > "$log" 2>&1 &
app=$!
sleep "$seconds"

# Only the app's process group counts, so other WebKit apps on a desktop do not.
if pgrep -g "$app" -f WebKitWebProcess > /dev/null; then
  web=running
else
  web=gone
fi

kill -TERM -- "-$app" 2> /dev/null
sleep 2
kill -KILL -- "-$app" 2> /dev/null
if [[ -n "${xvfb:-}" ]]; then
  kill "$xvfb" 2> /dev/null
fi
wait 2> /dev/null

cat "$log"
name="$(basename "$image")"
if [[ "$web" == gone ]] || grep -q "Could not create default EGL display" "$log"; then
  echo "RESULT: the web process of $name did not survive"
  exit 1
fi
echo "RESULT: the web process of $name is running"
