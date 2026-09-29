# Changelog

## v0.22.0 — 2026-09-29

### Memory strength

- **A Strength tab in Insights.** Beside Analytics and Difficulty, **Strength** shows what is weak and what to review next. Only daily (Siege) reviews count; Storm reviews and draft routes are left out.
- **Needs attention.** Up to 8 stops, weakest first, each marked Critical, Weak, Stable or Strong. A stop with NEDF cards is as strong as its weakest card, and a stop due for a day or more counts as overdue. Click a stop to start a review at it.
- **Palace health.** Each palace gets a health score, its due, overdue and weak stops, its own trend, and its weakest stop. Click a palace to open it.
- **Trend.** A 7-day chart of recall, and whether it is improving, stagnating or decaying: the last three days you reviewed against the three before them.
- **Route friction.** Routes that are hard to walk are marked **Unstable** or **Cognitively expensive**, with the reasons in plain words, such as "33% of recalls failed" or "slow to recall". Click a route to walk it.

### Confusion pairs

- **Link look-alike nodes.** Two concepts you keep mixing up can be linked as a confusion: **Mark as confusion** when connecting them, or **Confused with…** in a node's Distinguisher. A confusion link is drawn as a dashed amber line. It is not a relationship between the ideas, so Difficulty and graph analysis leave it out.
- **A real discrimination card.** When a node has a confusion link, its Distinguisher card asks **"Which is it: A or B? Say why."**
- **Say why you missed.** After you rate a recall **Again**, the walk moves on as before and a strip asks what happened: **Mixed it up with…** another node, or **Couldn't produce it**. The first time you log a pair, the app offers to link them.
- **Mix-ups come back sooner.** Logging a mix-up makes both nodes' Distinguisher cards due now, so you drill telling them apart while it matters. If a node has no Distinguisher yet, the app says so.
- **Confusion hotspots.** The Strength tab lists the pairs you mix up most. Click one to review its Distinguisher.
- **In the DSL and MCP.** A `<>Neighbour` line under a node declares a confusion link. An empty or self link is error E161, a pair declared twice is warning W162, and an unknown node is warning W163. The MCP edge tools take `kind: "confusion"`, and `node_get` lists a node's `confusedWith`.

### Note for sync

- If you sync with a device that is still on v0.21 or older, update it too. An older version draws confusion links as ordinary arrows and counts them in Difficulty and graph analysis. The link type is kept on the canvas, so the links come back as confusion links once a device on v0.22 opens the palace.

## v0.21.0 — 2026-09-29

### Concept glyphs

- **One symbol per concept.** Give a node a concept glyph, one emoji or character that stands for that concept and nothing else in the palace. Set it in the inspector, under the title. Renaming the node or rewriting its content keeps the glyph.
- **No two concepts share a mark.** A glyph another node in the palace already holds is refused, and the inspector names that node, such as **🔦 is already Attention Framework's concept glyph.**
- **Changing it is deliberate.** Once a node has a glyph, you change it with **Change glyph**, and the inspector reminds you that a new mark reads as a new concept. **Remove** clears it.
- **See it on the canvas.** The glyph sits in a chip above its node. Zoom out far enough that the labels disappear and the glyph fills the node instead, so the palace still reads at a glance.
- **Glyphs from the wiki.** Wiki concept pages carry a glyph. **Add as node** from the Library gives the new node that glyph, unless the palace already uses it; then the node is added without it and the inspector says why.
- **In the DSL and MCP.** Write `@glyph 🔦` under a node in the Palace DSL. An invalid glyph is error E151, and a glyph used twice is warning W152, with the first node keeping it. The MCP node tools read and set `glyph`, and `null` clears it.

### Fixes

- A Library document opened a second time no longer stays stuck on **Loading document**.

### Note for sync

- If you sync with a device that is still on v0.20 or older, update it too. An older version does not know about glyphs, so once it saves a palace and that sync reaches your other devices, the palace's glyphs are gone. The nodes themselves are kept.

