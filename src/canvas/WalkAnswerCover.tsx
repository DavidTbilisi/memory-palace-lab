import { NEDF_SLOT_OPERATIONS } from "../domain/services/nedf";
import { usePalaceStore } from "../store/palaceStore";
import type { NodeBox } from "./routeOverlayGeometry";

/**
 * Covers the nodes a recall-first walk keeps hidden (`walkHiddenNodeIds`): the stop being asked,
 * and every other stop on the route not yet revealed in this walk. The stop being asked is
 * outlined and says what to recall; the others are blank, so the route's shape shows but not
 * what it holds.
 */
export function WalkAnswerCover({
  boxes,
  hidden,
}: {
  boxes: ReadonlyMap<string, NodeBox>;
  hidden: ReadonlySet<string>;
}) {
  const slot = usePalaceStore((s) => s.walkSlot);
  const currentNodeId = usePalaceStore((s) => (hidden.size > 0 ? s.currentWalkNodeId() : null));
  if (hidden.size === 0) return null;

  return (
    <svg
      aria-hidden="true"
      data-testid="walk-answer-cover"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
    >
      {[...hidden].map((nodeId) => {
        const box = boxes.get(nodeId);
        if (!box) return null;
        const asked = nodeId === currentNodeId;
        return (
          <g key={nodeId} data-testid="walk-node-cover" data-node-id={nodeId} data-asked={asked ? "true" : undefined}>
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx={6}
              fill="#18181b"
              stroke={asked ? "#8b5cf6" : "#3f3f46"}
              strokeWidth={asked ? 2 : 1}
            />
            <text
              x={box.x + box.w / 2}
              y={box.y + box.h / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(10, Math.min(14, box.h / 3))}
              fontWeight={600}
              fill={asked ? "#c4b5fd" : "#52525b"}
            >
              {asked ? (slot ? `${NEDF_SLOT_OPERATIONS[slot]}?` : "Recall?") : "?"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
