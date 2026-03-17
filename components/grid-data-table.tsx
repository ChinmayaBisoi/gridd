"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/lib/data";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataGrid } from "@/components/data-grid";
import { useGridSearchParams } from "@/lib/grid-search-params";

const columnHelper = createColumnHelper<User>();

interface GridDataTableProps {
  initialData: User[];
  isLoading?: boolean;
  error?: string | null;
}

export function GridDataTable({
  initialData,
  isLoading = false,
  error = null,
}: GridDataTableProps) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const gridState = useGridSearchParams();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "action",
        header: ({ table }) => (
          <div className="h-full flex items-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="h-full flex items-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 40,
      }),
      columnHelper.accessor("slNo", {
        id: "slNo",
        header: "Sl No",
        enableColumnFilter: false,
        size: 72,
      }),
      columnHelper.accessor("id", {
        header: "ID",
        size: 90,
        cell: ({ getValue }) => (
          <span className="font-mono text-xs truncate block max-w-full" title={getValue()}>
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("firstName", {
        header: "First Name",
        size: 180,
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        size: 180,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        size: 260,
      }),
      columnHelper.accessor("age", {
        header: "Age",
        size: 90,
      }),
      columnHelper.accessor("comments", {
        header: "Comments",
        size: 420,
      }),
      columnHelper.display({
        id: "more",
        header: "",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Paste</DropdownMenuItem>
              <DropdownMenuItem>Cut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
      }),
    ],
    []
  ) as ColumnDef<User, unknown>[];

  const filterableColumns = useMemo(
    () => [
      { id: "firstName", label: "First Name" },
      { id: "lastName", label: "Last Name" },
      { id: "email", label: "Email" },
      { id: "age", label: "Age" },
      { id: "comments", label: "Comments" },
    ],
    []
  );

  return (
    <DataGrid
      columns={columns}
      data={initialData}
      getRowId={(row) => row.id}
      isLoading={isLoading || !hydrated}
      error={error}
      height={400}
      showSelectionSummary
      filterableColumns={filterableColumns}
      controlledState={gridState}
      defaultSorting={[{ id: "slNo", desc: false }]}
    />
  );
}
