import { getIndexAbove, type IndexKey } from "@tldraw/editor";
import { createBindingId } from "@tldraw/tlschema";
import type { MemoryPalaceMeta } from "../../src/canvas/memoryMeta";

/**
 * A headless stand-in for the tldraw Editor, backed by the record map stored
 * in `palaces.editor_snapshot`. It exposes the same structural surface as the
 * app's MockEditor (src/domain/services/palaceDsl/mockEditor.ts), which is the
 * exact interface used by createMemoryShapes.ts and palaceDsl/sync.ts — so the
 * app's own shape factories and DSL-apply logic run against it unchanged.
 */

type RecordMap = Record<string, Record<string, unknown>>;

type ShapeRecord = {
  typeName: "shape";
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  index: string;
  parentId: string;
  isLocked: boolean;
  opacity: number;
  props: Record<string, unknown>;
  meta: MemoryPalaceMeta & Record<string, unknown>;
};

type BindingRecord = {
  typeName: "binding";
  id: string;
  type: string;
  fromId: string;
  toId: string;
  props: Record<string, unknown>;
  meta: Record<string, unknown>;
};

type ParsedSnapshot =
  | { kind: "editor"; raw: { document: { store: RecordMap; schema: unknown }; session?: unknown } }
  | { kind: "store"; raw: { store: RecordMap; schema: unknown } };

function parseSnapshotJson(json: string): ParsedSnapshot {
  const raw = JSON.parse(json) as Record<string, unknown>;
  if (raw && typeof raw === "object" && "document" in raw) {
    return {
      kind: "editor",
      raw: raw as { document: { store: RecordMap; schema: unknown }; session?: unknown },
    };
  }
  if (raw && typeof raw === "object" && "store" in raw) {
    return { kind: "store", raw: raw as { store: RecordMap; schema: unknown } };
  }
  throw new Error("editor_snapshot is neither a TLEditorSnapshot nor a TLStoreSnapshot");
}

export class SnapshotEditor {
  private parsed: ParsedSnapshot;
  private store: RecordMap;
  private pageId: string;

  constructor(editorSnapshotJson: string) {
    this.parsed = parseSnapshotJson(editorSnapshotJson);
    this.store =
      this.parsed.kind === "editor" ? this.parsed.raw.document.store : this.parsed.raw.store;

    const page = Object.values(this.store).find((r) => r.typeName === "page");
    if (!page) throw new Error("editor_snapshot has no page record");
    this.pageId = String(page.id);
  }

  // ── Editor surface used by createMemoryShapes.ts and palaceDsl/sync.ts ──

  run(fn: () => void): this {
    fn();
    return this;
  }

  getCurrentPageShapeIds(): Set<string> {
    const ids = new Set<string>();
    for (const r of Object.values(this.store)) {
      if (r.typeName === "shape" && r.parentId === this.pageId) ids.add(String(r.id));
    }
    return ids;
  }

  getShape(id: string): ShapeRecord | undefined {
    const r = this.store[id];
    if (!r || r.typeName !== "shape") return undefined;
    return r as ShapeRecord;
  }

  getShapePageBounds(id: string): { x: number; y: number; w: number; h: number } | null {
    const s = this.getShape(id);
    if (!s) return null;
    if (s.type === "arrow") return { x: s.x, y: s.y, w: 0, h: 0 };
    const w = typeof s.props.w === "number" ? s.props.w : 0;
    const h = typeof s.props.h === "number" ? s.props.h : 0;
    const growY = typeof s.props.growY === "number" ? s.props.growY : 0;
    // Palace shapes are page-parented and unrotated, so local == page coords.
    return { x: s.x, y: s.y, w, h: h + growY };
  }

  private nextIndex(): string {
    // Fractional indexes order lexicographically, so plain string sort works.
    const top = Object.values(this.store)
      .filter((r) => r.typeName === "shape" && r.parentId === this.pageId)
      .map((r) => String(r.index))
      .sort()
      .pop();
    return getIndexAbove((top ?? null) as IndexKey | null);
  }

