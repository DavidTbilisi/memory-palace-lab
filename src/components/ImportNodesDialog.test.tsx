import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ImportNodesDialog } from "./ImportNodesDialog";

describe("ImportNodesDialog DSL tab", () => {
  it("previews DSL nodes parsed from input", async () => {
    const user = userEvent.setup();
    render(<ImportNodesDialog open onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /^DSL$/ }));

    const textarea = screen.getByLabelText(/source/i);
    await user.click(textarea);
    await user.paste("@Demo\n\nAlpha\n: a body\n\nBeta\n: b body\n");

    expect(await screen.findByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("surfaces a DSL parse error", async () => {
    const user = userEvent.setup();
    render(<ImportNodesDialog open onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /^DSL$/ }));
    const textarea = screen.getByLabelText(/source/i);
    await user.click(textarea);
    await user.paste("no header\n");

    expect(await screen.findByText(/missing-palace-header/)).toBeInTheDocument();
  });
});
