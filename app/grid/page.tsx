import AppHeader from "@/components/app-header";
import { GridDataTable } from "@/components/grid-data-table";
import { getCachedMockUsers } from "@/lib/mock-users-server";

export default async function GridPage() {
  const initialData = await getCachedMockUsers();

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
          Sortable columns, row selection, sticky header. Scroll smoothly
          through the dataset.
        </p>
        <GridDataTable initialData={initialData} />
      </main>
    </div>
  );
}
