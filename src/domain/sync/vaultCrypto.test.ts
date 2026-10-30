import { describe, expect, it } from "vitest";
import {
  createVaultDescriptor,
  openVaultFile,
  parseVaultDescriptor,
  sealVaultFile,
  unlockVault,
  VaultPassphraseError,
} from "./vaultCrypto";
import { parseVaultFile, VaultFormatError } from "./vaultFile";

const HEADER = {
  kind: "palace" as const,
  palaceId: "palace-1",
  rev: 7,
  updatedAt: "2026-09-23T00:00:00.000Z",
  contentHash: "abc123",
  writerDeviceId: "device-1",
};

async function freshVault(passphrase = "correct horse battery staple") {
  const { descriptor, key } = await createVaultDescriptor(passphrase);
  return { descriptor, key, passphrase };
}

describe("vaultCrypto", () => {
  it("round-trips a payload through seal and open", async () => {
    const { key } = await freshVault();
    const payload = { name: "Palace of Memory", loci: [1, 2, 3], nested: { deep: true } };

    const file = await sealVaultFile(key, HEADER, payload);
    const opened = await openVaultFile<typeof payload>(key, file);

    expect(opened.payload).toEqual(payload);
    expect(opened.header.palaceId).toBe("palace-1");
    expect(opened.header.rev).toBe(7);
  });

  it("leaves the header readable without the key", async () => {
    // A vault scan has to decide what to do from line 1 alone; that is what keeps a scan of
    // thirty 1 MB palaces cheap.
    const { key } = await freshVault();
    const file = await sealVaultFile(key, HEADER, { secret: "not in the header" });

    const parsed = parseVaultFile(file);
    expect(parsed?.header.rev).toBe(7);
    expect(file).not.toContain("not in the header");
  });

  it("refuses to decrypt when the cleartext header was altered", async () => {
    // The header line is the AES-GCM additional data. Without that binding, `rev` and
    // `contentHash` are forgeable on disk, and forging them makes the app skip a pull or
    // choose the wrong side of a conflict.
    const { key } = await freshVault();
    const file = await sealVaultFile(key, HEADER, { real: "payload" });

    const tampered = file.replace('"rev":7', '"rev":9999');
    expect(tampered).not.toBe(file);

    await expect(openVaultFile(key, tampered)).rejects.toBeInstanceOf(VaultFormatError);
  });

  it("rejects the wrong passphrase at unlock, before touching any palace", async () => {
    const { descriptor } = await freshVault("right passphrase");
    expect(await unlockVault("wrong passphrase", descriptor)).toBeNull();
    expect(await unlockVault("right passphrase", descriptor)).not.toBeNull();
  });

  it("cannot open a file sealed under a different passphrase", async () => {
    const a = await freshVault("passphrase A");
    const b = await freshVault("passphrase B");
    const file = await sealVaultFile(a.key, HEADER, { hello: "world" });

    await expect(openVaultFile(b.key, file)).rejects.toBeInstanceOf(VaultFormatError);
  });

  it("uses a fresh nonce for every seal", async () => {
    const { key } = await freshVault();
    const first = await sealVaultFile(key, HEADER, { same: "payload" });
    const second = await sealVaultFile(key, HEADER, { same: "payload" });
    expect(first).not.toBe(second);
  });

  it("derives a key that cannot be extracted", async () => {
    const { key } = await freshVault();
    expect(key.extractable).toBe(false);
    await expect(crypto.subtle.exportKey("raw", key)).rejects.toBeDefined();
  });

  it("treats a truncated file as unreadable rather than empty", async () => {
    // A sync client caught mid-write must never look like a deletion.
    const { key } = await freshVault();
    const file = await sealVaultFile(key, HEADER, { big: "x".repeat(500) });
    const truncated = file.slice(0, Math.floor(file.length / 2));

    await expect(openVaultFile(key, truncated)).rejects.toBeInstanceOf(VaultFormatError);
  });

  it("rejects junk that is not a vault file at all", async () => {
    const { key } = await freshVault();
    await expect(openVaultFile(key, "")).rejects.toBeInstanceOf(VaultFormatError);
    await expect(openVaultFile(key, "not json\nbody")).rejects.toBeInstanceOf(VaultFormatError);
  });

  it("round-trips the vault descriptor through JSON", async () => {
    const { descriptor, passphrase } = await freshVault();
    const parsed = parseVaultDescriptor(JSON.stringify(descriptor));
    expect(parsed).not.toBeNull();
    expect(await unlockVault(passphrase, parsed!)).not.toBeNull();
  });

  it("rejects a descriptor that is not a vault", () => {
    expect(parseVaultDescriptor("{}")).toBeNull();
    expect(parseVaultDescriptor("nonsense")).toBeNull();
    expect(parseVaultDescriptor(JSON.stringify({ magic: "other", format: 1 }))).toBeNull();
  });

  it("keeps the passphrase out of everything it writes", async () => {
    const passphrase = "a-very-distinctive-passphrase";
    const { descriptor, key } = await createVaultDescriptor(passphrase);
    const file = await sealVaultFile(key, HEADER, { anything: true });

    expect(JSON.stringify(descriptor)).not.toContain(passphrase);
    expect(file).not.toContain(passphrase);
  });
});

// Referenced so the error type stays exported for callers that distinguish it.
void VaultPassphraseError;
