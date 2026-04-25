import { useCallback, useEffect, useState } from "react";
import { toRichText } from "@tldraw/tlschema";
import type { TLShapeId } from "@tldraw/tlschema";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";

function plainTextFromRichText(value: unknown): string {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const text = (node as { text?: unknown }).text;
    if (typeof text === "string") out.push(text);
    const content = (node as { content?: unknown }).content;
    if (Array.isArray(content)) {
      for (const child of content) walk(child);
    }
  };
  walk(value);
  return out.join("").trim();
}

export function NodeInspector() {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const syncFromSelectedShape = useCallback(() => {
    if (!editorRef || !selectedShapeId) {
      setTitle("");
      setContent("");
      return;
    }
    const sh = editorRef.getShape(selectedShapeId as TLShapeId);
    if (!sh || sh.type !== "geo") {
      setTitle("");
      setContent("");
      return;
    }
    const m = sh.meta as MemoryPalaceMeta;
    if (!m.mpNodeId) {
      setTitle("");
      setContent("");
      return;
    }
    const canvasTitle = plainTextFromRichText((sh as { props?: { richText?: unknown } }).props?.richText);
    const resolvedTitle = canvasTitle || m.mpTitle || "";
    if (resolvedTitle !== (m.mpTitle ?? "")) {
      editorRef.updateShape({
        id: selectedShapeId as TLShapeId,
        type: "geo",
        meta: { ...m, mpTitle: resolvedTitle },
      });
    }
    setTitle(resolvedTitle);
    setContent(m.mpContent ?? "");
  }, [editorRef, selectedShapeId]);

  useEffect(() => {
    syncFromSelectedShape();
  }, [syncFromSelectedShape]);

  useEffect(() => {
    if (!editorRef || !selectedShapeId) return;
    const unsubscribe = editorRef.store.listen(
      () => {
        syncFromSelectedShape();
      },
      { source: "user", scope: "document" },
    );
    return unsubscribe;
  }, [editorRef, selectedShapeId, syncFromSelectedShape]);

  if (!editorRef || !selectedShapeId) {
    return (
      <div className="w-64 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
        Select a memory node (rectangle) to edit title and notes.
      </div>
    );
  }

  const sh = editorRef.getShape(selectedShapeId as TLShapeId);
  if (!sh || sh.type !== "geo" || !(sh.meta as MemoryPalaceMeta).mpNodeId) {
    return (
      <div className="w-64 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
        Not a memory node. Double-click empty canvas to create one.
      </div>
    );
  }

  const apply = () => {
    const shape = editorRef.getShape(selectedShapeId as TLShapeId);
    if (!shape || shape.type !== "geo") return;
    const prev = shape.meta as MemoryPalaceMeta;
    editorRef.updateShape({
      id: selectedShapeId as TLShapeId,
      type: "geo",
      meta: { ...prev, mpTitle: title, mpContent: content },
      props: { ...shape.props, richText: toRichText(title || " ") },
    });
  };

  return (
    <div className="flex w-64 shrink-0 flex-col gap-3 border-l border-zinc-800 bg-zinc-950 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Node</div>
      <div>
        <Label htmlFor="mp-title">Title</Label>
        <Input id="mp-title" className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="mp-content">Content</Label>
        <Textarea id="mp-content" className="mt-1" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <Button type="button" size="sm" onClick={apply}>
        Apply
      </Button>
    </div>
  );
}
