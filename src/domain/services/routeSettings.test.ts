import { describe, expect, it } from "vitest";
import { decodeRouteSettings, encodeRouteSettings } from "./routeSettings";

describe("route settings codec", () => {
  it("round-trips color and visibility", () => {
    const json = encodeRouteSettings({ color: "emerald", hidden: true });
    expect(JSON.parse(json)).toEqual({ color: "emerald", hidden: true });
    expect(decodeRouteSettings(json)).toEqual({ color: "emerald", hidden: true });
  });

  it("encodes a plain route as an empty object", () => {
    expect(encodeRouteSettings({})).toBe("{}");
    expect(encodeRouteSettings({ color: null, hidden: false })).toBe("{}");
  });

  it("falls back to defaults for missing, malformed, or unknown values", () => {
    expect(decodeRouteSettings(null)).toEqual({});
    expect(decodeRouteSettings("")).toEqual({});
    expect(decodeRouteSettings("not json")).toEqual({});
    expect(decodeRouteSettings("[1,2]")).toEqual({});
    expect(decodeRouteSettings('{"color":"plaid","hidden":"yes"}')).toEqual({});
  });
});
