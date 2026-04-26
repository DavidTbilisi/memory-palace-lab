import type { ToolMode, PalacePersistenceState } from "../../store/palaceStore";

export type ContextTipSelectedKind = "node" | "portal" | "edge" | null;
export type ContextTipAction = "open_learn" | "create_node" | "connect_mode" | "start_walk";

export type ContextualTipContext = {
  hasPalace: boolean;
  nodeCount: number;
  edgeCount: number;
  routeCount: number;
  locusCount: number;
  walkOpen: boolean;
  toolMode: ToolMode;
  selectedKind: ContextTipSelectedKind;
  persistenceState: PalacePersistenceState;
};

export type ContextualTip = {
  id: string;
  title: string;
  body: string;
  action?: ContextTipAction;
  ctaLabel?: string;
};

export function buildPrimaryContextHint(context: ContextualTipContext) {
  if (!context.hasPalace) {
    return "Create or open a palace to start shaping memory into places.";
  }
  if (context.toolMode === "connect") {
    return "Connect mode is live: click a source node, then a target node to define a CAST edge.";
  }
  if (context.selectedKind === "portal") {
    return "Portal selected: point it to another palace or route in the inspector to make it useful.";
  }
  if (context.nodeCount === 0) {
    return "Seed this palace with a few anchor nodes. Use Add Node or double-click empty canvas.";
  }
  if (context.nodeCount > 1 && context.edgeCount === 0) {
    return "These nodes are still isolated. Connect them with CAST so the graph carries meaning, not just labels.";
  }
  if (context.routeCount === 0) {
    return "Create a route to turn this graph into an ordered recall path, not just a loose concept map.";
  }
  if (context.routeCount > 0 && context.locusCount === 0) {
    return "Select a node and add it to the active route to create the first locus.";
  }
  if (context.locusCount > 0 && !context.walkOpen) {
    return "Turn Walk on to rehearse the route and test whether the sequence actually sticks.";
  }
  if (context.walkOpen) {
    return "Grade retrieval effort honestly. Again and Hard are useful signals, not failures.";
  }
  if (context.persistenceState === "dirty") {
    return "Draft recovery is active, but Save still creates the durable checkpoint you can trust.";
  }
  return "Double-click empty canvas to create a memory node, then connect and route it before the graph gets noisy.";
}

export function buildEligibleContextTips(context: ContextualTipContext) {
  const tips: ContextualTip[] = [];

  if (!context.hasPalace) {
    tips.push({
      id: "start-with-palace",
      title: "Start with a place, not a pile of notes",
      body: "Create a palace or open the tutorial flow first. Spatial structure should exist before the detail flood starts.",
      action: "open_learn",
      ctaLabel: "Open Help",
    });
    tips.push({
      id: "use-guides-first",
      title: "Use a scaffold when you are cold-starting",
      body: "Guides and examples are most useful before you build the first graph, not after the palace is already chaotic.",
      action: "open_learn",
      ctaLabel: "Show Help",
    });
    return tips;
  }

  if (context.nodeCount === 0) {
    tips.push({
      id: "seed-anchor-nodes",
      title: "Seed anchor nodes first",
      body: "One or two strong anchors are enough to start. Add a node at the center or double-click empty canvas to place the first memory object.",
      action: "create_node",
      ctaLabel: "Add Node",
    });
  }

  if (context.nodeCount > 1 && context.edgeCount === 0) {
    tips.push({
      id: "connect-meaning",
      title: "Give the graph meaning",
      body: "Two nodes without an edge are just neighbors. Use CAST connections so the graph encodes who affects what, how, and when.",
      action: "connect_mode",
      ctaLabel: "Connect Nodes",
    });
  }

  if (context.routeCount === 0 && context.nodeCount > 0) {
    tips.push({
      id: "create-first-route",
      title: "Build a recall path early",
      body: "Routes turn a graph into a memory journey. Create one path before adding too many more nodes.",
      action: "open_learn",
      ctaLabel: "Open Help",
    });
  }

  if (context.routeCount > 0 && context.locusCount === 0) {
    tips.push({
      id: "add-first-locus",
      title: "Routes need loci to become usable",
      body: "Select a node on the canvas, then add it to the active route. Until that happens, walk mode has nothing to rehearse.",
    });
  }

  if (context.locusCount > 0 && !context.walkOpen) {
    tips.push({
      id: "walk-before-expanding",
      title: "Rehearse before expanding",
      body: "Turn Walk on and step through the route. It is cheaper to find a broken sequence now than after the palace doubles in size.",
      action: "start_walk",
      ctaLabel: "Start Walk",
    });
  }

  if (context.walkOpen) {
    tips.push({
      id: "grade-effort-honestly",
      title: "Grade effort, not pride",
      body: "Use Again, Hard, Good, and Easy based on how retrieval felt. Honest grading makes later review and analytics actually useful.",
    });
  }

  if (context.toolMode === "connect") {
    tips.push({
      id: "connect-click-order",
      title: "Connect mode has a fixed rhythm",
      body: "Click source node first, then target node. The CAST dialog will capture the relationship once the pair is selected.",
    });
  }

  if (context.selectedKind === "portal") {
    tips.push({
      id: "portal-needs-target",
      title: "Portal nodes need a destination",
      body: "A portal is only useful after you point it at another palace or route from the inspector.",
    });
  }

  if (context.persistenceState === "dirty") {
    tips.push({
      id: "checkpoint-when-meaningful",
      title: "Drafts recover, checkpoints commit",
      body: "Autosave protects you from loss. Save is still the moment when this state becomes the trusted version.",
    });
  }

  tips.push({
    id: "learn-examples",
    title: "Examples are faster than staring at an empty graph",
    body: "If you feel stuck, open Help and load an example palace. It is better to mutate a structure than invent one from nothing.",
    action: "open_learn",
    ctaLabel: "Open Help",
  });

  return tips;
}

export function pickNextContextTip(
  tips: ContextualTip[],
  options?: {
    previousTipId?: string | null;
    random?: () => number;
  },
) {
  if (tips.length === 0) return null;
  const random = options?.random ?? Math.random;
  const withoutPrevious =
    options?.previousTipId && tips.length > 1 ? tips.filter((tip) => tip.id !== options.previousTipId) : tips;
  const pool = withoutPrevious.length > 0 ? withoutPrevious : tips;
  const index = Math.floor(random() * pool.length);
  return pool[index] ?? pool[0] ?? null;
}
