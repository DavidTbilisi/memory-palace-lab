import type * as React from "react";
import {
  SPEED_BAND_MIN_SAMPLES,
  TREND_MIN_DAYS,
  type EncodeTrend,
  type EncodeTrendWeek,
  type SpeedBandThresholds,
} from "../../domain/services/encodeSpeed";
import { formatDuration } from "./analyticsFormatters";

/** Categorical slots 1 and 2, dark steps; validated as a pair on the panel surface. */
const SERIES = [
  { key: "first", label: "First encode", color: "#3987e5" },
  { key: "reedit", label: "Re-edit", color: "#d95926" },
] as const;

const WIDTH = 560;
const HEIGHT = 200;
const PAD = { top: 12, right: 92, bottom: 26, left: 52 };
/** Chart text, in viewBox units: the SVG scales down to the card, so this stays readable. */
const TEXT = { fontSize: 13 };

type Kind = "node" | "edge";

const weekLabel = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

/** Axis labels: "30s", "2m", "2m 30s". */
const tickLabel = (ms: number) => (ms >= 60_000 && ms % 60_000 === 0 ? `${ms / 60_000}m` : formatDuration(ms));

/** A round axis top close above the data: 30s, 1m, 2m, 3m, 4m, 5m, 10m... */
function axisMax(values: number[]): number {
  const top = Math.max(...values, 1);
  const steps = [20_000, 30_000, 60_000, 120_000, 180_000, 240_000, 300_000, 600_000, 900_000, 1_200_000, 1_800_000, 3_600_000];
  return steps.find((step) => step >= top) ?? Math.ceil(top / 3_600_000) * 3_600_000;
}

