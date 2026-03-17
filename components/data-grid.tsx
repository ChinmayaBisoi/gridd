"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 35;

type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

type FilterRow = {
  id: string;
  columnId: string;
  operator: FilterOperator;
  value: string;
};

const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
];

function applyOperator(
  cellValue: string,
  operator: FilterOperator,
  query: string
): boolean {
  const cell = cellValue.toLowerCase();
  const q = query.toLowerCase();
  switch (operator) {
    case "contains":
      return cell.includes(q);
    case "equals":
      return cell === q;
    case "startsWith":
      return cell.startsWith(q);
    case "endsWith":
      return cell.endsWith(q);
  }
}

export type DataGridProps<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  isLoading?: boolean;
  error?: string | null;
  height?: number;
  showSelectionSummary?: boolean;
  filterableColumns?: { id: string; label: string }[];
};

export function DataGrid<T>({
  columns,
  data,
  getRowId,
  isLoading,
  error,
  height = 400,
  showSelectionSummary = true,
  filterableColumns = [],
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const [currentColumn, setCurrentColumn] = useState(filterableColumns[0]?.id ?? "");
  const [currentOperator, setCurrentOperator] = useState<FilterOperator>("contains");
  const [currentValue, setCurrentValue] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    if (filterRows.length === 0) return data;
    return data.filter((row) =>
      filterRows.every((f) => {
        if (!f.value.trim()) return true;
        const col = columns.find(
          (c) => "accessorKey" in c && c.accessorKey === f.columnId
        );
        if (!col || !("accessorKey" in col)) return true;
        const cellValue = String(
          (row as Record<string, unknown>)[col.accessorKey as string] ?? ""
        );
        return applyOperator(cellValue, f.operator, f.value);
      })
    );
  }, [data, filterRows, columns]);

  const table = useReactTable<T>({
    data: filteredData,
    columns,
    defaultColumn: {
      filterFn: (row, columnId, filterValue) => {
        const query = String(filterValue ?? "").trim().toLowerCase();
        if (!query) return true;
        return String(row.getValue(columnId) ?? "")
          .toLowerCase()
          .includes(query);
      },
    },
    getRowId: (row, index) => getRowId(row, index),
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalTableWidth = useMemo(
    () => table.getTotalSize(),
    [table.getState().columnSizing, table.getVisibleLeafColumns().length]
  );

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  // --- Keyboard ---
  const focusRowAtIndex = useCallback(
    (targetIndex: number) => {
      if (!rows.length || !tableContainerRef.current) return;
      const bounded = Math.max(0, Math.min(targetIndex, rows.length - 1));
      rowVirtualizer.scrollToIndex(bounded, { align: "auto" });
      requestAnimationFrame(() => {
        const rowEl = tableContainerRef.current?.querySelector<HTMLElement>(
          `[data-row-index="${bounded}"]`
        );
        rowEl?.focus();
      });
    },
    [rowVirtualizer, rows.length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const rowIndexAttr = active?.dataset.rowIndex;
      const currentIndex = rowIndexAttr ? Number(rowIndexAttr) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusRowAtIndex(currentIndex + 1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        focusRowAtIndex(currentIndex < 0 ? 0 : currentIndex - 1);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        focusRowAtIndex(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        focusRowAtIndex(rows.length - 1);
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        if (currentIndex < 0) return;
        e.preventDefault();
        rows[currentIndex]?.toggleSelected();
      }
    },
    [focusRowAtIndex, rows]
  );

  // --- Filter helpers ---
  const addFilter = () => {
    const trimmed = currentValue.trim();
    if (!trimmed || !currentColumn) return;
    setFilterRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        columnId: currentColumn,
        operator: currentOperator,
        value: trimmed,
      },
    ]);
    setCurrentValue("");
  };

  const removeActiveFilter = (id: string) => {
    setFilterRows((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllFilters = () => {
    setFilterRows([]);
  };

  const getColumnLabel = (columnId: string) =>
    filterableColumns.find((c) => c.id === columnId)?.label ?? columnId;

  // --- State screens ---
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
        className="flex items-center justify-center border border-border/40 bg-background"
        style={{ height }}
      >
        Loading…
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center border border-border/40 bg-background text-muted-foreground"
        style={{ height }}
      >
        No rows
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Filter bar ── */}
      {filterableColumns.length > 0 && (
        <div className="space-y-3">
          {/* Single search row */}
          <div className="flex items-center gap-2">
            <Select
              value={currentColumn}
              onValueChange={setCurrentColumn}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterableColumns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentOperator}
              onValueChange={(v) => setCurrentOperator(v as FilterOperator)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addFilter();
              }}
              placeholder={`Filter ${getColumnLabel(currentColumn).toLowerCase()}...`}
              className="flex-1 min-w-[200px]"
            />

            <Button
              type="button"
              size="sm"
              onClick={addFilter}
              className="gap-1.5 shrink-0"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </Button>
          </div>

          {/* Active filter pills */}
          {filterRows.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filterRows.map((f) => (
                <Badge
                  key={f.id}
                  variant="outline"
                  className="h-7 gap-1.5 pl-2.5 pr-1 text-xs"
                >
                  <span className="font-semibold">
                    {getColumnLabel(f.columnId)}
                  </span>
                  <span className="text-muted-foreground">
                    {FILTER_OPERATORS.find((o) => o.value === f.operator)
                      ?.label?.toLowerCase()}
                  </span>
                  <span className="font-mono text-primary">
                    &ldquo;{f.value}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={() => removeActiveFilter(f.id)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filterRows.length > 1 && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div
        className="flex flex-col border border-border/40 bg-background w-fit"
        style={{ maxWidth: "100%", overflowX: "auto" }}
        ref={outerContainerRef}
      >
        <div style={{ width: `${Math.max(totalTableWidth + 10, 100)}px` }}>
          <div className="overflow-hidden">
            <Table
              style={{
                width: `${totalTableWidth}px`,
                tableLayout: "fixed",
              }}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="flex w-full">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          width: header.getSize(),
                          flex: `0 0 ${header.getSize()}px`,
                        }}
                        className="h-11 px-3 text-left align-middle text-sm font-semibold whitespace-nowrap text-primary-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-1.5 h-full",
                              header.column.getCanSort() &&
                                "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="inline-flex shrink-0 text-primary-foreground">
                                {header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ArrowDown className="h-4 w-4" />
                                ) : (
                                  <ChevronsUpDown className="h-4 w-4 opacity-60" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </div>

          <div
            ref={tableContainerRef}
            style={{
              width: `${Math.max(totalTableWidth + 10, 100)}px`,
              height: `${height}px`,
              overflowY: "auto",
              overflowX: "hidden",
            }}
            onWheel={(e) => {
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.stopPropagation();
                if (outerContainerRef.current) {
                  outerContainerRef.current.scrollLeft += e.deltaX;
                }
              }
            }}
            onKeyDown={handleKeyDown}
          >
            <Table
              style={{
                width: `${totalTableWidth}px`,
                tableLayout: "fixed",
              }}
            >
              <TableBody
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualRows.map((virtualItem) => {
                  const row = rows[virtualItem.index];
                  if (!row) return null;
                  return (
                    <TableRow
                      key={virtualItem.key}
                      data-row-index={virtualItem.index}
                      tabIndex={0}
                      className="absolute top-0 left-0 flex w-full items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      data-state={
                        row.getIsSelected() ? "selected" : undefined
                      }
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).closest("button,input")
                        )
                          return;
                        row.toggleSelected();
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            flex: `0 0 ${cell.column.getSize()}px`,
                          }}
                          className="p-3 text-sm text-foreground align-middle whitespace-nowrap"
                        >
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </td>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Footer */}
      {showSelectionSummary && (
        <p className="text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} rows selected
        </p>
      )}
    </div>
  );
}
