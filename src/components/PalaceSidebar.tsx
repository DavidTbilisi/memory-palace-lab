import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { GenerateStoreForm, StoreBadge, StorePanel } from "./GeneratedStore";
import {
  type PalaceTreeDragItem,
  usePalaceTreeDrag,
} from "./hooks/usePalaceTreeDrag";
import { requestNavigation } from "../app/navigationEvents";
import { useValue } from "@tldraw/editor";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Folder,
  FolderMinus,
  FolderPlus,
  Globe,
  Image,
  ImageOff,
  Lock,
  Move,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { Palace } from "../domain/entities/types";
import {
  getBackgroundState,
  removeBackground,
  setBackgroundEditable,
} from "../canvas/backgroundImage";
import { insertBackgroundImageFromFile } from "../canvas/backgroundImageImport";
import {
  composeAtlasPath,
  DEFAULT_ATLAS_LEVEL_LABELS,
  splitAtlasPath,
} from "../domain/services/atlasHierarchy";
import { usePalaceStore } from "../store/palaceStore";
import { AtlasLevelLabelsEditor } from "./AtlasLevelLabelsEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type AtlasTreeNode = {
  key: string;
  /** Atlas path a palace created in this group gets; "" for Ungrouped. */
  path: string;
  label: string;
  children: AtlasTreeNode[];
  palaces: Palace[];
};

/** Groups come from palace atlas paths, plus hand-made groups that may hold no palace yet. */
export function buildAtlasTree(
  palaces: Palace[],
  groupPaths: readonly string[] = [],
): AtlasTreeNode[] {
  type MutableNode = AtlasTreeNode & { childMap: Map<string, MutableNode> };
  const root: MutableNode = {
    key: "root",
    path: "",
    label: "root",
    children: [],
    palaces: [],
    childMap: new Map<string, MutableNode>(),
  };

  const ensureGroup = (segments: string[]) => {
    let cursor = root;
    const path: string[] = [];
    for (const segment of segments) {
      path.push(segment);
      let child = cursor.childMap.get(segment);
      if (!child) {
        child = {
          key: path.join("/"),
          path: path.join("/"),
          label: segment,
          children: [],
          palaces: [],
          childMap: new Map<string, MutableNode>(),
        };
        cursor.childMap.set(segment, child);
      }
      cursor = child;
    }
    return cursor;
  };

  for (const groupPath of groupPaths) ensureGroup(splitAtlasPath(groupPath));
  for (const palace of palaces) {
    ensureGroup(splitAtlasPath(palace.atlasPath)).palaces.push(palace);
  }

  const finalize = (node: MutableNode): AtlasTreeNode => {
    const children = [...node.childMap.values()]
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(finalize);
    const palaces = node.palaces
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      key: node.key,
      path: node.path,
      label: node.label,
      children,
      palaces,
    };
  };

  const finalized = finalize(root);
  const groups = finalized.children;
  if (finalized.palaces.length > 0) {
    groups.unshift({
      key: "ungrouped",
      path: "",
      label: "Ungrouped",
      children: [],
      palaces: finalized.palaces,
    });
  }
  return groups;
}

// Each palace keeps its full atlasPath regardless of tree depth, so matching
// against it (not just the branch label) is enough to find palaces nested
// under a folder even when the folder name itself doesn't match.
function matchesQuery(palace: Palace, query: string): boolean {
  return (
    palace.name.toLowerCase().includes(query) ||
    (palace.alias?.toLowerCase().includes(query) ?? false) ||
    (palace.atlasPath?.toLowerCase().includes(query) ?? false)
  );
}

