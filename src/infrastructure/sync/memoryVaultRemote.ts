import {
  classifyVaultPath,
  VAULT_DESCRIPTOR_PATH,
  type VaultProbe,
  type VaultRemote,
  type VaultScanEntry,
} from "../../domain/repositories/vaultRemote";

/**
 * An in-memory vault folder. Two engines pointed at one of these is a genuine two-device
 * simulation with no Tauri and no filesystem, which is where the sync design actually gets
 * proven.
 *
 * It also injects the failures that matter, because the interesting bugs in a sync tool are
 * all in the unhappy paths: a folder-sync daemon caught mid-write, a read that fails, a
 * conflict copy appearing beside a real file.
 */
export type MemoryVaultRemote = VaultRemote & {
  /** Raw contents, for assertions about what actually reached the vault. */
  files: Map<string, string>;
  /** Write a file as if another device had put it there. */
  seed(relPath: string, contents: string): void;
  /** Serve this path truncated exactly once, as a half-finished sync would. */
  truncateNext(relPath: string): void;
  /** Fail the next read or write once. */
  failNext(op: "read" | "write", message: string): void;
  /** Backdate a file, so the grace period on reclaiming space can be exercised. */
  ageFile(relPath: string, modifiedMs: number): void;
  /** Count of writes, to assert that a settled vault is written to zero times. */
  writeCount: number;
};

export function createMemoryVaultRemote(seedFiles: Record<string, string> = {}): MemoryVaultRemote {
  const files = new Map<string, string>(Object.entries(seedFiles));
  const modified = new Map<string, number>();
  const truncateOnce = new Set<string>();
  let failReadOnce: string | null = null;
  let failWriteOnce: string | null = null;

  const remote: MemoryVaultRemote = {
    files,
    writeCount: 0,

    seed(relPath, contents) {
      files.set(relPath, contents);
    },
    truncateNext(relPath) {
      truncateOnce.add(relPath);
    },
    failNext(op, message) {
      if (op === "read") failReadOnce = message;
      else failWriteOnce = message;
    },
    ageFile(relPath, modifiedMs) {
      modified.set(relPath, modifiedMs);
    },

    async init(dir) {
      return dir;
    },

    async probe(): Promise<VaultProbe> {
      let ignoredFiles = 0;
      let undownloadedFiles = 0;
      for (const relPath of files.keys()) {
        if (relPath === VAULT_DESCRIPTOR_PATH) continue;
        if (relPath.endsWith(".icloud")) undownloadedFiles += 1;
        else if (!classifyVaultPath(relPath)) ignoredFiles += 1;
      }
      return {
        exists: true,
        writable: true,
        hasDescriptor: files.has(VAULT_DESCRIPTOR_PATH),
        ignoredFiles,
        undownloadedFiles,
      };
    },

    async scan(): Promise<VaultScanEntry[]> {
      const entries: VaultScanEntry[] = [];
      for (const [relPath, contents] of files) {
        if (!classifyVaultPath(relPath)) continue;
        const newline = contents.indexOf("\n");
        entries.push({
          relPath,
          size: contents.length,
          headerLine: newline < 0 ? null : contents.slice(0, newline),
          modifiedMs: modified.get(relPath) ?? null,
        });
      }
      return entries.sort((a, b) => a.relPath.localeCompare(b.relPath));
    },

    async read(_dir, relPath) {
      if (failReadOnce) {
        const message = failReadOnce;
        failReadOnce = null;
        throw new Error(message);
      }
      const contents = files.get(relPath);
      if (contents === undefined) return null;
      if (truncateOnce.has(relPath)) {
        truncateOnce.delete(relPath);
        return contents.slice(0, Math.floor(contents.length / 2));
      }
      return contents;
    },

    async write(_dir, relPath, contents) {
      if (failWriteOnce) {
        const message = failWriteOnce;
        failWriteOnce = null;
        throw new Error(message);
      }
      files.set(relPath, contents);
      remote.writeCount += 1;
    },

    async remove(_dir, relPath) {
      files.delete(relPath);
    },
  };

  return remote;
}
