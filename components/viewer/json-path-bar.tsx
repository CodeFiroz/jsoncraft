"use client";

import * as React from "react";
import { Copy, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/json/clipboard";
import { cn } from "@/lib/utils";

interface JsonPathBarProps {
  path: string;
  onSelectPath?: (path: string) => void;
  className?: string;
}

export function JsonPathBar({
  path,
  onSelectPath,
  className,
}: JsonPathBarProps) {
  const [copied, setCopied] = React.useState(false);

  const displayPath = path || "$";

  const handleCopy = async () => {
    const ok = await copyToClipboard(displayPath, {
      label: "JSON Path copied",
    });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Parse path into segments for breadcrumb rendering
  // e.g. "users[0].profile.slug" -> ["users", "[0]", "profile", "slug"]
  const segments = React.useMemo(() => {
    if (!path || path === "$") return ["$"];

    const regex = /([a-zA-Z0-9_$]+|\[\d+\]|\["[^"]+"\])/g;
    const matches = path.match(regex);
    return matches || [path];
  }, [path]);

  return (
    <div
      className={cn(
        "flex h-8 items-center justify-between border-b border-border bg-muted/20 px-3 text-xs select-none",
        className
      )}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">
          Path:
        </span>

        <div className="flex items-center gap-1 font-mono text-[12px] text-foreground/90">
          {segments.map((seg, idx) => {
            const isLast = idx === segments.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                )}
                <span
                  className={cn(
                    "px-1 py-0.5 rounded transition-colors shrink-0",
                    isLast
                      ? "bg-primary/10 text-primary font-medium dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {seg}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        <Tooltip content={copied ? "Copied!" : "Copy JSON Path"}>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="h-6 gap-1 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span>Copy Path</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

