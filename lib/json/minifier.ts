export function minifyJson(
  raw: string
): { success: boolean; minified: string; error?: string } {
  try {
    const trimmed = raw.trim();
    if (!trimmed) {
      return { success: true, minified: "" };
    }
    const parsed = JSON.parse(raw);
    return {
      success: true,
      minified: JSON.stringify(parsed),
    };
  } catch (err: any) {
    return {
      success: false,
      minified: raw,
      error: err.message || "Invalid JSON",
    };
  }
}

