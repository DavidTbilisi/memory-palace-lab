import { useMemo, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { GLOSSARY } from "../domain/glossary";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Open the full glossary (terms + CAST lexicon) in the Library. */
  onOpenLibrary?: () => void;
};

export function GlossaryPanel({ open, onOpenChange, onOpenLibrary }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return GLOSSARY;
    const q = query.toLowerCase();
    return GLOSSARY.filter(
      (entry) =>
        entry.term.toLowerCase().includes(q) || entry.definition.toLowerCase().includes(q),
    );
  }, [query]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setQuery("");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[22vh] z-50 w-[min(480px,92vw)] -translate-x-1/2 rounded-[28px] border border-zinc-700/80 bg-zinc-950/96 p-3 shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
          <Dialog.Title className="sr-only">Vocabulary glossary</Dialog.Title>
          <div className="rounded-[22px] border border-zinc-800/80 bg-[radial-gradient(circle_at_top,#312e81_0%,rgba(9,9,11,0)_42%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,0.98))]">
            <div className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-3">
              <Search className="h-4 w-4 text-violet-300" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search terms..."
                className="h-10 w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                aria-label="Glossary search"
              />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-800/50"
                aria-label="Close glossary"
              >
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 px-4 py-8 text-center text-sm text-zinc-500">
                  No terms matched. Try "locus", "CAST", "recall", or "encoding".
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((entry) => (
                    <div
                      key={entry.term}
                      className="rounded-2xl border border-zinc-800/40 bg-zinc-950/40 px-4 py-3 transition hover:border-zinc-700/60 hover:bg-zinc-900/60"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-violet-200">{entry.term}</h3>
                        {entry.also && entry.also.length > 0 ? (
                          <div className="flex gap-1">
                            {entry.also.map((alias) => (
                              <span
                                key={alias}
                                className="rounded-full bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400"
                              >
                                {alias}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-zinc-300">{entry.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {onOpenLibrary ? (
              <div className="border-t border-zinc-800/80 px-4 py-2 text-right">
                <button
                  type="button"
                  className="text-xs text-violet-300 underline-offset-2 hover:underline"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenLibrary();
                  }}
                >
                  Open full glossary and CAST lexicon in the Library
                </button>
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
