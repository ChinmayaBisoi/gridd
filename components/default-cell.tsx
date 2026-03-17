import { Cell, flexRender } from "@tanstack/react-table";
import { TableCell } from "./ui/table";

export function DefaultCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  return (
    <TableCell
      key={cell.id}
      style={{
        width: cell.column.getSize(),
        flex: `0 0 ${cell.column.getSize()}px`,
      }}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
    </TableCell>
  );
}
