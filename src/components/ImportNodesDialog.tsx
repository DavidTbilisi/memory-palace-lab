import { useEffect, useMemo, useState } from "react";
import { Upload, X } from "lucide-react";
import { createImportedMemoryNodes } from "../canvas/createMemoryShapes";
import { parseCsvNodeImport, parseMarkdownNodeImport } from "../domain/services/nodeImport";
import { parseDsl } from "../domain/services/palaceDsl/parser";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const MAX_IMPORT_ROWS = 200;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ImportMode = "markdown" | "csv" | "dsl";

function parseRows(mode: ImportMode, input: string) {
  if (mode === "markdown") return parseMarkdownNodeImport(input);
  if (mode === "csv") return parseCsvNodeImport(input);
  const { snapshot, diagnostics } = parseDsl(input);
  const firstError = diagnostics.find((d) => d.severity === "error");
  return {
    rows: snapshot.nodes.map((n) => ({ title: n.title, content: n.content })),
    error: firstError ? `${firstError.code}: ${firstError.message}` : null,
  };
}

export function ImportNodesDialog({ open, onOpenChange }: Props) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);

  const [mode, setMode] = useState<ImportMode>("markdown");
  const [rawInput, setRawInput] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);

  const parsed = useMemo(() => parseRows(mode, rawInput), [mode, rawInput]);
  const previewRows = useMemo(() => parsed.rows.slice(0, MAX_IMPORT_ROWS), [parsed.rows]);
  const overLimitCount = Math.max(0, parsed.rows.length - MAX_IMPORT_ROWS);

  useEffect(() => {
    if (!open) return;
    setSelectedIndexes(new Set(previewRows.map((_, index) => index)));
  }, [open, previewRows]);

  useEffect(() => {
    if (!open) {
      setRawInput("");
      setSelectedIndexes(new Set());
      setImporting(false);
      setMode("markdown");
    }
  }, [open]);

  const selectedRows = previewRows.filter((_, index) => selectedIndexes.has(index));
  const canImport = !!currentPalace && !!editorRef && selectedRows.length > 0 && !parsed.error;

  const importNodes = async () => {
    if (!canImport || !editorRef || !currentPalace) return;
    setImporting(true);
    try {
      if (mode === "dsl") {
        const { snapshot } = parseDsl(rawInput);
        usePalaceStore.getState().applyDslSnapshot(snapshot);
      } else {
        const normalized = selectedRows.map((row) => ({
          title: row.title.trim() || "Imported node",
          content: row.content,
        }));
        createImportedMemoryNodes(editorRef, currentPalace.id, normalized);
      }
      await saveCurrent();
      onOpenChange(false);
    } finally {
      setImporting(false);
    }
  };

  const onFileSelected = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setMode("csv");
    setRawInput(text);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-700 bg-zinc-950 p-5 shadow-[0_32px_120px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-zinc-100">Import notes</div>
            <div className="mt-1 text-xs text-zinc-500">Paste Markdown bullets or upload CSV with title/content headers.</div>
          </div>
          <Button size="icon" variant="ghost" type="button" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant={mode === "markdown" ? "default" : "secondary"} type="button" onClick={() => setMode("markdown")}>
            Markdown list
          </Button>
          <Button size="sm" variant={mode === "csv" ? "default" : "secondary"} type="button" onClick={() => setMode("csv")}>
            CSV
          </Button>
          <Button size="sm" variant={mode === "dsl" ? "default" : "secondary"} type="button" onClick={() => setMode("dsl")}>
            DSL
          </Button>
          <Label htmlFor="import-csv-file" className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200">
            <Upload className="h-3.5 w-3.5" />
            Upload CSV
          </Label>
          <input
            id="import-csv-file"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              void onFileSelected(file);
              event.currentTarget.value = "";
            }}
          />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div>
            <Label htmlFor="import-input">Source</Label>
            <Textarea
              id="import-input"
              value={rawInput}
              onChange={(event) => setRawInput(event.target.value)}
              className="mt-1 min-h-[280px]"
              placeholder={
                mode === "markdown"
                  ? "Example — type or paste your own bullet list here:\n\n- Hippocampus\n- Mitochondria\n- Krebs cycle"
                  : mode === "csv"
                    ? "Example — type or paste your own CSV here (keep the title,content header):\n\ntitle,content\nHippocampus,Memory formation\nATP,Energy currency"
                    : "Example — type or paste your own palace DSL here:\n\n# Palace: Demo\n\n== Hippocampus\n  > Memory formation\n  -> ATP  ::1010\n\n== ATP\n  > Energy currency"
              }
            />
            {parsed.error ? <div className="mt-2 text-xs text-amber-300">{parsed.error}</div> : null}
            {overLimitCount > 0 ? (
              <div className="mt-2 text-xs text-amber-300">
                Import is limited to {MAX_IMPORT_ROWS} nodes. {overLimitCount} additional rows are excluded.
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Preview ({previewRows.length})</Label>
              {previewRows.length > 0 ? (
                <button
                  type="button"
                  className="text-xs text-zinc-400 underline"
                  onClick={() => {
                    const allSelected = selectedIndexes.size === previewRows.length;
                    if (allSelected) {
                      setSelectedIndexes(new Set());
                    } else {
                      setSelectedIndexes(new Set(previewRows.map((_, index) => index)));
                    }
                  }}
                >
                  {selectedIndexes.size === previewRows.length ? "Clear all" : "Select all"}
                </button>
              ) : null}
            </div>
            <div className="mt-1 max-h-[300px] overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
              {previewRows.length === 0 ? (
                <div className="px-2 py-6 text-sm text-zinc-500">Paste or upload notes to preview imported nodes.</div>
              ) : (
                <div className="space-y-1">
                  {previewRows.map((row, index) => (
                    <label key={`${row.title}-${index}`} className="flex cursor-pointer items-start gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-2">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={selectedIndexes.has(index)}
                        onChange={(event) => {
                          setSelectedIndexes((current) => {
                            const next = new Set(current);
                            if (event.target.checked) {
                              next.add(index);
                            } else {
                              next.delete(index);
                            }
                            return next;
                          });
                        }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-100">{row.title}</div>
                        {row.content.trim() ? <div className="mt-0.5 truncate text-xs text-zinc-500">{row.content}</div> : null}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800 pt-3">
          <div className="text-xs text-zinc-500">
            {currentPalace ? `Import target: ${currentPalace.name}` : "Open a palace to import nodes."}
            {selectedRows.length > 0 ? ` Selected: ${selectedRows.length}` : ""}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={!canImport || importing} onClick={() => void importNodes()}>
              {importing ? "Importing..." : "Import selected"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
