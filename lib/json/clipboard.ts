import { toast } from "sonner";

/**
 * Copies text or stringified JSON value to clipboard, with toast feedback.
 */
export async function copyToClipboard(
  value: any,
  options?: {
    label?: string;
    rawString?: boolean;
    formatJson?: boolean;
  }
): Promise<boolean> {
  const label = options?.label || "Copied to clipboard";
  const rawString = options?.rawString ?? true;
  const formatJson = options?.formatJson ?? true;

  let textToCopy = "";

  if (typeof value === "string") {
    textToCopy = rawString ? value : JSON.stringify(value);
  } else if (typeof value === "number" || typeof value === "boolean") {
    textToCopy = String(value);
  } else if (value === null) {
    textToCopy = "null";
  } else if (value === undefined) {
    textToCopy = "undefined";
  } else if (typeof value === "object") {
    try {
      textToCopy = formatJson
        ? JSON.stringify(value, null, 2)
        : JSON.stringify(value);
    } catch {
      textToCopy = String(value);
    }
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // Fallback for non-secure contexts or older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    toast.success(label, {
      description:
        textToCopy.length > 60
          ? `${textToCopy.slice(0, 60)}...`
          : textToCopy,
      duration: 2000,
    });
    return true;
  } catch (err: any) {
    toast.error("Failed to copy to clipboard", {
      description: err?.message || "Permission denied",
    });
    return false;
  }
}

