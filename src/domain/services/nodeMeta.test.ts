import { describe, expect, it } from "vitest";
import { decodeNodeMeta, encodeNodeMeta } from "./nodeMeta";

const nedf = {
  nameHook: "Mute-X",
  essence: "One key to the bathroom",
  distinguisher: { prompt: "One key or a bowl of keys?", reason: "A mutex has one owner; a semaphore counts" },
};

describe("node meta codec", () => {
  it("round-trips portal, image, and NEDF slots", () => {
    const portal = { targetPalaceId: "p2", targetPalaceName: "Other" };
    const json = encodeNodeMeta({ portal, imageUrl: "https://example.com/x.png", nedf });
    expect(decodeNodeMeta(json)).toEqual({ portal, imageUrl: "https://example.com/x.png", nedf });
  });

  it("round-trips attributes next to NEDF slots", () => {
    const attributes = [
      { name: "where", channel: "spatial" as const, values: ["north tower"] },
      { name: "days", channel: "temporal" as const, values: ["Mon", "Wed"], route: "enumerate" as const, count: 2 },
    ];
    const json = encodeNodeMeta({ portal: null, imageUrl: null, nedf, attributes });
    expect(decodeNodeMeta(json)).toEqual({ portal: null, imageUrl: null, nedf, attributes });
  });

  it("round-trips a store node's address and role, and drops an unknown role", () => {
    const json = encodeNodeMeta({ portal: null, imageUrl: null, address: "2.3.4", storeRole: "cell" });
    expect(decodeNodeMeta(json)).toEqual({ portal: null, imageUrl: null, address: "2.3.4", storeRole: "cell" });
    expect(decodeNodeMeta('{"portal":null,"imageUrl":null,"storeRole":"tower"}')).toEqual({ portal: null, imageUrl: null });
  });

  it("writes a plain node as before, without an nedf key", () => {
    expect(encodeNodeMeta({ portal: null, imageUrl: null })).toBe('{"portal":null,"imageUrl":null}');
    expect(encodeNodeMeta({ portal: null, imageUrl: null, nedf: { essence: "  " } })).toBe(
      '{"portal":null,"imageUrl":null}',
    );
    expect(encodeNodeMeta({ portal: null, imageUrl: null, attributes: [] })).toBe('{"portal":null,"imageUrl":null}');
  });

  it("reads the oldest bare-portal rows and tolerates junk", () => {
    const portal = { targetPalaceId: "p2", targetPalaceName: "Other" };
    expect(decodeNodeMeta(JSON.stringify(portal))).toEqual({ portal, imageUrl: null });
    expect(decodeNodeMeta("not json")).toEqual({ portal: null, imageUrl: null });
    expect(decodeNodeMeta(null)).toEqual({ portal: null, imageUrl: null });
    expect(decodeNodeMeta('{"portal":null,"nedf":"x"}')).toEqual({ portal: null, imageUrl: null });
  });
});
