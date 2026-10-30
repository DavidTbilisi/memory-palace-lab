import { SPEED_BAND_LABELS, SPEED_BAND_MIN_SAMPLES, type NodeEncodeSpeed } from "../../domain/services/encodeSpeed";
import { cn } from "../../utils/cn";
import { formatDuration } from "./analyticsFormatters";

const BAND_TONE = {
  fast: "border-emerald-500/40 text-emerald-200",
  typical: "border-zinc-600 text-zinc-300",
  slow: "border-amber-500/40 text-amber-200",
} as const;

/** A node's first-encode time and, once there is enough data, its speed band. */
export function EncodeSpeedBadge({ speed, className }: { speed: NodeEncodeSpeed | null; className?: string }) {
  if (!speed) return <span className={cn("text-zinc-600", className)}>—</span>;
  const duration = formatDuration(speed.activeMs);
  const title = speed.band
    ? `Encoded in ${duration} of active time: ${SPEED_BAND_LABELS[speed.band].toLowerCase()} for you, against your first encodes of the last 90 days`
    : `Encoded in ${duration} of active time. A speed band appears after ${SPEED_BAND_MIN_SAMPLES} timed encodes.`;
  return (
    <span
      data-testid="encode-speed"
      title={title}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 text-[11px] tabular-nums",
        speed.band ? BAND_TONE[speed.band] : "border-zinc-700 text-zinc-400",
        className,
      )}
    >
      {duration}
      {speed.band ? <span>· {SPEED_BAND_LABELS[speed.band]}</span> : null}
    </span>
  );
}
