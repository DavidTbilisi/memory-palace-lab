import { beforeEach, describe, expect, it } from "vitest";
import { IDLE_CAP_MS } from "../domain/services/activeClock";
import type { SceneAnalyticsDiff } from "./analyticsSceneSnapshot";
import { EncodeTracker, type EncodeRecord } from "./encodeTracker";

const S = 1000;
let now = 0;
let records: EncodeRecord[] = [];
let tracker: EncodeTracker;

const created = (nodeId: string): SceneAnalyticsDiff => ({ eventType: "node_created", nodeId, payload: { title: "New node" } });
const updated = (nodeId: string, title: string, changedFields: string[]): SceneAnalyticsDiff => ({
  eventType: "node_updated",
  nodeId,
  payload: { title, changedFields },
});
const edgeUpdated = (edgeId: string, changedFields: string[]): SceneAnalyticsDiff => ({
  eventType: "edge_updated",
  nodeId: "a",
  payload: { edgeId, changedFields },
});
const at = (seconds: number) => {
  now = seconds * S;
  tracker.activity();
};

beforeEach(() => {
  now = 0;
  records = [];
  tracker = new EncodeTracker({ now: () => now, record: (event) => records.push(event) });
});

describe("node encodes", () => {
  it("times a new node from creation until the learner leaves it", () => {
    tracker.sceneChanged([created("n1")]);
    tracker.select({ kind: "node", nodeId: "n1" });
    at(10);
    tracker.sceneChanged([updated("n1", "Mutex", ["title"])]);
    at(25);
    tracker.sceneChanged([updated("n1", "Mutex", ["content"])]);
    at(30);
    tracker.select({ kind: "node", nodeId: "n2" });
    expect(records).toEqual([
      {
        eventType: "node_encoded",
        nodeId: "n1",
        payload: { title: "Mutex", first: true, activeMs: 30 * S, wallMs: 30 * S, fields: ["title", "content"] },
      },
    ]);
  });

  it("counts a node selected before its creation diff arrives as a first encode", () => {
    tracker.select({ kind: "node", nodeId: "n1" });
    tracker.sceneChanged([created("n1")]);
    at(5);
    tracker.sceneChanged([updated("n1", "Mutex", ["title"])]);
    tracker.select(null);
    expect(records[0].payload).toMatchObject({ first: true, activeMs: 5 * S });
  });

  it("records nothing for a node left as it was", () => {
    tracker.sceneChanged([created("n1")]);
    tracker.select({ kind: "node", nodeId: "n1" });
    at(40);
    tracker.select(null);
    expect(records).toEqual([]);
  });

  it("keeps a node untouched on creation as unencoded, so its later first edit is still first", () => {
    tracker.sceneChanged([created("n1")]);
    tracker.select({ kind: "node", nodeId: "n1" });
    tracker.select(null);
    at(5);
    tracker.select({ kind: "node", nodeId: "n1" });
    tracker.sceneChanged([updated("n1", "Mutex", ["title"])]);
    tracker.select(null);
    expect(records[0].payload).toMatchObject({ first: true });
  });

  it("times an edit to an existing node as a re-edit, from selection", () => {
    at(100);
    tracker.select({ kind: "node", nodeId: "old" });
    at(104);
    tracker.sceneChanged([updated("old", "Mutex", ["content"])]);
    tracker.select(null);
    expect(records[0]).toMatchObject({ nodeId: "old", payload: { first: false, activeMs: 4 * S, fields: ["content"] } });
  });

  it("does not treat nodes made in bulk as encodes", () => {
    tracker.sceneChanged([created("a"), created("b")]);
    tracker.select({ kind: "node", nodeId: "a" });
    tracker.sceneChanged([updated("a", "A", ["title"])]);
    tracker.select(null);
    expect(records[0].payload).toMatchObject({ first: false });
  });

  it("leaves out time away: long pauses are capped and hidden time is dropped", () => {
    tracker.sceneChanged([created("n1")]);
    tracker.select({ kind: "node", nodeId: "n1" });
    at(8);
    at(8 + 180); // three idle minutes
    now = 200 * S;
    tracker.setHidden(true);
    now = 3800 * S; // an hour in another app
    tracker.setHidden(false);
    at(3805);
    tracker.sceneChanged([updated("n1", "Mutex", ["title"])]);
    tracker.select(null);
    expect(records[0].payload).toMatchObject({ activeMs: (8 + IDLE_CAP_MS / S + 12 + 5) * S, wallMs: 3805 * S });
  });

  it("records an encode it cannot time honestly as unmeasured", () => {
    now = 50 * S;
    tracker.select({ kind: "node", nodeId: "n1" });
    now = 10 * S; // the system clock went back
    tracker.sceneChanged([updated("n1", "Mutex", ["title"])]);
    tracker.select(null);
    expect(records[0].payload).toMatchObject({ activeMs: null });
  });

  it("closes the open encode when the canvas goes away", () => {
    tracker.select({ kind: "node", nodeId: "n1" });
    tracker.sceneChanged([updated("n1", "Mutex", ["title"])]);
    tracker.dispose();
    expect(records).toHaveLength(1);
  });
});

describe("edge encodes", () => {
  it("times a new edge from the first Connect click to Create edge", () => {
    at(3);
    tracker.connectStarted();
    at(9);
    at(15);
    tracker.edgeCommitted({
      edgeId: "e1",
      sourceNodeId: "a",
      targetNodeId: "b",
      label: "locks",
      castTier: "tier2",
      changedSlots: ["cd", "gh"],
    });
    expect(records).toEqual([
      {
        eventType: "edge_encoded",
        nodeId: "a",
        payload: {
          edgeId: "e1",
          sourceNodeId: "a",
          targetNodeId: "b",
          label: "locks",
          first: true,
          activeMs: 12 * S,
          wallMs: 12 * S,
          castTier: "tier2",
          changedSlots: ["cd", "gh"],
        },
      },
    ]);
  });

  it("records an edge committed without a timed Connect click as unmeasured", () => {
    tracker.edgeCommitted({ edgeId: "e1", sourceNodeId: "a", targetNodeId: "b", label: "", castTier: "tier1", changedSlots: [] });
    expect(records[0].payload).toMatchObject({ activeMs: null, wallMs: null });
  });

  it("times an edit to an existing edge as a re-edit", () => {
    tracker.select({ kind: "edge", edgeId: "e1" });
    at(7);
    tracker.sceneChanged([edgeUpdated("e1", ["castCd"])]);
    tracker.select(null);
    expect(records[0]).toMatchObject({
      eventType: "edge_encoded",
      nodeId: "a",
      payload: { edgeId: "e1", first: false, activeMs: 7 * S, fields: ["castCd"] },
    });
  });
});
