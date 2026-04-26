import { useCallback, useEffect, useMemo, useState } from "react";
import { toRichText } from "@tldraw/tlschema";
import type { TLShapeId } from "@tldraw/tlschema";
import { applyPortalRefToMeta, nodeKindProps, portalDescriptor, portalRefFromMeta } from "../canvas/palacePortal";
import { plainTextFromRichText, resolveMemoryNodeTitle } from "../canvas/readShapeText";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import type { MemoryEdge, MemoryNode, MemoryNodeKind, MemoryRoute, PalacePortalRef } from "../domain/entities/types";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const palaceRepo = getPalaceRepository();

function resolveNodeSummary(
  editorRef: ReturnType<typeof usePalaceStore.getState>["editorRef"],
  nodeId: string | undefined,
  snapshotNodes: MemoryNode[],
) {
  if (!nodeId) return { title: "Unknown node", alias: "", id: "Unknown id" };
  if (editorRef) {
    for (const shapeId of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(shapeId as TLShapeId);
      if (!shape || shape.type !== "geo") continue;
      const meta = shape.meta as MemoryPalaceMeta;
      if (meta.mpNodeId !== nodeId) continue;
      return {
        title: resolveMemoryNodeTitle(shape),
        alias: meta.mpAlias ?? "",
        id: nodeId,
      };
    }
  }
  const storedNode = snapshotNodes.find((node) => node.id === nodeId);
  if (storedNode) {
    return {
      title: storedNode.title || "Untitled",
      alias: storedNode.alias ?? "",
      id: nodeId,
    };
  }
  return { title: nodeId.slice(0, 8), alias: "", id: nodeId };
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
    alias: meta.mpAlias ?? storedEdge?.alias ?? "",
    hasGraphContext: !!(meta.mpEdgeId || storedEdge || sourceNodeId || targetNodeId),
  };
}

