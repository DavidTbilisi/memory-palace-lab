# Palace DSL Reference — v2.0

The Palace DSL is a minimal line-oriented text format for describing a memory palace: its nodes, semantic edges, tags, routes, portal jumps, imports, queries, and metadata. It is used by the split-pane DSL editor and the DSL import/export pipeline.

---

## Table of Contents

1. [Quick Example](#quick-example)
2. [Lexer Overview](#lexer-overview)
3. [Palace Header](#palace-header)
4. [Atlas Path](#atlas-path)
5. [Nodes](#nodes)
   - [Stable Node Identifiers](#stable-node-identifiers)
   - [Body Content](#body-content)
   - [Inline Node References](#inline-node-references)
   - [Tags — Plain and Structured](#tags--plain-and-structured)
   - [Edges and CAST](#edges-and-cast)
   - [Edge Semantic Aliases](#edge-semantic-aliases)
   - [Portals](#portals)
6. [Routes](#routes)
   - [Route Metadata](#route-metadata)
7. [Import System](#import-system)
8. [Query Language](#query-language)
9. [Comments](#comments)
10. [Diagnostic System](#diagnostic-system)
11. [Canonical AST](#canonical-ast)
12. [Normalization and Canonical Hash](#normalization-and-canonical-hash)
13. [Related Files](#related-files)

---

## Quick Example

```text
@SOLID Citadel
@atlas /engineering/oop

~dep:0001 depends on
!import shared.dsl as sh

[gate] Gate of SOLID
: Central fortress connecting five engineering districts.
: Giant glowing word "SOLID" above the gate.
#architecture #clean-code #solid #difficulty:beginner
>Single Responsibility Forge 0001
>Open Closed Library dep

Single Responsibility Forge
: Blacksmith focuses {#gate on the gate} — one thing only.
#cohesion #maintenance #srp
>Change Hydra 1000

/SOLID Main Route
#difficulty:beginner
1 Gate of SOLID
2 Single Responsibility Forge

?tag difficulty:beginner
?path Gate of SOLID Single Responsibility Forge
```

---

## Lexer Overview

The lexer is deterministic: the first character of each trimmed line defines its token type. Parser state (current node, current route, or top-level) determines ownership.

| Prefix | Token | Example |
| --- | --- | --- |
| `@atlas` | Atlas path | `@atlas /science/physics` |
| `@portal` | Portal target | `@portal /palaces/inner` |
| `@` | Palace header | `@Mechanics` |
| `~` | Edge semantic alias | `~dep:0001 depends on` |
| `!import` | Import declaration | `!import security.dsl as sec` |
| `?` | Query | `?tag difficulty:beginner` |
| `[id]` + title | Node with stable id | `[auth] Authentication` |
| `:` | Body content | `: fundamental laws of motion` |
| `#` | Tags (plain + structured) | `#security #domain:auth` |
| `>` | Edge | `>Gravity 1110` |
| `/` | Route header | `/First Walk` |
| `N ` (digit+space) | Route locus step | `1 Newton's Laws` |
| `--` | Comment (ignored) | `-- a comment` |
| (blank) | Ignored | |
| (other) | Node title | `Newton's Laws` |

Indentation is optional and ignored everywhere.

---

## Palace Header

Every file that contains content must open with a palace header:

```text
@<Name>
```

Multi-word names are supported:

```text
@SOLID Citadel
```

The name becomes `palaceName` on the snapshot. Missing palace header when content is present emits **E001 `missing-palace-header`**.

---

## Atlas Path

Declares the position of this palace within the Atlas hierarchy:

```text
@atlas /science/physics
```

The path must start with `/` and may have multiple segments. It appears immediately after the palace header. Only one `@atlas` declaration is recognised per file.

---

## Nodes

A bare line that does not match any other prefix is a node title.

```text
Newton's Laws
```

Node titles must be unique within the file. A duplicate emits **E002 `duplicate-title`** with a `related` position pointing to the first occurrence.

---

### Stable Node Identifiers

A node can be given an explicit stable identifier by prefixing the title with `[id]`:

```text
[auth] Authentication
```

- The id must contain only letters, digits, `-`, and `_`.
- The id `palace` is reserved; using it emits **E103 `reserved-node-id`** with a machine-applicable fix that removes the bracket.
- Duplicate ids across nodes emit **E102 `duplicate-node-id`** with a `related` position pointing to the first declaration.
- Malformed id tokens (invalid characters) emit **E101 `malformed-node-id`**.

When no explicit id is given, the parser derives an `implicitId` from the title by lowercasing and replacing spaces with hyphens (e.g. `Newton's Laws` → `newtons-laws`).

Explicit ids are stable across title renames. Use them when edges or inline references in other nodes should remain valid after a node is renamed.

---

### Body Content

One or more `:` lines following a node title form its body:

```text
Newton's Laws
: First law: an object at rest stays at rest.
: Second law: F = ma.
: Third law: every action has an equal and opposite reaction.
```

Multiple `:` lines are joined with newlines into a single content string. Leading/trailing whitespace after `:` is trimmed.

---

### Inline Node References

Body text can embed typed references to other nodes. The parser resolves them at parse time and records the resolved `implicitId` (or null if unresolved).

| Syntax | Reference type | Resolves by |
| --- | --- | --- |
| `{#id}` | stable id | explicit `[id]` declaration |
| `{@Title}` | title match | case-insensitive title |
| `{~alias}` | semantic alias | alias declaration in same file |

```text
Gate of SOLID
: The entry point — see {#srp Single Responsibility} and {~dep its dependencies}.
```

- Unclosed `{…}` brackets emit **E201 `inline-ref-unclosed`**.
- Unresolved `#id` references emit **E202 `inline-ref-unresolved-id`** (error).
- Unresolved `@title` references emit **W203 `inline-ref-unresolved-title`** (warning).
- Unresolved `~alias` references emit **W204 `inline-ref-unresolved-alias`** (warning).
- A reference to the containing node itself emits **W205 `inline-ref-self`**.

---

### Tags — Plain and Structured

Tags appear on a `#` line following a node body or title:

```text
#security #domain:auth #difficulty:beginner
```

Multiple `#` tokens may appear on the same line, separated by spaces.

**Plain tags** are single words:

```text
#security #architecture #oop
```

**Structured tags** use `key:value` notation:

```text
#difficulty:beginner #domain:auth #duration:30min
```

Reserved structured-tag keys (recognised by the normalization pass):

| Key | Intended meaning |
| --- | --- |
| `difficulty` | Learning difficulty (`beginner`, `intermediate`, `advanced`) |
| `domain` | Subject domain |
| `prereq` | Prerequisite node title or id |
| `duration` | Estimated study time |
| `mode` | Learning mode |
| `status` | Status flag |

Custom keys (not in the reserved list) are also valid and pass through without validation.

Tag rules:
- Normalized to lowercase.
- Valid characters: letters, digits, `_`, `-`.
- Duplicates are silently deduplicated.
- Invalid tokens emit **W008 `tag-syntax`**.

Tags may appear on multiple `#` lines; all are merged into the node's tag list.

---

### Edges and CAST

An edge from the current node to another is declared with `>`:

```text
>Gravity 1110
>Newton's Laws 0010
```

Format: `>TargetTitle` optionally followed by a space and a CAST token.

The target is the full title of the destination node (case-sensitive). The CAST token is optional.

**CAST compact format** — a 4-character string over axes `who/how/what/when`. `0` = axis unset; `1`–`4` select the indexed archetype:

| Axis | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| `who` (`ab`) | Giant | Mermaid | Mage | Dragon |
| `how` (`cd`) | Crushing | Flowing | Spreading | Exploding |
| `what` (`ef`) | Rock | Water | Cloud | Lightning |
| `when` (`gh`) | Red cave | Blue ocean | Green sky | Purple storm |

Examples:

| Token | Meaning |
| --- | --- |
| `0000` | No semantic cast |
| `0010` | what: Rock |
| `1110` | who: Giant, how: Crushing, what: Rock |
| `1001` | who: Giant, when: Red cave |

Malformed CAST tokens (wrong length, non-digit characters) emit **E003 `malformed-cast`**.
Unknown edge targets (no matching node title in the file) emit **W007 `unknown-target`**.

**How the token is found.** The parser looks only at the last whitespace-separated token of the line. It is read as a CAST token when it is four digits, as an alias reference when it is `[name]` or a declared alias name (see [Edge Semantic Aliases](#edge-semantic-aliases)), and otherwise the whole line is the target title. Two consequences:

- The CAST token is always the compact four-digit form. Axis names such as `who:Giant how:Crushing` are not edge syntax; `palace cast encode --who Giant --how Crushing` prints the compact token for them, and `palace cast decode 1100` explains one.
- A title whose last word is four digits or a declared alias name cannot be written on an edge line, because that word is taken as the token.

---

### Edge Semantic Aliases

A semantic alias gives a named shorthand for a cast pattern, declared at the top level before any node:

```text
~dep:0001 depends on
~leads:1000 leads to
```

Format: `~<alias>:<cast> [optional description]`

- `alias` — the name used in edges: `>Target dep`
- `cast` — a valid 4-digit CAST token
- `description` — optional human-readable description of the relationship

An edge can refer to an alias in three forms, all in the token position at the end of the line:

| Form | Example | `semantic.form` | Notes |
| --- | --- | --- | --- |
| Bare word | `>Single Responsibility Forge dep` | `"alias"` | Only recognised when `dep` is declared; an undeclared last word is part of the target title (`>Single Responsibility Forge notes` targets "Single Responsibility Forge notes"). |
| Bracketed | `>Single Responsibility Forge [dep]` | `"bracketed"` | Always read as an alias. Undeclared → **W305**. Use this form when a title could be confused with an alias. |
| Hybrid | `>Single Responsibility Forge 0001:dep` | `"hybrid"` | Explicit CAST token plus alias, joined by `:`. If the alias is declared with a different cast → **E304**. |

The edge's `semantic` field records the alias name, the form, and the `resolvedCast`; the edge's `cast` is the resolved token. Aliases are case-insensitive and stored lowercase.

Alias diagnostic codes:
- **E301 `alias-malformed`** — line doesn't parse as `~alias:cast`
- **E302 `alias-invalid-cast`** — cast portion is not a valid 4-digit token
- **E303 `alias-duplicate`** — same alias name declared twice (the second declaration is ignored, whatever its cast)
- **E304 `alias-cast-conflict`** — hybrid edge `CAST:alias` whose explicit token differs from the alias's declared cast
- **W305 `alias-unresolved`** — alias used in an edge but not declared

---

### Portals

A portal node contains an `@portal` line that links it to another palace or a specific route/node within one:

```text
Gateway
: Entry to the inner palace
@portal /palaces/inner

Detailed Portal
: Opens at a specific route and node
@portal /palaces/inner#fast-walk@start
```

Portal target format:

```text
/palaces/<name>[#<routeId>[@<nodeId>]]
```

- `/palaces/inner` — opens the palace at its default entry
- `/palaces/inner#fast-walk` — opens a specific route
- `/palaces/inner#fast-walk@start` — opens a route at a specific node

Malformed portal targets emit **E005 `invalid-portal-target`**.

A node with a valid `@portal` line gets `kind: "portal"` in the snapshot; all other nodes have `kind: "memory"`.

---

## Routes

A route declares an ordered sequence of nodes (loci) for a walk session:

```text
/SOLID Main Route
1 Gate of SOLID
2 Single Responsibility Forge
3 Open Closed Library
```

The route name follows `/` (spaces allowed, no quotes). Locus steps are `N Title` (1-indexed number, space, node title). The number determines display order only; the parser uses declaration order for `loci[]`.

Unknown locus titles emit **W007 `unknown-target`**.
Malformed locus lines (missing number or title) emit **E004 `malformed-route-locus`**.

Multiple routes per file are supported.

---

### Route Metadata

Structured tags may appear immediately after a route header, before the first locus step:

```text
/Advanced Walk
#difficulty:advanced #prereq:Gate of SOLID
1 Single Responsibility Forge
2 Open Closed Library
```

Route metadata tags use the same `#key:value` syntax as node tags. They appear in the route's `metadata` array on the snapshot. The `prereq` key is validated against known node titles; unresolved values emit **W701 `route-prereq-unresolved`**.

---

## Import System

A file can import another DSL file and reference its nodes under a namespace prefix:

```text
!import security.dsl as sec
!import shared/foundations.dsl as base
```

Format: `!import <path> as <namespace>`

- `path` — relative or absolute path to the imported DSL file
- `namespace` — a short identifier used to qualify refs from that file

Imports appear at the top level (before or after the palace header). The namespace can be used in inline references: `{#sec:auth-node}`.

Diagnostic codes:
- **E401 `import-malformed`** — line doesn't parse as `!import … as …`
- **E402 `import-namespace-collision`** — two imports declare the same namespace

---

## Query Language

Queries declare traversal or filter operations over the palace graph. They begin with `?`:

```text
?all
?tag difficulty:beginner
?node Gate of SOLID
?neighbors Gate of SOLID
?route SOLID Main Route
?depends Single Responsibility Forge
?path Gate of SOLID Dependency Tower
?filter #domain:auth
```

Format: `?<verb> [args]`

**Scope** — a query appearing before the `@<name>` palace header has scope `"document"`; one appearing after has scope `"palace"`.

### Verbs

| Verb | Args | Description |
| --- | --- | --- |
| `all` | _(none)_ | Return all nodes in the palace |
| `tag` | `key:value` or `plain` | Nodes matching the tag |
| `node` | Node title or id | Single node by title/id |
| `neighbors` | Node title or id | Direct neighbors of a node |
| `route` | Route name | Nodes in the named route |
| `depends` | Node title or id | Transitive dependency subgraph |
| `path` | `<from> <to>` | Shortest path between two nodes |
| `filter` | Tag expression | Filtered node set |

The `?path` verb takes exactly two node references. Titles may contain spaces, so the parser tries every boundary between words and keeps the one where both sides are a known title or implicit id (`?path Gate of SOLID Dependency Tower` resolves to "Gate of SOLID" and "Dependency Tower"). Wrap a reference in double quotes to fix the boundary yourself (`?path "Gate of SOLID" dependency-tower`). Fewer than two references emits **E802 `query-path-missing-arg`**; more than one boundary resolving on both sides emits **W805 `query-path-ambiguous`** and the first is kept; a side that never resolves emits **W803**.

Diagnostic codes:
- **E801 `query-verb-unknown`** — verb is not in the recognised set
- **E802 `query-path-missing-arg`** — `?path` missing one of its two arguments
- **W803 `query-unresolved-node`** — node-targeting verb references an unknown node
- **W804 `query-unresolved-route`** — `?route` references an unknown route
- **W805 `query-path-ambiguous`** — `?path` splits into known nodes at more than one boundary; quote a reference

---

## Comments

Lines beginning with `--` are silently ignored:

```text
-- This is a comment
-- Author: David, 2026-04
```

---

## Diagnostic System

The parser emits structured diagnostics with numeric codes. Every diagnostic carries:

| Field | Type | Description |
| --- | --- | --- |
| `code` | `DslDiagnosticCode` | Symbolic code string |
| `numericCode` | `string` | Numeric identifier from the formal registry |
| `severity` | `"error" \| "warning" \| "info" \| "hint"` | Severity level |
| `line` | `number` | 1-indexed source line |
| `column` | `number` | 1-indexed byte offset within the line |
| `length` | `number` | Byte span of the offending text |
| `message` | `string` | Human-readable description |
| `related` | `SourcePosition[]` | Positions of related constructs (e.g. first occurrence for duplicates) |
| `fix` | `SuggestedFix \| null` | Machine-applicable correction, when available |

### Full Diagnostic Registry

| Numeric | Symbolic | Severity | Description |
| --- | --- | --- | --- |
| E001 | `missing-palace-header` | error | File has content but no `@<name>` line |
| E002 | `duplicate-title` | error | Two nodes share the same title |
| E003 | `malformed-cast` | error | CAST token is not 4 valid digits |
| E004 | `malformed-route-locus` | error | Route step line is malformed |
| E005 | `invalid-portal-target` | error | `@portal` path doesn't parse |
| E006 | `misplaced-line` | error | Line appears outside valid context |
| W007 | `unknown-target` | warning | Edge or route step targets an undeclared node |
| W008 | `tag-syntax` | warning | Tag token contains invalid characters |
| E101 | `malformed-node-id` | error | `[id]` contains invalid characters |
| E102 | `duplicate-node-id` | error | Same explicit id declared on two nodes |
| E103 | `reserved-node-id` | error | `[palace]` is a reserved identifier |
| E201 | `inline-ref-unclosed` | error | `{…}` reference was never closed |
| E202 | `inline-ref-unresolved-id` | error | `{#id}` references an unknown id |
| W203 | `inline-ref-unresolved-title` | warning | `{@title}` references an unknown title |
| W204 | `inline-ref-unresolved-alias` | warning | `{~alias}` references an undeclared alias |
| W205 | `inline-ref-self` | warning | Inline reference targets the containing node |
| E301 | `alias-malformed` | error | `~` line doesn't parse as `~alias:cast` |
| E302 | `alias-invalid-cast` | error | Cast in alias declaration is not valid |
| E303 | `alias-duplicate` | error | Alias name declared more than once |
| E304 | `alias-cast-conflict` | error | Hybrid edge `CAST:alias` disagrees with the alias's declared cast |
| W305 | `alias-unresolved` | warning | Alias used in edge but not declared |
| E401 | `import-malformed` | error | `!import` line doesn't parse |
| E402 | `import-namespace-collision` | error | Two imports use the same namespace |
| W701 | `route-prereq-unresolved` | warning | `#prereq` value is not a known node |
| E801 | `query-verb-unknown` | error | Query verb is not in the recognised set |
| E802 | `query-path-missing-arg` | error | `?path` requires two node references |
| W803 | `query-unresolved-node` | warning | Query references an unknown node |
| W804 | `query-unresolved-route` | warning | `?route` references an unknown route |
| W805 | `query-path-ambiguous` | warning | `?path` resolves at more than one word boundary |

### Suggested Fixes

Some errors include a machine-applicable fix:

```typescript
interface SuggestedFix {
  description: string;
  replacement: string;       // text to substitute for the offending span
  position: { line, column, length };
}
```

Currently emitted by:

- **E103 `reserved-node-id`** — fix removes the `[palace]` bracket, leaving the bare title.

---

## Canonical AST

After parsing, the result can be converted to a canonical, implementation-neutral `Document` AST via `toAst()`:

```typescript
import { parseDsl } from "./parser";
import { toAst } from "./toAst";

const result = parseDsl(source, { file: "mechanics.dsl", sourceText: source });
const doc = toAst(result, { file: "mechanics.dsl", sourceText: source });
```

### Document root

```typescript
interface Document {
  type: "Document";
  version: "2.0";
  source: SourceInfo;
  imports: AstImportDeclaration[];
  aliases: AstAliasDeclaration[];
  palace: AstPalaceDeclaration | null;
  nodes: AstNodeDeclaration[];
  routes: AstRouteDeclaration[];
  queries: AstQueryDeclaration[];
  diagnostics: AstDiagnostic[];
  metadata: DocumentMetadata;  // normalizedAt + canonicalHash, null before normalization
}
```

All positions in the AST are 1-indexed `{ file, line, column, length }`. The Document is fully JSON-serializable without data loss.

### Key node shape

```typescript
interface AstNodeDeclaration {
  type: "NodeDeclaration";
  id: string | null;            // explicit [id], or null
  implicitId: string;           // always-set: explicit id or title-derived slug
  title: string;
  normalizedTitle: string;      // lowercased, whitespace-collapsed
  body: AstBodyLine[];          // parsed body with inline ref segments
  tags: string[];
  structuredTags: AstStructuredTag[];
  edges: AstEdgeDeclaration[];
  portal: { ... } | null;
  kind: "memory" | "portal";
  source: SourcePosition;
}
```

---

## Normalization and Canonical Hash

The async `normalize()` pass produces a deterministic, stable representation of a snapshot:

```typescript
import { normalize } from "./normalize";

const { snapshot, normalizedAt, canonicalHash } = await normalize(parseDsl(src).snapshot);
```

### What the pass does

1. **Tag deduplication and canonical ordering** — per node, tags are deduplicated (case-insensitive) then sorted: reserved-key structured tags (alphabetically) → custom-key structured tags (alphabetically) → plain tags (alphabetically).
2. **Edge ordering** — within each node, edges are sorted by `targetTitle` then by `resolvedCast`, giving a deterministic comparison order.
3. **Node ordering** — nodes are sorted by `implicitId`, making the snapshot order-independent of the source declaration order.
4. **`structuredTags` alignment** — re-sorted to mirror the new tag order.

### Canonical hash invariants

The `canonicalHash` is the SHA-256 (hex) of the canonical JSON payload. It is stable across:

- Whitespace-only edits to the source text
- Reordering of nodes in the source
- Reordering of tags within a node

It changes when any logical content changes (node title, body, tags, edges, routes).

### Hash format

64-character lowercase hex string (SHA-256 via Web Crypto `SubtleCrypto.digest`):

```
a3f2...c9d1   (64 hex chars)
```

### Idempotency

Running `normalize()` twice on the output of the first pass produces the same `snapshot`, `normalizedAt` (new timestamp), and `canonicalHash` (identical).

### Using normalized metadata in the AST

After normalization, feed the result into `toAst()` with the metadata:

```typescript
const { snapshot, normalizedAt, canonicalHash } = await normalize(parseResult.snapshot);
const doc = toAst({ snapshot, diagnostics: parseResult.diagnostics }, options);
// doc.metadata.normalizedAt and doc.metadata.canonicalHash are populated
// by the caller after merging — or use toAst on the normalized snapshot directly.
```

---

## Related Files

| File | Description |
| --- | --- |
| `src/domain/services/palaceDsl/parser.ts` | FSM-based parser, produces `DslParseResult` |
| `src/domain/services/palaceDsl/types.ts` | All DSL types: `DslSnapshot`, `DslDiagnostic`, etc. |
| `src/domain/services/palaceDsl/diagnosticCodes.ts` | Formal numeric registry mapping symbolic → numeric codes |
| `src/domain/services/palaceDsl/ast.ts` | Canonical AST type definitions (`Document`, `AstNodeDeclaration`, …) |
| `src/domain/services/palaceDsl/toAst.ts` | `toAst()` converter from parse result to Document AST |
| `src/domain/services/palaceDsl/normalize.ts` | `normalize()` — async normalization pass + canonical hash |
| `src/domain/services/palaceDsl/serializer.ts` | Round-trip serializer (snapshot → DSL text) |
| `src/domain/services/palaceDsl/routeSync.ts` | Sync engine applying a parsed snapshot to the graph store |
| `src/domain/services/palaceDsl/fixtures/*.dsl` | Example palace files |
| `extensions/palace-dsl-vscode/` | VSCode language extension (syntax highlighting, diagnostics) |
