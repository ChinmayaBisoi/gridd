import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import AppHeader from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { InstallBlock } from "@/components/install-block";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
      <AppHeader variant="landing" />

      <main className="mx-auto max-w-6xl px-4 pt-20 pb-32">
        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-4">
          Open-source data grid for React
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl max-w-5xl leading-[1.1]">
          10k+ rows, one component, zero&nbsp;config
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-4xl">
          Virtualized rendering, sortable columns, multi-condition filtering,
          row selection, keyboard navigation, and URL state sync. Built on
          TanStack Table + TanStack Virtual. Drop it into any shadcn/ui project
          with a single command.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <Link href="/grid" className="inline-flex items-center gap-1.5">
              View Demo
              <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://github.com/your-username/gridd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
        </div>

        {/* Install */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Install
          </h2>
          <p className="text-muted-foreground mb-4 max-w-xl">
            Add Gridd to your shadcn/ui project. The CLI installs the component,
            its helper hook, all shadcn UI dependencies, and npm packages
            automatically.
          </p>
          <InstallBlock />
        </section>

        {/* Features */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Virtualized scrolling",
                desc: "Renders only visible rows with TanStack Virtual \u2014 smooth at 10k+ rows.",
              },
              {
                title: "Sorting",
                desc: "Click any column header to sort ascending/descending. Multi-column supported.",
              },
              {
                title: "Multi-condition filters",
                desc: "Column + operator (contains, equals, starts with, ends with) + value, stacked as pills.",
              },
              {
                title: "Row selection",
                desc: "Checkbox column, click-to-toggle, select-all. Selection count in footer.",
              },
              {
                title: "Keyboard navigation",
                desc: "Arrow Up/Down, Home, End to move focus. Space/Enter to select.",
              },
              {
                title: "URL state sync",
                desc: "Optional nuqs integration \u2014 sort, filters, and selection sync to the URL for shareable views.",
              },
            ].map((f) => (
              <div key={f.title} className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Button asChild variant="outline" size="lg">
            <Link href="/grid">Try the demo &rarr;</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
