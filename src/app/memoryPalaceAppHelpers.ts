import type { MemoryNode } from "../domain/entities/types";

export type AppPage = "graph" | "review" | "insights" | "system" | "atlas" | "routes" | "help";

export const RECENT_COMMANDS_STORAGE_KEY = "mp-recent-command-ids";
export const RECENT_NODE_IDS_STORAGE_KEY = "mp-recent-node-ids";
export const DSL_SPLIT_RATIO_STORAGE_KEY = "mp-dsl-split-ratio";

const DEFAULT_SPLIT_RATIO = 0.4;

/** Read the persisted DSL split-pane ratio, clamped to a sane open range. */
export function loadSplitRatio(): number {
  if (typeof window === "undefined") return DEFAULT_SPLIT_RATIO;
  const raw = window.localStorage.getItem(DSL_SPLIT_RATIO_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0.1 && parsed < 0.9 ? parsed : DEFAULT_SPLIT_RATIO;
}

/** Read a persisted list of recent string ids, tolerant of malformed storage. */
export function loadRecentIds(storageKey: string, max = 20): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === "string").slice(0, max);
  } catch {
    return [];
  }
}

/** Strip HTML tags and collapse whitespace to a single trimmed line. */
export function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** One-line orientation hint shown beneath each non-graph page header. */
export function pageHint(page: AppPage): string | null {
  if (page === "review") {
    return "Review turns routes and recall ratings into an attention queue instead of a loose reading habit.";
  }
  if (page === "insights") {
    return "Insights shows the telemetry behind your graph and review behavior so weak spots become visible.";
  }
  if (page === "system") {
    return "System is where theSystem frameworks become runnable thinking pipelines and graph output.";
  }
  if (page === "atlas") {
    return "Atlas organizes palaces by geography: domain, place, section. Build a hierarchy across multiple spaces.";
  }
  if (page === "routes") {
    return "Routes are ordered walks through your palace. Organize and edit loci sequences here without toolbar noise.";
  }
  if (page === "help") {
    return "Help is onboarding plus examples. Use it to start fast, then leave it once the palace is alive.";
  }
  return null;
}

/** Pair each node with a comma-joined summary of the routes that visit it. */
export function routeNamesByNodeId(
  nodes: MemoryNode[],
  routes: Array<{ id: string; name: string }>,
  loci: Array<{ routeId: string; nodeId: string }>,
): Array<{ node: MemoryNode; routeSummary: string }> {
  const routeNameMap = new Map(routes.map((route) => [route.id, route.name]));
  const namesByNode = new Map<string, Set<string>>();
  for (const locus of loci) {
    const routeName = routeNameMap.get(locus.routeId);
    if (!routeName) continue;
    const set = namesByNode.get(locus.nodeId) ?? new Set<string>();
    set.add(routeName);
    namesByNode.set(locus.nodeId, set);
  }

  return nodes.map((node) => {
    const routeNames = [...(namesByNode.get(node.id) ?? new Set<string>())];
    return {
      node,
      routeSummary: routeNames.length === 0 ? "No route" : routeNames.join(", "),
    };
  });
}
