import { describe, expect, it } from "vitest";
import { splitMarkdownSections } from "./markdownSections";

describe("markdownSections", () => {
  it("keeps intro content as overview and splits level-two sections into tabs", () => {
    const sections = splitMarkdownSections(`Intro line

## Learning contract (**Narrow**)

Narrow body

## Quick start (30-60 minutes)

Start body`);

    expect(sections.map((section) => section.label)).toEqual(["Overview", "Narrow", "Quick start"]);
    expect(sections[0].content).toContain("Intro line");
    expect(sections[1].content).toContain("Narrow body");
  });

  it("returns one overview section for documents without level-two headings", () => {
    expect(splitMarkdownSections("Only body")).toEqual([
      {
        id: "overview",
        label: "Overview",
        title: "Overview",
        content: "Only body",
      },
    ]);
  });
});
