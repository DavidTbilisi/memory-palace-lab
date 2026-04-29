import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, render, screen } from "@testing-library/react";
import type { EditorView } from "@codemirror/view";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PalaceDslEditor } from "./PalaceDslEditor";
import { usePalaceStore } from "../store/palaceStore";
import type { DslApplyResult, DslSnapshot } from "../domain/services/palaceDsl/types";

const EMPTY_RESULT: DslApplyResult = {
  added: { nodes: 0, edges: 0, routes: 0, loci: 0 },
  updated: { nodes: 0, edges: 0, routes: 0, loci: 0 },
  deleted: { nodes: 0, edges: 0, routes: 0, loci: 0 },
  errors: [],
};

function fixture(name: string) {
  return readFileSync(
    resolve(__dirname, "../domain/services/palaceDsl/fixtures", name),
    "utf8",
  );
}

describe("PalaceDslEditor", () => {
  let originalApply: (intent: DslSnapshot) => DslApplyResult;

  beforeEach(() => {
    vi.useFakeTimers();
    originalApply = usePalaceStore.getState().applyDslSnapshot;
  });

  afterEach(() => {
    usePalaceStore.setState({ applyDslSnapshot: originalApply });
    vi.useRealTimers();
  });

  it("renders an editor host and a status footer", () => {
    render(<PalaceDslEditor initialValue={"# Palace: Demo\n"} />);
    expect(screen.getByTestId("palace-dsl-editor")).toBeInTheDocument();
    const status = screen.getByTestId("palace-dsl-status");
    expect(status).toHaveTextContent(/0 errors/);
    expect(status).toHaveTextContent(/0 warnings/);
  });

  it("calls applyDslSnapshot with the parsed snapshot after debounce on doc change", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    usePalaceStore.setState({ applyDslSnapshot: apply });

    let view: EditorView | null = null;
    render(
      <PalaceDslEditor
        initialValue=""
        onViewReady={(v) => {
          view = v;
        }}
      />,
    );
    expect(view).not.toBeNull();
    view!.dispatch({
      changes: { from: 0, to: 0, insert: "# Palace: Hello\n" },
    });

    vi.advanceTimersByTime(250);

    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply.mock.calls[0]![0].palaceName).toBe("Hello");
  });

  it("applies the full SOLID fixture and keeps the status footer clean", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    usePalaceStore.setState({ applyDslSnapshot: apply });

    let view: EditorView | null = null;
    render(
      <PalaceDslEditor
        initialValue=""
        onViewReady={(v) => {
          view = v;
        }}
      />,
    );
    expect(view).not.toBeNull();

    act(() => {
      view!.dispatch({
        changes: { from: 0, to: 0, insert: fixture("solid-citadel.dsl") },
      });
      vi.advanceTimersByTime(250);
    });

    expect(apply).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("palace-dsl-status")).toHaveTextContent(/0 errors/);
    expect(screen.getByTestId("palace-dsl-status")).toHaveTextContent(/0 warnings/);

    const snapshot = apply.mock.calls[0]![0];
    expect(snapshot.nodes).toHaveLength(14);
    expect(snapshot.routes).toHaveLength(2);
    expect(snapshot.routes[0]?.loci).toEqual([
      "Gate of SOLID",
      "Single Responsibility Forge",
      "Open Closed Library",
      "Liskov Arena",
      "Interface Harbor",
      "Dependency Tower",
      "SOLID Compression Room",
    ]);
  });

  it("surfaces the first parser diagnostic in the status footer", () => {
    let view: EditorView | null = null;
    render(
      <PalaceDslEditor
        initialValue=""
        onViewReady={(v) => {
          view = v;
        }}
      />,
    );
    expect(view).not.toBeNull();
    act(() => {
      view!.dispatch({
        changes: { from: 0, to: 0, insert: "# Palace: Demo\n== A\n> body\n" },
      });
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByTestId("palace-dsl-status")).toHaveTextContent(
      /line 3: content lines must be indented under a node or route block/i,
    );
  });

  it("does not call applyDslSnapshot for malformed SOLID-style paste with misplaced attributes", () => {
    const apply = vi.fn<(s: DslSnapshot) => DslApplyResult>(() => EMPTY_RESULT);
    usePalaceStore.setState({ applyDslSnapshot: apply });

    let view: EditorView | null = null;
    render(
      <PalaceDslEditor
        initialValue=""
        onViewReady={(v) => {
          view = v;
        }}
      />,
    );
    expect(view).not.toBeNull();

    act(() => {
      view!.dispatch({
        changes: {
          from: 0,
          to: 0,
          insert: "# Palace: SOLID Citadel\n== Gate of SOLID\n> Central fortress\n#solid\n-> Single Responsibility Forge  ::0001\n",
        },
      });
      vi.advanceTimersByTime(250);
    });

    expect(apply).not.toHaveBeenCalled();
    expect(screen.getByTestId("palace-dsl-status")).toHaveTextContent(
      /content lines must be indented under a node or route block/i,
    );
    expect(screen.getByTestId("palace-dsl-status")).toHaveTextContent(/1 errors|2 errors|3 errors/);
  });
});
