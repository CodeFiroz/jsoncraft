"use client";

import * as React from "react";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { JsonEditor } from "@/components/editor/json-editor";
import { EditorStatus } from "@/components/editor/editor-status";
import { JsonErrorBanner } from "@/components/editor/json-error";
import { JsonParseResult } from "@/types/json";
import { beautifyJson } from "@/lib/json/formatter";
import { minifyJson } from "@/lib/json/minifier";
import { copyToClipboard } from "@/lib/json/clipboard";
import { toast } from "sonner";
import { foldAll, unfoldAll } from "@codemirror/language";

interface EditorPanelProps {
  content: string;
  onChange: (val: string) => void;
  parseResult: JsonParseResult;
  onLoadSample: (sampleData: any) => void;
}

export function EditorPanel({
  content,
  onChange,
  parseResult,
  onLoadSample,
}: EditorPanelProps) {
  const editorRef = React.useRef<ReactCodeMirrorRef | null>(null);

  const handleBeautify = () => {
    const res = beautifyJson(content);
    if (res.success) {
      onChange(res.formatted);
      toast.success("JSON formatted");
    } else {
      toast.error("Cannot beautify invalid JSON");
    }
  };

  const handleMinify = () => {
    const res = minifyJson(content);
    if (res.success) {
      onChange(res.minified);
      toast.success("JSON minified");
    } else {
      toast.error("Cannot minify invalid JSON");
    }
  };

  const handleFoldAll = () => {
    const view = editorRef.current?.view;
    if (!view) return;
    foldAll(view);
  };

  const handleUnfoldAll = () => {
    const view = editorRef.current?.view;
    if (!view) return;
    unfoldAll(view);
  };

  const handleClear = () => {
    onChange("");
  };

  const handleCopy = () => {
    if (!content.trim()) return;
    copyToClipboard(content, { label: "JSON copied to clipboard" });
  };

  const handleFileUpload = (text: string) => {
    onChange(text);
  };

  const handleGoToLine = (line: number, column?: number) => {
    const view = editorRef.current?.view;
    if (!view) return;
    try {
      const linePos = view.state.doc.line(line);
      const targetPos = Math.min(
        linePos.from + (column ? column - 1 : 0),
        linePos.to
      );
      view.dispatch({
        selection: { anchor: targetPos, head: targetPos },
        scrollIntoView: true,
      });
      view.focus();
    } catch {
      // Ignored if line number out of range
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden border-r border-border/80">
      <EditorToolbar
        content={content}
        isValid={parseResult.isValid}
        onBeautify={handleBeautify}
        onMinify={handleMinify}
        onFoldAll={handleFoldAll}
        onUnfoldAll={handleUnfoldAll}
        onClear={handleClear}
        onLoadSample={onLoadSample}
        onFileUpload={handleFileUpload}
      />

      <div className="relative flex-1 overflow-hidden">
        <JsonEditor
          value={content}
          onChange={onChange}
          onBeautify={handleBeautify}
          onMinify={handleMinify}
          onCopy={handleCopy}
          editorRef={editorRef}
        />
      </div>

      {!parseResult.isValid && parseResult.error && (
        <JsonErrorBanner
          error={parseResult.error}
          onGoToLine={handleGoToLine}
        />
      )}

      <EditorStatus
        isValid={parseResult.isValid}
        isEmpty={!content.trim()}
        stats={parseResult.stats}
        error={parseResult.error}
      />
    </div>
  );
}

