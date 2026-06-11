import { useEffect } from "react";
import { usePalaceStore } from "../store/palaceStore";

const SENTINEL_FILE = "mcp-sync.json";
const POLL_INTERVAL_MS = 2000;
const DEBOUNCE_MS = 300;

type SentinelPayload = {
  seq?: number;
  writerId?: string;
  palaceId?: string | null;
  op?: string;
  mutatedAt?: string;
};

/**
 * Watch the MCP server's sentinel file (written after every external mutation,
 * see mcp-server/src/sentinel.ts) and refresh app state:
 *  - palace list always reloads;
 *  - if the open palace changed and we have no unsaved work, reload it in place;
 *  - if we do have unsaved work, flag the conflict so ExternalChangeBanner can
 *    let the user pick a side.
 *
 * Uses fs watch with a polling fallback (file watching is flaky on Windows).
 * No-op outside Tauri.
 */
export function useExternalMcpSync() {
  useEffect(() => {
    const hasTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
    if (!hasTauri) return;

    let disposed = false;
    let unwatch: (() => void) | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastSignature = "";

    const handleSentinel = async () => {
      const { readTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
      let payload: SentinelPayload;
      try {
        payload = JSON.parse(
          await readTextFile(SENTINEL_FILE, { baseDir: BaseDirectory.AppData }),
        ) as SentinelPayload;
      } catch {
        return; // missing or mid-write
      }
      const signature = `${payload.writerId}:${payload.seq}`;
      if (signature === lastSignature) return;
      lastSignature = signature;

      const store = usePalaceStore.getState();
      await store.loadPalaces();

      const current = usePalaceStore.getState().currentPalace;
      if (!current || !payload.palaceId || payload.palaceId !== current.id) return;

      if (usePalaceStore.getState().persistenceState === "clean") {
        await usePalaceStore.getState().reloadCurrentPalaceFromDisk();
      } else {
        usePalaceStore.getState().setExternalChangePending({
          palaceId: payload.palaceId,
          op: payload.op ?? "edit",
        });
      }
    };

    const schedule = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        void handleSentinel();
      }, DEBOUNCE_MS);
    };

    void (async () => {
      // Seed the dedupe signature so a stale sentinel from a previous session
      // doesn't trigger a reload on startup.
      try {
        const { readTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
        const payload = JSON.parse(
          await readTextFile(SENTINEL_FILE, { baseDir: BaseDirectory.AppData }),
        ) as SentinelPayload;
        lastSignature = `${payload.writerId}:${payload.seq}`;
      } catch {
        // no sentinel yet
      }
      if (disposed) return;

      try {
        const { watch, BaseDirectory } = await import("@tauri-apps/plugin-fs");
        const stop = await watch(SENTINEL_FILE, schedule, {
          baseDir: BaseDirectory.AppData,
          delayMs: 200,
        });
        if (disposed) {
          stop();
        } else {
          unwatch = stop;
        }
      } catch {
        // fs watch unavailable — fall back to polling below.
      }
      if (!disposed && !unwatch) {
        pollTimer = setInterval(() => void handleSentinel(), POLL_INTERVAL_MS);
      }
    })();

    return () => {
      disposed = true;
      if (unwatch) unwatch();
      if (pollTimer) clearInterval(pollTimer);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);
}
