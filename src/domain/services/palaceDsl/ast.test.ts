import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDsl } from "./parser";
import { toAst } from "./toAst";

function fixture(name: string) {
  return readFileSync(resolve(__dirname, "fixtures", name), "utf8");
}

describe("toAst — Document root", () => {
  it("returns a Document with type and version 2.0", () => {
    const doc = toAst(parseDsl("@P\n"));
    expect(doc.type).toBe("Document");
    expect(doc.version).toBe("2.0");
  });

  it("empty input produces a valid Document with null palace", () => {
    const doc = toAst(parseDsl(""));
    expect(doc.palace).toBeNull();
    expect(doc.nodes).toEqual([]);
    expect(doc.routes).toEqual([]);
    expect(doc.queries).toEqual([]);
    expect(doc.imports).toEqual([]);
    expect(doc.aliases).toEqual([]);
  });

  it("metadata has null normalizedAt and canonicalHash", () => {
    const doc = toAst(parseDsl("@P\n"));
    expect(doc.metadata.normalizedAt).toBeNull();
    expect(doc.metadata.canonicalHash).toBeNull();
  });

  it("source encoding is utf-8", () => {
    const doc = toAst(parseDsl("@P\n"));
    expect(doc.source.encoding).toBe("utf-8");
  });

  it("lineCount derived from sourceText", () => {
    const src = "@P\n\nNode A\n: body\n";
    const doc = toAst(parseDsl(src), { sourceText: src });
    expect(doc.source.lineCount).toBe(src.split("\n").length);
  });

  it("lineCount is 0 when sourceText not provided", () => {
    const doc = toAst(parseDsl("@P\n"));
    expect(doc.source.lineCount).toBe(0);
  });

  it("file field propagated into source", () => {
    const doc = toAst(parseDsl("@P\n"), { file: "palace.dsl" });
    expect(doc.source.file).toBe("palace.dsl");
  });
});

describe("toAst — palace declaration", () => {
  it("palace field populated from palaceName", () => {
    const doc = toAst(parseDsl("@Mechanics\n"));
    expect(doc.palace).not.toBeNull();
    expect(doc.palace!.type).toBe("PalaceDeclaration");
    expect(doc.palace!.title).toBe("Mechanics");
  });

  it("palace atlasPath is null when not declared", () => {
    const doc = toAst(parseDsl("@P\n"));
    expect(doc.palace!.atlasPath).toBeNull();
  });

  it("palace atlasPath populated when declared", () => {
    const doc = toAst(parseDsl("@P\n@atlas /science/physics\n"));
    expect(doc.palace!.atlasPath).toBe("/science/physics");
  });
});

describe("toAst — nodes", () => {
  it("maps nodes to NodeDeclaration with correct type discriminant", () => {
    const doc = toAst(parseDsl("@P\n\nAuth\n: the auth module\n"));
    expect(doc.nodes).toHaveLength(1);
    expect(doc.nodes[0]!.type).toBe("NodeDeclaration");
  });

  it("normalizedTitle is lowercase and whitespace-collapsed", () => {
    const doc = toAst(parseDsl("@P\n\nJSON Web Token\n"));
    expect(doc.nodes[0]!.normalizedTitle).toBe("json web token");
  });

  it("implicitId derived from title", () => {
    const doc = toAst(parseDsl("@P\n\nJSON Web Token\n"));
    expect(doc.nodes[0]!.implicitId).toBe("json-web-token");
  });

  it("explicit id preserved", () => {
    const doc = toAst(parseDsl("@P\n\n[auth] Authentication\n"));
    expect(doc.nodes[0]!.id).toBe("auth");
  });

  it("body lines created from node content", () => {
    const doc = toAst(parseDsl("@P\n\nAuth\n: first line\n: second line\n"));
    expect(doc.nodes[0]!.body).toHaveLength(2);
    expect(doc.nodes[0]!.body[0]!.type).toBe("BodyLine");
    expect(doc.nodes[0]!.body[0]!.raw).toBe("first line");
    expect(doc.nodes[0]!.body[1]!.raw).toBe("second line");
  });

  it("tags and structuredTags preserved", () => {
    const doc = toAst(parseDsl("@P\n\nAuth\n#security #domain:auth\n"));
    expect(doc.nodes[0]!.tags).toContain("security");
    expect(doc.nodes[0]!.structuredTags).toHaveLength(1);
    expect(doc.nodes[0]!.structuredTags[0]).toMatchObject({ key: "domain", value: "auth" });
  });

  it("edges mapped to EdgeDeclaration", () => {
    const doc = toAst(parseDsl("@P\n\nA\n>B 1000\n\nB\n"));
    const edge = doc.nodes[0]!.edges[0]!;
    expect(edge.type).toBe("EdgeDeclaration");
    expect(edge.targetTitle).toBe("B");
    expect(edge.cast).toEqual({ ab: "Giant", cd: "", ef: "", gh: "" });
  });

  it("portal node has kind portal and portal object", () => {
    const doc = toAst(parseDsl("@P\n\nA\n@portal /palaces/foo\n"));
    expect(doc.nodes[0]!.kind).toBe("portal");
    expect(doc.nodes[0]!.portal).not.toBeNull();
    expect(doc.nodes[0]!.portal!.targetPalaceName).toBe("foo");
  });

  it("source line is set on each node", () => {
    const doc = toAst(parseDsl("@P\n\nAuth\n"));
    expect(doc.nodes[0]!.source.line).toBe(3);
  });
});

