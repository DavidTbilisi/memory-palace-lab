import { useCallback, useEffect, useState } from "react";
import { toRichText } from "@tldraw/tlschema";
import type { TLShapeId } from "@tldraw/tlschema";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import type { MemoryEdge, MemoryNode } from "../domain/entities/types";
import { plainTextFromRichText, resolveMemoryNodeTitle } from "../canvas/readShapeText";

function resolveNodeSummary(
  editorRef: ReturnType<typeof usePalaceStore.getState>["editorRef"],
  nodeId: string | undefined,
  snapshotNodes: MemoryNode[],
) {
  if (!nodeId) return { title: "Unknown node", id: "Unknown id" };
  if (editorRef) {
    for (const shapeId of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(shapeId as TLShapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = shape.meta as MemoryPalaceMeta;
      if (meta.mpNodeId !== nodeId) continue;
      return {
        title: resolveMemoryNodeTitle(shape),
        id: nodeId,
      };
    }
  }
  const storedNode = snapshotNodes.find((node) => node.id === nodeId);
  if (storedNode) {
    return {
      title: storedNode.title || "Untitled",
      id: nodeId,
    };
  }
  return { title: nodeId.slice(0, 8), id: nodeId };
}

function resolveArrowBindingNodeIds(
  editorRef: ReturnType<typeof usePalaceStore.getState>["editorRef"],
  shapeId: TLShapeId,
) {
  const resolved = { sourceNodeId: undefined as string | undefined, targetNodeId: undefined as string | undefined };
  if (!editorRef) return resolved;

  const bindings = editorRef.getBindingsFromShape(shapeId, "arrow");
  for (const binding of bindings) {
    const terminal = (binding as { props?: { terminal?: string } }).props?.terminal;
    const targetShape = editorRef.getShape((binding as { toId: TLShapeId }).toId);
    const targetMeta = (targetShape?.meta ?? {}) as MemoryPalaceMeta;
    if (!targetMeta.mpNodeId) continue;
    if (terminal === "start") resolved.sourceNodeId = targetMeta.mpNodeId;
    if (terminal === "end") resolved.targetNodeId = targetMeta.mpNodeId;
  }

  return resolved;
}

function resolveEdgeMeta(
  editorRef: ReturnType<typeof usePalaceStore.getState>["editorRef"],
  shapeId: TLShapeId,
  meta: MemoryPalaceMeta,
  snapshotEdges: MemoryEdge[],
) {
  const bindingNodeIds = resolveArrowBindingNodeIds(editorRef, shapeId);
  const sourceNodeId = meta.mpSourceNodeId ?? bindingNodeIds.sourceNodeId;
  const targetNodeId = meta.mpTargetNodeId ?? bindingNodeIds.targetNodeId;

  const storedEdge =
    snapshotEdges.find((edge) => {
      if (meta.mpEdgeId && edge.id === meta.mpEdgeId) return true;
      if (meta.mpObjectId && edge.objectId === meta.mpObjectId) return true;
      if (sourceNodeId && targetNodeId) {
        return edge.sourceNodeId === sourceNodeId && edge.targetNodeId === targetNodeId;
      }
      return false;
    }) ?? null;

  return {
    edgeId: meta.mpEdgeId ?? storedEdge?.id,
    sourceNodeId: sourceNodeId ?? storedEdge?.sourceNodeId,
    targetNodeId: targetNodeId ?? storedEdge?.targetNodeId,
    castAb: meta.castAb ?? storedEdge?.castAb ?? "",
    castCd: meta.castCd ?? storedEdge?.castCd ?? "",
    castEf: meta.castEf ?? storedEdge?.castEf ?? "",
    castGh: meta.castGh ?? storedEdge?.castGh ?? "",
    hasGraphContext: !!(meta.mpEdgeId || storedEdge || sourceNodeId || targetNodeId),
  };
}

function ReadOnlyMetaField({ id, label, value, subvalue }: { id: string; label: string; value: string; subvalue?: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div id={id} className="mt-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-zinc-100">
        {value}
      </div>
      {subvalue ? <div className="mt-1 break-all text-[11px] text-zinc-500">{subvalue}</div> : null}
    </div>
  );
}

export function NodeInspector() {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const snapshotNodes = usePalaceStore((s) => s.nodes);
  const snapshotEdges = usePalaceStore((s) => s.edges);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");

  const syncFromSelectedShape = useCallback(() => {
    if (!editorRef || !selectedShapeId) {
      setTitle("");
      setContent("");
      setEdgeLabel("");
      return;
    }

    const sh = editorRef.getShape(selectedShapeId as TLShapeId);
    if (!sh) {
      setTitle("");
      setContent("");
      setEdgeLabel("");
      return;
    }

    const meta = sh.meta as MemoryPalaceMeta;
    if (sh.type === "geo" && meta.mpNodeId) {
      const resolvedTitle = resolveMemoryNodeTitle(sh);
      setTitle(resolvedTitle);
      setContent(meta.mpContent ?? "");
      setEdgeLabel("");
      return;
    }

    if (sh.type === "arrow") {
      setTitle("");
      setContent("");
      setEdgeLabel(plainTextFromRichText((sh as { props?: { richText?: unknown } }).props?.richText));
      return;
    }

    setTitle("");
    setContent("");
    setEdgeLabel("");
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
        Select a memory node or edge to inspect its metadata.
      </div>
    );
  }

  const sh = editorRef.getShape(selectedShapeId as TLShapeId);
  if (!sh) {
    return (
      <div className="w-64 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
        Select a memory node or edge to inspect its metadata.
      </div>
    );
  }

  const meta = sh.meta as MemoryPalaceMeta;

  if (sh.type === "geo" && meta.mpNodeId) {
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

  if (sh.type === "arrow") {
    const resolvedEdge = resolveEdgeMeta(editorRef, selectedShapeId as TLShapeId, meta, snapshotEdges);
    const source = resolveNodeSummary(editorRef, resolvedEdge.sourceNodeId, snapshotNodes);
    const target = resolveNodeSummary(editorRef, resolvedEdge.targetNodeId, snapshotNodes);

    const apply = () => {
      const shape = editorRef.getShape(selectedShapeId as TLShapeId);
      if (!shape || shape.type !== "arrow") return;
      editorRef.updateShape({
        id: selectedShapeId as TLShapeId,
        type: "arrow",
        props: { ...shape.props, richText: toRichText(edgeLabel || " ") },
      });
    };

    return (
      <div className="flex w-64 shrink-0 flex-col gap-3 border-l border-zinc-800 bg-zinc-950 p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Edge</div>
        <div>
          <Label htmlFor="mp-edge-label">Label</Label>
          <Input id="mp-edge-label" className="mt-1" value={edgeLabel} onChange={(e) => setEdgeLabel(e.target.value)} />
        </div>
        {!resolvedEdge.hasGraphContext ? (
          <div className="rounded-md border border-amber-700/50 bg-amber-950/30 px-2 py-2 text-xs leading-5 text-amber-200">
            This arrow is missing live memory metadata. Showing whatever can be recovered from bindings and saved graph data.
          </div>
        ) : null}
        <ReadOnlyMetaField id="mp-edge-source" label="From" value={source.title} subvalue={source.id} />
        <ReadOnlyMetaField id="mp-edge-target" label="To" value={target.title} subvalue={target.id} />
        <ReadOnlyMetaField id="mp-edge-c" label="C - Character" value={resolvedEdge.castAb || "None"} />
        <ReadOnlyMetaField id="mp-edge-a" label="A - Action" value={resolvedEdge.castCd || "None"} />
        <ReadOnlyMetaField id="mp-edge-s" label="S - Stream" value={resolvedEdge.castEf || "None"} />
        <ReadOnlyMetaField id="mp-edge-t" label="T - Time" value={resolvedEdge.castGh || "None"} />
        <Button type="button" size="sm" onClick={apply}>
          Apply
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
      Not a memory node or edge. Select a node or arrow to inspect it.
    </div>
  );
}
