/**
 * Canonical AST type definitions for Memory Palace DSL v2.0.
 *
 * Design principles:
 * - Serializable to JSON without loss of information
 * - Implementation-neutral (usable from TypeScript, Rust, Python, etc.)
 * - All source positions are 1-indexed, byte-accurate
 * - The `type` discriminant on every node enables exhaustive pattern matching
 */

// ---------------------------------------------------------------------------
// Source positions
// ---------------------------------------------------------------------------

export interface SourcePosition {
  /** File path, or empty string when parsed from an in-memory string. */
  file: string;
  /** 1-indexed line number. */
  line: number;
  /** 1-indexed byte offset within the line. */
  column: number;
  /** Byte span of the construct. */
  length: number;
}

// ---------------------------------------------------------------------------
// Document root
// ---------------------------------------------------------------------------

export interface Document {
  type: "Document";
  /** Schema version. */
  version: "2.0";
  source: SourceInfo;
  imports: AstImportDeclaration[];
  aliases: AstAliasDeclaration[];
  palace: AstPalaceDeclaration | null;
  nodes: AstNodeDeclaration[];
  routes: AstRouteDeclaration[];
  queries: AstQueryDeclaration[];
  diagnostics: AstDiagnostic[];
  metadata: DocumentMetadata;
}

export interface SourceInfo {
  /** Resolved file path, or empty string for in-memory sources. */
  file: string;
  encoding: "utf-8";
  lineCount: number;
  /** SHA-256 of the raw source text, hex-encoded. Empty string when source not provided. */
  checksum: string;
}

export interface DocumentMetadata {
  /** ISO-8601 timestamp of the last normalization pass, or null. */
  normalizedAt: string | null;
  /** SHA-256 of the canonical AST form, or null before normalization. */
  canonicalHash: string | null;
}

// ---------------------------------------------------------------------------
// Palace declaration
// ---------------------------------------------------------------------------

export interface AstPalaceDeclaration {
  type: "PalaceDeclaration";
  title: string;
  atlasPath: string | null;
  source: SourcePosition;
}

// ---------------------------------------------------------------------------
// Nodes
// ---------------------------------------------------------------------------

export interface AstPlainText {
  kind: "plain";
  text: string;
}

export interface AstInlineRef {
  kind: "ref";
  refType: "id" | "title" | "alias";
  value: string;
  resolved: string | null;
}

export type AstBodySegment = AstPlainText | AstInlineRef;

export interface AstBodyLine {
  type: "BodyLine";
  raw: string;
  segments: AstBodySegment[];
}

export interface AstStructuredTag {
  key: string;
  value: string | null;
  raw: string;
}

export interface AstEdgeDeclaration {
  type: "EdgeDeclaration";
  targetTitle: string;
  cast: { ab: string; cd: string; ef: string; gh: string };
  semantic: {
    cast: string | null;
    alias: string | null;
    form: "cast" | "alias" | "hybrid" | "bracketed";
    resolvedCast: string | null;
  };
  source: SourcePosition;
}

export interface AstNodeDeclaration {
  type: "NodeDeclaration";
  id: string | null;
  implicitId: string;
  title: string;
  /** Title lowercased and whitespace-collapsed. */
  normalizedTitle: string;
  body: AstBodyLine[];
  tags: string[];
  structuredTags: AstStructuredTag[];
  edges: AstEdgeDeclaration[];
  portal: {
    targetPalaceId?: string;
    targetPalaceName?: string;
    targetAtlasPath?: string | null;
    targetRouteId?: string;
    targetRouteName?: string;
    targetNodeId?: string;
  } | null;
  kind: "memory" | "portal";
  source: SourcePosition;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export interface AstRouteLocusMember {
  ref: string;
  order: number;
  source: SourcePosition;
}

export interface AstRouteDeclaration {
  type: "RouteDeclaration";
  name: string;
  normalizedName: string;
  metadata: AstStructuredTag[];
  members: AstRouteLocusMember[];
  source: SourcePosition;
}

// ---------------------------------------------------------------------------
// Aliases and imports
// ---------------------------------------------------------------------------

export interface AstAliasDeclaration {
  type: "AliasDeclaration";
  alias: string;
  cast: string;
  description: string | null;
  source: SourcePosition;
}

export interface AstImportDeclaration {
  type: "ImportDeclaration";
  path: string;
  namespace: string;
  source: SourcePosition;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export interface AstQueryDeclaration {
  type: "QueryDeclaration";
  verb: "tag" | "node" | "neighbors" | "route" | "depends" | "path" | "filter" | "all";
  args: string;
  pathArgs: [string, string] | null;
  scope: "document" | "palace";
  source: SourcePosition;
}

// ---------------------------------------------------------------------------
// Diagnostics
// ---------------------------------------------------------------------------

export interface AstSuggestedFix {
  description: string;
  replacement: string;
  position: SourcePosition;
}

export interface AstDiagnostic {
  type: "Diagnostic";
  code: string;
  numericCode: string;
  severity: "error" | "warning" | "info" | "hint";
  message: string;
  position: SourcePosition;
  related: SourcePosition[];
  fix: AstSuggestedFix | null;
}
