import {
  buildVaultFile,
  parseVaultFile,
  VaultFormatError,
  type VaultFile,
  type VaultHeader,
} from "./vaultFile";

/**
 * All vault encryption, using WebCrypto only — no new dependencies.
 *
 * A passphrase derives an AES-GCM key through PBKDF2-SHA256. The vault folder holds nothing
 * but ciphertext and the KDF parameters needed to re-derive that key, so whoever hosts the
 * folder (Dropbox, iCloud, a NAS) can never read a palace.
 *
 * The derived key is returned as a non-extractable `CryptoKey` and is meant to be held in a
 * module-level variable for the session. It must never reach zustand state (devtools
 * serialize it), localStorage, SQLite or the vault itself.
 */

export const KDF_NAME = "pbkdf2-sha256";
export const KDF_ITERATIONS = 600_000;
export const ENC_PLAIN = "aes-gcm-256";
export const ENC_GZIP = "gzip+aes-gcm-256";

const IV_BYTES = 12;
const SALT_BYTES = 16;
const VERIFIER_PLAINTEXT = "mpvault-verify-v1";

export class VaultPassphraseError extends Error {}

export type VaultKdfParams = {
  name: "PBKDF2";
  hash: "SHA-256";
  iterations: number;
  salt: string;
};

export type VaultDescriptor = {
  magic: "mpvault";
  format: 1;
  vaultId: string;
  createdAt: string;
  kdf: VaultKdfParams;
  verifier: { iv: string; ciphertext: string };
};

export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function fromBase64(text: string): Uint8Array {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Compression is worth it here: the dominant payload is the tldraw JSON blob, which gzips
 * roughly five to one, and base64 then adds a third back on top of whatever is left. The
 * header records which encoding was used, so a file written where `CompressionStream` is
 * missing (older jsdom, for instance) still reads correctly everywhere else.
 */
async function streamThrough(bytes: Uint8Array, stream: TransformStream<Uint8Array, Uint8Array>) {
  const source = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
  const response = new Response(source.pipeThrough(stream));
  return new Uint8Array(await response.arrayBuffer());
}

async function gzip(bytes: Uint8Array): Promise<Uint8Array> {
  return streamThrough(bytes, new CompressionStream("gzip"));
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  return streamThrough(bytes, new DecompressionStream("gzip"));
}

/**
 * Whether this runtime can actually round-trip gzip, established by doing it once rather
 * than by testing for the globals. jsdom, for one, defines `CompressionStream` but not every
 * stream primitive it needs, and a vault written by a runtime that only *looked* capable
 * would be unreadable. The answer is cached for the session.
 */
let compressionSupport: Promise<boolean> | null = null;

function canCompress(): Promise<boolean> {
  compressionSupport ??= (async () => {
    if (typeof CompressionStream === "undefined" || typeof DecompressionStream === "undefined") {
      return false;
    }
    try {
      const probe = new TextEncoder().encode("mpvault-compression-probe");
      const round = await gunzip(await gzip(probe));
      return new TextDecoder().decode(round) === "mpvault-compression-probe";
    } catch {
      return false;
    }
  })();
  return compressionSupport;
}

export async function deriveVaultKey(passphrase: string, kdf: VaultKdfParams): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: kdf.hash,
      iterations: kdf.iterations,
      salt: fromBase64(kdf.salt) as BufferSource,
    },
    material,
    { name: "AES-GCM", length: 256 },
    false, // non-extractable: the key cannot be read back out of the browser
    ["encrypt", "decrypt"],
  );
}

/** Creates a fresh vault identity. The passphrase is used once here and never stored. */
export async function createVaultDescriptor(
  passphrase: string,
  now: Date = new Date(),
): Promise<{ descriptor: VaultDescriptor; key: CryptoKey }> {
  const kdf: VaultKdfParams = {
    name: "PBKDF2",
    hash: "SHA-256",
    iterations: KDF_ITERATIONS,
    salt: toBase64(randomBytes(SALT_BYTES)),
  };
  const key = await deriveVaultKey(passphrase, kdf);
  const iv = randomBytes(IV_BYTES);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      new TextEncoder().encode(VERIFIER_PLAINTEXT),
    ),
  );
  return {
    descriptor: {
      magic: "mpvault",
      format: 1,
      vaultId: crypto.randomUUID(),
      createdAt: now.toISOString(),
      kdf,
      verifier: { iv: toBase64(iv), ciphertext: toBase64(ciphertext) },
    },
    key,
  };
}

