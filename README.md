# JSONCraft — Online JSON Editor & Viewer

> A fast, clean, modern JSON utility tool for editing, formatting, exploring, and analyzing JSON data.

Built according to the [JSONCraft Specification](file:///z:/firoz/JSONCraft/plan.md).

---

## ✨ Features

- **Split-Screen Workspace:**
  - 40% JSON Editor / 60% JSON Viewer default layout with draggable resizable divider.
  - Full-height desktop workspace (`h-screen overflow-hidden`) with mobile tab-switching support.
- **Advanced CodeMirror 6 Editor:**
  - JSON syntax highlighting, line numbers, code folding, bracket matching & active line highlighting.
  - Keyboard shortcuts: `Ctrl+Shift+F` (Beautify), `Ctrl+Shift+M` (Minify), `Ctrl+Shift+C` (Copy), `Ctrl+A` (Select All).
  - Actions: Beautify, Minify, Copy with toast, Clear with confirmation modal, File Upload, File Download.
  - Live validation with line & column error detection and "Jump to line" capability.
  - Preserves prior valid viewer state while correcting syntax errors.
- **Dual-Mode Interactive Viewer:**
  - **Accordion / Tree View:** Expandable and collapsible objects & arrays, item count badges, syntax coloring, row-hover quick copy, and real-time search match highlighting.
  - **Table View:** Dynamic column generation for arrays of objects with column sorting, row index `#`, single-object key/value table view, array of primitives view, cell-hover copying, and nested object/array inspector dialogs.
- **Dynamic JSON Path Navigation:**
  - Complete accessor path generation (e.g. `users[0].profile.slug`, `[1].price`).
  - Interactive breadcrumb bar with one-click **Copy Path** button.
- **Preset Sample Datasets:**
  - Built-in presets: *Users & Profiles*, *Products Catalog (Table-friendly)*, and *Project Configuration*.
- **Monochromatic Professional Theme System:**
  - Light, Dark, and System modes powered by `next-themes`.
  - 90% neutral slate/zinc monochromatic palette with 10% blue accent.
- **Client-Side Security:**
  - 100% in-browser processing. No user JSON is transmitted to any external backend.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **Next.js (App Router)** | Application framework |
| **TypeScript** | Static type safety |
| **Tailwind CSS v4** | Modern styling and responsive layout |
| **CodeMirror 6** | Code editor with `@codemirror/lang-json` & `@uiw/react-codemirror` |
| **react-resizable-panels** | Draggable split-screen panels |
| **next-themes** | Dark, Light, and System theme switching |
| **sonner** | Notification toasts |
| **Lucide Icons** | Minimalist UI icons |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested with Node v24)
- pnpm / npm / yarn / bun

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm run build
pnpm run start
```

---

## 👨‍💻 Author

- **Firoz** ([@CodeFiroz](https://github.com/CodeFiroz))
- GitHub Repository: [https://github.com/CodeFiroz](https://github.com/CodeFiroz)

