# Releasing

## Flow

1. Bump the version in **all** of: `package.json` (+lock via `npm version X.Y.Z --no-git-tag-version`), `src-tauri/Cargo.toml` (+`Cargo.lock`), `src-tauri/tauri.conf.json`, `mcp-server/src/index.ts`.
2. Add a `CHANGELOG.md` entry.
3. Commit `chore(release): vX.Y.Z`, tag `vX.Y.Z`, push the branch and the tag.
4. The tag triggers `.github/workflows/release.yml` (tauri-action): builds Windows/macOS/Linux installers, signs the updater artifacts, generates `latest.json`, and creates a **draft** release.
5. Publish: `gh release edit vX.Y.Z --draft=false --latest`.

## Linux AppImage

- The Linux job builds on Ubuntu 22.04 through `scripts/linux/tauri-build.sh`. After `tauri build`, `scripts/linux/unbundle-display-libs.sh` takes `libwayland-client`, `libxcb-randr`, `libxcb-shm`, and `libXau` out of the AppImage and signs it again.
  - The host's Mesa loads these libraries, so they must be the host's versions, and every system with Mesa has them.
  - With the bundled Ubuntu 22.04 copies, Fedora 44's Mesa 26 cannot link (`libwayland-client` 1.20 lacks `wl_display_create_queue_with_name`). EGL fails to start, and WebKitWebProcess aborts on start with `Could not create default EGL display: EGL_BAD_PARAMETER` ([tauri#15976](https://github.com/tauri-apps/tauri/issues/15976)).
  - The upstream issue also removes libraries Mesa does not load. Keep `libwayland-server` bundled: WebKit needs it, and systems without a Wayland compositor may not have it.
  - tauri-action uploads the AppImage after the wrapper finishes, so `latest.json` gets the new signature.
- `.github/workflows/appimage.yml` runs when a pull request changes the Linux packaging. It builds the AppImage and tests it on Fedora 44 in two ways:
  - `scripts/linux/check-appimage-libs.sh` checks the libraries without starting the app.
  - `scripts/linux/smoke-appimage.sh` starts the app and checks that its web process keeps running.
  - Run the workflow by hand from the Actions tab after changing Tauri or WebKit versions.
  - Both scripts also work on a Linux desktop.
- AppImages up to v0.9.0 still bundle these libraries. On such systems, use the `.rpm` or `.deb`, or start the AppImage with the host's copies preloaded (Fedora paths):

  ```bash
  LD_PRELOAD=/usr/lib64/libwayland-client.so.0:/usr/lib64/libxcb-randr.so.0:/usr/lib64/libxcb-shm.so.0:/usr/lib64/libXau.so.6 ./Memory.Palace.Lab_0.9.0_amd64.AppImage
  ```

## Self-update (tauri-plugin-updater)

- Installed apps check `https://github.com/DavidTbilisi/memory-palace-lab/releases/latest/download/latest.json` on startup and offer "Install & restart" (see `src/components/UpdateBanner.tsx`). Works for installs of v0.8.0 and newer.
- Updater artifacts are signed in CI with the `TAURI_SIGNING_PRIVATE_KEY` repo secret. The keypair lives at `~/.tauri/memory-palace-lab.key(.pub)` on the dev machine and has an **empty password**.
- **Back up the private key.** If it is lost, existing installs can never accept another update (the public key is baked into `tauri.conf.json`), and users would have to reinstall manually.
- `latest.json` resolves from the **published** latest release — drafts are invisible to the updater, so nothing ships until step 5.
