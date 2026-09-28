import { useState } from "react";
import { useValue } from "@tldraw/editor";
import { Grid3x3 } from "lucide-react";
import { filledBlockNodes } from "../canvas/fourLevelBlock";
import { findNodeByAddress } from "../canvas/storeNodes";
import { filledTableCells, tableNumbers } from "../canvas/supportTable";
import {
  BLOCK_CELL_COUNT,
  STORE_KIND_LABELS,
  TABLE_CELLS_PER_NUMBER,
  TABLE_NUMBER_COUNT,
  normalizeAddress,
  parseStore,
  type FourLevelBlock,
} from "../domain/services/generatedStore";
import { usePalaceStore } from "../store/palaceStore";
import { generateFourLevelBlock, generateSupportTable, regenerateCurrentBlock } from "../system/generatedStores";
import { AddNumberDialog } from "./AddNumberDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

/** Marks a generated store wherever palaces are listed, so it is not mistaken for a walked palace. */
export function StoreBadge({ storeJson }: { storeJson?: string | null }) {
  const store = parseStore(storeJson);
  if (!store) return null;
  return (
    <span
      data-testid="store-badge"
      title={`${STORE_KIND_LABELS[store.kind]}: found by address, not walked`}
      className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-sky-900/50 px-1 text-[10px] font-medium text-sky-200"
    >
      <Grid3x3 className="h-2.5 w-2.5" />
      Store
    </span>
  );
}

/** Generate a new store in a palace of its own. */
export function GenerateStoreForm() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (make: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await make();
      setTheme("");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };
  const generate = () => {
    if (theme.trim()) void run(() => generateFourLevelBlock(theme));
  };

  if (!open) {
    return (
      <Button size="sm" variant="outline" className="w-full justify-center" type="button" onClick={() => setOpen(true)}>
        <Grid3x3 className="h-4 w-4" />
        Generate store
      </Button>
    );
  }
  return (
    <section aria-label="Generate store" className="space-y-1.5 rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
      <p className="text-[11px] leading-4 text-zinc-400">
        A four-level block: your theme, 5 branches of 5 stickers, and 125 cells addressed 1.1.1 to 5.5.5. Rename the
        placeholders to your own images; the addresses stay.
      </p>
      <Input
        aria-label="Block theme"
        placeholder="Theme, e.g. Chemistry"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") generate();
        }}
        className="h-8 text-xs"
      />
      <Button size="sm" type="button" disabled={!theme.trim() || busy} onClick={generate}>
        Generate four-level block
      </Button>
      <p className="border-t border-zinc-800 pt-1.5 text-[11px] leading-4 text-zinc-400">
        A table of support images: nine cells for each of your 00–99 number images, added one number at a time.
      </p>
      <Button size="sm" variant="secondary" type="button" disabled={busy} onClick={() => void run(generateSupportTable)}>
        Generate table
      </Button>
      <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </section>
  );
}

/** The open store: what it is, how full it is, and what can be done with it. */
export function StorePanel() {
  const storeJson = usePalaceStore((s) => s.currentPalace?.storeJson ?? null);
  const store = parseStore(storeJson);
  if (!store) return null;
  return store.kind === "four-level-block" ? <BlockPanel block={store} /> : <TablePanel />;
}

/** A table grows one number at a time; each number is written in its own dialog. */
function TablePanel() {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const counts = useValue(
    "table counts",
    () => (editorRef ? { numbers: tableNumbers(editorRef).length, cells: filledTableCells(editorRef) } : { numbers: 0, cells: 0 }),
    [editorRef],
  );
  const [adding, setAdding] = useState(false);

  return (
    <section aria-label="Store" className="space-y-1.5 rounded-md border border-sky-900/60 bg-sky-950/20 p-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-100">
        <Grid3x3 className="h-3.5 w-3.5" />
        {STORE_KIND_LABELS["support-table"]}
      </div>
      <p data-testid="store-fill" className="text-[11px] text-zinc-400">
        {counts.numbers} of {TABLE_NUMBER_COUNT} numbers · {counts.cells} of {counts.numbers * TABLE_CELLS_PER_NUMBER} cells filled
      </p>
      <Button size="sm" variant="secondary" type="button" onClick={() => setAdding(true)}>
        Add number
      </Button>
      <p className="text-[10px] leading-4 text-zinc-500">
        Type a number the table already holds to edit it. Cells are found by address, such as 47.3.
      </p>
      <AddNumberDialog open={adding} onClose={() => setAdding(false)} />
    </section>
  );
}

