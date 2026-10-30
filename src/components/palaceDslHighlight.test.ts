import { describe, expect, it } from "vitest";
import { tagLineTokens } from "./palaceDslHighlight";

function classes(body: string) {
  return tagLineTokens(body).map(({ from, to, cls }) => [body.slice(from, to), cls]);
}

describe("tagLineTokens", () => {
  it("marks plain and structured tags as tags", () => {
    expect(classes("#solid #difficulty:advanced")).toEqual([
      ["#solid", "cm-dsl-tag"],
      ["#difficulty:advanced", "cm-dsl-tag"],
    ]);
  });

  it("marks every word of a prereq value as part of the tag, up to the next #tag", () => {
    expect(classes("#prereq:Gate of SOLID #mode:linear")).toEqual([
      ["#prereq:Gate", "cm-dsl-tag"],
      ["of", "cm-dsl-tag"],
      ["SOLID", "cm-dsl-tag"],
      ["#mode:linear", "cm-dsl-tag"],
    ]);
  });

  it("still marks malformed tokens as invalid", () => {
    expect(classes("#ok #:nokey #bad!")).toEqual([
      ["#ok", "cm-dsl-tag"],
      ["#:nokey", "cm-dsl-invalid"],
      ["#bad!", "cm-dsl-invalid"],
    ]);
  });
});
