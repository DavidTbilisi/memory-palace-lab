/**
 * Reference documents that live outside `theSystem/` (repo docs shipped into
 * the Library). Loaded on demand as raw markdown.
 */
export type ReferenceDoc = {
  slug: string;
  title: string;
  summary: string;
  load: () => Promise<string>;
};

export const REFERENCE_DOCS: readonly ReferenceDoc[] = [
  {
    slug: "palace-dsl",
    title: "Palace DSL reference",
    summary:
      "The line-oriented text format behind the split-pane DSL editor: nodes, stable ids, tags, CAST edges, portals, routes, imports, and diagnostics.",
    load: () => import("../../docs/palace-dsl.md?raw").then((module) => module.default),
  },
];
