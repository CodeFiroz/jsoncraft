"use client";

import * as React from "react";
import { JsonTreeNode } from "./json-tree-node";
import { appendToPath } from "@/lib/json/path-utils";

interface JsonTreeProps {
  data: any;
  selectedPath: string;
  onSelectPath: (path: string) => void;
  searchQuery?: string;
  onMatchCountChange?: (count: number) => void;
  expandAllTrigger?: number;
  collapseAllTrigger?: number;
}

export function JsonTree({
  data,
  selectedPath,
  onSelectPath,
  searchQuery = "",
  onMatchCountChange,
  expandAllTrigger = 0,
  collapseAllTrigger = 0,
}: JsonTreeProps) {
  // Map of path -> isExpanded
  const [expandedMap, setExpandedMap] = React.useState<Map<string, boolean>>(
    new Map()
  );

  // Handle toggle single node
  const handleToggleExpand = React.useCallback((path: string) => {
    setExpandedMap((prev) => {
      const next = new Map(prev);
      const current = next.get(path);
      // Default to true if not set
      next.set(path, current !== undefined ? !current : false);
      return next;
    });
  }, []);

  // Expand all listener
  React.useEffect(() => {
    if (expandAllTrigger === 0) return;
    const newMap = new Map<string, boolean>();
    function traverse(node: any, path: string) {
      if (node && typeof node === "object") {
        newMap.set(path, true);
        if (Array.isArray(node)) {
          node.forEach((item, idx) => {
            traverse(item, appendToPath(path, idx));
          });
        } else {
          Object.entries(node).forEach(([k, val]) => {
            traverse(val, appendToPath(path, k));
          });
        }
      }
    }
    traverse(data, "$");
    setExpandedMap(newMap);
  }, [expandAllTrigger, data]);

  // Collapse all listener
  React.useEffect(() => {
    if (collapseAllTrigger === 0) return;
    const newMap = new Map<string, boolean>();
    function traverse(node: any, path: string) {
      if (node && typeof node === "object") {
        newMap.set(path, false);
        if (Array.isArray(node)) {
          node.forEach((item, idx) => {
            traverse(item, appendToPath(path, idx));
          });
        } else {
          Object.entries(node).forEach(([k, val]) => {
            traverse(val, appendToPath(path, k));
          });
        }
      }
    }
    traverse(data, "$");
    setExpandedMap(newMap);
  }, [collapseAllTrigger, data]);

  // Search match count and auto-expansion
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      onMatchCountChange?.(0);
      return;
    }

    const q = searchQuery.toLowerCase();
    let matches = 0;
    const matchingPaths = new Set<string>();

    function checkMatch(node: any, path: string, keyName?: string) {
      if (keyName && keyName.toLowerCase().includes(q)) {
        matches++;
        matchingPaths.add(path);
      }

      if (node === null || node === undefined) {
        if (String(node).includes(q)) {
          matches++;
          matchingPaths.add(path);
        }
        return;
      }

      if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
        if (String(node).toLowerCase().includes(q)) {
          matches++;
          matchingPaths.add(path);
        }
        return;
      }

      if (Array.isArray(node)) {
        node.forEach((item, idx) => {
          checkMatch(item, appendToPath(path, idx));
        });
      } else if (typeof node === "object") {
        Object.entries(node).forEach(([k, val]) => {
          checkMatch(val, appendToPath(path, k), k);
        });
      }
    }

    checkMatch(data, "$");
    onMatchCountChange?.(matches);

    // If search produced matches, ensure their ancestor paths are expanded
    if (matches > 0) {
      setExpandedMap((prev) => {
        const next = new Map(prev);
        matchingPaths.forEach((p) => {
          // split path and expand all ancestors
          let acc = "$";
          next.set(acc, true);
          const parts = p.replace(/^\$/, "").match(/(\[[0-9]+\]|\["[^"]+"\]|\.[a-zA-Z0-9_$]+)/g) || [];
          for (const part of parts) {
            acc = acc === "$" ? (part.startsWith(".") ? part.slice(1) : part) : acc + part;
            next.set(acc, true);
          }
        });
        return next;
      });
    }
  }, [searchQuery, data, onMatchCountChange]);

  if (data === undefined || data === null && typeof data !== "object") {
    return (
      <div className="p-4 text-xs font-mono text-muted-foreground">
        No content to display
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto p-3 text-xs leading-relaxed">
      <JsonTreeNode
        value={data}
        currentPath="$"
        selectedPath={selectedPath}
        onSelectPath={onSelectPath}
        depth={0}
        expandedMap={expandedMap}
        onToggleExpand={handleToggleExpand}
        searchQuery={searchQuery}
        isLast={true}
      />
    </div>
  );
}

