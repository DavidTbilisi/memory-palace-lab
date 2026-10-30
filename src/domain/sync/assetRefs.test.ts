import { describe, expect, it } from "vitest";
import type { PalaceSnapshot } from "../entities/types";
import {
  collectLocalAssets,
  collectVaultAssetHashes,
  localPathOf,
  localizeAssets,
  portableizeAssets,
  VAULT_ASSET_SCHEME,
} from "./assetRefs";

const HASH = "a".repeat(64);
const LOCAL_PATH = "/home/david/.local/share/com.memorypalace.lab/palace-backgrounds/bg.png";
const ASSET_URL = "http://asset.localhost/home/david/.local/share/com.memorypalace.lab/palace-backgrounds/bg.png";

function snapshot(): PalaceSnapshot {
  return {
    palace: {
      id: "palace-1",
      name: "Palace",
      createdAt: "2026-01-01T00:00:00.000Z",
      editorSnapshot: JSON.stringify({
        store: {
          "asset:1": { id: "asset:1", typeName: "asset", props: { src: ASSET_URL } },
          "shape:bg": {
            id: "shape:bg",
            meta: { mpPalaceId: "palace-1", mpBackground: true, mpBackgroundAssetPath: LOCAL_PATH },
          },
          "shape:remote": {
            id: "shape:remote",
            meta: { mpPalaceId: "palace-1", mpImageUrl: "https://example.com/picture.png" },
          },
          "shape:inline": {
            id: "shape:inline",
            meta: { mpPalaceId: "palace-1", mpImageUrl: "data:image/png;base64,AAAA" },
          },
        },
        schema: {},
      }),
      deletedAt: null,
      purgeAt: null,
    },
    canvasObjects: [],
    nodes: [
      {
        id: "node-1",
        objectId: "obj-1",
        title: "With image",
        content: "",
        kind: "memory",
        portal: null,
        // What the canvas actually renders from is the asset URL, not a bare path.
        imageUrl: ASSET_URL,
      },
    ],
    edges: [],
    routes: [],
    loci: [],
  };
}

describe("localPathOf", () => {
  it.each([
    ["an absolute posix path", "/home/a/b.png"],
    ["a windows path", "C:\\Users\\a\\b.png"],
    ["an asset protocol url", "asset://localhost/home/a/b.png"],
    ["a localhost asset url", "http://asset.localhost/home/a/b.png"],
  ])("recognises %s as local", (_label, value) => {
    expect(localPathOf(value)).toBeTruthy();
  });

  it.each([
    ["a remote image", "https://example.com/a.png"],
    ["an inline image", "data:image/png;base64,AAAA"],
    ["a vault reference", `${VAULT_ASSET_SCHEME}${HASH}`],
    ["nothing at all", ""],
  ])("leaves %s alone", (_label, value) => {
    expect(localPathOf(value)).toBeNull();
  });

  it("decodes a percent-encoded path", () => {
    expect(localPathOf("http://asset.localhost/home/a%20b/c.png")).toBe("/home/a b/c.png");
  });
});

describe("collectLocalAssets", () => {
  it("finds the background path, its asset url, and a node image", () => {
    const found = collectLocalAssets(snapshot()).map((ref) => ref.value);
    expect(found).toContain(LOCAL_PATH);
    expect(found).toContain(ASSET_URL);
  });

  it("ignores images that already travel", () => {
    const found = collectLocalAssets(snapshot()).map((ref) => ref.value);
    expect(found).not.toContain("https://example.com/picture.png");
    expect(found.some((v) => v.startsWith("data:"))).toBe(false);
  });
});

describe("portableizeAssets", () => {
  it("replaces every local reference with a content hash", () => {
    const map = new Map([
      [LOCAL_PATH, HASH],
      [ASSET_URL, HASH],
    ]);
    const portable = portableizeAssets(snapshot(), map);

    expect(portable.palace.editorSnapshot).not.toContain(LOCAL_PATH);
    expect(portable.palace.editorSnapshot).toContain(`${VAULT_ASSET_SCHEME}${HASH}`);
    expect(portable.nodes[0].imageUrl).toBe(`${VAULT_ASSET_SCHEME}${HASH}`);
    expect(collectVaultAssetHashes(portable)).toEqual([HASH]);
  });

  it("leaves remote and inline images untouched", () => {
    const portable = portableizeAssets(snapshot(), new Map([[LOCAL_PATH, HASH]]));
    expect(portable.palace.editorSnapshot).toContain("https://example.com/picture.png");
    expect(portable.palace.editorSnapshot).toContain("data:image/png;base64,AAAA");
  });

  it("does not modify the snapshot it was given", () => {
    const source = snapshot();
    const before = JSON.stringify(source);
    portableizeAssets(source, new Map([[LOCAL_PATH, HASH]]));
    expect(JSON.stringify(source)).toBe(before);
  });
});

describe("localizeAssets", () => {
  const ON_THIS_DEVICE = { path: "/var/other-device/backgrounds/bg.png", url: "asset://localhost/var/other-device/backgrounds/bg.png" };

  it("rewrites vault references to this machine's own copy", () => {
    const portable = portableizeAssets(
      snapshot(),
      new Map([
        [LOCAL_PATH, HASH],
        [ASSET_URL, HASH],
      ]),
    );

    const local = localizeAssets(portable, new Map([[HASH, ON_THIS_DEVICE]]));
    const store = JSON.parse(local.palace.editorSnapshot!).store;

    // The stored path is a filesystem path; what tldraw draws from is the url.
    expect(store["shape:bg"].meta.mpBackgroundAssetPath).toBe(ON_THIS_DEVICE.path);
    expect(store["asset:1"].props.src).toBe(ON_THIS_DEVICE.url);
  });

  it("round-trips back to an equivalent snapshot", () => {
    const portable = portableizeAssets(
      snapshot(),
      new Map([
        [LOCAL_PATH, HASH],
        [ASSET_URL, HASH],
      ]),
    );
    const back = localizeAssets(
      portable,
      new Map([[HASH, { path: LOCAL_PATH, url: ASSET_URL }]]),
    );

    expect(back.palace.editorSnapshot).toBe(snapshot().palace.editorSnapshot);
    expect(back.nodes[0].imageUrl).toBe(ASSET_URL);
  });

  it("keeps the reference when the asset has not downloaded yet", () => {
    // Blanking it would permanently erase the image from the palace; leaving the reference
    // means the picture is merely missing until the asset arrives.
    const portable = portableizeAssets(
      snapshot(),
      new Map([
        [LOCAL_PATH, HASH],
        [ASSET_URL, HASH],
      ]),
    );
    const local = localizeAssets(portable, new Map());

    expect(local.nodes[0].imageUrl).toBe(`${VAULT_ASSET_SCHEME}${HASH}`);
  });

  it("survives a palace whose canvas blob is damaged", () => {
    const broken = snapshot();
    broken.palace.editorSnapshot = "{not json";
    const portable = portableizeAssets(
      broken,
      new Map([
        [LOCAL_PATH, HASH],
        [ASSET_URL, HASH],
      ]),
    );

    // The canvas is left as-is, but the rest of the palace still syncs.
    expect(portable.palace.editorSnapshot).toBe("{not json");
    expect(portable.nodes[0].imageUrl).toBe(`${VAULT_ASSET_SCHEME}${HASH}`);
  });
});
