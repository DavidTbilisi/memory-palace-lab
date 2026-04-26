export type GlossaryEntry = {
  term: string;
  definition: string;
  also?: string[];
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Locus",
    definition: "A single anchor point in a memory palace — a specific place you mentally visit to retrieve what is stored there.",
    also: ["loci"],
  },
  {
    term: "Memory Palace",
    definition: "A mental structure (building, route, space) used to store information at specific anchor points called loci.",
  },
  {
    term: "Method of Loci",
    definition: "The core technique: walk a familiar route mentally and place vivid images at each locus to encode information.",
  },
  {
    term: "CAST Edge",
    definition: "A typed semantic connection between nodes — Causal, Associative, Structural, or Temporal — used to model relationships.",
  },
  {
    term: "Spaced Repetition",
    definition: "A review schedule that increases intervals between reviews when recall is strong, and shortens them after failure.",
  },
  {
    term: "Active Recall",
    definition: "Testing yourself on material without looking at it first — stronger for retention than passive rereading.",
  },
  {
    term: "Route",
    definition: "An ordered sequence of loci through a palace — the path you follow in walk mode.",
  },
  {
    term: "Encoding",
    definition: "Transforming dry information into vivid, concrete, emotionally salient images to make it stick.",
  },
  {
    term: "Retrieval",
    definition: "The act of actively reconstructing information from memory — the event that strengthens long-term retention.",
  },
  {
    term: "Palace Portal",
    definition: "A node that links one palace to another — used to build atlas-level hierarchies across multiple spaces.",
  },
  {
    term: "Interleaving",
    definition: "Mixing different topics or routes in a single review session to strengthen discrimination and generalization.",
  },
  {
    term: "Walk Mode",
    definition: "A guided review that steps through each locus on a route and tests recall before revealing the stored answer.",
  },
];
