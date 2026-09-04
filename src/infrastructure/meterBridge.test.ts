import { describe, expect, it, vi } from "vitest";
import type { AnalyticsEvent } from "../domain/entities/types";
import { createAnalyticsEvent } from "../domain/services/analyticsService";
import type { MeterBridgePreference } from "../domain/services/meterPreferences";
import { createMeterBridge } from "./meterBridge";

function recall(rating: string, palaceId = "p1"): AnalyticsEvent {
  return createAnalyticsEvent({
    eventType: "walk_recall_rated",
    eventGroup: "review",
    sessionId: "s1",
    palaceId,
    createdAt: "2026-09-01T10:00:00.000Z",
    payload: { rating, timeToRevealMs: 800 },
  });
}

function harness(over: {
  available?: boolean;
  preference?: MeterBridgePreference;
  setting?: string | null;
  via?: "env" | "project" | "home";
  appendError?: string;
} = {}) {
  const appendLines = vi.fn(async () => {
    if (over.appendError) throw new Error(over.appendError);
  });
  const defaultDataDir = vi.fn(async () => ({ dir: "/default/meter-data", via: over.via ?? "home" }));
  const warn = vi.fn();
  const bridge = createMeterBridge({
    available: over.available ?? true,
    defaultDataDir,
    appendLines,
    preference: () => over.preference ?? "auto",
    dataDirSetting: () => over.setting ?? null,
    warn,
  });
  return { bridge, appendLines, defaultDataDir, warn };
}

const nameOf = (id: string | null | undefined) => (id === "p1" ? "SOLID Citadel" : null);

describe("live METER bridge", () => {
  it("does nothing outside the desktop runtime or when switched off", async () => {
    const web = harness({ available: false, preference: "on", setting: "/x" });
    expect(await web.bridge.mirror([recall("good")], nameOf)).toEqual({ emitted: 0 });
    const off = harness({ preference: "off", setting: "/x", via: "env" });
    expect(await off.bridge.mirror([recall("good")], nameOf)).toEqual({ emitted: 0 });
    expect(off.appendLines).not.toHaveBeenCalled();
    expect((await off.bridge.status()).enabled).toBe(false);
  });

  it("in auto mode follows METER_DATA_DIR only, never the home fallback", async () => {
    const home = harness({ preference: "auto", via: "home" });
    expect(await home.bridge.mirror([recall("good")], nameOf)).toEqual({ emitted: 0 });
    expect(home.appendLines).not.toHaveBeenCalled();

    const env = harness({ preference: "auto", via: "env" });
    expect(await env.bridge.mirror([recall("good")], nameOf)).toEqual({ emitted: 2 });
    expect(env.appendLines).toHaveBeenCalledWith("/default/meter-data", expect.any(Array));
    expect((await env.bridge.status()).target).toEqual({ dir: "/default/meter-data", via: "env" });
  });

  it("prefers the Settings directory, writes one JSON line per METER event, and counts", async () => {
    const h = harness({ preference: "on", setting: "/wiki/meter-data", via: "env" });
    const result = await h.bridge.mirror([recall("again"), recall("good", "other")], nameOf);
    expect(result).toEqual({ emitted: 4 });
    expect(h.defaultDataDir).not.toHaveBeenCalled();
    const [dir, lines] = h.appendLines.mock.calls[0]! as unknown as [string, string[]];
    expect(dir).toBe("/wiki/meter-data");
    const parsed = lines.map((l: string) => JSON.parse(l));
    expect(parsed.map((e) => e.metric_type)).toEqual(["miss", "latency_ms", "hit", "latency_ms"]);
    expect(parsed[0].context.topic).toBe("SOLID Citadel");
    expect(parsed[2].context).not.toHaveProperty("topic");
    const status = await h.bridge.status();
    expect(status).toMatchObject({ enabled: true, emitted: 4, lastError: null, target: { via: "setting" } });
  });

  it("skips batches with nothing to mirror without touching the file", async () => {
    const h = harness({ preference: "on", setting: "/m" });
    const opened = createAnalyticsEvent({ eventType: "palace_opened", eventGroup: "palace" });
    expect(await h.bridge.mirror([opened], nameOf)).toEqual({ emitted: 0 });
    expect(h.appendLines).not.toHaveBeenCalled();
  });

  it("surfaces an append failure once, then only warns, until settings change", async () => {
    const h = harness({ preference: "on", setting: "/ro", appendError: "EACCES" });
    const first = await h.bridge.mirror([recall("good")], nameOf);
    expect(first.emitted).toBe(0);
    expect(first.surfaceError).toContain("EACCES");
    expect(first.surfaceError).toContain("palace meter backfill");
    const second = await h.bridge.mirror([recall("good")], nameOf);
    expect(second.surfaceError).toBeUndefined();
    expect(h.warn).toHaveBeenCalledTimes(1);
    expect((await h.bridge.status()).lastError).toBe("EACCES");

    h.bridge.settingsChanged();
    const third = await h.bridge.mirror([recall("good")], nameOf);
    expect(third.surfaceError).toContain("EACCES");
  });

  it("resolves the default directory once per settings generation", async () => {
    const h = harness({ preference: "on", via: "project" });
    await h.bridge.mirror([recall("good")], nameOf);
    await h.bridge.mirror([recall("good")], nameOf);
    expect(h.defaultDataDir).toHaveBeenCalledTimes(1);
    h.bridge.settingsChanged();
    await h.bridge.mirror([recall("good")], nameOf);
    expect(h.defaultDataDir).toHaveBeenCalledTimes(2);
  });
});
