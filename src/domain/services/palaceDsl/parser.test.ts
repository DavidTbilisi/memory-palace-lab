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
      aliases: [],
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
    const { diagnostics } = parseDsl("Foo\n: bar\n");
    const errors = diagnostics.filter((d) => d.severity === "error");
    expect(errors).toHaveLength(1);
    expect(errors[0]!.code).toBe("missing-palace-header");
    expect(errors[0]!.line).toBe(1);
  });

  it("captures palace name and atlas path", () => {
    const { snapshot } = parseDsl("@Test\n@atlas /a/b\n");
    expect(snapshot.palaceName).toBe("Test");
    expect(snapshot.atlasPath).toBe("/a/b");
  });

  it("supports multi-word palace names", () => {
    const { snapshot } = parseDsl("@SOLID Citadel\n");
    expect(snapshot.palaceName).toBe("SOLID Citadel");
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
        semantic: { cast: "0010", alias: null, form: "cast", resolvedCast: "0010" },
        sourceLine: 11,
      },
      {
        targetTitle: "Gravity",
        cast: { ab: "Giant", cd: "Crushing", ef: "Rock", gh: "" },
        semantic: { cast: "1110", alias: null, form: "cast", resolvedCast: "1110" },
        sourceLine: 12,
      },
    ]);

    expect(snapshot.routes).toEqual([
      {
        name: "First Walk",
        normalizedName: "first-walk",
        metadata: [],
        loci: ["Newton's Laws", "F = ma", "Gravity"],
        sourceLine: 17,
      },
    ]);
  });
});

describe("parseDsl — diagnostics", () => {
  it("emits duplicate-title at the second occurrence", () => {
    const text = "@P\n\nFoo\n: a\n\nFoo\n: b\n";
    const { diagnostics } = parseDsl(text);
    const dup = diagnostics.filter((d) => d.code === "duplicate-title");
    expect(dup).toHaveLength(1);
    expect(dup[0]!.severity).toBe("error");
    expect(dup[0]!.line).toBe(6);
  });

  it("emits unknown-target for an edge to a non-existent node and continues parsing", () => {
    const text = "@P\n\nA\n>Nonexistent\n>B\n\nB\n";
    const { snapshot, diagnostics } = parseDsl(text);
    const unknown = diagnostics.filter((d) => d.code === "unknown-target");
    expect(unknown).toHaveLength(1);
    expect(unknown[0]!.severity).toBe("warning");
    expect(unknown[0]!.line).toBe(4);
    expect(snapshot.nodes[0]!.edges.map((e) => e.targetTitle)).toEqual([
      "Nonexistent",
      "B",
    ]);
  });

  it("emits malformed-cast for invalid compact tokens", () => {
    const text = "@P\n\nA\n>B 5678\n\nB\n";
    const { diagnostics } = parseDsl(text);
    const bad = diagnostics.filter((d) => d.code === "malformed-cast");
    expect(bad).toHaveLength(1);
    expect(bad[0]!.severity).toBe("error");
    expect(bad[0]!.line).toBe(4);
  });

  it("emits misplaced-line for content/edge/tag before any node", () => {
    const text = "@P\n: body\n#tag\n>B\n";
    const { diagnostics } = parseDsl(text);
    const misplaced = diagnostics.filter((d) => d.code === "misplaced-line");
    expect(misplaced).toHaveLength(3);
    expect(misplaced.every((d) => d.severity === "error")).toBe(true);
    expect(misplaced.map((d) => d.line)).toEqual([2, 3, 4]);
  });

  it("emits misplaced-line for a route step before any route", () => {
    const text = "@P\n1 A\n";
    const { diagnostics } = parseDsl(text);
    const misplaced = diagnostics.filter((d) => d.code === "misplaced-line");
    expect(misplaced).toHaveLength(1);
    expect(misplaced[0]!.line).toBe(2);
  });
});

describe("parseDsl — portal targets", () => {
  it("parses /palaces/<name>#<route>@<node> into all three fields", () => {
    const text = "@P\n\nA\n@portal /palaces/foo#routeA@nodeB\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.nodes[0]!.kind).toBe("portal");
    expect(snapshot.nodes[0]!.portal).toEqual({
      targetPalaceName: "foo",
      targetRouteName: "routeA",
      targetNodeId: "nodeB",
    });
  });

  it("emits invalid-portal-target for malformed target", () => {
    const text = "@P\n\nA\n@portal not-a-path\n";
    const { diagnostics } = parseDsl(text);
    expect(diagnostics.some((d) => d.code === "invalid-portal-target")).toBe(true);
  });
});

