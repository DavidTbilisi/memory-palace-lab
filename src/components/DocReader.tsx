import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  findSectionIndexForAnchor,
  normalizeAnchor,
  resolveDocLink,
  type DocLinkTarget,
} from "../content/library";
import { splitMarkdownSections } from "../domain/services/markdownSections";

const SECTION_TAB_LIMIT = 16;

const PROSE_CLASS =
  "text-sm leading-6 text-zinc-200 [&_a]:text-violet-300 [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500/40 [&_blockquote]:pl-3 [&_code]:text-violet-200 [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-zinc-100 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-800 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-zinc-700 [&_th]:bg-zinc-900 [&_th]:px-2 [&_th]:py-1 [&_ul]:my-2 [&_img]:max-w-full";

type Props = {
  title: string;
  summary?: string;
  category?: string;
  sourceLabel?: string;
  /** Markdown body; `null` while loading. */
  body: string | null;
  loading?: boolean;
  /** Section to jump to; bump `anchorVersion` to re-apply the same anchor. */
  anchor?: string;
  anchorVersion?: number;
  /** Called for relative `./slug.md#anchor` links inside the document. */
  onNavigateLink?: (target: DocLinkTarget) => void;
  headerActions?: ReactNode;
  /** "Encode this": turn the document into graph structure. */
  encodeActions?: {
    onAddAsNode: () => void;
    onRunAsPipeline: () => void;
    /** When set, both actions are disabled and this explains why. */
    disabledReason?: string | null;
  };
};

function isTauri() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return headingText(
      (children as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

/**
 * Renders one markdown document a section at a time, with a tab strip for
 * `##` headings (a dropdown when there are many), in-document link
 * navigation, and anchored sub-headings.
 */
export function DocReader({
  title,
  summary,
  category,
  sourceLabel,
  body,
  loading = false,
  anchor,
  anchorVersion = 0,
  onNavigateLink,
  headerActions,
  encodeActions,
}: Props) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [pendingSubAnchor, setPendingSubAnchor] = useState<string | null>(null);
  const sectionTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const sections = useMemo(() => splitMarkdownSections(body ?? ""), [body]);
  const activeSection =
    sections[Math.min(activeSectionIndex, sections.length - 1)] ?? sections[0];

  useEffect(() => {
    setActiveSectionIndex(0);
  }, [title]);

  useEffect(() => {
    if (!anchor || !body) return;
    const index = findSectionIndexForAnchor(sections, anchor);
    if (index >= 0) {
      setActiveSectionIndex(index);
      setPendingSubAnchor(normalizeAnchor(anchor));
    }
  }, [anchor, anchorVersion, body, sections]);

  useEffect(() => {
    if (!pendingSubAnchor) return;
    const frame = window.requestAnimationFrame(() => {
      const target = contentRef.current?.querySelector<HTMLElement>(
        `[id="${pendingSubAnchor}"]`,
      );
      target?.scrollIntoView({ block: "start" });
      setPendingSubAnchor(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeSection, pendingSubAnchor]);

  const moveSectionFocus = (nextIndex: number) => {
    const bounded = Math.max(0, Math.min(nextIndex, sections.length - 1));
    setActiveSectionIndex(bounded);
    window.requestAnimationFrame(() =>
      sectionTabRefs.current[bounded]?.focus(),
    );
  };

  const components = useMemo<Components>(
    () => ({
      a: ({ href, children }) => {
        const target = resolveDocLink(href);
        if (target && onNavigateLink) {
          return (
            <a
              href={href}
              onClick={(event) => {
                event.preventDefault();
                onNavigateLink(target);
              }}
            >
              {children}
            </a>
          );
        }
        if (href && /^https?:\/\//i.test(href)) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                if (!isTauri()) return;
                event.preventDefault();
                void import("@tauri-apps/plugin-opener")
                  .then((mod) => mod.openUrl(href))
                  .catch(() => window.open(href, "_blank"));
              }}
            >
              {children}
            </a>
          );
        }
        return <a href={href}>{children}</a>;
      },
      h3: ({ children }) => (
        <h3 id={normalizeAnchor(headingText(children))}>{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 id={normalizeAnchor(headingText(children))}>{children}</h4>
      ),
    }),
    [onNavigateLink],
  );

  const showTabs = sections.length > 1;
  const useDropdown = sections.length > SECTION_TAB_LIMIT;

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-md border border-zinc-800 bg-zinc-900/40">
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-56">
            {category ? (
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                {category}
              </div>
            ) : null}
            <h2 className="mt-1 text-lg font-semibold text-zinc-100">
              {title}
            </h2>
            {summary ? (
              <p className="mt-1 text-sm leading-6 text-zinc-400">{summary}</p>
            ) : null}
            {sourceLabel ? (
              <div className="mt-2 text-[11px] text-zinc-500">
                {sourceLabel}
              </div>
            ) : null}
          </div>
                    {headerActions || encodeActions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {headerActions}
              {encodeActions ? (
                <div
                  role="group"
                  aria-label="Encode this"
                  title={encodeActions.disabledReason ?? "Turn this document into graph structure"}
                  className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950/60 p-0.5"
                >
                  <span className="px-1.5 text-[11px] font-semibold uppercase tracking-wide text-violet-300">Encode this</span>
                  <button
                    type="button"
                    disabled={!!encodeActions.disabledReason}
                    onClick={encodeActions.onAddAsNode}
                    className="rounded px-2 py-1 text-xs text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add as node
                  </button>
                  <button
                    type="button"
                    disabled={!!encodeActions.disabledReason}
                    onClick={encodeActions.onRunAsPipeline}
                    className="rounded px-2 py-1 text-xs text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Run as pipeline
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showTabs && !useDropdown ? (
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
              moveSectionFocus(sections.length - 1);
            }
          }}
        >
          {sections.map((section, index) => (
            <button
              key={`${section.id}:${index}`}
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

      {showTabs && useDropdown ? (
        <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2 text-xs text-zinc-400">
          <label htmlFor="doc-section-select">Section</label>
          <select
            id="doc-section-select"
            aria-label="Document sections"
            className="h-8 min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-200"
            value={activeSectionIndex}
            onChange={(event) =>
              setActiveSectionIndex(Number(event.target.value))
            }
          >
            {sections.map((section, index) => (
              <option key={`${section.id}:${index}`} value={index}>
                {index + 1}. {section.title}
              </option>
            ))}
          </select>
          <span className="shrink-0">{sections.length} sections</span>
        </div>
      ) : null}

      <div
        id="the-system-doc-content"
        ref={contentRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
      >
        {loading || body === null ? (
          <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-500">
            Loading document...
          </div>
        ) : activeSection ? (
          <section
            id={`doc-section-panel-${activeSection.id}-${activeSectionIndex}`}
            role={showTabs && !useDropdown ? "tabpanel" : undefined}
            aria-labelledby={
              showTabs && !useDropdown
                ? `doc-section-tab-${activeSection.id}-${activeSectionIndex}`
                : undefined
            }
          >
            <h3 className="mb-3 text-base font-semibold text-zinc-100">
              {activeSection.title}
            </h3>
            <div className={PROSE_CLASS}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {activeSection.content}
              </ReactMarkdown>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
