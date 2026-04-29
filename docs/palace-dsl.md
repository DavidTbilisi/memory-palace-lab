# Palace DSL Reference

The palace DSL is a minimal text format for describing a memory palace — its nodes, edges, portal targets, tags, and routes.

It is used by the split-pane DSL editor and the DSL import flow.

## Grammar

The lexer is deterministic: the first character of each (trimmed) line defines the token type.

| Prefix | Token | Example |
| --- | --- | --- |
| `@atlas` | Atlas path | `@atlas /science/physics` |
| `@portal` | Portal target | `@portal /palaces/inner` |
| `@` | Palace header | `@Mechanics` |
| `:` | Body content | `: fundamental laws of motion` |
| `#` | Tags | `#fundamental #laws` |
| `>` | Edge | `>Gravity 1110` |
| `/` | Route header | `/First Walk` |
| `N ` (digit + space) | Route step | `1 Newton's Laws` |
| `--` | Comment (ignored) | `-- a comment` |
| (blank) | Ignored | |
| (other) | Node title | `Newton's Laws` |

Indentation is optional and ignored by the parser. Parser state (current node or route) determines ownership of content lines.

## Example

```text
@Mechanics
@atlas /science/physics

Newton's Laws
: fundamental laws of motion
@portal /palaces/classical
#fundamental #laws

F = ma
: Force equals mass × acceleration
>Newton's Laws 0010
>Gravity 1110

Gravity
: Curvature of spacetime

/First Walk
1 Newton's Laws
2 F = ma
3 Gravity
```

## Palace Header

Required when the file contains content.

```text
@<name>
```

Multi-word names are supported: `@SOLID Citadel`.

If content exists without a header, the parser emits `missing-palace-header`.

## Atlas Path

```text
@atlas /science/physics
```

## Nodes

A bare line that does not match any other prefix is a node title.

```text
Newton's Laws
```

Node titles must be unique. Duplicates emit `duplicate-title`.

### Body content

```text
: fundamental laws of motion
```

Multiple `:` lines are joined with newlines.

### Tags

```text
#fundamental #laws
```

- Normalized to lowercase
- Valid characters: letters, digits, `_`, `-`
- Duplicates ignored; invalid tokens emit `tag-syntax` warning

### Edges

```text
>Gravity 1110
```

Format: `>TargetTitle CAST` where CAST is an optional 4-digit shorthand.

The CAST compact token uses `who/how/what/when` axis order. `0` = unset, `1`–`4` select the indexed value.

| Axis | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| `who` | `Giant` | `Mermaid` | `Mage` | `Dragon` |
| `how` | `Crushing` | `Flowing` | `Spreading` | `Exploding` |
| `what` | `Rock` | `Water` | `Cloud` | `Lightning` |
| `when` | `Red cave` | `Blue ocean` | `Green sky` | `Purple storm` |

Examples: `0010` = `what:Rock`, `1110` = `who:Giant how:Crushing what:Rock`

Malformed CAST tokens emit `malformed-cast`. Unknown edge targets emit `unknown-target`.

### Portals

```text
@portal /palaces/inner
@portal /palaces/inner#fast-walk@start
```

Malformed portal targets emit `invalid-portal-target`.

## Routes

```text
/First Walk
1 Newton's Laws
2 F = ma
3 Gravity
```

Route names follow `/` (no quotes, spaces allowed). Steps are `N Title` (number + space + title, no dot).

Unknown step titles emit `unknown-target`.

## Related Files

- Parser: `src/domain/services/palaceDsl/parser.ts`
- Serializer: `src/domain/services/palaceDsl/serializer.ts`
- Fixtures: `src/domain/services/palaceDsl/fixtures/*.dsl`
- VSCode extension: `extensions/palace-dsl-vscode/`
