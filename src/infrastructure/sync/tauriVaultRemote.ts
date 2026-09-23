import { invoke } from "@tauri-apps/api/core";
import type {
  VaultProbe,
  VaultRemote,
  VaultScanEntry,
} from "../../domain/repositories/vaultRemote";

/** Matches VaultEntryDto in src-tauri/src/vault.rs. */
type InvokeVaultEntry = {
  relPath: string;
  size: number;
  headerLine: string | null;
};

/**
 * The vault folder over the Rust commands. The folder is outside the JS filesystem scope,
 * so every operation crosses to Rust, which confines the path and writes atomically.
 */
export function createTauriVaultRemote(): VaultRemote {
  return {
    async init(dir) {
      return invoke<string>("vault_init", { dir });
    },
    async probe(dir) {
      return invoke<VaultProbe>("vault_probe", { dir });
    },
    async scan(dir): Promise<VaultScanEntry[]> {
      const entries = await invoke<InvokeVaultEntry[]>("vault_list", { dir });
      return entries.map((entry) => ({
        relPath: entry.relPath,
        size: entry.size,
        headerLine: entry.headerLine,
      }));
    },
    async read(dir, relPath) {
      return invoke<string | null>("vault_read", { dir, relPath });
    },
    async write(dir, relPath, contents) {
      await invoke("vault_write", { dir, relPath, contents });
    },
    async remove(dir, relPath) {
      await invoke("vault_delete", { dir, relPath });
    },
  };
}
