import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { Locus } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { NedfSlotsEditor } from "./NedfSlotsEditor";

type FakeShape = { id: string; type: "geo"; meta: Record<string, unknown> };

/** Just enough of tldraw's editor: one node shape whose meta updates merge key by key. */
function fakeEditor(meta: Record<string, unknown>) {
  const shape: FakeShape = { id: "shape:a", type: "geo", meta: { mpNodeId: "n1", mpTitle: "Mutex", ...meta } };
  return {
    shape,
    getCurrentPageShapeIds: () => [shape.id],
    getShape: (id: string) => (id === shape.id ? shape : undefined),
    updateShape: (partial: { meta?: Record<string, unknown> }) => {
      shape.meta = { ...shape.meta, ...partial.meta };
    },
  };
}

const locus: Locus = {
  id: "l1",
  routeId: "r1",
  nodeId: "n1",
  orderIndex: 0,
  label: "",
  interval: 3,
  easeFactor: 2.5,
  repetitions: 1,
  nextReviewAt: "2031-01-02T00:00:00.000Z",
  lastReviewedAt: null,
};

function mount(meta: Record<string, unknown> = {}) {
  const editor = fakeEditor(meta);
  act(() => {
    usePalaceStore.setState({ editorRef: editor as never, selectedShapeId: editor.shape.id, loci: [locus] });
  });
  render(<NedfSlotsEditor nodeId="n1" />);
  return editor;
}

beforeEach(() => {
  act(() => usePalaceStore.setState({ editorRef: null, selectedShapeId: null, loci: [] }));
});

describe("NedfSlotsEditor", () => {
  it("starts closed and unencoded, and saves slots to the node on blur", async () => {
    const user = userEvent.setup();
    const editor = mount();
    expect(screen.getByText("not encoded")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /NEDF/ }));

    await user.type(screen.getByLabelText("Name-hook"), "Mute-X");
    await user.tab();
    expect(editor.shape.meta.mpNedf).toEqual({ nameHook: "Mute-X" });
    expect(screen.getByTestId("nedf-encoded")).toHaveTextContent("NEDF-encoded · 1/4");
  });

  it("counts a pair only when both halves are written, and says which half is missing", async () => {
    const user = userEvent.setup();
    mount({ mpNedf: { essence: "One key" } });
    await user.type(screen.getByLabelText("Distinguisher question"), "One key or a bowl of keys?");
    expect(screen.getByText("Needs the reason too")).toBeInTheDocument();
    expect(screen.getByTestId("nedf-encoded")).toHaveTextContent("1/4");

    await user.type(screen.getByLabelText("Distinguisher reason"), "A mutex has one owner");
    expect(screen.getByTestId("nedf-encoded")).toHaveTextContent("2/4");
    expect(screen.getByText(/^Discrimination card · next review/)).toBeInTheDocument();
    expect(screen.getAllByText("Not encoded yet")).toHaveLength(2); // Name-hook and Failure
  });

  it("clears the slots when every field is emptied, even back to a value saved earlier", async () => {
    const user = userEvent.setup();
    const editor = mount({ mpNedf: { nameHook: "Mute-X" } });
    const hook = screen.getByLabelText("Name-hook");
    await user.clear(hook);
    await user.tab();
    expect(editor.shape.meta.mpNedf).toBeNull();

    await user.type(hook, "Mute-X");
    await user.tab();
    expect(editor.shape.meta.mpNedf).toEqual({ nameHook: "Mute-X" });
  });
});
