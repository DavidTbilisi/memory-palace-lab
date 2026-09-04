import { useCallback, useEffect, useMemo, useState } from "react";
import { APP_VERSION } from "../appVersion";
import {
  BookOpen,
  Compass,
  LibraryBig,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  LIBRARY_SECTIONS,
  findLibraryEntry,
  loadLibraryIndex,
  type DocLinkTarget,
  type LibraryEntry,
  type LibrarySection,
} from "../content/library";
import {
  EXAMPLES,
  LESSONS,
  lessonShortLabel,
  type ExampleId,
} from "../content/lessons";
import { SHORTCUTS, formatShortcut } from "../content/shortcuts";
import { GLOSSARY } from "../domain/glossary";
import { requestNavigation } from "../app/navigationEvents";
import { createGeoMemoryNode } from "../canvas/createMemoryShapes";
import { buildPipelineTemplateFromDoc } from "../system/pipelineFromDoc";
import { usePalaceStore } from "../store/palaceStore";
import type { TLShapeId } from "@tldraw/tlschema";
import { loadAllWikiBodies } from "../content/wikiLibrary";
import {
  createTutorialPalace,
  ensureExamplePalace,
} from "../system/examplePalaces";
import { CastLexiconReference } from "./CastLexiconReference";
import { DocReader } from "./DocReader";
import { useLearningProgress } from "./hooks/useLearningProgress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type LibraryTarget = {
  section?: LibrarySection;
  slug?: string;
  anchor?: string;
  /** Bump to re-apply an identical target. */
  version: number;
};

type Props = {
  target: LibraryTarget | null;
  onOpenPalaceWorkspace: () => void;
  onOpenSystem: () => void;
  onOpenCommandPalette: () => void;
};

const DEFAULT_SLUG_BY_SECTION: Record<LibrarySection, string> = {
  start: "lessons",
  guides: "navigator",
  wiki: "",
  glossary: "terms",
  reference: "palace-dsl",
};

