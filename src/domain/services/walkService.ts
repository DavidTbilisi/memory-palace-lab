/** Pure walk navigation over ordered loci (by orderIndex ascending). */

export function orderedLoci<T extends { orderIndex: number }>(loci: T[]): T[] {
  return [...loci].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function clampWalkIndex(index: number, locusCount: number): number {
  if (locusCount <= 0) return 0;
  return Math.max(0, Math.min(index, locusCount - 1));
}

export function walkNext(currentIndex: number, locusCount: number): number {
  return clampWalkIndex(currentIndex + 1, locusCount);
}

export function walkPrevious(currentIndex: number, locusCount: number): number {
  return clampWalkIndex(currentIndex - 1, locusCount);
}

export function locusAtOrderedIndex<T extends { orderIndex: number }>(
  loci: T[],
  orderedPosition: number,
): T | undefined {
  const ordered = [...loci].sort((a, b) => a.orderIndex - b.orderIndex);
  return ordered[orderedPosition];
}
