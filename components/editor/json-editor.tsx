"use client";

import * as React from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useTheme } from "next-themes";
import { lightThemeExtension, darkThemeExtension } from "./codemirror-theme";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";

interface JsonEditorProps {
  value: string;
  onChange: (val: string) => void;
  onBeautify?: () => void;
  onMinify?: () => void;
  onCopy?: () => void;
  editorRef?: React.MutableRefObject<ReactCodeMirrorRef | null>;
}

export function JsonEditor({
  value,
  onChange,
  onBeautify,
  onMinify,
  onCopy,
  editorRef,
}: JsonEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const localRef = React.useRef<ReactCodeMirrorRef | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  // Custom keyboard shortcuts
  const customKeymaps = React.useMemo(() => {
    return keymap.of([
      indentWithTab,
      {
        key: "Mod-Shift-f",
        run: () => {
          if (onBeautify) onBeautify();
          return true;
        },
      },
      {
        key: "Mod-Shift-m",
        run: () => {
          if (onMinify) onMinify();
          return true;
        },
      },
      {
        key: "Mod-Shift-c",
        run: () => {
          if (onCopy) onCopy();
          return true;
        },
      },
      ...defaultKeymap,
    ]);
  }, [onBeautify, onMinify, onCopy]);

  const extensions = React.useMemo(() => {
    return [
      json(),
      bracketMatching(),
      foldGutter(),
      customKeymaps,
      keymap.of(foldKeymap),
      EditorView.lineWrapping,
      isDark ? darkThemeExtension : lightThemeExtension,
    ];
  }, [isDark, customKeymaps]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <CodeMirror
        ref={(ref) => {
          localRef.current = ref;
          if (editorRef) {
            editorRef.current = ref;
          }
        }}
        value={value}
        height="100%"
        extensions={extensions}
        onChange={onChange}
        theme={isDark ? "dark" : "light"}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: false,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        className="h-full w-full text-[13px]"
      />
    </div>
  );
}