function filterAtlasTree(
  nodes: AtlasTreeNode[],
  query: string,
): AtlasTreeNode[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return nodes;
  const filterNode = (node: AtlasTreeNode): AtlasTreeNode | null => {
    const children = node.children
      .map(filterNode)
      .filter((child): child is AtlasTreeNode => child !== null);
    const palaces = node.palaces.filter((palace) =>
      matchesQuery(palace, trimmed),
    );
    if (children.length === 0 && palaces.length === 0) return null;
    return { ...node, children, palaces };
  };
  return nodes
    .map(filterNode)
    .filter((node): node is AtlasTreeNode => node !== null);
}

function collectBranchKeys(nodes: AtlasTreeNode[]): string[] {
  const keys: string[] = [];
  const walk = (list: AtlasTreeNode[]) => {
    for (const node of list) {
      keys.push(node.key);
      walk(node.children);
    }
  };
  walk(nodes);
  return keys;
}

function countPalaces(node: AtlasTreeNode): number {
  return node.children.reduce(
    (total, child) => total + countPalaces(child),
    node.palaces.length,
  );
}

type SidebarDraft = { kind: "palace" | "group"; parentPath: string };

const menuContentClass =
  "z-50 min-w-[10rem] rounded-md border border-zinc-700 bg-zinc-950 p-1 text-xs text-zinc-200 shadow-[0_12px_32px_rgba(0,0,0,0.5)]";
const menuItemClass =
  "flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 outline-none data-[disabled]:cursor-default data-[disabled]:opacity-40 data-[highlighted]:bg-zinc-800";

