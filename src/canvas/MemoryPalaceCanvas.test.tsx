import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryPalaceCanvas } from "./MemoryPalaceCanvas";

const { usePalaceStoreMock } = vi.hoisted(() => ({
  usePalaceStoreMock: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      setEditor: vi.fn(),
      setSelectedShapeId: vi.fn(),
      queueDraftSave: vi.fn(),
      walkOpen: false,
      walkRecallMode: false,
      walkAnswerRevealed: true,
      walkIndex: 0,
      walkRouteId: null,
      loci: [],
      toolMode: "select",
      connect: { fromShapeId: null },
    }),
  ),
}));

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: usePalaceStoreMock,
}));

vi.mock("tldraw", () => ({
  Tldraw: ({
    snapshot,
  }: {
    snapshot?: {
      document?: { store?: Record<string, unknown> };
      store?: Record<string, unknown>;
    };
  }) => {
    const data = snapshot ? JSON.stringify(snapshot) : "";
    return <div data-testid="tldraw" data-snapshot={data} />;
  },
}));

describe("MemoryPalaceCanvas", () => {
  it("keeps the initial snapshot while the same palace stays mounted", () => {
    const first = JSON.stringify({ document: { store: { "shape:1": { id: "shape:1" } } } });
    const second = JSON.stringify({ document: { store: { "shape:2": { id: "shape:2" } } } });

    const { rerender } = render(<MemoryPalaceCanvas palaceId="palace-1" editorSnapshot={first} />);
    const canvas = screen.getByTestId("tldraw");

    expect(canvas.getAttribute("data-snapshot")).toBe(first);

    rerender(<MemoryPalaceCanvas palaceId="palace-1" editorSnapshot={second} />);

    expect(screen.getByTestId("tldraw").getAttribute("data-snapshot")).toBe(first);
  });
});
