import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { MotifKind } from "../domain/services/cast/castMotifs";
import { MOTIF_MOVES } from "../domain/services/cast/castMotifs";
import {
  MOTIF_TEMPLATES,
  instantiateMotif,
  suggestMotif,
  type MotifScaffold,
} from "../domain/services/cast/motifTemplates";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onInsert: (scaffold: MotifScaffold) => void;
};

const KINDS: MotifKind[] = [
  "cascade",
  "diamond",
  "hubSpoke",
  "feedbackLoop",
  "bottleneck",
  "bipartite",
];

export function RepresentMotifDialog({ open, onOpenChange, onInsert }: Props) {
  const [statement, setStatement] = React.useState("");
  const [kind, setKind] = React.useState<MotifKind>("cascade");
  const [titles, setTitles] = React.useState<string[]>(MOTIF_TEMPLATES.cascade.defaultTitles);
  const [userPickedKind, setUserPickedKind] = React.useState(false);

  const suggestion = React.useMemo(() => suggestMotif(statement), [statement]);

  // When the suggestion changes and the user hasn't manually picked, follow it.
  React.useEffect(() => {
    if (!userPickedKind && suggestion && suggestion.kind !== kind) {
      setKind(suggestion.kind);
      setTitles(MOTIF_TEMPLATES[suggestion.kind].defaultTitles);
    }
  }, [suggestion, userPickedKind, kind]);

  const pickKind = (next: MotifKind) => {
    setUserPickedKind(true);
    setKind(next);
    setTitles(MOTIF_TEMPLATES[next].defaultTitles);
  };

  const updateTitle = (index: number, value: string) => {
    setTitles((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const reset = () => {
    setStatement("");
    setKind("cascade");
    setTitles(MOTIF_TEMPLATES.cascade.defaultTitles);
    setUserPickedKind(false);
  };

  const handleInsert = () => {
    onInsert(instantiateMotif(kind, titles));
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(560px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-zinc-100">
            Represent — scaffold from a motif
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-zinc-400">
            FRAME FORGE step 3. Describe the problem; pick a motif; the lab seeds the nodes and CAST
            edges so you can refine instead of build from scratch.
          </Dialog.Description>

          <div className="mt-3">
            <Label htmlFor="represent-statement">Problem statement</Label>
            <textarea
              id="represent-statement"
              aria-label="Problem statement"
              className="mt-1 h-20 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. design an auth pipeline, or merge two upload paths into one writer"
            />
            {suggestion ? (
              <div
                role="status"
                aria-label="Motif suggestion"
                className="mt-2 rounded border border-violet-700/50 bg-violet-950/40 px-2 py-1 text-xs text-violet-100"
              >
                Suggested: <span className="font-medium">{MOTIF_TEMPLATES[suggestion.kind].title}</span>{" "}
                <span className="text-violet-300/80">— {suggestion.reasoning}</span>
              </div>
            ) : statement.trim().length > 0 ? (
              <div className="mt-2 text-[11px] text-zinc-500">
                No strong keyword signal — pick a motif manually below.
              </div>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {KINDS.map((k) => {
              const meta = MOTIF_TEMPLATES[k];
              const selected = kind === k;
              const isSuggested = suggestion?.kind === k;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickKind(k)}
                  className={`rounded-md border p-2 text-left text-xs transition-colors ${
                    selected
                      ? "border-violet-500 bg-violet-700/30 text-violet-50"
                      : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{meta.title}</span>
                    {isSuggested ? (
                      <span className="rounded bg-violet-500/30 px-1 text-[10px] text-violet-100">
                        suggested
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">{meta.blurb}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded border border-zinc-800 bg-zinc-950/60 p-2 text-[11px] italic text-zinc-400">
            {MOTIF_MOVES[kind].label} — {MOTIF_MOVES[kind].hint}
          </div>

          <div className="mt-3">
            <Label>Node titles</Label>
            <div className="mt-1 grid gap-1.5">
              {MOTIF_TEMPLATES[kind].defaultTitles.map((dflt, i) => (
                <input
                  key={`${kind}-${i}`}
                  aria-label={`Node ${i + 1} title`}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100"
                  value={titles[i] ?? ""}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  placeholder={dflt}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleInsert}>
              Insert into palace
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
