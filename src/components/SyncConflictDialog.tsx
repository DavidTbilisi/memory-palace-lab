import { usePalaceStore } from "../store/palaceStore";
import { useSyncStore } from "../store/syncStore";
import type { ConflictChoice } from "../domain/sync/vaultSyncEngine";
import type { ConflictReason } from "../domain/sync/syncPlan";

/**
 * One row per palace that changed in two places. Nothing is written until every conflict has
 * a choice, and "Keep both" is always available — so no resolution can lose work.
 */

const REASON_TEXT: Record<ConflictReason, string> = {
  "both-edited": "changed here and on another device",
  "deleted-there-edited-here": "deleted on another device, but changed here",
  "deleted-here-edited-there": "deleted here, but changed on another device",
};

const CHOICES: { value: ConflictChoice; label: string; hint: string }[] = [
  { value: "keep-mine", label: "Keep mine", hint: "Send this device's version to the others." },
  { value: "take-theirs", label: "Take theirs", hint: "Replace this device's version." },
  {
    value: "keep-both",
    label: "Keep both",
    hint: "Take theirs, and keep this device's version as a separate palace.",
  },
];

export function SyncConflictList() {
  const conflicts = useSyncStore((s) => s.conflicts);
  const choices = useSyncStore((s) => s.choices);
  const choose = useSyncStore((s) => s.chooseConflict);
  const syncNow = useSyncStore((s) => s.syncNow);
  const status = useSyncStore((s) => s.status);
  const palaces = usePalaceStore((s) => s.palaces);

  if (conflicts.length === 0) return null;
  const allChosen = conflicts.every((conflict) => choices[conflict.palaceId]);

  return (
    <div className="rounded border border-amber-700/60 bg-amber-950/40 p-3">
      <h4 className="text-xs font-semibold text-amber-100">
        {conflicts.length === 1
          ? "One palace changed in two places"
          : `${conflicts.length} palaces changed in two places`}
      </h4>
      <p className="mt-1 text-xs text-amber-100/70">
        Nothing has been written yet. Pick a side for each — “Keep both” loses nothing.
      </p>

      <ul className="mt-3 flex flex-col gap-3">
        {conflicts.map((conflict) => {
          const name =
            palaces.find((palace) => palace.id === conflict.palaceId)?.name ?? conflict.palaceId;
          return (
            <li key={conflict.palaceId} className="flex flex-col gap-1.5">
              <div className="text-xs text-amber-50">
                <span className="font-medium">{name}</span>
                <span className="text-amber-100/60"> — {REASON_TEXT[conflict.reason]}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CHOICES.map((choice) => {
                  const selected = choices[conflict.palaceId] === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      title={choice.hint}
                      aria-pressed={selected}
                      onClick={() => choose(conflict.palaceId, choice.value)}
                      className={
                        selected
                          ? "rounded border border-amber-400 bg-amber-900/60 px-2 py-1 text-xs font-medium text-amber-50"
                          : "rounded border border-amber-700/60 px-2 py-1 text-xs text-amber-100/80 hover:bg-amber-900/40"
                      }
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={!allChosen || status === "working"}
        onClick={() => void syncNow()}
        className="mt-3 rounded border border-amber-500/60 px-2 py-1 text-xs font-medium text-amber-50 hover:bg-amber-900/60 disabled:opacity-50"
      >
        {allChosen ? "Apply and sync" : "Choose for each palace"}
      </button>
    </div>
  );
}
