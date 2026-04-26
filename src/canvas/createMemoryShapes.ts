import type { Editor } from "@tldraw/editor";
import { createShapeId } from "@tldraw/editor";
import type { TLAssetId, TLShapeId } from "@tldraw/tlschema";
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

type BackgroundAsset = {
  src: string;
  mimeType: string;
  width: number;
  height: number;
  storedPath?: string;
};

function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function inferImageMimeType(path: string) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "image/png";
}

function inferImageExtension(path: string) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".jpeg")) return "jpeg";
  if (lower.endsWith(".jpg")) return "jpg";
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  if (lower.endsWith(".gif")) return "gif";
  if (lower.endsWith(".svg")) return "svg";
  return "png";
}

function loadImageDimensions(src: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: Math.max(1, image.naturalWidth || image.width || 1),
        height: Math.max(1, image.naturalHeight || image.height || 1),
      });
    };
    image.onerror = () => reject(new Error("Failed to decode the selected image."));
    image.src = src;
  });
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read image file "${file.name}".`));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(`Failed to read image file "${file.name}".`));
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function promptBrowserImageFile() {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

async function selectBrowserBackgroundAsset(): Promise<BackgroundAsset | null> {
  const file = await promptBrowserImageFile();
  if (!file) return null;
  const src = await readFileAsDataUrl(file);
  const { width, height } = await loadImageDimensions(src);
  return {
    src,
    mimeType: file.type || inferImageMimeType(file.name),
    width,
    height,
  };
}

async function selectTauriBackgroundAsset(palaceId: string): Promise<BackgroundAsset | null> {
  const [{ open }, { appDataDir, join }, { BaseDirectory, copyFile, mkdir }, { convertFileSrc }] =
    await Promise.all([
      import("@tauri-apps/plugin-dialog"),
      import("@tauri-apps/api/path"),
      import("@tauri-apps/plugin-fs"),
      import("@tauri-apps/api/core"),
    ]);

  const selected = await open({
    title: "Choose palace background",
    multiple: false,
    filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg", "webp", "gif", "svg"] }],
  });
  if (!selected || Array.isArray(selected)) return null;

  const backgroundsDir = "palace-backgrounds";
  const filename = `${palaceId}-${crypto.randomUUID()}.${inferImageExtension(selected)}`;
  await mkdir(backgroundsDir, { baseDir: BaseDirectory.AppData, recursive: true });
  await copyFile(selected, `${backgroundsDir}/${filename}`, { toPathBaseDir: BaseDirectory.AppData });

  const storedPath = await join(await appDataDir(), backgroundsDir, filename);
  const src = convertFileSrc(storedPath);
  const { width, height } = await loadImageDimensions(src);
  return {
    src,
    mimeType: inferImageMimeType(filename),
    width,
    height,
    storedPath,
  };
}

async function selectBackgroundAsset(palaceId: string): Promise<BackgroundAsset | null> {
  if (isTauriRuntime()) {
    return selectTauriBackgroundAsset(palaceId);
  }
  return selectBrowserBackgroundAsset();
}

function fitImageToViewport(width: number, height: number, viewport: { x: number; y: number; w: number; h: number }) {
  const scale = Math.max(0.1, Math.min(viewport.w / width, viewport.h / height));
  const w = Math.max(120, Math.round(width * scale));
  const h = Math.max(120, Math.round(height * scale));
  return {
    w,
    h,
    x: viewport.x + (viewport.w - w) / 2,
    y: viewport.y + (viewport.h - h) / 2,
  };
}

function removeExistingBackgroundShapes(editor: Editor) {
  const backgroundShapeIds: TLShapeId[] = [];
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!shape || shape.type !== "image") continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (!meta.mpBackground) continue;
    backgroundShapeIds.push(shape.id);
  }
  if (backgroundShapeIds.length > 0) {
    editor.deleteShapes(backgroundShapeIds);
  }
}

async function notifyBackgroundImageError(messageText: string) {
  if (isTauriRuntime()) {
    try {
      const { message } = await import("@tauri-apps/plugin-dialog");
      await message(messageText, { title: "Background image", kind: "error" });
      return;
    } catch {
      // Fall through to alert when the Tauri dialog helper is unavailable.
    }
  }
  if (typeof window !== "undefined") {
    window.alert(messageText);
  }
}

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

export async function insertBackgroundImageFromFile(editor: Editor, palaceId: string) {
  try {
    const asset = await selectBackgroundAsset(palaceId);
    if (!asset) return;

    removeExistingBackgroundShapes(editor);

    const assetId = `asset:${crypto.randomUUID()}` as TLAssetId;
    editor.createAssets([
      {
        id: assetId,
        type: "image",
        props: {
          name: "Background",
          src: asset.src,
          w: asset.width,
          h: asset.height,
          mimeType: asset.mimeType,
          isAnimated: asset.mimeType === "image/gif",
        },
        meta: {},
      } as Parameters<Editor["createAssets"]>[0][number],
    ]);

    const viewport = editor.getViewportPageBounds();
    const fitted = fitImageToViewport(asset.width, asset.height, viewport);
    const shapeId = createShapeId();
    editor.createShape({
      id: shapeId,
      type: "image",
      x: fitted.x,
      y: fitted.y,
      isLocked: true,
      opacity: 0.92,
      meta: {
        mpPalaceId: palaceId,
        mpBackground: true,
        mpBackgroundAssetPath: asset.storedPath,
      } as MemoryPalaceMeta,
      props: {
        w: fitted.w,
        h: fitted.h,
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
    editor.setSelectedShapes([]);
  } catch (error) {
    console.error("Failed to insert background image", error);
    await notifyBackgroundImageError(
      "Background image import failed. The app could not read or place the selected image.",
    );
  }
}
