import type { Editor } from "@tldraw/editor";
import type { TLImageShape } from "@tldraw/tlschema";
import { describe, expect, it } from "vitest";
import { imageNodeMeta } from "./createMemoryShapes";
import { isMemoryNodeShape, isNodeCapableShape } from "./memoryNodeShape";

describe("isMemoryNodeShape", () => {
  it("accepts geo and image shapes that carry a node id", () => {
    expect(isMemoryNodeShape({ type: "geo", meta: { mpNodeId: "n1" } })).toBe(true);
    expect(isMemoryNodeShape({ type: "image", meta: { mpNodeId: "n2" } })).toBe(true);
  });

  it("rejects shapes without a node id, other shape types, and nothing", () => {
    expect(isMemoryNodeShape({ type: "image", meta: {} })).toBe(false);
    expect(isMemoryNodeShape({ type: "arrow", meta: { mpNodeId: "n1" } })).toBe(false);
    expect(isMemoryNodeShape(undefined)).toBe(false);
  });

  it("never treats the palace background as a node", () => {
    const background = { type: "image", meta: { mpBackground: true, mpNodeId: "n1" } };
    expect(isNodeCapableShape(background)).toBe(false);
    expect(isMemoryNodeShape(background)).toBe(false);
  });
});

describe("imageNodeMeta", () => {
  function editorWithAsset(name: string | null) {
    return {
      getAsset: () => (name === null ? undefined : { type: "image", props: { name } }),
    } as unknown as Editor;
  }

  function imageShape(meta: Record<string, unknown> = {}) {
    return { type: "image", meta, props: { assetId: "asset:1" } } as unknown as TLImageShape;
  }

  it("gives an inserted image node identity titled after its file", () => {
    const meta = imageNodeMeta(editorWithAsset("kitchen.png"), "palace-1", imageShape());
    expect(meta).toMatchObject({
      mpPalaceId: "palace-1",
      mpNodeKind: "memory",
      mpTitle: "kitchen",
      mpContent: "",
    });
    expect(meta?.mpNodeId).toBeTruthy();
    expect(meta?.mpObjectId).toBeTruthy();
  });

  it("falls back to a generic title when the asset has no name", () => {
    expect(imageNodeMeta(editorWithAsset(null), "palace-1", imageShape())?.mpTitle).toBe("Image");
  });

  it("leaves existing nodes and the background alone", () => {
    const editor = editorWithAsset("x.png");
    expect(imageNodeMeta(editor, "palace-1", imageShape({ mpNodeId: "n1" }))).toBeNull();
    expect(imageNodeMeta(editor, "palace-1", imageShape({ mpBackground: true }))).toBeNull();
  });
});