function KindChart({ kind, weeks }: { kind: Kind; weeks: EncodeTrendWeek[] }) {
  const values = weeks.flatMap((week) => [week[kind].first, week[kind].reedit]).filter((v): v is number => v !== null);
  const title = kind === "node" ? "Nodes" : "Edges";
  if (values.length === 0) {
    return (
      <figure className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2">
        <figcaption className="text-xs font-medium text-zinc-300">{title}</figcaption>
        <p className="py-6 text-center text-xs text-zinc-500">No timed {kind} encodes in these weeks.</p>
      </figure>
    );
  }
  const max = axisMax(values);
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (index: number) => PAD.left + (weeks.length === 1 ? plotW / 2 : (index / (weeks.length - 1)) * plotW);
  const y = (ms: number) => PAD.top + (1 - ms / max) * plotH;
  const ticks = [0, max / 2, max];

  return (
    <figure className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2" data-testid={`encode-trend-${kind}`}>
      <figcaption className="text-xs font-medium text-zinc-300">{title} · median active time per week</figcaption>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-1 h-auto w-full" role="img" aria-label={`${title}: median encode time per week`}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} stroke="#27272a" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-zinc-500" style={TEXT}>
              {tickLabel(tick)}
            </text>
          </g>
        ))}
        {[0, weeks.length - 1].map((index) => (
          <text
            key={index}
            x={x(index)}
            y={HEIGHT - 8}
            textAnchor={index === 0 ? "start" : "end"}
            className="fill-zinc-500" style={TEXT}
          >
            {index === weeks.length - 1 ? "This week" : weekLabel(weeks[index].start)}
          </text>
        ))}
        {SERIES.map((series) => {
          // Break the line at weeks without data rather than drawing across them.
          let path = "";
          let pen = false;
          weeks.forEach((week, index) => {
            const value = week[kind][series.key];
            if (value === null) {
              pen = false;
              return;
            }
            path += `${pen ? "L" : "M"}${x(index).toFixed(1)},${y(value).toFixed(1)} `;
            pen = true;
          });
          let lastIndex = -1;
          weeks.forEach((week, index) => {
            if (week[kind][series.key] !== null) lastIndex = index;
          });
          return (
            <g key={series.key} data-series={series.key}>
              <path d={path} fill="none" stroke={series.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {weeks.map((week, index) => {
                const value = week[kind][series.key];
                if (value === null) return null;
                const count = series.key === "first" ? week[kind].firstCount : week[kind].reeditCount;
                return (
                  <g key={week.start}>
                    <circle cx={x(index)} cy={y(value)} r={4.5} fill={series.color} stroke="#141416" strokeWidth={2} />
                    <circle cx={x(index)} cy={y(value)} r={14} fill="transparent" className="cursor-default">
                      <title>{`Week of ${weekLabel(week.start)} · ${series.label}: ${formatDuration(value)} median of ${count}`}</title>
                    </circle>
                  </g>
                );
              })}
              {lastIndex >= 0 ? (
                <text
                  x={x(lastIndex) + 10}
                  y={y(weeks[lastIndex][kind][series.key] as number) + 4}
                  className="fill-zinc-300" style={TEXT}
                >
                  {series.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function Tile({ label, value, hint, testId }: { label: string; value: React.ReactNode; hint: string; testId: string }) {
  return (
    <div data-testid={testId} className="rounded-md border border-zinc-800 bg-zinc-950/60 p-2">
      <div className="text-[11px] text-zinc-400">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-zinc-100 tabular-nums">{value}</div>
      <div className="text-[11px] text-zinc-500">{hint}</div>
    </div>
  );
}

/**
 * Is encoding getting faster? Median active time per week to build a node or an edge, with
 * re-edits apart: re-editing a known node is not encoding.
 */
export function EncodeSpeedTrend({ trend, thresholds }: { trend: EncodeTrend; thresholds: SpeedBandThresholds | null }) {
  const { node: nodes, edge: edges } = trend.recent;
  return (
    <section aria-label="Encode speed" className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="text-sm font-medium text-zinc-100">Encode speed</div>
      <p className="mt-1 text-xs text-zinc-500">
        Active time to build a node or an edge. Pauses over a minute count as one minute; time in another app counts as none.
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Tile
          testId="encode-tile-node"
          label="New node · last 4 weeks"
          value={nodes.median === null ? "–" : formatDuration(nodes.median)}
          hint={nodes.count > 0 ? `median of ${nodes.count} first encodes` : "No timed node encodes yet"}
        />
        <Tile
          testId="encode-tile-edge"
          label="New edge · last 4 weeks"
          value={edges.median === null ? "–" : formatDuration(edges.median)}
          hint={edges.count > 0 ? `median of ${edges.count} first encodes` : "No timed edge encodes yet"}
        />
        <Tile
          testId="encode-tile-bands"
          label="Your speed bands"
          value={
            thresholds ? (
              <span className="flex flex-wrap gap-x-3 text-base">
                <span>Fast ≤ {formatDuration(thresholds.fastMs)}</span>
                <span>Slow &gt; {formatDuration(thresholds.slowMs)}</span>
              </span>
            ) : (
              "–"
            )
          }
          hint={
            thresholds
              ? `From your ${thresholds.samples} first node encodes of the last 90 days`
              : `Bands appear after ${SPEED_BAND_MIN_SAMPLES} timed node encodes`
          }
        />
      </div>
      {trend.ready ? (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-zinc-300" aria-hidden="true">
            {SERIES.map((series) => (
              <span key={series.key} className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: series.color }} />
                {series.label}
              </span>
            ))}
          </div>
          <div className="mt-2 grid gap-2 lg:grid-cols-2">
            <KindChart kind="node" weeks={trend.weeks} />
            <KindChart kind="edge" weeks={trend.weeks} />
          </div>
          <details className="mt-2 text-xs text-zinc-400">
            <summary className="cursor-pointer select-none">Show as a table</summary>
            <table className="mt-2 w-full text-left tabular-nums">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 pr-2 font-normal">Week of</th>
                  <th className="py-1 pr-2 font-normal">Node, first</th>
                  <th className="py-1 pr-2 font-normal">Node, re-edit</th>
                  <th className="py-1 pr-2 font-normal">Edge, first</th>
                  <th className="py-1 font-normal">Edge, re-edit</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {trend.weeks.map((week) => (
                  <tr key={week.start} className="border-t border-zinc-800/80">
                    <td className="py-1 pr-2">{weekLabel(week.start)}</td>
                    {[week.node.first, week.node.reedit, week.edge.first, week.edge.reedit].map((value, index) => (
                      <td key={index} className="py-1 pr-2">
                        {value === null ? "–" : formatDuration(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      ) : (
        <p data-testid="encode-trend-waiting" className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-4 text-xs text-zinc-500">
          The weekly trend starts once your encodes span four weeks ({Math.min(trend.spanDays, TREND_MIN_DAYS)} of{" "}
          {TREND_MIN_DAYS} days so far).
        </p>
      )}
    </section>
  );
}
