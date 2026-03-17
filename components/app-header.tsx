import Link from "next/link";

import { ModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";

/** Shared nav styles for AppHeader and Navbar */
const navLinkClass =
  "text-sm text-muted-foreground hover:text-foreground transition-colors";

const brandClass =
  "text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors";


type AppHeaderVariant = "landing" | "app";

export default function AppHeader({
  variant = "app",
}: {
  variant?: AppHeaderVariant;
}) {
  return (
    <header className="border-b border-border/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className={brandClass}>
          Gridd
        </Link>
        <nav className="flex items-center gap-6">
          {variant === "landing" ? (
            <>
              <Link href="/grid">
                <Button asChild size="sm">
                  View Demo
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/grid" className={navLinkClass}>
              Data Grid Demo
            </Link>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
