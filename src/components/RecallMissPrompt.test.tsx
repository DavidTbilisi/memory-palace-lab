import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MemoryEdge, MemoryNode } from "../domain/entities/types";
import { usePalaceStore, type WalkMissPrompt } from "../store/palaceStore";
import { RecallMissPrompt } from "./RecallMissPrompt";

const node = (id: string, title: string): MemoryNode => ({ id, objectId: `o-${id}`, title, content: "", kind: "memory", portal: null });
const nodes = [node("n1", "Mutex"), node("n2", "Semaphore"), node("n3", "Monitor"), node("n4", "Barrier")];
const link: MemoryEdge = {
  id: "e1",
  objectId: "oe1",
  sourceNodeId: "n1",
  targetNodeId: "n4",
  castAb: "",
  castCd: "",
  castEf: "",
  castGh: "",
  kind: "confusion",
};

const prompt: WalkMissPrompt = {
  palaceId: "p1",
  routeId: "r1",
  locusId: "l1",
  nodeId: "n1",
  nodeTitle: "Mutex",
  slot: "distinguisher",
  sessionId: "s1",
  ratedAt: "2026-09-29T10:00:00.000Z",
  phase: "siege",
};

const explainWalkMiss = vi.fn(async () => undefined);
const linkWalkMissConfusion = vi.fn();
const dismissWalkMiss = vi.fn();

function setup(state: Partial<ReturnType<typeof usePalaceStore.getState>>) {
  act(() =>
    usePalaceStore.setState({
      editorRef: null,
      nodes,
      edges: [link],
      walkOpen: true,
      walkMissPrompt: null,
      walkMissNotice: null,
      explainWalkMiss,
      linkWalkMissConfusion,
      dismissWalkMiss,
      ...state,
    }),
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RecallMissPrompt", () => {
  it("shows nothing without a miss, or in the walk bar once the walk is closed", () => {
    setup({});
    const { rerender } = render(<RecallMissPrompt placement="walk" />);
    expect(screen.queryByRole("region", { name: "Missed recall" })).not.toBeInTheDocument();
    act(() => usePalaceStore.setState({ walkMissPrompt: prompt, walkOpen: false }));
    rerender(<RecallMissPrompt placement="walk" />);
    expect(screen.queryByRole("region", { name: "Missed recall" })).not.toBeInTheDocument();
    rerender(<RecallMissPrompt placement="summary" />);
    expect(screen.getByRole("region", { name: "Missed recall" })).toHaveTextContent("Missed Mutex?");
  });

  it("lists the palace's other nodes, linked neighbours first, and narrows as you type", async () => {
    const user = userEvent.setup();
    setup({ walkMissPrompt: prompt });
    render(<RecallMissPrompt placement="walk" />);
    const input = screen.getByRole("combobox", { name: "Mixed it up with" });
    await user.click(input);
    const list = screen.getByRole("listbox");
    expect(within(list).getAllByRole("option").map((option) => option.textContent)).toEqual([
      "Barrierlinked",
      "Monitor",
      "Semaphore",
    ]);
    await user.type(input, "sem");
    expect(within(list).getAllByRole("option").map((option) => option.textContent)).toEqual(["Semaphore"]);
    await user.click(within(list).getByRole("option", { name: "Semaphore" }));
    expect(explainWalkMiss).toHaveBeenCalledWith("confusion", "n2");
  });

  it("picks with the keyboard", async () => {
    const user = userEvent.setup();
    setup({ walkMissPrompt: prompt });
    render(<RecallMissPrompt placement="walk" />);
    await user.click(screen.getByRole("combobox", { name: "Mixed it up with" }));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(explainWalkMiss).toHaveBeenCalledWith("confusion", "n3");
  });

  it("logs a blank and can be dismissed", async () => {
    const user = userEvent.setup();
    setup({ walkMissPrompt: prompt });
    render(<RecallMissPrompt placement="walk" />);
    await user.click(screen.getByRole("button", { name: "Couldn't produce it" }));
    expect(explainWalkMiss).toHaveBeenCalledWith("blank");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(dismissWalkMiss).toHaveBeenCalled();
  });

  it("offers to link a new pair, with the notes about missing Distinguishers", async () => {
    const user = userEvent.setup();
    setup({
      walkMissNotice: {
        palaceId: "p1",
        nodeId: "n1",
        nodeTitle: "Mutex",
        otherNodeId: "n2",
        otherTitle: "Semaphore",
        offerLink: true,
        message: "Link Mutex and Semaphore as a confusion?",
        notes: ["Semaphore has no Distinguisher yet — add one so the review can tell them apart."],
      },
    });
    render(<RecallMissPrompt placement="summary" />);
    expect(screen.getByRole("status")).toHaveTextContent("Semaphore has no Distinguisher yet");
    await user.click(screen.getByRole("button", { name: "Link" }));
    expect(linkWalkMissConfusion).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Not now" }));
    expect(dismissWalkMiss).toHaveBeenCalled();
  });

  it("lets a plain confirmation go by itself", () => {
    vi.useFakeTimers();
    try {
      setup({
        walkMissNotice: {
          palaceId: "p1",
          nodeId: "n1",
          nodeTitle: "Mutex",
          otherNodeId: "n4",
          otherTitle: "Barrier",
          offerLink: false,
          message: "Logged. Mutex and Barrier are linked as a confusion.",
          notes: [],
        },
      });
      render(<RecallMissPrompt placement="walk" />);
      expect(screen.getByTestId("walk-miss-message")).toHaveTextContent("Logged. Mutex and Barrier");
      act(() => vi.advanceTimersByTime(8_000));
      expect(dismissWalkMiss).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
