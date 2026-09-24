import type { PalaceSnapshot } from "../entities/types";

/**
 * Images are the one part of a palace that does not travel on its own.
 *
 * A background is copied into `$APPDATA/palace-backgrounds/` and referenced by an absolute
 * path (`meta.mpBackgroundAssetPath`) plus the `asset://` URL tldraw draws from
 * (`convertFileSrc` of that path). Both are meaningless on another machine. So the vault
 * stores a portable reference — `mpvault://<sha256>` — and each device rewrites it to
 * wherever it put its own copy.
 *
 * Only local references are rewritten. An `http(s):` or `data:` URL is already portable and
 * is left exactly as it is.
 */

export const VAULT_ASSET_SCHEME = "mpvault://";

/** Keys that can hold an image reference. `src` is tldraw's own on asset records. */
const REF_KEYS = ["mpBackgroundAssetPath", "mpImageUrl", "src"] as const;

export type AssetRef = {
  /** The reference as it appears in the snapshot. */
  value: string;
  /** Where it points on this machine, for reading the bytes. */
  localPath: string;
};

export function isVaultAssetRef(value: string): boolean {
  return value.startsWith(VAULT_ASSET_SCHEME);
}

export function vaultAssetHash(value: string): string | null {
  if (!isVaultAssetRef(value)) return null;
  const hash = value.slice(VAULT_ASSET_SCHEME.length);
  return /^[0-9a-f]{64}$/.test(hash) ? hash : null;
}

/**
 * Whether a reference points at a file on this machine. `asset://` and
 * `http://asset.localhost/...` are what `convertFileSrc` produces on the various platforms;
 * a bare absolute path is what `mpBackgroundAssetPath` holds.
 */
export function localPathOf(value: string): string | null {
  if (!value || isVaultAssetRef(value)) return null;
  if (value.startsWith("data:")) return null;

  // Slice off the origin only, keeping the leading slash — the remainder is the absolute
  // path, and dropping that slash turns it into a relative one that resolves nowhere.
  for (const origin of ["asset://localhost", "http://asset.localhost", "https://asset.localhost"]) {
    if (value.startsWith(`${origin}/`)) return safeDecode(value.slice(origin.length));
  }
  // Anything else on the network is already portable and none of our business.
  if (/^https?:\/\//.test(value)) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)) return null;

  // Absolute POSIX or Windows path.
  if (value.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(value)) return value;
  return null;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Every distinct local file this palace refers to. */
export function collectLocalAssets(snapshot: PalaceSnapshot): AssetRef[] {
  const found = new Map<string, AssetRef>();
  walk(snapshot, (value) => {
    const localPath = localPathOf(value);
    if (localPath && !found.has(value)) found.set(value, { value, localPath });
    return value;
  });
  return [...found.values()];
}

/** Every vault asset hash this palace refers to. */
export function collectVaultAssetHashes(snapshot: PalaceSnapshot): string[] {
  const hashes = new Set<string>();
  walk(snapshot, (value) => {
    const hash = vaultAssetHash(value);
    if (hash) hashes.add(hash);
    return value;
  });
  return [...hashes];
}

/** Local references become `mpvault://<hash>`, ready to be written to the vault. */
export function portableizeAssets(
  snapshot: PalaceSnapshot,
  hashByValue: Map<string, string>,
): PalaceSnapshot {
  return walk(snapshot, (value) => {
    const hash = hashByValue.get(value);
    return hash ? `${VAULT_ASSET_SCHEME}${hash}` : value;
  });
}

/**
 * Vault references become this machine's own paths. A hash with no local file is left as the
 * `mpvault://` reference rather than blanked, so the image is merely missing for now and
 * reappears once the asset downloads — instead of being permanently erased from the palace.
 */
export function localizeAssets(
  snapshot: PalaceSnapshot,
  refByHash: Map<string, { path: string; url: string }>,
): PalaceSnapshot {
  return walk(snapshot, (value, key) => {
    const hash = vaultAssetHash(value);
    if (!hash) return value;
    const local = refByHash.get(hash);
    if (!local) return value;
    // The stored path is the canonical location; everything tldraw draws from is the URL.
    return key === "mpBackgroundAssetPath" ? local.path : local.url;
  });
}

/**
 * Applies `rewrite` to every image reference in the snapshot — the relational `imageUrl`
 * column and, more importantly, the serialized tldraw blob, which is where the background
 * and its asset record actually live.
 */
function walk(
  snapshot: PalaceSnapshot,
  rewrite: (value: string, key: string) => string,
): PalaceSnapshot {
  const clone = JSON.parse(JSON.stringify(snapshot)) as PalaceSnapshot;

  for (const node of clone.nodes) {
    if (typeof node.imageUrl === "string") {
      node.imageUrl = rewrite(node.imageUrl, "mpImageUrl");
    }
  }

  if (clone.palace.editorSnapshot) {
    try {
      const parsed = JSON.parse(clone.palace.editorSnapshot) as unknown;
      visit(parsed, rewrite);
      clone.palace.editorSnapshot = JSON.stringify(parsed);
    } catch {
      // An unparseable blob is left alone rather than throwing: a palace with a damaged
      // canvas should still sync its routes and review schedule.
    }
  }

  return clone;
}

function visit(value: unknown, rewrite: (value: string, key: string) => string): void {
  if (Array.isArray(value)) {
    for (const item of value) visit(item, rewrite);
    return;
  }
  if (typeof value !== "object" || value === null) return;

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const current = record[key];
    if (typeof current === "string" && (REF_KEYS as readonly string[]).includes(key)) {
      record[key] = rewrite(current, key);
    } else {
      visit(current, rewrite);
    }
  }
}
