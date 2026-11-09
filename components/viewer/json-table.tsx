"use client";

import * as React from "react";
import { JsonTableCell } from "./json-table-cell";
import { ColumnVisibilityMenu } from "./column-visibility-menu";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { appendToPath } from "@/lib/json/path-utils";
import { ArrowUpDown, Table as TableIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonTableProps {
  data: any;
  selectedPath: string;
  onSelectPath: (path: string) => void;
  searchQuery?: string;
  onMatchCountChange?: (count: number) => void;
}

export function JsonTable({
  data,
  selectedPath,
  onSelectPath,
  searchQuery = "",
  onMatchCountChange,
}: JsonTableProps) {
  // Modal for inspecting nested structures
  const [inspectModal, setInspectModal] = React.useState<{
    isOpen: boolean;
    value: any;
    path: string;
  }>({
    isOpen: false,
    value: null,
    path: "",
  });

  // Sort state
  const [sortCol, setSortCol] = React.useState<string | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);

  // Column visibility state
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(
    new Set()
  );

  // Determine shape of data
  const isArray = Array.isArray(data);
  const isObject = data !== null && typeof data === "object" && !isArray;

  // 1. Array of objects
  const isArrayOfObjects =
    isArray &&
    data.length > 0 &&
    data.some((item) => item !== null && typeof item === "object");

  // Collect unique column keys
  const allColumns = React.useMemo(() => {
    if (isArrayOfObjects) {
      const colSet = new Set<string>();
      data.forEach((item) => {
        if (item && typeof item === "object") {
          Object.keys(item).forEach((k) => colSet.add(k));
        }
      });
      return Array.from(colSet);
    }
    return [];
  }, [isArrayOfObjects, data]);

  // Visible columns filtered by user selection
  const visibleColumns = React.useMemo(() => {
    return allColumns.filter((col) => !hiddenColumns.has(col));
  }, [allColumns, hiddenColumns]);

  const handleToggleColumn = React.useCallback((col: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) {
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
  }, []);

  const handleShowAllColumns = React.useCallback(() => {
    setHiddenColumns(new Set());
  }, []);

  const handleHideAllColumns = React.useCallback(() => {
    setHiddenColumns(new Set(allColumns));
  }, [allColumns]);

  // Handle sorting
  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  // Filter and sort rows
  const sortedArrayRows = React.useMemo(() => {
    if (!isArray) return [];

    let rows = data.map((item, originalIndex) => ({
      item,
      originalIndex,
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(({ item }) => {
        return JSON.stringify(item).toLowerCase().includes(q);
      });
    }

    if (sortCol) {
      rows.sort((a, b) => {
        const valA = a.item?.[sortCol];
        const valB = b.item?.[sortCol];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (valA < valB) return sortAsc ? -1 : 1;
        return sortAsc ? 1 : -1;
      });
    }

    return rows;
  }, [data, isArray, searchQuery, sortCol, sortAsc]);

  // Object key-value rows if data is a single object
  const objectRows = React.useMemo(() => {
    if (!isObject) return [];
    let entries = Object.entries(data);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(([k, v]) => {
        return (
          k.toLowerCase().includes(q) ||
          JSON.stringify(v).toLowerCase().includes(q)
        );
      });
    }

    return entries;
  }, [data, isObject, searchQuery]);

  React.useEffect(() => {
    if (searchQuery.trim()) {
      const count = isArrayOfObjects
        ? sortedArrayRows.length
        : objectRows.length;
      onMatchCountChange?.(count);
    } else {
      onMatchCountChange?.(0);
    }
  }, [
    searchQuery,
    isArrayOfObjects,
    sortedArrayRows.length,
    objectRows.length,
    onMatchCountChange,
  ]);

  const handleInspectNested = (val: any, path: string) => {
    setInspectModal({
      isOpen: true,
      value: val,
      path,
    });
  };

  // Render for Empty / Incompatible data
  if (!data || (isArray && data.length === 0)) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <TableIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
        <p className="text-xs font-medium text-foreground">Empty Dataset</p>
        <p className="text-[11px] text-muted-foreground mt-1">
          No records found to display in table format.
        </p>
      </div>
    );
  }

  // Fallback for Primitive Root (e.g. a plain string or number)
  if (!isArray && !isObject) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-border bg-card p-4 text-xs font-mono">
          <div className="text-muted-foreground text-[11px] mb-1">
            Primitive Value
          </div>
          <div className="font-semibold text-foreground">{String(data)}</div>
        </div>
      </div>
    );
  }

  // 1. Array of Objects Table
  if (isArrayOfObjects) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        {/* Table Controls Sub-bar */}
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-border/80 bg-muted/15 px-3 select-none text-xs">
          <div className="flex items-center gap-2">
            <ColumnVisibilityMenu
              columns={allColumns}
              hiddenColumns={hiddenColumns}
              onToggleColumn={handleToggleColumn}
              onShowAll={handleShowAllColumns}
              onHideAll={handleHideAllColumns}
            />

            {hiddenColumns.size > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleShowAllColumns}
                className="h-6 gap-1 px-1.5 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset columns</span>
              </Button>
            )}
          </div>

          <div className="text-[11px] font-mono text-muted-foreground">
            {sortedArrayRows.length} {sortedArrayRows.length === 1 ? "row" : "rows"}
            {" • "}
            {visibleColumns.length} of {allColumns.length} cols
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="relative flex-1 overflow-auto">
          {visibleColumns.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <p className="text-xs font-medium text-foreground">
                All columns are currently hidden
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 mb-3">
                Use the Columns menu to toggle visible columns or reset all.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShowAllColumns}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Show All Columns</span>
              </Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 z-20 border-b border-border bg-muted/95 backdrop-blur-xs text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shadow-2xs">
                <tr>
                  <th className="w-12 px-3 py-2 text-center border-r border-border/50">
                    #
                  </th>
                  {visibleColumns.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-3 py-2 border-r border-border/50 cursor-pointer select-none hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{col}</span>
                        <ArrowUpDown className="h-3 w-3 shrink-0 opacity-40 hover:opacity-100" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sortedArrayRows.map(({ item, originalIndex }) => {
                  const rowPath = `[${originalIndex}]`;
                  return (
                    <tr key={originalIndex} className="hover:bg-muted/20">
                      <td
                        onClick={() => onSelectPath(rowPath)}
                        className="px-3 py-2 text-center font-mono text-[11px] text-muted-foreground border-r border-border/50 bg-muted/10 cursor-pointer"
                      >
                        {originalIndex}
                      </td>
                      {visibleColumns.map((col) => {
                        const cellPath = appendToPath(rowPath, col);
                        const cellValue = item?.[col];
                        return (
                          <JsonTableCell
                            key={col}
                            value={cellValue}
                            cellPath={cellPath}
                            isSelected={selectedPath === cellPath}
                            onSelect={() => onSelectPath(cellPath)}
                            onInspectNested={handleInspectNested}
                            searchQuery={searchQuery}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for inspecting nested object or array */}
        <Dialog
          open={inspectModal.isOpen}
          onOpenChange={(open) =>
            setInspectModal((prev) => ({ ...prev, isOpen: open }))
          }
          title={`Inspect Node: ${inspectModal.path}`}
          description="Detailed JSON structure of selected cell"
        >
          <div className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(inspectModal.value, null, 2)}
            </pre>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <CopyButton
              value={inspectModal.value}
              label="Copied nested structure"
              tooltipText="Copy JSON"
              size="sm"
              variant="outline"
              className="h-7 w-auto px-2.5 gap-1.5"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setInspectModal((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  // 2. Single Object Key-Value Table
  if (isObject) {
    return (
      <div className="relative h-full w-full overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-20 border-b border-border bg-muted/95 backdrop-blur-xs text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shadow-2xs">
            <tr>
              <th className="w-1/3 px-4 py-2 border-r border-border/50">
                Property Key
              </th>
              <th className="w-2/3 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {objectRows.map(([key, val]) => {
              const cellPath = appendToPath("$", key);
              return (
                <tr key={key} className="hover:bg-muted/20">
                  <td
                    onClick={() => onSelectPath(cellPath)}
                    className="px-4 py-2 font-mono text-xs font-semibold text-foreground border-r border-border/50 bg-muted/5 cursor-pointer"
                  >
                    {key}
                  </td>
                  <JsonTableCell
                    value={val}
                    cellPath={cellPath}
                    isSelected={selectedPath === cellPath}
                    onSelect={() => onSelectPath(cellPath)}
                    onInspectNested={handleInspectNested}
                    searchQuery={searchQuery}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Modal for inspecting nested object or array */}
        <Dialog
          open={inspectModal.isOpen}
          onOpenChange={(open) =>
            setInspectModal((prev) => ({ ...prev, isOpen: open }))
          }
          title={`Inspect Node: ${inspectModal.path}`}
          description="Detailed JSON structure of selected property"
        >
          <div className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(inspectModal.value, null, 2)}
            </pre>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <CopyButton
              value={inspectModal.value}
              label="Copied nested structure"
              tooltipText="Copy JSON"
              size="sm"
              variant="outline"
              className="h-7 w-auto px-2.5 gap-1.5"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setInspectModal((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  // 3. Array of Primitives Table
  return (
    <div className="relative h-full w-full overflow-auto">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="sticky top-0 z-20 border-b border-border bg-muted/95 backdrop-blur-xs text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shadow-2xs">
          <tr>
            <th className="w-16 px-4 py-2 border-r border-border/50 text-center">
              Index
            </th>
            <th className="px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {sortedArrayRows.map(({ item, originalIndex }) => {
            const cellPath = `[${originalIndex}]`;
            return (
              <tr key={originalIndex} className="hover:bg-muted/20">
                <td
                  onClick={() => onSelectPath(cellPath)}
                  className="px-4 py-2 text-center font-mono text-xs text-muted-foreground border-r border-border/50 bg-muted/5 cursor-pointer"
                >
                  {originalIndex}
                </td>
                <JsonTableCell
                  value={item}
                  cellPath={cellPath}
                  isSelected={selectedPath === cellPath}
                  onSelect={() => onSelectPath(cellPath)}
                  onInspectNested={handleInspectNested}
                  searchQuery={searchQuery}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
