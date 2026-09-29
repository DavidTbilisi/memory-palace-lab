import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import { useValue } from "@tldraw/editor";
import { X } from "lucide-react";
import { canvasConfusionEdges } from "../canvas/confusionLinks";
import { confusionNeighbours } from "../domain/services/confusion";
import { usePalaceStore, type WalkMissNotice, type WalkMissPrompt } from "../store/palaceStore";
import { cn } from "../utils/cn";
import { useCanvasNodeTitles } from "./hooks/useCanvasNodeTitles";
import { Button } from "./ui/button";

/** How many matching nodes the picker lists at once; typing narrows it. */
const MAX_OPTIONS = 8;
/** A confirmation with nothing to decide goes away on its own after this long. */
const NOTICE_MS = 8_000;

const EMPTY_NEIGHBOURS: string[] = [];

type Candidate = { id: string; title: string; linked: boolean };

/**
 * The palace's other nodes by title, confusion neighbours first. Titles come live from the canvas,
 * or from the saved snapshot when there is no canvas.
 */
function useCandidates(nodeId: string): Candidate[] {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const nodes = usePalaceStore((s) => s.nodes);
  const edges = usePalaceStore((s) => s.edges);
  const canvasTitles = useCanvasNodeTitles(editorRef);
  const neighbours = useValue(
    "miss prompt neighbours",
    () => (editorRef ? confusionNeighbours(canvasConfusionEdges(editorRef), nodeId) : EMPTY_NEIGHBOURS),
    [editorRef, nodeId],
  );
  return useMemo(() => {
    const titles =
      canvasTitles.size > 0 ? canvasTitles : new Map(nodes.map((node) => [node.id, node.title.trim() || "Untitled node"]));
    const linked = new Set(editorRef ? neighbours : confusionNeighbours(edges, nodeId));
    return [...titles.entries()]
      .filter(([id]) => id !== nodeId)
      .map(([id, title]) => ({ id, title, linked: linked.has(id) }))
      .sort((a, b) => Number(b.linked) - Number(a.linked) || a.title.localeCompare(b.title));
  }, [canvasTitles, edges, editorRef, neighbours, nodeId, nodes]);
}

