import type { ReactNode } from "react";

export type StatTone = "zinc" | "violet" | "emerald";

const TONE_CLASS: Record<StatTone, string> = {
  violet: "border-violet-800/60 bg-violet-950/30",
  emerald: "border-emerald-800/60 bg-emerald-950/30",
  zinc: "border-zinc-800 bg-zinc-900/40",
};

export function StatCard({
  icon,
  label,
  value,
  tone = "zinc",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: StatTone;
}) {
  return (
    <div className={`rounded-md border p-3 ${TONE_CLASS[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}
