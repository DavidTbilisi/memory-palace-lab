import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

// ---------------------------------------------------------------------------
// Prefix table (matches the parser's deterministic lexer):
//   @atlas   → atlas directive
//   @portal  → portal directive
//   @        → palace header
//   :        → body content
//   #        → tags
//   >        → edge
//   /        → route header
//   \d+ ' '  → route step
//   --       → comment
//   (other)  → node title
// ---------------------------------------------------------------------------

/**
 * Class for each token of a tag line (`body` starts at the `#`), following the parser:
 * `#tag` and `#key:value` are tags, and a `#prereq:` value runs on to the next `#tag`,
 * because it names a node and titles have spaces.
 */
export function tagLineTokens(body: string): { from: number; to: number; cls: string }[] {
  const out: { from: number; to: number; cls: string }[] = [];
  let inPrereq = false;
  for (const m of body.matchAll(/\S+/g)) {
    const token = m[0];
    if (token.startsWith("#")) inPrereq = false;
    const isTag =
      inPrereq || /^#[A-Za-z0-9_-]+$/.test(token) || /^#[A-Za-z][A-Za-z0-9_-]*:\S*$/.test(token);
    if (/^#prereq:/i.test(token)) inPrereq = true;
    out.push({ from: m.index, to: m.index + token.length, cls: isTag ? "cm-dsl-tag" : "cm-dsl-invalid" });
  }
  return out;
}

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      addLineDecorations(builder, line.from, line.text);
      pos = line.to + 1;
    }
  }
  return builder.finish();
}

function mark(
  builder: RangeSetBuilder<Decoration>,
  from: number,
  to: number,
  className: string,
) {
  if (to > from) builder.add(from, to, Decoration.mark({ class: className }));
}

function addLineDecorations(
  builder: RangeSetBuilder<Decoration>,
  lineStart: number,
  text: string,
) {
  const body = text.trim();
  if (!body) return;

  const bodyStart = lineStart + text.indexOf(body[0]!);
  const end = lineStart + text.length;

  if (body.startsWith("--")) {
    mark(builder, bodyStart, end, "cm-dsl-comment");
    return;
  }

  if (body.startsWith("@atlas")) {
    mark(builder, bodyStart, bodyStart + "@atlas".length, "cm-dsl-keyword");
    mark(builder, bodyStart + "@atlas".length, end, "cm-dsl-path");
    return;
  }

  if (body.startsWith("@portal")) {
    mark(builder, bodyStart, bodyStart + "@portal".length, "cm-dsl-keyword");
    mark(builder, bodyStart + "@portal".length, end, "cm-dsl-path");
    return;
  }

  // NEDF slots. The first line is the palace header even when it reads `@N Queens`.
  if (lineStart > 0 && /^@[NEDF](\s|$)/.test(body)) {
    mark(builder, bodyStart, bodyStart + 2, "cm-dsl-keyword");
    const arrow = body.indexOf("=>");
    if (arrow === -1 || !/^@[DF]/.test(body)) {
      mark(builder, bodyStart + 2, end, "cm-dsl-content");
    } else {
      mark(builder, bodyStart + 2, bodyStart + arrow, "cm-dsl-content");
      mark(builder, bodyStart + arrow, bodyStart + arrow + 2, "cm-dsl-operator");
      mark(builder, bodyStart + arrow + 2, end, "cm-dsl-content");
    }
    return;
  }

  if (body.startsWith("@")) {
    mark(builder, bodyStart, bodyStart + 1, "cm-dsl-keyword");
    mark(builder, bodyStart + 1, end, "cm-dsl-title");
    return;
  }

  if (body.startsWith(":")) {
    mark(builder, bodyStart, bodyStart + 1, "cm-dsl-operator");
    mark(builder, bodyStart + 1, end, "cm-dsl-content");
    return;
  }

  if (body.startsWith("#")) {
    for (const token of tagLineTokens(body)) {
      mark(builder, bodyStart + token.from, bodyStart + token.to, token.cls);
    }
    return;
  }

  if (body.startsWith(">")) {
    mark(builder, bodyStart, bodyStart + 1, "cm-dsl-operator");
    const rest = body.slice(1).trim();
    const castMatch = rest.match(/^(.*\S)\s+([0-9]{4})$/);
    if (castMatch) {
      const targetLen = castMatch[1]!.length;
      const afterOp = bodyStart + 1 + (body.length - 1 - rest.length);
      mark(builder, afterOp, afterOp + targetLen, "cm-dsl-reference");
      mark(builder, afterOp + targetLen, end - 4, "cm-dsl-operator");
      mark(builder, end - 4, end, "cm-dsl-cast");
    } else {
      mark(builder, bodyStart + 1, end, "cm-dsl-reference");
    }
    return;
  }

  if (body.startsWith("/")) {
    mark(builder, bodyStart, bodyStart + 1, "cm-dsl-keyword");
    mark(builder, bodyStart + 1, end, "cm-dsl-string");
    return;
  }

  const stepMatch = body.match(/^(\d+)(\s+)(.+)$/);
  if (stepMatch) {
    const numLen = stepMatch[1]!.length;
    mark(builder, bodyStart, bodyStart + numLen, "cm-dsl-number");
    mark(builder, bodyStart + numLen + stepMatch[2]!.length, end, "cm-dsl-reference");
    return;
  }

  mark(builder, bodyStart, end, "cm-dsl-title");
}

export const palaceDslHighlight = [
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = buildDecorations(update.view);
        }
      }
    },
    {
      decorations: (value) => value.decorations,
    },
  ),
  EditorView.theme({
    ".cm-dsl-keyword": { color: "#34d399", fontWeight: "700" },
    ".cm-dsl-title": { color: "#fbbf24", fontWeight: "700" },
    ".cm-dsl-operator": { color: "#a1a1aa", fontWeight: "700" },
    ".cm-dsl-content": { color: "#f4f4f5" },
    ".cm-dsl-comment": { color: "#71717a", fontStyle: "italic" },
    ".cm-dsl-path": { color: "#38bdf8" },
    ".cm-dsl-tag": { color: "#c084fc", fontWeight: "600" },
    ".cm-dsl-reference": { color: "#60a5fa" },
    ".cm-dsl-cast": { color: "#fb7185", fontWeight: "600" },
    ".cm-dsl-string": { color: "#4ade80" },
    ".cm-dsl-number": { color: "#e879f9", fontWeight: "700" },
    ".cm-dsl-invalid": {
      color: "#f87171",
      textDecoration: "underline wavy #f87171",
    },
  }),
];
