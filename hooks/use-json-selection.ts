"use client";

import * as React from "react";

export function useJsonSelection(initialPath: string = "$") {
  const [selectedPath, setSelectedPath] = React.useState<string>(initialPath);

  const selectPath = React.useCallback((path: string) => {
    setSelectedPath(path);
  }, []);

  const resetSelection = React.useCallback(() => {
    setSelectedPath("$");
  }, []);

  return {
    selectedPath,
    selectPath,
    resetSelection,
  };
}

