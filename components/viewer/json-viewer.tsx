"use client";

import * as React from "react";
import { ViewMode } from "@/types/json";
import { ViewerToolbar } from "./viewer-toolbar";
import { JsonPathBar } from "./json-path-bar";
import { JsonTree } from "./json-tree";
import { JsonTable } from "./json-table";
import { EmptyState } from "@/components/shared/empty-state";
import { copyToClipboard } from "@/lib/json/clipboard";

interface JsonViewerProps {
  data: any;
  isValid: boolean;
  isEmpty: boolean;
  onLoadSample: () => void;
  selectedPath: string;
  onSelectPath: (path: string) => void;
}

export function JsonViewer({
  data,
  isValid,
  isEmpty,
  onLoadSample,
  selectedPath,
  onSelectPath,
}: JsonViewerProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("tree");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [matchCount, setMatchCount] = React.useState(0);
  const [expandAllTrigger, setExpandAllTrigger] = React.useState(0);
  const [collapseAllTrigger, setCollapseAllTrigger] = React.useState(0);

  // Preserve last valid data when current input is invalid or temporary syntax error
  const lastValidDataRef = React.useRef<any>(data);

  React.useEffect(() => {
    if (isValid && data !== null && data !== undefined) {
      lastValidDataRef.current = data;
    }
  }, [isValid, data]);

  const activeData = isValid ? data : lastValidDataRef.current;
  const hasNoData = isEmpty || activeData === null || activeData === undefined;

  const handleExpandAll = () => {
    setExpandAllTrigger((prev) => prev + 1);
  };

  const handleCollapseAll = () => {
    setCollapseAllTrigger((prev) => prev + 1);
  };

  const handleCopyAll = () => {
    if (hasNoData) return;
    copyToClipboard(activeData, {
      label: "Parsed JSON copied to clipboard",
      formatJson: true,
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      {/* Viewer Header / Toolbar */}
      <ViewerToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onCopyAll={handleCopyAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        matchCount={matchCount}
        isEmpty={hasNoData}
      />

      {/* Selected JSON Path Bar */}
      <JsonPathBar path={selectedPath} onSelectPath={onSelectPath} />

      {/* Warning banner if displaying stale valid data while input has errors */}
      {!isValid && !isEmpty && lastValidDataRef.current && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1 text-[11px] text-amber-600 dark:text-amber-400 flex items-center justify-between">
          <span>
            Displaying previous valid JSON state while input is being corrected.
          </span>
        </div>
      )}

      {/* Viewer Content Area */}
      <div className="relative flex-1 overflow-hidden">
        {hasNoData ? (
          <EmptyState
            title="Viewer Ready"
            description="Enter or paste valid JSON on the left to explore the interactive tree or table view."
            onLoadSample={onLoadSample}
          />
        ) : viewMode === "tree" ? (
          <JsonTree
            data={activeData}
            selectedPath={selectedPath}
            onSelectPath={onSelectPath}
            searchQuery={searchQuery}
            onMatchCountChange={setMatchCount}
            expandAllTrigger={expandAllTrigger}
            collapseAllTrigger={collapseAllTrigger}
          />
        ) : (
          <JsonTable
            data={activeData}
            selectedPath={selectedPath}
            onSelectPath={onSelectPath}
            searchQuery={searchQuery}
            onMatchCountChange={setMatchCount}
          />
        )}
      </div>
    </div>
  );
}

