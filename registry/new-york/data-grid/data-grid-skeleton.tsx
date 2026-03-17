"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ROW_HEIGHT } from "./types";

export type DataGridSkeletonProps = {
  columns: ColumnDef<unknown, unknown>[];
  height: number;
  hasFilterBar: boolean;
};

export function DataGridSkeleton({
  columns,
  height,
  hasFilterBar,
}: DataGridSkeletonProps) {
  return (
    <div data-slot="data-grid-skeleton" className="space-y-3">
      {hasFilterBar && (
        <div className="flex items-center gap-2">
          <div className="h-8 w-[140px] rounded-lg bg-muted animate-pulse" />
          <div className="h-8 w-[130px] rounded-lg bg-muted animate-pulse" />
          <div className="h-8 flex-1 min-w-[200px] rounded-lg bg-muted animate-pulse" />
          <div className="h-8 w-[80px] rounded-lg bg-primary/20 animate-pulse" />
        </div>
      )}

      <div className="border border-primary bg-background overflow-hidden">
        <div className="h-11 bg-primary flex items-center gap-3 px-3">
          {columns.map((col, i) => (
            <div
              key={i}
              className="h-3.5 rounded bg-primary-foreground/20 animate-pulse"
              style={{
                width: ("size" in col ? (col.size as number) : 150) * 0.5,
              }}
            />
          ))}
        </div>
        <div>
          {Array.from({ length: Math.floor(height / ROW_HEIGHT) }).map(
            (_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 border-b border-border/40"
                style={{ height: ROW_HEIGHT }}
              >
                {columns.map((col, j) => (
                  <div
                    key={j}
                    className="h-3 rounded bg-muted animate-pulse"
                    style={{
                      width:
                        ("size" in col ? (col.size as number) : 150) *
                        (0.4 + ((i + j) % 3) * 0.15),
                      animationDelay: `${(i * columns.length + j) * 30}ms`,
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <div className="h-4 w-40 rounded bg-muted animate-pulse" />
    </div>
  );
}
