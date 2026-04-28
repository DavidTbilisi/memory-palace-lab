import { CAST_HOW, CAST_WHAT, CAST_WHEN, CAST_WHO } from "../../entities/types";

export interface CastValue {
  ab: string;
  cd: string;
  ef: string;
  gh: string;
}

const AXES = ["who", "how", "what", "when"] as const;
type AxisName = (typeof AXES)[number];

const AXIS_VALUES: Record<AxisName, readonly string[]> = {
  who: CAST_WHO,
  how: CAST_HOW,
  what: CAST_WHAT,
  when: CAST_WHEN,
};

const AXIS_TO_FIELD: Record<AxisName, keyof CastValue> = {
  who: "ab",
  how: "cd",
  what: "ef",
  when: "gh",
};

const FIELD_TO_AXIS: Record<keyof CastValue, AxisName> = {
  ab: "who",
  cd: "how",
  ef: "what",
  gh: "when",
};

const EMPTY_CAST: CastValue = { ab: "", cd: "", ef: "", gh: "" };

function parseCompact(token: string): CastValue | null {
  if (!/^[0-4]{4}$/.test(token)) return null;
  const digits = token.split("").map((d) => Number.parseInt(d, 10));
  const out: CastValue = { ab: "", cd: "", ef: "", gh: "" };
  const fields: (keyof CastValue)[] = ["ab", "cd", "ef", "gh"];
  for (let i = 0; i < 4; i += 1) {
    const idx = digits[i]!;
    if (idx === 0) continue;
    const axis = FIELD_TO_AXIS[fields[i]!];
    out[fields[i]!] = AXIS_VALUES[axis][idx - 1]!;
  }
  return out;
}

function tokenizeNamed(input: string): { axis: AxisName; value: string }[] | null {
  const tokens: { axis: AxisName; value: string }[] = [];
  let i = 0;
  while (i < input.length) {
    while (i < input.length && /\s/.test(input[i]!)) i += 1;
    if (i >= input.length) break;

    const rest = input.slice(i);
    const axisMatch = rest.match(/^(who|how|what|when):/);
    if (!axisMatch) return null;
    const axis = axisMatch[1] as AxisName;
    i += axisMatch[0].length;

    if (input[i] === '"') {
      i += 1;
      const start = i;
      while (i < input.length && input[i] !== '"') i += 1;
      if (i >= input.length) return null;
      tokens.push({ axis, value: input.slice(start, i) });
      i += 1;
    } else {
      const start = i;
      while (i < input.length && !/\s/.test(input[i]!)) i += 1;
      tokens.push({ axis, value: input.slice(start, i) });
    }
  }
  return tokens;
}

function parseNamed(input: string): CastValue | null {
  const tokens = tokenizeNamed(input);
  if (!tokens) return null;
  const out: CastValue = { ab: "", cd: "", ef: "", gh: "" };
  for (const { axis, value } of tokens) {
    if (!AXIS_VALUES[axis].includes(value)) return null;
    out[AXIS_TO_FIELD[axis]] = value;
  }
  return out;
}

export function parseCast(token: string): CastValue | null {
  const trimmed = token.trim();
  if (trimmed === "") return { ...EMPTY_CAST };

  if (/^[0-9A-Za-z]+$/.test(trimmed) && !trimmed.includes(":")) {
    return parseCompact(trimmed);
  }

  return parseNamed(trimmed);
}

export function formatCastCompact(cast: CastValue): string {
  const fields: (keyof CastValue)[] = ["ab", "cd", "ef", "gh"];
  return fields
    .map((field) => {
      const value = cast[field];
      if (!value) return "0";
      const axis = FIELD_TO_AXIS[field];
      const idx = AXIS_VALUES[axis].indexOf(value);
      return idx < 0 ? "0" : String(idx + 1);
    })
    .join("");
}
