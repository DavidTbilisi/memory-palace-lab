import { usePalaceStore } from "../store/palaceStore";

/**
 * Surfaces persistence failures (save/open/create/reload) that previously
 * died as silent promise rejections. Stays until dismissed so a failed
 * checkpoint can't be mistaken for a saved one.
 */
export function AppErrorBanner() {
  const lastError = usePalaceStore((s) => s.lastError);
  const setLastError = usePalaceStore((s) => s.setLastError);

  if (!lastError) return null;

  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-red-800/70 bg-red-950/70 px-3 py-2 text-sm text-red-100"
    >
      <span className="min-w-0 flex-1">
        {lastError.message}
        <span className="ml-2 text-xs text-red-300/80">
          {new Date(lastError.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </span>
      <button
        type="button"
        onClick={() => setLastError(null)}
        className="shrink-0 rounded border border-red-500/60 px-2 py-1 text-xs font-medium text-red-100 hover:bg-red-900"
      >
        Dismiss
      </button>
    </div>
  );
}
