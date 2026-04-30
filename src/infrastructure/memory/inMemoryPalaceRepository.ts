import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { AnalyticsEvent, Palace, PalaceSnapshot } from "../../domain/entities/types";

const PALACES_STORAGE_KEY = "memory-palace:palace-snapshots";
const ANALYTICS_STORAGE_KEY = "memory-palace:analytics-events";
const BROWSER_DB_NAME = "memory-palace-lab";
const BROWSER_DB_VERSION = 1;
const PALACE_STORE_NAME = "palace-snapshots";
const ANALYTICS_STORE_NAME = "analytics-events";
const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

type StoredPalaceRecord = {
  id: string;
  snapshot: PalaceSnapshot;
};

function readStoredPalaceSnapshots() {
  if (typeof window === "undefined") return [] as PalaceSnapshot[];
  try {
    const raw = window.localStorage.getItem(PALACES_STORAGE_KEY);
    if (!raw) return [] as PalaceSnapshot[];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PalaceSnapshot[]) : [];
  } catch {
    return [] as PalaceSnapshot[];
  }
}

function readStoredAnalyticsEvents() {
  if (typeof window === "undefined") return [] as AnalyticsEvent[];
  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return [] as AnalyticsEvent[];
    const parsed = JSON.parse(raw) as AnalyticsEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as AnalyticsEvent[];
  }
}

function writeStoredAnalyticsEvents(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch {
    return false;
  }
}

function writeStoredPalaceSnapshots(snapshots: PalaceSnapshot[]) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(PALACES_STORAGE_KEY, JSON.stringify(snapshots));
    return true;
  } catch {
    return false;
  }
}

function removeStoredItem(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage access failures; the IndexedDB write already succeeded.
  }
}

function cloneSnapshot(snapshot: PalaceSnapshot) {
  return JSON.parse(JSON.stringify(snapshot)) as PalaceSnapshot;
}

function cloneAnalyticsEvent(event: AnalyticsEvent) {
  return JSON.parse(JSON.stringify(event)) as AnalyticsEvent;
}

function canUseIndexedDb() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

let databasePromise: Promise<IDBDatabase | null> | null = null;

function openBrowserDatabase() {
  if (!canUseIndexedDb()) return Promise.resolve(null);
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve) => {
    const request = window.indexedDB.open(BROWSER_DB_NAME, BROWSER_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PALACE_STORE_NAME)) {
        database.createObjectStore(PALACE_STORE_NAME, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(ANALYTICS_STORE_NAME)) {
        database.createObjectStore(ANALYTICS_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
  });

  return databasePromise;
}

function waitForRequest<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
    request.onsuccess = () => resolve(request.result);
  });
}

function waitForTransaction(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
  });
}

async function readIndexedDbPalaceSnapshots() {
  const database = await openBrowserDatabase();
  if (!database) return null;

  try {
    const transaction = database.transaction(PALACE_STORE_NAME, "readonly");
    const records = await waitForRequest<StoredPalaceRecord[]>(
      transaction.objectStore(PALACE_STORE_NAME).getAll() as IDBRequest<StoredPalaceRecord[]>,
    );
    return records.map((record) => cloneSnapshot(record.snapshot));
  } catch {
    return null;
  }
}

async function writeIndexedDbPalaceSnapshots(snapshots: PalaceSnapshot[]) {
  const database = await openBrowserDatabase();
  if (!database) return false;

  try {
    const transaction = database.transaction(PALACE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PALACE_STORE_NAME);
    store.clear();
    for (const snapshot of snapshots) {
      store.put({
        id: snapshot.palace.id,
        snapshot: cloneSnapshot(snapshot),
      } satisfies StoredPalaceRecord);
    }
    await waitForTransaction(transaction);
    return true;
  } catch {
    return false;
  }
}

async function readIndexedDbAnalyticsEvents() {
  const database = await openBrowserDatabase();
  if (!database) return null;

  try {
    const transaction = database.transaction(ANALYTICS_STORE_NAME, "readonly");
    const records = await waitForRequest<AnalyticsEvent[]>(
      transaction.objectStore(ANALYTICS_STORE_NAME).getAll() as IDBRequest<AnalyticsEvent[]>,
    );
    return records.map((event) => cloneAnalyticsEvent(event));
  } catch {
    return null;
  }
}

async function writeIndexedDbAnalyticsEvents(events: AnalyticsEvent[]) {
  const database = await openBrowserDatabase();
  if (!database) return false;

  try {
    const transaction = database.transaction(ANALYTICS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ANALYTICS_STORE_NAME);
    store.clear();
    for (const event of events) {
      store.put(cloneAnalyticsEvent(event));
    }
    await waitForTransaction(transaction);
    return true;
  } catch {
    return false;
  }
}

function purgeExpiredPalaces(palaces: Map<string, PalaceSnapshot>, now = Date.now()) {
  for (const [palaceId, snapshot] of palaces) {
    const purgeAt = snapshot.palace.purgeAt ? Date.parse(snapshot.palace.purgeAt) : Number.NaN;
    if (snapshot.palace.deletedAt && Number.isFinite(purgeAt) && purgeAt <= now) {
      palaces.delete(palaceId);
    }
  }
}

