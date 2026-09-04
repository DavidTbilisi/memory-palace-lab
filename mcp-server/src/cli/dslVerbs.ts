import { normalize } from "../../../src/domain/services/palaceDsl/normalize";
import { parseDsl } from "../../../src/domain/services/palaceDsl/parser";
import { serializeDsl } from "../../../src/domain/services/palaceDsl/serializer";
import { dslToPalaceSnapshot } from "../../../src/domain/services/palaceDsl/toPalaceSnapshot";
import type { DslDiagnostic, DslParseResult } from "../../../src/domain/services/palaceDsl/types";

/** Database-free DSL file operations behind `palace lint | fmt | hash`. */

export interface LintFileResult {
  file: string;
  errors: number;
  warnings: number;
  diagnostics: DslDiagnostic[];
}

export function lintSource(file: string, text: string): LintFileResult {
  const parsed = parseDsl(text);
  return {
    file,
    errors: parsed.diagnostics.filter((d) => d.severity === "error").length,
    warnings: parsed.diagnostics.filter((d) => d.severity === "warning").length,
    diagnostics: parsed.diagnostics,
  };
}

/** Compiler-style `file:line:col: severity CODE message`, so editors and grep can pick it up. */
export function formatDiagnosticLine(file: string, d: DslDiagnostic): string {
  return `${file}:${d.line}:${d.column}: ${d.severity} ${d.numericCode} ${d.message}`;
}

export function errorsOf(parsed: DslParseResult): DslDiagnostic[] {
  return parsed.diagnostics.filter((d) => d.severity === "error");
}

/**
 * Constructs the canonical serializer does not emit. `fmt` refuses documents
 * that use them rather than silently dropping them on rewrite.
 */
export function unformattableConstructs(text: string, parsed: DslParseResult): string[] {
  const s = parsed.snapshot;
  const reasons: string[] = [];
  if (s.aliases.length > 0) reasons.push("~alias declarations");
  if (s.imports.length > 0) reasons.push("!import declarations");
  if (s.queries.length > 0) reasons.push("?queries");
  if (s.nodes.some((n) => n.id !== null)) reasons.push("[id] node identifiers");
  if (s.routes.some((r) => r.metadata.length > 0)) reasons.push("route #metadata tags");
  if (text.split(/\r?\n/).some((line) => line.trim().startsWith("--"))) reasons.push("-- comments");
  if (parsed.diagnostics.some((d) => d.code === "unknown-target")) {
    reasons.push("edges or loci to unknown targets (W007)");
  }
  return reasons;
}

export function formatSource(parsed: DslParseResult): string {
  return serializeDsl(dslToPalaceSnapshot(parsed.snapshot));
}

export async function hashSource(parsed: DslParseResult): Promise<string> {
  return (await normalize(parsed.snapshot)).canonicalHash;
}
