#!/usr/bin/env bash
# Takes the display libraries that Mesa loads out of the Linux AppImage, so the app uses
# the host's copies, then signs the AppImage again for the updater.
#
# The AppImage is built on Ubuntu 22.04 and bundles that release's libwayland-client and a
# few X11 libraries. The host's Mesa is loaded next to them, and Mesa on newer systems
# needs newer versions: Fedora 44's Mesa 26 calls wl_display_create_queue_with_name, which
# libwayland-client 1.20 lacks. EGL then fails to start, and WebKitWebProcess aborts with
# "Could not create default EGL display: EGL_BAD_PARAMETER".
# Every system with Mesa has these libraries, because Mesa needs them itself.
# scripts/linux/check-appimage-libs.sh finds the libraries that matter.
#
# Upstream: https://github.com/tauri-apps/tauri/issues/15976. The list there also has
# libraries Mesa does not load, such as libwayland-server. The bundled WebKit needs that
# one, and a system without a Wayland compositor may not have it.
#
# Usage: unbundle-display-libs.sh [path/to/app.AppImage]
#   Without an argument it takes the AppImage of the version in src-tauri/tauri.conf.json.
#   Needs squashfs-tools. Signs the result when TAURI_SIGNING_PRIVATE_KEY is set; without
#   the key it refuses to leave the old .sig next to the changed AppImage.
set -euo pipefail

DISPLAY_LIBS=(
  libwayland-client.so.0
  libxcb-randr.so.0
  libxcb-shm.so.0
  libXau.so.6
)

image="${1:-}"
if [[ -z "$image" ]]; then
  version="$(node -p "require('./src-tauri/tauri.conf.json').version")"
  shopt -s nullglob
  images=(src-tauri/target/release/bundle/appimage/*_"$version"_*.AppImage)
  shopt -u nullglob
  if (( ${#images[@]} != 1 )); then
    echo "Expected one AppImage for version $version, found ${#images[@]}" >&2
    exit 1
  fi
  image="${images[0]}"
fi

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# An AppImage is a small runtime program followed by a squashfs image of the app.
chmod +x "$image"
offset="$("$image" --appimage-offset)"
compression="$(unsquashfs -s -o "$offset" "$image" | awk '$1 == "Compression" { print $2; exit }')"
if [[ -z "$compression" ]]; then
  echo "Could not read the compression of $image" >&2
  exit 1
fi
unsquashfs -no-progress -d "$work/AppDir" -o "$offset" "$image" > /dev/null

removed=0
for lib in "${DISPLAY_LIBS[@]}"; do
  while IFS= read -r -d '' path; do
    rm -f "$path"
    echo "Removed ${path#"$work/AppDir/"}"
    removed=$((removed + 1))
  done < <(find "$work/AppDir" -name "$lib*" -print0)
done
if (( removed == 0 )); then
  echo "$image bundles none of the display libraries, so it stays as it is."
  exit 0
fi

mksquashfs "$work/AppDir" "$work/files.squashfs" -root-owned -noappend -comp "$compression" -no-progress > /dev/null
head -c "$offset" "$image" > "$work/new.AppImage"
cat "$work/files.squashfs" >> "$work/new.AppImage"
chmod 755 "$work/new.AppImage"
mv -f "$work/new.AppImage" "$image"
echo "Repacked $image ($compression)"

if [[ -n "${TAURI_SIGNING_PRIVATE_KEY:-}" ]]; then
  # Without a password variable the signer asks for one. The release key's password is empty.
  TAURI_SIGNING_PRIVATE_KEY_PASSWORD="${TAURI_SIGNING_PRIVATE_KEY_PASSWORD:-}" npx tauri signer sign "$image" > /dev/null
  echo "Signed $image again"
elif [[ -e "$image.sig" ]]; then
  echo "$image.sig belongs to the old AppImage, and TAURI_SIGNING_PRIVATE_KEY is not set to sign the new one" >&2
  exit 1
fi
