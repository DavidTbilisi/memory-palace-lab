import { useCallback, useEffect, useRef, useState } from "react";
import { parseDsl } from "../domain/services/palaceDsl/parser";
import type { DslApplyResult, DslDiagnostic, DslSnapshot } from "../domain/services/palaceDsl/types";

const DEBOUNCE_MS = 200;

export interface UseDslSyncResult {
  onChange: (text: string) => void;
  diagnostics: DslDiagnostic[];
  lastAppliedAt: number | null;
}

export function useDslSync(
  applyDslSnapshot: (intent: DslSnapshot) => DslApplyResult,
): UseDslSyncResult {
  const [diagnostics, setDiagnostics] = useState<DslDiagnostic[]>([]);
  const [lastAppliedAt, setLastAppliedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onChange = useCallback(
    (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const { snapshot, diagnostics: diags } = parseDsl(text);
        setDiagnostics(diags);
        if (diags.some((d) => d.severity === "error")) return;
        applyDslSnapshot(snapshot);
        setLastAppliedAt(Date.now());
      }, DEBOUNCE_MS);
    },
    [applyDslSnapshot],
  );

  return { onChange, diagnostics, lastAppliedAt };
}
