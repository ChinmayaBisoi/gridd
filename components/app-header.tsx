import Link from "next/link";

export default function AppHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="border-b border-border/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
        >
          Gridd
        </Link>
        <nav className="flex items-center gap-6">{children}</nav>
      </div>
    </header>
  );
}
