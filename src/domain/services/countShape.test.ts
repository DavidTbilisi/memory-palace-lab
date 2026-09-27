import { describe, expect, it } from "vitest";
import { canUsePolygon, ladderRungs, polygonRadius, polygonVertices } from "./countShape";

const round = (points: { x: number; y: number }[]) => points.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }));

describe("count-shape geometry", () => {
  it("allows a polygon only for two to seven members", () => {
    expect([1, 2, 7, 8].map(canUsePolygon)).toEqual([false, true, true, false]);
  });

  it("puts the first vertex at the top and goes clockwise", () => {
    expect(round(polygonVertices(4, { x: 0, y: 0 }, 100))).toEqual([
      { x: 0, y: -100 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
      { x: -100, y: 0 },
    ]);
  });

  it("makes two members an axis through the centre", () => {
    expect(round(polygonVertices(2, { x: 10, y: 20 }, 300))).toEqual([
      { x: 10, y: -280 },
      { x: 10, y: 320 },
    ]);
  });

  it("spreads the polygon so neighbouring members clear each other", () => {
    const size = { w: 180, h: 100 };
    for (let n = 2; n <= 7; n++) {
      const [a, b] = polygonVertices(n, { x: 0, y: 0 }, polygonRadius(n, size));
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(size.w + 60 - 1e-9);
    }
    expect(polygonRadius(3, size)).toBe(260);
  });

  it("stacks a ladder to the right of the hub, centred on it", () => {
    const rungs = ladderRungs(3, { x: 0, y: 0 }, { w: 180, h: 100 }, { w: 180, h: 100 });
    expect(round(rungs)).toEqual([
      { x: 300, y: -140 },
      { x: 300, y: 0 },
      { x: 300, y: 140 },
    ]);
  });
});
