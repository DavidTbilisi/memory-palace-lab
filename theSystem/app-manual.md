# Memory Palace App — Manual

This file covers **how the software works**, not the mnemonic theory. For theory see `mind-palace.md`, `cast-system.md`, `retrieval-protocol.md`.

---

## Core concepts

| Term | What it is in the app |
|------|-----------------------|
| **Palace** | A canvas workspace. One coherent place — nodes, edges, and routes all live here. |
| **Node** | A rectangle on the canvas. Stores a title and content (your encoded memory). |
| **Edge** | A directed arrow between two nodes. Carries a CAST label (verb + 4-dimensional encoding). |
| **Portal** | A special yellow node that links to another palace. Clicking it on canvas jumps you there. |
| **Route** | An ordered list of nodes within a palace — the walk sequence used for review. |
| **Locus** | One stop on a route. Carries spaced-repetition scheduling data. |
| **Atlas path** | A slash-separated label on a palace (e.g. `Medicine/Anatomy/Skull`). Groups palaces in the sidebar tree. Nothing more. |

---

## Atlas path

`atlasPath` is just a string prefix. `Medicine/Anatomy/Skull` means:

- **Domain:** Medicine
- **Place:** Anatomy
- **Section:** Skull

The sidebar and Atlas outline split on `/` and build a collapsible tree. There is no real hierarchy object — two palaces that share a prefix simply appear under the same tree node. Changing the prefix moves the palace in the tree instantly.

Leave it blank if you don't need grouping.

---

## Toolbar modes

| Mode | What happens on click |
|------|-----------------------|
| **Select** (default) | Click to select a node or edge; drag to pan. |
| **Connect** | Step 1: click source node (locks it, glows). Step 2: click target node → CAST edge dialog opens. |
| **Route** | Click nodes in order to append them to the active route. |

Double-click empty canvas → creates a new node at that position.

---

## Creating content

**New palace** — sidebar → type name → Enter. Optionally set an atlas path (`Domain/Place/Section`).

**New node** — double-click empty canvas space.

**New edge** — switch to Connect mode (toolbar), click source node, click target node. The CAST dialog opens:
- *Tier 1*: pick a plain verb (links, triggers, feeds, blocks…).
- *Tier 2*: full CAST encoding — four dropdowns (AB, CD, EF, GH).

**New portal** — create a node, open the Node Inspector (right panel), set Kind → Portal, then pick the target palace (and optionally a route + node within it).

**New route** — Routes panel → New route → switch to Route mode → click nodes in walk order.

---

## Atlas graph view

Atlas tab → Graph button shows all palaces as circles with directed edges for portal connections.

- **Color** = atlas depth (violet = level 1, blue = level 2, sky = level 3, zinc = no path).
- **Badge** (top-right of circle) = node count in that palace.
- **Violet ring** = currently open palace.
- **Drag** any circle to reposition it.
- **Click** a circle to open that palace.
- Edges are drawn only where a portal node in one palace points to another.

---

## Review (walk mode)

Routes tab → select a route → Start walk.

- Cards show the node title as cue; reveal shows content.
- Rate: Again / Hard / Good / Easy → updates the locus interval (spaced repetition).
- Recall mode hides the canvas node label until you reveal.
- Walk summary shows per-rating counts and retention trend after completing the route.

---

## Persistence

Changes auto-save as a draft every few seconds (shown in toolbar as a dot indicator). Use the **Checkpoint** button to create a named save point. The app warns if unsaved draft differs from the last checkpoint.

---

## Related files

- `mind-palace.md` — when and how to build a palace (method of loci theory)
- `cast-system.md` — CAST edge encoding (AB/CD/EF/GH dimensions)
- `retrieval-protocol.md` — timed walks, cadence, weak-link repair
- `onboarding-path.md` — what to learn first and in what order