## v0.20.0 — 2026-09-28

### Generated loci stores

- **Palaces that lay themselves out.** A store is a palace the app builds for you, whose cells you find by address instead of walking to them. Choose **Generate store** in the sidebar. The app makes the structure and the addresses; every image in it is yours, starting as a placeholder you rename.
- **Four-level block.** Give a theme and get a block: the theme, 5 branches of 5 stickers, and 125 cells addressed **1.1.1** to **5.5.5**, with each sticker's five cells stacked under it and arrows keeping each branch in order. Rename the stickers to your own images and fill the cells; a cell keeps its address whatever you put in it. The block also gets a route in address order, hidden and not in review until you turn it on.
- **Table of support images.** Grow a table from your two-digit number images, one number at a time. **Add number** asks for your image for the number, three images that come to mind one from the next, and three parts of each. The nine parts become cells **47.1** to **47.9**, and each number takes its place on a 10 × 10 grid by its digits. Type a number the table already holds to edit it.
- **Go to address.** In a store, the toolbar has a **Go to address** box: type **2.3.4** in a block, or **47.3** in a table, and the canvas jumps straight to that cell. Spaces or no dots work too, such as **3 2 4** or **473**. The command palette also finds cells by address.
- **Stores look different.** A store has a **Store** badge in the sidebar and is drawn as a dashed square on the atlas map, so it isn't mistaken for a palace you walk. Selecting a store node shows its address in the inspector.
- **Nothing you stored is overwritten without asking.** The store panel shows how many cells you have filled. **Regenerate** on a block puts every node back in its place and redraws any you deleted. Editing a number rewrites its cluster. Either way, if a node holds your material, the app asks first: keep it, or replace it. Undo reverses both.

### Note for sync

- If you sync with a device that is still on v0.19 or older, update it too. An older version does not know about stores, so once it saves a store and that sync reaches your other devices, the store becomes an ordinary palace: its badge, panel and **Go to address** disappear. Its nodes and their content are kept.

## v0.19.0 — 2026-09-28

### Storm sessions

- **Run a Storm.** The daily reviews are the slow, steady part of learning, the Siege. A Storm is the other part: one big push of new material. Start one from the Review page with a target, typed in or picked from presets (100, 200, 400, 700, 1000). The app remembers your last target. The Storm runs in the open palace, on a new route of its own, such as **Storm · 28 Sep**.
- **Follow it on the canvas.** While a Storm runs, a bar above the canvas shows how many new nodes you have encoded against the target, a progress bar, your active time and, after the first minute, your rate per hour. Active time leaves out the time you were away. **Stop** ends the Storm early.
- **Everything you encode goes into the review queue.** Each new node you encode becomes the next stop on the Storm's route. Its first review is due at your wake time after the next night, not 24 hours later, so you sleep on it before it is tested. A node encoded late in the evening, or after midnight, is due that same morning. Set your wake time in **Settings › Review**. It defaults to 07:00.
- **See how it went.** When the Storm reaches its target or you stop it, a summary shows what you encoded against the target, your active time and rate, and when the stops are first due. **Personal best** is marked when you beat every earlier Storm.

### Keeping Storm and daily reviews apart

- **The daily goal and streak count daily reviews only.** A burst of reviews during a Storm no longer meets the goal or keeps a streak by itself. When there were Storm reviews today, the Review page says how many were left out.
- **Retention by phase.** In Insights, the retention chart and heatmap can show **Siege and Storm**, **Siege only** or **Storm only**.
- **Storm records.** A new card in Insights shows the most you have encoded in a Storm, your fastest rate, and your last five Storms.
- **Speed bands leave Storms out.** The Fast / Typical / Slow bands describe your ordinary encoding, so encodes made during a Storm, which is fast on purpose, don't shift them.
- **METER.** A finished Storm is sent to METER as an encoding event, `palace.storm_completed`, counting the nodes encoded.

