/**
 * Sync vault preferences, read and written from one place so the Settings panel and the
 * sync engine agree on keys and semantics. Same shape as meterPreferences.ts.
 *
 * The passphrase is deliberately absent and must stay that way. Storing it — or the key
 * derived from it — would put the plaintext of the vault within reach of anyone with access
 * to this machine's browser storage, which is exactly what end-to-end encryption is meant to
 * prevent. It lives in memory for the session and is typed again next launch.
 */

export const SYNC_VAULT_DIR_KEY = "mp-sync-vault-dir";
export const SYNC_VAULT_ID_KEY = "mp-sync-vault-id";
export const SYNC_DEVICE_ID_KEY = "mp-sync-device-id";
export const SYNC_DEVICE_NAME_KEY = "mp-sync-device-name";
export const SYNC_LAST_RUN_KEY = "mp-sync-last-run";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function read(key: string): string | null {
  const value = storage()?.getItem(key)?.trim();
  return value ? value : null;
}

function write(key: string, value: string | null) {
  const store = storage();
  if (!store) return;
  const trimmed = value?.trim();
  if (trimmed) store.setItem(key, trimmed);
  else store.removeItem(key);
}

export type SyncConnection = {
  dir: string;
  vaultId: string;
};

export function loadSyncConnection(): SyncConnection | null {
  const dir = read(SYNC_VAULT_DIR_KEY);
  const vaultId = read(SYNC_VAULT_ID_KEY);
  // Both or neither: a directory without a vault id is a half-written connection, and
  // treating it as connected would let the app adopt whatever vault happens to be there.
  if (!dir || !vaultId) return null;
  return { dir, vaultId };
}

export function saveSyncConnection(connection: SyncConnection | null) {
  write(SYNC_VAULT_DIR_KEY, connection?.dir ?? null);
  write(SYNC_VAULT_ID_KEY, connection?.vaultId ?? null);
  if (!connection) write(SYNC_LAST_RUN_KEY, null);
}

/**
 * A stable id for this device, minted once. It is opaque and appears in the vault as a
 * stream shard filename; the readable device name stays inside the ciphertext.
 */
export function loadOrCreateDeviceId(): string {
  const existing = read(SYNC_DEVICE_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  write(SYNC_DEVICE_ID_KEY, id);
  return id;
}

export function loadDeviceName(): string {
  return read(SYNC_DEVICE_NAME_KEY) ?? "This device";
}

export function saveDeviceName(name: string | null) {
  write(SYNC_DEVICE_NAME_KEY, name);
}

export function loadLastSyncedAt(): string | null {
  return read(SYNC_LAST_RUN_KEY);
}

export function saveLastSyncedAt(iso: string | null) {
  write(SYNC_LAST_RUN_KEY, iso);
}
