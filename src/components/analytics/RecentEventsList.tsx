import type { AnalyticsEvent } from "../../domain/entities/types";
import { humanizeAnalyticsEventType } from "../../domain/services/analyticsService";
import { formatEventDetail } from "./analyticsFormatters";

export function RecentEventsList({ events }: { events: AnalyticsEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-4 text-sm text-zinc-500">
        No analytics events yet.
      </div>
    );
  }

  return (
    <>
      {events.map((event) => (
        <div key={event.id} className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="font-medium capitalize text-zinc-100">{humanizeAnalyticsEventType(event.eventType)}</div>
            <div className="text-[11px] text-zinc-500">{new Date(event.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">{formatEventDetail(event)}</div>
        </div>
      ))}
    </>
  );
}