function resolvePortalDraft(meta: MemoryPalaceMeta, snapshotNodes: MemoryNode[]) {
  const storedNode = snapshotNodes.find((node) => node.id === meta.mpNodeId);
  return {
    kind: meta.mpNodeKind === "portal" ? "portal" : storedNode?.kind === "portal" ? "portal" : ("memory" as MemoryNodeKind),
    portal: portalRefFromMeta(meta) ?? storedNode?.portal ?? null,
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
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const snapshotNodes = usePalaceStore((s) => s.nodes);
  const snapshotEdges = usePalaceStore((s) => s.edges);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const [title, setTitle] = useState("");
  const [alias, setAlias] = useState("");
  const [content, setContent] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");
  const [edgeAlias, setEdgeAlias] = useState("");
  const [nodeKind, setNodeKind] = useState<MemoryNodeKind>("memory");
  const [portalPalaceId, setPortalPalaceId] = useState("");
  const [portalRouteId, setPortalRouteId] = useState("");
  const [portalRoutes, setPortalRoutes] = useState<MemoryRoute[]>([]);
  const [loadingPortalRoutes, setLoadingPortalRoutes] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    if (palaces.length === 0) {
      void loadPalaces();
    }
  }, [loadPalaces, palaces.length]);

  const syncFromSelectedShape = useCallback(() => {
    if (!editorRef || !selectedShapeId) {
      setTitle("");
      setAlias("");
      setContent("");
      setEdgeLabel("");
      setEdgeAlias("");
      setNodeKind("memory");
      setPortalPalaceId("");
      setPortalRouteId("");
      return;
    }

    const sh = editorRef.getShape(selectedShapeId as TLShapeId);
    if (!sh) {
      setTitle("");
      setAlias("");
      setContent("");
      setEdgeLabel("");
      setEdgeAlias("");
      setNodeKind("memory");
      setPortalPalaceId("");
      setPortalRouteId("");
      return;
    }

    const meta = sh.meta as MemoryPalaceMeta;
    if (sh.type === "geo" && meta.mpNodeId) {
      const resolvedTitle = resolveMemoryNodeTitle(sh);
      const resolvedPortal = resolvePortalDraft(meta, snapshotNodes);
      const storedNode = snapshotNodes.find((node) => node.id === meta.mpNodeId);
      setTitle(resolvedTitle);
      setAlias(meta.mpAlias ?? storedNode?.alias ?? "");
      setContent(meta.mpContent ?? "");
      setEdgeLabel("");
      setEdgeAlias("");
      setNodeKind(resolvedPortal.kind);
      setPortalPalaceId(resolvedPortal.portal?.targetPalaceId ?? "");
      setPortalRouteId(resolvedPortal.portal?.targetRouteId ?? "");
      return;
    }

    if (sh.type === "arrow") {
      const resolvedEdge = resolveEdgeMeta(editorRef, selectedShapeId as TLShapeId, meta, snapshotEdges);
      setTitle("");
      setAlias("");
      setContent("");
      setEdgeLabel(plainTextFromRichText((sh as { props?: { richText?: unknown } }).props?.richText));
      setEdgeAlias(resolvedEdge.alias);
      setNodeKind("memory");
      setPortalPalaceId("");
      setPortalRouteId("");
      return;
    }

    setTitle("");
    setAlias("");
    setContent("");
    setEdgeLabel("");
    setEdgeAlias("");
    setNodeKind("memory");
    setPortalPalaceId("");
    setPortalRouteId("");
  }, [editorRef, selectedShapeId, snapshotEdges, snapshotNodes]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadRoutesForPortal() {
      if (!portalPalaceId) {
        setPortalRoutes([]);
        return;
      }

      setLoadingPortalRoutes(true);
      if (currentPalace?.id === portalPalaceId) {
        if (!cancelled) {
          setPortalRoutes(routes);
          setLoadingPortalRoutes(false);
        }
        return;
      }

      const snapshot = await palaceRepo.loadPalace(portalPalaceId);
      if (cancelled) return;
      setPortalRoutes(snapshot?.routes ?? []);
      setLoadingPortalRoutes(false);
    }

    void loadRoutesForPortal();
    return () => {
      cancelled = true;
    };
  }, [currentPalace?.id, portalPalaceId, routes]);

  useEffect(() => {
    if (!portalRouteId) return;
    if (loadingPortalRoutes) return;
    if (!portalPalaceId) return;
    if (portalRoutes.some((route) => route.id === portalRouteId)) return;
    setPortalRouteId("");
  }, [loadingPortalRoutes, portalPalaceId, portalRouteId, portalRoutes]);

  const portalPalaceOptions = useMemo(() => {
    return palaces
      .slice()
      .sort((a, b) => {
        const pathA = a.atlasPath?.trim() || "";
        const pathB = b.atlasPath?.trim() || "";
        if (pathA !== pathB) return pathA.localeCompare(pathB);
        return a.name.localeCompare(b.name);
      })
      .map((palace) => ({
        ...palace,
        label: palace.atlasPath?.trim() ? `${palace.atlasPath} / ${palace.name}` : palace.name,
      }));
  }, [palaces]);

  const selectedPortalPalace = portalPalaceOptions.find((palace) => palace.id === portalPalaceId) ?? null;
  const selectedPortalRoute = portalRoutes.find((route) => route.id === portalRouteId) ?? null;
  const portalDraft: PalacePortalRef | null =
    nodeKind === "portal"
      ? {
          targetPalaceId: portalPalaceId || undefined,
          targetPalaceName: selectedPortalPalace?.name,
          targetAtlasPath: selectedPortalPalace?.atlasPath ?? null,
          targetRouteId: portalRouteId || undefined,
          targetRouteName: selectedPortalRoute?.name,
        }
      : null;

  if (!editorRef || !selectedShapeId) {
    return (
      <div className="w-72 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
        Select a memory node or edge to inspect its metadata.
      </div>
    );
  }

  const sh = editorRef.getShape(selectedShapeId as TLShapeId);
  if (!sh) {
    return (
      <div className="w-72 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
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
      const nextMeta = applyPortalRefToMeta(
        { ...prev, mpTitle: title, mpAlias: alias, mpContent: content },
        nodeKind,
        portalDraft,
      );
      editorRef.updateShape({
        id: selectedShapeId as TLShapeId,
        type: "geo",
        meta: nextMeta,
        props: { ...shape.props, ...nodeKindProps(nodeKind), richText: toRichText(title || " ") },
      });
    };

    const openLinkedPalace = async () => {
      if (!portalPalaceId) return;
      setOpeningPortal(true);
      try {
        await openPalace(portalPalaceId);
        if (portalRouteId) {
          usePalaceStore.getState().setWalkRoute(portalRouteId);
          usePalaceStore.getState().setWalkOpen(true);
        }
      } finally {
        setOpeningPortal(false);
      }
    };

    return (
      <div className="flex w-72 shrink-0 flex-col gap-3 border-l border-zinc-800 bg-zinc-950 p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Node</div>
        <div>
          <Label htmlFor="mp-title">Title</Label>
          <Input id="mp-title" className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="mp-alias">Alias</Label>
          <Input id="mp-alias" className="mt-1" value={alias} onChange={(e) => setAlias(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="mp-node-kind">Type</Label>
          <select
            id="mp-node-kind"
            className="mt-1 block h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
            value={nodeKind}
            onChange={(event) => setNodeKind(event.target.value as MemoryNodeKind)}
          >
            <option value="memory">Memory node</option>
            <option value="portal">Palace portal</option>
          </select>
        </div>
        <div>
          <Label htmlFor="mp-content">Content</Label>
          <Textarea id="mp-content" className="mt-1" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        {nodeKind === "portal" ? (
          <div className="space-y-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Linked Palace</div>
            <div>
              <Label htmlFor="mp-portal-palace">Target palace</Label>
              <select
                id="mp-portal-palace"
                className="mt-1 block h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={portalPalaceId}
                onChange={(event) => setPortalPalaceId(event.target.value)}
              >
                <option value="">Select palace</option>
                {portalPalaceOptions.map((palace) => (
                  <option key={palace.id} value={palace.id}>
                    {palace.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="mp-portal-route">Target route</Label>
              <select
                id="mp-portal-route"
                className="mt-1 block h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={portalRouteId}
                onChange={(event) => setPortalRouteId(event.target.value)}
                disabled={!portalPalaceId || loadingPortalRoutes}
              >
                <option value="">
                  {loadingPortalRoutes ? "Loading routes..." : portalPalaceId ? "Open palace root" : "Choose palace first"}
                </option>
                {portalRoutes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-2 text-xs leading-5 text-zinc-400">
              {portalDescriptor(portalDraft)}
            </div>
            <Button type="button" size="sm" variant="secondary" disabled={!portalPalaceId || openingPortal} onClick={() => void openLinkedPalace()}>
              {openingPortal ? "Opening..." : "Open linked palace"}
            </Button>
          </div>
        ) : null}

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
        meta: { ...(shape.meta as MemoryPalaceMeta), mpAlias: edgeAlias },
        props: { ...shape.props, richText: toRichText(edgeLabel || " ") },
      });
    };

    return (
      <div className="flex w-72 shrink-0 flex-col gap-3 border-l border-zinc-800 bg-zinc-950 p-3">
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
        <div>
          <Label htmlFor="mp-edge-alias">Alias</Label>
          <Input id="mp-edge-alias" className="mt-1" value={edgeAlias} onChange={(e) => setEdgeAlias(e.target.value)} />
        </div>
        <ReadOnlyMetaField
          id="mp-edge-source"
          label="From"
          value={source.alias ? `${source.title} (${source.alias})` : source.title}
          subvalue={source.id}
        />
        <ReadOnlyMetaField
          id="mp-edge-target"
          label="To"
          value={target.alias ? `${target.title} (${target.alias})` : target.title}
          subvalue={target.id}
        />
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
    <div className="w-72 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
      Not a memory node or edge. Select a node or arrow to inspect it.
    </div>
  );
}
