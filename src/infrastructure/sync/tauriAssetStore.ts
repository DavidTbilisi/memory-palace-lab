import type {
  AssetStore,
  LocalAssetFile,
  LocalAssetRef,
} from "../../domain/repositories/assetStore";
import { imageExtension, imageMediaType } from "../../domain/sync/imageMediaTypes";

/**
 * Images on this device, in the same directory backgrounds are already imported into.
 *
 * Unlike the vault folder this needs no Rust command: `$APPDATA` is inside the JS filesystem
 * scope (`fs:allow-appdata-read-recursive` / `-write-recursive` in capabilities/default.json),
 * so the plugin can read and write it directly.
 *
 * Pulled files are named by content hash. That makes "do I already have this?" a single
 * existence check, and means two palaces sharing a background share one file.
 */

const ASSET_DIR = "palace-backgrounds";

async function fs() {
  return import("@tauri-apps/plugin-fs");
}

async function refFor(relPath: string): Promise<LocalAssetRef> {
  const { appDataDir, join } = await import("@tauri-apps/api/path");
  const { convertFileSrc } = await import("@tauri-apps/api/core");
  const path = await join(await appDataDir(), relPath);
  return { path, url: convertFileSrc(path) };
}

export function createTauriAssetStore(): AssetStore {
  return {
    async read(localPath) {
      try {
        const { readFile } = await fs();
        const bytes = await readFile(localPath);
        return { bytes, mimeType: imageMediaType(localPath) };
      } catch {
        // A background whose file was moved or deleted. The palace still syncs; the
        // reference is simply left pointing where it always did.
        return null;
      }
    },

    async locate(contentHash) {
      try {
        const { readDir, BaseDirectory } = await fs();
        const entries = await readDir(ASSET_DIR, { baseDir: BaseDirectory.AppData });
        const match = entries.find((entry) => entry.name?.startsWith(`${contentHash}.`));
        if (!match?.name) return null;
        return refFor(`${ASSET_DIR}/${match.name}`);
      } catch {
        return null;
      }
    },

    async write(contentHash, file: LocalAssetFile) {
      const { mkdir, writeFile, BaseDirectory } = await fs();
      const name = `${contentHash}.${imageExtension(file.mimeType)}`;
      await mkdir(ASSET_DIR, { baseDir: BaseDirectory.AppData, recursive: true });
      await writeFile(`${ASSET_DIR}/${name}`, file.bytes, { baseDir: BaseDirectory.AppData });
      return refFor(`${ASSET_DIR}/${name}`);
    },
  };
}
