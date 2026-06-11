import { usePalaceStore } from "../store/palaceStore";

/**
 * Shown when an external (MCP) edit landed on the open palace while it has
 * unsaved local changes. The user picks a side: reload from disk (discarding
 * local work) or keep editing (the next save overwrites the external edit —
 * last write wins).
 */
export function ExternalChangeBanner() {
  const pending = usePalaceStore((s) => s.externalChangePending);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const reload = usePalaceStore((s) => s.reloadCurrentPalaceFromDisk);
  const dismiss = usePalaceStore((s) => s.setExternalChangePending);

  if (!pending || !currentPalace || pending.palaceId !== currentPalace.id) return null;

  const message =
    pending.op === "manual refresh"
      ? "Reload this palace from disk? You have unsaved changes — reloading will discard them."
      : `This palace was changed outside the app (Claude via MCP: ${pending.op}). You have unsaved changes — reloading will discard them.`;

  return (
    <div className="flex items-center gap-3 border-b border-amber-700/60 bg-amber-950/60 px-3 py-2 text-sm text-amber-100">
      <span className="min-w-0 flex-1">{message}</span>
      <button
        type="button"
        onClick={() => void reload()}
        className="shrink-0 rounded border border-amber-500/60 px-2 py-1 text-xs font-medium text-amber-100 hover:bg-amber-900"
      >
        Reload (discard my changes)
      </button>
      <button
        type="button"
        onClick={() => dismiss(null)}
        className="shrink-0 rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
      >
        Keep mine
      </button>
    </div>
  );
}
