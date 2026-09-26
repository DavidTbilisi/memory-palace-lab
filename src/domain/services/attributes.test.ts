import { describe, expect, it } from "vitest";
import type { NodeAttribute } from "../entities/types";
import { attributeWarnings, firstFreeChannel, normalizeAttributes } from "./attributes";

const attr = (partial: Partial<NodeAttribute> & Pick<NodeAttribute, "channel">): NodeAttribute => ({
  name: "a",
  values: ["x"],
  ...partial,
});

describe("normalizeAttributes", () => {
  it("trims, drops empty values, and keeps a valid route and count", () => {
    expect(
      normalizeAttributes([{ name: " days ", channel: "Temporal", values: [" Mon ", "", "Wed"], route: "enumerate", count: 2 }]),
    ).toEqual([{ name: "days", channel: "temporal", values: ["Mon", "Wed"], route: "enumerate", count: 2 }]);
  });

  it("drops unknown channels, empty entries, bad routes and bad counts", () => {
    expect(
      normalizeAttributes([
        { name: "size", channel: "size", values: ["big"] },
        { name: "", channel: "spatial", values: ["", " "] },
        { name: "where", channel: "spatial", values: ["north"], route: "list", count: 1.5 },
      ]),
    ).toEqual([{ name: "where", channel: "spatial", values: ["north"] }]);
  });

  it("keeps names and values writable as a DSL line: no : or [ in a name, and | splits a value", () => {
    expect(normalizeAttributes([{ name: "where: [main]", channel: "spatial", values: ["hall | kitchen"] }])).toEqual([
      { name: "where main", channel: "spatial", values: ["hall", "kitchen"] },
    ]);
  });

  it("keeps a named attribute with no values yet, so the inspector can show it", () => {
    expect(normalizeAttributes([{ name: "where", channel: "spatial", values: [] }])).toEqual([
      { name: "where", channel: "spatial", values: [] },
    ]);
  });

  it("returns null for nothing left or a non-array", () => {
    expect(normalizeAttributes([])).toBeNull();
    expect(normalizeAttributes([{ channel: "nope" }])).toBeNull();
    expect(normalizeAttributes({ name: "where" })).toBeNull();
    expect(normalizeAttributes(undefined)).toBeNull();
  });
});

describe("attributeWarnings", () => {
  const kinds = (attributes: NodeAttribute[]) => attributeWarnings(attributes).map((w) => w.kind);

  it("reports two attributes on one channel as a collision naming both", () => {
    const warnings = attributeWarnings([
      attr({ name: "where", channel: "spatial" }),
      attr({ name: "phase", channel: "state" }),
      attr({ name: "room", channel: "spatial" }),
    ]);
    expect(warnings).toEqual([
      expect.objectContaining({ kind: "channel-collision", attributes: [0, 2], message: expect.stringContaining('"where" and "room"') }),
    ]);
  });

  it("does not treat several values of one attribute as a collision", () => {
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"], route: "address" })])).toEqual([]);
  });

  it("asks for a route once an attribute has several values", () => {
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"] })])).toEqual(["route-missing"]);
    expect(kinds([attr({ channel: "temporal", values: ["Mon"] })])).toEqual([]);
  });

  it("requires a count only on the enumerate route, and checks it against the values", () => {
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"], route: "enumerate" })])).toEqual(["count-missing"]);
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"], route: "enumerate", count: 3 })])).toEqual(["count-mismatch"]);
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"], route: "enumerate", count: 2 })])).toEqual([]);
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"], route: "address", count: 2 })])).toEqual(["count-unexpected"]);
    expect(kinds([attr({ channel: "temporal", values: ["Mon", "Wed"], route: "dissolve" })])).toEqual([]);
  });

  it("warns past four channels, not at four", () => {
    const four = (["spatial", "state", "temporal", "priority"] as const).map((channel) => attr({ channel }));
    expect(kinds(four)).toEqual([]);
    expect(kinds([...four, attr({ channel: "sensory" })])).toEqual(["channel-budget"]);
  });

  it("has nothing to say about no attributes", () => {
    expect(attributeWarnings(null)).toEqual([]);
    expect(attributeWarnings([])).toEqual([]);
  });
});

describe("firstFreeChannel", () => {
  it("starts a new attribute on the first unused channel", () => {
    expect(firstFreeChannel(null)).toBe("spatial");
    expect(firstFreeChannel([attr({ channel: "spatial" }), attr({ channel: "sensory" })])).toBe("state");
  });
});