describe("parseDsl — tags and comments", () => {
  it("emits tag-syntax warning for invalid tokens but keeps valid tags", () => {
    const text = "@P\n\nA\n#good_tag bad-tag $$$\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(snapshot.nodes[0]!.tags).toEqual(["good_tag", "bad-tag"]);
    const warnings = diagnostics.filter((d) => d.code === "tag-syntax");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]!.severity).toBe("warning");
  });

  it("ignores -- comment lines anywhere", () => {
    const text = "@P\n-- this is a comment\nA\n-- indented or not\n: body\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);
    expect(snapshot.nodes[0]!.content).toBe("body");
  });
});

describe("parseDsl — edges", () => {
  it("parses edge with 4-digit CAST inline", () => {
    const text = "@P\n\nA\n>B 1000\n\nB\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.nodes[0]!.edges[0]).toEqual({
      targetTitle: "B",
      cast: { ab: "Giant", cd: "", ef: "", gh: "" },
      semantic: { cast: "1000", alias: null, form: "cast", resolvedCast: "1000" },
      sourceLine: 4,
    });
  });

  it("parses edge with no CAST as all-empty cast", () => {
    const text = "@P\n\nA\n>B\n\nB\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.nodes[0]!.edges[0]!.cast).toEqual({
      ab: "",
      cd: "",
      ef: "",
      gh: "",
    });
  });

  it("parses multi-word target with CAST", () => {
    const text = "@P\n\nNewton's Laws\n\nF = ma\n>Newton's Laws 0010\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.nodes[1]!.edges[0]!.targetTitle).toBe("Newton's Laws");
    expect(snapshot.nodes[1]!.edges[0]!.cast).toEqual({
      ab: "",
      cd: "",
      ef: "Rock",
      gh: "",
    });
  });
});

describe("parseDsl — routes", () => {
  it("parses a route with ordered loci", () => {
    const text = "@P\n\nA\n\nB\n\n/Main\n1 A\n2 B\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.routes).toEqual([
      { name: "Main", normalizedName: "main", metadata: [], loci: ["A", "B"], sourceLine: 7 },
    ]);
  });

  it("supports route names with spaces", () => {
    const text = "@P\n\nA\n\n/First Walk\n1 A\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.routes[0]!.name).toBe("First Walk");
  });
});

describe("parseDsl — stable node identifiers (Feature 1)", () => {
  it("parses explicit [id] Title syntax and stores id and implicitId", () => {
    const { snapshot } = parseDsl("@P\n\n[auth] Authentication\n");
    const node = snapshot.nodes[0]!;
    expect(node.id).toBe("auth");
    expect(node.implicitId).toBe("auth");
    expect(node.title).toBe("Authentication");
  });

  it("normalizes uppercase id to lowercase", () => {
    const { snapshot, diagnostics } = parseDsl("@P\n\n[AUTH] Authentication\n");
    expect(snapshot.nodes[0]!.id).toBe("auth");
    expect(diagnostics.filter((d) => d.code === "malformed-node-id")).toHaveLength(0);
  });

  it("derives implicitId from title when no id declared", () => {
    const { snapshot } = parseDsl("@P\n\nJSON Web Token\n");
    expect(snapshot.nodes[0]!.id).toBeNull();
    expect(snapshot.nodes[0]!.implicitId).toBe("json-web-token");
  });

  it("derives collision-safe implicitId with numeric suffix", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n\nAuth\n");
    // second is duplicate title (error) but implicitId still assigned
    expect(snapshot.nodes[0]!.implicitId).toBe("auth");
  });

  it("emits duplicate-node-id for two nodes with the same explicit id", () => {
    const { diagnostics } = parseDsl("@P\n\n[auth] Authentication\n\n[auth] Auth Module\n");
    const dups = diagnostics.filter((d) => d.code === "duplicate-node-id");
    expect(dups).toHaveLength(1);
    expect(dups[0]!.severity).toBe("error");
    expect(dups[0]!.line).toBe(5);
  });

  it("emits malformed-node-id for an empty id []", () => {
    const { diagnostics } = parseDsl("@P\n\n[] Authentication\n");
    expect(diagnostics.some((d) => d.code === "malformed-node-id")).toBe(true);
  });

  it("emits reserved-node-id for reserved keyword ids", () => {
    const { diagnostics } = parseDsl("@P\n\n[palace] Authentication\n");
    expect(diagnostics.some((d) => d.code === "reserved-node-id")).toBe(true);
  });

  it("emits malformed-node-id for id starting with digit", () => {
    const { diagnostics } = parseDsl("@P\n\n[123] Authentication\n");
    expect(diagnostics.some((d) => d.code === "malformed-node-id")).toBe(true);
  });

  it("does not affect edge resolution — edges can target by title regardless of id", () => {
    const text = "@P\n\n[auth] Authentication\n>[auth] Authentication 0010\n\n[auth] Authentication\n";
    const { snapshot } = parseDsl(text);
    // edge target is stored as-is; resolution is by title
    expect(snapshot.nodes[0]!.edges[0]!.targetTitle).toBe("[auth] Authentication");
  });

  it("plain title nodes (no id) produce null id and derived implicitId", () => {
    const { snapshot } = parseDsl("@P\n\nPassword Hashing\n");
    expect(snapshot.nodes[0]!.id).toBeNull();
    expect(snapshot.nodes[0]!.implicitId).toBe("password-hashing");
  });
});

