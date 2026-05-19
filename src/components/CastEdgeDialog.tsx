import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CAST_HOW, CAST_WHEN, CAST_WHAT, CAST_WHO } from "../domain/entities/types";
import {
  CAST_LEXICON,
  CAST_WHO_GLOSS,
  CAST_HOW_GLOSS,
  CAST_WHAT_GLOSS,
  CAST_WHEN_GLOSS,
  CAST_WHO_PROFILE,
  CAST_HOW_PROFILE,
  CAST_WHAT_PROFILE,
  CAST_WHEN_PROFILE,
  type CastAxisName,
} from "../data/castLexicon";
import {
  TIER1_VERB_GROUPS,
  describeCollision,
  detectVerbCollisions,
} from "../domain/services/cast/verbCollisions";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type EdgeCastPayload = { ab: string; cd: string; ef: string; gh: string; label?: string };

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (cast: EdgeCastPayload) => void;
  /**
   * Tier-1 labels of other edges already leaving the same source node.
   * Used to warn about exact duplicates and confusable verbs from the same
   * Tier-1 group. Optional — the dialog still works without it.
   */
  siblingEdgeLabels?: readonly string[];
};

const DEFAULT_TIER1_VERB = "links";

function normalizeTier1Verb(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function parseTier1Verbs(value: string) {
  const seen = new Set<string>();
  const verbs: string[] = [];
  for (const raw of value.split(/[;,]/)) {
    const verb = normalizeTier1Verb(raw);
    if (!verb) continue;
    const key = verb.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    verbs.push(verb);
  }
  return verbs;
}

function formatTier1Verbs(verbs: string[]) {
  return verbs.join("; ");
}

function hasTier1Verb(verbs: string[], candidate: string) {
  const key = candidate.toLowerCase();
  return verbs.some((verb) => verb.toLowerCase() === key);
}

export function CastEdgeDialog({ open, onOpenChange, onConfirm, siblingEdgeLabels }: Props) {
  const [tier, setTier] = React.useState<"tier1" | "tier2">("tier1");
  const [ab, setAb] = React.useState<string>(CAST_WHO[0]);
  const [cd, setCd] = React.useState<string>(CAST_HOW[0]);
  const [ef, setEf] = React.useState<string>(CAST_WHAT[0]);
  const [gh, setGh] = React.useState<string>(CAST_WHEN[0]);
  const [tier1Verb, setTier1Verb] = React.useState(DEFAULT_TIER1_VERB);
  const [tier1Direction, setTier1Direction] = React.useState<"one-way" | "two-way">("one-way");
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [activeHint, setActiveHint] = React.useState(
    "Tier 1 starts simple with one or more verbs. Switch to Tier 2 CAST when edges collide.",
  );
  const tier1VerbGroups = TIER1_VERB_GROUPS;

  const bits = ["00", "01", "10", "11"] as const;
  const bitOf = (list: readonly string[], value: string) => {
    const idx = list.indexOf(value);
    return idx >= 0 && idx < bits.length ? bits[idx] : "--";
  };

  const cProfiles = CAST_WHO_PROFILE;
  const aProfiles = CAST_HOW_PROFILE;
  const sProfiles = CAST_WHAT_PROFILE;
  const tProfiles = CAST_WHEN_PROFILE;

  const cGloss = CAST_WHO_GLOSS;
  const aGloss = CAST_HOW_GLOSS;
  const sGloss = CAST_WHAT_GLOSS;
  const tGloss = CAST_WHEN_GLOSS;

  const useWhenHint = (axis: CastAxisName, english: string): string => {
    const row = CAST_LEXICON[axis].rows.find((r) => r.english === english);
    if (!row) return "";
    return `${row.english} (${row.bits}) — ${row.useWhen}  ·  ქართ: ${row.georgian}  ·  Рус: ${row.russian}`;
  };

  const selectedTier1Verbs = React.useMemo(() => parseTier1Verbs(tier1Verb), [tier1Verb]);
  const tier1LabelPreview = React.useMemo(() => {
    return selectedTier1Verbs.length > 0 ? selectedTier1Verbs.join(" / ") : DEFAULT_TIER1_VERB;
  }, [selectedTier1Verbs]);

  const tier1Collisions = React.useMemo(() => {
    if (!siblingEdgeLabels || siblingEdgeLabels.length === 0) return [];
    return detectVerbCollisions(selectedTier1Verbs, siblingEdgeLabels);
  }, [selectedTier1Verbs, siblingEdgeLabels]);

  const promoteToTier2 = () => {
    setTier("tier2");
    setAb(tier1Direction === "two-way" ? CAST_WHO[1] : CAST_WHO[0]);
    setActiveHint(
      "Promoted to Tier 2 — pick the slot that breaks the tie. C (source role) usually does it first; if both sources play the same role, try S (what flows) or T (timing).",
    );
  };
  const tier2MeaningPreview = `${ab} means ${cGloss[(CAST_WHO as readonly string[]).indexOf(ab)] ?? cGloss[0]}. ${cd} means ${
    aGloss[(CAST_HOW as readonly string[]).indexOf(cd)] ?? aGloss[0]
  }. ${ef} means ${sGloss[(CAST_WHAT as readonly string[]).indexOf(ef)] ?? sGloss[0]}. ${gh} means ${
    tGloss[(CAST_WHEN as readonly string[]).indexOf(gh)] ?? tGloss[0]
  }.`;

  const toggleTier1Suggestion = (verb: string) => {
    const normalizedVerb = normalizeTier1Verb(verb);
    if (!normalizedVerb) return;
    setTier1Verb((currentValue) => {
      const current = parseTier1Verbs(currentValue);
      if (hasTier1Verb(current, normalizedVerb)) {
        const next = current.filter((item) => item.toLowerCase() !== normalizedVerb.toLowerCase());
        return formatTier1Verbs(next);
      }
      const nextBase =
        normalizedVerb.toLowerCase() === DEFAULT_TIER1_VERB
          ? current
          : current.filter((item) => item.toLowerCase() !== DEFAULT_TIER1_VERB);
      return formatTier1Verbs([...nextBase, normalizedVerb]);
    });
  };

  const buildPayload = (): EdgeCastPayload => {
    if (tier === "tier1") {
      const directionRole = tier1Direction === "two-way" ? CAST_WHO[1] : CAST_WHO[0];
      const verbs = parseTier1Verbs(tier1Verb);
      return {
        ab: directionRole,
        cd: CAST_HOW[2],
        ef: CAST_WHAT[2],
        gh: CAST_WHEN[1],
        label: verbs.length > 0 ? verbs.join(" / ") : DEFAULT_TIER1_VERB,
      };
    }
    return { ab, cd, ef, gh };
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(440px,92vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <Dialog.Title className="text-lg font-semibold text-zinc-100">Connect nodes</Dialog.Title>
            <Button variant="secondary" size="sm" type="button" onClick={() => setHelpOpen(true)}>
              ?
            </Button>
          </div>
          <Dialog.Description className="mt-1 text-sm text-zinc-400">
            Tier 1 is the fast path. Tier 2 decodes source role, effect, payload, and timing when edges need more precision.
          </Dialog.Description>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={tier === "tier1" ? "default" : "secondary"}
              onClick={() => {
                setTier("tier1");
                setActiveHint("Tier 1: use one or more concise verbs. Upgrade to Tier 2 only if collisions appear.");
              }}
            >
              Tier 1 (Quick verb)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={tier === "tier2" ? "default" : "secondary"}
              onClick={() => {
                setTier("tier2");
                setActiveHint("Tier 2 CAST: each mnemonic shows its plain-language meaning directly in the picker.");
              }}
            >
              Tier 2 (Decoded CAST)
            </Button>
          </div>
          <div className="mt-2 rounded-md border border-zinc-700/70 bg-zinc-950/70 px-2 py-1.5 text-xs text-zinc-300">
            {activeHint}
          </div>
          {tier === "tier1" ? (
            <div className="mt-4 grid gap-3">
              <div>
                <Label htmlFor="tier1-verb">Tier 1 connections (source -&gt; target)</Label>
                <input
                  id="tier1-verb"
                  aria-label="Tier 1 edge verb"
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                  value={tier1Verb}
                  onChange={(e) => setTier1Verb(e.target.value)}
                  placeholder="e.g. supplies; governs; depends on"
                />
                <div className="mt-1 text-[11px] text-zinc-500">
                  Multiple allowed. Separate typed values with ";" or ",". Suggestion buttons toggle in and out.
                </div>
              </div>
              <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Connection suggestions</div>
                <div className="mt-1.5 grid gap-1.5">
                  {tier1VerbGroups.map((group) => (
                    <div key={group.label} className="flex flex-wrap items-center gap-1.5">
                      <span className="min-w-[58px] text-[11px] text-zinc-500">{group.label}</span>
                      {group.verbs.map((verb) => {
                        const selected = hasTier1Verb(selectedTier1Verbs, verb);
                        return (
                          <button
                            key={verb}
                            type="button"
                            aria-pressed={selected}
                            className={`rounded border px-1.5 py-0.5 text-[11px] transition-colors ${
                              selected
                                ? "border-violet-500 bg-violet-700/60 text-violet-50"
                                : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                            }`}
                            onClick={() => toggleTier1Suggestion(verb)}
                          >
                            {verb}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                <div className="text-[11px] uppercase tracking-wide text-zinc-400">Edge label preview</div>
                <div className="mt-1 text-sm text-zinc-100">{tier1LabelPreview}</div>
              </div>
              {tier1Collisions.length > 0 ? (
                <div
                  role="alert"
                  aria-label="Tier 1 verb collision"
                  className="rounded-md border border-amber-500/40 bg-amber-950/30 p-2 text-xs text-amber-100"
                >
                  <div className="font-medium text-amber-200">
                    Verb collision on this source node
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-amber-100/90">
                    {tier1Collisions.map((c, i) => (
                      <li key={`${c.candidate}|${c.sibling}|${i}`}>{describeCollision(c)}</li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button type="button" size="sm" onClick={promoteToTier2}>
                      Promote this edge to Tier 2 →
                    </Button>
                    <span className="text-[11px] text-amber-100/70">
                      Or pick a verb from a different family.
                    </span>
                  </div>
                </div>
              ) : null}
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
                <div className="mt-1 text-[11px] text-zinc-500">Tier 1 direction maps to edge arrows immediately.</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-400">C = source role</div>
                  <div className="mt-1 text-sm text-zinc-100">Giant, Mermaid, Mage, Dragon</div>
                  <div className="mt-1 text-[11px] text-zinc-500">Who is acting in the relationship.</div>
                </div>
                <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-400">A = effect style</div>
                  <div className="mt-1 text-sm text-zinc-100">Crushing, Flowing, Spreading, Exploding</div>
                  <div className="mt-1 text-[11px] text-zinc-500">How the source affects the target.</div>
                </div>
                <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-400">S = payload</div>
                  <div className="mt-1 text-sm text-zinc-100">Rock, Water, Cloud, Lightning</div>
                  <div className="mt-1 text-[11px] text-zinc-500">What is moving across the edge.</div>
                </div>
                <div className="rounded-md border border-zinc-700/70 bg-zinc-950/60 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-400">T = timing</div>
                  <div className="mt-1 text-sm text-zinc-100">Red cave, Blue ocean, Green sky, Purple storm</div>
                  <div className="mt-1 text-[11px] text-zinc-500">When or how stable the relation is.</div>
                </div>
              </div>
              <div className="rounded-md border border-violet-500/25 bg-violet-950/20 px-3 py-2 text-xs leading-5 text-violet-100">
                {tier2MeaningPreview}
              </div>
              <div
                onMouseEnter={() => setActiveHint(useWhenHint("who", ab))}
                onFocusCapture={() => setActiveHint(useWhenHint("who", ab))}
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
                      {x} - {cGloss[i]} ({bits[i]})
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-zinc-500">C bits: {bitOf(CAST_WHO, ab)}</div>
                <div className="text-[11px] text-zinc-500">
                  {ab} means {cGloss[(CAST_WHO as readonly string[]).indexOf(ab)] ?? cGloss[0]}. {" "}
                  {cProfiles[(CAST_WHO as readonly string[]).indexOf(ab)] ?? cProfiles[0]}
                </div>
              </div>
              <div
                onMouseEnter={() => setActiveHint(useWhenHint("how", cd))}
                onFocusCapture={() => setActiveHint(useWhenHint("how", cd))}
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
                      {x} - {aGloss[i]} ({bits[i]})
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-zinc-500">A bits: {bitOf(CAST_HOW, cd)}</div>
                <div className="text-[11px] text-zinc-500">
                  {cd} means {aGloss[(CAST_HOW as readonly string[]).indexOf(cd)] ?? aGloss[0]}. {" "}
                  {aProfiles[(CAST_HOW as readonly string[]).indexOf(cd)] ?? aProfiles[0]}
                </div>
              </div>
              <div
                onMouseEnter={() => setActiveHint(useWhenHint("what", ef))}
                onFocusCapture={() => setActiveHint(useWhenHint("what", ef))}
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
                      {x} - {sGloss[i]} ({bits[i]})
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-zinc-500">S bits: {bitOf(CAST_WHAT, ef)}</div>
                <div className="text-[11px] text-zinc-500">
                  {ef} means {sGloss[(CAST_WHAT as readonly string[]).indexOf(ef)] ?? sGloss[0]}. {" "}
                  {sProfiles[(CAST_WHAT as readonly string[]).indexOf(ef)] ?? sProfiles[0]}
                </div>
              </div>
              <div
                onMouseEnter={() => setActiveHint(useWhenHint("when", gh))}
                onFocusCapture={() => setActiveHint(useWhenHint("when", gh))}
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
                      {x} - {tGloss[i]} ({bits[i]})
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-zinc-500">T bits: {bitOf(CAST_WHEN, gh)}</div>
                <div className="text-[11px] text-zinc-500">
                  {gh} means {tGloss[(CAST_WHEN as readonly string[]).indexOf(gh)] ?? tGloss[0]}. {" "}
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
          <Dialog.Content className="fixed left-1/2 top-1/2 z-56 flex max-h-[90vh] w-[min(620px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-zinc-100">CAST quick reference</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-zinc-400">
              Tier 1: one or more verb labels. Tier 2: C/A/S/T means source role, effect style, payload, and timing.
            </Dialog.Description>

            <div className="mt-3 grid gap-3 text-sm text-zinc-200">
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">C - Character (source role)</div>
                <div className="mt-1 text-zinc-300">
                  Giant=hub/controller, Mermaid=peer/mutual, Mage=helper/dependency, Dragon=reactive/triggered.
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_WHO[0]} ({cProfiles[0]}) - 01 {CAST_WHO[1]} ({cProfiles[1]}) - 10 {CAST_WHO[2]} ({cProfiles[2]}) - 11 {CAST_WHO[3]} ({cProfiles[3]})
                </div>
              </div>
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">A - Action (effect kind)</div>
                <div className="mt-1 text-zinc-300">
                  Crushing=controls, Flowing=feeds, Spreading=influences, Exploding=transforms/breaks.
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_HOW[0]} ({aProfiles[0]}) - 01 {CAST_HOW[1]} ({aProfiles[1]}) - 10 {CAST_HOW[2]} ({aProfiles[2]}) - 11 {CAST_HOW[3]} ({aProfiles[3]})
                </div>
              </div>
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">S - Stream (what moves)</div>
                <div className="mt-1 text-zinc-300">Rock=data, Water=resources/energy, Cloud=signals, Lightning=events.</div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_WHAT[0]} ({sProfiles[0]}) - 01 {CAST_WHAT[1]} ({sProfiles[1]}) - 10 {CAST_WHAT[2]} ({sProfiles[2]}) - 11 {CAST_WHAT[3]} ({sProfiles[3]})
                </div>
              </div>
              <div className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">T - stability</div>
                <div className="mt-1 text-zinc-300">
                  Red cave=permanent, Blue ocean=normally active, Green sky=conditional, Purple storm=temporary.
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  00 {CAST_WHEN[0]} ({tProfiles[0]}) - 01 {CAST_WHEN[1]} ({tProfiles[1]}) - 10 {CAST_WHEN[2]} ({tProfiles[2]}) - 11 {CAST_WHEN[3]} ({tProfiles[3]})
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
