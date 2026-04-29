const KEYWORD_SNIPPETS = [
  { label: "@", detail: "Palace header", insertText: "@${1:PalaceName}" },
  { label: "Node", detail: "Node title", insertText: "${1:NodeName}" },
  { label: "/", detail: "Route", insertText: "/${1:Main}" },
  { label: ":", detail: "Body", insertText: ": ${1:Description}" },
  { label: "#", detail: "Tags", insertText: "#${1:tag}" },
  { label: ">", detail: "Edge", insertText: ">${1:Target} ${2:0000}" },
];

function isDslDocument(document: vscode.TextDocument) {
  return (
    document.languageId === LANGUAGE_ID ||
    document.fileName.toLowerCase().endsWith(".palace")
  );
}

function keywordSnippetsForContext(
  document: vscode.TextDocument,
  position: vscode.Position,
): vscode.CompletionItem[] {
  const blockContext = currentBlockContext(document, position);
  const snippets: vscode.CompletionItem[] = [];

  if (blockContext === "node") {
    for (const snippet of KEYWORD_SNIPPETS.filter((entry) =>
      [":", "#", ">"].includes(entry.label),
    )) {
      snippets.push(
        snippetCompletionItem(
          snippet.label,
          snippet.detail,
          snippet.insertText,
        ),
      );
    }

    return snippets;
  }

  if (blockContext === "route") {
    const nextIndex = nextRouteIndex(document, position);

    snippets.push(
      snippetCompletionItem(
        `${nextIndex}`,
        "Route step",
        `${nextIndex} \${1:Node}`,
      ),
    );

    return snippets;
  }

  for (const snippet of KEYWORD_SNIPPETS.filter((entry) =>
    ["@", "Node", "/"].includes(entry.label),
  )) {
    snippets.push(
      snippetCompletionItem(
        snippet.label,
        snippet.detail,
        snippet.insertText,
      ),
    );
  }

  return snippets;
}

function isNodeHeaderLine(trimmed: string) {
  if (
    trimmed.startsWith("@") ||
    trimmed.startsWith(":") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith(">") ||
    trimmed.startsWith("/") ||
    /^\d+\s+/.test(trimmed)
  ) {
    return false;
  }

  return trimmed.length > 0;
}

function currentBlockContext(
  document: vscode.TextDocument,
  position: vscode.Position,
): "node" | "route" | null {
  for (let lineNumber = position.line; lineNumber >= 0; lineNumber -= 1) {
    const text = document.lineAt(lineNumber).text.trim();

    if (text === "" || text.startsWith("--")) continue;

    if (text.startsWith("/")) return "route";

    if (isNodeHeaderLine(text)) return "node";

    if (text.startsWith("@")) return null;
  }

  return null;
}

function nextRouteIndex(
  document: vscode.TextDocument,
  position: vscode.Position,
) {
  let maxIndex = 0;

  for (let lineNumber = position.line - 1; lineNumber >= 0; lineNumber -= 1) {
    const text = document.lineAt(lineNumber).text.trim();

    if (text === "" || text.startsWith("--")) continue;

    if (text.startsWith("/")) break;

    const match = text.match(/^(\d+)\s+/);

    if (match) {
      maxIndex = Math.max(maxIndex, Number.parseInt(match[1]!, 10));
    }
  }

  return maxIndex + 1;
}

function normalizedRouteLocusLine(lineText: string): string | null {
  const match = lineText.match(/^(\s*)0*(\d+)(\s+.*)$/);

  if (!match) return null;

  return `${match[1]!}${Number.parseInt(match[2]!, 10)}${match[3]!}`;
}

function castCompletionItems() {
  const compact = [
    "0000",
    "0001",
    "0010",
    "0011",
    "0100",
    "0101",
    "0110",
    "0111",
    "1000",
    "1001",
    "1010",
    "1110",
  ];

  return compact.map((token) => {
    const item = new vscode.CompletionItem(
      token,
      vscode.CompletionItemKind.Value,
    );

    item.detail = "CAST token";

    return item;
  });
}