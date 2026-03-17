"use client";

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
import { Search, X } from "lucide-react";
import {
  type FilterOperator,
  type FilterRow,
  FILTER_OPERATORS,
} from "./types";
import { getColumnLabel } from "./utils";

export type DataGridFilterBarProps = {
  filterableColumns: { id: string; label: string }[];
  currentColumn: string;
  setCurrentColumn: (v: string) => void;
  currentOperator: FilterOperator;
  setCurrentOperator: (v: FilterOperator) => void;
  currentValue: string;
  setCurrentValue: (v: string) => void;
  filterRows: FilterRow[];
  addFilter: () => void;
  removeActiveFilter: (id: string) => void;
  clearAllFilters: () => void;
};

export function DataGridFilterBar({
  filterableColumns,
  currentColumn,
  setCurrentColumn,
  currentOperator,
  setCurrentOperator,
  currentValue,
  setCurrentValue,
  filterRows,
  addFilter,
  removeActiveFilter,
  clearAllFilters,
}: DataGridFilterBarProps) {
  return (
    <div data-slot="data-grid-filter-bar" className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={currentColumn} onValueChange={setCurrentColumn}>
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
          placeholder={`Filter ${getColumnLabel(currentColumn, filterableColumns).toLowerCase()}...`}
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

      {filterRows.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filterRows.map((f) => (
            <Badge
              key={f.id}
              variant="outline"
              className="h-7 gap-1.5 pl-2.5 pr-1 text-xs"
            >
              <span className="font-semibold">
                {getColumnLabel(f.columnId, filterableColumns)}
              </span>
              <span className="text-muted-foreground">
                {FILTER_OPERATORS.find((o) => o.value === f.operator)?.label?.toLowerCase()}
              </span>
              <span className="font-mono text-primary">&ldquo;{f.value}&rdquo;</span>
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
  );
}
