# Releasing

## Flow

1. Bump the version in **all** of: `package.json` (+lock via `npm version X.Y.Z --no-git-tag-version`), `src-tauri/Cargo.toml` (+`Cargo.lock`), `src-tauri/tauri.conf.json`, `mcp-server/src/index.ts`.
2. Add a `CHANGELOG.md` entry.
3. Commit `chore(release): vX.Y.Z`, tag `vX.Y.Z`, push the branch and the tag.
4. The tag triggers `.github/workflows/release.yml` (tauri-action): builds Windows/macOS/Linux installers, signs the updater artifacts, generates `latest.json`, and creates a **draft** release.
5. Publish: `gh release edit vX.Y.Z --draft=false --latest`.

## Self-update (tauri-plugin-updater)

- Installed apps check `https://github.com/DavidTbilisi/memory-palace-lab/releases/latest/download/latest.json` on startup and offer "Install & restart" (see `src/components/UpdateBanner.tsx`). Works for installs of v0.8.0 and newer.
- Updater artifacts are signed in CI with the `TAURI_SIGNING_PRIVATE_KEY` repo secret. The keypair lives at `~/.tauri/memory-palace-lab.key(.pub)` on the dev machine and has an **empty password**.
- **Back up the private key.** If it is lost, existing installs can never accept another update (the public key is baked into `tauri.conf.json`), and users would have to reinstall manually.
- `latest.json` resolves from the **published** latest release — drafts are invisible to the updater, so nothing ships until step 5.
