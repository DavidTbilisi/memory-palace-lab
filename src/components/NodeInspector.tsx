import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requestNavigation } from "../app/navigationEvents";
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
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";

const AI_KEY_STORAGE = "mp-ai-anthropic-key";

import DOMPurify from "dompurify";

function stripHtmlToText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Node content can arrive from DSL imports, MCP writes, or pasted HTML, and is
 * rendered via innerHTML — sanitize every value at this funnel. The URI regexp
 * extends DOMPurify's default with obsidian:// (source-note links) and asset:
 * (palace background images).
 */
const CONTENT_URI_REGEXP =
  /^(?:(?:https?|mailto|tel|callto|sms|cid|xmpp|obsidian|asset):|data:image\/|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

export function sanitizeContentHtml(value: string) {
  return DOMPurify.sanitize(value, { ALLOWED_URI_REGEXP: CONTENT_URI_REGEXP });
}

function normalizeEditorHtml(value: string) {
  const trimmed = sanitizeContentHtml(value).trim();
  return trimmed ? trimmed : "<p></p>";
}

/**
 * Open a link from node content outside the webview: external notes
 * (obsidian://), websites, etc. Inside Tauri the webview blocks navigation,
 * so this must go through the opener plugin (scoped in capabilities).
 */
async function openExternalUrl(url: string) {
  const hasTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  if (hasTauri) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

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
  const loci = usePalaceStore((s) => s.loci);
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
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentEditorRef = useRef<HTMLDivElement | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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
      setAiSuggestion(null);
      setAiError(null);
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
      setAiSuggestion(null);
      setAiError(null);
      return;
    }

    const meta = sh.meta as MemoryPalaceMeta;
    if (sh.type === "geo" && meta.mpNodeId) {
      const resolvedTitle = resolveMemoryNodeTitle(sh);
      const resolvedPortal = resolvePortalDraft(meta, snapshotNodes);
      const storedNode = snapshotNodes.find((node) => node.id === meta.mpNodeId);
      setTitle(resolvedTitle);
      setAlias(meta.mpAlias ?? storedNode?.alias ?? "");
      setContent(normalizeEditorHtml(meta.mpContent ?? ""));
      setEdgeLabel("");
      setEdgeAlias("");
      setNodeKind(resolvedPortal.kind);
      setPortalPalaceId(resolvedPortal.portal?.targetPalaceId ?? "");
      setPortalRouteId(resolvedPortal.portal?.targetRouteId ?? "");
      setAiSuggestion(null);
      setAiError(null);
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
      setAiSuggestion(null);
      setAiError(null);
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
    setAiSuggestion(null);
    setAiError(null);
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
  const portalDraft = useMemo<PalacePortalRef | null>(() => {
    if (nodeKind !== "portal") return null;
    return {
      targetPalaceId: portalPalaceId || undefined,
      targetPalaceName: selectedPortalPalace?.name,
      targetAtlasPath: selectedPortalPalace?.atlasPath ?? null,
      targetRouteId: portalRouteId || undefined,
      targetRouteName: selectedPortalRoute?.name,
    };
  }, [nodeKind, portalPalaceId, portalRouteId, selectedPortalPalace?.atlasPath, selectedPortalPalace?.name, selectedPortalRoute?.name]);

  const nextReviewInfo = useMemo(() => {
    if (!selectedShapeId || !editorRef) return null;
    const shape = editorRef.getShape(selectedShapeId as TLShapeId);
    const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
    if (!shape || shape.type !== "geo" || !meta.mpNodeId) return null;
    const nowIso = new Date().toISOString();
    const nodeLoci = loci.filter((locus) => locus.nodeId === meta.mpNodeId).map((locus) => normalizeLocusSchedule(locus, nowIso));
    if (nodeLoci.length === 0) return null;
    const next = nodeLoci
      .map((locus) => locus.nextReviewAt)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .sort()[0];
    if (!next) return null;
    const routeId = nodeLoci.find((locus) => locus.nextReviewAt === next)?.routeId;
    return {
      nextReviewAt: next,
      routeName: routes.find((route) => route.id === routeId)?.name ?? null,
    };
  }, [editorRef, loci, routes, selectedShapeId]);

  const flashSavedIndicator = useCallback(() => {
    setShowSavedIndicator(true);
    if (savedIndicatorTimerRef.current) {
      clearTimeout(savedIndicatorTimerRef.current);
    }
    savedIndicatorTimerRef.current = setTimeout(() => {
      setShowSavedIndicator(false);
      savedIndicatorTimerRef.current = null;
    }, 1200);
  }, []);

  useEffect(() => {
    return () => {
      if (savedIndicatorTimerRef.current) {
        clearTimeout(savedIndicatorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!contentEditorRef.current) return;
    if (contentEditorRef.current.innerHTML === content) return;
    contentEditorRef.current.innerHTML = content;
  }, [content]);

  const applyNodeChanges = useCallback(() => {
    if (!editorRef || !selectedShapeId) return;
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
    flashSavedIndicator();
  }, [alias, content, editorRef, flashSavedIndicator, nodeKind, portalDraft, selectedShapeId, title]);

  const applyEdgeChanges = useCallback(() => {
    if (!editorRef || !selectedShapeId) return;
    const shape = editorRef.getShape(selectedShapeId as TLShapeId);
    if (!shape || shape.type !== "arrow") return;
    editorRef.updateShape({
      id: selectedShapeId as TLShapeId,
      type: "arrow",
      meta: { ...(shape.meta as MemoryPalaceMeta), mpAlias: edgeAlias },
      props: { ...shape.props, richText: toRichText(edgeLabel || " ") },
    });
    flashSavedIndicator();
  }, [edgeAlias, edgeLabel, editorRef, flashSavedIndicator, selectedShapeId]);

  const runFormatCommand = (
    command: "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList" | "insertImage",
    value?: string,
  ) => {
    if (!contentEditorRef.current) return;
    contentEditorRef.current.focus();
    document.execCommand(command, false, value);
    setContent(normalizeEditorHtml(contentEditorRef.current.innerHTML));
  };

  const requestAiEncodingSuggestion = async () => {
    const plainContent = stripHtmlToText(content);
    if (!title.trim() && !plainContent.trim()) return;
    setAiError(null);
    setAiSuggestion(null);
    const apiKey = typeof window !== "undefined" ? window.localStorage.getItem(AI_KEY_STORAGE)?.trim() : null;
    if (!apiKey) {
      setAiError("AI encoding requires an API key. Add it in Settings.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 280,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: `Create one vivid memory-palace encoding for:\nTitle: ${title || "(none)"}\nContent: ${plainContent || "(none)"}\n\nReturn 3-5 concise sentences with concrete imagery, action, emotion, and one absurd anchor.`,
            },
          ],
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Request failed (${response.status})`);
      }
      const parsed = (await response.json()) as { content?: Array<{ text?: string }> };
      const suggestion = parsed.content?.map((entry) => entry.text ?? "").join("\n").trim();
      if (!suggestion) {
        throw new Error("No suggestion returned from AI service.");
      }
      setAiSuggestion(suggestion);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Failed to generate encoding suggestion.");
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    const encoded = `<p><strong>Encoding:</strong> ${aiSuggestion.replace(/\n/g, "<br/>")}</p>`;
    const next = normalizeEditorHtml(`${content}${encoded}`);
    setContent(next);
    if (contentEditorRef.current) {
      contentEditorRef.current.innerHTML = next;
    }
    setAiSuggestion(null);
    applyNodeChanges();
  };

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
      <div className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Node</div>
          {showSavedIndicator ? <div className="text-[11px] text-emerald-300">Saved</div> : null}
        </div>
        <div>
          <Label htmlFor="mp-title">Title</Label>
          <Input
            id="mp-title"
            className="mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={applyNodeChanges}
          />
        </div>
        <div>
          <Label htmlFor="mp-alias">Alias</Label>
          <Input
            id="mp-alias"
            className="mt-1"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onBlur={applyNodeChanges}
          />
        </div>
        <div>
          <Label htmlFor="mp-node-kind">Type</Label>
          <select
            id="mp-node-kind"
            className="mt-1 block h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
            value={nodeKind}
            onChange={(event) => setNodeKind(event.target.value as MemoryNodeKind)}
            onBlur={applyNodeChanges}
          >
            <option value="memory">Memory node</option>
            <option value="portal">Palace portal</option>
          </select>
        </div>
        <div>
          <Label htmlFor="mp-content">Content</Label>
          <div className="mt-1 rounded-md border border-zinc-700 bg-zinc-900/70">
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800 px-2 py-1">
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormatCommand("bold")}>
                Bold
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormatCommand("italic")}>
                Italic
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormatCommand("underline")}>
                Underline
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormatCommand("insertUnorderedList")}>
                Bullets
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormatCommand("insertOrderedList")}>
                Numbered
              </Button>
            </div>
            <div
              id="mp-content"
              ref={contentEditorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[108px] px-2 py-2 text-sm text-zinc-100 focus:outline-none [&_a]:cursor-pointer [&_a]:text-violet-400 [&_a]:underline"
              onInput={(event) => setContent(normalizeEditorHtml((event.currentTarget as HTMLDivElement).innerHTML))}
              onBlur={applyNodeChanges}
              onClick={(event) => {
                // Ctrl/Cmd+click opens links (plain click keeps the caret for editing).
                if (!event.ctrlKey && !event.metaKey) return;
                const anchor = (event.target as HTMLElement).closest?.("a[href]");
                const href = anchor?.getAttribute("href");
                if (!href) return;
                event.preventDefault();
                void openExternalUrl(href);
              }}
              onKeyDown={(event) => {
                if (event.key.toLowerCase() === "b" && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  runFormatCommand("bold");
                  return;
                }
                if (event.key.toLowerCase() === "i" && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  runFormatCommand("italic");
                  return;
                }
                if (event.key === " " && stripHtmlToText(contentEditorRef.current?.innerHTML ?? "").endsWith("-")) {
                  runFormatCommand("insertUnorderedList");
                }
              }}
              onPaste={(event) => {
                const items = Array.from(event.clipboardData?.items ?? []);
                const imageItem = items.find((item) => item.type.startsWith("image/"));
                const file = imageItem?.getAsFile();
                if (!file) return;
                event.preventDefault();
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = typeof reader.result === "string" ? reader.result : null;
                  if (!dataUrl) return;
                  runFormatCommand("insertImage", dataUrl);
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Ctrl+click a link to open it (Obsidian notes, web).</p>
        </div>

        {nextReviewInfo ? (
          <ReadOnlyMetaField
            id="mp-next-review"
            label="Next review"
            value={new Date(nextReviewInfo.nextReviewAt).toLocaleString()}
            subvalue={nextReviewInfo.routeName ? `Route: ${nextReviewInfo.routeName}` : undefined}
          />
        ) : null}

        {title.trim() || stripHtmlToText(content).trim() ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
            <Button type="button" size="sm" variant="secondary" disabled={aiLoading} onClick={() => void requestAiEncodingSuggestion()}>
              {aiLoading ? "Generating encoding..." : "Help me encode this"}
            </Button>
            {aiError ? (
              <div className="mt-2 text-xs text-amber-300">
                {aiError}{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => requestNavigation("settings")}
                >
                  Open Settings
                </button>
              </div>
            ) : null}
            {aiSuggestion ? (
              <div className="mt-2 rounded-md border border-violet-700/50 bg-violet-950/20 p-2 text-xs text-zinc-200">
                <div className="whitespace-pre-wrap">{aiSuggestion}</div>
                <div className="mt-2 flex gap-2">
                  <Button type="button" size="sm" onClick={applyAiSuggestion}>
                    Use this encoding
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setAiSuggestion(null)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

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
                onBlur={applyNodeChanges}
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
                onBlur={applyNodeChanges}
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
      </div>
    );
  }

  if (sh.type === "arrow") {
    const resolvedEdge = resolveEdgeMeta(editorRef, selectedShapeId as TLShapeId, meta, snapshotEdges);
    const source = resolveNodeSummary(editorRef, resolvedEdge.sourceNodeId, snapshotNodes);
    const target = resolveNodeSummary(editorRef, resolvedEdge.targetNodeId, snapshotNodes);

    return (
      <div className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Edge</div>
          {showSavedIndicator ? <div className="text-[11px] text-emerald-300">Saved</div> : null}
        </div>
        <div>
          <Label htmlFor="mp-edge-label">Label</Label>
          <Input
            id="mp-edge-label"
            className="mt-1"
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
            onBlur={applyEdgeChanges}
          />
        </div>
        {!resolvedEdge.hasGraphContext ? (
          <div className="rounded-md border border-amber-700/50 bg-amber-950/30 px-2 py-2 text-xs leading-5 text-amber-200">
            This arrow is missing live memory metadata. Showing whatever can be recovered from bindings and saved graph data.
          </div>
        ) : null}
        <div>
          <Label htmlFor="mp-edge-alias">Alias</Label>
          <Input
            id="mp-edge-alias"
            className="mt-1"
            value={edgeAlias}
            onChange={(e) => setEdgeAlias(e.target.value)}
            onBlur={applyEdgeChanges}
          />
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
      </div>
    );
  }

  return (
    <div className="w-72 shrink-0 border-l border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">
      Not a memory node or edge. Select a node or arrow to inspect it.
    </div>
  );
}
