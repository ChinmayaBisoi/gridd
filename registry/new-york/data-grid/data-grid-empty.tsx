"use client";

export type DataGridEmptyProps = {
  height: number;
  hasFilterBar: boolean;
};

export function DataGridEmpty({ height, hasFilterBar }: DataGridEmptyProps) {
  return (
    <div data-slot="data-grid-empty" className="space-y-3">
      {hasFilterBar && (
        <div className="flex items-center gap-2 opacity-50 pointer-events-none">
          <div className="h-8 w-[140px] rounded-lg bg-muted" />
          <div className="h-8 w-[130px] rounded-lg bg-muted" />
          <div className="h-8 flex-1 min-w-[200px] rounded-lg bg-muted" />
          <div className="h-8 w-[80px] rounded-lg bg-muted" />
        </div>
      )}
      <div
        className="flex items-center justify-center border border-primary bg-background text-muted-foreground"
        style={{ height }}
      >
        No rows
      </div>
    </div>
  );
}
