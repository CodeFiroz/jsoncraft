import { JsonError, JsonStats, JsonParseResult } from "@/types/json";

/**
 * Extracts line and column from a JSON syntax error and JSON string.
 */
export function extractJsonError(err: Error, text: string): JsonError {
  const message = err.message || "Invalid JSON";
  let line: number | undefined;
  let column: number | undefined;

  // Pattern 1: "... at line 2 column 5"
  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else {
    // Pattern 2: "... at position 42"
    const posMatch = message.match(/at position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      let curLine = 1;
      let curCol = 1;
      for (let i = 0; i < Math.min(pos, text.length); i++) {
        if (text[i] === "\n") {
          curLine++;
          curCol = 1;
        } else {
          curCol++;
        }
      }
      line = curLine;
      column = curCol;
    }
  }

  // Clean up message for cleaner display
  const cleanedMessage = message
    .replace(/^JSON\.parse:\s*/i, "")
    .replace(/in JSON at position \d+/i, "")
    .trim();

  return {
    message: cleanedMessage || "Syntax error in JSON",
    line,
    column,
  };
}

/**
 * Calculates stats about JSON structure.
 */
export function computeJsonStats(data: any, text: string): JsonStats {
  const sizeBytes = new TextEncoder().encode(text).length;
  const lineCount = text ? text.split("\n").length : 0;
  const charCount = text.length;

  if (data === undefined || data === null && text.trim() === "") {
    return {
      sizeBytes: 0,
      lineCount: 0,
      charCount: 0,
      type: "empty",
      nodeCount: 0,
      depth: 0,
    };
  }

  let nodeCount = 0;
  let maxDepth = 0;

  function traverse(node: any, currentDepth: number) {
    nodeCount++;
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }

    if (node && typeof node === "object") {
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          traverse(node[i], currentDepth + 1);
        }
      } else {
        const keys = Object.keys(node);
        for (const k of keys) {
          traverse(node[k], currentDepth + 1);
        }
      }
    }
  }

  traverse(data, 1);

  const type = Array.isArray(data)
    ? "array"
    : data !== null && typeof data === "object"
    ? "object"
    : "primitive";

  return {
    sizeBytes,
    lineCount,
    charCount,
    type,
    nodeCount,
    depth: maxDepth,
  };
}

/**
 * Safely parses JSON string with error location and stats.
 */
export function parseJson(raw: string): JsonParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      isValid: true,
      data: null,
      error: null,
      stats: {
        sizeBytes: 0,
        lineCount: 0,
        charCount: 0,
        type: "empty",
        nodeCount: 0,
        depth: 0,
      },
    };
  }

  try {
    const data = JSON.parse(raw);
    const stats = computeJsonStats(data, raw);
    return {
      isValid: true,
      data,
      error: null,
      stats,
    };
  } catch (err: any) {
    const error = extractJsonError(err, raw);
    return {
      isValid: false,
      data: null,
      error,
      stats: {
        sizeBytes: new TextEncoder().encode(raw).length,
        lineCount: raw.split("\n").length,
        charCount: raw.length,
        type: "empty",
        nodeCount: 0,
        depth: 0,
      },
    };
  }
}

