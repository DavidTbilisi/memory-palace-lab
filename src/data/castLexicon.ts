/**
 * Single source of truth for the four CAST axes (WHO/HOW/WHAT/WHEN).
 *
 * The canonical spec lives in `theSystem/cast-system.md`; the bilingual
 * (English / ქართული / Русский) glosses come from
 * `theSystem/cast-beginner-bilingual.md`. The `english` field is the value
 * that gets serialized into edges and stored in palace data — do not rename
 * without a data migration.
 *
 * Row order is `00, 01, 10, 11` to match the bit pairs in the spec.
 */

export type CastAxisName = "who" | "how" | "what" | "when";
export type CastBits = "00" | "01" | "10" | "11";

export const CAST_BIT_PAIRS = ["00", "01", "10", "11"] as const;

const WHO_AXIS = {
  name: "who",
  slot: "C",
  field: "ab",
  title: "Character — source role",
  question: "On this arrow, how does the source show up?",
  rows: [
    {
      bits: "00",
      english: "Giant",
      simpleEnglish: "Boss. One way.",
      georgian: "გიგანტი → ცენტრი",
      russian: "Гигант → хозяин",
      gloss: "hub/controller",
      profile: "Hub/controller source role",
      useWhen: "Source dictates this hop one-way (parent → child, framework → app).",
    },
    {
      bits: "01",
      english: "Mermaid",
      simpleEnglish: "Friends. Both ways.",
      georgian: "ზღვისქალი ↔ თანასწორი",
      russian: "Русалка ↔ равный обмен",
      gloss: "peer/mutual",
      profile: "Peer/mutual source role (renders bidirectional edge)",
      useWhen: "Both ends negotiate; you could swap them without lying (service ↔ service).",
    },
    {
      bits: "10",
      english: "Mage",
      simpleEnglish: "Helper. Out.",
      georgian: "ჯადოქარი → დახმარება",
      russian: "Маг → помощь",
      gloss: "helper/dependency",
      profile: "Helper/invisible dependency role",
      useWhen: "Source helps the target without owning it (logger → app, lint → PR).",
    },
    {
      bits: "11",
      english: "Dragon",
      simpleEnglish: "Pushes back.",
      georgian: "დრაკონი ← პასუხი",
      russian: "Дракон ← ответ / обратное давление",
      gloss: "reactive/triggered",
      profile: "Reactive/triggered source role",
      useWhen: "Target pushes back on the source (rate limit ← client, DB full ← writer).",
    },
  ],
} as const;

const HOW_AXIS = {
  name: "how",
  slot: "A",
  field: "cd",
  title: "Action — effect style",
  question: "How does the source affect the target?",
  rows: [
    {
      bits: "00",
      english: "Crushing",
      simpleEnglish: "Holds hard.",
      georgian: "ძლიერი კონტროლი",
      russian: "Сильный контроль",
      gloss: "controls",
      profile: "Owns/dictates effect",
      useWhen: "Non-negotiable control — source owns the outcome.",
    },
    {
      bits: "01",
      english: "Flowing",
      simpleEnglish: "Feeds / runs.",
      georgian: "რბილი დინება",
      russian: "Питает / течёт",
      gloss: "feeds",
      profile: "Supplies/feeds effect",
      useWhen: "Steady feed — default supply rhythm.",
    },
    {
      bits: "10",
      english: "Spreading",
      simpleEnglish: "Nudges only.",
      georgian: "სუსტი გავლენა",
      russian: "Слабо влияет",
      gloss: "influences",
      profile: "Influences/spreads effect",
      useWhen: "Soft nudge — influences without dictating.",
    },
    {
      bits: "11",
      english: "Exploding",
      simpleEnglish: "Big change.",
      georgian: "მკვეთი გარდაქმნა",
      russian: "Резкий сдвиг / взрыв",
      gloss: "transforms or breaks",
      profile: "Transforms/breaks effect",
      useWhen: "Sharp shift — transforms or breaks the relationship.",
    },
  ],
} as const;

// NOTE: the canonical spec uses "stone" for EF=11; the lab has stored
// "Lightning" since 0.x and migrating would touch saved palaces. The label
// stays "Lightning" until a coordinated rename.
const WHAT_AXIS = {
  name: "what",
  slot: "S",
  field: "ef",
  title: "Stream — what moves",
  question: "What flows across this edge?",
  rows: [
    {
      bits: "00",
      english: "Rock",
      simpleEnglish: "Shape / layout.",
      georgian: "ქვა · სტრუქტურა",
      russian: "Камень · структура",
      gloss: "data or structure",
      profile: "Data/structure stream",
      useWhen: "Structure or data shape moves between source and target.",
    },
    {
      bits: "01",
      english: "Water",
      simpleEnglish: "Power / fuel.",
      georgian: "წყალი · ენერგია",
      russian: "Вода · ресурсы",
      gloss: "resources or energy",
      profile: "Resources/energy stream",
      useWhen: "Resources, energy, money, or fuel moves.",
    },
    {
      bits: "10",
      english: "Cloud",
      simpleEnglish: "Messages / info.",
      georgian: "ქლაუდი · სიგნალი",
      russian: "Облако · сигналы",
      gloss: "signals or information",
      profile: "Signals/information stream",
      useWhen: "Signals, messages, or information moves.",
    },
    {
      bits: "11",
      english: "Lightning",
      simpleEnglish: "Events / ticks.",
      georgian: "მოვლენა · იმპულსი",
      russian: "События · триггер",
      gloss: "events or triggers",
      profile: "Events/triggers stream",
      useWhen: "Discrete events, ticks, or triggers move.",
    },
  ],
} as const;

