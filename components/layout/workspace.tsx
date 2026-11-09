"use client";

import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { EditorPanel } from "./editor-panel";
import { ViewerPanel } from "./viewer-panel";
import { JsonParseResult } from "@/types/json";
import { Code2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceProps {
  content: string;
  onChange: (val: string) => void;
  parseResult: JsonParseResult;
  onLoadSample: (sampleData: any) => void;
  selectedPath: string;
  onSelectPath: (path: string) => void;
}

export function Workspace({
  content,
  onChange,
  parseResult,
  onLoadSample,
  selectedPath,
  onSelectPath,
}: WorkspaceProps) {
  // Mobile tab state: "editor" | "viewer"
  const [mobileTab, setMobileTab] = React.useState<"editor" | "viewer">("editor");
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isEmpty = !content.trim();

  // If on mobile screen, render single panel with tab switcher
  if (isMobile) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        {/* Mobile Tab Switcher */}
        <div className="flex h-10 items-center justify-center border-b border-border bg-card px-3 shrink-0">
          <div className="grid w-full max-w-xs grid-cols-2 rounded-md border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-sm py-1 text-xs font-medium transition-colors cursor-pointer",
                mobileTab === "editor"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3.5 w-3.5 text-blue-500" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("viewer")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-sm py-1 text-xs font-medium transition-colors cursor-pointer",
                mobileTab === "viewer"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>Viewer</span>
            </button>
          </div>
        </div>

        {/* Mobile Viewports */}
        <div className="relative flex-1 overflow-hidden">
          {mobileTab === "editor" ? (
            <EditorPanel
              content={content}
              onChange={onChange}
              parseResult={parseResult}
              onLoadSample={onLoadSample}
            />
          ) : (
            <ViewerPanel
              parseResult={parseResult}
              isEmpty={isEmpty}
              onLoadSample={() => onLoadSample(undefined)}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop / Tablet Split Workspace
  return (
    <div className="relative h-full w-full overflow-hidden">
      <PanelGroup direction="horizontal" autoSaveId="jsoncraft-workspace-layout">
        {/* Left Panel: JSON Editor (40% default, min 25%) */}
        <Panel defaultSize={40} minSize={25} id="editor-panel" order={1}>
          <EditorPanel
            content={content}
            onChange={onChange}
            parseResult={parseResult}
            onLoadSample={onLoadSample}
          />
        </Panel>

        {/* Draggable Vertical Divider */}
        <PanelResizeHandle className="group relative flex w-1.5 items-center justify-center bg-border/40 hover:bg-blue-500/20 active:bg-blue-500/40 transition-colors cursor-col-resize select-none">
          <div className="h-8 w-0.5 rounded-full bg-border group-hover:bg-blue-500 transition-colors" />
        </PanelResizeHandle>

        {/* Right Panel: JSON Viewer (60% default, min 30%) */}
        <Panel defaultSize={60} minSize={30} id="viewer-panel" order={2}>
          <ViewerPanel
            parseResult={parseResult}
            isEmpty={isEmpty}
            onLoadSample={() => onLoadSample(undefined)}
            selectedPath={selectedPath}
            onSelectPath={onSelectPath}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}

