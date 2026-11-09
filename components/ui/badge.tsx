import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "destructive" | "warning";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground":
            variant === "default",
          "border-transparent bg-secondary text-secondary-foreground":
            variant === "secondary",
          "border-border text-foreground": variant === "outline",
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400":
            variant === "success",
          "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400":
            variant === "destructive",
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400":
            variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

