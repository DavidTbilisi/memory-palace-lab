import { useEffect, useState } from "react";
import { readNumberCluster } from "../canvas/supportTable";
import { findNodeByAddress } from "../canvas/storeNodes";
import { TABLE_IMAGE_LETTERS, formatTableNumber, type NumberClusterInput } from "../domain/services/generatedStore";
import { usePalaceStore } from "../store/palaceStore";
import { currentClusterFilledCount, writeNumber } from "../system/generatedStores";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Draft = { image: string; associations: string[]; parts: string[][] };

const EMPTY: Draft = { image: "", associations: ["", "", ""], parts: [["", "", ""], ["", "", ""], ["", "", ""]] };

function toDraft(input: NumberClusterInput | null): Draft {
  if (!input) return EMPTY;
  return { image: input.image, associations: [...input.associations], parts: input.parts.map((p) => [...p]) };
}

/**
 * One number of the table of support images: its image, three images that come to mind one from
 * the next, and three parts of each. The nine parts become cells N.1 to N.9.
 */
export function AddNumberDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const setFocusNodeId = usePalaceStore((s) => s.setFocusNodeId);
  const [numberText, setNumberText] = useState("");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [existing, setExisting] = useState(false);
  const [confirming, setConfirming] = useState(0);

  const number = /^\d{1,2}$/.test(numberText.trim()) ? Number(numberText) : null;

  // Typing a number the table already holds loads what it says, so the dialog edits it.
  useEffect(() => {
    if (!open || number === null || !editorRef) {
      setExisting(false);
      return;
    }
    const cluster = readNumberCluster(editorRef, number);
    setExisting(cluster !== null);
    setDraft(toDraft(cluster));
    setConfirming(0);
  }, [open, number, editorRef]);

  useEffect(() => {
    if (!open) return;
    setNumberText("");
    setDraft(EMPTY);
    setConfirming(0);
  }, [open]);

  if (!open) return null;

  const input = (): NumberClusterInput | null =>
    number === null
      ? null
      : {
          number,
          image: draft.image,
          associations: draft.associations as NumberClusterInput["associations"],
          parts: draft.parts as NumberClusterInput["parts"],
        };

  const write = (replaceFilled: boolean) => {
    const cluster = input();
    if (!cluster) return;
    const result = writeNumber(cluster, { replaceFilled });
    if (!result) return;
    if (editorRef) {
      const nodeId = findNodeByAddress(editorRef, formatTableNumber(cluster.number));
      if (nodeId) setFocusNodeId(nodeId);
    }
    onClose();
  };

  const save = () => {
    if (number === null) return;
    const filled = currentClusterFilledCount(number);
    if (filled > 0 && confirming === 0) {
      setConfirming(filled);
      return;
    }
    write(false);
  };

  const setAssociation = (i: number, value: string) =>
    setDraft((d) => ({ ...d, associations: d.associations.map((a, j) => (j === i ? value : a)) }));
  const setPart = (i: number, p: number, value: string) =>
    setDraft((d) => ({ ...d, parts: d.parts.map((row, j) => (j === i ? row.map((v, k) => (k === p ? value : v)) : row)) }));

  const code = number !== null ? formatTableNumber(number) : "NN";

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-label="Add a number"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-5"
      >
        <div className="text-base font-semibold text-zinc-100">{existing ? `Edit number ${code}` : "Add a number"}</div>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          Start from your image for the number. Let a second image come to mind from it, a third from that, and a fourth
          from the third; don&apos;t force a link. Then name three parts of each, left to right and top to bottom. The
          nine parts are cells {code}.1 to {code}.9. Anything left blank keeps a placeholder you can rename later.
        </p>
        <div className="mt-3 grid grid-cols-[6rem_1fr] gap-2">
          <Input
            aria-label="Number"
            placeholder="00–99"
            inputMode="numeric"
            value={numberText}
            onChange={(event) => setNumberText(event.target.value)}
            className="h-8 text-xs"
          />
          <Input
            aria-label="Number image"
            placeholder="Your image for this number, e.g. hedgehog"
            value={draft.image}
            onChange={(event) => setDraft((d) => ({ ...d, image: event.target.value }))}
            className="h-8 text-xs"
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {TABLE_IMAGE_LETTERS.map((letter, i) => (
            <fieldset key={letter} aria-label={`Image ${letter} and its parts`} className="min-w-0 space-y-1.5 rounded border border-zinc-800 p-2">
              <Input
                aria-label={`Image ${letter}`}
                placeholder={i === 0 ? "First image it brings to mind" : "The next one it brings to mind"}
                value={draft.associations[i]}
                onChange={(event) => setAssociation(i, event.target.value)}
                className="h-8 text-xs"
              />
              {[0, 1, 2].map((p) => (
                <Input
                  key={p}
                  aria-label={`Cell ${code}.${i * 3 + p + 1}`}
                  placeholder={`Part ${p + 1} → cell ${code}.${i * 3 + p + 1}`}
                  value={draft.parts[i]![p]}
                  onChange={(event) => setPart(i, p, event.target.value)}
                  className="h-8 text-xs"
                />
              ))}
            </fieldset>
          ))}
        </div>
        {confirming > 0 ? (
          <div role="alertdialog" aria-label="Rewrite number" className="mt-3 space-y-1.5 rounded border border-amber-800/70 p-2">
            <p className="text-xs leading-5 text-amber-200">
              {confirming} {confirming === 1 ? "node" : "nodes"} of {code} {confirming === 1 ? "holds" : "hold"} your
              material. Keep {confirming === 1 ? "it" : "them"} as {confirming === 1 ? "it is" : "they are"}, or replace
              {confirming === 1 ? " it" : " them"} with what you typed here?
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" type="button" onClick={() => write(false)}>
                Keep them
              </Button>
              <Button size="sm" variant="outline" type="button" className="border-red-800 text-red-300" onClick={() => write(true)}>
                Replace {confirming}
              </Button>
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={number === null || confirming > 0} onClick={save}>
            {existing ? `Save ${code}` : `Add ${code}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
