"use client";

import { flexRender, type Table as TableInstance } from "@tanstack/react-table";
import type { VirtualItem } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type React from "react";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataGridTableProps<T> = {
  table: TableInstance<T>;
  totalTableWidth: number;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  outerContainerRef: React.RefObject<HTMLDivElement | null>;
  virtualRows: VirtualItem[];
  rowVirtualizerTotalSize: number;
  height: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

export function DataGridTable<T>({
  table,
  totalTableWidth,
  tableContainerRef,
  outerContainerRef,
  virtualRows,
  rowVirtualizerTotalSize,
  height,
  onKeyDown,
}: DataGridTableProps<T>) {
  const { rows } = table.getRowModel();

  return (
    <div
      data-slot="data-grid-table"
      className="data-grid-table-scroll border border-primary bg-background overflow-x-auto overflow-y-hidden"
      style={{ maxWidth: "100%", height: `${height}px` }}
      ref={outerContainerRef}
    >
      {/* Inner: fixed width so horizontal scrollbar appears on outer (at bottom) */}
      <div
        style={{
          width: `${totalTableWidth}px`,
          minWidth: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header: no scroll, moves with outer horizontal scroll */}
        <div className="shrink-0">
          <Table
            scrollContainer={false}
            style={{ width: `${totalTableWidth}px`, tableLayout: "fixed" }}
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

        {/* Body: vertical scroll only; horizontal scroll is on outer (bottom) */}
        <div
          ref={tableContainerRef}
          className="data-grid-table-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarGutter: "stable" }}
          onKeyDown={onKeyDown}
          onWheel={(e) => {
            if (
              Math.abs(e.deltaX) > Math.abs(e.deltaY) &&
              outerContainerRef.current
            ) {
              e.preventDefault();
              outerContainerRef.current.scrollLeft += e.deltaX;
            }
          }}
        >
          <Table
            scrollContainer={false}
            style={{ width: `${totalTableWidth}px`, tableLayout: "fixed" }}
          >
            <TableBody
              style={{
                height: `${rowVirtualizerTotalSize}px`,
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
                    data-state={row.getIsSelected() ? "selected" : undefined}
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
  );
}
