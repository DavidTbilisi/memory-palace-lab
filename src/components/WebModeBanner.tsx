import { useState } from "react";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/**
 * Browser builds fall back to an in-memory/browser-storage repository
 * (palaceRepositoryProvider) — data does not survive reliably. Say so instead
 * of letting users find out the hard way.
 */
export function WebModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (IS_TAURI || dismissed) return null;

  return (
    <div className="flex items-center gap-3 border-b border-sky-800/60 bg-sky-950/60 px-3 py-2 text-sm text-sky-100">
      <span className="min-w-0 flex-1">
        Running in the browser — palaces live in this browser's local storage only. Use the desktop
        app for durable SQLite storage, or export your palace (JSON/DSL) to keep a copy.
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded border border-sky-500/60 px-2 py-1 text-xs font-medium text-sky-100 hover:bg-sky-900"
      >
        Got it
      </button>
    </div>
  );
}
