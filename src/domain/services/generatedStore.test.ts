import { describe, expect, it } from "vitest";
import {
  BLOCK_CELL_COUNT,
  BLOCK_NODE_SIZE,
  blockPlaceholder,
  fourLevelBlockSlots,
  isStoreNodeFilled,
  normalizeAddress,
  numberClusterSlots,
  parseStore,
  serializeStore,
  type NumberClusterInput,
} from "./generatedStore";

describe("four-level block slots", () => {
  const slots = fourLevelBlockSlots("Chemistry");

  it("has an unaddressed theme, 25 stickers and 125 cells, in address order", () => {
    expect(slots.filter((s) => s.role === "theme")).toEqual([expect.objectContaining({ address: null, placeholder: "Chemistry" })]);
    expect(slots.filter((s) => s.role === "sticker")).toHaveLength(25);
    const cells = slots.filter((s) => s.role === "cell");
    expect(cells).toHaveLength(BLOCK_CELL_COUNT);
    expect(cells.slice(0, 6).map((c) => c.address)).toEqual(["1.1.1", "1.1.2", "1.1.3", "1.1.4", "1.1.5", "1.2.1"]);
    expect(cells.at(-1)!.address).toBe("5.5.5");
    expect(slots.map((s) => s.address).slice(0, 8)).toEqual([null, "1.1", "1.1.1", "1.1.2", "1.1.3", "1.1.4", "1.1.5", "1.2"]);
  });

  it("stacks a sticker's cells under it, and puts each branch on its own row", () => {
    const at = (address: string) => slots.find((s) => s.address === address)!;
    expect(at("2.3.1").x).toBe(at("2.3").x);
    expect(at("2.3.1").y).toBeGreaterThan(at("2.3").y);
    expect(at("2.3.5").y).toBeGreaterThan(at("2.3.4").y);
    expect(at("2.4").x).toBeGreaterThan(at("2.3").x);
    expect(at("3.1").y).toBeGreaterThan(at("2.1.5").y);
    expect(at("1.1").y).toBe(at("1.5").y);
  });

  it("never overlaps two nodes", () => {
    const boxes = slots.map((s) => ({ l: s.x - s.w / 2, r: s.x + s.w / 2, t: s.y - s.h / 2, b: s.y + s.h / 2 }));
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const [a, b] = [boxes[i]!, boxes[j]!];
        expect(a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b, `${slots[i]!.address} / ${slots[j]!.address}`).toBe(false);
      }
    }
  });

  it("sizes cells smaller than stickers", () => {
    expect(BLOCK_NODE_SIZE.cell.h).toBeLessThan(BLOCK_NODE_SIZE.sticker.h);
  });
});

describe("store helpers", () => {
  it("round-trips a store and rejects anything else", () => {
    const store = { kind: "four-level-block" as const, theme: "Chemistry", generatedAt: "2026-09-28T10:00:00.000Z", routeId: "r1" };
    expect(parseStore(serializeStore(store))).toEqual(store);
    expect(parseStore(null)).toBeNull();
    expect(parseStore("not json")).toBeNull();
    expect(parseStore('{"kind":"unknown"}')).toBeNull();
  });

  it("reads an address however it is typed", () => {
    expect(["3.2.4", "3 2 4", "324", " 3·2·4 ", "3/2/4"].map(normalizeAddress)).toEqual(Array(5).fill("3.2.4"));
    expect(normalizeAddress("3.2")).toBe("3.2");
    expect(normalizeAddress("03.02.04")).toBe("3.2.4");
    expect(["", "3", "a.b.c", "1.2.3.4", "12345"].map(normalizeAddress)).toEqual([null, null, null, null, null]);
  });

  it("gives each role its placeholder title", () => {
    expect(blockPlaceholder("theme", null, "Chemistry")).toBe("Chemistry");
    expect(blockPlaceholder("sticker", "2.3", "Chemistry")).toBe("Sticker 2.3");
    expect(blockPlaceholder("cell", "2.3.4", "Chemistry")).toBe("2.3.4");
  });

  it("counts a node filled once the learner puts anything in it", () => {
    const empty = { title: "2.3.4", placeholder: "2.3.4" };
    expect(isStoreNodeFilled(empty)).toBe(false);
    expect(isStoreNodeFilled({ ...empty, content: "<p></p>" })).toBe(false);
    expect(isStoreNodeFilled({ ...empty, title: "Sodium" })).toBe(true);
    expect(isStoreNodeFilled({ ...empty, content: "<p>Na</p>" })).toBe(true);
    expect(isStoreNodeFilled({ ...empty, imageUrl: "data:x" })).toBe(true);
    expect(isStoreNodeFilled({ ...empty, hasNedf: true })).toBe(true);
    expect(isStoreNodeFilled({ ...empty, hasAttributes: true })).toBe(true);
  });
});

