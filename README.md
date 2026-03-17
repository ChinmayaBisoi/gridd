# Gridd

High-performance, virtualized data grid built for React and Next.js. Sortable columns, multi-column filtering, row selection, keyboard navigation, and optional URL state sync. Designed to drop into any shadcn/ui project or install via the shadcn registry.

**Live demo:** [https://gridd01.vercel.app/grid](https://gridd01.vercel.app/grid)  
**GitHub:** [https://github.com/ChinmayaBisoi/gridd](https://github.com/ChinmayaBisoi/gridd)

---

## Features

- **Virtualized scrolling** — TanStack Virtual; handles 10k+ rows without jank.
- **Sorting** — Click column headers; multi-column sort state supported.
- **Filtering** — Multi-condition filters: column + operator (contains, equals, starts with, ends with) + value; active filters shown as removable pills.
- **Row selection** — Checkbox column, select-all, click row to toggle; selection count in footer.
- **Keyboard** — Arrow Up/Down, Home, End, Space/Enter to select.
- **URL state** — Optional [nuqs](https://nuqs.47ng.com/) integration: sort, filters, and selection sync to the URL for shareable/bookmarkable views and back/forward navigation.
- **Controlled or uncontrolled** — Use internal state only, or pass `controlledState` (e.g. from `useGridSearchParams`) for URL-driven or custom state.
- **Loading & empty states** — Skeleton and empty-state UI when `isLoading` or no data.
- **shadcn registry** — Install in any project with `npx shadcn@latest add https://gridd01.vercel.app/r/data-grid.json`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, shadcn/ui (Radix Nova), Tailwind v4 |
| Table | TanStack Table v8 |
| Virtualization | TanStack Virtual v3 |
| URL state | nuqs v2 |

---

## Getting started

### Prerequisites

- Node 20+
- npm (or pnpm/yarn)

### Install and run (this repo)

```bash
git clone https://github.com/ChinmayaBisoi/gridd.git
cd gridd
npm install
npm run generate-mock   # optional: regenerate lib/mock-users.json (10k rows)
npm run dev
```

The demo is served at **`/grid`** — open [https://gridd01.vercel.app/grid](https://gridd01.vercel.app/grid).

### Install in another project (shadcn registry)

From your Next.js + shadcn project:

```bash
npx shadcn@latest add https://gridd01.vercel.app/r/data-grid.json
```

This adds:

- `components/data-grid/` — `DataGrid` and subcomponents (import from `@/components/data-grid`)
- `lib/grid-search-params.ts` — `useGridSearchParams` hook (for URL state)
- `components/ui/table.tsx` — Table with `scrollContainer` prop (for single scrollbar)
- shadcn dependencies: `table`, `badge`, `button`, `input`, `select`
- npm dependencies: `@tanstack/react-table`, `@tanstack/react-virtual`, `nuqs`

Wrap your app with `NuqsAdapter` (e.g. in `app/layout.tsx`) if you use URL state:

```tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
```

---

## Usage

### Basic (uncontrolled)

DataGrid manages sorting, filters, and selection internally. No URL sync.

```tsx
import { DataGrid } from "@/components/data-grid";
import { createColumnHelper } from "@tanstack/react-table";

type Row = { id: string; name: string; email: string };

const columnHelper = createColumnHelper<Row>();
const columns = [
  columnHelper.accessor("name", { header: "Name", size: 200 }),
  columnHelper.accessor("email", { header: "Email", size: 260 }),
];

const data: Row[] = [/* ... */];

<DataGrid<Row>
  columns={columns}
  data={data}
  getRowId={(row) => row.id}
  height={400}
  filterableColumns={[
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
  ]}
/>
```

### With URL state (controlled)

Use `useGridSearchParams()` and pass its return value as `controlledState`. Sort, filters, and selection are encoded in the URL and survive refresh/back/forward.

```tsx
"use client";

import { DataGrid } from "@/components/data-grid";
import { useGridSearchParams } from "@/lib/grid-search-params";

export function MyTable({ data }) {
  const gridState = useGridSearchParams();

  return (
    <DataGrid
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      filterableColumns={filterableColumns}
      controlledState={gridState}
    />
  );
}
```

---

## API

### `DataGrid<T>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<T, any>[]` | required | TanStack Table column definitions. |
| `data` | `T[]` | required | Row data. |
| `getRowId` | `(row: T, index: number) => string` | required | Stable row id (used for selection and virtualization). |
| `height` | `number` | `400` | Viewport height (px) for the scrollable body. |
| `isLoading` | `boolean` | `false` | When true, shows skeleton instead of table. |
| `error` | `string \| null` | `null` | When set, shows error message instead of table. |
| `showSelectionSummary` | `boolean` | `true` | Footer text: "X of Y rows selected · Z total rows". |
| `filterableColumns` | `{ id: string; label: string }[]` | `[]` | Columns that can be used in the filter bar; `id` should match `accessorKey`. |
| `controlledState` | `DataGridControlledState` | `undefined` | When provided, grid is controlled (sorting, filterRows, rowSelection + setters). Omit for uncontrolled. |

### `DataGridControlledState`

```ts
{
  sorting: SortingState;
  setSorting: (updater: SortingState | ((prev) => SortingState)) => void;
  filterRows: FilterRow[];
  setFilterRows: (updater: FilterRow[] | ((prev) => FilterRow[])) => void;
  rowSelection: Record<string, boolean>;
  setRowSelection: (updater: Record<string, boolean> | ((prev) => Record<string, boolean>)) => void;
}
```

### `useGridSearchParams()`

Returns a `DataGridControlledState` backed by the URL (nuqs). Requires `NuqsAdapter` in the tree.

**URL search params:**

| Param | Example | Description |
|-------|---------|-------------|
| `sort` | `firstName.asc` or `firstName.desc,age.asc` | Column id(s) and direction. |
| `filters` | `firstName.contains.john;email.startsWith.test` | Semicolon-separated: `columnId.operator.value` (value URL-encoded). |
| `selected` | `id1,id2` | Comma-separated row ids (URL-encoded). |

Operators: `contains`, `equals`, `startsWith`, `endsWith`.

---

## Project structure

```
gridd/
├── app/
│   ├── layout.tsx          # NuqsAdapter, theme, fonts
│   ├── page.tsx            # Home
│   └── grid/
│       └── page.tsx        # Demo at /grid — GridDataTable + Suspense
├── components/
│   ├── data-grid/          # DataGrid (split into subcomponents)
│   ├── grid-data-table.tsx # Demo: User columns + useGridSearchParams
│   ├── app-header.tsx
│   └── ui/                 # shadcn primitives
├── lib/
│   ├── data.ts             # User type, createUser
│   ├── grid-search-params.ts  # useGridSearchParams (nuqs)
│   ├── mock-users.json     # 10k rows (git or generate-mock)
│   ├── mock-users-server.ts   # getCachedMockUsers for demo
│   └── utils.ts
├── registry.json           # shadcn registry definition (name: gridd)
├── registry/
│   └── new-york/
│       └── data-grid/
│           ├── data-grid.tsx
│           └── grid-search-params.ts
├── public/
│   └── r/
│       ├── registry.json   # Generated index
│       └── data-grid.json # Generated block (for npx shadcn add)
└── scripts/
    └── generate-mock-users.mjs
```

The **registry** directory is the source for `shadcn build`. The **components/** and **lib/** copies are what the app imports; keep them in sync with the registry when you change the grid (or re-copy from registry after editing).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server. |
| `npm run build` | Production build. |
| `npm run start` | Run production server. |
| `npm run generate-mock` | Regenerate `lib/mock-users.json` with 10k faker users (seed 42). |
| `npm run registry:build` | Run `shadcn build`; writes `public/r/data-grid.json` and `public/r/registry.json`. |
| `npm run lint` | ESLint. |

After changing `registry/new-york/data-grid/*`, run `npm run registry:build` before testing installs from the registry.

---

## Mock data

The demo uses `lib/mock-users.json` (10k rows). Generate or refresh it:

```bash
npm run generate-mock
```

Uses `@faker-js/faker` with seed 42. The file is large; add `lib/mock-users.json` to `.gitignore` if you prefer to generate it in CI or locally only.

---

## Browser support

Modern evergreen (Chrome, Firefox, Safari, Edge). Uses CSS scroll containment and standard DOM/React patterns; no polyfills.

---

## License

See repository license file.
