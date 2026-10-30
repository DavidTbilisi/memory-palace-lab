import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePalaceStore } from "../store/palaceStore";
import { ConceptGlyphField } from "./ConceptGlyphField";

// The selector is read on each render; the tests re-render by interacting.
vi.mock("@tldraw/editor", () => ({
  useValue: (_name: string, fn: () => unknown) => fn(),
}));

type FakeShape = { id: string; type: "geo"; meta: Record<string, unknown> };

function fakeEditor() {
  const shapes: FakeShape[] = [
    { id: "shape:a", type: "geo", meta: { mpNodeId: "a", mpTitle: "Attention", mpGlyph: "👁️" } },
    { id: "shape:b", type: "geo", meta: { mpNodeId: "b", mpTitle: "Focus" } },
  ];
  return {
    shapes,
    getCurrentPageShapes: () => shapes,
    getShape: (id: string) => shapes.find((s) => s.id === id),
    updateShape: (partial: { id: string; meta?: Record<string, unknown> }) => {
      const shape = shapes.find((s) => s.id === partial.id)!;
      shape.meta = { ...shape.meta, ...partial.meta };
    },
  };
}

function mount(selected: "shape:a" | "shape:b") {
  const editor = fakeEditor();
  act(() => usePalaceStore.setState({ editorRef: editor as never, selectedShapeId: selected }));
  const view = render(<ConceptGlyphField nodeId={selected === "shape:a" ? "a" : "b"} />);
  return { editor, view };
}

beforeEach(() => {
  act(() => usePalaceStore.setState({ editorRef: null, selectedShapeId: null }));
});

describe("ConceptGlyphField", () => {
  it("sets a glyph on a node that has none", async () => {
    const user = userEvent.setup();
    const { editor } = mount("shape:b");
    await user.type(screen.getByLabelText("Concept glyph"), "🔦");
    await user.click(screen.getByRole("button", { name: "Set" }));
    expect(editor.shapes[1]!.meta.mpGlyph).toBe("🔦");
  });

  it("refuses a glyph another node holds, and names that node", async () => {
    const user = userEvent.setup();
    const { editor } = mount("shape:b");
    await user.type(screen.getByLabelText("Concept glyph"), "👁");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("alert")).toHaveTextContent("👁 is already Attention's concept glyph.");
    expect(editor.shapes[1]!.meta.mpGlyph).toBeUndefined();
  });

  it("refuses more than one symbol", async () => {
    const user = userEvent.setup();
    mount("shape:b");
    await user.type(screen.getByLabelText("Concept glyph"), "ab");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("alert")).toHaveTextContent("single symbol");
  });

  it("shows a set glyph, and changing it is a deliberate step with a warning", async () => {
    const user = userEvent.setup();
    const { editor, view } = mount("shape:a");
    expect(screen.getByTestId("concept-glyph")).toHaveTextContent("👁️");
    expect(screen.queryByLabelText("Concept glyph")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Change glyph" }));
    expect(screen.getByText(/A new mark reads as a new concept/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Concept glyph"), "🔦");
    await user.click(screen.getByRole("button", { name: "Change" }));
    view.rerender(<ConceptGlyphField nodeId="a" />);
    expect(editor.shapes[0]!.meta.mpGlyph).toBe("🔦");
    expect(screen.getByTestId("concept-glyph")).toHaveTextContent("🔦");
  });

  it("removes a glyph on request", async () => {
    const user = userEvent.setup();
    const { editor } = mount("shape:a");
    await user.click(screen.getByRole("button", { name: "Change glyph" }));
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(editor.shapes[0]!.meta.mpGlyph).toBeNull();
  });
});
