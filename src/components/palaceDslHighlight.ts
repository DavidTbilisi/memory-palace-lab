import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

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

function addMark(
  builder: RangeSetBuilder<Decoration>,
  from: number,
  to: number,
  className: string,
) {
  if (to <= from) return;
  builder.add(from, to, Decoration.mark({ class: className }));
}

function addLineDecorations(
  builder: RangeSetBuilder<Decoration>,
  lineStart: number,
  text: string,
) {
  if (!text) return;

  const indentMatch = text.match(/^ */);
  const indent = indentMatch?.[0].length ?? 0;
  const body = text.slice(indent);
  const bodyStart = lineStart + indent;

  if (!body) return;

  if (body.startsWith("--")) {
    addMark(builder, bodyStart, lineStart + text.length, "cm-dsl-comment");
    return;
  }

  if (indent === 0) {
    if (body.startsWith("# Palace:")) {
      addMark(builder, bodyStart, bodyStart + "# Palace:".length, "cm-dsl-keyword");
      addMark(builder, bodyStart + "# Palace:".length, lineStart + text.length, "cm-dsl-title");
      return;
    }

    if (body.startsWith("@atlas")) {
      addMark(builder, bodyStart, bodyStart + "@atlas".length, "cm-dsl-keyword");
      addMark(builder, bodyStart + "@atlas".length, lineStart + text.length, "cm-dsl-path");
      return;
    }

    if (body.startsWith("==")) {
      addMark(builder, bodyStart, bodyStart + 2, "cm-dsl-operator");
      addMark(builder, bodyStart + 2, lineStart + text.length, "cm-dsl-title");
      return;
    }

    const routeMatch = body.match(/^::\s*Route\s+("[^"]*")\s*$/);
    if (routeMatch) {
      const stringOffset = body.indexOf(routeMatch[1]!);
      addMark(builder, bodyStart, bodyStart + stringOffset, "cm-dsl-keyword");
      addMark(
        builder,
        bodyStart + stringOffset,
        bodyStart + stringOffset + routeMatch[1]!.length,
        "cm-dsl-string",
      );
      return;
    }

    return;
  }

  if (body.startsWith(">")) {
    addMark(builder, bodyStart, bodyStart + 1, "cm-dsl-operator");
    addMark(builder, bodyStart + 1, lineStart + text.length, "cm-dsl-content");
    return;
  }

  if (body.startsWith("~portal")) {
    addMark(builder, bodyStart, bodyStart + "~portal".length, "cm-dsl-keyword");
    addMark(builder, bodyStart + "~portal".length, lineStart + text.length, "cm-dsl-path");
    return;
  }

  if (body.startsWith("->")) {
    addMark(builder, bodyStart, bodyStart + 2, "cm-dsl-operator");

    const afterArrow = body.slice(2);
    const castIndex = afterArrow.indexOf("::");
    if (castIndex >= 0) {
      const targetStart = bodyStart + 2;
      const castStart = targetStart + castIndex;
      addMark(builder, targetStart, castStart, "cm-dsl-reference");
      addMark(builder, castStart, castStart + 2, "cm-dsl-operator");
      addMark(builder, castStart + 2, lineStart + text.length, "cm-dsl-cast");
    } else {
      addMark(builder, bodyStart + 2, lineStart + text.length, "cm-dsl-reference");
    }
    return;
  }

  if (body.startsWith("#")) {
    const tokenRegex = /#?[^\s]+/g;
    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(body)) !== null) {
      const token = match[0];
      addMark(
        builder,
        bodyStart + match.index,
        bodyStart + match.index + token.length,
        /^#?[A-Za-z0-9_-]+$/.test(token) ? "cm-dsl-tag" : "cm-dsl-invalid",
      );
    }
    return;
  }

  const locusMatch = body.match(/^(\d+\.)\s+(.+)$/);
  if (locusMatch) {
    addMark(builder, bodyStart, bodyStart + locusMatch[1]!.length, "cm-dsl-number");
    addMark(
      builder,
      bodyStart + locusMatch[1]!.length,
      lineStart + text.length,
      "cm-dsl-reference",
    );
  }
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
