import type { PalacePortalRef } from "../../entities/types";
import { parseCast } from "./cast";
import { DIAGNOSTIC_CODES } from "./diagnosticCodes";
import type {
  DslAliasDeclaration,
  DslBodySegment,
  DslDiagnostic,
  DslDiagnosticCode,
  DslEdgeSemantic,
  DslImportDeclaration,
  DslInlineRef,
  DslNode,
  DslParseResult,
  DslQueryDeclaration,
  DslQueryVerb,
  DslRoute,
  DslSnapshot,
  DslStructuredTag,
  SuggestedFix,
} from "./types";

// ---------------------------------------------------------------------------
// Pre-processing
// ---------------------------------------------------------------------------

interface Line {
  num: number;
  body: string;
}

function preprocess(text: string): Line[] {
  const lines: Line[] = [];
  const split = text.replace(/\r\n?/g, "\n").split("\n");
  for (let i = 0; i < split.length; i += 1) {
    const trimmed = split[i]!.trim();
    if (trimmed === "" || trimmed.startsWith("--")) continue;
    lines.push({ num: i + 1, body: trimmed });
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Lexer — deterministic line classification
//
// Prefix table (first non-whitespace char):
//   @        → palace header OR atlas/portal directive
//   :        → body content
//   #        → tag line
//   >        → edge
//   /        → route header
//   \d+ ' '  → route step
//   (other)  → node title
// ---------------------------------------------------------------------------

type ClassifiedLine =
  | { type: "palace"; name: string }
  | { type: "atlas"; path: string }
  | { type: "portal"; target: string }
  | { type: "body"; text: string }
  | { type: "tags" }
  | { type: "edge"; rest: string }
  | { type: "route-hdr"; name: string }
  | { type: "route-step"; title: string }
  | { type: "node"; title: string; id: string | null }
  | { type: "alias-decl"; rest: string }
  | { type: "import-decl"; rest: string }
  | { type: "query-decl"; verb: string; args: string };

function classify(body: string): ClassifiedLine {
  if (body.startsWith("!import")) {
    return { type: "import-decl", rest: body.slice("!import".length).trim() };
  }
  if (body.startsWith("?")) {
    const rest = body.slice(1).trim();
    const spaceIdx = rest.search(/\s/);
    const verb = spaceIdx === -1 ? rest : rest.slice(0, spaceIdx);
    const args = spaceIdx === -1 ? "" : rest.slice(spaceIdx + 1).trim();
    return { type: "query-decl", verb, args };
  }
  if (body.startsWith("~")) {
    return { type: "alias-decl", rest: body.slice(1).trim() };
  }
  if (body.startsWith("@atlas")) {
    return { type: "atlas", path: body.slice("@atlas".length).trim() };
  }
  if (body.startsWith("@portal")) {
    return { type: "portal", target: body.slice("@portal".length).trim() };
  }
  if (body.startsWith("@")) {
    return { type: "palace", name: body.slice(1).trim() };
  }
  if (body.startsWith(":")) {
    return { type: "body", text: body.slice(1).trim() };
  }
  if (body.startsWith("#")) {
    return { type: "tags" };
  }
  if (body.startsWith(">")) {
    return { type: "edge", rest: body.slice(1).trim() };
  }
  if (body.startsWith("/")) {
    return { type: "route-hdr", name: body.slice(1).trim() };
  }
  const stepMatch = body.match(/^(\d+)\s+(.+)$/);
  if (stepMatch) {
    return { type: "route-step", title: stepMatch[2]!.trim() };
  }
  // Feature 1 — stable node identifier: [id] Title
  if (body.startsWith("[")) {
    const idMatch = body.match(/^\[([^\]]*)\]\s*(.*)/);
    if (idMatch) {
      const rawId = idMatch[1]!;
      const title = idMatch[2]!.trim();
      return { type: "node", title, id: rawId };
    }
  }
  return { type: "node", title: body, id: null };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function diag(
  diagnostics: DslDiagnostic[],
  severity: "error" | "warning" | "info" | "hint",
  code: DslDiagnosticCode,
  line: number,
  column: number,
  length: number,
  message: string,
  related?: { line: number; column: number; length: number }[],
  fix?: SuggestedFix,
) {
  diagnostics.push({
    code,
    numericCode: DIAGNOSTIC_CODES[code],
    severity,
    line,
    column,
    length,
    message,
    related: related ?? [],
    fix: fix ?? null,
  });
}

function parsePortalTarget(s: string): PalacePortalRef | null {
  const match = s.match(/^\/palaces\/([^#@\s]+)(?:#([^@\s]+))?(?:@(\S+))?$/);
  if (!match) return null;
  const ref: PalacePortalRef = { targetPalaceName: match[1]! };
  if (match[2]) ref.targetRouteName = match[2];
  if (match[3]) ref.targetNodeId = match[3];
  return ref;
}

// ---------------------------------------------------------------------------
// Feature 1 — stable node identifier helpers
// ---------------------------------------------------------------------------

const RESERVED_NODE_IDS = new Set(["palace", "import", "route"]);
const NODE_ID_RE = /^[a-z_][a-z0-9_-]*$/;

/** Validates a raw (already-lowercased) node id token. Returns error string or null. */
function validateNodeId(id: string): string | null {
  if (id.length === 0) return "Node identifier must not be empty";
  if (id.length > 64) return `Node identifier "${id}" exceeds 64-character limit`;
  if (RESERVED_NODE_IDS.has(id)) return `"${id}" is a reserved identifier`;
  if (!NODE_ID_RE.test(id)) return `Node identifier "${id}" contains invalid characters`;
  return null;
}

/** Normalizes a route name to a lowercase-hyphenated slug. */
function normalizeRouteName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || "route";
}

/** Derives a stable implicit id from a title. Collisions resolved by caller via usedIds. */
function deriveImplicitId(title: string, usedIds: Set<string>): string {
  let base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  if (base === "") base = "node";
  if (!usedIds.has(base)) return base;
  let n = 2;
  while (usedIds.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

// ---------------------------------------------------------------------------
// Feature 5 — structured tag helpers
// ---------------------------------------------------------------------------

function parseTagsLine(body: string): {
  tags: string[];
  structuredTags: DslStructuredTag[];
  invalid: { token: string; offset: number }[];
} {
  const tags: string[] = [];
  const structuredTags: DslStructuredTag[] = [];
  const invalid: { token: string; offset: number }[] = [];
  const tokenRe = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(body)) !== null) {
    const token = m[0]!;
    const stripped = token.replace(/^#/, "");
    const colonIdx = stripped.indexOf(":");
    if (colonIdx > 0) {
      // Structured tag: #key:value
      const key = stripped.slice(0, colonIdx).toLowerCase();
      const value = stripped.slice(colonIdx + 1);
      if (/^[a-z][a-z0-9_-]*$/.test(key)) {
        structuredTags.push({ key, value: value || null, raw: token });
        // Also keep in flat tags as "key:value" for backward-compat consumers
        const flat = `${key}:${value}`;
        if (!tags.includes(flat)) tags.push(flat);
      } else {
        invalid.push({ token, offset: m.index });
      }
    } else if (/^[A-Za-z0-9_-]+$/.test(stripped)) {
      // Plain tag
      const lower = stripped.toLowerCase();
      if (!tags.includes(lower)) tags.push(lower);
    } else if (token !== "#") {
      invalid.push({ token, offset: m.index });
    }
  }
  return { tags, structuredTags, invalid };
}

// ---------------------------------------------------------------------------
// Feature 4 — import declaration helpers
// ---------------------------------------------------------------------------

function stemFromPath(path: string): string {
  const base = path.split("/").pop() ?? path;
  const stem = base.replace(/\.[^.]+$/, "");
  return stem.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "module";
}

function parseImportDecl(rest: string): { path: string; namespace: string } | null {
  if (!rest) return null;
  const asMatch = rest.match(/^(\S+)\s+as\s+([a-zA-Z][a-zA-Z0-9_-]*)$/);
  if (asMatch) return { path: asMatch[1]!, namespace: asMatch[2]!.toLowerCase() };
  if (/^\S+$/.test(rest)) return { path: rest, namespace: stemFromPath(rest) };
  return null;
}

// ---------------------------------------------------------------------------
// Feature 2 — inline body reference scanner
// ---------------------------------------------------------------------------

function scanBodySegments(text: string): {
  segments: DslBodySegment[];
  unclosed: boolean;
} {
  const segments: DslBodySegment[] = [];
  let i = 0;
  let plainStart = 0;

  function flushPlain(end: number) {
    if (end > plainStart) segments.push({ kind: "plain", text: text.slice(plainStart, end) });
  }

  while (i < text.length) {
    const ch = text[i]!;

    // Escape sequences: \@ \& \[[
    if (ch === "\\" && i + 1 < text.length) {
      const next = text[i + 1]!;
      if (next === "@" || next === "&") {
        flushPlain(i);
        segments.push({ kind: "plain", text: next });
        i += 2;
        plainStart = i;
        continue;
      }
      if (next === "[" && text[i + 2] === "[") {
        flushPlain(i);
        segments.push({ kind: "plain", text: "[[" });
        i += 3;
        plainStart = i;
        continue;
      }
    }

    // @id reference — including qualified @ns::localid form
    if (ch === "@") {
      let j = i + 1;
      while (j < text.length && /[a-z0-9_-]/i.test(text[j]!)) j++;
      // Qualified form: namespace::localid
      if (text[j] === ":" && text[j + 1] === ":") {
        j += 2;
        while (j < text.length && /[a-z0-9_-]/i.test(text[j]!)) j++;
      }
      const value = text.slice(i + 1, j).toLowerCase();
      if (value.length > 0) {
        flushPlain(i);
        segments.push({ kind: "ref", refType: "id", value, resolved: null });
        i = j;
        plainStart = i;
        continue;
      }
    }

    // [[Title]] reference
    if (ch === "[" && text[i + 1] === "[") {
      const closeIdx = text.indexOf("]]", i + 2);
      if (closeIdx === -1) {
        flushPlain(i);
        segments.push({ kind: "plain", text: text.slice(i) });
        return { segments, unclosed: true };
      }
      flushPlain(i);
      const value = text.slice(i + 2, closeIdx);
      segments.push({ kind: "ref", refType: "title", value, resolved: null });
      i = closeIdx + 2;
      plainStart = i;
      continue;
    }

    // &alias reference
    if (ch === "&") {
      let j = i + 1;
      while (j < text.length && /[a-z0-9_-]/i.test(text[j]!)) j++;
      const value = text.slice(i + 1, j).toLowerCase();
      if (value.length > 0) {
        flushPlain(i);
        segments.push({ kind: "ref", refType: "alias", value, resolved: null });
        i = j;
        plainStart = i;
        continue;
      }
    }

    i++;
  }

  flushPlain(text.length);
  return { segments, unclosed: false };
}

// ---------------------------------------------------------------------------
// Feature 3 — alias pre-pass
// ---------------------------------------------------------------------------

function buildAliasTable(lines: Line[]): {
  table: Map<string, string>;
  declarations: DslAliasDeclaration[];
  diagnostics: DslDiagnostic[];
} {
  const table = new Map<string, string>();
  const declarations: DslAliasDeclaration[] = [];
  const diagnostics: DslDiagnostic[] = [];
  const seenAliases = new Set<string>();

  for (const { body, num } of lines) {
    if (!body.startsWith("~")) continue;
    const rest = body.slice(1).trim();
    const m = rest.match(/^([a-zA-Z][a-zA-Z0-9_-]*):([0-9]{4})(?:\s+(.+))?$/);
    if (!m) {
      diag(diagnostics, "error", "alias-malformed", num, 1, body.length, "Malformed alias declaration");
      continue;
    }
    const alias = m[1]!.toLowerCase();
    const cast = m[2]!;
    const description = m[3] ?? null;

    if (parseCast(cast) === null) {
      diag(diagnostics, "error", "alias-invalid-cast", num, 1, body.length, `Invalid CAST token "${cast}"`);
      continue;
    }
    if (seenAliases.has(alias)) {
      diag(diagnostics, "error", "alias-duplicate", num, 1, body.length, `Duplicate alias declaration "${alias}"`);
      continue;
    }
    seenAliases.add(alias);
    table.set(alias, cast);
    declarations.push({ alias, cast, description, sourceLine: num });
  }

  return { table, declarations, diagnostics };
}

function parseEdgeRest(
  rest: string,
  aliasTable: Map<string, string>,
): { target: string; castToken: string | null; semantic: DslEdgeSemantic } {
  const noSemantic: DslEdgeSemantic = { cast: null, alias: null, form: "cast", resolvedCast: null };
  const lastSpaceIdx = rest.lastIndexOf(" ");
  if (lastSpaceIdx === -1) {
    return { target: rest.trim(), castToken: null, semantic: noSemantic };
  }
  const prefix = rest.slice(0, lastSpaceIdx).trim();
  const lastToken = rest.slice(lastSpaceIdx + 1);

  // Hybrid: CAST:alias
  const hybridM = lastToken.match(/^([0-9]{4}):([a-zA-Z][a-zA-Z0-9_-]*)$/);
  if (hybridM) {
    const castToken = hybridM[1]!;
    const alias = hybridM[2]!.toLowerCase();
    return { target: prefix, castToken, semantic: { cast: castToken, alias, form: "hybrid", resolvedCast: castToken } };
  }

  // CAST: 4-digit token
  if (/^[0-9]{4}$/.test(lastToken)) {
    return { target: prefix, castToken: lastToken, semantic: { cast: lastToken, alias: null, form: "cast", resolvedCast: lastToken } };
  }

  // Bracketed alias: [alias]
  const bracketM = lastToken.match(/^\[([^\]]+)\]$/);
  if (bracketM) {
    const alias = bracketM[1]!.toLowerCase();
    const resolvedCast = aliasTable.get(alias) ?? null;
    return { target: prefix, castToken: resolvedCast, semantic: { cast: null, alias, form: "bracketed", resolvedCast } };
  }

  // Word alias: last token is in alias table
  if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(lastToken)) {
    const alias = lastToken.toLowerCase();
    if (aliasTable.has(alias)) {
      const resolvedCast = aliasTable.get(alias)!;
      return { target: prefix, castToken: resolvedCast, semantic: { cast: null, alias, form: "alias", resolvedCast } };
    }
  }

  // No semantic: entire rest is target
  return { target: rest.trim(), castToken: null, semantic: noSemantic };
}

const QUERY_VERBS = new Set<string>(["tag", "node", "neighbors", "route", "depends", "path", "filter", "all"]);

function emptySnapshot(): DslSnapshot {
  return { palaceName: "", atlasPath: null, nodes: [], routes: [], aliases: [], imports: [], queries: [] };
}

// ---------------------------------------------------------------------------
// Parser — finite state machine
// ---------------------------------------------------------------------------

export function parseDsl(text: string): DslParseResult {
  const lines = preprocess(text);
  if (lines.length === 0) {
    return { snapshot: emptySnapshot(), diagnostics: [] };
  }

  // Feature 3 — alias pre-pass: build table before FSM so all alias forms resolve
  const {
    table: aliasTable,
    declarations: aliasDeclarations,
    diagnostics: aliasDiagnostics,
  } = buildAliasTable(lines);

  const diagnostics: DslDiagnostic[] = [...aliasDiagnostics];
  const snapshot = emptySnapshot();
  snapshot.aliases = aliasDeclarations;
  /** title → source line of first occurrence, for related positions on duplicate-title */
  const seenTitles = new Map<string, number>();
  const seenIds = new Set<string>();
  /** explicit id → source line of first occurrence, for related on duplicate-node-id */
  const seenIdLines = new Map<string, number>();
  let sawHeader = false;
  let currentNode: DslNode | null = null;
  let currentRoute: DslRoute | null = null;
  let routeHasMembers = false;
  const seenNamespaces = new Set<string>();

  function flush() {
    if (currentNode) snapshot.nodes.push(currentNode);
    if (currentRoute) snapshot.routes.push(currentRoute);
    currentNode = null;
    currentRoute = null;
    routeHasMembers = false;
  }

  for (const { body, num } of lines) {
    const cl = classify(body);

    switch (cl.type) {
      case "palace":
        flush();
        sawHeader = true;
        snapshot.palaceName = cl.name;
        break;

      case "atlas":
        snapshot.atlasPath = cl.path || null;
        break;

      case "node": {
        flush();
        const { title, id: rawId } = cl;
        if (seenTitles.has(title)) {
          const firstLine = seenTitles.get(title)!;
          diag(
            diagnostics,
            "error",
            "duplicate-title",
            num,
            1,
            body.length,
            `Duplicate node title "${title}"`,
            [{ line: firstLine, column: 1, length: title.length }],
          );
        } else {
          seenTitles.set(title, num);
        }

        // Feature 1 — resolve stable id
        let resolvedId: string | null = null;
        if (rawId !== null) {
          const normalizedId = rawId.toLowerCase();
          const idErr = validateNodeId(normalizedId);
          if (idErr) {
            const isReserved = RESERVED_NODE_IDS.has(normalizedId);
            diag(
              diagnostics,
              "error",
              isReserved ? "reserved-node-id" : "malformed-node-id",
              num,
              1,
              body.length,
              idErr,
              undefined,
              isReserved
                ? {
                    description: `Remove reserved identifier "[${rawId}]"`,
                    replacement: title,
                    position: { line: num, column: 1, length: body.length },
                  }
                : undefined,
            );
          } else if (seenIds.has(normalizedId)) {
            const firstLine = seenIdLines.get(normalizedId)!;
            diag(
              diagnostics,
              "error",
              "duplicate-node-id",
              num,
              1,
              body.length,
              `Duplicate node identifier "${normalizedId}"`,
              [{ line: firstLine, column: 1, length: 1 }],
            );
          } else {
            resolvedId = normalizedId;
            seenIds.add(normalizedId);
            seenIdLines.set(normalizedId, num);
          }
        }

        const implicitId = resolvedId ?? deriveImplicitId(title, seenIds);
        if (!resolvedId) seenIds.add(implicitId);

        currentNode = {
          title,
          id: resolvedId,
          implicitId,
          content: "",
          bodySegments: [],
          kind: "memory",
          portal: null,
          tags: [],
          structuredTags: [],
          edges: [],
          sourceLine: num,
        };
        break;
      }

      case "route-hdr":
        flush();
        currentRoute = { name: cl.name, normalizedName: normalizeRouteName(cl.name), metadata: [], loci: [], sourceLine: num };
        break;

      case "body":
        if (!currentNode) {
          diag(
            diagnostics,
            "error",
            "misplaced-line",
            num,
            1,
            body.length,
            "content lines must appear under a node",
          );
          break;
        }
        {
          const { segments, unclosed } = scanBodySegments(cl.text);
          if (unclosed) {
            diag(diagnostics, "error", "inline-ref-unclosed", num, 1, body.length, "Unclosed inline title reference [[");
          }
          if (currentNode.bodySegments.length > 0) {
            currentNode.bodySegments.push({ kind: "plain", text: "\n" });
          }
          for (const seg of segments) currentNode.bodySegments.push(seg);
          currentNode.content =
            currentNode.content === ""
              ? cl.text
              : `${currentNode.content}\n${cl.text}`;
        }
        break;

      case "tags":
        if (currentNode) {
          const { tags, structuredTags, invalid } = parseTagsLine(body);
          for (const tag of tags) {
            if (!currentNode.tags.includes(tag)) currentNode.tags.push(tag);
          }
          for (const st of structuredTags) {
            currentNode.structuredTags.push(st);
          }
          for (const inv of invalid) {
            diag(
              diagnostics,
              "warning",
              "tag-syntax",
              num,
              inv.offset + 1,
              inv.token.length,
              `Invalid tag token "${inv.token}"`,
            );
          }
        } else if (currentRoute && !routeHasMembers) {
          // Feature 7 — route metadata: tags before first locus belong to the route
          const { structuredTags, invalid } = parseTagsLine(body);
          for (const st of structuredTags) currentRoute.metadata.push(st);
          for (const inv of invalid) {
            diag(
              diagnostics,
              "warning",
              "tag-syntax",
              num,
              inv.offset + 1,
              inv.token.length,
              `Invalid tag token "${inv.token}"`,
            );
          }
        } else {
          diag(
            diagnostics,
            "error",
            "misplaced-line",
            num,
            1,
            body.length,
            "tag lines must appear under a node",
          );
        }
        break;

      case "alias-decl":
        // handled in pre-pass; FSM skips
        break;

      case "import-decl": {
        const parsed = parseImportDecl(cl.rest);
        if (!parsed) {
          diag(diagnostics, "error", "import-malformed", num, 1, body.length, "Malformed import declaration");
          break;
        }
        const { path, namespace } = parsed;
        if (seenNamespaces.has(namespace)) {
          diag(diagnostics, "error", "import-namespace-collision", num, 1, body.length,
            `Namespace collision: "${namespace}" already declared`);
          break;
        }
        seenNamespaces.add(namespace);
        snapshot.imports.push({ path, namespace, sourceLine: num } satisfies DslImportDeclaration);
        break;
      }

      case "edge":
        if (!currentNode) {
          diag(
            diagnostics,
            "error",
            "misplaced-line",
            num,
            1,
            body.length,
            "edge lines must appear under a node",
          );
          break;
        }
        {
          const { target, castToken, semantic } = parseEdgeRest(cl.rest, aliasTable);

          // Hybrid conflict: alias maps to a different CAST than stated
          if (semantic.form === "hybrid" && semantic.alias) {
            const aliasResolved = aliasTable.get(semantic.alias);
            if (aliasResolved && aliasResolved !== semantic.cast) {
              diag(
                diagnostics,
                "error",
                "alias-cast-conflict",
                num,
                1,
                body.length,
                `Hybrid edge conflict: alias "${semantic.alias}" maps to ${aliasResolved}, not ${semantic.cast}`,
              );
            }
          }

          // Unresolved alias
          if ((semantic.form === "alias" || semantic.form === "bracketed") && semantic.resolvedCast === null) {
            diag(
              diagnostics,
              "warning",
              "alias-unresolved",
              num,
              1,
              body.length,
              `Unresolved edge alias "${semantic.alias}"`,
            );
          }

          let cast = { ab: "", cd: "", ef: "", gh: "" };
          if (castToken !== null) {
            const parsed = parseCast(castToken);
            if (parsed === null) {
              diag(
                diagnostics,
                "error",
                "malformed-cast",
                num,
                1,
                body.length,
                `Malformed CAST shorthand "${castToken}"`,
              );
            } else {
              cast = parsed;
            }
          }
          currentNode.edges.push({ targetTitle: target, cast, semantic, sourceLine: num });
        }
        break;

      case "portal":
        if (!currentNode) {
          diag(
            diagnostics,
            "error",
            "misplaced-line",
            num,
            1,
            body.length,
            "portal lines must appear under a node",
          );
          break;
        }
        {
          const portal = parsePortalTarget(cl.target);
          if (!portal) {
            diag(
              diagnostics,
              "error",
              "invalid-portal-target",
              num,
              1,
              body.length,
              `Invalid portal target "${cl.target}"`,
            );
          } else {
            currentNode.kind = "portal";
            currentNode.portal = portal;
          }
        }
        break;

      case "query-decl": {
        const { verb, args } = cl;
        if (!QUERY_VERBS.has(verb)) {
          diag(diagnostics, "error", "query-verb-unknown", num, 1, body.length,
            `Unknown query verb "${verb}"`);
          break;
        }
        let pathArgs: [string, string] | null = null;
        if (verb === "path") {
          const parts = args.trim().split(/\s+/).filter(Boolean);
          if (parts.length < 2) {
            diag(diagnostics, "error", "query-path-missing-arg", num, 1, body.length,
              "?path requires two node references");
          } else {
            pathArgs = [parts[0]!, parts[1]!];
          }
        }
        const scope: "document" | "palace" = sawHeader ? "palace" : "document";
        snapshot.queries.push({ verb: verb as DslQueryVerb, args, pathArgs, scope, sourceLine: num } satisfies DslQueryDeclaration);
        break;
      }

      case "route-step":
        if (!currentRoute) {
          diag(
            diagnostics,
            "error",
            "misplaced-line",
            num,
            1,
            body.length,
            "route loci must appear under a route block",
          );
          break;
        }
        routeHasMembers = true;
        currentRoute.loci.push(cl.title);
        break;
    }
  }

  flush();

  if (!sawHeader) {
    diag(
      diagnostics,
      "error",
      "missing-palace-header",
      1,
      1,
      1,
      'Missing "@<name>" header',
    );
  }

  const titleSet = new Set(snapshot.nodes.map((n) => n.title));
  for (const node of snapshot.nodes) {
    for (const edge of node.edges) {
      if (!titleSet.has(edge.targetTitle)) {
        diag(
          diagnostics,
          "warning",
          "unknown-target",
          edge.sourceLine,
          1,
          1,
          `Edge target "${edge.targetTitle}" does not match any node`,
        );
      }
    }
  }
  for (const route of snapshot.routes) {
    for (const locusTitle of route.loci) {
      if (!titleSet.has(locusTitle)) {
        diag(
          diagnostics,
          "warning",
          "unknown-target",
          route.sourceLine,
          1,
          1,
          `Route locus "${locusTitle}" does not match any node`,
        );
      }
    }
  }

  // Feature 7 — validate route prereq metadata tags
  const routeNames = new Set(snapshot.routes.map((r) => r.name));
  const routeNormNames = new Set(snapshot.routes.map((r) => r.normalizedName));
  for (const route of snapshot.routes) {
    for (const tag of route.metadata) {
      if (tag.key === "prereq" && tag.value !== null) {
        if (!routeNames.has(tag.value) && !routeNormNames.has(tag.value)) {
          diag(diagnostics, "warning", "route-prereq-unresolved", route.sourceLine, 1, 1,
            `Unresolved route prereq "${tag.value}"`);
        }
      }
    }
  }

  // Feature 2 — resolve inline refs now that all nodes are known
  const implicitIdMap = new Map(snapshot.nodes.map((n) => [n.implicitId, n]));
  const titleMap2 = new Map(snapshot.nodes.map((n) => [n.title, n]));
  for (const node of snapshot.nodes) {
    for (const seg of node.bodySegments) {
      if (seg.kind !== "ref") continue;
      const ref = seg as DslInlineRef;
      let resolvedNode: DslNode | undefined;
      if (ref.refType === "id") {
        resolvedNode = implicitIdMap.get(ref.value);
        if (!resolvedNode) {
          diag(diagnostics, "error", "inline-ref-unresolved-id", node.sourceLine, 1, 1, `Unresolved node id reference "@${ref.value}"`);
        } else {
          ref.resolved = resolvedNode.implicitId;
        }
      } else if (ref.refType === "title") {
        resolvedNode = titleMap2.get(ref.value);
        if (!resolvedNode) {
          diag(diagnostics, "warning", "inline-ref-unresolved-title", node.sourceLine, 1, 1, `Unresolved title reference "[[${ref.value}]]"`);
        } else {
          ref.resolved = resolvedNode.implicitId;
        }
      } else {
        const castToken = aliasTable.get(ref.value);
        if (!castToken) {
          diag(diagnostics, "warning", "inline-ref-unresolved-alias", node.sourceLine, 1, 1, `Unresolved alias reference "&${ref.value}"`);
        } else {
          ref.resolved = castToken;
        }
      }
      if (resolvedNode === node) {
        diag(diagnostics, "warning", "inline-ref-self", node.sourceLine, 1, 1, "Self-referencing inline reference");
      }
    }
  }

  // Feature 8 — validate query node/route references
  for (const query of snapshot.queries) {
    if (query.verb === "node" || query.verb === "neighbors" || query.verb === "depends") {
      const ref = query.args.trim();
      if (ref && !implicitIdMap.has(ref) && !titleMap2.has(ref)) {
        diag(diagnostics, "warning", "query-unresolved-node", query.sourceLine, 1, 1,
          `Query references unresolved node "${ref}"`);
      }
    } else if (query.verb === "path" && query.pathArgs) {
      for (const ref of query.pathArgs) {
        if (!implicitIdMap.has(ref) && !titleMap2.has(ref)) {
          diag(diagnostics, "warning", "query-unresolved-node", query.sourceLine, 1, 1,
            `Query references unresolved node "${ref}"`);
        }
      }
    } else if (query.verb === "route") {
      const ref = query.args.trim();
      if (ref && !routeNames.has(ref) && !routeNormNames.has(ref)) {
        diag(diagnostics, "warning", "query-unresolved-route", query.sourceLine, 1, 1,
          `Query references unresolved route "${ref}"`);
      }
    }
  }

  return { snapshot, diagnostics };
}
