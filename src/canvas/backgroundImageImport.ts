import type { Editor } from "@tldraw/editor";
import { createShapeId } from "@tldraw/editor";
import type { TLAssetId, TLShapeId } from "@tldraw/tlschema";
import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, join } from "@tauri-apps/api/path";
import { message, open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, copyFile, mkdir } from "@tauri-apps/plugin-fs";
import type { MemoryPalaceMeta } from "./memoryMeta";

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

export async function insertBackgroundImageFromFile(editor: Editor, palaceId: string) {
  try {
    const asset = await selectBackgroundAsset(palaceId);
    if (!asset) return;

    removeExistingBackgroundShapes(editor);

    const assetId = `asset:${crypto.randomUUID()}` as TLAssetId;
    editor.createAssets([
      {
        id: assetId,
        typeName: "asset",
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
    const backgroundMeta: MemoryPalaceMeta = {
      mpPalaceId: palaceId,
      mpBackground: true,
    };
    if (asset.storedPath) {
      backgroundMeta.mpBackgroundAssetPath = asset.storedPath;
    }
    editor.createShape({
      id: shapeId,
      type: "image",
      x: fitted.x,
      y: fitted.y,
      isLocked: true,
      opacity: 0.92,
      meta: backgroundMeta,
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
