import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UpdateCheckResult } from "../infrastructure/appUpdater";
import { UpdateBanner } from "./UpdateBanner";

const checkForUpdate = vi.fn<() => Promise<UpdateCheckResult>>();
const openUrl = vi.fn<(url: string) => Promise<void>>();

vi.mock("../infrastructure/appUpdater", () => ({
  IS_TAURI_RUNTIME: true,
  checkForUpdate: () => checkForUpdate(),
  downloadAndInstallUpdate: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-opener", () => ({
  openUrl: (url: string) => openUrl(url),
}));

const NOTES = [
  "### Sync between devices",
  "",
  "- **Keep palaces in step across computers.** See the [guide](https://example.com/sync).",
].join("\n");

describe("UpdateBanner", () => {
  beforeEach(() => {
    checkForUpdate.mockReset();
    openUrl.mockReset().mockResolvedValue(undefined);
  });

  it("UpdateBanner keeps the notes collapsed until What's new is pressed", async () => {
    checkForUpdate.mockResolvedValue({ status: "available", version: "0.14.0", notes: NOTES });
    const user = userEvent.setup();
    render(<UpdateBanner />);

    const toggle = await screen.findByRole("button", { name: "What's new" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Sync between devices")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("heading", { name: "Sync between devices" })).toBeInTheDocument();
    expect(screen.getByText("Keep palaces in step across computers.").tagName).toBe("STRONG");

    await user.click(toggle);
    expect(screen.queryByText("Sync between devices")).not.toBeInTheDocument();
  });

  it("UpdateBanner opens a link in the notes outside the app window", async () => {
    checkForUpdate.mockResolvedValue({ status: "available", version: "0.14.0", notes: NOTES });
    const user = userEvent.setup();
    render(<UpdateBanner />);

    await user.click(await screen.findByRole("button", { name: "What's new" }));
    await user.click(screen.getByRole("link", { name: "guide" }));
    await vi.waitFor(() => expect(openUrl).toHaveBeenCalledWith("https://example.com/sync"));
  });

  it("UpdateBanner offers no What's new button when the release has no notes", async () => {
    checkForUpdate.mockResolvedValue({ status: "available", version: "0.14.0", notes: "  \n" });
    render(<UpdateBanner />);

    expect(await screen.findByRole("button", { name: /Install/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "What's new" })).not.toBeInTheDocument();
  });
});
