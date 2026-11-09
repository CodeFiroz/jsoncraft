"use client";

import * as React from "react";
import { parseJson } from "@/lib/json/parser";
import { JsonParseResult } from "@/types/json";

export function useJsonParser(rawContent: string, debounceMs: number = 150) {
  const [parseResult, setParseResult] = React.useState<JsonParseResult>(() =>
    parseJson(rawContent)
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const res = parseJson(rawContent);
      setParseResult(res);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [rawContent, debounceMs]);

  return parseResult;
}

