import { describe, expect, it } from "vitest";
import {
  evaluate,
  learningOrder,
  norm,
  stepCost,
  type DifficultyBatch,
  type DifficultyResult,
} from "./difficulty";

// The exact DSA demo batch from tools/difficulty.py (demo_batch), so this test
// pins TS↔Python parity. Canonical values were generated with:
//   python tools/difficulty.py --demo --no-absorption --json out.json
const DEMO: DifficultyBatch = {
  capacity: 4,
  rows: [
    {
      topic: "arrays",
      needs: [],
      new_ideas: 1,
      normal_links: 1,
      breaks: [],
      analogy_links: 0,
      juggle: 2,
    },
    {
      topic: "big-o",
      needs: [],
      new_ideas: 6,
      normal_links: 4,
      breaks: ["every operation counts equally"],
      analogy_links: 1,
      juggle: 3,
      key_idea: "only the fastest-growing term matters",
    },
    {
      topic: "linked-lists",
      needs: ["arrays"],
      new_ideas: 5,
      normal_links: 4,
      breaks: ["data lives at sequential indices"],
      analogy_links: 1,
      juggle: 4,
    },
    {
      topic: "stacks-queues",
      needs: ["arrays", "linked-lists"],
      new_ideas: 4,
      normal_links: 3,
      breaks: [],
      analogy_links: 1,
      juggle: 2,
    },
    {
      topic: "hash-tables",
      needs: ["arrays"],
      new_ideas: 6,
      normal_links: 5,
      breaks: ["lookup means searching"],
      analogy_links: 1,
      juggle: 4,
      key_idea: "compute where it lives instead of searching for it",
    },
    {
      topic: "recursion",
      needs: ["functions", "loops"],
      new_ideas: 5,
      normal_links: 5,
      breaks: [
        "execution runs top-to-bottom once",
        "a function finishes before another starts",
        "there is one copy of the local variables",
      ],
      analogy_links: 1,
      juggle: 6,
      key_idea: "assume it works for n-1; handle the base case; combine",
    },
    {
      topic: "sorting",
      needs: ["recursion"],
      new_ideas: 5,
      normal_links: 5,
      breaks: ["a pivot sorts everything around it"],
      analogy_links: 1,
      juggle: 5,
      key_idea: "divide and conquer: split, solve the halves, combine",
    },
    {
      topic: "binary-search",
      needs: ["arrays", "comparison"],
      new_ideas: 3,
      normal_links: 3,
      breaks: [],
      analogy_links: 1,
      juggle: 4,
      key_idea: "halve the search space every step",
    },
    {
      topic: "trees-bst",
      needs: ["recursion", "linked-lists"],
      new_ideas: 6,
      normal_links: 5,
      breaks: [],
      analogy_links: 1,
      juggle: 5,
    },
    {
      topic: "heaps",
      needs: ["trees-bst", "arrays"],
      new_ideas: 5,
      normal_links: 4,
      breaks: ["a tree needs pointers"],
      analogy_links: 1,
      juggle: 4,
      key_idea: "a tree stored in a flat array via index arithmetic",
    },
    {
      topic: "graphs",
      needs: ["trees-bst"],
      new_ideas: 5,
      normal_links: 4,
      breaks: [],
      analogy_links: 1,
      juggle: 3,
    },
    {
      topic: "bfs-dfs",
      needs: ["graphs", "stacks-queues", "recursion"],
      new_ideas: 5,
      normal_links: 5,
      breaks: [],
      analogy_links: 1,
      juggle: 5,
    },
    {
      topic: "dijkstra",
      needs: ["graphs", "bfs-dfs", "heaps"],
      new_ideas: 5,
      normal_links: 5,
      breaks: ["taking the nearest edge each step is enough"],
      analogy_links: 1,
      juggle: 6,
      key_idea:
        "finalize the closest unfinished node, then relax its neighbors",
    },
    {
      topic: "dynamic-programming",
      needs: ["recursion"],
      new_ideas: 8,
      normal_links: 6,
      breaks: ["you can solve it directly", "brute force is the only way"],
      analogy_links: 1,
      juggle: 7,
      key_idea:
        "define the subproblem state, then write the recurrence between states",
    },
    {
      topic: "greedy",
      needs: [],
      new_ideas: 3,
      normal_links: 3,
      breaks: ["local best is always global best"],
      analogy_links: 1,
      juggle: 3,
      key_idea: "prove the greedy choice is safe with an exchange argument",
    },
    {
      topic: "backtracking",
      needs: ["recursion", "bfs-dfs"],
      new_ideas: 4,
      normal_links: 4,
      breaks: [],
      analogy_links: 1,
      juggle: 5,
    },
  ],
};

const DEMO_KNOWN = new Set(
  [
    "variables",
    "loops",
    "functions",
    "comparison",
    "arrays",
    "linked-lists",
    "recursion",
  ].map(norm),
);

function byTopic(results: DifficultyResult[]) {
  return new Map(results.map((r) => [r.topic, r]));
}

describe("difficulty scorer — parity with tools/difficulty.py", () => {
  it("matches the canonical DSA demo step / for-you / from-zero values", () => {
    const results = evaluate(DEMO, DEMO_KNOWN);
    const m = byTopic(results);

    // canonical values from `python tools/difficulty.py --demo --no-absorption`
    expect(m.get("recursion")).toMatchObject({
      step: 21,
      for_you: 21,
      from_zero: 21,
      after: 5,
      wall: true,
    });
    expect(m.get("dynamic-programming")).toMatchObject({
      step: 27,
      for_you: 27,
      from_zero: 48,
      after: 5,
      wall: true,
    });
    expect(m.get("dijkstra")).toMatchObject({
      step: 15,
      for_you: 56,
      from_zero: 89,
      after: 3,
      wall: true,
    });
    expect(m.get("arrays")).toMatchObject({
      step: 2,
      for_you: 2,
      from_zero: 2,
      after: null,
      wall: false,
    });
    expect(m.get("heaps")).toMatchObject({
      step: 10,
      for_you: 20,
      from_zero: 53,
      after: 3,
      wall: false,
    });
    expect(m.get("big-o")).toMatchObject({
      step: 11,
      for_you: 11,
      from_zero: 11,
      after: 3,
      wall: false,
    });
  });

  it("matches the canonical learning order", () => {
    const results = evaluate(DEMO, DEMO_KNOWN);
    expect(learningOrder(results)).toEqual([
      "arrays",
      "binary-search",
      "greedy",
      "linked-lists",
      "stacks-queues",
      "big-o",
      "hash-tables",
      "recursion",
      "trees-bst",
      "graphs",
      "bfs-dfs",
      "backtracking",
      "heaps",
      "sorting",
      "dijkstra",
      "dynamic-programming",
    ]);
  });

  it("for-you shrinks below from-zero once prerequisites are absorbed", () => {
    const all = byTopic(evaluate(DEMO, DEMO_KNOWN));
    const zero = byTopic(evaluate(DEMO, new Set()));
    // dijkstra is far downstream; knowing the early DS makes it cheaper for-you
    expect(all.get("dijkstra")!.for_you).toBeLessThan(
      zero.get("dijkstra")!.for_you,
    );
  });

  it("stepCost applies the working-memory cliff quadratically", () => {
    // juggle 7, capacity 4 -> overload (7-4)^2 = 9; new_ideas 8 + links 6 + 3*2 breaks - 2*1 analogy = 18; total 27
    expect(stepCost(DEMO.rows[13], 4)).toBe(27); // dynamic-programming
  });
});
