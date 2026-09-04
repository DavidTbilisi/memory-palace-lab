import type { DslSnapshot } from "./types";

export { dslToPalaceSnapshot } from "./toPalaceSnapshot";

export function stripSourceLines(dsl: DslSnapshot): DslSnapshot {
  return {
    palaceName: dsl.palaceName,
    atlasPath: dsl.atlasPath,
    nodes: dsl.nodes.map((n) => ({
      ...n,
      sourceLine: 0,
      edges: n.edges.map((e) => ({ ...e, sourceLine: 0 })),
    })),
    routes: dsl.routes.map((r) => ({ ...r, sourceLine: 0 })),
    aliases: dsl.aliases.map((a) => ({ ...a, sourceLine: 0 })),
    imports: dsl.imports.map((i) => ({ ...i, sourceLine: 0 })),
    queries: dsl.queries.map((q) => ({ ...q, sourceLine: 0 })),
  };
}