describe("parseDsl — route metadata (Feature 7)", () => {
  it("routes have normalizedName derived from route name", () => {
    const { snapshot } = parseDsl("@P\n\nA\n\n/Beginner Security\n1 A\n");
    expect(snapshot.routes[0]!.normalizedName).toBe("beginner-security");
  });

  it("routes without metadata have empty metadata array", () => {
    const { snapshot } = parseDsl("@P\n\nA\n\n/Main\n1 A\n");
    expect(snapshot.routes[0]!.metadata).toEqual([]);
  });

  it("structured tags before first locus are route metadata", () => {
    const text = "@P\n\nA\n\n/Beginner\n#difficulty:beginner #duration:45m\n1 A\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.code === "misplaced-line")).toHaveLength(0);
    expect(snapshot.routes[0]!.metadata).toHaveLength(2);
    expect(snapshot.routes[0]!.metadata[0]).toMatchObject({ key: "difficulty", value: "beginner" });
    expect(snapshot.routes[0]!.metadata[1]).toMatchObject({ key: "duration", value: "45m" });
  });

  it("metadata tags from multiple tag lines are merged", () => {
    const text = "@P\n\nA\n\n/Main\n#difficulty:beginner\n#mode:linear\n1 A\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.routes[0]!.metadata).toHaveLength(2);
  });

  it("tag lines after first locus are NOT route metadata", () => {
    const text = "@P\n\nA\n\nB\n\n/Main\n1 A\n#mode:linear\n2 B\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(snapshot.routes[0]!.metadata).toEqual([]);
    // tag after first member is misplaced
    expect(diagnostics.some((d) => d.code === "misplaced-line")).toBe(true);
  });

  it("loci are still collected after metadata tags", () => {
    const text = "@P\n\nA\n\nB\n\n/Main\n#difficulty:beginner\n1 A\n2 B\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.routes[0]!.loci).toEqual(["A", "B"]);
  });

  it("emits route-prereq-unresolved warning for unknown prereq", () => {
    const text = "@P\n\nA\n\n/Main\n#prereq:Missing Route\n1 A\n";
    const { diagnostics } = parseDsl(text);
    expect(diagnostics.some((d) => d.code === "route-prereq-unresolved")).toBe(true);
    expect(diagnostics.find((d) => d.code === "route-prereq-unresolved")!.severity).toBe("warning");
  });

  it("does not emit route-prereq-unresolved for a valid prereq", () => {
    const text = "@P\n\nA\n\n/Intro\n1 A\n\n/Advanced\n#prereq:Intro\n1 A\n";
    const { diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.code === "route-prereq-unresolved")).toHaveLength(0);
  });

  it("plain tags in route metadata are ignored (only structured tags stored)", () => {
    const text = "@P\n\nA\n\n/Main\n#plaintag #difficulty:beginner\n1 A\n";
    const { snapshot } = parseDsl(text);
    // Only structured tag is in metadata
    expect(snapshot.routes[0]!.metadata).toHaveLength(1);
    expect(snapshot.routes[0]!.metadata[0]).toMatchObject({ key: "difficulty" });
  });

  it("routes without metadata parse identically to before", () => {
    const { snapshot, diagnostics } = parseDsl("@P\n\nA\n\n/Main\n1 A\n");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    expect(snapshot.routes[0]!.loci).toEqual(["A"]);
    expect(snapshot.routes[0]!.metadata).toEqual([]);
  });
});

