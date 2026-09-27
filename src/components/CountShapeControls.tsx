import { useState } from "react";
import { useValue } from "@tldraw/editor";
import { applyCountShape, outgoingTargetNodeIds, type CountShapeEditor } from "../canvas/applyCountShape";
import { COUNT_SHAPE_MAX, COUNT_SHAPE_NAMES, LADDER_REASON, canUsePolygon, type CountShapeKind } from "../domain/services/countShape";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

/**
 * Lay a node's outgoing targets out as a set: on the polygon of their count when the set is
 * unordered, so a missing member shows as an empty corner, or on a ladder when it is ordered.
 */
export function CountShapeControls({ nodeId }: { nodeId: string }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  // Follows edges drawn or deleted while the node stays selected.
  const count = useValue(
    "count-shape targets",
    () => (editorRef ? outgoingTargetNodeIds(editorRef as unknown as CountShapeEditor, nodeId).length : 0),
    [editorRef, nodeId],
  );
  const [status, setStatus] = useState<string | null>(null);

  if (count < 2) return null;

  const run = (kind: CountShapeKind) => {
    if (!editorRef) return;
    const result = applyCountShape(editorRef as unknown as CountShapeEditor, nodeId, kind);
    if (!result.ok) setStatus(result.message);
    else if (result.kind === "polygon") setStatus(`Laid out as a ${result.shapeName}. An empty corner is a missing member.`);
    else setStatus(`Laid out as a ladder of ${result.count}, top to bottom.`);
  };

  const polygon = canUsePolygon(count);

  return (
    <section aria-label="Count-shape" className="space-y-1.5 rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
      <p className="text-xs font-medium text-zinc-200">Count-shape</p>
      <p className="text-[11px] leading-4 text-zinc-500">
        {count} linked nodes. Is this set ordered? An unordered set sits on the corners of a {polygon ? COUNT_SHAPE_NAMES[count] : "polygon"},
        so a missing one shows as an empty corner.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {polygon ? (
          <Button type="button" size="sm" variant="secondary" onClick={() => run("polygon")}>
            Polygon (unordered)
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="secondary" onClick={() => run("ladder")}>
          Ladder (ordered)
        </Button>
      </div>
      {!polygon ? (
        <p className="text-[11px] leading-4 text-zinc-400">
          More than {COUNT_SHAPE_MAX}: {LADDER_REASON}
        </p>
      ) : null}
      {status ? (
        <p role="status" className="text-[11px] leading-4 text-emerald-300">
          {status}
        </p>
      ) : null}
    </section>
  );
}
