export function beautifyJson(
  raw: string,
  indent: number = 2
): { success: boolean; formatted: string; error?: string } {
  try {
    const trimmed = raw.trim();
    if (!trimmed) {
      return { success: true, formatted: "" };
    }
    const parsed = JSON.parse(raw);
    return {
      success: true,
      formatted: JSON.stringify(parsed, null, indent),
    };
  } catch (err: any) {
    return {
      success: false,
      formatted: raw,
      error: err.message || "Invalid JSON",
    };
  }
}

