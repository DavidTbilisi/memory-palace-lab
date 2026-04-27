import type { Editor } from "@tldraw/editor";
import { createShapeId } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import { toRichText } from "@tldraw/tlschema";
import type { MemoryNodeKind, PalacePortalRef } from "../domain/entities/types";
import { CAST_WHO } from "../domain/entities/types";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { applyPortalRefToMeta, nodeKindProps } from "./palacePortal";

function arrowheadsFromCastWho(role: string): { start: "none" | "arrow"; end: "none" | "arrow" } {
  // Mermaid encodes peer/mutual relation, so render as bidirectional.
  if (role === CAST_WHO[1]) return { start: "arrow", end: "arrow" };
  return { start: "none", end: "arrow" };
}

function pairedArrowBendMagnitude(
  fromBounds: { x: number; y: number; w: number; h: number },
  toBounds: { x: number; y: number; w: number; h: number },
) {
  const fromCenterX = fromBounds.x + fromBounds.w / 2;
  const fromCenterY = fromBounds.y + fromBounds.h / 2;
  const toCenterX = toBounds.x + toBounds.w / 2;
  const toCenterY = toBounds.y + toBounds.h / 2;
  const distance = Math.hypot(toCenterX - fromCenterX, toCenterY - fromCenterY);
  return Math.round(Math.min(96, Math.max(40, distance * 0.22)));
}

function pairedArrowBendDirection(
  fromBounds: { x: number; y: number; w: number; h: number },
  toBounds: { x: number; y: number; w: number; h: number },
) {
  const fromCenterX = fromBounds.x + fromBounds.w / 2;
  const fromCenterY = fromBounds.y + fromBounds.h / 2;
  const toCenterX = toBounds.x + toBounds.w / 2;
  const toCenterY = toBounds.y + toBounds.h / 2;
  if (Math.abs(toCenterX - fromCenterX) >= Math.abs(toCenterY - fromCenterY)) {
    return fromCenterX <= toCenterX ? 1 : -1;
  }
  return fromCenterY <= toCenterY ? 1 : -1;
}

function reservePairedArrowCurve(
  editor: Editor,
  sourceNodeId: string,
  targetNodeId: string,
  fromBounds: { x: number; y: number; w: number; h: number },
  toBounds: { x: number; y: number; w: number; h: number },
) {
  const bend = pairedArrowBendMagnitude(fromBounds, toBounds) * pairedArrowBendDirection(fromBounds, toBounds);
  let paired = false;

  for (const currentShapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(currentShapeId);
    if (!shape || shape.type !== "arrow") continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (meta.mpSourceNodeId !== targetNodeId || meta.mpTargetNodeId !== sourceNodeId) continue;

    editor.updateShape({
      id: shape.id,
      type: "arrow",
      props: {
        ...shape.props,
        bend: -bend,
        labelPosition: 0.5,
      },
    });
    paired = true;
  }

  return paired ? bend : 0;
}

type CreateGeoMemoryNodeOptions = {
  title?: string;
  content?: string;
  kind?: MemoryNodeKind;
  portal?: PalacePortalRef | null;
};

export type ImportedMemoryNodeInput = {
  title: string;
  content: string;
};

export function createGeoMemoryNode(
  editor: Editor,
  palaceId: string,
  pagePoint: { x: number; y: number },
  options: CreateGeoMemoryNodeOptions = {},
) {
  const objectId = crypto.randomUUID();
  const nodeId = crypto.randomUUID();
  const shapeId = createShapeId();
  const title = options.title?.trim() || "New node";
  const content = options.content ?? "";
  const kind = options.kind ?? "memory";
  const meta = applyPortalRefToMeta(
    {
      mpPalaceId: palaceId,
      mpObjectId: objectId,
      mpNodeId: nodeId,
      mpTitle: title,
      mpContent: content,
    },
    kind,
    options.portal,
  );
  const kindProps = nodeKindProps(kind);
  editor.createShape({
    id: shapeId,
    type: "geo",
    x: pagePoint.x - 90,
    y: pagePoint.y - 50,
    meta,
    props: {
      geo: "rectangle",
      w: 180,
      h: 100,
      dash: "draw",
      growY: 0,
      url: "",
      scale: 1,
      color: kindProps.color,
      labelColor: "black",
      fill: kindProps.fill,
      size: "s",
      font: "draw",
      align: "middle",
      verticalAlign: "middle",
      richText: toRichText(title),
    },
  });
  editor.select(shapeId);
  return { shapeId, objectId, nodeId };
}

