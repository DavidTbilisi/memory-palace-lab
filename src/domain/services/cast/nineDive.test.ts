import { describe, expect, it } from "vitest";
import { NINE_DIVE } from "./nineDive";

describe("NINE_DIVE", () => {
  it("layers content → process → premise in order", () => {
    expect(NINE_DIVE.map((l) => l.layer)).toEqual(["content", "process", "premise"]);
  });

  it("holds nine questions, three per layer", () => {
    expect(NINE_DIVE.flatMap((l) => l.questions)).toHaveLength(9);
    for (const layer of NINE_DIVE) expect(layer.questions).toHaveLength(3);
  });

  it("ends on premise — where frame-shift lives", () => {
    expect(NINE_DIVE.at(-1)?.layer).toBe("premise");
  });
});
