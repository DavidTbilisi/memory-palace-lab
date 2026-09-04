import { useCallback, useEffect, useMemo, useState } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import { createMemoryArrow } from "../canvas/createMemoryShapes";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { plainTextFromRichText } from "../canvas/readShapeText";
import { APP_VERSION } from "../appVersion";
import { AppErrorBanner } from "../components/AppErrorBanner";
import { UpdateBanner } from "../components/UpdateBanner";
import { WebModeBanner } from "../components/WebModeBanner";
import { CastEdgeDialog } from "../components/CastEdgeDialog";
import {
  CommandPalette,
  type PaletteCommand,
} from "../components/CommandPalette";
import { ContextualTipCard } from "../components/ContextualTipCard";
import { GlossaryPanel } from "../components/GlossaryPanel";
import { ImportNodesDialog } from "../components/ImportNodesDialog";
import { PalaceSidebar } from "../components/PalaceSidebar";
import { RepresentMotifDialog } from "../components/RepresentMotifDialog";
import { GraphWorkspace } from "../components/GraphWorkspace";
import {
  PageContentRouter,
  type OpenLibraryTarget,
} from "../components/PageContentRouter";
import type { LibraryTarget } from "../components/LibraryPage";
import { PageNavigationBar } from "../components/PageNavigationBar";
import { ViewModeToggleGroup } from "../components/ViewModeToggleGroup";
import { useAssessHint } from "../components/hooks/useAssessHint";
import { useCommandPalette } from "../components/hooks/useCommandPalette";
import { useDragResizable } from "../components/hooks/useDragResizable";
import { useKeyboardShortcuts } from "../components/hooks/useKeyboardShortcuts";
import { useOnboardingState } from "../components/hooks/useOnboardingState";
import {
  useShellLayout,
  type ViewMode,
} from "../components/hooks/useShellLayout";
import { applyMotifScaffold } from "../canvas/applyMotifScaffold";
import type { MotifScaffold } from "../domain/services/cast/motifTemplates";
import { SessionSummaryModal } from "../components/SessionSummaryModal";
import { OnboardingPanel } from "../components/OnboardingPanel";
import { buildPrimaryContextHint } from "../domain/services/contextualTips";
import { usePalaceStore } from "../store/palaceStore";
import {
  DSL_SPLIT_RATIO_STORAGE_KEY,
  loadSplitRatio,
} from "./memoryPalaceAppHelpers";
import { subscribeNavigation } from "./navigationEvents";
import { startReviewAt } from "./reviewNavigation";
import {
  PAGES,
  pageHint,
  pagePaletteId,
  pagePaletteTitle,
  resolveNavigationTarget,
  type NavigationTarget,
} from "./pages";
import { useExternalMcpSync } from "./useExternalMcpSync";
import { createTutorialPalace } from "../system/examplePalaces";
import { loadWikiIndex } from "../content/wikiLibrary";

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function MemoryPalaceApp() {
  useExternalMcpSync();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState<LibraryTarget | null>(
    null,
  );
  const {
    currentPage,
    setCurrentPage,
    viewMode,
    showSidebar,
    setShowSidebar,
    showInspector,
    setShowInspector,
    applyViewMode: applyShellViewMode,
  } = useShellLayout();

  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const nodes = usePalaceStore((s) => s.nodes);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const toolMode = usePalaceStore((s) => s.toolMode);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const palaces = usePalaceStore((s) => s.palaces);
  const pendingCast = usePalaceStore((s) => s.pendingCast);
  const aarRecords = usePalaceStore((s) => s.aarRecords);
  const setFocusedAARId = usePalaceStore((s) => s.setFocusedAARId);

  const graphAssessHint = useAssessHint((record) => {
    setFocusedAARId(record.id);
    void usePalaceStore.getState().openPalace(record.palaceId);
    setCurrentPage("insights");
  });
  const setPendingCast = usePalaceStore((s) => s.setPendingCast);
  const persistenceState = usePalaceStore((s) => s.persistenceState);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const setDslPaneOpen = usePalaceStore((s) => s.setDslPaneOpen);
  const {
    ratio: dslSplitRatio,
    onSeparatorMouseDown: onDslSeparatorMouseDown,
  } = useDragResizable({
    getInitialRatio: loadSplitRatio,
    storageKey: DSL_SPLIT_RATIO_STORAGE_KEY,
  });

  const [showOnboarding, setShowOnboarding] = useOnboardingState();
  const [representOpen, setRepresentOpen] = useState(false);

  const onRepresentInsert = useCallback((scaffold: MotifScaffold) => {
    const editor = usePalaceStore.getState().editorRef;
    const palace = usePalaceStore.getState().currentPalace;
    if (!editor || !palace) return;
    applyMotifScaffold(editor, palace.id, scaffold);
  }, []);
  const [hoverHint, setHoverHint] = useState<string | null>(null);

  const navigateToPage = useCallback(
    (target: NavigationTarget) => {
      const resolved = resolveNavigationTarget(target);
      setCurrentPage(resolved.page);
      if (resolved.openRoutePanel) {
        const store = usePalaceStore.getState();
        store.setRoutePanelOpen(true);
        store.setToolMode("route");
      }
    },
    [setCurrentPage],
  );

  /** Open the Library, optionally at a section, entry, and anchor. */
  const openLibrary = useCallback(
    (target: OpenLibraryTarget = {}) => {
      setLibraryTarget((previous) => ({
        ...target,
        version: (previous?.version ?? 0) + 1,
      }));
      setCurrentPage("library");
    },
    [setCurrentPage],
  );

  const waitForNodeShape = useCallback(
    async (targetPalaceId: string, nodeId: string) => {
      const started = Date.now();
      while (Date.now() - started < 4500) {
        const state = usePalaceStore.getState();
        if (state.currentPalace?.id === targetPalaceId && state.editorRef) {
          for (const shapeId of state.editorRef.getCurrentPageShapeIds()) {
            const shape = state.editorRef.getShape(shapeId as TLShapeId);
            const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
            if (shape?.type === "geo" && meta.mpNodeId === nodeId) {
              return { editor: state.editorRef, shapeId: shapeId as TLShapeId };
            }
          }
        }
        await sleep(70);
      }
      return null;
    },
    [],
  );

  const focusNodeCommand = useCallback(
    async (targetPalaceId: string, nodeId: string) => {
      if (currentPalace?.id !== targetPalaceId) {
        await openPalace(targetPalaceId);
      }
      setCurrentPage("graph");
      const target = await waitForNodeShape(targetPalaceId, nodeId);
      if (!target) return;
      target.editor.setSelectedShapes([target.shapeId]);
      target.editor.zoomToSelectionIfOffscreen(96, {
        animation: { duration: 260 },
      });
    },
    [currentPalace?.id, openPalace, setCurrentPage, waitForNodeShape],
  );

  const {
    commandOpen,
    setCommandOpen,
    recentCommandIds,
    trackCommandRun,
    trackNodeVisit,
    nodeCommands,
  } = useCommandPalette({
    currentPalace,
    nodes,
    routes,
    loci,
    palaces,
    onFocusNode: focusNodeCommand,
  });

  const sceneStats = useMemo(() => {
    if (!editorRef) {
      return {
        nodeCount: 0,
        edgeCount: 0,
        selectedKind: null as "node" | "portal" | "edge" | null,
      };
    }

    let nodeCount = 0;
    let edgeCount = 0;

    for (const id of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(id as TLShapeId);
      if (!shape) continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (shape.type === "geo" && meta.mpNodeId) nodeCount += 1;
      if (
        shape.type === "arrow" &&
        (meta.mpEdgeId || meta.mpSourceNodeId || meta.mpTargetNodeId)
      )
        edgeCount += 1;
    }

    let selectedKind: "node" | "portal" | "edge" | null = null;
    if (selectedShapeId) {
      const selectedShape = editorRef.getShape(selectedShapeId as TLShapeId);
      const selectedMeta = (selectedShape?.meta ?? {}) as MemoryPalaceMeta;
      if (selectedShape?.type === "arrow") {
        selectedKind = "edge";
      } else if (selectedShape?.type === "geo" && selectedMeta.mpNodeId) {
        selectedKind = selectedMeta.mpNodeKind === "portal" ? "portal" : "node";
      }
    }

    return { nodeCount, edgeCount, selectedKind };
  }, [editorRef, selectedShapeId]);

  const contextualTipContext = useMemo(
    () => ({
      hasPalace: !!currentPalace,
      nodeCount: sceneStats.nodeCount,
      edgeCount: sceneStats.edgeCount,
      routeCount: routes.length,
      locusCount: loci.length,
      walkOpen,
      toolMode,
      selectedKind: sceneStats.selectedKind,
      persistenceState,
    }),
    [
      currentPalace,
      sceneStats.nodeCount,
      sceneStats.edgeCount,
      sceneStats.selectedKind,
      routes.length,
      loci.length,
      walkOpen,
      toolMode,
      persistenceState,
    ],
  );

  const title = useMemo(
    () => currentPalace?.name ?? "Memory Palace Lab",
    [currentPalace?.name],
  );
  const defaultHint = useMemo(
    () =>
      pageHint(currentPage) ?? buildPrimaryContextHint(contextualTipContext),
    [contextualTipContext, currentPage],
  );

  const onCastConfirm = (cast: {
    ab: string;
    cd: string;
    ef: string;
    gh: string;
    label?: string;
  }) => {
    const pending = usePalaceStore.getState().pendingCast;
    const editor = usePalaceStore.getState().editorRef;
    const palace = usePalaceStore.getState().currentPalace;
    if (!pending || !editor || !palace) return;
    createMemoryArrow(
      editor,
      palace.id,
      pending.fromShapeId,
      pending.toShapeId,
      pending.sourceNodeId,
      pending.targetNodeId,
      cast,
    );
    setPendingCast(null);
  };

  const applyViewMode = (mode: ViewMode) => {
    applyShellViewMode(mode);
    if (mode === "focus") setShowOnboarding(false);
  };

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  useEffect(() => {
    void loadPalaces();
  }, [loadPalaces]);

  useEffect(() => {
    const flushDraft = () => {
      void usePalaceStore.getState().flushDraftSave();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushDraft();
      }
    };

    window.addEventListener("beforeunload", flushDraft);
    window.addEventListener("pagehide", flushDraft);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", flushDraft);
      window.removeEventListener("pagehide", flushDraft);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useKeyboardShortcuts({
    k: () => setCommandOpen((open) => !open),
    d: () => setGlossaryOpen((open) => !open),
    e: () => setDslPaneOpen(!usePalaceStore.getState().dslPaneOpen),
  });

  useEffect(
    () =>
      subscribeNavigation((detail) => {
        const resolved = resolveNavigationTarget(detail.target);
        if (
          resolved.page === "library" ||
          detail.librarySlug ||
          detail.section ||
          detail.anchor
        ) {
          openLibrary({
            section: detail.section as OpenLibraryTarget["section"],
            slug: detail.librarySlug,
            anchor: detail.anchor,
          });
          return;
        }
        navigateToPage(detail.target);
      }),
    [navigateToPage, openLibrary],
  );

  useEffect(() => {
    if (!editorRef || !selectedShapeId) return;
    const shape = editorRef.getShape(selectedShapeId as TLShapeId);
    const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
    if (!shape || shape.type !== "geo" || !meta.mpNodeId) return;
    trackNodeVisit(meta.mpNodeId);
  }, [editorRef, selectedShapeId, trackNodeVisit]);

  const basePaletteCommands: PaletteCommand[] = useMemo(
    () => [
      {
        id: "action-glossary",
        group: "Actions",
        title: "Open vocabulary glossary",
        subtitle: "Cmd/Ctrl+D - quick lookup",
        onSelect: () => setGlossaryOpen(true),
      },
      {
        id: "action-glossary-library",
        group: "Actions",
        title: "Open glossary and CAST lexicon in the Library",
        keywords: "glossary cast lexicon who how what when",
        onSelect: () => openLibrary({ section: "glossary", slug: "terms" }),
      },
      {
        id: "action-import-notes",
        group: "Actions",
        title: "Import notes",
        subtitle: "Markdown or CSV",
        onSelect: () => setImportOpen(true),
      },
      {
        id: "dsl.toggle",
        group: "Actions",
        title: "Toggle DSL editor",
        subtitle: "Cmd/Ctrl+E - split-pane palace DSL",
        keywords: "dsl text editor split pane palace",
        onSelect: () => setDslPaneOpen(!usePalaceStore.getState().dslPaneOpen),
      },
      {
        id: "page-routes",
        group: "Pages",
        title: "Open Graph: Routes",
        subtitle: "Route panel beside the canvas",
        keywords: "route editor loci walk order",
        onSelect: () => navigateToPage("routes"),
      },
      ...PAGES.map<PaletteCommand>((page) => ({
        id: pagePaletteId(page.id),
        group: "Pages",
        title: pagePaletteTitle(page),
        subtitle: page.palette.subtitle,
        keywords: page.palette.keywords,
        onSelect: () => navigateToPage(page.id),
      })),
      {
        id: "doc-walk-mode",
        group: "Docs",
        title: "Walk Mode - recall-first review",
        subtitle: "Retrieval protocol guide",
        keywords: "walk recall retrieval protocol",
        onSelect: () =>
          openLibrary({ section: "guides", slug: "retrieval-protocol" }),
      },
      {
        id: "doc-cast-edges",
        group: "Docs",
        title: "CAST edges - connection types",
        subtitle: "WHO / HOW / WHAT / WHEN axes",
        keywords: "cast edges who how what when",
        onSelect: () => openLibrary({ section: "guides", slug: "cast-system" }),
      },
      {
        id: "doc-spaced-review",
        group: "Docs",
        title: "Spaced repetition - scheduling",
        subtitle: "Wiki: spaced repetition",
        keywords: "spaced repetition schedule interval review",
        onSelect: () =>
          openLibrary({ section: "wiki", slug: "spaced-repetition" }),
      },
      {
        id: "doc-encoding",
        group: "Docs",
        title: "Encoding - vivid memory cues",
        subtitle: "Concept encoding guide",
        keywords: "encoding concept vivid cues images",
        onSelect: () =>
          openLibrary({ section: "guides", slug: "concept-encoding" }),
      },
      {
        id: "doc-loci",
        group: "Docs",
        title: "Loci - anchor points in palaces",
        subtitle: "Mind palace guide",
        keywords: "loci locus anchor mind palace",
        onSelect: () => openLibrary({ section: "guides", slug: "mind-palace" }),
      },
      {
        id: "doc-app-manual",
        group: "Docs",
        title: "App manual",
        subtitle: "Palace, node, edge, portal, route, locus, atlas path",
        keywords: "manual help how to app guide",
        onSelect: () => openLibrary({ section: "start", slug: "app-manual" }),
      },
      {
        id: "doc-palace-dsl",
        group: "Docs",
        title: "Palace DSL reference",
        subtitle: "Text format behind the DSL editor",
        keywords: "dsl syntax reference language",
        onSelect: () =>
          openLibrary({ section: "reference", slug: "palace-dsl" }),
      },
    ],
    [navigateToPage, openLibrary, setDslPaneOpen],
  );

  const palacePaletteCommands = useMemo<PaletteCommand[]>(
    () =>
      palaces.map((palace) => ({
        id: `palace:${palace.id}`,
        group: "Palaces",
        title: `Open palace: ${palace.name}`,
        subtitle: palace.atlasPath?.trim() || "No atlas path",
        keywords: `${palace.name} ${palace.alias ?? ""} ${palace.atlasPath ?? ""}`,
        onSelect: () => {
          void openPalace(palace.id);
          navigateToPage("graph");
        },
      })),
    [navigateToPage, openPalace, palaces],
  );

  const routePaletteCommands = useMemo<PaletteCommand[]>(
    () =>
      routes.map((route) => ({
        id: `route:${route.id}`,
        group: "Routes",
        title: `Review route: ${route.name}`,
        subtitle: currentPalace?.name ?? "Current palace",
        keywords: route.name,
        onSelect: () => {
          if (currentPalace) void startReviewAt({ palaceId: currentPalace.id, routeId: route.id });
        },
      })),
    [currentPalace, routes],
  );

  // Wiki pages join the "Docs" group the first time the palette opens; the
  // index is small (titles + summaries) and bodies stay lazy.
  const [wikiPaletteCommands, setWikiPaletteCommands] = useState<
    PaletteCommand[]
  >([]);
  useEffect(() => {
    if (!commandOpen || wikiPaletteCommands.length > 0) return;
    let cancelled = false;
    void loadWikiIndex()
      .then((entries) => {
        if (cancelled) return;
        setWikiPaletteCommands(
          entries.map((entry) => ({
            id: `wiki-${entry.slug}`,
            group: "Docs",
            title: entry.title,
            subtitle: entry.summary || "Wiki page",
            keywords: [entry.slug, entry.palace ?? "", "wiki"].join(" "),
            onSelect: () => openLibrary({ section: "wiki", slug: entry.slug }),
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [commandOpen, openLibrary, wikiPaletteCommands.length]);

  const paletteCommands = useMemo(
    () => [
      ...basePaletteCommands,
      ...palacePaletteCommands,
      ...routePaletteCommands,
      ...nodeCommands,
      ...wikiPaletteCommands,
    ],
    [
      basePaletteCommands,
      nodeCommands,
      palacePaletteCommands,
      routePaletteCommands,
      wikiPaletteCommands,
    ],
  );

  const castOpen = !!pendingCast;

  const castSiblingEdgeLabels = useMemo(() => {
    if (!pendingCast) return [];
    const editor = usePalaceStore.getState().editorRef;
    if (!editor) return [];
    const labels: string[] = [];
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      if (!shape || shape.type !== "arrow") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (meta.mpSourceNodeId !== pendingCast.sourceNodeId) continue;
      if (meta.mpTargetNodeId === pendingCast.targetNodeId) continue;
      const text = plainTextFromRichText(
        (shape.props as { richText?: unknown } | undefined)?.richText,
      );
      if (text) labels.push(text);
    }
    return labels;
  }, [pendingCast]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="grid shrink-0 grid-cols-3 items-center border-b border-zinc-800 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="shrink-0 text-sm font-semibold tracking-tight text-violet-200">
            {title}
          </h1>
          <span
            title={`Memory Palace Lab v${APP_VERSION}`}
            className="shrink-0 rounded border border-zinc-800 bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium leading-none text-zinc-500"
          >
            v{APP_VERSION}
          </span>
          <div id="context-primary-hint" className="hidden w-full max-w-[320px] truncate text-xs text-zinc-400 md:block">
            {hoverHint ?? defaultHint}
          </div>
        </div>

        <PageNavigationBar
          currentPage={currentPage}
          onNavigate={navigateToPage}
          onHoverHintChange={setHoverHint}
        />

        <ViewModeToggleGroup
          viewMode={viewMode}
          modeToggleDisabled={currentPage !== "graph"}
          onOpenSettings={() => navigateToPage("settings")}
          settingsActive={currentPage === "settings"}
          onApplyViewMode={applyViewMode}
          onToggleSidebar={() => setShowSidebar((v) => !v)}
          onToggleInspector={() => setShowInspector((v) => !v)}
          onToggleOnboarding={() => setShowOnboarding((v) => !v)}
          onHoverHintChange={setHoverHint}
        />
      </header>

      <AppErrorBanner />
      <WebModeBanner />
      <UpdateBanner />

      <div className="flex min-h-0 flex-1">
        {showSidebar ? (
          <PalaceSidebar onOpenImport={() => setImportOpen(true)} />
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <GraphWorkspace
            isActive={currentPage === "graph"}
            assessHint={graphAssessHint}
            dslSplitRatio={dslSplitRatio}
            onDslSeparatorMouseDown={onDslSeparatorMouseDown}
            showInspector={showInspector}
            onHoverHintChange={setHoverHint}
            onOpenRepresent={() => setRepresentOpen(true)}
            onCreateTutorialPalace={() => {
              void createTutorialPalace();
            }}
            onOpenHelp={() => openLibrary()}
            onOpenCommandPalette={() => setCommandOpen(true)}
            onOpenImport={() => setImportOpen(true)}
          />

          <PageContentRouter
            currentPage={currentPage}
            libraryTarget={libraryTarget}
            onNavigate={navigateToPage}
            onOpenCommandPalette={() => setCommandOpen(true)}
            onOpenLibrary={openLibrary}
            onOpenPalaceFromAtlas={(palaceId) => {
              const palace = palaces.find((entry) => entry.id === palaceId);
              if (palace) {
                void usePalaceStore.getState().openPalace(palace.id);
                navigateToPage("graph");
              }
            }}
          />
        </main>

        <OnboardingPanel
          open={showOnboarding}
          onClose={() => {
            setShowOnboarding(false);
          }}
        />
      </div>

      <ContextualTipCard
        context={contextualTipContext}
        onOpenLearnRail={() => setShowOnboarding(true)}
        onOpenLibrary={(target) =>
          openLibrary({
            section: target.section as OpenLibraryTarget["section"],
            slug: target.slug,
          })
        }
      />

      <CastEdgeDialog
        open={castOpen}
        onOpenChange={(open) => {
          if (!open) setPendingCast(null);
        }}
        onConfirm={onCastConfirm}
        siblingEdgeLabels={castSiblingEdgeLabels}
      />

      <RepresentMotifDialog
        open={representOpen}
        onOpenChange={setRepresentOpen}
        onInsert={onRepresentInsert}
        aarRecords={aarRecords}
      />

      <ImportNodesDialog open={importOpen} onOpenChange={setImportOpen} />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        commands={paletteCommands}
        recentIds={recentCommandIds}
        onCommandRun={trackCommandRun}
      />

      <GlossaryPanel
        open={glossaryOpen}
        onOpenChange={setGlossaryOpen}
        onOpenLibrary={() =>
          openLibrary({ section: "glossary", slug: "terms" })
        }
      />
      <SessionSummaryModal
        onReviewAnother={() => setCurrentPage("review")}
        onBackToPalace={() => setCurrentPage("graph")}
      />
    </div>
  );
}
