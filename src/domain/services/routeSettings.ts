import { ROUTE_COLORS, type MemoryRoute, type RouteColor } from "../entities/types";

/** Route fields stored together in the `routes.settings_json` column. */
export type RouteSettings = Pick<MemoryRoute, "color" | "hidden">;

function isRouteColor(value: unknown): value is RouteColor {
  return typeof value === "string" && (ROUTE_COLORS as readonly string[]).includes(value);
}

/** JSON for `routes.settings_json`; defaults are left out, so a plain route encodes as "{}". */
export function encodeRouteSettings(route: RouteSettings): string {
  const settings: Record<string, unknown> = {};
  if (route.color) settings.color = route.color;
  if (route.hidden) settings.hidden = true;
  return JSON.stringify(settings);
}

/** Tolerant reader: malformed JSON or unknown values fall back to the defaults. */
export function decodeRouteSettings(json: string | null | undefined): RouteSettings {
  if (!json) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object") return {};
  const raw = parsed as Record<string, unknown>;
  const settings: RouteSettings = {};
  if (isRouteColor(raw.color)) settings.color = raw.color;
  if (raw.hidden === true) settings.hidden = true;
  return settings;
}
