/**
 * Formats an array of path segments into a clean JSON/JavaScript accessor string.
 * Example: ['users', 0, 'profile', 'slug'] -> "users[0].profile.slug"
 * Example: [0, 'name'] -> "[0].name"
 * Example: ['items', 'special-key'] -> 'items["special-key"]'
 */
export function buildJsonPath(segments: (string | number)[]): string {
  if (!segments || segments.length === 0) {
    return "$";
  }

  let result = "";

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (typeof seg === "number") {
      result += `[${seg}]`;
    } else {
      // String key
      const isIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(seg);
      if (isIdentifier) {
        if (result === "") {
          result = seg;
        } else {
          result += `.${seg}`;
        }
      } else {
        // Escaped property name
        const escaped = JSON.stringify(seg);
        result += `[${escaped}]`;
      }
    }
  }

  return result;
}

/**
 * Appends a child segment (key or index) to an existing path string.
 */
export function appendToPath(basePath: string, segment: string | number): string {
  if (!basePath || basePath === "$") {
    if (typeof segment === "number") return `[${segment}]`;
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(segment)
      ? segment
      : `[${JSON.stringify(segment)}]`;
  }

  if (typeof segment === "number") {
    return `${basePath}[${segment}]`;
  }

  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(segment)) {
    return `${basePath}.${segment}`;
  }

  return `${basePath}[${JSON.stringify(segment)}]`;
}

/**
 * Resolves a value from JSON data given path segments or a path string.
 */
export function getValueAtPath(data: any, segments: (string | number)[]): any {
  if (!segments || segments.length === 0) return data;

  let current = data;
  for (const seg of segments) {
    if (current === undefined || current === null) return undefined;
    current = current[seg];
  }
  return current;
}

