"use client";

import * as React from "react";
import { Copy, Check, Eye } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/json/clipboard";
import { cn } from "@/lib/utils";

interface JsonTableCellProps {
  value: any;
  cellPath: string;
  isSelected: boolean;
  onSelect: () => void;
  onInspectNested: (value: any, path: string) => void;
  searchQuery?: string;
}

export function JsonTableCell({
  value,
  cellPath,
  isSelected,
  onSelect,
  onInspectNested,
  searchQuery,
}: JsonTableCellProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(value, {
      label: "Cell value copied",
      rawString: true,
      formatJson: true,
    });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    onInspectNested(value, cellPath);
  };

  const renderContent = () => {
    if (value === undefined) {
      return (
        <span className="text-neutral-300 dark:text-neutral-600 font-mono text-[11px]">
          —
        </span>
      );
    }
    if (value === null) {
      return (
        <span className="font-mono text-xs italic text-neutral-400 dark:text-neutral-500">
          null
        </span>
      );
    }
    if (typeof value === "boolean") {
      return (
        <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
          {value ? "true" : "false"}
        </span>
      );
    }
    if (typeof value === "number") {
      return (
        <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
          {value}
        </span>
      );
    }
    if (typeof value === "string") {
      return (
        <span className="font-mono text-xs text-foreground truncate max-w-xs block">
          {value}
        </span>
      );
    }
    if (typeof value === "object") {
      const isArr = Array.isArray(value);
      const count = isArr ? value.length : Object.keys(value).length;
      return (
        <button
          type="button"
          onClick={handleInspect}
          className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
        >
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span>
            {isArr ? `[${count} items]` : `{${count} keys}`}
          </span>
        </button>
      );
    }

    return <span className="font-mono text-xs">{String(value)}</span>;
  };

  return (
    <td
      onClick={onSelect}
      className={cn(
        "group/cell relative px-3 py-2 text-xs border-b border-border/60 transition-colors cursor-pointer select-none",
        isSelected
          ? "bg-blue-500/15 ring-1 ring-inset ring-blue-500/50"
          : "hover:bg-muted/40"
      )}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="truncate">{renderContent()}</div>

        {/* Copy button on cell hover */}
        <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity shrink-0">
          <Tooltip content={copied ? "Copied!" : "Copy cell"}>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </td>
  );
}

