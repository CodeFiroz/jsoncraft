"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { SlidersHorizontal, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColumnVisibilityMenuProps {
  columns: string[];
  hiddenColumns: Set<string>;
  onToggleColumn: (col: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export function ColumnVisibilityMenu({
  columns,
  hiddenColumns,
  onToggleColumn,
  onShowAll,
  onHideAll,
}: ColumnVisibilityMenuProps) {
  const [filterQuery, setFilterQuery] = React.useState("");

  const visibleCount = columns.length - hiddenColumns.size;

  const filteredColumns = React.useMemo(() => {
    if (!filterQuery.trim()) return columns;
    return columns.filter((col) =>
      col.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [columns, filterQuery]);

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="h-3 w-3 text-blue-500" />
          <span>Columns</span>
          <span className="rounded-xs bg-muted px-1 py-0.2 font-mono text-[10px] text-foreground">
            {visibleCount}/{columns.length}
          </span>
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-64 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Toggle Columns
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={onShowAll}
                className="text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>Show all</span>
              </button>
              <span className="text-border">|</span>
              <button
                type="button"
                onClick={onHideAll}
                className="text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
              >
                <EyeOff className="h-3 w-3" />
                <span>Hide all</span>
              </button>
            </div>
          </div>

          {/* Filter Input if > 5 columns */}
          {columns.length > 5 && (
            <div className="my-1.5">
              <Input
                placeholder="Filter columns..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="h-6 text-[11px]"
              />
            </div>
          )}

          {/* Column Checkboxes List */}
          <div className="mt-1 max-h-56 overflow-y-auto space-y-0.5 no-scrollbar">
            {filteredColumns.map((col) => {
              const isVisible = !hiddenColumns.has(col);
              return (
                <div
                  key={col}
                  onClick={() => onToggleColumn(col)}
                  className="flex items-center justify-between rounded-sm px-2 py-1 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground select-none transition-colors"
                >
                  <span
                    className={`font-mono truncate ${
                      isVisible
                        ? "text-foreground font-medium"
                        : "text-muted-foreground line-through opacity-60"
                    }`}
                  >
                    {col}
                  </span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      isVisible
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-transparent"
                    }`}
                  >
                    {isVisible && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}

            {filteredColumns.length === 0 && (
              <div className="py-2 text-center text-xs text-muted-foreground">
                No matching columns
              </div>
            )}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

