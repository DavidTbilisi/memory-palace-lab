import { NEDF_SLOT_OPERATIONS } from "../domain/services/nedf";
import { usePalaceStore } from "../store/palaceStore";
import type { NodeBox } from "./routeOverlayGeometry";

/**
 * Covers the current stop's node while an NEDF card waits to be revealed. Every slot card's
 * answer includes the concept's name, and the node shows it on the canvas.
 */
export function WalkAnswerCover({ boxes }: { boxes: ReadonlyMap<string, NodeBox> }) {
  const covering = usePalaceStore(
    (s) => s.walkOpen && s.walkRecallMode && !s.walkAnswerRevealed && s.walkSlot !== null,
  );
  const slot = usePalaceStore((s) => s.walkSlot);
  const nodeId = usePalaceStore((s) => (covering ? s.currentWalkNodeId() : null));
  const box = nodeId ? boxes.get(nodeId) : undefined;
  if (!covering || !slot || !box) return null;

  return (
    <svg
      aria-hidden="true"
      data-testid="walk-answer-cover"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
    >
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={6} fill="#18181b" stroke="#8b5cf6" strokeWidth={2} />
      <text
        x={box.x + box.w / 2}
        y={box.y + box.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.max(10, Math.min(14, box.h / 3))}
        fontWeight={600}
        fill="#c4b5fd"
      >
        {NEDF_SLOT_OPERATIONS[slot]}?
      </text>
    </svg>
  );
}
