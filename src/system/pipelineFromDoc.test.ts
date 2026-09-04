import { describe, expect, it } from "vitest";
import { MAX_DOC_PIPELINE_STEPS, buildPipelineTemplateFromDoc, firstParagraph, isDocPipelineId } from "./pipelineFromDoc";

const BODY = [
  "**Summary**: The opening summary line.",
  "",
  "## Narrow",
  "",
  "Pick one bounded question with a [link](./x.md) and *emphasis*.",
  "",
  "More text.",
  "",
  "## Related",
  "",
  "- [Other](./other.md)",
  "",
  "## Phases",
  "",
  "```",
  "code first",
  "```",
  "",
  "Nine phases in order.",
].join("\n");

describe("buildPipelineTemplateFromDoc", () => {
  it("makes one step per section, skipping housekeeping sections, with required fields filled", () => {
    const template = buildPipelineTemplateFromDoc({ slug: "navigator", title: "NAVIGATOR", summary: "A loop.", body: BODY });
    expect(template.id).toBe("doc:navigator");
    expect(isDocPipelineId(template.id)).toBe(true);
    expect(template.category).toBe("Document");
    expect(template.docsSlug).toBe("navigator");
    expect(template.routeName).toBe("NAVIGATOR walk");
    expect(template.steps.map((step) => step.title)).toEqual(["Overview", "Narrow", "Phases"]);
    expect(template.steps[1]).toMatchObject({
      code: "02",
      prompt: "Pick one bounded question with a link and emphasis.",
      placeholder: "Notes on Narrow",
    });
    expect(template.steps[2].prompt).toBe("Nine phases in order.");
    for (const step of template.steps) {
      expect(step.id.length).toBeGreaterThan(0);
      expect(step.hint).toContain("NAVIGATOR");
    }
    expect(new Set(template.steps.map((step) => step.id)).size).toBe(template.steps.length);
  });

  it("caps the number of steps and falls back to a single step for flat documents", () => {
    const long = Array.from({ length: 20 }, (_, index) => `## S${index + 1}\n\nText for section ${index + 1}.`).join("\n\n");
    expect(buildPipelineTemplateFromDoc({ slug: "long", title: "Long", summary: "", body: long }).steps).toHaveLength(
      MAX_DOC_PIPELINE_STEPS,
    );
    const flat = buildPipelineTemplateFromDoc({ slug: "flat", title: "Flat doc", summary: "", body: "Just one paragraph here." });
    expect(flat.steps).toHaveLength(1);
    expect(flat.summary).toContain("Flat doc");
  });

  it("extracts a clean first paragraph and trims long ones", () => {
    expect(firstParagraph("| table |\n\n- **Bold** item\n- second")).toBe("Bold item second");
    expect(firstParagraph("x".repeat(400)).length).toBeLessThanOrEqual(280);
    expect(firstParagraph("")).toBe("");
  });
});
