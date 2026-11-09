"use client";

import * as React from "react";
import {
  Sparkles,
  Minimize2,
  Copy,
  Trash2,
  Upload,
  Download,
  FolderOpen,
  Check,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { SAMPLE_JSONS } from "@/lib/json/samples";
import { copyToClipboard } from "@/lib/json/clipboard";
import { toast } from "sonner";

interface EditorToolbarProps {
  content: string;
  isValid: boolean;
  onBeautify: () => void;
  onMinify: () => void;
  onFoldAll?: () => void;
  onUnfoldAll?: () => void;
  onClear: () => void;
  onLoadSample: (sampleData: any) => void;
  onFileUpload: (text: string) => void;
}

export function EditorToolbar({
  content,
  isValid,
  onBeautify,
  onMinify,
  onFoldAll,
  onUnfoldAll,
  onClear,
  onLoadSample,
  onFileUpload,
}: EditorToolbarProps) {
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [showSampleMenu, setShowSampleMenu] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const sampleMenuRef = React.useRef<HTMLDivElement>(null);

  const isEmpty = !content.trim();

  // Close sample menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sampleMenuRef.current &&
        !sampleMenuRef.current.contains(e.target as Node)
      ) {
        setShowSampleMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (isEmpty) return;
    const ok = await copyToClipboard(content, {
      label: "Editor content copied",
    });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClearClick = () => {
    if (isEmpty) return;
    // If text has more than 150 characters, ask for confirmation
    if (content.trim().length > 150) {
      setShowClearDialog(true);
    } else {
      onClear();
      toast.info("Editor cleared");
    }
  };

  const confirmClear = () => {
    onClear();
    setShowClearDialog(false);
    toast.info("Editor cleared");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text !== undefined) {
        onFileUpload(text);
        toast.success(`Loaded "${file.name}"`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDownload = () => {
    if (isEmpty) return;
    try {
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("JSON downloaded");
    } catch {
      toast.error("Failed to download file");
    }
  };

  return (
    <>
      <div className="flex h-10 items-center justify-between border-b border-border bg-muted/20 px-3 select-none">
        {/* Left side actions: Beautify, Minify, Samples */}
        <div className="flex items-center gap-1">
          <Tooltip content="Beautify JSON (Ctrl+Shift+F)">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isEmpty || !isValid}
              onClick={onBeautify}
              className="gap-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>Beautify</span>
            </Button>
          </Tooltip>

          <Tooltip content="Minify JSON (Ctrl+Shift+M)">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isEmpty || !isValid}
              onClick={onMinify}
              className="gap-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted"
            >
              <Minimize2 className="h-3.5 w-3.5 text-neutral-500" />
              <span>Minify</span>
            </Button>
          </Tooltip>

          <div className="h-4 w-px bg-border/60 mx-0.5" />

          <Tooltip content="Expand All (Unfold Code)">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isEmpty || !isValid}
              onClick={onUnfoldAll}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>

          <Tooltip content="Collapse All (Fold Code)">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isEmpty || !isValid}
              onClick={onFoldAll}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <ChevronsDownUp className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>

          <div className="h-4 w-px bg-border/60 mx-0.5" />

          {/* Sample loader dropdown */}
          <div className="relative" ref={sampleMenuRef}>
            <Tooltip content="Load sample JSON dataset">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSampleMenu(!showSampleMenu)}
                className="gap-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted"
              >
                <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
                <span>Samples</span>
              </Button>
            </Tooltip>

            {showSampleMenu && (
              <div className="absolute left-0 top-full mt-1 z-50 w-64 rounded-md border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Preset Samples
                </div>
                {SAMPLE_JSONS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      onLoadSample(sample.data);
                      setShowSampleMenu(false);
                      toast.success(`Loaded sample: ${sample.name}`);
                    }}
                    className="flex w-full flex-col items-start rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <span className="font-medium text-foreground">
                      {sample.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                      {sample.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side actions: Upload, Download, Copy, Clear */}
        <div className="flex items-center gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json,text/plain"
            className="hidden"
          />

          <Tooltip content="Upload JSON file">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>

          <Tooltip content="Download JSON file">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isEmpty}
              onClick={handleDownload}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>

          <Tooltip content={copied ? "Copied!" : "Copy all (Ctrl+Shift+C)"}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isEmpty}
              onClick={handleCopy}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </Tooltip>

          <Tooltip content="Clear editor">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isEmpty}
              onClick={handleClearClick}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Confirmation Dialog for Clearing */}
      <Dialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear JSON Editor?"
        description="Are you sure you want to clear the editor? Any unsaved edits will be lost."
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowClearDialog(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={confirmClear}
          >
            Clear Editor
          </Button>
        </div>
      </Dialog>
    </>
  );
}

