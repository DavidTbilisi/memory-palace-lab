import type { PalacePortalRef } from "../../entities/types";
import { parseCast } from "./cast";
import type {
  DslDiagnostic,
  DslDiagnosticCode,
  DslNode,
  DslParseResult,
  DslRoute,
  DslSnapshot,
} from "./types";

interface Line {
  num: number;
  indent: number;
  body: string;
}

function preprocess(text: string): Line[] {
  const lines: Line[] = [];
  const split = text.replace(/\r\n?/g, "\n").split("\n");
  for (let i = 0; i < split.length; i += 1) {
    const raw = split[i]!;
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    if (trimmed.startsWith("--")) continue;
    let indent = 0;
    while (indent < raw.length && raw[indent] === " ") indent += 1;
    const body = raw.slice(indent).replace(/\s+$/, "");
    lines.push({ num: i + 1, indent, body });
  }
  return lines;
}

function diag(
  diagnostics: DslDiagnostic[],
  severity: "error" | "warning",
  code: DslDiagnosticCode,
  line: number,
  column: number,
  length: number,
  message: string,
) {
  diagnostics.push({ severity, code, line, column, length, message });
}

function parsePortalTarget(s: string): PalacePortalRef | null {
  const match = s.match(/^\/palaces\/([^#@\s]+)(?:#([^@\s]+))?(?:@(\S+))?$/);
  if (!match) return null;
  const ref: PalacePortalRef = { targetPalaceName: match[1]! };
  if (match[2]) ref.targetRouteName = match[2];
  if (match[3]) ref.targetNodeId = match[3];
  return ref;
}

interface TagParseResult {
  tags: string[];
  invalid: { token: string; offset: number }[];
}

function parseTagsLine(body: string): TagParseResult {
  const after = body.replace(/^#\s*/, "");
  const offsetStart = body.length - after.length;
  const tags: string[] = [];
  const invalid: { token: string; offset: number }[] = [];
  const tokenRe = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(after)) !== null) {
    const stripped = m[0].replace(/^#/, "");
    if (/^[A-Za-z0-9_-]+$/.test(stripped)) {
      const lower = stripped.toLowerCase();
      if (!tags.includes(lower)) tags.push(lower);
    } else {
      invalid.push({ token: m[0], offset: offsetStart + m.index });
    }
  }
  return { tags, invalid };
}

function splitEdge(body: string): { target: string; castToken: string | null } {
  const after = body.replace(/^->\s*/, "");
  const idx = after.indexOf("::");
  if (idx < 0) return { target: after.trim(), castToken: null };
  return {
    target: after.slice(0, idx).trim(),
    castToken: after.slice(idx + 2).trim(),
  };
}

function parseLocus(body: string): { title: string } | null {
  const m = body.match(/^\d+\.\s+(.+)$/);
  if (!m) return null;
  return { title: m[1]!.trim() };
}

function emptySnapshot(): DslSnapshot {
  return { palaceName: "", atlasPath: null, nodes: [], routes: [] };
}

export function parseDsl(text: string): DslParseResult {
  const lines = preprocess(text);
  if (lines.length === 0) {
    return { snapshot: emptySnapshot(), diagnostics: [] };
  }

  const diagnostics: DslDiagnostic[] = [];
  const snapshot = emptySnapshot();
  const seenTitles = new Set<string>();
  let sawHeader = false;
  let currentNode: DslNode | null = null;
  let currentRoute: DslRoute | null = null;

  function flush() {
    if (currentNode) snapshot.nodes.push(currentNode);
    if (currentRoute) snapshot.routes.push(currentRoute);
    currentNode = null;
    currentRoute = null;
  }

  for (const line of lines) {
    const { body, num, indent } = line;

    if (indent === 0) {
      if (body.startsWith("# Palace:")) {
        flush();
        sawHeader = true;
        snapshot.palaceName = body.slice("# Palace:".length).trim();
        continue;
      }
      if (body.startsWith("@atlas")) {
        const path = body.slice("@atlas".length).trim();
        snapshot.atlasPath = path === "" ? null : path;
        continue;
      }
      if (body.startsWith("==")) {
        flush();
        const title = body.slice(2).trim();
        if (seenTitles.has(title)) {
          diag(
            diagnostics,
            "error",
            "duplicate-title",
            num,
            1,
            body.length,
            `Duplicate node title "${title}"`,
          );
        } else {
          seenTitles.add(title);
        }
        currentNode = {
          title,
          content: "",
          kind: "memory",
          portal: null,
          tags: [],
          edges: [],
          sourceLine: num,
        };
        continue;
      }
      if (body.startsWith("::")) {
        flush();
        const m = body.match(/^::\s*Route\s+"([^"]*)"\s*$/);
        if (m) {
          currentRoute = { name: m[1]!, loci: [], sourceLine: num };
        }
        continue;
      }
      // Unrecognized top-level line — silently ignored (parser is forgiving).
      continue;
    }

    if (currentNode) {
      if (body.startsWith(">")) {
        const piece = body.slice(1).trim();
        currentNode.content = currentNode.content === ""
          ? piece
          : `${currentNode.content}\n${piece}`;
        continue;
      }
      if (body.startsWith("~portal")) {
        const target = body.slice("~portal".length).trim();
        const portal = parsePortalTarget(target);
        if (!portal) {
          diag(
            diagnostics,
            "error",
            "invalid-portal-target",
            num,
            1,
            body.length,
            `Invalid portal target "${target}"`,
          );
          continue;
        }
        currentNode.kind = "portal";
        currentNode.portal = portal;
        continue;
      }
      if (body.startsWith("#")) {
        const result = parseTagsLine(body);
        for (const tag of result.tags) {
          if (!currentNode.tags.includes(tag)) currentNode.tags.push(tag);
        }
        for (const inv of result.invalid) {
          diag(
            diagnostics,
            "warning",
            "tag-syntax",
            num,
            indent + inv.offset + 1,
            inv.token.length,
            `Invalid tag token "${inv.token}"`,
          );
        }
        continue;
      }
      if (body.startsWith("->")) {
        const { target, castToken } = splitEdge(body);
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
        currentNode.edges.push({ targetTitle: target, cast, sourceLine: num });
        continue;
      }
      // Unrecognized node attribute — ignored.
      continue;
    }

    if (currentRoute) {
      const locus = parseLocus(body);
      if (locus) {
        currentRoute.loci.push(locus.title);
      } else {
        diag(
          diagnostics,
          "error",
          "malformed-route-locus",
          num,
          1,
          body.length,
          "Malformed route locus",
        );
      }
      continue;
    }

    // Indented line with no current block — ignored.
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
      'Missing "# Palace: <name>" header',
    );
  }

  const titleSet = new Set(snapshot.nodes.map((n) => n.title));
  for (const node of snapshot.nodes) {
    for (const edge of node.edges) {
      if (!titleSet.has(edge.targetTitle)) {
        diag(
          diagnostics,
          "error",
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
          "error",
          "unknown-target",
          route.sourceLine,
          1,
          1,
          `Route locus "${locusTitle}" does not match any node`,
        );
      }
    }
  }

  return { snapshot, diagnostics };
}
