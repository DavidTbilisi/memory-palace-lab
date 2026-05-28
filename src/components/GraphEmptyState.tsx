import { BookOpen, Search, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function GraphEmptyState({
  onCreateTutorialPalace,
  onOpenHelp,
  onOpenCommandPalette,
  onOpenImport,
}: {
  onCreateTutorialPalace: () => void;
  onOpenHelp: () => void;
  onOpenCommandPalette: () => void;
  onOpenImport: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[34px] border border-zinc-800 bg-[radial-gradient(circle_at_top,#27272a_0%,rgba(9,9,11,0)_48%),linear-gradient(180deg,rgba(24,24,27,0.94),rgba(9,9,11,0.98))] p-7 shadow-[0_28px_120px_rgba(0,0,0,0.45)]">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Palace workspace</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">Build the graph where memory actually lives.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Start with one palace, a few anchors, and one route. The surrounding pages handle review, system workflows,
          and insight. This surface stays dedicated to graph work.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={onCreateTutorialPalace}>
            <Sparkles className="h-4 w-4" />
            Create tutorial palace
          </Button>
          <Button type="button" variant="secondary" onClick={onOpenHelp}>
            <BookOpen className="h-4 w-4" />
            Open help
          </Button>
          <Button type="button" variant="outline" onClick={onOpenCommandPalette}>
            <Search className="h-4 w-4" />
            Open command palette
          </Button>
          <Button type="button" variant="outline" onClick={onOpenImport}>
            Import notes
          </Button>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Review</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">Queue weak routes, start walks, and keep retrieval stable.</div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Insights</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">See memory strength, graph activity, and review signals without leaving the app.</div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">System</div>
            <div className="mt-2 text-sm leading-6 text-zinc-300">Run frameworks as pipelines and materialize them into the current palace.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
