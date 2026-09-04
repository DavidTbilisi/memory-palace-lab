import { CAST_AXES, CAST_LEXICON, type CastAxisName } from "../../../src/data/castLexicon";
import {
  formatCastCompact,
  parseCast,
  type CastValue,
} from "../../../src/domain/services/palaceDsl/cast";

/**
 * CAST helpers for the CLI: translate between the three notations in play
 * (the app's 4-digit compact token, theSystem's 8-bit string, and the
 * canonical English labels) and render them with the lexicon's glosses.
 */

export const AXIS_ORDER: readonly CastAxisName[] = ["who", "how", "what", "when"];

const FIELD_OF: Record<CastAxisName, keyof CastValue> = {
  who: "ab",
  how: "cd",
  what: "ef",
  when: "gh",
};

export interface CastAxisView {
  axis: CastAxisName;
  slot: string;
  question: string;
  /** Bit pair from theSystem/cast-system.md, null when the axis is unset. */
  bits: string | null;
  /** Compact digit: 0 unset, 1..4 index into the axis. */
  compact: string;
  english: string | null;
  gloss: string | null;
  simpleEnglish: string | null;
  georgian: string | null;
  russian: string | null;
  useWhen: string | null;
}

export interface CastView {
  compact: string;
  /** Four bit pairs separated by spaces, null unless every axis is set. */
  bits: string | null;
  scene: string;
  axes: CastAxisView[];
}

function allowedFor(axis: CastAxisName): string {
  return CAST_LEXICON[axis].rows.map((row) => row.english).join(", ");
}

/**
 * Accepts the compact token (`1231`), theSystem's eight bits (`00011000` or
 * `00 01 10 00`), or named axes (`who:Giant how:Flowing`).
 */
export function parseCastInput(input: string): CastValue {
  const trimmed = input.trim();
  const bitsOnly = trimmed.replace(/[\s|,]/g, "");
  if (/^[01]{8}$/.test(bitsOnly)) {
    const pairs = bitsOnly.match(/.{2}/g)!;
    const out: CastValue = { ab: "", cd: "", ef: "", gh: "" };
    AXIS_ORDER.forEach((axis, i) => {
      const row = CAST_LEXICON[axis].rows.find((r) => r.bits === pairs[i]);
      out[FIELD_OF[axis]] = row?.english ?? "";
    });
    return out;
  }
  const parsed = parseCast(trimmed);
  if (!parsed) {
    throw new Error(
      `Unrecognised CAST token "${input}". Use compact digits (1231), eight bits (00 01 10 00), ` +
        `or named axes (who:Giant how:Flowing what:Cloud when:"Red cave").`,
    );
  }
  return parsed;
}

/** Build a CastValue from per-axis English labels (case-insensitive). Missing axes stay unset. */
export function castFromLabels(labels: Partial<Record<CastAxisName, string>>): CastValue {
  const out: CastValue = { ab: "", cd: "", ef: "", gh: "" };
  for (const axis of AXIS_ORDER) {
    const raw = labels[axis]?.trim();
    if (!raw) continue;
    const row = CAST_LEXICON[axis].rows.find((r) => r.english.toLowerCase() === raw.toLowerCase());
    if (!row) {
      throw new Error(`Unknown CAST ${axis} value "${raw}". Allowed: ${allowedFor(axis)}.`);
    }
    out[FIELD_OF[axis]] = row.english;
  }
  return out;
}

function sceneSentence(axes: CastAxisView[]): string {
  const [who, how, what, when] = axes as [CastAxisView, CastAxisView, CastAxisView, CastAxisView];
  if (axes.every((a) => !a.english)) return "No CAST set.";
  const parts: string[] = [who.english ? `A ${who.english}` : "An unset character"];
  if (how.english) parts.push(how.english.toLowerCase());
  if (what.english) parts.push(`a ${what.english.toLowerCase()}`);
  if (when.english) parts.push(`in a ${when.english.toLowerCase()}`);
  return `${parts.join(" ")}.`;
}

export function describeCast(cast: CastValue): CastView {
  const compact = formatCastCompact(cast);
  const axes: CastAxisView[] = AXIS_ORDER.map((axis, i) => {
    const lexicon = CAST_LEXICON[axis];
    const english = cast[FIELD_OF[axis]] || null;
    const row = english ? lexicon.rows.find((r) => r.english === english) ?? null : null;
    return {
      axis,
      slot: lexicon.slot,
      question: lexicon.question,
      bits: row?.bits ?? null,
      compact: compact[i]!,
      english,
      gloss: row?.gloss ?? null,
      simpleEnglish: row?.simpleEnglish ?? null,
      georgian: row?.georgian ?? null,
      russian: row?.russian ?? null,
      useWhen: row?.useWhen ?? null,
    };
  });
  const allSet = axes.every((a) => a.bits !== null);
  return {
    compact,
    bits: allSet ? axes.map((a) => a.bits).join(" ") : null,
    scene: sceneSentence(axes),
    axes,
  };
}

export function renderCastText(view: CastView): string {
  const lines = [`${view.compact}${view.bits ? `  bits ${view.bits}` : ""}`, view.scene];
  for (const a of view.axes) {
    const value = a.english ? `${a.bits} ${a.english}` : "-- unset";
    const hint = a.useWhen ? `  (${a.useWhen})` : "";
    lines.push(`  ${a.axis.padEnd(5)} ${a.slot}  ${value.padEnd(16)} ${a.gloss ?? ""}${hint}`);
  }
  return `${lines.join("\n")}\n`;
}

export function castTable() {
  return CAST_AXES.map((axis) => ({
    axis: axis.name,
    slot: axis.slot,
    field: axis.field,
    title: axis.title,
    question: axis.question,
    rows: axis.rows.map((row, i) => ({
      compact: String(i + 1),
      bits: row.bits,
      english: row.english,
      gloss: row.gloss,
      simpleEnglish: row.simpleEnglish,
      georgian: row.georgian,
      russian: row.russian,
      useWhen: row.useWhen,
    })),
  }));
}

export function renderCastTable(): string {
  const lines: string[] = [];
  for (const axis of castTable()) {
    lines.push(`${axis.axis.toUpperCase()} (${axis.slot}) ${axis.title}: ${axis.question}`);
    for (const row of axis.rows) {
      lines.push(
        `  ${row.compact}  ${row.bits}  ${row.english.padEnd(13)} ${row.gloss.padEnd(24)} ${row.useWhen}`,
      );
    }
    lines.push("");
  }
  lines.push("Compact token = one digit per axis in WHO/HOW/WHAT/WHEN order, 0 = unset.");
  return `${lines.join("\n")}\n`;
}
