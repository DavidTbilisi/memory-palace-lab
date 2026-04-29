import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDsl } from "./parser";

function fixture(name: string) {
  return readFileSync(resolve(__dirname, "fixtures", name), "utf8");
}

describe("parseDsl — empty input", () => {
  it("returns an empty snapshot with no diagnostics for empty input", () => {
    const { snapshot, diagnostics } = parseDsl("");
    expect(diagnostics).toEqual([]);
    expect(snapshot).toEqual({
      palaceName: "",
      atlasPath: null,
      nodes: [],
      routes: [],
    });
  });

  it("treats whitespace-only input as empty", () => {
    const { snapshot, diagnostics } = parseDsl("   \n\n\t\n");
    expect(diagnostics).toEqual([]);
    expect(snapshot.nodes).toEqual([]);
  });
});

describe("parseDsl — palace header", () => {
  it("emits missing-palace-header when there is content but no header", () => {
    const { diagnostics } = parseDsl("== Foo\n  > bar\n");
    const errors = diagnostics.filter((d) => d.severity === "error");
    expect(errors).toHaveLength(1);
    expect(errors[0]!.code).toBe("missing-palace-header");
    expect(errors[0]!.line).toBe(1);
  });

  it("captures palace name and atlas path", () => {
    const { snapshot } = parseDsl("# Palace: Test\n@atlas /a/b\n");
    expect(snapshot.palaceName).toBe("Test");
    expect(snapshot.atlasPath).toBe("/a/b");
  });
});

describe("parseDsl — canonical fixture", () => {
  it("parses mechanics.dsl with zero errors and matches expected snapshot", () => {
    const { snapshot, diagnostics } = parseDsl(fixture("mechanics.dsl"));
    const errors = diagnostics.filter((d) => d.severity === "error");
    expect(errors).toEqual([]);
    expect(snapshot.palaceName).toBe("Mechanics");
    expect(snapshot.atlasPath).toBe("/science/physics");
    expect(snapshot.nodes.map((n) => n.title)).toEqual([
      "Newton's Laws",
      "F = ma",
      "Gravity",
    ]);

    const newtons = snapshot.nodes[0]!;
    expect(newtons.content).toBe("fundamental laws of motion");
    expect(newtons.kind).toBe("portal");
    expect(newtons.portal).toEqual({ targetPalaceName: "classical" });
    expect(newtons.tags).toEqual(["fundamental", "laws"]);
    expect(newtons.edges).toEqual([]);

    const fma = snapshot.nodes[1]!;
    expect(fma.content).toBe("Force equals mass × acceleration");
    expect(fma.kind).toBe("memory");
    expect(fma.portal).toBeNull();
    expect(fma.edges).toEqual([
      {
        targetTitle: "Newton's Laws",
        cast: { ab: "", cd: "", ef: "Rock", gh: "" },
        sourceLine: 11,
      },
      {
        targetTitle: "Gravity",
        cast: { ab: "Giant", cd: "Crushing", ef: "Rock", gh: "" },
        sourceLine: 12,
      },
    ]);

    expect(snapshot.routes).toEqual([
      {
        name: "First Walk",
        loci: ["Newton's Laws", "F = ma", "Gravity"],
        sourceLine: 17,
      },
    ]);
  });
});

describe("parseDsl — diagnostics", () => {
  it("emits duplicate-title at the second header line", () => {
    const text = "# Palace: P\n\n== Foo\n  > a\n\n== Foo\n  > b\n";
    const { diagnostics } = parseDsl(text);
    const dup = diagnostics.filter((d) => d.code === "duplicate-title");
    expect(dup).toHaveLength(1);
    expect(dup[0]!.severity).toBe("error");
    expect(dup[0]!.line).toBe(6);
  });

  it("emits unknown-target for an edge to a non-existent node and continues parsing", () => {
    const text =
      "# Palace: P\n\n== A\n  -> Nonexistent\n  -> B\n\n== B\n  > b\n";
    const { snapshot, diagnostics } = parseDsl(text);
    const unknown = diagnostics.filter((d) => d.code === "unknown-target");
    expect(unknown).toHaveLength(1);
    expect(unknown[0]!.line).toBe(4);
    expect(snapshot.nodes[0]!.edges.map((e) => e.targetTitle)).toEqual([
      "Nonexistent",
      "B",
    ]);
  });

  it("emits malformed-cast for invalid compact tokens", () => {
    const text = "# Palace: P\n\n== A\n  -> B  ::129X\n\n== B\n  > b\n";
    const { diagnostics } = parseDsl(text);
    const bad = diagnostics.filter((d) => d.code === "malformed-cast");
    expect(bad).toHaveLength(1);
    expect(bad[0]!.severity).toBe("error");
    expect(bad[0]!.line).toBe(4);
  });

  it("emits misplaced-line when node attributes are not indented", () => {
    const text = "# Palace: P\n== A\n> body\n#tag\n-> B\n";
    const { diagnostics } = parseDsl(text);
    const misplaced = diagnostics.filter((d) => d.code === "misplaced-line");
    expect(misplaced).toHaveLength(3);
    expect(misplaced.every((d) => d.severity === "error")).toBe(true);
    expect(misplaced.map((d) => d.line)).toEqual([3, 4, 5]);
  });

  it("emits misplaced-line when route loci are not indented under a route", () => {
    const text = '# Palace: P\n:: Route "Walk"\n1. A\n';
    const { diagnostics } = parseDsl(text);
    const misplaced = diagnostics.filter((d) => d.code === "misplaced-line");
    expect(misplaced).toHaveLength(1);
    expect(misplaced[0]!.line).toBe(3);
  });
});

describe("parseDsl — portal targets", () => {
  it("parses /palaces/<name>#<route>@<node> into all three fields", () => {
    const text = "# Palace: P\n\n== A\n  ~portal /palaces/foo#routeA@nodeB\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.nodes[0]!.kind).toBe("portal");
    expect(snapshot.nodes[0]!.portal).toEqual({
      targetPalaceName: "foo",
      targetRouteName: "routeA",
      targetNodeId: "nodeB",
    });
  });

  it("emits invalid-portal-target for malformed target", () => {
    const text = "# Palace: P\n\n== A\n  ~portal not-a-path\n";
    const { diagnostics } = parseDsl(text);
    expect(diagnostics.some((d) => d.code === "invalid-portal-target")).toBe(true);
  });
});

describe("parseDsl — tags and comments", () => {
  it("emits tag-syntax warning for invalid tokens but keeps valid tags", () => {
    const text = "# Palace: P\n\n== A\n  #good_tag bad-tag $$$\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(snapshot.nodes[0]!.tags).toEqual(["good_tag", "bad-tag"]);
    const warnings = diagnostics.filter((d) => d.code === "tag-syntax");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]!.severity).toBe("warning");
  });

  it("ignores -- comment lines", () => {
    const text =
      "# Palace: P\n-- this is a comment\n== A\n  -- comments work indented too\n  > body\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);
    expect(snapshot.nodes[0]!.content).toBe("body");
  });
});
