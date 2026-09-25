import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MemoryNode } from "../../domain/entities/types";
import { buildSlotRetention } from "../../domain/services/reviewMetrics";
import { createAnalyticsEvent } from "../../domain/services/analyticsService";
import { usePalaceStore } from "../../store/palaceStore";
import { NedfCoverage } from "./NedfCoverage";

vi.mock("../../app/navigationEvents", () => ({ requestNavigation: vi.fn() }));

const node = (id: string, title: string, nedf: MemoryNode["nedf"] = null): MemoryNode => ({
  id,
  objectId: `o-${id}`,
  title,
  content: "",
  kind: "memory",
  portal: null,
  nedf,
});

const nodes = [
  node("a", "Mutex", { nameHook: "Mute-X", failure: { scenario: "Hangs", correction: "Unlock in finally" } }),
  node("b", "Semaphore", { essence: "Counts permits" }),
  node("c", "Monitor", { distinguisher: { prompt: "Lock or condition?", reason: "Both" } }),
  node("d", "Plain"),
];

describe("NedfCoverage", () => {
  it("shows each slot's retention and lists encoded concepts without a Failure slot", () => {
    const events = ["good", "again"].map((rating) =>
      createAnalyticsEvent({ eventType: "walk_recall_rated", eventGroup: "review", payload: { rating, slot: "failure" } }),
    );
    render(<NedfCoverage retention={buildSlotRetention(events)} nodes={nodes} />);

    expect(screen.getByText("3 of 4 nodes NEDF-encoded")).toBeInTheDocument();
    expect(screen.getByTestId("nedf-retention-failure")).toHaveTextContent("50%1 of 2 recalled");
    expect(screen.getByTestId("nedf-retention-essence")).toHaveTextContent("–No reviews yet");
    const missing = within(screen.getByRole("list", { name: "Missing a Failure slot" }));
    expect(missing.getAllByRole("button").map((button) => button.textContent)).toEqual(["Semaphore", "Monitor"]);

    fireEvent.click(missing.getByRole("button", { name: "Monitor" }));
    expect(usePalaceStore.getState().focusNodeId).toBe("c");
  });

  it("says so when nothing is encoded yet", () => {
    render(<NedfCoverage retention={buildSlotRetention([])} nodes={[node("d", "Plain")]} />);
    expect(screen.getByText(/No NEDF-encoded nodes yet/)).toBeInTheDocument();
  });
});