describe("table of support images", () => {
  const hedgehog: NumberClusterInput = {
    number: 47,
    image: "hedgehog",
    associations: ["apple", "orchard", " "],
    parts: [["stem", "skin", "core"], ["gate", "", "ladder"], ["", "", ""]],
  };
  const slots = numberClusterSlots(hedgehog);
  const at = (address: string) => slots.find((s) => s.address === address)!;

  it("gives a number its image, three chained images and nine cells, cells 1-3 under image a", () => {
    expect(slots.map((s) => [s.role, s.address])).toEqual([
      ["number", "47"],
      ["image", "47.a"], ["cell", "47.1"], ["cell", "47.2"], ["cell", "47.3"],
      ["image", "47.b"], ["cell", "47.4"], ["cell", "47.5"], ["cell", "47.6"],
      ["image", "47.c"], ["cell", "47.7"], ["cell", "47.8"], ["cell", "47.9"],
    ]);
    expect(at("47.1").x).toBe(at("47.a").x);
    expect(at("47.4").x).toBe(at("47.b").x);
    expect(at("47.3").y).toBeGreaterThan(at("47.1").y);
  });

  it("titles nodes with what the learner wrote, and keeps a placeholder for anything blank", () => {
    expect([at("47"), at("47.a"), at("47.c"), at("47.1"), at("47.5"), at("47.9")].map((s) => s.title)).toEqual([
      "hedgehog", "apple", "47 · image c", "stem", "47.5", "47.9",
    ]);
    expect(at("47.1").placeholder).toBe("47.1");
  });

  it("places each number on a 10 × 10 grid by its digits, and no two nodes in the table overlap", () => {
    const zero = numberClusterSlots({ ...hedgehog, number: 0 });
    const seven = numberClusterSlots({ ...hedgehog, number: 7 });
    const forty = numberClusterSlots({ ...hedgehog, number: 40 });
    expect(zero[0]!.address).toBe("00");
    expect(seven[0]!.y).toBe(zero[0]!.y);
    expect(seven[0]!.x).toBeGreaterThan(zero[0]!.x);
    expect(slots[0]!.x).toBe(seven[0]!.x);
    expect(slots[0]!.y).toBe(forty[0]!.y);
    expect(forty[0]!.y).toBeGreaterThan(zero[0]!.y);

    const all = Array.from({ length: 100 }, (_, n) => numberClusterSlots({ ...hedgehog, number: n })).flat();
    const boxes = all.map((s) => ({ l: s.x - s.w / 2, r: s.x + s.w / 2, t: s.y - s.h / 2, b: s.y + s.h / 2 }));
    const sorted = boxes.map((box, i) => ({ ...box, i })).sort((a, b) => a.l - b.l);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length && sorted[j]!.l < sorted[i]!.r; j++) {
        const [a, b] = [sorted[i]!, sorted[j]!];
        expect(a.t < b.b && b.t < a.b, `${all[a.i]!.address} / ${all[b.i]!.address}`).toBe(false);
      }
    }
  });

  it("reads a table address with its number zero-padded", () => {
    expect(["47.3", "47 3", "473", "47/3"].map((a) => normalizeAddress(a, "support-table"))).toEqual(Array(4).fill("47.3"));
    expect(normalizeAddress("7.3", "support-table")).toBe("07.3");
    expect(normalizeAddress("47", "support-table")).toBe("47");
    expect(normalizeAddress("5", "support-table")).toBe("05");
    expect(["47.0", "100.1", "4.7.3", "ab"].map((a) => normalizeAddress(a, "support-table"))).toEqual([null, null, null, null]);
  });

  it("round-trips a table store", () => {
    const table = { kind: "support-table" as const, generatedAt: "2026-09-28T10:00:00.000Z" };
    expect(parseStore(serializeStore(table))).toEqual(table);
  });
});
