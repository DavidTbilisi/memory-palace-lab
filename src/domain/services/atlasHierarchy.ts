export const DEFAULT_ATLAS_LEVEL_LABELS = ["Domain", "Place", "Section"];

export function splitAtlasPath(path: string | null | undefined) {
  return (path ?? "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function composeAtlasPath(segments: string[]) {
  return segments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/");
}
