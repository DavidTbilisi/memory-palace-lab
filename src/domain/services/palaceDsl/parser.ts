import type { PalacePortalRef } from "../../entities/types";
import { parseCast } from "./cast";
import type {
  DslDiagnostic,
  DslDiagnosticCode,
  DslNode,
  DslParseResult,
  DslRoute,
  DslSnapshot,
  DslStructuredTag,
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
  | { type: "node"; title: string; id: string | null };

function classify(body: string): ClassifiedLine {
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

function parseEdgeRest(rest: string): { target: string; castToken: string | null } {
  const m = rest.match(/^(.*\S)\s+([0-9]{4})$/);
  if (m) return { target: m[1]!.trim(), castToken: m[2]! };
  return { target: rest.trim(), castToken: null };
}

function emptySnapshot(): DslSnapshot {
  return { palaceName: "", atlasPath: null, nodes: [], routes: [] };
}

// ---------------------------------------------------------------------------
// Parser — finite state machine
// ---------------------------------------------------------------------------

export function parseDsl(text: string): DslParseResult {
  const lines = preprocess(text);
  if (lines.length === 0) {
    return { snapshot: emptySnapshot(), diagnostics: [] };
  }

  const diagnostics: DslDiagnostic[] = [];
  const snapshot = emptySnapshot();
  const seenTitles = new Set<string>();
  const seenIds = new Set<string>();
  let sawHeader = false;
  let currentNode: DslNode | null = null;
  let currentRoute: DslRoute | null = null;

  function flush() {
    if (currentNode) snapshot.nodes.push(currentNode);
    if (currentRoute) snapshot.routes.push(currentRoute);
    currentNode = null;
    currentRoute = null;
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

        // Feature 1 — resolve stable id
        let resolvedId: string | null = null;
        if (rawId !== null) {
          const normalizedId = rawId.toLowerCase();
          const idErr = validateNodeId(normalizedId);
          if (idErr) {
            diag(
              diagnostics,
              "error",
              normalizedId === "" || !NODE_ID_RE.test(normalizedId)
                ? "malformed-node-id"
                : "reserved-node-id",
              num,
              1,
              body.length,
              idErr,
            );
          } else if (seenIds.has(normalizedId)) {
            diag(
              diagnostics,
              "error",
              "duplicate-node-id",
              num,
              1,
              body.length,
              `Duplicate node identifier "${normalizedId}"`,
            );
          } else {
            resolvedId = normalizedId;
            seenIds.add(normalizedId);
          }
        }

        const implicitId = resolvedId ?? deriveImplicitId(title, seenIds);
        if (!resolvedId) seenIds.add(implicitId);

        currentNode = {
          title,
          id: resolvedId,
          implicitId,
          content: "",
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
        currentRoute = { name: cl.name, loci: [], sourceLine: num };
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
        currentNode.content =
          currentNode.content === ""
            ? cl.text
            : `${currentNode.content}\n${cl.text}`;
        break;

      case "tags":
        if (!currentNode) {
          diag(
            diagnostics,
            "error",
            "misplaced-line",
            num,
            1,
            body.length,
            "tag lines must appear under a node",
          );
          break;
        }
        {
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
        }
        break;

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
          const { target, castToken } = parseEdgeRest(cl.rest);
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

  return { snapshot, diagnostics };
}