/** Browser-only fallback when Tauri APIs are unavailable (e.g. `vite` without `tauri dev`). */
export function createInMemoryPalaceRepository(): PalaceRepository {
  let palaces = new Map<string, PalaceSnapshot>(
    readStoredPalaceSnapshots().map((snapshot) => [snapshot.palace.id, cloneSnapshot(snapshot)]),
  );
  let analyticsEvents = readStoredAnalyticsEvents();
  let storageLoaded = false;
  let storageLoadPromise: Promise<void> | null = null;

  const hydrateBrowserStorage = async () => {
    if (storageLoaded) return;
    if (storageLoadPromise) return storageLoadPromise;

    storageLoadPromise = (async () => {
      const [indexedPalaces, indexedAnalyticsEvents] = await Promise.all([
        readIndexedDbPalaceSnapshots(),
        readIndexedDbAnalyticsEvents(),
      ]);

      if (indexedPalaces) {
        if (indexedPalaces.length > 0) {
          palaces = new Map(indexedPalaces.map((snapshot) => [snapshot.palace.id, cloneSnapshot(snapshot)]));
          removeStoredItem(PALACES_STORAGE_KEY);
        } else if (palaces.size > 0 && (await writeIndexedDbPalaceSnapshots([...palaces.values()]))) {
          removeStoredItem(PALACES_STORAGE_KEY);
        }
      }

      if (indexedAnalyticsEvents) {
        if (indexedAnalyticsEvents.length > 0) {
          analyticsEvents = indexedAnalyticsEvents.map((event) => cloneAnalyticsEvent(event));
          removeStoredItem(ANALYTICS_STORAGE_KEY);
        } else if (analyticsEvents.length > 0 && (await writeIndexedDbAnalyticsEvents(analyticsEvents))) {
          removeStoredItem(ANALYTICS_STORAGE_KEY);
        }
      }

      storageLoaded = true;
    })();

    await storageLoadPromise;
  };

  const persistPalaces = async () => {
    const snapshots = [...palaces.values()].map((snapshot) => cloneSnapshot(snapshot));
    if (await writeIndexedDbPalaceSnapshots(snapshots)) {
      removeStoredItem(PALACES_STORAGE_KEY);
      return;
    }
    writeStoredPalaceSnapshots(snapshots);
  };

  const persistAnalyticsEvents = async () => {
    const events = analyticsEvents.map((event) => cloneAnalyticsEvent(event));
    if (await writeIndexedDbAnalyticsEvents(events)) {
      removeStoredItem(ANALYTICS_STORAGE_KEY);
      return;
    }
    writeStoredAnalyticsEvents(events);
  };

  const purgeAndPersistIfNeeded = async () => {
    const before = palaces.size;
    purgeExpiredPalaces(palaces);
    if (palaces.size !== before) {
      await persistPalaces();
    }
  };

  return {
    async listPalaces() {
      await hydrateBrowserStorage();
      await purgeAndPersistIfNeeded();
      return [...palaces.values()].map((s) => s.palace).filter((palace) => !palace.deletedAt);
    },
    async listTrashedPalaces() {
      await hydrateBrowserStorage();
      await purgeAndPersistIfNeeded();
      return [...palaces.values()].map((s) => s.palace).filter((palace) => !!palace.deletedAt);
    },
    async createPalace(name: string, atlasPath?: string | null) {
      await hydrateBrowserStorage();
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const palace: Palace = {
        id,
        name,
        createdAt,
        alias: null,
        atlasPath: atlasPath?.trim() || null,
        deletedAt: null,
        purgeAt: null,
      };
      const snap: PalaceSnapshot = {
        palace,
        canvasObjects: [],
        nodes: [],
        edges: [],
        routes: [],
        loci: [],
      };
      palaces.set(id, snap);
      await persistPalaces();
      return palace;
    },
    async loadPalace(palaceId: string) {
      await hydrateBrowserStorage();
      await purgeAndPersistIfNeeded();
      const snapshot = palaces.get(palaceId) ?? null;
      if (!snapshot || snapshot.palace.deletedAt) return null;
      return cloneSnapshot(snapshot);
    },
    async savePalace(snapshot: PalaceSnapshot) {
      await hydrateBrowserStorage();
      palaces.set(snapshot.palace.id, cloneSnapshot(snapshot));
      await persistPalaces();
    },
    async softDeletePalace(palaceId: string) {
      await hydrateBrowserStorage();
      await purgeAndPersistIfNeeded();
      const snapshot = palaces.get(palaceId);
      if (!snapshot) return;
      const deletedAt = new Date().toISOString();
      snapshot.palace.deletedAt = deletedAt;
      snapshot.palace.purgeAt = new Date(Date.parse(deletedAt) + TRASH_RETENTION_MS).toISOString();
      await persistPalaces();
    },
    async restorePalace(palaceId: string) {
      await hydrateBrowserStorage();
      await purgeAndPersistIfNeeded();
      const snapshot = palaces.get(palaceId);
      if (!snapshot) return;
      snapshot.palace.deletedAt = null;
      snapshot.palace.purgeAt = null;
      await persistPalaces();
    },
    async purgePalace(palaceId: string) {
      await hydrateBrowserStorage();
      palaces.delete(palaceId);
      await persistPalaces();
    },
    async listAnalyticsEvents(limit) {
      await hydrateBrowserStorage();
      const list = analyticsEvents
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return typeof limit === "number" ? list.slice(0, limit) : list;
    },
    async appendAnalyticsEvents(events) {
      await hydrateBrowserStorage();
      analyticsEvents = [...analyticsEvents, ...(JSON.parse(JSON.stringify(events)) as AnalyticsEvent[])];
      await persistAnalyticsEvents();
    },
    async exportJson(snapshot: PalaceSnapshot) {
      return JSON.stringify({ version: 1, snapshot }, null, 2);
    },
    async importJson(json: string) {
      const o = JSON.parse(json) as { snapshot: PalaceSnapshot };
      return o.snapshot;
    },
  };
}