/** Right-click menu for the palace list, like a file tree's New File / New Folder. */
function CreateContextMenu({
  label,
  children,
  onCreate,
  removeGroup,
}: {
  label: string;
  children: ReactNode;
  onCreate: (kind: SidebarDraft["kind"]) => void;
  removeGroup?: { enabled: boolean; onSelect: () => void };
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          aria-label={label}
          className={menuContentClass}
          // The new-name input takes focus; do not hand it back to the trigger.
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <ContextMenu.Item
            className={menuItemClass}
            onSelect={() => onCreate("palace")}
          >
            <Plus className="h-3.5 w-3.5" />
            New palace…
          </ContextMenu.Item>
          <ContextMenu.Item
            className={menuItemClass}
            onSelect={() => onCreate("group")}
          >
            <FolderPlus className="h-3.5 w-3.5" />
            New group…
          </ContextMenu.Item>
          {removeGroup ? (
            <>
              <ContextMenu.Separator className="my-1 h-px bg-zinc-800" />
              <ContextMenu.Item
                className={menuItemClass}
                disabled={!removeGroup.enabled}
                onSelect={removeGroup.onSelect}
              >
                <FolderMinus className="h-3.5 w-3.5" />
                {removeGroup.enabled
                  ? "Remove group"
                  : "Remove group (not empty)"}
              </ContextMenu.Item>
            </>
          ) : null}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

/** Inline name field for a new palace or group; Enter or leaving the field creates it, Escape cancels. */
function DraftNameInput({
  draft,
  onCommit,
  onCancel,
}: {
  draft: SidebarDraft;
  onCommit: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const finished = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // The context menu that opened this field still traps focus while it
    // closes, so autoFocus would be lost; focus once it has let go.
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);
  const finish = (commit: boolean) => {
    if (finished.current) return;
    finished.current = true;
    if (commit && value.trim()) onCommit(value.trim());
    else onCancel();
  };
  const isGroup = draft.kind === "group";
  return (
    <div className="flex items-center gap-1.5 px-1">
      {isGroup ? (
        <Folder className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
      ) : (
        <Plus className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
      )}
      <Input
        ref={inputRef}
        aria-label={isGroup ? "New group name" : "New palace name"}
        placeholder={isGroup ? "Group name (a/b nests)" : "Palace name"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => finish(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") finish(true);
          if (e.key === "Escape") {
            e.preventDefault();
            finish(false);
          }
        }}
        className="h-7 text-xs"
      />
    </div>
  );
}

type AtlasTreeControls = {
  currentPalaceId: string | null;
  onOpen: (palaceId: string) => void;
  collapsed: ReadonlySet<string>;
  onToggle: (key: string, open: boolean) => void;
  draft: SidebarDraft | null;
  onStartDraft: (draft: SidebarDraft) => void;
  onCommitDraft: (name: string) => void;
  onCancelDraft: () => void;
  onRemoveGroup: (path: string) => void;
  dragging: PalaceTreeDragItem | null;
  /** Group path under the pointer that the dragged item would move into. */
  dropPath: string | null;
  startDrag: (event: ReactPointerEvent, item: PalaceTreeDragItem) => void;
};

const dropTargetClass = "bg-violet-500/10 ring-1 ring-violet-500/50";

function PalaceListItem({
  palace,
  tree,
}: {
  palace: Palace;
  tree: AtlasTreeControls;
}) {
  const active = tree.currentPalaceId === palace.id;
  const groupPath = composeAtlasPath(splitAtlasPath(palace.atlasPath));
  const beingDragged =
    tree.dragging?.kind === "palace" && tree.dragging.palaceId === palace.id;
  return (
    <CreateContextMenu
      label={`${palace.name} actions`}
      // New items land beside this palace, in the group it belongs to.
      onCreate={(kind) => tree.onStartDraft({ kind, parentPath: groupPath })}
    >
      <button
        type="button"
        onClick={() => tree.onOpen(palace.id)}
        onPointerDown={(e) =>
          tree.startDrag(e, {
            kind: "palace",
            palaceId: palace.id,
            fromPath: groupPath,
            label: palace.name,
          })
        }
        className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          active
            ? "bg-violet-900/40 text-violet-100"
            : "text-zinc-300 hover:bg-zinc-900"
        } ${beingDragged ? "opacity-40" : ""}`}
      >
        <div>
          {palace.name}
          <StoreBadge storeJson={palace.storeJson} />
        </div>
        {palace.alias?.trim() ? (
          <div className="text-[11px] text-violet-300">
            Alias: {palace.alias}
          </div>
        ) : null}
        {palace.atlasPath?.trim() ? (
          <div className="text-[11px] text-zinc-500">{palace.atlasPath}</div>
        ) : null}
      </button>
    </CreateContextMenu>
  );
}

function formatTrashLabel(palace: Palace) {
  if (!palace.purgeAt) return "Scheduled for permanent deletion";
  return `Purges on ${new Date(palace.purgeAt).toLocaleDateString()}`;
}

function AtlasBranch({
  node,
  tree,
}: {
  node: AtlasTreeNode;
  tree: AtlasTreeControls;
}) {
  // Ungrouped shares the root path, so its drafts show at the top of the list instead.
  const draftHere =
    tree.draft && node.path !== "" && tree.draft.parentPath === node.path
      ? tree.draft
      : null;
  const isOpen = !tree.collapsed.has(node.key);
  const beingDragged =
    tree.dragging?.kind === "group" && tree.dragging.path === node.path;
  return (
    <details
      open={isOpen}
      onToggle={(event) => {
        // Native <details> fires this for both a summary click and our
        // programmatic `open` changes; only react when it actually flipped,
        // so "Collapse/expand all" (which re-renders with a new `open`) does not
        // bounce straight back via a stale toggle.
        if (event.currentTarget.open === isOpen) return;
        tree.onToggle(node.key, event.currentTarget.open);
      }}
      data-drop-path={node.path}
      className={`rounded-md ${tree.dropPath === node.path ? dropTargetClass : ""} ${
        beingDragged ? "opacity-40" : ""
      }`}
    >
      <CreateContextMenu
        label={`${node.label} group actions`}
        onCreate={(kind) => tree.onStartDraft({ kind, parentPath: node.path })}
        removeGroup={
          node.path
            ? {
                enabled: countPalaces(node) === 0,
                onSelect: () => tree.onRemoveGroup(node.path),
              }
            : undefined
        }
      >
        <summary
          // Ungrouped is not a real group, so it cannot be moved.
          onPointerDown={(e) => {
            if (node.path)
              tree.startDrag(e, {
                kind: "group",
                path: node.path,
                label: node.label,
              });
          }}
          className="cursor-pointer select-none rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:bg-zinc-900"
        >
          {node.label}
        </summary>
      </CreateContextMenu>
      <div className="ml-2 mt-0.5 space-y-0.5 border-l border-zinc-800 pl-2">
        {draftHere ? (
          <DraftNameInput
            key={`${draftHere.kind}:${draftHere.parentPath}`}
            draft={draftHere}
            onCommit={tree.onCommitDraft}
            onCancel={tree.onCancelDraft}
          />
        ) : null}
        {node.children.map((child) => (
          <AtlasBranch key={child.key} node={child} tree={tree} />
        ))}
        {node.palaces.map((palace) => (
          <PalaceListItem key={palace.id} palace={palace} tree={tree} />
        ))}
      </div>
    </details>
  );
}

export function PalaceSidebar({ onOpenImport }: { onOpenImport?: () => void }) {
  const palaces = usePalaceStore((s) => s.palaces);
  const trashedPalaces = usePalaceStore((s) => s.trashedPalaces) ?? [];
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const deletePalace = usePalaceStore((s) => s.deletePalace);
  const restorePalace = usePalaceStore((s) => s.restorePalace);
  const purgePalace = usePalaceStore((s) => s.purgePalace);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const setCurrentPalaceMeta = usePalaceStore((s) => s.setCurrentPalaceMeta);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const editorRef = usePalaceStore((s) => s.editorRef);
  // Tracks the background shape on the canvas (presence and lock state) so
  // the controls below follow it, including after undo or a palace switch.
  const background = useValue(
    "palace background",
    () => getBackgroundState(editorRef),
    [editorRef],
  );
  const [name, setName] = useState("My palace");
  const [atlasPath, setAtlasPath] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentAlias, setCurrentAlias] = useState("");
  const [currentAtlasPath, setCurrentAtlasPath] = useState("");
  const levelLabels = usePalaceStore((s) => s.atlasLevelLabels);
  const atlasGroups = usePalaceStore((s) => s.atlasGroups);
  const addAtlasGroup = usePalaceStore((s) => s.addAtlasGroup);
  const removeAtlasGroup = usePalaceStore((s) => s.removeAtlasGroup);
  const movePalaceToGroup = usePalaceStore((s) => s.movePalaceToGroup);
  const moveAtlasGroup = usePalaceStore((s) => s.moveAtlasGroup);
  const [hierarchySegments, setHierarchySegments] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [collapsedAtlasKeys, setCollapsedAtlasKeys] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const [draft, setDraft] = useState<SidebarDraft | null>(null);

  useEffect(() => {
    void loadPalaces();
  }, [loadPalaces]);

  useEffect(() => {
    setCurrentName(currentPalace?.name ?? "");
    setCurrentAlias(currentPalace?.alias ?? "");
    setCurrentAtlasPath(currentPalace?.atlasPath ?? "");
    setHierarchySegments(splitAtlasPath(currentPalace?.atlasPath));
  }, [currentPalace?.alias, currentPalace?.atlasPath, currentPalace?.name]);

  const groupedPalaces = useMemo(
    () => buildAtlasTree(palaces, atlasGroups),
    [palaces, atlasGroups],
  );
  const visiblePalaces = useMemo(
    () => filterAtlasTree(groupedPalaces, search),
    [groupedPalaces, search],
  );
  const isSearching = search.trim().length > 0;
  // A search result is pointless if its own branch is collapsed, so while
  // searching we show every matching branch open and leave the user's manual
  // collapse state untouched underneath (it reapplies as soon as they clear
  // the search box).
  const effectiveCollapsedKeys = useMemo(
    () => (isSearching ? new Set<string>() : collapsedAtlasKeys),
    [isSearching, collapsedAtlasKeys],
  );
  const allBranchKeys = useMemo(
    () => collectBranchKeys(groupedPalaces),
    [groupedPalaces],
  );
  const setGroupOpen = useCallback((key: string, open: boolean) => {
    setCollapsedAtlasKeys((current) => {
      if (current.has(key) !== open) return current;
      const next = new Set(current);
      if (open) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  const collapseAllBranches = () =>
    setCollapsedAtlasKeys(new Set(allBranchKeys));
  const expandAllBranches = () => setCollapsedAtlasKeys(new Set());
  const hierarchyRowCount = Math.max(
    levelLabels.length,
    hierarchySegments.length + 1,
    DEFAULT_ATLAS_LEVEL_LABELS.length,
  );

  const updateHierarchySegment = (index: number, value: string) => {
    setHierarchySegments((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleTreeDrop = useCallback(
    (item: PalaceTreeDragItem, targetPath: string) => {
      if (targetPath) setGroupOpen(targetPath, true);
      if (item.kind === "palace")
        void movePalaceToGroup(item.palaceId, targetPath);
      else void moveAtlasGroup(item.path, targetPath);
    },
    [moveAtlasGroup, movePalaceToGroup, setGroupOpen],
  );
  const { dragging, dropPath, startDrag, ghostRef, ghostStart } =
    usePalaceTreeDrag(handleTreeDrop);

  const tree: AtlasTreeControls = {
    dragging,
    dropPath,
    startDrag,
    currentPalaceId: currentPalace?.id ?? null,
    onOpen: (palaceId) => void openPalace(palaceId),
    collapsed: effectiveCollapsedKeys,
    onToggle: setGroupOpen,
    draft,
    onStartDraft: (next) => {
      // Unfold the target group, and clear a search that could hide it.
      if (next.parentPath) setGroupOpen(next.parentPath, true);
      setSearch("");
      setDraft(next);
    },
    onCommitDraft: (draftName) => {
      if (!draft) return;
      setDraft(null);
      if (draft.kind === "palace") {
        void createPalace(draftName, draft.parentPath);
        return;
      }
      const path = composeAtlasPath([
        ...splitAtlasPath(draft.parentPath),
        ...splitAtlasPath(draftName),
      ]);
      addAtlasGroup(path);
      setGroupOpen(path, true);
    },
    onCancelDraft: () => setDraft(null),
    onRemoveGroup: removeAtlasGroup,
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800/50 p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Palaces
          </h2>
          <button
            type="button"
            title="Open the atlas map of all palaces"
            onClick={() => requestNavigation("atlas")}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-zinc-400 transition hover:bg-zinc-900 hover:text-violet-200"
          >
            <Globe className="h-3.5 w-3.5" />
            Atlas map
          </button>
        </div>
        <div className="mt-2 space-y-2">
          <Input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Palace name"
            className="h-8 text-xs"
          />
          <Input
            aria-label="Atlas path"
            value={atlasPath}
            onChange={(e) => setAtlasPath(e.target.value)}
            placeholder="Atlas path: Country/City/District"
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            className="w-full justify-center"
            type="button"
            aria-label="Create palace"
            onClick={() => void createPalace(name, atlasPath)}
          >
            <Plus className="h-4 w-4" />
            Create palace
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-center"
            type="button"
            onClick={() => onOpenImport?.()}
            disabled={!currentPalace}
            title={
              currentPalace
                ? "Import notes into current palace"
                : "Open a palace first to import notes"
            }
          >
            Import notes
          </Button>
          <GenerateStoreForm />
        </div>
      </div>

      {currentPalace ? (
        <div className="space-y-2 border-b border-zinc-800/50 p-2">
          {/* A store's panel is a working tool (go to address, fill), so it stays out of the fold. */}
          <StorePanel />
          <details className="rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
            <summary className="cursor-pointer select-none text-xs font-medium uppercase tracking-wide text-zinc-500">
              Current palace
            </summary>
            <div className="mt-2 space-y-2">
              <Input
                aria-label="Current palace name"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                placeholder="Palace name"
                className="h-8 text-xs"
              />
              <Input
                aria-label="Current palace alias"
                value={currentAlias}
                onChange={(e) => setCurrentAlias(e.target.value)}
                placeholder="Alias"
                className="h-8 text-xs"
              />
              <Input
                aria-label="Current atlas path"
                value={currentAtlasPath}
                onChange={(e) => setCurrentAtlasPath(e.target.value)}
                placeholder="Atlas path"
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                variant="secondary"
                className="w-full justify-center"
                type="button"
                onClick={() => {
                  setCurrentPalaceMeta({
                    name: currentName,
                    alias: currentAlias,
                    atlasPath: currentAtlasPath,
                  });
                  void saveCurrent();
                }}
              >
                <Save className="h-4 w-4" />
                Save details
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-full justify-center"
                type="button"
                disabled={!editorRef || !currentPalace}
                title={
                  background.present
                    ? "Choose a different image to place behind the graph"
                    : "Choose an image to place behind the graph"
                }
                onClick={() => {
                  if (!editorRef || !currentPalace) return;
                  void insertBackgroundImageFromFile(
                    editorRef,
                    currentPalace.id,
                  );
                }}
              >
                <Image className="h-4 w-4" />
                {background.present ? "Replace background" : "Set background"}
              </Button>
              {background.present ? (
                <>
                  <Button
                    size="sm"
                    variant={background.editable ? "default" : "secondary"}
                    className="w-full justify-center"
                    type="button"
                    aria-pressed={background.editable}
                    title={
                      background.editable
                        ? "Lock the background so clicks pass through to the graph again"
                        : "Unlock the background to move, resize, or crop it"
                    }
                    onClick={() => {
                      if (!editorRef) return;
                      setBackgroundEditable(editorRef, !background.editable);
                    }}
                  >
                    {background.editable ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Lock background
                      </>
                    ) : (
                      <>
                        <Move className="h-4 w-4" />
                        Adjust background
                      </>
                    )}
                  </Button>
                  {background.editable ? (
                    <p className="px-1 text-[11px] leading-4 text-zinc-500">
                      Drag the image to move it, use the handles to resize, or
                      double-click to crop. Lock it when you are done.
                    </p>
                  ) : null}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-center"
                    type="button"
                    title="Remove the background image from this palace"
                    onClick={() => {
                      if (!editorRef) return;
                      removeBackground(editorRef);
                    }}
                  >
                    <ImageOff className="h-4 w-4" />
                    Remove background
                  </Button>
                </>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-center text-amber-200 hover:text-amber-100"
                type="button"
                onClick={() => {
                  if (!currentPalace) return;
                  if (
                    !window.confirm(
                      `Move "${currentPalace.name}" to trash for 30 days?`,
                    )
                  )
                    return;
                  void deletePalace(currentPalace.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Move to trash
              </Button>
            </div>
          </details>
          <details className="rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
            <summary className="cursor-pointer select-none text-xs font-medium uppercase tracking-wide text-zinc-500">
              Hierarchy editor
            </summary>
            <div className="mt-2 space-y-3">
              <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2">
                <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Terminology
                </div>
                <div className="mt-2">
                  <AtlasLevelLabelsEditor minRows={hierarchyRowCount} compact />
                </div>
              </div>
              <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2">
                <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Current palace outline
                </div>
                <div className="mt-2 space-y-2">
                  {Array.from({ length: hierarchyRowCount }).map((_, index) => {
                    const label =
                      levelLabels[index]?.trim() || `Level ${index + 1}`;
                    return (
                      <div
                        key={`hierarchy-segment-${index}`}
                        className="grid grid-cols-[6rem_1fr] items-center gap-2"
                      >
                        <div
                          className="truncate text-[11px] text-zinc-500"
                          title={label}
                        >
                          {label}
                        </div>
                        <Input
                          aria-label={`${label} segment`}
                          value={hierarchySegments[index] ?? ""}
                          onChange={(e) =>
                            updateHierarchySegment(index, e.target.value)
                          }
                          placeholder={index === 0 ? "e.g. Course" : "Optional"}
                          className="h-8 text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
                <Button
                  size="sm"
                  className="mt-2 w-full justify-center"
                  type="button"
                  onClick={() => {
                    const atlasPath = composeAtlasPath(hierarchySegments);
                    setCurrentAtlasPath(atlasPath);
                    setCurrentPalaceMeta({ atlasPath });
                    void saveCurrent();
                  }}
                >
                  Save hierarchy
                </Button>
              </div>
            </div>
          </details>
        </div>
      ) : null}

      <div className="flex items-center gap-1 border-b border-zinc-800/50 p-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <Input
            aria-label="Search palaces"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search palaces"
            className="h-8 pl-7 pr-7 text-xs"
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-500 hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          title="Collapse all folders"
          aria-label="Collapse all folders"
          disabled={isSearching || allBranchKeys.length === 0}
          onClick={collapseAllBranches}
          className="rounded p-1.5 text-zinc-400 transition hover:bg-zinc-900 hover:text-violet-200 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronsDownUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Expand all folders"
          aria-label="Expand all folders"
          disabled={isSearching || allBranchKeys.length === 0}
          onClick={expandAllBranches}
          className="rounded p-1.5 text-zinc-400 transition hover:bg-zinc-900 hover:text-violet-200 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <CreateContextMenu
        label="Palace list actions"
        onCreate={(kind) => tree.onStartDraft({ kind, parentPath: "" })}
      >
        <div
          data-drop-path=""
          className={`flex-1 overflow-y-auto rounded-md p-2 ${
            dropPath === "" ? dropTargetClass : ""
          }`}
        >
          {draft && draft.parentPath === "" ? (
            <DraftNameInput
              key={`${draft.kind}:root`}
              draft={draft}
              onCommit={tree.onCommitDraft}
              onCancel={tree.onCancelDraft}
            />
          ) : null}
          {isSearching && visiblePalaces.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-zinc-500">
              No palaces match &ldquo;{search.trim()}&rdquo;.
            </p>
          ) : null}
          {visiblePalaces.map((group) => (
            <AtlasBranch key={group.key} node={group} tree={tree} />
          ))}
          {trashedPalaces.length > 0 ? (
            <div
              data-drop-none
              className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/30 p-2"
            >
              <div className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Trash
              </div>
              <div className="space-y-2">
                {trashedPalaces.map((palace) => (
                  <div
                    key={palace.id}
                    className="rounded-md border border-zinc-800 bg-zinc-950/50 px-2 py-2"
                  >
                    <div className="text-sm text-zinc-200">{palace.name}</div>
                    {palace.atlasPath?.trim() ? (
                      <div className="text-[11px] text-zinc-500">
                        {palace.atlasPath}
                      </div>
                    ) : null}
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {formatTrashLabel(palace)}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        type="button"
                        onClick={() => void restorePalace(palace.id)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          if (
                            !window.confirm(
                              `Permanently delete "${palace.name}" now?`,
                            )
                          )
                            return;
                          void purgePalace(palace.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </CreateContextMenu>
      {dragging ? (
        <div
          ref={ghostRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          style={{
            transform: `translate(${ghostStart.x + 12}px, ${ghostStart.y + 8}px)`,
          }}
        >
          {dragging.kind === "group" ? (
            <Folder className="h-3.5 w-3.5 text-zinc-400" />
          ) : null}
          {dragging.label}
        </div>
      ) : null}
    </aside>
  );
}