function BlockPanel({ block: store }: { block: FourLevelBlock }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const filled = useValue("store filled nodes", () => (editorRef ? filledBlockNodes(editorRef, store.theme) : []), [
    editorRef,
    store.theme,
  ]);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filledCells = filled.filter((node) => node.role === "cell").length;

  const regenerate = (clearFilled: boolean) => {
    const result = regenerateCurrentBlock({ clearFilled });
    setConfirming(false);
    if (!result) return;
    const parts = [
      result.redrawn > 0 ? `redrew ${result.redrawn}` : null,
      result.cleared > 0 ? `cleared ${result.cleared}` : null,
    ].filter(Boolean);
    setNotice(parts.length > 0 ? `Regenerated: ${parts.join(", ")}.` : "Regenerated. Everything is back in its place.");
  };

  const start = () => {
    setNotice(null);
    if (filled.length > 0) setConfirming(true);
    else regenerate(false);
  };

  return (
    <section aria-label="Store" className="space-y-1.5 rounded-md border border-sky-900/60 bg-sky-950/20 p-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-100">
        <Grid3x3 className="h-3.5 w-3.5" />
        {STORE_KIND_LABELS[store.kind]} · {store.theme}
      </div>
      <p data-testid="store-fill" className="text-[11px] text-zinc-400">
        {filledCells} of {BLOCK_CELL_COUNT} cells filled
      </p>
      {confirming ? (
        <div role="alertdialog" aria-label="Regenerate store" className="space-y-1.5 rounded border border-amber-800/70 p-1.5">
          <p className="text-[11px] leading-4 text-amber-200">
            {filled.length} {filled.length === 1 ? "node holds" : "nodes hold"} your material. Regenerating can keep them
            where they are, or clear them back to placeholders.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" type="button" onClick={() => regenerate(false)}>
              Keep them
            </Button>
            <Button size="sm" variant="outline" type="button" className="border-red-800 text-red-300" onClick={() => regenerate(true)}>
              Clear {filled.length}
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="secondary" type="button" onClick={start}>
          Regenerate
        </Button>
      )}
      {notice ? (
        <p role="status" className="text-[11px] text-emerald-300">
          {notice}
        </p>
      ) : null}
      <p className="text-[10px] leading-4 text-zinc-500">
        Regenerating puts every node back in its place and redraws any that were deleted. Undo reverses it.
      </p>
    </section>
  );
}

/** Jump straight to a cell by its address, without walking a route. Shown only in a store. */
export function GoToAddress() {
  const storeJson = usePalaceStore((s) => s.currentPalace?.storeJson ?? null);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const setFocusNodeId = usePalaceStore((s) => s.setFocusNodeId);
  const [value, setValue] = useState("");
  const [miss, setMiss] = useState<string | null>(null);

  const store = parseStore(storeJson);
  if (!store) return null;
  const example = store.kind === "support-table" ? "47.3" : "2.3.4";

  const go = () => {
    const address = normalizeAddress(value, store.kind);
    const nodeId = address && editorRef ? findNodeByAddress(editorRef, address) : null;
    if (!nodeId) {
      setMiss(address ? `No cell ${address}` : `Addresses look like ${example}`);
      return;
    }
    setMiss(null);
    setFocusNodeId(nodeId);
  };

  return (
    <div className="ml-2 flex items-center gap-1.5">
      <Input
        aria-label="Go to address"
        placeholder={`Go to ${example}`}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setMiss(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") go();
        }}
        className="h-7 w-28 text-xs"
      />
      {miss ? (
        <span role="status" className="text-[11px] text-amber-300">
          {miss}
        </span>
      ) : null}
    </div>
  );
}
