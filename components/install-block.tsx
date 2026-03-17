"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

const INSTALL_CMD =
  "npx shadcn@latest add https://gridd01.vercel.app/r/data-grid.json";

export function InstallBlock() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="group relative max-w-2xl">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 font-mono text-sm">
        <span className="select-none text-muted-foreground">$</span>
        <code className="flex-1 overflow-x-auto whitespace-nowrap text-foreground">
          {INSTALL_CMD}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
