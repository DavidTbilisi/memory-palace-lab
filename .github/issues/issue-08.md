## User Story

As a palace builder,
I want to write rich content in node notes — with bold text, bullet points, and inline images,
So that my encoding cues and mnemonics are clearly structured inside each node.

## Background

The node Content field is currently a plain textarea. Given the app already uses tldraw's richText system for node labels, the inspector's content area should support structured formatting. Plain text is insufficient for vivid encoding notes.

## BDD Scenarios

### Scenario 1: Content field renders a rich text editor
```gherkin
Given I select a memory node
When the NodeInspector renders
Then the Content field shows a mini rich-text editor (not a plain textarea)
And a small toolbar appears with: Bold, Italic, Bullet list, Numbered list
```

### Scenario 2: Bold formatting applied with keyboard shortcut
```gherkin
Given I am typing in the Content editor
When I select text and press Ctrl+B
Then the selected text is rendered in bold
```

### Scenario 3: Bullet list created with Markdown shorthand
```gherkin
Given I am in the Content editor
When I type "- " at the start of a line
Then a bullet list item is created automatically
```

### Scenario 4: Rich content persists on save
```gherkin
Given I have written bold and bulleted content in a node
When I blur the editor (auto-save) and reopen the palace
Then the node content loads with its formatting intact
```

### Scenario 5: Inline image can be pasted into content
```gherkin
Given I copy an image to clipboard
When I paste into the Content editor
Then the image is embedded inline in the content area
And it is stored as a data URL or asset reference
```

## Acceptance Criteria
- [ ] Content field replaced with a Tiptap (or equivalent) rich text editor
- [ ] Supported formats: bold, italic, underline, bullet list, numbered list
- [ ] Markdown shorthands work as shortcuts
- [ ] Content serialised as HTML or JSON and persisted in mpContent meta field
- [ ] Editor auto-saves on blur (aligned with auto-apply issue)
- [ ] Paste image support (stretch goal)
