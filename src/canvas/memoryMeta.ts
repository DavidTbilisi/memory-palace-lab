import type { NedfEncoding, NodeAttribute, NodeDifficultyOverride } from "../domain/entities/types";
import type { StoreRole } from "../domain/services/generatedStore";

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
  /** NEDF slots; `null` clears them, for the same reason as `mpImageUrl`. */
  mpNedf?: NedfEncoding | null;
  /** Attributes on UMTF channels; `null` clears them, for the same reason as `mpImageUrl`. */
  mpAttributes?: NodeAttribute[] | null;
  /** In a generated store: where the node is found ("2.3.4"), and what part it plays. */
  mpAddress?: string;
  mpStoreRole?: StoreRole;
  /** The title a store node was generated with; a node still titled this holds nothing of the learner's yet. */
  mpPlaceholder?: string;
  mpPortalPalaceId?: string;
  mpPortalPalaceName?: string;
  mpPortalAtlasPath?: string | null;
  mpPortalRouteId?: string;
  mpPortalRouteName?: string;
  mpPortalNodeId?: string;
  mpSourceNodeId?: string;
  mpTargetNodeId?: string;
  /** On an arrow: "confusion" marks a confusion link; absent or `null` is an ordinary CAST edge. */
  mpEdgeKind?: "confusion" | null;
  castAb?: string;
  castCd?: string;
  castEf?: string;
  castGh?: string;
};
