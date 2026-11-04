import { requestNavigation } from "../app/navigationEvents";
import { linkConfusion } from "../canvas/confusionLinks";
import { interventionNodeIds, type Intervention } from "../domain/services/interventions";
import { usePalaceStore } from "../store/palaceStore";
import { waitForEditorReady } from "./examplePalaces";

/** Make `palaceId` the open palace, with its canvas ready. */
async function openPalace(palaceId: string) {
  const state = usePalaceStore.getState();
  if (state.currentPalace?.id === palaceId) return;
  const previousEditor = state.editorRef;
  await state.openPalace(palaceId);
  await waitForEditorReady({ previousEditor }).catch(() => undefined);
}

/** Open the palace an intervention is about, on the canvas, with `nodeId` selected in the inspector. */
async function openOnNode(palaceId: string, nodeId: string) {
  await openPalace(palaceId);
  const store = usePalaceStore.getState();
  store.setAppMode("encode");
  store.setRoutePanelOpen(false);
  store.setFocusNodeId(nodeId);
  requestNavigation("graph");
}

/**
 * Act on a suggestion. Re-encode opens the node and waits for the learner to finish (the banner's
 * Done restarts its schedule and logs it). Linking a confusion happens at once, where the learner
 * is. Adding a Distinguisher opens the node on its NEDF slots. A route fix is applied as proposed,
 * once the learner has confirmed it. Returns a line for the learner when there is something to say.
 */
export async function launchIntervention(intervention: Intervention): Promise<string | null> {
  const store = usePalaceStore.getState();
  const accept = () =>
    store.recordInterventionAccepted({
      kind: intervention.kind,
      palaceId: intervention.palaceId,
      nodeIds: interventionNodeIds(intervention),
      title:
        intervention.kind === "link-confusion"
          ? intervention.nodes.map((node) => node.title).join(" + ")
          : intervention.kind === "route-surgery"
            ? intervention.routeName
            : intervention.title,
    });

  switch (intervention.kind) {
    case "re-encode":
      await openOnNode(intervention.palaceId, intervention.nodeId);
      usePalaceStore.getState().startReEncode({
        palaceId: intervention.palaceId,
        nodeId: intervention.nodeId,
        title: intervention.title,
      });
      return null;
    case "link-confusion": {
      const [a, b] = intervention.nodes;
      // Linking needs the palace open but not in view: the learner stays on the list and reads
      // what happened there.
      await openPalace(intervention.palaceId);
      const { editorRef, currentPalace } = usePalaceStore.getState();
      if (!editorRef || currentPalace?.id !== intervention.palaceId) return "Open the palace on the canvas to link them.";
      const result = linkConfusion(editorRef, intervention.palaceId, a.nodeId, b.nodeId);
      if (!result.ok) return result.message;
      accept();
      return `Linked ${a.title} and ${b.title} as a confusion. Give each a Distinguisher that says how they differ.`;
    }
    case "add-distinguisher":
      await openOnNode(intervention.palaceId, intervention.nodeId);
      accept();
      return null;
    case "route-surgery": {
      // Called once the learner has confirmed the proposal; the store logs it with its routes.
      await openPalace(intervention.palaceId);
      return usePalaceStore.getState().applyRouteSurgeryPlan(intervention.plan, intervention.palaceId).message;
    }
  }
}
