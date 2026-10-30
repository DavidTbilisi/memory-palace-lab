import type { AssetStore, LocalAssetFile } from "../../domain/repositories/assetStore";
import { imageExtension } from "../../domain/sync/imageMediaTypes";

/**
 * Image files for a simulated device: a map from path to bytes. Each device in a test gets
 * its own, with its own directory prefix, so a path from one is meaningless on the other —
 * which is precisely the problem asset syncing exists to solve.
 */
export type MemoryAssetStore = AssetStore & {
  files: Map<string, LocalAssetFile>;
  /** Put an image on this device, as importing a background would. */
  seed(localPath: string, file: LocalAssetFile): void;
};

export function createMemoryAssetStore(root = "/device"): MemoryAssetStore {
  const files = new Map<string, LocalAssetFile>();

  return {
    files,
    seed(localPath, file) {
      files.set(localPath, file);
    },
    async read(localPath) {
      return files.get(localPath) ?? null;
    },
    async locate(contentHash) {
      for (const path of files.keys()) {
        const name = path.slice(path.lastIndexOf("/") + 1);
        if (name.startsWith(`${contentHash}.`)) return { path, url: `asset://localhost${path}` };
      }
      return null;
    },
    async write(contentHash, file) {
      const path = `${root}/${contentHash}.${imageExtension(file.mimeType)}`;
      files.set(path, file);
      return { path, url: `asset://localhost${path}` };
    },
  };
}
