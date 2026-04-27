import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Command, Search } from "lucide-react";
import { rankPaletteItems, type PaletteItem } from "../domain/services/commandPalette";

export type PaletteCommand = PaletteItem & {
  onSelect: () => void;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: PaletteCommand[];
  recentIds: string[];
  onCommandRun: (id: string) => void;
};

function groupResults(commands: PaletteCommand[]) {
  const groups = new Map<string, PaletteCommand[]>();
  for (const command of commands) {
    const existing = groups.get(command.group) ?? [];
    existing.push(command);
    groups.set(command.group, existing);
  }
  return [...groups.entries()];
}

export function CommandPalette({ open, onOpenChange, commands, recentIds, onCommandRun }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const ranked = useMemo(() => {
    const matches = rankPaletteItems(commands, debouncedQuery, recentIds);
    const rankedIds = new Set(matches.map((item) => item.id));
    return matches
      .map((item) => commands.find((command) => command.id === item.id))
      .filter((command): command is PaletteCommand => !!command && rankedIds.has(command.id))
      .slice(0, 30);
  }, [commands, debouncedQuery, recentIds]);

  const grouped = useMemo(() => groupResults(ranked), [ranked]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      buttonRefs.current = [];
      return;
    }
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    const target = buttonRefs.current[activeIndex];
    target?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const execute = (command: PaletteCommand | undefined) => {
    if (!command) return;
    onCommandRun(command.id);
    command.onSelect();
    onOpenChange(false);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (ranked.length === 0 ? 0 : (current + 1) % ranked.length));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (ranked.length === 0 ? 0 : (current - 1 + ranked.length) % ranked.length));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      execute(ranked[activeIndex]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[18vh] z-50 w-[min(760px,92vw)] -translate-x-1/2 rounded-[28px] border border-zinc-700/80 bg-zinc-950/96 p-3 shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="rounded-[22px] border border-zinc-800/80 bg-[radial-gradient(circle_at_top,#312e81_0%,rgba(9,9,11,0)_42%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,0.98))]">
            <div className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-3">
              <Search className="h-4 w-4 text-violet-300" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search pages, palaces, routes, nodes, and actions"
                className="h-10 w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                aria-label="Command palette search"
              />
              <div className="hidden rounded-full border border-zinc-700 bg-zinc-900/70 px-2 py-1 text-[11px] text-zinc-400 sm:flex sm:items-center sm:gap-1">
                <Command className="h-3 w-3" />
                Ctrl/Cmd+K
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {ranked.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 px-4 py-8 text-center text-sm text-zinc-500">
                  No commands matched. Try palace, route, review, system, or help.
                </div>
              ) : (
                grouped.map(([group, entries]) => (
                  <section key={group} className="mb-4 last:mb-0">
                    <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {group}
                    </div>
                    <div className="space-y-1">
                      {entries.map((command) => {
                        const index = ranked.findIndex((entry) => entry.id === command.id);
                        const active = index === activeIndex;
                        return (
                          <button
                            key={command.id}
                            ref={(node) => {
                              buttonRefs.current[index] = node;
                            }}
                            type="button"
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => execute(command)}
                            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                              active
                                ? "border-violet-500/60 bg-violet-950/30 text-zinc-100"
                                : "border-transparent bg-zinc-950/40 text-zinc-300 hover:border-zinc-800 hover:bg-zinc-900/70"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium">{command.title}</div>
                              {command.subtitle ? (
                                <div className="mt-1 truncate text-xs text-zinc-500">{command.subtitle}</div>
                              ) : null}
                            </div>
                            <ArrowRight className={`h-4 w-4 shrink-0 ${active ? "text-violet-300" : "text-zinc-600"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
