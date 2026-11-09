"use client";

import * as React from "react";
import { FileJson, Sparkles, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onLoadSample: () => void;
  onPasteClipboard?: () => void;
  title?: string;
  description?: string;
}

export function EmptyState({
  onLoadSample,
  onPasteClipboard,
  title = "No JSON Data",
  description = "Paste or type JSON in the editor on the left, or load an example to get started.",
}: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 border border-border text-muted-foreground shadow-xs mb-4">
        <FileJson className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onLoadSample}
          className="gap-1.5 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          Load Sample JSON
        </Button>
        {onPasteClipboard && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onPasteClipboard}
            className="gap-1.5 text-xs"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            Paste from Clipboard
          </Button>
        )}
      </div>
    </div>
  );
}