### Note for sync

- If you sync with a device that is still on v0.18 or older, update it too. An older version does not know Storm events, so it counts Storm reviews toward the daily goal and streak, and it shows no Storm records.

## v0.18.0 — 2026-09-27

### Attribute channels

- **Give a node attributes, one per channel.** A node's inspector has a new **Attributes** section. Each attribute has a name, its values, and one of seven channels: **Spatial** (where is it?), **Sensory** (how does it feel?), **State** (what condition is it in?), **Relation** (what does it connect to?), **Pattern** (what larger structure does it resemble?), **Temporal** (when does it happen?) and **Priority** (how important is it?).
- **Two attributes on one channel are flagged.** If two attributes answer the same question, one of them is on the wrong channel, so the inspector points it out. Several values of one attribute are fine. Using more than four channels on one node gets a gentle note, since a scene is easiest to recall with three or four.
- **Choose how to remember several values.** Once an attribute has more than one value, the inspector asks "Will anything ever ask you for all of them?":
  - **Dissolve** is for when you never need the whole set. **Split into separate nodes** turns each value into its own linked node, and one undo puts it back.
  - **Address** is for when a small, ordered key picks the value, like a row in a table.
  - **Enumerate** is for when you will be asked for the whole set. It keeps a count, and the inspector warns if the values don't add up to it.
- **Attributes in the DSL.** Under a node, `@A spatial where: north tower` writes an attribute, and `@A temporal days [enumerate 3]: Mon | Wed | Fri` gives it a route and a count. Exporting a palace writes them back. Problems show as warnings W123–W127. Applying DSL takes the attributes from the text, so a node written without `@A` lines has its attributes cleared, as with `@image`.
- **Attributes over MCP.** `node_create` and `node_update` take an `attributes` list, and `node_get` returns it. Problems such as two attributes on one channel are returned as `attributeWarnings` rather than refused.

### Count-shape layout

- **Lay a set out by its size.** Select a node with two or more outgoing edges, and the inspector's **Count-shape** section asks whether the set is ordered.
  - **Polygon (unordered)** places the linked nodes on the corners of a shape of their own size: two on an axis, three on a triangle, four on a square, up to a ring of seven. If a member goes missing later, its empty corner shows before you read a single label.
  - **Ladder (ordered)** stacks them top to bottom in their current order.
  - One undo puts the nodes back.
- **Above seven, a ladder.** A set of more than seven only offers the ladder. At that size a polygon can no longer be read at a glance, so an empty corner would not show a missing member.
- **Count-shape over MCP.** A new `node_count_shape` tool does the same for a node, with `shape` set to `polygon` or `ladder`.

### Note for sync

- If you sync with a device that is still on v0.17 or older, update it too. An older version drops attributes when it saves a palace, and the next sync removes them on your other devices as well.

## v0.17.0 — 2026-09-26

### Encode speed

- **See how long each encode takes.** The app now times how long you spend building a node or an edge, counting only active time. Any gap with no input counts for at most a minute, and time with the app hidden doesn't count. Changing an existing node or edge is counted as a re-edit, not a new encode. Nodes made several at a time, for example by applying DSL, are not timed.
- **Speed bands.** Once you have 12 timed node encodes, each node is labelled **Fast**, **Typical** or **Slow** compared with your own encodes over the last 90 days. Until then its time is shown without a band. Bands are worked out across all your palaces.
- **Encode time in Difficulty and the inspector.** The Difficulty table has an **Encode** column, such as "38s · Fast", and the node inspector shows the same badge. It's for information only and doesn't change a node's difficulty.
- **Encode speed in Insights.** A new section shows your median encode time for nodes and for edges over the last four weeks, and weekly charts with first encodes and re-edits as separate lines. The charts can also be shown as a table. Until your encodes span four weeks, the section shows how many days it has so far. Recent events lists each encode with its time, such as "new node - 38s".

### Fixes

