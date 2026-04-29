import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, insertNewline } from "@codemirror/commands";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildPalaceSnapshot } from "../canvas/buildPalaceSnapshot";
import { serializeDsl } from "../domain/services/palaceDsl/serializer";
import { usePalaceStore } from "../store/palaceStore";
import { palaceDslHighlight } from "./palaceDslHighlight";
import { useDslSync } from "./useDslSync";

interface PalaceDslEditorProps {
  initialValue?: string;
  onViewReady?: (view: EditorView) => void;
}

const CANVAS_TO_DSL_DEBOUNCE_MS = 150;
const KEYSTROKE_QUIESCENCE_MS = 500;

export function PalaceDslEditor({ initialValue, onViewReady }: PalaceDslEditorProps) {
  const applyDslSnapshot = usePalaceStore((s) => s.applyDslSnapshot);
  const { onChange, diagnostics, lastAppliedAt } = useDslSync(applyDslSnapshot);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [focused, setFocused] = useState(false);
  const focusedRef = useRef(false);
  const lastKeystrokeAtRef = useRef(0);
  const isApplyingFromCanvasRef = useRef(false);

  const errorCount = useMemo(
    () => diagnostics.filter((d) => d.severity === "error").length,
    [diagnostics],
  );
  const warningCount = useMemo(
    () => diagnostics.filter((d) => d.severity === "warning").length,
    [diagnostics],
  );
  const firstDiagnostic = diagnostics[0] ?? null;

  // Initial value: if not provided, derive from current canvas state once.
  const computedInitial = useMemo(() => {
    if (initialValue !== undefined) return initialValue;
    const { editorRef, currentPalace, routes, loci } = usePalaceStore.getState();
    if (!editorRef || !currentPalace) return "";
    try {
      return serializeDsl(buildPalaceSnapshot(editorRef, currentPalace, routes, loci));
    } catch {
      return "";
    }
  }, [initialValue]);

  useEffect(() => {
    if (!hostRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((u) => {
      if (u.docChanged && !isApplyingFromCanvasRef.current) {
        lastKeystrokeAtRef.current = Date.now();
        onChange(u.state.doc.toString());
      }
      if (u.focusChanged) {
        focusedRef.current = u.view.hasFocus;
        setFocused(u.view.hasFocus);
      }
    });

    const state = EditorState.create({
      doc: computedInitial,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([
          { key: "Enter", run: insertNewline },
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "13px",
            color: "#f4f4f5",
            backgroundColor: "#09090b",
            caretColor: "#22c55e",
          },
          ".cm-content": { fontFamily: "ui-monospace, SFMono-Regular, monospace" },
          ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, monospace" },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-gutters": {
            backgroundColor: "#09090b",
            color: "#71717a",
            borderRight: "1px solid #27272a",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(34, 197, 94, 0.16)",
            color: "#fafafa",
          },
          ".cm-activeLine": {
            backgroundColor: "rgba(34, 197, 94, 0.14)",
            boxShadow: "inset 3px 0 0 #22c55e",
          },
          ".cm-cursorLayer": {
            pointerEvents: "none",
          },
          ".cm-cursorLayer .cm-cursor, .cm-dropCursor": {
            borderLeftColor: "#22c55e",
            borderLeftWidth: "2px",
            borderLeftStyle: "solid",
          },
          "&.cm-focused .cm-cursorLayer .cm-cursor": {
            borderLeftColor: "#22c55e",
          },
          "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
            backgroundColor: "rgba(34, 197, 94, 0.22)",
          },
        }),
        palaceDslHighlight,
        updateListener,
      ],
    });
    viewRef.current = new EditorView({ state, parent: hostRef.current });
    onViewReady?.(viewRef.current);

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [computedInitial, onChange, onViewReady]);

  // Canvas → DSL sync: subscribe to store changes and re-serialize.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const flush = () => {
      const view = viewRef.current;
      if (!view) return;
      if (focusedRef.current) return;
      if (Date.now() - lastKeystrokeAtRef.current < KEYSTROKE_QUIESCENCE_MS) return;

      const { editorRef, currentPalace, routes, loci } = usePalaceStore.getState();
      if (!editorRef || !currentPalace) return;
      let next: string;
      try {
        next = serializeDsl(buildPalaceSnapshot(editorRef, currentPalace, routes, loci));
      } catch {
        return;
      }
      const current = view.state.doc.toString();
      if (current === next) return;

      isApplyingFromCanvasRef.current = true;
      view.dispatch({ changes: { from: 0, to: current.length, insert: next } });
      isApplyingFromCanvasRef.current = false;
    };

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, CANVAS_TO_DSL_DEBOUNCE_MS);
    };

    const unsubscribe = usePalaceStore.subscribe(schedule);
    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const lastAppliedLabel = lastAppliedAt
    ? new Date(lastAppliedAt).toLocaleTimeString([], { hour12: false })
    : "—";

  return (
    <div
      data-testid="palace-dsl-editor"
      data-focused={focused ? "true" : "false"}
      className="flex h-full flex-col bg-zinc-950 text-zinc-100"
    >
      <div ref={hostRef} className="min-h-0 flex-1 overflow-auto" />
      <div
        data-testid="palace-dsl-status"
        className="flex min-h-6 items-center gap-3 border-t border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-400"
      >
        <span>{errorCount} errors</span>
        <span>{warningCount} warnings</span>
        {firstDiagnostic ? (
          <span className="truncate">
            {`line ${firstDiagnostic.line}: ${firstDiagnostic.message}`}
          </span>
        ) : null}
        <span className="ml-auto">last applied {lastAppliedLabel}</span>
      </div>
    </div>
  );
}
