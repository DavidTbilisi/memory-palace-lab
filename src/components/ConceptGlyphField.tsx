import { useEffect, useState } from "react";
import { useValue } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { writeNodeGlyph } from "../canvas/nodeGlyph";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * The node's concept glyph: one symbol that stands for this concept and no other in the palace.
 * Renaming the node or rewriting its content never touches it; changing it is deliberate, because
 * a new mark reads as a new concept.
 */
export function ConceptGlyphField({ nodeId }: { nodeId: string }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const glyph = useValue(
    "concept glyph",
    () => {
      const shape = selectedShapeId ? editorRef?.getShape(selectedShapeId as TLShapeId) : undefined;
      return ((shape?.meta as MemoryPalaceMeta | undefined)?.mpGlyph as string | null | undefined) ?? null;
    },
    [editorRef, selectedShapeId],
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const notice = usePalaceStore((s) => (s.glyphNotice?.nodeId === nodeId ? s.glyphNotice.message : null));
  const setGlyphNotice = usePalaceStore((s) => s.setGlyphNotice);

  useEffect(() => {
    setEditing(false);
    setDraft("");
    setError(null);
  }, [nodeId]);

  const save = () => {
    if (!editorRef) return;
    if (!draft.trim()) {
      setEditing(false);
      setError(null);
      return;
    }
    const result = writeNodeGlyph(editorRef, nodeId, draft);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDraft("");
    setError(null);
    setEditing(false);
    if (notice) setGlyphNotice(null);
  };

  const remove = () => {
    if (!editorRef) return;
    writeNodeGlyph(editorRef, nodeId, null);
    setEditing(false);
    setDraft("");
    setError(null);
  };

  const input = (
    <Input
      id="mp-concept-glyph"
      aria-label="Concept glyph"
      placeholder="🔦"
      value={draft}
      autoFocus={editing}
      onChange={(event) => {
        setDraft(event.target.value);
        setError(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") save();
        if (event.key === "Escape") {
          setEditing(false);
          setDraft("");
          setError(null);
        }
      }}
      className="h-9 w-16 text-center text-lg"
    />
  );

  return (
    <div>
      <Label htmlFor="mp-concept-glyph">Concept glyph</Label>
      {glyph && !editing ? (
        <div className="mt-1 flex items-center gap-2">
          <span data-testid="concept-glyph" className="flex h-9 w-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-xl">
            {glyph}
          </span>
          <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(true)}>
            Change glyph
          </Button>
        </div>
      ) : (
        <div className="mt-1 flex items-center gap-2">
          {input}
          <Button type="button" size="sm" variant="secondary" disabled={!draft.trim()} onClick={save}>
            {glyph ? "Change" : "Set"}
          </Button>
          {glyph ? (
            <>
              <Button type="button" size="sm" variant="ghost" onClick={remove}>
                Remove
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : null}
        </div>
      )}
      {editing && glyph ? (
        <p className="mt-1 text-[11px] leading-4 text-zinc-500">
          A new mark reads as a new concept. Change it early, while {glyph} has little history, or not at all.
        </p>
      ) : !glyph ? (
        <p className="mt-1 text-[11px] leading-4 text-zinc-500">
          One symbol that stands for this concept and nothing else in the palace. It stays when you rename the node.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1 text-[11px] leading-4 text-amber-300">
          {error}
        </p>
      ) : notice && !glyph ? (
        <p role="status" data-testid="glyph-notice" className="mt-1 text-[11px] leading-4 text-amber-300">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
