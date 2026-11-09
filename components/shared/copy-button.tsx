"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/json/clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  value: any;
  label?: string;
  tooltipText?: string;
  rawString?: boolean;
  formatJson?: boolean;
}

export function CopyButton({
  value,
  label = "Copied to clipboard",
  tooltipText = "Copy",
  rawString = true,
  formatJson = true,
  className,
  size = "icon",
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(value, {
      label,
      rawString,
      formatJson,
    });
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Tooltip content={copied ? "Copied!" : tooltipText}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleCopy}
        className={cn("h-6 w-6 text-muted-foreground hover:text-foreground", className)}
        {...props}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </Tooltip>
  );
}

