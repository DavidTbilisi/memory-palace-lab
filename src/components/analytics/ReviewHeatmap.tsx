import { useMemo, useState } from "react";
import type { HeatmapCell } from "../../domain/services/reviewMetrics";
import { formatDayKeyLabel } from "../../domain/services/reviewMetrics";
import { Button } from "../ui/button";
import { heatmapTone } from "./analyticsFormatters";

export function ReviewHeatmap({ cells }: { cells: HeatmapCell[] }) {
  const [hoveredDayKey, setHoveredDayKey] = useState<string | null>(null);
  const hoveredCell = useMemo(
    () => cells.find((cell) => cell.dayKey === hoveredDayKey) ?? null,
    [cells, hoveredDayKey],
  );

  if (cells.every((cell) => cell.count === 0)) {
    return (
      <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
        Your review history will appear here after your first walk session.
        <div className="mt-2">
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("mp-open-review"))}
          >
            Start reviewing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell) => (
            <button
              key={cell.dayKey}
              type="button"
              onMouseEnter={() => setHoveredDayKey(cell.dayKey)}
              onMouseLeave={() => setHoveredDayKey((current) => (current === cell.dayKey ? null : current))}
              className={`h-3 w-3 rounded-sm ${heatmapTone(cell.count)} ${cell.isToday ? "ring-1 ring-violet-300" : ""}`}
              title={`${formatDayKeyLabel(cell.dayKey)} - ${cell.count} loci reviewed across ${cell.routeCount} routes`}
              aria-label={`${cell.dayKey}: ${cell.count} reviewed`}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 text-xs text-zinc-500">
        {hoveredCell
          ? `${formatDayKeyLabel(hoveredCell.dayKey)} - ${hoveredCell.count} loci reviewed across ${hoveredCell.routeCount} routes`
          : "Hover a day to inspect review volume."}
      </div>
    </>
  );
}