describe("parseDsl — inline node references (Feature 2)", () => {
  it("body with no refs produces single plain segment", () => {
    const { snapshot } = parseDsl("@P\n\nA\n: simple body\n");
    expect(snapshot.nodes[0]!.bodySegments).toEqual([{ kind: "plain", text: "simple body" }]);
  });

  it("parses @id ref and resolves against node implicitId", () => {
    const { snapshot, diagnostics } = parseDsl("@P\n\nAuth\n\nLogin\n: delegates to @auth for identity\n");
    expect(diagnostics.filter((d) => d.code === "inline-ref-unresolved-id")).toHaveLength(0);
    const segs = snapshot.nodes[1]!.bodySegments;
    const ref = segs.find((s) => s.kind === "ref");
    expect(ref).toMatchObject({ kind: "ref", refType: "id", value: "auth", resolved: "auth" });
  });

  it("parses [[Title]] ref and resolves against node title", () => {
    const { snapshot, diagnostics } = parseDsl("@P\n\nAuth\n\nLogin\n: see [[Auth]] for details\n");
    expect(diagnostics.filter((d) => d.code === "inline-ref-unresolved-title")).toHaveLength(0);
    const segs = snapshot.nodes[1]!.bodySegments;
    const ref = segs.find((s) => s.kind === "ref");
    expect(ref).toMatchObject({ kind: "ref", refType: "title", value: "Auth", resolved: "auth" });
  });

  it("parses &alias ref and resolves to cast token", () => {
    const { snapshot, diagnostics } = parseDsl("@P\n~dep:1000\n\nA\n: see &dep concept\n");
    expect(diagnostics.filter((d) => d.code === "inline-ref-unresolved-alias")).toHaveLength(0);
    const ref = snapshot.nodes[0]!.bodySegments.find((s) => s.kind === "ref");
    expect(ref).toMatchObject({ kind: "ref", refType: "alias", value: "dep", resolved: "1000" });
  });

  it("emits inline-ref-unresolved-id error for unknown @id", () => {
    const { diagnostics } = parseDsl("@P\n\nA\n: see @unknown node\n");
    expect(diagnostics.some((d) => d.code === "inline-ref-unresolved-id")).toBe(true);
    expect(diagnostics.find((d) => d.code === "inline-ref-unresolved-id")!.severity).toBe("error");
  });

  it("emits inline-ref-unresolved-title warning for unknown [[Title]]", () => {
    const { diagnostics } = parseDsl("@P\n\nA\n: see [[Missing Node]] here\n");
    expect(diagnostics.some((d) => d.code === "inline-ref-unresolved-title")).toBe(true);
    expect(diagnostics.find((d) => d.code === "inline-ref-unresolved-title")!.severity).toBe("warning");
  });

  it("emits inline-ref-unresolved-alias warning for unknown &alias", () => {
    const { diagnostics } = parseDsl("@P\n\nA\n: via &nope thing\n");
    expect(diagnostics.some((d) => d.code === "inline-ref-unresolved-alias")).toBe(true);
    expect(diagnostics.find((d) => d.code === "inline-ref-unresolved-alias")!.severity).toBe("warning");
  });

  it("emits inline-ref-unclosed error for [[without closing", () => {
    const { diagnostics } = parseDsl("@P\n\nA\n: see [[Unclosed here\n");
    expect(diagnostics.some((d) => d.code === "inline-ref-unclosed")).toBe(true);
    expect(diagnostics.find((d) => d.code === "inline-ref-unclosed")!.severity).toBe("error");
    expect(diagnostics.find((d) => d.code === "inline-ref-unclosed")!.line).toBe(4);
  });

  it("emits inline-ref-self warning for self-referencing @id", () => {
    const { diagnostics } = parseDsl("@P\n\nauth\n: @auth is the authentication module\n");
    expect(diagnostics.some((d) => d.code === "inline-ref-self")).toBe(true);
  });

  it("handles escape sequences \\@ \\& \\[[ as literals", () => {
    const { snapshot } = parseDsl("@P\n\nA\n: write \\@user and \\[[Title]] and \\&alias\n");
    const segs = snapshot.nodes[0]!.bodySegments;
    expect(segs.every((s) => s.kind === "plain")).toBe(true);
    const joined = segs.map((s) => (s as { text: string }).text).join("");
    expect(joined).toContain("@user");
    expect(joined).toContain("[[Title]]");
    expect(joined).toContain("&alias");
  });

  it("resolves @id to lowercase — @Auth resolves same as @auth", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n\nLogin\n: delegates to @Auth for identity\n");
    const ref = snapshot.nodes[1]!.bodySegments.find((s) => s.kind === "ref");
    expect(ref).toMatchObject({ value: "auth", resolved: "auth" });
  });

  it("multi-line body accumulates segments with \\n between lines", () => {
    const { snapshot } = parseDsl("@P\n\nA\n: line one\n: line two\n");
    const segs = snapshot.nodes[0]!.bodySegments;
    const texts = segs.map((s) => (s as { text: string }).text);
    expect(texts).toContain("\n");
    expect(texts).toContain("line one");
    expect(texts).toContain("line two");
  });

  it("existing body text without refs produces no diagnostics and empty refs", () => {
    const { snapshot, diagnostics } = parseDsl("@P\n\nA\n: plain text body no special chars\n");
    expect(diagnostics).toHaveLength(0);
    expect(snapshot.nodes[0]!.bodySegments.every((s) => s.kind === "plain")).toBe(true);
  });

  it("content field remains unchanged alongside bodySegments", () => {
    const { snapshot } = parseDsl("@P\n\nA\n: verifies @id identity\n");
    expect(snapshot.nodes[0]!.content).toBe("verifies @id identity");
  });
});

