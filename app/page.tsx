import Link from "next/link";
import AppHeader from "@/components/app-header";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
      <AppHeader>
        <ModeToggle />
        <Link
          href="/grid"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Data Grid Demo
        </Link>
        <Button asChild size="sm">
          <Link href="/grid">View Demo</Link>
        </Button>
      </AppHeader>

      <main className="mx-auto max-w-4xl px-4 pt-20 pb-32">
        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-4">
          High-performance data grid
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl max-w-3xl leading-[1.1]">
          A reusable grid built for 10k+ rows with virtualized rendering and
          smooth scroll
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Sortable columns, column filtering, row selection, sticky header, and
          keyboard navigation. TanStack Table + TanStack Virtual. No bloat—just
          the core you need.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <Link href="/grid">View Demo</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Large dataset • Filter bar • Sortable columns • Selected rows count
          </p>
        </div>

        <section className="mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            What’s in the demo
          </h2>
          <ul className="text-muted-foreground space-y-2 max-w-xl mb-8">
            <li>• 10k+ rows with virtualization</li>
            <li>• Sortable columns</li>
            <li>• Row selection with count</li>
            <li>• Sticky header, smooth scroll</li>
            <li>• Keyboard-friendly focus</li>
          </ul>
          <Button asChild variant="outline" size="lg">
            <Link href="/grid">View Demo →</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