- **The header no longer covers its own buttons.** In windows up to 1280px wide, including the desktop app's default size, the buttons on the right of the header could sit on top of the page buttons and tabs, so clicking a tab such as Insights › Difficulty could hit the wrong button. Below 1280px those buttons now move to a second row.

## v0.16.0 — 2026-09-25

### NEDF slots

- **Encode a concept four ways.** A node's inspector has a new **NEDF** section with four slots: **Name-hook** (a sound-alike or image), **Essence** (what it does), **Distinguisher** (a question and why it is this concept and not its neighbour), and **Failure** (a scene where it breaks, and the fix). A small square shows at a glance which slots are filled. A pair slot counts only once both halves are written.
- **Each slot has its own review schedule.** Once a stop's node has slots, each filled slot is a separate card. Failing one slot does not reset the others. The inspector shows when each slot is next due.
- **Walks ask one slot per stop.** A walk asks the most overdue slot at each stop, and the walk bar names the kind of card: Recognition, Recall, Discrimination, or Diagnosis. The node stays covered until you reveal the answer. Nodes without slots are walked as before.
- **NEDF in Insights.** A new section shows how often each slot is recalled and lists encoded concepts that still have no Failure slot. Click one to jump to it on the canvas.
- **NEDF in the DSL.** Under a node, `@N`, `@E`, `@D question => reason` and `@F scenario => correction` lines write the slots, and exporting a palace writes them back. A pair with one half missing gets the new warning W009. Applying DSL takes the slots from the text, so a node written without NEDF lines has its slots cleared, as with `@image`.
- **NEDF over MCP.** `node_create` and `node_update` take a `nedf` field (set a slot to `null` to clear it). `node_get` returns the slots and each slot's schedule, and `route_list` returns slot schedules per stop.

### Note for sync

- If you sync with a device that is still on v0.15 or older, update it too. An older version drops NEDF slots and their schedules when it saves a palace, and the next sync removes them on your other devices as well.

## v0.15.0 — 2026-09-25

### Routes

- **Walk a route backwards.** Each route has a walk direction in its menu in the Routes tab: **Forward**, **Reverse**, or **Alternate each walk**. A reverse walk starts at the last stop, the walk bar says **Reverse**, and the arrows on the canvas point back along the route. Alternate switches direction every time you walk the route.
- **Draft routes.** Turn off **Include in review** in a route's menu while you are still building it. The route shows a **Draft** badge, and its stops are never due. Their review history is kept, so turning review back on picks up where they left off.
- **Route notes.** The open route has a notes field, and other route cards show their notes.
- **Sections for long routes.** On a route with more than 12 stops, the divider button on a stop starts a named section there, such as a room or a floor. Stops are grouped under their section in the Routes tab, and the walk bar shows which section you are in.
- **Route settings in the DSL.** On a route's tag line, `#color:`, `#hidden`, `#direction:` and `#review:off` set the route's color, visibility, walk direction and review, and `:` lines before the first stop are its notes. Exporting a palace writes them. Applying DSL now takes these settings from the text, so a route written without `#hidden` is shown again. A tag with a bad value, such as `#direction:up`, gets the new warning W702. `palace fmt` now formats files that have route tags instead of refusing them.
- **Route settings over MCP.** `route_list` returns each route's color, visibility, walk direction, review setting, notes and sections. `route_update` can change any of these as well as the name.

### Note for sync

- If you sync with a device that is still on v0.14 or older, update it too. An older version drops these new route settings when it saves a palace, and the next sync removes them on your other devices as well.

## v0.14.2 — 2026-09-24

### Updates

- **Release notes in Settings too.** When **Check for updates** in Settings › About finds a newer version, that version's release notes now appear under the **Install and restart** button, so you can see what changed before you install. Links in the notes open in your browser.

## v0.14.1 — 2026-09-24

### Updates