const WHEN_AXIS = {
  name: "when",
  slot: "T",
  field: "gh",
  title: "Time — stability",
  question: "When or how stable is this relation?",
  rows: [
    {
      bits: "00",
      english: "Red cave",
      simpleEnglish: "Always.",
      georgian: "წითელი გამოქვაბული · სამუდამო",
      russian: "Красная пещера · всегда",
      gloss: "permanent",
      profile: "Permanent relation",
      useWhen: "Always — permanent fixture of the system.",
    },
    {
      bits: "01",
      english: "Blue ocean",
      simpleEnglish: "Mostly on.",
      georgian: "ლურჯი ოკეანე · თითქმის ყოველთვის",
      russian: "Синий океан · почти всегда",
      gloss: "normally active",
      profile: "Normally active relation",
      useWhen: "Mostly on — default-active relation.",
    },
    {
      bits: "10",
      english: "Green sky",
      simpleEnglish: "Only if…",
      georgian: "მწვანე ცა · პირობითი",
      russian: "Зелёное небо · если условие",
      gloss: "conditional",
      profile: "Conditional relation",
      useWhen: "Only fires when a condition holds (cache miss, failure, flag).",
    },
    {
      bits: "11",
      english: "Purple storm",
      simpleEnglish: "Short burst.",
      georgian: "იისფერი შტორმი · მოკლე დრო",
      russian: "Буря · короткий срок",
      gloss: "temporary or unstable",
      profile: "Temporary/unstable relation",
      useWhen: "Short burst — temporary, transient, or unstable.",
    },
  ],
} as const;

export const CAST_LEXICON = {
  who: WHO_AXIS,
  how: HOW_AXIS,
  what: WHAT_AXIS,
  when: WHEN_AXIS,
} as const;

export type CastAxis = (typeof CAST_LEXICON)[CastAxisName];
export type CastRow = CastAxis["rows"][number];

export const CAST_AXES = [WHO_AXIS, HOW_AXIS, WHAT_AXIS, WHEN_AXIS] as const;

/** Canonical English labels per axis, indexed by bit pair (00, 01, 10, 11). */
export const CAST_WHO = [
  WHO_AXIS.rows[0].english,
  WHO_AXIS.rows[1].english,
  WHO_AXIS.rows[2].english,
  WHO_AXIS.rows[3].english,
] as const;
export const CAST_HOW = [
  HOW_AXIS.rows[0].english,
  HOW_AXIS.rows[1].english,
  HOW_AXIS.rows[2].english,
  HOW_AXIS.rows[3].english,
] as const;
export const CAST_WHAT = [
  WHAT_AXIS.rows[0].english,
  WHAT_AXIS.rows[1].english,
  WHAT_AXIS.rows[2].english,
  WHAT_AXIS.rows[3].english,
] as const;
export const CAST_WHEN = [
  WHEN_AXIS.rows[0].english,
  WHEN_AXIS.rows[1].english,
  WHEN_AXIS.rows[2].english,
  WHEN_AXIS.rows[3].english,
] as const;

/** Short dropdown labels — used in pickers. */
export const CAST_WHO_GLOSS = [
  WHO_AXIS.rows[0].gloss,
  WHO_AXIS.rows[1].gloss,
  WHO_AXIS.rows[2].gloss,
  WHO_AXIS.rows[3].gloss,
] as const;
export const CAST_HOW_GLOSS = [
  HOW_AXIS.rows[0].gloss,
  HOW_AXIS.rows[1].gloss,
  HOW_AXIS.rows[2].gloss,
  HOW_AXIS.rows[3].gloss,
] as const;
export const CAST_WHAT_GLOSS = [
  WHAT_AXIS.rows[0].gloss,
  WHAT_AXIS.rows[1].gloss,
  WHAT_AXIS.rows[2].gloss,
  WHAT_AXIS.rows[3].gloss,
] as const;
export const CAST_WHEN_GLOSS = [
  WHEN_AXIS.rows[0].gloss,
  WHEN_AXIS.rows[1].gloss,
  WHEN_AXIS.rows[2].gloss,
  WHEN_AXIS.rows[3].gloss,
] as const;

/** One-sentence role descriptions — used in tier-2 hint text. */
export const CAST_WHO_PROFILE = [
  WHO_AXIS.rows[0].profile,
  WHO_AXIS.rows[1].profile,
  WHO_AXIS.rows[2].profile,
  WHO_AXIS.rows[3].profile,
] as const;
export const CAST_HOW_PROFILE = [
  HOW_AXIS.rows[0].profile,
  HOW_AXIS.rows[1].profile,
  HOW_AXIS.rows[2].profile,
  HOW_AXIS.rows[3].profile,
] as const;
export const CAST_WHAT_PROFILE = [
  WHAT_AXIS.rows[0].profile,
  WHAT_AXIS.rows[1].profile,
  WHAT_AXIS.rows[2].profile,
  WHAT_AXIS.rows[3].profile,
] as const;
export const CAST_WHEN_PROFILE = [
  WHEN_AXIS.rows[0].profile,
  WHEN_AXIS.rows[1].profile,
  WHEN_AXIS.rows[2].profile,
  WHEN_AXIS.rows[3].profile,
] as const;

/** Look up a row by axis name + canonical English label. */
export function castRow(axis: CastAxisName, english: string): CastRow | null {
  return CAST_LEXICON[axis].rows.find((row) => row.english === english) ?? null;
}

/** Bits "00".."11" for a given axis + canonical English label, or null if unknown. */
export function castBitsFor(axis: CastAxisName, english: string): CastBits | null {
  return castRow(axis, english)?.bits ?? null;
}