  createShape(shape: {
    id: string;
    type: string;
    x?: number;
    y?: number;
    meta?: MemoryPalaceMeta;
    props?: Record<string, unknown>;
  }): void {
    const record: ShapeRecord = {
      typeName: "shape",
      id: shape.id,
      type: shape.type,
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      rotation: 0,
      index: this.nextIndex(),
      parentId: this.pageId,
      isLocked: false,
      opacity: 1,
      props: shape.props ?? {},
      meta: (shape.meta ?? {}) as ShapeRecord["meta"],
    };
    this.store[record.id] = record as unknown as Record<string, unknown>;
  }

  createShapes(shapes: Array<Parameters<SnapshotEditor["createShape"]>[0]>): void {
    for (const s of shapes) this.createShape(s);
  }

  updateShape(patch: {
    id: string;
    type: string;
    x?: number;
    y?: number;
    meta?: MemoryPalaceMeta;
    props?: Record<string, unknown>;
  }): void {
    const existing = this.getShape(patch.id);
    if (!existing) return;
    if (typeof patch.x === "number") existing.x = patch.x;
    if (typeof patch.y === "number") existing.y = patch.y;
    if (patch.meta) existing.meta = { ...existing.meta, ...patch.meta };
    if (patch.props) existing.props = { ...existing.props, ...patch.props };
  }

  deleteShape(id: string): void {
    const shape = this.getShape(id);
    if (!shape) return;
    delete this.store[id];

    // Cascade: arrows bound to this shape disappear, along with all bindings
    // touching the deleted records — mirrors MockEditor.deleteShape.
    const cascadedArrowIds = new Set<string>();
    for (const r of Object.values(this.store)) {
      if (r.typeName !== "binding") continue;
      const b = r as unknown as BindingRecord;
      if (b.toId === id) cascadedArrowIds.add(b.fromId);
    }
    for (const arrowId of cascadedArrowIds) delete this.store[arrowId];
    for (const [recordId, r] of Object.entries(this.store)) {
      if (r.typeName !== "binding") continue;
      const b = r as unknown as BindingRecord;
      if (b.toId === id || b.fromId === id || cascadedArrowIds.has(b.fromId)) {
        delete this.store[recordId];
      }
    }
  }

  createBinding(b: {
    type: string;
    fromId: string;
    toId: string;
    props: Record<string, unknown>;
  }): void {
    const record: BindingRecord = {
      typeName: "binding",
      id: createBindingId(),
      type: b.type,
      fromId: b.fromId,
      toId: b.toId,
      props: b.props,
      meta: {},
    };
    this.store[record.id] = record as unknown as Record<string, unknown>;
  }

  select(_id: unknown): void {
    /* no-op in headless mode */
  }

  // ── Serialization ────────────────────────────────────────────────

  /** Re-embed the (mutated) record map into the original snapshot shape. */
  serialize(): string {
    if (this.parsed.kind === "editor") {
      return JSON.stringify({
        ...this.parsed.raw,
        document: { ...this.parsed.raw.document, store: this.store },
      });
    }
    return JSON.stringify({ ...this.parsed.raw, store: this.store });
  }
}

/**
 * Baseline TLStoreSnapshot for palaces that were created but never saved by
 * the app (editor_snapshot IS NULL). The app's parseEditorSnapshot accepts a
 * bare TLStoreSnapshot, so this loads cleanly on the canvas.
 */
export async function createBaselineSnapshotJson(): Promise<string> {
  const { createTLStore, defaultShapeUtils, defaultBindingUtils } = await import("tldraw");
  const store = createTLStore({
    shapeUtils: defaultShapeUtils,
    bindingUtils: defaultBindingUtils,
  });
  // Creates the default document + page records; exists at runtime but is not
  // part of TLStore's public typings.
  (store as unknown as { ensureStoreIsUsable(): void }).ensureStoreIsUsable();
  return JSON.stringify(store.getStoreSnapshot());
}