- **See what's new before you update.** When an update is available, the banner at the top of the app now has a **What's new** button. It opens that version's release notes, so you can read what changed before pressing **Install & restart**. Links in the notes open in your browser.
- Release notes on GitHub now list what changed in each version, instead of only linking to the changelog.

## v0.14.0 — 2026-09-24

### Sync between devices

- **Keep palaces in step across computers.** Settings has a new Sync card (desktop app only). Pick a folder that your devices share, such as Dropbox, iCloud Drive, Syncthing, or a USB stick. Set a passphrase, name the device, and press **Sync now**. Each device pushes its changes to the folder and pulls in the others'. No server is involved.
- **Everything in the folder is encrypted.** Palaces and images are unreadable without the passphrase. The folder doesn't even reveal which kind of file each image is. The passphrase is never saved, so you type it once each time you open the app.
- **Images travel too.** Palace backgrounds and node images arrive on the other device intact. An image that is used by several palaces is uploaded once.
- **You decide on conflicts.** If a palace changed on two devices, the sync stops before writing anything and asks, palace by palace: **keep mine**, **take theirs**, or **keep both**. Keep both saves the other version as a separate copy.
- **Deleting a palace syncs.** A palace deleted on one device is removed on the others. If it was edited elsewhere in the meantime, you're asked first.
- **Reclaim space.** A separate button deletes images in the folder that no palace uses any more. To stay safe, it skips images added in the last week and won't run while any file in the folder is unreadable or still downloading.

### Fixes

- Settings sections with multi-word titles, such as "METER bridge", now have an accessible name for screen readers.

## v0.13.0 — 2026-09-23

### Palaces

- **Search and collapse the palace list.** The Palaces panel now has a search box (filters by name, alias, or atlas path) and collapse-all/expand-all buttons for the atlas folder tree, so it stays manageable as the list of palaces grows.

### Fixes

- **A stop's saved view could drift off after a fast zoom.** Zooming in or out and immediately clicking a node to add it as a route stop could save a view that was a step behind — the walk would then return to a view that was slightly off-center or zoomed further out than intended. The saved view is now corrected in the moment after it's captured.

## v0.12.0 — 2026-09-21

### Routes

- **Route metadata shows on the route's card.** Tags written under a route in the DSL, such as `#difficulty:advanced #prereq:Gate of SOLID`, now appear as small chips under the route's name in the Routes tab, on every route that has them, so routes can be compared at a glance. Long values are shortened, with the full text on hover. Edit them in the DSL editor.

### Fixes

- The release workflow's final check can now read the draft release it checks; on v0.11.0 it failed for lack of access although the release was complete.

## v0.11.0 — 2026-09-21

### Route metadata is kept

- **Route tags are saved with the route.** Tags you write under a route header in the DSL editor, such as `#difficulty:advanced #prereq:Gate of SOLID`, used to vanish as soon as the editor lost focus. They are now saved with the route, survive a reload, and are written back into the DSL (on one line under the route header). The MCP server's `route_list` returns them too.
- **`#prereq` names a node, as the docs say.** A prerequisite can be a node's title — spaces included, up to the next `#` tag — its `[id]`, or the id made from its title. Route names still work. Before, only route names were accepted and a value stopped at the first space.
- The DSL editor no longer marks `#key:value` tags such as `#difficulty:advanced` as invalid.

### Fixes

- **Save Checkpoint can be clicked in a narrow window.** With the Learn panel open (as it is for a new palace) the toolbar ran on under the storage status button, which took the clicks meant for Save Checkpoint. Button labels now follow the toolbar's own width and the tools wrap when even the icons don't fit.
- **Dialogs stay on top of the canvas controls.** tldraw's menus, tool bar and style panel showed through the app's dialogs and could be clicked through them; the style panel covered the Close button of the CAST quick reference. The canvas now keeps its controls beneath dialogs.
- Releases are built into a single draft: the release workflow could create two drafts for one version and split the installers between them.

## v0.10.0 — 2026-09-21

### Images as nodes

