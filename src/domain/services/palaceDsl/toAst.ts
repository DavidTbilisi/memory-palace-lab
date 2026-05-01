import type { DslParseResult } from "./types";
import type {
  AstBodyLine,
  AstDiagnostic,
  AstEdgeDeclaration,
  AstNodeDeclaration,
  AstRouteDeclaration,
  Document,
  SourcePosition,
} from "./ast";

export interface ToAstOptions {
  /** File path to embed in SourceInfo and all SourcePositions. Defaults to "". */
  file?: string;
  /** Raw source text, used to compute SourceInfo.checksum and lineCount. */
  sourceText?: string;
}

function pos(file: string, line: number, length = 1): SourcePosition {
  return { file, line, column: 1, length };
}

/**
 * Converts a DslParseResult into the canonical Document AST.
 * The resulting Document is fully JSON-serializable without data loss.
 */
export function toAst(result: DslParseResult, options: ToAstOptions = {}): Document {
  const { snapshot, diagnostics } = result;
  const file = options.file ?? "";
  const sourceText = options.sourceText ?? "";

  const lineCount = sourceText === "" ? 0 : sourceText.split("\n").length;
  // SHA-256 checksum is computed by the normalization pass (Feature 10).
  const checksum = "";

  const astDiagnostics: AstDiagnostic[] = diagnostics.map((d) => ({
    type: "Diagnostic",
    code: d.code,
    numericCode: d.numericCode,
    severity: d.severity,
    message: d.message,
    position: { file, line: d.line, column: d.column, length: d.length },
    related: d.related.map((r) => ({ file, line: r.line, column: r.column, length: r.length })),
    fix: d.fix
      ? {
          description: d.fix.description,
          replacement: d.fix.replacement,
          position: {
            file,
            line: d.fix.position.line,
            column: d.fix.position.column,
            length: d.fix.position.length,
          },
        }
      : null,
  }));

  const astNodes: AstNodeDeclaration[] = snapshot.nodes.map((n) => {
    const bodyLines: AstBodyLine[] = n.content
      .split("\n")
      .filter((raw) => raw.length > 0)
      .map((raw) => ({ type: "BodyLine" as const, raw, segments: [] }));

    // Distribute body segments across body lines by matching raw text content
    if (bodyLines.length > 0) {
      // For now: assign all segments to the first body line when there is one.
      // A future pass can split by '\n' separators in bodySegments.
      bodyLines[0]!.segments = n.bodySegments
        .filter((s) => !(s.kind === "plain" && s.text === "\n"))
        .map((s) =>
          s.kind === "plain"
            ? { kind: "plain" as const, text: s.text }
            : { kind: "ref" as const, refType: s.refType, value: s.value, resolved: s.resolved },
        );
    }

    const edges: AstEdgeDeclaration[] = n.edges.map((e) => ({
      type: "EdgeDeclaration",
      targetTitle: e.targetTitle,
      cast: e.cast,
      semantic: e.semantic,
      source: pos(file, e.sourceLine, 1),
    }));

    return {
      type: "NodeDeclaration",
      id: n.id,
      implicitId: n.implicitId,
      title: n.title,
      normalizedTitle: n.title.toLowerCase().replace(/\s+/g, " ").trim(),
      body: bodyLines,
      tags: n.tags,
      structuredTags: n.structuredTags,
      edges,
      portal: n.portal,
      kind: n.kind,
      source: pos(file, n.sourceLine, n.title.length),
    };
  });

  const astRoutes: AstRouteDeclaration[] = snapshot.routes.map((r) => ({
    type: "RouteDeclaration",
    name: r.name,
    normalizedName: r.normalizedName,
    metadata: r.metadata,
    members: r.loci.map((ref, i) => ({
      ref,
      order: i,
      source: pos(file, r.sourceLine + i + 1),
    })),
    source: pos(file, r.sourceLine, r.name.length),
  }));

  return {
    type: "Document",
    version: "2.0",
    source: { file, encoding: "utf-8", lineCount, checksum },
    imports: snapshot.imports.map((im) => ({
      type: "ImportDeclaration",
      path: im.path,
      namespace: im.namespace,
      source: pos(file, im.sourceLine),
    })),
    aliases: snapshot.aliases.map((a) => ({
      type: "AliasDeclaration",
      alias: a.alias,
      cast: a.cast,
      description: a.description,
      source: pos(file, a.sourceLine),
    })),
    palace:
      snapshot.palaceName === ""
        ? null
        : {
            type: "PalaceDeclaration",
            title: snapshot.palaceName,
            atlasPath: snapshot.atlasPath,
            source: pos(file, 1, snapshot.palaceName.length),
          },
    nodes: astNodes,
    routes: astRoutes,
    queries: snapshot.queries.map((q) => ({
      type: "QueryDeclaration",
      verb: q.verb,
      args: q.args,
      pathArgs: q.pathArgs,
      scope: q.scope,
      source: pos(file, q.sourceLine),
    })),
    diagnostics: astDiagnostics,
    metadata: { normalizedAt: null, canonicalHash: null },
  };
}
