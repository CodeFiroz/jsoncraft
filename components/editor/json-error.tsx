"use client";

import * as React from "react";
import { AlertTriangle, CornerDownRight } from "lucide-react";
import { JsonError } from "@/types/json";

interface JsonErrorProps {
  error: JsonError | null;
  onGoToLine?: (line: number, column?: number) => void;
}

export function JsonErrorBanner({ error, onGoToLine }: JsonErrorProps) {
  if (!error) return null;

  return (
    <div className="flex items-center justify-between border-t border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-600 dark:text-red-400">
      <div className="flex items-center gap-2 overflow-hidden">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
        <span className="font-medium shrink-0">Syntax Error:</span>
        <span className="truncate font-mono text-[11px] text-red-700 dark:text-red-300">
          {error.message}
        </span>
      </div>

      {(error.line !== undefined || error.column !== undefined) && (
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold">
            {error.line !== undefined && `Ln ${error.line}`}
            {error.column !== undefined && `, Col ${error.column}`}
          </span>
          {onGoToLine && error.line !== undefined && (
            <button
              type="button"
              onClick={() => onGoToLine(error.line!, error.column)}
              className="flex items-center gap-1 text-[11px] font-medium text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
            >
              <span>Jump</span>
              <CornerDownRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

