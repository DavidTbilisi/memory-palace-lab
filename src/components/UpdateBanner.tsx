import { useEffect, useState } from "react";
import { APP_VERSION } from "../appVersion";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

type UpdateState =
  | { phase: "idle" }
  | { phase: "available"; version: string }
  | { phase: "downloading"; version: string; percent: number | null }
  | { phase: "error"; message: string };

/**
 * Self-update: checks the GitHub latest.json manifest once on startup
 * (tauri-plugin-updater verifies the artifact signature) and offers a
 * one-click install + restart. Desktop only; silent when up to date or
 * offline.
 */
export function UpdateBanner() {
  const [state, setState] = useState<UpdateState>({ phase: "idle" });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!IS_TAURI) return;
    let disposed = false;
    void (async () => {
      try {
        const { check } = await import("@tauri-apps/plugin-updater");
        const update = await check();
        if (!disposed && update) {
          setState({ phase: "available", version: update.version });
        }
      } catch {
        // Offline, dev build without signature, or rate-limited — stay quiet.
      }
    })();
    return () => {
      disposed = true;
    };
  }, []);

  if (!IS_TAURI || dismissed || state.phase === "idle") return null;

  const installUpdate = () => {
    void (async () => {
      try {
        const { check } = await import("@tauri-apps/plugin-updater");
        const update = await check();
        if (!update) {
          setState({ phase: "error", message: "Update no longer available." });
          return;
        }
        setState({ phase: "downloading", version: update.version, percent: null });
        let total = 0;
        let received = 0;
        await update.downloadAndInstall((event) => {
          if (event.event === "Started") {
            total = event.data.contentLength ?? 0;
          } else if (event.event === "Progress") {
            received += event.data.chunkLength;
            if (total > 0) {
              setState({
                phase: "downloading",
                version: update.version,
                percent: Math.min(100, Math.round((received / total) * 100)),
              });
            }
          }
        });
        const { relaunch } = await import("@tauri-apps/plugin-process");
        await relaunch();
      } catch (error) {
        setState({
          phase: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    })();
  };

  return (
    <div className="flex items-center gap-3 border-b border-violet-800/60 bg-violet-950/60 px-3 py-2 text-sm text-violet-100">
      <span className="min-w-0 flex-1">
        {state.phase === "available"
          ? `Update available: v${state.version} (you have v${APP_VERSION}).`
          : state.phase === "downloading"
            ? `Downloading v${state.version}${state.percent !== null ? ` — ${state.percent}%` : "…"}`
            : `Update failed: ${state.message}`}
      </span>
      {state.phase === "available" ? (
        <button
          type="button"
          onClick={installUpdate}
          className="shrink-0 rounded border border-violet-500/60 px-2 py-1 text-xs font-medium text-violet-100 hover:bg-violet-900"
        >
          Install &amp; restart
        </button>
      ) : null}
      {state.phase !== "downloading" ? (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          Later
        </button>
      ) : null}
    </div>
  );
}
