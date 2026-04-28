import { describe, expect, it } from "vitest";
import { formatCastCompact, parseCast } from "./cast";

describe("parseCast — compact form", () => {
  it("parses '1234' to position 1/2/3/4 across the four axes", () => {
    expect(parseCast("1234")).toEqual({
      ab: "Giant",
      cd: "Flowing",
      ef: "Cloud",
      gh: "Purple storm",
    });
  });

  it("parses '1111' as the first value of each axis", () => {
    expect(parseCast("1111")).toEqual({
      ab: "Giant",
      cd: "Crushing",
      ef: "Rock",
      gh: "Red cave",
    });
  });

  it("treats '0' as unset on a per-axis basis", () => {
    expect(parseCast("0010")).toEqual({
      ab: "",
      cd: "",
      ef: "Rock",
      gh: "",
    });
  });

  it("rejects out-of-range digits", () => {
    expect(parseCast("5234")).toBeNull();
  });

  it("rejects non-digit input of length 4", () => {
    expect(parseCast("abcd")).toBeNull();
  });

  it("rejects compact-looking input of wrong length", () => {
    expect(parseCast("123")).toBeNull();
    expect(parseCast("12345")).toBeNull();
  });
});

describe("parseCast — named form", () => {
  it("parses a partial named string with omitted axes defaulting to empty", () => {
    expect(parseCast("who:Mermaid how:Flowing")).toEqual({
      ab: "Mermaid",
      cd: "Flowing",
      ef: "",
      gh: "",
    });
  });

  it("handles quoted multi-word values for the When axis", () => {
    expect(parseCast('when:"Blue ocean"')).toEqual({
      ab: "",
      cd: "",
      ef: "",
      gh: "Blue ocean",
    });
  });

  it("accepts axes in any order and trims whitespace", () => {
    expect(parseCast('  what:Cloud  who:Dragon  ')).toEqual({
      ab: "Dragon",
      cd: "",
      ef: "Cloud",
      gh: "",
    });
  });

  it("returns null when a named axis has an unknown value", () => {
    expect(parseCast("who:Goblin")).toBeNull();
  });

  it("returns empty cast for an empty string", () => {
    expect(parseCast("")).toEqual({ ab: "", cd: "", ef: "", gh: "" });
  });
});

describe("formatCastCompact", () => {
  it("formats a fully populated cast as four 1-indexed digits", () => {
    expect(
      formatCastCompact({
        ab: "Giant",
        cd: "Crushing",
        ef: "Rock",
        gh: "Red cave",
      }),
    ).toBe("1111");
  });

  it("emits '0' for unset axes", () => {
    expect(
      formatCastCompact({
        ab: "",
        cd: "",
        ef: "",
        gh: "",
      }),
    ).toBe("0000");
  });

  it("emits '0' for unknown values to remain a 4-char compact string", () => {
    expect(
      formatCastCompact({
        ab: "Goblin",
        cd: "Crushing",
        ef: "",
        gh: "Purple storm",
      }),
    ).toBe("0104");
  });
});
