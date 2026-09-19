#!/usr/bin/env bash
# Checks an AppImage's libraries against this system without starting the app.
# .github/workflows/appimage.yml runs it on Fedora; it also works on a Linux desktop.
#
# Usage: check-appimage-libs.sh <app.AppImage>
#   Looks for two problems, with the AppImage's libraries found first, as in the app:
#   - a Mesa library of this system that does not link against the AppImage's copies
#     ("undefined symbol"). Then EGL fails and WebKitWebProcess aborts.
#   - a library the app or its WebKit processes need that neither the AppImage nor the
#     system has ("not found"). Then the app does not start.
#   - no system OpenGL ES library, which WebKit opens at runtime. Then WebKitWebProcess aborts.
#   Exits 1 if it finds any of them.
set -uo pipefail

image="$(realpath "$1")"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
chmod +x "$image"
(cd "$work" && "$image" --appimage-extract > /dev/null)
appdir="$work/squashfs-root"
problems=0

mapfile -t mesa_libs < <(ldconfig -p | awk '/libEGL_mesa\.so\.0 |libgallium-.*\.so |libgbm\.so\.1 / { print $NF }' | sort -u)
if (( ${#mesa_libs[@]} == 0 )); then
  echo "No Mesa libraries found on this system" >&2
  exit 1
fi
for lib in "${mesa_libs[@]}"; do
  undefined="$(LD_LIBRARY_PATH="$appdir/usr/lib" ldd -r "$lib" 2>&1 | grep "undefined symbol")"
  if [[ -n "$undefined" ]]; then
    echo "$lib does not link against the AppImage's libraries:"
    echo "$undefined"
    problems=$((problems + 1))
  else
    echo "ok: $lib"
  fi
done

# WebKit's libepoxy opens this library with dlopen, so ldd does not list it.
if ldconfig -p | grep -q "libGLESv2\.so\.2 "; then
  echo "ok: libGLESv2.so.2"
else
  echo "This system lacks libGLESv2.so.2, which WebKit opens at runtime (Fedora package: libglvnd-gles)"
  problems=$((problems + 1))
fi

while IFS= read -r -d '' binary; do
  missing="$(LD_LIBRARY_PATH="$appdir/usr/lib" ldd "$binary" 2>&1 | grep "not found")"
  if [[ -n "$missing" ]]; then
    echo "${binary#"$appdir/"} needs libraries that neither the AppImage nor this system has:"
    echo "$missing"
    problems=$((problems + 1))
  else
    echo "ok: ${binary#"$appdir/"}"
  fi
done < <(find "$appdir/usr/bin" "$appdir/usr/lib" -type f \( -path '*/usr/bin/*' -o -path '*/webkit2gtk-4.1/*' \) -print0)

if (( problems > 0 )); then
  echo "RESULT: $problems problem(s) in $(basename "$image")"
  exit 1
fi
echo "RESULT: no library problems in $(basename "$image")"
