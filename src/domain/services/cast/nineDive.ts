/**
 * Sloan's nine-dive question drill, grouped by Mezirow's three layers of
 * reflection (Neural-OS-Research `wiki/problem-solving/nine-dive-question-drill.md`
 * and `content-process-premise-reflection.md`).
 *
 * Content (what) is surface; process (how) bridges; premise (why) is the deep
 * dive where frame-shift happens. Comprehend mode runs these against the crux
 * when "I don't fully get this" turns into a structured interrogation.
 */
export type ReflectionLayer = "content" | "process" | "premise";

export type DiveLayer = {
  layer: ReflectionLayer;
  label: string;
  focus: string;
  questions: string[];
};

export const NINE_DIVE: DiveLayer[] = [
  {
    layer: "content",
    label: "Content",
    focus: "what",
    questions: ["Why does this hold?", "Why not the opposite?", "What else connects here?"],
  },
  {
    layer: "process",
    label: "Process",
    focus: "how",
    questions: ["Where else does this pattern show?", "When else would it fire?", "How else could it be done?"],
  },
  {
    layer: "premise",
    label: "Premise",
    focus: "why",
    questions: ["Whose frame is this?", "What other frames exist?", "What frame is missing?"],
  },
];