describe("parseDsl — edge semantic aliases (Feature 3)", () => {
  it("parses ~alias:cast declaration into snapshot.aliases", () => {
    const text = "@P\n~dep:0001 depends on\n\nA\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);
    expect(snapshot.aliases).toEqual([
      { alias: "dep", cast: "0001", description: "depends on", sourceLine: 2 },
    ]);
  });

  it("parses alias declaration without description", () => {
    const { snapshot } = parseDsl("@P\n~uses:0020\n\nA\n");
    expect(snapshot.aliases[0]).toMatchObject({ alias: "uses", cast: "0020", description: null });
  });

  it("normalizes alias to lowercase", () => {
    const { snapshot } = parseDsl("@P\n~DEP:0001 depends on\n\nA\n");
    expect(snapshot.aliases[0]!.alias).toBe("dep");
  });

  it("resolves alias form edge — sets cast and semantic", () => {
    const text = "@P\n~dep:1000 depends on\n\nA\n>B dep\n\nB\n";
    const { snapshot } = parseDsl(text);
    const edge = snapshot.nodes[0]!.edges[0]!;
    expect(edge.targetTitle).toBe("B");
    expect(edge.cast).toEqual({ ab: "Giant", cd: "", ef: "", gh: "" });
    expect(edge.semantic).toMatchObject({ alias: "dep", form: "alias", resolvedCast: "1000" });
  });

  it("resolves bracketed alias form [alias]", () => {
    const text = "@P\n~dep:0001\n\nA\n>B [dep]\n\nB\n";
    const { snapshot } = parseDsl(text);
    const edge = snapshot.nodes[0]!.edges[0]!;
    expect(edge.semantic).toMatchObject({ alias: "dep", form: "bracketed", resolvedCast: "0001" });
  });

  it("resolves hybrid form CAST:alias — no conflict", () => {
    const text = "@P\n~dep:0001\n\nA\n>B 0001:dep\n\nB\n";
    const { snapshot, diagnostics } = parseDsl(text);
    const edge = snapshot.nodes[0]!.edges[0]!;
    expect(edge.semantic).toMatchObject({ cast: "0001", alias: "dep", form: "hybrid", resolvedCast: "0001" });
    expect(diagnostics.filter((d) => d.code === "alias-cast-conflict")).toHaveLength(0);
  });

  it("emits alias-cast-conflict for hybrid edge where alias maps to different CAST", () => {
    const text = "@P\n~dep:0001\n\nA\n>B 0010:dep\n\nB\n";
    const { diagnostics } = parseDsl(text);
    const conflicts = diagnostics.filter((d) => d.code === "alias-cast-conflict");
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]!.severity).toBe("error");
    expect(conflicts[0]!.line).toBe(5);
  });

  it("emits alias-unresolved warning for unknown bracketed alias", () => {
    const text = "@P\n\nA\n>B [unknown]\n\nB\n";
    const { diagnostics } = parseDsl(text);
    const unresolved = diagnostics.filter((d) => d.code === "alias-unresolved");
    expect(unresolved).toHaveLength(1);
    expect(unresolved[0]!.severity).toBe("warning");
  });

  it("emits alias-unresolved warning for unknown word alias", () => {
    const text = "@P\n\nA\n>B notanalias\n\nB\n";
    const { snapshot, diagnostics } = parseDsl(text);
    // "notanalias" is not in alias table — entire rest is target
    expect(diagnostics.filter((d) => d.code === "alias-unresolved")).toHaveLength(0);
    expect(snapshot.nodes[0]!.edges[0]!.targetTitle).toBe("B notanalias");
  });

  it("emits alias-duplicate for two declarations with the same alias", () => {
    const text = "@P\n~dep:0001\n~dep:0010\n\nA\n";
    const { diagnostics } = parseDsl(text);
    const dups = diagnostics.filter((d) => d.code === "alias-duplicate");
    expect(dups).toHaveLength(1);
    expect(dups[0]!.severity).toBe("error");
    expect(dups[0]!.line).toBe(3);
  });

  it("emits alias-malformed for unparseable ~ line", () => {
    const text = "@P\n~bad declaration!!!\n\nA\n";
    const { diagnostics } = parseDsl(text);
    expect(diagnostics.some((d) => d.code === "alias-malformed")).toBe(true);
  });

  it("two-pass: alias declared after usage still resolves", () => {
    const text = "@P\n\nA\n>B dep\n\nB\n~dep:0001\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.code === "alias-unresolved")).toHaveLength(0);
    const edge = snapshot.nodes[0]!.edges[0]!;
    expect(edge.semantic).toMatchObject({ alias: "dep", form: "alias", resolvedCast: "0001" });
  });

  it("existing 4-digit CAST edges are unchanged", () => {
    const text = "@P\n\nA\n>B 1000\n\nB\n";
    const { snapshot, diagnostics } = parseDsl(text);
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);
    const edge = snapshot.nodes[0]!.edges[0]!;
    expect(edge.cast).toEqual({ ab: "Giant", cd: "", ef: "", gh: "" });
    expect(edge.semantic).toMatchObject({ form: "cast", cast: "1000", alias: null });
  });
});

