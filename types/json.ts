export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;
export interface JsonArray extends Array<JsonValue> {}
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonStats {
  sizeBytes: number;
  lineCount: number;
  charCount: number;
  type: "object" | "array" | "primitive" | "empty";
  nodeCount: number;
  depth: number;
}

export interface JsonParseResult {
  isValid: boolean;
  data: any;
  error: JsonError | null;
  stats: JsonStats;
}

export type ViewMode = "tree" | "table";

export interface TreeNodeData {
  key: string;
  path: string;
  value: any;
  type: "string" | "number" | "boolean" | "null" | "array" | "object";
  itemCount?: number;
  depth: number;
}

