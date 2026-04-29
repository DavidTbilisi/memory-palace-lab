import { createShapeId } from "@tldraw/editor";
import type { MemoryPalaceMeta } from "../../../canvas/memoryMeta";

export interface MockShape {
  id: string;
  type: "geo" | "arrow";
  x: number;
  y: number;
  meta: MemoryPalaceMeta;
  props: Record<string, unknown>;
}

export interface MockBinding {
  fromId: string;
  toId: string;
  type: "arrow";
  props: Record<string, unknown>;
}

const SHAPE_W = 180;
const SHAPE_H = 100;

export class MockEditor {
  private shapes = new Map<string, MockShape>();
  private bindings: MockBinding[] = [];

  run(fn: () => void): this {
    fn();
    return this;
  }

  getCurrentPageShapeIds(): Set<string> {
    return new Set(this.shapes.keys());
  }

  getShape(id: string): MockShape | undefined {
    return this.shapes.get(id);
  }

  getShapePageBounds(id: string): { x: number; y: number; w: number; h: number } | null {
    const s = this.shapes.get(id);
    if (!s) return null;
    return s.type === "arrow"
      ? { x: s.x, y: s.y, w: 0, h: 0 }
      : { x: s.x, y: s.y, w: SHAPE_W, h: SHAPE_H };
  }

  createShape(shape: {
    id: string;
    type: string;
    x?: number;
    y?: number;
    meta?: MemoryPalaceMeta;
    props?: Record<string, unknown>;
  }): void {
    if (shape.type !== "geo" && shape.type !== "arrow") return;
    this.shapes.set(shape.id, {
      id: shape.id,
      type: shape.type,
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      meta: shape.meta ?? {},
      props: shape.props ?? {},
    });
  }

  createShapes(shapes: Array<Parameters<MockEditor["createShape"]>[0]>): void {
    for (const s of shapes) this.createShape(s);
  }

  updateShape(patch: {
    id: string;
    type: string;
    meta?: MemoryPalaceMeta;
    props?: Record<string, unknown>;
  }): void {
    const existing = this.shapes.get(patch.id);
    if (!existing) return;
    if (patch.meta) existing.meta = { ...existing.meta, ...patch.meta };
    if (patch.props) existing.props = { ...existing.props, ...patch.props };
  }

  deleteShape(id: string): void {
    if (!this.shapes.has(id)) return;
    this.shapes.delete(id);
    const cascadedArrowIds = new Set<string>();
    for (const b of this.bindings) {
      if (b.toId === id) cascadedArrowIds.add(b.fromId);
    }
    for (const arrowId of cascadedArrowIds) this.shapes.delete(arrowId);
    this.bindings = this.bindings.filter(
      (b) => b.toId !== id && !cascadedArrowIds.has(b.fromId),
    );
  }

  createBinding(b: { type: string; fromId: string; toId: string; props: Record<string, unknown> }): void {
    if (b.type !== "arrow") return;
    this.bindings.push({ type: "arrow", fromId: b.fromId, toId: b.toId, props: b.props });
  }

  select(_id: unknown): void {
    /* no-op */
  }

  // ── Test-only seeding ────────────────────────────────────────────
  seedNode(palaceId: string, title: string, content = ""): string {
    const shapeId = createShapeId();
    this.shapes.set(shapeId, {
      id: shapeId,
      type: "geo",
      x: 0,
      y: 0,
      meta: {
        mpPalaceId: palaceId,
        mpObjectId: `obj-${shapeId}`,
        mpNodeId: `node-${shapeId}`,
        mpTitle: title,
        mpContent: content,
        mpNodeKind: "memory",
      },
      props: {},
    });
    return shapeId;
  }

  seedEdge(
    palaceId: string,
    fromShapeId: string,
    toShapeId: string,
    cast: { ab: string; cd: string; ef: string; gh: string },
  ): string {
    const fromMeta = this.shapes.get(fromShapeId)!.meta;
    const toMeta = this.shapes.get(toShapeId)!.meta;
    const shapeId = createShapeId();
    this.shapes.set(shapeId, {
      id: shapeId,
      type: "arrow",
      x: 0,
      y: 0,
      meta: {
        mpPalaceId: palaceId,
        mpObjectId: `obj-${shapeId}`,
        mpEdgeId: `edge-${shapeId}`,
        mpSourceNodeId: fromMeta.mpNodeId,
        mpTargetNodeId: toMeta.mpNodeId,
        castAb: cast.ab,
        castCd: cast.cd,
        castEf: cast.ef,
        castGh: cast.gh,
      },
      props: {},
    });
    this.bindings.push({ type: "arrow", fromId: shapeId, toId: fromShapeId, props: { terminal: "start" } });
    this.bindings.push({ type: "arrow", fromId: shapeId, toId: toShapeId, props: { terminal: "end" } });
    return shapeId;
  }
}
