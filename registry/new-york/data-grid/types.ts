import type { ColumnDef } from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";

export const ROW_HEIGHT = 35;

export type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

export type FilterRow = {
  id: string;
  columnId: string;
  operator: FilterOperator;
  value: string;
};

export const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
];

export type DataGridControlledState = {
  sorting: SortingState;
  setSorting: (
    updater: SortingState | ((prev: SortingState) => SortingState)
  ) => void;
  filterRows: FilterRow[];
  setFilterRows: (
    updater: FilterRow[] | ((prev: FilterRow[]) => FilterRow[])
  ) => void;
  rowSelection: Record<string, boolean>;
  setRowSelection: (
    updater:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
};

export type DataGridFilterableColumn = { id: string; label: string };

export type DataGridProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  isLoading?: boolean;
  error?: string | null;
  height?: number;
  showSelectionSummary?: boolean;
  filterableColumns?: DataGridFilterableColumn[];
  controlledState?: DataGridControlledState;
  /** Initial sort; data is also pre-sorted by this so order is stable. */
  defaultSorting?: SortingState;
};
