import { requestNavigation } from "../../app/navigationEvents";
import type { MemoryNode } from "../../domain/entities/types";
import { NEDF_SLOT_LABELS, NEDF_SLOT_OPERATIONS, isNedfEncoded, isSlotFilled } from "../../domain/services/nedf";
import type { SlotRetention } from "../../domain/services/reviewMetrics";
import { usePalaceStore } from "../../store/palaceStore";

function SlotTile({ row }: { row: SlotRetention }) {
  const { slot, reviews, recalled, retentionPct, ratings } = row;
  const breakdown = `Again ${ratings.again} · Hard ${ratings.hard} · Good ${ratings.good} · Easy ${ratings.easy}`;
  return (
    <div
      data-testid={`nedf-retention-${slot}`}
      title={reviews > 0 ? breakdown : undefined}
      className="rounded-md border border-zinc-800 bg-zinc-950/60 p-2"
    >
      <div className="text-[11px] text-zinc-400">
        {NEDF_SLOT_LABELS[slot]} · {NEDF_SLOT_OPERATIONS[slot].toLowerCase()}
      </div>
      <div className="mt-0.5 text-lg font-semibold text-zinc-100">{retentionPct === null ? "–" : `${retentionPct}%`}</div>
      <div
        role="meter"
        aria-label={`${NEDF_SLOT_LABELS[slot]} retention`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={retentionPct ?? 0}
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-violet-950"
      >
        <div className="h-full rounded-full bg-violet-400" style={{ width: `${retentionPct ?? 0}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-zinc-500">
        {reviews > 0 ? `${recalled} of ${reviews} recalled` : "No reviews yet"}
      </div>
    </div>
  );
}

/**
 * Retention per NEDF slot, and the encoded concepts still missing a Failure slot: the one most
 * often skipped, and the one that carries the operational lesson.
 */
export function NedfCoverage({ retention, nodes }: { retention: SlotRetention[]; nodes: readonly MemoryNode[] }) {
  const setFocusNodeId = usePalaceStore((s) => s.setFocusNodeId);
  const encoded = nodes.filter((node) => isNedfEncoded(node.nedf));
  const missingFailure = encoded.filter((node) => !isSlotFilled(node.nedf, "failure"));
  const memoryNodes = nodes.filter((node) => node.kind !== "portal").length;

  return (
    <section aria-label="NEDF slots" className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-medium text-zinc-100">NEDF slots</div>
        <div className="text-xs text-zinc-500">
          {encoded.length} of {memoryNodes} {memoryNodes === 1 ? "node" : "nodes"} NEDF-encoded
        </div>
      </div>
      <p className="mt-1 text-xs text-zinc-500">Share of reviews recalled (Hard, Good, or Easy), per slot.</p>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
        {retention.map((row) => (
          <SlotTile key={row.slot} row={row} />
        ))}
      </div>
      <div className="mt-3">
        <div className="text-xs font-medium text-zinc-300">Encoded concepts missing a Failure slot</div>
        {encoded.length === 0 ? (
          <p className="mt-1 text-xs text-zinc-500">No NEDF-encoded nodes yet. Fill the slots in a node's inspector.</p>
        ) : missingFailure.length === 0 ? (
          <p className="mt-1 text-xs text-zinc-500">Every encoded concept has a Failure slot.</p>
        ) : (
          <ul aria-label="Missing a Failure slot" className="mt-1 flex flex-wrap gap-1.5">
            {missingFailure.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  title="Show this node on the canvas"
                  onClick={() => {
                    setFocusNodeId(node.id);
                    requestNavigation("graph");
                  }}
                  className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  {node.title || "Untitled node"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