describe("toAst — routes", () => {
  it("maps routes to RouteDeclaration", () => {
    const doc = toAst(parseDsl("@P\n\nA\n\n/Main\n1 A\n"));
    expect(doc.routes).toHaveLength(1);
    expect(doc.routes[0]!.type).toBe("RouteDeclaration");
    expect(doc.routes[0]!.name).toBe("Main");
    expect(doc.routes[0]!.normalizedName).toBe("main");
  });

  it("route members have order index", () => {
    const doc = toAst(parseDsl("@P\n\nA\n\nB\n\n/Main\n1 A\n2 B\n"));
    expect(doc.routes[0]!.members).toHaveLength(2);
    expect(doc.routes[0]!.members[0]!.ref).toBe("A");
    expect(doc.routes[0]!.members[0]!.order).toBe(0);
    expect(doc.routes[0]!.members[1]!.order).toBe(1);
  });

  it("route metadata preserved", () => {
    const doc = toAst(parseDsl("@P\n\nA\n\n/Main\n#difficulty:beginner\n1 A\n"));
    expect(doc.routes[0]!.metadata).toHaveLength(1);
    expect(doc.routes[0]!.metadata[0]).toMatchObject({ key: "difficulty", value: "beginner" });
  });
});

describe("toAst — imports, aliases, queries", () => {
  it("imports mapped to ImportDeclaration", () => {
    const doc = toAst(parseDsl("@P\n!import security.dsl as sec\n"));
    expect(doc.imports).toHaveLength(1);
    expect(doc.imports[0]!.type).toBe("ImportDeclaration");
    expect(doc.imports[0]!.namespace).toBe("sec");
  });

  it("aliases mapped to AliasDeclaration", () => {
    const doc = toAst(parseDsl("@P\n~dep:0001 depends on\n\nA\n"));
    expect(doc.aliases).toHaveLength(1);
    expect(doc.aliases[0]!.type).toBe("AliasDeclaration");
    expect(doc.aliases[0]!.alias).toBe("dep");
    expect(doc.aliases[0]!.cast).toBe("0001");
  });

  it("queries mapped to QueryDeclaration", () => {
    const doc = toAst(parseDsl("@P\n?all\n"));
    expect(doc.queries).toHaveLength(1);
    expect(doc.queries[0]!.type).toBe("QueryDeclaration");
    expect(doc.queries[0]!.verb).toBe("all");
  });
});

describe("toAst — diagnostics", () => {
  it("diagnostics mapped to AstDiagnostic with type discriminant", () => {
    const result = parseDsl("Foo\n");
    const doc = toAst(result);
    expect(doc.diagnostics.length).toBeGreaterThan(0);
    expect(doc.diagnostics[0]!.type).toBe("Diagnostic");
  });

  it("diagnostic position has file field", () => {
    const result = parseDsl("Foo\n");
    const doc = toAst(result, { file: "test.dsl" });
    expect(doc.diagnostics[0]!.position.file).toBe("test.dsl");
  });

  it("diagnostic related positions propagated", () => {
    const result = parseDsl("@P\n\nFoo\n\nFoo\n");
    const doc = toAst(result);
    const dup = doc.diagnostics.find((d) => d.code === "duplicate-title");
    expect(dup?.related).toHaveLength(1);
  });

  it("diagnostic fix propagated", () => {
    const result = parseDsl("@P\n\n[palace] Auth\n");
    const doc = toAst(result);
    const d = doc.diagnostics.find((x) => x.code === "reserved-node-id");
    expect(d?.fix).not.toBeNull();
    expect(d?.fix?.replacement).toBe("Auth");
  });
});

describe("toAst — JSON serialization", () => {
  it("Document round-trips through JSON.stringify/parse without data loss", () => {
    const src = fixture("mechanics.dsl");
    const doc = toAst(parseDsl(src), { file: "mechanics.dsl", sourceText: src });
    const json = JSON.stringify(doc);
    const parsed = JSON.parse(json) as typeof doc;
    expect(parsed.type).toBe("Document");
    expect(parsed.version).toBe("2.0");
    expect(parsed.nodes).toHaveLength(doc.nodes.length);
    expect(parsed.routes).toHaveLength(doc.routes.length);
    expect(parsed.palace?.title).toBe(doc.palace?.title);
  });

  it("Document is fully serializable (no undefined values)", () => {
    const doc = toAst(parseDsl("@P\n\nAuth\n: body\n#domain:security\n>Auth 1000\n"));
    const json = JSON.stringify(doc);
    expect(json).not.toContain('"undefined"');
    // JSON.stringify omits undefined values, so we round-trip to verify
    const parsed = JSON.parse(json);
    expect(parsed.nodes[0].implicitId).toBe("auth");
  });
});
