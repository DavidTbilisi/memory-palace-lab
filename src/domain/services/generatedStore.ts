/**
 * Generated loci stores: palaces the app lays out itself, whose cells are found by address rather
 * than by walking. The app makes the structure and the addresses; every image in it is the
 * learner's, starting as a placeholder they rename.
 */

/** A node's part in a generated store. Cells hold material; the rest is the scaffold that finds them. */
export const STORE_ROLES = ["theme", "sticker", "cell"] as const;
export type StoreRole = (typeof STORE_ROLES)[number];

export type FourLevelBlock = {
  kind: "four-level-block";
  theme: string;
  generatedAt: string;
  /** The block's route: its cells in address order, created as a draft. */
  routeId: string | null;
};

export type GeneratedStore = FourLevelBlock;

export const STORE_KIND_LABELS: Record<GeneratedStore["kind"], string> = {
  "four-level-block": "Four-level block",
};

/** A four-level block has five branches of five stickers, each sticker five cells: 125 in all. */
export const BLOCK_SIZE = 5;
export const BLOCK_CELL_COUNT = BLOCK_SIZE ** 3;

export function parseStore(storeJson: string | null | undefined): GeneratedStore | null {
  if (!storeJson) return null;
  try {
    const raw = JSON.parse(storeJson) as Record<string, unknown>;
    if (raw.kind === "four-level-block" && typeof raw.theme === "string") {
      return {
        kind: "four-level-block",
        theme: raw.theme,
        generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : "",
        routeId: typeof raw.routeId === "string" ? raw.routeId : null,
      };
    }
  } catch {
    // not a store
  }
  return null;
}

export function serializeStore(store: GeneratedStore): string {
  return JSON.stringify(store);
}

export function isStoreRole(value: unknown): value is StoreRole {
  return typeof value === "string" && (STORE_ROLES as readonly string[]).includes(value);
}

/** One node of a four-level block: where it sits, what it is, and its placeholder title. */
export type BlockSlot = {
  role: StoreRole;
  /** "b.s" for a sticker, "b.s.p" for a cell; the theme has none. */
  address: string | null;
  placeholder: string;
  /** Centre of the node, in page space relative to the block's origin. */
  x: number;
  y: number;
  w: number;
  h: number;
};

export const BLOCK_NODE_SIZE = {
  theme: { w: 200, h: 100 },
  sticker: { w: 170, h: 70 },
  cell: { w: 150, h: 48 },
} as const;

const COLUMN_GAP = 40;
const CELL_GAP = 10;
const BRANCH_GAP = 70;
/** The theme sits left of the branches. */
const THEME_OFFSET_X = 280;

function branchHeight(): number {
  return BLOCK_NODE_SIZE.sticker.h + CELL_GAP * 2 + BLOCK_SIZE * (BLOCK_NODE_SIZE.cell.h + CELL_GAP);
}

/**
 * Every node of a four-level block, in address order: the theme, then each branch's stickers
 * left to right, each with its five cells stacked beneath it. The theme is not addressed; the
 * sixth, connecting part of a sticker is never a slot.
 */
export function fourLevelBlockSlots(theme: string): BlockSlot[] {
  const slots: BlockSlot[] = [];
  const rowHeight = branchHeight() + BRANCH_GAP;
  const totalHeight = BLOCK_SIZE * rowHeight - BRANCH_GAP;
  slots.push({ role: "theme", address: null, placeholder: theme.trim() || "Theme", x: -THEME_OFFSET_X, y: totalHeight / 2, ...BLOCK_NODE_SIZE.theme });
  for (let b = 1; b <= BLOCK_SIZE; b++) {
    const top = (b - 1) * rowHeight;
    for (let s = 1; s <= BLOCK_SIZE; s++) {
      const x = (s - 1) * (BLOCK_NODE_SIZE.sticker.w + COLUMN_GAP) + BLOCK_NODE_SIZE.sticker.w / 2;
      const stickerY = top + BLOCK_NODE_SIZE.sticker.h / 2;
      slots.push({ role: "sticker", address: `${b}.${s}`, placeholder: `Sticker ${b}.${s}`, x, y: stickerY, ...BLOCK_NODE_SIZE.sticker });
      for (let p = 1; p <= BLOCK_SIZE; p++) {
        const y = top + BLOCK_NODE_SIZE.sticker.h + CELL_GAP * 2 + (p - 1) * (BLOCK_NODE_SIZE.cell.h + CELL_GAP) + BLOCK_NODE_SIZE.cell.h / 2;
        slots.push({ role: "cell", address: `${b}.${s}.${p}`, placeholder: `${b}.${s}.${p}`, x, y, ...BLOCK_NODE_SIZE.cell });
      }
    }
  }
  return slots;
}

/** The placeholder title a four-level block gives the node at this role and address. */
export function blockPlaceholder(role: StoreRole, address: string | null, theme: string): string {
  if (role === "theme") return theme.trim() || "Theme";
  if (role === "sticker") return `Sticker ${address ?? ""}`;
  return address ?? "";
}

/**
 * What a learner types into "Go to address", as the address it means: "3.2.4", "3 2 4" and
 * "324" all find cell 3.2.4, and "3.2" finds a sticker. Null when it cannot be one.
 */
export function normalizeAddress(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const parts = /^\d+$/.test(trimmed) && trimmed.length <= 3 ? trimmed.split("") : trimmed.split(/[\s.·,/-]+/).filter(Boolean);
  if (parts.length < 2 || parts.length > 3 || !parts.every((part) => /^\d+$/.test(part))) return null;
  return parts.map((part) => String(Number(part))).join(".");
}

/** What decides whether a store node holds the learner's material. */
export type StoreNodeState = {
  title: string;
  placeholder: string;
  content?: string | null;
  imageUrl?: string | null;
  hasNedf?: boolean;
  hasAttributes?: boolean;
};

/**
 * A node is filled once the learner has put something in it: a title of their own, content, an
 * image, NEDF slots, or attributes. Filled nodes are what regenerating must not overwrite unasked.
 */
export function isStoreNodeFilled(node: StoreNodeState): boolean {
  const content = (node.content ?? "").replace(/<[^>]*>/g, "").trim();
  return (
    node.title.trim() !== node.placeholder.trim() ||
    content !== "" ||
    !!node.imageUrl ||
    !!node.hasNedf ||
    !!node.hasAttributes
  );
}
