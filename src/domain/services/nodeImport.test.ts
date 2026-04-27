import { describe, expect, it } from "vitest";
import { parseCsvNodeImport, parseMarkdownNodeImport } from "./nodeImport";

describe("parseMarkdownNodeImport", () => {
  it("parses list lines that start with dash or star", () => {
    const result = parseMarkdownNodeImport("- First\n* Second\nNot a bullet");
    expect(result.error).toBeNull();
    expect(result.rows).toEqual([
      { title: "First", content: "" },
      { title: "Second", content: "" },
    ]);
  });
});

describe("parseCsvNodeImport", () => {
  it("parses title and content columns", () => {
    const csv = "title,content\nHippocampus,Memory formation\nATP,Energy currency";
    const result = parseCsvNodeImport(csv);
    expect(result.error).toBeNull();
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual({ title: "Hippocampus", content: "Memory formation" });
  });

  it("supports quoted commas and escaped quotes", () => {
    const csv = 'title,content\n"Alpha, beta","Uses ""quoted"" values"';
    const result = parseCsvNodeImport(csv);
    expect(result.error).toBeNull();
    expect(result.rows[0]).toEqual({ title: "Alpha, beta", content: 'Uses "quoted" values' });
  });

  it("returns an error when required headers are missing", () => {
    const result = parseCsvNodeImport("name,notes\nA,B");
    expect(result.error).toMatch(/title and content/i);
    expect(result.rows).toHaveLength(0);
  });
});
