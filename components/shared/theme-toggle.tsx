"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5 h-7 w-[84px]" />
    );
  }

  const currentTheme = theme || "system";

  return (
    <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5 text-muted-foreground">
      <Tooltip content="Light theme">
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-label="Light theme"
          className={`flex h-6 w-6 items-center justify-center rounded-sm text-xs transition-colors cursor-pointer ${
            currentTheme === "light"
              ? "bg-background text-foreground shadow-xs"
              : "hover:text-foreground"
          }`}
        >
          <Sun className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      <Tooltip content="Dark theme">
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
          className={`flex h-6 w-6 items-center justify-center rounded-sm text-xs transition-colors cursor-pointer ${
            currentTheme === "dark"
              ? "bg-background text-foreground shadow-xs"
              : "hover:text-foreground"
          }`}
        >
          <Moon className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      <Tooltip content="System theme">
        <button
          type="button"
          onClick={() => setTheme("system")}
          aria-label="System theme"
          className={`flex h-6 w-6 items-center justify-center rounded-sm text-xs transition-colors cursor-pointer ${
            currentTheme === "system"
              ? "bg-background text-foreground shadow-xs"
              : "hover:text-foreground"
          }`}
        >
          <Laptop className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
    </div>
  );
}

