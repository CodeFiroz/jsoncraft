/**
 * Prints a stylized ASCII banner in the browser console.
 * Safe to call multiple times — only prints once per page load.
 */
export function printConsoleBanner(): void {
  if (typeof window === "undefined") return;

  const FLAG = "__JSONCRAFT_BANNER_PRINTED__" as const;
  const w = window as unknown as Record<string, unknown>;
  if (w[FLAG]) return;
  w[FLAG] = true;

  // Compact ASCII banner (fits comfortably in a standard devtools console)
  const banner = [
    "     ██╗███████╗ ██████╗ ███╗   ██╗ ██████╗██████╗  █████╗ ███████╗████████╗",
    "     ██║██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝",
    "     ██║███████╗██║   ██║██╔██╗ ██║██║     ██████╔╝███████║█████╗     ██║   ",
    "██   ██║╚════██║██║   ██║██║╚██╗██║██║     ██╔══██╗██╔══██║██╔══╝     ██║   ",
    "╚█████╔╝███████║╚██████╔╝██║ ╚████║╚██████╗██║  ██║██║  ██║██║        ██║   ",
    " ╚════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝   ",
  ].join("\n");

  // Style tokens — keep them in one place so the log call stays readable
  const styles = {
    banner:
      "color:#38bdf8;font-family:monospace;font-weight:900;font-size:10px;" +
      "line-height:1.15;text-shadow:0 0 8px rgba(56,189,248,.9),0 0 16px rgba(168,85,247,.7);",
    brand: "background:#2563eb;color:#fff;font-weight:800;font-family:monospace;padding:3px 8px;border-radius:4px;font-size:12px;",
    muted: "color:#94a3b8;font-family:monospace;font-size:12px;font-weight:600;",
    name:  "background:#ec4899;color:#fff;font-weight:800;font-family:monospace;padding:3px 8px;border-radius:4px;font-size:12px;",
    handle:"background:#8b5cf6;color:#fff;font-weight:700;font-family:monospace;padding:3px 8px;border-radius:4px;font-size:11px;",
    link:  "color:#38bdf8;text-decoration:underline;font-family:monospace;font-size:11px;font-weight:700;",
  } as const;

  console.log(
    `%c${banner}\n\n` +
    `%c ⚡ JSONCraft %c by %cFiroz %c@CodeFiroz\n` +
    `%c 🌐 https://github.com/CodeFiroz`,
    styles.banner,
    styles.brand,
    styles.muted,
    styles.name,
    styles.handle,
    styles.link,
  );
}