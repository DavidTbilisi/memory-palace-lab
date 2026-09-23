/**
 * Image media types, in one place because two features need to agree on them: importing a
 * background names the file it copies, and pulling one from the vault has to name it again
 * on the other device from nothing but the stored media type.
 */

const BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

const BY_MEDIA_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export function extensionOf(path: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(path);
  return match ? match[1].toLowerCase() : "";
}

/** PNG is the fallback: it is lossless, so an unrecognised image is never degraded. */
export function imageMediaType(path: string): string {
  return BY_EXTENSION[extensionOf(path)] ?? "image/png";
}

export function imageExtension(mediaType: string): string {
  return BY_MEDIA_TYPE[mediaType.toLowerCase()] ?? "png";
}
