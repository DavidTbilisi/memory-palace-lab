import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import { usePalaceDifficulty } from "../hooks/usePalaceDifficulty";
import {
  difficultyLevel,
  type NodeDifficulty,
} from "../domain/services/palaceDifficulty";
import { writeNodeDifficulty } from "../canvas/writeNodeDifficulty";
import type { NodeDifficultyOverride } from "../domain/entities/types";
import { Button } from "./ui/button";

const LEVEL_TONE: Record<number, string> = {
  1: "border-emerald-400/70 bg-emerald-500/15 text-emerald-200",
  2: "border-lime-400/70 bg-lime-500/15 text-lime-200",
  3: "border-amber-400/70 bg-amber-500/15 text-amber-200",
  4: "border-orange-400/70 bg-orange-500/15 text-orange-200",
  5: "border-rose-400/80 bg-rose-500/20 text-rose-200",
};

function Unit({ step, wall }: { step: number; wall: number }) {
  const level = difficultyLevel(step, wall);
  return (
    <span
      className={`inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md border px-1.5 text-xs font-semibold tabular-nums ${LEVEL_TONE[level]}`}
      title={`difficulty level ${level} of 5`}
    >
      {step}
    </span>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div
      className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2"
      title={hint}
    >
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="text-lg font-semibold text-zinc-100 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function num(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function OverrideEditor({ node }: { node: NodeDifficulty }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const queueDraftSave = usePalaceStore((s) => s.queueDraftSave);
  const r = node.row;
  const [newIdeas, setNewIdeas] = useState(String(r.new_ideas ?? ""));
  const [normalLinks, setNormalLinks] = useState(String(r.normal_links ?? ""));
  const [analogy, setAnalogy] = useState(String(r.analogy_links ?? ""));
  const [juggle, setJuggle] = useState(String(r.juggle ?? ""));
  const [breaks, setBreaks] = useState((r.breaks ?? []).join("\n"));
  const [keyIdea, setKeyIdea] = useState(r.key_idea ?? "");
  const [saved, setSaved] = useState<"" | "saved" | "reset">("");

  const apply = (override: NodeDifficultyOverride | null) => {
    if (!editorRef) return;
    writeNodeDifficulty(editorRef, node.nodeId, override);
    queueDraftSave();
  };

  const save = () => {
    const override: NodeDifficultyOverride = {
      new_ideas: num(newIdeas),
      normal_links: num(normalLinks),
      analogy_links: num(analogy),
      juggle: num(juggle),
      breaks: breaks
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      key_idea: keyIdea.trim() || null,
    };
    apply(override);
    setSaved("saved");
  };

  const field =
    "w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100";

  return (
    <div className="mt-2 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 sm:grid-cols-2">
      <label className="text-xs text-zinc-400">
        new ideas
        <input
          className={field}
          inputMode="numeric"
          value={newIdeas}
          onChange={(e) => setNewIdeas(e.target.value)}
        />
      </label>
      <label className="text-xs text-zinc-400">
        normal links (deps)
        <input
          className={field}
          inputMode="numeric"
          value={normalLinks}
          onChange={(e) => setNormalLinks(e.target.value)}
        />
      </label>
      <label className="text-xs text-zinc-400">
        juggle (working-memory cliff at 4)
        <input
          className={field}
          inputMode="numeric"
          value={juggle}
          onChange={(e) => setJuggle(e.target.value)}
        />
      </label>
      <label className="text-xs text-zinc-400">
        analogy links (−2 each)
        <input
          className={field}
          inputMode="numeric"
          value={analogy}
          onChange={(e) => setAnalogy(e.target.value)}
        />
      </label>
      <label className="text-xs text-zinc-400 sm:col-span-2">
        belief-breakers (one per line, +3 each — where most felt difficulty
        hides)
        <textarea
          className={`${field} min-h-[56px]`}
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
        />
      </label>
      <label className="text-xs text-zinc-400 sm:col-span-2">
        key idea (the one insight that makes it click)
        <input
          className={field}
          value={keyIdea}
          onChange={(e) => setKeyIdea(e.target.value)}
        />
      </label>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button size="sm" type="button" onClick={save}>
          Save override
        </Button>
        <Button
          size="sm"
          variant="secondary"
          type="button"
          onClick={() => {
            apply(null);
            setSaved("reset");
          }}
        >
          Reset to auto
        </Button>
        {saved === "saved" ? (
          <span className="text-xs text-emerald-300">✓ pinned</span>
        ) : null}
        {saved === "reset" ? (
          <span className="text-xs text-zinc-400">↺ auto-derived</span>
        ) : null}
      </div>
    </div>
  );
}

export function DifficultyPanel() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const difficulty = usePalaceDifficulty();
  const [expanded, setExpanded] = useState<string | null>(null);

  const ranked = useMemo(
    () =>
      [...difficulty.nodes].sort(
        (a, b) =>
          b.result.step - a.result.step || b.result.for_you - a.result.for_you,
      ),
    [difficulty.nodes],
  );
  const titleById = useMemo(
    () => new Map(difficulty.nodes.map((n) => [n.nodeId, n.title])),
    [difficulty.nodes],
  );

  if (!currentPalace) {
    return (
      <div className="text-sm text-zinc-400">
        Open a palace to see its difficulty units.
      </div>
    );
  }
  if (difficulty.nodes.length === 0) {
    return (
      <div className="text-sm text-zinc-400">
        Add nodes to this palace to see difficulty units.
      </div>
    );
  }

  const { rollup, wall } = difficulty;
  const walls = ranked.filter((n) => n.result.wall);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <Sparkles className="h-5 w-5 text-violet-300" /> Difficulty —{" "}
          {currentPalace.name}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Learner-relative acquisition cost (the <code>/difficulty</code>{" "}
          estimator). Units are ordinal — read the ranking, the walls, and the
          order, not the absolute totals.{" "}
          <span className="text-zinc-400">For-you</span> shrinks as you review
          (well-rehearsed nodes count as absorbed).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Stat label="Nodes" value={rollup.nodeCount} />
        <Stat
          label="From zero"
          value={rollup.fromZero}
          hint="Total intrinsic cost to learn the whole palace from scratch"
        />
        <Stat
          label="Remaining"
          value={rollup.remaining}
          hint="Cost left for you (un-absorbed nodes)"
        />
        <Stat
          label="Walls"
          value={rollup.walls}
          hint={`Nodes with step ≥ ${wall} — intrinsically hard`}
        />
        <Stat
          label="Absorbed"
          value={`${rollup.absorbed}/${rollup.nodeCount}`}
          hint="Nodes whose loci are well-reviewed"
        />
      </div>

      {walls.length > 0 ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3">
          <div className="text-sm font-semibold text-rose-200">
            Walls — front-load the key idea before the learner hits these
          </div>
          <ul className="mt-2 space-y-1.5">
            {walls.map((n) => (
              <li key={n.nodeId} className="flex items-start gap-2 text-sm">
                <Unit step={n.result.step} wall={wall} />
                <div className="min-w-0">
                  <span className="text-zinc-100">{n.title}</span>
                  {n.result.key_idea ? (
                    <span className="text-zinc-400">
                      {" "}
                      — key idea: “{n.result.key_idea}”
                    </span>
                  ) : (
                    <span className="text-amber-300/80">
                      {" "}
                      — no key idea yet (add one to flatten the wall)
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
        <div className="text-sm font-semibold text-zinc-200">
          Learning order
        </div>
        <div className="mt-1 text-xs leading-relaxed text-zinc-400">
          {difficulty.order.map((id, i) => (
            <span key={id}>
              {i > 0 ? <span className="text-zinc-600"> → </span> : null}
              {titleById.get(id) ?? id}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/60 text-[11px] uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2 text-left">Topic</th>
              <th className="px-2 py-2 text-right">Step</th>
              <th
                className="px-2 py-2 text-right"
                title="cost for you, given what you've absorbed"
              >
                For-you
              </th>
              <th
                className="px-2 py-2 text-right"
                title="cost assuming you know nothing"
              >
                From-zero
              </th>
              <th className="px-2 py-2 text-right">Juggle</th>
              <th className="px-2 py-2 text-right">Breaks</th>
              <th className="px-2 py-2 text-center">Src</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((n) => (
              <tr
                key={n.nodeId}
                className="border-t border-zinc-800/80 align-top"
              >
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-left text-zinc-100 hover:text-violet-200"
                    onClick={() =>
                      setExpanded(expanded === n.nodeId ? null : n.nodeId)
                    }
                  >
                    {expanded === n.nodeId ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                    <span className="truncate">{n.title}</span>
                    {n.absorbed ? (
                      <span className="rounded bg-emerald-500/15 px-1 text-[10px] text-emerald-300">
                        absorbed
                      </span>
                    ) : null}
                    {n.result.wall ? (
                      <span className="rounded bg-rose-500/20 px-1 text-[10px] text-rose-200">
                        wall
                      </span>
                    ) : null}
                  </button>
                  {expanded === n.nodeId ? <OverrideEditor node={n} /> : null}
                </td>
                <td className="px-2 py-2 text-right">
                  <Unit step={n.result.step} wall={wall} />
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-zinc-300">
                  {n.result.for_you}
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-zinc-500">
                  {n.result.from_zero}
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-zinc-400">
                  {n.result.juggle}
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-zinc-400">
                  {n.result.breaks}
                </td>
                <td className="px-2 py-2 text-center text-[10px] uppercase text-zinc-500">
                  {n.overridden ? "manual" : "auto"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
