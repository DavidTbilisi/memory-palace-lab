import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ViewAARDialog } from "./ViewAARDialog";
import { buildAARRecord, type AARSignatureSnapshot } from "../domain/services/cast/aarRecords";

const SIG: AARSignatureSnapshot = {
  nodeCount: 32,
  edgeCount: 42,
  motifKindsPresent: ["cascade", "hubSpoke"],
  motifCounts: { cascade: 3, diamond: 2, hubSpoke: 1, feedbackLoop: 1, bottleneck: 6, bipartite: 1 },
  features: [],
};

const record = buildAARRecord({
  palaceId: "ds",
  palaceName: "DistributedSystems",
  signature: SIG,
  fields: {
    intent: "Solve CAP tradeoffs",
    outcome: "Hub-spoke worked",
    gap: "Initial guess was cascade",
    adjustment: "Surface bottlenecks first",
    takeaway: "CAP → hub-spoke, not cascade",
  },
});

describe("ViewAARDialog", () => {
  it("renders all four ARC questions plus the takeaway", () => {
    render(<ViewAARDialog record={record} open onOpenChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/CAP → hub-spoke/i)).toBeInTheDocument();
    expect(screen.getByText(/Solve CAP tradeoffs/i)).toBeInTheDocument();
    expect(screen.getByText(/Hub-spoke worked/i)).toBeInTheDocument();
    expect(screen.getByText(/Initial guess was cascade/i)).toBeInTheDocument();
    expect(screen.getByText(/Surface bottlenecks first/i)).toBeInTheDocument();
  });

  it("requires confirm before deleting", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<ViewAARDialog record={record} open onOpenChange={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /Delete AAR/i }));
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Yes, delete/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(record.id);
  });

  it("Cancel-the-confirm flow does not fire delete", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<ViewAARDialog record={record} open onOpenChange={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /Delete AAR/i }));
    await user.click(screen.getByRole("button", { name: /^No$/i }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("returns null when no record is supplied", () => {
    const { container } = render(
      <ViewAARDialog record={null} open onOpenChange={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
