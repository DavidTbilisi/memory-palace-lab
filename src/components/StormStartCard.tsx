import { useState } from "react";
import { Zap } from "lucide-react";
import { STORM_TARGET_PRESETS, clampStormTarget } from "../domain/services/storm";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

/**
 * Start a Storm: one large push that encodes new material in the open palace. The daily drip above
 * is the Siege; this is the accumulation phase, and its stops join the queue afterwards.
 */
export function StormStartCard({ onStarted }: { onStarted: () => void }) {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const storm = usePalaceStore((s) => s.storm);
  const stormTarget = usePalaceStore((s) => s.stormTarget);
  const startStorm = usePalaceStore((s) => s.startStorm);
  const [target, setTarget] = useState(String(stormTarget));

  const start = () => {
    if (startStorm(clampStormTarget(Number(target)))) onStarted();
  };

  return (
    <section aria-label="Storm" className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
        <Zap className="h-4 w-4 text-amber-300" />
        Storm
      </div>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
        One big push of new material, alongside the daily reviews. Every node you encode becomes a stop on a
        route of its own, first reviewed after you have slept on it. For a whole day off, the wiki treats 300 as
        a floor.
      </p>
      {storm ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-200">
          A Storm is running in {currentPalace?.name ?? "this palace"}: {storm.nodeIds.length} / {storm.target}.
          <Button type="button" size="sm" variant="secondary" onClick={onStarted}>
            Back to it
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label htmlFor="storm-target" className="text-xs text-zinc-400">
            Target
          </label>
          <Input
            id="storm-target"
            type="number"
            min={1}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            className="h-8 w-24 text-xs"
          />
          <div className="flex flex-wrap gap-1" role="group" aria-label="Presets">
            {STORM_TARGET_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={Number(target) === preset ? "default" : "ghost"}
                onClick={() => setTarget(String(preset))}
              >
                {preset}
              </Button>
            ))}
          </div>
          <Button type="button" size="sm" disabled={!currentPalace} onClick={start}>
            Start Storm
          </Button>
          {!currentPalace ? <span className="text-xs text-zinc-500">Open a palace first.</span> : null}
        </div>
      )}
    </section>
  );
}
