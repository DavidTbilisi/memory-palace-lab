import type { DailyReviewPoint } from "../../domain/services/reviewMetrics";
import { formatDayKeyLabel } from "../../domain/services/reviewMetrics";
import { retentionPath } from "./analyticsFormatters";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 220;
const PADDING = 24;

export function RetentionChart({ series, trendDown }: { series: DailyReviewPoint[]; trendDown: boolean }) {
  if (series.length === 0) {
    return (
      <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
        Review some loci to see your retention curve.
      </div>
    );
  }

  return (
    <>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="mt-3 h-[220px] w-full rounded-md border border-zinc-800 bg-zinc-950/50"
        aria-label="Retention over time"
      >
        <path d={retentionPath(series, VIEW_WIDTH, VIEW_HEIGHT)} fill="none" stroke="#a78bfa" strokeWidth={2.5} />
        {series.map((point, index) => {
          const x = PADDING + (series.length === 1 ? 0 : (index / (series.length - 1)) * (VIEW_WIDTH - PADDING * 2));
          const y = PADDING + (1 - point.averageScorePct / 100) * (VIEW_HEIGHT - PADDING * 2);
          return (
            <circle key={point.dayKey} cx={x} cy={y} r={4} fill="#c4b5fd">
              <title>{`${formatDayKeyLabel(point.dayKey)}: ${point.averageScorePct}% (${point.count} loci)`}</title>
            </circle>
          );
        })}
      </svg>
      {trendDown ? (
        <div className="mt-2 rounded-md border border-amber-700/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
          Your retention is trending down - consider shorter, more frequent sessions.
        </div>
      ) : null}
    </>
  );
}
