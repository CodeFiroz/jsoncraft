# JSONCraft — Project Requirements & Development Specification

**Project Name:** JSONCraft  
**Author:** Firoz  
**Project Type:** Online JSON Editor & Viewer  
**Primary Goal:** Build a fast, clean, modern JSON utility tool for editing, formatting, exploring, and analyzing JSON data.

---

# 1. Project Overview

JSONCraft is a modern JSON editor and viewer designed to make working with JSON data simple, efficient, and intuitive.

The application should provide a split-screen workspace where users can paste or edit JSON data on the left and instantly explore the formatted output on the right.

The application should support two different ways of viewing JSON data:

1. **Accordion / Tree View:** Explore JSON objects and arrays through expandable and collapsible structures.
2. **Table View:** Display JSON data in a structured table format for easier inspection, especially when working with arrays of objects.

The application should also provide useful JSON operations such as beautifying, minifying, copying, clearing, and navigating JSON paths.

The overall experience should feel like a professional developer utility rather than a generic online JSON formatter.

# 2. Technology Stack

Use the following technology stack:

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Application framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | Reusable UI components |
| Hugeicons | Icon library |
| CodeMirror 6 | JSON editor with syntax highlighting |
| react-resizable-panels | Resizable split-screen layout |
| TanStack Virtual | Efficient rendering of large datasets |
| Zod | JSON validation and structured validation where needed |

### Recommended supporting libraries

- `@codemirror/lang-json` — JSON syntax highlighting.
- `@codemirror/view` — Editor customisation.
- `@codemirror/commands` — Editor commands.
- `sonner` — Toast notifications.
- `next-themes` — Dark and light theme management.
- `clsx` and `tailwind-merge` — Conditional styling.
- `lucide-react` — Alternative icon library if a required Hugeicons icon is unavailable.

Use native JavaScript JSON operations wherever possible instead of introducing unnecessary dependencies.

# 3. Main Application Layout

The primary application interface should occupy the full available viewport height.

Avoid unnecessary page scrolling. The main workspace should remain within the browser window.

### Desktop Layout

Create a two-panel horizontal workspace:

- Left panel: 40% width.
- Right panel: 60% width.
- Both panels should fill the available vertical space.
- Add a draggable divider between the two panels.
- Users should be able to adjust the panel widths according to their preference.

<DESKTOP_LAYOUT>

LEFT PANEL (40%)          RIGHT PANEL (60%)

JSON EDITOR               JSON VIEWER
-------------------       -------------------
Toolbar                   Viewer Toolbar
-------------------       -------------------
                          Selected JSON Path
JSON Input                -------------------
                          Accordion / Table
Syntax Highlighting       JSON Output
Line Numbers
Code Folding
                          Expand / Collapse
                          Copy Values
                          Path Navigation

</DESKTOP_LAYOUT>

### Resizable Panels

Implement a draggable vertical separator.

Requirements:

- Default split: 40% left and 60% right.
- Minimum left panel width: 25%.
- Minimum right panel width: 30%.
- Smooth resizing without layout flickering.
- Clear visual indicator when hovering over the divider.
- Maintain full-height layout.
- Prevent accidental horizontal overflow.

Use `react-resizable-panels` or its compatible current version.

# 4. Left Panel — JSON Editor

The left panel is the main JSON input workspace.

It should provide a full-height code editor where users can paste or manually write JSON data.

### 4.1 Editor Interface

Use CodeMirror 6 instead of a basic textarea.

The editor must support:

- JSON syntax highlighting.
- Line numbers.
- Code indentation.
- Automatic bracket matching.
- Bracket highlighting.
- Code folding and unfolding.
- Active line highlighting.
- Cursor positioning.
- Proper scrolling.
- Tab indentation.
- Keyboard shortcuts.
- Large JSON input handling.

Use a clean editor appearance with readable typography and consistent spacing.

### 4.2 Editor Toolbar

Create a compact toolbar at the top of the editor.

Include the following actions:

| Action | Function |
|---|---|
| Beautify | Format JSON with proper indentation |
| Minify | Remove unnecessary whitespace |
| Copy | Copy the entire editor content |
| Clear | Remove all editor content |

Additional requirements:

- Use icons with tooltips.
- Show a toast after successful copy operations.
- Disable Beautify and Minify when the input is empty or invalid.
- Ask for confirmation before clearing large amounts of entered data.
- Preserve editor content when switching themes.

