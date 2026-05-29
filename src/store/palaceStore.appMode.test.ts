/**
 * appMode transition tests for palaceStore. Operates directly on the Zustand
 * store via setState/getState to assert synchronous state changes in isolation.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { usePalaceStore } from "./palaceStore";

describe("palaceStore appMode", () => {
  beforeEach(() => {
    usePalaceStore.setState({
      appMode: "encode",
      toolMode: "select",
      comprehendCruxNodeId: null,
      focusNodeId: null,
      connect: { fromShapeId: null },
    });
  });

  it("defaults to encode", () => {
    expect(usePalaceStore.getState().appMode).toBe("encode");
  });

  it("entering comprehend resets the tool mode and clears any armed connection", () => {
    usePalaceStore.setState({ toolMode: "connect", connect: { fromShapeId: "shape-1" } });
    usePalaceStore.getState().setAppMode("comprehend");

    const s = usePalaceStore.getState();
    expect(s.appMode).toBe("comprehend");
    expect(s.toolMode).toBe("select");
    expect(s.connect.fromShapeId).toBeNull();
  });

  it("leaving comprehend clears the crux selection", () => {
    usePalaceStore.getState().setAppMode("comprehend");
    usePalaceStore.getState().setComprehendCruxNodeId("node-7");
    expect(usePalaceStore.getState().comprehendCruxNodeId).toBe("node-7");

    usePalaceStore.getState().setAppMode("encode");
    expect(usePalaceStore.getState().comprehendCruxNodeId).toBeNull();
  });

  it("encodeNode returns to encode and queues the node for canvas focus", () => {
    usePalaceStore.setState({ appMode: "comprehend", comprehendCruxNodeId: "node-3" });
    usePalaceStore.getState().encodeNode("node-3");

    const s = usePalaceStore.getState();
    expect(s.appMode).toBe("encode");
    expect(s.comprehendCruxNodeId).toBeNull();
    expect(s.focusNodeId).toBe("node-3");
  });
});
