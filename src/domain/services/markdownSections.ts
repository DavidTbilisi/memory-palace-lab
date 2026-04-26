export type MarkdownSection = {
  id: string;
  label: string;
  title: string;
  content: string;
};

function stripInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function labelFromHeading(heading: string) {
  const emphasizedParenthetical = heading.match(/\(\*\*([^*]+)\*\*\)/);
  const source = emphasizedParenthetical?.[1] ?? heading;
  return stripInlineMarkdown(source)
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .split(/[:\-]/)[0]
    .trim();
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

export function splitMarkdownSections(markdown: string): MarkdownSection[] {
  const lines = markdown.trim().split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let currentTitle = "Overview";
  let currentLabel = "Overview";
  let currentLines: string[] = [];

  const pushCurrent = () => {
    const content = currentLines.join("\n").trim();
    if (!content) return;
    sections.push({
      id: slugify(currentLabel),
      label: currentLabel,
      title: stripInlineMarkdown(currentTitle),
      content,
    });
  };

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      pushCurrent();
      currentTitle = heading[1].trim();
      currentLabel = labelFromHeading(currentTitle);
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }

  pushCurrent();

  return sections.length > 0
    ? sections
    : [
        {
          id: "overview",
          label: "Overview",
          title: "Overview",
          content: markdown.trim(),
        },
      ];
}
