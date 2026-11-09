"use client";

import * as React from "react";
import { Braces, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { SAMPLE_JSONS } from "@/lib/json/samples";
import Image from "next/image";

interface AppHeaderProps {
  onLoadSample: (sampleData: any) => void;
}

export function AppHeader({ onLoadSample }: AppHeaderProps) {
  return (
    <header className="flex h-12 w-full shrink-0 items-center justify-between border-b border-border bg-card px-4 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        {/* <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shadow-xs">
          <Braces className="h-4 w-4" />
        </div> */}
        <Image
          alt="JSONCraft"
          src={'/logo.png'}
          width={30}
          height={30}
        />
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-bold tracking-tight text-foreground font-mono">
            JSONCraft
          </h1>
          <span className="hidden sm:inline-block rounded-xs bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            v1.0
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <Tooltip content="Quick load sample JSON">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onLoadSample(SAMPLE_JSONS[0].data)}
            className="hidden sm:inline-flex gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Load Sample</span>
          </Button>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

        <ThemeToggle />

        <Tooltip content="GitHub repository (CodeFiroz)">
          <a
            href="https://github.com/CodeFiroz"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="GitHub (@CodeFiroz)"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </Tooltip>
      </div>
    </header>
  );
}
