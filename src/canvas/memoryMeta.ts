import type { NodeDifficultyOverride } from "../domain/entities/types";

export type MemoryPalaceMeta = {
  mpPalaceId?: string;
  mpObjectId?: string;
  mpNodeId?: string;
  mpNodeKind?: "memory" | "portal";
  mpBackground?: boolean;
  mpBackgroundAssetPath?: string;
  mpEdgeId?: string;
  mpTitle?: string;
  mpAlias?: string;
  mpContent?: string;
  /** `null` clears an image; tldraw merges meta key by key, so absence cannot. */
  mpImageUrl?: string | null;
  mpTags?: string[];
  /** `null` clears an override, for the same reason as `mpImageUrl`. */
  mpDifficulty?: NodeDifficultyOverride | null;
  mpPortalPalaceId?: string;
  mpPortalPalaceName?: string;
  mpPortalAtlasPath?: string | null;
  mpPortalRouteId?: string;
  mpPortalRouteName?: string;
  mpPortalNodeId?: string;
  mpSourceNodeId?: string;
  mpTargetNodeId?: string;
  castAb?: string;
  castCd?: string;
  castEf?: string;
  castGh?: string;
};
