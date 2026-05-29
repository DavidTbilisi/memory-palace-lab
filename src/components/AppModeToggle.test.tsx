import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppModeToggle } from "./AppModeToggle";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";

vi.mock("../store/palaceStore");

const setAppMode = vi.fn();

function mockStore(overrides: Partial<Record<keyof PalaceStore, unknown>> = {}) {
  const state: Record<string, unknown> = { appMode: "encode", setAppMode, ...overrides };
  vi.mocked(usePalaceStore).mockImplementation((selector) => selector(state as unknown as PalaceStore));
}

describe("AppModeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("marks the active mode with aria-checked", () => {
    mockStore({ appMode: "comprehend" });
    render(<AppModeToggle />);
    expect(screen.getByRole("radio", { name: "Comprehend" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Encode" })).toHaveAttribute("aria-checked", "false");
  });

  it("switches to comprehend when clicked", async () => {
    const user = userEvent.setup();
    render(<AppModeToggle />);
    await user.click(screen.getByRole("radio", { name: "Comprehend" }));
    expect(setAppMode).toHaveBeenCalledWith("comprehend");
  });

  it("switches back to encode when clicked", async () => {
    mockStore({ appMode: "comprehend" });
    const user = userEvent.setup();
    render(<AppModeToggle />);
    await user.click(screen.getByRole("radio", { name: "Encode" }));
    expect(setAppMode).toHaveBeenCalledWith("encode");
  });
});
