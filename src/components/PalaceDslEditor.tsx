import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePalaceStore } from "../store/palaceStore";
import { useDslSync } from "./useDslSync";

interface PalaceDslEditorProps {
  initialValue?: string;
  onViewReady?: (view: EditorView) => void;
}

export function PalaceDslEditor({ initialValue = "", onViewReady }: PalaceDslEditorProps) {
  const applyDslSnapshot = usePalaceStore((s) => s.applyDslSnapshot);
  const { onChange, diagnostics, lastAppliedAt } = useDslSync(applyDslSnapshot);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [focused, setFocused] = useState(false);

  const errorCount = useMemo(
    () => diagnostics.filter((d) => d.severity === "error").length,
    [diagnostics],
  );
  const warningCount = useMemo(
    () => diagnostics.filter((d) => d.severity === "warning").length,
    [diagnostics],
  );

  useEffect(() => {
    if (!hostRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((u) => {
      if (u.docChanged) onChange(u.state.doc.toString());
      if (u.focusChanged) setFocused(u.view.hasFocus);
    });

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.theme({
          "&": { height: "100%", fontSize: "13px" },
          ".cm-content": { fontFamily: "ui-monospace, SFMono-Regular, monospace" },
        }),
        updateListener,
      ],
    });
    viewRef.current = new EditorView({ state, parent: hostRef.current });
    onViewReady?.(viewRef.current);

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [initialValue, onChange, onViewReady]);

  const lastAppliedLabel = lastAppliedAt
    ? new Date(lastAppliedAt).toLocaleTimeString([], { hour12: false })
    : "—";

  return (
    <div
      data-testid="palace-dsl-editor"
      data-focused={focused ? "true" : "false"}
      className="flex h-full flex-col bg-background"
    >
      <div ref={hostRef} className="min-h-0 flex-1 overflow-auto" />
      <div
        data-testid="palace-dsl-status"
        className="flex h-6 items-center gap-3 border-t border-border px-2 text-xs text-muted-foreground"
      >
        <span>{errorCount} errors</span>
        <span>{warningCount} warnings</span>
        <span className="ml-auto">last applied {lastAppliedLabel}</span>
      </div>
    </div>
  );
}
