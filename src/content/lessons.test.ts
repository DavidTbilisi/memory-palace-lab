import { describe, expect, it } from "vitest";
import { EXAMPLES, LESSONS, buildProgressChecks, exampleById, lessonShortLabel } from "./lessons";

describe("lessons content", () => {
  it("has unique lesson ids, a library slug each, and the canonical first title", () => {
    const ids = LESSONS.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(LESSONS[0].title).toBe("Lesson 1 - Build your first palace");
    for (const lesson of LESSONS) {
      expect(lesson.librarySlug.length).toBeGreaterThan(0);
      expect(lesson.steps.length).toBeGreaterThan(0);
    }
  });

  it("derives short labels from titles", () => {
    expect(lessonShortLabel(LESSONS[0])).toBe("Lesson 1");
    expect(lessonShortLabel({ ...LESSONS[0], title: "No dash" })).toBe("No dash");
  });

  it("has four examples with unique ids and a lookup", () => {
    expect(EXAMPLES).toHaveLength(4);
    expect(new Set(EXAMPLES.map((example) => example.id)).size).toBe(4);
    expect(exampleById("solver").title).toBe("Universal Solver Scratchpad");
    expect(() => exampleById("nope" as never)).toThrow();
  });

  it("builds the five progress checks in order", () => {
    const none = buildProgressChecks({
      palaceCount: 0,
      hasOpenPalace: false,
      nodeCount: 0,
      edgeCount: 0,
      routeCount: 0,
      locusCount: 0,
    });
    expect(none.map((check) => check.ok)).toEqual([false, false, false, false, false]);
    expect(none.map((check) => check.id)).toEqual(["palace", "open", "nodes", "edges", "route"]);

    const partial = buildProgressChecks({
      palaceCount: 1,
      hasOpenPalace: true,
      nodeCount: 3,
      edgeCount: 0,
      routeCount: 1,
      locusCount: 0,
    });
    expect(partial.map((check) => check.ok)).toEqual([true, true, true, false, false]);
  });
});
