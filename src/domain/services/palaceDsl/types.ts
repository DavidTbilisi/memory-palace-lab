import type { MemoryNodeKind, PalacePortalRef } from "../../entities/types";

export type DslDiagnosticCode =
  | "duplicate-title"
  | "unknown-target"
  | "malformed-cast"
  | "malformed-route-locus"
  | "missing-palace-header"
  | "invalid-portal-target"
  | "tag-syntax";

export interface DslDiagnostic {
  severity: "error" | "warning";
  line: number;
  column: number;
  length: number;
  message: string;
  code: DslDiagnosticCode;
}

export interface DslEdgeIntent {
  targetTitle: string;
  cast: { ab: string; cd: string; ef: string; gh: string };
  sourceLine: number;
}

export interface DslNode {
  title: string;
  content: string;
  kind: MemoryNodeKind;
  portal: PalacePortalRef | null;
  tags: string[];
  edges: DslEdgeIntent[];
  sourceLine: number;
}

export interface DslRoute {
  name: string;
  loci: string[];
  sourceLine: number;
}

export interface DslSnapshot {
  palaceName: string;
  atlasPath: string | null;
  nodes: DslNode[];
  routes: DslRoute[];
}

export interface DslParseResult {
  snapshot: DslSnapshot;
  diagnostics: DslDiagnostic[];
}

export interface DslApplyCounts {
  nodes: number;
  edges: number;
  routes: number;
  loci: number;
}

export interface DslApplyResult {
  added: DslApplyCounts;
  updated: DslApplyCounts;
  deleted: DslApplyCounts;
  errors: DslDiagnostic[];
}
