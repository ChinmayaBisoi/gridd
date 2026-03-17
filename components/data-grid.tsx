"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 44;

export type DataGridProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Optional global filter (e.g. search) applied across columns */
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  /** Loading / empty / error - only one should be set */
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  /** Row selection */
  selectedRowIds?: Set<string>;
  onSelectedRowIdsChange?: (ids: Set<string>) => void;
  /** Height of the scroll container (default 500) */
  height?: number;
};

export function DataGrid<T>({
  columns,
  data,
  getRowId,
  globalFilter,
  onGlobalFilterChange,
  isLoading,
  isEmpty,
  error,
  selectedRowIds = new Set(),
  onSelectedRowIdsChange,
  height = 500,
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowSelection = useMemo(() => {
    const sel: Record<string, boolean> = {};
    selectedRowIds.forEach((id) => (sel[id] = true));
    return sel;
  }, [selectedRowIds]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => {
      const r = row as { original?: T; id?: string };
      if (r.original != null) return getRowId(r.original);
      return r.id ?? "";
    },
    state: {
      sorting,
      columnFilters,
      globalFilter: globalFilter ?? undefined,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: onGlobalFilterChange ?? (() => {}),
    onRowSelectionChange: (updater) => {
      const prev: Record<string, boolean> = {};
      selectedRowIds.forEach((id) => (prev[id] = true));
      const next = typeof updater === "function" ? updater(prev) : updater;
      const ids = new Set<string>();
      Object.entries(next).forEach(([id, v]) => v && ids.add(id));
      onSelectedRowIdsChange?.(ids);
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnIds, filterValue) => {
      const s = String(filterValue ?? "").toLowerCase().trim();
      if (!s) return true;
      return row.getVisibleCells().some((cell) =>
        String(cell.getValue() ?? "").toLowerCase().includes(s)
      );
    },
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLTableSectionElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!parentRef.current) return;
      const focusEl = document.activeElement;
      if (!focusEl?.closest("[data-grid-body]")) return;
      const idx = virtualRows.findIndex(
        (v) => (focusEl as HTMLElement).dataset.rowIndex === String(v.index)
      );
      if (idx === -1) return;
      if (e.key === "ArrowDown" && idx < virtualRows.length - 1) {
        e.preventDefault();
        const nextRow = parentRef.current.querySelector(
          `[data-row-index="${virtualRows[idx + 1].index}"]`
        );
        (nextRow as HTMLElement)?.focus();
      } else if (e.key === "ArrowUp" && idx > 0) {
        e.preventDefault();
        const prevRow = parentRef.current.querySelector(
          `[data-row-index="${virtualRows[idx - 1].index}"]`
        );
        (prevRow as HTMLElement)?.focus();
      } else if (e.key === " ") {
        e.preventDefault();
        const row = rows[virtualRows[idx].index];
        if (row) {
          row.toggleSelected();
        }
      }
    },
    [rows, virtualRows]
  );

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive"
        style={{ height }}
      >
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-border bg-muted/30"
        style={{ height }}
      >
        Loading…
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground"
        style={{ height }}
      >
        No rows
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={tableContainerRef}
        className="rounded-lg border border-border w-full min-w-0"
        style={{
          height,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <table
          className="w-full border-collapse table-fixed"
          style={{ width: "max(100%, 800px)", minWidth: 800 }}
        >
          <thead
            className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-backdrop-filter:bg-muted/80 border-b border-border"
            style={{ paddingRight: "var(--scrollbar-gutter-width, 15px)" }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isFlex = (header.column.columnDef.meta as { flex?: boolean } | undefined)?.flex;
                  return (
                  <th
                    key={header.id}
                    className="h-11 px-4 text-left text-sm font-medium text-foreground align-middle"
                    style={{
                      width: isFlex ? undefined : header.getSize(),
                      minWidth: header.getSize(),
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        header.column.getCanSort() && "cursor-pointer select-none"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </div>
                  </th>
                );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            ref={parentRef}
            data-grid-body
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="block focus:outline-none relative"
            style={{
              height: height - HEADER_HEIGHT,
              maxHeight: height - HEADER_HEIGHT,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              position: "relative",
              WebkitOverflowScrolling: "touch",
              scrollbarGutter: "stable",
            }}
          >
            <tr style={{ height: rowVirtualizer.getTotalSize() }} aria-hidden />
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              if (!row) return null;
              return (
                <tr
                  key={row.id}
                  data-row-index={virtualRow.index}
                  tabIndex={0}
                  className={cn(
                    "border-b border-border/50 transition-colors absolute left-0 w-full table-row",
                    row.getIsSelected()
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  )}
                  style={{
                    height: ROW_HEIGHT,
                    top: virtualRow.start,
                    display: "table",
                    tableLayout: "fixed",
                    width: "100%",
                  }}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    row.toggleSelected();
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isFlex = (cell.column.columnDef.meta as { flex?: boolean } | undefined)?.flex;
                    return (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-sm text-foreground align-middle whitespace-nowrap"
                      style={{
                        width: isFlex ? undefined : cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
