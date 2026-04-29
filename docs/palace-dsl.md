# Palace DSL Reference

The palace DSL is a text format for describing a memory palace, its nodes, edges, portal targets, tags, and routes.

It is currently used by the split-pane DSL editor and the DSL import flow.

## Example

```text
@Palace Mechanics
@atlas /science/physics

Newton's Laws
  : fundamental laws of motion
  @portal /palaces/classical
  #fundamental #laws

F = ma
  : Force equals mass x acceleration
  > Newton's Laws  ::0010
  > Gravity        ::1110

Gravity
  : Curvature of spacetime

/Route "First Walk"
  1. Newton's Laws
  2. F = ma
  3. Gravity
```

## Top-Level Structure

Each file can contain:

- One palace header
- An optional atlas path
- Zero or more node blocks
- Zero or more route blocks

Blank lines are ignored.

Comment lines starting with `--` are ignored, including indented comment lines.

## Header

The header is required when the file contains content.

```text
@Palace <name>
```

Example:

```text
@Palace Mechanics
```

If content exists without this header, the parser emits `missing-palace-header`.

## Atlas Path

Use `@atlas` to assign a palace to an atlas path.

```text
@atlas /science/physics
```

If `@atlas` is present with no path, it is treated as empty.

## Nodes

Start a node with a plain top-level title line:

```text
<title>
```

Example:

```text
Gravity
```

Node titles must be unique. Duplicate titles emit `duplicate-title`.

### Content

Add node body lines with `:`.

```text
Gravity
  : Curvature of spacetime
```

Multiple content lines are joined with newlines:

```text
Gravity
  : First line
  : Second line
```

### Portal Nodes

Mark a node as a portal with `@portal`:

```text
Gateway
  @portal /palaces/inner
```

Supported portal target forms:

```text
/palaces/<palace>
/palaces/<palace>#<route>
/palaces/<palace>@<node>
/palaces/<palace>#<route>@<node>
```

Example:

```text
@portal /palaces/inner#fast-walk@start
```

Malformed portal targets emit `invalid-portal-target`.

### Tags

Add tags on an indented line starting with `#`:

```text
Newton's Laws
  #fundamental #laws
```

Rules:

- Tags are normalized to lowercase.
- Valid characters are letters, digits, `_`, and `-`.
- Duplicate tags are ignored.
- Invalid tag tokens emit `tag-syntax` as a warning.

Example:

```text
  #good_tag bad-tag $$$
```

This keeps `good_tag` and `bad-tag`, and warns on `$$$`.

### Edges

Create an outgoing edge with `>`:

```text
F = ma
  > Gravity
```

Edge targets refer to node titles, not ids.

If the target title does not exist, the parser emits `unknown-target`.

#### CAST shorthand

Edges can optionally include a CAST token after `::`:

```text
> Gravity  ::1110
```

The compact token is four digits in `who/how/what/when` order.

- `0` means unset
- `1` through `4` select the indexed value for that axis

Current axis values:

| Axis | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| `who` | `Giant` | `Mermaid` | `Mage` | `Dragon` |
| `how` | `Crushing` | `Flowing` | `Spreading` | `Exploding` |
| `what` | `Rock` | `Water` | `Cloud` | `Lightning` |
| `when` | `Red cave` | `Blue ocean` | `Green sky` | `Purple storm` |

Examples:

- `::0010` = `what:Rock`
- `::1110` = `who:Giant how:Crushing what:Rock`

The parser also accepts named CAST syntax:

```text
> Gravity  ::who:Giant how:Crushing what:Rock
> Gravity  ::when:"Blue ocean"
```

Malformed CAST tokens emit `malformed-cast`.

## Routes

Start a route with:

```text
/Route "First Walk"
```

Add loci as numbered items:

```text
/Route "First Walk"
  1. Newton's Laws
  2. F = ma
  3. Gravity
```

Rules:

- Route loci refer to node titles.
- Unknown titles emit `unknown-target`.
- Malformed numbered items emit `malformed-route-locus`.

## Block Ordering

Headers always come first. Associated lines must follow under the header with indentation.

- Node block order:
  - `Node Title`
  - then indented `:`, `#`, `>`, `@portal`
- Route block order:
  - `/Route "Name"`
  - then indented numbered loci (`1. ...`)

Placing tags/content/edges/loci before their node or route header is invalid.

## Parser Behavior

The parser is intentionally forgiving in a few places:

- Unrecognized top-level lines are ignored.
- Unrecognized indented node attribute lines are ignored.
- Blank lines are ignored.
- Comment lines are ignored.

This means the DSL is fairly resilient while editing, but validation still happens for headers, duplicate titles, edge targets, route targets, CAST tokens, portal targets, and tag syntax.

## Canonical Output Notes

When the app serializes a palace back to DSL, it currently:

- Writes the palace header first
- Writes `@atlas` only when present
- Emits tags in sorted order
- Emits route loci in route order
- Emits edges with a `::` CAST token, even when some axes are unset

## Related Files

- Parser: `src/domain/services/palaceDsl/parser.ts`
- Serializer: `src/domain/services/palaceDsl/serializer.ts`
- Example fixtures: `src/domain/services/palaceDsl/fixtures/*.dsl`
