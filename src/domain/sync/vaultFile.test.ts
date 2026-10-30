import { describe, expect, it } from "vitest";
import {
  buildHeaderLine,
  buildVaultFile,
  parseHeaderLine,
  parseVaultFile,
  type VaultHeader,
} from "./vaultFile";

const HEADER: VaultHeader = {
  kind: "palace",
  palaceId: "palace-1",
  rev: 4,
  updatedAt: "2026-09-23T00:00:00.000Z",
  contentHash: "deadbeef",
  writerDeviceId: "device-1",
  enc: "gzip+aes-gcm-256",
  kdf: "pbkdf2-sha256",
};

describe("vaultFile", () => {
  it("round-trips a header and body", () => {
    const parsed = parseVaultFile(buildVaultFile(HEADER, "Ym9keQ=="));
    expect(parsed?.header).toEqual(HEADER);
    expect(parsed?.bodyBase64).toBe("Ym9keQ==");
  });

  it("keeps the header on a single line so a scan can read just the first one", () => {
    const file = buildVaultFile(HEADER, "Ym9keQ==");
    expect(file.split("\n")[0]).toBe(buildHeaderLine(HEADER));
  });

  it("hands back the header line verbatim, because it doubles as the AAD", () => {
    const file = buildVaultFile(HEADER, "Ym9keQ==");
    const parsed = parseVaultFile(file);
    expect(parsed?.headerLine).toBe(file.slice(0, file.indexOf("\n")));
  });

  it("escapes a newline inside a header value instead of splitting the container", () => {
    // JSON.stringify escapes control characters, so a stray newline in a field cannot break
    // the two-line format or the AAD round trip. Proven rather than assumed, because the
    // whole container rests on line 1 being exactly one line.
    const header = { ...HEADER, contentHash: "bad\nhash" };
    const file = buildVaultFile(header, "Ym9keQ==");

    expect(file.split("\n")).toHaveLength(3); // header, body, trailing empty
    expect(parseVaultFile(file)?.header.contentHash).toBe("bad\nhash");
  });

  it.each([
    ["empty text", ""],
    ["no newline", '{"magic":"mpvault","format":1,"header":{}}'],
    ["not json", "nonsense\nYm9keQ=="],
    ["wrong magic", '{"magic":"other","format":1,"header":{}}\nYm9keQ=='],
    ["missing body", `${buildHeaderLine(HEADER)}\n`],
  ])("returns null for %s rather than throwing", (_label, text) => {
    // Everything unreadable has to be skippable, never mistaken for an empty or deleted palace.
    expect(parseVaultFile(text)).toBeNull();
  });

  it("rejects a future format version", () => {
    const line = JSON.stringify({ magic: "mpvault", format: 99, header: HEADER });
    expect(parseHeaderLine(line)).toBeNull();
  });

  it("rejects a header missing a required field", () => {
    const withoutRev: Record<string, unknown> = { ...HEADER };
    delete withoutRev.rev;
    const line = JSON.stringify({ magic: "mpvault", format: 1, header: withoutRev });
    expect(parseHeaderLine(line)).toBeNull();
  });

  it("rejects a header whose field has the wrong type", () => {
    const line = JSON.stringify({
      magic: "mpvault",
      format: 1,
      header: { ...HEADER, rev: "four" },
    });
    expect(parseHeaderLine(line)).toBeNull();
  });

  it("allows a header with no palace id, for stream shards", () => {
    const shard: Record<string, unknown> = { ...HEADER };
    delete shard.palaceId;
    const header = parseHeaderLine(
      JSON.stringify({ magic: "mpvault", format: 1, header: { ...shard, kind: "analytics" } }),
    );
    expect(header?.kind).toBe("analytics");
    expect(header?.palaceId).toBeUndefined();
  });
});
