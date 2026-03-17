import Link from "next/link";
import { Download, Github, Grid3X3, Heart, Play } from "lucide-react";

export default function AppFooter() {
  return (
    <footer
      data-slot="app-footer"
      className="mt-auto border-t border-border/40 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
            >
              <Grid3X3 className="h-4 w-4" />
              Gridd
            </Link>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              High-performance data grid for React
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            <Link
              href="/grid"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Play className="h-4 w-4" />
              Demo
            </Link>
            <a
              href="https://github.com/your-username/gridd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://gridd01.vercel.app/r/data-grid.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="h-4 w-4" />
              Install
            </a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground inline-flex items-center gap-1">
          <Heart className="size-3 fill-current text-destructive/80" />
          Open source. TanStack Table · TanStack Virtual · shadcn/ui · nuqs.
        </p>
      </div>
    </footer>
  );
}
