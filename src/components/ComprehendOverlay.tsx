import { Telescope, Target } from "lucide-react";
import type { CruxReason } from "../domain/services/cast/crux";
import { usePalaceStore } from "../store/palaceStore";
import { ComprehendPanel } from "./ComprehendPanel";
import { useComprehendCrux } from "./hooks/useComprehendCrux";

const REASON_COPY: Record<CruxReason, string> = {
  betweenness: "Most paths route through it — it holds the structure together.",
  bridge: "It's the single link between otherwise separate clusters.",
  hub: "Everything fans out from it.",
};

/**
 * Comprehend-mode side panel. Reads the palace's crux (spotlighted on the canvas
 * by MemoryPalaceCanvas) and frames it for the reader. The nine-dive interrogation
 * lives in a child panel.
 */
export function ComprehendOverlay() {
  const { crux, cruxTitle, nodeCount, edgeCount, motifTotal } = useComprehendCrux();
  const setAppMode = usePalaceStore((s) => s.setAppMode);
  const encodeNode = usePalaceStore((s) => s.encodeNode);

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-zinc-800 bg-zinc-950/80">
      <header className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2.5">
        <Telescope className="h-4 w-4 text-violet-300" />
        <div className="text-sm font-semibold text-zinc-100">Comprehend</div>
        <div className="ml-auto text-[11px] text-zinc-500">
          {nodeCount} nodes · {edgeCount} edges · {motifTotal} motifs
        </div>
      </header>

      {crux && cruxTitle ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Your crux</div>
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 p-3">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
            <div>
              <div className="text-sm font-semibold text-zinc-50">{cruxTitle}</div>
              <div className="mt-1 text-xs leading-5 text-zinc-400">{REASON_COPY[crux.reason]}</div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            If this node resists, the whole structure resists. Interrogate it before you encode further.
          </p>
          <ComprehendPanel
            onUnderstood={() => setAppMode("encode")}
            onEncodeThis={() => encodeNode(crux.nodeId)}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <Target className="h-5 w-5 text-zinc-600" />
          <p className="text-xs leading-5 text-zinc-500">
            No clear crux yet. Add a few connected nodes and the gating structure will surface here.
          </p>
        </div>
      )}
    </aside>
  );
}
