/**
 * The vault folder, as the sync engine sees it: a flat namespace of text files at relative
 * paths. Deliberately small, so a second implementation — a Git remote, say — is a day's
 * work rather than a redesign.
 *
 * Every path is relative to the vault root and confined there by the adapter. Bodies are
 * text because a `.mpv` file is a header line plus base64, which keeps the whole surface on
 * one set of commands and keeps the files greppable in Dropbox.
 */

export const VAULT_DESCRIPTOR_PATH = "vault.json";

export type VaultScanEntry = {
  relPath: string;
  size: number;
  /**
   * The file's first line, which for a `.mpv` file is its whole header. Null when the file
   * is empty, not UTF-8, or has an implausibly long first line — all of which mean "skip and
   * report", never "absent".
   */
  headerLine: string | null;
  /**
   * Last-modified time in milliseconds since the epoch, where the filesystem will say. Used
   * only as a safety margin when reclaiming space, never for a sync decision.
   */
  modifiedMs?: number | null;
};

export type VaultProbe = {
  exists: boolean;
  writable: boolean;
  hasDescriptor: boolean;
  /** Files the allowlist rejected: sync-client conflict copies, stray documents. */
  ignoredFiles: number;
  /**
   * iCloud `.icloud` placeholders — content not downloaded yet. This must read as "your
   * vault has not finished downloading", never as "your vault is empty".
   */
  undownloadedFiles: number;
};

export interface VaultRemote {
  /** Creates the vault directory tree if needed; returns the canonical path. */
  init(dir: string): Promise<string>;
  probe(dir: string): Promise<VaultProbe>;
  /** Every recognised file with its header line, in one round trip. */
  scan(dir: string): Promise<VaultScanEntry[]>;
  read(dir: string, relPath: string): Promise<string | null>;
  /** Atomic: written to a temp name in the same directory, then renamed. */
  write(dir: string, relPath: string, contents: string): Promise<void>;
  remove(dir: string, relPath: string): Promise<void>;
}

/** Where each kind of entry lives. Mirrored by the Rust path allowlist. */
export const vaultPaths = {
  palace: (palaceId: string) => `palaces/${palaceId}.mpv`,
  tombstone: (palaceId: string) => `tombstones/${palaceId}.mpv`,
  analyticsShard: (deviceId: string) => `streams/analytics/${deviceId}.mpv`,
  aarShard: (deviceId: string) => `streams/aar/${deviceId}.mpv`,
  asset: (contentHash: string) => `assets/${contentHash}.mpv`,
} as const;

// A conservative charset rather than a strict UUID: it still makes a sync client's
// `Palace (David's conflicted copy 2026-09-23).mpv` unrepresentable — spaces, parentheses
// and apostrophes are all rejected — without silently ignoring a legitimately named shard.
const NAME = "[A-Za-z0-9_-]{1,64}";
const PALACE_RE = new RegExp(`^palaces/(${NAME})\\.mpv$`);
const TOMBSTONE_RE = new RegExp(`^tombstones/(${NAME})\\.mpv$`);
const ANALYTICS_RE = new RegExp(`^streams/analytics/(${NAME})\\.mpv$`);
const AAR_RE = new RegExp(`^streams/aar/(${NAME})\\.mpv$`);
const ASSET_RE = /^assets\/([0-9a-f]{64})\.mpv$/;

export type VaultPathInfo =
  | { kind: "palace"; palaceId: string }
  | { kind: "tombstone"; palaceId: string }
  | { kind: "analytics"; deviceId: string }
  | { kind: "aar"; deviceId: string }
  | { kind: "asset"; contentHash: string };

/**
 * Classifies a path, and by construction ignores anything a sync client invented — Dropbox's
 * `Palace (David's conflicted copy 2026-09-23).mpv` has spaces and parentheses, so it can
 * never be mistaken for a palace. Such files are counted and surfaced rather than silently
 * skipped, because an invisible exclusion is its own kind of failure.
 */
export function classifyVaultPath(relPath: string): VaultPathInfo | null {
  const palace = PALACE_RE.exec(relPath);
  if (palace) return { kind: "palace", palaceId: palace[1] };
  const tombstone = TOMBSTONE_RE.exec(relPath);
  if (tombstone) return { kind: "tombstone", palaceId: tombstone[1] };
  const analytics = ANALYTICS_RE.exec(relPath);
  if (analytics) return { kind: "analytics", deviceId: analytics[1] };
  const aar = AAR_RE.exec(relPath);
  if (aar) return { kind: "aar", deviceId: aar[1] };
  const asset = ASSET_RE.exec(relPath);
  if (asset) return { kind: "asset", contentHash: asset[1] };
  return null;
}