### 4.3 JSON Validation

Validate JSON input automatically.

Display useful validation information:

- Valid JSON status.
- Invalid JSON status.
- Error message.
- Error line and column where available.

Do not show a generic error message.

When invalid JSON is entered:

- Preserve the original editor content.
- Show the error clearly.
- Do not destroy the previous valid viewer output unnecessarily.
- Update the viewer only when the current input is valid.

### 4.4 Editor Keyboard Shortcuts

Support common shortcuts:

- Ctrl/Cmd + Shift + F: Beautify.
- Ctrl/Cmd + Shift + M: Minify.
- Ctrl/Cmd + Shift + C: Copy JSON.
- Ctrl/Cmd + A: Select all.

Avoid overriding standard browser and editor shortcuts unnecessarily.

# 5. Right Panel — JSON Viewer

The right panel displays the parsed JSON data in a readable, interactive format.

The viewer should update automatically whenever valid JSON input changes.

Provide two viewing modes:

1. Accordion / Tree View.
2. Table View.

Add a view-switching control in the viewer toolbar.

## 5.1 Viewer Header

The right panel should have a dedicated toolbar.

Include:

- View mode selector.
- Expand All.
- Collapse All.
- Copy JSON.
- Optional search control.
- Current selected JSON path.

Keep the toolbar compact and avoid overcrowding it.

## 5.2 Selected JSON Path

Display the currently selected property's complete JSON path.

Example:

`x[9].slug`

The path should update dynamically when the user selects or interacts with a JSON value.

Display the path in a readable breadcrumb or compact monospace text area.

Include a Copy Path button.

Requirements:

- Copy the exact selected property's path.
- Show a tooltip on hover.
- Display a success notification after copying.
- Handle nested objects and arrays correctly.
- Support array indexes.

Example JSON:

{
  "users": [
    {
      "id": 1,
      "profile": {
        "name": "John",
        "slug": "john-doe"
      }
    }
  ]
}

When the user selects `slug`, display:

`users[0].profile.slug`

The path should always represent the actual selected node, not just the visible label.

## 5.3 Accordion / Tree View

This is the default JSON viewing mode.

Display JSON data using a nested, expandable, and collapsible structure.

Example:

{
  ▼ users: [
      ▼ 0: {
          id: 1,
          name: "John",
          ▼ profile: {
              email: "john@example.com",
              slug: "john-doe"
          }
      }
    ],
  ▼ settings: {
      theme: "dark",
      language: "en"
  }
}

### Tree View Requirements

- Objects should be expandable and collapsible.
- Arrays should be expandable and collapsible.
- Show object and array indicators.
- Clearly distinguish property names and values.
- Display appropriate syntax colours for strings, numbers, booleans, null, and keys.
- Display array indexes.
- Indent nested levels consistently.
- Allow individual nodes to be expanded or collapsed.
- Provide Expand All and Collapse All.
- Allow selecting individual values.
- Highlight the selected property or value.
- Display object and array item counts where useful.

### Value Interaction

When hovering over a JSON value or property row:

- Display a small copy icon.
- Clicking the icon should copy the associated value.
- Clicking a property should select it and update the JSON path.
- Show a tooltip explaining the copy action.
- Avoid displaying copy icons permanently on every row.

Copy operations should support:

- String values.
- Numbers.
- Booleans.
- Null.
- Arrays.
- Objects.

For arrays and objects, copy valid JSON rather than a visual representation.

For strings, copy the raw string value rather than adding quotation marks.

## 5.4 Table View

Provide an alternative Table View for inspecting structured JSON data.

The table should be particularly useful when the JSON contains arrays of objects.

Example input:

[
  {
    "id": 1,
    "name": "John",
    "email": "john@example.com",
    "status": true
  },
  {
    "id": 2,
    "name": "David",
    "email": "david@example.com",
    "status": false
  }
]

Expected table:

| id | name | email | status |
|---|---|---|---|
| 1 | John | john@example.com | true |
| 2 | David | david@example.com | false |

### Table Requirements

- Generate columns dynamically from object properties.
- Display array items as rows.
- Support nested objects through expandable cells or nested value previews.
- Handle missing properties gracefully.
- Display strings, numbers, booleans, and null appropriately.
- Allow horizontal scrolling when there are many columns.
- Use sticky headers where appropriate.
- Provide a copy icon on cell hover.
- Allow selecting a cell to update the selected JSON path.
- Support copying individual cell values.

