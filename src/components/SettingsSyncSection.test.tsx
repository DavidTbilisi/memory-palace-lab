import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryVaultRemote, type MemoryVaultRemote } from "../infrastructure/sync/memoryVaultRemote";
import { VAULT_DESCRIPTOR_PATH } from "../domain/repositories/vaultRemote";

vi.mock("../infrastructure/appUpdater", () => ({ IS_TAURI_RUNTIME: true }));
// Connecting ends in a sync, which reaches for SQLite and the palace store; neither is what
// these tests are about.
vi.mock("../infrastructure/sync/syncStateStore", () => ({
  createTauriSyncStateStore: () => ({
    load: async () => ({ states: [], tombstones: [], foreignAnalyticsIds: [], foreignAarIds: [] }),
    apply: async () => {},
  }),
}));
vi.mock("../infrastructure/sync/tauriAssetStore", () => ({
  createTauriAssetStore: () => ({ read: async () => null, locate: async () => null, write: async () => ({ path: "", url: "" }) }),
}));

const { useSyncStore, setVaultRemoteFactory } = await import("../store/syncStore");
const { SettingsSyncSection } = await import("./SettingsSyncSection");

let remote: MemoryVaultRemote;

describe("SettingsSyncSection", () => {
  beforeEach(() => {
    window.localStorage.clear();
    remote = createMemoryVaultRemote();
    setVaultRemoteFactory(() => remote);
    useSyncStore.setState({ status: "disconnected", dir: null, unlocked: false, error: null, lastSyncedAt: null });
  });

  it("offers to create a vault in an empty folder, and asks for the passphrase twice", async () => {
    render(<SettingsSyncSection />);
    await userEvent.type(screen.getByLabelText("Sync folder"), "/vault");

    expect(await screen.findByText(/No vault here yet/)).toBeInTheDocument();
    const create = screen.getByRole("button", { name: "Create vault and sync" });

    await userEvent.type(screen.getByLabelText("New passphrase"), "correct horse");
    await userEvent.type(screen.getByLabelText("Type it again"), "correct hose");
    expect(screen.getByText("Does not match.")).toBeInTheDocument();
    expect(create).toBeDisabled();

    await userEvent.clear(screen.getByLabelText("Type it again"));
    await userEvent.type(screen.getByLabelText("Type it again"), "correct horse");
    expect(create).toBeEnabled();
  });

  it("says a folder already holds a vault and offers to join it, not create one", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    useSyncStore.getState().disconnect();
    const descriptor = remote.files.get(VAULT_DESCRIPTOR_PATH);

    render(<SettingsSyncSection />);
    await userEvent.type(screen.getByLabelText("Sync folder"), "/vault");

    expect(await screen.findByText(/already holds a vault/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Type it again")).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Vault passphrase"), "shared passphrase");
    await userEvent.click(screen.getByRole("button", { name: "Join vault and sync" }));

    await waitFor(() => expect(useSyncStore.getState().unlocked).toBe(true));
    expect(remote.files.get(VAULT_DESCRIPTOR_PATH)).toBe(descriptor);
  });

  it("asks a locked device to unlock, and syncs straight after", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    setVaultRemoteFactory(() => remote); // a fresh launch: no key in memory
    useSyncStore.setState({ status: "locked", unlocked: false, lastSyncedAt: null });
    const syncNow = vi.spyOn(useSyncStore.getState(), "syncNow");

    render(<SettingsSyncSection />);
    await userEvent.type(screen.getByLabelText("Passphrase"), "shared passphrase");
    await userEvent.click(screen.getByRole("button", { name: "Unlock and sync" }));

    await waitFor(() => expect(useSyncStore.getState().unlocked).toBe(true));
    expect(syncNow).toHaveBeenCalled();
  });
});
