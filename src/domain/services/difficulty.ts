/**
 * difficulty.ts — learner-relative learning-difficulty estimator.
 *
 * A faithful TypeScript port of tools/difficulty.py from the Neural-OS-Research
 * repo (the `/difficulty` skill). It estimates the ACQUISITION COST of a topic —
 * how hard it is to *learn* given what the learner already knows — which is
 * distinct from "complexity" (how much content exists).
 *
 *   step difficulty = new stuff + juggle-overload − shortcut
 *     new stuff       = new_ideas + normal_links + 3·breaks − 2·analogy_links
 *     juggle-overload = max(0, juggle − capacity)²        (capacity ~4, the WM cliff)
 *     shortcut        = if a key_idea exists, the step collapses once it lands
 *
 * Two roll-ups over the prerequisite (`needs`) graph:
 *   for-you   = step cost of the topic + every prerequisite NOT yet absorbed.
 *   from-zero = same sum assuming nothing is known.
 *
 * Kept numerically identical to difficulty.py so scores are comparable across
 * the Python tool and the lab.
 */

export interface DifficultyRow {
  topic: string;
  needs?: string[];
  new_ideas?: number;
  normal_links?: number;
  breaks?: string[];
  analogy_links?: number;
  juggle?: number;
  key_idea?: string | null;
}

export interface DifficultyBatch {
  capacity?: number;
  rows: DifficultyRow[];
}

export interface DifficultyResult {
  topic: string;
  needs: string[];
  juggle: number;
  breaks: number;
  key_idea: string | null;
  step: number;
  after: number | null;
  for_you: number;
  from_zero: number;
  wall: boolean;
  external_prereqs: string[];
}

export const DEFAULT_CAPACITY = 4; // working-memory chunk limit (the cliff)
export const DEFAULT_WALL = 15; // step >= this is flagged a "wall"

const W_NORMAL = 1;
const W_BREAK = 3;
const W_ANALOGY = 2;

/** Canonical topic key: lowercase, spaces/underscores -> hyphens. */
export function norm(name: string): string {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

// --------------------------------------------------------------- formula ---

/** Cost of this one topic, assuming its prerequisites are already known. */
export function stepCost(row: DifficultyRow, capacity: number): number {
  const newStuff =
    (row.new_ideas ?? 0) +
    W_NORMAL * (row.normal_links ?? 0) +
    W_BREAK * (row.breaks?.length ?? 0) -
    W_ANALOGY * (row.analogy_links ?? 0);
  const overload = Math.max(0, (row.juggle ?? 0) - capacity) ** 2;
  return Math.max(0, newStuff + overload);
}

/**
 * Rough cost once the key_idea lands. Indicative, not exact — the drop is real,
 * the precise number is not. Returns null when the topic has no shortcut.
 */
export function stepCostAfter(row: DifficultyRow): number | null {
  if (!row.key_idea) return null;
  const ideasAfter = Math.ceil((row.new_ideas ?? 0) / 3);
  const linksAfter = Math.ceil((W_NORMAL * (row.normal_links ?? 0)) / 3);
  // the belief-break is mostly metabolised once the idea clicks (+3 -> +1);
  // the simultaneity that caused the overload is resolved, so no overload term.
  const residual = (row.breaks?.length ?? 0) * 1;
  const newStuff =
    ideasAfter + linksAfter + residual - W_ANALOGY * (row.analogy_links ?? 0);
  return Math.max(0, Math.round(newStuff));
}

/**
 * Set of topics whose step cost you must pay to learn `topic`: the topic itself
 * plus every prerequisite (transitively) you have NOT absorbed. An absorbed
 * prerequisite is free AND prunes its own ancestors. Prereqs outside the batch
 * are external (cost 0). Cycle-safe via the accumulating set.
 */
export function toPay(
  topic: string,
  rows: Map<string, DifficultyRow>,
  known: Set<string>,
): Set<string> {
  const pay = new Set<string>();

  const walk = (name: string, isTarget: boolean): void => {
    if (pay.has(name)) return;
    const row = rows.get(name);
    if (row === undefined) return; // external prerequisite, out of scope
    if (known.has(name) && !isTarget) return; // absorbed -> free, prune ancestors
    pay.add(name);
    for (const p of row.needs ?? []) walk(norm(p), false);
  };

  walk(norm(topic), true);
  return pay;
}

// ------------------------------------------------------------- compute ---

export function evaluate(
  batch: DifficultyBatch,
  known: Set<string>,
  wall: number = DEFAULT_WALL,
): DifficultyResult[] {
  const capacity = batch.capacity ?? DEFAULT_CAPACITY;
  const rows = new Map<string, DifficultyRow>();
  for (const r of batch.rows) rows.set(norm(r.topic), r);
  const names = new Set(rows.keys());

  const out: DifficultyResult[] = [];
  for (const [key, row] of rows) {
    const step = stepCost(row, capacity);
    const after = stepCostAfter(row);
    let forYou = 0;
    for (const n of toPay(key, rows, known))
      forYou += stepCost(rows.get(n)!, capacity);
    let fromZero = 0;
    for (const n of toPay(key, rows, new Set()))
      fromZero += stepCost(rows.get(n)!, capacity);
    const gaps = (row.needs ?? [])
      .map(norm)
      .filter((p) => !names.has(p) && !known.has(p))
      .sort();
    out.push({
      topic: key,
      needs: (row.needs ?? []).map(norm),
      juggle: row.juggle ?? 0,
      breaks: row.breaks?.length ?? 0,
      key_idea: row.key_idea ?? null,
      step,
      after,
      for_you: forYou,
      from_zero: fromZero,
      wall: step >= wall,
      external_prereqs: [...new Set(gaps)],
    });
  }
  return out;
}

/** Kahn topological sort over in-batch `needs`, easiest-step first on ties. */
export function learningOrder(results: DifficultyResult[]): string[] {
  const names = new Set(results.map((r) => r.topic));
  const stepBy = new Map(results.map((r) => [r.topic, r.step]));
  const indeg = new Map(results.map((r) => [r.topic, 0]));
  const children = new Map<string, string[]>(results.map((r) => [r.topic, []]));
  for (const r of results) {
    for (const p of r.needs) {
      if (names.has(p)) {
        indeg.set(r.topic, (indeg.get(r.topic) ?? 0) + 1);
        children.get(p)!.push(r.topic);
      }
    }
  }
  const byStep = (a: string, b: string) => {
    const d = (stepBy.get(a) ?? 0) - (stepBy.get(b) ?? 0);
    return d !== 0 ? d : a < b ? -1 : a > b ? 1 : 0;
  };
  const ready = [...indeg.entries()]
    .filter(([, d]) => d === 0)
    .map(([n]) => n)
    .sort(byStep);
  const order: string[] = [];
  while (ready.length) {
    const n = ready.shift()!;
    order.push(n);
    for (const c of children.get(n) ?? []) {
      indeg.set(c, (indeg.get(c) ?? 0) - 1);
      if (indeg.get(c) === 0) ready.push(c);
    }
    ready.sort(byStep);
  }
  // any leftover (cycle) appended in step order so nothing is dropped
  for (const r of [...results].sort((a, b) => a.step - b.step)) {
    if (!order.includes(r.topic)) order.push(r.topic);
  }
  return order;
}
