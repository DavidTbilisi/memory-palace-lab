import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EMPTY_DUE_QUEUE,
  buildDueQueue,
  type DueQueue,
  type DueQueueSnapshot,
  type GlobalDueItem,
} from "../../domain/services/dueQueue";
import { computeDailyStreak, countReviewedToday } from "../../domain/services/reviewMetrics";
import { getPalaceRepository } from "../../infrastructure/palaceRepositoryProvider";
import { usePalaceStore } from "../../store/palaceStore";

/**
 * Snapshots of palaces other than the open one, loaded from the repository
 * once and reused across renders. The open palace always comes live from the
 * store, so editing loci never triggers a refetch of every other palace.
 */
const snapshotCache = new Map<string, DueQueueSnapshot>();
let cacheVersion = 0;
const listeners = new Set<() => void>();

/** Drop cached snapshots (all, or one palace) so the next read refetches. */
export function invalidateDueQueueCache(palaceId?: string) {
  if (palaceId) snapshotCache.delete(palaceId);
  else snapshotCache.clear();
  cacheVersion += 1;
  for (const listener of listeners) listener();
}

export type DueQueueState = {
  queue: DueQueue;
  items: GlobalDueItem[];
  dueCountAll: number;
  dueCountCurrent: number;
  averageInterval: number | null;
  streak: number;
  reviewedToday: number;
  dailyReviewGoal: number;
  goalProgress: number;
  loading: boolean;
  refresh: () => void;
};

export function useDueQueue(): DueQueueState {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const nodes = usePalaceStore((s) => s.nodes);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const dailyReviewGoal = usePalaceStore((s) => s.dailyReviewGoal);
  const persistenceState = usePalaceStore((s) => s.persistenceState);

  const [otherSnapshots, setOtherSnapshots] = useState<DueQueueSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(cacheVersion);

  useEffect(() => {
    const listener = () => setVersion(cacheVersion);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!analyticsLoaded) void loadAnalyticsEvents();
  }, [analyticsLoaded, loadAnalyticsEvents]);

  // The open palace's cached copy is stale by definition once it is open;
  // drop it so switching away later refetches what was edited.
  const currentPalaceId = currentPalace?.id ?? null;
  useEffect(() => {
    if (currentPalaceId) snapshotCache.delete(currentPalaceId);
  }, [currentPalaceId]);

  // A checkpoint may have changed schedules; nothing cached is trustworthy after it.
  useEffect(() => {
    if (persistenceState === "clean" && currentPalaceId) snapshotCache.delete(currentPalaceId);
  }, [currentPalaceId, persistenceState]);

  useEffect(() => {
    let cancelled = false;
    const others = palaces.filter((palace) => palace.id !== currentPalaceId);
    if (others.length === 0) {
      setOtherSnapshots((previous) => (previous.length === 0 ? previous : []));
      setLoading(false);
      return;
    }
    const missing = others.filter((palace) => !snapshotCache.has(palace.id));
    const repo = getPalaceRepository();
    async function load() {
      if (missing.length > 0) setLoading(true);
      await Promise.all(
        missing.map(async (palace) => {
          const loaded = await repo.loadPalace(palace.id);
          if (!loaded) return;
          snapshotCache.set(palace.id, {
            palace: loaded.palace,
            routes: loaded.routes,
            loci: loaded.loci,
            nodes: loaded.nodes,
          });
        }),
      );
      if (cancelled) return;
      const next = others
        .map((palace) => snapshotCache.get(palace.id))
        .filter((snapshot): snapshot is DueQueueSnapshot => snapshot !== undefined);
      // Keep state identity stable when nothing changed so callers with
      // fresh-but-equal inputs (e.g. mocked stores) cannot loop.
      setOtherSnapshots((previous) =>
        previous.length === next.length && previous.every((snapshot, index) => snapshot === next[index])
          ? previous
          : next,
      );
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [currentPalaceId, palaces, version]);

  const queue = useMemo(() => {
    const snapshots: DueQueueSnapshot[] = currentPalace
      ? [{ palace: currentPalace, routes, loci, nodes }, ...otherSnapshots]
      : otherSnapshots;
    if (snapshots.length === 0) return EMPTY_DUE_QUEUE;
    return buildDueQueue(snapshots);
  }, [currentPalace, loci, nodes, otherSnapshots, routes]);

  const reviewedToday = useMemo(() => countReviewedToday(analyticsEvents), [analyticsEvents]);
  const streak = useMemo(() => computeDailyStreak(analyticsEvents), [analyticsEvents]);
  const refresh = useCallback(() => invalidateDueQueueCache(), []);

  return {
    queue,
    items: queue.items,
    dueCountAll: queue.items.length,
    dueCountCurrent: currentPalaceId ? (queue.countByPalace.get(currentPalaceId) ?? 0) : 0,
    averageInterval: queue.averageInterval,
    streak,
    reviewedToday,
    dailyReviewGoal,
    goalProgress: Math.min(1, reviewedToday / Math.max(1, dailyReviewGoal)),
    loading,
    refresh,
  };
}
