/**
 * Review-page controls on the store: setting when stops come up next (in the
 * open palace or any other) and switching review decks off.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Locus } from "../domain/entities/types";
import { loadPalaceDraft, savePalaceDraft } from "../infrastructure/draft/palaceDraftStore";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { usePalaceStore } from "./palaceStore";
import { loadPausedDecks } from "./palaceStoreHelpers";

const store = () => usePalaceStore.getState();
const WHEN = "2030-01-02T03:04:00.000Z";
const OLD = "2020-01-01T00:00:00.000Z";

/** Creates a palace with two stops, both due long ago; leaves it open. */
async function seedPalace(name: string, atlasPath = "Deck") {
  await store().createPalace(name, atlasPath);
  const id = store().currentPalace!.id;
  const repo = getPalaceRepository();
  const snap = (await repo.loadPalace(id))!;
  const routeId = `r-${id}`;
  const loci = ["a", "b"].map(
    (key, orderIndex): Locus => ({
      id: `${id}-${key}`,
      routeId,
      nodeId: `n-${key}`,
      orderIndex,
      label: "",
      nextReviewAt: OLD,
    }),
  );
  await repo.savePalace({ ...snap, routes: [{ id: routeId, palaceId: id, name: "R" }], loci });
  usePalaceStore.setState({ loci });
  return id;
}

async function diskLoci(palaceId: string) {
  return (await getPalaceRepository().loadPalace(palaceId))!.loci;
}

describe("palaceStore review decks", () => {
  beforeEach(() => {
    usePalaceStore.setState({ currentPalace: null, editorRef: null, pausedDecks: [], atlasGroups: [] });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("sets the listed stops of a closed palace on disk and in its draft", async () => {
    const closed = await seedPalace("Closed");
    const snap = (await getPalaceRepository().loadPalace(closed))!;
    savePalaceDraft(snap);
    await seedPalace("Open");

    await store().rescheduleStops([{ palaceId: closed, locusIds: [`${closed}-a`] }], WHEN);

    const loci = await diskLoci(closed);
    expect(loci.map((locus) => locus.nextReviewAt)).toEqual([WHEN, OLD]);
    expect(loadPalaceDraft(closed)?.snapshot.loci.map((locus) => locus.nextReviewAt)).toEqual([WHEN, OLD]);
  });

  it("sets every stop of a palace given without stops", async () => {
    const closed = await seedPalace("Whole");
    await seedPalace("Other");
    await store().rescheduleStops([{ palaceId: closed }], WHEN);
    expect((await diskLoci(closed)).map((locus) => locus.nextReviewAt)).toEqual([WHEN, WHEN]);
  });

  it("updates the open palace in memory and, with no canvas, on disk", async () => {
    const open = await seedPalace("Open now");
    await store().rescheduleStops([{ palaceId: open, locusIds: [`${open}-b`] }], WHEN);
    expect(store().loci.map((locus) => locus.nextReviewAt)).toEqual([OLD, WHEN]);
    expect((await diskLoci(open)).map((locus) => locus.nextReviewAt)).toEqual([OLD, WHEN]);
  });

  it("switches a deck off and on, and saves the choice", () => {
    store().setDeckPaused(" Bible / OT ", true);
    store().setDeckPaused("", true);
    expect(store().pausedDecks).toEqual(["Bible/OT", ""]);
    store().setDeckPaused("Bible/OT", false);
    expect(store().pausedDecks).toEqual([""]);
    expect(loadPausedDecks()).toEqual([""]);
  });

  it("keeps a moved deck switched off under its new path", async () => {
    await seedPalace("Law", "Bible/OT");
    store().setDeckPaused("Bible/OT", true);
    await store().moveAtlasGroup("Bible/OT", "");
    expect(store().pausedDecks).toEqual(["OT"]);
  });
});
