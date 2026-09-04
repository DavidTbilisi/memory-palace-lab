/** Global keyboard shortcuts, listed once so tooltips and Settings agree. */
export type Shortcut = {
  id: "palette" | "glossary" | "dsl";
  /** The key after Ctrl/Cmd. */
  key: string;
  label: string;
  description: string;
};

export const SHORTCUTS: readonly Shortcut[] = [
  { id: "palette", key: "K", label: "Command palette", description: "Jump to any page, palace, route, node, or document." },
  { id: "glossary", key: "D", label: "Glossary", description: "Quick lookup of the app's vocabulary." },
  { id: "dsl", key: "E", label: "DSL editor", description: "Toggle the split-pane Palace DSL editor beside the canvas." },
];

export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
}

/** "Ctrl+K" or "⌘K" depending on platform. */
export function formatShortcut(shortcut: Shortcut): string {
  return isMacPlatform() ? `⌘${shortcut.key}` : `Ctrl+${shortcut.key}`;
}

export function shortcutById(id: Shortcut["id"]): Shortcut {
  const found = SHORTCUTS.find((shortcut) => shortcut.id === id);
  if (!found) throw new Error(`Unknown shortcut: ${id}`);
  return found;
}

/** Tooltip suffix, e.g. " (Ctrl+E)". */
export function shortcutHint(id: Shortcut["id"]): string {
  return ` (${formatShortcut(shortcutById(id))})`;
}
