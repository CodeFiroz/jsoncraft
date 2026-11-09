"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JsonStats, JsonError } from "@/types/json";

interface EditorStatusProps {
  isValid: boolean;
  isEmpty: boolean;
  stats: JsonStats;
  error: JsonError | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function EditorStatus({
  isValid,
  isEmpty,
  stats,
  error,
}: EditorStatusProps) {
  return (
    <div className="flex h-7 items-center justify-between border-t border-border bg-muted/30 px-3 text-[11px] text-muted-foreground select-none">
      {/* Left side: status badge */}
      <div className="flex items-center gap-2">
        {isEmpty ? (
          <span className="flex items-center gap-1 text-muted-foreground">
            <FileCode className="h-3 w-3" />
            <span>Empty</span>
          </span>
        ) : isValid ? (
          <Badge variant="success" className="h-5 gap-1 px-1.5 text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            <span>Valid JSON</span>
          </Badge>
        ) : (
          <Badge variant="destructive" className="h-5 gap-1 px-1.5 text-[10px]">
            <AlertCircle className="h-3 w-3" />
            <span>
              Invalid JSON
              {error?.line !== undefined ? ` (Line ${error.line})` : ""}
            </span>
          </Badge>
        )}
      </div>

      {/* Right side: stats */}
      <div className="flex items-center gap-3">
        <span>{stats.lineCount} {stats.lineCount === 1 ? "line" : "lines"}</span>
        <span className="text-border">|</span>
        <span>{formatBytes(stats.sizeBytes)}</span>
        {isValid && !isEmpty && stats.nodeCount > 0 && (
          <>
            <span className="text-border">|</span>
            <span>{stats.nodeCount} {stats.nodeCount === 1 ? "node" : "nodes"}</span>
          </>
        )}
      </div>
    </div>
  );
}

