import { useEffect, useMemo, useRef, useState } from "react";
import { LibraryBig, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  THE_SYSTEM_CATEGORIES,
  loadTheSystemDocs,
  type TheSystemCategory,
  type TheSystemDoc,
} from "../content/theSystemLibrary";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { splitMarkdownSections } from "../domain/services/markdownSections";

type Props = {
  preferredSlug?: string;
};

export function TheSystemLibrary({ preferredSlug }: Props) {
  const [docs, setDocs] = useState<TheSystemDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TheSystemCategory | "All">("All");
  const [selectedSlug, setSelectedSlug] = useState<string>(preferredSlug ?? "");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const sectionTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void loadTheSystemDocs()
      .then((loadedDocs) => {
        if (cancelled) return;
        setDocs(loadedDocs);
        setLoading(false);
        setSelectedSlug((current) => current || preferredSlug || loadedDocs[0]?.slug || "");
      })
      .catch(() => {
        if (cancelled) return;
        setDocs([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [preferredSlug]);

  const filteredDocs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return docs.filter((doc) => {
      if (category !== "All" && doc.category !== category) return false;
      if (!query) return true;
      const haystack = `${doc.title} ${doc.summary} ${doc.filename} ${doc.body}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [category, docs, search]);

  useEffect(() => {
    if (filteredDocs.length === 0) return;
    if (!filteredDocs.some((doc) => doc.slug === selectedSlug)) {
      setSelectedSlug(filteredDocs[0].slug);
    }
  }, [filteredDocs, selectedSlug]);

  useEffect(() => {
    if (!preferredSlug) return;
    setSelectedSlug(preferredSlug);
  }, [preferredSlug]);

  const selectedDoc =
    filteredDocs.find((doc) => doc.slug === selectedSlug) ??
    docs.find((doc) => doc.slug === selectedSlug) ??
    filteredDocs[0] ??
    null;
  const docSections = useMemo(() => splitMarkdownSections(selectedDoc?.body ?? ""), [selectedDoc?.body]);
  const activeSection = docSections[Math.min(activeSectionIndex, docSections.length - 1)] ?? docSections[0];

  useEffect(() => {
    setActiveSectionIndex(0);
  }, [selectedDoc?.slug]);

  const moveSectionFocus = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, docSections.length - 1));
    setActiveSectionIndex(boundedIndex);
    window.requestAnimationFrame(() => sectionTabRefs.current[boundedIndex]?.focus());
  };

  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <section className="flex w-60 shrink-0 flex-col rounded-md border border-zinc-800 bg-zinc-900/40">
        <div className="border-b border-zinc-800 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
            <LibraryBig className="h-4 w-4" />
            theSystem
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            Integrated mnemonic reference pack. Search the docs, then read them inside MemoryPalace.
          </p>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search theSystem"
              aria-label="Search theSystem"
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-zinc-800 p-2">
          {THE_SYSTEM_CATEGORIES.map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={option === category ? "default" : "secondary"}
              className="h-7 px-2 text-[11px]"
              onClick={() => setCategory(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-500">
              Loading theSystem documents...
            </div>
          ) : filteredDocs.length > 0 ? (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.slug}
                  type="button"
                  onClick={() => setSelectedSlug(doc.slug)}
                  className={`w-full rounded-md border p-2 text-left transition ${
                    doc.slug === selectedSlug
                      ? "border-violet-500/60 bg-violet-900/20"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide text-zinc-500">{doc.category}</div>
                  <div className="mt-1 text-sm font-medium text-zinc-100">{doc.title}</div>
                  <div className="mt-1 line-clamp-3 text-xs leading-5 text-zinc-400">{doc.summary}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-500">
              No documents matched that search.
            </div>
          )}
        </div>
      </section>

      <section className="flex min-w-0 flex-1 flex-col rounded-md border border-zinc-800 bg-zinc-900/40">
        {selectedDoc ? (
          <>
            <div className="border-b border-zinc-800 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">{selectedDoc.category}</div>
              <h2 className="mt-1 text-lg font-semibold text-zinc-100">{selectedDoc.title}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{selectedDoc.summary}</p>
              <div className="mt-2 text-[11px] text-zinc-500">{selectedDoc.filename}</div>
            </div>
            {docSections.length > 1 ? (
              <div
                aria-label="Document sections"
                role="tablist"
                className="flex gap-1 overflow-x-auto border-b border-zinc-800 px-3 py-2"
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    moveSectionFocus(activeSectionIndex + 1);
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    moveSectionFocus(activeSectionIndex - 1);
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    moveSectionFocus(0);
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    moveSectionFocus(docSections.length - 1);
                  }
                }}
              >
                {docSections.map((section, index) => (
                  <button
                    key={`${selectedDoc.slug}:${section.id}:${index}`}
                    ref={(element) => {
                      sectionTabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`doc-section-tab-${section.id}-${index}`}
                    aria-selected={index === activeSectionIndex}
                    aria-controls={`doc-section-panel-${section.id}-${index}`}
                    tabIndex={index === activeSectionIndex ? 0 : -1}
                    className={`shrink-0 rounded-md border px-3 py-1.5 text-xs transition ${
                      index === activeSectionIndex
                        ? "border-violet-500/60 bg-violet-900/30 text-violet-100"
                        : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    onClick={() => setActiveSectionIndex(index)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            ) : null}
            <div id="the-system-doc-content" className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {activeSection ? (
                <section
                  id={`doc-section-panel-${activeSection.id}-${activeSectionIndex}`}
                  role={docSections.length > 1 ? "tabpanel" : undefined}
                  aria-labelledby={
                    docSections.length > 1 ? `doc-section-tab-${activeSection.id}-${activeSectionIndex}` : undefined
                  }
                >
                  <h3 className="mb-3 text-base font-semibold text-zinc-100">{activeSection.title}</h3>
                  <div className="text-sm leading-6 text-zinc-200 [&_a]:text-violet-300 [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500/40 [&_blockquote]:pl-3 [&_code]:text-violet-200 [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-zinc-100 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-800 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-zinc-700 [&_th]:bg-zinc-900 [&_th]:px-2 [&_th]:py-1 [&_ul]:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeSection.content}</ReactMarkdown>
                  </div>
                </section>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4 text-sm text-zinc-500">
            Select a document from theSystem to read it here.
          </div>
        )}
      </section>
    </div>
  );
}