- **An image you insert is a node.** Paste, drop, or add an image to the canvas and it behaves like any other node: connect it to other nodes, give it a title and a description, tag it, add it to routes, and walk it. It is titled after its file name, and the title shows as a caption under the image.
- Images that were already on a canvas can be turned into nodes from the inspector (**Make it a node**). The palace background stays a background.
- The DSL editor and the MCP server treat image nodes like any other node.

## v0.9.1 — 2026-09-19

### Fixes

- **A copy of a node is a node of its own.** Duplicating or pasting a node on the canvas carried the original's identity, so the palace could not be saved at all: saving stopped with "UNIQUE constraint failed: canvas_objects.id" and every later change stayed unsaved too. Copies now get their own identity as they are made, and a palace that already holds copies is put right the next time it is saved, keeping each copy with its own title and content.
- **The Linux AppImage starts on newer systems again.** On Fedora 44 and other systems with Mesa 26, the AppImage's web page process crashed on start. The AppImage now uses the system's copies of the libraries that Mesa loads (`libwayland-client` and some X11 libraries), not the older copies it bundled.

## v0.9.0 — 2026-09-17

### Route builder

- **Build routes by clicking.** Press **Route**, then click nodes in walk order; each click adds the next stop, and a first route is created if the palace has none.
  - Double-clicking empty canvas adds a new node as the next stop.
  - **Add selected** appends the canvas selection in selection order, left to right, top to bottom, or as the shortest walk.
  - A node already on the route is not added again by accident.
- **Each stop keeps a view.** Zoom and pan before clicking a node, and walks return to that view, like the scenes of a film.
  - The camera button in the Route mode banner turns this off.
  - A stop's view can be saved, replaced, or removed later from the Routes tab.
- **Routes tab** beside the node inspector.
  - It lists every route with its color, stop and due counts, and controls to show/hide, walk, rename, reorder, and delete it.
  - Drag stops (or use the arrow keys) to reorder them, give a stop its own label, and undo a removal.
- **Routes on the canvas:** arrows in each route's color with numbered stops. Hidden routes stay off the canvas, and a walk shows only the walked route.
- **Inspector and walk bar.** The node inspector lists a node's routes and can add it to one. The walk bar picks which route to walk.
- **Route data fixes.**
  - Deleting a node removes its stops, and undo brings them back.
  - The desktop app keeps route order after a reload instead of sorting by name.
  - Applying the DSL keeps the active route and a running walk.
  - A node listed twice in a DSL route gets two stops.
  - The last rating of a walk is recorded with its walk session.

### Library, navigation, and settings

- **One Library** (Start here, Guides, Wiki, Glossary, Reference) with a single search, including a mirror of the ~420-page Neural OS wiki. **Encode this** turns any document into a runnable pipeline.
- **Grouped navigation** (Graph, Review, Insights, System, Library) and one **Settings** page: review goal, AI key, idle tips, atlas level names, backup and restore, updates, and the METER bridge.
- **One definition of "due"** now drives the navigation badge, the Review page, Insights, and the Next-up card.

### Cleaner workspace

- **Secondary controls stay out of the way.**
  - One **Storage and save status** button replaces three status popovers.
  - Navigation group labels expand on hover.
  - The version shows when you hover the title.
  - The content formatting bar appears while you edit a node's content.
- **The formatting buttons work.** Bold, Italic, Underline, and the list buttons now format the selection; before, pressing one dropped the selection.

### Learning tools

- **Difficulty** (Insights → Difficulty) estimates the learner-relative cost of each node and each palace: walls, learning order, and what's left to learn. It adds colored badges on the canvas and lets you override a node's estimate.
- **New System pipeline:** How to Learn a Language (12 loci).

### METER bridge

- **Live mirroring.** The desktop app can copy analytics events into METER's `events.jsonl` as they happen (Settings › METER bridge). It is on only when the app was started with `METER_DATA_DIR`, or when a directory is set in Settings.
- **No duplicates.** `palace meter backfill` writes past events with the same ids as the live bridge, so the two never duplicate each other.

