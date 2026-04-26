import { useEffect, useMemo, useState } from "react";
import { LibraryBig, Search } from "lucide-react";
import {
  THE_SYSTEM_CATEGORIES,
  loadTheSystemDocs,
  type TheSystemCategory,
  type TheSystemDoc,
} from "../content/theSystemLibrary";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  preferredSlug?: string;
};

export function TheSystemLibrary({ preferredSlug }: Props) {
  const [docs, setDocs] = useState<TheSystemDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TheSystemCategory | "All">("All");
  const [selectedSlug, setSelectedSlug] = useState<string>(preferredSlug ?? "");

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
            <div id="the-system-doc-content" className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-200">
                {selectedDoc.body}
              </pre>
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
