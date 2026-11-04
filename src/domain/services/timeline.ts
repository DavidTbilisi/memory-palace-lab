/**
 * Timeline palaces (backlog 20): dated events on a scaled axis, with named eras as rooms.
 *
 * Dates are read the way a learner writes them: a year ("1901", "490 BCE"), a month
 * ("1969-07"), a day ("1969-07-20"), or a span of any two of those ("1910–1913"). Years are kept
 * astronomically (1 BCE is year 0, 490 BCE is year -489), so they sort and scale as numbers.
 *
 * Pure: no React, no store, no canvas.
 */

/** One end of a date: a year, optionally narrowed to a month and a day. */
export type TimelinePoint = {
  /** Astronomical year: 1 BCE is 0, 2 BCE is -1. */
  year: number;
  month: number | null;
  day: number | null;
};

export type TimelineDate = {
  start: TimelinePoint;
  /** Set on a span, such as 1910–1913; always after `start`. */
  end: TimelinePoint | null;
  /** How the date is written back: "1901", "1969-07-20", "490 BCE", "1910–1913". */
  label: string;
  /** Where the date starts, in fractional years. */
  startKey: number;
  /** Where the date's last unit ends, in fractional years: 1901 ends at 1902.0. */
  endKey: number;
};

const isLeap = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
const daysInYear = (year: number) => (isLeap(year) ? 366 : 365);
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysInMonth = (year: number, month: number) => (month === 2 && isLeap(year) ? 29 : MONTH_DAYS[month - 1]!);

function dayOfYear(point: TimelinePoint): number {
  let days = 0;
  for (let m = 1; m < (point.month ?? 1); m++) days += daysInMonth(point.year, m);
  return days + (point.day ?? 1) - 1;
}

/** Where a point starts, in fractional years. */
export function pointStartKey(point: TimelinePoint): number {
  return point.year + dayOfYear(point) / daysInYear(point.year);
}

/** Where a point's own unit (its year, month or day) ends, in fractional years. */
export function pointEndKey(point: TimelinePoint): number {
  if (point.month === null) return point.year + 1;
  const days = dayOfYear(point) + (point.day === null ? daysInMonth(point.year, point.month) : 1);
  return point.year + days / daysInYear(point.year);
}

