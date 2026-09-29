/**
 * Sync vault preferences, read and written from one place so the Settings panel and the
 * sync engine agree on keys and semantics. Same shape as meterPreferences.ts.
 *
 * The passphrase is deliberately absent and must stay that way. Storing it — or the key
 * derived from it — would put the plaintext of the vault within reach of anyone with access
 * to this machine's browser storage, which is exactly what end-to-end encryption is meant to
 * prevent. It lives in memory for the session and is typed again next launch.
 *
 * localStorage is only a synchronous cache here. The webview's storage is not somewhere a
 * connection can be trusted to survive — it is per-origin, so a dev build and an installed
 * build never share it, and it sits beside megabytes of canvas drafts under a quota — and
 * losing the connection is not harmless: the next "connect" to the same folder needs the
 * passphrase again, and a new device id orphans this device's shard in the vault. So every
 * write is mirrored to a file in the app data folder, which is where the palaces themselves
 * live, and `hydrateSyncPreferences` restores from that file at startup.
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

const ALL_KEYS = [
  SYNC_VAULT_DIR_KEY,
  SYNC_VAULT_ID_KEY,
  SYNC_DEVICE_ID_KEY,
  SYNC_DEVICE_NAME_KEY,
  SYNC_LAST_RUN_KEY,
] as const;

type SyncPreferenceKey = (typeof ALL_KEYS)[number];
export type SyncPreferenceValues = Partial<Record<SyncPreferenceKey, string>>;

/** Where the preferences outlive the webview. The desktop app's is a file in app data. */
export type DurableSyncPreferences = {
  load(): Promise<SyncPreferenceValues | null>;
  save(values: SyncPreferenceValues): Promise<void>;
};

let durable: DurableSyncPreferences | null = null;
/** What the durable file holds, once one is attached. Also the fallback for reads. */
let mirror: SyncPreferenceValues | null = null;

function read(key: SyncPreferenceKey): string | null {
  const value = storage()?.getItem(key)?.trim() || mirror?.[key];
  return value ? value : null;
}

function cacheWrite(key: SyncPreferenceKey, value: string | null) {
  const store = storage();
  if (!store) return;
  try {
    if (value) store.setItem(key, value);
    else store.removeItem(key);
  } catch {
    // Over quota. The durable copy is the one that counts, and reads fall back to it.
  }
}

let saving: Promise<void> | null = null;
let dirty = false;

/** Writes are serialized and coalesced, so a burst of them lands as the last state. */
function persist() {
  if (!durable) return;
  dirty = true;
  if (saving) return;
  const target = durable;
  saving = (async () => {
    while (dirty) {
      dirty = false;
      try {
        await target.save({ ...mirror });
      } catch (error) {
        console.warn("Could not save sync settings to the app data folder", error);
      }
    }
    saving = null;
  })();
}

function write(key: SyncPreferenceKey, value: string | null) {
  const trimmed = value?.trim() || null;
  cacheWrite(key, trimmed);
  if (!mirror) return;
  if (trimmed) mirror[key] = trimmed;
  else delete mirror[key];
  persist();
}

/**
 * Called once at startup, before anything reads a connection. The durable file wins when it
 * has anything, and is seeded from localStorage when it does not — which is how a connection
 * made before the file existed carries over instead of being dropped.
 */
export async function hydrateSyncPreferences(backend: DurableSyncPreferences): Promise<void> {
  let stored: SyncPreferenceValues | null = null;
  try {
    stored = await backend.load();
  } catch (error) {
    console.warn("Could not read sync settings from the app data folder", error);
  }
  durable = backend;
  const fromFile: SyncPreferenceValues = {};
  for (const key of ALL_KEYS) {
    const value = stored?.[key];
    if (typeof value === "string" && value.trim()) fromFile[key] = value.trim();
  }
  if (Object.keys(fromFile).length > 0) {
    mirror = fromFile;
    for (const key of ALL_KEYS) cacheWrite(key, fromFile[key] ?? null);
    return;
  }
  mirror = {};
  for (const key of ALL_KEYS) {
    const value = storage()?.getItem(key)?.trim();
    if (value) mirror[key] = value;
  }
  if (Object.keys(mirror).length > 0) persist();
}

/** Resolves once every queued durable write has landed. */
export async function flushSyncPreferences(): Promise<void> {
  while (saving) await saving;
}

/** Test hook: detach the durable backend. */
export function resetDurableSyncPreferences() {
  durable = null;
  mirror = null;
  dirty = false;
  saving = null;
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
