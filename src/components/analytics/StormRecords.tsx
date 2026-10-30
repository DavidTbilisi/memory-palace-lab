import { Trophy, Zap } from "lucide-react";
import type { StormRecords as Records } from "../../domain/services/storm";
import { formatStormTime } from "../StormBar";

const RECENT = 5;

/** Storms kept apart from the daily reviews: best count, best rate, and the latest few. */
export function StormRecords({ records }: { records: Records }) {
  return (
    <section aria-label="Storm records" className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
        <Zap className="h-4 w-4 text-amber-300" />
        Storm records
      </div>
      {records.storms.length === 0 ? (
        <p className="mt-2 text-xs text-zinc-500">No Storms yet. Start one from the Review page.</p>
      ) : (
        <>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-zinc-800 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-zinc-500">Most encoded</div>
              <div data-testid="storm-best-count" className="text-xl font-semibold tabular-nums text-zinc-100">
                {records.bestCount}
              </div>
            </div>
            <div className="rounded-md border border-zinc-800 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-zinc-500">Fastest</div>
              <div data-testid="storm-best-rate" className="text-xl font-semibold tabular-nums text-zinc-100">
                {records.bestRatePerHour !== null ? `${Math.round(records.bestRatePerHour)}/h` : "—"}
              </div>
            </div>
          </div>
          <table className="mt-2 w-full text-xs">
            <caption className="sr-only">Recent Storms</caption>
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-1 font-normal">Storm</th>
                <th className="py-1 text-right font-normal">Encoded</th>
                <th className="py-1 text-right font-normal">Active</th>
                <th className="py-1 text-right font-normal">Rate</th>
              </tr>
            </thead>
            <tbody>
              {records.storms.slice(0, RECENT).map((storm) => (
                <tr key={storm.at} className="border-t border-zinc-800 text-zinc-300">
                  <td className="py-1">
                    <span className="inline-flex items-center gap-1">
                      {storm.routeName}
                      {storm.personalBest ? <Trophy aria-label="Personal best" className="h-3 w-3 text-amber-300" /> : null}
                    </span>
                  </td>
                  <td className="py-1 text-right tabular-nums">
                    {storm.count} / {storm.target}
                  </td>
                  <td className="py-1 text-right tabular-nums">{formatStormTime(storm.activeMs)}</td>
                  <td className="py-1 text-right tabular-nums">
                    {storm.ratePerHour !== null ? `${Math.round(storm.ratePerHour)}/h` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
