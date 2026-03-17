"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

export function SelectedIdsCopy({ ids }: { ids: string[] }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(ids.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [ids]);
  const preview =
    ids.length <= 3
      ? ids.join(", ")
      : `${ids.slice(0, 2).join(", ")} +${ids.length - 2} more`;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground">Selected IDs:</span>
      <code className="text-xs font-mono text-foreground/90 bg-muted/60 px-1.5 py-0.5 rounded truncate max-w-md">
        {preview}
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Copy all selected IDs"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy IDs"}
      </button>
    </div>
  );
}
