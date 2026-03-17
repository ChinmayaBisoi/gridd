import { Suspense } from "react";
import AppHeader from "@/components/app-header";
import { GridDataTable } from "@/components/grid-data-table";
import { getCachedMockUsers } from "@/lib/mock-users-server";

function GridTableSkeleton() {
  return (
    <div className="space-y-3">
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-[140px] rounded-lg bg-muted animate-pulse" />
        <div className="h-8 w-[130px] rounded-lg bg-muted animate-pulse" />
        <div className="h-8 flex-1 min-w-[200px] rounded-lg bg-muted animate-pulse" />
        <div className="h-8 w-[80px] rounded-lg bg-muted animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="border border-border/40 bg-background overflow-hidden">
        {/* Header */}
        <div className="h-11 bg-primary" />
        {/* Rows */}
        <div className="space-y-px">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 h-[35px]"
            >
              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
              <div
                className="h-3.5 rounded bg-muted animate-pulse"
                style={{ width: `${60 + (i % 3) * 20}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function GridTableLoader() {
  const data = await getCachedMockUsers();
  return <GridDataTable initialData={data} />;
}

export default function GridPage() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 pt-12 pb-20">
        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">
          Data grid demo
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-2">
          10k+ rows, virtualized
        </h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-xl">
          Sort and filter columns, select rows, use keyboard navigation, and
          scroll smoothly through 10k+ rows with virtualization.
        </p>
        <Suspense fallback={<GridTableSkeleton />}>
          <GridTableLoader />
        </Suspense>
      </main>
    </div>
  );
}
