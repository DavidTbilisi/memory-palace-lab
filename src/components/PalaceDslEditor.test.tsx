import { render, screen } from "@testing-library/react";
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
});