For nested arrays or objects, provide a way to inspect the underlying value without breaking the table layout.

### Table View Edge Cases

Handle:

- Empty arrays.
- Arrays containing primitive values.
- Arrays containing objects with different properties.
- Nested arrays.
- Nested objects.
- Null values.
- Large datasets.

For JSON structures that cannot be represented naturally as a table, provide a sensible fallback or nested inspection interface instead of displaying a broken table.

# 6. Theme System

Provide a theme selector with three options:

- Light.
- Dark.
- System.

Use `next-themes` for theme management.

### Light Theme

- White or near-white background.
- Dark text.
- Light grey borders.
- Subtle shadows.
- Blue accent for primary actions and selected states.

### Dark Theme

- Deep charcoal or near-black backgrounds.
- Light text.
- Subtle dark-grey borders.
- Muted secondary text.
- Consistent blue accent.

### Design Colour Direction

Follow a predominantly monochromatic design system.

- 90% black, white, and neutral grey.
- 10% blue accent colour.

Avoid unnecessary colourful backgrounds.

Use colour primarily for:

- Primary buttons.
- Active states.
- Focus indicators.
- Links.
- Selected elements.
- JSON syntax highlighting.

# 7. Visual Design Guidelines

The application must look like a professionally designed SaaS developer tool.

### Design Principles

- Clean and minimal interface.
- Strong typography hierarchy.
- Excellent readability.
- Consistent spacing.
- Subtle borders.
- Restrained shadows.
- Balanced rounded corners.
- Clear interaction states.
- Minimal visual distractions.

### Component Styling

Use shadcn/ui components wherever appropriate.

Recommended components:

- Button.
- Tooltip.
- Dropdown Menu.
- Select.
- Tabs or Segmented Controls.
- Separator.
- Scroll Area.
- Dialog.
- Command.
- Toast / Sonner.

### Typography

Use a modern, readable font.

Suggested:

- Inter or Geist for the interface.
- JetBrains Mono for JSON data and paths.

Use monospace typography for:

- JSON editor.
- JSON viewer values.
- JSON paths.
- Technical information.

### Avoid

- Unnecessary gradients.
- Glassmorphism.
- Excessive shadows.
- Excessively rounded cards.
- Oversized headings.
- Unnecessary dashboard cards.
- Decorative illustrations.
- Emoji icons.
- Excessive accent colours.
- Generic AI-generated dashboard aesthetics.

The interface should prioritise usability and functionality over decoration.

# 8. Responsive Design

The desktop experience is the primary focus, but the application must also work on tablets and mobile devices.

### Desktop

- Side-by-side split-screen layout.
- Adjustable panel widths.
- Full-height editor and viewer.

### Tablet

- Preserve the split-screen layout when sufficient space is available.
- Reduce toolbar spacing and typography where appropriate.
- Maintain usable panel widths.

### Mobile

- Switch to a single-panel layout.
- Provide Editor and Viewer tabs.
- Allow users to switch between the two workspaces.
- Maintain all core functionality.
- Ensure toolbars remain accessible.
- Prevent horizontal page overflow.

# 9. Performance & Optimisation

JSONCraft should remain responsive when processing large JSON documents.

Important requirements:

- Avoid unnecessary component re-renders.
- Use memoisation where beneficial.
- Avoid parsing JSON repeatedly when the input has not changed.
- Debounce expensive validation and viewer updates appropriately.
- Keep editor input responsive.
- Use efficient tree rendering.
- Consider virtualisation for large arrays and tables.
- Avoid rendering every nested node unnecessarily.
- Keep JSON processing on the client side.
- Avoid unnecessary API requests.
- Use lazy loading for non-essential components.

The application should not send user JSON data to an external server.

All JSON processing should happen locally in the browser.

# 10. Suggested Component Architecture

Organise the application into reusable components.

Suggested folder structure:

