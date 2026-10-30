/**
 * Generated loci stores: palaces the app lays out itself, whose cells are found by address rather
 * than by walking. The app makes the structure and the addresses; every image in it is the
 * learner's, starting as a placeholder they rename.
 */

/**
 * A node's part in a generated store. Cells hold material; the rest is the scaffold that finds
 * them: a block's theme and stickers, or a table's number images and their associations.
 */
export const STORE_ROLES = ["theme", "sticker", "number", "image", "cell"] as const;
export type StoreRole = (typeof STORE_ROLES)[number];

export type FourLevelBlock = {
  kind: "four-level-block";
  theme: string;
  generatedAt: string;
  /** The block's route: its cells in address order, created as a draft. */
  routeId: string | null;
};

/** A table of support images, grown one number at a time; its numbers live on the canvas. */
export type SupportTable = {
  kind: "support-table";
  generatedAt: string;
};

export type GeneratedStore = FourLevelBlock | SupportTable;
export type StoreKind = GeneratedStore["kind"];

export const STORE_KIND_LABELS: Record<StoreKind, string> = {
  "four-level-block": "Four-level block",
  "support-table": "Table of support images",
};

/** A four-level block has five branches of five stickers, each sticker five cells: 125 in all. */
export const BLOCK_SIZE = 5;
export const BLOCK_CELL_COUNT = BLOCK_SIZE ** 3;

export function parseStore(storeJson: string | null | undefined): GeneratedStore | null {
  if (!storeJson) return null;
  try {
    const raw = JSON.parse(storeJson) as Record<string, unknown>;
    if (raw.kind === "support-table") {
      return { kind: "support-table", generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : "" };
    }
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
 * What a learner types into "Go to address", as the address it means in a store of this kind.
 * In a block "3.2.4", "3 2 4" and "324" all find cell 3.2.4, and "3.2" a sticker. In a table
 * "47.3", "47 3" and "473" find cell 47.3, "7.3" finds 07.3, and "47" the number itself.
 * Null when it cannot be one.
 */
export function normalizeAddress(input: string, kind: StoreKind = "four-level-block"): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (kind === "support-table") {
    const match = /^(\d{1,2})(?:[\s.·,/-]+([1-9]))?$/.exec(trimmed) ?? /^(\d{2})([1-9])$/.exec(trimmed);
    if (!match) return null;
    const number = formatTableNumber(Number(match[1]));
    return match[2] ? `${number}.${match[2]}` : number;
  }
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

// ── Table of support images ─────────────────────────────────────────────────────────────────

/** The learner's two-digit number code: 00 to 99. */
export const TABLE_NUMBER_COUNT = 100;
/** Three associated images per number, three parts each: nine cells. */
export const TABLE_CELLS_PER_NUMBER = 9;
export const TABLE_IMAGE_LETTERS = ["a", "b", "c"] as const;

export function formatTableNumber(number: number): string {
  return String(number).padStart(2, "0");
}

/** What the learner writes for one number: its image, three associations, three parts of each. */
export type NumberClusterInput = {
  number: number;
  image: string;
  associations: [string, string, string];
  parts: [[string, string, string], [string, string, string], [string, string, string]];
};

export type ClusterSlot = BlockSlot & { title: string };

export const TABLE_NODE_SIZE = {
  number: { w: 210, h: 64 },
  image: { w: 150, h: 56 },
  cell: { w: 150, h: 44 },
} as const;

const TABLE_COLUMN_GAP = 14;
const TABLE_ROW_GAP = 10;
const CLUSTER_GAP = 90;

function clusterSize() {
  const width = 3 * TABLE_NODE_SIZE.image.w + 2 * TABLE_COLUMN_GAP;
  const height =
    TABLE_NODE_SIZE.number.h + TABLE_NODE_SIZE.image.h + 3 * TABLE_NODE_SIZE.cell.h + 5 * TABLE_ROW_GAP + TABLE_ROW_GAP;
  return { width, height };
}

/**
 * One number's cluster, placed on a 10 × 10 grid by its digits (47 sits at row 4, column 7) so the
 * table grows into place: the number on top, its three chained associations in a row, and each
 * association's three parts beneath it as cells N.1 to N.9, left to right. A blank field keeps a
 * placeholder the learner can rename later.
 */
export function numberClusterSlots(input: NumberClusterInput): ClusterSlot[] {
  const code = formatTableNumber(input.number);
  const { width, height } = clusterSize();
  const left = (input.number % 10) * (width + CLUSTER_GAP);
  const top = Math.floor(input.number / 10) * (height + CLUSTER_GAP);
  const slots: ClusterSlot[] = [];
  const text = (value: string | undefined, fallback: string) => value?.trim() || fallback;

  const numberPlaceholder = `${code} · number image`;
  slots.push({
    role: "number",
    address: code,
    placeholder: numberPlaceholder,
    title: text(input.image, numberPlaceholder),
    x: left + width / 2,
    y: top + TABLE_NODE_SIZE.number.h / 2,
    ...TABLE_NODE_SIZE.number,
  });
  const imagesTop = top + TABLE_NODE_SIZE.number.h + TABLE_ROW_GAP * 2;
  TABLE_IMAGE_LETTERS.forEach((letter, i) => {
    const x = left + i * (TABLE_NODE_SIZE.image.w + TABLE_COLUMN_GAP) + TABLE_NODE_SIZE.image.w / 2;
    const imagePlaceholder = `${code} · image ${letter}`;
    slots.push({
      role: "image",
      address: `${code}.${letter}`,
      placeholder: imagePlaceholder,
      title: text(input.associations[i], imagePlaceholder),
      x,
      y: imagesTop + TABLE_NODE_SIZE.image.h / 2,
      ...TABLE_NODE_SIZE.image,
    });
    for (let p = 0; p < 3; p++) {
      const cell = i * 3 + p + 1;
      const address = `${code}.${cell}`;
      const y =
        imagesTop + TABLE_NODE_SIZE.image.h + TABLE_ROW_GAP + p * (TABLE_NODE_SIZE.cell.h + TABLE_ROW_GAP) + TABLE_NODE_SIZE.cell.h / 2;
      slots.push({ role: "cell", address, placeholder: address, title: text(input.parts[i]?.[p], address), x, y, ...TABLE_NODE_SIZE.cell });
    }
  });
  return slots;
}
