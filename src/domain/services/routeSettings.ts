import {
  ROUTE_COLORS,
  ROUTE_DIRECTIONS,
  type Locus,
  type MemoryRoute,
  type RouteColor,
  type RouteDirection,
  type RouteMetadataTag,
  type StopView,
} from "../entities/types";

/** Route fields stored together in the `routes.settings_json` column. */
export type RouteSettings = Pick<
  MemoryRoute,
  "color" | "hidden" | "metadata" | "direction" | "lastWalkDirection" | "inReview" | "notes"
>;

/** Stop fields stored together in the `loci.settings_json` column. */
export type StopSettings = Pick<Locus, "view" | "section">;

function isRouteColor(value: unknown): value is RouteColor {
  return typeof value === "string" && (ROUTE_COLORS as readonly string[]).includes(value);
}

function isRouteDirection(value: unknown): value is RouteDirection {
  return typeof value === "string" && (ROUTE_DIRECTIONS as readonly string[]).includes(value);
}

function nonBlank(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function parseSettings(json: string | null | undefined): Record<string, unknown> | null {
  if (!json) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
}

/** JSON for `routes.settings_json`; defaults are left out, so a plain route encodes as "{}". */
export function encodeRouteSettings(route: RouteSettings): string {
  const settings: Record<string, unknown> = {};
  if (route.color) settings.color = route.color;
  if (route.hidden) settings.hidden = true;
  if (route.metadata?.length) settings.metadata = route.metadata.map(({ key, value }) => ({ key, value }));
  if (route.direction && route.direction !== "forward") settings.direction = route.direction;
  if (route.lastWalkDirection) settings.lastWalkDirection = route.lastWalkDirection;
  if (route.inReview === false) settings.inReview = false;
  const notes = nonBlank(route.notes);
  if (notes) settings.notes = notes;
  return JSON.stringify(settings);
}

function isMetadataTag(value: unknown): value is RouteMetadataTag {
  if (!value || typeof value !== "object") return false;
  const { key, value: tagValue } = value as Record<string, unknown>;
  return typeof key === "string" && key !== "" && (typeof tagValue === "string" || tagValue === null);
}

/** Tolerant reader: malformed JSON or unknown values fall back to the defaults. */
export function decodeRouteSettings(json: string | null | undefined): RouteSettings {
  const raw = parseSettings(json);
  if (!raw) return {};
  const settings: RouteSettings = {};
  if (isRouteColor(raw.color)) settings.color = raw.color;
  if (raw.hidden === true) settings.hidden = true;
  if (Array.isArray(raw.metadata)) {
    const metadata = raw.metadata.filter(isMetadataTag).map(({ key, value }) => ({ key, value }));
    if (metadata.length > 0) settings.metadata = metadata;
  }
  if (isRouteDirection(raw.direction) && raw.direction !== "forward") settings.direction = raw.direction;
  if (raw.lastWalkDirection === "forward" || raw.lastWalkDirection === "reverse") {
    settings.lastWalkDirection = raw.lastWalkDirection;
  }
  if (raw.inReview === false) settings.inReview = false;
  const notes = nonBlank(raw.notes);
  if (notes) settings.notes = notes;
  return settings;
}

export function isStopView(value: unknown): value is StopView {
  if (!value || typeof value !== "object") return false;
  const { x, y, w, h } = value as Record<string, unknown>;
  return (
    typeof x === "number" &&
    Number.isFinite(x) &&
    typeof y === "number" &&
    Number.isFinite(y) &&
    typeof w === "number" &&
    Number.isFinite(w) &&
    w > 0 &&
    typeof h === "number" &&
    Number.isFinite(h) &&
    h > 0
  );
}

/** JSON for `loci.settings_json`; a stop without a saved view or section encodes as "{}". */
export function encodeStopSettings(stop: StopSettings): string {
  const settings: Record<string, unknown> = {};
  if (isStopView(stop.view)) {
    const { x, y, w, h } = stop.view;
    settings.view = { x, y, w, h };
  }
  const section = nonBlank(stop.section)?.trim();
  if (section) settings.section = section;
  return JSON.stringify(settings);
}

/** Tolerant reader: malformed JSON, an invalid view, or a blank section read as unset. */
export function decodeStopSettings(json: string | null | undefined): StopSettings {
  const raw = parseSettings(json);
  if (!raw) return {};
  const settings: StopSettings = {};
  if (isStopView(raw.view)) {
    const { x, y, w, h } = raw.view;
    settings.view = { x, y, w, h };
  }
  const section = nonBlank(raw.section)?.trim();
  if (section) settings.section = section;
  return settings;
}