```text
jsoncraft/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── app-header.tsx
│   │   ├── workspace.tsx
│   │   ├── editor-panel.tsx
│   │   └── viewer-panel.tsx
│   │
│   ├── editor/
│   │   ├── json-editor.tsx
│   │   ├── editor-toolbar.tsx
│   │   ├── editor-status.tsx
│   │   └── json-error.tsx
│   │
│   ├── viewer/
│   │   ├── json-viewer.tsx
│   │   ├── viewer-toolbar.tsx
│   │   ├── json-tree.tsx
│   │   ├── json-tree-node.tsx
│   │   ├── json-table.tsx
│   │   ├── json-table-cell.tsx
│   │   └── json-path-bar.tsx
│   │
│   ├── shared/
│   │   ├── copy-button.tsx
│   │   ├── theme-toggle.tsx
│   │   └── empty-state.tsx
│   │
│   └── ui/
│       └── shadcn-components/
│
├── hooks/
│   ├── use-json-parser.ts
│   ├── use-json-editor.ts
│   └── use-json-selection.ts
│
├── lib/
│   ├── json/
│   │   ├── parser.ts
│   │   ├── formatter.ts
│   │   ├── minifier.ts
│   │   ├── validator.ts
│   │   ├── path-utils.ts
│   │   └── clipboard.ts
│   │
│   └── utils.ts
│
├── types/
│   └── json.ts
│
└── public/
```

The folder structure can be adjusted when necessary, but maintain clear separation between UI, JSON processing, reusable hooks, and application logic.

# 11. Core Functional Requirements

The first version should focus on the following features.

| Feature | Priority |
|---|---|
| JSON input editor | Essential |
| Syntax highlighting | Essential |
| Line numbers | Essential |
| Code folding | Essential |
| JSON validation | Essential |
| Beautify JSON | Essential |
| Minify JSON | Essential |
| Copy JSON | Essential |
| Clear editor | Essential |
| Accordion / Tree View | Essential |
| Table View | Essential |
| Expand / Collapse | Essential |
| Selected JSON path | Essential |
| Copy JSON path | Essential |
| Copy individual values | Essential |
| Dark / Light theme | Essential |
| Adjustable panel widths | Essential |
| Responsive interface | Essential |
| Large JSON optimisation | Essential |
| JSON search | Recommended |

# 12. Important Functional Behaviour

Follow these rules throughout implementation:

1. The application should work immediately without requiring user authentication.
2. Users should be able to paste JSON and start working instantly.
3. The editor and viewer should stay synchronised.
4. Invalid JSON must never crash the application.
5. The previous valid viewer state should remain available while invalid input is being corrected.
6. Copy actions must work for every supported JSON data type.
7. Selected paths must correctly represent nested objects and array indexes.
8. Switching between Accordion and Table View must not reset the JSON input.
9. Switching themes must not affect editor content.
10. Resizing panels must not interrupt editor functionality.
11. Do not send user JSON data to a backend.
12. All core operations should work without an internet connection after the application has loaded.

# 13. Development Approach

Develop JSONCraft in structured phases.

### Phase 1 — Application Foundation

- Initialise Next.js with TypeScript.
- Configure Tailwind CSS.
- Install and configure shadcn/ui.
- Configure Hugeicons.
- Implement theme management.
- Build the main responsive workspace.
- Implement draggable split panels.

### Phase 2 — JSON Editor

- Integrate CodeMirror 6.
- Configure JSON syntax highlighting.
- Add line numbers and code folding.
- Implement Beautify, Minify, Copy, and Clear.
- Implement JSON validation and error handling.

### Phase 3 — JSON Viewer

- Implement Accordion / Tree View.
- Add expandable and collapsible nodes.
- Implement value selection.
- Implement JSON path generation.
- Add Copy Value and Copy Path actions.

### Phase 4 — Table View

- Implement dynamic table generation.
- Add dynamic columns and rows.
- Support nested values.
- Implement cell selection and copying.
- Handle different JSON structures and edge cases.

### Phase 5 — Performance & Quality

- Optimise large JSON rendering.
- Add virtualisation where necessary.
- Test responsive layouts.
- Test clipboard functionality.
- Test keyboard shortcuts.
- Test dark and light themes.
- Fix accessibility and interaction issues.

# 14. Final Design & Development Expectations

The final application should be a polished, production-quality JSON utility.

Prioritise:

1. Functionality over decoration.
2. Speed over unnecessary animations.
3. Readability over visual complexity.
4. Reusable components over duplicated code.
5. Maintainable architecture over shortcuts.
6. Efficient rendering over unnecessary dependencies.

Use modern Next.js and React best practices.

Write clean, modular, strongly typed TypeScript.

Avoid unnecessary dependencies and over-engineering.

Do not build a generic admin dashboard. Build a focused, professional JSON workspace.

**Final Objective:** JSONCraft should make editing, formatting, exploring, and understanding complex JSON data effortless through a fast, intuitive, split-screen developer workspace.