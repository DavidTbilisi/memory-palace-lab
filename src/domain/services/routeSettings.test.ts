import { describe, expect, it } from "vitest";
import {
  decodeRouteSettings,
  decodeStopSettings,
  encodeRouteSettings,
  encodeStopSettings,
} from "./routeSettings";

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

  it("round-trips route metadata in order, including empty values", () => {
    const metadata = [
      { key: "difficulty", value: "advanced" },
      { key: "prereq", value: "Gate of SOLID" },
      { key: "mode", value: null },
    ];
    const json = encodeRouteSettings({ color: "sky", metadata });
    expect(JSON.parse(json)).toEqual({ color: "sky", metadata });
    expect(decodeRouteSettings(json)).toEqual({ color: "sky", metadata });
    expect(encodeRouteSettings({ metadata: [] })).toBe("{}");
  });

  it("keeps only well-formed metadata tags", () => {
    const json = JSON.stringify({
      metadata: [{ key: "prereq", value: "Gate" }, { key: "", value: "x" }, { key: "n", value: 3 }, "bad", null],
    });
    expect(decodeRouteSettings(json)).toEqual({ metadata: [{ key: "prereq", value: "Gate" }] });
    expect(decodeRouteSettings('{"metadata":"#prereq:Gate"}')).toEqual({});
  });
});

describe("stop settings codec", () => {
  const view = { x: -412.5, y: -230, w: 825, h: 460.25 };

  it("round-trips a saved view", () => {
    const json = encodeStopSettings({ view });
    expect(JSON.parse(json)).toEqual({ view });
    expect(decodeStopSettings(json)).toEqual({ view });
  });

  it("encodes a stop without a view as an empty object", () => {
    expect(encodeStopSettings({})).toBe("{}");
    expect(encodeStopSettings({ view: null })).toBe("{}");
  });

  it("keeps only the view's own numbers", () => {
    const extra = { ...view, zoom: 2 } as typeof view;
    expect(JSON.parse(encodeStopSettings({ view: extra }))).toEqual({ view });
  });

  it("reads missing, malformed, or impossible views as no view", () => {
    expect(decodeStopSettings(null)).toEqual({});
    expect(decodeStopSettings("{}")).toEqual({});
    expect(decodeStopSettings("not json")).toEqual({});
    expect(decodeStopSettings('{"view":{"x":0,"y":0,"w":0,"h":10}}')).toEqual({});
    expect(decodeStopSettings('{"view":{"x":"1","y":0,"w":10,"h":10}}')).toEqual({});
    expect(decodeStopSettings('{"view":{"x":0,"y":0,"w":10}}')).toEqual({});
    expect(encodeStopSettings({ view: { x: Number.NaN, y: 0, w: 10, h: 10 } })).toBe("{}");
  });
});