export function createImportedMemoryNodes(
  editor: Editor,
  palaceId: string,
  items: ImportedMemoryNodeInput[],
  options?: {
    start?: { x: number; y: number };
    columns?: number;
    gapX?: number;
    gapY?: number;
  },
) {
  if (items.length === 0) return [];
  const start = options?.start ?? { x: 200, y: 180 };
  const columns = Math.max(1, options?.columns ?? 4);
  const gapX = Math.max(100, options?.gapX ?? 240);
  const gapY = Math.max(90, options?.gapY ?? 150);

  const created = items.map((item, index) => {
    const objectId = crypto.randomUUID();
    const nodeId = crypto.randomUUID();
    const shapeId = createShapeId();
    const row = Math.floor(index / columns);
    const column = index % columns;
    const title = item.title.trim() || `Imported node ${index + 1}`;
    const content = item.content ?? "";
    const meta = applyPortalRefToMeta(
      {
        mpPalaceId: palaceId,
        mpObjectId: objectId,
        mpNodeId: nodeId,
        mpTitle: title,
        mpContent: content,
      },
      "memory",
      null,
    );
    return {
      shapeId,
      objectId,
      nodeId,
      shape: {
        id: shapeId,
        type: "geo" as const,
        x: start.x + column * gapX,
        y: start.y + row * gapY,
        meta,
        props: {
          geo: "rectangle" as const,
          w: 180,
          h: 100,
          dash: "draw" as const,
          growY: 0,
          url: "",
          scale: 1,
          color: "violet" as const,
          labelColor: "black" as const,
          fill: "semi" as const,
          size: "s" as const,
          font: "draw" as const,
          align: "middle" as const,
          verticalAlign: "middle" as const,
          richText: toRichText(title),
        },
      },
    };
  });

  editor.createShapes(created.map((entry) => entry.shape));
  editor.select(created[0]!.shapeId);
  return created.map(({ shapeId, objectId, nodeId }) => ({ shapeId, objectId, nodeId }));
}

export function createMemoryArrow(
  editor: Editor,
  palaceId: string,
  fromShapeId: string,
  toShapeId: string,
  sourceNodeId: string,
  targetNodeId: string,
  cast: { ab: string; cd: string; ef: string; gh: string; label?: string },
) {
  const b1 = editor.getShapePageBounds(fromShapeId as TLShapeId);
  const b2 = editor.getShapePageBounds(toShapeId as TLShapeId);
  if (!b1 || !b2) return null;

  const objectId = crypto.randomUUID();
  const edgeId = crypto.randomUUID();
  const shapeId = createShapeId();
  const ax = b1.x + b1.w;
  const ay = b1.y + b1.h / 2;
  const bx = b2.x;
  const by = b2.y + b2.h / 2;

  const meta: MemoryPalaceMeta = {
    mpPalaceId: palaceId,
    mpObjectId: objectId,
    mpEdgeId: edgeId,
    mpSourceNodeId: sourceNodeId,
    mpTargetNodeId: targetNodeId,
    castAb: cast.ab,
    castCd: cast.cd,
    castEf: cast.ef,
    castGh: cast.gh,
  };
  const arrowheads = arrowheadsFromCastWho(cast.ab);
  const bend = reservePairedArrowCurve(editor, sourceNodeId, targetNodeId, b1, b2);

  editor.createShape({
    id: shapeId,
    type: "arrow",
    x: 0,
    y: 0,
    meta,
    props: {
      kind: "arc",
      labelColor: "black",
      color: "violet",
      fill: "none",
      dash: "solid",
      size: "m",
      arrowheadStart: arrowheads.start,
      arrowheadEnd: arrowheads.end,
      font: "draw",
      start: { x: ax, y: ay },
      end: { x: bx, y: by },
      bend,
      richText: toRichText(cast.label ?? ""),
      labelPosition: 0.5,
      scale: 1,
      elbowMidPoint: 0.5,
    },
  });
  editor.createBinding({
    type: "arrow",
    fromId: shapeId,
    toId: fromShapeId as TLShapeId,
    props: {
      terminal: "start",
      snap: "none",
      normalizedAnchor: { x: 0.5, y: 0.5 },
      isPrecise: false,
      isExact: false,
    },
  });
  editor.createBinding({
    type: "arrow",
    fromId: shapeId,
    toId: toShapeId as TLShapeId,
    props: {
      terminal: "end",
      snap: "none",
      normalizedAnchor: { x: 0.5, y: 0.5 },
      isPrecise: false,
      isExact: false,
    },
  });
  return { shapeId, objectId, edgeId };
}
