import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CloseAARDialog } from "./CloseAARDialog";
import type { AARSignatureSnapshot } from "../domain/services/cast/aarRecords";

const SIG: AARSignatureSnapshot = {
  nodeCount: 4,
  edgeCount: 3,
  motifKindsPresent: ["hubSpoke"],
  motifCounts: { cascade: 0, diamond: 0, hubSpoke: 1, feedbackLoop: 0, bottleneck: 0, bipartite: 0 },
  features: [0.75, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
};

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  palaceId: "p1",
  palaceName: "OOP",
  signature: SIG,
  onSave: vi.fn(),
};

describe("CloseAARDialog", () => {
  it("renders the four ARC questions plus the takeaway when open", () => {
    render(<CloseAARDialog {...baseProps} onOpenChange={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText(/What did I intend\?/i)).toBeInTheDocument();
    expect(screen.getByText(/What happened\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Why the gap\?/i)).toBeInTheDocument();
    expect(screen.getByText(/What changes next time\?/i)).toBeInTheDocument();
    expect(screen.getByText("One-line takeaway")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(<CloseAARDialog {...baseProps} open={false} onOpenChange={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByText(/After-Action Review/i)).not.toBeInTheDocument();
  });

  it("disables Save until at least one field is filled", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<CloseAARDialog {...baseProps} onOpenChange={vi.fn()} onSave={onSave} />);

    const save = screen.getByRole("button", { name: /Save AAR/i });
    expect(save).toBeDisabled();

    await user.type(screen.getByLabelText(/AAR takeaway/i), "hub-spoke, not cascade");
    expect(save).toBeEnabled();
  });

  it("builds a record from the filled fields, then closes", async () => {
    const onSave = vi.fn();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<CloseAARDialog {...baseProps} onOpenChange={onOpenChange} onSave={onSave} />);

    await user.type(screen.getByLabelText(/AAR intent/i), "ship the feature");
    await user.type(screen.getByLabelText(/AAR takeaway/i), "CAP -> hub-spoke");
    await user.click(screen.getByRole("button", { name: /Save AAR/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const record = onSave.mock.calls[0]![0];
    expect(record.palaceId).toBe("p1");
    expect(record.palaceName).toBe("OOP");
    expect(record.intent).toBe("ship the feature");
    expect(record.takeaway).toBe("CAP -> hub-spoke");
    expect(record.signature).toEqual(SIG);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not save when there is no current palace", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<CloseAARDialog {...baseProps} palaceId={null} onOpenChange={vi.fn()} onSave={onSave} />);

    await user.type(screen.getByLabelText(/AAR intent/i), "something");
    expect(screen.getByRole("button", { name: /Save AAR/i })).toBeDisabled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("Cancel closes the dialog without saving", async () => {
    const onSave = vi.fn();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<CloseAARDialog {...baseProps} onOpenChange={onOpenChange} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSave).not.toHaveBeenCalled();
  });
});
