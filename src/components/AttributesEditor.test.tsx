import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { usePalaceStore } from "../store/palaceStore";
import { AttributesEditor } from "./AttributesEditor";

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

function mount(meta: Record<string, unknown> = {}) {
  const editor = fakeEditor(meta);
  act(() => {
    usePalaceStore.setState({
      editorRef: editor as never,
      selectedShapeId: editor.shape.id,
      currentPalace: { id: "p1" } as never,
    });
  });
  render(<AttributesEditor nodeId="n1" />);
  return editor;
}

beforeEach(() => {
  act(() => usePalaceStore.setState({ editorRef: null, selectedShapeId: null, currentPalace: null }));
});

describe("AttributesEditor", () => {
  it("adds an attribute on the first free channel and saves it on blur", async () => {
    const user = userEvent.setup();
    const editor = mount();
    expect(screen.getByText("none")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add attribute" }));

    expect(screen.getByLabelText("Attribute 1 channel")).toHaveValue("spatial");
    await user.type(screen.getByLabelText("Attribute 1 name"), "where");
    await user.type(screen.getByLabelText("Attribute 1 values"), "north tower");
    await user.tab();
    expect(editor.shape.meta.mpAttributes).toEqual([{ name: "where", channel: "spatial", values: ["north tower"] }]);
    expect(screen.getByText("1 channel")).toBeInTheDocument();
  });

  it("flags two attributes on one channel, and clears the warning once one moves", async () => {
    const user = userEvent.setup();
    const editor = mount({
      mpAttributes: [
        { name: "where", channel: "spatial", values: ["north tower"] },
        { name: "room", channel: "spatial", values: ["kitchen"] },
      ],
    });
    expect(screen.getByTestId("attribute-warning")).toHaveTextContent('"where" and "room" are both on Spatial');
    expect(screen.getByTestId("attribute-warning-count")).toHaveTextContent("1 to check");

    await user.selectOptions(screen.getByLabelText("Attribute 2 channel"), "state");
    expect(screen.queryByTestId("attribute-warning")).toBeNull();
    expect(editor.shape.meta.mpAttributes).toEqual([
      { name: "where", channel: "spatial", values: ["north tower"] },
      { name: "room", channel: "state", values: ["kitchen"] },
    ]);
  });

  it("asks for a route once there are several values, and a count only for enumerate", async () => {
    const user = userEvent.setup();
    const editor = mount({ mpAttributes: [{ name: "days", channel: "temporal", values: ["Mon"] }] });
    expect(screen.queryByLabelText("Attribute 1 route")).toBeNull();

    const values = screen.getByLabelText("Attribute 1 values");
    await user.type(values, " | Wed | Fri");
    await user.tab();
    expect(screen.getByText(/has 3 values\. Choose dissolve, address, or enumerate/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Attribute 1 route"), "address");
    expect(screen.queryByLabelText("Attribute 1 count")).toBeNull();
    expect(screen.queryByTestId("attribute-warning")).toBeNull();

    await user.selectOptions(screen.getByLabelText("Attribute 1 route"), "enumerate");
    expect(screen.getByText(/enumerated but has no count/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Attribute 1 count"), "4");
    expect(screen.getByText(/should have 4 members but lists 3/)).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Attribute 1 count"));
    await user.type(screen.getByLabelText("Attribute 1 count"), "3");
    await user.tab();
    expect(screen.queryByTestId("attribute-warning")).toBeNull();
    expect(editor.shape.meta.mpAttributes).toEqual([
      { name: "days", channel: "temporal", values: ["Mon", "Wed", "Fri"], route: "enumerate", count: 3 },
    ]);
  });

  it("offers the split only for a dissolved attribute with several values", async () => {
    const user = userEvent.setup();
    mount({ mpAttributes: [{ name: "uses", channel: "relation", values: ["locks", "queues"], route: "address" }] });
    const row = screen.getByRole("group", { name: "Attribute 1" });
    expect(within(row).queryByRole("button", { name: /Split into/ })).toBeNull();
    await user.selectOptions(screen.getByLabelText("Attribute 1 route"), "dissolve");
    expect(within(row).getByRole("button", { name: "Split into 2 separate nodes" })).toBeInTheDocument();
  });

  it("clears the attributes when the last one is removed", async () => {
    const user = userEvent.setup();
    const editor = mount({ mpAttributes: [{ name: "where", channel: "spatial", values: ["north tower"] }] });
    await user.click(screen.getByRole("button", { name: "Remove attribute 1" }));
    expect(editor.shape.meta.mpAttributes).toBeNull();
  });
});