### Palace CLI

- **New `palace` command** (`npm run palace -- <cmd>`, or `bin/palace`).
  - It offers the MCP server's database operations on the command line.
  - It also has `lint`, `fmt`, `hash`, and `cast decode | encode | table` for DSL files.
  - See `docs/cli.md`.

### Fixes

- **Background image.** It can now be adjusted, locked, replaced, and removed. Replacing it no longer stacks a second image, and a new background goes behind the graph.
- **DSL editor.** Documents that create nodes apply again.
- **`?path` queries** find multi-word node titles. The new warning W805 flags an ambiguous path; quote the titles to choose.
- **MCP imports.** Palaces imported through MCP now record a `palace_created` event.
- **Import notes.** The placeholders read as examples instead of looking like pasted data.
- **Dropdowns on macOS.** Their text is readable in the macOS app (WebKit).
- **DSL docs.** The Palace DSL reference now describes edge tokens and alias forms the way the parser reads them.

### Database

- **New columns.** On first start, the desktop app adds three database columns: `routes.sort_index`, `routes.settings_json`, and `loci.settings_json`. The MCP server adds them when it opens an older database, and older app versions ignore them.

## v0.8.0 — 2026-06-11

### Self-update

- The desktop app now updates itself: it checks GitHub releases on startup and offers a one-click **Install & restart** when a newer version is published. Updates are cryptographically signed and verified (tauri-plugin-updater).
- This is the first updater-enabled build — installs of v0.8.0 and newer update in-app automatically; v0.7.0 and older need one final manual install.

### Small improvements

- The app version is shown in the header and the Help Center.
- Release/signing flow documented in `docs/releasing.md`.

## v0.7.0 — 2026-06-11

### MCP support (Model Context Protocol)

- **New `memory-palace` MCP server** (`mcp-server/`, run with `npm run mcp`): Claude and other MCP clients can now read, build, and analyze palaces directly.
  - 31 tools: palace/node/edge/route/locus CRUD, `palace_apply_dsl` / `palace_import_dsl`, `graph_analyze` / `graph_crux` / `graph_motifs`, `review_queue`, `analytics_list`, DSL/JSON export.
  - Resources: any palace as DSL (`palace://{id}/dsl`), the DSL spec, and all theSystem memory-science docs.
  - Prompts: `nine-dive-drill`, `comprehension-protocol`, `encoding-assistant`.
  - Writes go through the same canvas-snapshot semantics as the app itself (the row tables are re-derived from the tldraw blob), inside a single SQLite transaction.
- **Live refresh**: the running app watches for external MCP edits and reloads the open palace in place; a conflict banner protects unsaved work. A manual **Refresh** toolbar button uses the same path.
- Project-scoped `.mcp.json` registers both the domain server and the dev-only Tauri debug bridge. Docs in `docs/mcp.md`.

### App improvements

- Node content links are clickable (**Ctrl+click**) and open externally — including `obsidian://` links back to source notes.
- Persistence failures (save/open/create/reload) now show an error banner instead of failing silently; a failed save no longer pretends to be saved.
- Node content HTML is sanitized (DOMPurify) and the webview runs under a Content Security Policy.
- Route deletion asks for confirmation; browser/web mode warns that storage is temporary; the Review tab shows a due-loci badge.
- DSL apply failures surface as diagnostics in the DSL pane.
- AI encoding suggestions use the current Claude model (`claude-sonnet-4-6`).

### Build

- Dev builds link on the windows-gnu toolchain again: the app lib builds as `rlib` only, and the debug bridge plugin is behind an opt-in `mcp-bridge` cargo feature (requires MSVC).
- Dependency security fixes (`npm audit` clean).

## v0.6.0 and earlier

See the [release notes on GitHub](https://github.com/DavidTbilisi/memory-palace-lab/releases).