/** "490 BCE" for astronomical -489, "1901" for 1901. */
export function formatYear(year: number): string {
  return year <= 0 ? `${1 - year} BCE` : String(year);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatPoint(point: TimelinePoint): string {
  if (point.month === null) return formatYear(point.year);
  const month = `${formatYear(point.year)}-${pad2(point.month)}`;
  return point.day === null ? month : `${month}-${pad2(point.day)}`;
}

const BCE = /^(\d{1,4})\s*(?:BCE|BC|B\.C\.(?:E\.)?)$/i;
const CE = /^(?:(?:AD|A\.D\.)\s*)?(\d{1,4})(?:\s*(?:CE|AD|C\.E\.|A\.D\.))?$/i;
const MONTH_OR_DAY = /^(\d{1,4})-(\d{1,2})(?:-(\d{1,2}))?$/;

function parsePoint(text: string): TimelinePoint | null {
  const trimmed = text.trim();
  const bce = BCE.exec(trimmed);
  if (bce) {
    const n = Number(bce[1]);
    return n >= 1 ? { year: 1 - n, month: null, day: null } : null;
  }
  const ce = CE.exec(trimmed);
  if (ce) {
    const n = Number(ce[1]);
    return n >= 1 ? { year: n, month: null, day: null } : null;
  }
  const dated = MONTH_OR_DAY.exec(trimmed);
  if (dated) {
    const year = Number(dated[1]);
    const month = Number(dated[2]);
    const day = dated[3] === undefined ? null : Number(dated[3]);
    if (year < 1 || month < 1 || month > 12) return null;
    if (day !== null && (day < 1 || day > daysInMonth(year, month))) return null;
    return { year, month, day };
  }
  return null;
}

/** "1910–1913", "1910 - 1913", "1910 to 1913", and the bare "1910-1913" are spans. */
function splitSpan(text: string): [string, string] | null {
  const spaced = text.split(/\s*[–—]\s*|\s+-\s+|\s+to\s+/i);
  if (spaced.length === 2) return [spaced[0]!, spaced[1]!];
  if (spaced.length > 2) return null;
  // "1969-07" is a month, so a bare hyphen only joins two years of three or four digits.
  const years = /^(\d{3,4})-(\d{3,4})$/.exec(text.trim());
  return years ? [years[1]!, years[2]!] : null;
}

/** Read a date as a learner writes it; null when it is not one. */
export function parseTimelineDate(input: string): TimelineDate | null {
  const text = input.trim();
  if (!text) return null;
  const span = splitSpan(text);
  if (!span) {
    const start = parsePoint(text);
    return start ? { start, end: null, label: formatPoint(start), startKey: pointStartKey(start), endKey: pointEndKey(start) } : null;
  }
  const to = span[1];
  // "490–479 BCE": the era written once applies to both ends.
  const from = /^\d{1,4}$/.test(span[0].trim()) && BCE.test(to.trim()) ? `${span[0].trim()} BCE` : span[0];
  const start = parsePoint(from);
  const end = parsePoint(to);
  if (!start || !end) return null;
  const startKey = pointStartKey(start);
  const endKey = pointEndKey(end);
  if (pointStartKey(end) < startKey) return null;
  if (formatPoint(start) === formatPoint(end)) {
    return { start, end: null, label: formatPoint(start), startKey, endKey };
  }
  return { start, end, label: `${formatPoint(start)}–${formatPoint(end)}`, startKey, endKey };
}

/** The title a date image starts with, which the learner renames to their own image. */
export function dateImagePlaceholder(label: string): string {
  return `${label} · image`;
}

// ── Eras ────────────────────────────────────────────────────────────────────────────────────

/** A named stretch of the axis, drawn as a room behind the events in it. */
export type TimelineEra = {
  id: string;
  name: string;
  /** The era's first and last dates as written, e.g. "1900" and "1913". */
  from: string;
  to: string;
};

export type ResolvedEra = TimelineEra & { startKey: number; endKey: number };

/** Eras whose dates read, in axis order. An era runs from the start of `from` to the end of `to`. */
export function resolveEras(eras: readonly TimelineEra[]): ResolvedEra[] {
  const resolved: ResolvedEra[] = [];
  for (const era of eras) {
    const from = parseTimelineDate(era.from);
    const to = parseTimelineDate(era.to);
    if (!from || !to || to.endKey <= from.startKey) continue;
    resolved.push({ ...era, startKey: from.startKey, endKey: to.endKey });
  }
  return resolved.sort((a, b) => a.startKey - b.startKey || a.endKey - b.endKey);
}

/** The era an event falls in: the first, in axis order, that holds its start. */
export function eraAt(eras: readonly ResolvedEra[], key: number): ResolvedEra | null {
  return eras.find((era) => era.startKey <= key && key < era.endKey) ?? null;
}

/** What a stop outside every era is filed under, once an era has come before it. */
export const NO_ERA_SECTION = "No era";

/**
 * The route section each stop starts, in route order: an era's name at its first stop, and
 * NO_ERA_SECTION where the route leaves an era for the gap between rooms. Null elsewhere, since a
 * section runs on until the next one starts.
 */
export function eraSections(stopKeys: readonly number[], eras: readonly ResolvedEra[]): (string | null)[] {
  let current: string | null = null;
  return stopKeys.map((key) => {
    const era = eraAt(eras, key);
    const name = era ? era.name : current === null ? null : NO_ERA_SECTION;
    if (name === current) return null;
    current = name;
    return name;
  });
}

// ── Order and layout ────────────────────────────────────────────────────────────────────────

export type DatedEvent = { nodeId: string; date: TimelineDate };

/**
 * Events in date order. Events on the same date keep the order they already had (`previousOrder`,
 * the route), and events not in it yet come after those, so a new event joins its date last.
 */
export function orderEvents<T extends DatedEvent>(events: readonly T[], previousOrder: readonly string[]): T[] {
  const rank = new Map(previousOrder.map((nodeId, index) => [nodeId, index]));
  const rankOf = (nodeId: string) => rank.get(nodeId) ?? Number.MAX_SAFE_INTEGER;
  return events
    .map((event, index) => ({ event, index }))
    .sort(
      (a, b) =>
        a.event.date.startKey - b.event.date.startKey ||
        rankOf(a.event.nodeId) - rankOf(b.event.nodeId) ||
        a.index - b.index,
    )
    .map(({ event }) => event);
}

export const TIMELINE_NODE_SIZE = {
  event: { w: 200, h: 64 },
  dateImage: { w: 200, h: 48 },
} as const;

const PAIR_GAP = 8;
const SPAN_BAR_SPACE = 14;
const LANE_GAP = 26;
const NODE_GAP_X = 18;
/** The first lane sits this far below the axis, leaving room for the tick labels. */
const FIRST_LANE_TOP = 56;
const LANE_HEIGHT = SPAN_BAR_SPACE + TIMELINE_NODE_SIZE.dateImage.h + PAIR_GAP + TIMELINE_NODE_SIZE.event.h;
/** Wide enough to read; an empty or one-event axis still spans this much. */
const MIN_AXIS_WIDTH = 1200;
const WIDTH_PER_EVENT = 280;
const MIN_PX_PER_YEAR = 0.02;
const MAX_PX_PER_YEAR = 2000;
const MIN_TICK_SPACING = 140;
const AXIS_PAD = 60;

export type Box = { x: number; y: number; w: number; h: number };

export type EventPlacement = {
  nodeId: string;
  lane: number;
  /** Centres and sizes, in page space. */
  event: Box;
  dateImage: Box;
  /** A span's bar, from its start to its end, above the date image. */
  span: { x1: number; x2: number; y: number } | null;
};

export type TimelineLayout = {
  pxPerYear: number;
  /** The axis line runs along y = 0. */
  axis: { x1: number; x2: number };
  ticks: { x: number; label: string }[];
  eras: { id: string; name: string; x1: number; x2: number }[];
  events: EventPlacement[];
  /** The bottom of the last lane, which the era rooms reach down to. */
  bottom: number;
};

function niceStep(minYears: number): number {
  const exponent = Math.floor(Math.log10(Math.max(minYears, 1)));
  for (let e = Math.max(exponent - 1, 0); ; e++) {
    for (const base of [1, 2, 5]) {
      const step = base * 10 ** e;
      if (step >= minYears) return step;
    }
  }
}

function axisTicks(from: number, to: number, pxPerYear: number, xOf: (key: number) => number) {
  const step = niceStep(MIN_TICK_SPACING / pxPerYear);
  const ticks: { x: number; label: string }[] = [];
  // CE ticks at round years; BCE ticks at round BCE years (500 BCE is astronomical -499).
  for (let year = Math.max(Math.ceil(from / step) * step, step); year <= to; year += step) {
    ticks.push({ x: xOf(year), label: formatYear(year) });
  }
  for (let bce = step; 1 - bce >= from; bce += step) {
    if (1 - bce <= to) ticks.unshift({ x: xOf(1 - bce), label: formatYear(1 - bce) });
  }
  return ticks;
}

/**
 * Lay a timeline out. Position follows the date: each event's left edge sits at its start, so a
 * 22-year gap draws wider than a 7-year one. The scale fits the whole timeline into a readable
 * width. Events that would overlap, including those on the same date, drop into the next lane
 * down, each lane holding a date image above its event. Eras become bands behind the axis.
 */
export function layoutTimeline(events: readonly DatedEvent[], eras: readonly ResolvedEra[]): TimelineLayout {
  const keys = [
    ...events.flatMap((event) => [event.date.startKey, event.date.endKey]),
    ...eras.flatMap((era) => [era.startKey, era.endKey]),
  ];
  const from = keys.length > 0 ? Math.min(...keys) : 0;
  const to = keys.length > 0 ? Math.max(...keys) : 1;
  const span = Math.max(to - from, 1 / 12);
  const width = Math.max(MIN_AXIS_WIDTH, events.length * WIDTH_PER_EVENT);
  const pxPerYear = Math.min(MAX_PX_PER_YEAR, Math.max(MIN_PX_PER_YEAR, width / span));
  const xOf = (key: number) => (key - from) * pxPerYear;

  const laneEnds: number[] = [];
  const placements: EventPlacement[] = events.map((event) => {
    const left = xOf(event.date.startKey);
    const right = Math.max(left + TIMELINE_NODE_SIZE.event.w, event.date.end ? xOf(event.date.endKey) : left);
    let lane = laneEnds.findIndex((end) => end + NODE_GAP_X <= left);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(right);
    } else {
      laneEnds[lane] = right;
    }
    const top = FIRST_LANE_TOP + lane * (LANE_HEIGHT + LANE_GAP);
    const centreX = left + TIMELINE_NODE_SIZE.event.w / 2;
    const imageTop = top + SPAN_BAR_SPACE;
    const eventTop = imageTop + TIMELINE_NODE_SIZE.dateImage.h + PAIR_GAP;
    return {
      nodeId: event.nodeId,
      lane,
      dateImage: { x: centreX, y: imageTop + TIMELINE_NODE_SIZE.dateImage.h / 2, ...TIMELINE_NODE_SIZE.dateImage },
      event: { x: centreX, y: eventTop + TIMELINE_NODE_SIZE.event.h / 2, ...TIMELINE_NODE_SIZE.event },
      span: event.date.end ? { x1: left, x2: xOf(event.date.endKey), y: top + SPAN_BAR_SPACE / 2 - 2 } : null,
    };
  });

  const lanes = Math.max(laneEnds.length, 1);
  const rightmost = Math.max(xOf(to), ...placements.map((p) => p.event.x + p.event.w / 2));
  return {
    pxPerYear,
    axis: { x1: -AXIS_PAD, x2: rightmost + AXIS_PAD },
    ticks: axisTicks(from, to, pxPerYear, xOf),
    eras: eras.map((era) => ({ id: era.id, name: era.name, x1: xOf(era.startKey), x2: xOf(era.endKey) })),
    events: placements,
    bottom: FIRST_LANE_TOP + lanes * (LANE_HEIGHT + LANE_GAP),
  };
}
