import { useEffect, useMemo, useState } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { writeNodeNedf } from "../canvas/writeNodeNedf";
import { NEDF_SLOTS, type NedfEncoding, type NedfSlot } from "../domain/entities/types";
import {
  NEDF_SLOT_LABELS,
  NEDF_SLOT_OPERATIONS,
  filledNedfSlots,
  isSlotFilled,
  normalizeNedf,
  stopCards,
} from "../domain/services/nedf";
import { usePalaceStore } from "../store/palaceStore";
import { cn } from "../utils/cn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Draft = {
  nameHook: string;
  essence: string;
  prompt: string;
  reason: string;
  scenario: string;
  correction: string;
};

function toDraft(nedf: NedfEncoding | null): Draft {
  return {
    nameHook: nedf?.nameHook ?? "",
    essence: nedf?.essence ?? "",
    prompt: nedf?.distinguisher?.prompt ?? "",
    reason: nedf?.distinguisher?.reason ?? "",
    scenario: nedf?.failure?.scenario ?? "",
    correction: nedf?.failure?.correction ?? "",
  };
}

function fromDraft(draft: Draft): NedfEncoding | null {
  return normalizeNedf({
    nameHook: draft.nameHook,
    essence: draft.essence,
    distinguisher: { prompt: draft.prompt, reason: draft.reason },
    failure: { scenario: draft.scenario, correction: draft.correction },
  });
}

/**
 * The four slots as the corners of a square (N E over D F), so an empty corner shows before any
 * label is read.
 */
function NedfSquare({ filled }: { filled: readonly NedfSlot[] }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-4 w-4 shrink-0 grid-cols-2 gap-px rounded-sm bg-zinc-700 p-px"
      title={NEDF_SLOTS.map((slot) => `${NEDF_SLOT_LABELS[slot]}: ${filled.includes(slot) ? "filled" : "empty"}`).join("\n")}
    >
      {NEDF_SLOTS.map((slot) => (
        <span key={slot} className={cn("rounded-[1px]", filled.includes(slot) ? "bg-emerald-400" : "bg-zinc-900")} />
      ))}
    </span>
  );
}

const textareaClass =
  "mt-1 block w-full resize-y rounded-md border border-zinc-700 bg-zinc-900/70 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500";

/**
 * Name-hook, Essence, Distinguisher, and Failure for one node. Each filled slot reviews on its
 * own schedule; a pair counts once both halves are written.
 */
export function NedfSlotsEditor({ nodeId }: { nodeId: string }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const loci = usePalaceStore((s) => s.loci);
  const stored = useMemo(() => {
    const shape = selectedShapeId ? editorRef?.getShape(selectedShapeId as TLShapeId) : undefined;
    return normalizeNedf((shape?.meta as MemoryPalaceMeta | undefined)?.mpNedf);
  }, [editorRef, selectedShapeId]);
  const [draft, setDraft] = useState<Draft>(() => toDraft(stored));
  const [open, setOpen] = useState(() => stored !== null);

  useEffect(() => {
    setDraft(toDraft(stored));
    setOpen(stored !== null);
  }, [nodeId, stored]);

  const current = useMemo(() => fromDraft(draft), [draft]);
  const filled = filledNedfSlots(current);

  const nextReviewBySlot = useMemo(() => {
    const next = new Map<NedfSlot, string>();
    for (const locus of loci) {
      if (locus.nodeId !== nodeId) continue;
      for (const card of stopCards(locus, current)) {
        if (!card.slot) continue;
        const known = next.get(card.slot);
        if (!known || card.schedule.nextReviewAt < known) next.set(card.slot, card.schedule.nextReviewAt);
      }
    }
    return next;
  }, [loci, nodeId, current]);

  const commit = () => {
    if (!editorRef || !selectedShapeId) return;
    // Compare with the shape as it is now: `stored` is only read when the selection changes.
    const live = normalizeNedf((editorRef.getShape(selectedShapeId as TLShapeId)?.meta as MemoryPalaceMeta)?.mpNedf);
    if (JSON.stringify(current) === JSON.stringify(live)) return;
    writeNodeNedf(editorRef, nodeId, current);
  };

  const field = (key: keyof Draft) => ({
    value: draft[key],
    onChange: (event: { target: { value: string } }) => setDraft((prev) => ({ ...prev, [key]: event.target.value })),
    onBlur: commit,
  });

  const status = (slot: NedfSlot, missingHalf: string | null) => {
    if (isSlotFilled(current, slot)) {
      const due = nextReviewBySlot.get(slot);
      return due ? `${NEDF_SLOT_OPERATIONS[slot]} card · next review ${new Date(due).toLocaleDateString()}` : `${NEDF_SLOT_OPERATIONS[slot]} card`;
    }
    return missingHalf ?? "Not encoded yet";
  };

  const pairStatus = (a: string, b: string, needA: string, needB: string) =>
    a.trim() && !b.trim() ? needB : !a.trim() && b.trim() ? needA : null;

  return (
    <section aria-label="NEDF slots" className="rounded-md border border-zinc-800 bg-zinc-900/40">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
      >
        <NedfSquare filled={filled} />
        <span className="flex-1">NEDF</span>
        {filled.length > 0 ? (
          <span data-testid="nedf-encoded" className="rounded bg-emerald-900/60 px-1.5 text-[10px] font-medium text-emerald-200">
            NEDF-encoded · {filled.length}/4
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500">not encoded</span>
        )}
      </button>
      {open ? (
        <div className="space-y-3 border-t border-zinc-800 px-2 pb-2 pt-2">
          <p className="text-[11px] leading-4 text-zinc-500">
            Four ways into one scene. Each filled slot is drilled on its own schedule.
          </p>
          <div>
            <Label htmlFor="mp-nedf-name-hook">Name-hook</Label>
            <textarea
              id="mp-nedf-name-hook"
              rows={2}
              placeholder="A sound-alike, pun, or image that fires before any reasoning"
              className={textareaClass}
              {...field("nameHook")}
            />
            <p className="mt-0.5 text-[10px] text-zinc-500">{status("nameHook", null)}</p>
          </div>
          <div>
            <Label htmlFor="mp-nedf-essence">Essence</Label>
            <textarea
              id="mp-nedf-essence"
              rows={2}
              placeholder="What it does, in one or two sentences"
              className={textareaClass}
              {...field("essence")}
            />
            <p className="mt-0.5 text-[10px] text-zinc-500">{status("essence", null)}</p>
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-zinc-200">Distinguisher</legend>
            <Input
              aria-label="Distinguisher question"
              placeholder="A question that fits this and its nearest neighbour"
              className="mt-1"
              {...field("prompt")}
            />
            <Input
              aria-label="Distinguisher reason"
              placeholder="Why it is this one and not the neighbour"
              className="mt-1"
              {...field("reason")}
            />
            <p className="mt-0.5 text-[10px] text-zinc-500">
              {status("distinguisher", pairStatus(draft.prompt, draft.reason, "Needs the question too", "Needs the reason too"))}
            </p>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-zinc-200">Failure</legend>
            <Input
              aria-label="Failure scenario"
              placeholder="A concrete scene where it breaks or is misused"
              className="mt-1"
              {...field("scenario")}
            />
            <Input
              aria-label="Failure correction"
              placeholder="The fix"
              className="mt-1"
              {...field("correction")}
            />
            <p className="mt-0.5 text-[10px] text-zinc-500">
              {status("failure", pairStatus(draft.scenario, draft.correction, "Needs the scenario too", "Needs the correction too"))}
            </p>
          </fieldset>
        </div>
      ) : null}
    </section>
  );
}
