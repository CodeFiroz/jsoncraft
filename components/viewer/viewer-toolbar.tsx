"use client";

import * as React from "react";
import {
  ListTree,
  Table as TableIcon,
  ChevronsDownUp,
  ChevronsUpDown,
  Copy,
  Search,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ViewMode } from "@/types/json";
import { copyToClipboard } from "@/lib/json/clipboard";
import { cn } from "@/lib/utils";

interface ViewerToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onCopyAll: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchCount?: number;
  isEmpty: boolean;
}

export function ViewerToolbar({
  viewMode,
  onViewModeChange,
  onExpandAll,
  onCollapseAll,
  onCopyAll,
  searchQuery,
  onSearchChange,
  matchCount = 0,
  isEmpty,
}: ViewerToolbarProps) {
  const [copied, setCopied] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    if (isEmpty) return;
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleSearch = () => {
    if (isSearchOpen && searchQuery) {
      onSearchChange("");
    }
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="flex h-10 items-center justify-between border-b border-border bg-muted/20 px-3 select-none gap-2">
      {/* View Switcher: Tree / Table */}
      <div className="flex items-center gap-1 rounded-md border border-border bg-muted/40 p-0.5">
        <Tooltip content="Accordion / Tree View">
          <button
            type="button"
            onClick={() => onViewModeChange("tree")}
            className={cn(
              "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              viewMode === "tree"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListTree className="h-3.5 w-3.5 text-blue-500" />
            <span>Tree</span>
          </button>
        </Tooltip>

        <Tooltip content="Table View">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TableIcon className="h-3.5 w-3.5 text-blue-500" />
            <span>Table</span>
          </button>
        </Tooltip>
      </div>

      {/* Center / Search bar */}
      <div className="flex items-center gap-2 flex-1 max-w-xs">
        {isSearchOpen ? (
          <div className="relative w-full flex items-center">
            <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search keys or values..."
              className="h-7 pl-7 pr-12 text-xs bg-background"
            />
            {searchQuery && (
              <span className="absolute right-7 text-[10px] text-muted-foreground font-mono">
                {matchCount}
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleSearch}
              className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Right controls: Expand, Collapse, Search Toggle, Copy */}
      <div className="flex items-center gap-1">
        {!isSearchOpen && (
          <Tooltip content="Search JSON">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isEmpty}
              onClick={handleToggleSearch}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>
        )}

        {viewMode === "tree" && (
          <>
            <Tooltip content="Expand All">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isEmpty}
                onClick={onExpandAll}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <ChevronsUpDown className="h-3.5 w-3.5" />
              </Button>
            </Tooltip>

            <Tooltip content="Collapse All">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isEmpty}
                onClick={onCollapseAll}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <ChevronsDownUp className="h-3.5 w-3.5" />
              </Button>
            </Tooltip>
          </>
        )}

        <Tooltip content={copied ? "Copied!" : "Copy parsed JSON"}>
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
      </div>
    </div>
  );
}

