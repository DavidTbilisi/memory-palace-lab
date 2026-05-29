import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComprehendPanel } from "./ComprehendPanel";

describe("ComprehendPanel", () => {
  it("renders all nine dive questions across the three layers", () => {
    render(<ComprehendPanel onUnderstood={vi.fn()} onEncodeThis={vi.fn()} />);
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Premise")).toBeInTheDocument();
    expect(screen.getByText("Whose frame is this?")).toBeInTheDocument();
    expect(screen.getByText("How else could it be done?")).toBeInTheDocument();
  });

  it("fires onUnderstood when 'I understand this' is clicked", async () => {
    const onUnderstood = vi.fn();
    const user = userEvent.setup();
    render(<ComprehendPanel onUnderstood={onUnderstood} onEncodeThis={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /I understand this/i }));
    expect(onUnderstood).toHaveBeenCalledTimes(1);
  });

  it("fires onEncodeThis when 'Encode this' is clicked", async () => {
    const onEncodeThis = vi.fn();
    const user = userEvent.setup();
    render(<ComprehendPanel onUnderstood={vi.fn()} onEncodeThis={onEncodeThis} />);
    await user.click(screen.getByRole("button", { name: /Encode this/i }));
    expect(onEncodeThis).toHaveBeenCalledTimes(1);
  });
});
