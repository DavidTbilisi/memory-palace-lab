# Palace DSL VS Code Extension

Local VS Code extension for Memory Palace DSL files.

## Features

- Registers `.dsl` as `palace-dsl`
- Runs parser-backed diagnostics using the app's existing DSL parser
- Adds basic syntax highlighting for headers, nodes, routes, tags, edges, portals, content, comments, and route loci
- Adds quick fixes for missing headers, misplaced indentation, tag normalization, and route-number normalization
- Adds a file-wide `Fix all auto-fixable Palace DSL issues` source action
  When those repairs make the file parse-clean, the action also rewrites the file through the canonical DSL serializer.
- Adds completions for DSL keywords, node-title references, route loci, portal prefixes, and CAST tokens
- Adds `Format Document` support using the app's canonical DSL serializer

## Development

Build the extension bundle:

```bash
npm run build
```

Watch during development:

```bash
npm run watch
```

Then open this folder in VS Code and run the extension host from the `palace-dsl-vscode` package.

## Install In VS Code

### Run locally in an Extension Development Host

1. Open the `extensions/palace-dsl-vscode` folder in VS Code.
2. Build the extension:

```bash
npm run build
```

3. Press `F5`.

This launches a separate Extension Development Host window with the extension loaded.

### Install as a VSIX

1. Install `vsce` if needed:

```bash
npm install -g @vscode/vsce
```

2. From `extensions/palace-dsl-vscode`, create a package:

```bash
npm run package
```

From the repo root, use:

```bash
npm run package:palace-dsl-vscode
```

3. In VS Code, open the Extensions panel.
4. Open the `...` menu.
5. Choose `Install from VSIX...`.
6. Select the generated `.vsix` file.

## Notes

The extension intentionally reuses `src/domain/services/palaceDsl/parser.ts` from the main app so diagnostics stay aligned with the editor behavior in Memory Palace Lab.