describe("parseDsl — structured tags (Feature 5)", () => {
  it("parses #key:value into structuredTags", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n#domain:security\n");
    const node = snapshot.nodes[0]!;
    expect(node.structuredTags).toEqual([{ key: "domain", value: "security", raw: "#domain:security" }]);
  });

  it("stores structured tag as key:value in flat tags for backward compat", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n#domain:security\n");
    expect(snapshot.nodes[0]!.tags).toContain("domain:security");
  });

  it("parses multiple structured tags on one line", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n#domain:security #difficulty:advanced\n");
    const { structuredTags } = snapshot.nodes[0]!;
    expect(structuredTags).toHaveLength(2);
    expect(structuredTags[0]).toMatchObject({ key: "domain", value: "security" });
    expect(structuredTags[1]).toMatchObject({ key: "difficulty", value: "advanced" });
  });

  it("parses plain tags alongside structured tags on the same line", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n#security #domain:auth\n");
    const node = snapshot.nodes[0]!;
    expect(node.tags).toContain("security");
    expect(node.tags).toContain("domain:auth");
    expect(node.structuredTags).toHaveLength(1);
    expect(node.structuredTags[0]).toMatchObject({ key: "domain", value: "auth" });
  });

  it("normalizes structured tag keys to lowercase", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n#Domain:Security\n");
    expect(snapshot.nodes[0]!.structuredTags[0]).toMatchObject({ key: "domain", value: "Security" });
  });

  it("handles empty value in structured tag #key:", () => {
    const { snapshot } = parseDsl("@P\n\nAuth\n#status:\n");
    expect(snapshot.nodes[0]!.structuredTags[0]).toMatchObject({ key: "status", value: null });
  });

  it("merges structured tags from multiple tag lines on the same node", () => {
    const text = "@P\n\nAuth\n#domain:security\n#difficulty:advanced\n";
    const { snapshot } = parseDsl(text);
    expect(snapshot.nodes[0]!.structuredTags).toHaveLength(2);
  });

  it("does not emit diagnostics for valid structured tags", () => {
    const { diagnostics } = parseDsl("@P\n\nAuth\n#domain:security #difficulty:beginner\n");
    expect(diagnostics.filter((d) => d.code === "tag-syntax")).toHaveLength(0);
  });
});
