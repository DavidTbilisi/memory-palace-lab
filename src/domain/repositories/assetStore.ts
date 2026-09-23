/**
 * Where this device keeps the image files a palace refers to.
 *
 * Kept behind a port because the engine's job is to move bytes between the vault and "here",
 * and "here" is `$APPDATA/palace-backgrounds` on the desktop, a map in a test, and nothing at
 * all on the web.
 */

/** How one device refers to an image: a path to read it, and a URL the canvas can draw. */
export type LocalAssetRef = {
  path: string;
  url: string;
};

export type LocalAssetFile = {
  bytes: Uint8Array;
  mimeType: string;
};

export interface AssetStore {
  /** Reads an image this palace already refers to. Null when it is missing or unreadable. */
  read(localPath: string): Promise<LocalAssetFile | null>;
  /** Whether this device already holds the image with that content hash. */
  locate(contentHash: string): Promise<LocalAssetRef | null>;
  /** Stores an image pulled from the vault and says how to refer to it here. */
  write(contentHash: string, file: LocalAssetFile): Promise<LocalAssetRef>;
}
