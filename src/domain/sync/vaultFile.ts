/**
 * The `.mpv` container: one JSON header line, then one base64 ciphertext line.
 *
 *   {"magic":"mpvault","format":1,"header":{…}}\n
 *   <base64 of iv(12) || AES-GCM ciphertext+tag>\n
 *
 * Why two lines rather than one JSON object with the ciphertext as a field:
 *
 *  - **A whole-vault scan reads only line 1.** Deciding "is there anything to do?" across
 *    thirty 1 MB palaces costs kilobytes. Nesting the ciphertext would force a full read of
 *    every file just to learn a revision number.
 *  - **The header authenticates itself.** Line 1's exact bytes are passed to AES-GCM as
 *    `additionalData`, so a tampered or corrupted header fails decryption. Without that, the
 *    cleartext `rev` and `contentHash` are forgeable, and forging them makes the app skip a
 *    pull or pick the wrong side of a conflict. Using the bytes actually read as the AAD also
 *    means verification never needs a second canonical serializer.
 *  - **It stays greppable.** People will open this folder in Dropbox; `head -1` telling them
 *    which palace a file holds and when it changed is worth a lot.
 */

export const VAULT_MAGIC = "mpvault";
export const VAULT_FORMAT = 1;

export type VaultEntryKind = "palace" | "tombstone" | "analytics" | "aar" | "asset";

export type VaultHeader = {
  kind: VaultEntryKind;
  /** Absent on stream shards and assets, which are keyed by device id or content hash. */
  palaceId?: string;
  rev: number;
  /** Display only. No decision in syncPlan reads this — that is how clock skew is handled. */
  updatedAt: string;
  contentHash: string;
  /** Opaque per-device UUID. The human-readable device name lives inside the ciphertext. */
  writerDeviceId: string;
  enc: string;
  kdf: string;
};

export type VaultFile = {
  header: VaultHeader;
  /** Line 1 verbatim — this is the AAD, so it must be the bytes that were on disk. */
  headerLine: string;
  bodyBase64: string;
};

export class VaultFormatError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Validates a header line without touching the body. This is what a vault scan calls on the
 * first line of every file, so it must never throw on junk — a file that fails here is
 * reported as unreadable and skipped, never treated as an empty or deleted palace.
 */
export function parseHeaderLine(line: string): VaultHeader | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;
  if (parsed.magic !== VAULT_MAGIC) return null;
  if (parsed.format !== VAULT_FORMAT) return null;

  const header = parsed.header;
  if (!isRecord(header)) return null;
  const { kind, rev, updatedAt, contentHash, writerDeviceId, enc, kdf, palaceId } = header;
  if (
    typeof kind !== "string" ||
    typeof rev !== "number" ||
    typeof updatedAt !== "string" ||
    typeof contentHash !== "string" ||
    typeof writerDeviceId !== "string" ||
    typeof enc !== "string" ||
    typeof kdf !== "string"
  ) {
    return null;
  }
  if (palaceId !== undefined && typeof palaceId !== "string") return null;

  return {
    kind: kind as VaultEntryKind,
    ...(typeof palaceId === "string" ? { palaceId } : {}),
    rev,
    updatedAt,
    contentHash,
    writerDeviceId,
    enc,
    kdf,
  };
}

/**
 * Serializes a header line. `JSON.stringify` escapes control characters, so the result is
 * always a single line even if a field value contains one — which the two-line container and
 * the AAD binding both depend on.
 */
export function buildHeaderLine(header: VaultHeader): string {
  return JSON.stringify({ magic: VAULT_MAGIC, format: VAULT_FORMAT, header });
}

export function buildVaultFile(header: VaultHeader, bodyBase64: string): string {
  return `${buildHeaderLine(header)}\n${bodyBase64}\n`;
}

/** Splits a `.mpv` file. Returns null for anything malformed — callers skip and report. */
export function parseVaultFile(text: string): VaultFile | null {
  const newline = text.indexOf("\n");
  if (newline < 0) return null;
  const headerLine = text.slice(0, newline);
  const header = parseHeaderLine(headerLine);
  if (!header) return null;
  const bodyBase64 = text.slice(newline + 1).trim();
  if (!bodyBase64) return null;
  return { header, headerLine, bodyBase64 };
}
