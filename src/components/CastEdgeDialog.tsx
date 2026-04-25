import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CAST_HOW, CAST_WHEN, CAST_WHAT, CAST_WHO } from "../domain/entities/types";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type EdgeCastPayload = { ab: string; cd: string; ef: string; gh: string; label?: string };

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (cast: EdgeCastPayload) => void;
};

export function CastEdgeDialog({ open, onOpenChange, onConfirm }: Props) {
  const [tier, setTier] = React.useState<"tier1" | "tier2">("tier1");
  const [ab, setAb] = React.useState<string>(CAST_WHO[0]);
  const [cd, setCd] = React.useState<string>(CAST_HOW[0]);
  const [ef, setEf] = React.useState<string>(CAST_WHAT[0]);
  const [gh, setGh] = React.useState<string>(CAST_WHEN[0]);
  const [tier1Verb, setTier1Verb] = React.useState("links");
  const [tier1Direction, setTier1Direction] = React.useState<"one-way" | "two-way">("one-way");
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [activeHint, setActiveHint] = React.useState(
    "Tier 1 starts simple with a verb. Switch to Tier 2 CAST when edges collide.",
  );
  const tier1VerbGroups = [
    { label: "Control", verbs: ["commands", "owns", "governs", "locks"] },
    { label: "Supply", verbs: ["feeds", "sends", "delivers", "supplies"] },
    { label: "Trigger", verbs: ["triggers", "activates", "fires", "launches"] },
    { label: "Block", verbs: ["blocks", "stops", "freezes", "prevents"] },
    { label: "Transform", verbs: ["converts", "transforms", "encodes", "breaks"] },
    { label: "Inform", verbs: ["signals", "notifies", "warns", "informs"] },
    { label: "Depend", verbs: ["requires", "depends on", "needs"] },
    { label: "Amplify", verbs: ["amplifies", "inflates", "multiplies"] },
  ] as const;

  const bits = ["00", "01", "10", "11"] as const;
  const bitOf = (list: readonly string[], value: string) => {
    const idx = list.indexOf(value);
    return idx >= 0 && idx < bits.length ? bits[idx] : "--";
  };

  const cProfiles = [
    "Hub/controller source role",
    "Peer/mutual source role (renders bidirectional edge)",
    "Helper/invisible dependency role",
    "Reactive/triggered source role",
  ] as const;
  const aProfiles = [
    "Owns/dictates effect",
    "Supplies/feeds effect",
    "Influences/spreads effect",
    "Transforms/breaks effect",
  ] as const;
  const sProfiles = [
    "Data/structure stream",
    "Resources/energy stream",
    "Signals/information stream",
    "Events/triggers stream",
  ] as const;
  const tProfiles = [
    "Permanent relation",
    "Normally active relation",
    "Conditional relation",
    "Temporary/unstable relation",
  ] as const;

  const slotDescriptions = {
    c: "C - Character: source role (Giant, Mermaid, Mage, Dragon).",
    a: "A - Action: effect style (Crushing, Flowing, Spreading, Exploding).",
    s: "S - Stream: what moves (Rock, Water, Cloud, Lightning).",
    t: "T - Time: stability (Red cave, Blue ocean, Green sky, Purple storm).",
  } as const;

  const buildPayload = (): EdgeCastPayload => {
    if (tier === "tier1") {
      const directionRole = tier1Direction === "two-way" ? CAST_WHO[1] : CAST_WHO[0];
      return {
        ab: directionRole,
        cd: CAST_HOW[2],
        ef: CAST_WHAT[2],
        gh: CAST_WHEN[1],
        label: tier1Verb.trim() || "links",
      };
    }
    return { ab, cd, ef, gh };
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <Dialog.Title className="text-lg font-semibold text-zinc-100">CAST edge</Dialog.Title>
            <Button variant="secondary" size="sm" type="button" onClick={() => setHelpOpen(true)}>
              ?
            </Button>
          </div>
          <Dialog.Description className="mt-1 text-sm text-zinc-400">
            Tier 2 CAST for similar-looking edges (Tier 1 is verb-only).
          </Dialog.Description>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={tier === "tier1" ? "default" : "secondary"}
              onClick={() => {
                setTier("tier1");
                setActiveHint("Tier 1: use a concise verb scene. Upgrade to Tier 2 only if collisions appear.");
              }}
            >
              Tier 1 (Verb)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={tier === "tier2" ? "default" : "secondary"}
              onClick={() => {
                setTier("tier2");
                setActiveHint("Tier 2 CAST: hover C/A/S/T for slot meaning and bit mapping.");
              }}
            >
              Tier 2 (CAST)
            </Button>
          </div>
          <div className="mt-2 rounded-md border border-zinc-700/70 bg-zinc-950/70 px-2 py-1.5 text-xs text-zinc-300">
            {activeHint}
          </div>
          {tier === "tier1" ? (
            <div className="mt-4 grid gap-3">
              <div>
                <Label htmlFor="tier1-verb">Tier 1 verb (source -&gt; target)</Label>
                <input
                  id="tier1-verb"
                  aria-label="Tier 1 edge verb"
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                  value={tier1Verb}
                  onChange={(e) => setTier1Verb(e.target.value)}
                  placeholder="e.g. feeds, triggers, blocks"
                />
              </div>
              <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Verb suggestions</div>
                <div className="mt-1.5 grid gap-1.5">
                  {tier1VerbGroups.map((group) => (
                    <div key={group.label} className="flex flex-wrap items-center gap-1.5">
                      <span className="min-w-[58px] text-[11px] text-zinc-500">{group.label}</span>
                      {group.verbs.map((verb) => (
                        <button
                          key={verb}
                          type="button"
                          className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-[11px] text-zinc-200 hover:bg-zinc-800"
                          onClick={() => setTier1Verb(verb)}
                        >
                          {verb}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="tier1-direction">Direction</Label>
                <select
                  id="tier1-direction"
                  aria-label="Tier 1 direction"
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                  value={tier1Direction}
                  onChange={(e) => setTier1Direction(e.target.value as "one-way" | "two-way")}
                >
                  <option value="one-way">A -&gt; B (one-way)</option>
                  <option value="two-way">A &lt;-&gt; B (two-way)</option>
                </select>
                <div className="mt-1 text-[11px] text-zinc-500">
                  Tier 1 direction maps to edge arrows immediately.
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
            <div
              onMouseEnter={() => setActiveHint(`${slotDescriptions.c} 00/01/10/11 from top to bottom.`)}
              onFocusCapture={() => setActiveHint(`${slotDescriptions.c} 00/01/10/11 from top to bottom.`)}
            >
              <Label>C - source role (Character)</Label>
              <select
                aria-label="CAST character"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={ab}
                onChange={(e) => setAb(e.target.value)}
              >
                {CAST_WHO.map((x, i) => (
                  <option key={x} value={x}>
                    {x} ({bits[i]})
                  </option>
                ))}
              </select>
              <div className="mt-1 text-[11px] text-zinc-500">C bits: {bitOf(CAST_WHO, ab)}</div>
              <div className="text-[11px] text-zinc-500">
                {cProfiles[(CAST_WHO as readonly string[]).indexOf(ab)] ?? cProfiles[0]}
              </div>
            </div>
            <div
              onMouseEnter={() => setActiveHint(`${slotDescriptions.a} 00/01/10/11 from top to bottom.`)}
              onFocusCapture={() => setActiveHint(`${slotDescriptions.a} 00/01/10/11 from top to bottom.`)}
            >
              <Label>A - effect style (Action)</Label>
              <select
                aria-label="CAST action"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={cd}
                onChange={(e) => setCd(e.target.value)}
              >
                {CAST_HOW.map((x, i) => (
                  <option key={x} value={x}>
                    {x} ({bits[i]})
                  </option>
                ))}
              </select>
              <div className="mt-1 text-[11px] text-zinc-500">A bits: {bitOf(CAST_HOW, cd)}</div>
              <div className="text-[11px] text-zinc-500">
                {aProfiles[(CAST_HOW as readonly string[]).indexOf(cd)] ?? aProfiles[0]}
              </div>
            </div>
            <div
              onMouseEnter={() => setActiveHint(`${slotDescriptions.s} 00/01/10/11 from top to bottom.`)}
              onFocusCapture={() => setActiveHint(`${slotDescriptions.s} 00/01/10/11 from top to bottom.`)}
            >
              <Label>S - what moves (Stream)</Label>
              <select
                aria-label="CAST stream"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={ef}
                onChange={(e) => setEf(e.target.value)}
              >
                {CAST_WHAT.map((x, i) => (
                  <option key={x} value={x}>
                    {x} ({bits[i]})
                  </option>
                ))}
              </select>
              <div className="mt-1 text-[11px] text-zinc-500">S bits: {bitOf(CAST_WHAT, ef)}</div>
              <div className="text-[11px] text-zinc-500">
                {sProfiles[(CAST_WHAT as readonly string[]).indexOf(ef)] ?? sProfiles[0]}
              </div>
            </div>
            <div
              onMouseEnter={() => setActiveHint(`${slotDescriptions.t} 00/01/10/11 from top to bottom.`)}
              onFocusCapture={() => setActiveHint(`${slotDescriptions.t} 00/01/10/11 from top to bottom.`)}
            >
              <Label>T - stability (Time)</Label>
              <select
                aria-label="CAST time"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={gh}
                onChange={(e) => setGh(e.target.value)}
              >
                {CAST_WHEN.map((x, i) => (
                  <option key={x} value={x}>
                    {x} ({bits[i]})
                  </option>
                ))}
              </select>
              <div className="mt-1 text-[11px] text-zinc-500">T bits: {bitOf(CAST_WHEN, gh)}</div>
              <div className="text-[11px] text-zinc-500">
                {tProfiles[(CAST_WHEN as readonly string[]).indexOf(gh)] ?? tProfiles[0]}
              </div>
            </div>
            </div>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm(buildPayload());
                onOpenChange(false);
              }}
            >
              Create edge
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      <Dialog.Root open={helpOpen} onOpenChange={setHelpOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-55 bg-black/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-56 w-[min(620px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-zinc-100">CAST quick reference</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-zinc-400">
              Tier 1: verb-only. Tier 2: C/A/S/T (WHO -&gt; HOW -&gt; WHAT -&gt; WHEN) with 2-bit slots.
            </Dialog.Description>

            <div className="mt-3 grid gap-3 text-sm text-zinc-200">
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">C - Character (source role)</div>
                <div className="mt-1 text-zinc-300">
                  Giant=hub/controller, Mermaid=peer/mutual, Mage=helper/dependency, Dragon=reactive/triggered.
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_WHO[0]} ({cProfiles[0]}) · 01 {CAST_WHO[1]} ({cProfiles[1]}) · 10 {CAST_WHO[2]} (
                  {cProfiles[2]}) · 11 {CAST_WHO[3]} ({cProfiles[3]})
                </div>
              </div>
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">A - Action (effect kind)</div>
                <div className="mt-1 text-zinc-300">
                  Crushing=controls, Flowing=feeds, Spreading=influences, Exploding=transforms/breaks.
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_HOW[0]} ({aProfiles[0]}) · 01 {CAST_HOW[1]} ({aProfiles[1]}) · 10 {CAST_HOW[2]} (
                  {aProfiles[2]}) · 11 {CAST_HOW[3]} ({aProfiles[3]})
                </div>
              </div>
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">S - Stream (what moves)</div>
                <div className="mt-1 text-zinc-300">Rock=data, Water=resources/energy, Cloud=signals, Lightning=events.</div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_WHAT[0]} ({sProfiles[0]}) · 01 {CAST_WHAT[1]} ({sProfiles[1]}) · 10 {CAST_WHAT[2]} (
                  {sProfiles[2]}) · 11 {CAST_WHAT[3]} ({sProfiles[3]})
                </div>
              </div>
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">T - stability</div>
                <div className="mt-1 text-zinc-300">
                  Red cave=permanent, Blue ocean=normally active, Green sky=conditional, Purple storm=temporary.
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_WHEN[0]} ({tProfiles[0]}) · 01 {CAST_WHEN[1]} ({tProfiles[1]}) · 10 {CAST_WHEN[2]} (
                  {tProfiles[2]}) · 11 {CAST_WHEN[3]} ({tProfiles[3]})
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="button" onClick={() => setHelpOpen(false)}>
                Close
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Dialog.Root>
  );
}
