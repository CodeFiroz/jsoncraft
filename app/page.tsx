"use client";

import * as React from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Workspace } from "@/components/layout/workspace";
import { useJsonParser } from "@/hooks/use-json-parser";
import { useJsonSelection } from "@/hooks/use-json-selection";
import { DEFAULT_JSON_STRING, SAMPLE_JSONS } from "@/lib/json/samples";
import { printConsoleBanner } from "@/lib/console-banner";

export default function HomePage() {
  const [content, setContent] = React.useState<string>(DEFAULT_JSON_STRING);
  const parseResult = useJsonParser(content, 120);
  const { selectedPath, selectPath, resetSelection } = useJsonSelection("$");

  React.useEffect(() => {
    printConsoleBanner();
  }, []);

  const handleLoadSample = (sampleData: any) => {
    const dataToLoad = sampleData !== undefined ? sampleData : SAMPLE_JSONS[0].data;
    setContent(JSON.stringify(dataToLoad, null, 2));
    resetSelection();
  };

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <AppHeader onLoadSample={handleLoadSample} />
      <div className="relative flex-1 overflow-hidden">
        <Workspace
          content={content}
          onChange={setContent}
          parseResult={parseResult}
          onLoadSample={handleLoadSample}
          selectedPath={selectedPath}
          onSelectPath={selectPath}
        />
      </div>
    </main>
  );
}
