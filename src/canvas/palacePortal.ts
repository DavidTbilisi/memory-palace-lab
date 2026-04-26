import type { MemoryNode, MemoryNodeKind, PalacePortalRef } from "../domain/entities/types";
import type { MemoryPalaceMeta } from "./memoryMeta";

function withDefinedMetaFields(meta: MemoryPalaceMeta): MemoryPalaceMeta {
  return Object.fromEntries(
    Object.entries(meta).filter(([, value]) => value !== undefined),
  ) as MemoryPalaceMeta;
}

export function portalRefFromMeta(meta: MemoryPalaceMeta): PalacePortalRef | null {
  const hasPortalTarget = !!(
    meta.mpPortalPalaceId ||
    meta.mpPortalRouteId ||
    meta.mpPortalNodeId ||
    meta.mpPortalPalaceName
  );
  if (!hasPortalTarget) return null;
  return {
    targetPalaceId: meta.mpPortalPalaceId,
    targetPalaceName: meta.mpPortalPalaceName,
    targetAtlasPath: meta.mpPortalAtlasPath ?? null,
    targetRouteId: meta.mpPortalRouteId,
    targetRouteName: meta.mpPortalRouteName,
    targetNodeId: meta.mpPortalNodeId,
  };
}

export function nodeKindFromMeta(meta: MemoryPalaceMeta): MemoryNodeKind {
  return meta.mpNodeKind === "portal" ? "portal" : "memory";
}

export function applyPortalRefToMeta(
  meta: MemoryPalaceMeta,
  kind: MemoryNodeKind,
  portal: PalacePortalRef | null | undefined,
): MemoryPalaceMeta {
  if (kind !== "portal") {
    return withDefinedMetaFields({
      ...meta,
      mpNodeKind: "memory",
      mpPortalPalaceId: undefined,
      mpPortalPalaceName: undefined,
      mpPortalAtlasPath: undefined,
      mpPortalRouteId: undefined,
      mpPortalRouteName: undefined,
      mpPortalNodeId: undefined,
    });
  }

  return withDefinedMetaFields({
    ...meta,
    mpNodeKind: "portal",
    mpPortalPalaceId: portal?.targetPalaceId,
    mpPortalPalaceName: portal?.targetPalaceName,
    mpPortalAtlasPath: portal?.targetAtlasPath ?? null,
    mpPortalRouteId: portal?.targetRouteId,
    mpPortalRouteName: portal?.targetRouteName,
    mpPortalNodeId: portal?.targetNodeId,
  });
}

export function nodeKindProps(kind: MemoryNodeKind) {
  if (kind === "portal") {
    return {
      color: "yellow" as const,
      fill: "solid" as const,
    };
  }

  return {
    color: "light-blue" as const,
    fill: "semi" as const,
  };
}

export function portalDescriptor(portal: PalacePortalRef | null | undefined) {
  if (!portal?.targetPalaceId) return "Unlinked palace";
  const palace = portal.targetPalaceName?.trim() || "Linked palace";
  const route = portal.targetRouteName?.trim();
  return route ? `${palace} / ${route}` : palace;
}

export function memoryNodeFromMeta(meta: MemoryPalaceMeta, title: string): Pick<MemoryNode, "kind" | "portal" | "title"> {
  return {
    kind: nodeKindFromMeta(meta),
    portal: portalRefFromMeta(meta),
    title,
  };
}
