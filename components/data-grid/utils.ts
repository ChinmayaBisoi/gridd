import type { FilterOperator } from "./types";

export function applyOperator(
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

export function getColumnLabel(
  columnId: string,
  filterableColumns: { id: string; label: string }[]
): string {
  return filterableColumns.find((c) => c.id === columnId)?.label ?? columnId;
}
