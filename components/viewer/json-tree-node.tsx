"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/json/clipboard";
import { appendToPath } from "@/lib/json/path-utils";
import { cn } from "@/lib/utils";

interface JsonTreeNodeProps {
  nodeKey?: string | number;
  value: any;
  currentPath: string;
  selectedPath: string;
  onSelectPath: (path: string) => void;
  depth?: number;
  expandedMap: Map<string, boolean>;
  onToggleExpand: (path: string) => void;
  searchQuery?: string;
  isLast?: boolean;
}

/**
 * Highlights matches in text when searching.
 */
function HighlightText({ text, query }: { text: string; query?: string }) {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-xs bg-amber-300 px-0.5 text-neutral-900 dark:bg-amber-500/40 dark:text-amber-100"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export function JsonTreeNode({
  nodeKey,
  value,
  currentPath,
  selectedPath,
  onSelectPath,
  depth = 0,
  expandedMap,
  onToggleExpand,
  searchQuery,
  isLast = false,
}: JsonTreeNodeProps) {
  const [copied, setCopied] = React.useState(false);

  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isSelected = selectedPath === currentPath;

  // Determine expand state
  const isExpanded = isObject
    ? (expandedMap.get(currentPath) ?? (depth < 2))
    : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(currentPath);
  };

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectPath(currentPath);
  };

  const handleCopyValue = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(value, {
      label: `Copied value for ${nodeKey ?? currentPath}`,
      rawString: true,
      formatJson: true,
    });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Render primitive value with syntax coloring
  const renderPrimitiveValue = (val: any) => {
    if (val === null) {
      return (
        <span className="font-mono text-xs italic text-neutral-400 dark:text-neutral-500">
          null
        </span>
      );
    }
    if (typeof val === "boolean") {
      return (
        <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
          {val ? "true" : "false"}
        </span>
      );
    }
    if (typeof val === "number") {
      return (
        <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
          <HighlightText text={String(val)} query={searchQuery} />
        </span>
      );
    }
    if (typeof val === "string") {
      return (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all">
          &quot;
          <HighlightText text={val} query={searchQuery} />
          &quot;
        </span>
      );
    }
    return <span className="font-mono text-xs">{String(val)}</span>;
  };

  const childEntries = React.useMemo(() => {
    if (!isObject) return [];
    if (isArray) {
      return value.map((item: any, idx: number) => ({
        key: idx,
        val: item,
        childPath: appendToPath(currentPath, idx),
      }));
    }
    return Object.entries(value).map(([k, val]) => ({
      key: k,
      val,
      childPath: appendToPath(currentPath, k),
    }));
  }, [isObject, isArray, value, currentPath]);

  const itemCount = isArray ? value.length : isObject ? Object.keys(value).length : 0;

  return (
    <div className="relative font-mono text-xs select-none">
      {/* Node Row */}
      <div
        onClick={handleRowClick}
        className={cn(
          "group/row flex items-center gap-1 rounded-sm py-1 px-1.5 transition-colors cursor-pointer",
          isSelected
            ? "bg-blue-500/10 text-foreground ring-1 ring-blue-500/40"
            : "hover:bg-muted/60"
        )}
        style={{ paddingLeft: `${Math.max(depth * 16, 4)}px` }}
      >
        {/* Expand / Collapse Chevron */}
        {isObject ? (
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-xs text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}

        {/* Node Key / Index */}
        {nodeKey !== undefined && (
          <span className="flex items-center gap-0.5">
            <span
              className={cn(
                typeof nodeKey === "number"
                  ? "text-neutral-400 dark:text-neutral-500 font-mono text-[11px]"
                  : "text-foreground font-semibold"
              )}
            >
              <HighlightText text={String(nodeKey)} query={searchQuery} />
            </span>
            <span className="text-muted-foreground mr-1">:</span>
          </span>
        )}

        {/* Value or Collapsed / Expanded Object Label */}
        {isObject ? (
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">
              {isArray ? "[" : "{"}
            </span>
            {!isExpanded && (
              <span className="rounded bg-muted/80 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                {itemCount} {itemCount === 1 ? (isArray ? "item" : "key") : (isArray ? "items" : "keys")}
              </span>
            )}
            {!isExpanded && (
              <span className="text-neutral-400">
                {isArray ? "]" : "}"}
              </span>
            )}
            {!isLast && !isExpanded && (
              <span className="text-muted-foreground">,</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {renderPrimitiveValue(value)}
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        )}

        {/* Copy value on hover button */}
        <div className="ml-auto opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center pr-1">
          <Tooltip content={copied ? "Copied!" : "Copy value"}>
            <button
              type="button"
              onClick={handleCopyValue}
              className="flex h-5 w-5 items-center justify-center rounded-xs text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
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

      {/* Children if expanded */}
      {isObject && isExpanded && (
        <div className="relative border-l border-border/50 ml-3">
          {childEntries.map((entry, idx) => (
            <JsonTreeNode
              key={entry.key}
              nodeKey={entry.key}
              value={entry.val}
              currentPath={entry.childPath}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
              depth={depth + 1}
              expandedMap={expandedMap}
              onToggleExpand={onToggleExpand}
              searchQuery={searchQuery}
              isLast={idx === childEntries.length - 1}
            />
          ))}
          {/* Closing brace / bracket */}
          <div
            className="flex items-center py-0.5 text-neutral-400"
            style={{ paddingLeft: `${Math.max(depth * 16 + 18, 18)}px` }}
          >
            <span>{isArray ? "]" : "}"}</span>
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        </div>
      )}
    </div>
  );
}

