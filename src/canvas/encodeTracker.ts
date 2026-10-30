import type { AnalyticsEventType } from "../domain/entities/types";
import { readClock, setClockHidden, startClock, tickClock, type ActiveClock } from "../domain/services/activeClock";
import type { SceneAnalyticsDiff } from "./analyticsSceneSnapshot";

/** What the learner has selected, as far as encoding goes: one node, one edge, or neither. */
export type EncodeTarget = { kind: "node"; nodeId: string } | { kind: "edge"; edgeId: string } | null;

export type EncodeRecord = {
  eventType: Extract<AnalyticsEventType, "node_encoded" | "edge_encoded">;
  nodeId: string | null;
  payload: Record<string, unknown>;
};

export type EdgeCommit = {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
  /** "tier1" (quick verb) or "tier2" (decoded CAST). */
  castTier: string;
  /** CAST slots the learner moved off their defaults. */
  changedSlots: string[];
};

type Session = {
  target: Exclude<EncodeTarget, null>;
  first: boolean;
  clock: ActiveClock;
  fields: Set<string>;
  title: string | null;
  sourceNodeId: string | null;
};

type Deps = {
  now: () => number;
  record: (event: EncodeRecord) => void;
  hidden?: boolean;
};

function sameTarget(a: EncodeTarget, b: EncodeTarget) {
  if (!a || !b) return a === b;
  if (a.kind === "node") return b.kind === "node" && a.nodeId === b.nodeId;
  return b.kind === "edge" && a.edgeId === b.edgeId;
}

/**
 * Times node and edge encodes on one canvas. An encode runs from the moment a node is created
 * (or selected, for a re-edit) until the learner leaves it, and is recorded only if it changed
 * something. A new edge is timed from the first Connect click to Create edge.
 */
export class EncodeTracker {
  private session: Session | null = null;
  private connectClock: ActiveClock | null = null;
  /** Nodes made on this canvas whose first encode has not been recorded yet. */
  private readonly unencoded = new Map<string, ActiveClock>();
  private hidden: boolean;

  constructor(private readonly deps: Deps) {
    this.hidden = deps.hidden ?? false;
  }

  /** Any input from the learner. */
  activity() {
    const now = this.deps.now();
    if (this.session) this.session.clock = tickClock(this.session.clock, now);
    if (this.connectClock) this.connectClock = tickClock(this.connectClock, now);
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
    const now = this.deps.now();
    if (this.session) this.session.clock = setClockHidden(this.session.clock, hidden, now);
    if (this.connectClock) this.connectClock = setClockHidden(this.connectClock, hidden, now);
    for (const [nodeId, clock] of this.unencoded) this.unencoded.set(nodeId, setClockHidden(clock, hidden, now));
  }

  /** The canvas selection changed. Leaving the current target ends its encode. */
  select(target: EncodeTarget) {
    if (this.session && sameTarget(this.session.target, target)) return;
    this.end();
    if (target) this.begin(target);
  }

  /** Scene changes from the canvas: which nodes were made and which fields changed. */
  sceneChanged(diffs: readonly SceneAnalyticsDiff[]) {
    const created = diffs.filter((diff) => diff.eventType === "node_created" && diff.nodeId);
    // A bulk change (DSL apply, a pipeline) makes many nodes at once; that is not an encode.
    if (created.length === 1) {
      const nodeId = created[0].nodeId!;
      const current = this.session?.target;
      if (current?.kind === "node" && current.nodeId === nodeId) {
        this.session!.first = true;
      } else {
        this.unencoded.set(nodeId, startClock(this.deps.now(), this.hidden));
      }
    }
    const session = this.session;
    if (!session) return;
    for (const diff of diffs) {
      const fields = Array.isArray(diff.payload.changedFields) ? (diff.payload.changedFields as string[]) : [];
      if (session.target.kind === "node" && diff.eventType === "node_updated" && diff.nodeId === session.target.nodeId) {
        fields.forEach((field) => session.fields.add(field));
        if (typeof diff.payload.title === "string") session.title = diff.payload.title;
      }
      if (session.target.kind === "edge" && diff.eventType === "edge_updated" && diff.payload.edgeId === session.target.edgeId) {
        fields.forEach((field) => session.fields.add(field));
        session.sourceNodeId = diff.nodeId ?? session.sourceNodeId;
      }
    }
  }

  /** The first Connect click: a new edge starts here. */
  connectStarted() {
    this.connectClock = startClock(this.deps.now(), this.hidden);
  }

  /** Create edge in the CAST dialog. */
  edgeCommitted(commit: EdgeCommit) {
    const reading = this.connectClock ? readClock(this.connectClock, this.deps.now()) : null;
    this.connectClock = null;
    this.deps.record({
      eventType: "edge_encoded",
      nodeId: commit.sourceNodeId,
      payload: {
        edgeId: commit.edgeId,
        sourceNodeId: commit.sourceNodeId,
        targetNodeId: commit.targetNodeId,
        label: commit.label,
        first: true,
        activeMs: reading?.activeMs ?? null,
        wallMs: reading?.wallMs ?? null,
        castTier: commit.castTier,
        changedSlots: commit.changedSlots,
      },
    });
  }

  /** The canvas is going away: close whatever encode is open. */
  dispose() {
    this.end();
    this.connectClock = null;
    this.unencoded.clear();
  }

  private begin(target: Exclude<EncodeTarget, null>) {
    const pending = target.kind === "node" ? this.unencoded.get(target.nodeId) : undefined;
    this.session = {
      target,
      first: pending !== undefined,
      clock: pending ?? startClock(this.deps.now(), this.hidden),
      fields: new Set(),
      title: null,
      sourceNodeId: null,
    };
  }

  private end() {
    const session = this.session;
    this.session = null;
    if (!session || session.fields.size === 0) return;
    const { activeMs, wallMs } = readClock(session.clock, this.deps.now());
    const fields = [...session.fields];
    if (session.target.kind === "node") {
      this.unencoded.delete(session.target.nodeId);
      this.deps.record({
        eventType: "node_encoded",
        nodeId: session.target.nodeId,
        payload: { title: session.title, first: session.first, activeMs, wallMs, fields },
      });
      return;
    }
    this.deps.record({
      eventType: "edge_encoded",
      nodeId: session.sourceNodeId,
      payload: { edgeId: session.target.edgeId, first: false, activeMs, wallMs, fields },
    });
  }
}

let activeTracker: EncodeTracker | null = null;

/** The tracker of the canvas on screen, for handlers outside the canvas (the CAST dialog). */
export function activeEncodeTracker(): EncodeTracker | null {
  return activeTracker;
}

export function setActiveEncodeTracker(tracker: EncodeTracker | null) {
  activeTracker = tracker;
}
