/**
 * Append-only data (analytics events, AAR records) syncs by union rather than by conflict:
 * every row has a unique id, and no device ever edits another device's rows.
 *
 * The one real problem is convergence. The obvious design — "my shard holds everything I
 * know" — never settles: I pull B's events, my set grows, so my next push rewrites my shard,
 * so B pulls it and *its* set grows, for ever. Total bytes go quadratic in devices and
 * "Sync now" always claims there is work.
 *
 * The fix is to remember which ids arrived from somebody else's shard and leave them out of
 * mine. My shard then holds only what this device originated, which is a set that stops
 * changing — so the second sync round genuinely writes nothing.
 */

export type Identified = { id: string };
export type Timestamped = Identified & { createdAt: string };

/** Union by id. Incoming rows win, which is harmless since rows are never edited. */
export function unionById<T extends Identified>(local: readonly T[], incoming: readonly T[]): T[] {
  const byId = new Map<string, T>();
  for (const item of local) byId.set(item.id, item);
  for (const item of incoming) byId.set(item.id, item);
  return [...byId.values()];
}

/**
 * What this device publishes: everything it originated, minus anything older than the
 * retention window. Rows trimmed by retention stay in the local database — the vault is a
 * sync channel, not the archive. "Backup all palaces" remains the archive.
 */
export function selectShardRows<T extends Timestamped>(
  all: readonly T[],
  foreignIds: ReadonlySet<string>,
  options: { retentionDays: number; now: Date },
): T[] {
  const cutoff = options.now.getTime() - options.retentionDays * 24 * 60 * 60 * 1000;
  return all
    .filter((row) => !foreignIds.has(row.id))
    .filter((row) => {
      const at = Date.parse(row.createdAt);
      // An unparseable timestamp is kept rather than dropped: losing a row is worse than
      // carrying one that retention should have trimmed.
      return Number.isNaN(at) || at >= cutoff;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Ids seen in a peer's shard, so they are excluded from ours on the next push. */
export function foreignIdsFrom<T extends Identified>(incoming: readonly T[]): string[] {
  return incoming.map((row) => row.id);
}
