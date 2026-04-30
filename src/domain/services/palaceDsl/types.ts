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
  | "alias-unresolved"
  // Feature 2 — inline node references
  | "inline-ref-unclosed"
  | "inline-ref-unresolved-id"
  | "inline-ref-unresolved-title"
  | "inline-ref-unresolved-alias"
  | "inline-ref-self"
  // Feature 7 — route metadata
  | "route-prereq-unresolved"
  // Feature 4 — imports
  | "import-malformed"
  | "import-namespace-collision"
  // Feature 8 — query/traversal language
  | "query-verb-unknown"
  | "query-path-missing-arg"
  | "query-unresolved-node"
  | "query-unresolved-route";

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

// Feature 4 — modularization / import system
export interface DslImportDeclaration {
  path: string;
  /** Namespace prefix used to qualify refs from this import. */
  namespace: string;
  sourceLine: number;
}

// Feature 2 — inline node references in body text
export interface DslPlainText {
  kind: "plain";
  text: string;
}

export interface DslInlineRef {
  kind: "ref";
  refType: "id" | "title" | "alias";
  value: string;
  /** implicitId of the resolved node, cast token for alias refs, null if unresolved. */
  resolved: string | null;
}

export type DslBodySegment = DslPlainText | DslInlineRef;

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
  /** Body text parsed into segments with inline references resolved. */
  bodySegments: DslBodySegment[];
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
  /** Route name normalized to lowercase-hyphenated form. */
  normalizedName: string;
  /** Structured tags appearing after the route header but before the first locus. */
  metadata: DslStructuredTag[];
  loci: string[];
  sourceLine: number;
}

// Feature 8 — query/traversal language
export type DslQueryVerb =
  | "tag"
  | "node"
  | "neighbors"
  | "route"
  | "depends"
  | "path"
  | "filter"
  | "all";

export interface DslQueryDeclaration {
  verb: DslQueryVerb;
  /** Raw argument string following the verb. */
  args: string;
  /** For the ?path verb only: the two parsed node references. Null when E802 fires. */
  pathArgs: [string, string] | null;
  /** "palace" when the query appears after the @<name> header; "document" otherwise. */
  scope: "document" | "palace";
  sourceLine: number;
}

export interface DslSnapshot {
  palaceName: string;
  atlasPath: string | null;
  nodes: DslNode[];
  routes: DslRoute[];
  aliases: DslAliasDeclaration[];
  imports: DslImportDeclaration[];
  queries: DslQueryDeclaration[];
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
