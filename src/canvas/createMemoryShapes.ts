import type { Editor } from "@tldraw/editor";
import { createShapeId } from "@tldraw/editor";
import type { TLAssetId, TLShapeId } from "@tldraw/tlschema";
import { toRichText } from "@tldraw/tlschema";
import { CAST_WHO } from "../domain/entities/types";
import type { MemoryPalaceMeta } from "./memoryMeta";

function arrowheadsFromCastWho(role: string): { start: "none" | "arrow"; end: "none" | "arrow" } {
  // Mermaid encodes peer/mutual relation, so render as bidirectional.
  if (role === CAST_WHO[1]) return { start: "arrow", end: "arrow" };
  return { start: "none", end: "arrow" };
}

export function createGeoMemoryNode(editor: Editor, palaceId: string, pagePoint: { x: number; y: number }) {
  const objectId = crypto.randomUUID();
  const nodeId = crypto.randomUUID();
  const shapeId = createShapeId();
  const meta: MemoryPalaceMeta = {
    mpPalaceId: palaceId,
    mpObjectId: objectId,
    mpNodeId: nodeId,
    mpTitle: "New node",
    mpContent: "",
  };
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
      color: "light-blue",
      labelColor: "black",
      fill: "semi",
      size: "s",
      font: "draw",
      align: "middle",
      verticalAlign: "middle",
      richText: toRichText("New node"),
    },
  });
  editor.select(shapeId);
  return { shapeId, objectId, nodeId };
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
      bend: 0,
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

export async function insertBackgroundImageFromFile(editor: Editor, palaceId: string) {
  const { open } = await import("@tauri-apps/plugin-dialog");
  const { convertFileSrc } = await import("@tauri-apps/api/core");
  const path = await open({
    multiple: false,
    filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }],
  });
  if (path === null || Array.isArray(path)) return;
  const src = convertFileSrc(path);
  const w = 1200;
  const h = 800;
  const assetId = `asset:${crypto.randomUUID()}` as TLAssetId;
  editor.createAssets([
    {
      id: assetId,
      type: "image",
      props: {
        name: "Background",
        src,
        w,
        h,
        mimeType: "image/jpeg",
        isAnimated: false,
      },
      meta: {},
    } as Parameters<Editor["createAssets"]>[0][number],
  ]);

  const vp = editor.getViewportPageBounds();
  const shapeId = createShapeId();
  editor.createShape({
    id: shapeId,
    type: "image",
    x: vp.x,
    y: vp.y,
    isLocked: true,
    opacity: 0.85,
    meta: { mpPalaceId: palaceId, mpBackground: true } as MemoryPalaceMeta,
    props: {
      w,
      h,
      assetId,
      playing: true,
      url: "",
      crop: null,
      flipX: false,
      flipY: false,
      altText: "Palace background",
    },
  });
  editor.sendToBack([shapeId]);
}
