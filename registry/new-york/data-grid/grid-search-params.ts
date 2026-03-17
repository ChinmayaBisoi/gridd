import {
  createParser,
  useQueryStates,
  type Options,
} from "nuqs";
import type { SortingState } from "@tanstack/react-table";
import { useCallback } from "react";

type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

type FilterRow = {
  id: string;
  columnId: string;
  operator: FilterOperator;
  value: string;
};

const VALID_OPERATORS: FilterOperator[] = [
  "contains",
  "equals",
  "startsWith",
  "endsWith",
];

const sortingParser = createParser<SortingState>({
  parse: (value) => {
    if (!value) return [];
    return value.split(",").map((part) => {
      const [id, dir] = part.split(".");
      return { id, desc: dir === "desc" };
    });
  },
  serialize: (value) =>
    value.map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`).join(","),
  eq: (a, b) =>
    a.length === b.length &&
    a.every((s, i) => s.id === b[i].id && s.desc === b[i].desc),
});

const filtersParser = createParser<FilterRow[]>({
  parse: (value) => {
    if (!value) return [];
    return value.split(";").reduce<FilterRow[]>((acc, part) => {
      const firstDot = part.indexOf(".");
      const secondDot = part.indexOf(".", firstDot + 1);
      if (firstDot === -1 || secondDot === -1) return acc;

      const columnId = part.slice(0, firstDot);
      const operator = part.slice(firstDot + 1, secondDot) as FilterOperator;
      const filterValue = decodeURIComponent(part.slice(secondDot + 1));

      if (!VALID_OPERATORS.includes(operator) || !filterValue) return acc;

      acc.push({
        id: crypto.randomUUID(),
        columnId,
        operator,
        value: filterValue,
      });
      return acc;
    }, []);
  },
  serialize: (value) =>
    value
      .map(
        (f) =>
          `${f.columnId}.${f.operator}.${encodeURIComponent(f.value)}`
      )
      .join(";"),
  eq: (a, b) =>
    a.length === b.length &&
    a.every(
      (f, i) =>
        f.columnId === b[i].columnId &&
        f.operator === b[i].operator &&
        f.value === b[i].value
    ),
});

const selectedParser = createParser<Record<string, boolean>>({
  parse: (value) => {
    if (!value) return {};
    return Object.fromEntries(
      value.split(",").map((id) => [decodeURIComponent(id), true])
    );
  },
  serialize: (value) => {
    const keys = Object.keys(value).filter((k) => value[k]);
    if (keys.length === 0) return "";
    return keys.map(encodeURIComponent).join(",");
  },
  eq: (a, b) => {
    const aKeys = Object.keys(a).filter((k) => a[k]);
    const bKeys = Object.keys(b).filter((k) => b[k]);
    return (
      aKeys.length === bKeys.length && aKeys.every((k) => b[k])
    );
  },
});

const NUQS_OPTIONS: Options = {
  history: "replace",
  shallow: false,
  throttleMs: 300,
};

export function useGridSearchParams() {
  const [params, setParams] = useQueryStates(
    {
      sort: sortingParser.withDefault([]),
      filters: filtersParser.withDefault([]),
      selected: selectedParser.withDefault({}),
    },
    NUQS_OPTIONS
  );

  const setSorting = useCallback(
    (updater: SortingState | ((prev: SortingState) => SortingState)) => {
      setParams((prev) => ({
        sort:
          typeof updater === "function" ? updater(prev.sort) : updater,
      }));
    },
    [setParams]
  );

  const setFilterRows = useCallback(
    (updater: FilterRow[] | ((prev: FilterRow[]) => FilterRow[])) => {
      setParams((prev) => ({
        filters:
          typeof updater === "function"
            ? updater(prev.filters)
            : updater,
      }));
    },
    [setParams]
  );

  const setRowSelection = useCallback(
    (
      updater:
        | Record<string, boolean>
        | ((prev: Record<string, boolean>) => Record<string, boolean>)
    ) => {
      setParams((prev) => ({
        selected:
          typeof updater === "function"
            ? updater(prev.selected)
            : updater,
      }));
    },
    [setParams]
  );

  return {
    sorting: params.sort,
    filterRows: params.filters,
    rowSelection: params.selected,
    setSorting,
    setFilterRows,
    setRowSelection,
  };
}
