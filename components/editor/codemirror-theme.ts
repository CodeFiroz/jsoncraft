import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

export const lightThemeExtension: Extension = EditorView.theme(
  {
    "&": {
      color: "#18181b",
      backgroundColor: "#ffffff",
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#2563eb",
      fontFamily: 'var(--font-mono, "Geist Mono", "JetBrains Mono", monospace)',
      fontSize: "13.5px",
      padding: "8px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#2563eb",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(37, 99, 235, 0.15) !important",
    },
    ".cm-gutters": {
      backgroundColor: "#fafafa",
      color: "#a1a1aa",
      borderRight: "1px solid #e4e4e7",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(244, 244, 245, 0.75)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#f4f4f5",
      color: "#18181b",
      fontWeight: "500",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#f4f4f5",
      border: "1px solid #e4e4e7",
      color: "#71717a",
      borderRadius: "3px",
      padding: "0 4px",
      margin: "0 2px",
    },
    ".cm-line": {
      padding: "0 8px",
    },
  },
  { dark: false }
);

export const darkThemeExtension: Extension = EditorView.theme(
  {
    "&": {
      color: "#f4f4f5",
      backgroundColor: "#09090b",
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#3b82f6",
      fontFamily: 'var(--font-mono, "Geist Mono", "JetBrains Mono", monospace)',
      fontSize: "13.5px",
      padding: "8px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#3b82f6",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(59, 130, 246, 0.25) !important",
    },
    ".cm-gutters": {
      backgroundColor: "#0d0d10",
      color: "#52525b",
      borderRight: "1px solid #27272a",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#18181b",
      color: "#fafafa",
      fontWeight: "500",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#18181b",
      border: "1px solid #27272a",
      color: "#a1a1aa",
      borderRadius: "3px",
      padding: "0 4px",
      margin: "0 2px",
    },
    ".cm-line": {
      padding: "0 8px",
    },
  },
  { dark: true }
);