function matchesQuery(
  entry: LibraryEntry,
  query: string,
  bodies?: Map<string, string> | null,
) {
  const haystack =
    `${entry.title} ${entry.summary} ${entry.category ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
  if (haystack.includes(query)) return true;
  if (entry.searchText && entry.searchText.includes(query)) return true;
  if (bodies && entry.section === "wiki") {
    const body = bodies.get(entry.slug);
    return body ? body.toLowerCase().includes(query) : false;
  }
  return false;
}

function LessonsView() {
  const { checks } = useLearningProgress();
  const [lessonId, setLessonId] = useState<string>(LESSONS[0].id);
  const selectedLesson =
    LESSONS.find((lesson) => lesson.id === lessonId) ?? LESSONS[0];
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap gap-4">
        <div className="w-64 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <Sparkles className="h-3.5 w-3.5" />
            Progress
          </div>
          <ul className="space-y-2 text-sm">
            {checks.map((check) => (
              <li
                key={check.id}
                className={check.ok ? "text-emerald-300" : "text-zinc-400"}
              >
                {check.ok ? "✓" : "◦"} {check.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 flex-1 basis-72">
          <div className="flex flex-wrap gap-2">
            {LESSONS.map((lesson) => (
              <Button
                key={lesson.id}
                size="sm"
                type="button"
                variant={
                  lesson.id === selectedLesson.id ? "default" : "secondary"
                }
                onClick={() => setLessonId(lesson.id)}
              >
                {lessonShortLabel(lesson)}
              </Button>
            ))}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-zinc-100">
            {selectedLesson.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {selectedLesson.summary}
          </p>
          <ol className="mt-4 space-y-2 text-sm text-zinc-300">
            {selectedLesson.steps.map((step) => (
              <li key={step}>- {step}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ExamplesView({
  onOpenPalaceWorkspace,
}: {
  onOpenPalaceWorkspace: () => void;
}) {
  const [loadingExampleId, setLoadingExampleId] = useState<ExampleId | null>(
    null,
  );
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-sm leading-6 text-zinc-400">
        Open an example to get a palace with nodes, CAST edges, and a route
        already in place. It is easier to mutate a structure than to invent one
        from nothing.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => {
              setLoadingExampleId(example.id);
              void ensureExamplePalace(example.id)
                .then(() => onOpenPalaceWorkspace())
                .finally(() => setLoadingExampleId(null));
            }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-left transition hover:border-violet-500/50 hover:bg-zinc-900"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-base font-medium text-zinc-100">
                {example.title}
              </div>
              {loadingExampleId === example.id ? (
                <span className="text-xs text-violet-300">Loading...</span>
              ) : null}
            </div>
            <div className="mt-2 text-sm leading-6 text-zinc-400">
              {example.details}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function GlossaryTermsView({ query }: { query: string }) {
  const filtered = useMemo(() => {
    if (!query) return GLOSSARY;
    return GLOSSARY.filter(
      (entry) =>
        entry.term.toLowerCase().includes(query) ||
        entry.definition.toLowerCase().includes(query),
    );
  }, [query]);
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="space-y-3">
        {filtered.map((entry) => (
          <div
            key={entry.term}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-950/40 px-4 py-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-violet-200">
                {entry.term}
              </h3>
              {entry.also?.length ? (
                <div className="flex gap-1">
                  {entry.also.map((alias) => (
                    <span
                      key={alias}
                      className="rounded-full bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-6 text-zinc-300">
              {entry.definition}
            </p>
          </div>
        ))}
        {filtered.length === 0 ? (
          <div className="text-sm text-zinc-500">No terms matched.</div>
        ) : null}
      </div>
    </section>
  );
}

function ShortcutsView() {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/40 p-5">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
            <th className="pb-2 pr-3 font-medium">Keys</th>
            <th className="pb-2 pr-3 font-medium">Action</th>
            <th className="pb-2 font-medium">What it does</th>
          </tr>
        </thead>
        <tbody>
          {SHORTCUTS.map((shortcut) => (
            <tr key={shortcut.id} className="border-t border-zinc-800">
              <td className="py-2 pr-3 font-mono text-violet-200">
                {formatShortcut(shortcut)}
              </td>
              <td className="py-2 pr-3 text-zinc-100">{shortcut.label}</td>
              <td className="py-2 text-zinc-400">{shortcut.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * The Library: one home for lessons, the curated guides, the wiki mirror,
 * the glossary, and app reference. Chips browse a section; typing searches
 * every section at once.
 */
export function LibraryPage({
  target,
  onOpenPalaceWorkspace,
  onOpenSystem,
  onOpenCommandPalette,
}: Props) {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const setSystemDraftTemplate = usePalaceStore((s) => s.setSystemDraftTemplate);
  const [index, setIndex] = useState<LibraryEntry[]>([]);
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [section, setSection] = useState<LibrarySection>(
    target?.section ?? "start",
  );
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<string | undefined>(undefined);
  const [anchorVersion, setAnchorVersion] = useState(0);
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [bodyLoadingId, setBodyLoadingId] = useState<string | null>(null);
  const [fullText, setFullText] = useState(false);
  const [wikiBodies, setWikiBodies] = useState<Map<string, string> | null>(
    null,
  );
  const [wikiBodiesLoading, setWikiBodiesLoading] = useState(false);

  // Opt-in full-text search: load every wiki body once, only when asked.
  useEffect(() => {
    if (!fullText || wikiBodies || wikiBodiesLoading) return;
    let cancelled = false;
    setWikiBodiesLoading(true);
    void loadAllWikiBodies()
      .then((loaded) => {
        if (!cancelled) setWikiBodies(loaded);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setWikiBodiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fullText, wikiBodies, wikiBodiesLoading]);

  useEffect(() => {
    let cancelled = false;
    void loadLibraryIndex()
      .then((entries) => {
        if (cancelled) return;
        setIndex(entries);
        setLoadingIndex(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadingIndex(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply an external target (palette, tips, "Read the guide") once the index exists.
  useEffect(() => {
    if (!target || index.length === 0) return;
    const nextSection = target.section ?? section;
    const entry = target.slug
      ? findLibraryEntry(index, target.slug, target.section)
      : null;
    if (entry) {
      setSection(entry.section);
      setSelectedId(entry.id);
    } else {
      setSection(nextSection);
      setSelectedId(null);
    }
    setSearch("");
    setAnchor(target.anchor);
    setAnchorVersion((value) => value + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.version, index]);

  const query = search.trim().toLowerCase();

  const visibleEntries = useMemo(() => {
    if (query)
      return index.filter((entry) =>
        matchesQuery(entry, query, fullText ? wikiBodies : null),
      );
    return index.filter((entry) => entry.section === section);
  }, [fullText, index, query, section, wikiBodies]);

  const selectedEntry = useMemo(() => {
    const byId = selectedId
      ? index.find((entry) => entry.id === selectedId)
      : null;
    if (
      byId &&
      (query ? visibleEntries.includes(byId) : byId.section === section)
    )
      return byId;
    const fallbackSlug = DEFAULT_SLUG_BY_SECTION[section];
    const fallback = fallbackSlug
      ? findLibraryEntry(index, fallbackSlug, section)
      : null;
    if (!query && fallback) return fallback;
    return visibleEntries[0] ?? null;
  }, [index, query, section, selectedId, visibleEntries]);

  useEffect(() => {
    if (
      !selectedEntry ||
      selectedEntry.kind !== "markdown" ||
      !selectedEntry.load
    )
      return;
    if (bodies[selectedEntry.id] !== undefined) return;
    let cancelled = false;
    setBodyLoadingId(selectedEntry.id);
    void selectedEntry
      .load()
      .then((body) => {
        if (cancelled) return;
        setBodies((current) => ({ ...current, [selectedEntry.id]: body }));
      })
      .catch(() => {
        if (cancelled) return;
        setBodies((current) => ({
          ...current,
          [selectedEntry.id]: "_This document could not be loaded._",
        }));
      })
      .finally(() => {
        if (!cancelled)
          setBodyLoadingId((current) =>
            current === selectedEntry.id ? null : current,
          );
      });
    return () => {
      cancelled = true;
    };
  }, [bodies, selectedEntry]);

  const selectEntry = useCallback((entry: LibraryEntry) => {
    setSection(entry.section);
    setSelectedId(entry.id);
    setAnchor(undefined);
  }, []);

  const onNavigateLink = useCallback(
    (link: DocLinkTarget) => {
      const entry = findLibraryEntry(index, link.slug, selectedEntry?.section);
      if (!entry) return;
      setSection(entry.section);
      setSelectedId(entry.id);
      setSearch("");
      setAnchor(link.anchor);
      setAnchorVersion((value) => value + 1);
    },
    [index, selectedEntry?.section],
  );

  const sectionInfo =
    LIBRARY_SECTIONS.find((info) => info.id === section) ?? LIBRARY_SECTIONS[0];

  const renderReader = () => {
    if (!selectedEntry) {
      return (
        <div className="flex flex-1 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-500">
          {loadingIndex
            ? "Loading the Library..."
            : "Select something to read."}
        </div>
      );
    }
    if (selectedEntry.kind === "component") {
      switch (selectedEntry.slug) {
        case "lessons":
          return <LessonsView />;
        case "examples":
          return <ExamplesView onOpenPalaceWorkspace={onOpenPalaceWorkspace} />;
        case "terms":
          return <GlossaryTermsView query={query} />;
        case "cast":
          return (
            <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/40 p-5">
              <CastLexiconReference />
            </section>
          );
        case "shortcuts":
          return <ShortcutsView />;
        default:
          return null;
      }
    }
    const body = bodies[selectedEntry.id] ?? null;
    const encodeDisabledReason = !currentPalace || !editorRef ? "Open a palace first" : body === null ? "Wait for the document to load" : null;
    const encodeActions = {
      disabledReason: encodeDisabledReason,
      onAddAsNode: () => {
        if (!currentPalace || !editorRef) return;
        const viewport = editorRef.getViewportPageBounds();
        const sectionLabel = LIBRARY_SECTIONS.find((info) => info.id === selectedEntry.section)?.label ?? "Library";
        const { shapeId } = createGeoMemoryNode(
          editorRef,
          currentPalace.id,
          { x: viewport.x + viewport.w / 2, y: viewport.y + viewport.h / 2 },
          {
            title: selectedEntry.title,
            content: `<p>${selectedEntry.summary}</p><p>Source: Library › ${sectionLabel} › ${selectedEntry.title}</p>`,
          },
        );
        editorRef.setSelectedShapes([shapeId as TLShapeId]);
        editorRef.zoomToSelectionIfOffscreen(96, { animation: { duration: 240 } });
        requestNavigation("graph");
      },
      onRunAsPipeline: () => {
        if (body === null) return;
        setSystemDraftTemplate(
          buildPipelineTemplateFromDoc({
            slug: selectedEntry.slug,
            title: selectedEntry.title,
            summary: selectedEntry.summary,
            body,
          }),
        );
        requestNavigation("system");
      },
    };
    return (
      <DocReader
        encodeActions={encodeActions}
        title={selectedEntry.title}
        summary={selectedEntry.summary}
        category={
          selectedEntry.category ??
          LIBRARY_SECTIONS.find((info) => info.id === selectedEntry.section)
            ?.label
        }
        sourceLabel={
          selectedEntry.origin === "wiki"
            ? `Neural OS wiki · ${selectedEntry.slug}`
            : selectedEntry.keywords
        }
        body={body}
        loading={bodyLoadingId === selectedEntry.id}
        anchor={anchor}
        anchorVersion={anchorVersion}
        onNavigateLink={onNavigateLink}
      />
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-violet-200">
                <LibraryBig className="h-4 w-4" />
                Library
              </h2>
              <span className="rounded border border-zinc-800 bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium leading-none text-zinc-500">
                Memory Palace Lab v{APP_VERSION}
              </span>
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-400">
              Lessons, guides, the wiki, glossary, and reference in one place.
              Browse a section, or type to search all of them.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                void createTutorialPalace().then(() => onOpenPalaceWorkspace());
              }}
            >
              <Wand2 className="h-4 w-4" />
              Create tutorial palace
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onOpenPalaceWorkspace}
            >
              <Compass className="h-4 w-4" />
              Open palace workspace
            </Button>
            <Button type="button" variant="outline" onClick={onOpenSystem}>
              Open System
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onOpenCommandPalette}
            >
              Open command palette
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Library sections"
            className="flex flex-wrap gap-1"
          >
            {LIBRARY_SECTIONS.map((info) => (
              <Button
                key={info.id}
                type="button"
                size="sm"
                role="tab"
                aria-selected={info.id === section && !query}
                variant={
                  info.id === section && !query ? "default" : "secondary"
                }
                onClick={() => {
                  setSection(info.id);
                  setSearch("");
                  setSelectedId(null);
                  setAnchor(undefined);
                }}
              >
                {info.label}
              </Button>
            ))}
          </div>
          <label
            className="ml-auto flex items-center gap-1.5 text-xs text-zinc-400"
            title="Also search inside wiki page text (loads every page once)"
          >
            <input
              type="checkbox"
              checked={fullText}
              onChange={(event) => setFullText(event.target.checked)}
            />
            Search page text{wikiBodiesLoading ? " (loading...)" : ""}
          </label>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the Library"
              aria-label="Search the Library"
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 p-4">
        <section className="flex w-72 shrink-0 flex-col rounded-md border border-zinc-800 bg-zinc-900/40">
          <div className="border-b border-zinc-800 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <BookOpen className="h-4 w-4 text-violet-300" />
              {query ? "Search results" : sectionInfo.label}
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              {query
                ? `${visibleEntries.length} matches across all sections.`
                : sectionInfo.blurb}
            </p>
          </div>
          <div
            className="flex-1 overflow-y-auto p-2"
            aria-label="Library entries"
          >
            {loadingIndex ? (
              <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-500">
                Loading the Library...
              </div>
            ) : visibleEntries.length > 0 ? (
              <div className="space-y-2">
                {visibleEntries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => selectEntry(entry)}
                    className={`w-full rounded-md border p-2 text-left transition ${
                      entry.id === selectedEntry?.id
                        ? "border-violet-500/60 bg-violet-900/20"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wide text-zinc-500">
                      {query
                        ? LIBRARY_SECTIONS.find(
                            (info) => info.id === entry.section,
                          )?.label
                        : (entry.category ?? "")}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-zinc-100">
                      {entry.title}
                    </div>
                    {entry.summary ? (
                      <div className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-400">
                        {entry.summary}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-500">
                Nothing matched that search.
              </div>
            )}
          </div>
        </section>

        {renderReader()}
      </div>
    </div>
  );
}
