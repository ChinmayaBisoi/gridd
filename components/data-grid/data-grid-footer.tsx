"use client";

import type { Row, Table } from "@tanstack/react-table";
import { SelectedIdsCopy } from "./selected-ids-copy";

export type DataGridFooterProps<T> = {
  table: Table<T>;
  totalRowCount: number;
  showSelectedIds?: boolean;
};

export function DataGridFooter<T>({
  table,
  totalRowCount,
  showSelectedIds = true,
}: DataGridFooterProps<T>) {
  const selectedRows = table.getSelectedRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div data-slot="data-grid-footer" className="space-y-1.5">
      <p className="text-sm text-muted-foreground">
        {selectedRows.length} of {filteredCount} rows selected
        {" · "}
        {totalRowCount.toLocaleString()} total rows
      </p>
      {showSelectedIds && selectedRows.length > 0 && (
        <SelectedIdsCopy ids={selectedRows.map((r: Row<T>) => r.id)} />
      )}
    </div>
  );
}
