"use client";

import * as React from "react";
import { JsonViewer } from "@/components/viewer/json-viewer";
import { JsonParseResult } from "@/types/json";

interface ViewerPanelProps {
  parseResult: JsonParseResult;
  isEmpty: boolean;
  onLoadSample: () => void;
  selectedPath: string;
  onSelectPath: (path: string) => void;
}

export function ViewerPanel({
  parseResult,
  isEmpty,
  onLoadSample,
  selectedPath,
  onSelectPath,
}: ViewerPanelProps) {
  return (
    <div className="h-full w-full overflow-hidden bg-background">
      <JsonViewer
        data={parseResult.data}
        isValid={parseResult.isValid}
        isEmpty={isEmpty}
        onLoadSample={onLoadSample}
        selectedPath={selectedPath}
        onSelectPath={onSelectPath}
      />
    </div>
  );
}