/** A searchable list of the palace's other nodes; picking one logs the confusion. */
function MixedUpPicker({ prompt, onPick }: { prompt: WalkMissPrompt; onPick: (nodeId: string) => void }) {
  const candidates = useCandidates(prompt.nodeId);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  useEffect(() => {
    setQuery("");
    setOpen(false);
  }, [prompt]);

  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const found = needle ? candidates.filter((c) => c.title.toLocaleLowerCase().includes(needle)) : candidates;
    return found.slice(0, MAX_OPTIONS);
  }, [candidates, query]);
  const activeIndex = Math.min(active, Math.max(0, matches.length - 1));

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + matches.length) % Math.max(1, matches.length));
    } else if (event.key === "Enter") {
      const pick = matches[activeIndex];
      if (open && pick) {
        event.preventDefault();
        onPick(pick.id);
      }
    } else if (event.key === "Escape" && open) {
      // Close the list only; the walk or the summary keeps its own Escape.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div role="group" aria-label="Mixed it up with" className="relative">
      <input
        type="text"
        role="combobox"
        aria-label="Mixed it up with"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        placeholder="Mixed it up with…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-7 w-44 rounded-md border border-amber-800/60 bg-zinc-950 px-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Nodes in this palace"
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-60 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-950 py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-2 py-1 text-xs text-zinc-500">No matching node</li>
          ) : (
            matches.map((candidate, index) => (
              <li
                key={candidate.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                // Picked on mouse down, before the input's blur closes the list.
                onMouseDown={(event) => {
                  event.preventDefault();
                  onPick(candidate.id);
                }}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-2 py-1 text-xs text-zinc-200",
                  index === activeIndex && "bg-zinc-800",
                )}
              >
                <span className="truncate">{candidate.title}</span>
                {candidate.linked ? <span className="shrink-0 text-[10px] text-orange-300">linked</span> : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

function DismissButton({ label = "Dismiss" }: { label?: string }) {
  const dismissWalkMiss = usePalaceStore((s) => s.dismissWalkMiss);
  return (
    <Button
      size="sm"
      variant="ghost"
      type="button"
      aria-label={label}
      title={label}
      className="h-7 w-7 shrink-0 px-0 text-amber-200/80"
      onClick={dismissWalkMiss}
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  );
}

function MissQuestion({ prompt }: { prompt: WalkMissPrompt }) {
  const explainWalkMiss = usePalaceStore((s) => s.explainWalkMiss);
  return (
    <>
      <span className="min-w-0 truncate">
        Missed <span className="font-semibold text-amber-50">{prompt.nodeTitle}</span>?
      </span>
      <MixedUpPicker prompt={prompt} onPick={(nodeId) => void explainWalkMiss("confusion", nodeId)} />
      <span aria-hidden="true" className="text-amber-200/50">
        ·
      </span>
      <Button
        size="sm"
        variant="ghost"
        type="button"
        className="h-7 px-2 text-xs text-amber-100"
        title="Tip of the tongue: nothing came, rather than the wrong thing"
        onClick={() => void explainWalkMiss("blank")}
      >
        Couldn't produce it
      </Button>
      <DismissButton />
    </>
  );
}

function MissNotice({ notice }: { notice: WalkMissNotice }) {
  const linkWalkMissConfusion = usePalaceStore((s) => s.linkWalkMissConfusion);
  const dismissWalkMiss = usePalaceStore((s) => s.dismissWalkMiss);
  const decides = notice.offerLink || notice.notes.length > 0;
  useEffect(() => {
    if (decides) return;
    const timer = setTimeout(dismissWalkMiss, NOTICE_MS);
    return () => clearTimeout(timer);
  }, [decides, dismissWalkMiss, notice]);

  return (
    <div role="status" className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
      <span data-testid="walk-miss-message">{notice.message}</span>
      {notice.offerLink ? (
        <>
          <Button
            size="sm"
            type="button"
            className="h-7 bg-orange-700 px-2 text-xs text-white hover:bg-orange-600"
            onClick={linkWalkMissConfusion}
          >
            Link
          </Button>
          <Button size="sm" variant="ghost" type="button" className="h-7 px-2 text-xs text-amber-100" onClick={dismissWalkMiss}>
            Not now
          </Button>
        </>
      ) : null}
      {notice.notes.map((note) => (
        <span key={note} className="text-amber-200/80">
          {note}
        </span>
      ))}
    </div>
  );
}

/**
 * After an Again: "Missed X? Mixed it up with… · Couldn't produce it". Never blocks the walk; it
 * sits under the walk bar, or inside the session summary when the miss was the last step.
 */
export function RecallMissPrompt({ placement }: { placement: "walk" | "summary" }) {
  const prompt = usePalaceStore((s) => s.walkMissPrompt);
  const notice = usePalaceStore((s) => s.walkMissNotice);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  if (!prompt && !notice) return null;
  if (placement === "walk" && !walkOpen) return null;
  return (
    <div
      role="region"
      aria-label="Missed recall"
      data-testid="walk-miss-prompt"
      className={cn(
        "flex min-w-0 items-center gap-2 text-xs text-amber-100",
        placement === "walk"
          ? "border-b border-amber-800/50 bg-amber-950/30 px-2 py-1"
          : "mt-3 rounded-md border border-amber-800/50 bg-amber-950/30 px-3 py-2",
      )}
    >
      {prompt ? (
        <MissQuestion prompt={prompt} />
      ) : notice ? (
        <>
          <MissNotice notice={notice} />
          <DismissButton />
        </>
      ) : null}
    </div>
  );
}
