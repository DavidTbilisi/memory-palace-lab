export type ImportedNodeDraft = {
  title: string;
  content: string;
};

export type ImportParseResult = {
  rows: ImportedNodeDraft[];
  error: string | null;
};

function normalizeLineBreaks(input: string) {
  return input.replace(/\r\n?/g, "\n");
}

export function parseMarkdownNodeImport(input: string): ImportParseResult {
  const rows: ImportedNodeDraft[] = [];
  const lines = normalizeLineBreaks(input).split("\n");

  for (const rawLine of lines) {
    const match = rawLine.match(/^\s*[-*]\s+(.+)$/);
    if (!match) continue;
    const value = match[1]?.trim();
    if (!value) continue;
    rows.push({
      title: value,
      content: "",
    });
  }

  return {
    rows,
    error: null,
  };
}

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  const source = normalizeLineBreaks(input);

  let currentCell = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const ch = source[index];

    if (ch === '"') {
      if (inQuotes && source[index + 1] === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
      continue;
    }

    if (ch === "\n" && !inQuotes) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += ch;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

export function parseCsvNodeImport(input: string): ImportParseResult {
  if (!input.trim()) {
    return { rows: [], error: null };
  }

  const rows = parseCsvRows(input);
  if (rows.length === 0) {
    return { rows: [], error: null };
  }

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const titleIndex = header.indexOf("title");
  const contentIndex = header.indexOf("content");

  if (titleIndex < 0 || contentIndex < 0) {
    return {
      rows: [],
      error: "CSV must include a header row with title and content columns.",
    };
  }

  const parsed: ImportedNodeDraft[] = [];
  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index] ?? [];
    const title = (row[titleIndex] ?? "").trim();
    const content = (row[contentIndex] ?? "").trim();
    if (!title && !content) continue;
    parsed.push({
      title: title || `Imported node ${parsed.length + 1}`,
      content,
    });
  }

  return {
    rows: parsed,
    error: null,
  };
}
