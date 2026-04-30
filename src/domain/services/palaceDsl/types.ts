import type { MemoryNodeKind, PalacePortalRef } from "../../entities/types";

export type DslDiagnosticCode =
  | "duplicate-title"
  | "unknown-target"
  | "malformed-cast"
  | "malformed-route-locus"
  | "missing-palace-header"
  | "invalid-portal-target"
  | "misplaced-line"
  | "tag-syntax"
  // Feature 1 — stable node identifiers
  | "duplicate-node-id"
  | "malformed-node-id"
  | "reserved-node-id"
  // Feature 3 — edge semantic aliases
  | "alias-malformed"
  | "alias-invalid-cast"
  | "alias-duplicate"
  | "alias-cast-conflict"
  | "alias-unresolved";

export interface DslDiagnostic {
  severity: "error" | "warning";
  line: number;
  column: number;
  length: number;
  message: string;
  code: DslDiagnosticCode;
}

// Feature 5 — structured tag (#key:value)
export interface DslStructuredTag {
  key: string;
  value: string | null;
  raw: string;
}

// Feature 3 — edge semantic aliases
export interface DslAliasDeclaration {
  alias: string;
  cast: string;
  description: string | null;
  sourceLine: number;
}

export interface DslEdgeSemantic {
  cast: string | null;
  alias: string | null;
  form: "cast" | "alias" | "hybrid" | "bracketed";
  resolvedCast: string | null;
}

export interface DslEdgeIntent {
  targetTitle: string;
  cast: { ab: string; cd: string; ef: string; gh: string };
  semantic: DslEdgeSemantic;
  sourceLine: number;
}

export interface DslNode {
  title: string;
  /** Explicit stable identifier declared as `[id] Title`. Null if not declared. */
  id: string | null;
  /** Always-set identifier: explicit id if declared, otherwise derived from title. */
  implicitId: string;
  content: string;
  kind: MemoryNodeKind;
  portal: PalacePortalRef | null;
  tags: string[];
  /** Structured #key:value tags parsed from tag lines. */
  structuredTags: DslStructuredTag[];
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
  aliases: DslAliasDeclaration[];
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
