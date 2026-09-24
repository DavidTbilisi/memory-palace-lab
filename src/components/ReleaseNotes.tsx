import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROSE_CLASS } from "./DocReader";

/**
 * A link in the notes must open in the browser: followed inside the webview
 * it would replace the whole app. Anything but http(s) renders as plain text.
 */
const NOTES_COMPONENTS: Components = {
  a: ({ href, children }) => {
    if (!href || !/^https?:\/\//i.test(href)) return <>{children}</>;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => {
          event.preventDefault();
          void import("@tauri-apps/plugin-opener")
            .then((mod) => mod.openUrl(href))
            .catch(() => window.open(href, "_blank"));
        }}
      >
        {children}
      </a>
    );
  },
};

/** An update's release notes (markdown from latest.json), in a panel capped in height. */
export function ReleaseNotes({ notes, id, className = "" }: { notes: string; id?: string; className?: string }) {
  return (
    <div id={id} className={`max-h-64 overflow-y-auto ${PROSE_CLASS} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={NOTES_COMPONENTS}>
        {notes}
      </ReactMarkdown>
    </div>
  );
}