/**
 * Unlocks a vault, giving an immediate and unambiguous answer about the passphrase instead
 * of a confusing decryption failure later on some arbitrary palace file. Returns null when
 * the passphrase is wrong, so the caller can say so plainly.
 */
export async function unlockVault(
  passphrase: string,
  descriptor: VaultDescriptor,
): Promise<CryptoKey | null> {
  const key = await deriveVaultKey(passphrase, descriptor.kdf);
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(descriptor.verifier.iv) as BufferSource },
      key,
      fromBase64(descriptor.verifier.ciphertext) as BufferSource,
    );
    if (new TextDecoder().decode(plaintext) !== VERIFIER_PLAINTEXT) return null;
    return key;
  } catch {
    return null;
  }
}

export function parseVaultDescriptor(text: string): VaultDescriptor | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const value = parsed as Partial<VaultDescriptor>;
  if (value.magic !== "mpvault" || value.format !== 1) return null;
  if (typeof value.vaultId !== "string" || !value.kdf || !value.verifier) return null;
  const { kdf, verifier } = value;
  if (typeof kdf.iterations !== "number" || typeof kdf.salt !== "string") return null;
  if (typeof verifier.iv !== "string" || typeof verifier.ciphertext !== "string") return null;
  return value as VaultDescriptor;
}

/**
 * Encrypts `payload` into a complete `.mpv` file, binding it to its own header line: the
 * header bytes go in as AES-GCM additional data, so altering `rev` or `contentHash` on disk
 * makes the body refuse to decrypt rather than quietly misdirecting the next sync.
 */
export async function sealVaultFile(
  key: CryptoKey,
  header: Omit<VaultHeader, "enc" | "kdf">,
  payload: unknown,
): Promise<string> {
  const raw = new TextEncoder().encode(JSON.stringify(payload));
  const compress = await canCompress();
  const body = compress ? await gzip(raw) : raw;
  const fullHeader: VaultHeader = {
    ...header,
    enc: compress ? ENC_GZIP : ENC_PLAIN,
    kdf: KDF_NAME,
  };

  // Build the line first: it is the AAD, so it has to be the exact bytes written to disk.
  const file = buildVaultFile(fullHeader, "");
  const headerLine = file.slice(0, file.indexOf("\n"));
  const iv = randomBytes(IV_BYTES);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
        additionalData: new TextEncoder().encode(headerLine) as BufferSource,
      },
      key,
      body as BufferSource,
    ),
  );
  const packed = new Uint8Array(iv.length + ciphertext.length);
  packed.set(iv, 0);
  packed.set(ciphertext, iv.length);
  return `${headerLine}\n${toBase64(packed)}\n`;
}

export type OpenedVaultFile<T> = { header: VaultHeader; payload: T };

/**
 * Decrypts a `.mpv` file. Throws `VaultFormatError` for anything unreadable — a truncated
 * file from a sync client mid-write, a tampered header, the wrong key. Callers turn that into
 * "skipped, reported", never into "this palace is empty" and never into a deletion.
 */
export async function openVaultFile<T>(key: CryptoKey, text: string): Promise<OpenedVaultFile<T>> {
  const parsed: VaultFile | null = parseVaultFile(text);
  if (!parsed) throw new VaultFormatError("Not a readable vault file.");

  let packed: Uint8Array;
  try {
    packed = fromBase64(parsed.bodyBase64);
  } catch {
    throw new VaultFormatError("Vault file body is not valid base64.");
  }
  if (packed.length <= IV_BYTES) throw new VaultFormatError("Vault file body is truncated.");

  const iv = packed.slice(0, IV_BYTES);
  const ciphertext = packed.slice(IV_BYTES);
  let body: Uint8Array;
  try {
    body = new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv as BufferSource,
          additionalData: new TextEncoder().encode(parsed.headerLine) as BufferSource,
        },
        key,
        ciphertext as BufferSource,
      ),
    );
  } catch {
    throw new VaultFormatError("Vault file failed to decrypt (wrong key or altered file).");
  }

  if (parsed.header.enc === ENC_GZIP) {
    if (!(await canCompress())) {
      throw new VaultFormatError("Vault file is compressed but this runtime cannot decompress it.");
    }
    body = await gunzip(body);
  }

  try {
    return { header: parsed.header, payload: JSON.parse(new TextDecoder().decode(body)) as T };
  } catch {
    throw new VaultFormatError("Vault file payload is not valid JSON.");
  }
}
