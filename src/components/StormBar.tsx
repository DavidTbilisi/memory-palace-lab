import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { stormRatePerHour } from "../domain/services/storm";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

export function formatStormTime(ms: number | null): string {
  if (ms === null) return "—";
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(hours > 0 ? 2 : 1, "0");
  return `${hours > 0 ? `${hours}:` : ""}${mm}:${String(seconds).padStart(2, "0")}`;
}

/** Progress of a running Storm, above the canvas: count against target, active time, and rate. */
export function StormBar() {
  const storm = usePalaceStore((s) => s.storm);
  const currentPalaceId = usePalaceStore((s) => s.currentPalace?.id ?? null);
  const readStormClock = usePalaceStore((s) => s.readStormClock);
  const stopStorm = usePalaceStore((s) => s.stopStorm);
  const [, tick] = useState(0);

  useEffect(() => {
    if (!storm) return;
    const timer = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, [storm]);

  if (!storm || storm.palaceId !== currentPalaceId) return null;
  const clock = readStormClock();
  const count = storm.nodeIds.length;
  // A rate projected from the first few seconds is noise; show it once a minute has been worked.
  const rate = (clock?.activeMs ?? 0) >= 60_000 ? stormRatePerHour(count, clock!.activeMs) : null;
  const progress = Math.min(1, count / storm.target);

  return (
    <div role="region" aria-label="Storm in progress" className="flex items-center gap-3 border-b border-amber-900/60 bg-amber-950/30 px-3 py-1.5">
      <Zap className="h-4 w-4 shrink-0 text-amber-300" />
      <span className="text-xs font-semibold text-amber-100">Storm</span>
      <span data-testid="storm-count" className="text-xs tabular-nums text-amber-100">
        {count} / {storm.target}
      </span>
      <div
        className="h-1.5 w-40 overflow-hidden rounded-full bg-zinc-800"
        role="progressbar"
        aria-label="Storm progress"
        aria-valuemin={0}
        aria-valuemax={storm.target}
        aria-valuenow={count}
      >
        <div className="h-full bg-amber-400 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <span className="text-xs tabular-nums text-zinc-400" title="Active time: gaps with no input count for at most a minute">
        {formatStormTime(clock?.activeMs ?? null)}
      </span>
      <span className="text-xs tabular-nums text-zinc-400">{rate !== null ? `${Math.round(rate)}/h` : ""}</span>
      <span className="hidden text-[11px] text-zinc-500 md:inline">Each node you encode becomes a stop on {storm.routeName}.</span>
      <Button type="button" size="sm" variant="secondary" className="ml-auto" onClick={stopStorm}>
        Stop
      </Button>
    </div>
  );
}
