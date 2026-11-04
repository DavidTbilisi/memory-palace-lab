import { useState } from "react";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { misplacedEvents } from "../domain/services/orderDrill";
import { usePalaceStore } from "../store/palaceStore";
import { startOrderDrill, type DrillEvent, type OrderDrill } from "../system/timelineStore";
import { Button } from "./ui/button";

type Result = { misplaced: ReadonlySet<string>; pulled: number };

/**
 * The timeline order drill: a run of neighbouring events in shuffled order, without dates. The
 * learner puts them back in date order; checking shows the dates and marks the events out of
 * place, whose Event → date cards come due now.
 */
export function OrderDrillDialog({ drill: initial, onClose }: { drill: OrderDrill; onClose: () => void }) {
  const recordOrderDrill = usePalaceStore((s) => s.recordOrderDrill);
  const [drill, setDrill] = useState(initial);
  const [order, setOrder] = useState<DrillEvent[]>(initial.events);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const move = (index: number, by: -1 | 1) => {
    const target = index + by;
    if (result || target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  const check = () => {
    const misplaced = misplacedEvents(order);
    const pulled = recordOrderDrill({
      routeId: drill.routeId,
      nodeIds: order.map((event) => event.nodeId),
      misplacedNodeIds: misplaced,
    });
    setResult({ misplaced: new Set(misplaced), pulled });
  };

  const another = () => {
    const next = startOrderDrill();
    if ("error" in next) {
      setError(next.error);
      return;
    }
    setDrill(next);
    setOrder(next.events);
    setResult(null);
    setError(null);
  };

  const summary = result
    ? result.misplaced.size === 0
      ? "All in order."
      : `${result.misplaced.size} of ${order.length} out of place. ${
          result.pulled > 0 ? "Their Event → date cards are due now." : "Their Event → date cards were already due."
        }`
    : null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-label="Order drill"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-5"
      >
        <h2 className="text-base font-semibold text-zinc-100">Order drill</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {result
            ? "Earliest first. Events on the same date can come in either order."
            : "Put these events in date order, earliest first, then check."}
        </p>

        <ol aria-label="Events" className="mt-3 space-y-1.5">
          {order.map((event, index) => {
            const out = result?.misplaced.has(event.nodeId);
            return (
              <li
                key={event.nodeId}
                data-misplaced={out ? "true" : undefined}
                className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                  result ? (out ? "border-amber-700 bg-amber-950/40" : "border-emerald-800 bg-emerald-950/30") : "border-zinc-700 bg-zinc-900"
                }`}
              >
                <span className="w-4 text-right text-xs text-zinc-500">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate text-zinc-100">{event.title}</span>
                {result ? (
                  <>
                    <span className="text-xs text-zinc-300">{event.date.label}</span>
                    {out ? (
                      <X aria-label="Out of place" className="h-4 w-4 text-amber-300" />
                    ) : (
                      <Check aria-label="In place" className="h-4 w-4 text-emerald-300" />
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label={`Move ${event.title} up`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${event.title} down`}
                      disabled={index === order.length - 1}
                      onClick={() => move(index, 1)}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ol>

        {summary ? (
          <p role="status" className="mt-3 text-sm text-zinc-200">
            {summary}
          </p>
        ) : null}
        {error ? (
          <p role="status" className="mt-3 text-sm text-amber-300">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {result ? (
            <Button size="sm" variant="secondary" type="button" onClick={another}>
              Another run
            </Button>
          ) : (
            <Button size="sm" type="button" onClick={check}>
              Check order
            </Button>
          )}
          <Button size="sm" variant="ghost" type="button" onClick={onClose}>
            {result ? "Done" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
