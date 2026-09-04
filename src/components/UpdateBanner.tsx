import { useEffect, useState } from "react";
import { APP_VERSION } from "../appVersion";
import { IS_TAURI_RUNTIME, checkForUpdate, downloadAndInstallUpdate } from "../infrastructure/appUpdater";

type UpdateState =
  | { phase: "idle" }
  | { phase: "available"; version: string }
  | { phase: "downloading"; version: string; percent: number | null }
  | { phase: "error"; message: string };

/**
 * Self-update banner: checks the release manifest once on startup and offers
 * a one-click install + restart. Desktop only; silent when up to date or
 * offline. Settings › About exposes the same check on demand.
 */
export function UpdateBanner() {
  const [state, setState] = useState<UpdateState>({ phase: "idle" });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!IS_TAURI_RUNTIME) return;
    let disposed = false;
    void checkForUpdate()
      .then((result) => {
        if (!disposed && result.status === "available") {
          setState({ phase: "available", version: result.version });
        }
      })
      .catch(() => {
        // Offline, dev build without signature, or rate-limited — stay quiet.
      });
    return () => {
      disposed = true;
    };
  }, []);

  if (!IS_TAURI_RUNTIME || dismissed || state.phase === "idle") return null;

  const installUpdate = () => {
    const version = state.phase === "available" ? state.version : APP_VERSION;
    setState({ phase: "downloading", version, percent: null });
    void downloadAndInstallUpdate((percent) => setState({ phase: "downloading", version, percent })).catch(
      (error: unknown) => {
        setState({ phase: "error", message: error instanceof Error ? error.message : String(error) });
      },
    );
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
