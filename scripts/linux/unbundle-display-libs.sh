#!/usr/bin/env bash
# Takes the display libraries out of the Linux AppImage so it uses the host's copies,
# then signs the AppImage again for the updater.
#
# The AppImage is built on Ubuntu 22.04 and bundles that release's libwayland,
# libxkbcommon, and a few libxcb/libX libraries. Mesa on newer systems (Fedora 44 ships
# Mesa 26) cannot load next to those old copies, so WebKitWebProcess aborts on start with
# "Could not create default EGL display: EGL_BAD_PARAMETER". Every desktop that can show
# the app already has these libraries.
# Upstream: https://github.com/tauri-apps/tauri/issues/15976
#
# Usage: unbundle-display-libs.sh [path/to/app.AppImage]
#   Without an argument it takes the AppImage of the version in src-tauri/tauri.conf.json.
#   Needs squashfs-tools. Signs the result when TAURI_SIGNING_PRIVATE_KEY is set; without
#   the key it refuses to leave the old .sig next to the changed AppImage.
set -euo pipefail

DISPLAY_LIBS=(
  libwayland-client.so.0
  libwayland-cursor.so.0
  libwayland-egl.so.1
  libwayland-server.so.0
  libxkbcommon.so.0
  libxcb-randr.so.0
  libxcb-render.so.0
  libxcb-shm.so.0
  libXau.so.6
  libXdmcp.so.6
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
