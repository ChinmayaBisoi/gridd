"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import { DataGridEmpty } from "./data-grid-empty";
import { DataGridFilterBar } from "./data-grid-filter-bar";
import { DataGridFooter } from "./data-grid-footer";
import { DataGridSkeleton } from "./data-grid-skeleton";
import { DataGridTable } from "./data-grid-table";
import type { DataGridProps, FilterOperator, FilterRow } from "./types";
import { applyOperator } from "./utils";

function getSortKey<T>(columns: ColumnDef<T, unknown>[], columnId: string): string | undefined {
  const col = columns.find(
    (c) => ("id" in c && c.id === columnId) || ("accessorKey" in c && c.accessorKey === columnId)
  );
  if (!col) return undefined;
  return "accessorKey" in col && typeof col.accessorKey === "string"
    ? col.accessorKey
    : "id" in col && typeof col.id === "string"
      ? col.id
      : undefined;
}

export function DataGrid<T>({
  columns,
  data,
  getRowId,
  isLoading,
  error,
  height = 400,
  showSelectionSummary = true,
  filterableColumns = [],
  controlledState,
  defaultSorting,
}: DataGridProps<T>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>(
    () => defaultSorting ?? []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState<
    Record<string, boolean>
  >({});
  const [internalFilterRows, setInternalFilterRows] = useState<FilterRow[]>([]);
  const [currentColumn, setCurrentColumn] = useState(
    filterableColumns[0]?.id ?? ""
  );
  const [currentOperator, setCurrentOperator] = useState<FilterOperator>("contains");
  const [currentValue, setCurrentValue] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  const sorting = controlledState?.sorting ?? internalSorting;
  const setSorting = controlledState?.setSorting ?? setInternalSorting;
  const filterRows = controlledState?.filterRows ?? internalFilterRows;
  const setFilterRows = controlledState?.setFilterRows ?? setInternalFilterRows;
  const rowSelection = controlledState?.rowSelection ?? internalRowSelection;
  const setRowSelection =
    controlledState?.setRowSelection ?? setInternalRowSelection;

  const filteredData = useMemo(() => {
    let result = data;
    if (filterRows.length > 0) {
      result = data.filter((row) =>
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
    }
    const sortSpec = defaultSorting?.[0];
    if (!sortSpec) return result;
    const key = getSortKey(columns, sortSpec.id);
    if (!key) return result;
    return [...result].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[key];
      const bVal = (b as Record<string, unknown>)[key];
      const aNum = typeof aVal === "number" ? aVal : NaN;
      const bNum = typeof bVal === "number" ? bVal : NaN;
      const cmp =
        !Number.isNaN(aNum) && !Number.isNaN(bNum)
          ? aNum - bNum
          : String(aVal ?? "").localeCompare(String(bVal ?? ""), undefined, { numeric: true });
      return sortSpec.desc ? -cmp : cmp;
    });
  }, [data, filterRows, columns, defaultSorting]);

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

  const headerHeight = 44;

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    overscan: 20,
    scrollMargin: headerHeight,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

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

  const addFilter = useCallback(() => {
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
  }, [currentColumn, currentOperator, currentValue, setFilterRows]);

  const removeActiveFilter = useCallback(
    (id: string) => {
      setFilterRows((prev) => prev.filter((f) => f.id !== id));
    },
    [setFilterRows]
  );

  const clearAllFilters = useCallback(() => {
    setFilterRows([]);
  }, [setFilterRows]);

  if (error) {
    return (
      <div
        data-slot="data-grid-error"
        className="flex items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive"
        style={{ height }}
      >
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <DataGridSkeleton
        columns={columns as ColumnDef<unknown, unknown>[]}
        height={height}
        hasFilterBar={filterableColumns.length > 0}
      />
    );
  }

  if (data.length === 0) {
    return (
      <DataGridEmpty
        height={height}
        hasFilterBar={filterableColumns.length > 0}
      />
    );
  }

  return (
    <div data-slot="data-grid" className="space-y-3">
      {filterableColumns.length > 0 && (
        <DataGridFilterBar
          filterableColumns={filterableColumns}
          currentColumn={currentColumn}
          setCurrentColumn={setCurrentColumn}
          currentOperator={currentOperator}
          setCurrentOperator={setCurrentOperator}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          filterRows={filterRows}
          addFilter={addFilter}
          removeActiveFilter={removeActiveFilter}
          clearAllFilters={clearAllFilters}
        />
      )}

      <DataGridTable<T>
        table={table}
        totalTableWidth={totalTableWidth}
        tableContainerRef={tableContainerRef}
        outerContainerRef={outerContainerRef}
        virtualRows={virtualRows}
        rowVirtualizerTotalSize={rowVirtualizer.getTotalSize()}
        scrollMargin={headerHeight}
        height={height}
        onKeyDown={handleKeyDown}
      />

      {showSelectionSummary && (
        <DataGridFooter
          table={table}
          totalRowCount={data.length}
          showSelectedIds
        />
      )}
    </div>
  );
}
