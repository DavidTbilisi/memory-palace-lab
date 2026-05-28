import { useCallback, useEffect, useState } from "react";
import type { MemoryNode, MemoryRoute, Locus, Palace } from "../../domain/entities/types";
import type { PaletteCommand } from "../CommandPalette";
import { getPalaceRepository } from "../../infrastructure/palaceRepositoryProvider";
import {
  RECENT_COMMANDS_STORAGE_KEY,
  RECENT_NODE_IDS_STORAGE_KEY,
  loadRecentIds,
  routeNamesByNodeId,
  toPlainText,
} from "../../app/memoryPalaceAppHelpers";

const palaceRepo = getPalaceRepository();

type NodeSearchEntry = {
  palaceId: string;
  palaceName: string;
  nodeId: string;
  title: string;
  subtitle: string;
  keywords: string;
  group: "Current Palace Nodes" | "Other Palaces";
};

type Inputs = {
  currentPalace: Palace | null;
  nodes: MemoryNode[];
  routes: MemoryRoute[];
  loci: Locus[];
  palaces: Palace[];
  onFocusNode: (palaceId: string, nodeId: string) => void;
};

/**
 * Owns command-palette open state, recent-command and recent-node history
 * (persisted to localStorage), and the async cross-palace node-command list.
 * Navigation/page commands stay with the caller; this hook is responsible only
 * for the palette's own state and the node-search concern.
 */
export function useCommandPalette({ currentPalace, nodes, routes, loci, palaces, onFocusNode }: Inputs) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => loadRecentIds(RECENT_COMMANDS_STORAGE_KEY));
  const [recentNodeIds, setRecentNodeIds] = useState<string[]>(() => loadRecentIds(RECENT_NODE_IDS_STORAGE_KEY, 12));
  const [nodeCommands, setNodeCommands] = useState<PaletteCommand[]>([]);

  const trackCommandRun = useCallback((id: string) => {
    setRecentCommandIds((current) => [id, ...current.filter((entry) => entry !== id)].slice(0, 20));
  }, []);

  const trackNodeVisit = useCallback((nodeId: string) => {
    setRecentNodeIds((current) => [nodeId, ...current.filter((entry) => entry !== nodeId)].slice(0, 12));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RECENT_COMMANDS_STORAGE_KEY, JSON.stringify(recentCommandIds.slice(0, 20)));
  }, [recentCommandIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RECENT_NODE_IDS_STORAGE_KEY, JSON.stringify(recentNodeIds.slice(0, 12)));
  }, [recentNodeIds]);

  useEffect(() => {
    if (!commandOpen) return;
    let cancelled = false;

    async function buildNodeCommands() {
      const currentPalaceId = currentPalace?.id ?? null;

      const snapshots = await Promise.all(
        palaces.map(async (palace) => {
          if (palace.id === currentPalaceId) {
            return { palace, nodes, routes, loci };
          }
          const loaded = await palaceRepo.loadPalace(palace.id);
          if (!loaded) return null;
          return {
            palace: loaded.palace,
            nodes: loaded.nodes,
            routes: loaded.routes,
            loci: loaded.loci,
          };
        }),
      );

      if (cancelled) return;

      const entries: NodeSearchEntry[] = [];
      for (const snapshot of snapshots) {
        if (!snapshot) continue;
        const nodeRouteSummaries = routeNamesByNodeId(snapshot.nodes, snapshot.routes, snapshot.loci);
        for (const entry of nodeRouteSummaries) {
          const title = entry.node.title?.trim() || "Untitled node";
          entries.push({
            palaceId: snapshot.palace.id,
            palaceName: snapshot.palace.name,
            nodeId: entry.node.id,
            title,
            subtitle: `${snapshot.palace.name} | ${entry.routeSummary}`,
            keywords: `${entry.node.alias ?? ""} ${toPlainText(entry.node.content ?? "")}`,
            group: snapshot.palace.id === currentPalaceId ? "Current Palace Nodes" : "Other Palaces",
          });
        }
      }

      const entryByNodeId = new Map(entries.map((entry) => [entry.nodeId, entry]));
      const recentNodeCommands: PaletteCommand[] = recentNodeIds
        .map((nodeId) => entryByNodeId.get(nodeId))
        .filter((entry): entry is NodeSearchEntry => !!entry)
        .slice(0, 5)
        .map((entry) => ({
          id: `recent-node:${entry.palaceId}:${entry.nodeId}`,
          group: "Recent nodes",
          title: entry.title,
          subtitle: entry.subtitle,
          keywords: entry.keywords,
          onSelect: () => {
            trackNodeVisit(entry.nodeId);
            onFocusNode(entry.palaceId, entry.nodeId);
          },
        }));

      const regularNodeCommands: PaletteCommand[] = entries.map((entry) => ({
        id: `node:${entry.palaceId}:${entry.nodeId}`,
        group: entry.group,
        title: entry.title,
        subtitle: entry.subtitle,
        keywords: entry.keywords,
        onSelect: () => {
          trackNodeVisit(entry.nodeId);
          onFocusNode(entry.palaceId, entry.nodeId);
        },
      }));

      setNodeCommands([...recentNodeCommands, ...regularNodeCommands]);
    }

    void buildNodeCommands();

    return () => {
      cancelled = true;
    };
  }, [commandOpen, currentPalace?.id, onFocusNode, loci, nodes, palaces, recentNodeIds, routes, trackNodeVisit]);

  return {
    commandOpen,
    setCommandOpen,
    recentCommandIds,
    trackCommandRun,
    recentNodeIds,
    trackNodeVisit,
    nodeCommands,
  };
}
