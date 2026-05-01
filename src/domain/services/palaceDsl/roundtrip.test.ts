import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDsl } from "./parser";
import { serializeDsl } from "./serializer";
import { dslToPalaceSnapshot, stripSourceLines } from "./testHelpers";

function fixture(name: string) {
  return readFileSync(resolve(__dirname, "fixtures", name), "utf8").replace(/\r\n/g, "\n");
}

const FIXTURES = ["empty.dsl", "mechanics.dsl", "portals.dsl", "solid-citadel.dsl"];

describe("DSL round-trip", () => {
  for (const name of FIXTURES) {
    it(`parse → serialize → parse is structurally stable for ${name}`, () => {
      const text = fixture(name);
      const first = parseDsl(text);
      expect(first.diagnostics.filter((d) => d.severity === "error")).toEqual([]);

      const palaceSnap = dslToPalaceSnapshot(first.snapshot);
      const reEmitted = serializeDsl(palaceSnap);
      const second = parseDsl(reEmitted);

      expect(second.diagnostics.filter((d) => d.severity === "error")).toEqual([]);
      expect(stripSourceLines(second.snapshot)).toEqual(
        stripSourceLines(first.snapshot),
      );
    });
  }

  it("byte-for-byte round-trip holds for fixtures authored against the canonical format", () => {
    for (const name of FIXTURES) {
      const text = fixture(name);
      const { snapshot } = parseDsl(text);
      const reEmitted = serializeDsl(dslToPalaceSnapshot(snapshot));
      expect(reEmitted, `${name} should byte-equal after round-trip`).toBe(text);
    }
  });
});
